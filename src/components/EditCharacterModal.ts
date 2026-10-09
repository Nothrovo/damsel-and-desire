import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";
import {
  getCompendiumArchetypes,
  getCompendiumSocialClasses
} from "../api/compendium";
import { ALL_FEATS } from "../data/featCompendium";
import { isDmPinValid } from "../types";
import { featPickerModal } from "./FeatPickerModal";
import { getArchetypeStatBonus, calculateEffectiveStats } from "../rules/progression";
import type {
  Character,
  ArchetypeCompendium,
  SocialClassCompendium,
  CharacterChangeLogEntry
} from "../types";

export class EditCharacterModal {
  private modalEl: HTMLElement | null = null;
  private isDirty: boolean = false;
  private compArchetypes: ArchetypeCompendium[] = [];
  private compSocial: SocialClassCompendium[] = [];

  render(): string {
    return `
      <div id="editCharacterModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card" style="max-width:800px;width:95%;max-height:90vh;overflow-y:auto;">
          <div class="modal-header">
            <h3>✏️ Mode Sunting Karakter (Edit Mode)</h3>
            <button class="modal-close-btn" id="closeEditCharModalBtn">&times;</button>
          </div>
          <div class="modal-body" id="editCharModalBody">
            <!-- Form populated dynamically -->
          </div>
          <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
            <button class="btn btn-secondary" id="cancelEditCharModalBtn">Batal</button>
            <button class="btn btn-primary" id="saveEditCharModalBtn">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    `;
  }

  async attachEvents() {
    this.modalEl = document.getElementById("editCharacterModal");
    document.getElementById("closeEditCharModalBtn")?.addEventListener("click", () => this.tryClose());
    document.getElementById("cancelEditCharModalBtn")?.addEventListener("click", () => this.tryClose());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.tryClose();
    });

    document.getElementById("saveEditCharModalBtn")?.addEventListener("click", () => this.saveChanges());

    // Preload compendiums for dropdowns
    try {
      this.compArchetypes = await getCompendiumArchetypes();
      this.compSocial = await getCompendiumSocialClasses();
    } catch (e) {
      // Ignored, will use fallbacks
    }
  }

  show() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    this.isDirty = false;
    this.renderForm(char);
    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  private tryClose() {
    if (this.isDirty) {
      const confirmDiscard = window.confirm("Terdapat perubahan yang belum disimpan. Yakin ingin membatalkan?");
      if (!confirmDiscard) return;
    }
    this.hide();
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
    this.isDirty = false;
  }

  private markDirty() {
    this.isDirty = true;
  }

  private renderForm(char: Character) {
    const bodyEl = document.getElementById("editCharModalBody");
    if (!bodyEl) return;

    const abilities = char.abilities || ({} as any);
    const backstory = char.backstory_fields || ({} as any);

    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        
        <!-- Identity Section -->
        <div class="card p-3" style="background:rgba(255,255,255,0.02);">
          <h4 style="margin:0 0 0.75rem 0;font-size:0.95rem;color:var(--text-primary);">Identitas Dasar</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Nama Karakter:</label>
              <input type="text" id="editCharNameInput" class="input-text" value="${escapeAttr(char.name)}" style="width:100%;">
            </div>
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">URL Avatar:</label>
              <input type="text" id="editCharAvatarInput" class="input-text" value="${escapeAttr(char.avatar_path || '')}" style="width:100%;" placeholder="https://...">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-top:0.75rem;">
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Arketipe:</label>
              <select id="editCharArchetypeSelect" class="input-text" style="width:100%;">
                ${this.compArchetypes.map(a => `
                  <option value="${a.id}" ${char.archetype_id === a.id ? 'selected' : ''}>${a.name}</option>
                `).join("")}
              </select>
            </div>
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Kelas Sosial:</label>
              <select id="editCharSocialSelect" class="input-text" style="width:100%;">
                ${this.compSocial.map(s => `
                  <option value="${s.id}" ${char.social_class_id === s.id ? 'selected' : ''}>${s.name}</option>
                `).join("")}
              </select>
            </div>
          </div>
        </div>

        <!-- Ability Scores Section -->
        <div class="card p-3" style="background:rgba(255,255,255,0.02);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
            <h4 style="margin:0;font-size:0.95rem;color:var(--text-primary);">Skor Atribut Dasar</h4>
            <span style="font-size:0.75rem;color:var(--text-muted);">Bonus Archetype ditambahkan otomatis ke total akhir</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:0.5rem;">
            ${(["physique", "intelligent", "looks", "mind", "talent", "luck"] as const).map(stat => {
              const rawStat = (abilities as any)?.[stat];
              const score = typeof rawStat === "object" ? rawStat?.score : (rawStat ?? 10);
              const bonus = getArchetypeStatBonus(char.archetype_id)[stat] || 0;
              return `
                <div style="text-align:center;">
                  <label style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">${stat.slice(0, 3)}</label>
                  <input type="number" id="editCharStat_${stat}" class="input-text" min="3" max="24" value="${score}" style="width:100%;text-align:center;font-weight:700;">
                  <div id="editCharStatPreview_${stat}" style="font-size:0.68rem;color:var(--text-muted);margin-top:3px;">
                    ${bonus > 0 ? `<span style="color:var(--rose-light);font-weight:700;">+${bonus}</span> = <strong>${score + bonus}</strong>` : `Total: <strong>${score}</strong>`}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Backstory & Persona Section -->
        <div class="card p-3" style="background:rgba(255,255,255,0.02);">
          <h4 style="margin:0 0 0.75rem 0;font-size:0.95rem;color:var(--text-primary);">Kisah & Kepribadian (Backstory)</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Kepribadian (Personality):</label>
              <textarea id="editCharPersonalityInput" class="input-textarea" rows="2" style="width:100%;">${escapeAttr(backstory.personality || '')}</textarea>
            </div>
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Cita-cita (Ideals):</label>
              <textarea id="editCharIdealsInput" class="input-textarea" rows="2" style="width:100%;">${escapeAttr(backstory.ideals || '')}</textarea>
            </div>
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Ikatan (Bonds):</label>
              <textarea id="editCharBondsInput" class="input-textarea" rows="2" style="width:100%;">${escapeAttr(backstory.bonds || '')}</textarea>
            </div>
            <div class="form-group">
              <label style="font-size:0.8rem;color:var(--text-muted);">Kelemahan (Flaws):</label>
              <textarea id="editCharFlawsInput" class="input-textarea" rows="2" style="width:100%;">${escapeAttr(backstory.flaws || '')}</textarea>
            </div>
          </div>
          <div class="form-group" style="margin-top:0.75rem;">
            <label style="font-size:0.8rem;color:var(--text-muted);">Kisah Masa Lalu Lengkap (Backstory):</label>
            <textarea id="editCharBackstoryInput" class="input-textarea" rows="4" style="width:100%;">${escapeAttr(backstory.backstory || '')}</textarea>
          </div>
        </div>

        <!-- Feats & Retraining Section -->
        <div class="card p-3" style="background:rgba(255,255,255,0.02);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;">
            <h4 style="margin:0;font-size:0.95rem;color:var(--text-primary);">🎯 Feats &amp; Retraining</h4>
            <span class="badge" style="background:rgba(225,29,72,0.15);color:#fb7185;font-size:0.7rem;padding:0.2rem 0.5rem;border-radius:4px;font-weight:700;">Wajib Izin DM (PIN)</span>
          </div>
          <p class="text-xs text-muted" style="margin-bottom:0.75rem;line-height:1.4;">
            Penggantian (retrain) feat dapat dilakukan atas izin Dungeon Master dengan verifikasi PIN DM resmi.
          </p>
          ${(char.feats || []).length === 0 ? `
            <p class="text-xs text-muted">Karakter belum memiliki feat yang dapat di-retrain.</p>
          ` : `
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${(char.feats || []).map(f => {
                const featDef = ALL_FEATS.find(fd => fd.id === f.featId);
                const grant = (char.featGrants || []).find(g => g.id === f.grantId);
                return `
                  <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);border:1px solid var(--border-subtle);flex-wrap:wrap;gap:0.5rem;">
                    <div>
                      <strong style="color:var(--text-main);font-size:0.85rem;">${featDef?.name || f.featId}</strong>
                      <span class="text-xs text-muted" style="margin-left:6px;">(${featDef?.category || 'feat'})</span>
                    </div>
                    <button type="button" class="btn btn-xs btn-secondary btn-retrain-feat" data-grant-id="${f.grantId}" data-category="${grant?.category || featDef?.category || 'general'}" data-grade="${grant?.grade || ''}">
                      🔄 Retrain Feat
                    </button>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>

      </div>
    `;

    const refreshStatPreviews = () => {
      const archSel = document.getElementById("editCharArchetypeSelect") as HTMLSelectElement | null;
      const archId = archSel?.value || char.archetype_id;
      const bonusMap = getArchetypeStatBonus(archId);
      (["physique", "intelligent", "looks", "mind", "talent", "luck"] as const).forEach(stat => {
        const inp = document.getElementById(`editCharStat_${stat}`) as HTMLInputElement | null;
        const prev = document.getElementById(`editCharStatPreview_${stat}`);
        const base = inp ? (parseInt(inp.value, 10) || 10) : 10;
        const bonus = bonusMap[stat] || 0;
        if (prev) {
          prev.innerHTML = bonus > 0
            ? `<span style="color:var(--rose-light);font-weight:700;">+${bonus}</span> = <strong>${base + bonus}</strong>`
            : `Total: <strong>${base}</strong>`;
        }
      });
    };

    // Listen to changes to toggle dirty state and refresh previews
    bodyEl.querySelectorAll("input, select, textarea").forEach(el => {
      el.addEventListener("input", () => {
        this.markDirty();
        refreshStatPreviews();
      });
      el.addEventListener("change", () => {
        this.markDirty();
        refreshStatPreviews();
      });
    });

    // Retrain button click handlers
    bodyEl.querySelectorAll(".btn-retrain-feat").forEach((btn: any) => {
      btn.addEventListener("click", () => {
        const pin = prompt("Masukkan PIN DM untuk mengizinkan Retrain Feat:");
        if (!pin) return;
        if (!isDmPinValid(pin)) {
          showToast("PIN DM salah. Retrain Feat dibatalkan.", "error");
          return;
        }

        const grantId = btn.getAttribute("data-grant-id");
        const category = btn.getAttribute("data-category");
        const gradeStr = btn.getAttribute("data-grade");
        const grade = gradeStr ? parseInt(gradeStr, 10) : undefined;

        this.hide();
        featPickerModal.show({
          grantId,
          allowedCategory: category,
          grade,
          isRetrain: true,
          onSelect: () => {
            const cur = characterStore.currentCharacter;
            if (cur) {
              window.dispatchEvent(new CustomEvent("characterUpdated", { detail: cur }));
            }
          }
        });
      });
    });
  }

  private async saveChanges() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const nameInput = document.getElementById("editCharNameInput") as HTMLInputElement;
    const avatarInput = document.getElementById("editCharAvatarInput") as HTMLInputElement;
    const archetypeSelect = document.getElementById("editCharArchetypeSelect") as HTMLSelectElement;
    const socialSelect = document.getElementById("editCharSocialSelect") as HTMLSelectElement;

    const newName = nameInput ? nameInput.value.trim() : "";
    if (!newName) {
      showToast("Nama karakter tidak boleh kosong.", "error");
      return;
    }

    const statKeys = ["physique", "intelligent", "looks", "mind", "talent", "luck"] as const;
    const newAbilities: any = { ...char.abilities };
    for (const k of statKeys) {
      const input = document.getElementById(`editCharStat_${k}`) as HTMLInputElement;
      const val = input ? parseInt(input.value, 10) : 10;
      if (isNaN(val) || val < 1 || val > 30) {
        showToast(`Nilai atribut ${k} harus antara 1 dan 30.`, "error");
        return;
      }
      if (newAbilities[k] && typeof newAbilities[k] === "object") {
        newAbilities[k].score = val;
      } else {
        newAbilities[k] = val;
      }
    }

    const personalityInput = document.getElementById("editCharPersonalityInput") as HTMLTextAreaElement;
    const idealsInput = document.getElementById("editCharIdealsInput") as HTMLTextAreaElement;
    const bondsInput = document.getElementById("editCharBondsInput") as HTMLTextAreaElement;
    const flawsInput = document.getElementById("editCharFlawsInput") as HTMLTextAreaElement;
    const backstoryInput = document.getElementById("editCharBackstoryInput") as HTMLTextAreaElement;

    const newBackstory = {
      personality: personalityInput ? personalityInput.value.trim() : "",
      ideals: idealsInput ? idealsInput.value.trim() : "",
      bonds: bondsInput ? bondsInput.value.trim() : "",
      flaws: flawsInput ? flawsInput.value.trim() : "",
      backstory: backstoryInput ? backstoryInput.value.trim() : ""
    };

    const changelogEntry: CharacterChangeLogEntry = {
      timestamp: new Date().toISOString(),
      action: "EDIT_CHARACTER",
      description: "Memperbarui data profil, atribut, atau kisah karakter",
      previousValue: {
        name: char.name,
        archetype_id: char.archetype_id,
        social_class_id: char.social_class_id
      },
      newValue: {
        name: newName,
        archetype_id: archetypeSelect?.value || char.archetype_id,
        social_class_id: socialSelect?.value || char.social_class_id
      },
      source: "user"
    };

    const updatedChangelog = [...(char.changelog || []), changelogEntry];
    const nextArchId = archetypeSelect?.value || char.archetype_id;

    // Recalculate vitals max if abilities or archetype changed
    const candidateChar: Character = {
      ...char,
      archetype_id: nextArchId,
      abilities: newAbilities
    };
    const effective = calculateEffectiveStats(candidateChar);
    const oldHpMax = char.vitals?.physicalHpMax || effective.physicalHpMax;
    const oldCompMax = char.vitals?.composureMax || effective.composureMax;
    const newHpMax = effective.physicalHpMax;
    const newCompMax = effective.composureMax;
    const newVitals = {
      ...char.vitals,
      physicalHpMax: newHpMax,
      physicalHpCurrent: Math.min(newHpMax, Math.max(1, (char.vitals?.physicalHpCurrent || oldHpMax) + (newHpMax - oldHpMax))),
      composureMax: newCompMax,
      composureCurrent: Math.min(newCompMax, Math.max(1, (char.vitals?.composureCurrent || oldCompMax) + (newCompMax - oldCompMax)))
    };

    const updates: Partial<Character> = {
      name: newName,
      avatar_path: avatarInput ? avatarInput.value.trim() : char.avatar_path,
      archetype_id: nextArchId,
      social_class_id: socialSelect?.value || char.social_class_id,
      abilities: newAbilities,
      vitals: newVitals,
      backstory_fields: newBackstory,
      changelog: updatedChangelog
    };

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          Object.assign(draft, updates);
          draft.version = (draft.version || 1) + 1;
        },
        () => updateCharacterDirect(char.id, updates, char.version)
      );

      this.isDirty = false;
      this.hide();
      showToast("Karakter berhasil diperbarui!", "success");
    } catch (err: any) {
      showToast(`Gagal menyimpan perubahan: ${err.message}`, "error");
    }
  }
}

function escapeAttr(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const editCharacterModal = new EditCharacterModal();
