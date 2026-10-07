import { HandbookChapter } from "./types";

export const CHAPTER_4_EKSKUL: HandbookChapter = {
  id: "chapter-4-ekskul",
  number: 4,
  japaneseTitle: "第四章：部活動 (Klub Ekstrakurikuler)",
  title: "Klub Ekstrakurikuler (Ekskul)",
  subtitle: "Hit Dice, Kemahiran Saving Throw, Subclass Peminatan & 36 Jurus Klub",
  summary: "Memilih klub sekolah tempat karaktermu mengasah keterampilan: dari Dewan OSIS yang berwibawa, Kendo pedang bambu, hingga Band beraliran rock.",
  leadParagraph: "Kehidupan SMA di Jepang berputar di sekitar gedung klub (Bukatsu). Klub bukan sekadar pengisi waktu sepulang sekolah, melainkan wadah di mana ikatan persahabatan diuji dan kemampuan fisik serta sosial ditempa. Di Damsel & Desire, Klub Ekstrakurikuler berfungsi layaknya 'Class' dalam D&D 5e — menentukan jenis Hit Dice untuk HP, kemampuan pertahanan Saving Throw, dua jalur Subclass, serta tiga Jurus Klub (Club Moves) spesifik.",
  sections: [
    {
      id: "club-basics",
      title: "Anatomi Klub Ekstrakurikuler",
      leadParagraph: "Setiap klub memiliki profil mekanik standar yang membentuk gaya bermain karakter.",
      contentHtml: `<p>Saat memilih klub pada Langkah 4 pembuatan karakter, kamu mendapatkan komponen berikut:</p>
      <ul>
        <li><strong>Hit Die:</strong> Dadu penentu poin ketahanan fisik (d6 untuk klub riset/seni, d8 untuk kepemimpinan/ekspresi, d10 untuk beladiri/olahraga/lapangan).</li>
        <li><strong>Atribut Primer:</strong> Dua atribut utama yang menjadi tumpuan aksi klub.</li>
        <li><strong>Saving Throw Proficiencies:</strong> Dua atribut di mana karaktermu menambahkan Proficiency Bonus saat melempar dadu penyelamatan.</li>
        <li><strong>Subclass (Peminatan):</strong> Jalur spesialisasi yang dipilih di dalam klub untuk memperdalam peran tertentu.</li>
        <li><strong>Jurus Klub (Club Moves):</strong> Tiga jurus unik yang dapat dilancarkan dalam pertempuran, investigasi, maupun interaksi sosial.</li>
      </ul>`,
      tables: [
        {
          caption: "Ringkasan 12 Klub Ekstrakurikuler Seishun Academy",
          headers: ["Klub (Club)", "Hit Die", "Atribut Primer", "Saving Throws", "Fokus Utama"],
          rows: [
            ["OSIS (Student Council)", "d8", "Looks / Intelligent", "INT, LOK", "Otoritas, kepemimpinan & izin sekolah"],
            ["Kendo (Pedang Bambu)", "d10", "Physique / Mind", "PHY, MND", "Serangan Shinai, pertahanan & kiai"],
            ["Martial Arts (Karate/Judo)", "d10", "Physique", "PHY, TLN", "Bantingan matras, kuncian & pukulan kombo"],
            ["Sports (Basket/Sepak Bola)", "d10", "Physique / Looks", "PHY, PHY", "Sprint kilat, lemparan akurat & sorak tim"],
            ["Drama (Teater & Seni Peran)", "d8", "Looks / Talent", "LOK, TLN", "Manipulasi air mata, penyamaran & monolog"],
            ["KIR / OSN (Sains & Riset)", "d6", "Intelligent", "INT, MND", "Analisis kelemahan, bom asap & hacking"],
            ["Pramuka / Paskin", "d10", "Physique / Mind", "PHY, MND", "Tali temali, aba-aba komando & navigasi"],
            ["Pecinta Alam (Mapala)", "d10", "Physique / Mind", "PHY, MND", "Survival luar ruangan, P3K & panjat dinding"],
            ["Penyiaran (Radio Sekolah)", "d6", "Looks / Intelligent", "INT, LOK", "Pengumuman speaker, suara ASMR & scoop gosip"],
            ["Literatur (Klub Sastra)", "d6", "Intelligent / Mind", "INT, MND", "Surat cinta mematikan, empati & kutipan tajam"],
            ["Band Musik (Rock / Pop)", "d8", "Looks / Talent", "LOK, TLN", "Bardic riff, teriakan sonik & konser panggung"],
            ["Painting (Seni Rupa)", "d6", "Talent / Intelligent", "INT, TLN", "Sketsa kilat, cipratan cat & karya sindiran"]
          ]
        }
      ]
    },
    {
      id: "club-student-council",
      title: "1. Student Council (OSIS)",
      subtitle: "Elit Organisasi & Penegak Ketertiban Sekolah",
      leadParagraph: "Ruang OSIS ber-AC dingin, berkas proposal berserakan rapi di meja jati, dan tatapan tajam yang membuat murid nakal merapikan dasi.",
      contentHtml: `<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Looks / Intelligent • <strong>Saving Throws:</strong> Intelligent, Looks.<br>
      <strong>Hak Istimewa:</strong> Akses penuh ke ruang OSIS, wewenang menegur pelanggaran murid lain, anggaran proposal kegiatan sekolah, dan disegani dewan guru.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Ketua / Presidium:</strong> Pemimpin mutlak organisasi. Mendapatkan bonus +2 pada seluruh Looks checks saat berhadapan dengan guru atau pihak eksternal.</li>
        <li><strong>Divisi Kedisiplinan:</strong> Penegak aturan sekolah berwajah dingin. Advantage pada check Intimidasi dan check mendeteksi pelanggaran murid lain.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Perintah Kedisiplinan (Disciplinary Order)",
          subtitle: "Social Move",
          metaBadge: "1 Action • Jarak 30 ft",
          description: "Menegur target dengan suara tegas berwibawa khas pengurus OSIS.",
          details: {
            "Check": "Looks / Influence",
            "Efek": "Target harus Mind Save (DC 8 + Prof + Mod Looks). Jika gagal: Stunned 1 giliran dan kehilangan 1d6 Composure."
          }
        },
        {
          title: "Koneksi Pihak Sekolah (Faculty Pass)",
          subtitle: "Reaction / Utility",
          metaBadge: "1x per Short Rest • Jarak Self / Touch",
          description: "Menunjukkan kartu identitas OSIS resmi atau surat mandat bertanda tangan kepala sekolah.",
          details: {
            "Check": "Otomatis",
            "Efek": "Membatalkan konsekuensi teguran guru, razia loker, atau hukuman piket untuk dirimu dan 1 teman."
          }
        },
        {
          title: "Proposal Darurat (Emergency Budget)",
          subtitle: "Utility Move",
          metaBadge: "10 Menit Persiapan • Jarak Self",
          description: "Menyusun lembar disposisi anggaran kilat dengan cap stempel resmi OSIS.",
          details: {
            "Check": "Intelligent / Academic",
            "Efek": "Mendapatkan 1 item kebutuhan mendesak (tiket, pass ruangan, alat sekolah) tanpa biaya selama sesi berlangsung."
          }
        }
      ]
    },
    {
      id: "club-kendo",
      title: "2. Kendo (Pedang Bambu)",
      subtitle: "Disiplin Pedang Samurai & Konsentrasi Batin",
      leadParagraph: "Hentakan kaki di lantai kayu dojo, kilatan bilah bambu Shinai di udara, dan suara teriakan Kiai yang memecah keheningan sore.",
      contentHtml: `<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Mind • <strong>Saving Throws:</strong> Physique, Mind.<br>
      <strong>Hak Istimewa:</strong> Penguasaan senjata latihan Shinai dan Bokken, postur kuda-kuda kokoh, dan fokus mata yang tak goyah oleh gertakan.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Gaya Serangan Kilat (Men-Striker):</strong> Spesialisasi serangan cepat. Bonus aksi serangan ekstra setelah serangan sukses pertama dalam ronde.</li>
        <li><strong>Gaya Pertahanan Keras (Iron Wall):</strong> Spesialisasi tangkisan kokoh. +1 Physical AC permanen dan Advantage pada Physique Saving Throw.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Tebasan Shinai: Men! (Head Slash)",
          subtitle: "Attack Move",
          metaBadge: "1 Action • Melee (5 ft)",
          description: "Pukulan vertikal terarah ke arah kepala lawan dengan hentakan langkah kaki dan kiai menggelegar.",
          details: {
            "Check": "Physique / Power",
            "Efek": "1d8 + Mod Physique Bludgeoning Damage. Jika mengenai kepala: target Physique Save atau Disadvantage pada serangan berikutnya."
          }
        },
        {
          title: "Tangkisan Sempurna (Kendo Parry)",
          subtitle: "Reaction Defense",
          metaBadge: "Reaction • Jarak Self",
          description: "Mengayunkan pedang bambu membentuk sudut miring presisi untuk membelokkan serangan lawan.",
          details: {
            "Check": "Otomatis",
            "Efek": "Menambah +2 Physical AC secara instan terhadap 1 serangan fisik jarak dekat yang terlihat."
          }
        },
        {
          title: "Kiai: Teriakan Semangat (Kiai Shout)",
          subtitle: "Bonus Action Buff",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Melepas teriakan kiai penuh konsentrasi batin yang membakar semangat tempur.",
          details: {
            "Check": "Mind / Emotional",
            "Efek": "Dirimu dan 1 sekutu mendapat Advantage pada serangan fisik berikutnya di ronde ini."
          }
        }
      ]
    },
    {
      id: "club-martial-arts",
      title: "3. Martial Arts (Beladiri / Karate / Judo)",
      subtitle: "Pertarungan Jarak Dekat & Refleks Bantingan",
      leadParagraph: "Telapak tangan berkapalan, seragam gi putih bersih, dan insting menepis pukulan sebelum mendarat di wajah.",
      contentHtml: `<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique • <strong>Saving Throws:</strong> Physique, Talent.<br>
      <strong>Hak Istimewa:</strong> Pukulan dan tendangan tanpa senjata berdaya rusak tinggi (1d6), kelenturan tubuh untuk meloloskan diri, dan daya tahan benturan.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Spesialis Bantingan (Judo / Grappler):</strong> Ahli merebut kerah dan membanting lawan. Bantingan memberikan bonus +2d4 damage tambahan.</li>
        <li><strong>Spesialis Serangan Beruntun (Striker):</strong> Ahli kombinasi pukulan kilat. Bisa melakukan serangan tambahan sebagai Bonus Action setiap giliran.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Bantingan Matras (Seoi-Nage Takedown)",
          subtitle: "Attack Move",
          metaBadge: "1 Action • Melee (5 ft)",
          description: "Menarik kerah atau lengan lawan, memutar pinggul, dan membantingnya keras ke lantai.",
          details: {
            "Check": "Physique / Power vs Target Physique Save",
            "Efek": "1d6 + Mod Physique Bludgeoning Damage. Target terjatuh dalam kondisi Prone (terkapar di lantai)."
          }
        },
        {
          title: "Pukulan Cepat Kombo (Rapid Flurry)",
          subtitle: "Bonus Action Attack",
          metaBadge: "Bonus Action • Melee (5 ft)",
          description: "Kombinasi pukulan cepat tanpa jeda yang menyasar ulu hati lawan.",
          details: {
            "Check": "Physique / Agility",
            "Efek": "Memberikan 1d4 + Mod Physique Physical Damage tambahan segera setelah serangan utama mendarat."
          }
        },
        {
          title: "Kunci Sendi (Joint Lock)",
          subtitle: "Control Move",
          metaBadge: "1 Action • Melee (5 ft)",
          description: "Memutar pergelangan atau siku lawan ke sudut anatomis yang menyakitkan.",
          details: {
            "Check": "Physique / Agility vs Target Physique Save",
            "Efek": "Target menderita kondisi Restrained selama 1 giliran (tidak bisa bergerak atau menyerang kecuali lolos DC 12)."
          }
        }
      ]
    },
    {
      id: "club-sports",
      title: "4. Sports (Sepak Bola / Basket / Atletik)",
      subtitle: "Stamina Baja & Kecepatan Lapangan Terbuka",
      leadParagraph: "Derit sol sepatu di lapangan parket, operan bola presisi, dan fisik bugar yang selalu siap mengejar kereta terakhir.",
      contentHtml: `<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Looks • <strong>Saving Throws:</strong> Physique (Ganda).<br>
      <strong>Hak Istimewa:</strong> Kecepatan mobilitas ekstra (+10 ft per giliran), stamina tahan lelah, dan karisma sportif yang memikat supporter.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Ace Lapangan (Striker):</strong> Bintang penyerang utama. Bonus +1d4 damage saat menyerang setelah berlari minimal 15 ft.</li>
        <li><strong>Kapten Regu (Team Captain):</strong> Pemimpin moral tim. Sekali per istirahat, berikan dadu 1d6 Inspiration Die ke kawan tim.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Terobosan Kilat (Fast Break Sprint)",
          subtitle: "Bonus Action Movement",
          metaBadge: "Bonus Action • Jarak Self",
          description: "Manuver lari cepat zig-zag menembus kerumunan seperti melakukan terobosan bebas ke ring lawan.",
          details: {
            "Check": "Otomatis",
            "Efek": "Menggandakan jarak gerak (Dash) dan kebal terhadap Opportunity Attack saat melintasi lawan di ronde ini."
          }
        },
        {
          title: "Lemparan Bola Akurat (Precision Throw)",
          subtitle: "Ranged Attack Move",
          metaBadge: "1 Action • Ranged (40 ft)",
          description: "Melempar bola basket, bola voli, atau benda bulat lainnya dengan parabola presisi tinggi.",
          details: {
            "Check": "Physique / Agility",
            "Efek": "1d6 + Mod Physique Bludgeoning Damage. Target terhuyung atau terkejut jika lemparan mendarat telak di kepala."
          }
        },
        {
          title: "Sorak Penyemangat (Rally Cheer)",
          subtitle: "Buff Move",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Meneriakkan yel-yel penuh kobaran api semangat ke arah kawan yang sedang tertekan.",
          details: {
            "Check": "Looks / Influence",
            "Efek": "Satu kawan memulihkan 1d4 Physical HP dan mendapat Advantage pada satu lemparan dadu fisik berikutnya."
          }
        }
      ]
    },
    {
      id: "club-drama",
      title: "5. Drama Club (Teater & Seni Peran)",
      subtitle: "Manipulasi Emosi, Akting Panggung & Dusta Sempurna",
      leadParagraph: "Lampu sorot panggung, naskah drama penuh intrik, dan kemampuan mengubah ekspresi wajah dalam sepersekian detik.",
      contentHtml: `<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Looks / Talent • <strong>Saving Throws:</strong> Looks, Talent.<br>
      <strong>Hak Istimewa:</strong> Lemari kostum beragam, tetesan air mata buatan instan, peniruan intonasi suara, dan keahlian menyamar.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Aktor Protagonis (Lead Actor):</strong> Bintang panggung pemikat simpati. Serangan sosial berbasis Looks memberikan +1d4 bonus Composure damage.</li>
        <li><strong>Master Tipu Daya (Antagonist):</strong> Ahli muslihat dan peran antagonis. Advantage pada semua check untuk berbohong, menyamar, atau menipu.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Air Mata Buatan (Fake Tears / Manipulation)",
          subtitle: "Social Move",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Meneteskan air mata pura-pura sambil menggigit bibir, membalikkan simpati seluruh kerumunan kepada dirimu.",
          details: {
            "Check": "Talent / Performance vs Target Mind Save",
            "Efek": "Target Disadvantage seluruh serangan terhadapmu dan menderita 1d6 Composure damage karena rasa bersalah."
          }
        },
        {
          title: "Persona Penyamaran (Method Acting)",
          subtitle: "Utility Move",
          metaBadge: "10 Menit Persiapan • Jarak Self",
          description: "Merombak gestur tubuh, cara berjalan, dandanan, dan aksen bicara untuk menyamar sebagai sosok lain.",
          details: {
            "Check": "Talent / Adaptability",
            "Efek": "Advantage pada seluruh check People & Street saat menyamar selama durasi adegan."
          }
        },
        {
          title: "Monolog Dramatis (Grand Speech)",
          subtitle: "Area Social Attack",
          metaBadge: "1 Action • Area 30 ft",
          description: "Berpidato teatrikal penuh penghayatan puitis yang menusuk perasaan siapa saja yang mendengar.",
          details: {
            "Check": "Talent / Performance vs Mind Save",
            "Efek": "Seluruh musuh dalam radius 30 ft kehilangan 1d4 Composure; kawan mendapat Advantage pada Social Saves selama 1 ronde."
          }
        }
      ]
    },
    {
      id: "club-kir-osn",
      title: "6. KIR / OSN (Sains & Riset Ilmiah)",
      subtitle: "Analisis Tajam, Riset Ilmiah & Reaksi Kimia",
      leadParagraph: "Aroma larutan kimia di ruang lab, kilatan layar monitor dengan kode baris pemrogram, dan rumus fisika yang memecahkan teka-teki.",
      contentHtml: `<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Intelligent • <strong>Saving Throws:</strong> Intelligent, Mind.<br>
      <strong>Hak Istimewa:</strong> Akses lemari bahan kimia lab, bank soal olimpiade, mikroskop presisi, dan keahlian bypass keamanan digital.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Peneliti Kimia & Biologi:</strong> Ahli racikan senyawa. Mampu menciptakan bom asap atau cairan pelemas otot sekali per sesi.</li>
        <li><strong>Hacker Komputer & Robotika:</strong> Spesialis digital. Advantage pada check Intelligent untuk membobol sistem data sekolah, CCTV, atau kunci magnetik.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Analisis Titik Lemah (Analytical Deduction)",
          subtitle: "Tactical Combat Move",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Menganalisis keseimbangan biomekanik dan pola tingkah laku lawan lewat perhitungan matematis instan.",
          details: {
            "Check": "Intelligent / Academic",
            "Efek": "Mengetahui 1 stat tertinggi dan 1 kelemahan target; serangan kawan berikutnya ke target mendapat Advantage."
          }
        },
        {
          title: "Asap Reaksi Kimia (Lab Smoke Screen)",
          subtitle: "Crowd Control Move",
          metaBadge: "1 Action • Area 15 ft",
          description: "Mencampurkan larutan kimia saku darurat yang memicu kabut asap tebal menyengat.",
          details: {
            "Check": "Otomatis",
            "Efek": "Menciptakan area asap pekat radius 10 ft selama 2 giliran; seluruh penglihatan di dalamnya terhalang total."
          }
        },
        {
          title: "Formula Konsentrasi (Study Buff)",
          subtitle: "Buff Utility",
          metaBadge: "10 Menit • Jarak Touch",
          description: "Menyusun peta konsep atau rangkuman kilat ilmiah agar daya nalar otak melonjak tajam.",
          details: {
            "Check": "Intelligent / Academic",
            "Efek": "Target mendapat Advantage pada 1 check Intelligent atau Talent berikutnya dalam rentang waktu 1 jam."
          }
        }
      ]
    },
    {
      id: "club-pramuka",
      title: "7. Pramuka / Paskin (Paskibra & Baris Berbaris)",
      subtitle: "Tali Temali, Disiplin Militer & Postur Tegak",
      leadParagraph: "Derit sepatu pantofel di lapangan upacara, simpul jangkar yang tak bisa lepas, dan wibawa komando yang membuat barisan hening seketika.",
      contentHtml: `<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Mind • <strong>Saving Throws:</strong> Physique, Mind.<br>
      <strong>Hak Istimewa:</strong> Tali temali simpul mati, tongkat regu serbaguna, peluit komando, dan daya tahan fisik menghadapi terik lapangan upacara.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Komandan Peleton (Danton):</strong> Pemimpin barisan berwibawa. Advantage saat memimpin manuver kelompok dan +2 bonus Social Saves tim.</li>
        <li><strong>Pionir Lapangan:</strong> Ahli tali temali dan tenda darurat. Tidak pernah tersesat dan mendapat +2 bonus pada Physique Save melawan cuaca buruk.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Kuncian Tali Pramuka (Rope Restrain)",
          subtitle: "Combat Control Move",
          metaBadge: "1 Action • Melee (5 ft)",
          description: "Menggunakan seutas tali pramuka tebal untuk membelenggu pergelangan tangan atau kaki lawan dalam sekejap.",
          details: {
            "Check": "Physique / Agility vs Target Agility",
            "Efek": "Target mengalami kondisi Restrained hingga berhasil meloloskan diri dengan Physique check DC 13."
          }
        },
        {
          title: "Aba-aba Menggelegar (Commanding Drill)",
          subtitle: "Team Buff Move",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Meneriakkan aba-aba militer tegas yang memompa kesiapsiagaan seluruh rekan regu.",
          details: {
            "Check": "Mind / Emotional",
            "Efek": "Seluruh sekutu dalam radius 30 ft mendapat bonus +2 pada lemparan Saving Throw berikutnya."
          }
        },
        {
          title: "Teknik Pengintaian (Scout Surveillance)",
          subtitle: "Tactical Utility",
          metaBadge: "1 Menit • Jarak 60 ft",
          description: "Mengamati pergerakan lingkungan secara senyap layaknya regu pengintai patroli.",
          details: {
            "Check": "Mind / Awareness",
            "Efek": "Mendeteksi secara tepat jumlah personel, rute patroli, dan posisi musuh di area sekitar selama 1 menit."
          }
        }
      ]
    },
    {
      id: "club-pecinta-alam",
      title: "8. Pecinta Alam (Sispala)",
      subtitle: "Insting Bertahan Hidup, Peta Liar & Fisik Tangguh",
      leadParagraph: "Ransel carrier penuh tali karmantel, kompor lapangan gas mini, dan insting tajam yang membaca arah hembusan angin perbukitan.",
      contentHtml: `<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Mind • <strong>Saving Throws:</strong> Physique, Mind.<br>
      <strong>Hak Istimewa:</strong> Kapasitas tas ransel ekstra, perlengkapan bivak darurat, kemampuan membaca cuaca, dan daya tahan tubuh di alam liar.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Penjelajah Rimba:</strong> Spesialis medan berat. Advantage pada Physique checks untuk memanjat tebing, berenang, atau menyeberangi rintangan.</li>
        <li><strong>Medis Lapangan (First Responder):</strong> Spesialis pengobatan darurat. Dadu penyembuhan meningkat menjadi 1d10 dan bisa merawat kawan saat Short Rest.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Insting Survival (Wilderness Awareness)",
          subtitle: "Passive Defense",
          metaBadge: "Pasif / Reaksi • Jarak Self",
          description: "Membaca arah angin, lumut pepohonan, dan jejak tanah di sekitar lokasi.",
          details: {
            "Check": "Mind / Awareness",
            "Efek": "Tidak pernah tersesat di luar ruangan dan kebal terhadap kondisi Surprised (serangan kejutan musuh)."
          }
        },
        {
          title: "P3K Darurat Lapangan (First Aid Field Patch)",
          subtitle: "Healing Move",
          metaBadge: "1 Action • 1x per Rest • Jarak Touch",
          description: "Membalut luka dengan perban elastis dan memberikan minuman hangat penghilang syok.",
          details: {
            "Check": "Otomatis",
            "Efek": "Memulihkan 1d8 + Mod Mind Physical HP atau Composure kepada teman yang terluka parah."
          }
        },
        {
          title: "Panjat Penghalang (Obstacle Climb)",
          subtitle: "Mobility Utility",
          metaBadge: "Bonus Action • Jarak Self",
          description: "Menggunakan teknik panjat tebing lincah untuk melompati tembok atau pagar pembatas.",
          details: {
            "Check": "Physique / Agility",
            "Efek": "Berhasil melewati pagar atau dinding tinggi tanpa perlu melempar dadu (1x per Short Rest)."
          }
        }
      ]
    },
    {
      id: "club-penyiaran",
      title: "9. Penyiaran (Broadcasting / Radio Sekolah)",
      subtitle: "Suara Emas Penguasa Speaker Sekolah & Intel Gosip",
      leadParagraph: "Mixer audio berkedip merah, mikrofon kondenser dengan filter busa, dan desas-desus sekolah yang selalu terdengar pertama kali di telinga mereka.",
      contentHtml: `<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Looks / Intelligent • <strong>Saving Throws:</strong> Intelligent, Looks.<br>
      <strong>Hak Istimewa:</strong> Akses ruang siaran sekolah, sound system speaker terpusat, koleksi piringan hitam/lagu, dan jejaring informan gosip terluas.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Penyiar Radio Sekolah:</strong> Suara emas yang membius. Seluruh Social Moves berbasis suara mendapat +1 pada DC check dan +1d4 damage Composure.</li>
        <li><strong>Reporter Investigasi:</strong> Pengorek skandal. Advantage pada seluruh check Intelligent (Street) dan Mind (Interpersonal) untuk mencari rahasia orang lain.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Pengumuman Speaker Sekolah (Public Broadcast)",
          subtitle: "Schoolwide Social Attack",
          metaBadge: "1 Aksi Khusus • Seluruh Sekolah",
          description: "Menyalakan mixer sentral dan mengumumkan rahasia atau gosip menggemparkan ke seluruh pengeras suara sekolah.",
          details: {
            "Check": "Looks / Influence",
            "Efek": "Target gosip menderita 1d8 Composure damage secara instan jika namanya disebutkan di hadapan khalayak ramai."
          }
        },
        {
          title: "Modulasi Suara Menghanyutkan (Soothing Voice)",
          subtitle: "Charm Social Move",
          metaBadge: "1 Action • Jarak 30 ft",
          description: "Berbicara dengan artikulasi merdu dan frekuensi hangat yang meredakan emosi agresif pendengar.",
          details: {
            "Check": "Looks / Charm vs Target Mind Save",
            "Efek": "Target terpesona dan tidak dapat melancarkan tindakan agresif selama 1 giliran."
          }
        },
        {
          title: "Bocoran Intel Eksklusif (Exclusive Scoop)",
          subtitle: "Information Gathering",
          metaBadge: "10 Menit • Jarak Self",
          description: "Mengontak informan bayangan di berbagai kelas untuk mengumpulkan rumor terpanas.",
          details: {
            "Check": "Intelligent / Street",
            "Efek": "Mendapatkan 1 informasi rahasia atau kebenaran rumor tentang karakter/kejadian tertentu sebelum aksi dimulai."
          }
        }
      ]
    },
    {
      id: "club-literatur",
      title: "10. Literatur (Klub Sastra & Membaca)",
      subtitle: "Kekuatan Kata Romantis, Sajak & Misteri Buku Lama",
      leadParagraph: "Aroma kertas lapuk di pojok perpustakaan sunyi, secangkir teh seduh, dan goresan tinta pena yang mampu meluluhkan hati paling beku.",
      contentHtml: `<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Intelligent / Mind • <strong>Saving Throws:</strong> Intelligent, Mind.<br>
      <strong>Hak Istimewa:</strong> Akses ruang arsip perpustakaan lama, koleksi novel sastra romansa klasik, dan kepiawaian merangkai surat cinta berdaya pikat mematikan.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Penulis Roman & Puisi:</strong> Spesialis asmara sastra. Surat cinta dan aksi romansa berbasis Talent/Creative memberikan bonus +1d4 Composure damage.</li>
        <li><strong>Penjaga Arsip Sejarah:</strong> Spesialis riset naskah kuno. Advantage pada seluruh check Intelligent terkait peraturan masa lalu, buku harian, dan arsip dokumen.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Surat Cinta Puitis (Lethal Love Letter)",
          subtitle: "Romance Move",
          metaBadge: "Dibuat Saat Rest • Loker Sepatu",
          description: "Menyelipkan sepucuk surat wangi berhias kata-kata puitis mendalam di loker sepatu gebetan.",
          details: {
            "Check": "Talent / Creative vs Target Mind Save",
            "Efek": "Target menderita 2d6 Composure damage (syok kasmaran) dan Heart Meter gebetan naik +1 ♥."
          }
        },
        {
          title: "Membaca Pola Pikiran (Literary Empathy)",
          subtitle: "Psychological Insight",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Menganalisis diksi kata dan intonasi lawan bicara layaknya membaca sudut pandang tokoh novel.",
          details: {
            "Check": "Mind / Interpersonal",
            "Efek": "Mengetahui satu keinginan terbesar atau penyesalan terdalam dari target yang sedang diajak bicara."
          }
        },
        {
          title: "Kutipan Menghancurkan (Devastating Quote)",
          subtitle: "Social Attack Move",
          metaBadge: "1 Action • Jarak 20 ft",
          description: "Mengutip bait sastra atau filsafat yang secara telak membantah argumen congkak lawan.",
          details: {
            "Check": "Intelligent / Academic vs Mind Save",
            "Efek": "Target kehilangan 1d8 Composure karena kehilangan kata-kata menghadapi kebenaran mutlak."
          }
        }
      ]
    },
    {
      id: "club-band",
      title: "11. Band Musik (Gitar / Drum / Vokal / Keyboard)",
      subtitle: "Dentuman Distorsi, Semangat Jiwa Muda & Fans Fanatik",
      leadParagraph: "Kabel ampli berseliweran di studio kedap suara, raungan gitar listrik bernada tinggi, dan panggung festival sekolah yang mengguncang jiwa.",
      contentHtml: `<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Looks / Talent • <strong>Saving Throws:</strong> Looks, Talent.<br>
      <strong>Hak Istimewa:</strong> Kunci studio musik berperedam, amplifier portabel, instrumen andalan pribadi, dan lingkar penggemar setia di sekolah.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Lead Guitarist / Soloist:</strong> Penguasa solo instrumen. Serangan gelombang suara berbasis Talent mendapat bonus +1d6 damage dan radius lebih luas.</li>
        <li><strong>Vokalis Karismatik:</strong> Pusat magnet penonton. Seluruh Social Moves dari karakter ini memberikan Disadvantage pada Mental Saves target.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Petikan Melodi Penyelamat (Bardic Rock Riff)",
          subtitle: "Bardic Inspiration Buff",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Memetik riff gitar akustik atau bersenandung melodi penyemangat yang membangkitkan kembali nyali rekan.",
          details: {
            "Check": "Talent / Performance",
            "Efek": "Memberikan satu dadu 1d6 Inspiration Die kepada kawan; dapat ditambahkan ke d20 roll apapun dalam 10 menit."
          }
        },
        {
          title: "Distorsi Pemecah Telinga (Sonic Screech)",
          subtitle: "AoE Sound Attack",
          metaBadge: "1 Action • Kerucut 15 ft",
          description: "Mengarahkan mikrofon mendekat ke speaker monitor memicu lengkingan feedback frekuensi tinggi.",
          details: {
            "Check": "Physique Save DC 8 + Prof + Mod Talent",
            "Efek": "1d8 Suara/Mental Damage ke Composure dan HP fisik; target gagal menderita status Deafened selama 1 ronde."
          }
        },
        {
          title: "Penampilan Epik (Crowd Performance)",
          subtitle: "Mass Emotional Move",
          metaBadge: "1 Menit • Area Suara",
          description: "Membawakan petikan lagu spektakuler yang menggetarkan emosi seisi ruangan.",
          details: {
            "Check": "Talent / Performance vs Mind Save",
            "Efek": "Musuh kehilangan 1d4 Composure (terpana) atau kawan memulihkan 1d4 Composure (terinspirasi) sesuai keputusan DM."
          }
        }
      ]
    },
    {
      id: "club-painting",
      title: "12. Painting (Klub Seni Rupa & Desain)",
      subtitle: "Goresan Kuas, Memori Visual Tajam & Estetika Warna",
      leadParagraph: "Aroma khas cat minyak dan tiner di ruang atelier, kanvas putih yang menanti sentuhan magis, dan mata jeli yang mampu menangkap spektrum emosi manusia.",
      contentHtml: `<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Talent / Intelligent • <strong>Saving Throws:</strong> Intelligent, Talent.<br>
      <strong>Hak Istimewa:</strong> Ruang atelier seni luas, palet warna lengkap, buku sketsa tebal, dan kepekaan tinggi terhadap proporsi visual serta bahasa tubuh.</p>
      <h4>Pilihan Subclass</h4>
      <ul>
        <li><strong>Pelukis Potret Realis:</strong> Mengabadikan rupa secara fotografis. Advantage pada seluruh check yang membutuhkan pengenalan wajah atau rekonstruksi visual.</li>
        <li><strong>Ilustrator Manga & Desain:</strong> Komunikator visual massa. Publikasi poster, flyer, atau karikatur buatannya memberikan bonus 1d6 Influence di lingkungan sekolah.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Sketsa Wajah Kilat (Photographic Sketch)",
          subtitle: "Visual Investigation",
          metaBadge: "1 Menit • Jarak Touch",
          description: "Menggoreskan pensil 2B di buku sketsa dengan kecepatan tangan tinggi untuk merekonstruksi rupa seseorang.",
          details: {
            "Check": "Talent / Creative",
            "Efek": "Menghasilkan potret visual akurat dari wajah tersangka atau bukti penting yang hanya sempat terlihat sekilas."
          }
        },
        {
          title: "Cipratan Cat Distraksi (Paint Splatter Blind)",
          subtitle: "Combat Control Move",
          metaBadge: "1 Action • Jarak 10 ft",
          description: "Menyiramkan palet cat minyak basah pekat tepat ke arah kedua mata penyerang.",
          details: {
            "Check": "Physique / Agility",
            "Efek": "Target mengalami kondisi Blinded selama 1 giliran hingga mereka meluangkan aksi untuk menyeka cat."
          }
        },
        {
          title: "Karya Provokasi (Satirical Artwork)",
          subtitle: "Social Propaganda",
          metaBadge: "1 Jam Persiapan • Seluruh Sekolah",
          description: "Membuat poster karikatur satire yang dipasang diam-diam di majalah dinding sekolah.",
          details: {
            "Check": "Talent / Creative vs Looks Save",
            "Efek": "Karya menjadi buah bibir; target kehilangan 1d4 Composure setiap kali murid lain menertawakan gambar tersebut selama 1 hari."
          }
        }
      ]
    }
  ]
};
