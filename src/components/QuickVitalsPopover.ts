import { characterStore } from "../store/characterStore";
import { applyVitalChangeRpc } from "../api/gameRpc";
import { showToast } from "../components/Toast";

export type VitalType = "physical_hp" | "composure";

export class QuickVitalsPopover {
  private overlayEl: HTMLElement | null = null;
  private currentType: VitalType = "physical_hp";
  private charId: string = "";
  private currentVal: number = 0;
  private maxVal: number = 0;
  private inputVal: number = 1;

  render(): string {
    return `
      <div id="vitalsPopoverOverlay" class="vitals-popover-overlay" style="display:none;" aria-hidden="true">
        <div class="vitals-popover-card" role="dialog" aria-modal="true" aria-labelledby="vitalsPopoverTitle">
          <div class="vitals-popover-header">
            <div class="vitals-popover-title-group">
              <span id="vitalsTypeBadge" class="vitals-popover-badge">PHYSICAL VITALS</span>
              <h3 id="vitalsPopoverTitle" class="vitals-popover-title">Kelola HP Fisik</h3>
            </div>
            <button id="closeVitalsPopoverBtn" class="vitals-popover-close" aria-label="Tutup" type="button">&times;</button>
          </div>

          <div class="vitals-popover-body">
            <!-- Current / Max Gauge -->
            <div class="vitals-display-meter">
              <span class="vitals-meter-label">STATUS SAAT INI</span>
              <div class="vitals-meter-numbers">
                <span id="vitalsCurrentDisplay" class="vitals-meter-cur">13</span>
                <span class="vitals-meter-slash">/</span>
                <span id="vitalsMaxDisplay" class="vitals-meter-max">13</span>
              </div>
            </div>

            <!-- Number Amount Selector -->
            <div class="vitals-input-section">
              <label class="vitals-input-label">JUMLAH PERUBAHAN POIN</label>
              <div class="vitals-amount-stepper">
                <button class="stepper-btn" id="btnVitalMinus" type="button">−5</button>
                <button class="stepper-btn" id="btnVitalMinusOne" type="button">−1</button>
                <input type="number" id="vitalsAmountInput" class="vitals-amount-input" value="1" min="1" max="99">
                <button class="stepper-btn" id="btnVitalPlusOne" type="button">+1</button>
                <button class="stepper-btn" id="btnVitalPlus" type="button">+5</button>
              </div>

              <!-- Quick Value Pills -->
              <div class="vitals-quick-chips">
                <button class="quick-chip-btn" data-val="1" type="button">1</button>
                <button class="quick-chip-btn" data-val="2" type="button">2</button>
                <button class="quick-chip-btn" data-val="3" type="button">3</button>
                <button class="quick-chip-btn" data-val="5" type="button">5</button>
                <button class="quick-chip-btn" data-val="10" type="button">10</button>
              </div>
            </div>

            <!-- Dual Action Buttons -->
            <div class="vitals-action-buttons-grid">
              <button class="btn-vital-action btn-vital-damage" id="btnApplyDamage" type="button">
                <span class="act-emoji" id="vitalDmgEmoji">💥</span>
                <div>
                  <strong class="act-name" id="vitalDmgLabel">TERIMA DAMAGE</strong>
                  <span class="act-hint" id="vitalDmgHint">Kurangi HP</span>
                </div>
              </button>

              <button class="btn-vital-action btn-vital-heal" id="btnApplyHeal" type="button">
                <span class="act-emoji" id="vitalHealEmoji">💚</span>
                <div>
                  <strong class="act-name" id="vitalHealLabel">PULIHKAN HEAL</strong>
                  <span class="act-hint" id="vitalHealHint">Tambah HP</span>
                </div>
              </button>
            </div>

            <!-- Reset to Full Shortcut -->
            <div class="vitals-popover-footer">
              <button class="btn-vital-reset" id="btnVitalResetFull" type="button">
                <span>🔄 Pulihkan Penuh (Maksimal)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(): void {
    this.overlayEl = document.getElementById("vitalsPopoverOverlay");

    document.getElementById("closeVitalsPopoverBtn")?.addEventListener("click", () => this.close());
    this.overlayEl?.addEventListener("click", (e) => {
      if (e.target === this.overlayEl) this.close();
    });

    const input = document.getElementById("vitalsAmountInput") as HTMLInputElement | null;
    if (input) {
      input.addEventListener("input", (e: any) => {
        const val = Math.max(1, parseInt(e.target.value) || 1);
        this.inputVal = val;
      });
    }

    document.getElementById("btnVitalMinus")?.addEventListener("click", () => this.stepAmount(-5));
    document.getElementById("btnVitalMinusOne")?.addEventListener("click", () => this.stepAmount(-1));
    document.getElementById("btnVitalPlusOne")?.addEventListener("click", () => this.stepAmount(1));
    document.getElementById("btnVitalPlus")?.addEventListener("click", () => this.stepAmount(5));

    document.querySelectorAll(".quick-chip-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = parseInt((btn as HTMLElement).dataset.val || "1");
        this.setAmount(val);
      });
    });

    document.getElementById("btnApplyDamage")?.addEventListener("click", () => this.applyChange(-this.inputVal));
    document.getElementById("btnApplyHeal")?.addEventListener("click", () => this.applyChange(this.inputVal));
    document.getElementById("btnVitalResetFull")?.addEventListener("click", () => this.resetFull());
  }

  private stepAmount(delta: number) {
    this.setAmount(Math.max(1, this.inputVal + delta));
  }

  private setAmount(val: number) {
    this.inputVal = Math.max(1, val);
    const input = document.getElementById("vitalsAmountInput") as HTMLInputElement | null;
    if (input) input.value = String(this.inputVal);
  }

  open(type: VitalType, charId: string, currentVal: number, maxVal: number): void {
    this.currentType = type;
    this.charId = charId;
    this.currentVal = currentVal;
    this.maxVal = maxVal;
    this.inputVal = 1;

    if (!this.overlayEl) {
      this.attachEvents();
    }

    const badge = document.getElementById("vitalsTypeBadge");
    const title = document.getElementById("vitalsPopoverTitle");
    const curDisp = document.getElementById("vitalsCurrentDisplay");
    const maxDisp = document.getElementById("vitalsMaxDisplay");
    const dmgLabel = document.getElementById("vitalDmgLabel");
    const dmgHint = document.getElementById("vitalDmgHint");
    const healLabel = document.getElementById("vitalHealLabel");
    const healHint = document.getElementById("vitalHealHint");
    const dmgEmoji = document.getElementById("vitalDmgEmoji");
    const healEmoji = document.getElementById("vitalHealEmoji");

    if (curDisp) curDisp.textContent = String(this.currentVal);
    if (maxDisp) maxDisp.textContent = String(this.maxVal);
    this.setAmount(1);

    if (type === "physical_hp") {
      if (badge) {
        badge.textContent = "PHYSICAL HP (FISIK)";
        badge.className = "vitals-popover-badge badge-phys";
      }
      if (title) title.textContent = "Kelola HP Fisik & Tempur";
      if (dmgLabel) dmgLabel.textContent = "TERIMA DAMAGE";
      if (dmgHint) dmgHint.textContent = `Kurangi HP (-${this.inputVal})`;
      if (healLabel) healLabel.textContent = "PULIHKAN HEAL";
      if (healHint) healHint.textContent = `Tambah HP (+${this.inputVal})`;
      if (dmgEmoji) dmgEmoji.textContent = "💥";
      if (healEmoji) healEmoji.textContent = "💚";
      if (curDisp) curDisp.className = "vitals-meter-cur color-green";
    } else {
      if (badge) {
        badge.textContent = "COMPOSURE (MENTAL & JAIM)";
        badge.className = "vitals-popover-badge badge-mental";
      }
      if (title) title.textContent = "Kelola Composure & Salting";
      if (dmgLabel) dmgLabel.textContent = "KENA SALTING / SHOCK";
      if (dmgHint) dmgHint.textContent = `Kurangi Composure (-${this.inputVal})`;
      if (healLabel) healLabel.textContent = "TENANG / DIHIBUR";
      if (healHint) healHint.textContent = `Pulihkan Composure (+${this.inputVal})`;
      if (dmgEmoji) dmgEmoji.textContent = "💔";
      if (healEmoji) healEmoji.textContent = "🌸";
      if (curDisp) curDisp.className = "vitals-meter-cur color-rose";
    }

    if (this.overlayEl) {
      this.overlayEl.style.display = "flex";
      requestAnimationFrame(() => {
        this.overlayEl?.classList.add("open");
      });
    }
  }

  close(): void {
    if (!this.overlayEl) return;
    this.overlayEl.classList.remove("open");
    setTimeout(() => {
      if (this.overlayEl) this.overlayEl.style.display = "none";
    }, 200);
  }

  private async applyChange(delta: number) {
    const char = characterStore.currentCharacter;
    if (!char) return;

    try {
      const typeKey = this.currentType === "physical_hp" ? "phys" : "composure";
      await characterStore.runOptimisticUpdate(
        (draft) => {
          const curKey = this.currentType === "physical_hp" ? "physicalHpCurrent" : "composureCurrent";
          const maxKey = this.currentType === "physical_hp" ? "physicalHpMax" : "composureMax";
          draft.vitals[curKey] = Math.max(0, Math.min(draft.vitals[maxKey], draft.vitals[curKey] + delta));
        },
        () => applyVitalChangeRpc(char.id, typeKey, delta, characterStore.currentCharacter?.version ?? char.version)
      );

      const updated = characterStore.currentCharacter;
      const newCur = updated 
        ? (this.currentType === "physical_hp" ? updated.vitals.physicalHpCurrent : updated.vitals.composureCurrent)
        : this.currentVal + delta;
      
      const changeLabel = delta > 0 ? `+${delta}` : `${delta}`;
      const nameLabel = this.currentType === "physical_hp" ? "Physical HP" : "Composure";
      showToast(`${nameLabel}: ${changeLabel} (Sekarang ${newCur})`, delta > 0 ? "success" : "info");
      this.close();
    } catch (err: any) {
      showToast(`Gagal mengubah status: ${err.message}`, "error");
    }
  }

  private async resetFull() {
    const diff = this.maxVal - this.currentVal;
    if (diff <= 0) {
      showToast("Nilai sudah berada di batas maksimal!", "info");
      this.close();
      return;
    }
    await this.applyChange(diff);
  }
}

export const quickVitalsPopover = new QuickVitalsPopover();
