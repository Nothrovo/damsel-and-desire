import { listMyCharacters, deleteCharacter, importLegacyCharacter } from "../api/characters";
import { supabase } from "../api/supabase";
import { exportCharacterJson, validateCharacterJson } from "../services/exporter";
import { authStore } from "../store/authStore";
import { renderCardSkeleton } from "../components/Skeleton";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import type { Character } from "../types";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { escapeHtml } from "../utils/escapeHtml";

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

  const profileName = authStore.profile?.display_name?.trim();
  const greeting = profileName ? `Selamat datang kembali, ${profileName}.` : "Setiap nama di sini menyimpan satu cerita.";

  appContainer.innerHTML = `
    <section class="view-section active landing-view-wrapper roster-workspace">
      <header class="roster-masthead">
        <div class="roster-school-mark" aria-hidden="true">鳳仙</div>
        <div class="roster-masthead-copy">
          <p class="roster-school-name">鳳仙学園 · Housen Academy</p>
          <h1>Roster Siswa</h1>
          <p class="roster-masthead-note">${escapeHtml(greeting)}</p>
        </div>
        <a href="/characters/new" class="btn btn-primary roster-create-action">Buat karakter</a>
      </header>

      <section class="roster-section" aria-labelledby="rosterSectionTitle">
        <div class="roster-header">
          <div class="roster-title-group">
            <div class="roster-icon-wrapper" aria-hidden="true">鳳</div>
            <div>
              <h2 id="rosterSectionTitle" class="roster-heading">Daftar murid</h2>
              <span class="roster-subheading">Temukan lembar karakter, kegiatan, dan dua vitals mereka.</span>
            </div>
            <span id="rosterCountBadge" class="roster-count-badge" aria-live="polite">Memuat…</span>
          </div>

          <div class="roster-search-wrapper">
            <label class="sr-only" for="searchRosterInput">Cari murid berdasarkan nama, ekskul, atau latar sosial</label>
            <svg viewBox="0 0 20 20" fill="currentColor" class="search-icon" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
            <input type="search" id="searchRosterInput" name="roster-search" class="input-search-roster" placeholder="Cari nama, ekskul, atau latar…" autocomplete="off" aria-label="Cari murid">
          </div>
        </div>

        <div id="rosterGrid" class="roster-grid" aria-live="polite">
          ${renderCardSkeleton(3)}
        </div>

        <div id="rosterEmptyState" class="empty-state" style="display:none;">
          <div class="empty-illustration" aria-hidden="true">🌸</div>
          <h3 class="empty-title">Belum ada murid di daftar</h3>
          <p class="empty-desc">Mulai dengan membuat karakter pertamamu di Housen Academy.</p>
          <a href="/characters/new" class="btn btn-primary">Buat karakter</a>
        </div>
      </section>

      <nav class="roster-quick-links" aria-label="Arsip dan kehidupan sekolah">
        <span class="roster-quick-links-title">Kehidupan sekolah</span>
        <a href="/codex">Arsip Housen</a>
        <a href="/calendar">Kalender akademik</a>
        <a href="/map">Denah sekolah</a>
        <a href="/compendium">Buku aturan</a>
        <button class="roster-import-action" id="btnImportJson" type="button">Impor karakter</button>
        <input type="file" id="landingImportFile" name="character-import" accept=".json,application/json" hidden>
      </nav>
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
  } catch (err: unknown) {
    console.error("Gagal memuat karakter:", err);
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "btn btn-secondary";
    retryButton.textContent = "Coba lagi";
    retryButton.addEventListener("click", () => loadCharacters());
    if (gridEl) {
      gridEl.replaceChildren();
      const errorState = document.createElement("div");
      errorState.className = "roster-error-state";
      errorState.setAttribute("role", "status");
      errorState.append("Daftar murid belum dapat dimuat. Periksa koneksi lalu coba lagi.");
      errorState.append(retryButton);
      gridEl.append(errorState);
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
    gridEl.replaceChildren();
    const noResults = document.createElement("p");
    noResults.className = "roster-no-results";
    noResults.textContent = `Tidak ada murid yang cocok dengan pencarian “${query}”.`;
    gridEl.append(noResults);
    return;
  }

  gridEl.innerHTML = filtered.map((c) => {
    const avatar = escapeHtml(c.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.name)}`);
    const safeName = escapeHtml(c.name);
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
            <img src="${avatar}" alt="Portrait ${safeName}" class="card-avatar-img" width="56" height="56" loading="lazy">
            <div class="avatar-grade-pip">K${10 + (c.level - 1)}</div>
          </div>
          <div class="card-identity">
            <h3 class="card-char-name" title="${safeName}">${safeName}</h3>
            <div class="card-char-level">
              <span class="level-pill">Kelas ${10 + (c.level - 1)} • Lvl ${c.level}</span>
            </div>
          </div>
        </div>

        <!-- Badges Row -->
        <div class="card-badges-row">
          <span class="roster-badge badge-ekskul" title="Ekskul: ${escapeHtml(ekskul.name)}">
            <span aria-hidden="true">${ekskul.icon}</span>
            <span>${escapeHtml(ekskul.name)}</span>
          </span>
          <span class="roster-badge badge-social" title="Latar: ${escapeHtml(social.name)}">
            <span aria-hidden="true">${social.icon}</span>
            <span>${escapeHtml(social.name)}</span>
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
          <button class="btn-card-icon btn-delete-char" data-id="${c.id}" data-name="${safeName}" title="Hapus Karakter" type="button">
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
