import { describe, it, expect } from "vitest";
import {
  getAvailableFeats,
  checkFeatEligibility,
  takeFeat,
  retrainFeat,
  grantFeat,
  calculateEffectiveStats,
  resetFeatUsage,
  useFeatAction,
  levelUp,
  getPendingChoices
} from "../src/rules/progression";
import { ALL_FEATS } from "../src/data/featCompendium";
import { ensureGradeFeatGrants } from "../src/rules/migration";
import type { Character, FeatGrant, FeatDefinition } from "../src/types";

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char_test_feat",
    owner_id: "user_test",
    campaign_id: null,
    name: "Ren Amamiya",
    ekskul_id: "student_council",
    subclass_id: null,
    social_class_id: "medium",
    archetype_id: "normies",
    level: 1,
    grade: 10,
    schemaVersion: 3,
    version: 1,
    abilities: {
      physique: { score: 14, label: "Physique", short: "PHY" } as any,
      intelligent: { score: 14, label: "Intelligent", short: "INT" } as any,
      looks: { score: 12, label: "Looks", short: "LOK" } as any,
      mind: { score: 16, label: "Mind", short: "MND" } as any,
      talent: { score: 10, label: "Talent", short: "TLN" } as any,
      luck: { score: 10, label: "Luck", short: "LCK" } as any
    },
    proficient_skills: ["influence", "emotional"],
    proficient_saves: ["intelligent", "looks"],
    vitals: {
      physicalHpCurrent: 10,
      physicalHpMax: 10,
      physicalHpTemp: 0,
      composureCurrent: 13,
      composureMax: 13,
      composureTemp: 0,
      restDiceTotal: 1,
      restDiceSpent: 0,
      heartInspiration: false
    },
    finances: {
      dailyMoneyAmount: 20000,
      savingsAmount: 50000,
      jobWageAmount: 0,
      lifestyleLevel: "menengah"
    },
    feats: [],
    featGrants: ensureGradeFeatGrants(10),
    featUsage: {},
    achievements: [],
    ...overrides
  };
}

describe("Feats Progression Engine (Phase 2)", () => {
  describe("checkFeatEligibility & getAvailableFeats", () => {
    it("restricts Grade 10 grant strictly to Origin Feats", () => {
      const char = createMockCharacter();
      const grant = char.featGrants![0]; // Grade 10 origin grant

      const available = getAvailableFeats(char, grant, ALL_FEATS);
      expect(available.length).toBeGreaterThan(0);
      available.forEach(feat => {
        expect(feat.category).toBe("origin");
      });

      // Attempting to evaluate general feat against origin grant fails
      const generalFeat = ALL_FEATS.find(f => f.id === "heavy_hitter")!;
      const check = checkFeatEligibility(char, generalFeat, grant);
      expect(check.eligible).toBe(false);
      expect(check.reasons.join(" ")).toContain("Origin Feat");
    });

    it("restricts Grade 11/12 grant strictly to General Feats", () => {
      const char = createMockCharacter({
        grade: 11,
        featGrants: ensureGradeFeatGrants(11)
      });
      const generalGrant = char.featGrants!.find(g => g.category === "general")!;

      const available = getAvailableFeats(char, generalGrant, ALL_FEATS);
      expect(available.length).toBeGreaterThan(0);
      available.forEach(feat => {
        expect(feat.category).toBe("general");
      });

      // Attempting to evaluate origin feat against general grant fails
      const alertFeat = ALL_FEATS.find(f => f.id === "multitalent")!;
      const check = checkFeatEligibility(char, alertFeat, generalGrant);
      expect(check.eligible).toBe(false);
      expect(check.reasons.join(" ")).toContain("General Feat");
    });

    it("enforces minimum ability prerequisites when defined", () => {
      const charLowPhy = createMockCharacter({
        abilities: {
          physique: { score: 10 } as any,
          intelligent: { score: 14 } as any,
          looks: { score: 12 } as any,
          mind: { score: 14 } as any,
          talent: { score: 10 } as any,
          luck: { score: 10 } as any
        }
      });
      const generalGrant: FeatGrant = {
        id: "grant_g11",
        grade: 11,
        category: "general",
        source: "grade_11",
        status: "pending"
      };

      const customFeatWithPrereq: FeatDefinition = {
        id: "heavy_lifter_custom",
        name: "Heavy Lifter",
        category: "general",
        subcategory: "physique",
        description: "Test feat with minimum 13 physique",
        bonusAbility: { ability: "physique", value: 1, cap: 20 },
        prerequisites: {
          minAbility: { physique: 13 }
        },
        repeatable: false,
        tags: ["physique"]
      };

      const check = checkFeatEligibility(charLowPhy, customFeatWithPrereq, generalGrant);
      expect(check.eligible).toBe(false);
      expect(check.reasons.join(" ")).toContain("PHYSIQUE minimal 13");
    });

    it("prevents taking already taken feats (repeatable: false)", () => {
      const char = createMockCharacter({
        feats: [
          {
            featId: "multitalent",
            grantId: "prev_grant",
            takenAt: new Date().toISOString()
          }
        ]
      });
      const grant = char.featGrants![0];
      const multiFeat = ALL_FEATS.find(f => f.id === "multitalent")!;

      const check = checkFeatEligibility(char, multiFeat, grant);
      expect(check.eligible).toBe(false);
      expect(check.reasons.join(" ")).toContain("sudah diambil");
    });
  });

  describe("takeFeat", () => {
    it("successfully applies an Origin Feat and updates grant status", () => {
      const char = createMockCharacter();
      const grant = char.featGrants![0];

      const { character: updated, changelogEntry } = takeFeat(char, grant.id, "social_butterfly", { skills: ["people"] });
      expect(updated.feats).toHaveLength(1);
      expect(updated.feats[0].featId).toBe("social_butterfly");
      expect(changelogEntry.action).toBe("TAKE_FEAT");

      const updatedGrant = updated.featGrants?.find(g => g.id === grant.id);
      expect(updatedGrant?.status).toBe("taken");
      expect(updatedGrant?.featId).toBe("social_butterfly");
    });

    it("applies General Feat +1 ability score clamped to 20 under Option B", () => {
      // 1. Normal increase: 14 -> 15
      const char = createMockCharacter({
        grade: 11,
        featGrants: ensureGradeFeatGrants(11)
      });
      const grant = char.featGrants!.find(g => g.category === "general")!;
      const { character: updated } = takeFeat(char, grant.id, "heavy_hitter"); // +1 Physique

      expect(updated.abilities.physique.score).toBe(15);
      expect(updated.feats.some(f => f.featId === "heavy_hitter")).toBe(true);

      // 2. Cap 20 enforcement: taking feat when score is 20 keeps score at 20 without error
      const charMax = createMockCharacter({
        grade: 11,
        abilities: {
          ...char.abilities,
          physique: { score: 20, label: "Physique", short: "PHY" } as any
        },
        featGrants: ensureGradeFeatGrants(11)
      });
      const grantMax = charMax.featGrants!.find(g => g.category === "general")!;
      const { character: updatedMax } = takeFeat(charMax, grantMax.id, "heavy_hitter");
      expect(updatedMax.abilities.physique.score).toBe(20);
      expect(updatedMax.feats.some(f => f.featId === "heavy_hitter")).toBe(true);
    });

    it("validates and applies Multitalent choices (2 skills from intelligent or talent)", () => {
      const char = createMockCharacter({
        proficient_skills: ["influence"]
      });
      const grant = char.featGrants![0]; // Grade 10 Origin grant

      // Invalid skill outside pool should throw
      expect(() => {
        takeFeat(char, grant.id, "multitalent", { skills: ["athletics", "academic"] });
      }).toThrow(/tidak terdapat dalam daftar pilihan yang diizinkan/);

      // Valid: 1 intelligent ("academic") and 1 talent ("creative")
      const { character: updated } = takeFeat(char, grant.id, "multitalent", { skills: ["academic", "creative"] });
      expect(updated.proficient_skills).toContain("academic");
      expect(updated.proficient_skills).toContain("creative");
    });

    it("validates and applies Never Back Down choice (1 saving throw proficiency)", () => {
      const char = createMockCharacter({
        grade: 11,
        proficient_saves: ["intelligent", "looks"],
        featGrants: ensureGradeFeatGrants(11)
      });
      const grant = char.featGrants!.find(g => g.category === "general")!;

      const { character: updated } = takeFeat(char, grant.id, "never_back_down", { saves: ["physique"] });
      expect(updated.proficient_saves).toContain("physique");
    });

    it("initializes usage tracker for limited-use feats", () => {
      const char = createMockCharacter({
        grade: 11,
        featGrants: ensureGradeFeatGrants(11)
      });
      const { character: updated } = grantFeat(char, "dm", { featId: "toughen_up" });
      expect(updated.featUsage?.["toughen_up"]).toBeDefined();
      expect(updated.featUsage?.["toughen_up"].used).toBe(0);
      expect(updated.featUsage?.["toughen_up"].max).toBeGreaterThan(0);
    });
  });

  describe("retrainFeat", () => {
    it("reverts old feat bonuses and cleanly applies new feat", () => {
      const char = createMockCharacter({
        grade: 11,
        featGrants: ensureGradeFeatGrants(11)
      });
      const grant = char.featGrants!.find(g => g.category === "general")!;

      // Take heavy_hitter (+1 Physique)
      const { character: afterTake } = takeFeat(char, grant.id, "heavy_hitter");
      expect(afterTake.abilities.physique.score).toBe(15);
      expect(afterTake.abilities.mind.score).toBe(16);

      // Retrain to unphased (+1 Mind)
      const { character: afterRetrain, changelogEntry } = retrainFeat(afterTake, grant.id, "unphased");
      // Old Physique reverts from 15 to 14
      expect(afterRetrain.abilities.physique.score).toBe(14);
      // New Mind increases from 16 to 17
      expect(afterRetrain.abilities.mind.score).toBe(17);
      expect(afterRetrain.feats.some(f => f.featId === "unphased")).toBe(true);
      expect(afterRetrain.feats.some(f => f.featId === "heavy_hitter")).toBe(false);
      expect(changelogEntry.action).toBe("RETRAIN_FEAT");
    });
  });

  describe("calculateEffectiveStats", () => {
    it("calculates Sprinter speed bonus (+10 ft)", () => {
      const char = createMockCharacter({
        feats: [{ featId: "sprinter", grantId: "g1", takenAt: "" }]
      });
      const stats = calculateEffectiveStats(char, ALL_FEATS);
      expect(stats.speedFeet).toBe(40); // 30 base + 10
      expect(stats.speed).toBe("40 ft");
    });

    it("calculates Built Different and Who's Gonna Carry The Boats vitals bonuses", () => {
      const char = createMockCharacter({
        level: 3,
        feats: [
          { featId: "built_different", grantId: "g1", takenAt: "" },
          { featId: "whos_gonna_carry_the_boats", grantId: "g2", takenAt: "" }
        ]
      });
      const stats = calculateEffectiveStats(char, ALL_FEATS);
      expect(stats.hasBuiltDifferent).toBe(true);
      expect(stats.hasWhoGonnaCarryTheBoats).toBe(true);
      // Built different adds +2 HP per level (level 3 = +6 HP)
      expect(stats.hpMaxBonus).toBe(6);
      // Who's gonna carry the boats adds +1 Composure per level (level 3 = +3 Composure)
      expect(stats.composureMaxBonus).toBe(3);
    });

    it("calculates Overthinker passive bonuses", () => {
      const char = createMockCharacter({
        feats: [{ featId: "overthinker", grantId: "g1", takenAt: "" }]
      });
      const stats = calculateEffectiveStats(char, ALL_FEATS);
      // base 10 + mod 2 + feat 2 = 14
      expect(stats.passiveInvestigation).toBe(14);
      expect(stats.passivePerception).toBe(15); // 10 + mind mod 3 + 2 = 15
    });

    it("calculates Clumsy +2 Luck and Jack of All Trades +1 untrained skills", () => {
      const char = createMockCharacter({
        feats: [
          { featId: "clumsy", grantId: "g1", takenAt: "" },
          { featId: "jack_of_all_trades", grantId: "g2", takenAt: "" }
        ]
      });
      const stats = calculateEffectiveStats(char, ALL_FEATS);
      expect(stats.luckBonus).toBe(2);
      expect(stats.jackOfAllTradesBonus).toBe(1);
      expect(stats.jackOfAllTrades).toBe(true);
    });
  });

  describe("useFeatAction & resetFeatUsage", () => {
    it("increments used action count and stops when limit reached", () => {
      let char = createMockCharacter({
        grade: 11,
        featGrants: ensureGradeFeatGrants(11)
      });
      const grantRes = grantFeat(char, "dm", { featId: "toughen_up" });
      char = grantRes.character;

      const max = char.featUsage!["toughen_up"].max;
      for (let i = 0; i < max; i++) {
        const useRes = useFeatAction(char, "toughen_up");
        char = useRes.character;
        expect(useRes.used).toBe(i + 1);
        expect(char.featUsage!["toughen_up"].used).toBe(i + 1);
      }

      expect(() => {
        useFeatAction(char, "toughen_up");
      }).toThrow(/sudah mencapai batas/);
    });

    it("resets short_rest feats on Short Rest and both on Long Rest", () => {
      let char = createMockCharacter();
      char.featUsage = {
        feat_short: { featId: "feat_short", used: 2, max: 2, resetType: "short_rest" },
        feat_long: { featId: "feat_long", used: 3, max: 3, resetType: "long_rest" }
      };

      // Short rest reset
      char = resetFeatUsage(char, "short_rest");
      expect(char.featUsage.feat_short.used).toBe(0);
      expect(char.featUsage.feat_long.used).toBe(3); // Long rest untouched

      // Long rest reset
      char.featUsage.feat_short.used = 1;
      char = resetFeatUsage(char, "long_rest");
      expect(char.featUsage.feat_short.used).toBe(0);
      expect(char.featUsage.feat_long.used).toBe(0); // Long rest reset
    });
  });

  describe("levelUp Integration", () => {
    it("provisions a new Grade 11 General Feat grant when advancing from Level 2 to Level 3 with subclass", () => {
      const char = createMockCharacter({ level: 2, grade: 10 });
      expect(char.featGrants).toHaveLength(1); // Only Grade 10

      const res = levelUp(char, { subclassId: "presiden" });
      expect(res.character.level).toBe(3);
      expect(res.character.grade).toBe(11);
      expect(res.character.featGrants).toHaveLength(2); // Grade 10 + Grade 11
      const g11Grant = res.character.featGrants!.find(g => g.grade === 11);
      expect(g11Grant).toBeDefined();
      expect(g11Grant?.category).toBe("general");
      expect(g11Grant?.status).toBe("pending");
    });

    it("includes pending feat grants in getPendingChoices", () => {
      const char = createMockCharacter({
        grade: 11,
        subclass_id: "presiden",
        featGrants: ensureGradeFeatGrants(11) // 1 origin pending, 1 general pending
      });
      const pending = getPendingChoices(char);
      expect(pending.length).toBeGreaterThan(0);
      const featPending = pending.filter(p => p.type === "feat");
      expect(featPending).toHaveLength(2);
    });

    it("indicates isNewGrade in previewLevelUp when transitioning grades", async () => {
      const { previewLevelUp } = await import("../src/rules/progression");
      const charK10 = createMockCharacter({ level: 2, grade: 10 });
      const preview = previewLevelUp(charK10, { subclassId: "presiden" });
      expect(preview.isNewGrade).toBe(true);
      expect(preview.nextGrade).toBe(11);
    });
  });

  describe("migrateCharacterToV3", () => {
    it("migrates legacy character to v3 and equips with appropriate grade feat grants", async () => {
      const { migrateCharacterToV3 } = await import("../src/rules/migration");
      const legacyChar = {
        id: "char_legacy_v1",
        name: "Legacy Student",
        level: 3,
        grade: 11,
        ekskul_id: "kendo",
        abilities: {
          physique: 12,
          intelligent: 10,
          looks: 10,
          mind: 12,
          talent: 10,
          luck: 10
        }
      };

      const result = migrateCharacterToV3(legacyChar);
      expect(result.migrated).toBe(true);
      expect(result.character.schemaVersion).toBe(3);
      expect(result.character.feats).toEqual([]);
      expect(result.character.featGrants).toHaveLength(2); // Grade 10 Origin + Grade 11 General
      expect(result.character.featGrants.every(g => g.status === "pending")).toBe(true);
    });
  });
});
