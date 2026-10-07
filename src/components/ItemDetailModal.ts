import { getItemDetails, ItemDefinition } from "../data/itemCompendium";
import { diceRollerModal } from "./DiceRollerModal";
import { characterStore } from "../store/characterStore";
import { CharacterAbilities } from "../types";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class ItemDetailModal {
  private modalEl: HTMLElement | null = null;
  private currentItem: ItemDefinition | null = null;

  render(): string {
    return `
      <div id="itemDetailModal" class="modal-overlay" style="display:none;">
        <div class="modal-card item-modal-card">
          <div class="modal-header">
            <div class="item-modal-title-group">
              <h3 id="itemModalTitle" class="item-modal-title">Nama Barang</h3>
              <div class="item-modal-badge-group" id="itemModalBadges">
                <span id="itemModalRarity" class="rarity-pill rarity-common">Common</span>
                <span id="itemModalOrigin" class="origin-pill">Asal</span>
                <span id="itemModalActionType" class="action-type-pill">Tipe</span>
              </div>
            </div>
            <button class="modal-close-btn" id="closeItemDetailModalBtn" aria-label="Tutup">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Roleplay & Flavour Section -->
            <div class="item-detail-section">
              <div class="item-detail-heading">📖 ROLEPLAY &amp; SUASANA</div>
              <div class="item-flavor-box" id="itemModalFlavor"></div>
            </div>

            <!-- Gameplay Mechanics Section -->
            <div class="item-detail-section" style="margin-top: 1rem;">
              <div class="item-detail-heading">⚡ MEKANIK GAMEPLAY &amp; ATURAN TRPG</div>
              <div class="item-mechanic-box" id="itemModalMechanic"></div>
            </div>

            <!-- Roll Check Action (Conditional) -->
            <div id="itemModalRollSection" class="item-roll-section" style="display:none; margin-top: 1.25rem;">
              <button class="btn btn-primary item-roll-btn" id="itemModalRollBtn" style="width:100%;">
                <span id="itemModalRollBtnText">🎲 Lempar Check Terkait</span>
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="closeItemDetailModalFooterBtn" style="width:100%;">Tutup</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("itemDetailModal");
    document.getElementById("closeItemDetailModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("closeItemDetailModalFooterBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    document.getElementById("itemModalRollBtn")?.addEventListener("click", () => {
      if (!this.currentItem?.rollCheck) return;
      const rc = this.currentItem.rollCheck;
      const char = characterStore.currentCharacter;
      let mod = 0;
      if (char && char.abilities && rc.stat) {
        const statKey = rc.stat.toLowerCase() as keyof CharacterAbilities;
        const score = char.abilities[statKey] ?? 10;
        mod = Math.floor((score - 10) / 2);
      }
      this.hide();
      diceRollerModal.show(rc.die || "d20", mod, rc.label);
    });
  }

  show(itemName: string) {
    const item = getItemDetails(itemName);
    this.currentItem = item;

    if (!this.modalEl) {
      this.modalEl = document.getElementById("itemDetailModal");
    }
    if (!this.modalEl) return;

    const titleEl = document.getElementById("itemModalTitle");
    const rarityEl = document.getElementById("itemModalRarity");
    const originEl = document.getElementById("itemModalOrigin");
    const actionTypeEl = document.getElementById("itemModalActionType");
    const flavorEl = document.getElementById("itemModalFlavor");
    const mechanicEl = document.getElementById("itemModalMechanic");
    const rollSection = document.getElementById("itemModalRollSection");
    const rollBtnText = document.getElementById("itemModalRollBtnText");

    if (titleEl) titleEl.textContent = item.name;

    if (rarityEl) {
      rarityEl.textContent = item.rarity;
      rarityEl.className = "rarity-pill";
      const rKey = item.rarity.toLowerCase().replace(/\s+/g, "-");
      rarityEl.classList.add(`rarity-${rKey}`);
    }

    if (originEl) {
      originEl.textContent = item.origin;
    }

    if (actionTypeEl) {
      const typeLabels: Record<string, string> = {
        passive: "🛡️ Pasif",
        action: "⚔️ Action",
        bonus_action: "⚡ Bonus Action",
        reaction: "🛡️ Reaksi",
        utility: "🔧 Utilitas",
        consumable: "🧪 Habis Pakai (Consumable)"
      };
      actionTypeEl.textContent = typeLabels[item.actionType] || "🔧 Utilitas";
    }

    if (flavorEl) {
      flavorEl.textContent = `"${item.flavorText}"`;
    }

    if (mechanicEl) {
      mechanicEl.innerHTML = escapeHtml(item.mechanic);
    }

    if (rollSection && rollBtnText) {
      if (item.rollCheck) {
        rollSection.style.display = "block";
        const char = characterStore.currentCharacter;
        let modStr = "+0";
        if (char && char.abilities && item.rollCheck.stat) {
          const statKey = item.rollCheck.stat.toLowerCase() as keyof CharacterAbilities;
          const score = char.abilities[statKey] ?? 10;
          const mod = Math.floor((score - 10) / 2);
          modStr = mod >= 0 ? `+${mod}` : `${mod}`;
        }
        rollBtnText.textContent = `🎲 Lempar ${item.rollCheck.label} (${item.rollCheck.die || "d20"} ${modStr})`;
      } else {
        rollSection.style.display = "none";
      }
    }

    this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }
}

export const itemDetailModal = new ItemDetailModal();
