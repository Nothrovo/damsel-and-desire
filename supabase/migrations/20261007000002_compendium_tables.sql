-- ============================================================================
-- Migration: 20261007000002_compendium_tables.sql
-- Description: Compendium tables for TRPG rules, moves, classes, and items
-- Tables: abilities, skills, ekskul, ekskul_subclasses, ekskul_moves,
--         archetypes, archetype_moves, social_classes, equipment_packs,
--         basic_actions, calendar_events.
-- ============================================================================

-- 1. Abilities & Inherent Skills
CREATE TABLE IF NOT EXISTS public.abilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL,
  dnd_equiv TEXT,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  ability_id TEXT NOT NULL REFERENCES public.abilities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 2. Ekskul (Classes) & Club Moves
CREATE TABLE IF NOT EXISTS public.ekskul (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  hit_die TEXT NOT NULL,
  primary_stat TEXT NOT NULL,
  saving_throws TEXT[] NOT NULL,
  perk_description TEXT
);

CREATE TABLE IF NOT EXISTS public.ekskul_subclasses (
  id TEXT PRIMARY KEY,
  ekskul_id TEXT NOT NULL REFERENCES public.ekskul(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ekskul_moves (
  id TEXT PRIMARY KEY,
  ekskul_id TEXT NOT NULL REFERENCES public.ekskul(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  move_type TEXT NOT NULL,
  cost TEXT NOT NULL,
  range TEXT NOT NULL,
  check_type TEXT NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 3. Archetypes (Species / Tropes) & Archetype Moves
CREATE TABLE IF NOT EXISTS public.archetypes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  stat_bonus JSONB NOT NULL,
  perk_description TEXT
);

CREATE TABLE IF NOT EXISTS public.archetype_moves (
  id TEXT PRIMARY KEY,
  archetype_id TEXT NOT NULL REFERENCES public.archetypes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  move_type TEXT NOT NULL,
  cost TEXT NOT NULL,
  range TEXT NOT NULL,
  check_type TEXT NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 4. Social Classes (Backgrounds)
CREATE TABLE IF NOT EXISTS public.social_classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  daily_allowance TEXT NOT NULL,
  initial_savings TEXT NOT NULL,
  daily_amount INTEGER NOT NULL,
  savings_amount INTEGER NOT NULL,
  description TEXT,
  starter_items TEXT[] NOT NULL
);

-- 5. Equipment Packs (3-Layer gear)
CREATE TABLE IF NOT EXISTS public.equipment_packs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL
);

-- 6. Basic Actions & Calendar Events
CREATE TABLE IF NOT EXISTS public.basic_actions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  cost TEXT NOT NULL,
  check_type TEXT NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Indexes for Compendium Lookup
CREATE INDEX IF NOT EXISTS idx_skills_ability ON public.skills (ability_id);
CREATE INDEX IF NOT EXISTS idx_ekskul_moves_ekskul ON public.ekskul_moves (ekskul_id);
CREATE INDEX IF NOT EXISTS idx_ekskul_subclasses_ekskul ON public.ekskul_subclasses (ekskul_id);
CREATE INDEX IF NOT EXISTS idx_archetype_moves_archetype ON public.archetype_moves (archetype_id);
