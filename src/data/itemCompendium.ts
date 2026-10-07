export interface ItemDefinition {
  name: string;
  category: "student" | "social" | "club" | "archetype" | "keepsake" | "custom";
  origin: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Special Keepsake";
  flavorText: string;
  mechanic: string;
  actionType: "passive" | "action" | "bonus_action" | "reaction" | "utility" | "consumable";
  rollCheck?: {
    stat: string;
    label: string;
    die?: string;
  };
}

export const MASTER_ITEM_REGISTRY: Record<string, ItemDefinition> = {
  // =========================================================================
  // 1. PERLENGKAPAN STANDAR MURID SMA (COMMON)
  // =========================================================================
  "Buku Pelajaran & Buku Tulis Catatan": {
    name: "Buku Pelajaran & Buku Tulis Catatan",
    category: "student",
    origin: "Perlengkapan Standar SMA",
    rarity: "Common",
    flavorText: "Kumpulan buku teks sekolah dan buku tulis bergaris yang penuh coretan rumus, rangkuman guru, dan gambar doodle di pojok halaman saat bosan mendengarkan ceramah.",
    mechanic: "Memberikan bonus +1 pada check Intelligent (Academic) jika karakter meluangkan waktu 5 menit untuk membuka catatan sebelum kuis dadakan atau ujian berlangsung.",
    actionType: "passive",
    rollCheck: { stat: "intelligent", label: "Check Academic (Belajar Catatan)" }
  },
  "Kotak Pensil & Penghapus Lengkap": {
    name: "Kotak Pensil & Penghapus Lengkap",
    category: "student",
    origin: "Perlengkapan Standar SMA",
    rarity: "Common",
    flavorText: "Kotak pensil resleting berisi bolpoin warna-warni, pensil mekanik 0.5mm, tipe-x, dan penghapus wangi. Penyelamat hidup saat teman sebangku panik kelupaan alat tulis.",
    mechanic: "Meminjamkan pensil atau penghapus kepada teman sekelas/gebetan memberikan Advantage pada check interaksi sosial pertama (Looks / Charm atau Mind / Interpersonal) dengan karakter tersebut hari itu.",
    actionType: "utility",
    rollCheck: { stat: "looks", label: "Check Charm (Pinjam Alat Tulis)" }
  },
  "Smartphone & Earphone Kabel": {
    name: "Smartphone & Earphone Kabel",
    category: "student",
    origin: "Perlengkapan Standar SMA",
    rarity: "Common",
    flavorText: "Jendela kehidupan remaja modern. Digunakan untuk berkirim pesan LIME rahasia di bawah meja, browsing gosip sekolah, dan mendengarkan musik lo-fi saat sendirian di halte bus.",
    mechanic: "Dapat digunakan untuk komunikasi jarak jauh instan dalam radius kota dan mencari informasi umum dengan check Intelligent (Academic / Street). Baterai awet sepanjang sesi.",
    actionType: "utility",
    rollCheck: { stat: "intelligent", label: "Check Street (Cari Info di HP)" }
  },
  "Kartu Pelajar Sekolah": {
    name: "Kartu Pelajar Sekolah",
    category: "student",
    origin: "Perlengkapan Standar SMA",
    rarity: "Common",
    flavorText: "Kartu plastik resmi berfoto wajah kaku seragam putih. Bukti sah status kesiswaan di mata guru BP, penjaga perpus, dan kondektur transportasi umum.",
    mechanic: "Membuka akses ke gerbang sekolah, perpustakaan, dan fasilitas publik sekolah. Memberikan diskon pelajar pada tempat tertentu di dalam kota.",
    actionType: "passive"
  },
  "Payung Lipat Jaga-Jaga Hujan": {
    name: "Payung Lipat Jaga-Jaga Hujan",
    category: "student",
    origin: "Perlengkapan Standar SMA",
    rarity: "Common",
    flavorText: "Payung lipat praktis yang selalu terselip di kantong samping tas. Menjadi instrumen romansa legendaris anime saat hujan lebat tiba-tiba turun sepulang sekolah.",
    mechanic: "Saat hujan turun, karakter dapat mengajak seorang teman/gebetan bernaung satu payung bersama (Aiaigasa). Karakter dan teman tersebut mendapat Advantage pada check Relationship Luck dan memulihkan 2 Composure.",
    actionType: "utility",
    rollCheck: { stat: "luck", label: "Check Relationship Luck (Payung Berdua)" }
  },

  // =========================================================================
  // 2. KELAS SOSIAL (SOCIAL CLASSES)
  // =========================================================================
  // Rich
  "Smartphone Flagship Terbaru": {
    name: "Smartphone Flagship Terbaru",
    category: "social",
    origin: "Kelas Sosial: Rich (Konglomerat)",
    rarity: "Rare",
    flavorText: "Gawai berlapis titanium dengan kamera periskop tercanggih. Simbol kemakmuran tanpa perlu banyak kata saat ditaruh santai di atas meja kafe.",
    mechanic: "Memberikan +2 pada check Intelligent (Technology/Gadget) dan Advantage pada check Looks (Influence) saat memamerkan perangkat atau berhadapan dengan murid yang terpesona status kaya.",
    actionType: "passive",
    rollCheck: { stat: "looks", label: "Check Influence (Pamer Gawai Flagship)" }
  },
  "Dompet Kulit Merk Terkenal": {
    name: "Dompet Kulit Merk Terkenal",
    category: "social",
    origin: "Kelas Sosial: Rich (Konglomerat)",
    rarity: "Rare",
    flavorText: "Dompet kulit asli keluaran rumah mode Milan yang elegan. Selalu memuat tumpukan lembaran uang kertas rapi tanpa koin receh bergemerincing.",
    mechanic: "Mencegah karakter mengalami kegagalan akibat kekurangan uang receh dalam transaksi harian. Memberikan Advantage saat bernegosiasi belanja bernilai besar.",
    actionType: "passive"
  },
  "Voucher Kafe Mewah": {
    name: "Voucher Kafe Mewah",
    category: "social",
    origin: "Kelas Sosial: Rich (Konglomerat)",
    rarity: "Uncommon",
    flavorText: "Kupon emas untuk reservasi meja VIP di lounge kafe bertingkat tinggi dengan pemandangan lampu malam kota Tokyo.",
    mechanic: "Dapat dikonsumsi sekali per sesi saat berkencan atau traktiran sepulang sekolah. Menambah +1 Affection meter target kencan dan memulihkan 1d6 Composure bagi semua yang ditraktir.",
    actionType: "consumable"
  },
  "Kotak Pensil Impor": {
    name: "Kotak Pensil Impor",
    category: "social",
    origin: "Kelas Sosial: Rich (Konglomerat)",
    rarity: "Uncommon",
    flavorText: "Kotak pensil magnetik buatan Jerman dengan bantalan beludru lembut. Tiap pena tertata rapi tanpa cela.",
    mechanic: "Mencerminkan disiplin aristokratik. Memberikan +1 pada check Talent (Creative) saat mendesain presentasi atau menulis surat kaligrafi formal.",
    actionType: "passive"
  },

  // Medium Rich
  "Smartphone Bagus": {
    name: "Smartphone Bagus",
    category: "social",
    origin: "Kelas Sosial: Medium Rich (Menengah Atas)",
    rarity: "Uncommon",
    flavorText: "Ponsel trendi keluaran tahun ini dengan casing stylish. Cepat merespons notifikasi grup sekolah dan unggahan medsos kekinian.",
    mechanic: "Memberikan +1 pada check interaksi daring dan koordinasi aktivitas kumpul bersama teman sepulang sekolah.",
    actionType: "passive"
  },
  "Sepatu Branded": {
    name: "Sepatu Branded",
    category: "social",
    origin: "Kelas Sosial: Medium Rich (Menengah Atas)",
    rarity: "Uncommon",
    flavorText: "Sneakers edisi kolaborasi terbatas yang selalu dijaga kebersihannya. Mencuri perhatian mata murid lain saat melangkah di koridor.",
    mechanic: "Memberikan +1 pada check Looks (Aura / Gaya) saat berjalan percaya diri di hadapan kerumunan murid.",
    actionType: "passive",
    rollCheck: { stat: "looks", label: "Check Aura (Gaya Sepatu Keren)" }
  },
  "Earphone Wireless Premium": {
    name: "Earphone Wireless Premium",
    category: "social",
    origin: "Kelas Sosial: Medium Rich (Menengah Atas)",
    rarity: "Uncommon",
    flavorText: "TWS minimalis dengan suara bass jernih. Memisahkan diri dari kebisingan ocehan kelas yang membosankan.",
    mechanic: "Mengaktifkan mode hening membantu karakter menenangkan diri; memulihkan 2 Composure sekali per Short Rest saat mendengarkan lagu favorit.",
    actionType: "utility"
  },
  "Tumbler Keren": {
    name: "Tumbler Keren",
    category: "social",
    origin: "Kelas Sosial: Medium Rich (Menengah Atas)",
    rarity: "Common",
    flavorText: "Tumbler stainless steel tahan dingin berlogo kafe kopi kenamaan. Selalu berisi teh peach dingin atau matcha latte.",
    mechanic: "Dapat diminum kapan saja saat jeda tanding atau ujian untuk melegakan tenggorokan dan menambah fokus pada giliran berikutnya.",
    actionType: "utility"
  },

  // Medium
  "Smartphone Standar": {
    name: "Smartphone Standar",
    category: "social",
    origin: "Kelas Sosial: Medium (Keluarga Biasa)",
    rarity: "Common",
    flavorText: "Ponsel kelas menengah yang awet dan fungsional. Layarnya dilapisi antigores miring dan memori hampir penuh foto keseharian.",
    mechanic: "Fungsional untuk semua kebutuhan komunikasi standar tanpa bonus maupun penalti status.",
    actionType: "passive"
  },
  "Kotak Bento Susun": {
    name: "Kotak Bento Susun",
    category: "social",
    origin: "Kelas Sosial: Medium (Keluarga Biasa)",
    rarity: "Common",
    flavorText: "Kotak makan berbungkus kain furoshiki motif bunga, berisi nasi bertabur wijen, tamagoyaki manis, sosis gurita, dan karaage buatan ibu penuh kasih sayang.",
    mechanic: "Dimakan saat istirahat siang (Lunch Break): Memulihkan 1d4 Physical HP dan 1d4 Composure. Jika berbagi lauk dengan gebetan, dapat memicu momen manis (Advantage check Interpersonal).",
    actionType: "consumable",
    rollCheck: { stat: "mind", label: "Check Interpersonal (Bagi Lauk Bento)" }
  },
  "Payung Lipat Polos": {
    name: "Payung Lipat Polos",
    category: "social",
    origin: "Kelas Sosial: Medium (Keluarga Biasa)",
    rarity: "Common",
    flavorText: "Payung lipat biru navy polos yang setia menemani di dasar tas tanpa banyak gaya.",
    mechanic: "Menjaga seragam dan tas tetap kering sempurna saat hujan deras tanpa menarik perhatian orang lain.",
    actionType: "utility"
  },
  "Kartu Kereta Komuter": {
    name: "Kartu Kereta Komuter",
    category: "social",
    origin: "Kelas Sosial: Medium (Keluarga Biasa)",
    rarity: "Common",
    flavorText: "Kartu transit langganan bulanan jalur kereta sekolah. Disimpan di saku luar tas agar mudah di-tap di gerbang stasiun.",
    mechanic: "Bebas biaya ongkos kereta komuter dalam rute rumah-sekolah. Memberikan peluang papasan di peron kereta pada check Relationship Luck.",
    actionType: "passive"
  },

  // Medium Poor
  "Smartphone Layar Retak Sedikit": {
    name: "Smartphone Layar Retak Sedikit",
    category: "social",
    origin: "Kelas Sosial: Medium Poor (Keluarga Hemat)",
    rarity: "Common",
    flavorText: "Ponsel dengan retakan halus di sudut layar akibat jatuh saat terburu-buru naik sepeda, namun masih menyala tangguh.",
    mechanic: "Karakter kebal terhadap rasa gengsi atau intimidasi barang branded. Menunjukkan kesederhanaan yang disenangi karakter berhati tulus.",
    actionType: "passive"
  },
  "Botol Air Minum Isi Ulang": {
    name: "Botol Air Minum Isi Ulang",
    category: "social",
    origin: "Kelas Sosial: Medium Poor (Keluarga Hemat)",
    rarity: "Common",
    flavorText: "Botol plastik bening yang selalu diisi ulang air dingin dari dispenser ruang guru sebelum bel masuk.",
    mechanic: "Menghemat pengeluaran uang saku harian. Membantu menjaga hidrasi tubuh tanpa perlu membeli minuman kemasan di minimarket.",
    actionType: "passive"
  },
  "Roti Diskon Minimarket": {
    name: "Roti Diskon Minimarket",
    category: "social",
    origin: "Kelas Sosial: Medium Poor (Keluarga Hemat)",
    rarity: "Common",
    flavorText: "Roti melon bertempel stiker diskon 30% yang dibeli tadi malam. Rasanya tetap manis dan mengenyangkan perut yang keroncongan.",
    mechanic: "Makanan darurat sekali makan: Memulihkan 2 Physical HP seketika saat karakter kelelahan sepulang sekolah.",
    actionType: "consumable"
  },
  "Buku Catatan Murah": {
    name: "Buku Catatan Murah",
    category: "social",
    origin: "Kelas Sosial: Medium Poor (Keluarga Hemat)",
    rarity: "Common",
    flavorText: "Buku tulis bergaris bersampul cokelat polos yang dibeli dari toko grosir. Tulisannya padat dan efisien tanpa menyisakan halaman kosong.",
    mechanic: "Mencatat trik jalanan dan kiat berhemat; memberikan Advantage pada check Intelligent (Street) saat mencari barang murah di pasar kota.",
    actionType: "passive"
  },

  // Poor
  "Sepatu Kets Usang": {
    name: "Sepatu Kets Usang",
    category: "social",
    origin: "Kelas Sosial: Poor (Banting Tulang)",
    rarity: "Common",
    flavorText: "Sepatu kanvas pudar dengan sol yang pernah dilem ulang. Nyaman di kaki dan menjadi saksi bisu ribuan langkah kerja keras.",
    mechanic: "Memberikan +1 pada check Physique (Agility) saat berlari kencang mengejar waktu atau kabur dari situasi darurat.",
    actionType: "passive",
    rollCheck: { stat: "physique", label: "Check Agility (Lari Kencang)" }
  },
  "Koran Bekas Pelindung Hujan": {
    name: "Koran Bekas Pelindung Hujan",
    category: "social",
    origin: "Kelas Sosial: Poor (Banting Tulang)",
    rarity: "Common",
    flavorText: "Lipatan koran pagi sisa loper koran yang bisa difungsikan sebagai payung darurat, alas duduk taman, atau bahan penyerap tumpahan.",
    mechanic: "Alat utilitas serbaguna: Dapat digunakan untuk menyembunyikan wajah saat mengintai (+2 Stealth) atau melindungi kepala dari rintik air.",
    actionType: "utility"
  },
  "Nasi Kepal (Onigiri) Garam": {
    name: "Nasi Kepal (Onigiri) Garam",
    category: "social",
    origin: "Kelas Sosial: Poor (Banting Tulang)",
    rarity: "Common",
    flavorText: "Onigiri segitiga buatan tangan beralas rumput laut garing dengan sejumput garam gurih. Sederhana namun penuh rasa syukur.",
    mechanic: "Mengonsumsi onigiri memulihkan 2 HP. Jika dibagikan kepada teman yang lapar, mempererat ikatan batin (+2 pada check Bonds berikutnya).",
    actionType: "consumable"
  },
  "Handuk Kecil Leher": {
    name: "Handuk Kecil Leher",
    category: "social",
    origin: "Kelas Sosial: Poor (Banting Tulang)",
    rarity: "Common",
    flavorText: "Handuk katun kecil yang sering dikalungkan di leher saat mengantar koran subuh atau mencuci piring restoran.",
    mechanic: "Memberikan Advantage pada saving throw Physique melawan rasa pusing dan kelelahan fisik akibat cuaca terik.",
    actionType: "reaction"
  },

  // Orphanage
  "Foto Polaroid Lama": {
    name: "Foto Polaroid Lama",
    category: "social",
    origin: "Kelas Sosial: Orphanage (Panti Asuhan)",
    rarity: "Uncommon",
    flavorText: "Foto berbingkai putih buram menampilkan senyuman anak-anak panti di bawah pohon sakura tua. Tersimpan rapi di saku terdalam dekat dada.",
    mechanic: "Sekali per sesi, saat karakter hampir menyerah atau gagal pada lemparan krusial, karakter dapat menatap foto ini untuk melakukan Reroll 1 lemparan d20.",
    actionType: "reaction"
  },
  "Gantungan Kunci Rajut Buatan Adik Panti": {
    name: "Gantungan Kunci Rajut Buatan Adik Panti",
    category: "social",
    origin: "Kelas Sosial: Orphanage (Panti Asuhan)",
    rarity: "Uncommon",
    flavorText: "Boneka rajut benang wol kecil berbentuk beruang buatan adik panti asuhan sebagai jimat pelindung kakak tertua.",
    mechanic: "Memberikan bonus +2 pada Saving Throw Mind melawan efek keputusasaan, rasa terisolasi, atau provokasi ejekan status keluarga.",
    actionType: "passive"
  },
  "Tas Selempang Kanvas": {
    name: "Tas Selempang Kanvas",
    category: "social",
    origin: "Kelas Sosial: Orphanage (Panti Asuhan)",
    rarity: "Common",
    flavorText: "Tas kanvas tebal dengan jahitan ganda yang kokoh. Muat buku tebal, bekal, dan perlengkapan kerja sampingan sekaligus.",
    mechanic: "Meningkatkan daya tampung barang bawaan tas. Tidak mudah robek meski terjatuh atau ditarik kuat.",
    actionType: "passive"
  },
  "Buku Harian Rahasia": {
    name: "Buku Harian Rahasia",
    category: "social",
    origin: "Kelas Sosial: Orphanage (Panti Asuhan)",
    rarity: "Uncommon",
    flavorText: "Buku bertali pita tipis tempat mencurahkan kerinduan, mimpi masa depan, dan nama orang yang diam-diam disukai.",
    mechanic: "Menulis di buku harian selama Short Rest memulihkan ekstra +2 Composure dan membersihkan rasa gundah gulana.",
    actionType: "utility"
  },

  // =========================================================================
  // 3. PERALATAN KLUB EKSKUL (CLUB EQUIPMENT)
  // =========================================================================
  // OSIS (Student Council)
  "Kartu Identitas OSIS Resmi": {
    name: "Kartu Identitas OSIS Resmi",
    category: "club",
    origin: "Ekskul: Student Council (OSIS)",
    rarity: "Uncommon",
    flavorText: "Lencana emas berlogo sekolah dengan tali lanyard merah marun. Membuat murid nakal langsung merapikan seragamnya.",
    mechanic: "Memberikan Advantage pada check Looks (Influence) saat menegakkan aturan sekolah dan memungkinkan karakter membubarkan keributan antarmurid.",
    actionType: "passive",
    rollCheck: { stat: "looks", label: "Check Influence (Wibawa OSIS)" }
  },
  "Buku Agenda & Stempel OSIS": {
    name: "Buku Agenda & Stempel OSIS",
    category: "club",
    origin: "Ekskul: Student Council (OSIS)",
    rarity: "Uncommon",
    flavorText: "Buku tebal bersampul kulit hitam berisi jadwal agenda sekolah dan stempel stempel basah resmi presidium OSIS.",
    mechanic: "Dapat digunakan untuk menandatangani surat dispensasi kegiatan, membatalkan sanksi keterlambatan 1 teman per hari.",
    actionType: "utility"
  },
  "Walkie-Talkie Kecil Koordinasi": {
    name: "Walkie-Talkie Kecil Koordinasi",
    category: "club",
    origin: "Ekskul: Student Council (OSIS)",
    rarity: "Uncommon",
    flavorText: "Radio handy talkie dua arah frekuensi tertutup panitia OSIS. Suaranya kresek-kresek khas suara operator lapangan.",
    mechanic: "Berkomunikasi langsung dengan rekan panitia dalam radius 300 meter sekolah bahkan saat jaringan seluler sedang padam.",
    actionType: "utility"
  },

  // Kendo
  "Shinai Bambu Latihan": {
    name: "Shinai Bambu Latihan",
    category: "club",
    origin: "Ekskul: Kendo",
    rarity: "Uncommon",
    flavorText: "Pedang bambu empat bilah terikat tali kulit nakayui. Mengeluarkan suara dentuman keras 'Plaakk!' saat menghantam sasaran.",
    mechanic: "Dapat digunakan sebagai senjata tumpul non-lethal (1d6 + Mod Physique Bludgeoning Damage). Menambah +1 pada check Physique (Power) saat adu kekuatan senjata.",
    actionType: "action",
    rollCheck: { stat: "physique", label: "Serangan Tebasan Shinai" }
  },
  "Seragam Kendogi & Hakama": {
    name: "Seragam Kendogi & Hakama",
    category: "club",
    origin: "Ekskul: Kendo",
    rarity: "Common",
    flavorText: "Pakaian tradisional biru nila gelap dengan lipatan hakama yang anggun dan berwibawa.",
    mechanic: "Kain tebal meredam benturan ringan; memberikan +1 Physical AC saat dipakai berlatih tanding kendo.",
    actionType: "passive"
  },
  "Botol Minyak Shinai": {
    name: "Botol Minyak Shinai",
    category: "club",
    origin: "Ekskul: Kendo",
    rarity: "Common",
    flavorText: "Minyak khusus pelumas bilah bambu agar tidak kering dan berserabut setelah dipakai adu pedang berulang kali.",
    mechanic: "Merawat peralatan kendo agar tidak patah saat menerima benturan serangan kritikal lawan.",
    actionType: "utility"
  },

  // Bela Diri (Martial Arts)
  "Pelindung Tangan (Karate Gloves)": {
    name: "Pelindung Tangan (Karate Gloves)",
    category: "club",
    origin: "Ekskul: Bela Diri (Martial Arts)",
    rarity: "Uncommon",
    flavorText: "Sarung pelindung kepalan tangan merah busa padat berbalut kulit sintetis. Melindungi buku-buku jari saat menghajar samsak.",
    mechanic: "Menambah +1 damage pada seluruh serangan tinju fisik tanpa senjata (Unarmed Strike).",
    actionType: "passive"
  },
  "Seragam Karate/Judo Putih": {
    name: "Seragam Karate/Judo Putih",
    category: "club",
    origin: "Ekskul: Bela Diri (Martial Arts)",
    rarity: "Common",
    flavorText: "Gi katun kanvas putih bersih dengan sabuk warna pertanda tingkatan keahlian bela diri.",
    mechanic: "Memudahkan kuncian dan bantingan; memberikan Advantage saat meloloskan diri dari status cengkeraman (Grappled).",
    actionType: "reaction"
  },
  "Perban Pergelangan Tangan": {
    name: "Perban Pergelangan Tangan",
    category: "club",
    origin: "Ekskul: Bela Diri (Martial Arts)",
    rarity: "Common",
    flavorText: "Lilitan perban elastis putih di pergelangan tangan untuk mengunci sendi agar tidak terkilir saat benturan keras.",
    mechanic: "Mencegah cedera terkilir; memberikan +1 pada saving throw Physique melawan efek dislokasi sendi.",
    actionType: "passive"
  },

  // Olahraga (Sports)
  "Sepatu Olahraga Khusus": {
    name: "Sepatu Olahraga Khusus",
    category: "club",
    origin: "Ekskul: Olahraga (Sports)",
    rarity: "Uncommon",
    flavorText: "Sepatu lari berbantalan udara empuk dengan cengkeraman karet lentur untuk bermanuver kilat di lapangan.",
    mechanic: "Menambah kecepatan gerak dasar sebesar +5 ft (Speed) saat berlari di lantai gym atau lintasan lari terbuka.",
    actionType: "passive"
  },
  "Botol Minum Sport Besar": {
    name: "Botol Minum Sport Besar",
    category: "club",
    origin: "Ekskul: Olahraga (Sports)",
    rarity: "Common",
    flavorText: "Botol 1 liter bertanda takaran air berisi larutan elektrolit ion penangkal dehidrasi berat.",
    mechanic: "Meminumnya saat Short Rest memulihkan tambahan +2 Physical HP seketika.",
    actionType: "utility"
  },
  "Handuk Microfiber Keringat": {
    name: "Handuk Microfiber Keringat",
    category: "club",
    origin: "Ekskul: Olahraga (Sports)",
    rarity: "Common",
    flavorText: "Handuk penyerap keringat cepat kering berlogo tim sekolah. Sering disampirkan di bahu dengan gaya sporty menawan.",
    mechanic: "Menyeka keringat sebelum bicara dengan orang lain; mencegah Disadvantage akibat tampilan lepek kecapaian.",
    actionType: "utility"
  },

  // Teater & Drama
  "Buku Naskah Drama Bercoret-coret": {
    name: "Buku Naskah Drama Bercoret-coret",
    category: "club",
    origin: "Ekskul: Teater & Drama",
    rarity: "Uncommon",
    flavorText: "Naskah drama teater penuh stabilo kuning dan catatan intonasi emosi di tiap margin halamannya.",
    mechanic: "Dapat diimprovisasi saat adu argumen lisan; memberikan Advantage pada check Talent (Performance) saat berakting sandiwara.",
    actionType: "utility",
    rollCheck: { stat: "talent", label: "Check Performance (Akting Naskah)" }
  },
  "Kotak Make-up Panggung Mini": {
    name: "Kotak Make-up Panggung Mini",
    category: "club",
    origin: "Ekskul: Teater & Drama",
    rarity: "Uncommon",
    flavorText: "Peralatan rias panggung berisi foundation tebal, kuas shading, dan cat wajah untuk menciptakan luka palsu dramatis.",
    mechanic: "Dapat membuat efek luka memar buatan atau merombak dandanan dalam 5 menit, memberikan +2 pada check Deception/Bluff.",
    actionType: "utility",
    rollCheck: { stat: "looks", label: "Check Deception (Make-up Penyamaran)" }
  },
  "Kunci Ruang Kostum": {
    name: "Kunci Ruang Kostum",
    category: "club",
    origin: "Ekskul: Teater & Drama",
    rarity: "Rare",
    flavorText: "Kunci kuningan menuju gudang kostum gedung belakang sekolah yang memuat ratusan pakaian dari zaman samurai hingga seragam pelayan kafe.",
    mechanic: "Akses ke ruangan kostum untuk mengambil pakaian penyamaran apa saja sesuai kebutuhan skenario permainan.",
    actionType: "utility"
  },

  // KIR / OSN
  "Kacamata Pelindung Lab": {
    name: "Kacamata Pelindung Lab",
    category: "club",
    origin: "Ekskul: KIR / OSN (Sains)",
    rarity: "Uncommon",
    flavorText: "Goggle bening pelindung mata dari percikan asam kimia dan partikel ledakan kecil laboratorium sains.",
    mechanic: "Memberikan kekebalan terhadap efek silau asap, semprotan cairan ke wajah, dan kebutaan sementara.",
    actionType: "passive"
  },
  "Buku Catatan Eksperimen": {
    name: "Buku Catatan Eksperimen",
    category: "club",
    origin: "Ekskul: KIR / OSN (Sains)",
    rarity: "Uncommon",
    flavorText: "Buku bergaris kotak-kotak kecil berisi grafik reaksi kimia, diagram rangkaian listrik, dan hipotesis ilmiah rumit.",
    mechanic: "Memberikan Advantage pada check Intelligent saat menganalisis substansi misterius, racun, obat, atau anomali lingkungan.",
    actionType: "passive",
    rollCheck: { stat: "intelligent", label: "Check Academic (Analisis Eksperimen)" }
  },
  "Set Tabung Reaksi Kecil": {
    name: "Set Tabung Reaksi Kecil",
    category: "club",
    origin: "Ekskul: KIR / OSN (Sains)",
    rarity: "Uncommon",
    flavorText: "Tiga tabung kaca bertutup karet dalam wadah busa pelindung. Siap diisi sampel cairan atau larutan uji darurat.",
    mechanic: "Dapat digunakan untuk menyimpan atau mencampurkan bahan kimia darurat penimbul asap atau pelemas otot.",
    actionType: "utility"
  },

  // Pramuka / Paskibra
  "Tali Pramuka 10 Meter": {
    name: "Tali Pramuka 10 Meter",
    category: "club",
    origin: "Ekskul: Pramuka / Paskibra",
    rarity: "Common",
    flavorText: "Gulungan tali nilon tebal anyaman kuat yang mampu menahan beban tubuh remaja berayun.",
    mechanic: "Dapat digunakan untuk mengikat lawan (Restrained), memanjat jendela lantai dua, atau membuat simpul tandu darurat.",
    actionType: "utility",
    rollCheck: { stat: "physique", label: "Check Agility (Memanjat Tali)" }
  },
  "Peluit Komando": {
    name: "Peluit Komando",
    category: "club",
    origin: "Ekskul: Pramuka / Paskibra",
    rarity: "Common",
    flavorText: "Peluit logam mengkilap yang menghasilkan bunyi melengking nyaring memecah keheningan lapangan upacara.",
    mechanic: "Mengejutkan lawan dalam jarak dekat; sekali per combat dapat memaksa lawan di sekitarnya membuat Mind save agar tidak kaget (Disadvantage 1 giliran).",
    actionType: "bonus_action"
  },
  "Kompas & Peta Sederhana": {
    name: "Kompas & Peta Sederhana",
    category: "club",
    origin: "Ekskul: Pramuka / Paskibra",
    rarity: "Common",
    flavorText: "Kompas bidik cairan magnetik dan denah cetak area sekolah serta hutan perkemahan belakang bukit.",
    mechanic: "Karakter tidak pernah tersesat dan dapat menemukan rute jalan pintas tersembunyi dengan cepat.",
    actionType: "passive"
  },

  // Pecinta Alam
  "Ransel Gunung Kecil": {
    name: "Ransel Gunung Kecil",
    category: "club",
    origin: "Ekskul: Pecinta Alam",
    rarity: "Uncommon",
    flavorText: "Daypack berbobot ringan dengan kain ripstop antiair dan tali pengikat dada ergonomis.",
    mechanic: "Melindungi barang elektronik dan kertas penting di dalamnya dari basah kuyup meski tercebur ke kolam atau tersiram air.",
    actionType: "passive"
  },
  "Senter Kepala LED": {
    name: "Senter Kepala LED",
    category: "club",
    origin: "Ekskul: Pecinta Alam",
    rarity: "Uncommon",
    flavorText: "Headlamp elastis berpendar putih terang 300 lumen. Menerangi kegelapan lorong sekolah malam hari dengan kedua tangan bebas beraksi.",
    mechanic: "Memberikan penerangan kerucut 40 ft di tempat gelap gulita tanpa perlu memegang senter dengan tangan.",
    actionType: "utility"
  },
  "Korek Api Tahan Angin": {
    name: "Korek Api Tahan Angin",
    category: "club",
    origin: "Ekskul: Pecinta Alam",
    rarity: "Common",
    flavorText: "Korek gas jet api biru yang tidak padam meski ditiup angin kencang di puncak bukit.",
    mechanic: "Mampu menyalakan api unggun, kembang api, atau membakar kertas rahasia dalam kondisi angin kencang dan lembap.",
    actionType: "utility"
  },

  // Klub Penyiaran
  "Earphone Monitor Profesional": {
    name: "Earphone Monitor Profesional",
    category: "club",
    origin: "Ekskul: Klub Penyiaran",
    rarity: "Uncommon",
    flavorText: "Headphone over-ear isolasi suara ketat dengan kabel spiral panjang khas studio siaran radio sekolah.",
    mechanic: "Memberikan bonus +2 pada check Mind (Awareness) untuk mendengarkan bisikan rahasia dari balik pintu atau rekaman suara jarak jauh.",
    actionType: "passive",
    rollCheck: { stat: "mind", label: "Check Awareness (Mendengar Rahasia)" }
  },
  "Blocknote Reporter": {
    name: "Blocknote Reporter",
    category: "club",
    origin: "Ekskul: Klub Penyiaran",
    rarity: "Common",
    flavorText: "Buku saku jilid spiral atas yang bisa dibuka cepat dengan satu tangan untuk mencatat kutipan omongan narasumber.",
    mechanic: "Mencatat bukti pernyataan seseorang secara verbatim; memberi bobot bukti yang tak terbantahkan saat menuntut kebenaran.",
    actionType: "utility"
  },
  "Kartu Pers / ID Media Sekolah": {
    name: "Kartu Pers / ID Media Sekolah",
    category: "club",
    origin: "Ekskul: Klub Penyiaran",
    rarity: "Uncommon",
    flavorText: "ID Card bertuliskan 'PERS SEKOLAH / JURNALISTIK'. Paspor resmi untuk masuk ke area manapun dengan dalih wawancara liputan majalah dinding.",
    mechanic: "Mencegah kecurigaan saat mengambil foto atau merekam percakapan di area publik sekolah.",
    actionType: "passive"
  },

  // Sastra & Literasi
  "Buku Catatan Puisi Pribadi": {
    name: "Buku Catatan Puisi Pribadi",
    category: "club",
    origin: "Ekskul: Sastra & Literasi",
    rarity: "Uncommon",
    flavorText: "Buku bersampul kain motif rintik hujan berisi untaian bait puisi romantis, metafora perasaan kasmaran, dan renungan senja.",
    mechanic: "Membacakan kutipan puitis yang tepat memberikan Advantage pada check Looks (Charm) saat merayu atau menyatakan perasaan cinta.",
    actionType: "action",
    rollCheck: { stat: "looks", label: "Check Charm (Puisi Romantis)" }
  },
  "Pena Fountain Kesayangan": {
    name: "Pena Fountain Kesayangan",
    category: "club",
    origin: "Ekskul: Sastra & Literasi",
    rarity: "Uncommon",
    flavorText: "Pena berujung mata nib perak dengan tinta biru malam yang mengalir anggun di atas serat kertas.",
    mechanic: "Menulis surat cinta atau pesan rahasia dengan kaligrafi indah membuat penerima tersentuh hatinya (+2 Composure penerima).",
    actionType: "utility"
  },
  "Bookmark Kain Bordir Cantik": {
    name: "Bookmark Kain Bordir Cantik",
    category: "club",
    origin: "Ekskul: Sastra & Literasi",
    rarity: "Common",
    flavorText: "Pembatas buku sulaman benang sutra motif bunga sakura yang harum wanginya.",
    mechanic: "Dapat diselipkan ke dalam buku pinjaman untuk gebetan sebagai kode isyarat cinta rahasia.",
    actionType: "utility"
  },

  // Musik & Band
  "Pick Gitar Jimat Keberuntungan": {
    name: "Pick Gitar Jimat Keberuntungan",
    category: "club",
    origin: "Ekskul: Musik & Band",
    rarity: "Uncommon",
    flavorText: "Pick seluloid berbentuk tetesan air dengan logo band rock legendaris. Selalu dikantongi sebelum tampil di panggung festival.",
    mechanic: "Sekali per hari, karakter dapat melakukan reroll pada 1 check Talent (Performance) yang gagal saat memainkan instrumen musik.",
    actionType: "reaction",
    rollCheck: { stat: "talent", label: "Check Performance (Solo Musik)" }
  },
  "Kabel Audio Pendek": {
    name: "Kabel Audio Pendek",
    category: "club",
    origin: "Ekskul: Musik & Band",
    rarity: "Common",
    flavorText: "Kabel jack audio 6.5mm ke 3.5mm berlapis karet tebal. Serbaguna untuk alat musik maupun tali pengikat darurat.",
    mechanic: "Dapat menyambungkan perangkat audio ke amplifier speaker sekolah untuk memutar musik keras pengacau konsentrasi.",
    actionType: "utility"
  },
  "Pelindung Telinga (Ear Plugs)": {
    name: "Pelindung Telinga (Ear Plugs)",
    category: "club",
    origin: "Ekskul: Musik & Band",
    rarity: "Common",
    flavorText: "Sumbat telinga silikon peredam desibel tinggi tanpa merusak kualitas nada musik.",
    mechanic: "Memberikan kekebalan terhadap serangan suara memekakkan telinga atau efek jeritan bising di sekitarnya.",
    actionType: "passive"
  },

  // Seni Rupa & Lukis
  "Set Kuas Cat Minyak Mini": {
    name: "Set Kuas Cat Minyak Mini",
    category: "club",
    origin: "Ekskul: Seni Rupa & Lukis",
    rarity: "Uncommon",
    flavorText: "Tiga kuas bulu musang halus berbagai ukuran dalam tabung bambu pelindung.",
    mechanic: "Dapat melukis sketsa potret wajah ekspresif seseorang dalam hitungan menit; lukisan potret memberikan kenangan indah bernilai afeksi tinggi.",
    actionType: "utility",
    rollCheck: { stat: "talent", label: "Check Creative (Melukis Potret)" }
  },
  "Buku Sketsa A5": {
    name: "Buku Sketsa A5",
    category: "club",
    origin: "Ekskul: Seni Rupa & Lukis",
    rarity: "Common",
    flavorText: "Buku kertas gambar tebal bertekstur kasar. Memuat sketsa denah sekolah, pemandangan atap, dan gambar curi-curi sosok sang pujaan hati.",
    mechanic: "Dapat digunakan untuk menggambar sketsa wajah pelaku misterius atau rute denah rahasia dengan akurasi tinggi.",
    actionType: "utility"
  },
  "Celemek Berlumur Cat Seni": {
    name: "Celemek Berlumur Cat Seni",
    category: "club",
    origin: "Ekskul: Seni Rupa & Lukis",
    rarity: "Common",
    flavorText: "Celemek katun cokelat berhias percikan cat akrilik warna-warni yang memberi aura seniman sejati.",
    mechanic: "Memberikan +1 pada check Looks (Aura) saat tampil dengan persona seniman berjiwa bebas dan kreatif.",
    actionType: "passive"
  },

  // =========================================================================
  // 4. CIRI KHAS ARCHETYPE (ARCHETYPE EQUIPMENT)
  // =========================================================================
  // Delinquent
  "Plester Luka Banyak": {
    name: "Plester Luka Banyak",
    category: "archetype",
    origin: "Archetype: Delinquent (Berandalan)",
    rarity: "Common",
    flavorText: "Satu kotak plester luka steril bermotif polos. Sering ditempel di hidung, pelipis, atau buku jari setelah baku hantam.",
    mechanic: "Menutup luka goresan; memulihkan 1 Physical HP secara instan (dapat digunakan hingga 3 kali per Long Rest).",
    actionType: "consumable"
  },
  "Jaket Bomber Modifikasi Keren": {
    name: "Jaket Bomber Modifikasi Keren",
    category: "archetype",
    origin: "Archetype: Delinquent (Berandalan)",
    rarity: "Uncommon",
    flavorText: "Jaket tebal dengan bordir naga di punggung dan kerah berdiri. Memberi siluet intimidatif yang membuat preman jalanan segan.",
    mechanic: "Memberikan +1 Physical AC terhadap serangan pukulan fisik biasa dan Advantage pada check Looks (Aura / Intimidasi).",
    actionType: "passive",
    rollCheck: { stat: "looks", label: "Check Aura (Intimidasi Jaket Berandalan)" }
  },
  "Permen Karet Mint": {
    name: "Permen Karet Mint",
    category: "archetype",
    origin: "Archetype: Delinquent (Berandalan)",
    rarity: "Common",
    flavorText: "Permen karet rasa menthol kuat. Dikunyah santai sambil memasukkan kedua tangan ke saku celana.",
    mechanic: "Mengunyah permen karet menenangkan saraf yang tegang; memulihkan 1 Composure saat menghadapi situasi tertekan.",
    actionType: "consumable"
  },

  // Jock
  "Protein Bar / Suplemen Energi": {
    name: "Protein Bar / Suplemen Energi",
    category: "archetype",
    origin: "Archetype: Jock (Atlet Populer)",
    rarity: "Common",
    flavorText: "Camilan padat protein cokelat kacang dengan kandungan asam amino pemulih serat otot atlet.",
    mechanic: "Dimakan saat pertarungan atau latihan: Memberikan 2 Temporary HP (HP cadangan) selama 1 jam ke depan.",
    actionType: "consumable"
  },
  "Pelindung Lutut Tipis": {
    name: "Pelindung Lutut Tipis",
    category: "archetype",
    origin: "Archetype: Jock (Atlet Populer)",
    rarity: "Common",
    flavorText: "Knee pad elastis berbusa lembut yang mencegah cedera lutut lecet saat meluncur menjatuhkan diri di lapangan.",
    mechanic: "Memberikan Advantage pada saving throw Physique melawan efek tersungkur jatuh (Prone).",
    actionType: "reaction"
  },
  "Topi Olahraga Branded": {
    name: "Topi Olahraga Branded",
    category: "archetype",
    origin: "Archetype: Jock (Atlet Populer)",
    rarity: "Common",
    flavorText: "Topi bisbol berlidah melengkung yang sering diputar ke belakang saat mulai serius beraksi.",
    mechanic: "Melindungi pandangan dari silau terik matahari; memberikan +1 pada check Physique (Agility) di luar ruangan.",
    actionType: "passive"
  },

  // Nerd
  "Kalkulator Saintifik Canggih": {
    name: "Kalkulator Saintifik Canggih",
    category: "archetype",
    origin: "Archetype: Nerd (Kutu Buku / Jenius)",
    rarity: "Uncommon",
    flavorText: "Kalkulator grafik dengan layar dua baris rumus matriks. Mampu menghitung sudut kemiringan lemparan dan probabilitas dalam sekejap mata.",
    mechanic: "Dapat digunakan untuk memprediksi sudut lemparan bola atau lintasan gerak musuh; memberikan +2 pada roll serangan jarak jauh berikutnya.",
    actionType: "bonus_action"
  },
  "Kain Lap Kacamata Microfiber": {
    name: "Kain Lap Kacamata Microfiber",
    category: "archetype",
    origin: "Archetype: Nerd (Kutu Buku / Jenius)",
    rarity: "Common",
    flavorText: "Kain lembut pembersih lensa kacamata dari debu dan uap panas kuah mie ramen.",
    mechanic: "Membersihkan kacamata seketika; menghilangkan efek pandangan kabur (Blinded ringan) dalam 1 giliran gratis.",
    actionType: "bonus_action"
  },
  "Stabilo Warna-warni Lengkap": {
    name: "Stabilo Warna-warni Lengkap",
    category: "archetype",
    origin: "Archetype: Nerd (Kutu Buku / Jenius)",
    rarity: "Common",
    flavorText: "Set enam warna highlighter neon untuk menandai kata kunci penting di dokumen atau lembar peta.",
    mechanic: "Membantu menyusun rencana taktis bersama teman; seluruh tim mendapat bonus +1 pada giliran pertama rencana dilaksanakan.",
    actionType: "utility"
  },

  // Class Clown
  "Sticky Note Lucu-Lucu": {
    name: "Sticky Note Lucu-Lucu",
    category: "archetype",
    origin: "Archetype: Class Clown (Badut Kelas)",
    rarity: "Common",
    flavorText: "Kertas memo tempel berbentuk kucing dan emotikon konyol untuk ditempel di punggung teman atau loker tanpa ketahuan.",
    mechanic: "Menempelkan memo ejekan atau pesan rahasia; check Agility (Stealth) sukses membuat target tidak menyadarinya sampai jam pulang sekolah.",
    actionType: "utility",
    rollCheck: { stat: "physique", label: "Check Stealth (Tempel Memo Jahil)" }
  },
  "Koin Sulap Palsu": {
    name: "Koin Sulap Palsu",
    category: "archetype",
    origin: "Archetype: Class Clown (Badut Kelas)",
    rarity: "Uncommon",
    flavorText: "Koin sulap bergambar ganda yang bisa diputar di sela-sela jari tangan untuk trik sulap jarak dekat (close-up magic).",
    mechanic: "Mencairkan suasana kaku dan menarik perhatian orang banyak; memberikan Advantage pada check Talent (Performance / Icebreaker).",
    actionType: "action",
    rollCheck: { stat: "talent", label: "Check Performance (Trik Sulap Koin)" }
  },
  "Buku Lelucon Kecil Tersembunyi": {
    name: "Buku Lelucon Kecil Tersembunyi",
    category: "archetype",
    origin: "Archetype: Class Clown (Badut Kelas)",
    rarity: "Common",
    flavorText: "Buku saku berisi seratus tebak-tebakan garing dan lelucon pelesetan kata untuk memancing tawa di saat suasana tegang.",
    mechanic: "Menceritakan lelucon dapat mengalihkan perhatian musuh atau memulihkan 2 Composure teman yang sedang salting/gugup.",
    actionType: "action"
  },

  // Emo / Serius
  "Earphone Noise-Cancelling": {
    name: "Earphone Noise-Cancelling",
    category: "archetype",
    origin: "Archetype: Emo / Serius",
    rarity: "Uncommon",
    flavorText: "Headphone over-ear hitam pekat dengan tombol peredam bising aktif. Menutup seluruh obrolan basi dunia luar demi kedamaian batin.",
    mechanic: "Memberikan kekebalan terhadap provokasi verbal, ejekan sosial, dan bisikan gosip; +2 Mind Saving Throw melawan serangan Composure.",
    actionType: "passive"
  },
  "Buku Harian Terkunci": {
    name: "Buku Harian Terkunci",
    category: "archetype",
    origin: "Archetype: Emo / Serius",
    rarity: "Uncommon",
    flavorText: "Buku tebal bersampul beludru hitam dengan gembok kode mini. Menyimpan rahasia terdalam dan puisi kegelapan yang tak boleh dibaca siapapun.",
    mechanic: "Menyimpan catatan rahasia dan rencana terselubung. Karakter yang mencoba mengintip harus lolos check Intelligent DC 15 atau gagal membukanya.",
    actionType: "utility"
  },
  "Gelang Karet Hitam Beberapa": {
    name: "Gelang Karet Hitam Beberapa",
    category: "archetype",
    origin: "Archetype: Emo / Serius",
    rarity: "Common",
    flavorText: "Lingkaran gelang karet silikon hitam di pergelangan tangan kiri. Kerap ditarik-sentil ke kulit untuk menenangkan debaran kecemasan.",
    mechanic: "Sentilan karet meredam serangan panik; sekali per pertempuran dapat membatalkan kondisi Frightened atau Salting berat.",
    actionType: "reaction"
  },

  // Weeb / Otaku
  "Gantungan Tas Pin Anime Banyak": {
    name: "Gantungan Tas Pin Anime Banyak",
    category: "archetype",
    origin: "Archetype: Weeb / Otaku",
    rarity: "Common",
    flavorText: "Tas sekolah 'Ita-bag' berhias puluhan pin enamel karakter waifu/husbando favorit yang berkilauan di bawah lampu lorong.",
    mechanic: "Menarik perhatian sesama otaku; otomatis memulai obrolan akrab dengan sesama penggemar tanpa perlu check sosial.",
    actionType: "passive"
  },
  "Keychain Karakter Favorit": {
    name: "Keychain Karakter Favorit",
    category: "archetype",
    origin: "Archetype: Weeb / Otaku",
    rarity: "Common",
    flavorText: "Gantungan akrilik karakter anime kesayangan yang selalu digenggam saat butuh dorongan moral.",
    mechanic: "Memberikan dorongan semangat batin; sekali per hari memberikan +1 bonus pada lemparan d20 apapun yang melibatkan harga diri.",
    actionType: "reaction"
  },
  "Buku Manga Kecil": {
    name: "Buku Manga Kecil",
    category: "archetype",
    origin: "Archetype: Weeb / Otaku",
    rarity: "Common",
    flavorText: "Volume komik manga aksi shounen edisi terbaru yang diselipkan di sela buku pelajaran sekolah.",
    mechanic: "Membaca adegan klimaks manga membakar adrenalin; memulihkan 2 Composure saat istirahat sepulang sekolah.",
    actionType: "utility"
  },

  // Popular Kids
  "Lipbalm / Lip Tint Mewah": {
    name: "Lipbalm / Lip Tint Mewah",
    category: "archetype",
    origin: "Archetype: Popular Kids (Idola Sekolah)",
    rarity: "Uncommon",
    flavorText: "Pelembap bibir aroma stroberi dalam wadah emas berkilau. Menjadikan senyuman selalu memikat dan berkilau segar.",
    mechanic: "Mengoleskannya sebelum berbicara memberikan bonus +1 pada check Looks (Charm) saat berhadapan langsung dengan lawan bicara.",
    actionType: "bonus_action",
    rollCheck: { stat: "looks", label: "Check Charm (Senyuman Memikat)" }
  },
  "Cermin Kompak Branded": {
    name: "Cermin Kompak Branded",
    category: "archetype",
    origin: "Archetype: Popular Kids (Idola Sekolah)",
    rarity: "Uncommon",
    flavorText: "Cermin lipat dua sisi dengan perbesaran optik dan lampu LED kecil di tepinya.",
    mechanic: "Dapat digunakan untuk mengintip ke sudut lorong tanpa harus menampakkan kepala; Advantage pada check Mind (Awareness) untuk mengintai.",
    actionType: "utility",
    rollCheck: { stat: "mind", label: "Check Awareness (Intip Cermin)" }
  },
  "Kartu Nama Murid (Custom)": {
    name: "Kartu Nama Murid (Custom)",
    category: "archetype",
    origin: "Archetype: Popular Kids (Idola Sekolah)",
    rarity: "Common",
    flavorText: "Kartu nama mini bergaya desainer berisi username medsos, zodiak, dan nomor kontak LIME.",
    mechanic: "Meninggalkan kartu nama ini kepada NPC/pemain lain mempermudah komunikasi tindak lanjut dan menambah popularitas reputasi.",
    actionType: "utility"
  },

  // Normies
  "Bento Box Standar": {
    name: "Bento Box Standar",
    category: "archetype",
    origin: "Archetype: Normies (Murid Biasa)",
    rarity: "Common",
    flavorText: "Kotak bekal makan plastik sederhana dengan lauk pauk bergizi seimbang buatan rumah.",
    mechanic: "Memulihkan 2 HP dan 2 Composure saat disantap di atap sekolah atau kelas bersama teman.",
    actionType: "consumable"
  },
  "Botol Minum Polos": {
    name: "Botol Minum Polos",
    category: "archetype",
    origin: "Archetype: Normies (Murid Biasa)",
    rarity: "Common",
    flavorText: "Botol air minum plastik bening tanpa merk mencolok. Efisien dan ramah lingkungan.",
    mechanic: "Menjaga kondisi fisik tetap prima; kebal terhadap efek dehidrasi ringan selama aktivitas sekolah.",
    actionType: "passive"
  },
  "Pensil Cadangan (Banyak)": {
    name: "Pensil Cadangan (Banyak)",
    category: "archetype",
    origin: "Archetype: Normies (Murid Biasa)",
    rarity: "Common",
    flavorText: "Satu ikat pensil 2B yang sudah diraut runcing rapi. Selalu siap sedia meminjamkan ke siapa saja yang kebingungan.",
    mechanic: "Reputasi anak baik: Meminjamkan pensil cadangan saat ujian membangun simpati positif dari guru dan teman sekelas (+1 Interpersonal).",
    actionType: "passive"
  },

  // =========================================================================
  // 5. JIMAT & KENANGAN (KEEPSAKES — SPECIAL)
  // =========================================================================
  "Jimat Omamori Cinta (Kuil)": {
    name: "Jimat Omamori Cinta (Kuil)",
    category: "keepsake",
    origin: "Benda Kenangan Kuil Shinto",
    rarity: "Special Keepsake",
    flavorText: "Kantung kain brokat merah muda bertuliskan kanji 'Enmusubi' (Ikatan Hati). Dibeli saat festival kuil musim panas dan selalu dijaga kesuciannya.",
    mechanic: "Restu Dewi Kuil: Sekali per sesi, saat melakukan lemparan dadu terkait asmara (Check Relationship Luck, Charm, atau momen pengakuan cinta/confess), pemain dapat mengaktifkan jimat ini untuk mendapatkan ADVANTAGE MUTLAK pada lemparan d20 tersebut!",
    actionType: "reaction",
    rollCheck: { stat: "luck", label: "Aktivasi Omamori Cinta (Advantage)" }
  },
  "Cincin / Bandul Janji Masa Lalu": {
    name: "Cincin / Bandul Janji Masa Lalu",
    category: "keepsake",
    origin: "Benda Kenangan Masa Kecil",
    rarity: "Special Keepsake",
    flavorText: "Bandul perak sederhana yang dikenakan di balik seragam sekolah, menjadi pengingat janji suci masa kecil di bawah pohon rindang.",
    mechanic: "Tekad Tak Tergoyahkan: Sekali per sesi, saat Composure karakter turun menjadi 0 (hampir mengalami Social Meltdown), bandul ini menahan karakter agar tetap bertahan di 1 Composure.",
    actionType: "reaction"
  },
  "Foto Kenangan Bersama": {
    name: "Foto Kenangan Bersama",
    category: "keepsake",
    origin: "Benda Kenangan Masa Lalu",
    rarity: "Special Keepsake",
    flavorText: "Foto cetak bertepi putih yang memperlihatkan tawa lepas bersama sosok yang paling berharga sebelum terpisah oleh jarak.",
    mechanic: "Menatap foto ini di saat hening memulihkan 1d6 Composure seketika dan menghapus status ketakutan batin.",
    actionType: "utility"
  }
};

/**
 * Get full item details with heuristic fallback for custom items
 */
export function getItemDetails(itemName: string): ItemDefinition {
  if (!itemName) {
    return {
      name: "Barang Misterius",
      category: "custom",
      origin: "Tas Sekolah",
      rarity: "Common",
      flavorText: "Barang tak dikenal yang terselip di saku tas.",
      mechanic: "Dapat digunakan sebagai alat bantu naratif sesuai arahan Dungeon Master (DM Fiat).",
      actionType: "utility"
    };
  }

  const cleanName = itemName.trim();

  // 1. Exact match
  if (MASTER_ITEM_REGISTRY[cleanName]) {
    return MASTER_ITEM_REGISTRY[cleanName];
  }

  // 2. Case-insensitive match
  const lowerName = cleanName.toLowerCase();
  for (const key of Object.keys(MASTER_ITEM_REGISTRY)) {
    if (key.toLowerCase() === lowerName) {
      return MASTER_ITEM_REGISTRY[key];
    }
  }

  // 3. Substring match
  for (const key of Object.keys(MASTER_ITEM_REGISTRY)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return MASTER_ITEM_REGISTRY[key];
    }
  }

  // 4. Intelligent Procedural Fallback for Custom Items added by user
  const isKeepsakeLike = lowerName.includes("jimat") || lowerName.includes("omamori") || lowerName.includes("cincin") || lowerName.includes("kenangan") || lowerName.includes("surat cinta") || lowerName.includes("foto");

  return {
    name: cleanName,
    category: isKeepsakeLike ? "keepsake" : "custom",
    origin: isKeepsakeLike ? "Benda Kenangan Pribadi" : "Barang Bawaan Unik",
    rarity: isKeepsakeLike ? "Special Keepsake" : "Uncommon",
    flavorText: `Barang khusus yang dibawa oleh karakter: "${cleanName}". Menyimpan makna tersendiri dalam dinamika kehidupan sekolah dan interaksi harian.`,
    mechanic: isKeepsakeLike
      ? "Memiliki ikatan emosional kuat: Sekali per sesi memberikan inspirasi roleplay atau Advantage pada interaksi dengan tokoh yang berkaitan dengan barang ini (DM Fiat)."
      : "Alat bantu situasional: Dapat digunakan untuk menyelesaikan masalah spesifik dalam skenario atau memberikan +1 bonus situasional sesuai persetujuan Dungeon Master.",
    actionType: "utility"
  };
}
