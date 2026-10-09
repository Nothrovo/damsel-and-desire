import {
  SCHOOL_CALENDAR_MONTHS,
  SCHOOL_DAILY_ROUTINES,
  SCHOOL_ELITE_TRADITIONS,
  SCHOOL_MONTH_ORDER,
  SCHOOL_ROMANCE_ARCS,
  YEAR_TWO_PREVIEW,
  calculateCalendarProgressStats,
  getMonthProgressiveStatus
} from "../data/schoolCalendarData";
import {
  applyAddCustomEvent,
  applyDeleteCustomEvent,
  applyMarkMonthEvents,
  applySaveMonthNote,
  applySetCurrentMonth,
  applyToggleEventDone,
  fetchSchoolCalendarState,
  getDefaultCalendarState,
  normalizeCalendarState,
  saveSchoolCalendarState
} from "../api/calendar";
import { supabase } from "../api/supabase";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmAuthModal } from "../components/DmAuthModal";
import { showToast } from "../components/Toast";
import type {
  SchoolCalendarMonth,
  SchoolCalendarMonthId,
  SchoolCalendarMonthStatus,
  SchoolCalendarState,
  SchoolEventCategoryTag
} from "../types";
import type { RealtimeChannel } from "@supabase/supabase-js";

type CalendarTabMode = "monthly" | "overview" | "worldbuilding";

let calendarState: SchoolCalendarState = getDefaultCalendarState();
let selectedMonthId: SchoolCalendarMonthId = "april";
let activeTab: CalendarTabMode = "monthly";
let showStoryGuides: boolean = true;
let calendarChannel: RealtimeChannel | null = null;
let hasInitializedSelection: boolean = false;

function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getCategoryBadgeStyle(category: SchoolEventCategoryTag): string {
  switch (category) {
    case "Wajib":
      return "background:rgba(245,158,11,0.15);color:var(--amber-gold);border:1px solid rgba(245,158,11,0.4);";
    case "Romance":
      return "background:rgba(225,29,72,0.18);color:var(--rose-light);border:1px solid rgba(225,29,72,0.45);";
    case "Festival":
    case "School Trip":
      return "background:rgba(139,92,246,0.18);color:#c4b5fd;border:1px solid rgba(139,92,246,0.45);";
    case "Ujian":
    case "Akademik":
      return "background:rgba(37,99,235,0.18);color:#93c5fd;border:1px solid rgba(37,99,235,0.45);";
    case "Ekskul":
    case "Kompetisi":
      return "background:rgba(16,185,129,0.16);color:#6ee7b7;border:1px solid rgba(16,185,129,0.4);";
    case "Tradisi Elite":
    case "Milestone":
      return "background:rgba(245,158,11,0.22);color:#fde68a;border:1px solid var(--amber-gold);";
    case "Momen Party":
      return "background:rgba(6,182,212,0.18);color:#67e8f9;border:1px solid rgba(6,182,212,0.45);";
    default:
      return "background:rgba(255,255,255,0.06);color:var(--text-dim);border:1px solid var(--border-subtle);";
  }
}

function getStatusConfig(status: SchoolCalendarMonthStatus) {
  if (status === "passed") {
    return {
      icon: "✅",
      label: "Sudah Lewat",
      badgeStyle:
        "background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.45);",
      cardBorder: "rgba(16,185,129,0.45)",
      pillBg: "rgba(16,185,129,0.1)"
    };
  }
  if (status === "current") {
    return {
      icon: "🌸",
      label: "Bulan Sekarang",
      badgeStyle:
        "background:rgba(225,29,72,0.22);color:var(--rose-light);border:1px solid var(--rose-primary);box-shadow:0 0 12px var(--rose-glow);",
      cardBorder: "var(--rose-primary)",
      pillBg: "rgba(225,29,72,0.18)"
    };
  }
  return {
    icon: "⏳",
    label: "Akan Datang",
    badgeStyle:
      "background:rgba(255,255,255,0.05);color:var(--text-muted);border:1px solid var(--border-subtle);",
    cardBorder: "var(--border-card)",
    pillBg: "var(--bg-surface)"
  };
}

function getMonthCompletionCounts(month: SchoolCalendarMonth, state: SchoolCalendarState) {
  const completedSet = new Set(state.completedEventIds);
  const builtInDone = month.events.filter((ev) => completedSet.has(ev.id)).length;
  const monthCustom = (state.customEvents || []).filter((ce) => ce.monthId === month.id);
  const customDone = monthCustom.filter((ce) => ce.done).length;
  const total = month.events.length + monthCustom.length;
  const done = builtInDone + customDone;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, pct, monthCustom };
}

export async function renderCalendarView(): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  calendarState = await fetchSchoolCalendarState();
  if (!hasInitializedSelection) {
    selectedMonthId = calendarState.currentMonthId;
    hasInitializedSelection = true;
  }

  subscribeCalendarRealtime();
  renderCalendarDOM();
}

function subscribeCalendarRealtime() {
  if (calendarChannel) {
    try {
      supabase.removeChannel(calendarChannel);
    } catch {
      // ignore
    }
    calendarChannel = null;
  }

  try {
    calendarChannel = supabase
      .channel("public_school_calendar_sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "school_calendar_state"
        },
        (payload: any) => {
          if (payload?.new && document.querySelector(".school-calendar-view")) {
            calendarState = normalizeCalendarState(payload.new);
            renderCalendarDOM();
          }
        }
      )
      .subscribe();
  } catch {
    // Offline / local fallback
  }
}

function renderCalendarDOM() {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  const stats = calculateCalendarProgressStats(calendarState);
  const selectedMonth =
    SCHOOL_CALENDAR_MONTHS.find((m) => m.id === selectedMonthId) || stats.currentMonth;
  const isDm = dmAuthStore.isAuthenticated();

  appContainer.innerHTML = `
    <section class="view-section active school-calendar-view" style="max-width:1280px;margin:2rem auto;padding:0 1.5rem 5rem 1.5rem;">
      
      <!-- HERO & GLOBAL ACADEMIC PROGRESS HEADER -->
      <div class="calendar-hero-card" style="background:linear-gradient(135deg, rgba(31,41,61,0.96), rgba(17,24,39,0.98));border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:1.75rem;margin-bottom:1.5rem;box-shadow:var(--shadow-lg);position:relative;overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1.25rem;margin-bottom:1.25rem;">
          <div>
            <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(225,29,72,0.12);border:1px solid var(--rose-primary);padding:4px 14px;border-radius:var(--radius-full);color:var(--rose-light);font-size:0.78rem;font-weight:700;margin-bottom:0.65rem;font-family:var(--font-heading);letter-spacing:0.04em;">
              <span>🌸 HOUSEN ACADEMY ACADEMIC &amp; ROMANCE TIMELINE</span>
            </div>
            <h1 style="font-family:var(--font-heading);font-size:2rem;color:var(--amber-gold);margin:0 0 0.4rem 0;">
              Kalender Sekolah Progresif (April – Maret)
            </h1>
            <p style="color:var(--text-muted);max-width:740px;font-size:0.92rem;line-height:1.55;margin:0;">
              Pantau perjalanan 1 tahun ajaran penuh SMA Jepang dari masa penerimaan siswa baru (Kelas 10) hingga naik ke Kelas 11. Tandai bulan yang sedang berjalan, centang event yang sudah lewat, dan catat momen memorable party.
            </p>
          </div>

          <!-- Top Right Controls: Year Toggle & Story Guide Toggle -->
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.6rem;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <select id="calAcademicYearSelect" class="input-text" style="padding:6px 12px;font-size:0.82rem;border-radius:var(--radius-full);background:var(--bg-input);border:1px solid var(--amber-gold);color:var(--amber-gold);font-weight:700;cursor:pointer;">
                <option value="1" ${calendarState.academicYear === 1 ? "selected" : ""}>🎒 Tahun 1: Kelas 10 (Kōkō Ichinensei)</option>
                <option value="2" ${calendarState.academicYear === 2 ? "selected" : ""}>🎓 Tahun 2: Kelas 11 (Kōkō Ninensei)</option>
              </select>

              <button id="calToggleStoryGuideBtn" class="btn btn-sm" style="border-radius:var(--radius-full);padding:6px 14px;font-size:0.8rem;cursor:pointer;border:1px solid ${showStoryGuides ? "var(--rose-primary)" : "var(--border-subtle)"};background:${showStoryGuides ? "rgba(225,29,72,0.15)" : "var(--bg-surface)"};color:${showStoryGuides ? "var(--rose-light)" : "var(--text-muted)"};">
                🎭 Ide Cerita &amp; Konflik: ${showStoryGuides ? "Tampil" : "Sembunyi"}
              </button>

              ${!isDm ? `
                <button id="calOpenDmBtn" class="btn btn-sm" style="border-radius:var(--radius-full);padding:6px 14px;font-size:0.8rem;cursor:pointer;border:1px solid var(--border-subtle);background:var(--bg-surface);color:var(--text-dim);">
                  👑 Login DM
                </button>
              ` : `
                <span style="font-size:0.78rem;color:var(--amber-gold);background:rgba(245,158,11,0.12);border:1px solid var(--amber-gold);padding:5px 12px;border-radius:var(--radius-full);font-weight:700;">
                  👑 Mode DM Aktif
                </span>
              `}
            </div>
          </div>
        </div>

        <!-- KPI Summary Badges -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.85rem;margin-bottom:1.25rem;">
          <div style="background:rgba(225,29,72,0.1);border:1px solid rgba(225,29,72,0.4);border-radius:var(--radius-md);padding:0.85rem 1rem;display:flex;align-items:center;gap:12px;">
            <div style="font-size:1.75rem;">${stats.currentMonth.seasonIcon}</div>
            <div>
              <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--rose-light);font-weight:700;">📍 Bulan Sekarang</div>
              <div style="font-size:1.05rem;font-weight:800;color:var(--text-main);">${escapeHtml(stats.currentMonth.name)} — ${escapeHtml(stats.currentMonth.englishTitle)}</div>
              <div style="font-size:0.76rem;color:var(--text-muted);">Bulan ke-${stats.currentMonthOrder} dari 12 (${escapeHtml(stats.currentMonth.semesterLabel)})</div>
            </div>
          </div>

          <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.35);border-radius:var(--radius-md);padding:0.85rem 1rem;display:flex;align-items:center;gap:12px;">
            <div style="font-size:1.65rem;">✅</div>
            <div>
              <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:#34d399;font-weight:700;">Sudah Terlewati</div>
              <div style="font-size:1.05rem;font-weight:800;color:var(--text-main);">${stats.passedMonthsCount} Bulan • ${stats.completedEventsCount}/${stats.totalEventsCount} Event</div>
              <div style="font-size:0.76rem;color:var(--text-muted);">${stats.remainingMonthsCount} bulan akan datang menuju kenaikan kelas</div>
            </div>
          </div>

          <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.35);border-radius:var(--radius-md);padding:0.85rem 1rem;display:flex;align-items:center;gap:12px;">
            <div style="font-size:1.65rem;">💖</div>
            <div>
              <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--amber-gold);font-weight:700;">Fase Romance Aktif</div>
              <div style="font-size:1.0rem;font-weight:800;color:var(--text-main);">${escapeHtml(stats.currentMonth.romanceStageName)}</div>
              <div style="font-size:0.76rem;color:var(--text-muted);">${escapeHtml(stats.currentMonth.arcLabel)}</div>
            </div>
          </div>
        </div>

        <!-- Global Progress Bar -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;margin-bottom:0.4rem;">
            <span style="color:var(--text-dim);font-weight:600;">
              Progres Kalender Tahun Ajaran (April → Maret)
            </span>
            <span style="color:var(--amber-gold);font-weight:800;" class="stat-val">
              ${stats.percentage}% Selesai (${stats.completedEventsCount} dari ${stats.totalEventsCount} Agenda)
            </span>
          </div>
          <div style="width:100%;height:10px;background:var(--bg-darkest);border-radius:var(--radius-full);overflow:hidden;border:1px solid var(--border-subtle);">
            <div style="width:${stats.percentage}%;height:100%;background:linear-gradient(90deg, #10b981, var(--amber-gold), var(--rose-primary));transition:width 0.35s ease;"></div>
          </div>
        </div>
      </div>

      <!-- 12-MONTH TIMELINE STEPPER STRIP -->
      <div class="calendar-stepper-card" style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:1.1rem 1.25rem;margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.85rem;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-family:var(--font-heading);font-weight:700;font-size:0.95rem;color:var(--text-main);">
              🗓️ Garis Waktu 12 Bulan SMA Jepang
            </span>
            <span style="font-size:0.78rem;color:var(--text-muted);">
              (Klik bulan untuk membuka detail event atau menandai bulan aktif)
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;font-size:0.76rem;color:var(--text-muted);">
            <span style="display:inline-flex;align-items:center;gap:4px;"><span style="color:#34d399;">✅</span> Sudah Lewat</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><span style="color:var(--rose-light);">🌸</span> Bulan Sekarang</span>
            <span style="display:inline-flex;align-items:center;gap:4px;"><span>⏳</span> Akan Datang</span>
          </div>
        </div>

        <div class="calendar-month-strip" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(88px, 1fr));gap:0.5rem;">
          ${SCHOOL_CALENDAR_MONTHS.map((m) => {
            const status = getMonthProgressiveStatus(m.id, calendarState.currentMonthId);
            const cfg = getStatusConfig(status);
            const counts = getMonthCompletionCounts(m, calendarState);
            const isSelected = m.id === selectedMonth.id;

            return `
              <button
                type="button"
                class="cal-month-pill"
                data-month-id="${m.id}"
                style="background:${cfg.pillBg};border:${isSelected ? "2px solid var(--amber-gold)" : `1px solid ${cfg.cardBorder}`};border-radius:var(--radius-md);padding:0.6rem 0.4rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;transition:all 0.2s ease;position:relative;${isSelected ? "transform:translateY(-2px);box-shadow:0 4px 12px rgba(245,158,11,0.25);" : ""}"
              >
                <div style="font-size:0.7rem;color:var(--text-muted);font-weight:600;">Bulan ${m.order}</div>
                <div style="display:flex;align-items:center;gap:4px;font-weight:800;font-size:0.92rem;color:${status === "current" ? "var(--rose-light)" : status === "passed" ? "#34d399" : "var(--text-main)"};">
                  <span>${cfg.icon}</span>
                  <span>${escapeHtml(m.shortName)}</span>
                </div>
                <div style="font-size:0.72rem;color:var(--text-dim);" class="stat-val">${counts.done}/${counts.total} Event</div>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- VIEW MODE TABS -->
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1.25rem;">
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button type="button" class="cal-tab-btn" data-tab="monthly" style="padding:0.6rem 1.15rem;border-radius:var(--radius-full);font-weight:700;font-size:0.85rem;cursor:pointer;border:1px solid ${activeTab === "monthly" ? "var(--rose-primary)" : "var(--border-card)"};background:${activeTab === "monthly" ? "var(--rose-primary)" : "var(--bg-card)"};color:${activeTab === "monthly" ? "#fff" : "var(--text-dim)"};">
            📅 Detail &amp; Checklist Bulan (${escapeHtml(selectedMonth.name)})
          </button>
          <button type="button" class="cal-tab-btn" data-tab="overview" style="padding:0.6rem 1.15rem;border-radius:var(--radius-full);font-weight:700;font-size:0.85rem;cursor:pointer;border:1px solid ${activeTab === "overview" ? "var(--rose-primary)" : "var(--border-card)"};background:${activeTab === "overview" ? "var(--rose-primary)" : "var(--bg-card)"};color:${activeTab === "overview" ? "#fff" : "var(--text-dim)"};">
            🗓️ Ringkasan 12 Bulan Setahun
          </button>
          <button type="button" class="cal-tab-btn" data-tab="worldbuilding" style="padding:0.6rem 1.15rem;border-radius:var(--radius-full);font-weight:700;font-size:0.85rem;cursor:pointer;border:1px solid ${activeTab === "worldbuilding" ? "var(--rose-primary)" : "var(--border-card)"};background:${activeTab === "worldbuilding" ? "var(--rose-primary)" : "var(--bg-card)"};color:${activeTab === "worldbuilding" ? "#fff" : "var(--text-dim)"};">
            💖 Peta Romance, Tradisi Elite &amp; Kelas 11
          </button>
        </div>

        <!-- Prev / Next Month Quick Navigation -->
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <button type="button" id="calPrevMonthBtn" class="btn btn-secondary btn-sm" style="padding:6px 12px;border-radius:var(--radius-md);cursor:pointer;">
            ← Bulan Sebelumnya
          </button>
          <button type="button" id="calJumpCurrentBtn" class="btn btn-secondary btn-sm" style="padding:6px 12px;border-radius:var(--radius-md);border-color:var(--rose-primary);color:var(--rose-light);cursor:pointer;">
            📍 Ke Bulan Sekarang (${escapeHtml(stats.currentMonth.shortName)})
          </button>
          <button type="button" id="calNextMonthBtn" class="btn btn-secondary btn-sm" style="padding:6px 12px;border-radius:var(--radius-md);cursor:pointer;">
            Bulan Berikutnya →
          </button>
        </div>
      </div>

      <!-- TAB CONTENT AREA -->
      <div id="calendarTabContent">
        ${activeTab === "monthly" ? renderMonthlyDetailTab(selectedMonth) : ""}
        ${activeTab === "overview" ? renderYearOverviewTab() : ""}
        ${activeTab === "worldbuilding" ? renderWorldbuildingTab() : ""}
      </div>

    </section>
  `;

  attachCalendarEvents(selectedMonth);
}

function renderMonthlyDetailTab(month: SchoolCalendarMonth): string {
  const status = getMonthProgressiveStatus(month.id, calendarState.currentMonthId);
  const cfg = getStatusConfig(status);
  const counts = getMonthCompletionCounts(month, calendarState);
  const completedSet = new Set(calendarState.completedEventIds);
  const allMonthDone = counts.total > 0 && counts.done === counts.total;
  const savedNote = calendarState.monthNotes?.[month.id] || "";

  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:1.5rem;align-items:start;">
      
      <!-- LEFT COLUMN: MONTH OVERVIEW, PROGRESSION CONTROLS & LORE HOOKS -->
      <div style="background:var(--bg-card);border:1.5px solid ${cfg.cardBorder};border-radius:var(--radius-lg);padding:1.5rem;display:flex;flex-direction:column;gap:1.15rem;box-shadow:var(--shadow-md);">
        
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <span style="font-size:0.78rem;padding:4px 10px;border-radius:var(--radius-full);background:var(--bg-surface);border:1px solid var(--border-subtle);color:var(--text-dim);font-weight:600;">
            ${escapeHtml(month.semesterLabel)}
          </span>
          <span style="font-size:0.8rem;padding:4px 12px;border-radius:var(--radius-full);font-weight:700;${cfg.badgeStyle}">
            ${cfg.icon} Status: ${cfg.label}
          </span>
        </div>

        <div>
          <div style="font-size:0.8rem;color:var(--amber-gold);font-weight:700;letter-spacing:0.03em;margin-bottom:0.2rem;">
            BULAN KE-${month.order} • ${escapeHtml(month.arcLabel.toUpperCase())}
          </div>
          <h2 style="font-family:var(--font-heading);font-size:1.65rem;color:var(--text-main);margin:0 0 0.35rem 0;">
            ${month.seasonIcon} ${escapeHtml(month.name)} — ${escapeHtml(month.englishTitle)}
          </h2>
          <div style="font-size:0.9rem;font-weight:700;color:var(--rose-light);margin-bottom:0.75rem;">
            Event Utama: ${escapeHtml(month.mainEventTitle)}
          </div>
          <p style="font-size:0.9rem;color:var(--text-dim);line-height:1.6;margin:0;">
            ${escapeHtml(month.summary)}
          </p>
        </div>

        <!-- PROGRESSIVE ACTION CONTROLS FOR THIS MONTH -->
        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1rem;display:flex;flex-direction:column;gap:0.75rem;">
          <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-muted);">
            ⚡ Kontrol Penanda Progres Bulan ${escapeHtml(month.name)}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.6rem;">
            ${
              status !== "current"
                ? `
              <button type="button" id="btnSetMonthAsCurrent" class="btn btn-primary btn-sm" style="flex:1;min-width:190px;padding:0.6rem 1rem;border-radius:var(--radius-md);font-weight:700;cursor:pointer;">
                📍 Jadikan "${escapeHtml(month.name)}" Bulan Sekarang
              </button>
            `
                : `
              <div style="flex:1;min-width:190px;padding:0.55rem 0.85rem;border-radius:var(--radius-md);background:rgba(225,29,72,0.12);border:1px solid var(--rose-primary);color:var(--rose-light);font-size:0.82rem;font-weight:700;text-align:center;">
                🌸 Bulan Ini Sedang Berlangsung
              </div>
            `
            }
            <button type="button" id="btnToggleAllMonthEvents" class="btn btn-secondary btn-sm" style="padding:0.6rem 1rem;border-radius:var(--radius-md);font-weight:700;cursor:pointer;border-color:${allMonthDone ? "var(--border-subtle)" : "#10b981"};color:${allMonthDone ? "var(--text-dim)" : "#34d399"};">
              ${allMonthDone ? "↩️ Reset Centang Bulan Ini" : "✅ Tandai Semua Event Selesai"}
            </button>
          </div>
          <div style="font-size:0.76rem;color:var(--text-muted);line-height:1.4;">
            💡 <em>Menjadikan bulan ini sebagai "Bulan Sekarang" akan otomatis menandai bulan-bulan sebelumnya sebagai <strong>Sudah Lewat (✅)</strong>.</em>
          </div>
        </div>

        ${
          showStoryGuides
            ? `
          <!-- ROMANCE SCENE & CONFLICT SEED BOX -->
          <div style="background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.35);border-radius:var(--radius-md);padding:1.1rem;display:flex;flex-direction:column;gap:0.65rem;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <span style="font-size:0.82rem;font-weight:800;color:var(--amber-gold);text-transform:uppercase;letter-spacing:0.03em;">
                🎭 Ide Adegan Memorable: ${escapeHtml(month.memorableSceneTitle)}
              </span>
              <span style="font-size:0.72rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(225,29,72,0.15);color:var(--rose-light);font-weight:700;">
                ${escapeHtml(month.romanceStageName)}
              </span>
            </div>
            <p style="font-size:0.86rem;color:var(--text-main);line-height:1.55;margin:0;">
              ${escapeHtml(month.memorableSceneStory)}
            </p>
            <div style="border-top:1px dashed rgba(245,158,11,0.3);padding-top:0.55rem;font-size:0.83rem;color:var(--text-dim);line-height:1.5;">
              <strong style="color:var(--rose-light);">⚡ Benih Konflik / Perkembangan:</strong> ${escapeHtml(month.conflictSeed)}
            </div>
          </div>
        `
            : ""
        }

        <!-- CAMPAIGN / SESSION JOURNAL NOTE FOR THIS MONTH -->
        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1rem;display:flex;flex-direction:column;gap:0.5rem;">
          <label for="calMonthNoteTextarea" style="font-size:0.82rem;font-weight:700;color:var(--text-main);display:flex;align-items:center;justify-content:space-between;">
            <span>📝 Jurnal / Ringkasan Kejadian Party di Bulan ${escapeHtml(month.name)}</span>
            <span style="font-size:0.72rem;color:var(--text-muted);font-weight:400;">Tersimpan otomatis saat klik Simpan</span>
          </label>
          <textarea
            id="calMonthNoteTextarea"
            rows="3"
            class="input-text"
            placeholder="Catat momen penting yang terjadi pada karakter pemain di bulan ${escapeHtml(month.name)} (misal: hasil lomba Taiikusai, siapa yang satu kelompok di Kyoto, dll.)..."
            style="width:100%;resize:vertical;font-size:0.85rem;line-height:1.5;padding:0.65rem;"
          >${escapeHtml(savedNote)}</textarea>
          <div style="display:flex;justify-content:flex-end;">
            <button type="button" id="btnSaveMonthNote" class="btn btn-secondary btn-sm" style="padding:5px 14px;border-radius:var(--radius-md);font-size:0.8rem;cursor:pointer;border-color:var(--amber-gold);color:var(--amber-gold);">
              💾 Simpan Jurnal Bulan ${escapeHtml(month.shortName)}
            </button>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: PROGRESSIVE EVENT CHECKLIST & CUSTOM PARTY EVENTS -->
      <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:1.5rem;display:flex;flex-direction:column;gap:1.15rem;box-shadow:var(--shadow-md);">
        
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;border-bottom:1px solid var(--border-subtle);padding-bottom:0.85rem;">
          <div>
            <h3 style="font-family:var(--font-heading);font-size:1.2rem;color:var(--text-main);margin:0;">
              📋 Daftar Agenda &amp; Event Bulan ${escapeHtml(month.name)}
            </h3>
            <p style="font-size:0.8rem;color:var(--text-muted);margin:0.2rem 0 0 0;">
              Klik kartu atau kotak centang untuk menandai event yang sudah dilewati oleh party.
            </p>
          </div>
          <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);padding:5px 12px;border-radius:var(--radius-full);font-size:0.82rem;font-weight:800;color:${allMonthDone ? "#34d399" : "var(--amber-gold)"};" class="stat-val">
            ${counts.done} / ${counts.total} Selesai (${counts.pct}%)
          </div>
        </div>

        <!-- Built-in Events List -->
        <div style="display:flex;flex-direction:column;gap:0.7rem;">
          ${month.events
            .map((ev) => {
              const isDone = completedSet.has(ev.id);
              return `
                <div
                  class="cal-event-check-row"
                  data-event-id="${ev.id}"
                  style="background:${isDone ? "rgba(16,185,129,0.08)" : "var(--bg-surface)"};border:1px solid ${isDone ? "rgba(16,185,129,0.45)" : ev.isKeyEvent ? "rgba(225,29,72,0.35)" : "var(--border-subtle)"};border-radius:var(--radius-md);padding:0.9rem 1rem;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:flex-start;gap:0.85rem;"
                >
                  <input
                    type="checkbox"
                    ${isDone ? "checked" : ""}
                    style="margin-top:0.25rem;width:17px;height:17px;accent-color:#10b981;cursor:pointer;pointer-events:none;flex-shrink:0;"
                  />
                  <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:0.25rem;">
                      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <span style="font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:var(--radius-xs);background:var(--bg-card);color:var(--amber-gold);border:1px solid var(--border-subtle);">
                          ${escapeHtml(ev.periodLabel)}
                        </span>
                        ${
                          ev.japaneseTerm
                            ? `<span style="font-size:0.74rem;color:var(--text-muted);">${escapeHtml(ev.japaneseTerm)}</span>`
                            : ""
                        }
                        ${
                          ev.isKeyEvent
                            ? `<span style="font-size:0.68rem;font-weight:800;padding:1px 7px;border-radius:var(--radius-full);background:rgba(225,29,72,0.2);color:var(--rose-light);">★ KEY EVENT</span>`
                            : ""
                        }
                      </div>
                      <span style="font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:var(--radius-full);${getCategoryBadgeStyle(ev.category)}">
                        ${escapeHtml(ev.category)}
                      </span>
                    </div>

                    <div style="font-weight:700;font-size:0.94rem;color:${isDone ? "var(--text-muted)" : "var(--text-main)"};${isDone ? "text-decoration:line-through;" : ""};margin-bottom:0.25rem;">
                      ${escapeHtml(ev.title)}
                    </div>
                    <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.45;margin:0;">
                      ${escapeHtml(ev.description)}
                    </p>
                  </div>
                </div>
              `;
            })
            .join("")}

          <!-- Custom Party Events for this Month -->
          ${counts.monthCustom
            .map((ce) => {
              return `
                <div
                  class="cal-event-check-row"
                  data-event-id="${ce.id}"
                  style="background:${ce.done ? "rgba(16,185,129,0.08)" : "rgba(6,182,212,0.08)"};border:1px solid ${ce.done ? "rgba(16,185,129,0.45)" : "rgba(6,182,212,0.4)"};border-radius:var(--radius-md);padding:0.85rem 1rem;cursor:pointer;display:flex;align-items:flex-start;gap:0.85rem;"
                >
                  <input
                    type="checkbox"
                    ${ce.done ? "checked" : ""}
                    style="margin-top:0.25rem;width:17px;height:17px;accent-color:#10b981;cursor:pointer;pointer-events:none;flex-shrink:0;"
                  />
                  <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:0.2rem;">
                      <span style="font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:var(--radius-full);${getCategoryBadgeStyle(ce.category)}">
                        ✨ ${escapeHtml(ce.category)}
                      </span>
                      <button
                        type="button"
                        class="cal-delete-custom-btn"
                        data-custom-id="${ce.id}"
                        title="Hapus event tambahan ini"
                        style="background:transparent;border:none;color:var(--rose-light);font-size:0.76rem;cursor:pointer;padding:2px 6px;"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                    <div style="font-weight:700;font-size:0.92rem;color:${ce.done ? "var(--text-muted)" : "var(--text-main)"};${ce.done ? "text-decoration:line-through;" : ""};">
                      ${escapeHtml(ce.title)}
                    </div>
                    ${
                      ce.note
                        ? `<p style="font-size:0.8rem;color:var(--text-muted);margin:0.2rem 0 0 0;">${escapeHtml(ce.note)}</p>`
                        : ""
                    }
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>

        <!-- ADD CUSTOM EVENT FORM -->
        <div style="border-top:1px solid var(--border-subtle);padding-top:1rem;margin-top:auto;">
          <div style="font-size:0.8rem;font-weight:700;color:var(--text-dim);margin-bottom:0.5rem;">
            ➕ Tambah Event Khusus / Momen Sesi Party di Bulan ${escapeHtml(month.name)}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
            <input
              type="text"
              id="calCustomEventTitleInput"
              class="input-text"
              placeholder="Contoh: Kencan sepulang sekolah di kafe stasiun / Tanding persahabatan Kendo..."
              style="flex:1;min-width:210px;font-size:0.84rem;padding:0.55rem 0.75rem;"
            />
            <select
              id="calCustomEventCatSelect"
              class="input-text"
              style="font-size:0.82rem;padding:0.55rem 0.65rem;background:var(--bg-input);"
            >
              <option value="Momen Party">✨ Momen Party</option>
              <option value="Romance">💖 Romance</option>
              <option value="Ekskul">🏆 Ekskul</option>
              <option value="Kompetisi">⚔️ Kompetisi</option>
              <option value="Slice of Life">🌸 Slice of Life</option>
              <option value="Ujian">📚 Ujian / Akademik</option>
            </select>
            <button
              type="button"
              id="btnAddCustomCalendarEvent"
              class="btn btn-primary btn-sm"
              style="padding:0.55rem 1rem;border-radius:var(--radius-md);font-weight:700;cursor:pointer;"
            >
              + Tambah
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderYearOverviewTab(): string {
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:1.25rem;">
      ${SCHOOL_CALENDAR_MONTHS.map((m) => {
        const status = getMonthProgressiveStatus(m.id, calendarState.currentMonthId);
        const cfg = getStatusConfig(status);
        const counts = getMonthCompletionCounts(m, calendarState);
        const note = calendarState.monthNotes?.[m.id];

        return `
          <div
            class="cal-overview-card"
            style="background:var(--bg-card);border:1.5px solid ${cfg.cardBorder};border-radius:var(--radius-lg);padding:1.25rem;display:flex;flex-direction:column;justify-content:space-between;gap:0.9rem;box-shadow:var(--shadow-sm);"
          >
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:0.55rem;">
                <span style="font-size:0.74rem;font-weight:700;color:var(--text-muted);">
                  BULAN ${m.order} • ${escapeHtml(m.semesterLabel)}
                </span>
                <span style="font-size:0.74rem;padding:3px 10px;border-radius:var(--radius-full);font-weight:700;${cfg.badgeStyle}">
                  ${cfg.icon} ${cfg.label}
                </span>
              </div>

              <h3 style="font-family:var(--font-heading);font-size:1.2rem;color:var(--text-main);margin:0 0 0.25rem 0;">
                ${m.seasonIcon} ${escapeHtml(m.name)} — ${escapeHtml(m.englishTitle)}
              </h3>
              <div style="font-size:0.8rem;font-weight:700;color:var(--rose-light);margin-bottom:0.5rem;">
                ${escapeHtml(m.mainEventTitle)}
              </div>
              <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5;margin:0 0 0.75rem 0;">
                ${escapeHtml(m.summary)}
              </p>

              <!-- Mini Progress Bar -->
              <div style="margin-bottom:0.5rem;">
                <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:3px;">
                  <span style="color:var(--text-dim);">Progres Event</span>
                  <span style="font-weight:700;color:var(--amber-gold);" class="stat-val">${counts.done}/${counts.total} (${counts.pct}%)</span>
                </div>
                <div style="width:100%;height:6px;background:var(--bg-darkest);border-radius:var(--radius-full);overflow:hidden;">
                  <div style="width:${counts.pct}%;height:100%;background:${status === "passed" ? "#10b981" : "var(--rose-primary)"};"></div>
                </div>
              </div>

              ${
                note
                  ? `
                <div style="background:var(--bg-surface);border-left:3px solid var(--amber-gold);padding:0.45rem 0.65rem;border-radius:var(--radius-xs);font-size:0.78rem;color:var(--text-dim);margin-top:0.5rem;">
                  <strong>📝 Jurnal:</strong> ${escapeHtml(note)}
                </div>
              `
                  : ""
              }
            </div>

            <div style="display:flex;gap:0.5rem;border-top:1px solid var(--border-subtle);padding-top:0.8rem;">
              <button
                type="button"
                class="btn btn-secondary btn-sm cal-open-month-detail-btn"
                data-month-id="${m.id}"
                style="flex:1;padding:6px 10px;border-radius:var(--radius-md);font-size:0.8rem;cursor:pointer;"
              >
                📂 Buka Agenda
              </button>
              ${
                status !== "current"
                  ? `
                <button
                  type="button"
                  class="btn btn-primary btn-sm cal-quick-set-current-btn"
                  data-month-id="${m.id}"
                  style="padding:6px 10px;border-radius:var(--radius-md);font-size:0.8rem;cursor:pointer;"
                >
                  📍 Set Sekarang
                </button>
              `
                  : ""
              }
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderWorldbuildingTab(): string {
  return `
    <div style="display:flex;flex-direction:column;gap:2rem;">
      
      <!-- 1. PETA PERKEMBANGAN ROMANCE SELAMA SETAHUN -->
      <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:1.5rem;">
        <h3 style="font-family:var(--font-heading);font-size:1.35rem;color:var(--amber-gold);margin:0 0 0.35rem 0;">
          💖 Peta Perkembangan Romance Setahun (Slow Burn: April – Maret)
        </h3>
        <p style="font-size:0.88rem;color:var(--text-muted);margin:0 0 1.25rem 0;">
          Setiap event mengubah hubungan antar-karakter secara bertahap—pertemuan di bulan April membawa konsekuensi di festival musim gugur, hingga bermuara pada kelulusan senior di bulan Maret.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">
          ${SCHOOL_ROMANCE_ARCS.map((arc) => {
            const isCurrentArc = arc.monthIds.includes(calendarState.currentMonthId);
            return `
              <div style="background:${isCurrentArc ? "rgba(225,29,72,0.12)" : "var(--bg-surface)"};border:1px solid ${isCurrentArc ? "var(--rose-primary)" : "var(--border-subtle)"};border-radius:var(--radius-md);padding:1.1rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                  <span style="font-size:0.75rem;font-weight:800;color:var(--rose-light);text-transform:uppercase;">
                    ${escapeHtml(arc.monthsLabel)}
                  </span>
                  ${
                    isCurrentArc
                      ? `<span style="font-size:0.7rem;padding:2px 8px;border-radius:var(--radius-full);background:var(--rose-primary);color:#fff;font-weight:700;">FASE AKTIF</span>`
                      : ""
                  }
                </div>
                <div style="font-family:var(--font-heading);font-size:1.05rem;font-weight:700;color:var(--text-main);margin-bottom:0.2rem;">
                  ${arc.icon} ${escapeHtml(arc.title)}
                </div>
                <div style="font-size:0.8rem;font-weight:600;color:var(--amber-gold);margin-bottom:0.45rem;">
                  ${escapeHtml(arc.subtitle)}
                </div>
                <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5;margin:0;">
                  ${escapeHtml(arc.description)}
                </p>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- 2. TRADISI KHUSUS AKADEMI ELITE -->
      <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:1.5rem;">
        <h3 style="font-family:var(--font-heading);font-size:1.35rem;color:var(--amber-gold);margin:0 0 0.35rem 0;">
          🏛️ Tradisi Khusus Akademi Elite
        </h3>
        <p style="font-size:0.88rem;color:var(--text-muted);margin:0 0 1.25rem 0;">
          Empat perhelatan prestisius yang memperkuat atmosfer kompetisi akademik, status sosial keluarga, dan regenerasi kepemimpinan siswa.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(270px, 1fr));gap:1rem;">
          ${SCHOOL_ELITE_TRADITIONS.map((tr) => {
            return `
              <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.15rem;display:flex;flex-direction:column;gap:0.45rem;">
                <div style="font-size:0.74rem;color:var(--amber-gold);font-weight:700;">
                  🗓️ ${escapeHtml(tr.timingLabel)}
                </div>
                <div style="font-family:var(--font-heading);font-size:1.05rem;font-weight:700;color:var(--text-main);">
                  ${tr.icon} ${escapeHtml(tr.title)}
                </div>
                ${
                  tr.japaneseSubtitle
                    ? `<div style="font-size:0.78rem;color:var(--rose-light);font-weight:600;">${escapeHtml(tr.japaneseSubtitle)}</div>`
                    : ""
                }
                <p style="font-size:0.82rem;color:var(--text-dim);line-height:1.5;margin:0;">
                  ${escapeHtml(tr.description)}
                </p>
                <div style="font-size:0.78rem;color:var(--text-muted);border-top:1px dashed var(--border-subtle);padding-top:0.45rem;margin-top:auto;">
                  <strong>Potensi Cerita:</strong> ${escapeHtml(tr.storyPotential)}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- 3. ELEMEN KESEHARIAN SMA JEPANG & PREVIEW KELAS 11 -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:1.5rem;">
        <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:1.5rem;">
          <h3 style="font-family:var(--font-heading);font-size:1.25rem;color:var(--amber-gold);margin:0 0 0.85rem 0;">
            🎒 Detail Keseharian Penghubung Antar-Festival
          </h3>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${SCHOOL_DAILY_ROUTINES.map((rt) => {
              return `
                <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.85rem 1rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
                    <strong style="font-size:0.9rem;color:var(--text-main);">${rt.icon} ${escapeHtml(rt.title)}</strong>
                    <span style="font-size:0.75rem;color:var(--rose-light);">${escapeHtml(rt.japaneseTerm)}</span>
                  </div>
                  <p style="font-size:0.8rem;color:var(--text-muted);line-height:1.45;margin:0 0 0.3rem 0;">
                    ${escapeHtml(rt.description)}
                  </p>
                  <div style="font-size:0.76rem;color:var(--amber-gold);">
                    🎲 <em>${escapeHtml(rt.gameplayHook)}</em>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div style="background:var(--bg-card);border:1px solid var(--amber-gold);border-radius:var(--radius-lg);padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="display:inline-block;padding:3px 10px;border-radius:var(--radius-full);background:rgba(245,158,11,0.15);color:var(--amber-gold);font-size:0.74rem;font-weight:800;margin-bottom:0.6rem;">
              NEXT CHAPTER • BABAK BERIKUTNYA
            </div>
            <h3 style="font-family:var(--font-heading);font-size:1.35rem;color:var(--text-main);margin:0 0 0.3rem 0;">
              ${escapeHtml(YEAR_TWO_PREVIEW.title)}
            </h3>
            <p style="font-size:0.84rem;color:var(--text-muted);margin:0 0 1.1rem 0;">
              Setelah melewati upacara kelulusan senior di bulan Maret, protagonis dan rekan-rekannya kembali ke akademi pada bulan April berikutnya dengan status baru:
            </p>

            <div style="display:flex;flex-direction:column;gap:0.85rem;">
              ${YEAR_TWO_PREVIEW.pillars
                .map((p) => {
                  return `
                    <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:0.95rem 1rem;">
                      <div style="font-weight:800;font-size:0.92rem;color:var(--amber-gold);margin-bottom:0.25rem;">
                        ${p.icon} ${escapeHtml(p.title)}
                      </div>
                      <p style="font-size:0.82rem;color:var(--text-dim);line-height:1.5;margin:0;">
                        ${escapeHtml(p.description)}
                      </p>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>

          <div style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
            <span style="font-size:0.8rem;color:var(--text-muted);">
              Siap memulai Tahun ke-2 (Kelas 11)?
            </span>
            <button
              type="button"
              id="btnStartYearTwo"
              class="btn btn-primary btn-sm"
              style="background:var(--amber-gold);border-color:var(--amber-gold);color:#0b0f19;font-weight:800;border-radius:var(--radius-md);padding:6px 14px;cursor:pointer;"
            >
              🎓 Beralih ke Kalender Kelas 11
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

function attachCalendarEvents(selectedMonth: SchoolCalendarMonth) {
  // 1. Academic Year selector
  const yearSelect = document.getElementById("calAcademicYearSelect") as HTMLSelectElement | null;
  yearSelect?.addEventListener("change", async () => {
    const nextYear = Number(yearSelect.value) === 2 ? 2 : 1;
    calendarState = await saveSchoolCalendarState({
      ...calendarState,
      academicYear: nextYear
    });
    showToast(
      nextYear === 2
        ? "Kalender diatur ke Tahun ke-2: Kelas 11 (Kōkō Ninensei)."
        : "Kalender diatur ke Tahun ke-1: Kelas 10 (Kōkō Ichinensei).",
      "info"
    );
    renderCalendarDOM();
  });

  // 2. Toggle Story Guide visibility
  document.getElementById("calToggleStoryGuideBtn")?.addEventListener("click", () => {
    showStoryGuides = !showStoryGuides;
    renderCalendarDOM();
  });

  // 3. DM Login Modal button
  document.getElementById("calOpenDmBtn")?.addEventListener("click", () => {
    dmAuthModal.open(() => renderCalendarDOM());
  });

  // 4. 12-Month Stepper Pills
  document.querySelectorAll(".cal-month-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const mId = pill.getAttribute("data-month-id") as SchoolCalendarMonthId | null;
      if (mId && SCHOOL_MONTH_ORDER.includes(mId)) {
        selectedMonthId = mId;
        renderCalendarDOM();
      }
    });
  });

  // 5. View Mode Tabs
  document.querySelectorAll(".cal-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab") as CalendarTabMode | null;
      if (tab) {
        activeTab = tab;
        renderCalendarDOM();
      }
    });
  });

  // 6. Prev / Next / Jump Current Month Buttons
  document.getElementById("calPrevMonthBtn")?.addEventListener("click", () => {
    const idx = SCHOOL_MONTH_ORDER.indexOf(selectedMonth.id);
    const prevIdx = idx > 0 ? idx - 1 : SCHOOL_MONTH_ORDER.length - 1;
    selectedMonthId = SCHOOL_MONTH_ORDER[prevIdx];
    activeTab = "monthly";
    renderCalendarDOM();
  });

  document.getElementById("calNextMonthBtn")?.addEventListener("click", () => {
    const idx = SCHOOL_MONTH_ORDER.indexOf(selectedMonth.id);
    const nextIdx = idx < SCHOOL_MONTH_ORDER.length - 1 ? idx + 1 : 0;
    selectedMonthId = SCHOOL_MONTH_ORDER[nextIdx];
    activeTab = "monthly";
    renderCalendarDOM();
  });

  document.getElementById("calJumpCurrentBtn")?.addEventListener("click", () => {
    selectedMonthId = calendarState.currentMonthId;
    activeTab = "monthly";
    renderCalendarDOM();
  });

  // 7. Set Selected Month as Current Month (Progressive Auto-Pass Previous Months)
  document.getElementById("btnSetMonthAsCurrent")?.addEventListener("click", async () => {
    const nextState = applySetCurrentMonth(calendarState, selectedMonth.id, true);
    calendarState = await saveSchoolCalendarState(nextState);
    showToast(
      `📍 Bulan sekarang diatur ke ${selectedMonth.name}! Bulan-bulan sebelumnya otomatis ditandai Sudah Lewat.`,
      "success"
    );
    renderCalendarDOM();
  });

  // 8. Mark All / Reset Events in Selected Month
  document.getElementById("btnToggleAllMonthEvents")?.addEventListener("click", async () => {
    const counts = getMonthCompletionCounts(selectedMonth, calendarState);
    const shouldMarkDone = !(counts.total > 0 && counts.done === counts.total);
    const nextState = applyMarkMonthEvents(calendarState, selectedMonth.id, shouldMarkDone);
    calendarState = await saveSchoolCalendarState(nextState);
    showToast(
      shouldMarkDone
        ? `✅ Semua event di bulan ${selectedMonth.name} ditandai selesai!`
        : `↩️ Status centang event bulan ${selectedMonth.name} direset.`,
      "info"
    );
    renderCalendarDOM();
  });

  // 9. Individual Event Checkbox Toggles
  document.querySelectorAll(".cal-event-check-row").forEach((row) => {
    row.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".cal-delete-custom-btn")) return;

      const eventId = row.getAttribute("data-event-id");
      if (!eventId) return;

      const nextState = applyToggleEventDone(calendarState, eventId);
      calendarState = await saveSchoolCalendarState(nextState);
      renderCalendarDOM();
    });
  });

  // 10. Delete Custom Event
  document.querySelectorAll(".cal-delete-custom-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const customId = btn.getAttribute("data-custom-id");
      if (!customId) return;

      const nextState = applyDeleteCustomEvent(calendarState, customId);
      calendarState = await saveSchoolCalendarState(nextState);
      showToast("Event tambahan dihapus.", "info");
      renderCalendarDOM();
    });
  });

  // 11. Add Custom Party Event
  const addCustomHandler = async () => {
    const titleInput = document.getElementById("calCustomEventTitleInput") as HTMLInputElement | null;
    const catSelect = document.getElementById("calCustomEventCatSelect") as HTMLSelectElement | null;
    const rawTitle = titleInput?.value.trim() || "";
    if (!rawTitle) {
      showToast("Masukkan nama event atau momen party terlebih dahulu.", "error");
      return;
    }

    const category = (catSelect?.value as SchoolEventCategoryTag) || "Momen Party";
    const nextState = applyAddCustomEvent(calendarState, selectedMonth.id, rawTitle, category);
    calendarState = await saveSchoolCalendarState(nextState);
    showToast(`✨ Momen party ditambahkan ke bulan ${selectedMonth.name}!`, "success");
    renderCalendarDOM();
  };

  document.getElementById("btnAddCustomCalendarEvent")?.addEventListener("click", addCustomHandler);
  document.getElementById("calCustomEventTitleInput")?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomHandler();
    }
  });

  // 12. Save Month Journal Note
  document.getElementById("btnSaveMonthNote")?.addEventListener("click", async () => {
    const noteEl = document.getElementById("calMonthNoteTextarea") as HTMLTextAreaElement | null;
    const noteText = noteEl?.value || "";
    const nextState = applySaveMonthNote(calendarState, selectedMonth.id, noteText);
    calendarState = await saveSchoolCalendarState(nextState);
    showToast(`💾 Jurnal kampanye bulan ${selectedMonth.name} berhasil disimpan!`, "success");
  });

  // 13. Overview Tab Quick Actions
  document.querySelectorAll(".cal-open-month-detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mId = btn.getAttribute("data-month-id") as SchoolCalendarMonthId | null;
      if (mId && SCHOOL_MONTH_ORDER.includes(mId)) {
        selectedMonthId = mId;
        activeTab = "monthly";
        renderCalendarDOM();
      }
    });
  });

  document.querySelectorAll(".cal-quick-set-current-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const mId = btn.getAttribute("data-month-id") as SchoolCalendarMonthId | null;
      if (mId && SCHOOL_MONTH_ORDER.includes(mId)) {
        selectedMonthId = mId;
        const nextState = applySetCurrentMonth(calendarState, mId, true);
        calendarState = await saveSchoolCalendarState(nextState);
        const mObj = SCHOOL_CALENDAR_MONTHS.find((x) => x.id === mId);
        showToast(`📍 Bulan sekarang diatur ke ${mObj?.name || mId}!`, "success");
        renderCalendarDOM();
      }
    });
  });

  // 14. Worldbuilding Tab: Switch to Year 2 (Kelas 11)
  document.getElementById("btnStartYearTwo")?.addEventListener("click", async () => {
    calendarState = await saveSchoolCalendarState({
      ...calendarState,
      academicYear: 2,
      currentMonthId: "april"
    });
    selectedMonthId = "april";
    activeTab = "monthly";
    showToast("🎓 Memasuki Tahun ke-2: Kelas 11 (Kōkō Ninensei) dimulai dari bulan April!", "success");
    renderCalendarDOM();
  });
}
