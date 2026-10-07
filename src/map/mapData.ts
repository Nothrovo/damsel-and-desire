import type { Floor, FloorId } from "./types";

// Outer building outline for standard floors (f1, f2, f3, roof)
export const MAIN_BUILDING_OUTLINE = [
  { x: 8, y: 8 },
  { x: 695, y: 8 },
  { x: 695, y: 781 },
  { x: 598, y: 781 },
  { x: 598, y: 695 },
  { x: 425, y: 695 },
  { x: 425, y: 781 },
  { x: 279, y: 781 },
  { x: 279, y: 695 },
  { x: 106, y: 695 },
  { x: 106, y: 781 },
  { x: 8, y: 781 }
];

// Inner courtyard atrium void (f1, f2, f3, roof)
export const MAIN_BUILDING_COURTYARD = [
  { x: 146, y: 145 },
  { x: 554, y: 145 },
  { x: 554, y: 551 },
  { x: 146, y: 551 }
];

export const MAP_FLOORS: Record<FloorId, Floor> = {
  // =========================================================================
  // THIRD FLOOR (18 Rooms)
  // =========================================================================
  f3: {
    id: "f3",
    label: "Third Floor (3F)",
    level: 3,
    viewBox: "0 0 704 792",
    outline: MAIN_BUILDING_OUTLINE,
    courtyard: MAIN_BUILDING_COURTYARD,
    rooms: [
      {
        id: "f3_storage_nw",
        name: "Storage (NW)",
        shortLabel: "Storage",
        category: "utility",
        floorId: "f3",
        rect: { x: 8, y: 8, width: 98, height: 50 },
        labelOrientation: "horizontal",
        description: "Gudang penyimpanan lantai 3 berisi bangku cadangan, kotak peralatan, dan tumpukan kardus."
      },
      {
        id: "f3_photography_club",
        name: "Photography Club",
        category: "club",
        floorId: "f3",
        rect: { x: 146, y: 8, width: 135, height: 97 },
        labelOrientation: "horizontal",
        description: "Ruang klub fotografi lengkap dengan ruang gelap cuci cetak foto analog dan koleksi lensa telefoto.",
        ekskulId: "photography"
      },
      {
        id: "f3_info_club",
        name: "Info Club",
        category: "club",
        floorId: "f3",
        rect: { x: 281, y: 8, width: 137, height: 97 },
        labelOrientation: "horizontal",
        description: "Pusat informasi dan media sekolah Seishun Academy. Terhubung ke jaringan penyiaran & buletin berita.",
        ekskulId: "penyiaran"
      },
      {
        id: "f3_science_club",
        name: "Science Club",
        category: "club",
        floorId: "f3",
        rect: { x: 418, y: 8, width: 136, height: 97 },
        labelOrientation: "horizontal",
        description: "Markas KIR / OSN untuk riset sains, olimpiade matematika, dan eksperimen ilmiah sepulang sekolah.",
        ekskulId: "kir_osn"
      },
      {
        id: "f3_storage_ne",
        name: "Storage (NE)",
        shortLabel: "Storage",
        category: "utility",
        floorId: "f3",
        rect: { x: 598, y: 8, width: 97, height: 50 },
        labelOrientation: "horizontal",
        description: "Gudang perkakas timur lantai 3 untuk sapu, pel, dan perlengkapan piket kelas."
      },
      {
        id: "f3_audiovisual_room",
        name: "Audiovisual Room",
        category: "facility",
        floorId: "f3",
        rect: { x: 8, y: 145, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang multimedia kedap suara dengan proyektor film dokumenter dan sound system teater."
      },
      {
        id: "f3_computer_lab",
        name: "Computer Lab",
        category: "facility",
        floorId: "f3",
        rect: { x: 8, y: 281, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Laboratorium komputer ber-AC dengan 40 PC desktop berjejaring LAN kabel kecepatan tinggi."
      },
      {
        id: "f3_announcement_room",
        name: "Announcement Room",
        category: "facility",
        floorId: "f3",
        rect: { x: 8, y: 417, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Bilik audio tempat mic speaker sekolah dikendalikan untuk menyiarkan bel, lagu istirahat, dan pengumuman.",
        relatedEkskulIds: ["penyiaran"]
      },
      {
        id: "f3_art_room",
        name: "Art Room",
        category: "facility",
        floorId: "f3",
        rect: { x: 598, y: 145, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Studio seni rupa luas beraroma cat minyak dengan easel lukis kayu menghadap cahaya jendela.",
        relatedEkskulIds: ["painting"]
      },
      {
        id: "f3_biology_lab",
        name: "Biology Lab",
        category: "facility",
        floorId: "f3",
        rect: { x: 598, y: 281, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Laboratorium biologi dengan preparat mikroskop, model anatomi tubuh manusia, dan akuarium mini."
      },
      {
        id: "f3_english_room",
        name: "English Room",
        category: "classroom",
        floorId: "f3",
        rect: { x: 598, y: 417, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang belajar bahasa asing dengan poster kebudayaan dunia dan sudut membaca novel impor."
      },
      {
        id: "f3_female_bathroom_w",
        name: "Female Bathroom (West)",
        shortLabel: "Female Bathroom",
        category: "utility",
        floorId: "f3",
        rect: { x: 8, y: 645, width: 98, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswi sayap barat lantai 3 yang bersih dan dilengkapi cermin rias panjang."
      },
      {
        id: "f3_male_bathroom_w",
        name: "Male Bathroom (West)",
        shortLabel: "Male Bathroom",
        category: "utility",
        floorId: "f3",
        rect: { x: 8, y: 713, width: 98, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswa sayap barat lantai 3."
      },
      {
        id: "f3_classroom_3_1",
        name: "Classroom 3-1",
        category: "classroom",
        floorId: "f3",
        rect: { x: 155, y: 601, width: 124, height: 94 },
        labelOrientation: "horizontal",
        description: "Ruang kelas 3-1: murid tingkat akhir yang bersiap menghadapi ujian masuk universitas (juken)."
      },
      {
        id: "f3_principals_office",
        name: "Principal's Office",
        category: "admin",
        floorId: "f3",
        rect: { x: 279, y: 601, width: 146, height: 180 },
        labelOrientation: "horizontal",
        description: "Ruang kepala sekolah berpintu jati mewah, sofa tamu kulit, dan sertifikat prestasi sekolah berbingkai emas."
      },
      {
        id: "f3_classroom_3_2",
        name: "Classroom 3-2",
        category: "classroom",
        floorId: "f3",
        rect: { x: 425, y: 601, width: 126, height: 94 },
        labelOrientation: "horizontal",
        description: "Ruang kelas 3-2: kelas murid senior dengan papan mading penuh target kelulusan impian."
      },
      {
        id: "f3_female_bathroom_e",
        name: "Female Bathroom (East)",
        shortLabel: "Female Bathroom",
        category: "utility",
        floorId: "f3",
        rect: { x: 598, y: 645, width: 97, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswi sayap timur lantai 3."
      },
      {
        id: "f3_male_bathroom_e",
        name: "Male Bathroom (East)",
        shortLabel: "Male Bathroom",
        category: "utility",
        floorId: "f3",
        rect: { x: 598, y: 713, width: 97, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswa sayap timur lantai 3."
      }
    ]
  },

  // =========================================================================
  // SECOND FLOOR (18 Rooms)
  // =========================================================================
  f2: {
    id: "f2",
    label: "Second Floor (2F)",
    level: 2,
    viewBox: "0 0 704 792",
    outline: MAIN_BUILDING_OUTLINE,
    courtyard: MAIN_BUILDING_COURTYARD,
    rooms: [
      {
        id: "f2_storage_nw",
        name: "Storage (NW)",
        shortLabel: "Storage",
        category: "utility",
        floorId: "f2",
        rect: { x: 8, y: 8, width: 98, height: 50 },
        labelOrientation: "horizontal",
        description: "Gudang penyimpanan sayap barat lantai 2."
      },
      {
        id: "f2_art_club",
        name: "Art Club",
        category: "club",
        floorId: "f2",
        rect: { x: 146, y: 8, width: 135, height: 97 },
        labelOrientation: "horizontal",
        description: "Ruang klub seni rupa dan lukis. Penuh karya kanvas setengah jadi dan aroma minyak cat.",
        ekskulId: "painting"
      },
      {
        id: "f2_light_music_club",
        name: "Light Music Club",
        category: "club",
        floorId: "f2",
        rect: { x: 281, y: 8, width: 137, height: 97 },
        labelOrientation: "horizontal",
        description: "Studio latihan band (Keion-bu). Peredam suara di dinding, ampli gitar Marshall, dan drum kit lengkap.",
        ekskulId: "band"
      },
      {
        id: "f2_martial_arts_club",
        name: "Martial Arts Club",
        category: "club",
        floorId: "f2",
        rect: { x: 418, y: 8, width: 136, height: 97 },
        labelOrientation: "horizontal",
        description: "Dojo beralas matras empuk untuk latihan karate, judo, dan teknik beladiri fisik.",
        ekskulId: "martial_arts"
      },
      {
        id: "f2_storage_ne",
        name: "Storage (NE)",
        shortLabel: "Storage",
        category: "utility",
        floorId: "f2",
        rect: { x: 598, y: 8, width: 97, height: 50 },
        labelOrientation: "horizontal",
        description: "Gudang penyimpanan sayap timur lantai 2."
      },
      {
        id: "f2_library",
        name: "Library",
        category: "facility",
        floorId: "f2",
        rect: { x: 8, y: 145, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Perpustakaan sekolah yang hening, rak buku kayu bertingkat, dan meja baca pojok yang teduh.",
        relatedEkskulIds: ["literatur"]
      },
      {
        id: "f2_student_council",
        name: "Student Council",
        category: "admin",
        floorId: "f2",
        rect: { x: 8, y: 281, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang OSIS ber-AC dingin dengan meja rapat bundar, stempel resmi sekolah, dan jadwal program kerja.",
        ekskulId: "student_council"
      },
      {
        id: "f2_calligraphy_room",
        name: "Calligraphy Room",
        category: "facility",
        floorId: "f2",
        rect: { x: 8, y: 417, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang kaligrafi tradisional (Shodou) beralas tatami dengan tinta bak hitam dan kuas bulu bambu."
      },
      {
        id: "f2_gaming_club",
        name: "Gaming Club",
        category: "club",
        floorId: "f2",
        rect: { x: 598, y: 145, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang klub video game dan esports. Layar monitor refresh-rate tinggi, game retro, dan arena mabar.",
        ekskulId: "gaming"
      },
      {
        id: "f2_workshop",
        name: "Workshop",
        category: "facility",
        floorId: "f2",
        rect: { x: 598, y: 281, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Bengkel kriya dan teknologi untuk pertukangan kayu, solder robotika, dan pembuatan properti festival."
      },
      {
        id: "f2_science_lab",
        name: "Science Lab",
        category: "facility",
        floorId: "f2",
        rect: { x: 598, y: 417, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Laboratorium kimia fisika berwastafel meja batu, tabung reaksi, dan lemari asam bergas pembakar Bunsen.",
        relatedEkskulIds: ["kir_osn"]
      },
      {
        id: "f2_female_bathroom_w",
        name: "Female Bathroom (West)",
        shortLabel: "Female Bathroom",
        category: "utility",
        floorId: "f2",
        rect: { x: 8, y: 645, width: 98, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswi sayap barat lantai 2."
      },
      {
        id: "f2_male_bathroom_w",
        name: "Male Bathroom (West)",
        shortLabel: "Male Bathroom",
        category: "utility",
        floorId: "f2",
        rect: { x: 8, y: 713, width: 98, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswa sayap barat lantai 2."
      },
      {
        id: "f2_classroom_2_1",
        name: "Classroom 2-1",
        category: "classroom",
        floorId: "f2",
        rect: { x: 155, y: 601, width: 124, height: 94 },
        labelOrientation: "horizontal",
        description: "Ruang kelas 2-1: murid kelas dua yang aktif berorganisasi dan menikmati puncak masa muda SMA."
      },
      {
        id: "f2_cafeteria",
        name: "Cafeteria",
        category: "common",
        floorId: "f2",
        rect: { x: 279, y: 601, width: 146, height: 180 },
        labelOrientation: "horizontal",
        description: "Kantin terbuka lantai 2 tempat murid berkumpul menyantap makan siang, membeli ramen, dan ngobrol akrab."
      },
      {
        id: "f2_classroom_2_2",
        name: "Classroom 2-2",
        category: "classroom",
        floorId: "f2",
        rect: { x: 425, y: 601, width: 126, height: 94 },
        labelOrientation: "horizontal",
        description: "Ruang kelas 2-2: ruang kelas penuh keceriaan di sayap selatan."
      },
      {
        id: "f2_female_bathroom_e",
        name: "Female Bathroom (East)",
        shortLabel: "Female Bathroom",
        category: "utility",
        floorId: "f2",
        rect: { x: 598, y: 645, width: 97, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswi sayap timur lantai 2."
      },
      {
        id: "f2_male_bathroom_e",
        name: "Male Bathroom (East)",
        shortLabel: "Male Bathroom",
        category: "utility",
        floorId: "f2",
        rect: { x: 598, y: 713, width: 97, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswa sayap timur lantai 2."
      }
    ]
  },

  // =========================================================================
  // FIRST FLOOR (18 Rooms)
  // =========================================================================
  f1: {
    id: "f1",
    label: "First Floor (1F)",
    level: 1,
    viewBox: "0 0 704 792",
    outline: MAIN_BUILDING_OUTLINE,
    courtyard: MAIN_BUILDING_COURTYARD,
    rooms: [
      {
        id: "f1_storage_nw",
        name: "Storage (NW)",
        shortLabel: "Storage",
        category: "utility",
        floorId: "f1",
        rect: { x: 8, y: 8, width: 98, height: 50 },
        labelOrientation: "horizontal",
        description: "Gudang peralatan kebersihan dan pemeliharaan sayap barat lantai dasar."
      },
      {
        id: "f1_cooking_club",
        name: "Cooking Club",
        category: "club",
        floorId: "f1",
        rect: { x: 146, y: 8, width: 135, height: 97 },
        labelOrientation: "horizontal",
        description: "Klub memasak & kuliner beraroma bento manis dan cokelat hangat. Tempat lahirnya bekal cinta.",
        ekskulId: "cooking"
      },
      {
        id: "f1_drama_club",
        name: "Drama Club",
        category: "club",
        floorId: "f1",
        rect: { x: 281, y: 8, width: 137, height: 97 },
        labelOrientation: "horizontal",
        description: "Ruang klub teater & seni peran. Berisi rak kostum panggung, naskah drama, dan cermin rias akting.",
        ekskulId: "drama"
      },
      {
        id: "f1_occult_club",
        name: "Occult Club",
        category: "club",
        floorId: "f1",
        rect: { x: 418, y: 8, width: 136, height: 97 },
        labelOrientation: "horizontal",
        description: "Ruang klub okultisme bernuansa temaram dengan lilin ungu aromaterapi dan kartu tarot ramalan.",
        ekskulId: "occult"
      },
      {
        id: "f1_storage_ne",
        name: "Storage (NE)",
        shortLabel: "Storage",
        category: "utility",
        floorId: "f1",
        rect: { x: 598, y: 8, width: 97, height: 50 },
        labelOrientation: "horizontal",
        description: "Gudang sayap timur lantai 1 untuk persediaan ekstra."
      },
      {
        id: "f1_guidance_counselor",
        name: "Guidance Counselor",
        category: "admin",
        floorId: "f1",
        rect: { x: 8, y: 145, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang guru Bimbingan Konseling (BK) beraroma teh hangat tempat konsultasi karir dan curhat masalah asmara."
      },
      {
        id: "f1_faculty_room",
        name: "Faculty Room",
        category: "admin",
        floorId: "f1",
        rect: { x: 8, y: 281, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang dewan guru Seishun Academy. Deretan meja kerja penuh lembar soal ujian dan cangkir kopi."
      },
      {
        id: "f1_infirmary",
        name: "Infirmary",
        category: "facility",
        floorId: "f1",
        rect: { x: 8, y: 417, width: 98, height: 136 },
        labelOrientation: "vertical",
        description: "Unit Kesehatan Sekolah (UKS) bertirai putih dengan ranjang istirahat, kotak P3K, dan termometer."
      },
      {
        id: "f1_meeting_room",
        name: "Meeting Room",
        category: "facility",
        floorId: "f1",
        rect: { x: 598, y: 145, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang pertemuan komite sekolah dan perwakilan orang tua murid (PTA)."
      },
      {
        id: "f1_sewing_room",
        name: "Sewing Room",
        category: "facility",
        floorId: "f1",
        rect: { x: 598, y: 281, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Ruang jahit dan tata busana berjejer mesin jahit Singer, manekin seragam, dan gulungan benang warna-warni."
      },
      {
        id: "f1_home_ec_room",
        name: "Home Ec Room",
        category: "facility",
        floorId: "f1",
        rect: { x: 598, y: 417, width: 97, height: 136 },
        labelOrientation: "vertical",
        description: "Dapur tata boga untuk praktik memasak kurikulum sekolah beroven gas dan deretan wastafel cuci piring.",
        relatedEkskulIds: ["cooking"]
      },
      {
        id: "f1_female_bathroom_w",
        name: "Female Bathroom (West)",
        shortLabel: "Female Bathroom",
        category: "utility",
        floorId: "f1",
        rect: { x: 8, y: 645, width: 98, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswi sayap barat lantai 1 dekat lorong loker."
      },
      {
        id: "f1_male_bathroom_w",
        name: "Male Bathroom (West)",
        shortLabel: "Male Bathroom",
        category: "utility",
        floorId: "f1",
        rect: { x: 8, y: 713, width: 98, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswa sayap barat lantai 1."
      },
      {
        id: "f1_classroom_1_1",
        name: "Classroom 1-1",
        category: "classroom",
        floorId: "f1",
        rect: { x: 155, y: 601, width: 124, height: 94 },
        labelOrientation: "horizontal",
        description: "Ruang kelas 1-1: murid baru kelas satu yang antusias memulai hari-hari pertama di SMA."
      },
      {
        id: "f1_lockers",
        name: "Lockers",
        category: "common",
        floorId: "f1",
        rect: { x: 279, y: 601, width: 146, height: 180 },
        labelOrientation: "horizontal",
        description: "Area loker sepatu (Getabako) pintu masuk utama sekolah. Tempat legendaris menaruh surat cinta diam-diam."
      },
      {
        id: "f1_classroom_1_2",
        name: "Classroom 1-2",
        category: "classroom",
        floorId: "f1",
        rect: { x: 425, y: 601, width: 126, height: 94 },
        labelOrientation: "horizontal",
        description: "Ruang kelas 1-2: ruang kelas murid tingkat pertama dengan jendela menatap halaman selatan."
      },
      {
        id: "f1_female_bathroom_e",
        name: "Female Bathroom (East)",
        shortLabel: "Female Bathroom",
        category: "utility",
        floorId: "f1",
        rect: { x: 598, y: 645, width: 97, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswi sayap timur lantai 1."
      },
      {
        id: "f1_male_bathroom_e",
        name: "Male Bathroom (East)",
        shortLabel: "Male Bathroom",
        category: "utility",
        floorId: "f1",
        rect: { x: 598, y: 713, width: 97, height: 68 },
        labelOrientation: "horizontal",
        description: "Toilet siswa sayap timur lantai 1."
      }
    ],
    decorativeElements: [
      // F1 Courtyard Garden: Cross pathways & round rotunda fountain
      {
        id: "f1_garden_path_h",
        type: "rect",
        x: 146,
        y: 326,
        width: 408,
        height: 44,
        fill: "#1e293b",
        stroke: "#334155",
        strokeWidth: 2.5
      },
      {
        id: "f1_garden_path_v",
        type: "rect",
        x: 328,
        y: 145,
        width: 44,
        height: 406,
        fill: "#1e293b",
        stroke: "#334155",
        strokeWidth: 2.5
      },
      {
        id: "f1_garden_rotunda",
        type: "circle",
        cx: 350,
        cy: 348,
        r: 25,
        fill: "#064e3b",
        stroke: "#10b981",
        strokeWidth: 2.5
      }
    ]
  },

  // =========================================================================
  // ROOFTOP (5 Rooms / Access Blocks)
  // =========================================================================
  roof: {
    id: "roof",
    label: "Rooftop",
    level: 4,
    viewBox: "0 0 704 792",
    outline: MAIN_BUILDING_OUTLINE,
    courtyard: MAIN_BUILDING_COURTYARD,
    rooms: [
      {
        id: "roof_access_nw",
        name: "Rooftop Access (NW)",
        shortLabel: "Access",
        category: "access",
        floorId: "roof",
        rect: { x: 10, y: 58, width: 88, height: 86 },
        labelOrientation: "horizontal",
        description: "Pintu keluar tangga barat laut menuju dak atap gedung sekolah."
      },
      {
        id: "roof_access_ne",
        name: "Rooftop Access (NE)",
        shortLabel: "Access",
        category: "access",
        floorId: "roof",
        rect: { x: 604, y: 58, width: 88, height: 86 },
        labelOrientation: "horizontal",
        description: "Pintu keluar tangga timur laut menuju atap gedung."
      },
      {
        id: "roof_access_sw",
        name: "Rooftop Access (SW)",
        shortLabel: "Access",
        category: "access",
        floorId: "roof",
        rect: { x: 10, y: 551, width: 88, height: 93 },
        labelOrientation: "horizontal",
        description: "Pintu tangga barat daya menuju atap terbuka."
      },
      {
        id: "roof_access_se",
        name: "Rooftop Access (SE)",
        shortLabel: "Access",
        category: "access",
        floorId: "roof",
        rect: { x: 604, y: 551, width: 88, height: 93 },
        labelOrientation: "horizontal",
        description: "Pintu tangga tenggara menuju atap terbuka."
      },
      {
        id: "roof_access_s",
        name: "Rooftop Access (S)",
        shortLabel: "Access",
        category: "access",
        floorId: "roof",
        rect: { x: 305, y: 691, width: 88, height: 87 },
        labelOrientation: "horizontal",
        description: "Pintu akses tangga selatan menuju dek atap tengah."
      }
    ]
  },

  // =========================================================================
  // CAMPUS MAP (8 Rooms / Zones)
  // =========================================================================
  campus: {
    id: "campus",
    label: "Campus Map",
    level: 0,
    viewBox: "0 0 684 972",
    outline: [
      { x: 0, y: 0 },
      { x: 684, y: 0 },
      { x: 684, y: 972 },
      { x: 0, y: 972 }
    ],
    rooms: [
      {
        id: "campus_athletic_field",
        name: "Athletic Field",
        category: "outdoor",
        floorId: "campus",
        rect: { x: 82, y: 20, width: 518, height: 189 },
        polygon: [
          { x: 181, y: 20 },
          { x: 500, y: 20 },
          { x: 600, y: 114 },
          { x: 600, y: 209 },
          { x: 82, y: 209 },
          { x: 82, y: 114 }
        ],
        labelOrientation: "horizontal",
        description: "Lapangan atletik outdoor luas dengan lintasan lari tanah liat dan podium upacara."
      },
      {
        id: "campus_swimming_pool",
        name: "Swimming Pool",
        category: "outdoor",
        floorId: "campus",
        rect: { x: 83, y: 210, width: 210, height: 132 },
        labelOrientation: "horizontal",
        description: "Kolam renang standar 25 meter berpagar kawat, air biru jernih, dan tribun penonton."
      },
      {
        id: "campus_gymnasium",
        name: "Gymnasium",
        category: "facility",
        floorId: "campus",
        rect: { x: 381, y: 210, width: 220, height: 132 },
        labelOrientation: "horizontal",
        description: "Gedung olahraga indoor beralas parket kayu untuk tanding basket, voli, bulutangkis, dan upacara."
      },
      {
        id: "campus_west_zen_garden",
        name: "West Zen Garden",
        category: "outdoor",
        floorId: "campus",
        rect: { x: 0, y: 453, width: 100, height: 107 },
        labelOrientation: "vertical",
        description: "Taman batu Zen barat yang tenang berpasir putih tersisir rapi dan rumpun bambu pelindung.",
        relatedEkskulIds: ["kendo"]
      },
      {
        id: "campus_east_zen_garden",
        name: "East Zen Garden",
        category: "outdoor",
        floorId: "campus",
        rect: { x: 584, y: 453, width: 100, height: 107 },
        labelOrientation: "vertical",
        description: "Taman batu Zen timur dengan kolam ikan koi dan lentera batu antik."
      },
      {
        id: "campus_garden",
        name: "Garden",
        category: "outdoor",
        floorId: "campus",
        rect: { x: 0, y: 663, width: 140, height: 145 },
        labelOrientation: "horizontal",
        description: "Taman bunga botani barat penuh semak hydrangea mekar dan bangku taman romantis."
      },
      {
        id: "campus_hedge_maze",
        name: "Hedge Maze",
        category: "outdoor",
        floorId: "campus",
        rect: { x: 541, y: 663, width: 143, height: 145 },
        labelOrientation: "horizontal",
        description: "Labirin tanaman semak hijau yang terawat rapi. Tempat bersembunyi favorit saat festival sekolah."
      },
      {
        id: "campus_main_building",
        name: "Main Building",
        category: "facility",
        floorId: "campus",
        rect: { x: 196, y: 477, width: 290, height: 328 },
        labelOrientation: "horizontal",
        description: "Gedung utama 3 lantai Seishun Academy. Klik untuk masuk dan melihat denah lantai secara mendalam."
      }
    ],
    decorativeElements: [
      // 1. Campus Walkway Network (Connecting all buildings, athletic field, and south gate)
      {
        id: "campus_walkways",
        type: "path",
        pathData: "M 103 143 L 580 143 L 580 173 L 350 174 L 352 193 L 541 193 L 540 208 L 351 207 L 349 209 L 349 267 L 351 269 L 407 269 L 407 286 L 352 286 L 350 288 L 350 344 L 352 346 L 540 346 L 539 363 L 351 363 L 350 439 L 369 441 L 371 439 L 370 425 L 388 425 L 388 440 L 390 441 L 561 442 L 561 497 L 577 498 L 578 516 L 560 518 L 560 574 L 523 574 L 523 727 L 540 727 L 540 745 L 523 745 L 523 822 L 561 823 L 570 814 L 587 832 L 570 852 L 559 840 L 409 840 L 407 859 L 371 859 L 369 861 L 369 961 L 313 961 L 313 861 L 311 859 L 274 859 L 274 840 L 123 840 L 112 850 L 94 832 L 112 813 L 120 822 L 160 821 L 160 747 L 158 745 L 142 746 L 142 727 L 160 726 L 160 574 L 122 573 L 122 517 L 104 516 L 103 496 L 122 496 L 122 439 L 294 439 L 293 425 L 312 424 L 313 441 L 333 439 L 333 174 L 102 174 Z M 200 458 L 197 460 L 197 476 L 194 477 L 159 477 L 159 459 L 141 459 L 141 497 L 158 497 L 158 515 L 141 515 L 141 554 L 178 554 L 178 822 L 310 823 L 312 806 L 370 806 L 372 823 L 503 823 L 505 821 L 505 555 L 542 555 L 543 517 L 523 516 L 521 535 L 488 535 L 488 477 L 484 458 L 447 458 L 446 476 L 429 476 L 429 459 L 371 459 L 370 476 L 314 476 L 312 458 L 256 458 L 254 460 L 255 475 L 238 476 L 236 458 Z M 524 458 L 522 460 L 522 497 L 542 498 L 542 458 Z",
        fill: "#182335",
        stroke: "#334155",
        strokeWidth: 2
      },
      // 2. Athletic field bleachers / inner track box
      {
        id: "campus_athletic_track",
        type: "rect",
        x: 102,
        y: 143,
        width: 478,
        height: 30,
        fill: "#0c231b",
        stroke: "#10b981",
        strokeWidth: 2
      },
      // 3. Top circle above athletic field (Flagpole/Podium - decorative, no name)
      {
        id: "campus_flagpole_circle",
        type: "circle",
        cx: 343,
        cy: 64,
        r: 28,
        fill: "#064e3b",
        stroke: "#10b981",
        strokeWidth: 2.5
      },
      // 4. Main building inner courtyard
      {
        id: "campus_main_building_courtyard",
        type: "rect",
        x: 253,
        y: 533,
        width: 175,
        height: 174,
        fill: "#0b0f19",
        stroke: "#2d3748",
        strokeWidth: 2
      }
    ]
  }
};
