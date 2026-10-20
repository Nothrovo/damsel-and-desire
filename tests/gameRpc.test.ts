import { describe, it, expect, beforeEach, vi } from "vitest";
import { characterStore } from "../src/store/characterStore";
import { longRestRpc, adjustSavingsRpc, isValidUuid } from "../src/api/gameRpc";
import { supabase } from "../src/api/supabase";
import type { Character } from "../src/types";

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char-123",
    owner_id: "user-123",
    campaign_id: null,
    name: "Aoi Kanzaki",
    ekskul_id: "astronomy",
    subclass_id: null,
    social_class_id: "medium",
    archetype_id: "ojousama",
    level: 1,
    schemaVersion: 2,
    version: 1,
    abilities: {
      physique: { score: 10, label: "Physique", short: "PHY" } as any,
      intelligent: { score: 14, label: "Intelligent", short: "INT" } as any,
      looks: { score: 12, label: "Looks", short: "LOK" } as any,
      mind: { score: 14, label: "Mind", short: "MND" } as any,
      talent: { score: 10, label: "Talent", short: "TLN" } as any,
      luck: { score: 10, label: "Luck", short: "LCK" } as any
    },
    proficient_skills: [],
    proficient_saves: [],
    vitals: {
      physicalHpCurrent: 5,
      physicalHpMax: 10,
      physicalHpTemp: 0,
      composureCurrent: 6,
      composureMax: 12,
      composureTemp: 0,
      restDiceTotal: 1,
      restDiceSpent: 1,
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
    feats: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
}

describe("Game RPC Logic & Financial Integration", () => {
  beforeEach(() => {
    characterStore.setCurrentCharacter(null);
  });

  describe("Long Rest Financial Logic (Living Cost Deduction)", () => {
    it("deducts 300 Yen daily living cost from daily money and adds net income to savings", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 15000,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // Daily: 1000, Wage: 0, Living Cost: 300 => Net: +700
      const res = await longRestRpc(char.id, 1);

      expect(res.depositDaily).toBe(1000);
      expect(res.depositWage).toBe(0);
      expect(res.livingCost).toBe(300);
      expect(res.netFinancialChange).toBe(700);
      expect(res.finances.savingsAmount).toBe(15700);
      expect(res.vitals.physicalHpCurrent).toBe(10);
      expect(res.vitals.composureCurrent).toBe(12);
      expect(res.vitals.restDiceSpent).toBe(0);
      expect(res.newVersion).toBe(2);
    });

    it("includes job wage in daily income before deducting 300 Yen living cost", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 500,
          savingsAmount: 5000,
          job: "Kasir Minimarket",
          jobWageAmount: 300
        }
      });
      characterStore.setCurrentCharacter(char);

      // Daily: 500, Wage: 300, Living Cost: 300 => Net: +500
      const res = await longRestRpc(char.id, 1);

      expect(res.depositDaily).toBe(500);
      expect(res.depositWage).toBe(300);
      expect(res.livingCost).toBe(300);
      expect(res.netFinancialChange).toBe(500);
      expect(res.finances.savingsAmount).toBe(5500);
    });

    it("clamps savings at 0 if daily income is less than living cost and savings are insufficient", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 200,
          savingsAmount: 50,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // Daily: 200, Wage: 0, Living Cost: 300 => Net: -100
      // 50 - 100 = -50 => clamped to 0
      const res = await longRestRpc(char.id, 1);

      expect(res.livingCost).toBe(300);
      expect(res.netFinancialChange).toBe(-100);
      expect(res.finances.savingsAmount).toBe(0);
    });

    it("applies Hustler feat (+50% daily money) before deducting living cost", async () => {
      const char = createMockCharacter({
        feats: [{ featId: "hustler", grantId: "origin", takenAt: new Date().toISOString() }],
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 10000,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // Hustler: 1000 * 1.5 = 1500 daily, Wage: 0, Living Cost: 300 => Net: +1200
      const res = await longRestRpc(char.id, 1);

      expect(res.depositDaily).toBe(1500);
      expect(res.livingCost).toBe(300);
      expect(res.netFinancialChange).toBe(1200);
      expect(res.finances.savingsAmount).toBe(11200);
    });
  });

  describe("Adjust Savings RPC", () => {
    it("adds savings correctly via Rupiah (¥1 = Rp100)", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 15000,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // Rp 50,000 = +¥500
      const res = await adjustSavingsRpc(char.id, 50000, 1, "Hadiah ortu");

      expect(res.deltaYen).toBe(500);
      expect(res.deltaRupiah).toBe(50000);
      expect(res.newSavingsAmount).toBe(15500);
      expect(res.finances.savingsAmount).toBe(15500);
      expect(res.newVersion).toBe(2);
    });

    it("supports direct Yen modification if specified", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 15000,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // Direct +¥300
      const res = await adjustSavingsRpc(char.id, 0, 1, "Bonus koin", 300);

      expect(res.deltaYen).toBe(300);
      expect(res.newSavingsAmount).toBe(15300);
      expect(res.finances.savingsAmount).toBe(15300);
    });

    it("subtracts savings correctly when funds are sufficient", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 15000,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // -Rp 30,000 = -¥300
      const res = await adjustSavingsRpc(char.id, -30000, 1, "Beli bento");

      expect(res.deltaYen).toBe(-300);
      expect(res.newSavingsAmount).toBe(14700);
      expect(res.finances.savingsAmount).toBe(14700);
    });

    it("throws ERR_INSUFFICIENT_FUNDS when trying to withdraw more than available savings", async () => {
      const char = createMockCharacter({
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 500,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      // Trying to withdraw ¥1,000 (-Rp 100,000) with only ¥500 available
      await expect(
        adjustSavingsRpc(char.id, -100000, 1, "Beli barang mahal")
      ).rejects.toThrow("ERR_INSUFFICIENT_FUNDS");

      // Balance remains untouched
      expect(char.finances.savingsAmount).toBe(500);
    });
  });

  describe("UUID Validation & Fixture Safety Guard", () => {
    it("differentiates valid UUIDs from mock fixture strings", () => {
      expect(isValidUuid("test-char-123")).toBe(false);
      expect(isValidUuid("user-123")).toBe(false);
      expect(isValidUuid("")).toBe(false);
      expect(isValidUuid("invalid-uuid-format")).toBe(false);

      expect(isValidUuid("00000000-0000-0000-0000-000000000000")).toBe(true);
      expect(isValidUuid("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")).toBe(true);
      expect(isValidUuid("12345678-1234-1234-1234-1234567890ab")).toBe(true);
    });

    it("does not call supabase.rpc when character ID is a non-UUID fixture string", async () => {
      const rpcSpy = vi.spyOn(supabase, "rpc");
      const char = createMockCharacter({ id: "test-char-123" });
      characterStore.setCurrentCharacter(char);

      await longRestRpc(char.id, 1);
      await adjustSavingsRpc(char.id, 10000, 1, "Tabungan");

      expect(rpcSpy).not.toHaveBeenCalled();
      rpcSpy.mockRestore();
    });

    it("correctly reconciles full finances and vitals when cloud RPC responds successfully for valid UUID", async () => {
      const validUuid = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
      const char = createMockCharacter({
        id: validUuid,
        version: 1,
        finances: {
          dailyMoneyAmount: 1000,
          savingsAmount: 10000,
          job: "-",
          jobWageAmount: 0
        }
      });
      characterStore.setCurrentCharacter(char);

      const rpcSpy = vi.spyOn(supabase, "rpc").mockResolvedValueOnce({
        data: {
          characterId: validUuid,
          deltaYen: 500,
          deltaRupiah: 50000,
          newSavingsAmount: 10500,
          finances: {
            dailyMoneyAmount: 1000,
            savingsAmount: 10500,
            job: "-",
            jobWageAmount: 0
          },
          note: "Deposit ortu",
          newVersion: 2
        },
        error: null
      } as any);

      const res = await adjustSavingsRpc(validUuid, 50000, 1, "Deposit ortu");

      expect(rpcSpy).toHaveBeenCalledWith("adjust_savings", expect.objectContaining({
        p_character_id: validUuid,
        p_delta_rupiah: 50000,
        p_client_version: 1,
        p_note: "Deposit ortu"
      }));

      expect(res.newSavingsAmount).toBe(10500);
      expect(characterStore.currentCharacter?.finances.savingsAmount).toBe(10500);
      expect(characterStore.currentCharacter?.version).toBe(2);

      rpcSpy.mockRestore();
    });
  });
});
