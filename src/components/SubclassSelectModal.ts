import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";
import { resolveEkskulData } from "../rules/progression";
import type { Character, SubclassCompendium, CharacterChangeLogEntry } from "../types";

export class SubclassSelectModal {
  private modalEl: HTMLElement | null = null;
  private selectedSubclassId: string | null = null;
  private onSelectCallback?: (subclassId: string) => void;

  render(): string {
    return `
      <div id="subclassSelectModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card" style="max-width:850px;width:95%;">
          <div class="modal-header">
            <h3>⚔️ Pilih Peminatan Subclass (Kelas 11)</h3>
            <button class="modal-close-btn" id="closeSubclassSelectBtn">&times;</button>
          </div>
          <div class="modal-body" id="subclassSelectModalBody">
            <!-- Injected dynamically -->
          </div>
          <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
            <button class="btn btn-secondary" id="cancelSubclassSelectBtn">Batal</button>
            <button class="btn btn-primary" id="confirmSubclassSelectBtn" disabled>Pilih Subclass Ini</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("subclassSelectModal");
    document.getElementById("closeSubclassSelectBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelSubclassSelectBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    document.getElementById("confirmSubclassSelectBtn")?.addEventListener("click", () => this.confirmSelection());
  }

  show(onSelect?: (subclassId: string) => void) {
    this.onSelectCallback = onSelect;
    const char = characterStore.currentCharacter;
    if (!char) return;

    this.selectedSubclassId = char.subclass_id || null;
    const ekskul = resolveEkskulData(char.ekskul_id);
    const subclasses = ekskul?.subclasses || [];

    const bodyEl = document.getElementById("subclassSelectModalBody");
    if (!bodyEl) return;

    if (subclasses.length === 0) {
      bodyEl.innerHTML = `
        <p style="color:var(--text-muted);text-align:center;padding:2rem;">
          Tidak ditemukan pilihan subclass untuk ekskul <strong>${ekskul?.name || char.ekskul_id}</strong>.
        </p>
      `;
    } else {
      bodyEl.innerHTML = `
        <p style="margin-bottom:1rem;color:var(--text-muted);font-size:0.9rem;">
          Karaktermu telah memasuki <strong>Kelas 11</strong>! Pilih salah satu dari dua peminatan spesialisasi di bawah ini untuk membuka jurus <strong>Subclass Move (G11)</strong> sekarang dan <strong>G12</strong> di Kelas 12.
        </p>
        <div class="subclass-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1rem;">
          ${subclasses.map(sc => this.renderSubclassOption(sc, this.selectedSubclassId === sc.id)).join("")}
        </div>
      `;

      // Attach click listeners to cards
      bodyEl.querySelectorAll(".subclass-choice-card").forEach(cardEl => {
        cardEl.addEventListener("click", () => {
          const scId = cardEl.getAttribute("data-subclass-id");
          if (scId) {
            this.selectSubclass(scId);
          }
        });
      });
    }

    this.updateConfirmBtn();
    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  private renderSubclassOption(sc: SubclassCompendium, isSelected: boolean): string {
    const [g11, g12] = sc.subclass_moves || [];
    return `
      <div class="subclass-choice-card card ${isSelected ? 'selected' : ''}" 
           data-subclass-id="${sc.id}"
           style="cursor:pointer;border:2px solid ${isSelected ? 'var(--rose-primary)' : 'var(--border-card)'};background:${isSelected ? 'rgba(225,29,72,0.08)' : 'var(--bg-card)'};padding:1.25rem;border-radius:var(--radius-md);transition:all 0.2s ease;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
          <div>
            <h4 style="margin:0 0 0.25rem 0;color:var(--text-primary);font-size:1.1rem;font-weight:700;">${sc.name}</h4>
            <span style="font-size:0.8rem;color:var(--rose-light);font-style:italic;">${sc.tagline || ""}</span>
          </div>
          <input type="radio" name="subclassChoiceRadio" value="${sc.id}" ${isSelected ? 'checked' : ''} style="margin-top:4px;">
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin:0.5rem 0 1rem 0;line-height:1.4;">
          ${sc.identity_desc || sc.description || ""}
        </p>
        
        <div class="subclass-moves-preview" style="display:flex;flex-direction:column;gap:0.75rem;border-top:1px dashed var(--border-card);padding-top:0.75rem;">
          ${g11 ? `
            <div style="background:rgba(255,255,255,0.03);padding:0.6rem;border-radius:4px;border-left:3px solid var(--accent-color, #f43f5e);">
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;">
                <span>${g11.name}</span>
                <span class="badge" style="background:rgba(244,63,94,0.2);color:#f43f5e;font-size:0.7rem;">Kelas 11 (G11)</span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${g11.cost} • ${g11.effect}</div>
            </div>
          ` : ''}
          ${g12 ? `
            <div style="background:rgba(255,255,255,0.03);padding:0.6rem;border-radius:4px;border-left:3px solid #a855f7;">
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;font-weight:700;">
                <span>${g12.name}</span>
                <span class="badge" style="background:rgba(168,85,247,0.2);color:#a855f7;font-size:0.7rem;">Kelas 12 (G12)</span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${g12.cost} • ${g12.effect}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private selectSubclass(subclassId: string) {
    this.selectedSubclassId = subclassId;
    const bodyEl = document.getElementById("subclassSelectModalBody");
    if (!bodyEl) return;

    bodyEl.querySelectorAll(".subclass-choice-card").forEach(cardEl => {
      const isThis = cardEl.getAttribute("data-subclass-id") === subclassId;
      cardEl.classList.toggle("selected", isThis);
      cardEl.setAttribute("style", `cursor:pointer;border:2px solid ${isThis ? 'var(--rose-primary)' : 'var(--border-card)'};background:${isThis ? 'rgba(225,29,72,0.08)' : 'var(--bg-card)'};padding:1.25rem;border-radius:var(--radius-md);transition:all 0.2s ease;`);
      const radio = cardEl.querySelector("input[type=radio]") as HTMLInputElement;
      if (radio) radio.checked = isThis;
    });

    this.updateConfirmBtn();
  }

  private updateConfirmBtn() {
    const btn = document.getElementById("confirmSubclassSelectBtn") as HTMLButtonElement;
    if (btn) {
      btn.disabled = !this.selectedSubclassId;
    }
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  private async confirmSelection() {
    if (!this.selectedSubclassId) return;

    if (this.onSelectCallback) {
      this.onSelectCallback(this.selectedSubclassId);
      this.hide();
      return;
    }

    const char = characterStore.currentCharacter;
    if (!char) return;

    try {
      const changelogEntry: CharacterChangeLogEntry = {
        timestamp: new Date().toISOString(),
        action: "CHOOSE_SUBCLASS",
        description: `Memilih peminatan subclass: ${this.selectedSubclassId}`,
        previousValue: { subclass_id: char.subclass_id },
        newValue: { subclass_id: this.selectedSubclassId },
        source: "user"
      };

      const updatedChangelog = [...(char.changelog || []), changelogEntry];

      await characterStore.runOptimisticUpdate(
        (draft) => {
          draft.subclass_id = this.selectedSubclassId;
          draft.changelog = updatedChangelog;
          draft.version = (draft.version || 1) + 1;
        },
        () => updateCharacterDirect(char.id, {
          subclass_id: this.selectedSubclassId,
          changelog: updatedChangelog
        }, char.version)
      );

      this.hide();
      showToast("Peminatan Subclass berhasil dipilih!", "success");
    } catch (err: any) {
      showToast(`Gagal memilih subclass: ${err.message}`, "error");
    }
  }
}

export const subclassSelectModal = new SubclassSelectModal();
