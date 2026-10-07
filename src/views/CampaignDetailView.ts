import { getCampaign, getCampaignMembers, getUserRoleInCampaign } from "../api/campaigns";
import { listCampaignCharacters } from "../api/characters";
import { getRollLogs, rollDiceRpc } from "../api/gameRpc";
import { campaignStore } from "../store/campaignStore";
import { campaignRealtime } from "../realtime/campaignRealtime";
import { showToast } from "../components/Toast";
import type { Campaign, CampaignMember, Character, RollLogEntry } from "../types";

let currentCampaignId: string | null = null;
let currentCampaign: Campaign | null = null;
let membersList: CampaignMember[] = [];
let campaignCharacters: Character[] = [];
let rollLogsList: RollLogEntry[] = [];
let isDm: boolean = false;

export async function renderCampaignDetailView(params: Record<string, string>): Promise<void> {
  const campaignId = params.id;
  currentCampaignId = campaignId;

  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active" style="max-width:1200px;margin:2rem auto;padding:0 1.5rem;">
      <div id="campaignDetailHeader" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.5rem;margin-bottom:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <h1 style="font-family:var(--font-heading);margin:0;font-size:1.6rem;" id="campDetailTitle">Memuat Campaign...</h1>
              <span id="campRoleBadge" style="padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:700;">...</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;font-size:0.85rem;color:var(--text-muted);">
              <span>Join Code: <strong style="color:var(--amber-gold);cursor:pointer;letter-spacing:1px;font-family:monospace;" id="campCopyCodeBtn" title="Klik untuk menyalin">------</strong></span>
              <span>•</span>
              <span id="campMemberCount">0 Anggota</span>
            </div>
          </div>

          <div style="display:flex;gap:10px;" id="campHeaderActions">
            <a href="/characters/new?campaignId=${campaignId}" class="btn btn-primary btn-sm">+ Tambah Karakter</a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID: 2 COLUMNS (Characters Roster & Live Roll Log) -->
      <div style="display:grid;grid-template-columns:1fr 380px;gap:1.5rem;align-items:start;">
        <!-- Left: Roster Karakter -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h2 style="font-family:var(--font-heading);font-size:1.2rem;margin:0;">Roster Murid di Campaign</h2>
            <span id="campCharCount" style="font-size:0.85rem;color:var(--text-muted);">0 Karakter</span>
          </div>
          <div id="campCharGrid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:1rem;">
            <div style="color:var(--text-muted);padding:2rem;text-align:center;grid-column:1/-1;">Memuat murid...</div>
          </div>
        </div>

        <!-- Right: Live Shared Roll Log -->
        <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border-subtle);">
            <h3 style="margin:0;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:6px;">
              🎲 Live Roll Log
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;" title="Realtime Aktif"></span>
            </h3>
            <button class="btn btn-xs btn-secondary" id="btnQuickRollD20">Lempar d20</button>
          </div>

          <div id="campRollLogList" style="max-height:480px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
            <div style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:1.5rem;">Belum ada lemparan dadu tercatat.</div>
          </div>
        </div>
      </div>
    </section>
  `;

  await loadCampaignDetail(campaignId);
}

async function loadCampaignDetail(campaignId: string) {
  try {
    currentCampaign = await getCampaign(campaignId);
    if (!currentCampaign) {
      showToast("Campaign tidak ditemukan.", "error");
      return;
    }

    membersList = await getCampaignMembers(campaignId);
    const role = await getUserRoleInCampaign(campaignId);
    isDm = role === "dm";

    // Set campaign store active
    await campaignStore.setActiveCampaign(campaignId);

    // Update Header
    const titleEl = document.getElementById("campDetailTitle");
    const roleEl = document.getElementById("campRoleBadge");
    const codeEl = document.getElementById("campCopyCodeBtn");
    const memberCountEl = document.getElementById("campMemberCount");
    const headerActions = document.getElementById("campHeaderActions");

    if (titleEl) titleEl.textContent = currentCampaign.name;
    if (codeEl) {
      codeEl.textContent = currentCampaign.join_code;
      codeEl.onclick = () => {
        navigator.clipboard.writeText(currentCampaign!.join_code);
        showToast("Join Code disalin ke clipboard!", "info");
      };
    }
    if (memberCountEl) memberCountEl.textContent = `${membersList.length} Anggota`;

    if (roleEl) {
      if (isDm) {
        roleEl.textContent = "👑 Game Master (DM)";
        roleEl.style.background = "rgba(245, 158, 11, 0.15)";
        roleEl.style.color = "var(--amber-gold)";
        roleEl.style.border = "1px solid var(--amber-gold)";

        // Add DM Dashboard button to header
        if (headerActions) {
          headerActions.innerHTML = `
            <a href="/dm/${campaignId}" class="btn btn-secondary btn-sm" style="border:1px solid var(--amber-gold);color:var(--amber-gold);">
              👑 DM Command Center
            </a>
            <a href="/characters/new?campaignId=${campaignId}" class="btn btn-primary btn-sm">+ Tambah Karakter</a>
          `;
        }
      } else {
        roleEl.textContent = "🎒 Pemain (Player)";
        roleEl.style.background = "rgba(37, 99, 235, 0.15)";
        roleEl.style.color = "var(--navy-accent)";
        roleEl.style.border = "1px solid var(--navy-accent)";
      }
    }

    // Load Characters
    campaignCharacters = await listCampaignCharacters(campaignId);
    renderCampaignCharacters();

    // Load Roll Logs
    rollLogsList = await getRollLogs(campaignId, 30);
    renderRollLogs();

    // Setup Realtime per campaign
    setupCampaignRealtime(campaignId);

    // Quick roll d20 button
    document.getElementById("btnQuickRollD20")?.addEventListener("click", async () => {
      try {
        await rollDiceRpc(campaignId, null, "d20", "normal", "Quick Roll", 0);
      } catch (err: any) {
        showToast(`Gagal melempar dadu: ${err.message}`, "error");
      }
    });

  } catch (err: any) {
    console.error("Gagal memuat campaign detail:", err);
    showToast(`Error: ${err.message}`, "error");
  }
}

function renderCampaignCharacters() {
  const gridEl = document.getElementById("campCharGrid");
  const countEl = document.getElementById("campCharCount");
  if (!gridEl) return;

  if (countEl) countEl.textContent = `${campaignCharacters.length} Karakter`;

  if (campaignCharacters.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:2rem;background:var(--bg-input);border-radius:var(--radius-sm);color:var(--text-muted);">
        Belum ada karakter yang bergabung di campaign ini.<br>
        <a href="/characters/new?campaignId=${currentCampaignId}" style="color:var(--rose-light);margin-top:8px;display:inline-block;">+ Tambah Karakter Sekarang</a>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = campaignCharacters.map((c) => {
    const avatar = c.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.name}`;
    const ownerName = c.owner_profile?.display_name || "Pemain";

    return `
      <div style="background:var(--bg-surface);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:1rem;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">
          <img src="${avatar}" alt="${c.name}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid var(--border-subtle);">
          <div>
            <h4 style="margin:0;font-size:0.95rem;">${c.name}</h4>
            <span style="font-size:0.75rem;color:var(--text-muted);">Pemain: ${ownerName}</span>
          </div>
        </div>

        <div style="font-size:0.75rem;color:var(--amber-gold);margin-bottom:10px;">
          ${c.ekskul_id.toUpperCase()} • Lvl ${c.level}
        </div>

        <a href="/characters/${c.id}" class="btn btn-xs btn-primary" style="text-align:center;">Buka Sheet</a>
      </div>
    `;
  }).join("");
}

function renderRollLogs() {
  const listEl = document.getElementById("campRollLogList");
  if (!listEl) return;

  if (rollLogsList.length === 0) {
    listEl.innerHTML = `<div style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:1.5rem;">Belum ada lemparan dadu tercatat.</div>`;
    return;
  }

  listEl.innerHTML = rollLogsList.map((entry) => {
    const userName = entry.user_profile?.display_name || "Siswa";
    const mod = entry.modifiers?.modifier || 0;
    const modStr = mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : "";

    return `
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-xs);padding:0.6rem 0.8rem;font-size:0.8rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
          <strong style="color:var(--text-main);">${userName}</strong>
          <span style="font-size:0.7rem;color:var(--text-muted);">${new Date(entry.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--text-dim);">${entry.label ? entry.label + ' • ' : ''}${entry.dice} ${modStr}</span>
          <span style="font-size:1.1rem;font-weight:800;color:var(--amber-gold);">${entry.total}</span>
        </div>
      </div>
    `;
  }).join("");
}

function setupCampaignRealtime(campaignId: string) {
  campaignRealtime.subscribe(campaignId, isDm, {
    onCharacterChange: (event, char, oldId) => {
      if (event === "INSERT") {
        campaignCharacters.unshift(char);
      } else if (event === "UPDATE") {
        const idx = campaignCharacters.findIndex(c => c.id === char.id);
        if (idx >= 0) campaignCharacters[idx] = char;
        else campaignCharacters.unshift(char);
      } else if (event === "DELETE" && oldId) {
        campaignCharacters = campaignCharacters.filter(c => c.id !== oldId);
      }
      renderCampaignCharacters();
    },
    onRollLog: (entry) => {
      rollLogsList.unshift(entry);
      renderRollLogs();
      showToast(`🎲 ${entry.user_profile?.display_name || 'Seseorang'} melempar ${entry.dice}: Hasil ${entry.total}`, "info");
    }
  });
}
