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

  it("verifies every ekskul has 2 subclasses and 3 club moves with progression metadata", () => {
    FALLBACK_DD_DATA.ekskul.forEach(e => {
      expect(e.subclasses, `Ekskul ${e.id} subclasses`).toHaveLength(2);
      expect(e.clubMoves, `Ekskul ${e.id} clubMoves`).toHaveLength(3);
      expect(e.hitDie).toMatch(/^d(6|8|10)$/);
      expect(e.primaryStat).toBeTruthy();
      expect(e.savingThrows.length).toBeGreaterThanOrEqual(1);

      // Verify club move progression orders and grades
      e.clubMoves.forEach((m: any, idx: number) => {
        expect(m.order).toBe(idx + 1);
        expect(m.unlockGrade).toBe(idx === 0 ? 10 : idx === 1 ? 11 : 12);
        expect(m.cost).toBeTruthy();
        expect(m.effect).toBeTruthy();
      });

      // Verify subclass progression details & exactly 2 moves (G11, G12)
      e.subclasses.forEach((sc: any) => {
        expect(sc.tagline, `Subclass ${sc.id} tagline`).toBeTruthy();
        expect(sc.identityDesc, `Subclass ${sc.id} identityDesc`).toBeTruthy();
        expect(sc.subclassMoves, `Subclass ${sc.id} subclassMoves`).toHaveLength(2);

        const [g11, g12] = sc.subclassMoves;
        expect(g11.tier).toBe("G11");
        expect(g11.unlockGrade).toBe(11);
        expect(g11.cost).toBeTruthy();
        expect(g11.effect).toBeTruthy();

        expect(g12.tier).toBe("G12");
        expect(g12.unlockGrade).toBe(12);
        expect(g12.cost).toBeTruthy();
        expect(g12.effect).toBeTruthy();
      });
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

  it("verifies getCompendiumEkskul API returns all 16 ekskuls with 48 club moves and 64 subclass moves", async () => {
    const list = await getCompendiumEkskul();
    expect(list).toHaveLength(16);
    const returnedIds = list.map(e => e.id);
    [...legacyIds, ...newIds].forEach(id => {
      expect(returnedIds).toContain(id);
    });

    const totalClubMoves = list.reduce((acc, e) => acc + (e.club_moves?.length || 0), 0);
    expect(totalClubMoves).toBe(48);

    let totalSubclasses = 0;
    let totalSubclassMoves = 0;
    for (const e of list) {
      expect(e.club_moves).toHaveLength(3);
      e.club_moves?.forEach((m, idx) => {
        expect(m.order).toBe(idx + 1);
        expect(m.unlock_grade).toBe(idx === 0 ? 10 : idx === 1 ? 11 : 12);
      });

      expect(e.subclasses).toHaveLength(2);
      for (const sc of e.subclasses || []) {
        totalSubclasses += 1;
        expect(sc.tagline).toBeTruthy();
        expect(sc.identity_desc).toBeTruthy();
        expect(sc.subclass_moves).toHaveLength(2);
        totalSubclassMoves += (sc.subclass_moves?.length || 0);

        const [g11, g12] = sc.subclass_moves || [];
        expect(g11.tier).toBe("G11");
        expect(g11.unlock_grade).toBe(11);
        expect(g12.tier).toBe("G12");
        expect(g12.unlock_grade).toBe(12);
      }
    }

    expect(totalSubclasses).toBe(32);
    expect(totalSubclassMoves).toBe(64);
  });

  it("verifies progression SQL migration exists with subclass moves table and seed data", () => {
    const migrationPath = path.resolve(__dirname, "../supabase/migrations/20261008000001_subclass_moves_and_progression.sql");
    expect(fs.existsSync(migrationPath)).toBe(true);
    const sqlContent = fs.readFileSync(migrationPath, "utf-8");
    expect(sqlContent).toContain("CREATE TABLE IF NOT EXISTS public.subclass_moves");
    expect(sqlContent).toContain("presidium_g11_rapat_darurat");
    expect(sqlContent).toContain("presidium_g12_mandat_ketua");
    expect(sqlContent).toContain("strategist_g12_meta_breaker");
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

