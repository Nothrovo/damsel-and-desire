import { getCharacter, getCalendarProgress, toggleCalendarEvent } from "../api/characters";
import { getCompendiumEkskul, getCompendiumArchetypes, getCompendiumCalendarEvents } from "../api/compendium";
import {
  shortRestRpc,
  longRestRpc,
  applyVitalChangeRpc
} from "../api/gameRpc";
import { characterStore } from "../store/characterStore";
import { exportCharacterJson, triggerPrintCharacterSheet } from "../services/exporter";
import {
  calculateAbilityModifier,
  formatModifier,
  calculateProficiencyBonus,
  yenToRupiah
} from "../services/ruleEngine";
import { savingsModal } from "../components/SavingsModal";
import { baitoModal } from "../components/BaitoModal";
import { backstoryModal } from "../components/BackstoryModal";
import { diceRollerModal } from "../components/DiceRollerModal";
import { renderSheetSkeleton } from "../components/Skeleton";
import { showToast } from "../components/Toast";
import type { Character, CalendarEventCompendium } from "../types";

let currentActiveTab = "moves";
let compCalendar: CalendarEventCompendium[] = [];
let checkedCalendarEvents: string[] = [];

export async function renderCharacterSheetView(params: Record<string, string>): Promise<void> {
  const charId = params.id;
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = renderSheetSkeleton();

  try {
    const char = await getCharacter(charId);
    if (!char) {
      appContainer.innerHTML = `
        <div style="text-align:center;padding:4rem;color:var(--rose-light);">
          <h2>Karakter Tidak Ditemukan</h2>
          <p>Karakter dengan ID ini tidak ditemukan atau Anda tidak memiliki izin akses.</p>
          <a href="/" class="btn btn-secondary">← Kembali ke Beranda</a>
        </div>
      `;
      return;
    }

    characterStore.setCurrentCharacter(char);
    compCalendar = await getCompendiumCalendarEvents();
    checkedCalendarEvents = await getCalendarProgress(charId);

    renderSheetUi(appContainer, char);
    attachSheetEvents(char);
  } catch (err: any) {
    appContainer.innerHTML = `<div style="text-align:center;padding:4rem;color:var(--rose-light);">Gagal memuat karakter: ${err.message}</div>`;
  }
}

function renderSheetUi(container: HTMLElement, char: Character) {
  const avatar = char.avatar_path || `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.name}`;
  const profBonus = calculateProficiencyBonus(char.level);
  const abilities = char.abilities;
  const vitals = char.vitals;
  const finances = char.finances;

  const statKeys: Array<keyof typeof abilities> = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
  const mods: Record<string, number> = {};
  statKeys.forEach(k => {
    mods[k] = calculateAbilityModifier(abilities[k]);
  });

  const hpPercent = Math.min(100, Math.max(0, (vitals.physicalHpCurrent / vitals.physicalHpMax) * 100));
  const compPercent = Math.min(100, Math.max(0, (vitals.composureCurrent / vitals.composureMax) * 100));

  container.innerHTML = `
    <section class="view-section active" style="max-width:1150px;margin:1.5rem auto;padding:0 1rem;">

      <!-- SHEET ACTION HEADER -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
        <div style="display:flex;align-items:center;gap:12px;">
          <a href="/" style="text-decoration:none;color:var(--text-muted);font-size:0.9rem;">← Roster</a>
          <span style="color:var(--border-card);">|</span>
          <span style="font-size:0.85rem;color:var(--text-muted);">Versi Data: <strong>v${char.version}</strong></span>
          ${characterStore.hasConflict ? `
            <span style="background:rgba(225,29,72,0.2);color:var(--rose-light);padding:2px 8px;border-radius:4px;font-size:0.75rem;border:1px solid var(--rose-primary);">
              ⚠️ Konflik Sinkronisasi: Muat ulang data terbaru!
            </span>
          ` : ''}
        </div>

        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary btn-sm" id="btnExportCharJson">📥 Ekspor JSON</button>
          <button class="btn btn-secondary btn-sm" id="btnPrintCharSheet">🖨️ Cetak / PDF (A4)</button>
        </div>
      </div>

      <!-- CHARACTER PROFILE CARD -->
      <div class="sheet-hero-card" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.5rem;margin-bottom:1.5rem;display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap;">
        <img src="${avatar}" alt="${char.name}" style="width:84px;height:84px;border-radius:50%;border:3px solid var(--rose-primary);object-fit:cover;background:var(--bg-surface);">
        
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">
            <h1 style="font-family:var(--font-heading);font-size:1.8rem;margin:0;">${char.name}</h1>
            <span style="background:var(--bg-surface);border:1px solid var(--border-subtle);color:var(--amber-gold);font-size:0.8rem;padding:2px 8px;border-radius:4px;font-weight:700;">
              Kelas ${10 + (char.level - 1)} (Lvl ${char.level})
            </span>
          </div>
          <div style="font-size:0.85rem;color:var(--text-muted);display:flex;gap:12px;flex-wrap:wrap;">
            <span>Ekskul: <strong style="color:var(--text-main);">${char.ekskul_id.toUpperCase()}</strong></span>
            <span>•</span>
            <span>Social Class: <strong style="color:var(--text-main);">${char.social_class_id}</strong></span>
            <span>•</span>
            <span>Archetype: <strong style="color:var(--text-main);">${char.archetype_id}</strong></span>
            <span>•</span>
            <span>Profisiensi: <strong>+${profBonus}</strong></span>
          </div>
        </div>

        <!-- REST ACTIONS -->
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-sm btn-secondary" id="btnShortRest" title="Gunakan Rest Dice untuk memulihkan HP & Composure">
            ☕ Short Rest (${vitals.restDiceSpent}/${vitals.restDiceTotal} Dice)
          </button>
          <button class="btn btn-sm btn-primary" id="btnLongRest" title="Pulihkan semua HP, pulihkan Rest Dice, dan setor uang saku + baito ke tabungan">
            🌙 Long Rest (+Uang Saku)
          </button>
        </div>
      </div>

      <!-- VITALS GAUGES: PHYSICAL HP & MENTAL COMPOSURE -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <!-- Physical HP -->
        <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <strong style="color:var(--green-health);font-size:0.95rem;">❤️ Physical HP</strong>
            <span style="font-size:1.2rem;font-weight:800;">${vitals.physicalHpCurrent} / ${vitals.physicalHpMax}</span>
          </div>
          <div style="height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden;margin-bottom:12px;">
            <div style="width:${hpPercent}%;height:100%;background:var(--green-health);transition:width 0.2s;"></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="phys" data-delta="-1" style="flex:1;">−1 Damage</button>
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="phys" data-delta="-5" style="flex:1;">−5 Damage</button>
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="phys" data-delta="1" style="flex:1;">+1 Heal</button>
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="phys" data-delta="5" style="flex:1;">+5 Heal</button>
          </div>
        </div>

        <!-- Mental Composure -->
        <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <strong style="color:var(--rose-light);font-size:0.95rem;">🧠 Mental Composure (Ketenangan Batin)</strong>
            <span style="font-size:1.2rem;font-weight:800;">${vitals.composureCurrent} / ${vitals.composureMax}</span>
          </div>
          <div style="height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden;margin-bottom:12px;">
            <div style="width:${compPercent}%;height:100%;background:var(--rose-primary);transition:width 0.2s;"></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="composure" data-delta="-1" style="flex:1;">−1 Salting</button>
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="composure" data-delta="-5" style="flex:1;">−5 Salting</button>
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="composure" data-delta="1" style="flex:1;">+1 Tenang</button>
            <button class="btn btn-xs btn-secondary btn-vital-change" data-type="composure" data-delta="5" style="flex:1;">+5 Tenang</button>
          </div>
        </div>
      </div>

      <!-- 6 ABILITIES GRID -->
      <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:10px;margin-bottom:1.5rem;">
        ${statKeys.map(k => `
          <div class="stat-box" data-stat="${k}" data-mod="${mods[k]}" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.75rem 0.5rem;text-align:center;cursor:pointer;" title="Klik untuk melempar check ${k}">
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;font-weight:700;">${k.slice(0, 3)}</div>
            <div style="font-size:1.4rem;font-weight:900;color:var(--amber-gold);">${formatModifier(mods[k])}</div>
            <div style="font-size:0.75rem;color:var(--text-dim);">${abilities[k]}</div>
          </div>
        `).join("")}
      </div>

      <!-- SHEET TABS -->
      <div class="sheet-tabs" style="display:flex;gap:8px;border-bottom:1px solid var(--border-card);margin-bottom:1.5rem;">
        <button class="sheet-tab-btn ${currentActiveTab === 'moves' ? 'active' : ''}" data-tab="moves">⚔️ Moves & Aksi</button>
        <button class="sheet-tab-btn ${currentActiveTab === 'inventory' ? 'active' : ''}" data-tab="inventory">🎒 Tas & Keuangan</button>
        <button class="sheet-tab-btn ${currentActiveTab === 'backstory' ? 'active' : ''}" data-tab="backstory">📖 Kisah & Karakter</button>
        <button class="sheet-tab-btn ${currentActiveTab === 'calendar' ? 'active' : ''}" data-tab="calendar">📅 Kalender Sekolah</button>
      </div>

      <!-- TAB CONTENTS -->
      <div id="sheetTabContent" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:1.5rem;">
        ${renderActiveTabContent(char)}
      </div>

    </section>
  `;
}

function renderActiveTabContent(char: Character): string {
  if (currentActiveTab === "moves") {
    return `
      <div>
        <h3 style="font-family:var(--font-heading);margin-top:0;margin-bottom:1rem;font-size:1.1rem;">Daftar Moves & Aksi Karakter</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;">
          Moves klub ekskul (${char.ekskul_id}) dan archetype (${char.archetype_id}).
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
          <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1rem;">
            <h4 style="margin:0 0 8px 0;color:var(--amber-gold);">Aksi Standar Sekolah</h4>
            <ul style="font-size:0.8rem;color:var(--text-dim);padding-left:1.2rem;margin:0;line-height:1.7;">
              <li><strong>Pukulan Fisik:</strong> Serangan jarak dekat (Physique / Power)</li>
              <li><strong>Senyuman Persuasi:</strong> Merayu lawan bicara (Looks / Charm)</li>
              <li><strong>Analisis Logika:</strong> Memecahkan masalah akademis (Intelligent / Academic)</li>
              <li><strong>Membaca Atmosfer:</strong> Mengetahui suasana hati orang lain (Mind / Awareness)</li>
            </ul>
          </div>

          <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1rem;">
            <h4 style="margin:0 0 8px 0;color:var(--rose-light);">Keahlian Khusus (${char.ekskul_id.toUpperCase()})</h4>
            <div style="font-size:0.8rem;color:var(--text-dim);line-height:1.6;">
              Moves klub ekskul aktif untuk kelas ini. Gunakan saat sesi TRPG berlangsung sepulang sekolah.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (currentActiveTab === "inventory") {
    const fin = char.finances;
    const inv = char.inventory;
    const savingsRp = yenToRupiah(fin.savingsAmount);

    return `
      <div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
          <!-- Keuangan & Tabungan -->
          <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <h4 style="margin:0;color:var(--amber-gold);">💳 Dompet & Tabungan</h4>
              <button class="btn btn-xs btn-secondary" id="btnOpenSavingsModal">💳 + / − Tabungan</button>
            </div>

            <div style="margin-bottom:12px;">
              <div style="font-size:0.75rem;color:var(--text-muted);">Saldo Tabungan:</div>
              <div style="font-size:1.4rem;font-weight:800;color:var(--amber-gold);">
                ¥${fin.savingsAmount.toLocaleString()} <span style="font-size:0.9rem;color:var(--text-muted);font-weight:400;">(Rp ${savingsRp.toLocaleString()})</span>
              </div>
            </div>

            <div style="font-size:0.8rem;color:var(--text-dim);display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid var(--border-subtle);">
              <span>Uang Jajan Harian: <strong>¥${fin.dailyMoneyAmount.toLocaleString()}</strong></span>
              <button class="btn btn-xs btn-secondary" id="btnOpenBaitoModal">💼 Baito: ${fin.job}</button>
            </div>
          </div>

          <!-- Jimat Omamori / Keepsakes -->
          <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1.25rem;">
            <h4 style="margin:0 0 10px 0;color:var(--rose-light);">🌸 Barang Kenangan & Jimat (Keepsakes)</h4>
            <ul style="font-size:0.85rem;color:var(--text-dim);margin:0;padding-left:1.2rem;line-height:1.7;">
              ${inv.keepsakes.map(k => `<li>${k}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Tas Sekolah (Bag Items) -->
        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1.25rem;">
          <h4 style="margin:0 0 10px 0;">🎒 Isi Tas Sekolah (Equipment 3-Layer)</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:8px;">
            ${inv.bagItems.map(item => `
              <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-xs);padding:0.5rem 0.75rem;font-size:0.8rem;">
                📦 ${item}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  if (currentActiveTab === "backstory") {
    const bs = char.backstory_fields;
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <h3 style="font-family:var(--font-heading);margin:0;font-size:1.1rem;">Kepribadian & Latar Belakang</h3>
          <button class="btn btn-xs btn-secondary" id="btnEditBackstoryModal">✏️ Sunting Backstory</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;">
          <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
            <strong style="font-size:0.85rem;color:var(--amber-gold);">Ciri Kepribadian (Personality):</strong>
            <p style="font-size:0.8rem;color:var(--text-dim);margin:4px 0 0 0;">${bs.personality || '-'}</p>
          </div>
          <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
            <strong style="font-size:0.85rem;color:var(--amber-gold);">Cita-Cita & Idealisme (Ideals):</strong>
            <p style="font-size:0.8rem;color:var(--text-dim);margin:4px 0 0 0;">${bs.ideals || '-'}</p>
          </div>
          <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
            <strong style="font-size:0.85rem;color:var(--amber-gold);">Ikatan Hati (Bonds):</strong>
            <p style="font-size:0.8rem;color:var(--text-dim);margin:4px 0 0 0;">${bs.bonds || '-'}</p>
          </div>
          <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
            <strong style="font-size:0.85rem;color:var(--amber-gold);">Kelemahan Diri (Flaws):</strong>
            <p style="font-size:0.8rem;color:var(--text-dim);margin:4px 0 0 0;">${bs.flaws || '-'}</p>
          </div>
        </div>

        <div style="background:var(--bg-surface);padding:1.25rem;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);">
          <strong style="font-size:0.9rem;color:var(--rose-light);">Kisah Masa Lalu (Backstory):</strong>
          <p style="font-size:0.85rem;color:var(--text-dim);line-height:1.7;margin:8px 0 0 0;white-space:pre-wrap;">${bs.backstory || 'Belum ada kisah masa lalu yang ditulis.'}</p>
        </div>
      </div>
    `;
  }

  if (currentActiveTab === "calendar") {
    return `
      <div>
        <h3 style="font-family:var(--font-heading);margin-top:0;margin-bottom:0.5rem;font-size:1.1rem;">📅 Kalender Kegiatan Akademik Sekolah</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem;">
          Tandai acara sekolah yang telah dilalui karaktermu selama masa SMA.
        </p>

        <div style="display:flex;flex-direction:column;gap:10px;">
          ${compCalendar.map(evt => {
            const isDone = checkedCalendarEvents.includes(evt.id);
            return `
              <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0.85rem 1rem;display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                    <span style="font-size:0.75rem;background:var(--bg-card);border:1px solid var(--border-subtle);padding:2px 6px;border-radius:4px;color:var(--amber-gold);">${evt.term}</span>
                    <strong style="font-size:0.95rem;">${evt.name}</strong>
                  </div>
                  <p style="font-size:0.8rem;color:var(--text-muted);margin:0;">${evt.description}</p>
                </div>
                <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;cursor:pointer;">
                  <input type="checkbox" class="calendar-event-check" data-event-id="${evt.id}" ${isDone ? 'checked' : ''}>
                  <span style="color:${isDone ? 'var(--green-health)' : 'var(--text-muted)'};font-weight:700;">${isDone ? 'SELESAI' : 'Belum'}</span>
                </label>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  return "";
}

function attachSheetEvents(char: Character) {
  // Export & Print
  document.getElementById("btnExportCharJson")?.addEventListener("click", () => exportCharacterJson(char));
  document.getElementById("btnPrintCharSheet")?.addEventListener("click", () => triggerPrintCharacterSheet());

  // Rests
  document.getElementById("btnShortRest")?.addEventListener("click", async () => {
    try {
      showToast("Menjalankan Short Rest di server...", "info");
      const res = await shortRestRpc(char.id, char.version);
      showToast(`☕ Short Rest: ${res.healTotal} HP & Composure dipulihkan! (${res.dieRolled}: ${res.rollResult} +${res.modPhysique})`, "success");
      char.vitals = res.vitals;
      char.version = res.newVersion;
      renderSheetUi(document.getElementById("appMain")!, char);
      attachSheetEvents(char);
    } catch (err: any) {
      showToast(`Gagal Short Rest: ${err.message}`, "error");
    }
  });

  document.getElementById("btnLongRest")?.addEventListener("click", async () => {
    try {
      showToast("Menjalankan Long Rest di server...", "info");
      const res = await longRestRpc(char.id, char.version);
      showToast(`🌙 Long Rest: HP pulih penuh! +¥${res.totalAdded.toLocaleString()} disetor ke tabungan.`, "success");
      char.vitals = res.vitals;
      char.finances = res.finances;
      char.version = res.newVersion;
      renderSheetUi(document.getElementById("appMain")!, char);
      attachSheetEvents(char);
    } catch (err: any) {
      showToast(`Gagal Long Rest: ${err.message}`, "error");
    }
  });

  // Vital changes (+/- Damage & Heal)
  document.querySelectorAll(".btn-vital-change").forEach((btn: any) => {
    btn.addEventListener("click", async (e: any) => {
      const type = e.currentTarget.dataset.type as 'phys' | 'composure';
      const delta = parseInt(e.currentTarget.dataset.delta) || 0;

      try {
        await characterStore.runOptimisticUpdate(
          (draft) => {
            const keyCur = type === "phys" ? "physicalHpCurrent" : "composureCurrent";
            const keyMax = type === "phys" ? "physicalHpMax" : "composureMax";
            draft.vitals[keyCur] = Math.max(0, Math.min(draft.vitals[keyMax], draft.vitals[keyCur] + delta));
          },
          () => applyVitalChangeRpc(char.id, type, delta, char.version)
        );

        renderSheetUi(document.getElementById("appMain")!, char);
        attachSheetEvents(char);
      } catch (err: any) {
        showToast(`Gagal memperbarui status: ${err.message}`, "error");
      }
    });
  });

  // Ability roll trigger
  document.querySelectorAll(".stat-box").forEach((box: any) => {
    box.addEventListener("click", (e: any) => {
      const stat = e.currentTarget.dataset.stat;
      const mod = parseInt(e.currentTarget.dataset.mod) || 0;
      diceRollerModal.show("d20", mod, `${stat.toUpperCase()} Check`);
    });
  });

  // Tabs switching
  document.querySelectorAll(".sheet-tab-btn").forEach((btn: any) => {
    btn.addEventListener("click", (e: any) => {
      currentActiveTab = e.currentTarget.dataset.tab;
      document.querySelectorAll(".sheet-tab-btn").forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const contentEl = document.getElementById("sheetTabContent");
      if (contentEl) {
        contentEl.innerHTML = renderActiveTabContent(char);
        attachTabInternalEvents(char);
      }
    });
  });

  attachTabInternalEvents(char);
}

function attachTabInternalEvents(char: Character) {
  document.getElementById("btnOpenSavingsModal")?.addEventListener("click", () => savingsModal.show());
  document.getElementById("btnOpenBaitoModal")?.addEventListener("click", () => baitoModal.show());
  document.getElementById("btnEditBackstoryModal")?.addEventListener("click", () => backstoryModal.show());

  document.querySelectorAll(".calendar-event-check").forEach((cb: any) => {
    cb.addEventListener("change", async (e: any) => {
      const eventId = e.currentTarget.dataset.eventId;
      const done = e.currentTarget.checked;

      try {
        await toggleCalendarEvent(char.id, eventId, done);
        if (done) checkedCalendarEvents.push(eventId);
        else checkedCalendarEvents = checkedCalendarEvents.filter(id => id !== eventId);
        showToast(`Acara kalender diperbarui!`, "info");
      } catch (err: any) {
        showToast(`Gagal memperbarui kalender: ${err.message}`, "error");
      }
    });
  });
}
