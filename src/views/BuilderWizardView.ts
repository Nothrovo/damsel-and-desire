import {
  getCompendiumEkskul,
  getCompendiumSocialClasses,
  getCompendiumArchetypes,
  getCompendiumAbilities
} from "../api/compendium";
import { createCharacterRpc } from "../api/characters";
import {
  calculateAbilityModifier,
  calculatePointBuyTotal,
  isValidStandardArray,
  STANDARD_ARRAY,
  POINT_BUY_COSTS
} from "../services/ruleEngine";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import type {
  EkskulCompendium,
  SocialClassCompendium,
  ArchetypeCompendium,
  AbilityCompendium
} from "../types";

let currentStep = 1;
let compEkskul: EkskulCompendium[] = [];
let compSocial: SocialClassCompendium[] = [];
let compArchetypes: ArchetypeCompendium[] = [];
let compAbilities: AbilityCompendium[] = [];

// Draft State
let draft = {
  name: "",
  grade: 1,
  campaignId: "",
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki",
  ekskulId: "kendo",
  subclassId: "",
  socialClassId: "medium",
  archetypeId: "delinquent",
  abilityMethod: "standard" as "standard" | "pointbuy",
  baseAbilities: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
  standardArrayAssigned: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
  pointBuyAssigned: { physique: 8, intelligent: 8, looks: 8, mind: 8, talent: 8, luck: 8 },
  proficientSkills: ["power", "agility"],
  proficientSaves: ["physique", "mind"],
  keepsakes: ["Jimat Omamori Cinta (Kuil)"],
  personality: "",
  ideals: "",
  bonds: "",
  flaws: "",
  backstory: "",
  targets: []
};

export async function renderBuilderWizardView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  draft.campaignId = urlParams.get("campaignId") || "";

  appContainer.innerHTML = `
    <section class="view-section active">
      <div class="builder-container" style="max-width:1100px;margin:1.5rem auto;padding:0 1rem;">
        
        <!-- Top Preview Bar -->
        <div class="builder-header-bar" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div class="builder-char-summary" style="display:flex;align-items:center;gap:1rem;">
            <div class="builder-avatar-preview" id="wizardAvatarBox" style="cursor:pointer;" title="Klik untuk mengacak avatar">
              <img id="builderAvatarImg" src="${draft.avatar}" alt="Avatar" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--rose-primary);">
            </div>
            <div>
              <input type="text" id="builderNameInput" class="input-text" placeholder="Masukkan nama murid..." value="${draft.name}" style="font-size:1.1rem;font-weight:700;width:240px;">
            </div>
            <div>
              <select id="builderGradeSelect" class="input-text" style="padding:0.4rem 0.6rem;font-size:0.85rem;">
                <option value="1">Kelas 10 (Sem 1) • Level 1</option>
                <option value="2">Kelas 10 (Sem 2) • Level 2</option>
              </select>
            </div>
          </div>

          <div class="builder-quick-nav" style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" id="btnCancelBuilder">Batal</button>
            <button class="btn btn-primary btn-sm" id="btnFinishBuilder">Simpan & Selesai</button>
          </div>
        </div>

        <!-- Wizard Step Tabs -->
        <div class="wizard-steps-nav" style="display:flex;gap:8px;margin-bottom:1.5rem;overflow-x:auto;">
          <button class="wizard-step-btn active" data-step="1">1. Ekskul (Class)</button>
          <button class="wizard-step-btn" data-step="2">2. Social Class</button>
          <button class="wizard-step-btn" data-step="3">3. Archetype</button>
          <button class="wizard-step-btn" data-step="4">4. Ability Scores</button>
          <button class="wizard-step-btn" data-step="5">5. Keahlian (Skills)</button>
          <button class="wizard-step-btn" data-step="6">6. Identitas & Review</button>
        </div>

        <!-- Step Content Panel -->
        <div id="wizardStepContent" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:2rem;">
          <div style="text-align:center;color:var(--text-muted);padding:2rem;">Memuat data aturan...</div>
        </div>

        <!-- Wizard Navigation Footer -->
        <div style="display:flex;justify-content:space-between;margin-top:1.5rem;">
          <button class="btn btn-secondary" id="btnPrevStep" style="visibility:hidden;">← Langkah Sebelumnya</button>
          <button class="btn btn-primary" id="btnNextStep">Langkah Berikutnya →</button>
        </div>

      </div>
    </section>
  `;

  // Fetch Compendiums
  compEkskul = await getCompendiumEkskul();
  compSocial = await getCompendiumSocialClasses();
  compArchetypes = await getCompendiumArchetypes();
  compAbilities = await getCompendiumAbilities();

  attachBuilderEvents();
  renderCurrentStep();
}

function attachBuilderEvents() {
  document.getElementById("btnCancelBuilder")?.addEventListener("click", () => router.navigate("/"));
  document.getElementById("btnFinishBuilder")?.addEventListener("click", () => submitCharacter());

  const nameInput = document.getElementById("builderNameInput") as HTMLInputElement;
  nameInput?.addEventListener("input", (e: any) => { draft.name = e.target.value.trim(); });

  const gradeSelect = document.getElementById("builderGradeSelect") as HTMLSelectElement;
  gradeSelect?.addEventListener("change", (e: any) => { draft.grade = parseInt(e.target.value) || 1; });

  document.getElementById("wizardAvatarBox")?.addEventListener("click", () => {
    const seed = Math.random().toString(36).substring(7);
    draft.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    const img = document.getElementById("builderAvatarImg") as HTMLImageElement;
    if (img) img.src = draft.avatar;
  });

  document.querySelectorAll(".wizard-step-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const step = parseInt((e.currentTarget as HTMLElement).dataset.step || "1");
      goToStep(step);
    });
  });

  document.getElementById("btnPrevStep")?.addEventListener("click", () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  });

  document.getElementById("btnNextStep")?.addEventListener("click", () => {
    if (currentStep < 6) goToStep(currentStep + 1);
    else submitCharacter();
  });
}

function goToStep(step: number) {
  currentStep = step;
  document.querySelectorAll(".wizard-step-btn").forEach((b: any) => {
    b.classList.toggle("active", parseInt(b.dataset.step) === step);
  });

  const prevBtn = document.getElementById("btnPrevStep");
  const nextBtn = document.getElementById("btnNextStep");
  if (prevBtn) prevBtn.style.visibility = step === 1 ? "hidden" : "visible";
  if (nextBtn) nextBtn.textContent = step === 6 ? "Simpan & Buat Karakter ✓" : "Langkah Berikutnya →";

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
      renderStep6Review(container);
      break;
  }
}

// ----------------------------------------------------------------------------
// STEP 1: EKSKUL
// ----------------------------------------------------------------------------
function renderStep1Ekskul(container: HTMLElement) {
  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 1: Pilih Klub Ekstrakurikuler (Class)</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Ekskul menentukan Hit Die darah, atribut utama, serta 3 Club Moves istimewa karaktermu.</p>
    
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1rem;">
      ${compEkskul.map(e => `
        <div class="card-option ${draft.ekskulId === e.id ? 'active' : ''}" data-ekskul="${e.id}" style="border:1px solid ${draft.ekskulId === e.id ? 'var(--rose-primary)' : 'var(--border-subtle)'};background:var(--bg-surface);border-radius:var(--radius-sm);padding:1rem;cursor:pointer;">
          <h3 style="margin:0 0 4px 0;font-size:1.05rem;color:var(--text-main);">${e.name}</h3>
          <div style="font-size:0.75rem;color:var(--amber-gold);margin-bottom:6px;">${e.tagline || ''}</div>
          <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:8px;">Hit Die: <strong>${e.hit_die}</strong> • Stat: <strong>${e.primary_stat}</strong></div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin:0;">${e.perk_description || ''}</p>
        </div>
      `).join("")}
    </div>
  `;

  container.querySelectorAll(".card-option").forEach((card: any) => {
    card.addEventListener("click", () => {
      draft.ekskulId = card.dataset.ekskul;
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
          <div style="font-size:0.8rem;color:var(--rose-light);margin-bottom:8px;">Bonus: ${Object.entries(a.stat_bonus).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(", ")}</div>
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
// STEP 4: ABILITY SCORES (STANDARD ARRAY & POINT BUY)
// ----------------------------------------------------------------------------
function renderStep4Abilities(container: HTMLElement) {
  const isStd = draft.abilityMethod === "standard";
  const scoresObj: any = isStd ? draft.standardArrayAssigned : draft.pointBuyAssigned;
  const statKeys = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
  let pointBuyTotal = 0;
  if (!isStd) {
    try {
      pointBuyTotal = calculatePointBuyTotal(statKeys.map(k => scoresObj[k]));
    } catch { pointBuyTotal = 999; }
  }

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 4: Alokasi Nilai Kemampuan (Abilities)</h2>
    <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.5rem;">
      <button class="btn btn-sm ${isStd ? 'btn-primary' : 'btn-secondary'}" id="btnModeStandard">Standard Array [15, 14, 13, 12, 10, 8]</button>
      <button class="btn btn-sm ${!isStd ? 'btn-primary' : 'btn-secondary'}" id="btnModePointBuy">Point Buy (27 Poin)</button>
    </div>

    ${!isStd ? `
      <div style="background:var(--bg-input);padding:0.75rem 1rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.85rem;">Poin Terpakai: <strong style="color:${pointBuyTotal <= 27 ? 'var(--green-health)' : 'var(--rose-primary)'};font-size:1.1rem;">${pointBuyTotal}</strong> / 27</span>
        <span style="font-size:0.75rem;color:var(--text-muted);">Rentang nilai: 8 - 15</span>
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
      ${statKeys.map(k => {
        const val = scoresObj[k];
        const mod = calculateAbilityModifier(val);
        const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

        return `
          <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong style="font-size:1rem;text-transform:capitalize;">${k}</strong>
              <div style="font-size:0.8rem;color:var(--amber-gold);">Mod: <strong>${modStr}</strong></div>
            </div>

            ${isStd ? `
              <select class="input-text std-select" data-stat="${k}" style="width:100px;text-align:center;">
                ${STANDARD_ARRAY.map(num => `
                  <option value="${num}" ${val === num ? 'selected' : ''}>${num}</option>
                `).join("")}
              </select>
            ` : `
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="btn btn-xs btn-secondary btn-pb-dec" data-stat="${k}">−</button>
                <span style="font-size:1.1rem;font-weight:700;width:30px;text-align:center;">${val}</span>
                <button class="btn btn-xs btn-secondary btn-pb-inc" data-stat="${k}">+</button>
              </div>
            `}
          </div>
        `;
      }).join("")}
    </div>
  `;

  document.getElementById("btnModeStandard")?.addEventListener("click", () => {
    draft.abilityMethod = "standard";
    renderStep4Abilities(container);
  });

  document.getElementById("btnModePointBuy")?.addEventListener("click", () => {
    draft.abilityMethod = "pointbuy";
    renderStep4Abilities(container);
  });

  if (isStd) {
    container.querySelectorAll(".std-select").forEach((sel: any) => {
      sel.addEventListener("change", (e: any) => {
        const stat = e.target.dataset.stat;
        (draft.standardArrayAssigned as any)[stat] = parseInt(e.target.value);
        draft.baseAbilities = { ...draft.standardArrayAssigned };
        renderStep4Abilities(container);
      });
    });
  } else {
    container.querySelectorAll(".btn-pb-dec").forEach((btn: any) => {
      btn.addEventListener("click", (e: any) => {
        const stat = e.target.dataset.stat;
        const cur = (draft.pointBuyAssigned as any)[stat];
        if (cur > 8) {
          (draft.pointBuyAssigned as any)[stat] = cur - 1;
          draft.baseAbilities = { ...draft.pointBuyAssigned };
          renderStep4Abilities(container);
        }
      });
    });

    container.querySelectorAll(".btn-pb-inc").forEach((btn: any) => {
      btn.addEventListener("click", (e: any) => {
        const stat = e.target.dataset.stat;
        const cur = (draft.pointBuyAssigned as any)[stat];
        if (cur < 15) {
          (draft.pointBuyAssigned as any)[stat] = cur + 1;
          draft.baseAbilities = { ...draft.pointBuyAssigned };
          renderStep4Abilities(container);
        }
      });
    });
  }
}

// ----------------------------------------------------------------------------
// STEP 5: SKILLS (MAX 4)
// ----------------------------------------------------------------------------
function renderStep5Skills(container: HTMLElement) {
  const chosen = draft.proficientSkills;
  const count = chosen.length;

  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 5: Profisiensi Keahlian (Skills)</h2>
    <div style="background:var(--bg-input);padding:0.75rem 1rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:0.85rem;">Keahlian Dipilih: <strong style="color:${count <= 4 ? 'var(--green-health)' : 'var(--rose-primary)'};font-size:1.1rem;">${count}</strong> / 4 (Maksimal)</span>
      <span style="font-size:0.75rem;color:var(--text-muted);">Pilih hingga 4 keahlian di bawah:</span>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
      ${compAbilities.map(ab => `
        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1rem;">
          <h4 style="margin:0 0 8px 0;font-size:0.95rem;color:var(--amber-gold);">${ab.name} (${ab.short_code})</h4>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${(ab.skills || []).map(sk => {
              const isChecked = chosen.includes(sk.id);
              return `
                <label style="display:flex;align-items:flex-start;gap:8px;font-size:0.85rem;cursor:pointer;">
                  <input type="checkbox" class="skill-checkbox" value="${sk.id}" ${isChecked ? 'checked' : ''} style="margin-top:3px;">
                  <div>
                    <strong>${sk.name}</strong>
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
          showToast("Maksimal 4 keahlian! Hapus satu pilihan untuk memilih lainnya.", "warning");
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
// STEP 6: IDENTITY & REVIEW
// ----------------------------------------------------------------------------
function renderStep6Review(container: HTMLElement) {
  container.innerHTML = `
    <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Langkah 6: Identitas & Tinjauan Akhir</h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Lengkapi kepribadian, pilih jimat kenangan, dan periksa ringkasan karaktermu sebelum disimpan.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start;">
      <div>
        <div class="form-group" style="margin-bottom:1rem;">
          <label for="inputDraftPersonality">Ciri Khas Kepribadian (Personality):</label>
          <input type="text" id="inputDraftPersonality" class="input-text" value="${escapeHtml(draft.personality)}" placeholder="misal: Ceria, suka ngelamun, malu-malu kucing...">
        </div>
        <div class="form-group" style="margin-bottom:1rem;">
          <label for="inputDraftBackstory">Kisah Masa Lalu (Backstory):</label>
          <textarea id="inputDraftBackstory" class="input-textarea" rows="4" placeholder="Tuliskan latar belakang karaktermu...">${escapeHtml(draft.backstory)}</textarea>
        </div>
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1.25rem;">
        <h4 style="margin:0 0 10px 0;font-size:0.95rem;color:var(--rose-light);">📦 Paket Perlengkapan 3-Layer Otomatis:</h4>
        <ul style="font-size:0.8rem;color:var(--text-dim);margin:0;padding-left:1.2rem;line-height:1.6;">
          <li><strong>Layer 1:</strong> Tas Sekolah Standar (Buku Pelajaran, Alat Tulis, Smartphone, Payung)</li>
          <li><strong>Layer 2:</strong> Perlengkapan Khas Status Sosial (${draft.socialClassId})</li>
          <li><strong>Layer 3:</strong> Alat Khusus Ekskul (${draft.ekskulId})</li>
        </ul>
        <div style="margin-top:1rem;font-size:0.8rem;color:var(--amber-gold);">
          ✓ Dihasilkan secara otomatis oleh server saat karakter dibuat.
        </div>
        <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border-subtle);font-size:0.8rem;color:var(--text-muted);">
          ✨ <strong>Slot Origin Feat (Kelas 10):</strong> Karakter akan mendapatkan 1 slot Origin Feat yang dapat kamu pilih di tab <em>FEATS &amp; ACHIEVEMENTS</em> lembar karakter.
        </div>
      </div>
    </div>
  `;

  const persInput = document.getElementById("inputDraftPersonality") as HTMLInputElement;
  persInput?.addEventListener("input", (e: any) => { draft.personality = e.target.value; });

  const bsInput = document.getElementById("inputDraftBackstory") as HTMLTextAreaElement;
  bsInput?.addEventListener("input", (e: any) => { draft.backstory = e.target.value; });
}

// ----------------------------------------------------------------------------
// SUBMIT TO SERVER
// ----------------------------------------------------------------------------
async function submitCharacter() {
  if (!draft.name) {
    showToast("Harap masukkan nama karakter terlebih dahulu.", "warning");
    goToStep(6);
    return;
  }

  if (draft.abilityMethod === "standard") {
    const scores = Object.values(draft.standardArrayAssigned);
    if (!isValidStandardArray(scores)) {
      showToast("Nilai Standard Array harus terdiri dari [15, 14, 13, 12, 10, 8] unik.", "error");
      goToStep(4);
      return;
    }
  } else {
    const scores = Object.values(draft.pointBuyAssigned);
    const total = calculatePointBuyTotal(scores);
    if (total > 27) {
      showToast(`Total biaya Point Buy (${total}) melebihi 27 poin!`, "error");
      goToStep(4);
      return;
    }
  }

  if (draft.proficientSkills.length > 4) {
    showToast("Maksimal 4 keahlian yang dapat dipilih.", "error");
    goToStep(5);
    return;
  }

  const payload = {
    name: draft.name,
    grade: draft.grade,
    campaignId: draft.campaignId || null,
    avatar: draft.avatar,
    ekskulId: draft.ekskulId,
    subclassId: draft.subclassId || null,
    socialClassId: draft.socialClassId,
    archetypeId: draft.archetypeId,
    abilityMethod: draft.abilityMethod,
    baseAbilities: draft.abilityMethod === "standard" ? draft.standardArrayAssigned : draft.pointBuyAssigned,
    proficientSkills: draft.proficientSkills,
    proficientSaves: draft.proficientSaves,
    keepsakes: draft.keepsakes,
    personality: draft.personality,
    ideals: draft.ideals,
    bonds: draft.bonds,
    flaws: draft.flaws,
    backstory: draft.backstory,
    targets: []
  };

  try {
    showToast("Membuat karakter dan menghasilkan perlengkapan di server...", "info");
    const newChar = await createCharacterRpc(payload);
    showToast(`✓ Karakter "${newChar.name}" berhasil dibuat! Jangan lupa pilih Origin Feat di tab Feats.`, "success");
    router.navigate(`/characters/${newChar.id}`);
  } catch (err: any) {
    showToast(`Gagal membuat karakter: ${err.message}`, "error");
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
