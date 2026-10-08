export type CodexVisibilityMode = "placeholder" | "hidden";

export type CodexSectionKey =
  | "identity"
  | "appearance"
  | "personality"
  | "background"
  | "mind"
  | "secrets"
  | "relationships"
  | "dm_notes";

export interface CodexCategory {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  show_totals: boolean;
  default_visibility_mode: CodexVisibilityMode;
  created_at?: string;
}

export interface CodexCharacterCard {
  id: string;
  slug?: string;
  category_id: string;
  sort_order: number;
  locked: boolean;
  is_love_interest: boolean;
  name?: string;
  furigana?: string;
  tagline?: string;
  avatar_url?: string;
  class_room?: string;
  role?: string;
  club?: string;
  home_room_id?: string | null;
  revealed_sections?: string[];
}

export interface CodexSectionDetail {
  section_key: CodexSectionKey;
  tier: number;
  locked: boolean;
  locked_hint?: string;
  content?: Record<string, any>;
}

export interface CodexCharacterDetail {
  id: string;
  slug?: string;
  category_id: string;
  sort_order: number;
  locked: boolean;
  is_love_interest: boolean;
  name?: string;
  furigana?: string;
  tagline?: string;
  avatar_url?: string;
  home_room_id?: string | null;
  sections?: CodexSectionDetail[];
}

export interface DmCodexCharacter {
  id: string;
  slug: string;
  category_id: string;
  sort_order: number;
  visibility_mode: CodexVisibilityMode;
  is_love_interest: boolean;
  name: string;
  furigana: string;
  tagline: string;
  avatar_url: string;
  class_room: string;
  role: string;
  club: string;
  home_room_id?: string | null;
  revealed_sections: string[];
  dm_notes: string;
}

export interface DmRevealLogEntry {
  id: string;
  action: string;
  character_id: string;
  character_slug?: string;
  section_key?: string;
  tier?: number;
  created_at: string;
}

export interface DmSessionState {
  token: string | null;
  isAuthenticated: boolean;
  expiresAt: string | null;
}
