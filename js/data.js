/**
 * DAMSEL & DESIRE - Master System Data
 * Japanese High School Romance & School Life TRPG (D&D 5e Alternative Chassis)
 */

const DD_DATA = {
  version: "1.1.0",
  title: "Damsel & Desire",
  subtitle: "Japanese High School Romance TRPG",

  // 6 Core Ability Scores and their 3 inherent Sub-skills
  abilities: {
    physique: {
      id: "physique", name: "Physique", short: "PHY", dndEquiv: "STR / DEX / CON",
      desc: "Kekuatan otot, kelenturan tubuh, refleks motorik, dan daya tahan fisik.",
      skills: [
        { id: "power",   name: "Power",   desc: "Angkat beban, mendobrak pintu, memukul, mendorong, dan adu tenaga fisik." },
        { id: "agility", name: "Agility", desc: "Kelincahan, kecepatan refleks, kejar kereta, panjat pagar sekolah, dan kelenturan." },
        { id: "stamina", name: "Stamina", desc: "Daya tahan lari maraton, begadang belajar, tahan benturan, dan tidak mudah masuk angin." }
      ]
    },
    intelligent: {
      id: "intelligent", name: "Intelligent", short: "INT", dndEquiv: "INT / Logic",
      desc: "Kecerdasan akademis, nalar logika, pemecahan masalah, dan pengetahuan jalanan.",
      skills: [
        { id: "academic", name: "Academic", desc: "Materi ujian sekolah, rumus matematika/sains, sejarah, dan hafalan teori pelajaran." },
        { id: "people",   name: "People",   desc: "Membaca psikologi lawan, menganalisis bahasa tubuh, mendeteksi motif bohong/salting." },
        { id: "street",   name: "Street",   desc: "Akal-akalan pergaulan, tahu jalan pintas rahasia kota, gosip geng, dan trik bertahan di jalanan." }
      ]
    },
    looks: {
      id: "looks", name: "Looks", short: "LOK", dndEquiv: "CHA / Attractiveness",
      desc: "Daya tarik visual, pesona karismatik, gaya berpakaian, dan aura kehadiran.",
      skills: [
        { id: "charm",     name: "Charm",     desc: "Pesona personal, senyuman menawan, rayuan asmara, kedipan mata, dan daya pikat alami." },
        { id: "influence", name: "Influence", desc: "Pengaruh reputasi di kalangan murid, disegani kawan dan lawan, serta wibawa status." },
        { id: "aura",      name: "Aura",      desc: "Kehadiran yang mencolok, tatapan tajam berkarisma, atau vibes misterius yang membius." }
      ]
    },
    mind: {
      id: "mind", name: "Mind", short: "MND", dndEquiv: "WIS / Mental Fortitude",
      desc: "Kekuatan mental, ketenangan batin, empati, dan kepekaan membaca atmosfer sekitar.",
      skills: [
        { id: "emotional",     name: "Emotional",     desc: "Kontrol emosi pribadi, jaga imej (jaim), menahan rasa malu, dan mengelola kegelisahan hati." },
        { id: "interpersonal", name: "Interpersonal", desc: "Peka terhadap perasaan orang lain, mendengarkan curhat, merajut ikatan hati mendalam." },
        { id: "awareness",     name: "Awareness",     desc: "Membaca atmosfer sosial (Kuuki Yomenai / Kuuki Yomeru), menyadari tatapan rahasia orang lain." }
      ]
    },
    talent: {
      id: "talent", name: "Talent", short: "TLN", dndEquiv: "Performance / Creativity",
      desc: "Bakat alami, ekspresi kesenian, keahlian panggung, dan keluwesan berimprovisasi.",
      skills: [
        { id: "creative",      name: "Creative",      desc: "Merancang ide festival sekolah, menulis surat cinta puitis, ilustrasi, dan desain kreatif." },
        { id: "performance",   name: "Performance",   desc: "Akting panggung drama, bernyanyi, memainkan instrumen musik, dan pidato membakar semangat." },
        { id: "adaptability",  name: "Adaptability",  desc: "Improvisasi kilat saat rencana berantakan, mengubah suasana kaku, dan fleksibel menghadapi situasi." }
      ]
    },
    luck: {
      id: "luck", name: "Luck", short: "LCK", dndEquiv: "Fate / Fortune",
      desc: "Faktor keberuntungan murni, takdir kasmaran, dan kebetulan-kebetulan dramatis anime.",
      skills: [
        { id: "relationship_luck", name: "Relationship Luck", desc: "Papasan romantis tidak sengaja, tabrakan bawa roti di tikungan, terlindung payung bareng saat hujan." },
        { id: "situation_luck",    name: "Situation Luck",    desc: "Lolos razia sidak guru BP, nemu uang di jalan, guru killer izin tidak masuk kelas." },
        { id: "academic_luck",     name: "Academic Luck",     desc: "Hoki tebak kancing saat ujian, materi yang dipelajari semalam pas keluar di lembar soal." }
      ]
    }
  },

  // 12 Ekskul (Classes) — 3 Club Moves each (total 36)
  ekskul: [
    {
      id: "student_council", name: "Student Council (OSIS)", tagline: "Elit Organisasi & Penegak Ketertiban Sekolah",
      hitDie: "d8", primaryStat: "Looks / Intelligent", savingThrows: ["intelligent", "looks"],
      perkDesc: "Hak akses ruang OSIS ber-AC, wewenang menegur murid lain, anggaran proposal kegiatan sekolah, dan disegani dewan guru.",
      subclasses: [
        { id: "presidium",    name: "Ketua / Presidium",           desc: "Pemimpin mutlak OSIS. Bonus +2 pada semua Looks checks saat berhadapan dengan guru atau undangan eksternal." },
        { id: "discipline",   name: "Divisi Kedisiplinan",         desc: "Penegak aturan sekolah. Advantage pada Intimidasi dan Check untuk mendeteksi pelanggaran murid lain." }
      ],
      clubMoves: [
        { name: "Perintah Kedisiplinan (Disciplinary Order)", type: "Social Move", cost: "1 Action", range: "30 ft", check: "Looks / Influence", effect: "Target Mind Save (DC 8+Prof+Looks). Gagal: Stunned 1 giliran & kehilangan 1d6 Composure.", desc: "Menegur target dengan suara tegas berwibawa khas OSIS." },
        { name: "Koneksi Pihak Sekolah (Faculty Pass)", type: "Reaction / Utility", cost: "1x per Short Rest", range: "Self / Touch", check: "Otomatis", effect: "Membatalkan konsekuensi teguran guru atau razia loker untuk dirimu dan 1 teman.", desc: "Menunjukkan kartu identitas OSIS atau surat tugas resmi." },
        { name: "Proposal Darurat (Emergency Budget)", type: "Utility Move", cost: "10 Menit", range: "Self", check: "Intelligent / Academic", effect: "Mendapatkan 1 item kebutuhan mendesak (alat sekolah, tiket, pass) tanpa biaya selama sesi ini.", desc: "Menyusun surat permintaan dana darurat dengan stempel OSIS resmi." }
      ]
    },
    {
      id: "kendo", name: "Kendo (Pedang Bambu)", tagline: "Disiplin Pedang Samurai & Konsentrasi Batin",
      hitDie: "d10", primaryStat: "Physique / Mind", savingThrows: ["physique", "mind"],
      perkDesc: "Penguasaan teknik Shinai dan Bokken, ruang latihan Dojo tradisional, kuda-kuda kokoh, dan fokus mata yang tak goyah.",
      subclasses: [
        { id: "men_striker",  name: "Gaya Serangan Kilat (Men-Striker)", desc: "Spesialisasi serangan cepat. Bonus aksi ekstra setelah serangan sukses pertama dalam ronde." },
        { id: "iron_guard",   name: "Gaya Pertahanan Keras (Iron Wall)", desc: "Spesialisasi pertahanan. +1 Physical AC permanen dan Advantage pada Physique Saving Throw." }
      ],
      clubMoves: [
        { name: "Tebasan Shinai: Men! (Head Slash)", type: "Attack / Club Move", cost: "1 Action", range: "Melee (5 ft)", check: "Physique / Power", effect: "1d8 + Mod Physique Bludgeoning. Jika mengenai helm/kepala: target Physique Save atau Disadvantage serangan berikutnya.", desc: "Pukulan vertikal terarah ke arah kepala dengan teriakan kiai menggelegar." },
        { name: "Tangkisan Sempurna (Kendo Parry)", type: "Reaction", cost: "Reaction", range: "Self", check: "+2 Physical AC", effect: "Menambah +2 Physical AC terhadap 1 serangan fisik jarak dekat yang terlihat.", desc: "Mengayunkan pedang bambu membentuk sudut tangkisan tajam membelokkan serangan lawan." },
        { name: "Kiai: Teriakan Semangat (Kiai Shout)", type: "Bonus Action / Buff", cost: "1 Bonus Action", range: "30 ft", check: "Mind / Emotional", effect: "Dirimu dan 1 sekutu mendapat Advantage pada serangan fisik berikutnya di ronde ini.", desc: "Melepas teriakan kiai penuh konsentrasi yang membakar semangat tempur." }
      ]
    },
    {
      id: "martial_arts", name: "Martial Arts (Beladiri / Karate / Judo)", tagline: "Pertarungan Jarak Dekat & Refleks Bantingan",
      hitDie: "d10", primaryStat: "Physique", savingThrows: ["physique", "talent"],
      perkDesc: "Tubuh liat tahan banting, pukulan dan tendangan tanpa senjata berdaya hancur tinggi, serta kemampuan melumpuhkan lawan tanpa senjata tajam.",
      subclasses: [
        { id: "grappler",  name: "Spesialis Bantingan (Judo / Grappler)", desc: "Ahli merebut dan membanting lawan ke tanah. Serangan Bantingan memberikan +2d4 damage tambahan." },
        { id: "striker",   name: "Spesialis Serangan Beruntun (Striker)", desc: "Ahli combo pukulan cepat. Bisa menyerang 2 kali dengan 1 aksi (setelah level 3+)." }
      ],
      clubMoves: [
        { name: "Bantingan Matras (Seoi-Nage Takedown)", type: "Attack / Club Move", cost: "1 Action", range: "Melee (5 ft)", check: "Physique / Power vs Target Physique Save", effect: "1d6 + Mod Physique Bludgeoning. Target terjatuh Prone (terkapar).", desc: "Menarik kerah atau lengan lawan, memutar badan, dan membantingnya keras ke lantai." },
        { name: "Pukulan Cepat Kombo (Rapid Flurry)", type: "Bonus Action", cost: "1 Bonus Action", range: "Melee (5 ft)", check: "Physique / Agility", effect: "1d4 + Mod Physique Physical Damage tambahan setelah serangan utama.", desc: "Kombinasi pukulan cepat tanpa jeda menyasar perut lawan." },
        { name: "Kunci Sendi (Joint Lock)", type: "Attack / Club Move", cost: "1 Action", range: "Melee (5 ft)", check: "Physique / Agility vs Target Physique Save", effect: "Target Restrained selama 1 giliran. Target tidak bisa menyerang hingga lolos dengan Physique check DC 12.", desc: "Memegang siku atau pergelangan tangan lawan dan menguncinya ke sudut yang menyakitkan." }
      ]
    },
    {
      id: "sports", name: "Sports (Sepak Bola / Basket / Atletik)", tagline: "Stamina Baja & Kecepatan Lapangan Terbuka",
      hitDie: "d10", primaryStat: "Physique / Looks", savingThrows: ["physique", "physique"],
      perkDesc: "Kecepatan lari di atas rata-rata (+10 ft speed), keringat karismatik yang digemari murid lain, dan stamina tahan maraton.",
      subclasses: [
        { id: "ace_striker", name: "Striker / Ace Lapangan", desc: "Serangan fisik berbasis kecepatan. Bonus +1d4 damage saat menyerang setelah berlari setidaknya 15 ft." },
        { id: "team_captain", name: "Kapten Regu", desc: "Pemimpin tim. Sekali per istirahat, berikan 1d6 Inspiration Die ke seluruh anggota tim." }
      ],
      clubMoves: [
        { name: "Terobosan Kilat (Fast Break Sprint)", type: "Bonus Action", cost: "1 Bonus Action", range: "Self", check: "Otomatis", effect: "Menggandakan kecepatan gerak (Dash) dan tidak memicu Opportunity Attack saat bergerak melewati lawan.", desc: "Manuver lari cepat zig-zag menembus kerumunan seperti mengejar bola di lapangan." },
        { name: "Lemparan Bola Akurat (Precision Throw)", type: "Attack / Club Move", cost: "1 Action", range: "Ranged (40 ft)", check: "Physique / Agility", effect: "1d6 + Mod Physique Bludgeoning. Target terpental atau terkejut jika kena di wajah.", desc: "Melempar bola basket, bola voli, atau benda bulat lainnya dengan ketepatan presisi tinggi." },
        { name: "Sorak Penyemangat (Rally Cheer)", type: "Buff Move", cost: "Bonus Action", range: "30 ft", check: "Looks / Influence", effect: "1 sekutu memulihkan 1d4 Physical HP dan mendapat Advantage pada 1 check fisik berikutnya.", desc: "Berteriak penuh semangat ke arah teman yang tertekan, memicu adrenalin mereka kembali." }
      ]
    },
    {
      id: "drama", name: "Drama Club (Teater & Seni Peran)", tagline: "Manipulasi Emosi, Akting Panggung & Dusta Sempurna",
      hitDie: "d8", primaryStat: "Looks / Talent", savingThrows: ["looks", "talent"],
      perkDesc: "Kostum panggung beragam, kemampuan meneteskan air mata buatan seketika, menirukan intonasi orang lain, dan menyamar.",
      subclasses: [
        { id: "lead_actor",  name: "Aktor Protagonis / Bintang Panggung", desc: "Ahli menarik simpati massa. Serangan sosial berbasis Looks memberikan 1d4 bonus damage Composure." },
        { id: "antagonist",  name: "Master Tipu Daya (Antagonist)", desc: "Ahli manipulasi. Advantage pada semua check untuk menipu, berpura-pura, atau menyamar." }
      ],
      clubMoves: [
        { name: "Air Mata Buatan (Fake Tears / Manipulation)", type: "Social Move", cost: "1 Action", range: "15 ft", check: "Talent / Performance vs Target Mind Save", effect: "Target Disadvantage semua serangan terhadapmu & kehilangan 1d6 Composure karena rasa bersalah.", desc: "Berakting sedih tersedu-sedu sambil menggigit bibir, membalikkan simpati seluruh orang di sekitar." },
        { name: "Persona Penyamaran (Method Acting)", type: "Utility Move", cost: "10 Menit", range: "Self", check: "Talent / Adaptability", effect: "Advantage pada semua check People & Street saat menyamar sebagai tipe orang lain.", desc: "Merombak gaya bicara, cara jalan, dan dandanan untuk berpura-pura jadi murid lain." },
        { name: "Monolog Dramatis (Grand Speech)", type: "Social Move", cost: "1 Action", range: "30 ft (Area)", check: "Talent / Performance vs seluruh target Mind Save", effect: "Seluruh musuh dalam jangkauan kehilangan 1d4 Composure. Sekutu mendapat Advantage pada Social Saves 1 giliran.", desc: "Berpidato dengan ekspresi dramatis penuh penjiwaan yang menguras emosi siapa saja yang mendengar." }
      ]
    },
    {
      id: "kir_osn", name: "KIR / OSN (Sains & Karya Ilmiah Remaja)", tagline: "Analisis Tajam, Riset Ilmiah & Reaksi Kimia",
      hitDie: "d6", primaryStat: "Intelligent", savingThrows: ["intelligent", "mind"],
      perkDesc: "Kunci akses laboratorium sains & bahan kimia, bank soal olimpiade, mikroskop, dan laptop penuh data analisis.",
      subclasses: [
        { id: "chemist",   name: "Peneliti Kimia & Biologi", desc: "Ahli senyawa kimia. Bisa menciptakan efek racun, asap, atau pelemas otot dari bahan lab sekali per sesi." },
        { id: "hacker",    name: "Hacker Komputer & Robotika", desc: "Ahli perangkat digital. Advantage pada check Intelligent untuk membobol sistem, CCTV, atau kunci digital." }
      ],
      clubMoves: [
        { name: "Analisis Titik Lemah (Analytical Deduction)", type: "Bonus Action", cost: "1 Bonus Action", range: "30 ft", check: "Intelligent / Academic", effect: "Mengetahui 1 stat tertinggi dan 1 kelemahan target. Serangan sekutu berikutnya ke target mendapat Advantage.", desc: "Mengamati postur dan kebiasaan lawan lewat perhitungan matematis untuk menemukan celah pertahanan." },
        { name: "Asap Reaksi Kimia (Lab Smoke Screen)", type: "Utility / Combat Move", cost: "1 Action", range: "15 ft", check: "Otomatis", effect: "Menciptakan kabut pekat radius 10 ft selama 2 giliran. Semua pandangan di dalamnya tertutup.", desc: "Mencampurkan larutan kimia darurat dari tabung saku menghasilkan asap tebal." },
        { name: "Formula Konsentrasi (Study Buff)", type: "Utility Move", cost: "10 Menit", range: "Self / Touch", check: "Intelligent / Academic", effect: "Target mendapat Advantage pada 1 check Intelligent atau Talent berikutnya dalam 1 jam ke depan.", desc: "Menyusun peta konsep atau ringkasan materi kilat agar pikiran fokus sebelum tes atau debat." }
      ]
    },
    {
      id: "pramuka_paskin", name: "Pramuka / Paskin (Paskibra & Kedisiplinan Baris)", tagline: "Tali Temali, Disiplin Militer & Postur Tegak",
      hitDie: "d10", primaryStat: "Physique / Mind", savingThrows: ["physique", "mind"],
      perkDesc: "Keahlian tali temali mengikat barang/lawan, tiang bendera serbaguna, peluit komando, dan daya tahan berjemur di lapangan.",
      subclasses: [
        { id: "danton",   name: "Komandan Peleton (Danton)", desc: "Pemimpin barisan. Advantage saat memimpin aksi kelompok, bonus +2 pada semua Social Saves tim." },
        { id: "pioneer",  name: "Pionir Tali Temali & Tenda", desc: "Ahli bertahan hidup. Tidak pernah kehilangan arah di luar ruangan. +2 Physique Save terhadap bahaya alam." }
      ],
      clubMoves: [
        { name: "Kuncian Tali Pramuka (Rope Restrain)", type: "Attack / Club Move", cost: "1 Action", range: "Melee (5 ft)", check: "Physique / Agility vs Target Agility", effect: "Target Restrained tidak bisa bergerak hingga lolos Physique check DC 13.", desc: "Menggunakan seutas tali pramuka tebal untuk membelenggu tangan atau kaki lawan." },
        { name: "Aba-aba Menggelegar (Commanding Drill)", type: "Buff / Social Move", cost: "1 Bonus Action", range: "30 ft", check: "Mind / Emotional", effect: "Semua kawan dalam radius 30 ft mendapat +2 bonus pada Saving Throw berikutnya.", desc: "Meneriakkan aba-aba baris berbaris dengan nada tegas yang membangkitkan fokus kawan." },
        { name: "Teknik Pengintaian (Scout Surveillance)", type: "Utility Move", cost: "1 Menit", range: "60 ft", check: "Mind / Awareness", effect: "Mendeteksi jumlah dan posisi semua musuh atau target di area dalam jangkauan selama 1 menit.", desc: "Mengamati lingkungan sekitar dengan gerakan senyap dan sistematis layaknya pengintai lapangan." }
      ]
    },
    {
      id: "pecinta_alam", name: "Pecinta Alam (Mapala / Sispala)", tagline: "Insting Bertahan Hidup, Peta Liar & Fisik Tangguh",
      hitDie: "d10", primaryStat: "Physique / Mind", savingThrows: ["physique", "mind"],
      perkDesc: "Tenda dome portabel, kompor gas mini, ransel gunung besar (kapasitas tas ekstra), dan indra penciuman cuaca tajam.",
      subclasses: [
        { id: "explorer",  name: "Penjelajah Rimba & Pendaki", desc: "Spesialis navigasi dan terrain. Advantage pada Physique checks untuk memanjat, berenang, atau melintasi rintangan alam." },
        { id: "medic",     name: "Ahli Pertolongan Pertama (Medic)", desc: "Spesialis penyembuhan lapangan. Heal dice meningkat jadi 1d10 dan bisa menyembuhkan 1 teman per Short Rest." }
      ],
      clubMoves: [
        { name: "Insting Survival (Wilderness Awareness)", type: "Pasif / Reaksi", cost: "Pasif / Reaksi", range: "Self", check: "Mind / Awareness", effect: "Tidak pernah tersesat di area luar ruangan dan tidak bisa dikejutkan (Surprised) dalam bahaya mendadak.", desc: "Membaca arah angin, lumut pohon, dan jejak langkah kaki di tanah." },
        { name: "P3K Darurat Lapangan (First Aid Field Patch)", type: "Heal Move", cost: "1 Action (1x per Rest)", range: "Touch", check: "Otomatis", effect: "Memulihkan 1d8 + Mod Mind Physical HP atau Composure ke teman yang terluka.", desc: "Membalut luka dengan perban elastis dan memberikan air minum hangat dari termos lapangan." },
        { name: "Panjat Penghalang (Obstacle Climb)", type: "Utility Move", cost: "1 Bonus Action", range: "Self", check: "Physique / Agility", effect: "Berhasil melewati tembok, pagar, atau rintangan tinggi tanpa check, sekali per Short Rest.", desc: "Teknik panjat yang sudah terlatih membuat segala dinding bukan halangan." }
      ]
    },
    {
      id: "penyiaran", name: "Penyiaran (Broadcasting / Radio Sekolah)", tagline: "Suara Emas Penguasa Speaker Sekolah & Intel Gosip",
      hitDie: "d6", primaryStat: "Looks / Intelligent", savingThrows: ["intelligent", "looks"],
      perkDesc: "Hak akses ruang siaran audio sekolah, mikrofon, pemutar lagu, dan jaringan informan gosip paling mutakhir di sekolah.",
      subclasses: [
        { id: "radio_host",   name: "Penyiar Radio Sekolah", desc: "Suara emas sekolah. Semua Social Moves berbasis suara mendapat +1 ke DC check dan 1d4 bonus damage." },
        { id: "investigator", name: "Reporter Investigasi", desc: "Ahli menggali informasi. Advantage pada semua check Intelligent (Street) dan Mind (Interpersonal) untuk mencari gosip." }
      ],
      clubMoves: [
        { name: "Pengumuman Speaker Sekolah (Public Broadcast)", type: "Utility / Social Move", cost: "1 Aksi Khusus", range: "Seluruh Sekolah", check: "Looks / Influence", effect: "Menyampaikan pesan ke seluruh sekolah. Target gosip mengalami 1d8 Composure damage jika nama mereka disebut.", desc: "Menyalakan mixer audio dan menyiarkan informasi menggemparkan lewat speaker sekolah." },
        { name: "Modulasi Suara Menghanyutkan (Soothing ASMR Voice)", type: "Social Move", cost: "1 Action", range: "30 ft", check: "Looks / Charm vs Target Mind Save", effect: "Target tidak bisa mengambil aksi agresif selama 1 giliran karena terpesona.", desc: "Berbicara dengan intonasi merdu dan menenangkan seperti penyiar podcast malam hari." },
        { name: "Bocoran Intel Eksklusif (Exclusive Scoop)", type: "Utility Move", cost: "10 Menit", range: "Self", check: "Intelligent / Street", effect: "Mendapatkan 1 informasi rahasia atau rumor akurat tentang karakter atau situasi yang diinginkan dari jaringan informan.", desc: "Mengontak sumber rahasia di balik layar untuk mengumpulkan intel terbaru sebelum aksi." }
      ]
    },
    {
      id: "literatur", name: "Literatur (Klub Sastra & Membaca)", tagline: "Kekuatan Kata Romantis, Sajak & Misteri Buku Lama",
      hitDie: "d6", primaryStat: "Intelligent / Mind", savingThrows: ["intelligent", "mind"],
      perkDesc: "Tempat persembunyian tenang di sudut perpustakaan, koleksi novel romansa klasik, kemampuan merangkai surat cinta mematikan.",
      subclasses: [
        { id: "novelist",   name: "Penulis Puisi & Novel Romansa", desc: "Surat cinta dan aksi romansa berbasis Talent/Creative mendapat 1d4 bonus damage Composure." },
        { id: "archivist",  name: "Penjaga Arsip Sejarah Sekolah", desc: "Ahli sejarah dan dokumen. Advantage pada semua check Intelligent terkait sejarah, peraturan, atau informasi tertulis." }
      ],
      clubMoves: [
        { name: "Surat Cinta Puitis (Lethal Love Letter)", type: "Romance Move", cost: "Dibuat saat istirahat", range: "Loker / Meja Belajar", check: "Talent / Creative vs Target Mind Save", effect: "Target kehilangan 2d6 Composure dan Heart Meter naik +1 ♥.", desc: "Menyelipkan sepucuk surat wangi berhias kata-kata puitis mendalam di loker sepatu target." },
        { name: "Membaca Pola Pikiran (Literary Empathy)", type: "Utility Move", cost: "1 Action", range: "15 ft", check: "Mind / Interpersonal", effect: "Mengetahui satu keinginan terbesar atau rasa bersalah rahasia dari target yang sedang berbicara.", desc: "Menganalisis pilihan kata dan jeda napas seseorang layaknya membaca narasi tokoh novel." },
        { name: "Kutipan Menghancurkan (Devastating Quote)", type: "Social Attack", cost: "1 Action", range: "20 ft", check: "Intelligent / Academic vs Target Mind Save", effect: "Target kehilangan 1d8 Composure karena argumennya terbantahkan sempurna oleh kata-kata tertulis.", desc: "Mengutip paragraf dari buku atau tulisan sendiri yang secara tepat membungkam argumen lawan." }
      ]
    },
    {
      id: "band", name: "Band Musik (Gitar / Drum / Vokal / Keyboard)", tagline: "Dentuman Distorsi, Semangat Jiwa Muda & Fans Fanatik",
      hitDie: "d8", primaryStat: "Looks / Talent", savingThrows: ["looks", "talent"],
      perkDesc: "Studio musik kedap suara, instrumen musik andalan, ampli portabel, pick gitar jimat keberuntungan, dan basis penggemar.",
      subclasses: [
        { id: "lead_guitar",  name: "Lead Guitarist / Soloist", desc: "Ahli solo gitar. Serangan Sonic berbasis Talent mendapat +1d6 damage dan bisa mempengaruhi area lebih luas." },
        { id: "vocalist",     name: "Vokalis Utama Karismatik",  desc: "Ahli memikat hati penonton. Semua Social Moves dari vokalis memberikan Disadvantage pada Mental Saves target." }
      ],
      clubMoves: [
        { name: "Petikan Melodi Penyelamat (Bardic Rock Riff)", type: "Buff Move", cost: "1 Bonus Action", range: "30 ft", check: "Talent / Performance", effect: "Memberikan 1d6 Inspiration Die ke teman. Dadu ini dapat ditambahkan ke d20 roll berikutnya dalam 10 menit.", desc: "Memetik melodi gitar akustik atau bersenandung nada penyemangat yang membakar antusiasme teman." },
        { name: "Distorsi Pemecah Telinga (Sonic Screech)", type: "Attack / Social Move", cost: "1 Action", range: "15 ft Cone", check: "Physique Save DC 8+Prof+Mod Talent", effect: "1d8 Thunder/Mental Damage ke Composure & HP fisik. Target gagal: Deafened 1 turn.", desc: "Mendekatkan mikrofon ke speaker monitor hingga dengkingan feedback memekakkan telinga." },
        { name: "Penampilan Epik (Crowd Performance)", type: "Social Move", cost: "1 Menit", range: "Area (semua yang mendengar)", check: "Talent / Performance vs Target Mind Save", effect: "Seluruh target yang mendengar kehilangan 1d4 Composure (terpukau) atau memulihkan 1d4 Composure (terinspirasi) — DM pilih efek berdasarkan konteks.", desc: "Membawakan satu lagu atau penampilan musik pendek yang mempengaruhi emosi semua orang yang hadir." }
      ]
    },
    {
      id: "painting", name: "Painting (Klub Seni Rupa & Desain)", tagline: "Goresan Kuas, Memori Visual Tajam & Estetika Warna",
      hitDie: "d6", primaryStat: "Talent / Intelligent", savingThrows: ["intelligent", "talent"],
      perkDesc: "Ruang seni penuh aroma cat minyak, kuas dan kanvas, celemek berlumur cat artistik, dan mata yang peka warna emosi.",
      subclasses: [
        { id: "portrait",  name: "Pelukis Potret Realis",         desc: "Ahli memvisualisasikan seseorang dari ingatan. Advantage pada check yang membutuhkan deskripsi rupa atau pengenalan wajah." },
        { id: "designer",  name: "Ilustrator Manga & Desain",     desc: "Ahli visual komunikasi. Bisa menciptakan publikasi, flyer, atau karikatur yang memberikan 1d6 bonus Influence di lingkungan sekolah." }
      ],
      clubMoves: [
        { name: "Sketsa Wajah Kilat (Photographic Sketch)", type: "Utility Move", cost: "1 Menit", range: "Touch", check: "Talent / Creative", effect: "Menghasilkan potret visual presisi dari seseorang atau barang bukti yang hanya sempat dilihat sekilas.", desc: "Menggoreskan pensil 2B di buku sketsa dengan kecepatan tangan mengagumkan." },
        { name: "Cipratan Cat Distraksi (Paint Splatter Blind)", type: "Attack / Utility Move", cost: "1 Action", range: "10 ft", check: "Physique / Agility", effect: "Target Blinded selama 1 giliran hingga menyeka cat dari mata mereka.", desc: "Menyiramkan palet cat minyak basah tepat ke arah wajah lawan." },
        { name: "Karya Provokasi (Satirical Artwork)", type: "Social Move", cost: "1 Jam (luar sesi)", range: "Area Sekolah", check: "Talent / Creative vs Target Looks Save", effect: "Karya visual yang menyindir target memicu gosip. Target kehilangan 1d4 Composure setiap kali ada murid lain melihat karya tersebut selama 1 hari.", desc: "Membuat karikatur atau poster satire yang dipasang diam-diam di papan pengumuman sekolah." }
      ]
    }
  ],

  // 8 Archetypes (Species) — 3 Archetype Moves each (total 24)
  archetypes: [
    {
      id: "delinquent", name: "Delinquent (Berandalan / Yanki)", tagline: "Seragam Dasi Longgar, Tatapan Tajam & Hati Emas Tersembunyi",
      statBonus: { physique: 2, looks: 1 },
      perks: [
        { name: "Aura Mengancam", desc: "Advantage pada check Intelligent (Street) saat berhadapan dengan geng lain atau preman." },
        { name: "Kulit Tebal Berantem", desc: "+2 Physical HP maksimal di setiap kenaikan level." }
      ],
      archetypeMoves: [
        { name: "Tatapan Intimidasi (Killer Glare)", type: "Social Attack", cost: "1 Action", range: "15 ft", check: "Looks / Aura vs Target Mind Save", effect: "Target kehilangan 1d6 Composure dan Disadvantage pada serangan pertama mereka di ronde ini.", desc: "Memandang tajam dengan tatapan dingin tanpa kedip yang membuat nyali lawan ciut seketika." },
        { name: "Gertakan Berandalan (Street Threat)", type: "Social Move", cost: "Bonus Action", range: "30 ft", check: "Physique / Power vs Target Mind Save", effect: "Target harus Wisdom Save atau tidak berani mendekat dalam jarak 10 ft selama 1 giliran.", desc: "Mengepalkan tangan dan berdiri tegak dengan ekspresi sangar yang tak terbantahkan." },
        { name: "Backing Geng (Street Crew)", type: "Utility Move", cost: "1x per Long Rest", range: "Self", check: "Intelligent / Street", effect: "Memanggil bantuan 1–2 NPC pendukung netral untuk membantu situasi konflik atau mencari info jalanan.", desc: "Menghubungi kenalan geng lama via SMS untuk meminta backup atau bantuan jalanan." }
      ]
    },
    {
      id: "jock", name: "Jock / Sporty", tagline: "Bugar, Berenergi Tinggi, Semangat Pantang Menyerah",
      statBonus: { physique: 2, talent: 1 },
      perks: [
        { name: "Semangat Juang", desc: "Saat Physical HP di bawah setengah, bonus +1 pada semua Attack roll." },
        { name: "Kaki Kijang", desc: "Kecepatan mobilitas dasar bertambah 5 ft (menjadi 35 ft)." }
      ],
      archetypeMoves: [
        { name: "Lompatan Adrenalin (Adrenaline Rush)", type: "Bonus Action", cost: "Bonus Action (1x per Short Rest)", range: "Self", check: "Otomatis", effect: "Pulihkan 1d8 Physical HP secara instan. Berlaku saat Physical HP di bawah setengah maksimal.", desc: "Memompa semangat juang dari dalam dada saat melihat temannya dalam bahaya." },
        { name: "Gaya Olahraga Memikat (Sporty Charisma)", type: "Social Move", cost: "Pasif (Setelah olahraga)", range: "30 ft", check: "Looks / Influence", effect: "Setelah melakukan aksi fisik, seluruh orang yang melihat memberikan reaksi positif. Advantage pada Looks checks selama 10 menit berikutnya.", desc: "Keringat bercucuran, napas terengah, dan tatapan bersinar — kombinasi yang tidak ada yang bisa tahan." },
        { name: "Teriakan Bakar Semangat (Hype Shout)", type: "Buff Move", cost: "1 Action (1x per Long Rest)", range: "30 ft (Seluruh Tim)", check: "Physique / Stamina", effect: "Seluruh sekutu dalam jangkauan mendapat Advantage pada Physical Saving Throw dan Attack selama 2 giliran.", desc: "Berteriak lantang menyemangati seluruh tim dengan teriakan penuh energi layaknya kapten olahraga." }
      ]
    },
    {
      id: "nerd", name: "Nerd (Murid Ambis / Kutu Buku)", tagline: "Kacamata Frame Tebal, Catatan Lengkap & Tahu Segalanya",
      statBonus: { intelligent: 2, mind: 1 },
      perks: [
        { name: "Pustaka Berjalan", desc: "Advantage pada semua check Intelligent (Academic) terkait mata pelajaran sekolah." },
        { name: "Persiapan Matang", desc: "Tambahkan Modifier Intelligent saat menghitung Inisiatif." }
      ],
      archetypeMoves: [
        { name: "Analisis Cepat (Quick Analysis)", type: "Bonus Action", cost: "Bonus Action", range: "Self / 30 ft", check: "Intelligent / Academic", effect: "Mengidentifikasi kelemahan mekanik atau pola perilaku target. Serangan berikutmu ke target mendapat Advantage.", desc: "Mengamati situasi dalam hitungan detik dan langsung menghitung kemungkinan terbaik untuk bertindak." },
        { name: "Presentasi Fakta (Fact Check)", type: "Social Attack", cost: "1 Action", range: "20 ft", check: "Intelligent / People vs Target Intelligent Save", effect: "Target kehilangan 1d6 Composure karena argumennya terbantahkan dengan data dan fakta akurat.", desc: "Mengutarakan fakta dan data yang membantah pernyataan lawan secara sistematis dan akurat." },
        { name: "Memori Fotografis (Eidetic Memory)", type: "Utility Move", cost: "Pasif", range: "Self", check: "Otomatis", effect: "Bisa mengingat dan mereproduksi secara akurat apapun yang pernah dibaca atau dilihat dalam 24 jam terakhir tanpa roll check.", desc: "Memori luar biasa yang memungkinkan memanggil kembali informasi apapun kapan saja dibutuhkan." }
      ]
    },
    {
      id: "class_clown", name: "Class Clown (Pelawak Kelas)", tagline: "Tukang Rusuh Positif, Pemecah Kecanggungan & Bikin Ngakak",
      statBonus: { talent: 2, looks: 1 },
      perks: [
        { name: "Peredam Ketegangan", desc: "Reaksi: pulihkan 1d4 Composure teman yang sedang salting." },
        { name: "Lolos Karena Lucu", desc: "Sekali per hari, jika tertangkap melanggar aturan, bisa membuat lelucon agar dimaafkan guru." }
      ],
      archetypeMoves: [
        { name: "Lelucon Pengalih Perhatian (Distraction Prank)", type: "Utility Move", cost: "Bonus Action", range: "30 ft", check: "Talent / Performance vs Target Mind Save", effect: "1 target Distracted (Disadvantage pada check Perception) selama 1 giliran. Sekutu mendapat Advantage untuk beraksi di dekat target.", desc: "Melempar lelucon atau melakukan aksi konyol yang memaksa semua perhatian tertuju ke sana." },
        { name: "Humor Penstabil (Tension Breaker)", type: "Heal Move", cost: "1 Action (1x per Short Rest)", range: "30 ft", check: "Talent / Adaptability", effect: "Memulihkan 1d6 Composure ke seluruh sekutu dalam jangkauan yang sedang stress.", desc: "Melempar candaan tepat waktu saat suasana paling tegang untuk memecah atmosfer yang membeku." },
        { name: "Peniruan Sempurna (Perfect Impression)", type: "Social Move", cost: "1 Action", range: "15 ft", check: "Talent / Performance vs Target Mind Save", effect: "Menirukan gaya bicara atau behavior orang tertentu dengan sempurna. Target kehilangan 1d4 Composure karena malu atau marah.", desc: "Menirukan cara berbicara dan bergerak seseorang dengan presisi komedi yang menyentil ego target." }
      ]
    },
    {
      id: "emo", name: "Emo / Serius", tagline: "Duduk di Sudut Jendela, Headphone Terpasang & Tatapan Dingin",
      statBonus: { mind: 2, intelligent: 1 },
      perks: [
        { name: "Dinding Emosi Baja", desc: "Advantage pada Saving Throw Mind terhadap serangan verbal atau godaan gombalan." },
        { name: "Peka Sandiwara", desc: "+2 bonus pada Passive Insight untuk mendeteksi senyuman palsu." }
      ],
      archetypeMoves: [
        { name: "Keheningan Menghantui (Eerie Silence)", type: "Social Attack", cost: "1 Action", range: "15 ft", check: "Mind / Emotional vs Target Mind Save", effect: "Target kehilangan 1d6 Composure karena tidak nyaman dengan sikap acuhmu yang dingin dan tidak terduga.", desc: "Diam total. Tidak berkata apapun. Tidak bereaksi apapun. Dan itu justru jauh lebih mengancam dari kata-kata manapun." },
        { name: "Introspeksi Diam (Silent Contemplation)", type: "Utility Move", cost: "10 Menit istirahat", range: "Self", check: "Mind / Emotional", effect: "Memulihkan 1d8 Composure dan mendapat Advantage pada Mind Saving Throws selama 1 jam berikutnya.", desc: "Duduk di sudut jendela dengan headphone, menutup diri sejenak dari dunia untuk meregenerasi ketenangan batin." },
        { name: "Kata Tajam Terakhir (Cutting Remark)", type: "Social Attack", cost: "Reaction", range: "15 ft", check: "Intelligent / People vs Target Mind Save", effect: "Sebagai reaksi terhadap serangan sosial yang diterima: balikkan 1d4 Composure damage ke penyerang.", desc: "Satu kalimat singkat, dingin, dan tepat sasaran yang merongrong kepercayaan diri lawan lebih efektif dari pidato panjang." }
      ]
    },
    {
      id: "weeb", name: "Weeb (Pecinta Anime / Manga / Pop Culture)", tagline: "Chuunibyou Nyata, Gantungan Tas Penuh Pin & Imajiner Liar",
      statBonus: { talent: 1, luck: 2 },
      perks: [
        { name: "Daya Khayal Tanpa Batas", desc: "Bisa menggunakan stat Talent untuk check yang biasanya memerlukan Physique saat berpose dramatis." },
        { name: "Plot Armor Asmara", desc: "Sekali per sesi, jika Composure mencapai 0, bisa bertahan di 1 Composure lewat monolog batin." }
      ],
      archetypeMoves: [
        { name: "Teknik Rahasia Chuunibyou (Secret Technique)", type: "Attack Move", cost: "1 Action", range: "15 ft", check: "Talent / Performance vs Target Mind Save", effect: "1d8 Composure damage. Jika kamu berpose dramatis sambil menyebutkan nama teknik, damage meningkat jadi 1d10.", desc: "Memostur dramatis dan berteriak nama teknik rahasia imajinatif yang anehnya bekerja karena keyakinan kuat." },
        { name: "Referensi Tersembunyi (Hidden Reference)", type: "Utility Move", cost: "Bonus Action", range: "Self", check: "Talent / Creative", effect: "Mendapat Advantage pada 1 check sosial atau kreatif berikutnya dengan mengaitkannya ke referensi anime/manga yang relevan.", desc: "Mengutip dialog atau strategi dari anime favorit yang ternyata benar-benar berlaku di situasi nyata ini." },
        { name: "Keberuntungan Flag Asmara (Lucky Romance Flag)", type: "Utility Move", cost: "1x per Long Rest", range: "Self", check: "Luck / Relationship Luck", effect: "Reroll satu d20 roll apapun dengan mengambil hasil yang lebih tinggi. Berlaku untuk check asmara atau sosial.", desc: "Saat yakin bahwa 'ini pasti flag romance!', keberuntungan anime benar-benar berpihak padamu." }
      ]
    },
    {
      id: "popular_kids", name: "Popular Kids (Idola Sekolah / Trendsetter)", tagline: "Senyum Menawan, Pakaian Modis & Selalu Jadi Pusat Perhatian",
      statBonus: { looks: 2, mind: 1 },
      perks: [
        { name: "Efek Halo Karismatik", desc: "Orang asing selalu berprasangka baik kepadamu saat pertama kali bertemu." },
        { name: "Jaringan Koneksi", desc: "Bisa meminta bantuan kecil ke hampir semua murid di sekolah tanpa check." }
      ],
      archetypeMoves: [
        { name: "Senyum Menawan (Charming Smile)", type: "Social Attack", cost: "1 Action", range: "10 ft", check: "Looks / Charm vs Target Mind Save", effect: "1d6 Composure damage. Target Distracted (Disadvantage pada aksi berikutnya) karena tidak bisa fokus saat melihatmu.", desc: "Senyum manis yang memancarkan pesona alami, cukup untuk melumpuhkan konsentrasi siapa saja." },
        { name: "Pengaruh Sosial Media (Trendsetter Post)", type: "Utility Move", cost: "1x per Long Rest", range: "Area Sekolah", check: "Looks / Influence", effect: "Mempengaruhi opini umum sekolah soal satu topik/target. Target dipandang positif atau negatif oleh mayoritas murid selama 1 hari.", desc: "Memposting konten strategis di media sosial sekolah yang langsung mempengaruhi pandangan publik." },
        { name: "Koneksi VIP (Name-Drop)", type: "Social Utility", cost: "Reaction", range: "30 ft", check: "Looks / Influence", effect: "Batalkan satu tindakan negatif yang diarahkan kepadamu atau temanmu dengan menyebut nama orang berpengaruh di sekolah.", desc: "Menyebut nama guru favorit, ketua OSIS, atau orang tua berpengaruh yang langsung membuat situasi berbalik." }
      ]
    },
    {
      id: "normies", name: "Normies (Murid Biasa / Kalem)", tagline: "Tidak Banyak Tingkah, Pengamat Damai & Menghargai Hal Simpel",
      statBonus: { physique: 1, intelligent: 1, looks: 1, mind: 1, talent: 1, luck: 1 },
      perks: [
        { name: "Kamuflase Kerumunan", desc: "Sangat mudah membaur di keramaian koridor sekolah tanpa disadari orang lain." },
        { name: "Keseimbangan Hidup", desc: "Reroll hasil dadu bernilai '1' pada Saving Throw sekali per hari." }
      ],
      archetypeMoves: [
        { name: "Membaur Sempurna (Blend In)", type: "Utility Move", cost: "Bonus Action", range: "Self", check: "Mind / Awareness", effect: "Menjadi tidak menonjol di kerumunan. Musuh yang mencari kamu harus Passive Perception DC 15 untuk menemukanmu.", desc: "Menyesuaikan gaya berjalan, ekspresi, dan pakaian agar tampak seperti murid biasa yang tak menarik perhatian." },
        { name: "Simpati Universal (Everybody's Friend)", type: "Social Utility", cost: "1 Action", range: "15 ft", check: "Mind / Interpersonal", effect: "Meredakan konflik antara 2 pihak yang berselisih. Kedua pihak harus berunding damai selama minimal 1 giliran.", desc: "Dengan ketulusan dan pendekatan kalem, menjadi jembatan damai yang diterima oleh semua kalangan." },
        { name: "Hoki Murni (Pure Luck)", type: "Utility Move", cost: "1x per Long Rest", range: "Self", check: "Luck / Situation Luck", effect: "Pilih 1 kejadian buruk yang baru saja terjadi dan batalkan (revert) hasilnya — 'kebetulan' semua berjalan baik.", desc: "Kadang keberuntungan bukan soal skill atau rencana — hanya soal timing dan kebetulan yang menyelamatkan segalanya." }
      ]
    }
  ],

  // 6 Social Classes (Backgrounds)
  socialClasses: [
    { id: "rich", name: "Rich (Keluarga Konglomerat / Ningrat)", tagline: "Rumah Mewah Berhalaman Luas & Fasilitas Serba Ada", allowance: "¥5,000 / Rp 500,000 per hari", allowanceAmount: 5000, savings: "¥200,000 / Rp 20,000,000", savingsAmount: 200000, job: "Tidak Bekerja (Dilarang keluarga)", jobWage: 0, perkDesc: "Mobil pribadi siap menjemput, kartu kredit darurat, koneksi orang tua berpengaruh ke kepala sekolah.", equipment: ["Smartphone Flagship Terbaru", "Dompet Kulit Merk Terkenal", "Voucher Kafe Mewah", "Kotak Pensil Impor"] },
    { id: "medium_rich", name: "Medium Rich (Keluarga Menengah Atas / Dokter / Eksekutif)", tagline: "Hunian Nyaman di Kawasan Elit & Uang Jajan Lebih dari Cukup", allowance: "¥2,000 / Rp 200,000 per hari", allowanceAmount: 2000, savings: "¥50,000 / Rp 5,000,000", savingsAmount: 50000, job: "Baito Iseng / Koleksi Hobi", jobWage: 500, perkDesc: "Motor/skuter pribadi, sering mentraktir teman dekat, akses les privat terbaik.", equipment: ["Smartphone Bagus", "Sepatu Branded", "Earphone Wireless Premium", "Tumbler Keren"] },
    { id: "medium", name: "Medium (Keluarga Pegawai Biasa / Rata-rata)", tagline: "Rumah Hangat, Hidup Bersahaja & Bekal Bento Buatan Ibu", allowance: "¥1,000 / Rp 100,000 per hari", allowanceAmount: 1000, savings: "¥15,000 / Rp 1,500,000", savingsAmount: 15000, job: "Pernah Bekerja Paruh Waktu Musiman", jobWage: 0, perkDesc: "Sepeda jengki setia, kartu langganan kereta komuter, bekal makan siang enak buatan rumah.", equipment: ["Smartphone Standar", "Kotak Bento Susun", "Payung Lipat Polos", "Kartu Kereta Komuter"] },
    { id: "medium_poor", name: "Medium Poor (Keluarga Pas-pasan / Berhemat)", tagline: "Harus Pandai Memutar Uang Saku & Paham Nilai Perjuangan", allowance: "¥500 / Rp 50,000 per hari", allowanceAmount: 500, savings: "¥5,000 / Rp 500,000", savingsAmount: 5000, job: "Kasir Minimarket / Fotokopi (2x seminggu)", jobWage: 300, perkDesc: "Tahu toko diskon termurah di sudut kota, mandiri memasak makanan sendiri, pintar menawar.", equipment: ["Smartphone Layar Retak Sedikit", "Botol Air Minum Isi Ulang", "Roti Diskon Minimarket", "Buku Catatan Murah"] },
    { id: "poor", name: "Poor (Keluarga Kurang Mampu / Pejuang Hidup)", tagline: "Kerja Keras Banting Tulang Sehabis Sekolah Demi Masa Depan", allowance: "¥200 / Rp 20,000 per hari", allowanceAmount: 200, savings: "¥1,000 / Rp 100,000 (Di celengan)", savingsAmount: 1000, job: "Baito Harian (Antar koran subuh / cuci piring)", jobWage: 200, perkDesc: "Stamina fisik luar biasa karena terbiasa kerja keras, tidak gengsian, sangat menghargai teman tulus.", equipment: ["Sepatu Kets Usang", "Koran Bekas Pelindung Hujan", "Nasi Kepal (Onigiri) Garam", "Handuk Kecil Leher"] },
    { id: "orphanage", name: "Orphanage (Anak Asuh Panti / Hidup Mandiri)", tagline: "Tumbuh Tanpa Orang Tua, Menemukan Keluarga di Sahabat", allowance: "¥300 / Rp 30,000 per hari", allowanceAmount: 300, savings: "¥3,000 / Rp 300,000", savingsAmount: 3000, job: "Baito di Toko Kelontong / Bantu Yayasan", jobWage: 250, perkDesc: "Kemandirian mutlak, rasa empati tinggi terhadap sesama orang kesepian, insting gotong royong.", equipment: ["Foto Polaroid Lama", "Gantungan Kunci Rajut Buatan Adik Panti", "Tas Selempang Kanvas", "Buku Harian Rahasia"] }
  ],

  // Equipment Packs — 3-layer automatic system
  equipmentPacks: {
    student: [
      "Buku Pelajaran & Buku Tulis Catatan",
      "Kotak Pensil & Penghapus Lengkap",
      "Smartphone & Earphone Kabel",
      "Kartu Pelajar Sekolah",
      "Payung Lipat Jaga-Jaga Hujan"
    ],
    clubs: {
      student_council: ["Kartu Identitas OSIS Resmi", "Buku Agenda & Stempel OSIS", "Walkie-Talkie Kecil Koordinasi"],
      kendo:           ["Shinai Bambu Latihan", "Seragam Kendogi & Hakama", "Botol Minyak Shinai"],
      martial_arts:    ["Pelindung Tangan (Karate Gloves)", "Seragam Karate/Judo Putih", "Perban Pergelangan Tangan"],
      sports:          ["Sepatu Olahraga Khusus", "Botol Minum Sport Besar", "Handuk Microfiber Keringat"],
      drama:           ["Buku Naskah Drama Bercoret-coret", "Kotak Make-up Panggung Mini", "Kunci Ruang Kostum"],
      kir_osn:         ["Kacamata Pelindung Lab", "Buku Catatan Eksperimen", "Set Tabung Reaksi Kecil"],
      pramuka_paskin:  ["Tali Pramuka 10 Meter", "Peluit Komando", "Kompas & Peta Sederhana"],
      pecinta_alam:    ["Ransel Gunung Kecil", "Senter Kepala LED", "Korek Api Tahan Angin"],
      penyiaran:       ["Earphone Monitor Profesional", "Blocknote Reporter", "Kartu Pers / ID Media Sekolah"],
      literatur:       ["Buku Catatan Puisi Pribadi", "Pena Fountain Kesayangan", "Bookmark Kain Bordir Cantik"],
      band:            ["Pick Gitar Jimat Keberuntungan", "Kabel Audio Pendek", "Pelindung Telinga (Ear Plugs)"],
      painting:        ["Set Kuas Cat Minyak Mini", "Buku Sketsa A5", "Celemek Berlumur Cat Seni"]
    },
    archetypes: {
      delinquent:    ["Plester Luka Banyak", "Jaket Bomber Modifikasi Keren", "Permen Karet Mint"],
      jock:          ["Protein Bar / Suplemen Energi", "Pelindung Lutut Tipis", "Topi Olahraga Branded"],
      nerd:          ["Kalkulator Saintifik Canggih", "Kain Lap Kacamata Microfiber", "Stabilo Warna-warni Lengkap"],
      class_clown:   ["Sticky Note Lucu-Lucu", "Koin Sulap Palsu", "Buku Lelucon Kecil Tersembunyi"],
      emo:           ["Earphone Noise-Cancelling", "Buku Harian Terkunci", "Gelang Karet Hitam Beberapa"],
      weeb:          ["Gantungan Tas Pin Anime Banyak", "Keychain Karakter Favorit", "Buku Manga Kecil"],
      popular_kids:  ["Lipbalm / Lip Tint Mewah", "Cermin Kompak Branded", "Kartu Nama Murid (Custom)"],
      normies:       ["Bento Box Standar", "Botol Minum Polos", "Pensil Cadangan (Banyak)"]
    }
  },

  // Basic Actions (generalized, not overly specific)
  basicActions: [
    {
      name: "Pukulan Fisik (Unarmed Strike)", category: "basic_combat", type: "Action (Physical)",
      range: "Melee (5 ft)", check: "Physique / Power", damage: "1 + Mod Physique (Physical Bludgeoning)",
      desc: "Tinju mentah atau tamparan spontan saat adu fisik jarak dekat."
    },
    {
      name: "Tendangan Cepat (Snap Kick)", category: "basic_combat", type: "Action (Physical)",
      range: "Melee (5 ft)", check: "Physique / Agility", damage: "1d4 + Mod Physique (Physical Bludgeoning)",
      desc: "Tendangan mendadak mengarah ke betis atau paha lawan."
    },
    {
      name: "Dorongan Kuat (Shove)", category: "basic_combat", type: "Action (Physical)",
      range: "Melee (5 ft)", check: "Physique / Power vs Target Physique Save", damage: "Target terdorong 5 ft & mungkin terjatuh Prone",
      desc: "Mendorong lawan dengan kedua tangan penuh tenaga agar kehilangan keseimbangan."
    },
    {
      name: "Tangkis & Bertahan (Dodge & Guard)", category: "basic_combat", type: "Action (Defense)",
      range: "Self", check: "Otomatis", damage: "+2 Physical & Social AC sampai giliran berikutnya",
      desc: "Memasang kuda-kuda rapat dan fokus memperhatikan gerak-gerik lawan."
    },
    {
      name: "Kabur & Menghindar (Disengage)", category: "basic_combat", type: "Action (Movement)",
      range: "Self", check: "Physique / Agility", damage: "Tidak memicu Opportunity Attack saat bergerak menjauhi lawan",
      desc: "Mundur dengan langkah cerdas memanfaatkan celah gerak lawan."
    },
    {
      name: "Tatapan Intimidasi (Intimidating Stare)", category: "basic_social", type: "Action (Social Attack)",
      range: "15 ft (Pandangan)", check: "Looks / Aura vs Target Mind Save", damage: "1d4 + Mod Mind (Composure Damage)",
      effect: "Target ragu bertindak (Disadvantage aksi berikutnya).",
      desc: "Menatap dengan ekspresi dingin dan intensitas yang membuat target tidak nyaman."
    },
    {
      name: "Senyuman Persuasi (Charming Smile)", category: "basic_social", type: "Action (Social Attack)",
      range: "10 ft", check: "Looks / Charm vs Target Mind Save", damage: "1d6 + Mod Looks (Composure Damage)",
      effect: "Target tertegun sejenak; Disadvantage pada save berikutnya.",
      desc: "Memberikan senyuman tulus yang membuat degup jantung target berdebar kencang."
    },
    {
      name: "Sindiran / Provokasi (Taunt)", category: "basic_social", type: "Action (Social Attack)",
      range: "20 ft", check: "Intelligent / People vs Target Mind Save", damage: "1d4 (Composure Damage)",
      effect: "Target terprovokasi: wajib fokus menyerangmu pada gilirannya.",
      desc: "Melontarkan kata-kata tajam yang tepat sasaran untuk memancing reaksi emosional target."
    },
    {
      name: "Rayuan Halus (Subtle Flirt)", category: "basic_social", type: "Action (Social Utility)",
      range: "10 ft", check: "Looks / Charm vs Target Mind Save", damage: "—",
      effect: "Jika berhasil, target memberikan Advantage pada percakapan sosial berikutnya denganmu.",
      desc: "Mengirimkan sinyal halus lewat tatapan atau gestur kecil yang membuka pintu percakapan."
    },
    {
      name: "Bantuan & Dukungan (Help / Support)", category: "basic_social", type: "Action (Social Utility)",
      range: "5 ft", check: "Mind / Interpersonal", damage: "—",
      effect: "Memberikan Advantage kepada 1 sekutu pada roll check atau serangan berikutnya.",
      desc: "Membantu, mendukung, atau memberikan ide kepada teman yang sedang berusaha melakukan sesuatu."
    }
  ],

  // School Events (with checkbox tracking support)
  calendarEvents: [
    { id: "cal_01", name: "Upacara Masuk & Pembagian Kelas Baru", term: "Semester 1 (Musim Semi)", desc: "Momen berkenalan dengan teman sebangku dan melihat siapa yang satu kelas denganmu." },
    { id: "cal_02", name: "Ujian Tengah Semester (UTS / Midterms)", term: "Semester 1", desc: "Pertaruhan nilai akademis, begadang kelompok belajar di perpustakaan." },
    { id: "cal_03", name: "Festival Olahraga (Undoukai)", term: "Semester 1", desc: "Lari estafet, tarik tambang, dan kesempatan menyemangati gebetan dari pinggir lapangan." },
    { id: "cal_04", name: "Liburan Musim Panas & Festival Kembang Api", term: "Liburan Semester 1", desc: "Mengenakan pakaian Yukata, janjian nonton kembang api kuil di malam hari." },
    { id: "cal_05", name: "Festival Budaya Sekolah (Bunkasai)", term: "Semester 2 (Musim Gugur)", desc: "Acara puncak tahunan! Rumah hantu, maid cafe kelas, dan konser band panggung sekolah." },
    { id: "cal_06", name: "Study Tour Sekolah (Shuugakuryokou)", term: "Semester 2", desc: "Perjalanan bus menginap ke Kyoto/daerah wisata; curhat rahasia malam hari di kamar hotel." },
    { id: "cal_07", name: "Hari Valentine & White Day", term: "Semester 2 (Musim Dingin)", desc: "Menaruh cokelat honmei (cinta tulus) atau giri (pertemanan) di dalam loker sepatu." },
    { id: "cal_08", name: "Ujian Kenaikan Kelas & Upacara Kelulusan", term: "Akhir Tahun Ajaran", desc: "Pengumuman kelulusan dan momen perpisahan yang penuh air mata kenangan." }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = DD_DATA;
}
