-- Migration: 20261013000002_archetype_and_combat_action_rework.sql
-- Description: Implement Archetype Rework (+3 stat points, roll bonus, social focus, 3 unique traits),
--              Social Class Mechanical Perks & Drawbacks, and Standard Combat Action Economy (5e Adaptation).

BEGIN;

-- 1. Schema Enhancements for archetypes
ALTER TABLE public.archetypes
  ADD COLUMN IF NOT EXISTS roll_bonus JSONB,
  ADD COLUMN IF NOT EXISTS social_focus JSONB,
  ADD COLUMN IF NOT EXISTS unique_traits JSONB;

-- 2. Schema Enhancements for social_classes
ALTER TABLE public.social_classes
  ADD COLUMN IF NOT EXISTS privilege TEXT,
  ADD COLUMN IF NOT EXISTS perks JSONB,
  ADD COLUMN IF NOT EXISTS drawback TEXT;

-- 3. Schema Enhancements for basic_actions
ALTER TABLE public.basic_actions
  ADD COLUMN IF NOT EXISTS action_type TEXT DEFAULT 'action';

-- 4. Update / Seed 8 Archetypes with Rework Data
UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Funny Bone", "description": "Menambahkan +1d4 Damage Composure pada semua Club Move atau aksi verbal yang berhasil mengejek/mempermalukan lawan."}'::jsonb,
  social_focus = '{"name": "Icebreaker", "description": "Karakter otomatis disukai oleh murid berstatus Biasa/Kalem. Advantage pada semua check untuk mencairkan suasana kaku atau kecanggungan."}'::jsonb,
  unique_traits = '[
    {"id": "tension_breaker", "name": "Tension Breaker", "cost": "1 Action (1x / Short Rest)", "effect": "Memulihkan 1d6 Composure ke seluruh sekutu dalam radius 30 ft."},
    {"id": "class_buffoon", "name": "Class Buffoon", "cost": "Pasif", "effect": "Advantage pada check berpura-pura konyol atau tidak sengaja demi menghindari hukuman ringan/teguran guru."},
    {"id": "heckler_resistance", "name": "Heckler Resistance", "cost": "Pasif", "effect": "Kebal terhadap status Fluster akibat ejekan, celaan, atau sorakan penonton/murid lain."}
  ]'::jsonb
WHERE id = 'class_clown';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Heavy Stance", "description": "Menambahkan +2 Damage Fisik/Unarmed saat menyerang target yang memiliki ukuran lebih besar atau level lebih tinggi."}'::jsonb,
  social_focus = '{"name": "Street Respect", "description": "Disegani murid berandalan dan anak jalanan. Otomatis lolos tanpa roll saat melakukan Intimidation/Aura Check terhadap adik kelas."}'::jsonb,
  unique_traits = '[
    {"id": "street_crew", "name": "Street Crew", "cost": "1x / Long Rest", "effect": "Memanggil 1-2 NPC geng jalanan untuk membantu situasi konflik non-akademik, menjadi distraction, atau mengumpulkan intel rahasia."},
    {"id": "street_smart_navigation", "name": "Street Smart Navigation", "cost": "Pasif", "effect": "Tahu semua celah rahasia di area sekolah (jalan pintas bolos, area blindspot CCTV, atau lubang pagar)."},
    {"id": "scruffy_durability", "name": "Scruffy Durability", "cost": "Pasif", "effect": "Mendapatkan tambahan +2 Temporary HP setiap kali memasuki combat atau pertikaian fisik."}
  ]'::jsonb
WHERE id = 'delinquent';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Cold Mind", "description": "Menambahkan +2 pada semua Mind & Emotional Saving Throws. Memiliki Resistance terhadap Composure Damage dari ejekan atau provokasi langsung."}'::jsonb,
  social_focus = '{"name": "Unreadable Vibe", "description": "Orang lain tidak bisa membaca emosi atau niat aslimu (Passive Insight/Vibe Check lawan mengalami penalti -5 terhadapmu)."}'::jsonb,
  unique_traits = '[
    {"id": "eerie_silence", "name": "Eerie Silence", "cost": "1 Action", "effect": "Memaksa 1 target melakukan Mind Save (DC=8+PB+MNDMod). Jika gagal, target kehilangan 1d6 Composure dan menderita status Shaken."},
    {"id": "corner_dweller", "name": "Corner Dweller", "cost": "Pasif", "effect": "Saat berada sendirian di area sepi atau sudut ruangan, mendapat bonus +2 Passive Perception."},
    {"id": "headphone_sanctuary", "name": "Headphone Sanctuary", "cost": "Pasif", "effect": "Selama memakai headphone/earphone, kebal terhadap gangguan suara sekitar (Noise) dan Advantage pada Mind Save melawan provokasi auditori."}
  ]'::jsonb
WHERE id = 'emo';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Athletic Burst", "description": "Menambahkan +10 ft Movement Speed dan memberikan +2 bonus pada Roll Attack Fisik di ronde pertama pertarungan."}'::jsonb,
  social_focus = '{"name": "School Star", "description": "Mudah mendapatkan simpati dari klub olahraga dan guru Penjaskes. Semua Looks Check sesaat setelah aksi fisik mendapat Advantage."}'::jsonb,
  unique_traits = '[
    {"id": "adrenaline_rush", "name": "Adrenaline Rush", "cost": "Bonus Action (1x per Short Rest)", "effect": "Ketika Physical HP berada di bawah 50%, kamu bisa langsung memulihkan 1d8 Physical HP secara instan."},
    {"id": "second_wind_stamina", "name": "Second Wind Stamina", "cost": "Pasif", "effect": "Mengurangi durasi status Fatigue atau Exhaustion akibat aktivitas fisik berat sebesar setengahnya."},
    {"id": "locker_room_locker", "name": "Locker Room Locker", "cost": "Pasif", "effect": "Memiliki akses mudah ke fasilitas olahraga sekolah (ruang ganti, alat fitness, gudang bola) tanpa izin khusus."}
  ]'::jsonb
WHERE id = 'jock';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Analytical Strike", "description": "Ketika menyerang target yang sudah dianalisis kelemahannya, kamu mendapatkan +1d4 Bonus Damage (Fisik atau Composure)."}'::jsonb,
  social_focus = '{"name": "Academic Leverage", "description": "Guru dan staf sekolah memberikan kepercayaan penuh padamu. Kamu bisa memberi bantuan PR/tugas ke murid lain untuk jaminan Social Favor."}'::jsonb,
  unique_traits = '[
    {"id": "quick_analysis", "name": "Quick Analysis", "cost": "Bonus Action", "effect": "Menganalisis kelemahan target: aksi berikutnya ke target mendapat Advantage dan mengabaikan 2 poin AC fisik/sosial target."},
    {"id": "speed_reader", "name": "Speed Reader", "cost": "Pasif", "effect": "Mampu membaca dan memahami dokumen, lembar tugas, atau catatan akademis 2x lebih cepat dibanding murid biasa."},
    {"id": "correction_instinct", "name": "Correction Instinct", "cost": "Reaction (1x per Short Rest)", "effect": "Saat seseorang salah fakta di depan umum, koreksi spontan memberi penalti -2 pada Social Check mereka berikutnya."}
  ]'::jsonb
WHERE id = 'nerd';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Consistent Average", "description": "(Proficiency Bonus + Level / Long Rest). Reaction: Mengubah hasil d20 di bawah 8 pada check non-combat menjadi nilai pasti 9 + Stat Modifier."}'::jsonb,
  social_focus = '{"name": "Out of Sight", "description": "Bebas dari radar kecemburuan sosial. Guru BP, OSIS, maupun geng berandalan tidak pernah mencurigaimu sebagai dalang kerusuhan (Bystander Immunity)."}'::jsonb,
  unique_traits = '[
    {"id": "pure_luck", "name": "Pure Luck", "cost": "1x per Long Rest", "effect": "Ketika kamu atau sekutu dalam 10 ft mengalami Critical Failure, batalkan kejadian tersebut karena kebetulan yang beruntung."},
    {"id": "unremarkable_face", "name": "Unremarkable Face", "cost": "Pasif", "effect": "Guru BP atau petugas keamanan sekolah membutuhkan waktu 2x lebih lama untuk mengenali/mengidentifikasimu di CCTV blur."},
    {"id": "comfort_zone", "name": "Comfort Zone", "cost": "Pasif", "effect": "Mengulur waktu 5 menit saat Short Rest memberikan pemulihan tambahan sebesar +2 Composure."}
  ]'::jsonb
WHERE id = 'normies';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Social Pressure", "description": "Menambahkan +2 pada DC Saving Throw dari semua Club Move yang berbasis Looks."}'::jsonb,
  social_focus = '{"name": "Trendsetter", "description": "Advantage Skill untuk mengubah opini publik atau rumor tentang seorang murid hanya dalam waktu 1 hari sekolah melalui kata-kata atau postingan medsos."}'::jsonb,
  unique_traits = '[
    {"id": "vip_name_drop", "name": "VIP Name-Drop", "cost": "Reaction (PB x per Long Rest)", "effect": "Ketika kamu atau sekutu akan menerima sanksi atau penurunan reputasi, sebut nama figur berpengaruh untuk membatalkannya."},
    {"id": "dress_code_immunity", "name": "Dress Code Immunity", "cost": "Pasif", "effect": "Pelanggaran kecil atribut seragam selalu dimaklumi oleh OSIS atau guru selama berada di lingkungan sekolah."},
    {"id": "photogenic_advantage", "name": "Photogenic Advantage", "cost": "Pasif", "effect": "Selalu berpose sempurna dalam foto/video; kebal terhadap foto buruk yang coba digunakan merusak reputasimu."}
  ]'::jsonb
WHERE id = 'popular_kids';

UPDATE public.archetypes
SET
  roll_bonus = '{"name": "Dramatic Flare", "description": "Jika memperagakan pose atau mengucapkan nama jurus sebelum melakukan roll, tambahkan +2 pada hasil Roll/Check tersebut."}'::jsonb,
  social_focus = '{"name": "Sub-Culture Brotherhood", "description": "Otomatis bersahabat dengan sesama anggota klub hobi/komik/game. Advantage saat mencari barang langka/kolektor di sekolah."}'::jsonb,
  unique_traits = '[
    {"id": "secret_chuunibyou_technique", "name": "Secret Chuunibyou Technique", "cost": "1 Action", "effect": "Serangan emosional dramatis 1d8 Composure Damage (menjadi 1d10 + Luck Mod jika peragakan pose spontan)."},
    {"id": "gacha_luck", "name": "Gacha Luck", "cost": "1x per Hari Sekolah", "effect": "Saat membeli barang acak (gacha kantin, jajanan bermerek, mystery box), selalu dapat item varian langka/terbaik."},
    {"id": "obscure_lore_master", "name": "Obscure Lore Master", "cost": "Pasif", "effect": "Advantage pada Intelligence Check untuk mengingat detail budaya pop, sejarah fiksi, bahasa rahasia, atau rumor internet."}
  ]'::jsonb
WHERE id = 'weeb';

-- 5. Update / Seed Social Classes with Mechanical Perks & Drawbacks
UPDATE public.social_classes
SET
  privilege = 'Beli barang/jasa biasa tanpa roll. 1×/Long Rest gunakan nama/koneksi orang tua untuk membatalkan 1 penalti pelanggaran sekolah atau meminta izin khusus guru.',
  perks = '[{"id": "pampered_comfort", "name": "Pampered Comfort", "effect": "Memulai hari dengan +2 Temporary Composure."}]'::jsonb,
  drawback = 'Disadvantage pada check Street di lingkungan kumuh/pasar, serta menjadi target utama pemerasan dan gosip.'
WHERE id = 'rich';

UPDATE public.social_classes
SET
  privilege = 'Akses kendaraan pribadi (membawa 1 sekutu berpindah lokasi 2× lebih cepat tanpa memakan waktu/AP).',
  perks = '[{"id": "academic_edge_generous", "name": "Academic Edge & Generous", "effect": "Advantage pada 1 check Academic per hari. 1×/Short Rest saat mentraktir/berbagi konsumsi, berikan +1d4 Composure ke 1 teman."}]'::jsonb,
  drawback = 'Disadvantage pada Mind Save melawan status Fluster saat Composure-mu di bawah 50%.'
WHERE id = 'medium_rich';

UPDATE public.social_classes
SET
  privilege = 'Punya bekal makan siang rumah yang hemat operasional harian.',
  perks = '[{"id": "home_cooked_balanced", "name": "Home-Cooked & Balanced", "effect": "Bekal rumah memulihkan ekstra +1d6 Composure saat Short Rest (bisa dibagi). Dapatkan bonus pasif +1 pada seluruh Mind Save."}]'::jsonb,
  drawback = 'Karakter biasa tanpa akses koneksi khusus ke figur otoritas maupun jalanan.'
WHERE id = 'medium';

UPDATE public.social_classes
SET
  privilege = 'Diskon 30% saat membeli item konsumsi/peralatan karena jago menawar.',
  perks = '[
    {"id": "diy_repair", "name": "DIY Repair", "effect": "Memperbaiki item/alat rusak tanpa biaya menggunakan barang bekas."},
    {"id": "thrifty_nutrition", "name": "Thrifty Nutrition", "effect": "Memulihkan +1d4 HP/Composure tambahan tiap kali menggunakan item konsumsi paling murah."},
    {"id": "resourceful_eye", "name": "Resourceful Eye", "effect": "Advantage saat mencari barang bekas atau alat berguna di area sekolah/kota."}
  ]'::jsonb,
  drawback = 'Penalti -2 check Charm saat berada di tempat mewah atau acara sosial elite.'
WHERE id = 'medium_poor';

UPDATE public.social_classes
SET
  privilege = 'Kehidupan mandiri dengan insting gotong royong tinggi, modal uang sangat minim.',
  perks = '[
    {"id": "found_family_shield", "name": "Found Family Shield", "cost": "Bonus Action", "effect": "Saat membantu sekutu yang HP/Composure-nya di bawah 50%, dapatkan bonus +2 Guard (AC) fisik & sosial."},
    {"id": "shared_pain", "name": "Shared Pain (Empathy)", "limit": "1x / Long Rest", "effect": "Saat sekutu dalam jarak 15 ft menerima damage Composure, kamu bisa menanggung setengah damage tersebut."},
    {"id": "street_kinship", "name": "Street Kinship", "effect": "Advantage check People saat berinteraksi dengan sesama karakter tersisih/NPC kelas bawah."}
  ]'::jsonb,
  drawback = 'Disadvantage check Influence saat bernegosiasi dengan figur otoritas sekolah (guru/staf/OSIS).'
WHERE id = 'orphanage';

UPDATE public.social_classes
SET
  privilege = 'Hampir tidak ada modal finansial/koneksi resmi.',
  perks = '[
    {"id": "unbreakable_determination", "name": "Unbreakable Determination", "effect": "Saat Physical HP atau Composure-mu menyentuh angka 0 pertama kali dalam satu sesi, roll d20: hasil 8+ membuatmu bertahan di 1 HP/Composure."},
    {"id": "hard_work_stamina", "name": "Hard Work Stamina", "effect": "Advantage permanen pada semua check Stamina dan Street. Imun terhadap penalti kelelahan tingkat pertama dan cuaca ekstrem."},
    {"id": "brawler_spirit", "name": "Brawler Spirit", "effect": "Saat bertarung tanpa senjata/alat mewah, serangan fisikmu memberikan +2 damage tambahan."}
  ]'::jsonb,
  drawback = 'Guru BP dan satpam selalu mencurigaimu lebih dulu saat terjadi kekacauan di sekolah.'
WHERE id = 'poor';

-- 6. Seed / Update 8 Standard Combat Action Economy in basic_actions
INSERT INTO public.basic_actions (id, name, category, cost, check_type, effect, description, action_type)
VALUES
  ('action_unarmed_strike', 'Pukulan/Serangan Fisik (Unarmed Strike)', 'basic_combat', 'Action', 'Physique / Power (vs Guard Fisik Target)', '1d4 + Mod Physique Physical Damage', 'Pukulan mentah, tamparan, atau tendangan kuat saat adu fisik jarak dekat.', 'action'),
  ('action_shove', 'Dorongan Kuat (Shove)', 'basic_combat', 'Action', 'Physique / Power vs Target Physique Save', 'Target terdorong 5 ft atau jatuh Prone', 'Mendorong lawan dengan kedua tangan penuh tenaga untuk merusak posisi berdirinya.', 'action'),
  ('action_dodge_guard', 'Tangkis & Bertahan (Dodge & Guard)', 'basic_combat', 'Action', 'Otomatis', '+2 Physical & Social Guard (AC) hingga awal giliranmu berikutnya', 'Memasang kuda-kuda rapat dan memfokuskan pertahanan terhadap semua serangan.', 'action'),
  ('action_help_support', 'Bantuan & Dukungan (Help / Support)', 'basic_social', 'Action', 'Mind / Interpersonal (atau Sub-Skill relevan)', 'Memberikan Advantage pada roll check berikutnya milik 1 sekutu', 'Memberikan arahan taktis, memegangi objek, atau membantu teman secara langsung.', 'action'),
  ('action_disengage', 'Kabur & Menghindar (Disengage)', 'basic_combat', 'Action', 'Physique / Agility', 'Gerakanmu tidak memicu Opportunity Attack selama ronde ini', 'Mundur dengan langkah cerdas memanfaatkan celah pergerakan lawan.', 'action'),
  ('action_social_remark', 'Ucapkan Kata-Kata / Gestur Sosial (Social Remark)', 'basic_social', 'Bonus Action', 'Sub-Skill Sosial (Charm / Aura / People / Interpersonal vs Target Mind Save / DC)', 'Fleksibel (DM Menentukan Outcome)', 'Melontarkan ejekan/sindiran, tatapan intimidasi, rayuan singkat, atau teriakan penyemangat di sela aksi.', 'bonus_action'),
  ('action_use_item', 'Gunakan Barang / Konsumsi (Use Item / Consume)', 'basic_utility', 'Bonus Action', 'Otomatis', 'Meminum minuman kemasan, memakan bekal/permen, atau menggunakan peralatan kecil dari saku/tas', 'Aksi praktis mengambil dan menggunakan item konsumsi ringan di tengah pertempuran atau eksplorasi.', 'bonus_action'),
  ('action_opportunity_attack', 'Serangan Kesempatan (Opportunity Attack)', 'basic_combat', 'Reaction', 'Physique / Power (vs Guard Fisik Target)', 'Lakukan 1 kali Unarmed Strike (1d4 + Mod Physique) atau serangan senjata jarak dekat standar.', 'Memanfaatkan kelengahan lawan saat mereka mencoba kabur atau berpindah posisi di dekatmu.', 'reaction')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  cost = EXCLUDED.cost,
  check_type = EXCLUDED.check_type,
  effect = EXCLUDED.effect,
  description = EXCLUDED.description,
  action_type = EXCLUDED.action_type;

COMMIT;
