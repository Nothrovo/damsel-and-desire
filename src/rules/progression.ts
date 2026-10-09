import type {
  Character,
  CharacterChangeLogEntry,
  ClubMoveCompendium,
  SubclassMoveCompendium,
  EkskulCompendium,
  FeatDefinition,
  FeatGrant,
  CharacterFeatTaken,
  FeatCategory,
  AbilityKey,
  CharacterAbilities
} from "../types";
import { FALLBACK_DD_DATA, ALL_FEATS } from "../data/fallbackCompendium";
import { calculateAbilityModifier, calculateProficiencyBonus } from "../services/ruleEngine";
import { ensureGradeFeatGrants } from "./migration";

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 6;

/**
 * Returns school grade (10, 11, or 12) for a given character level (1..6).
 * Lvl 1 & 2 = Kelas 10
 * Lvl 3 & 4 = Kelas 11
 * Lvl 5 & 6 = Kelas 12
 */
export function getGradeForLevel(level: number): 10 | 11 | 12 {
  if (level <= 2) return 10;
  if (level <= 4) return 11;
  return 12;
}

/**
 * Returns semester (1 or 2) for a given character level (1..6).
 */
export function getSemesterForLevel(level: number): 1 | 2 {
  return (Math.max(1, Math.min(MAX_LEVEL, level)) % 2 === 1) ? 1 : 2;
}

/**
 * Human-readable label for a character level, e.g. "Kelas 10 (Sem 1)".
 */
export function getLevelLabel(level: number): string {
  const g = getGradeForLevel(level);
  const sem = getSemesterForLevel(level);
  return `Kelas ${g} (Sem ${sem})`;
}

/**
 * Human-readable label for a school grade, e.g. "Kelas 10".
 */
export function getGradeLabel(grade: number): string {
  return `Kelas ${grade}`;
}

/**
 * Rest dice count is determined by grade:
 * Kelas 10 = 1 die
 * Kelas 11 = 2 dice
 * Kelas 12 = 3 dice
 */
export function getRestDiceCountForLevel(level: number): number {
  const grade = getGradeForLevel(level);
  return grade === 10 ? 1 : grade === 11 ? 2 : 3;
}

/**
 * Parse hit die string ("d6" | "d8" | "d10") into max sides.
 */
export function getHitDieSides(hitDie: string = "d8"): number {
  if (hitDie.includes("10")) return 10;
  if (hitDie.includes("6")) return 6;
  return 8;
}

/**
 * Hit die fixed average for leveling beyond Level 1:
 * d6 -> 4, d8 -> 5, d10 -> 6 (consistent with 5e PHB standard progression).
 */
export function getHitDieAverage(hitDie: string = "d8"): number {
  const sides = getHitDieSides(hitDie);
  if (sides === 10) return 6;
  if (sides === 6) return 4;
  return 5;
}

/**
 * Safely extracts numeric ability score whether stored as number or { score: number }.
 */
export function extractAbilityScore(val: any): number {
  if (typeof val === "object" && val !== null) {
    return typeof val.score === "number" ? val.score : 10;
  }
  return typeof val === "number" ? val : 10;
}

/**
 * Returns the innate ability score bonuses granted by a character's Archetype.
 * E.g. Delinquent (+2 Physique, +1 Looks), Jock (+2 Physique, +1 Talent), Normies (+1 All), etc.
 */
export function getArchetypeStatBonus(archetypeId?: string): Partial<Record<AbilityKey, number>> {
  if (!archetypeId) return {};
  const normId = archetypeId.toLowerCase().trim();
  const arch = FALLBACK_DD_DATA.archetypes.find((a: any) => a.id.toLowerCase() === normId);
  return (arch?.statBonus || (arch as any)?.stat_bonus || {}) as Partial<Record<AbilityKey, number>>;
}

/**
 * Returns the effective ability score (base score + archetype stat bonus) for a given ability key.
 */
export function getEffectiveAbilityScore(character: Partial<Character>, stat: AbilityKey): number {
  const base = extractAbilityScore((character.abilities as any)?.[stat]);
  const archBonus = getArchetypeStatBonus(character.archetype_id || (character as any)?.archetypeId);
  return base + (archBonus[stat] || 0);
}

/**
 * Calculate HP gain for a specific level up.
 * Level 1: HitDieMax + Mod PHY + (Delinquent +2) + (BuiltDifferent +2)
 * Level 2..6: HitDieAvg + Mod PHY + (Delinquent +2) + (BuiltDifferent +2)
 * Minimum gain is always 1 HP.
 */
export function calculateHpGainAtLevel(
  level: number,
  hitDie: string,
  physiqueScore: number,
  isDelinquent: boolean,
  hasBuiltDifferent: boolean = false
): number {
  const modPhy = calculateAbilityModifier(physiqueScore);
  const delinquentBonus = isDelinquent ? 2 : 0;
  const builtDiffBonus = hasBuiltDifferent ? 2 : 0;

  if (level <= 1) {
    const sides = getHitDieSides(hitDie);
    return Math.max(1, sides + modPhy + delinquentBonus + builtDiffBonus);
  }
  const avg = getHitDieAverage(hitDie);
  return Math.max(1, avg + modPhy + delinquentBonus + builtDiffBonus);
}

/**
 * Calculate total Max HP from Level 1 up to target level.
 */
export function calculateMaxHp(
  level: number,
  hitDie: string,
  physiqueScore: number,
  isDelinquent: boolean,
  hasBuiltDifferent: boolean = false
): number {
  const clampedLevel = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
  let total = 0;
  for (let l = 1; l <= clampedLevel; l++) {
    total += calculateHpGainAtLevel(l, hitDie, physiqueScore, isDelinquent, hasBuiltDifferent);
  }
  return total;
}

/**
 * Calculate Composure gain for a specific level up.
 * Level 1: 10 + Mod MND + (WhoGonnaCarryTheBoats +2)
 * Level 2..6: 4 + Mod MND + (WhoGonnaCarryTheBoats +2)
 * Minimum gain is always 1 Composure.
 */
export function calculateComposureGainAtLevel(
  level: number,
  mindScore: number,
  hasWhoGonnaCarryTheBoats: boolean = false
): number {
  const modMnd = calculateAbilityModifier(mindScore);
  const boatsBonus = hasWhoGonnaCarryTheBoats ? 2 : 0;
  if (level <= 1) {
    return Math.max(1, 10 + modMnd + boatsBonus);
  }
  return Math.max(1, 4 + modMnd + boatsBonus);
}

/**
 * Calculate total Max Composure from Level 1 up to target level.
 */
export function calculateMaxComposure(
  level: number,
  mindScore: number,
  hasWhoGonnaCarryTheBoats: boolean = false
): number {
  const clampedLevel = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
  let total = 0;
  for (let l = 1; l <= clampedLevel; l++) {
    total += calculateComposureGainAtLevel(l, mindScore, hasWhoGonnaCarryTheBoats);
  }
  return total;
}

export interface EffectiveCharacterStats {
  abilities: CharacterAbilities;
  modifiers: Record<AbilityKey, number>;
  proficiencyBonus: number;
  physicalHpMax: number;
  composureMax: number;
  speed: string;
  speedFeet: number;
  passivePerception: number;
  passiveInsight: number;
  passiveInvestigation: number;
  proficientSkills: string[];
  proficientSaves: string[];
  jackOfAllTrades: boolean;
  jackOfAllTradesBonus: number;
  clumsyLuckBonus: number;
  luckBonus: number;
  meleeToHitBonus: number;
  unarmedDamageBonus: number;
  hasBuiltDifferent: boolean;
  hasWhoGonnaCarryTheBoats: boolean;
  hpMaxBonus: number;
  composureMaxBonus: number;
}

/**
 * Calculates unified effective stats for a character, factoring in base stats,
 * level scaling, ekskul hit dice, archetype traits, and all taken Feat effects.
 */
export function calculateEffectiveStats(
  character: Character,
  compendiumFeats: FeatDefinition[] = ALL_FEATS
): EffectiveCharacterStats {
  const featMap = new Map<string, FeatDefinition>(compendiumFeats.map(f => [f.id, f]));
  const takenFeats = character.feats || [];

  const baseScores: Record<AbilityKey, number> = {
    physique: extractAbilityScore(character.abilities?.physique),
    intelligent: extractAbilityScore(character.abilities?.intelligent),
    looks: extractAbilityScore(character.abilities?.looks),
    mind: extractAbilityScore(character.abilities?.mind),
    talent: extractAbilityScore(character.abilities?.talent),
    luck: extractAbilityScore(character.abilities?.luck)
  };

  const archBonus = getArchetypeStatBonus(character.archetype_id || (character as any)?.archetypeId);
  const effectiveAbilities: CharacterAbilities = {
    physique: baseScores.physique + (archBonus.physique || 0),
    intelligent: baseScores.intelligent + (archBonus.intelligent || 0),
    looks: baseScores.looks + (archBonus.looks || 0),
    mind: baseScores.mind + (archBonus.mind || 0),
    talent: baseScores.talent + (archBonus.talent || 0),
    luck: baseScores.luck + (archBonus.luck || 0)
  };
  const modifiers: Record<AbilityKey, number> = {} as any;

  const statKeys: AbilityKey[] = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
  for (const k of statKeys) {
    modifiers[k] = calculateAbilityModifier(effectiveAbilities[k]);
  }

  const pb = calculateProficiencyBonus(character.level);

  const profSkills = new Set<string>(character.proficient_skills || []);
  const profSaves = new Set<string>(character.proficient_saves || []);

  let hasBuiltDifferent = false;
  let hasWhoGonnaCarryTheBoats = false;
  let hasSprinter = false;
  let flatPassivePerceptionBonus = 0;
  let flatPassiveInvestigationBonus = 0;
  let hasJackOfAllTrades = false;
  let clumsyLuckBonus = 0;
  let meleeToHitBonus = 0;
  let unarmedDamageBonus = 0;

  for (const taken of takenFeats) {
    const feat = featMap.get(taken.featId);
    if (!feat) continue;

    if (feat.effects?.skillsGranted) {
      feat.effects.skillsGranted.forEach(s => profSkills.add(s));
    }
    if (taken.choices?.skills) {
      taken.choices.skills.forEach(s => profSkills.add(s));
    }
    if (feat.effects?.savesGranted) {
      feat.effects.savesGranted.forEach(s => profSaves.add(s));
    }
    if (taken.choices?.saves) {
      taken.choices.saves.forEach(s => profSaves.add(s));
    }

    if (feat.id === "built_different" || feat.effects?.hpPerLevelBonus) hasBuiltDifferent = true;
    if (feat.id === "whos_gonna_carry_the_boats" || feat.effects?.composurePerLevelBonus) hasWhoGonnaCarryTheBoats = true;
    if (feat.id === "sprinter" || feat.effects?.flatSpeed) hasSprinter = true;
    if (feat.effects?.flatPassivePerception) flatPassivePerceptionBonus += feat.effects.flatPassivePerception;
    if (feat.effects?.flatPassiveInvestigation) flatPassiveInvestigationBonus += feat.effects.flatPassiveInvestigation;
    if (feat.id === "jack_of_all_trades" || feat.effects?.jackOfAllTrades) hasJackOfAllTrades = true;
    if (feat.id === "clumsy" || feat.effects?.clumsyLuckBonus) clumsyLuckBonus += (feat.effects?.clumsyLuckBonus ?? 2);
    if (feat.effects?.meleeToHitBonus) meleeToHitBonus += feat.effects.meleeToHitBonus;
    if (feat.effects?.unarmedDamageBonus) unarmedDamageBonus += feat.effects.unarmedDamageBonus;
  }

  const ekskul = resolveEkskulData(character.ekskul_id);
  const hitDie = ekskul?.hit_die || "d8";
  const isDelinquent = character.archetype_id === "delinquent";

  const minHp = calculateMaxHp(character.level, hitDie, effectiveAbilities.physique, isDelinquent, hasBuiltDifferent);
  const rawHpMax = character.vitals?.physicalHpMax ?? minHp;
  const physicalHpMax = Math.max(rawHpMax, minHp);

  const minComp = calculateMaxComposure(character.level, effectiveAbilities.mind, hasWhoGonnaCarryTheBoats);
  const rawCompMax = character.vitals?.composureMax ?? minComp;
  const composureMax = Math.max(rawCompMax, minComp);

  const baseSpeedFeet = character.archetype_id === "jock" ? 35 : 30;
  const totalSpeedFeet = baseSpeedFeet + (hasSprinter ? 10 : 0);
  const speed = `${totalSpeedFeet} ft`;

  const hasAwareness = profSkills.has("awareness");
  const hasPeople = profSkills.has("people") || profSkills.has("interpersonal");
  const hasAcademic = profSkills.has("academic");

  const passivePerception = 10 + modifiers.mind + (hasAwareness ? pb : 0) + flatPassivePerceptionBonus;
  const passiveInsight = 10 + modifiers.intelligent + (hasPeople ? pb : 0);
  const passiveInvestigation = 10 + modifiers.intelligent + (hasAcademic ? pb : 0) + flatPassiveInvestigationBonus;

  return {
    abilities: effectiveAbilities,
    modifiers,
    proficiencyBonus: pb,
    physicalHpMax,
    composureMax,
    speed,
    speedFeet: totalSpeedFeet,
    passivePerception,
    passiveInsight,
    passiveInvestigation,
    proficientSkills: Array.from(profSkills),
    proficientSaves: Array.from(profSaves),
    jackOfAllTrades: hasJackOfAllTrades,
    jackOfAllTradesBonus: hasJackOfAllTrades ? 1 : 0,
    clumsyLuckBonus,
    luckBonus: clumsyLuckBonus,
    meleeToHitBonus,
    unarmedDamageBonus,
    hasBuiltDifferent,
    hasWhoGonnaCarryTheBoats,
    hpMaxBonus: hasBuiltDifferent ? character.level * 2 : 0,
    composureMaxBonus: hasWhoGonnaCarryTheBoats ? character.level : 0
  };
}

/**
 * Helper to fetch ekskul definition from provided compendium or static fallback.
 */
export function resolveEkskulData(
  ekskulId: string,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): EkskulCompendium | undefined {
  if (compendiumEkskul) {
    if (Array.isArray(compendiumEkskul)) {
      const found = compendiumEkskul.find(e => e.id === ekskulId);
      if (found) return found;
    } else if (compendiumEkskul.id === ekskulId) {
      return compendiumEkskul;
    }
  }

  const fallback = FALLBACK_DD_DATA.ekskul.find((e: any) => e.id === ekskulId);
  if (!fallback) return undefined;

  return {
    id: fallback.id,
    name: fallback.name,
    tagline: fallback.tagline,
    hit_die: fallback.hitDie,
    primary_stat: fallback.primaryStat,
    saving_throws: fallback.savingThrows,
    perk_description: fallback.perkDesc,
    subclasses: (fallback.subclasses || []).map((sc: any) => ({
      id: sc.id,
      ekskul_id: fallback.id,
      name: sc.name,
      tagline: sc.tagline,
      identity_desc: sc.identityDesc,
      description: sc.desc,
      subclass_moves: (sc.subclassMoves || []).map((sm: any) => ({
        id: sm.id,
        subclass_id: sc.id,
        name: sm.name,
        tier: sm.tier,
        unlock_grade: sm.unlockGrade,
        move_type: sm.type,
        cost: sm.cost,
        range: sm.range,
        check_type: sm.check,
        effect: sm.effect,
        description: sm.desc
      }))
    })),
    club_moves: (fallback.clubMoves || []).map((m: any, idx: number) => ({
      id: m.id || `${fallback.id}_move_${idx + 1}`,
      ekskul_id: fallback.id,
      name: m.name,
      move_type: m.type,
      cost: m.cost,
      range: m.range,
      check_type: m.check,
      effect: m.effect,
      description: m.desc,
      order: m.order || (idx + 1),
      unlock_grade: m.unlockGrade || (idx === 0 ? 10 : idx === 1 ? 11 : 12)
    }))
  };
}

export interface CharacterMovesSummary {
  unlockedClubMoves: ClubMoveCompendium[];
  lockedClubMoves: ClubMoveCompendium[];
  unlockedSubclassMoves: SubclassMoveCompendium[];
  lockedSubclassMoves: SubclassMoveCompendium[];
  candidateSubclassMoves?: SubclassMoveCompendium[];
}

/**
 * Returns all moves partitioned into unlocked and locked for a character.
 */
export function getAllMovesSummary(
  character: Character,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): CharacterMovesSummary {
  const ekskul = resolveEkskulData(character.ekskul_id, compendiumEkskul);
  const grade = character.grade ?? getGradeForLevel(character.level);

  const unlockedClubMoves: ClubMoveCompendium[] = [];
  const lockedClubMoves: ClubMoveCompendium[] = [];
  const unlockedSubclassMoves: SubclassMoveCompendium[] = [];
  const lockedSubclassMoves: SubclassMoveCompendium[] = [];
  const candidateSubclassMoves: SubclassMoveCompendium[] = [];

  if (ekskul?.club_moves) {
    for (const move of ekskul.club_moves) {
      const reqGrade = move.unlock_grade ?? (move.order === 1 ? 10 : move.order === 2 ? 11 : 12);
      if (grade >= reqGrade) {
        unlockedClubMoves.push(move);
      } else {
        lockedClubMoves.push(move);
      }
    }
  }

  if (ekskul?.subclasses) {
    const chosenSubclass = ekskul.subclasses.find(sc => sc.id === character.subclass_id);
    if (chosenSubclass && chosenSubclass.subclass_moves) {
      for (const move of chosenSubclass.subclass_moves) {
        const reqGrade = move.unlock_grade ?? (move.tier === "G12" ? 12 : 11);
        if (grade >= reqGrade) {
          unlockedSubclassMoves.push(move);
        } else {
          lockedSubclassMoves.push(move);
        }
      }
    } else if (!character.subclass_id) {
      // Not chosen yet; collect all available subclass moves for preview
      for (const sc of ekskul.subclasses) {
        if (sc.subclass_moves) {
          candidateSubclassMoves.push(...sc.subclass_moves);
        }
      }
    }
  }

  return {
    unlockedClubMoves,
    lockedClubMoves,
    unlockedSubclassMoves,
    lockedSubclassMoves,
    candidateSubclassMoves
  };
}

/**
 * Returns currently usable / rollable moves for the character.
 */
export function getUnlockedMoves(
  character: Character,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): { clubMoves: ClubMoveCompendium[]; subclassMoves: SubclassMoveCompendium[] } {
  const summary = getAllMovesSummary(character, compendiumEkskul);
  return {
    clubMoves: summary.unlockedClubMoves,
    subclassMoves: summary.unlockedSubclassMoves
  };
}

/**
 * Returns future / locked moves for the character.
 */
export function getLockedMoves(
  character: Character,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): { clubMoves: ClubMoveCompendium[]; subclassMoves: SubclassMoveCompendium[] } {
  const summary = getAllMovesSummary(character, compendiumEkskul);
  return {
    clubMoves: summary.lockedClubMoves,
    subclassMoves: summary.lockedSubclassMoves
  };
}

export interface PendingChoice {
  id: string;
  type: "subclass" | "feat";
  required: boolean;
  title: string;
  description: string;
  options?: any[];
  grantId?: string;
  category?: string;
}

/**
 * Inspect character for pending progression choices.
 * E.g. Grade >= 11 without subclass, or pending FeatGrants.
 */
export function getPendingChoices(
  character: Character,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): PendingChoice[] {
  const choices: PendingChoice[] = [];
  const grade = character.grade ?? getGradeForLevel(character.level);

  // 1. Pending Subclass (Kelas 11+)
  if (grade >= 11 && !character.subclass_id) {
    const ekskul = resolveEkskulData(character.ekskul_id, compendiumEkskul);
    choices.push({
      id: "choose_subclass",
      type: "subclass",
      required: true,
      title: "Pilih Peminatan Subclass (Kelas 11)",
      description: "Karaktermu telah memasuki Kelas 11 dan berhak memilih 1 dari 2 spesialisasi ekskul.",
      options: ekskul?.subclasses || []
    });
  }

  // 2. Pending Feat Grants
  const grants = character.featGrants || character.feat_grants || [];
  for (const grant of grants) {
    if (grant.status === "pending") {
      const grantLabel = grant.grade ? `Kelas ${grant.grade}` : grant.source === "achievement" ? "Pencapaian" : "Penghargaan DM";
      const catLabel = grant.category === "origin" ? "Origin Feat" : grant.category === "general" ? "General Feat" : "Feat";
      choices.push({
        id: `choose_feat_${grant.id}`,
        type: "feat",
        required: true,
        title: `Pilih ${catLabel} (${grantLabel})`,
        description: `Karaktermu berhak memilih 1 ${catLabel} untuk slot ${grantLabel}.`,
        grantId: grant.id,
        category: grant.category
      });
    }
  }

  return choices;
}

export interface LevelUpChoices {
  subclassId?: string;
  featId?: string;
  featChoices?: CharacterFeatTaken["choices"];
}

export interface LevelUpPreview {
  currentLevel: number;
  nextLevel: number;
  currentGrade: number;
  nextGrade: number;
  hpCurrent: number;
  hpMaxCurrent: number;
  hpMaxNext: number;
  hpDelta: number;
  composureCurrent: number;
  composureMaxCurrent: number;
  composureMaxNext: number;
  composureDelta: number;
  pbCurrent: number;
  pbNext: number;
  restDiceCurrent: number;
  restDiceNext: number;
  isNewGrade: boolean;
  requiresSubclass: boolean;
  newlyUnlockedMoves: Array<{
    id: string;
    name: string;
    type: string;
    category: "club" | "subclass";
    desc: string;
  }>;
}

/**
 * Check whether a character is eligible to level up.
 */
export function canLevelUp(character: Character): { can: boolean; reason?: string } {
  if (character.level >= MAX_LEVEL) {
    return {
      can: false,
      reason: `Karakter sudah mencapai batas level maksimal (${getLevelLabel(MAX_LEVEL)}).`
    };
  }
  return { can: true };
}

/**
 * Generate preview of what leveling up will change without modifying anything.
 */
export function previewLevelUp(
  character: Character,
  choices?: LevelUpChoices,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): LevelUpPreview {
  const currentLevel = character.level;
  const nextLevel = Math.min(MAX_LEVEL, currentLevel + 1);

  const currentGrade = character.grade ?? getGradeForLevel(currentLevel);
  const nextGrade = getGradeForLevel(nextLevel);
  const isNewGrade = nextGrade > currentGrade;

  const ekskul = resolveEkskulData(character.ekskul_id, compendiumEkskul);
  const hitDie = ekskul?.hit_die || "d8";
  const physique = getEffectiveAbilityScore(character, "physique");
  const mind = getEffectiveAbilityScore(character, "mind");
  const isDelinquent = character.archetype_id === "delinquent";

  const hasBuiltDifferent = (character.feats || []).some(f => f.featId === "built_different") || choices?.featId === "built_different";
  const hasWhoGonnaCarryTheBoats = (character.feats || []).some(f => f.featId === "whos_gonna_carry_the_boats") || choices?.featId === "whos_gonna_carry_the_boats";

  const hpDelta = calculateHpGainAtLevel(nextLevel, hitDie, physique, isDelinquent, hasBuiltDifferent);
  const composureDelta = calculateComposureGainAtLevel(nextLevel, mind, hasWhoGonnaCarryTheBoats);

  const hpMaxCurrent = character.vitals?.physicalHpMax ?? calculateMaxHp(currentLevel, hitDie, physique, isDelinquent, hasBuiltDifferent);
  const hpMaxNext = hpMaxCurrent + hpDelta;

  const composureMaxCurrent = character.vitals?.composureMax ?? calculateMaxComposure(currentLevel, mind, hasWhoGonnaCarryTheBoats);
  const composureMaxNext = composureMaxCurrent + composureDelta;

  const pbCurrent = calculateProficiencyBonus(currentLevel);
  const pbNext = calculateProficiencyBonus(nextLevel);

  const restDiceCurrent = character.vitals?.restDiceTotal ?? getRestDiceCountForLevel(currentLevel);
  const restDiceNext = getRestDiceCountForLevel(nextLevel);

  const requiresSubclass = nextGrade >= 11 && !character.subclass_id && !choices?.subclassId;

  // Calculate newly unlocked moves
  const newlyUnlockedMoves: LevelUpPreview["newlyUnlockedMoves"] = [];
  if (isNewGrade && ekskul?.club_moves) {
    const clubMove = ekskul.club_moves.find(m => (m.unlock_grade ?? 10) === nextGrade);
    if (clubMove) {
      newlyUnlockedMoves.push({
        id: clubMove.id,
        name: clubMove.name,
        type: clubMove.move_type,
        category: "club",
        desc: clubMove.effect || clubMove.description
      });
    }
  }

  const effectiveSubclassId = choices?.subclassId || character.subclass_id;
  if (effectiveSubclassId && ekskul?.subclasses) {
    const sc = ekskul.subclasses.find(s => s.id === effectiveSubclassId);
    if (sc?.subclass_moves) {
      const scMove = sc.subclass_moves.find(m => (m.unlock_grade ?? 11) === nextGrade);
      if (scMove && isNewGrade) {
        newlyUnlockedMoves.push({
          id: scMove.id,
          name: scMove.name,
          type: scMove.move_type,
          category: "subclass",
          desc: scMove.effect || scMove.description
        });
      }
    }
  }

  return {
    currentLevel,
    nextLevel,
    currentGrade,
    nextGrade,
    hpCurrent: character.vitals?.physicalHpCurrent ?? hpMaxCurrent,
    hpMaxCurrent,
    hpMaxNext,
    hpDelta,
    composureCurrent: character.vitals?.composureCurrent ?? composureMaxCurrent,
    composureMaxCurrent,
    composureMaxNext,
    composureDelta,
    pbCurrent,
    pbNext,
    restDiceCurrent,
    restDiceNext,
    isNewGrade,
    requiresSubclass,
    newlyUnlockedMoves
  };
}

/**
 * Pure progression engine function to level up a character.
 * Automatically provisions new FeatGrants when crossing grades.
 * Returns a new character object with changelog entry. Does NOT mutate the input object.
 */
export function levelUp(
  character: Character,
  choices?: LevelUpChoices,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): { character: Character; changelogEntry: CharacterChangeLogEntry } {
  const eligibility = canLevelUp(character);
  if (!eligibility.can) {
    throw new Error(eligibility.reason || "Karakter tidak dapat naik level.");
  }

  const preview = previewLevelUp(character, choices, compendiumEkskul);

  if (preview.requiresSubclass) {
    throw new Error("Karakter wajib memilih subclass sebelum naik ke Kelas 11.");
  }

  const newSubclassId = choices?.subclassId || character.subclass_id || null;
  const newGrade = preview.nextGrade;
  const newLevel = preview.nextLevel;

  // Scale vitals: current HP and Composure increase alongside their max increase to keep current pacing
  const newHpMax = preview.hpMaxNext;
  const newHpCurrent = Math.min(newHpMax, (character.vitals?.physicalHpCurrent ?? preview.hpMaxCurrent) + preview.hpDelta);

  const newComposureMax = preview.composureMaxNext;
  const newComposureCurrent = Math.min(
    newComposureMax,
    (character.vitals?.composureCurrent ?? preview.composureMaxCurrent) + preview.composureDelta
  );

  const newRestDiceTotal = preview.restDiceNext;
  const newRestDiceSpent = character.vitals?.restDiceSpent ?? 0;

  const timestamp = new Date().toISOString();
  const descParts = [
    `Naik dari ${getLevelLabel(character.level)} ke ${getLevelLabel(newLevel)}`,
    `HP Max +${preview.hpDelta} (${newHpMax})`,
    `Composure Max +${preview.composureDelta} (${newComposureMax})`
  ];
  if (preview.pbNext !== preview.pbCurrent) {
    descParts.push(`Proficiency Bonus naik ke +${preview.pbNext}`);
  }
  if (preview.restDiceNext !== preview.restDiceCurrent) {
    descParts.push(`Rest Dice naik ke ${newRestDiceTotal} dadu`);
  }
  if (choices?.subclassId && choices.subclassId !== character.subclass_id) {
    descParts.push(`Memilih subclass: ${newSubclassId}`);
  }

  // Ensure feat grants for new grade
  let updatedGrants = ensureGradeFeatGrants(newGrade, character.featGrants || character.feat_grants);

  const changelogEntry: CharacterChangeLogEntry = {
    timestamp,
    action: "LEVEL_UP",
    description: descParts.join(", "),
    previousValue: {
      level: character.level,
      grade: character.grade ?? preview.currentGrade,
      hpMax: preview.hpMaxCurrent,
      composureMax: preview.composureMaxCurrent,
      subclassId: character.subclass_id
    },
    newValue: {
      level: newLevel,
      grade: newGrade,
      hpMax: newHpMax,
      composureMax: newComposureMax,
      subclassId: newSubclassId
    },
    source: "level_up"
  };

  const updatedChangelog = [...(character.changelog || []), changelogEntry];

  let updatedCharacter: Character = {
    ...character,
    level: newLevel,
    grade: newGrade,
    subclass_id: newSubclassId,
    schemaVersion: 3,
    version: (character.version || 1) + 1,
    featGrants: updatedGrants,
    feat_grants: updatedGrants,
    vitals: {
      ...character.vitals,
      physicalHpMax: newHpMax,
      physicalHpCurrent: newHpCurrent,
      composureMax: newComposureMax,
      composureCurrent: newComposureCurrent,
      restDiceTotal: newRestDiceTotal,
      restDiceSpent: newRestDiceSpent
    },
    changelog: updatedChangelog,
    updated_at: timestamp
  };

  // If choices include featId, atomically take the feat for the new grade grant
  if (choices?.featId) {
    const pendingGradeGrant = updatedGrants.find(g => g.grade === newGrade && g.status === "pending");
    if (pendingGradeGrant) {
      const takeResult = takeFeat(updatedCharacter, pendingGradeGrant.id, choices.featId, choices.featChoices);
      updatedCharacter = takeResult.character;
    }
  }

  return {
    character: updatedCharacter,
    changelogEntry
  };
}

/**
 * Validate character data against progression invariants.
 */
export function validateCharacter(
  character: Character,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (character.level < MIN_LEVEL || character.level > MAX_LEVEL) {
    errors.push(`Level ${character.level} tidak valid. Harus antara ${MIN_LEVEL} dan ${MAX_LEVEL}.`);
  }

  const expectedGrade = getGradeForLevel(character.level);
  if (character.grade !== undefined && character.grade !== expectedGrade) {
    errors.push(`Grade ${character.grade} tidak sinkron dengan level ${character.level} (seharusnya ${expectedGrade}).`);
  }

  if (character.vitals) {
    if (character.vitals.physicalHpCurrent < 0) {
      errors.push("Current HP tidak boleh negatif.");
    }
    if (character.vitals.physicalHpMax <= 0) {
      errors.push("Max HP harus lebih besar dari 0.");
    }
    if (character.vitals.composureCurrent < 0) {
      errors.push("Current Composure tidak boleh negatif.");
    }
    if (character.vitals.composureMax <= 0) {
      errors.push("Max Composure harus lebih besar dari 0.");
    }
  }

  const ekskul = resolveEkskulData(character.ekskul_id, compendiumEkskul);
  if (character.subclass_id && ekskul) {
    const validSubclass = ekskul.subclasses?.some(sc => sc.id === character.subclass_id);
    if (!validSubclass) {
      errors.push(`Subclass ${character.subclass_id} bukan peminatan valid untuk ekskul ${character.ekskul_id}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// =========================================================================
// FEAT & ACHIEVEMENT PROGRESSION ENGINE FUNCTIONS (PROMPT 2)
// =========================================================================

/**
 * Checks whether a character satisfies all prerequisites and category rules for a given Feat.
 */
export function checkFeatEligibility(
  character: Character,
  feat: FeatDefinition,
  grant?: FeatGrant
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const charGrade = character.grade ?? getGradeForLevel(character.level);
  const takenFeats = character.feats || [];

  // 1. Grant category restrictions
  if (grant) {
    if (grant.category === "origin" && feat.category !== "origin") {
      reasons.push("Slot Kelas 10 hanya dapat memilih Origin Feat.");
    } else if (grant.category === "general" && feat.category !== "general") {
      reasons.push("Slot Kelas 11 & 12 hanya dapat memilih General Feat.");
    } else if (grant.category === "achievement" && feat.category !== "achievement") {
      reasons.push("Grant ini dikhususkan untuk Achievement Feat.");
    }
    if (grant.featId && grant.featId !== feat.id) {
      reasons.push(`Grant ini terkunci khusus untuk feat ${grant.featId}.`);
    }
  }

  // 2. Repeatable restriction: No feats can be taken twice
  if (!feat.repeatable && takenFeats.some(f => f.featId === feat.id)) {
    reasons.push("Feat ini sudah diambil sebelumnya (tidak dapat diambil dua kali).");
  }

  // 3. Prerequisites
  const prereqs = feat.prerequisites;
  if (prereqs) {
    if (prereqs.minGrade && charGrade < prereqs.minGrade) {
      reasons.push(`Memerlukan minimal Kelas ${prereqs.minGrade}.`);
    }
    if (prereqs.minLevel && character.level < prereqs.minLevel) {
      reasons.push(`Memerlukan minimal Level ${prereqs.minLevel}.`);
    }
    if (prereqs.requiresEkskul && character.ekskul_id !== prereqs.requiresEkskul) {
      reasons.push(`Hanya untuk ekskul ${prereqs.requiresEkskul}.`);
    }
    if (prereqs.requiresSubclass && character.subclass_id !== prereqs.requiresSubclass) {
      reasons.push(`Memerlukan peminatan subclass ${prereqs.requiresSubclass}.`);
    }
    if (prereqs.requiresFeat && !takenFeats.some(f => f.featId === prereqs.requiresFeat)) {
      reasons.push(`Memerlukan feat prasyarat ${prereqs.requiresFeat}.`);
    }
    if (prereqs.minAbility) {
      for (const [stat, reqScore] of Object.entries(prereqs.minAbility)) {
        const charScore = getEffectiveAbilityScore(character, stat as AbilityKey);
        if (charScore < reqScore!) {
          reasons.push(`Memerlukan nilai ${stat.toUpperCase()} minimal ${reqScore} (saat ini ${charScore}).`);
        }
      }
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
}

/**
 * Returns all feats from compendium that are eligible to be taken by character for a given grant.
 */
export function getAvailableFeats(
  character: Character,
  grant: FeatGrant,
  compendiumFeats: FeatDefinition[] = ALL_FEATS
): FeatDefinition[] {
  return compendiumFeats.filter(feat => {
    const { eligible } = checkFeatEligibility(character, feat, grant);
    return eligible;
  });
}

/**
 * Pure function to take a feat for a specific pending grant.
 * Atomically validates requirements, choices, caps stat bonuses (Option B),
 * and updates character data and changelog.
 */
export function takeFeat(
  character: Character,
  grantId: string,
  featId: string,
  choices?: CharacterFeatTaken["choices"],
  compendiumFeats: FeatDefinition[] = ALL_FEATS
): { character: Character; changelogEntry: CharacterChangeLogEntry } {
  const grants = character.featGrants || character.feat_grants || [];
  const targetGrant = grants.find(g => g.id === grantId);
  if (!targetGrant) {
    throw new Error(`Slot FeatGrant dengan ID '${grantId}' tidak ditemukan.`);
  }
  if (targetGrant.status !== "pending") {
    throw new Error(`Slot FeatGrant '${grantId}' sudah digunakan atau tidak berstatus pending.`);
  }

  const feat = compendiumFeats.find(f => f.id === featId);
  if (!feat) {
    throw new Error(`Feat dengan ID '${featId}' tidak ditemukan di compendium.`);
  }

  const eligibility = checkFeatEligibility(character, feat, targetGrant);
  if (!eligibility.eligible) {
    throw new Error(`Karakter tidak memenuhi syarat untuk mengambil ${feat.name}: ${eligibility.reasons.join(", ")}`);
  }

  // Validate choices
  if (feat.choices) {
    if (feat.choices.type === "skill") {
      let chosenSkills = choices?.skills || [];
      if (!chosenSkills.length && (choices as any)?.skill) {
        chosenSkills = [(choices as any).skill];
      }
      if (chosenSkills.length !== feat.choices.count) {
        throw new Error(`Feat ${feat.name} mewajibkan pemilihan tepat ${feat.choices.count} skill.`);
      }
      if (feat.choices.pool) {
        for (const s of chosenSkills) {
          if (!feat.choices.pool.includes(s)) {
            throw new Error(`Skill '${s}' tidak terdapat dalam daftar pilihan yang diizinkan untuk ${feat.name}.`);
          }
        }
      }
      if (new Set(chosenSkills).size !== chosenSkills.length) {
        throw new Error("Pilihan skill tidak boleh mengandung skill yang sama ganda.");
      }
    } else if (feat.choices.type === "save") {
      let chosenSaves = choices?.saves || [];
      if (!chosenSaves.length && (choices as any)?.savingThrow) {
        chosenSaves = [(choices as any).savingThrow];
      }
      if (chosenSaves.length !== feat.choices.count) {
        throw new Error(`Feat ${feat.name} mewajibkan pemilihan tepat ${feat.choices.count} saving throw.`);
      }
      if (feat.choices.pool) {
        for (const s of chosenSaves) {
          if (!feat.choices.pool.includes(s)) {
            throw new Error(`Saving throw '${s}' tidak terdapat dalam pilihan yang diizinkan.`);
          }
        }
      }
    }
  }

  const timestamp = new Date().toISOString();

  // 1. Update grant
  const updatedGrants = grants.map(g => {
    if (g.id === grantId) {
      return {
        ...g,
        featId: feat.id,
        status: "taken" as const,
        takenAt: timestamp
      };
    }
    return { ...g };
  });

  // 2. Add to character.feats
  const newFeatTaken: CharacterFeatTaken = {
    featId: feat.id,
    grantId: targetGrant.id,
    choices,
    takenAt: timestamp
  };
  const updatedFeats = [...(character.feats || []), newFeatTaken];

  // 3. Update abilities (Capped via Option B: never exceed cap 20 / 30)
  const newAbilities: any = { ...character.abilities };
  let statGainDesc = "";
  if (feat.bonusAbility) {
    const statKey = feat.bonusAbility.ability;
    const currentVal = extractAbilityScore(character.abilities?.[statKey]);
    const cap = feat.bonusAbility.cap;
    const bonusVal = feat.bonusAbility.value;
    const finalScore = Math.min(cap, currentVal + bonusVal);
    const actualIncrease = finalScore - currentVal;

    if (typeof character.abilities?.[statKey] === "object" && character.abilities?.[statKey] !== null) {
      newAbilities[statKey] = {
        ...(character.abilities[statKey] as any),
        score: finalScore
      };
    } else {
      newAbilities[statKey] = finalScore;
    }

    if (actualIncrease > 0) {
      statGainDesc = `+${actualIncrease} ${statKey.toUpperCase()} (kini ${finalScore})`;
    } else {
      statGainDesc = `${statKey.toUpperCase()} tertahan pada batas stat (${finalScore})`;
    }
  }

  // 4. Update proficient skills & saves
  const newProfSkills = new Set(character.proficient_skills || []);
  if (feat.effects?.skillsGranted) {
    feat.effects.skillsGranted.forEach(s => newProfSkills.add(s));
  }
  if (choices?.skills) {
    choices.skills.forEach(s => newProfSkills.add(s));
  }

  const newProfSaves = new Set(character.proficient_saves || []);
  if (feat.effects?.savesGranted) {
    feat.effects.savesGranted.forEach(s => newProfSaves.add(s));
  }
  if (choices?.saves) {
    choices.saves.forEach(s => newProfSaves.add(s));
  }

  let newLanguages = character.profLanguages || "";
  if (choices?.language) {
    newLanguages = newLanguages ? `${newLanguages}, ${choices.language}` : choices.language;
  }

  // 5. Update usage tracker
  const newUsage = { ...(character.featUsage || character.feat_usage || {}) };
  if (feat.usage && feat.usage.type !== "passive") {
    let maxUses = 1;
    if (feat.usage.countFormula === "fixed") {
      maxUses = feat.usage.fixedCount || 1;
    } else if (feat.usage.countFormula === "pb") {
      maxUses = calculateProficiencyBonus(character.level);
    } else if (feat.usage.countFormula === "ability_mod") {
      const abilKey = (feat.usage.abilityKey || "intelligent") as AbilityKey;
      const archBonus = getArchetypeStatBonus(character.archetype_id || (character as any)?.archetypeId);
      const score = extractAbilityScore(newAbilities[abilKey]) + (archBonus[abilKey] || 0);
      maxUses = Math.max(1, calculateAbilityModifier(score));
    } else if (feat.usage.countFormula === "level") {
      maxUses = character.level;
    }

    newUsage[feat.id] = {
      used: 0,
      max: maxUses,
      resetType: feat.usage.type,
      label: feat.name
    };
  }

  // 6. Recalculate Vitals if Built Different or Who's Gonna Carry the Boats
  const newVitals = { ...character.vitals };
  if (feat.id === "built_different") {
    const hpDelta = 2 * character.level;
    newVitals.physicalHpMax += hpDelta;
    newVitals.physicalHpCurrent += hpDelta;
  }
  if (feat.id === "whos_gonna_carry_the_boats") {
    const compDelta = 2 * character.level;
    newVitals.composureMax += compDelta;
    newVitals.composureCurrent += compDelta;
  }

  const descParts = [`Mengambil Feat: ${feat.name}`];
  if (statGainDesc) descParts.push(statGainDesc);
  if (choices?.skills && choices.skills.length > 0) descParts.push(`Proficiency: ${choices.skills.join(", ")}`);
  if (choices?.saves && choices.saves.length > 0) descParts.push(`Save: ${choices.saves.join(", ")}`);

  const changelogEntry: CharacterChangeLogEntry = {
    timestamp,
    action: "TAKE_FEAT",
    description: descParts.join(", "),
    previousValue: { featId: null, grantId },
    newValue: { featId: feat.id, grantId, choices },
    source: "user"
  };

  const updatedChangelog = [...(character.changelog || []), changelogEntry];

  const updatedCharacter: Character = {
    ...character,
    abilities: newAbilities,
    proficient_skills: Array.from(newProfSkills),
    proficient_saves: Array.from(newProfSaves),
    profLanguages: newLanguages,
    feats: updatedFeats,
    featGrants: updatedGrants,
    feat_grants: updatedGrants,
    featUsage: newUsage,
    feat_usage: newUsage,
    vitals: newVitals,
    schemaVersion: 3,
    version: (character.version || 1) + 1,
    changelog: updatedChangelog,
    updated_at: timestamp
  };

  return {
    character: updatedCharacter,
    changelogEntry
  };
}

/**
 * Retrains / replaces an already taken feat with another valid feat.
 * Cleanly reverses old stat bonuses, skills, and usage trackers, then takes the new feat.
 */
export function retrainFeat(
  character: Character,
  grantId: string,
  newFeatId: string,
  newChoices?: CharacterFeatTaken["choices"],
  compendiumFeats: FeatDefinition[] = ALL_FEATS
): { character: Character; changelogEntry: CharacterChangeLogEntry } {
  const currentFeats = character.feats || [];
  const takenIndex = currentFeats.findIndex(f => f.grantId === grantId);
  if (takenIndex === -1) {
    throw new Error(`Tidak ditemukan feat yang sudah diambil untuk slot '${grantId}'.`);
  }

  const oldTaken = currentFeats[takenIndex];
  const oldFeat = compendiumFeats.find(f => f.id === oldTaken.featId);
  if (!oldFeat) {
    throw new Error(`Feat lama '${oldTaken.featId}' tidak ditemukan di compendium.`);
  }

  // 1. Revert old feat's stat bonus
  const revertedAbilities: any = { ...character.abilities };
  if (oldFeat.bonusAbility) {
    const statKey = oldFeat.bonusAbility.ability;
    const currentScore = extractAbilityScore(character.abilities?.[statKey]);
    const revertedScore = Math.max(1, currentScore - oldFeat.bonusAbility.value);
    if (typeof character.abilities?.[statKey] === "object" && character.abilities?.[statKey] !== null) {
      revertedAbilities[statKey] = {
        ...(character.abilities[statKey] as any),
        score: revertedScore
      };
    } else {
      revertedAbilities[statKey] = revertedScore;
    }
  }

  // 2. Revert skills
  const skillsToRemove = new Set<string>();
  if (oldFeat.effects?.skillsGranted) oldFeat.effects.skillsGranted.forEach(s => skillsToRemove.add(s));
  if (oldTaken.choices?.skills) oldTaken.choices.skills.forEach(s => skillsToRemove.add(s));
  const revertedSkills = (character.proficient_skills || []).filter(s => !skillsToRemove.has(s));

  // 3. Revert saves
  const savesToRemove = new Set<string>();
  if (oldFeat.effects?.savesGranted) oldFeat.effects.savesGranted.forEach(s => savesToRemove.add(s));
  if (oldTaken.choices?.saves) oldTaken.choices.saves.forEach(s => savesToRemove.add(s));
  const revertedSaves = (character.proficient_saves || []).filter(s => !savesToRemove.has(s));

  // 4. Revert usage
  const revertedUsage = { ...(character.featUsage || character.feat_usage || {}) };
  delete revertedUsage[oldFeat.id];

  // 5. Revert HP/Comp if Built Different / Who's Gonna Carry the Boats
  const revertedVitals = { ...character.vitals };
  if (oldFeat.id === "built_different") {
    const hpDelta = 2 * character.level;
    revertedVitals.physicalHpMax = Math.max(1, revertedVitals.physicalHpMax - hpDelta);
    revertedVitals.physicalHpCurrent = Math.max(1, Math.min(revertedVitals.physicalHpMax, revertedVitals.physicalHpCurrent - hpDelta));
  }
  if (oldFeat.id === "whos_gonna_carry_the_boats") {
    const compDelta = 2 * character.level;
    revertedVitals.composureMax = Math.max(1, revertedVitals.composureMax - compDelta);
    revertedVitals.composureCurrent = Math.max(1, Math.min(revertedVitals.composureMax, revertedVitals.composureCurrent - compDelta));
  }

  // 6. Reset grant to pending
  const revertedGrants = (character.featGrants || character.feat_grants || []).map(g => {
    if (g.id === grantId) {
      return {
        ...g,
        featId: null,
        status: "pending" as const,
        takenAt: undefined
      };
    }
    return { ...g };
  });

  const remainingFeats = currentFeats.filter((_, idx) => idx !== takenIndex);

  const intermediateChar: Character = {
    ...character,
    abilities: revertedAbilities,
    proficient_skills: revertedSkills,
    proficient_saves: revertedSaves,
    featUsage: revertedUsage,
    feat_usage: revertedUsage,
    vitals: revertedVitals,
    featGrants: revertedGrants,
    feat_grants: revertedGrants,
    feats: remainingFeats
  };

  // Now take the new feat!
  const result = takeFeat(intermediateChar, grantId, newFeatId, newChoices, compendiumFeats);

  const newFeat = compendiumFeats.find(f => f.id === newFeatId);
  const retrainLog: CharacterChangeLogEntry = {
    timestamp: new Date().toISOString(),
    action: "RETRAIN_FEAT",
    description: `Mengganti Feat '${oldFeat.name}' dengan '${newFeat?.name || newFeatId}'`,
    previousValue: { featId: oldFeat.id, choices: oldTaken.choices },
    newValue: { featId: newFeatId, choices: newChoices },
    source: "user"
  };

  const finalChangelog = [...(result.character.changelog || []).slice(0, -1), retrainLog];

  return {
    character: {
      ...result.character,
      changelog: finalChangelog
    },
    changelogEntry: retrainLog
  };
}

/**
 * Grants a new Feat slot to a character (e.g. from Grade level up, Achievement, or DM Award).
 * If a specific featId is provided (such as 1-to-1 achievement reward), it takes the feat immediately.
 */
export function grantFeat(
  character: Character,
  source: "grade" | "achievement" | "dm",
  details: {
    grade?: number;
    category?: FeatCategory | "any";
    featId?: string;
    sourceRef?: string;
    notes?: string;
    choices?: CharacterFeatTaken["choices"];
  },
  compendiumFeats: FeatDefinition[] = ALL_FEATS
): { character: Character; newGrant: FeatGrant; changelogEntry: CharacterChangeLogEntry } {
  const timestamp = new Date().toISOString();
  const grantId = `grant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newGrant: FeatGrant = {
    id: grantId,
    source,
    sourceRef: details.sourceRef,
    grade: details.grade,
    category: details.category || (source === "achievement" ? "achievement" : "any"),
    featId: details.featId || null,
    status: "pending"
  };

  const updatedGrants = [...(character.featGrants || character.feat_grants || []), newGrant];
  let updatedAchievements = character.achievements || [];
  if (source === "achievement" && details.sourceRef) {
    if (!updatedAchievements.some(a => a.achievementId === details.sourceRef)) {
      updatedAchievements = [
        ...updatedAchievements,
        {
          achievementId: details.sourceRef,
          earnedAt: timestamp,
          notes: details.notes
        }
      ];
    }
  }

  const changelogEntry: CharacterChangeLogEntry = {
    timestamp,
    action: "GRANT_FEAT",
    description: `Menerima Feat Grant baru: sumber ${source}${details.sourceRef ? ` (${details.sourceRef})` : ""}${details.featId ? `, feat: ${details.featId}` : ""}`,
    previousValue: null,
    newValue: newGrant,
    source: source === "dm" ? "system" : "level_up"
  };

  let updatedChar: Character = {
    ...character,
    featGrants: updatedGrants,
    feat_grants: updatedGrants,
    achievements: updatedAchievements,
    schemaVersion: 3,
    version: (character.version || 1) + 1,
    changelog: [...(character.changelog || []), changelogEntry],
    updated_at: timestamp
  };

  if (details.featId) {
    const takeRes = takeFeat(updatedChar, newGrant.id, details.featId, details.choices, compendiumFeats);
    updatedChar = takeRes.character;
  }

  return {
    character: updatedChar,
    newGrant,
    changelogEntry
  };
}

/**
 * Resets limited-use feat counters based on rest/event type (short_rest, long_rest, combat, session, weekly).
 * Automatically recalculates maximum counts in case proficiency bonus or modifiers changed.
 */
export function resetFeatUsage(
  character: Character,
  resetType: "short_rest" | "long_rest" | "combat" | "session" | "weekly",
  compendiumFeats: FeatDefinition[] = ALL_FEATS
): Character {
  const usage = { ...(character.featUsage || character.feat_usage || {}) };
  const featMap = new Map<string, FeatDefinition>(compendiumFeats.map(f => [f.id, f]));
  const effective = calculateEffectiveStats(character, compendiumFeats);

  let hasChanged = false;

  for (const [featId, item] of Object.entries(usage)) {
    const feat = featMap.get(featId);
    const shouldReset =
      item.resetType === resetType ||
      (resetType === "long_rest" && item.resetType === "short_rest");

    let newMax = item.max;
    if (feat?.usage) {
      if (feat.usage.countFormula === "pb") {
        newMax = effective.proficiencyBonus;
      } else if (feat.usage.countFormula === "ability_mod") {
        const mod = effective.modifiers[feat.usage.abilityKey || "intelligent"] || 0;
        newMax = Math.max(1, mod);
      } else if (feat.usage.countFormula === "level") {
        newMax = character.level;
      } else if (feat.usage.countFormula === "fixed") {
        newMax = feat.usage.fixedCount || 1;
      }
    }

    if (shouldReset && item.used !== 0) {
      usage[featId] = { ...item, used: 0, max: newMax };
      hasChanged = true;
    } else if (newMax !== item.max) {
      usage[featId] = { ...item, max: newMax };
      hasChanged = true;
    }
  }

  if (!hasChanged) return character;

  return {
    ...character,
    featUsage: usage,
    feat_usage: usage
  };
}

/**
 * Records an active use of a limited-use Feat (e.g. Plot Armor reroll, Toughen Up heal).
 * Throws an error if the usage limit is already reached.
 */
export function useFeatAction(
  character: Character,
  featId: string
): { character: Character; used: number; max: number; remaining: number } {
  const usage = { ...(character.featUsage || character.feat_usage || {}) };
  const item = usage[featId];
  if (!item) {
    throw new Error(`Feat '${featId}' tidak memiliki tracker pemakaian terbatas.`);
  }

  if (item.used >= item.max) {
    throw new Error(`Pemakaian Feat '${item.label || featId}' sudah mencapai batas (${item.used}/${item.max}).`);
  }

  const newUsed = item.used + 1;
  usage[featId] = {
    ...item,
    used: newUsed
  };

  const updatedChar: Character = {
    ...character,
    featUsage: usage,
    feat_usage: usage,
    version: (character.version || 1) + 1,
    updated_at: new Date().toISOString()
  };

  return {
    character: updatedChar,
    used: newUsed,
    max: item.max,
    remaining: Math.max(0, item.max - newUsed)
  };
}

