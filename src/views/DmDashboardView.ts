import { getCampaign } from "../api/campaigns";
import { listCampaignCharacters, getCharacterSecret, updateCharacterSecret } from "../api/characters";
import { showToast } from "../components/Toast";
import type { Campaign, Character, CharacterSecret, TargetSecret } from "../types";

export async function renderDmDashboardView(params: Record<string, string>): Promise<void> {
  const campaignId = params.campaignId;
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active" style="max-width:1200px;margin:2rem auto;padding:0 1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
            <a href="/campaigns/${campaignId}" style="text-decoration:none;color:var(--text-muted);font-size:0.9rem;">← Kembali ke Campaign</a>
          </div>
          <h1 style="font-family:var(--font-heading);margin:0;font-size:1.8rem;color:var(--amber-gold);">
            👑 DM Command Center: Affection & Secret Vault
          </h1>
          <p style="color:var(--text-muted);font-size:0.85rem;margin-top:4px;">
            Halaman ini diisolasi penuh oleh Row Level Security (RLS) PostgreSQL. Hanya Game Master (DM) yang memiliki akses baca/tulis ke data rahasia asmara dan target murid.
          </p>
        </div>
      </div>

      <div id="dmCharactersContainer" style="display:flex;flex-direction:column;gap:1.5rem;">
        <div style="text-align:center;padding:3rem;color:var(--text-muted);">Memuat data rahasia karakter...</div>
      </div>
    </section>
  `;

  await loadDmData(campaignId);
}

async function loadDmData(campaignId: string) {
  const container = document.getElementById("dmCharactersContainer");
  if (!container) return;

  try {
    const campaign = await getCampaign(campaignId);
    const characters = await listCampaignCharacters(campaignId);

    if (characters.length === 0) {
      container.innerHTML = `
        <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:3rem;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:1rem;">🌸</div>
          <h3>Belum Ada Karakter di Campaign Ini</h3>
          <p style="color:var(--text-muted);">Minta para pemain untuk bergabung dan membuat karakter di campaign ini.</p>
        </div>
      `;
      return;
    }

    // Fetch secrets for each character in parallel
    const secretsMap: Record<string, CharacterSecret | null> = {};
    for (const char of characters) {
      secretsMap[char.id] = await getCharacterSecret(char.id);
    }

    container.innerHTML = characters.map((char) => {
      const secret = secretsMap[char.id];
      const targets = secret?.targets || [];
      const dmNotes = secret?.dm_notes || "";
      const avatar = char.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.name}`;

      return `
        <div class="dm-character-card" data-char-id="${char.id}" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.5rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;border-bottom:1px solid var(--border-subtle);padding-bottom:1rem;">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${avatar}" alt="${char.name}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--amber-gold);">
              <div>
                <h3 style="margin:0;font-size:1.2rem;">${char.name}</h3>
                <span style="font-size:0.8rem;color:var(--text-muted);">
                  Ekskul: <strong>${char.ekskul_id}</strong> • Archetype: <strong>${char.archetype_id}</strong>
                </span>
              </div>
            </div>
            <button class="btn btn-primary btn-sm btn-save-dm-secret" data-char-id="${char.id}">
              💾 Simpan Perubahan Rahasia
            </button>
          </div>

          <!-- TARGETS / AFFECTION LIST -->
          <div style="margin-bottom:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <h4 style="margin:0;font-size:0.95rem;color:var(--rose-light);">❤️ Target Asmara & Affection Meter (1 - 10)</h4>
              <button class="btn btn-xs btn-secondary btn-add-target" data-char-id="${char.id}">+ Tambah Target</button>
            </div>

            <div class="targets-list" id="targetsList_${char.id}" style="display:flex;flex-direction:column;gap:10px;">
              ${targets.length === 0 ? `
                <div style="color:var(--text-muted);font-size:0.85rem;padding:0.5rem;background:var(--bg-input);border-radius:var(--radius-xs);">
                  Belum ada target asmara yang tercatat untuk karakter ini.
                </div>
              ` : targets.map((t, tIdx) => `
                <div class="target-item-row" data-idx="${tIdx}" style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.85rem;">
                  <div style="display:grid;grid-template-columns:1fr 1fr 120px 32px;gap:10px;align-items:center;margin-bottom:8px;">
                    <div>
                      <label style="font-size:0.75rem;color:var(--text-muted);">Nama Target / NPC:</label>
                      <input type="text" class="input-text target-name" value="${escapeHtml(t.name)}" style="width:100%;font-size:0.85rem;">
                    </div>
                    <div>
                      <label style="font-size:0.75rem;color:var(--text-muted);">Status Hubungan:</label>
                      <input type="text" class="input-text target-status" value="${escapeHtml(t.status)}" placeholder="misal: Sahabat Masa Kecil / Rival" style="width:100%;font-size:0.85rem;">
                    </div>
                    <div>
                      <label style="font-size:0.75rem;color:var(--text-muted);">Affection: <strong class="aff-val-label">${t.affection}</strong>/10</label>
                      <input type="range" min="1" max="10" value="${t.affection}" class="target-aff-range" style="width:100%;">
                    </div>
                    <div>
                      <button class="btn btn-xs btn-secondary btn-del-target" title="Hapus Target" style="color:var(--rose-light);margin-top:14px;">✕</button>
                    </div>
                  </div>
                  <div>
                    <label style="font-size:0.75rem;color:var(--text-muted);">Rahasia / Secret Crush Notes (Hanya terlihat oleh DM):</label>
                    <textarea class="input-textarea target-secret" rows="2" style="font-size:0.8rem;" placeholder="Rahasia perasaan, trauma cinta, atau trigger salting...">${escapeHtml(t.secret)}</textarea>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- DM CONFIDENTIAL NOTES -->
          <div>
            <label style="font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:4px;">Catatan Naratif Rahasia DM untuk Karakter Ini:</label>
            <textarea class="input-textarea char-dm-notes" rows="2" placeholder="Plot twist yang direncanakan, petunjuk surat cinta, dll.">${escapeHtml(dmNotes)}</textarea>
          </div>
        </div>
      `;
    }).join("");

    attachDmDashboardEvents(campaignId, characters);
  } catch (err: any) {
    container.innerHTML = `<div style="color:var(--rose-light);text-align:center;">Gagal memuat dashboard DM: ${err.message}</div>`;
  }
}

function attachDmDashboardEvents(campaignId: string, characters: Character[]) {
  // Live range slider label updates
  document.querySelectorAll(".target-aff-range").forEach((slider: any) => {
    slider.addEventListener("input", (e: any) => {
      const row = e.target.closest(".target-item-row");
      const label = row?.querySelector(".aff-val-label");
      if (label) label.textContent = e.target.value;
    });
  });

  // Delete target
  document.querySelectorAll(".btn-del-target").forEach((btn) => {
    btn.addEventListener("click", (e: any) => {
      const row = e.target.closest(".target-item-row");
      row?.remove();
    });
  });

  // Add target row dynamically
  document.querySelectorAll(".btn-add-target").forEach((btn: any) => {
    btn.addEventListener("click", (e: any) => {
      const charId = e.currentTarget.dataset.charId;
      const list = document.getElementById(`targetsList_${charId}`);
      if (!list) return;

      const newRow = document.createElement("div");
      newRow.className = "target-item-row";
      newRow.style.cssText = "background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.85rem;";
      newRow.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 120px 32px;gap:10px;align-items:center;margin-bottom:8px;">
          <div>
            <label style="font-size:0.75rem;color:var(--text-muted);">Nama Target / NPC:</label>
            <input type="text" class="input-text target-name" value="Target Baru" style="width:100%;font-size:0.85rem;">
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--text-muted);">Status Hubungan:</label>
            <input type="text" class="input-text target-status" value="Gebetan Rahasia" style="width:100%;font-size:0.85rem;">
          </div>
          <div>
            <label style="font-size:0.75rem;color:var(--text-muted);">Affection: <strong class="aff-val-label">5</strong>/10</label>
            <input type="range" min="1" max="10" value="5" class="target-aff-range" style="width:100%;">
          </div>
          <div>
            <button class="btn btn-xs btn-secondary btn-del-target" title="Hapus Target" style="color:var(--rose-light);margin-top:14px;">✕</button>
          </div>
        </div>
        <div>
          <label style="font-size:0.75rem;color:var(--text-muted);">Rahasia / Secret Crush Notes (Hanya terlihat oleh DM):</label>
          <textarea class="input-textarea target-secret" rows="2" style="font-size:0.8rem;" placeholder="Rahasia perasaan..."></textarea>
        </div>
      `;

      list.appendChild(newRow);

      newRow.querySelector(".target-aff-range")?.addEventListener("input", (ev: any) => {
        const lbl = newRow.querySelector(".aff-val-label");
        if (lbl) lbl.textContent = ev.target.value;
      });
      newRow.querySelector(".btn-del-target")?.addEventListener("click", () => newRow.remove());
    });
  });

  // Save character secret button
  document.querySelectorAll(".btn-save-dm-secret").forEach((btn: any) => {
    btn.addEventListener("click", async (e: any) => {
      const charId = e.currentTarget.dataset.charId;
      const card = document.querySelector(`.dm-character-card[data-char-id="${charId}"]`);
      if (!card) return;

      const rows = card.querySelectorAll(".target-item-row");
      const updatedTargets: TargetSecret[] = [];

      rows.forEach((r) => {
        const name = (r.querySelector(".target-name") as HTMLInputElement)?.value.trim() || "";
        const status = (r.querySelector(".target-status") as HTMLInputElement)?.value.trim() || "";
        const aff = parseInt((r.querySelector(".target-aff-range") as HTMLInputElement)?.value || "5") || 5;
        const secret = (r.querySelector(".target-secret") as HTMLTextAreaElement)?.value.trim() || "";
        if (name) {
          updatedTargets.push({ name, status, affection: aff, secret });
        }
      });

      const dmNotes = (card.querySelector(".char-dm-notes") as HTMLTextAreaElement)?.value.trim() || "";

      try {
        await updateCharacterSecret(charId, campaignId, updatedTargets, dmNotes);
        showToast("✓ Data rahasia dan meteran cinta berhasil disimpan ke cloud!", "success");
      } catch (err: any) {
        showToast(`Gagal menyimpan rahasia: ${err.message}`, "error");
      }
    });
  });
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
