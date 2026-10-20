export type CalendarSyncState = "local" | "synced" | "offline";

const CALENDAR_SYNC_MESSAGES: Record<CalendarSyncState, string> = {
  local: "Kalender siap · progress tersimpan di perangkat ini",
  synced: "Kalender tersinkron · perubahan tersimpan di cloud",
  offline: "Kalender siap · perubahan tersimpan di perangkat, belum tersinkron"
};

export function setCalendarSyncState(element: HTMLElement | null, state: CalendarSyncState): void {
  if (!element) return;
  element.textContent = CALENDAR_SYNC_MESSAGES[state];
  element.classList.toggle("is-offline", state === "offline");
}
