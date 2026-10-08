import {
  getCharacter,
  getCalendarProgress,
  toggleCalendarEvent,
  updateCharacterDirect,
  getCharacterSecret,
  updateCharacterSecret
} from "../api/characters";
import {
  getCompendiumEkskul,
  getCompendiumArchetypes,
  getCompendiumSocialClasses,
  getCompendiumAbilities,
  getCompendiumBasicActions,
  getCompendiumCalendarEvents
} from "../api/compendium";
import {
  shortRestRpc,
  longRestRpc,
  applyVitalChangeRpc
} from "../api/gameRpc";
import { characterStore } from "../store/characterStore";
import { exportCharacterJson, triggerPrintCharacterSheet } from "../services/exporter";
import {
  calculateAbilityModifier,
  formatModifier,
  calculateProficiencyBonus
} from "../services/ruleEngine";
import { savingsModal } from "../components/SavingsModal";
import { baitoModal } from "../components/BaitoModal";
import { backstoryModal } from "../components/BackstoryModal";
import { diceRollerModal } from "../components/DiceRollerModal";
import { itemDetailModal } from "../components/ItemDetailModal";
import { addItemModal } from "../components/AddItemModal";
import { levelUpWizardModal } from "../components/LevelUpWizardModal";
import { subclassSelectModal } from "../components/SubclassSelectModal";
import { editCharacterModal } from "../components/EditCharacterModal";
import { featPickerModal } from "../components/FeatPickerModal";
import { achievementAwardModal } from "../components/AchievementAwardModal";
import { ALL_FEATS } from "../data/featCompendium";
import { ALL_ACHIEVEMENTS } from "../data/achievementCompendium";
import {
  getLevelLabel,
  getGradeForLevel,
  getPendingChoices,
  getAllMovesSummary,
  calculateEffectiveStats,
  useFeatAction
} from "../rules/progression";
import { renderSheetSkeleton } from "../components/Skeleton";
import { showToast } from "../components/Toast";
import {
  type Character,
  type CalendarEventCompendium,
  type AbilityCompendium,
  type EkskulCompendium,
  type ArchetypeCompendium,
  type SocialClassCompendium,
  type BasicActionCompendium,
  type TargetSecret,
  type CharacterAbilities,
  type FeatCategory,
  isDmPinValid
} from "../types";

interface MoveItem {
  name: string;
  category: "basic_combat" | "basic_social" | "club_move" | "subclass_move" | "archetype_move";
  type: string;
  range: string;
  check: string;
  damage: string;
  desc: string;
  isLocked?: boolean;
  lockReason?: string;
  unlockGrade?: number;
}

// Module-level state for the active sheet session
let activeTab: "actions" | "inventory" | "features" | "feats" | "roleplay" | "affection" = "actions";
let activeMoveFilter: string = "all";
let isDmUnlocked = false;

// Cached compendiums for the active sheet
let compAbilities: AbilityCompendium[] = [];
let compEkskul: EkskulCompendium[] = [];
let compArchetypes: ArchetypeCompendium[] = [];
let compSocial: SocialClassCompendium[] = [];
let compBasicActions: BasicActionCompendium[] = [];
let compCalendar: CalendarEventCompendium[] = [];
let checkedCalendarEvents: string[] = [];

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function renderCharacterSheetView(params: Record<string, string>): Promise<void> {
  const charId = params.id;
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = renderSheetSkeleton();

  try {
    const char = await getCharacter(charId);
    if (!char) {
      appContainer.innerHTML = `
        <div style="text-align:center;padding:4rem;color:var(--rose-light);">
          <h2>Karakter Tidak Ditemukan</h2>
          <p>Karakter dengan ID ini tidak ditemukan atau data telah dihapus.</p>
          <a href="/" class="btn btn-secondary mt-3">← Kembali ke Roster</a>
        </div>
      `;
      return;
    }

    characterStore.setCurrentCharacter(char);

    // Parallel fetch of compendiums and auxiliary data
    const [
      abilitiesData,
      ekskulData,
      archetypesData,
      socialData,
      basicActionsData,
      calendarData,
      checkedCal,
      secretsData
    ] = await Promise.all([
      getCompendiumAbilities(),
      getCompendiumEkskul(),
      getCompendiumArchetypes(),
      getCompendiumSocialClasses(),
      getCompendiumBasicActions(),
      getCompendiumCalendarEvents(),
      getCalendarProgress(charId),
      getCharacterSecret(charId)
    ]);

    compAbilities = abilitiesData;
    compEkskul = ekskulData;
    compArchetypes = archetypesData;
    compSocial = socialData;
    compBasicActions = basicActionsData;
    compCalendar = calendarData;
    checkedCalendarEvents = checkedCal;

    // Merge targets if secrets exist on remote
    if (secretsData && secretsData.targets && secretsData.targets.length > 0) {
      char.targets = secretsData.targets;
    } else if (!char.targets) {
      char.targets = [];
    }

    // Reset DM mode and default tab
    isDmUnlocked = false;
    activeTab = "actions";
    activeMoveFilter = "all";

    renderDndBeyondSheet(appContainer, char);
    attachSheetEvents(appContainer, char);

    // Subscribe to store updates (e.g. from modals)
    characterStore.subscribe(() => {
      const updated = characterStore.currentCharacter;
      if (updated && updated.id === char.id) {
        updateDynamicElements(updated);
      }
    });

  } catch (err: any) {
    appContainer.innerHTML = `
      <div style="text-align:center;padding:4rem;color:var(--rose-light);">
        <h2>Terjadi Kesalahan</h2>
        <p>Gagal memuat character sheet: ${escapeHtml(err.message)}</p>
        <a href="/" class="btn btn-secondary mt-3">← Kembali ke Roster</a>
      </div>
    `;
  }
}

function renderDndBeyondSheet(container: HTMLElement, char: Character) {
  const effective = calculateEffectiveStats(char);
  const avatar = char.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(char.name)}`;
  const profBonus = effective.proficiencyBonus;
  const abilities = char.abilities;
  const vitals = char.vitals;
  const finances = char.finances;

  // Metadata Lookups
  const curArchetype = compArchetypes.find(a => a.id === char.archetype_id);
  const curEkskul = compEkskul.find(e => e.id === char.ekskul_id);
  const curSubclass = curEkskul?.subclasses?.find(sc => sc.id === char.subclass_id);
  const curSocial = compSocial.find(s => s.id === char.social_class_id);

  const archetypeName = curArchetype ? curArchetype.name : char.archetype_id.toUpperCase();
  const ekskulName = curEkskul ? curEkskul.name : char.ekskul_id.toUpperCase();
  const socialName = curSocial ? curSocial.name : char.social_class_id.toUpperCase();
  const hitDie = curEkskul?.hit_die || "1d8";

  // Ability Modifiers
  const statKeys: Array<keyof CharacterAbilities> = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
  const mods: Record<string, number> = effective.modifiers;

  // Dual Vitals Calculations
  const physAC = 10 + mods.physique;
  const initiative = formatModifier(mods.physique);
  const speed = effective.speed;
  const hpPercent = Math.max(0, Math.min(100, Math.round((vitals.physicalHpCurrent / Math.max(1, vitals.physicalHpMax)) * 100)));

  const socialAC = 10 + mods.mind + Math.max(0, mods.looks);
  const compPercent = Math.max(0, Math.min(100, Math.round((vitals.composureCurrent / Math.max(1, vitals.composureMax)) * 100)));

  // Passive Senses Calculations
  const passivePerception = effective.passivePerception;
  const passiveInsight = effective.passiveInsight;
  const passiveInvestigation = effective.passiveInvestigation;

  // Load death & meltdown saves from localStorage
  const savedSaves = getStoredSaves(char.id);

  container.innerHTML = `
    <div class="sheet-container">

      <!-- SHEET TOP TOOLBAR -->
      <div class="sheet-toolbar">
        <div class="toolbar-left">
          <a href="/" class="btn btn-secondary btn-sm" id="btnBackRoster">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
            Menu Utama
          </a>
          <button class="btn btn-secondary btn-sm" id="btnEditCharacter">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
            Edit Karakter
          </button>
          <a href="/characters/new" class="btn btn-secondary btn-sm" id="btnEditBuilder">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            Builder Baru
          </a>
          <span style="display:inline-flex;align-items:center;margin-left:8px;font-size:0.8rem;color:var(--text-muted);">
            v${char.version}
          </span>
          ${characterStore.hasConflict ? `
            <span style="background:rgba(225,29,72,0.2);color:var(--rose-light);padding:2px 8px;border-radius:4px;font-size:0.75rem;border:1px solid var(--rose-primary);margin-left:8px;">
              ⚠️ Konflik Versi Server
            </span>
          ` : ''}
        </div>
        <div class="toolbar-right">
          <button class="btn btn-secondary btn-sm" id="btnExportCharJson">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            Export JSON
          </button>
          <button class="btn btn-accent btn-sm" id="btnPrintCharSheet">
            <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd"/></svg>
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      <!-- PENDING SUBCLASS CHOICE BANNER (IF GRADE >= 11 AND NO SUBCLASS) -->
      ${getPendingChoices(char, compEkskul).length > 0 ? `
        <div class="pending-subclass-alert" style="background:linear-gradient(90deg, rgba(245,158,11,0.2), rgba(239,68,68,0.15));border:1px solid #f59e0b;padding:0.75rem 1.25rem;border-radius:var(--radius-md);margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span style="font-size:1.4rem;">⚠️</span>
            <div>
              <strong style="color:#fbbf24;">Peringatan Peminatan (Kelas 11):</strong>
              <span style="color:var(--text-primary);font-size:0.9rem;margin-left:0.25rem;">Karaktermu berada di Kelas 11 tetapi belum menentukan spesialisasi Subclass!</span>
            </div>
          </div>
          <button class="btn btn-sm btn-accent" id="btnPendingSubclassAction">Pilih Subclass Sekarang →</button>
        </div>
      ` : ''}

      <!-- SHEET HEADER BANNER -->
      <div class="sheet-banner">
        <div class="banner-char-identity">
          <div class="banner-avatar-frame">
            <img id="sheetAvatarImg" src="${avatar}" alt="${escapeHtml(char.name)}">
          </div>
          <div class="banner-name-block">
            <h1 id="sheetCharName" class="char-name">${escapeHtml(char.name)}</h1>
            <div class="char-meta-tags">
              <span id="sheetArchetypeBadge" class="meta-tag tag-species">${escapeHtml(archetypeName)}</span>
              <span id="sheetEkskulBadge" class="meta-tag tag-class">${escapeHtml(ekskulName)}</span>
              ${curSubclass ? `
                <span id="sheetSubclassBadge" class="meta-tag tag-subclass" style="background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid rgba(168,85,247,0.3);">
                  ${escapeHtml(curSubclass.name)}
                </span>
              ` : ''}
              <span id="sheetSocialBadge" class="meta-tag tag-bg">${escapeHtml(socialName)}</span>
              <span id="sheetGradeBadge" class="meta-tag tag-level">${getLevelLabel(char.level)}</span>
            </div>
          </div>
        </div>

        <div class="banner-rest-controls">
          <button class="btn-rest btn-level-up ${char.level >= 6 ? 'disabled' : ''}" id="btnLevelUp" title="${char.level >= 6 ? 'Level maksimal tercapai (Kelas 12 Sem 2)' : 'Naik Kelas / Level Up'}" ${char.level >= 6 ? 'disabled' : ''} style="background:linear-gradient(135deg, #e11d48, #9333ea);color:white;border-color:#e11d48;font-weight:700;">
            <svg viewBox="0 0 20 20" fill="currentColor" class="rest-icon" style="color:#fde047;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/></svg>
            Naik Kelas
          </button>
          <button class="btn-rest btn-short-rest" id="btnShortRest" title="Pulihkan Composure & HP menggunakan Rest Dice">
            <svg viewBox="0 0 20 20" fill="currentColor" class="rest-icon"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            Short Rest
          </button>
          <button class="btn-rest btn-long-rest" id="btnLongRest" title="Istirahat pulang sekolah penuh; pulihkan seluruh HP, Composure & Dice">
            <svg viewBox="0 0 20 20" fill="currentColor" class="rest-icon"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            Long Rest
          </button>
          <div class="heart-inspiration-box ${vitals.heartInspiration ? 'active' : ''}" id="btnHeartInspiration" title="Klik untuk mengaktifkan / menggunakan Heart Token (Inspirasi Asmara)">
            <div class="heart-icon" id="sheetHeartToken">♥</div>
            <div class="heart-label">DESIRE INSPIRATION</div>
          </div>
        </div>
      </div>

      <!-- 6 ABILITY SCORE CARDS ROW (ACROSS TOP) -->
      <div class="ability-cards-row">
        ${statKeys.map(key => {
          const score = abilities[key] || 10;
          const mod = mods[key];
          const modFormatted = formatModifier(mod);
          return `
            <div class="ability-card" data-stat="${key}" data-mod="${mod}" title="Klik untuk melempar check ${key.toUpperCase()} d20">
              <span class="ability-card-label">${key.toUpperCase()}</span>
              <div class="ability-card-mod" id="sheetMod${capitalize(key)}">${modFormatted}</div>
              <div class="ability-card-score" id="sheetScore${capitalize(key)}">${score}</div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- 3-COLUMN SHEET LAYOUT (D&D BEYOND AUTHENTIC GRID) -->
      <div class="sheet-main-grid">

        <!-- ========================================== -->
        <!-- COLUMN 1: CREST, SAVING THROWS & PASSIVES  -->
        <!-- ========================================== -->
        <div class="sheet-col col-left">
          <!-- Crest Card -->
          <div class="card crest-card">
            <div class="crest-frame">
              <svg viewBox="0 0 100 100" class="crest-svg">
                <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="currentColor" stroke-width="3"/>
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,3"/>
                <path d="M50,30 L62,42 L50,54 L38,42 Z" fill="currentColor"/>
                <circle cx="50" cy="65" r="5" fill="currentColor"/>
              </svg>
            </div>
            <div class="prof-bonus-pill">
              <span class="prof-title">PROFICIENCY</span>
              <span class="prof-value" id="sheetProfBonus">+${profBonus}</span>
            </div>
          </div>

          <!-- Saving Throws Box (6 Stat Saves) -->
          <div class="card p-3">
            <div class="box-header-title">SAVING THROWS (STAT SAVES)</div>
            <div class="saves-list" id="sheetSavesList">
              ${statKeys.map(key => {
                const isProf = (char.proficient_saves || []).includes(key);
                const saveTotal = mods[key] + (isProf ? profBonus : 0);
                const saveSign = formatModifier(saveTotal);
                const labelName = capitalize(key);
                return `
                  <div class="save-item" data-save-stat="${key}" data-mod="${saveTotal}" data-name="${labelName}">
                    <div class="save-left">
                      <span class="prof-dot ${isProf ? 'filled' : ''}"></span>
                      <span class="save-name">${labelName} Save</span>
                    </div>
                    <span class="save-bonus">${saveSign}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Passive Senses Box -->
          <div class="card p-3">
            <div class="box-header-title">PASSIVE SENSES (KEPEKAAN PASIF)</div>
            <div class="passive-item">
              <span class="passive-val" id="sheetPassivePerception">${passivePerception}</span>
              <div class="passive-meta">
                <span class="passive-name">Passive Perception</span>
                <span class="passive-hint">Lirik tatapan rahasia (10 + Mind / Awareness)</span>
              </div>
            </div>
            <div class="passive-item">
              <span class="passive-val" id="sheetPassiveInsight">${passiveInsight}</span>
              <div class="passive-meta">
                <span class="passive-name">Passive Insight</span>
                <span class="passive-hint">Peka salting &amp; motif bohong (10 + Intel / People)</span>
              </div>
            </div>
            <div class="passive-item">
              <span class="passive-val" id="sheetPassiveInvestigation">${passiveInvestigation}</span>
              <div class="passive-meta">
                <span class="passive-name">Passive Investigation</span>
                <span class="passive-hint">Temu surat di loker (10 + Intel / Academic)</span>
              </div>
            </div>
          </div>

          <!-- Proficiencies & Languages Box -->
          <div class="card p-3">
            <div class="box-header-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>PROFISIENSI &amp; BAHASA</span>
              <button class="btn btn-xs btn-secondary" id="btnEditProficiencies" title="Edit Profisiensi &amp; Bahasa" style="padding:0.15rem 0.4rem;font-size:0.7rem;">✏️ Edit</button>
            </div>
            <div class="prof-section-item">
              <strong>Gaya Seragam:</strong>
              <p id="sheetProfUniform">${escapeHtml(char.profUniform || ("Standar Blazer Sekolah, Sepatu Loafers, Dasi Rapi" + (curArchetype ? ` (${curArchetype.name.split(' ')[0]} Style)` : "")))}</p>
            </div>
            <div class="prof-section-item">
              <strong>Alat Ekskul:</strong>
              <p id="sheetProfClubTools">${escapeHtml(char.profClubTools || (curEkskul ? curEkskul.name : "Sesuai ekskul terdaftar"))}</p>
            </div>
            <div class="prof-section-item">
              <strong>Bahasa &amp; Dialek:</strong>
              <p id="sheetProfLanguages">${escapeHtml(char.profLanguages || "Bahasa Jepang Standar, Slang Remaja Tokyo, Bahasa Inggris Pelajaran")}</p>
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- COLUMN 2: 18 SUB-SKILLS SHEET TABLE       -->
        <!-- ========================================== -->
        <div class="sheet-col col-center">
          <div class="card p-3">
            <div class="box-header-title">18 SUB-SKILLS (TURUNAN STAT)</div>
            <p class="text-xs text-muted mb-2">Klik nama skill untuk langsung melempar dadu d20!</p>
            <div class="skills-sheet-table" id="sheetSkillsTable">
              ${renderSkillsRows(char, mods, profBonus)}
            </div>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- COLUMN 3: DUAL VITALS & INTERACTIVE TABS   -->
        <!-- ========================================== -->
        <div class="sheet-col col-right">

          <!-- DUAL VITALS DASHBOARD -->
          <div class="vitals-dashboard">

            <!-- Physical Combat Vitals Box -->
            <div class="vitals-card vitals-physical">
              <div class="vitals-card-title">
                <span class="badge-type-phys">FISIK / COMBAT</span>
                <span>Physical Vitals</span>
              </div>
              <div class="vitals-stats-row">
                <div class="vital-bubble">
                  <span class="vital-bubble-label">PHYS AC</span>
                  <span class="vital-bubble-val" id="sheetPhysAC">${physAC}</span>
                  <span class="vital-bubble-sub">Armor Fisik</span>
                </div>
                <div class="vital-bubble">
                  <span class="vital-bubble-label">INITIATIVE</span>
                  <span class="vital-bubble-val" id="sheetInitiative">${initiative}</span>
                  <span class="vital-bubble-sub">Refleks</span>
                </div>
                <div class="vital-bubble">
                  <span class="vital-bubble-label">SPEED</span>
                  <span class="vital-bubble-val" id="sheetSpeed">${speed}</span>
                  <span class="vital-bubble-sub">Lari</span>
                </div>
                <div class="vital-hp-block">
                  <div class="hp-header">
                    <span>PHYSICAL HP</span>
                    <div class="hp-buttons">
                      <button class="btn-micro" id="btnPhysMinusOne" title="Kurang 1 HP">-1</button>
                      <button class="btn-micro btn-dmg" id="btnPhysDmg" title="Masukkan Damage Fisik">Dmg</button>
                      <button class="btn-micro btn-heal" id="btnPhysHeal" title="Masukkan Heal Fisik">Heal</button>
                    </div>
                  </div>
                  <div class="hp-numbers">
                    <span id="sheetPhysHpCurrent">${vitals.physicalHpCurrent}</span>
                    <span class="hp-slash">/</span>
                    <span class="hp-max" id="sheetPhysHpMax">${vitals.physicalHpMax}</span>
                  </div>
                  <div class="hp-bar-track">
                    <div class="hp-bar-fill fill-phys" id="sheetPhysHpBar" style="width: ${hpPercent}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Death Saves Tracker -->
              <div class="saves-tracker-row">
                <span class="tracker-title">Death Saves:</span>
                <div class="tracker-group">
                  <span class="lbl-succ">Sukses:</span>
                  <input type="checkbox" id="deathSaveSucc1" class="check-bubble save-chk" data-type="death" data-kind="succ" data-idx="1" ${savedSaves.deathSucc >= 1 ? 'checked' : ''}>
                  <input type="checkbox" id="deathSaveSucc2" class="check-bubble save-chk" data-type="death" data-kind="succ" data-idx="2" ${savedSaves.deathSucc >= 2 ? 'checked' : ''}>
                  <input type="checkbox" id="deathSaveSucc3" class="check-bubble save-chk" data-type="death" data-kind="succ" data-idx="3" ${savedSaves.deathSucc >= 3 ? 'checked' : ''}>
                </div>
                <div class="tracker-group">
                  <span class="lbl-fail">Gagal:</span>
                  <input type="checkbox" id="deathSaveFail1" class="check-bubble fail save-chk" data-type="death" data-kind="fail" data-idx="1" ${savedSaves.deathFail >= 1 ? 'checked' : ''}>
                  <input type="checkbox" id="deathSaveFail2" class="check-bubble fail save-chk" data-type="death" data-kind="fail" data-idx="2" ${savedSaves.deathFail >= 2 ? 'checked' : ''}>
                  <input type="checkbox" id="deathSaveFail3" class="check-bubble fail save-chk" data-type="death" data-kind="fail" data-idx="3" ${savedSaves.deathFail >= 3 ? 'checked' : ''}>
                </div>
              </div>
            </div>

            <!-- Mental / Social Vitals Box -->
            <div class="vitals-card vitals-mental">
              <div class="vitals-card-title">
                <span class="badge-type-mental">MENTAL / SOSIAL</span>
                <span>Social Vitals</span>
              </div>
              <div class="vitals-stats-row">
                <div class="vital-bubble">
                  <span class="vital-bubble-label">SOCIAL AC</span>
                  <span class="vital-bubble-val" id="sheetSocialAC">${socialAC}</span>
                  <span class="vital-bubble-sub">Jaga Imej</span>
                </div>
                <div class="vital-bubble">
                  <span class="vital-bubble-label">REST DICE</span>
                  <span class="vital-bubble-val" id="sheetRestDice">${hitDie}</span>
                  <span class="vital-bubble-sub" id="sheetRestDiceUsed">${vitals.restDiceTotal - vitals.restDiceSpent}/${vitals.restDiceTotal}</span>
                </div>
                <div class="vital-hp-block">
                  <div class="hp-header">
                    <span>COMPOSURE</span>
                    <div class="hp-buttons">
                      <button class="btn-micro" id="btnCompMinusOne" title="Kurang 1 Composure">-1</button>
                      <button class="btn-micro btn-dmg" id="btnCompSalting" title="Masukkan Salting / Shock">Salting</button>
                      <button class="btn-micro btn-heal" id="btnCompTenang" title="Masukkan Tenang / Kalem">Tenang</button>
                    </div>
                  </div>
                  <div class="hp-numbers">
                    <span id="sheetComposureCurrent">${vitals.composureCurrent}</span>
                    <span class="hp-slash">/</span>
                    <span class="hp-max" id="sheetComposureMax">${vitals.composureMax}</span>
                  </div>
                  <div class="hp-bar-track">
                    <div class="hp-bar-fill fill-rose" id="sheetComposureBar" style="width: ${compPercent}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Social Meltdown Saves Tracker -->
              <div class="saves-tracker-row">
                <span class="tracker-title">Social Meltdown Saves:</span>
                <div class="tracker-group">
                  <span class="lbl-succ">Sukses:</span>
                  <input type="checkbox" id="mentalSaveSucc1" class="check-bubble save-chk" data-type="mental" data-kind="succ" data-idx="1" ${savedSaves.mentalSucc >= 1 ? 'checked' : ''}>
                  <input type="checkbox" id="mentalSaveSucc2" class="check-bubble save-chk" data-type="mental" data-kind="succ" data-idx="2" ${savedSaves.mentalSucc >= 2 ? 'checked' : ''}>
                  <input type="checkbox" id="mentalSaveSucc3" class="check-bubble save-chk" data-type="mental" data-kind="succ" data-idx="3" ${savedSaves.mentalSucc >= 3 ? 'checked' : ''}>
                </div>
                <div class="tracker-group">
                  <span class="lbl-fail">Gagal:</span>
                  <input type="checkbox" id="mentalSaveFail1" class="check-bubble fail save-chk" data-type="mental" data-kind="fail" data-idx="1" ${savedSaves.mentalFail >= 1 ? 'checked' : ''}>
                  <input type="checkbox" id="mentalSaveFail2" class="check-bubble fail save-chk" data-type="mental" data-kind="fail" data-idx="2" ${savedSaves.mentalFail >= 2 ? 'checked' : ''}>
                  <input type="checkbox" id="mentalSaveFail3" class="check-bubble fail save-chk" data-type="mental" data-kind="fail" data-idx="3" ${savedSaves.mentalFail >= 3 ? 'checked' : ''}>
                </div>
              </div>
            </div>

          </div>

          <!-- INTERACTIVE TABS CONTAINER (ACTIONS, INVENTORY, FEATURES, FEATS, ROLEPLAY, AFFECTION) -->
          <div class="sheet-tabs-container">
            <div class="sheet-tabs-nav">
              <button class="tab-btn ${activeTab === 'actions' ? 'active' : ''}" data-tab="actions">ACTIONS &amp; MOVES</button>
              <button class="tab-btn ${activeTab === 'inventory' ? 'active' : ''}" data-tab="inventory">INVENTORY</button>
              <button class="tab-btn ${activeTab === 'features' ? 'active' : ''}" data-tab="features">FEATURES &amp; TRAITS</button>
              <button class="tab-btn ${activeTab === 'feats' ? 'active' : ''}" data-tab="feats">FEATS &amp; ACHIEVEMENTS</button>
              <button class="tab-btn ${activeTab === 'roleplay' ? 'active' : ''}" data-tab="roleplay">ROLEPLAY &amp; LOG</button>
              <button class="tab-btn tab-btn-dm ${activeTab === 'affection' ? 'active' : ''}" data-tab="affection">
                🔒 AFFECTION (DM ONLY)
              </button>
            </div>

            <!-- TAB 1: ACTIONS & MOVES -->
            <div class="tab-pane" id="tabPaneActions" style="${activeTab === 'actions' ? 'display:block;' : 'display:none;'}">
              <div class="moves-filter-bar">
                <button class="filter-pill ${activeMoveFilter === 'all' ? 'active' : ''}" data-filter="all">ALL</button>
                <button class="filter-pill ${activeMoveFilter === 'basic_combat' ? 'active' : ''}" data-filter="basic_combat">BASIC COMBAT</button>
                <button class="filter-pill ${activeMoveFilter === 'basic_social' ? 'active' : ''}" data-filter="basic_social">BASIC SOCIAL</button>
                <button class="filter-pill ${activeMoveFilter === 'club_move' ? 'active' : ''}" data-filter="club_move">CLUB MOVES</button>
                <button class="filter-pill ${activeMoveFilter === 'subclass_move' ? 'active' : ''}" data-filter="subclass_move">SUBCLASS MOVES</button>
                <button class="filter-pill ${activeMoveFilter === 'archetype_move' ? 'active' : ''}" data-filter="archetype_move">ARCHETYPE MOVES</button>
              </div>
              <div class="moves-list" id="sheetMovesList">
                ${renderMovesList(char, activeMoveFilter)}
              </div>
            </div>

            <!-- TAB 2: INVENTORY -->
            <div class="tab-pane" id="tabPaneInventory" style="${activeTab === 'inventory' ? 'display:block;' : 'display:none;'}">
              <div class="inventory-financial-bar">
                <div class="fin-item">
                  <span class="fin-label">UANG SAKU HARIAN</span>
                  <span class="fin-val" id="sheetDisplayMoneyDaily">¥${finances.dailyMoneyAmount.toLocaleString()}</span>
                </div>
                <div class="fin-item">
                  <span class="fin-label">TABUNGAN / REKENING</span>
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="fin-val" id="sheetDisplayMoneySavings">¥${finances.savingsAmount.toLocaleString()}</span>
                    <button class="btn btn-xs btn-secondary" id="btnManageSavings" title="Kelola Tabungan (+/- Rupiah)" style="padding:0.18rem 0.5rem;font-size:0.75rem;font-weight:700;">💳 + / −</button>
                  </div>
                </div>
                <div class="fin-item">
                  <span class="fin-label">KERJA PARUH WAKTU (BAITO)</span>
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="fin-val" id="sheetDisplayMoneyJob">${escapeHtml(finances.job)}</span>
                    <button class="btn btn-xs btn-secondary" id="btnManageBaito" title="Mulai / Berhenti Kerja Paruh Waktu" style="padding:0.18rem 0.5rem;font-size:0.75rem;font-weight:700;">💼 Kelola</button>
                  </div>
                </div>
              </div>

              <div class="inventory-section-block">
                <div class="inv-head-title">Isi Tas Sekolah &amp; Barang Bawaan</div>
                <ul class="inventory-item-list" id="sheetBagList">
                  ${(char.inventory.bagItems || []).map((item, idx) => `
                    <li class="inv-item-row" data-item-name="${escapeHtml(item)}" title="Klik/Tap untuk melihat detail mekanik &amp; efek">
                      <span class="inv-item-clickable">• <strong class="inv-item-name">${escapeHtml(item)}</strong> <span class="inv-info-icon" title="Lihat detail">ℹ️</span></span>
                      <button class="btn btn-xs btn-secondary btn-del-inv" data-kind="bag" data-idx="${idx}" title="Hapus barang">&times;</button>
                    </li>
                  `).join("")}
                </ul>
              </div>

              <div class="inventory-section-block">
                <div class="inv-head-title">Benda Kenangan &amp; Jimat Kuil (Keepsakes)</div>
                <ul class="inventory-item-list" id="sheetKeepsakeList">
                  ${(char.inventory.keepsakes || []).map((item, idx) => `
                    <li class="inv-item-row" data-item-name="${escapeHtml(item)}" title="Klik/Tap untuk melihat detail mekanik &amp; efek">
                      <span class="inv-item-clickable inv-item-keepsake" style="color:#fbcfe8">♥ <strong class="inv-item-name">${escapeHtml(item)}</strong> <span class="inv-info-icon" title="Lihat detail">ℹ️</span></span>
                      <button class="btn btn-xs btn-secondary btn-del-inv" data-kind="keepsake" data-idx="${idx}" title="Hapus keepsake">&times;</button>
                    </li>
                  `).join("")}
                </ul>
              </div>

              <div class="add-inventory-actions-row" style="margin-top:1.25rem;">
                <button class="btn btn-primary btn-sm" id="btnOpenAddItemModal" style="width:100%;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;padding:0.6rem 1rem;">
                  📦 + Tambah Barang (Pilih dari Katalog / Buat Custom)
                </button>
              </div>
            </div>

            <!-- TAB 3: FEATURES & TRAITS -->
            <div class="tab-pane" id="tabPaneFeatures" style="${activeTab === 'features' ? 'display:block;' : 'display:none;'}">
              <div class="features-section" id="sheetFeaturesList">
                ${renderFeaturesContent(char)}
              </div>
            </div>

            <!-- TAB: FEATS & ACHIEVEMENTS -->
            <div class="tab-pane" id="tabPaneFeats" style="${activeTab === 'feats' ? 'display:block;' : 'display:none;'}">
              ${renderFeatsTabContent(char, isDmUnlocked)}
            </div>

            <!-- TAB 4: ROLEPLAY & LOG -->
            <div class="tab-pane" id="tabPaneRoleplay" style="${activeTab === 'roleplay' ? 'display:block;' : 'display:none;'}">
              <!-- Backstory Card -->
              <div class="backstory-card-box">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <h4 style="margin:0;color:var(--rose-primary);font-size:0.95rem;font-weight:800;">📖 BACKSTORY &amp; KISAH MASA LALU</h4>
                  <button class="btn btn-xs btn-secondary" id="btnEditBackstory" style="padding:0.18rem 0.5rem;font-size:0.75rem;">✏️ Edit Backstory</button>
                </div>
                <div class="backstory-text-content" id="sheetDisplayBackstory">
                  ${escapeHtml(char.backstory_fields.backstory || "Belum ada catatan kisah masa lalu.")}
                </div>
              </div>

              <!-- 4 Roleplay Cards Grid -->
              <div class="roleplay-cards-grid mt-3">
                <div class="rp-card">
                  <h4>Personality Traits (Sifat &amp; Kebiasaan)</h4>
                  <p id="sheetDisplayPersonality">${escapeHtml(char.backstory_fields.personality || "-")}</p>
                </div>
                <div class="rp-card">
                  <h4>Ideals &amp; Youth Dreams (Cita-cita SMA)</h4>
                  <p id="sheetDisplayIdeals">${escapeHtml(char.backstory_fields.ideals || "-")}</p>
                </div>
                <div class="rp-card">
                  <h4>Bonds (Ikatan Penting &amp; Janji Masa Lalu)</h4>
                  <p id="sheetDisplayBonds">${escapeHtml(char.backstory_fields.bonds || "-")}</p>
                </div>
                <div class="rp-card">
                  <h4>Flaws &amp; Insecurities (Kelemahan &amp; Bikin Salting)</h4>
                  <p id="sheetDisplayFlaws">${escapeHtml(char.backstory_fields.flaws || "-")}</p>
                </div>
              </div>

              <!-- School Calendar Box -->
              <div class="school-calendar-box mt-4">
                <div class="inv-head-title">Kalender Acara SMA (Academic Flags)</div>
                <div class="calendar-list" id="sheetCalendarList">
                  ${compCalendar.map(evt => {
                    const isDone = checkedCalendarEvents.includes(evt.id);
                    return `
                      <div class="calendar-event-item ${isDone ? 'calendar-done' : ''}" data-event-id="${evt.id}" style="background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);margin-bottom:0.35rem;border:1px solid ${isDone ? 'var(--green-health)' : 'var(--border-subtle)'};cursor:pointer;">
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                          <input type="checkbox" ${isDone ? 'checked' : ''} style="pointer-events:none;accent-color:var(--green-health);">
                          <span style="font-weight:700;font-size:0.85rem;color:${isDone ? 'var(--text-muted)' : '#fff'};${isDone ? 'text-decoration:line-through' : ''}">${escapeHtml(evt.name)} <span class="text-muted text-xs">(${escapeHtml(evt.term)})</span></span>
                        </div>
                        <p class="text-muted text-xs" style="margin-top:0.2rem;margin-left:1.5rem;">${escapeHtml(evt.description)}</p>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            </div>

            <!-- TAB 5: AFFECTION TRACKER (DM ONLY) -->
            <div class="tab-pane" id="tabPaneAffection" style="${activeTab === 'affection' ? 'display:block;' : 'display:none;'}">
              <div class="dm-gate-box" id="dmGateBox" style="${isDmUnlocked ? 'display:none;' : 'display:block;'}">
                <div class="dm-lock-icon">🔒</div>
                <h3>DM EYES ONLY</h3>
                <p>Meteran hati (♥ 1–10), status cinta/rivalitas, dan rahasia gebetan dirahasiakan agar pemain tidak metagaming.</p>
                <div class="dm-pin-form">
                  <input type="password" id="dmPinInput" class="input-text dm-pin-input" placeholder="Masukkan PIN DM..." maxlength="10">
                  <button class="btn btn-accent" id="btnUnlockDm">🔑 Buka Akses DM</button>
                  <p class="dm-pin-error" id="dmPinError" style="display:none;color:#f43f5e;font-size:0.8rem;margin-top:0.5rem;">⚠ PIN salah. Akses ditolak.</p>
                </div>
              </div>

              <div class="dm-unlocked-content" id="dmUnlockedContent" style="${isDmUnlocked ? 'display:block;' : 'display:none;'}">
                <div class="dm-status-bar">
                  <span class="badge-dm-active">✓ DM MODE AKTIF</span>
                  <button class="btn btn-secondary btn-xs" id="btnLockDm">Kunci Kembali</button>
                </div>

                <div class="targets-list" id="sheetTargetsList">
                  ${renderTargetsList(char)}
                </div>

                <button class="btn btn-secondary btn-sm mt-3" id="btnAddTarget">+ Tambah Target Romansa / Rival</button>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- MODALS -->
      ${subclassSelectModal.render()}
      ${levelUpWizardModal.render()}
      ${editCharacterModal.render()}
      ${featPickerModal.render()}
      ${achievementAwardModal.render()}

    </div>
  `;
}

function renderSkillsRows(char: Character, mods: Record<string, number>, profBonus: number): string {
  const effective = calculateEffectiveStats(char);
  let html = "";
  compAbilities.forEach(ab => {
    const statKey = ab.id as keyof CharacterAbilities;
    const mod = mods[statKey] || 0;
    (ab.skills || []).forEach(sk => {
      const isProf = (char.proficient_skills || []).includes(sk.id);
      const untrainedBonus = (!isProf && effective.jackOfAllTrades) ? 1 : 0;
      const skillTotal = mod + (isProf ? profBonus : untrainedBonus);
      const skillSign = formatModifier(skillTotal);
      html += `
        <div class="skill-row" data-stat-name="${ab.name}" data-skill-name="${sk.name}" data-mod="${skillTotal}" title="Lempar d20 untuk ${sk.name} (${ab.name})">
          <div class="skill-row-left">
            <span class="prof-dot ${isProf ? 'filled' : ''}"></span>
            <span class="skill-stat-tag">${ab.short_code}</span>
            <span class="skill-name-txt">${escapeHtml(sk.name)}</span>
          </div>
          <span class="skill-bonus-num">${skillSign}</span>
        </div>
      `;
    });
  });
  return html;
}

function renderMovesList(char: Character, filter: string): string {
  const charEkskulId = (char.ekskul_id || (char as any).ekskulId || "").toLowerCase();
  const charArchetypeId = (char.archetype_id || (char as any).archetypeId || "").toLowerCase();
  const charGrade = char.grade ?? getGradeForLevel(char.level);

  const curEkskul = compEkskul.find(e => e.id.toLowerCase() === charEkskulId || e.name.toLowerCase().includes(charEkskulId));
  const curArchetype = compArchetypes.find(a => a.id.toLowerCase() === charArchetypeId || a.name.toLowerCase().includes(charArchetypeId));
  const curSubclass = curEkskul?.subclasses?.find(sc => sc.id === char.subclass_id);

  let moves: MoveItem[] = [];

  // Basic Actions
  compBasicActions.forEach(b => {
    moves.push({
      name: b.name,
      category: b.category as any,
      type: (b as any).type || (b.category === "basic_combat" ? "Action (Physical)" : "Action (Social)"),
      range: (b as any).range || "Melee (5 ft)",
      check: b.check_type || (b as any).check || "Physique / Power",
      damage: b.effect || (b as any).damage || "-",
      desc: b.description || (b as any).desc || ""
    });
  });

  // Archetype Moves
  const arcMoves = (curArchetype?.archetype_moves || (curArchetype as any)?.archetypeMoves || []);
  if (curArchetype && arcMoves.length > 0) {
    arcMoves.forEach((m: any) => {
      moves.push({
        name: m.name,
        category: "archetype_move",
        type: `${m.move_type || m.type || 'Action'} [${curArchetype.name.split('(')[0].trim()}]`,
        range: m.range || "Self / Pandangan",
        check: m.check_type || m.check || "Otomatis",
        damage: m.effect || m.damage || "-",
        desc: m.description || m.desc || ""
      });
    });
  }

  // Club Moves (with Grade unlocks)
  const clubMoves = (curEkskul?.club_moves || (curEkskul as any)?.clubMoves || []);
  if (curEkskul && clubMoves.length > 0) {
    clubMoves.forEach((m: any, idx: number) => {
      const unlockGrade = m.unlock_grade || (m.order === 1 ? 10 : m.order === 2 ? 11 : 12);
      const isLocked = charGrade < unlockGrade;
      moves.push({
        name: m.name,
        category: "club_move",
        type: `${m.move_type || m.type || 'Action'} [${curEkskul.name.split('(')[0].trim()}]`,
        range: m.range || "Self / 15 ft",
        check: m.check_type || m.check || "Otomatis",
        damage: m.effect || m.damage || "-",
        desc: m.description || m.desc || "",
        isLocked,
        lockReason: isLocked ? `Terkunci (Terbuka di Kelas ${unlockGrade})` : undefined,
        unlockGrade
      });
    });
  }

  // Subclass Moves (G11, G12)
  if (curEkskul) {
    if (curSubclass && curSubclass.subclass_moves) {
      curSubclass.subclass_moves.forEach(sm => {
        const unlockGrade = sm.unlock_grade || (sm.tier === "G12" ? 12 : 11);
        const isLocked = charGrade < unlockGrade;
        moves.push({
          name: sm.name,
          category: "subclass_move",
          type: `${sm.move_type || 'Subclass'} [${curSubclass.name}]`,
          range: sm.range || "Self / 30 ft",
          check: sm.check_type || "Otomatis",
          damage: sm.effect || "-",
          desc: sm.description || "",
          isLocked,
          lockReason: isLocked ? `Terkunci (Terbuka di Kelas ${unlockGrade})` : undefined,
          unlockGrade
        });
      });
    } else if (!char.subclass_id && curEkskul.subclasses) {
      // Subclass not selected yet; preview candidate moves with lock badge
      curEkskul.subclasses.forEach(sc => {
        (sc.subclass_moves || []).forEach(sm => {
          moves.push({
            name: sm.name,
            category: "subclass_move",
            type: `${sm.move_type || 'Subclass'} [${sc.name}]`,
            range: sm.range || "Self / 30 ft",
            check: sm.check_type || "Otomatis",
            damage: sm.effect || "-",
            desc: sm.description || "",
            isLocked: true,
            lockReason: `Peminatan ${sc.name} Belum Dipilih`,
            unlockGrade: sm.unlock_grade || (sm.tier === "G12" ? 12 : 11)
          });
        });
      });
    }
  }

  if (filter !== "all") {
    moves = moves.filter(m => m.category === filter);
  }

  if (moves.length === 0) {
    return `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;">Tidak ada aksi dalam kategori ini.</p>`;
  }

  return moves.map(m => {
    const categoryColor = m.category === "club_move" ? "#fda4af"
      : m.category === "subclass_move" ? "#f43f5e"
      : m.category === "archetype_move" ? "#c4b5fd"
      : m.category === "basic_combat" ? "#60a5fa"
      : "#86efac";

    return `
      <div class="move-card ${m.isLocked ? 'move-card-locked' : ''}" style="${m.isLocked ? 'opacity:0.65;border:1px dashed var(--border-card);background:rgba(255,255,255,0.02);' : ''}">
        <div class="move-card-header">
          <span class="move-name" style="${m.isLocked ? 'color:var(--text-muted);' : ''}">${escapeHtml(m.name)}</span>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            ${m.isLocked ? `
              <span class="badge badge-locked" style="background:rgba(255,255,255,0.08);color:#fbbf24;font-size:0.72rem;border:1px solid rgba(251,191,36,0.3);padding:2px 6px;border-radius:4px;">
                🔒 ${escapeHtml(m.lockReason || 'Terkunci')}
              </span>
            ` : ''}
            <span class="move-type-badge" style="background:${categoryColor}22;color:${categoryColor}">${escapeHtml(m.type)}</span>
          </div>
        </div>
        <div class="move-metrics-row">
          <span><strong>Range:</strong> ${escapeHtml(m.range)}</span>
          <span><strong>Check:</strong> ${escapeHtml(m.check)}</span>
          <span><strong>Efek:</strong> ${escapeHtml(m.damage)}</span>
        </div>
        <p class="move-desc" style="${m.isLocked ? 'color:var(--text-muted);font-style:italic;' : ''}">${escapeHtml(m.desc)}</p>
      </div>
    `;
  }).join("");
}

function renderFeaturesContent(char: Character): string {
  const curArchetype = compArchetypes.find(a => a.id === char.archetype_id);
  const curEkskul = compEkskul.find(e => e.id === char.ekskul_id);
  const curSocial = compSocial.find(s => s.id === char.social_class_id);

  let html = "";
  if (curArchetype) {
    html += `
      <div class="card p-3 mb-3">
        <h4 style="color:#60a5fa;margin-bottom:0.4rem;font-size:0.95rem;font-weight:800;">Fitur Archetype: ${escapeHtml(curArchetype.name)}</h4>
        <p class="text-sm" style="line-height:1.6;">${escapeHtml(curArchetype.perk_description || "Karakteristik kepribadian dan gaya masa muda khas anime.")}</p>
      </div>
    `;
  }

  if (curEkskul) {
    html += `
      <div class="card p-3 mb-3">
        <h4 style="color:#fda4af;margin-bottom:0.4rem;font-size:0.95rem;font-weight:800;">Fasilitas &amp; Hak Ekskul: ${escapeHtml(curEkskul.name)}</h4>
        <p class="text-sm" style="line-height:1.6;">${escapeHtml(curEkskul.perk_description || "Akses ke ruangan klub, fasilitas latihan, dan koneksi senior sekolah.")}</p>
        ${curEkskul.subclasses && curEkskul.subclasses.length > 0 ? `
          <div style="margin-top:0.6rem;">
            <strong style="color:#fde68a;font-size:0.8rem;">Fokus Spesialisasi Tersedia:</strong>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
              ${curEkskul.subclasses.map(s => `
                <span style="font-size:0.75rem;background:var(--bg-surface);border:1px solid var(--border-subtle);padding:2px 8px;border-radius:4px;color:var(--text-main);">
                  ${escapeHtml(s.name)}
                </span>
              `).join("")}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (curSocial) {
    html += `
      <div class="card p-3 mb-3">
        <h4 style="color:#fde68a;margin-bottom:0.4rem;font-size:0.95rem;font-weight:800;">Status Finansial &amp; Kelas Sosial: ${escapeHtml(curSocial.name)}</h4>
        <p class="text-sm" style="line-height:1.6;">${escapeHtml(curSocial.description || curSocial.tier || "Uang saku harian dan modal tabungan sesuai latar belakang keluarga.")}</p>
      </div>
    `;
  }

  return html;
}

function renderTargetsList(char: Character): string {
  const targets: TargetSecret[] = char.targets || [];
  if (targets.length === 0) {
    return `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;">Belum ada target romansa / rivalitas. Tambahkan dengan tombol di bawah.</p>`;
  }

  return targets.map((t, idx) => {
    let heartsHtml = "";
    for (let h = 1; h <= 10; h++) {
      heartsHtml += `
        <span class="heart-dot ${h <= (t.affection || 0) ? 'active' : 'empty'}" data-target-idx="${idx}" data-heart-val="${h}" title="Set ${h}/10 ♥">♥</span>
      `;
    }

    return `
      <div class="target-card">
        <div class="target-card-header">
          <span class="target-name">${escapeHtml(t.name || 'Target Asmara')}</span>
          <span class="target-status-badge">${escapeHtml(t.status || 'Crush')}</span>
        </div>
        <div class="target-heart-meter">
          ${heartsHtml}
          <span style="font-size:0.85rem;font-weight:800;color:var(--rose-light);margin-left:0.5rem;">(${t.affection || 0}/10)</span>
        </div>
        <div class="target-secret-box">
          <strong>Event Flag &amp; Rahasia:</strong> ${escapeHtml(t.secret || 'Belum ada catatan rahasia.')}
        </div>
      </div>
    `;
  }).join("");
}

function renderFeatsTabContent(char: Character, isDmUnlocked: boolean): string {
  const grants = char.featGrants || char.feat_grants || [];
  const pendingGrants = grants.filter(g => g.status === "pending");
  const takenFeats = char.feats || [];
  const featMap = new Map<string, any>(ALL_FEATS.map(f => [f.id, f]));
  const usageTracker = char.featUsage || char.feat_usage || {};
  const achievements = char.achievements || [];
  const achMap = new Map<string, any>(ALL_ACHIEVEMENTS.map(a => [a.id, a]));

  let html = "";

  // 1. Pending Grants Banner
  if (pendingGrants.length > 0) {
    html += `
      <div class="pending-feats-banner" style="background:linear-gradient(90deg, rgba(234,179,8,0.15), rgba(245,158,11,0.08));border:1px solid #f59e0b;border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:1.25rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;font-weight:800;color:#facc15;font-size:0.95rem;">
              <span style="font-size:1.2rem;">⚠️</span> Slot Feat Belum Dipilih (${pendingGrants.length} Pending)
            </div>
            <p style="margin:0.25rem 0 0 0;font-size:0.85rem;color:var(--text-secondary);">
              Karaktermu berhak mengambil Feat baru. Klik tombol di bawah untuk memilih feat:
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${pendingGrants.map(pg => {
              const label = pg.category === 'origin' ? 'Origin Feat (K10)' : `General Feat (K${pg.grade || '11/12'})`;
              return `
                <button class="btn btn-primary btn-sm btn-pick-pending-feat" 
                        data-grant-id="${pg.id}" 
                        data-category="${pg.category}" 
                        data-grade="${pg.grade || ''}">
                  ✨ Pilih ${label}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // 2. DM Mode Controls (Only if DM Pin unlocked)
  if (isDmUnlocked) {
    html += `
      <div class="dm-feat-controls-box" style="background:rgba(225,29,72,0.08);border:1px solid rgba(225,29,72,0.3);border-radius:var(--radius-md);padding:0.75rem 1.25rem;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span class="badge" style="background:#e11d48;color:#fff;font-weight:800;font-size:0.7rem;padding:0.2rem 0.5rem;border-radius:4px;">👑 DM MODE AKTIF</span>
          <span style="font-size:0.85rem;color:var(--text-main);font-weight:600;">Otoritas Penganugerahan Feat &amp; Achievement</span>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-xs" id="btnDmAwardFeat" style="font-weight:700;">👑 + Anugerahi Feat Bebas</button>
          <button class="btn btn-accent btn-xs" id="btnDmUnlockAchievement" style="font-weight:700;">🏆 Buka Achievement</button>
        </div>
      </div>
    `;
  }

  // 3. Active Feats Header
  html += `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h4 style="margin:0;font-size:1.1rem;font-weight:800;color:var(--text-primary);display:flex;align-items:center;gap:0.5rem;">
        <span>🎯</span> Feat Karakter Aktif (${takenFeats.length})
      </h4>
      <div style="font-size:0.8rem;color:var(--text-muted);">
        Origin (Cap 20) • General (Cap 20) • Achievement (Cap 30)
      </div>
    </div>
  `;

  if (takenFeats.length === 0) {
    html += `
      <div class="card p-4 text-center" style="color:var(--text-muted);background:rgba(255,255,255,0.02);border:1px dashed var(--border-subtle);border-radius:var(--radius-md);margin-bottom:1.5rem;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">🌟</div>
        <p style="margin:0 0 0.5rem 0;font-weight:600;">Belum ada Feat yang diambil.</p>
        <p class="text-xs" style="margin:0;">Pilih Feat dari banner di atas atau anugerahi melalui sesi permainan.</p>
      </div>
    `;
  } else {
    html += `
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(360px, 1fr));gap:1rem;margin-bottom:2rem;">
        ${takenFeats.map(taken => {
          const feat = featMap.get(taken.featId);
          if (!feat) return '';

          const catBadgeColor = feat.category === "origin"
            ? "background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);"
            : feat.category === "achievement"
            ? "background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3);"
            : "background:rgba(225,29,72,0.15);color:#fb7185;border:1px solid rgba(225,29,72,0.3);";

          const catLabel = feat.category === "origin"
            ? "ORIGIN FEAT"
            : feat.category === "achievement"
            ? "ACHIEVEMENT FEAT"
            : `GENERAL FEAT (${(feat.subcategory || "").toUpperCase()})`;

          const usage = usageTracker[feat.id];

          return `
            <div class="card" style="padding:1.15rem;border-radius:var(--radius-md);border:1px solid var(--border-card);background:var(--bg-card);display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.35rem;">
                  <span class="badge" style="font-size:0.65rem;padding:0.15rem 0.45rem;border-radius:4px;font-weight:800;${catBadgeColor}">${catLabel}</span>
                  ${feat.bonusAbility ? `
                    <span class="badge" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);font-size:0.65rem;padding:0.15rem 0.45rem;border-radius:4px;font-weight:700;">
                      +${feat.bonusAbility.value} ${feat.bonusAbility.ability.toUpperCase()} (Cap ${feat.bonusAbility.cap})
                    </span>
                  ` : ''}
                </div>

                <h4 style="margin:0 0 0.4rem 0;color:var(--text-primary);font-size:1.1rem;font-weight:800;">${escapeHtml(feat.name)}</h4>
                
                <p style="font-size:0.85rem;color:var(--text-secondary);margin:0 0 0.6rem 0;line-height:1.45;">
                  ${escapeHtml(feat.description)}
                </p>

                ${feat.manualEffectText ? `
                  <div style="background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);font-size:0.8rem;color:var(--text-muted);border-left:3px solid var(--rose-primary);margin-bottom:0.6rem;line-height:1.4;">
                    ${escapeHtml(feat.manualEffectText)}
                  </div>
                ` : ''}

                ${taken.choices ? `
                  <div style="font-size:0.75rem;color:var(--rose-light);background:rgba(225,29,72,0.06);padding:0.3rem 0.6rem;border-radius:4px;margin-bottom:0.6rem;">
                    ${taken.choices.skills ? `<div><strong>Skill Terpilih:</strong> ${taken.choices.skills.join(", ").toUpperCase()}</div>` : ''}
                    ${taken.choices.saves ? `<div><strong>Save Terpilih:</strong> ${taken.choices.saves.join(", ").toUpperCase()}</div>` : ''}
                    ${taken.choices.language ? `<div><strong>Bahasa:</strong> ${escapeHtml(taken.choices.language)}</div>` : ''}
                  </div>
                ` : ''}

                <!-- Mandatory Penalty / Drawback Display -->
                ${feat.drawbackText ? `
                  <div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.35);border-radius:var(--radius-xs);padding:0.5rem 0.75rem;font-size:0.78rem;color:#fca5a5;margin-bottom:0.6rem;line-height:1.35;">
                    <strong>⚠️ PENALTI / KONSEKUENSI:</strong> ${escapeHtml(feat.drawbackText)}
                  </div>
                ` : ''}
              </div>

              <!-- Action Usage Tracker & Button -->
              ${usage ? `
                <div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);margin-top:0.6rem;border:1px solid var(--border-subtle);flex-wrap:wrap;gap:0.5rem;">
                  <div style="font-size:0.8rem;color:var(--text-main);">
                    <strong>Penggunaan:</strong> 
                    <span class="badge" style="background:${usage.used >= usage.max ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'};color:${usage.used >= usage.max ? '#f87171' : '#34d399'};margin:0 4px;font-weight:700;">
                      ${usage.used} / ${usage.max}
                    </span>
                    <span class="text-xs text-muted">(${usage.resetType.replace('_', ' ')})</span>
                  </div>
                  <button class="btn btn-xs btn-primary btn-use-feat" data-feat-id="${feat.id}" ${usage.used >= usage.max ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                    ${usage.used >= usage.max ? 'Habis' : '⚡ Gunakan'}
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // 4. Earned Achievements Section
  html += `
    <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);">
      <h4 style="margin:0 0 1rem 0;font-size:1.1rem;font-weight:800;color:var(--text-primary);display:flex;align-items:center;gap:0.5rem;">
        <span>🏆</span> Pencapaian Naratif Terbuka (${achievements.length}/8)
      </h4>
  `;

  if (achievements.length === 0) {
    html += `
      <div class="card p-3 text-center" style="color:var(--text-muted);background:rgba(255,255,255,0.02);border:1px dashed var(--border-subtle);border-radius:var(--radius-md);">
        <p style="margin:0;font-size:0.85rem;">Belum ada pencapaian naratif yang dibuka oleh DM.</p>
      </div>
    `;
  } else {
    html += `
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:0.75rem;">
        ${achievements.map(achItem => {
          const ach = achMap.get(achItem.achievementId);
          if (!ach) return '';
          return `
            <div class="card p-3" style="background:rgba(234,179,8,0.05);border:1px solid rgba(234,179,8,0.25);border-radius:var(--radius-md);">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">
                <span style="font-size:1.3rem;">${ach.badge_icon || '🏆'}</span>
                <strong style="color:#fde047;font-size:0.95rem;">${escapeHtml(ach.title)}</strong>
              </div>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 0.35rem 0;line-height:1.4;">
                ${escapeHtml(ach.description)}
              </p>
              <div class="text-xs" style="color:var(--rose-light);">
                <strong>📜 Kisah:</strong> ${escapeHtml(ach.requirement)}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

function attachSheetEvents(container: HTMLElement, char: Character) {
  // 1. Toolbar Actions
  document.getElementById("btnExportCharJson")?.addEventListener("click", () => exportCharacterJson(char));
  document.getElementById("btnPrintCharSheet")?.addEventListener("click", () => triggerPrintCharacterSheet());

  // 2. Banner Actions: Rest Controls & Heart Inspiration
  document.getElementById("btnShortRest")?.addEventListener("click", async () => {
    try {
      showToast("Menjalankan Short Rest...", "info");
      const res = await shortRestRpc(char.id, char.version);
      char.vitals = res.vitals;
      char.version = res.newVersion;
      showToast(`☕ Short Rest: ${res.healTotal} HP & Composure dipulihkan! (${res.dieRolled}: ${res.rollResult} +${res.modPhysique})`, "success");
      updateDynamicElements(char);
    } catch (err: any) {
      showToast(`Gagal Short Rest: ${err.message}`, "error");
    }
  });

  document.getElementById("btnLongRest")?.addEventListener("click", async () => {
    try {
      showToast("Menjalankan Long Rest sepulang sekolah...", "info");
      const res = await longRestRpc(char.id, char.version);
      char.vitals = res.vitals;
      char.finances = res.finances;
      char.version = res.newVersion;
      showToast(`🌙 Long Rest: HP & Composure pulih penuh! +¥${res.totalAdded.toLocaleString()} disetor ke tabungan.`, "success");
      updateDynamicElements(char);
    } catch (err: any) {
      showToast(`Gagal Long Rest: ${err.message}`, "error");
    }
  });

  document.getElementById("btnHeartInspiration")?.addEventListener("click", async () => {
    const newVal = !char.vitals.heartInspiration;
    char.vitals.heartInspiration = newVal;
    const box = document.getElementById("btnHeartInspiration");
    if (box) box.classList.toggle("active", newVal);
    try {
      await updateCharacterDirect(char.id, { vitals: char.vitals }, char.version);
      showToast(newVal ? "♥ Desire Inspiration DIAKTIFKAN!" : "Desire Inspiration digunakan.", "info");
    } catch (err: any) {
      console.warn("Inspiration save fallback:", err);
    }
  });

  // 3. Ability Cards Roll Triggers
  container.querySelectorAll(".ability-card").forEach((card: any) => {
    card.addEventListener("click", () => {
      const stat = card.dataset.stat || "physique";
      const mod = parseInt(card.dataset.mod || "0");
      diceRollerModal.show("d20", mod, `${stat.toUpperCase()} Check`);
    });
  });

  // 4. Saving Throws Roll Triggers
  container.querySelectorAll(".save-item").forEach((item: any) => {
    item.addEventListener("click", () => {
      const name = item.dataset.name || "Stat";
      const mod = parseInt(item.dataset.mod || "0");
      diceRollerModal.show("d20", mod, `${name} Saving Throw`);
    });
  });

  // 5. Sub-skills Roll Triggers
  container.querySelectorAll(".skill-row").forEach((row: any) => {
    row.addEventListener("click", () => {
      const skillName = row.dataset.skillName || "Skill";
      const statName = row.dataset.statName || "";
      const mod = parseInt(row.dataset.mod || "0");
      diceRollerModal.show("d20", mod, `Check ${skillName} (${statName})`);
    });
  });

  // 6. Edit Proficiencies Dialog
  document.getElementById("btnEditProficiencies")?.addEventListener("click", async () => {
    const uniform = prompt("Gaya Seragam & Pakaian:", char.profUniform || document.getElementById("sheetProfUniform")?.textContent || "");
    if (uniform === null) return;
    const tools = prompt("Alat & Perlengkapan Ekskul Khusus:", char.profClubTools || document.getElementById("sheetProfClubTools")?.textContent || "");
    if (tools === null) return;
    const langs = prompt("Bahasa & Dialek yang Dikuasai:", char.profLanguages || document.getElementById("sheetProfLanguages")?.textContent || "");
    if (langs === null) return;

    char.profUniform = uniform.trim();
    char.profClubTools = tools.trim();
    char.profLanguages = langs.trim();

    try {
      const updated = await updateCharacterDirect(char.id, {
        profUniform: char.profUniform,
        profClubTools: char.profClubTools,
        profLanguages: char.profLanguages
      }, char.version);
      char.version = updated.version;
      const elU = document.getElementById("sheetProfUniform");
      const elT = document.getElementById("sheetProfClubTools");
      const elL = document.getElementById("sheetProfLanguages");
      if (elU) elU.textContent = char.profUniform;
      if (elT) elT.textContent = char.profClubTools;
      if (elL) elL.textContent = char.profLanguages;
      showToast("Profisiensi & Bahasa diperbarui!", "success");
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err.message}`, "error");
    }
  });

  // 7. Physical HP Button Alters (-1, Dmg, Heal)
  document.getElementById("btnPhysMinusOne")?.addEventListener("click", () => alterVitalDirect(char, "phys", -1));
  document.getElementById("btnPhysDmg")?.addEventListener("click", () => {
    const val = prompt("Masukkan jumlah Physical Damage yang diterima:", "1");
    const num = parseInt(val || "0");
    if (!isNaN(num) && num > 0) alterVitalDirect(char, "phys", -num);
  });
  document.getElementById("btnPhysHeal")?.addEventListener("click", () => {
    const val = prompt("Masukkan jumlah Physical Heal (pemulihan):", "1");
    const num = parseInt(val || "0");
    if (!isNaN(num) && num > 0) alterVitalDirect(char, "phys", num);
  });

  // 8. Composure Button Alters (-1, Salting, Tenang)
  document.getElementById("btnCompMinusOne")?.addEventListener("click", () => alterVitalDirect(char, "composure", -1));
  document.getElementById("btnCompSalting")?.addEventListener("click", () => {
    const val = prompt("Masukkan jumlah Salting / Syok Mental (Composure Damage):", "1");
    const num = parseInt(val || "0");
    if (!isNaN(num) && num > 0) alterVitalDirect(char, "composure", -num);
  });
  document.getElementById("btnCompTenang")?.addEventListener("click", () => {
    const val = prompt("Masukkan jumlah Ketenangan / Relaksasi (Composure Heal):", "1");
    const num = parseInt(val || "0");
    if (!isNaN(num) && num > 0) alterVitalDirect(char, "composure", num);
  });

  // 9. Death & Meltdown Saves Checkboxes
  container.querySelectorAll(".save-chk").forEach((chk: any) => {
    chk.addEventListener("change", () => {
      saveStoredSaves(char.id);
    });
  });

  // 10. Sheet Tabs Switching
  container.querySelectorAll(".sheet-tabs-nav .tab-btn").forEach((btn: any) => {
    btn.addEventListener("click", (e: any) => {
      const tab = e.currentTarget.dataset.tab;
      activeTab = tab;
      container.querySelectorAll(".sheet-tabs-nav .tab-btn").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      container.querySelectorAll(".tab-pane").forEach((pane: any) => {
        pane.style.display = "none";
      });

      const targetPane = document.getElementById(`tabPane${capitalize(tab)}`);
      if (targetPane) targetPane.style.display = "block";
    });
  });

  // 11. Move Filter Pills
  container.querySelectorAll(".moves-filter-bar .filter-pill").forEach((pill: any) => {
    pill.addEventListener("click", (e: any) => {
      const filter = e.currentTarget.dataset.filter;
      activeMoveFilter = filter;
      container.querySelectorAll(".moves-filter-bar .filter-pill").forEach(p => p.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const movesList = document.getElementById("sheetMovesList");
      if (movesList) movesList.innerHTML = renderMovesList(char, filter);
    });
  });

  // 12. Inventory Financial Modals
  document.getElementById("btnManageSavings")?.addEventListener("click", () => savingsModal.show());
  document.getElementById("btnManageBaito")?.addEventListener("click", () => baitoModal.show());

  // 13. Open Add Item Modal (Catalog & Custom)
  document.getElementById("btnOpenAddItemModal")?.addEventListener("click", () => addItemModal.show());

  attachInventoryDeleteEvents(container, char);
  attachInventoryDetailEvents(container);

  // 14. Backstory Modal Trigger
  document.getElementById("btnEditBackstory")?.addEventListener("click", () => backstoryModal.show());

  // 15. Calendar Checkbox Event Flags
  container.querySelectorAll(".calendar-event-item").forEach((item: any) => {
    item.addEventListener("click", async (e: any) => {
      const eventId = item.dataset.eventId;
      const isChecked = checkedCalendarEvents.includes(eventId);
      const newDone = !isChecked;

      try {
        await toggleCalendarEvent(char.id, eventId, newDone);
        if (newDone) {
          checkedCalendarEvents.push(eventId);
          item.classList.add("calendar-done");
          item.style.borderColor = "var(--green-health)";
        } else {
          checkedCalendarEvents = checkedCalendarEvents.filter(id => id !== eventId);
          item.classList.remove("calendar-done");
          item.style.borderColor = "var(--border-subtle)";
        }
        const cb = item.querySelector("input[type=checkbox]");
        if (cb) cb.checked = newDone;
        const nameSpan = item.querySelector("span");
        if (nameSpan) {
          nameSpan.style.textDecoration = newDone ? "line-through" : "none";
          nameSpan.style.color = newDone ? "var(--text-muted)" : "#fff";
        }
        showToast("Kalender sekolah diperbarui!", "info");
      } catch (err: any) {
        showToast(`Gagal memperbarui kalender: ${err.message}`, "error");
      }
    });
  });

  // 16. DM Affection Tracker (PIN Unlock / Lock / Add / Heart Updates)
  const pinInput = document.getElementById("dmPinInput") as HTMLInputElement;
  const pinErr = document.getElementById("dmPinError");

  document.getElementById("btnUnlockDm")?.addEventListener("click", () => {
    const pin = pinInput ? pinInput.value.trim() : "";
    if (!isDmPinValid(pin)) {
      if (pinErr) {
        pinErr.style.display = "block";
        pinErr.classList.add("shake");
        setTimeout(() => pinErr.classList.remove("shake"), 400);
      }
      return;
    }

    if (pinErr) pinErr.style.display = "none";
    if (pinInput) pinInput.value = "";
    isDmUnlocked = true;
    renderDndBeyondSheet(container, char);
    attachSheetEvents(container, char);
    showToast("🔑 Mode DM diaktifkan! Akses cinta dan fitur DM terbuka.", "success");
  });

  pinInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("btnUnlockDm")?.click();
    }
  });

  document.getElementById("btnLockDm")?.addEventListener("click", () => {
    isDmUnlocked = false;
    renderDndBeyondSheet(container, char);
    attachSheetEvents(container, char);
    showToast("🔒 Mode DM dikunci kembali.", "info");
  });

  document.getElementById("btnAddTarget")?.addEventListener("click", async () => {
    const name = prompt("Nama Target Romansa / Gebetan / Rival Baru:");
    if (!name) return;
    const status = prompt("Status Hubungan (contoh: Secret Crush, Rival, Teman Sebangku):", "Secret Crush");
    const secret = prompt("Catatan Rahasia / Momen Berkesan:", "");

    if (!char.targets) char.targets = [];
    char.targets.push({
      name: name.trim(),
      status: (status || "Secret Crush").trim(),
      affection: 1,
      secret: (secret || "").trim()
    });

    try {
      await saveTargets(char);
      const targetsContainer = document.getElementById("sheetTargetsList");
      if (targetsContainer) {
        targetsContainer.innerHTML = renderTargetsList(char);
        attachTargetHeartEvents(container, char);
      }
      showToast(`Target baru ditambahkan: ${name}`, "success");
    } catch (err: any) {
      showToast(`Gagal menyimpan target: ${err.message}`, "error");
    }
  });

  // 17. Progression, Feat & DM Modals
  subclassSelectModal.attachEvents();
  levelUpWizardModal.attachEvents();
  editCharacterModal.attachEvents();
  featPickerModal.attachEvents();
  achievementAwardModal.attachEvents();

  // Pending feat selection buttons
  container.querySelectorAll(".btn-pick-pending-feat").forEach((btn: any) => {
    btn.addEventListener("click", () => {
      const grantId = btn.getAttribute("data-grant-id");
      const cat = btn.getAttribute("data-category") as FeatCategory;
      const gradeStr = btn.getAttribute("data-grade");
      const grade = gradeStr ? parseInt(gradeStr, 10) : undefined;
      featPickerModal.show({
        grantId,
        allowedCategory: cat,
        grade,
        onSelect: () => {
          const cur = characterStore.currentCharacter;
          if (cur) {
            renderDndBeyondSheet(container, cur);
            attachSheetEvents(container, cur);
          }
        }
      });
    });
  });

  // DM Award Feat
  document.getElementById("btnDmAwardFeat")?.addEventListener("click", () => {
    featPickerModal.show({
      isDmMode: true,
      allowedCategory: "any",
      onSelect: () => {
        const cur = characterStore.currentCharacter;
        if (cur) {
          renderDndBeyondSheet(container, cur);
          attachSheetEvents(container, cur);
        }
      }
    });
  });

  // DM Unlock Achievement
  document.getElementById("btnDmUnlockAchievement")?.addEventListener("click", () => {
    achievementAwardModal.show();
  });

  // Feat Action [Gunakan] Button
  container.querySelectorAll(".btn-use-feat").forEach((btn: any) => {
    btn.addEventListener("click", async () => {
      const featId = btn.getAttribute("data-feat-id");
      if (!featId) return;
      try {
        const res = useFeatAction(char, featId);
        const featDef = ALL_FEATS.find(f => f.id === featId);
        showToast(`⚡ Aksi '${featDef?.name || featId}' digunakan! (${res.used}/${res.max})`, "info");
        char.featUsage = res.character.featUsage;
        char.feat_usage = res.character.feat_usage;
        await updateCharacterDirect(char.id, {
          feat_usage: char.featUsage
        }, char.version);
        characterStore.setCurrentCharacter(char);
        renderDndBeyondSheet(container, char);
        attachSheetEvents(container, char);
      } catch (err: any) {
        showToast(`Gagal menggunakan aksi: ${err.message}`, "error");
      }
    });
  });

  // Character updated event listener
  const onCharUpdated = (e: any) => {
    const updated = e.detail as Character;
    if (updated && updated.id === char.id) {
      renderDndBeyondSheet(container, updated);
      attachSheetEvents(container, updated);
    }
  };
  window.removeEventListener("characterUpdated", (container as any)._charUpdatedHandler);
  (container as any)._charUpdatedHandler = onCharUpdated;
  window.addEventListener("characterUpdated", onCharUpdated);

  document.getElementById("btnEditCharacter")?.addEventListener("click", () => {
    editCharacterModal.show();
  });

  document.getElementById("btnLevelUp")?.addEventListener("click", () => {
    levelUpWizardModal.show();
  });

  document.getElementById("btnPendingSubclassAction")?.addEventListener("click", () => {
    subclassSelectModal.show(() => {
      const current = characterStore.currentCharacter;
      if (current) {
        renderDndBeyondSheet(container, current);
        attachSheetEvents(container, current);
      }
    });
  });

  attachTargetHeartEvents(container, char);
}

function attachInventoryDeleteEvents(container: HTMLElement, char: Character) {
  container.querySelectorAll(".btn-del-inv").forEach((btn: any) => {
    btn.addEventListener("click", async (e: any) => {
      e.stopPropagation();
      const kind = btn.dataset.kind;
      const idx = parseInt(btn.dataset.idx);

      if (kind === "bag") {
        char.inventory.bagItems.splice(idx, 1);
      } else {
        char.inventory.keepsakes.splice(idx, 1);
      }

      try {
        const updated = await updateCharacterDirect(char.id, { inventory: char.inventory }, char.version);
        char.version = updated.version;
        renderInventoryLists(char);
        showToast("Barang dihapus.", "info");
      } catch (err: any) {
        showToast(`Gagal menghapus: ${err.message}`, "error");
      }
    });
  });
}

function attachInventoryDetailEvents(container: HTMLElement) {
  container.querySelectorAll(".inv-item-row").forEach((el: any) => {
    el.addEventListener("click", (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".btn-del-inv")) return;
      const itemName = el.dataset.itemName;
      if (itemName) {
        itemDetailModal.show(itemName);
      }
    });
  });
}

function renderInventoryLists(char: Character) {
  const bagList = document.getElementById("sheetBagList");
  if (bagList) {
    bagList.innerHTML = (char.inventory.bagItems || []).map((item, idx) => `
      <li class="inv-item-row" data-item-name="${escapeHtml(item)}" title="Klik/Tap untuk melihat detail mekanik &amp; efek">
        <span class="inv-item-clickable">• <strong class="inv-item-name">${escapeHtml(item)}</strong> <span class="inv-info-icon" title="Lihat detail">ℹ️</span></span>
        <button class="btn btn-xs btn-secondary btn-del-inv" data-kind="bag" data-idx="${idx}" title="Hapus barang">&times;</button>
      </li>
    `).join("");
  }

  const keepList = document.getElementById("sheetKeepsakeList");
  if (keepList) {
    keepList.innerHTML = (char.inventory.keepsakes || []).map((item, idx) => `
      <li class="inv-item-row" data-item-name="${escapeHtml(item)}" title="Klik/Tap untuk melihat detail mekanik &amp; efek">
        <span class="inv-item-clickable inv-item-keepsake" style="color:#fbcfe8">♥ <strong class="inv-item-name">${escapeHtml(item)}</strong> <span class="inv-info-icon" title="Lihat detail">ℹ️</span></span>
        <button class="btn btn-xs btn-secondary btn-del-inv" data-kind="keepsake" data-idx="${idx}" title="Hapus keepsake">&times;</button>
      </li>
    `).join("");
  }

  const container = document.getElementById("appMain");
  if (container) {
    attachInventoryDeleteEvents(container, char);
    attachInventoryDetailEvents(container);
  }
}

function attachTargetHeartEvents(container: HTMLElement, char: Character) {
  container.querySelectorAll(".heart-dot").forEach((dot: any) => {
    dot.addEventListener("click", async (e: any) => {
      const targetIdx = parseInt(dot.dataset.targetIdx);
      const heartVal = parseInt(dot.dataset.heartVal);

      if (char.targets && char.targets[targetIdx]) {
        char.targets[targetIdx].affection = heartVal;
        try {
          await saveTargets(char);
          const targetsContainer = document.getElementById("sheetTargetsList");
          if (targetsContainer) {
            targetsContainer.innerHTML = renderTargetsList(char);
            attachTargetHeartEvents(container, char);
          }
          showToast(`Affection meter diperbarui menjadi ${heartVal}/10 ♥`, "success");
        } catch (err: any) {
          showToast(`Gagal menyimpan affection: ${err.message}`, "error");
        }
      }
    });
  });
}

async function saveTargets(char: Character) {
  if (char.campaign_id) {
    await updateCharacterSecret(char.id, char.campaign_id, char.targets || []);
  }
  const updated = await updateCharacterDirect(char.id, { targets: char.targets }, char.version);
  char.version = updated.version;
}

async function alterVitalDirect(char: Character, type: 'phys' | 'composure', delta: number) {
  try {
    await characterStore.runOptimisticUpdate(
      (draft) => {
        const curKey = type === "phys" ? "physicalHpCurrent" : "composureCurrent";
        const maxKey = type === "phys" ? "physicalHpMax" : "composureMax";
        draft.vitals[curKey] = Math.max(0, Math.min(draft.vitals[maxKey], draft.vitals[curKey] + delta));
      },
      () => applyVitalChangeRpc(char.id, type, delta, char.version)
    );
    updateDynamicElements(char);
  } catch (err: any) {
    showToast(`Gagal memperbarui status: ${err.message}`, "error");
  }
}

function updateDynamicElements(char: Character) {
  const vitals = char.vitals;
  const finances = char.finances;

  // HP
  const curHpEl = document.getElementById("sheetPhysHpCurrent");
  const maxHpEl = document.getElementById("sheetPhysHpMax");
  const hpBarEl = document.getElementById("sheetPhysHpBar");
  if (curHpEl) curHpEl.textContent = String(vitals.physicalHpCurrent);
  if (maxHpEl) maxHpEl.textContent = String(vitals.physicalHpMax);
  if (hpBarEl) {
    const hpPercent = Math.max(0, Math.min(100, Math.round((vitals.physicalHpCurrent / Math.max(1, vitals.physicalHpMax)) * 100)));
    hpBarEl.style.width = `${hpPercent}%`;
  }

  // Composure
  const curCompEl = document.getElementById("sheetComposureCurrent");
  const maxCompEl = document.getElementById("sheetComposureMax");
  const compBarEl = document.getElementById("sheetComposureBar");
  if (curCompEl) curCompEl.textContent = String(vitals.composureCurrent);
  if (maxCompEl) maxCompEl.textContent = String(vitals.composureMax);
  if (compBarEl) {
    const compPercent = Math.max(0, Math.min(100, Math.round((vitals.composureCurrent / Math.max(1, vitals.composureMax)) * 100)));
    compBarEl.style.width = `${compPercent}%`;
  }

  // Rest Dice
  const restDiceUsedEl = document.getElementById("sheetRestDiceUsed");
  if (restDiceUsedEl) {
    restDiceUsedEl.textContent = `${vitals.restDiceTotal - vitals.restDiceSpent}/${vitals.restDiceTotal}`;
  }

  // Finances
  const curDailyEl = document.getElementById("sheetDisplayMoneyDaily");
  const curSavEl = document.getElementById("sheetDisplayMoneySavings");
  const curJobEl = document.getElementById("sheetDisplayMoneyJob");
  if (curDailyEl) curDailyEl.textContent = `¥${finances.dailyMoneyAmount.toLocaleString()}`;
  if (curSavEl) curSavEl.textContent = `¥${finances.savingsAmount.toLocaleString()}`;
  if (curJobEl) curJobEl.textContent = finances.job;

  // Backstory
  const bsEl = document.getElementById("sheetDisplayBackstory");
  if (bsEl) bsEl.textContent = char.backstory_fields.backstory || "Belum ada catatan kisah masa lalu.";

  // Grade Badge & Proficiency Bonus
  const gradeBadge = document.getElementById("sheetGradeBadge");
  if (gradeBadge) gradeBadge.textContent = getLevelLabel(char.level);
  const profBadge = document.getElementById("sheetProfBonus");
  if (profBadge) profBadge.textContent = `+${calculateProficiencyBonus(char.level)}`;

  // Refresh Moves List
  const movesList = document.getElementById("sheetMovesList");
  if (movesList) movesList.innerHTML = renderMovesList(char, activeMoveFilter);
}

// ----------------------------------------------------------------------------
// Local Storage Death / Meltdown Saves State Helpers
// ----------------------------------------------------------------------------
function getStoredSaves(charId: string) {
  try {
    const raw = localStorage.getItem(`damsel_saves_${charId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { deathSucc: 0, deathFail: 0, mentalSucc: 0, mentalFail: 0 };
}

function saveStoredSaves(charId: string) {
  try {
    const deathSucc = [1, 2, 3].filter(i => (document.getElementById(`deathSaveSucc${i}`) as HTMLInputElement)?.checked).length;
    const deathFail = [1, 2, 3].filter(i => (document.getElementById(`deathSaveFail${i}`) as HTMLInputElement)?.checked).length;
    const mentalSucc = [1, 2, 3].filter(i => (document.getElementById(`mentalSaveSucc${i}`) as HTMLInputElement)?.checked).length;
    const mentalFail = [1, 2, 3].filter(i => (document.getElementById(`mentalSaveFail${i}`) as HTMLInputElement)?.checked).length;
    localStorage.setItem(`damsel_saves_${charId}`, JSON.stringify({ deathSucc, deathFail, mentalSucc, mentalFail }));
  } catch (e) {}
}

function capitalize(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
