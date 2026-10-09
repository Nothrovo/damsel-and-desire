import { listMyCharacters, deleteCharacter, importLegacyCharacter } from "../api/characters";
import { supabase } from "../api/supabase";
import { exportCharacterJson, validateCharacterJson } from "../services/exporter";
import { authStore } from "../store/authStore";
import { renderCardSkeleton } from "../components/Skeleton";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import type { Character } from "../types";
import type { RealtimeChannel } from "@supabase/supabase-js";

let cachedCharacters: Character[] = [];
let rosterChannel: RealtimeChannel | null = null;

export async function renderLandingView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active">
      <!-- HERO BANNER -->
      <div class="landing-hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-badge">D&D 5e ALTERNATIVE SYSTEM</div>
          <h1 class="hero-title">DAMSEL & DESIRE</h1>
          <p class="hero-subtitle">Masa muda penuh drama, asmara malu-malu kucing, tanding ekskul sepulang sekolah, dan pencarian cinta sejati di SMA Jepang.</p>
          <div class="hero-actions">
            <a href="/characters/new" class="btn btn-primary btn-large">
              <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
              Buat Karakter Baru
            </a>
            <button class="btn btn-secondary btn-large" id="btnImportJson">
              📥 Import Karakter (JSON)
            </button>
            <input type="file" id="landingImportFile" style="display:none;" accept=".json">
            <a href="/compendium" class="btn btn-secondary btn-large">
              📖 Buka Compendium
            </a>
          </div>
        </div>
      </div>

      <!-- ROSTER SECTION -->
      <div class="roster-section" style="max-width:1200px;margin:2rem auto;padding:0 1.5rem;">
        <div class="roster-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div class="roster-title-group" style="display:flex;align-items:center;gap:12px;">
            <h2 style="font-family:var(--font-heading);margin:0;">Roster Karakter Sekolah</h2>
            <span id="rosterCountBadge" class="roster-count" style="background:var(--bg-card);border:1px solid var(--border-subtle);padding:3px 10px;border-radius:12px;font-size:0.8rem;color:var(--text-muted);">Memuat...</span>
          </div>
          <div class="roster-filters" style="display:flex;gap:10px;">
            <input type="text" id="searchRosterInput" class="input-text" placeholder="Cari nama atau ekskul..." style="min-width:240px;">
          </div>
        </div>

        <div id="rosterGrid" class="roster-grid">
          ${renderCardSkeleton(3)}
        </div>

        <!-- Empty State -->
        <div id="rosterEmptyState" class="empty-state" style="display:none;text-align:center;padding:3rem 1rem;">
          <div class="empty-illustration" style="font-size:3rem;margin-bottom:1rem;">🌸</div>
          <h3 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Belum Ada Karakter</h3>
          <p style="color:var(--text-muted);max-width:450px;margin:0 auto 1.5rem auto;">Mulai perjalanan kisah asmara dan persahabatan SMA-mu dengan membuat karakter pertamamu sekarang!</p>
          <a href="/characters/new" class="btn btn-primary">+ Buat Karakter Sekarang</a>
        </div>
      </div>
    </section>
  `;

  attachLandingEvents();
  subscribeRosterRealtime();
  await loadCharacters();
}

function subscribeRosterRealtime() {
  if (rosterChannel) {
    try {
      supabase.removeChannel(rosterChannel);
    } catch {
      // ignore
    }
    rosterChannel = null;
  }

  try {
    rosterChannel = supabase
      .channel("public_roster_characters_sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "characters"
        },
        () => {
          if (document.getElementById("rosterGrid")) {
            loadCharacters();
          }
        }
      )
      .subscribe();
  } catch (e) {
    console.warn("Realtime roster subscription warning:", e);
  }
}

function attachLandingEvents() {
  const fileInput = document.getElementById("landingImportFile") as HTMLInputElement;
  document.getElementById("btnImportJson")?.addEventListener("click", () => fileInput?.click());

  fileInput?.addEventListener("change", async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        const validated = validateCharacterJson(parsed);
        if (!validated.valid) {
          showToast(validated.error || "Format berkas JSON tidak valid.", "error");
          return;
        }

        const newId = await importLegacyCharacter(validated.data);
        showToast(`Karakter "${validated.data.name}" berhasil diimpor ke Roster!`, "success");
        router.navigate(`/characters/${newId}`);
      } catch (err: any) {
        showToast(`Gagal mengimpor file: ${err.message}`, "error");
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  });

  document.getElementById("searchRosterInput")?.addEventListener("input", (e: any) => {
    const query = e.target.value.toLowerCase().trim();
    renderFilteredCards(query);
  });
}

async function loadCharacters() {
  const gridEl = document.getElementById("rosterGrid");
  const countBadge = document.getElementById("rosterCountBadge");
  const emptyEl = document.getElementById("rosterEmptyState");
  const searchInput = document.getElementById("searchRosterInput") as HTMLInputElement | null;

  try {
    cachedCharacters = await listMyCharacters();

    if (countBadge) countBadge.textContent = `${cachedCharacters.length} Karakter`;

    if (cachedCharacters.length === 0) {
      if (gridEl) gridEl.innerHTML = "";
      if (emptyEl) emptyEl.style.display = "block";
    } else {
      if (emptyEl) emptyEl.style.display = "none";
      const currentQuery = searchInput?.value?.toLowerCase().trim() || "";
      renderFilteredCards(currentQuery);
    }
  } catch (err: any) {
    console.error("Gagal memuat karakter:", err);
    if (gridEl) {
      gridEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--rose-light);">Gagal memuat karakter: ${err.message}.</div>`;
    }
  }
}

function renderFilteredCards(query: string) {
  const gridEl = document.getElementById("rosterGrid");
  if (!gridEl) return;

  const filtered = cachedCharacters.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(query);
    const clubMatch = (c.ekskul_id || "").toLowerCase().includes(query);
    return nameMatch || clubMatch;
  });

  if (filtered.length === 0 && query !== "") {
    gridEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);">Tidak ada karakter yang cocok dengan "${query}".</div>`;
    return;
  }

  gridEl.innerHTML = filtered.map((c) => {
    const avatar = c.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.name}`;
    const hpCur = c.vitals?.physicalHpCurrent ?? 10;
    const hpMax = c.vitals?.physicalHpMax ?? 10;
    const hpPercent = Math.min(100, Math.max(0, (hpCur / hpMax) * 100));

    return `
      <div class="roster-card" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);overflow:hidden;transition:all var(--transition-fast);">
        <div style="padding:1.25rem;">
          <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
            <img src="${avatar}" alt="${c.name}" style="width:52px;height:52px;border-radius:50%;border:2px solid var(--rose-primary);object-fit:cover;background:var(--bg-surface);">
            <div style="flex:1;overflow:hidden;">
              <h3 style="margin:0;font-size:1.1rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</h3>
              <span style="font-size:0.8rem;color:var(--amber-gold);font-weight:600;">Kelas ${10 + (c.level - 1)} (Lvl ${c.level})</span>
            </div>
          </div>

          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;">
            Ekskul: <strong>${c.ekskul_id.toUpperCase()}</strong> • Latar: <strong>${c.social_class_id}</strong>
          </div>

          <!-- HP Bar -->
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:3px;">
              <span>Physical HP</span>
              <span>${hpCur} / ${hpMax}</span>
            </div>
            <div style="height:6px;background:var(--bg-input);border-radius:3px;overflow:hidden;">
              <div style="width:${hpPercent}%;height:100%;background:var(--green-health);"></div>
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;padding-top:8px;border-top:1px solid var(--border-subtle);">
            <a href="/characters/${c.id}" class="btn btn-sm btn-primary" style="flex:1;text-align:center;">Buka Sheet</a>
            <button class="btn btn-sm btn-secondary btn-export-char" data-id="${c.id}" title="Ekspor JSON">📥</button>
            <button class="btn btn-sm btn-secondary btn-delete-char" data-id="${c.id}" data-name="${c.name}" style="color:var(--rose-light);" title="Hapus Karakter">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach card button handlers
  document.querySelectorAll(".btn-export-char").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const char = cachedCharacters.find(c => c.id === id);
      if (char) exportCharacterJson(char);
    });
  });

  document.querySelectorAll(".btn-delete-char").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id;
      const name = (e.currentTarget as HTMLElement).dataset.name;
      if (!id) return;
      if (confirm(`Yakin ingin menghapus karakter "${name}" secara permanen?`)) {
        try {
          await deleteCharacter(id);
          showToast(`Karakter "${name}" berhasil dihapus.`, "info");
          await loadCharacters();
        } catch (err: any) {
          showToast(`Gagal menghapus karakter: ${err.message}`, "error");
        }
      }
    });
  });
}
