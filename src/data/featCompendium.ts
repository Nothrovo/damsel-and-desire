import type { FeatDefinition } from "../types";

export const ALL_FEATS: FeatDefinition[] = [
  // =========================================================================
  // ORIGIN FEATS (20) — KHUSUS KELAS 10
  // =========================================================================
  {
    id: "multitalent",
    name: "Multitalent",
    category: "origin",
    description: "Pilih 2 dan Proficient pada Skill Intelligent atau Talent.",
    choices: {
      type: "skill",
      count: 2,
      pool: ["academic", "people", "street", "creative", "performance", "adaptability"],
      description: "Pilih 2 skill dari rumpun Intelligent atau Talent (kombinasi 2-0, 1-1, atau 0-2)"
    },
    repeatable: false,
    tags: ["skill", "origin"]
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    category: "origin",
    description: "Proficient pada Skill People atau Interpersonal. Tidak bisa memberikan impresi pertama yang buruk.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["people", "interpersonal"],
      description: "Pilih 1 skill antara People atau Interpersonal"
    },
    manualEffectText: "Tidak bisa memberikan impresi pertama yang buruk dalam interaksi sosial.",
    repeatable: false,
    tags: ["social", "origin"]
  },
  {
    id: "gym_bro",
    name: "Gym Bro",
    category: "origin",
    description: "Proficient pada 1 Skill Physique. +(Proficiency Bonus) Temporary HP setelah melakukan Long Rest.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["power", "agility", "stamina"],
      description: "Pilih 1 skill dari rumpun Physique"
    },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Dapatkan Temporary HP sebesar Proficiency Bonus setelah menyelesaikan Long Rest"
    },
    repeatable: false,
    tags: ["physique", "hp", "origin"]
  },
  {
    id: "teachers_pet",
    name: "Teacher’s Pet",
    category: "origin",
    description: "Advantage Influence Check ke OSIS/guru/staf sekolah. 1 x / day bisa meminta izin khusus (surat jalan, akses ruang terkunci, atau pengampunan poin pelanggaran) dari guru tanpa roll.",
    manualEffectText: "Advantage Influence Check ke figur sekolah (OSIS, guru, staf). 1x/hari meminta izin khusus resmi tanpa perlu lempar dadu.",
    usage: {
      type: "long_rest",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per hari meminta izin khusus dari guru tanpa roll"
    },
    repeatable: false,
    tags: ["school", "influence", "origin"]
  },
  {
    id: "night_owl",
    name: "Night Owl",
    category: "origin",
    description: "Resistance terhadap efek Fatigue karena begadang, +5 semua Skill Check ketika di malam hari, -5 semua Skill Check di Jam pelajaran pertama.",
    manualEffectText: "Resistance terhadap efek Fatigue begadang. +5 semua Skill Check di malam hari, -5 semua Skill Check di jam pelajaran pertama.",
    repeatable: false,
    tags: ["lifestyle", "origin"]
  },
  {
    id: "hot_headed",
    name: "Hot Headed",
    category: "origin",
    description: "Proficient Power, Proficiency Bonus x / Combat, saat menerima damage fisik dari lawan berjarak 5 ft, Reaction: Menyerang lawan yang sama dengan serangan jarak dekat.",
    effects: {
      skillsGranted: ["power"]
    },
    manualEffectText: "Reaction: Menyerang balik lawan dengan serangan jarak dekat saat menerima damage fisik berjarak 5 ft.",
    usage: {
      type: "combat",
      countFormula: "pb",
      description: "Proficiency Bonus x per Combat Reaction serangan balasan melee"
    },
    repeatable: false,
    tags: ["combat", "reaction", "origin"]
  },
  {
    id: "hustler",
    name: "Hustler",
    category: "origin",
    description: "Proficient Skill Street, tidak bisa diberi status Disadvantage tiap Street Check dan dapat tambahan 1/2 uang saku / day.",
    effects: {
      skillsGranted: ["street"]
    },
    manualEffectText: "Imun terhadap status Disadvantage tiap Street Check. Tambahan +50% uang saku harian disetor saat Long Rest.",
    repeatable: false,
    tags: ["money", "street", "origin"]
  },
  {
    id: "foodie",
    name: "Foodie",
    category: "origin",
    description: "Proficient Creative, Advantage (Skill Check untuk) memasak. Siapapun yang memakan masakan anda memulihkan 1d6 Composure.",
    effects: {
      skillsGranted: ["creative"]
    },
    manualEffectText: "Advantage check memasak (Creative). Siapa pun yang memakan masakan Anda memulihkan 1d6 Composure.",
    repeatable: false,
    tags: ["culinary", "healing", "origin"]
  },
  {
    id: "loner",
    name: "Loner",
    category: "origin",
    description: "Proficient Skill Awareness, +2 AC Physical dan Sosial ketika tidak ada orang selain anda dan diri sendiri dalam 15 ft.",
    effects: {
      skillsGranted: ["awareness"]
    },
    manualEffectText: "+2 AC Physical dan Sosial ketika tidak ada orang selain diri sendiri dalam radius 15 ft.",
    repeatable: false,
    tags: ["defense", "ac", "origin"]
  },
  {
    id: "drama_queen",
    name: "Drama Queen",
    category: "origin",
    description: "Proficient 1 Skill dari Looks atau Talent. 1 × / Long Rest Reaction: untuk memulihkan Composure sepenuhnya saat Composure menyentuh 0 atau saat menerima damage Composure > 50% Composure maksimal.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["charm", "influence", "aura", "creative", "performance", "adaptability"],
      description: "Pilih 1 skill dari rumpun Looks atau Talent"
    },
    manualEffectText: "Reaction: Memulihkan Composure sepenuhnya saat Composure menyentuh 0 atau menerima damage Composure > 50% Composure maksimal.",
    usage: {
      type: "long_rest",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per Long Rest memulihkan Composure penuh secara dramatis"
    },
    repeatable: false,
    tags: ["composure", "reaction", "origin"]
  },
  {
    id: "parkour_kid",
    name: "Parkour Kid",
    category: "origin",
    description: "Proficient Skill Agility. Resistance terhadap damage jatuh, dan immune damage Composure saat jatuh.",
    effects: {
      skillsGranted: ["agility"]
    },
    manualEffectText: "Resistance terhadap damage fisik akibat jatuh, dan kebal dari damage Composure akibat jatuh.",
    repeatable: false,
    tags: ["mobility", "agility", "origin"]
  },
  {
    id: "alpha_wolf",
    name: "Alpha Wolf",
    category: "origin",
    description: "Proficient Skill Aura. Memberikan diri sendiri dan sekutu ketika sekutu dalam jarak 10 ft +(Jumlah Level) bonus terhadap Aura Check.",
    effects: {
      skillsGranted: ["aura"]
    },
    manualEffectText: "Memberikan diri sendiri dan sekutu dalam jarak 10 ft bonus +(Level Karakter) terhadap seluruh Aura Check.",
    repeatable: false,
    tags: ["aura", "leadership", "origin"]
  },
  {
    id: "overthinker",
    name: "Overthinker",
    category: "origin",
    description: "Proficient Skill Awareness atau Academic. +2 Passive Perception dan Passive Investigation.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["awareness", "academic"],
      description: "Pilih 1 skill antara Awareness atau Academic"
    },
    effects: {
      flatPassivePerception: 2,
      flatPassiveInvestigation: 2
    },
    repeatable: false,
    tags: ["passive", "perception", "investigation", "origin"]
  },
  {
    id: "early_bird",
    name: "Early Bird",
    category: "origin",
    description: "Proficient Skill Stamina atau Awareness. Dapat Temporary Composure sebesar Proficiency Bonus/Day.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["stamina", "awareness"],
      description: "Pilih 1 skill antara Stamina atau Awareness"
    },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Mendapatkan Temporary Composure sebesar Proficiency Bonus setelah Long Rest"
    },
    repeatable: false,
    tags: ["composure", "origin"]
  },
  {
    id: "strict_parents",
    name: "Strict Parents",
    category: "origin",
    description: "Proficient Skill Academic atau Emotional. Advantage Save tekanan dari figur otoritas (cth: guru, staf sekolah, polisi).",
    choices: {
      type: "skill",
      count: 1,
      pool: ["academic", "emotional"],
      description: "Pilih 1 skill antara Academic atau Emotional"
    },
    manualEffectText: "Advantage pada seluruh Saving Throw saat menghadapi intimidasi atau tekanan dari figur otoritas (guru, polisi, orang tua).",
    repeatable: false,
    tags: ["saving_throw", "origin"]
  },
  {
    id: "superstitious",
    name: "Superstitious",
    category: "origin",
    description: "Proficient 1 skill Luck pilihan. 1 × / Short Rest, sebelum roll Stat/Skill/Saving Throw, tanya DM untuk mengetahui DC dari roll.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["relationship_luck", "situation_luck", "academic_luck"],
      description: "Pilih 1 skill dari rumpun Luck"
    },
    manualEffectText: "Sebelum melempar roll Stat/Skill/Save, tanyakan kepada DM untuk mengetahui angka target DC secara pasti.",
    usage: {
      type: "short_rest",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per Short Rest mengetahui DC roll sebelum melempar dadu"
    },
    repeatable: false,
    tags: ["luck", "utility", "origin"]
  },
  {
    id: "pro_gamer",
    name: "Pro Gamer",
    category: "origin",
    description: "Proficient 1 skill Intelligence, Advantage check yang melibatkan game, konsol, atau komunitas online sekolah.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["academic", "people", "street"],
      description: "Pilih 1 skill dari rumpun Intelligent"
    },
    manualEffectText: "Advantage pada seluruh check yang melibatkan video game, kompetisi esports, konsol, atau komunitas online sekolah.",
    repeatable: false,
    tags: ["gaming", "intelligent", "origin"]
  },
  {
    id: "weak_hero",
    name: "Weak Hero",
    category: "origin",
    description: "Proficient 1 Skill Mind. Advantage check Intimidate/Aura saat membela orang lain yang sedang di-bully atau diganggu. Disadvantage pada check yang sama kalau membela diri sendiri.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["emotional", "interpersonal", "awareness"],
      description: "Pilih 1 skill dari rumpun Mind"
    },
    manualEffectText: "Advantage check Aura/Intimidate saat pasang badan membela kawan yang di-bully.",
    drawbacks: {
      penaltyText: "Disadvantage pada check Aura/Intimidate saat membela kepentingan diri sendiri."
    },
    repeatable: false,
    tags: ["heroic", "drawback", "origin"]
  },
  {
    id: "transfer_student",
    name: "Transfer Student",
    category: "origin",
    description: "Proficient 1 Skill Intelligence. Proficient 1 bahasa asing. Advantage Street check di lingkungan yang baru pertama kali kamu datangi.",
    choices: {
      type: "skill",
      count: 1,
      pool: ["academic", "people", "street"],
      description: "Pilih 1 skill dari rumpun Intelligent"
    },
    manualEffectText: "Karakter menguasai 1 bahasa asing tambahan. Advantage pada Street Check di lingkungan/kota yang baru pertama kali dikunjungi.",
    repeatable: false,
    tags: ["language", "street", "origin"]
  },
  {
    id: "clumsy",
    name: "Clumsy",
    category: "origin",
    description: "+2 semua Skill Luck. Disadvantage Agility check and Saving Throw.",
    effects: {
      clumsyLuckBonus: 2
    },
    drawbacks: {
      disadvantageSkills: ["agility"],
      disadvantageSaves: "all",
      penaltyText: "Disadvantage permanen pada seluruh Agility Check dan seluruh Saving Throw."
    },
    manualEffectText: "Bonus flat +2 ke seluruh 3 Skill Luck (Relationship, Situation, Academic Luck).",
    repeatable: false,
    tags: ["luck", "drawback", "origin"]
  },

  // =========================================================================
  // GENERAL FEATS — PHYSIQUE (12) (Max Stat 20)
  // =========================================================================
  {
    id: "haymaker",
    name: "Haymaker",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique, -2 serangan (to hit) untuk +4 damage; bonus action Strike jika target Dazed/tumbang.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Dapat memilih penalti -2 to hit untuk memperoleh +4 damage. Jika target Dazed atau Tumbang, dapat melakukan Strike via Bonus Action.",
    repeatable: false,
    tags: ["physique", "combat", "strike"]
  },
  {
    id: "quick_strike",
    name: "Quick Strike",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique, bonus action serangan senjata/unarmed sama yang dipakai di Action.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Setelah menyerang dengan Action, dapat menggunakan Bonus Action untuk melakukan serangan tambahan dengan senjata/unarmed yang sama.",
    repeatable: false,
    tags: ["physique", "combat", "bonus_action"]
  },
  {
    id: "built_different",
    name: "Built Different",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique; +2 Physical HP maksimal per level.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    effects: {
      hpPerLevelBonus: 2
    },
    repeatable: false,
    tags: ["physique", "hp", "survivability"]
  },
  {
    id: "sprinter",
    name: "Sprinter",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique; Speed +10ft, tidak memicu serangan bebas (opportunity attack) setelah melakukan Strike.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    effects: {
      flatSpeed: 10
    },
    manualEffectText: "Kecepatan gerak bertambah +10 ft. Gerakanmu setelah mengeksekusi Strike tidak memicu serangan bebas lawan.",
    repeatable: false,
    tags: ["physique", "speed", "mobility"]
  },
  {
    id: "heavy_hitter",
    name: "Heavy Hitter",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique; 1 x / turn, roll 2 kali damage die, ambil yang paling besar.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "1x / turn: Lempar 2 kali dadu damage, gunakan angka hasil lemparan tertinggi.",
    repeatable: false,
    tags: ["physique", "damage", "dice"]
  },
  {
    id: "high_guard",
    name: "High Guard",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique; 1 x / Round gunakan Reaction saat diserang untuk mendapatkan +2 Physical AC sampai awal giliranmu berikutnya.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Reaction: Pasang kuda-kuda bertahan saat diserang, dapatkan +2 Physical AC hingga awal giliranmu berikutnya (1x/round).",
    repeatable: false,
    tags: ["physique", "defense", "ac"]
  },
  {
    id: "straight_hitter",
    name: "Straight Hitter",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique, +2 serangan (to hit) jarak dekat.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    effects: {
      meleeToHitBonus: 2
    },
    repeatable: false,
    tags: ["physique", "accuracy", "melee"]
  },
  {
    id: "toughen_up",
    name: "Toughen Up",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique, Bonus Action: Proficiency Bonus/Long Rest memulihkan 1d6 + Physique Modifier Physique HP.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Bonus Action memulihkan 1d6 + Mod PHY Physical HP (PBx per Long Rest)"
    },
    repeatable: false,
    tags: ["physique", "healing", "recovery"]
  },
  {
    id: "counter_hitter",
    name: "Counter-Hitter",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique, Saat serangan musuh meleset, Reaction: melakukan serangan balasan dengan tangan kosong/senjata yang digunakan.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Reaction saat serangan musuh jarak dekat meleset mengenai AC-mu: Lancarkan serangan balasan seketika.",
    repeatable: false,
    tags: ["physique", "reaction", "counter"]
  },
  {
    id: "adrenaline_junkie",
    name: "Adrenaline Junkie",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique, Physical HP dibawah 50%, kecepatan gerak bertambah +10 ft dan advantage Agility check.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Ketika Physical HP di bawah 50%, kecepatan gerak bertambah +10 ft dan kamu memperoleh Advantage pada seluruh Agility check.",
    repeatable: false,
    tags: ["physique", "clutch", "speed"]
  },
  {
    id: "lifesaver",
    name: "Lifesaver",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique; Bangunin sekutu Tumbang sebagai Bonus Action (bukan Action), dan mereka pulih tambahan 1d4 + Physical Modifier HP.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Membangunkan sekutu Tumbang kini cukup menggunakan Bonus Action (bukan Action), dan mereka langsung pulih tambahan 1d4 + Mod PHY HP.",
    repeatable: false,
    tags: ["physique", "support", "medic"]
  },
  {
    id: "lockdown",
    name: "Lockdown",
    category: "general",
    subcategory: "physique",
    description: "+1 Physique; advantage pada Grapple check; sukses Grapple langsung membuat target Pinned tanpa roll tambahan.",
    bonusAbility: { ability: "physique", value: 1, cap: 20 },
    manualEffectText: "Advantage pada seluruh Grapple check. Keberhasilan Grapple langsung menjatuhkan dan mengunci lawan dalam kondisi Pinned tanpa roll tambahan.",
    repeatable: false,
    tags: ["physique", "grapple", "control"]
  },

  // =========================================================================
  // GENERAL FEATS — INTELLIGENCE (12) (Max Stat 20)
  // =========================================================================
  {
    id: "amatuer_detective",
    name: "Amatuer Detective",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; +3 Passive Investigation; sukses check investigasi (Academic/Street) beri 1 petunjuk tambahan dari GM.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    effects: {
      flatPassiveInvestigation: 3
    },
    manualEffectText: "Setiap kali berhasil melakukan check investigasi (Academic/Street), GM wajib memberikan 1 petunjuk investigasi tambahan.",
    repeatable: false,
    tags: ["intelligent", "investigation", "mystery"]
  },
  {
    id: "small_time_hacker",
    name: "Small Time Hacker",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Advantage check untuk membobol sistem sederhana (wifi, CCTV, akun medsos); 1 × / Long Rest akses info digital tanpa jejak.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per Long Rest membobol dan mengakses info digital tanpa meninggalkan jejak log"
    },
    manualEffectText: "Advantage check membobol sistem digital sederhana (wifi sekolah, CCTV, akun medsos). 1x/Long Rest akses info digital tanpa jejak.",
    repeatable: false,
    tags: ["intelligent", "tech", "hacking"]
  },
  {
    id: "overachiever",
    name: "Overachiever",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Intelligent Modifier x / Long Rest, Advantage Check untuk mengerjakan (ujian, tugas).",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "intelligent",
      description: "Intelligent Modifier x per Long Rest Advantage check mengerjakan ujian atau tugas"
    },
    manualEffectText: "Gunakan kuota untuk mendapatkan Advantage saat check mengerjakan ujian, tugas makalah, atau kuis sekolah.",
    repeatable: false,
    tags: ["intelligent", "academic", "study"]
  },
  {
    id: "model_student",
    name: "Model Student",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Proficiency Bonus x / Long Rest: saat sekutu gagal check Academic, kamu bisa menggantikan hasilnya memakai nilai check-mu.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest menggantikan hasil check Academic kawan yang gagal"
    },
    manualEffectText: "Saat sekutu gagal melakukan check Academic, kamu dapat mengajarkan/membantu mereka dan mengganti hasil roll mereka memakai nilai check milikmu.",
    repeatable: false,
    tags: ["intelligent", "academic", "support"]
  },
  {
    id: "bookworm",
    name: "Bookworm",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Intelligence Modifier x / Long Rest, membaca buku/catatan minimal 5 menit memberi 1d4 + (Jumlah Level) Temp Composure atau bonus check Academic berikutnya.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "intelligent",
      description: "Intelligent Modifier x per Long Rest membaca 5 menit untuk Temp Composure atau bonus check"
    },
    manualEffectText: "Membaca buku/catatan selama 5 menit memberikan 1d4 + (Level Karakter) Temporary Composure atau bonus roll pada check Academic berikutnya.",
    repeatable: false,
    tags: ["intelligent", "composure", "study"]
  },
  {
    id: "behaviour_analyst",
    name: "Behaviour Analyst",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Proficiency Bonus x / Long Rest saat bertemu NPC, GM memberi tahu 1 hal yang paling disukai atau dibenci NPC tersebut.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest meminta GM mengungkap preferensi kesukaan/kebencian NPC"
    },
    manualEffectText: "Saat mengamati NPC, minta GM membocorkan 1 hal yang paling disukai atau paling dibenci oleh NPC tersebut.",
    repeatable: false,
    tags: ["intelligent", "psychology", "social"]
  },
  {
    id: "cold_hearted",
    name: "Cold Hearted",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent, gunakan modifier Intelligent alih-alih Mind saat melakukan save melawan efek provokasi atau Fluster.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    manualEffectText: "Gunakan modifier Intelligent alih-alih Mind saat melempar Saving Throw melawan provokasi verbal, manipulasi emosional, atau status Fluster.",
    repeatable: false,
    tags: ["intelligent", "save", "stoic"]
  },
  {
    id: "art_of_war",
    name: "Art Of War",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent, Intelligent Modifier x / Long Rest, Reaction: saat sekutu diserang, beri sekutu tersebut +2 (Phy) AC jika kamu bisa melihat arah serangan.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "intelligent",
      description: "Intelligent Modifier x per Long Rest Reaction memberi kawan +2 Physical AC"
    },
    manualEffectText: "Reaction memberi komando taktis saat kawan diserang: Memberikan +2 Physical AC kepada kawan tersebut jika kamu dapat melihat arah serangan.",
    repeatable: false,
    tags: ["intelligent", "tactics", "reaction"]
  },
  {
    id: "ghost_protocol",
    name: "Ghost Protocol",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Pada ronde pertama combat, serangan atau tindakan pertama mengabaikan AC fisik/sosial musuh jika target belum menyadari keberadaanmu.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    manualEffectText: "Pada ronde pertama combat, serangan atau manuver pertamamu otomatis mengabaikan AC fisik/sosial target jika target belum menyadari keberadaanmu.",
    repeatable: false,
    tags: ["intelligent", "ambush", "combat"]
  },
  {
    id: "uhm_actually",
    name: "Uhm Actually!..",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; advantage check untuk berbohong langsung di depan orang; Lawan Intelligence Saving Throw.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    manualEffectText: "Advantage pada check ketika berbohong atau memanipulasi fakta logis di depan orang; target harus melawan memakai Intelligent Saving Throw.",
    repeatable: false,
    tags: ["intelligent", "deception", "debate"]
  },
  {
    id: "combat_analyst",
    name: "Combat Analyst",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; 1 x / combat, diawal combat, analisis pola lawan dan beri semua sekutu +1 to-hit atau +1 AC (Physical).",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "combat",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per combat analisis pola awal: beri semua kawan +1 to-hit atau +1 Physical AC"
    },
    manualEffectText: "Di awal ronde pertama combat, analisis pola musuh dan pilih: seluruh sekutu mendapat +1 to-hit ATAU +1 Physical AC hingga combat usai.",
    repeatable: false,
    tags: ["intelligent", "tactics", "buff"]
  },
  {
    id: "weak_point",
    name: "Weak Point",
    category: "general",
    subcategory: "intelligent",
    description: "+1 Intelligent; Proficiency Bonus x / Long Rest, Bonus Action: analisis satu lawan, serangan terhadap lawan itu dapat +1d4 damage tambahan selama 3 round.",
    bonusAbility: { ability: "intelligent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest analisis lawan (+1d4 damage selama 3 round)"
    },
    manualEffectText: "Bonus Action menganalisis kelemahan 1 musuh: Semua serangan fisik/mental terhadap musuh tersebut mendapat tambahan +1d4 damage selama 3 round.",
    repeatable: false,
    tags: ["intelligent", "combat", "damage"]
  },

  // =========================================================================
  // GENERAL FEATS — LOOKS (12) (Max Stat 20)
  // =========================================================================
  {
    id: "heartthrob",
    name: "Heartthrob",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks; Jumlah Level x / Long Rest otomatis sukses pada check (Charm) untuk membuat orang lain terkesan atau tergoda.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "level",
      description: "Level Karakter x per Long Rest otomatis sukses pada check Charm untuk memikat lawan bicara"
    },
    manualEffectText: "Otomatis sukses pada check Charm untuk membuat orang lain terpesona, tersipu, atau tergoda tanpa melempar dadu.",
    repeatable: false,
    tags: ["looks", "charm", "romance"]
  },
  {
    id: "unspoken_rizz",
    name: "Unspoken Rizz",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks; Looks Modifier / Long Rest, tatap mata dengan target memaksanya melakukan Mind Save; jika gagal, target terkena status Fluster.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "looks",
      description: "Looks Modifier x per Long Rest tatapan maut memicu Mind Save lawan / status Fluster"
    },
    manualEffectText: "Tatap mata lawan bicara dalam jarak dekat, paksa target melakukan Mind Save (DC 8+PB+Looks). Jika gagal, target terkena 1 stack status Fluster.",
    repeatable: false,
    tags: ["looks", "charm", "fluster"]
  },
  {
    id: "halo_effect",
    name: "Halo Effect",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks; Jumlah Level x / Long Rest, Immune terhadap efek negatif saat gagal Looks Save.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "level",
      description: "Level Karakter x per Long Rest kebal dari konsekuensi buruk kegagalan Looks Save"
    },
    manualEffectText: "Saat kamu gagal melempar Looks Save, aura pesonamu menetralkan situasi: Kamu kebal terhadap konsekuensi penalti dari kegagalan tersebut.",
    repeatable: false,
    tags: ["looks", "save", "defense"]
  },
  {
    id: "sell_me_this_pen",
    name: "Sell Me This Pen",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks; Advantage pada check (Influence) untuk membuat orang membeli barang yang kita jual atau menawar harga.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    manualEffectText: "Advantage pada seluruh check Influence yang bertujuan menjual barang dagangan, menawarkan jasa, atau menegosiasikan harga belanjaan.",
    repeatable: false,
    tags: ["looks", "influence", "commerce"]
  },
  {
    id: "viral",
    name: "Viral",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks; Jumlah Level x / Long Rest, satu tindakan/ucapanmu di depan umum bisa menyebar jadi tren sekolah dalam 1 hari tanpa perlu check Influence.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "level",
      description: "Level Karakter x per Long Rest ucapan/gaya menjadi tren sekolah dalam 1 hari"
    },
    manualEffectText: "Satu tindakan unik, gaya rambut, atau celetukanmu di depan umum menyebar kilat menjadi tren viral di seisi sekolah tanpa melempar check.",
    repeatable: false,
    tags: ["looks", "trend", "social"]
  },
  {
    id: "stare_down",
    name: "Stare Down",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks, Advantage Check (Aura) untuk mengintimidasi; 1×/sesi buat satu NPC netral Shaken tanpa roll.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "session",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per sesi membuat 1 NPC netral berstatus Shaken seketika tanpa roll"
    },
    manualEffectText: "Advantage pada seluruh check Aura untuk intimidasi. 1x/sesi: Tatapan dinginmu langsung membuat satu NPC netral terkena status Shaken tanpa roll.",
    repeatable: false,
    tags: ["looks", "aura", "intimidation"]
  },
  {
    id: "attention_seeker",
    name: "Attention Seeker",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks, Proficiency Bonus x / Long Rest, Ketika ada minimal 5 orang dalam jarak pandang, Advantage skill check.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest Advantage skill check saat disaksikan minimal 5 orang"
    },
    manualEffectText: "Gunakan saat beraksi di depan kerumunan (minimal 5 orang dalam pandangan) untuk mendapatkan Advantage pada skill check pilihanmu.",
    repeatable: false,
    tags: ["looks", "spotlight", "buff"]
  },
  {
    id: "photogenic",
    name: "Photogenic",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks, Advantage pada semua check Looks saat difoto, direkam, atau tampil di media sosial/mading sekolah.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    manualEffectText: "Advantage pada seluruh check atribut Looks saat sedang dipotret kamera, direkam video, atau tampil di konten mading & medsos sekolah.",
    repeatable: false,
    tags: ["looks", "camera", "media"]
  },
  {
    id: "looksmaxing",
    name: "Looksmaxing",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks, Advantage setiap Looks Skill Check yang dilakukan tanpa berbicara (mewing).",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    manualEffectText: "Advantage pada setiap check skill Looks (Charm, Influence, Aura) yang dieksekusi secara diam tanpa mengeluarkan sepatah kata pun.",
    repeatable: false,
    tags: ["looks", "mewing", "aesthetic"]
  },
  {
    id: "main_character_syndrome",
    name: "Main Character Syndrome",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks, 1 x / Long Rest, Ketika HP atau Composure dibawah 50%, dapatkan bonus +2 untuk kedua AC (Phy/Mental) dan Advantage Charm Check.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per Long Rest mengaktifkan +2 AC (Phy & Social) serta Advantage Charm saat HP atau Composure < 50%"
    },
    manualEffectText: "Saat HP atau Composure berada di bawah 50%, aura protagonismu bangkit: Dapatkan +2 Physical AC, +2 Social AC, dan Advantage pada Charm check.",
    repeatable: false,
    tags: ["looks", "protagonist", "clutch"]
  },
  {
    id: "aura_farming",
    name: "Aura Farming",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks, Proficiency Bonus x / Long Rest, memberikan Disadvantage Mind Save target.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest memaksakan Disadvantage pada Mind Save target"
    },
    manualEffectText: "Pancarkan aura dominan untuk membuat target berada dalam Disadvantage pada lemparan Mind Saving Throw berikutnya.",
    repeatable: false,
    tags: ["looks", "aura", "debuff"]
  },
  {
    id: "peer_pressure",
    name: "Peer Pressure",
    category: "general",
    subcategory: "looks",
    description: "+1 Looks; Advantage (Influence) Check saat membuat sekelompok orang (bukan individu) untuk percaya padamu atau ikut rencanamu.",
    bonusAbility: { ability: "looks", value: 1, cap: 20 },
    manualEffectText: "Advantage pada check Influence saat berorasi atau membujuk sekelompok orang (bukan 1 lawan 1) agar sepakat dan mengikuti rencanamu.",
    repeatable: false,
    tags: ["looks", "influence", "crowd"]
  },

  // =========================================================================
  // GENERAL FEATS — MIND (12) (Max Stat 20)
  // =========================================================================
  {
    id: "love_doctor",
    name: "Love Doctor",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind; Bonus Action: berikan bonus 1d4 pada romance (charm) check pada dirinya sendiri atau sekutu dalam jarak pandang.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Bonus Action memberi tips asmara: Berikan bonus +1d4 pada check Charm bernuansa romansa untuk dirimu sendiri atau kawan dalam pandangan.",
    repeatable: false,
    tags: ["mind", "romance", "support"]
  },
  {
    id: "unphased",
    name: "Unphased",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind; Advantage save melawan efek Fluster, manipulasi emosi, dan intimidasi.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Advantage pada seluruh Saving Throw saat melawan status Fluster, manipulasi emosional lawan, atau gertakan intimidasi.",
    repeatable: false,
    tags: ["mind", "save", "resilience"]
  },
  {
    id: "poker_face",
    name: "Poker Face",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind; NPC mendapat Disadvantage saat mencoba membaca emosi atau motif aslimu.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "NPC atau lawan selalu mendapatkan Disadvantage saat mencoba membaca ekspresi, bahasa tubuh, niat bohong, atau motif aslimu.",
    repeatable: false,
    tags: ["mind", "deception", "stealth"]
  },
  {
    id: "trust_issues",
    name: "Trust Issues",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Advantage check untuk mendeteksi kebohongan, gertakan, atau niat tersembunyi. Jika sukses, kamu langsung tahu emosi dominan target.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Advantage check mendeteksi kebohongan/gertakan. Jika berhasil, GM langsung membocorkan emosi dominan target (panik, cemburu, tamak, dll).",
    repeatable: false,
    tags: ["mind", "insight", "psychology"]
  },
  {
    id: "becoming_water",
    name: "Becoming Water",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Proficiency Bonus x / Long Rest, saat Short Rest / Meditasi 5 menit memulihkan Composure secara penuh tanpa mengurangi Rest Dice.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest memulihkan Composure penuh saat Short Rest tanpa mengurangi Rest Dice"
    },
    manualEffectText: "Saat melakukan Short Rest atau meditasi hening 5 menit, pulihkan Composure sepenuhnya tanpa perlu menghabiskan Rest Dice.",
    repeatable: false,
    tags: ["mind", "composure", "rest"]
  },
  {
    id: "everybody_is_naked",
    name: "Everybody Is Naked",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Immune efek mental buruk yang disebabkan tekanan massa atau sorotan publik.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Kebal dari efek demam panggung, rasa gugup di depan umum, serta penalti Composure akibat sorotan publik atau tatapan massa.",
    repeatable: false,
    tags: ["mind", "immunity", "confidence"]
  },
  {
    id: "right_back_at_ya",
    name: "Right Back At Ya!",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Reaction: Mind Modifier / Long Rest saat anda menerima stack Fluster atau rasa malu, anda bisa memantulkannya ke mereka. Gagal Mind Save akan mendapat Stack Fluster yang sama.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "mind",
      description: "Mind Modifier x per Long Rest Reaction memantulkan status Fluster kembali ke lawan"
    },
    manualEffectText: "Reaction saat menerima stack Fluster: Pantulkan balik ke sumbernya. Target harus lempar Mind Save; jika gagal, mereka menerima stack Fluster tersebut.",
    repeatable: false,
    tags: ["mind", "reaction", "counter"]
  },
  {
    id: "strong_mindset",
    name: "Strong Mindset",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Advantage saving throw atau check untuk mempertahankan fokus. Jika roll berhasil maka gangguan apapun tidak bisa memecah konsentrasimu.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Advantage Save/check mempertahankan konsentrasi fokus. Jika roll berhasil, gangguan seberisik apa pun tidak dapat memecah fokusmu.",
    repeatable: false,
    tags: ["mind", "focus", "concentration"]
  },
  {
    id: "vibe_checker",
    name: "Vibe Checker",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Advantage pada check untuk mengetahui niat NPC terhadap anda atau sekutu anda (baik, jahat, dsb).",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Advantage pada check Awareness/Interpersonal untuk menilai niat sejati NPC (apakah tulus, manipulatif, berniat jahat, atau sekadar gengsi).",
    repeatable: false,
    tags: ["mind", "awareness", "empathy"]
  },
  {
    id: "one_step_ahead",
    name: "One Step Ahead",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind, Saat Initiative dilempar, dapatkan Advantage pada lemparan milikmu sendiri atau berikan Advantage tersebut kepada satu sekutu dalam jarak 30 ft.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    manualEffectText: "Saat giliran inisiatif dilempar di awal combat, pilih: dapatkan Advantage pada lemparan inisiatifmu atau berikan ke satu kawan dalam 30 ft.",
    repeatable: false,
    tags: ["mind", "initiative", "tactics"]
  },
  {
    id: "whos_gonna_carry_the_boats",
    name: "Who's Gonna Carry the Boats ?",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind; +2 Composure Maksimal per level.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    effects: {
      composurePerLevelBonus: 2
    },
    repeatable: false,
    tags: ["mind", "composure", "grit"]
  },
  {
    id: "lone_wolf",
    name: "Lone Wolf",
    category: "general",
    subcategory: "mind",
    description: "+1 Mind; saat tidak ada sekutu dalam 15ft, advantage semua saving throw; tapi disadvantage check People/Interpersonal.",
    bonusAbility: { ability: "mind", value: 1, cap: 20 },
    drawbacks: {
      disadvantageSkills: ["people", "interpersonal"],
      penaltyText: "Disadvantage permanen pada check People dan Interpersonal karena sifat dingin penyendiri."
    },
    manualEffectText: "Saat tidak ada kawan dalam jarak 15 ft, dapatkan Advantage pada SELURUH Saving Throw. Namun kamu membawa Disadvantage permanen pada check People/Interpersonal.",
    repeatable: false,
    tags: ["mind", "drawback", "defense"]
  },

  // =========================================================================
  // GENERAL FEATS — TALENT (12) (Max Stat 20)
  // =========================================================================
  {
    id: "never_back_down",
    name: "Never Back Down",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; dapatkan profisiensi pada 1 Saving Throw pilihan.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    choices: {
      type: "save",
      count: 1,
      pool: ["physique", "intelligent", "looks", "mind", "talent", "luck"],
      description: "Pilih 1 Saving Throw untuk mendapatkan profisiensi"
    },
    repeatable: false,
    tags: ["talent", "save", "resilience"]
  },
  {
    id: "main_attraction",
    name: "Main Attraction",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; Advantage Skill check yang dilakukan di depan audiens (minimal 5).",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    manualEffectText: "Advantage pada skill check apa pun saat aksimu ditonton langsung oleh penonton/audiens berjumlah minimal 5 orang.",
    repeatable: false,
    tags: ["talent", "performance", "stage"]
  },
  {
    id: "jack_of_all_trades",
    name: "Jack of All Trades",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent, +1 ke semua Skill yang belum proficient.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    effects: {
      jackOfAllTrades: true
    },
    repeatable: false,
    tags: ["talent", "skill", "versatility"]
  },
  {
    id: "showoff",
    name: "Showoff",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; Talent Modifier x / Long Rest ubah Check yang bertujuan untuk memamerkan/menampilkan yang gagal menjadi sukses.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "talent",
      description: "Talent Modifier x per Long Rest mengubah check pamer/unjuk gigi yang gagal menjadi sukses"
    },
    manualEffectText: "Saat melempar check dengan tujuan pamer atau unjuk kebolehan di depan umum dan hasilnya gagal, ubah hasilnya seketika menjadi sukses.",
    repeatable: false,
    tags: ["talent", "performance", "clutch"]
  },
  {
    id: "da_vinci",
    name: "Da Vinci",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; karya seni, desain, atau tulisanmu memberikan +2 bonus check sosial kepada siapa pun yang membawanya atau menggunakannya.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    manualEffectText: "Setiap barang hasil kreasimu (lukisan, brosur, puisi cinta, aksesoris) memberikan bonus +2 check sosial pada siapa pun yang membawanya.",
    repeatable: false,
    tags: ["talent", "craft", "art"]
  },
  {
    id: "crowd_pleaser",
    name: "Crowd Pleaser",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; saat berhasil melakukan check Performance di depan didepan orang, pilih untuk memberikan/mengambil 1d4 Composure ke semua yang menyaksikan.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    manualEffectText: "Saat sukses check Performance di depan penonton: Pilih apakah memulihkan 1d4 Composure atau menguras 1d4 Composure dari semua penonton.",
    repeatable: false,
    tags: ["talent", "performance", "composure"]
  },
  {
    id: "punchline",
    name: "Punchline",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; Reaction: lempar lelucon/ejekan/disrupsi untuk memberi penalti 1d4 pada roll target.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    manualEffectText: "Reaction melontarkan celetukan kocak atau roasting tepat waktu: Berikan penalti -1d4 pada hasil lemparan roll target dalam jarak dengar.",
    repeatable: false,
    tags: ["talent", "reaction", "debuff"]
  },
  {
    id: "mood_booster",
    name: "Mood Booster",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent, Proficiency Bonus / Short Rest, pertunjukan dengan instrumen musik, akting, atau alat seni favoritmu singkatmu bisa menghapus 1 stack status negatif emosional pada teman-temanmu.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    usage: {
      type: "short_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Short Rest pertunjukan seni singkat menghapus 1 status emosional negatif kawan"
    },
    manualEffectText: "Mainkan musik, lawakan, atau pertunjukan singkat untuk menghapus 1 stack status negatif emosional (Fluster, Shaken, Dazed) pada kawan-kawanmu.",
    repeatable: false,
    tags: ["talent", "healing", "support"]
  },
  {
    id: "off_script",
    name: "Off-Script",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent, advantage Check (Adaptability) saat mencoba sesuatu yang belum pernah dilatih.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    manualEffectText: "Advantage pada seluruh check Adaptability ketika kamu mencoba melakukan trik, peran, atau aktivitas yang sama sekali belum pernah kamu pelajari.",
    repeatable: false,
    tags: ["talent", "adaptability", "improv"]
  },
  {
    id: "macgyver",
    name: "MacGyver",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; Proficiency Bonus x / Long Rest, Bonus Action: untuk membuat alat sederhana dari barang disekitar tanpa perlu proficiency Craft.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest Bonus Action merakit alat darurat dari barang sekitar"
    },
    manualEffectText: "Bonus Action merakit perkakas/alat bantu fungsional sederhana dari benda-benda sekitar tanpa memerlukan keahlian atau peralatan khusus.",
    repeatable: false,
    tags: ["talent", "utility", "craft"]
  },
  {
    id: "ghostwriter",
    name: "Ghostwriter",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; Proficiency Bonus x / Long Rest, tulisan yang kamu buat atas nama orang lain terasa 100% otentik.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest menulis surat/naskah atas nama orang lain 100% otentik"
    },
    manualEffectText: "Surat cinta, esai, atau dokumen yang kamu tulis atas nama orang lain terasa 100% autentik; orang lain tidak akan mencurigai kepenulisannya.",
    repeatable: false,
    tags: ["talent", "creative", "writing"]
  },
  {
    id: "practice_makes_perfect",
    name: "Practice Makes Perfect",
    category: "general",
    subcategory: "talent",
    description: "+1 Talent; Jumlah Level x / Long Rest untuk satu teknik/aksi yang sudah kamu lakukan sukses sebelumnya di hari yang sama, dapat advantage saat mengulanginya.",
    bonusAbility: { ability: "talent", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "level",
      description: "Level Karakter x per Long Rest Advantage saat mengulang aksi yang sudah sukses di hari yang sama"
    },
    manualEffectText: "Ketika mengulangi manuver, jurus, atau trik yang sudah pernah berhasil kamu lakukan di hari yang sama, kamu memperoleh Advantage.",
    repeatable: false,
    tags: ["talent", "mastery", "repetition"]
  },

  // =========================================================================
  // GENERAL FEATS — LUCK (12) (Max Stat 20)
  // =========================================================================
  {
    id: "plot_armor",
    name: "Plot Armor",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Proficiency Bonus x / Long Rest reroll check milik siapa saja, ambil dadu yang baru.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest memaksa melempar ulang dadu check milik siapa pun"
    },
    manualEffectText: "Pilih lemparan dadu milik siapa saja (kawan atau lawan), paksa mereka melempar ulang dan wajib menggunakan hasil dadu yang baru.",
    repeatable: false,
    tags: ["luck", "reroll", "fate"]
  },
  {
    id: "right_place_right_time",
    name: "Right Place, Right Time",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Luck Modifier / Long Rest temukan objek berguna secara tidak sengaja di tempat yang sedang kamu jelajahi.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "luck",
      description: "Luck Modifier x per Long Rest menemukan benda atau kunci penting secara kebetulan"
    },
    manualEffectText: "Secara tidak sengaja tersandung atau menemukan barang berguna (kunci cadangan, payung, uang jatuh, jalan pintas) di lokasimu saat ini.",
    repeatable: false,
    tags: ["luck", "discovery", "convenience"]
  },
  {
    id: "miss_me",
    name: "Miss Me!",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Jumlah Level / Long Rest saat serangan lawan fisik/mental seharusnya mengenai AC milikmu, serangannya otomatis meleset.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "level",
      description: "Level Karakter x per Long Rest serangan lawan yang mengenai AC otomatis meleset"
    },
    manualEffectText: "Saat serangan lawan (fisik atau serangan sosial/mental) sukses menembus AC-mu, keberuntungan ajaib membuat serangan itu otomatis meleset.",
    repeatable: false,
    tags: ["luck", "defense", "dodge"]
  },
  {
    id: "wild_card",
    name: "Wild Card",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck, Proficiency Bonus / Long Rest sebelum melakukan roll d20 untuk check Skill yang tidak dikuasai, bisa ditambah menggunakan modifier Luck.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest menambahkan Modifier Luck ke roll skill yang belum dikuasai"
    },
    manualEffectText: "Sebelum melempar roll d20 untuk skill yang tidak proficient, tambahkan modifier Luck milikmu ke nilai total lemparan.",
    repeatable: false,
    tags: ["luck", "skill", "bonus"]
  },
  {
    id: "cupid",
    name: "Cupid",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; advantage Relationship Luck check; 1 × / 1 minggu (game time) otomatis sukses satu check untuk memicu flag romance.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "weekly",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per minggu waktu game otomatis sukses check pemicu event romansa"
    },
    manualEffectText: "Advantage pada seluruh Relationship Luck check. 1x per minggu game time, otomatis sukses memicu event momen atau flag romansa dengan target crush.",
    repeatable: false,
    tags: ["luck", "romance", "crush"]
  },
  {
    id: "background_character",
    name: "Background Character",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Bersembunyi di antara kerumunan siswa (minimal 3) otomatis mendapat status hidden / ketika ada kerusuhan di sekolah, guru BP, NPC/guru otomatis menganggapmu tidak terlibat.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    manualEffectText: "Berbaur di antara kerumunan murid (minimal 3 orang) otomatis berstatus Hidden. Saat razia atau tawuran pecah, guru BP dan polisi menganggapmu sekadar penonton tak bersalah.",
    repeatable: false,
    tags: ["luck", "stealth", "inconspicuous"]
  },
  {
    id: "just_as_planned",
    name: "Just As Planned",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Luck Modifier / Long Rest merubah serangan fisik yang tidak kena menjadi sesuatu yang mengganggu target, target mendapat Disadvantage di serangan berikutnya.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "luck",
      description: "Luck Modifier x per Long Rest serangan meleset memberi Disadvantage serangan lawan berikutnya"
    },
    manualEffectText: "Saat serangan fisikmu meleset, kebetulan kocak mengganggu keseimbangan target (misal tali sepatu copot, kena debu), memberi Disadvantage di serangan berikutnya.",
    repeatable: false,
    tags: ["luck", "combat", "debuff"]
  },
  {
    id: "push_up_fall",
    name: "Push Up Fall",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Proficiency Bonus x / Long Rest saat gagal check Physique untuk aksi fisik, kegagalanmu justru menghasilkan efek sosial/komikal yang menguntungkan.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest kegagalan fisik memicu momen komikal yang menguntungkan"
    },
    manualEffectText: "Saat gagal melakukan check Physique, kegagalanmu terpelintir secara anime menjadi momen komikal beruntung (misal jatuh menyelamatkan kacamata gebetan).",
    repeatable: false,
    tags: ["luck", "humor", "social"]
  },
  {
    id: "nu_uh",
    name: "Nu-uh",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Luck Modifier x / Long Rest, ubah serangan musuh yang Critical Hit mengenaimu menjadi serangan biasa.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "luck",
      description: "Luck Modifier x per Long Rest membatalkan Critical Hit lawan menjadi serangan normal"
    },
    manualEffectText: "Saat musuh melempar Natural 20 (Critical Hit) padamu, batalkan efek kritis tersebut dan jadikan sebagai serangan biasa tanpa damage berlipat ganda.",
    repeatable: false,
    tags: ["luck", "defense", "cancel"]
  },
  {
    id: "saved_by_the_bell",
    name: "Saved By The Bell",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Luck Modifier x / Long Rest, ketika HP/Composure menyentuh 0, roll d20: hasil >= 11 membuat HP/Composure bertahan di 1.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "ability_mod",
      abilityKey: "luck",
      description: "Luck Modifier x per Long Rest saat HP atau Composure menyentuh 0, roll d20 DC 11 bertahan di 1"
    },
    manualEffectText: "Saat HP atau Composure jatuh ke 0, lempar d20 murni (DC 11). Jika hasilnya 11 atau lebih, kamu selamat dan vitals-mu bertahan di 1 (lonceng sekolah berbunyi tepat waktu).",
    repeatable: false,
    tags: ["luck", "survival", "clutch"]
  },
  {
    id: "button_counter",
    name: "Button Counter",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; Proficiency Bonus / Long Rest, saat menebak jawaban ujian pilihan ganda yang kamu benar-benar tidak tahu, anggap jawabanmu benar.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "long_rest",
      countFormula: "pb",
      description: "Proficiency Bonus x per Long Rest tebak kancing soal ujian pilihan ganda otomatis benar"
    },
    manualEffectText: "Saat menghadapi soal pilihan ganda ujian sekolah yang tidak kamu ketahui sama sekali, gunakan kuota ini: Jawaban tebakan kancingmu otomatis benar.",
    repeatable: false,
    tags: ["luck", "exam", "academic"]
  },
  {
    id: "second_chance_romance",
    name: "Second Chance Romance",
    category: "general",
    subcategory: "luck",
    description: "+1 Luck; 1 x / Target, setelah momen romance gagal (ditolak, putus), dapat satu kesempatan lagi, dengan odds rujuk yang ditentukan DM.",
    bonusAbility: { ability: "luck", value: 1, cap: 20 },
    usage: {
      type: "per_target",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per Target Asmara mendapat kesempatan kedua setelah ditolak atau putus"
    },
    manualEffectText: "Setelah ungkapan cinta ditolak atau hubungan putus, takdir memberi 1 kesempatan kedua untuk kembali mendekati target dengan peluang rujuk dari DM.",
    repeatable: false,
    tags: ["luck", "romance", "crush"]
  },

  // =========================================================================
  // ACHIEVEMENT FEATS (8) (Max Stat 30, Story Req, Drawbacks)
  // =========================================================================
  {
    id: "valedictorian",
    name: "Valedictorian",
    category: "achievement",
    description: "+2 Intelligent; Advantage pada semua check Academic Luck. Guru selalu mempercayaimu. Disadvantage pada check People saat bersikap santai/bercanda dengan murid biasa.",
    bonusAbility: { ability: "intelligent", value: 2, cap: 30 },
    requirementText: "Mendapatkan peringkat 1 umum pada ujian tengah dan akhir semester selama 5 kali berturut-turut tanpa pernah tergeser.",
    manualEffectText: "Advantage pada seluruh check Academic Luck. Seluruh guru dan staf sekolah selalu mempercayai ucapan dan integritasmu.",
    drawbacks: {
      penaltyText: "Disadvantage pada check People saat bersikap santai, bercanda, atau mencoba akrab dengan murid biasa karena jurang status jenius."
    },
    repeatable: false,
    tags: ["achievement", "intelligent", "academic"]
  },
  {
    id: "mvp",
    name: "MVP Regional",
    category: "achievement",
    description: "+2 Physique; Advantage pada check Influence saat berinteraksi dengan NPC dari sekolah lain. Penalti −2 pada check Street/Stealth saat beraktivitas diam-diam di luar sekolah karena wajahmu sangat mudah dikenali.",
    bonusAbility: { ability: "physique", value: 2, cap: 30 },
    requirementText: "Menjadi pemain terbaik dan membawa tim sekolah menjuarai turnamen antar sekolah skala regional.",
    manualEffectText: "Advantage pada check Influence saat berinteraksi dengan siswa, atlet, atau NPC dari sekolah lain.",
    drawbacks: {
      penaltyText: "Penalti tetap −2 pada check Street dan aktivitas menyelinap di luar sekolah karena wajahmu sangat populer dan mudah dikenali."
    },
    repeatable: false,
    tags: ["achievement", "physique", "athlete"]
  },
  {
    id: "heartbreaker",
    name: "Heartbreaker",
    category: "achievement",
    description: "+2 Looks; Advantage pada check Aura saat berhadapan dengan fans/pengagum, namun menerima Disadvantage pada check People saat berinteraksi dengan sekutu dekat target yang kamu tolak.",
    bonusAbility: { ability: "looks", value: 2, cap: 30 },
    requirementText: "Menolak ungkapan cinta dari 3 NPC yang berbeda dalam satu semester.",
    manualEffectText: "Advantage pada check Aura saat berhadapan dengan fans, pengagum rahasia, atau kelompok pemuja.",
    drawbacks: {
      penaltyText: "Disadvantage pada check People saat berinteraksi dengan kawan atau sekutu dekat dari orang-orang yang pernah kamu tolak cintanya."
    },
    repeatable: false,
    tags: ["achievement", "looks", "romance"]
  },
  {
    id: "presidents_hand",
    name: "President's Hand",
    category: "achievement",
    description: "+2 Intelligent; 1×/day dapat meminta bantuan langsung dari fasilitas sekolah atau staf tanpa melempar check.",
    bonusAbility: { ability: "intelligent", value: 2, cap: 30 },
    requirementText: "Terpilih sebagai Ketua OSIS atau memimpin event terbesar di sekolah hingga sukses.",
    usage: {
      type: "long_rest",
      countFormula: "fixed",
      fixedCount: 1,
      description: "1x per hari meminta bantuan langsung dari fasilitas sekolah atau staf tanpa check"
    },
    manualEffectText: "1x/hari dapat meminta bantuan staf, penggunaan ruang laboratorium/aula terkunci, atau fasilitas dinas sekolah tanpa perlu melempar roll.",
    repeatable: false,
    tags: ["achievement", "intelligent", "osis"]
  },
  {
    id: "viral_sensation",
    name: "Viral Sensation",
    category: "achievement",
    description: "+2 Looks; Advantage pada check Charm saat menyapa murid dari angkatan yang berbeda, namun nilai Passive Perception musuh untuk menemukan keberadaanmu bertambah +3 karena wajahmu sangat mudah dikenal.",
    bonusAbility: { ability: "looks", value: 2, cap: 30 },
    requirementText: "Masuk ke dalam konten media sosial yang ditonton atau diperbincangkan oleh minimal setengah populasi sekolah.",
    manualEffectText: "Advantage pada check Charm saat menyapa atau berinteraksi dengan adik kelas maupun kakak kelas dari angkatan berbeda.",
    drawbacks: {
      penaltyText: "Nilai Passive Perception musuh untuk mendeteksi keberadaanmu bertambah +3 (kamu sulit bersembunyi karena wajahmu viral)."
    },
    repeatable: false,
    tags: ["achievement", "looks", "viral"]
  },
  {
    id: "prom_royalty",
    name: "Prom Royalty",
    category: "achievement",
    description: "+2 Looks; Advantage pada check Charm dan Influence saat berada di acara sosial formal sekolah, namun menjadi target kecemburuan dari kelompok murid lain.",
    bonusAbility: { ability: "looks", value: 2, cap: 30 },
    requirementText: "Terpilih menjadi Raja/Ratu acara dansa sekolah atau ajang kecantikan angkatan.",
    manualEffectText: "Advantage pada seluruh check Charm dan Influence saat menghadiri festival resmi, pesta dansa, atau malam keakraban sekolah.",
    drawbacks: {
      penaltyText: "Menjadi sasaran kecemburuan dan rumor miring dari circle murid lain (DM dapat membebankan Disadvantage saat membangun kepercayaan dengan geng rival)."
    },
    repeatable: false,
    tags: ["achievement", "looks", "royalty"]
  },
  {
    id: "canteen_tycoon",
    name: "Canteen Tycoon",
    category: "achievement",
    description: "+2 Talent; diskon 25% saat membeli item konsumsi di sekolah dan Advantage pada check transaksi, namun sering ditegur oleh pengelola kantin resmi.",
    bonusAbility: { ability: "talent", value: 2, cap: 30 },
    requirementText: "Berhasil menguasai atau memonopoli perdagangan jajanan/barang langka di area sekolah selama 1 Semester.",
    manualEffectText: "Mendapatkan diskon 25% harga belanjaan item konsumsi di sekolah serta Advantage pada check transaksi tawar-menawar barang.",
    drawbacks: {
      penaltyText: "Kerap diawasi ketat dan ditegur oleh pengelola kantin resmi sekolah atau guru piket yang mencurigai bisnis bawah tanahmu."
    },
    repeatable: false,
    tags: ["achievement", "talent", "tycoon"]
  },
  {
    id: "one_man_army",
    name: "One-Man Army",
    category: "achievement",
    description: "+2 Physique; saat bertarung tanpa bantuan sekutu sama sekali, serangan fisikmu memberikan +2 damage tambahan, namun kamu dianggap sebagai ancaman bahaya oleh murid biasa.",
    bonusAbility: { ability: "physique", value: 2, cap: 30 },
    requirementText: "Memenangkan perkelahian kelompok (minimal melawan 3 orang) seorang diri tanpa bantuan kawan.",
    effects: {
      unarmedDamageBonus: 2
    },
    manualEffectText: "Saat bertarung sendirian tanpa ada kawan dalam pertempuran, setiap serangan fisikmu menghasilkan +2 damage ekstra.",
    drawbacks: {
      penaltyText: "Dianggap sebagai ancaman bahaya oleh murid biasa (Disadvantage pada first impression dan check keakraban dengan murid non-delinquent)."
    },
    repeatable: false,
    tags: ["achievement", "physique", "solo"]
  }
];
