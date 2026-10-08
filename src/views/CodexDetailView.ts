import {
  fetchCodexCharacter,
  dmGetCharacter,
  dmSetReveal,
  dmSetTierReveal,
  dmIntroduce,
  dmLockAll,
  dmUpsertCharacter
} from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmAuthModal } from "../components/DmAuthModal";
import { renderDmCodexBar, attachDmCodexBarEvents } from "../components/DmCodexBar";
import { renderCodexSilhouetteSvg } from "../components/CodexSilhouette";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import { codexRealtime, triggerSakuraUnlockAnimation } from "../realtime/codexRealtime";
import { codexCharacterEditorModal } from "../components/CodexCharacterEditorModal";
import type { CodexCharacterDetail } from "../types";

let detailRealtimeUnsub: (() => void) | null = null;

export async function renderCodexDetailView(params: Record<string, string>): Promise<void> {
  const idOrSlug = params.id;
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  // Cleanup previous realtime subscription
  if (detailRealtimeUnsub) {
    detailRealtimeUnsub();
    detailRealtimeUnsub = null;
  }

  appContainer.innerHTML = `
    <section class="view-section active codex-detail-view" style="max-width:1100px;margin:2rem auto;padding:0 1.5rem 6rem 1.5rem;">
      <div id="codexDetailContent">
        <div style="text-align:center;padding:5rem;color:var(--text-muted);">
          Memuat profil karakter...
        </div>
      </div>
      ${renderDmCodexBar()}
    </section>

    <!-- Image Zoom Modal -->
    <div id="codexImageZoomModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;align-items:center;justify-content:center;cursor:zoom-out;padding:1.5rem;">
      <img id="codexZoomedImg" src="" alt="Zoomed view" style="max-width:95vw;max-height:90vh;object-fit:contain;border-radius:var(--radius-md);box-shadow:0 10px 40px rgba(0,0,0,0.8);border:1px solid var(--border-card);" />
    </div>
  `;

  // Attach Image Zoom Modal Close
  const zoomModal = document.getElementById("codexImageZoomModal");
  zoomModal?.addEventListener("click", () => {
    zoomModal.style.display = "none";
  });

  attachDmCodexBarEvents(() => renderCodexDetailView(params));

  // Connect to Realtime channel for zero-refresh updates on player screen
  detailRealtimeUnsub = codexRealtime.subscribe(async (payload) => {
    const isDm = dmAuthStore.isDmActive();
    await loadCharacterDetail(idOrSlug, params);

    if (payload.eventType === "INSERT") {
      const detailContainer = document.getElementById("codexDetailContent");
      if (detailContainer) {
        triggerSakuraUnlockAnimation(detailContainer);
      }
      if (!isDm) {
        showToast("🌸 Informasi karakter baru telah disingkap oleh Game Master!", "info");
      }
    }
  });

  await loadCharacterDetail(idOrSlug, params);
}


async function loadCharacterDetail(idOrSlug: string, params: Record<string, string>) {
  const container = document.getElementById("codexDetailContent");
  if (!container) return;

  const isDmActive = dmAuthStore.isDmActive();
  const dmToken = dmAuthStore.getToken();

  let charData: any = null;

  try {
    if (isDmActive && dmToken) {
      // DM mode: first get basic info or search by slug to find UUID
      let basic = await fetchCodexCharacter(idOrSlug);
      if (basic && basic.id) {
        charData = await dmGetCharacter(dmToken, basic.id);
      } else {
        // Direct search
        charData = await dmGetCharacter(dmToken, idOrSlug);
      }
    } else {
      charData = await fetchCodexCharacter(idOrSlug);
    }
  } catch (e: any) {
    console.error("Gagal memuat detail karakter:", e);
  }

  // JIKA KARAKTER TIDAK DITEMUKAN / SAMA SEKALI TIDAK ADA
  if (!charData) {
    container.innerHTML = `
      <div style="text-align:center;padding:5rem;background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);">
        <div style="font-size:3rem;margin-bottom:1rem;">🌸</div>
        <h2 style="font-family:var(--font-heading);color:var(--text-main);margin:0 0 0.5rem 0;">Karakter Tidak Ditemukan</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;">
          Karakter ini mungkin belum terdaftar atau masih disembunyikan oleh Game Master.
        </p>
        <a href="/codex" class="btn btn-secondary" style="text-decoration:none;">
          ← Kembali ke Kamus Karakter
        </a>
      </div>
    `;
    return;
  }

  // JIKA KARAKTER DALAM MODE TERKUNCI MURNI (PLACEHOLDER UNTUK PEMAIN)
  if (charData.locked && !isDmActive) {
    container.innerHTML = `
      <div style="max-width:600px;margin:2rem auto;text-align:center;background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-xl);padding:3rem 2rem;box-shadow:var(--shadow-lg);">
        <div style="margin-bottom:1.5rem;">
          ${renderCodexSilhouetteSvg(180, 220)}
        </div>
        <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.1);border:1px solid var(--amber-gold);color:var(--amber-gold);padding:4px 12px;border-radius:var(--radius-full);font-size:0.8rem;margin-bottom:1rem;">
          <span>🔒 KARAKTER TERKUNCI</span>
        </div>
        <h2 style="font-family:var(--font-heading);color:var(--text-main);margin:0 0 0.75rem 0;font-size:1.8rem;">
          ???
        </h2>
        <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:2rem;">
          Karakter ini belum diperkenalkan dalam cerita oleh Game Master. Interaksilah dengan lingkungan sekolah dan ikuti sesi permainan untuk membuka identitasnya!
        </p>
        <a href="/codex" class="btn btn-primary" style="text-decoration:none;padding:0.75rem 1.5rem;">
          ← Kembali ke Kamus Karakter
        </a>
      </div>
    `;
    return;
  }

  // KARAKTER TERBUKA (ATAU SEDANG DILIHAT DI MODE DM)
  renderRevealedCharacter(container, charData, isDmActive, params);
}

function renderRevealedCharacter(container: HTMLElement, char: any, isDmActive: boolean, params: Record<string, string>) {
  const sections: any[] = char.sections || [];
  const identitySec = sections.find(s => s.section_key === "identity");
  const appearanceSec = sections.find(s => s.section_key === "appearance");
  const personalitySec = sections.find(s => s.section_key === "personality");
  const backgroundSec = sections.find(s => s.section_key === "background");
  const relationshipsSec = sections.find(s => s.section_key === "relationships");
  const mindSec = sections.find(s => s.section_key === "mind");
  const secretsSec = sections.find(s => s.section_key === "secrets");
  const dmNotesSec = sections.find(s => s.section_key === "dm_notes");

  const identity = identitySec?.content || {};
  const appearance = appearanceSec?.content || {};
  const personality = personalitySec?.content || {};
  const background = backgroundSec?.content || {};
  const relationships = relationshipsSec?.content || {};
  const mind = mindSec?.content || {};
  const secrets = secretsSec?.content || {};
  const dmNotes = dmNotesSec?.content || {};

  const name = identity.name || char.name || "Karakter";
  const furigana = identity.furigana || char.furigana || "";
  const tagline = identity.tagline || char.tagline || "";
  const avatar = appearance.avatar_url || char.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.slug || char.id}`;
  const images: any[] = appearance.images || [];

  container.innerHTML = `
    <!-- Top Back Link & Category -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
      <a href="/codex/${char.category_id || 'class_1_1'}" style="text-decoration:none;color:var(--text-muted);font-size:0.9rem;display:flex;align-items:center;gap:6px;">
        <span>← Kembali ke Daftar Kelas</span>
      </a>
      <div style="display:flex;gap:8px;align-items:center;">
        ${char.is_love_interest ? `
          <span style="background:var(--rose-primary);color:#fff;font-size:0.75rem;padding:4px 12px;border-radius:var(--radius-full);font-weight:700;letter-spacing:0.04em;">
            ♥ HEROINE & LOVE INTEREST
          </span>
        ` : ""}
      </div>
    </div>

    <!-- DM Control Header Toolbar (Mode DM Only) -->
    ${isDmActive ? `
      <div class="dm-char-toolbar" style="background:rgba(24,34,52,0.95);border:1.5px solid var(--amber-gold);border-radius:var(--radius-md);padding:1rem 1.25rem;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <span style="font-size:0.85rem;color:var(--amber-gold);font-weight:700;display:flex;align-items:center;gap:6px;">
            <span>👑 KONTROL PENYINGKAPAN GAME MASTER</span>
          </span>
          <span style="font-size:0.8rem;color:var(--text-muted);">
            Buka atau kunci informasi karakter ini secara langsung untuk seluruh pemain.
          </span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="dmBtnEditCharacter" class="btn btn-xs btn-primary" style="background:var(--amber-gold);border-color:var(--amber-gold);color:#0d111a;font-weight:700;">
            ✏️ Edit Profil Karakter
          </button>
          <button id="dmBtnIntroduce" class="btn btn-xs btn-primary" style="background:var(--rose-primary);border-color:var(--rose-primary);">
            🌸 Perkenalkan (Tier 1)
          </button>
          <button id="dmBtnTier2" class="btn btn-xs btn-secondary">
            📖 Buka Tier 2 (Akrab)
          </button>
          <button id="dmBtnTier3" class="btn btn-xs btn-secondary">
            🔒 Buka Tier 3 (Terdalam)
          </button>
          <button id="dmBtnLockAll" class="btn btn-xs btn-secondary" style="border-color:var(--rose-primary);color:var(--rose-light);">
            🔒 Kunci Semua
          </button>
        </div>
      </div>
    ` : ""}

    <!-- Character Profile Header Card -->
    <div class="codex-profile-header" style="background:var(--bg-card);border:1px solid ${char.is_love_interest ? "rgba(225,29,72,0.4)" : "var(--border-card)"};border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-md);margin-bottom:2.5rem;">
      <div style="display:grid;grid-template-columns:minmax(260px, 320px) 1fr;gap:2rem;" class="profile-header-grid">
        
        <!-- Portrait Gallery Column -->
        <div style="background:#0d111a;padding:1.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;">
          <div style="width:100%;max-width:260px;aspect-ratio:3/4;border-radius:var(--radius-md);overflow:hidden;border:2px solid var(--amber-gold);box-shadow:0 8px 24px rgba(0,0,0,0.6);position:relative;cursor:zoom-in;" id="mainPortraitWrapper">
            <img src="${avatar}" alt="${name}" id="mainPortraitImg" style="width:100%;height:100%;object-fit:cover;" />
            <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.7);color:#fff;font-size:0.7rem;padding:3px 8px;border-radius:var(--radius-full);">
              🔍 Ketuk untuk Perbesar
            </div>
          </div>

          <!-- Gallery Thumbnails (if available) -->
          ${images.length > 1 ? `
            <div style="display:flex;gap:8px;margin-top:1rem;overflow-x:auto;max-width:260px;padding:4px 0;">
              ${images.map((img, i) => `
                <img
                  src="${img.path || avatar}"
                  alt="Thumb ${i}"
                  class="codex-thumb-img"
                  style="width:48px;height:48px;border-radius:var(--radius-xs);object-fit:cover;cursor:pointer;border:1.5px solid var(--border-card);"
                />
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Character Identity Details Column -->
        <div style="padding:2rem 2rem 2rem 0;display:flex;flex-direction:column;justify-content:center;" class="profile-info-col">
          <div style="font-family:var(--font-accent);color:var(--rose-light);font-size:0.9rem;margin-bottom:4px;">
            ${furigana}
          </div>
          <h1 style="font-family:var(--font-heading);color:var(--text-main);font-size:2.2rem;margin:0 0 0.5rem 0;line-height:1.2;">
            ${name}
          </h1>

          ${(identity.nickname || []).length > 0 ? `
            <div style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1rem;">
              Panggilan: <strong>${(identity.nickname || []).join(", ")}</strong>
            </div>
          ` : ""}

          ${tagline ? `
            <div style="background:rgba(225,29,72,0.06);border-left:3px solid var(--rose-primary);padding:0.75rem 1rem;border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-bottom:1.5rem;font-style:italic;color:var(--text-dim);font-size:0.9rem;line-height:1.5;">
              "${tagline}"
            </div>
          ` : ""}

          <!-- Key Badges Grid -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:0.75rem;margin-bottom:1.5rem;">
            <div style="background:var(--bg-surface);padding:0.6rem 0.8rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Kelas & Angkatan</span>
              <strong style="font-size:0.85rem;color:var(--amber-gold);">${identity.class_room || "Kelas 1-1"}</strong>
            </div>
            <div style="background:var(--bg-surface);padding:0.6rem 0.8rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Ekskul / Bukatsu</span>
              <strong style="font-size:0.85rem;color:var(--text-main);">${identity.club || "-"}</strong>
            </div>
            <div style="background:var(--bg-surface);padding:0.6rem 0.8rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Peran Sekolah</span>
              <strong style="font-size:0.85rem;color:var(--text-main);">${identity.role || "Murid"}</strong>
            </div>
            <div style="background:var(--bg-surface);padding:0.6rem 0.8rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
              <span style="font-size:0.7rem;color:var(--text-muted);display:block;">Arketipe / MBTI</span>
              <strong style="font-size:0.85rem;color:var(--text-main);">${identity.archetype || "-"} ${identity.mbti ? `(${identity.mbti})` : ""}</strong>
            </div>
          </div>

          <!-- Homeroom Map Link (if available) -->
          ${char.home_room_id ? `
            <div style="display:inline-flex;align-items:center;gap:8px;">
              <a href="/map?room=${char.home_room_id}" class="btn btn-xs btn-secondary" style="border:1px solid var(--amber-gold);color:var(--amber-gold);text-decoration:none;display:flex;align-items:center;gap:6px;">
                <span>📍 Lihat Lokasi Ruang Kelas di Peta Sekolah →</span>
              </a>
            </div>
          ` : ""}
        </div>
      </div>
    </div>

    <!-- Section Tabs Navigator -->
    <div class="codex-tabs-bar" style="display:flex;gap:8px;border-bottom:1px solid var(--border-card);margin-bottom:2rem;overflow-x:auto;padding-bottom:6px;">
      <button class="codex-tab-btn active" data-tab="identity">🌸 Identitas</button>
      <button class="codex-tab-btn" data-tab="appearance">🎀 Penampilan</button>
      <button class="codex-tab-btn" data-tab="personality">🧠 Kepribadian</button>
      <button class="codex-tab-btn" data-tab="background">📖 Latar Belakang</button>
      <button class="codex-tab-btn" data-tab="relationships">👥 Relasi</button>
      <button class="codex-tab-btn" data-tab="mind">💭 Pikiran</button>
      <button class="codex-tab-btn" data-tab="secrets">🔒 Rahasia</button>
      ${isDmActive ? `<button class="codex-tab-btn" data-tab="dm_notes" style="color:var(--amber-gold);">👑 Catatan DM</button>` : ""}
    </div>

    <!-- Section Content Panels -->
    <div id="codexTabPanels">
      
      <!-- 1. IDENTITAS (TIER 1) -->
      <div class="codex-panel active" id="panel_identity">
        ${renderSectionCard("identity", identitySec, isDmActive, `
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.5rem;">
            <div>
              <h4 style="color:var(--rose-light);margin:0 0 1rem 0;font-family:var(--font-heading);">Informasi Personal</h4>
              <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:8px 0;color:var(--text-muted);">Usia</td><td style="font-weight:600;">${identity.age || "-"} tahun</td></tr>
                <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:8px 0;color:var(--text-muted);">Ulang Tahun</td><td style="font-weight:600;">${identity.birthday || "-"} (${identity.zodiac || "-"})</td></tr>
                <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:8px 0;color:var(--text-muted);">Tipe Kepribadian</td><td style="font-weight:600;">${identity.mbti || "-"}</td></tr>
                <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:8px 0;color:var(--text-muted);">Status Sosial</td><td style="font-weight:600;">${identity.social_class || "-"}</td></tr>
                <tr style="border-bottom:1px solid var(--border-subtle);"><td style="padding:8px 0;color:var(--text-muted);">Posisi di Klub</td><td style="font-weight:600;">${identity.club_role || "-"}</td></tr>
              </table>
            </div>

            <!-- Stats & Vitals -->
            <div>
              <h4 style="color:var(--amber-gold);margin:0 0 1rem 0;font-family:var(--font-heading);">Statistik Atribut (D&D 5e Chassis)</h4>
              <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;text-align:center;">
                ${Object.entries(identity.stats || { physique: 10, intelligent: 10, looks: 10, mind: 10, talent: 10, luck: 10 }).map(([stat, val]) => `
                  <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:8px;">
                    <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">${stat.slice(0, 3)}</div>
                    <div style="font-size:1.1rem;font-weight:700;color:var(--amber-gold);">${val}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `)}
      </div>

      <!-- 2. PENAMPILAN (TIER 1) -->
      <div class="codex-panel" id="panel_appearance" style="display:none;">
        ${renderSectionCard("appearance", appearanceSec, isDmActive, `
          <div style="line-height:1.7;font-size:0.9rem;color:var(--text-dim);white-space:pre-wrap;">
            ${appearance.raw_markdown || "Deskripsi penampilan fisik belum dicatat."}
          </div>
        `)}
      </div>

      <!-- 3. KEPRIBADIAN (TIER 2) -->
      <div class="codex-panel" id="panel_personality" style="display:none;">
        ${renderSectionCard("personality", personalitySec, isDmActive, `
          <div>
            ${(personality.likes || []).length > 0 ? `
              <div style="margin-bottom:1.5rem;">
                <h4 style="color:var(--green-health);margin:0 0 0.5rem 0;font-size:0.9rem;">💚 Hal yang Disukai (Likes)</h4>
                <ul style="margin:0;padding-left:1.25rem;color:var(--text-dim);font-size:0.85rem;line-height:1.6;">
                  ${(personality.likes || []).map((l: string) => `<li>${l}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            ${(personality.dislikes || []).length > 0 ? `
              <div style="margin-bottom:1.5rem;">
                <h4 style="color:var(--rose-primary);margin:0 0 0.5rem 0;font-size:0.9rem;">💔 Hal yang Dibenci (Dislikes)</h4>
                <ul style="margin:0;padding-left:1.25rem;color:var(--text-dim);font-size:0.85rem;line-height:1.6;">
                  ${(personality.dislikes || []).map((d: string) => `<li>${d}</li>`).join("")}
                </ul>
              </div>
            ` : ""}

            <div style="line-height:1.7;font-size:0.9rem;color:var(--text-dim);white-space:pre-wrap;">
              ${personality.raw_markdown || "Catatan kepribadian belum dicatat."}
            </div>
          </div>
        `)}
      </div>

      <!-- 4. LATAR BELAKANG (TIER 2) -->
      <div class="codex-panel" id="panel_background" style="display:none;">
        ${renderSectionCard("background", backgroundSec, isDmActive, `
          <div style="line-height:1.7;font-size:0.9rem;color:var(--text-dim);white-space:pre-wrap;">
            ${background.raw_markdown || "Latar belakang karakter belum dicatat."}
          </div>
        `)}
      </div>

      <!-- 5. RELASI (TIER 2) -->
      <div class="codex-panel" id="panel_relationships" style="display:none;">
        ${renderSectionCard("relationships", relationshipsSec, isDmActive, `
          <div style="line-height:1.7;font-size:0.9rem;color:var(--text-dim);white-space:pre-wrap;">
            ${relationships.raw_markdown || "Jaringan relasi karakter belum dicatat."}
          </div>
        `)}
      </div>

      <!-- 6. PIKIRAN TERDALAM (TIER 3) -->
      <div class="codex-panel" id="panel_mind" style="display:none;">
        ${renderSectionCard("mind", mindSec, isDmActive, `
          <div>
            ${mind.heart_meter_base ? `
              <div style="background:rgba(225,29,72,0.1);border:1px solid var(--rose-primary);padding:1rem;border-radius:var(--radius-md);margin-bottom:1.5rem;">
                <div style="font-family:var(--font-heading);color:var(--rose-light);font-size:0.95rem;margin-bottom:4px;">
                  💖 Target Deklarasi Cinta (The Confession Event)
                </div>
                <div style="font-size:0.85rem;color:var(--text-dim);">
                  Tingkat Kesulitan Lemparan Dadu (DC): <strong>${mind.confession_dc || 17}</strong> • Level Heart Awal: <strong>${mind.heart_meter_base || 1} ♥</strong>
                </div>
              </div>
            ` : ""}
            <div style="line-height:1.7;font-size:0.9rem;color:var(--text-dim);white-space:pre-wrap;">
              ${mind.raw_markdown || "Pikiran terdalam karakter belum dicatat."}
            </div>
          </div>
        `)}
      </div>

      <!-- 7. RAHASIA BESAR (TIER 3) -->
      <div class="codex-panel" id="panel_secrets" style="display:none;">
        ${renderSectionCard("secrets", secretsSec, isDmActive, `
          <div style="line-height:1.7;font-size:0.9rem;color:var(--rose-light);white-space:pre-wrap;">
            ${secrets.raw_markdown || "Rahasia besar karakter belum terungkap."}
          </div>
        `)}
      </div>

      <!-- 8. CATATAN KHUSUS DM (MODE DM ONLY) -->
      ${isDmActive ? `
        <div class="codex-panel" id="panel_dm_notes" style="display:none;">
          <div style="background:rgba(24,34,52,0.9);border:1.5px solid var(--amber-gold);border-radius:var(--radius-lg);padding:1.75rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:10px;">
              <div style="display:flex;align-items:center;gap:8px;color:var(--amber-gold);font-family:var(--font-heading);">
                <span style="font-size:1.2rem;">👑</span>
                <h3 style="margin:0;font-size:1.15rem;">Catatan Eksklusif Game Master (DM Notes)</h3>
              </div>
              <button id="dmSaveNotesBtn" class="btn btn-sm btn-primary" style="display:flex;align-items:center;gap:6px;background:var(--amber-gold);border-color:var(--amber-gold);color:#0d111a;font-weight:700;">
                <span>💾 Simpan Catatan DM</span>
              </button>
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;line-height:1.5;">
              Bagian ini <strong>TIDAK PERNAH</strong> dikirimkan ke pemain dan hanya tersimpan untuk DM. Gunakan untuk mencatat rencana plot, motivasi rahasia, DC lemparan dadu, atau interaksi masa lalu.
            </p>
            <textarea
              id="dmNotesTextarea"
              rows="12"
              placeholder="Tuliskan catatan rahasia DM untuk karakter ini di sini..."
              style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem;color:var(--text-main);font-family:inherit;font-size:0.9rem;line-height:1.6;resize:vertical;outline:none;"
            >${dmNotes.notes || ""}</textarea>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  // Attach Image Zoom Trigger
  document.getElementById("mainPortraitWrapper")?.addEventListener("click", () => {
    const zoomModal = document.getElementById("codexImageZoomModal");
    const zoomImg = document.getElementById("codexZoomedImg") as HTMLImageElement;
    if (zoomModal && zoomImg) {
      zoomImg.src = avatar;
      zoomModal.style.display = "flex";
    }
  });

  // Attach Thumbnail Clicks
  container.querySelectorAll(".codex-thumb-img").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const src = (thumb as HTMLImageElement).src;
      const mainImg = document.getElementById("mainPortraitImg") as HTMLImageElement;
      if (mainImg) mainImg.src = src;
    });
  });

  // Attach Tab Navigation
  const tabBtns = container.querySelectorAll(".codex-tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tabId = btn.getAttribute("data-tab");
      container.querySelectorAll(".codex-panel").forEach(p => (p as HTMLElement).style.display = "none");
      const targetPanel = document.getElementById(`panel_${tabId}`);
      if (targetPanel) targetPanel.style.display = "block";
    });
  });

  // Attach DM Controls
  if (isDmActive) {
    const token = dmAuthStore.getToken();
    const charId = char.id;

    // Edit Character Profile Modal
    document.getElementById("dmBtnEditCharacter")?.addEventListener("click", () => {
      codexCharacterEditorModal.openForEdit(char, async () => {
        await loadCharacterDetail(params.id, params);
      });
    });

    // Quick tier buttons
    document.getElementById("dmBtnIntroduce")?.addEventListener("click", async () => {
      if (token && charId) {
        try {
          await dmIntroduce(token, charId);
          showToast("🌸 Tier 1 berhasil diperkenalkan ke pemain!", "success");
          await loadCharacterDetail(params.id, params);
        } catch (e: any) {
          showToast(`Gagal: ${e.message}`, "error");
        }
      }
    });

    document.getElementById("dmBtnTier2")?.addEventListener("click", async () => {
      if (token && charId) {
        try {
          await dmSetTierReveal(token, charId, 2, true);
          showToast("📖 Tier 2 (Kepribadian & Latar Belakang) terbuka!", "success");
          await loadCharacterDetail(params.id, params);
        } catch (e: any) {
          showToast(`Gagal: ${e.message}`, "error");
        }
      }
    });

    document.getElementById("dmBtnTier3")?.addEventListener("click", async () => {
      if (token && charId) {
        try {
          await dmSetTierReveal(token, charId, 3, true);
          showToast("🔒 Tier 3 (Pikiran & Rahasia) terbuka!", "success");
          await loadCharacterDetail(params.id, params);
        } catch (e: any) {
          showToast(`Gagal: ${e.message}`, "error");
        }
      }
    });

    document.getElementById("dmBtnLockAll")?.addEventListener("click", async () => {
      if (token && charId) {
        try {
          await dmLockAll(token, charId);
          showToast("🔒 Seluruh informasi karakter ini dikunci kembali.", "info");
          await loadCharacterDetail(params.id, params);
        } catch (e: any) {
          showToast(`Gagal: ${e.message}`, "error");
        }
      }
    });

    // Per-section toggle switches
    container.querySelectorAll(".btn-dm-toggle-section").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const secKey = btn.getAttribute("data-sec-key");
        const currentRevealed = btn.getAttribute("data-revealed") === "true";
        if (token && charId && secKey) {
          try {
            await dmSetReveal(token, charId, secKey, !currentRevealed);
            showToast(`Status penyingkapan [${secKey}] berhasil diubah.`, "info");
            await loadCharacterDetail(params.id, params);
          } catch (e: any) {
            showToast(`Gagal: ${e.message}`, "error");
          }
        }
      });
    });

    // Save DM Notes
    document.getElementById("dmSaveNotesBtn")?.addEventListener("click", async () => {
      const textarea = document.getElementById("dmNotesTextarea") as HTMLTextAreaElement;
      if (!textarea || !token) return;

      const saveBtn = document.getElementById("dmSaveNotesBtn") as HTMLButtonElement;
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span>⏳ Menyimpan...</span>`;
      }

      try {
        const payload = {
          slug: char.slug,
          categoryId: char.category_id,
          sortOrder: char.sort_order || 0,
          visibilityMode: char.visibility_mode || "placeholder",
          homeRoomId: char.home_room_id || null,
          isLoveInterest: Boolean(char.is_love_interest),
          sections: [
            {
              sectionKey: "dm_notes",
              tier: 1,
              content: { notes: textarea.value },
              lockedHint: ""
            }
          ]
        };

        const res = await dmUpsertCharacter(token, payload);
        if (res.success) {
          showToast("💾 Catatan rahasia DM berhasil disimpan!", "success");
        } else {
          showToast(`Gagal menyimpan: ${res.error || "Terjadi kesalahan"}`, "error");
        }
      } catch (e: any) {
        showToast(`Gagal menyimpan catatan: ${e.message}`, "error");
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `<span>💾 Simpan Catatan DM</span>`;
        }
      }
    });

    // Per-section hint editor
    container.querySelectorAll(".btn-dm-edit-hint").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const secKey = btn.getAttribute("data-sec-key");
        const currentTier = parseInt(btn.getAttribute("data-tier") || "1", 10);
        const encodedHint = btn.getAttribute("data-hint") || "";
        const currentHint = decodeURIComponent(encodedHint);

        const newHint = prompt(`Ubah pesan petunjuk (Locked Hint) untuk seksi [${secKey}]:`, currentHint);
        if (newHint === null || newHint === currentHint) return;

        const targetSec = sections.find(s => s.section_key === secKey);
        try {
          const payload = {
            slug: char.slug,
            categoryId: char.category_id,
            sortOrder: char.sort_order || 0,
            visibilityMode: char.visibility_mode || "placeholder",
            homeRoomId: char.home_room_id || null,
            isLoveInterest: Boolean(char.is_love_interest),
            sections: [
              {
                sectionKey: secKey,
                tier: currentTier,
                content: targetSec?.content || {},
                lockedHint: newHint.trim()
              }
            ]
          };

          const res = await dmUpsertCharacter(token!, payload);
          if (res.success) {
            showToast(`Petunjuk untuk [${secKey}] berhasil diperbarui!`, "success");
            await loadCharacterDetail(params.id, params);
          } else {
            showToast(`Gagal: ${res.error || "Gagal memperbarui hint"}`, "error");
          }
        } catch (e: any) {
          showToast(`Gagal: ${e.message}`, "error");
        }
      });
    });
  }
}

function renderSectionCard(sectionKey: string, sectionObj: any, isDmActive: boolean, contentHtml: string): string {
  const isLocked = !sectionObj || sectionObj.locked === true || sectionObj.revealed === false;
  const hint = sectionObj?.locked_hint || "Informasi ini masih terkunci oleh Game Master.";
  const tier = sectionObj?.tier || 1;

  // JIKA TERKUNCI & BUKAN MODE DM: TAMPILKAN PANEL GEMBOK SEGEL PERKAMEN (TANPA KONTEN)
  if (isLocked && !isDmActive) {
    return `
      <div class="codex-locked-seal-panel" style="background:var(--bg-card);border:1px dashed var(--border-card);border-radius:var(--radius-lg);padding:3rem 2rem;text-align:center;box-shadow:var(--shadow-sm);">
        <div style="font-size:2.5rem;margin-bottom:0.75rem;">🔒</div>
        <h3 style="font-family:var(--font-heading);color:var(--amber-gold);margin:0 0 0.5rem 0;font-size:1.2rem;">
          Informasi Terkunci
        </h3>
        <p style="color:var(--text-muted);font-size:0.9rem;max-width:500px;margin:0 auto 1rem auto;line-height:1.5;">
          "${hint}"
        </p>
        <span style="font-size:0.75rem;color:var(--text-muted);background:rgba(255,255,255,0.05);padding:4px 10px;border-radius:var(--radius-full);">
          Tier ${tier} Content
        </span>
      </div>
    `;
  }

  // JIKA TERBUKA (ATAU SEDANG DALAM MODE DM DENGAN SWITCH)
  return `
    <div class="codex-section-card" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:2rem;position:relative;">
      ${isDmActive ? `
        <div style="border-bottom:1px solid var(--border-subtle);padding-bottom:1rem;margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:0.75rem;padding:3px 8px;border-radius:var(--radius-full);font-weight:700;background:${isLocked ? "rgba(225,29,72,0.15)" : "rgba(16,185,129,0.15)"};color:${isLocked ? "var(--rose-light)" : "var(--green-health)"};border:1px solid ${isLocked ? "var(--rose-primary)" : "var(--green-health)"};">
              ${isLocked ? "🔒 Terkunci untuk Pemain" : "✓ Terbuka untuk Pemain"}
            </span>
            <span style="font-size:0.75rem;color:var(--text-muted);">
              Tier ${tier}
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="btn btn-xs btn-secondary btn-dm-toggle-section" data-sec-key="${sectionKey}" data-revealed="${!isLocked}">
              ${isLocked ? "🔓 Buka Section Ini" : "🔒 Kunci Section Ini"}
            </button>
            <button class="btn btn-xs btn-secondary btn-dm-edit-hint" data-sec-key="${sectionKey}" data-tier="${tier}" data-hint="${encodeURIComponent(hint)}">
              ✏️ Edit Hint
            </button>
          </div>
        </div>
        ${hint ? `
          <div style="margin-bottom:1.25rem;background:rgba(245,158,11,0.06);border-left:3px solid var(--amber-gold);padding:0.5rem 0.75rem;border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:0.8rem;">
            <span style="color:var(--amber-gold);font-weight:600;">Petunjuk saat terkunci:</span>
            <span style="color:var(--text-muted);font-style:italic;"> "${hint}"</span>
          </div>
        ` : ""}
      ` : ""}
      ${contentHtml}
    </div>
  `;
}
