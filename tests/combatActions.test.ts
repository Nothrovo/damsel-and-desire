import { describe, it, expect } from "vitest";
import {
  STANDARD_COMBAT_ACTIONS,
  calculateCombatSaveDC,
  resolveShoveContest,
  getArchetypeReworkData,
  getSocialClassReworkData,
  ALL_REWORKED_ARCHETYPE_IDS,
  ALL_REWORKED_SOCIAL_CLASS_IDS
} from "../src/rules/combatActions";

describe("Combat Action Economy (5e Adaptation)", () => {
  it("contains all 8 standard combat actions partitioned by cost type", () => {
    expect(STANDARD_COMBAT_ACTIONS).toBeDefined();
    expect(STANDARD_COMBAT_ACTIONS.length).toBe(8);

    const actions = STANDARD_COMBAT_ACTIONS.filter(a => a.actionType === "action");
    const bonusActions = STANDARD_COMBAT_ACTIONS.filter(a => a.actionType === "bonus_action");
    const reactions = STANDARD_COMBAT_ACTIONS.filter(a => a.actionType === "reaction");

    expect(actions.length).toBe(5);
    expect(bonusActions.length).toBe(2);
    expect(reactions.length).toBe(1);

    const actionIds = STANDARD_COMBAT_ACTIONS.map(a => a.id);
    expect(actionIds).toContain("action_unarmed_strike");
    expect(actionIds).toContain("action_shove");
    expect(actionIds).toContain("action_dodge_guard");
    expect(actionIds).toContain("action_help_support");
    expect(actionIds).toContain("action_disengage");
    expect(actionIds).toContain("action_social_remark");
    expect(actionIds).toContain("action_use_item");
    expect(actionIds).toContain("action_opportunity_attack");
  });

  it("calculates combat and social save DCs using standard 5e formula (8 + PB + Mod)", () => {
    // Level 1-4: PB is 2
    expect(calculateCombatSaveDC(2, 2)).toBe(12); // 8 + 2 + 2
    expect(calculateCombatSaveDC(2, 0)).toBe(10); // 8 + 2 + 0
    expect(calculateCombatSaveDC(2, -1)).toBe(9);  // 8 + 2 - 1

    // Level 5-6: PB is 3
    expect(calculateCombatSaveDC(3, 3)).toBe(14); // 8 + 3 + 3
    expect(calculateCombatSaveDC(3, 4)).toBe(15); // 8 + 3 + 4
  });

  it("resolves shove contest correctly", () => {
    // Attacker wins
    const winPush = resolveShoveContest(12, 10, "push");
    expect(winPush.success).toBe(true);
    expect(winPush.effect).toBe("Target terdorong 5 ft menjauhi penyerang.");

    const winProne = resolveShoveContest(15, 12, "prone");
    expect(winProne.success).toBe(true);
    expect(winProne.effect).toBe("Target terjatuh Prone (tiarap / terjengkang).");

    // Tie goes to attacker (or defender depending on contest, standard DC tie = success)
    const tie = resolveShoveContest(12, 12, "push");
    expect(tie.success).toBe(true);

    // Defender wins
    const fail = resolveShoveContest(9, 14, "push");
    expect(fail.success).toBe(false);
    expect(fail.effect).toBe("Dorongan gagal; target berhasil menjaga keseimbangan posisi berdirinya.");
  });
});

describe("Archetype Rework Specification", () => {
  it("provides comprehensive rework data for all 8 archetypes", () => {
    expect(ALL_REWORKED_ARCHETYPE_IDS.length).toBe(8);

    for (const id of ALL_REWORKED_ARCHETYPE_IDS) {
      const data = getArchetypeReworkData(id);
      expect(data).toBeDefined();
      expect(data?.id).toBe(id);
      expect(data?.name).toBeTruthy();
      expect(data?.statBonus).toBeDefined();
      expect(data?.rollBonus).toBeDefined();
      expect(data?.socialFocus).toBeDefined();
      expect(data?.uniqueTraits).toBeDefined();
      expect(data?.uniqueTraits.length).toBe(3);
    }
  });

  it("verifies Class Clown has correct roll bonus, social focus, and 3 unique traits", () => {
    const clown = getArchetypeReworkData("class_clown");
    expect(clown?.statBonus).toEqual({ looks: 1, talent: 2 });
    expect(clown?.rollBonus.name).toBe("Funny Bone");
    expect(clown?.socialFocus.name).toBe("Icebreaker");
    expect(clown?.uniqueTraits.map(t => t.name)).toEqual([
      "Tension Breaker",
      "Class Buffoon",
      "Heckler Resistance"
    ]);
  });

  it("verifies Delinquent has Heavy Stance, Street Respect, and 3 traits", () => {
    const delinquent = getArchetypeReworkData("delinquent");
    expect(delinquent?.statBonus).toEqual({ looks: 1, physique: 2 });
    expect(delinquent?.rollBonus.name).toBe("Heavy Stance");
    expect(delinquent?.socialFocus.name).toBe("Street Respect");
    expect(delinquent?.uniqueTraits.map(t => t.name)).toEqual([
      "Street Crew",
      "Street Smart Navigation",
      "Scruffy Durability"
    ]);
  });

  it("verifies Weeb has Dramatic Flare, Sub-Culture Brotherhood, and Chuunibyou + Gacha Luck", () => {
    const weeb = getArchetypeReworkData("weeb");
    expect(weeb?.statBonus).toEqual({ talent: 1, luck: 2 });
    expect(weeb?.rollBonus.name).toBe("Dramatic Flare");
    expect(weeb?.socialFocus.name).toBe("Sub-Culture Brotherhood");
    expect(weeb?.uniqueTraits.map(t => t.name)).toEqual([
      "Secret Chuunibyou Technique",
      "Gacha Luck",
      "Obscure Lore Master"
    ]);
  });
});

describe("Social Class Mechanical Rework", () => {
  it("provides complete mechanics for all 6 social classes", () => {
    expect(ALL_REWORKED_SOCIAL_CLASS_IDS.length).toBe(6);

    for (const id of ALL_REWORKED_SOCIAL_CLASS_IDS) {
      const sc = getSocialClassReworkData(id);
      expect(sc).toBeDefined();
      expect(sc?.id).toBe(id);
      expect(sc?.privilege).toBeTruthy();
      expect(sc?.perks.length).toBeGreaterThanOrEqual(1);
      expect(sc?.drawback).toBeTruthy();
    }
  });

  it("verifies Rich and Poor class perks match Saran.txt specifications", () => {
    const rich = getSocialClassReworkData("rich");
    expect(rich?.perks[0].name).toBe("Pampered Comfort");
    expect(rich?.drawback).toContain("Street");

    const poor = getSocialClassReworkData("poor");
    expect(poor?.perks.map(p => p.name)).toEqual([
      "Unbreakable Determination",
      "Hard Work Stamina",
      "Brawler Spirit"
    ]);
    expect(poor?.drawback).toContain("Guru BP");
  });

  it("verifies Orphanage class perks include Found Family Shield and Shared Pain", () => {
    const orphanage = getSocialClassReworkData("orphanage");
    expect(orphanage?.perks.map(p => p.name)).toEqual([
      "Found Family Shield",
      "Shared Pain (Empathy)",
      "Street Kinship"
    ]);
  });
});

describe("Compendium Integration with Reworked Archetypes & Actions", () => {
  it("resolves all archetypes with rework data from getCompendiumArchetypes", async () => {
    const { getCompendiumArchetypes } = await import("../src/api/compendium");
    const archetypes = await getCompendiumArchetypes();
    expect(archetypes.length).toBeGreaterThanOrEqual(8);

    const clown = archetypes.find(a => a.id === "class_clown");
    expect(clown).toBeDefined();
    expect(clown?.roll_bonus?.name).toBe("Funny Bone");
    expect(clown?.social_focus?.name).toBe("Icebreaker");
    expect(clown?.unique_traits?.length).toBe(3);

    const nerd = archetypes.find(a => a.id === "nerd");
    expect(nerd).toBeDefined();
    expect(nerd?.roll_bonus?.name).toBe("Analytical Strike");
    expect(nerd?.unique_traits?.length).toBe(3);
  });

  it("resolves all social classes with perks and drawbacks from getCompendiumSocialClasses", async () => {
    const { getCompendiumSocialClasses } = await import("../src/api/compendium");
    const classes = await getCompendiumSocialClasses();
    expect(classes.length).toBe(6);

    const rich = classes.find(c => c.id === "rich");
    expect(rich?.perks?.[0].name).toBe("Pampered Comfort");
    expect(rich?.privilege).toBeTruthy();
    expect(rich?.drawback).toBeTruthy();

    const poor = classes.find(c => c.id === "poor");
    expect(poor?.perks?.length).toBe(3);
  });

  it("resolves standard combat actions from getCompendiumBasicActions", async () => {
    const { getCompendiumBasicActions } = await import("../src/api/compendium");
    const actions = await getCompendiumBasicActions();
    expect(actions.length).toBeGreaterThanOrEqual(8);

    const shove = actions.find(a => a.id === "action_shove");
    expect(shove).toBeDefined();
    expect(shove?.cost).toBe("Action");

    const socialRemark = actions.find(a => a.id === "action_social_remark");
    expect(socialRemark).toBeDefined();
    expect(socialRemark?.action_type).toBe("bonus_action");

    const oppAttack = actions.find(a => a.id === "action_opportunity_attack");
    expect(oppAttack).toBeDefined();
    expect(oppAttack?.action_type).toBe("reaction");
  });
});
