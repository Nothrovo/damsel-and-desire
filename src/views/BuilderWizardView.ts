import {
  getCompendiumEkskul,
  getCompendiumSocialClasses,
  getCompendiumArchetypes,
  getCompendiumAbilities
} from "../api/compendium";
import {
  createCharacterRpc,
  getCharacter,
  updateCharacterDirect
} from "../api/characters";
import { characterStore } from "../store/characterStore";
import {
  calculateAbilityModifier,
  calculatePointBuyTotal,
  isValidStandardArray,
  STANDARD_ARRAY
} from "../services/ruleEngine";
import {
  getGradeForLevel,
  getRestDiceCountForLevel,
  extractAbilityScore,
  getArchetypeStatBonus,
  calculateEffectiveStats,
  checkFeatEligibility,
  takeFeat
} from "../rules/progression";
import { ensureGradeFeatGrants } from "../rules/migration";
import { ALL_FEATS } from "../data/featCompendium";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import type {
  Character,
  CharacterChangeLogEntry,
  CharacterFeatTaken,
  EkskulCompendium,
  SocialClassCompendium,
  ArchetypeCompendium,
  AbilityCompendium,
  FeatDefinition,
  FeatGrant,
  AbilityKey
} from "../types";

const TOTAL_STEPS = 7;

let currentStep = 1;
let isEditMode = false;
let editingChar: Character | null = null;

let compEkskul: EkskulCompendium[] = [];
let compSocial: SocialClassCompendium[] = [];
let compArchetypes: ArchetypeCompendium[] = [];
let compAbilities: AbilityCompendium[] = [];

// Feat UI state in Step 6
let activeFeatSlotTab: "origin" | "general11" | "general12" = "origin";
let featSearchQuery = "";
let featStatFilter = "all";

interface BuilderDraft {
  name: string;
  level: number;
  grade: 10 | 11 | 12;
  campaignId: string;
  avatar: string;
  ekskulId: string;
  subclassId: string;
  socialClassId: string;
  archetypeId: string;
  abilityMethod: "standard" | "pointbuy" | "custom";
  baseAbilities: Record<AbilityKey, number>;
  standardArrayAssigned: Record<AbilityKey, number>;
  pointBuyAssigned: Record<AbilityKey, number>;
  customAssigned: Record<AbilityKey, number>;
  proficientSkills: string[];
  proficientSaves: string[];
  // Feat selections by slot
  originFeatId: string;
  originFeatSkills: string[];
  originFeatSaves: string[];
  originFeatLanguage: string;
  generalFeat11Id: string;
  generalFeat11Skills: string[];
  generalFeat11Saves: string[];
  generalFeat11Language: string;
  generalFeat12Id: string;
  generalFeat12Skills: string[];
  generalFeat12Saves: string[];
  generalFeat12Language: string;
  // Identity & Backstory
  keepsakesText: string;
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
}

function createDefaultDraft(): BuilderDraft {
  return {
    name: "",
    level: 1,
    grade: 10,
    campaignId: "",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki",
    ekskulId: "kendo",
    subclassId: "",
    socialClassId: "medium",
    archetypeId: "delinquent",
    abilityMethod: "standard",
    baseAbilities: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
    standardArrayAssigned: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
    pointBuyAssigned: { physique: 8, intelligent: 8, looks: 8, mind: 8, talent: 8, luck: 8 },
    customAssigned: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
    proficientSkills: ["power", "agility"],
    proficientSaves: ["physique", "mind"],
    originFeatId: "teachers_pet",
    originFeatSkills: [],
    originFeatSaves: [],
    originFeatLanguage: "",
    generalFeat11Id: "",
    generalFeat11Skills: [],
    generalFeat11Saves: [],
    generalFeat11Language: "",
    generalFeat12Id: "",
    generalFeat12Skills: [],
    generalFeat12Saves: [],
    generalFeat12Language: "",
    keepsakesText: "Jimat Omamori Cinta (Kuil)",
    personality: "",
    ideals: "",
    bonds: "",
    flaws: "",
    backstory: ""
  };
}

let draft: BuilderDraft = createDefaultDraft();

function initDraftFromCharacter(char: Character) {
  const statKeys: AbilityKey[] = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
  const rawBase: Record<AbilityKey, number> = {
    physique: extractAbilityScore(char.abilities?.physique),
    intelligent: extractAbilityScore(char.abilities?.intelligent),
    looks: extractAbilityScore(char.abilities?.looks),
    mind: extractAbilityScore(char.abilities?.mind),
    talent: extractAbilityScore(char.abilities?.talent),
    luck: extractAbilityScore(char.abilities?.luck)
  };

  // Subtract any ASI bonuses granted by feats in char.feats so we recover pure base abilities
  const takenFeats = char.feats || [];
  const featSkillsToStrip = new Set<string>();

  let originFeatId = "";
  let originFeatSkills: string[] = [];
  let originFeatSaves: string[] = [];
  let originFeatLanguage = "";

  let generalFeat11Id = "";
  let generalFeat11Skills: string[] = [];
  let generalFeat11Saves: string[] = [];
  let generalFeat11Language = "";

  let generalFeat12Id = "";
  let generalFeat12Skills: string[] = [];
  let generalFeat12Saves: string[] = [];
  let generalFeat12Language = "";

  for (const taken of takenFeats) {
    const featDef = ALL_FEATS.find(f => f.id === taken.featId);
    if (!featDef) continue;

    if (featDef.bonusAbility) {
      const k = featDef.bonusAbility.ability;
      rawBase[k] = Math.max(1, rawBase[k] - featDef.bonusAbility.value);
    }

    if (taken.choices?.skills) {
      taken.choices.skills.forEach(s => featSkillsToStrip.add(s));
    }
    if (featDef.effects?.skillsGranted) {
      featDef.effects.skillsGranted.forEach(s => featSkillsToStrip.add(s));
    }

    if (taken.grantId === "grant_grade_10" || (!originFeatId && featDef.category === "origin")) {
      originFeatId = featDef.id;
      originFeatSkills = [...(taken.choices?.skills || [])];
      originFeatSaves = [...(taken.choices?.saves || [])];
      originFeatLanguage = taken.choices?.language || "";
    } else if (taken.grantId === "grant_grade_11") {
      generalFeat11Id = featDef.id;
      generalFeat11Skills = [...(taken.choices?.skills || [])];
      generalFeat11Saves = [...(taken.choices?.saves || [])];
      generalFeat11Language = taken.choices?.language || "";
    } else if (taken.grantId === "grant_grade_12") {
      generalFeat12Id = featDef.id;
      generalFeat12Skills = [...(taken.choices?.skills || [])];
      generalFeat12Saves = [...(taken.choices?.saves || [])];
      generalFeat12Language = taken.choices?.language || "";
    }
  }

  // Detect ability allocation method
  const scoresList = statKeys.map(k => rawBase[k]);
  let abilityMethod: "standard" | "pointbuy" | "custom" = "custom";
  let standardArrayAssigned: Record<AbilityKey, number> = { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 };
  let pointBuyAssigned: Record<AbilityKey, number> = { physique: 8, intelligent: 8, looks: 8, mind: 8, talent: 8, luck: 8 };

  if (isValidStandardArray(scoresList)) {
    abilityMethod = "standard";
    standardArrayAssigned = { ...rawBase };
  } else if (scoresList.every(s => s >= 8 && s <= 15)) {
    try {
      const pbCost = calculatePointBuyTotal(scoresList);
      if (pbCost <= 27) {
        abilityMethod = "pointbuy";
        pointBuyAssigned = { ...rawBase };
      }
    } catch {
      abilityMethod = "custom";
    }
  }

  // Recover up to 4 base proficient skills
  const allCharSkills = [...(char.proficient_skills || [])];
  let baseSkills = allCharSkills.filter(s => !featSkillsToStrip.has(s));
  if (baseSkills.length === 0 && allCharSkills.length > 0) {
    baseSkills = allCharSkills.slice(0, 4);
  } else if (baseSkills.length > 4) {
    baseSkills = baseSkills.slice(0, 4);
  }

  const level = Math.max(1, Math.min(6, char.level || 1));
  const grade = getGradeForLevel(level);
  const selectedEkskul = compEkskul.find(e => e.id === char.ekskul_id);
  const baseSaves = selectedEkskul?.saving_throws?.length
    ? [...selectedEkskul.saving_throws]
    : [...(char.proficient_saves || ["physique", "mind"])];

  const keepsakesArr = char.inventory?.keepsakes || ["Jimat Omamori Cinta (Kuil)"];

  draft = {
    name: char.name || "",
    level,
    grade,
    campaignId: char.campaign_id || "",
    avatar: char.avatar_path || "https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki",
    ekskulId: char.ekskul_id || "kendo",
    subclassId: char.subclass_id || "",
    socialClassId: char.social_class_id || "medium",
    archetypeId: char.archetype_id || "normies",
    abilityMethod,
    baseAbilities: { ...rawBase },
    standardArrayAssigned,
    pointBuyAssigned,
    customAssigned: { ...rawBase },
    proficientSkills: baseSkills,
    proficientSaves: baseSaves,
    originFeatId: originFeatId || "",
    originFeatSkills,
    originFeatSaves,
    originFeatLanguage,
    generalFeat11Id,
    generalFeat11Skills,
    generalFeat11Saves,
    generalFeat11Language,
    generalFeat12Id,
    generalFeat12Skills,
    generalFeat12Saves,
    generalFeat12Language,
    keepsakesText: Array.isArray(keepsakesArr) ? keepsakesArr.join(", ") : String(keepsakesArr || ""),
    personality: char.backstory_fields?.personality || "",
    ideals: char.backstory_fields?.ideals || "",
    bonds: char.backstory_fields?.bonds || "",
    flaws: char.backstory_fields?.flaws || "",
    backstory: char.backstory_fields?.backstory || ""
  };
}

function getSelectedBaseAbilities(): Record<AbilityKey, number> {
  if (draft.abilityMethod === "standard") return { ...draft.standardArrayAssigned };
  if (draft.abilityMethod === "pointbuy") return { ...draft.pointBuyAssigned };
  return { ...draft.customAssigned };
}

export async function renderBuilderWizardView(params?: Record<string, string>): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  currentStep = 1;
  activeFeatSlotTab = "origin";
  featSearchQuery = "";
  featStatFilter = "all";

  const editId = params?.id || "";
  isEditMode = Boolean(editId);
  editingChar = null;

  appContainer.innerHTML = `
    <section class="view-section active">
      <div class="builder-container" style="max-width:1120px;margin:1.5rem auto;padding:0 1rem;">
        <div style="text-align:center;color:var(--text-muted);padding:3rem;">Memuat data aturan &amp; karakter...</div>
      </div>
    </section>
  `;

  // Fetch Compendiums first
  compEkskul = await getCompendiumEkskul();
  compSocial = await getCompendiumSocialClasses();
  compArchetypes = await getCompendiumArchetypes();
  compAbilities = await getCompendiumAbilities();

  if (isEditMode) {
    const storeChar = characterStore.currentCharacter;
    if (storeChar && storeChar.id === editId) {
      editingChar = storeChar;
    } else {
      editingChar = await getCharacter(editId);
    }
    if (!editingChar) {
      showToast("Karakter tidak ditemukan untuk diedit.", "error");
      router.navigate("/");
      return;
    }
    initDraftFromCharacter(editingChar);
  } else {
    draft = createDefaultDraft();
    const urlParams = new URLSearchParams(window.location.search);
    draft.campaignId = urlParams.get("campaignId") || "";
    const defaultEks = compEkskul.find(e => e.id === draft.ekskulId);
    if (defaultEks?.saving_throws?.length) {
      draft.proficientSaves = [...defaultEks.saving_throws];
    }
  }

  renderWizardShell(appContainer);
}

function renderWizardShell(appContainer: HTMLElement) {
  appContainer.innerHTML = `
    <section class="view-section active">
      <div class="builder-container" style="max-width:1120px;margin:1.5rem auto;padding:0 1rem;">
        
        <!-- Mode Title Banner -->
        <div style="margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <span class="badge" style="background:${isEditMode ? 'rgba(245,158,11,0.18)' : 'rgba(225,29,72,0.18)'};color:${isEditMode ? '#fbbf24' : 'var(--rose-light)'};padding:0.25rem 0.65rem;border-radius:6px;font-weight:800;font-size:0.75rem;">
              ${isEditMode ? '✏️ MODE EDIT KARAKTER LENGKAP' : '✨ PEMBUATAN KARAKTER BARU'}
            </span>
            <span style="font-size:0.82rem;color:var(--text-muted);">
              ${isEditMode ? `Menyunting seluruh aspek dari <strong>${escapeHtml(editingChar?.name || '')}</strong>` : 'Ikuti 7 langkah di bawah untuk membangun murid barumu'}
            </span>
          </div>
        </div>

        <!-- Top Preview Bar -->
        <div class="builder-header-bar" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div class="builder-char-summary" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
            <div class="builder-avatar-preview" id="wizardAvatarBox" style="cursor:pointer;position:relative;" title="Klik untuk mengacak avatar DiceBear">
              <img id="builderAvatarImg" src="${escapeHtml(draft.avatar)}" alt="Avatar" style="width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--rose-primary);">
              <span style="position:absolute;bottom:-2px;right:-2px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:50%;font-size:0.65rem;padding:1px 3px;">🎲</span>
            </div>
            <div>
              <label style="display:block;font-size:0.7rem;color:var(--text-muted);margin-bottom:2px;">Nama Lengkap Murid</label>
              <input type="text" id="builderNameInput" class="input-text" placeholder="Masukkan nama murid..." value="${escapeHtml(draft.name)}" style="font-size:1.05rem;font-weight:700;width:230px;">
            </div>
            <div>
              <label style="display:block;font-size:0.7rem;color:var(--text-muted);margin-bottom:2px;">Tingkat Kelas &amp; Level</label>
              <select id="builderLevelSelect" class="input-text" style="padding:0.42rem 0.65rem;font-size:0.85rem;">
                <option value="1" ${draft.level === 1 ? 'selected' : ''}>Kelas 10 (Sem 1) • Level 1</option>
                <option value="2" ${draft.level === 2 ? 'selected' : ''}>Kelas 10 (Sem 2) • Level 2</option>
                <option value="3" ${draft.level === 3 ? 'selected' : ''}>Kelas 11 (Sem 1) • Level 3</option>
                <option value="4" ${draft.level === 4 ? 'selected' : ''}>Kelas 11 (Sem 2) • Level 4</option>
                <option value="5" ${draft.level === 5 ? 'selected' : ''}>Kelas 12 (Sem 1) • Level 5</option>
                <option value="6" ${draft.level === 6 ? 'selected' : ''}>Kelas 12 (Sem 2) • Level 6</option>
              </select>
            </div>
          </div>

          <div class="builder-quick-nav" style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btnCancelBuilder">Batal</button>
            <button class="btn btn-primary btn-sm" id="btnFinishBuilder">
              ${isEditMode ? '💾 Simpan Perubahan' : '✨ Simpan & Buat Karakter'}
            </button>
          </div>
        </div>

        <!-- Wizard Step Tabs -->
        <div class="wizard-steps-nav" style="display:flex;gap:6px;margin-bottom:1.5rem;overflow-x:auto;padding-bottom:4px;">
          <button class="wizard-step-btn active" data-step="1">1. Ekskul${draft.level >= 3 ? ' & Subclass' : ''}</button>
          <button class="wizard-step-btn" data-step="2">2. Social Class</button>
          <button class="wizard-step-btn" data-step="3">3. Archetype</button>
          <button class="wizard-step-btn" data-step="4">4. Ability Scores</button>
          <button class="wizard-step-btn" data-step="5">5. Keahlian (Skills)</button>
          <button class="wizard-step-btn" data-step="6">6. Pilih Feat ✨</button>
          <button class="wizard-step-btn" data-step="7">7. Identitas &amp; Review</button>
        </div>

        <!-- Step Content Panel -->
        <div id="wizardStepContent" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:2rem;">
        </div>

        <!-- Wizard Navigation Footer -->
        <div style="display:flex;justify-content:space-between;margin-top:1.5rem;">
          <button class="btn btn-secondary" id="btnPrevStep" style="visibility:hidden;">← Langkah Sebelumnya</button>
          <button class="btn btn-primary" id="btnNextStep">Langkah Berikutnya →</button>
        </div>

      </div>
    </section>
  `;

  attachBuilderEvents();
  renderCurrentStep();
}

function attachBuilderEvents() {
  document.getElementById("btnCancelBuilder")?.addEventListener("click", () => {
    if (isEditMode && editingChar) {
      router.navigate(`/characters/${editingChar.id}`);
    } else {
      router.navigate("/");
    }
  });
  document.getElementById("btnFinishBuilder")?.addEventListener("click", () => submitCharacter());

  const nameInput = document.getElementById("builderNameInput") as HTMLInputElement;
  nameInput?.addEventListener("input", (e: any) => { draft.name = e.target.value.trim(); });

  const levelSelect = document.getElementById("builderLevelSelect") as HTMLSelectElement;
  levelSelect?.addEventListener("change", (e: any) => {
    draft.level = Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 1));
    draft.grade = getGradeForLevel(draft.level);
    const step1Btn = document.querySelector('.wizard-step-btn[data-step="1"]');
    if (step1Btn) step1Btn.textContent = `1. Ekskul${draft.level >= 3 ? ' & Subclass' : ''}`;
    renderCurrentStep();
  });

  document.getElementById("wizardAvatarBox")?.addEventListener("click", () => {
    const seed = Math.random().toString(36).substring(7);
    draft.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    const img = document.getElementById("builderAvatarImg") as HTMLImageElement;
    if (img) img.src = draft.avatar;
    const urlInput = document.getElementById("inputDraftAvatarUrl") as HTMLInputElement | null;
    if (urlInput) urlInput.value = draft.avatar;
  });

  document.querySelectorAll(".wizard-step-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const step = parseInt((e.currentTarget as HTMLElement).dataset.step || "1", 10);
      goToStep(step);
    });
  });

  document.getElementById("btnPrevStep")?.addEventListener("click", () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  document.getElementById("btnNextStep")?.addEventListener("click", () => {
    if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
    else submitCharacter();
  });
}

function goToStep(step: number) {
  currentStep = Math.max(1, Math.min(TOTAL_STEPS, step));
  document.querySelectorAll(".wizard-step-btn").forEach((b: any) => {
    b.classList.toggle("active", parseInt(b.dataset.step, 10) === currentStep);
  });

  const prevBtn = document.getElementById("btnPrevStep");
  const nextBtn = document.getElementById("btnNextStep");
  if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";
  if (nextBtn) {
    nextBtn.textContent = currentStep === TOTAL_STEPS
      ? (isEditMode ? "💾 Simpan Perubahan Karakter ✓" : "✨ Simpan & Buat Karakter ✓")
      : "Langkah Berikutnya →";
  }

  renderCurrentStep();
}

function renderCurrentStep() {
  const container = document.getElementById("wizardStepContent");
  if (!container) return;

  switch (currentStep) {
    case 1:
      renderStep1Ekskul(container);
      break;
    case 2:
      renderStep2Social(container);
      break;
    case 3:
      renderStep3Archetype(container);
      break;
    case 4:
      renderStep4Abilities(container);
      break;
    case 5:
      renderStep5Skills(container);
      break;
    case 6:
      renderStep6Feats(container);
      break;
    case 7:
      renderStep7Review(container);
      break;
  }
}

// ----------------------------------------------------------------------------
// STEP 1: EKSKUL & SUBCLASS (IF LEVEL >= 3 / KELAS 11+)
// ----------------------------------------------------------------------------
function renderStep1Ekskul(container: HTMLElement) {
  const selectedEkskul = compEkskul.find(e => e.id === draft.ekskulId);
  const subclasses = selectedEkskul?.subclasses || [];

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 1: Pilih Klub Ekstrakurikuler (Class)</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Ekskul menentukan Hit Die darah, atribut utama, 2 Saving Throw Proficiency, serta 3 Club Moves istimewa karaktermu.</p>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1rem;">
      ${compEkskul.map(e => {
        const savesLabel = (e.saving_throws || []).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ");
        return `
        <div class="card-option ${draft.ekskulId === e.id ? 'active' : ''}" data-ekskul="${e.id}" style="border:1px solid ${draft.ekskulId === e.id ? 'var(--rose-primary)' : 'var(--border-subtle)'};background:var(--bg-surface);border-radius:var(--radius-sm);padding:1rem;cursor:pointer;">
          <h3 style="margin:0 0 4px 0;font-size:1.05rem;color:var(--text-main);">${e.name}</h3>
          <div style="font-size:0.75rem;color:var(--amber-gold);margin-bottom:6px;">${e.tagline || ''}</div>
          <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Hit Die: <strong>${e.hit_die}</strong> • Stat: <strong>${e.primary_stat}</strong></div>
          <div style="font-size:0.75rem;color:var(--rose-light);margin-bottom:8px;">Saving Throws: <strong>${savesLabel || '-'}</strong></div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin:0;">${e.perk_description || ''}</p>
        </div>
      `;}).join("")}
    </div>

    ${draft.level >= 3 && subclasses.length > 0 ? `
      <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);">
        <h3 style="font-family:var(--font-heading);margin:0 0 0.4rem 0;color:var(--amber-gold);">
          🎓 Spesialisasi Subclass (${selectedEkskul?.name || ''}) — Kelas ${draft.grade}
        </h3>
        <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:1rem;">
          Karena karaktermu berada di Kelas ${draft.grade} (Level ${draft.level}), pilih 1 peminatan Subclass di bawah ini:
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1rem;">
          ${subclasses.map(sc => `
            <div class="subclass-card-option ${draft.subclassId === sc.id ? 'active' : ''}" data-subclass="${sc.id}" style="border:2px solid ${draft.subclassId === sc.id ? 'var(--amber-gold)' : 'var(--border-subtle)'};background:var(--bg-surface);border-radius:var(--radius-sm);padding:1.1rem;cursor:pointer;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <h4 style="margin:0;font-size:1rem;color:var(--text-main);">${sc.name}</h4>
                <span class="badge" style="background:rgba(245,158,11,0.15);color:var(--amber-gold);font-size:0.7rem;padding:2px 6px;border-radius:4px;">Subclass</span>
              </div>
              <div style="font-size:0.75rem;color:var(--amber-gold);margin-bottom:6px;">${sc.tagline || ''}</div>
              <p style="font-size:0.78rem;color:var(--text-muted);margin:0 0 8px 0;">${sc.description || sc.identity_desc || ''}</p>
              ${(sc.subclass_moves || []).map(sm => `
                <div style="font-size:0.73rem;background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:4px;margin-top:4px;border-left:2px solid var(--rose-primary);">
                  <strong>Kelas ${sm.unlock_grade || 11} — ${sm.name}:</strong> ${sm.effect || sm.description}
                </div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ''}
  `;

  container.querySelectorAll(".card-option").forEach((card: any) => {
    card.addEventListener("click", () => {
      const nextEks = card.dataset.ekskul;
      if (draft.ekskulId !== nextEks) {
        draft.ekskulId = nextEks;
        draft.subclassId = "";
      }
      const eksObj = compEkskul.find(ek => ek.id === draft.ekskulId);
      if (eksObj && Array.isArray(eksObj.saving_throws) && eksObj.saving_throws.length > 0) {
        draft.proficientSaves = [...eksObj.saving_throws];
      }
      renderStep1Ekskul(container);
    });
  });

  container.querySelectorAll(".subclass-card-option").forEach((scCard: any) => {
    scCard.addEventListener("click", () => {
      draft.subclassId = scCard.dataset.subclass;
      renderStep1Ekskul(container);
    });
  });
}

// ----------------------------------------------------------------------------
// STEP 2: SOCIAL CLASS
// ----------------------------------------------------------------------------
function renderStep2Social(container: HTMLElement) {
  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 2: Social Class (Latar Belakang Ekonomi)</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Menentukan uang saku harian, saldo tabungan awal, serta paket peralatan sekolah.</p>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1rem;">
      ${compSocial.map(s => `
        <div class="card-option ${draft.socialClassId === s.id ? 'active' : ''}" data-social="${s.id}" style="border:1px solid ${draft.socialClassId === s.id ? 'var(--rose-primary)' : 'var(--border-subtle)'};background:var(--bg-surface);border-radius:var(--radius-sm);padding:1rem;cursor:pointer;">
          <h3 style="margin:0 0 4px 0;font-size:1.05rem;">${s.name}</h3>
          <div style="font-size:0.8rem;color:var(--amber-gold);margin-bottom:6px;">Uang Jajan: <strong>${s.daily_allowance}</strong></div>
          <div style="font-size:0.8rem;color:var(--green-health);margin-bottom:8px;">Tabungan Awal: <strong>${s.initial_savings}</strong></div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin:0;">${s.description || ''}</p>
        </div>
      `).join("")}
    </div>
  `;

  container.querySelectorAll(".card-option").forEach((card: any) => {
    card.addEventListener("click", () => {
      draft.socialClassId = card.dataset.social;
      renderStep2Social(container);
    });
  });
}

// ----------------------------------------------------------------------------
// STEP 3: ARCHETYPE
// ----------------------------------------------------------------------------
function renderStep3Archetype(container: HTMLElement) {
  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 3: Archetype (Spesies / Kepribadian Anime)</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Memberikan bonus stat kemampuan alami dan 3 Archetype Moves unik.</p>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1rem;">
      ${compArchetypes.map(a => `
        <div class="card-option ${draft.archetypeId === a.id ? 'active' : ''}" data-arch="${a.id}" style="border:1px solid ${draft.archetypeId === a.id ? 'var(--rose-primary)' : 'var(--border-subtle)'};background:var(--bg-surface);border-radius:var(--radius-sm);padding:1rem;cursor:pointer;">
          <h3 style="margin:0 0 4px 0;font-size:1.05rem;">${a.name}</h3>
          <div style="font-size:0.75rem;color:var(--amber-gold);margin-bottom:6px;">${a.tagline || ''}</div>
          <div style="font-size:0.8rem;color:var(--rose-light);margin-bottom:8px;">Bonus: ${Object.entries(a.stat_bonus || {}).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(", ")}</div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin:0;">${a.perk_description || ''}</p>
        </div>
      `).join("")}
    </div>
  `;

  container.querySelectorAll(".card-option").forEach((card: any) => {
    card.addEventListener("click", () => {
      draft.archetypeId = card.dataset.arch;
      renderStep3Archetype(container);
    });
  });
}

// ----------------------------------------------------------------------------
// STEP 4: ABILITY SCORES (STANDARD ARRAY, POINT BUY, OR MANUAL CUSTOM)
// ----------------------------------------------------------------------------
function renderStep4Abilities(container: HTMLElement) {
  const mode = draft.abilityMethod;
  const scoresObj = getSelectedBaseAbilities();
  const statKeys: AbilityKey[] = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
  const curArch = compArchetypes.find(a => a.id === draft.archetypeId);
  const archBonusMap: Record<string, number> = (curArch?.stat_bonus || getArchetypeStatBonus(draft.archetypeId) || {}) as any;
  const archBonusSummary = Object.entries(archBonusMap).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(", ");

  let pointBuyTotal = 0;
  if (mode === "pointbuy") {
    try {
      pointBuyTotal = calculatePointBuyTotal(statKeys.map(k => scoresObj[k]));
    } catch { pointBuyTotal = 999; }
  }

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 4: Alokasi Nilai Kemampuan (Abilities)</h2>
    ${curArch ? `
      <div style="background:rgba(225,29,72,0.08);border:1px solid rgba(225,29,72,0.3);padding:0.6rem 1rem;border-radius:var(--radius-sm);margin-bottom:1rem;font-size:0.85rem;color:var(--text-main);">
        ✨ <strong>Bonus Archetype (${escapeHtml(curArch.name)}):</strong> <span style="color:var(--rose-light);font-weight:700;">${escapeHtml(archBonusSummary)}</span> <span style="color:var(--text-muted);font-size:0.78rem;">(Otomatis ditambahkan ke nilai akhir &amp; modifier)</span>
      </div>
    ` : ''}
    <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;">
      <button class="btn btn-sm ${mode === 'standard' ? 'btn-primary' : 'btn-secondary'}" id="btnModeStandard">Standard Array [15, 14, 13, 12, 10, 8]</button>
      <button class="btn btn-sm ${mode === 'pointbuy' ? 'btn-primary' : 'btn-secondary'}" id="btnModePointBuy">Point Buy (27 Poin)</button>
      <button class="btn btn-sm ${mode === 'custom' ? 'btn-primary' : 'btn-secondary'}" id="btnModeCustom">Manual / Custom (Bebas)</button>
    </div>

    ${mode === "pointbuy" ? `
      <div style="background:var(--bg-input);padding:0.75rem 1rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.85rem;">Poin Terpakai: <strong style="color:${pointBuyTotal <= 27 ? 'var(--green-health)' : 'var(--rose-primary)'};font-size:1.1rem;">${pointBuyTotal}</strong> / 27</span>
        <span style="font-size:0.75rem;color:var(--text-muted);">Rentang nilai dasar: 8 - 15</span>
      </div>
    ` : mode === "custom" ? `
      <div style="background:var(--bg-input);padding:0.75rem 1rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;font-size:0.82rem;color:var(--text-muted);">
        💡 <strong>Mode Manual / Custom:</strong> Masukkan nilai dasar atribut secara bebas (rentang 1 s/d 24). Bonus Archetype tetap ditambahkan otomatis.
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
      ${statKeys.map(k => {
        const val = scoresObj[k];
        const bonus = archBonusMap[k] || 0;
        const totalVal = val + bonus;
        const mod = calculateAbilityModifier(totalVal);
        const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

        return `
          <div style="background:var(--bg-surface);border:1px solid ${bonus > 0 ? 'rgba(225,29,72,0.4)' : 'var(--border-subtle)'};border-radius:var(--radius-sm);padding:1rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="display:flex;align-items:center;gap:6px;">
                <strong style="font-size:1rem;text-transform:capitalize;">${k}</strong>
                ${bonus > 0 ? `<span style="font-size:0.7rem;background:rgba(225,29,72,0.18);color:var(--rose-light);padding:1px 6px;border-radius:4px;font-weight:700;">+${bonus} Arch</span>` : ''}
              </div>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">
                Total: <strong style="color:var(--text-primary);font-size:0.95rem;">${totalVal}</strong>
                ${bonus > 0 ? `<span style="font-size:0.72rem;">(${val} + ${bonus})</span>` : ''}
                &bull; <span style="color:var(--amber-gold);">Mod: <strong>${modStr}</strong></span>
              </div>
            </div>

            ${mode === "standard" ? `
              <select class="input-text std-select" data-stat="${k}" style="width:100px;text-align:center;">
                ${STANDARD_ARRAY.map(num => `
                  <option value="${num}" ${val === num ? 'selected' : ''}>${num}</option>
                `).join("")}
              </select>
            ` : mode === "pointbuy" ? `
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="btn btn-xs btn-secondary btn-pb-dec" data-stat="${k}">−</button>
                <span style="font-size:1.1rem;font-weight:700;width:30px;text-align:center;">${val}</span>
                <button class="btn btn-xs btn-secondary btn-pb-inc" data-stat="${k}">+</button>
              </div>
            ` : `
              <input type="number" class="input-text custom-stat-input" data-stat="${k}" min="1" max="24" value="${val}" style="width:80px;text-align:center;font-weight:700;">
            `}
          </div>
        `;
      }).join("")}
    </div>
  `;

  document.getElementById("btnModeStandard")?.addEventListener("click", () => {
    draft.abilityMethod = "standard";
    draft.baseAbilities = { ...draft.standardArrayAssigned };
    renderStep4Abilities(container);
  });

  document.getElementById("btnModePointBuy")?.addEventListener("click", () => {
    draft.abilityMethod = "pointbuy";
    draft.baseAbilities = { ...draft.pointBuyAssigned };
    renderStep4Abilities(container);
  });

  document.getElementById("btnModeCustom")?.addEventListener("click", () => {
    draft.customAssigned = { ...getSelectedBaseAbilities() };
    draft.abilityMethod = "custom";
    draft.baseAbilities = { ...draft.customAssigned };
    renderStep4Abilities(container);
  });

  if (mode === "standard") {
    container.querySelectorAll(".std-select").forEach((sel: any) => {
      sel.addEventListener("change", (e: any) => {
        const stat = e.target.dataset.stat as AbilityKey;
        draft.standardArrayAssigned[stat] = parseInt(e.target.value, 10);
        draft.baseAbilities = { ...draft.standardArrayAssigned };
        renderStep4Abilities(container);
      });
    });
  } else if (mode === "pointbuy") {
    container.querySelectorAll(".btn-pb-dec").forEach((btn: any) => {
      btn.addEventListener("click", (e: any) => {
        const stat = e.target.dataset.stat as AbilityKey;
        const cur = draft.pointBuyAssigned[stat];
        if (cur > 8) {
          draft.pointBuyAssigned[stat] = cur - 1;
          draft.baseAbilities = { ...draft.pointBuyAssigned };
          renderStep4Abilities(container);
        }
      });
    });

    container.querySelectorAll(".btn-pb-inc").forEach((btn: any) => {
      btn.addEventListener("click", (e: any) => {
        const stat = e.target.dataset.stat as AbilityKey;
        const cur = draft.pointBuyAssigned[stat];
        if (cur < 15) {
          draft.pointBuyAssigned[stat] = cur + 1;
          draft.baseAbilities = { ...draft.pointBuyAssigned };
          renderStep4Abilities(container);
        }
      });
    });
  } else {
    container.querySelectorAll(".custom-stat-input").forEach((inp: any) => {
      inp.addEventListener("change", (e: any) => {
        const stat = e.target.dataset.stat as AbilityKey;
        const num = Math.max(1, Math.min(24, parseInt(e.target.value, 10) || 10));
        draft.customAssigned[stat] = num;
        draft.baseAbilities = { ...draft.customAssigned };
        renderStep4Abilities(container);
      });
    });
  }
}

// ----------------------------------------------------------------------------
// STEP 5: SKILLS (MAX 4 BASE SKILLS)
// ----------------------------------------------------------------------------
function renderStep5Skills(container: HTMLElement) {
  const chosen = draft.proficientSkills;
  const count = chosen.length;

  // Compute extra skills granted by currently selected Feats so we can show helpful badges
  const featBonusSkills = new Set<string>();
  const addFeatSkills = (featId: string, chosenSkills: string[]) => {
    if (!featId) return;
    const f = ALL_FEATS.find(fd => fd.id === featId);
    f?.effects?.skillsGranted?.forEach(s => featBonusSkills.add(s));
    chosenSkills.forEach(s => featBonusSkills.add(s));
  };
  addFeatSkills(draft.originFeatId, draft.originFeatSkills);
  if (draft.level >= 3) addFeatSkills(draft.generalFeat11Id, draft.generalFeat11Skills);
  if (draft.level >= 5) addFeatSkills(draft.generalFeat12Id, draft.generalFeat12Skills);

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 5: Profisiensi Keahlian Dasar (Skills)</h2>
    <div style="background:var(--bg-input);padding:0.75rem 1rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
      <span style="font-size:0.85rem;">Keahlian Dasar Dipilih: <strong style="color:${count <= 4 ? 'var(--green-health)' : 'var(--rose-primary)'};font-size:1.1rem;">${count}</strong> / 4 (Maksimal)</span>
      <span style="font-size:0.75rem;color:var(--text-muted);">Pilih hingga 4 keahlian dasar di bawah (skill tambahan dari Feat di Langkah 6 akan dijumlahkan otomatis):</span>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
      ${compAbilities.map(ab => `
        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1rem;">
          <h4 style="margin:0 0 8px 0;font-size:0.95rem;color:var(--amber-gold);">${ab.name} (${ab.short_code})</h4>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${(ab.skills || []).map(sk => {
              const isChecked = chosen.includes(sk.id);
              const fromFeat = featBonusSkills.has(sk.id);
              return `
                <label style="display:flex;align-items:flex-start;gap:8px;font-size:0.85rem;cursor:pointer;">
                  <input type="checkbox" class="skill-checkbox" value="${sk.id}" ${isChecked ? 'checked' : ''} style="margin-top:3px;">
                  <div>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <strong>${sk.name}</strong>
                      ${fromFeat ? `<span style="font-size:0.65rem;background:rgba(59,130,246,0.18);color:#60a5fa;padding:1px 5px;border-radius:4px;font-weight:700;">+Dari Feat</span>` : ''}
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">${sk.description}</div>
                  </div>
                </label>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  container.querySelectorAll(".skill-checkbox").forEach((cb: any) => {
    cb.addEventListener("change", (e: any) => {
      const skId = e.target.value;
      if (e.target.checked) {
        if (draft.proficientSkills.length >= 4) {
          e.target.checked = false;
          showToast("Maksimal 4 keahlian dasar! Hapus satu pilihan untuk memilih lainnya.", "warning");
          return;
        }
        draft.proficientSkills.push(skId);
      } else {
        draft.proficientSkills = draft.proficientSkills.filter(id => id !== skId);
      }
      renderStep5Skills(container);
    });
  });
}

// ----------------------------------------------------------------------------
// STEP 6: FEATS (ORIGIN FEAT KELAS 10 + GENERAL FEAT KELAS 11/12)
// ----------------------------------------------------------------------------
function buildCandidateCharForFeatCheck(): Character {
  const baseAbil = getSelectedBaseAbilities();
  return {
    id: editingChar?.id || "draft_char",
    owner_id: editingChar?.owner_id || "public",
    campaign_id: draft.campaignId || null,
    name: draft.name || "Murid Baru",
    ekskul_id: draft.ekskulId,
    subclass_id: draft.subclassId || null,
    social_class_id: draft.socialClassId,
    archetype_id: draft.archetypeId,
    level: draft.level,
    grade: draft.grade,
    abilities: { ...baseAbil },
    proficient_skills: [...draft.proficientSkills],
    proficient_saves: [...draft.proficientSaves],
    vitals: {
      physicalHpCurrent: 10,
      physicalHpMax: 10,
      physicalHpTemp: 0,
      composureCurrent: 10,
      composureMax: 10,
      composureTemp: 0,
      restDiceTotal: getRestDiceCountForLevel(draft.level),
      restDiceSpent: 0,
      heartInspiration: false
    },
    finances: { dailyMoneyAmount: 1000, savingsAmount: 15000, job: "-", jobWageAmount: 0 },
    inventory: { bagItems: [], keepsakes: [] },
    backstory_fields: { personality: "", ideals: "", bonds: "", flaws: "", backstory: "" },
    feats: [],
    featGrants: ensureGradeFeatGrants(draft.grade, []),
    version: editingChar?.version || 1,
    created_at: editingChar?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function getSlotSelectionState(slot: "origin" | "general11" | "general12") {
  if (slot === "origin") {
    return {
      featId: draft.originFeatId,
      skills: draft.originFeatSkills,
      saves: draft.originFeatSaves,
      language: draft.originFeatLanguage,
      category: "origin" as const,
      grade: 10
    };
  }
  if (slot === "general11") {
    return {
      featId: draft.generalFeat11Id,
      skills: draft.generalFeat11Skills,
      saves: draft.generalFeat11Saves,
      language: draft.generalFeat11Language,
      category: "general" as const,
      grade: 11
    };
  }
  return {
    featId: draft.generalFeat12Id,
    skills: draft.generalFeat12Skills,
    saves: draft.generalFeat12Saves,
    language: draft.generalFeat12Language,
    category: "general" as const,
    grade: 12
  };
}

function setSlotSelectionState(
  slot: "origin" | "general11" | "general12",
  updates: Partial<{ featId: string; skills: string[]; saves: string[]; language: string }>
) {
  if (slot === "origin") {
    if (updates.featId !== undefined) draft.originFeatId = updates.featId;
    if (updates.skills !== undefined) draft.originFeatSkills = updates.skills;
    if (updates.saves !== undefined) draft.originFeatSaves = updates.saves;
    if (updates.language !== undefined) draft.originFeatLanguage = updates.language;
  } else if (slot === "general11") {
    if (updates.featId !== undefined) draft.generalFeat11Id = updates.featId;
    if (updates.skills !== undefined) draft.generalFeat11Skills = updates.skills;
    if (updates.saves !== undefined) draft.generalFeat11Saves = updates.saves;
    if (updates.language !== undefined) draft.generalFeat11Language = updates.language;
  } else {
    if (updates.featId !== undefined) draft.generalFeat12Id = updates.featId;
    if (updates.skills !== undefined) draft.generalFeat12Skills = updates.skills;
    if (updates.saves !== undefined) draft.generalFeat12Saves = updates.saves;
    if (updates.language !== undefined) draft.generalFeat12Language = updates.language;
  }
}

function renderStep6Feats(container: HTMLElement) {
  if (activeFeatSlotTab === "general11" && draft.level < 3) activeFeatSlotTab = "origin";
  if (activeFeatSlotTab === "general12" && draft.level < 5) activeFeatSlotTab = "origin";

  const slotState = getSlotSelectionState(activeFeatSlotTab);
  const selectedFeatObj = ALL_FEATS.find(f => f.id === slotState.featId);
  const mockChar = buildCandidateCharForFeatCheck();
  const mockGrant: FeatGrant = {
    id: activeFeatSlotTab === "origin" ? "grant_grade_10" : activeFeatSlotTab === "general11" ? "grant_grade_11" : "grant_grade_12",
    source: "grade",
    grade: slotState.grade as 10 | 11 | 12,
    category: slotState.category,
    featId: null,
    status: "pending"
  };

  const filteredFeats = ALL_FEATS.filter(feat => {
    if (feat.category !== slotState.category) return false;
    if (slotState.category === "general" && featStatFilter !== "all" && feat.subcategory !== featStatFilter) {
      return false;
    }
    if (featSearchQuery) {
      const q = featSearchQuery.toLowerCase();
      const matchName = feat.name.toLowerCase().includes(q);
      const matchDesc = feat.description.toLowerCase().includes(q);
      const matchManual = (feat.manualEffectText || "").toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchManual) return false;
    }
    return true;
  });

  const originFeatName = ALL_FEATS.find(f => f.id === draft.originFeatId)?.name || "Belum dipilih";
  const gen11Name = ALL_FEATS.find(f => f.id === draft.generalFeat11Id)?.name || "Belum dipilih";
  const gen12Name = ALL_FEATS.find(f => f.id === draft.generalFeat12Id)?.name || "Belum dipilih";

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.4rem;">Langkah 6: Pilih Feat Karakter</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.25rem;">
      Setiap murid Kelas 10 berhak memilih <strong>1 Origin Feat</strong> sebagai ciri khas latar belakangnya.${draft.level >= 3 ? ' Karena karakter berada di tingkat kelas atas, kamu juga dapat memilih General Feat untuk Kelas 11/12.' : ''}
    </p>

    <!-- Slot Selector Tabs -->
    <div style="display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;">
      <button type="button" class="btn btn-sm ${activeFeatSlotTab === 'origin' ? 'btn-primary' : 'btn-secondary'}" data-feat-slot="origin">
        ✨ Slot Kelas 10 (Origin): <strong>${escapeHtml(originFeatName)}</strong>
      </button>
      ${draft.level >= 3 ? `
        <button type="button" class="btn btn-sm ${activeFeatSlotTab === 'general11' ? 'btn-primary' : 'btn-secondary'}" data-feat-slot="general11">
          🔥 Slot Kelas 11 (General): <strong>${escapeHtml(gen11Name)}</strong>
        </button>
      ` : ''}
      ${draft.level >= 5 ? `
        <button type="button" class="btn btn-sm ${activeFeatSlotTab === 'general12' ? 'btn-primary' : 'btn-secondary'}" data-feat-slot="general12">
          👑 Slot Kelas 12 (General): <strong>${escapeHtml(gen12Name)}</strong>
        </button>
      ` : ''}
    </div>

    <!-- Search & Filter Bar -->
    <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.85rem 1rem;margin-bottom:1.25rem;display:flex;flex-direction:column;gap:0.65rem;">
      <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
        <input type="text" id="builderFeatSearch" class="input-text" placeholder="🔍 Cari nama feat atau efek..." value="${escapeHtml(featSearchQuery)}" style="flex:1;min-width:220px;font-size:0.85rem;">
        ${selectedFeatObj ? `
          <span style="font-size:0.82rem;color:var(--green-health);font-weight:700;">
            ✓ Dipilih: ${escapeHtml(selectedFeatObj.name)}
          </span>
        ` : `
          <span style="font-size:0.82rem;color:var(--amber-gold);">Pilih salah satu feat di bawah</span>
        `}
      </div>

      ${slotState.category === "general" ? `
        <div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
          <span style="font-size:0.75rem;color:var(--text-muted);font-weight:700;">Filter Stat:</span>
          ${(["all", "physique", "intelligent", "looks", "mind", "talent", "luck"] as const).map(st => `
            <button type="button" class="btn btn-xs ${featStatFilter === st ? 'btn-primary' : 'btn-secondary'} builder-feat-stat-pill" data-stat="${st}">
              ${st === "all" ? "Semua" : st.toUpperCase()}
            </button>
          `).join("")}
        </div>
      ` : ''}
    </div>

    <!-- Feat Cards Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(330px, 1fr));gap:1rem;">
      ${filteredFeats.map(feat => {
        const isSelected = slotState.featId === feat.id;
        const otherTaken =
          (activeFeatSlotTab !== "origin" && draft.originFeatId === feat.id) ||
          (activeFeatSlotTab !== "general11" && draft.generalFeat11Id === feat.id) ||
          (activeFeatSlotTab !== "general12" && draft.generalFeat12Id === feat.id);
        const elig = checkFeatEligibility(mockChar, feat, mockGrant);
        const canPick = !otherTaken && elig.eligible;

        return `
          <div class="builder-feat-card ${isSelected ? 'active' : ''}"
               data-feat-id="${feat.id}"
               data-can-pick="${canPick}"
               style="border:2px solid ${isSelected ? 'var(--rose-primary)' : 'var(--border-subtle)'};background:${isSelected ? 'rgba(225,29,72,0.06)' : 'var(--bg-surface)'};border-radius:var(--radius-sm);padding:1.1rem;cursor:${canPick ? 'pointer' : 'not-allowed'};opacity:${canPick ? '1' : '0.55'};display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;margin-bottom:0.4rem;">
                <div>
                  <div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin-bottom:0.25rem;">
                    <span class="badge" style="font-size:0.65rem;padding:1px 6px;border-radius:4px;background:rgba(59,130,246,0.15);color:#60a5fa;font-weight:700;">
                      ${feat.category.toUpperCase()}
                    </span>
                    ${feat.bonusAbility ? `
                      <span class="badge" style="font-size:0.65rem;padding:1px 6px;border-radius:4px;background:rgba(16,185,129,0.15);color:#34d399;font-weight:700;">
                        +${feat.bonusAbility.value} ${feat.bonusAbility.ability.toUpperCase()}
                      </span>
                    ` : ''}
                  </div>
                  <h4 style="margin:0;font-size:1rem;color:var(--text-main);">${escapeHtml(feat.name)}</h4>
                </div>
                <input type="radio" name="builderFeatRadio" ${isSelected ? 'checked' : ''} ${!canPick ? 'disabled' : ''}>
              </div>

              <p style="font-size:0.82rem;color:var(--text-secondary);margin:0.4rem 0;line-height:1.45;">
                ${escapeHtml(feat.description)}
              </p>

              ${feat.manualEffectText ? `
                <div style="background:rgba(255,255,255,0.03);padding:0.45rem 0.65rem;border-radius:4px;font-size:0.76rem;color:var(--text-muted);border-left:2px solid var(--rose-primary);margin-top:0.4rem;">
                  ${escapeHtml(feat.manualEffectText)}
                </div>
              ` : ''}

              ${(feat.drawbacks?.penaltyText || feat.drawbackText) ? `
                <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);padding:0.4rem 0.6rem;border-radius:4px;font-size:0.74rem;color:#fca5a5;margin-top:0.4rem;">
                  <strong>⚠️ Konsekuensi:</strong> ${escapeHtml(feat.drawbacks?.penaltyText || feat.drawbackText || '')}
                </div>
              ` : ''}

              ${!canPick ? `
                <div style="margin-top:0.45rem;font-size:0.73rem;color:#f87171;">
                  ${otherTaken ? '✗ Sudah dipilih di slot lain' : elig.reasons.map(r => `<div>✗ ${escapeHtml(r)}</div>`).join("")}
                </div>
              ` : ''}
            </div>

            ${isSelected && (feat.choices || feat.id === "transfer_student") ? renderBuilderFeatChoiceBox(feat, slotState) : ''}
          </div>
        `;
      }).join("")}
    </div>
  `;

  // Slot tabs click
  container.querySelectorAll("[data-feat-slot]").forEach((btn: any) => {
    btn.addEventListener("click", () => {
      activeFeatSlotTab = btn.getAttribute("data-feat-slot") as any;
      renderStep6Feats(container);
    });
  });

  // Search input
  const searchInput = document.getElementById("builderFeatSearch") as HTMLInputElement | null;
  searchInput?.addEventListener("input", (e: any) => {
    featSearchQuery = e.target.value || "";
    renderStep6Feats(container);
    const reInput = document.getElementById("builderFeatSearch") as HTMLInputElement | null;
    if (reInput) {
      reInput.focus();
      reInput.setSelectionRange(reInput.value.length, reInput.value.length);
    }
  });

  // Stat filter pills
  container.querySelectorAll(".builder-feat-stat-pill").forEach((pill: any) => {
    pill.addEventListener("click", () => {
      featStatFilter = pill.getAttribute("data-stat") || "all";
      renderStep6Feats(container);
    });
  });

  // Feat card selection
  container.querySelectorAll(".builder-feat-card").forEach((card: any) => {
    card.addEventListener("click", (e: any) => {
      if (e.target.closest(".builder-feat-choice-box")) return;
      const canPick = card.getAttribute("data-can-pick") === "true";
      if (!canPick) return;
      const fId = card.getAttribute("data-feat-id") || "";
      if (slotState.featId !== fId) {
        setSlotSelectionState(activeFeatSlotTab, {
          featId: fId,
          skills: [],
          saves: [],
          language: ""
        });
        renderStep6Feats(container);
      }
    });
  });

  // Choice box listeners
  container.querySelectorAll(".builder-feat-skill-cb").forEach((cb: any) => {
    cb.addEventListener("change", (e: any) => {
      const sk = e.target.value;
      const maxCount = parseInt(cb.getAttribute("data-max-count") || "1", 10);
      let nextSkills = [...slotState.skills];
      if (e.target.checked) {
        if (maxCount === 1) {
          nextSkills = [sk];
        } else if (nextSkills.length >= maxCount) {
          e.target.checked = false;
          showToast(`Maksimal pilih ${maxCount} skill untuk feat ini.`, "warning");
          return;
        } else {
          nextSkills.push(sk);
        }
      } else {
        nextSkills = nextSkills.filter(s => s !== sk);
      }
      setSlotSelectionState(activeFeatSlotTab, { skills: nextSkills });
      renderStep6Feats(container);
    });
  });

  container.querySelectorAll(".builder-feat-save-radio").forEach((rb: any) => {
    rb.addEventListener("change", (e: any) => {
      if (e.target.checked) {
        setSlotSelectionState(activeFeatSlotTab, { saves: [e.target.value] });
        renderStep6Feats(container);
      }
    });
  });

  const langInput = document.getElementById("builderFeatLangInput") as HTMLInputElement | null;
  langInput?.addEventListener("input", (e: any) => {
    setSlotSelectionState(activeFeatSlotTab, { language: e.target.value });
  });
}

function renderBuilderFeatChoiceBox(
  feat: FeatDefinition,
  slotState: { skills: string[]; saves: string[]; language: string }
): string {
  const ch = feat.choices;
  const needsLang = ch?.type === "language" || feat.id === "transfer_student";

  return `
    <div class="builder-feat-choice-box" style="margin-top:0.85rem;padding:0.75rem;background:var(--bg-card);border-radius:var(--radius-xs);border:1px dashed var(--rose-primary);">
      ${ch ? `
        <div style="font-size:0.78rem;font-weight:800;color:var(--rose-light);margin-bottom:0.35rem;">
          ⚙️ Pilihan Wajib Feat (${ch.count} ${ch.type.toUpperCase()}):
        </div>
        <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:0.5rem;">
          ${escapeHtml(ch.description || `Pilih ${ch.count} opsi di bawah:`)}
        </div>
      ` : ''}

      ${ch?.type === "skill" ? `
        <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:0.35rem;">
          ${(ch.pool || []).map(sk => `
            <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.76rem;cursor:pointer;">
              <input type="${ch.count === 1 ? 'radio' : 'checkbox'}"
                     name="builderFeatSkillChoice"
                     class="builder-feat-skill-cb"
                     data-max-count="${ch.count}"
                     value="${sk}"
                     ${slotState.skills.includes(sk) ? 'checked' : ''}>
              <span>${sk.toUpperCase()}</span>
            </label>
          `).join("")}
        </div>
      ` : ch?.type === "save" ? `
        <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:0.35rem;">
          ${(ch.pool || ["physique", "intelligent", "looks", "mind", "talent", "luck"]).map(sv => `
            <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.76rem;cursor:pointer;">
              <input type="radio"
                     name="builderFeatSaveChoice"
                     class="builder-feat-save-radio"
                     value="${sv}"
                     ${slotState.saves.includes(sv) ? 'checked' : ''}>
              <span>${sv.toUpperCase()}</span>
            </label>
          `).join("")}
        </div>
      ` : ''}

      ${needsLang ? `
        <div style="margin-top:${ch?.type === 'skill' ? '0.6rem' : '0'};">
          <label style="display:block;font-size:0.74rem;color:var(--text-muted);margin-bottom:3px;">Bahasa Asing Tambahan (Opsional/Wajib):</label>
          <input type="text" id="builderFeatLangInput" class="input-text" placeholder="misal: Bahasa Jepang, Inggris, Mandarin..." value="${escapeHtml(slotState.language)}" style="width:100%;font-size:0.78rem;padding:0.35rem 0.5rem;">
        </div>
      ` : ''}
    </div>
  `;
}

// ----------------------------------------------------------------------------
// STEP 7: IDENTITY, FULL BACKSTORY & REVIEW
// ----------------------------------------------------------------------------
function buildFinalPreviewCharacter(): Character {
  let candidate = buildCandidateCharForFeatCheck();

  const applySlotFeat = (grantId: string, featId: string, skills: string[], saves: string[], language: string) => {
    if (!featId) return;
    const featDef = ALL_FEATS.find(f => f.id === featId);
    if (!featDef) return;
    const choices: CharacterFeatTaken["choices"] = {};
    if (skills.length > 0) choices.skills = [...skills];
    if (saves.length > 0) choices.saves = [...saves];
    if (language.trim()) choices.language = language.trim();
    try {
      const res = takeFeat(candidate, grantId, featId, choices);
      candidate = res.character;
    } catch {
      // Ignore preview eligibility errors if choices are incomplete
    }
  };

  applySlotFeat("grant_grade_10", draft.originFeatId, draft.originFeatSkills, draft.originFeatSaves, draft.originFeatLanguage);
  if (draft.level >= 3) {
    applySlotFeat("grant_grade_11", draft.generalFeat11Id, draft.generalFeat11Skills, draft.generalFeat11Saves, draft.generalFeat11Language);
  }
  if (draft.level >= 5) {
    applySlotFeat("grant_grade_12", draft.generalFeat12Id, draft.generalFeat12Skills, draft.generalFeat12Saves, draft.generalFeat12Language);
  }

  return candidate;
}

function renderStep7Review(container: HTMLElement) {
  const previewChar = buildFinalPreviewCharacter();
  const effective = calculateEffectiveStats(previewChar);
  const eksObj = compEkskul.find(e => e.id === draft.ekskulId);
  const socObj = compSocial.find(s => s.id === draft.socialClassId);
  const archObj = compArchetypes.find(a => a.id === draft.archetypeId);
  const originFeatObj = ALL_FEATS.find(f => f.id === draft.originFeatId);
  const statKeys: AbilityKey[] = ["physique", "intelligent", "looks", "mind", "talent", "luck"];

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 7: Identitas, Kisah &amp; Tinjauan Akhir</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Lengkapi kepribadian, cita-cita, ikatan, kelemahan, jimat kenangan, serta periksa ringkasan akhir karaktermu.</p>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:1.5rem;align-items:start;">
      <!-- Left Column: Full Identity & Backstory Fields -->
      <div style="display:flex;flex-direction:column;gap:0.85rem;">
        <div class="form-group">
          <label for="inputDraftAvatarUrl" style="font-size:0.82rem;color:var(--text-muted);">URL Avatar Custom (atau klik ikon 🎲 di atas untuk acak):</label>
          <input type="text" id="inputDraftAvatarUrl" class="input-text" value="${escapeHtml(draft.avatar)}" placeholder="https://..." style="width:100%;">
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
          <div class="form-group">
            <label for="inputDraftPersonality" style="font-size:0.82rem;color:var(--text-muted);">Ciri Kepribadian (Personality):</label>
            <textarea id="inputDraftPersonality" class="input-textarea" rows="2" placeholder="misal: Ceria, galak di luar lembut di dalam...">${escapeHtml(draft.personality)}</textarea>
          </div>
          <div class="form-group">
            <label for="inputDraftIdeals" style="font-size:0.82rem;color:var(--text-muted);">Cita-cita / Prinsip (Ideals):</label>
            <textarea id="inputDraftIdeals" class="input-textarea" rows="2" placeholder="misal: Menang turnamen nasional, hidup tenang...">${escapeHtml(draft.ideals)}</textarea>
          </div>
          <div class="form-group">
            <label for="inputDraftBonds" style="font-size:0.82rem;color:var(--text-muted);">Ikatan Penting (Bonds):</label>
            <textarea id="inputDraftBonds" class="input-textarea" rows="2" placeholder="misal: Sahabat masa kecil, janji pada kakak...">${escapeHtml(draft.bonds)}</textarea>
          </div>
          <div class="form-group">
            <label for="inputDraftFlaws" style="font-size:0.82rem;color:var(--text-muted);">Kelemahan (Flaws):</label>
            <textarea id="inputDraftFlaws" class="input-textarea" rows="2" placeholder="misal: Gampang salting kalau dipuji, takut gelap...">${escapeHtml(draft.flaws)}</textarea>
          </div>
        </div>

        <div class="form-group">
          <label for="inputDraftKeepsakes" style="font-size:0.82rem;color:var(--text-muted);">Jimat Kenangan / Keepsakes (pisahkan dengan koma):</label>
          <input type="text" id="inputDraftKeepsakes" class="input-text" value="${escapeHtml(draft.keepsakesText)}" placeholder="misal: Jimat Omamori Cinta (Kuil), Kancing Seragam Senior" style="width:100%;">
        </div>

        <div class="form-group">
          <label for="inputDraftBackstory" style="font-size:0.82rem;color:var(--text-muted);">Kisah Masa Lalu Lengkap (Backstory):</label>
          <textarea id="inputDraftBackstory" class="input-textarea" rows="4" placeholder="Tuliskan latar belakang lengkap karaktermu...">${escapeHtml(draft.backstory)}</textarea>
        </div>
      </div>

      <!-- Right Column: Live Character Summary -->
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-subtle);padding-bottom:0.75rem;">
          <div>
            <h4 style="margin:0;font-size:1.05rem;color:var(--text-main);">📋 Ringkasan Akhir Karakter</h4>
            <span style="font-size:0.78rem;color:var(--text-muted);">Level ${draft.level} (Kelas ${draft.grade}) &bull; Proficiency +${effective.proficiencyBonus}</span>
          </div>
          <div style="text-align:right;font-size:0.8rem;">
            <div style="color:var(--green-health);font-weight:700;">❤️ Physical HP: ${effective.physicalHpMax}</div>
            <div style="color:var(--rose-light);font-weight:700;">💖 Composure: ${effective.composureMax}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.8rem;">
          <div><span style="color:var(--text-muted);">Ekskul:</span> <strong>${escapeHtml(eksObj?.name || draft.ekskulId)}</strong></div>
          <div><span style="color:var(--text-muted);">Archetype:</span> <strong>${escapeHtml(archObj?.name || draft.archetypeId)}</strong></div>
          <div><span style="color:var(--text-muted);">Social Class:</span> <strong>${escapeHtml(socObj?.name || draft.socialClassId)}</strong></div>
          <div><span style="color:var(--text-muted);">Origin Feat:</span> <strong style="color:var(--amber-gold);">${escapeHtml(originFeatObj?.name || 'Belum dipilih')}</strong></div>
        </div>

        <!-- 6 Effective Abilities Preview -->
        <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:0.4rem;text-align:center;">
          ${statKeys.map(k => {
            const score = effective.abilities[k];
            const mod = effective.modifiers[k];
            const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
            return `
              <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:6px;padding:0.45rem 0.25rem;">
                <div style="font-size:0.65rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">${k.slice(0, 3)}</div>
                <div style="font-size:0.95rem;font-weight:800;color:var(--text-main);">${modStr}</div>
                <div style="font-size:0.7rem;color:var(--rose-light);">${score}</div>
              </div>
            `;
          }).join("")}
        </div>

        <div style="font-size:0.78rem;line-height:1.5;color:var(--text-dim);">
          <div><strong>Saving Throws:</strong> ${effective.proficientSaves.map(s => s.toUpperCase()).join(", ")}</div>
          <div><strong>Keahlian (Skills):</strong> ${effective.proficientSkills.map(s => s.toUpperCase()).join(", ") || '-'}</div>
        </div>

        ${!isEditMode ? `
          <div style="border-top:1px solid var(--border-subtle);padding-top:0.75rem;font-size:0.78rem;color:var(--text-muted);">
            📦 <strong>Paket Perlengkapan 3-Layer</strong> (Tas Sekolah Standar + Status Sosial + Alat Ekskul) akan ditambahkan otomatis saat karakter dibuat.
          </div>
        ` : `
          <div style="border-top:1px solid var(--border-subtle);padding-top:0.75rem;font-size:0.78rem;color:var(--amber-gold);">
            ✏️ <strong>Mode Edit Aktif:</strong> Menyimpan perubahan akan langsung memperbarui seluruh stat, saving throws, keahlian, feat, dan kisah karaktermu di lembar karakter.
          </div>
        `}
      </div>
    </div>
  `;

  const avatarUrlInput = document.getElementById("inputDraftAvatarUrl") as HTMLInputElement | null;
  avatarUrlInput?.addEventListener("input", (e: any) => {
    draft.avatar = e.target.value.trim();
    const img = document.getElementById("builderAvatarImg") as HTMLImageElement | null;
    if (img && draft.avatar) img.src = draft.avatar;
  });

  document.getElementById("inputDraftPersonality")?.addEventListener("input", (e: any) => { draft.personality = e.target.value; });
  document.getElementById("inputDraftIdeals")?.addEventListener("input", (e: any) => { draft.ideals = e.target.value; });
  document.getElementById("inputDraftBonds")?.addEventListener("input", (e: any) => { draft.bonds = e.target.value; });
  document.getElementById("inputDraftFlaws")?.addEventListener("input", (e: any) => { draft.flaws = e.target.value; });
  document.getElementById("inputDraftKeepsakes")?.addEventListener("input", (e: any) => { draft.keepsakesText = e.target.value; });
  document.getElementById("inputDraftBackstory")?.addEventListener("input", (e: any) => { draft.backstory = e.target.value; });
}

// ----------------------------------------------------------------------------
// VALIDATE FEAT SLOT HELPER
// ----------------------------------------------------------------------------
function validateFeatSlotChoice(
  featId: string,
  skills: string[],
  saves: string[],
  label: string
): string | null {
  const feat = ALL_FEATS.find(f => f.id === featId);
  if (!feat) return `Harap pilih ${label} terlebih dahulu.`;
  if (feat.choices) {
    if (feat.choices.type === "skill" && skills.length !== feat.choices.count) {
      return `Feat "${feat.name}" mewajibkan memilih ${feat.choices.count} skill (${skills.length}/${feat.choices.count} dipilih).`;
    }
    if (feat.choices.type === "save" && saves.length !== feat.choices.count) {
      return `Feat "${feat.name}" mewajibkan memilih ${feat.choices.count} saving throw.`;
    }
  }
  return null;
}

// ----------------------------------------------------------------------------
// SUBMIT TO SERVER (CREATE OR FULL EDIT UPDATE)
// ----------------------------------------------------------------------------
async function submitCharacter() {
  if (!draft.name.trim()) {
    showToast("Harap masukkan nama karakter terlebih dahulu.", "warning");
    document.getElementById("builderNameInput")?.focus();
    return;
  }

  const baseAbilities = getSelectedBaseAbilities();

  if (draft.abilityMethod === "standard") {
    const scores = Object.values(baseAbilities);
    if (!isValidStandardArray(scores)) {
      showToast("Nilai Standard Array harus terdiri dari [15, 14, 13, 12, 10, 8] unik.", "error");
      goToStep(4);
      return;
    }
  } else if (draft.abilityMethod === "pointbuy") {
    const scores = Object.values(baseAbilities);
    const total = calculatePointBuyTotal(scores);
    if (total > 27) {
      showToast(`Total biaya Point Buy (${total}) melebihi 27 poin!`, "error");
      goToStep(4);
      return;
    }
  }

  if (draft.proficientSkills.length > 4) {
    showToast("Maksimal 4 keahlian dasar yang dapat dipilih di Langkah 5.", "error");
    goToStep(5);
    return;
  }

  if (draft.level >= 3 && !draft.subclassId) {
    showToast(`Karakter Kelas ${draft.grade} wajib memilih Spesialisasi Subclass di Langkah 1.`, "warning");
    goToStep(1);
    return;
  }

  // Validate Origin Feat (Step 6)
  if (!draft.originFeatId) {
    showToast("Harap pilih 1 Origin Feat di Langkah 6.", "warning");
    activeFeatSlotTab = "origin";
    goToStep(6);
    return;
  }
  const originErr = validateFeatSlotChoice(draft.originFeatId, draft.originFeatSkills, draft.originFeatSaves, "Origin Feat (Kelas 10)");
  if (originErr) {
    showToast(originErr, "warning");
    activeFeatSlotTab = "origin";
    goToStep(6);
    return;
  }

  if (draft.level >= 3 && draft.generalFeat11Id) {
    const g11Err = validateFeatSlotChoice(draft.generalFeat11Id, draft.generalFeat11Skills, draft.generalFeat11Saves, "General Feat (Kelas 11)");
    if (g11Err) {
      showToast(g11Err, "warning");
      activeFeatSlotTab = "general11";
      goToStep(6);
      return;
    }
  }

  if (draft.level >= 5 && draft.generalFeat12Id) {
    const g12Err = validateFeatSlotChoice(draft.generalFeat12Id, draft.generalFeat12Skills, draft.generalFeat12Saves, "General Feat (Kelas 12)");
    if (g12Err) {
      showToast(g12Err, "warning");
      activeFeatSlotTab = "general12";
      goToStep(6);
      return;
    }
  }

  const selectedEkskul = compEkskul.find(ek => ek.id === draft.ekskulId);
  if (selectedEkskul && Array.isArray(selectedEkskul.saving_throws) && selectedEkskul.saving_throws.length > 0) {
    draft.proficientSaves = [...selectedEkskul.saving_throws];
  }

  const keepsakesList = draft.keepsakesText
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // Build full character progression state with Feats applied
  const computedChar = buildFinalPreviewCharacter();
  // Preserve any non-grade DM/Achievement feats when in Edit Mode
  if (isEditMode && editingChar) {
    const nonGradeGrants = (editingChar.featGrants || editingChar.feat_grants || []).filter(g => g.source !== "grade");
    const nonGradeGrantIds = new Set(nonGradeGrants.map(g => g.id));
    const nonGradeFeats = (editingChar.feats || []).filter(f => nonGradeGrantIds.has(f.grantId));
    if (nonGradeGrants.length > 0) {
      computedChar.featGrants = [...(computedChar.featGrants || []), ...nonGradeGrants];
      computedChar.feat_grants = computedChar.featGrants;
    }
    if (nonGradeFeats.length > 0) {
      computedChar.feats = [...(computedChar.feats || []), ...nonGradeFeats];
    }
  }

  const effective = calculateEffectiveStats(computedChar);

  if (isEditMode && editingChar) {
    try {
      showToast("Menyimpan seluruh perubahan karakter...", "info");
      const oldHpMax = editingChar.vitals?.physicalHpMax || effective.physicalHpMax;
      const oldCompMax = editingChar.vitals?.composureMax || effective.composureMax;
      const newHpMax = effective.physicalHpMax;
      const newCompMax = effective.composureMax;

      const newVitals = {
        ...editingChar.vitals,
        physicalHpMax: newHpMax,
        physicalHpCurrent: Math.min(newHpMax, Math.max(1, (editingChar.vitals?.physicalHpCurrent ?? oldHpMax) + (newHpMax - oldHpMax))),
        composureMax: newCompMax,
        composureCurrent: Math.min(newCompMax, Math.max(1, (editingChar.vitals?.composureCurrent ?? oldCompMax) + (newCompMax - oldCompMax))),
        restDiceTotal: getRestDiceCountForLevel(draft.level)
      };

      const socObj = compSocial.find(s => s.id === draft.socialClassId);
      const socialChanged = draft.socialClassId !== editingChar.social_class_id;
      const newFinances = {
        ...editingChar.finances,
        dailyMoneyAmount: socialChanged ? (socObj?.daily_amount ?? editingChar.finances?.dailyMoneyAmount ?? 1000) : (editingChar.finances?.dailyMoneyAmount ?? 1000),
        savingsAmount: socialChanged ? (socObj?.savings_amount ?? editingChar.finances?.savingsAmount ?? 15000) : (editingChar.finances?.savingsAmount ?? 15000)
      };

      const newInventory = {
        ...(editingChar.inventory || { bagItems: [] }),
        keepsakes: keepsakesList.length > 0 ? keepsakesList : ["Jimat Omamori Cinta (Kuil)"]
      };

      const newBackstory = {
        personality: draft.personality.trim(),
        ideals: draft.ideals.trim(),
        bonds: draft.bonds.trim(),
        flaws: draft.flaws.trim(),
        backstory: draft.backstory.trim()
      };

      const changelogEntry: CharacterChangeLogEntry = {
        timestamp: new Date().toISOString(),
        action: "EDIT_CHARACTER_FULL",
        description: `Menyunting karakter melalui Full Builder Wizard (${draft.name})`,
        previousValue: {
          name: editingChar.name,
          level: editingChar.level,
          ekskul_id: editingChar.ekskul_id,
          subclass_id: editingChar.subclass_id,
          archetype_id: editingChar.archetype_id,
          social_class_id: editingChar.social_class_id
        },
        newValue: {
          name: draft.name,
          level: draft.level,
          ekskul_id: draft.ekskulId,
          subclass_id: draft.level >= 3 ? (draft.subclassId || null) : null,
          archetype_id: draft.archetypeId,
          social_class_id: draft.socialClassId
        },
        source: "user"
      };

      const updates: Partial<Character> = {
        name: draft.name.trim(),
        avatar_path: draft.avatar,
        level: draft.level,
        grade: draft.grade,
        ekskul_id: draft.ekskulId,
        subclass_id: draft.level >= 3 ? (draft.subclassId || null) : null,
        social_class_id: draft.socialClassId,
        archetype_id: draft.archetypeId,
        abilities: computedChar.abilities,
        proficient_skills: effective.proficientSkills,
        proficient_saves: effective.proficientSaves,
        feats: computedChar.feats,
        featGrants: computedChar.featGrants,
        feat_grants: computedChar.featGrants,
        featUsage: computedChar.featUsage,
        feat_usage: computedChar.featUsage,
        vitals: newVitals,
        finances: newFinances,
        inventory: newInventory,
        backstory_fields: newBackstory,
        changelog: [...(editingChar.changelog || []), changelogEntry]
      };

      const saved = await updateCharacterDirect(editingChar.id, updates, editingChar.version);
      characterStore.currentCharacter = saved;
      showToast(`✓ Perubahan karakter "${saved.name}" berhasil disimpan!`, "success");
      router.navigate(`/characters/${saved.id}`);
    } catch (err: any) {
      showToast(`Gagal menyimpan perubahan: ${err.message}`, "error");
    }
    return;
  }

  // CREATE MODE
  const payload = {
    name: draft.name.trim(),
    level: draft.level,
    grade: draft.grade,
    campaignId: draft.campaignId || null,
    avatar: draft.avatar,
    ekskulId: draft.ekskulId,
    subclassId: draft.level >= 3 ? (draft.subclassId || null) : null,
    socialClassId: draft.socialClassId,
    archetypeId: draft.archetypeId,
    abilityMethod: draft.abilityMethod === "custom" ? "standard" : draft.abilityMethod,
    baseAbilities: computedChar.abilities,
    proficientSkills: effective.proficientSkills,
    proficientSaves: effective.proficientSaves,
    feats: computedChar.feats,
    featGrants: computedChar.featGrants,
    featUsage: computedChar.featUsage,
    keepsakes: keepsakesList.length > 0 ? keepsakesList : ["Jimat Omamori Cinta (Kuil)"],
    personality: draft.personality.trim(),
    ideals: draft.ideals.trim(),
    bonds: draft.bonds.trim(),
    flaws: draft.flaws.trim(),
    backstory: draft.backstory.trim(),
    targets: []
  };

  try {
    showToast("Membuat karakter, menerapkan Feat, dan menyiapkan perlengkapan...", "info");
    let newChar = await createCharacterRpc(payload);

    // Ensure feats, feat_grants, feat_usage, and recalculated vitals are persisted on the newly created record
    const postCreateUpdates: Partial<Character> = {
      level: draft.level,
      grade: draft.grade,
      subclass_id: draft.level >= 3 ? (draft.subclassId || null) : null,
      abilities: computedChar.abilities,
      proficient_skills: effective.proficientSkills,
      proficient_saves: effective.proficientSaves,
      feats: computedChar.feats,
      featGrants: computedChar.featGrants,
      feat_grants: computedChar.featGrants,
      featUsage: computedChar.featUsage,
      feat_usage: computedChar.featUsage,
      vitals: {
        ...newChar.vitals,
        physicalHpMax: effective.physicalHpMax,
        physicalHpCurrent: effective.physicalHpMax,
        composureMax: effective.composureMax,
        composureCurrent: effective.composureMax,
        restDiceTotal: getRestDiceCountForLevel(draft.level)
      }
    };
    try {
      newChar = await updateCharacterDirect(newChar.id, postCreateUpdates, newChar.version);
    } catch {
      Object.assign(newChar, postCreateUpdates);
    }

    showToast(`✓ Karakter "${newChar.name}" berhasil dibuat lengkap dengan Feat awalnya!`, "success");
    router.navigate(`/characters/${newChar.id}`);
  } catch (err: any) {
    showToast(`Gagal membuat karakter: ${err.message}`, "error");
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
