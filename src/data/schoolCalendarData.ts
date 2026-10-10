import type {
  SchoolCalendarMonth,
  SchoolCalendarMonthId,
  SchoolCalendarMonthStatus,
  SchoolCalendarState,
  SchoolDailyRoutineItem,
  SchoolRomanceArcStage,
  SchoolTraditionItem
} from "../types";

export const SCHOOL_MONTH_ORDER: SchoolCalendarMonthId[] = [
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "january",
  "february",
  "march"
];

export const SCHOOL_ROMANCE_ARCS: SchoolRomanceArcStage[] = [
  {
    id: "curiosity",
    monthsLabel: "April – Mei",
    title: "Fase 1: Curiosity (Rasa Penasaran)",
    subtitle: "Awal Hubungan & Ikatan Pertama",
    description:
      "Pertemuan pertama di masa orientasi, kesan awal yang sedikit salah paham, serta perhatian-perhatian kecil di sela jadwal kelas dan belajar bersama yang mulai tumbuh.",
    icon: "🌸",
    monthIds: ["april", "may"]
  },
  {
    id: "trust",
    monthsLabel: "Juni – Juli",
    title: "Fase 2: Trust (Kepercayaan)",
    subtitle: "Kompetisi Olahraga & Tekanan Ekspektasi",
    description:
      "Kompetisi Taiikusai dan tekanan ujian akhir semester pertama memperlihatkan sisi rapuh serta ketakutan masing-masing karakter di balik topeng siswa akademi elite.",
    icon: "☔",
    monthIds: ["june", "july"]
  },
  {
    id: "attraction",
    monthsLabel: "Agustus – September",
    title: "Fase 3: Attraction (Ketertarikan)",
    subtitle: "Malam Kembang Api & Pasangan Panggung",
    description:
      "Liburan musim panas di luar kelas, festival kembang api dengan yukata, serta latihan peran utama di panggung Bunkasai membuat perasaan makin sulit disembunyikan.",
    icon: "🎆",
    monthIds: ["august", "september"]
  },
  {
    id: "jealousy_honesty",
    monthsLabel: "Oktober – November",
    title: "Fase 4: Jealousy & Honesty (Cemburu & Kejujuran)",
    subtitle: "Konsekuensi Festival & Perjalanan Kyoto–Nara",
    description:
      "Manuver rival dan kesalahpahaman pasca-festival memaksa karakter untuk jujur membicarakan kecemburuan saat perjalanan menginap Shūgaku Ryokō.",
    icon: "🍁",
    monthIds: ["october", "november"]
  },
  {
    id: "distance_choice",
    monthsLabel: "Desember – Januari",
    title: "Fase 5: Distance & Choice (Jarak & Pilihan)",
    subtitle: "Jarak Musim Dingin & Resolusi Tahun Baru",
    description:
      "Kesibukan ujian akhir dan acara keluarga menguji kekuatan ikatan ketika jarang bertemu. Pertemuan di shrine saat Tahun Baru mendorong karakter berhenti menunggu dan mulai mengambil inisiatif.",
    icon: "❄️",
    monthIds: ["december", "january"]
  },
  {
    id: "confession_commitment",
    monthsLabel: "Februari – Maret",
    title: "Fase 6: Confession & Commitment (Pengakuan & Komitmen)",
    subtitle: "Hari Valentine, Kelulusan Senior & Menuju Kelas 11",
    description:
      "Pengakuan perasaan yang jujur di Hari Valentine, perpisahan emosional dengan senior kelas 12 yang lulus, serta janji bersama di gerbang akademi sebelum naik ke Kelas 11.",
    icon: "💝",
    monthIds: ["february", "march"]
  }
];

export const SCHOOL_ELITE_TRADITIONS: SchoolTraditionItem[] = [
  {
    id: "trad_academic_awards",
    title: "Academic Excellence Awards",
    japaneseSubtitle: "成績優秀者表彰 · Penghargaan Prestasi Akademik",
    timingLabel: "Juli & Oktober (Pasca-Evaluasi Semester)",
    description:
      "Penghargaan tahunan bergengsi untuk siswa dengan peringkat akademik tertinggi di tiap angkatan. Peringkat diumumkan secara terbuka di papan kehormatan aula utama.",
    storyPotential:
      "Menciptakan rivalitas akademik dan tekanan keluarga bangsawan/donatur, terutama ketika protagonis meraih skor mengejutkan atau melihat beban berat di pundak sang siswa teladan.",
    icon: "🏅"
  },
  {
    id: "trad_student_council_reception",
    title: "Student Council Reception",
    japaneseSubtitle: "生徒会歓迎会 · Jamuan Dewan Siswa (OSIS)",
    timingLabel: "April – Mei (Awal Semester Pertama)",
    description:
      "Sesi penerimaan dan seleksi anggota organisasi siswa serta perwakilan komite kelas di aula resmi akademi.",
    storyPotential:
      "Mempertemukan protagonis dengan senior kelas 12 yang berpengaruh, membuka dinamika kekuasaan antar-klub, serta reputasi sosial di lingkungan elite.",
    icon: "👑"
  },
  {
    id: "trad_founders_day_gala",
    title: "Founder's Day Gala",
    japaneseSubtitle: "創立記念祝賀会 · Perayaan Pendiri Akademi",
    timingLabel: "Oktober (Musim Gugur)",
    description:
      "Perayaan ulang tahun pendiri akademi dengan pidato kehormatan, pameran sejarah sekolah, dan jamuan formal yang turut dihadiri alumni serta keluarga donatur.",
    storyPotential:
      "Panggung sempurna untuk konflik kelas sosial (siswa beasiswa vs keluarga berada), dansa formal yang canggung, atau intervensi orang tua Love Interest.",
    icon: "🏛️"
  },
  {
    id: "trad_club_succession",
    title: "Club Succession Ceremony",
    japaneseSubtitle: "部活引き継ぎ式 · Serah Terima Kepemimpinan Klub",
    timingLabel: "Februari – Maret (Menjelang Kelulusan Senior)",
    description:
      "Upacara internal sakral saat siswa senior kelas 12 menyerahkan jabatan ketua klub dan lambang kepengurusan kepada generasi junior.",
    storyPotential:
      "Momen pendewasaan ketika protagonis dan rekan seangkatannya dipercaya memegang tanggung jawab baru sebelum resmi naik ke Kelas 11.",
    icon: "⚔️"
  }
];

export const SCHOOL_DAILY_ROUTINES: SchoolDailyRoutineItem[] = [
  {
    id: "routine_homeroom",
    title: "Homeroom (Wali Kelas & Kelas Tetap)",
    japaneseTerm: "ホームルーム (HR)",
    description:
      "Setiap pagi dan sore dimulai di ruang kelas tetap bersama wali kelas. Banyak pengumuman festival, pembagian kelompok, dan interaksi sebangku terjadi di sini.",
    gameplayHook: "Kesempatan lempar dadu Insight / Perception untuk memperhatikan perubahan suasana hati teman sekelas.",
    icon: "🏫"
  },
  {
    id: "routine_cleaning",
    title: "Cleaning Time (Piket Kebersihan)",
    japaneseTerm: "清掃 (Seisō)",
    description:
      "Siswa bergiliran membersihkan ruang kelas, lorong, perpustakaan, dan area halaman sekolah setelah jam pelajaran berakhir.",
    gameplayHook: "Alasan alami bagi dua karakter untuk tertinggal berdua di ruang kelas atau gudang olahraga saat matahari terbenam.",
    icon: "🧹"
  },
  {
    id: "routine_club",
    title: "After-School Club (Kegiatan Ekskul Sore)",
    japaneseTerm: "部活動 (Bukatsudō)",
    description:
      "Latihan klub olahraga, musik, seni, dan akademik sepulang sekolah yang menjadi panggung utama perkembangan keahlian serta persahabatan.",
    gameplayHook: "Tempat mengasah fitur Ekskul, menghadapi rival, atau menunggu seseorang selesai latihan di gerbang sekolah.",
    icon: "🏆"
  },
  {
    id: "routine_test_week",
    title: "Test Week (Pekan Ujian & Larangan Ekskul)",
    japaneseTerm: "試験週間 (Shiken Shūkan)",
    description:
      "Satu minggu sebelum UTS/UAS di mana kegiatan klub dihentikan sementara dan perpustakaan maupun kafe sekitar sekolah penuh oleh kelompok belajar.",
    gameplayHook: "Memicu sesi belajar bersama (Study Session), pertaruhan peringkat angkatan, dan bantuan akademik antar-karakter.",
    icon: "📚"
  },
  {
    id: "routine_senpai_kohai",
    title: "Senpai–Kōhai (Hierarki Senior & Junior)",
    japaneseTerm: "先輩・後輩",
    description:
      "Hubungan antara kakak kelas (Kelas 11 & 12) dan adik kelas (Kelas 10) yang memengaruhi etika berbicara, bimbingan klub, hingga dinamika romansa.",
    gameplayHook: "Memberikan mentor yang bijaksana sekaligus batas waktu emosional karena senior kelas 12 akan lulus di bulan Maret.",
    icon: "🎓"
  },
  {
    id: "routine_classroom_duties",
    title: "Classroom Duties (Komite & Petugas Kelas)",
    japaneseTerm: "クラス委員・日直",
    description:
      "Petugas harian, ketua kelas, dan komite festival memberikan tanggung jawab bersama yang memaksa dua karakter dengan sifat bertolak belakang untuk bekerja sama.",
    gameplayHook: "Mengantar buku tugas ke ruang guru bersama atau rapat anggaran Bunkasai hingga sore hari.",
    icon: "📋"
  }
];

export const SCHOOL_CALENDAR_MONTHS: SchoolCalendarMonth[] = [
  {
    id: "april",
    order: 1,
    name: "April",
    shortName: "Apr",
    englishTitle: "The First Encounter",
    arcLabel: "Arc 01 · Awal Tahun Ajaran & Pertemuan Pertama",
    romanceStageId: "curiosity",
    romanceStageName: "Curiosity (Rasa Penasaran)",
    semesterLabel: "Semester 1 · Musim Semi",
    seasonIcon: "🌸",
    mainEventTitle: "入学式 (Nyūgakushiki) & 始業式 (Shigyōshiki) — Penerimaan Siswa Baru",
    summary:
      "Tahun ajaran SMA Jepang dimulai di bawah guguran bunga sakura. Siswa baru Kelas 10 (Kōkō Ichinensei) menghadiri upacara megah, menerima pembagian kelas, bertemu teman sebangku, mengikuti tes penempatan awal, dan menyaksikan demonstrasi perekrutan klub.",
    memorableSceneTitle: "Koridor Sepi & Kartu Perpustakaan",
    memorableSceneStory:
      "Protagonis hampir terlambat menemukan ruang kelas karena gedung utama akademi terlalu luas, lalu berpapasan dengan Love Interest di koridor sepi dengan sedikit salah paham—sebelum menyadari mereka duduk berdekatan di kelas yang sama. Beberapa hari kemudian, protagonis menemukan kartu perpustakaan milik sang tokoh dan mengembalikannya.",
    conflictSeed:
      "Love Interest dikenal sebagai siswa terbaik angkatan yang tampak tak tersentuh, namun protagonis meraih nilai tes kemampuan awal yang mengejutkan. Hubungan mereka berawal dari rasa penasaran dan kompetisi halus.",
    events: [
      {
        id: "evt_apr_01",
        monthId: "april",
        periodLabel: "Minggu 1",
        title: "Upacara Penerimaan Siswa Baru (Nyūgakushiki) & Pembukaan (Shigyōshiki)",
        japaneseTerm: "入学式・始業式",
        category: "Wajib",
        description: "Razia kerapian seragam pagi di gerbang sakura oleh Komite Disiplin, upacara resmi di aula megah akademi, pidato kepala sekolah, serta sambutan Ketua OSIS & perwakilan siswa baru.",
        isKeyEvent: true,
        featuredNpcs: [
          { slug: "kisaragi_setsuna", name: "Kisaragi Setsuna", role: "Wakil Ketua OSIS & Komite Disiplin (11-2)", isNewCanon: true },
          { slug: "kujou_reiko", name: "Kujou Reiko", role: "Kepala Sekolah & Ketua Yayasan" },
          { slug: "asahina_tenka", name: "Asahina Tenka", role: "Ketua OSIS (11-1)" },
          { slug: "shinonome_shion", name: "Shinonome Shion", role: "Perwakilan Siswa Baru Peringkat 1 (10-1)" }
        ]
      },
      {
        id: "evt_apr_02",
        monthId: "april",
        periodLabel: "Minggu 1",
        title: "Pembagian Kelas 10, Perkenalan Wali Kelas & Pemilihan Ketua Kelas",
        japaneseTerm: "クラス発表・HR",
        category: "Akademik",
        description: "Melihat papan pengumuman pembagian kelas, pengarahan wali kelas di koridor Kelas 10, menentukan tempat duduk sebangku, dan memilih pengurus komite kelas.",
        featuredNpcs: [
          { slug: "tsukishima_reo", name: "Tsukishima Reo", role: "Wali Kelas 10-1 & Guru Bahasa Inggris" },
          { slug: "saionji_kaede", name: "Saionji Kaede", role: "Wali Kelas 10-2 & Guru Olahraga", isNewCanon: true },
          { slug: "shinonome_shion", name: "Shinonome Shion", role: "Ketua Kelas 10-1" },
          { slug: "kurokawa_yuuto", name: "Kurokawa Yuuto", role: "Wakil Ketua Kelas 10-1" }
        ]
      },
      {
        id: "evt_apr_03",
        monthId: "april",
        periodLabel: "Minggu 1–2",
        title: "Orientasi Kampus, Pemeriksaan Kesehatan & Tes Kemampuan Awal",
        japaneseTerm: "実力テスト・健康診断",
        category: "Ujian",
        description: "Tur fasilitas gedung klasik & Perpustakaan Besar (pembagian kartu perpustakaan), pengukuran fisik tahunan di ruang UKS (Hokenshitsu), tes kebugaran lapangan, dan ujian penempatan akademik pertama.",
        featuredNpcs: [
          { slug: "shiranui_mei", name: "dr. Shiranui Mei", role: "Dokter/Perawat UKS (Hokenshitsu)", isNewCanon: true },
          { slug: "tsukishima_fumiko", name: "Tsukishima Fumiko", role: "Staf Pustakawan Utama & Arsip Akademik", isNewCanon: true },
          { slug: "saionji_kaede", name: "Saionji Kaede", role: "Koordinator Tes Fisik Lapangan", isNewCanon: true }
        ]
      },
      {
        id: "evt_apr_04",
        monthId: "april",
        periodLabel: "Minggu 2–3",
        title: "Pekan Pengenalan & Perekrutan Klub (Club Recruitment)",
        japaneseTerm: "新入部員勧誘",
        category: "Ekskul",
        description: "Klub olahraga dan bela diri mengadakan demonstrasi tanding di gymnasium, sementara klub drama, musik, dan budaya menggelar pertunjukan panggung untuk memikat siswa baru.",
        isKeyEvent: true,
        featuredNpcs: [
          { slug: "tachibana_rin", name: "Tachibana Rin", role: "Ketua Klub Kendo (12-1)", isNewCanon: true },
          { slug: "saegusa_koharu", name: "Saegusa Koharu", role: "Ketua Klub Drama (12-1)", isNewCanon: true },
          { slug: "yukimura_shizuku", name: "Yukimura Shizuku", role: "Wakil Ketua Klub Kyūdō (11-1)" },
          { slug: "minami_hoshino", name: "Minami Hoshino", role: "Vokalis Light Music Club (10-1)" }
        ]
      },
      {
        id: "evt_apr_05",
        monthId: "april",
        periodLabel: "Minggu 4",
        title: "Pendaftaran Resmi Ekskul & Adaptasi Rutinitas Sepulang Sekolah",
        japaneseTerm: "入部届提出",
        category: "Slice of Life",
        description: "Menyerahkan formulir pendaftaran klub (Nyūbu Todoke) ke meja OSIS, sambutan hangat di ruang klub & ruang tata boga, serta memulai jadwal piket kebersihan (Seisō) dan latihan sore.",
        featuredNpcs: [
          { slug: "wakaba_hinata", name: "Wakaba Hinata", role: "Ketua Klub Memasak (12-2)", isNewCanon: true },
          { slug: "kisaragi_setsuna", name: "Kisaragi Setsuna", role: "Wakil Ketua OSIS — Verifikasi Formulir Klub (11-2)", isNewCanon: true },
          { slug: "tsukishima_reo", name: "Tsukishima Reo", role: "Wali Kelas 10-1 — Jadwal Piket Sore" }
        ]
      }
    ]
  },
  {
    id: "may",
    order: 2,
    name: "Mei",
    shortName: "Mei",
    englishTitle: "The First Bond",
    arcLabel: "Arc 02 · Mulai Akrab & Rutinitas Bersama",
    romanceStageId: "curiosity",
    romanceStageName: "Curiosity (Ikatan Pertama)",
    semesterLabel: "Semester 1 · Akhir Musim Semi",
    seasonIcon: "🌿",
    mainEventTitle: "Golden Week, Orientasi Lanjutan & Ujian Tengah Semester Pertama",
    summary:
      "Bulan ketika kelompok pertemanan mulai terbentuk dan karakter memiliki rutinitas bersama. Rangkaian libur nasional Golden Week membuka kesempatan jalan-jalan di luar sekolah, disusul latihan klub yang kian serius serta Ujian Tengah Semester (UTS) pertama.",
    memorableSceneTitle: "Study Session & Catatan Kecil di Meja",
    memorableSceneStory:
      "Protagonis dan Love Interest harus belajar bersama di perpustakaan karena hasil ujian mereka menentukan kelangsungan proyek akademik kelas. Hubungan yang awalnya kaku melunak ketika salah satu ketiduran karena kelelahan, dan yang lain diam-diam meninggalkan minuman kaleng hangat beserta catatan penyemangat kecil.",
    conflictSeed:
      "Protagonis menyadari bahwa status siswa elite tidak selalu berarti percaya diri—sang Love Interest ternyata memikul ketakutan besar akan gagal memenuhi ekspektasi keluarganya.",
    events: [
      {
        id: "evt_may_01",
        monthId: "may",
        periodLabel: "Awal Mei",
        title: "Libur Nasional Golden Week (Jalan-jalan Pertama Bersama Teman)",
        japaneseTerm: "ゴールデンウィーク",
        category: "Liburan",
        description: "Rangkaian hari libur nasional; momen keluar bersama teman sekelas baru tanpa mengenakan seragam sekolah.",
        isKeyEvent: true
      },
      {
        id: "evt_may_02",
        monthId: "may",
        periodLabel: "Minggu 2",
        title: "Student Council Reception & Rapat Komite Kelas",
        japaneseTerm: "生徒会歓迎会",
        category: "Tradisi Elite",
        description: "Penerimaan anggota baru dewan siswa (OSIS) dan pembagian tugas komite kelas untuk agenda semester pertama."
      },
      {
        id: "evt_may_03",
        monthId: "may",
        periodLabel: "Minggu 2–3",
        title: "Latihan Rutin Ekskul & Kunjungan Sehari Akademi (Museum / Universitas)",
        japaneseTerm: "校外学習",
        category: "Ekskul",
        description: "Latihan fisik dan teknik klub semakin intensif, diselingi agenda kunjungan edukatif sehari ke museum atau taman bersejarah."
      },
      {
        id: "evt_may_04",
        monthId: "may",
        periodLabel: "Minggu 3–4",
        title: "Sesi Belajar Kelompok (Study Session) & Ujian Tengah Semester 1 (UTS)",
        japaneseTerm: "中間試験",
        category: "Ujian",
        description: "Pekan ujian tengah semester pertama yang mempertaruhkan reputasi akademik dan izin kegiatan ekstrakurikuler.",
        isKeyEvent: true
      }
    ]
  },
  {
    id: "june",
    order: 3,
    name: "Juni",
    shortName: "Jun",
    englishTitle: "The First Competition",
    arcLabel: "Arc 03 · Sports Day & Musim Hujan (Tsuyu)",
    romanceStageId: "trust",
    romanceStageName: "Trust (Membangun Kepercayaan)",
    semesterLabel: "Semester 1 · Musim Hujan (Tsuyu)",
    seasonIcon: "☔",
    mainEventTitle: "体育祭・運動会 (Taiikusai / Undōkai) — Festival Olahraga & Hujan",
    summary:
      "Pertengahan Juni diramaikan oleh Festival Olahraga antarkelas yang memacu adrenalin lewat estafet, tarik tambang, dan lomba kelompok, bertepatan dengan datangnya musim hujan (tsuyu) yang menghadirkan suasana sendu dan intim saat jam pulang sekolah.",
    memorableSceneTitle: "Di Belakang Gedung Olahraga & Satu Payung Berdua",
    memorableSceneStory:
      "Love Interest yang biasanya tenang berubah sangat kompetitif saat kelas mereka terancam kalah. Protagonis turun tangan menggantikan peserta yang cedera dan menyusun strategi tim. Usai lomba, mereka duduk berdua di belakang gedung olahraga dan untuk pertama kalinya berbicara tanpa bahasa formal—lalu berjalan pulang di bawah satu payung saat hujan turun.",
    conflictSeed:
      "Sang Rival mulai memperhatikan bahwa Love Interest memperlakukan protagonis secara berbeda dibandingkan siswa lain di angkatan mereka.",
    events: [
      {
        id: "evt_jun_01",
        monthId: "june",
        periodLabel: "Minggu 1",
        title: "Pengumuman Peringkat Akademik Pasca-UTS & Pemilihan Kontingen Lomba",
        japaneseTerm: "成績発表・選手決め",
        category: "Akademik",
        description: "Evaluasi hasil ujian tengah semester dilanjutkan dengan pembagian cabang lomba olahraga di tiap kelas."
      },
      {
        id: "evt_jun_02",
        monthId: "june",
        periodLabel: "Minggu 2",
        title: "Persiapan Tim & Latihan Lomba Antarkelas",
        japaneseTerm: "体育祭練習",
        category: "Kompetisi",
        description: "Latihan operan tongkat estafet, strategi tarik tambang, dan pembuatan spanduk dukungan kelas."
      },
      {
        id: "evt_jun_03",
        monthId: "june",
        periodLabel: "Pertengahan Juni",
        title: "Festival Olahraga (Taiikusai / Undōkai)",
        japaneseTerm: "体育祭・運動会",
        category: "Festival",
        description: "Pertandingan puncak antarkelas: lari estafet, tarik tambang, lomba rintangan, dan pertandingan bola.",
        isKeyEvent: true
      },
      {
        id: "evt_jun_04",
        monthId: "june",
        periodLabel: "Akhir Juni",
        title: "Musim Hujan (Tsuyu) & Momen Berbagi Payung Pulang Sekolah",
        japaneseTerm: "梅雨・相合傘",
        category: "Romance",
        description: "Hujan sore yang turun mendadak menahan siswa di teras gedung sekolah, menciptakan momen berbagi payung (Ai-Ai Gasa).",
        isKeyEvent: true
      }
    ]
  },
  {
    id: "july",
    order: 4,
    name: "Juli",
    shortName: "Jul",
    englishTitle: "The Pressure of Perfection",
    arcLabel: "Arc 04 · Tekanan Kesempurnaan & Akhir Semester 1",
    romanceStageId: "trust",
    romanceStageName: "Trust (Kepercayaan & Kejujuran Diri)",
    semesterLabel: "Semester 1 · Awal Musim Panas",
    seasonIcon: "🎐",
    mainEventTitle: "期末試験 (Ujian Akhir Semester 1) & Upacara Penutupan Semester",
    summary:
      "Bulan penyeimbang setelah dua bulan penuh kompetisi dan interaksi sosial. Siswa menghadapi Ujian Akhir Semester Pertama, pengumuman rapor, kelas tambahan bagi yang belum mencapai standar akademi, serta turnamen musim panas sebelum libur panjang dimulai.",
    memorableSceneTitle: "Senja di Perpustakaan & Makna Sebuah Nilai",
    memorableSceneStory:
      "Protagonis mendapat nilai lebih rendah dari harapannya, sementara Love Interest meraih peringkat pertama namun tetap murung akibat tuntutan keluarganya. Di perpustakaan yang telah sepi, protagonis mengatakan bahwa angka di kertas rapor bukanlah satu-satunya penentu nilai seseorang—kalimat pertama yang membuat sang Love Interest merasa diterima apa adanya.",
    conflictSeed:
      "Kedekatan mereka kian dalam menjelang liburan panjang, tetapi keduanya masih ragu apakah perasaan hangat ini sekadar persahabatan atau lebih.",
    events: [
      {
        id: "evt_jul_01",
        monthId: "july",
        periodLabel: "Minggu 1–2",
        title: "Ujian Akhir Semester Pertama (UAS 1)",
        japaneseTerm: "一学期期末試験",
        category: "Ujian",
        description: "Ujian komprehensif seluruh mata pelajaran semester pertama dengan standar kelulusan ketat akademi.",
        isKeyEvent: true
      },
      {
        id: "evt_jul_02",
        monthId: "july",
        periodLabel: "Minggu 3",
        title: "Pengumuman Rapor, Academic Excellence Awards & Kelas Remedial",
        japaneseTerm: "成績優秀者表彰・補習",
        category: "Tradisi Elite",
        description: "Pemberian penghargaan bagi peraih nilai tertinggi, konsultasi wali kelas/orang tua, serta kelas tambahan bagi nilai yang belum memenuhi batas."
      },
      {
        id: "evt_jul_03",
        monthId: "july",
        periodLabel: "Minggu 3–4",
        title: "Turnamen Musim Panas & Persiapan Kamp Klub",
        japaneseTerm: "夏季大会",
        category: "Ekskul",
        description: "Kompetisi regional musim panas yang sering menjadi turnamen terakhir bagi sebagian senior kelas 12."
      },
      {
        id: "evt_jul_04",
        monthId: "july",
        periodLabel: "Akhir Juli",
        title: "Upacara Penutupan Semester Pertama & Janji Liburan Musim Panas",
        japaneseTerm: "終業式",
        category: "Wajib",
        description: "Pidato penutupan semester pertama, pembersihan besar ruang kelas, dan janji untuk bertemu di luar sekolah selama libur Agustus.",
        isKeyEvent: true
      }
    ]
  },
  {
    id: "august",
    order: 5,
    name: "Agustus",
    shortName: "Agu",
    englishTitle: "Summer Memories",
    arcLabel: "Arc 05 · Summer Break Arc & Kembang Api Malam",
    romanceStageId: "attraction",
    romanceStageName: "Attraction (Ketertarikan di Luar Kelas)",
    semesterLabel: "Liburan Musim Panas · Summer Break",
    seasonIcon: "🎆",
    mainEventTitle: "合宿 (Gasshuku — Kamp Klub) & 夏祭り (Natsu Matsuri — Festival Musim Panas)",
    summary:
      "Sekolah libur selama beberapa minggu. Interaksi bergeser keluar ruang kelas melalui kamp pelatihan menginap bersama klub (Gasshuku), seminar proyek riset, hingga malam Festival Musim Panas yang berkilau oleh lentera, yukata, dan kembang api.",
    memorableSceneTitle: "Di Bawah Kembang Api Pertama",
    memorableSceneStory:
      "Acara jalan-jalan yang semula direncanakan bersama teman-teman berubah menjadi waktu berdua di antara deretan stan makanan dan lentera Natsu Matsuri. Saat kembang api pertama meledak di langit malam, Love Interest hampir mengucapkan sesuatu yang sangat penting namun mengurungkan niatnya—menyisakan pesan singkat keesokan paginya yang terasa jauh lebih akrab.",
    conflictSeed:
      "Keduanya telah melampaui batas pertemanan biasa, namun belum ada yang berani mengambil langkah pengakuan sebelum semester baru dimulai.",
    events: [
      {
        id: "evt_aug_01",
        monthId: "august",
        periodLabel: "Awal Agustus",
        title: "Liburan Musim Panas Bersama Keluarga & Waktu Santai Teman",
        japaneseTerm: "夏休み",
        category: "Liburan",
        description: "Istirahat dari rutinitas seragam sekolah, mengerjakan PR musim panas, atau berkunjung ke kolam renang dan pantai."
      },
      {
        id: "evt_aug_02",
        monthId: "august",
        periodLabel: "Minggu 2",
        title: "Kamp Pelatihan Klub (Gasshuku) & Seminar Penelitian Akademik",
        japaneseTerm: "合宿・夏季セミナー",
        category: "Ekskul",
        description: "Menginap beberapa hari di luar kota untuk latihan intensif klub olahraga/seni atau lokakarya akademik.",
        isKeyEvent: true
      },
      {
        id: "evt_aug_03",
        monthId: "august",
        periodLabel: "Pertengahan Agustus",
        title: "Festival Musim Panas (Natsu Matsuri), Yukata & Pertunjukan Kembang Api",
        japaneseTerm: "夏祭り・花火大会",
        category: "Romance",
        description: "Malam festival kuil dengan pakaian Yukata, permainan tangkap ikan mas (Kingyo Sukui), stan takoyaki, dan kembang api (Hanabi).",
        isKeyEvent: true
      },
      {
        id: "evt_aug_04",
        monthId: "august",
        periodLabel: "Akhir Agustus",
        title: "Latihan Intensif Pra-Turnamen & Rapat Awal Panitia Festival Budaya",
        japaneseTerm: "文化祭準備開始",
        category: "Akademik",
        description: "Kembali ke sekolah di minggu terakhir liburan untuk mencicil properti kelas menjelang Bunkasai."
      }
    ]
  },
  {
    id: "september",
    order: 6,
    name: "September",
    shortName: "Sep",
    englishTitle: "The Cultural Festival Begins",
    arcLabel: "Arc 06 · Festival Arc & Panggung Ensemble",
    romanceStageId: "attraction",
    romanceStageName: "Attraction (Pasangan Panggung)",
    semesterLabel: "Semester 2 · Awal Musim Gugur",
    seasonIcon: "🎭",
    mainEventTitle: "文化祭 (Bunkasai) — Pembukaan Semester 2 & Persiapan Festival Budaya",
    summary:
      "Semester kedua resmi dibuka dan seluruh akademi langsung tersedot ke dalam persiapan Bunkasai. Setiap kelas merancang kafe tematik, rumah hantu, atau pementasan drama, sementara klub musik dan seni menyiapkan pertunjukan panggung utama.",
    memorableSceneTitle: "Naskah Drama & Perasaan yang Tak Lagi Sekadar Akting",
    memorableSceneStory:
      "Kelas memutuskan mementaskan drama romantis dan memilih protagonis serta Love Interest sebagai pemeran utama. Selama latihan sore di ruang kelas yang mulai temaram, dialog-dialog di dalam naskah terasa semakin personal—hingga saat pementasan usai dengan tepuk tangan meriah, keduanya justru salah tingkah ketika harus berhadapan tanpa naskah.",
    conflictSeed:
      "Menyadari kedekatan mereka di atas panggung, sang Rival mulai bergerak mendekati Love Interest secara terang-terangan.",
    events: [
      {
        id: "evt_sep_01",
        monthId: "september",
        periodLabel: "Minggu 1",
        title: "Upacara Pembukaan Semester Kedua",
        japaneseTerm: "二学期始業式",
        category: "Wajib",
        description: "Kembali ke rutinitas akademik setelah libur musim panas dengan suasana hubungan antar-karakter yang mulai berubah."
      },
      {
        id: "evt_sep_02",
        monthId: "september",
        periodLabel: "Minggu 1–2",
        title: "Pembentukan Panitia Bunkasai, Pemilihan Tema Stan & Anggaran Kelas",
        japaneseTerm: "文化祭実行委員会",
        category: "Akademik",
        description: "Perdebatan seru di kelas menentukan konsep stan (kafe pelayan, rumah hantu, pameran, atau drama) serta pembagian anggaran."
      },
      {
        id: "evt_sep_03",
        monthId: "september",
        periodLabel: "Minggu 2–3",
        title: "Lembur Dekorasi Kelas, Latihan Drama & Gladi Bersih Band/Klub",
        japaneseTerm: "放課後準備",
        category: "Ekskul",
        description: "Bekerja lembur sepulang sekolah mengecat properti, menjahit kostum, dan menghafal dialog panggung.",
        isKeyEvent: true
      },
      {
        id: "evt_sep_04",
        monthId: "september",
        periodLabel: "Akhir September",
        title: "Hari Pembukaan Festival Budaya Sekolah (Bunkasai)",
        japaneseTerm: "文化祭初日",
        category: "Festival",
        description: "Gerbang akademi dibuka untuk pengunjung; kelas dan klub memamerkan karya terbaik mereka dalam suasana meriah.",
        isKeyEvent: true
      }
    ]
  },
  {
    id: "october",
    order: 7,
    name: "Oktober",
    shortName: "Okt",
    englishTitle: "The Day Everything Changes",
    arcLabel: "Arc 07 · Puncak Festival, Gala Akademi & Kesalahpahaman",
    romanceStageId: "jealousy_honesty",
    romanceStageName: "Jealousy & Honesty (Cemburu & Salah Paham)",
    semesterLabel: "Semester 2 · Musim Gugur",
    seasonIcon: "🍂",
    mainEventTitle: "後夜祭 (Puncak & Penutupan Bunkasai) & Founder's Day Gala",
    summary:
      "Oktober menjadi bulan penuh konsekuensi atas benih hubungan yang ditanam sejak April. Setelah euforia penutupan festival budaya, penghargaan klub terbaik, dan perayaan Founder's Day Gala, sebuah interupsi di saat genting memicu kesalahpahaman emosional.",
    memorableSceneTitle: "Aula yang Kosong & Panggilan Telepon yang Memutus Pengakuan",
    memorableSceneStory:
      "Ketika seluruh dekorasi mulai dilepas dan riuh festival berganti sunyi, protagonis menemukan Love Interest sendirian di aula utama. Mereka berbincang dari hati ke hati tentang masa depan dan alasan masuk akademi ini. Tepat saat Love Interest hendak mengungkapkan perasaannya, telepon protagonis berdering dari sang Rival yang meminta pertolongan mendadak.",
    conflictSeed:
      "Percakapan yang terputus memunculkan salah paham; Love Interest mulai mengira kedekatan mereka selama ini hanya berarti besar bagi dirinya seorang.",
    events: [
      {
        id: "evt_oct_01",
        monthId: "october",
        periodLabel: "Awal Oktober",
        title: "Hari Puncak & Penutupan Bunkasai serta Penghargaan Kelas/Klub Terbaik",
        japaneseTerm: "文化祭閉会式・後夜祭",
        category: "Festival",
        description: "Pengumuman pemenang stan dan penampilan terbaik, pembongkaran dekorasi, dan evaluasi panitia.",
        isKeyEvent: true
      },
      {
        id: "evt_oct_02",
        monthId: "october",
        periodLabel: "Minggu 2",
        title: "Turnamen Olahraga Internal & Apresiasi Seni Musim Gugur",
        japaneseTerm: "球技大会・芸術鑑賞会",
        category: "Kompetisi",
        description: "Kompetisi olahraga ringan antarkelas serta kunjungan bersama ke pertunjukan teater atau museum seni."
      },
      {
        id: "evt_oct_03",
        monthId: "october",
        periodLabel: "Minggu 3",
        title: "Founder's Day Gala (Jamuan Formal Ulang Tahun Akademi)",
        japaneseTerm: "創立記念祝賀会",
        category: "Tradisi Elite",
        description: "Acara formal tahunan yang mempertemukan siswa, alumni terhormat, dan keluarga donatur akademi.",
        isKeyEvent: true
      },
      {
        id: "evt_oct_04",
        monthId: "october",
        periodLabel: "Akhir Oktober",
        title: "Pengumuman Seleksi Program Pertukaran Pelajar & Persiapan School Trip",
        japaneseTerm: "交換留学発表",
        category: "Akademik",
        description: "Pengumuman kandidat pertukaran pelajar luar negeri dan pembagian kelompok perjalanan sekolah ke Kyoto–Nara."
      }
    ]
  },
  {
    id: "november",
    order: 8,
    name: "November",
    shortName: "Nov",
    englishTitle: "The School Trip",
    arcLabel: "Arc 08 · Perjalanan Sekolah 3 Hari 2 Malam (Kyoto & Nara)",
    romanceStageId: "jealousy_honesty",
    romanceStageName: "Jealousy & Honesty (Meluruskan Perasaan)",
    semesterLabel: "Semester 2 · Akhir Musim Gugur",
    seasonIcon: "🍁",
    mainEventTitle: "修学旅行 (Shūgaku Ryokō) — Ekspedisi Budaya Kyoto–Nara & UTS 2",
    summary:
      "Seluruh angkatan berangkat menggunakan kereta cepat menuju Kyoto dan Nara selama 3 hari 2 malam. Menginap di tempat yang sama membuat karakter tidak bisa terus-menerus menghindar dari canggungnya salah paham bulan lalu, dilanjutkan dengan Ujian Tengah Semester kedua.",
    memorableSceneTitle: "Lorong Penginapan Setelah Jam Malam",
    memorableSceneStory:
      "Pada malam hari kedua, protagonis keluar kamar menuju mesin penjual minuman di area umum penginapan yang masih diizinkan guru pengawas, lalu mendapati Love Interest sedang berdiri menatap taman malam. Mereka akhirnya membicarakan kesalahpahaman di bulan Oktober, dan untuk pertama kalinya Love Interest mengakui rasa cemburunya.",
    conflictSeed:
      "Meski belum ada pernyataan cinta resmi, tembok kesalahpahaman runtuh dan keduanya kini sadar akan arti kehadiran satu sama lain.",
    events: [
      {
        id: "evt_nov_01",
        monthId: "november",
        periodLabel: "Hari 1 — Kyoto",
        title: "Keberangkatan Shūgaku Ryokō & Kunjungan Distrik Bersejarah Kyoto",
        japaneseTerm: "修学旅行一日目（京都）",
        category: "School Trip",
        description: "Perjalanan kereta dan bus bersama angkatan, eksplorasi kuil klasik Kyoto dalam kelompok kecil.",
        isKeyEvent: true
      },
      {
        id: "evt_nov_02",
        monthId: "november",
        periodLabel: "Hari 2 — Kyoto",
        title: "Tugas Dokumentasi Budaya, Waktu Bebas Kelompok & Malam di Penginapan",
        japaneseTerm: "班別自主研修・旅館の夜",
        category: "Romance",
        description: "Waktu eksplorasi mandiri dengan batas jam kumpul, makan malam bersama di ryokan/hotel, dan obrolan larut malam.",
        isKeyEvent: true
      },
      {
        id: "evt_nov_03",
        monthId: "november",
        periodLabel: "Hari 3 — Nara",
        title: "Kunjungan Taman Bersejarah Nara & Belanja Oleh-oleh Kepulangan",
        japaneseTerm: "修学旅行三日目（奈良）",
        category: "School Trip",
        description: "Memberi makan rusa di Taman Nara, mengunjungi situs warisan budaya, dan membeli gantungan kunci/omamori pasangan."
      },
      {
        id: "evt_nov_04",
        monthId: "november",
        periodLabel: "Akhir November",
        title: "Ujian Tengah Semester Kedua (UTS 2)",
        japaneseTerm: "二学期中間試験",
        category: "Ujian",
        description: "Kembali ke ritme akademik ketat setelah perjalanan sekolah untuk menghadapi ujian tengah semester musim gugur."
      }
    ]
  },
  {
    id: "december",
    order: 9,
    name: "Desember",
    shortName: "Des",
    englishTitle: "Winter Distance",
    arcLabel: "Arc 09 · Ujian Akhir Semester 2 & Jarak Musim Dingin",
    romanceStageId: "distance_choice",
    romanceStageName: "Distance & Choice (Ujian Jarak)",
    semesterLabel: "Semester 2 · Awal Musim Dingin",
    seasonIcon: "❄️",
    mainEventTitle: "期末試験 (UAS 2), Penutupan Semester & Liburan Musim Dingin / Natal",
    summary:
      "Suhu udara menurun drastis seiring datangnya Ujian Akhir Semester kedua dan kesibukan acara keluarga menjelang akhir tahun. Jarangnya waktu bertemu di luar kelas menguji apakah ikatan yang telah terbangun tetap hangat di tengah kesibukan masing-masing.",
    memorableSceneTitle: "Hadiah Tanpa Kartu Nama dari Kenangan Musim Panas",
    memorableSceneStory:
      "Akibat padatnya jadwal ujian dan kewajiban keluarga selama berminggu-minggu, percakapan mereka hanya tersisa lewat pesan-pesan singkat. Namun tepat menjelang libur musim dingin, protagonis mendapati sebuah kotak kado kecil tanpa nama di lokernya—berisi barang persis seperti yang pernah mereka bicarakan sambil lalu saat festival musim panas di bulan Agustus.",
    conflictSeed:
      "Menguji keteguhan hati ketika karakter tidak lagi setiap hari duduk di ruang kelas yang sama selama liburan akhir tahun.",
    events: [
      {
        id: "evt_dec_01",
        monthId: "december",
        periodLabel: "Minggu 1–2",
        title: "Ujian Akhir Semester Kedua (UAS 2) & Presentasi Proyek Akademik",
        japaneseTerm: "二学期期末試験",
        category: "Ujian",
        description: "Evaluasi akademik penutup semester kedua serta sidang proyek penelitian kelas.",
        isKeyEvent: true
      },
      {
        id: "evt_dec_02",
        monthId: "december",
        periodLabel: "Minggu 3",
        title: "Kegiatan Penutup Klub & Pertukaran Hadiah Kecil Musim Dingin / Natal",
        japaneseTerm: "部活納め・クリスマス",
        category: "Romance",
        description: "Pembersihan ruang klub sebelum libur dingin dan tradisi bertukar kado di antara sahabat maupun gebetan.",
        isKeyEvent: true
      },
      {
        id: "evt_dec_03",
        monthId: "december",
        periodLabel: "Minggu 3",
        title: "Upacara Penutupan Semester Kedua",
        japaneseTerm: "二学期終業式",
        category: "Wajib",
        description: "Pembagian hasil evaluasi semester kedua dan pengumuman jadwal libur musim dingin."
      },
      {
        id: "evt_dec_04",
        monthId: "december",
        periodLabel: "Akhir Desember",
        title: "Liburan Musim Dingin & Malam Pergantian Tahun (Ōmisoka)",
        japaneseTerm: "冬休み・大晦日",
        category: "Liburan",
        description: "Menghabiskan akhir tahun bersama keluarga sementara siswa senior kelas 12 fokus penuh pada persiapan ujian universitas."
      }
    ]
  },
  {
    id: "january",
    order: 10,
    name: "Januari",
    shortName: "Jan",
    englishTitle: "New Year, New Intentions",
    arcLabel: "Arc 10 · Turning Point & Resolusi Tahun Baru",
    romanceStageId: "distance_choice",
    romanceStageName: "Distance & Choice (Mengambil Inisiatif)",
    semesterLabel: "Semester 3 · Musim Dingin",
    seasonIcon: "⛩️",
    mainEventTitle: "初詣 (Hatsumōde), Pembukaan Semester 3 & Tradisi Kaligrafi Kakizome",
    summary:
      "Tahun baru dimulai dengan tradisi kunjungan pertama ke kuil (Hatsumōde) dan dibukanya semester ketiga yang singkat namun menentukan. Tradisi menulis kaligrafi resolusi tahun baru (Kakizome) di akademi menjadi titik balik keberanian karakter.",
    memorableSceneTitle: "Doa di Kuil Tahun Baru & Resolusi yang Sama",
    memorableSceneStory:
      "Protagonis dan Love Interest berpapasan tanpa sengaja di tangga shrine saat Hatsumōde. Mereka berdoa berdampingan dalam diam tanpa membocorkan harapan masing-masing. Saat kembali ke sekolah, keduanya tertegun melihat papan kaligrafi resolusi kelas: mereka menuliskan kalimat dengan makna yang sama—'Ingin lebih jujur pada diri sendiri'.",
    conflictSeed:
      "Protagonis memutuskan berhenti menunggu momen kebetulan dan mulai mengambil inisiatif nyata sebelum tahun pertama SMA berakhir.",
    events: [
      {
        id: "evt_jan_01",
        monthId: "january",
        periodLabel: "1–3 Januari",
        title: "Hatsumōde (Kunjungan Pertama ke Shrine / Kuil di Tahun Baru)",
        japaneseTerm: "初詣",
        category: "Romance",
        description: "Mengunjungi kuil bersama teman atau keluarga di udara dingin Januari, menarik undian Omikuji, dan memanjatkan harapan tahun baru.",
        isKeyEvent: true
      },
      {
        id: "evt_jan_02",
        monthId: "january",
        periodLabel: "Minggu 2",
        title: "Upacara Pembukaan Semester Ketiga & Tradisi Kaligrafi (Kakizome)",
        japaneseTerm: "三学期始業式・書き初め",
        category: "Tradisi Elite",
        description: "Tradisi khusus akademi menuliskan resolusi tahun baru dengan kuas kaligrafi untuk dipajang di kelas.",
        isKeyEvent: true
      },
      {
        id: "evt_jan_03",
        monthId: "january",
        periodLabel: "Minggu 3",
        title: "Ujian Simulasi Akhir & Pelepasan Semangat untuk Senior Kelas 12",
        japaneseTerm: "模擬試験・壮行会",
        category: "Akademik",
        description: "Siswa kelas 12 menghadapi ujian seleksi universitas nasional sementara adik kelas memberikan dukungan."
      },
      {
        id: "evt_jan_04",
        monthId: "january",
        periodLabel: "Akhir Januari",
        title: "Penetapan Target Kompetisi Klub Semester Terakhir",
        japaneseTerm: "冬季部活目標",
        category: "Ekskul",
        description: "Menyusun program latihan musim dingin sebagai persiapan serah terima kepengurusan dari senior."
      }
    ]
  },
  {
    id: "february",
    order: 11,
    name: "Februari",
    shortName: "Feb",
    englishTitle: "Valentine’s Day",
    arcLabel: "Arc 11 · Puncak Emosional & Regenerasi Klub",
    romanceStageId: "confession_commitment",
    romanceStageName: "Confession & Commitment (Pengakuan Cinta)",
    semesterLabel: "Semester 3 · Akhir Musim Dingin",
    seasonIcon: "🍫",
    mainEventTitle: "バレンタインデー (Valentine’s Day) & Club Succession Ceremony",
    summary:
      "Bulan Februari menjadi titik klimaks romansa yang telah dibangun perlahan sejak April. Di tengah persiapan ujian akhir tahun dan regenerasi kepengurusan klub dari senior kelas 12, tanggal 14 Februari menghadirkan momen pengakuan yang tak bisa lagi ditunda.",
    memorableSceneTitle: "Cokelat Buatan Sendiri & Kejujuran Tanpa Topeng",
    memorableSceneStory:
      "Pada sore 14 Februari, protagonis menyerahkan cokelat buatan sendiri secara personal—bukan sebagai cokelat pertemanan (giri), melainkan tanda perasaan yang tulus (honmei). Ketika Love Interest bertanya apakah protagonis sungguh-sungguh memahami arti pemberian itu, keduanya akhirnya saling mengakui perasaan yang mereka pendam sepanjang tahun.",
    conflictSeed:
      "Pengakuan cinta bukanlah akhir cerita: mereka kini harus membuktikan komitmen menjaga hubungan di tengah tuntutan akademik keluarga dan jabatan klub yang baru.",
    events: [
      {
        id: "evt_feb_01",
        monthId: "february",
        periodLabel: "Awal Februari",
        title: "Persiapan Regenerasi Organisasi Siswa & Kepengurusan Klub",
        japaneseTerm: "次期役員選出",
        category: "Ekskul",
        description: "Wawancara dan pemilihan calon ketua maupun wakil ketua klub dari angkatan junior."
      },
      {
        id: "evt_feb_02",
        monthId: "february",
        periodLabel: "14 Februari",
        title: "Valentine’s Day — Pemberian Cokelat & Momen Pengakuan Perasaan",
        japaneseTerm: "バレンタインデー",
        category: "Romance",
        description: "Hari penuh debaran di loker sepatu, atap sekolah, dan ruang kelas sepulang pelajaran; puncak emosional perjalanan asmara.",
        isKeyEvent: true
      },
      {
        id: "evt_feb_03",
        monthId: "february",
        periodLabel: "Minggu 3",
        title: "Club Succession Ceremony (Upacara Serah Terima Jabatan Klub)",
        japaneseTerm: "部活引き継ぎ式",
        category: "Tradisi Elite",
        description: "Acara resmi penyerahan tanggung jawab kepemimpinan klub dari senior kelas 12 kepada junior.",
        isKeyEvent: true
      },
      {
        id: "evt_feb_04",
        monthId: "february",
        periodLabel: "Akhir Februari",
        title: "Ujian Masuk Calon Siswa Baru & Persiapan Ujian Akhir Tahun",
        japaneseTerm: "学年末試験準備",
        category: "Ujian",
        description: "Sekolah menyelenggarakan seleksi masuk bagi angkatan baru sementara kelas 10 dan 11 bersiap menghadapi ujian kenaikan kelas."
      }
    ]
  },
  {
    id: "march",
    order: 12,
    name: "Maret",
    shortName: "Mar",
    englishTitle: "Graduation and the Next Chapter",
    arcLabel: "Arc 12 · Farewell Arc, Kelulusan Senior & Naik ke Kelas 11",
    romanceStageId: "confession_commitment",
    romanceStageName: "Confession & Commitment (Menuju Babak Baru)",
    semesterLabel: "Semester 3 · Awal Musim Semi",
    seasonIcon: "🎓",
    mainEventTitle: "卒業式 (Sotsugyōshiki — Kelulusan Kelas 12) & Transisi Kelas 11",
    summary:
      "Penutup tahun ajaran pertama. Setelah melewati ujian akhir tahun, seluruh sekolah melepas kepergian senior kelas 12 dalam upacara kelulusan Sotsugyōshiki yang mengharukan. Kuncup sakura kembali bermekaran, menandai kesiapan protagonis dan Love Interest melangkah naik ke Kelas 11 (Kōkō Ninensei).",
    memorableSceneTitle: "Nasihat Terakhir Senior & Janji di Gerbang Akademi",
    memorableSceneStory:
      "Senior yang selama setahun membimbing protagonis memberikan pesan perpisahan terakhir tentang keberanian mengambil keputusan sendiri. Selepas upacara, protagonis dan Love Interest berdiri berdampingan di gerbang akademi di bawah kuncup sakura—mengenang hujan bulan Juni, kembang api Agustus, panggung Bunkasai, hingga Hari Valentine—dan berjanji untuk terus saling terbuka menghadapi Kelas 11.",
    conflictSeed:
      "Memasuki Tahun ke-2 (Kelas 11 / Kōkō Ninensei): susunan kelas baru, tanggung jawab membimbing adik kelas baru, serta konsekuensi masa depan yang semakin nyata.",
    events: [
      {
        id: "evt_mar_01",
        monthId: "march",
        periodLabel: "Minggu 1",
        title: "Ujian Akhir Tahun Kelas 10 & 11 (Penentu Kenaikan Kelas)",
        japaneseTerm: "学年末試験",
        category: "Ujian",
        description: "Ujian penutup tahun ajaran yang menentukan kelulusan tingkat serta penempatan kelas di tahun kedua.",
        isKeyEvent: true
      },
      {
        id: "evt_mar_02",
        monthId: "march",
        periodLabel: "Pertengahan Maret",
        title: "Upacara Kelulusan Senior Kelas 12 (Sotsugyōshiki) & White Day",
        japaneseTerm: "卒業式・ホワイトデー",
        category: "Milestone",
        description: "Momen perpisahan penuh haru dengan kakak kelas 12, penyerahan surat kenangan, serta balasan hadiah pada 14 Maret (White Day).",
        isKeyEvent: true
      },
      {
        id: "evt_mar_03",
        monthId: "march",
        periodLabel: "Minggu 3",
        title: "Pengumuman Nilai Akhir & Upacara Penutupan Tahun Ajaran (Shūryōshiki)",
        japaneseTerm: "修了式・通知表配布",
        category: "Wajib",
        description: "Penyerahan rapor akhir tahun pertama dan penutupan resmi kalender akademik Kelas 10."
      },
      {
        id: "evt_mar_04",
        monthId: "march",
        periodLabel: "Akhir Maret → April",
        title: "Liburan Musim Semi & Kenaikan ke Kelas 11 (Kōkō Ninensei / Tahun ke-2)",
        japaneseTerm: "春休み・高校二年生へ",
        category: "Milestone",
        description: "Persiapan menyambut pembagian kelas baru dan peran baru sebagai senior bagi angkatan berikutnya.",
        isKeyEvent: true
      }
    ]
  }
];

export const YEAR_TWO_PREVIEW = {
  title: "YEAR 2 — 高校2年生 (Kōkō Ninensei · Kelas 11)",
  timing: "Dimulai pada April Tahun Kedua",
  pillars: [
    {
      title: "New Class (Susunan Kelas Baru)",
      icon: "🌸",
      description: "Pembagian kelas dan teman sebangku dikocok ulang; karakter harus beradaptasi dengan dinamika sosial baru."
    },
    {
      title: "New Responsibilities (Menjadi Senior / Senpai)",
      icon: "👑",
      description: "Mantan siswa baru kini menjadi kakak kelas yang memegang jabatan inti di klub dan membimbing angkatan Kelas 10 yang baru."
    },
    {
      title: "Bigger Stakes (Taruhan Masa Depan & Hubungan)",
      icon: "🔥",
      description: "Hubungan yang telah terjalin kini menghadapi ekspektasi keluarga, pilihan jalur karier/universitas, dan rivalitas yang lebih serius."
    }
  ]
};

/**
 * Menghitung status progresif sebuah bulan ("passed" | "current" | "upcoming")
 * berdasarkan ID bulan yang sedang aktif saat ini.
 */
export function getMonthProgressiveStatus(
  monthId: SchoolCalendarMonthId,
  currentMonthId: SchoolCalendarMonthId
): SchoolCalendarMonthStatus {
  const monthIdx = SCHOOL_MONTH_ORDER.indexOf(monthId);
  const currentIdx = SCHOOL_MONTH_ORDER.indexOf(currentMonthId);
  if (monthIdx === -1 || currentIdx === -1) return "upcoming";
  if (monthIdx < currentIdx) return "passed";
  if (monthIdx === currentIdx) return "current";
  return "upcoming";
}

/**
 * Menghitung ringkasan progres tahun ajaran (jumlah bulan terlewati, jumlah event selesai, dan persentase).
 */
export function calculateCalendarProgressStats(state: SchoolCalendarState) {
  const currentIdx = Math.max(0, SCHOOL_MONTH_ORDER.indexOf(state.currentMonthId));
  const passedMonthsCount = currentIdx;
  const completedSet = new Set(state.completedEventIds);

  let totalEventsCount = 0;
  let completedEventsCount = 0;

  for (const month of SCHOOL_CALENDAR_MONTHS) {
    for (const ev of month.events) {
      totalEventsCount++;
      if (completedSet.has(ev.id)) {
        completedEventsCount++;
      }
    }
  }

  for (const customEv of state.customEvents || []) {
    totalEventsCount++;
    if (customEv.done) {
      completedEventsCount++;
    }
  }

  const percentage =
    totalEventsCount > 0 ? Math.round((completedEventsCount / totalEventsCount) * 100) : 0;

  const currentMonthObj =
    SCHOOL_CALENDAR_MONTHS.find((m) => m.id === state.currentMonthId) || SCHOOL_CALENDAR_MONTHS[0];

  return {
    currentMonthIndex: currentIdx,
    currentMonthOrder: currentIdx + 1,
    currentMonth: currentMonthObj,
    passedMonthsCount,
    remainingMonthsCount: Math.max(0, SCHOOL_CALENDAR_MONTHS.length - (currentIdx + 1)),
    totalEventsCount,
    completedEventsCount,
    percentage
  };
}
