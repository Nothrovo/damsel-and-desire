import { describe, expect, it } from "vitest";
import { escapeHtml } from "../src/utils/escapeHtml";
import { setMobileNavigationOpen } from "../src/components/mobileNavigation";
import { buildAuthCallbackUrl, getProtectedRouteRedirect, resolveInternalRedirect } from "../src/router/routeAccess";
import { setCalendarSyncState } from "../src/views/calendarSyncState";

describe("Calendar sync status", () => {
  it("announces local-first, synced, and offline states without hiding the calendar", () => {
    const attributes = new Map<string, string>();
    const status = {
      textContent: "",
      classList: { toggle: (name: string, force?: boolean) => attributes.set(name, String(force)) },
      setAttribute: (name: string, value: string) => attributes.set(name, value)
    } as unknown as HTMLElement;

    setCalendarSyncState(status, "local");
    expect(status.textContent).toContain("tersimpan di perangkat");
    setCalendarSyncState(status, "synced");
    expect(status.textContent).toContain("tersinkron");
    setCalendarSyncState(status, "offline");
    expect(status.textContent).toContain("belum tersinkron");
  });
});


describe("Protected route and auth return paths", () => {
  it("sends anonymous settings and profile routes to login with their return path", () => {
    expect(getProtectedRouteRedirect("/settings", false)).toBe("/login?redirect=%2Fsettings");
    expect(getProtectedRouteRedirect("/settings/profile", false)).toBe(
      "/login?redirect=%2Fsettings%2Fprofile"
    );
  });

  it("leaves public routes alone and does not redirect authenticated users", () => {
    expect(getProtectedRouteRedirect("/codex", false)).toBeNull();
    expect(getProtectedRouteRedirect("/settings", true)).toBeNull();
  });

  it("keeps auth redirects on this app and includes the GitHub Pages base path", () => {
    expect(buildAuthCallbackUrl("/settings?tab=profile", "https://dnd.example", "/damsel-and-desire")).toBe(
      "https://dnd.example/damsel-and-desire/settings?tab=profile"
    );
    expect(resolveInternalRedirect("https://phishing.example/", "/damsel-and-desire")).toBe("/");
    expect(resolveInternalRedirect("//phishing.example/", "/damsel-and-desire")).toBe("/");
  });
});



describe("UI safety helpers", () => {
  it("escapes user-controlled text before rendering it as HTML", () => {
    expect(escapeHtml(`<Mio & 'Rin' "Housen">`)).toBe(
      "&lt;Mio &amp; &#39;Rin&#39; &quot;Housen&quot;&gt;"
    );
  });

  it("keeps the mobile navigation state and accessible label in sync", () => {
    const classes = new Set<string>();
    const navigation = {
      classList: {
        toggle(name: string, force?: boolean) {
          if (force) classes.add(name);
          else classes.delete(name);
          return classes.has(name);
        }
      }
    } as unknown as HTMLElement;
    const attributes = new Map<string, string>();
    const toggle = {
      setAttribute(name: string, value: string) {
        attributes.set(name, value);
      }
    } as unknown as HTMLButtonElement;

    setMobileNavigationOpen(navigation, toggle, true);
    expect(attributes.get("aria-expanded")).toBe("true");
    expect(attributes.get("aria-label")).toBe("Tutup navigasi");
    expect(classes.has("is-open")).toBe(true);

    setMobileNavigationOpen(navigation, toggle, false);
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(attributes.get("aria-label")).toBe("Buka navigasi");
    expect(classes.has("is-open")).toBe(false);
  });
});
