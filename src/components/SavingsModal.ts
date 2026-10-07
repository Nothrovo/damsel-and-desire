import { adjustSavingsRpc } from "../api/gameRpc";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";

export class SavingsModal {
  private modalEl: HTMLElement | null = null;
  private txType: 'add' | 'sub' = 'add';

  render(): string {
    return `
      <div id="savingsModal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>💳 Kelola Tabungan Murid</h3>
            <button class="modal-close-btn" id="closeSavingsModalBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div style="background:var(--bg-input);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.75rem 1rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.8rem;color:var(--text-muted);">Saldo Tabungan Saat Ini:</span>
              <strong style="color:var(--amber-gold);font-size:1rem;" id="modalSavingsCurrentDisplay">¥0 / Rp 0</strong>
            </div>

            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
              <button class="btn btn-secondary active" id="btnSavingsAdd" style="flex:1;">+ Tambah Saldo</button>
              <button class="btn btn-secondary" id="btnSavingsSub" style="flex:1;">− Tarik / Belanja</button>
            </div>

            <div class="form-group" style="margin-bottom:0.75rem;">
              <label for="inputSavingsRp">Nominal (Rupiah):</label>
              <div style="position:relative;">
                <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--text-muted);font-weight:700;">Rp</span>
                <input type="number" id="inputSavingsRp" class="input-text" style="padding-left:2.5rem;" placeholder="misal: 150000" min="0" step="1000">
              </div>
              <small style="color:var(--text-muted);display:block;margin-top:0.35rem;" id="modalSavingsLiveYen">
                ≈ ¥0 Yen (Kurs TRPG: ¥1 = Rp 100)
              </small>
            </div>

            <div class="form-group">
              <label for="inputSavingsNote">Keterangan Transaksi:</label>
              <input type="text" id="inputSavingsNote" class="input-text" placeholder="misal: Hadiah ultah, Beli komik baru...">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelSavingsModalBtn">Batal</button>
            <button class="btn btn-primary" id="saveSavingsModalBtn">Terapkan Transaksi</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("savingsModal");
    document.getElementById("closeSavingsModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelSavingsModalBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    const addBtn = document.getElementById("btnSavingsAdd");
    const subBtn = document.getElementById("btnSavingsSub");

    addBtn?.addEventListener("click", () => {
      this.txType = "add";
      addBtn.classList.add("active");
      subBtn?.classList.remove("active");
    });

    subBtn?.addEventListener("click", () => {
      this.txType = "sub";
      subBtn.classList.add("active");
      addBtn?.classList.remove("active");
    });

    const rpInput = document.getElementById("inputSavingsRp") as HTMLInputElement;
    const yenDisplay = document.getElementById("modalSavingsLiveYen");

    rpInput?.addEventListener("input", () => {
      const rp = parseInt(rpInput.value) || 0;
      const yen = Math.floor(rp / 100);
      if (yenDisplay) yenDisplay.textContent = `≈ ¥${yen.toLocaleString()} Yen (Kurs TRPG: ¥1 = Rp 100)`;
    });

    document.getElementById("saveSavingsModalBtn")?.addEventListener("click", () => this.submit());
  }

  show() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const curYen = char.finances?.savingsAmount || 0;
    const curRp = curYen * 100;
    const dispEl = document.getElementById("modalSavingsCurrentDisplay");
    if (dispEl) dispEl.textContent = `¥${curYen.toLocaleString()} / Rp ${curRp.toLocaleString()}`;

    const rpInput = document.getElementById("inputSavingsRp") as HTMLInputElement;
    if (rpInput) rpInput.value = "";
    const noteInput = document.getElementById("inputSavingsNote") as HTMLInputElement;
    if (noteInput) noteInput.value = "";

    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  async submit() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const rpInput = document.getElementById("inputSavingsRp") as HTMLInputElement;
    const noteInput = document.getElementById("inputSavingsNote") as HTMLInputElement;
    const rpVal = parseInt(rpInput?.value || "0") || 0;
    const note = noteInput?.value.trim() || "";

    if (rpVal <= 0) {
      showToast("Nominal harus lebih besar dari 0.", "warning");
      return;
    }

    const deltaRp = this.txType === "add" ? rpVal : -rpVal;

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          const deltaYen = Math.floor(deltaRp / 100);
          draft.finances.savingsAmount = Math.max(0, draft.finances.savingsAmount + deltaYen);
        },
        () => adjustSavingsRpc(char.id, deltaRp, char.version, note)
      );

      this.hide();
      showToast(`Transaksi tabungan berhasil diterapkan!`, "success");
    } catch (err: any) {
      showToast(`Gagal memproses transaksi: ${err.message}`, "error");
    }
  }
}

export const savingsModal = new SavingsModal();
