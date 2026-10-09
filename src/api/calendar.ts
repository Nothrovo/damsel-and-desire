import { supabase } from "./supabase";
import {
  SCHOOL_CALENDAR_MONTHS,
  SCHOOL_MONTH_ORDER
} from "../data/schoolCalendarData";
import type {
  SchoolCalendarCustomEvent,
  SchoolCalendarMonthId,
  SchoolCalendarState,
  SchoolEventCategoryTag
} from "../types";

const LOCAL_STORAGE_KEY = "damsel_school_calendar_state_v1";
const DEFAULT_ROW_ID = "housen_default";

export function getDefaultCalendarState(): SchoolCalendarState {
  return {
    currentMonthId: "april",
    completedEventIds: [],
    customEvents: [],
    monthNotes: {},
    academicYear: 1,
    updatedAt: new Date().toISOString()
  };
}

export function normalizeCalendarState(raw: any): SchoolCalendarState {
  const fallback = getDefaultCalendarState();
  if (!raw || typeof raw !== "object") return fallback;

  const rawMonth = raw.currentMonthId || raw.current_month_id;
  const currentMonthId: SchoolCalendarMonthId = SCHOOL_MONTH_ORDER.includes(rawMonth)
    ? rawMonth
    : "april";

  const rawCompleted = raw.completedEventIds ?? raw.completed_event_ids;
  const completedEventIds: string[] = Array.isArray(rawCompleted)
    ? Array.from(new Set(rawCompleted.filter((x: any) => typeof x === "string")))
    : [];

  const rawCustom = raw.customEvents ?? raw.custom_events;
  const customEvents: SchoolCalendarCustomEvent[] = Array.isArray(rawCustom)
    ? rawCustom
        .filter((item: any) => item && typeof item.id === "string" && typeof item.title === "string")
        .map((item: any) => ({
          id: item.id,
          monthId: SCHOOL_MONTH_ORDER.includes(item.monthId) ? item.monthId : "april",
          title: item.title,
          note: item.note || "",
          category: (item.category as SchoolEventCategoryTag) || "Momen Party",
          done: Boolean(item.done),
          createdAt: item.createdAt || new Date().toISOString()
        }))
    : [];

  const rawNotes = raw.monthNotes ?? raw.month_notes;
  const monthNotes: Partial<Record<SchoolCalendarMonthId, string>> =
    rawNotes && typeof rawNotes === "object" && !Array.isArray(rawNotes) ? { ...rawNotes } : {};

  const academicYear =
    typeof (raw.academicYear ?? raw.academic_year) === "number"
      ? Number(raw.academicYear ?? raw.academic_year)
      : 1;

  return {
    currentMonthId,
    completedEventIds,
    customEvents,
    monthNotes,
    academicYear,
    updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString()
  };
}

export function loadLocalCalendarState(): SchoolCalendarState {
  try {
    if (typeof localStorage === "undefined") return getDefaultCalendarState();
    const rawStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawStr) return getDefaultCalendarState();
    return normalizeCalendarState(JSON.parse(rawStr));
  } catch {
    return getDefaultCalendarState();
  }
}

export function saveLocalCalendarState(state: SchoolCalendarState): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Gagal menyimpan progres kalender ke localStorage:", e);
  }
}

export async function fetchSchoolCalendarState(): Promise<SchoolCalendarState> {
  const localState = loadLocalCalendarState();
  try {
    const { data, error } = await supabase
      .from("school_calendar_state")
      .select("*")
      .eq("id", DEFAULT_ROW_ID)
      .maybeSingle();

    if (!error && data) {
      const remoteState = normalizeCalendarState(data);
      // Gunakan state yang paling baru diupdate antara remote & local (jika local pernah diubah saat tabel belum ada)
      const localTime = new Date(localState.updatedAt || 0).getTime();
      const remoteTime = new Date(remoteState.updatedAt || 0).getTime();
      if (
        remoteState.completedEventIds.length === 0 &&
        remoteState.customEvents.length === 0 &&
        remoteState.currentMonthId === "april" &&
        (localState.completedEventIds.length > 0 ||
          localState.customEvents.length > 0 ||
          localState.currentMonthId !== "april") &&
        localTime >= remoteTime
      ) {
        return localState;
      }
      saveLocalCalendarState(remoteState);
      return remoteState;
    }
  } catch {
    // Fallback ke local state bila tabel belum dimigrasikan atau sedang offline
  }
  return localState;
}

export async function saveSchoolCalendarState(state: SchoolCalendarState): Promise<SchoolCalendarState> {
  const updated: SchoolCalendarState = {
    ...state,
    updatedAt: new Date().toISOString()
  };

  saveLocalCalendarState(updated);

  try {
    await supabase.from("school_calendar_state").upsert({
      id: DEFAULT_ROW_ID,
      current_month_id: updated.currentMonthId,
      completed_event_ids: updated.completedEventIds,
      custom_events: updated.customEvents,
      month_notes: updated.monthNotes,
      academic_year: updated.academicYear,
      updated_at: updated.updatedAt
    });
  } catch {
    // Tetap aman di localStorage
  }

  return updated;
}

// ============================================================================
// Pure State Transformation Helpers (Progresif & Mudah Diuji)
// ============================================================================

/**
 * Mengatur bulan aktif ("Bulan Sekarang").
 * Bila autoCompletePreviousMonths = true, seluruh event pada bulan-bulan sebelum
 * targetMonthId otomatis ditandai selesai (Sudah Lewat).
 */
export function applySetCurrentMonth(
  state: SchoolCalendarState,
  targetMonthId: SchoolCalendarMonthId,
  autoCompletePreviousMonths: boolean = true
): SchoolCalendarState {
  const targetIdx = SCHOOL_MONTH_ORDER.indexOf(targetMonthId);
  if (targetIdx === -1) return state;

  const completedSet = new Set(state.completedEventIds);
  let updatedCustom = [...state.customEvents];

  if (autoCompletePreviousMonths) {
    SCHOOL_CALENDAR_MONTHS.forEach((month, idx) => {
      if (idx < targetIdx) {
        month.events.forEach((ev) => completedSet.add(ev.id));
      }
    });

    updatedCustom = updatedCustom.map((ce) => {
      const ceMonthIdx = SCHOOL_MONTH_ORDER.indexOf(ce.monthId);
      if (ceMonthIdx !== -1 && ceMonthIdx < targetIdx) {
        return { ...ce, done: true };
      }
      return ce;
    });
  }

  return {
    ...state,
    currentMonthId: targetMonthId,
    completedEventIds: Array.from(completedSet),
    customEvents: updatedCustom,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Mencentang atau membatalkan centang satu event (bawaan maupun custom).
 */
export function applyToggleEventDone(
  state: SchoolCalendarState,
  eventId: string,
  forceDone?: boolean
): SchoolCalendarState {
  // Cek apakah merupakan custom event
  const customIdx = state.customEvents.findIndex((ce) => ce.id === eventId);
  if (customIdx !== -1) {
    const updatedCustom = [...state.customEvents];
    const currentItem = updatedCustom[customIdx];
    const nextDone = forceDone !== undefined ? forceDone : !currentItem.done;
    updatedCustom[customIdx] = { ...currentItem, done: nextDone };
    return {
      ...state,
      customEvents: updatedCustom,
      updatedAt: new Date().toISOString()
    };
  }

  // Event bawaan kalender sekolah
  const completedSet = new Set(state.completedEventIds);
  const currentlyDone = completedSet.has(eventId);
  const nextDone = forceDone !== undefined ? forceDone : !currentlyDone;

  if (nextDone) {
    completedSet.add(eventId);
  } else {
    completedSet.delete(eventId);
  }

  return {
    ...state,
    completedEventIds: Array.from(completedSet),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Menandai semua event di dalam satu bulan menjadi Selesai (done=true) atau Belum Selesai (done=false).
 */
export function applyMarkMonthEvents(
  state: SchoolCalendarState,
  monthId: SchoolCalendarMonthId,
  done: boolean
): SchoolCalendarState {
  const monthObj = SCHOOL_CALENDAR_MONTHS.find((m) => m.id === monthId);
  if (!monthObj) return state;

  const completedSet = new Set(state.completedEventIds);
  monthObj.events.forEach((ev) => {
    if (done) {
      completedSet.add(ev.id);
    } else {
      completedSet.delete(ev.id);
    }
  });

  const updatedCustom = state.customEvents.map((ce) =>
    ce.monthId === monthId ? { ...ce, done } : ce
  );

  return {
    ...state,
    completedEventIds: Array.from(completedSet),
    customEvents: updatedCustom,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Menambahkan event khusus / momen party ke bulan tertentu.
 */
export function applyAddCustomEvent(
  state: SchoolCalendarState,
  monthId: SchoolCalendarMonthId,
  title: string,
  category: SchoolEventCategoryTag = "Momen Party",
  note: string = ""
): SchoolCalendarState {
  const cleanTitle = title.trim();
  if (!cleanTitle) return state;

  const newCustom: SchoolCalendarCustomEvent = {
    id: `custom_${monthId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    monthId,
    title: cleanTitle,
    note: note.trim(),
    category,
    done: true,
    createdAt: new Date().toISOString()
  };

  return {
    ...state,
    customEvents: [...state.customEvents, newCustom],
    updatedAt: new Date().toISOString()
  };
}

/**
 * Menghapus event khusus / momen party berdasarkan ID.
 */
export function applyDeleteCustomEvent(
  state: SchoolCalendarState,
  customEventId: string
): SchoolCalendarState {
  return {
    ...state,
    customEvents: state.customEvents.filter((ce) => ce.id !== customEventId),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Menyimpan catatan kampanye / rangkuman sesi pada suatu bulan.
 */
export function applySaveMonthNote(
  state: SchoolCalendarState,
  monthId: SchoolCalendarMonthId,
  note: string
): SchoolCalendarState {
  return {
    ...state,
    monthNotes: {
      ...state.monthNotes,
      [monthId]: note
    },
    updatedAt: new Date().toISOString()
  };
}
