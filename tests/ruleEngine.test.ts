import { describe, it, expect } from "vitest";
import {
  calculateAbilityModifier,
  formatModifier,
  calculateProficiencyBonus,
  calculatePointBuyTotal,
  isValidStandardArray,
  yenToRupiah,
  rupiahToYen
} from "../src/services/ruleEngine";
import { validateCharacterJson } from "../src/services/exporter";

describe("Rule Engine: Ability Score & Modifiers", () => {
  it("calculates D&D 5e ability modifiers correctly", () => {
    expect(calculateAbilityModifier(8)).toBe(-1);
    expect(calculateAbilityModifier(9)).toBe(-1);
    expect(calculateAbilityModifier(10)).toBe(0);
    expect(calculateAbilityModifier(11)).toBe(0);
    expect(calculateAbilityModifier(12)).toBe(1);
    expect(calculateAbilityModifier(13)).toBe(1);
    expect(calculateAbilityModifier(14)).toBe(2);
    expect(calculateAbilityModifier(15)).toBe(2);
    expect(calculateAbilityModifier(18)).toBe(4);
    expect(calculateAbilityModifier(20)).toBe(5);
  });

  it("formats positive and negative modifiers with + and - signs", () => {
    expect(formatModifier(2)).toBe("+2");
    expect(formatModifier(0)).toBe("+0");
    expect(formatModifier(-1)).toBe("-1");
  });

  it("calculates proficiency bonus by grade/level", () => {
    expect(calculateProficiencyBonus(1)).toBe(2);
    expect(calculateProficiencyBonus(2)).toBe(2);
    expect(calculateProficiencyBonus(3)).toBe(2);
    expect(calculateProficiencyBonus(4)).toBe(2);
    expect(calculateProficiencyBonus(5)).toBe(3);
  });
});

describe("Rule Engine: Standard Array Validation", () => {
  it("accepts valid standard array permutations", () => {
    expect(isValidStandardArray([15, 14, 13, 12, 10, 8])).toBe(true);
    expect(isValidStandardArray([8, 10, 12, 13, 14, 15])).toBe(true);
    expect(isValidStandardArray([14, 8, 15, 10, 13, 12])).toBe(true);
  });

  it("rejects duplicates or modified values", () => {
    expect(isValidStandardArray([15, 15, 13, 12, 10, 8])).toBe(false);
    expect(isValidStandardArray([16, 14, 13, 12, 10, 8])).toBe(false);
    expect(isValidStandardArray([15, 14, 13, 12, 10])).toBe(false); // only 5
  });
});

describe("Rule Engine: Point Buy (27 Points)", () => {
  it("calculates exact cost for standard point buy spreads", () => {
    // 15 (9), 15 (9), 15 (9), 8 (0), 8 (0), 8 (0) = 27
    expect(calculatePointBuyTotal([15, 15, 15, 8, 8, 8])).toBe(27);
    // 14 (7), 14 (7), 14 (7), 10 (2), 10 (2), 10 (2) = 27
    expect(calculatePointBuyTotal([14, 14, 14, 10, 10, 10])).toBe(27);
    // All 8s = 0 points
    expect(calculatePointBuyTotal([8, 8, 8, 8, 8, 8])).toBe(0);
  });

  it("identifies when point buy budget is exceeded", () => {
    const total = calculatePointBuyTotal([15, 15, 15, 15, 8, 8]); // 9+9+9+9 = 36
    expect(total).toBe(36);
    expect(total > 27).toBe(true);
  });

  it("throws error for scores out of 8-15 range", () => {
    expect(() => calculatePointBuyTotal([7, 10, 10, 10, 10, 10])).toThrow();
    expect(() => calculatePointBuyTotal([16, 10, 10, 10, 10, 10])).toThrow();
  });
});

describe("Rule Engine: Economy Currency Conversion", () => {
  it("converts Yen to Rupiah at 1:100 exchange rate", () => {
    expect(yenToRupiah(1000)).toBe(100000);
    expect(yenToRupiah(15000)).toBe(1500000);
  });

  it("converts Rupiah to Yen at 100:1 exchange rate with integer floor", () => {
    expect(rupiahToYen(100000)).toBe(1000);
    expect(rupiahToYen(1500000)).toBe(15000);
    expect(rupiahToYen(10050)).toBe(100);
  });
});

describe("Exporter: JSON Character Validation", () => {
  it("validates valid v2 and v1 character schemas", () => {
    const v2Payload = {
      _schema: "damsel_and_desire_v2",
      character: {
        name: "Yuki",
        abilities: { physique: 10, intelligent: 10, looks: 10, mind: 10, talent: 10, luck: 10 }
      }
    };
    expect(validateCharacterJson(v2Payload).valid).toBe(true);

    const v1Payload = {
      name: "Yuki",
      baseAbilities: { physique: 10, intelligent: 10, looks: 10, mind: 10, talent: 10, luck: 10 }
    };
    expect(validateCharacterJson(v1Payload).valid).toBe(true);
  });

  it("rejects invalid JSON payloads", () => {
    expect(validateCharacterJson(null).valid).toBe(false);
    expect(validateCharacterJson({}).valid).toBe(false);
    expect(validateCharacterJson({ random: "data" }).valid).toBe(false);
  });
});
