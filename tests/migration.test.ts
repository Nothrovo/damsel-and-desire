import { describe, it, expect } from "vitest";
import {
  migrateCharacter,
  migrateCharacters,
  normalizeGradeAndLevel
} from "../src/rules/migration";
import { getPendingChoices } from "../src/rules/progression";

describe("Character Migration Engine (Schema v2)", () => {
  describe("normalizeGradeAndLevel", () => {
    it("converts legacy grade (1..5) to appropriate level and Grade 10..12", () => {
      // Legacy grade 1 -> Level 1, Grade 10
      expect(normalizeGradeAndLevel(null, 1)).toEqual({ level: 1, grade: 10 });
      // Legacy grade 2 -> Level 2, Grade 10
      expect(normalizeGradeAndLevel(null, 2)).toEqual({ level: 2, grade: 10 });
      // Legacy grade 3 -> Level 3, Grade 11
      expect(normalizeGradeAndLevel(null, 3)).toEqual({ level: 3, grade: 11 });
      // Legacy grade 4 -> Level 4, Grade 11
      expect(normalizeGradeAndLevel(null, 4)).toEqual({ level: 4, grade: 11 });
      // Legacy grade 5 -> Level 5, Grade 12
      expect(normalizeGradeAndLevel(null, 5)).toEqual({ level: 5, grade: 12 });
    });

    it("handles modern grades (10, 11, 12) with or without levels", () => {
      expect(normalizeGradeAndLevel(1, 10)).toEqual({ level: 1, grade: 10 });
      expect(normalizeGradeAndLevel(2, 10)).toEqual({ level: 2, grade: 10 });
      expect(normalizeGradeAndLevel(3, 11)).toEqual({ level: 3, grade: 11 });
      expect(normalizeGradeAndLevel(null, 11)).toEqual({ level: 3, grade: 11 });
      expect(normalizeGradeAndLevel(null, 12)).toEqual({ level: 5, grade: 12 });
    });

    it("clamps out-of-range legacy levels to valid bounds 1..6", () => {
      expect(normalizeGradeAndLevel(0, null)).toEqual({ level: 1, grade: 10 });
      expect(normalizeGradeAndLevel(99, null)).toEqual({ level: 6, grade: 12 });
    });
  });

  describe("migrateCharacter", () => {
    it("migrates a bare legacy character to schemaVersion 2 with grade 10, level 1", () => {
      const rawLegacy = {
        id: "char_legacy_01",
        name: "Murid Baru",
        ekskul_id: "sports",
        level: 1
      };

      const result = migrateCharacter(rawLegacy);
      expect(result.migrated).toBe(true);
      expect(result.character.schemaVersion).toBe(2);
      expect(result.character.level).toBe(1);
      expect(result.character.grade).toBe(10);
      expect(result.character.vitals.restDiceTotal).toBe(1);
      expect(result.character.changelog).toHaveLength(1);
      expect(result.character.changelog?.[0].action).toBe("MIGRATION_V2");
    });

    it("auto-assigns test character 'Hououin Kyouma' to subclass 'chemist'", () => {
      const rawHououin = {
        id: "char_sample_01",
        name: "Hououin Kyouma",
        grade: 3, // Legacy Grade 3 = Level 3 (Kelas 11)
        ekskul_id: "kir_osn",
        subclass_id: null
      };

      const result = migrateCharacter(rawHououin);
      expect(result.migrated).toBe(true);
      expect(result.character.level).toBe(3);
      expect(result.character.grade).toBe(11);
      expect(result.character.subclass_id).toBe("chemist");
      expect(result.changes.some(c => c.includes("chemist"))).toBe(true);
      expect(result.character.vitals.restDiceTotal).toBe(2);
    });

    it("never auto-assigns real player character 'Seijuro Toya' and leaves subclass pending", () => {
      const rawSeijuro = {
        id: "char_player_seijuro",
        name: "Seijuro Toya",
        grade: 11, // Modern Grade 11
        level: 3,
        ekskul_id: "kendo",
        subclass_id: null
      };

      const result = migrateCharacter(rawSeijuro);
      expect(result.character.level).toBe(3);
      expect(result.character.grade).toBe(11);
      // Must NOT be auto-assigned
      expect(result.character.subclass_id).toBeNull();

      // Check pending choice detection
      const pending = getPendingChoices(result.character);
      expect(pending).toHaveLength(1);
      expect(pending[0].type).toBe("subclass");
      expect(pending[0].required).toBe(true);
      expect(pending[0].options?.map((o: any) => o.id)).toEqual(["men_striker", "iron_guard"]);
    });

    it("is completely idempotent when executed multiple times", () => {
      const raw = {
        id: "char_repeat_test",
        name: "Taro Yamada",
        grade: 2, // Legacy Grade 2 -> Level 2, Grade 10
        ekskul_id: "drama"
      };

      // Pass 1: First migration
      const firstRun = migrateCharacter(raw);
      expect(firstRun.migrated).toBe(true);
      expect(firstRun.character.schemaVersion).toBe(2);
      expect(firstRun.character.level).toBe(2);
      expect(firstRun.character.grade).toBe(10);
      const changelogLengthAfterFirst = firstRun.character.changelog?.length;

      // Pass 2: Re-migrating already migrated character
      const secondRun = migrateCharacter(firstRun.character);
      expect(secondRun.migrated).toBe(false);
      expect(secondRun.changes).toHaveLength(0);
      expect(secondRun.character.changelog?.length).toBe(changelogLengthAfterFirst);
      expect(secondRun.character.version).toBe(firstRun.character.version);

      // Pass 3: Re-migrating third time
      const thirdRun = migrateCharacter(secondRun.character);
      expect(thirdRun.migrated).toBe(false);
      expect(thirdRun.character).toEqual(secondRun.character);
    });
  });

  describe("migrateCharacters batch", () => {
    it("processes a roster array and returns accurate migrated count", () => {
      const roster = [
        { id: "c1", name: "Murid 1", level: 1 },
        { id: "c2", name: "Hououin Kyouma", grade: 3, ekskul_id: "kir_osn" },
        { id: "c3", name: "Sudah V2", level: 3, grade: 11, schemaVersion: 2, subclass_id: "presidium", vitals: { restDiceTotal: 2, physicalHpMax: 20, physicalHpCurrent: 20, composureMax: 20, composureCurrent: 20 } }
      ];

      const { characters, totalMigrated } = migrateCharacters(roster);
      expect(characters).toHaveLength(3);
      expect(totalMigrated).toBe(2); // c1 and c2 need migration, c3 is already valid v2
      expect(characters[1].subclass_id).toBe("chemist");
      expect(characters[2].subclass_id).toBe("presidium");
    });
  });
});
