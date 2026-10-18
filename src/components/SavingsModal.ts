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
            <h3>💳 Kelola Tabungan &amp; Koin Murid</h3>
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

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.5rem;">
              <div class="form-group" style="margin-bottom:0;">
                <label for="inputSavingsYen" style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;display:block;margin-bottom:0.35rem;">Nominal (Yen / Koin):</label>
                <div style="position:relative;">
                  <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--amber-gold);font-weight:700;">¥</span>
                  <input type="number" id="inputSavingsYen" class="input-text" style="padding-left:2.2rem;" placeholder="misal: 1500" min="0" step="1">
                </div>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label for="inputSavingsRp" style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;display:block;margin-bottom:0.35rem;">Konversi (Rupiah):</label>
                <div style="position:relative;">
                  <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--text-muted);font-weight:700;">Rp</span>
                  <input type="number" id="inputSavingsRp" class="input-text" style="padding-left:2.5rem;" placeholder="misal: 150000" min="0" step="100">
                </div>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.75rem;">
              <span style="font-size:0.72rem;color:var(--text-muted);margin-right:0.25rem;">Cepat:</span>
              <button type="button" class="btn btn-xs btn-secondary btn-quick-yen" data-amount="100">+100</button>
              <button type="button" class="btn btn-xs btn-secondary btn-quick-yen" data-amount="500">+500</button>
              <button type="button" class="btn btn-xs btn-secondary btn-quick-yen" data-amount="1000">+1.000</button>
              <button type="button" class="btn btn-xs btn-secondary btn-quick-yen" data-amount="5000">+5.000</button>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;padding:0 0.15rem;">
              <span id="modalSavingsLiveYen">Kurs TRPG Housen: ¥1 = Rp 100</span>
              <span id="modalSavingsLiveProjected" style="font-weight:700;"></span>
            </div>

            <div class="form-group">
              <label for="inputSavingsNote" style="font-size:0.8rem;color:var(--text-secondary);font-weight:600;display:block;margin-bottom:0.35rem;">Keterangan Transaksi:</label>
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
      this.updateProjectedBalance();
    });

    subBtn?.addEventListener("click", () => {
      this.txType = "sub";
      subBtn.classList.add("active");
      addBtn?.classList.remove("active");
      this.updateProjectedBalance();
    });

    const yenInput = document.getElementById("inputSavingsYen") as HTMLInputElement;
    const rpInput = document.getElementById("inputSavingsRp") as HTMLInputElement;

    yenInput?.addEventListener("input", () => {
      if (yenInput.value === "") {
        if (rpInput) rpInput.value = "";
      } else {
        const yen = parseInt(yenInput.value) || 0;
        if (rpInput) rpInput.value = String(yen * 100);
      }
      this.updateProjectedBalance();
    });

    rpInput?.addEventListener("input", () => {
      if (rpInput.value === "") {
        if (yenInput) yenInput.value = "";
      } else {
        const rp = parseInt(rpInput.value) || 0;
        const yen = Math.floor(rp / 100);
        if (yenInput) yenInput.value = String(yen);
      }
      this.updateProjectedBalance();
    });

    this.modalEl?.querySelectorAll(".btn-quick-yen").forEach((btn) => {
      btn.addEventListener("click", () => {
        const amount = parseInt((btn as HTMLElement).dataset.amount || "0");
        if (amount > 0 && yenInput && rpInput) {
          yenInput.value = String(amount);
          rpInput.value = String(amount * 100);
          this.updateProjectedBalance();
        }
      });
    });

    document.getElementById("saveSavingsModalBtn")?.addEventListener("click", () => this.submit());
  }

  private updateProjectedBalance() {
    const char = characterStore.currentCharacter;
    const projectedEl = document.getElementById("modalSavingsLiveProjected");
    if (!projectedEl) return;

    if (!char) {
      projectedEl.textContent = "";
      return;
    }

    const curYen = char.finances?.savingsAmount || 0;
    const yenInput = document.getElementById("inputSavingsYen") as HTMLInputElement;
    const yenVal = parseInt(yenInput?.value || "0") || 0;

    if (yenVal <= 0) {
      projectedEl.textContent = "";
      return;
    }

    if (this.txType === "add") {
      const projected = curYen + yenVal;
      projectedEl.innerHTML = `<span style="color:var(--green-health);">Est. Saldo: ¥${projected.toLocaleString()} (+¥${yenVal.toLocaleString()})</span>`;
    } else {
      const projected = curYen - yenVal;
      if (projected < 0) {
        projectedEl.innerHTML = `<span style="color:var(--rose-primary);font-weight:700;">⚠️ Defisit: ¥${Math.abs(projected).toLocaleString()}!</span>`;
      } else {
        projectedEl.innerHTML = `<span style="color:var(--amber-gold);">Est. Saldo: ¥${projected.toLocaleString()} (−¥${yenVal.toLocaleString()})</span>`;
      }
    }
  }

  show() {
    if (!this.modalEl) {
      this.modalEl = document.getElementById("savingsModal");
    }
    const char = characterStore.currentCharacter;
    if (!char) return;

    this.txType = "add";
    const addBtn = document.getElementById("btnSavingsAdd");
    const subBtn = document.getElementById("btnSavingsSub");
    addBtn?.classList.add("active");
    subBtn?.classList.remove("active");

    const curYen = char.finances?.savingsAmount || 0;
    const curRp = curYen * 100;
    const dispEl = document.getElementById("modalSavingsCurrentDisplay");
    if (dispEl) dispEl.textContent = `¥${curYen.toLocaleString()} / Rp ${curRp.toLocaleString()}`;

    const yenInput = document.getElementById("inputSavingsYen") as HTMLInputElement;
    if (yenInput) yenInput.value = "";
    const rpInput = document.getElementById("inputSavingsRp") as HTMLInputElement;
    if (rpInput) rpInput.value = "";
    const noteInput = document.getElementById("inputSavingsNote") as HTMLInputElement;
    if (noteInput) noteInput.value = "";

    const projectedEl = document.getElementById("modalSavingsLiveProjected");
    if (projectedEl) projectedEl.textContent = "";

    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  async submit() {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const yenInput = document.getElementById("inputSavingsYen") as HTMLInputElement;
    const rpInput = document.getElementById("inputSavingsRp") as HTMLInputElement;
    const noteInput = document.getElementById("inputSavingsNote") as HTMLInputElement;

    let yenVal = parseInt(yenInput?.value || "0") || 0;
    if (yenVal <= 0 && rpInput?.value) {
      yenVal = Math.floor(parseInt(rpInput.value || "0") / 100);
    }

    if (yenVal <= 0) {
      showToast("Nominal transaksi harus lebih besar dari 0 Yen.", "warning");
      return;
    }

    const curYen = char.finances?.savingsAmount || 0;
    if (this.txType === "sub" && yenVal > curYen) {
      showToast(`Saldo tabungan tidak mencukupi! Saldo saat ini: ¥${curYen.toLocaleString()}.`, "error");
      return;
    }

    const deltaYen = this.txType === "add" ? yenVal : -yenVal;
    const deltaRp = deltaYen * 100;
    const defaultNote = this.txType === "add" ? "Tambah Tabungan" : "Tarik Tabungan";
    const note = noteInput?.value.trim() || defaultNote;

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          draft.finances.savingsAmount = Math.max(0, draft.finances.savingsAmount + deltaYen);
        },
        () => adjustSavingsRpc(char.id, deltaRp, characterStore.currentCharacter?.version ?? char.version, note, deltaYen)
      );

      this.hide();
      showToast(`Transaksi berhasil diterapkan: ${deltaYen >= 0 ? '+' : ''}¥${deltaYen.toLocaleString()} (${note})`, "success");
    } catch (err: any) {
      showToast(`Gagal memproses transaksi: ${err.message}`, "error");
    }
  }
}

export const savingsModal = new SavingsModal();
