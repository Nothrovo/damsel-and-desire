import { updateCharacterDirect } from "../api/characters";
import { characterStore } from "../store/characterStore";
import { showToast } from "./Toast";
import { ALL_ACHIEVEMENTS } from "../data/achievementCompendium";
import { ALL_FEATS } from "../data/featCompendium";
import { grantFeat } from "../rules/progression";
import type { Character, AchievementCompendium, FeatDefinition } from "../types";

export class AchievementAwardModal {
  private modalEl: HTMLElement | null = null;

  render(): string {
    return `
      <div id="achievementAwardModal" class="modal-overlay" style="display:none;z-index:9999;">
        <div class="modal-card" style="max-width:850px;width:95%;max-height:90vh;display:flex;flex-direction:column;">
          <div class="modal-header" style="flex-shrink:0;">
            <h3>🏆 Buka Pencapaian / Achievement (DM Mode)</h3>
            <button class="modal-close-btn" id="closeAchievementAwardBtn">&times;</button>
          </div>
          <div style="padding:0.75rem 1.25rem;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);font-size:0.85rem;color:var(--text-muted);flex-shrink:0;">
            Pencapaian dianugerahkan oleh DM ketika karakter memenuhi prasyarat cerita naratif di meja permainan. Setiap achievement memberikan <strong>Achievement Feat (+2 Stat Cap 30)</strong> beserta penalti naratifnya.
          </div>
          <div class="modal-body" id="achievementAwardModalBody" style="flex:1;overflow-y:auto;padding:1.25rem;">
            <!-- Achievements list injected dynamically -->
          </div>
          <div class="modal-footer" style="flex-shrink:0;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="cancelAchievementAwardBtn">Tutup</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("achievementAwardModal");
    document.getElementById("closeAchievementAwardBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelAchievementAwardBtn")?.addEventListener("click", () => this.hide());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });
  }

  show() {
    this.renderAchievementsList();
    if (this.modalEl) this.modalEl.style.display = "flex";
  }

  hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  private renderAchievementsList() {
    const bodyEl = document.getElementById("achievementAwardModalBody");
    if (!bodyEl) return;

    const char = characterStore.currentCharacter;
    if (!char) {
      bodyEl.innerHTML = `<p style="text-align:center;color:var(--text-muted);">Karakter tidak ditemukan.</p>`;
      return;
    }

    const featMap = new Map<string, FeatDefinition>(ALL_FEATS.map(f => [f.id, f]));
    const earnedAchIds = new Set((char.achievements || []).map(a => a.achievementId));
    const takenFeatIds = new Set((char.feats || []).map(f => f.featId));

    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${ALL_ACHIEVEMENTS.map(ach => {
          const isUnlocked = earnedAchIds.has(ach.id) || takenFeatIds.has(ach.feat_id);
          const feat = featMap.get(ach.feat_id);

          return `
            <div class="card" style="border:1px solid ${isUnlocked ? 'var(--green-health)' : 'var(--border-card)'};background:${isUnlocked ? 'rgba(16,185,129,0.06)' : 'var(--bg-card)'};padding:1.15rem;border-radius:var(--radius-md);">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
                <div style="flex:1;min-width:240px;">
                  <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;">
                    <span style="font-size:1.25rem;">${ach.badge_icon || '🏆'}</span>
                    <h4 style="margin:0;color:var(--text-primary);font-size:1.05rem;font-weight:800;">${ach.name}</h4>
                    ${isUnlocked ? `
                      <span class="badge" style="background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);font-size:0.65rem;padding:0.15rem 0.45rem;border-radius:4px;font-weight:800;">✓ TERBUKA</span>
                    ` : `
                      <span class="badge" style="background:rgba(148,163,184,0.15);color:#94a3b8;font-size:0.65rem;padding:0.15rem 0.45rem;border-radius:4px;">🔒 TERKUNCI</span>
                    `}
                  </div>

                  <p style="font-size:0.85rem;color:var(--text-muted);margin:0.25rem 0 0.5rem 0;line-height:1.4;">
                    ${ach.description}
                  </p>

                  <div style="font-size:0.8rem;background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);margin-bottom:0.5rem;">
                    <strong>📜 Syarat Cerita:</strong> <span style="color:var(--rose-light);">${ach.requirement}</span>
                  </div>

                  ${feat ? `
                    <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.4;">
                      <strong>🎁 Hadiah Feat:</strong> <span style="color:#facc15;font-weight:700;">${feat.name}</span>
                      ${feat.bonusAbility ? ` (+${feat.bonusAbility.value} ${feat.bonusAbility.ability.toUpperCase()}, Cap 30)` : ''}
                      ${(feat.drawbacks?.penaltyText || feat.drawbackText) ? `
                        <div style="margin-top:4px;color:#fca5a5;">
                          <strong>⚠️ Penalti:</strong> ${feat.drawbacks?.penaltyText || feat.drawbackText}
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>

                <div style="flex-shrink:0;">
                  ${isUnlocked ? `
                    <button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;cursor:not-allowed;">Sudah Diperoleh</button>
                  ` : `
                    <button class="btn btn-accent btn-sm btn-award-ach" data-ach-id="${ach.id}" data-feat-id="${ach.feat_id}">
                      🏆 Anugerahkan
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;

    // Attach click listeners to award buttons
    bodyEl.querySelectorAll(".btn-award-ach").forEach(btn => {
      btn.addEventListener("click", () => {
        const achId = btn.getAttribute("data-ach-id");
        const featId = btn.getAttribute("data-feat-id");
        if (achId && featId) {
          this.awardAchievement(achId, featId);
        }
      });
    });
  }

  private async awardAchievement(achievementId: string, featId: string) {
    const char = characterStore.currentCharacter;
    if (!char) return;

    const ach = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return;

    if (!confirm(`Apakah Anda yakin ingin menganugerahkan Achievement "${ach.name}" kepada ${char.name}?`)) {
      return;
    }

    try {
      showToast(`Menganugerahkan achievement ${ach.name}...`, "info");

      const grantRes = grantFeat(char, "achievement", {
        featId,
        sourceRef: ach.id,
        notes: ach.name
      });

      const updatedChar = grantRes.character;

      await updateCharacterDirect(updatedChar.id, {
        abilities: updatedChar.abilities,
        feats: updatedChar.feats,
        feat_grants: updatedChar.featGrants,
        achievements: updatedChar.achievements,
        vitals: updatedChar.vitals,
        changelog: updatedChar.changelog
      }, updatedChar.version);

      characterStore.setCurrentCharacter(updatedChar);

      showToast(`🎉 Achievement "${ach.name}" berhasil dianugerahkan!`, "success");
      this.renderAchievementsList();
      window.dispatchEvent(new CustomEvent("characterUpdated", { detail: updatedChar }));
    } catch (err: any) {
      showToast(`Gagal menganugerahkan achievement: ${err.message}`, "error");
    }
  }
}

export const achievementAwardModal = new AchievementAwardModal();
