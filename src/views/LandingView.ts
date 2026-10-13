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

const EKSKUL_DICTIONARY: Record<string, { name: string; icon: string }> = {
  band: { name: "Band Musik", icon: "🎸" },
  cooking: { name: "Klub Memasak", icon: "🍳" },
  drama: { name: "Klub Drama", icon: "🎭" },
  gardening: { name: "Klub Berkebun", icon: "🌱" },
  kendo: { name: "Klub Kendo", icon: "⚔️" },
  kir_osn: { name: "KIR / Sains", icon: "🔬" },
  literature: { name: "Klub Sastra", icon: "📖" },
  martial_arts: { name: "Beladiri", icon: "🥋" },
  occult: { name: "Klub Okultisme", icon: "🔮" },
  penyiaran: { name: "Penyiaran", icon: "🎙️" },
  photography: { name: "Fotografi", icon: "📷" },
  pmr: { name: "PMR / Medis", icon: "🩹" },
  robotics: { name: "Robotik & Tekno", icon: "🤖" },
  seni_lukis: { name: "Seni Rupa & Manga", icon: "🎨" },
  sports: { name: "Klub Olahraga", icon: "⚽" },
  student_council: { name: "OSIS & Disiplin", icon: "🏛️" }
};

const SOCIAL_DICTIONARY: Record<string, { name: string; icon: string }> = {
  rich: { name: "Konglomerat / Ningrat", icon: "💎" },
  medium: { name: "Menengah / Rata-rata", icon: "🏠" },
  medium_poor: { name: "Menengah Bawah", icon: "🛵" },
  poor: { name: "Pekerja Keras", icon: "📦" },
  orphanage: { name: "Anak Panti / Mandiri", icon: "🕊️" }
};

function formatEkskulBadge(id: string): { name: string; icon: string } {
  const key = (id || "").toLowerCase();
  if (EKSKUL_DICTIONARY[key]) return EKSKUL_DICTIONARY[key];
  const name = id ? id.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Ekskul";
  return { name, icon: "🎯" };
}

function formatSocialBadge(id: string): { name: string; icon: string } {
  const key = (id || "").toLowerCase();
  if (SOCIAL_DICTIONARY[key]) return SOCIAL_DICTIONARY[key];
  const name = id ? id.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Latar Sosial";
  return { name, icon: "🏷️" };
}

export async function renderLandingView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active landing-view-wrapper">
      <!-- HERO BANNER -->
      <div class="landing-hero">
        <div class="hero-overlay"></div>
        <div class="hero-layout-grid">
          
          <!-- LEFT: Title, Copy & Primary Funnels -->
          <div class="hero-content">
            <div class="hero-badge-pill">
              <span class="badge-dot"></span>
              <span>D&D 5E ALTERNATIVE CHASSIS • HOUSEN ACADEMY</span>
            </div>
            
            <h1 class="hero-title">DAMSEL &amp; DESIRE</h1>
            
            <p class="hero-subtitle">
              Masa muda penuh drama asmara, rivalitas ekskul sepulang sekolah, dan pencarian cinta sejati di SMA Jepang dengan sistem mekanik D&D 5e dual-vitals (HP Fisik &amp; Composure Sosial).
            </p>

            <div class="hero-primary-actions">
              <a href="/characters/new" class="btn btn-primary btn-hero-cta">
                <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                </svg>
                <span>Buat Karakter Baru</span>
              </a>

              <a href="/compendium" class="btn btn-secondary btn-hero-sec">
                <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
                <span>Buka Compendium</span>
              </a>
            </div>

            <!-- Subtle Utility Row -->
            <div class="hero-sub-actions">
              <button class="hero-sub-link" id="btnImportJson" type="button">
                <svg viewBox="0 0 20 20" fill="currentColor" class="sub-icon"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                <span>Import Karakter (.json)</span>
              </button>
              <input type="file" id="landingImportFile" style="display:none;" accept=".json">

              <span class="sub-divider">•</span>

              <a href="/calendar" class="hero-sub-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sub-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>Kalender Akademik 12 Bulan</span>
              </a>

              <span class="sub-divider">•</span>

              <a href="/map" class="hero-sub-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sub-icon"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                <span>Denah Sekolah Housen</span>
              </a>
            </div>
          </div>

          <!-- RIGHT: Housen Gakuen Showcase Card -->
          <div class="hero-showcase-panel">
            <div class="showcase-card">
              <div class="showcase-header">
                <div class="showcase-crest">鳳仙</div>
                <div class="showcase-info">
                  <span class="showcase-school">鳳仙学園 高等部</span>
                  <span class="showcase-title">CHARACTER VAULT &amp; CODEX</span>
                </div>
                <span class="showcase-stamp">学園公認</span>
              </div>

              <div class="showcase-stats-grid">
                <div class="showcase-stat-item">
                  <span class="showcase-stat-num">16</span>
                  <span class="showcase-stat-lbl">Klub Ekskul</span>
                </div>
                <div class="showcase-stat-item">
                  <span class="showcase-stat-num">8</span>
                  <span class="showcase-stat-lbl">Arketipe Siswa</span>
                </div>
                <div class="showcase-stat-item">
                  <span class="showcase-stat-num">48+</span>
                  <span class="showcase-stat-lbl">Jurus &amp; Moves</span>
                </div>
                <div class="showcase-stat-item">
                  <span class="showcase-stat-num">12</span>
                  <span class="showcase-stat-lbl">Bulan Arc Cerita</span>
                </div>
              </div>

              <div class="showcase-features">
                <div class="showcase-feature-row">
                  <span class="feat-bullet">⚔️</span>
                  <span><strong>Dual Vitals:</strong> Physical HP &amp; Composure Sosial</span>
                </div>
                <div class="showcase-feature-row">
                  <span class="feat-bullet">💌</span>
                  <span><strong>Affection Secret Tracker:</strong> Khusus Game Master</span>
                </div>
                <div class="showcase-feature-row">
                  <span class="feat-bullet">🏫</span>
                  <span><strong>Peta Interaktif:</strong> Kampus 4 Lantai &amp; Rooftop</span>
                </div>
              </div>

              <div class="showcase-footer">
                <span class="showcase-version">Sistem Aturan v2.0 • D&D 5e Alternative</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ROSTER SECTION -->
      <div class="roster-section">
        <div class="roster-header">
          <div class="roster-title-group">
            <div class="roster-icon-wrapper">
              <svg viewBox="0 0 20 20" fill="currentColor" style="width:20px;height:20px;">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <div>
              <h2 class="roster-heading">Roster Siswa SMA Housen</h2>
              <span class="roster-subheading">Karakter murid aktif yang terdaftar di database sekolah</span>
            </div>
            <span id="rosterCountBadge" class="roster-count-badge">Memuat...</span>
          </div>

          <div class="roster-search-wrapper">
            <svg viewBox="0 0 20 20" fill="currentColor" class="search-icon"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
            <input type="text" id="searchRosterInput" class="input-search-roster" placeholder="Cari nama siswa, ekskul, atau klub...">
          </div>
        </div>

        <div id="rosterGrid" class="roster-grid">
          ${renderCardSkeleton(3)}
        </div>

        <!-- Empty State -->
        <div id="rosterEmptyState" class="empty-state" style="display:none;">
          <div class="empty-illustration">🌸</div>
          <h3 class="empty-title">Belum Ada Siswa Terdaftar</h3>
          <p class="empty-desc">Mulai kisah asmara, persahabatan, dan pertarungan ekskul pertamamu dengan membuat karakter siswa baru sekarang!</p>
          <a href="/characters/new" class="btn btn-primary">+ Buat Karakter Baru</a>
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

    if (countBadge) countBadge.textContent = `${cachedCharacters.length} Siswa`;

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
    const socialMatch = (c.social_class_id || "").toLowerCase().includes(query);
    return nameMatch || clubMatch || socialMatch;
  });

  if (filtered.length === 0 && query !== "") {
    gridEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:var(--text-muted);background:var(--bg-card);border:1px dashed var(--border-card);border-radius:var(--radius-md);">Tidak ada siswa yang cocok dengan pencarian "${query}".</div>`;
    return;
  }

  gridEl.innerHTML = filtered.map((c) => {
    const avatar = c.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name)}`;
    const hpCur = c.vitals?.physicalHpCurrent ?? 10;
    const hpMax = c.vitals?.physicalHpMax ?? 10;
    const hpPercent = Math.min(100, Math.max(0, Math.round((hpCur / Math.max(1, hpMax)) * 100)));

    const compCur = c.vitals?.composureCurrent ?? 10;
    const compMax = c.vitals?.composureMax ?? 10;
    const compPercent = Math.min(100, Math.max(0, Math.round((compCur / Math.max(1, compMax)) * 100)));

    const ekskul = formatEkskulBadge(c.ekskul_id);
    const social = formatSocialBadge(c.social_class_id);

    return `
      <div class="roster-character-card">
        <!-- Top Profile Row -->
        <div class="card-profile-header">
          <div class="card-avatar-wrapper">
            <img src="${avatar}" alt="${c.name}" class="card-avatar-img">
            <div class="avatar-grade-pip">K${10 + (c.level - 1)}</div>
          </div>
          <div class="card-identity">
            <h3 class="card-char-name" title="${c.name}">${c.name}</h3>
            <div class="card-char-level">
              <span class="level-pill">Kelas ${10 + (c.level - 1)} • Lvl ${c.level}</span>
            </div>
          </div>
        </div>

        <!-- Badges Row -->
        <div class="card-badges-row">
          <span class="roster-badge badge-ekskul" title="Ekskul: ${ekskul.name}">
            <span>${ekskul.icon}</span>
            <span>${ekskul.name}</span>
          </span>
          <span class="roster-badge badge-social" title="Latar: ${social.name}">
            <span>${social.icon}</span>
            <span>${social.name}</span>
          </span>
        </div>

        <!-- Dual Vitals Trackers -->
        <div class="card-vitals-container">
          <!-- Physical HP -->
          <div class="vital-track-row">
            <div class="vital-track-header">
              <span class="vital-track-lbl">PHYSICAL HP</span>
              <span class="vital-track-val val-hp">${hpCur} / ${hpMax}</span>
            </div>
            <div class="vital-track-bar">
              <div class="vital-bar-fill fill-green" style="width:${hpPercent}%;"></div>
            </div>
          </div>

          <!-- Composure -->
          <div class="vital-track-row">
            <div class="vital-track-header">
              <span class="vital-track-lbl">COMPOSURE</span>
              <span class="vital-track-val val-cmp">${compCur} / ${compMax}</span>
            </div>
            <div class="vital-track-bar">
              <div class="vital-bar-fill fill-rose" style="width:${compPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="card-actions-footer">
          <a href="/characters/${c.id}" class="btn-card-open">
            <span>Buka Sheet</span>
            <svg viewBox="0 0 20 20" fill="currentColor" class="arrow-icon">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </a>
          <button class="btn-card-icon btn-export-char" data-id="${c.id}" title="Ekspor Karakter (JSON)" type="button">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
          <button class="btn-card-icon btn-delete-char" data-id="${c.id}" data-name="${c.name}" title="Hapus Karakter" type="button">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
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
      if (confirm(`Yakin ingin menghapus karakter "${name}" secara permanen? Data yang dihapus tidak dapat dipulihkan.`)) {
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
