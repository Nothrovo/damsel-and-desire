import { HandbookChapter } from "./types";

export const CHAPTER_8_ENCOUNTER_RULES: HandbookChapter = {
  id: "chapter-8-encounter-rules",
  number: 8,
  japaneseTitle: "第八章：遭遇と対決ルール (Mekanik Pertemuan & Konflik)",
  title: "Mekanik Pertemuan & Konflik Sekolah",
  subtitle: "Inisiatif Cepat, Alur Putaran Ronde, Serangan Fisik vs Serangan Sosial, Reaksi & Jarak Gerak",
  summary: "Panduan lengkap menjalankan adegan perkelahian di belakang gedung sekolah, perdebatan sengit OSIS, hingga konfrontasi cinta segitiga.",
  leadParagraph: "Ketika kata-kata manis atau negosiasi santai menemui jalan buntu, ketegangan meletus menjadi adegan pertempuran atau konfrontasi terbuka (Encounter). Pertemuan dalam Damsel & Desire tidak hanya mencakup perkelahian fisik antar berandalan, melainkan juga perdebatan sengit di mimbar dewan sekolah, adu tatapan di ruang klub, hingga penggerebekan sidak mendadak oleh guru BP.",
  sections: [
    {
      id: "initiative-order",
      title: "Inisiatif & Urutan Giliran",
      leadParagraph: "Menentukan siapa yang bertindak lebih dulu saat ketegangan memuncak.",
      contentHtml: `<p>Saat Encounter dimulai, seluruh peserta melempar dadu inisiatif:</p>
      <p style="font-size: 1.1rem; font-weight: bold; background: rgba(225, 29, 72, 0.08); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(225, 29, 72, 0.2);">
        Inisiatif = d20 + Modifier Agility (Physique) ATAU Modifier People (Intelligent)
      </p>
      <p>Pemain dapat memilih apakah karakter mereka bereaksi menggunakan kecepatan motorik fisik (Agility) atau kecepatan membaca situasi psikologis (People). Murid dengan arketipe <em>Nerd</em> dapat menambahkan bonus Modifier Intelligent berkat keistimewaan <em>Persiapan Matang</em>.</p>
      <p>Peserta dengan angka inisiatif tertinggi bertindak pertama, diikuti urutan menurun hingga semua mendapat giliran dalam satu putaran (Ronde = setara 6 detik dalam waktu cerita).</p>`
    },
    {
      id: "turn-economy",
      title: "Ekonomi Aksi per Giliran",
      leadParagraph: "Setiap karakter memiliki anggaran aksi standar dalam satu giliran:",
      contentHtml: `<p>Dalam gilirannya, seorang karakter dapat melakukan kombinasi berikut:</p>
      <ol>
        <li><strong>Pergerakan (Movement):</strong> Bergerak hingga batas kecepatan dasar (standar: 30 ft atau sekitar 9 meter di koridor/ruang kelas). Pergerakan dapat dipecah sebelum dan sesudah aksi.</li>
        <li><strong>Aksi Utama (Action):</strong> Satu tindakan besar utama yang menentukan giliran (menyerang fisik, melancarkan sindiran sosial, menggunakan jurus klub/arketipe, menolong teman, dsb).</li>
        <li><strong>Aksi Tambahan (Bonus Action):</strong> Tindakan cepat sampingan yang hanya bisa dilakukan jika memiliki jurus, item, atau keistimewaan khusus yang berlabel <em>Bonus Action</em>.</li>
        <li><strong>Interaksi Objek Gratis (Free Object Interaction):</strong> Membuka pintu kelas, mengambil pensil dari meja, atau mengeluarkan HP dari saku.</li>
      </ol>
      <p>Selain itu, setiap karakter memiliki <strong>1 Reaksi (Reaction)</strong> per ronde yang dapat dipicu di luar gilirannya saat ada pemicu eksternal (misalnya membalas ejekan dengan <em>Kata Tajam Terakhir</em> atau menepis pukulan dengan <em>Kendo Parry</em>).</p>`,
      tables: [
        {
          caption: "Daftar Aksi Standar yang Dapat Dipilih Karakter",
          headers: ["Aksi (Action)", "Tipe", "Penjelasan Singkat"],
          rows: [
            ["Serangan Fisik (Physical Attack)", "Serangan", "Memukul, menendang, melempar bola, atau menebas Shinai ke target"],
            ["Serangan Sosial (Social Attack)", "Sosial", "Menyindir, menggoda, menatap tajam, atau membantah fakta untuk menguras Composure"],
            ["Gunakan Jurus (Use Move)", "Spesial", "Memicu Archetype Move atau Club Move yang tertera di lembar karakter"],
            ["Gunakan Item (Use Item)", "Utility", "Meminum susu kotak, meneteskan obat mata, atau memakai alat P3K"],
            ["Lari Cepat (Dash)", "Gerakan", "Menggandakan kapasitas jarak gerak pada giliran ini"],
            ["Menghindar (Dodge)", "Pertahanan", "Serangan fisik dan sosial musuh menderita Disadvantage terhadapmu"],
            ["Membantu Rekan (Help)", "Dukungan", "Memberikan Advantage pada lemparan dadu rekan berikutnya"],
            ["Tenangkan Rekan (Comfort)", "Sosial", "Memulihkan kawan dari kondisi Salting / Meltdown"]
          ]
        }
      ]
    },
    {
      id: "social-vs-physical-combat",
      title: "Mekanika Adu Fisik vs Adu Mulut",
      leadParagraph: "Bagaimana cara melempar serangan ke musuh?",
      contentHtml: `
      <h4>1. Alur Serangan Fisik (Physical Attack)</h4>
      <ol>
        <li>Penyerang melempar: <code>d20 + Modifier Atribut Terkait + Proficiency Bonus (jika mahir)</code>.</li>
        <li>Bandingkan total hasil dengan <strong>Physical AC target</strong>.</li>
        <li>Jika hasil <strong>&ge; Physical AC</strong>: Serangan telak mendarat! Lempar dadu kerusakan fisik (misal 1d6 + Mod Physique) dan kurangi dari Physical HP target.</li>
      </ol>

      <h4>2. Alur Serangan Sosial & Rayuan (Social Attack)</h4>
      <ol>
        <li>Penyerang melempar: <code>d20 + Modifier Looks (Charm/Aura) ATAU Intelligent (People) + Proficiency Bonus</code>.</li>
        <li>Bandingkan total hasil dengan <strong>Social AC target</strong> ATAU target melakukan <strong>Mind Saving Throw</strong> melawan DC Penyerang (<code>DC = 8 + Proficiency + Modifier Penyerang</code>).</li>
        <li>Jika berhasil menembus pertahanan: Target menderita kerusakan Composure (misal 1d6 damage), merona malu, terintimidasi, atau terpesona hingga kehilangan fokus!</li>
      </ol>`,
      callouts: [
        {
          type: "tip",
          title: "Serangan Kejutan & Ambush Sekolah",
          content: "Menyergap lawan di sudut tangga atau melabrak dari balik pintu loker memberikan status <em>Surprised</em> kepada target. Karakter yang terkena <em>Surprised</em> tidak dapat bergerak atau mengambil aksi pada giliran pertama ronde tersebut."
        }
      ]
    },
    {
      id: "positioning-and-range",
      title: "Jarak & Lingkungan Pertarungan",
      leadParagraph: "Memahami batas ruang di koridor, kelas, dan atap sekolah.",
      contentHtml: `<p>Damsel & Desire menggunakan skala jarak standar:</p>
      <ul>
        <li><strong>Melee / Kontak Dekat (5 ft / 1.5 meter):</strong> Berdiri berhadapan, bisikan di telinga, rangkulan, pukulan tinju, atau tebasan pedang bambu.</li>
        <li><strong>Jarak Pendek (15–30 ft / 5–10 meter):</strong> Jarak antar meja di dalam kelas, teriakan melintasi lorong, lemparan kapur atau bola basket.</li>
        <li><strong>Jarak Jauh (60–120 ft / 20–40 meter):</strong> Dari ujung lapangan upacara ke balkon lantai dua, pengumuman speaker, atau pandangan tatap mata dari seberang kantin.</li>
      </ul>
      <p><strong>Cover & Perlindungan Lingkungan:</strong></p>
      <ul>
        <li><strong>Half Cover (+2 AC):</strong> Bersembunyi di balik deretan meja belajar atau pintu loker besi yang setengah terbuka.</li>
        <li><strong>Three-Quarters Cover (+5 AC):</strong> Mengintip dari balik kusen pintu kelas atau dinding sudut tangga.</li>
        <li><strong>Total Cover:</strong> Berada di dalam bilik toilet tertutup atau di balik pintu ruang guru — tidak bisa ditarget langsung oleh serangan fisik maupun kontak mata.</li>
      </ul>`
    }
  ]
};
