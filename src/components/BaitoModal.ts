import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";

export class BaitoModal {
  private modalEl: HTMLElement | null = null;

  render(): string {
    return `
      <div id="baitoModal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>💼 Kelola Kerja Paruh Waktu (Baito)</h3>
            <button class="modal-close-btn" id="closeBaitoModalBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div id="baitoActiveAlert" style="display:none;background:rgba(16,185,129,0.12);border:1px solid #10b981;border-radius:var(--radius-sm);padding:0.6rem 0.85rem;margin-bottom:1rem;font-size:0.8rem;color:#10b981;">
              ✓ Karakter saat ini sedang memiliki pekerjaan aktif. Gaji ditambahkan otomatis tiap <strong>Long Rest</strong>.
            </div>

            <div class="form-group" style="margin-bottom:0.85rem;">
              <label for="inputBaitoJob">Nama Tempat / Pekerjaan Baito:</label>
              <input type="text" id="inputBaitoJob" class="input-text" placeholder="misal: Kasir Minimarket Lawson, Barista Kafe...">
            </div>

            <div class="form-group" style="margin-bottom:0.85rem;">
              <label for="inputBaitoWageRp">Upah per Sesi Long Rest (Rupiah):</label>
              <div style="position:relative;">
                <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--text-muted);font-weight:700;">Rp</span>
                <input type="number" id="inputBaitoWageRp" class="input-text" style="padding-left:2.5rem;" placeholder="misal: 50000" min="0" step="1000">
              </div>
              <small style="color:var(--text-muted);display:block;margin-top:0.35rem;" id="modalBaitoLiveYen">
                ≈ ¥0 Yen (Gaji masuk ke tabungan saat Long Rest)
              </small>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btnBaitoStop" style="color:var(--rose-light);">Berhenti Baito</button>
            <div style="display:flex;gap:0.5rem;">
              <button class="btn btn-secondary" id="cancelBaitoModalBtn">Batal</button>
              <button class="btn btn-primary" id="saveBaitoModalBtn">Simpan Baito</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("baitoModal");
    document.getElementById("closeBaitoModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelBaitoModalBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    const wageInput = document.getElementById("inputBaitoWageRp") as HTMLInputElement;
    const yenDisplay = document.getElementById("modalBaitoLiveYen");

    wageInput?.addEventListener("input", () => {
      const rp = parseInt(wageInput.value) || 0;
      const yen = Math.floor(rp / 100);
      if (yenDisplay) yenDisplay.textContent = `≈ ¥${yen.toLocaleString()} Yen (Gaji masuk ke tabungan saat Long Rest)`;
    });

    document.getElementById("btnBaitoStop")?.addEventListener("click", () => this.stopJob());
    document.getElementById("saveBaitoModalBtn")?.addEventListener("click", () => this.saveJob());
  }

  show() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const jobInput = document.getElementById("inputBaitoJob") as HTMLInputElement;
    const wageInput = document.getElementById("inputBaitoWageRp") as HTMLInputElement;
    const alertBox = document.getElementById("baitoActiveAlert");
    const yenDisplay = document.getElementById("modalBaitoLiveYen");

    const hasActiveJob = (char.finances?.jobWageAmount || 0) > 0 && char.finances?.job && char.finances.job !== "-";

    if (jobInput) jobInput.value = hasActiveJob ? char.finances.job : "";
    if (wageInput) wageInput.value = hasActiveJob ? (char.finances.jobWageAmount * 100).toString() : "";
    if (alertBox) alertBox.style.display = hasActiveJob ? "block" : "none";
    if (yenDisplay) yenDisplay.textContent = `≈ ¥${(char.finances?.jobWageAmount || 0).toLocaleString()} Yen`;

    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  async stopJob() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          draft.finances.job = "-";
          draft.finances.jobWageAmount = 0;
        },
        () => updateCharacterDirect(char.id, {
          finances: {
            ...char.finances,
            job: "-",
            jobWageAmount: 0
          }
        }, char.version)
      );

      this.hide();
      showToast("Karakter telah berhenti dari pekerjaan sampingan.", "info");
    } catch (err: any) {
      showToast(`Gagal menghentikan baito: ${err.message}`, "error");
    }
  }

  async saveJob() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const jobInput = document.getElementById("inputBaitoJob") as HTMLInputElement;
    const wageInput = document.getElementById("inputBaitoWageRp") as HTMLInputElement;
    const jobTitle = jobInput?.value.trim() || "";
    const wageRp = parseInt(wageInput?.value || "0") || 0;

    if (!jobTitle) {
      showToast("Harap masukkan nama pekerjaan baito.", "warning");
      return;
    }

    const wageYen = Math.floor(wageRp / 100);

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          draft.finances.job = jobTitle;
          draft.finances.jobWageAmount = wageYen;
        },
        () => updateCharacterDirect(char.id, {
          finances: {
            ...char.finances,
            job: jobTitle,
            jobWageAmount: wageYen
          }
        }, char.version)
      );

      this.hide();
      showToast(`Baito diperbarui: ${jobTitle} (¥${wageYen.toLocaleString()}/rest)`, "success");
    } catch (err: any) {
      showToast(`Gagal menyimpan baito: ${err.message}`, "error");
    }
  }
}

export const baitoModal = new BaitoModal();
