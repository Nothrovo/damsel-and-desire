import { fetchDynamicLoveInterests, type LoveInterestDefinition } from "../api/loveInterests";
import type { Character, TargetSecret } from "../types";
import { showToast } from "./Toast";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class AddLoveInterestModal {
  private modalEl: HTMLElement | null = null;
  private currentCharacter: Character | null = null;
  private onSaveCallback: (() => void) | null = null;
  private allInterests: LoveInterestDefinition[] = [];
  private selectedLi: LoveInterestDefinition | null = null;
  private activeTab: "catalog" | "custom" = "catalog";
  private activeGradeFilter: string = "all";
  private searchQuery: string = "";

  public render(): string {
    return `
      <div id="addLoveInterestModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card add-li-modal-card" style="max-width:850px;width:95vw;max-height:90vh;display:flex;flex-direction:column;border:1.5px solid var(--rose-primary);box-shadow:0 16px 48px rgba(225,29,72,0.25);">
          
          <!-- Header -->
          <div class="modal-header" style="border-bottom:1px solid var(--border-card);padding:1.25rem 1.75rem;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.4rem;">💖</span>
                <h3 style="margin:0;font-size:1.25rem;font-weight:800;color:var(--rose-light);font-family:var(--font-heading);">
                  Tambah Target Romansa / Rivalitas
                </h3>
              </div>
              <p style="margin:4px 0 0;font-size:0.8rem;color:var(--text-muted);">
                Pilih dari profil siswi &amp; tokoh Housen Academy yang terdaftar di database, atau buat target custom baru.
              </p>
            </div>
            <button class="modal-close-btn" id="closeAddLiModalBtn" aria-label="Tutup">&times;</button>
          </div>

          <!-- Tab Bar -->
          <div style="display:flex;background:var(--bg-surface);border-bottom:1px solid var(--border-card);padding:0 1.75rem;">
            <button type="button" class="add-li-tab-btn active" id="addLiTabBtnCatalog" data-tab="catalog" style="padding:0.75rem 1.25rem;background:none;border:none;border-bottom:2px solid var(--rose-primary);color:var(--rose-light);font-weight:700;cursor:pointer;font-size:0.9rem;">
              🌸 Dari Arsip Love Interest
            </button>
            <button type="button" class="add-li-tab-btn" id="addLiTabBtnCustom" data-tab="custom" style="padding:0.75rem 1.25rem;background:none;border:none;border-bottom:2px solid transparent;color:var(--text-muted);font-weight:600;cursor:pointer;font-size:0.9rem;">
              ✨ Target Custom (Non-Katalog)
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body" style="flex:1;overflow-y:auto;padding:1.5rem 1.75rem;">
            
            <!-- ================= TAB 1: DARI KATALOG ================= -->
            <div id="addLiTabCatalogContent" style="display:block;">
              
              <!-- Search & Filter Controls -->
              <div style="display:flex;gap:12px;margin-bottom:1.25rem;flex-wrap:wrap;align-items:center;">
                <div style="flex:1;min-width:240px;position:relative;">
                  <input
                    type="text"
                    id="addLiSearchInput"
                    placeholder="🔍 Cari nama, julukan, kelas, ekskul, kepribadian..."
                    class="input-text-sm"
                    style="width:100%;box-sizing:border-box;padding:0.6rem 1rem;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);color:var(--text-main);outline:none;"
                  />
                </div>
                <div style="display:flex;gap:6px;overflow-x:auto;">
                  <button type="button" class="btn btn-xs add-li-grade-filter active" data-grade="all" style="border-radius:var(--radius-full);">Semua</button>
                  <button type="button" class="btn btn-xs add-li-grade-filter btn-secondary" data-grade="10" style="border-radius:var(--radius-full);">Kelas 10</button>
                  <button type="button" class="btn btn-xs add-li-grade-filter btn-secondary" data-grade="11" style="border-radius:var(--radius-full);">Kelas 11</button>
                  <button type="button" class="btn btn-xs add-li-grade-filter btn-secondary" data-grade="12" style="border-radius:var(--radius-full);">Kelas 12</button>
                  <button type="button" class="btn btn-xs add-li-grade-filter btn-secondary" data-grade="faculty" style="border-radius:var(--radius-full);">Guru &amp; Staf</button>
                </div>
              </div>

              <!-- Love Interest Grid -->
              <div id="addLiGridContainer" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:12px;max-height:260px;overflow-y:auto;padding:4px;margin-bottom:1.5rem;border:1px solid var(--border-card);border-radius:var(--radius-sm);background:rgba(0,0,0,0.2);">
                <div style="text-align:center;grid-column:1/-1;padding:2rem;color:var(--text-muted);">
                  Memuat arsip Love Interest...
                </div>
              </div>

              <!-- Selected Character Config Form -->
              <div id="addLiConfigPanel" style="display:none;background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;animation:fadeIn 0.2s ease;">
                <div style="display:flex;align-items:center;gap:14px;margin-bottom:1rem;border-bottom:1px solid var(--border-subtle);padding-bottom:0.75rem;">
                  <img id="addLiSelectedAvatar" src="" alt="Selected Avatar" style="width:52px;height:52px;border-radius:var(--radius-sm);object-fit:cover;border:2px solid var(--rose-primary);" />
                  <div>
                    <h4 id="addLiSelectedName" style="margin:0;font-size:1.1rem;color:var(--amber-gold);">Nama</h4>
                    <span id="addLiSelectedBadges" style="font-size:0.8rem;color:var(--text-muted);">Kelas • Ekskul</span>
                  </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem;">
                  <div>
                    <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                      Status Hubungan:
                    </label>
                    <select id="addLiStatusSelect" class="input-select" style="width:100%;font-size:0.85rem;">
                      <option value="Secret Crush">Secret Crush (Gebetan Rahasia)</option>
                      <option value="Rival">Rival (Kompetisi Seimbang)</option>
                      <option value="Teman Sebangku">Teman Sebangku / Sekelas</option>
                      <option value="Sahabat Masa Kecil">Sahabat Masa Kecil</option>
                      <option value="Kagum dari Jauh">Kagum dari Jauh</option>
                      <option value="Sering Berpapasan">Sering Berpapasan (Mulai Tertarik)</option>
                      <option value="Calon Pacar">Calon Pacar (PDKT Intens)</option>
                      <option value="Kekasih (Canon Lovers)">Kekasih (Canon Lovers)</option>
                      <option value="CUSTOM">-- Masukkan Status Custom... --</option>
                    </select>
                    <input type="text" id="addLiCustomStatusInput" placeholder="Ketik status khusus..." style="display:none;width:100%;margin-top:6px;" class="input-text" />
                  </div>

                  <div>
                    <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                      Affection Awal: <strong id="addLiAffLabel" style="color:var(--rose-light);">1</strong>/10 ♥
                    </label>
                    <input type="range" id="addLiAffRange" min="1" max="10" value="1" style="width:100%;accent-color:var(--rose-primary);margin-top:8px;" />
                  </div>
                </div>

                <div>
                  <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                    Catatan Rahasia DM &amp; Event Flag Awal:
                  </label>
                  <textarea
                    id="addLiSecretTextarea"
                    rows="2"
                    placeholder="Momen pertemuan pertama, trauma rahasia, atau trigger debaran hati khusus..."
                    class="input-textarea"
                    style="width:100%;font-size:0.85rem;"
                  ></textarea>
                </div>

                <div style="margin-top:1.25rem;display:flex;justify-content:flex-end;">
                  <button type="button" id="btnSavePresetLi" class="btn btn-primary" style="background:var(--rose-primary);border-color:var(--rose-primary);padding:0.6rem 1.5rem;font-weight:700;">
                    💖 Tambahkan ke Lembar Karakter
                  </button>
                </div>
              </div>

            </div>

            <!-- ================= TAB 2: TARGET CUSTOM ================= -->
            <div id="addLiTabCustomContent" style="display:none;">
              <div style="background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.5rem;">
                <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 1.25rem 0;">
                  Gunakan form ini jika kamu ingin menambahkan NPC orisinal atau rival unik buatanmu sendiri yang tidak ada di katalog Housen Academy.
                </p>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:1rem;">
                  <div>
                    <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                      Nama Target / NPC: <span style="color:#f43f5e;">*</span>
                    </label>
                    <input type="text" id="addLiCustomNameInput" class="input-text" placeholder="misal: Tachibana Aoi / Kazuki" style="width:100%;" required />
                  </div>
                  <div>
                    <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                      Kelas / Peran Sekolah:
                    </label>
                    <input type="text" id="addLiCustomClassInput" class="input-text" placeholder="misal: Kelas 10-2 / Ketua Ekskul Renang" style="width:100%;" />
                  </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:1rem;">
                  <div>
                    <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                      Status Hubungan:
                    </label>
                    <input type="text" id="addLiCustomStatusField" class="input-text" placeholder="misal: Secret Crush / Rival / Teman Dekat" value="Secret Crush" style="width:100%;" />
                  </div>
                  <div>
                    <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                      Affection Awal: <strong id="addLiCustomAffLabel" style="color:var(--rose-light);">1</strong>/10 ♥
                    </label>
                    <input type="range" id="addLiCustomAffRange" min="1" max="10" value="1" style="width:100%;accent-color:var(--rose-primary);margin-top:8px;" />
                  </div>
                </div>

                <div style="margin-bottom:1.5rem;">
                  <label style="display:block;font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                    Catatan Rahasia DM / Event Flag:
                  </label>
                  <textarea id="addLiCustomSecretInput" rows="2" class="input-textarea" placeholder="Rahasia yang hanya diketahui oleh Game Master..." style="width:100%;"></textarea>
                </div>

                <div style="display:flex;justify-content:flex-end;">
                  <button type="button" id="btnSaveCustomLi" class="btn btn-primary" style="padding:0.6rem 1.5rem;font-weight:700;">
                    + Tambah Target Custom
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="modal-footer" style="padding:1rem 1.75rem;border-top:1px solid var(--border-card);display:flex;justify-content:flex-end;">
            <button type="button" class="btn btn-secondary" id="closeAddLiModalFooterBtn">Tutup</button>
          </div>

        </div>
      </div>
    `;
  }

  public async open(char: Character, onSave: () => void): Promise<void> {
    this.currentCharacter = char;
    this.onSaveCallback = onSave;
    this.selectedLi = null;
    this.activeTab = "catalog";
    this.activeGradeFilter = "all";
    this.searchQuery = "";

    this.modalEl = document.getElementById("addLoveInterestModal");
    if (!this.modalEl) return;

    this.modalEl.style.display = "flex";
    this.switchTab("catalog");

    // Muat daftar dinamis dari Supabase DB
    this.allInterests = await fetchDynamicLoveInterests();
    this.renderGrid();
    this.attachEvents();
  }

  public close(): void {
    if (this.modalEl) {
      this.modalEl.style.display = "none";
    }
  }

  private switchTab(tab: "catalog" | "custom"): void {
    this.activeTab = tab;
    const catBtn = document.getElementById("addLiTabBtnCatalog");
    const custBtn = document.getElementById("addLiTabBtnCustom");
    const catContent = document.getElementById("addLiTabCatalogContent");
    const custContent = document.getElementById("addLiTabCustomContent");

    if (tab === "catalog") {
      catBtn?.classList.add("active");
      custBtn?.classList.remove("active");
      if (catBtn) {
        catBtn.style.borderBottom = "2px solid var(--rose-primary)";
        catBtn.style.color = "var(--rose-light)";
      }
      if (custBtn) {
        custBtn.style.borderBottom = "2px solid transparent";
        custBtn.style.color = "var(--text-muted)";
      }
      if (catContent) catContent.style.display = "block";
      if (custContent) custContent.style.display = "none";
    } else {
      custBtn?.classList.add("active");
      catBtn?.classList.remove("active");
      if (custBtn) {
        custBtn.style.borderBottom = "2px solid var(--rose-primary)";
        custBtn.style.color = "var(--rose-light)";
      }
      if (catBtn) {
        catBtn.style.borderBottom = "2px solid transparent";
        catBtn.style.color = "var(--text-muted)";
      }
      if (custContent) custContent.style.display = "block";
      if (catContent) catContent.style.display = "none";
    }
  }

  private renderGrid(): void {
    const grid = document.getElementById("addLiGridContainer");
    if (!grid) return;

    const existingNames = new Set(
      (this.currentCharacter?.targets || []).map((t) => (t.slug || t.name).toLowerCase())
    );

    const filtered = this.allInterests.filter((li) => {
      // Filter grade
      if (this.activeGradeFilter !== "all") {
        if (this.activeGradeFilter === "faculty") {
          const isFac = String(li.grade).includes("fac") || li.category_id === "faculty" || String(li.role).toLowerCase().includes("guru");
          if (!isFac) return false;
        } else {
          if (String(li.grade) !== this.activeGradeFilter) return false;
        }
      }

      // Filter query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const inName = li.name.toLowerCase().includes(q) || li.furigana.toLowerCase().includes(q);
        const inNick = (li.nickname || []).some((n) => n.toLowerCase().includes(q));
        const inClass = li.class_room.toLowerCase().includes(q);
        const inClub = li.club.toLowerCase().includes(q);
        const inArch = (li.archetype || "").toLowerCase().includes(q);
        if (!inName && !inNick && !inClass && !inClub && !inArch) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="text-align:center;grid-column:1/-1;padding:2rem;color:var(--text-muted);font-size:0.9rem;">
          Tidak ada Love Interest yang cocok dengan filter.
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((li) => {
      const isSelected = this.selectedLi?.slug === li.slug;
      const isAlreadyAdded = existingNames.has(li.slug.toLowerCase()) || existingNames.has(li.name.toLowerCase());
      const avatar = li.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${li.slug}`;

      return `
        <div
          class="add-li-item-card"
          data-slug="${li.slug}"
          style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${isSelected ? 'rgba(225,29,72,0.18)' : 'var(--bg-card)'};border:1.5px solid ${isSelected ? 'var(--rose-primary)' : 'var(--border-card)'};border-radius:var(--radius-sm);cursor:pointer;transition:all 0.15s ease;"
        >
          <img
            src="${avatar}"
            alt="${escapeHtml(li.name)}"
            onerror="this.src='https://api.dicebear.com/7.x/adventurer/svg?seed=${li.slug}'"
            style="width:42px;height:42px;border-radius:var(--radius-sm);object-fit:cover;flex-shrink:0;border:1px solid var(--border-subtle);"
          />
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
              <span style="font-weight:700;font-size:0.85rem;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${escapeHtml(li.name.replace(/\([^)]+\)/, "").trim())}
              </span>
              ${isAlreadyAdded ? `
                <span style="font-size:0.65rem;background:rgba(234,179,8,0.15);color:#fde047;border:1px solid rgba(234,179,8,0.4);border-radius:var(--radius-full);padding:1px 6px;">
                  Tercatat
                </span>
              ` : ''}
            </div>
            <div style="font-size:0.72rem;color:var(--text-muted);display:flex;gap:6px;margin-top:2px;">
              <span>${escapeHtml(li.class_room || `Grade ${li.grade}`)}</span>
              ${li.club ? `<span>• ${escapeHtml(li.club)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Attach card clicks
    grid.querySelectorAll(".add-li-item-card").forEach((card) => {
      card.addEventListener("click", () => {
        const slug = card.getAttribute("data-slug");
        const found = this.allInterests.find((li) => li.slug === slug);
        if (found) {
          this.selectCharacter(found);
        }
      });
    });
  }

  private selectCharacter(li: LoveInterestDefinition): void {
    this.selectedLi = li;
    this.renderGrid();

    const panel = document.getElementById("addLiConfigPanel");
    const nameEl = document.getElementById("addLiSelectedName");
    const badgesEl = document.getElementById("addLiSelectedBadges");
    const avatarEl = document.getElementById("addLiSelectedAvatar") as HTMLImageElement;
    const affRange = document.getElementById("addLiAffRange") as HTMLInputElement;
    const affLabel = document.getElementById("addLiAffLabel");

    if (panel) panel.style.display = "block";
    if (nameEl) nameEl.textContent = li.name;
    if (badgesEl) {
      badgesEl.textContent = `${li.class_room || `Grade ${li.grade}`} • ${li.club || 'Umum'} • ${li.archetype || 'Idola'}`;
    }
    if (avatarEl) {
      avatarEl.src = li.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${li.slug}`;
    }
    if (affRange && affLabel) {
      const baseAff = li.heart_meter?.base || 1;
      affRange.value = String(baseAff);
      affLabel.textContent = String(baseAff);
    }

    panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  private attachEvents(): void {
    // Close buttons
    document.getElementById("closeAddLiModalBtn")?.addEventListener("click", () => this.close());
    document.getElementById("closeAddLiModalFooterBtn")?.addEventListener("click", () => this.close());

    // Tabs
    document.getElementById("addLiTabBtnCatalog")?.addEventListener("click", () => this.switchTab("catalog"));
    document.getElementById("addLiTabBtnCustom")?.addEventListener("click", () => this.switchTab("custom"));

    // Search input
    const searchInput = document.getElementById("addLiSearchInput") as HTMLInputElement;
    searchInput?.addEventListener("input", (e: any) => {
      this.searchQuery = e.target.value.trim();
      this.renderGrid();
    });

    // Grade filters
    document.querySelectorAll(".add-li-grade-filter").forEach((btn) => {
      btn.addEventListener("click", (e: any) => {
        document.querySelectorAll(".add-li-grade-filter").forEach((b) => {
          b.classList.remove("active");
          b.classList.add("btn-secondary");
        });
        e.currentTarget.classList.add("active");
        e.currentTarget.classList.remove("btn-secondary");
        this.activeGradeFilter = e.currentTarget.dataset.grade || "all";
        this.renderGrid();
      });
    });

    // Preset Slider Label
    const affRange = document.getElementById("addLiAffRange") as HTMLInputElement;
    const affLabel = document.getElementById("addLiAffLabel");
    affRange?.addEventListener("input", (e: any) => {
      if (affLabel) affLabel.textContent = e.target.value;
    });

    // Custom Slider Label
    const customAffRange = document.getElementById("addLiCustomAffRange") as HTMLInputElement;
    const customAffLabel = document.getElementById("addLiCustomAffLabel");
    customAffRange?.addEventListener("input", (e: any) => {
      if (customAffLabel) customAffLabel.textContent = e.target.value;
    });

    // Custom status toggle
    const statusSelect = document.getElementById("addLiStatusSelect") as HTMLSelectElement;
    const customStatusInput = document.getElementById("addLiCustomStatusInput") as HTMLInputElement;
    statusSelect?.addEventListener("change", () => {
      if (statusSelect.value === "CUSTOM") {
        if (customStatusInput) customStatusInput.style.display = "block";
      } else {
        if (customStatusInput) customStatusInput.style.display = "none";
      }
    });

    // Save Preset Button
    document.getElementById("btnSavePresetLi")?.addEventListener("click", () => {
      if (!this.selectedLi || !this.currentCharacter) {
        showToast("Pilih salah satu karakter love interest terlebih dahulu.", "error");
        return;
      }

      let status = statusSelect?.value || "Secret Crush";
      if (status === "CUSTOM") {
        status = customStatusInput?.value.trim() || "Secret Crush";
      }

      const hearts = parseInt(affRange?.value || "1", 10);
      const secret = (document.getElementById("addLiSecretTextarea") as HTMLTextAreaElement)?.value.trim() || "";

      if (!this.currentCharacter.targets) {
        this.currentCharacter.targets = [];
      }

      // Check if already in targets, if so update, else push
      const existingIdx = this.currentCharacter.targets.findIndex(
        (t) => (t.slug && t.slug === this.selectedLi!.slug) || t.name.toLowerCase() === this.selectedLi!.name.toLowerCase()
      );

      const targetData: TargetSecret = {
        name: this.selectedLi.name,
        status,
        affection: hearts,
        secret,
        slug: this.selectedLi.slug,
        character_id: this.selectedLi.id,
        avatar_url: this.selectedLi.avatar_url,
        class_room: this.selectedLi.class_room,
        nickname: this.selectedLi.nickname?.[0] || ""
      };

      if (existingIdx !== -1) {
        this.currentCharacter.targets[existingIdx] = targetData;
        showToast(`Target diperbarui: ${this.selectedLi.name}`, "success");
      } else {
        this.currentCharacter.targets.push(targetData);
        showToast(`Target baru ditambahkan: ${this.selectedLi.name} ♥`, "success");
      }

      this.close();
      if (this.onSaveCallback) this.onSaveCallback();
    });

    // Save Custom Button
    document.getElementById("btnSaveCustomLi")?.addEventListener("click", () => {
      if (!this.currentCharacter) return;

      const nameInput = document.getElementById("addLiCustomNameInput") as HTMLInputElement;
      const classInput = document.getElementById("addLiCustomClassInput") as HTMLInputElement;
      const statusInput = document.getElementById("addLiCustomStatusField") as HTMLInputElement;
      const secretInput = document.getElementById("addLiCustomSecretInput") as HTMLTextAreaElement;

      const name = nameInput?.value.trim();
      if (!name) {
        showToast("Nama target wajib diisi.", "error");
        nameInput?.focus();
        return;
      }

      const hearts = parseInt(customAffRange?.value || "1", 10);
      const status = statusInput?.value.trim() || "Secret Crush";
      const secret = secretInput?.value.trim() || "";
      const classRoom = classInput?.value.trim() || "";

      if (!this.currentCharacter.targets) {
        this.currentCharacter.targets = [];
      }

      const targetData: TargetSecret = {
        name,
        status,
        affection: hearts,
        secret,
        class_room: classRoom,
        avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      };

      this.currentCharacter.targets.push(targetData);
      showToast(`Target custom ditambahkan: ${name}`, "success");

      this.close();
      if (this.onSaveCallback) this.onSaveCallback();
    });
  }
}

export const addLoveInterestModal = new AddLoveInterestModal();
