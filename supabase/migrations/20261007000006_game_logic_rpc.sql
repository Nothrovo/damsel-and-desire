-- ============================================================================
-- Migration: 20261007000006_game_logic_rpc.sql
-- Description: Server-side game logic functions (Postgres RPC)
-- Functions: create_character, short_rest, long_rest, adjust_savings,
--            apply_damage, apply_heal, roll_dice, join_campaign_by_code
-- ============================================================================

-- Helper: Calculate point buy cost for a given score (8 to 15)
CREATE OR REPLACE FUNCTION public.get_point_buy_cost(p_score INT)
RETURNS INT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE p_score
    WHEN 8  THEN RETURN 0;
    WHEN 9  THEN RETURN 1;
    WHEN 10 THEN RETURN 2;
    WHEN 11 THEN RETURN 3;
    WHEN 12 THEN RETURN 4;
    WHEN 13 THEN RETURN 5;
    WHEN 14 THEN RETURN 7;
    WHEN 15 THEN RETURN 9;
    ELSE RAISE EXCEPTION 'Score % di luar batas Point Buy (8-15).', p_score;
  END CASE;
END;
$$;

-- 1. Create Character with Server Validation & 3-Layer Equipment Pack Generation
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
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ERR_UNAUTHORIZED: Pengguna harus login terlebih dahulu.';
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

  IF p_payload->>'campaignId' IS NOT NULL AND p_payload->>'campaignId' <> '' THEN
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

  IF v_method = 'standard' THEN
    -- Must be permutation of 15, 14, 13, 12, 10, 8
    SELECT array_agg(val ORDER BY val) INTO v_scores
    FROM unnest(ARRAY[v_phy, v_int, v_lok, v_mnd, v_tln, v_lck]) AS val;
    IF v_scores <> ARRAY[8, 10, 12, 13, 14, 15] THEN
      RAISE EXCEPTION 'ERR_VALIDATION: Nilai Standard Array harus terdiri dari [15, 14, 13, 12, 10, 8].';
    END IF;
  ELSE
    -- Point buy: each score 8-15, total cost <= 27
    FOREACH v_score IN ARRAY ARRAY[v_phy, v_int, v_lok, v_mnd, v_tln, v_lck]
    LOOP
      v_cost := v_cost + public.get_point_buy_cost(v_score);
    END LOOP;
    IF v_cost > 27 THEN
      RAISE EXCEPTION 'ERR_VALIDATION: Total biaya Point Buy (%) melebihi batas 27 poin.', v_cost;
    END IF;
  END IF;

  -- Fetch Ekskul hit die
  SELECT hit_die INTO v_hit_die FROM public.ekskul WHERE id = v_ekskul_id;
  IF v_hit_die IS NULL THEN v_hit_die := 'd8'; END IF;

  -- Modifiers
  v_mod_phy := floor((v_phy - 10) / 2.0);
  v_mod_mnd := floor((v_mnd - 10) / 2.0);

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

  -- If campaign provided, also initialize character_secrets row
  IF v_campaign_id IS NOT NULL THEN
    INSERT INTO public.character_secrets (
      character_id,
      campaign_id,
      targets,
      dm_notes
    ) VALUES (
      v_new_char_id,
      v_campaign_id,
      COALESCE(p_payload->'targets', '[]'::jsonb),
      'Initialized at character creation'
    );
  END IF;

  SELECT to_jsonb(c.*) INTO v_result FROM public.characters c WHERE c.id = v_new_char_id;
  RETURN v_result;
END;
$$;

-- 2. Short Rest RPC
CREATE OR REPLACE FUNCTION public.short_rest(
  p_character_id UUID,
  p_client_version INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_char RECORD;
  v_ekskul RECORD;
  v_spent INT;
  v_total INT;
  v_die_faces INT;
  v_roll INT;
  v_mod_phy INT;
  v_heal INT;
  v_new_hp INT;
  v_new_comp INT;
  v_new_vitals JSONB;
BEGIN
  SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ERR_NOT_FOUND: Karakter tidak ditemukan.'; END IF;

  -- Optimistic Locking Check
  IF v_char.version <> p_client_version THEN
    RAISE EXCEPTION 'ERR_CONCURRENCY_CONFLICT: Versi data karakter telah diperbarui oleh perangkat lain.';
  END IF;

  v_spent := COALESCE((v_char.vitals->>'restDiceSpent')::int, 0);
  v_total := COALESCE((v_char.vitals->>'restDiceTotal')::int, 1);

  IF v_spent >= v_total THEN
    RAISE EXCEPTION 'ERR_REST_DICE_EXHAUSTED: Kuota Rest Dice habis! Karakter membutuhkan Long Rest.';
  END IF;

  SELECT hit_die INTO v_ekskul FROM public.ekskul WHERE id = v_char.ekskul_id;
  v_die_faces := CASE COALESCE(v_ekskul.hit_die, 'd8')
    WHEN 'd10' THEN 10
    WHEN 'd8'  THEN 8
    WHEN 'd6'  THEN 6
    ELSE 8
  END;

  -- Server-side RNG (1 to die_faces)
  v_roll := floor(random() * v_die_faces + 1)::int;
  v_mod_phy := floor(((v_char.abilities->>'physique')::int - 10) / 2.0);
  v_heal := GREATEST(1, v_roll + v_mod_phy);

  v_new_hp := LEAST((v_char.vitals->>'physicalHpMax')::int, (v_char.vitals->>'physicalHpCurrent')::int + v_heal);
  v_new_comp := LEAST((v_char.vitals->>'composureMax')::int, (v_char.vitals->>'composureCurrent')::int + v_heal);

  v_new_vitals := v_char.vitals || jsonb_build_object(
    'physicalHpCurrent', v_new_hp,
    'composureCurrent', v_new_comp,
    'restDiceSpent', v_spent + 1
  );

  UPDATE public.characters
  SET vitals = v_new_vitals,
      version = version + 1,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN jsonb_build_object(
    'characterId', p_character_id,
    'dieRolled', 'd' || v_die_faces,
    'rollResult', v_roll,
    'modPhysique', v_mod_phy,
    'healTotal', v_heal,
    'vitals', v_new_vitals,
    'newVersion', v_char.version + 1
  );
END;
$$;

-- 3. Long Rest RPC (Restores Vitals + Automatic Allowance & Baito Wage Deposit)
CREATE OR REPLACE FUNCTION public.long_rest(
  p_character_id UUID,
  p_client_version INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_char RECORD;
  v_new_vitals JSONB;
  v_daily_amt INT;
  v_wage_amt INT;
  v_cur_savings INT;
  v_new_savings INT;
  v_new_finances JSONB;
BEGIN
  SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ERR_NOT_FOUND: Karakter tidak ditemukan.'; END IF;

  IF v_char.version <> p_client_version THEN
    RAISE EXCEPTION 'ERR_CONCURRENCY_CONFLICT: Versi data karakter telah diperbarui oleh perangkat lain.';
  END IF;

  -- Restore HP & Composure to Max, Reset Rest Dice
  v_new_vitals := v_char.vitals || jsonb_build_object(
    'physicalHpCurrent', (v_char.vitals->>'physicalHpMax')::int,
    'composureCurrent', (v_char.vitals->>'composureMax')::int,
    'restDiceSpent', 0
  );

  -- Auto Financial Deposit
  v_daily_amt := COALESCE((v_char.finances->>'dailyMoneyAmount')::int, 0);
  v_wage_amt := COALESCE((v_char.finances->>'jobWageAmount')::int, 0);
  v_cur_savings := COALESCE((v_char.finances->>'savingsAmount')::int, 0);
  v_new_savings := v_cur_savings + v_daily_amt + v_wage_amt;

  v_new_finances := v_char.finances || jsonb_build_object(
    'savingsAmount', v_new_savings
  );

  UPDATE public.characters
  SET vitals = v_new_vitals,
      finances = v_new_finances,
      version = version + 1,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN jsonb_build_object(
    'characterId', p_character_id,
    'vitals', v_new_vitals,
    'finances', v_new_finances,
    'depositDaily', v_daily_amt,
    'depositWage', v_wage_amt,
    'totalAdded', v_daily_amt + v_wage_amt,
    'newVersion', v_char.version + 1
  );
END;
$$;

-- 4. Adjust Savings RPC (¥1 = Rp100 Server-Calculated)
CREATE OR REPLACE FUNCTION public.adjust_savings(
  p_character_id UUID,
  p_delta_rupiah NUMERIC,
  p_client_version INT,
  p_note TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_char RECORD;
  v_cur_savings INT;
  v_delta_yen INT;
  v_new_savings INT;
  v_new_finances JSONB;
BEGIN
  SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ERR_NOT_FOUND: Karakter tidak ditemukan.'; END IF;

  IF v_char.version <> p_client_version THEN
    RAISE EXCEPTION 'ERR_CONCURRENCY_CONFLICT: Versi data karakter telah diperbarui oleh perangkat lain.';
  END IF;

  -- Server computes Yen: ¥1 = Rp100
  v_delta_yen := floor(p_delta_rupiah / 100.0)::int;
  v_cur_savings := COALESCE((v_char.finances->>'savingsAmount')::int, 0);
  v_new_savings := v_cur_savings + v_delta_yen;

  IF v_new_savings < 0 THEN
    RAISE EXCEPTION 'ERR_INSUFFICIENT_FUNDS: Saldo tabungan tidak mencukupi untuk transaksi ini.';
  END IF;

  v_new_finances := v_char.finances || jsonb_build_object(
    'savingsAmount', v_new_savings
  );

  UPDATE public.characters
  SET finances = v_new_finances,
      version = version + 1,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN jsonb_build_object(
    'characterId', p_character_id,
    'deltaYen', v_delta_yen,
    'deltaRupiah', p_delta_rupiah,
    'newSavingsAmount', v_new_savings,
    'note', p_note,
    'newVersion', v_char.version + 1
  );
END;
$$;

-- 5. Apply Damage / Heal RPC
CREATE OR REPLACE FUNCTION public.apply_vital_change(
  p_character_id UUID,
  p_type TEXT, -- 'phys' | 'composure'
  p_delta INT,  -- positive for heal, negative for damage
  p_client_version INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_char RECORD;
  v_cur INT;
  v_max INT;
  v_new INT;
  v_key_cur TEXT;
  v_key_max TEXT;
  v_new_vitals JSONB;
BEGIN
  SELECT * INTO v_char FROM public.characters WHERE id = p_character_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ERR_NOT_FOUND: Karakter tidak ditemukan.'; END IF;

  IF v_char.version <> p_client_version THEN
    RAISE EXCEPTION 'ERR_CONCURRENCY_CONFLICT: Versi data karakter telah diperbarui oleh perangkat lain.';
  END IF;

  IF p_type = 'phys' THEN
    v_key_cur := 'physicalHpCurrent';
    v_key_max := 'physicalHpMax';
  ELSE
    v_key_cur := 'composureCurrent';
    v_key_max := 'composureMax';
  END IF;

  v_cur := (v_char.vitals->>v_key_cur)::int;
  v_max := (v_char.vitals->>v_key_max)::int;
  v_new := GREATEST(0, LEAST(v_max, v_cur + p_delta));

  v_new_vitals := v_char.vitals || jsonb_build_object(v_key_cur, v_new);

  UPDATE public.characters
  SET vitals = v_new_vitals,
      version = version + 1,
      updated_at = now()
  WHERE id = p_character_id;

  RETURN jsonb_build_object(
    'characterId', p_character_id,
    'type', p_type,
    'delta', p_delta,
    'newVitals', v_new_vitals,
    'newVersion', v_char.version + 1
  );
END;
$$;

-- 6. Server-Side Dice Roller RPC (Cryptographic / Server RNG + Roll Log Entry)
CREATE OR REPLACE FUNCTION public.roll_dice(
  p_campaign_id UUID,
  p_character_id UUID,
  p_dice TEXT,            -- e.g. 'd20', 'd12', 'd10', 'd8', 'd6', 'd4'
  p_mode TEXT DEFAULT 'normal', -- 'normal', 'advantage', 'disadvantage'
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
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ERR_UNAUTHORIZED: Pengguna harus login untuk melempar dadu.';
  END IF;

  IF NOT public.is_campaign_member(p_campaign_id, v_user_id) THEN
    RAISE EXCEPTION 'ERR_FORBIDDEN: Pengguna bukan anggota dari campaign ini.';
  END IF;

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
    jsonb_build_object(
      'modifier', p_modifier,
      'firstRoll', v_roll1,
      'secondRoll', v_roll2
    ),
    v_total,
    p_mode,
    p_label
  ) RETURNING id INTO v_log_id;

  RETURN jsonb_build_object(
    'logId', v_log_id,
    'dice', p_dice,
    'result', v_result,
    'firstRoll', v_roll1,
    'secondRoll', v_roll2,
    'modifier', p_modifier,
    'total', v_total,
    'mode', p_mode,
    'label', p_label,
    'createdAt', now()
  );
END;
$$;

-- 7. Join Campaign via Code RPC
CREATE OR REPLACE FUNCTION public.join_campaign_by_code(p_join_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_campaign RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'ERR_UNAUTHORIZED: Pengguna harus login terlebih dahulu.';
  END IF;

  SELECT * INTO v_campaign FROM public.campaigns WHERE upper(join_code) = upper(trim(p_join_code));
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ERR_NOT_FOUND: Kode campaign tidak ditemukan atau tidak valid.';
  END IF;

  -- Insert membership (default player)
  INSERT INTO public.campaign_members (campaign_id, user_id, role)
  VALUES (v_campaign.id, v_user_id, 'player')
  ON CONFLICT (campaign_id, user_id) DO NOTHING;

  RETURN jsonb_build_object(
    'campaignId', v_campaign.id,
    'name', v_campaign.name,
    'role', 'player'
  );
END;
$$;
