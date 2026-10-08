import { describe, it, expect } from "vitest";
import { ALL_FEATS } from "../src/data/featCompendium";
import { ALL_ACHIEVEMENTS } from "../src/data/achievementCompendium";
import { FALLBACK_DD_DATA } from "../src/data/fallbackCompendium";
import { ensureGradeFeatGrants, migrateCharacterToV3 } from "../src/rules/migration";
import { isDmPinValid } from "../src/types";

describe("Feats & Achievements Data & Compendium (Phase 1)", () => {
  it("contains exactly 100 feats in compendium", () => {
    expect(ALL_FEATS).toHaveLength(100);
    expect(FALLBACK_DD_DATA.feats).toHaveLength(100);
  });

  it("contains exactly 20 Origin Feats", () => {
    const originFeats = ALL_FEATS.filter(f => f.category === "origin");
    expect(originFeats).toHaveLength(20);
    originFeats.forEach(f => {
      expect(f.repeatable).toBe(false);
      expect(f.name).toBeTruthy();
    });
  });

  it("contains exactly 72 General Feats across 6 ability attributes (12 each) with Cap 20", () => {
    const generalFeats = ALL_FEATS.filter(f => f.category === "general");
    expect(generalFeats).toHaveLength(72);

    const abilities = ["physique", "intelligent", "looks", "mind", "talent", "luck"] as const;
    abilities.forEach(ability => {
      const perAbility = generalFeats.filter(f => f.subcategory === ability);
      expect(perAbility).toHaveLength(12);
      perAbility.forEach(f => {
        expect(f.bonusAbility).toBeDefined();
        expect(f.bonusAbility?.ability).toBe(ability);
        expect(f.bonusAbility?.value).toBe(1);
        expect(f.bonusAbility?.cap).toBe(20);
        expect(f.repeatable).toBe(false);
      });
    });
  });

  it("contains exactly 8 Achievement Feats with Cap 30 and mandatory Story Requirements", () => {
    const achFeats = ALL_FEATS.filter(f => f.category === "achievement");
    expect(achFeats).toHaveLength(8);
    achFeats.forEach(f => {
      expect(f.bonusAbility).toBeDefined();
      expect(f.bonusAbility?.value).toBe(2);
      expect(f.bonusAbility?.cap).toBe(30);
      expect(f.requirementText).toBeTruthy();
      expect(f.repeatable).toBe(false);
    });
  });

  it("maps 1-to-1 between all 8 achievements and achievement feats", () => {
    expect(ALL_ACHIEVEMENTS).toHaveLength(8);
    expect(FALLBACK_DD_DATA.achievements).toHaveLength(8);

    const featIds = new Set(ALL_FEATS.map(f => f.id));
    ALL_ACHIEVEMENTS.forEach(ach => {
      expect(featIds.has(ach.feat_id)).toBe(true);
      const matchedFeat = ALL_FEATS.find(f => f.id === ach.feat_id);
      expect(matchedFeat?.category).toBe("achievement");
      expect(ach.requirement).toBeTruthy();
    });
  });

  it("authenticates official DM PIN 157017 and backward-compatible 6969", () => {
    expect(isDmPinValid("157017")).toBe(true);
    expect(isDmPinValid(" 157017 ")).toBe(true);
    expect(isDmPinValid("6969")).toBe(true);
    expect(isDmPinValid("0000")).toBe(false);
    expect(isDmPinValid("")).toBe(false);
  });

  describe("ensureGradeFeatGrants & Migration V3", () => {
    it("assigns 1 pending Origin grant for Grade 10", () => {
      const grants = ensureGradeFeatGrants(10);
      expect(grants).toHaveLength(1);
      expect(grants[0].grade).toBe(10);
      expect(grants[0].category).toBe("origin");
      expect(grants[0].status).toBe("pending");
    });

    it("assigns 2 pending grants (1 Origin, 1 General) for Grade 11", () => {
      const grants = ensureGradeFeatGrants(11);
      expect(grants).toHaveLength(2);
      expect(grants[0].category).toBe("origin");
      expect(grants[1].category).toBe("general");
      expect(grants[1].grade).toBe(11);
    });

    it("assigns 3 pending grants (1 Origin, 2 General) for Grade 12", () => {
      const grants = ensureGradeFeatGrants(12);
      expect(grants).toHaveLength(3);
      expect(grants[0].category).toBe("origin");
      expect(grants[1].category).toBe("general");
      expect(grants[2].category).toBe("general");
      expect(grants[2].grade).toBe(12);
    });

    it("is completely idempotent and preserves already existing grants", () => {
      const initial = ensureGradeFeatGrants(11);
      // Mark one grant as taken
      initial[0].status = "taken";
      initial[0].featId = "gym_bro";

      const secondRun = ensureGradeFeatGrants(11, initial);
      expect(secondRun).toHaveLength(2);
      expect(secondRun[0].status).toBe("taken");
      expect(secondRun[0].featId).toBe("gym_bro");
      expect(secondRun[1].status).toBe("pending");
    });

    it("migrates raw character to v3 with pending feat grants matching their grade", () => {
      const raw = {
        id: "char_test_v3",
        name: "Kenji",
        grade: 11,
        level: 3,
        ekskul_id: "band"
      };

      const result = migrateCharacterToV3(raw);
      expect(result.migrated).toBe(true);
      expect(result.character.schemaVersion).toBe(3);
      expect(result.character.featGrants).toHaveLength(2);
      expect(result.character.featGrants?.[0].status).toBe("pending");
      expect(result.character.featGrants?.[1].status).toBe("pending");
    });
  });
});
