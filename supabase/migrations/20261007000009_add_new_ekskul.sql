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
