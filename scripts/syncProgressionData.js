import fs from "fs";
import path from "path";

export const EKSKUL_PROGRESSION_DATA = [
  {
    id: "student_council",
    name: "Student Council (OSIS)",
    tagline: "Elit Organisasi & Penegak Ketertiban Sekolah",
    hitDie: "d8",
    primaryStat: "Looks / Intelligent",
    savingThrows: ["intelligent", "looks"],
    perkDesc: "Hak akses ruang OSIS ber-AC, wewenang menegur murid lain, anggaran proposal kegiatan sekolah, dan disegani dewan guru.",
    subclasses: [
      {
        id: "presidium",
        name: "Ketua / Presidium",
        tagline: "Pemimpin mutlak organisasi & perisai reputasi sekolah.",
        identityDesc: "Support kepemimpinan karismatik; mengorkestrasi moral kawan dan berani menanggung beban mental demi menyelamatkan kegagalan tim.",
        desc: "Pemimpin mutlak OSIS. Bonus +2 pada semua Looks checks saat berhadapan dengan guru atau undangan eksternal.",
        subclassMoves: [
          {
            id: "presidium_g11_rapat_darurat",
            subclassId: "presidium",
            name: "Rapat Darurat",
            tier: "G11",
            unlockGrade: 11,
            type: "Support Move",
            cost: "1 Action (1x per Short Rest)",
            range: "30 ft",
            check: "Looks / Influence",
            effect: "Sekutu dalam 30 ft pulihkan 1d6 + Mod Looks Composure dan mendapat Advantage pada Initiative selama 1 jam.",
            desc: "Kumpulkan sekutu dalam jarak 30 ft yang bisa mendengar untuk menyusun strategi kilat."
          },
          {
            id: "presidium_g12_mandat_ketua",
            subclassId: "presidium",
            name: "Mandat Ketua",
            tier: "G12",
            unlockGrade: 12,
            type: "Reaction / Leadership",
            cost: "1 Reaction (1x per Long Rest)",
            range: "30 ft",
            check: "Otomatis",
            effect: "Ubah satu kegagalan check atau saving throw sekutu dalam 30 ft menjadi sukses mutlak. Pengguna menerima 1d4 Composure damage (Salting/Fluster).",
            desc: "Menanggung konsekuensi keputusan dengan otoritas penuh ketua OSIS."
          }
        ]
      },
      {
        id: "discipline",
        name: "Divisi Kedisiplinan",
        tagline: "Penegak tata tertib sekolah berwajah dingin tanpa kompromi.",
        identityDesc: "Crowd control sosial & pengintimidasi; memanfaatkan wibawa aturan dan buku catatan pelanggaran untuk melemahkan musuh.",
        desc: "Penegak aturan sekolah. Advantage pada Intimidasi dan Check untuk mendeteksi pelanggaran murid lain.",
        subclassMoves: [
          {
            id: "discipline_g11_peluit_disiplin",
            subclassId: "discipline",
            name: "Peluit Disiplin",
            tier: "G11",
            unlockGrade: 11,
            type: "Social Debuff",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Mind Save (DC 8+PB+Looks)",
            effect: "Target gagal menderita status Shaken (Disadvantage pada serangan & check sosial) sampai akhir giliran berikutnya.",
            desc: "Meniup peluit komando dengan tatapan tajam penegak kedisiplinan sekolah."
          },
          {
            id: "discipline_g12_catatan_pelanggaran",
            subclassId: "discipline",
            name: "Catatan Pelanggaran",
            tier: "G12",
            unlockGrade: 12,
            type: "Social Leverage",
            cost: "1 Action (1x per Long Rest)",
            range: "Pandangan",
            check: "Otomatis",
            effect: "Pilih 1 murid yang melanggar aturan: target Disadvantage check sosial ke guru/staf selama 1 hari, dan kamu Advantage Influence ke guru/staf terkait dirinya.",
            desc: "Mencatat nama dan pasal pelanggaran target di buku hitam kedisiplinan OSIS."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "student_council_move_1",
        name: "Perintah Kedisiplinan (Disciplinary Order)",
        order: 1,
        unlockGrade: 10,
        type: "Social Attack / Combat",
        cost: "1 Bonus Action (PBx per Long Rest)",
        range: "30 ft",
        check: "Mind Save (DC 8+PB+Looks)",
        effect: "Dipicu setelah serangan mendarat. Target gagal: +1d6 Composure damage dan terkena status Shaken 1 ronde.",
        desc: "Menegur target dengan suara tegas berwibawa khas OSIS saat menertibkan pelanggaran."
      },
      {
        id: "student_council_move_2",
        name: "Birokrasi & Wewenang (Executive Privilege)",
        order: 2,
        unlockGrade: 11,
        type: "Utility / Bureaucracy",
        cost: "1x per School Day (Long Rest)",
        range: "Self / Touch",
        check: "Otomatis",
        effect: "Mendapatkan dispensasi resmi tanpa roll: surat jalan, akses ruangan terkunci/ber-AC, atau pembatalan razia untuk diri dan 1 teman.",
        desc: "Menunjukkan kartu identitas OSIS atau surat mandat dinas resmi kepala sekolah."
      },
      {
        id: "student_council_move_3",
        name: "Koneksi Pihak Sekolah (Faculty Protection)",
        order: 3,
        unlockGrade: 12,
        type: "Reaction / Leadership",
        cost: "1 Reaction (PBx per Long Rest)",
        range: "30 ft",
        check: "Otomatis",
        effect: "Batalkan status emosional negatif (Salting/Fluster/Shaken) pada sekutu dalam 30 ft; sekutu memulihkan 1d6 + Mod Intelligent Composure.",
        desc: "Intervensi wibawa pengurus inti OSIS yang memulihkan ketegaran mental rekan satu tim."
      }
    ]
  },
  {
    id: "kendo",
    name: "Kendo (Pedang Bambu)",
    tagline: "Disiplin Pedang Samurai & Konsentrasi Batin",
    hitDie: "d10",
    primaryStat: "Physique / Mind",
    savingThrows: ["physique", "mind"],
    perkDesc: "Penguasaan teknik Shinai dan Bokken, ruang latihan Dojo tradisional, kuda-kuda kokoh, dan fokus mata yang tak goyah.",
    subclasses: [
      {
        id: "men_striker",
        name: "Gaya Serangan Kilat (Men-Striker)",
        tagline: "Tebasan bilah pertama yang menembus pertahanan lawan seketika.",
        identityDesc: "Striker ofensif agresif; unggul pada inisiatif serangan pembuka duel dan meluncurkan rentetan tebasan kombo bertubi-tubi.",
        desc: "Spesialisasi serangan cepat. Bonus aksi ekstra setelah serangan sukses pertama dalam ronde.",
        subclassMoves: [
          {
            id: "men_striker_g11_ayunan_pertama",
            subclassId: "men_striker",
            name: "Ayunan Pertama",
            tier: "G11",
            unlockGrade: 11,
            type: "Passive Attack",
            cost: "Pasif (1x per Combat)",
            range: "Melee (5 ft)",
            check: "Physique Attack",
            effect: "Serangan shinai pertamamu dalam combat mendapat +2 to hit dan +1d6 Physical Damage tambahan.",
            desc: "Langkah sergap kilat melancarkan tebasan mendadak sebelum lawan siap berposisi."
          },
          {
            id: "men_striker_g12_men_kote_do",
            subclassId: "men_striker",
            name: "Men-Kote-Do",
            tier: "G12",
            unlockGrade: 12,
            type: "Attack Combo",
            cost: "1 Action (1x per Short Rest)",
            range: "Melee (5 ft)",
            check: "Physique Attack",
            effect: "3 serangan shinai beruntun ke 1 target. Serangan ke-2 dan ke-3 mendapat penalti -2 to hit tetapi +1d4 damage tambahan.",
            desc: "Rangkaian jurus klasik kendo menyasar kepala, pergelangan tangan, dan perut dalam satu tarikan napas."
          }
        ]
      },
      {
        id: "iron_guard",
        name: "Gaya Pertahanan Keras (Iron Wall)",
        tagline: "Tembok pertahanan baja pelindung kawan dari hantaman fisik.",
        identityDesc: "Tank defensif garis depan; menepis serangan lawan dengan kuda-kuda kokoh dan melindungi sekutu di belakangnya.",
        desc: "Spesialisasi pertahanan. +1 Physical AC permanen dan Advantage pada Physique Saving Throw.",
        subclassMoves: [
          {
            id: "iron_guard_g11_kudakuda_teguh",
            subclassId: "iron_guard",
            name: "Kuda-kuda Teguh",
            tier: "G11",
            unlockGrade: 11,
            type: "Reaction Defense",
            cost: "1 Reaction (PBx per Long Rest)",
            range: "Self",
            check: "Otomatis",
            effect: "+3 Physical AC terhadap 1 serangan fisik. Jika serangan meleset, serangan balasan ke penyerang mendapat Advantage.",
            desc: "Menancapkan tumit kuat ke lantai dan menahan impak pukulan lawan tanpa goyah."
          },
          {
            id: "iron_guard_g12_tembok_besi",
            subclassId: "iron_guard",
            name: "Tembok Besi",
            tier: "G12",
            unlockGrade: 12,
            type: "Defensive Stance",
            cost: "1 Bonus Action (1x per Short Rest)",
            range: "Self / 5 ft",
            check: "Otomatis",
            effect: "Diri sendiri mendapat Resistance terhadap Physical Damage hingga awal giliran berikutnya; sekutu dalam 5 ft di belakangmu +2 Physical AC.",
            desc: "Memasang kuda-kuda pelindung lebar yang membelokkan seluruh hantaman dari kawan."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "kendo_move_1",
        name: "Tebasan Shinai: Men! (Head Slash)",
        order: 1,
        unlockGrade: 10,
        type: "Attack Move",
        cost: "1 Action",
        range: "Melee (5 ft)",
        check: "Physique Attack",
        effect: "1d8 + Mod Physique Bludgeoning. Jika Critical Hit (Natural 19-20 untuk Men-Striker / Nat 20 normal): target terkena status Dazed 1 ronde.",
        desc: "Pukulan vertikal terarah ke arah kepala lawan dengan hentakan langkah kaki dan kiai menggelegar."
      },
      {
        id: "kendo_move_2",
        name: "Tangkisan Sempurna (Kendo Parry)",
        order: 2,
        unlockGrade: 11,
        type: "Reaction Defense",
        cost: "1 Reaction (PBx per Short Rest)",
        range: "Self",
        check: "+2 Physical AC",
        effect: "Menambah +2 Physical AC secara instan terhadap 1 serangan fisik jarak dekat yang terlihat.",
        desc: "Mengayunkan pedang bambu membentuk sudut tangkisan tajam membelokkan serangan lawan."
      },
      {
        id: "kendo_move_3",
        name: "Kiai: Teriakan Semangat (Kiai Shout)",
        order: 3,
        unlockGrade: 12,
        type: "Bonus Action Buff",
        cost: "1 Bonus Action (PBx per Long Rest)",
        range: "30 ft",
        check: "Mind / Emotional",
        effect: "Dirimu dan 1 sekutu mendapat Advantage pada serangan fisik berikutnya di ronde ini.",
        desc: "Melepas teriakan kiai penuh konsentrasi batin yang membakar semangat tempur."
      }
    ]
  },
  {
    id: "martial_arts",
    name: "Martial Arts (Beladiri / Karate / Judo)",
    tagline: "Pertarungan Jarak Dekat & Refleks Bantingan",
    hitDie: "d10",
    primaryStat: "Physique",
    savingThrows: ["physique", "talent"],
    perkDesc: "Tubuh liat tahan banting, pukulan dan tendangan tanpa senjata berdaya hancur tinggi, serta kemampuan melumpuhkan lawan tanpa senjata tajam.",
    subclasses: [
      {
        id: "grappler",
        name: "Spesialis Bantingan (Judo / Grappler)",
        tagline: "Ahli kuncian sendi matras dan bantingan peredam daya juang.",
        identityDesc: "Melee brawler & controller; merebut kerah musuh, membanting keras ke tanah, dan mengunci gerak total tanpa ampun.",
        desc: "Ahli merebut dan membanting lawan ke tanah. Serangan Bantingan memberikan +2d4 damage tambahan.",
        subclassMoves: [
          {
            id: "grappler_g11_uchimata",
            subclassId: "grappler",
            name: "Uchi-mata",
            tier: "G11",
            unlockGrade: 11,
            type: "Takedown Move",
            cost: "1 Bonus Action setelah Grapple (PBx per Long Rest)",
            range: "Melee (5 ft)",
            check: "Physique / Power",
            effect: "Banting target: 1d8 + Mod Physique damage, dan target terkena status Dazed sampai akhir giliran berikutnya.",
            desc: "Menyapu paha bagian dalam lawan dan memutar tubuh untuk membantingnya telak ke matras."
          },
          {
            id: "grappler_g12_ippon",
            subclassId: "grappler",
            name: "Ippon",
            tier: "G12",
            unlockGrade: 12,
            type: "Finishing Slam",
            cost: "1 Action (1x per Short Rest)",
            range: "Melee (5 ft)",
            check: "Target Physique Save (DC 8+PB+Physique)",
            effect: "Target Grappled/Pinned gagal save: 2d10 + Mod Physique damage dan Pinned 1 ronde penuh. Sukses: setengah damage.",
            desc: "Bantingan punggung sempurna berkekuatan penuh yang mengunci kemenangan seketika."
          }
        ]
      },
      {
        id: "striker",
        name: "Spesialis Serangan Beruntun (Striker)",
        tagline: "Badai pukulan tangan kosong berkecepatan tinggi tanpa jeda.",
        identityDesc: "DPS kombo cepat; memaksimalkan serangan unarmed beruntun untuk memusingkan lawan lewat akumulasi pukulan telak.",
        desc: "Ahli combo pukulan cepat. Bisa menyerang 2 kali dengan 1 aksi (setelah level 3+).",
        subclassMoves: [
          {
            id: "striker_g11_kombo_dasar",
            subclassId: "striker",
            name: "Kombo Dasar",
            tier: "G11",
            unlockGrade: 11,
            type: "Passive Combo",
            cost: "Pasif",
            range: "Melee (5 ft)",
            check: "Physique Attack",
            effect: "Serangan unarmed kedua dalam giliran yang sama mendapat bonus +2 to hit dan +1d4 damage.",
            desc: "Susulan pukulan jab cepat segera setelah pukulan lurus pertama mendarat."
          },
          {
            id: "striker_g12_hujan_pukulan",
            subclassId: "striker",
            name: "Hujan Pukulan",
            tier: "G12",
            unlockGrade: 12,
            type: "Flurry Attack",
            cost: "1 Action (1x per Short Rest)",
            range: "Melee (5 ft)",
            check: "Physique Attack",
            effect: "4 serangan unarmed beruntun (tiap hit +Mod Physique). Jika minimal 3 hit berhasil mengenai target, target terkena status Dazed.",
            desc: "Rentetan kombo pukulan dan sikutan tanpa jeda layaknya petarung sabuk hitam turnamen."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "martial_arts_move_2",
        name: "Pukulan Cepat Kombo (Rapid Flurry)",
        order: 1,
        unlockGrade: 10,
        type: "Bonus Action Attack",
        cost: "1 Bonus Action",
        range: "Melee (5 ft)",
        check: "Physique / Agility",
        effect: "1d4 + Mod Physique Physical Damage tambahan setelah serangan utama mendarat.",
        desc: "Kombinasi pukulan cepat tanpa jeda menyasar ulu hati lawan."
      },
      {
        id: "martial_arts_move_1",
        name: "Bantingan Matras (Seoi-Nage Takedown)",
        order: 2,
        unlockGrade: 11,
        type: "Attack Move",
        cost: "1 Action",
        range: "Melee (5 ft)",
        check: "Target Physique Save (DC 8+PB+Physique)",
        effect: "1d6 + Mod Physique Bludgeoning. Target terjatuh dalam kondisi Prone (terkapar di lantai).",
        desc: "Menarik kerah atau lengan lawan, memutar pinggul, dan membantingnya keras ke lantai."
      },
      {
        id: "martial_arts_move_3",
        name: "Kunci Sendi (Joint Lock)",
        order: 3,
        unlockGrade: 12,
        type: "Control Move",
        cost: "1 Action",
        range: "Melee (5 ft)",
        check: "Target Physique Save (DC 8+PB+Physique)",
        effect: "Target menderita kondisi Restrained. Di awal tiap gilirannya, target boleh mengulang Physique Save untuk melepaskan diri.",
        desc: "Memutar pergelangan atau siku lawan ke sudut anatomis yang melumpuhkan gerakan total."
      }
    ]
  },
  {
    id: "sports",
    name: "Sports (Sepak Bola / Basket / Atletik)",
    tagline: "Stamina Baja & Kecepatan Lapangan Terbuka",
    hitDie: "d10",
    primaryStat: "Physique / Looks",
    savingThrows: ["physique", "physique"],
    perkDesc: "Kecepatan lari di atas rata-rata (+10 ft speed), keringat karismatik yang digemari murid lain, dan stamina tahan maraton.",
    subclasses: [
      {
        id: "ace_striker",
        name: "Striker / Ace Lapangan",
        tagline: "Bintang penyerang penentu kemenangan di menit-menit krusial.",
        identityDesc: "Mobile skirmisher; bergerak lincah menembus barisan tanpa terkena serangan kesempatan dan unggul dalam momen genting.",
        desc: "Serangan fisik berbasis kecepatan. Bonus +1d4 damage saat menyerang setelah berlari setidaknya 15 ft.",
        subclassMoves: [
          {
            id: "ace_striker_g11_sprint_final",
            subclassId: "ace_striker",
            name: "Sprint Final",
            tier: "G11",
            unlockGrade: 11,
            type: "Mobility Burst",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "Self",
            check: "Otomatis",
            effect: "Speed +15 ft sampai akhir giliran, kebal Opportunity Attack, dan Advantage pada check Agility.",
            desc: "Akselerasi sprint eksplosif menembus celah sempit di antara kerumunan lawan."
          },
          {
            id: "ace_striker_g12_clutch_moment",
            subclassId: "ace_striker",
            name: "Clutch Moment",
            tier: "G12",
            unlockGrade: 12,
            type: "Clutch Buff",
            cost: "1x per Short Rest (DM)",
            range: "Self",
            check: "Otomatis",
            effect: "Tambahkan dadu 1d10 ke satu roll Physique, Agility, atau Talent. Boleh digunakan setelah melihat hasil dadu.",
            desc: "Mental juara yang meledak tepat di detik-detik penentuan pertandingan."
          }
        ]
      },
      {
        id: "team_captain",
        name: "Kapten Regu (Team Captain)",
        tagline: "Komandan lapangan pengatur formasi dan pembakar semangat regu.",
        identityDesc: "Leader & buffer taktis; memberikan koordinasi pertahanan AC tim serta pidato pemulihan moral yang memulihkan HP dan batin.",
        desc: "Pemimpin tim. Sekali per istirahat, berikan 1d6 Inspiration Die ke seluruh anggota tim.",
        subclassMoves: [
          {
            id: "team_captain_g11_formasi_tim",
            subclassId: "team_captain",
            name: "Formasi Tim",
            tier: "G11",
            unlockGrade: 11,
            type: "Tactical Defense",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Looks / Influence",
            effect: "Semua sekutu dalam 30 ft mendapat bonus +1 to hit dan +1 Physical AC hingga awal giliranmu berikutnya.",
            desc: "Mengatur posisi bertahan rekan tim layaknya formasi zona pertahanan basket."
          },
          {
            id: "team_captain_g12_pidato_kapten",
            subclassId: "team_captain",
            name: "Pidato Kapten",
            tier: "G12",
            unlockGrade: 12,
            type: "Inspirational Rally",
            cost: "1 Action (1x per Long Rest)",
            range: "30 ft",
            check: "Looks / Influence",
            effect: "Semua sekutu dalam 30 ft memulihkan 1d8 + Mod Looks Physical HP dan Composure, serta Advantage pada Saving Throw berikutnya.",
            desc: "Pidato emosional berapi-api di pinggir lapangan yang membakar kembali asa rekan tim."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "sports_move_1",
        name: "Terobosan Kilat (Fast Break Sprint)",
        order: 1,
        unlockGrade: 10,
        type: "Bonus Action Movement",
        cost: "1 Bonus Action (PBx per Short Rest)",
        range: "Self",
        check: "Otomatis",
        effect: "Menggandakan kecepatan gerak (Dash) dan kebal Opportunity Attack saat melewati lawan di ronde ini.",
        desc: "Manuver lari cepat zig-zag menembus celah kerumunan layaknya mengejar bola lepas."
      },
      {
        id: "sports_move_2",
        name: "Lemparan Bola Akurat (Precision Throw)",
        order: 2,
        unlockGrade: 11,
        type: "Ranged Attack Move",
        cost: "1 Action",
        range: "20 / 60 ft",
        check: "Physique / Agility",
        effect: "1d6 + Mod Physique Bludgeoning. Jika kena, bola memantul 10 ft: pemain bisa gunakan 1 Reaction untuk sprint memungut kembali bola tersebut.",
        desc: "Melempar bola olahraga dengan presisi tinggi lalu langsung bersiap menjemput bola pantul."
      },
      {
        id: "sports_move_3",
        name: "Sorak Penyemangat (Rally Cheer)",
        order: 3,
        unlockGrade: 12,
        type: "Buff Move",
        cost: "1 Bonus Action (PBx per Long Rest)",
        range: "30 ft",
        check: "Looks / Influence",
        effect: "Satu kawan memulihkan 1d4 Physical HP dan mendapat Advantage pada satu lemparan dadu fisik berikutnya.",
        desc: "Berteriak penuh semangat ke arah kawan yang tertekan untuk memacu adrenalin mereka."
      }
    ]
  },
  {
    id: "drama",
    name: "Drama Club (Teater & Seni Peran)",
    tagline: "Manipulasi Emosi, Akting Panggung & Dusta Sempurna",
    hitDie: "d8",
    primaryStat: "Looks / Talent",
    savingThrows: ["looks", "talent"],
    perkDesc: "Kostum panggung beragam, kemampuan meneteskan air mata buatan seketika, menirukan intonasi orang lain, dan menyamar.",
    subclasses: [
      {
        id: "lead_actor",
        name: "Aktor Protagonis / Bintang Panggung",
        tagline: "Pusat perhatian lampu sorot penakluk simpati khalayak ramai.",
        identityDesc: "Provoker sosial & clutch survivor; memaksa musuh terpaku memandangnya dan bangkit berkarisma luar biasa saat terdesak.",
        desc: "Ahli menarik simpati massa. Serangan sosial berbasis Looks memberikan 1d4 bonus damage Composure.",
        subclassMoves: [
          {
            id: "lead_actor_g11_pusat_perhatian",
            subclassId: "lead_actor",
            name: "Pusat Perhatian",
            tier: "G11",
            unlockGrade: 11,
            type: "Spotlight Taunt",
            cost: "1 Action (1x per Short Rest)",
            range: "30 ft",
            check: "Talent / Performance vs Mind Save (DC 8+PB+Looks)",
            effect: "Musuh yang gagal Mind Save menderita Disadvantage saat menyerang atau bertindak terhadap sekutumu (mereka terpaku padamu selama 1 menit).",
            desc: "Melangkah ke tengah ruangan dengan pose teatrikal yang merebut seluruh atensi musuh."
          },
          {
            id: "lead_actor_g12_adegan_klimaks",
            subclassId: "lead_actor",
            name: "Adegan Klimaks",
            tier: "G12",
            unlockGrade: 12,
            type: "Climax Buff",
            cost: "1 Bonus Action (1x per Long Rest)",
            range: "Self",
            check: "Otomatis",
            effect: "Saat HP atau Composure <= 50%: selama 1 menit Advantage check Talent & Looks, +2 kedua AC, dan memulihkan Composure sebesar setengah maksimal.",
            desc: "Memasuki babak klimaks panggung saat terdesak, memancarkan aura bintang yang tak terbendung."
          }
        ]
      },
      {
        id: "antagonist",
        name: "Master Tipu Daya (Antagonist)",
        tagline: "Dalang intrik sandiwara berwajah ganda pembalik skenario.",
        identityDesc: "Deceiver & manipulator; menutupi kebohongan dengan sempurna dan membelokkan serangan musuh menjadi plot twist tak terduga.",
        desc: "Ahli manipulasi. Advantage pada semua check untuk menipu, berpura-pura, atau menyamar.",
        subclassMoves: [
          {
            id: "antagonist_g11_topeng_ganda",
            subclassId: "antagonist",
            name: "Topeng Ganda",
            tier: "G11",
            unlockGrade: 11,
            type: "Passive Deception",
            cost: "Pasif",
            range: "Self",
            check: "Performance / Influence",
            effect: "Advantage pada check Performance atau Influence saat berbohong/menyamar. Siapa pun yang mencoba membongkarmu menderita Disadvantage.",
            desc: "Menyembunyikan niat asli di balik senyuman ramah dan gestur tanpa cela."
          },
          {
            id: "antagonist_g12_plot_twist",
            subclassId: "antagonist",
            name: "Plot Twist",
            tier: "G12",
            unlockGrade: 12,
            type: "Reaction Counter",
            cost: "1 Reaction (1x per Long Rest)",
            range: "30 ft",
            check: "Target Mind Save (DC 8+PB+Looks)",
            effect: "Saat musuh menyerang/menggagalkan rencanamu: musuh gagal save serangannya dialihkan ke target lain atau batal, dan kamu Advantage aksi berikutnya.",
            desc: "Menyingkap jebakan tersembunyi yang membalikkan situasi di saat musuh merasa telah menang."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "drama_move_1",
        name: "Air Mata Buatan (Fake Tears / Pity)",
        order: 1,
        unlockGrade: 10,
        type: "Social Move",
        cost: "1 Action (PBx per Short Rest)",
        range: "15 ft",
        check: "Charm Check vs Mind Save (DC 8+PB+Looks)",
        effect: "Target terkena kondisi Pity (Disadvantage serang pengguna, pengguna Advantage ke target). Efek hilang jika pengguna menyerang target.",
        desc: "Meneteskan air mata pura-pura sambil menggigit bibir, membalikkan simpati seketika."
      },
      {
        id: "drama_move_2",
        name: "Persona Penyamaran (Method Acting)",
        order: 2,
        unlockGrade: 11,
        type: "Utility Move",
        cost: "10 Menit Persiapan (At-Will)",
        range: "Self",
        check: "Talent / Adaptability",
        effect: "Advantage pada seluruh check People & Street saat menyamar sebagai profil murid lain.",
        desc: "Merombak gaya bicara, cara jalan, dan dandanan untuk berpura-pura jadi karakter lain."
      },
      {
        id: "drama_move_3",
        name: "Monolog Dramatis (Grand Speech)",
        order: 3,
        unlockGrade: 12,
        type: "Area Social Attack",
        cost: "1 Action (1x per Short Rest)",
        range: "Area 30 ft",
        check: "Talent / Performance vs Mind Save",
        effect: "Seluruh musuh dalam 30 ft kehilangan 1d4 Composure; kawan mendapat Advantage pada Social Saves selama 1 ronde.",
        desc: "Berpidato teatrikal penuh penghayatan puitis yang menusuk perasaan siapa saja yang mendengar."
      }
    ]
  },
  {
    id: "kir_osn",
    name: "KIR / OSN (Sains & Karya Ilmiah Remaja)",
    tagline: "Analisis Tajam, Riset Ilmiah & Reaksi Kimia",
    hitDie: "d6",
    primaryStat: "Intelligent",
    savingThrows: ["intelligent", "mind"],
    perkDesc: "Kunci akses laboratorium sains & bahan kimia, bank soal olimpiade, mikroskop, dan laptop penuh data analisis.",
    subclasses: [
      {
        id: "chemist",
        name: "Peneliti Kimia & Biologi",
        tagline: "Peracik senyawa laboratorium penawar kondisi dan penguat raga.",
        identityDesc: "Alchemist healer & buffer; meracik obat lapangan untuk memulihkan luka fisik serta formula imunitas jangka panjang.",
        desc: "Ahli senyawa kimia. Bisa menciptakan efek racun, asap, atau pelemas otot dari bahan lab sekali per sesi.",
        subclassMoves: [
          {
            id: "chemist_g11_racikan_lab",
            subclassId: "chemist",
            name: "Racikan Lab",
            tier: "G11",
            unlockGrade: 11,
            type: "Healing Concoction",
            cost: "1 Action (PBx per Long Rest)",
            range: "5 ft",
            check: "Otomatis",
            effect: "Satu target dalam 5 ft memulihkan 1d6 + Mod Intelligent Physical HP, atau mengakhiri 1 kondisi fisik (Dazed/sakit).",
            desc: "Memberikan salep antiseptik atau larutan elektrolit racikan sendiri."
          },
          {
            id: "chemist_g12_formula_rahasia",
            subclassId: "chemist",
            name: "Formula Rahasia",
            tier: "G12",
            unlockGrade: 12,
            type: "Group Serum",
            cost: "10 Menit (1x per Long Rest)",
            range: "Touch (s.d. 4 target)",
            check: "Intelligent / Academic",
            effect: "Pilih: +2 Stamina Save selama 1 jam, atau netralkan semua kondisi fisik negatif dan pulihkan 2d6 Physical HP untuk 4 kawan.",
            desc: "Membagi formula suplemen ilmiah murni hasil riset berhari-hari di laboratorium."
          }
        ]
      },
      {
        id: "hacker",
        name: "Hacker Komputer & Robotika",
        tagline: "Pengendali perangkat siber dan pengintai udara digital sekolah.",
        identityDesc: "Utility controller & scout; memanfaatkan drone intai untuk memperluas pandangan radar tim dan menepis serangan mendadak.",
        desc: "Ahli perangkat digital. Advantage pada check Intelligent untuk membobol sistem, CCTV, atau kunci digital.",
        subclassMoves: [
          {
            id: "hacker_g11_drone_rakitan",
            subclassId: "hacker",
            name: "Drone Rakitan",
            tier: "G11",
            unlockGrade: 11,
            type: "Aerial Drone Scout",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "60 ft",
            check: "Otomatis",
            effect: "Kendalikan drone mikro selama 10 menit. Melihat sudut pandang kamera dan Advantage pada check Awareness jarak jauh.",
            desc: "Menerbangkan quadcopter mini rakitan klub robotika untuk mengintai area sekitar."
          },
          {
            id: "hacker_g12_unit_pendukung",
            subclassId: "hacker",
            name: "Unit Pendukung",
            tier: "G12",
            unlockGrade: 12,
            type: "Robotic Defense",
            cost: "1x per Long Rest (Aktif 1 Jam)",
            range: "15 ft",
            check: "Reaction",
            effect: "Reaction: satu serangan fisik terhadap kawan dalam 15 ft otomatis ditangkis oleh drone pendamping. Sekutu yang dibantu +1d6 check Academic/Street.",
            desc: "Mengaktifkan robot pembantu bersensor otonom yang menjaga keamanan kawan."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "kir_osn_move_1",
        name: "Analisis Titik Lemah (Analytical Deduction)",
        order: 1,
        unlockGrade: 10,
        type: "Tactical Combat Move",
        cost: "1 Bonus Action",
        range: "30 ft",
        check: "Intelligent / Academic",
        effect: "Ketahui 1 stat tertinggi dan 1 kelemahan target; serangan kawan berikutnya ke target mendapat Advantage.",
        desc: "Mengamati postur dan kebiasaan lawan lewat perhitungan matematis untuk menemukan celah pertahanan."
      },
      {
        id: "kir_osn_move_2",
        name: "Vial Reaksi Kimia: Poof & Boom! (Chemical Vials)",
        order: 2,
        unlockGrade: 11,
        type: "Chemical Flask Move",
        cost: "1 Action (PB + Mod INT slot vial per Long Rest)",
        range: "20 ft",
        check: "Physique/Mind Save (DC 8+PB+INT)",
        effect: "Pilih Poof (kabut asap radius 10 ft, 2 ronde) atau Boom (1d6 Thunder damage & terdorong 5 ft). Level tinggi membuka Kablam/Korosif.",
        desc: "Melemparkan tabung reaksi kimia darurat saku yang menghasilkan reaksi ledakan asap atau kejut."
      },
      {
        id: "kir_osn_move_3",
        name: "Formula Konsentrasi (Study Buff)",
        order: 3,
        unlockGrade: 12,
        type: "Utility Buff",
        cost: "10 Menit Persiapan",
        range: "Touch",
        check: "Intelligent / Academic",
        effect: "Target mendapat Advantage pada 1 check Intelligent atau Talent berikutnya dalam rentang waktu 1 jam.",
        desc: "Menyusun peta konsep atau ringkasan materi kilat ilmiah agar daya nalar otak melonjak tajam."
      }
    ]
  },
  {
    id: "pramuka_paskin",
    name: "Pramuka / Paskin (Paskibra & Kedisiplinan Baris)",
    tagline: "Tali Temali, Disiplin Militer & Postur Tegak",
    hitDie: "d10",
    primaryStat: "Physique / Mind",
    savingThrows: ["physique", "mind"],
    perkDesc: "Keahlian tali temali mengikat barang/lawan, tiang bendera serbaguna, peluit komando, dan daya tahan berjemur di lapangan.",
    subclasses: [
      {
        id: "danton",
        name: "Komandan Peleton (Danton)",
        tagline: "Pengendali irama barisan berwibawa disiplin militer yang kokoh.",
        identityDesc: "Tactical commander; memimpin inisiatif kelompok lewat aba-aba tegas dan menyatukan fokus mental regu.",
        desc: "Pemimpin barisan. Advantage saat memimpin aksi kelompok, bonus +2 pada semua Social Saves tim.",
        subclassMoves: [
          {
            id: "danton_g11_abaaba",
            subclassId: "danton",
            name: "Aba-aba",
            tier: "G11",
            unlockGrade: 11,
            type: "Tactical Lead",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Mind / Emotional",
            effect: "Sekutu dalam 30 ft yang mendengar komando mendapat +1d4 pada inisiatif dan check pertama mereka.",
            desc: "Memberikan aba-aba lantang terstruktur yang memompa kesiapsiagaan seluruh rekan regu."
          },
          {
            id: "danton_g12_barisan_rapat",
            subclassId: "danton",
            name: "Barisan Rapat",
            tier: "G12",
            unlockGrade: 12,
            type: "Morale Formation",
            cost: "1 Action (1x per Short Rest)",
            range: "15 ft",
            check: "Otomatis",
            effect: "Selama 1 menit, sekutu dalam 15 ft darimu mendapat +2 Mental AC dan kebal status Salting/Fluster akibat tekanan kelompok.",
            desc: "Menginstruksikan barisan rapat pundak ke pundak yang menepis segala bentuk intimidasi."
          }
        ]
      },
      {
        id: "pioneer",
        name: "Pionir Tali Temali & Tenda",
        tagline: "Ahli ikatan simpul taktis dan pembangun pos perlindungan alam.",
        identityDesc: "Field trapper & survivalist; mengikat musuh dengan simpul jerat serta mendirikan pos istirahat yang meregenerasi stamina.",
        desc: "Ahli bertahan hidup. Tidak pernah kehilangan arah di luar ruangan. +2 Physique Save terhadap bahaya alam.",
        subclassMoves: [
          {
            id: "pioneer_g11_simpul_jerat",
            subclassId: "pioneer",
            name: "Simpul Jerat",
            tier: "G11",
            unlockGrade: 11,
            type: "Rope Snare Trap",
            cost: "1 Action (PBx per Long Rest)",
            range: "15 ft (Butuh Tali)",
            check: "Target Agility Save (DC 8+PB+Physique)",
            effect: "Target gagal menderita status Pinned/Restrained sampai berhasil lepas lewat check Physique/Agility melawan DC-mu.",
            desc: "Melemparkan tali simpul laso yang menjerat kaki atau pergelangan lawan seketika."
          },
          {
            id: "pioneer_g12_pos_darurat",
            subclassId: "pioneer",
            name: "Pos Darurat",
            tier: "G12",
            unlockGrade: 12,
            type: "Camp Haven",
            cost: "10 Menit (1x per Long Rest)",
            range: "Touch",
            check: "Otomatis",
            effect: "Dirikan pos/tenda. Sekutu yang Short Rest di dalamnya mendapat 1 Rest Dice ekstra dan kebal kelelahan cuaca.",
            desc: "Membangun bivak tenda darurat berlindung angin lengkap dengan alas dan pasak kokoh."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "pramuka_paskin_move_1",
        name: "Kuncian Tali Pramuka (Rope Restrain)",
        order: 1,
        unlockGrade: 10,
        type: "Combat Control Move",
        cost: "1 Action (Membawa PB Tali)",
        range: "Melee (5 ft)",
        check: "Target Agility Save (DC 8+PB+Physique)",
        effect: "Target menderita status Restrained. Tali memiliki HP = 5 + (2x Level) dan dapat dipotong jika menerima damage melebihi HP-nya.",
        desc: "Menggunakan seutas tali pramuka tebal untuk membelenggu tangan atau kaki lawan dalam sekejap."
      },
      {
        id: "pramuka_paskin_move_2",
        name: "Aba-aba Menggelegar (Commanding Drill)",
        order: 2,
        unlockGrade: 11,
        type: "Reaction Team Buff",
        cost: "1 Reaction (PBx per Long Rest)",
        range: "30 ft",
        check: "Mind / Emotional",
        effect: "Dipicu saat sekutu hendak melempar Saving Throw: sekutu menerima bonus +PB (atau +1d4) pada hasil lemparannya.",
        desc: "Meneriakkan instruksi komando baris berbaris tepat waktu yang membangkitkan fokus kawan."
      },
      {
        id: "pramuka_paskin_move_3",
        name: "Teknik Pengintaian (Scout Surveillance)",
        order: 3,
        unlockGrade: 12,
        type: "Tactical Utility",
        cost: "1 Menit (1x per Short Rest)",
        range: "60 ft",
        check: "Mind / Awareness",
        effect: "Mendeteksi secara tepat jumlah personel, rute patroli, dan posisi musuh di area sekitar selama 1 menit.",
        desc: "Mengamati lingkungan sekitar dengan gerakan senyap dan sistematis layaknya pengintai lapangan."
      }
    ]
  },
  {
    id: "pecinta_alam",
    name: "Pecinta Alam (Mapala / Sispala)",
    tagline: "Insting Bertahan Hidup, Peta Liar & Fisik Tangguh",
    hitDie: "d10",
    primaryStat: "Physique / Mind",
    savingThrows: ["physique", "mind"],
    perkDesc: "Tenda dome portabel, kompor gas mini, ransel gunung besar (kapasitas tas ekstra), dan indra penciuman cuaca tajam.",
    subclasses: [
      {
        id: "explorer",
        name: "Penjelajah Rimba & Pendaki",
        tagline: "Penakluk tebing curam dan penjelajah medan terjal tak kenal lelah.",
        identityDesc: "Explorer scout; memiliki mobilitas panjat setara kecepatan jalan, kebal bahaya gravitasi, dan sigap menarik kawan yang tergelincir.",
        desc: "Spesialis navigasi dan terrain. Advantage pada Physique checks untuk memanjat, berenang, atau melintasi rintangan alam.",
        subclassMoves: [
          {
            id: "explorer_g11_naluri_rimba",
            subclassId: "explorer",
            name: "Naluri Rimba",
            tier: "G11",
            unlockGrade: 11,
            type: "Passive Navigation",
            cost: "Pasif",
            range: "Self",
            check: "Mind / Awareness",
            effect: "Advantage pada check Awareness & Stamina di alam terbuka, tidak bisa tersesat, dan kecepatan memanjat sama dengan kecepatan jalan.",
            desc: "Insting alam liar yang menyatu dengan ritme pepohonan dan kontur perbukitan."
          },
          {
            id: "explorer_g12_pendaki_sejati",
            subclassId: "explorer",
            name: "Pendaki Sejati",
            tier: "G12",
            unlockGrade: 12,
            type: "Reaction Rescue",
            cost: "1 Reaction (PBx per Long Rest)",
            range: "15 ft",
            check: "Physique / Agility",
            effect: "Saat kamu/sekutu dalam 15 ft jatuh, ia kebal damage jatuh. Kamu boleh menarik sekutu itu sejauh 15 ft ke tempat aman.",
            desc: "Refleks cepat mencengkeram tali atau tangan kawan sebelum terperosok ke jurang."
          }
        ]
      },
      {
        id: "medic",
        name: "Ahli Pertolongan Pertama (Medic)",
        tagline: "Paramedis garis depan penyelamat nyawa di saat genting.",
        identityDesc: "Dedicated combat healer; membalut cedera fisik kawan seketika dan membangkitkan rekan yang tumbang dengan perlindungan ekstra.",
        desc: "Spesialis penyembuhan lapangan. Heal dice meningkat jadi 1d10 dan bisa menyembuhkan 1 teman per Short Rest.",
        subclassMoves: [
          {
            id: "medic_g11_p3k_darurat",
            subclassId: "medic",
            name: "P3K Darurat",
            tier: "G11",
            unlockGrade: 11,
            type: "Field First Aid",
            cost: "1 Action (PBx per Long Rest)",
            range: "5 ft",
            check: "Otomatis",
            effect: "Satu sekutu dalam 5 ft memulihkan 1d8 + Mod Mind Physical HP dan mengakhiri 1 kondisi buruk (misal Dazed).",
            desc: "Membersihkan luka dengan antiseptik dan memasang perban tekan lapangan."
          },
          {
            id: "medic_g12_triage",
            subclassId: "medic",
            name: "Triage",
            tier: "G12",
            unlockGrade: 12,
            type: "Revive Action",
            cost: "1 Bonus Action (1x per Short Rest)",
            range: "Touch",
            check: "Otomatis",
            effect: "Sekutu yang tumbang (HP 0) langsung sadar bangun dengan 2d8 + Mod Mind Physical HP dan menerima Temp HP sebesar PB.",
            desc: "Menyuntikkan cairan stimulan darurat yang memompa kembali detak jantung rekan."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "pecinta_alam_move_1",
        name: "Insting Survival (Wilderness Awareness)",
        order: 1,
        unlockGrade: 10,
        type: "Passive Defense & Navigation",
        cost: "Pasif / Free Action",
        range: "Self",
        check: "Mind / Awareness",
        effect: "Karakter tidak pernah tersesat di luar ruangan + otomatis mendapat Advantage pada navigasi/cuaca, serta kebal kondisi Surprised di alam bebas.",
        desc: "Membaca arah angin, lumut pohon, dan jejak tanah di sekitar lokasi."
      },
      {
        id: "pecinta_alam_move_3",
        name: "Panjat Penghalang (Obstacle Climb)",
        order: 2,
        unlockGrade: 11,
        type: "Mobility Utility",
        cost: "1 Bonus Action (PBx per Short Rest)",
        range: "Self",
        check: "Otomatis",
        effect: "Berhasil melewati pagar atau dinding tinggi tanpa perlu melempar dadu.",
        desc: "Menggunakan teknik panjat tebing lincah untuk melompati tembok atau pagar pembatas."
      },
      {
        id: "pecinta_alam_move_2",
        name: "P3K Darurat Lapangan (First Aid Field Patch)",
        order: 3,
        unlockGrade: 12,
        type: "Healing Move",
        cost: "1 Action (1x per Short Rest)",
        range: "Touch",
        check: "Otomatis",
        effect: "Memulihkan 1d8 + Mod Mind Physical HP atau Composure kepada teman yang terluka.",
        desc: "Membalut luka dengan perban elastis dan memberikan air minum hangat dari termos lapangan."
      }
    ]
  },
  {
    id: "penyiaran",
    name: "Penyiaran (Broadcasting / Radio Sekolah)",
    tagline: "Suara Emas Penguasa Speaker Sekolah & Intel Gosip",
    hitDie: "d6",
    primaryStat: "Looks / Intelligent",
    savingThrows: ["intelligent", "looks"],
    perkDesc: "Hak akses ruang siaran audio sekolah, mikrofon, pemutar lagu, dan jaringan informan gosip paling mutakhir di sekolah.",
    subclasses: [
      {
        id: "radio_host",
        name: "Penyiar Radio Sekolah",
        tagline: "Suara emas penenang jiwa dan pengendali gelombang suasana sekolah.",
        identityDesc: "Social bard & crowd buffer; menghibur batin kawan lewat siaran ASMR dan menyiarkan perintah evakuasi darurat ke seluruh area.",
        desc: "Suara emas sekolah. Semua Social Moves berbasis suara mendapat +1 ke DC check dan 1d4 bonus damage.",
        subclassMoves: [
          {
            id: "radio_host_g11_suara_siaran",
            subclassId: "radio_host",
            name: "Suara Siaran",
            tier: "G11",
            unlockGrade: 11,
            type: "Passive Broadcast Buff",
            cost: "Pasif + 1x per Short Rest",
            range: "Self / Area",
            check: "Looks / Charm",
            effect: "Advantage pada Charm & Performance saat memakai mic. Siaran 10 menit memberi sekutu yang mendengar Temp Composure 1d6 + Mod Looks.",
            desc: "Menyiarkan gelombang nada suara hangat yang menentramkan seisi lorong kelas."
          },
          {
            id: "radio_host_g12_pengumuman_darurat",
            subclassId: "radio_host",
            name: "Pengumuman Darurat",
            tier: "G12",
            unlockGrade: 12,
            type: "Mass Command",
            cost: "1 Action (1x per Long Rest, DM)",
            range: "Seluruh Sekolah",
            check: "Target Mind Save",
            effect: "Umumkan lewat speaker. Seluruh NPC di sekolah mengikuti instruksi sederhana (evakuasi/kumpul/berhenti berkelahi) kecuali yang lolos Mind Save.",
            desc: "Menyiarkan pengumuman wibawa sentral yang menggerakkan massa siswa secara serentak."
          }
        ]
      },
      {
        id: "investigator",
        name: "Reporter Investigasi",
        tagline: "Pemburu skandal rahasia dan pengungkap fakta di balik layar.",
        identityDesc: "Detective debuffer; menggali rahasia terpendam narasumber lewat wawancara taktis lalu membongkarnya di depan umum.",
        desc: "Ahli menggali informasi. Advantage pada semua check Intelligent (Street) dan Mind (Interpersonal) untuk mencari gosip.",
        subclassMoves: [
          {
            id: "investigator_g11_wawancara_tajam",
            subclassId: "investigator",
            name: "Wawancara Tajam",
            tier: "G11",
            unlockGrade: 11,
            type: "Investigative Probe",
            cost: "Pasif",
            range: "5 ft",
            check: "Interpersonal / Influence",
            effect: "Advantage pada check Interpersonal dan Influence saat mewawancarai; wawancara sukses memberi 1 fakta akurat dari DM.",
            desc: "Mengajukan pertanyaan menjebak dengan pena dan buku catatan reporter siap di tangan."
          },
          {
            id: "investigator_g12_ekspos",
            subclassId: "investigator",
            name: "Ekspos",
            tier: "G12",
            unlockGrade: 12,
            type: "Scandal Exposure",
            cost: "1 Action (1x per Long Rest)",
            range: "30 ft",
            check: "Otomatis",
            effect: "Bongkar rahasia/bukti target: target menderita 3d4 Composure damage (Salting/Fluster) dan Disadvantage check sosial 1 hari; kamu +2 Influence.",
            desc: "Memamerkan lembar bukti skandal tak terbantahkan yang membungkam pembelaan lawan."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "penyiaran_move_2",
        name: "Modulasi Suara Menghanyutkan (Soothing Voice)",
        order: 1,
        unlockGrade: 10,
        type: "Social Move",
        cost: "1 Action (PBx per Short Rest)",
        range: "30 ft",
        check: "Looks / Charm vs Target Mind Save",
        effect: "Target terpesona dan tidak dapat melancarkan tindakan agresif selama 1 giliran.",
        desc: "Berbicara dengan intonasi merdu dan frekuensi hangat yang meredakan emosi agresif pendengar."
      },
      {
        id: "penyiaran_move_3",
        name: "Damstagram Scoop / Riset Medsos (Exclusive Scoop)",
        order: 2,
        unlockGrade: 11,
        type: "Information Gathering",
        cost: "10 Menit Riset HP (At-Will, 1x per target)",
        range: "Self",
        check: "Intelligent / Street (DC 12)",
        effect: "Mendapatkan 1 informasi rahasia atau rumor akurat tentang karakter dari akun gosip sekolah Damstagram.",
        desc: "Menggali riwayat postingan, tag foto, dan rumor di medsos sekolah lewat smartphone."
      },
      {
        id: "penyiaran_move_1",
        name: "Suara Gelombang Seishun (Schoolwide Broadcast)",
        order: 3,
        unlockGrade: 12,
        type: "Schoolwide Social Attack / Buff",
        cost: "1 Aksi Khusus (1x per Long Rest)",
        range: "Megaphone / Speaker Sekolah",
        check: "Looks / Influence",
        effect: "Siaran langsung: pesan positif memulihkan 1d6 Composure ke kawan; pesan negatif memberi 1d6 Composure damage ke target. Di ruang mixer sentral: naik jadi 2d6!",
        desc: "Menyalakan mixer sentral sekolah dan menyiarkan pesan mengguncang ke seluruh penjuru kelas."
      }
    ]
  },
  {
    id: "literatur",
    name: "Literatur (Klub Sastra & Membaca)",
    tagline: "Kekuatan Kata Romantis, Sajak & Misteri Buku Lama",
    hitDie: "d6",
    primaryStat: "Intelligent / Mind",
    savingThrows: ["intelligent", "mind"],
    perkDesc: "Tempat persembunyian tenang di sudut perpustakaan, koleksi novel romansa klasik, kemampuan merangkai surat cinta mematikan.",
    subclasses: [
      {
        id: "novelist",
        name: "Penulis Puisi & Novel Romansa",
        tagline: "Penenun sajak kasmaran peluluh ketegaran batin sang pujaan hati.",
        identityDesc: "Romance specialist; merangkai kata puitis yang membuat target salah tingkah (Salting) serta menciptakan mahakarya bernilai Heart Inspiration.",
        desc: "Surat cinta dan aksi romansa berbasis Talent/Creative mendapat 1d4 bonus damage Composure.",
        subclassMoves: [
          {
            id: "novelist_g11_kata_pemikat",
            subclassId: "novelist",
            name: "Kata Pemikat",
            tier: "G11",
            unlockGrade: 11,
            type: "Romantic Lyric",
            cost: "1 Action (PBx per Long Rest)",
            range: "15 ft",
            check: "Talent / Creative vs Mind Save (DC 8+PB+Looks)",
            effect: "Advantage check Charm; target gagal Mind Save menerima 1d4 Composure damage (tersipu / Salting).",
            desc: "Membisikkan bait puisi romantis yang menusuk langsung ke relung hati target."
          },
          {
            id: "novelist_g12_magnum_opus",
            subclassId: "novelist",
            name: "Magnum Opus",
            tier: "G12",
            unlockGrade: 12,
            type: "Literary Masterpiece",
            cost: "1x per Long Rest",
            range: "Touch",
            check: "Talent / Creative",
            effect: "Tulis karya sastra romansa. Pemegangnya +3 pada 1 check sosial/romance, dan kamu atau penerimanya mendapat 1 Heart Inspiration.",
            desc: "Menuntaskan manuskrip prosa terindah yang memancarkan pesona asmara abadi."
          }
        ]
      },
      {
        id: "archivist",
        name: "Penjaga Arsip Sejarah Sekolah",
        tagline: "Penjaga dokumen terlarang dan rahasia kuno di balik dinding sekolah.",
        identityDesc: "Lore master & researcher; mengingat sejarah sekolah tanpa cela dan membuka arsip lama yang menyingkap misteri besar Seishun Academy.",
        desc: "Ahli sejarah dan dokumen. Advantage pada semua check Intelligent terkait sejarah, peraturan, atau informasi tertulis.",
        subclassMoves: [
          {
            id: "archivist_g11_arsip_hidup",
            subclassId: "archivist",
            name: "Arsip Hidup",
            tier: "G11",
            unlockGrade: 11,
            type: "Historical Recall",
            cost: "Pasif + 1x per Short Rest",
            range: "Self",
            check: "Intelligent / Academic",
            effect: "Advantage check Academic untuk sejarah sekolah dan bangunan; tanya DM 1 fakta sejarah sekolah dan jawabannya pasti benar.",
            desc: "Memanggil kembali baris-baris arsip tua dari perpustakaan yang tersimpan di ingatan."
          },
          {
            id: "archivist_g12_catatan_terlarang",
            subclassId: "archivist",
            name: "Catatan Terlarang",
            tier: "G12",
            unlockGrade: 12,
            type: "Secret Archives",
            cost: "10 Menit (1x per Long Rest)",
            range: "Self",
            check: "Intelligent / Academic",
            effect: "Akses arsip tersembunyi. DM memberi petunjuk penting misteri sekolah; kamu dan 1 sekutu Advantage pada check investigasi terkait selama 1 hari.",
            desc: "Membuka peti berkas terlarang di sudut ruang bawah tanah perpustakaan."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "literatur_move_2",
        name: "Membaca Pola Pikiran (Literary Empathy)",
        order: 1,
        unlockGrade: 10,
        type: "Psychological Insight",
        cost: "1 Action (At-Will)",
        range: "15 ft",
        check: "Mind / Interpersonal",
        effect: "Mengetahui satu keinginan terbesar atau rasa bersalah rahasia dari target yang sedang diajak bicara.",
        desc: "Menganalisis diksi kata dan intonasi lawan bicara layaknya membaca sudut pandang tokoh novel."
      },
      {
        id: "literatur_move_3",
        name: "Kutipan Menghancurkan (Devastating Quote)",
        order: 2,
        unlockGrade: 11,
        type: "Social Reaction Attack",
        cost: "1 Reaction / 1 Action (PBx per Short Rest)",
        range: "30 ft",
        check: "Auto-hit vs yang mendengar",
        effect: "Target menderita 1d4 + Mod Intelligent Composure Damage dan Disadvantage pada lemparan dadu berikutnya.",
        desc: "Mengutip bait sastra atau filsafat yang secara telak membantah argumen congkak lawan."
      },
      {
        id: "literatur_move_1",
        name: "Surat Cinta Puitis (Lethal Love Letter)",
        order: 3,
        unlockGrade: 12,
        type: "Romance Move",
        cost: "Dibuat saat Rest (1x per Long Rest)",
        range: "Loker Sepatu",
        check: "Talent / Creative vs Target Mind Save",
        effect: "Target kehilangan 2d6 Composure (syok kasmaran) dan Heart Meter gebetan naik +1 ♥.",
        desc: "Menyelipkan sepucuk surat wangi berhias kata-kata puitis mendalam di loker sepatu gebetan."
      }
    ]
  },
  {
    id: "band",
    name: "Band Musik (Gitar / Drum / Vokal / Keyboard)",
    tagline: "Dentuman Distorsi, Semangat Jiwa Muda & Fans Fanatik",
    hitDie: "d8",
    primaryStat: "Looks / Talent",
    savingThrows: ["looks", "talent"],
    perkDesc: "Studio musik kedap suara, instrumen musik andalan, ampli portabel, pick gitar jimat keberuntungan, dan basis penggemar.",
    subclasses: [
      {
        id: "lead_guitar",
        name: "Lead Guitarist / Soloist",
        tagline: "Petikan solo distorsi bertenaga yang mengguncang panggung festival.",
        identityDesc: "Sonic attacker & inspire; membakar semangat awal lewat riff pembuka dan membawakan solo gitar epik yang melumpuhkan pendengaran musuh.",
        desc: "Ahli solo gitar. Serangan Sonic berbasis Talent mendapat +1d6 damage dan bisa mempengaruhi area lebih luas.",
        subclassMoves: [
          {
            id: "lead_guitar_g11_riff_pembuka",
            subclassId: "lead_guitar",
            name: "Riff Pembuka",
            tier: "G11",
            unlockGrade: 11,
            type: "Solo Lead Buff",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Talent / Performance",
            effect: "Solo gitar singkat: dirimu +1d6 pada check Performance, dan sekutu yang mendengar +1 pada lemparan dadu pertama mereka.",
            desc: "Memetik riff melodi pembuka bernada tinggi yang membakar antusiasme panggung."
          },
          {
            id: "lead_guitar_g12_solo_legendaris",
            subclassId: "lead_guitar",
            name: "Solo Legendaris",
            tier: "G12",
            unlockGrade: 12,
            type: "Sonic Climax",
            cost: "1 Action (1x per Long Rest)",
            range: "Area 30 ft",
            check: "Physique Save (DC 8+PB+Talent)",
            effect: "Sekutu dalam 30 ft pulihkan 1d10 + Mod Talent Composure; musuh gagal save terkena status Dazed selama 1 ronde.",
            desc: "Mengeksekusi solo gitar meliuk-liuk spektakuler di tepi panggung yang memukau penonton."
          }
        ]
      },
      {
        id: "vocalist",
        name: "Vokalis Utama Karismatik",
        tagline: "Magnet panggung pemikat hati yang menghipnotis seisi auditorium.",
        identityDesc: "Charismatic crowd charmer; memikat perhatian lawan lewat suara emas dan memicu encore yang menghapus beban emosional kawan.",
        desc: "Ahli memikat hati penonton. Semua Social Moves dari vokalis memberikan Disadvantage pada Mental Saves target.",
        subclassMoves: [
          {
            id: "vocalist_g11_suara_memikat",
            subclassId: "vocalist",
            name: "Suara Memikat",
            tier: "G11",
            unlockGrade: 11,
            type: "Alluring Vocals",
            cost: "1 Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Target Mind Save (DC 8+PB+Looks)",
            effect: "Target gagal: 1d4 Composure damage (Salting/Fluster) & Disadvantage terhadapmu 1 ronde; kamu Advantage Charm saat bernyanyi.",
            desc: "Menyanyikan bait lagu romantis dengan tatapan mata terkunci ke arah target."
          },
          {
            id: "vocalist_g12_encore",
            subclassId: "vocalist",
            name: "Encore",
            tier: "G12",
            unlockGrade: 12,
            type: "Encore Revival",
            cost: "1 Reaction (1x per Long Rest)",
            range: "30 ft",
            check: "Otomatis",
            effect: "Sehabis adegan panggung sukses: kamu dapat 1 Heart Inspiration; sekutu memulihkan 1d6 Composure & menghapus 1 status negatif emosional.",
            desc: "Menyambut sorak penonton yang meminta lagu tambahan dengan senyum karismatik."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "band_move_1",
        name: "Petikan Melodi Penyelamat (Bardic Rock Riff)",
        order: 1,
        unlockGrade: 10,
        type: "Buff Move",
        cost: "1 Bonus Action (PBx per Long Rest)",
        range: "30 ft",
        check: "Talent / Performance",
        effect: "Memberikan 1d6 Inspiration Die ke kawan (dapat ditambahkan ke d20 roll berikutnya dalam 10 menit).",
        desc: "Memetik melodi gitar akustik atau bersenandung nada penyemangat yang membakar antusiasme kawan."
      },
      {
        id: "band_move_2",
        name: "Distorsi Pemecah Telinga (Sonic Screech)",
        order: 2,
        unlockGrade: 11,
        type: "AoE Sound Attack",
        cost: "1 Action",
        range: "Kerucut 15 ft",
        check: "Physique Save (DC 8+PB+Talent)",
        effect: "1d8 Suara/Mental Damage ke Composure & HP fisik; target gagal menderita status Deafened/Dazed 1 ronde.",
        desc: "Mendekatkan mikrofon ke speaker monitor hingga dengkingan feedback memekakkan telinga lawan."
      },
      {
        id: "band_move_3",
        name: "Penampilan Epik (Crowd Performance)",
        order: 3,
        unlockGrade: 12,
        type: "Mass Emotional Move",
        cost: "1 Menit (1x per Short Rest)",
        range: "Area Suara 30 ft",
        check: "Talent / Performance vs Mind Save",
        effect: "Seluruh target yang mendengar: musuh terdistraksi (-1d4 Composure) atau sekutu terinspirasi (+1d6 Composure).",
        desc: "Membawakan satu lagu spektakuler yang menggetarkan emosi semua orang yang hadir."
      }
    ]
  },
  {
    id: "painting",
    name: "Painting (Klub Seni Rupa & Desain)",
    tagline: "Goresan Kuas, Memori Visual Tajam & Estetika Warna",
    hitDie: "d6",
    primaryStat: "Talent / Intelligent",
    savingThrows: ["intelligent", "talent"],
    perkDesc: "Ruang seni penuh aroma cat minyak, kuas dan kanvas, celemek berlumur cat artistik, dan mata yang peka warna emosi.",
    subclasses: [
      {
        id: "portrait",
        name: "Pelukis Potret Realis",
        tagline: "Perekam memori visual tajam yang melukiskan rahasia ke dasar jiwa.",
        identityDesc: "Visual investigator; merekonstruksi wajah tersangka dari ingatan serta menghasilkan potret mendalam yang menyentuh emosi terdalam subjek.",
        desc: "Ahli memvisualisasikan seseorang dari ingatan. Advantage pada check yang membutuhkan deskripsi rupa atau pengenalan wajah.",
        subclassMoves: [
          {
            id: "portrait_g11_mata_pelukis",
            subclassId: "portrait",
            name: "Mata Pelukis",
            tier: "G11",
            unlockGrade: 11,
            type: "Passive Visual Scout",
            cost: "Pasif (PBx per Long Rest)",
            range: "Self",
            check: "Mind / Awareness",
            effect: "Advantage pada check Awareness mengenali wajah & detail; sketsa wajah dari ingatan memberi Advantage saat mencari target tersebut.",
            desc: "Ketajaman mata mengamati proporsi raut wajah dan gestur seseorang secara detail."
          },
          {
            id: "portrait_g12_potret_jiwa",
            subclassId: "portrait",
            name: "Potret Jiwa",
            tier: "G12",
            unlockGrade: 12,
            type: "Deep Portrait",
            cost: "10 Menit (1x per Long Rest)",
            range: "Touch",
            check: "Talent / Creative",
            effect: "Lukis seseorang: DM mengungkap emosi dominan dan keinginan terpendamnya; subjek yang melihatnya memulihkan 1d8 + Mod Talent Composure.",
            desc: "Menghasilkan lukisan potret ekspresif yang menembus topeng kepribadian subjek."
          }
        ]
      },
      {
        id: "designer",
        name: "Ilustrator Manga & Desain",
        tagline: "Kreator visual populer pengubah jalan cerita layaknya panel manga.",
        identityDesc: "Visual support & destiny manipulator; membuat ilustrasi pendorong moral dan memanipulasi hasil lemparan dadu seperti membalik adegan komik.",
        desc: "Ahli visual komunikasi. Bisa menciptakan publikasi, flyer, atau karikatur yang memberikan 1d6 bonus Influence di lingkungan sekolah.",
        subclassMoves: [
          {
            id: "designer_g11_sketsa_cepat",
            subclassId: "designer",
            name: "Sketsa Cepat",
            tier: "G11",
            unlockGrade: 11,
            type: "Manga Sticker Buff",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "Touch",
            check: "Talent / Creative",
            effect: "Buat poster/stiker chibi dalam 1 menit. Sekutu yang membawanya mendapat bonus +1d4 pada satu lemparan sosial hari itu.",
            desc: "Menggambar ilustrasi karakter lucu penyemangat di selembar kertas memo tempel."
          },
          {
            id: "designer_g12_panel_aksi",
            subclassId: "designer",
            name: "Panel Aksi",
            tier: "G12",
            unlockGrade: 12,
            type: "Destiny Manipulation",
            cost: "1 Reaction (1x per Long Rest)",
            range: "30 ft",
            check: "Otomatis",
            effect: "Ubah satu lemparan dadu (milikmu atau kawan yang terlihat) dengan bonus +1d8 atau penalti -1d8 sebagai efek dramatis panel manga.",
            desc: "Membayangkan adegan melambat layaknya transisi panel komik shonen dramatis."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "painting_move_2",
        name: "Cipratan Cat Distraksi (Paint Splatter Blind)",
        order: 1,
        unlockGrade: 10,
        type: "Attack / Combat Control",
        cost: "1 Action",
        range: "10 ft",
        check: "Physique/Agility Attack (+Mod TLN)",
        effect: "1d4 damage. Target kena melakukan Agility Save (DC 8+PB+Talent). Gagal: Blinded (bisa dibersihkan pakai 1 Action; di Kelas 11+ tambah 1d4 poison damage jika mengering).",
        desc: "Menyiramkan palet cat minyak basah pekat tepat ke arah kedua mata penyerang."
      },
      {
        id: "painting_move_1",
        name: "Sketsa Wajah Kilat (Photographic Sketch)",
        order: 2,
        unlockGrade: 11,
        type: "Visual Investigation",
        cost: "1 Menit (At-Will)",
        range: "Touch",
        check: "Talent / Creative",
        effect: "Menghasilkan potret visual presisi dari seseorang atau barang bukti yang hanya sempat dilihat sekilas.",
        desc: "Menggoreskan pensil 2B di buku sketsa dengan kecepatan tangan mengagumkan."
      },
      {
        id: "painting_move_3",
        name: "Karya Provokasi (Satirical Artwork)",
        order: 3,
        unlockGrade: 12,
        type: "Social Propaganda",
        cost: "1 Jam Persiapan",
        range: "Area Sekolah",
        check: "Talent / Creative vs Looks Save",
        effect: "Poster karikatur mading memicu buah bibir; target kehilangan 1d4 Composure setiap kali murid lain menertawakan gambar tersebut selama 1 hari.",
        desc: "Membuat karikatur atau poster satire yang dipasang diam-diam di majalah dinding sekolah."
      }
    ]
  },
  {
    id: "photography",
    name: "Photography (Klub Fotografi)",
    tagline: "Lensa Telefoto, Sudut Pandang Rahasia & Momen Emas Tak Terlupakan",
    hitDie: "d6",
    primaryStat: "Intelligent / Talent",
    savingThrows: ["intelligent", "talent"],
    perkDesc: "Kunci akses ruang gelap cuci foto, kamera DSLR/mirrorless pinjaman sekolah, kartu pers fotografer sekolah, dan sudut pandang tajam menangkap momen rahasia murid lain.",
    subclasses: [
      {
        id: "paparazzi",
        name: "Fotografer Investigasi / Paparazzi",
        tagline: "Pengintai lensa telefoto senyap pengumpul bukti tak terbantahkan.",
        identityDesc: "Stealth scout & tracker; memotret target tanpa terdeteksi untuk mendapatkan kebenaran dan melacak jejak orang di lingkungan sekolah.",
        desc: "Spesialis foto sembunyi-sembunyi. Advantage pada check saat mengambil foto atau mengamati target tanpa disadari.",
        subclassMoves: [
          {
            id: "paparazzi_g11_bukti_foto",
            subclassId: "paparazzi",
            name: "Bukti Foto",
            tier: "G11",
            unlockGrade: 11,
            type: "Photo Evidence",
            cost: "1 Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Intelligent / Street",
            effect: "Ambil foto adegan/orang. Saat ditinjau, DM memberikan 1 petunjuk akurat; menunjukkan foto memberi Advantage pada check Influence terkait.",
            desc: "Menekan shutter diam-diam dari sudut lorong untuk mengabadikan bukti krusial."
          },
          {
            id: "paparazzi_g12_mata_elang",
            subclassId: "paparazzi",
            name: "Mata Elang",
            tier: "G12",
            unlockGrade: 12,
            type: "Telephoto Vision",
            cost: "1 Bonus Action (1x per Long Rest)",
            range: "60 ft",
            check: "Mind / Awareness",
            effect: "Selama 10 menit, lensa telefoto mendeteksi semua yang bersembunyi (Hidden) dalam 60 ft, dan mengetahui posisi target yang pernah difoto di sekolah.",
            desc: "Memutar zoom optik telefoto untuk memindai setiap sudut halaman sekolah."
          }
        ]
      },
      {
        id: "portraitist",
        name: "Fotografer Artistik / Potret",
        tagline: "Pengabadikan estetika masa muda penenun kenangan abadi romansa.",
        identityDesc: "Aesthetic enhancer & keepsake maker; mengatur pencahayaan terbaik untuk mendongkrak pesona kawan serta mencetak foto keepsake pembangkit inspirasi.",
        desc: "Spesialis potret estetika dan menangkap emosi wajah. Foto potret yang kamu berikan ke teman memulihkan 1d4 Composure atau menambah +1 Heart Meter.",
        subclassMoves: [
          {
            id: "portraitist_g11_pencahayaan_sempurna",
            subclassId: "portraitist",
            name: "Pencahayaan Sempurna",
            tier: "G11",
            unlockGrade: 11,
            type: "Aesthetic Focus",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "15 ft",
            check: "Looks / Charm",
            effect: "Subjek yang difoto menerima bonus +2 pada seluruh check Looks hingga akhir adegan.",
            desc: "Mengatur reflektor dan arah cahaya alami agar potret kawan tampak bercahaya memikat."
          },
          {
            id: "portraitist_g12_momen_abadi",
            subclassId: "portraitist",
            name: "Momen Abadi",
            tier: "G12",
            unlockGrade: 12,
            type: "Keepsake Creation",
            cost: "1x per Long Rest",
            range: "Touch",
            check: "Talent / Creative",
            effect: "Cetak foto momen penting menjadi keepsake. Pemegangnya mendapat 1 Heart Inspiration dan Advantage melawan efek Salting/Fluster momen itu.",
            desc: "Mencetak selembar foto polaroid hangat yang mengabadikan ikatan persahabatan murni."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "photography_move_1",
        name: "Jepretan Kilat Flash (Flash Stun)",
        order: 1,
        unlockGrade: 10,
        type: "Combat Control Move",
        cost: "1 Action",
        range: "15 ft",
        check: "Intelligent / Academic vs Mind Save (DC 8+PB+INT)",
        effect: "Target mengalami 1d4 Composure damage dan terkena status Disadvantage pada aksi berikutnya karena silau lampu kilat.",
        desc: "Menodongkan lampu kilat kamera tepat ke wajah lawan lalu menekan tombol shutter seketika."
      },
      {
        id: "photography_move_3",
        name: "Membekukan Momen (Candid Shutter)",
        order: 2,
        unlockGrade: 11,
        type: "Tactical & Romance Shutter",
        cost: "1 Bonus Action",
        range: "30 ft",
        check: "Talent / Creative",
        effect: "Menangkap ekspresi jujur atau kelemahan target dari jauh; sekutu mendapat Advantage pada check sosial atau serangan berikutnya ke target.",
        desc: "Membidik lensa telefoto secara tenang di waktu yang tepat saat target sedang melamun atau tidak waspada."
      },
      {
        id: "photography_move_2",
        name: "Bukti Foto Kompromatis (Compromising Photo)",
        order: 3,
        unlockGrade: 12,
        type: "Social Leverage",
        cost: "1 Action",
        range: "30 ft",
        check: "Intelligent / Street vs Mind Save",
        effect: "Target kehilangan 1d8 Composure dan ragu melanjutkan perdebatan karena rahasianya terancam terekspos.",
        desc: "Memamerkan hasil jepretan candid di layar kamera yang membuat lawan gelagapan dan salah tingkah."
      }
    ]
  },
  {
    id: "cooking",
    name: "Cooking (Klub Memasak & Kuliner)",
    tagline: "Aroma Bento Hangat, Manisnya Cokelat Cinta & Rasa yang Memikat Hati",
    hitDie: "d8",
    primaryStat: "Intelligent / Looks",
    savingThrows: ["intelligent", "looks"],
    perkDesc: "Kunci akses ruang dapur sekolah (Home Ec) berfasilitas lengkap, celemek khusus, pisau dapur tajam, bumbu rempah rahasia, serta kemampuan membuat hidangan yang meluluhkan hati siapapun.",
    subclasses: [
      {
        id: "patissier",
        name: "Pâtissier / Pembuat Manisan & Cokelat",
        tagline: "Pencipta manisan manis pelipur lara dan pelunak sikap keras hati.",
        identityDesc: "Social confectioner; menyajikan pastry yang memberi Temporary Composure dan cokelat cinta yang meningkatkan relasi NPC secara instan.",
        desc: "Spesialis kue dan hidangan penutup romantis. Cokelat atau kue buatan sendiri memberikan bonus +2 pada Social Check romansa.",
        subclassMoves: [
          {
            id: "patissier_g11_manisan_penyemangat",
            subclassId: "patissier",
            name: "Manisan Penyemangat",
            tier: "G11",
            unlockGrade: 11,
            type: "Confectionery Morale",
            cost: "10 Menit (PBx per Long Rest)",
            range: "Touch (s.d. 4 orang)",
            check: "Otomatis",
            effect: "Hidangkan kue manisan untuk s.d. 4 orang. Mereka menerima Temp Composure sebesar 1d6 + Mod Talent.",
            desc: "Membagikan macaron atau kue sus buatan sendiri yang langsung mengusir rasa penat."
          },
          {
            id: "patissier_g12_cokelat_pembuka_hati",
            subclassId: "patissier",
            name: "Cokelat Pembuka Hati",
            tier: "G12",
            unlockGrade: 12,
            type: "Heart Chocolate",
            cost: "1x per Long Rest",
            range: "Touch",
            check: "Looks / Charm",
            effect: "Penerima manisan memulihkan 1d10 + Mod Talent Composure. Jika diberikan ke NPC, sikap keramahannya naik satu tingkat lebih bersahabat (DM).",
            desc: "Menyodorkan kotak cokelat handmade berpita manis yang meluluhkan sikap dingin siapa saja."
          }
        ]
      },
      {
        id: "gourmet_chef",
        name: "Koki Masakan Hangat / Bento Master",
        tagline: "Penyaji bekal bento penuh energi dan santapan keluarga pemulih raga.",
        identityDesc: "Nutrition buffer & sustenance master; menyiapkan bekal bergizi penambah keberuntungan dan jamuan makan bersama penangkal lelah.",
        desc: "Spesialis nutrisi dan stamina. Masakanmu memulihkan ekstra HP saat istirahat dan menangkal kelelahan.",
        subclassMoves: [
          {
            id: "gourmet_chef_g11_bento_bekal",
            subclassId: "gourmet_chef",
            name: "Bento Bekal",
            tier: "G11",
            unlockGrade: 11,
            type: "Nutritious Lunchbox",
            cost: "Saat Short Rest (PBx per Long Rest)",
            range: "Touch",
            check: "Otomatis",
            effect: "Siapkan bento: penerima mendapat +1d4 pada 1 check hari itu dan memulihkan 1d6 Physical HP.",
            desc: "Menata kotak bekal berisi tamagoyaki gurih dan sosis potong rapi untuk kawan."
          },
          {
            id: "gourmet_chef_g12_masakan_rumah",
            subclassId: "gourmet_chef",
            name: "Masakan Rumah",
            tier: "G12",
            unlockGrade: 12,
            type: "Family Feast",
            cost: "1x per Long Rest (Sebelum Istirahat)",
            range: "Touch (Kelompok)",
            check: "Otomatis",
            effect: "Semua yang makan bersama mendapat Temp HP & Temp Composure sebesar PB, Advantage melawan Fatigue, dan 1 Rest Dice ekstra.",
            desc: "Memasak hidangan sup miso hangat dan lauk porsi besar untuk dinikmati seluruh anggota tim."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "cooking_move_3",
        name: "Camilan Penambah Tenaga (Snack Energy Boost)",
        order: 1,
        unlockGrade: 10,
        type: "Field Morale Boost",
        cost: "1 Bonus Action (Touch)",
        range: "Touch",
        check: "Otomatis",
        effect: "Menyuapkan kue kering darurat ke sekutu; sekutu memulihkan 1d4 Composure dan mendapat Advantage pada Saving Throw berikutnya.",
        desc: "Menyelipkan sepotong kue kering manis buatan sendiri saat teman sedang kehabisan energi atau putus asa."
      },
      {
        id: "cooking_move_2",
        name: "Aroma Penggugah Selera (Irresistible Aroma)",
        order: 2,
        unlockGrade: 11,
        type: "Social Distraction",
        cost: "1 Action",
        range: "30 ft",
        check: "Looks / Charm vs Target Mind Save",
        effect: "Mengalihkan perhatian semua target lapar di sekitar; target terdistraksi dan tidak bisa mengambil aksi agresif selama 1 giliran.",
        desc: "Membuka tutup wadah makanan hangat yang aromanya langsung menguasai seluruh lorong kelas."
      },
      {
        id: "cooking_move_1",
        name: "Bento Kasih Sayang (Handmade Bento)",
        order: 3,
        unlockGrade: 12,
        type: "Heartwarming Culinary",
        cost: "Dibuat saat Istirahat (Touch)",
        range: "Touch",
        check: "Intelligent / Academic atau Looks / Charm",
        effect: "Target yang memakan bento memulihkan 1d8 HP fisik / Composure dan Heart Meter bertambah +1 ♥ jika diberikan kepada target gebetan.",
        desc: "Menyusun nasi kepal, tamagoyaki manis, dan sosis gurita lucu dengan sepenuh perasaan hati."
      }
    ]
  },
  {
    id: "occult",
    name: "Occult (Klub Okultisme & Misteri Gaib)",
    tagline: "Kartu Tarot Takdir, Lilin Hitam Aromaterapi & Misteri Tujuh Keajaiban Sekolah",
    hitDie: "d6",
    primaryStat: "Mind / Luck",
    savingThrows: ["mind", "luck"],
    perkDesc: "Ruang klub temaram di lantai 1 dengan aroma dupa mistis, set kartu tarot kuno, bola kristal, papan ouija, dan kepekaan luar biasa membaca firasat takdir serta legenda urban sekolah.",
    subclasses: [
      {
        id: "tarot_reader",
        name: "Peramal Nasib / Tarot Diviner",
        tagline: "Pembaca kartu takdir roda nasib pengutak-atik garis probabilitas semesta.",
        identityDesc: "Fate manipulator; membuka kartu tarot untuk mengintervensi hasil d20 dan memprediksi marabahaya masa depan.",
        desc: "Spesialis membaca kartu masa depan dan ramalan asmara. Sekali per istirahat, dapat meramal takdir seseorang untuk memberikan Advantage pada aksi penting.",
        subclassMoves: [
          {
            id: "tarot_reader_g11_takdir_terbuka",
            subclassId: "tarot_reader",
            name: "Takdir Terbuka",
            tier: "G11",
            unlockGrade: 11,
            type: "Fate Intervention",
            cost: "1 Reaction (PBx per Long Rest)",
            range: "30 ft",
            check: "Otomatis",
            effect: "Ubah 1 lemparan dadu d20 yang terlihat (milikmu, sekutu, atau musuh) dengan bonus +1d4 atau penalti -1d4.",
            desc: "Membalik kartu tarot The Wheel of Fortune di meja untuk membelokkan probabilitas nasib."
          },
          {
            id: "tarot_reader_g12_ramalan_besar",
            subclassId: "tarot_reader",
            name: "Ramalan Besar",
            tier: "G12",
            unlockGrade: 12,
            type: "Grand Divination",
            cost: "10 Menit (1x per Long Rest, DM)",
            range: "15 ft",
            check: "Mind / Awareness (DC 12)",
            effect: "DM mengungkap 1 ancaman atau kejadian penting yang akan terjadi hari itu; sekutu dalam 15 ft mendapat Advantage pada roll terkait.",
            desc: "Menyusun formasi 10 kartu Celtic Cross di bawah keremangan lilin untuk membaca masa depan sekolah."
          }
        ]
      },
      {
        id: "paranormal_investigator",
        name: "Peneliti Tujuh Misteri Sekolah",
        tagline: "Penyelidik legenda urban sekolah dan pelindung dari teror tak kasat mata.",
        identityDesc: "Mystery detective & warder; mendeteksi jejak anomali supernatural serta memasang segel spiritual yang membentengi kawan dari rasa takut.",
        desc: "Spesialis kutukan dan atmosfer horor. Kebal terhadap rasa takut/Intimidasi lawan dan peka terhadap rahasia masa lalu sekolah.",
        subclassMoves: [
          {
            id: "paranormal_investigator_g11_catatan_misteri",
            subclassId: "paranormal_investigator",
            name: "Catatan Misteri",
            tier: "G11",
            unlockGrade: 11,
            type: "Supernatural Sense",
            cost: "Pasif + PBx per Long Rest",
            range: "Self",
            check: "Mind / Awareness",
            effect: "Advantage pada check Awareness & Academic untuk anomali supernatural; bertanya ke DM apakah ada entitas/tanda gaib di ruangan itu.",
            desc: "Mengecek catatan legenda urban sekolah dan mengukur fluktuasi medan hawa dingin."
          },
          {
            id: "paranormal_investigator_g12_segel_pelindung",
            subclassId: "paranormal_investigator",
            name: "Segel Pelindung",
            tier: "G12",
            unlockGrade: 12,
            type: "Purifying Ward",
            cost: "1 Action (1x per Long Rest)",
            range: "Area 15 ft",
            check: "Luck / Situation Luck",
            effect: "Taburkan garis garam/jimat: sekutu dalam 15 ft Advantage pada save mental supernatural dan kebal rasa takut gaib selama 1 jam.",
            desc: "Menancapkan kertas jimat ofuda di empat penjuru ruangan untuk membentuk batas sakral pelindung."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "occult_move_1",
        name: "Ramalan Kartu Tarot (Tarot Reading)",
        order: 1,
        unlockGrade: 10,
        type: "Utility / Buff",
        cost: "1 Action",
        range: "15 ft",
        check: "Mind / Awareness vs DC 12",
        effect: "Hasil sukses memberikan 1d6 Fated Die yang dapat ditambahkan ke d20 roll apapun milik sekutu dalam sesi ini.",
        desc: "Membuka kartu tarot bergambar Wheel of Fortune atau Lovers dengan tatapan mata misterius."
      },
      {
        id: "occult_move_2",
        name: "Aura Kutukan Menyeramkan (Eerie Curse)",
        order: 2,
        unlockGrade: 11,
        type: "Social Attack",
        cost: "1 Action",
        range: "30 ft",
        check: "Mind / Emotional vs Target Mind Save",
        effect: "Target kehilangan 1d8 Composure dan merasa dihantui nasib buruk (Disadvantage pada 1 roll berikutnya).",
        desc: "Mengarahkan jimat atau lilin menyala ke arah target sambil melafalkan bisikan misterius yang membuat bulu kuduk merinding."
      },
      {
        id: "occult_move_3",
        name: "Kertas Jimat Pengusir Kesialan (Purifying Ward)",
        order: 3,
        unlockGrade: 12,
        type: "Reaction Defense",
        cost: "1 Reaction",
        range: "Self / 15 ft",
        check: "Luck / Situation Luck",
        effect: "Menempelkan kertas jimat penangkal bala untuk membatalkan kegagalan kritis atau menyerap 1d6 damage mental/sosial.",
        desc: "Mengibaskan kertas ofuda bertuliskan aksara kanji kuno tepat saat malapetaka hendak terjadi."
      }
    ]
  },
  {
    id: "gaming",
    name: "Gaming (Klub Video Game & Esports)",
    tagline: "Refleks Tombol Kilat, Analisis Frame Data & Strategi Kemenangan Tanpa Cela",
    hitDie: "d8",
    primaryStat: "Intelligent / Talent",
    savingThrows: ["intelligent", "talent"],
    perkDesc: "Ruang klub penuh konsol retro dan monitor gaming refresh-rate tinggi, game portabel di saku, kelenturan refleks jari, dan ketajaman menganalisis pola perilaku lawan.",
    subclasses: [
      {
        id: "fighting_gamer",
        name: "Master Game Pertarungan / FGC Pro",
        tagline: "Penguasa kecepatan frame-data dan serangan pembalik keadaan turnamen.",
        identityDesc: "Counter-attacker & burst finisher; menepis serangan dengan timing presisi lalu membalas seketika, serta melepaskan jurus pamungkas saat bar meter penuh.",
        desc: "Spesialis refleks kilat dan combo. Mendapatkan Advantage pada check inisiatif reaksi cepat.",
        subclassMoves: [
          {
            id: "fighting_gamer_g11_frame_perfect",
            subclassId: "fighting_gamer",
            name: "Frame-Perfect",
            tier: "G11",
            unlockGrade: 11,
            type: "Parry Counter",
            cost: "1 Reaction (PBx per Long Rest)",
            range: "Self",
            check: "Physique / Agility",
            effect: "+3 Physical AC terhadap 1 serangan. Jika meleset, serang balik dengan serangan tangan kosong/senjata (1d6 + Mod Physique).",
            desc: "Menghitung celah frame serangan musuh di sepersekian detik terakhir lalu melancarkan counter hit."
          },
          {
            id: "fighting_gamer_g12_super_meter",
            subclassId: "fighting_gamer",
            name: "Super Meter",
            tier: "G12",
            unlockGrade: 12,
            type: "Super Combo Finisher",
            cost: "1 Bonus Action (1x per Long Rest)",
            range: "Melee (5 ft)",
            check: "Physique / Agility Attack",
            effect: "Setelah memberi/menerima total 3 hit dalam satu combat, lepaskan jurus super: 4d6 + Mod Talent damage dan target Dazed.",
            desc: "Menguras bar meter energi penuh untuk melancarkan kombo sinematik penutup ronde."
          }
        ]
      },
      {
        id: "strategist",
        name: "Ahli Strategi & RPG / Theorycrafter",
        tagline: "Pembedah kelemahan statistik dan perusak meta pertahanan lawan.",
        identityDesc: "Tactical debuffer & tactician; membongkar data armor dan kelemahan musuh agar rekan tim dapat melancarkan serangan berdaya rusak maksimal.",
        desc: "Spesialis kalkulasi pola dan resource. Bisa memprediksi pergerakan lawan 1 giliran ke depan.",
        subclassMoves: [
          {
            id: "strategist_g11_analisis_minmax",
            subclassId: "strategist",
            name: "Analisis Min-Max",
            tier: "G11",
            unlockGrade: 11,
            type: "Tactical Assessment",
            cost: "1 Bonus Action (PBx per Long Rest)",
            range: "30 ft",
            check: "Intelligent / Academic",
            effect: "Analisis 1 lawan: DM menyebutkan AC, kelemahan, dan resistensinya; kawan mendapat +1d4 damage ke target tersebut hingga akhir adegan.",
            desc: "Memindai statistik perlengkapan dan kebiasaan gerak musuh layaknya membaca wiki game."
          },
          {
            id: "strategist_g12_meta_breaker",
            subclassId: "strategist",
            name: "Meta Breaker",
            tier: "G12",
            unlockGrade: 12,
            type: "Meta Disruption",
            cost: "1 Action (1x per Long Rest)",
            range: "30 ft",
            check: "Intelligent / Academic",
            effect: "Terhadap target yang telah dianalisis: semua serangan kawan mendapat +2 to hit dan target Disadvantage pada saving throw pertamanya selama 1 menit.",
            desc: "Mengeksploitasi celah algoritma taktik lawan yang meruntuhkan seluruh skema pertahanannya."
          }
        ]
      }
    ],
    clubMoves: [
      {
        id: "gaming_move_2",
        name: "Provokasi Tombol Taunt (Taunt to Tilt)",
        order: 1,
        unlockGrade: 10,
        type: "Social Attack",
        cost: "1 Bonus Action",
        range: "30 ft",
        check: "Talent / Performance vs Target Mind Save",
        effect: "Target menderita 1d6 Composure damage dan terprovokasi (harus mengarahkan serangan ke dirimu di giliran berikutnya).",
        desc: "Melakukan gerakan jempol ke bawah atau pose taunt virtual yang langsung memancing emosi ('tilt') lawan."
      },
      {
        id: "gaming_move_1",
        name: "Tangkisan Frame Sempurna (Frame Perfect Parry)",
        order: 2,
        unlockGrade: 11,
        type: "Reaction Defense",
        cost: "1 Reaction",
        range: "Self",
        check: "Physique / Agility vs Attack",
        effect: "Menghitung timing serangan lawan dengan presisi frame; mengurangi damage serangan fisik/sosial sebesar 1d8 + Mod Agility.",
        desc: "Mengelak atau menepis serangan pada sepersekian detik terakhir layaknya mengeksekusi just-frame parry di turnamen."
      },
      {
        id: "gaming_move_3",
        name: "Rute Cepat Speedrun (Speedrun Routing)",
        order: 3,
        unlockGrade: 12,
        type: "Utility Move",
        cost: "1 Action",
        range: "Self / Sekutu",
        check: "Intelligent / Academic",
        effect: "Menemukan celah atau rute tercepat melewati rintangan / teka-teki sekolah dalam separuh waktu normal tanpa memicu jebakan.",
        desc: "Membedah denah dan aturan sekolah seperti mencari sequence break dan glitch jalur tercepat."
      }
    ]
  }
];

export function generateFallbackCompendiumJs() {
  const filePath = path.resolve("./src/data/fallbackCompendium.ts");
  const content = fs.readFileSync(filePath, "utf-8");

  // Find ekskul array start
  const ekskulStartMarker = '"ekskul": [';
  const startIdx = content.indexOf(ekskulStartMarker);
  if (startIdx === -1) throw new Error("Could not find ekskul array in fallbackCompendium.ts");

  // Find archetypes start marker
  const archetypesMarker = '"archetypes": [';
  const endIdx = content.indexOf(archetypesMarker);
  if (endIdx === -1) throw new Error("Could not find archetypes array in fallbackCompendium.ts");

  const ekskulJson = JSON.stringify(EKSKUL_PROGRESSION_DATA, null, 4);

  const updatedContent =
    content.substring(0, startIdx + ekskulStartMarker.length) +
    "\n" +
    ekskulJson.substring(1, ekskulJson.length - 1).trim() +
    "\n  ],\n  " +
    content.substring(endIdx);

  fs.writeFileSync(filePath, updatedContent, "utf-8");
  console.log("fallbackCompendium.ts updated successfully with 16 ekskuls, 32 subclasses, 48 club moves, and 64 subclass moves!");
}

export function generateSqlMigration() {
  const migrationPath = path.resolve("./supabase/migrations/20261008000001_subclass_moves_and_progression.sql");
  
  let sql = `-- ============================================================================
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
`;

  EKSKUL_PROGRESSION_DATA.forEach(e => {
    e.clubMoves.forEach(m => {
      const escape = (str) => (str ? str.replace(/'/g, "''") : "");
      sql += `INSERT INTO public.ekskul_moves (id, ekskul_id, name, move_type, cost, range, check_type, effect, description, order_index, unlock_grade)
VALUES ('${m.id}', '${e.id}', '${escape(m.name)}', '${escape(m.type)}', '${escape(m.cost)}', '${escape(m.range)}', '${escape(m.check)}', '${escape(m.effect)}', '${escape(m.desc)}', ${m.order}, ${m.unlockGrade})
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
`;
    });
  });

  sql += `\n-- 6. Seed / Upsert Subclasses with tagline & identity_desc\n`;
  EKSKUL_PROGRESSION_DATA.forEach(e => {
    e.subclasses.forEach(sc => {
      const escape = (str) => (str ? str.replace(/'/g, "''") : "");
      sql += `INSERT INTO public.ekskul_subclasses (id, ekskul_id, name, tagline, identity_desc, description)
VALUES ('${sc.id}', '${e.id}', '${escape(sc.name)}', '${escape(sc.tagline)}', '${escape(sc.identityDesc)}', '${escape(sc.desc)}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  identity_desc = EXCLUDED.identity_desc,
  description = EXCLUDED.description;
`;
    });
  });

  sql += `\n-- 7. Seed / Upsert 64 Subclass Moves (G11 & G12)\n`;
  EKSKUL_PROGRESSION_DATA.forEach(e => {
    e.subclasses.forEach(sc => {
      sc.subclassMoves.forEach(sm => {
        const escape = (str) => (str ? str.replace(/'/g, "''") : "");
        sql += `INSERT INTO public.subclass_moves (id, subclass_id, name, tier, unlock_grade, move_type, cost, range, check_type, effect, description)
VALUES ('${sm.id}', '${sc.id}', '${escape(sm.name)}', '${sm.tier}', ${sm.unlockGrade}, '${escape(sm.type)}', '${escape(sm.cost)}', '${escape(sm.range)}', '${escape(sm.check)}', '${escape(sm.effect)}', '${escape(sm.desc)}')
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
`;
      });
    });
  });

  fs.writeFileSync(migrationPath, sql, "utf-8");
  console.log("Migration 20261008000001_subclass_moves_and_progression.sql written successfully!");
}

if (process.argv[1] === import.meta.filename) {
  generateFallbackCompendiumJs();
  generateSqlMigration();
}
