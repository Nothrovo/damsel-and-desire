-- ============================================================================
-- Migration: 20261010000002_update_miruam_setsuna_roles.sql
-- Description: Update Miruam Solari (Wakil Ketua OSIS & Ketua Klub Kendo) and Kisaragi Setsuna (Sekretaris OSIS & Komite Disiplin)
-- ============================================================================

DO $$
DECLARE
  v_char_id UUID;
BEGIN
  -- 1. Miruam Solari: Wakil Ketua OSIS & Ketua Klub Kendo (Double Ekskul)
  SELECT id INTO v_char_id FROM public.codex_characters WHERE slug = 'miruam_solari';
  IF v_char_id IS NOT NULL THEN
    UPDATE public.codex_character_sections
    SET content = content || jsonb_build_object(
      'role', 'Love Interest / Wakil Ketua OSIS & Ketua Klub Kendo',
      'club', 'student_council, kendo',
      'club_role', 'Wakil Ketua OSIS & Ketua Klub Kendo'
    ),
    updated_at = now()
    WHERE character_id = v_char_id AND section_key = 'identity';
  END IF;

  -- 2. Kisaragi Setsuna: Sekretaris OSIS & Ketua Komite Disiplin
  SELECT id INTO v_char_id FROM public.codex_characters WHERE slug = 'kisaragi_setsuna';
  IF v_char_id IS NOT NULL THEN
    UPDATE public.codex_character_sections
    SET content = content || jsonb_build_object(
      'role', 'Love Interest / Sekretaris OSIS & Ketua Komite Disiplin',
      'club', 'student_council',
      'club_role', 'Sekretaris OSIS & Ketua Komite Disiplin'
    ),
    updated_at = now()
    WHERE character_id = v_char_id AND section_key = 'identity';
  END IF;

  -- 3. Tachibana Rin: Senior Kapten Klub Kendo & Mentor Dojo
  SELECT id INTO v_char_id FROM public.codex_characters WHERE slug = 'tachibana_rin';
  IF v_char_id IS NOT NULL THEN
    UPDATE public.codex_character_sections
    SET content = content || jsonb_build_object(
      'role', 'Love Interest / Senior Kapten Kendo & Mentor Dojo (Kelas 12-1)',
      'club', 'kendo',
      'club_role', 'Senior Kapten Kendo & Mentor Kehormatan Dojo'
    ),
    updated_at = now()
    WHERE character_id = v_char_id AND section_key = 'identity';
  END IF;
END $$;
