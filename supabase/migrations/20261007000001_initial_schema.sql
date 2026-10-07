-- ============================================================================
-- Migration: 20261007000001_initial_schema.sql
-- Description: Core relational schema for Damsel & Desire
-- Tables: profiles, campaigns, campaign_members, characters, character_secrets,
--         roll_log, calendar_progress.
-- ============================================================================

-- 0. Safety Check for Legacy Characters Table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'characters'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'owner_id'
  ) THEN
    ALTER TABLE public.characters RENAME TO legacy_characters;
  END IF;
END $$;

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: Automatically Create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    display_name = EXCLUDED.display_name,
    avatar_url = CASE WHEN profiles.avatar_url = '' OR profiles.avatar_url IS NULL THEN EXCLUDED.avatar_url ELSE profiles.avatar_url END,
    updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) >= 2),
  join_code TEXT UNIQUE NOT NULL CHECK (char_length(join_code) = 6),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Campaign Members (Roles: 'dm' or 'player')
CREATE TABLE IF NOT EXISTS public.campaign_members (
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('dm', 'player')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (campaign_id, user_id)
);

-- 4. Characters
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (char_length(name) >= 1),
  ekskul_id TEXT NOT NULL,
  subclass_id TEXT,
  social_class_id TEXT NOT NULL,
  archetype_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  avatar_path TEXT,
  abilities JSONB NOT NULL,
  proficient_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  proficient_saves JSONB NOT NULL DEFAULT '[]'::jsonb,
  vitals JSONB NOT NULL,
  finances JSONB NOT NULL,
  inventory JSONB NOT NULL,
  backstory_fields JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_characters_savings_non_negative CHECK (
    COALESCE((finances->>'savingsAmount')::numeric, 0) >= 0
  )
);

-- 5. Character Secrets (DM-Only Access: Affection & Secret Crushes)
CREATE TABLE IF NOT EXISTS public.character_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE UNIQUE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  targets JSONB NOT NULL DEFAULT '[]'::jsonb,
  dm_notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Roll Log (Shared Dice Rolls per Campaign)
CREATE TABLE IF NOT EXISTS public.roll_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  dice TEXT NOT NULL,
  result INTEGER NOT NULL,
  modifiers JSONB NOT NULL DEFAULT '{}'::jsonb,
  total INTEGER NOT NULL,
  mode TEXT NOT NULL DEFAULT 'normal' CHECK (mode IN ('normal', 'advantage', 'disadvantage')),
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Calendar Progress
CREATE TABLE IF NOT EXISTS public.calendar_progress (
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (character_id, event_id)
);

-- 8. Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_campaigns_join_code ON public.campaigns (join_code);
CREATE INDEX IF NOT EXISTS idx_campaigns_owner ON public.campaigns (owner_id);
CREATE INDEX IF NOT EXISTS idx_campaign_members_user ON public.campaign_members (user_id);
CREATE INDEX IF NOT EXISTS idx_characters_owner ON public.characters (owner_id);
CREATE INDEX IF NOT EXISTS idx_characters_campaign ON public.characters (campaign_id);
CREATE INDEX IF NOT EXISTS idx_character_secrets_char ON public.character_secrets (character_id);
CREATE INDEX IF NOT EXISTS idx_character_secrets_campaign ON public.character_secrets (campaign_id);
CREATE INDEX IF NOT EXISTS idx_roll_log_campaign_created ON public.roll_log (campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_progress_char ON public.calendar_progress (character_id);
