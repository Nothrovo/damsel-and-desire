import {
  getCompendiumEkskul,
  getCompendiumArchetypes,
  getCompendiumSocialClasses,
  getCompendiumBasicActions
} from "../api/compendium";

export async function renderCompendiumView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active" style="max-width:1150px;margin:2rem auto;padding:0 1.5rem;">
      <div style="margin-bottom:2rem;">
        <h1 style="font-family:var(--font-heading);margin-bottom:0.35rem;">📚 Compendium Ensiklopedia TRPG</h1>
        <p style="color:var(--text-muted);font-size:0.9rem;">
          Panduan resmi sistem Damsel & Desire: 12 Klub Ekskul, 8 Archetype, 36 Club Moves, dan Aksi Sekolah.
        </p>
        <input type="text" id="compendiumSearchInput" class="input-text" placeholder="Cari nama klub, move, atau aksi..." style="max-width:380px;margin-top:1rem;">
      </div>

      <div style="display:flex;gap:8px;border-bottom:1px solid var(--border-card);margin-bottom:1.5rem;overflow-x:auto;">
        <button class="sheet-tab-btn active" data-comp-tab="ekskul">12 Ekskul (Classes)</button>
        <button class="sheet-tab-btn" data-comp-tab="archetypes">8 Archetypes (Species)</button>
        <button class="sheet-tab-btn" data-comp-tab="actions">Aksi Dasar Sekolah</button>
        <button class="sheet-tab-btn" data-comp-tab="social">Latar Sosial</button>
      </div>

      <div id="compendiumContentPanel">
        <div style="text-align:center;padding:2rem;color:var(--text-muted);">Memuat compendium...</div>
      </div>
    </section>
  `;

  const ekskul = await getCompendiumEkskul();
  const archetypes = await getCompendiumArchetypes();
  const actions = await getCompendiumBasicActions();
  const social = await getCompendiumSocialClasses();

  let activeTab = "ekskul";

  function renderTab() {
    const panel = document.getElementById("compendiumContentPanel");
    if (!panel) return;
    const query = ((document.getElementById("compendiumSearchInput") as HTMLInputElement)?.value || "").toLowerCase().trim();

    if (activeTab === "ekskul") {
      const filtered = ekskul.filter(e => e.name.toLowerCase().includes(query) || (e.tagline || '').toLowerCase().includes(query));
      panel.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.25rem;">
          ${filtered.map(e => `
            <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
              <h3 style="margin:0 0 4px 0;font-size:1.15rem;color:var(--text-main);">${e.name}</h3>
              <div style="font-size:0.8rem;color:var(--amber-gold);margin-bottom:8px;">${e.tagline || ''}</div>
              <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:8px;">Hit Die: <strong>${e.hit_die}</strong> • Atribut: <strong>${e.primary_stat}</strong></div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px;">${e.perk_description || ''}</p>
              
              <div style="border-top:1px solid var(--border-subtle);padding-top:10px;">
                <strong style="font-size:0.8rem;color:var(--rose-light);">Club Moves:</strong>
                <ul style="font-size:0.75rem;color:var(--text-dim);padding-left:1.2rem;margin:6px 0 0 0;line-height:1.6;">
                  ${(e.club_moves || []).map(m => `
                    <li><strong>${m.name}</strong> (${m.move_type}) - ${m.effect}</li>
                  `).join("")}
                </ul>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else if (activeTab === "archetypes") {
      const filtered = archetypes.filter(a => a.name.toLowerCase().includes(query) || (a.tagline || '').toLowerCase().includes(query));
      panel.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.25rem;">
          ${filtered.map(a => `
            <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
              <h3 style="margin:0 0 4px 0;font-size:1.15rem;">${a.name}</h3>
              <div style="font-size:0.8rem;color:var(--amber-gold);margin-bottom:8px;">${a.tagline || ''}</div>
              <div style="font-size:0.8rem;color:var(--rose-light);margin-bottom:8px;">
                Bonus: ${Object.entries(a.stat_bonus).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(", ")}
              </div>
              <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px;">${a.perk_description || ''}</p>

              <div style="border-top:1px solid var(--border-subtle);padding-top:10px;">
                <strong style="font-size:0.8rem;color:var(--rose-light);">Archetype Moves:</strong>
                <ul style="font-size:0.75rem;color:var(--text-dim);padding-left:1.2rem;margin:6px 0 0 0;line-height:1.6;">
                  ${(a.archetype_moves || []).map(m => `
                    <li><strong>${m.name}</strong> (${m.cost}) - ${m.effect}</li>
                  `).join("")}
                </ul>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else if (activeTab === "actions") {
      panel.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1.25rem;">
          ${actions.map(act => `
            <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
              <h4 style="margin:0 0 4px 0;font-size:1rem;color:var(--text-main);">${act.name}</h4>
              <div style="font-size:0.75rem;color:var(--amber-gold);margin-bottom:6px;">Biaya: ${act.cost} • Check: ${act.check_type}</div>
              <div style="font-size:0.8rem;color:var(--rose-light);margin-bottom:8px;">Efek: ${act.effect}</div>
              <p style="font-size:0.75rem;color:var(--text-muted);margin:0;">${act.description}</p>
            </div>
          `).join("")}
        </div>
      `;
    } else if (activeTab === "social") {
      panel.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1.25rem;">
          ${social.map(s => `
            <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
              <h4 style="margin:0 0 4px 0;font-size:1rem;">${s.name}</h4>
              <div style="font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;">Uang Jajan: ${s.daily_allowance}</div>
              <div style="font-size:0.8rem;color:var(--green-health);margin-bottom:8px;">Tabungan Awal: ${s.initial_savings}</div>
              <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;">${s.description || ''}</p>
              <div style="font-size:0.75rem;color:var(--text-dim);">
                Starter Items: ${s.starter_items.join(", ")}
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
