import { describe, it, expect, vi } from "vitest";
import { FALLBACK_DD_DATA } from "../src/data/fallbackCompendium";
import { MASTER_ITEM_REGISTRY } from "../src/data/itemCompendium";
import fs from "fs";
import path from "path";

// Mock supabase to test offline fallback behavior and avoid WebSocket initialization issues
vi.mock("../src/api/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: null, error: new Error("offline fallback test") })
      })
    })
  }
}));

import { getCompendiumEkskul, getCompendiumEquipmentPacks } from "../src/api/compendium";

describe("Ekskul Synchronization & Regression Suite", () => {
  const legacyIds = [
    "student_council",
    "kendo",
    "martial_arts",
    "sports",
    "drama",
    "kir_osn",
    "pramuka_paskin",
    "pecinta_alam",
    "penyiaran",
    "literatur",
    "band",
    "painting"
  ];

  const newIds = [
    "photography",
    "cooking",
    "occult",
    "gaming"
  ];

  it("preserves all 12 legacy ekskul IDs without modification", () => {
    const currentIds = FALLBACK_DD_DATA.ekskul.map(e => e.id);
    legacyIds.forEach(id => {
      expect(currentIds).toContain(id);
    });
  });

  it("contains all 4 new approved ekskul IDs", () => {
    const currentIds = FALLBACK_DD_DATA.ekskul.map(e => e.id);
    newIds.forEach(id => {
      expect(currentIds).toContain(id);
    });
    expect(currentIds.length).toBe(16);
  });

  it("verifies every ekskul has 2 subclasses and 3 club moves", () => {
    FALLBACK_DD_DATA.ekskul.forEach(e => {
      expect(e.subclasses, `Ekskul ${e.id} subclasses`).toHaveLength(2);
      expect(e.clubMoves, `Ekskul ${e.id} clubMoves`).toHaveLength(3);
      expect(e.hitDie).toMatch(/^d(6|8|10)$/);
      expect(e.primaryStat).toBeTruthy();
      expect(e.savingThrows.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("verifies all ekskul have matching equipment pack and items in registry", () => {
    const allIds = [...legacyIds, ...newIds];
    const clubPacks = FALLBACK_DD_DATA.equipmentPacks.clubs as Record<string, string[]>;

    allIds.forEach(id => {
      expect(clubPacks[id], `Pack for club ${id} should exist`).toBeDefined();
      expect(clubPacks[id].length).toBe(3);

      clubPacks[id].forEach(itemName => {
        expect(MASTER_ITEM_REGISTRY[itemName], `Item "${itemName}" for club ${id} must exist in registry`).toBeDefined();
      });
    });
  });

  it("synchronizes migration SQL with fallbackCompendium data", () => {
    const migrationPath = path.resolve(__dirname, "../supabase/migrations/20261007000009_add_new_ekskul.sql");
    expect(fs.existsSync(migrationPath)).toBe(true);
    const sqlContent = fs.readFileSync(migrationPath, "utf-8");

    newIds.forEach(id => {
      expect(sqlContent).toContain(`'${id}'`);
    });
  });

  it("verifies getCompendiumEkskul API returns all 16 ekskuls with 48 club moves", async () => {
    const list = await getCompendiumEkskul();
    expect(list).toHaveLength(16);
    const returnedIds = list.map(e => e.id);
    [...legacyIds, ...newIds].forEach(id => {
      expect(returnedIds).toContain(id);
    });

    const totalMoves = list.reduce((acc, e) => acc + (e.club_moves?.length || 0), 0);
    expect(totalMoves).toBe(48);
  });

  it("verifies getCompendiumEquipmentPacks API returns packs for all 16 clubs", async () => {
    const packs = await getCompendiumEquipmentPacks();
    const clubPacks = packs.filter(p => p.category === "club");
    expect(clubPacks).toHaveLength(16);

    const clubPackIds = clubPacks.map(p => p.id);
    [...legacyIds, ...newIds].forEach(id => {
      expect(clubPackIds).toContain(`club_${id}`);
    });
  });
});
