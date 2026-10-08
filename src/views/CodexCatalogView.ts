import { fetchCodexCategories } from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmAuthModal } from "../components/DmAuthModal";
import { renderDmCodexBar, attachDmCodexBarEvents } from "../components/DmCodexBar";
import { codexCharacterEditorModal } from "../components/CodexCharacterEditorModal";
import { router } from "../router/router";
import type { CodexCategory } from "../types";

const CATEGORY_ICONS: Record<string, string> = {
  class_1_1: "🌸",
  class_1_2: "🎒",
  class_2_1: "⚔️",
  class_2_2: "📚",
  class_3_1: "🎓",
  class_3_2: "👔",
  faculty: "🏛️",
  love_interest: "💖",
  clubs: "🏆",
  outside_school: "🌆",
  other: "✨"
};

export async function renderCodexCatalogView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active codex-catalog-view" style="max-width:1200px;margin:2rem auto;padding:0 1.5rem 6rem 1.5rem;">
      <!-- Hero Header -->
      <div class="codex-hero" style="text-align:center;margin-bottom:3rem;position:relative;">
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(225,29,72,0.1);border:1px solid var(--rose-primary);padding:6px 16px;border-radius:var(--radius-full);color:var(--rose-light);font-size:0.85rem;font-weight:600;margin-bottom:1rem;font-family:var(--font-heading);">
          <span>🌸 HOUSEN ACADEMY CHARACTER ARCHIVES</span>
        </div>
        <h1 style="font-family:var(--font-heading);font-size:2.5rem;color:var(--amber-gold);margin:0 0 0.75rem 0;letter-spacing:0.02em;">
          Kamus Karakter & Direktori Sekolah
        </h1>
        <p style="color:var(--text-muted);max-width:700px;margin:0 auto;line-height:1.6;font-size:0.95rem;">
          Jelajahi profil siswi, rekan sekelas, guru, dan faksi klub ekstrakurikuler di Housen Academy. Informasi karakter terkunci secara default dan disingkapkan secara bertahap oleh Game Master seiring berjalannya cerita.
        </p>

        <!-- DM Login Button Bar -->
        <div style="margin-top:1.5rem;display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          ${!dmAuthStore.isAuthenticated() ? `
            <button id="openDmLoginBtn" class="btn btn-secondary btn-sm" style="border:1px solid var(--amber-gold);color:var(--amber-gold);background:rgba(245,158,11,0.08);display:flex;align-items:center;gap:8px;border-radius:var(--radius-full);padding:8px 18px;cursor:pointer;">
              <span>👑 Masuk sebagai Game Master (DM)</span>
            </button>
          ` : `
            <span style="font-size:0.85rem;color:var(--amber-gold);display:flex;align-items:center;gap:6px;background:rgba(245,158,11,0.1);padding:6px 14px;border-radius:var(--radius-full);border:1px solid var(--amber-gold);">
              👑 Mode DM Aktif
            </span>
            <button id="dmCatalogAddCharBtn" class="btn btn-primary btn-sm" style="background:var(--amber-gold);border-color:var(--amber-gold);color:#0d111a;font-weight:700;border-radius:var(--radius-full);padding:6px 16px;display:flex;align-items:center;gap:6px;cursor:pointer;">
              <span>➕ Tambah Karakter Baru</span>
            </button>
          `}
        </div>
      </div>

      <!-- Categories Container -->
      <div id="codexCategoriesGrid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1.5rem;">
        <div style="text-align:center;grid-column:1/-1;padding:3rem;color:var(--text-muted);">
          <div class="skeleton-shimmer" style="height:200px;border-radius:var(--radius-md);"></div>
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

  // Load Categories
  const categories = await fetchCodexCategories();
  renderCategoriesGrid(categories);
}

function renderCategoriesGrid(categories: CodexCategory[]) {
  const container = document.getElementById("codexCategoriesGrid");
  if (!container) return;

  if (categories.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;grid-column:1/-1;padding:3rem;color:var(--text-muted);">
        <p>Belum ada kategori karakter yang terdaftar.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = categories.map((cat) => {
    const icon = CATEGORY_ICONS[cat.id] || "📁";
    const isLoveInterest = cat.id === "love_interest";

    return `
      <div class="codex-category-card" data-cat-id="${cat.id}" style="background:var(--bg-card);border:1px solid ${isLoveInterest ? "rgba(225,29,72,0.4)" : "var(--border-card)"};border-radius:var(--radius-lg);padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden;box-shadow:var(--shadow-sm);">
        ${isLoveInterest ? `
          <div style="position:absolute;top:0;right:0;background:var(--rose-primary);color:#fff;font-size:0.65rem;font-weight:700;padding:4px 10px;border-bottom-left-radius:var(--radius-sm);letter-spacing:0.05em;font-family:var(--font-heading);">
            ROMANCE
          </div>
        ` : ""}
        <div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:0.75rem;">
            <div style="width:44px;height:44px;border-radius:var(--radius-md);background:${isLoveInterest ? "rgba(225,29,72,0.15)" : "rgba(255,255,255,0.05)"};display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:1px solid ${isLoveInterest ? "var(--rose-primary)" : "var(--border-subtle)"};">
              ${icon}
            </div>
            <div>
              <h3 style="font-family:var(--font-heading);margin:0;font-size:1.15rem;color:${isLoveInterest ? "var(--rose-light)" : "var(--text-main)"};">
                ${cat.name}
              </h3>
            </div>
          </div>
          <p style="color:var(--text-muted);font-size:0.85rem;line-height:1.5;margin:0 0 1.25rem 0;">
            ${cat.description || "Daftar murid dan tokoh yang tercatat di kategori ini."}
          </p>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:1rem;margin-top:auto;">
          <span style="font-size:0.8rem;color:var(--text-muted);">
            ${isLoveInterest ? "Heroine & Target Asmara" : "Direktori Kelas"}
          </span>
          <span style="color:${isLoveInterest ? "var(--rose-primary)" : "var(--amber-gold)"};font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:4px;">
            Buka Direktori →
          </span>
        </div>
      </div>
    `;
  }).join("");

  // Attach card click handlers
  container.querySelectorAll(".codex-category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const catId = card.getAttribute("data-cat-id");
      if (catId) {
        router.navigate(`/codex/${catId}`);
      }
    });

    // Hover effect
    card.addEventListener("mouseenter", () => {
      (card as HTMLElement).style.transform = "translateY(-4px)";
      (card as HTMLElement).style.borderColor = "var(--amber-gold)";
    });
    card.addEventListener("mouseleave", () => {
      const isLoveInterest = card.getAttribute("data-cat-id") === "love_interest";
      (card as HTMLElement).style.transform = "translateY(0)";
      (card as HTMLElement).style.borderColor = isLoveInterest ? "rgba(225,29,72,0.4)" : "var(--border-card)";
    });
  });
}
