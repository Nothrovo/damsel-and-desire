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
  schemaVersion?: number; // schema version (e.g. 2)
  changelog?: CharacterChangeLogEntry[];
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
