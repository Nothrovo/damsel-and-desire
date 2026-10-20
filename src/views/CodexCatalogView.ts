import {
  CODEX_HIERARCHY,
  getAllSubcategories,
  isCharacterInSubcategory,
  fetchCodexList
} from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmAuthModal } from "../components/DmAuthModal";
import { renderDmCodexBar, attachDmCodexBarEvents } from "../components/DmCodexBar";
import { codexCharacterEditorModal } from "../components/CodexCharacterEditorModal";
import { router } from "../router/router";
import type { CodexRootGroup, CodexSubCategory, CodexCharacterCard } from "../types";

let activeGroupFilter: string = "all";
let cachedAllCharacters: CodexCharacterCard[] = [];

export async function renderCodexCatalogView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active codex-catalog-view" style="max-width:1200px;margin:2rem auto;padding:0 1.5rem 6rem 1.5rem;">
      <!-- Hero Header -->
      <div class="codex-hero" style="text-align:center;margin-bottom:2.5rem;position:relative;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(225,29,72,0.1);border:1px solid var(--rose-primary);padding:6px 16px;border-radius:var(--radius-full);color:var(--rose-light);font-size:0.85rem;font-weight:700;margin-bottom:1rem;font-family:var(--font-heading);">
          <span>🌸 KREDON ACADEMIC ARCHIVES &amp; CHARACTER DOSSIER</span>
        </div>
        <h1 style="font-family:var(--font-heading);font-size:2.5rem;color:var(--amber-gold);margin:0 0 0.75rem 0;letter-spacing:0.02em;">
          Kamus Karakter &amp; Direktori Sekolah
        </h1>
        <p style="color:var(--text-muted);max-width:760px;margin:0 auto;line-height:1.6;font-size:0.95rem;">
          Jelajahi profil lengkap siswi, dewan OSIS, aliansi berandal Kokuhou, rival SMA Touki, guru, dan faksi klub ekstrakurikuler. Karakter terdaftar secara fleksibel dalam berbagai folder kelas dan organisasi yang sesuai.
        </p>

        <!-- DM Login Button Bar -->
        <div style="margin-top:1.5rem;display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          ${!dmAuthStore.isAuthenticated() ? `
            <button id="openDmLoginBtn" class="btn btn-secondary btn-sm" style="border:1px solid var(--amber-gold);color:var(--amber-gold);background:rgba(245,158,11,0.08);display:flex;align-items:center;gap:8px;border-radius:var(--radius-full);padding:8px 18px;cursor:pointer;">
              <span>👑 Masuk sebagai Game Master (DM)</span>
            </button>
          ` : `
            <span style="font-size:0.85rem;color:var(--amber-gold);display:flex;align-items:center;gap:6px;background:rgba(245,158,11,0.1);padding:6px 14px;border-radius:var(--radius-full);border:1px solid var(--amber-gold);">
              👑 Mode Game Master Aktif
            </span>
            <button id="dmCatalogAddCharBtn" class="btn btn-primary btn-sm" style="background:var(--amber-gold);border-color:var(--amber-gold);color:#0d111a;font-weight:700;border-radius:var(--radius-full);padding:6px 16px;display:flex;align-items:center;gap:6px;cursor:pointer;">
              <span>➕ Tambah Karakter Baru (DM)</span>
            </button>
          `}
        </div>
      </div>

      <!-- Root Folder Switcher Bar & Live Filter -->
      <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div class="folder-group-tabs" style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-xs folder-tab-btn ${activeGroupFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" data-group="all" style="border-radius:var(--radius-full);padding:6px 14px;font-weight:700;">
            📁 Semua Direktori
          </button>
          <button type="button" class="btn btn-xs folder-tab-btn ${activeGroupFilter === 'housen' ? 'btn-primary' : 'btn-secondary'}" data-group="housen" style="border-radius:var(--radius-full);padding:6px 14px;font-weight:700;border-color:var(--rose-primary);">
            🌸 SMA Housen
          </button>
          <button type="button" class="btn btn-xs folder-tab-btn ${activeGroupFilter === 'touki' ? 'btn-primary' : 'btn-secondary'}" data-group="touki" style="border-radius:var(--radius-full);padding:6px 14px;font-weight:700;border-color:#8b5cf6;">
            👹 SMA Kejuruan Touki
          </button>
          <button type="button" class="btn btn-xs folder-tab-btn ${activeGroupFilter === 'outside_other' ? 'btn-primary' : 'btn-secondary'}" data-group="outside_other" style="border-radius:var(--radius-full);padding:6px 14px;font-weight:700;border-color:var(--amber-gold);">
            🌆 Luar Sekolah &amp; Lainnya
          </button>
        </div>

        <div style="min-width:240px;flex:1;max-width:320px;">
          <input
            type="text"
            id="catalogSubSearchInput"
            placeholder="🔍 Cari nama folder atau sub-kategori..."
            style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.85rem;color:var(--text-main);font-size:0.85rem;outline:none;"
          />
        </div>
      </div>

      <!-- Categories Container -->
      <div id="codexHierarchyContainer" style="display:flex;flex-direction:column;gap:2.5rem;">
        <div style="text-align:center;padding:4rem;color:var(--text-muted);">
          Memuat direktori karakter...
        </div>
      </div>

      ${renderDmCodexBar()}
    </section>
  `;

  // Attach DM Bar & Modal Events
  document.getElementById("openDmLoginBtn")?.addEventListener("click", () => {
    dmAuthModal.open(() => renderCodexCatalogView());
  });
  document.getElementById("dmCatalogAddCharBtn")?.addEventListener("click", () => {
    codexCharacterEditorModal.openForCreate("class_1_1", (slug) => {
      router.navigate(`/codex/c/${slug}`);
    });
  });
  attachDmCodexBarEvents(() => renderCodexCatalogView());

  // Attach group tab switches
  document.querySelectorAll(".folder-tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      activeGroupFilter = target.dataset.group || "all";
      document.querySelectorAll(".folder-tab-btn").forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-secondary");
      });
      target.classList.remove("btn-secondary");
      target.classList.add("btn-primary");
      renderHierarchy(activeGroupFilter, (document.getElementById("catalogSubSearchInput") as HTMLInputElement)?.value || "");
    });
  });

  // Attach search input handler
  document.getElementById("catalogSubSearchInput")?.addEventListener("input", (e) => {
    const val = (e.target as HTMLInputElement).value;
    renderHierarchy(activeGroupFilter, val);
  });

  // Load all characters for count calculations
  try {
    cachedAllCharacters = await fetchCodexList();
  } catch {
    cachedAllCharacters = [];
  }

  renderHierarchy(activeGroupFilter, "");
}

function renderHierarchy(groupFilter: string, searchQuery: string) {
  const container = document.getElementById("codexHierarchyContainer");
  if (!container) return;

  const q = searchQuery.toLowerCase().trim();

  const groupsToDisplay = CODEX_HIERARCHY.filter((g) => {
    if (groupFilter !== "all" && g.id !== groupFilter) return false;
    return true;
  });

  if (groupsToDisplay.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem;color:var(--text-muted);background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);">
        <p>Tidak ada direktori yang sesuai dengan filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = groupsToDisplay.map((group) => {
    const matchingSubs = group.subcategories.filter((sub) => {
      if (!q) return true;
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        (sub.shortLabel && sub.shortLabel.toLowerCase().includes(q))
      );
    });

    if (matchingSubs.length === 0) return "";

    return `
      <div class="codex-root-group-section" style="background:rgba(13,17,26,0.5);border:1px solid ${group.accentBorder};border-radius:var(--radius-lg);padding:1.5rem;box-shadow:var(--shadow-sm);">
        <!-- Group Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--border-subtle);">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:48px;height:48px;border-radius:var(--radius-md);background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:1.6rem;border:1px solid var(--border-subtle);">
              ${group.icon}
            </div>
            <div>
              <h2 style="font-family:var(--font-heading);font-size:1.4rem;color:var(--text-main);margin:0;">
                ${group.name}
              </h2>
              <span style="font-size:0.8rem;color:var(--amber-gold);font-weight:600;">
                ${group.subtitle}
              </span>
            </div>
          </div>
          <p style="color:var(--text-muted);font-size:0.85rem;max-width:550px;margin:0;line-height:1.4;">
            ${group.description}
          </p>
        </div>

        <!-- Subcategories Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1.25rem;">
          ${matchingSubs.map((sub) => {
            const count = cachedAllCharacters.filter((c) => isCharacterInSubcategory(c, sub.id)).length;
            const countBadge = count > 0 ? `${count} Karakter` : "Tersedia";

            return `
              <div class="codex-subcategory-card" data-sub-id="${sub.id}" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all 0.2s ease;box-shadow:var(--shadow-xs);">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span style="font-size:1.3rem;">${sub.icon}</span>
                      <h3 style="font-family:var(--font-heading);margin:0;font-size:1.05rem;color:var(--text-main);">
                        ${sub.name}
                      </h3>
                    </div>
                    <span style="font-size:0.72rem;background:rgba(255,255,255,0.06);color:var(--amber-gold);padding:2px 8px;border-radius:var(--radius-full);border:1px solid rgba(245,158,11,0.25);font-weight:700;">
                      ${countBadge}
                    </span>
                  </div>
                  <p style="color:var(--text-muted);font-size:0.82rem;line-height:1.45;margin:0 0 1rem 0;">
                    ${sub.description}
                  </p>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:0.75rem;margin-top:auto;">
                  <span style="font-size:0.75rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.04em;">
                    ${sub.shortLabel || sub.name}
                  </span>
                  <span style="color:var(--amber-gold);font-weight:700;font-size:0.82rem;display:flex;align-items:center;gap:4px;">
                    Buka Folder →
                  </span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");

  // Attach card click handlers
  container.querySelectorAll(".codex-subcategory-card").forEach((card) => {
    card.addEventListener("click", () => {
      const subId = card.getAttribute("data-sub-id");
      if (subId) {
        router.navigate(`/codex/${subId}`);
      }
    });

    card.addEventListener("mouseenter", () => {
      (card as HTMLElement).style.transform = "translateY(-3px)";
      (card as HTMLElement).style.borderColor = "var(--amber-gold)";
    });
    card.addEventListener("mouseleave", () => {
      (card as HTMLElement).style.transform = "translateY(0)";
      (card as HTMLElement).style.borderColor = "var(--border-card)";
    });
  });
}
