-- ============================================================================
-- Migration: 20261008000001_subclass_moves_and_progression.sql
-- Description: Menambahkan struktur Subclass Moves (G11, G12) dan kolom progresi kelas
-- ============================================================================

-- 1. Alter characters table for progression tracking
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS grade INT DEFAULT 10;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS schema_version INT DEFAULT 2;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS changelog JSONB DEFAULT '[]'::jsonb;

-- 2. Alter ekskul_moves for order and unlock grade
ALTER TABLE public.ekskul_moves ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 1;
ALTER TABLE public.ekskul_moves ADD COLUMN IF NOT EXISTS unlock_grade INT DEFAULT 10;

-- 3. Alter ekskul_subclasses for tagline and identity_desc
ALTER TABLE public.ekskul_subclasses ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.ekskul_subclasses ADD COLUMN IF NOT EXISTS identity_desc TEXT;

-- 4. Create subclass_moves table
CREATE TABLE IF NOT EXISTS public.subclass_moves (
  id TEXT PRIMARY KEY,
  subclass_id TEXT NOT NULL REFERENCES public.ekskul_subclasses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL, -- 'G11' | 'G12'
  unlock_grade INT NOT NULL, -- 11 | 12
  move_type TEXT NOT NULL,
  cost TEXT NOT NULL,
  range TEXT,
  check_type TEXT,
  effect TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE public.subclass_moves ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read subclass_moves" ON public.subclass_moves;
CREATE POLICY "Allow public read subclass_moves" ON public.subclass_moves FOR SELECT USING (true);

-- 5. Seed / Upsert Ekskul Moves with progression order & unlock grade
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('student_council_move_1', 'student_council', 'Perintah Kedisiplinan (Disciplinary Order)', 'Social Attack / Combat', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Mind Save (DC 8+PB+Looks)', 'Dipicu setelah serangan mendarat. Target gagal: +1d6 Composure damage dan terkena status Shaken 1 ronde.', 'Menegur target dengan suara tegas berwibawa khas OSIS saat menertibkan pelanggaran.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('student_council_move_2', 'student_council', 'Birokrasi & Wewenang (Executive Privilege)', 'Utility / Bureaucracy', '1x per School Day (Long Rest)', 'Self / Touch', 'Otomatis', 'Mendapatkan dispensasi resmi tanpa roll: surat jalan, akses ruangan terkunci/ber-AC, atau pembatalan razia untuk diri dan 1 teman.', 'Menunjukkan kartu identitas OSIS atau surat mandat dinas resmi kepala sekolah.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('student_council_move_3', 'student_council', 'Koneksi Pihak Sekolah (Faculty Protection)', 'Reaction / Leadership', '1 Reaction (PBx per Long Rest)', '30 ft', 'Otomatis', 'Batalkan status emosional negatif (Salting/Fluster/Shaken) pada sekutu dalam 30 ft; sekutu memulihkan 1d6 + Mod Intelligent Composure.', 'Intervensi wibawa pengurus inti OSIS yang memulihkan ketegaran mental rekan satu tim.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('kendo_move_1', 'kendo', 'Tebasan Shinai: Men! (Head Slash)', 'Attack Move', '1 Action', 'Melee (5 ft)', 'Physique Attack', '1d8 + Mod Physique Bludgeoning. Jika Critical Hit (Natural 19-20 untuk Men-Striker / Nat 20 normal): target terkena status Dazed 1 ronde.', 'Pukulan vertikal terarah ke arah kepala lawan dengan hentakan langkah kaki dan kiai menggelegar.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('kendo_move_2', 'kendo', 'Tangkisan Sempurna (Kendo Parry)', 'Reaction Defense', '1 Reaction (PBx per Short Rest)', 'Self', '+2 Physical AC', 'Menambah +2 Physical AC secara instan terhadap 1 serangan fisik jarak dekat yang terlihat.', 'Mengayunkan pedang bambu membentuk sudut tangkisan tajam membelokkan serangan lawan.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('kendo_move_3', 'kendo', 'Kiai: Teriakan Semangat (Kiai Shout)', 'Bonus Action Buff', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Mind / Emotional', 'Dirimu dan 1 sekutu mendapat Advantage pada serangan fisik berikutnya di ronde ini.', 'Melepas teriakan kiai penuh konsentrasi batin yang membakar semangat tempur.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('martial_arts_move_2', 'martial_arts', 'Pukulan Cepat Kombo (Rapid Flurry)', 'Bonus Action Attack', '1 Bonus Action', 'Melee (5 ft)', 'Physique / Agility', '1d4 + Mod Physique Physical Damage tambahan setelah serangan utama mendarat.', 'Kombinasi pukulan cepat tanpa jeda menyasar ulu hati lawan.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('martial_arts_move_1', 'martial_arts', 'Bantingan Matras (Seoi-Nage Takedown)', 'Attack Move', '1 Action', 'Melee (5 ft)', 'Target Physique Save (DC 8+PB+Physique)', '1d6 + Mod Physique Bludgeoning. Target terjatuh dalam kondisi Prone (terkapar di lantai).', 'Menarik kerah atau lengan lawan, memutar pinggul, dan membantingnya keras ke lantai.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('martial_arts_move_3', 'martial_arts', 'Kunci Sendi (Joint Lock)', 'Control Move', '1 Action', 'Melee (5 ft)', 'Target Physique Save (DC 8+PB+Physique)', 'Target menderita kondisi Restrained. Di awal tiap gilirannya, target boleh mengulang Physique Save untuk melepaskan diri.', 'Memutar pergelangan atau siku lawan ke sudut anatomis yang melumpuhkan gerakan total.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('sports_move_1', 'sports', 'Terobosan Kilat (Fast Break Sprint)', 'Bonus Action Movement', '1 Bonus Action (PBx per Short Rest)', 'Self', 'Otomatis', 'Menggandakan kecepatan gerak (Dash) dan kebal Opportunity Attack saat melewati lawan di ronde ini.', 'Manuver lari cepat zig-zag menembus celah kerumunan layaknya mengejar bola lepas.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('sports_move_2', 'sports', 'Lemparan Bola Akurat (Precision Throw)', 'Ranged Attack Move', '1 Action', '20 / 60 ft', 'Physique / Agility', '1d6 + Mod Physique Bludgeoning. Jika kena, bola memantul 10 ft: pemain bisa gunakan 1 Reaction untuk sprint memungut kembali bola tersebut.', 'Melempar bola olahraga dengan presisi tinggi lalu langsung bersiap menjemput bola pantul.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('sports_move_3', 'sports', 'Sorak Penyemangat (Rally Cheer)', 'Buff Move', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Looks / Influence', 'Satu kawan memulihkan 1d4 Physical HP dan mendapat Advantage pada satu lemparan dadu fisik berikutnya.', 'Berteriak penuh semangat ke arah kawan yang tertekan untuk memacu adrenalin mereka.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('drama_move_1', 'drama', 'Air Mata Buatan (Fake Tears / Pity)', 'Social Move', '1 Action (PBx per Short Rest)', '15 ft', 'Charm Check vs Mind Save (DC 8+PB+Looks)', 'Target terkena kondisi Pity (Disadvantage serang pengguna, pengguna Advantage ke target). Efek hilang jika pengguna menyerang target.', 'Meneteskan air mata pura-pura sambil menggigit bibir, membalikkan simpati seketika.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('drama_move_2', 'drama', 'Persona Penyamaran (Method Acting)', 'Utility Move', '10 Menit Persiapan (At-Will)', 'Self', 'Talent / Adaptability', 'Advantage pada seluruh check People & Street saat menyamar sebagai profil murid lain.', 'Merombak gaya bicara, cara jalan, dan dandanan untuk berpura-pura jadi karakter lain.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('drama_move_3', 'drama', 'Monolog Dramatis (Grand Speech)', 'Area Social Attack', '1 Action (1x per Short Rest)', 'Area 30 ft', 'Talent / Performance vs Mind Save', 'Seluruh musuh dalam 30 ft kehilangan 1d4 Composure; kawan mendapat Advantage pada Social Saves selama 1 ronde.', 'Berpidato teatrikal penuh penghayatan puitis yang menusuk perasaan siapa saja yang mendengar.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('kir_osn_move_1', 'kir_osn', 'Analisis Titik Lemah (Analytical Deduction)', 'Tactical Combat Move', '1 Bonus Action', '30 ft', 'Intelligent / Academic', 'Ketahui 1 stat tertinggi dan 1 kelemahan target; serangan kawan berikutnya ke target mendapat Advantage.', 'Mengamati postur dan kebiasaan lawan lewat perhitungan matematis untuk menemukan celah pertahanan.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('kir_osn_move_2', 'kir_osn', 'Vial Reaksi Kimia: Poof & Boom! (Chemical Vials)', 'Chemical Flask Move', '1 Action (PB + Mod INT slot vial per Long Rest)', '20 ft', 'Physique/Mind Save (DC 8+PB+INT)', 'Pilih Poof (kabut asap radius 10 ft, 2 ronde) atau Boom (1d6 Thunder damage & terdorong 5 ft). Level tinggi membuka Kablam/Korosif.', 'Melemparkan tabung reaksi kimia darurat saku yang menghasilkan reaksi ledakan asap atau kejut.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('kir_osn_move_3', 'kir_osn', 'Formula Konsentrasi (Study Buff)', 'Utility Buff', '10 Menit Persiapan', 'Touch', 'Intelligent / Academic', 'Target mendapat Advantage pada 1 check Intelligent atau Talent berikutnya dalam rentang waktu 1 jam.', 'Menyusun peta konsep atau ringkasan materi kilat ilmiah agar daya nalar otak melonjak tajam.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('pramuka_paskin_move_1', 'pramuka_paskin', 'Kuncian Tali Pramuka (Rope Restrain)', 'Combat Control Move', '1 Action (Membawa PB Tali)', 'Melee (5 ft)', 'Target Agility Save (DC 8+PB+Physique)', 'Target menderita status Restrained. Tali memiliki HP = 5 + (2x Level) dan dapat dipotong jika menerima damage melebihi HP-nya.', 'Menggunakan seutas tali pramuka tebal untuk membelenggu tangan atau kaki lawan dalam sekejap.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('pramuka_paskin_move_2', 'pramuka_paskin', 'Aba-aba Menggelegar (Commanding Drill)', 'Reaction Team Buff', '1 Reaction (PBx per Long Rest)', '30 ft', 'Mind / Emotional', 'Dipicu saat sekutu hendak melempar Saving Throw: sekutu menerima bonus +PB (atau +1d4) pada hasil lemparannya.', 'Meneriakkan instruksi komando baris berbaris tepat waktu yang membangkitkan fokus kawan.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('pramuka_paskin_move_3', 'pramuka_paskin', 'Teknik Pengintaian (Scout Surveillance)', 'Tactical Utility', '1 Menit (1x per Short Rest)', '60 ft', 'Mind / Awareness', 'Mendeteksi secara tepat jumlah personel, rute patroli, dan posisi musuh di area sekitar selama 1 menit.', 'Mengamati lingkungan sekitar dengan gerakan senyap dan sistematis layaknya pengintai lapangan.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('pecinta_alam_move_1', 'pecinta_alam', 'Insting Survival (Wilderness Awareness)', 'Passive Defense & Navigation', 'Pasif / Free Action', 'Self', 'Mind / Awareness', 'Karakter tidak pernah tersesat di luar ruangan + otomatis mendapat Advantage pada navigasi/cuaca, serta kebal kondisi Surprised di alam bebas.', 'Membaca arah angin, lumut pohon, dan jejak tanah di sekitar lokasi.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('pecinta_alam_move_3', 'pecinta_alam', 'Panjat Penghalang (Obstacle Climb)', 'Mobility Utility', '1 Bonus Action (PBx per Short Rest)', 'Self', 'Otomatis', 'Berhasil melewati pagar atau dinding tinggi tanpa perlu melempar dadu.', 'Menggunakan teknik panjat tebing lincah untuk melompati tembok atau pagar pembatas.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('pecinta_alam_move_2', 'pecinta_alam', 'P3K Darurat Lapangan (First Aid Field Patch)', 'Healing Move', '1 Action (1x per Short Rest)', 'Touch', 'Otomatis', 'Memulihkan 1d8 + Mod Mind Physical HP atau Composure kepada teman yang terluka.', 'Membalut luka dengan perban elastis dan memberikan air minum hangat dari termos lapangan.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('penyiaran_move_2', 'penyiaran', 'Modulasi Suara Menghanyutkan (Soothing Voice)', 'Social Move', '1 Action (PBx per Short Rest)', '30 ft', 'Looks / Charm vs Target Mind Save', 'Target terpesona dan tidak dapat melancarkan tindakan agresif selama 1 giliran.', 'Berbicara dengan intonasi merdu dan frekuensi hangat yang meredakan emosi agresif pendengar.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('penyiaran_move_3', 'penyiaran', 'Damstagram Scoop / Riset Medsos (Exclusive Scoop)', 'Information Gathering', '10 Menit Riset HP (At-Will, 1x per target)', 'Self', 'Intelligent / Street (DC 12)', 'Mendapatkan 1 informasi rahasia atau rumor akurat tentang karakter dari akun gosip sekolah Damstagram.', 'Menggali riwayat postingan, tag foto, dan rumor di medsos sekolah lewat smartphone.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('penyiaran_move_1', 'penyiaran', 'Suara Gelombang Seishun (Schoolwide Broadcast)', 'Schoolwide Social Attack / Buff', '1 Aksi Khusus (1x per Long Rest)', 'Megaphone / Speaker Sekolah', 'Looks / Influence', 'Siaran langsung: pesan positif memulihkan 1d6 Composure ke kawan; pesan negatif memberi 1d6 Composure damage ke target. Di ruang mixer sentral: naik jadi 2d6!', 'Menyalakan mixer sentral sekolah dan menyiarkan pesan mengguncang ke seluruh penjuru kelas.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('literatur_move_2', 'literatur', 'Membaca Pola Pikiran (Literary Empathy)', 'Psychological Insight', '1 Action (At-Will)', '15 ft', 'Mind / Interpersonal', 'Mengetahui satu keinginan terbesar atau rasa bersalah rahasia dari target yang sedang diajak bicara.', 'Menganalisis diksi kata dan intonasi lawan bicara layaknya membaca sudut pandang tokoh novel.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('literatur_move_3', 'literatur', 'Kutipan Menghancurkan (Devastating Quote)', 'Social Reaction Attack', '1 Reaction / 1 Action (PBx per Short Rest)', '30 ft', 'Auto-hit vs yang mendengar', 'Target menderita 1d4 + Mod Intelligent Composure Damage dan Disadvantage pada lemparan dadu berikutnya.', 'Mengutip bait sastra atau filsafat yang secara telak membantah argumen congkak lawan.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('literatur_move_1', 'literatur', 'Surat Cinta Puitis (Lethal Love Letter)', 'Romance Move', 'Dibuat saat Rest (1x per Long Rest)', 'Loker Sepatu', 'Talent / Creative vs Target Mind Save', 'Target kehilangan 2d6 Composure (syok kasmaran) dan Heart Meter gebetan naik +1 ♥.', 'Menyelipkan sepucuk surat wangi berhias kata-kata puitis mendalam di loker sepatu gebetan.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('band_move_1', 'band', 'Petikan Melodi Penyelamat (Bardic Rock Riff)', 'Buff Move', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Talent / Performance', 'Memberikan 1d6 Inspiration Die ke kawan (dapat ditambahkan ke d20 roll berikutnya dalam 10 menit).', 'Memetik melodi gitar akustik atau bersenandung nada penyemangat yang membakar antusiasme kawan.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('band_move_2', 'band', 'Distorsi Pemecah Telinga (Sonic Screech)', 'AoE Sound Attack', '1 Action', 'Kerucut 15 ft', 'Physique Save (DC 8+PB+Talent)', '1d8 Suara/Mental Damage ke Composure & HP fisik; target gagal menderita status Deafened/Dazed 1 ronde.', 'Mendekatkan mikrofon ke speaker monitor hingga dengkingan feedback memekakkan telinga lawan.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('band_move_3', 'band', 'Penampilan Epik (Crowd Performance)', 'Mass Emotional Move', '1 Menit (1x per Short Rest)', 'Area Suara 30 ft', 'Talent / Performance vs Mind Save', 'Seluruh target yang mendengar: musuh terdistraksi (-1d4 Composure) atau sekutu terinspirasi (+1d6 Composure).', 'Membawakan satu lagu spektakuler yang menggetarkan emosi semua orang yang hadir.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('painting_move_2', 'painting', 'Cipratan Cat Distraksi (Paint Splatter Blind)', 'Attack / Combat Control', '1 Action', '10 ft', 'Physique/Agility Attack (+Mod TLN)', '1d4 damage. Target kena melakukan Agility Save (DC 8+PB+Talent). Gagal: Blinded (bisa dibersihkan pakai 1 Action; di Kelas 11+ tambah 1d4 poison damage jika mengering).', 'Menyiramkan palet cat minyak basah pekat tepat ke arah kedua mata penyerang.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('painting_move_1', 'painting', 'Sketsa Wajah Kilat (Photographic Sketch)', 'Visual Investigation', '1 Menit (At-Will)', 'Touch', 'Talent / Creative', 'Menghasilkan potret visual presisi dari seseorang atau barang bukti yang hanya sempat dilihat sekilas.', 'Menggoreskan pensil 2B di buku sketsa dengan kecepatan tangan mengagumkan.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('painting_move_3', 'painting', 'Karya Provokasi (Satirical Artwork)', 'Social Propaganda', '1 Jam Persiapan', 'Area Sekolah', 'Talent / Creative vs Looks Save', 'Poster karikatur mading memicu buah bibir; target kehilangan 1d4 Composure setiap kali murid lain menertawakan gambar tersebut selama 1 hari.', 'Membuat karikatur atau poster satire yang dipasang diam-diam di majalah dinding sekolah.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('photography_move_1', 'photography', 'Jepretan Kilat Flash (Flash Stun)', 'Combat Control Move', '1 Action', '15 ft', 'Intelligent / Academic vs Mind Save (DC 8+PB+INT)', 'Target mengalami 1d4 Composure damage dan terkena status Disadvantage pada aksi berikutnya karena silau lampu kilat.', 'Menodongkan lampu kilat kamera tepat ke wajah lawan lalu menekan tombol shutter seketika.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('photography_move_3', 'photography', 'Membekukan Momen (Candid Shutter)', 'Tactical & Romance Shutter', '1 Bonus Action', '30 ft', 'Talent / Creative', 'Menangkap ekspresi jujur atau kelemahan target dari jauh; sekutu mendapat Advantage pada check sosial atau serangan berikutnya ke target.', 'Membidik lensa telefoto secara tenang di waktu yang tepat saat target sedang melamun atau tidak waspada.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('photography_move_2', 'photography', 'Bukti Foto Kompromatis (Compromising Photo)', 'Social Leverage', '1 Action', '30 ft', 'Intelligent / Street vs Mind Save', 'Target kehilangan 1d8 Composure dan ragu melanjutkan perdebatan karena rahasianya terancam terekspos.', 'Memamerkan hasil jepretan candid di layar kamera yang membuat lawan gelagapan dan salah tingkah.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('cooking_move_3', 'cooking', 'Camilan Penambah Tenaga (Snack Energy Boost)', 'Field Morale Boost', '1 Bonus Action (Touch)', 'Touch', 'Otomatis', 'Menyuapkan kue kering darurat ke sekutu; sekutu memulihkan 1d4 Composure dan mendapat Advantage pada Saving Throw berikutnya.', 'Menyelipkan sepotong kue kering manis buatan sendiri saat teman sedang kehabisan energi atau putus asa.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('cooking_move_2', 'cooking', 'Aroma Penggugah Selera (Irresistible Aroma)', 'Social Distraction', '1 Action', '30 ft', 'Looks / Charm vs Target Mind Save', 'Mengalihkan perhatian semua target lapar di sekitar; target terdistraksi dan tidak bisa mengambil aksi agresif selama 1 giliran.', 'Membuka tutup wadah makanan hangat yang aromanya langsung menguasai seluruh lorong kelas.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('cooking_move_1', 'cooking', 'Bento Kasih Sayang (Handmade Bento)', 'Heartwarming Culinary', 'Dibuat saat Istirahat (Touch)', 'Touch', 'Intelligent / Academic atau Looks / Charm', 'Target yang memakan bento memulihkan 1d8 HP fisik / Composure dan Heart Meter bertambah +1 ♥ jika diberikan kepada target gebetan.', 'Menyusun nasi kepal, tamagoyaki manis, dan sosis gurita lucu dengan sepenuh perasaan hati.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('occult_move_1', 'occult', 'Ramalan Kartu Tarot (Tarot Reading)', 'Utility / Buff', '1 Action', '15 ft', 'Mind / Awareness vs DC 12', 'Hasil sukses memberikan 1d6 Fated Die yang dapat ditambahkan ke d20 roll apapun milik sekutu dalam sesi ini.', 'Membuka kartu tarot bergambar Wheel of Fortune atau Lovers dengan tatapan mata misterius.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('occult_move_2', 'occult', 'Aura Kutukan Menyeramkan (Eerie Curse)', 'Social Attack', '1 Action', '30 ft', 'Mind / Emotional vs Target Mind Save', 'Target kehilangan 1d8 Composure dan merasa dihantui nasib buruk (Disadvantage pada 1 roll berikutnya).', 'Mengarahkan jimat atau lilin menyala ke arah target sambil melafalkan bisikan misterius yang membuat bulu kuduk merinding.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('occult_move_3', 'occult', 'Kertas Jimat Pengusir Kesialan (Purifying Ward)', 'Reaction Defense', '1 Reaction', 'Self / 15 ft', 'Luck / Situation Luck', 'Menempelkan kertas jimat penangkal bala untuk membatalkan kegagalan kritis atau menyerap 1d6 damage mental/sosial.', 'Mengibaskan kertas ofuda bertuliskan aksara kanji kuno tepat saat malapetaka hendak terjadi.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('gaming_move_2', 'gaming', 'Provokasi Tombol Taunt (Taunt to Tilt)', 'Social Attack', '1 Bonus Action', '30 ft', 'Talent / Performance vs Target Mind Save', 'Target menderita 1d6 Composure damage dan terprovokasi (harus mengarahkan serangan ke dirimu di giliran berikutnya).', 'Melakukan gerakan jempol ke bawah atau pose taunt virtual yang langsung memancing emosi (''tilt'') lawan.', 1, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('gaming_move_1', 'gaming', 'Tangkisan Frame Sempurna (Frame Perfect Parry)', 'Reaction Defense', '1 Reaction', 'Self', 'Physique / Agility vs Attack', 'Menghitung timing serangan lawan dengan presisi frame; mengurangi damage serangan fisik/sosial sebesar 1d8 + Mod Agility.', 'Mengelak atau menepis serangan pada sepersekian detik terakhir layaknya mengeksekusi just-frame parry di turnamen.', 2, 11)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;
INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('gaming_move_3', 'gaming', 'Rute Cepat Speedrun (Speedrun Routing)', 'Utility Move', '1 Action', 'Self / Sekutu', 'Intelligent / Academic', 'Menemukan celah atau rute tercepat melewati rintangan / teka-teki sekolah dalam separuh waktu normal tanpa memicu jebakan.', 'Membedah denah dan aturan sekolah seperti mencari sequence break dan glitch jalur tercepat.', 3, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  unlock_grade = EXCLUDED.unlock_grade;

-- 6. Seed / Upsert Subclasses with tagline & identity_desc
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('presidium', 'student_council', 'Ketua / Presidium', 'Pemimpin mutlak organisasi & perisai reputasi sekolah.', 'Support kepemimpinan karismatik; mengorkestrasi moral kawan dan berani menanggung beban mental demi menyelamatkan kegagalan tim.', 'Pemimpin mutlak OSIS. Bonus +2 pada semua Looks checks saat berhadapan dengan guru atau undangan eksternal.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('discipline', 'student_council', 'Divisi Kedisiplinan', 'Penegak tata tertib sekolah berwajah dingin tanpa kompromi.', 'Crowd control sosial & pengintimidasi; memanfaatkan wibawa aturan dan buku catatan pelanggaran untuk melemahkan musuh.', 'Penegak aturan sekolah. Advantage pada Intimidasi dan Check untuk mendeteksi pelanggaran murid lain.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('men_striker', 'kendo', 'Gaya Serangan Kilat (Men-Striker)', 'Tebasan bilah pertama yang menembus pertahanan lawan seketika.', 'Striker ofensif agresif; unggul pada inisiatif serangan pembuka duel dan meluncurkan rentetan tebasan kombo bertubi-tubi.', 'Spesialisasi serangan cepat. Bonus aksi ekstra setelah serangan sukses pertama dalam ronde.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('iron_guard', 'kendo', 'Gaya Pertahanan Keras (Iron Wall)', 'Tembok pertahanan baja pelindung kawan dari hantaman fisik.', 'Tank defensif garis depan; menepis serangan lawan dengan kuda-kuda kokoh dan melindungi sekutu di belakangnya.', 'Spesialisasi pertahanan. +1 Physical AC permanen dan Advantage pada Physique Saving Throw.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('grappler', 'martial_arts', 'Spesialis Bantingan (Judo / Grappler)', 'Ahli kuncian sendi matras dan bantingan peredam daya juang.', 'Melee brawler & controller; merebut kerah musuh, membanting keras ke tanah, dan mengunci gerak total tanpa ampun.', 'Ahli merebut dan membanting lawan ke tanah. Serangan Bantingan memberikan +2d4 damage tambahan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('striker', 'martial_arts', 'Spesialis Serangan Beruntun (Striker)', 'Badai pukulan tangan kosong berkecepatan tinggi tanpa jeda.', 'DPS kombo cepat; memaksimalkan serangan unarmed beruntun untuk memusingkan lawan lewat akumulasi pukulan telak.', 'Ahli combo pukulan cepat. Bisa menyerang 2 kali dengan 1 aksi (setelah level 3+).')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('ace_striker', 'sports', 'Striker / Ace Lapangan', 'Bintang penyerang penentu kemenangan di menit-menit krusial.', 'Mobile skirmisher; bergerak lincah menembus barisan tanpa terkena serangan kesempatan dan unggul dalam momen genting.', 'Serangan fisik berbasis kecepatan. Bonus +1d4 damage saat menyerang setelah berlari setidaknya 15 ft.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('team_captain', 'sports', 'Kapten Regu (Team Captain)', 'Komandan lapangan pengatur formasi dan pembakar semangat regu.', 'Leader & buffer taktis; memberikan koordinasi pertahanan AC tim serta pidato pemulihan moral yang memulihkan HP dan batin.', 'Pemimpin tim. Sekali per istirahat, berikan 1d6 Inspiration Die ke seluruh anggota tim.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('lead_actor', 'drama', 'Aktor Protagonis / Bintang Panggung', 'Pusat perhatian lampu sorot penakluk simpati khalayak ramai.', 'Provoker sosial & clutch survivor; memaksa musuh terpaku memandangnya dan bangkit berkarisma luar biasa saat terdesak.', 'Ahli menarik simpati massa. Serangan sosial berbasis Looks memberikan 1d4 bonus damage Composure.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('antagonist', 'drama', 'Master Tipu Daya (Antagonist)', 'Dalang intrik sandiwara berwajah ganda pembalik skenario.', 'Deceiver & manipulator; menutupi kebohongan dengan sempurna dan membelokkan serangan musuh menjadi plot twist tak terduga.', 'Ahli manipulasi. Advantage pada semua check untuk menipu, berpura-pura, atau menyamar.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('chemist', 'kir_osn', 'Peneliti Kimia & Biologi', 'Peracik senyawa laboratorium penawar kondisi dan penguat raga.', 'Alchemist healer & buffer; meracik obat lapangan untuk memulihkan luka fisik serta formula imunitas jangka panjang.', 'Ahli senyawa kimia. Bisa menciptakan efek racun, asap, atau pelemas otot dari bahan lab sekali per sesi.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('hacker', 'kir_osn', 'Hacker Komputer & Robotika', 'Pengendali perangkat siber dan pengintai udara digital sekolah.', 'Utility controller & scout; memanfaatkan drone intai untuk memperluas pandangan radar tim dan menepis serangan mendadak.', 'Ahli perangkat digital. Advantage pada check Intelligent untuk membobol sistem, CCTV, atau kunci digital.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('danton', 'pramuka_paskin', 'Komandan Peleton (Danton)', 'Pengendali irama barisan berwibawa disiplin militer yang kokoh.', 'Tactical commander; memimpin inisiatif kelompok lewat aba-aba tegas dan menyatukan fokus mental regu.', 'Pemimpin barisan. Advantage saat memimpin aksi kelompok, bonus +2 pada semua Social Saves tim.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('pioneer', 'pramuka_paskin', 'Pionir Tali Temali & Tenda', 'Ahli ikatan simpul taktis dan pembangun pos perlindungan alam.', 'Field trapper & survivalist; mengikat musuh dengan simpul jerat serta mendirikan pos istirahat yang meregenerasi stamina.', 'Ahli bertahan hidup. Tidak pernah kehilangan arah di luar ruangan. +2 Physique Save terhadap bahaya alam.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('explorer', 'pecinta_alam', 'Penjelajah Rimba & Pendaki', 'Penakluk tebing curam dan penjelajah medan terjal tak kenal lelah.', 'Explorer scout; memiliki mobilitas panjat setara kecepatan jalan, kebal bahaya gravitasi, dan sigap menarik kawan yang tergelincir.', 'Spesialis navigasi dan terrain. Advantage pada Physique checks untuk memanjat, berenang, atau melintasi rintangan alam.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('medic', 'pecinta_alam', 'Ahli Pertolongan Pertama (Medic)', 'Paramedis garis depan penyelamat nyawa di saat genting.', 'Dedicated combat healer; membalut cedera fisik kawan seketika dan membangkitkan rekan yang tumbang dengan perlindungan ekstra.', 'Spesialis penyembuhan lapangan. Heal dice meningkat jadi 1d10 dan bisa menyembuhkan 1 teman per Short Rest.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('radio_host', 'penyiaran', 'Penyiar Radio Sekolah', 'Suara emas penenang jiwa dan pengendali gelombang suasana sekolah.', 'Social bard & crowd buffer; menghibur batin kawan lewat siaran ASMR dan menyiarkan perintah evakuasi darurat ke seluruh area.', 'Suara emas sekolah. Semua Social Moves berbasis suara mendapat +1 ke DC check dan 1d4 bonus damage.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('investigator', 'penyiaran', 'Reporter Investigasi', 'Pemburu skandal rahasia dan pengungkap fakta di balik layar.', 'Detective debuffer; menggali rahasia terpendam narasumber lewat wawancara taktis lalu membongkarnya di depan umum.', 'Ahli menggali informasi. Advantage pada semua check Intelligent (Street) dan Mind (Interpersonal) untuk mencari gosip.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('novelist', 'literatur', 'Penulis Puisi & Novel Romansa', 'Penenun sajak kasmaran peluluh ketegaran batin sang pujaan hati.', 'Romance specialist; merangkai kata puitis yang membuat target salah tingkah (Salting) serta menciptakan mahakarya bernilai Heart Inspiration.', 'Surat cinta dan aksi romansa berbasis Talent/Creative mendapat 1d4 bonus damage Composure.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('archivist', 'literatur', 'Penjaga Arsip Sejarah Sekolah', 'Penjaga dokumen terlarang dan rahasia kuno di balik dinding sekolah.', 'Lore master & researcher; mengingat sejarah sekolah tanpa cela dan membuka arsip lama yang menyingkap misteri besar Seishun Academy.', 'Ahli sejarah dan dokumen. Advantage pada semua check Intelligent terkait sejarah, peraturan, atau informasi tertulis.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('lead_guitar', 'band', 'Lead Guitarist / Soloist', 'Petikan solo distorsi bertenaga yang mengguncang panggung festival.', 'Sonic attacker & inspire; membakar semangat awal lewat riff pembuka dan membawakan solo gitar epik yang melumpuhkan pendengaran musuh.', 'Ahli solo gitar. Serangan Sonic berbasis Talent mendapat +1d6 damage dan bisa mempengaruhi area lebih luas.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('vocalist', 'band', 'Vokalis Utama Karismatik', 'Magnet panggung pemikat hati yang menghipnotis seisi auditorium.', 'Charismatic crowd charmer; memikat perhatian lawan lewat suara emas dan memicu encore yang menghapus beban emosional kawan.', 'Ahli memikat hati penonton. Semua Social Moves dari vokalis memberikan Disadvantage pada Mental Saves target.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('portrait', 'painting', 'Pelukis Potret Realis', 'Perekam memori visual tajam yang melukiskan rahasia ke dasar jiwa.', 'Visual investigator; merekonstruksi wajah tersangka dari ingatan serta menghasilkan potret mendalam yang menyentuh emosi terdalam subjek.', 'Ahli memvisualisasikan seseorang dari ingatan. Advantage pada check yang membutuhkan deskripsi rupa atau pengenalan wajah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('designer', 'painting', 'Ilustrator Manga & Desain', 'Kreator visual populer pengubah jalan cerita layaknya panel manga.', 'Visual support & destiny manipulator; membuat ilustrasi pendorong moral dan memanipulasi hasil lemparan dadu seperti membalik adegan komik.', 'Ahli visual komunikasi. Bisa menciptakan publikasi, flyer, atau karikatur yang memberikan 1d6 bonus Influence di lingkungan sekolah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('paparazzi', 'photography', 'Fotografer Investigasi / Paparazzi', 'Pengintai lensa telefoto senyap pengumpul bukti tak terbantahkan.', 'Stealth scout & tracker; memotret target tanpa terdeteksi untuk mendapatkan kebenaran dan melacak jejak orang di lingkungan sekolah.', 'Spesialis foto sembunyi-sembunyi. Advantage pada check saat mengambil foto atau mengamati target tanpa disadari.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('portraitist', 'photography', 'Fotografer Artistik / Potret', 'Pengabadikan estetika masa muda penenun kenangan abadi romansa.', 'Aesthetic enhancer & keepsake maker; mengatur pencahayaan terbaik untuk mendongkrak pesona kawan serta mencetak foto keepsake pembangkit inspirasi.', 'Spesialis potret estetika dan menangkap emosi wajah. Foto potret yang kamu berikan ke teman memulihkan 1d4 Composure atau menambah +1 Heart Meter.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('patissier', 'cooking', 'Pâtissier / Pembuat Manisan & Cokelat', 'Pencipta manisan manis pelipur lara dan pelunak sikap keras hati.', 'Social confectioner; menyajikan pastry yang memberi Temporary Composure dan cokelat cinta yang meningkatkan relasi NPC secara instan.', 'Spesialis kue dan hidangan penutup romantis. Cokelat atau kue buatan sendiri memberikan bonus +2 pada Social Check romansa.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('gourmet_chef', 'cooking', 'Koki Masakan Hangat / Bento Master', 'Penyaji bekal bento penuh energi dan santapan keluarga pemulih raga.', 'Nutrition buffer & sustenance master; menyiapkan bekal bergizi penambah keberuntungan dan jamuan makan bersama penangkal lelah.', 'Spesialis nutrisi dan stamina. Masakanmu memulihkan ekstra HP saat istirahat dan menangkal kelelahan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('tarot_reader', 'occult', 'Peramal Nasib / Tarot Diviner', 'Pembaca kartu takdir roda nasib pengutak-atik garis probabilitas semesta.', 'Fate manipulator; membuka kartu tarot untuk mengintervensi hasil d20 dan memprediksi marabahaya masa depan.', 'Spesialis membaca kartu masa depan dan ramalan asmara. Sekali per istirahat, dapat meramal takdir seseorang untuk memberikan Advantage pada aksi penting.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('paranormal_investigator', 'occult', 'Peneliti Tujuh Misteri Sekolah', 'Penyelidik legenda urban sekolah dan pelindung dari teror tak kasat mata.', 'Mystery detective & warder; mendeteksi jejak anomali supernatural serta memasang segel spiritual yang membentengi kawan dari rasa takut.', 'Spesialis kutukan dan atmosfer horor. Kebal terhadap rasa takut/Intimidasi lawan dan peka terhadap rahasia masa lalu sekolah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('fighting_gamer', 'gaming', 'Master Game Pertarungan / FGC Pro', 'Penguasa kecepatan frame-data dan serangan pembalik keadaan turnamen.', 'Counter-attacker & burst finisher; menepis serangan dengan timing presisi lalu membalas seketika, serta melepaskan jurus pamungkas saat bar meter penuh.', 'Spesialis refleks kilat dan combo. Mendapatkan Advantage pada check inisiatif reaksi cepat.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('strategist', 'gaming', 'Ahli Strategi & RPG / Theorycrafter', 'Pembedah kelemahan statistik dan perusak meta pertahanan lawan.', 'Tactical debuffer & tactician; membongkar data armor dan kelemahan musuh agar rekan tim dapat melancarkan serangan berdaya rusak maksimal.', 'Spesialis kalkulasi pola dan resource. Bisa memprediksi pergerakan lawan 1 giliran ke depan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;

-- 7. Seed / Upsert 64 Subclass Moves (G11 & G12)
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('presidium_g11_rapat_darurat', 'presidium', 'Rapat Darurat', 'G11', 11, 'Support Move', '1 Action (1x per Short Rest)', '30 ft', 'Looks / Influence', 'Sekutu dalam 30 ft pulihkan 1d6 + Mod Looks Composure dan mendapat Advantage pada Initiative selama 1 jam.', 'Kumpulkan sekutu dalam jarak 30 ft yang bisa mendengar untuk menyusun strategi kilat.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('presidium_g12_mandat_ketua', 'presidium', 'Mandat Ketua', 'G12', 12, 'Reaction / Leadership', '1 Reaction (1x per Long Rest)', '30 ft', 'Otomatis', 'Ubah satu kegagalan check atau saving throw sekutu dalam 30 ft menjadi sukses mutlak. Pengguna menerima 1d4 Composure damage (Salting/Fluster).', 'Menanggung konsekuensi keputusan dengan otoritas penuh ketua OSIS.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('discipline_g11_peluit_disiplin', 'discipline', 'Peluit Disiplin', 'G11', 11, 'Social Debuff', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Mind Save (DC 8+PB+Looks)', 'Target gagal menderita status Shaken (Disadvantage pada serangan & check sosial) sampai akhir giliran berikutnya.', 'Meniup peluit komando dengan tatapan tajam penegak kedisiplinan sekolah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('discipline_g12_catatan_pelanggaran', 'discipline', 'Catatan Pelanggaran', 'G12', 12, 'Social Leverage', '1 Action (1x per Long Rest)', 'Pandangan', 'Otomatis', 'Pilih 1 murid yang melanggar aturan: target Disadvantage check sosial ke guru/staf selama 1 hari, dan kamu Advantage Influence ke guru/staf terkait dirinya.', 'Mencatat nama dan pasal pelanggaran target di buku hitam kedisiplinan OSIS.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('men_striker_g11_ayunan_pertama', 'men_striker', 'Ayunan Pertama', 'G11', 11, 'Passive Attack', 'Pasif (1x per Combat)', 'Melee (5 ft)', 'Physique Attack', 'Serangan shinai pertamamu dalam combat mendapat +2 to hit dan +1d6 Physical Damage tambahan.', 'Langkah sergap kilat melancarkan tebasan mendadak sebelum lawan siap berposisi.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('men_striker_g12_men_kote_do', 'men_striker', 'Men-Kote-Do', 'G12', 12, 'Attack Combo', '1 Action (1x per Short Rest)', 'Melee (5 ft)', 'Physique Attack', '3 serangan shinai beruntun ke 1 target. Serangan ke-2 dan ke-3 mendapat penalti -2 to hit tetapi +1d4 damage tambahan.', 'Rangkaian jurus klasik kendo menyasar kepala, pergelangan tangan, dan perut dalam satu tarikan napas.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('iron_guard_g11_kudakuda_teguh', 'iron_guard', 'Kuda-kuda Teguh', 'G11', 11, 'Reaction Defense', '1 Reaction (PBx per Long Rest)', 'Self', 'Otomatis', '+3 Physical AC terhadap 1 serangan fisik. Jika serangan meleset, serangan balasan ke penyerang mendapat Advantage.', 'Menancapkan tumit kuat ke lantai dan menahan impak pukulan lawan tanpa goyah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('iron_guard_g12_tembok_besi', 'iron_guard', 'Tembok Besi', 'G12', 12, 'Defensive Stance', '1 Bonus Action (1x per Short Rest)', 'Self / 5 ft', 'Otomatis', 'Diri sendiri mendapat Resistance terhadap Physical Damage hingga awal giliran berikutnya; sekutu dalam 5 ft di belakangmu +2 Physical AC.', 'Memasang kuda-kuda pelindung lebar yang membelokkan seluruh hantaman dari kawan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('grappler_g11_uchimata', 'grappler', 'Uchi-mata', 'G11', 11, 'Takedown Move', '1 Bonus Action setelah Grapple (PBx per Long Rest)', 'Melee (5 ft)', 'Physique / Power', 'Banting target: 1d8 + Mod Physique damage, dan target terkena status Dazed sampai akhir giliran berikutnya.', 'Menyapu paha bagian dalam lawan dan memutar tubuh untuk membantingnya telak ke matras.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('grappler_g12_ippon', 'grappler', 'Ippon', 'G12', 12, 'Finishing Slam', '1 Action (1x per Short Rest)', 'Melee (5 ft)', 'Target Physique Save (DC 8+PB+Physique)', 'Target Grappled/Pinned gagal save: 2d10 + Mod Physique damage dan Pinned 1 ronde penuh. Sukses: setengah damage.', 'Bantingan punggung sempurna berkekuatan penuh yang mengunci kemenangan seketika.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('striker_g11_kombo_dasar', 'striker', 'Kombo Dasar', 'G11', 11, 'Passive Combo', 'Pasif', 'Melee (5 ft)', 'Physique Attack', 'Serangan unarmed kedua dalam giliran yang sama mendapat bonus +2 to hit dan +1d4 damage.', 'Susulan pukulan jab cepat segera setelah pukulan lurus pertama mendarat.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('striker_g12_hujan_pukulan', 'striker', 'Hujan Pukulan', 'G12', 12, 'Flurry Attack', '1 Action (1x per Short Rest)', 'Melee (5 ft)', 'Physique Attack', '4 serangan unarmed beruntun (tiap hit +Mod Physique). Jika minimal 3 hit berhasil mengenai target, target terkena status Dazed.', 'Rentetan kombo pukulan dan sikutan tanpa jeda layaknya petarung sabuk hitam turnamen.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('ace_striker_g11_sprint_final', 'ace_striker', 'Sprint Final', 'G11', 11, 'Mobility Burst', '1 Bonus Action (PBx per Long Rest)', 'Self', 'Otomatis', 'Speed +15 ft sampai akhir giliran, kebal Opportunity Attack, dan Advantage pada check Agility.', 'Akselerasi sprint eksplosif menembus celah sempit di antara kerumunan lawan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('ace_striker_g12_clutch_moment', 'ace_striker', 'Clutch Moment', 'G12', 12, 'Clutch Buff', '1x per Short Rest (DM)', 'Self', 'Otomatis', 'Tambahkan dadu 1d10 ke satu roll Physique, Agility, atau Talent. Boleh digunakan setelah melihat hasil dadu.', 'Mental juara yang meledak tepat di detik-detik penentuan pertandingan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('team_captain_g11_formasi_tim', 'team_captain', 'Formasi Tim', 'G11', 11, 'Tactical Defense', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Looks / Influence', 'Semua sekutu dalam 30 ft mendapat bonus +1 to hit dan +1 Physical AC hingga awal giliranmu berikutnya.', 'Mengatur posisi bertahan rekan tim layaknya formasi zona pertahanan basket.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('team_captain_g12_pidato_kapten', 'team_captain', 'Pidato Kapten', 'G12', 12, 'Inspirational Rally', '1 Action (1x per Long Rest)', '30 ft', 'Looks / Influence', 'Semua sekutu dalam 30 ft memulihkan 1d8 + Mod Looks Physical HP dan Composure, serta Advantage pada Saving Throw berikutnya.', 'Pidato emosional berapi-api di pinggir lapangan yang membakar kembali asa rekan tim.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('lead_actor_g11_pusat_perhatian', 'lead_actor', 'Pusat Perhatian', 'G11', 11, 'Spotlight Taunt', '1 Action (1x per Short Rest)', '30 ft', 'Talent / Performance vs Mind Save (DC 8+PB+Looks)', 'Musuh yang gagal Mind Save menderita Disadvantage saat menyerang atau bertindak terhadap sekutumu (mereka terpaku padamu selama 1 menit).', 'Melangkah ke tengah ruangan dengan pose teatrikal yang merebut seluruh atensi musuh.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('lead_actor_g12_adegan_klimaks', 'lead_actor', 'Adegan Klimaks', 'G12', 12, 'Climax Buff', '1 Bonus Action (1x per Long Rest)', 'Self', 'Otomatis', 'Saat HP atau Composure <= 50%: selama 1 menit Advantage check Talent & Looks, +2 kedua AC, dan memulihkan Composure sebesar setengah maksimal.', 'Memasuki babak klimaks panggung saat terdesak, memancarkan aura bintang yang tak terbendung.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('antagonist_g11_topeng_ganda', 'antagonist', 'Topeng Ganda', 'G11', 11, 'Passive Deception', 'Pasif', 'Self', 'Performance / Influence', 'Advantage pada check Performance atau Influence saat berbohong/menyamar. Siapa pun yang mencoba membongkarmu menderita Disadvantage.', 'Menyembunyikan niat asli di balik senyuman ramah dan gestur tanpa cela.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('antagonist_g12_plot_twist', 'antagonist', 'Plot Twist', 'G12', 12, 'Reaction Counter', '1 Reaction (1x per Long Rest)', '30 ft', 'Target Mind Save (DC 8+PB+Looks)', 'Saat musuh menyerang/menggagalkan rencanamu: musuh gagal save serangannya dialihkan ke target lain atau batal, dan kamu Advantage aksi berikutnya.', 'Menyingkap jebakan tersembunyi yang membalikkan situasi di saat musuh merasa telah menang.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('chemist_g11_racikan_lab', 'chemist', 'Racikan Lab', 'G11', 11, 'Healing Concoction', '1 Action (PBx per Long Rest)', '5 ft', 'Otomatis', 'Satu target dalam 5 ft memulihkan 1d6 + Mod Intelligent Physical HP, atau mengakhiri 1 kondisi fisik (Dazed/sakit).', 'Memberikan salep antiseptik atau larutan elektrolit racikan sendiri.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('chemist_g12_formula_rahasia', 'chemist', 'Formula Rahasia', 'G12', 12, 'Group Serum', '10 Menit (1x per Long Rest)', 'Touch (s.d. 4 target)', 'Intelligent / Academic', 'Pilih: +2 Stamina Save selama 1 jam, atau netralkan semua kondisi fisik negatif dan pulihkan 2d6 Physical HP untuk 4 kawan.', 'Membagi formula suplemen ilmiah murni hasil riset berhari-hari di laboratorium.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('hacker_g11_drone_rakitan', 'hacker', 'Drone Rakitan', 'G11', 11, 'Aerial Drone Scout', '1 Bonus Action (PBx per Long Rest)', '60 ft', 'Otomatis', 'Kendalikan drone mikro selama 10 menit. Melihat sudut pandang kamera dan Advantage pada check Awareness jarak jauh.', 'Menerbangkan quadcopter mini rakitan klub robotika untuk mengintai area sekitar.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('hacker_g12_unit_pendukung', 'hacker', 'Unit Pendukung', 'G12', 12, 'Robotic Defense', '1x per Long Rest (Aktif 1 Jam)', '15 ft', 'Reaction', 'Reaction: satu serangan fisik terhadap kawan dalam 15 ft otomatis ditangkis oleh drone pendamping. Sekutu yang dibantu +1d6 check Academic/Street.', 'Mengaktifkan robot pembantu bersensor otonom yang menjaga keamanan kawan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('danton_g11_abaaba', 'danton', 'Aba-aba', 'G11', 11, 'Tactical Lead', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Mind / Emotional', 'Sekutu dalam 30 ft yang mendengar komando mendapat +1d4 pada inisiatif dan check pertama mereka.', 'Memberikan aba-aba lantang terstruktur yang memompa kesiapsiagaan seluruh rekan regu.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('danton_g12_barisan_rapat', 'danton', 'Barisan Rapat', 'G12', 12, 'Morale Formation', '1 Action (1x per Short Rest)', '15 ft', 'Otomatis', 'Selama 1 menit, sekutu dalam 15 ft darimu mendapat +2 Mental AC dan kebal status Salting/Fluster akibat tekanan kelompok.', 'Menginstruksikan barisan rapat pundak ke pundak yang menepis segala bentuk intimidasi.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('pioneer_g11_simpul_jerat', 'pioneer', 'Simpul Jerat', 'G11', 11, 'Rope Snare Trap', '1 Action (PBx per Long Rest)', '15 ft (Butuh Tali)', 'Target Agility Save (DC 8+PB+Physique)', 'Target gagal menderita status Pinned/Restrained sampai berhasil lepas lewat check Physique/Agility melawan DC-mu.', 'Melemparkan tali simpul laso yang menjerat kaki atau pergelangan lawan seketika.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('pioneer_g12_pos_darurat', 'pioneer', 'Pos Darurat', 'G12', 12, 'Camp Haven', '10 Menit (1x per Long Rest)', 'Touch', 'Otomatis', 'Dirikan pos/tenda. Sekutu yang Short Rest di dalamnya mendapat 1 Rest Dice ekstra dan kebal kelelahan cuaca.', 'Membangun bivak tenda darurat berlindung angin lengkap dengan alas dan pasak kokoh.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('explorer_g11_naluri_rimba', 'explorer', 'Naluri Rimba', 'G11', 11, 'Passive Navigation', 'Pasif', 'Self', 'Mind / Awareness', 'Advantage pada check Awareness & Stamina di alam terbuka, tidak bisa tersesat, dan kecepatan memanjat sama dengan kecepatan jalan.', 'Insting alam liar yang menyatu dengan ritme pepohonan dan kontur perbukitan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('explorer_g12_pendaki_sejati', 'explorer', 'Pendaki Sejati', 'G12', 12, 'Reaction Rescue', '1 Reaction (PBx per Long Rest)', '15 ft', 'Physique / Agility', 'Saat kamu/sekutu dalam 15 ft jatuh, ia kebal damage jatuh. Kamu boleh menarik sekutu itu sejauh 15 ft ke tempat aman.', 'Refleks cepat mencengkeram tali atau tangan kawan sebelum terperosok ke jurang.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('medic_g11_p3k_darurat', 'medic', 'P3K Darurat', 'G11', 11, 'Field First Aid', '1 Action (PBx per Long Rest)', '5 ft', 'Otomatis', 'Satu sekutu dalam 5 ft memulihkan 1d8 + Mod Mind Physical HP dan mengakhiri 1 kondisi buruk (misal Dazed).', 'Membersihkan luka dengan antiseptik dan memasang perban tekan lapangan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('medic_g12_triage', 'medic', 'Triage', 'G12', 12, 'Revive Action', '1 Bonus Action (1x per Short Rest)', 'Touch', 'Otomatis', 'Sekutu yang tumbang (HP 0) langsung sadar bangun dengan 2d8 + Mod Mind Physical HP dan menerima Temp HP sebesar PB.', 'Menyuntikkan cairan stimulan darurat yang memompa kembali detak jantung rekan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('radio_host_g11_suara_siaran', 'radio_host', 'Suara Siaran', 'G11', 11, 'Passive Broadcast Buff', 'Pasif + 1x per Short Rest', 'Self / Area', 'Looks / Charm', 'Advantage pada Charm & Performance saat memakai mic. Siaran 10 menit memberi sekutu yang mendengar Temp Composure 1d6 + Mod Looks.', 'Menyiarkan gelombang nada suara hangat yang menentramkan seisi lorong kelas.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('radio_host_g12_pengumuman_darurat', 'radio_host', 'Pengumuman Darurat', 'G12', 12, 'Mass Command', '1 Action (1x per Long Rest, DM)', 'Seluruh Sekolah', 'Target Mind Save', 'Umumkan lewat speaker. Seluruh NPC di sekolah mengikuti instruksi sederhana (evakuasi/kumpul/berhenti berkelahi) kecuali yang lolos Mind Save.', 'Menyiarkan pengumuman wibawa sentral yang menggerakkan massa siswa secara serentak.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('investigator_g11_wawancara_tajam', 'investigator', 'Wawancara Tajam', 'G11', 11, 'Investigative Probe', 'Pasif', '5 ft', 'Interpersonal / Influence', 'Advantage pada check Interpersonal dan Influence saat mewawancarai; wawancara sukses memberi 1 fakta akurat dari DM.', 'Mengajukan pertanyaan menjebak dengan pena dan buku catatan reporter siap di tangan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('investigator_g12_ekspos', 'investigator', 'Ekspos', 'G12', 12, 'Scandal Exposure', '1 Action (1x per Long Rest)', '30 ft', 'Otomatis', 'Bongkar rahasia/bukti target: target menderita 3d4 Composure damage (Salting/Fluster) dan Disadvantage check sosial 1 hari; kamu +2 Influence.', 'Memamerkan lembar bukti skandal tak terbantahkan yang membungkam pembelaan lawan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('novelist_g11_kata_pemikat', 'novelist', 'Kata Pemikat', 'G11', 11, 'Romantic Lyric', '1 Action (PBx per Long Rest)', '15 ft', 'Talent / Creative vs Mind Save (DC 8+PB+Looks)', 'Advantage check Charm; target gagal Mind Save menerima 1d4 Composure damage (tersipu / Salting).', 'Membisikkan bait puisi romantis yang menusuk langsung ke relung hati target.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('novelist_g12_magnum_opus', 'novelist', 'Magnum Opus', 'G12', 12, 'Literary Masterpiece', '1x per Long Rest', 'Touch', 'Talent / Creative', 'Tulis karya sastra romansa. Pemegangnya +3 pada 1 check sosial/romance, dan kamu atau penerimanya mendapat 1 Heart Inspiration.', 'Menuntaskan manuskrip prosa terindah yang memancarkan pesona asmara abadi.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('archivist_g11_arsip_hidup', 'archivist', 'Arsip Hidup', 'G11', 11, 'Historical Recall', 'Pasif + 1x per Short Rest', 'Self', 'Intelligent / Academic', 'Advantage check Academic untuk sejarah sekolah dan bangunan; tanya DM 1 fakta sejarah sekolah dan jawabannya pasti benar.', 'Memanggil kembali baris-baris arsip tua dari perpustakaan yang tersimpan di ingatan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('archivist_g12_catatan_terlarang', 'archivist', 'Catatan Terlarang', 'G12', 12, 'Secret Archives', '10 Menit (1x per Long Rest)', 'Self', 'Intelligent / Academic', 'Akses arsip tersembunyi. DM memberi petunjuk penting misteri sekolah; kamu dan 1 sekutu Advantage pada check investigasi terkait selama 1 hari.', 'Membuka peti berkas terlarang di sudut ruang bawah tanah perpustakaan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('lead_guitar_g11_riff_pembuka', 'lead_guitar', 'Riff Pembuka', 'G11', 11, 'Solo Lead Buff', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Talent / Performance', 'Solo gitar singkat: dirimu +1d6 pada check Performance, dan sekutu yang mendengar +1 pada lemparan dadu pertama mereka.', 'Memetik riff melodi pembuka bernada tinggi yang membakar antusiasme panggung.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('lead_guitar_g12_solo_legendaris', 'lead_guitar', 'Solo Legendaris', 'G12', 12, 'Sonic Climax', '1 Action (1x per Long Rest)', 'Area 30 ft', 'Physique Save (DC 8+PB+Talent)', 'Sekutu dalam 30 ft pulihkan 1d10 + Mod Talent Composure; musuh gagal save terkena status Dazed selama 1 ronde.', 'Mengeksekusi solo gitar meliuk-liuk spektakuler di tepi panggung yang memukau penonton.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('vocalist_g11_suara_memikat', 'vocalist', 'Suara Memikat', 'G11', 11, 'Alluring Vocals', '1 Action (PBx per Long Rest)', '30 ft', 'Target Mind Save (DC 8+PB+Looks)', 'Target gagal: 1d4 Composure damage (Salting/Fluster) & Disadvantage terhadapmu 1 ronde; kamu Advantage Charm saat bernyanyi.', 'Menyanyikan bait lagu romantis dengan tatapan mata terkunci ke arah target.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('vocalist_g12_encore', 'vocalist', 'Encore', 'G12', 12, 'Encore Revival', '1 Reaction (1x per Long Rest)', '30 ft', 'Otomatis', 'Sehabis adegan panggung sukses: kamu dapat 1 Heart Inspiration; sekutu memulihkan 1d6 Composure & menghapus 1 status negatif emosional.', 'Menyambut sorak penonton yang meminta lagu tambahan dengan senyum karismatik.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('portrait_g11_mata_pelukis', 'portrait', 'Mata Pelukis', 'G11', 11, 'Passive Visual Scout', 'Pasif (PBx per Long Rest)', 'Self', 'Mind / Awareness', 'Advantage pada check Awareness mengenali wajah & detail; sketsa wajah dari ingatan memberi Advantage saat mencari target tersebut.', 'Ketajaman mata mengamati proporsi raut wajah dan gestur seseorang secara detail.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('portrait_g12_potret_jiwa', 'portrait', 'Potret Jiwa', 'G12', 12, 'Deep Portrait', '10 Menit (1x per Long Rest)', 'Touch', 'Talent / Creative', 'Lukis seseorang: DM mengungkap emosi dominan dan keinginan terpendamnya; subjek yang melihatnya memulihkan 1d8 + Mod Talent Composure.', 'Menghasilkan lukisan potret ekspresif yang menembus topeng kepribadian subjek.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('designer_g11_sketsa_cepat', 'designer', 'Sketsa Cepat', 'G11', 11, 'Manga Sticker Buff', '1 Bonus Action (PBx per Long Rest)', 'Touch', 'Talent / Creative', 'Buat poster/stiker chibi dalam 1 menit. Sekutu yang membawanya mendapat bonus +1d4 pada satu lemparan sosial hari itu.', 'Menggambar ilustrasi karakter lucu penyemangat di selembar kertas memo tempel.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('designer_g12_panel_aksi', 'designer', 'Panel Aksi', 'G12', 12, 'Destiny Manipulation', '1 Reaction (1x per Long Rest)', '30 ft', 'Otomatis', 'Ubah satu lemparan dadu (milikmu atau kawan yang terlihat) dengan bonus +1d8 atau penalti -1d8 sebagai efek dramatis panel manga.', 'Membayangkan adegan melambat layaknya transisi panel komik shonen dramatis.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('paparazzi_g11_bukti_foto', 'paparazzi', 'Bukti Foto', 'G11', 11, 'Photo Evidence', '1 Action (PBx per Long Rest)', '30 ft', 'Intelligent / Street', 'Ambil foto adegan/orang. Saat ditinjau, DM memberikan 1 petunjuk akurat; menunjukkan foto memberi Advantage pada check Influence terkait.', 'Menekan shutter diam-diam dari sudut lorong untuk mengabadikan bukti krusial.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('paparazzi_g12_mata_elang', 'paparazzi', 'Mata Elang', 'G12', 12, 'Telephoto Vision', '1 Bonus Action (1x per Long Rest)', '60 ft', 'Mind / Awareness', 'Selama 10 menit, lensa telefoto mendeteksi semua yang bersembunyi (Hidden) dalam 60 ft, dan mengetahui posisi target yang pernah difoto di sekolah.', 'Memutar zoom optik telefoto untuk memindai setiap sudut halaman sekolah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('portraitist_g11_pencahayaan_sempurna', 'portraitist', 'Pencahayaan Sempurna', 'G11', 11, 'Aesthetic Focus', '1 Bonus Action (PBx per Long Rest)', '15 ft', 'Looks / Charm', 'Subjek yang difoto menerima bonus +2 pada seluruh check Looks hingga akhir adegan.', 'Mengatur reflektor dan arah cahaya alami agar potret kawan tampak bercahaya memikat.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('portraitist_g12_momen_abadi', 'portraitist', 'Momen Abadi', 'G12', 12, 'Keepsake Creation', '1x per Long Rest', 'Touch', 'Talent / Creative', 'Cetak foto momen penting menjadi keepsake. Pemegangnya mendapat 1 Heart Inspiration dan Advantage melawan efek Salting/Fluster momen itu.', 'Mencetak selembar foto polaroid hangat yang mengabadikan ikatan persahabatan murni.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('patissier_g11_manisan_penyemangat', 'patissier', 'Manisan Penyemangat', 'G11', 11, 'Confectionery Morale', '10 Menit (PBx per Long Rest)', 'Touch (s.d. 4 orang)', 'Otomatis', 'Hidangkan kue manisan untuk s.d. 4 orang. Mereka menerima Temp Composure sebesar 1d6 + Mod Talent.', 'Membagikan macaron atau kue sus buatan sendiri yang langsung mengusir rasa penat.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('patissier_g12_cokelat_pembuka_hati', 'patissier', 'Cokelat Pembuka Hati', 'G12', 12, 'Heart Chocolate', '1x per Long Rest', 'Touch', 'Looks / Charm', 'Penerima manisan memulihkan 1d10 + Mod Talent Composure. Jika diberikan ke NPC, sikap keramahannya naik satu tingkat lebih bersahabat (DM).', 'Menyodorkan kotak cokelat handmade berpita manis yang meluluhkan sikap dingin siapa saja.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('gourmet_chef_g11_bento_bekal', 'gourmet_chef', 'Bento Bekal', 'G11', 11, 'Nutritious Lunchbox', 'Saat Short Rest (PBx per Long Rest)', 'Touch', 'Otomatis', 'Siapkan bento: penerima mendapat +1d4 pada 1 check hari itu dan memulihkan 1d6 Physical HP.', 'Menata kotak bekal berisi tamagoyaki gurih dan sosis potong rapi untuk kawan.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('gourmet_chef_g12_masakan_rumah', 'gourmet_chef', 'Masakan Rumah', 'G12', 12, 'Family Feast', '1x per Long Rest (Sebelum Istirahat)', 'Touch (Kelompok)', 'Otomatis', 'Semua yang makan bersama mendapat Temp HP & Temp Composure sebesar PB, Advantage melawan Fatigue, dan 1 Rest Dice ekstra.', 'Memasak hidangan sup miso hangat dan lauk porsi besar untuk dinikmati seluruh anggota tim.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('tarot_reader_g11_takdir_terbuka', 'tarot_reader', 'Takdir Terbuka', 'G11', 11, 'Fate Intervention', '1 Reaction (PBx per Long Rest)', '30 ft', 'Otomatis', 'Ubah 1 lemparan dadu d20 yang terlihat (milikmu, sekutu, atau musuh) dengan bonus +1d4 atau penalti -1d4.', 'Membalik kartu tarot The Wheel of Fortune di meja untuk membelokkan probabilitas nasib.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('tarot_reader_g12_ramalan_besar', 'tarot_reader', 'Ramalan Besar', 'G12', 12, 'Grand Divination', '10 Menit (1x per Long Rest, DM)', '15 ft', 'Mind / Awareness (DC 12)', 'DM mengungkap 1 ancaman atau kejadian penting yang akan terjadi hari itu; sekutu dalam 15 ft mendapat Advantage pada roll terkait.', 'Menyusun formasi 10 kartu Celtic Cross di bawah keremangan lilin untuk membaca masa depan sekolah.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('paranormal_investigator_g11_catatan_misteri', 'paranormal_investigator', 'Catatan Misteri', 'G11', 11, 'Supernatural Sense', 'Pasif + PBx per Long Rest', 'Self', 'Mind / Awareness', 'Advantage pada check Awareness & Academic untuk anomali supernatural; bertanya ke DM apakah ada entitas/tanda gaib di ruangan itu.', 'Mengecek catatan legenda urban sekolah dan mengukur fluktuasi medan hawa dingin.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('paranormal_investigator_g12_segel_pelindung', 'paranormal_investigator', 'Segel Pelindung', 'G12', 12, 'Purifying Ward', '1 Action (1x per Long Rest)', 'Area 15 ft', 'Luck / Situation Luck', 'Taburkan garis garam/jimat: sekutu dalam 15 ft Advantage pada save mental supernatural dan kebal rasa takut gaib selama 1 jam.', 'Menancapkan kertas jimat ofuda di empat penjuru ruangan untuk membentuk batas sakral pelindung.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('fighting_gamer_g11_frame_perfect', 'fighting_gamer', 'Frame-Perfect', 'G11', 11, 'Parry Counter', '1 Reaction (PBx per Long Rest)', 'Self', 'Physique / Agility', '+3 Physical AC terhadap 1 serangan. Jika meleset, serang balik dengan serangan tangan kosong/senjata (1d6 + Mod Physique).', 'Menghitung celah frame serangan musuh di sepersekian detik terakhir lalu melancarkan counter hit.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('fighting_gamer_g12_super_meter', 'fighting_gamer', 'Super Meter', 'G12', 12, 'Super Combo Finisher', '1 Bonus Action (1x per Long Rest)', 'Melee (5 ft)', 'Physique / Agility Attack', 'Setelah memberi/menerima total 3 hit dalam satu combat, lepaskan jurus super: 4d6 + Mod Talent damage dan target Dazed.', 'Menguras bar meter energi penuh untuk melancarkan kombo sinematik penutup ronde.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('strategist_g11_analisis_minmax', 'strategist', 'Analisis Min-Max', 'G11', 11, 'Tactical Assessment', '1 Bonus Action (PBx per Long Rest)', '30 ft', 'Intelligent / Academic', 'Analisis 1 lawan: DM menyebutkan AC, kelemahan, dan resistensinya; kawan mendapat +1d4 damage ke target tersebut hingga akhir adegan.', 'Memindai statistik perlengkapan dan kebiasaan gerak musuh layaknya membaca wiki game.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('strategist_g12_meta_breaker', 'strategist', 'Meta Breaker', 'G12', 12, 'Meta Disruption', '1 Action (1x per Long Rest)', '30 ft', 'Intelligent / Academic', 'Terhadap target yang telah dianalisis: semua serangan kawan mendapat +2 to hit dan target Disadvantage pada saving throw pertamanya selama 1 menit.', 'Mengeksploitasi celah algoritma taktik lawan yang meruntuhkan seluruh skema pertahanannya.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tier = EXCLUDED.tier,
  unlock_grade = EXCLUDED.unlock_grade,
  move_type = EXCLUDED.move_type,
  cost = EXCLUDED.cost,
  range = EXCLUDED.range,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description;
