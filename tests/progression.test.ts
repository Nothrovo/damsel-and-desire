import { describe, it, expect } from "vitest";
import {
  getGradeForLevel,
  getSemesterForLevel,
  getLevelLabel,
  getGradeLabel,
  getRestDiceCountForLevel,
  getHitDieSides,
  getHitDieAverage,
  calculateHpGainAtLevel,
  calculateMaxHp,
  calculateComposureGainAtLevel,
  calculateMaxComposure,
  getAllMovesSummary,
  getUnlockedMoves,
  getLockedMoves,
  getPendingChoices,
  canLevelUp,
  previewLevelUp,
  levelUp,
  validateCharacter
} from "../src/rules/progression";
import type { Character } from "../src/types";

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char_test_1",
    owner_id: "user_test",
    campaign_id: null,
    name: "Akira Tachibana",
    ekskul_id: "student_council",
    subclass_id: null,
    social_class_id: "medium",
    archetype_id: "normies",
    level: 1,
    grade: 10,
    schemaVersion: 2,
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
      dailyMoneyAmount: 1000,
      savingsAmount: 15000,
      job: "-",
      jobWageAmount: 0
    },
    inventory: {
      bagItems: [],
      keepsakes: []
    },
    backstory_fields: {
      personality: "",
      ideals: "",
      bonds: "",
      flaws: "",
      backstory: ""
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

describe("Progression Rule Engine", () => {
  describe("Level, Grade & Semester Mapping", () => {
    it("maps levels 1-6 accurately to Grades 10, 11, 12 and Semesters 1, 2", () => {
      expect(getGradeForLevel(1)).toBe(10);
      expect(getSemesterForLevel(1)).toBe(1);
      expect(getLevelLabel(1)).toBe("Kelas 10 (Sem 1)");

      expect(getGradeForLevel(2)).toBe(10);
      expect(getSemesterForLevel(2)).toBe(2);
      expect(getLevelLabel(2)).toBe("Kelas 10 (Sem 2)");

      expect(getGradeForLevel(3)).toBe(11);
      expect(getSemesterForLevel(3)).toBe(1);
      expect(getLevelLabel(3)).toBe("Kelas 11 (Sem 1)");

      expect(getGradeForLevel(4)).toBe(11);
      expect(getSemesterForLevel(4)).toBe(2);
      expect(getLevelLabel(4)).toBe("Kelas 11 (Sem 2)");

      expect(getGradeForLevel(5)).toBe(12);
      expect(getSemesterForLevel(5)).toBe(1);
      expect(getLevelLabel(5)).toBe("Kelas 12 (Sem 1)");

      expect(getGradeForLevel(6)).toBe(12);
      expect(getSemesterForLevel(6)).toBe(2);
      expect(getLevelLabel(6)).toBe("Kelas 12 (Sem 2)");
    });

    it("scales rest dice by grade", () => {
      expect(getRestDiceCountForLevel(1)).toBe(1);
      expect(getRestDiceCountForLevel(2)).toBe(1);
      expect(getRestDiceCountForLevel(3)).toBe(2);
      expect(getRestDiceCountForLevel(4)).toBe(2);
      expect(getRestDiceCountForLevel(5)).toBe(3);
      expect(getRestDiceCountForLevel(6)).toBe(3);
    });
  });

  describe("HP & Composure Scaling", () => {
    it("computes hit die sizes and average increases correctly", () => {
      expect(getHitDieSides("d6")).toBe(6);
      expect(getHitDieAverage("d6")).toBe(4);

      expect(getHitDieSides("d8")).toBe(8);
      expect(getHitDieAverage("d8")).toBe(5);

      expect(getHitDieSides("d10")).toBe(10);
      expect(getHitDieAverage("d10")).toBe(6);
    });

    it("calculates level 1 max HP with PHY mod (+2) on d8", () => {
      // 8 + 2 = 10
      const hp = calculateMaxHp(1, "d8", 14, false);
      expect(hp).toBe(10);
    });

    it("calculates level 1 max HP with Delinquent perk (+2 extra HP)", () => {
      // 8 + 2 + 2 = 12
      const hp = calculateMaxHp(1, "d8", 14, true);
      expect(hp).toBe(12);
    });

    it("calculates multi-level max HP progression", () => {
      // Level 1: 8 + 2 = 10
      // Level 2: 10 + (5 + 2) = 17
      // Level 3: 17 + (5 + 2) = 24
      // Level 6: 10 + 5 * 7 = 45
      expect(calculateMaxHp(2, "d8", 14, false)).toBe(17);
      expect(calculateMaxHp(3, "d8", 14, false)).toBe(24);
      expect(calculateMaxHp(6, "d8", 14, false)).toBe(45);
    });

    it("calculates Composure progression with MND mod (+3)", () => {
      // Level 1: 10 + 3 = 13
      // Level 2: 13 + (4 + 3) = 20
      // Level 6: 13 + 5 * 7 = 48
      expect(calculateMaxComposure(1, 16)).toBe(13);
      expect(calculateMaxComposure(2, 16)).toBe(20);
      expect(calculateMaxComposure(6, 16)).toBe(48);
    });
  });

  describe("Move Unlock Matrix", () => {
    it("unlocks only Club Move 1 at Grade 10 (Levels 1 & 2)", () => {
      const char = createMockCharacter({ level: 1, grade: 10 });
      const summary = getAllMovesSummary(char);

      expect(summary.unlockedClubMoves).toHaveLength(1);
      expect(summary.unlockedClubMoves[0].order).toBe(1);

      expect(summary.lockedClubMoves).toHaveLength(2);
      expect(summary.lockedClubMoves.map(m => m.order)).toEqual([2, 3]);

      expect(summary.unlockedSubclassMoves).toHaveLength(0);
      expect(summary.candidateSubclassMoves?.length).toBeGreaterThan(0);
    });

    it("unlocks Club Move 2 and Subclass Move 1 at Grade 11 with chosen subclass", () => {
      const char = createMockCharacter({
        level: 3,
        grade: 11,
        subclass_id: "presidium"
      });
      const summary = getAllMovesSummary(char);

      // Club moves: order 1 and 2 unlocked, order 3 locked
      expect(summary.unlockedClubMoves).toHaveLength(2);
      expect(summary.unlockedClubMoves.map(m => m.order)).toEqual([1, 2]);
      expect(summary.lockedClubMoves).toHaveLength(1);
      expect(summary.lockedClubMoves[0].order).toBe(3);

      // Subclass moves: G11 unlocked, G12 locked
      expect(summary.unlockedSubclassMoves).toHaveLength(1);
      expect(summary.unlockedSubclassMoves[0].tier).toBe("G11");
      expect(summary.lockedSubclassMoves).toHaveLength(1);
      expect(summary.lockedSubclassMoves[0].tier).toBe("G12");
    });

    it("unlocks all 3 Club Moves and both Subclass Moves at Grade 12", () => {
      const char = createMockCharacter({
        level: 5,
        grade: 12,
        subclass_id: "presidium"
      });
      const summary = getAllMovesSummary(char);

      expect(summary.unlockedClubMoves).toHaveLength(3);
      expect(summary.lockedClubMoves).toHaveLength(0);

      expect(summary.unlockedSubclassMoves).toHaveLength(2);
      expect(summary.lockedSubclassMoves).toHaveLength(0);
    });
  });

  describe("Pending Choices Check", () => {
    it("returns no pending choices for Grade 10 characters", () => {
      const char = createMockCharacter({ level: 1, grade: 10, subclass_id: null });
      const pending = getPendingChoices(char);
      expect(pending).toHaveLength(0);
    });

    it("flags pending subclass choice for Grade 11 characters without a subclass", () => {
      const char = createMockCharacter({ level: 3, grade: 11, subclass_id: null });
      const pending = getPendingChoices(char);
      expect(pending).toHaveLength(1);
      expect(pending[0].type).toBe("subclass");
      expect(pending[0].required).toBe(true);
      expect(pending[0].options).toHaveLength(2);
    });

    it("returns no pending choices once subclass is chosen at Grade 11", () => {
      const char = createMockCharacter({ level: 3, grade: 11, subclass_id: "presidium" });
      const pending = getPendingChoices(char);
      expect(pending).toHaveLength(0);
    });
  });

  describe("Level-Up Preview & Execution", () => {
    it("previews level 1 to level 2 within Grade 10 without requiring subclass", () => {
      const char = createMockCharacter({ level: 1, grade: 10 });
      const preview = previewLevelUp(char);

      expect(preview.currentLevel).toBe(1);
      expect(preview.nextLevel).toBe(2);
      expect(preview.currentGrade).toBe(10);
      expect(preview.nextGrade).toBe(10);
      expect(preview.isNewGrade).toBe(false);
      expect(preview.requiresSubclass).toBe(false);
      expect(preview.hpDelta).toBe(7); // d8 avg (5) + mod PHY (2)
      expect(preview.hpMaxNext).toBe(17);
      expect(preview.composureDelta).toBe(7); // 4 + mod MND (3)
      expect(preview.composureMaxNext).toBe(20);
    });

    it("blocks level 2 to 3 if subclass is not selected", () => {
      const char = createMockCharacter({ level: 2, grade: 10, subclass_id: null });
      expect(() => levelUp(char)).toThrow("wajib memilih subclass");
    });

    it("successfully levels up 2 to 3 when subclass is provided in choices", () => {
      const char = createMockCharacter({
        level: 2,
        grade: 10,
        subclass_id: null,
        vitals: {
          physicalHpCurrent: 17,
          physicalHpMax: 17,
          physicalHpTemp: 0,
          composureCurrent: 20,
          composureMax: 20,
          composureTemp: 0,
          restDiceTotal: 1,
          restDiceSpent: 0,
          heartInspiration: false
        }
      });
      const { character: updated, changelogEntry } = levelUp(char, {
        subclassId: "presidium"
      });

      expect(updated.level).toBe(3);
      expect(updated.grade).toBe(11);
      expect(updated.subclass_id).toBe("presidium");
      expect(updated.vitals.physicalHpMax).toBe(24);
      expect(updated.vitals.composureMax).toBe(27);
      expect(updated.vitals.restDiceTotal).toBe(2);
      expect(updated.version).toBe(2);

      // Verify changelog
      expect(changelogEntry.action).toBe("LEVEL_UP");
      expect(changelogEntry.source).toBe("level_up");
      expect(updated.changelog).toHaveLength(1);
      expect(updated.changelog?.[0].description).toContain("presidium");
    });

    it("scales proficiency bonus to +3 upon reaching Level 5 (Kelas 12)", () => {
      const char = createMockCharacter({
        level: 4,
        grade: 11,
        subclass_id: "presidium"
      });
      const preview = previewLevelUp(char);
      expect(preview.pbCurrent).toBe(2);
      expect(preview.pbNext).toBe(3);
      expect(preview.restDiceNext).toBe(3);

      const { character: updated } = levelUp(char);
      expect(updated.level).toBe(5);
      expect(updated.grade).toBe(12);
    });

    it("disallows leveling up beyond Level 6", () => {
      const maxChar = createMockCharacter({
        level: 6,
        grade: 12,
        subclass_id: "presidium"
      });
      const eligibility = canLevelUp(maxChar);
      expect(eligibility.can).toBe(false);
      expect(eligibility.reason).toContain("batas level maksimal");
      expect(() => levelUp(maxChar)).toThrow("batas level maksimal");
    });

    it("ensures original character is not mutated (immutability)", () => {
      const char = createMockCharacter({ level: 1, grade: 10 });
      const frozenLevel = char.level;
      const frozenHp = char.vitals.physicalHpMax;

      const { character: updated } = levelUp(char);

      expect(char.level).toBe(frozenLevel);
      expect(char.vitals.physicalHpMax).toBe(frozenHp);
      expect(updated.level).toBe(2);
      expect(updated.vitals.physicalHpMax).toBe(17);
    });
  });

  describe("validateCharacter Function", () => {
    it("accepts a fully valid character", () => {
      const char = createMockCharacter({ level: 1, grade: 10 });
      const result = validateCharacter(char);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects invalid level and grade mismatch", () => {
      const char = createMockCharacter({ level: 0, grade: 12 });
      const result = validateCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });

    it("rejects an invalid subclass not belonging to the character's club", () => {
      const char = createMockCharacter({
        level: 3,
        grade: 11,
        ekskul_id: "student_council",
        subclass_id: "speedrunner" // Invalid for student_council!
      });
      const result = validateCharacter(char);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("bukan peminatan valid"))).toBe(true);
    });
  });
});
