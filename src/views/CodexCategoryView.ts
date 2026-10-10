import {
  fetchCodexCategories,
  fetchCodexList,
  dmListAll,
  dmIntroduce,
  dmLockAll,
  dmBatchIntroduce,
  dmBatchSetTier,
  dmBatchLockAll,
  resolvePortraitUrl
} from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmAuthModal } from "../components/DmAuthModal";
import { renderDmCodexBar, attachDmCodexBarEvents } from "../components/DmCodexBar";
import { renderCodexSilhouetteSvg } from "../components/CodexSilhouette";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import { codexRealtime, triggerSakuraUnlockAnimation } from "../realtime/codexRealtime";
import { codexCharacterEditorModal } from "../components/CodexCharacterEditorModal";
import { getLoveInterestBySlug } from "../data/loveInterestCompendium";
import type { CodexCategory, CodexCharacterCard, DmCodexCharacter } from "../types";

let categoryRealtimeUnsub: (() => void) | null = null;
let selectedCharIds: Set<string> = new Set();

export async function renderCodexCategoryView(params: Record<string, string>): Promise<void> {
  const categoryId = params.category;
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  // Cleanup existing realtime subscription
  if (categoryRealtimeUnsub) {
    categoryRealtimeUnsub();
    categoryRealtimeUnsub = null;
  }
  selectedCharIds.clear();

  appContainer.innerHTML = `
    <section class="view-section active codex-category-view" style="max-width:1200px;margin:2rem auto;padding:0 1.5rem 6rem 1.5rem;">
      <!-- Breadcrumb & Top Bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
        <a href="/codex" style="text-decoration:none;color:var(--text-muted);font-size:0.9rem;display:flex;align-items:center;gap:6px;">
          <span>← Kembali ke Daftar Kategori</span>
        </a>
        <div style="display:flex;gap:10px;align-items:center;">
          ${!dmAuthStore.isAuthenticated() ? `
            <button id="openDmLoginBtn" class="btn btn-secondary btn-xs" style="border:1px solid var(--amber-gold);color:var(--amber-gold);">
              👑 Mode DM
            </button>
          ` : `
            <span style="font-size:0.8rem;color:var(--amber-gold);background:rgba(245,158,11,0.1);padding:4px 10px;border-radius:var(--radius-full);border:1px solid var(--amber-gold);">
              👑 Mode Game Master Aktif
            </span>
          `}
        </div>
      </div>

      <!-- Category Title Header -->
      <div id="categoryHeaderContainer" style="margin-bottom:2rem;">
        <div class="skeleton-shimmer" style="height:40px;width:300px;border-radius:var(--radius-sm);margin-bottom:0.5rem;"></div>
      </div>

      <!-- DM Batch Selection Toolbar (Active in DM Mode) -->
      <div id="dmBatchToolbarContainer" style="display:none;"></div>

      <!-- Search & Filters Toolbar -->
      <div class="codex-toolbar" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:space-between;">
        <div style="display:flex;gap:0.75rem;flex:1;min-width:240px;">
          <input
            type="text"
            id="codexSearchInput"
            placeholder="Cari nama, julukan, atau peran (hanya karakter terbuka)..."
            style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem 1rem;color:var(--text-main);font-size:0.9rem;outline:none;"
          />
        </div>

        <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
          ${dmAuthStore.isDmActive() ? `
            <select id="codexDmStatusFilter" style="background:var(--bg-input);border:1px solid var(--amber-gold);border-radius:var(--radius-sm);padding:0.6rem 0.8rem;color:var(--amber-gold);font-size:0.85rem;outline:none;">
              <option value="all">Semua Status DM</option>
              <option value="never_opened">🔒 Belum Pernah Dibuka</option>
              <option value="partially_opened">✓ Sudah Dibuka Sebagian</option>
              <option value="fully_opened">🌟 Terbuka Penuh</option>
            </select>
          ` : ""}

          <select id="codexClubFilter" style="background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem 0.8rem;color:var(--text-main);font-size:0.85rem;outline:none;">
            <option value="all">Semua Ekskul</option>
          </select>

          <button id="resetCodexFiltersBtn" class="btn btn-secondary btn-sm" style="padding:0.6rem 1rem;">
            Reset
          </button>
        </div>
      </div>

      <!-- Character Grid -->
      <div id="codexCharacterGrid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:1.75rem;">
        <div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-muted);">
          Memuat arsip karakter...
        </div>
      </div>

      ${renderDmCodexBar()}
    </section>
  `;

  // Attach DM Bar & Modal Events
  document.getElementById("openDmLoginBtn")?.addEventListener("click", () => {
    dmAuthModal.open(() => renderCodexCategoryView(params));
  });
  attachDmCodexBarEvents(() => renderCodexCategoryView(params));

  // Connect to Supabase Realtime for zero-refresh live reveals
  categoryRealtimeUnsub = codexRealtime.subscribe(async (payload) => {
    const isDm = dmAuthStore.isDmActive();
    // Silently re-sync category data
    await loadCategoryData(categoryId, false);

    // If section opened (INSERT), trigger sakura bloom animation
    if (payload.eventType === "INSERT" && payload.new?.character_id) {
      const charCard = document.querySelector(`[data-char-id="${payload.new.character_id}"]`) as HTMLElement;
      if (charCard) {
        triggerSakuraUnlockAnimation(charCard);
      }
      if (!isDm) {
        showToast("🌸 Karakter baru telah diperkenalkan oleh Game Master!", "info");
      }
    }
  });

  await loadCategoryData(categoryId);
}


let allLoadedCards: (CodexCharacterCard | DmCodexCharacter)[] = [];

async function loadCategoryData(categoryId: string, _silent: boolean = false) {
  const headerContainer = document.getElementById("categoryHeaderContainer");
  const gridContainer = document.getElementById("codexCharacterGrid");
  const clubFilter = document.getElementById("codexClubFilter") as HTMLSelectElement;
  const searchInput = document.getElementById("codexSearchInput") as HTMLInputElement;
  const resetBtn = document.getElementById("resetCodexFiltersBtn");

  // 1. Get Category Details
  const categories = await fetchCodexCategories();
  const currentCategory = categories.find(c => c.id === categoryId) || {
    id: categoryId,
    name: categoryId === "love_interest" ? "Target Asmara" : categoryId,
    description: "Arsip karakter SMA Housen Academy",
    sort_order: 0,
    show_totals: false,
    default_visibility_mode: "placeholder"
  };

  if (headerContainer) {
    headerContainer.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:0.5rem;">
        <h1 style="font-family:var(--font-heading);font-size:2rem;color:var(--amber-gold);margin:0;">
          ${currentCategory.name}
        </h1>
        ${currentCategory.id === "love_interest" ? `
          <span style="background:var(--rose-primary);color:#fff;font-size:0.75rem;padding:3px 10px;border-radius:var(--radius-full);font-weight:700;letter-spacing:0.04em;">
            ROMANCE
          </span>
        ` : ""}
      </div>
      <p style="color:var(--text-muted);font-size:0.9rem;margin:0;">
        ${currentCategory.description || "Daftar murid dan tokoh di kategori ini."}
      </p>
    `;
  }

  // 2. Fetch Characters (Player mode vs DM mode)
  const isDmActive = dmAuthStore.isDmActive();
  const dmToken = dmAuthStore.getToken();

  try {
    if (isDmActive && dmToken) {
      const allDmChars = await dmListAll(dmToken);
      // Filter by category or if category is love_interest, include is_love_interest == true
      if (categoryId === "love_interest") {
        allLoadedCards = allDmChars.filter(c => c.is_love_interest || c.category_id === "love_interest");
      } else {
        allLoadedCards = allDmChars.filter(c => c.category_id === categoryId);
      }
    } else {
      allLoadedCards = await fetchCodexList(categoryId);
    }
  } catch (e: any) {
    console.error("Gagal mengambil data karakter:", e);
    allLoadedCards = [];
  }

  // 3. Populate Club Filters
  if (clubFilter) {
    const clubsSet = new Set<string>();
    allLoadedCards.forEach(c => {
      const card = c as any;
      if (!card.locked && card.club) {
        clubsSet.add(card.club);
      }
    });

    clubFilter.innerHTML = `<option value="all">Semua Ekskul</option>` +
      Array.from(clubsSet).map(club => `<option value="${club}">${club}</option>`).join("");
  }

  // 4. Initial Render
  renderCards(allLoadedCards, isDmActive, categoryId);

  // 5. Attach Filter & Search Handlers
  const filterAction = () => {
    const q = (searchInput?.value || "").toLowerCase().trim();
    const club = clubFilter?.value || "all";
    const statusFilter = (document.getElementById("codexDmStatusFilter") as HTMLSelectElement)?.value || "all";

    const filtered = allLoadedCards.filter(c => {
      const card = c as any;
      const revCount = (card.revealed_sections || []).length;
      const isActuallyLocked = card.locked || revCount === 0;

      // DM Status Filter
      if (statusFilter === "never_opened" && !isActuallyLocked) return false;
      if (statusFilter === "partially_opened" && (isActuallyLocked || revCount >= 7)) return false;
      if (statusFilter === "fully_opened" && revCount < 7) return false;

      // If locked: always keep in list unless search query is active
      if (card.locked && !isDmActive) {
        return q === ""; // locked cards don't match text search to prevent leaking
      }

      // If unlocked or in DM mode: match name, nickname, or role
      const nameMatch = !q ||
        (card.name && card.name.toLowerCase().includes(q)) ||
        (card.tagline && card.tagline.toLowerCase().includes(q)) ||
        (card.role && card.role.toLowerCase().includes(q));

      const clubMatch = club === "all" || (card.club && card.club.toLowerCase() === club.toLowerCase());

      return nameMatch && clubMatch;
    });

    renderCards(filtered, isDmActive, categoryId);
  };

  searchInput?.addEventListener("input", filterAction);
  clubFilter?.addEventListener("change", filterAction);
  document.getElementById("codexDmStatusFilter")?.addEventListener("change", filterAction);
  resetBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (clubFilter) clubFilter.value = "all";
    const dmSelect = document.getElementById("codexDmStatusFilter") as HTMLSelectElement;
    if (dmSelect) dmSelect.value = "all";
    filterAction();
  });
}

function renderBatchToolbar(cards: any[], currentCategoryId: string) {
  const container = document.getElementById("dmBatchToolbarContainer");
  if (!container) return;

  const isDmActive = dmAuthStore.isDmActive();
  if (!isDmActive) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  const selectedCount = selectedCharIds.size;
  const totalCount = cards.length;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

  container.innerHTML = `
    <div class="codex-batch-bar">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-family:var(--font-heading);font-size:0.85rem;color:var(--amber-gold);">
          <input type="checkbox" id="dmBatchSelectAllCb" ${isAllSelected ? "checked" : ""} style="cursor:pointer;accent-color:var(--amber-gold);width:16px;height:16px;" />
          <span>Pilih Semua (${totalCount})</span>
        </label>
        <span style="font-size:0.8rem;color:var(--text-muted);background:rgba(255,255,255,0.06);padding:3px 10px;border-radius:var(--radius-full);">
          ${selectedCount} karakter terpilih
        </span>
        <button id="dmCategoryAddCharBtn" class="btn btn-xs btn-primary" style="background:var(--amber-gold);border-color:var(--amber-gold);color:#0d111a;font-weight:700;display:flex;align-items:center;gap:4px;">
          <span>➕ Tambah Karakter</span>
        </button>
      </div>

      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button id="dmBatchBtnTier1" class="btn btn-xs btn-primary" ${selectedCount === 0 ? "disabled" : ""} style="background:var(--rose-primary);border-color:var(--rose-primary);display:flex;align-items:center;gap:4px;">
          <span>🌸 Buka Tier 1</span>
        </button>
        <button id="dmBatchBtnTier2" class="btn btn-xs btn-secondary" ${selectedCount === 0 ? "disabled" : ""} style="display:flex;align-items:center;gap:4px;">
          <span>📖 Buka Tier 2</span>
        </button>
        <button id="dmBatchBtnTier3" class="btn btn-xs btn-secondary" ${selectedCount === 0 ? "disabled" : ""} style="display:flex;align-items:center;gap:4px;">
          <span>🌟 Buka Tier 3</span>
        </button>
        <button id="dmBatchBtnLock" class="btn btn-xs btn-secondary" ${selectedCount === 0 ? "disabled" : ""} style="border-color:var(--rose-primary);color:var(--rose-light);display:flex;align-items:center;gap:4px;">
          <span>🔒 Kunci Terpilih</span>
        </button>
        ${selectedCount > 0 ? `
          <button id="dmBatchBtnClear" class="btn btn-xs" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px 8px;">
            ✕ Batal
          </button>
        ` : ""}
      </div>
    </div>
  `;

  document.getElementById("dmCategoryAddCharBtn")?.addEventListener("click", () => {
    codexCharacterEditorModal.openForCreate(currentCategoryId, () => {
      loadCategoryData(currentCategoryId);
    });
  });

  // Attach Select All Handler
  document.getElementById("dmBatchSelectAllCb")?.addEventListener("change", (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      cards.forEach(c => selectedCharIds.add(c.id));
    } else {
      selectedCharIds.clear();
    }
    renderCards(cards, isDmActive, currentCategoryId);
  });

  // Attach Clear Selection
  document.getElementById("dmBatchBtnClear")?.addEventListener("click", () => {
    selectedCharIds.clear();
    renderCards(cards, isDmActive, currentCategoryId);
  });

  // Attach Batch Actions
  const token = dmAuthStore.getToken();
  if (!token) return;

  const ids = Array.from(selectedCharIds);

  document.getElementById("dmBatchBtnTier1")?.addEventListener("click", async () => {
    if (ids.length === 0) return;
    try {
      showToast(`Sedang membuka Tier 1 untuk ${ids.length} karakter...`, "info");
      await dmBatchIntroduce(token, ids);
      showToast(`🌸 Berhasil membuka Tier 1 untuk ${ids.length} karakter!`, "success");
      selectedCharIds.clear();
      await loadCategoryData(currentCategoryId);
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`, "error");
    }
  });

  document.getElementById("dmBatchBtnTier2")?.addEventListener("click", async () => {
    if (ids.length === 0) return;
    try {
      showToast(`Sedang membuka Tier 2 untuk ${ids.length} karakter...`, "info");
      await dmBatchSetTier(token, ids, 2, true);
      showToast(`📖 Berhasil membuka Tier 2 untuk ${ids.length} karakter!`, "success");
      selectedCharIds.clear();
      await loadCategoryData(currentCategoryId);
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`, "error");
    }
  });

  document.getElementById("dmBatchBtnTier3")?.addEventListener("click", async () => {
    if (ids.length === 0) return;
    try {
      showToast(`Sedang membuka Tier 3 untuk ${ids.length} karakter...`, "info");
      await dmBatchSetTier(token, ids, 3, true);
      showToast(`🌟 Berhasil membuka Tier 3 untuk ${ids.length} karakter!`, "success");
      selectedCharIds.clear();
      await loadCategoryData(currentCategoryId);
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`, "error");
    }
  });

  document.getElementById("dmBatchBtnLock")?.addEventListener("click", async () => {
    if (ids.length === 0) return;
    const confirmed = confirm(`Apakah Anda yakin ingin MENGUNCI KEMBALI ${ids.length} karakter yang dipilih?`);
    if (!confirmed) return;

    try {
      showToast(`Sedang mengunci ${ids.length} karakter...`, "info");
      await dmBatchLockAll(token, ids);
      showToast(`🔒 Berhasil mengunci ${ids.length} karakter!`, "info");
      selectedCharIds.clear();
      await loadCategoryData(currentCategoryId);
    } catch (err: any) {
      showToast(`Gagal: ${err.message}`, "error");
    }
  });
}

function renderCards(cards: any[], isDmActive: boolean, currentCategoryId: string) {
  const container = document.getElementById("codexCharacterGrid");
  if (!container) return;

  // Always sync batch toolbar
  renderBatchToolbar(cards, currentCategoryId);

  if (cards.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem;background:var(--bg-card);border:1px dashed var(--border-card);border-radius:var(--radius-lg);">
        <div style="font-size:2.5rem;margin-bottom:1rem;">🌸</div>
        <h3 style="color:var(--text-main);margin:0 0 0.5rem 0;">Tidak Ada Karakter yang Cocok</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin:0;">
          Karakter yang belum diperkenalkan oleh DM tidak akan muncul dalam hasil pencarian.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = cards.map((c, idx) => {
    const isLocked = Boolean(c.locked);
    const isSelected = selectedCharIds.has(c.id);

    // KARTU TERKUNCI (SILUET MISTERIUS)
    if (isLocked && !isDmActive) {
      return `
        <div class="codex-character-card locked" data-char-id="${c.id}" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);cursor:pointer;display:flex;flex-direction:column;transition:all 0.25s ease;">
          <div style="padding:1.5rem 1rem 1rem 1rem;background:radial-gradient(circle at center, #1f1b29 0%, #0d111a 100%);text-align:center;position:relative;">
            <div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.6);border:1px solid var(--border-card);color:var(--amber-gold);font-size:0.75rem;padding:3px 8px;border-radius:var(--radius-full);display:flex;align-items:center;gap:4px;">
              <span>🔒 Terkunci</span>
            </div>
            ${renderCodexSilhouetteSvg(160, 200)}
          </div>

          <div style="padding:1.25rem;display:flex;flex-direction:column;gap:8px;margin-top:auto;border-top:1px solid var(--border-subtle);text-align:center;">
            <span style="font-size:0.75rem;color:var(--text-muted);letter-spacing:0.05em;text-transform:uppercase;">
              ${c.is_love_interest ? "Target Asmara" : "Murid"} #${idx + 1}
            </span>
            <h3 style="font-family:var(--font-heading);color:var(--text-muted);margin:0;font-size:1.2rem;">
              ???
            </h3>
            <p style="color:var(--text-muted);font-size:0.8rem;margin:0;">
              Belum diperkenalkan oleh Game Master
            </p>
          </div>
        </div>
      `;
    }

    // KARTU TERBUKA (ATAU DALAM MODE DM)
    const avatar = resolvePortraitUrl(c.avatar_url, c.slug) || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.slug || c.id}`;
    const revealedCount = (c.revealed_sections || []).length;
    const isActuallyLocked = isLocked || revealedCount === 0;

    return `
      <div class="codex-character-card unlocked ${isSelected ? "codex-card-selected" : ""}" data-char-id="${c.id}" data-char-slug="${c.slug || c.id}" style="background:var(--bg-card);border:1px solid ${c.is_love_interest ? "rgba(225,29,72,0.4)" : "var(--border-card)"};border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);cursor:pointer;display:flex;flex-direction:column;transition:all 0.25s ease;position:relative;">
        
        <!-- DM Selection Checkbox (Top Left) -->
        ${isDmActive ? `
          <div class="dm-card-checkbox-wrapper" onclick="event.stopPropagation();">
            <input type="checkbox" class="dm-char-select-cb" data-char-id="${c.id}" ${isSelected ? "checked" : ""} />
          </div>
        ` : ""}

        <!-- Image & Badges -->
        <div style="position:relative;height:240px;background:#0d111a;overflow:hidden;">
          <img src="${avatar}" alt="${c.name || 'Avatar'}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s ease;" class="card-portrait" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='https://api.dicebear.com/7.x/adventurer/svg?seed=${c.slug || c.id}';}" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(17,24,39,0.95) 0%, rgba(17,24,39,0.1) 60%, transparent 100%);"></div>

          <!-- Top Badges -->
          <div style="position:absolute;top:10px;left:${isDmActive ? "44px" : "10px"};display:flex;gap:6px;flex-wrap:wrap;">
            ${c.is_love_interest ? `
              <span style="background:var(--rose-primary);color:#fff;font-size:0.65rem;font-weight:700;padding:3px 8px;border-radius:var(--radius-full);font-family:var(--font-heading);letter-spacing:0.04em;display:flex;align-items:center;gap:3px;">
                <span>♥</span> HEROINE
              </span>
            ` : ""}
            ${c.class_room ? `
              <span style="background:rgba(0,0,0,0.6);border:1px solid var(--border-card);color:var(--amber-gold);font-size:0.7rem;padding:3px 8px;border-radius:var(--radius-full);">
                ${c.class_room}
              </span>
            ` : ""}
          </div>

          ${isDmActive ? `
            <div style="position:absolute;top:10px;right:10px;background:${isActuallyLocked ? "rgba(225,29,72,0.85)" : "rgba(16,185,129,0.85)"};color:#fff;font-size:0.65rem;padding:3px 8px;border-radius:var(--radius-full);font-weight:700;">
              ${isActuallyLocked ? "🔒 TERKUNCI" : `✓ ${revealedCount} SEKSI BUKA`}
            </div>
          ` : ""}

          <!-- Name in Overlay -->
          <div style="position:absolute;bottom:12px;left:14px;right:14px;">
            <div style="font-size:0.75rem;color:var(--rose-light);font-family:var(--font-accent);margin-bottom:2px;">
              ${c.furigana || ""}
            </div>
            <h3 style="font-family:var(--font-heading);color:var(--text-main);margin:0;font-size:1.25rem;text-shadow:0 2px 4px rgba(0,0,0,0.8);">
              ${c.name || "Karakter"}
            </h3>
          </div>
        </div>

        <!-- Details Footer -->
        <div style="padding:1rem 1.25rem;display:flex;flex-direction:column;gap:8px;margin-top:auto;border-top:1px solid var(--border-subtle);">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:var(--text-muted);">
            <span>${c.role || "Murid"}</span>
            <span style="color:var(--amber-gold);">${c.club ? `Ekskul: ${c.club}` : ""}</span>
          </div>

          ${c.tagline ? `
            <p style="margin:4px 0 0 0;font-size:0.8rem;color:var(--text-dim);font-style:italic;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
              "${c.tagline}"
            </p>
          ` : ""}

          <!-- DM Quick Control Buttons on Card -->
          ${isDmActive ? `
            <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border-subtle);display:flex;gap:6px;" onclick="event.stopPropagation();">
              ${isActuallyLocked ? `
                <button class="btn btn-xs btn-primary btn-dm-quick-introduce" data-char-id="${c.id}" style="flex:1;background:var(--rose-primary);border-color:var(--rose-primary);">
                  🌸 Buka Tier 1
                </button>
              ` : `
                <button class="btn btn-xs btn-secondary btn-dm-quick-lock" data-char-id="${c.id}" style="flex:1;">
                  🔒 Kunci Semua
                </button>
              `}
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }).join("");

  // Attach card navigation
  container.querySelectorAll(".codex-character-card").forEach((card) => {
    card.addEventListener("click", () => {
      const slug = card.getAttribute("data-char-slug") || card.getAttribute("data-char-id");
      if (slug) {
        router.navigate(`/codex/c/${slug}`);
      }
    });

    card.addEventListener("mouseenter", () => {
      (card as HTMLElement).style.transform = "translateY(-4px)";
    });
    card.addEventListener("mouseleave", () => {
      (card as HTMLElement).style.transform = "translateY(0)";
    });
  });

  // Attach DM select checkboxes
  if (isDmActive) {
    container.querySelectorAll(".dm-char-select-cb").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const charId = target.getAttribute("data-char-id");
        if (!charId) return;

        if (target.checked) {
          selectedCharIds.add(charId);
        } else {
          selectedCharIds.delete(charId);
        }
        renderCards(cards, isDmActive, currentCategoryId);
      });
    });

    // Attach DM quick action buttons
    container.querySelectorAll(".btn-dm-quick-introduce").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const charId = btn.getAttribute("data-char-id");
        const token = dmAuthStore.getToken();
        if (charId && token) {
          try {
            await dmIntroduce(token, charId);
            showToast("🌸 Berhasil membuka Tier 1 untuk karakter ini!", "success");
            await loadCategoryData(currentCategoryId);
          } catch (e: any) {
            showToast(`Gagal: ${e.message}`, "error");
          }
        }
      });
    });

    container.querySelectorAll(".btn-dm-quick-lock").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const charId = btn.getAttribute("data-char-id");
        const token = dmAuthStore.getToken();
        if (charId && token) {
          try {
            await dmLockAll(token, charId);
            showToast("🔒 Karakter berhasil dikunci kembali.", "info");
            await loadCategoryData(currentCategoryId);
          } catch (e: any) {
            showToast(`Gagal: ${e.message}`, "error");
          }
        }
      });
    });
  }
}
