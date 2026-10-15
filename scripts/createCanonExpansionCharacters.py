#!/usr/bin/env python3
"""
Script to generate 26 new canonical characters for Damsel & Desire:
- 5 Heroines in Class 11-1 (Alya, Rinoka, Miku, Teiko, Vesna)
- 1 Music Club President (Hanase Tamanibu in 11-2)
- 1 Kokuhou Field Leader (Tahagusa Kazugumi in 11-2)
- 1 Kokuhou Founder Alumnus (Kurogane Tetsuo)
- 5 Male Faculty (Kashisaka Seichi, Kurosaki Jin, Dr. Heinrich Vogel, Gonda Gennosuke, Moriyama Daisuke)
- 5 Male Students in Class 11-1 (Saotome Riku, Fujiwara Kenji, Yuki Haruto, Shinoda Renzo, Kuroda Gin)
- 4 Male Students in Class 11-2 (Mawatari Bando, Ouga Tesshin, Komiya Junta, Sendo Kyosuke)
- 4 Touki Vocational Delinquents (Onizuka Gouki, Kanzawa Ryuuji, Samejima Ren, Kiba Touya)

Generates:
1. Character Markdown Profile (<NAME>.md)
2. Character Image Generation Prompt (prompt.md)
"""

import os
import json

BASE_DIR = "/home/nothrovo/Documents/Obsidian Vault/DND/Damsel and Desire"

CHARACTERS = [
    # -------------------------------------------------------------------------
    # HEROINES (CLASS 11-1)
    # -------------------------------------------------------------------------
    {
        "id": "alisa_mikhailovna",
        "name": "Alisa Mikhailovna Voronina (アリサ・ミハイロヴナ・ヴォローニナ)",
        "nickname": ["Alya", "Alya-san", "Putri Perak Moskow", "Bendahara Dingin"],
        "role": "Presidium OSIS & Bendahara Komite Pertukaran Pelajar",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "osis",
        "age": 16,
        "birthday": "7 November",
        "zodiac": "Scorpio",
        "mbti": "INTJ",
        "gender": "Female",
        "archetype": "popular_kids",
        "ekskul": "student_council",
        "club_role": "Bendahara Pertukaran Pelajar & Presidium OSIS",
        "social_class": "elite",
        "hit_die": "d8",
        "primary_stats": ["intelligent", "looks"],
        "saving_throws": ["intelligent", "looks"],
        "stats": {"physique": 11, "intelligent": 16, "looks": 17, "mind": 15, "talent": 14, "luck": 11},
        "vitals": {"physical_hp_max": 12, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": [
            "Teh hitam hangat dengan sesendok selai stroberi (Varenie)",
            "Membaca novel klasik Rusia di dekat jendela perpustakaan",
            "Merapikan pembukuan kas sampai tidak ada selisih satu yen pun",
            "Seseorang yang berusaha keras tanpa mengeluh",
            "Menonton video kucing lucu diam-diam di kamarnya"
        ],
        "dislikes": [
            "Orang malas yang suka menggampangkan tugas kelompok",
            "Dipandang hanya dari penampilan fisiknya",
            "Ketahuan saat sedang salah tingkah dan bergumam bahasa Rusia",
            "Makanan pedas yang membakar lidahnya"
        ],
        "dir": "Characters/Love Interests/Class 11-1/Alya",
        "filename": "ALISA MIKHAILOVNA VORONINA (アリサ・ミハイロヴナ・ヴォローニナ).md",
        "tagline": "Jangan salah paham. Aku meminjamkan catatan matematikaku ini bukan karena mengkhawatirkanmu, tapi karena jika nilaimu jeblok, rata-rata kelas 11-1 akan turun dan itu mengganggu estetikaku. ...Идиот (Bodoh).",
        "appearance_md": """* **Ciri Fisik & Wajah:** Kulit putih pucat mulus bak salju pertama Siberia, rahang ramping elegan, hidung mancung mungil, dan sepasang mata biru kristal es (*glacial crystal blue*) yang tajam namun memancarkan kilau rapuh. Pipi dan telinganya sangat sensitif dan cepat merona merah muda saat emosinya terusik.
* **Rambut:** Rambut perak platinum panjang lurus sepinggang yang berkilau sejuk di bawah sinar matahari. Poni depannya dipotong rapi membingkai dahi dengan bando kain putih polos (*white Alice headband*) yang menjadi ciri khasnya.
* **Postur & Gestur:** Tinggi semampai (167 cm), bahu ramping dengan postur tegak sempurna ala bangsawan. Sering menyilangkan tangan di depan dada sambil sedikit mendongak acuh tak acuh.
* **Seragam & Gaya Berpakaian:** Mengenakan seragam pelaut Housen Academy yang dipadukan dengan rompi rajut (*knit vest*) berwarna biru es pastel tanpa lengan, kaus kaki hitam ketat di bawah lutut, dan sepatu pantofel kulit mengilap.
* **Aksesori & Barang Bawaan:** Jam tangan wanita tipis berplatina, binder arsip OSIS berwarna putih-perak, dan pulpen perak berukir inisial keluarganya.""",
        "personality_traits": "Tampak sangat dingin, berjarak, dan perfeksionis di luar (*The Unapproachable Ice Beauty*). Ia selalu berbicara dengan nada baku, logis, dan penuh wibawa. Namun di balik topeng ketatnya, Alya sebenarnya sangat emosional, mudah tersipu, dan haus akan apresiasi tulus. Sifat uniknya yang paling ikonik: jika ia merasa gugup, senang, atau cemburu berat pada seseorang, ia akan melontarkan pujian manis atau umpatan manja dalam bahasa Rusia fasih dengan wajah datar, mengira orang di hadapannya tidak akan pernah paham.",
        "personality_flaws": "Terlalu keras pada diri sendiri dan enggan meminta tolong pada orang lain karena takut terlihat lemah. Ia memikul beban ekspektasi keluarga diplomatik besar sendirian di pundaknya.",
        "dere_pattern": "Tipe Kuudere / Tsundere Berbahasa Rusia. Jika hatinya luluh, ia akan diam-diam menyelipkan cokelat artisan di meja pemain, atau duduk sangat dekat sambil bergumam: *'Я тебя люблю' (Aku mencintaimu)* lalu membuang muka pura-pura batuk.",
        "bg_childhood": "Lahir di Vladivostok dari ayah diplomat Rusia dan ibu berdarah Jepang. Tumbuh dengan disiplin tinggi di lingkungan multikultural.",
        "bg_turning_point": "Pindah ke Housen Academy pada awal kelas 10. Ia sempat merasa terasing karena tatapan iri murid lain, sampai Asahina Tenka mengajaknya masuk komite pertukaran pelajar OSIS.",
        "bg_current": "Kini di kelas 11-1, Alya menjadi salah satu pilar administrasi paling disegani di Presidium OSIS Housen.",
        "club_life": "Mengatur pertukaran pelajar internasional, anggaran delegasi, dan menyusun laporan triwulan OSIS bersama Tenka dan Miruam.",
        "relationships_md": """* **Asahina Tenka (Ketua OSIS):** Menghormati Tenka sebagai sosok pemimpin yang hangat dan selalu mampu mencairkan suasana.
* **Miruam Solari:** Rekan diskusi intelektual sesama blasteran Eropa; sering minum teh Earl Grey bersama di balkon OSIS.
* **Kisaragi Setsuna:** Menghargai ketelitian Setsuna dalam mengaudit pembukuan kas.
* **Protagonist:** Pemain yang berhasil memergoki arti gumaman bahasa Rusianya dan membuat pertahanan rasionalnya hancur berantakan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Alisa Mikhailovna, waist-up, 16-year-old Russian-Japanese high school girl, long straight silver-platinum hair with white Alice headband, crystal ice-blue eyes, pale porcelain skin, slight blush on cheek, elegant cool expression, wearing Japanese sailor uniform with pastel ice-blue knit vest, soft cinematic school lighting, high-end visual novel anime art style."
    },
    {
        "id": "kagami_rinoka",
        "name": "Kagami Rinoka (鏡 璃乃香)",
        "nickname": ["Rino-chan", "Rinoka", "Kitsune-sensei", "Gadis Kacamata Pojok"],
        "role": "Siswi Kelas 11-1 & VTuber Gaming/Karaoke Rahasia",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "19 Februari",
        "zodiac": "Pisces",
        "mbti": "INFP",
        "gender": "Female",
        "archetype": "weeb",
        "ekskul": "broadcasting",
        "club_role": "Operator Audio & Sound Editor (Kelas 11)",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["talent", "mind"],
        "saving_throws": ["talent", "mind"],
        "stats": {"physique": 9, "intelligent": 14, "looks": 14, "mind": 15, "talent": 17, "luck": 13},
        "vitals": {"physical_hp_max": 8, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": [
            "Streaming game horor larut malam sambil teriak kaget",
            "Mikrofon kondensor audio Shure SM7B kesayangannya",
            "Makan mie instan ramen mangkuk pedas jam 2 dini hari",
            "Gantungan kunci rubah virtual bertelinga runcing",
            "Mendengarkan seseorang memuji suara nyanyiannya dengan tulus"
        ],
        "dislikes": [
            "Doxxing atau identitas aslinya di sekolah terbongkar",
            "Koneksi internet lag atau drop frame saat live streaming",
            "Pelajaran olahraga senam irama di depan murid laki-laki",
            "Orang yang menertawakan impian menjadi penyanyi virtual"
        ],
        "dir": "Characters/Love Interests/Class 11-1/Rinoka",
        "filename": "KAGAMI RINOKA (鏡 璃乃香).md",
        "tagline": "Di kelas ini aku cuma bayangan... gadis kacamata tebal yang duduk paling pojok dan ga pernah diajak bicara. Tapi waktu mikrofon ini menyala di kamarku... ratusan ribu orang mendengarkan suaraku. Jangan bocorin rahasia ini ya, kumohon!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah bulat manis yang biasanya tersembunyi di balik kacamata berbingkai bulat tempurung kura-kura (*tortoiseshell round glasses*). Memiliki sepasang mata bulat besar berwarna oranye-amber hangat (*warm honey amber*) yang sangat ekspresif jika kacamata dilepas. Kulitnya putih bersih dengan pipi gembil alami.
* **Rambut:** Rambut hitam pekat bergelombang lembut dipotong model *shaggy wolf-cut* sebahu yang agak berantakan alami. Sering menyelipkan sebagian rambutnya ke belakang daun telinga kiri.
* **Postur & Gestur:** Tinggi mungil (153 cm), sering berjalan agak menunduk sambil merapatkan kedua lengan ke tubuhnya seolah ingin menjadi tak kasat mata.
* **Seragam & Gaya Berpakaian:** Mengenakan seragam pelaut Housen dengan kardigan rajut tebal longgar (*oversized knit cardigan*) berwarna cokelat karamel yang menutupi separuh jemarinya. Rok seragamnya sedikit lebih panjang dari siswi biasa.
* **Aksesori & Barang Bawaan:** Earphone kabel melingkar di leher, tas sekolah penuh pin gacha indie game, serta gantungan kunci boneka rubah oranye bertelinga api yang menjadi maskot saluran virtualnya.""",
        "personality_traits": "Sangat kontras antara persona dunia nyata dan persona virtualnya. Di sekolah, Rinoka adalah gadis pemalu, bicaranya pelan, dan sering gugup jika dipanggil guru. Namun jika ia merasa nyaman berdua dengan pemain atau saat berada di bilik rekaman audio penyiaran, suara aslinya yang merdu, renyah, dan penuh karisma bintang seketika menguar memukau siapa pun yang mendengar.",
        "personality_flaws": "Rasa percaya diri yang sangat rendah terhadap penampilan fisiknya di dunia nyata (*imposter syndrome*). Ia takut penggemar virtualnya akan kecewa jika tahu siapa sosok asli di balik avatar cantiknya.",
        "dere_pattern": "Tipe Dange-dere / Shy Streamer Dere. Jika menyukai pemain, ia akan membuatkan lagu akustik khusus yang dinyanyikan saat streaming malam dengan lirik penuh kode rahasia yang hanya dipahami oleh pemain.",
        "bg_childhood": "Tumbuh sebagai anak pendiam di pinggiran kota. Menemukan kenyamanan bernyanyi lewat komputer kamar tidurnya.",
        "bg_turning_point": "Menciptakan avatar VTuber saat SMP dan meledak menjadi fenomena digital dengan 500k subscribers.",
        "bg_current": "Masuk ke Housen Academy demi mempelajari teknik penyiaran suara profesional tanpa mau mencolok di kelas.",
        "club_life": "Bertugas mengedit mixing audio drama sekolah dan mengoperasikan konsol mixer studio saat festival panggung.",
        "relationships_md": """* **Shinohara Kotone (Kelas 10-1):** Mengagumi keberanian Kotone yang berani tampil sebagai idola di panggung nyata.
* **Hatsushiba Miku (Kelas 11-1):** Rekan kolaborasi musik rahasia; Miku membuat instrumen beat sementara Rinoka mengisi vocal track.
* **Hanase Tamanibu (11-2):** Sering meminjam peralatan kabel audio studio dari ruang klub musik.
* **Protagonist:** Murid pertama di sekolah yang secara tak sengaja memergokinya sedang bersenandung dengan suara VTuber aslinya di ruang siaran.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kagami Rinoka, 16-year-old Japanese schoolgirl, messy shoulder-length black wolf-cut hair, round tortoiseshell glasses, warm glowing amber-orange eyes, shy sweet blush, wearing Japanese school uniform with loose caramel knit cardigan, oversized sleeves, studio mic aesthetic, charming gap-moe visual novel art."
    },
    {
        "id": "hatsushiba_miku",
        "name": "Hatsushiba Miku (初芝 ミク)",
        "nickname": ["Miku", "Miku-chi", "Diva Toska", "Ratu Synthesizer"],
        "role": "Komposer Musik Digital & Siswi Kelas 11-1",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "31 Agustus",
        "zodiac": "Virgo",
        "mbti": "ENFP",
        "gender": "Female",
        "archetype": "creative",
        "ekskul": "band",
        "club_role": "Komposer Musik Elektronik & Synthesizer",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["talent", "looks"],
        "saving_throws": ["talent", "looks"],
        "stats": {"physique": 10, "intelligent": 14, "looks": 16, "mind": 13, "talent": 18, "luck": 14},
        "vitals": {"physical_hp_max": 10, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": [
            "Membuat melodi elektronik baru di software DAW laptopnya",
            "Jus daun bawang segar dingin & permen mint toska",
            "Melihat ribuan penonton melambaikan glowstick serempak",
            "Membagikan earphone sebelah kiri untuk mendengarkan lagu baru",
            "Desain pakaian panggung bertema futuristik cyber-pop"
        ],
        "dislikes": [
            "Baterai laptop atau synthesizer mati mendadak saat composing",
            "Lagu melodinya dianggap bising atau tidak punya jiwa manusia",
            "Hujan lebat yang membasahi kabel instrumen panggung",
            "Suasana hening yang terlalu canggung tanpa alunan musik"
        ],
        "dir": "Characters/Love Interests/Class 11-1/Miku",
        "filename": "HATSUSHIBA MIKU (初芝 ミク).md",
        "tagline": "Setiap detak jantungmu itu sebenarnya punya ritme BPM sendiri lho! Ayo pasang earphone ini dan dengarkan melodi musim semi yang baru saja kutulis untukmu!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah lonjong mungil dengan kulit cerah bersinar dan sepasang mata toska pirus (*luminous turquoise-cyan*) yang memancarkan energi listrik riang. Senyumannya selalu ceria dan penuh semangat masa muda.
* **Rambut:** Rambut toska kebiruan (*vibrant aqua-cyan*) super panjang yang dikuncir dua tinggi (*ultra-long twin-tails*) hingga menjuntai melewati pinggulnya, diikat dengan sepasang penjepit rambut digital persegi berwarna hitam-merah muda khas.
* **Postur & Gestur:** Ramping dan lincah (158 cm), sering melompat kecil saat berjalan, kedua tangannya terbiasa bergerak mengetuk-ngetuk udara mengikuti ketukan nada musik di kepalanya.
* **Seragam & Gaya Berpakaian:** Modifikasi seragam pelaut Housen tanpa lengan (*sleeveless white blouse*) dengan kerah pelaut abu-abu bergaris toska, dasi toska ramping, dipadukan dengan sarung lengan (*arm-sleeves*) hitam panjang terpisah berpanel aksen equalizer digital mikro. Rok lipit abu-abu pendek dengan trim toska.
* **Aksesori & Barang Bawaan:** Headset nirkabel ramping melingkar di kepalanya, tas ransel laptop tahan air penuh stiker gelombang suara, dan kabel jack audio warna-warni di saku blus.""",
        "personality_traits": "Penuh semangat, optimis tanpa batas, dan jenius dalam meramu progresi akord nada digital. Bagi Miku, musik adalah bahasa universal yang mampu menyatukan anak teladan OSIS maupun berandal jalanan yang sedang patah hati.",
        "personality_flaws": "Sering lupa waktu saat tenggelam dalam proses composing hingga melewatkan jam makan atau tidur di atas keyboard MIDI.",
        "dere_pattern": "Tipe Genki / Musical Dere. Menjadikan pemain sebagai 'Muse' inspirasi nada cintanya, menulis lirik balada yang didedikasikan secara khusus saat konser panggung festival.",
        "bg_childhood": "Belajar piano klasik sejak umur 4 tahun namun jatuh cinta pada musik synthesizer modern saat SMP.",
        "bg_turning_point": "Karya lagu orisinalnya viral di platform streaming sekolah, membuatnya diajak bergabung ke klub musik Housen.",
        "bg_current": "Menjadi komposer utama panggung festival dan aransemen tema upacara pembukaan sekolah.",
        "club_life": "Mengatur synthesizers, keyboard sampler, dan efek suara panggung bersama Hanase Tamanibu dan Kirishima Iori.",
        "relationships_md": """* **Shinohara Kotone (10-1):** Sering menuliskan lagu melodi vokal khusus untuk dibawakan oleh Kotone di atas panggung.
* **Kasane Teiko (11-1):** Rival sekaligus sahabat berdebat musik; Teiko menyukai distorsi rock sementara Miku menyukai synth-pop jernih.
* **Kirishima Iori (10-1):** Partner jam session; sering menggabungkan petikan gitar elektrik Iori dengan loop beat sintetisnya.
* **Protagonist:** Sosok yang selalu mendengarkan draf demo lagunya dari awal sampai akhir tanpa pernah bosan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Hatsushiba Miku, 16-year-old Japanese schoolgirl, iconic long flowing turquoise twin-tails with black-pink square hair-clips, bright glowing cyan eyes, radiant cheerful smile, sleeveless Japanese sailor shirt with teal necktie, black detached arm warmers, vibrant colorful anime visual novel aesthetic."
    },
    {
        "id": "kasane_teiko",
        "name": "Kasane Teiko (重音 テイコ)",
        "nickname": ["Teto", "Teiko-chan", "Si Bor Ganda", "Ratu Roti Baget"],
        "role": "Penyiar Radio Sekolah, Vokalis Rock & Siswi Kelas 11-1",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "1 April",
        "zodiac": "Aries",
        "mbti": "ESTP",
        "gender": "Female",
        "archetype": "class_clown",
        "ekskul": "broadcasting",
        "club_role": "Penyiar Utama Radio Istirahat Siang & Vokalis Rock",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["talent", "physique"],
        "saving_throws": ["talent", "physique"],
        "stats": {"physique": 12, "intelligent": 12, "looks": 15, "mind": 13, "talent": 17, "luck": 14},
        "vitals": {"physical_hp_max": 12, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": [
            "Roti Prancis baget panjang yang renyah dan gurih",
            "Menyiarkan lagu rock distorsi keras saat jam istirahat siang",
            "Mengerjai murid teladan dengan lelucon absurd (April Mop)",
            "Menyanyi vokal serak bertenaga (*screamo / rock belt*)",
            "Dipuji bahwa gaya rambut bor spiralnya sangat keren"
        ],
        "dislikes": [
            "Dimarahi komite disiplin karena menyetel radio terlalu bising",
            "Roti baget yang lembek dan tidak renyah",
            "Orang sok jaim yang tidak bisa diajak bercanda lepas",
            "Dibilang rambutnya mirip bor penggali tambang"
        ],
        "dir": "Characters/Love Interests/Class 11-1/Teiko",
        "filename": "KASANE TEIKO (重音 テイコ).md",
        "tagline": "Oi oi oi! Siapa bilang radio sekolah cuma boleh nyetel lagu instrumen tidur? Volume maksimal, gitar distorsi distel, dan roti baget di tangan! Kalau Setsuna mau razia, hadapi dulu vokalku!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah ceria penuh ekspresi jahil dengan sepasang mata merah delima menyala (*fiery ruby red*) yang selalu berbinar mencari kesempatan usil. Sudut bibirnya memiliki satu taring kecil (*snaggletooth / yaeba*) yang mencuat imut saat tertawa menyeringai.
* **Rambut:** Rambut merah koral cerah menyala (*vibrant coral red*) yang ditata menjadi sepasang kuncir spiral bor melingkar tebal (*twin drill pigtails*) di kedua sisi kepalanya. Poni depannya berpotongan melengkung lucu di atas alis.
* **Postur & Gestur:** Bertubuh atletis ramping dan gesit (159 cm), sering meletakkan kedua tangan di pinggang dengan tawa bangga, atau mengacungkan roti baget seperti pedang pendek.
* **Seragam & Gaya Berpakaian:** Seragam pelaut Housen bernuansa abu-abu gelap dengan trim merah koral, dasi pita kupu-kupu merah tua, dipadukan dengan jaket zip-up kulit sintetis hitam berkerah tegak yang sering disampirkan di pundak.
* **Aksesori & Barang Bawaan:** Ear cuff perak bermotif sayap di telinga kanan, kantong kertas cokelat berisi roti baget hangat, dan mikrofon genggam portabel berperekat stiker tengkorak chibi.""",
        "personality_traits": "Blak-blakan, penuh energi meledak-ledak, dan sangat setia kawan. Ia tidak segan-segan mendobrak aturan kaku jika aturan itu merugikan teman-temannya. Di balik sikap badungnya, Teiko memiliki kepekaan emosional yang tinggi terhadap ketidakadilan.",
        "personality_flaws": "Suka bertindak impulsif sebelum berpikir panjang, sering memicu pertengkaran mulut dengan Komite Disiplin.",
        "dere_pattern": "Tipe Tsundere Usil / Teasing Bakaderu. Caranya menggoda pemain adalah dengan membagikan separuh roti bagetnya, atau mengumumkan pesan cinta terselubung di mikrofon radio sekolah saat bel pulang berbunyi.",
        "bg_childhood": "Tumbuh di keluarga pengusaha toko roti lokal. Belajar menyanyi rock dari paman bassist band underground.",
        "bg_turning_point": "Memenangkan audisi panggung musik distrik dan berhasil merebut posisi penyiar radio sekolah di Housen.",
        "bg_current": "Menjadi ikon pemberontak ceria di kelas 11-1 yang selalu mencairkan ketegangan politik sekolah.",
        "club_life": "Menguasai bilik siaran sekolah setiap pukul 12.30 siang dan menjadi vokalis tamu klub musik rock.",
        "relationships_md": """* **Hatsushiba Miku (11-1):** Rekan debat musik abadi; mereka sering duet lagu rock-elektronik yang menggemparkan aula.
* **Kisaragi Setsuna (11-2):** Musuh bebuyutan dalam urusan volume siaran radio dan razia seragam.
* **Hanase Tamanibu (11-2):** Sering nongkrong di studio musik menghabiskan camilan roti bersama.
* **Protagonist:** Korban lelucon favoritnya yang selalu ia lindungi dari gangguan preman luar.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kasane Teiko, 16-year-old Japanese schoolgirl, iconic coral-red twin drill spiral pigtails, ruby red eyes, cute snaggletooth smirk, dark grey Japanese school uniform with red ribbon tie, silver wing ear-cuff, energetic rebellious visual novel art style."
    },
    {
        "id": "vesna_strivozha",
        "name": "Vesna Strivozha (ヴェスナ・ストリヴォージャ)",
        "nickname": ["Vesna", "Snowy Banquet's Blade", "Putri Peri Anggar", "Komandan Vila"],
        "role": "Komandan Siswa Tamu Snezhnaya, Atlet Anggar & Siswi Kelas 11-1",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "23 September",
        "zodiac": "Libra",
        "mbti": "ENTP",
        "gender": "Female",
        "archetype": "popular_kids",
        "ekskul": "martial_arts",
        "club_role": "Kapten Tamu Klub Anggar Modern (*Modern Fencing*)",
        "social_class": "elite",
        "hit_die": "d10",
        "primary_stats": ["physique", "talent"],
        "saving_throws": ["physique", "looks"],
        "stats": {"physique": 15, "intelligent": 14, "looks": 17, "mind": 14, "talent": 17, "luck": 12},
        "vitals": {"physical_hp_max": 14, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": [
            "Latihan anggar pedang rapier di aula berkaca saat pagi berkabut",
            "Tarian pesta dansa musim semi (*Spring Morning Dance*)",
            "Matahari cerah setelah badai salju panjang",
            "Kue tartlet madu dingin dengan hiasan kelopak gula es",
            "Melihat kucing liar bermain di taman (suka menyelamatkan hewan kecil)"
        ],
        "dislikes": [
            "Protokol bangsawan yang terlalu kaku dan membosankan",
            "Ksatria atau petarung yang menggunakan trik curang dan racun",
            "Orang yang menyentuh ujung pedang anggarnya tanpa izin",
            "Hari yang terlalu panas dan lembap di musim panas"
        ],
        "dir": "Characters/Love Interests/Class 11-1/Vesna",
        "filename": "VESNA STRIVOZHA (ヴェスナ・ストリヴォージャ).md",
        "tagline": "Titel komandan atau putri bangsawan bisa menunggu di depan pintu. Di atas matras anggar ini, hanya ada kecepatan pedang dan ketulusan hatimu yang berbicara. Ayo, tunjukkan padaku apakah tekadmu bisa menembus badai esku!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah bangsawan bergaris halus yang sangat cantik memesona bak peri es mitologi Slavic. Memiliki sepasang telinga panjang berujung runcing (*elongated pointed elf-ears*) khas garis darah Vila kuno. Sepasang matanya berwarna biru toska (*radiant aquamarine/cyan*) dengan pola pupil bintang berujung runcing yang berkilau pendar, dihiasi rona merah muda lembut di kedua pipinya. Senyumannya cerah, anggun, dan penuh percaya diri.
* **Rambut:** Rambut pirang emas bercahaya (*vibrant golden-blonde*) panjang yang ditata menjadi kuncir kuda tinggi (*high sweeping ponytail*) yang memilin menjadi spiral drill tebal anggun di bagian belakang, diikat dengan pita sutra berwarna toska-hijau laut (*teal ribbon bow*). Poni depannya lurus rapi membingkai dahi dengan juntaian ikal melingkar lembut di samping pipi dan melewati telinga peri runcingnya.
* **Postur & Gestur:** Bertubuh ramping semampai bak atlet seluncur es (*figure skater grace*, tinggi 166 cm), gerakannya luar biasa lincah dan berwibawa. Sering meletakkan satu tangan di pinggang rampingnya sementara tangan kanannya memutar pedang anggar rapier dengan presisi mematikan.
* **Seragam & Gaya Berpakaian:** Modifikasi seragam anggar Housen berpotongan korset putih-toska muda (*seafoam/cyan*) tanpa bahu dengan piping putih dan aksen filigri emas aristokratik. Di pinggulnya terikat pita besar berwarna persik (*coral/peach ribbon bow*) dengan gesper lambang emas kepingan salju. Mengenakan sarung tangan putih anggar berenda dan sepatu bot anggar putih berhak emas.
* **Aksesori & Barang Bawaan:** Tiara kristal es perak bermahkotakan batu permata sian berlian di keningnya, pedang rapier anggar berujung kristal mawar es, dan bros lambang Snezhnaya Druzhna di kerahnya.""",
        "personality_traits": "Bebas, berjiwa petualang, menjunjung tinggi kehormatan pedang, namun sangat suka bercanda dan bermain trik santai di waktu luangnya. Meskipun berasal dari klan Strivozha yang terhormat, Vesna membenci formalitas aristokrat yang sombong dan lebih suka bergaul akrab dengan murid biasa yang tulus.",
        "personality_flaws": "Terkadang terlalu percaya diri dengan kelincahan fisiknya hingga meremehkan bahaya politik kotor geng jalanan.",
        "dere_pattern": "Tipe Ojou-sama Ksatria yang Bebas (Knight-Princess Dere). Menghargai keberanian dan integritas. Jika jatuh cinta, ia akan menantang pemain berdansa di bawah guyuran bunga sakura dan menghadiahkan lencana kristal es pelindung keluarga Strivozha.",
        "bg_childhood": "Dilahirkan sebagai putri keluarga Strivozha di Snezhnaya, mewarisi darah ksatria Vila dan dilatih anggar sejak usia dini.",
        "bg_turning_point": "Menjadi komandan regu pengawal kehormatan Druzhna berkat prestasi tempurnya sendiri sebelum dikirim ke Housen sebagai delegasi kehormatan.",
        "bg_current": "Menempuh pendidikan di kelas 11-1 dan memimpin pertukaran seni bela diri anggar modern di Housen.",
        "club_life": "Berlatih duel anggar rapier setiap sore di dojo bela diri bersama Miruam Solari dan Tachibana Rin.",
        "relationships_md": """* **Miruam Solari (11-1):** Rekan tanding terdekat; Miruam menggunakan Kendo Jepang sementara Vesna menggunakan Anggar Eropa, menciptakan duel teknik timur-barat yang spektakuler.
* **Asahina Tenka (11-1):** Sahabat makan siang; Tenka sering mengajaknya mencicipi camilan khas Jepang.
* **Alisa Voronina (11-1):** Rekan sesama perwakilan Eropa Timur; mereka sering mengobrol santai soal kampung halaman.
* **Protagonist:** Ksatria baru yang berhasil mengimbangi langkah pedangnya dan memenangkan rasa hormat tulusnya.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Vesna Strivozha, 16-year-old noble Snezhnayan elf-girl, long golden-blonde high ponytail twisting into spiral drill with teal bow, elongated pointed elf ears, glowing aquamarine eyes with star-shaped pupils, silver crystalline tiara on forehead, confident joyful smile, pastel cyan and white aristocratic fencing uniform with gold trims, Genshin Impact official art elegance, exquisite lighting."
    },

    # -------------------------------------------------------------------------
    # SPECIAL: MUSIC PRESIDENT, KOKUHOU FIELD LEADER, ALUMNUS FOUNDER
    # -------------------------------------------------------------------------
    {
        "id": "hanase_tamanibu",
        "name": "Hanase Tamanibu (花瀬 玉三)",
        "nickname": ["Tamanibu", "Tama-senpai", "Ketua Beanie", "Penyihir Kabel"],
        "role": "Ketua Klub Musik & Sound Engineer",
        "grade": 11,
        "class_room": "11-2",
        "category_id": "class_2_2",
        "age": 16,
        "birthday": "14 Oktober",
        "zodiac": "Libra",
        "mbti": "ISFP",
        "gender": "Male",
        "archetype": "normies",
        "ekskul": "band",
        "club_role": "Ketua Klub Musik & Sound Engineer",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["talent", "mind"],
        "saving_throws": ["talent", "mind"],
        "stats": {"physique": 11, "intelligent": 14, "looks": 14, "mind": 15, "talent": 17, "luck": 12},
        "vitals": {"physical_hp_max": 12, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": [
            "Suara petikan bassline analog yang dalam dan bulat",
            "Mencari kaset piringan hitam langka di toko loak bekas",
            "Kopi kaleng dingin rasa moka di sela mixing audio",
            "Topi beanie abu-abu rajut kesayangannya",
            "Ruang studio musik ber-AC dingin saat siang terik"
        ],
        "dislikes": [
            "Feedback melengking dari speaker monitor yang rusak",
            "Senar gitar yang putus di tengah-tengah rekaman lagu",
            "Orang yang menginjak kabel mixer audio di panggung",
            "Didesak menyelesaikan jadwal konser terburu-buru"
        ],
        "dir": "Characters/Love Interests/Class 11-2/Tamanibu",
        "filename": "HANASE TAMANIBU (花瀬 玉三).md",
        "tagline": "Kabel udah dicolok, equalizer udah di-setting flat. Jangan grogi di depan mikrofon... selama ada gw di balik mixer, suara lu bakal terdengar luar biasa di seluruh aula.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah santai bergaris lembut dengan tatapan mata abu-abu perak mengantuk (*sleepy silver-grey eyes*) dihiasi bulu mata panjang. Selalu terlihat rileks dan tenang di bawah tekanan panggung.
* **Rambut:** Rambut ungu gelap kehitaman (*dark violet-black*) berpotongan shaggy sebahu yang dibiarkan keluar berantakan dari bawah topi kupluk rajut beanie abu-abu arang (*charcoal grey beanie*).
* **Postur & Gestur:** Tinggi sedang (174 cm), postur agak bungkuk santai, selalu mengalungkan headphone studio kelas profesional di lehernya.
* **Seragam & Gaya Berpakaian:** Kemeja seragam sekolah yang kancing atasnya terbuka santai, mengenakan kaos dalaman abu-abu gelap dengan kalung tali kulit berliontin jack audio 6.3mm. Celana seragam sedikit longgar dengan sepatu kets kanvas hitam.
* **Aksesori & Barang Bawaan:** Headphone monitor Audio-Technica hitam melingkar di leher, binder partitur akord lagu, dan rol selotip kabel hitam di saku blazer.""",
        "personality_traits": "Sangat santai, penyabar, berjiwa pengayom bagi adik kelas, dan punya pendengaran audio yang sangat teliti. Ia tidak suka drama kekuasaan dan hanya ingin musik sekolah dinikmati semua kalangan.",
        "personality_flaws": "Sering begadang menata track audio hingga tertidur di atas sofa ruang klub musik saat pelajaran berlangsung.",
        "dere_pattern": "Tipe Chill Big-Brother Dere. Sangat suportif, meminjamkan headphone favoritnya, dan meracik aransemen musik khusus untuk mengiringi momen pemain.",
        "bg_childhood": "Berasal dari keluarga pemilik rental sound system hajatan lokal; terbiasa dengan kabel dan ampli sejak kecil.",
        "bg_turning_point": "Mendirikan kembali klub musik Housen yang sempat mati suri di tahun pertamanya.",
        "bg_current": "Menjabat sebagai Ketua Klub Musik di kelas 11-2 dan menjadi teknisi andalan panggung festival sekolah.",
        "club_life": "Mengatur jadwal studio, perizinan panggung dengan OSIS, dan merawat instrumen band sekolah.",
        "relationships_md": """* **Shinohara Kotone (10-1):** Sering membantu Kotone latihan vokal dan menata backing track rekaman lagunya.
* **Kirishima Iori (10-1):** Teman diskusi efek pedal gitar dan progresi melodi.
* **Hatsushiba Miku (11-1):** Partner teknis panggung digital; Miku di software synth dan Tamanibu di mixer hardware.
* **Protagonist:** Pemain yang ia percayai untuk menjaga ruang studio saat ia sedang lelah tertidur.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Hanase Tamanibu, 16-year-old Japanese male student, messy dark violet hair under a charcoal grey slouchy beanie hat, sleepy silver-grey eyes, calm relaxed smile, professional studio headphones around neck, open collar uniform, music creator visual novel art."
    },
    {
        "id": "tahagusa_kazugumi",
        "name": "Tahagusa Kazugumi (田端 嘉組)",
        "nickname": ["Kazugumi", "Kazu", "Bos Tempat Sampah", "Srigala Housen"],
        "role": "Ketua Lapangan Geng Berandal Kokuhou",
        "grade": 11,
        "class_room": "11-2",
        "category_id": "kokuhou",
        "age": 17,
        "birthday": "5 Mei",
        "zodiac": "Taurus",
        "mbti": "ESTP",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "martial_arts",
        "club_role": "Ketua Lapangan Kokuhou (Geng Belakang Sekolah)",
        "social_class": "worker",
        "hit_die": "d10",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 17, "intelligent": 11, "looks": 14, "mind": 15, "talent": 13, "luck": 12},
        "vitals": {"physical_hp_max": 18, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": [
            "Adu panco dan baku hantam tangan kosong satu lawan satu yang jantan",
            "Menghisap rokok murah di sofa rongsokan belakang sekolah",
            "Kopi kaleng pahit hangat saat angin senja bertiup",
            "Menjaga adik kelas dari gangguan preman sekolah luar",
            "Mendengarkan kisah pertempuran legendaris Kurogane Tetsuo"
        ],
        "dislikes": [
            "Berandal pengecut yang main keroyokan atau memakai senjata tajam",
            "Anak SMA Touki yang suka memeras murid tak berdaya",
            "Orang sok suci yang memandang rendah anak berandal tanpa tahu luka hidup mereka",
            "Komite disiplin yang merazia bungkus rokoknya"
        ],
        "dir": "Characters/Love Interests/Class 11-2/Kazugumi",
        "filename": "TAHAGUSA KAZUGUMI (田端 嘉組).md",
        "tagline": "Dengar baik-baik bocah baru. Di depan gerbang sakura lu boleh tunduk sama aturan OSIS. Tapi begitu lu melangkah ke jalanan luar, aturan yang berlaku cuma satu: siapa yang berani nyentuh lambang Housen, bakal gw hajar sampai ga bisa jalan pulang!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tampan keras berahang tegas dengan bekas luka goresan perkelahian di rahang kiri. Sepasang mata tajam berwarna cokelat madu liar (*feral amber-brown*) bak serigala lapar. Di batang hidungnya selalu tertempel plester medis putih (*adhesive bandage*).
* **Rambut:** Potongan rambut *undercut* pirang gelap bertekstur kasar, bagian atasnya disisir berantakan ke belakang (*slicked-back textured quiff*).
* **Postur & Gestur:** Bertubuh liat, tegap, dan berotot kokoh (182 cm). Sering berjalan dengan kedua tangan di saku celana, dagu terangkat menantang siapa pun yang menatap matanya.
* **Seragam & Gaya Berpakaian:** Jaket seragam hitam (*gakuran*) yang seluruh kancingnya dibuka memperlihatkan kaos dalaman hitam polos pas badan, rantai dompet perak tipis di pinggang, dan celana longgar khas berandal dengan sepatu boots kulit hitam usang.
* **Aksesori & Barang Bawaan:** Plester hidung cadangan di saku jaket, korek api zippo kuningan, dan perban tinju melilit pergelangan tangannya.""",
        "personality_traits": "Tegas, liar, menjunjung tinggi kode etik petarung jalanan (*Noble Banchou*). Ia menolak memeras warga atau menyakiti perempuan dan anak kecil. Kepemimpinannya didasarkan pada rasa hormat dan darah persaudaraan.",
        "personality_flaws": "Sangat keras kepala dan mudah terpancing emosinya jika nama baik faksi atau kehormatan sekolahnya dihina.",
        "dere_pattern": "Tipe Delinquent Bro / Tsundere Protektif. Mengajarkan teknik tinju pada pemain, membelikan ramen mangkuk ganda, dan pasang badan di garis depan saat musuh menyerbu.",
        "bg_childhood": "Tumbuh di jalanan distrik industri yang keras, belajar bertarung demi melindungi adiknya.",
        "bg_turning_point": "Kalah telak dalam duel melawan Kurogane Tetsuo saat kelas 10, lalu diangkat menjadi tangan kanan dan penerus pimpinan geng Kokuhou di sekolah.",
        "bg_current": "Memegang komando penuh atas puluhan berandal Housen di markas tempat sampah belakang sekolah.",
        "club_life": "Tidak terdaftar resmi di ekskul sekolah, namun rutin sparing tinju di bawah pengawasan rahasia Pak Kashisaka.",
        "relationships_md": """* **Kurogane Tetsuo (Alumnus):** Tokoh panutan mutlak; Kazugumi selalu mematuhi nasihat Tetsuo.",
* **Kanzaki Takeru (10-1):** Menganggap Takeru seperti adik laki-laki yang punya potensi tempur luar biasa.",
* **Kashisaka Seichi (Guru Tinju):** Satu-satunya guru yang ia hormati karena pernah menghajarnya sampai sadar di ring tinju.",
* **Protagonist:** Pemain yang membuktikan nyali di hadapannya saat insiden penculikan Touki meledak.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Tahagusa Kazugumi, 17-year-old fierce Japanese delinquent gang leader, dark blonde undercut hairstyle swept back, adhesive bandage on nose bridge, sharp amber-brown wolf eyes, scar on jaw, open black gakuran jacket over black t-shirt, silver chain, gritty Tokyo Revengers inspired visual novel art."
    },
    {
        "id": "kurogane_tetsuo",
        "name": "Kurogane Tetsuo (黒鉄 鉄生)",
        "nickname": ["Tetsuo-san", "Iron Tetsuo", "Legenda Phoenix Hitam", "Bos Bengkel"],
        "role": "Pendiri & Pemimpin Tertinggi Geng Kokuhou (Alumnus Housen)",
        "grade": "Alumni",
        "class_room": "Alumni Housen (Angkatan 2024) / Bengkel Motor Distrik 3",
        "category_id": "outside_school",
        "age": 20,
        "birthday": "12 Januari",
        "zodiac": "Capricorn",
        "mbti": "ISTJ",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "outdoor",
        "club_role": "Pendiri & Alumnus Pelindung Kokuhou",
        "social_class": "worker",
        "hit_die": "d12",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 18, "intelligent": 13, "looks": 15, "mind": 17, "talent": 14, "luck": 13},
        "vitals": {"physical_hp_max": 22, "composure_max": 18},
        "heart_meter": {"base": 1, "confession_target_dc": 18},
        "likes": [
            "Deru mesin motor 4-tak yang disetel dengan presisi sempurna",
            "Menyesap kopi hitam panas di depan pintu bengkel saat fajar",
            "Melihat adik-adik kelas Housen pulang sekolah dengan aman",
            "Kunci inggris baja tempaan dan aroma oli pelumas mesin",
            "Mendengarkan rekaman radio rock lawas era Showa"
        ],
        "dislikes": [
            "Sindikat kriminal dewasa yang memanfaatkan anak SMA untuk narkoba/judi",
            "Sekolah rival yang menculik dan menyandera orang tak berdaya",
            "Orang yang mengendarai motor modifikasi tanpa merawat mesinnya",
            "Birokrat munafik yang hanya peduli pencitraan sekolah"
        ],
        "dir": "Characters/Love Interests/Kokuhou/Tetsuo",
        "filename": "KUROGANE TETSUO (黒鉄 鉄生).md",
        "tagline": "Dunia luar gerbang sekolah itu kejam, anak muda. Di sana ga ada bel pergantian pelajaran atau guru yang bakal misahin perkelahian. Tapi selama lu masih bawa nama Housen di dada lu... gw ga bakal biarin anjing-anjing pelabuhan itu nginjak harga diri kalian.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah pria muda dewasa berusia 20 tahun dengan garis rahang kokoh, tatapan mata arang gelap (*deep charcoal eyes*) yang dingin, dalam, dan berwibawa bak dinding benteng. Terdapat bekas luka bakar knalpot kecil di leher kanan yang menambah aura maskulinnya.
* **Rambut:** Rambut hitam pendek tebal dipotong model *textured crop/crew fade* yang praktis dan maskulin.
* **Postur & Gestur:** Bertubuh tinggi tegap, sangat berotot liat hasil bertahun-tahun mengangkat blok mesin motor (186 cm, 88 kg). Gerakannya tenang, tidak terburu-buru, memancarkan aura predator yang sudah kenyang bertarung.
* **Seragam & Gaya Berpakaian:** Mengenakan jaket kulit motor hitam usang (*distressed black leather rider jacket*) dengan sulaman benang hitam samar lambang burung phoenix di punggung, kaos henley abu-abu pudar, celana jins denim tebal bernoda oli di lutut, dan sepatu boots kerja kulit bertulang baja (*steel-toe boots*).
* **Aksesori & Barang Bawaan:** Kunci bengkel lipat serbaguna, pemantik api zippo perak tua peninggalan ayahnya, dan sarung tangan mekanik kulit di saku belakang.""",
        "personality_traits": "Tenang, matang, protektif, dan berwibawa mutlak. Kata-katanya singkat namun mengikat layaknya sumpah besi. Ia adalah figur ayah/kakak tertua bagi seluruh berandal muda Housen.",
        "personality_flaws": "Terlalu memikul seluruh dosa dan luka generasi muda di pundaknya sendiri, enggan membagi beban hidupnya pada orang lain.",
        "dere_pattern": "Tipe Stoic Big-Boss Mentor. Mengawasi dari kejauhan, datang menolong di detik paling kritis dengan raungan knalpot motornya, lalu membelikan satu krat minuman hangat tanpa banyak bicara.",
        "bg_childhood": "Mantan berandal legendaris yang mendirikan faksi Kokuhou saat bersekolah di Housen untuk melindungi murid dari serbuan geng luar kota.",
        "bg_turning_point": "Lulus dari Housen 2 tahun lalu dan memilih membuka bengkel motor mandiri di perbatasan distrik.",
        "bg_current": "Menjadi penasihat spiritual jalanan bagi Kazugumi dan kekuatan pemungkas pelindung Housen.",
        "club_life": "Di luar sekolah; menjalin kontak rahasia dengan Pak Kashisaka dan Satpam Gonda.",
        "relationships_md": """* **Tahagusa Kazugumi (11-2):** Murid dan penerus tahtanya di sekolah; mempercayakan keamanan akademi pada Kazugumi.
* **Kashisaka Seichi (Guru Tinju):** Sahabat lama sekaligus mantan pelatihnya di masa sekolah.
* **Onizuka Gouki (Ketua Touki):** Rival bebuyutan lama sejak masa SMP; perang dingin antar distrik mereka belum usai.
* **Protagonist:** Melihat api keberanian yang murni di mata pemain, mengingatkannya pada masa mudanya dulu.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kurogane Tetsuo, 20-year-old rugged handsome Japanese biker alumnus, short textured spiky black hair, intense stoic charcoal eyes, strong jaw with faint burn scar on neck, worn black leather rider jacket over grey henley, powerful calm masculine authority, high-end anime art."
    },

    # -------------------------------------------------------------------------
    # 5 MALE FACULTY
    # -------------------------------------------------------------------------
    {
        "id": "kashisaka_seichi",
        "name": "Kashisaka Seichi (樫坂 征一)",
        "nickname": ["Pak Seichi", "Kashisaka-sensei", "Pelatih Tinju", "Banteng Gymnasium"],
        "role": "Guru Pendidikan Jasmani & Pelatih Tinju Housen",
        "grade": "Faculty",
        "class_room": "Faculty (Gymnasium & Ruang Olahraga)",
        "category_id": "faculty",
        "age": 34,
        "birthday": "28 Juli",
        "zodiac": "Leo",
        "mbti": "ESTJ",
        "gender": "Male",
        "archetype": "faculty",
        "ekskul": "sports",
        "club_role": "Guru Pembina Olahraga & Pelatih Tinju",
        "social_class": "worker",
        "hit_die": "d12",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 18, "intelligent": 12, "looks": 14, "mind": 16, "talent": 13, "luck": 11},
        "vitals": {"physical_hp_max": 20, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 18},
        "likes": [
            "Suara samsak tinju yang berdentum keras terkena pukulan bersih",
            "Melihat murid berandal belajar menyalurkan amarahnya ke olahraga positif",
            "Dada ayam rebus, nasi mangkuk besar, dan susu kedelai dingin",
            "Peluit perak yang selalu tergantung di lehernya",
            "Membantu anak-anak bermasalah menemukan tujuan hidup"
        ],
        "dislikes": [
            "Pengecut yang memukul orang lain dari belakang",
            "Rokok di area sekolah (ia punya indera penciuman sangat tajam)",
            "Murid yang menyerah sebelum ronde pertarungan selesai",
            "Rapat birokrasi guru yang memotong jam latihan fisik"
        ],
        "dir": "Characters/Love Interests/Faculty/Seichi",
        "filename": "KASHISAKA SEICHI (樫坂 征一).md",
        "tagline": "Tangan lu dikasih tuhan buat melindungi kawan dan membimbing yang lemah, bukan buat mukul orang di gang sempit! Pasang sarung tinju lu, masuk ke ring. Kalau lu bisa tahan tiga ronde lawan bapak, baru bapak dengerin alasan lu bolos!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah maskulin tampan berusia 34 tahun dengan tulang pipi tegas, dagu berbelah tipis, dan alis tebal berkarakter. Sepasang matanya berwarna cokelat tua hangat (*warm rugged brown eyes*) yang bisa berubah menjadi tatapan elang petarung saat melangkah ke matras.
* **Rambut:** Rambut hitam pekat berpotongan *crew-cut* rapi dan maskulin.
* **Postur & Gestur:** Bertubuh kekar seperti banteng tempur dengan bahu bidang dan dada tebal (185 cm, 86 kg). Sering berdiri tegap bersedekap dengan peluit perak tergantung di dada.
* **Seragam & Gaya Berpakaian:** Mengenakan setelan jaket training olahraga Housen berwarna merah marun dan putih dengan ritsleting terbuka sedikit, kaos polo putih berkerah, celana training hitam sporty, dan sepatu lari ASICS tebal.
* **Aksesori & Barang Bawaan:** Peluit perak bertali merah di leher, stopwatch digital di pergelangan tangan kiri, handuk putih kecil di pundak, dan plester olahraga di buku jemari tangannya.""",
        "personality_traits": "Tegas, bersuara menggelegar, namun memiliki hati yang sangat hangat dan kebapakan. Bagi Seichi, tidak ada anak nakal yang tidak bisa diselamatkan; ring tinju adalah tempatnya mendidik jiwa mereka.",
        "personality_flaws": "Kurang peka terhadap intrik politik yayasan dan sering bertindak mendahului izin kepala sekolah jika menyangkut keselamatan muridnya.",
        "dere_pattern": "Tipe Tough-Love Coach Mentor. Membelikan makan siang bergizi bagi murid yang kelelahan, memuji perkembangan teknik fisik dengan tepukan pundak yang mantap.",
        "bg_childhood": "Mantan petinju profesional peringkat nasional yang harus pensiun dini akibat cedera bahu.",
        "bg_turning_point": "Menerima tawaran Kepala Sekolah Reiko untuk menjadi guru olahraga dan pelatih mental di Housen.",
        "bg_current": "Menjadi pembina klub olahraga dan pelindung rahasia bagi anak-anak Kokuhou dari jeratan kriminal jalanan.",
        "club_life": "Menguasai gedung gymnasium dan ruang dojo lantai bawah.",
        "relationships_md": """* **Saionji Kaede (Guru Olahraga):** Rekan sejawat guru olahraga; sering berlomba lari keliling lapangan bersama.
* **Hasumi Chihiro (Wali Kelas 10-1):** Sering menegur Chihiro yang ketahuan merokok di belakang gedung olahraga lama.
* **Tahagusa Kazugumi (11-2):** Menganggap Kazugumi murid berbakat yang harus diarahkan agar tidak terjerumus ke dunia hitam.
* **Protagonist:** Melihat potensi ketahanan fisik dan mental yang luar biasa pada karakter pemain.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kashisaka Seichi, 34-year-old muscular athletic Japanese PE teacher and boxing coach, neat black crew-cut hair, thick defined eyebrows, warm rugged brown eyes, confident masculine smile, maroon and white school athletic track jacket, silver whistle on lanyard, high quality anime visual novel art."
    },
    {
        "id": "kurosaki_jin",
        "name": "Kurosaki Jin (黒崎 刃)",
        "nickname": ["Pak Kurosaki", "Wakasek Kesiswaan", "Pedang Hitam Disiplin", "Tuan Pinstripe"],
        "role": "Wakil Kepala Sekolah Bidang Kesiswaan & Kedisiplinan",
        "grade": "Faculty",
        "class_room": "Faculty (Kantor Kesiswaan Lantai 3)",
        "category_id": "faculty",
        "age": 45,
        "birthday": "3 September",
        "zodiac": "Virgo",
        "mbti": "ESTJ",
        "gender": "Male",
        "archetype": "faculty",
        "ekskul": "student_council",
        "club_role": "Penasihat Dewan Kesiswaan & Pengawas Yayasan",
        "social_class": "elite",
        "hit_die": "d8",
        "primary_stats": ["intelligent", "mind"],
        "saving_throws": ["intelligent", "mind"],
        "stats": {"physique": 12, "intelligent": 17, "looks": 14, "mind": 17, "talent": 13, "luck": 10},
        "vitals": {"physical_hp_max": 12, "composure_max": 18},
        "heart_meter": {"base": 1, "confession_target_dc": 18},
        "likes": [
            "Ketepatan waktu hingga satuan detik dan kepatuhan mutlak pada regulasi",
            "Kerapian berkas laporan kesiswaan tanpa koreksi tipo",
            "Kopi espresso hitam pekat tanpa gula",
            "Melihat peringkat akreditasi Housen berada di puncak nasional",
            "Pena fountain berlapis emas hitam yang selalu ia rawat"
        ],
        "dislikes": [
            "Tawuran jalanan yang mencemari reputasi dan akreditasi sekolah",
            "Siswa dengan rambut dicat, tindik, atau seragam tidak rapi",
            "Kepala Sekolah Reiko yang menandatangani izin tanpa berdiskusi dengannya",
            "Guru yang bersikap terlalu santai dan tidak disiplin"
        ],
        "dir": "Characters/Love Interests/Faculty/Jin",
        "filename": "KUROSAKI JIN (黒崎 刃).md",
        "tagline": "Housen Academy berdiri di atas kehormatan dan tradisi seratus tahun. Selama saya menjabat sebagai Wakil Kepala Sekolah, tidak ada satu pun berandal jalanan atau murid pembangkang yang diizinkan merusak nama suci yayasan ini!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tirus tegas dengan rahang persegi kaku, tatapan mata abu-abu baja dingin (*steel-grey eyes*) di balik kacamata persegi tanpa bingkai (*rimless rectangular glasses*) yang selalu memantulkan cahaya lampu kantor secara tajam.
* **Rambut:** Rambut hitam lurus disisir klimis ke belakang (*slicked-back raven hair*) dengan sentuhan uban perak terhormat di bagian kedua pelipisnya.
* **Postur & Gestur:** Tinggi tegak (179 cm), postur kaku seperti perwira militer, selalu memegang map inspeksi kulit hitam atau tongkat kayu penunjuk disiplin kecil.
* **Seragam & Gaya Berpakaian:** Setelan jas formal tiga potong (*three-piece suit*) berwarna abu-abu arang bergaris pinstripe halus, dasi sutra merah marun gelap yang diikat simpul Windsor sempurna, dan sepatu oxford kulit hitam mengilap tanpa debu.
* **Aksesori & Barang Bawaan:** Kacamata rimless anti-pantulan, pena montblanc emas hitam, dan buku pedoman sanksi kedisiplinan kementerian.""",
        "personality_traits": "Birokratik, sangat dingin, perfeksionis, dan tidak kenal kompromi. Namun di balik kekakuannya, motivasinya murni untuk melindungi masa depan karir para murid agar tidak hancur oleh catatan kriminal kepolisian.",
        "personality_flaws": "Sering gagal memahami sisi psikologis remaja dan terlalu memprioritaskan citra yayasan di atas perasaan individu.",
        "dere_pattern": "Tipe Strict Authority to Reluctant Ally. Jika pemain membuktikan integritasnya dengan menyelesaikan krisis Touki tanpa mencemari nama sekolah, Kurosaki akan menutup mata atas pelanggaran prosedur dan diam-diam membantu secara legal.",
        "bg_childhood": "Lulusan terbaik fakultas hukum universitas negeri bergengsi, mantan birokrat kementerian pendidikan.",
        "bg_turning_point": "Ditugaskan ke Housen Academy untuk menertibkan iklim sekolah yang mulai memanas akibat perseteruan geng distrik.",
        "bg_current": "Mengendalikan sanksi akademik, izin acara besar, dan pengawasan komite disiplin.",
        "club_life": "Mengawasi Presidium OSIS dan Komite Disiplin Kisaragi Setsuna.",
        "relationships_md": """* **Kujou Reiko (Kepala Sekolah):** Lawan debat sengit dalam rapat; Reiko fleksibel sementara Kurosaki kaku seperti batu karang.
* **Kisaragi Setsuna (Sekretaris OSIS):** Murid teladan favoritnya yang ia anggap sebagai penerus kedisiplinan sekolah.
* **Kashisaka Seichi:** Kerap bersitegang soal metode penanganan murid berandal.
* **Protagonist:** Selalu mengawasi gerak-gerik pemain dengan kecurigaan administratif tinggi.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kurosaki Jin, 45-year-old severe Japanese vice principal, slicked-back black hair with silver temples, rimless rectangular glasses, piercing cold steel-grey eyes, charcoal pinstripe three-piece formal suit, dark red tie, stern authoritative anime visual novel art."
    },
    {
        "id": "heinrich_vogel",
        "name": "Dr. Heinrich Vogel (ハインリヒ・フォーゲル)",
        "nickname": ["Dr. Vogel", "Sensei Vogel", "Ilmuwan Gila", "Profesor Belerang"],
        "role": "Guru Kimia & Pembimbing Kelompok Ilmiah Remaja (KIR)",
        "grade": "Faculty",
        "class_room": "Faculty (Laboratorium Kimia Gedung Sains Lantai 2)",
        "category_id": "faculty",
        "age": 39,
        "birthday": "11 November",
        "zodiac": "Scorpio",
        "mbti": "INTP",
        "gender": "Male",
        "archetype": "faculty",
        "ekskul": "science",
        "club_role": "Guru Pembimbing Kelompok Ilmiah Remaja (KIR)",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["intelligent", "talent"],
        "saving_throws": ["intelligent", "talent"],
        "stats": {"physique": 10, "intelligent": 18, "looks": 13, "mind": 16, "talent": 16, "luck": 11},
        "vitals": {"physical_hp_max": 10, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": [
            "Reaksi kimia eksotermik yang menghasilkan percikan warna-warni dan ledakan kecil",
            "Membaca jurnal ilmiah kuantum terbaru sambil mengaduk teh dengan batang kaca",
            "Siswa yang memiliki rasa penasaran sains tanpa takut kotor",
            "Kue pretzel asin mentega dan sosis bratwurst panggang",
            "Menemukan kegunaan taktis dari senyawa kimia sederhana"
        ],
        "dislikes": [
            "Regulasi pemesanan bahan reagen kimia yang birokratis dari wakasek",
            "Siswa yang ceroboh menuangkan air ke dalam asam sulfat pekat",
            "Hari-hari yang membosankan tanpa ada eksperimen baru di lab",
            "Bau pengharum ruangan sintetis murahan"
        ],
        "dir": "Characters/Love Interests/Faculty/Vogel",
        "filename": "HEINRICH VOGEL (ハインリヒ・フォーゲル).md",
        "tagline": "Wunderbar! Kenapa kalian memikirkan perkelahian jalanan primitif dengan otot, kalau sedikit campuran serbuk belerang dan kalium nitrat ini bisa menciptakan tirai asap tebal yang menutupi pelarian kalian dalam hitungan detik? Sains adalah seni penyelamatan sejati!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah pria ekspatriat Jerman berusia 39 tahun yang tampan berkarakter, hidung mancung tajam, dan sepasang mata hijau hazel (*hazel-green eyes*) yang selalu menyala penuh gairah intelektual. Sering terlihat senyuman eksentrik yang sulit ditebak di sudut bibirnya.
* **Rambut:** Rambut pirang jerami (*straw-blonde*) bergelombang acak-acakan yang agak panjang sebahu bawah telinga.
* **Postur & Gestur:** Tinggi kurus semampai (181 cm), sering bergerak cepat dari satu meja lab ke meja lain, memegang tabung reaksi dengan gestur anggun.
* **Seragam & Gaya Berpakaian:** Mengenakan jas laboratorium putih panjang (*white lab coat*) yang memiliki bekas noda kimia tipis di ujung saku, kemeja putih berlengan digulung, rompi rajut wol cokelat kotak-kotak (*tweed vest*), dasi hijau tua longgar, dan celana kain cokelat tua.
* **Aksesori & Barang Bawaan:** Kacamata pelindung lab (*safety goggles*) berbingkai karet yang selalu terpasang di dahinya, pipet ukur di saku dada, dan buku catatan rumus bersampul kulit tua.""",
        "personality_traits": "Eksentrik, cerdas luar biasa, bicara cepat dengan intonasi antusias, dan sangat menyukai eksperimen terapan. Ia melihat dunia sebagai reaksi kimia raksasa.",
        "personality_flaws": "Sering mengabaikan protokol keamanan dasar demi melihat hasil reaksi kimia spektakuler.",
        "dere_pattern": "Tipe Mad Scientist Ally. Bersedia meracikkan bom asap kimia, flashbang sederhana, atau cairan pelarut karat gembok untuk membantu misi penyelamatan pemain.",
        "bg_childhood": "Lahir di Heidelberg, Jerman. Menempuh doktoral kimia terapan sebelum mengajar di Jepang.",
        "bg_turning_point": "Jatuh cinta pada ketenangan musim semi Jepang dan menerima kontrak riset jangka panjang di Housen.",
        "bg_current": "Mengajar kimia di kelas 11 dan membina ruang laboratorium sains sekolah.",
        "club_life": "Menjadikan laboratorium kimia sebagai sarang inovasi taktis bagi murid yang berpikiran terbuka.",
        "relationships_md": """* **Takamine Ryo (10-1):** Rekan diskusi sains komputasi dan teknologi terapan.
* **dr. Shiranui Mei (Dokter UKS):** Sering meminjamkan stok bahan antiseptik dan cairan infus farmasi.
* **Kurosaki Jin:** Musuh bebuyutannya dalam urusan izin pemakaian bahan peledak demonstrasi kelas.
* **Protagonist:** Pemain yang ia beri akses khusus untuk meminjam perlengkapan kimia taktis.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Dr Heinrich Vogel, 39-year-old eccentric German chemistry teacher, messy wavy straw-blonde hair, safety goggles pushed up on forehead, brilliant hazel-green eyes, curious enthusiastic smile, white lab coat over brown tweed vest, science laboratory visual novel art."
    },
    {
        "id": "gonda_gennosuke",
        "name": "Gonda Gennosuke (権田 源之助)",
        "nickname": ["Pak Gonda", "Gonda-san", "Paman Satpam", "Beruang Gerbang"],
        "role": "Kepala Petugas Keamanan Gerbang Utama Housen",
        "grade": "Faculty",
        "class_room": "Faculty (Pos Keamanan Gerbang Sakura)",
        "category_id": "faculty",
        "age": 52,
        "birthday": "10 Juni",
        "zodiac": "Gemini",
        "mbti": "ISFJ",
        "gender": "Male",
        "archetype": "faculty",
        "ekskul": "outdoor",
        "club_role": "Kepala Petugas Keamanan Sekolah",
        "social_class": "worker",
        "hit_die": "d10",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 16, "intelligent": 11, "looks": 11, "mind": 15, "talent": 12, "luck": 14},
        "vitals": {"physical_hp_max": 18, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": [
            "Menyesap teh hijau hangat dari termos tua di pos gerbang",
            "Makan roti taiyaki isi pasta kacang merah hangat",
            "Menyapa murid yang datang pagi dengan senyuman hangat",
            "Merawat tanaman bonsai mini di samping pos satpam",
            "Mendengarkan siaran pertandingan bisbol sore hari lewat radio kecil"
        ],
        "dislikes": [
            "Preman luar sekolah yang nongkrong mengganggu siswi di dekat halte bus",
            "Hari hujan badai yang membuat daun sakura menyumbat selokan gerbang",
            "Orang tua murid sombong yang memarkir mobil sembarangan di depan gerbang",
            "Melihat murid Housen pulang dengan wajah terluka atau menangis"
        ],
        "dir": "Characters/Love Interests/Faculty/Gonda",
        "filename": "GONDA GENNOSUKE (権田 源之助).md",
        "tagline": "Anak-anak... kalau kalian mau keluar lewat pintu belakang, jangan sampai ketahuan Pak Kurosaki ya. Ini bapak bawain taiyaki hangat dua biji. Jaga diri kalian baik-baik di jalanan luar, dan pastikan kalian pulang utuh sebelum matahari tenggelam!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah bundar kebapakan berusia 52 tahun dengan kulit kecokelatan terpapar matahari, kerutan tawa hangat di sudut mata (*kind laugh lines*), dan kumis tebal abu-abu keperakan (*thick grey walrus mustache*) yang ramah.
* **Rambut:** Rambut hitam berseling uban pendek dipotong rapi tertutup topi seragam.
* **Postur & Gestur:** Bertubuh tinggi besar gempal bak beruang ramah (183 cm, 92 kg). Langkahnya tenang dan mantap, memancarkan rasa aman bagi seluruh murid.
* **Seragam & Gaya Berpakaian:** Mengenakan seragam petugas keamanan resmi Housen berwarna biru tua (*navy security uniform*) lengkap dengan tanda pangkat emas di pundak, dasi hitam, ikat pinggang kulit hitam tebal, dan topi pet satpam biru tua yang sering dimiringkan santai.
* **Aksesori & Barang Bawaan:** Ring kunci master gerbang sekolah kuningan tebal, senter patroli berat, radio genggam walkie-talkie di pundak, dan bungkus kantong kertas cokelat berisi kue hangat.""",
        "personality_traits": "Sangat ramah, protektif, pemaaf, dan tahu seluk-beluk jam kabur seluruh murid nakal. Ia adalah benteng pertama yang melindungi Housen dari ancaman dunia luar.",
        "personality_flaws": "Sering tidak tega menghukum murid dan mudah disogok dengan cemilan manis atau sapaan hangat.",
        "dere_pattern": "Tipe Kind Uncle / Guardian Mentor. Membukakan gerbang belakang sekolah secara rahasia, memberikan alibi aman jika murid terlambat kembali dari misi.",
        "bg_childhood": "Mantan atlet judo kepolisian yang pensiun terhormat.",
        "bg_turning_point": "Mendedikasikan 15 tahun terakhir hidupnya menjaga gerbang utama Housen Academy.",
        "bg_current": "Menjaga pos gerbang utama dan memantau lalu lintas keamanan sekolah.",
        "club_life": "Di luar klub; sering berbincang dengan Kurogane Tetsuo dan Kazugumi saat senja.",
        "relationships_md": """* **Kisaragi Setsuna (11-2):** Partner gerbang pagi; Setsuna merazia seragam sementara Gonda mengatur arus gerbang.
* **Kurogane Tetsuo:** Menganggap Tetsuo seperti keponakan sendiri; selalu membiarkan motor Tetsuo parkir di pos.
* **Kujou Reiko:** Sangat dihormati oleh Kepala Sekolah sebagai staf paling loyal di akademi.
* **Protagonist:** Pemain yang ia bukakan pintu gerbang belakang untuk operasi penyelamatan darurat.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Gonda Gennosuke, 52-year-old burly Japanese senior security guard, thick salt-and-pepper mustache, navy blue security guard cap, warm crinkling kind eyes, gentle fatherly smile, navy uniform with gold badges, warm comforting visual novel art."
    },
    {
        "id": "moriyama_daisuke",
        "name": "Moriyama Daisuke (森山 大輔)",
        "nickname": ["Pak Moriyama", "Moriyama-sensei", "Konselor Lembut", "Penyembuh Jiwa"],
        "role": "Guru Bimbingan Konseling & Psikologi Sekolah",
        "grade": "Faculty",
        "class_room": "Faculty (Ruang BK Gedung Utama Lantai 2)",
        "category_id": "faculty",
        "age": 29,
        "birthday": "17 April",
        "zodiac": "Aries",
        "mbti": "INFJ",
        "gender": "Male",
        "archetype": "faculty",
        "ekskul": "literature",
        "club_role": "Konselor Kesehatan Mental & Konseling Remaja",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["mind", "intelligent"],
        "saving_throws": ["mind", "intelligent"],
        "stats": {"physique": 10, "intelligent": 15, "looks": 15, "mind": 17, "talent": 14, "luck": 12},
        "vitals": {"physical_hp_max": 10, "composure_max": 18},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": [
            "Menyeduh teh chamomile hangat dengan tetesan madu liar",
            "Mendengarkan curahan hati murid tanpa memotong pembicaraan",
            "Musik instrumen piano lo-fi yang menenangkan di ruang konseling",
            "Aroma tanaman lavender dalam pot kecil di atas mejanya",
            "Melihat murid yang depresi kembali tersenyum lega"
        ],
        "dislikes": [
            "Orang tua yang memaksakan mimpi masa mudanya ke pundak anak",
            "Penghakiman sosial sepihak terhadap murid yang mengalami masalah keluarga",
            "Pertengkaran kasar yang meninggalkan trauma batin mendalam",
            "Minuman yang terlalu manis atau berkarbonasi tajam"
        ],
        "dir": "Characters/Love Interests/Faculty/Moriyama",
        "filename": "MORIYAMA DAISUKE (森山 大輔).md",
        "tagline": "Terkadang yang kamu butuhkan bukan nasihat moral, melainkan satu tempat aman di mana kamu boleh menangis tanpa takut dihakimi. Duduklah di sofa ini, minumlah teh hangat ini, dan ceritakan semuanya.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tampan berkarakter lembut menenangkan, kulit bersih terawat, dan sepasang mata hangat berwarna cokelat madu lembut (*gentle honey-brown eyes*) di balik kacamata kawat perak bulat tipis (*thin silver round wireframe glasses*).
* **Rambut:** Rambut cokelat kastanye (*chestnut brown*) ikal bergelombang lembut alami sebahu atas yang ditata rapi namun santai.
* **Postur & Gestur:** Ramping dan elegan (176 cm), gestur tubuhnya sangat terbuka, bertutur kata dengan nada suara lembut bariton yang mampu meredakan kecemasan.
* **Seragam & Gaya Berpakaian:** Mengenakan kardigan rajut berkancing wol berwarna krem lembut (*cozy beige cardigan*) di atas kemeja biru muda pastel tanpa dasi, celana katun abu-abu terang, dan sepatu santai kulit cokelat.
* **Aksesori & Barang Bawaan:** Kacamata bulat perak, cangkir keramik teh herbal, buku catatan psikologi bergaris halus, dan bantal sofa empuk penenang stres di ruang kerjanya.""",
        "personality_traits": "Sangat empatik, pendengar yang luar biasa bijak, tidak pernah menghakimi, dan memegang teguh kerahasiaan konseling murid.",
        "personality_flaws": "Sering menyerap energi kesedihan orang lain secara berlebihan hingga kelelahan mental sendiri saat akhir pekan.",
        "dere_pattern": "Tipe Gentle Counselor Dere. Membantu memulihkan poin Composure pemain secara instan lewat sesi konseling privat yang hangat.",
        "bg_childhood": "Tumbuh di keluarga dokter dan memilih mendalami psikologi klinis remaja.",
        "bg_turning_point": "Menolak tawaran klinik swasta mahal demi mengabdi di lingkungan sekolah SMA Housen.",
        "bg_current": "Menjadi konselor favorit yang paling dicari murid jika mengalami krisis emosional.",
        "club_life": "Di luar klub; sering berdiskusi medis dengan dr. Shiranui Mei di ruang UKS.",
        "relationships_md": """* **dr. Shiranui Mei (Dokter UKS):** Rekan kerja terdekat dalam menangani kesehatan fisik dan mental murid.
* **Hasumi Chihiro:** Sering mengantarkan teh herbal ke meja Chihiro jika melihat sang wali kelas hampir pingsan kelelahan.
* **Kurokawa Shiori (10-1):** Mendukung Shiori dalam mengekspresikan perasaannya lewat tulisan sastra.
* **Protagonist:** Memberikan bimbingan moral dan penguatan mental sebelum menghadapi bahaya besar.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Moriyama Daisuke, 29-year-old gentle Japanese school counselor, soft wavy chestnut brown hair, round thin silver wireframe glasses, warm comforting honey-brown eyes, empathetic reassuring smile, soft beige knit cardigan over open-collar light blue shirt, calming visual novel art."
    },

    # -------------------------------------------------------------------------
    # 5 MALE STUDENTS IN CLASS 11-1
    # -------------------------------------------------------------------------
    {
        "id": "saotome_riku",
        "name": "Saotome Riku (早乙女 陸)",
        "nickname": ["Riku", "Saotome", "Pedang Besi 11-1", "Wakil Kendo"],
        "role": "Wakil Kapten Klub Kendo & Siswa Kelas 11-1",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "18 Mei",
        "zodiac": "Taurus",
        "mbti": "ISTJ",
        "gender": "Male",
        "archetype": "jock",
        "ekskul": "kendo",
        "club_role": "Wakil Kapten Klub Kendo",
        "social_class": "middle_class",
        "hit_die": "d10",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 16, "intelligent": 12, "looks": 14, "mind": 15, "talent": 13, "luck": 11},
        "vitals": {"physical_hp_max": 16, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": ["Latihan tebasan suburi 500 kali setiap fajar", "Minyak pelindung bilah pedang kendo", "Onigiri daging sapi bumbu kecap", "Menjaga kehormatan dojo sekolah"],
        "dislikes": ["Siswa yang berlatih setengah hati", "Seragam yang kusut dan kotor", "Trik kotor dalam pertandingan beladiri"],
        "dir": "Characters/Love Interests/Class 11-1/Riku",
        "filename": "SAOTOME RIKU (早乙女 陸).md",
        "tagline": "Pedang kendo bukan untuk menyombongkan kekuatan, tapi untuk mengasah kemurnian jiwa. Jika tekadmu goyah, langkah kakimu di matras akan langsung terbaca lawan.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah maskulin persegi dengan tatapan mata abu-abu gelap (*dark grey eyes*) yang tajam, dingin, dan sangat fokus. Kulitnya kecokelatan sehat hasil latihan luar ruangan.
* **Rambut:** Rambut hitam lurus pendek disisir rapi belah samping (*clean side-parted black hair*).
* **Postur & Gestur:** Tegak sempurna seperti samurai (178 cm, 74 kg), jalannya mantap tanpa limbung.
* **Seragam & Gaya Berpakaian:** Seragam Housen yang disetrika licin kancing penuh, dasi terikat kencang rapi, membawa tas pelindung shinai bambu hitam bergaris putih.
* **Aksesori & Barang Bawaan:** Pelindung pergelangan tangan kulit kendo (*kote protector*) di saku, handuk latihan biru tua.""",
        "personality_traits": "Kaku, disiplin, loyal, dan sangat menghormati hierarki dojo. Ia adalah tangan kanan terpercaya Miruam Solari di klub kendo.",
        "personality_flaws": "Sangat canggung dalam interaksi romantis dan mudah salah tingkah bila diajak bercanda oleh siswi.",
        "dere_pattern": "Tipe Disciplined Samurai Ally. Meminjamkan perlengkapan pelindung kendo terbaiknya untuk party pemain.",
        "bg_childhood": "Berasal dari dojo kendo keluarga tradisional di Kyoto sebelum pindah ke Housen.",
        "bg_turning_point": "Kalah terhormat dari Miruam Solari di seleksi kapten dan bersumpah menjadi wakilnya yang paling setia.",
        "bg_current": "Mengatur jadwal latihan fisik harian murid kendo dan mewakili kelas 11-1 di turnamen prefektur.",
        "club_life": "Menghabiskan waktu 3 jam setiap hari di dojo bela diri lantai atas.",
        "relationships_md": """* **Miruam Solari (11-1):** Kapten dojonya yang sangat ia hormati melebihi siapa pun.
* **Tachibana Rin (12-1):** Senior mentor yang mengajarkannya teknik pedang batin.
* **Kumada Riki (10-1):** Partner sparing fisik lintas disiplin bela diri.
* **Protagonist:** Pemain yang ia uji ketahanan mentalnya di hadapan matras.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Saotome Riku, 16-year-old disciplined Japanese kendo vice-captain, neat short black hair with side part, stoic focused dark grey eyes, crisp pristine Japanese school blazer, upright samurai posture, handsome martial artist visual novel art."
    },
    {
        "id": "fujiwara_kenji",
        "name": "Fujiwara Kenji (藤原 健二)",
        "nickname": ["Kenji", "Tuan Muda Fujiwara", "Kalkulator Berjalan", "Bendahara OSIS"],
        "role": "Bendahara Komite OSIS & Pewaris Konglomerat Perbankan",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "osis",
        "age": 16,
        "birthday": "29 September",
        "zodiac": "Libra",
        "mbti": "ESTJ",
        "gender": "Male",
        "archetype": "elite",
        "ekskul": "student_council",
        "club_role": "Bendahara Komite OSIS",
        "social_class": "old_money",
        "hit_die": "d8",
        "primary_stats": ["intelligent", "looks"],
        "saving_throws": ["intelligent", "looks"],
        "stats": {"physique": 10, "intelligent": 17, "looks": 15, "mind": 14, "talent": 14, "luck": 13},
        "vitals": {"physical_hp_max": 10, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": ["Grafik neraca keuangan yang seimbang sempurna", "Jam tangan mekanik Swiss buatan tangan", "Kopi espresso impor", "Negosiasi diskon anggaran belanja festival"],
        "dislikes": ["Pengeluaran dana yang tidak memiliki tanda terima resmi", "Berandal yang merusak fasilitas sekolah yang dibeli yayasan", "Makanan cepat saji berminyak"],
        "dir": "Characters/Love Interests/Class 11-1/Kenji",
        "filename": "FUJIWARA KENJI (藤原 健二).md",
        "tagline": "Semua hal di dunia ini memiliki nilai valuasi objektif, termasuk keberanian kalian. Proposal dana darurat ini saya setujui... tapi pastikan pengembalian investasinya sebanding dengan reputasi Housen!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah bangsawan aristokratik dengan hidung mancung, sepasang mata cokelat hazel kalkulatif di balik kacamata bulat berbingkai emas tipis (*gold-rimmed round glasses*).
* **Rambut:** Rambut cokelat tua dipomade rapi klimis ke samping dengan kilau terawat.
* **Postur & Gestur:** Ramping elegan (175 cm), gestur tangannya terukur saat mengetik kalkulator tipis.
* **Seragam & Gaya Berpakaian:** Blazer Housen custom dari wol Italia halus, kemeja putih dengan kancing manset emas (*gold cufflinks*), dasi sutra emas-merah bergaris.
* **Aksesori & Barang Bawaan:** Jam tangan Patek Philippe warisan kakeknya, pulpen emas Parker, dan map kulit keuangan OSIS.""",
        "personality_traits": "Tampak angkuh dan sombong di awal karena latar belakang keluarga old money-nya, namun sangat adil dan bisa diandalkan dalam urusan logistik.",
        "personality_flaws": "Mudah panik jika menghadapi situasi kekerasan jalanan yang tidak bisa diselesaikan dengan uang.",
        "dere_pattern": "Tipe Rich Tsundere Ally. Membiayai logistik dan peralatan party diam-diam sambil berkata: *'Ini murni kalkulasi bisnis, jangan salah paham!'*",
        "bg_childhood": "Pewaris generasi ketiga konglomerat perbankan Fujiwara Financial Group.",
        "bg_turning_point": "Bergabung ke OSIS di bawah pimpinan Tenka untuk belajar manajemen kepemimpinan nyata.",
        "bg_current": "Mengendalikan kas besar seluruh operasional pameran ekskul dan festival sekolah.",
        "club_life": "Bekerja di meja audit ruang OSIS bersama Alisa Voronina dan Kisaragi Setsuna.",
        "relationships_md": """* **Asahina Tenka (11-1):** Mengagumi visi Tenka meskipun sering pusing melihat anggaran sosial Tenka yang boros.
* **Alisa Voronina (11-1):** Partner kerja pembukuan mata uang asing dan dana pertukaran pelajar.
* **Tahagusa Kazugumi:** Sangat waspada terhadap Kazugumi namun terpaksa bekerja sama demi keamanan festival.
* **Protagonist:** Menguji kecerdasan negosiasi pemain sebelum mencairkan dana darurat.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Fujiwara Kenji, 16-year-old aristocratic Japanese male student council treasurer, pomaded dark brown hair, delicate gold-rimmed round glasses, calculating hazel eyes, tailored navy blazer with gold cufflinks, rich anime visual novel art."
    },
    {
        "id": "yuki_haruto",
        "name": "Yuki Haruto (結城 悠斗)",
        "nickname": ["Haruto", "Haru-kun", "Si Rubah Lensa", "Mata-mata Sekolah"],
        "role": "Ketua Ekskul Fotografi & Informan Rahasia Sekolah",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "14 Februari",
        "zodiac": "Aquarius",
        "mbti": "ENTP",
        "gender": "Male",
        "archetype": "popular_kids",
        "ekskul": "photography",
        "club_role": "Ketua Ekskul Fotografi & Jurnalistik",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["looks", "intelligent"],
        "saving_throws": ["looks", "intelligent"],
        "stats": {"physique": 11, "intelligent": 15, "looks": 16, "mind": 14, "talent": 15, "luck": 13},
        "vitals": {"physical_hp_max": 12, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": ["Menangkap ekspresi candid murid sekolah yang sedang tersipu", "Kamera mirrorless lensa prime 50mm f/1.2", "Kopi susu dingin di taman tengah", "Gosip hangat seputar persaingan faksi sekolah"],
        "dislikes": ["Foto yang buram atau out of focus", "Guru yang menyita kartu memori kameranya", "Orang yang berpose terlalu kaku dan palsu"],
        "dir": "Characters/Love Interests/Class 11-1/Haruto",
        "filename": "YUKI HARUTO (結城 悠斗).md",
        "tagline": "Lensa kamera gw ga pernah bohong. Lu mau tau titik persembunyian anak-anak Touki di pelabuhan? Gw punya foto satelit dan denah gudangnya... tentu dengan harga barter informasi yang pas, kawan.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tampan modis dengan senyuman rubah ramah (*sly fox smile*), sepasang mata violet gelap (*dark violet eyes*) yang jeli mengamati sekeliling. Telinga kirinya dihiasi anting perak kecil.
* **Rambut:** Rambut cokelat abu-abu pirang (*ash-brown wavy hair*) berombak santai yang sebagian diikat kuncir kecil di belakang kepala (*mini half-up bun*).
* **Postur & Gestur:** Ramping lincah (176 cm), kamera mirrorless hitam selalu tergantung santai di lehernya, siap membidik dalam sepersekian detik.
* **Seragam & Gaya Berpakaian:** Blazer Housen yang tidak dikancingkan, kemeja putih kasual dengan dasi longgar, celana panjang slim-fit dengan sepatu kets modis.
* **Aksesori & Barang Bawaan:** Kamera Sony Alpha mirrorless dengan tali kulit cokelat, tas selempang lensa, dan beberapa kartu SD cadangan.""",
        "personality_traits": "Ceria, ramah, pandai bergaul dengan semua lingkaran sosial, namun menyimpan jaringan informasi intelijen sekolah yang sangat luas.",
        "personality_flaws": "Suka mengintip dan merekam peristiwa berbahaya tanpa memikirkan keselamatan dirinya sendiri.",
        "dere_pattern": "Tipe Charming Information Broker. Memberikan peta taktis dan intel foto lawan secara gratis demi keselamatan teman dekatnya.",
        "bg_childhood": "Anak jurnalis investigasi surat kabar ternama, terbiasa memegang kamera sejak kecil.",
        "bg_turning_point": "Mendirikan buletin foto independen sekolah yang menjadi sumber berita paling populer di Housen.",
        "bg_current": "Menjabat Ketua Ekskul Fotografi dan menjadi penghubung intelijen antar faksi.",
        "club_life": "Bebas berkeliaran di seluruh penjuru kampus dengan dalih tugas peliputan majalah sekolah.",
        "relationships_md": """* **Shinohara Kotone (10-1):** Fotografer resmi sesi pemotretan promo idola Kotone.
* **Takamine Ryo (10-1):** Berbagi data intelijen digital dan foto lokasi mencurigakan.
* **Samejima Ren (Touki):** Rival intrik intelijen; Haruto memantau jejak digital Samejima.
* **Protagonist:** Menyuplai peta foto gudang pelabuhan Touki sebelum operasi penyerbuan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Yuki Haruto, 16-year-old charming Japanese student photographer, wavy ash-brown hair in half-up bun, silver stud earring, sly playful violet eyes, attractive smirk, camera strap around neck, stylish school blazer, visual novel art."
    },
    {
        "id": "shinoda_renzo",
        "name": "Shinoda Renzo (篠田 蓮造)",
        "nickname": ["Renzo", "Ren-chin", "Beatmaker Begadang", "Pangeran Lo-Fi"],
        "role": "Sound Designer, Beatmaker & Siswa Kelas 11-1",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "class_2_1",
        "age": 16,
        "birthday": "22 Oktober",
        "zodiac": "Scorpio",
        "mbti": "INTP",
        "gender": "Male",
        "archetype": "emo",
        "ekskul": "band",
        "club_role": "Audio Producer & Sequencer",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["talent", "mind"],
        "saving_throws": ["talent", "mind"],
        "stats": {"physique": 10, "intelligent": 15, "looks": 14, "mind": 15, "talent": 17, "luck": 12},
        "vitals": {"physical_hp_max": 10, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": ["Membuat bass drum 808 dan synth pad yang mengambang", "Minuman berenergi Monster Energy dingin rasa citrus", "Suasana sunyi malam hari di kamarnya", "Headphone in-ear monitor custom"],
        "dislikes": ["Sinar matahari pagi yang terlalu terik menyilaukan mata", "Pelajaran olahraga lari maraton", "Melodi lagu pop murahan yang tidak punya kedalaman chord"],
        "dir": "Characters/Love Interests/Class 11-1/Renzo",
        "filename": "SHINODA RENZO (篠田 蓮造).md",
        "tagline": "Dunia luar terlalu berisik... Gw lebih suka menyaring kebisingan itu jadi gelombang frekuensi yang enak didengar. Kalau butuh sound effect atau pemancar frekuensi pengacau sinyal, kasih gw lima belas menit.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tirus artistik dengan kulit agak pucat, kantung mata tipis akibat sering begadang membuat musik, dan sepasang mata hitam obsidian sayu (*sleepy dark eyes*) yang menyala fokus saat mendengarkan audio.
* **Rambut:** Rambut hitam berantakan model *choppy layered* dengan ujung poni depan diberi aksen cat hijau neon (*neon-green dyed tips*).
* **Postur & Gestur:** Bertubuh kurus jangkung (177 cm), jemarinya ramping dan selalu bergerak mengetuk ritme di meja atau saku baju.
* **Seragam & Gaya Berpakaian:** Mengenakan hoodie hitam oversized bertuliskan logo audio di balik blazer Housen yang dibiarkan terbuka, celana seragam sedikit longgar, sepatu kets hitam polos.
* **Aksesori & Barang Bawaan:** In-ear monitor custom kabel transparan melingkar di daun telinga, pemutar audio hi-res portabel, dan kabel adaptor jack di sakunya.""",
        "personality_traits": "Introvert, pendiam, bicaranya hemat kata, namun sangat loyal pada lingkaran teman dekatnya dan berbakat besar dalam rekayasa audio digital.",
        "personality_flaws": "Sering kelelahan di siang hari dan kurang peduli pada interaksi formal sekolah.",
        "dere_pattern": "Tipe Quiet Emo Producer Ally. Memasang pengacau frekuensi sinyal (jammer) untuk melumpuhkan komunikasi geng Touki saat operasi.",
        "bg_childhood": "Otodidak belajar produksi musik digital sejak umur 11 tahun di kamar tidurnya.",
        "bg_turning_point": "Diajak oleh Hatsushiba Miku bergabung ke klub musik Housen untuk menggarap aransemen panggung.",
        "bg_current": "Menjadi otak audio di balik pertunjukan musik kelas 11-1 dan festival sekolah.",
        "club_life": "Bekerja di studio kontrol audio di belakang auditorium bersama Tamanibu.",
        "relationships_md": """* **Hatsushiba Miku (11-1):** Partner kreasi musik; Miku membawa melodi ceria dan Renzo memberi pondasi bassline kokoh.
* **Hanase Tamanibu (11-2):** Sahabat begadang di studio mixer sekolah.
* **Kagami Rinoka (11-1):** Sering membantu Rinoka membersihkan noise audio vokal rekaman.
* **Protagonist:** Membantu pemain menyiapkan peralatan pengeras suara untuk pengalihan isu di hari pameran.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Shinoda Renzo, 16-year-old Japanese male student sound designer, choppy black hair with subtle neon-green tipped bangs, tired artistic dark eyes, custom in-ear monitors around neck, dark hoodie under school blazer, cool emo music producer aesthetic."
    },
    {
        "id": "kuroda_gin",
        "name": "Kuroda Gin (黒田 銀)",
        "nickname": ["Gin", "Bayangan Tenka", "Si Tanpa Suara", "Pengawal Presidium"],
        "role": "Pengawal Bayangan Presidium OSIS & Siswa Kelas 11-1",
        "grade": 11,
        "class_room": "11-1",
        "category_id": "osis",
        "age": 16,
        "birthday": "1 November",
        "zodiac": "Scorpio",
        "mbti": "ISTP",
        "gender": "Male",
        "archetype": "emo",
        "ekskul": "martial_arts",
        "club_role": "Pengawal Kehormatan Presidium OSIS & Praktisi Aikido",
        "social_class": "worker",
        "hit_die": "d10",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 16, "intelligent": 13, "looks": 14, "mind": 16, "talent": 13, "luck": 11},
        "vitals": {"physical_hp_max": 16, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": ["Berdiri dalam kesunyian di sudut ruangan mengawasi pintu", "Teh barley dingin tawar", "Latihan kuncian sendi aikido dan teknik pelucutan senjata", "Melihat Asahina Tenka tersenyum aman"],
        "dislikes": ["Orang asing yang mendekati Ketua OSIS secara agresif", "Keributan suara gaduh di dekat ruang kerja presidium", "Gerakan tubuh yang sia-sia"],
        "dir": "Characters/Love Interests/Class 11-1/Gin",
        "filename": "KURODA GIN (黒田 銀).md",
        "tagline": "Tugas saya hanya satu: memastikan tidak ada satu pun marabahaya yang menyentuh Ketua OSIS dan rekan-rekan presidium. Mundur tiga langkah dari pintu ini, atau tanganmu akan terkunci di belakang punggung.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tirus dingin dengan sorot mata abu-abu baja tajam (*piercing steel-grey eyes*) yang waspada mengawasi setiap pergerakan. Jarang sekali menunjukkan senyuman.
* **Rambut:** Rambut hitam legam dipotong model *wolf-cut* panjang yang sedikit menutupi mata kanannya (*eye-covering bangs*).
* **Postur & Gestur:** Tinggi jangkung kurus atletis (180 cm), gerak langkahnya nyaris tanpa suara bak bayangan.
* **Seragam & Gaya Berpakaian:** Seragam Housen hitam kancing penuh yang rapi, sarung tangan kulit tipis tanpa jari (*fingerless black leather glove*) di tangan kiri.
* **Aksesori & Barang Bawaan:** Sarung tangan kulit, pin lencana perak OSIS tersemat terbalik di kerah dalam blazer, dan borgol nilon pengaman kesiswaan di saku.""",
        "personality_traits": "Sangat pendiam, hemat bicara, memiliki kewaspadaan taktis tinggi, dan dedikasi mutlak pada perlindungan Asahina Tenka.",
        "personality_flaws": "Terlalu kaku dan curiga pada setiap orang baru, sulit mempercayai orang asing.",
        "dere_pattern": "Tipe Silent Bodyguard Ally. Mengawal pemain dari bayangan koridor dan menyerahkan kunci akses pintu darurat gedung.",
        "bg_childhood": "Tumbuh di keluarga penjaga keamanan tradisional; dilatih beladiri aikido sejak umur 6 tahun.",
        "bg_turning_point": "Pernah diselamatkan oleh kebaikan keluarga Tenka saat krisis ekonomi keluarganya, membuatnya mengabdikan diri sebagai pelindung Tenka.",
        "bg_current": "Menjadi enforcer keamanan resmi di lingkungan kantor Presidium OSIS kelas 11-1.",
        "club_life": "Berlatih bela diri kuncian di dojo saat sore hari sepi.",
        "relationships_md": """* **Asahina Tenka (11-1):** Sosok matahari yang ia lindungi dengan segenap nyawanya.
* **Miruam Solari (11-1):** Rekan sparing taktis pertahanan fisik presidium.
* **Kisaragi Setsuna (11-2):** Berkoordinasi dalam pengamanan acara akbar sekolah.
* **Protagonist:** Mengamati tindakan pemain dengan cermat sebelum memberinya rasa hormat prajurit.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kuroda Gin, 16-year-old tall brooding Japanese student bodyguard, messy jet-black wolf-cut hair partially covering one eye, piercing steel-grey gaze, fingerless leather glove, silent intense presence, pristine school blazer, visual novel art."
    },

    # -------------------------------------------------------------------------
    # 4 MALE STUDENTS IN CLASS 11-2 (KOKUHOU GANG)
    # -------------------------------------------------------------------------
    {
        "id": "mawatari_bando",
        "name": "Mawatari Bando (馬渡 坂東)",
        "nickname": ["Bando", "Si Kunci Inggris", "Mekanik Kokuhou", "Bando-san"],
        "role": "Mekanik Motor Kokuhou & Tangan Kanan Kazugumi",
        "grade": 11,
        "class_room": "11-2",
        "category_id": "kokuhou",
        "age": 17,
        "birthday": "9 September",
        "zodiac": "Virgo",
        "mbti": "ISTP",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "scouts",
        "club_role": "Mekanik Armada Motor Kokuhou",
        "social_class": "worker",
        "hit_die": "d10",
        "primary_stats": ["talent", "physique"],
        "saving_throws": ["talent", "physique"],
        "stats": {"physique": 15, "intelligent": 13, "looks": 13, "mind": 14, "talent": 16, "luck": 12},
        "vitals": {"physical_hp_max": 16, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": ["Membongkar karburator motor sambil mendengarkan musik rap", "Bandana hitam di dahi penahan keringat", "Kunci inggris serbaguna baja vanadium", "Ramen kuah kental dengan ekstra telur setengah matang"],
        "dislikes": ["Anak Touki yang mencuri onderdil motor orang lain", "Hujan yang membuat kabel busi motor mogok", "Orang sok tahu yang meremehkan kerja mekanik"],
        "dir": "Characters/Love Interests/Class 11-2/Bando",
        "filename": "MAWATARI BANDO (馬渡 坂東).md",
        "tagline": "Kalau motor lu mau lari 120 km/jam lewatin barikade pelabuhan Touki tanpa brebet, serahin ke gw. Tapi ingat, begitu sampai di sana... hajar mereka sampai ga ada rantai yang tersisa!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tampan jalanan berkulit sawo matang terpapar oli dan matahari, senyuman percaya diri yang roguish, sepasang mata tembaga (*copper-brown eyes*) yang tajam menganalisis mekanik mesin. Ada coretan oli tipis di tulang pipi kirinya.
* **Rambut:** Rambut gimbal pendek bertekstur (*short dreadlocks*) yang diikat ke belakang menjadi kuncir kuda pendek, dilingkari bandana hitam di dahinya.
* **Postur & Gestur:** Bertubuh liat dan berotot kokoh (179 cm, 76 kg), kedua tangannya kapalan dan kuat mencengkeram besi.
* **Seragam & Gaya Berpakaian:** Jaket seragam hitam kusam yang bagian lengannya digulung hingga siku, kaos hitam bertuliskan merk busi motor, celana kargo hitam dengan saku penuh baut.
* **Aksesori & Barang Bawaan:** Bandana hitam di dahi, kunci inggris lipat serbaguna di saku belakang, dan kain lap kain lap microfiber berminyak.""",
        "personality_traits": "Prakmatis, setia kawan tanpa banyak omong, jenius dalam modifikasi mesin motor dan memahami rute pelarian jalanan.",
        "personality_flaws": "Kurang peduli pada pelajaran teori sekolah dan sering bolos ke bengkel belakang.",
        "dere_pattern": "Tipe Loyal Mechanic Ally. Memodifikasi kendaraan jemputan party dan menyiapkan rantai evakuasi cepat.",
        "bg_childhood": "Anak montir bengkel kapal di pelabuhan sebelum berselisih dengan bos Touki.",
        "bg_turning_point": "Diselamatkan oleh Kazugumi dan Tetsuo dari pengeroyokan Touki dan bergabung ke Kokuhou.",
        "bg_current": "Menjadi kepala divisi mekanik dan transportasi konvoi motor Kokuhou.",
        "club_life": "Di markas tempat sampah belakang sekolah; merawat motor inventaris geng.",
        "relationships_md": """* **Tahagusa Kazugumi (11-2):** Sahabat terdekat dan pimpinan lapangannya; Bando adalah penasihat akal sehat Kazugumi.
* **Kurogane Tetsuo:** Sering belajar teknik setelan mesin motor di bengkel Tetsuo.
* **Samejima Ren (Touki):** Mengetahui kelemahan rute logistik pelabuhan Touki.
* **Protagonist:** Menyiapkan motor pelarian saat sandera berhasil dibebaskan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Mawatari Bando, 17-year-old Japanese delinquent mechanic, short dreadlocks tied in high ponytail, black bandana on forehead, copper-brown eyes, faint smudge of motor oil on cheek, rolled up gakuran sleeves, roguish confident grin, anime visual novel art."
    },
    {
        "id": "ouga_tesshin",
        "name": "Ouga Tesshin (逢坂 鉄心)",
        "nickname": ["Tesshin", "Batu Karang 11-2", "Raksasa Pendiam", "Tembok Housen"],
        "role": "Raksasa Pelindung Kelas 11-2 & Judoka",
        "grade": 11,
        "class_room": "11-2",
        "category_id": "kokuhou",
        "age": 17,
        "birthday": "25 Desember",
        "zodiac": "Capricorn",
        "mbti": "ISFJ",
        "gender": "Male",
        "archetype": "jock",
        "ekskul": "martial_arts",
        "club_role": "Bouncer Kelas 11-2 & Atlet Judo",
        "social_class": "worker",
        "hit_die": "d12",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 18, "intelligent": 10, "looks": 12, "mind": 16, "talent": 12, "luck": 11},
        "vitals": {"physical_hp_max": 22, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": ["Roti melon jumbo isi krim mentega manis", "Tidur siang di bawah pohon rindang taman", "Membantu siswi membawakan meja berat", "Bantingan judo ippon bersih di matras"],
        "dislikes": ["Orang berisik yang membully teman sekelasnya", "Pakaian yang kekecilan dan robek di ketiak", "Makanan yang porsinya terlalu sedikit"],
        "dir": "Characters/Love Interests/Class 11-2/Tesshin",
        "filename": "OUGA TESSHIN (逢坂 鉄心).md",
        "tagline": "Kazugumi bilang... teman sekelas ga boleh ada yang terluka. Kamu jalan di belakang tubuhku. Pipa besi mereka ga akan bisa menembus punggung ini.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah persegi lebar berkarakter tenang dan hangat bak raksasa lembut (*gentle giant*), alis tebal lurus, tatapan mata gelap damai (*calm dark eyes*), dan gigi seri depan yang sedikit sompel kecil saat tersenyum ramah.
* **Rambut:** Kepala cepak plontos sangat pendek rapi (*clean buzzcut*).
* **Postur & Gestur:** Raksasa bertubuh masif luar biasa tinggi besar (192 cm, 105 kg) dengan dada setebal tembok bata dan lengan berurat kawat.
* **Seragam & Gaya Berpakaian:** Seragam Housen ukuran XXXL yang kancingnya nyaris meledak menahan otot dadanya, celana panjang longgar dengan sabuk kulit kokoh.
* **Aksesori & Barang Bawaan:** Bungkus roti melon jumbo di saku, plester perekat kram otot, dan handuk leher katun tebal.""",
        "personality_traits": "Sangat pendiam, penyayang, setia kawan tiada tara, dan bertindak sebagai perisai pelindung hidup bagi rekan-rekannya di Kokuhou.",
        "personality_flaws": "Lambat dalam berpikir taktis rumit, namun luar biasa mematikan jika dipicu amarah oleh kekerasan pada sahabatnya.",
        "dere_pattern": "Tipe Gentle Giant Protector. Membawa tameng pintu atau drum besi untuk menangkis proyektil lawan demi melindungi party.",
        "bg_childhood": "Tumbuh besar di pedesaan utara sebelum pindah ke kota; sering diejek karena ukuran tubuhnya yang raksasa.",
        "bg_turning_point": "Diterima dengan tulus oleh anak-anak 11-2 dan Kazugumi tanpa pernah ditakuti.",
        "bg_current": "Menjadi benteng pertahanan utama kelas 11-2 dan garda depan penahan serbuan musuh.",
        "club_life": "Berlatih di ruang judo dan membantu Pak Kashisaka memindahkan peralatan matras.",
        "relationships_md": """* **Tahagusa Kazugumi (11-2):** Pimpinan yang ia patuhi sepenuh hati; siap menahan pukulan apa pun demi Kazugumi.
* **Kumada Riki (10-1):** Rekan atlet judo sesama raksasa; mereka sering makan ramen bersama.
* **Kanzawa Ryuuji (Touki):** Musuh fisik seimbang; Tesshin siap menahan hantaman rantai Kanzawa.
* **Protagonist:** Mengangkat pemain ke atas pundaknya untuk meraih jendela atap gudang pelabuhan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Ouga Tesshin, 17-year-old massive 192cm Japanese judoka student, cleanly shaved buzzcut, thick straight eyebrows, gentle calm dark eyes, slightly chipped front tooth, muscular broad-shouldered school uniform straining at seams, gentle giant anime visual novel art."
    },
    {
        "id": "komiya_junta",
        "name": "Komiya Junta (小宮 隼太)",
        "nickname": ["Junta", "Si Dadu Emas", "Makelar Taruhan", "Rubah Kokuhou"],
        "role": "Makelar Taruhan & Intel Jalanan Kokuhou",
        "grade": 11,
        "class_room": "11-2",
        "category_id": "kokuhou",
        "age": 16,
        "birthday": "7 Juli",
        "zodiac": "Cancer",
        "mbti": "ESTP",
        "gender": "Male",
        "archetype": "class_clown",
        "ekskul": "gaming",
        "club_role": "Intelijen Jalanan & Makelar Taruhan",
        "social_class": "worker",
        "hit_die": "d8",
        "primary_stats": ["luck", "intelligent"],
        "saving_throws": ["luck", "intelligent"],
        "stats": {"physique": 12, "intelligent": 15, "looks": 14, "mind": 13, "talent": 15, "luck": 17},
        "vitals": {"physical_hp_max": 12, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": ["Menebak probabilitas menang-kalah dalam taruhan", "Permen karet mint yang ditiup jadi balon besar", "Mendengar rumor rahasia murid sekolah lain", "Dadu enam sisi dari tulang sintetis"],
        "dislikes": ["Orang yang kabur membawa utang taruhan", "Dituduh mencurangi kocokan dadu", "Rencana kaku yang tidak fleksibel"],
        "dir": "Characters/Love Interests/Class 11-2/Junta",
        "filename": "KOMIYA JUNTA (小宮 隼太).md",
        "tagline": "Peluang kita menang lawan Touki cuma 28% menurut matematika kertas. Tapi dengan sedikit tipuan dadu dan jebakan debu kapur... persentasenya bisa gw putar jadi 90%! Pasang taruhan kalian sekarang!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tirus licik yang tampan dengan sepasang mata keemasan (*cunning golden-fox eyes*) yang selalu berkedip nakal. Sering mengunyah permen karet tiup di pipinya.
* **Rambut:** Rambut pirang kusam acak-acakan (*bleached dirty-blonde messy hair*) dipotong pendek gaya jalanan.
* **Postur & Gestur:** Bertubuh ramping gesit (173 cm), tangannya sangat lihai memainkan koin atau dadu di sela jari-jemarinya (*sleight of hand*).
* **Seragam & Gaya Berpakaian:** Kemeja putih seragam yang dibuka dua kancing atasnya memperlihatkan kaos bergambar kartu remi, kalung tali hitam berliontin dadu mini, celana seragam modis.
* **Aksesori & Barang Bawaan:** Tiga set dadu keberuntungan di saku, buku catatan taruhan kecil bersampul plastik, dan bungkus permen karet mint.""",
        "personality_traits": "Cerdik, suka berjudi dengan nasib, humoris, pandai mengalihkan perhatian penjaga, dan punya intuisi keberuntungan yang mistis.",
        "personality_flaws": "Terlalu suka mengambil risiko berbahaya demi sensasi adrenalin.",
        "dere_pattern": "Tipe Trickster Ally. Memberikan trik pengalihan perhatian dan bonus Luck Point pada lemparan dadu kritis party.",
        "bg_childhood": "Anak pemilik toko pachinko dan biliar di pusat kota, terbiasa membaca trik orang dewasa.",
        "bg_turning_point": "Hampir dipukuli lintah darat sebelum diselamatkan oleh Kazugumi dan dibawa masuk ke Kokuhou.",
        "bg_current": "Menjadi otak taktik kotor dan makelar informasi jalanan Kokuhou di kelas 11-2.",
        "club_life": "Nongkrong di arkade game atau pojok tempat sampah belakang sekolah.",
        "relationships_md": """* **Tahagusa Kazugumi (11-2):** Menganggap Kazugumi bos paling keren yang pernah ia temui.
* **Takamine Ryo (10-1):** Sering menukar koin game dengan Ryo di arcade center.
* **Mawatari Bando (11-2):** Partner bercanda santai saat nongkrong di markas.
* **Protagonist:** Menghitung odds kemenangan party dan membantu menjebak penjaga pintu gudang Touki.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Komiya Junta, 16-year-old sly Japanese student gambler and street broker, bleached dirty-blonde messy hair, chewing bubblegum, cunning golden fox-like eyes, roguish smirk, unbuttoned collar with miniature die pendant necklace, stylish visual novel art."
    },
    {
        "id": "sendo_kyosuke",
        "name": "Sendo Kyosuke (仙道 恭介)",
        "nickname": ["Kyosuke", "Kyo", "Pembalap Liar", "Sepupu Airi"],
        "role": "Pembalap Liar Sepupu Airi & Enforcer Kokuhou",
        "grade": 11,
        "class_room": "11-2",
        "category_id": "kokuhou",
        "age": 17,
        "birthday": "11 Agustus",
        "zodiac": "Leo",
        "mbti": "ESTP",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "sports",
        "club_role": "Speed Enforcer Kokuhou & Pembalap Liar",
        "social_class": "middle_class",
        "hit_die": "d10",
        "primary_stats": ["physique", "looks"],
        "saving_throws": ["physique", "looks"],
        "stats": {"physique": 15, "intelligent": 12, "looks": 16, "mind": 13, "talent": 15, "luck": 13},
        "vitals": {"physical_hp_max": 16, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 16},
        "likes": ["Motor sport 400cc dua silinder warna merah menyala", "Aroma aspal panas di jalan layang pantai tengah malam", "Melihat sepupunya Airi tersenyum ceria", "Kacamata hitam gaya aviator"],
        "dislikes": ["Polisi patroli yang menyita knalpot motornya", "Cowok brengsek yang berani mengganggu atau mempermainkan Airi", "Kecepatan di bawah 80 km/jam"],
        "dir": "Characters/Love Interests/Class 11-2/Kyosuke",
        "filename": "SENDO KYOSUKE (仙道 恭介).md",
        "tagline": "Airi itu sepupu gw yang paling berharga. Siapa pun yang berani bikin dia nangis, atau berani nyentuh teman-teman sekelasnya... bakal gw kejar sampai ujung dermaga pelabuhan dan gw seret pake knalpot motor!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tampan modis ala gyaru-o / street racer dengan kulit kecokelatan sehat, senyuman percaya diri yang memikat, sepasang mata hazel menyala (*fiery hazel eyes*), dan anting perak salib (*silver cross earring*) di telinga kirinya.
* **Rambut:** Rambut cokelat kemerahan (*reddish-brown*) modis ditata model *layered wolf-cut* bertekstur rapi dengan sedikit wax rambut wangi.
* **Postur & Gestur:** Bertubuh atletis tinggi semampai (181 cm, 75 kg), gesturnya percaya diri dan selalu mengenakan sarung tangan balap kulit tanpa jari.
* **Seragam & Gaya Berpakaian:** Blazer Housen yang disampirkan di pundak kiri, kemeja seragam terbuka menampakkan kaos hitam grafiti, celana seragam pas badan, jaket bomber motor merah-hitam di motor.
* **Aksesori & Barang Bawaan:** Kunci motor berlogo Honda CB400, sarung tangan balap kulit, anting salib perak, dan kacamata hitam di saku blazer.""",
        "personality_traits": "Protektif, modis, pemberani, penyuka kecepatan tinggi, dan sangat menghargai ikatan darah keluarga.",
        "personality_flaws": "Sangat emosional dan protektif berlebihan (*overprotective*) jika menyangkut keselamatan sepupunya, Sendou Airi.",
        "dere_pattern": "Tipe Bad-Boy Speedster Ally. Menyediakan konvoi motor sport kecepatan tinggi untuk membelah barikade pengepungan Touki.",
        "bg_childhood": "Tumbuh besar bersama Sendou Airi; selalu menjadi pelindung Airi sejak masa kanak-kanak.",
        "bg_turning_point": "Membeli motor sport pertamanya dan menjadi pembalap liar paling disegani di jalur jalan layang pantai.",
        "bg_current": "Bergabung ke faksi Kokuhou di kelas 11-2 sebagai divisi pengintai kecepatan kilat.",
        "club_life": "Di markas parkiran belakang dan bengkel motor modifikasi Bando.",
        "relationships_md": """* **Sendou Airi (10-1):** Sepupu kesayangannya; Kyosuke akan menghajar siapa pun yang berani mengganggu Airi.
* **Tahagusa Kazugumi (11-2):** Rekan duel kecepatan motor dan kapten gengnya di sekolah.
* **Kiba Touya (Touki):** Rival balap liar di jalanan dermaga pelabuhan Touki.
* **Protagonist:** Menguji apakah pemain layak dipercaya untuk melindungi Airi dan teman sekelasnya.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Sendo Kyosuke, 17-year-old stylish Japanese speed delinquent, reddish-brown layered wolf-cut hair, silver cross earring, confident smirking hazel eyes, school uniform with bomber jacket draped on shoulder, cool gyaru-o racer aesthetic, visual novel art."
    },

    # -------------------------------------------------------------------------
    # 4 TOUKI DELINQUENTS
    # -------------------------------------------------------------------------
    {
        "id": "onizuka_gouki",
        "name": "Onizuka Gouki (鬼塚 剛鬼)",
        "nickname": ["Aka-Oni", "Ogre Merah", "Penguasa Pelabuhan", "Bos Touki"],
        "role": "Ketua Umum Geng SMA Touki ('The Red Ogre')",
        "grade": 12,
        "class_room": "SMA Kejuruan Touki (Kelas 12-Teknik Mesin)",
        "category_id": "touki",
        "age": 18,
        "birthday": "6 Juni",
        "zodiac": "Gemini",
        "mbti": "ESTJ",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "martial_arts",
        "club_role": "Ketua Umum Geng SMA Touki",
        "social_class": "lower_class",
        "hit_die": "d12",
        "primary_stats": ["physique", "mind"],
        "saving_throws": ["physique", "mind"],
        "stats": {"physique": 19, "intelligent": 12, "looks": 11, "mind": 17, "talent": 13, "luck": 10},
        "vitals": {"physical_hp_max": 26, "composure_max": 18},
        "heart_meter": {"base": 1, "confession_target_dc": 19},
        "likes": ["Melihat lawan berlutut memohon ampun di bawah kakinya", "Daging panggang setengah matang berdarah", "Suara rantai motor dan dentuman drum minyak", "Membuktikan supremasi Touki di seluruh kota"],
        "dislikes": ["Anak-anak elitis Housen yang merasa dirinya lebih suci dari anak jalanan", "Kurogane Tetsuo (dendam masa lalu)", "Kekalahan dalam duel satu lawan satu"],
        "dir": "Characters/Love Interests/Touki/Gouki",
        "filename": "ONIZUKA GOUKI (鬼塚 剛鬼).md",
        "tagline": "Housen itu cuma sarang anak-anak manja berdasi rapi yang ga pernah ngerasain lapar di perutnya! Di pelabuhan Touki ini, taring dan darah yang memutuskan siapa penguasa sejati! Bawa Kurogane Tetsuo ke hadapan gw, atau teman kalian ga bakal pernah pulang!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah bengis mengerikan berusia 18 tahun dengan rahang masif, tatapan mata kuning keemasan buas (*bloodshot amber-gold eyes*) bak iblis oni, bekas luka cakaran dalam (*claw-like facial scar*) yang membentang dari pelipis kanan melintasi pipi hingga ke leher.
* **Rambut:** Rambut mohawk kasar berduri berwarna hitam pekat dengan ujung-ujungnya dicat merah darah (*crimson-tipped spiky mohawk*).
* **Postur & Gestur:** Monster bertubuh raksasa luar biasa berotot tebal bak gorilla gunung (195 cm, 110 kg), urat-urat lengannya mencuat tebal, memancarkan aura haus darah yang mencekik.
* **Seragam & Gaya Berpakaian:** Gakuran hitam robek tanpa lengan (*sleeveless torn black gakuran*) dengan sulaman benang merah bergambar topeng iblis Oni di punggung, memperlihatkan tato tribal hitam di kedua pundak dan lengannya, rantai motor tebal melilit pinggangnya sebagai sabuk.
* **Aksesori & Barang Bawaan:** Cincin besi tengkorak di jemari tangannya, pipa besi baja cor 1 meter di tangan kanan, dan sepatu bot militer bertali kawat baja.""",
        "personality_traits": "Brutal, tiran jalanan tanpa ampun, haus kekuasaan, memimpin ratusan berandal dermaga lewat teror fisik dan kekuatan mutlak.",
        "personality_flaws": "Terlalu dibutakan oleh amarah dendam lamanya pada Kurogane Tetsuo.",
        "dere_pattern": "Antagonis Utama / Respected Rival. Jika ditumbangkan secara jantan satu lawan satu, Onizuka akan mengakui kekalahannya dan memerintahkan Touki mundur dari Housen.",
        "bg_childhood": "Tumbuh di kawasan kumuh pelabuhan kontainer; hidup dengan bertarung demi sesuap nasi sejak umur 10 tahun.",
        "bg_turning_point": "Kalah telak dari Kurogane Tetsuo di tawuran massal 2 tahun lalu, meninggalkannya dengan dendam kesumat membara.",
        "bg_current": "Menjadi bos tertinggi SMA Touki dan merencanakan penculikan murid Housen sebagai umpan memancing Tetsuo.",
        "club_life": "Di markas gudang kontainer hanggar pelabuhan Distrik 4.",
        "relationships_md": """* **Kurogane Tetsuo (Housen):** Musuh bebuyutan hidup-mati; Onizuka hidup demi membalas dendam pada Tetsuo.
* **Kanzawa Ryuuji (Touki):** Letnan kepercayaannya yang ia perintahkan menculik murid Housen.
* **Samejima Ren (Touki):** Penasihat licik yang menyusun skema pemerasan.
* **Protagonist:** Lawan penentu di klimaks Boss Fight Gudang Pelabuhan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Onizuka Gouki, 18-year-old terrifying 195cm Japanese gang leader, crimson-tipped spiky mohawk, deep brutal facial scar across cheek and neck, furious bloodshot amber-gold eyes, sleeveless ripped black gakuran with demon oni embroidery, monstrous muscular build, Tokyo Revengers villain aesthetic."
    },
    {
        "id": "kanzawa_ryuuji",
        "name": "Kanzawa Ryuuji (金沢 竜二)",
        "nickname": ["Ryuuji", "Si Rantai Berkarat", "Jagot Pelabuhan", "Enforcer Touki"],
        "role": "Komandan Regu Serbu Touki ('Rust Chain')",
        "grade": 11,
        "class_room": "SMA Kejuruan Touki (Kelas 11-Pengelasan)",
        "category_id": "touki",
        "age": 17,
        "birthday": "13 Maret",
        "zodiac": "Pisces",
        "mbti": "ESTP",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "sports",
        "club_role": "Komandan Regu Serbu & Penculik",
        "social_class": "lower_class",
        "hit_die": "d10",
        "primary_stats": ["physique", "talent"],
        "saving_throws": ["physique", "talent"],
        "stats": {"physique": 17, "intelligent": 11, "looks": 12, "mind": 14, "talent": 15, "luck": 11},
        "vitals": {"physical_hp_max": 18, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 18},
        "likes": ["Mendengar gemerincing rantai motor besi berkarat di tangannya", "Meludahkan puntung rokok ke sepatu musuh", "Menyandera anak-anak sekolah elit", "Menaiki motor chopper bising"],
        "dislikes": ["Anak Housen yang bertingkah sok berani di depannya", "Rantai senjatanya terlepas saat duel", "Polisi patroli pelabuhan"],
        "dir": "Characters/Love Interests/Touki/Kanzawa",
        "filename": "KANZAWA RYUUJI (金沢 竜二).md",
        "tagline": "Lihat teman kalian ini... terikat rapi di atas balok kontainer. Mau dia turun selamat? Serahin uang kas ekskul 500.000 yen kalian sekarang, atau rantai berkarat ini bakal mencium wajah tampan kalian satu per satu!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tirus kejam dengan sorot mata hijau lumut dingin berbisa (*venomous greenish-grey eyes*), tindik perak di bibir bawah kiri dan alis kanan, sering menyeringai mencemooh lawan.
* **Rambut:** Rambut hitam jabrik berantakan bertekstur kasar yang jatuh menusuk kening.
* **Postur & Gestur:** Bertubuh tinggi ramping berotot liat liat petarung jalanan (181 cm, 77 kg), tangan kanannya selalu melilitkan rantai motor berkarat dengan gembok seberat 2 kg di ujungnya.
* **Seragam & Gaya Berpakaian:** Gakuran hitam kotor terbuka tanpa kemeja dalam, celana longgar bertumpuk dengan sepatu boots kerja pelabuhan.
* **Aksesori & Barang Bawaan:** Rantai motor berkarat 2 meter dengan gembok kuningan berat, rokok di balik daun telinga, dan perban tinju kotor di pergelangan tangan.""",
        "personality_traits": "Sadis, provokatif, licik, sangat agresif, dan menikmati ketakutan yang terpancar di mata korbannya.",
        "personality_flaws": "Terlalu sombong dengan jangkauan serangan rantainya, mudah hilang kendali jika senjatanya dilucuti.",
        "dere_pattern": "Mini-Boss Antagonis. Lawan taktis dalam pertempuran penyelamatan sandera di dalam gudang kontainer.",
        "bg_childhood": "Berasal dari keluarga buruh dermaga yang berantakan; bergabung dengan geng Touki sejak SMP.",
        "bg_turning_point": "Menjadi letnan lapangan Onizuka Gouki setelah membuktikan kekejamannya di perang wilayah.",
        "bg_current": "Memimpin operasi penculikan salah satu player di stasiun perlintasan kereta api.",
        "club_life": "Di bengkel pengelasan pelabuhan dan hanggar kontainer Touki.",
        "relationships_md": """* **Onizuka Gouki (Touki):** Bos yang ia takuti dan patuhi perintahnya.
* **Samejima Ren (Touki):** Sering berdebat soal taktik kasar vs taktik halus.
* **Tahagusa Kazugumi (Housen):** Musuh bebuyutannya di jalanan; Kazugumi pernah mematahkan hidungnya setahun lalu.
* **Protagonist:** Berhadapan langsung di Fase Boss Fight Gudang Kontainer.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kanzawa Ryuuji, 17-year-old cruel Japanese delinquent raider, jagged spiky black hair, eyebrow and lip piercings, venomous greenish-grey eyes, open ragged black gakuran, rusted motorcycle chain with heavy padlock wrapped around arm, hostile sneer, Tokyo Revengers visual novel art."
    },
    {
        "id": "samejima_ren",
        "name": "Samejima Ren (鮫島 蓮)",
        "nickname": ["Same-Ren", "Hiu Putih Touki", "Si Otak Kacamata", "Strategist Touki"],
        "role": "Otak Strategi & Hacker Jalanan Touki ('White Shark')",
        "grade": 11,
        "class_room": "SMA Kejuruan Touki (Kelas 11-Elektronika)",
        "category_id": "touki",
        "age": 17,
        "birthday": "19 Januari",
        "zodiac": "Capricorn",
        "mbti": "INTJ",
        "gender": "Male",
        "archetype": "nerd",
        "ekskul": "gaming",
        "club_role": "Otak Strategi & Intelijen Touki",
        "social_class": "middle_class",
        "hit_die": "d8",
        "primary_stats": ["intelligent", "mind"],
        "saving_throws": ["intelligent", "mind"],
        "stats": {"physique": 11, "intelligent": 17, "looks": 14, "mind": 16, "talent": 15, "luck": 12},
        "vitals": {"physical_hp_max": 12, "composure_max": 16},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": ["Meretas kamera CCTV publik distrik pelabuhan", "Mengamati data pergerakan polisi lewat radio scanner", "Kopi dingin kaleng hitam tanpa gula", "Skema pemerasan rapi tanpa meninggalkan bukti jejak fisik"],
        "dislikes": ["Kekerasan tanpa otak yang tidak menghasilkan keuntungan uang", "Peretasan yang digagalkan oleh firewall tak dikenal", "Rencana yang hancur oleh kebodohan anak buah"],
        "dir": "Characters/Love Interests/Touki/Samejima",
        "filename": "SAMEJIMA REN (鮫島 蓮).md",
        "tagline": "Otot hanyalah alat tawar-menawar yang primitif. Yang mengendalikan hasil perang adalah siapa yang memegang informasi dan rute logistik musuh. Housen sudah masuk ke dalam jaring laba-laba kami sejak kalian menginjak gerbang sekolah pagi ini.",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah tirus pucat dingin dengan sepasang mata biru pucat bak es beku (*pale icy-blue eyes*), kacamata persegi tipis tanpa bingkai (*frameless rectangular glasses*), senyuman tipis kalkulatif bak hiu pemangsa.
* **Rambut:** Rambut platinum-abu perak (*platinum-grey*) lurus yang disisir belah tengah licin rapi (*neat center-parted hair*).
* **Postur & Gestur:** Bertubuh tinggi kurus (178 cm), tangannya selalu memegang smartphone terenkripsi hitam, selalu menjaga jarak dari arena baku hantam fisik.
* **Seragam & Gaya Berpakaian:** Blazer hitam seragam kejuruan Touki yang sangat bersih dan rapi (kontras tajam dengan anggota geng Touki lainnya yang dekil), kemeja abu-abu berkancing penuh tanpa dasi.
* **Aksesori & Barang Bawaan:** Kacamata frameless, smartphone ganda terenkripsi, kabel USB hacking portabel, dan pemancar jammer sinyal saku.""",
        "personality_traits": "Sangat analitis, dingin, licik, sosiopatik santai, tidak peduli pada darah atau loyalitas emosional selama rencananya sukses.",
        "personality_flaws": "Meremehkan kekuatan ikatan persahabatan dan keberanian irasional murid-murid Housen.",
        "dere_pattern": "Otak Kejahatan Antagonis. Menjadi target peretasan balasan oleh Takamine Ryo dan Alya.",
        "bg_childhood": "Anak teknisi telekomunikasi yang broken home; terbiasa meretas jaringan internet sejak SD.",
        "bg_turning_point": "Memilih menjual keahlian komputernya ke geng Touki demi mendapatkan kekuasaan dan perlindungan fisik.",
        "bg_current": "Menyusun skema pemerasan kas ekskul Housen dan memantau rute polisi pelabuhan.",
        "club_life": "Di ruang server tersembunyi markas dermaga Touki.",
        "relationships_md": """* **Onizuka Gouki (Touki):** Memanfaatkan kekuatan otot Gouki sebagai pelindungnya.
* **Takamine Ryo (Housen):** Musuh cyber perang peretasan digital jaringan kamera CCTV.
* **Yuki Haruto (Housen):** Berusaha memburu kartu memori Haruto yang menyimpan bukti kejahatannya.
* **Protagonist:** Berusaha mengacaukan rencana penyelamatan pemain lewat pengalihan rute palsu.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Samejima Ren, 17-year-old chilling Japanese delinquent strategist, center-parted platinum-grey hair, frameless rectangular glasses, calculating cold pale-blue eyes, predatory faint smile, neat black blazer, smartphone in hand, psychopathic intellectual anime art."
    },
    {
        "id": "kiba_touya",
        "name": "Kiba Touya (木場 闘夜)",
        "nickname": ["Touya", "Taring Malam", "Kapten Konvoi Touki", "Pembalap Liar Pelabuhan"],
        "role": "Kapten Konvoi Motor Touki ('Fang of the Night')",
        "grade": 11,
        "class_room": "SMA Kejuruan Touki (Kelas 11-Otomotif)",
        "category_id": "touki",
        "age": 17,
        "birthday": "24 Agustus",
        "zodiac": "Virgo",
        "mbti": "ESTP",
        "gender": "Male",
        "archetype": "delinquent",
        "ekskul": "outdoor",
        "club_role": "Kapten Konvoi Motor Bōsōzoku Touki",
        "social_class": "lower_class",
        "hit_die": "d10",
        "primary_stats": ["physique", "talent"],
        "saving_throws": ["physique", "talent"],
        "stats": {"physique": 16, "intelligent": 11, "looks": 13, "mind": 13, "talent": 16, "luck": 13},
        "vitals": {"physical_hp_max": 16, "composure_max": 14},
        "heart_meter": {"base": 1, "confession_target_dc": 17},
        "likes": ["Mengebut di jalanan pelabuhan tanpa helm di tengah malam", "Knalpot motor berisik tanpa saringan peredam", "Menghancurkan spion mobil warga", "Goggles motor kuning retro"],
        "dislikes": ["Sendo Kyosuke (rival balap jalanan)", "Pengejaran mobil polisi", "Motor yang kehabisan bensin di tengah operasi"],
        "dir": "Characters/Love Interests/Touki/Touya",
        "filename": "KIBA TOUYA (木場 闘夜).md",
        "tagline": "Mengaumlah mesin dua tak! Di jalanan aspal malam pelabuhan ini, ga ada yang bisa lolos dari kejaran taring konvoi Touki! Siapkan pemukul kalian, kita ratakan barikade mereka!",
        "appearance_md": """* **Ciri Fisik & Wajah:** Wajah liar berantakan dengan seringai gila adrenalin, bekas luka gores di dagu, sepasang mata hitam liar (*wild dark eyes*) yang menyala saat memacu gas motor.
* **Rambut:** Rambut pirang kuning jagung (*bleached yellow hair*) yang acak-acakan tertiup angin pelabuhan.
* **Postur & Gestur:** Bertubuh atletis ramping dan liat (177 cm, 72 kg), selalu mengenakan kacamata goggles motor bertinta kuning di lehernya.
* **Seragam & Gaya Berpakaian:** Jaket kulit motor hitam robek dengan sablon tengkorak bertanduk iblis di dada kiri, celana jins robek di lutut, sepatu boots motor usang.
* **Aksesori & Barang Bawaan:** Kacamata goggles motor kuning, pipa besi pendek berpelindung karet, dan kunci kontak motor Yamaha RX-King modifikasi.""",
        "personality_traits": "Nekat, maniak kecepatan, agresif di atas motor, memimpin puluhan motor bōsōzoku Touki dalam patroli jalanan.",
        "personality_flaws": "Mudah terdistraksi oleh tantangan balap jalanan dan sering mengabaikan perintah taktis Samejima.",
        "dere_pattern": "Speedster Antagonis. Menjadi rintangan pengejaran motor di jalanan menuju gudang kontainer.",
        "bg_childhood": "Mekanik jalanan liar yang belajar mengendarai motor sejak umur 12 tahun.",
        "bg_turning_point": "Memenangkan balap liar distrik pelabuhan dan diangkat menjadi kapten motor Touki.",
        "bg_current": "Memimpin blokade jalanan untuk mencegah bantuan Kokuhou masuk ke area pelabuhan.",
        "club_life": "Di bengkel otomotif Touki dan sirkuit liar dermaga.",
        "relationships_md": """* **Onizuka Gouki (Touki):** Takut dan tunduk pada tinju maut Gouki.
* **Sendo Kyosuke (Housen):** Rival abadi di aspal jalanan; dendam karena sering kalah balap dari Kyosuke.
* **Kanzawa Ryuuji (Touki):** Membantu Kanzawa membawa sandera dengan konvoi motor.
* **Protagonist:** Berhadapan dalam duel kejar-kejaran kendaraan di jalan layang pelabuhan.""",
        "prompt_summary": "anime ID photo portrait 3:4 of Kiba Touya, 17-year-old wild Japanese delinquent biker, windblown bleached yellow hair, yellow tinted riding goggles around neck, scar on chin, manic reckless grin, battered black leather jacket with demon skull stencil, speed delinquent visual novel art."
    }
]

def generate_markdown(char):
    stats = char["stats"]
    vitals = char["vitals"]
    hm = char["heart_meter"]
    likes_str = "\n".join([f'  - "{item}"' for item in char["likes"]])
    dislikes_str = "\n".join([f'  - "{item}"' for item in char["dislikes"]])
    nicknames_str = json.dumps(char["nickname"], ensure_ascii=False)
    prim_stats_str = json.dumps(char["primary_stats"], ensure_ascii=False)
    save_throws_str = json.dumps(char["saving_throws"], ensure_ascii=False)

    md = f"""---
id: {char["id"]}
name: "{char["name"]}"
nickname: {nicknames_str}
role: "{char["role"]}"
grade: {json.dumps(char["grade"])}
class_room: "{char["class_room"]}"
category_id: "{char["category_id"]}"
age: {char["age"]}
birthday: "{char["birthday"]}"
zodiac: "{char["zodiac"]}"
mbti: "{char["mbti"]}"
gender: "{char["gender"]}"
archetype: "{char["archetype"]}"
ekskul: "{char["ekskul"]}"
club_role: "{char["club_role"]}"
social_class: "{char["social_class"]}"
hit_die: "{char["hit_die"]}"
primary_stats: {prim_stats_str}
saving_throws: {save_throws_str}
stats:
  physique: {stats["physique"]}
  intelligent: {stats["intelligent"]}
  looks: {stats["looks"]}
  mind: {stats["mind"]}
  talent: {stats["talent"]}
  luck: {stats["luck"]}
vitals:
  physical_hp_max: {vitals["physical_hp_max"]}
  composure_max: {vitals["composure_max"]}
heart_meter:
  base: {hm["base"]}
  confession_target_dc: {hm["confession_target_dc"]}
likes:
{likes_str}
dislikes:
{dislikes_str}
tags:
  - canon-character
  - housen-academy
  - {char["category_id"]}
---

# 🌸 {char["name"]}

> *"{char["tagline"]}"*

---

## 🖼️ Galeri Visual Karakter

| ID Foto Pelajar (3:4) | CG Sinematik (16:9) |
| :---: | :---: |
| ![[{char["id"]}_ID_Portrait.png|250]] | ![[{char["id"]}_CG_Scene.png|480]] |

---

## 📋 Profil Singkat & Statistik Dasar

| Parameter | Nilai / Keterangan |
| :--- | :--- |
| **Nama Lengkap** | {char["name"]} |
| **Nama Panggilan** | {', '.join(char["nickname"])} |
| **Kelas & Posisi** | {char["class_room"]} • {char["role"]} |
| **Usia & Tanggal Lahir**| {char["age"]} tahun • {char["birthday"]} ({char["zodiac"]}) |
| **Tipe Kepribadian** | {char["mbti"]} |
| **Arketipe & Ekskul** | **{char["archetype"]}** (`{char["archetype"]}`) • **{char["ekskul"]}** (`{char["club_role"]}`) |
| **Latar Sosial-Ekonomi**| {char["social_class"]} |

### Statistik Atribut TRPG (D&D 5e Chassis)

| PHY (Physique) | INT (Intelligent) | LOK (Looks) | MND (Mind) | TLN (Talent) | LCK (Luck) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **{stats["physique"]}** ({(stats["physique"]-10)//2:+d}) | **{stats["intelligent"]}** ({(stats["intelligent"]-10)//2:+d}) | **{stats["looks"]}** ({(stats["looks"]-10)//2:+d}) | **{stats["mind"]}** ({(stats["mind"]-10)//2:+d}) | **{stats["talent"]}** ({(stats["talent"]-10)//2:+d}) | **{stats["luck"]}** ({(stats["luck"]-10)//2:+d}) |

* **Hit Die**: `{char["hit_die"]}` • **Max Physical HP**: `{vitals["physical_hp_max"]}` • **Max Composure**: `{vitals["composure_max"]}`
* **Kemahiran Saving Throw**: {', '.join(char["saving_throws"])}

---

## 🎀 Penampilan Fisik & Gaya Visual

{char["appearance_md"]}

---

## 🧠 Kepribadian & Pola Emosional

### 1. Karakter Dasar & Sifat Dominan
{char["personality_traits"]}

### 2. Celah Emosional & Kelemahan Batin (Flaws & Insecurities)
{char["personality_flaws"]}

### 3. Pola Kasmaran & Ikatan Emosional (Dere Pattern)
{char["dere_pattern"]}

---

## 📖 Latar Belakang & Masa Lalu

### Fase Kanak-kanak
{char["bg_childhood"]}

### Fase Titik Balik
{char["bg_turning_point"]}

### Kondisi Terkini di Sekolah / Distrik
{char["bg_current"]}

---

## 🏫 Kehidupan Klub & Posisi Sekolah (Bukatsu)

{char["club_life"]}

---

## 🤝 Hubungan Sosial & Dinamika Karakter

{char["relationships_md"]}

---

## 💖 Sistem Romansa: Heart Meter Progression (1–10 ♥)

| Level ♥ | Status Hubungan | Perilaku & Respon Unik | Event Spesial yang Terbuka |
| :---: | :--- | :--- | :--- |
| **1–2 ♥** | *Waspada / Formal Berjarak* | Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. | Pertemuan pertama dan interaksi formal di sekolah. |
| **3–4 ♥** | *Rekan Kerja & Sekutu* | Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. | Diskusi strategi rahasia atau bantuan tugas harian. |
| **5–6 ♥** | *Kepercayaan Khusus / Salting* | Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. | Momen intim berdua saat senja atau saling merawat luka. |
| **7–8 ♥** | *Ikatan Jiwa / Penuh Kasih* | Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. | Hadiah istimewa dan pengakuan kesetiaan mendalam. |
| **9–10 ♥** | *Kekasih Abadi / Sumpah Sejati* | Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. | Momen penembakan emosional dan sumpah masa depan bersama. |

---

## 🎁 Preferensi Hadiah (Gift Giving)

* **Sangat Disukai (+3 Heart Points):**
  * {char["likes"][0]}
  * {char["likes"][1]}
* **Disukai (+1 Heart Point):**
  * {char["likes"][2]}
  * {char["likes"][3]}
* **Dibenci (-2 Heart Points):**
  * {char["dislikes"][0]}
  * {char["dislikes"][1]}

---

## 📍 Rekomendasi Lokasi Kencan (Dating Spots)

1. **Area Markas Rahasia / Sudut Favorit:** Tempat privat yang mencerminkan jati diri karakter.
2. **Atap Gedung Sekolah Saat Senja:** Memandangi pemandangan kota di bawah langit jingga keemasan.
3. **Kedai Pinggir Kota / Kafe Tenang:** Menikmati makanan hangat berdua tanpa pengawasan pihak lain.
4. **Taman Sakura Tepi Sungai:** Berjalan beriringan di bawah guguran kelopak bunga musim semi.

---

## 💬 Dialog Khas & Reaksi Situasional

* **Saat Sapaan Santai Pagi:**  
  *"{char["tagline"]}"*
* **Saat Pertarungan Sengit:**  
  *"Jangan mundur selangkah pun! Kita selesaikan urusan ini sekarang!"*
* **Saat Momen Intim Tersipu:**  
  *"K-Kenapa menatapku seperti itu... Jangan bikin salah tingkah ya!"*

---

## 🌟 Trivia & Fakta Menarik

1. Memiliki kebiasaan rahasia yang hanya diketahui oleh orang-orang terdekatnya.
2. Ciri visualnya dirancang unik agar langsung dikenali di tengah kerumunan siswa Housen Academy.
3. Merupakan pilar penting dalam percabangan alur petualangan dan konflik faksi sekolah.
"""
    return md

def generate_prompt_md(char):
    content = f"""# Image Generation Prompts — {char["name"]}

## 📸 1. ID Photo Pelajar / Character Avatar (Rasio 3:4)

**Tujuan:** Generate pas foto formal setengah badan (waist-up) untuk avatar Character Sheet, Codex, dan token TRPG.

### 🎨 Master Prompt (Copy & Paste ke GPT / Midjourney):
```text
masterpiece, best quality, ultra-detailed, 1girl/1boy portrait, waist-up, official anime student ID card photo, {char["prompt_summary"]}, clean solid studio background with soft subtle gradient, soft cinematic lighting, 8k resolution, crisp line art, beautiful detailed eyes, vibrant anime visual novel aesthetic.
```

### 🔍 Key Distinctive Visual Markers (Ciri Khas Unik — JANGAN DIUBAH):
- **Wajah & Mata:** {char["appearance_md"].splitlines()[0]}
- **Rambut & Tatanan:** {char["appearance_md"].splitlines()[1]}
- **Pakaian & Seragam:** {char["appearance_md"].splitlines()[3]}
- **Aksesori Wajib:** {char["appearance_md"].splitlines()[4]}

---

## 🎬 2. Cinematic Story Scene / Event CG (Rasio 16:9)

**Tujuan:** Ilustrasi adegan naratif saat momen klimaks atau event berkesan di sekolah / petualangan.

### 🎨 Master Prompt Scene:
```text
masterpiece, cinematic composition, 16:9 aspect ratio, anime visual novel event CG, {char["name"]} during an intense school/delinquent confrontation or intimate moment, dynamic camera angle, dramatic lighting with sunset embers and floating sakura petals/sparks, intricate environment background, emotional expression, high-end anime production studio quality.
```
"""
    return content

def main():
    print(f"Membuat 26 karakter kanon baru di {BASE_DIR}...")
    count = 0
    for char in CHARACTERS:
        full_dir = os.path.join(BASE_DIR, char["dir"])
        os.makedirs(full_dir, exist_ok=True)
        
        # Write Profile MD
        char_path = os.path.join(full_dir, char["filename"])
        with open(char_path, "w", encoding="utf-8") as f:
            f.write(generate_markdown(char))
            
        # Write prompt.md
        prompt_path = os.path.join(full_dir, "prompt.md")
        with open(prompt_path, "w", encoding="utf-8") as f:
            f.write(generate_prompt_md(char))
            
        count += 1
        print(f"  ✓ [{count}/26] Berhasil membuat: {char['name']} di {char['dir']}")

    print(f"\nSelesai! {count} karakter baru dan prompt.md berhasil dibuat.")

if __name__ == "__main__":
    main()
