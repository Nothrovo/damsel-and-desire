import type {
  Character,
  CharacterChangeLogEntry,
  ClubMoveCompendium,
  SubclassMoveCompendium,
  EkskulCompendium
} from "../types";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";
import { calculateAbilityModifier, calculateProficiencyBonus } from "../services/ruleEngine";

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
 * Calculate HP gain for a specific level up.
 * Level 1: HitDieMax + Mod PHY + (Delinquent +2)
 * Level 2..6: HitDieAvg + Mod PHY + (Delinquent +2)
 * Minimum gain is always 1 HP.
 */
export function calculateHpGainAtLevel(
  level: number,
  hitDie: string,
  physiqueScore: number,
  isDelinquent: boolean
): number {
  const modPhy = calculateAbilityModifier(physiqueScore);
  const delinquentBonus = isDelinquent ? 2 : 0;

  if (level <= 1) {
    const sides = getHitDieSides(hitDie);
    return Math.max(1, sides + modPhy + delinquentBonus);
  }
  const avg = getHitDieAverage(hitDie);
  return Math.max(1, avg + modPhy + delinquentBonus);
}

/**
 * Calculate total Max HP from Level 1 up to target level.
 */
export function calculateMaxHp(
  level: number,
  hitDie: string,
  physiqueScore: number,
  isDelinquent: boolean
): number {
  const clampedLevel = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
  let total = 0;
  for (let l = 1; l <= clampedLevel; l++) {
    total += calculateHpGainAtLevel(l, hitDie, physiqueScore, isDelinquent);
  }
  return total;
}

/**
 * Calculate Composure gain for a specific level up.
 * Level 1: 10 + Mod MND
 * Level 2..6: 4 + Mod MND
 * Minimum gain is always 1 Composure.
 */
export function calculateComposureGainAtLevel(level: number, mindScore: number): number {
  const modMnd = calculateAbilityModifier(mindScore);
  if (level <= 1) {
    return Math.max(1, 10 + modMnd);
  }
  return Math.max(1, 4 + modMnd);
}

/**
 * Calculate total Max Composure from Level 1 up to target level.
 */
export function calculateMaxComposure(level: number, mindScore: number): number {
  const clampedLevel = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
  let total = 0;
  for (let l = 1; l <= clampedLevel; l++) {
    total += calculateComposureGainAtLevel(l, mindScore);
  }
  return total;
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
}

/**
 * Inspect character for pending progression choices.
 * E.g. Grade >= 11 (Level >= 3) without chosen subclass.
 * Extensible for future feats hook.
 */
export function getPendingChoices(
  character: Character,
  compendiumEkskul?: EkskulCompendium[] | EkskulCompendium
): PendingChoice[] {
  const choices: PendingChoice[] = [];
  const grade = character.grade ?? getGradeForLevel(character.level);

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

  return choices;
}

export interface LevelUpChoices {
  subclassId?: string;
  featId?: string;
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
  const physique = (typeof character.abilities?.physique === "object" ? (character.abilities.physique as any)?.score : character.abilities?.physique) ?? 10;
  const mind = (typeof character.abilities?.mind === "object" ? (character.abilities.mind as any)?.score : character.abilities?.mind) ?? 10;
  const isDelinquent = character.archetype_id === "delinquent";

  const hpDelta = calculateHpGainAtLevel(nextLevel, hitDie, physique, isDelinquent);
  const composureDelta = calculateComposureGainAtLevel(nextLevel, mind);

  const hpMaxCurrent = character.vitals?.physicalHpMax ?? calculateMaxHp(currentLevel, hitDie, physique, isDelinquent);
  const hpMaxNext = hpMaxCurrent + hpDelta;

  const composureMaxCurrent = character.vitals?.composureMax ?? calculateMaxComposure(currentLevel, mind);
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

  const updatedCharacter: Character = {
    ...character,
    level: newLevel,
    grade: newGrade,
    subclass_id: newSubclassId,
    schemaVersion: 2,
    version: (character.version || 1) + 1,
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
