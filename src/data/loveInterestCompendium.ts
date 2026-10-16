// Auto-generated via scripts/buildLoveInterests.js — DO NOT EDIT DIRECTLY

export interface HeartMilestone {
  range: string;
  minHearts: number;
  maxHearts: number;
  title: string;
  description: string;
}

export interface LoveInterestGifts {
  favorite: string[];
  normal: string[];
  disliked: string[];
}

export interface LoveInterestPersonality {
  traits: string;
  flaws: string;
  dere_pattern: string;
}

export interface LoveInterestDefinition {
  id: string;
  slug: string;
  name: string;
  furigana: string;
  nickname: string[];
  tagline: string;
  grade: number | string;
  class_room: string;
  category_id: string;
  role: string;
  club: string;
  club_role: string;
  archetype: string;
  social_class: string;
  age: number;
  birthday: string;
  zodiac: string;
  mbti: string;
  gender: string;
  avatar_url: string;
  stats: Record<string, number>;
  vitals: Record<string, number>;
  likes: string[];
  dislikes: string[];
  personality: LoveInterestPersonality;
  appearance: string;
  heart_meter: {
    base: number;
    confession_target_dc: number;
    milestones: HeartMilestone[];
  };
  gifts: LoveInterestGifts;
  date_spots: string[];
}

export const CANON_LOVE_INTERESTS: LoveInterestDefinition[] = [
  {
    "id": "li_hoshina_nayu",
    "slug": "hoshina_nayu",
    "name": "Hoshina Nayu (星名 那由)",
    "furigana": "星名 那由",
    "nickname": [
      "Nayu",
      "Nayu-chin",
      "Player 1",
      "NULL"
    ],
    "tagline": "Dunia nyata ini cuma game payah dengan grafik bagus tapi gameplay-nya lambat dan cutscene-nya ga bisa di-skip... Haa, membosankan. Tapi kalau lu mau jadi Player 2 gw, mungkin gw pertimbangin buat ga AFK.",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "gaming",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "weeb",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "12 Desember",
    "zodiac": "Sagittarius",
    "mbti": "INTP",
    "gender": "Female",
    "avatar_url": "/portraits/hoshina_nayu.png",
    "stats": {
      "physique": 9,
      "intelligent": 16,
      "looks": 13,
      "mind": 14,
      "talent": 15,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 14
    },
    "likes": [
      "Konsol game genggam (handheld) & game retro/indie",
      "Permen lolipop rasa kola & minuman berenergi dingin",
      "Mencari celah bug, glitch, & rute speedrun",
      "Tidur siang meringkuk di bawah kolong meja kelas",
      "Bermain mode co-op bareng orang yang dia percaya"
    ],
    "dislikes": [
      "Cutscene dan tutorial lambat yang tidak bisa di-skip",
      "Jam pelajaran olahraga lari keliling lapangan",
      "Baterai perangkat habis di momen bos krusial",
      "Keramaian orang yang sok akrab & berisik"
    ],
    "personality": {
      "traits": "*Nonchalant*, apatis terhadap drama sosial, sangat santai, dan berpikiran tajam. Bagi Nayu, sebagian besar interaksi manusia di sekolah terasa membosankan layaknya *\"tutorial RPG yang dipaksakan dan tidak ada tombol skip-nya\"*. Ia jarang menunjukkan emosi meledak-ledak dan berbicara dengan nada suara datar, tenang, serta lugas tanpa basa-basi. Namun jika dihadapkan pada teka-teki logika rumit, turnamen game, atau tantangan mekanik yang menantang otaknya, matanya akan berbinar dan ia akan menunjukkan fokus monster dengan kecepatan refleks jari (*APM*) yang mengerikan.",
      "flaws": "*Isolasi Diri karena Kebosanan & Ketakutan Ditinggalkan oleh 'Player 2'.*  \nKarena kecerdasan analitisnya yang jauh melampaui rata-rata, Nayu sejak kecil merasa terisolasi; orang lain menganggapnya aneh, pemalas, atau autis karena ia lebih memilih dunia virtual daripada mengobrol basa-basi. Ia terbiasa bermain solo (*single-player mindset*) karena takut bila membuka diri pada seseorang, orang tersebut pada akhirnya akan bosan dan *\"disconnect\"* meninggalkannya sendirian di tengah permainan.",
      "dere_pattern": "*Tipe Dominan: Kuudere Datar yang Menjadi Manja & Bergantung Penuh (Low-Energy Gamer Dere).*  \nJika jatuh cinta, Nayu tidak akan tiba-tiba menjadi manis atau bersikap anggun. Caranya menunjukkan kasih sayang sangat unik dan *gamer-coded*: ia akan membagikan salah satu sisi earphonenya, diam-diam menaruh permen lolipop favoritnya di meja protagonis, atau menarik ujung baju protagonis agar duduk di sampingnya saat ia sedang *grinding* game.  \nKetika sudah kasmaran berat, ia akan menuntut protagonis menjadi *\"Player 2 permanen\"* dalam hidupnya—sering bersandar di lengan protagonis sambil terus bermain game, dan jika protagonis memperhatikannya dengan lembut, pipi datarnya akan memerah padam sementara jemarinya di konsol mendadak salah menekan tombol (*misfire/fluster*)."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Bertubuh sangat mungil dan pendek (*petite*, tinggi sekitar 148 cm) dengan wajah imut bergaris halus yang hampir selalu memasang ekspresi datar mengantuk (*deadpan, sleepy cat-eyes*). Sorot matanya berwarna hijau mint kebiruan (*mint-cyan*) yang lesu saat menatap orang lain, namun seketika menyala tajam penuh kalkulasi saat menatap layar konsol. Sering terlihat mengemut permen lolipop rasa kola di sudut bibirnya.\n* **Rambut:** Potongan rambut pendek model *wolf cut / shaggy bob* berantakan alami sebahu atas, berwarna abu-abu arang kecokelatan (*charcoal dark ash*) dengan aksen *peekaboo highlights* tersembunyi berwarna biru toska pastel di bagian bawah tengkuknya. Di sisi rambutnya tersemat sepasang jepit rambut mini berbentuk tombol *D-pad* konsol retro.\n* **Postur & Gestur:** Sering berjalan santai dengan langkah pendek tanpa suara, bahu agak merosot santai, dan kedua jemarinya sibuk mengetik tombol stik atau layar perangkat di tangannya bahkan sambil berjalan di lorong tanpa pernah menabrak orang lain.\n* **Seragam Sekolah:** Mengenakan seragam pelaut Housen Academy yang dipadukan secara cuek dengan *hoodie zip-up* rajut longgar kebesaran (*oversized hoodie*) berwarna abu-abu terang yang lengannya menutupi separuh jemarinya. Rok lipit seragamnya tampak sedikit longgar dan ia mengenakan kaus kaki longgar (*slouch socks*) putih serta sepatu kets santai.\n* **Aksesori & Barang Bawaan:** Konsol genggam custom (*handheld gaming deck*) berperekat stiker piksel yang selalu menyala di genggamannya, headphone nirkabel berbentuk minimalis melingkar di lehernya, tas selempang kecil penuh gantungan kunci karakter game retro, serta power bank berkapasitas raksasa di sakunya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Nonchalant / Cuek Datar",
          "description": "Hanya menatap sekilas dari balik layar konsolnya, menjawab pertanyaan dengan gumaman pendek atau istilah game, dan pura-pura tidur jika diajak basa-basi."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Player 2 Terdaftar / Co-op",
          "description": "Menyerahkan stik konsol kedua dan mengajak bermain bareng sepulang sekolah; membagikan permen lolipop cadangan dari sakunya."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Glitch Salting",
          "description": "Mulai salah tingkah dan sering menekan tombol yang salah di gamenya saat protagonis duduk terlalu dekat; menolak menatap mata protagonis langsung karena wajahnya memerah di balik kerah hoodie."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Berat & Bergantung",
          "description": "Secara terang-terangan mencari keberadaan protagonis setiap jam istirahat; menyandarkan kepala atau tidur di pangkuan protagonis di ruang klub; cemburu cemberut jika protagonis mengobrol terlalu lama dengan murid lain; memberikan 1 Heart Token gratis di awal sesi."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Membawa protagonis ke atap sekolah atau arcade rahasianya saat malam; menunjukkan layar game bertuliskan pesan rahasia buatan tangannya sendiri sambil menatap lurus dengan wajah merah padam (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Status hubungan resmi berpasangan; protagonis menjadi tujuan hidup nomor satu di dunia nyatanya; keduanya kebal terhadap status *Social Meltdown* saat berada di area yang sama."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Aksesori konsol game langka",
        "kartu langganan toko game digital",
        "permen lolipop rasa kola impor",
        "minuman berenergi edisi terbatas",
        "boneka maskot game piksel lucu."
      ],
      "normal": [
        "Keripik kentang rasa rumput laut",
        "kabel charger nilon tahan lama",
        "stiker piksel lucu",
        "kaus kaki hangat."
      ],
      "disliked": [
        "Buku pelajaran tebal tanpa gambar",
        "sepatu hak tinggi feminin yang merepotkan",
        "pakaian pesta berenda gatal."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Nonchalant / Cuek Datar): — Hanya menatap sekilas dari balik layar konsolnya, menjawab pertanyaan dengan gumaman pendek atau istilah game, dan pura-pura tidur jika diajak basa-basi.",
      "3–4 ♥ (Player 2 Terdaftar / Co-op): — Menyerahkan stik konsol kedua dan mengajak bermain bareng sepulang sekolah; membagikan permen lolipop cadangan dari sakunya.",
      "5–6 ♥ (Sadar Perasaan / Glitch Salting): — Mulai salah tingkah dan sering menekan tombol yang salah di gamenya saat protagonis duduk terlalu dekat; menolak menatap mata protagonis langsung karena wajahnya memerah di balik kerah hoodie.",
      "7–8 ♥ (Kasmaran Berat & Bergantung): — Secara terang-terangan mencari keberadaan protagonis setiap jam istirahat; menyandarkan kepala atau tidur di pangkuan protagonis di ruang klub; cemburu cemberut jika protagonis mengobrol terlalu lama dengan murid lain; memberikan 1 Heart Token gratis di awal sesi.",
      "9 ♥ (Di Ambang Pengakuan): — Membawa protagonis ke atap sekolah atau arcade rahasianya saat malam; menunjukkan layar game bertuliskan pesan rahasia buatan tangannya sendiri sambil menatap lurus dengan wajah merah padam (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_kanzaki_takeru",
    "slug": "kanzaki_takeru",
    "name": "Kanzaki Takeru (神崎 尊)",
    "furigana": "神崎 尊",
    "nickname": [
      "Takeru",
      "Take",
      "Boss (oleh Riki)",
      "Kanzaki-kun"
    ],
    "tagline": "Ngapain lu ngeliatin gw terus? Kalau ga ada urusan, mending lu balik ke tempat dudukmu... Nanti anak-anak lain ngira lu temenan sama berandalan kayak gw, reputasimu bisa rusak. ...Ck, dibilangin malah senyum. Lu beneran ga ada takutnya ya?",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "martial_arts",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "delinquent",
    "social_class": "worker",
    "age": 15,
    "birthday": "28 Oktober",
    "zodiac": "Scorpio",
    "mbti": "ISTP",
    "gender": "Male",
    "avatar_url": "/portraits/kanzaki_takeru.png",
    "stats": {
      "physique": 16,
      "intelligent": 10,
      "looks": 14,
      "mind": 13,
      "talent": 13,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 14,
      "composure_max": 11
    },
    "likes": [
      "Memperbaiki mesin motor tua di bengkel ayahnya & kerja pertukangan",
      "Kucing liar jalanan & menyelamatkan anak binatang terlantar",
      "Roti manis isi kacang merah hangat & susu kopi kaleng",
      "Keheningan di atap sekolah saat jam istirahat",
      "Diberi bekal makanan buatan rumah (tapi bakal pura-pura ga peduli)"
    ],
    "dislikes": [
      "Orang licik yang menindas murid lemah atau berbuat curang",
      "Tatapan orang asing yang langsung menghakiminya sebagai penjahat",
      "Ruangan kelas yang pengap dan terlalu berisik",
      "Dipaksa mengenakan pakaian seragam terlalu rapi dan kaku"
    ],
    "personality": {
      "traits": "*Pendiam, berwibawa, protektif, dan canggung dalam mengekspresikan kebaikan.* Takeru adalah tipe cowok yang tindakannya berbicara seribu kali lebih keras daripada kata-katanya. Di sekolah, ia ditakuti karena auranya yang mengintimidasi dan desas-desus bahwa ia pernah menghajar sekelompok berandalan luar sekolah sendirian. Faktanya, Takeru memiliki kompas moral yang sangat lurus: ia membenci penindasan, tidak pernah memulai perkelahian tanpa alasan membela orang lemah, dan memiliki rasa hormat tinggi pada mereka yang berjuang keras.",
      "flaws": "*Resignasi Sosial & Ketakutan Merusak Kehidupan Orang Lain.*  \nKarena stigma buruk yang melekat padanya sejak SMP, Takeru terbiasa dijauhi dan dianggap sebagai \"sumber masalah\". Ia sengaja menjaga jarak dari teman-teman sekelasnya bukan karena sombong, melainkan karena ia tidak ingin reputasi buruknya menular dan merusak kehidupan murid lain yang \"lurus\". Di balik cangkang dinginnya, ia sebenarnya merindukan kehangatan pertemanan normal.",
      "dere_pattern": "*Tipe Dominan: Tsundere Delinquent Clumsy Gap-Moe (Keras di Luar, Salting Parah di Dalam).*  \n* **Fase Awal (Menolak & Menjauhkan):** Memperingatkan protagonis untuk tidak mendekatinya demi keselamatan sang protagonis sendiri (*\"Lu tuh bego apa gimana sih? Ga liat muka gw kayak gini? Jauhin gw sana!\"*).\n* **Bentuk Perhatian Nyata:** Diam-diam menjadi pengawal bayangan. Jika melihat protagonis diganggu preman jalanan atau kesulitan membawa tumpukan buku tebal, Takeru akan tiba-tiba muncul merebut beban tersebut tanpa banyak bicara, lalu berjalan di depan sambil mendengus canggung.\n* **Reaksi Saat Disentuh Lembut (The Gap-Moe Peak):** Jika protagonis mengobati lukanya, menempelkan plester baru di hidungnya, atau menatapnya sambil tersenyum tulus, **seluruh aura seramnya runtuh total!** Kedua telinganya memerah padam hingga ke tengkuk, matanya melotot panik, ia akan memalingkan wajahnya sekuat tenaga sambil mengacak-acak rambutnya: *\"C-Ck... lu tuh ga ada takut-takutnya ya... Jangan sentuh-sentuh sembarangan, jantung gw mau copot tau...!\"*\n* **Fase Dere (Late Progression):** Menjadi sosok pelindung mutlak yang setia seumur hidup. Ia tidak ragu mengorbankan dirinya demi melindungi sang protagonis, dan saat berduaan, ia akan menjadi pendengar yang sangat lembut yang suka mengelus kepala sang protagonis dengan tangan besarnya yang hangat."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Bertubuh jangkung tegap dan berotot padat alami (tinggi 179 cm) hasil tempaan kerja fisik angkat mesin bengkel dan latihan beladiri sejak kecil. Kulitnya berwarna sawo matang cerah sehat (*warm tanned skin*). Garis wajahnya tegas, maskulin, dengan rahang kuat dan tatapan mata tajam (*sharp tsurime eyes*) berwarna kuning kecokelatan keemasan (*amber-gold eyes*) yang sering membuat orang lain salah paham mengiranya sedang marah.\n* **Ciri Khas Luka:** Plester luka medis kecil sering menempel di pangkal hidung atau pelipisnya—bukan karena tawuran liar, melainkan akibat terkena percikan baut bengkel atau luka gores saat menolong anak kucing yang terjepit di saluran air.\n* **Rambut:** Rambut hitam kecokelatan agak berantakan alami (*messy wolf-mullet with textured undercut*), dengan beberapa helai poni yang jatuh tak beraturan membingkai dahinya.\n* **Seragam Sekolah:** Mengenakan seragam putra Housen Academy dengan gaya kasual berandalan santai: jaket luar seragam dibiarkan terbuka memperlihatkan kaus dalam hitam pas badan (*black fitted undershirt*), lengan kemeja digulung rapi hingga siku memperlihatkan lengan kekar berurat halus, serta sepatu bot kulit hitam kasual yang kokoh.\n* **Aksesori & Barang Bawaan:** Tas sekolah kulit tipis yang digantung di satu pundak (hanya berisi satu buku tulis dan kunci pas darurat), bungkus permen rasa mint di saku celana, dan sachet makanan basah kucing yang selalu ia siapkan diam-diam.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1 ♥",
          "minHearts": 1,
          "maxHearts": 1,
          "title": "Wary Outcast",
          "description": "Galak, mengusir protagonis agar tidak mendekat, menjaga jarak aman. (**Event 1:** Pertemuan pertama saat ia menolak meminjamkan penghapus dengan suara seram.)"
        },
        {
          "range": "2 ♥",
          "minHearts": 2,
          "maxHearts": 2,
          "title": "Reluctant Guardian",
          "description": "Membantu membawa barang berat tanpa disuruh; mendengus kesal saat diberi ucapan terima kasih. (**Event 2:** Piket kelas berdua sepulang sekolah mengangkat meja kayu.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Secret Animal Lover",
          "description": "Protagonist memergokinya sedang jongkok memberi makan anak kucing liar di gang belakang sekolah. (**Event 3:** Berbagi kaleng kopi hangat di gang sempit sambil mengelus kucing bersama.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "Flustered First Touch",
          "description": "Protagonist mengobati luka kecil di pipinya; telinga Takeru merah padam dan lidahnya kelu. (**Event 4:** Berteduh di teras bengkel motor ayahnya saat hujan lebat.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "Unconscious Jealousy",
          "description": "Menatap tajam cowok lain yang mendekati protagonis; mengantar protagonis pulang dari jarak 5 meter di belakang. (**Event 5:** Mengawal protagonis pulang melewati gang gelap rawan preman.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Soft Confession of Past",
          "description": "Menceritakan trauma masa SMP-nya di atap sekolah; pertama kali tersenyum tipis di depan protagonis. (**Event 6:** Duduk berdua di lantai atap sekolah saat jam istirahat siang.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "The Gentle Giant",
          "description": "Membiarkan protagonis memegang tangannya yang kasar; membelikan permen manis kesukaan protagonis. (**Event 7:** Kencan festival kuil lokal berdua dengan pakaian kasual rapi.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Fierce Protector",
          "description": "Terang-terangan merangkul bahu protagonis di depan kelas; tidak peduli lagi rumor orang lain. (**Event 8:** Insiden membela protagonis dari hinaan murid luar sekolah di stasiun.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Vulnerable Heart",
          "description": "Membenamkan wajahnya di bahu protagonis saat lelah; memohon agar protagonis tidak pernah meninggalkannya. (**Event 9:** Percakapan larut malam di bengkel motor yang sepi di bawah temaram lampu bohlam.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Eternal Oath / Fierce Devotion",
          "description": "Menjadi kekasih resmi; bersumpah akan menjadi perisai hidup sang protagonis selamanya. (**Event 10 (Confession):** Momen penembakan di bukit belakang kuil kota saat matahari terbit.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Bekal bento makan siang buatan sendiri (nasi kepal",
        "telur gulung manis",
        "ayam goreng)"
      ],
      "normal": [
        "Kopi kaleng hitam dingin atau susu kotak kacang merah"
      ],
      "disliked": [
        "Barang-barang rapuh mewah tanpa kegunaan praktis"
      ]
    },
    "date_spots": [
      "Bengkel Motor Keluarga (Malam Hari): — Suasana hangat di antara mesin-mesin tua, mendengarkan deru radio lama sambil menikmati teh manis hangat berdua.",
      "Taman Kuil Kuno Belakang Kota: — Tempat sepi yang damai di mana ia bisa bermain dengan kucing-kucing liar bersama protagonis tanpa khawatir tatapan orang lain.",
      "Kedai Ramen Pinggir Jalan: — Menikmati semangkuk ramen porsi jumbo ekstra telur, tertawa santai melihat sang protagonis kepedasan.",
      "Bukit Mercusuar Tepi Laut: — Menikmati hembusan angin laut malam sambil duduk di atas jok motor tua miliknya, membiarkan protagonis memeluk pinggangnya erat-erat."
    ]
  },
  {
    "id": "li_kazuki_ren",
    "slug": "kazuki_ren",
    "name": "Kazuki Ren (風城 蓮)",
    "furigana": "風城 蓮",
    "nickname": [
      "Ren",
      "Ren-chan",
      "Miko-sama"
    ],
    "tagline": "Semua orang memandangku dan hanya melihat seorang gadis miko suci pembawa berkah... Tapi di hadapanmu, bisakah aku melepas jubah ini dan menjadi diriku sendiri—seorang laki-laki biasa?",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Heroine / Target Asmara",
    "club": "occult",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "normies",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "23 September",
    "zodiac": "Libra",
    "mbti": "ISFJ",
    "gender": "Male",
    "avatar_url": "/portraits/kazuki_ren.png",
    "stats": {
      "physique": 11,
      "intelligent": 13,
      "looks": 16,
      "mind": 14,
      "talent": 14,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 14
    },
    "likes": [
      "Teh hijau genmaicha hangat & kue mochi kacang merah",
      "Menyapu pelataran kuil di pagi hari yang sunyi",
      "Pakaian kasual laki-laki (hoodie kebesaran & celana kargo)",
      "Aroma kayu cemara (hinoki) & dupa alami",
      "Diusap kepalanya & diperlakukan sebagai cowok sejati"
    ],
    "dislikes": [
      "Orang yang memaksakan ekspektasi gadis suci padanya",
      "Hembusan angin kencang yang menyibak rok seragamnya",
      "Tatapan pria hidung belang yang memandangnya dengan nafsu",
      "Bau dupa sintetis kimiawi"
    ],
    "personality": {
      "traits": "Santun, lembut, berhati tulus, dan sangat berbakti kepada keluarga. Ren terbiasa mengutamakan kenyamanan dan perasaan orang lain di atas keinginannya sendiri. Di sekolah, ia berusaha tidak menarik perhatian berlebih meski paras cantiknya yang luar biasa kerap membuat murid laki-laki maupun perempuan mencuri pandang ke arahnya.",
      "flaws": "*Disforia Sosial & Krisis Jati Diri Terpendam.*  \nRen sadar sepenuhnya bahwa dirinya adalah seorang laki-laki dan mendambakan kehidupan sebagai remaja pria normal. Namun, rasa bersalah yang mendalam terhadap harapan orang tua dan para tetua kuil membuatnya terpenjara dalam peran \"gadis suci pembawa berkah\". Ia merasa keberadaannya di sekolah adalah kebohongan besar; ia takut jika rahasia gendernya terbongkar, keluarganya akan dipermalukan dan teman-temannya akan memandangnya dengan rasa jijik.",
      "dere_pattern": "*Tipe Dominan: Dandere pemalu dengan naluri protektif maskulin tersembunyi (Gap Moe Menggemaskan).*  \nKarena terbiasa diperlakukan sebagai perempuan rapuh oleh orang lain, Ren sangat mendambakan seseorang yang memandangnya sebagai seorang pria. Begitu Protagonist mengetahui rahasianya dan tetap memperlakukannya dengan rasa hormat sebagai seorang laki-laki, Ren akan mencurahkan kepercayaan hatinya seutuhnya. Di hadapan orang yang ia cintai, Ren akan berusaha keras menunjukkan sisi jantannya—seperti mencoba membawakan barang bawaan protagonis, memayunginya saat hujan, atau memasang badan melindungi sang pujaan hati, meski wajahnya sendiri memerah padam karena malu."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Parasnya luar biasa androgini, halus, dan jelita melebihi kebanyakan gadis di sekolahnya. Memiliki kulit putih porselen yang bersih, sepasang mata bulat bening berwarna biru keunguan (*violet-indigo*) yang menyimpan tatapan melankolis teduh, serta bibir tipis kemerahan alami.\n* **Rambut:** Rambut hitam kebiruan sebatas leher (*soft chin-length bob*) yang sangat halus dan berkilau alami. Poni depannya terbelah lembut memperlihatkan dahi yang anggun, dengan helai rambut di sisi kiri kerap diselipkan ke belakang telinganya.\n* **Postur & Gestur:** Bertubuh ramping dan lentur (tinggi sekitar 160 cm) dengan siluet feminin alami meski berotot tipis tersembunyi. Gerak-geriknya terlatih sangat anggun dan santun akibat bertahun-tahun latihan tarian ritual kuil. Jika merasa cemas atau malu, Ren memiliki kebiasaan menarik ujung dasi pelautnya atau menunduk sambil merapatkan kedua lututnya.\n* **Seragam Sekolah (Seifuku):** Di sekolah, ia mengenakan seragam pelaut (*seifuku*) siswi Housen Academy lengkap dengan rok lipit sebatas lutut, kaus kaki hitam, dan sepatu pantofel. Demi menjaga privasi dan rasa aman pribadinya, Ren diam-diam selalu mengenakan celana ketat pendek (*spats*) di balik roknya.\n* **Di Luar Sekolah (Pakaian Miko):** Di Kuil Kazuki, ia tampil sebagai miko yang memukau mengenakan *kosode* putih bersih, celana rok *hakama* merah menyala (*hibakama*), pita rambut merah, dan membawa sapu jerami panjang atau lonceng ritual (*kagura suzu*).",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Menjaga Jarak / Waspada",
          "description": "Menunduk sopan, berbicara dengan nada suara lembut yang tertahan, dan panik jika ada yang menyentuh seragamnya."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Membuka Rahasia / Lega",
          "description": "Membiarkan protagonis menemaninya berjalan pulang ke kuil; mengizinkan protagonis melihatnya dalam pakaian kasual laki-laki di kamar pribadinya."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Salah Tingkah",
          "description": "Mulai merasa berdebar kencang saat protagonis memanggil namanya tanpa embel-embel cewek; berusaha menunjukkan sisi maskulin dengan memayungi protagonis saat hujan lebat."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Mendalam & Bergantung",
          "description": "Secara sukarela membuatkan jimat keberuntungan buatan tangan khusus (*handmade omamori*) yang diisi doa keselamatan untuk protagonis; cemburu jika protagonis terlalu akrab dengan siswi lain; memberikan 1 Heart Token gratis di awal sesi."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Mengajak bertemu di bawah gerbang Torii utama Kuil Kazuki saat senja jingga; siap mengungkapkan perasaan cintanya sebagai seorang pemuda (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Ikatan cinta suci yang membebaskan jiwa; Ren menemukan keberanian untuk menatap masa depan bersama; keduanya kebal terhadap status *Social Meltdown* saat berada di dekat satu sama lain."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Pakaian kasual laki-laki (kaos *streetwear* keren",
        "hoodie hitam polos",
        "topi bisbol)",
        "teh hijau *genmaicha* kualitas tinggi",
        "set dupa aromaterapi kayu cemara (*hinoki*)",
        "camilan manis tradisional kuil."
      ],
      "normal": [
        "Gantungan kunci kayu polos",
        "buku sketsa lanskap alam",
        "minuman teh botol dingin",
        "permen rasa buah persik."
      ],
      "disliked": [
        "Kosmetik perempuan (lipstik",
        "bedak)",
        "pakaian dalam perempuan",
        "pernak-pernik pita merah muda berlebihan yang memaksakan feminitas padanya."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Menjaga Jarak / Waspada): — Menunduk sopan, berbicara dengan nada suara lembut yang tertahan, dan panik jika ada yang menyentuh seragamnya.",
      "3–4 ♥ (Membuka Rahasia / Lega): — Membiarkan protagonis menemaninya berjalan pulang ke kuil; mengizinkan protagonis melihatnya dalam pakaian kasual laki-laki di kamar pribadinya.",
      "5–6 ♥ (Sadar Perasaan / Salah Tingkah): — Mulai merasa berdebar kencang saat protagonis memanggil namanya tanpa embel-embel cewek; berusaha menunjukkan sisi maskulin dengan memayungi protagonis saat hujan lebat.",
      "7–8 ♥ (Kasmaran Mendalam & Bergantung): — Secara sukarela membuatkan jimat keberuntungan buatan tangan khusus (*handmade omamori*) yang diisi doa keselamatan untuk protagonis; cemburu jika protagonis terlalu akrab dengan siswi lain; memberikan 1 Heart Token gratis di awal sesi.",
      "9 ♥ (Di Ambang Pengakuan): — Mengajak bertemu di bawah gerbang Torii utama Kuil Kazuki saat senja jingga; siap mengungkapkan perasaan cintanya sebagai seorang pemuda (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_kirishima_iori",
    "slug": "kirishima_iori",
    "name": "Kirishima Iori (桐島 伊織)",
    "furigana": "桐島 伊織",
    "nickname": [
      "Iori",
      "Iocchi",
      "Pangeran Gitar",
      "Iori-sama"
    ],
    "tagline": "Halo manis, kebetulan banget ya kita sekelas... Mau dengerin lagu baru yang baru aja gw tulis semalem? Khusus buat lu lho. ...Eh? Kenapa natap gw kayak gitu? Jangan-jangan lu bisa baca kalau senyuman gw ini cuma topeng, hm?",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "band",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "popular_kids",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "14 Februari",
    "zodiac": "Aquarius",
    "mbti": "ENTP",
    "gender": "Male",
    "avatar_url": "/portraits/kirishima_iori.png",
    "stats": {
      "physique": 11,
      "intelligent": 13,
      "looks": 16,
      "mind": 11,
      "talent": 16,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 13
    },
    "likes": [
      "Memetik melodi gitar listrik di studio musik & menulis lagu cinta rahasia",
      "Kopi latte vanila manis, macaron beraneka warna, & permen rasa mint",
      "Menggoda orang yang ia suka sampai orang itu tersipu malu (*teasing*)",
      "Aksesoris perak, cincin minimalis, & pick gitar custom",
      "Seseorang yang menatap matanya secara jujur tanpa silau oleh ketenarannya"
    ],
    "dislikes": [
      "Orang yang hanya menyukai 'wajah tampan'-nya tanpa peduli isi hatinya",
      "Rasa kesepian di tengah kerumunan pesta yang riuh",
      "Senar gitar yang putus di tengah sesi rekaman penting",
      "Aturan sekolah yang terlalu kaku membatasi ekspresi bermusik"
    ],
    "personality": {
      "traits": "*Karismatik, cerdas beretorika, menggoda (*playful flirt*), namun memendam kesepian.* Iori adalah idola di angkatan kelas 10. Ia memiliki kemampuan komunikasi tingkat dewa: mudah mencairkan suasana, gemar melontarkan pujian manis, dan selalu dikelilingi oleh penggemar. Namun, keramahannya hanyalah mekanisme pertahanan (*coping mechanism*). Ia memperlakukan semua orang dengan manis agar tidak ada orang yang menuntut terlalu dalam ke dalam relung jiwanya yang sebenarnya sangat rapuh.",
      "flaws": "*Sindrom \"Dicintai oleh Semua Orang, tapi Tidak Dimiliki oleh Siapa Pun\".*  \nIori muak dipuja hanya karena paras dan bakat musiknya. Semua orang yang mendekatinya hanya menginginkan sosok \"Pangeran Rocker Sempurna\", bukan dirinya yang memiliki rasa cemas, keraguan, dan ketakutan akan kesendirian. Akibatnya, ia menganggap semua cinta di dunia ini palsu dan transaksional.",
      "dere_pattern": "*Tipe Dominan: Flirtatious Teaser who Gets Disarmed and Completely Smitten (Playboy Jatuh Cinta Beneran).*  \n* **Fase Awal (Gombalan Santai):** Suka menggoda protagonis dengan rayuan manis, mendekatkan wajahnya tiba-tiba, atau memainkan petikan gitar romantis sambil berbisik: *\"Lagu ini judulnya 'Detak Jantungmu', mau dengerin?\"*\n* **Titik Balik (The Disarming Moment):** Ketika protagonis tidak mempan oleh rayuannya dan justru menatap matanya dalam-dalam sambil berkata: *\"Senyumanmu barusan keliatan sedih banget... kamu ga harus selalu pura-pura ceria di depan aku lho.\"*  \nKata-kata itu seketika menghancurkan seluruh dinding pertahanan Iori. Untuk pertama kalinya, Iori yang biasanya lihai merayu mendadak membeku, lidahnya kelu, wajahnya memerah padam, dan ia merasakan ketakutan baru: ia telah jatuh cinta pada seseorang yang mampu melihat jiwa telanjangnya.\n* **Fase Pengejaran & Devosi Murni:** Setelah tersadar akan perasaannya, Iori berubah 180 derajat. Ia berhenti tebar pesona ke orang lain, menjadi sangat cemburu dan posesif manis terhadap protagonis, dan secara tulus mendedikasikan seluruh lagu serta hidupnya hanya untuk sang protagonis."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Bertubuh ramping semampai dan luwes (tinggi 176 cm) dengan proporsi tubuh model busana remaja. Kulitnya putih bersih terawat. Wajahnya memiliki ketampanan aristokratik yang memikat (*breathtaking ikemen beauty*): mata berkilau teduh dengan kelopak mata ganda dan bulu mata panjang, tahi lalat manis kecil (*tear mole / beauty mark*) persis di bawah sudut mata kirinya, serta senyuman tipis menggoda (*flirtatious playful smirk*) yang sanggup meluluhkan hati siapa pun.\n* **Mata:** Iris matanya berwarna ungu violet / lavender teduh yang misterius (*captivating violet eyes*). Di balik binar pesonanya, matanya sesekali menyiratkan tatapan melankolis nan hampa jika ia sedang melamun sendirian.\n* **Rambut:** Rambut bergelombang lembut (*soft wavy*) berwarna abu-abu pirang platinum (*ash-silver/blonde*), dipotong sebahu atas dengan layer santai. Poni depannya agak panjang disibak santai ke samping kanan, membingkai wajahnya dengan sangat modis.\n* **Seragam Sekolah:** Mengenakan seragam putra Housen Academy yang dimodifikasi secara trendi: dasi seragam sengaja dikendorkan sedikit pada kerah kemeja putihnya yang terbuka satu kancing, kardigan rajut tipis hitam arang di balik blazer, gelang kulit kepang minimalis di pergelangan tangan kiri, serta cincin perak tipis di jari manisnya.\n* **Aksesori & Barang Bawaan:** Tas gitar elektrik ramping berwarna biru tua (*gig bag*) yang selalu tersandang di punggungnya, kalung rantai perak dengan bandul pick gitar baja di balik kerahnya, beberapa pick gitar warna-warni di saku kemeja, serta parfum beraroma citrus dan vanila lembut.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Flirty Acquaintance",
          "description": "Menggoda dengan panggilan manis, berbisik dekat telinga, suka tebar pesona. (**Event 1:** Pertemuan pertama saat ia meminjamkan pick gitarnya di lorong kelas.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Charming Confidant",
          "description": "Mengajak protagonis ke studio musik sekolah sepulang sekolah; memainkan potongan melodi santai. (**Event 2:** Sesi latihan privat berdua di studio musik kedap suara.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "Mask Cracking (Titik Balik)",
          "description": "Protagonist melihatnya kelelahan dan menepis rayuannya; Iori pertama kali terdiam dan salah tingkah. (**Event 3:** Hujan sore di halte bus, momen saling menatap tanpa kata-kata gombal.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "Obsessive Craving",
          "description": "Mulai panik jika protagonis mengabaikannya; berhenti merayu cewek lain demi menunggu protagonis. (**Event 4:** Insiden Iori menarik tangan protagonis menjauh dari kerumunan fansclub-nya.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Raw Vulnerability",
          "description": "Memainkan lagu melankolis sedih di atap sekolah; mengakui rasa hampa dan kesepian hidupnya. (**Event 5:** Pembicaraan larut malam di tangga darurat sekolah.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "Genuine Devotion",
          "description": "Memakaikan kalung pick gitarnya ke leher protagonis sebagai tanda kepemilikan dan komitmen tulus. (**Event 6:** Kencan berdua di toko piringan hitam vintage di Shibuya.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Love-Struck Prince",
          "description": "Terang-terangan memeluk protagonis dari belakang di hadapan murid lain; senyumnya kini tulus dan berseri. (**Event 7:** Momen membawakan lagu akustik solo khusus di panggung festival sekolah.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Desperate for Permanence",
          "description": "Menggenggam jemari protagonis dengan gemetar; memohon agar protagonis tidak pernah melepaskannya. (**Event 8:** Berjalan berdua di tepi pantai saat senja setelah pertunjukan live usai.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Eternal Muse & Heartbeat",
          "description": "Menjadi kekasih resmi; mendedikasikan seluruh karya musik masa depannya hanya untuk sang protagonis. (**Event 10 (Confession):** Momen penembakan di studio musik dengan mikrofon menyala dan petikan dawai gitar.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Pick gitar seluloid vintage custom dengan ukiran inisial namanya"
      ],
      "normal": [
        "Kotak macaron manis aneka rasa buah"
      ],
      "disliked": [
        "Hadiah cinta massal klise dari toko murah tanpa perasaan"
      ]
    },
    "date_spots": [
      "Studio Musik Sekolah (Pintu Terkunci Lampu Redup): — Duduk berdampingan di sofa studio sambil mendengarkan petikan gitar akustiknya yang lembut di telinga.",
      "Toko Musik & Piringan Hitam Bawah Tanah: — Menjelajahi rak-rak album lawas berdua, berbagi sepasang headphone di listening booth.",
      "Kafe Rooftop Romantis Saat Malam: — Menikmati gemerlap lampu kota sambil menikmati hidangan penutup manis dan membiarkan Iori menggenggam jemari protagonis di bawah meja.",
      "Tepi Dermaga Pelabuhan Saat Senja: — Duduk di tepian beton dermaga dengan angin laut menerbangkan rambut peraknya, berbagi satu kaleng minuman hangat."
    ]
  },
  {
    "id": "li_kumada_riki",
    "slug": "kumada_riki",
    "name": "Kumada Riki (熊田 力)",
    "furigana": "熊田 力",
    "nickname": [
      "Riki",
      "Kuma",
      "Kumacchi",
      "Aibo"
    ],
    "tagline": "Oi, Aibo! Muka lu kusut amat, kenapa mikir keras-keras sih? Hidup tuh simpel: kalo laper ya makan, kalo sedih ya ketawa! Yuk cabut ke kedai ramen depan stasiun, gw yang traktir... eh, tapi lu bayarin setengahnya ya!",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "sports",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "class_clown",
    "social_class": "worker",
    "age": 15,
    "birthday": "9 Mei",
    "zodiac": "Taurus",
    "mbti": "ESFP",
    "gender": "Male",
    "avatar_url": "/portraits/kumada_riki.png",
    "stats": {
      "physique": 16,
      "intelligent": 9,
      "looks": 13,
      "mind": 12,
      "talent": 14,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 14,
      "composure_max": 12
    },
    "likes": [
      "Ramen kuah kental porsi jumbo (terutama ekstra chashu)",
      "Memukul bola di arena batting center",
      "Tidur siang di bawah pohon rindang halaman sekolah",
      "Tertawa ngakak bareng teman sekelas",
      "Makan bersama orang yang dia sayangi"
    ],
    "dislikes": [
      "Ujian matematika & rumus hafalan yang bikin pusing",
      "Melihat temannya diintimidasi atau bersedih sendirian",
      "Perut lapar saat jam pelajaran masih berlangsung",
      "Orang yang suka berbelit-belit & tidak jujur"
    ],
    "personality": {
      "traits": "Ceria, *easygoing*, polos, dan \"sengklek\" dalam arti terbaik. Riki adalah tipe orang yang pikirannya bebas dari rasa dengki, curiga, atau overthinking (*head empty, heart full of pure vibes*). Logika berpikirnya sangat unik dan spontan, kerap melontarkan celetukan absurd yang di luar nalar di tengah ketegangan kelas, namun kepolosannya justru menjadi obat penawar stres paling ampuh bagi teman-temannya. Ia adalah dinamo pencair suasana di mana pun ia berada.",
      "flaws": "*Ketakutan Melihat Kawan Terluka & Rasa Rendah Diri Intelektual.*  \nDi balik tawanya yang membahana, Riki terkadang merasa rendah diri bila menyangkut hal-hal akademis atau tugas rumit; ia tahu dirinya bukan murid pintar dan takut dianggap sebagai beban saat kerja kelompok. Selain itu, Riki memiliki insting protektif yang luar biasa kuat; ia tidak tahan melihat ada orang di sekitarnya yang menangis atau menyendiri menanggung beban pedih, dan akan memaksakan diri melucu hingga lelah hanya agar orang tersebut bisa tersenyum kembali.",
      "dere_pattern": "*Tipe Dominan: Deredere Spontan & Protektif Sejati (Golden Retriever Boy).*  \nAwalnya Riki memperlakukan orang yang ia sukai layaknya sobat karib terbaik (*\"Aibo\"*). Namun begitu benih asmara tumbuh di dadanya, Riki akan mengalami kebingungan polos yang sangat menggemaskan: ia bingung mengapa dadanya berdebar-debar kencang, mengapa wajahnya panas saat sang pujaan hati tersenyum, dan mengapa ia mendadak ingin membelikan makanan terbaik hanya untuk orang tersebut. Bahasa cintanya adalah kebersamaan murni, membagi porsi makanan favoritnya, memuji tanpa filter kepalsuan, dan siap menjadi benteng fisik serta mental bagi orang yang ia cintai."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajahnya memancarkan ketulusan alami tanpa beban pikiran. Memiliki alis agak tebal ekspresif, sepasang mata bulat berwarna cokelat madu gelap yang selalu berbinar ramah, dan senyum lebar yang memperlihatkan deretan gigi putih rapi. Kulitnya sawo matang cerah sehat khas anak yang gemar beraktivitas di bawah sinar matahari.\n* **Rambut:** Rambut pendek kasual alami (*short messy casual hair*) berwarna cokelat gelap kehitaman yang sedikit acak-acakan bertekstur bebas khas anak cowok SMA, tanpa potongan aneh-aneh.\n* **Postur & Gestur:** Bertubuh tinggi tegap dan atletis wajar anak olahraga (tinggi sekitar 178 cm, bahu lebar dan dada bidang alami tanpa otot berlebihan layaknya binaragawan). Gerak-geriknya sangat rileks dan santai—ia sering merangkul bahu kawannya secara spontan atau tertawa sambil menepuk punggung orang lain dengan akrab.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam Housen Academy dengan gaya *easygoing*—kemeja putih dengan kancing kerah atas terbuka sedikit, dasi dilonggarkan santai, dan sering melingkarkan jaket olahraga sekolah warna biru tua di pinggangnya.\n* **Aksesori & Barang Bawaan:** Membawa tas ransel olahraga yang agak menggembung berisi sarung tangan bisbol kulit, kotak bekal bertingkat dua porsi besar, botol minum 2 liter, serta beberapa kupon diskon kedai ramen lokal yang sering terselip di sakunya.",
    "heart_meter": {
      "base": 3,
      "confession_target_dc": 15,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Sobat Santai / \"Oi Aibo!\"",
          "description": "Langsung akrab sejak awal; merangkul bahu, mengajak makan bekal bersama di atap, dan menceritakan hal-hal konyol tanpa jaim."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Teman Karib / Berbagi Rahasia",
          "description": "Mengajak mampir ke bengkel rumahnya; meminjamkan jaket olahraganya saat cuaca dingin; membela protagonis tanpa ragu saat ada konflik kelas."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Bingung Salting",
          "description": "Mulai merasa salah tingkah saat bertatapan mata; menggaruk belakang kepala sambil tersenyum canggung; mendadak malu jika tangannya tak sengaja bersentuhan dengan protagonis."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Mendalam & Protektif",
          "description": "Selalu menunggu protagonis di gerbang sekolah sepulang latihan bisbol; memberikan jatah potongan daging terbaik di mangkuk ramennya; sangat cemburu bila protagonis digoda murid lain; memberikan 1 Heart Token gratis di awal sesi."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Mengajak duduk berdua di tepi lapangan bisbol saat matahari terbenam; dengan wajah merah padam dan suara terbata-bata berusaha mengungkapkan isi hatinya (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Resmi berpacaran; Riki menjadi pelindung setia yang membawa tawa dan kebahagiaan tanpa henti; keduanya kebal terhadap status *Social Meltdown* saat bersama."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Semangkuk ramen porsi monster (*extra topping*)",
        "tiket makan sepuasnya (*all-you-can-eat yakiniku*)",
        "bola atau sarung tangan bisbol berkualitas",
        "minuman energi dingin",
        "camilan daging panggang."
      ],
      "normal": [
        "Roti lapis cokelat",
        "gantungan kunci bola bisbol",
        "kaus kaki olahraga tebal",
        "komik laga petualangan."
      ],
      "disliked": [
        "Buku rumus ensiklopedia tebal yang membingungkan",
        "makanan porsi sangat mini tanpa kalori",
        "barang-barang yang terlalu rapuh dan mudah pecah."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Sobat Santai / \"Oi Aibo!\"): — Langsung akrab sejak awal; merangkul bahu, mengajak makan bekal bersama di atap, dan menceritakan hal-hal konyol tanpa jaim.",
      "3–4 ♥ (Teman Karib / Berbagi Rahasia): — Mengajak mampir ke bengkel rumahnya; meminjamkan jaket olahraganya saat cuaca dingin; membela protagonis tanpa ragu saat ada konflik kelas.",
      "5–6 ♥ (Sadar Perasaan / Bingung Salting): — Mulai merasa salah tingkah saat bertatapan mata; menggaruk belakang kepala sambil tersenyum canggung; mendadak malu jika tangannya tak sengaja bersentuhan dengan protagonis.",
      "7–8 ♥ (Kasmaran Mendalam & Protektif): — Selalu menunggu protagonis di gerbang sekolah sepulang latihan bisbol; memberikan jatah potongan daging terbaik di mangkuk ramennya; sangat cemburu bila protagonis digoda murid lain; memberikan 1 Heart Token gratis di awal sesi.",
      "9 ♥ (Di Ambang Pengakuan): — Mengajak duduk berdua di tepi lapangan bisbol saat matahari terbenam; dengan wajah merah padam dan suara terbata-bata berusaha mengungkapkan isi hatinya (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_kurokawa_shiori",
    "slug": "kurokawa_shiori",
    "name": "Kurokawa Shiori (黒川 詩織)",
    "furigana": "黒川 詩織",
    "nickname": [
      "Shiori",
      "Ori"
    ],
    "tagline": "Aku lebih suka bersembunyi di antara halaman buku yang bisu... karena jiwa-jiwa di dalam fiksi tak akan pernah beranjak pergi meninggalkanmu.",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Heroine / Target Asmara",
    "club": "literatur",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "emo",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "2 November",
    "zodiac": "Scorpio",
    "mbti": "INFJ",
    "gender": "Female",
    "avatar_url": "/portraits/kurokawa_shiori.png",
    "stats": {
      "physique": 9,
      "intelligent": 14,
      "looks": 11,
      "mind": 16,
      "talent": 13,
      "luck": 9
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 14
    },
    "likes": [
      "Karya Dazai Osamu & sastra melankolis",
      "Gothic rock & midwest emo 90-an",
      "Mint chocolate & kopi hitam manis pekat",
      "Pena tinta (fountain pen) & perlengkapan tulis antik",
      "Bunga spider lily (Higanbana)"
    ],
    "dislikes": [
      "Tempat ramai & suara bising",
      "Orang yang menyentuh barang pribadinya tanpa izin",
      "Siang hari yang terik menyilaukan",
      "Diabaikan atau ditinggalkan tiba-tiba"
    ],
    "personality": {
      "traits": "Pendiam, hiper-observan, dan canggung secara sosial. Shiori menghabiskan sebagian besar harinya dengan bersembunyi di balik buku saku bersampul gelap dan ujung lengan baju panjang demi menjaga jarak aman dari dunia luar. Namun di balik dinding pertahanan dingin tersebut, gejolak emosionalnya sangat intens dan bergolak laksana badai.",
      "flaws": "Rentan terhadap perubahan suasana hati drastis dan didera rasa takut luar biasa akan penolakan atau ditinggalkan (*crippling fear of abandonment*). Shiori kerap berayun di antara kebencian pada diri sendiri dalam kesendirian yang menyiksa, atau pengabdian emosional yang teramat protektif hingga menyekap dada. Ketika merasa terasing, ia melarikan diri ke dalam sajak-sajak gelap dan monolog batin yang pedas.",
      "dere_pattern": "*Tipe Dominan: Kuudere rapuh yang bertransformasi menjadi Yandere protektif-devosional.*  \nBegitu seseorang berhasil menembus cangkang pertahanannya dan menunjukkan ketulusan yang murni, bendungan emosinya akan runtuh seutuhnya. Shiori tidak sekadar jatuh cinta—ia mengaitkan seluruh eksistensi jiwanya kepada orang tersebut. Pengabdian cintanya mutlak, sangat loyal, dan berada di ambang obsesif; ia menghafal setiap kebiasaan kecil pasangannya, mengantisipasi kebutuhan mereka sebelum terucap, dan rela begadang tiga malam berturut-turut demi membuatkan rangkuman ujian agar kehidupan sang kekasih menjadi sedikit lebih ringan."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Shiori bertubuh mungil dan berkulit pucat pasi. Sorot matanya gelap laksana obsidian di balik kelopak mata sayu yang dihiasi bayangan lingkaran hitam tipis akibat insomnia berkepanjangan.\n* **Rambut:** Rambut hitam legam pekat sebahu agak berantakan alami, dengan potongan poni depan model *hime-cut* tebal yang kerap menutupi dahi dan sebagian tatapan matanya.\n* **Postur & Gestur:** Cenderung membungkuk sedikit saat berjalan demi menghindari kontak mata. Ia memiliki kebiasaan menarik ujung lengan kardigannya ke bawah hingga menutupi separuh telapak tangan.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam siswi Housen Academy yang dilapisi kardigan hitam kebesaran (*oversized cardigan*) yang agak kusam. Kuku jemarinya kerap dicat hitam yang sedikit mengelupas di tepiannya.\n* **Aksesori & Barang Bawaan:** Membawa tas selempang kulit usang berhiaskan pin band *indie/gothic* langka, kuntum bunga *spider lily* kering di dalam kantong mika bening, serta tumpukan novel saku klasik yang sudut halamannya terlipat rapi.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Orang Asing / Jaga Jarak",
          "description": "Menolak kontak mata, menutupi wajah dengan lengan kardigan, dan membalas sapaan dengan gumaman ketus atau dingin."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Teman Akrab / Nyaman",
          "description": "Mengizinkan duduk di meja yang sama di ruang klub sastra; mau meminjamkan buku catatan bertuliskan tangan rapi dan berbagi rekomendasi lagu *emo/indie*."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Salting",
          "description": "Kerap salah tingkah, semburat merah menjalar di telinganya; membawakan permen pelega tenggorokan dan teh jahe hangat saat menyadari protagonis sedang batuk kecil."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Mendalam",
          "description": "Mengembangkan rasa cemburu diam-diam yang tajam bila protagonis dekat dengan murid lain; menulis bait-bait sajak pemujaan di buku rahasianya; memberikan 1 Heart Token gratis di awal setiap sesi permainan."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Menanti di depan loker sepatu atau di sudut perpustakaan dengan jemari gemetar; membuka opsi memicu *The Confession Event* (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Resmi menjadi pasangan kekasih; Shiori mencurahkan devosi hidupnya tanpa batas; kedua karakter memperoleh kekebalan penuh terhadap status *Social Meltdown* saat berada di ruangan yang sama."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Terjemahan novel sastra klasik Dazai Osamu / Akutagawa",
        "pena tinta (*fountain pen*) antik berkualitas",
        "kaset/pin band *midwest emo* langka",
        "cokelat *mint*",
        "pembatas buku bermotif *spider lily*",
        "termos teh herbal wangi."
      ],
      "normal": [
        "Buku catatan bergaris sampul polos hitam",
        "kopi kaleng hitam tanpa gula",
        "camilan pedas",
        "stiker kucing hitam."
      ],
      "disliked": [
        "Aksesori pesta berwarna neon mencolok",
        "pernak-pernik idola pop yang berisik",
        "parfum manis beraroma menyengat."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Orang Asing / Jaga Jarak): — Menolak kontak mata, menutupi wajah dengan lengan kardigan, dan membalas sapaan dengan gumaman ketus atau dingin.",
      "3–4 ♥ (Teman Akrab / Nyaman): — Mengizinkan duduk di meja yang sama di ruang klub sastra; mau meminjamkan buku catatan bertuliskan tangan rapi dan berbagi rekomendasi lagu *emo/indie*.",
      "5–6 ♥ (Sadar Perasaan / Salting): — Kerap salah tingkah, semburat merah menjalar di telinganya; membawakan permen pelega tenggorokan dan teh jahe hangat saat menyadari protagonis sedang batuk kecil.",
      "7–8 ♥ (Kasmaran Mendalam): — Mengembangkan rasa cemburu diam-diam yang tajam bila protagonis dekat dengan murid lain; menulis bait-bait sajak pemujaan di buku rahasianya; memberikan 1 Heart Token gratis di awal setiap sesi permainan.",
      "9 ♥ (Di Ambang Pengakuan): — Menanti di depan loker sepatu atau di sudut perpustakaan dengan jemari gemetar; membuka opsi memicu *The Confession Event* (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_momoi_yuzu",
    "slug": "momoi_yuzu",
    "name": "Momoi Yuzu (桃井 柚)",
    "furigana": "桃井 柚",
    "nickname": [
      "Yuzu",
      "Yuzuchi",
      "Yuzurin",
      "Momo-chan"
    ],
    "tagline": "Yaho~! Liat deh, Airin mukanya langsung merah padam pas lu nyapa tadi! Cieee~ eh tapi ngomong-ngomong, hari ini lu ganteng juga ya... jangan deket-deket dong, nanti bukan cuma Airin yang deg-degan!",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "penyiaran",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "popular_kids",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "24 Mei",
    "zodiac": "Gemini",
    "mbti": "ENFP",
    "gender": "Female",
    "avatar_url": "/portraits/momoi_yuzu.png",
    "stats": {
      "physique": 10,
      "intelligent": 12,
      "looks": 16,
      "mind": 13,
      "talent": 15,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 13
    },
    "likes": [
      "Membuat video tren/reels seru bareng Airi & siaran musik jam makan siang",
      "Donat stroberi gula halus, boba rasa mangga, & permen kapas pelangi",
      "Aksesoris serba pastel, stiker purikura berkilau, & casing ponsel blink-blink",
      "Menggoda Airi saat wajah sahabatnya memerah malu di depan protagonis",
      "Dielus kepalanya secara lembut dan dipuji tulus saat sedang lelah"
    ],
    "dislikes": [
      "Suasana hening yang canggung dan orang yang mengabaikan sapaannya",
      "Menyimpan perasaan rahasia sendirian (membuat dadanya terasa sesak)",
      "Komentar jahat di media sosial atau gosip palsu yang menyakiti temannya",
      "Melihat Airi atau orang-orang tersayangnya bersedih dan menangis"
    ],
    "personality": {
      "traits": "*Hyper-social, ceria tanpa beban, empatik, dan moodmaker kelas 10-1.* Yuzu adalah matahari kecil di Kelas 10-1. Ke mana pun ia pergi, suasana ruangan seketika menjadi hidup dan penuh gelak tawa. Ia berteman dengan siapa saja—mulai dari murid populer hingga murid pemalu. Bersama Sendou Airi, mereka membentuk duet maut *Gyaru Duo*: Airi adalah sang fotografer tsundere yang modis, sementara Yuzu adalah sang model/presenter ceria yang selalu energik di depan kamera.",
      "flaws": "*Takut Kesepian di Balik Senyum Riang & Sindrom \"Selalu Mengalah Demi Orang Lain\".*  \nKarena selalu dipandang sebagai sosok yang ceria dan tidak pernah punya masalah, orang-orang di sekitarnya kerap lupa bahwa Yuzu juga manusia biasa yang bisa lelah dan terluka. Ia memiliki kebiasaan buruk memendam kesedihannya sendiri demi menjaga suasana hati orang lain tetap senang. Ketika dihadapkan pada perasaannya sendiri, Yuzu kerap ragu dan merasa dirinya tidak berhak egois.",
      "dere_pattern": "*Tipe Dominan: The Playful Teasing Wingwoman who Falls into a Sweet Dilemma (Megadere / Deredere).*  \n* **Fase Awal (The Wingwoman):** Awalnya, Yuzu 100% mendukung Airi untuk jadian dengan protagonis. Ia sering sengaja membuat skenario pertemuan di lorong, membocorkan rahasia Airi sambil tertawa geli (*\"Airin tuh semalem cerita kalau dia seneng banget dipuji sama lu!\"*), dan mendorong mereka berdua agar kencan berdua.\n* **Titik Balik (Falling in Love Unintentionally):** Masalah bermula ketika protagonis memperlakukan Yuzu bukan sekadar sebagai \"mak comblang yang berisik\", melainkan memperhatikan detail kecil tentangnya—misalnya membelikan donat stroberi favoritnya saat ia kelelahan siaran, atau mendengarkan keluh kesahnya yang selama ini ia sembunyikan. Untuk pertama kalinya, Yuzu merasa ada seseorang yang melihat \"Yuzu yang rapuh\" di balik senyuman cerianya.\n* **Fase Krisis & Rasa Bersalah:** Jantungnya mulai berdegup kencang tiap kali protagonis mendekat. Yuzu mulai panik: *\"G-Gawat... gw kan comblangin dia buat Airin... tapi kenapa sekarang dada gw sesak tiap liat mereka berdua?!\"*\n* **Fase Dere Penuh Kasih:** Jika protagonis memilih mendekatinya secara tulus, Yuzu yang semula selalu menggoda akan mendadak kehilangan kata-kata, wajahnya memerah padam hingga matanya berkaca-kaca haru. Ia menjadi sangat manja, senang bersandar di pundak protagonis, dan selalu ingin menggenggam tangan protagonis erat-erat."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah bundar imut yang sangat ekspresif (*bubbly babyface*) dengan pipi merona alami yang selalu memancarkan senyuman riang. Matanya besar, bulat, dan hidup dengan iris berwarna *strawberry ruby / rose-pink* berkilau penuh rasa ingin tahu dan kehangatan.\n* **Rambut:** Rambut bergelombang ringan warna merah muda koral manis (*strawberry coral pink*). Ditata dengan gaya kuncir dua rendah yang longgar (*loose low twin-tails*) menggunakan pita satin koral, dengan beberapa helai poni tipis manis membingkai dahinya secara modis.\n* **Postur & Gestur:** Penuh energi dan tidak bisa diam! Sering melompat-lompat kecil saat bersemangat, merangkul lengan sahabatnya, berpose \"V-sign\" mengedipkan satu mata (*wink*), atau mencondongkan tubuhnya dekat-dekat ke lawan bicara tanpa rasa canggung.\n* **Seragam Sekolah:** Mengenakan seragam pelaut Housen Academy (*serafuku*) dengan kerah pelaut garis putih ganda, dilapisi rompi rajut tanpa lengan (*knit vest sweater*) berwarna vanila lembut. Dasi pita seragamnya diikat sedikit mengembang rapi, dipadukan rok lipit seragam, kaus kaki putih berenda manis di atas pergelangan kaki, dan sepatu kets pastel berwarna persik.\n* **Aksesori & Barang Bawaan:** Mikrofon mini nirkabel dengan spons pelindung berbulu halus warna pink muda di sakunya, ponsel pintar yang dihiasi gantungan charm akrilik berbunyi gemerincing ceria, serta stiker foto purikura dirinya bersama Airi menempel di balik casing bening ponselnya.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Energetic Classmate & Wingwoman",
          "description": "Super ramah, langsung manggil nama akrab, sibuk meledek Airi dan protagonis. (**Event 1:** Sapaan ceria di depan loker sepatu bersama Airi.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Mischievous Teaser",
          "description": "Suka nempel, mengajak selfie bareng untuk diunggah ke medsos, meminta traktir donat. (**Event 2:** Sesi wawancara kuis singkat di ruang kelas saat jam istirahat.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "Secret Sanctuary",
          "description": "Mengajak protagonis masuk ke ruang siaran kedap suara; pertama kali menunjukkan sisi lelahnya. (**Event 3:** Berbagi earphone memantau audio siaran radio sekolah.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "The Accidental Spark",
          "description": "Tiba-tiba salah tingkah saat tangannya disentuh; detak jantungnya berdegup kencang tanpa sengaja. (**Event 4:** Berteduh berdua di bawah payung sempit sepulang sekolah.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Guilt-Ridden Silence",
          "description": "Mulai menjaga jarak dari protagonis karena merasa bersalah pada Airi; senyumnya tampak dipaksakan. (**Event 5:** Momen konfrontasi lembut di tangga darurat saat protagonis menyadari kesedihannya.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "Honest Tears",
          "description": "Menangis di pelukan protagonis dan mengakui bahwa ia tidak bisa lagi membohongi perasaannya sendiri. (**Event 6:** Pembicaraan dari hati ke hati di atap sekolah setelah jam siaran usai.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Unstoppable Megadere",
          "description": "Melepas semua beban; terang-terangan memeluk lengan protagonis dan selalu ingin menempel manja. (**Event 7:** Kencan festival makanan manis berdua tanpa menyembunyikan status mereka.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Blessing from the Best Friend",
          "description": "Airi secara resmi memberikan restu dan memarahi mereka berdua dengan gaya tsundere-nya yang khas. (**Event 8:** Momen makan siang bertiga yang mengharukan dan melegakan di taman sekolah.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "The Ultimate Sunshine",
          "description": "Menjadi kekasih resmi; siaran radio sekolah khusus memutarkan lagu cinta rahasia untuk protagonis. (**Event 10 (Confession):** Momen penembakan di dalam studio siaran sekolah dengan lampu ON AIR menyala.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Donat stroberi glaze premium isi selai buah"
      ],
      "normal": [
        "Minuman boba teh mangga dingin"
      ],
      "disliked": [
        "Makanan pahit (kopi hitam pekat tanpa gula",
        "pare)"
      ]
    },
    "date_spots": [
      "Studio Ruang Siaran Sekolah (Pintu Terkunci): — Tempat berduaan paling privat dengan headphone terpasang, berbagi musik romantis tanpa ada murid lain yang tahu.",
      "Taman Hiburan / Wahana Bianglala ( — Ferris Wheel*):** Tempat penuh keceriaan di mana ia bisa membeli bando telinga hewan lucu dan berpegangan tangan erat di puncak bianglala.",
      "Toko Donat & Dessert Cafe Pastel: — Tempat kencan santai favoritnya untuk saling menyuapi hidangan manis.",
      "Festival Musim Panas (Stand Permainan Pasar Malam): — Bermain tembak-tembakan hadiah dan menangkap ikan mas koki bersama dengan tawa lepas."
    ]
  },
  {
    "id": "li_sendou_airi",
    "slug": "sendou_airi",
    "name": "Sendou Airi (仙道 愛莉)",
    "furigana": "仙道 愛莉",
    "nickname": [
      "Airi",
      "Ai-chan",
      "Airin"
    ],
    "tagline": "H-Hah?! Siapa juga yang sengaja motret muka kusam lu?! Lensa kamera gw tuh lagi fokus ke pemandangan langit di belakang lu tau ga! Jangan kepedean deh, baka!",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "photography",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "popular_kids",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "8 Agustus",
    "zodiac": "Leo",
    "mbti": "ESFP",
    "gender": "Female",
    "avatar_url": "/portraits/sendou_airi.png",
    "stats": {
      "physique": 11,
      "intelligent": 10,
      "looks": 16,
      "mind": 12,
      "talent": 15,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 12
    },
    "likes": [
      "Kamera mirrorless retro, foto candid estetik, & polaroid instax",
      "Minuman frappe karamel manis, crepes stroberi, & cafe hopping",
      "Fashion street Harajuku, nail-art pastel berkilau, & aksesori gemerlap",
      "Pujian tulus tak terduga (meski bakal langsung ia sangkal mati-matian)",
      "Jalan-jalan sore berdua tanpa tujuan jelas sepulang sekolah"
    ],
    "dislikes": [
      "Razia kelengkapan seragam mendadak oleh OSIS / guru kedisiplinan",
      "Cowok mesum sok akrab yang cuma menilai dirinya dari penampilan fisik",
      "Cuaca hujan lembap yang merusak tatanan rambut dan riasan wajahnya",
      "Mengakui perasaannya secara terus terang (gengsi setinggi langit)"
    ],
    "personality": {
      "traits": "*High-energy, fashionable, outspoken, dan gengsian.* Airi adalah tipe siswi yang langsung mencuri perhatian di mana pun ia berada. Ia berbicara dengan intonasi ceria, santai, dan gaya bahasa gaul anak muda (*gyaru slang*). Di luar, ia tampak seperti cewek populer yang suka menyindir, sok cuek, dan pura-pura meremehkan hal-hal klise. Namun di balik sikap judes dan lidah pedasnya, Airi sebenarnya adalah gadis yang sangat tulus, peka terhadap perasaan orang lain, dan tidak tahan melihat temannya kesulitan.",
      "flaws": "*Ketakutan Dianggap Dangkal & Trauma Dimanfaatkan.*  \nKarena penampilannya yang modis dan mencolok sebagai gyaru, Airi sering dihakimi secara sepihak oleh para guru kolot atau murid lain sebagai \"siswi nakal yang cuma peduli dandan dan hura-hura\". Di masa SMP, ia pernah patah hati berat karena seorang cowok mendekatinya hanya demi pamer kepada teman-temannya bahwa ia bisa \"menaklukkan cewek gyaru\". Pengalaman itu membuatnya memasang dinding pertahanan berduri: ia bersikap judes dan galak terlebih dahulu kepada cowok demi menyaring siapa yang tulus dan siapa yang hanya memandang fisiknya.",
      "dere_pattern": "*Tipe Dominan: Classic Gyaru Tsundere (Chou-Tsun to Ultra-Megadere).*  \n* **Fase Tsun (Awal):** Sangat mudah tersipu (*easy fluster*) tapi gengsi mengakuinya. Ia akan menyembunyikan rasa sukanya dengan sindiran pedas, pura-pura kesal, atau memukul pelan bahu sang protagonis dengan buku tugas.\n* **Cara Perhatian Terselubung:** Selalu memberikan bantuan dengan alasan klise: *\"Tadi kasir minimarket salah bikin pesanan frappe jadi dua, daripada gw buang mubazir ya mending lu minum!\"* atau *\"Nilai matematikamu parah banget sih, baka! Sini gw ajarin biar nama kelas 10-1 ga tercemar!\"*\n* **Momen Shutter Kamera:** Sering diam-diam memotret candid sang protagonis saat sedang tertawa atau melamun di jendela kelas. Jika ketahuan, ia akan menjerit panik dengan wajah merah padam sampai ke telinga: *\"B-Baka! Kamera gw lagi nge-test auto-focus tau! Siapa juga yang mau nyimpen foto cowok sepertimu!\"*\n* **Fase Dere (Late Progression):** Begitu dinding gengsinya jebol, Airi berubah menjadi gadis yang luar biasa manja, posesif manis, ingin selalu diajak kencan berdua ke kaus aesthetic atau photobooth, dan menyelipkan cetakan polaroid foto berdua mereka di balik casing ponselnya."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah manis bergaris tegas yang ekspresif dengan kulit sawo matang cerah terawat (*warm sun-kissed fair skin*). Matanya bernuansa *amber-hazel* hangat dengan bulu mata lentik dan garis *eyeliner cat-eye* tipis khas gyaru modern yang modis. Bibirnya selalu dipulas *lip gloss* buah persik berkilau alami yang sering mengerucut cemberut (*pout*) saat tersipu atau kesal.\n* **Rambut:** Rambut bergelombang alami (*soft wavy*) sebahu bawah berwarna pirang madu kecokelatan (*honey-blonde caramel*). Ditata sedikit mengembang santai dengan sebagian rambut samping dijepit jepit mutiara trendi dan kuncir setengah (*half-up ponytail*) berhias scrunchie sutra pastel.\n* **Postur & Gestur:** Berdiri dengan percaya diri dan postur dinamis, sering meletakkan satu tangan di pinggang sambil memainkan ujung rambut pirangnya dengan jari lentiknya saat berbicara. Jika gugup, kedua tangannya akan refleks memeluk kamera di dadanya atau memalingkan wajah sambil menggembungkan pipi.\n* **Seragam Sekolah:** Mengenakan seragam pelaut Housen Academy (*serafuku*) dengan kerah pelaut garis putih ganda, dipadukan secara modis dengan kardigan rajut warna krem hangat (*beige knit cardigan*) yang dibiarkan terbuka kancingnya dan sedikit melorot santai di satu bahu (*off-shoulder slouch*). Dasi pitanya diikat sedikit lebih longgar dan santai, dipadu rok lipit berpotongan pas, kaus kaki longgar putih (*slouch/loose socks*), serta sepatu loafer cokelat mengilap dengan sedikit hak modis.\n* **Aksesori & Barang Bawaan:** Kamera mirrorless berwarna putih mutiara dengan strap kain tenun motif etnik pastel dan gantungan boneka kecil, tas sekolah kulit berhiaskan aneka gantungan kunci maskot lucu (*plushie charms*), serta kuku jemari berhias *nail-art* motif bunga pastel yang rapi.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1 ♥",
          "minHearts": 1,
          "maxHearts": 1,
          "title": "Stranger / Annoying Guy",
          "description": "Judes, suka menyindir, menjaga jarak aman, menolak difoto balik. (**Event 1:** Pertemuan di lorong, insiden dasi seragam miring.)"
        },
        {
          "range": "2 ♥",
          "minHearts": 2,
          "maxHearts": 2,
          "title": "Reluctant Classmate",
          "description": "Mulai mengajak ngobrol santai meski bicaranya masih ceplas-ceplos; pura-pura cuek saat berpapasan. (**Event 2:** Tugas kelompok mendadak di Kelas 10-1.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Casual Friend",
          "description": "Mulai sering meledek; membelikan minuman manis dengan dalih \"salah beli pesanan\". (**Event 3:** Mampir ke minimarket sepulang sekolah saat hujan mendadak.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "Flustered Photography Model",
          "description": "Meminta bantuan protagonis menjadi model pencahayaan kameranya; mulai curhat soal hobi. (**Event 4:** Sesi foto privat di tangga atap sekolah yang sepi.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "Hidden Sweetness",
          "description": "Mulai panik dan wajahnya merah padam jika tangan mereka bersentuhan; menyindir dengan nada manja. (**Event 5:** Insiden tertangkap basah menyimpan foto candid protagonis di kamera.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Crush Denial (Puncak Tsun)",
          "description": "Sangat cemburu jika melihat protagonis mengobrol akrab dengan cewek lain; menolak mengakui perasaannya. (**Event 6:** Melarikan diri ke ruang gelap klub fotografi setelah salah tingkah.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "Tsundere Breakthrough",
          "description": "Mengakui bahwa protagonis adalah orang yang paling membuatnya nyaman; memegang ujung baju saat jalan berdua. (**Event 7:** Kencan festival musim panas / kembang api berdua dengan yukata modis.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Ultra-Affectionate (Dere)",
          "description": "Tidak lagi ragu menggandeng lengan protagonis; membuatkan bento makan siang (meski ngakunya kelebihan bikin). (**Event 8:** Sesi pemotretan photobooth berdua sepulang sekolah.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Almost Confessed",
          "description": "Berbicara dari hati ke hati di balkon sekolah saat senja; tatapan matanya penuh cinta dan kerentanan murni. (**Event 9:** Janji temu di taman tepi sungai saat matahari terbenam.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Official Lovers / Eternal Muse",
          "description": "Menjadi pacar resmi; memajang foto berdua di dompet & casing ponsel; memeluk mesra tanpa gengsi lagi. (**Event 10 (Confession):** Momen penembakan di ruang gelap fotografi / bukit sakura sekolah.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Rol film kamera vintage 35mm / Kertas foto instax motif pastel"
      ],
      "normal": [
        "Permen pereda tenggorokan rasa buah manis"
      ],
      "disliked": [
        "Buku soal latihan ujian rumus matematika tebal"
      ]
    },
    "date_spots": [
      "Kafe Estetik Bertema Kucing / Harajuku: — Tempat favoritnya untuk mencicipi hidangan penutup manis, berfoto selfie berdua, dan mengobrol tanpa henti.",
      "Photobooth Stiker Cetak ( — Purikura*):** Tempat wajib di mana ia bisa menempelkan stiker lucu dan memaksa protagonis berpose imut bersamanya.",
      "Taman Tepi Sungai Saat Golden Hour: — Lokasi sempurna untuk memotret siluet matahari terbenam sambil menikmati es krim bersama di bangku kayu.",
      "Ruang Gelap Klub Fotografi (Malam Hari): — Suasana remang lampu merah yang intim, tenang, dan sangat memicu momen romantis mendebarkan."
    ]
  },
  {
    "id": "li_shinohara_kotone",
    "slug": "shinohara_kotone",
    "name": "Shinohara Kotone (篠原 琴音)",
    "furigana": "篠原 琴音",
    "nickname": [
      "Kotone",
      "Koto-chan"
    ],
    "tagline": "Meskipun suaraku tak terdengar jelas oleh dunia... kuharap kehangatan dan rasa manis dari kue ini bisa menyampaikan apa yang ada di dalam hatiku.",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Heroine / Target Asmara",
    "club": "cooking",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "normies",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "7 Juni",
    "zodiac": "Gemini",
    "mbti": "ISFJ",
    "gender": "Female",
    "avatar_url": "/portraits/shinohara_kotone.png",
    "stats": {
      "physique": 10,
      "intelligent": 13,
      "looks": 14,
      "mind": 15,
      "talent": 14,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 12
    },
    "likes": [
      "Memanggang kue kering & manisan cokelat",
      "Roti tawar kepingan (untuk memberi makan ikan koi)",
      "Aroma vanila & mentega hangat dari oven",
      "Jepit rambut pita warna pastel",
      "Bunga sakura & bunga mekar di taman sekolah"
    ],
    "dislikes": [
      "Pertengkaran, bentakan, & nada suara tinggi",
      "Merasa menjadi beban bagi orang lain",
      "Petir kencang & getaran mengejutkan tiba-tiba",
      "Melihat orang lain menangis atau bersedih"
    ],
    "personality": {
      "traits": "Sangat lembut, penuh empati, dan tidak pernah menyimpan dendam kepada siapa pun. Karena keterbatasan pendengaran bawaan yang dimilikinya, Kotone terbiasa berkomunikasi lewat membaca gerak bibir (*lip-reading*), bahasa isyarat sederhana, atau menulis pesan singkat di buku catatan kecilnya. Ia menyambut setiap orang dengan senyuman hangat tanpa pamrih.",
      "flaws": "Kotone memiliki kecenderungan kronis untuk selalu menyalahkan dirinya sendiri setiap kali terjadi perselisihan atau ketegangan di sekitarnya. Trauma masa kecil membuatnya memiliki ketakutan mendalam bahwa keberadaannya merupakan \"beban yang merepotkan\" bagi orang lain. Akibatnya, ia sangat mudah mengalah, kerap merasa rendah diri, dan sering meminta maaf berlebihan bahkan ketika dirinya sama sekali tidak bersalah.",
      "dere_pattern": "*Tipe Dominan: Deredere murni berpadu Dandere pemalu (Angelic & Devoted).*  \nBahasa cinta utamanya adalah tindakan melayani (*acts of service*) dan hadiah buatan tangan (*handmade pastries*). Jika jatuh cinta, Kotone akan mengingat setiap makanan favorit orang tersebut, membuatkan bento penuh hiasan lucu, dan menyisipkan kue kering hangat di loker sepatu mereka. Ketika dipuji atau bertatapan mata terlalu lama, seluruh wajahnya akan memerah padam hingga ia harus menutupi pipinya dengan buku catatan."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajahnya memancarkan kehangatan alami dengan sepasang mata cokelat hazel bening yang selalu memancarkan tatapan tulus dan ramah. Senyum tipis sopan hampir selalu tersungging di bibirnya.\n* **Rambut:** Rambut sebahu berwarna cokelat bersemburat merah muda pucat yang lembut dan sedikit bergelombang alami di ujungnya, dengan poni depan tipis yang tersisir rapi.\n* **Postur & Gestur:** Bertubuh mungil dan terkesan ringkih. Ia memiliki kebiasaan refleks merapatkan kedua telapak tangan di depan dada sambil membungkuk berulang kali jika merasa cemas atau bersalah.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam siswi Housen Academy yang selalu tersetrika licin dan rapi. Di ruang klub memasak, ia mengenakan celemek kain berwarna krem pastel dengan rambut diikat gaya ekor kuda rendah menggunakan pita manis.\n* **Aksesori & Barang Bawaan:** Mengenakan sepasang alat bantu dengar mini di kedua telinganya yang kerap tertutup helai rambut. Ia selalu membawa tas kecil berisi buku catatan bersampul pastel, koleksi pulpen bertali warna-warni, serta papan tulis mini untuk membantunya berkomunikasi dengan lancar.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Orang Asing / Sopan Menunduk",
          "description": "Membungkuk sopan berulang kali, berkomunikasi singkat lewat tulisan di buku catatan pastel, dan menjaga jarak aman."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Teman Akrab / Nyaman",
          "description": "Mengajak bersama memberi makan ikan koi di kolam sekolah setiap pagi; membagikan kantong kecil kue kering buatannya yang berbentuk kelinci atau beruang."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Salting",
          "description": "Sangat gugup saat jari mereka tak sengaja bersentuhan di meja dapur; menulis pesan-pesan lucu di buku catatan sambil tersenyum malu-malu; pipinya memerah saat menyadari protagonis memperhatikannya."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Mendalam",
          "description": "Menyiapkan bento makan siang buatan tangan khusus setiap hari; memberanikan diri berbicara sepatah dua patah kata lisan; memberikan 1 Heart Token gratis di awal setiap sesi permainan."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Menyelipkan kotak manisan cokelat berbalut pita merah muda di loker sepatu disertai surat ungkapan hati; membuka opsi memicu *The Confession Event* (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Resmi menjadi pasangan kekasih; kehadiran sang kekasih menghapus seluruh trauma rasa tidak aman dalam diri Kotone; keduanya kebal terhadap status *Social Meltdown* saat berada di dekat satu sama lain."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Bahan memanggang kue premium (mentega Prancis",
        "ekstrak vanila murni)",
        "cetakan kue berbentuk hewan lucu",
        "jepit rambut pita warna pastel",
        "pulpen gel warna-warni & stiker gemas",
        "celemek memasak motif bunga."
      ],
      "normal": [
        "Buku catatan bergaris sampul pastel",
        "teh chamomile penenang",
        "buah stroberi segar",
        "gantungan tas lucu."
      ],
      "disliked": [
        "Pengeras suara bising",
        "petasan/kembang api yang meledak keras",
        "buku bacaan bernada kasar/merendahkan."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Orang Asing / Sopan Menunduk): — Membungkuk sopan berulang kali, berkomunikasi singkat lewat tulisan di buku catatan pastel, dan menjaga jarak aman.",
      "3–4 ♥ (Teman Akrab / Nyaman): — Mengajak bersama memberi makan ikan koi di kolam sekolah setiap pagi; membagikan kantong kecil kue kering buatannya yang berbentuk kelinci atau beruang.",
      "5–6 ♥ (Sadar Perasaan / Salting): — Sangat gugup saat jari mereka tak sengaja bersentuhan di meja dapur; menulis pesan-pesan lucu di buku catatan sambil tersenyum malu-malu; pipinya memerah saat menyadari protagonis memperhatikannya.",
      "7–8 ♥ (Kasmaran Mendalam): — Menyiapkan bento makan siang buatan tangan khusus setiap hari; memberanikan diri berbicara sepatah dua patah kata lisan; memberikan 1 Heart Token gratis di awal setiap sesi permainan.",
      "9 ♥ (Di Ambang Pengakuan): — Menyelipkan kotak manisan cokelat berbalut pita merah muda di loker sepatu disertai surat ungkapan hati; membuka opsi memicu *The Confession Event* (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_takamine_ryo",
    "slug": "takamine_ryo",
    "name": "Takamine Ryo (高峰 涼)",
    "furigana": "高峰 涼",
    "nickname": [
      "Ryo",
      "Ryo-kun",
      "Pangeran Lapangan (Oji-sama)",
      "Ryo-chin"
    ],
    "tagline": "Latihan tanding one-on-one abis sekolah? Boleh aja. Tapi jangan nahan diri cuma karena gw cewek ya... Gw ga bakal kasih ampun di bawah ring! ...E-Eh? Kenapa megang tangan gw erat-erat gitu?! K-Kasap ya karena kapalan basket? J-Jangan diliatin terus dong, memalukan tau...!",
    "grade": 10,
    "class_room": "10-1",
    "category_id": "class_1_1",
    "role": "Siswa Housen Academy",
    "club": "sports",
    "club_role": "Anggota Junior (Kelas 10)",
    "archetype": "jock",
    "social_class": "middle_class",
    "age": 15,
    "birthday": "17 Oktober",
    "zodiac": "Libra",
    "mbti": "ISFJ",
    "gender": "Female",
    "avatar_url": "/portraits/takamine_ryo.png",
    "stats": {
      "physique": 16,
      "intelligent": 11,
      "looks": 15,
      "mind": 13,
      "talent": 14,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 13,
      "composure_max": 11
    },
    "likes": [
      "Bermain basket satu lawan satu (one-on-one) & joging subuh",
      "Susu pisang dingin berenergi sehabis latihan & roti bakar telur",
      "Sepatu kets basket high-top & jaket olahraga yang nyaman",
      "Diam-diam menyukai boneka plushie berbulu halus & makanan penutup manis",
      "Diperlakukan secara lembut layaknya seorang 'gadis' sejati"
    ],
    "dislikes": [
      "Rok seragam yang terlalu pendek atau tertiup angin kencang",
      "Orang yang mengejek atau meragukan kekuatannya semata karena ia perempuan",
      "Digilai siswi perempuan lain sampai diberi surat cinta romantis (bikin serba salah)",
      "Gaun pesta berenda ketat dan sepatu hak tinggi yang menyiksa kaki"
    ],
    "personality": {
      "traits": "*Ksatria pelindung, dapat diandalkan, berwibawa, namun memendam kepolosan murni.* Ryo adalah sosok yang sangat dihormati di sekolah. Ia memiliki kepribadian ksatria sejati: selalu sigap membukakan pintu untuk orang lain, membantu mengangkat kotak-kotak berat di kelas, dan melindungi teman-temannya dari perundungan. Sikapnya yang sopan, tenang, dan rendah hati membuatnya sering dijuluki \"Pangeran Sekolah\" (*Prince of Housen*) oleh para siswi junior.",
      "flaws": "*Krisis Identitas Gender & Kerinduan Diperlakukan sebagai Wanita.*  \nKarena tubuhnya yang tinggi dan perawakannya yang atletis, sejak kecil orang-orang terbiasa memperlakukannya sebagai \"anak laki-laki\" atau sekadar rekan tanding. Ayahnya—seorang pelatih dojo—mendidiknya untuk pantang mengeluh dan selalu kuat. Akibatnya, Ryo memendam rasa tidak aman yang mendalam (*deep insecurity*): ia merasa dirinya \"tidak cukup feminin\" dan takut bahwa tidak akan pernah ada orang yang memandangnya sebagai seorang gadis yang layak dicintai dan dilindungi.",
      "dere_pattern": "*Tipe Dominan: Handsome Protector with Extreme Gap-Moe Blushing Maiden.*  \n* **Fase Awal (Cool & Bro-like):** Memperlakukan protagonis sebagai kawan karib. Mengajak tanding *one-on-one* basket, mengoper minuman dingin, dan sering menepuk bahu protagonis dengan akrab.\n* **Pemicu Keruntuhan Cangkang (The Feminine Trigger):** Pertahanannya seketika runtuh total saat protagonis melakukan hal-hal kecil yang memperlakukannya sebagai wanita sejati—misalnya menyentuh tangannya yang kapalan sambil berkata *\"Tanganmu hangat dan lembut\"*, memayunginya saat hujan sambil merangkul bahunya, atau memuji betapa cantiknya garis lehernya.\n* **Reaksi Panik Merona (The Gap-Moe Peak):** Begitu tersipu, aura \"pangeran tampan\"-nya langsung lenyap tak berbekas! Wajahnya akan memerah padam hingga ke ujung telinga, suaranya melengking pelan (*squeak*), dan ia refleks berjongkok menutupi wajahnya dengan kedua tangan: *\"Ughh... jangan ngomong hal memalukan kayak gitu tiba-tiba... jantung gw mau copot tau...!\"*\n* **Fase Dere Penuh Kasih (Late Progression):** Begitu resmi kasmaran, Ryo menunjukkan devosi yang teramat manis. Di depan umum ia tetap menjadi sosok pelindung tegap yang menjaga protagonis dari bahaya, namun saat hanya berduaan, ia akan menyandarkan kepala tingginya di pundak protagonis, meminta dielus rambutnya, dan menggenggam jemari protagonis dengan erat."
    },
    "appearance": "* **Ciri Fisik & Postur:** Bertubuh tinggi semampai dan atletis tegap (tinggi 174 cm) dengan lekuk tubuh ramping proporsional (*toned lean muscles*) dan kaki jenjang yang memukau. Kulitnya cerah alami dengan rona segar sehat khas atlet. Wajahnya memiliki pesona luar biasa: perpaduan antara garis rahang tegas yang tampan nan berkarisma (*ikemen features*) dan kelembutan mata seorang gadis cantik yang memikat.\n* **Mata & Ekspresi:** Sorot matanya tajam, jernih, dan tenang dengan warna abu-abu kebiruan gelap (*slate-blue / steel-grey*). Di lapangan ia memancarkan tatapan fokus predator olahraga yang mengintimidasi, namun di saat santai matanya memancarkan kehangatan tulus, dan seketika berkedip panik serta berkilau malu saat tersipu.\n* **Rambut:** Rambut hitam kebiruan pekat (*midnight raven-black*) dengan potongan pendek bertekstur layer modern sebahu atas (*textured wolf-bob / layered pixie*). Poni depan jatuh alami membingkai dahi dengan beberapa helai diselipkan ke belakang telinga. Saat berolahraga, bagian belakang rambutnya sering diikat kuncir ekor kuda mini (*half-up athletic ponytail*) yang memperlihatkan tengkuk lehernya yang ramping dan menawan.\n* **Seragam Sekolah:** Mengenakan seragam pelaut Housen Academy (*serafuku*) dengan kerah garis putih ganda, dipadukan secara kasual dengan jaket *track jacket* olahraga hitam-putih sekolah yang dibiarkan terbuka. Rok lipit seragamnya berukuran pas selutut (ia selalu mengenakan celana pendek spandeks ketat di dalamnya demi kebebasan bergerak), dipadu kaus kaki hitam sebetis dan sepatu kets basket *high-top* yang trendi dan terawat.\n* **Aksesori & Barang Bawaan:** Tas ransel olahraga hitam besar berisi bola basket pribadi, handuk olahraga lembut beraroma citrus, botol minum stainless berkapasitas besar, serta gantungan kunci boneka beruang mini yang ia sembunyikan di ritsleting bagian dalam tasnya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1 ♥",
          "minHearts": 1,
          "maxHearts": 1,
          "title": "Athletic Comrades",
          "description": "Bersikap ramah sportif, mengajak adu tos, menawarkan minuman isotonik. (**Event 1:** Pertemuan pertama saat mengambil bola basket yang menggelinding ke lorong kelas.)"
        },
        {
          "range": "2 ♥",
          "minHearts": 2,
          "maxHearts": 2,
          "title": "One-on-One Partner",
          "description": "Mengajak protagonis tanding basket santai sepulang sekolah; mulai berbagi cerita tentang rutinitasnya. (**Event 2:** Sesi latihan lemparan bebas di lapangan terbuka saat sore hari.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Unconscious Closeness",
          "description": "Merangkul pundak protagonis tanpa rasa canggung; mulai membawakan bekal olahraga ganda. (**Event 3:** Berbagi bangku kayu di taman sekolah sambil meminum susu pisang.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "The Accidental Touch (Pemicu Gap-Moe)",
          "description": "Tangannya bersentuhan dengan protagonis saat mengambil handuk; wajahnya seketika merona parah dan kehilangan fokus. (**Event 4:** Berteduh berdua di bawah tribun lapangan saat hujan deras mendadak.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "The Secret Feminine Side",
          "description": "Protagonist memergokinya sedang memandangi boneka plushie lucu di etalase toko; Ryo panik setengah mati. (**Event 5:** Insiden belanja berdua di pusat perbelanjaan sepulang sekolah.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Prince's Vulnerability",
          "description": "Mengalami cedera pergelangan kaki ringan dan diobati lembut oleh protagonis di ruang UKS; hatinya luluh total. (**Event 6:** Momen intim di ranjang UKS sekolah yang sunyi.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "First Feminine Attire",
          "description": "Memberanikan diri memakai yukata wanita feminin di festival kembang api khusus demi dilihat oleh protagonis. (**Event 7:** Kencan festival musim panas berdua di bawah gemerlap kembang api.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Protective Sweetheart",
          "description": "Menggandeng tangan protagonis secara terbuka; tidak peduli lagi jika siswi lain melihatnya tersipu manja. (**Event 8:** Pulang sekolah bergandengan tangan di sepanjang tanggul sungai.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "The Prince Yields",
          "description": "Mengaku bahwa ia tidak lagi ingin menjadi \"pangeran\" bagi orang lain, melainkan ingin menjadi satu-satunya gadis di hati protagonis. (**Event 9:** Percakapan emosional di atap gym basket saat matahari terbenam.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Eternal Champion & Maiden",
          "description": "Menjadi kekasih resmi; mendedikasikan trofi turnamennya untuk protagonis dan mencium kening protagonis di lapangan. (**Event 10 (Confession):** Momen penembakan di tengah lapangan basket yang sepi dengan bola di lantai.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Handuk olahraga katun premium dengan bordir inisial namanya"
      ],
      "normal": [
        "Minuman isotonik dingin kemasan kaleng"
      ],
      "disliked": [
        "Rok mini berenda terlalu terbuka yang vulgar"
      ]
    },
    "date_spots": [
      "Lapangan Basket Taman Kota Saat Malam: — Tempat paling alami baginya untuk bermain tembakan santai berdua di bawah lampu taman, disusul duduk berdua di bangku kayu sambil minum soda.",
      "Toko Akuarium / Kebun Binatang: — Ia sangat menyukai hewan lucu dan bisa tersenyum riang seperti anak kecil tanpa beban ekspektasi menjadi \"sosok keren\".",
      "Festival Musim Panas (Malam Kembang Api): — Momen langka di mana ia rela menata rambutnya dan mengenakan pakaian wanita anggun khusus untuk memikat mata sang protagonis.",
      "Tanggul Sungai Saat Senja: — Berjalan berdampingan di bawah hembusan angin sore yang sejuk, membiarkan jemari mereka bertaut hangat."
    ]
  },
  {
    "id": "li_alisa_mikhailovna",
    "slug": "alisa_mikhailovna",
    "name": "Alisa Mikhailovna Voronina (アリサ・ミハイロヴナ・ヴォローニナ)",
    "furigana": "アリサ・ミハイロヴナ・ヴォローニナ",
    "nickname": [
      "Alya",
      "Alya-san",
      "Putri Perak Moskow",
      "Bendahara Dingin"
    ],
    "tagline": "Jangan salah paham. Aku meminjamkan catatan matematikaku ini bukan karena mengkhawatirkanmu, tapi karena jika nilaimu jeblok, rata-rata kelas 11-1 akan turun dan itu mengganggu estetikaku. ...Идиот (Bodoh).",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "osis",
    "role": "Presidium OSIS & Bendahara Komite Pertukaran Pelajar",
    "club": "student_council",
    "club_role": "Bendahara Pertukaran Pelajar & Presidium OSIS",
    "archetype": "popular_kids",
    "social_class": "elite",
    "age": 16,
    "birthday": "7 November",
    "zodiac": "Scorpio",
    "mbti": "INTJ",
    "gender": "Female",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=alisa_mikhailovna",
    "stats": {
      "physique": 11,
      "intelligent": 16,
      "looks": 17,
      "mind": 15,
      "talent": 14,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 16
    },
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
    "personality": {
      "traits": "Tampak sangat dingin, berjarak, dan perfeksionis di luar (*The Unapproachable Ice Beauty*). Ia selalu berbicara dengan nada baku, logis, dan penuh wibawa. Namun di balik topeng ketatnya, Alya sebenarnya sangat emosional, mudah tersipu, dan haus akan apresiasi tulus. Sifat uniknya yang paling ikonik: jika ia merasa gugup, senang, atau cemburu berat pada seseorang, ia akan melontarkan pujian manis atau umpatan manja dalam bahasa Rusia fasih dengan wajah datar, mengira orang di hadapannya tidak akan pernah paham.",
      "flaws": "Terlalu keras pada diri sendiri dan enggan meminta tolong pada orang lain karena takut terlihat lemah. Ia memikul beban ekspektasi keluarga diplomatik besar sendirian di pundaknya.",
      "dere_pattern": "Tipe Kuudere / Tsundere Berbahasa Rusia. Jika hatinya luluh, ia akan diam-diam menyelipkan cokelat artisan di meja pemain, atau duduk sangat dekat sambil bergumam: *'Я тебя люблю' (Aku mencintaimu)* lalu membuang muka pura-pura batuk."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Kulit putih pucat mulus bak salju pertama Siberia, rahang ramping elegan, hidung mancung mungil, dan sepasang mata biru kristal es (*glacial crystal blue*) yang tajam namun memancarkan kilau rapuh. Pipi dan telinganya sangat sensitif dan cepat merona merah muda saat emosinya terusik.\n* **Rambut:** Rambut perak platinum panjang lurus sepinggang yang berkilau sejuk di bawah sinar matahari. Poni depannya dipotong rapi membingkai dahi dengan bando kain putih polos (*white Alice headband*) yang menjadi ciri khasnya.\n* **Postur & Gestur:** Tinggi semampai (167 cm), bahu ramping dengan postur tegak sempurna ala bangsawan. Sering menyilangkan tangan di depan dada sambil sedikit mendongak acuh tak acuh.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam pelaut Housen Academy yang dipadukan dengan rompi rajut (*knit vest*) berwarna biru es pastel tanpa lengan, kaus kaki hitam ketat di bawah lutut, dan sepatu pantofel kulit mengilap.\n* **Aksesori & Barang Bawaan:** Jam tangan wanita tipis berplatina, binder arsip OSIS berwarna putih-perak, dan pulpen perak berukir inisial keluarganya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Teh hitam hangat dengan sesendok selai stroberi (Varenie)"
      ],
      "normal": [
        "Merapikan pembukuan kas sampai tidak ada selisih satu yen pun"
      ],
      "disliked": [
        "Orang malas yang suka menggampangkan tugas kelompok"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_asahina_tenka",
    "slug": "asahina_tenka",
    "name": "Asahina Tenka (朝比奈 天華)",
    "furigana": "朝比奈 天華",
    "nickname": [
      "Tenka",
      "Tenka-senpai",
      "Ka-chan"
    ],
    "tagline": "Kamu sudah berjuang keras hari ini, bukan? Duduklah dulu, minum teh hangat ini... Ruang OSIS ini aman, kamu boleh menceritakan apa pun yang membebani hatimu.",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "osis",
    "role": "Heroine / Target Asmara",
    "club": "student_council",
    "club_role": "Ketua OSIS (Presidium Dewan Siswa)",
    "archetype": "popular_kids",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "14 Oktober",
    "zodiac": "Libra",
    "mbti": "ENFJ",
    "gender": "Female",
    "avatar_url": "/portraits/asahina_tenka.png",
    "stats": {
      "physique": 12,
      "intelligent": 14,
      "looks": 16,
      "mind": 15,
      "talent": 13,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 15
    },
    "likes": [
      "Mendengarkan cerita & curahan hati orang lain",
      "Teh melati hangat & permen madu lemon",
      "Matahari terbenam di jendela ruang OSIS",
      "Melihat murid-murid tersenyum menikmati festival sekolah",
      "Diusap kepalanya atau diperhatikan balik saat sedang lelah"
    ],
    "dislikes": [
      "Ketidakadilan & perundungan di lingkungan sekolah",
      "Orang yang memendam masalah sendirian hingga terluka",
      "Kopi yang terlalu pahit pekat tanpa susu",
      "Ekspektasi kaku bahwa dirinya harus selalu sempurna"
    ],
    "personality": {
      "traits": "Dewasa, karismatik, penuh empati, dan luar biasa dapat diandalkan (*dependable*). Tenka memiliki reputasi laksana \"kakak perempuan seisi sekolah\". Berbeda dengan citra ketua OSIS pada umumnya yang kaku atau menakutkan, Tenka justru membawa atmosfer kehangatan yang membuat murid-murid merasa aman. Di bawah kepemimpinannya, ruang OSIS bukan lagi tempat razia yang dihindari, melainkan suaka tempat murid-murid datang mencari solusi, meminta saran, atau sekadar menenangkan diri.",
      "flaws": "*Sindrom Penyelamat (Savior Complex) & Kepenatan Emosional Terpendam.*  \nKarena selalu diposisikan sebagai pilar pelindung dan tempat bersandar bagi semua orang, Tenka terjebak dalam tuntutan tak kasat mata bahwa dirinya tidak boleh terlihat lemah atau lelah. Ia menanggung beban ekspektasi seluruh sekolah sendirian dan enggan merepotkan siapa pun. Jauh di dalam lubuk hatinya, Tenka merasa kesepian; ia merindukan seseorang yang memandangnya bukan sebagai \"Ketua OSIS yang sempurna\", melainkan sebagai gadis biasa yang juga ingin didengar, dimanja, dan diizinkan menangis tanpa rasa bersalah.",
      "dere_pattern": "*Tipe Dominan: Onee-san Karismatik yang meleleh menjadi Deredere manja (Gap Moe).*  \nDalam keseharian, bahasa cintanya adalah mengayomi dan merawat orang lain (*acts of service* & *words of affirmation*). Namun begitu ada seseorang (Protagonist) yang memperlakukannya dengan tulus—menyadari lingkaran hitam di balik senyum lelahnya, menyeduhkan teh untuknya, atau menyuruhnya beristirahat—pertahanan dewasanya seketika runtuh. Di hadapan orang yang ia cintai secara privat, Tenka akan berubah menjadi sangat manja, tersipu malu jika kepalanya dielus, dan suka menyandarkan keningnya di pundak sang kekasih untuk mengisi ulang energinya."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajahnya memancarkan aura dewasa yang ramah, hangat, dan menenangkan. Sepasang matanya berwarna emas berkilau (*luminous golden eyes*) yang memancarkan ketegasan karismatik berbalut kehangatan teduh saat menatap lawan bicaranya.\n* **Rambut:** Rambut pendek (*short bob hair*) bergaya khas dengan kombinasi dua warna mencolok antara merah dan putih (*two-tone red and white hair*), bertekstur alami sebahu atas dengan poni tersisir rapi menyamping yang membingkai wajahnya secara anggun dan karismatik.\n* **Postur & Gestur:** Bertubuh proporsional dan semampai (tinggi sekitar 165 cm) dengan postur tubuh tegak penuh percaya diri namun tetap santai. Gestur tubuhnya sangat terbuka—ia kerap memiringkan kepala sedikit saat menyimak curhat orang lain dengan senyum teduh yang mencairkan kecanggungan.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam *sailor suit* Housen Academy yang rapi dan terawat, dilapisi rompi rajut (*knit vest*) warna krem gading atau blazer sekolah. Di lengan kiri tersemat ban lengan merah bertuliskan bordir emas *\"生徒会長\"* (Ketua OSIS) yang menjadi simbol kepemimpinannya.\n* **Aksesori & Barang Bawaan:** Membawa papan jalan (*clipboard*) kayu ramping berisi lembar koordinasi kegiatan sekolah, pulpen berpelindung karet ergonomis, termos mini berisi teh melati hangat, serta kantong kecil di sakunya yang selalu siap berisi permen madu lemon untuk dibagikan kepada murid yang kelelahan.",
    "heart_meter": {
      "base": 3,
      "confession_target_dc": 15,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Senpai Panutan / Ramah Formal",
          "description": "Menyapa hangat di lorong, menanyakan kabar pelajaran sekolah dengan senyum khas ketua OSIS, dan memberikan permen madu lemon."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Teman Curhat / Tempat Berlabuh",
          "description": "Mengajak mampir ke ruang OSIS sepulang sekolah untuk minum teh melati bersama; mulai membicarakan hobi personal di luar urusan tugas sekolah."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Salah Tingkah",
          "description": "Mulai merasa gugup jika hanya berdua di ruang OSIS; tatapannya kerap tertangkap basah sedang memandang protagonis; pipinya memerah saat protagonis menyadari kerapuhan atau kelelahannya."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Mendalam & Bergantung",
          "description": "Secara sukarela memperlihatkan sisi rapuhnya; bersandar manja di bahu protagonis; cemburu halus saat melihat protagonis akrab dengan siswi lain; memberikan 1 Heart Token gratis di awal setiap sesi."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Mengajak bertemu berdua di atap sekolah saat matahari terbenam (*sunset rooftop*); menunggu pengakuan cinta dengan debaran dada yang mengalahkan wibawa kepemimpinannya (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Resmi menjadi sepasang kekasih; Tenka menemukan jangkar hidupnya; keduanya kebal terhadap status *Social Meltdown* saat berada di area sekolah yang sama."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Set daun teh melati / chamomile kualitas tinggi",
        "bantal leher empuk berbentuk hewan lucu untuk istirahat di ruang OSIS",
        "mug keramik hangat bergambar manis",
        "tiket pameran seni santai",
        "bekal bento buatan tangan yang disiapkan khusus untuknya."
      ],
      "normal": [
        "Susu kotak rasa stroberi",
        "pulpen kantor bertinta gel halus",
        "jepit rambut minimalis",
        "camilan kue kering."
      ],
      "disliked": [
        "Kopi hitam super pahit tanpa gula",
        "berkas proposal kegiatan yang berantakan tanpa struktur",
        "rokok / barang terlarang sekolah yang melanggar aturan OSIS."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Senpai Panutan / Ramah Formal): — Menyapa hangat di lorong, menanyakan kabar pelajaran sekolah dengan senyum khas ketua OSIS, dan memberikan permen madu lemon.",
      "3–4 ♥ (Teman Curhat / Tempat Berlabuh): — Mengajak mampir ke ruang OSIS sepulang sekolah untuk minum teh melati bersama; mulai membicarakan hobi personal di luar urusan tugas sekolah.",
      "5–6 ♥ (Sadar Perasaan / Salah Tingkah): — Mulai merasa gugup jika hanya berdua di ruang OSIS; tatapannya kerap tertangkap basah sedang memandang protagonis; pipinya memerah saat protagonis menyadari kerapuhan atau kelelahannya.",
      "7–8 ♥ (Kasmaran Mendalam & Bergantung): — Secara sukarela memperlihatkan sisi rapuhnya; bersandar manja di bahu protagonis; cemburu halus saat melihat protagonis akrab dengan siswi lain; memberikan 1 Heart Token gratis di awal setiap sesi.",
      "9 ♥ (Di Ambang Pengakuan): — Mengajak bertemu berdua di atap sekolah saat matahari terbenam (*sunset rooftop*); menunggu pengakuan cinta dengan debaran dada yang mengalahkan wibawa kepemimpinannya (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_choi_dal_dal",
    "slug": "choi_dal_dal",
    "name": "Choi Dal Dal (최달달)",
    "furigana": "최달달",
    "nickname": [
      "Dal Dal",
      "Daldal-chan",
      "Harimau Imut",
      "Ratu Tendangan Taekwondo",
      "Master Bento"
    ],
    "tagline": "Siapa yang bilang atlet taekwondo ga bisa jadi koki manis?! Buka mulutmu, aaaa~ ini bento spesial dengan resep rahasia ibuku! Enak kan? ...Tapi awas ya, kalau kamu sampai terluka di luar sana, orang yang mukul kamu bakal kupelintir lehernya pakai tendangan tumitku!",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Kapten Klub Taekwondo & Koki Siswa Kelas 11-1",
    "club": "martial_arts",
    "club_role": "Kapten Divisi Taekwondo (Kelas 11)",
    "archetype": "jock",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "5 Mei",
    "zodiac": "Taurus",
    "mbti": "ESFP",
    "gender": "Female",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=choi_dal_dal",
    "stats": {
      "physique": 16,
      "intelligent": 12,
      "looks": 16,
      "mind": 13,
      "talent": 17,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 14
    },
    "likes": [
      "Memasak bento daging babi manis pedas (Jeyuk Bokkeum) & sup rumahan resep keluarga",
      "Latihan tendangan tornado berputar 540 derajat di dojo bela diri",
      "Jepit rambut telinga harimau kuning bergaris hitam kesayangannya",
      "Dipuji cantik, feminin, dan harum oleh cowok yang ia sukai",
      "Melihat orang yang ia sayangi makan masakannya sampai habis licin"
    ],
    "dislikes": [
      "Siapa pun yang menghina rasa masakannya atau resep ibunya",
      "Orang jahat yang melukai kawan/orang yang disukai di luar arena (Pemicu Mode Berserk)",
      "Diperlakukan hanya sebagai 'atlet kekar' dan bukan sebagai cewek manis",
      "Kalah dalam duel perebutan hati cowok idaman"
    ],
    "personality": {
      "traits": "Ceria, percaya diri, blak-blakan, penuh kasih sayang (*nurturing*), dan memiliki energi masa muda yang meluap-luap. Dal Dal adalah perpaduan unik antara ksatria petarung tangguh dan calon ibu rumah tangga yang sangat feminin. Ia selalu berusaha membuktikan bahwa seorang petarung wanita tetap bisa menjadi sosok yang anggun, manis, dan dicintai.",
      "flaws": "*Tiga Tombol Kemarahan Berserk:*\n1. Menghina kualitas masakannya.\n2. Menghina masakan keluarganya / resep ibunya.\n3. Siapa pun yang berani melukai orang yang ia sayangi di luar arena!\nSelain itu, ia memiliki rasa cemas tersembunyi bila orang yang ia sukai hanya melihatnya sebagai \"teman sparing otot\" dan bukan sebagai perempuan sejati.",
      "dere_pattern": "Tipe **Deredere Agresif-Manis / Caring Heroine**. Begitu jatuh hati, Dal Dal tidak akan menyembunyikannya: ia akan membawakan bento buatan tangan setiap pagi, menyuapkan makanan secara langsung (*feed reaction*), menggandeng lengan pemain tanpa ragu di koridor, dan melayangkan tendangan kapak mematikan pada siapa saja yang mencoba mengganggu kencan mereka."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah imut menggemaskan (*bubbly, sweet, and expressive*) dengan pipi halus merona merah muda alami, bibir merah ranum berkilau (*cherry lips*) yang sangat memikat, dan sepasang mata bulat besar berwarna oranye-amber madu (*warm honey-amber eyes*) yang selalu berbinar ceria.\n* **Rambut:** Rambut pirang madu cerah (*bright golden honey-blonde*) berpotongan pendek model bob bertekstur sebahu (*textured short bob hair*) dengan poni samping tipis. Ciri visual paling ikonik: sepasang jepit rambut berbentuk telinga harimau kuning bergaris belang hitam (*yellow-black tiger ear hair clips / toramimi*) di kedua sisi kepalanya yang tampak berkedut ekspresif mengikuti perubahan suasana hatinya.\n* **Postur & Gestur:** Bertubuh mungil (*petite*, tinggi 154 cm) namun luar biasa padat atletis dengan siluet ramping berlekuk indah dan kaki petarung yang lentur kuat. Sering melompat kecil saat gembira atau refleks memasang kuda-kuda satu kaki terangkat (*flamingo taekwondo stance*).\n* **Seragam & Gaya Berpakaian:** Modifikasi seragam pelaut Housen Academy dengan kerah kuning gading bergaris putih, pita oranye ceria, rok lipit pendek di atas lutut, dan kaus kaki putih sebetis dengan sepatu kets lincah. Di jam istirahat, ia sering memakai celemek dapur bergambar beruang lucu saat menyajikan bento.\n* **Aksesori & Barang Bawaan:** Kotak bento bertumpuk dibungkus kain furoshiki motif harimau, sabuk hitam taekwondo (*black belt*) di tas olahraganya, dan pelindung tulang kering kaki (*shin guards*).",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Tawaran Bento Ceria",
          "description": "Menilai selera makan pemain, membagikan lauk bento ekstra dengan senyuman manis. (Pertemuan pertama di dojo atau teras kantin.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Koki Pribadi Setia",
          "description": "Membawakan bento lengkap setiap pagi, menuntut piring dikembalikan dalam keadaan bersih licin. (Makan siang berdua di bawah pohon sakura belakang dojo.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Gelisah Ingin Dipuji Cantik",
          "description": "Berdandan ekstra feminin, tersipu parah saat pemain memuji aroma parfum manisnya. (Mengobati memar pemain pasca-bentrokan dengan lembut.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Pelindung Berserk Penuh Kasih",
          "description": "Tidak ragu menendang musuh yang berani menyentuh pemain, merajuk manja jika pemain telat pulang. (Kencan memasak privat di dapur apartemennya saat akhir pekan.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Jiwa & Sumpah Dapur",
          "description": "Sumpah komitmen abadi untuk memasak bagi pemain seumur hidup, pengakuan cinta di bawah langit senja dojo. (Momen pengakuan cinta manis diiringi air mata bahagia.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Bahan bumbu masak artisan impor (minyak wijen murni",
        "saus gochujang premium)"
      ],
      "normal": [
        "Cetakan telur bento berbentuk karakter lucu"
      ],
      "disliked": [
        "Makanan instan cepat saji berkualitas buruk"
      ]
    },
    "date_spots": [
      "Dojo Bela Diri Saat Sepi Sore Hari: — Latihan peregangan berdua yang diakhiri berbagi bekal camilan manis.",
      "Supermarket & Pasar Tradisional Kota: — Berbelanja bahan makanan segar bersama sambil bergandengan tangan mendorong troli.",
      "Kafe Dessert Manis Pinggir Kota: — Mencicipi wafel es krim dan mencatat inspirasi resep baru.",
      "Taman Tepi Sungai Saat Matahari Terbenam: — Berjalan berdua menikmati angin senja sehabis jam latihan."
    ]
  },
  {
    "id": "li_fujiwara_kenji",
    "slug": "fujiwara_kenji",
    "name": "Fujiwara Kenji (藤原 健二)",
    "furigana": "藤原 健二",
    "nickname": [
      "Kenji",
      "Tuan Muda Fujiwara",
      "Kalkulator Berjalan",
      "Bendahara OSIS"
    ],
    "tagline": "Semua hal di dunia ini memiliki nilai valuasi objektif, termasuk keberanian kalian. Proposal dana darurat ini saya setujui... tapi pastikan pengembalian investasinya sebanding dengan reputasi Housen!",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "osis",
    "role": "Bendahara Komite OSIS & Pewaris Konglomerat Perbankan",
    "club": "student_council",
    "club_role": "Bendahara Komite OSIS",
    "archetype": "elite",
    "social_class": "old_money",
    "age": 16,
    "birthday": "29 September",
    "zodiac": "Libra",
    "mbti": "ESTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=fujiwara_kenji",
    "stats": {
      "physique": 10,
      "intelligent": 17,
      "looks": 15,
      "mind": 14,
      "talent": 14,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 16
    },
    "likes": [
      "Grafik neraca keuangan yang seimbang sempurna",
      "Jam tangan mekanik Swiss buatan tangan",
      "Kopi espresso impor",
      "Negosiasi diskon anggaran belanja festival"
    ],
    "dislikes": [
      "Pengeluaran dana yang tidak memiliki tanda terima resmi",
      "Berandal yang merusak fasilitas sekolah yang dibeli yayasan",
      "Makanan cepat saji berminyak"
    ],
    "personality": {
      "traits": "Tampak angkuh dan sombong di awal karena latar belakang keluarga old money-nya, namun sangat adil dan bisa diandalkan dalam urusan logistik.",
      "flaws": "Mudah panik jika menghadapi situasi kekerasan jalanan yang tidak bisa diselesaikan dengan uang.",
      "dere_pattern": "Tipe Rich Tsundere Ally. Membiayai logistik dan peralatan party diam-diam sambil berkata: *'Ini murni kalkulasi bisnis, jangan salah paham!'*"
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah bangsawan aristokratik dengan hidung mancung, sepasang mata cokelat hazel kalkulatif di balik kacamata bulat berbingkai emas tipis (*gold-rimmed round glasses*).\n* **Rambut:** Rambut cokelat tua dipomade rapi klimis ke samping dengan kilau terawat.\n* **Postur & Gestur:** Ramping elegan (175 cm), gestur tangannya terukur saat mengetik kalkulator tipis.\n* **Seragam & Gaya Berpakaian:** Blazer Housen custom dari wol Italia halus, kemeja putih dengan kancing manset emas (*gold cufflinks*), dasi sutra emas-merah bergaris.\n* **Aksesori & Barang Bawaan:** Jam tangan Patek Philippe warisan kakeknya, pulpen emas Parker, dan map kulit keuangan OSIS.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Grafik neraca keuangan yang seimbang sempurna"
      ],
      "normal": [
        "Kopi espresso impor"
      ],
      "disliked": [
        "Pengeluaran dana yang tidak memiliki tanda terima resmi"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_hanase_tamanibu",
    "slug": "hanase_tamanibu",
    "name": "Hanase Tamanibu (花瀬 玉三)",
    "furigana": "花瀬 玉三",
    "nickname": [
      "Tamanibu",
      "Tama-senpai",
      "Ketua Beanie",
      "Penyihir Kabel"
    ],
    "tagline": "Kabel udah dicolok, equalizer udah di-setting flat. Jangan grogi di depan mikrofon... selama ada gw di balik mixer, suara lu bakal terdengar luar biasa di seluruh aula.",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "class_2_2",
    "role": "Ketua Klub Musik & Sound Engineer",
    "club": "band",
    "club_role": "Ketua Klub Musik & Sound Engineer",
    "archetype": "normies",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "14 Oktober",
    "zodiac": "Libra",
    "mbti": "ISFP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=hanase_tamanibu",
    "stats": {
      "physique": 11,
      "intelligent": 14,
      "looks": 14,
      "mind": 15,
      "talent": 17,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 14
    },
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
    "personality": {
      "traits": "Sangat santai, penyabar, berjiwa pengayom bagi adik kelas, dan punya pendengaran audio yang sangat teliti. Ia tidak suka drama kekuasaan dan hanya ingin musik sekolah dinikmati semua kalangan.",
      "flaws": "Sering begadang menata track audio hingga tertidur di atas sofa ruang klub musik saat pelajaran berlangsung.",
      "dere_pattern": "Tipe Chill Big-Brother Dere. Sangat suportif, meminjamkan headphone favoritnya, dan meracik aransemen musik khusus untuk mengiringi momen pemain."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah santai bergaris lembut dengan tatapan mata abu-abu perak mengantuk (*sleepy silver-grey eyes*) dihiasi bulu mata panjang. Selalu terlihat rileks dan tenang di bawah tekanan panggung.\n* **Rambut:** Rambut ungu gelap kehitaman (*dark violet-black*) berpotongan shaggy sebahu yang dibiarkan keluar berantakan dari bawah topi kupluk rajut beanie abu-abu arang (*charcoal grey beanie*).\n* **Postur & Gestur:** Tinggi sedang (174 cm), postur agak bungkuk santai, selalu mengalungkan headphone studio kelas profesional di lehernya.\n* **Seragam & Gaya Berpakaian:** Kemeja seragam sekolah yang kancing atasnya terbuka santai, mengenakan kaos dalaman abu-abu gelap dengan kalung tali kulit berliontin jack audio 6.3mm. Celana seragam sedikit longgar dengan sepatu kets kanvas hitam.\n* **Aksesori & Barang Bawaan:** Headphone monitor Audio-Technica hitam melingkar di leher, binder partitur akord lagu, dan rol selotip kabel hitam di saku blazer.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Suara petikan bassline analog yang dalam dan bulat"
      ],
      "normal": [
        "Kopi kaleng dingin rasa moka di sela mixing audio"
      ],
      "disliked": [
        "Feedback melengking dari speaker monitor yang rusak"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_hatsushiba_miku",
    "slug": "hatsushiba_miku",
    "name": "Hatsushiba Miku (初芝 ミク)",
    "furigana": "初芝 ミク",
    "nickname": [
      "Miku",
      "Miku-chi",
      "Diva Toska",
      "Ratu Synthesizer"
    ],
    "tagline": "Setiap detak jantungmu itu sebenarnya punya ritme BPM sendiri lho! Ayo pasang earphone ini dan dengarkan melodi musim semi yang baru saja kutulis untukmu!",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Komposer Musik Digital & Siswi Kelas 11-1",
    "club": "band",
    "club_role": "Komposer Musik Elektronik & Synthesizer",
    "archetype": "creative",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "31 Agustus",
    "zodiac": "Virgo",
    "mbti": "ENFP",
    "gender": "Female",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=hatsushiba_miku",
    "stats": {
      "physique": 10,
      "intelligent": 14,
      "looks": 16,
      "mind": 13,
      "talent": 18,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 14
    },
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
    "personality": {
      "traits": "Penuh semangat, optimis tanpa batas, dan jenius dalam meramu progresi akord nada digital. Bagi Miku, musik adalah bahasa universal yang mampu menyatukan anak teladan OSIS maupun berandal jalanan yang sedang patah hati.",
      "flaws": "Sering lupa waktu saat tenggelam dalam proses composing hingga melewatkan jam makan atau tidur di atas keyboard MIDI.",
      "dere_pattern": "Tipe Genki / Musical Dere. Menjadikan pemain sebagai 'Muse' inspirasi nada cintanya, menulis lirik balada yang didedikasikan secara khusus saat konser panggung festival."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah lonjong mungil dengan kulit cerah bersinar dan sepasang mata toska pirus (*luminous turquoise-cyan*) yang memancarkan energi listrik riang. Senyumannya selalu ceria dan penuh semangat masa muda.\n* **Rambut:** Rambut toska kebiruan (*vibrant aqua-cyan*) super panjang yang dikuncir dua tinggi (*ultra-long twin-tails*) hingga menjuntai melewati pinggulnya, diikat dengan sepasang penjepit rambut digital persegi berwarna hitam-merah muda khas.\n* **Postur & Gestur:** Ramping dan lincah (158 cm), sering melompat kecil saat berjalan, kedua tangannya terbiasa bergerak mengetuk-ngetuk udara mengikuti ketukan nada musik di kepalanya.\n* **Seragam & Gaya Berpakaian:** Modifikasi seragam pelaut Housen tanpa lengan (*sleeveless white blouse*) dengan kerah pelaut abu-abu bergaris toska, dasi toska ramping, dipadukan dengan sarung lengan (*arm-sleeves*) hitam panjang terpisah berpanel aksen equalizer digital mikro. Rok lipit abu-abu pendek dengan trim toska.\n* **Aksesori & Barang Bawaan:** Headset nirkabel ramping melingkar di kepalanya, tas ransel laptop tahan air penuh stiker gelombang suara, dan kabel jack audio warna-warni di saku blus.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Membuat melodi elektronik baru di software DAW laptopnya"
      ],
      "normal": [
        "Melihat ribuan penonton melambaikan glowstick serempak"
      ],
      "disliked": [
        "Baterai laptop atau synthesizer mati mendadak saat composing"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kagami_rinoka",
    "slug": "kagami_rinoka",
    "name": "Kagami Rinoka (鏡 璃乃香)",
    "furigana": "鏡 璃乃香",
    "nickname": [
      "Rino-chan",
      "Rinoka",
      "Kitsune-sensei",
      "Gadis Kacamata Pojok"
    ],
    "tagline": "Di kelas ini aku cuma bayangan... gadis kacamata tebal yang duduk paling pojok dan ga pernah diajak bicara. Tapi waktu mikrofon ini menyala di kamarku... ratusan ribu orang mendengarkan suaraku. Jangan bocorin rahasia ini ya, kumohon!",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Siswi Kelas 11-1 & VTuber Gaming/Karaoke Rahasia",
    "club": "broadcasting",
    "club_role": "Operator Audio & Sound Editor (Kelas 11)",
    "archetype": "weeb",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "19 Februari",
    "zodiac": "Pisces",
    "mbti": "INFP",
    "gender": "Female",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kagami_rinoka",
    "stats": {
      "physique": 9,
      "intelligent": 14,
      "looks": 14,
      "mind": 15,
      "talent": 17,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 16
    },
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
    "personality": {
      "traits": "Sangat kontras antara persona dunia nyata dan persona virtualnya. Di sekolah, Rinoka adalah gadis pemalu, bicaranya pelan, dan sering gugup jika dipanggil guru. Namun jika ia merasa nyaman berdua dengan pemain atau saat berada di bilik rekaman audio penyiaran, suara aslinya yang merdu, renyah, dan penuh karisma bintang seketika menguar memukau siapa pun yang mendengar.",
      "flaws": "Rasa percaya diri yang sangat rendah terhadap penampilan fisiknya di dunia nyata (*imposter syndrome*). Ia takut penggemar virtualnya akan kecewa jika tahu siapa sosok asli di balik avatar cantiknya.",
      "dere_pattern": "Tipe Dange-dere / Shy Streamer Dere. Jika menyukai pemain, ia akan membuatkan lagu akustik khusus yang dinyanyikan saat streaming malam dengan lirik penuh kode rahasia yang hanya dipahami oleh pemain."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah bulat manis yang biasanya tersembunyi di balik kacamata berbingkai bulat tempurung kura-kura (*tortoiseshell round glasses*). Memiliki sepasang mata bulat besar berwarna oranye-amber hangat (*warm honey amber*) yang sangat ekspresif jika kacamata dilepas. Kulitnya putih bersih dengan pipi gembil alami.\n* **Rambut:** Rambut hitam pekat bergelombang lembut dipotong model *shaggy wolf-cut* sebahu yang agak berantakan alami. Sering menyelipkan sebagian rambutnya ke belakang daun telinga kiri.\n* **Postur & Gestur:** Tinggi mungil (153 cm), sering berjalan agak menunduk sambil merapatkan kedua lengan ke tubuhnya seolah ingin menjadi tak kasat mata.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam pelaut Housen dengan kardigan rajut tebal longgar (*oversized knit cardigan*) berwarna cokelat karamel yang menutupi separuh jemarinya. Rok seragamnya sedikit lebih panjang dari siswi biasa.\n* **Aksesori & Barang Bawaan:** Earphone kabel melingkar di leher, tas sekolah penuh pin gacha indie game, serta gantungan kunci boneka rubah oranye bertelinga api yang menjadi maskot saluran virtualnya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Streaming game horor larut malam sambil teriak kaget"
      ],
      "normal": [
        "Makan mie instan ramen mangkuk pedas jam 2 dini hari"
      ],
      "disliked": [
        "Doxxing atau identitas aslinya di sekolah terbongkar"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kanzawa_ryuuji",
    "slug": "kanzawa_ryuuji",
    "name": "Kanzawa Ryuuji (金沢 竜二)",
    "furigana": "金沢 竜二",
    "nickname": [
      "Ryuuji",
      "Si Rantai Berkarat",
      "Jagot Pelabuhan",
      "Enforcer Touki"
    ],
    "tagline": "Lihat teman kalian ini... terikat rapi di atas balok kontainer. Mau dia turun selamat? Serahin uang kas ekskul 500.000 yen kalian sekarang, atau rantai berkarat ini bakal mencium wajah tampan kalian satu per satu!",
    "grade": 11,
    "class_room": "SMA Kejuruan Touki (Kelas 11-Pengelasan)",
    "category_id": "touki",
    "role": "Komandan Regu Serbu Touki ('Rust Chain')",
    "club": "sports",
    "club_role": "Komandan Regu Serbu & Penculik",
    "archetype": "delinquent",
    "social_class": "lower_class",
    "age": 17,
    "birthday": "13 Maret",
    "zodiac": "Pisces",
    "mbti": "ESTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kanzawa_ryuuji",
    "stats": {
      "physique": 17,
      "intelligent": 11,
      "looks": 12,
      "mind": 14,
      "talent": 15,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 18,
      "composure_max": 14
    },
    "likes": [
      "Mendengar gemerincing rantai motor besi berkarat di tangannya",
      "Meludahkan puntung rokok ke sepatu musuh",
      "Menyandera anak-anak sekolah elit",
      "Menaiki motor chopper bising"
    ],
    "dislikes": [
      "Anak Housen yang bertingkah sok berani di depannya",
      "Rantai senjatanya terlepas saat duel",
      "Polisi patroli pelabuhan"
    ],
    "personality": {
      "traits": "Sadis, provokatif, licik, sangat agresif, dan menikmati ketakutan yang terpancar di mata korbannya.",
      "flaws": "Terlalu sombong dengan jangkauan serangan rantainya, mudah hilang kendali jika senjatanya dilucuti.",
      "dere_pattern": "Mini-Boss Antagonis. Lawan taktis dalam pertempuran penyelamatan sandera di dalam gudang kontainer."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tirus kejam dengan sorot mata hijau lumut dingin berbisa (*venomous greenish-grey eyes*), tindik perak di bibir bawah kiri dan alis kanan, sering menyeringai mencemooh lawan.\n* **Rambut:** Rambut hitam jabrik berantakan bertekstur kasar yang jatuh menusuk kening.\n* **Postur & Gestur:** Bertubuh tinggi ramping berotot liat liat petarung jalanan (181 cm, 77 kg), tangan kanannya selalu melilitkan rantai motor berkarat dengan gembok seberat 2 kg di ujungnya.\n* **Seragam & Gaya Berpakaian:** Gakuran hitam kotor terbuka tanpa kemeja dalam, celana longgar bertumpuk dengan sepatu boots kerja pelabuhan.\n* **Aksesori & Barang Bawaan:** Rantai motor berkarat 2 meter dengan gembok kuningan berat, rokok di balik daun telinga, dan perban tinju kotor di pergelangan tangan.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Mendengar gemerincing rantai motor besi berkarat di tangannya"
      ],
      "normal": [
        "Menyandera anak-anak sekolah elit"
      ],
      "disliked": [
        "Anak Housen yang bertingkah sok berani di depannya"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kasane_teiko",
    "slug": "kasane_teiko",
    "name": "Kasane Teiko (重音 テイコ)",
    "furigana": "重音 テイコ",
    "nickname": [
      "Teto",
      "Teiko-chan",
      "Si Bor Ganda",
      "Ratu Roti Baget"
    ],
    "tagline": "Oi oi oi! Siapa bilang radio sekolah cuma boleh nyetel lagu instrumen tidur? Volume maksimal, gitar distorsi distel, dan roti baget di tangan! Kalau Setsuna mau razia, hadapi dulu vokalku!",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Penyiar Radio Sekolah, Vokalis Rock & Siswi Kelas 11-1",
    "club": "broadcasting",
    "club_role": "Penyiar Utama Radio Istirahat Siang & Vokalis Rock",
    "archetype": "class_clown",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "1 April",
    "zodiac": "Aries",
    "mbti": "ESTP",
    "gender": "Female",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kasane_teiko",
    "stats": {
      "physique": 12,
      "intelligent": 12,
      "looks": 15,
      "mind": 13,
      "talent": 17,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 14
    },
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
    "personality": {
      "traits": "Blak-blakan, penuh energi meledak-ledak, dan sangat setia kawan. Ia tidak segan-segan mendobrak aturan kaku jika aturan itu merugikan teman-temannya. Di balik sikap badungnya, Teiko memiliki kepekaan emosional yang tinggi terhadap ketidakadilan.",
      "flaws": "Suka bertindak impulsif sebelum berpikir panjang, sering memicu pertengkaran mulut dengan Komite Disiplin.",
      "dere_pattern": "Tipe Tsundere Usil / Teasing Bakaderu. Caranya menggoda pemain adalah dengan membagikan separuh roti bagetnya, atau mengumumkan pesan cinta terselubung di mikrofon radio sekolah saat bel pulang berbunyi."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah ceria penuh ekspresi jahil dengan sepasang mata merah delima menyala (*fiery ruby red*) yang selalu berbinar mencari kesempatan usil. Sudut bibirnya memiliki satu taring kecil (*snaggletooth / yaeba*) yang mencuat imut saat tertawa menyeringai.\n* **Rambut:** Rambut merah koral cerah menyala (*vibrant coral red*) yang ditata menjadi sepasang kuncir spiral bor melingkar tebal (*twin drill pigtails*) di kedua sisi kepalanya. Poni depannya berpotongan melengkung lucu di atas alis.\n* **Postur & Gestur:** Bertubuh atletis ramping dan gesit (159 cm), sering meletakkan kedua tangan di pinggang dengan tawa bangga, atau mengacungkan roti baget seperti pedang pendek.\n* **Seragam & Gaya Berpakaian:** Seragam pelaut Housen bernuansa abu-abu gelap dengan trim merah koral, dasi pita kupu-kupu merah tua, dipadukan dengan jaket zip-up kulit sintetis hitam berkerah tegak yang sering disampirkan di pundak.\n* **Aksesori & Barang Bawaan:** Ear cuff perak bermotif sayap di telinga kanan, kantong kertas cokelat berisi roti baget hangat, dan mikrofon genggam portabel berperekat stiker tengkorak chibi.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Roti Prancis baget panjang yang renyah dan gurih"
      ],
      "normal": [
        "Mengerjai murid teladan dengan lelucon absurd (April Mop)"
      ],
      "disliked": [
        "Dimarahi komite disiplin karena menyetel radio terlalu bising"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kiba_touya",
    "slug": "kiba_touya",
    "name": "Kiba Touya (木場 闘夜)",
    "furigana": "木場 闘夜",
    "nickname": [
      "Touya",
      "Taring Malam",
      "Kapten Konvoi Touki",
      "Pembalap Liar Pelabuhan"
    ],
    "tagline": "Mengaumlah mesin dua tak! Di jalanan aspal malam pelabuhan ini, ga ada yang bisa lolos dari kejaran taring konvoi Touki! Siapkan pemukul kalian, kita ratakan barikade mereka!",
    "grade": 11,
    "class_room": "SMA Kejuruan Touki (Kelas 11-Otomotif)",
    "category_id": "touki",
    "role": "Kapten Konvoi Motor Touki ('Fang of the Night')",
    "club": "outdoor",
    "club_role": "Kapten Konvoi Motor Bōsōzoku Touki",
    "archetype": "delinquent",
    "social_class": "lower_class",
    "age": 17,
    "birthday": "24 Agustus",
    "zodiac": "Virgo",
    "mbti": "ESTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kiba_touya",
    "stats": {
      "physique": 16,
      "intelligent": 11,
      "looks": 13,
      "mind": 13,
      "talent": 16,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 14
    },
    "likes": [
      "Mengebut di jalanan pelabuhan tanpa helm di tengah malam",
      "Knalpot motor berisik tanpa saringan peredam",
      "Menghancurkan spion mobil warga",
      "Goggles motor kuning retro"
    ],
    "dislikes": [
      "Sendo Kyosuke (rival balap jalanan)",
      "Pengejaran mobil polisi",
      "Motor yang kehabisan bensin di tengah operasi"
    ],
    "personality": {
      "traits": "Nekat, maniak kecepatan, agresif di atas motor, memimpin puluhan motor bōsōzoku Touki dalam patroli jalanan.",
      "flaws": "Mudah terdistraksi oleh tantangan balap jalanan dan sering mengabaikan perintah taktis Samejima.",
      "dere_pattern": "Speedster Antagonis. Menjadi rintangan pengejaran motor di jalanan menuju gudang kontainer."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah liar berantakan dengan seringai gila adrenalin, bekas luka gores di dagu, sepasang mata hitam liar (*wild dark eyes*) yang menyala saat memacu gas motor.\n* **Rambut:** Rambut pirang kuning jagung (*bleached yellow hair*) yang acak-acakan tertiup angin pelabuhan.\n* **Postur & Gestur:** Bertubuh atletis ramping dan liat (177 cm, 72 kg), selalu mengenakan kacamata goggles motor bertinta kuning di lehernya.\n* **Seragam & Gaya Berpakaian:** Jaket kulit motor hitam robek dengan sablon tengkorak bertanduk iblis di dada kiri, celana jins robek di lutut, sepatu boots motor usang.\n* **Aksesori & Barang Bawaan:** Kacamata goggles motor kuning, pipa besi pendek berpelindung karet, dan kunci kontak motor Yamaha RX-King modifikasi.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Mengebut di jalanan pelabuhan tanpa helm di tengah malam"
      ],
      "normal": [
        "Menghancurkan spion mobil warga"
      ],
      "disliked": [
        "Sendo Kyosuke (rival balap jalanan)"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kisaragi_setsuna",
    "slug": "kisaragi_setsuna",
    "name": "Kisaragi Setsuna (如月 刹那)",
    "furigana": "如月 刹那",
    "nickname": [
      "Setsuna-senpai",
      "Kisaragi-shoki",
      "Putri Es Gerbang Sekolah",
      "Secchan (oleh Tenka)"
    ],
    "tagline": "Berhenti di tempat. Tiga puluh tujuh detik sebelum bel gerbang ditutup, dan pita kerah seragammu miring dua sentimeter ke kiri. Karena hari ini adalah upacara penerimaan siswa baru, aku tidak akan mencatat namamu di buku pelanggaran... Jangan berdiri bengong, kemarikan kerahmu, biar kurapikan.",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "osis",
    "role": "Sekretaris OSIS & Ketua Komite Disiplin",
    "club": "student_council",
    "club_role": "Sekretaris OSIS & Ketua Komite Disiplin",
    "archetype": "nerd",
    "social_class": "elite",
    "age": 16,
    "birthday": "21 Januari",
    "zodiac": "Aquarius",
    "mbti": "ISTJ",
    "gender": "Female",
    "avatar_url": "/portraits/kisaragi_setsuna.png",
    "stats": {
      "physique": 13,
      "intelligent": 16,
      "looks": 15,
      "mind": 16,
      "talent": 12,
      "luck": 10
    },
    "vitals": {
      "physical_hp_max": 14,
      "composure_max": 16
    },
    "likes": [
      "Jadwal kegiatan sekolah yang berjalan tepat waktu hingga satuan detik",
      "Teh hijau matcha dingin tanpa gula & wagashi kacang merah",
      "Aroma kertas buku peraturan baru & pena fountain tinta biru tua",
      "Kucing liar yang suka berjemur di dekat gerbang sekolah (diam-diam memberi makan)",
      "Seseorang yang menepati janji kecil tanpa perlu diingatkan dua kali"
    ],
    "dislikes": [
      "Siswa yang datang terlambat, dasi miring, atau kancing seragam terbuka",
      "Proposal anggaran ekskul yang berantakan dan penuh coretan",
      "Keributan tidak perlu di koridor saat jam pelajaran berlangsung",
      "Digoda soal tinggi badannya atau wajahnya yang memerah saat dipuji tulus"
    ],
    "personality": {
      "traits": "Setsuna adalah fondasi ketertiban Housen Academy. Jika Ketua OSIS Asahina Tenka adalah \"matahari hangat\" yang merangkul semua murid, maka Setsuna adalah \"perisai es\" yang memastikan roda organisasi berjalan tanpa celah. Ia berbicara dengan kalimat lugas, baku, dan sangat efisien. Di balik ketegasannya saat merazia seragam di gerbang sekolah, Setsuna sebenarnya memiliki rasa tanggung jawab yang luar biasa tinggi untuk melindungi ketenangan sekolah dan menjaga agar Tenka tidak tumbang karena kelelahan.",
      "flaws": "Tumbuh di keluarga hakim yang menuntut kesempurnaan hukum membuat Setsuna kesulitan mengekspresikan emosi secara spontan. Ia sering merasa dirinya \"terlalu kaku dan membosankan\" dibandingkan gadis-gadis SMA lain yang luwes bercanda. Saat menghadapi situasi romantis atau kejutan di luar jadwal yang telah ia susun, otak analitisnya langsung mengalami *short-circuit*—membuatnya bicara terbata-bata dengan bahasa super formal sambil memalingkan wajah.",
      "dere_pattern": "Bertipe **Kuudere / Tsundere Halus**. Bahasa cintanya adalah *Acts of Service* (tindakan pelayanan diam-diam) dan *Quality Time*. Ketika menyukai seseorang, ia akan menggunakan alasan \"pengawasan disiplin khusus\" agar bisa terus berada di dekat orang tersebut—mulai dari merapikan dasi mereka setiap pagi di gerbang, meminjamkan catatan ujian yang sudah diberi stabilo rapi, hingga menunggu di ruang OSIS dengan dua cangkir teh hangat."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah oval simetris bak boneka porselen dengan kulit putih bersih. Sepasang mata tajam berwarna biru safir dingin (*icy sapphire*) di balik kacamata berbingkai perak tipis (*half-rim silver glasses*). Ekspresi wajahnya hampir selalu datar dan tenang, namun daun telinganya sangat cepat memerah bila gugup.\n* **Rambut:** Rambut hitam legam lurus sepinggang dengan kilau kebiruan (*raven-blue*), ditata rapi dengan potongan poni rata (*hime bangs*) dan dikuncir ekor kuda tinggi (*high ponytail*) saat bertugas di lapangan menggunakan pita biru tua.\n* **Postur & Gestur:** Tinggi semampai (165 cm) dengan punggung yang selalu tegak sempurna. Sering memegang map *clipboard* aluminium di tangan kiri dan mengetukkan ujung jari telunjuknya ke lengan saat menghitung waktu.\n* **Seragam & Gaya Berpakaian:** Seragam *serafuku* Housen Academy yang disetrika tanpa satu pun lipatan kusut, dipadukan dengan ban lengan merah-emas bertuliskan **風紀委員 (Komite Disiplin)** di lengan kiri serta stoking hitam panjang.\n* **Aksesori & Barang Bawaan:** Jam saku perak peninggalan kakeknya, buku catatan hitam bersampul kulit untuk mencatat pelanggaran maupun jadwal harian OSIS, serta permen mint dingin di saku roknya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Pengawas & Siswa Baru",
          "description": "Tatapan tegas dan profesional; selalu menegur detail kecil pada seragam atau ketepatan waktu."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan yang Diakui",
          "description": "Mulai menghargai kinerja protagonis di kegiatan kelas/komite dan sesekali memberikan permen mint saat berpapasan."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Gugup di Balik Kacamata",
          "description": "Telinganya memerah saat bertatapan terlalu lama; sering salah mengambil berkas ketika protagonis berdiri di dekat mejanya."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Perhatian Eksklusif",
          "description": "Selalu menyisakan waktu sepulang patroli sore untuk berjalan pulang bersama protagonis hingga stasiun kereta."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Retaknya Perisai Es",
          "description": "Mengakui dengan suara bergetar bahwa ketenangannya selalu hilang setiap kali memikirkan protagonis."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Menjadi pasangan yang sangat setia, manja saat hanya berdua di ruang OSIS, dan siap membela protagonis di hadapan seluruh dewan sekolah."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Teh Matcha Uji Premium",
        "Pena Fountain Klasik",
        "Pembatas Buku Logam Berukir",
        "Wagashi Kacang Merah."
      ],
      "normal": [
        "Buku Catatan Kulit",
        "Permen Mint",
        "Saputangan Bordir",
        "Kopi Kaleng Rendah Gula."
      ],
      "disliked": [
        "Barang lelucon yang melanggar tata tertib",
        "Makanan cepat saji yang berminyak di meja kerja OSIS."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Pengawas & Siswa Baru): — Tatapan tegas dan profesional; selalu menegur detail kecil pada seragam atau ketepatan waktu.",
      "3–4 ♥ (Rekan yang Diakui): — Mulai menghargai kinerja protagonis di kegiatan kelas/komite dan sesekali memberikan permen mint saat berpapasan.",
      "5–6 ♥ (Gugup di Balik Kacamata): — Telinganya memerah saat bertatapan terlalu lama; sering salah mengambil berkas ketika protagonis berdiri di dekat mejanya.",
      "7–8 ♥ (Perhatian Eksklusif): — Selalu menyisakan waktu sepulang patroli sore untuk berjalan pulang bersama protagonis hingga stasiun kereta.",
      "9 ♥ (Retaknya Perisai Es): — Mengakui dengan suara bergetar bahwa ketenangannya selalu hilang setiap kali memikirkan protagonis."
    ]
  },
  {
    "id": "li_komiya_junta",
    "slug": "komiya_junta",
    "name": "Komiya Junta (小宮 隼太)",
    "furigana": "小宮 隼太",
    "nickname": [
      "Junta",
      "Si Dadu Emas",
      "Makelar Taruhan",
      "Rubah Kokuhou"
    ],
    "tagline": "Peluang kita menang lawan Touki cuma 28% menurut matematika kertas. Tapi dengan sedikit tipuan dadu dan jebakan debu kapur... persentasenya bisa gw putar jadi 90%! Pasang taruhan kalian sekarang!",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "kokuhou",
    "role": "Makelar Taruhan & Intel Jalanan Kokuhou",
    "club": "gaming",
    "club_role": "Intelijen Jalanan & Makelar Taruhan",
    "archetype": "class_clown",
    "social_class": "worker",
    "age": 16,
    "birthday": "7 Juli",
    "zodiac": "Cancer",
    "mbti": "ESTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=komiya_junta",
    "stats": {
      "physique": 12,
      "intelligent": 15,
      "looks": 14,
      "mind": 13,
      "talent": 15,
      "luck": 17
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 14
    },
    "likes": [
      "Menebak probabilitas menang-kalah dalam taruhan",
      "Permen karet mint yang ditiup jadi balon besar",
      "Mendengar rumor rahasia murid sekolah lain",
      "Dadu enam sisi dari tulang sintetis"
    ],
    "dislikes": [
      "Orang yang kabur membawa utang taruhan",
      "Dituduh mencurangi kocokan dadu",
      "Rencana kaku yang tidak fleksibel"
    ],
    "personality": {
      "traits": "Cerdik, suka berjudi dengan nasib, humoris, pandai mengalihkan perhatian penjaga, dan punya intuisi keberuntungan yang mistis.",
      "flaws": "Terlalu suka mengambil risiko berbahaya demi sensasi adrenalin.",
      "dere_pattern": "Tipe Trickster Ally. Memberikan trik pengalihan perhatian dan bonus Luck Point pada lemparan dadu kritis party."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tirus licik yang tampan dengan sepasang mata keemasan (*cunning golden-fox eyes*) yang selalu berkedip nakal. Sering mengunyah permen karet tiup di pipinya.\n* **Rambut:** Rambut pirang kusam acak-acakan (*bleached dirty-blonde messy hair*) dipotong pendek gaya jalanan.\n* **Postur & Gestur:** Bertubuh ramping gesit (173 cm), tangannya sangat lihai memainkan koin atau dadu di sela jari-jemarinya (*sleight of hand*).\n* **Seragam & Gaya Berpakaian:** Kemeja putih seragam yang dibuka dua kancing atasnya memperlihatkan kaos bergambar kartu remi, kalung tali hitam berliontin dadu mini, celana seragam modis.\n* **Aksesori & Barang Bawaan:** Tiga set dadu keberuntungan di saku, buku catatan taruhan kecil bersampul plastik, dan bungkus permen karet mint.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Menebak probabilitas menang-kalah dalam taruhan"
      ],
      "normal": [
        "Mendengar rumor rahasia murid sekolah lain"
      ],
      "disliked": [
        "Orang yang kabur membawa utang taruhan"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kuroda_gin",
    "slug": "kuroda_gin",
    "name": "Kuroda Gin (黒田 銀)",
    "furigana": "黒田 銀",
    "nickname": [
      "Gin",
      "Bayangan Tenka",
      "Si Tanpa Suara",
      "Pengawal Presidium"
    ],
    "tagline": "Tugas saya hanya satu: memastikan tidak ada satu pun marabahaya yang menyentuh Ketua OSIS dan rekan-rekan presidium. Mundur tiga langkah dari pintu ini, atau tanganmu akan terkunci di belakang punggung.",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "osis",
    "role": "Pengawal Bayangan Presidium OSIS & Siswa Kelas 11-1",
    "club": "martial_arts",
    "club_role": "Pengawal Kehormatan Presidium OSIS & Praktisi Aikido",
    "archetype": "emo",
    "social_class": "worker",
    "age": 16,
    "birthday": "1 November",
    "zodiac": "Scorpio",
    "mbti": "ISTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kuroda_gin",
    "stats": {
      "physique": 16,
      "intelligent": 13,
      "looks": 14,
      "mind": 16,
      "talent": 13,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 16
    },
    "likes": [
      "Berdiri dalam kesunyian di sudut ruangan mengawasi pintu",
      "Teh barley dingin tawar",
      "Latihan kuncian sendi aikido dan teknik pelucutan senjata",
      "Melihat Asahina Tenka tersenyum aman"
    ],
    "dislikes": [
      "Orang asing yang mendekati Ketua OSIS secara agresif",
      "Keributan suara gaduh di dekat ruang kerja presidium",
      "Gerakan tubuh yang sia-sia"
    ],
    "personality": {
      "traits": "Sangat pendiam, hemat bicara, memiliki kewaspadaan taktis tinggi, dan dedikasi mutlak pada perlindungan Asahina Tenka.",
      "flaws": "Terlalu kaku dan curiga pada setiap orang baru, sulit mempercayai orang asing.",
      "dere_pattern": "Tipe Silent Bodyguard Ally. Mengawal pemain dari bayangan koridor dan menyerahkan kunci akses pintu darurat gedung."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tirus dingin dengan sorot mata abu-abu baja tajam (*piercing steel-grey eyes*) yang waspada mengawasi setiap pergerakan. Jarang sekali menunjukkan senyuman.\n* **Rambut:** Rambut hitam legam dipotong model *wolf-cut* panjang yang sedikit menutupi mata kanannya (*eye-covering bangs*).\n* **Postur & Gestur:** Tinggi jangkung kurus atletis (180 cm), gerak langkahnya nyaris tanpa suara bak bayangan.\n* **Seragam & Gaya Berpakaian:** Seragam Housen hitam kancing penuh yang rapi, sarung tangan kulit tipis tanpa jari (*fingerless black leather glove*) di tangan kiri.\n* **Aksesori & Barang Bawaan:** Sarung tangan kulit, pin lencana perak OSIS tersemat terbalik di kerah dalam blazer, dan borgol nilon pengaman kesiswaan di saku.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Berdiri dalam kesunyian di sudut ruangan mengawasi pintu"
      ],
      "normal": [
        "Latihan kuncian sendi aikido dan teknik pelucutan senjata"
      ],
      "disliked": [
        "Orang asing yang mendekati Ketua OSIS secara agresif"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_mawatari_bando",
    "slug": "mawatari_bando",
    "name": "Mawatari Bando (馬渡 坂東)",
    "furigana": "馬渡 坂東",
    "nickname": [
      "Bando",
      "Si Kunci Inggris",
      "Mekanik Kokuhou",
      "Bando-san"
    ],
    "tagline": "Kalau motor lu mau lari 120 km/jam lewatin barikade pelabuhan Touki tanpa brebet, serahin ke gw. Tapi ingat, begitu sampai di sana... hajar mereka sampai ga ada rantai yang tersisa!",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "kokuhou",
    "role": "Mekanik Motor Kokuhou & Tangan Kanan Kazugumi",
    "club": "scouts",
    "club_role": "Mekanik Armada Motor Kokuhou",
    "archetype": "delinquent",
    "social_class": "worker",
    "age": 17,
    "birthday": "9 September",
    "zodiac": "Virgo",
    "mbti": "ISTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=mawatari_bando",
    "stats": {
      "physique": 15,
      "intelligent": 13,
      "looks": 13,
      "mind": 14,
      "talent": 16,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 14
    },
    "likes": [
      "Membongkar karburator motor sambil mendengarkan musik rap",
      "Bandana hitam di dahi penahan keringat",
      "Kunci inggris serbaguna baja vanadium",
      "Ramen kuah kental dengan ekstra telur setengah matang"
    ],
    "dislikes": [
      "Anak Touki yang mencuri onderdil motor orang lain",
      "Hujan yang membuat kabel busi motor mogok",
      "Orang sok tahu yang meremehkan kerja mekanik"
    ],
    "personality": {
      "traits": "Prakmatis, setia kawan tanpa banyak omong, jenius dalam modifikasi mesin motor dan memahami rute pelarian jalanan.",
      "flaws": "Kurang peduli pada pelajaran teori sekolah dan sering bolos ke bengkel belakang.",
      "dere_pattern": "Tipe Loyal Mechanic Ally. Memodifikasi kendaraan jemputan party dan menyiapkan rantai evakuasi cepat."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tampan jalanan berkulit sawo matang terpapar oli dan matahari, senyuman percaya diri yang roguish, sepasang mata tembaga (*copper-brown eyes*) yang tajam menganalisis mekanik mesin. Ada coretan oli tipis di tulang pipi kirinya.\n* **Rambut:** Rambut gimbal pendek bertekstur (*short dreadlocks*) yang diikat ke belakang menjadi kuncir kuda pendek, dilingkari bandana hitam di dahinya.\n* **Postur & Gestur:** Bertubuh liat dan berotot kokoh (179 cm, 76 kg), kedua tangannya kapalan dan kuat mencengkeram besi.\n* **Seragam & Gaya Berpakaian:** Jaket seragam hitam kusam yang bagian lengannya digulung hingga siku, kaos hitam bertuliskan merk busi motor, celana kargo hitam dengan saku penuh baut.\n* **Aksesori & Barang Bawaan:** Bandana hitam di dahi, kunci inggris lipat serbaguna di saku belakang, dan kain lap kain lap microfiber berminyak.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Membongkar karburator motor sambil mendengarkan musik rap"
      ],
      "normal": [
        "Kunci inggris serbaguna baja vanadium"
      ],
      "disliked": [
        "Anak Touki yang mencuri onderdil motor orang lain"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_miruam_solari",
    "slug": "miruam_solari",
    "name": "Miruam Solari (ミリアム・ソラリ)",
    "furigana": "ミリアム・ソラリ",
    "nickname": [
      "Miruam",
      "Lady Miruam",
      "Ratu Merah"
    ],
    "tagline": "Dunia ini dipenuhi pecundang munafik yang tersenyum manis hanya untuk menusukmu dari belakang demi 'kebaikan bersama'. Jangan berani-berani berbohong di hadapanku... Tunjukkan siapa dirimu sebenarnya, atau enyahlah dari pandanganku.",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "osis",
    "role": "Wakil Ketua OSIS & Ketua Klub Kendo",
    "club": "student_council, kendo",
    "club_role": "Wakil Ketua OSIS & Ketua Klub Kendo",
    "archetype": "popular_kids",
    "social_class": "old_money",
    "age": 16,
    "birthday": "8 Agustus",
    "zodiac": "Leo",
    "mbti": "ENTJ",
    "gender": "Female",
    "avatar_url": "/portraits/miruam_solari.png",
    "stats": {
      "physique": 14,
      "intelligent": 15,
      "looks": 17,
      "mind": 14,
      "talent": 15,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 16
    },
    "likes": [
      "Kejujuran mutlak tanpa kepalsuan & penjilat",
      "Teh hitam Earl Grey impor & anggur non-alkohol vintage",
      "Seni pedang anggun berkecepatan tinggi",
      "Pemandangan kota malam dari balkon penthouse miliknya",
      "Orang yang berani menatap matanya tanpa gemetar"
    ],
    "dislikes": [
      "Kemunafikan & orang yang berbohong demi 'kebaikan bersama'",
      "Pria lemah yang mendekatinya demi uang/koneksi keluarganya",
      "Makanan murah instan berkualitas rendah",
      "Diremehkan atau diperlakukan layaknya boneka pajangan"
    ],
    "personality": {
      "traits": "Berkepribadian kuat, bangga, karismatik, dan menuntut standar tertinggi dari lingkungannya. Sebagai pewaris tunggal konglomerat raksasa Solari Group, Miruam terbiasa berada di puncak hierarki. Ia tidak segan menggunakan kekayaan dan pengaruh politik keluarganya untuk menertibkan situasi yang ia anggap mengganggu. Namun di balik arogansinya, Miruam adalah sosok yang adil, sangat menghargai kompetensi nyata, dan membenci kepalsuan para penjilat.",
      "flaws": "*Trauma Pengkhianatan 'The Greater Good' & Paranoia terhadap Orang Dekat.*  \nMiruam menyimpan luka batin mendalam akibat kematian misterius ibunya dan pengkhianatan sahabat masa kecilnya yang berbohong padanya demi \"kepentingan bersama\". Pengalaman itu menanamkan keyakinan mutlak dalam dirinya bahwa sebagian besar manusia adalah munafik pengecut yang menyembunyikan kebusukan di balik topeng moralitas. Ia mengelilingi hatinya dengan benteng besi; ia lebih memilih dibenci karena kekuatannya daripada dikasihani atau dibodohi oleh kebohongan manis.",
      "dere_pattern": "*Tipe Dominan: Tsundere Aristokratis Dominan (Regal Ojou-sama Queen).*  \nBagi Miruam, cinta bukan tentang kata-kata rayuan murah, melainkan kesetiaan tanpa pamrih dan kejujuran mutlak. Begitu Protagonist berani berdiri tegak menentangnya, tidak tunduk pada intimidasi uangnya, dan bersikap jujur tanpa topeng kemunafikan, Miruam akan terpikat habis-habisan.  \nSaat jatuh cinta, sisi *tsundere* bangsawannya sangat berkelas: ia tidak akan berteriak histeris, melainkan tersipu dengan anggun sambil memalingkan wajah, lalu diam-diam menyewa satu restoran bintang lima hanya agar mereka bisa makan berdua tanpa gangguan. Ia sangat posesif dan siap menghancurkan siapa pun yang berani menyakiti kekasihnya."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Kecantikannya sangat mencolok, aristokratis, dan memancarkan wibawa dominan. Memiliki tatapan mata merah rubi (*crimson-ruby eyes*) yang tajam bagai elang pemburu, hidung mancung anggun, bibir sensual dengan senyum sinis menawan yang mampu meluluhkan sekaligus mengintimidasi siapa pun. Kulitnya putih mulus tanpa noda layaknya porselen bangsawan.\n* **Rambut:** Rambut panjang berwarna merah menyala bergelombang megah (*voluminous crimson-scarlet hair*) yang terurai bebas hingga ke punggungnya. Beberapa helai rambut membingkai wajahnya secara dramatis dengan tatanan tiara kecil atau jepit rambut emas berbentuk lambang matahari (*The Solari Sun Crest*).\n* **Postur & Gestur:** Berdiri dengan punggung tegak laksana ratu (tinggi sekitar 168 cm). Gesturnya penuh keanggunan berkelas tinggi—sering menyilangkan kaki saat duduk di sofa kulit ruang klub, menopang dagunya dengan jari lentik bersarung tangan sutra hitam, dan menatap orang lain dari atas dengan penuh kendali.\n* **Seragam Sekolah:** Mengenakan seragam Housen Academy yang dipesan khusus dari penjahit pribadi keluarganya menggunakan sutra premium. Blazernya pas badan dengan kancing emas berukir, kerah pelaut hitam pekat bergaris ganda satin merah marun, serta bros permata rubi asli tersemat di dasi lehernya.\n* **Aksesori & Barang Bawaan:** Membawa tas tangan kulit desainer ternama, smartphone berbalut casing emas custom, sarung tangan anggun sutra hitam tipis yang selalu ia kenakan, serta set pedang latihan kayu (*bokken/shinai*) berlapis pernis hitam mengilap berukir emas.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Angkuh Berjarak / Ujian Tatapan",
          "description": "Menatap dingin dari balik sarung tangan sutranya, melontarkan kalimat sinis berwibawa, dan menolak berinteraksi jika merasa lawan bicaranya berniat menjilat."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Tertarik / Respek Intelektual",
          "description": "Mengizinkan protagonis duduk berhadapan dengannya di dojo kendo; menyuguhkan teh impor pilihan pribadinya; mulai menanyakan opini protagonis tentang isu sekolah."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Sadar Perasaan / Tsundere Elegan",
          "description": "Salah tingkah saat protagonis memujinya dengan tulus; memalingkan wajah merahnya sambil mendengus anggun: *\"B-bukan berarti aku sengaja menunggumu, kebetulan saja mobilku lewat sini!\"*."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Kasmaran Mendalam & Posesif Bangsawan",
          "description": "Menggunakan kekuasaannya untuk melenyapkan segala masalah yang dihadapi protagonis; mengajak kencan privat di restoran mewah; sangat cemburu tajam jika protagonis didekati orang lain; memberikan 1 Heart Token gratis di awal sesi."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Di Ambang Pengakuan",
          "description": "Membawa protagonis ke helipad atau dek atap penthouse pribadinya yang menghadap panorama gemerlap lampu kota; menatap mata sang pujaan hati dengan keberanian seorang ratu yang menyerahkan hatinya (DC Pengakuan: **9**)."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Resmi menjadi pasangan kekasih; Miruam membuka seluruh kerapuhan batinnya seutuhnya hanya kepada sang kekasih; keduanya kebal terhadap status *Social Meltdown* saat berada di area mana pun."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Set daun teh hitam langka beraroma bergamot/melati",
        "sarung tangan sutra elegan",
        "aksesori bermotif matahari emas/rubi",
        "ukiran pedang kendo kayu mawar langka",
        "karya seni orisinal buatan tangan protagonis yang jujur dan tulus."
      ],
      "normal": [
        "Cokelat hitam murni (*dark chocolate 85%*)",
        "pulpen berukir tinta emas",
        "buku strategi sejarah klasik."
      ],
      "disliked": [
        "Barang tiruan/palsu murahan (*counterfeit*)",
        "makanan cepat saji berminyak kotor",
        "hadiah murahan yang dibeli terburu-buru tanpa ketulusan hati."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Angkuh Berjarak / Ujian Tatapan): — Menatap dingin dari balik sarung tangan sutranya, melontarkan kalimat sinis berwibawa, dan menolak berinteraksi jika merasa lawan bicaranya berniat menjilat.",
      "3–4 ♥ (Tertarik / Respek Intelektual): — Mengizinkan protagonis duduk berhadapan dengannya di dojo kendo; menyuguhkan teh impor pilihan pribadinya; mulai menanyakan opini protagonis tentang isu sekolah.",
      "5–6 ♥ (Sadar Perasaan / Tsundere Elegan): — Salah tingkah saat protagonis memujinya dengan tulus; memalingkan wajah merahnya sambil mendengus anggun: *\"B-bukan berarti aku sengaja menunggumu, kebetulan saja mobilku lewat sini!\"*.",
      "7–8 ♥ (Kasmaran Mendalam & Posesif Bangsawan): — Menggunakan kekuasaannya untuk melenyapkan segala masalah yang dihadapi protagonis; mengajak kencan privat di restoran mewah; sangat cemburu tajam jika protagonis didekati orang lain; memberikan 1 Heart Token gratis di awal sesi.",
      "9 ♥ (Di Ambang Pengakuan): — Membawa protagonis ke helipad atau dek atap penthouse pribadinya yang menghadap panorama gemerlap lampu kota; menatap mata sang pujaan hati dengan keberanian seorang ratu yang menyerahkan hatinya (DC Pengakuan: **9**)."
    ]
  },
  {
    "id": "li_ouga_tesshin",
    "slug": "ouga_tesshin",
    "name": "Ouga Tesshin (逢坂 鉄心)",
    "furigana": "逢坂 鉄心",
    "nickname": [
      "Tesshin",
      "Batu Karang 11-2",
      "Raksasa Pendiam",
      "Tembok Housen"
    ],
    "tagline": "Kazugumi bilang... teman sekelas ga boleh ada yang terluka. Kamu jalan di belakang tubuhku. Pipa besi mereka ga akan bisa menembus punggung ini.",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "kokuhou",
    "role": "Raksasa Pelindung Kelas 11-2 & Judoka",
    "club": "martial_arts",
    "club_role": "Bouncer Kelas 11-2 & Atlet Judo",
    "archetype": "jock",
    "social_class": "worker",
    "age": 17,
    "birthday": "25 Desember",
    "zodiac": "Capricorn",
    "mbti": "ISFJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=ouga_tesshin",
    "stats": {
      "physique": 18,
      "intelligent": 10,
      "looks": 12,
      "mind": 16,
      "talent": 12,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 22,
      "composure_max": 16
    },
    "likes": [
      "Roti melon jumbo isi krim mentega manis",
      "Tidur siang di bawah pohon rindang taman",
      "Membantu siswi membawakan meja berat",
      "Bantingan judo ippon bersih di matras"
    ],
    "dislikes": [
      "Orang berisik yang membully teman sekelasnya",
      "Pakaian yang kekecilan dan robek di ketiak",
      "Makanan yang porsinya terlalu sedikit"
    ],
    "personality": {
      "traits": "Sangat pendiam, penyayang, setia kawan tiada tara, dan bertindak sebagai perisai pelindung hidup bagi rekan-rekannya di Kokuhou.",
      "flaws": "Lambat dalam berpikir taktis rumit, namun luar biasa mematikan jika dipicu amarah oleh kekerasan pada sahabatnya.",
      "dere_pattern": "Tipe Gentle Giant Protector. Membawa tameng pintu atau drum besi untuk menangkis proyektil lawan demi melindungi party."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah persegi lebar berkarakter tenang dan hangat bak raksasa lembut (*gentle giant*), alis tebal lurus, tatapan mata gelap damai (*calm dark eyes*), dan gigi seri depan yang sedikit sompel kecil saat tersenyum ramah.\n* **Rambut:** Kepala cepak plontos sangat pendek rapi (*clean buzzcut*).\n* **Postur & Gestur:** Raksasa bertubuh masif luar biasa tinggi besar (192 cm, 105 kg) dengan dada setebal tembok bata dan lengan berurat kawat.\n* **Seragam & Gaya Berpakaian:** Seragam Housen ukuran XXXL yang kancingnya nyaris meledak menahan otot dadanya, celana panjang longgar dengan sabuk kulit kokoh.\n* **Aksesori & Barang Bawaan:** Bungkus roti melon jumbo di saku, plester perekat kram otot, dan handuk leher katun tebal.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Roti melon jumbo isi krim mentega manis"
      ],
      "normal": [
        "Membantu siswi membawakan meja berat"
      ],
      "disliked": [
        "Orang berisik yang membully teman sekelasnya"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_saotome_riku",
    "slug": "saotome_riku",
    "name": "Saotome Riku (早乙女 陸)",
    "furigana": "早乙女 陸",
    "nickname": [
      "Riku",
      "Saotome",
      "Pedang Besi 11-1",
      "Wakil Kendo"
    ],
    "tagline": "Pedang kendo bukan untuk menyombongkan kekuatan, tapi untuk mengasah kemurnian jiwa. Jika tekadmu goyah, langkah kakimu di matras akan langsung terbaca lawan.",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Wakil Kapten Klub Kendo & Siswa Kelas 11-1",
    "club": "kendo",
    "club_role": "Wakil Kapten Klub Kendo",
    "archetype": "jock",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "18 Mei",
    "zodiac": "Taurus",
    "mbti": "ISTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=saotome_riku",
    "stats": {
      "physique": 16,
      "intelligent": 12,
      "looks": 14,
      "mind": 15,
      "talent": 13,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 14
    },
    "likes": [
      "Latihan tebasan suburi 500 kali setiap fajar",
      "Minyak pelindung bilah pedang kendo",
      "Onigiri daging sapi bumbu kecap",
      "Menjaga kehormatan dojo sekolah"
    ],
    "dislikes": [
      "Siswa yang berlatih setengah hati",
      "Seragam yang kusut dan kotor",
      "Trik kotor dalam pertandingan beladiri"
    ],
    "personality": {
      "traits": "Kaku, disiplin, loyal, dan sangat menghormati hierarki dojo. Ia adalah tangan kanan terpercaya Miruam Solari di klub kendo.",
      "flaws": "Sangat canggung dalam interaksi romantis dan mudah salah tingkah bila diajak bercanda oleh siswi.",
      "dere_pattern": "Tipe Disciplined Samurai Ally. Meminjamkan perlengkapan pelindung kendo terbaiknya untuk party pemain."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah maskulin persegi dengan tatapan mata abu-abu gelap (*dark grey eyes*) yang tajam, dingin, dan sangat fokus. Kulitnya kecokelatan sehat hasil latihan luar ruangan.\n* **Rambut:** Rambut hitam lurus pendek disisir rapi belah samping (*clean side-parted black hair*).\n* **Postur & Gestur:** Tegak sempurna seperti samurai (178 cm, 74 kg), jalannya mantap tanpa limbung.\n* **Seragam & Gaya Berpakaian:** Seragam Housen yang disetrika licin kancing penuh, dasi terikat kencang rapi, membawa tas pelindung shinai bambu hitam bergaris putih.\n* **Aksesori & Barang Bawaan:** Pelindung pergelangan tangan kulit kendo (*kote protector*) di saku, handuk latihan biru tua.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Latihan tebasan suburi 500 kali setiap fajar"
      ],
      "normal": [
        "Onigiri daging sapi bumbu kecap"
      ],
      "disliked": [
        "Siswa yang berlatih setengah hati"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_sendo_kyosuke",
    "slug": "sendo_kyosuke",
    "name": "Sendo Kyosuke (仙道 恭介)",
    "furigana": "仙道 恭介",
    "nickname": [
      "Kyosuke",
      "Kyo",
      "Pembalap Liar",
      "Sepupu Airi"
    ],
    "tagline": "Airi itu sepupu gw yang paling berharga. Siapa pun yang berani bikin dia nangis, atau berani nyentuh teman-teman sekelasnya... bakal gw kejar sampai ujung dermaga pelabuhan dan gw seret pake knalpot motor!",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "kokuhou",
    "role": "Pembalap Liar Sepupu Airi & Enforcer Kokuhou",
    "club": "sports",
    "club_role": "Speed Enforcer Kokuhou & Pembalap Liar",
    "archetype": "delinquent",
    "social_class": "middle_class",
    "age": 17,
    "birthday": "11 Agustus",
    "zodiac": "Leo",
    "mbti": "ESTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=sendo_kyosuke",
    "stats": {
      "physique": 15,
      "intelligent": 12,
      "looks": 16,
      "mind": 13,
      "talent": 15,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 14
    },
    "likes": [
      "Motor sport 400cc dua silinder warna merah menyala",
      "Aroma aspal panas di jalan layang pantai tengah malam",
      "Melihat sepupunya Airi tersenyum ceria",
      "Kacamata hitam gaya aviator"
    ],
    "dislikes": [
      "Polisi patroli yang menyita knalpot motornya",
      "Cowok brengsek yang berani mengganggu atau mempermainkan Airi",
      "Kecepatan di bawah 80 km/jam"
    ],
    "personality": {
      "traits": "Protektif, modis, pemberani, penyuka kecepatan tinggi, dan sangat menghargai ikatan darah keluarga.",
      "flaws": "Sangat emosional dan protektif berlebihan (*overprotective*) jika menyangkut keselamatan sepupunya, Sendou Airi.",
      "dere_pattern": "Tipe Bad-Boy Speedster Ally. Menyediakan konvoi motor sport kecepatan tinggi untuk membelah barikade pengepungan Touki."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tampan modis ala gyaru-o / street racer dengan kulit kecokelatan sehat, senyuman percaya diri yang memikat, sepasang mata hazel menyala (*fiery hazel eyes*), dan anting perak salib (*silver cross earring*) di telinga kirinya.\n* **Rambut:** Rambut cokelat kemerahan (*reddish-brown*) modis ditata model *layered wolf-cut* bertekstur rapi dengan sedikit wax rambut wangi.\n* **Postur & Gestur:** Bertubuh atletis tinggi semampai (181 cm, 75 kg), gesturnya percaya diri dan selalu mengenakan sarung tangan balap kulit tanpa jari.\n* **Seragam & Gaya Berpakaian:** Blazer Housen yang disampirkan di pundak kiri, kemeja seragam terbuka menampakkan kaos hitam grafiti, celana seragam pas badan, jaket bomber motor merah-hitam di motor.\n* **Aksesori & Barang Bawaan:** Kunci motor berlogo Honda CB400, sarung tangan balap kulit, anting salib perak, dan kacamata hitam di saku blazer.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Motor sport 400cc dua silinder warna merah menyala"
      ],
      "normal": [
        "Melihat sepupunya Airi tersenyum ceria"
      ],
      "disliked": [
        "Polisi patroli yang menyita knalpot motornya"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_shinoda_renzo",
    "slug": "shinoda_renzo",
    "name": "Shinoda Renzo (篠田 蓮造)",
    "furigana": "篠田 蓮造",
    "nickname": [
      "Renzo",
      "Ren-chin",
      "Beatmaker Begadang",
      "Pangeran Lo-Fi"
    ],
    "tagline": "Dunia luar terlalu berisik... Gw lebih suka menyaring kebisingan itu jadi gelombang frekuensi yang enak didengar. Kalau butuh sound effect atau pemancar frekuensi pengacau sinyal, kasih gw lima belas menit.",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Sound Designer, Beatmaker & Siswa Kelas 11-1",
    "club": "band",
    "club_role": "Audio Producer & Sequencer",
    "archetype": "emo",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "22 Oktober",
    "zodiac": "Scorpio",
    "mbti": "INTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=shinoda_renzo",
    "stats": {
      "physique": 10,
      "intelligent": 15,
      "looks": 14,
      "mind": 15,
      "talent": 17,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 14
    },
    "likes": [
      "Membuat bass drum 808 dan synth pad yang mengambang",
      "Minuman berenergi Monster Energy dingin rasa citrus",
      "Suasana sunyi malam hari di kamarnya",
      "Headphone in-ear monitor custom"
    ],
    "dislikes": [
      "Sinar matahari pagi yang terlalu terik menyilaukan mata",
      "Pelajaran olahraga lari maraton",
      "Melodi lagu pop murahan yang tidak punya kedalaman chord"
    ],
    "personality": {
      "traits": "Introvert, pendiam, bicaranya hemat kata, namun sangat loyal pada lingkaran teman dekatnya dan berbakat besar dalam rekayasa audio digital.",
      "flaws": "Sering kelelahan di siang hari dan kurang peduli pada interaksi formal sekolah.",
      "dere_pattern": "Tipe Quiet Emo Producer Ally. Memasang pengacau frekuensi sinyal (jammer) untuk melumpuhkan komunikasi geng Touki saat operasi."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tirus artistik dengan kulit agak pucat, kantung mata tipis akibat sering begadang membuat musik, dan sepasang mata hitam obsidian sayu (*sleepy dark eyes*) yang menyala fokus saat mendengarkan audio.\n* **Rambut:** Rambut hitam berantakan model *choppy layered* dengan ujung poni depan diberi aksen cat hijau neon (*neon-green dyed tips*).\n* **Postur & Gestur:** Bertubuh kurus jangkung (177 cm), jemarinya ramping dan selalu bergerak mengetuk ritme di meja atau saku baju.\n* **Seragam & Gaya Berpakaian:** Mengenakan hoodie hitam oversized bertuliskan logo audio di balik blazer Housen yang dibiarkan terbuka, celana seragam sedikit longgar, sepatu kets hitam polos.\n* **Aksesori & Barang Bawaan:** In-ear monitor custom kabel transparan melingkar di daun telinga, pemutar audio hi-res portabel, dan kabel adaptor jack di sakunya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Membuat bass drum 808 dan synth pad yang mengambang"
      ],
      "normal": [
        "Suasana sunyi malam hari di kamarnya"
      ],
      "disliked": [
        "Sinar matahari pagi yang terlalu terik menyilaukan mata"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_tahagusa_kazugumi",
    "slug": "tahagusa_kazugumi",
    "name": "Tahagusa Kazugumi (田端 嘉組)",
    "furigana": "田端 嘉組",
    "nickname": [
      "Kazugumi",
      "Kazu",
      "Bos Tempat Sampah",
      "Srigala Housen"
    ],
    "tagline": "Dengar baik-baik bocah baru. Di depan gerbang sakura lu boleh tunduk sama aturan OSIS. Tapi begitu lu melangkah ke jalanan luar, aturan yang berlaku cuma satu: siapa yang berani nyentuh lambang Housen, bakal gw hajar sampai ga bisa jalan pulang!",
    "grade": 11,
    "class_room": "11-2",
    "category_id": "kokuhou",
    "role": "Ketua Lapangan Geng Berandal Kokuhou",
    "club": "martial_arts",
    "club_role": "Ketua Lapangan Kokuhou (Geng Belakang Sekolah)",
    "archetype": "delinquent",
    "social_class": "worker",
    "age": 17,
    "birthday": "5 Mei",
    "zodiac": "Taurus",
    "mbti": "ESTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=tahagusa_kazugumi",
    "stats": {
      "physique": 17,
      "intelligent": 11,
      "looks": 14,
      "mind": 15,
      "talent": 13,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 18,
      "composure_max": 14
    },
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
    "personality": {
      "traits": "Tegas, liar, menjunjung tinggi kode etik petarung jalanan (*Noble Banchou*). Ia menolak memeras warga atau menyakiti perempuan dan anak kecil. Kepemimpinannya didasarkan pada rasa hormat dan darah persaudaraan.",
      "flaws": "Sangat keras kepala dan mudah terpancing emosinya jika nama baik faksi atau kehormatan sekolahnya dihina.",
      "dere_pattern": "Tipe Delinquent Bro / Tsundere Protektif. Mengajarkan teknik tinju pada pemain, membelikan ramen mangkuk ganda, dan pasang badan di garis depan saat musuh menyerbu."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tampan keras berahang tegas dengan bekas luka goresan perkelahian di rahang kiri. Sepasang mata tajam berwarna cokelat madu liar (*feral amber-brown*) bak serigala lapar. Di batang hidungnya selalu tertempel plester medis putih (*adhesive bandage*).\n* **Rambut:** Potongan rambut *undercut* pirang gelap bertekstur kasar, bagian atasnya disisir berantakan ke belakang (*slicked-back textured quiff*).\n* **Postur & Gestur:** Bertubuh liat, tegap, dan berotot kokoh (182 cm). Sering berjalan dengan kedua tangan di saku celana, dagu terangkat menantang siapa pun yang menatap matanya.\n* **Seragam & Gaya Berpakaian:** Jaket seragam hitam (*gakuran*) yang seluruh kancingnya dibuka memperlihatkan kaos dalaman hitam polos pas badan, rantai dompet perak tipis di pinggang, dan celana longgar khas berandal dengan sepatu boots kulit hitam usang.\n* **Aksesori & Barang Bawaan:** Plester hidung cadangan di saku jaket, korek api zippo kuningan, dan perban tinju melilit pergelangan tangannya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Adu panco dan baku hantam tangan kosong satu lawan satu yang jantan"
      ],
      "normal": [
        "Kopi kaleng pahit hangat saat angin senja bertiup"
      ],
      "disliked": [
        "Berandal pengecut yang main keroyokan atau memakai senjata tajam"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_vesna_strivozha",
    "slug": "vesna_strivozha",
    "name": "Vesna Strivozha (ヴェスナ・ストリヴォージャ)",
    "furigana": "ヴェスナ・ストリヴォージャ",
    "nickname": [
      "Vesna",
      "Snowy Banquet's Blade",
      "Putri Peri Anggar",
      "Komandan Vila"
    ],
    "tagline": "Titel komandan atau putri bangsawan bisa menunggu di depan pintu. Di atas matras anggar ini, hanya ada kecepatan pedang dan ketulusan hatimu yang berbicara. Ayo, tunjukkan padaku apakah tekadmu bisa menembus badai esku!",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Komandan Siswa Tamu Snezhnaya, Atlet Anggar & Siswi Kelas 11-1",
    "club": "martial_arts",
    "club_role": "Kapten Tamu Klub Anggar Modern (*Modern Fencing*)",
    "archetype": "popular_kids",
    "social_class": "elite",
    "age": 16,
    "birthday": "23 September",
    "zodiac": "Libra",
    "mbti": "ENTP",
    "gender": "Female",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=vesna_strivozha",
    "stats": {
      "physique": 15,
      "intelligent": 14,
      "looks": 17,
      "mind": 14,
      "talent": 17,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 14,
      "composure_max": 14
    },
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
    "personality": {
      "traits": "Bebas, berjiwa petualang, menjunjung tinggi kehormatan pedang, namun sangat suka bercanda dan bermain trik santai di waktu luangnya. Meskipun berasal dari klan Strivozha yang terhormat, Vesna membenci formalitas aristokrat yang sombong dan lebih suka bergaul akrab dengan murid biasa yang tulus.",
      "flaws": "Terkadang terlalu percaya diri dengan kelincahan fisiknya hingga meremehkan bahaya politik kotor geng jalanan.",
      "dere_pattern": "Tipe Ojou-sama Ksatria yang Bebas (Knight-Princess Dere). Menghargai keberanian dan integritas. Jika jatuh cinta, ia akan menantang pemain berdansa di bawah guyuran bunga sakura dan menghadiahkan lencana kristal es pelindung keluarga Strivozha."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah bangsawan bergaris halus yang sangat cantik memesona bak peri es mitologi Slavic. Memiliki sepasang telinga panjang berujung runcing (*elongated pointed elf-ears*) khas garis darah Vila kuno. Sepasang matanya berwarna biru toska (*radiant aquamarine/cyan*) dengan pola pupil bintang berujung runcing yang berkilau pendar, dihiasi rona merah muda lembut di kedua pipinya. Senyumannya cerah, anggun, dan penuh percaya diri.\n* **Rambut:** Rambut pirang emas bercahaya (*vibrant golden-blonde*) panjang yang ditata menjadi kuncir kuda tinggi (*high sweeping ponytail*) yang memilin menjadi spiral drill tebal anggun di bagian belakang, diikat dengan pita sutra berwarna toska-hijau laut (*teal ribbon bow*). Poni depannya lurus rapi membingkai dahi dengan juntaian ikal melingkar lembut di samping pipi dan melewati telinga peri runcingnya.\n* **Postur & Gestur:** Bertubuh ramping semampai bak atlet seluncur es (*figure skater grace*, tinggi 166 cm), gerakannya luar biasa lincah dan berwibawa. Sering meletakkan satu tangan di pinggang rampingnya sementara tangan kanannya memutar pedang anggar rapier dengan presisi mematikan.\n* **Seragam & Gaya Berpakaian:** Modifikasi seragam anggar Housen berpotongan korset putih-toska muda (*seafoam/cyan*) tanpa bahu dengan piping putih dan aksen filigri emas aristokratik. Di pinggulnya terikat pita besar berwarna persik (*coral/peach ribbon bow*) dengan gesper lambang emas kepingan salju. Mengenakan sarung tangan putih anggar berenda dan sepatu bot anggar putih berhak emas.\n* **Aksesori & Barang Bawaan:** Tiara kristal es perak bermahkotakan batu permata sian berlian di keningnya, pedang rapier anggar berujung kristal mawar es, dan bros lambang Snezhnaya Druzhna di kerahnya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Latihan anggar pedang rapier di aula berkaca saat pagi berkabut"
      ],
      "normal": [
        "Matahari cerah setelah badai salju panjang"
      ],
      "disliked": [
        "Protokol bangsawan yang terlalu kaku dan membosankan"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_yuki_haruto",
    "slug": "yuki_haruto",
    "name": "Yuki Haruto (結城 悠斗)",
    "furigana": "結城 悠斗",
    "nickname": [
      "Haruto",
      "Haru-kun",
      "Si Rubah Lensa",
      "Mata-mata Sekolah"
    ],
    "tagline": "Lensa kamera gw ga pernah bohong. Lu mau tau titik persembunyian anak-anak Touki di pelabuhan? Gw punya foto satelit dan denah gudangnya... tentu dengan harga barter informasi yang pas, kawan.",
    "grade": 11,
    "class_room": "11-1",
    "category_id": "class_2_1",
    "role": "Ketua Ekskul Fotografi & Informan Rahasia Sekolah",
    "club": "photography",
    "club_role": "Ketua Ekskul Fotografi & Jurnalistik",
    "archetype": "popular_kids",
    "social_class": "middle_class",
    "age": 16,
    "birthday": "14 Februari",
    "zodiac": "Aquarius",
    "mbti": "ENTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=yuki_haruto",
    "stats": {
      "physique": 11,
      "intelligent": 15,
      "looks": 16,
      "mind": 14,
      "talent": 15,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 14
    },
    "likes": [
      "Menangkap ekspresi candid murid sekolah yang sedang tersipu",
      "Kamera mirrorless lensa prime 50mm f/1.2",
      "Kopi susu dingin di taman tengah",
      "Gosip hangat seputar persaingan faksi sekolah"
    ],
    "dislikes": [
      "Foto yang buram atau out of focus",
      "Guru yang menyita kartu memori kameranya",
      "Orang yang berpose terlalu kaku dan palsu"
    ],
    "personality": {
      "traits": "Ceria, ramah, pandai bergaul dengan semua lingkaran sosial, namun menyimpan jaringan informasi intelijen sekolah yang sangat luas.",
      "flaws": "Suka mengintip dan merekam peristiwa berbahaya tanpa memikirkan keselamatan dirinya sendiri.",
      "dere_pattern": "Tipe Charming Information Broker. Memberikan peta taktis dan intel foto lawan secara gratis demi keselamatan teman dekatnya."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tampan modis dengan senyuman rubah ramah (*sly fox smile*), sepasang mata violet gelap (*dark violet eyes*) yang jeli mengamati sekeliling. Telinga kirinya dihiasi anting perak kecil.\n* **Rambut:** Rambut cokelat abu-abu pirang (*ash-brown wavy hair*) berombak santai yang sebagian diikat kuncir kecil di belakang kepala (*mini half-up bun*).\n* **Postur & Gestur:** Ramping lincah (176 cm), kamera mirrorless hitam selalu tergantung santai di lehernya, siap membidik dalam sepersekian detik.\n* **Seragam & Gaya Berpakaian:** Blazer Housen yang tidak dikancingkan, kemeja putih kasual dengan dasi longgar, celana panjang slim-fit dengan sepatu kets modis.\n* **Aksesori & Barang Bawaan:** Kamera Sony Alpha mirrorless dengan tali kulit cokelat, tas selempang lensa, dan beberapa kartu SD cadangan.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Menangkap ekspresi candid murid sekolah yang sedang tersipu"
      ],
      "normal": [
        "Kopi susu dingin di taman tengah"
      ],
      "disliked": [
        "Foto yang buram atau out of focus"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_saegusa_koharu",
    "slug": "saegusa_koharu",
    "name": "Saegusa Koharu (三枝 小春)",
    "furigana": "三枝 小春",
    "nickname": [
      "Koharu-senpai",
      "Prima Donna Housen",
      "Sang Sutradara",
      "Haru-nee"
    ],
    "tagline": "Selamat datang di panggung masa muda, adik-adik Kelas 10! Dunia ini adalah teater raksasa, dan kalianlah pemeran utamanya! Aku Saegusa Koharu, Ketua Klub Drama! Eh, tunggu dulu... kamu yang berdiri di barisan depan itu—ya, kamu! Tatapan matamu barusan punya 'kilau protagonis' yang luar biasa! Kemarilah naik ke panggung bersamaku sebentar!",
    "grade": 12,
    "class_room": "12-1",
    "category_id": "class_3_1",
    "role": "Ketua Klub Drama & Koordinator Panggung Budaya",
    "club": "drama",
    "club_role": "Ketua Klub Drama & Sutradara Panggung Utama (Senior Kelas 12)",
    "archetype": "popular_kids",
    "social_class": "elite",
    "age": 17,
    "birthday": "29 Mei",
    "zodiac": "Gemini",
    "mbti": "ENFP",
    "gender": "Female",
    "avatar_url": "/portraits/saegusa_koharu.png",
    "stats": {
      "physique": 11,
      "intelligent": 15,
      "looks": 17,
      "mind": 13,
      "talent": 18,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 15
    },
    "likes": [
      "Sorot lampu panggung auditorium dan gemuruh tepuk tangan penonton",
      "Menulis naskah drama romantis sambil menyeruput teh buah beri merah",
      "Melihat dua orang yang saling memendam rasa beradu akting di atas panggung",
      "Kostum teater bergaya klasik Eropa dan pita beludru merah marun",
      "Seseorang yang mampu menebak perasaan aslinya saat dia sedang tidak berakting"
    ],
    "dislikes": [
      "Naskah cerita yang klise, datar, dan tidak memiliki jiwa",
      "Orang yang meremehkan kerja keras kru panggung dan penata lampu",
      "Suasana kaku yang mematikan kreativitas siswa",
      "Kesepian di ruang ganti belakang panggung setelah tirai pertunjukan ditutup"
    ],
    "personality": {
      "traits": "Koharu adalah jantung dari seluruh kegiatan seni dan budaya di Housen Academy. Saat **Pekan Pengenalan & Perekrutan Klub** di bulan April, dialah yang menyulap halaman sekolah dan auditorium menjadi panggung pertunjukan spektakuler. Ia ceria, suka menggoda adik kelas dengan dialog-dialog puitis, dan memiliki mata tajam untuk melihat potensi terpendam maupun perasaan cinta yang sedang tumbuh di antara murid-murid lain.",
      "flaws": "Karena sejak kecil terbiasa memerankan puluhan karakter di atas panggung demi memenuhi harapan ibunya yang seorang aktris legendaris, Koharu terkadang takut tidak ada orang yang benar-benar mencintai \"dirinya yang asli\" saat lampu panggung dimatikan. Ketika ia sedang sedih atau lelah, ia justru menutupinya dengan senyum dan akting paling ceria agar tidak ada yang khawatir.",
      "dere_pattern": "Bertipe **Playful Flirt yang Menjadi Sangat Tulus & Gugup Saat Naskahnya Sendiri Berbalik**. Ia gemar menggoda protagonis dengan alasan \"latihan adegan romantis\". Namun ketika protagonis merespons dengan kalimat jujur yang tidak ada di dalam naskah, Koharu akan terdiam dengan wajah memerah dan kehilangan kemampuan aktingnya sama sekali."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah memukau penuh ekspresi dengan pesona bintang panggung. Sepasang mata kuning keemasan cerah (*golden topaz*) yang berbinar hidup di bawah bulu mata lentik, senyum anggun yang sedikit menggoda, dan gerakan tubuh seindah penari balet.\n* **Rambut:** Rambut ikal bergelombang panjang berwarna merah muda keemasan (*rose-gold / apricot blonde*) yang dihiasi pita beludru merah marun di sisi kiri kepala.\n* **Postur & Gestur:** Anggun dan ekspresif (164 cm). Suka berbicara sambil menggerakkan tangan layaknya sedang memimpin orkestra atau membisikkan dialog teater tepat di dekat telinga lawan bicaranya.\n* **Seragam & Gaya Berpakaian:** Seragam *serafuku* Housen Academy yang dipadukan dengan jubah bahu (*capelet*) rajut warna merah anggur khas kostum sutradara teater miliknya.\n* **Aksesori & Barang Bawaan:** Gulungan naskah drama yang diikat pita emas, pena bulu untuk mencatat improvisasi dialog, dan bros perak berbentuk topeng teater di kerahnya.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Sutradara Senior & Adik Kelas",
          "description": "Menggoda protagonis dengan penuh percaya diri saat demonstrasi perekrutan klub."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Partner Latihan Dialog",
          "description": "Meminta bantuan protagonis membacakan lawan bicara naskah barunya sepulang sekolah."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Lupa Dialog Sendiri",
          "description": "Mulai salah mengucapkan kalimat naskah karena terlalu fokus menatap bibir dan mata protagonis."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Di Balik Tirai Panggung Kosong",
          "description": "Berbagi cerita jujur tentang kesepiannya di aula auditorium yang telah sepi usai pertunjukan."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Tanpa Naskah, Tanpa Akting",
          "description": "Menatap protagonis tanpa senyum panggung dan meminta sebuah pengakuan yang nyata."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Menulis epilog terindah masa SMA bersama protagonis sebelum wisuda bulan Maret."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Teh Buah Beri Merah (Rosehip & Berry Tea)",
        "Pita Beludru Merah Marun",
        "Tiket Pertunjukan Teater Klasik",
        "Permen Pelega Tenggorokan Madu."
      ],
      "normal": [
        "Buku Puisi/Naskah Klasik",
        "Bunga Mawar Segar",
        "Cermin Saku Antik."
      ],
      "disliked": [
        "Komentar sinis yang merendahkan seni pertunjukan",
        "Minuman bersoda keras sebelum tampil vokal."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Sutradara Senior & Adik Kelas): — Menggoda protagonis dengan penuh percaya diri saat demonstrasi perekrutan klub.",
      "3–4 ♥ (Partner Latihan Dialog): — Meminta bantuan protagonis membacakan lawan bicara naskah barunya sepulang sekolah.",
      "5–6 ♥ (Lupa Dialog Sendiri): — Mulai salah mengucapkan kalimat naskah karena terlalu fokus menatap bibir dan mata protagonis.",
      "7–8 ♥ (Di Balik Tirai Panggung Kosong): — Berbagi cerita jujur tentang kesepiannya di aula auditorium yang telah sepi usai pertunjukan.",
      "9 ♥ (Tanpa Naskah, Tanpa Akting): — Menatap protagonis tanpa senyum panggung dan meminta sebuah pengakuan yang nyata."
    ]
  },
  {
    "id": "li_tachibana_rin",
    "slug": "tachibana_rin",
    "name": "Tachibana Rin (橘 凛)",
    "furigana": "橘 凛",
    "nickname": [
      "Rin-senpai",
      "Tachibana-buchou",
      "Pedang Sakura Housen",
      "Lady Bushido"
    ],
    "tagline": "Perhatikan kuda-kudamu, adik kelas! Pedang bambu ini tidak berbohong—satu keraguan kecil di hatimu akan langsung terbaca dari ujung bilahmu. Aku Tachibana Rin, Ketua Klub Kendo Housen Academy. Di panggung perekrutan klub hari ini, siapa pun di antara kalian siswa baru Kelas 10 yang berhasil menyentuh pelindung bahuku meski hanya satu kali... akan kuakui secara pribadi!",
    "grade": 12,
    "class_room": "12-1",
    "category_id": "class_3_1",
    "role": "Senior Kapten Kendo & Mentor Dojo (Kelas 12-1)",
    "club": "kendo",
    "club_role": "Senior Kapten Kendo & Mentor Kehormatan Dojo",
    "archetype": "jock",
    "social_class": "elite",
    "age": 17,
    "birthday": "3 Maret",
    "zodiac": "Pisces",
    "mbti": "ISTJ",
    "gender": "Female",
    "avatar_url": "/portraits/tachibana_rin.png",
    "stats": {
      "physique": 17,
      "intelligent": 14,
      "looks": 16,
      "mind": 16,
      "talent": 15,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 16,
      "composure_max": 16
    },
    "likes": [
      "Suara hentakan kaki di lantai kayu dojo yang baru dibersihkan saat pagi buta",
      "Teh hijau panggang (Hojicha) hangat & manisan daifuku stroberi",
      "Lawan latih tanding yang memiliki tatapan mata jujur dan tidak gentar",
      "Benda-benda imut bertema kelinci (dirahasiakan rapat-rapat demi menjaga wibawa kapten)",
      "Ditemani merawat pedang bambu (shinai) di teras dojo saat matahari terbenam"
    ],
    "dislikes": [
      "Orang yang menggunakan kekuatan fisik untuk menindas yang lemah",
      "Sikap pengecut yang lari dari tanggung jawab",
      "Makanan yang terlalu pedas (langsung membuatnya menangis kepedasan)",
      "Kenyataan bahwa masa baktinya sebagai siswi SMA akan berakhir di bulan Maret"
    ],
    "personality": {
      "traits": "Rin adalah simbol kehormatan siswa senior Kelas 12 di Housen Academy. Sebagai Ketua Klub Kendo yang telah membawa piala kejuaraan prefektur, ia sangat dihormati baik oleh adik kelas (termasuk Miruam Solari dan Kanzaki Takeru) maupun oleh OSIS. Ia berbicara dengan sopan, menjunjung tinggi sportivitas, dan selalu membimbing siswa baru dengan kesabaran seorang mentor sejati.",
      "flaws": "Karena menghabiskan hampir seluruh masa mudanya dengan berlatih pedang di dojo keluarga sejak usia lima tahun, Rin sama sekali buta terhadap dunia kencan dan romansa remaja modern. Sedikit saja godaan romantis atau sentuhan tangan yang tidak terduga mampu menghancurkan pertahanan mentalnya—membuat sang juara Kendo yang tak terkalahkan di arena menjadi salah tingkah seperti gadis pertama kali jatuh cinta. Selain itu, sebagai siswi Kelas 12, ia menyimpan kesedihan tersembunyi karena tahun ini adalah tahun terakhirnya di SMA sebelum lulus di bulan Maret.",
      "dere_pattern": "Bertipe **Dignified Kuudere / Noble Senpai yang Sangat Polos**. Ia menunjukkan kasih sayang lewat perlindungan, bimbingan langsung (*tangan memegang tangan saat memperbaiki postur pedang*), dan kesetiaan mutlak. Begitu hatinya tertambat pada protagonis, ia akan memperlakukan ikatan tersebut dengan keseriusan sumpah seorang ksatria."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Kecantikan klasik Jepang (*Yamato Nadeshiko*) dengan garis wajah tegas nan anggun. Sepasang mata tajam berwarna merah delima gelap (*crimson-garnet*) dengan bulu mata panjang, kulit putih bersih, dan ekspresi tenang yang memancarkan aura pendekar.\n* **Rambut:** Rambut hitam keunguan panjang sepunggung yang diikat ekor kuda tinggi menggunakan pita kain putih tradisional (*hachimaki ribbon*), dengan poni samping yang membingkai pipinya secara elegan.\n* **Postur & Gestur:** Tegak, proporsional, dan sangat anggun dalam setiap langkah kaki (168 cm). Bahkan saat berjalan dengan seragam sekolah biasa, pusat gravitasinya tidak pernah goyah sedikit pun.\n* **Seragam & Gaya Berpakaian:** Seragam *serafuku* Housen Academy untuk siswi kelas 12, atau pakaian latihan Kendo lengkap (*keikogi* biru tua dan celana panjang lipit *hakama* hitam) saat berada di area dojo dan panggung demonstrasi ekskul.\n* **Aksesori & Barang Bawaan:** Tas kulit panjang pembawa *shinai* di bahunya, pelindung pergelangan tangan, serta gantungan kunci kelinci kecil yang ia sembunyikan di bagian dalam saku tasnya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Kapten Senior & Siswa Baru",
          "description": "Sikap tegas namun mengayomi; menguji nyali protagonis di panggung perekrutan klub."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Murid Bimbingan Khusus",
          "description": "Mengajak protagonis berlatih tambahan di dojo dan memuji perkembangan mentalnya."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Gugup di Luar Dojo",
          "description": "Wajahnya memerah saat berpapasan dengan protagonis ketika ia sedang memegang boneka/barang imut atau makan daifuku manis."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Janji Sebelum Turnamen Terakhir",
          "description": "Meminta protagonis datang menonton turnamen musim panas terakhirnya sebagai siswi Kelas 12."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Batas Waktu Sebelum Kelulusan",
          "description": "Mengungkapkan ketakutannya akan berpisah saat lulus nanti dan keinginannya untuk tetap bersama protagonis."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Menyerahkan pita rambut pusaka miliknya di bawah pohon sakura gerbang akademi sebagai janji cinta abadi."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Daifuku Stroberi Segar",
        "Gantungan Kunci Kelinci Imut",
        "Teh Hojicha Pilihan",
        "Handuk Tenugui Katun Tradisional."
      ],
      "normal": [
        "Plester Otot Hangat",
        "Minuman Teh Hijau Botol",
        "Buku Sejarah Samurai."
      ],
      "disliked": [
        "Makanan Super Pedas",
        "Barang curian atau hasil kecurangan."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Kapten Senior & Siswa Baru): — Sikap tegas namun mengayomi; menguji nyali protagonis di panggung perekrutan klub.",
      "3–4 ♥ (Murid Bimbingan Khusus): — Mengajak protagonis berlatih tambahan di dojo dan memuji perkembangan mentalnya.",
      "5–6 ♥ (Gugup di Luar Dojo): — Wajahnya memerah saat berpapasan dengan protagonis ketika ia sedang memegang boneka/barang imut atau makan daifuku manis.",
      "7–8 ♥ (Janji Sebelum Turnamen Terakhir): — Meminta protagonis datang menonton turnamen musim panas terakhirnya sebagai siswi Kelas 12.",
      "9 ♥ (Batas Waktu Sebelum Kelulusan): — Mengungkapkan ketakutannya akan berpisah saat lulus nanti dan keinginannya untuk tetap bersama protagonis."
    ]
  },
  {
    "id": "li_wakaba_hinata",
    "slug": "wakaba_hinata",
    "name": "Wakaba Hinata (若葉 日向)",
    "furigana": "若葉 日向",
    "nickname": [
      "Hinata-senpai",
      "Wakaba-buchou",
      "Malaikat Ruang Tata Boga",
      "Hina-nee"
    ],
    "tagline": "Selamat datang di Ruang Tata Boga! Kebetulan sekali kue tar apel gelombang pertama baru saja matang dari oven~ Ayo masuk dulu, adik-adik Kelas 10! Cuci tangan kalian di wastafel sebelah sana ya, Kakak sudah siapkan teh hangat dan kue gratis untuk merayakan minggu pertama kalian di Housen Academy!",
    "grade": 12,
    "class_room": "12-2",
    "category_id": "class_3_2",
    "role": "Ketua Klub Memasak & Koordinator Kafe Sekolah",
    "club": "cooking",
    "club_role": "Ketua Klub Memasak (Senior Kelas 12)",
    "archetype": "normies",
    "social_class": "middle_class",
    "age": 17,
    "birthday": "12 Mei",
    "zodiac": "Taurus",
    "mbti": "ESFJ",
    "gender": "Female",
    "avatar_url": "/portraits/wakaba_hinata.png",
    "stats": {
      "physique": 11,
      "intelligent": 13,
      "looks": 16,
      "mind": 16,
      "talent": 16,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 16
    },
    "likes": [
      "Aroma roti dan kue tar apel yang baru keluar dari panggangan oven sore hari",
      "Melihat ekspresi bahagia orang yang mencicipi masakan buatannya",
      "Mempelajari bahasa isyarat sederhana agar bisa mengobrol nyaman dengan Shinohara Kotone",
      "Celemek dapur bermotif bunga matahari dan peralatan masak kayu yang rapi",
      "Seseorang yang mau mencicipi resep eksperimen barunya dengan jujur"
    ],
    "dislikes": [
      "Membuang-buang makanan yang masih layak dimakan",
      "Orang yang tidak mencuci tangan sebelum masuk ke area dapur bersih",
      "Perlakuan kasar atau pengucilan terhadap adik kelas yang pendiam",
      "Dapur klub yang sepi ketika satu per satu teman seangkatannya mulai sibuk ujian universitas"
    ],
    "personality": {
      "traits": "Hinata adalah kakak kelas paling hangat di angkatan Kelas 12-2. Sebagai Ketua Klub Memasak (sosok senior yang disebut langsung di dalam latar belakang Shinohara Kotone), Hinata memastikan ruang tata boga menjadi tempat yang ramah dan bebas perundungan bagi semua orang. Selama pekan pengenalan klub di bulan April, aroma kue panggang dari ruang klubnya menarik puluhan siswa baru yang kelelahan setelah mengikuti tes penempatan dan tur sekolah.",
      "flaws": "Hinata memiliki kecenderungan terlalu mengutamakan kebahagiaan orang lain di atas keinginannya sendiri (*people-pleaser*). Karena toko roti keluarganya sedang mengalami penurunan pelanggan akibat berdirinya jaringan waralaba modern, ia memikul beban pikiran untuk segera membantu ekonomi orang tuanya setelah lulus SMA—namun ia tidak pernah mengeluh sedikit pun di depan adik-adik kelasnya.",
      "dere_pattern": "Bertipe **Deredere / Wife-Material Senpai**. Bahasa cintanya tidak diragukan lagi adalah memasakkan makanan spesial dan memberikan perhatian tulus. Saat jatuh cinta pada protagonis, ia akan membuatkan porsi \"uji coba resep khusus\" setiap sore, namun mendadak gugup dan menutup wajahnya dengan sarung tangan oven ketika protagonis memuji bahwa Hinata akan menjadi pengantin terbaik di masa depan."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah lembut yang selalu dihiasi senyum menenangkan hingga membuat siapa pun merasa pulang ke rumah. Mata cokelat karamel hangat (*warm caramel-amber*), lesung pipit manis di kedua pipi saat tersenyum lebar, dan kulit bersih beraroma vanila manis.\n* **Rambut:** Rambut cokelat terang keemasan (*flaxen chestnut*) bergelombang lembut yang dikepang melingkar rapi atau diikat ke samping agar tidak jatuh saat memasak.\n* **Postur & Gestur:** Tubuh feminin yang lembut dan keibuan (162 cm). Suka menangkupkan kedua tangan di depan pipi saat senang dan secara refleks membersihkan remah kue di sudut bibir orang lain dengan saputangan bersih.\n* **Seragam & Gaya Berpakaian:** Seragam *serafuku* Housen Academy yang dilapisi kardigan rajut warna kuning mentega lembut, serta celemek putih berenda (*ruffled white apron*) saat berada di ruang klub memasak.\n* **Aksesori & Barang Bawaan:** Buku resep warisan toko roti keluarganya, kotak bento bertingkat yang dibungkus kain *furoshiki* motif bunga, serta plester luka tahan air di saku celemeknya.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 16,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Kakak Kelas Ramah",
          "description": "Menyambut protagonis dengan teh hangat dan kue panggang di pekan orientasi klub bulan April."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Pencicip Eksklusif",
          "description": "Selalu menyisihkan porsi kue terbaik di dalam kotak kecil khusus untuk dibawa pulang protagonis."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Salting Saat Dipuji",
          "description": "Wajahnya memerah hingga ke telinga saat protagonis menyuapinya balik untuk mencicipi rasa krim."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Bahu Tempat Bersandar",
          "description": "Mulai berani menceritakan kekhawatiran tentang toko roti keluarganya dan masa depan pasca-lulus kepada protagonis."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Resep Rahasia Terakhir",
          "description": "Mengajak protagonis memasak berdua di ruang tata boga yang sudah sepi menjelang sore Valentine."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Berjanji untuk terus membuatkan sarapan dan bekal hangat untuk protagonis bahkan setelah ia lulus dari Housen Academy."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Ekstrak Vanila Madagaskar Murni",
        "Cetakan Kue Berbentuk Hati",
        "Celemek Bordir Bunga Matahari",
        "Apel Fuji Segar Pilihan."
      ],
      "normal": [
        "Buku Resep Pastry Eropa",
        "Teh Darjeeling",
        "Sarung Tangan Oven Lucu",
        "Madu Murni."
      ],
      "disliked": [
        "Makanan yang dibuang sia-sia",
        "Peralatan dapur yang sengaja dikotori."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Kakak Kelas Ramah): — Menyambut protagonis dengan teh hangat dan kue panggang di pekan orientasi klub bulan April.",
      "3–4 ♥ (Pencicip Eksklusif): — Selalu menyisihkan porsi kue terbaik di dalam kotak kecil khusus untuk dibawa pulang protagonis.",
      "5–6 ♥ (Salting Saat Dipuji): — Wajahnya memerah hingga ke telinga saat protagonis menyuapinya balik untuk mencicipi rasa krim.",
      "7–8 ♥ (Bahu Tempat Bersandar): — Mulai berani menceritakan kekhawatiran tentang toko roti keluarganya dan masa depan pasca-lulus kepada protagonis.",
      "9 ♥ (Resep Rahasia Terakhir): — Mengajak protagonis memasak berdua di ruang tata boga yang sudah sepi menjelang sore Valentine."
    ]
  },
  {
    "id": "li_heinrich_vogel",
    "slug": "heinrich_vogel",
    "name": "Dr. Heinrich Vogel (ハインリヒ・フォーゲル)",
    "furigana": "ハインリヒ・フォーゲル",
    "nickname": [
      "Dr. Vogel",
      "Sensei Vogel",
      "Ilmuwan Gila",
      "Profesor Belerang"
    ],
    "tagline": "Wunderbar! Kenapa kalian memikirkan perkelahian jalanan primitif dengan otot, kalau sedikit campuran serbuk belerang dan kalium nitrat ini bisa menciptakan tirai asap tebal yang menutupi pelarian kalian dalam hitungan detik? Sains adalah seni penyelamatan sejati!",
    "grade": "Faculty",
    "class_room": "Faculty (Laboratorium Kimia Gedung Sains Lantai 2)",
    "category_id": "faculty",
    "role": "Guru Kimia & Pembimbing Kelompok Ilmiah Remaja (KIR)",
    "club": "science",
    "club_role": "Guru Pembimbing Kelompok Ilmiah Remaja (KIR)",
    "archetype": "faculty",
    "social_class": "middle_class",
    "age": 39,
    "birthday": "11 November",
    "zodiac": "Scorpio",
    "mbti": "INTP",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=heinrich_vogel",
    "stats": {
      "physique": 10,
      "intelligent": 18,
      "looks": 13,
      "mind": 16,
      "talent": 16,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 16
    },
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
    "personality": {
      "traits": "Eksentrik, cerdas luar biasa, bicara cepat dengan intonasi antusias, dan sangat menyukai eksperimen terapan. Ia melihat dunia sebagai reaksi kimia raksasa.",
      "flaws": "Sering mengabaikan protokol keamanan dasar demi melihat hasil reaksi kimia spektakuler.",
      "dere_pattern": "Tipe Mad Scientist Ally. Bersedia meracikkan bom asap kimia, flashbang sederhana, atau cairan pelarut karat gembok untuk membantu misi penyelamatan pemain."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah pria ekspatriat Jerman berusia 39 tahun yang tampan berkarakter, hidung mancung tajam, dan sepasang mata hijau hazel (*hazel-green eyes*) yang selalu menyala penuh gairah intelektual. Sering terlihat senyuman eksentrik yang sulit ditebak di sudut bibirnya.\n* **Rambut:** Rambut pirang jerami (*straw-blonde*) bergelombang acak-acakan yang agak panjang sebahu bawah telinga.\n* **Postur & Gestur:** Tinggi kurus semampai (181 cm), sering bergerak cepat dari satu meja lab ke meja lain, memegang tabung reaksi dengan gestur anggun.\n* **Seragam & Gaya Berpakaian:** Mengenakan jas laboratorium putih panjang (*white lab coat*) yang memiliki bekas noda kimia tipis di ujung saku, kemeja putih berlengan digulung, rompi rajut wol cokelat kotak-kotak (*tweed vest*), dasi hijau tua longgar, dan celana kain cokelat tua.\n* **Aksesori & Barang Bawaan:** Kacamata pelindung lab (*safety goggles*) berbingkai karet yang selalu terpasang di dahinya, pipet ukur di saku dada, dan buku catatan rumus bersampul kulit tua.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Reaksi kimia eksotermik yang menghasilkan percikan warna-warni dan ledakan kecil"
      ],
      "normal": [
        "Siswa yang memiliki rasa penasaran sains tanpa takut kotor"
      ],
      "disliked": [
        "Regulasi pemesanan bahan reagen kimia yang birokratis dari wakasek"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_gonda_gennosuke",
    "slug": "gonda_gennosuke",
    "name": "Gonda Gennosuke (権田 源之助)",
    "furigana": "権田 源之助",
    "nickname": [
      "Pak Gonda",
      "Gonda-san",
      "Paman Satpam",
      "Beruang Gerbang"
    ],
    "tagline": "Anak-anak... kalau kalian mau keluar lewat pintu belakang, jangan sampai ketahuan Pak Kurosaki ya. Ini bapak bawain taiyaki hangat dua biji. Jaga diri kalian baik-baik di jalanan luar, dan pastikan kalian pulang utuh sebelum matahari tenggelam!",
    "grade": "Faculty",
    "class_room": "Faculty (Pos Keamanan Gerbang Sakura)",
    "category_id": "faculty",
    "role": "Kepala Petugas Keamanan Gerbang Utama Housen",
    "club": "outdoor",
    "club_role": "Kepala Petugas Keamanan Sekolah",
    "archetype": "faculty",
    "social_class": "worker",
    "age": 52,
    "birthday": "10 Juni",
    "zodiac": "Gemini",
    "mbti": "ISFJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=gonda_gennosuke",
    "stats": {
      "physique": 16,
      "intelligent": 11,
      "looks": 11,
      "mind": 15,
      "talent": 12,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 18,
      "composure_max": 16
    },
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
    "personality": {
      "traits": "Sangat ramah, protektif, pemaaf, dan tahu seluk-beluk jam kabur seluruh murid nakal. Ia adalah benteng pertama yang melindungi Housen dari ancaman dunia luar.",
      "flaws": "Sering tidak tega menghukum murid dan mudah disogok dengan cemilan manis atau sapaan hangat.",
      "dere_pattern": "Tipe Kind Uncle / Guardian Mentor. Membukakan gerbang belakang sekolah secara rahasia, memberikan alibi aman jika murid terlambat kembali dari misi."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah bundar kebapakan berusia 52 tahun dengan kulit kecokelatan terpapar matahari, kerutan tawa hangat di sudut mata (*kind laugh lines*), dan kumis tebal abu-abu keperakan (*thick grey walrus mustache*) yang ramah.\n* **Rambut:** Rambut hitam berseling uban pendek dipotong rapi tertutup topi seragam.\n* **Postur & Gestur:** Bertubuh tinggi besar gempal bak beruang ramah (183 cm, 92 kg). Langkahnya tenang dan mantap, memancarkan rasa aman bagi seluruh murid.\n* **Seragam & Gaya Berpakaian:** Mengenakan seragam petugas keamanan resmi Housen berwarna biru tua (*navy security uniform*) lengkap dengan tanda pangkat emas di pundak, dasi hitam, ikat pinggang kulit hitam tebal, dan topi pet satpam biru tua yang sering dimiringkan santai.\n* **Aksesori & Barang Bawaan:** Ring kunci master gerbang sekolah kuningan tebal, senter patroli berat, radio genggam walkie-talkie di pundak, dan bungkus kantong kertas cokelat berisi kue hangat.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Menyesap teh hijau hangat dari termos tua di pos gerbang"
      ],
      "normal": [
        "Menyapa murid yang datang pagi dengan senyuman hangat"
      ],
      "disliked": [
        "Preman luar sekolah yang nongkrong mengganggu siswi di dekat halte bus"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_hasumi_chihiro",
    "slug": "hasumi_chihiro",
    "name": "Hasumi Chihiro (蓮見 千尋)",
    "furigana": "蓮見 千尋",
    "nickname": [
      "Chihiro-sensei",
      "Sensei",
      "Hasumi-sensei",
      "Wali Kelas Gloomy"
    ],
    "tagline": "Haaah... hidup ini isinya cuma bangun pagi, ngadepin tumpukan kertas ujian yang jawabannya bikin migrain, dengerin khotbah kepala sekolah, terus tidur lagi... Buka buku halaman 56, rangkum sendiri sampai bel pulang bunyi. Ibu mau tidur 15 menit di meja guru. Jangan ada yang berantem, ibu capek banget hari ini.",
    "grade": "Faculty",
    "class_room": "10-1 (Wali Kelas) & Ruang Guru (Staff Room)",
    "category_id": "faculty",
    "role": "Wali Kelas 10-1 & Guru Sastra Jepang",
    "club": "literature",
    "club_role": "Guru Pembina (Faculty Advisor)",
    "archetype": "faculty",
    "social_class": "worker",
    "age": 26,
    "birthday": "13 November",
    "zodiac": "Scorpio",
    "mbti": "INTP",
    "gender": "Female",
    "avatar_url": "/portraits/hasumi_chihiro.png",
    "stats": {
      "physique": 10,
      "intelligent": 16,
      "looks": 15,
      "mind": 14,
      "talent": 13,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 14
    },
    "likes": [
      "Rokok filter aroma cengkih tipis di belakang gedung olahraga tua",
      "Kopi kaleng hitam tanpa gula & bir kaleng dingin sepulang mengajar",
      "Jam mengajar yang selesai 10 menit lebih cepat agar bisa rebahan",
      "Murid yang mandiri, tidak banyak drama, & tidak menambah tumpukan revisi esai",
      "Bantuan membawakan tumpukan kertas ujian & dipijat pundaknya yang pegal",
      "Kucing kampung belang tiga gembul peliharaannya di apartemen (Kitikiti Patuti) & foto-foto cakar empuknya"
    ],
    "dislikes": [
      "Rapat dewan guru mendadak di hari Jumat sore yang bertele-tele",
      "Tumpukan kertas administrasi kementerian yang formatnya ribet",
      "Guru senior kolot yang suka menceramahi gaya mengajarnya yang santai",
      "Pertanyaan kepo dari orang lain soal kapan dia berniat menikah"
    ],
    "personality": {
      "traits": "*Sinis, santai, realistis, pemalas terstruktur, dan tidak munafik.* Chihiro adalah tipe guru yang paling dibenci oleh kepala sekolah yang perfeksionis, namun diam-diam paling dicintai oleh murid-murid bermasalah. Ia benci formalitas birokrasi, tidak suka menceramahi dengan kata-kata motivasi klise, dan selalu ingin jam pelajaran selesai secepat mungkin agar bisa pulang ke apartemennya untuk rebahan sambil menikmati bir kaleng dingin.",
      "flaws": "",
      "dere_pattern": "*Tipe Dominan: Exhausted Cynical Kuudere yang Luluh Menjadi Wanita Lembut yang Manja.*  \n* **Fase Awal (Guru Pemalas & Mengabaikan):** Menganggap protagonis hanya sebagai murid usil yang senang mengganggunya merokok (*\"Heh bocah, lu ga ada kerjaan ya nongkrong di sini? Pergi sana sebelum ibu kasih lu tugas bikin esai 5000 kata\"*).\n* **Pemicu Keruntuhan Cangkang (Adult Vulnerability):** Ketika protagonis tidak memandangnya sebagai \"guru yang harus sempurna\", melainkan sebagai wanita yang kelelahan dan butuh disayangi—misalnya membantunya mengoreksi lembar jawaban hingga larut malam, membelikan minuman hangat saat tangannya kedinginan, atau merawatnya saat ia tertidur kelelahan di meja ruang guru.\n* **Konflik Moral & Detak Jantung:** Chihiro mulai panik saat menyadari jantungnya berdegup kencang tiap kali protagonis menatap matanya dari dekat. Ia berusaha menarik garis batas: *\"Bocah... jangan natap ibu kayak gitu. Ibu ini gurumu lho. Jangan bikin orang dewasa kayak ibu merasa salah tingkah...\"*\n* **Fase Dere (Late Progression):** Begitu perasaannya tak terbendung lagi, dinding ketegarannya runtuh menjadi pesona wanita dewasa yang luar biasa rapuh dan manja. Di ruang arsip atau di tangga darurat saat sekolah sudah sepi, ia akan menyandarkan kepalanya di dada protagonis, membiarkan jemarinya digenggam, dan berbisik lirih meminta sang protagonis menunggunya sampai hari kelulusan tiba agar mereka bisa bersama secara bebas."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wanita muda berusia 26 tahun dengan pesona kedewasaan yang memesona namun dibalut aura kelelahan kronis (*alluring tired adult beauty*). Kulitnya putih bersih dengan kantung mata tipis samar (*subtle dark circles*) akibat begadang mengoreksi ratusan esai murid. Matanya yang sayu berwarna abu-abu gelap keunguan (*tired deep espresso / charcoal eyes*) memancarkan tatapan lesu namun penuh kecerdasan analitis yang tajam.\n* **Bibir & Rokok:** Bibir tipis dengan warna merah muda alami tanpa pulasan lipstik tebal, sering mengapit sebatang rokok filter tipis yang mengepulkan asap kelabu lembut saat ia sedang sembunyi menyendiri di sudut belakang sekolah.\n* **Rambut:** Rambut hitam kecokelatan berantakan alami (*messy dark espresso hair*) sebahu bawah, biasanya dicepol longgar asal-asalan (*messy low bun*) dengan sebatang pulpen merah koreksi yang menusuk sanggulnya sebagai tusuk konde darurat. Beberapa helai anak rambut jatuh santai membingkai leher jenjang dan pipinya.\n* **Pakaian Kerja Guru:** Mengenakan kemeja putih bergaris tipis yang dua kancing atasnya sengaja dibuka santai, dilapisi jas lab putih kusut (*rumpled lab coat*) atau kardigan rajut panjang warna kopi susu yang longgar. Celana panjang bahan katun abu-abu ramping memperlihatkan kaki jenjangnya, dipadukan dengan sandal selop santai kulit hitam di dalam area gedung sekolah karena ia benci memakai sepatu hak tinggi.\n* **Aksesori & Barang Bawaan:** Kotak rokok filter dan pemantik api logam perak di saku jas lab, cangkir mug keramik retak bertuliskan *\"Don't Talk To Me Before Coffee\"*, setumpuk map merah kertas ujian murid kelas 10-1 yang ia dekap di dadanya, serta kunci ruang arsip lama yang ia jadikan tempat istirahat rahasia.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1 ♥",
          "minHearts": 1,
          "maxHearts": 1,
          "title": "Tired Teacher & Nosy Student",
          "description": "Mengancam akan memberi nilai D jika protagonis membocorkan rahasia merokoknya. (**Event 1:** Tertangkap basah merokok di balik semak gedung olahraga lama.)"
        },
        {
          "range": "2 ♥",
          "minHearts": 2,
          "maxHearts": 2,
          "title": "Reluctant Helper",
          "description": "Menyuruh protagonis membantu membawa map ujian tebal ke ruang guru; mentraktir susu kotak. (**Event 2:** Lembur berdua mengecap stempel lembar soal di ruang guru yang sepi.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Secret Smoking Buddy",
          "description": "Membiarkan protagonis duduk di sampingnya saat ia merokok; mulai curhat soal kekesalannya pada kepala sekolah. (**Event 3:** Hujan sore di tangga darurat, berbagi satu kaleng kopi hangat.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "The Vulnerable Nap",
          "description": "Tertidur pulas di meja ruang kelas yang kosong; protagonis menyelimutinya dengan jaket. (**Event 4:** Momen terbangun saat senja dan menyadari kehangatan jaket protagonis.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "Sensei's Fluster",
          "description": "Protagonist memegang tangannya yang dingin atau memijat pundaknya; Chihiro panik dan salah tingkah. (**Event 5:** Terjebak berdua di ruang arsip dokumen saat pintu terkunci otomatis.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Adult Denial",
          "description": "Mencoba menjaga jarak dan bersikap formal: *\"Ibu ini gurumu, jangan bercanda soal perasaan.\"* (**Event 6:** Percakapan emosional di atap sekolah saat matahari terbenam.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "The Broken Dam",
          "description": "Mengakui bahwa keberadaan protagonis adalah satu-satunya hal yang ia tunggu setiap pagi. (**Event 7:** Protagonist mengantarnya pulang ke depan pintu apartemennya saat ia demam kelelahan.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Secret Rendezvous",
          "description": "Kencan rahasia di luar kota saat akhir pekan tanpa mengenakan atribut sekolah; Chihiro berdandan feminin anggun. (**Event 8:** Berjalan berdua di tepi danau luar kota mengenakan pakaian kasual wanita dewasa.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "The Sacred Promise",
          "description": "Menangis lembut di pelukan protagonis; berjanji akan menjaga cinta rahasia ini hingga kelulusan tiba. (**Event 9:** Pertemuan larut malam di ruang kelas 10-1 yang gelap gulita di bawah cahaya bulan.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Eternal Partner / After Graduation Oath",
          "description": "Menjadi kekasih jiwa sejati; bertukar cincin rahasia yang ia kenakan sebagai kalung di balik seragamnya. (**Event 10 (Confession):** Momen penembakan di ruang kelas kosong saat upacara kelulusan usai.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Kopi bubuk drip artisan premium aroma moka/hazelnut"
      ],
      "normal": [
        "Kopi kaleng hitam dingin dari mesin otomatis kantin"
      ],
      "disliked": [
        "Buku panduan motivasi sukses klise yang sok menggurui"
      ]
    },
    "date_spots": [
      "Tangga Darurat Belakang Sekolah (Saat Jam Istirahat): — Tempat persembunyian rahasia untuk menikmati angin sepoi-sepoi dan berbagi kopi kaleng berdua.",
      "Ruang Arsip Dokumen Sekolah (Sore Hari): — Ruangan tenang ber-AC dengan bau kertas tua yang khas, tempat paling aman untuk mengunci pintu dan berpelukan mesra.",
      "Kedai Izakaya Tenang / Ramen Bar Pinggir Kota (Malam Akhir Pekan): — Menikmati semangkuk mi hangat dan melihat sisi santai Chihiro yang minum bir dingin tanpa jubah guru.",
      "Apartemen Studio Chihiro (Privat): — Tempat paling intim di mana ia melepaskan sanggul rambutnya, mengenakan kaos santai kebesaran, dan memasak sup rumahan sederhana berdua."
    ]
  },
  {
    "id": "li_kashisaka_seichi",
    "slug": "kashisaka_seichi",
    "name": "Kashisaka Seichi (樫坂 征一)",
    "furigana": "樫坂 征一",
    "nickname": [
      "Pak Seichi",
      "Kashisaka-sensei",
      "Pelatih Tinju",
      "Banteng Gymnasium"
    ],
    "tagline": "Tangan lu dikasih tuhan buat melindungi kawan dan membimbing yang lemah, bukan buat mukul orang di gang sempit! Pasang sarung tinju lu, masuk ke ring. Kalau lu bisa tahan tiga ronde lawan bapak, baru bapak dengerin alasan lu bolos!",
    "grade": "Faculty",
    "class_room": "Faculty (Gymnasium & Ruang Olahraga)",
    "category_id": "faculty",
    "role": "Guru Pendidikan Jasmani & Pelatih Tinju Housen",
    "club": "sports",
    "club_role": "Guru Pembina Olahraga & Pelatih Tinju",
    "archetype": "faculty",
    "social_class": "worker",
    "age": 34,
    "birthday": "28 Juli",
    "zodiac": "Leo",
    "mbti": "ESTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kashisaka_seichi",
    "stats": {
      "physique": 18,
      "intelligent": 12,
      "looks": 14,
      "mind": 16,
      "talent": 13,
      "luck": 11
    },
    "vitals": {
      "physical_hp_max": 20,
      "composure_max": 16
    },
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
    "personality": {
      "traits": "Tegas, bersuara menggelegar, namun memiliki hati yang sangat hangat dan kebapakan. Bagi Seichi, tidak ada anak nakal yang tidak bisa diselamatkan; ring tinju adalah tempatnya mendidik jiwa mereka.",
      "flaws": "Kurang peka terhadap intrik politik yayasan dan sering bertindak mendahului izin kepala sekolah jika menyangkut keselamatan muridnya.",
      "dere_pattern": "Tipe Tough-Love Coach Mentor. Membelikan makan siang bergizi bagi murid yang kelelahan, memuji perkembangan teknik fisik dengan tepukan pundak yang mantap."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah maskulin tampan berusia 34 tahun dengan tulang pipi tegas, dagu berbelah tipis, dan alis tebal berkarakter. Sepasang matanya berwarna cokelat tua hangat (*warm rugged brown eyes*) yang bisa berubah menjadi tatapan elang petarung saat melangkah ke matras.\n* **Rambut:** Rambut hitam pekat berpotongan *crew-cut* rapi dan maskulin.\n* **Postur & Gestur:** Bertubuh kekar seperti banteng tempur dengan bahu bidang dan dada tebal (185 cm, 86 kg). Sering berdiri tegap bersedekap dengan peluit perak tergantung di dada.\n* **Seragam & Gaya Berpakaian:** Mengenakan setelan jaket training olahraga Housen berwarna merah marun dan putih dengan ritsleting terbuka sedikit, kaos polo putih berkerah, celana training hitam sporty, dan sepatu lari ASICS tebal.\n* **Aksesori & Barang Bawaan:** Peluit perak bertali merah di leher, stopwatch digital di pergelangan tangan kiri, handuk putih kecil di pundak, dan plester olahraga di buku jemari tangannya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Suara samsak tinju yang berdentum keras terkena pukulan bersih"
      ],
      "normal": [
        "Dada ayam rebus",
        "nasi mangkuk besar",
        "dan susu kedelai dingin"
      ],
      "disliked": [
        "Pengecut yang memukul orang lain dari belakang"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_kujou_reiko",
    "slug": "kujou_reiko",
    "name": "Kujou Reiko (九条 麗子)",
    "furigana": "九条 麗子",
    "nickname": [
      "Kujou-kouchou",
      "Ibu Kepala Sekolah",
      "Reiko-san",
      "Kouchou-sensei"
    ],
    "tagline": "Selamat pagi seluruh murid Housen Academy yang saya banggakan. Jadilah pribadi berbudi luhur, berprestasi, dan menjunjung tinggi kehormatan nama baik sekolah... (Pintu kantor tertutup rapat — BRUKK! Melepas sepatu heels dan teriak heboh)... YAAASHHH! Akhirnya pidato kram mulut itu kelar juga! Hei kamu, bocah yang barusan masuk, cepet tutup gordennya! Bantuin saya pencet tombol roll gacha 10-pull sekarang, kalau saya ga dapet karakter SSR ini, sekolah saya liburin tiga hari!",
    "grade": "Faculty",
    "class_room": "Ruang Kepala Sekolah (Principal's Office / Lantai 3 VIP)",
    "category_id": "osis",
    "role": "Kepala Sekolah Housen Academy",
    "club": "student_council",
    "club_role": "Kepala Sekolah & Pembina Eksekutif Tertinggi",
    "archetype": "faculty",
    "social_class": "old_money",
    "age": 29,
    "birthday": "1 Januari",
    "zodiac": "Capricorn",
    "mbti": "ENTJ",
    "gender": "Female",
    "avatar_url": "/portraits/kujou_reiko.png",
    "stats": {
      "physique": 11,
      "intelligent": 17,
      "looks": 17,
      "mind": 15,
      "talent": 16,
      "luck": 14
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 15
    },
    "likes": [
      "Menang gacha rate-up karakter SSR di ponselnya (suka teriak heboh sendiri)",
      "Camilan keripik kentang pedas & mie instan cup rahasia di laci meja mahoninya",
      "Mengintip drama romansa murid-murid dari jendela kantornya menggunakan teropong",
      "Membuat kebijakan sekolah nyeleneh dengan dalih 'Eksperimen Masa Muda'",
      "Seseorang yang berani memperlakukannya sebagai wanita biasa tanpa rasa takut"
    ],
    "dislikes": [
      "Rapat dewan yayasan keluarga yang membosankan dan penuh orang tua cerewet",
      "Kalah banner gacha atau dapet duplikat ampas berturut-turut",
      "Sepatu hak tinggi (heels) yang bikin telapak kakinya pegal seharian",
      "Kopi pahit tanpa gula (selalu diam-diam menambahkan sirup karamel)"
    ],
    "personality": {
      "traits": "",
      "flaws": "",
      "dere_pattern": "*Tipe Dominan: The Supreme Flustered Empress (Dari Bos Otoriter Menjadi Gadis Manja yang Butuh Diarahkan).*  \n* **Fase Awal (Tertangkap Basah & Kerja Sama Rahasia):** Sang protagonis tanpa sengaja memergokinya sedang merengek kalah gacha sambil makan mie instan di lantai ruang kepala sekolah. Panik rahasianya bocor, Reiko langsung mengangkat protagonis menjadi *\"Sekretaris Khusus Kepala Sekolah\"* dan menyuapnya dengan fasilitas istimewa demi tutup mulut.\n* **Partner-in-Crime:** Protagonist menjadi satu-satunya orang di dunia yang melihat sisi \"Reiko yang asli\". Protagonist sering menjadi penasihat akal sehat yang menahan ide-ide gilanya, membantunya memijat pundaknya yang tegang, dan membelikan camilan favoritnya.\n* **Kerentanan Wanita Dewasa:** Di balik segala kekayaan dan jabatannya, Reiko sangat kesepian. Semua orang hanya melihatnya sebagai \"Ibu Kepala Sekolah\" atau \"Nona Besar Kujou\", tidak ada yang melihatnya sebagai seorang wanita biasa yang mendambakan pelukan tulus tanpa motif politik.\n* **Fase Dere (Late Progression):** Di depan protagonis, Reiko sepenuhnya melepaskan mahkota kepemimpinannya. Ia menjadi sangat manja, suka merangkul lengan sang protagonis dari belakang kursinya, menyandarkan kepalanya di bahu protagonis, dan menggunakan kekuasaan sekolahnya secara terang-terangan untuk melindungi kekasih mudanya dari bahaya apa pun."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wanita dewasa berusia 29 tahun dengan pesona ratu aristokrat yang sangat memukau dan awet muda (*stunning mature regal beauty*). Kulitnya putih porselen mulus terawat tanpa cela. Wajahnya memiliki garis kecantikan bangsawan klasik: mata almond yang memikat dan tajam bernuansa merah anggur tua (*deep wine-burgundy eyes*), hidung mancung anggun, bibir merah delima yang memikat, serta tahi lalat anggun di sudut bibir kanan bawah.\n* **Kacamata Berantai Emas:** Sering mengenakan kacamata berbingkai tipis emas elegan dengan rantai perhiasan halus menjuntai di sisi telinganya, memberikan kesan kepala sekolah yang cerdas, tegas, dan berwibawa tinggi.\n* **Rambut:** Rambut panjang bergelombang mewah (*luxurious wavy voluminous hair*) berwarna hitam obsidian kebiruan berkilau (*midnight sapphire-black*). Saat acara resmi ditata sanggul elegan setengah tergerai (*half-up regal chignon*), namun saat pintu kantornya terkunci ia sering melepaskan jepitnya hingga rambut indahnya tergerai bebas melewati punggungnya.\n* **Busana Kerja Eksekutif:** Mengenakan setelan jas wanita bisnis mewah pesanan khusus (*tailored navy/burgundy velvet power suit*) dengan rompi pas badan, kemeja sutra putih berkerah ruffle atau dasi pita sutra hitam anggun, dan rok pensil selutut berbelahan sopan yang memperlihatkan kaki jenjang berbalut stoking hitam tipis transparan serta sepatu hak tinggi (*stiletto pumps*) mengilap.\n* **Sisi Nyeleneh di Ruang Kantor:** Begitu pintu kantor terkunci, sepatu hak tingginya langsung dilempar ke sudut ruangan dan ia berkeliling di karpet beludru hanya dengan **kaos kaki putih bermotif telapak cakar kucing** (*cat paw socks*) yang kontras 180 derajat dengan pakaian eksekutif mewahnya!",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 19,
      "milestones": [
        {
          "range": "1 ♥",
          "minHearts": 1,
          "maxHearts": 1,
          "title": "The Sovereign & The Witness",
          "description": "Berwibawa di depan murid lain; mengancam protagonis dengan senyuman manis berbahaya agar rahasianya aman. (**Event 1:** Tertangkap basah teriak kalah gacha di ruang kepala sekolah.)"
        },
        {
          "range": "2 ♥",
          "minHearts": 2,
          "maxHearts": 2,
          "title": "Co-Conspirators",
          "description": "Mengangkat protagonis jadi asisten rahasia; menyuruh menyelundupkan keripik kentang ke ruangannya. (**Event 2:** Misi rahasia membeli camilan minimarket tanpa ketahuan guru piket.)"
        },
        {
          "range": "3 ♥",
          "minHearts": 3,
          "maxHearts": 3,
          "title": "Unhinged Policy Maker",
          "description": "Berdiskusi berdua soal ide-ide event sekolah ngaco; tertawa lepas tanpa jaim di sofa kantor. (**Event 3:** Sesi makan mie cup berdua di karpet lantai ruang kepala sekolah saat malam.)"
        },
        {
          "range": "4 ♥",
          "minHearts": 4,
          "maxHearts": 4,
          "title": "The Slipping Mask",
          "description": "Melepaskan kacamata dan sepatu heels di depan protagonis; mengeluh manja soal sakit pinggang dan minta ditemani. (**Event 4:** Protagonist membantunya memijat pundaknya yang kaku hingga Reiko tersipu parah.)"
        },
        {
          "range": "5 ♥",
          "minHearts": 5,
          "maxHearts": 5,
          "title": "Jealous Empress",
          "description": "Menggunakan wewenangnya memanggil protagonis ke kantor hanya karena melihatnya akrab dengan siswi lain. (**Event 5:** \"Panggilan Khusus Kepala Sekolah\" yang ternyata cuma interogasi cemburu manis.)"
        },
        {
          "range": "6 ♥",
          "minHearts": 6,
          "maxHearts": 6,
          "title": "Vulnerable Nobility",
          "description": "Menangis pelan di pelukan protagonis saat ditekan oleh dewan yayasan keluarga; menunjukkan sisi rapuhnya. (**Event 6:** Hujan badai larut malam di ruang kepala sekolah yang remang-remang.)"
        },
        {
          "range": "7 ♥",
          "minHearts": 7,
          "maxHearts": 7,
          "title": "Secret Date Outside",
          "description": "Menyamar dengan topi baret dan pakaian modis santai untuk kencan jalan-jalan berdua di luar kota. (**Event 7:** Kencan rahasia ke pusat arcade game & photo booth di Akihabara.)"
        },
        {
          "range": "8 ♥",
          "minHearts": 8,
          "maxHearts": 8,
          "title": "Absolute Devotion",
          "description": "Membela protagonis di depan dewan guru secara membabi buta; terang-terangan memanjakan protagonis di kantornya. (**Event 8:** Duduk di pangkuan protagonis di kursi kerja mahoninya dengan tirai tertutup rapat.)"
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "The Royal Defiance",
          "description": "Menyatakan siap melepaskan kursi kepala sekolah dan warisan klan Kujou jika keluarganya menentang hubungan mereka. (**Event 9:** Percakapan emosional di atap menara jam sekolah saat malam hari.)"
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Queen's Eternal Surrender",
          "description": "Menjadi kekasih jiwa sejati; menyerahkan kunci kantor dan seluruh hatinya pada sang protagonis seumur hidup. (**Event 10 (Confession):** Momen penembakan di ruang kepala sekolah di bawah gemerlap kembang api festival.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Kartu voucher Google Play / Apple Gift Card untuk top-up game gacha (reaksinya bakal histeris lompat-lompat girang!)"
      ],
      "normal": [
        "Teh Earl Grey premium kalengan"
      ],
      "disliked": [
        "Buku laporan anggaran keuangan yayasan yang tebal"
      ]
    },
    "date_spots": [
      "Ruang Kepala Sekolah (Tirai Tertutup & Pintu Terkunci): — Tempat kencan paling mewah dan privat di seluruh sekolah; duduk berdua di sofa beludru sambil nonton anime dan makan mie cup.",
      "Game Center & Akihabara (Menyamar Tanpa Jas): — Mengajaknya bermain mesin capit boneka dan mencoba game arcade ritme; Reiko akan tertawa lepas seperti gadis remaja biasa.",
      "Puncak Menara Jam Sekolah (Malam Hari): — Menatap hamparan lampu kota dari tempat tertinggi di Housen Academy sambil menikmati angin sepoi-sepoi berdua.",
      "Vila Pribadi Keluarga Kujou di Tepi Danau: — Liburan akhir pekan rahasia berdua di vila megah yang tenang tanpa ada satu pun orang yang mengganggu."
    ]
  },
  {
    "id": "li_kurosaki_jin",
    "slug": "kurosaki_jin",
    "name": "Kurosaki Jin (黒崎 刃)",
    "furigana": "黒崎 刃",
    "nickname": [
      "Pak Kurosaki",
      "Wakasek Kesiswaan",
      "Pedang Hitam Disiplin",
      "Tuan Pinstripe"
    ],
    "tagline": "Housen Academy berdiri di atas kehormatan dan tradisi seratus tahun. Selama saya menjabat sebagai Wakil Kepala Sekolah, tidak ada satu pun berandal jalanan atau murid pembangkang yang diizinkan merusak nama suci yayasan ini!",
    "grade": "Faculty",
    "class_room": "Faculty (Kantor Kesiswaan Lantai 3)",
    "category_id": "faculty",
    "role": "Wakil Kepala Sekolah Bidang Kesiswaan & Kedisiplinan",
    "club": "student_council",
    "club_role": "Penasihat Dewan Kesiswaan & Pengawas Yayasan",
    "archetype": "faculty",
    "social_class": "elite",
    "age": 45,
    "birthday": "3 September",
    "zodiac": "Virgo",
    "mbti": "ESTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kurosaki_jin",
    "stats": {
      "physique": 12,
      "intelligent": 17,
      "looks": 14,
      "mind": 17,
      "talent": 13,
      "luck": 10
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 18
    },
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
    "personality": {
      "traits": "Birokratik, sangat dingin, perfeksionis, dan tidak kenal kompromi. Namun di balik kekakuannya, motivasinya murni untuk melindungi masa depan karir para murid agar tidak hancur oleh catatan kriminal kepolisian.",
      "flaws": "Sering gagal memahami sisi psikologis remaja dan terlalu memprioritaskan citra yayasan di atas perasaan individu.",
      "dere_pattern": "Tipe Strict Authority to Reluctant Ally. Jika pemain membuktikan integritasnya dengan menyelesaikan krisis Touki tanpa mencemari nama sekolah, Kurosaki akan menutup mata atas pelanggaran prosedur dan diam-diam membantu secara legal."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tirus tegas dengan rahang persegi kaku, tatapan mata abu-abu baja dingin (*steel-grey eyes*) di balik kacamata persegi tanpa bingkai (*rimless rectangular glasses*) yang selalu memantulkan cahaya lampu kantor secara tajam.\n* **Rambut:** Rambut hitam lurus disisir klimis ke belakang (*slicked-back raven hair*) dengan sentuhan uban perak terhormat di bagian kedua pelipisnya.\n* **Postur & Gestur:** Tinggi tegak (179 cm), postur kaku seperti perwira militer, selalu memegang map inspeksi kulit hitam atau tongkat kayu penunjuk disiplin kecil.\n* **Seragam & Gaya Berpakaian:** Setelan jas formal tiga potong (*three-piece suit*) berwarna abu-abu arang bergaris pinstripe halus, dasi sutra merah marun gelap yang diikat simpul Windsor sempurna, dan sepatu oxford kulit hitam mengilap tanpa debu.\n* **Aksesori & Barang Bawaan:** Kacamata rimless anti-pantulan, pena montblanc emas hitam, dan buku pedoman sanksi kedisiplinan kementerian.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Ketepatan waktu hingga satuan detik dan kepatuhan mutlak pada regulasi"
      ],
      "normal": [
        "Kopi espresso hitam pekat tanpa gula"
      ],
      "disliked": [
        "Tawuran jalanan yang mencemari reputasi dan akreditasi sekolah"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_moriyama_daisuke",
    "slug": "moriyama_daisuke",
    "name": "Moriyama Daisuke (森山 大輔)",
    "furigana": "森山 大輔",
    "nickname": [
      "Pak Moriyama",
      "Moriyama-sensei",
      "Konselor Lembut",
      "Penyembuh Jiwa"
    ],
    "tagline": "Terkadang yang kamu butuhkan bukan nasihat moral, melainkan satu tempat aman di mana kamu boleh menangis tanpa takut dihakimi. Duduklah di sofa ini, minumlah teh hangat ini, dan ceritakan semuanya.",
    "grade": "Faculty",
    "class_room": "Faculty (Ruang BK Gedung Utama Lantai 2)",
    "category_id": "faculty",
    "role": "Guru Bimbingan Konseling & Psikologi Sekolah",
    "club": "literature",
    "club_role": "Konselor Kesehatan Mental & Konseling Remaja",
    "archetype": "faculty",
    "social_class": "middle_class",
    "age": 29,
    "birthday": "17 April",
    "zodiac": "Aries",
    "mbti": "INFJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=moriyama_daisuke",
    "stats": {
      "physique": 10,
      "intelligent": 15,
      "looks": 15,
      "mind": 17,
      "talent": 14,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 18
    },
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
    "personality": {
      "traits": "Sangat empatik, pendengar yang luar biasa bijak, tidak pernah menghakimi, dan memegang teguh kerahasiaan konseling murid.",
      "flaws": "Sering menyerap energi kesedihan orang lain secara berlebihan hingga kelelahan mental sendiri saat akhir pekan.",
      "dere_pattern": "Tipe Gentle Counselor Dere. Membantu memulihkan poin Composure pemain secara instan lewat sesi konseling privat yang hangat."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tampan berkarakter lembut menenangkan, kulit bersih terawat, dan sepasang mata hangat berwarna cokelat madu lembut (*gentle honey-brown eyes*) di balik kacamata kawat perak bulat tipis (*thin silver round wireframe glasses*).\n* **Rambut:** Rambut cokelat kastanye (*chestnut brown*) ikal bergelombang lembut alami sebahu atas yang ditata rapi namun santai.\n* **Postur & Gestur:** Ramping dan elegan (176 cm), gestur tubuhnya sangat terbuka, bertutur kata dengan nada suara lembut bariton yang mampu meredakan kecemasan.\n* **Seragam & Gaya Berpakaian:** Mengenakan kardigan rajut berkancing wol berwarna krem lembut (*cozy beige cardigan*) di atas kemeja biru muda pastel tanpa dasi, celana katun abu-abu terang, dan sepatu santai kulit cokelat.\n* **Aksesori & Barang Bawaan:** Kacamata bulat perak, cangkir keramik teh herbal, buku catatan psikologi bergaris halus, dan bantal sofa empuk penenang stres di ruang kerjanya.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Menyeduh teh chamomile hangat dengan tetesan madu liar"
      ],
      "normal": [
        "Musik instrumen piano lo-fi yang menenangkan di ruang konseling"
      ],
      "disliked": [
        "Orang tua yang memaksakan mimpi masa mudanya ke pundak anak"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_saionji_kaede",
    "slug": "saionji_kaede",
    "name": "Saionji Kaede (西園寺 楓)",
    "furigana": "西園寺 楓",
    "nickname": [
      "Kaede-sensei",
      "Saionji-sensei",
      "Nee-san Lapangan",
      "Coach Kaede"
    ],
    "tagline": "PRIIITTT!! Ayo baris yang rapi, anak-anak Kelas 10! Punggung tegak, jangan loyo kayak wali kelas kalian si Chihiro yang udah ngorok di ruang guru! Nama Ibu Saionji Kaede, panggil aja Kaede-sensei! Selama masa orientasi dan jam olahraga, Ibu yang bakal pastiin fisik dan mental kalian siap naklukin SMA ini! Siapa yang lari pemanasannya paling semangat, Ibu traktir minuman dingin di mesin penjual otomatis!",
    "grade": "Faculty",
    "class_room": "10-2 (Wali Kelas) & Kantor Guru Olahraga (Gymnasium Office)",
    "category_id": "faculty",
    "role": "Guru Pendidikan Jasmani, Wali Kelas 10-2 & Koordinator Orientasi",
    "club": "sports",
    "club_role": "Guru Pembina Klub Olahraga & Koordinator Fisik Sekolah",
    "archetype": "faculty",
    "social_class": "middle_class",
    "age": 25,
    "birthday": "4 Agustus",
    "zodiac": "Leo",
    "mbti": "ESTP",
    "gender": "Female",
    "avatar_url": "/portraits/saionji_kaede.png",
    "stats": {
      "physique": 17,
      "intelligent": 12,
      "looks": 15,
      "mind": 14,
      "talent": 15,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 14,
      "composure_max": 14
    },
    "likes": [
      "Lari pagi mengelilingi lapangan sekolah sambil menghirup udara segar",
      "Minuman isotonik dingin & bento daging panggang porsi jumbo",
      "Murid yang pantang menyerah meski kalah bakat fisik",
      "Menyeret Hasumi Chihiro-sensei keluar dari kolong meja guru supaya kena sinar matahari",
      "Pujian tulus saat dia sesekali mengenakan pakaian feminin di luar jam sekolah"
    ],
    "dislikes": [
      "Alasan malas bergerak saat jam pelajaran olahraga berlangsung",
      "Sepatu formal berhak tinggi dan rok span sempit saat acara rapat yayasan",
      "Cuaca hujan berhari-hari (tsuyu) yang membatalkan latihan lapangan",
      "Dianggap cuma 'kakak laki-laki berotot' dan tidak dilihat sebagai seorang wanita"
    ],
    "personality": {
      "traits": "Kaede adalah energi penggerak lapangan di Housen Academy. Sebagai guru termuda di departemen olahraga (baru berusia 25 tahun), jarak usianya yang dekat dengan para murid membuatnya terasa seperti kakak perempuan yang asyik diajak bicara. Ia lugas, jujur, tidak suka basa-basi birokrasi, dan selalu menjadi orang pertama yang melompat turun tangan membantu murid yang kesulitan saat masa orientasi maupun persiapan festival olahraga.",
      "flaws": "Karena citranya yang selalu kuat, ceria, dan *tomboy*, banyak rekan pria maupun orang di sekitarnya yang memperlakukannya layaknya \"teman laki-laki\" belaka. Diam-diam Kaede menyimpan rasa minder terhadap sisi kewanitaannya; ia mengoleksi majalah busana feminin di kamar apartemennya namun selalu malu memakainya di depan umum karena takut ditertawakan tidak cocok.",
      "dere_pattern": "Bertipe **Genki Onee-san dengan sisi Gap-Moe Pemalu**. Ketika bersama murid biasa, ia berani merangkul bahu atau menggoda mereka tanpa beban. Namun ketika berhadapan dengan seseorang yang menatapnya sebagai seorang wanita seutuhnya, keberaniannya langsung runtuh—wajahnya memerah padam hingga ke leher, suaranya mengecil, dan ia mendadak salah tingkah merapikan rambutnya."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Kulit eksotis sehat terpapar matahari (*warm sun-kissed tan*) dengan senyum lebar yang memancarkan energi positif. Sepasang mata amber keemasan yang berbinar tajam namun hangat.\n* **Rambut:** Rambut cokelat kemerahan (*chestnut auburn*) sebahu yang dikuncir kuda pendek bergaya *sporty* dengan ikat rambut elastis putih, menyisakan beberapa helai poni dinamis di dahinya.\n* **Postur & Gestur:** Tinggi atletis (170 cm), ramping berotot proporsional khas mantan atlet lari gawang. Suka menepuk punggung muridnya dengan akrab atau bertolak pinggang sambil meniup peluit perak di lehernya.\n* **Seragam & Gaya Berpakaian:** Hampir selalu mengenakan jaket *tracksuit* merah-putih kebanggaan Housen Academy yang ritsletingnya dibuka separuh di atas kaos olahraga putih ketat, celana training atletik, dan sepatu lari. Saat upacara resmi seperti *Nyūgakushiki*, ia terpaksa memakai setelan blazer wanita formal yang membuatnya terus-menerus menarik kerah karena gerah.\n* **Aksesori & Barang Bawaan:** Peluit perak dan *stopwatch* digital di tali leher, handuk olahraga kecil di bahu, serta plester luka bergambar kartun lucu di sakunya untuk murid yang lecet saat latihan.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Guru & Murid Baru",
          "description": "Sapaan lantang penuh semangat di koridor dan tepukan hangat di bahu."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Partner Latihan Sore",
          "description": "Sering mentraktir minuman dingin di mesin penjual otomatis usai jam olahraga."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kesadaran Diri yang Canggung",
          "description": "Mulai memakai pelembap bibir beraroma buah dan merapikan poni sebelum masuk mengajar di kelas protagonis."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Debaran di Gudang Olahraga",
          "description": "Gugup luar biasa saat tidak sengaja bersentuhan tangan ketika merapikan matras senam berdua."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Pengakuan Seorang Kakak",
          "description": "Mengizinkan protagonis melihat sisi rapuhnya di luar jam sekolah dengan pakaian kasual feminin."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Ikatan penuh kehangatan dan kesetiaan; menjadi pendukung nomor satu protagonis di setiap kompetisi hidup."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Jepit Rambut / Scrunchie Sutra Cantik",
        "Parfum Aroma Citrus Segar",
        "Handuk Olahraga Bordir Nama",
        "Bento Daging Panggang Spesial."
      ],
      "normal": [
        "Minuman Isotonik Dingin",
        "Suplemen Protein",
        "Plester Luka Lucu",
        "Camilan Energi."
      ],
      "disliked": [
        "Buku teori filsafat tebal yang bikin ngantuk",
        "Rokok (ia sangat menjaga kapasitas paru-paru)."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Guru & Murid Baru): — Sapaan lantang penuh semangat di koridor dan tepukan hangat di bahu.",
      "3–4 ♥ (Partner Latihan Sore): — Sering mentraktir minuman dingin di mesin penjual otomatis usai jam olahraga.",
      "5–6 ♥ (Kesadaran Diri yang Canggung): — Mulai memakai pelembap bibir beraroma buah dan merapikan poni sebelum masuk mengajar di kelas protagonis.",
      "7–8 ♥ (Debaran di Gudang Olahraga): — Gugup luar biasa saat tidak sengaja bersentuhan tangan ketika merapikan matras senam berdua.",
      "9 ♥ (Pengakuan Seorang Kakak): — Mengizinkan protagonis melihat sisi rapuhnya di luar jam sekolah dengan pakaian kasual feminin."
    ]
  },
  {
    "id": "li_shiranui_mei",
    "slug": "shiranui_mei",
    "name": "Shiranui Mei (不知火 芽衣)",
    "furigana": "不知火 芽衣",
    "nickname": [
      "Mei-sensei",
      "Dokter UKS",
      "Hoken-no-Oneesan",
      "Shiranui-san"
    ],
    "tagline": "Ara~ masuklah, tutup pintunya pelan-pelan ya. Hmm? Wajahmu merah sekali lho, padahal termometer ini bilang suhumu normal, tiga puluh enam koma lima derajat... Jangan-jangan detak jantungmu naik gara-gara ditatap Ibu dari dekat begini? Hehehe, bercanda~ Ayo duduk di ranjang nomor dua, tarik tirainya, hari ini giliran kelasmu pemeriksaan kesehatan tahunan, kan?",
    "grade": "Faculty",
    "class_room": "Ruang UKS (Infirmary / Hokenshitsu Lantai 1)",
    "category_id": "faculty",
    "role": "Dokter & Perawat UKS (Hokenshitsu) & Konselor Kesehatan",
    "club": "science",
    "club_role": "Staf Medis Sekolah & Pembina Pendamping Riset Kesehatan",
    "archetype": "faculty",
    "social_class": "middle_class",
    "age": 27,
    "birthday": "19 Juni",
    "zodiac": "Gemini",
    "mbti": "ENFJ",
    "gender": "Female",
    "avatar_url": "/portraits/shiranui_mei.png",
    "stats": {
      "physique": 11,
      "intelligent": 16,
      "looks": 17,
      "mind": 16,
      "talent": 14,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 10,
      "composure_max": 16
    },
    "likes": [
      "Aroma teh chamomile hangat & permen lolipop rasa stroberi di toples kaca UKS",
      "Menggoda murid yang pura-pura sakit perut demi bolos jam pelajaran membosankan",
      "Angin siang yang berembus menggerakkan tirai putih ranjang UKS",
      "Merawat luka dan mendengarkan keluh kesah murid tanpa menghakimi",
      "Seseorang yang justru menanyakan kabarnya saat dia kelelahan jaga klinik"
    ],
    "dislikes": [
      "Murid yang memaksakan diri berlatih saat sedang demam atau cedera parah",
      "Bau obat antiseptik rumah sakit besar yang terlalu menyengat dan dingin",
      "Perundungan fisik maupun mental yang membuat murid menangis diam-diam",
      "Makan malam sendirian di apartemen setelah jam piket UKS berakhir"
    ],
    "personality": {
      "traits": "Mei adalah penguasa Ruang UKS (*Hokenshitsu*) yang menjadi suaka paling damai di seluruh Housen Academy. Ia memiliki kepekaan luar biasa dalam membaca bahasa tubuh murid—ia bisa langsung membedakan mana murid yang benar-benar demam, mana yang kelelahan latihan ekskul, dan mana yang hatinya sedang terluka karena masalah cinta atau keluarga. Ia gemar menggoda murid dengan nada suara *ara-ara* yang lembut untuk mencairkan suasana tegang.",
      "flaws": "Di masa lalu, Mei pernah bekerja sebagai perawat IGD di rumah sakit pusat yang sangat keras hingga mengalami kelelahan emosional (*burnout*) karena gagal menyelamatkan seorang pasien remaja. Ia pindah ke lingkungan sekolah agar bisa menjaga kesehatan anak-anak muda sejak dini. Karena terbiasa menjadi \"tempat bersandar\" bagi semua orang, Mei tidak pernah tahu bagaimana caranya meminta tolong atau bermanja ketika dirinya sendiri merasa kesepian.",
      "dere_pattern": "Bertipe **Teasing Onee-san yang Berubah Menjadi Sangat Manja & Rapuh Saat Jatuh Cinta**. Awalnya ia selalu memegang kendali percakapan dan membuat protagonis salah tingkah saat pemeriksaan detak jantung. Namun ketika protagonis balik memedulikannya dengan tulus, pertahanan dewasanya runtuh—ia akan menyandarkan keningnya ke bahu protagonis di balik tirai UKS yang tertutup."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Kecantikan dewasa yang menenangkan sekaligus memabukkan. Sepasang mata ungu lembayung (*amethyst violet*) berbentuk bulan sabit yang selalu tersenyum lembut, tahi lalat kecil memikat di dekat sudut bibir kirinya, serta kulit sehalus sutra.\n* **Rambut:** Rambut gelombang panjang berwarna cokelat madu keemasan (*warm honey-brown*) yang disampirkan secara anggun di satu bahu (*side-swept braid/waves*).\n* **Postur & Gestur:** Tubuh feminin yang anggun dan proporsional (167 cm). Suka menopang dagu dengan kedua tangan di meja kerjanya sambil memiringkan kepala dan menatap lawan bicaranya lekat-lekat.\n* **Seragam & Gaya Berpakaian:** Jas laboratorium putih bersih (*white medical coat*) yang dibiarkan terbuka di atas blus sutra warna krem lembut dan rok kerja selutut, dilengkapi sandal medis nyaman.\n* **Aksesori & Barang Bawaan:** Stetoskop perak di leher, toples kaca berisi permen lolipop stroberi untuk murid yang selesai diperiksa, serta buku rekam medis rahasia siswa.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Perawat & Siswa Baru",
          "description": "Senyum menggoda saat mengukur tinggi badan dan menempelkan stetoskop di dada protagonis."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Tamu Rutin Hokenshitsu",
          "description": "Selalu menyiapkan permen stroberi dan teh chamomile hangat setiap kali protagonis mampir ke UKS."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Godaan yang Berbalik Arah",
          "description": "Mulai terdiam dan tersipu sendiri ketika protagonis menatap matanya balik tanpa mengalihkan pandangan."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Rahasia di Balik Tirai Putih",
          "description": "Meminta protagonis menemaninya merapikan inventaris obat hingga senja dan bercerita tentang masa lalunya."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Detak Jantung yang Jujur",
          "description": "Menarik tangan protagonis untuk merasakan detak jantungnya sendiri yang berdebar kencang."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Tempat pulang paling hangat; memberikan dukungan penyembuhan fisik maupun mental penuh sepanjang tahun ajaran."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Teh Herbal Chamomile & Lavender Impor",
        "Lilin Aromaterapi Vanila",
        "Permen Lolipop Artisan",
        "Syal Rajut Lembut."
      ],
      "normal": [
        "Cokelat Manis",
        "Bunga Segar untuk Vas Jendela UKS",
        "Kopi Susu Hangat."
      ],
      "disliked": [
        "Minuman berenergi dosis berlebihan",
        "Benda tajam berbahaya."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Perawat & Siswa Baru): — Senyum menggoda saat mengukur tinggi badan dan menempelkan stetoskop di dada protagonis.",
      "3–4 ♥ (Tamu Rutin Hokenshitsu): — Selalu menyiapkan permen stroberi dan teh chamomile hangat setiap kali protagonis mampir ke UKS.",
      "5–6 ♥ (Godaan yang Berbalik Arah): — Mulai terdiam dan tersipu sendiri ketika protagonis menatap matanya balik tanpa mengalihkan pandangan.",
      "7–8 ♥ (Rahasia di Balik Tirai Putih): — Meminta protagonis menemaninya merapikan inventaris obat hingga senja dan bercerita tentang masa lalunya.",
      "9 ♥ (Detak Jantung yang Jujur): — Menarik tangan protagonis untuk merasakan detak jantungnya sendiri yang berdebar kencang."
    ]
  },
  {
    "id": "li_tsukishima_fumiko",
    "slug": "tsukishima_fumiko",
    "name": "Tsukishima Fumiko (月島 文子)",
    "furigana": "月島 文子",
    "nickname": [
      "Fumiko-san",
      "Kakak Pustakawan",
      "Tsukishima-sensei",
      "Fumi-nee"
    ],
    "tagline": "S-selamat datang di Perpustakaan Besar Housen Academy... Ah, maaf, suaraku terlalu pelan ya? Ini Kartu Perpustakaan barumu untuk tahun ajaran Kelas 10... Tolong dijaga baik-baik ya, karena di akademi ini, sering kali cerita paling tak terlupakan justru dimulai dari sebuah kartu perpustakaan yang tak sengaja terjatuh...",
    "grade": "Faculty",
    "class_room": "Perpustakaan Besar Housen Academy (Grand Library)",
    "category_id": "faculty",
    "role": "Staf Pustakawan Utama & Pengawas Arsip Akademik",
    "club": "literatur",
    "club_role": "Staf Pengelola Perpustakaan & Pengawas Tes Akademik",
    "archetype": "faculty",
    "social_class": "middle_class",
    "age": 24,
    "birthday": "15 September",
    "zodiac": "Virgo",
    "mbti": "INFJ",
    "gender": "Female",
    "avatar_url": "/portraits/tsukishima_fumiko.png",
    "stats": {
      "physique": 9,
      "intelligent": 17,
      "looks": 15,
      "mind": 14,
      "talent": 15,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 8,
      "composure_max": 14
    },
    "likes": [
      "Aroma halaman buku tua (bibliosmia) dan cahaya matahari sore yang menembus kaca patri perpustakaan",
      "Teh Earl Grey hangat dengan satu sendok madu hutan",
      "Murid yang mengembalikan buku tepat waktu dan memperlakukan sampul buku dengan lembut",
      "Menulis ulasan pendek tanpa nama di balik kartu peminjaman buku klasik",
      "Dibantu mengambil buku ensiklopedia tebal di rak paling atas"
    ],
    "dislikes": [
      "Orang yang melipat ujung halaman buku (dog-earing) atau makan keripik berminyak sambil baca",
      "Suara gaduh di ruang baca utama perpustakaan",
      "Tangga kayu geser perpustakaan yang tinggi (diam-diam agak takut ketinggian)",
      "Keramaian pesta formal yang membuatnya harus berbasa-basi dengan banyak orang asing"
    ],
    "personality": {
      "traits": "Fumiko adalah penjaga keheningan Perpustakaan Besar Housen Academy. Jako staf termuda di lingkungan sekolah (24 tahun), sifatnya sangat sopan, lembut, dan sedikit pemalu saat harus berbicara di depan banyak orang. Namun begitu seseorang bertanya tentang rekomendasi buku, sejarah akademi, atau materi pelajaran untuk persiapan ujian, matanya akan langsung berbinar antusias dan ia mampu menjelaskan dengan sangat mengalir.",
      "flaws": "Karena bertubuh mungil dan bersuara lembut, Fumiko sering kurang percaya diri terhadap wibawanya sebagai staf dewasa—terutama saat harus menegur murid yang berisik di perpustakaan. Selain itu, ia sedikit ceroboh (*clumsy*) saat membawa tumpukan buku yang lebih tinggi dari dagunya, dan diam-diam merupakan seorang *hopeless romantic* yang mengira kisah cinta manis seperti di dalam novel klasik tidak akan pernah terjadi pada gadis pendiam seperti dirinya.",
      "dere_pattern": "Bertipe **Dandere / Hopeless Romantic Bookworm**. Ketika jatuh cinta, ia mengekspresikan perasaannya lewat buku dan perhatian kecil yang puitis—seperti menyelipkan pembatas buku buatan tangan berisi pesan penyemangat menjelang pekan ujian (*Test Week*), menyiapkan meja baca pojok terbaik yang terkena sinar matahari hangat untuk protagonis, dan tersipu malu hingga bersembunyi di balik rak buku saat dipuji."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah imut dan tampak lebih muda dari usianya (sering dikira siswi kelas 12 oleh murid baru). Kulit putih bersih, mata bulat besar berwarna hijau zamrud teduh (*soft emerald*) di balik kacamata bulat berbingkai emas tipis (*round wire-frame glasses*), serta pipi yang mudah merona merah jambu.\n* **Rambut:** Rambut panjang berwarna biru malam keperakan (*soft indigo-ash*) yang dikepang longgar di sisi bahu (*loose side braid*) dan diikat pita beludru krem.\n* **Postur & Gestur:** Mungil dan ramping (156 cm). Sering memeluk tumpukan buku tebal di depan dadanya dengan kedua tangan, dan harus berjinjit tinggi-tinggi saat mencoba meraih rak bagian atas.\n* **Seragam & Gaya Berpakaian:** Kardigan rajut hangat berwarna krem gading di atas kemeja berkerah pita, celemek staf perpustakaan (*librarian apron*) berwarna cokelat kayu manis dengan kantong depan berisi cap tanggal dan pembatas buku, serta rok lipit panjang selutut.\n* **Aksesori & Barang Bawaan:** Tali rantai tipis pada kacamatanya, stempel tanggal perpustakaan, serta buku catatan tempat ia menyalin kutipan novel romansa favoritnya.",
    "heart_meter": {
      "base": 2,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Pustakawan & Peminjam Buku",
          "description": "Membungkuk sopan dengan wajah sedikit gugup saat menyerahkan kartu perpustakaan."
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekomendasi Rahasia",
          "description": "Mulai memilihkan buku referensi terbaik untuk membantu nilai ujian protagonis."
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Pesan di Kartu Peminjaman",
          "description": "Menuliskan catatan kecil penyemangat di pembatas buku yang dipinjam protagonis; pipinya langsung merah padam saat ditanya."
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Meja Khusus di Pojok Jendela",
          "description": "Mengajak protagonis mencicipi teh dan kue kering buatannya di ruang arsip belakang perpustakaan."
        },
        {
          "range": "9 ♥",
          "minHearts": 9,
          "maxHearts": 9,
          "title": "Kisah Cinta Milik Sendiri",
          "description": "Memberanikan diri menggenggam ujung lengan baju protagonis agar tidak cepat-cepat pulang saat perpustakaan hendak tutup."
        },
        {
          "range": "10 ♥",
          "minHearts": 10,
          "maxHearts": 10,
          "title": "Kekasih Sejati / Canon Lovers",
          "description": "Menjadikan protagonis tokoh utama sejati di hidupnya; selalu mendukung setiap ujian akademik dan langkah masa depan protagonis."
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Novel Klasik Edisi Sampul Keras",
        "Pembatas Buku Bunga Kering (Pressed Flower Bookmark)",
        "Madu Hutan Murni",
        "Kacamata Baca Rantai Perak."
      ],
      "normal": [
        "Teh Earl Grey",
        "Biskuit Mentega Kaleng",
        "Sticky Notes Pastel",
        "Pena Tinta Halus."
      ],
      "disliked": [
        "Buku yang halamannya sengaja dilipat/dicoret",
        "Makanan berbau tajam di ruang baca."
      ]
    },
    "date_spots": [
      "1–2 ♥ (Pustakawan & Peminjam Buku): — Membungkuk sopan dengan wajah sedikit gugup saat menyerahkan kartu perpustakaan.",
      "3–4 ♥ (Rekomendasi Rahasia): — Mulai memilihkan buku referensi terbaik untuk membantu nilai ujian protagonis.",
      "5–6 ♥ (Pesan di Kartu Peminjaman): — Menuliskan catatan kecil penyemangat di pembatas buku yang dipinjam protagonis; pipinya langsung merah padam saat ditanya.",
      "7–8 ♥ (Meja Khusus di Pojok Jendela): — Mengajak protagonis mencicipi teh dan kue kering buatannya di ruang arsip belakang perpustakaan.",
      "9 ♥ (Kisah Cinta Milik Sendiri): — Memberanikan diri menggenggam ujung lengan baju protagonis agar tidak cepat-cepat pulang saat perpustakaan hendak tutup."
    ]
  },
  {
    "id": "li_kurogane_tetsuo",
    "slug": "kurogane_tetsuo",
    "name": "Kurogane Tetsuo (黒鉄 鉄生)",
    "furigana": "黒鉄 鉄生",
    "nickname": [
      "Tetsuo-san",
      "Iron Tetsuo",
      "Legenda Phoenix Hitam",
      "Bos Bengkel"
    ],
    "tagline": "Dunia luar gerbang sekolah itu kejam, anak muda. Di sana ga ada bel pergantian pelajaran atau guru yang bakal misahin perkelahian. Tapi selama lu masih bawa nama Housen di dada lu... gw ga bakal biarin anjing-anjing pelabuhan itu nginjak harga diri kalian.",
    "grade": "Alumni",
    "class_room": "Alumni Housen (Angkatan 2024) / Bengkel Motor Distrik 3",
    "category_id": "outside_school",
    "role": "Pendiri & Pemimpin Tertinggi Geng Kokuhou (Alumnus Housen)",
    "club": "outdoor",
    "club_role": "Pendiri & Alumnus Pelindung Kokuhou",
    "archetype": "delinquent",
    "social_class": "worker",
    "age": 20,
    "birthday": "12 Januari",
    "zodiac": "Capricorn",
    "mbti": "ISTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=kurogane_tetsuo",
    "stats": {
      "physique": 18,
      "intelligent": 13,
      "looks": 15,
      "mind": 17,
      "talent": 14,
      "luck": 13
    },
    "vitals": {
      "physical_hp_max": 22,
      "composure_max": 18
    },
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
    "personality": {
      "traits": "Tenang, matang, protektif, dan berwibawa mutlak. Kata-katanya singkat namun mengikat layaknya sumpah besi. Ia adalah figur ayah/kakak tertua bagi seluruh berandal muda Housen.",
      "flaws": "Terlalu memikul seluruh dosa dan luka generasi muda di pundaknya sendiri, enggan membagi beban hidupnya pada orang lain.",
      "dere_pattern": "Tipe Stoic Big-Boss Mentor. Mengawasi dari kejauhan, datang menolong di detik paling kritis dengan raungan knalpot motornya, lalu membelikan satu krat minuman hangat tanpa banyak bicara."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah pria muda dewasa berusia 20 tahun dengan garis rahang kokoh, tatapan mata arang gelap (*deep charcoal eyes*) yang dingin, dalam, dan berwibawa bak dinding benteng. Terdapat bekas luka bakar knalpot kecil di leher kanan yang menambah aura maskulinnya.\n* **Rambut:** Rambut hitam pendek tebal dipotong model *textured crop/crew fade* yang praktis dan maskulin.\n* **Postur & Gestur:** Bertubuh tinggi tegap, sangat berotot liat hasil bertahun-tahun mengangkat blok mesin motor (186 cm, 88 kg). Gerakannya tenang, tidak terburu-buru, memancarkan aura predator yang sudah kenyang bertarung.\n* **Seragam & Gaya Berpakaian:** Mengenakan jaket kulit motor hitam usang (*distressed black leather rider jacket*) dengan sulaman benang hitam samar lambang burung phoenix di punggung, kaos henley abu-abu pudar, celana jins denim tebal bernoda oli di lutut, dan sepatu boots kerja kulit bertulang baja (*steel-toe boots*).\n* **Aksesori & Barang Bawaan:** Kunci bengkel lipat serbaguna, pemantik api zippo perak tua peninggalan ayahnya, dan sarung tangan mekanik kulit di saku belakang.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 18,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Deru mesin motor 4-tak yang disetel dengan presisi sempurna"
      ],
      "normal": [
        "Melihat adik-adik kelas Housen pulang sekolah dengan aman"
      ],
      "disliked": [
        "Sindikat kriminal dewasa yang memanfaatkan anak SMA untuk narkoba/judi"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_samejima_ren",
    "slug": "samejima_ren",
    "name": "Samejima Ren (鮫島 蓮)",
    "furigana": "鮫島 蓮",
    "nickname": [
      "Same-Ren",
      "Hiu Putih Touki",
      "Si Otak Kacamata",
      "Strategist Touki"
    ],
    "tagline": "Otot hanyalah alat tawar-menawar yang primitif. Yang mengendalikan hasil perang adalah siapa yang memegang informasi dan rute logistik musuh. Housen sudah masuk ke dalam jaring laba-laba kami sejak kalian menginjak gerbang sekolah pagi ini.",
    "grade": 11,
    "class_room": "SMA Kejuruan Touki (Kelas 11-Elektronika)",
    "category_id": "touki",
    "role": "Otak Strategi & Hacker Jalanan Touki ('White Shark')",
    "club": "gaming",
    "club_role": "Otak Strategi & Intelijen Touki",
    "archetype": "nerd",
    "social_class": "middle_class",
    "age": 17,
    "birthday": "19 Januari",
    "zodiac": "Capricorn",
    "mbti": "INTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=samejima_ren",
    "stats": {
      "physique": 11,
      "intelligent": 17,
      "looks": 14,
      "mind": 16,
      "talent": 15,
      "luck": 12
    },
    "vitals": {
      "physical_hp_max": 12,
      "composure_max": 16
    },
    "likes": [
      "Meretas kamera CCTV publik distrik pelabuhan",
      "Mengamati data pergerakan polisi lewat radio scanner",
      "Kopi dingin kaleng hitam tanpa gula",
      "Skema pemerasan rapi tanpa meninggalkan bukti jejak fisik"
    ],
    "dislikes": [
      "Kekerasan tanpa otak yang tidak menghasilkan keuntungan uang",
      "Peretasan yang digagalkan oleh firewall tak dikenal",
      "Rencana yang hancur oleh kebodohan anak buah"
    ],
    "personality": {
      "traits": "Sangat analitis, dingin, licik, sosiopatik santai, tidak peduli pada darah atau loyalitas emosional selama rencananya sukses.",
      "flaws": "Meremehkan kekuatan ikatan persahabatan dan keberanian irasional murid-murid Housen.",
      "dere_pattern": "Otak Kejahatan Antagonis. Menjadi target peretasan balasan oleh Takamine Ryo dan Alya."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah tirus pucat dingin dengan sepasang mata biru pucat bak es beku (*pale icy-blue eyes*), kacamata persegi tipis tanpa bingkai (*frameless rectangular glasses*), senyuman tipis kalkulatif bak hiu pemangsa.\n* **Rambut:** Rambut platinum-abu perak (*platinum-grey*) lurus yang disisir belah tengah licin rapi (*neat center-parted hair*).\n* **Postur & Gestur:** Bertubuh tinggi kurus (178 cm), tangannya selalu memegang smartphone terenkripsi hitam, selalu menjaga jarak dari arena baku hantam fisik.\n* **Seragam & Gaya Berpakaian:** Blazer hitam seragam kejuruan Touki yang sangat bersih dan rapi (kontras tajam dengan anggota geng Touki lainnya yang dekil), kemeja abu-abu berkancing penuh tanpa dasi.\n* **Aksesori & Barang Bawaan:** Kacamata frameless, smartphone ganda terenkripsi, kabel USB hacking portabel, dan pemancar jammer sinyal saku.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 17,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Meretas kamera CCTV publik distrik pelabuhan"
      ],
      "normal": [
        "Kopi dingin kaleng hitam tanpa gula"
      ],
      "disliked": [
        "Kekerasan tanpa otak yang tidak menghasilkan keuntungan uang"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  },
  {
    "id": "li_onizuka_gouki",
    "slug": "onizuka_gouki",
    "name": "Onizuka Gouki (鬼塚 剛鬼)",
    "furigana": "鬼塚 剛鬼",
    "nickname": [
      "Aka-Oni",
      "Ogre Merah",
      "Penguasa Pelabuhan",
      "Bos Touki"
    ],
    "tagline": "Housen itu cuma sarang anak-anak manja berdasi rapi yang ga pernah ngerasain lapar di perutnya! Di pelabuhan Touki ini, taring dan darah yang memutuskan siapa penguasa sejati! Bawa Kurogane Tetsuo ke hadapan gw, atau teman kalian ga bakal pernah pulang!",
    "grade": 12,
    "class_room": "SMA Kejuruan Touki (Kelas 12-Teknik Mesin)",
    "category_id": "touki",
    "role": "Ketua Umum Geng SMA Touki ('The Red Ogre')",
    "club": "martial_arts",
    "club_role": "Ketua Umum Geng SMA Touki",
    "archetype": "delinquent",
    "social_class": "lower_class",
    "age": 18,
    "birthday": "6 Juni",
    "zodiac": "Gemini",
    "mbti": "ESTJ",
    "gender": "Male",
    "avatar_url": "https://api.dicebear.com/7.x/adventurer/svg?seed=onizuka_gouki",
    "stats": {
      "physique": 19,
      "intelligent": 12,
      "looks": 11,
      "mind": 17,
      "talent": 13,
      "luck": 10
    },
    "vitals": {
      "physical_hp_max": 26,
      "composure_max": 18
    },
    "likes": [
      "Melihat lawan berlutut memohon ampun di bawah kakinya",
      "Daging panggang setengah matang berdarah",
      "Suara rantai motor dan dentuman drum minyak",
      "Membuktikan supremasi Touki di seluruh kota"
    ],
    "dislikes": [
      "Anak-anak elitis Housen yang merasa dirinya lebih suci dari anak jalanan",
      "Kurogane Tetsuo (dendam masa lalu)",
      "Kekalahan dalam duel satu lawan satu"
    ],
    "personality": {
      "traits": "Brutal, tiran jalanan tanpa ampun, haus kekuasaan, memimpin ratusan berandal dermaga lewat teror fisik dan kekuatan mutlak.",
      "flaws": "Terlalu dibutakan oleh amarah dendam lamanya pada Kurogane Tetsuo.",
      "dere_pattern": "Antagonis Utama / Respected Rival. Jika ditumbangkan secara jantan satu lawan satu, Onizuka akan mengakui kekalahannya dan memerintahkan Touki mundur dari Housen."
    },
    "appearance": "* **Ciri Fisik & Wajah:** Wajah bengis mengerikan berusia 18 tahun dengan rahang masif, tatapan mata kuning keemasan buas (*bloodshot amber-gold eyes*) bak iblis oni, bekas luka cakaran dalam (*claw-like facial scar*) yang membentang dari pelipis kanan melintasi pipi hingga ke leher.\n* **Rambut:** Rambut mohawk kasar berduri berwarna hitam pekat dengan ujung-ujungnya dicat merah darah (*crimson-tipped spiky mohawk*).\n* **Postur & Gestur:** Monster bertubuh raksasa luar biasa berotot tebal bak gorilla gunung (195 cm, 110 kg), urat-urat lengannya mencuat tebal, memancarkan aura haus darah yang mencekik.\n* **Seragam & Gaya Berpakaian:** Gakuran hitam robek tanpa lengan (*sleeveless torn black gakuran*) dengan sulaman benang merah bergambar topeng iblis Oni di punggung, memperlihatkan tato tribal hitam di kedua pundak dan lengannya, rantai motor tebal melilit pinggangnya sebagai sabuk.\n* **Aksesori & Barang Bawaan:** Cincin besi tengkorak di jemari tangannya, pipa besi baja cor 1 meter di tangan kanan, dan sepatu bot militer bertali kawat baja.",
    "heart_meter": {
      "base": 1,
      "confession_target_dc": 19,
      "milestones": [
        {
          "range": "1–2 ♥",
          "minHearts": 1,
          "maxHearts": 2,
          "title": "Waspada / Formal Berjarak",
          "description": "Mengamati dari kejauhan, menjawab secara efisien dan hemat kata. (Pertemuan pertama dan interaksi formal di sekolah.)"
        },
        {
          "range": "3–4 ♥",
          "minHearts": 3,
          "maxHearts": 4,
          "title": "Rekan Kerja & Sekutu",
          "description": "Mulai berbagi informasi, makanan kecil, dan mengobrol santai tanpa curiga. (Diskusi strategi rahasia atau bantuan tugas harian.)"
        },
        {
          "range": "5–6 ♥",
          "minHearts": 5,
          "maxHearts": 6,
          "title": "Kepercayaan Khusus / Salting",
          "description": "Menunjukkan sisi rapuh di balik persona kuatnya, gugup bila berdekatan. (Momen intim berdua saat senja atau saling merawat luka.)"
        },
        {
          "range": "7–8 ♥",
          "minHearts": 7,
          "maxHearts": 8,
          "title": "Ikatan Jiwa / Penuh Kasih",
          "description": "Selalu memprioritaskan keselamatan pemain, cemburu bila pemain terancam. (Hadiah istimewa dan pengakuan kesetiaan mendalam.)"
        },
        {
          "range": "9–10 ♥",
          "minHearts": 9,
          "maxHearts": 10,
          "title": "Kekasih Abadi / Sumpah Sejati",
          "description": "Hubungan komitmen mutlak, kebal terhadap kepanikan mental saat bersama. (Momen penembakan emosional dan sumpah masa depan bersama.)"
        }
      ]
    },
    "gifts": {
      "favorite": [
        "Melihat lawan berlutut memohon ampun di bawah kakinya"
      ],
      "normal": [
        "Suara rantai motor dan dentuman drum minyak"
      ],
      "disliked": [
        "Anak-anak elitis Housen yang merasa dirinya lebih suci dari anak jalanan"
      ]
    },
    "date_spots": [
      "Area Markas Rahasia / Sudut Favorit: — Tempat privat yang mencerminkan jati diri karakter.",
      "Atap Gedung Sekolah Saat Senja: — Memandangi pemandangan kota di bawah langit jingga keemasan.",
      "Kedai Pinggir Kota / Kafe Tenang: — Menikmati makanan hangat berdua tanpa pengawasan pihak lain.",
      "Taman Sakura Tepi Sungai: — Berjalan beriringan di bawah guguran kelopak bunga musim semi."
    ]
  }
];

export function getAllLoveInterests(): LoveInterestDefinition[] {
  return CANON_LOVE_INTERESTS;
}

export function getLoveInterestBySlug(slug: string): LoveInterestDefinition | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return CANON_LOVE_INTERESTS.find((li) => li.slug.toLowerCase() === clean || li.id.toLowerCase() === clean);
}

export function findLoveInterestByName(query: string): LoveInterestDefinition | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();

  // 1. Direct slug or id exact match
  const bySlug = CANON_LOVE_INTERESTS.find(
    (li) => li.slug.toLowerCase() === q || li.id.toLowerCase() === q
  );
  if (bySlug) return bySlug;

  // 2. Exact name match (or contains)
  const byExact = CANON_LOVE_INTERESTS.find(
    (li) => li.name.toLowerCase() === q || li.name.toLowerCase().startsWith(q) || q.startsWith(li.name.toLowerCase())
  );
  if (byExact) return byExact;

  // 3. Name contains query or query contains romaji part of name
  const byPart = CANON_LOVE_INTERESTS.find((li) => {
    const rawRomaji = li.name.replace(/\([^)]+\)/, "").trim().toLowerCase();
    const cleanNicknames = (li.nickname || []).map((n) => n.toLowerCase());
    return (
      rawRomaji.includes(q) ||
      q.includes(rawRomaji) ||
      cleanNicknames.some((nick) => nick.includes(q) || q.includes(nick)) ||
      li.furigana.toLowerCase().includes(q)
    );
  });
  if (byPart) return byPart;

  return undefined;
}

export function getCurrentMilestone(li: LoveInterestDefinition, hearts: number): HeartMilestone | undefined {
  const h = Math.max(1, Math.min(10, hearts || 1));
  const milestones = li.heart_meter?.milestones || [];
  return milestones.find((m) => h >= m.minHearts && h <= m.maxHearts) || milestones[milestones.length - 1];
}
