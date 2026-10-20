import type {
  CombatActionDefinition,
  ArchetypeReworkData,
  SocialClassReworkData
} from "../types";

/**
 * Standard Combat Action Economy for Damsel & Desire (5e Adaptation).
 * Provides core action options across Action, Bonus Action, and Reaction.
 */
export const STANDARD_COMBAT_ACTIONS: CombatActionDefinition[] = [
  // --- ACTIONS (5) ---
  {
    id: "action_unarmed_strike",
    name: "Pukulan Cepat & Jab (Quick Jab / Unarmed Strike)",
    actionType: "action",
    category: "combat",
    moveKind: "physical",
    cost: "Action",
    check: "Physique / Power (+1 to-hit bonus)",
    effect: "1d4 + Mod Physique Physical Damage",
    damageDie: "1d4",
    statKey: "physique",
    rollBonus: 1,
    pros: "Akurat & Cepat: Mendapat bonus +1 pada Attack Check.",
    cons: "Plafon damage lebih rendah dibanding tendangan berat (1d4 vs 1d6).",
    clearEffect: "Disorientasi: Jika serangan kena, target menderita penalti -1 pada d20 lemparan aksi pertamanya di giliran berikutnya.",
    description: "Tinju mentah atau tamparan presisi yang mengincar celah pertahanan lawan untuk merusak ritmenya.",
    range: "Melee (5 ft)"
  },
  {
    id: "action_shove",
    name: "Dorongan Taktis (Tactical Shove)",
    actionType: "action",
    category: "combat",
    moveKind: "physical",
    cost: "Action",
    check: "Physique / Power vs Target Physique Save",
    effect: "1d4 Physical Damage & Target terdorong 10 ft / jatuh Prone",
    damageDie: "1d4",
    statKey: "physique",
    pros: "Merusak Formasi: Mendorong lawan 10 ft atau menjatuhkannya tersungkur (Prone).",
    cons: "Tanpa Bonus Mod: Damage murni 1d4 tanpa tambahan modifier Physique.",
    clearEffect: "Target terdorong 10 ft menjauhi penyerang ATAU tersungkur Prone (serangan melee sekutu dapat Advantage).",
    description: "Mendorong lawan dengan kedua tangan penuh tenaga untuk merusak posisi berdirinya.",
    range: "Melee (5 ft)"
  },
  {
    id: "action_dodge_guard",
    name: "Kuda-Kuda Tangkis & Balas (Guard & Counter Stance)",
    actionType: "action",
    category: "defense",
    moveKind: "physical",
    cost: "Action",
    check: "Otomatis",
    effect: "+3 Physical Guard (PAC) & Buka Reaksi Counter Jab",
    pros: "Pertahanan Kokoh: Memberikan +3 Guard fisik (AC) hingga awal giliran berikutnya.",
    cons: "Pasif: Tidak melancarkan serangan aktif pada gilirannya sendiri.",
    clearEffect: "Jika diserang jarak dekat dan musuh meleset, pengguna dapat menggunakan Reaction untuk melancarkan 1 Counter Jab instan.",
    description: "Memasang kuda-kuda rapat dan memfokuskan pertahanan terhadap semua serangan."
  },
  {
    id: "action_help_support",
    name: "Sorakan Semangat & Wingman (Help / Support Cheer)",
    actionType: "action",
    category: "social",
    moveKind: "social",
    cost: "Action",
    check: "Mind / Interpersonal (DC 10)",
    effect: "Pulihkan 1d4 + Mod Mind Composure & Beri Advantage",
    damageDie: "1d4",
    statKey: "mind",
    isHeal: true,
    pros: "Support Kuat: Memulihkan Composure sekutu dan memberi Advantage.",
    cons: "Tidak menghasilkan damage pada musuh.",
    clearEffect: "Memulihkan Composure 1 sekutu (1d4 + Mod Mind) dan memberi Advantage pada roll check d20 berikutnya milik sekutu tersebut.",
    description: "Memberikan arahan taktis, memegangi objek, atau membantu teman secara langsung.",
    range: "30 ft"
  },
  {
    id: "action_disengage",
    name: "Mundur Teratur (Tactical Disengage & Dash)",
    actionType: "action",
    category: "movement",
    moveKind: "physical",
    cost: "Action",
    check: "Physique / Agility",
    effect: "Gerakanmu tidak memicu Opportunity Attack selama ronde ini & +10 ft Movement",
    pros: "Mobilitas Aman: Gerakan tidak memicu Opportunity Attack dan langkah +10 ft.",
    cons: "Menggunakan seluruh Action utama tanpa menghasilkan damage.",
    clearEffect: "Mundur tanpa risiko serang balik dan memposisikan ulang diri di medan tempur.",
    description: "Mundur dengan langkah cerdas memanfaatkan celah pergerakan lawan."
  },

  // --- BONUS ACTIONS (2) ---
  {
    id: "action_social_remark",
    name: "Sindiran Pedas & Provokasi (Sharp Taunt & Social Remark)",
    actionType: "bonus_action",
    category: "social",
    moveKind: "social",
    cost: "Bonus Action",
    check: "Intelligent / People vs Target Mind Save",
    effect: "1d4 + Mod Intelligent Composure Damage & Target Terprovokasi",
    damageDie: "1d4",
    statKey: "intelligent",
    pros: "Hanya Bonus Action: Bisa digabung dengan aksi fisik di giliran yang sama.",
    cons: "Target Terpancing: Menjadi sasaran utama serangan musuh.",
    clearEffect: "Target terprovokasi dan wajib menyerangmu pada gilirannya, namun dengan Disadvantage karena emosi meluap.",
    description: "Melontarkan ejekan/sindiran, tatapan intimidasi, rayuan singkat, atau teriakan penyemangat di sela aksi.",
    range: "30 ft"
  },
  {
    id: "action_use_item",
    name: "Gunakan Barang / Konsumsi (Use Item / Consume)",
    actionType: "bonus_action",
    category: "utility",
    moveKind: "utility",
    cost: "Bonus Action",
    check: "Otomatis",
    effect: "Meminum minuman kemasan, memakan bekal/permen, atau menggunakan peralatan kecil",
    pros: "Aksi Cepat: Menerapkan efek consumable tanpa menghabiskan Action utama.",
    cons: "Membutuhkan ketersediaan item di inventaris tas/saku.",
    clearEffect: "Mengonsumsi 1 item dari tas sekolah untuk memulihkan stamina atau memicu efek khusus item.",
    description: "Aksi praktis mengambil dan menggunakan item konsumsi ringan di tengah pertempuran atau eksplorasi."
  },

  // --- REACTIONS (1) ---
  {
    id: "action_opportunity_attack",
    name: "Serangan Kesempatan (Opportunity Strike)",
    actionType: "reaction",
    category: "combat",
    moveKind: "physical",
    cost: "Reaction",
    check: "Physique / Power (vs Guard Fisik Target)",
    effect: "1d4 + Mod Physique Physical Damage & Kurangi Speed Musuh 10 ft",
    damageDie: "1d4",
    statKey: "physique",
    pros: "Menyerang di Luar Giliran: Menggunakan giliran musuh yang mencoba kabur.",
    cons: "Mengonsumsi slot Reaction satu-satunya untuk ronde ini.",
    clearEffect: "Jika mengenai target, sisa kecepatan gerak musuh berkurang 10 ft pada giliran ini.",
    description: "Memanfaatkan kelengahan lawan saat mereka mencoba kabur atau berpindah posisi di dekatmu.",
    range: "Melee (5 ft)",
    trigger: "Saat musuh yang berada dalam jangkauan jarak dekatmu bergerak keluar dari area jangkauanmu tanpa menggunakan aksi Disengage."
  }
];

export const STANDARD_PHYSICAL_MOVES: CombatActionDefinition[] = [
  STANDARD_COMBAT_ACTIONS[0], // action_unarmed_strike (Quick Jab)
  {
    id: "action_heavy_kick",
    name: "Tendangan Berbobot (Heavy Roundhouse Kick)",
    actionType: "action",
    category: "combat",
    moveKind: "physical",
    cost: "Action",
    check: "Physique / Agility (vs Guard Fisik Target)",
    effect: "1d6 + Mod Physique Physical Damage & Potensi Knockback",
    damageDie: "1d6",
    statKey: "physique",
    pros: "Daya Hancur Tinggi: Dadu 1d6 dan berpotensi memicu Knockback.",
    cons: "Overcommit: Jika lemparan meleset dengan selisih 4 atau lebih dari Guard target, kamu kena penalti -1 AC hingga awal giliranmu berikutnya.",
    clearEffect: "Knockback: Jika damage minimal 3, target terdorong mundur 5 ft dan kehilangan posisi stabil (DC 11 Physique save atau kehilangan hak Reaction).",
    description: "Tendangan tumit atau tendangan memutar bertenaga penuh mengincar pinggang atau pelipis lawan.",
    range: "Melee (5 ft)"
  },
  {
    id: "action_grapple",
    name: "Kuncian & Bantingan (Grapple & Takedown)",
    actionType: "action",
    category: "combat",
    moveKind: "physical",
    cost: "Action",
    check: "Physique / Power vs Target Physique Save",
    effect: "1d4 + Mod Physique Physical Damage & Target Restrained",
    damageDie: "1d4",
    statKey: "physique",
    pros: "Kontrol Penuh: Menahan lawan agar tidak bisa melarikan diri.",
    cons: "Terkunci: Pengguna harus tetap berada di samping target dan tidak bisa menendang berat selama kuncian aktif.",
    clearEffect: "Restrained: Kecepatan gerak target menjadi 0 ft. Serangan jarak dekat sekutu ke arah target mendapat Advantage.",
    description: "Mencengkeram kerah baju lawan, memelintir lengannya, atau membantingnya ke lantai.",
    range: "Melee (5 ft)"
  },
  STANDARD_COMBAT_ACTIONS[1], // action_shove (Tactical Shove)
  STANDARD_COMBAT_ACTIONS[2], // action_dodge_guard (Guard & Counter)
  STANDARD_COMBAT_ACTIONS[4], // action_disengage (Tactical Disengage)
  STANDARD_COMBAT_ACTIONS[7]  // action_opportunity_attack (Opportunity Strike)
];

export const STANDARD_SOCIAL_MOVES: CombatActionDefinition[] = [
  STANDARD_COMBAT_ACTIONS[5], // action_social_remark (Sharp Taunt)
  {
    id: "action_menacing_stare",
    name: "Tatapan Dingin Berandal (Menacing Stare / Men-tsuke)",
    actionType: "action",
    category: "social",
    moveKind: "social",
    cost: "Action",
    check: "Looks / Aura vs Target Mind Save",
    effect: "1d6 + Mod Looks Composure Damage & Target Rattled",
    damageDie: "1d6",
    statKey: "looks",
    pros: "Meruntuhkan Nyali: Composure damage tinggi dan membuat lawan ragu.",
    cons: "Kebal Jika Gagal: Jika target berhasil menahan (Save berhasil), target menjadi kebal intimidasi dari karaktermu selama sisa pertempuran.",
    clearEffect: "Rattled: Target mengalami kegentaran batin (Disadvantage pada lemparan aksi berikutnya selama 1 ronde).",
    description: "Menatap tajam dengan sorot mata dingin khas berandal Housen yang menusuk langsung ke rasa percaya diri lawan.",
    range: "20 ft (Pandangan)"
  },
  {
    id: "action_charming_flirt",
    name: "Senyuman Pemikat / Salting (Charming Banter & Witty Flirt)",
    actionType: "action",
    category: "social",
    moveKind: "social",
    cost: "Action",
    check: "Looks / Charm vs Target Mind Save",
    effect: "1d6 + Mod Looks Composure Damage & Target Flustered",
    damageDie: "1d6",
    statKey: "looks",
    pros: "Membuat Salting: Menguras Composure dan melumpuhkan Reaction musuh.",
    cons: "Hanya Efektif pada Target Sadar: Tidak mempan pada lawan yang sedang Berserk atau hilang kesadaran.",
    clearEffect: "Flustered: Target salah tingkah, kehilangan Reaction miliknya ronde ini, dan memberi Advantage pada negosiasi sosial berikutnya.",
    description: "Melontarkan rayuan manis, kedipan mata, atau senyuman percaya diri yang membuat degup jantung target berdebar kencang.",
    range: "15 ft"
  },
  STANDARD_COMBAT_ACTIONS[3], // action_help_support (Support Cheer)
  {
    id: "action_deescalate",
    name: "De-eskalasi & Mediasi Dingin (De-escalate & Truce Call)",
    actionType: "action",
    category: "social",
    moveKind: "social",
    cost: "Action",
    check: "Mind / Composure vs DC 12",
    effect: "+2 Social Guard (SAC) Seluruh Sekutu & Damage Reduction 2 Poin",
    pros: "Proteksi Mental Tim: Memberikan +2 SAC ke semua teman dan mengurangi Composure Damage yang masuk.",
    cons: "Membatalkan provokasi atau taunt yang sedang aktif di lapangan.",
    clearEffect: "Mendinginkan tensi pertempuran; seluruh sekutu dalam jarak 20 ft mendapat +2 SAC dan menyerap 2 Composure Damage selama 1 ronde.",
    description: "Mengangkat tangan dengan tenang, menenangkan kedua pihak yang bersitegang, dan menghentikan eskalasi keributan sebelum guru datang.",
    range: "20 ft (Area)"
  }
];

export function getStatModifierFromScore(score: number): number {
  return Math.floor(((score || 10) - 10) / 2);
}

export interface MoveRollParameters {
  checkDie: string;
  checkMod: number;
  checkLabel: string;
  damageDie?: string;
  damageMod?: number;
  damageLabel?: string;
  isHeal?: boolean;
}

export function resolveMoveRollParameters(
  move: CombatActionDefinition | any,
  charStats?: Record<string, number>
): MoveRollParameters {
  const stats = charStats || {};
  const statKey = move.statKey || (move.category === "basic_social" || move.category === "social" ? "looks" : "physique");
  const statScore = stats[statKey] ?? 10;
  const baseStatMod = getStatModifierFromScore(statScore);

  const rollBonus = move.rollBonus || 0;
  const checkMod = baseStatMod + rollBonus;
  const checkLabel = `${move.name} (Check: ${move.check || 'd20'})`;

  let damageDie = move.damageDie || (move.damage && String(move.damage).match(/(\d*d\d+)/)?.[1]) || undefined;
  if (!damageDie && move.effect && String(move.effect).match(/(\d*d\d+)/)) {
    damageDie = String(move.effect).match(/(\d*d\d+)/)?.[1];
  }
  if (damageDie && damageDie.startsWith("d")) {
    damageDie = "1" + damageDie;
  }
  // If no die found but move does damage (e.g. flat damage or standard)
  if (!damageDie && (move.moveKind === "physical" || move.moveKind === "social") && !move.isHeal && move.category !== "defense" && move.category !== "movement") {
    damageDie = "1d4";
  }

  const damageMod = move.id === "action_shove" ? 0 : baseStatMod;
  const damageDieClean = damageDie ? damageDie.replace(/^1/, "") : undefined;
  const damageLabel = move.isHeal
    ? `Pemulihan: ${move.name}`
    : `Damage/Efek: ${move.name}`;

  return {
    checkDie: "d20",
    checkMod,
    checkLabel,
    damageDie: damageDieClean,
    damageMod,
    damageLabel,
    isHeal: Boolean(move.isHeal)
  };
}

/**
 * Calculates standard saving throw DC using D&D 5e formula:
 * DC = 8 + Proficiency Bonus + Relevant Stat Modifier.
 */
export function calculateCombatSaveDC(
  proficiencyBonus: number,
  abilityModifier: number,
  baseDc: number = 8
): number {
  return baseDc + proficiencyBonus + abilityModifier;
}

/**
 * Resolves shove contest result based on attacker's check vs defender's save.
 */
export function resolveShoveContest(
  attackerRoll: number,
  targetSave: number,
  mode: "push" | "prone" = "push"
): { success: boolean; effect: string } {
  if (attackerRoll >= targetSave) {
    return {
      success: true,
      effect:
        mode === "push"
          ? "Target terdorong 5 ft menjauhi penyerang."
          : "Target terjatuh Prone (tiarap / terjengkang)."
    };
  }
  return {
    success: false,
    effect: "Dorongan gagal; target berhasil menjaga keseimbangan posisi berdirinya."
  };
}

/**
 * Comprehensive Rework Data for all 8 Housen Academy Archetypes.
 * Sourced directly from Saran.txt.
 */
export const ARCHETYPE_REWORK_CATALOG: Record<string, ArchetypeReworkData> = {
  class_clown: {
    id: "class_clown",
    name: "Class Clown (Pelawak Kelas)",
    tagline: "Tukang rusuh positif, pemecah kecanggungan, dan pencair suasana.",
    statBonus: { looks: 1, talent: 2 },
    rollBonus: {
      name: "Funny Bone",
      description:
        "Menambahkan +1d4 Damage Composure pada semua Club Move atau aksi verbal yang berhasil mengejek/mempermalukan lawan."
    },
    socialFocus: {
      name: "Icebreaker",
      description:
        "Karakter otomatis disukai oleh murid-murid berstatus 'Biasa/Kalem'. Memiliki Advantage pada semua Check untuk mencairkan suasana kaku, pertengkaran, atau kecanggungan antar kelompok."
    },
    uniqueTraits: [
      {
        id: "tension_breaker",
        name: "Tension Breaker",
        cost: "1 Action (1x / Short Rest)",
        effect: "Memulihkan 1d6 Composure ke seluruh sekutu dalam radius 30 ft."
      },
      {
        id: "class_buffoon",
        name: "Class Buffoon",
        cost: "Pasif",
        effect:
          "Advantage pada Check untuk berpura-pura konyol, tidak sengaja, atau tidak tahu apa-apa demi menghindari hukuman ringan/teguran guru."
      },
      {
        id: "heckler_resistance",
        name: "Heckler Resistance",
        cost: "Pasif",
        effect:
          "Kebal terhadap status Fluster yang disebabkan oleh ejekan, celaan, atau sorakan penonton/murid lain."
      }
    ]
  },

  delinquent: {
    id: "delinquent",
    name: "Delinquent (Berandalan / Yanki)",
    tagline: "Seragam dasi longgar, tatapan tajam, dan penyelesai masalah jalanan.",
    statBonus: { looks: 1, physique: 2 },
    rollBonus: {
      name: "Heavy Stance",
      description:
        "Menambahkan +2 Damage Fisik/Unarmed saat menyerang target yang memiliki ukuran lebih besar atau level lebih tinggi."
    },
    socialFocus: {
      name: "Street Respect",
      description:
        "Disegani oleh murid berandalan dan anak jalanan. Otomatis lolos tanpa roll saat melakukan Intimidation/Aura Check terhadap murid kelas di bawahmu."
    },
    uniqueTraits: [
      {
        id: "street_crew",
        name: "Street Crew",
        cost: "1x / Long Rest",
        effect:
          "Memanggil 1-2 NPC geng jalanan untuk membantu situasi konflik non-akademik, menjadi distraction, atau mengumpulkan informasi rahasia di luar sekolah."
      },
      {
        id: "street_smart_navigation",
        name: "Street Smart Navigation",
        cost: "Pasif",
        effect:
          "Tahu semua celah rahasia di area sekolah (jalan pintas bolos, area luar jangkauan CCTV, atau lubang pagar)."
      },
      {
        id: "scruffy_durability",
        name: "Scruffy Durability",
        cost: "Pasif",
        effect:
          "Mendapatkan tambahan +2 Temporary HP setiap kali memasuki combat atau pertikaian fisik."
      }
    ]
  },

  emo: {
    id: "emo",
    name: "Emo / Serius",
    tagline: "Duduk di sudut jendela, headphone terpasang, dan sulit ditebak.",
    statBonus: { mind: 2, intelligent: 1 },
    rollBonus: {
      name: "Cold Mind",
      description:
        "Menambahkan +2 pada semua Mind & Emotional Saving Throws. Memiliki Resistance terhadap Composure Damage dari ejekan atau provokasi langsung."
    },
    socialFocus: {
      name: "Unreadable Vibe",
      description:
        "Orang lain tidak bisa membaca emosi atau niat aslimu (Passive Insight/Vibe Check lawan mengalami penalti -5 terhadapmu)."
    },
    uniqueTraits: [
      {
        id: "eerie_silence",
        name: "Eerie Silence",
        cost: "1 Action",
        effect:
          "Memaksa 1 target melakukan Mind Save (DC=8+PB+MNDMod). Jika gagal, target kehilangan 1d6 Composure dan menderita status Shaken karena tatapan dinginmu."
      },
      {
        id: "corner_dweller",
        name: "Corner Dweller",
        cost: "Pasif",
        effect:
          "Saat berada sendirian di area sepi atau sudut ruangan, mendapat bonus +2 Passive Perception."
      },
      {
        id: "headphone_sanctuary",
        name: "Headphone Sanctuary",
        cost: "Pasif",
        effect:
          "Selama menggunakan headphone/earphone, kebal terhadap efek gangguan suara sekitar (Noise/Distraction) dan mendapat Advantage pada Mind Saving Throw melawan provokasi auditori."
      }
    ]
  },

  jock: {
    id: "jock",
    name: "Jock / Sporty",
    tagline: "Bugar, berenergi tinggi, dan selalu bersemangat.",
    statBonus: { talent: 1, physique: 2 },
    rollBonus: {
      name: "Athletic Burst",
      description:
        "Menambahkan +10 ft Movement Speed dan memberikan +2 bonus pada Roll Attack Fisik di ronde pertama pertarungan."
    },
    socialFocus: {
      name: "School Star",
      description:
        "Mudah mendapatkan simpati dari klub olahraga dan guru Penjaskes. Semua Looks Check yang dilakukan sesaat setelah melakukan aksi fisik mendapat Advantage."
    },
    uniqueTraits: [
      {
        id: "adrenaline_rush",
        name: "Adrenaline Rush",
        cost: "Bonus Action (1x per Short Rest)",
        effect:
          "Ketika Physical HP berada di bawah 50%, kamu bisa langsung memulihkan 1d8 Physical HP secara instan."
      },
      {
        id: "second_wind_stamina",
        name: "Second Wind Stamina",
        cost: "Pasif",
        effect:
          "Mengurangi durasi status Fatigue atau Exhaustion akibat aktivitas fisik berat sebesar setengahnya."
      },
      {
        id: "locker_room_locker",
        name: "Locker Room Locker",
        cost: "Pasif",
        effect:
          "Memiliki akses mudah ke fasilitas olahraga sekolah (ruang ganti, alat fitness, kantong es, gudang bola) tanpa memerlukan izin khusus."
      }
    ]
  },

  nerd: {
    id: "nerd",
    name: "Nerd (Murid Ambis / Kutu Buku)",
    tagline: "Kacamata tebal, catatan rapi, dan gudang informasi sekolah.",
    statBonus: { mind: 1, intelligent: 2 },
    rollBonus: {
      name: "Analytical Strike",
      description:
        "Ketika menyerang target yang sudah dianalisis kelemahannya, kamu mendapatkan +1d4 Bonus Damage (Fisik atau Composure)."
    },
    socialFocus: {
      name: "Academic Leverage",
      description:
        "Guru dan staf sekolah memberikan kepercayaan penuh padamu. Kamu bisa memberi 'bantuan PR/tugas' ke murid lain untuk mendapatkan imbalan atau jaminan pertolongan (Social Favor)."
    },
    uniqueTraits: [
      {
        id: "quick_analysis",
        name: "Quick Analysis",
        cost: "Bonus Action",
        effect:
          "Menganalisis kelemahan target. Serangan atau aksi berikutnya terhadap target tersebut mendapat Advantage dan mengabaikan 2 poin Physical/Social AC target."
      },
      {
        id: "speed_reader",
        name: "Speed Reader",
        cost: "Pasif",
        effect:
          "Mampu membaca dan memahami dokumen, lembar tugas, atau catatan akademis 2x lebih cepat dibanding murid biasa."
      },
      {
        id: "correction_instinct",
        name: "Correction Instinct",
        cost: "Reaction (1x per Short Rest)",
        effect:
          "Saat NPC atau sekutu melakukan kesalahan fakta/informasi di depan umum, kamu bisa mengoreksinya secara spontan untuk memberikan penalti -2 pada Social Check mereka berikutnya."
      }
    ]
  },

  normies: {
    id: "normies",
    name: "Normies (Murid Biasa / Kalem)",
    tagline: "Tidak banyak tingkah, pengamat netral, dan jarang terseret masalah.",
    statBonus: {
      physique: 1,
      intelligent: 1,
      looks: 1,
      mind: 1,
      talent: 1,
      luck: 1
    },
    rollBonus: {
      name: "Consistent Average",
      description:
        "(Proficiency Bonus + Level / Long Rest). Reaction: Kamu bisa mengubah hasil d20 pada Check biasa (non-combat) yang mendapatkan nilai d20 di bawah 8 menjadi nilai pasti 9 + Stat Modifier sebelum mengetahui hasil akhir."
    },
    socialFocus: {
      name: "Out of Sight",
      description:
        "Bebas dari radar kecemburuan sosial. Guru BP, OSIS, maupun geng berandalan tidak pernah mencurigaimu sebagai dalang kerusuhan (Bystander Immunity)."
    },
    uniqueTraits: [
      {
        id: "pure_luck",
        name: "Pure Luck",
        cost: "1x per Long Rest",
        effect:
          "Ketika kamu atau sekutu dalam radius 10 ft mengalami kegagalan fatal (Critical Failure) atau menerima dampaknya, kamu bisa membatalkan (revert) kejadian tersebut karena 'kebetulan yang beruntung'."
      },
      {
        id: "unremarkable_face",
        name: "Unremarkable Face",
        cost: "Pasif",
        effect:
          "Guru BP atau petugas keamanan sekolah membutuhkan waktu 2x lebih lama untuk mengenali atau mengidentifikasimu dalam foto/rekaman CCTV blur."
      },
      {
        id: "comfort_zone",
        name: "Comfort Zone",
        cost: "Pasif",
        effect:
          "Mengulur waktu istirahat selama 5 menit saat Short Rest memberikan pemulihan tambahan sebesar +2 Composure."
      }
    ]
  },

  popular_kids: {
    id: "popular_kids",
    name: "Popular Kids (Idola Sekolah / Trendsetter)",
    tagline: "Senyum menawan, selalu jadi pusat perhatian, dan penentu tren.",
    statBonus: { mind: 1, looks: 2 },
    rollBonus: {
      name: "Social Pressure",
      description:
        "Menambahkan +2 pada DC Saving Throw dari semua Club Move yang berbasis Looks."
    },
    socialFocus: {
      name: "Trendsetter",
      description:
        "Advantage Skill untuk mengubah opini publik atau rumor tentang seorang murid hanya dalam waktu 1 hari sekolah melalui kata-kata atau postingan media sosial."
    },
    uniqueTraits: [
      {
        id: "vip_name_drop",
        name: "VIP Name-Drop",
        cost: "Reaction (PB x per Long Rest)",
        effect:
          "Ketika kamu atau sekutumu akan menerima sanksi sekolah, kekerasan, atau penurunan reputasi, kamu bisa menyebut nama figur berpengaruh (alumni/kepala sekolah/donatur) untuk membatalkan aksi negatif tersebut secara instan."
      },
      {
        id: "dress_code_immunity",
        name: "Dress Code Immunity",
        cost: "Pasif",
        effect:
          "Pelanggaran kecil atribut seragam (seperti perhiasan, warna sepatu, atau tatanan rambut) selalu dimaklumi oleh OSIS atau guru selama berada di lingkungan sekolah."
      },
      {
        id: "photogenic_advantage",
        name: "Photogenic Advantage",
        cost: "Pasif",
        effect:
          "Selalu mendapatkan hasil pose sempurna dalam foto atau rekaman video; kebal terhadap foto buruk (unflattering pics) yang coba digunakan murid lain untuk merusak reputasimu."
      }
    ]
  },

  weeb: {
    id: "weeb",
    name: "Weeb (Pecinta Pop Culture / Chuunibyou)",
    tagline: "Imajinasi liar, penuh semangat, dan memiliki dunia sendiri.",
    statBonus: { talent: 1, luck: 2 },
    rollBonus: {
      name: "Dramatic Flare",
      description:
        "Jika kamu memperagakan pose atau mengucapkan nama jurus sebelum melakukan roll, tambahkan +2 pada hasil Roll/Check tersebut."
    },
    socialFocus: {
      name: "Sub-Culture Brotherhood",
      description:
        "Otomatis bersahabat dengan sesama anggota klub hobi, komik, game, atau teknologi. Memiliki Advantage saat mencari barang-barang langka/kolektor di sekolah."
    },
    uniqueTraits: [
      {
        id: "secret_chuunibyou_technique",
        name: "Secret Chuunibyou Technique",
        cost: "1 Action",
        effect:
          "Melakukan serangan emosional dramatis yang memberikan 1d8 Composure Damage. Jika kamu berhasil memperagakan nama jurus unik secara spontan di meja permainan, damage meningkat menjadi 1d10 + LUCK Mod."
      },
      {
        id: "gacha_luck",
        name: "Gacha Luck",
        cost: "1x per Hari Sekolah",
        effect:
          "Saat membeli barang acak (seperti jajanan bermerek, mesin gacha kantin, atau kotak misteri), kamu selalu mendapatkan item varian langka/terbaik."
      },
      {
        id: "obscure_lore_master",
        name: "Obscure Lore Master",
        cost: "Pasif",
        effect:
          "Advantage pada Intelligence Check untuk mengingat detail spesifik mengenai budaya pop, sejarah fiksi, bahasa rahasia, atau rumor aneh di internet."
      }
    ]
  }
};

/**
 * Mechanical Rework Data for all 6 Social Classes in Housen Academy.
 * Sourced directly from Saran.txt.
 */
export const SOCIAL_CLASS_REWORK_CATALOG: Record<string, SocialClassReworkData> = {
  rich: {
    id: "rich",
    name: "Rich (Keluarga Konglomerat / Ningrat)",
    tier: "rich",
    privilege:
      "Beli barang/jasa biasa tanpa roll. 1×/Long Rest gunakan nama/koneksi orang tua untuk membatalkan 1 penalti pelanggaran sekolah atau meminta izin khusus guru.",
    perks: [
      {
        id: "pampered_comfort",
        name: "Pampered Comfort",
        effect: "Memulai hari dengan +2 Temporary Composure."
      }
    ],
    drawback:
      "Disadvantage pada check Street di lingkungan kumuh/pasar, serta menjadi target utama pemerasan dan gosip."
  },

  medium_rich: {
    id: "medium_rich",
    name: "Medium Rich (Keluarga Menengah Atas)",
    tier: "medium_rich",
    privilege:
      "Akses kendaraan pribadi (membawa 1 sekutu berpindah lokasi 2× lebih cepat tanpa memakan waktu/AP).",
    perks: [
      {
        id: "academic_edge_generous",
        name: "Academic Edge & Generous",
        effect:
          "Advantage pada 1 check Academic per hari. 1×/Short Rest saat mentraktir/berbagi konsumsi, berikan +1d4 Composure ke 1 teman."
      }
    ],
    drawback:
      "Disadvantage pada Mind Save melawan status Fluster saat Composure-mu di bawah 50%."
  },

  medium: {
    id: "medium",
    name: "Medium (Keluarga Pegawai Biasa)",
    tier: "medium",
    privilege:
      "Punya bekal makan siang rumah yang hemat operasional harian.",
    perks: [
      {
        id: "home_cooked_balanced",
        name: "Home-Cooked & Balanced",
        effect:
          "Bekal rumah memulihkan ekstra +1d6 Composure saat Short Rest (bisa dibagi). Dapatkan bonus pasif +1 pada seluruh Mind Save."
      }
    ],
    drawback:
      "Karakter biasa tanpa akses koneksi khusus ke figur otoritas maupun jalanan."
  },

  medium_poor: {
    id: "medium_poor",
    name: "Medium Poor (Keluarga Pas-pasan / Berhemat)",
    tier: "medium_poor",
    privilege:
      "Diskon 30% saat membeli item konsumsi/peralatan karena jago menawar.",
    perks: [
      {
        id: "diy_repair",
        name: "DIY Repair",
        effect: "Memperbaiki item/alat rusak tanpa biaya menggunakan barang bekas."
      },
      {
        id: "thrifty_nutrition",
        name: "Thrifty Nutrition",
        effect:
          "Memulihkan +1d4 HP/Composure tambahan tiap kali menggunakan item konsumsi paling murah."
      },
      {
        id: "resourceful_eye",
        name: "Resourceful Eye",
        effect:
          "Advantage saat mencari barang bekas atau alat berguna di area sekolah/kota."
      }
    ],
    drawback:
      "Penalti -2 check Charm saat berada di tempat mewah atau acara sosial elite."
  },

  orphanage: {
    id: "orphanage",
    name: "Orphanage (Anak Asuh Panti / Hidup Mandiri)",
    tier: "orphanage",
    privilege: "Kehidupan mandiri dengan insting gotong royong tinggi, modal uang sangat minim.",
    perks: [
      {
        id: "found_family_shield",
        name: "Found Family Shield",
        cost: "Bonus Action",
        effect:
          "Saat membantu sekutu yang HP/Composure-nya di bawah 50%, dapatkan bonus +2 Guard (AC) fisik & sosial."
      },
      {
        id: "shared_pain",
        name: "Shared Pain (Empathy)",
        limit: "1x / Long Rest",
        effect:
          "Saat sekutu dalam jarak 15 ft menerima damage Composure, kamu bisa menanggung setengah damage tersebut."
      },
      {
        id: "street_kinship",
        name: "Street Kinship",
        effect:
          "Advantage check People saat berinteraksi dengan sesama karakter tersisih/NPC kelas bawah."
      }
    ],
    drawback:
      "Disadvantage check Influence saat bernegosiasi dengan figur otoritas sekolah (guru/staf/OSIS)."
  },

  poor: {
    id: "poor",
    name: "Poor (Keluarga Kurang Mampu / Pejuang Hidup)",
    tier: "poor",
    privilege: "Hampir tidak ada modal finansial/koneksi resmi.",
    perks: [
      {
        id: "unbreakable_determination",
        name: "Unbreakable Determination",
        effect:
          "Saat Physical HP atau Composure-mu menyentuh angka 0 pertama kali dalam satu sesi, roll d20: hasil 8+ membuatmu bertahan di 1 HP/Composure."
      },
      {
        id: "hard_work_stamina",
        name: "Hard Work Stamina",
        effect:
          "Advantage permanen pada semua check Stamina dan Street. Imun terhadap penalti kelelahan tingkat pertama dan cuaca ekstrem."
      },
      {
        id: "brawler_spirit",
        name: "Brawler Spirit",
        effect:
          "Saat bertarung tanpa senjata/alat mewah, serangan fisikmu memberikan +2 damage tambahan."
      }
    ],
    drawback:
      "Guru BP dan satpam selalu mencurigaimu lebih dulu saat terjadi kekacauan di sekolah."
  }
};

export const ALL_REWORKED_ARCHETYPE_IDS = Object.keys(ARCHETYPE_REWORK_CATALOG);
export const ALL_REWORKED_SOCIAL_CLASS_IDS = Object.keys(SOCIAL_CLASS_REWORK_CATALOG);

export function getArchetypeReworkData(id: string): ArchetypeReworkData | undefined {
  return ARCHETYPE_REWORK_CATALOG[id];
}

export function getSocialClassReworkData(id: string): SocialClassReworkData | undefined {
  return SOCIAL_CLASS_REWORK_CATALOG[id];
}
