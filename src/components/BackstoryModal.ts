import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";

export class BackstoryModal {
  private modalEl: HTMLElement | null = null;

  render(): string {
    return `
      <div id="backstoryModal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>✏️ Sunting Kisah Masa Lalu (Backstory)</h3>
            <button class="modal-close-btn" id="closeBackstoryModalBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="modalBackstoryInput">Kisah Karakter:</label>
              <textarea id="modalBackstoryInput" class="input-textarea" rows="8" placeholder="Tuliskan kisah masa lalu karaktermu..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelBackstoryModalBtn">Batal</button>
            <button class="btn btn-primary" id="saveBackstoryModalBtn">Simpan Backstory</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("backstoryModal");
    document.getElementById("closeBackstoryModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelBackstoryModalBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    document.getElementById("saveBackstoryModalBtn")?.addEventListener("click", () => this.save());
  }

  show() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const input = document.getElementById("modalBackstoryInput") as HTMLTextAreaElement;
    if (input) input.value = char.backstory_fields?.backstory || "";

    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  async save() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const input = document.getElementById("modalBackstoryInput") as HTMLTextAreaElement;
    const text = input ? input.value.trim() : "";

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          draft.backstory_fields.backstory = text;
        },
        () => updateCharacterDirect(char.id, {
          backstory_fields: {
            ...char.backstory_fields,
            backstory: text
          }
        }, char.version)
      );

      this.hide();
      showToast("Kisah masa lalu (Backstory) berhasil diperbarui!", "success");
    } catch (err: any) {
      showToast(`Gagal memperbarui backstory: ${err.message}`, "error");
    }
  }
}

export const backstoryModal = new BackstoryModal();
