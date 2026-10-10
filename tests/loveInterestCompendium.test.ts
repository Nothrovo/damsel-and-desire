import { describe, it, expect } from "vitest";
import {
  getAllLoveInterests,
  getLoveInterestBySlug,
  findLoveInterestByName,
  getCurrentMilestone
} from "../src/data/loveInterestCompendium";
import {
  fetchDynamicLoveInterests,
  matchTargetToLoveInterest
} from "../src/api/loveInterests";
import type { TargetSecret } from "../src/types";

describe("Love Interest Compendium & Dynamic Resolver", () => {
  it("loads all 21 canon love interests from the compendium", () => {
    const list = getAllLoveInterests();
    expect(list.length).toBe(21);

    for (const li of list) {
      expect(li.slug).toBeTruthy();
      expect(li.name).toBeTruthy();
      expect(li.class_room).toBeTruthy();
      expect(li.heart_meter?.milestones?.length).toBeGreaterThan(0);
      expect(li.gifts).toBeDefined();
      expect(li.date_spots?.length).toBeGreaterThan(0);
      expect(li.avatar_url).toBeTruthy();
    }
  });

  it("finds Miruam Solari by exact slug and name", () => {
    const bySlug = getLoveInterestBySlug("miruam_solari");
    expect(bySlug).toBeDefined();
    expect(bySlug?.name).toContain("Miruam Solari");
    expect(bySlug?.class_room).toBe("11-1");
    expect(bySlug?.club).toBe("kendo");

    const byName = findLoveInterestByName("Miruam Solari");
    expect(byName?.slug).toBe("miruam_solari");
  });

  it("finds characters by partial nickname e.g. Miruam, Tenka, Setsuna", () => {
    const miruam = findLoveInterestByName("Miruam");
    expect(miruam?.slug).toBe("miruam_solari");

    const tenka = findLoveInterestByName("Tenka");
    expect(tenka?.slug).toBe("asahina_tenka");

    const setsuna = findLoveInterestByName("Setsuna");
    expect(setsuna?.slug).toBe("kisaragi_setsuna");
  });

  it("calculates accurate Heart Milestones according to current affection value", () => {
    const miruam = getLoveInterestBySlug("miruam_solari")!;
    expect(miruam).toBeDefined();

    // 1-2 ♥
    const m1 = getCurrentMilestone(miruam, 1);
    expect(m1?.range).toContain("1–2");
    expect(m1?.title).toContain("Angkuh Berjarak");

    // 3-4 ♥
    const m4 = getCurrentMilestone(miruam, 4);
    expect(m4?.range).toContain("3–4");
    expect(m4?.title).toContain("Respek Intelektual");

    // 5-6 ♥
    const m5 = getCurrentMilestone(miruam, 5);
    expect(m5?.range).toContain("5–6");
    expect(m5?.title).toContain("Sadar Perasaan");

    // 10 ♥
    const m10 = getCurrentMilestone(miruam, 10);
    expect(m10?.range).toContain("10");
    expect(m10?.title).toContain("Kekasih Sejati");
  });

  it("matches legacy targets from Character Sheet (backward compatibility)", () => {
    const all = getAllLoveInterests();

    // Legacy target object without slug (as seen in user screenshot)
    const legacyTarget: TargetSecret = {
      name: "Miruam",
      status: "Secret Crush",
      affection: 1,
      secret: "nope"
    };

    const matched = matchTargetToLoveInterest(legacyTarget, all);
    expect(matched).toBeDefined();
    expect(matched?.slug).toBe("miruam_solari");
    expect(matched?.class_room).toBe("11-1");
  });

  it("returns love interests from fetchDynamicLoveInterests", async () => {
    const list = await fetchDynamicLoveInterests(true);
    expect(list.length).toBeGreaterThanOrEqual(21);
    const miruam = list.find((li) => li.slug === "miruam_solari");
    expect(miruam).toBeDefined();
  });
});
