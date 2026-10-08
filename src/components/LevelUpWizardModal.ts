import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";
import {
  canLevelUp,
  previewLevelUp,
  levelUp,
  getLevelLabel,
  resolveEkskulData
} from "../rules/progression";
import type { Character, SubclassCompendium } from "../types";

export class LevelUpWizardModal {
  private modalEl: HTMLElement | null = null;
  private selectedSubclassId: string | null = null;

  render(): string {
    return `
      <div id="levelUpWizardModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card" style="max-width:760px;width:95%;">
          <div class="modal-header">
            <h3>🎓 Naik Kelas / Level-Up Wizard</h3>
            <button class="modal-close-btn" id="closeLevelUpModalBtn">&times;</button>
          </div>
          <div class="modal-body" id="levelUpModalBody">
            <!-- Injected dynamically -->
          </div>
          <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
            <button class="btn btn-secondary" id="cancelLevelUpModalBtn">Batal</button>
            <button class="btn btn-primary" id="confirmLevelUpModalBtn">Konfirmasi Naik Kelas</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("levelUpWizardModal");
    document.getElementById("closeLevelUpModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelLevelUpModalBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    document.getElementById("confirmLevelUpModalBtn")?.addEventListener("click", () => this.executeLevelUp());
  }

  show() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const eligibility = canLevelUp(char);
    if (!eligibility.can) {
      showToast(eligibility.reason || "Karakter tidak dapat naik level.", "warning");
      return;
    }

    this.selectedSubclassId = char.subclass_id || null;
    this.renderWizardContent(char);
    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  private renderWizardContent(char: Character) {
    const bodyEl = document.getElementById("levelUpModalBody");
    if (!bodyEl) return;

    const preview = previewLevelUp(char, { subclassId: this.selectedSubclassId || undefined });
    const ekskul = resolveEkskulData(char.ekskul_id);
    const requiresSubclassPick = preview.nextGrade >= 11 && !char.subclass_id;

    bodyEl.innerHTML = `
      <!-- Level Step Header -->
      <div class="level-up-header-banner" style="background:linear-gradient(135deg, rgba(225,29,72,0.15), rgba(168,85,247,0.15));border:1px solid var(--rose-primary);border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <span style="font-size:0.8rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;letter-spacing:1px;">Kenaikan Tingkat</span>
          <h2 style="margin:0.25rem 0 0 0;font-size:1.5rem;color:var(--text-primary);">
            ${getLevelLabel(preview.currentLevel)} → <span style="color:var(--rose-light);">${getLevelLabel(preview.nextLevel)}</span>
          </h2>
        </div>
        <div style="display:flex;gap:1rem;font-size:0.9rem;">
          <div style="background:rgba(0,0,0,0.3);padding:0.4rem 0.8rem;border-radius:6px;text-align:center;">
            <div style="font-size:0.75rem;color:var(--text-muted);">PROFICIENCY</div>
            <div style="font-weight:700;color:var(--accent-color);">+${preview.pbNext}</div>
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:0.4rem 0.8rem;border-radius:6px;text-align:center;">
            <div style="font-size:0.75rem;color:var(--text-muted);">REST DICE</div>
            <div style="font-weight:700;color:#60a5fa;">${preview.restDiceNext} Dadu</div>
          </div>
        </div>
      </div>

      <!-- Stat Growth Delta Cards -->
      <div class="stat-growth-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div class="card p-3" style="background:rgba(239,68,68,0.06);border-color:rgba(239,68,68,0.2);">
          <div style="font-size:0.75rem;color:#f87171;font-weight:700;text-transform:uppercase;">PHYSICAL HP MAX</div>
          <div style="display:flex;align-items:baseline;gap:0.5rem;margin-top:0.25rem;">
            <span style="font-size:1.4rem;font-weight:700;color:var(--text-primary);">${preview.hpMaxNext}</span>
            <span style="color:#4ade80;font-weight:700;font-size:0.9rem;">(+${preview.hpDelta})</span>
            <span style="font-size:0.8rem;color:var(--text-muted);margin-left:auto;">Sebelumnya: ${preview.hpMaxCurrent}</span>
          </div>
        </div>

        <div class="card p-3" style="background:rgba(168,85,247,0.06);border-color:rgba(168,85,247,0.2);">
          <div style="font-size:0.75rem;color:#c084fc;font-weight:700;text-transform:uppercase;">COMPOSURE MAX</div>
          <div style="display:flex;align-items:baseline;gap:0.5rem;margin-top:0.25rem;">
            <span style="font-size:1.4rem;font-weight:700;color:var(--text-primary);">${preview.composureMaxNext}</span>
            <span style="color:#4ade80;font-weight:700;font-size:0.9rem;">(+${preview.composureDelta})</span>
            <span style="font-size:0.8rem;color:var(--text-muted);margin-left:auto;">Sebelumnya: ${preview.composureMaxCurrent}</span>
          </div>
        </div>
      </div>

      <!-- Required Subclass Selection (if advancing into Grade 11 without a subclass) -->
      ${requiresSubclassPick ? `
        <div class="subclass-pick-section" style="margin-bottom:1.25rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius-md);padding:1rem;">
          <h4 style="margin:0 0 0.5rem 0;color:#fbbf24;display:flex;align-items:center;gap:0.5rem;">
            <span>⚔️</span> Peminatan Subclass (Wajib di Kelas 11)
          </h4>
          <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 1rem 0;">
            Karaktermu melangkah ke Kelas 11. Tentukan 1 dari 2 peminatan ekskul ${ekskul?.name || ""}:
          </p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            ${(ekskul?.subclasses || []).map(sc => this.renderSubclassRadio(sc)).join("")}
          </div>
        </div>
      ` : ''}

      <!-- Newly Unlocked Moves Preview -->
      <div class="unlocked-moves-section">
        <h4 style="font-size:0.9rem;text-transform:uppercase;color:var(--text-muted);margin:0 0 0.5rem 0;letter-spacing:0.5px;">
          Jurus Baru yang Terbuka
        </h4>
        ${preview.newlyUnlockedMoves.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            ${preview.newlyUnlockedMoves.map(m => `
              <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-card);border-radius:6px;padding:0.75rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:700;color:var(--text-primary);">${m.name}</span>
                  <span class="badge" style="background:rgba(34,197,94,0.15);color:#4ade80;font-size:0.75rem;">
                    🔓 Terbuka di Level ${preview.nextLevel}
                  </span>
                </div>
                <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;">${m.desc}</div>
              </div>
            `).join("")}
          </div>
        ` : `
          <p style="font-size:0.85rem;color:var(--text-muted);font-style:italic;">
            Peningkatan semester fokus pada penguatan HP dan Composure (+${preview.hpDelta} HP, +${preview.composureDelta} Composure). Jurus baru berikutnya terbuka saat naik ke tahun ajaran baru!
          </p>
        `}
      </div>
    `;

    // Attach subclass selection events if rendered
    if (requiresSubclassPick) {
      bodyEl.querySelectorAll(".subclass-radio-card").forEach(el => {
        el.addEventListener("click", () => {
          const scId = el.getAttribute("data-subclass-id");
          if (scId) {
            this.selectedSubclassId = scId;
            this.renderWizardContent(char);
          }
        });
      });
    }

    const confirmBtn = document.getElementById("confirmLevelUpModalBtn") as HTMLButtonElement;
    if (confirmBtn) {
      confirmBtn.disabled = requiresSubclassPick && !this.selectedSubclassId;
    }
  }

  private renderSubclassRadio(sc: SubclassCompendium): string {
    const isSelected = this.selectedSubclassId === sc.id;
    return `
      <div class="subclass-radio-card card ${isSelected ? 'selected' : ''}" 
           data-subclass-id="${sc.id}"
           style="cursor:pointer;border:2px solid ${isSelected ? 'var(--rose-primary)' : 'var(--border-card)'};background:${isSelected ? 'rgba(225,29,72,0.1)' : 'var(--bg-card)'};padding:0.8rem;border-radius:6px;transition:all 0.15s ease;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--text-primary);font-size:0.95rem;">${sc.name}</strong>
          <input type="radio" name="wizardSubclassRadio" value="${sc.id}" ${isSelected ? 'checked' : ''}>
        </div>
        <div style="font-size:0.75rem;color:var(--rose-light);font-style:italic;margin-top:2px;">${sc.tagline || ""}</div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin:0.4rem 0 0 0;line-height:1.3;">
          ${sc.identity_desc || sc.description || ""}
        </p>
      </div>
    `;
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  private async executeLevelUp() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    try {
      const { character: updatedChar, changelogEntry } = levelUp(char, {
        subclassId: this.selectedSubclassId || undefined
      });

      await characterStore.runOptimisticUpdate(
        (draft) => {
          draft.level = updatedChar.level;
          draft.grade = updatedChar.grade;
          draft.subclass_id = updatedChar.subclass_id;
          draft.vitals = updatedChar.vitals;
          draft.schemaVersion = updatedChar.schemaVersion;
          draft.version = updatedChar.version;
          draft.changelog = updatedChar.changelog;
          draft.updated_at = updatedChar.updated_at;
        },
        () => updateCharacterDirect(char.id, {
          level: updatedChar.level,
          grade: updatedChar.grade,
          subclass_id: updatedChar.subclass_id,
          vitals: updatedChar.vitals,
          schemaVersion: updatedChar.schemaVersion,
          changelog: updatedChar.changelog
        }, char.version)
      );

      this.hide();
      showToast(`🎉 Selamat! ${char.name} berhasil naik ke ${getLevelLabel(updatedChar.level)}!`, "success");
    } catch (err: any) {
      showToast(`Gagal naik level: ${err.message}`, "error");
    }
  }
}

export const levelUpWizardModal = new LevelUpWizardModal();
