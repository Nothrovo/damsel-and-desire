import { describe, it, expect } from "vitest";
import {
  STANDARD_COMBAT_ACTIONS,
  STANDARD_PHYSICAL_MOVES,
  STANDARD_SOCIAL_MOVES,
  resolveMoveRollParameters
} from "../src/rules/combatActions";

describe("Move Balancing, Tactical Pros/Cons & Effect Ambiguity Elimination", () => {
  it("ensures EVERY move has explicit pros (+), cons (-), and unambiguous clearEffect", () => {
    for (const move of STANDARD_COMBAT_ACTIONS) {
      expect(move.pros, `Move ${move.name} must have pros`).toBeTruthy();
      expect(move.cons, `Move ${move.name} must have cons`).toBeTruthy();
      expect(move.clearEffect, `Move ${move.name} must have clearEffect`).toBeTruthy();
      expect(move.moveKind, `Move ${move.name} must have moveKind`).toBeDefined();
    }
  });

  it("verifies punch (unarmed strike) and heavy kick balance: punch has accuracy bonus & disrupt, kick has higher damage & knockback with overcommit drawback", () => {
    const punch = STANDARD_COMBAT_ACTIONS.find((m) => m.id === "action_unarmed_strike");
    expect(punch).toBeDefined();
    expect(punch?.damageDie).toBe("1d4");
    expect(punch?.pros).toContain("Akurat");
    expect(punch?.clearEffect).toContain("Disorientasi");

    // Physical moves contains heavy kick
    const kick = STANDARD_PHYSICAL_MOVES.find((m) => m.id === "action_heavy_kick");
    expect(kick).toBeDefined();
    expect(kick?.damageDie).toBe("1d6");
    expect(kick?.pros).toContain("Daya Hancur");
    expect(kick?.cons).toContain("Overcommit");
    expect(kick?.clearEffect).toContain("Knockback");
  });

  it("classifies moves clearly into physical and social categories", () => {
    expect(STANDARD_PHYSICAL_MOVES.length).toBeGreaterThanOrEqual(5);
    expect(STANDARD_SOCIAL_MOVES.length).toBeGreaterThanOrEqual(4);

    for (const p of STANDARD_PHYSICAL_MOVES) {
      expect(p.moveKind).toBe("physical");
    }
    for (const s of STANDARD_SOCIAL_MOVES) {
      expect(s.moveKind).toBe("social");
    }
  });

  it("resolves direct roll parameters linked to character statistics", () => {
    const mockStats = {
      physique: 16, // +3
      intelligent: 14, // +2
      looks: 18, // +4
      mind: 12, // +1
      talent: 10, // 0
      luck: 10 // 0
    };

    const punch = STANDARD_COMBAT_ACTIONS.find((m) => m.id === "action_unarmed_strike")!;
    const punchParams = resolveMoveRollParameters(punch, mockStats);
    expect(punchParams.checkDie).toBe("d20");
    // +3 Physique + 1 accuracy bonus = 4
    expect(punchParams.checkMod).toBe(4);
    expect(punchParams.damageDie).toBe("d4");
    expect(punchParams.damageMod).toBe(3); // +3 Physique
    expect(punchParams.damageLabel).toContain("Pukulan");

    const taunt = STANDARD_COMBAT_ACTIONS.find((m) => m.id === "action_social_remark")!;
    const tauntParams = resolveMoveRollParameters(taunt, mockStats);
    expect(tauntParams.checkDie).toBe("d20");
    expect(tauntParams.checkMod).toBe(2); // +2 Intelligent
    expect(tauntParams.damageDie).toBe("d4");
    expect(tauntParams.damageMod).toBe(2);

    const support = STANDARD_COMBAT_ACTIONS.find((m) => m.id === "action_help_support")!;
    const supportParams = resolveMoveRollParameters(support, mockStats);
    expect(supportParams.isHeal).toBe(true);
    expect(supportParams.damageDie).toBe("d4");
    expect(supportParams.damageMod).toBe(1); // +1 Mind
  });
});
