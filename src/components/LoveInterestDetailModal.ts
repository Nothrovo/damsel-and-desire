import {
  fetchDynamicLoveInterestDetail,
  fetchDynamicLoveInterests,
  matchTargetToLoveInterest,
  getCurrentMilestone,
  type LoveInterestDefinition,
  type HeartMilestone
} from "../api/loveInterests";
import type { Character, TargetSecret } from "../types";
import { router } from "../router/router";
import { showToast } from "./Toast";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class LoveInterestDetailModal {
  private modalEl: HTMLElement | null = null;
  private currentCharacter: Character | null = null;
  private targetIdx: number = -1;
  private currentTarget: TargetSecret | null = null;
  private resolvedLi: LoveInterestDefinition | null = null;
  private onUpdateCallback: (() => void) | null = null;
  private onDeleteCallback: (() => void) | null = null;

  public render(): string {
    return `
      <div id="loveInterestDetailModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card li-detail-modal-card" style="max-width:880px;width:95vw;max-height:92vh;display:flex;flex-direction:column;border:1.5px solid var(--rose-primary);box-shadow:0 16px 48px rgba(225,29,72,0.3);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-card);">
          
          <!-- Header -->
          <div class="modal-header" style="border-bottom:1px solid var(--border-card);padding:1.25rem 1.75rem;background:linear-gradient(135deg, rgba(225,29,72,0.12), rgba(13,17,26,0.8));display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
            <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:0;">
              <div style="position:relative;flex-shrink:0;">
                <img
                  id="liDetailAvatar"
                  src=""
                  alt="Avatar"
                  style="width:72px;height:72px;border-radius:var(--radius-md);object-fit:cover;border:2.5px solid var(--amber-gold);box-shadow:0 4px 16px rgba(0,0,0,0.5);"
                />
                <span id="liDetailClassBadge" style="position:absolute;bottom:-6px;right:-6px;background:var(--rose-primary);color:#fff;font-size:0.65rem;font-weight:800;padding:2px 6px;border-radius:var(--radius-full);border:1px solid rgba(255,255,255,0.3);">
                  11-1
                </span>
              </div>

              <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                  <h2 id="liDetailName" style="margin:0;font-size:1.35rem;font-family:var(--font-heading);color:var(--amber-gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    Nama Karakter
                  </h2>
                  <span id="liDetailStatusBadge" class="target-status-badge" style="font-size:0.75rem;">
                    Secret Crush
                  </span>
                </div>
                <div id="liDetailFurigana" style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">
                  Furigana / Kanji
                </div>
                <div id="liDetailBadgesGroup" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                  <!-- Badges inserted dynamically -->
                </div>
              </div>
            </div>

            <button class="modal-close-btn" id="closeLiDetailModalBtn" aria-label="Tutup" style="font-size:1.6rem;color:var(--text-muted);">&times;</button>
          </div>

          <!-- Scrollable Content Body -->
          <div class="modal-body" id="liDetailModalBody" style="flex:1;overflow-y:auto;padding:1.5rem 1.75rem;display:flex;flex-direction:column;gap:1.5rem;">
            
            <!-- 1. Interactive Affection Meter & Current Milestone Banner -->
            <div class="li-detail-section" style="background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:1.2rem;">❤️</span>
                  <span style="font-weight:800;font-size:0.95rem;color:var(--rose-light);">
                    Meteran Hati &amp; Progres Hubungan:
                  </span>
                </div>
                <span id="liDetailHeartsScore" style="font-size:1rem;font-weight:800;color:var(--rose-light);">
                  (1/10 ♥)
                </span>
              </div>

              <!-- Clickable Heart Dots -->
              <div id="liDetailHeartDotsContainer" class="target-heart-meter" style="display:flex;gap:8px;font-size:1.5rem;cursor:pointer;user-select:none;margin-bottom:1rem;">
                <!-- Generated dynamically -->
              </div>

              <!-- Current Milestone Highlight Box -->
              <div id="liDetailCurrentMilestoneBox" style="background:rgba(225,29,72,0.1);border-left:4px solid var(--rose-primary);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:0.85rem 1rem;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                  <span style="font-size:0.75rem;font-weight:800;background:var(--rose-primary);color:#fff;padding:2px 8px;border-radius:var(--radius-full);letter-spacing:0.04em;">
                    ✦ TAHAP SAAT INI
                  </span>
                  <strong id="liDetailCurrentMilestoneTitle" style="color:var(--amber-gold);font-size:0.9rem;">
                    Judul Tahap
                  </strong>
                </div>
                <p id="liDetailCurrentMilestoneDesc" style="margin:0;font-size:0.85rem;color:var(--text-main);line-height:1.5;">
                  Deskripsi tahap afeksi saat ini...
                </p>
              </div>

              <!-- Collapsible All Milestones Progression -->
              <div style="margin-top:1rem;">
                <details style="font-size:0.85rem;color:var(--text-muted);">
                  <summary style="cursor:pointer;font-weight:700;color:var(--text-dim);padding:4px 0;">
                    📜 Lihat Seluruh Tahap Progresi Hati (1–10 ♥)
                  </summary>
                  <div id="liDetailAllMilestonesList" style="display:flex;flex-direction:column;gap:8px;margin-top:0.75rem;padding-left:0.5rem;border-left:1px dashed var(--border-subtle);">
                    <!-- Milestones list inserted dynamically -->
                  </div>
                </details>
              </div>
            </div>

            <!-- 2. Tagline Quote -->
            <div id="liDetailTaglineBox" style="display:none;background:rgba(245,158,11,0.06);border-left:3px solid var(--amber-gold);padding:0.75rem 1rem;border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-style:italic;color:var(--text-dim);font-size:0.85rem;line-height:1.5;">
              "Tagline karakter..."
            </div>

            <!-- 3. Gift Guide & Date Spots Grid -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
              
              <!-- Gift Guide -->
              <div class="li-detail-section" style="background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem;">
                <h4 style="margin:0 0 0.75rem 0;font-size:0.9rem;font-weight:800;color:var(--amber-gold);display:flex;align-items:center;gap:6px;">
                  <span>🎁</span> Panduan Hadiah (Gift System)
                </h4>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:0.8rem;">
                  <div>
                    <span style="color:#4ade80;font-weight:700;display:block;margin-bottom:2px;">
                      ✦ Hadiah Favorit (+Afeksi Besar):
                    </span>
                    <span id="liDetailGiftsFav" style="color:var(--text-main);line-height:1.4;">-</span>
                  </div>
                  <div>
                    <span style="color:#60a5fa;font-weight:700;display:block;margin-bottom:2px;">
                      ✦ Hadiah Biasa (+Afeksi Standar):
                    </span>
                    <span id="liDetailGiftsNormal" style="color:var(--text-main);line-height:1.4;">-</span>
                  </div>
                  <div>
                    <span style="color:#f43f5e;font-weight:700;display:block;margin-bottom:2px;">
                      ✦ Hadiah Terlarang (-Afeksi / Composure Damage):
                    </span>
                    <span id="liDetailGiftsDisliked" style="color:var(--text-main);line-height:1.4;">-</span>
                  </div>
                </div>
              </div>

              <!-- Date Spots -->
              <div class="li-detail-section" style="background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem;">
                <h4 style="margin:0 0 0.75rem 0;font-size:0.9rem;font-weight:800;color:var(--amber-gold);display:flex;align-items:center;gap:6px;">
                  <span>📍</span> Rekomendasi Lokasi Kencan (Date Spots)
                </h4>
                <ul id="liDetailDateSpotsList" style="margin:0;padding-left:1.2rem;font-size:0.8rem;color:var(--text-main);line-height:1.6;display:flex;flex-direction:column;gap:4px;">
                  <!-- Date spots inserted dynamically -->
                </ul>
              </div>

            </div>

            <!-- 4. Personality & Dere Pattern (Flaws & Secrets) -->
            <div id="liDetailPersonalityBox" class="li-detail-section" style="background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1rem;">
              <h4 style="margin:0 0 0.75rem 0;font-size:0.9rem;font-weight:800;color:var(--rose-light);display:flex;align-items:center;gap:6px;">
                <span>🧠</span> Kepribadian &amp; Pola Kasmaran (Dere Pattern)
              </h4>
              <div style="display:flex;flex-direction:column;gap:8px;font-size:0.82rem;line-height:1.5;">
                <div id="liDetailDereWrap">
                  <strong style="color:var(--amber-gold);">Bahasa Cinta &amp; Dere:</strong>
                  <span id="liDetailDerePattern" style="color:var(--text-main);"></span>
                </div>
                <div id="liDetailFlawsWrap">
                  <strong style="color:#f87171;">Celah Emosional &amp; Trauma:</strong>
                  <span id="liDetailFlaws" style="color:var(--text-main);"></span>
                </div>
              </div>
            </div>

            <!-- 5. DM Confidential Notes & Status Editor -->
            <div class="li-detail-section" style="background:linear-gradient(180deg, rgba(225,29,72,0.08), rgba(0,0,0,0.3));border:1px dashed var(--rose-primary);border-radius:var(--radius-md);padding:1.25rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <h4 style="margin:0;font-size:0.95rem;font-weight:800;color:var(--rose-light);display:flex;align-items:center;gap:6px;">
                  <span>🔒</span> Catatan Rahasia DM &amp; Event Flag
                </h4>
                <span style="font-size:0.7rem;color:var(--amber-gold);background:rgba(245,158,11,0.15);padding:2px 8px;border-radius:var(--radius-full);">
                  Hanya Game Master
                </span>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem;">
                <div>
                  <label style="display:block;font-size:0.78rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                    Ubah Status Hubungan:
                  </label>
                  <select id="liDetailEditStatusSelect" class="input-select" style="width:100%;font-size:0.85rem;">
                    <option value="Secret Crush">Secret Crush</option>
                    <option value="Rival">Rival</option>
                    <option value="Teman Sebangku">Teman Sebangku</option>
                    <option value="Sahabat Masa Kecil">Sahabat Masa Kecil</option>
                    <option value="Kagum dari Jauh">Kagum dari Jauh</option>
                    <option value="Sering Berpapasan">Sering Berpapasan</option>
                    <option value="Calon Pacar">Calon Pacar</option>
                    <option value="Kekasih (Canon Lovers)">Kekasih (Canon Lovers)</option>
                    <option value="CUSTOM">-- Status Lainnya... --</option>
                  </select>
                  <input type="text" id="liDetailEditCustomStatusInput" placeholder="Ketik status khusus..." style="display:none;width:100%;margin-top:6px;" class="input-text" />
                </div>
                <div>
                  <label style="display:block;font-size:0.78rem;font-weight:700;color:var(--text-dim);margin-bottom:4px;">
                    Simpan Catatan Momen:
                  </label>
                  <p style="margin:0;font-size:0.72rem;color:var(--text-muted);line-height:1.4;">
                    Catat event penting seperti kencan di atap, hadiah yang pernah diberikan, atau rahasia yang telah terbongkar.
                  </p>
                </div>
              </div>

              <div>
                <textarea
                  id="liDetailSecretNotesTextarea"
                  rows="3"
                  class="input-textarea"
                  placeholder="Ketik catatan rahasia atau event flag yang sudah tercapai..."
                  style="width:100%;font-size:0.85rem;"
                ></textarea>
              </div>

              <div style="margin-top:1rem;display:flex;justify-content:flex-end;">
                <button type="button" id="btnSaveLiDetailNotes" class="btn btn-primary btn-sm" style="background:var(--rose-primary);border-color:var(--rose-primary);font-weight:700;">
                  💾 Simpan Perubahan Catatan &amp; Status
                </button>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="modal-footer" style="padding:1rem 1.75rem;border-top:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;gap:8px;">
              <button type="button" id="btnOpenFullCodexPage" class="btn btn-secondary btn-sm" style="display:flex;align-items:center;gap:6px;">
                <span>📖 Buka di Codex Karakter</span>
              </button>
              <button type="button" id="btnDeleteTargetFromSheet" class="btn btn-danger btn-sm" style="background:rgba(244,63,94,0.15);border:1px solid #f43f5e;color:#f43f5e;">
                🗑️ Hapus Target
              </button>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="closeLiDetailModalFooterBtn">Tutup</button>
          </div>

        </div>
      </div>
    `;
  }

  public async open(
    char: Character,
    targetIdx: number,
    onUpdate: () => void,
    onDelete: () => void
  ): Promise<void> {
    this.currentCharacter = char;
    this.targetIdx = targetIdx;
    this.onUpdateCallback = onUpdate;
    this.onDeleteCallback = onDelete;

    const targets = char.targets || [];
    this.currentTarget = targets[targetIdx] || null;
    if (!this.currentTarget) return;

    this.modalEl = document.getElementById("loveInterestDetailModal");
    if (!this.modalEl) return;

    this.modalEl.style.display = "flex";

    // Muat data dinamis dari Supabase DB / local compendium
    const allInterests = await fetchDynamicLoveInterests();
    this.resolvedLi = matchTargetToLoveInterest(this.currentTarget, allInterests);

    // Jika belum ketemu di list gabungan, coba ambil detail spesifik
    if (!this.resolvedLi && (this.currentTarget.slug || this.currentTarget.name)) {
      this.resolvedLi = await fetchDynamicLoveInterestDetail(this.currentTarget.slug || this.currentTarget.name);
    }

    this.populateModal();
    this.attachEvents();
  }

  public close(): void {
    if (this.modalEl) {
      this.modalEl.style.display = "none";
    }
  }

  private populateModal(): void {
    const t = this.currentTarget;
    const li = this.resolvedLi;
    if (!t) return;

    // Avatar
    const avatarEl = document.getElementById("liDetailAvatar") as HTMLImageElement;
    const avatarSrc =
      t.avatar_url ||
      li?.avatar_url ||
      `/portraits/${li?.slug || ''}.png` ||
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(t.name)}`;
    if (avatarEl) {
      avatarEl.src = avatarSrc;
      avatarEl.onerror = () => {
        avatarEl.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(t.name)}`;
      };
    }

    // Name & Kanji
    const nameEl = document.getElementById("liDetailName");
    const furiganaEl = document.getElementById("liDetailFurigana");
    if (nameEl) nameEl.textContent = li?.name || t.name;
    if (furiganaEl) {
      furiganaEl.textContent = li?.furigana || (li?.nickname?.length ? `Julukan: ${li.nickname.join(", ")}` : "");
      furiganaEl.style.display = (li?.furigana || li?.nickname?.length) ? "block" : "none";
    }

    // Badges
    const classBadgeEl = document.getElementById("liDetailClassBadge");
    if (classBadgeEl) {
      classBadgeEl.textContent = li?.class_room || t.class_room || "SMA";
    }

    const statusBadgeEl = document.getElementById("liDetailStatusBadge");
    if (statusBadgeEl) {
      statusBadgeEl.textContent = t.status || "Secret Crush";
    }

    const badgesGroupEl = document.getElementById("liDetailBadgesGroup");
    if (badgesGroupEl) {
      badgesGroupEl.innerHTML = `
        ${li?.class_room ? `<span class="badge" style="background:rgba(255,255,255,0.08);padding:2px 8px;font-size:0.75rem;border-radius:var(--radius-full);color:var(--text-main);">${escapeHtml(li.class_room)}</span>` : ""}
        ${li?.club ? `<span class="badge" style="background:rgba(234,179,8,0.15);color:#fde047;border:1px solid rgba(234,179,8,0.4);padding:2px 8px;font-size:0.75rem;border-radius:var(--radius-full);">Klub ${escapeHtml(li.club)}</span>` : ""}
        ${li?.archetype ? `<span class="badge" style="background:rgba(225,29,72,0.15);color:var(--rose-light);border:1px solid rgba(225,29,72,0.4);padding:2px 8px;font-size:0.75rem;border-radius:var(--radius-full);">${escapeHtml(li.archetype)}</span>` : ""}
        ${li?.mbti ? `<span class="badge" style="background:rgba(96,165,250,0.15);color:#93c5fd;padding:2px 8px;font-size:0.75rem;border-radius:var(--radius-full);">${escapeHtml(li.mbti)}</span>` : ""}
      `;
    }

    // Tagline
    const taglineBox = document.getElementById("liDetailTaglineBox");
    if (taglineBox) {
      if (li?.tagline) {
        taglineBox.style.display = "block";
        taglineBox.textContent = `"${li.tagline}"`;
      } else {
        taglineBox.style.display = "none";
      }
    }

    // Hearts & Milestones
    this.renderHeartsAndMilestone(t.affection || 1);

    // Gifts
    const favGiftsEl = document.getElementById("liDetailGiftsFav");
    const normGiftsEl = document.getElementById("liDetailGiftsNormal");
    const disGiftsEl = document.getElementById("liDetailGiftsDisliked");

    if (favGiftsEl) {
      favGiftsEl.textContent = li?.gifts?.favorite?.length ? li.gifts.favorite.join(", ") : "Barang yang diberikan dengan perhatian tulus.";
    }
    if (normGiftsEl) {
      normGiftsEl.textContent = li?.gifts?.normal?.length ? li.gifts.normal.join(", ") : "Makanan ringan, minuman kaleng, atau perlengkapan belajar.";
    }
    if (disGiftsEl) {
      disGiftsEl.textContent = li?.gifts?.disliked?.length ? li.gifts.disliked.join(", ") : "Barang palsu murah atau sesuatu yang mengabaikan perasaannya.";
    }

    // Date spots
    const spotsListEl = document.getElementById("liDetailDateSpotsList");
    if (spotsListEl) {
      if (li?.date_spots?.length) {
        spotsListEl.innerHTML = li.date_spots.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
      } else {
        spotsListEl.innerHTML = `
          <li>Atap Sekolah Saat Senja — Tempat hening menikmati angin sore berdua.</li>
          <li>Taman Belakang Gedung Sekolah — Duduk di bangku kayu di bawah pohon rindang.</li>
          <li>Kedai Minuman Dekat Stasiun — Berbagi obrolan santai sepulang sekolah.</li>
        `;
      }
    }

    // Personality & Flaws
    const dereEl = document.getElementById("liDetailDerePattern");
    const flawsEl = document.getElementById("liDetailFlaws");
    if (dereEl) {
      dereEl.textContent = li?.personality?.dere_pattern || li?.archetype || "Hangat dan penuh perhatian.";
    }
    if (flawsEl) {
      flawsEl.textContent = li?.personality?.flaws || "Menyimpan keraguan batin yang menunggu diperhatikan.";
    }

    // Secret notes & status select
    const statusSelect = document.getElementById("liDetailEditStatusSelect") as HTMLSelectElement;
    const customStatusInput = document.getElementById("liDetailEditCustomStatusInput") as HTMLInputElement;
    const secretNotesArea = document.getElementById("liDetailSecretNotesTextarea") as HTMLTextAreaElement;

    if (secretNotesArea) {
      secretNotesArea.value = t.secret || "";
    }

    if (statusSelect) {
      const knownStatuses = ["Secret Crush", "Rival", "Teman Sebangku", "Sahabat Masa Kecil", "Kagum dari Jauh", "Sering Berpapasan", "Calon Pacar", "Kekasih (Canon Lovers)"];
      if (knownStatuses.includes(t.status)) {
        statusSelect.value = t.status;
        if (customStatusInput) customStatusInput.style.display = "none";
      } else {
        statusSelect.value = "CUSTOM";
        if (customStatusInput) {
          customStatusInput.style.display = "block";
          customStatusInput.value = t.status || "";
        }
      }
    }

    // Codex Button
    const codexBtn = document.getElementById("btnOpenFullCodexPage");
    if (codexBtn) {
      if (li?.slug) {
        codexBtn.style.display = "inline-flex";
      } else {
        codexBtn.style.display = "none";
      }
    }
  }

  private renderHeartsAndMilestone(hearts: number): void {
    const h = Math.max(1, Math.min(10, hearts));
    const scoreEl = document.getElementById("liDetailHeartsScore");
    if (scoreEl) scoreEl.textContent = `(${h}/10 ♥)`;

    // Render 10 dots
    const dotsContainer = document.getElementById("liDetailHeartDotsContainer");
    if (dotsContainer) {
      let dotsHtml = "";
      for (let i = 1; i <= 10; i++) {
        dotsHtml += `
          <span
            class="heart-dot ${i <= h ? 'active' : 'empty'}"
            data-h="${i}"
            style="color:${i <= h ? 'var(--rose-primary)' : 'rgba(255,255,255,0.2)'};transition:transform 0.15s ease;"
            title="Ubah ke ${i}/10 ♥"
          >♥</span>
        `;
      }
      dotsContainer.innerHTML = dotsHtml;

      // Click event for heart dots
      dotsContainer.querySelectorAll(".heart-dot").forEach((dot) => {
        dot.addEventListener("click", async (e: any) => {
          const val = parseInt(e.currentTarget.dataset.h, 10);
          await this.updateHearts(val);
        });
      });
    }

    // Active milestone highlight
    const li = this.resolvedLi;
    const currentMilestone = li ? getCurrentMilestone(li, h) : null;
    const mTitleEl = document.getElementById("liDetailCurrentMilestoneTitle");
    const mDescEl = document.getElementById("liDetailCurrentMilestoneDesc");

    if (mTitleEl) {
      mTitleEl.textContent = currentMilestone ? `${currentMilestone.range}: ${currentMilestone.title}` : `${h}/10 ♥: Tahap Progresi Hubungan`;
    }
    if (mDescEl) {
      mDescEl.textContent = currentMilestone?.description || "Hubungan asmara terus bertumbuh seiring waktu yang dihabiskan bersama.";
    }

    // All milestones list
    const allListEl = document.getElementById("liDetailAllMilestonesList");
    if (allListEl) {
      const milestones = li?.heart_meter?.milestones || [];
      if (milestones.length > 0) {
        allListEl.innerHTML = milestones.map((m) => {
          const isActive = h >= m.minHearts && h <= m.maxHearts;
          return `
            <div style="background:${isActive ? 'rgba(225,29,72,0.12)' : 'rgba(0,0,0,0.15)'};border:${isActive ? '1px solid var(--rose-primary)' : '1px solid transparent'};padding:6px 10px;border-radius:var(--radius-sm);">
              <div style="font-weight:700;color:${isActive ? 'var(--amber-gold)' : 'var(--text-dim)'};display:flex;align-items:center;gap:6px;">
                ${isActive ? '<span style="color:var(--rose-primary);">✦</span>' : ''}
                <span>${escapeHtml(m.range)}: ${escapeHtml(m.title)}</span>
              </div>
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">
                ${escapeHtml(m.description)}
              </div>
            </div>
          `;
        }).join("");
      } else {
        allListEl.innerHTML = `<span style="color:var(--text-muted);font-size:0.75rem;">Panduan milestone standar otomatis aktif sesuai tingkatan hati.</span>`;
      }
    }
  }

  private async updateHearts(newVal: number): Promise<void> {
    if (!this.currentCharacter || !this.currentTarget || this.targetIdx === -1) return;

    this.currentTarget.affection = newVal;
    this.currentCharacter.targets![this.targetIdx].affection = newVal;
    this.renderHeartsAndMilestone(newVal);

    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
    showToast(`Affection diperbarui menjadi ${newVal}/10 ♥`, "success");
  }

  private attachEvents(): void {
    // Close
    document.getElementById("closeLiDetailModalBtn")?.addEventListener("click", () => this.close());
    document.getElementById("closeLiDetailModalFooterBtn")?.addEventListener("click", () => this.close());

    // Status select toggle custom
    const statusSelect = document.getElementById("liDetailEditStatusSelect") as HTMLSelectElement;
    const customStatusInput = document.getElementById("liDetailEditCustomStatusInput") as HTMLInputElement;
    statusSelect?.addEventListener("change", () => {
      if (statusSelect.value === "CUSTOM") {
        if (customStatusInput) customStatusInput.style.display = "block";
      } else {
        if (customStatusInput) customStatusInput.style.display = "none";
      }
    });

    // Save Notes Button
    document.getElementById("btnSaveLiDetailNotes")?.addEventListener("click", () => {
      if (!this.currentCharacter || !this.currentTarget || this.targetIdx === -1) return;

      const notes = (document.getElementById("liDetailSecretNotesTextarea") as HTMLTextAreaElement)?.value || "";
      let status = statusSelect?.value || "Secret Crush";
      if (status === "CUSTOM") {
        status = customStatusInput?.value.trim() || "Secret Crush";
      }

      this.currentTarget.secret = notes;
      this.currentTarget.status = status;
      this.currentCharacter.targets![this.targetIdx].secret = notes;
      this.currentCharacter.targets![this.targetIdx].status = status;

      const statusBadgeEl = document.getElementById("liDetailStatusBadge");
      if (statusBadgeEl) statusBadgeEl.textContent = status;

      if (this.onUpdateCallback) {
        this.onUpdateCallback();
      }
      showToast("Catatan rahasia & status target berhasil disimpan!", "success");
    });

    // Open Codex Link
    document.getElementById("btnOpenFullCodexPage")?.addEventListener("click", () => {
      const slug = this.resolvedLi?.slug || this.currentTarget?.slug;
      if (slug) {
        this.close();
        router.navigate(`/codex/c/${slug}`);
      }
    });

    // Delete Target
    document.getElementById("btnDeleteTargetFromSheet")?.addEventListener("click", () => {
      if (!this.currentCharacter || this.targetIdx === -1) return;
      const targetName = this.currentTarget?.name || "Target";
      if (confirm(`Apakah kamu yakin ingin menghapus "${targetName}" dari daftar target karakter ini?`)) {
        this.currentCharacter.targets!.splice(this.targetIdx, 1);
        this.close();
        if (this.onDeleteCallback) {
          this.onDeleteCallback();
        }
        showToast(`Target "${targetName}" telah dihapus.`, "info");
      }
    });
  }
}

export const loveInterestDetailModal = new LoveInterestDetailModal();
