import { describe, it, expect } from "vitest";
import {
  SCHOOL_CALENDAR_MONTHS,
  SCHOOL_DAILY_ROUTINES,
  SCHOOL_ELITE_TRADITIONS,
  SCHOOL_MONTH_ORDER,
  SCHOOL_ROMANCE_ARCS,
  YEAR_TWO_PREVIEW,
  calculateCalendarProgressStats,
  getMonthProgressiveStatus
} from "../src/data/schoolCalendarData";
import {
  applyAddCustomEvent,
  applyDeleteCustomEvent,
  applyMarkMonthEvents,
  applySaveMonthNote,
  applySetCurrentMonth,
  applyToggleEventDone,
  getDefaultCalendarState,
  normalizeCalendarState
} from "../src/api/calendar";

describe("School Calendar Data & Worldbuilding (Calender Sekolah.txt)", () => {
  it("contains all 12 months of the Japanese academic year from April to March", () => {
    expect(SCHOOL_CALENDAR_MONTHS).toHaveLength(12);
    expect(SCHOOL_MONTH_ORDER).toEqual([
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "january",
      "february",
      "march"
    ]);

    SCHOOL_CALENDAR_MONTHS.forEach((month, idx) => {
      expect(month.id).toBe(SCHOOL_MONTH_ORDER[idx]);
      expect(month.order).toBe(idx + 1);
      expect(month.events.length).toBeGreaterThanOrEqual(4);
      expect(month.memorableSceneTitle.length).toBeGreaterThan(0);
      expect(month.memorableSceneStory.length).toBeGreaterThan(0);
      expect(month.conflictSeed.length).toBeGreaterThan(0);
    });
  });

  it("includes all 6 romance progression stages, 4 elite traditions, and 6 daily routines", () => {
    expect(SCHOOL_ROMANCE_ARCS).toHaveLength(6);
    expect(SCHOOL_ELITE_TRADITIONS).toHaveLength(4);
    expect(SCHOOL_DAILY_ROUTINES).toHaveLength(6);
    expect(YEAR_TWO_PREVIEW.pillars).toHaveLength(3);
  });
});

describe("Progressive Calendar Tracking & State Transitions", () => {
  it("correctly determines passed, current, and upcoming month statuses", () => {
    expect(getMonthProgressiveStatus("april", "june")).toBe("passed");
    expect(getMonthProgressiveStatus("may", "june")).toBe("passed");
    expect(getMonthProgressiveStatus("june", "june")).toBe("current");
    expect(getMonthProgressiveStatus("july", "june")).toBe("upcoming");
    expect(getMonthProgressiveStatus("march", "june")).toBe("upcoming");
  });

  it("auto-completes events of preceding months when setting a new current month", () => {
    let state = getDefaultCalendarState();
    expect(state.currentMonthId).toBe("april");
    expect(state.completedEventIds).toHaveLength(0);

    // Set current month to June (index 2 -> April & May should be auto-completed)
    state = applySetCurrentMonth(state, "june", true);
    expect(state.currentMonthId).toBe("june");

    const aprilEvents = SCHOOL_CALENDAR_MONTHS[0].events.map((e) => e.id);
    const mayEvents = SCHOOL_CALENDAR_MONTHS[1].events.map((e) => e.id);
    const juneEvents = SCHOOL_CALENDAR_MONTHS[2].events.map((e) => e.id);

    aprilEvents.forEach((id) => expect(state.completedEventIds).toContain(id));
    mayEvents.forEach((id) => expect(state.completedEventIds).toContain(id));
    juneEvents.forEach((id) => expect(state.completedEventIds).not.toContain(id));

    const stats = calculateCalendarProgressStats(state);
    expect(stats.passedMonthsCount).toBe(2);
    expect(stats.currentMonthOrder).toBe(3);
    expect(stats.completedEventsCount).toBe(aprilEvents.length + mayEvents.length);
    expect(stats.percentage).toBeGreaterThan(0);
  });

  it("toggles individual built-in and custom events and marks entire month done/undone", () => {
    let state = getDefaultCalendarState();
    const firstEventId = SCHOOL_CALENDAR_MONTHS[0].events[0].id;

    state = applyToggleEventDone(state, firstEventId);
    expect(state.completedEventIds).toContain(firstEventId);

    state = applyToggleEventDone(state, firstEventId);
    expect(state.completedEventIds).not.toContain(firstEventId);

    // Mark all events in April done
    state = applyMarkMonthEvents(state, "april", true);
    expect(state.completedEventIds.length).toBe(SCHOOL_CALENDAR_MONTHS[0].events.length);

    // Reset all events in April
    state = applyMarkMonthEvents(state, "april", false);
    expect(state.completedEventIds).toHaveLength(0);
  });

  it("supports adding/deleting custom party events and saving month journal notes", () => {
    let state = getDefaultCalendarState();
    state = applyAddCustomEvent(
      state,
      "june",
      "Lari estafet bareng Heroine waktu hujan",
      "Momen Party",
      "Menang juara 2"
    );

    expect(state.customEvents).toHaveLength(1);
    const customId = state.customEvents[0].id;
    expect(state.customEvents[0].done).toBe(true);

    // Toggle custom event off
    state = applyToggleEventDone(state, customId);
    expect(state.customEvents[0].done).toBe(false);

    // Delete custom event
    state = applyDeleteCustomEvent(state, customId);
    expect(state.customEvents).toHaveLength(0);

    // Save month note
    state = applySaveMonthNote(state, "november", "Kelompok Kyoto tersesat di dekat Fushimi Inari.");
    expect(state.monthNotes.november).toBe("Kelompok Kyoto tersesat di dekat Fushimi Inari.");

    // Verify normalizeCalendarState preserves everything
    const normalized = normalizeCalendarState(state);
    expect(normalized.monthNotes.november).toBe("Kelompok Kyoto tersesat di dekat Fushimi Inari.");
  });
});
