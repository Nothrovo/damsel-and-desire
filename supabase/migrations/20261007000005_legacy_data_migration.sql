-- ============================================================================
-- Migration: 20261007000005_legacy_data_migration.sql
-- Description: Helper functions and procedure to migrate legacy character data
--              from legacy_characters table and client localStorage.
-- ============================================================================

-- Function to migrate a JSON character payload (from localStorage or legacy table)
-- into the new normalized schema with secrets separated.
CREATE OR REPLACE FUNCTION public.import_legacy_character(
  p_payload JSONB,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_new_char_id UUID;
  v_campaign_id UUID := p_campaign_id;
  v_abilities JSONB;
  v_vitals JSONB;
  v_finances JSONB;
  v_inventory JSONB;
  v_backstory JSONB;
  v_targets JSONB;
  v_name TEXT;
  v_ekskul TEXT;
  v_social TEXT;
  v_archetype TEXT;
  v_grade INT;
  v_avatar TEXT;
  v_cal_checked JSONB;
  v_item TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Pengguna harus terautentikasi untuk mengimpor karakter.';
  END IF;

  v_name := COALESCE(p_payload->>'name', 'Karakter Warisan');
  v_ekskul := COALESCE(p_payload->>'ekskulId', 'kendo');
  v_social := COALESCE(p_payload->>'socialClassId', 'medium');
  v_archetype := COALESCE(p_payload->>'archetypeId', 'childhood_friend');
  v_grade := COALESCE((p_payload->>'grade')::int, 1);
  v_avatar := COALESCE(p_payload->>'avatar', '');

  -- Abilities
  v_abilities := COALESCE(
    p_payload->'baseAbilities',
    '{"physique": 10, "intelligent": 10, "looks": 10, "mind": 10, "talent": 10, "luck": 10}'::jsonb
  );

  -- Vitals
  v_vitals := jsonb_build_object(
    'physicalHpCurrent', COALESCE((p_payload->>'physicalHpCurrent')::int, 10),
    'physicalHpMax', COALESCE((p_payload->>'physicalHpMax')::int, 10),
    'physicalHpTemp', COALESCE((p_payload->>'physicalHpTemp')::int, 0),
    'composureCurrent', COALESCE((p_payload->>'composureCurrent')::int, 10),
    'composureMax', COALESCE((p_payload->>'composureMax')::int, 10),
    'composureTemp', COALESCE((p_payload->>'composureTemp')::int, 0),
    'restDiceTotal', COALESCE((p_payload->>'restDiceTotal')::int, v_grade),
    'restDiceSpent', COALESCE((p_payload->>'restDiceSpent')::int, 0),
    'heartInspiration', COALESCE((p_payload->>'heartInspiration')::boolean, false)
  );

  -- Finances
  v_finances := jsonb_build_object(
    'dailyMoneyAmount', COALESCE((p_payload->>'dailyMoneyAmount')::int, 1000),
    'savingsAmount', GREATEST(0, COALESCE((p_payload->>'savingsAmount')::int, 0)),
    'job', COALESCE(p_payload->>'job', '-'),
    'jobWageAmount', COALESCE((p_payload->>'jobWageAmount')::int, 0)
  );

  -- Inventory
  v_inventory := jsonb_build_object(
    'bagItems', COALESCE(p_payload->'bagItems', '[]'::jsonb),
    'keepsakes', COALESCE(p_payload->'keepsakes', '[]'::jsonb)
  );

  -- Backstory fields
  v_backstory := jsonb_build_object(
    'personality', COALESCE(p_payload->>'personality', ''),
    'ideals', COALESCE(p_payload->>'ideals', ''),
    'bonds', COALESCE(p_payload->>'bonds', ''),
    'flaws', COALESCE(p_payload->>'flaws', ''),
    'backstory', COALESCE(p_payload->>'backstory', '')
  );

  -- Insert Character
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
    v_ekskul,
    NULL,
    v_social,
    v_archetype,
    v_grade,
    v_avatar,
    v_abilities,
    COALESCE(p_payload->'proficientSkills', '[]'::jsonb),
    COALESCE(p_payload->'proficientSaves', '[]'::jsonb),
    v_vitals,
    v_finances,
    v_inventory,
    v_backstory,
    1
  ) RETURNING id INTO v_new_char_id;

  -- Extract targets & secrets into character_secrets table if campaign exists
  v_targets := COALESCE(p_payload->'targets', '[]'::jsonb);
  IF v_campaign_id IS NOT NULL THEN
    INSERT INTO public.character_secrets (
      character_id,
      campaign_id,
      targets,
      dm_notes
    ) VALUES (
      v_new_char_id,
      v_campaign_id,
      v_targets,
      'Migrated from legacy data'
    )
    ON CONFLICT (character_id) DO UPDATE
    SET targets = EXCLUDED.targets, updated_at = now();
  END IF;

  -- Migrate calendar checked items
  v_cal_checked := p_payload->'calendarChecked';
  IF v_cal_checked IS NOT NULL AND jsonb_typeof(v_cal_checked) = 'array' THEN
    FOR v_item IN SELECT jsonb_array_elements_text(v_cal_checked)
    LOOP
      INSERT INTO public.calendar_progress (character_id, event_id, done, completed_at)
      VALUES (v_new_char_id, v_item, true, now())
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  RETURN v_new_char_id;
END;
$$;

-- Procedure to batch migrate from legacy_characters table to a target owner and campaign
CREATE OR REPLACE PROCEDURE public.migrate_all_legacy_characters(
  p_target_owner_id UUID,
  p_target_campaign_id UUID DEFAULT NULL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row RECORD;
  v_payload JSONB;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'legacy_characters'
  ) THEN
    RAISE NOTICE 'Tabel legacy_characters tidak ditemukan. Tidak ada data yang dimigrasikan.';
    RETURN;
  END IF;

  FOR v_row IN SELECT id, data FROM public.legacy_characters
  LOOP
    v_payload := v_row.data;
    IF v_payload IS NOT NULL THEN
      -- Create character for target owner
      INSERT INTO public.characters (
        owner_id,
        campaign_id,
        name,
        ekskul_id,
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
        p_target_owner_id,
        p_target_campaign_id,
        COALESCE(v_payload->>'name', 'Karakter Warisan'),
        COALESCE(v_payload->>'ekskulId', 'kendo'),
        COALESCE(v_payload->>'socialClassId', 'medium'),
        COALESCE(v_payload->>'archetypeId', 'childhood_friend'),
        COALESCE((v_payload->>'grade')::int, 1),
        COALESCE(v_payload->>'avatar', ''),
        COALESCE(v_payload->'baseAbilities', '{"physique": 10, "intelligent": 10, "looks": 10, "mind": 10, "talent": 10, "luck": 10}'::jsonb),
        COALESCE(v_payload->'proficientSkills', '[]'::jsonb),
        COALESCE(v_payload->'proficientSaves', '[]'::jsonb),
        jsonb_build_object(
          'physicalHpCurrent', COALESCE((v_payload->>'physicalHpCurrent')::int, 10),
          'physicalHpMax', COALESCE((v_payload->>'physicalHpMax')::int, 10),
          'physicalHpTemp', COALESCE((v_payload->>'physicalHpTemp')::int, 0),
          'composureCurrent', COALESCE((v_payload->>'composureCurrent')::int, 10),
          'composureMax', COALESCE((v_payload->>'composureMax')::int, 10),
          'composureTemp', COALESCE((v_payload->>'composureTemp')::int, 0),
          'restDiceTotal', COALESCE((v_payload->>'restDiceTotal')::int, 1),
          'restDiceSpent', COALESCE((v_payload->>'restDiceSpent')::int, 0),
          'heartInspiration', COALESCE((v_payload->>'heartInspiration')::boolean, false)
        ),
        jsonb_build_object(
          'dailyMoneyAmount', COALESCE((v_payload->>'dailyMoneyAmount')::int, 1000),
          'savingsAmount', GREATEST(0, COALESCE((v_payload->>'savingsAmount')::int, 0)),
          'job', COALESCE(v_payload->>'job', '-'),
          'jobWageAmount', COALESCE((v_payload->>'jobWageAmount')::int, 0)
        ),
        jsonb_build_object(
          'bagItems', COALESCE(v_payload->'bagItems', '[]'::jsonb),
          'keepsakes', COALESCE(v_payload->'keepsakes', '[]'::jsonb)
        ),
        jsonb_build_object(
          'personality', COALESCE(v_payload->>'personality', ''),
          'ideals', COALESCE(v_payload->>'ideals', ''),
          'bonds', COALESCE(v_payload->>'bonds', ''),
          'flaws', COALESCE(v_payload->>'flaws', ''),
          'backstory', COALESCE(v_payload->>'backstory', '')
        ),
        1
      );
    END IF;
  END LOOP;

  RAISE NOTICE 'Migrasi dari legacy_characters selesai!';
END;
$$;
