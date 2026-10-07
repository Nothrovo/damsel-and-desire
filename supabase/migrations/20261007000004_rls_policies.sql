-- ============================================================================
-- Migration: 20261007000004_rls_policies.sql
-- Description: Explicit Row-Level Security (RLS) on ALL tables
-- Pattern: Performance-optimized using (SELECT auth.uid()) subqueries
-- ============================================================================

-- Helper functions to avoid repetitive joins in RLS policies
CREATE OR REPLACE FUNCTION public.is_campaign_member(p_campaign_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaign_members
    WHERE campaign_id = p_campaign_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_campaign_dm(p_campaign_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.campaign_members
    WHERE campaign_id = p_campaign_id AND user_id = p_user_id AND role = 'dm'
  );
$$;

-- ----------------------------------------------------------------------------
-- 1. Profiles Table RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- 2. Campaigns Table RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns viewable by creator or members"
  ON public.campaigns FOR SELECT
  TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR public.is_campaign_member(id, (SELECT auth.uid()))
  );

CREATE POLICY "Authenticated users can create campaigns"
  ON public.campaigns FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Owner or DM can update campaign"
  ON public.campaigns FOR UPDATE
  TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR public.is_campaign_dm(id, (SELECT auth.uid()))
  )
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    OR public.is_campaign_dm(id, (SELECT auth.uid()))
  );

CREATE POLICY "Owner can delete campaign"
  ON public.campaigns FOR DELETE
  TO authenticated
  USING (owner_id = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- 3. Campaign Members Table RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.campaign_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members viewable by fellow campaign members"
  ON public.campaign_members FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_campaign_member(campaign_id, (SELECT auth.uid()))
  );

CREATE POLICY "Users can join campaign as player or creator as DM"
  ON public.campaign_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
  );

CREATE POLICY "Only DM can update membership roles"
  ON public.campaign_members FOR UPDATE
  TO authenticated
  USING (public.is_campaign_dm(campaign_id, (SELECT auth.uid())))
  WITH CHECK (public.is_campaign_dm(campaign_id, (SELECT auth.uid())));

CREATE POLICY "Users can leave campaign or DM can kick member"
  ON public.campaign_members FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR public.is_campaign_dm(campaign_id, (SELECT auth.uid()))
  );

-- ----------------------------------------------------------------------------
-- 4. Characters Table RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Characters viewable by owner or campaign members"
  ON public.characters FOR SELECT
  TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR (
      campaign_id IS NOT NULL 
      AND public.is_campaign_member(campaign_id, (SELECT auth.uid()))
    )
  );

CREATE POLICY "Users can create their own characters"
  ON public.characters FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Owners or campaign DMs can update characters"
  ON public.characters FOR UPDATE
  TO authenticated
  USING (
    owner_id = (SELECT auth.uid())
    OR (
      campaign_id IS NOT NULL 
      AND public.is_campaign_dm(campaign_id, (SELECT auth.uid()))
    )
  )
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    OR (
      campaign_id IS NOT NULL 
      AND public.is_campaign_dm(campaign_id, (SELECT auth.uid()))
    )
  );

CREATE POLICY "Owners can delete their characters"
  ON public.characters FOR DELETE
  TO authenticated
  USING (owner_id = (SELECT auth.uid()));

-- ----------------------------------------------------------------------------
-- 5. Character Secrets Table RLS (STRICT: DM ONLY)
-- ----------------------------------------------------------------------------
ALTER TABLE public.character_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only campaign DMs can select character secrets"
  ON public.character_secrets FOR SELECT
  TO authenticated
  USING (public.is_campaign_dm(campaign_id, (SELECT auth.uid())));

CREATE POLICY "Only campaign DMs can insert character secrets"
  ON public.character_secrets FOR INSERT
  TO authenticated
  WITH CHECK (public.is_campaign_dm(campaign_id, (SELECT auth.uid())));

CREATE POLICY "Only campaign DMs can update character secrets"
  ON public.character_secrets FOR UPDATE
  TO authenticated
  USING (public.is_campaign_dm(campaign_id, (SELECT auth.uid())))
  WITH CHECK (public.is_campaign_dm(campaign_id, (SELECT auth.uid())));

CREATE POLICY "Only campaign DMs can delete character secrets"
  ON public.character_secrets FOR DELETE
  TO authenticated
  USING (public.is_campaign_dm(campaign_id, (SELECT auth.uid())));

-- ----------------------------------------------------------------------------
-- 6. Roll Log Table RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.roll_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roll logs viewable by campaign members"
  ON public.roll_log FOR SELECT
  TO authenticated
  USING (public.is_campaign_member(campaign_id, (SELECT auth.uid())));

CREATE POLICY "Campaign members can insert dice rolls"
  ON public.roll_log FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.is_campaign_member(campaign_id, (SELECT auth.uid()))
  );

CREATE POLICY "Campaign DMs can manage roll logs"
  ON public.roll_log FOR ALL
  TO authenticated
  USING (public.is_campaign_dm(campaign_id, (SELECT auth.uid())))
  WITH CHECK (public.is_campaign_dm(campaign_id, (SELECT auth.uid())));

-- ----------------------------------------------------------------------------
-- 7. Calendar Progress Table RLS
-- ----------------------------------------------------------------------------
ALTER TABLE public.calendar_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Calendar progress viewable by character owners and campaign members"
  ON public.calendar_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = calendar_progress.character_id
        AND (
          c.owner_id = (SELECT auth.uid())
          OR (c.campaign_id IS NOT NULL AND public.is_campaign_member(c.campaign_id, (SELECT auth.uid())))
        )
    )
  );

CREATE POLICY "Character owners can manage calendar progress"
  ON public.calendar_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = calendar_progress.character_id
        AND c.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.characters c
      WHERE c.id = calendar_progress.character_id
        AND c.owner_id = (SELECT auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- 8. Compendium Tables RLS (Public Read, Admin Write Only)
-- ----------------------------------------------------------------------------
ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekskul ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekskul_subclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekskul_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.basic_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated and anonymous clients to read compendium rules
CREATE POLICY "Public read abilities" ON public.abilities FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read ekskul" ON public.ekskul FOR SELECT USING (true);
CREATE POLICY "Public read ekskul_subclasses" ON public.ekskul_subclasses FOR SELECT USING (true);
CREATE POLICY "Public read ekskul_moves" ON public.ekskul_moves FOR SELECT USING (true);
CREATE POLICY "Public read archetypes" ON public.archetypes FOR SELECT USING (true);
CREATE POLICY "Public read archetype_moves" ON public.archetype_moves FOR SELECT USING (true);
CREATE POLICY "Public read social_classes" ON public.social_classes FOR SELECT USING (true);
CREATE POLICY "Public read equipment_packs" ON public.equipment_packs FOR SELECT USING (true);
CREATE POLICY "Public read basic_actions" ON public.basic_actions FOR SELECT USING (true);
CREATE POLICY "Public read calendar_events" ON public.calendar_events FOR SELECT USING (true);
