-- ============================================================================
-- Migration: 20261010000001_love_interest_system.sql
-- Description: Dynamic Love Interest Catalog & Detail RPCs for DM Affection Tracker
-- ============================================================================

-- 1. RPC: list_love_interests
-- Mengembalikan seluruh karakter yang bertanda is_love_interest = true atau
-- memiliki kategori 'love_interest', lengkap dengan konten identitas, penampilan,
-- dan pikiran/romansa secara dinamis dari database Supabase.
CREATE OR REPLACE FUNCTION public.list_love_interests()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_chars JSONB := '[]'::jsonb;
  v_char RECORD;
  v_identity JSONB;
  v_appearance JSONB;
  v_mind JSONB;
  v_dm_notes JSONB;
  v_item JSONB;
BEGIN
  FOR v_char IN
    SELECT c.id, c.slug, c.category_id, c.sort_order, c.visibility_mode, c.home_room_id, c.is_love_interest
    FROM public.codex_characters c
    WHERE c.is_love_interest = true OR c.category_id = 'love_interest'
    ORDER BY c.sort_order ASC, c.created_at ASC
  LOOP
    SELECT content INTO v_identity
    FROM public.codex_character_sections
    WHERE character_id = v_char.id AND section_key = 'identity';

    SELECT content INTO v_appearance
    FROM public.codex_character_sections
    WHERE character_id = v_char.id AND section_key = 'appearance';

    SELECT content INTO v_mind
    FROM public.codex_character_sections
    WHERE character_id = v_char.id AND section_key = 'mind';

    SELECT content INTO v_dm_notes
    FROM public.codex_character_sections
    WHERE character_id = v_char.id AND section_key = 'dm_notes';

    v_item := jsonb_build_object(
      'id', v_char.id,
      'slug', v_char.slug,
      'category_id', v_char.category_id,
      'sort_order', v_char.sort_order,
      'is_love_interest', v_char.is_love_interest,
      'name', COALESCE(v_identity->>'name', v_char.slug),
      'furigana', COALESCE(v_identity->>'furigana', ''),
      'nickname', COALESCE(v_identity->'nickname', '[]'::jsonb),
      'tagline', COALESCE(v_identity->>'tagline', ''),
      'avatar_url', COALESCE(v_appearance->>'avatar_url', ''),
      'grade', COALESCE((v_identity->>'grade')::int, 10),
      'class_room', COALESCE(v_identity->>'class_room', ''),
      'role', COALESCE(v_identity->>'role', 'Love Interest'),
      'club', COALESCE(v_identity->>'club', ''),
      'club_role', COALESCE(v_identity->>'club_role', ''),
      'archetype', COALESCE(v_identity->>'archetype', ''),
      'social_class', COALESCE(v_identity->>'social_class', ''),
      'mbti', COALESCE(v_identity->>'mbti', ''),
      'birthday', COALESCE(v_identity->>'birthday', ''),
      'zodiac', COALESCE(v_identity->>'zodiac', ''),
      'stats', COALESCE(v_identity->'stats', '{}'::jsonb),
      'vitals', COALESCE(v_identity->'vitals', '{}'::jsonb),
      'mind', v_mind,
      'dm_notes', v_dm_notes
    );

    v_chars := v_chars || jsonb_build_array(v_item);
  END LOOP;

  RETURN v_chars;
END;
$$;

-- 2. RPC: get_love_interest_detail
CREATE OR REPLACE FUNCTION public.get_love_interest_detail(p_id_or_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_char RECORD;
  v_sections JSONB := '[]'::jsonb;
  v_sec RECORD;
BEGIN
  SELECT * INTO v_char
  FROM public.codex_characters
  WHERE slug = p_id_or_slug OR id::text = p_id_or_slug
  LIMIT 1;

  IF v_char.id IS NULL THEN
    RETURN NULL;
  END IF;

  FOR v_sec IN
    SELECT section_key, tier, content, locked_hint
    FROM public.codex_character_sections
    WHERE character_id = v_char.id
    ORDER BY tier ASC
  LOOP
    v_sections := v_sections || jsonb_build_array(jsonb_build_object(
      'section_key', v_sec.section_key,
      'tier', v_sec.tier,
      'content', v_sec.content,
      'locked_hint', v_sec.locked_hint
    ));
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_char.id,
    'slug', v_char.slug,
    'category_id', v_char.category_id,
    'sort_order', v_char.sort_order,
    'visibility_mode', v_char.visibility_mode,
    'home_room_id', v_char.home_room_id,
    'is_love_interest', v_char.is_love_interest,
    'sections', v_sections
  );
END;
$$;

-- 3. Izin Eksekusi Fungsi RPC untuk anon dan authenticated
GRANT EXECUTE ON FUNCTION public.list_love_interests() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_love_interest_detail(TEXT) TO anon, authenticated;
