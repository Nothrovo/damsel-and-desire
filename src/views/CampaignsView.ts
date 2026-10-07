import { listMyCampaigns, createCampaign, joinCampaignByCode } from "../api/campaigns";
import { showToast } from "../components/Toast";
import { router } from "../router/router";
import type { Campaign } from "../types";

export async function renderCampaignsView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active" style="max-width:1100px;margin:2rem auto;padding:0 1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
        <div>
          <h1 style="font-family:var(--font-heading);margin-bottom:0.35rem;">⚔️ Campaigns TRPG</h1>
          <p style="color:var(--text-muted);font-size:0.9rem;">Kelola kelompok bermain SMA Jepang Anda, pantau lemparan dadu realtime, dan nikmati petualangan bersama.</p>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-secondary" id="btnOpenJoinModal">🔑 Gabung via Kode</button>
          <button class="btn btn-primary" id="btnOpenCreateModal">+ Buat Campaign Baru</button>
        </div>
      </div>

      <div id="campaignsGrid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.5rem;">
        <div style="color:var(--text-muted);padding:2rem;text-align:center;grid-column:1/-1;">Memuat daftar campaign...</div>
      </div>

      <!-- Modal: Buat Campaign -->
      <div id="createCampaignModal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Buat Campaign Baru</h3>
            <button class="modal-close-btn" id="closeCreateModalBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="inputCampaignName">Nama Sesi / Campaign:</label>
              <input type="text" id="inputCampaignName" class="input-text" placeholder="misal: Festival Asmara Musim Panas 2026" required>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem;">Sebagai pembuat campaign, Anda akan otomatis berperan sebagai <strong>Game Master (DM)</strong> dengan hak akses penuh ke rahasia dan affection meter.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelCreateModalBtn">Batal</button>
            <button class="btn btn-primary" id="submitCreateCampaignBtn">Buat Sekarang</button>
          </div>
        </div>
      </div>

      <!-- Modal: Gabung via Kode -->
      <div id="joinCampaignModal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3>🔑 Gabung Campaign</h3>
            <button class="modal-close-btn" id="closeJoinModalBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="inputJoinCode">Masukkan 6-Karakter Join Code:</label>
              <input type="text" id="inputJoinCode" class="input-text" placeholder="misal: K9X2P4" maxlength="6" style="text-transform:uppercase;letter-spacing:4px;font-size:1.2rem;text-align:center;" required>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelJoinModalBtn">Batal</button>
            <button class="btn btn-primary" id="submitJoinCampaignBtn">Gabung Sesi</button>
          </div>
        </div>
      </div>
    </section>
  `;

  attachCampaignsEvents();
  await loadCampaignsList();
}

function attachCampaignsEvents() {
  const createModal = document.getElementById("createCampaignModal");
  const joinModal = document.getElementById("joinCampaignModal");

  document.getElementById("btnOpenCreateModal")?.addEventListener("click", () => {
    if (createModal) createModal.style.display = "flex";
  });
  document.getElementById("closeCreateModalBtn")?.addEventListener("click", () => {
    if (createModal) createModal.style.display = "none";
  });
  document.getElementById("cancelCreateModalBtn")?.addEventListener("click", () => {
    if (createModal) createModal.style.display = "none";
  });

  document.getElementById("btnOpenJoinModal")?.addEventListener("click", () => {
    if (joinModal) joinModal.style.display = "flex";
  });
  document.getElementById("closeJoinModalBtn")?.addEventListener("click", () => {
    if (joinModal) joinModal.style.display = "none";
  });
  document.getElementById("cancelJoinModalBtn")?.addEventListener("click", () => {
    if (joinModal) joinModal.style.display = "none";
  });

  document.getElementById("submitCreateCampaignBtn")?.addEventListener("click", async () => {
    const input = document.getElementById("inputCampaignName") as HTMLInputElement;
    const name = input?.value.trim();
    if (!name) {
      showToast("Nama campaign tidak boleh kosong.", "warning");
      return;
    }

    try {
      const camp = await createCampaign(name);
      showToast(`Campaign "${camp.name}" berhasil dibuat!`, "success");
      if (createModal) createModal.style.display = "none";
      router.navigate(`/campaigns/${camp.id}`);
    } catch (err: any) {
      showToast(`Gagal membuat campaign: ${err.message}`, "error");
    }
  });

  document.getElementById("submitJoinCampaignBtn")?.addEventListener("click", async () => {
    const input = document.getElementById("inputJoinCode") as HTMLInputElement;
    const code = input?.value.trim().toUpperCase();
    if (!code || code.length !== 6) {
      showToast("Kode join harus berupa 6 karakter.", "warning");
      return;
    }

    try {
      const res = await joinCampaignByCode(code);
      showToast(`Berhasil bergabung ke campaign "${res.name}"!`, "success");
      if (joinModal) joinModal.style.display = "none";
      router.navigate(`/campaigns/${res.campaignId}`);
    } catch (err: any) {
      showToast(`Gagal bergabung: ${err.message}`, "error");
    }
  });
}

async function loadCampaignsList() {
  const gridEl = document.getElementById("campaignsGrid");
  if (!gridEl) return;

  try {
    const campaigns: Campaign[] = await listMyCampaigns();

    if (campaigns.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
          <div style="font-size:2.5rem;margin-bottom:0.75rem;">📜</div>
          <h3>Belum Mengikuti Campaign Apa Pun</h3>
          <p style="color:var(--text-muted);margin-bottom:1.5rem;">Buat campaign baru sebagai DM atau minta Join Code dari teman Anda.</p>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = campaigns.map((camp) => `
      <div class="campaign-card" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <h3 style="font-size:1.15rem;font-weight:700;margin:0;">${camp.name}</h3>
            <span style="background:var(--bg-surface);border:1px solid var(--border-subtle);font-size:0.75rem;padding:2px 8px;border-radius:4px;letter-spacing:1px;font-family:monospace;color:var(--amber-gold);">
              ${camp.join_code}
            </span>
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1.25rem;">
            Dibuat pada ${new Date(camp.created_at).toLocaleDateString("id-ID")}
          </p>
        </div>

        <div style="display:flex;gap:8px;">
          <a href="/campaigns/${camp.id}" class="btn btn-sm btn-primary" style="flex:1;text-align:center;">
            Masuk Sesi
          </a>
        </div>
      </div>
    `).join("");
  } catch (err: any) {
    gridEl.innerHTML = `<div style="grid-column:1/-1;color:var(--rose-light);text-align:center;">Gagal memuat campaign: ${err.message}</div>`;
  }
}
