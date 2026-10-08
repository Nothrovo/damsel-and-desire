import type { Character, CharacterChangeLogEntry, FeatGrant } from "../types";
import {
  getGradeForLevel,
  getRestDiceCountForLevel,
  calculateMaxHp,
  calculateMaxComposure,
  resolveEkskulData,
  MIN_LEVEL,
  MAX_LEVEL
} from "./progression";

export interface MigrationOptions {
  dryRun?: boolean;
  targetSchemaVersion?: number;
}

export interface MigrationResult {
  character: Character;
  migrated: boolean;
  changes: string[];
  changelogEntries: CharacterChangeLogEntry[];
}

/**
 * Ensures that a character has appropriate pending FeatGrants according to their school grade:
 * - Grade 10: 1 Origin Feat grant
 * - Grade 11: 1 Origin Feat grant (G10) + 1 General Feat grant (G11)
 * - Grade 12: 1 Origin Feat grant (G10) + 1 General Feat grant (G11) + 1 General Feat grant (G12)
 * Pure, non-duplicative, and idempotent.
 */
export function ensureGradeFeatGrants(grade: number, existingGrants: FeatGrant[] = []): FeatGrant[] {
  const grants: FeatGrant[] = existingGrants.map(g => ({ ...g }));

  // Check Grade 10 Origin Feat grant
  const hasG10 = grants.some(g => g.grade === 10 && g.source === "grade");
  if (!hasG10) {
    grants.push({
      id: "grant_grade_10",
      source: "grade",
      sourceRef: "grade_10",
      grade: 10,
      category: "origin",
      featId: null,
      status: "pending"
    });
  }

  // Check Grade 11 General Feat grant
  if (grade >= 11) {
    const hasG11 = grants.some(g => g.grade === 11 && g.source === "grade");
    if (!hasG11) {
      grants.push({
        id: "grant_grade_11",
        source: "grade",
        sourceRef: "grade_11",
        grade: 11,
        category: "general",
        featId: null,
        status: "pending"
      });
    }
  }

  // Check Grade 12 General Feat grant
  if (grade >= 12) {
    const hasG12 = grants.some(g => g.grade === 12 && g.source === "grade");
    if (!hasG12) {
      grants.push({
        id: "grant_grade_12",
        source: "grade",
        sourceRef: "grade_12",
        grade: 12,
        category: "general",
        featId: null,
        status: "pending"
      });
    }
  }

  return grants;
}


/**
 * Normalizes legacy grade/level representations into modern Level 1..6 and Grade 10..12.
 * Legacy representations:
 * - Grade 1..5: maps to Level 1..5, Grade 10..12
 * - Grade 10..12: preserves grade, checks level consistency
 */
export function normalizeGradeAndLevel(rawLevel: any, rawGrade: any): { level: number; grade: 10 | 11 | 12 } {
  let level = typeof rawLevel === "number" ? rawLevel : parseInt(rawLevel, 10);
  let grade = typeof rawGrade === "number" ? rawGrade : parseInt(rawGrade, 10);

  // Case 1: Legacy grade representation where grade was 1..5 (e.g. 1=K10 S1, 2=K10 S2, 3=K11 S1, etc.)
  if (!isNaN(grade) && grade >= 1 && grade <= 5) {
    level = grade;
    const finalGrade = getGradeForLevel(level);
    return { level, grade: finalGrade };
  }

  // Case 2: Grade is modern 10, 11, or 12
  if (grade === 10 || grade === 11 || grade === 12) {
    if (isNaN(level) || level < MIN_LEVEL || level > MAX_LEVEL) {
      // Default level based on grade: Grade 10 -> 1, Grade 11 -> 3, Grade 12 -> 5
      level = grade === 10 ? 1 : grade === 11 ? 3 : 5;
    } else {
      // Ensure level fits within the grade boundaries
      const expectedGrade = getGradeForLevel(level);
      if (expectedGrade !== grade) {
        level = grade === 10 ? Math.min(2, Math.max(1, level))
              : grade === 11 ? Math.min(4, Math.max(3, level))
              : Math.min(6, Math.max(5, level));
      }
    }
    return { level, grade: grade as 10 | 11 | 12 };
  }

  // Case 3: Grade is not provided or unknown, deduce from level
  if (!isNaN(level)) {
    level = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
    const finalGrade = getGradeForLevel(level);
    return { level, grade: finalGrade };
  }

  // Fallback defaults to Level 1, Grade 10
  return { level: 1, grade: 10 };
}

/**
 * Idempotently migrates any raw character object to Schema Version 2.
 * - Enforces Level 1..6 and Grade 10..12
 * - Assigns Hououin Kyouma to 'chemist' (KIR / OSN) if not set
 * - Preserves real player characters like Seijuro Toya without auto-assigning subclass
 * - Recomputes or validates rest dice count (Grade 10=1, 11=2, 12=3)
 * - Guarantees minimum HP and Composure scaling
 * - Records migration details in changelog if modifications occurred
 */
export function migrateCharacter(raw: any, options: MigrationOptions = {}): MigrationResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid character object provided for migration.");
  }

  const changes: string[] = [];
  const currentSchema = raw.schemaVersion ?? 1;
  const isAlreadyV2 = currentSchema >= 2;

  // 1. Grade and Level normalization
  const { level, grade } = normalizeGradeAndLevel(raw.level, raw.grade);
  if (raw.level !== level) {
    changes.push(`Level dinormalisasi dari ${raw.level ?? "null"} ke ${level}`);
  }
  if (raw.grade !== grade) {
    changes.push(`Grade disinkronkan dari ${raw.grade ?? "null"} ke ${grade}`);
  }

  // 2. Subclass assignment rules
  let subclassId = raw.subclass_id ?? raw.subclassId ?? null;
  const charName = String(raw.name || "").trim().toLowerCase();
  const charId = String(raw.id || "");

  // Hououin Kyouma test character assignment
  if (
    !subclassId &&
    (charName.includes("hououin") || charName.includes("kyouma") || charId === "char_sample_01")
  ) {
    subclassId = "chemist";
    changes.push("Test character 'Hououin Kyouma' di-assign ke subclass 'chemist'");
  }

  // Real player characters like "Seijuro Toya" remain unassigned (null)
  // so the player can choose via the pending choice reminder banner.

  // 3. Vitals normalization
  const ekskul = resolveEkskulData(raw.ekskul_id || raw.ekskulId || "kendo");
  const hitDie = ekskul?.hit_die || "d8";
  const physiqueScore = raw.abilities?.physique?.score ?? raw.baseAbilities?.physique ?? 10;
  const mindScore = raw.abilities?.mind?.score ?? raw.baseAbilities?.mind ?? 10;
  const isDelinquent = (raw.archetype_id || raw.archetypeId) === "delinquent";

  const expectedRestDice = getRestDiceCountForLevel(level);
  const currentRestDice = raw.vitals?.restDiceTotal ?? raw.restDiceTotal ?? 1;
  const finalRestDice = Math.max(expectedRestDice, currentRestDice);
  if (currentRestDice !== finalRestDice) {
    changes.push(`Rest Dice diperbarui dari ${currentRestDice} ke ${finalRestDice}`);
  }

  const minHp = calculateMaxHp(level, hitDie, physiqueScore, isDelinquent);
  const rawHpMax = raw.vitals?.physicalHpMax ?? raw.physicalHpMax ?? minHp;
  const finalHpMax = Math.max(rawHpMax, minHp);
  const rawHpCurrent = raw.vitals?.physicalHpCurrent ?? raw.physicalHpCurrent ?? finalHpMax;
  const finalHpCurrent = Math.min(finalHpMax, Math.max(0, rawHpCurrent));

  const minComp = calculateMaxComposure(level, mindScore);
  const rawCompMax = raw.vitals?.composureMax ?? raw.composureMax ?? minComp;
  const finalCompMax = Math.max(rawCompMax, minComp);
  const rawCompCurrent = raw.vitals?.composureCurrent ?? raw.composureCurrent ?? finalCompMax;
  const finalCompCurrent = Math.min(finalCompMax, Math.max(0, rawCompCurrent));

  // 4. Feats & Grants normalization
  const targetSchemaVersion = options.targetSchemaVersion ?? (raw.schemaVersion && raw.schemaVersion >= 3 ? 3 : 2);
  const isAlreadyTarget = currentSchema >= targetSchemaVersion;

  const existingGrants: FeatGrant[] = raw.featGrants || raw.feat_grants || [];
  let finalGrants = existingGrants;
  if (targetSchemaVersion >= 3) {
    finalGrants = ensureGradeFeatGrants(grade, existingGrants);
    if (finalGrants.length !== existingGrants.length) {
      changes.push(`Ditambahkan ${finalGrants.length - existingGrants.length} slot Feat pending sesuai tingkat Kelas ${grade}`);
    }
  }

  // 5. Schema version bump
  if (!isAlreadyTarget) {
    changes.push(`Schema version dinaikkan ke v${targetSchemaVersion}`);
  }

  const hasModifications = changes.length > 0;

  // Construct migrated character
  const existingChangelog: CharacterChangeLogEntry[] = Array.isArray(raw.changelog)
    ? [...raw.changelog]
    : [];

  const newChangelogEntries: CharacterChangeLogEntry[] = [];
  if (hasModifications) {
    const entry: CharacterChangeLogEntry = {
      timestamp: new Date().toISOString(),
      action: targetSchemaVersion >= 3 ? "MIGRATION_V3" : "MIGRATION_V2",
      description: changes.join("; "),
      previousValue: {
        schemaVersion: raw.schemaVersion,
        level: raw.level,
        grade: raw.grade,
        subclass_id: raw.subclass_id ?? raw.subclassId
      },
      newValue: {
        schemaVersion: targetSchemaVersion,
        level,
        grade,
        subclass_id: subclassId
      },
      source: "migration"
    };
    newChangelogEntries.push(entry);
    existingChangelog.push(entry);
  }

  const migratedCharacter: Character = {
    id: raw.id || `char_${Date.now()}`,
    owner_id: raw.owner_id || "local_user",
    campaign_id: raw.campaign_id || null,
    name: raw.name || "Karakter Tanpa Nama",
    ekskul_id: raw.ekskul_id || raw.ekskulId || "kendo",
    subclass_id: subclassId,
    social_class_id: raw.social_class_id || raw.socialClassId || "medium",
    archetype_id: raw.archetype_id || raw.archetypeId || "normies",
    level,
    grade,
    schemaVersion: targetSchemaVersion,
    avatar_path: raw.avatar_path || raw.avatar || "",
    abilities: raw.abilities || raw.baseAbilities || {
      physique: 10,
      intelligent: 10,
      looks: 10,
      mind: 10,
      talent: 10,
      luck: 10
    },
    proficient_skills: raw.proficient_skills || raw.proficientSkills || [],
    proficient_saves: raw.proficient_saves || raw.proficientSaves || [],
    vitals: {
      physicalHpCurrent: finalHpCurrent,
      physicalHpMax: finalHpMax,
      physicalHpTemp: raw.vitals?.physicalHpTemp ?? raw.physicalHpTemp ?? 0,
      composureCurrent: finalCompCurrent,
      composureMax: finalCompMax,
      composureTemp: raw.vitals?.composureTemp ?? raw.composureTemp ?? 0,
      restDiceTotal: finalRestDice,
      restDiceSpent: raw.vitals?.restDiceSpent ?? raw.restDiceSpent ?? 0,
      heartInspiration: raw.vitals?.heartInspiration ?? raw.heartInspiration ?? false
    },
    finances: raw.finances || {
      dailyMoneyAmount: raw.dailyMoneyAmount ?? 1000,
      savingsAmount: raw.savingsAmount ?? 15000,
      job: raw.job || "-",
      jobWageAmount: raw.jobWageAmount ?? 0
    },
    inventory: raw.inventory || {
      bagItems: raw.bagItems || [],
      keepsakes: raw.keepsakes || ["Jimat Omamori Cinta (Kuil)"]
    },
    backstory_fields: raw.backstory_fields || {
      personality: raw.personality || "",
      ideals: raw.ideals || "",
      bonds: raw.bonds || "",
      flaws: raw.flaws || "",
      backstory: raw.backstory || ""
    },
    profUniform: raw.profUniform || raw.prof_uniform || "",
    profClubTools: raw.profClubTools || raw.prof_club_tools || "",
    profLanguages: raw.profLanguages || raw.prof_languages || "",
    targets: raw.targets || [],
    feats: raw.feats || [],
    featGrants: finalGrants,
    feat_grants: finalGrants,
    achievements: raw.achievements || [],
    featUsage: raw.featUsage || raw.feat_usage || {},
    feat_usage: raw.featUsage || raw.feat_usage || {},
    version: (raw.version || 1) + (hasModifications ? 1 : 0),
    changelog: existingChangelog,
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: hasModifications ? new Date().toISOString() : (raw.updated_at || new Date().toISOString())
  };

  return {
    character: migratedCharacter,
    migrated: hasModifications,
    changes,
    changelogEntries: newChangelogEntries
  };
}

/**
 * Convenience wrapper to migrate a character specifically to Schema Version 3 (with Feats).
 */
export function migrateCharacterToV3(
  raw: any,
  options: MigrationOptions = {}
): MigrationResult {
  return migrateCharacter(raw, { ...options, targetSchemaVersion: 3 });
}

/**
 * Batch migrate an array of raw characters.
 */
export function migrateCharacters(
  rawList: any[],
  options: MigrationOptions = {}
): { characters: Character[]; totalMigrated: number } {
  if (!Array.isArray(rawList)) {
    return { characters: [], totalMigrated: 0 };
  }

  let totalMigrated = 0;
  const characters = rawList.map(raw => {
    const res = migrateCharacter(raw, options);
    if (res.migrated) totalMigrated++;
    return res.character;
  });

  return { characters, totalMigrated };
}

