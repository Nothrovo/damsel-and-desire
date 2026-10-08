import { dmAuthStore } from "../store/dmAuthStore";
import { dmRevealHistoryModal } from "./DmRevealHistoryModal";
import { codexCharacterEditorModal } from "./CodexCharacterEditorModal";
import { showToast } from "./Toast";

export function renderDmCodexBar(): string {
  if (!dmAuthStore.isAuthenticated()) return "";

  const isPreview = dmAuthStore.isPlayerPreview;

  return `
    <div id="dmCodexFloatingBar" class="dm-floating-bar" style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(24,34,52,0.95);border:1.5px solid ${isPreview ? "var(--teal-accent)" : "var(--amber-gold)"};box-shadow:0 8px 30px rgba(0,0,0,0.6), 0 0 15px ${isPreview ? "rgba(6,182,212,0.3)" : "rgba(245,158,11,0.25)"};border-radius:var(--radius-full);padding:10px 22px;display:flex;align-items:center;gap:14px;z-index:9000;backdrop-filter:blur(10px);font-family:var(--font-heading);font-size:0.85rem;color:var(--text-main);flex-wrap:wrap;justify-content:center;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:1.1rem;">👑</span>
        <strong style="color:${isPreview ? "var(--teal-accent)" : "var(--amber-gold)"};letter-spacing:0.04em;">
          ${isPreview ? "Mode DM (Pratinjau Pemain)" : "Mode Game Master (DM)"}
        </strong>
      </div>

      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <button id="openDmAddCharBtn" class="btn btn-xs btn-primary" style="background:var(--amber-gold);border:1px solid var(--amber-gold);color:#0d111a;padding:5px 12px;border-radius:var(--radius-full);cursor:pointer;display:flex;align-items:center;gap:4px;font-weight:700;">
          <span>➕ Karakter Baru</span>
        </button>

        <button id="openDmHistoryModalBtn" class="btn btn-xs btn-secondary" style="background:rgba(245,158,11,0.15);border:1px solid var(--amber-gold);color:var(--amber-gold);padding:5px 12px;border-radius:var(--radius-full);cursor:pointer;display:flex;align-items:center;gap:4px;">
          <span>📜 Riwayat</span>
        </button>

        <button id="toggleDmPlayerPreviewBtn" class="btn btn-xs" style="background:${isPreview ? "rgba(6,182,212,0.15)" : "rgba(245,158,11,0.15)"};border:1px solid ${isPreview ? "var(--teal-accent)" : "var(--amber-gold)"};color:var(--text-main);padding:5px 12px;border-radius:var(--radius-full);cursor:pointer;display:flex;align-items:center;gap:6px;">
          <span>${isPreview ? "👑 Kontrol DM" : "👁️ Lihat Sebagai Pemain"}</span>
        </button>

        <button id="logoutDmBtn" class="btn btn-xs btn-secondary" style="background:rgba(225,29,72,0.15);border:1px solid var(--rose-primary);color:var(--rose-light);padding:5px 12px;border-radius:var(--radius-full);cursor:pointer;">
          🚪 Keluar DM
        </button>
      </div>
    </div>
  `;
}

export function attachDmCodexBarEvents(onStateChange?: () => void) {
  document.getElementById("openDmAddCharBtn")?.addEventListener("click", () => {
    codexCharacterEditorModal.openForCreate("class_1_1", () => {
      if (onStateChange) onStateChange();
    });
  });

  document.getElementById("openDmHistoryModalBtn")?.addEventListener("click", () => {
    dmRevealHistoryModal.open();
  });

  document.getElementById("toggleDmPlayerPreviewBtn")?.addEventListener("click", () => {
    const isPreview = dmAuthStore.togglePlayerPreview();
    showToast(isPreview ? "Beralih ke mode pratinjau pemain." : "Kembali ke mode kontrol DM.", "info");
    if (onStateChange) onStateChange();
  });

  document.getElementById("logoutDmBtn")?.addEventListener("click", async () => {
    await dmAuthStore.logout();
    showToast("Telah keluar dari mode Game Master.", "info");
    if (onStateChange) onStateChange();
  });
}

