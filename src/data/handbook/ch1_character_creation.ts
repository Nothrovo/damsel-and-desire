import { HandbookChapter } from "./types";

export const ch1_character_creation: HandbookChapter = {
  id: "chapter-1-character-creation",
  number: 1,
  japaneseTitle: "第１章 : キャラクター作成",
  title: "Bab 1: Pembuatan Karakter Murid",
  subtitle: "Enam Langkah Membentuk Murid SMA Impianmu di Seishun High",
  summary: "Panduan sistematis pembuatan lembar karakter mulai dari konsep, archetype, klub ekskul, kelas sosial, skor atribut, hingga perhitungan vitalitas.",
  leadParagraph: "Menciptakan murid SMA di Damsel & Desire adalah proses menuangkan imajinasi dan jiwa ke dalam lembaran biodata sekolah. Apakah karaktermu berandalan berjaket sobek yang diam-diam suka memelihara kucing liar, atau atlet basket karismatik yang gugup setengah mati saat diajak mengobrol berdua?",
  sections: [
    {
      id: "ch1-sec1",
      title: "Enam Langkah Pembuatan Karakter",
      contentHtml: `
        <p><span class="phb-drop-cap">U</span>ntuk memulai petualanganmu di SMA Seishun, ikuti 6 tahapan terstruktur berikut ini:</p>
        <ol>
          <li><strong>Tentukan Konsep &amp; Identitas Karakter:</strong> Pilih nama lengkap, nama panggilan, gender, dan penampilan khas (gaya seragam, potongan rambut, atau aksesori unik).</li>
          <li><strong>Pilih Archetype Karakter (Ras / Trope):</strong> Pilih salah satu dari 8 arketipe anime (seperti Delinquent, Jock, Nerd, Class Clown, Emo, Weeb, Popular Kids, atau Normies). Archetype memberikan bonus skor atribut, passive traits, dan 3 jurus khas (Archetype Moves).</li>
          <li><strong>Bergabung dengan Klub Ekskul (Class):</strong> Tentukan wadah ekstrakulikuler karaktermu di antara 16 klub sekolah. Ekskul menentukan jenis dadu daya tahan (Hit Die: d6, d8, atau d10), profisiensi saving throws, fasilitas khusus sekolah, dan 3 jurus klub (Club Moves).</li>
          <li><strong>Tentukan Latar Kelas Sosial (Background):</strong> Pilih status ekonomi keluarga dari 6 tingkatan sosial (Rich, Medium Rich, Medium, Medium Poor, Poor, Orphanage). Pilihan ini menentukan uang jajan harian, saldo tabungan awal di bank, dan barang bawaan status.</li>
          <li><strong>Alokasikan 6 Skor Atribut:</strong> Bagikan nilai ke enam atribut: Physique, Intelligent, Looks, Mind, Talent, dan Luck menggunakan <em>Standard Array</em> atau <em>Point Buy</em>.</li>
          <li><strong>Hitung Nilai Turunan &amp; Tulis Kisah (Backstory):</strong> Hitung Physical AC, Physical HP, Social AC, Composure, lalu lengkapi 4 aspek kepribadian: Personality, Ideals, Bonds, dan Flaws.</li>
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
        },
        {
          caption: "Bonus Kemahiran (Proficiency Bonus) Berdasarkan Tingkat Kelas",
          headers: ["Jenjang Kelas", "Tingkat (Level)", "Proficiency Bonus"],
          rows: [
            ["Kelas X (Murid Baru)", "Level 1 – 2", "+2"],
            ["Kelas XI (Senior Madya)", "Level 3 – 4", "+2"],
            ["Kelas XII (Tingkat Akhir)", "Level 5", "+3"]
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
    }
  ]
};
