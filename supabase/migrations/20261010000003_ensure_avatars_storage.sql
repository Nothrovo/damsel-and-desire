-- ============================================================================
-- Migration: 20261010000003_ensure_avatars_storage.sql
-- Description: Ensure Storage Buckets & Policies for Player Avatars & ID Photos
-- ============================================================================

-- 1. Ensure storage buckets exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    -- Ensure codex-assets bucket exists and is public
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('codex-assets', 'codex-assets', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    -- Ensure avatars bucket exists and is public
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO UPDATE SET public = true;
  END IF;
END $$;

-- 2. Storage Policies for 'avatars' bucket
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    -- Public Read
    DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
    CREATE POLICY "avatars_public_read" ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (bucket_id = 'avatars');

    -- Insert
    DROP POLICY IF EXISTS "avatars_public_insert" ON storage.objects;
    CREATE POLICY "avatars_public_insert" ON storage.objects
      FOR INSERT TO anon, authenticated
      WITH CHECK (bucket_id = 'avatars');

    -- Update
    DROP POLICY IF EXISTS "avatars_public_update" ON storage.objects;
    CREATE POLICY "avatars_public_update" ON storage.objects
      FOR UPDATE TO anon, authenticated
      USING (bucket_id = 'avatars')
      WITH CHECK (bucket_id = 'avatars');

    -- Delete
    DROP POLICY IF EXISTS "avatars_public_delete" ON storage.objects;
    CREATE POLICY "avatars_public_delete" ON storage.objects
      FOR DELETE TO anon, authenticated
      USING (bucket_id = 'avatars');
  END IF;
END $$;
