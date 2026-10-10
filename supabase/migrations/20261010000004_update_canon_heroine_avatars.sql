-- ============================================================================
-- Migration: 20261010000004_update_canon_heroine_avatars.sql
-- Description: Update avatar_url and images in appearance section for all canon characters
-- ============================================================================

DO $$
DECLARE
  v_slug TEXT;
  v_char_id UUID;
  v_canon_slugs TEXT[] := ARRAY[
    'asahina_tenka',
    'hasumi_chihiro',
    'hoshina_nayu',
    'kanzaki_takeru',
    'kazuki_ren',
    'kirishima_iori',
    'kisaragi_setsuna',
    'kujou_reiko',
    'kumada_riki',
    'kurokawa_shiori',
    'miruam_solari',
    'momoi_yuzu',
    'saegusa_koharu',
    'saionji_kaede',
    'sendou_airi',
    'shinohara_kotone',
    'shiranui_mei',
    'tachibana_rin',
    'takamine_ryo',
    'tsukishima_fumiko',
    'wakaba_hinata'
  ];
BEGIN
  FOREACH v_slug IN ARRAY v_canon_slugs
  LOOP
    SELECT id INTO v_char_id FROM public.codex_characters WHERE slug = v_slug;
    IF v_char_id IS NOT NULL THEN
      -- Update section appearance untuk menyinkronkan avatar_url foto ID asli
      UPDATE public.codex_character_sections
      SET content = content || jsonb_build_object(
        'avatar_url', '/portraits/' || v_slug || '.png',
        'images', jsonb_build_array(jsonb_build_object('path', '/portraits/' || v_slug || '.png', 'caption', 'ID Portrait'))
      ),
      updated_at = now()
      WHERE character_id = v_char_id AND section_key = 'appearance';
    END IF;
  END LOOP;
END $$;
