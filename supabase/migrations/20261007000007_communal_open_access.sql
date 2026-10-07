-- ============================================================================
-- Migration: 20261007000007_communal_open_access.sql
-- Description: Open collaborative access: remove login & campaign gating
-- ============================================================================

-- 1. Modify characters table to make owner_id optional and drop foreign key to auth.users
ALTER TABLE public.characters ALTER COLUMN owner_id DROP NOT NULL;
ALTER TABLE public.characters DROP CONSTRAINT IF EXISTS characters_owner_id_fkey;

-- 2. Modify character_secrets table to make campaign_id optional and drop foreign key
ALTER TABLE public.character_secrets ALTER COLUMN campaign_id DROP NOT NULL;
ALTER TABLE public.character_secrets DROP CONSTRAINT IF EXISTS character_secrets_campaign_id_fkey;

-- 3. Modify roll_log table to make campaign_id and user_id optional
ALTER TABLE public.roll_log ALTER COLUMN campaign_id DROP NOT NULL;
ALTER TABLE public.roll_log ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.roll_log DROP CONSTRAINT IF EXISTS roll_log_campaign_id_fkey;
ALTER TABLE public.roll_log DROP CONSTRAINT IF EXISTS roll_log_user_id_fkey;

-- 4. Open Row Level Security on characters
DROP POLICY IF EXISTS "Characters viewable by owner or campaign members" ON public.characters;
DROP POLICY IF EXISTS "Users can create their own characters" ON public.characters;
DROP POLICY IF EXISTS "Owners or campaign DMs can update characters" ON public.characters;
DROP POLICY IF EXISTS "Owners can delete their characters" ON public.characters;
DROP POLICY IF EXISTS "Public read all characters" ON public.characters;
DROP POLICY IF EXISTS "Public create characters" ON public.characters;
DROP POLICY IF EXISTS "Public update characters" ON public.characters;
DROP POLICY IF EXISTS "Public delete characters" ON public.characters;

CREATE POLICY "Public read all characters" ON public.characters FOR SELECT USING (true);
CREATE POLICY "Public create characters" ON public.characters FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update characters" ON public.characters FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete characters" ON public.characters FOR DELETE USING (true);

-- 5. Open Row Level Security on character_secrets
DROP POLICY IF EXISTS "Only campaign DMs can select character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Only campaign DMs can insert character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Only campaign DMs can update character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Only campaign DMs can delete character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Public read character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Public insert character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Public update character secrets" ON public.character_secrets;
DROP POLICY IF EXISTS "Public delete character secrets" ON public.character_secrets;

CREATE POLICY "Public read character secrets" ON public.character_secrets FOR SELECT USING (true);
CREATE POLICY "Public insert character secrets" ON public.character_secrets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update character secrets" ON public.character_secrets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete character secrets" ON public.character_secrets FOR DELETE USING (true);

-- 6. Open Row Level Security on roll_log
DROP POLICY IF EXISTS "Roll logs viewable by campaign members" ON public.roll_log;
DROP POLICY IF EXISTS "Campaign members can insert dice rolls" ON public.roll_log;
DROP POLICY IF EXISTS "Campaign DMs can manage roll logs" ON public.roll_log;
DROP POLICY IF EXISTS "Public read roll logs" ON public.roll_log;
DROP POLICY IF EXISTS "Public insert roll logs" ON public.roll_log;

CREATE POLICY "Public read roll logs" ON public.roll_log FOR SELECT USING (true);
CREATE POLICY "Public insert roll logs" ON public.roll_log FOR INSERT WITH CHECK (true);

-- 7. Update create_character RPC to allow guest/communal creation
CREATE OR REPLACE FUNCTION public.create_character(p_payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_campaign_id UUID;
  v_name TEXT;
  v_ekskul_id TEXT;
  v_subclass_id TEXT;
  v_social_class_id TEXT;
  v_archetype_id TEXT;
  v_level INT;
  v_method TEXT;
  v_abilities JSONB;
  v_skills JSONB;
  v_saves JSONB;
  v_scores INT[];
  v_cost INT := 0;
  v_score INT;
  v_phy INT; v_int INT; v_lok INT; v_mnd INT; v_tln INT; v_lck INT;
  v_mod_phy INT; v_mod_mnd INT;
  v_hit_die TEXT;
  v_base_hp INT;
  v_base_composure INT;
  v_daily_amt INT;
  v_savings_amt INT;
  v_default_items TEXT[];
  v_social_items TEXT[];
  v_club_items TEXT[];
  v_all_items TEXT[];
  v_new_char_id UUID;
  v_result JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL AND p_payload->>'ownerId' IS NOT NULL AND p_payload->>'ownerId' ~ '^[0-9a-fA-F-]{36}$' THEN
    v_user_id := (p_payload->>'ownerId')::uuid;
  END IF;

  v_name := trim(COALESCE(p_payload->>'name', ''));
  IF char_length(v_name) < 1 THEN
    RAISE EXCEPTION 'ERR_VALIDATION: Nama karakter tidak boleh kosong.';
  END IF;

  v_ekskul_id := p_payload->>'ekskulId';
  v_subclass_id := p_payload->>'subclassId';
  v_social_class_id := p_payload->>'socialClassId';
  v_archetype_id := p_payload->>'archetypeId';
  v_level := COALESCE((p_payload->>'grade')::int, 1);
  v_method := COALESCE(p_payload->>'abilityMethod', 'standard');
  v_abilities := p_payload->'baseAbilities';
  v_skills := COALESCE(p_payload->'proficientSkills', '[]'::jsonb);
  v_saves := COALESCE(p_payload->'proficientSaves', '[]'::jsonb);

  IF p_payload->>'campaignId' IS NOT NULL AND p_payload->>'campaignId' ~ '^[0-9a-fA-F-]{36}$' THEN
    v_campaign_id := (p_payload->>'campaignId')::uuid;
  ELSE
    v_campaign_id := NULL;
  END IF;

  -- Validate Skill Proficiencies (Limit 4)
  IF jsonb_array_length(v_skills) > 4 THEN
    RAISE EXCEPTION 'ERR_VALIDATION: Maksimal 4 keahlian (skills) yang dapat dipilih!';
  END IF;

  -- Validate Ability Scores
  v_phy := (v_abilities->>'physique')::int;
  v_int := (v_abilities->>'intelligent')::int;
  v_lok := (v_abilities->>'looks')::int;
  v_mnd := (v_abilities->>'mind')::int;
  v_tln := (v_abilities->>'talent')::int;
  v_lck := (v_abilities->>'luck')::int;

  IF v_method = 'point_buy' THEN
    v_cost := public.get_point_buy_cost(v_phy)
            + public.get_point_buy_cost(v_int)
            + public.get_point_buy_cost(v_lok)
            + public.get_point_buy_cost(v_mnd)
            + public.get_point_buy_cost(v_tln)
            + public.get_point_buy_cost(v_lck);
    IF v_cost > 27 THEN
      RAISE EXCEPTION 'ERR_VALIDATION: Point buy melebihi kuota 27 poin (Terpakai: %).', v_cost;
    END IF;
  END IF;

  -- Modifiers
  v_mod_phy := floor((v_phy - 10) / 2)::int;
  v_mod_mnd := floor((v_mnd - 10) / 2)::int;

  -- Hit Die from Ekskul
  SELECT hit_die INTO v_hit_die FROM public.ekskul WHERE id = v_ekskul_id;
  v_hit_die := COALESCE(v_hit_die, 'd8');

  -- Initial Vitals
  v_base_hp := CASE v_hit_die
    WHEN 'd10' THEN 10 + v_mod_phy
    WHEN 'd8'  THEN 8 + v_mod_phy
    WHEN 'd6'  THEN 6 + v_mod_phy
    ELSE 8 + v_mod_phy
  END;
  v_base_hp := GREATEST(1, v_base_hp);
  v_base_composure := GREATEST(1, 10 + v_mod_mnd);

  -- Fetch Finances based on Social Class
  SELECT daily_amount, savings_amount, starter_items
  INTO v_daily_amt, v_savings_amt, v_social_items
  FROM public.social_classes WHERE id = v_social_class_id;

  v_daily_amt := COALESCE(v_daily_amt, 1000);
  v_savings_amt := COALESCE(v_savings_amt, 15000);

  -- Generate 3-Layer Equipment Pack
  SELECT items INTO v_default_items FROM public.equipment_packs WHERE id = 'default_school_bag';
  SELECT items INTO v_club_items FROM public.equipment_packs WHERE id = 'club_' || v_ekskul_id;

  v_all_items := ARRAY[]::TEXT[];
  IF v_default_items IS NOT NULL THEN v_all_items := v_all_items || v_default_items; END IF;
  IF v_social_items IS NOT NULL THEN v_all_items := v_all_items || v_social_items; END IF;
  IF v_club_items IS NOT NULL THEN v_all_items := v_all_items || v_club_items; END IF;

  -- Insert Character Record
  INSERT INTO public.characters (
    owner_id,
    campaign_id,
    name,
    ekskul_id,
    subclass_id,
    social_class_id,
    archetype_id,
    level,
    avatar_path,
    abilities,
    proficient_skills,
    proficient_saves,
    vitals,
    finances,
    inventory,
    backstory_fields,
    version
  ) VALUES (
    v_user_id,
    v_campaign_id,
    v_name,
    v_ekskul_id,
    v_subclass_id,
    v_social_class_id,
    v_archetype_id,
    v_level,
    COALESCE(p_payload->>'avatar', ''),
    v_abilities,
    v_skills,
    v_saves,
    jsonb_build_object(
      'physicalHpCurrent', v_base_hp,
      'physicalHpMax', v_base_hp,
      'physicalHpTemp', 0,
      'composureCurrent', v_base_composure,
      'composureMax', v_base_composure,
      'composureTemp', 0,
      'restDiceTotal', v_level,
      'restDiceSpent', 0,
      'heartInspiration', false
    ),
    jsonb_build_object(
      'dailyMoneyAmount', v_daily_amt,
      'savingsAmount', v_savings_amt,
      'job', COALESCE(p_payload->>'job', '-'),
      'jobWageAmount', COALESCE((p_payload->>'jobWageAmount')::int, 0)
    ),
    jsonb_build_object(
      'bagItems', to_jsonb(v_all_items),
      'keepsakes', COALESCE(p_payload->'keepsakes', '["Jimat Omamori Cinta (Kuil)"]'::jsonb)
    ),
    jsonb_build_object(
      'personality', COALESCE(p_payload->>'personality', ''),
      'ideals', COALESCE(p_payload->>'ideals', ''),
      'bonds', COALESCE(p_payload->>'bonds', ''),
      'flaws', COALESCE(p_payload->>'flaws', ''),
      'backstory', COALESCE(p_payload->>'backstory', '')
    ),
    1
  ) RETURNING id INTO v_new_char_id;

  -- Insert Character Secrets if provided
  IF p_payload->'targets' IS NOT NULL THEN
    INSERT INTO public.character_secrets (
      character_id,
      campaign_id,
      targets
    ) VALUES (
      v_new_char_id,
      v_campaign_id,
      p_payload->'targets'
    ) ON CONFLICT (character_id) DO UPDATE SET targets = EXCLUDED.targets;
  END IF;

  SELECT to_jsonb(c.*) INTO v_result FROM public.characters c WHERE c.id = v_new_char_id;
  RETURN v_result;
END;
$$;

-- 8. Update roll_dice RPC to allow communal rolling without campaign or auth
CREATE OR REPLACE FUNCTION public.roll_dice(
  p_campaign_id UUID DEFAULT NULL,
  p_character_id UUID DEFAULT NULL,
  p_dice TEXT DEFAULT 'd20',
  p_mode TEXT DEFAULT 'normal',
  p_label TEXT DEFAULT '',
  p_modifier INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_die_faces INT;
  v_roll1 INT;
  v_roll2 INT;
  v_result INT;
  v_total INT;
  v_log_id UUID;
BEGIN
  v_user_id := auth.uid();

  v_die_faces := CASE lower(p_dice)
    WHEN 'd4'  THEN 4
    WHEN 'd6'  THEN 6
    WHEN 'd8'  THEN 8
    WHEN 'd10' THEN 10
    WHEN 'd12' THEN 12
    WHEN 'd20' THEN 20
    WHEN 'd100' THEN 100
    ELSE 20
  END;

  v_roll1 := floor(random() * v_die_faces + 1)::int;

  IF lower(p_mode) = 'advantage' THEN
    v_roll2 := floor(random() * v_die_faces + 1)::int;
    v_result := GREATEST(v_roll1, v_roll2);
  ELSIF lower(p_mode) = 'disadvantage' THEN
    v_roll2 := floor(random() * v_die_faces + 1)::int;
    v_result := LEAST(v_roll1, v_roll2);
  ELSE
    v_roll2 := NULL;
    v_result := v_roll1;
  END IF;

  v_total := v_result + p_modifier;

  INSERT INTO public.roll_log (
    campaign_id,
    character_id,
    user_id,
    dice,
    result,
    modifiers,
    total,
    mode,
    label
  ) VALUES (
    p_campaign_id,
    p_character_id,
    v_user_id,
    p_dice,
    v_result,
    jsonb_build_object('modifier', p_modifier, 'firstRoll', v_roll1, 'secondRoll', v_roll2),
    v_total,
    p_mode,
    p_label
  ) RETURNING id INTO v_log_id;

  RETURN jsonb_build_object(
    'id', v_log_id,
    'campaign_id', p_campaign_id,
    'character_id', p_character_id,
    'user_id', v_user_id,
    'dice', p_dice,
    'result', v_result,
    'total', v_total,
    'mode', p_mode,
    'label', p_label,
    'modifiers', jsonb_build_object('modifier', p_modifier, 'firstRoll', v_roll1, 'secondRoll', v_roll2)
  );
END;
$$;

-- 9. Grant Execute and Table permissions to anon & authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.characters TO anon, authenticated;
GRANT ALL ON TABLE public.character_secrets TO anon, authenticated;
GRANT ALL ON TABLE public.roll_log TO anon, authenticated;
GRANT ALL ON TABLE public.calendar_progress TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_character(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.short_rest(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.long_rest(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_savings(UUID, INT, INT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_vital_change(UUID, TEXT, INT, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.roll_dice(UUID, UUID, TEXT, TEXT, TEXT, INT) TO anon, authenticated;
