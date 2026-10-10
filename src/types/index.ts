export type CampaignRole = 'dm' | 'player';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Campaign {
  id: string;
  name: string;
  join_code: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignMember {
  campaign_id: string;
  user_id: string;
  role: CampaignRole;
  joined_at: string;
  profile?: Profile;
}

export interface CharacterAbilities {
  physique: number;
  intelligent: number;
  looks: number;
  mind: number;
  talent: number;
  luck: number;
}

export interface CharacterVitals {
  physicalHpCurrent: number;
  physicalHpMax: number;
  physicalHpTemp: number;
  composureCurrent: number;
  composureMax: number;
  composureTemp: number;
  restDiceTotal: number;
  restDiceSpent: number;
  heartInspiration: boolean;
}

export interface CharacterFinances {
  dailyMoneyAmount: number;
  savingsAmount: number;
  job: string;
  jobWageAmount: number;
}

export interface ItemDefinition {
  name: string;
  category: "student" | "social" | "club" | "archetype" | "keepsake" | "custom";
  origin: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Special Keepsake";
  flavorText: string;
  mechanic: string;
  actionType: "passive" | "action" | "bonus_action" | "reaction" | "utility" | "consumable";
  rollCheck?: {
    stat: string;
    label: string;
    die?: string;
  };
}

export interface CharacterInventory {
  bagItems: string[];
  keepsakes: string[];
  customItems?: Record<string, ItemDefinition>;
}

export interface CharacterBackstory {
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
}

export interface Character {
  id: string;
  owner_id: string;
  campaign_id: string | null;
  name: string;
  ekskul_id: string;
  subclass_id?: string | null;
  social_class_id: string;
  archetype_id: string;
  level: number;
  avatar_path?: string | null;
  abilities: CharacterAbilities;
  proficient_skills: string[];
  proficient_saves: string[];
  vitals: CharacterVitals;
  finances: CharacterFinances;
  inventory: CharacterInventory;
  backstory_fields: CharacterBackstory;
  profUniform?: string;
  profClubTools?: string;
  profLanguages?: string;
  targets?: TargetSecret[];
  version: number;
  grade?: number; // 10 | 11 | 12
  schemaVersion?: number; // schema version (e.g. 2, 3)
  changelog?: CharacterChangeLogEntry[];
  feats?: CharacterFeatTaken[];
  featGrants?: FeatGrant[];
  feat_grants?: FeatGrant[];
  achievements?: CharacterAchievement[];
  featUsage?: FeatUsageTracker;
  feat_usage?: FeatUsageTracker;
  created_at: string;
  updated_at: string;
  owner_profile?: Profile;
}

export interface CharacterChangeLogEntry {
  timestamp: string;
  action: string;
  description: string;
  previousValue?: any;
  newValue?: any;
  source: "user" | "level_up" | "migration" | "system";
}

export interface TargetSecret {
  name: string;
  status: string;
  affection: number; // 1-10
  secret: string;
  slug?: string;
  character_id?: string;
  avatar_url?: string;
  class_room?: string;
  nickname?: string;
}

export interface CharacterSecret {
  id: string;
  character_id: string;
  campaign_id: string;
  targets: TargetSecret[];
  dm_notes: string;
  updated_at: string;
}

export interface RollLogEntry {
  id: string;
  campaign_id: string;
  character_id?: string | null;
  user_id: string;
  dice: string;
  result: number;
  modifiers: {
    modifier?: number;
    firstRoll?: number;
    secondRoll?: number | null;
    [key: string]: any;
  };
  total: number;
  mode: 'normal' | 'advantage' | 'disadvantage';
  label?: string | null;
  created_at: string;
  user_profile?: Profile;
}

export interface CalendarProgress {
  character_id: string;
  event_id: string;
  done: boolean;
  completed_at?: string | null;
}

export interface SkillCompendium {
  id: string;
  ability_id: string;
  name: string;
  description: string;
}

export interface AbilityCompendium {
  id: string;
  name: string;
  short_code: string;
  dnd_equiv?: string;
  description: string;
  skills?: SkillCompendium[];
}

export interface ClubMoveCompendium {
  id: string;
  ekskul_id: string;
  name: string;
  move_type: string;
  cost: string;
  range: string;
  check_type: string;
  effect: string;
  description: string;
  order?: number;
  unlock_grade?: number;
}

export interface SubclassMoveCompendium {
  id: string;
  subclass_id: string;
  name: string;
  tier: "G11" | "G12";
  unlock_grade: number; // 11 or 12
  move_type: string;
  cost: string;
  range?: string;
  check_type?: string;
  effect: string;
  description: string;
}

export interface SubclassCompendium {
  id: string;
  ekskul_id: string;
  name: string;
  tagline?: string;
  identity_desc?: string;
  description: string;
  subclass_moves?: SubclassMoveCompendium[];
}

export interface EkskulCompendium {
  id: string;
  name: string;
  tagline?: string;
  hit_die: string;
  primary_stat: string;
  saving_throws: string[];
  perk_description?: string;
  subclasses?: SubclassCompendium[];
  club_moves?: ClubMoveCompendium[];
}

export interface ArchetypeMoveCompendium {
  id: string;
  archetype_id: string;
  name: string;
  move_type: string;
  cost: string;
  range: string;
  check_type: string;
  effect: string;
  description: string;
}

export interface ArchetypeCompendium {
  id: string;
  name: string;
  tagline?: string;
  stat_bonus: Partial<CharacterAbilities>;
  perk_description?: string;
  archetype_moves?: ArchetypeMoveCompendium[];
}

export interface SocialClassCompendium {
  id: string;
  name: string;
  tier: string;
  daily_allowance: string;
  initial_savings: string;
  daily_amount: number;
  savings_amount: number;
  description?: string;
  starter_items: string[];
}

export interface EquipmentPackCompendium {
  id: string;
  name: string;
  category: string;
  items: string[];
}

export interface BasicActionCompendium {
  id: string;
  name: string;
  category: string;
  cost: string;
  check_type: string;
  effect: string;
  description: string;
}

export interface CalendarEventCompendium {
  id: string;
  term: string;
  name: string;
  event_type: string;
  description: string;
}

// ==========================================
// FEATS & ACHIEVEMENTS SYSTEM (PROMPT 2)
// ==========================================

export type FeatCategory = "origin" | "general" | "achievement";
export type AbilityKey = "physique" | "intelligent" | "looks" | "mind" | "talent" | "luck";

export interface FeatChoiceDefinition {
  type: "skill" | "save" | "language" | "free_text";
  count: number;
  pool?: string[];
  description: string;
}

export interface FeatEffects {
  skillsGranted?: string[];
  savesGranted?: string[];
  flatSpeed?: number;
  hpPerLevelBonus?: number;         // e.g. Built Different (+2)
  composurePerLevelBonus?: number;  // e.g. Who's Gonna Carry the Boats (+2)
  flatPassivePerception?: number;   // e.g. Overthinker (+2)
  flatPassiveInvestigation?: number;// e.g. Amatuer Detective (+3), Overthinker (+2)
  jackOfAllTrades?: boolean;        // e.g. Jack of All Trades (+1 to non-proficient skills)
  clumsyLuckBonus?: number;         // e.g. Clumsy (+2 to luck skills)
  meleeToHitBonus?: number;         // e.g. Straight Hitter (+2)
  unarmedDamageBonus?: number;      // e.g. One-Man Army (+2)
}

export interface FeatDrawbacks {
  disadvantageSkills?: string[];
  disadvantageSaves?: string[] | "all";
  penaltyText: string;
}

export interface FeatUsageDefinition {
  type: "short_rest" | "long_rest" | "combat" | "session" | "weekly" | "per_target" | "passive";
  countFormula: "fixed" | "pb" | "ability_mod" | "level";
  fixedCount?: number;
  abilityKey?: AbilityKey;
  description: string;
}

export interface FeatPrerequisites {
  minGrade?: number; // 10, 11, 12
  minLevel?: number; // 1..6
  minAbility?: Partial<Record<AbilityKey, number>>;
  requiresEkskul?: string;
  requiresSubclass?: string;
  requiresFeat?: string;
}

export interface FeatDefinition {
  id: string;
  name: string;
  category: FeatCategory;
  subcategory?: AbilityKey; // For general feats: physique, intelligent, looks, mind, talent, luck
  description: string;
  bonusAbility?: {
    ability: AbilityKey;
    value: number;
    cap: number; // 20 for general, 30 for achievement
  };
  prerequisites?: FeatPrerequisites;
  effects?: FeatEffects;
  manualEffectText?: string;
  drawbacks?: FeatDrawbacks;
  usage?: FeatUsageDefinition;
  choices?: FeatChoiceDefinition;
  repeatable: boolean; // false
  tags: string[];
  requirementText?: string; // Story requirement for achievement feats
  drawbackText?: string;    // Direct penalty/drawback summary
}

export interface FeatGrant {
  id: string;
  source: "grade" | "achievement" | "dm";
  sourceRef?: string; // e.g. "grade_10", "ach_valedictorian", "dm_award"
  grade?: number;     // 10 | 11 | 12
  category?: FeatCategory | "any"; // "origin" for K10, "general" for K11/K12, "any" for DM
  featId: string | null;          // null = pending choice
  status: "pending" | "taken";
  takenAt?: string;
}

export interface CharacterFeatTaken {
  featId: string;
  grantId: string;
  choices?: {
    skills?: string[];
    saves?: string[];
    language?: string;
    text?: string;
  };
  takenAt: string;
  notes?: string;
}

export interface AchievementCompendium {
  id: string;
  name: string;
  title?: string;
  requirement: string;
  feat_id: string;
  description?: string;
  badge_icon?: string;
}

export interface CharacterAchievement {
  achievementId: string;
  earnedAt: string;
  notes?: string;
}

export interface FeatUsageItem {
  used: number;
  max: number;
  resetType: "short_rest" | "long_rest" | "combat" | "session" | "weekly" | "per_target" | "passive";
  label?: string;
}

export type FeatUsageTracker = Record<string, FeatUsageItem>;

export const OFFICIAL_DM_PINS = ["157017", "6969"] as const;
export function isDmPinValid(pin: string): boolean {
  return OFFICIAL_DM_PINS.includes(pin.trim() as any);
}

export * from "./codex";

// ==========================================
// SCHOOL CALENDAR PROGRESSIVE SYSTEM
// ==========================================

export type SchoolCalendarMonthId =
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december"
  | "january"
  | "february"
  | "march";

export type SchoolCalendarMonthStatus = "passed" | "current" | "upcoming";

export type SchoolEventCategoryTag =
  | "Wajib"
  | "Akademik"
  | "Ujian"
  | "Ekskul"
  | "Festival"
  | "Kompetisi"
  | "Romance"
  | "Liburan"
  | "School Trip"
  | "Tradisi Elite"
  | "Slice of Life"
  | "Milestone"
  | "Momen Party";

export interface SchoolCalendarNpcRef {
  slug: string;
  name: string;
  role: string;
  isNewCanon?: boolean;
}

export interface SchoolCalendarEventItem {
  id: string;
  monthId: SchoolCalendarMonthId;
  periodLabel: string; // e.g. "Minggu 1", "Pertengahan Agustus", "Hari 1 — Kyoto"
  title: string;
  japaneseTerm?: string;
  category: SchoolEventCategoryTag;
  description: string;
  isKeyEvent?: boolean;
  featuredNpcs?: SchoolCalendarNpcRef[];
}

export interface SchoolCalendarCustomEvent {
  id: string;
  monthId: SchoolCalendarMonthId;
  title: string;
  note?: string;
  category: SchoolEventCategoryTag;
  done: boolean;
  createdAt: string;
}

export interface SchoolCalendarMonth {
  id: SchoolCalendarMonthId;
  order: number; // 1 (April) .. 12 (March)
  name: string; // "April"
  shortName: string; // "Apr"
  englishTitle: string; // "The First Encounter"
  arcLabel: string; // "Arc 01 · Awal Hubungan"
  romanceStageId: string; // "curiosity" | "trust" | "attraction" | "jealousy_honesty" | "distance_choice" | "confession_commitment"
  romanceStageName: string; // "Curiosity (Rasa Penasaran)"
  semesterLabel: string; // "Semester 1 · Musim Semi"
  seasonIcon: string; // "🌸"
  mainEventTitle: string; // "入学式 (Nyūgakushiki) — Upacara Penerimaan Siswa Baru"
  summary: string;
  memorableSceneTitle: string;
  memorableSceneStory: string;
  conflictSeed: string;
  events: SchoolCalendarEventItem[];
}

export interface SchoolRomanceArcStage {
  id: string;
  monthsLabel: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  monthIds: SchoolCalendarMonthId[];
}

export interface SchoolTraditionItem {
  id: string;
  title: string;
  japaneseSubtitle?: string;
  timingLabel: string;
  description: string;
  storyPotential: string;
  icon: string;
}

export interface SchoolDailyRoutineItem {
  id: string;
  title: string;
  japaneseTerm: string;
  description: string;
  gameplayHook: string;
  icon: string;
}

export interface SchoolCalendarState {
  currentMonthId: SchoolCalendarMonthId;
  completedEventIds: string[];
  customEvents: SchoolCalendarCustomEvent[];
  monthNotes: Partial<Record<SchoolCalendarMonthId, string>>;
  academicYear: number; // 1 = Kelas 10 (Kōkō Ichinensei), 2 = Kelas 11 (Kōkō Ninensei)
  updatedAt: string;
}


