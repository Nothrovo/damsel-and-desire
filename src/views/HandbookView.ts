import { HANDBOOK_CHAPTERS, compileFullHandbookHtml, searchHandbook } from "../data/handbook";

export async function renderHandbookView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <div class="handbook-view-wrapper">
      <!-- SIDEBAR DAFTAR ISI & PENCARIAN -->
      <aside class="handbook-sidebar">
        <div class="handbook-sidebar-header">
          <div class="handbook-sidebar-title">
            <span>📖</span>
            <span>PLAYER'S HANDBOOK</span>
          </div>
          <input
            type="text"
            id="handbookSearchInput"
            class="handbook-search-input"
            placeholder="Cari mekanik, aturan, jurus..."
          />
        </div>

        <nav class="handbook-toc-nav" style="padding: 0.5rem 0;">
          <ul class="handbook-toc-list" id="handbookTocList">
            ${HANDBOOK_CHAPTERS.map(
              (ch) => `
              <li class="handbook-toc-item" data-chapter-id="${ch.id}">
                <a class="handbook-toc-link" href="#${ch.id}">
                  <span class="handbook-toc-num">${ch.number === 0 ? "Cover & Intro" : `Chapter ${ch.number}`}</span>
                  <span class="handbook-toc-name">${ch.title}</span>
                </a>
              </li>`
            ).join("")}
          </ul>
          <div id="handbookSearchResults" style="display: none; padding: 0.75rem 1rem;"></div>
        </nav>
      </aside>

      <!-- KONTEN BUKU (PHB DOCUMENT) -->
      <main class="handbook-content-area">
        <div class="handbook-toolbar">
          <div class="handbook-toolbar-title">
            <strong>Damsel & Desire</strong> — Official Rulebook & Player's Handbook (v2.0)
          </div>
          <div class="handbook-actions-group">
            <button id="toggleColumnsBtn" class="btn btn-secondary btn-sm" title="Ubah tampilan 1 kolom atau 2 kolom">
              <span id="columnsBtnIcon">⚏</span> 2-Kolom
            </button>
            <button id="printHandbookBtn" class="btn btn-primary btn-sm" style="display: flex; align-items: center; gap: 6px;">
              <span>🖨️</span>
              <span>Cetak / Unduh PDF (A4)</span>
            </button>
          </div>
        </div>

        <div id="handbookDocumentContainer" style="width: 100%; display: flex; justify-content: center;">
          ${compileFullHandbookHtml()}
        </div>
      </main>
    </div>
  `;

  attachHandbookEvents();
}

function attachHandbookEvents(): void {
  // 1. Tombol Cetak / PDF Export
  const printBtn = document.getElementById("printHandbookBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // 2. Toggle Layout 1 Kolom / 2 Kolom
  const toggleColsBtn = document.getElementById("toggleColumnsBtn");
  let isTwoColumns = true;
  if (toggleColsBtn) {
    toggleColsBtn.addEventListener("click", () => {
      isTwoColumns = !isTwoColumns;
      const doc = document.querySelector(".phb-document");
      const contents = document.querySelectorAll(".phb-chapter-content");
      contents.forEach((el) => {
        (el as HTMLElement).style.columns = isTwoColumns ? "2" : "1";
      });
      toggleColsBtn.innerHTML = isTwoColumns
        ? `<span>⚏</span> 2-Kolom`
        : `<span>☰</span> 1-Kolom`;
    });
  }

  // 3. Navigasi Scroll Halus & Active TOC Link
  const tocLinks = document.querySelectorAll(".handbook-toc-link");
  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = (link.getAttribute("href") || "").replace("#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update active class
        document.querySelectorAll(".handbook-toc-item").forEach((item) => {
          item.classList.remove("active");
        });
        link.closest(".handbook-toc-item")?.classList.add("active");
      }
    });
  });

  // 4. Pencarian Interaktif Real-Time
  const searchInput = document.getElementById("handbookSearchInput") as HTMLInputElement | null;
  const tocList = document.getElementById("handbookTocList");
  const searchResultsBox = document.getElementById("handbookSearchResults");

  if (searchInput && tocList && searchResultsBox) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim();
      if (!q) {
        tocList.style.display = "flex";
        searchResultsBox.style.display = "none";
        searchResultsBox.innerHTML = "";
        return;
      }

      const matches = searchHandbook(q);
      tocList.style.display = "none";
      searchResultsBox.style.display = "block";

      if (matches.length === 0) {
        searchResultsBox.innerHTML = `
          <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">
            Tidak ditemukan bab yang cocok dengan "<em>${escapeHtml(q)}</em>".
          </div>
        `;
        return;
      }

      searchResultsBox.innerHTML = `
        <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--amber-gold); font-weight: 700; margin-bottom: 0.5rem;">
          Ditemukan di ${matches.length} Bab:
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${matches
            .map(
              (m) => `
            <a href="#${m.chapter.id}" class="handbook-search-hit" style="display: block; padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 4px; text-decoration: none; color: inherit;">
              <div style="font-size: 0.82rem; font-weight: bold; color: var(--rose-light);">
                ${m.chapter.number === 0 ? "Intro" : `Bab ${m.chapter.number}`}: ${escapeHtml(m.chapter.title)}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.35; margin-top: 3px;">
                ${escapeHtml(m.matchSnippet)}
              </div>
            </a>`
            )
            .join("")}
        </div>
      `;

      // Attach clicks to search hits
      searchResultsBox.querySelectorAll(".handbook-search-hit").forEach((hit) => {
        hit.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = (hit.getAttribute("href") || "").replace("#", "");
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    });
  }

  // 5. ScrollSpy sederhana untuk menandai bab aktif saat scrolling
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll(".handbook-toc-item").forEach((item) => {
            if (item.getAttribute("data-chapter-id") === id) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  document.querySelectorAll("article.phb-chapter").forEach((el) => {
    observer.observe(el);
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
