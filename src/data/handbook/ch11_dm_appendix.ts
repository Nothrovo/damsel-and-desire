import { HandbookChapter } from "./types";

export const CHAPTER_11_DM_APPENDIX: HandbookChapter = {
  id: "chapter-11-dm-appendix",
  number: 11,
  japaneseTitle: "第十一章：ゲームマスターの手引きと付録 (Panduan DM & Lampiran)",
  title: "Panduan Master Permainan (DM Guide) & Lampiran",
  subtitle: "Pedoman Menentukan DC Sosial & Fisik, Glosarium Istilah TRPG Jepang & Lembar Ringkasan Cepat",
  summary: "Pedoman lengkap bagi Dungeon Master untuk memimpin sesi, menentukan tingkat kesulitan adegan sekolah, serta referensi cepat glosarium anime.",
  leadParagraph: "Menjadi Dungeon Master (DM) dalam Damsel & Desire adalah peran sutradara yang mengarahkan serial anime remaja terbaik bersama teman-temanmu. Tugasmu bukan untuk mengalahkan para pemain, melainkan menyajikan panggung penuh drama, tawa, debar jantung asmara, dan persaingan sengit yang tak terlupakan.",
  sections: [
    {
      id: "dc-guidelines",
      title: "Pedoman Menentukan DC (Tingkat Kesulitan)",
      leadParagraph: "Standar Difficulty Class (DC) untuk berbagai situasi di sekolah:",
      contentHtml: `<p>Saat pemain melakukan tindakan yang memiliki risiko gagal, DM menetapkan target DC:</p>`,
      tables: [
        {
          caption: "Tabel Pedoman DC Sekolah (Difficulty Class)",
          headers: ["Tingkat Kesulitan", "Nilai DC", "Contoh Tindakan Fisik", "Contoh Tindakan Sosial / Asmara"],
          rows: [
            ["Sangat Mudah (Very Easy)", "5", "Lari santai mengejar bel masuk kelas", "Menyapa teman sebangku yang ramah"],
            ["Mudah (Easy)", "10", "Memanjat pagar pendek belakang sekolah", "Mengajak ngobrol teman sekelas biasa"],
            ["Sedang (Medium)", "15", "Melompati balkon ke dahan pohon sekolah", "Menepis gosip miring di hadapan kelompok kelas"],
            ["Sulit (Hard)", "20", "Mendobrak pintu besi gudang olahraga terkunci", "Mengajak kencan idola sekolah paling populer"],
            ["Sangat Sulit (Very Hard)", "25", "Menyelinap masuk ruang guru saat dijaga ketat", "Mengaku cinta pada rival bebuyutan di hadapan umum"],
            ["Mustahil (Nearly Impossible)", "30", "Lolos dari sidak razia gabungan kepala sekolah", "Meyakinkan guru killer tersenyum dan membatalkan ujian"]
          ]
        }
      ]
    },
    {
      id: "pacing-and-drama",
      title: "Mengelola Tempo & Konflik Sekolah",
      leadParagraph: "Tips sutradara untuk menjaga ketegangan naratif:",
      contentHtml: `
      <h4>1. Tiga Babak Sesi Sekolah</h4>
      <ul>
        <li><strong>Pagi Hari (Morning Phase):</strong> Kedatangan di gerbang sekolah, interaksi loker sepatu, gosip hangat di kelas, dan insiden kuis dadakan.</li>
        <li><strong>Siang Hari (Lunch Phase):</strong> Makan siang di atap/kantin, pembicaraan rencana rahasia, perebutan bento, atau adu mulut antar geng.</li>
        <li><strong>Sore Hari (Afterschool Phase):</strong> Kegiatan klub ekskul, perkelahian di belakang gedung, kerja baito, atau jalan pulang berdua di bawah rintik hujan.</li>
      </ul>

      <h4>2. Memberikan Hadiah (Rewards)</h4>
      <p>Hadiahi pemain bukan hanya dengan poin pengalaman (XP), tetapi juga:</p>
      <ul>
        <li><strong>Heart Token:</strong> Untuk dialog roleplay yang tulus atau pengorbanan heroik.</li>
        <li><strong>Peningkatan Reputasi:</strong> Dihormati guru, disoraki penonton lapangan, atau mendapatkan nomor kontak gebetan baru.</li>
        <li><strong>Barang Kenang-kenangan:</strong> Aksesoris atau jimat kecil dari NPC yang mereka tolong.</li>
      </ul>`
    },
    {
      id: "glossary-terms",
      title: "Glosarium Istilah TRPG Jepang",
      leadParagraph: "Kamus istilah populer yang sering muncul di meja permainan:",
      contentHtml: `
      <dl style="display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 16px 0;">
        <dt style="font-weight: bold; color: #e11d48;">Bukatsu (部活):</dt>
        <dd style="margin: 0;">Kegiatan klub ekstrakurikuler sekolah yang menjadi identitas utama murid.</dd>

        <dt style="font-weight: bold; color: #e11d48;">Aiaigasa (相合傘):</dt>
        <dd style="margin: 0;">Berbagi satu payung berdua saat hujan turun; simbol legendaris cinta remaja.</dd>

        <dt style="font-weight: bold; color: #e11d48;">Salting:</dt>
        <dd style="margin: 0;">Salah tingkah akibat perlakuan romantis atau pujian mendadak; Composure berada di bawah 50%.</dd>

        <dt style="font-weight: bold; color: #e11d48;">Baito (バイト):</dt>
        <dd style="margin: 0;">Kerja paruh waktu sepulang sekolah untuk menambah uang saku atau tabungan.</dd>

        <dt style="font-weight: bold; color: #e11d48;">Kokuhaku (告白):</dt>
        <dd style="margin: 0;">Pengakuan atau deklarasi cinta secara langsung kepada orang yang disukai.</dd>

        <dt style="font-weight: bold; color: #e11d48;">Chuunibyou (中二病):</dt>
        <dd style="margin: 0;">Sindrom remaja yang menganggap dirinya memiliki kekuatan sihir atau takdir pahlawan tersembunyi.</dd>

        <dt style="font-weight: bold; color: #e11d48;">Kuuki Yomenai (KY):</dt>
        <dd style="margin: 0;">Kondisi tidak mampu membaca situasi/atmosfer sosial di sekitarnya.</dd>
      </dl>`
    },
    {
      id: "quick-reference-sheet",
      title: "Lembar Ringkasan Aksi Cepat (Quick Cheatsheet)",
      leadParagraph: "Contekan aturan meja main untuk pemain dan DM:",
      contentHtml: `
      <div style="background: rgba(15, 23, 42, 0.04); border: 1px solid rgba(15, 23, 42, 0.15); border-radius: 8px; padding: 16px;">
        <h4 style="margin-top: 0;">Rumus Pokok Permainan</h4>
        <ul>
          <li><strong>Dadu Utama:</strong> d20 + Modifier Atribut + Proficiency Bonus (jika mahir).</li>
          <li><strong>Modifier:</strong> (Skor Atribut - 10) dibagi 2, bulatkan ke bawah.</li>
          <li><strong>Advantage:</strong> Lempar 2d20, ambil angka TERTINGGI.</li>
          <li><strong>Disadvantage:</strong> Lempar 2d20, ambil angka TERENDAH.</li>
          <li><strong>Physical AC:</strong> 10 + Mod Physique (+ Item).</li>
          <li><strong>Social AC:</strong> 10 + Mod Mind + Mod Looks.</li>
          <li><strong>Inisiatif:</strong> d20 + Mod Agility (Physique) ATAU Mod People (Intelligent).</li>
          <li><strong>Mata Uang:</strong> ¥ 1 = Rp 100.</li>
          <li><strong>Salting:</strong> Terjadi saat Composure &le; 50% maksimal.</li>
          <li><strong>Meltdown:</strong> Terjadi saat Composure = 0; butuh 3x Meltdown Saves atau pertolongan teman.</li>
          <li><strong>Confession DC:</strong> 18 - Level Heart Meter (7–9 ♥).</li>
        </ul>
      </div>`
    }
  ]
};
