import {
  getCompendiumEkskul,
  getCompendiumArchetypes,
  getCompendiumSocialClasses,
  getCompendiumBasicActions
} from "../api/compendium";
import { slideOverDrawer } from "../components/SlideOverDrawer";

export async function renderCompendiumView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active compendium-view-wrapper" style="max-width:1300px;margin:2rem auto;padding:0 1.5rem 5rem 1.5rem;">
      <!-- Hero Header -->
      <div class="compendium-hero-header">
        <div class="comp-badge-tag">
          <span>📚 HOUSEN ACADEMY OFFICIAL CODEX</span>
        </div>
        <h1 class="comp-main-title">COMPENDIUM &amp; ENSIKLOPEDIA ATURAN</h1>
        <p class="comp-main-subtitle">
          Pusat referensi aturan, kelas klub ekstrakurikuler, arketipe kepribadian siswa, latar belakang sosial, dan katalog jurus SMA Housen.
        </p>

        <!-- Search Bar -->
        <div class="comp-search-bar-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" class="comp-search-icon"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input type="text" id="compendiumSearchInput" class="input-search-comp" placeholder="Cari nama klub, arketipe, jurus, atau aksi sekolah...">
        </div>
      </div>

      <!-- Segmented Nav Tabs -->
      <div class="comp-tabs-nav-bar">
        <button class="comp-tab-pill active" data-comp-tab="ekskul" type="button">
          <span>🥋 16 Klub Ekskul (Classes)</span>
        </button>
        <button class="comp-tab-pill" data-comp-tab="archetypes" type="button">
          <span>🎭 8 Arketipe (Species)</span>
        </button>
        <button class="comp-tab-pill" data-comp-tab="actions" type="button">
          <span>⚡ Aksi Dasar Sekolah</span>
        </button>
        <button class="comp-tab-pill" data-comp-tab="social" type="button">
          <span>💎 Latar Belakang Sosial</span>
        </button>
      </div>

      <!-- Main Content Output -->
      <div id="compendiumContentPanel">
        <div style="text-align:center;padding:3rem;color:var(--text-muted);">Memuat ensiklopedia...</div>
      </div>
    </section>
  `;

  const [ekskul, archetypes, actions, social] = await Promise.all([
    getCompendiumEkskul(),
    getCompendiumArchetypes(),
    getCompendiumBasicActions(),
    getCompendiumSocialClasses()
  ]);

  let activeTab = "ekskul";

  function renderTab() {
    const panel = document.getElementById("compendiumContentPanel");
    if (!panel) return;
    const query = ((document.getElementById("compendiumSearchInput") as HTMLInputElement)?.value || "").toLowerCase().trim();

    if (activeTab === "ekskul") {
      const filtered = ekskul.filter(e => 
        e.name.toLowerCase().includes(query) || 
        (e.tagline || '').toLowerCase().includes(query) ||
        (e.club_moves || []).some(m => m.name.toLowerCase().includes(query))
      );

      if (filtered.length === 0) {
        panel.innerHTML = `<div class="empty-state"><p class="empty-desc">Tidak ada klub ekskul yang cocok dengan "${query}".</p></div>`;
        return;
      }

      panel.innerHTML = `
        <div class="comp-cards-grid">
          ${filtered.map(e => `
            <div class="comp-item-card">
              <div class="comp-item-header">
                <div class="comp-title-group">
                  <h3 class="comp-item-name">${e.name}</h3>
                  <span class="comp-item-tagline">${e.tagline || 'Klub Resmi Housen Gakuen'}</span>
                </div>
                <div class="comp-item-badges">
                  <span class="comp-badge badge-hitdie">Hit Die: ${e.hit_die}</span>
                  <span class="comp-badge badge-stat">Atribut: ${e.primary_stat}</span>
                </div>
              </div>

              <p class="comp-item-desc">${e.perk_description || ''}</p>

              <div class="comp-moves-block">
                <div class="comp-moves-header">
                  <span class="comp-moves-title">JURUS &amp; CLUB MOVES:</span>
                  <span class="comp-moves-count">${(e.club_moves || []).length} Moves</span>
                </div>
                <div class="comp-moves-list">
                  ${(e.club_moves || []).map(m => `
                    <div class="comp-mini-move-card" data-move-name="${m.name}" title="Klik untuk membaca detail mekanik jurus">
                      <div class="mini-move-top">
                        <strong class="mini-move-name">${m.name}</strong>
                        <span class="mini-move-type">${m.move_type}</span>
                      </div>
                      <span class="mini-move-effect">${m.effect}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      `;

      // Attach Drawer Inspector on Moves Click
      panel.querySelectorAll(".comp-mini-move-card").forEach((card: any) => {
        card.addEventListener("click", () => {
          const moveName = card.dataset.moveName;
          const foundMove = ekskul.flatMap(ek => ek.club_moves || []).find(m => m.name === moveName);
          if (foundMove) {
            slideOverDrawer.open({
              title: foundMove.name,
              category: "CLUB MOVE",
              categoryType: "club",
              badge: foundMove.move_type,
              stats: [
                { label: "Tipe Aksi", value: foundMove.move_type },
                { label: "Batas Pakai", value: (foundMove as any).usage_limit || "Aktivasi Normal" },
                { label: "Efek Mekanik", value: foundMove.effect }
              ],
              flavor: `Jurus dan teknik khas klub ekstrakurikuler Housen Academy.`,
              mechanics: foundMove.description || foundMove.effect
            });
          }
        });
      });

    } else if (activeTab === "archetypes") {
      const filtered = archetypes.filter(a => 
        a.name.toLowerCase().includes(query) || 
        (a.tagline || '').toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        panel.innerHTML = `<div class="empty-state"><p class="empty-desc">Tidak ada arketipe yang cocok dengan "${query}".</p></div>`;
        return;
      }

      panel.innerHTML = `
        <div class="comp-cards-grid">
          ${filtered.map(a => {
            const bonuses = Object.entries(a.stat_bonus || {}).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(", ");
            return `
              <div class="comp-item-card">
                <div class="comp-item-header">
                  <div class="comp-title-group">
                    <h3 class="comp-item-name">${a.name}</h3>
                    <span class="comp-item-tagline">${a.tagline || ''}</span>
                  </div>
                  <div class="comp-item-badges">
                    <span class="comp-badge badge-bonus">Bonus Stat: ${bonuses}</span>
                  </div>
                </div>

                <p class="comp-item-desc">${a.perk_description || ''}</p>

                <div class="comp-moves-block">
                  <div class="comp-moves-header">
                    <span class="comp-moves-title">ARCHETYPE MOVES:</span>
                    <span class="comp-moves-count">${(a.archetype_moves || []).length} Moves</span>
                  </div>
                  <div class="comp-moves-list">
                    ${(a.archetype_moves || []).map(m => `
                      <div class="comp-mini-move-card" data-arch-move="${m.name}" title="Klik untuk melihat detail jurus">
                        <div class="mini-move-top">
                          <strong class="mini-move-name">${m.name}</strong>
                          <span class="mini-move-type">${m.cost || 'Passive'}</span>
                        </div>
                        <span class="mini-move-effect">${m.effect}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;

      panel.querySelectorAll(".comp-mini-move-card").forEach((card: any) => {
        card.addEventListener("click", () => {
          const moveName = card.dataset.archMove;
          const foundMove = archetypes.flatMap(ar => ar.archetype_moves || []).find(m => m.name === moveName);
          if (foundMove) {
            slideOverDrawer.open({
              title: foundMove.name,
              category: "ARCHETYPE MOVE",
              categoryType: "feat",
              badge: foundMove.cost || "Action",
              stats: [
                { label: "Biaya / Cost", value: foundMove.cost || "Free" },
                { label: "Efek Mekanik", value: foundMove.effect }
              ],
              flavor: `Bakat alami dan kebiasaan kepribadian arketipe siswa.`,
              mechanics: foundMove.description || foundMove.effect
            });
          }
        });
      });

    } else if (activeTab === "actions") {
      const filtered = actions.filter(act => 
        act.name.toLowerCase().includes(query) || 
        act.description.toLowerCase().includes(query)
      );

      panel.innerHTML = `
        <div class="comp-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));">
          ${filtered.map(act => `
            <div class="comp-item-card action-card-item">
              <div class="comp-item-header">
                <div class="comp-title-group">
                  <h3 class="comp-item-name" style="font-size:1.1rem;">${act.name}</h3>
                  <span class="comp-item-tagline">Aksi Baku SMA • Biaya: ${act.cost}</span>
                </div>
                <div class="comp-item-badges">
                  <span class="comp-badge badge-check">Check: ${act.check_type}</span>
                </div>
              </div>

              <div class="action-effect-box">
                <strong>Efek:</strong> ${act.effect}
              </div>

              <p class="comp-item-desc" style="margin-top:10px;">${act.description}</p>
            </div>
          `).join("")}
        </div>
      `;
    } else if (activeTab === "social") {
      const filtered = social.filter(s => 
        s.name.toLowerCase().includes(query) || 
        (s.description || '').toLowerCase().includes(query)
      );

      panel.innerHTML = `
        <div class="comp-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
          ${filtered.map(s => `
            <div class="comp-item-card">
              <div class="comp-item-header">
                <div class="comp-title-group">
                  <h3 class="comp-item-name" style="font-size:1.15rem;">${s.name}</h3>
                  <span class="comp-item-tagline">Status Sosial &amp; Ekonomi</span>
                </div>
              </div>

              <div class="social-fin-strip">
                <div class="social-fin-box">
                  <span class="fin-lbl">UANG SAKU HARIAN</span>
                  <strong class="fin-val">${s.daily_allowance}</strong>
                </div>
                <div class="social-fin-box">
                  <span class="fin-lbl">TABUNGAN AWAL</span>
                  <strong class="fin-val text-green">${s.initial_savings}</strong>
                </div>
              </div>

              <p class="comp-item-desc" style="margin:12px 0;">${s.description || ''}</p>

              <div class="social-starter-items">
                <strong>Barang Bawaan Awal:</strong>
                <p style="margin:4px 0 0 0;font-size:0.85rem;color:var(--text-dim);">${(s.starter_items || []).join(", ")}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  document.querySelectorAll("[data-comp-tab]").forEach((btn: any) => {
    btn.addEventListener("click", (e: any) => {
      document.querySelectorAll("[data-comp-tab]").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      activeTab = e.currentTarget.dataset.compTab;
      renderTab();
    });
  });

  document.getElementById("compendiumSearchInput")?.addEventListener("input", () => renderTab());

  renderTab();
}
