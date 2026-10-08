import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";
import { ALL_FEATS } from "../data/featCompendium";
import { checkFeatEligibility, takeFeat, grantFeat, retrainFeat } from "../rules/progression";
import type {
  Character,
  FeatDefinition,
  CharacterFeatTaken,
  FeatCategory,
  AbilityKey,
  FeatGrant
} from "../types";

export interface FeatPickerOptions {
  grantId?: string;
  allowedCategory?: FeatCategory | "any";
  grade?: number;
  isDmMode?: boolean;
  isRetrain?: boolean;
  onSelect?: (featId: string, choices?: CharacterFeatTaken["choices"]) => void;
}

export class FeatPickerModal {
  private modalEl: HTMLElement | null = null;
  private options: FeatPickerOptions | null = null;
  private selectedFeatId: string | null = null;
  private selectedSkills: string[] = [];
  private selectedSaves: string[] = [];
  private selectedLanguage: string = "";
  private currentSearch: string = "";
  private currentCategoryTab: string = "all";
  private currentStatFilter: string = "all";

  render(): string {
    return `
      <div id="featPickerModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card" style="max-width:960px;width:95%;max-height:92vh;display:flex;flex-direction:column;">
          <div class="modal-header" style="flex-shrink:0;">
            <h3 id="featPickerModalTitle">✨ Pilih Feat</h3>
            <button class="modal-close-btn" id="closeFeatPickerBtn">&times;</button>
          </div>

          <!-- FILTERS BAR -->
          <div style="padding:0.75rem 1.25rem;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);flex-shrink:0;">
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin-bottom:0.5rem;">
              <input type="text" id="featSearchInput" class="input-text" placeholder="🔍 Cari nama feat, kata kunci, efek..." style="flex:1;min-width:200px;font-size:0.85rem;padding:0.4rem 0.75rem;">
              <div id="featCategoryPills" style="display:flex;gap:0.35rem;flex-wrap:wrap;">
                <button class="filter-pill active" data-cat="all">SEMUA</button>
                <button class="filter-pill" data-cat="origin">ORIGIN (K10)</button>
                <button class="filter-pill" data-cat="general">GENERAL (K11-12)</button>
                <button class="filter-pill" data-cat="achievement">ACHIEVEMENT</button>
              </div>
            </div>

            <div id="featStatPillsRow" style="display:flex;gap:0.35rem;flex-wrap:wrap;align-items:center;">
              <span style="font-size:0.75rem;color:var(--text-muted);font-weight:700;margin-right:0.25rem;">STAT:</span>
              <button class="filter-pill active btn-xs" data-stat="all">Semua</button>
              <button class="filter-pill btn-xs" data-stat="physique">Physique</button>
              <button class="filter-pill btn-xs" data-stat="intelligent">Intelligent</button>
              <button class="filter-pill btn-xs" data-stat="looks">Looks</button>
              <button class="filter-pill btn-xs" data-stat="mind">Mind</button>
              <button class="filter-pill btn-xs" data-stat="talent">Talent</button>
              <button class="filter-pill btn-xs" data-stat="luck">Luck</button>
            </div>
          </div>

          <!-- FEAT LIST BODY -->
          <div class="modal-body" id="featPickerModalBody" style="flex:1;overflow-y:auto;padding:1.25rem;">
            <!-- Feat cards injected dynamically -->
          </div>

          <!-- FOOTER -->
          <div class="modal-footer" style="flex-shrink:0;display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1.25rem;border-top:1px solid var(--border-subtle);background:var(--bg-surface);">
            <div id="featPickerSelectionSummary" style="font-size:0.85rem;color:var(--text-muted);">
              Belum ada feat yang dipilih.
            </div>
            <div style="display:flex;gap:0.5rem;">
              <button class="btn btn-secondary" id="cancelFeatPickerBtn">Batal</button>
              <button class="btn btn-primary" id="confirmFeatPickerBtn" disabled>Pilih Feat Ini</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("featPickerModal");
    document.getElementById("closeFeatPickerBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelFeatPickerBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    // Search input
    document.getElementById("featSearchInput")?.addEventListener("input", (e: any) => {
      this.currentSearch = (e.target.value || "").toLowerCase().trim();
      this.renderFeatsList();
    });

    // Category pills
    document.getElementById("featCategoryPills")?.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("featCategoryPills")?.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategoryTab = btn.getAttribute("data-cat") || "all";
        this.renderFeatsList();
      });
    });

    // Stat pills
    document.getElementById("featStatPillsRow")?.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("featStatPillsRow")?.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentStatFilter = btn.getAttribute("data-stat") || "all";
        this.renderFeatsList();
      });
    });

    document.getElementById("confirmFeatPickerBtn")?.addEventListener("click", () => this.confirmSelection());
  }

  show(options: FeatPickerOptions) {
    this.options = options;
    this.selectedFeatId = null;
    this.selectedSkills = [];
    this.selectedSaves = [];
    this.selectedLanguage = "";
    this.currentSearch = "";

    const searchInput = document.getElementById("featSearchInput") as HTMLInputElement;
    if (searchInput) searchInput.value = "";

    // Set initial category tab based on grant
    const cat = options.allowedCategory || "all";
    if (cat === "origin") {
      this.currentCategoryTab = "origin";
    } else if (cat === "general") {
      this.currentCategoryTab = "general";
    } else if (cat === "achievement") {
      this.currentCategoryTab = "achievement";
    } else {
      this.currentCategoryTab = "all";
    }

    // Sync UI pills
    document.getElementById("featCategoryPills")?.querySelectorAll(".filter-pill").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-cat") === this.currentCategoryTab);
    });

    // Modal title
    const titleEl = document.getElementById("featPickerModalTitle");
    if (titleEl) {
      if (options.isRetrain) {
        titleEl.innerHTML = "🔄 Retrain Feat (Pilih Feat Pengganti)";
      } else if (options.isDmMode) {
        titleEl.innerHTML = "👑 Anugerahi Feat Bebas (DM Mode)";
      } else if (options.grade) {
        const catLabel = options.allowedCategory === "origin" ? "Origin Feat" : "General Feat";
        titleEl.innerHTML = `✨ Pilih ${catLabel} (Kelas ${options.grade})`;
      } else {
        titleEl.innerHTML = "✨ Pilih Feat";
      }
    }

    this.renderFeatsList();
    this.updateConfirmBtn();

    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
    this.options = null;
    this.selectedFeatId = null;
  }

  private renderFeatsList() {
    const bodyEl = document.getElementById("featPickerModalBody");
    if (!bodyEl) return;

    const char = characterStore.currentCharacter;
    if (!char) {
      bodyEl.innerHTML = `<p style="text-align:center;color:var(--text-muted);">Karakter tidak ditemukan.</p>`;
      return;
    }

    const grant: FeatGrant | undefined = this.options?.grantId
      ? (char.featGrants || []).find(g => g.id === this.options?.grantId)
      : undefined;

    // Filter feats
    const filtered = ALL_FEATS.filter(feat => {
      // 1. Category filter
      if (this.currentCategoryTab !== "all" && feat.category !== this.currentCategoryTab) {
        return false;
      }
      // If regular player with specific allowed category (not DM mode), enforce it
      if (!this.options?.isDmMode && this.options?.allowedCategory && this.options.allowedCategory !== "any") {
        if (feat.category !== this.options.allowedCategory) return false;
      }

      // 2. Stat filter (for general feats)
      if (this.currentStatFilter !== "all") {
        if (feat.subcategory !== this.currentStatFilter) return false;
      }

      // 3. Search query
      if (this.currentSearch) {
        const matchName = feat.name.toLowerCase().includes(this.currentSearch);
        const matchDesc = feat.description.toLowerCase().includes(this.currentSearch);
        const matchManual = (feat.manualEffectText || "").toLowerCase().includes(this.currentSearch);
        const matchTags = (feat.tags || []).some(t => t.toLowerCase().includes(this.currentSearch));
        if (!matchName && !matchDesc && !matchManual && !matchTags) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      bodyEl.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--text-muted);">
          <div style="font-size:2rem;margin-bottom:0.5rem;">🔍</div>
          <p>Tidak ada feat yang cocok dengan pencarian atau filter yang dipilih.</p>
        </div>
      `;
      return;
    }

    bodyEl.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(360px, 1fr));gap:1rem;">
        ${filtered.map(feat => this.renderFeatCard(feat, char, grant)).join("")}
      </div>
    `;

    // Attach listeners
    bodyEl.querySelectorAll(".feat-card-picker").forEach(cardEl => {
      cardEl.addEventListener("click", (e: any) => {
        // Prevent click if clicking inside choices form
        if (e.target.closest(".feat-choice-form")) return;

        const featId = cardEl.getAttribute("data-feat-id");
        const isEligible = cardEl.getAttribute("data-eligible") === "true";
        if (featId && (isEligible || this.options?.isDmMode)) {
          this.selectFeat(featId);
        }
      });
    });

    // Choices inputs listeners (if selected feat has choices)
    this.attachChoiceListeners();
  }

  private renderFeatCard(feat: FeatDefinition, char: Character, grant?: FeatGrant): string {
    const isSelected = this.selectedFeatId === feat.id;
    const isAlreadyTaken = (char.feats || []).some(f => f.featId === feat.id);
    const eligibility = checkFeatEligibility(char, feat, grant);
    const canSelect = isAlreadyTaken ? false : (this.options?.isDmMode ? true : eligibility.eligible);

    // Badges
    const catBadgeColor = feat.category === "origin"
      ? "background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);"
      : feat.category === "achievement"
      ? "background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3);"
      : "background:rgba(225,29,72,0.15);color:#fb7185;border:1px solid rgba(225,29,72,0.3);";

    const catLabel = feat.category === "origin"
      ? "ORIGIN"
      : feat.category === "achievement"
      ? "ACHIEVEMENT"
      : `GENERAL (${(feat.subcategory || "").toUpperCase()})`;

    return `
      <div class="feat-card-picker card ${isSelected ? 'selected' : ''} ${!canSelect ? 'dimmed' : ''}"
           data-feat-id="${feat.id}"
           data-eligible="${canSelect}"
           style="cursor:${canSelect ? 'pointer' : 'not-allowed'};border:2px solid ${isSelected ? 'var(--rose-primary)' : 'var(--border-card)'};background:${isSelected ? 'rgba(225,29,72,0.06)' : 'var(--bg-card)'};padding:1.15rem;border-radius:var(--radius-md);transition:all 0.2s ease;display:flex;flex-direction:column;justify-content:space-between;opacity:${canSelect ? '1' : '0.55'};">
        <div>
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;gap:0.5rem;">
            <div>
              <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.25rem;">
                <span class="badge" style="font-size:0.65rem;padding:0.15rem 0.45rem;border-radius:4px;font-weight:800;${catBadgeColor}">${catLabel}</span>
                ${feat.bonusAbility ? `
                  <span class="badge" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);font-size:0.65rem;padding:0.15rem 0.45rem;border-radius:4px;font-weight:700;">
                    +${feat.bonusAbility.value} ${feat.bonusAbility.ability.toUpperCase()} (Cap ${feat.bonusAbility.cap})
                  </span>
                ` : ''}
              </div>
              <h4 style="margin:0;color:var(--text-primary);font-size:1.05rem;font-weight:800;">${feat.name}</h4>
            </div>
            <input type="radio" name="featPickerRadio" value="${feat.id}" ${isSelected ? 'checked' : ''} ${!canSelect ? 'disabled' : ''} style="margin-top:4px;">
          </div>

          <!-- Description -->
          <p style="font-size:0.85rem;color:var(--text-secondary);margin:0.5rem 0;line-height:1.45;">
            ${feat.description}
          </p>

          ${feat.manualEffectText ? `
            <div style="background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);font-size:0.8rem;color:var(--text-muted);border-left:3px solid var(--rose-primary);margin:0.5rem 0;line-height:1.4;">
              ${feat.manualEffectText}
            </div>
          ` : ''}

          <!-- Drawbacks / Penalties Alert Banner -->
          ${((feat.drawbacks?.penaltyText || feat.drawbackText) || (feat.category === "achievement" && feat.requirementText)) ? `
            <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);font-size:0.78rem;color:#fca5a5;margin:0.5rem 0;line-height:1.35;">
              ${(feat.drawbacks?.penaltyText || feat.drawbackText) ? `<div><strong>⚠️ Penalti/Konsekuensi:</strong> ${feat.drawbacks?.penaltyText || feat.drawbackText}</div>` : ''}
              ${feat.requirementText ? `<div style="margin-top:2px;"><strong>📜 Syarat Cerita:</strong> ${feat.requirementText}</div>` : ''}
            </div>
          ` : ''}

          <!-- Eligibility Status -->
          <div style="margin-top:0.5rem;">
            ${isAlreadyTaken ? `
              <span style="font-size:0.75rem;color:#94a3b8;font-weight:700;">🔒 Sudah Diambil</span>
            ` : !eligibility.eligible && !this.options?.isDmMode ? `
              <div style="font-size:0.75rem;color:#f87171;line-height:1.3;">
                ${eligibility.reasons.map(r => `<div>✗ ${r}</div>`).join("")}
              </div>
            ` : `
              <span style="font-size:0.75rem;color:#34d399;font-weight:700;">✓ Memenuhi Syarat</span>
            `}
          </div>
        </div>

        <!-- Interactive Choice Section (if selected & requires choices) -->
        ${isSelected && feat.choices ? this.renderChoiceForm(feat) : ''}
      </div>
    `;
  }

  private renderChoiceForm(feat: FeatDefinition): string {
    const ch = feat.choices;
    if (!ch) return "";

    return `
      <div class="feat-choice-form" style="margin-top:0.75rem;padding:0.75rem;background:var(--bg-surface);border-radius:var(--radius-xs);border:1px dashed var(--rose-primary);">
        <div style="font-size:0.8rem;font-weight:800;color:var(--rose-primary);margin-bottom:0.4rem;">
          ⚙️ Pilihan Wajib (${ch.count} ${ch.type}):
        </div>
        <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem;">
          ${ch.description || `Pilih ${ch.count} opsi dari daftar.`}
        </p>

        ${ch.type === "skill" ? `
          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:0.35rem;">
            ${(ch.pool || []).map(sk => `
              <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.78rem;cursor:pointer;">
                <input type="checkbox" class="feat-skill-cb" value="${sk}" ${this.selectedSkills.includes(sk) ? 'checked' : ''}>
                <span>${sk.toUpperCase()}</span>
              </label>
            `).join("")}
          </div>
        ` : ch.type === "save" ? `
          <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:0.35rem;">
            ${(ch.pool || ["physique", "intelligent", "looks", "mind", "talent", "luck"]).map(sv => `
              <label style="display:flex;align-items:center;gap:0.35rem;font-size:0.78rem;cursor:pointer;">
                <input type="radio" name="featSaveRadio" class="feat-save-radio" value="${sv}" ${this.selectedSaves.includes(sv) ? 'checked' : ''}>
                <span>${sv.toUpperCase()}</span>
              </label>
            `).join("")}
          </div>
        ` : ch.type === "language" ? `
          <input type="text" id="featLangInput" class="input-text" placeholder="Masukkan nama bahasa (misal: Bahasa Inggris, Mandarin)..." value="${this.selectedLanguage}" style="width:100%;font-size:0.8rem;padding:0.35rem 0.5rem;">
        ` : ''}
      </div>
    `;
  }

  private selectFeat(featId: string) {
    this.selectedFeatId = featId;
    this.selectedSkills = [];
    this.selectedSaves = [];
    this.selectedLanguage = "";
    this.renderFeatsList();
    this.updateConfirmBtn();
  }

  private attachChoiceListeners() {
    const bodyEl = document.getElementById("featPickerModalBody");
    if (!bodyEl) return;

    // Skill checkboxes
    bodyEl.querySelectorAll(".feat-skill-cb").forEach(cb => {
      cb.addEventListener("change", (e: any) => {
        const val = e.target.value;
        if (e.target.checked) {
          if (!this.selectedSkills.includes(val)) this.selectedSkills.push(val);
        } else {
          this.selectedSkills = this.selectedSkills.filter(s => s !== val);
        }
        this.updateConfirmBtn();
      });
    });

    // Save radio
    bodyEl.querySelectorAll(".feat-save-radio").forEach(rb => {
      rb.addEventListener("change", (e: any) => {
        if (e.target.checked) {
          this.selectedSaves = [e.target.value];
          this.updateConfirmBtn();
        }
      });
    });

    // Language input
    document.getElementById("featLangInput")?.addEventListener("input", (e: any) => {
      this.selectedLanguage = e.target.value.trim();
      this.updateConfirmBtn();
    });
  }

  private updateConfirmBtn() {
    const confirmBtn = document.getElementById("confirmFeatPickerBtn") as HTMLButtonElement;
    const summaryEl = document.getElementById("featPickerSelectionSummary");
    if (!confirmBtn || !summaryEl) return;

    if (!this.selectedFeatId) {
      confirmBtn.disabled = true;
      summaryEl.innerText = "Belum ada feat yang dipilih.";
      return;
    }

    const feat = ALL_FEATS.find(f => f.id === this.selectedFeatId);
    if (!feat) {
      confirmBtn.disabled = true;
      return;
    }

    // Check choices completion
    let choicesReady = true;
    let choiceReason = "";

    if (feat.choices) {
      if (feat.choices.type === "skill") {
        if (this.selectedSkills.length !== feat.choices.count) {
          choicesReady = false;
          choiceReason = `Wajib memilih ${feat.choices.count} skill (${this.selectedSkills.length}/${feat.choices.count} dipilih).`;
        }
      } else if (feat.choices.type === "save") {
        if (this.selectedSaves.length !== feat.choices.count) {
          choicesReady = false;
          choiceReason = `Wajib memilih 1 saving throw.`;
        }
      } else if (feat.choices.type === "language") {
        if (!this.selectedLanguage) {
          choicesReady = false;
          choiceReason = "Wajib mengisi nama bahasa.";
        }
      }
    }

    if (!choicesReady) {
      confirmBtn.disabled = true;
      summaryEl.innerHTML = `<span style="color:#f87171;">⚠️ ${choiceReason}</span>`;
      return;
    }

    confirmBtn.disabled = false;
    summaryEl.innerHTML = `Terpilih: <strong style="color:var(--text-primary);">${feat.name}</strong>`;
  }

  private async confirmSelection() {
    if (!this.selectedFeatId) return;
    const char = characterStore.currentCharacter;
    if (!char) return;

    const feat = ALL_FEATS.find(f => f.id === this.selectedFeatId);
    if (!feat) return;

    const choicesPayload: CharacterFeatTaken["choices"] = {};
    if (feat.choices) {
      if (feat.choices.type === "skill") choicesPayload.skills = this.selectedSkills;
      if (feat.choices.type === "save") choicesPayload.saves = this.selectedSaves;
      if (feat.choices.type === "language") choicesPayload.language = this.selectedLanguage;
    }

    try {
      showToast(`Menerapkan feat ${feat.name}...`, "info");

      let updatedChar: Character;

      if (this.options?.isRetrain && this.options?.grantId) {
        // Retrain Feat
        const retrainRes = retrainFeat(char, this.options.grantId, feat.id, choicesPayload);
        updatedChar = retrainRes.character;
      } else if (this.options?.isDmMode) {
        // DM Award
        const grantRes = grantFeat(char, "dm", {
          featId: feat.id,
          choices: choicesPayload,
          notes: "Dianugerahkan langsung oleh DM"
        });
        updatedChar = grantRes.character;
      } else if (this.options?.grantId) {
        // Regular grant
        const takeRes = takeFeat(char, this.options.grantId, feat.id, choicesPayload);
        updatedChar = takeRes.character;
      } else {
        throw new Error("Tidak ada slot Feat grant yang valid.");
      }

      await updateCharacterDirect(updatedChar.id, {
        abilities: updatedChar.abilities,
        proficient_skills: updatedChar.proficient_skills,
        proficient_saves: updatedChar.proficient_saves,
        feats: updatedChar.feats,
        feat_grants: updatedChar.featGrants,
        feat_usage: updatedChar.featUsage,
        vitals: updatedChar.vitals,
        changelog: updatedChar.changelog
      }, updatedChar.version);

      characterStore.setCurrentCharacter(updatedChar);

      showToast(this.options?.isRetrain ? `🔄 Berhasil mengganti Feat menjadi: ${feat.name}!` : `🎉 Berhasil mengambil Feat: ${feat.name}!`, "success");

      if (this.options?.onSelect) {
        this.options.onSelect(feat.id, choicesPayload);
      }

      this.hide();

      // Trigger re-render of character sheet if event listener is present
      window.dispatchEvent(new CustomEvent("characterUpdated", { detail: updatedChar }));
    } catch (err: any) {
      showToast(`Gagal mengambil feat: ${err.message}`, "error");
    }
  }
}

export const featPickerModal = new FeatPickerModal();
