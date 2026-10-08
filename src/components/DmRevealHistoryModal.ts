import { dmGetLog, dmLockAll } from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { showToast } from "./Toast";
import type { DmRevealLogEntry } from "../types";

class DmRevealHistoryModal {
  private modalEl: HTMLElement | null = null;
  private onStateChange: (() => void) | null = null;

  render(): string {
    return `
      <div id="dmRevealHistoryModal" class="modal-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(6px);padding:1rem;">
        <div class="modal-card" style="background:var(--bg-card);border:1px solid var(--amber-gold);box-shadow:0 12px 40px rgba(0,0,0,0.8);border-radius:var(--radius-lg);max-width:700px;width:100%;padding:2rem;max-height:85vh;display:flex;flex-direction:column;position:relative;">
          <button id="closeDmHistoryModalBtn" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">&times;</button>

          <div style="margin-bottom:1.25rem;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="font-size:1.3rem;">📜</span>
              <h2 style="font-family:var(--font-heading);color:var(--amber-gold);margin:0;font-size:1.4rem;">
                Riwayat & Log Penyingkapan (DM Audit Trail)
              </h2>
            </div>
            <p style="color:var(--text-muted);font-size:0.85rem;margin:0;">
              Catatan kronologis seluruh aksi penyingkapan dan penguncian informasi karakter oleh Game Master.
            </p>
          </div>

          <!-- Controls Bar -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;gap:10px;flex-wrap:wrap;">
            <div style="display:flex;gap:8px;">
              <button id="refreshDmHistoryBtn" class="btn btn-xs btn-secondary" style="display:flex;align-items:center;gap:4px;">
                <span>🔄 Segarkan Log</span>
              </button>
            </div>
            <div>
              <button id="dmEmergencyLockAllBtn" class="btn btn-xs btn-secondary" style="border-color:var(--rose-primary);color:var(--rose-light);">
                ⚠️ Kunci Seluruh Kamus Karakter
              </button>
            </div>
          </div>

          <!-- Log Entries Container -->
          <div id="dmHistoryEntriesList" style="flex:1;overflow-y:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-input);padding:0.75rem;display:flex;flex-direction:column;gap:8px;">
            <div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem;">
              Memuat log penyingkapan...
            </div>
          </div>

          <div style="margin-top:1.25rem;text-align:right;">
            <button id="closeDmHistoryBtnBottom" class="btn btn-secondary btn-sm" style="padding:0.5rem 1.25rem;">
              Tutup
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(onStateChange?: () => void) {
    this.modalEl = document.getElementById("dmRevealHistoryModal");
    this.onStateChange = onStateChange || null;

    document.getElementById("closeDmHistoryModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("closeDmHistoryBtnBottom")?.addEventListener("click", () => this.hide());
    document.getElementById("refreshDmHistoryBtn")?.addEventListener("click", () => this.loadLogs());

    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    document.getElementById("dmEmergencyLockAllBtn")?.addEventListener("click", async () => {
      const confirmed = confirm("PERINGATAN: Apakah Anda yakin ingin MENGUNCI KEMBALI SELURUH KARAKTER di seluruh sekolah? Seluruh pemain tidak akan bisa melihat informasi rahasia apa pun sampai dibuka kembali.");
      if (confirmed) {
        const token = dmAuthStore.getToken();
        if (token) {
          try {
            await dmLockAll(token);
            showToast("🔒 Seluruh Kamus Karakter berhasil dikunci kembali!", "info");
            await this.loadLogs();
            if (this.onStateChange) this.onStateChange();
          } catch (e: any) {
            showToast(`Gagal: ${e.message}`, "error");
          }
        }
      }
    });
  }

  public async open() {
    if (!this.modalEl) this.modalEl = document.getElementById("dmRevealHistoryModal");
    if (!this.modalEl) return;

    this.modalEl.style.display = "flex";
    await this.loadLogs();
  }

  public hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  private async loadLogs() {
    const listEl = document.getElementById("dmHistoryEntriesList");
    if (!listEl) return;

    const token = dmAuthStore.getToken();
    if (!token) {
      listEl.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--rose-primary);">Sesi DM tidak aktif. Silakan login terlebih dahulu.</div>`;
      return;
    }

    listEl.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);">Memuat riwayat...</div>`;

    try {
      const logs = await dmGetLog(token);
      if (logs.length === 0) {
        listEl.innerHTML = `
          <div style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.85rem;">
            Belum ada aktivitas penyingkapan karakter yang tercatat.
          </div>
        `;
        return;
      }

      listEl.innerHTML = logs.map(entry => {
        const dateStr = entry.created_at ? new Date(entry.created_at).toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) : "-";

        const isReveal = entry.action.includes("REVEAL") || entry.action.includes("INTRODUCE");
        const actionLabel = this.formatActionName(entry.action);

        return `
          <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.6rem 0.85rem;font-size:0.8rem;gap:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:${isReveal ? "rgba(16,185,129,0.15)" : "rgba(225,29,72,0.15)"};color:${isReveal ? "var(--green-health)" : "var(--rose-light)"};border:1px solid ${isReveal ? "var(--green-health)" : "var(--rose-primary)"};padding:2px 8px;border-radius:var(--radius-full);font-size:0.7rem;font-weight:700;">
                ${actionLabel}
              </span>
              <strong style="color:var(--text-main);">${entry.character_slug || entry.character_id || "Seluruh Codex"}</strong>
              ${entry.section_key ? `<span style="color:var(--amber-gold);">[${entry.section_key}]</span>` : ""}
              ${entry.tier ? `<span style="color:var(--text-muted);">(Tier ${entry.tier})</span>` : ""}
            </div>
            <div style="color:var(--text-muted);font-size:0.75rem;white-space:nowrap;">
              ${dateStr}
            </div>
          </div>
        `;
      }).join("");

    } catch (e: any) {
      listEl.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--rose-primary);">Gagal memuat log: ${e.message}</div>`;
    }
  }

  private formatActionName(action: string): string {
    switch (action) {
      case "INTRODUCE_CHARACTER": return "🌸 PERKENALKAN (TIER 1)";
      case "REVEAL_SECTION": return "✓ BUKA SECTION";
      case "LOCK_SECTION": return "🔒 KUNCI SECTION";
      case "REVEAL_TIER": return "✓ BUKA TIER";
      case "LOCK_TIER": return "🔒 KUNCI TIER";
      case "LOCK_CHARACTER_ALL": return "🔒 KUNCI KARAKTER";
      case "LOCK_ENTIRE_CODEX": return "⚠️ KUNCI SEMUA";
      default: return action;
    }
  }
}

export const dmRevealHistoryModal = new DmRevealHistoryModal();
