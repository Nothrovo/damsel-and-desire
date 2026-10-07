import { rollDiceRpc } from "../api/gameRpc";
import { campaignStore } from "../store/campaignStore";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";

export class DiceRollerModal {
  private modalEl: HTMLElement | null = null;
  private selectedDie: string = "d20";
  private selectedMode: 'normal' | 'advantage' | 'disadvantage' = 'normal';

  render(): string {
    return `
      <div id="diceModal" class="modal-overlay" style="display:none;">
        <div class="modal-card dice-modal-card">
          <div class="modal-header">
            <h3>Lempar Dadu TRPG</h3>
            <button class="modal-close-btn" id="closeDiceModalBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="dice-result-box" id="diceModalBox">
              <span class="dice-die-type" id="diceModalDieLabel">d20</span>
              <span class="dice-result-number" id="diceModalResultNum">--</span>
            </div>
            <div class="dice-calc-details" id="diceModalDetails">Pilih dadu dan mode lemparan di bawah:</div>

            <div class="dice-mode-toggle" style="display:flex;gap:8px;margin-bottom:12px;justify-content:center;">
              <button class="btn btn-xs btn-mode active" data-mode="normal">Normal</button>
              <button class="btn btn-xs btn-mode" data-mode="advantage">Advantage (↑)</button>
              <button class="btn btn-xs btn-mode" data-mode="disadvantage">Disadvantage (↓)</button>
            </div>

            <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;">
              <label style="font-size:0.8rem;color:var(--text-muted);">Modifier:</label>
              <input type="number" id="diceModifierInput" value="0" class="input-text" style="width:70px;text-align:center;">
              <input type="text" id="diceLabelInput" placeholder="Keterangan (misal: Power)" class="input-text" style="flex:1;">
            </div>

            <div class="dice-grid">
              <button class="btn-die" data-die="d4">d4</button>
              <button class="btn-die" data-die="d6">d6</button>
              <button class="btn-die" data-die="d8">d8</button>
              <button class="btn-die" data-die="d10">d10</button>
              <button class="btn-die" data-die="d12">d12</button>
              <button class="btn-die active" data-die="d20">d20</button>
              <button class="btn-die" data-die="d100">d100</button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" style="width:100%;" id="executeRollBtn">Lempar Sekarang!</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("diceModal");
    document.getElementById("closeDiceModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("globalDiceRollBtn")?.addEventListener("click", () => this.show());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    document.querySelectorAll(".dice-mode-toggle .btn-mode").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".dice-mode-toggle .btn-mode").forEach(b => b.classList.remove("active"));
        const target = e.currentTarget as HTMLElement;
        target.classList.add("active");
        this.selectedMode = (target.dataset.mode || "normal") as any;
      });
    });

    document.querySelectorAll(".dice-grid .btn-die").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".dice-grid .btn-die").forEach(b => b.classList.remove("active"));
        const target = e.currentTarget as HTMLElement;
        target.classList.add("active");
        this.selectedDie = target.dataset.die || "d20";
        const labelEl = document.getElementById("diceModalDieLabel");
        if (labelEl) labelEl.textContent = this.selectedDie;
      });
    });

    document.getElementById("executeRollBtn")?.addEventListener("click", () => this.executeRoll());
  }

  show(prefilledDie: string = "d20", prefilledMod: number = 0, label: string = "") {
    if (this.modalEl) {
      this.modalEl.style.display = "flex";
      this.selectedDie = prefilledDie;
      const modInput = document.getElementById("diceModifierInput") as HTMLInputElement;
      if (modInput) modInput.value = prefilledMod.toString();
      const labelInput = document.getElementById("diceLabelInput") as HTMLInputElement;
      if (labelInput) labelInput.value = label;
      const dieLabel = document.getElementById("diceModalDieLabel");
      if (dieLabel) dieLabel.textContent = prefilledDie;
    }
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  async executeRoll() {
    const modInput = document.getElementById("diceModifierInput") as HTMLInputElement;
    const modifier = parseInt(modInput?.value || "0") || 0;
    const labelInput = document.getElementById("diceLabelInput") as HTMLInputElement;
    const label = labelInput?.value.trim() || "";
    const activeCamp = campaignStore.activeCampaign;
    const activeChar = characterStore.currentCharacter;

    const resultNumEl = document.getElementById("diceModalResultNum");
    const detailsEl = document.getElementById("diceModalDetails");
    const boxEl = document.getElementById("diceModalBox");

    boxEl?.classList.add("shake");
    setTimeout(() => boxEl?.classList.remove("shake"), 300);

    if (activeCamp) {
      try {
        const res = await rollDiceRpc(
          activeCamp.id,
          activeChar?.id || null,
          this.selectedDie,
          this.selectedMode,
          label,
          modifier
        );

        if (resultNumEl) resultNumEl.textContent = res.total.toString();
        if (detailsEl) {
          const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          let modeDetail = "";
          if (this.selectedMode === "advantage") modeDetail = ` [Advantage: (${res.modifiers.firstRoll}, ${res.modifiers.secondRoll})]`;
          else if (this.selectedMode === "disadvantage") modeDetail = ` [Disadvantage: (${res.modifiers.firstRoll}, ${res.modifiers.secondRoll})]`;
          detailsEl.textContent = `Dadu: ${res.result} (${this.selectedDie}) ${modStr} = Total ${res.total}${modeDetail}${label ? ' • ' + label : ''}`;
        }
        showToast(`Lemparan dadu tercatat di roll log campaign: ${res.total}`, "success");
      } catch (err: any) {
        showToast(`Gagal melempar dadu di server: ${err.message}`, "error");
      }
    } else {
      // Local client roll fallback
      const faces = parseInt(this.selectedDie.replace("d", "")) || 20;
      const r1 = Math.floor(Math.random() * faces) + 1;
      let res = r1;
      let detail = `1${this.selectedDie} (${r1})`;

      if (this.selectedMode === "advantage") {
        const r2 = Math.floor(Math.random() * faces) + 1;
        res = Math.max(r1, r2);
        detail = `Advantage: (${r1}, ${r2}) -> Ambil ${res}`;
      } else if (this.selectedMode === "disadvantage") {
        const r2 = Math.floor(Math.random() * faces) + 1;
        res = Math.min(r1, r2);
        detail = `Disadvantage: (${r1}, ${r2}) -> Ambil ${res}`;
      }

      const total = res + modifier;
      const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
      if (resultNumEl) resultNumEl.textContent = total.toString();
      if (detailsEl) detailsEl.textContent = `${detail} ${modStr} = Total ${total}${label ? ' • ' + label : ''}`;
    }
  }
}

export const diceRollerModal = new DiceRollerModal();
