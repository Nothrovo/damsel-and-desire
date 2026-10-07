import { getAllCompendiumItems, ItemDefinition } from "../data/itemCompendium";
import { characterStore } from "../store/characterStore";
import { updateCharacterDirect } from "../api/characters";
import { showToast } from "./Toast";
import { itemDetailModal } from "./ItemDetailModal";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class AddItemModal {
  private modalEl: HTMLElement | null = null;
  private activeTab: "catalog" | "custom" = "catalog";
  private allPresetItems: ItemDefinition[] = [];

  render(): string {
    return `
      <div id="addItemModal" class="modal-overlay" style="display:none;">
        <div class="modal-card add-item-modal-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h3 style="margin:0;font-size:1.15rem;font-weight:800;color:#fff;">📦 Tambah Barang ke Inventory</h3>
              <p style="margin:4px 0 0;font-size:0.78rem;color:var(--text-muted);">
                Pilih dari 90+ katalog preset atau rancang perlengkapan custom milikmu sendiri.
              </p>
            </div>
            <button class="modal-close-btn" id="closeAddItemModalBtn" aria-label="Tutup">&times;</button>
          </div>

          <!-- Tab Navigation -->
          <div class="add-item-nav-tabs">
            <button class="add-item-tab-btn active" id="tabBtnCatalog" data-tab="catalog">
              📚 Pilih dari Katalog Preset
            </button>
            <button class="add-item-tab-btn" id="tabBtnCustom" data-tab="custom">
              ✨ Buat Barang Custom Sendiri
            </button>
          </div>

          <div class="modal-body add-item-modal-body">
            <!-- ================= TAB 1: KATALOG PRESET ================= -->
            <div id="tabContentCatalog" class="add-item-tab-content">
              <!-- Destination Selector -->
              <div class="dest-selector-bar">
                <span class="dest-label">Masukkan ke:</span>
                <div class="dest-toggle-group">
                  <label class="dest-radio-label">
                    <input type="radio" name="catalogDest" value="bag" checked>
                    <span>🎒 Isi Tas Sekolah</span>
                  </label>
                  <label class="dest-radio-label">
                    <input type="radio" name="catalogDest" value="keepsake">
                    <span>♥ Benda Kenangan (Keepsake)</span>
                  </label>
                </div>
              </div>

              <!-- Filter & Search Toolbar -->
              <div class="catalog-filter-bar">
                <div class="catalog-search-wrap">
                  <input type="text" id="catalogSearchInput" class="input-text-sm" placeholder="🔍 Cari nama barang, asal, efek..." autocomplete="off">
                </div>
                <select id="catalogCategorySelect" class="input-select-sm">
                  <option value="all">Semua Kategori</option>
                  <option value="student">Standar SMA</option>
                  <option value="social">Latar Kelas Sosial</option>
                  <option value="club">Klub Ekskul</option>
                  <option value="archetype">Archetype</option>
                  <option value="keepsake">Keepsakes / Jimat</option>
                </select>
                <select id="catalogRaritySelect" class="input-select-sm">
                  <option value="all">Semua Rarity</option>
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Very Rare">Very Rare</option>
                  <option value="Special Keepsake">Special Keepsake</option>
                </select>
              </div>

              <!-- Item List Scroll Container -->
              <div class="catalog-items-container" id="catalogItemsList">
                <div style="text-align:center;padding:2rem;color:var(--text-muted);">Memuat katalog...</div>
              </div>
            </div>

            <!-- ================= TAB 2: BUAT BARANG CUSTOM ================= -->
            <div id="tabContentCustom" class="add-item-tab-content" style="display:none;">
              <form id="customItemForm" onsubmit="return false;">
                <!-- Destination Toggle -->
                <div class="form-group" style="margin-bottom:0.85rem;">
                  <label class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">Tujuan Penyimpanan:</label>
                  <div class="dest-toggle-group">
                    <label class="dest-radio-label">
                      <input type="radio" name="customDest" value="bag" checked>
                      <span>🎒 Isi Tas Sekolah</span>
                    </label>
                    <label class="dest-radio-label">
                      <input type="radio" name="customDest" value="keepsake">
                      <span>♥ Benda Kenangan (Keepsake)</span>
                    </label>
                  </div>
                </div>

                <!-- Item Name -->
                <div class="form-group" style="margin-bottom:0.85rem;">
                  <label for="customItemName" class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">
                    Nama Barang: <span style="color:var(--rose-primary);">*</span>
                  </label>
                  <input type="text" id="customItemName" class="input-text" placeholder="Contoh: Kunci Loker Rahasia, Jaket Hadiah Kakak, dll" required>
                </div>

                <!-- Rarity & Origin Grid -->
                <div class="form-row-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.85rem;">
                  <div class="form-group">
                    <label for="customItemRarity" class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">Tingkat Kelangkaan:</label>
                    <select id="customItemRarity" class="input-select" style="width:100%;">
                      <option value="Common">Common (Biasa)</option>
                      <option value="Uncommon" selected>Uncommon (Langka Ringan)</option>
                      <option value="Rare">Rare (Langka)</option>
                      <option value="Very Rare">Very Rare (Sangat Langka)</option>
                      <option value="Special Keepsake">Special Keepsake (Penuh Makna)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="customItemOrigin" class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">Asal-Usul Barang:</label>
                    <input type="text" id="customItemOrigin" class="input-text" placeholder="Contoh: Barang Rumah, Pasar Loak, Hadiah">
                  </div>
                </div>

                <!-- Action Type -->
                <div class="form-group" style="margin-bottom:0.85rem;">
                  <label for="customItemActionType" class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">Tipe Penggunaan / Aksi TRPG:</label>
                  <select id="customItemActionType" class="input-select" style="width:100%;">
                    <option value="passive">🛡️ Pasif (Efek berlaku terus selama dibawa/dipakai)</option>
                    <option value="action">⚔️ Action (Membutuhkan 1 aksi penuh giliran)</option>
                    <option value="bonus_action">⚡ Bonus Action (Aksi cepat pendukung)</option>
                    <option value="reaction">🛡️ Reaksi (Dipicu saat ada peristiwa tertentu)</option>
                    <option value="utility" selected>🔧 Utilitas (Alat bantu naratif & situasi bebas)</option>
                    <option value="consumable">🧪 Habis Pakai (Hilang/berkurang setelah dipakai)</option>
                  </select>
                </div>

                <!-- Flavor Text -->
                <div class="form-group" style="margin-bottom:0.85rem;">
                  <label for="customItemFlavor" class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">
                    Deskripsi Suasana &amp; Roleplay (Flavor Text):
                  </label>
                  <textarea id="customItemFlavor" class="input-textarea" rows="2" placeholder="Tuliskan cerita, kenangan, atau kesan visual dari barang ini saat kamu memegangnya..."></textarea>
                </div>

                <!-- Mechanics -->
                <div class="form-group" style="margin-bottom:0.85rem;">
                  <label for="customItemMechanic" class="form-label" style="font-size:0.8rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;display:block;">
                    Mekanik Gameplay TRPG &amp; Efek Aturan:
                  </label>
                  <textarea id="customItemMechanic" class="input-textarea" rows="2" placeholder="Contoh: Memberikan +1 bonus saat check Deception, memulihkan 2 Composure sekali per sesi, atau Advantage sesuai izin DM."></textarea>
                </div>

                <!-- Roll Check Toggle -->
                <div class="custom-roll-check-box">
                  <label class="custom-checkbox-label" style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer;">
                    <input type="checkbox" id="customItemHasRoll">
                    <span>Sertakan Lemparan Dadu Terkait (Roll Check)</span>
                  </label>
                  <div id="customRollConfigWrap" class="custom-roll-config-wrap" style="display:none;margin-top:0.65rem;padding:0.75rem;background:rgba(0,0,0,0.2);border-radius:var(--radius-xs);">
                    <div class="form-row-3col" style="display:grid;grid-template-columns:1fr 1fr 1.5fr;gap:0.5rem;">
                      <div class="form-group">
                        <label for="customRollStat" class="form-label" style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:2px;">Stat Acuan:</label>
                        <select id="customRollStat" class="input-select-sm" style="width:100%;">
                          <option value="physique">Physique (Fisik)</option>
                          <option value="intelligent">Intelligent (Akademik)</option>
                          <option value="looks">Looks (Daya Tarik/Aura)</option>
                          <option value="mind">Mind (Kepekaan/Tekad)</option>
                          <option value="talent">Talent (Seni/Bakat)</option>
                          <option value="luck">Luck (Keberuntungan)</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="customRollDie" class="form-label" style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:2px;">Jenis Dadu:</label>
                        <select id="customRollDie" class="input-select-sm" style="width:100%;">
                          <option value="d20" selected>d20</option>
                          <option value="d4">d4</option>
                          <option value="d6">d6</option>
                          <option value="d8">d8</option>
                          <option value="d10">d10</option>
                          <option value="d12">d12</option>
                          <option value="d100">d100</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="customRollLabel" class="form-label" style="font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:2px;">Nama Lemparan:</label>
                        <input type="text" id="customRollLabel" class="input-text-sm" placeholder="Contoh: Check Aura Keren" style="width:100%;">
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div class="modal-footer" style="display:flex;justify-content:space-between;align-items:center;">
            <button class="btn btn-secondary" id="cancelAddItemModalBtn">Tutup</button>
            <button class="btn btn-primary" id="saveCustomItemModalBtn" style="display:none;">+ Simpan Barang Custom</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("addItemModal");

    // Close buttons
    document.getElementById("closeAddItemModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelAddItemModalBtn")?.addEventListener("click", () => this.hide());

    // Overlay click
    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    // Tab buttons
    document.getElementById("tabBtnCatalog")?.addEventListener("click", () => this.switchTab("catalog"));
    document.getElementById("tabBtnCustom")?.addEventListener("click", () => this.switchTab("custom"));

    // Filter events
    document.getElementById("catalogSearchInput")?.addEventListener("input", () => this.renderCatalogList());
    document.getElementById("catalogCategorySelect")?.addEventListener("change", () => this.renderCatalogList());
    document.getElementById("catalogRaritySelect")?.addEventListener("change", () => this.renderCatalogList());

    // Roll config toggle
    document.getElementById("customItemHasRoll")?.addEventListener("change", (e: any) => {
      const wrap = document.getElementById("customRollConfigWrap");
      if (wrap) wrap.style.display = e.target.checked ? "block" : "none";
    });

    // Save custom item button
    document.getElementById("saveCustomItemModalBtn")?.addEventListener("click", () => this.saveCustomItem());
  }

  show() {
    if (!this.modalEl) {
      this.modalEl = document.getElementById("addItemModal");
    }
    if (!this.modalEl) return;

    if (this.allPresetItems.length === 0) {
      this.allPresetItems = getAllCompendiumItems();
    }

    this.switchTab("catalog");
    this.renderCatalogList();
    this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  switchTab(tab: "catalog" | "custom") {
    this.activeTab = tab;
    const tabBtnCatalog = document.getElementById("tabBtnCatalog");
    const tabBtnCustom = document.getElementById("tabBtnCustom");
    const tabContentCatalog = document.getElementById("tabContentCatalog");
    const tabContentCustom = document.getElementById("tabContentCustom");
    const saveCustomBtn = document.getElementById("saveCustomItemModalBtn");

    if (tab === "catalog") {
      tabBtnCatalog?.classList.add("active");
      tabBtnCustom?.classList.remove("active");
      if (tabContentCatalog) tabContentCatalog.style.display = "block";
      if (tabContentCustom) tabContentCustom.style.display = "none";
      if (saveCustomBtn) saveCustomBtn.style.display = "none";
    } else {
      tabBtnCatalog?.classList.remove("active");
      tabBtnCustom?.classList.add("active");
      if (tabContentCatalog) tabContentCatalog.style.display = "none";
      if (tabContentCustom) tabContentCustom.style.display = "block";
      if (saveCustomBtn) saveCustomBtn.style.display = "inline-flex";
    }
  }

  renderCatalogList() {
    const listEl = document.getElementById("catalogItemsList");
    if (!listEl) return;

    const searchInput = document.getElementById("catalogSearchInput") as HTMLInputElement;
    const catSelect = document.getElementById("catalogCategorySelect") as HTMLSelectElement;
    const raritySelect = document.getElementById("catalogRaritySelect") as HTMLSelectElement;

    const query = (searchInput?.value || "").toLowerCase().trim();
    const catFilter = catSelect?.value || "all";
    const rarityFilter = raritySelect?.value || "all";

    const filtered = this.allPresetItems.filter((item) => {
      // Category filter
      if (catFilter !== "all" && item.category !== catFilter) return false;
      // Rarity filter
      if (rarityFilter !== "all" && item.rarity !== rarityFilter) return false;
      // Text query
      if (query) {
        const inName = item.name.toLowerCase().includes(query);
        const inOrigin = item.origin.toLowerCase().includes(query);
        const inFlavor = item.flavorText.toLowerCase().includes(query);
        const inMech = item.mechanic.toLowerCase().includes(query);
        if (!inName && !inOrigin && !inFlavor && !inMech) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
          <div style="font-size:1.5rem;margin-bottom:6px;">🔍</div>
          <div>Tidak ada barang yang cocok dengan filter.</div>
          <div style="font-size:0.8rem;margin-top:4px;">Coba ubah kata kunci atau beralih ke tab <strong>Buat Custom</strong>.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map((item) => {
      const rKey = item.rarity.toLowerCase().replace(/\s+/g, "-");
      return `
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div class="catalog-item-title-group">
              <span class="catalog-item-title">${escapeHtml(item.name)}</span>
              <div class="catalog-item-badge-row">
                <span class="rarity-pill rarity-${rKey}">${item.rarity}</span>
                <span class="origin-pill">${escapeHtml(item.origin)}</span>
              </div>
            </div>
            <div class="catalog-item-actions">
              <button class="btn btn-xs btn-secondary btn-catalog-preview" data-name="${escapeHtml(item.name)}" title="Lihat detail mekanik">ℹ️ Detail</button>
              <button class="btn btn-xs btn-primary btn-catalog-add" data-name="${escapeHtml(item.name)}">+ Tambahkan</button>
            </div>
          </div>
          <div class="catalog-item-desc">${escapeHtml(item.mechanic)}</div>
        </div>
      `;
    }).join("");

    // Attach click events on catalog items
    listEl.querySelectorAll(".btn-catalog-preview").forEach((btn: any) => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        if (name) itemDetailModal.show(name);
      });
    });

    listEl.querySelectorAll(".btn-catalog-add").forEach((btn: any) => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        if (name) this.addPresetItemToInventory(name);
      });
    });
  }

  async addPresetItemToInventory(itemName: string) {
    const char = characterStore.currentCharacter;
    if (!char) {
      showToast("Karakter tidak ditemukan.", "error");
      return;
    }

    const destRadio = document.querySelector('input[name="catalogDest"]:checked') as HTMLInputElement;
    const dest = destRadio?.value === "keepsake" ? "keepsake" : "bag";

    if (dest === "bag") {
      if (!char.inventory.bagItems) char.inventory.bagItems = [];
      char.inventory.bagItems.push(itemName);
    } else {
      if (!char.inventory.keepsakes) char.inventory.keepsakes = [];
      char.inventory.keepsakes.push(itemName);
    }

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          if (dest === "bag") {
            if (!draft.inventory.bagItems) draft.inventory.bagItems = [];
            draft.inventory.bagItems.push(itemName);
          } else {
            if (!draft.inventory.keepsakes) draft.inventory.keepsakes = [];
            draft.inventory.keepsakes.push(itemName);
          }
        },
        () => updateCharacterDirect(char.id, { inventory: char.inventory }, char.version)
      );

      this.hide();
      const destLabel = dest === "bag" ? "Tas Sekolah" : "Benda Kenangan";
      showToast(`"${itemName}" berhasil ditambahkan ke ${destLabel}!`, "success");
    } catch (err: any) {
      showToast(`Gagal menambahkan barang: ${err.message}`, "error");
    }
  }

  async saveCustomItem() {
    const char = characterStore.currentCharacter;
    if (!char) {
      showToast("Karakter tidak ditemukan.", "error");
      return;
    }

    const nameInput = document.getElementById("customItemName") as HTMLInputElement;
    const cleanName = (nameInput?.value || "").trim();
    if (!cleanName) {
      showToast("Nama barang wajib diisi!", "error");
      nameInput?.focus();
      return;
    }

    const destRadio = document.querySelector('input[name="customDest"]:checked') as HTMLInputElement;
    const dest = destRadio?.value === "keepsake" ? "keepsake" : "bag";

    const raritySelect = document.getElementById("customItemRarity") as HTMLSelectElement;
    const rarity = (raritySelect?.value || "Uncommon") as any;

    const originInput = document.getElementById("customItemOrigin") as HTMLInputElement;
    const origin = (originInput?.value || "").trim() || (dest === "keepsake" ? "Benda Kenangan Pribadi" : "Barang Bawaan Unik");

    const actionSelect = document.getElementById("customItemActionType") as HTMLSelectElement;
    const actionType = (actionSelect?.value || "utility") as any;

    const flavorInput = document.getElementById("customItemFlavor") as HTMLTextAreaElement;
    const flavorText = (flavorInput?.value || "").trim() || `Barang khusus yang dibawa oleh karakter: "${cleanName}".`;

    const mechanicInput = document.getElementById("customItemMechanic") as HTMLTextAreaElement;
    const mechanic = (mechanicInput?.value || "").trim() || "Dapat digunakan sesuai arahan Dungeon Master (DM Fiat).";

    const hasRollCheck = (document.getElementById("customItemHasRoll") as HTMLInputElement)?.checked;
    let rollCheck: ItemDefinition["rollCheck"] | undefined = undefined;

    if (hasRollCheck) {
      const statSelect = document.getElementById("customRollStat") as HTMLSelectElement;
      const dieSelect = document.getElementById("customRollDie") as HTMLSelectElement;
      const labelInput = document.getElementById("customRollLabel") as HTMLInputElement;
      const stat = statSelect?.value || "physique";
      const die = dieSelect?.value || "d20";
      const label = (labelInput?.value || "").trim() || `Check ${stat.toUpperCase()}`;
      rollCheck = { stat, label, die };
    }

    const customDef: ItemDefinition = {
      name: cleanName,
      category: dest === "keepsake" ? "keepsake" : "custom",
      origin,
      rarity,
      flavorText,
      mechanic,
      actionType,
      rollCheck
    };

    try {
      await characterStore.runOptimisticUpdate(
        (draft) => {
          if (dest === "bag") {
            if (!draft.inventory.bagItems) draft.inventory.bagItems = [];
            draft.inventory.bagItems.push(cleanName);
          } else {
            if (!draft.inventory.keepsakes) draft.inventory.keepsakes = [];
            draft.inventory.keepsakes.push(cleanName);
          }
          if (!draft.inventory.customItems) draft.inventory.customItems = {};
          draft.inventory.customItems[cleanName] = customDef;
        },
        () => {
          if (dest === "bag") {
            if (!char.inventory.bagItems) char.inventory.bagItems = [];
            char.inventory.bagItems.push(cleanName);
          } else {
            if (!char.inventory.keepsakes) char.inventory.keepsakes = [];
            char.inventory.keepsakes.push(cleanName);
          }
          if (!char.inventory.customItems) char.inventory.customItems = {};
          char.inventory.customItems[cleanName] = customDef;
          return updateCharacterDirect(char.id, { inventory: char.inventory }, char.version);
        }
      );

      // Reset form
      if (nameInput) nameInput.value = "";
      if (originInput) originInput.value = "";
      if (flavorInput) flavorInput.value = "";
      if (mechanicInput) mechanicInput.value = "";
      const rollCheckInput = document.getElementById("customItemHasRoll") as HTMLInputElement;
      if (rollCheckInput) rollCheckInput.checked = false;
      const rollWrap = document.getElementById("customRollConfigWrap");
      if (rollWrap) rollWrap.style.display = "none";

      this.hide();
      const destLabel = dest === "bag" ? "Tas Sekolah" : "Benda Kenangan";
      showToast(`Barang custom "${cleanName}" berhasil dibuat dan ditambahkan ke ${destLabel}!`, "success");
    } catch (err: any) {
      showToast(`Gagal menyimpan barang custom: ${err.message}`, "error");
    }
  }
}

export const addItemModal = new AddItemModal();
