-- ============================================================================
-- DAMSEL & DESIRE v2.0 - COMPLETE DATABASE MIGRATION SCRIPT
-- Combined All-In-One Migration for Supabase SQL Editor
-- Includes:
--   1. Relational schema (profiles, campaigns, campaign_members, characters, character_secrets, roll_log, calendar_progress)
--   2. Compendium schema (abilities, skills, ekskul, subclasses, moves, archetypes, social_classes, equipment_packs, basic_actions, calendar_events)
--   3. Seed compendium data (Full TRPG ruleset & master data)
--   4. Row Level Security (RLS) policies with DM-only secret protection & public compendium reads
--   5. Legacy characters migration procedure & helper functions
--   6. Stored Procedures / RPC game logic (create_character, rests, finances, vitals, dice rolls)
-- ============================================================================


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000001_initial_schema.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000002_compendium_tables.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- Migration: 20261007000002_compendium_tables.sql
-- Description: Compendium tables for TRPG rules, moves, classes, and items
-- Tables: abilities, skills, ekskul, ekskul_subclasses, ekskul_moves,
--         archetypes, archetype_moves, social_classes, equipment_packs,
--         basic_actions, calendar_events.
-- ============================================================================

-- 1. Abilities & Inherent Skills
CREATE TABLE IF NOT EXISTS public.abilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL,
  dnd_equiv TEXT,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  ability_id TEXT NOT NULL REFERENCES public.abilities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 2. Ekskul (Classes) & Club Moves
CREATE TABLE IF NOT EXISTS public.ekskul (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  hit_die TEXT NOT NULL,
  primary_stat TEXT NOT NULL,
  saving_throws TEXT[] NOT NULL,
  perk_description TEXT
);

CREATE TABLE IF NOT EXISTS public.ekskul_subclasses (
  id TEXT PRIMARY KEY,
  ekskul_id TEXT NOT NULL REFERENCES public.ekskul(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ekskul_moves (
  id TEXT PRIMARY KEY,
  ekskul_id TEXT NOT NULL REFERENCES public.ekskul(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  move_type TEXT NOT NULL,
  cost TEXT NOT NULL,
  range TEXT NOT NULL,
  check_type TEXT NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 3. Archetypes (Species / Tropes) & Archetype Moves
CREATE TABLE IF NOT EXISTS public.archetypes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  stat_bonus JSONB NOT NULL,
  perk_description TEXT
);

CREATE TABLE IF NOT EXISTS public.archetype_moves (
  id TEXT PRIMARY KEY,
  archetype_id TEXT NOT NULL REFERENCES public.archetypes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  move_type TEXT NOT NULL,
  cost TEXT NOT NULL,
  range TEXT NOT NULL,
  check_type TEXT NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 4. Social Classes (Backgrounds)
CREATE TABLE IF NOT EXISTS public.social_classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  daily_allowance TEXT NOT NULL,
  initial_savings TEXT NOT NULL,
  daily_amount INTEGER NOT NULL,
  savings_amount INTEGER NOT NULL,
  description TEXT,
  starter_items TEXT[] NOT NULL
);

-- 5. Equipment Packs (3-Layer gear)
CREATE TABLE IF NOT EXISTS public.equipment_packs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL
);

-- 6. Basic Actions & Calendar Events
CREATE TABLE IF NOT EXISTS public.basic_actions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  cost TEXT NOT NULL,
  check_type TEXT NOT NULL,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL,
  name TEXT NOT NULL,
  event_type TEXT DEFAULT 'school_event',
  description TEXT NOT NULL
);

ALTER TABLE public.calendar_events ALTER COLUMN event_type DROP NOT NULL;

-- Indexes for Compendium Lookup
CREATE INDEX IF NOT EXISTS idx_skills_ability ON public.skills (ability_id);
CREATE INDEX IF NOT EXISTS idx_ekskul_moves_ekskul ON public.ekskul_moves (ekskul_id);
CREATE INDEX IF NOT EXISTS idx_ekskul_subclasses_ekskul ON public.ekskul_subclasses (ekskul_id);
CREATE INDEX IF NOT EXISTS idx_archetype_moves_archetype ON public.archetype_moves (archetype_id);



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000003_seed_compendium.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- Migration: 20261007000003_seed_compendium.sql
-- Description: Seed master compendium data from DD_DATA
-- ============================================================================

-- 1. Abilities & Skills
INSERT INTO public.abilities (id, name, short_code, dnd_equiv, description) VALUES ('physique', 'Physique', 'PHY', 'STR / DEX / CON', 'Kekuatan otot, kelenturan tubuh, refleks motorik, dan daya tahan fisik.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_code = EXCLUDED.short_code, dnd_equiv = EXCLUDED.dnd_equiv, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('power', 'physique', 'Power', 'Angkat beban, mendobrak pintu, memukul, mendorong, dan adu tenaga fisik.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('agility', 'physique', 'Agility', 'Kelincahan, kecepatan refleks, kejar kereta, panjat pagar sekolah, dan kelenturan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('stamina', 'physique', 'Stamina', 'Daya tahan lari maraton, begadang belajar, tahan benturan, dan tidak mudah masuk angin.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.abilities (id, name, short_code, dnd_equiv, description) VALUES ('intelligent', 'Intelligent', 'INT', 'INT / Logic', 'Kecerdasan akademis, nalar logika, pemecahan masalah, dan pengetahuan jalanan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_code = EXCLUDED.short_code, dnd_equiv = EXCLUDED.dnd_equiv, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('academic', 'intelligent', 'Academic', 'Materi ujian sekolah, rumus matematika/sains, sejarah, dan hafalan teori pelajaran.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('people', 'intelligent', 'People', 'Membaca psikologi lawan, menganalisis bahasa tubuh, mendeteksi motif bohong/salting.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('street', 'intelligent', 'Street', 'Akal-akalan pergaulan, tahu jalan pintas rahasia kota, gosip geng, dan trik bertahan di jalanan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.abilities (id, name, short_code, dnd_equiv, description) VALUES ('looks', 'Looks', 'LOK', 'CHA / Attractiveness', 'Daya tarik visual, pesona karismatik, gaya berpakaian, dan aura kehadiran.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_code = EXCLUDED.short_code, dnd_equiv = EXCLUDED.dnd_equiv, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('charm', 'looks', 'Charm', 'Pesona personal, senyuman menawan, rayuan asmara, kedipan mata, dan daya pikat alami.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('influence', 'looks', 'Influence', 'Pengaruh reputasi di kalangan murid, disegani kawan dan lawan, serta wibawa status.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('aura', 'looks', 'Aura', 'Kehadiran yang mencolok, tatapan tajam berkarisma, atau vibes misterius yang membius.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.abilities (id, name, short_code, dnd_equiv, description) VALUES ('mind', 'Mind', 'MND', 'WIS / Mental Fortitude', 'Kekuatan mental, ketenangan batin, empati, dan kepekaan membaca atmosfer sekitar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_code = EXCLUDED.short_code, dnd_equiv = EXCLUDED.dnd_equiv, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('emotional', 'mind', 'Emotional', 'Kontrol emosi pribadi, jaga imej (jaim), menahan rasa malu, dan mengelola kegelisahan hati.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('interpersonal', 'mind', 'Interpersonal', 'Peka terhadap perasaan orang lain, mendengarkan curhat, merajut ikatan hati mendalam.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('awareness', 'mind', 'Awareness', 'Membaca atmosfer sosial (Kuuki Yomenai / Kuuki Yomeru), menyadari tatapan rahasia orang lain.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.abilities (id, name, short_code, dnd_equiv, description) VALUES ('talent', 'Talent', 'TLN', 'Performance / Creativity', 'Bakat alami, ekspresi kesenian, keahlian panggung, dan keluwesan berimprovisasi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_code = EXCLUDED.short_code, dnd_equiv = EXCLUDED.dnd_equiv, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('creative', 'talent', 'Creative', 'Merancang ide festival sekolah, menulis surat cinta puitis, ilustrasi, dan desain kreatif.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('performance', 'talent', 'Performance', 'Akting panggung drama, bernyanyi, memainkan instrumen musik, dan pidato membakar semangat.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('adaptability', 'talent', 'Adaptability', 'Improvisasi kilat saat rencana berantakan, mengubah suasana kaku, dan fleksibel menghadapi situasi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.abilities (id, name, short_code, dnd_equiv, description) VALUES ('luck', 'Luck', 'LCK', 'Fate / Fortune', 'Faktor keberuntungan murni, takdir kasmaran, dan kebetulan-kebetulan dramatis anime.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, short_code = EXCLUDED.short_code, dnd_equiv = EXCLUDED.dnd_equiv, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('relationship_luck', 'luck', 'Relationship Luck', 'Papasan romantis tidak sengaja, tabrakan bawa roti di tikungan, terlindung payung bareng saat hujan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('situation_luck', 'luck', 'Situation Luck', 'Lolos razia sidak guru BP, nemu uang di jalan, guru killer izin tidak masuk kelas.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skills (id, ability_id, name, description) VALUES ('academic_luck', 'luck', 'Academic Luck', 'Hoki tebak kancing saat ujian, materi yang dipelajari semalam pas keluar di lembar soal.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Ekskul (Classes), Subclasses, and Club Moves
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('student_council', 'Student Council (OSIS)', 'Elit Organisasi & Penegak Ketertiban Sekolah', 'd8', 'Looks / Intelligent', ARRAY['intelligent', 'looks']::TEXT[], 'Hak akses ruang OSIS ber-AC, wewenang menegur murid lain, anggaran proposal kegiatan sekolah, dan disegani dewan guru.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('presidium', 'student_council', 'Ketua / Presidium', 'Pemimpin mutlak OSIS. Bonus +2 pada semua Looks checks saat berhadapan dengan guru atau undangan eksternal.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('discipline', 'student_council', 'Divisi Kedisiplinan', 'Penegak aturan sekolah. Advantage pada Intimidasi dan Check untuk mendeteksi pelanggaran murid lain.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('kendo', 'Kendo (Pedang Bambu)', 'Disiplin Pedang Samurai & Konsentrasi Batin', 'd10', 'Physique / Mind', ARRAY['physique', 'mind']::TEXT[], 'Penguasaan teknik Shinai dan Bokken, ruang latihan Dojo tradisional, kuda-kuda kokoh, dan fokus mata yang tak goyah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('men_striker', 'kendo', 'Gaya Serangan Kilat (Men-Striker)', 'Spesialisasi serangan cepat. Bonus aksi ekstra setelah serangan sukses pertama dalam ronde.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('iron_guard', 'kendo', 'Gaya Pertahanan Keras (Iron Wall)', 'Spesialisasi pertahanan. +1 Physical AC permanen dan Advantage pada Physique Saving Throw.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('martial_arts', 'Martial Arts (Beladiri / Karate / Judo)', 'Pertarungan Jarak Dekat & Refleks Bantingan', 'd10', 'Physique', ARRAY['physique', 'talent']::TEXT[], 'Tubuh liat tahan banting, pukulan dan tendangan tanpa senjata berdaya hancur tinggi, serta kemampuan melumpuhkan lawan tanpa senjata tajam.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('grappler', 'martial_arts', 'Spesialis Bantingan (Judo / Grappler)', 'Ahli merebut dan membanting lawan ke tanah. Serangan Bantingan memberikan +2d4 damage tambahan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('striker', 'martial_arts', 'Spesialis Serangan Beruntun (Striker)', 'Ahli combo pukulan cepat. Bisa menyerang 2 kali dengan 1 aksi (setelah level 3+).') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('sports', 'Sports (Sepak Bola / Basket / Atletik)', 'Stamina Baja & Kecepatan Lapangan Terbuka', 'd10', 'Physique / Looks', ARRAY['physique', 'physique']::TEXT[], 'Kecepatan lari di atas rata-rata (+10 ft speed), keringat karismatik yang digemari murid lain, dan stamina tahan maraton.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('ace_striker', 'sports', 'Striker / Ace Lapangan', 'Serangan fisik berbasis kecepatan. Bonus +1d4 damage saat menyerang setelah berlari setidaknya 15 ft.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('team_captain', 'sports', 'Kapten Regu', 'Pemimpin tim. Sekali per istirahat, berikan 1d6 Inspiration Die ke seluruh anggota tim.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('drama', 'Drama Club (Teater & Seni Peran)', 'Manipulasi Emosi, Akting Panggung & Dusta Sempurna', 'd8', 'Looks / Talent', ARRAY['looks', 'talent']::TEXT[], 'Kostum panggung beragam, kemampuan meneteskan air mata buatan seketika, menirukan intonasi orang lain, dan menyamar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('lead_actor', 'drama', 'Aktor Protagonis / Bintang Panggung', 'Ahli menarik simpati massa. Serangan sosial berbasis Looks memberikan 1d4 bonus damage Composure.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('antagonist', 'drama', 'Master Tipu Daya (Antagonist)', 'Ahli manipulasi. Advantage pada semua check untuk menipu, berpura-pura, atau menyamar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('kir_osn', 'KIR / OSN (Sains & Karya Ilmiah Remaja)', 'Analisis Tajam, Riset Ilmiah & Reaksi Kimia', 'd6', 'Intelligent', ARRAY['intelligent', 'mind']::TEXT[], 'Kunci akses laboratorium sains & bahan kimia, bank soal olimpiade, mikroskop, dan laptop penuh data analisis.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('chemist', 'kir_osn', 'Peneliti Kimia & Biologi', 'Ahli senyawa kimia. Bisa menciptakan efek racun, asap, atau pelemas otot dari bahan lab sekali per sesi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('hacker', 'kir_osn', 'Hacker Komputer & Robotika', 'Ahli perangkat digital. Advantage pada check Intelligent untuk membobol sistem, CCTV, atau kunci digital.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('pramuka_paskin', 'Pramuka / Paskin (Paskibra & Kedisiplinan Baris)', 'Tali Temali, Disiplin Militer & Postur Tegak', 'd10', 'Physique / Mind', ARRAY['physique', 'mind']::TEXT[], 'Keahlian tali temali mengikat barang/lawan, tiang bendera serbaguna, peluit komando, dan daya tahan berjemur di lapangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('danton', 'pramuka_paskin', 'Komandan Peleton (Danton)', 'Pemimpin barisan. Advantage saat memimpin aksi kelompok, bonus +2 pada semua Social Saves tim.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('pioneer', 'pramuka_paskin', 'Pionir Tali Temali & Tenda', 'Ahli bertahan hidup. Tidak pernah kehilangan arah di luar ruangan. +2 Physique Save terhadap bahaya alam.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('pecinta_alam', 'Pecinta Alam (Mapala / Sispala)', 'Insting Bertahan Hidup, Peta Liar & Fisik Tangguh', 'd10', 'Physique / Mind', ARRAY['physique', 'mind']::TEXT[], 'Tenda dome portabel, kompor gas mini, ransel gunung besar (kapasitas tas ekstra), dan indra penciuman cuaca tajam.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('explorer', 'pecinta_alam', 'Penjelajah Rimba & Pendaki', 'Spesialis navigasi dan terrain. Advantage pada Physique checks untuk memanjat, berenang, atau melintasi rintangan alam.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('medic', 'pecinta_alam', 'Ahli Pertolongan Pertama (Medic)', 'Spesialis penyembuhan lapangan. Heal dice meningkat jadi 1d10 dan bisa menyembuhkan 1 teman per Short Rest.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('penyiaran', 'Penyiaran (Broadcasting / Radio Sekolah)', 'Suara Emas Penguasa Speaker Sekolah & Intel Gosip', 'd6', 'Looks / Intelligent', ARRAY['intelligent', 'looks']::TEXT[], 'Hak akses ruang siaran audio sekolah, mikrofon, pemutar lagu, dan jaringan informan gosip paling mutakhir di sekolah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('radio_host', 'penyiaran', 'Penyiar Radio Sekolah', 'Suara emas sekolah. Semua Social Moves berbasis suara mendapat +1 ke DC check dan 1d4 bonus damage.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('investigator', 'penyiaran', 'Reporter Investigasi', 'Ahli menggali informasi. Advantage pada semua check Intelligent (Street) dan Mind (Interpersonal) untuk mencari gosip.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('literatur', 'Literatur (Klub Sastra & Membaca)', 'Kekuatan Kata Romantis, Sajak & Misteri Buku Lama', 'd6', 'Intelligent / Mind', ARRAY['intelligent', 'mind']::TEXT[], 'Tempat persembunyian tenang di sudut perpustakaan, koleksi novel romansa klasik, kemampuan merangkai surat cinta mematikan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('novelist', 'literatur', 'Penulis Puisi & Novel Romansa', 'Surat cinta dan aksi romansa berbasis Talent/Creative mendapat 1d4 bonus damage Composure.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('archivist', 'literatur', 'Penjaga Arsip Sejarah Sekolah', 'Ahli sejarah dan dokumen. Advantage pada semua check Intelligent terkait sejarah, peraturan, atau informasi tertulis.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('band', 'Band Musik (Gitar / Drum / Vokal / Keyboard)', 'Dentuman Distorsi, Semangat Jiwa Muda & Fans Fanatik', 'd8', 'Looks / Talent', ARRAY['looks', 'talent']::TEXT[], 'Studio musik kedap suara, instrumen musik andalan, ampli portabel, pick gitar jimat keberuntungan, dan basis penggemar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('lead_guitar', 'band', 'Lead Guitarist / Soloist', 'Ahli solo gitar. Serangan Sonic berbasis Talent mendapat +1d6 damage dan bisa mempengaruhi area lebih luas.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('vocalist', 'band', 'Vokalis Utama Karismatik', 'Ahli memikat hati penonton. Semua Social Moves dari vokalis memberikan Disadvantage pada Mental Saves target.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description) VALUES ('painting', 'Painting (Klub Seni Rupa & Desain)', 'Goresan Kuas, Memori Visual Tajam & Estetika Warna', 'd6', 'Talent / Intelligent', ARRAY['intelligent', 'talent']::TEXT[], 'Ruang seni penuh aroma cat minyak, kuas dan kanvas, celemek berlumur cat artistik, dan mata yang peka warna emosi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hit_die = EXCLUDED.hit_die, primary_stat = EXCLUDED.primary_stat, saving_throws = EXCLUDED.saving_throws, perk_description = EXCLUDED.perk_description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('portrait', 'painting', 'Pelukis Potret Realis', 'Ahli memvisualisasikan seseorang dari ingatan. Advantage pada check yang membutuhkan deskripsi rupa atau pengenalan wajah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description) VALUES ('designer', 'painting', 'Ilustrator Manga & Desain', 'Ahli visual komunikasi. Bisa menciptakan publikasi, flyer, atau karikatur yang memberikan 1d6 bonus Influence di lingkungan sekolah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Archetypes (Species / Tropes) & Archetype Moves
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('delinquent', 'Delinquent (Berandalan / Yanki)', 'Seragam Dasi Longgar, Tatapan Tajam & Hati Emas Tersembunyi', '{"physique":2,"looks":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('jock', 'Jock / Sporty', 'Bugar, Berenergi Tinggi, Semangat Pantang Menyerah', '{"physique":2,"talent":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('nerd', 'Nerd (Murid Ambis / Kutu Buku)', 'Kacamata Frame Tebal, Catatan Lengkap & Tahu Segalanya', '{"intelligent":2,"mind":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('class_clown', 'Class Clown (Pelawak Kelas)', 'Tukang Rusuh Positif, Pemecah Kecanggungan & Bikin Ngakak', '{"talent":2,"looks":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('emo', 'Emo / Serius', 'Duduk di Sudut Jendela, Headphone Terpasang & Tatapan Dingin', '{"mind":2,"intelligent":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('weeb', 'Weeb (Pecinta Anime / Manga / Pop Culture)', 'Chuunibyou Nyata, Gantungan Tas Penuh Pin & Imajiner Liar', '{"talent":1,"luck":2}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('popular_kids', 'Popular Kids (Idola Sekolah / Trendsetter)', 'Senyum Menawan, Pakaian Modis & Selalu Jadi Pusat Perhatian', '{"looks":2,"mind":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;
INSERT INTO public.archetypes (id, name, tagline, stat_bonus, perk_description) VALUES ('normies', 'Normies (Murid Biasa / Kalem)', 'Tidak Banyak Tingkah, Pengamat Damai & Menghargai Hal Simpel', '{"physique":1,"intelligent":1,"looks":1,"mind":1,"talent":1,"luck":1}'::jsonb, NULL) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, stat_bonus = EXCLUDED.stat_bonus, perk_description = EXCLUDED.perk_description;

-- 4. Social Classes
INSERT INTO public.social_classes (id, name, tier, daily_allowance, initial_savings, daily_amount, savings_amount, description, starter_items) VALUES ('rich', 'Rich (Keluarga Konglomerat / Ningrat)', 'rich', '¥5,000 / Rp 500,000 per hari', '¥200,000 / Rp 20,000,000', 5000, 200000, 'Mobil pribadi siap menjemput, kartu kredit darurat, koneksi orang tua berpengaruh ke kepala sekolah.', ARRAY['Smartphone Flagship Terbaru', 'Dompet Kulit Merk Terkenal', 'Voucher Kafe Mewah', 'Kotak Pensil Impor']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier, daily_allowance = EXCLUDED.daily_allowance, initial_savings = EXCLUDED.initial_savings, daily_amount = EXCLUDED.daily_amount, savings_amount = EXCLUDED.savings_amount, description = EXCLUDED.description, starter_items = EXCLUDED.starter_items;
INSERT INTO public.social_classes (id, name, tier, daily_allowance, initial_savings, daily_amount, savings_amount, description, starter_items) VALUES ('medium_rich', 'Medium Rich (Keluarga Menengah Atas / Dokter / Eksekutif)', 'medium_rich', '¥2,000 / Rp 200,000 per hari', '¥50,000 / Rp 5,000,000', 2000, 50000, 'Motor/skuter pribadi, sering mentraktir teman dekat, akses les privat terbaik.', ARRAY['Smartphone Bagus', 'Sepatu Branded', 'Earphone Wireless Premium', 'Tumbler Keren']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier, daily_allowance = EXCLUDED.daily_allowance, initial_savings = EXCLUDED.initial_savings, daily_amount = EXCLUDED.daily_amount, savings_amount = EXCLUDED.savings_amount, description = EXCLUDED.description, starter_items = EXCLUDED.starter_items;
INSERT INTO public.social_classes (id, name, tier, daily_allowance, initial_savings, daily_amount, savings_amount, description, starter_items) VALUES ('medium', 'Medium (Keluarga Pegawai Biasa / Rata-rata)', 'medium', '¥1,000 / Rp 100,000 per hari', '¥15,000 / Rp 1,500,000', 1000, 15000, 'Sepeda jengki setia, kartu langganan kereta komuter, bekal makan siang enak buatan rumah.', ARRAY['Smartphone Standar', 'Kotak Bento Susun', 'Payung Lipat Polos', 'Kartu Kereta Komuter']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier, daily_allowance = EXCLUDED.daily_allowance, initial_savings = EXCLUDED.initial_savings, daily_amount = EXCLUDED.daily_amount, savings_amount = EXCLUDED.savings_amount, description = EXCLUDED.description, starter_items = EXCLUDED.starter_items;
INSERT INTO public.social_classes (id, name, tier, daily_allowance, initial_savings, daily_amount, savings_amount, description, starter_items) VALUES ('medium_poor', 'Medium Poor (Keluarga Pas-pasan / Berhemat)', 'medium_poor', '¥500 / Rp 50,000 per hari', '¥5,000 / Rp 500,000', 500, 5000, 'Tahu toko diskon termurah di sudut kota, mandiri memasak makanan sendiri, pintar menawar.', ARRAY['Smartphone Layar Retak Sedikit', 'Botol Air Minum Isi Ulang', 'Roti Diskon Minimarket', 'Buku Catatan Murah']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier, daily_allowance = EXCLUDED.daily_allowance, initial_savings = EXCLUDED.initial_savings, daily_amount = EXCLUDED.daily_amount, savings_amount = EXCLUDED.savings_amount, description = EXCLUDED.description, starter_items = EXCLUDED.starter_items;
INSERT INTO public.social_classes (id, name, tier, daily_allowance, initial_savings, daily_amount, savings_amount, description, starter_items) VALUES ('poor', 'Poor (Keluarga Kurang Mampu / Pejuang Hidup)', 'poor', '¥200 / Rp 20,000 per hari', '¥1,000 / Rp 100,000 (Di celengan)', 200, 1000, 'Stamina fisik luar biasa karena terbiasa kerja keras, tidak gengsian, sangat menghargai teman tulus.', ARRAY['Sepatu Kets Usang', 'Koran Bekas Pelindung Hujan', 'Nasi Kepal (Onigiri) Garam', 'Handuk Kecil Leher']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier, daily_allowance = EXCLUDED.daily_allowance, initial_savings = EXCLUDED.initial_savings, daily_amount = EXCLUDED.daily_amount, savings_amount = EXCLUDED.savings_amount, description = EXCLUDED.description, starter_items = EXCLUDED.starter_items;
INSERT INTO public.social_classes (id, name, tier, daily_allowance, initial_savings, daily_amount, savings_amount, description, starter_items) VALUES ('orphanage', 'Orphanage (Anak Asuh Panti / Hidup Mandiri)', 'orphanage', '¥300 / Rp 30,000 per hari', '¥3,000 / Rp 300,000', 300, 3000, 'Kemandirian mutlak, rasa empati tinggi terhadap sesama orang kesepian, insting gotong royong.', ARRAY['Foto Polaroid Lama', 'Gantungan Kunci Rajut Buatan Adik Panti', 'Tas Selempang Kanvas', 'Buku Harian Rahasia']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tier = EXCLUDED.tier, daily_allowance = EXCLUDED.daily_allowance, initial_savings = EXCLUDED.initial_savings, daily_amount = EXCLUDED.daily_amount, savings_amount = EXCLUDED.savings_amount, description = EXCLUDED.description, starter_items = EXCLUDED.starter_items;

-- 5. Equipment Packs
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('default_school_bag', 'Tas Sekolah Standar Murid', 'default', ARRAY['Buku Pelajaran & Buku Tulis Catatan', 'Kotak Pensil & Penghapus Lengkap', 'Smartphone & Earphone Kabel', 'Kartu Pelajar Sekolah', 'Payung Lipat Jaga-Jaga Hujan']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('student', 'Tas Sekolah Standar Murid', 'default', ARRAY['Buku Pelajaran & Buku Tulis Catatan', 'Kotak Pensil & Penghapus Lengkap', 'Smartphone & Earphone Kabel', 'Kartu Pelajar Sekolah', 'Payung Lipat Jaga-Jaga Hujan']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_student_council', 'Perlengkapan Klub: STUDENT COUNCIL', 'club', ARRAY['Kartu Identitas OSIS Resmi', 'Buku Agenda & Stempel OSIS', 'Walkie-Talkie Kecil Koordinasi']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_kendo', 'Perlengkapan Klub: KENDO', 'club', ARRAY['Shinai Bambu Latihan', 'Seragam Kendogi & Hakama', 'Botol Minyak Shinai']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_martial_arts', 'Perlengkapan Klub: MARTIAL ARTS', 'club', ARRAY['Pelindung Tangan (Karate Gloves)', 'Seragam Karate/Judo Putih', 'Perban Pergelangan Tangan']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_sports', 'Perlengkapan Klub: SPORTS', 'club', ARRAY['Sepatu Olahraga Khusus', 'Botol Minum Sport Besar', 'Handuk Microfiber Keringat']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_drama', 'Perlengkapan Klub: DRAMA', 'club', ARRAY['Buku Naskah Drama Bercoret-coret', 'Kotak Make-up Panggung Mini', 'Kunci Ruang Kostum']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_kir_osn', 'Perlengkapan Klub: KIR OSN', 'club', ARRAY['Kacamata Pelindung Lab', 'Buku Catatan Eksperimen', 'Set Tabung Reaksi Kecil']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_pramuka_paskin', 'Perlengkapan Klub: PRAMUKA PASKIN', 'club', ARRAY['Tali Pramuka 10 Meter', 'Peluit Komando', 'Kompas & Peta Sederhana']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_pecinta_alam', 'Perlengkapan Klub: PECINTA ALAM', 'club', ARRAY['Ransel Gunung Kecil', 'Senter Kepala LED', 'Korek Api Tahan Angin']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_penyiaran', 'Perlengkapan Klub: PENYIARAN', 'club', ARRAY['Earphone Monitor Profesional', 'Blocknote Reporter', 'Kartu Pers / ID Media Sekolah']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_literatur', 'Perlengkapan Klub: LITERATUR', 'club', ARRAY['Buku Catatan Puisi Pribadi', 'Pena Fountain Kesayangan', 'Bookmark Kain Bordir Cantik']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_band', 'Perlengkapan Klub: BAND', 'club', ARRAY['Pick Gitar Jimat Keberuntungan', 'Kabel Audio Pendek', 'Pelindung Telinga (Ear Plugs)']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('club_painting', 'Perlengkapan Klub: PAINTING', 'club', ARRAY['Set Kuas Cat Minyak Mini', 'Buku Sketsa A5', 'Celemek Berlumur Cat Seni']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_delinquent', 'Perlengkapan Arketip: DELINQUENT', 'archetype', ARRAY['Plester Luka Banyak', 'Jaket Bomber Modifikasi Keren', 'Permen Karet Mint']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_jock', 'Perlengkapan Arketip: JOCK', 'archetype', ARRAY['Protein Bar / Suplemen Energi', 'Pelindung Lutut Tipis', 'Topi Olahraga Branded']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_nerd', 'Perlengkapan Arketip: NERD', 'archetype', ARRAY['Kalkulator Saintifik Canggih', 'Kain Lap Kacamata Microfiber', 'Stabilo Warna-warni Lengkap']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_class_clown', 'Perlengkapan Arketip: CLASS CLOWN', 'archetype', ARRAY['Sticky Note Lucu-Lucu', 'Koin Sulap Palsu', 'Buku Lelucon Kecil Tersembunyi']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_emo', 'Perlengkapan Arketip: EMO', 'archetype', ARRAY['Earphone Noise-Cancelling', 'Buku Harian Terkunci', 'Gelang Karet Hitam Beberapa']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_weeb', 'Perlengkapan Arketip: WEEB', 'archetype', ARRAY['Gantungan Tas Pin Anime Banyak', 'Keychain Karakter Favorit', 'Buku Manga Kecil']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_popular_kids', 'Perlengkapan Arketip: POPULAR KIDS', 'archetype', ARRAY['Lipbalm / Lip Tint Mewah', 'Cermin Kompak Branded', 'Kartu Nama Murid (Custom)']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
INSERT INTO public.equipment_packs (id, name, category, items) VALUES ('archetype_normies', 'Perlengkapan Arketip: NORMIES', 'archetype', ARRAY['Bento Box Standar', 'Botol Minum Polos', 'Pensil Cadangan (Banyak)']::TEXT[]) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;

-- 6. Basic Actions
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_1', 'Pukulan Fisik (Unarmed Strike)', 'basic_combat', 'Action (Physical)', 'Physique / Power', '1 + Mod Physique (Physical Bludgeoning)', 'Tinju mentah atau tamparan spontan saat adu fisik jarak dekat.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_2', 'Tendangan Cepat (Snap Kick)', 'basic_combat', 'Action (Physical)', 'Physique / Agility', '1d4 + Mod Physique (Physical Bludgeoning)', 'Tendangan mendadak mengarah ke betis atau paha lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_3', 'Dorongan Kuat (Shove)', 'basic_combat', 'Action (Physical)', 'Physique / Power vs Target Physique Save', 'Target terdorong 5 ft & mungkin terjatuh Prone', 'Mendorong lawan dengan kedua tangan penuh tenaga agar kehilangan keseimbangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_4', 'Tangkis & Bertahan (Dodge & Guard)', 'basic_combat', 'Action (Defense)', 'Otomatis', '+2 Physical & Social AC sampai giliran berikutnya', 'Memasang kuda-kuda rapat dan fokus memperhatikan gerak-gerik lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_5', 'Kabur & Menghindar (Disengage)', 'basic_combat', 'Action (Movement)', 'Physique / Agility', 'Tidak memicu Opportunity Attack saat bergerak menjauhi lawan', 'Mundur dengan langkah cerdas memanfaatkan celah gerak lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_6', 'Tatapan Intimidasi (Intimidating Stare)', 'basic_social', 'Action (Social Attack)', 'Looks / Aura vs Target Mind Save', '1d4 + Mod Mind (Composure Damage)', 'Menatap dengan ekspresi dingin dan intensitas yang membuat target tidak nyaman.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_7', 'Senyuman Persuasi (Charming Smile)', 'basic_social', 'Action (Social Attack)', 'Looks / Charm vs Target Mind Save', '1d6 + Mod Looks (Composure Damage)', 'Memberikan senyuman tulus yang membuat degup jantung target berdebar kencang.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_8', 'Sindiran / Provokasi (Taunt)', 'basic_social', 'Action (Social Attack)', 'Intelligent / People vs Target Mind Save', '1d4 (Composure Damage)', 'Melontarkan kata-kata tajam yang tepat sasaran untuk memancing reaksi emosional target.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_9', 'Rayuan Halus (Subtle Flirt)', 'basic_social', 'Action (Social Utility)', 'Looks / Charm vs Target Mind Save', '—', 'Mengirimkan sinyal halus lewat tatapan atau gestur kecil yang membuka pintu percakapan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description) VALUES ('action_10', 'Bantuan & Dukungan (Help / Support)', 'basic_social', 'Action (Social Utility)', 'Mind / Interpersonal', '—', 'Membantu, mendukung, atau memberikan ide kepada teman yang sedang berusaha melakukan sesuatu.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, cost = EXCLUDED.cost, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

-- 7. Calendar Events
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_01', 'Semester 1 (Musim Semi)', 'Upacara Masuk & Pembagian Kelas Baru', 'school_event', 'Momen berkenalan dengan teman sebangku dan melihat siapa yang satu kelas denganmu.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_02', 'Semester 1', 'Ujian Tengah Semester (UTS / Midterms)', 'school_event', 'Pertaruhan nilai akademis, begadang kelompok belajar di perpustakaan.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_03', 'Semester 1', 'Festival Olahraga (Undoukai)', 'school_event', 'Lari estafet, tarik tambang, dan kesempatan menyemangati gebetan dari pinggir lapangan.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_04', 'Liburan Semester 1', 'Liburan Musim Panas & Festival Kembang Api', 'school_event', 'Mengenakan pakaian Yukata, janjian nonton kembang api kuil di malam hari.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_05', 'Semester 2 (Musim Gugur)', 'Festival Budaya Sekolah (Bunkasai)', 'school_event', 'Acara puncak tahunan! Rumah hantu, maid cafe kelas, dan konser band panggung sekolah.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_06', 'Semester 2', 'Study Tour Sekolah (Shuugakuryokou)', 'school_event', 'Perjalanan bus menginap ke Kyoto/daerah wisata; curhat rahasia malam hari di kamar hotel.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_07', 'Semester 2 (Musim Dingin)', 'Hari Valentine & White Day', 'school_event', 'Menaruh cokelat honmei (cinta tulus) atau giri (pertemanan) di dalam loker sepatu.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;
INSERT INTO public.calendar_events (id, term, name, event_type, description) VALUES ('cal_08', 'Akhir Tahun Ajaran', 'Ujian Kenaikan Kelas & Upacara Kelulusan', 'school_event', 'Pengumuman kelulusan dan momen perpisahan yang penuh air mata kenangan.') ON CONFLICT (id) DO UPDATE SET term = EXCLUDED.term, name = EXCLUDED.name, event_type = EXCLUDED.event_type, description = EXCLUDED.description;



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000004_rls_policies.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000005_legacy_data_migration.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000006_game_logic_rpc.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000007_communal_open_access.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
GRANT EXECUTE ON FUNCTION public.import_legacy_character(JSONB, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.short_rest(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.long_rest(UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_savings(UUID, NUMERIC, INT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_vital_change(UUID, TEXT, INT, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.roll_dice(UUID, UUID, TEXT, TEXT, TEXT, INT) TO anon, authenticated;


-- Migration: 20261007000008_seed_moves.sql
-- Seed ekskul_moves (36 moves) and archetype_moves (24 moves)

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('student_council_move_1', 'student_council', 'Perintah Kedisiplinan (Disciplinary Order)', 'Social Move', '1 Action', '30 ft', 'Looks / Influence', 'Target Mind Save (DC 8+Prof+Looks). Gagal: Stunned 1 giliran & kehilangan 1d6 Composure.', 'Menegur target dengan suara tegas berwibawa khas OSIS.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('student_council_move_2', 'student_council', 'Koneksi Pihak Sekolah (Faculty Pass)', 'Reaction / Utility', '1x per Short Rest', 'Self / Touch', 'Otomatis', 'Membatalkan konsekuensi teguran guru atau razia loker untuk dirimu dan 1 teman.', 'Menunjukkan kartu identitas OSIS atau surat tugas resmi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('student_council_move_3', 'student_council', 'Proposal Darurat (Emergency Budget)', 'Utility Move', '10 Menit', 'Self', 'Intelligent / Academic', 'Mendapatkan 1 item kebutuhan mendesak (alat sekolah, tiket, pass) tanpa biaya selama sesi ini.', 'Menyusun surat permintaan dana darurat dengan stempel OSIS resmi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('kendo_move_1', 'kendo', 'Tebasan Shinai: Men! (Head Slash)', 'Attack / Club Move', '1 Action', 'Melee (5 ft)', 'Physique / Power', '1d8 + Mod Physique Bludgeoning. Jika mengenai helm/kepala: target Physique Save atau Disadvantage serangan berikutnya.', 'Pukulan vertikal terarah ke arah kepala dengan teriakan kiai menggelegar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('kendo_move_2', 'kendo', 'Tangkisan Sempurna (Kendo Parry)', 'Reaction', 'Reaction', 'Self', '+2 Physical AC', 'Menambah +2 Physical AC terhadap 1 serangan fisik jarak dekat yang terlihat.', 'Mengayunkan pedang bambu membentuk sudut tangkisan tajam membelokkan serangan lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('kendo_move_3', 'kendo', 'Kiai: Teriakan Semangat (Kiai Shout)', 'Bonus Action / Buff', '1 Bonus Action', '30 ft', 'Mind / Emotional', 'Dirimu dan 1 sekutu mendapat Advantage pada serangan fisik berikutnya di ronde ini.', 'Melepas teriakan kiai penuh konsentrasi yang membakar semangat tempur.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('martial_arts_move_1', 'martial_arts', 'Bantingan Matras (Seoi-Nage Takedown)', 'Attack / Club Move', '1 Action', 'Melee (5 ft)', 'Physique / Power vs Target Physique Save', '1d6 + Mod Physique Bludgeoning. Target terjatuh Prone (terkapar).', 'Menarik kerah atau lengan lawan, memutar badan, dan membantingnya keras ke lantai.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('martial_arts_move_2', 'martial_arts', 'Pukulan Cepat Kombo (Rapid Flurry)', 'Bonus Action', '1 Bonus Action', 'Melee (5 ft)', 'Physique / Agility', '1d4 + Mod Physique Physical Damage tambahan setelah serangan utama.', 'Kombinasi pukulan cepat tanpa jeda menyasar perut lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('martial_arts_move_3', 'martial_arts', 'Kunci Sendi (Joint Lock)', 'Attack / Club Move', '1 Action', 'Melee (5 ft)', 'Physique / Agility vs Target Physique Save', 'Target Restrained selama 1 giliran. Target tidak bisa menyerang hingga lolos dengan Physique check DC 12.', 'Memegang siku atau pergelangan tangan lawan dan menguncinya ke sudut yang menyakitkan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('sports_move_1', 'sports', 'Terobosan Kilat (Fast Break Sprint)', 'Bonus Action', '1 Bonus Action', 'Self', 'Otomatis', 'Menggandakan kecepatan gerak (Dash) dan tidak memicu Opportunity Attack saat bergerak melewati lawan.', 'Manuver lari cepat zig-zag menembus kerumunan seperti mengejar bola di lapangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('sports_move_2', 'sports', 'Lemparan Bola Akurat (Precision Throw)', 'Attack / Club Move', '1 Action', 'Ranged (40 ft)', 'Physique / Agility', '1d6 + Mod Physique Bludgeoning. Target terpental atau terkejut jika kena di wajah.', 'Melempar bola basket, bola voli, atau benda bulat lainnya dengan ketepatan presisi tinggi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('sports_move_3', 'sports', 'Sorak Penyemangat (Rally Cheer)', 'Buff Move', 'Bonus Action', '30 ft', 'Looks / Influence', '1 sekutu memulihkan 1d4 Physical HP dan mendapat Advantage pada 1 check fisik berikutnya.', 'Berteriak penuh semangat ke arah teman yang tertekan, memicu adrenalin mereka kembali.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('drama_move_1', 'drama', 'Air Mata Buatan (Fake Tears / Manipulation)', 'Social Move', '1 Action', '15 ft', 'Talent / Performance vs Target Mind Save', 'Target Disadvantage semua serangan terhadapmu & kehilangan 1d6 Composure karena rasa bersalah.', 'Berakting sedih tersedu-sedu sambil menggigit bibir, membalikkan simpati seluruh orang di sekitar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('drama_move_2', 'drama', 'Persona Penyamaran (Method Acting)', 'Utility Move', '10 Menit', 'Self', 'Talent / Adaptability', 'Advantage pada semua check People & Street saat menyamar sebagai tipe orang lain.', 'Merombak gaya bicara, cara jalan, dan dandanan untuk berpura-pura jadi murid lain.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('drama_move_3', 'drama', 'Monolog Dramatis (Grand Speech)', 'Social Move', '1 Action', '30 ft (Area)', 'Talent / Performance vs seluruh target Mind Save', 'Seluruh musuh dalam jangkauan kehilangan 1d4 Composure. Sekutu mendapat Advantage pada Social Saves 1 giliran.', 'Berpidato dengan ekspresi dramatis penuh penjiwaan yang menguras emosi siapa saja yang mendengar.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('kir_osn_move_1', 'kir_osn', 'Analisis Titik Lemah (Analytical Deduction)', 'Bonus Action', '1 Bonus Action', '30 ft', 'Intelligent / Academic', 'Mengetahui 1 stat tertinggi dan 1 kelemahan target. Serangan sekutu berikutnya ke target mendapat Advantage.', 'Mengamati postur dan kebiasaan lawan lewat perhitungan matematis untuk menemukan celah pertahanan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('kir_osn_move_2', 'kir_osn', 'Asap Reaksi Kimia (Lab Smoke Screen)', 'Utility / Combat Move', '1 Action', '15 ft', 'Otomatis', 'Menciptakan kabut pekat radius 10 ft selama 2 giliran. Semua pandangan di dalamnya tertutup.', 'Mencampurkan larutan kimia darurat dari tabung saku menghasilkan asap tebal.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('kir_osn_move_3', 'kir_osn', 'Formula Konsentrasi (Study Buff)', 'Utility Move', '10 Menit', 'Self / Touch', 'Intelligent / Academic', 'Target mendapat Advantage pada 1 check Intelligent atau Talent berikutnya dalam 1 jam ke depan.', 'Menyusun peta konsep atau ringkasan materi kilat agar pikiran fokus sebelum tes atau debat.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('pramuka_paskin_move_1', 'pramuka_paskin', 'Kuncian Tali Pramuka (Rope Restrain)', 'Attack / Club Move', '1 Action', 'Melee (5 ft)', 'Physique / Agility vs Target Agility', 'Target Restrained tidak bisa bergerak hingga lolos Physique check DC 13.', 'Menggunakan seutas tali pramuka tebal untuk membelenggu tangan atau kaki lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('pramuka_paskin_move_2', 'pramuka_paskin', 'Aba-aba Menggelegar (Commanding Drill)', 'Buff / Social Move', '1 Bonus Action', '30 ft', 'Mind / Emotional', 'Semua kawan dalam radius 30 ft mendapat +2 bonus pada Saving Throw berikutnya.', 'Meneriakkan aba-aba baris berbaris dengan nada tegas yang membangkitkan fokus kawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('pramuka_paskin_move_3', 'pramuka_paskin', 'Teknik Pengintaian (Scout Surveillance)', 'Utility Move', '1 Menit', '60 ft', 'Mind / Awareness', 'Mendeteksi jumlah dan posisi semua musuh atau target di area dalam jangkauan selama 1 menit.', 'Mengamati lingkungan sekitar dengan gerakan senyap dan sistematis layaknya pengintai lapangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('pecinta_alam_move_1', 'pecinta_alam', 'Insting Survival (Wilderness Awareness)', 'Pasif / Reaksi', 'Pasif / Reaksi', 'Self', 'Mind / Awareness', 'Tidak pernah tersesat di area luar ruangan dan tidak bisa dikejutkan (Surprised) dalam bahaya mendadak.', 'Membaca arah angin, lumut pohon, dan jejak langkah kaki di tanah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('pecinta_alam_move_2', 'pecinta_alam', 'P3K Darurat Lapangan (First Aid Field Patch)', 'Heal Move', '1 Action (1x per Rest)', 'Touch', 'Otomatis', 'Memulihkan 1d8 + Mod Mind Physical HP atau Composure ke teman yang terluka.', 'Membalut luka dengan perban elastis dan memberikan air minum hangat dari termos lapangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('pecinta_alam_move_3', 'pecinta_alam', 'Panjat Penghalang (Obstacle Climb)', 'Utility Move', '1 Bonus Action', 'Self', 'Physique / Agility', 'Berhasil melewati tembok, pagar, atau rintangan tinggi tanpa check, sekali per Short Rest.', 'Teknik panjat yang sudah terlatih membuat segala dinding bukan halangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('penyiaran_move_1', 'penyiaran', 'Pengumuman Speaker Sekolah (Public Broadcast)', 'Utility / Social Move', '1 Aksi Khusus', 'Seluruh Sekolah', 'Looks / Influence', 'Menyampaikan pesan ke seluruh sekolah. Target gosip mengalami 1d8 Composure damage jika nama mereka disebut.', 'Menyalakan mixer audio dan menyiarkan informasi menggemparkan lewat speaker sekolah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('penyiaran_move_2', 'penyiaran', 'Modulasi Suara Menghanyutkan (Soothing ASMR Voice)', 'Social Move', '1 Action', '30 ft', 'Looks / Charm vs Target Mind Save', 'Target tidak bisa mengambil aksi agresif selama 1 giliran karena terpesona.', 'Berbicara dengan intonasi merdu dan menenangkan seperti penyiar podcast malam hari.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('penyiaran_move_3', 'penyiaran', 'Bocoran Intel Eksklusif (Exclusive Scoop)', 'Utility Move', '10 Menit', 'Self', 'Intelligent / Street', 'Mendapatkan 1 informasi rahasia atau rumor akurat tentang karakter atau situasi yang diinginkan dari jaringan informan.', 'Mengontak sumber rahasia di balik layar untuk mengumpulkan intel terbaru sebelum aksi.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('literatur_move_1', 'literatur', 'Surat Cinta Puitis (Lethal Love Letter)', 'Romance Move', 'Dibuat saat istirahat', 'Loker / Meja Belajar', 'Talent / Creative vs Target Mind Save', 'Target kehilangan 2d6 Composure dan Heart Meter naik +1 ♥.', 'Menyelipkan sepucuk surat wangi berhias kata-kata puitis mendalam di loker sepatu target.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('literatur_move_2', 'literatur', 'Membaca Pola Pikiran (Literary Empathy)', 'Utility Move', '1 Action', '15 ft', 'Mind / Interpersonal', 'Mengetahui satu keinginan terbesar atau rasa bersalah rahasia dari target yang sedang berbicara.', 'Menganalisis pilihan kata dan jeda napas seseorang layaknya membaca narasi tokoh novel.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('literatur_move_3', 'literatur', 'Kutipan Menghancurkan (Devastating Quote)', 'Social Attack', '1 Action', '20 ft', 'Intelligent / Academic vs Target Mind Save', 'Target kehilangan 1d8 Composure karena argumennya terbantahkan sempurna oleh kata-kata tertulis.', 'Mengutip paragraf dari buku atau tulisan sendiri yang secara tepat membungkam argumen lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('band_move_1', 'band', 'Petikan Melodi Penyelamat (Bardic Rock Riff)', 'Buff Move', '1 Bonus Action', '30 ft', 'Talent / Performance', 'Memberikan 1d6 Inspiration Die ke teman. Dadu ini dapat ditambahkan ke d20 roll berikutnya dalam 10 menit.', 'Memetik melodi gitar akustik atau bersenandung nada penyemangat yang membakar antusiasme teman.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('band_move_2', 'band', 'Distorsi Pemecah Telinga (Sonic Screech)', 'Attack / Social Move', '1 Action', '15 ft Cone', 'Physique Save DC 8+Prof+Mod Talent', '1d8 Thunder/Mental Damage ke Composure & HP fisik. Target gagal: Deafened 1 turn.', 'Mendekatkan mikrofon ke speaker monitor hingga dengkingan feedback memekakkan telinga.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('band_move_3', 'band', 'Penampilan Epik (Crowd Performance)', 'Social Move', '1 Menit', 'Area (semua yang mendengar)', 'Talent / Performance vs Target Mind Save', 'Seluruh target yang mendengar kehilangan 1d4 Composure (terpukau) atau memulihkan 1d4 Composure (terinspirasi) — DM pilih efek berdasarkan konteks.', 'Membawakan satu lagu atau penampilan musik pendek yang mempengaruhi emosi semua orang yang hadir.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('painting_move_1', 'painting', 'Sketsa Wajah Kilat (Photographic Sketch)', 'Utility Move', '1 Menit', 'Touch', 'Talent / Creative', 'Menghasilkan potret visual presisi dari seseorang atau barang bukti yang hanya sempat dilihat sekilas.', 'Menggoreskan pensil 2B di buku sketsa dengan kecepatan tangan mengagumkan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('painting_move_2', 'painting', 'Cipratan Cat Distraksi (Paint Splatter Blind)', 'Attack / Utility Move', '1 Action', '10 ft', 'Physique / Agility', 'Target Blinded selama 1 giliran hingga menyeka cat dari mata mereka.', 'Menyiramkan palet cat minyak basah tepat ke arah wajah lawan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description) VALUES ('painting_move_3', 'painting', 'Karya Provokasi (Satirical Artwork)', 'Social Move', '1 Jam (luar sesi)', 'Area Sekolah', 'Talent / Creative vs Target Looks Save', 'Karya visual yang menyindir target memicu gosip. Target kehilangan 1d4 Composure setiap kali ada murid lain melihat karya tersebut selama 1 hari.', 'Membuat karikatur atau poster satire yang dipasang diam-diam di papan pengumuman sekolah.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

-- archetype_moves
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('delinquent_move_1', 'delinquent', 'Tatapan Intimidasi (Killer Glare)', 'Social Attack', '1 Action', '15 ft', 'Looks / Aura vs Target Mind Save', 'Target kehilangan 1d6 Composure dan Disadvantage pada serangan pertama mereka di ronde ini.', 'Memandang tajam dengan tatapan dingin tanpa kedip yang membuat nyali lawan ciut seketika.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('delinquent_move_2', 'delinquent', 'Gertakan Berandalan (Street Threat)', 'Social Move', 'Bonus Action', '30 ft', 'Physique / Power vs Target Mind Save', 'Target harus Wisdom Save atau tidak berani mendekat dalam jarak 10 ft selama 1 giliran.', 'Mengepalkan tangan dan berdiri tegak dengan ekspresi sangar yang tak terbantahkan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('delinquent_move_3', 'delinquent', 'Backing Geng (Street Crew)', 'Utility Move', '1x per Long Rest', 'Self', 'Intelligent / Street', 'Memanggil bantuan 1–2 NPC pendukung netral untuk membantu situasi konflik atau mencari info jalanan.', 'Menghubungi kenalan geng lama via SMS untuk meminta backup atau bantuan jalanan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('jock_move_1', 'jock', 'Lompatan Adrenalin (Adrenaline Rush)', 'Bonus Action', 'Bonus Action (1x per Short Rest)', 'Self', 'Otomatis', 'Pulihkan 1d8 Physical HP secara instan. Berlaku saat Physical HP di bawah setengah maksimal.', 'Memompa semangat juang dari dalam dada saat melihat temannya dalam bahaya.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('jock_move_2', 'jock', 'Gaya Olahraga Memikat (Sporty Charisma)', 'Social Move', 'Pasif (Setelah olahraga)', '30 ft', 'Looks / Influence', 'Setelah melakukan aksi fisik, seluruh orang yang melihat memberikan reaksi positif. Advantage pada Looks checks selama 10 menit berikutnya.', 'Keringat bercucuran, napas terengah, dan tatapan bersinar — kombinasi yang tidak ada yang bisa tahan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('jock_move_3', 'jock', 'Teriakan Bakar Semangat (Hype Shout)', 'Buff Move', '1 Action (1x per Long Rest)', '30 ft (Seluruh Tim)', 'Physique / Stamina', 'Seluruh sekutu dalam jangkauan mendapat Advantage pada Physical Saving Throw dan Attack selama 2 giliran.', 'Berteriak lantang menyemangati seluruh tim dengan teriakan penuh energi layaknya kapten olahraga.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('nerd_move_1', 'nerd', 'Analisis Cepat (Quick Analysis)', 'Bonus Action', 'Bonus Action', 'Self / 30 ft', 'Intelligent / Academic', 'Mengidentifikasi kelemahan mekanik atau pola perilaku target. Serangan berikutmu ke target mendapat Advantage.', 'Mengamati situasi dalam hitungan detik dan langsung menghitung kemungkinan terbaik untuk bertindak.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('nerd_move_2', 'nerd', 'Presentasi Fakta (Fact Check)', 'Social Attack', '1 Action', '20 ft', 'Intelligent / People vs Target Intelligent Save', 'Target kehilangan 1d6 Composure karena argumennya terbantahkan dengan data dan fakta akurat.', 'Mengutarakan fakta dan data yang membantah pernyataan lawan secara sistematis dan akurat.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('nerd_move_3', 'nerd', 'Memori Fotografis (Eidetic Memory)', 'Utility Move', 'Pasif', 'Self', 'Otomatis', 'Bisa mengingat dan mereproduksi secara akurat apapun yang pernah dibaca atau dilihat dalam 24 jam terakhir tanpa roll check.', 'Memori luar biasa yang memungkinkan memanggil kembali informasi apapun kapan saja dibutuhkan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('class_clown_move_1', 'class_clown', 'Lelucon Pengalih Perhatian (Distraction Prank)', 'Utility Move', 'Bonus Action', '30 ft', 'Talent / Performance vs Target Mind Save', '1 target Distracted (Disadvantage pada check Perception) selama 1 giliran. Sekutu mendapat Advantage untuk beraksi di dekat target.', 'Melempar lelucon atau melakukan aksi konyol yang memaksa semua perhatian tertuju ke sana.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('class_clown_move_2', 'class_clown', 'Humor Penstabil (Tension Breaker)', 'Heal Move', '1 Action (1x per Short Rest)', '30 ft', 'Talent / Adaptability', 'Memulihkan 1d6 Composure ke seluruh sekutu dalam jangkauan yang sedang stress.', 'Melempar candaan tepat waktu saat suasana paling tegang untuk memecah atmosfer yang membeku.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('class_clown_move_3', 'class_clown', 'Peniruan Sempurna (Perfect Impression)', 'Social Move', '1 Action', '15 ft', 'Talent / Performance vs Target Mind Save', 'Menirukan gaya bicara atau behavior orang tertentu dengan sempurna. Target kehilangan 1d4 Composure karena malu atau marah.', 'Menirukan cara berbicara dan bergerak seseorang dengan presisi komedi yang menyentil ego target.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('emo_move_1', 'emo', 'Keheningan Menghantui (Eerie Silence)', 'Social Attack', '1 Action', '15 ft', 'Mind / Emotional vs Target Mind Save', 'Target kehilangan 1d6 Composure karena tidak nyaman dengan sikap acuhmu yang dingin dan tidak terduga.', 'Diam total. Tidak berkata apapun. Tidak bereaksi apapun. Dan itu justru jauh lebih mengancam dari kata-kata manapun.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('emo_move_2', 'emo', 'Introspeksi Diam (Silent Contemplation)', 'Utility Move', '10 Menit istirahat', 'Self', 'Mind / Emotional', 'Memulihkan 1d8 Composure dan mendapat Advantage pada Mind Saving Throws selama 1 jam berikutnya.', 'Duduk di sudut jendela dengan headphone, menutup diri sejenak dari dunia untuk meregenerasi ketenangan batin.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('emo_move_3', 'emo', 'Kata Tajam Terakhir (Cutting Remark)', 'Social Attack', 'Reaction', '15 ft', 'Intelligent / People vs Target Mind Save', 'Sebagai reaksi terhadap serangan sosial yang diterima: balikkan 1d4 Composure damage ke penyerang.', 'Satu kalimat singkat, dingin, dan tepat sasaran yang merongrong kepercayaan diri lawan lebih efektif dari pidato panjang.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('weeb_move_1', 'weeb', 'Teknik Rahasia Chuunibyou (Secret Technique)', 'Attack Move', '1 Action', '15 ft', 'Talent / Performance vs Target Mind Save', '1d8 Composure damage. Jika kamu berpose dramatis sambil menyebutkan nama teknik, damage meningkat jadi 1d10.', 'Memostur dramatis dan berteriak nama teknik rahasia imajinatif yang anehnya bekerja karena keyakinan kuat.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('weeb_move_2', 'weeb', 'Referensi Tersembunyi (Hidden Reference)', 'Utility Move', 'Bonus Action', 'Self', 'Talent / Creative', 'Mendapat Advantage pada 1 check sosial atau kreatif berikutnya dengan mengaitkannya ke referensi anime/manga yang relevan.', 'Mengutip dialog atau strategi dari anime favorit yang ternyata benar-benar berlaku di situasi nyata ini.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('weeb_move_3', 'weeb', 'Keberuntungan Flag Asmara (Lucky Romance Flag)', 'Utility Move', '1x per Long Rest', 'Self', 'Luck / Relationship Luck', 'Reroll satu d20 roll apapun dengan mengambil hasil yang lebih tinggi. Berlaku untuk check asmara atau sosial.', 'Saat yakin bahwa ''ini pasti flag romance!'', keberuntungan anime benar-benar berpihak padamu.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('popular_kids_move_1', 'popular_kids', 'Senyum Menawan (Charming Smile)', 'Social Attack', '1 Action', '10 ft', 'Looks / Charm vs Target Mind Save', '1d6 Composure damage. Target Distracted (Disadvantage pada aksi berikutnya) karena tidak bisa fokus saat melihatmu.', 'Senyum manis yang memancarkan pesona alami, cukup untuk melumpuhkan konsentrasi siapa saja.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('popular_kids_move_2', 'popular_kids', 'Pengaruh Sosial Media (Trendsetter Post)', 'Utility Move', '1x per Long Rest', 'Area Sekolah', 'Looks / Influence', 'Mempengaruhi opini umum sekolah soal satu topik/target. Target dipandang positif atau negatif oleh mayoritas murid selama 1 hari.', 'Memposting konten strategis di media sosial sekolah yang langsung mempengaruhi pandangan publik.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('popular_kids_move_3', 'popular_kids', 'Koneksi VIP (Name-Drop)', 'Social Utility', 'Reaction', '30 ft', 'Looks / Influence', 'Batalkan satu tindakan negatif yang diarahkan kepadamu atau temanmu dengan menyebut nama orang berpengaruh di sekolah.', 'Menyebut nama guru favorit, ketua OSIS, atau orang tua berpengaruh yang langsung membuat situasi berbalik.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('normies_move_1', 'normies', 'Membaur Sempurna (Blend In)', 'Utility Move', 'Bonus Action', 'Self', 'Mind / Awareness', 'Menjadi tidak menonjol di kerumunan. Musuh yang mencari kamu harus Passive Perception DC 15 untuk menemukanmu.', 'Menyesuaikan gaya berjalan, ekspresi, dan pakaian agar tampak seperti murid biasa yang tak menarik perhatian.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('normies_move_2', 'normies', 'Simpati Universal (Everybody''s Friend)', 'Social Utility', '1 Action', '15 ft', 'Mind / Interpersonal', 'Meredakan konflik antara 2 pihak yang berselisih. Kedua pihak harus berunding damai selama minimal 1 giliran.', 'Dengan ketulusan dan pendekatan kalem, menjadi jembatan damai yang diterima oleh semua kalangan.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;
INSERT INTO public.archetype_moves (id, archetype_id, name, move_type, cost, range, check_type, effect, description) VALUES ('normies_move_3', 'normies', 'Hoki Murni (Pure Luck)', 'Utility Move', '1x per Long Rest', 'Self', 'Luck / Situation Luck', 'Pilih 1 kejadian buruk yang baru saja terjadi dan batalkan (revert) hasilnya — ''kebetulan'' semua berjalan baik.', 'Kadang keberuntungan bukan soal skill atau rencana — hanya soal timing dan kebetulan yang menyelamatkan segalanya.') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- START FILE: 20261007000009_add_new_ekskul.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- Migration: 20261007000009_add_new_ekskul.sql
-- Description: Menambahkan 4 Ekskul Baru (Photography, Cooking, Occult, Gaming)
--              secara idempoten (ON CONFLICT DO UPDATE) untuk menyelaraskan
--              ruangan denah sekolah dengan backend Compendium TRPG.
-- ============================================================================

-- 1. EKSKUL (CLASSES)
-- Photography Club
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description)
VALUES (
  'photography',
  'Photography (Klub Fotografi)',
  'Lensa Telefoto, Sudut Pandang Rahasia & Momen Emas Tak Terlupakan',
  'd6',
  'Intelligent / Talent',
  ARRAY['intelligent', 'talent']::TEXT[],
  'Kunci akses ruang gelap cuci foto, kamera DSLR/mirrorless pinjaman sekolah, kartu pers fotografer sekolah, dan sudut pandang tajam menangkap momen rahasia murid lain.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  hit_die = EXCLUDED.hit_die,
  primary_stat = EXCLUDED.primary_stat,
  saving_throws = EXCLUDED.saving_throws,
  perk_description = EXCLUDED.perk_description;

-- Cooking Club
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description)
VALUES (
  'cooking',
  'Cooking (Klub Memasak & Kuliner)',
  'Aroma Bento Hangat, Manisnya Cokelat Cinta & Rasa yang Memikat Hati',
  'd8',
  'Intelligent / Looks',
  ARRAY['intelligent', 'looks']::TEXT[],
  'Kunci akses ruang dapur sekolah (Home Ec) berfasilitas lengkap, celemek khusus, pisau dapur tajam, bumbu rempah rahasia, serta kemampuan membuat hidangan yang meluluhkan hati siapapun.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  hit_die = EXCLUDED.hit_die,
  primary_stat = EXCLUDED.primary_stat,
  saving_throws = EXCLUDED.saving_throws,
  perk_description = EXCLUDED.perk_description;

-- Occult Club
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description)
VALUES (
  'occult',
  'Occult (Klub Okultisme & Misteri Gaib)',
  'Kartu Tarot Takdir, Lilin Hitam Aromaterapi & Misteri Tujuh Keajaiban Sekolah',
  'd6',
  'Mind / Luck',
  ARRAY['mind', 'luck']::TEXT[],
  'Ruang klub temaram di lantai 1 dengan aroma dupa mistis, set kartu tarot kuno, bola kristal, papan ouija, dan kepekaan luar biasa membaca firasat takdir serta legenda urban sekolah.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  hit_die = EXCLUDED.hit_die,
  primary_stat = EXCLUDED.primary_stat,
  saving_throws = EXCLUDED.saving_throws,
  perk_description = EXCLUDED.perk_description;

-- Gaming Club
INSERT INTO public.ekskul (id, name, tagline, hit_die, primary_stat, saving_throws, perk_description)
VALUES (
  'gaming',
  'Gaming (Klub Video Game & Esports)',
  'Refleks Tombol Kilat, Analisis Frame Data & Strategi Kemenangan Tanpa Cela',
  'd8',
  'Intelligent / Talent',
  ARRAY['intelligent', 'talent']::TEXT[],
  'Ruang klub penuh konsol retro dan monitor gaming refresh-rate tinggi, game portabel di saku, kelenturan refleks jari, dan ketajaman menganalisis pola perilaku lawan.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  hit_die = EXCLUDED.hit_die,
  primary_stat = EXCLUDED.primary_stat,
  saving_throws = EXCLUDED.saving_throws,
  perk_description = EXCLUDED.perk_description;


-- 2. EKSKUL SUBCLASSES (2 PER KLUB)
-- Photography Subclasses
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('paparazzi', 'photography', 'Fotografer Investigasi / Paparazzi', 'Spesialis foto sembunyi-sembunyi. Advantage pada check saat mengambil foto atau mengamati target tanpa disadari.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('portraitist', 'photography', 'Fotografer Artistik / Potret', 'Spesialis potret estetika dan menangkap emosi wajah. Foto potret yang kamu berikan ke teman memulihkan 1d4 Composure atau menambah +1 Heart Meter.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Cooking Subclasses
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('patissier', 'cooking', 'Pâtissier / Pembuat Manisan & Cokelat', 'Spesialis kue dan hidangan penutup romantis. Cokelat atau kue buatan sendiri memberikan bonus +2 pada Social Check romansa.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('gourmet_chef', 'cooking', 'Koki Masakan Hangat / Bento Master', 'Spesialis nutrisi dan stamina. Masakanmu memulihkan ekstra HP saat istirahat dan menangkal kelelahan.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Occult Subclasses
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('tarot_reader', 'occult', 'Peramal Nasib / Tarot Diviner', 'Spesialis membaca kartu masa depan dan ramalan asmara. Sekali per istirahat, dapat meramal takdir seseorang untuk memberikan Advantage pada aksi penting.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('paranormal_investigator', 'occult', 'Peneliti Tujuh Misteri Sekolah', 'Spesialis kutukan dan atmosfer horor. Kebal terhadap rasa takut/Intimidasi lawan dan peka terhadap rahasia masa lalu sekolah.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Gaming Subclasses
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('fighting_gamer', 'gaming', 'Master Game Pertarungan / FGC Pro', 'Spesialis refleks kilat dan combo. Mendapatkan Advantage pada check inisiatif reaksi cepat.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, description)
VALUES ('strategist', 'gaming', 'Ahli Strategi & RPG / Theorycrafter', 'Spesialis kalkulasi pola dan resource. Bisa memprediksi pergerakan lawan 1 giliran ke depan.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;


-- 3. EKSKUL MOVES (3 PER KLUB)
-- Photography Moves
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'photography_move_1',
  'photography',
  'Jepretan Kilat Flash (Flash Stun)',
  'Attack / Combat Move',
  '1 Action',
  '15 ft',
  'Intelligent / Academic vs Target Mind Save',
  'Target mengalami 1d4 Composure damage dan terkena status Disadvantage pada aksi berikutnya karena silau.',
  'Menodongkan lampu kilat kamera tepat ke wajah lawan lalu menekan tombol shutter seketika.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'photography_move_2',
  'photography',
  'Bukti Foto Kompromatis (Compromising Photo)',
  'Social Move',
  '1 Action',
  '30 ft',
  'Intelligent / Street vs Target Mind Save',
  'Target kehilangan 1d8 Composure dan ragu melanjutkan perdebatan karena rahasianya terancam terekspos.',
  'Memamerkan hasil jepretan candid di layar kamera yang membuat lawan gelagapan dan salah tingkah.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'photography_move_3',
  'photography',
  'Membekukan Momen (Candid Shutter)',
  'Utility / Romance',
  '1 Bonus Action',
  '30 ft',
  'Talent / Creative',
  'Menangkap ekspresi jujur atau kelemahan target dari jauh. Sekutu mendapat Advantage pada check sosial atau romansa berikutnya terhadap target tersebut.',
  'Membidik lensa telefoto secara tenang di waktu yang tepat saat target sedang melamun atau tidak waspada.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

-- Cooking Moves
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'cooking_move_1',
  'cooking',
  'Bento Kasih Sayang (Handmade Bento)',
  'Utility / Romance',
  'Dibuat saat istirahat',
  'Touch',
  'Intelligent / Academic atau Looks / Charm',
  'Target yang memakan bento memulihkan 1d8 HP fisik / Composure dan Heart Meter bertambah +1 ♥ jika diberikan kepada target gebetan.',
  'Menyusun nasi kepal, tamagoyaki manis, dan sosis gurita lucu dengan sepenuh perasaan hati.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'cooking_move_2',
  'cooking',
  'Aroma Penggugah Selera (Irresistible Aroma)',
  'Social Move',
  '1 Action',
  '30 ft',
  'Looks / Charm vs Target Mind Save',
  'Mengalihkan perhatian semua target lapar di sekitar; target terdistraksi dan tidak bisa mengambil aksi agresif selama 1 giliran.',
  'Membuka tutup wadah makanan hangat yang aromanya langsung menguasai seluruh lorong kelas.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'cooking_move_3',
  'cooking',
  'Camilan Penambah Tenaga (Snack Energy Boost)',
  'Buff Move',
  '1 Bonus Action',
  'Touch',
  'Otomatis',
  'Menyuapkan kue kering atau camilan energi darurat ke sekutu. Sekutu memulihkan 1d4 Composure dan mendapat Advantage pada Saving Throw berikutnya.',
  'Menyelipkan sepotong kue kering manis buatan sendiri saat teman sedang kehabisan energi atau putus asa.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

-- Occult Moves
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'occult_move_1',
  'occult',
  'Ramalan Kartu Tarot (Tarot Reading)',
  'Utility / Buff',
  '1 Action',
  '15 ft',
  'Mind / Awareness vs DC 12',
  'Hasil sukses memberikan 1d6 Fated Die yang dapat ditambahkan ke d20 roll apapun milik sekutu dalam sesi ini.',
  'Membuka kartu tarot bergambar Wheel of Fortune atau Lovers dengan tatapan mata misterius.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'occult_move_2',
  'occult',
  'Aura Kutukan Menyeramkan (Eerie Curse)',
  'Social Attack',
  '1 Action',
  '30 ft',
  'Mind / Emotional vs Target Mind Save',
  'Target kehilangan 1d8 Composure dan merasa dihantui nasib buruk (Disadvantage pada 1 roll berikutnya).',
  'Mengarahkan jimat atau lilin menyala ke arah target sambil melafalkan bisikan misterius yang membuat bulu kuduk merinding.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'occult_move_3',
  'occult',
  'Kertas Jimat Pengusir Kesialan (Purifying Ward)',
  'Reaction / Defense',
  '1 Reaction',
  'Self / 15 ft',
  'Luck / Situation Luck',
  'Menempelkan kertas jimat penangkal bala untuk membatalkan kegagalan kritis atau menyerap 1d6 damage mental/sosial yang menyerang kawan.',
  'Mengibaskan kertas ofuda bertuliskan aksara kanji kuno tepat saat malapetaka hendak terjadi.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

-- Gaming Moves
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'gaming_move_1',
  'gaming',
  'Tangkisan Frame Sempurna (Frame Perfect Parry)',
  'Reaction',
  '1 Reaction',
  'Self',
  'Physique / Agility vs Attack',
  'Menghitung timing serangan lawan dengan presisi frame. Mengurangi damage serangan fisik/sosial yang masuk sebesar 1d8 + Mod Agility.',
  'Mengelak atau menepis serangan pada sepersekian detik terakhir layaknya mengeksekusi just-frame parry di turnamen.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'gaming_move_2',
  'gaming',
  'Provokasi Tombol Taunt (Taunt to Tilt)',
  'Social Attack',
  '1 Bonus Action',
  '30 ft',
  'Talent / Performance vs Target Mind Save',
  'Meniru pose taunt game yang menyebalkan. Target mengalami 1d6 Composure damage dan terprovokasi (harus mengarahkan serangan ke dirimu di giliran berikutnya).',
  'Melakukan gerakan jempol ke bawah atau t-bag virtual yang langsung memancing emosi ("tilt") lawan.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;

INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description)
VALUES (
  'gaming_move_3',
  'gaming',
  'Rute Cepat Speedrun (Speedrun Routing)',
  'Utility Move',
  '1 Action',
  'Self / Sekutu',
  'Intelligent / Academic',
  'Menemukan celah atau rute tercepat melewati rintangan / teka-teki sekolah dalam separuh waktu normal tanpa memicu jebakan.',
  'Membedah denah dan aturan sekolah seperti mencari sequence break dan glitch jalur tercepat.'
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, move_type = EXCLUDED.move_type, cost = EXCLUDED.cost, range = EXCLUDED.range, check_type = EXCLUDED.check_type, effect = EXCLUDED.effect, description = EXCLUDED.description;


-- 4. EQUIPMENT PACKS (LAYER 3)
INSERT INTO public.equipment_packs (id, name, category, items)
VALUES (
  'club_photography',
  'Perlengkapan Klub: PHOTOGRAPHY',
  'club',
  ARRAY['Kamera Digital Lensa Telefoto', 'Lampu Kilat (Flash Portable)', 'Album Foto Polaroid Mini']::TEXT[]
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;

INSERT INTO public.equipment_packs (id, name, category, items)
VALUES (
  'club_cooking',
  'Perlengkapan Klub: COOKING',
  'club',
  ARRAY['Kotak Bento Bertingkat Cantik', 'Set Pisau Dapur & Celemek Khusus', 'Botol Bumbu Rahasia']::TEXT[]
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;

INSERT INTO public.equipment_packs (id, name, category, items)
VALUES (
  'club_occult',
  'Perlengkapan Klub: OCCULT',
  'club',
  ARRAY['Set Kartu Tarot Antik', 'Lilin Ungu Mistis & Dupa Aromaterapi', 'Jimat Kertas Pelindung (Ofuda)']::TEXT[]
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;

INSERT INTO public.equipment_packs (id, name, category, items)
VALUES (
  'club_gaming',
  'Perlengkapan Klub: GAMING',
  'club',
  ARRAY['Konsol Game Portabel & Charger', 'Arcade Controller / Gamepad Khusus', 'Minuman Energi Kaleng']::TEXT[]
)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, items = EXCLUDED.items;
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
