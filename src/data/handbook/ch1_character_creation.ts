import { HandbookChapter } from "./types";

export const ch1_character_creation: HandbookChapter = {
  id: "chapter-1-character-creation",
  number: 1,
  japaneseTitle: "第１章 : キャラクター作成と成長",
  title: "Bab 1: Pembuatan Karakter & Progresi Murid",
  subtitle: "Enam Langkah Membentuk Murid SMA Impianmu di Housen High & Sistem Progresi Kelas 10–12",
  summary: "Panduan sistematis pembuatan lembar karakter mulai dari konsep, archetype, klub ekskul, kelas sosial, skor atribut, Origin Feat, hingga tabel kenaikan level 1–6 dan kompendium 100 bakat (feats).",
  leadParagraph: "Menciptakan murid SMA di Damsel & Desire adalah proses menuangkan imajinasi dan jiwa ke dalam lembaran biodata sekolah. Apakah karaktermu berandalan berjaket sobek yang diam-diam suka memelihara kucing liar, atau atlet basket karismatik yang gugup setengah mati saat diajak mengobrol berdua? Ikuti panduan pembuatan karakter dan sistem progresi 6 tingkat ini.",
  sections: [
    {
      id: "ch1-sec1",
      title: "Enam Langkah Pembuatan Karakter",
      contentHtml: `
        <p><span class="phb-drop-cap">U</span>ntuk memulai petualanganmu di SMA Housen, ikuti 6 tahapan terstruktur berikut ini:</p>
        <ol>
          <li><strong>Tentukan Konsep &amp; Identitas Karakter:</strong> Pilih nama lengkap, nama panggilan, gender, dan penampilan khas (gaya seragam, potongan rambut, atau aksesori unik).</li>
          <li><strong>Pilih Archetype Karakter (Ras / Trope):</strong> Pilih salah satu dari 8 arketipe anime (seperti Delinquent, Jock, Nerd, Class Clown, Emo, Weeb, Popular Kids, atau Normies). Archetype memberikan bonus skor atribut bawaan, passive traits, dan 3 jurus khas (Archetype Moves).</li>
          <li><strong>Bergabung dengan Klub Ekskul (Class):</strong> Tentukan wadah ekstrakulikuler karaktermu di antara 16 klub sekolah. Ekskul menentukan jenis dadu daya tahan (Hit Die: d6, d8, atau d10), profisiensi saving throws, fasilitas khusus sekolah, 3 jurus klub (Club Moves), dan 2 cabang spesialisasi (Subclass).</li>
          <li><strong>Tentukan Latar Kelas Sosial (Background):</strong> Pilih status ekonomi keluarga dari 6 tingkatan sosial (Rich, Medium Rich, Medium, Medium Poor, Poor, Orphanage). Pilihan ini menentukan uang jajan harian, saldo tabungan awal di bank, dan barang bawaan status.</li>
          <li><strong>Alokasikan 6 Skor Atribut:</strong> Bagikan nilai ke enam atribut: Physique, Intelligent, Looks, Mind, Talent, dan Luck menggunakan <em>Standard Array</em> atau <em>Point Buy</em>.</li>
          <li><strong>Pilih Origin Feat, Hitung Vitalitas &amp; Tulis Kisah (Backstory):</strong> Pilih 1 dari 20 <em>Origin Feat</em> khas Kelas 10 untuk mencerminkan kebiasaan masa lalumu, hitung Physical AC, Physical HP, Social AC, Composure, lalu lengkapi 4 aspek kepribadian: Personality, Ideals, Bonds, dan Flaws.</li>
        </ol>
      `
    },
    {
      id: "ch1-sec2",
      title: "Penentuan Skor Atribut",
      subtitle: "Standard Array vs Point Buy 27 Poin",
      contentHtml: `
        <p>Setiap karakter memiliki 6 atribut utama yang mencerminkan kapabilitas fisik, mental, estetika, dan takdir mereka. Kamu dapat menentukan angka atribut menggunakan salah satu dari dua metode resmi berikut:</p>
        <h4>Metode A: Standard Array (Direkomendasikan untuk Pemula)</h4>
        <p>Gunakan enam angka berikut dan distribusikan ke 6 atribut sesuai keinginanmu: <strong>15, 14, 13, 12, 10, 8</strong>.</p>
        
        <h4>Metode B: Point Buy (Kustomisasi Penuh 27 Poin)</h4>
        <p>Seluruh atribut dimulai dari angka dasar <strong>8</strong>. Kamu memiliki total <strong>27 poin</strong> belanja untuk menaikkan skor atribut hingga batas maksimal <strong>15</strong> sebelum ditambah bonus archetype.</p>
      `,
      tables: [
        {
          caption: "Tabel Biaya Pembelian Poin (Point Buy Cost)",
          headers: ["Skor Atribut", "Biaya Poin"],
          rows: [
            ["8", "0 Poin"],
            ["9", "1 Poin"],
            ["10", "2 Poin"],
            ["11", "3 Poin"],
            ["12", "4 Poin"],
            ["13", "5 Poin"],
            ["14", "7 Poin"],
            ["15", "9 Poin"]
          ]
        }
      ]
    },
    {
      id: "ch1-sec3",
      title: "Perhitungan Modifier & Bonus Profisiensi",
      contentHtml: `
        <p>Skor atribut (misalnya 14 atau 16) menghasilkan <strong>Modifier (Mod)</strong> yang menjadi angka inti penjumlahan pada setiap lemparan d20.</p>
        <div class="phb-formula-box">
          <span class="phb-formula-title">RUMUS MODIFIER ATRIBUT:</span>
          <code>Modifier = Pembulatan Ke Bawah [ (Skor Atribut - 10) / 2 ]</code>
        </div>
      `,
      tables: [
        {
          caption: "Tabel Konversi Skor ke Modifier",
          headers: ["Skor Atribut", "Modifier", "Skor Atribut", "Modifier"],
          rows: [
            ["8 – 9", "-1", "16 – 17", "+3"],
            ["10 – 11", "+0", "18 – 19", "+4"],
            ["12 – 13", "+1", "20 – 21", "+5"],
            ["14 – 15", "+2", "22+", "+6"]
          ]
        }
      ],
      callouts: [
        {
          type: "tip",
          title: "Contoh Kasus Perhitungan",
          content: "Rei adalah murid Kelas X (Prof Bonus = +2). Skor <em>Looks</em> miliknya adalah 15 (+2). Jika Rei mahir dalam keahlian <strong>Charm</strong>, maka saat merayu seseorang lemparan dadunya adalah <code>d20 + 2 (Mod Looks) + 2 (Prof Bonus) = d20 + 4</code>."
        }
      ]
    },
    {
      id: "ch1-sec4",
      title: "Sistem Progresi Level 1–6 (Jenjang Kelas 10–12)",
      subtitle: "Kenaikan Jenjang, Pertumbuhan HP/Composure & Dadu Istirahat",
      leadParagraph: "Perjalanan di SMA Housen terbentang selama 3 tahun ajaran dengan total 6 tingkat progresi (Level 1 sampai 6).",
      contentHtml: `
        <p>Setiap level mewakili satu semester masa sekolah. Karakter berkembang tidak hanya melalui reputasi dan pergaulan, namun juga penguasaan jurus ekskul, spesialisasi subclass, peningkatan atribut, dan perluasan cadangan stamina.</p>
        
        <h4>Rumus Pertumbuhan Vitalitas per Kenaikan Level</h4>
        <div class="phb-formula-box">
          <span class="phb-formula-title">PHYSICAL HP MAKSIMAL:</span>
          <ul>
            <li><strong>Level 1:</strong> <code>Sisi Maksimal Hit Die Klub + Mod Physique (+2 Delinquent) (+2 Built Different)</code></li>
            <li><strong>Level 2–6 (per level):</strong> <code>Nilai Rata-rata Hit Die (d6=4, d8=5, d10=6) + Mod Physique (+2 Delinquent) (+2 Built Different)</code> (Min. 1 HP)</li>
          </ul>
        </div>
        <div class="phb-formula-box" style="margin-top: 10px;">
          <span class="phb-formula-title">COMPOSURE MAKSIMAL (KETAHANAN SOSIAL):</span>
          <ul>
            <li><strong>Level 1:</strong> <code>10 + Modifier Mind (+2 Who's Gonna Carry The Boats)</code></li>
            <li><strong>Level 2–6 (per level):</strong> <code>4 + Modifier Mind (+2 Who's Gonna Carry The Boats)</code> (Min. 1 Composure)</li>
          </ul>
        </div>

        <h4>Dadu Istirahat (Rest Dice) Berdasarkan Jenjang Kelas</h4>
        <p>Dadu istirahat digunakan saat Short Rest untuk memulihkan HP atau Composure. Jumlah dadu pulih bertambah seiring kedewasaan jenjang kelas murid:</p>
        <ul>
          <li><strong>Kelas 10 (Level 1–2):</strong> 1 Rest Die per Short Rest.</li>
          <li><strong>Kelas 11 (Level 3–4):</strong> 2 Rest Dice per Short Rest.</li>
          <li><strong>Kelas 12 (Level 5–6):</strong> 3 Rest Dice per Short Rest.</li>
        </ul>
      `,
      tables: [
        {
          caption: "Tabel Progresi Murid SMA Housen (Level 1–6)",
          headers: ["Level", "Jenjang Kelas & Semester", "Prof. Bonus", "Rest Dice", "Fitur & Peningkatan Kemampuan yang Dibuka"],
          rows: [
            ["Level 1", "Kelas 10 — Semester 1", "+2", "1 Dadu", "Pembuatan Karakter, Fitur Dasar Archetype, Klub Ekskul, 1 Origin Feat"],
            ["Level 2", "Kelas 10 — Semester 2", "+2", "1 Dadu", "Unlock Club Move 1 (Tingkat 10), Pilihan 1st Grade Feat atau ASI (+2/+1)"],
            ["Level 3", "Kelas 11 — Semester 1", "+2", "2 Dadu", "Pemilihan Subclass Ekskul, Unlock Subclass Move Tier 1 (G11)"],
            ["Level 4", "Kelas 11 — Semester 2", "+2", "2 Dadu", "Unlock Club Move 2 (Tingkat 11), Pilihan 2nd Grade Feat atau ASI (+2/+1)"],
            ["Level 5", "Kelas 12 — Semester 1", "+3", "3 Dadu", "Peningkatan Proficiency Bonus (+3), Unlock Subclass Move Tier 2 (G12)"],
            ["Level 6", "Kelas 12 — Semester 2", "+3", "3 Dadu", "Puncak Kelulusan! Unlock Club Move 3 (Tingkat 12), 3rd Grade Feat / ASI"]
          ]
        }
      ],
      callouts: [
        {
          type: "rule",
          title: "Ability Score Improvement (ASI) vs Feats",
          content: "Pada Level 2, 4, dan 6 (Grade Feat Milestones), pemain dapat memilih antara: (a) <strong>1 Feat Pilihan</strong> dari katalog General Feat atau Origin Feat yang memenuhi syarat, ATAU (b) <strong>Ability Score Improvement (ASI)</strong> berupa +2 pada satu atribut atau +1 pada dua atribut berbeda (maksimal 20 sebelum bonus item)."
        }
      ]
    },
    {
      id: "ch1-sec5",
      title: "Kompendium Bakat Siswa (Feats System)",
      subtitle: "20 Origin Feats, Grade Feats, & Rumpun Kemampuan Khusus",
      leadParagraph: "Bakat (Feat) mencerminkan keunikan talenta, gaya hidup, atau reputasi khusus yang membedakan karaktermu dari murid SMA biasa.",
      contentHtml: `
        <p>Sistem Feats di Damsel & Desire terbagi dalam 3 kategori utama:</p>
        <ol>
          <li><strong>Origin Feats (Khusus Kelas 10 / Pembuatan Karakter):</strong> 20 bakat awal yang menggambarkan latar belakang masa SMP dan kebiasaan hidup sehari-hari. Setiap karakter memilih tepat <strong>1 Origin Feat</strong> di Level 1.</li>
          <li><strong>General Feats (Bakat Peminatan Atribut):</strong> Lebih dari 70 bakat spesifik yang dapat diambil saat mencapai jenjang kelas baru (Level 2, 4, 6) guna memperkuat gaya bertarung fisik, ketahanan mental, karisma sosial, kecerdasan akademik, atau manipulasi keberuntungan.</li>
          <li><strong>Achievement Feats (Reputasi Legendaris Sekolah):</strong> Bakat prestisius yang diraih melalui pencapaian prestasi besar di sekolah (seperti Valedictorian, MVP Regional, atau Viral Sensation).</li>
        </ol>

        <h4>Daftar Lengkap 20 Origin Feats (Tingkat Awal)</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin: 16px 0;">
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Multitalent</strong><span class="phb-stat-badge">Skill</span></div>
            <p>Pilih 2 dan langsung mahir (Proficient) pada sub-keahlian dari rumpun <em>Intelligent</em> atau <em>Talent</em>.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Social Butterfly</strong><span class="phb-stat-badge">Social</span></div>
            <p>Proficient pada People atau Interpersonal. Kamu tidak bisa memberikan impresi pertama yang buruk dalam interaksi sosial.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Gym Bro</strong><span class="phb-stat-badge">Physique</span></div>
            <p>Proficient pada 1 skill Physique pilihan. Dapatkan Temporary HP sebesar Proficiency Bonus setelah menyelesaikan Long Rest.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Teacher’s Pet</strong><span class="phb-stat-badge">Social</span></div>
            <p>Advantage pada check Influence ke OSIS, guru, dan staf sekolah. 1x/hari dapat meminta izin resmi (surat jalan, akses kunci) tanpa lempar dadu.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Night Owl</strong><span class="phb-stat-badge">Lifestyle</span></div>
            <p>Resisten terhadap efek Fatigue karena begadang. +5 semua skill check saat malam hari, namun -5 semua check pada jam pelajaran pertama.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Hot Headed</strong><span class="phb-stat-badge">Combat</span></div>
            <p>Proficient Power. Sebanyak PBx per pertempuran, saat menerima damage fisik dari lawan berjarak 5 ft, gunakan Reaction untuk langsung membalas memukul.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Hustler</strong><span class="phb-stat-badge">Finance</span></div>
            <p>Proficient Street. Tidak bisa diberi status Disadvantage pada check Street, dan mendapatkan tambahan uang jajan harian sebesar +50%.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Foodie</strong><span class="phb-stat-badge">Support</span></div>
            <p>Proficient Creative dengan Advantage check memasak. Siapa pun yang memakan bekal/masakan buatanmu memulihkan 1d6 Composure.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Loner</strong><span class="phb-stat-badge">Defense</span></div>
            <p>Proficient Awareness. Mendapatkan bonus +2 Physical AC dan +2 Social AC ketika tidak ada orang lain dalam radius 15 ft.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Drama Queen</strong><span class="phb-stat-badge">Mind</span></div>
            <p>Proficient Looks atau Talent. 1x per Long Rest gunakan Reaction saat Composure menyentuh 0 untuk langsung memulihkan Composure sepenuhnya!</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Parkour Kid</strong><span class="phb-stat-badge">Mobility</span></div>
            <p>Proficient Agility. Resisten terhadap damage jatuh, dan sepenuhnya kebal terhadap Composure damage yang diakibatkan insiden memalukan saat jatuh.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Alpha Wolf</strong><span class="phb-stat-badge">Aura</span></div>
            <p>Proficient Aura. Memberikan bonus sebesar level karaktermu pada check Aura milikmu dan seluruh kawan dalam radius 10 ft.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Overthinker</strong><span class="phb-stat-badge">Mind</span></div>
            <p>Proficient Awareness atau Academic. Mendapatkan bonus permanen +2 pada Passive Perception dan Passive Investigation.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Early Bird</strong><span class="phb-stat-badge">Composure</span></div>
            <p>Proficient Stamina atau Awareness. Mendapatkan Temporary Composure harian sebesar Proficiency Bonus setiap pagi.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Strict Parents</strong><span class="phb-stat-badge">Discipline</span></div>
            <p>Proficient Academic atau Emotional. Advantage pada semua Saving Throw menghadapi tekanan psikologis atau perintah figur otoritas.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Superstitious</strong><span class="phb-stat-badge">Luck</span></div>
            <p>Proficient 1 skill Luck pilihan. 1x per Short Rest, sebelum melempar d20, kamu berhak menanyakan angka DC pasti kepada DM.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Pro Gamer</strong><span class="phb-stat-badge">Hobby</span></div>
            <p>Proficient 1 skill Intelligent. Advantage pada seluruh check yang melibatkan video game, konsol, forum sekolah, atau analisis pola musuh.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Weak Hero</strong><span class="phb-stat-badge">Courage</span></div>
            <p>Proficient 1 skill Mind. Advantage pada check Intimidate/Aura saat membela orang lain yang tertindas (namun Disadvantage jika untuk membela diri sendiri).</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Transfer Student</strong><span class="phb-stat-badge">Social</span></div>
            <p>Proficient 1 skill Intelligent dan 1 bahasa asing. Memperoleh Advantage pada check Street di lingkungan atau area yang baru pertama kali kamu datangi.</p>
          </div>
          <div class="phb-stat-card">
            <div class="phb-stat-header"><strong>Clumsy</strong><span class="phb-stat-badge">Flaw/Luck</span></div>
            <p>Mendapatkan bonus +2 pada seluruh skill rumpun Luck, namun menderita Disadvantage permanen pada check Agility dan Agility Saving Throw.</p>
          </div>
        </div>

        <h4>Ringkasan General Feats Berdasarkan Atribut (Grade 11 &amp; 12)</h4>
        <p>Di jenjang kelas yang lebih tinggi (Level 2, 4, 6), kamu dapat memilih General Feats yang memberikan peningkatan skor atribut (+1) beserta efek tempur atau sosial:</p>
        <ul>
          <li><strong>Physique:</strong> <em>Haymaker</em> (-2 to-hit untuk +4 damage), <em>Built Different</em> (+2 HP/level), <em>Sprinter</em> (+10 ft speed &amp; bebas opportunity attack), <em>Heavy Hitter</em> (roll 2 dadu damage ambil tertinggi), <em>High Guard</em> (+2 AC Reaction).</li>
          <li><strong>Mind:</strong> <em>Iron Will</em> (+1 Mind, kebal Frightened/Salting 1x/rest), <em>Who's Gonna Carry The Boats</em> (+2 Composure/level), <em>Photographic Memory</em> (ingat seluruh detail percakapan &amp; dokumen tanpa roll), <em>Poker Face</em> (+2 Social AC).</li>
          <li><strong>Looks:</strong> <em>Silver Tongue</em> (minimum d20 adalah 8 untuk check Deception/Persuasion), <em>Idol Presence</em> (musuh harus roll Composure Save sebelum bisa menyerangmu), <em>Heartthrob</em> (+1 Heart Token saat berhasil membuat NPC tersipu).</li>
          <li><strong>Intelligent:</strong> <em>Academic Weapon</em> (selalu peringkat 3 besar ujian tanpa roll), <em>Fast Learner</em> (+1 Profisiensi skill baru), <em>Mastermind</em> (berikan instruksi taktis sebagai Bonus Action untuk +1d4 roll sekutu).</li>
          <li><strong>Talent:</strong> <em>Prodigy</em> (pilih 1 keahlian untuk mendapatkan Expertise/dobel Proficiency Bonus), <em>Showstopper</em> (pukulan panggung yang memukau penonton), <em>Flashy Moves</em> (tambah +1d6 performa pada serangan berturut).</li>
          <li><strong>Luck:</strong> <em>Second Chance</em> (reroll 1x per rest), <em>Devil's Luck</em> (ubah Natural 1 menjadi Natural 20 1x/campaign), <em>Miracle Worker</em> (sukses otomatis pada Meltdown/Death Save kritis).</li>
        </ul>
      `
    }
  ]
};
