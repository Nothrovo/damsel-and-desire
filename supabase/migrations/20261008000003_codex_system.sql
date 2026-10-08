-- ============================================================================
-- Migration: 20261008000003_codex_system.sql
-- Description: Character Codex System (NPC Viewer, DM Auth, Tiered Reveals, Storage & RPCs)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: codex_categories
CREATE TABLE IF NOT EXISTS public.codex_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  show_totals BOOLEAN NOT NULL DEFAULT false,
  default_visibility_mode TEXT NOT NULL DEFAULT 'placeholder' CHECK (default_visibility_mode IN ('placeholder', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Categories
INSERT INTO public.codex_categories (id, name, description, sort_order, show_totals, default_visibility_mode) VALUES
  ('class_1_1', 'Kelas 1-1', 'Siswa-siswi tahun pertama kelas 1-1 (Grade 10)', 1, false, 'placeholder'),
  ('class_1_2', 'Kelas 1-2', 'Siswa-siswi tahun pertama kelas 1-2 (Grade 10)', 2, false, 'placeholder'),
  ('class_2_1', 'Kelas 2-1', 'Siswa-siswi tahun kedua kelas 2-1 (Grade 11)', 3, false, 'placeholder'),
  ('class_2_2', 'Kelas 2-2', 'Siswa-siswi tahun kedua kelas 2-2 (Grade 11)', 4, false, 'placeholder'),
  ('class_3_1', 'Kelas 3-1', 'Siswa-siswi tahun ketiga kelas 3-1 (Grade 12 / Senior)', 5, false, 'placeholder'),
  ('class_3_2', 'Kelas 3-2', 'Siswa-siswi tahun ketiga kelas 3-2 (Grade 12 / Senior)', 6, false, 'placeholder'),
  ('faculty', 'Guru & Staf Sekolah', 'Pengajar, staf konseling, kepala sekolah, dan tenaga kesehatan', 7, false, 'placeholder'),
  ('love_interest', 'Target Asmara (Love Interest)', 'Heroine & target asmara terdaftar di Housen Academy', 8, false, 'placeholder'),
  ('clubs', 'Klub Ekstrakurikuler', 'Tokoh penting dan faksi 16 klub ekskul', 9, false, 'placeholder'),
  ('outside_school', 'Di Luar Sekolah', 'Keluarga, alumni, pemilik toko, dan rival sekolah lain', 10, false, 'placeholder'),
  ('other', 'Lainnya', 'Karakter pendukung lainnya', 11, false, 'placeholder')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  default_visibility_mode = EXCLUDED.default_visibility_mode;

-- 2. Table: codex_characters
CREATE TABLE IF NOT EXISTS public.codex_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.codex_categories(id) ON DELETE RESTRICT,
  sort_order INT NOT NULL DEFAULT 0,
  visibility_mode TEXT NOT NULL DEFAULT 'placeholder' CHECK (visibility_mode IN ('placeholder', 'hidden')),
  home_room_id TEXT DEFAULT NULL,
  is_love_interest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_codex_characters_category ON public.codex_characters(category_id);
CREATE INDEX IF NOT EXISTS idx_codex_characters_slug ON public.codex_characters(slug);

-- 3. Table: codex_character_sections
CREATE TABLE IF NOT EXISTS public.codex_character_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.codex_characters(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL CHECK (section_key IN ('identity', 'appearance', 'personality', 'background', 'mind', 'secrets', 'relationships', 'dm_notes')),
  tier INT NOT NULL CHECK (tier IN (1, 2, 3, 99)),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  locked_hint TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_codex_character_section UNIQUE (character_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_codex_sections_char ON public.codex_character_sections(character_id);

-- 4. Table: codex_reveals (State buka/kunci murni tanpa konten)
CREATE TABLE IF NOT EXISTS public.codex_reveals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES public.codex_characters(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  revealed_at TIMESTAMPTZ DEFAULT now(),
  revealed_by TEXT DEFAULT 'DM',
  CONSTRAINT uq_codex_reveals UNIQUE (character_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_codex_reveals_char ON public.codex_reveals(character_id);

-- 5. Table: codex_dm_config (Konfigurasi keamanan password DM)
CREATE TABLE IF NOT EXISTS public.codex_dm_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  password_hash TEXT NOT NULL,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed initial master password hash (Pre-computed bcrypt cost-10 hash; plaintext password tidak pernah disimpan di repo)
INSERT INTO public.codex_dm_config (id, password_hash, failed_attempts, locked_until)
VALUES (1, '$2a$10$0g0iPiQLpNaGru3ODe2ok.V80FgMdzBBgae0dFOAS/aaCWHpmzVaq', 0, NULL)
ON CONFLICT (id) DO NOTHING;

-- 6. Table: codex_dm_sessions (Sesi token DM dengan masa berlaku)
CREATE TABLE IF NOT EXISTS public.codex_dm_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_codex_dm_sessions_token ON public.codex_dm_sessions(token_hash);

-- 7. Table: codex_reveal_log
CREATE TABLE IF NOT EXISTS public.codex_reveal_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  character_id UUID REFERENCES public.codex_characters(id) ON DELETE SET NULL,
  section_key TEXT DEFAULT NULL,
  tier INT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.codex_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_character_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_reveals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_dm_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_dm_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_reveal_log ENABLE ROW LEVEL SECURITY;

-- 1. codex_categories: Publik boleh membaca kategori
DROP POLICY IF EXISTS "Public read codex categories" ON public.codex_categories;
CREATE POLICY "Public read codex categories" ON public.codex_categories FOR SELECT USING (true);

-- 2. codex_reveals: Publik boleh membaca reveal state murni untuk realtime subscription (bebas konten rahasia)
DROP POLICY IF EXISTS "Public read codex reveals" ON public.codex_reveals;
CREATE POLICY "Public read codex reveals" ON public.codex_reveals FOR SELECT USING (true);

-- 3. TABEL LAINNYA: KETAT! TIDAK ADA SELECT/INSERT/UPDATE POLICY UNTUK ANON!
-- Seluruh akses data konten karakter, section, sesi DM, dan log diisolasi penuh
-- dan HANYA dapat diakses melalui fungsi RPC SECURITY DEFINER di bawah ini.

-- ============================================================================
-- HELPER FUNCTIONS & DM AUTHENTICATION
-- ============================================================================

-- Internal helper: Validasi sesi DM
CREATE OR REPLACE FUNCTION public._validate_dm_session(p_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token_hash TEXT;
  v_session_id UUID;
BEGIN
  IF p_token IS NULL OR trim(p_token) = '' THEN
    RAISE EXCEPTION 'ERR_UNAUTHORIZED: Token sesi DM diperlukan.';
  END IF;

  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  SELECT id INTO v_session_id
  FROM public.codex_dm_sessions
  WHERE token_hash = v_token_hash
    AND expires_at > now()
    AND revoked_at IS NULL;

  IF v_session_id IS NULL THEN
    RAISE EXCEPTION 'ERR_UNAUTHORIZED: Sesi DM tidak valid, kadaluarsa, atau telah dicabut.';
  END IF;

  RETURN true;
END;
$$;

-- DM Login: Throttle, validasi bcrypt, hasilkan session token
CREATE OR REPLACE FUNCTION public.dm_login(p_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_config RECORD;
  v_raw_token TEXT;
  v_token_hash TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_config FROM public.codex_dm_config WHERE id = 1;

  -- 1. Cek Lockout (Brute-force protection)
  IF v_config.locked_until IS NOT NULL AND v_config.locked_until > now() THEN
    RAISE EXCEPTION 'ERR_LOCKED: Akses login DM terkunci sementara karena terlalu banyak percobaan gagal. Coba lagi dalam beberapa menit.';
  END IF;

  -- 2. Cek Password Hash
  IF crypt(p_password, v_config.password_hash) <> v_config.password_hash THEN
    -- Gagal: Tambah counter percobaan salah
    UPDATE public.codex_dm_config
    SET failed_attempts = failed_attempts + 1,
        locked_until = CASE WHEN failed_attempts + 1 >= 5 THEN now() + interval '15 minutes' ELSE NULL END,
        updated_at = now()
    WHERE id = 1;

    RAISE EXCEPTION 'ERR_INVALID_PASSWORD: Kata sandi DM salah.';
  END IF;

  -- 3. Sukses: Reset counter percobaan salah
  UPDATE public.codex_dm_config
  SET failed_attempts = 0,
      locked_until = NULL,
      updated_at = now()
  WHERE id = 1;

  -- 4. Terbitkan Session Token (32-byte hex) & simpan SHA-256 hash
  v_raw_token := encode(gen_random_bytes(32), 'hex');
  v_token_hash := encode(digest(v_raw_token, 'sha256'), 'hex');
  v_expires_at := now() + interval '12 hours';

  INSERT INTO public.codex_dm_sessions (token_hash, expires_at)
  VALUES (v_token_hash, v_expires_at);

  RETURN jsonb_build_object(
    'success', true,
    'session_token', v_raw_token,
    'expires_at', v_expires_at
  );
END;
$$;

-- DM Logout: Cabut sesi
CREATE OR REPLACE FUNCTION public.dm_logout(p_session_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token_hash TEXT;
BEGIN
  IF p_session_token IS NOT NULL THEN
    v_token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
    UPDATE public.codex_dm_sessions
    SET revoked_at = now()
    WHERE token_hash = v_token_hash;
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- DM Verify Session: Cek status token dari browser
CREATE OR REPLACE FUNCTION public.dm_verify_session(p_session_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token_hash TEXT;
  v_session RECORD;
BEGIN
  IF p_session_token IS NULL OR trim(p_session_token) = '' THEN
    RETURN jsonb_build_object('valid', false);
  END IF;

  v_token_hash := encode(digest(p_session_token, 'sha256'), 'hex');

  SELECT * INTO v_session
  FROM public.codex_dm_sessions
  WHERE token_hash = v_token_hash
    AND expires_at > now()
    AND revoked_at IS NULL;

  IF v_session IS NULL THEN
    RETURN jsonb_build_object('valid', false);
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'expires_at', v_session.expires_at
  );
END;
$$;

-- DM Ganti Password
CREATE OR REPLACE FUNCTION public.dm_change_password(p_session_token TEXT, p_new_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  IF char_length(trim(p_new_password)) < 6 THEN
    RAISE EXCEPTION 'ERR_VALIDATION: Kata sandi baru minimal 6 karakter.';
  END IF;

  UPDATE public.codex_dm_config
  SET password_hash = crypt(trim(p_new_password), gen_salt('bf', 10)),
      failed_attempts = 0,
      locked_until = NULL,
      updated_at = now()
  WHERE id = 1;

  -- Cabut seluruh sesi aktif lainnya demi keamanan
  UPDATE public.codex_dm_sessions
  SET revoked_at = now()
  WHERE token_hash <> encode(digest(p_session_token, 'sha256'), 'hex');

  RETURN jsonb_build_object('success', true, 'message', 'Kata sandi DM berhasil diperbarui.');
END;
$$;

-- ============================================================================
-- PLAYER READ FUNCTIONS (STRICT SANITIZATION & ZERO DATA LEAKAGE)
-- ============================================================================

-- List Karakter untuk Pemain
CREATE OR REPLACE FUNCTION public.list_codex(p_category_id TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_chars JSONB := '[]'::jsonb;
  v_char RECORD;
  v_revealed_sections TEXT[];
  v_identity JSONB;
  v_appearance JSONB;
  v_item JSONB;
BEGIN
  FOR v_char IN
    SELECT c.id, c.slug, c.category_id, c.sort_order, c.visibility_mode, c.home_room_id, c.is_love_interest
    FROM public.codex_characters c
    WHERE (
      p_category_id IS NULL
      OR c.category_id = p_category_id
      OR (p_category_id = 'love_interest' AND c.is_love_interest = true)
    )
    ORDER BY c.sort_order ASC, c.created_at ASC
  LOOP
    -- Ambil daftar section yang SUDAH terbuka untuk karakter ini
    SELECT array_agg(section_key) INTO v_revealed_sections
    FROM public.codex_reveals
    WHERE character_id = v_char.id;

    -- JIKA BELUM PERNAH DIBUKA SAMA SEKALI:
    IF v_revealed_sections IS NULL OR array_length(v_revealed_sections, 1) = 0 THEN
      -- Jika mode "hidden": JANGAN KIRIM SAMA SEKALI
      IF v_char.visibility_mode = 'hidden' THEN
        CONTINUE;
      END IF;

      -- Jika mode "placeholder": Kirim kartu siluet terkunci MURNI TANPA NAMA/SLUG/GAMBAR
      v_item := jsonb_build_object(
        'id', v_char.id,
        'category_id', v_char.category_id,
        'sort_order', v_char.sort_order,
        'locked', true,
        'is_love_interest', v_char.is_love_interest
      );
      v_chars := v_chars || jsonb_build_array(v_item);

    -- JIKA SUDAH ADA SECTION YANG TERBUKA:
    ELSE
      -- Ambil identity jika terbuka
      IF 'identity' = ANY(v_revealed_sections) THEN
        SELECT content INTO v_identity
        FROM public.codex_character_sections
        WHERE character_id = v_char.id AND section_key = 'identity';
      ELSE
        v_identity := NULL;
      END IF;

      -- Ambil appearance jika terbuka
      IF 'appearance' = ANY(v_revealed_sections) THEN
        SELECT content INTO v_appearance
        FROM public.codex_character_sections
        WHERE character_id = v_char.id AND section_key = 'appearance';
      ELSE
        v_appearance := NULL;
      END IF;

      v_item := jsonb_build_object(
        'id', v_char.id,
        'slug', v_char.slug,
        'category_id', v_char.category_id,
        'sort_order', v_char.sort_order,
        'locked', false,
        'is_love_interest', v_char.is_love_interest,
        'name', COALESCE(v_identity->>'name', '???'),
        'furigana', COALESCE(v_identity->>'furigana', ''),
        'tagline', COALESCE(v_identity->>'tagline', ''),
        'avatar_url', COALESCE(v_appearance->>'avatar_url', ''),
        'class_room', COALESCE(v_identity->>'class_room', ''),
        'role', COALESCE(v_identity->>'role', ''),
        'club', COALESCE(v_identity->>'club', ''),
        'home_room_id', CASE WHEN 'identity' = ANY(v_revealed_sections) THEN v_char.home_room_id ELSE NULL END,
        'revealed_sections', to_jsonb(v_revealed_sections)
      );
      v_chars := v_chars || jsonb_build_array(v_item);
    END IF;
  END LOOP;

  RETURN v_chars;
END;
$$;

-- Detail Karakter untuk Pemain
CREATE OR REPLACE FUNCTION public.get_codex_character(p_id_or_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_char RECORD;
  v_revealed_sections TEXT[];
  v_sections JSONB := '[]'::jsonb;
  v_sec RECORD;
  v_sec_item JSONB;
  v_default_hint TEXT;
  v_identity JSONB := '{}'::jsonb;
  v_appearance JSONB := '{}'::jsonb;
BEGIN
  -- Cari karakter via UUID atau slug
  SELECT * INTO v_char
  FROM public.codex_characters
  WHERE (p_id_or_slug ~ '^[0-9a-fA-F-]{36}$' AND id = p_id_or_slug::uuid)
     OR slug = p_id_or_slug;

  IF v_char IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT array_agg(section_key) INTO v_revealed_sections
  FROM public.codex_reveals
  WHERE character_id = v_char.id;

  -- JIKA BELUM DIBUKA SAMA SEKALI:
  IF v_revealed_sections IS NULL OR array_length(v_revealed_sections, 1) = 0 THEN
    IF v_char.visibility_mode = 'hidden' THEN
      RETURN NULL;
    END IF;

    -- Placeholder murni
    RETURN jsonb_build_object(
      'id', v_char.id,
      'category_id', v_char.category_id,
      'sort_order', v_char.sort_order,
      'locked', true,
      'is_love_interest', v_char.is_love_interest
    );
  END IF;

  -- Ambil setiap section (KECUALI dm_notes yang TIDAK PERNAH DIKIRIM KE PEMAIN)
  FOR v_sec IN
    SELECT section_key, tier, content, locked_hint
    FROM public.codex_character_sections
    WHERE character_id = v_char.id AND section_key <> 'dm_notes'
    ORDER BY tier ASC, section_key ASC
  LOOP
    v_default_hint := CASE
      WHEN v_sec.tier = 1 THEN 'Karakter belum diperkenalkan.'
      WHEN v_sec.tier = 2 THEN 'Kenali dia lebih dekat dalam kehidupan sekolah untuk membuka informasi ini.'
      WHEN v_sec.tier = 3 THEN 'Hanya terbuka bagi mereka yang telah meraih ikatan hati terdalam.'
      ELSE 'Terkunci oleh Game Master.'
    END;

    IF v_sec.section_key = ANY(v_revealed_sections) THEN
      -- TERBUKA: Kirim konten penuh
      v_sec_item := jsonb_build_object(
        'section_key', v_sec.section_key,
        'tier', v_sec.tier,
        'locked', false,
        'content', v_sec.content
      );

      IF v_sec.section_key = 'identity' THEN v_identity := v_sec.content; END IF;
      IF v_sec.section_key = 'appearance' THEN v_appearance := v_sec.content; END IF;
    ELSE
      -- TERKUNCI: Kirim HANYA petunjuk gembok TANPA KONTEN
      v_sec_item := jsonb_build_object(
        'section_key', v_sec.section_key,
        'tier', v_sec.tier,
        'locked', true,
        'locked_hint', COALESCE(NULLIF(v_sec.locked_hint, ''), v_default_hint)
      );
    END IF;

    v_sections := v_sections || jsonb_build_array(v_sec_item);
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_char.id,
    'slug', v_char.slug,
    'category_id', v_char.category_id,
    'sort_order', v_char.sort_order,
    'locked', false,
    'is_love_interest', v_char.is_love_interest,
    'name', COALESCE(v_identity->>'name', '???'),
    'furigana', COALESCE(v_identity->>'furigana', ''),
    'tagline', COALESCE(v_identity->>'tagline', ''),
    'avatar_url', COALESCE(v_appearance->>'avatar_url', ''),
    'home_room_id', CASE WHEN 'identity' = ANY(v_revealed_sections) THEN v_char.home_room_id ELSE NULL END,
    'sections', v_sections
  );
END;
$$;

-- ============================================================================
-- DM PRIVILEGED FUNCTIONS (REQUIRES VALID SESSION TOKEN)
-- ============================================================================

-- List Seluruh Karakter (Khusus DM)
CREATE OR REPLACE FUNCTION public.dm_list_all(p_session_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_chars JSONB := '[]'::jsonb;
  v_char RECORD;
  v_revealed_sections TEXT[];
  v_identity JSONB;
  v_appearance JSONB;
  v_dm_notes JSONB;
  v_item JSONB;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  FOR v_char IN
    SELECT c.id, c.slug, c.category_id, c.sort_order, c.visibility_mode, c.home_room_id, c.is_love_interest, c.created_at
    FROM public.codex_characters c
    ORDER BY c.sort_order ASC, c.created_at ASC
  LOOP
    SELECT array_agg(section_key) INTO v_revealed_sections
    FROM public.codex_reveals
    WHERE character_id = v_char.id;

    v_revealed_sections := COALESCE(v_revealed_sections, ARRAY[]::TEXT[]);

    SELECT content INTO v_identity FROM public.codex_character_sections WHERE character_id = v_char.id AND section_key = 'identity';
    SELECT content INTO v_appearance FROM public.codex_character_sections WHERE character_id = v_char.id AND section_key = 'appearance';
    SELECT content INTO v_dm_notes FROM public.codex_character_sections WHERE character_id = v_char.id AND section_key = 'dm_notes';

    v_item := jsonb_build_object(
      'id', v_char.id,
      'slug', v_char.slug,
      'category_id', v_char.category_id,
      'sort_order', v_char.sort_order,
      'visibility_mode', v_char.visibility_mode,
      'is_love_interest', v_char.is_love_interest,
      'name', COALESCE(v_identity->>'name', v_char.slug),
      'furigana', COALESCE(v_identity->>'furigana', ''),
      'tagline', COALESCE(v_identity->>'tagline', ''),
      'avatar_url', COALESCE(v_appearance->>'avatar_url', ''),
      'class_room', COALESCE(v_identity->>'class_room', ''),
      'role', COALESCE(v_identity->>'role', ''),
      'club', COALESCE(v_identity->>'club', ''),
      'home_room_id', v_char.home_room_id,
      'revealed_sections', to_jsonb(v_revealed_sections),
      'dm_notes', COALESCE(v_dm_notes->>'notes', '')
    );

    v_chars := v_chars || jsonb_build_array(v_item);
  END LOOP;

  RETURN v_chars;
END;
$$;

-- Detail Lengkap Karakter (Khusus DM)
CREATE OR REPLACE FUNCTION public.dm_get_character(p_session_token TEXT, p_character_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_char RECORD;
  v_revealed_sections TEXT[];
  v_sections JSONB := '[]'::jsonb;
  v_sec RECORD;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  SELECT * INTO v_char FROM public.codex_characters WHERE id = p_character_id;
  IF v_char IS NULL THEN RETURN NULL; END IF;

  SELECT array_agg(section_key) INTO v_revealed_sections
  FROM public.codex_reveals
  WHERE character_id = v_char.id;

  v_revealed_sections := COALESCE(v_revealed_sections, ARRAY[]::TEXT[]);

  FOR v_sec IN
    SELECT section_key, tier, content, locked_hint
    FROM public.codex_character_sections
    WHERE character_id = v_char.id
    ORDER BY tier ASC, section_key ASC
  LOOP
    v_sections := v_sections || jsonb_build_array(jsonb_build_object(
      'section_key', v_sec.section_key,
      'tier', v_sec.tier,
      'revealed', v_sec.section_key = ANY(v_revealed_sections),
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
    'revealed_sections', to_jsonb(v_revealed_sections),
    'sections', v_sections
  );
END;
$$;

-- DM Kontrol Reveal per Section
CREATE OR REPLACE FUNCTION public.dm_set_reveal(
  p_session_token TEXT,
  p_character_id UUID,
  p_section_key TEXT,
  p_revealed BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  IF p_revealed THEN
    INSERT INTO public.codex_reveals (character_id, section_key, revealed_at, revealed_by)
    VALUES (p_character_id, p_section_key, now(), 'DM')
    ON CONFLICT (character_id, section_key) DO UPDATE SET revealed_at = now();

    INSERT INTO public.codex_reveal_log (action, character_id, section_key)
    VALUES ('REVEAL_SECTION', p_character_id, p_section_key);
  ELSE
    DELETE FROM public.codex_reveals
    WHERE character_id = p_character_id AND section_key = p_section_key;

    INSERT INTO public.codex_reveal_log (action, character_id, section_key)
    VALUES ('LOCK_SECTION', p_character_id, p_section_key);
  END IF;

  RETURN jsonb_build_object('success', true, 'character_id', p_character_id, 'section_key', p_section_key, 'revealed', p_revealed);
END;
$$;

-- DM Kontrol Reveal per Tier
CREATE OR REPLACE FUNCTION public.dm_set_tier_reveal(
  p_session_token TEXT,
  p_character_id UUID,
  p_tier INT,
  p_revealed BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_sec RECORD;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  FOR v_sec IN
    SELECT section_key FROM public.codex_character_sections
    WHERE character_id = p_character_id AND tier = p_tier AND section_key <> 'dm_notes'
  LOOP
    IF p_revealed THEN
      INSERT INTO public.codex_reveals (character_id, section_key, revealed_at, revealed_by)
      VALUES (p_character_id, v_sec.section_key, now(), 'DM')
      ON CONFLICT (character_id, section_key) DO NOTHING;
    ELSE
      DELETE FROM public.codex_reveals
      WHERE character_id = p_character_id AND section_key = v_sec.section_key;
    END IF;
  END LOOP;

  INSERT INTO public.codex_reveal_log (action, character_id, tier)
  VALUES (CASE WHEN p_revealed THEN 'REVEAL_TIER' ELSE 'LOCK_TIER' END, p_character_id, p_tier);

  RETURN jsonb_build_object('success', true, 'character_id', p_character_id, 'tier', p_tier, 'revealed', p_revealed);
END;
$$;

-- DM Perkenalkan Karakter (Buka Tier 1: identity + appearance)
CREATE OR REPLACE FUNCTION public.dm_introduce(
  p_session_token TEXT,
  p_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  INSERT INTO public.codex_reveals (character_id, section_key, revealed_at, revealed_by)
  VALUES
    (p_character_id, 'identity', now(), 'DM'),
    (p_character_id, 'appearance', now(), 'DM')
  ON CONFLICT (character_id, section_key) DO UPDATE SET revealed_at = now();

  INSERT INTO public.codex_reveal_log (action, character_id)
  VALUES ('INTRODUCE_CHARACTER', p_character_id);

  RETURN jsonb_build_object('success', true, 'character_id', p_character_id, 'introduced', true);
END;
$$;

-- DM Kunci Karakter (atau Kunci Semua Karakter)
CREATE OR REPLACE FUNCTION public.dm_lock_all(
  p_session_token TEXT,
  p_character_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  IF p_character_id IS NOT NULL THEN
    DELETE FROM public.codex_reveals WHERE character_id = p_character_id;
    INSERT INTO public.codex_reveal_log (action, character_id) VALUES ('LOCK_CHARACTER_ALL', p_character_id);
  ELSE
    DELETE FROM public.codex_reveals;
    INSERT INTO public.codex_reveal_log (action) VALUES ('LOCK_ENTIRE_CODEX');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- DM Ambil Log Riwayat Reveal
CREATE OR REPLACE FUNCTION public.dm_get_log(p_session_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_logs JSONB;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  SELECT jsonb_agg(to_jsonb(l.*)) INTO v_logs
  FROM (
    SELECT l.id, l.action, l.character_id, c.slug as character_slug, l.section_key, l.tier, l.created_at
    FROM public.codex_reveal_log l
    LEFT JOIN public.codex_characters c ON c.id = l.character_id
    ORDER BY l.created_at DESC
    LIMIT 50
  ) l;

  RETURN COALESCE(v_logs, '[]'::jsonb);
END;
$$;

-- DM Upsert Karakter & Section (Digunakan oleh Importer dan Web Editor)
CREATE OR REPLACE FUNCTION public.dm_upsert_character(
  p_session_token TEXT,
  p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_char_id UUID;
  v_slug TEXT;
  v_category_id TEXT;
  v_sort_order INT;
  v_vis_mode TEXT;
  v_home_room TEXT;
  v_is_li BOOLEAN;
  v_sections JSONB;
  v_sec JSONB;
  v_key TEXT;
  v_tier INT;
  v_content JSONB;
  v_hint TEXT;
BEGIN
  -- Validasi sesi DM (Wajib token sesi DM yang valid atau dipanggil via service_role)
  IF COALESCE(auth.role(), '') <> 'service_role' THEN
    PERFORM public._validate_dm_session(p_session_token);
  END IF;

  v_slug := trim(p_payload->>'slug');
  IF v_slug IS NULL OR v_slug = '' THEN
    RAISE EXCEPTION 'ERR_VALIDATION: Slug karakter wajib diisi.';
  END IF;

  v_category_id := COALESCE(p_payload->>'categoryId', 'other');
  v_sort_order := COALESCE((p_payload->>'sortOrder')::int, 0);
  v_vis_mode := COALESCE(p_payload->>'visibilityMode', 'placeholder');
  v_home_room := p_payload->>'homeRoomId';
  v_is_li := COALESCE((p_payload->>'isLoveInterest')::boolean, false);

  -- Upsert tabel codex_characters
  INSERT INTO public.codex_characters (
    slug, category_id, sort_order, visibility_mode, home_room_id, is_love_interest, updated_at
  ) VALUES (
    v_slug, v_category_id, v_sort_order, v_vis_mode, v_home_room, v_is_li, now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    sort_order = EXCLUDED.sort_order,
    visibility_mode = EXCLUDED.visibility_mode,
    home_room_id = EXCLUDED.home_room_id,
    is_love_interest = EXCLUDED.is_love_interest,
    updated_at = now()
  RETURNING id INTO v_char_id;

  -- Upsert sections jika diberikan
  v_sections := p_payload->'sections';
  IF v_sections IS NOT NULL AND jsonb_typeof(v_sections) = 'array' THEN
    FOR v_sec IN SELECT * FROM jsonb_array_elements(v_sections)
    LOOP
      v_key := v_sec->>'sectionKey';
      v_tier := COALESCE((v_sec->>'tier')::int, 1);
      v_content := COALESCE(v_sec->'content', '{}'::jsonb);
      v_hint := COALESCE(v_sec->>'lockedHint', '');

      INSERT INTO public.codex_character_sections (
        character_id, section_key, tier, content, locked_hint, updated_at
      ) VALUES (
        v_char_id, v_key, v_tier, v_content, v_hint, now()
      )
      ON CONFLICT (character_id, section_key) DO UPDATE SET
        tier = EXCLUDED.tier,
        content = EXCLUDED.content,
        locked_hint = EXCLUDED.locked_hint,
        updated_at = now();
    END LOOP;
  END IF;

  RETURN jsonb_build_object('success', true, 'id', v_char_id, 'slug', v_slug);
END;
$$;

-- DM Batch Introduce (Tier 1)
CREATE OR REPLACE FUNCTION public.dm_batch_introduce(
  p_session_token TEXT,
  p_character_ids UUID[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_id UUID;
  v_count INT := 0;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  FOREACH v_id IN ARRAY p_character_ids
  LOOP
    INSERT INTO public.codex_reveals (character_id, section_key, revealed_at, revealed_by)
    VALUES 
      (v_id, 'identity', now(), 'DM'),
      (v_id, 'appearance', now(), 'DM')
    ON CONFLICT (character_id, section_key) DO UPDATE SET revealed_at = now();

    INSERT INTO public.codex_reveal_log (action, character_id, section_key, tier)
    VALUES ('INTRODUCE_CHARACTER', v_id, 'identity', 1);

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'count', v_count);
END;
$$;

-- DM Batch Set Tier Reveal
CREATE OR REPLACE FUNCTION public.dm_batch_set_tier(
  p_session_token TEXT,
  p_character_ids UUID[],
  p_tier INT,
  p_revealed BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_id UUID;
  v_count INT := 0;
  v_keys TEXT[];
  v_key TEXT;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  IF p_tier = 1 THEN
    v_keys := ARRAY['identity', 'appearance'];
  ELSIF p_tier = 2 THEN
    v_keys := ARRAY['personality', 'background', 'relationships'];
  ELSIF p_tier = 3 THEN
    v_keys := ARRAY['mind', 'secrets'];
  ELSE
    RAISE EXCEPTION 'Tier tidak valid (hanya 1, 2, atau 3).';
  END IF;

  FOREACH v_id IN ARRAY p_character_ids
  LOOP
    FOREACH v_key IN ARRAY v_keys
    LOOP
      IF p_revealed THEN
        INSERT INTO public.codex_reveals (character_id, section_key, revealed_at, revealed_by)
        VALUES (v_id, v_key, now(), 'DM')
        ON CONFLICT (character_id, section_key) DO UPDATE SET revealed_at = now();
      ELSE
        DELETE FROM public.codex_reveals
        WHERE character_id = v_id AND section_key = v_key;
      END IF;
    END LOOP;

    INSERT INTO public.codex_reveal_log (action, character_id, tier)
    VALUES (CASE WHEN p_revealed THEN 'REVEAL_TIER' ELSE 'LOCK_TIER' END, v_id, p_tier);

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'count', v_count);
END;
$$;

-- DM Batch Lock All
CREATE OR REPLACE FUNCTION public.dm_batch_lock_all(
  p_session_token TEXT,
  p_character_ids UUID[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_id UUID;
  v_count INT := 0;
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  FOREACH v_id IN ARRAY p_character_ids
  LOOP
    DELETE FROM public.codex_reveals WHERE character_id = v_id;

    INSERT INTO public.codex_reveal_log (action, character_id)
    VALUES ('LOCK_CHARACTER_ALL', v_id);

    v_count := v_count + 1;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'count', v_count);
END;
$$;

-- DM Delete Character
CREATE OR REPLACE FUNCTION public.dm_delete_character(
  p_session_token TEXT,
  p_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  PERFORM public._validate_dm_session(p_session_token);

  DELETE FROM public.codex_characters WHERE id = p_character_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Enable Supabase Realtime untuk codex_reveals
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.codex_reveals;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Izin Eksekusi Fungsi RPC untuk anon dan authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.codex_categories TO anon, authenticated;
GRANT SELECT ON TABLE public.codex_reveals TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.list_codex(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_codex_character(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_login(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_logout(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_verify_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_change_password(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_list_all(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_get_character(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_set_reveal(TEXT, UUID, TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_set_tier_reveal(TEXT, UUID, INT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_introduce(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_lock_all(TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_get_log(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_upsert_character(TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_batch_introduce(TEXT, UUID[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_batch_set_tier(TEXT, UUID[], INT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_batch_lock_all(TEXT, UUID[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dm_delete_character(TEXT, UUID) TO anon, authenticated;

-- ============================================================================
-- STORAGE BUCKET SETUP (codex-assets dengan nama berkas UUID teracak)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('codex-assets', 'codex-assets', true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    DROP POLICY IF EXISTS "codex_assets_public_read" ON storage.objects;
    CREATE POLICY "codex_assets_public_read" ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (bucket_id = 'codex-assets');

    DROP POLICY IF EXISTS "codex_assets_upload" ON storage.objects;
    CREATE POLICY "codex_assets_upload" ON storage.objects
      FOR INSERT TO anon, authenticated
      WITH CHECK (bucket_id = 'codex-assets');
  END IF;
END $$;
