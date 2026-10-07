import { HandbookChapter } from "./types";

export const ch2_abilities_skills: HandbookChapter = {
  id: "chapter-2-abilities-skills",
  number: 2,
  japaneseTitle: "第２章 : 能力値とスキル",
  title: "Bab 2: Enam Atribut & 18 Sub-Keahlian",
  subtitle: "Penjelasan Lengkap Kemampuan Karakter, Indra Pasif, dan Saving Throws",
  summary: "Rincian menyeluruh enam atribut utama (PHY, INT, LOK, MND, TLN, LCK), delapan belas sub-keahlian sekolah, indra pasif pengamatan, dan lemparan penyelamatan.",
  leadParagraph: "Tidak ada murid SMA yang sempurna dalam segala hal. Sebagian dikaruniai refleks fisik luar biasa di lapangan olahraga, sebagian memiliki ketajaman otak menghafal rumus olimpiade, sementara sebagian lainnya diberkahi senyuman memikat yang sanggup meluluhkan hati siapa saja.",
  sections: [
    {
      id: "ch2-sec1",
      title: "Enam Atribut Karakter (Abilities)",
      contentHtml: `
        <p><span class="phb-drop-cap">E</span>nam atribut utama menggambarkan fondasi potensi diri seorang murid:</p>
        <div class="phb-stat-grid">
          <div class="phb-stat-card">
            <h4>PHYSIQUE (PHY)</h4>
            <span class="phb-stat-badge">Kekuatan &amp; Raga</span>
            <p>Kekuatan otot, ketahanan tubuh terhadap kelelahan, kelenturan motorik, dan kecepatan berlari. Ekivalen dengan perpaduan STR/DEX/CON dalam D&amp;D 5e.</p>
          </div>
          <div class="phb-stat-card">
            <h4>INTELLIGENT (INT)</h4>
            <span class="phb-stat-badge">Nalar &amp; Pengetahuan</span>
            <p>Kemampuan logika akademis, daya analisis, kecerdasan teknologi/gawai, pemahaman strategi, dan akal-akalan bertahan hidup di jalanan.</p>
          </div>
          <div class="phb-stat-card">
            <h4>LOOKS (LOK)</h4>
            <span class="phb-stat-badge">Pesona &amp; Penampilan</span>
            <p>Daya tarik estetika visual, gaya berbusana modis, pesona senyuman, aura intimidatif atau menawan, serta pengaruh status reputasi sosial.</p>
          </div>
          <div class="phb-stat-card">
            <h4>MIND (MND)</h4>
            <span class="phb-stat-badge">Keteguhan Jiwa</span>
            <p>Kekuatan mental menahan rasa malu/salting, ketenangan batin, empati peka mendengarkan perasaan orang lain, dan kepekaan membaca atmosfer sekitar.</p>
          </div>
          <div class="phb-stat-card">
            <h4>TALENT (TLN)</h4>
            <span class="phb-stat-badge">Bakat &amp; Seni</span>
            <p>Bakat alami kreativitas, panggung pertunjukan (akting, musik, vokal), seni lukis, keluwesan berimprovisasi, dan keanggunan ekspresi.</p>
          </div>
          <div class="phb-stat-card">
            <h4>LUCK (LCK)</h4>
            <span class="phb-stat-badge">Takdir &amp; Hoki</span>
            <p>Faktor keberuntungan murni, takdir kasmaran tidak terduga, lolos razia sidak guru karena kebetulan ajaib, dan kebetulan klise anime.</p>
          </div>
        </div>
      `
    },
    {
      id: "ch2-sec2",
      title: "18 Sub-Keahlian Tematik Sekolah (Skills)",
      contentHtml: `
        <p>Setiap atribut membawahi 3 keahlian spesifik yang sering diuji dalam rutinitas kehidupan sekolah:</p>
      `,
      tables: [
        {
          caption: "Daftar Lengkap 18 Sub-Keahlian Sekolah",
          headers: ["Atribut", "Sub-Keahlian", "Deskripsi & Contoh Penggunaan di Sekolah"],
          rows: [
            ["Physique", "Power", "Angkat beban, mendobrak pintu loker/gudang, mendorong, adu tenaga panco, memukul."],
            ["Physique", "Agility", "Kelincahan refleks, memanjat pagar gerbang sekolah, lari kejar kereta, melompat."],
            ["Physique", "Stamina", "Daya tahan maraton, begadang belajar tanpa tumbang, tahan benturan fisik, tidak mudah sakit."],
            ["Intelligent", "Academic", "Materi ujian sekolah, rumus fisika/matematika, sejarah, hafalan teori pelajaran umum."],
            ["Intelligent", "People", "Membaca psikologi lawan, menganalisis bahasa tubuh, mendeteksi kebohongan atau rasa salting."],
            ["Intelligent", "Street", "Tahu jalan pintas rahasia kota, gosip geng luar sekolah, tempat nongkrong murah, trik jalanan."],
            ["Looks", "Charm", "Pesona personal, kedipan mata menawan, rayuan kasmaran, senyum manis meluluhkan amarah."],
            ["Looks", "Influence", "Pengaruh reputasi di kalangan murid, disegani junior, didengar ketua OSIS, pengaruh tren modis."],
            ["Looks", "Aura", "Kehadiran tatapan tajam berwibawa, aura intimidatif berandalan, atau karisma dingin misterius."],
            ["Mind", "Emotional", "Jaga imej (jaim), menahan rona merah pipi saat digoda, menahan tangis, menguasai kecemasan."],
            ["Mind", "Interpersonal", "Mendengarkan curhat tulus, peka terhadap perasaan teman yang terpendam, merajut empati batin."],
            ["Mind", "Awareness", "Membaca atmosfer sosial (Kuuki Yomeru), menyadari ada yang sedang mengintai atau curi-curi pandang."],
            ["Talent", "Creative", "Menulis surat cinta puitis, membuat konsep dekorasi festival budaya, menggambar sketsa."],
            ["Talent", "Performance", "Akting drama panggung, bernyanyi karaoke, memetik gitar solo, pidato memukau di podium."],
            ["Talent", "Adaptability", "Improvisasi kilat saat naskah lupa, mencairkan keheningan canggung, mencari topik obrolan darurat."],
            ["Luck", "Relationship Luck", "Tabrakan bawa roti di belokan jalan, satu payung berdua saat hujan dadakan, kencan tak terduga."],
            ["Luck", "Situation Luck", "Lolos razia sidak handphone guru BP, menemukan uang koin jatuh di bawah vending machine."],
            ["Luck", "Academic Luck", "Menebak pilihan ganda saat buntu dan ternyata benar, materi yang dibaca iseng pas keluar ujian."]
          ]
        }
      ]
    },
    {
      id: "ch2-sec3",
      title: "Indra Pasif & Saving Throws",
      contentHtml: `
        <h4>Indra Pasif (Passive Senses)</h4>
        <p>Indra pasif mencerminkan kesadaran naluriah karakter tanpa perlu melempar dadu secara aktif. Nilai dasarnya adalah <code>10 + Modifier Terkait + Bonus Profisiensi (Jika Mahir)</code>.</p>
        <ul>
          <li><strong>Passive Perception (10 + Mod Mind + Awareness):</strong> Mendengar bisikan gosip di meja belakang atau menyadari bau asap rokok anak bandel di toilet.</li>
          <li><strong>Passive Insight (10 + Mod Intelligent + People):</strong> Mengetahui secara instan bila teman sebangku sedang menyembunyikan masalah berat dari nada bicaranya.</li>
          <li><strong>Passive Investigation (10 + Mod Intelligent + Academic):</strong> Sekilas melihat kejanggalan dalam jadwal piket atau surat izin palsu.</li>
        </ul>

        <h4>Lemparan Penyelamatan (Saving Throws)</h4>
        <p>Saat karakter kalian menjadi target efek mendadak—seperti dilempar bola basket nyasar, disemprot pertanyaan jebakan oleh guru killer, atau digoda habis-habisan oleh kakak kelas idola—DM akan meminta <strong>Saving Throw</strong> untuk melihat apakah karakter kalian mampu bertahan atau terjerumus efek negatif.</p>
      `,
      callouts: [
        {
          type: "rule",
          title: "Pembedaan Save Fisik vs Save Mental",
          content: "<strong>Save Fisik (Physique / Talent):</strong> Menghindari serangan fisik mendadak, menahan rasa sakit terjatuh, atau tidak pingsan.<br><strong>Save Mental (Mind / Intelligent / Looks):</strong> Menahan rasa malu agar tidak salah tingkah (Salting), menolak godaan romansa, atau tidak terintimidasi gertakan lawan."
        }
      ]
    }
  ]
};
