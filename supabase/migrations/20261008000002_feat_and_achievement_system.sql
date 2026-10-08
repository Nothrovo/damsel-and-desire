-- ============================================================================
-- Migration: 20261008000002_feat_and_achievement_system.sql
-- Description: Menambahkan struktur tabel compendium_feats, compendium_achievements,
--              serta kolom feats, feat_grants, achievements, feat_usage di tabel characters
-- ============================================================================

-- 1. Alter characters table for feats, grants, achievements, and usage tracking
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS feats JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS feat_grants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS feat_usage JSONB DEFAULT '{}'::jsonb;

-- 2. Create compendium_feats table
CREATE TABLE IF NOT EXISTS public.compendium_feats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'origin' | 'general' | 'achievement'
  subcategory TEXT,      -- 'physique' | 'intelligent' | 'looks' | 'mind' | 'talent' | 'luck'
  description TEXT NOT NULL,
  bonus_ability JSONB,
  prerequisites JSONB,
  effects JSONB,
  manual_effect_text TEXT,
  drawbacks JSONB,
  usage JSONB,
  choices JSONB,
  repeatable BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}'::text[],
  requirement_text TEXT
);

ALTER TABLE public.compendium_feats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read compendium_feats" ON public.compendium_feats;
CREATE POLICY "Allow public read compendium_feats" ON public.compendium_feats FOR SELECT USING (true);

-- 3. Create compendium_achievements table
CREATE TABLE IF NOT EXISTS public.compendium_achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  requirement TEXT NOT NULL,
  feat_id TEXT NOT NULL REFERENCES public.compendium_feats(id) ON DELETE CASCADE,
  description TEXT
);

ALTER TABLE public.compendium_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read compendium_achievements" ON public.compendium_achievements;
CREATE POLICY "Allow public read compendium_achievements" ON public.compendium_achievements FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_compendium_feats_category ON public.compendium_feats(category);
CREATE INDEX IF NOT EXISTS idx_compendium_feats_subcategory ON public.compendium_feats(subcategory);
