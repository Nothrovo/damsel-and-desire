import { HandbookChapter } from "./types";

export const ch0_cover_intro: HandbookChapter = {
  id: "chapter-0-intro",
  number: 0,
  japaneseTitle: "序章 : 鳳泉学園へようこそ",
  title: "Pendahuluan: Selamat Datang di SMA Housen",
  subtitle: "Filosofi Permainan, Tiga Pilar Kehidupan Sekolah, dan Aturan Inti d20",
  summary: "Pengantar dasar semesta Damsel & Desire, peran Dungeon Master dan Murid, serta mekanik lemparan dadu d20.",
  leadParagraph: "Di bawah guyuran kelopak bunga sakura yang berguguran di gerbang sekolah, kisah masa mudamu baru saja dimulai. Selamat datang di SMA Housen, panggung drama kasmaran, persaingan sengit antarklub ekskul, dan persahabatan tak tergantikan.",
  sections: [
    {
      id: "ch0-sec1",
      title: "Apa Itu Damsel & Desire?",
      subtitle: "Drama Remaja Sekolah Jepang Berbasis Sistem TRPG",
      contentHtml: `
        <p><span class="phb-drop-cap">D</span><strong>amsel &amp; Desire</strong> adalah permainan peran meja (Tabletop Role-Playing Game / TRPG) naratif yang terinspirasi dari anime komedi romantis SMA, manga drama remaja, dan dinamika persaingan ekstrakurikuler Jepang. Berbeda dengan fantasi klasik D&amp;D 5e di mana para petualang membantai naga di dalam labirin bawah tanah, di sini kalian bermain sebagai murid SMA biasa dengan ambisi luar biasa: menaklukkan hati gebetan idola sekolah, membawa klub ekstrakulikuler meraih kejuaraan nasional, mempertahankan reputasi geng, atau sekadar bertahan hidup dari keganasan razia guru BP.</p>
        <p>Permainan ini menggabungkan ketegangan mekanis d20 klasik dengan nuansa emosional mendalam. Di dunia <em>Damsel &amp; Desire</em>, sebuah ledekan tajam di depan kelas bisa sama mematikannya dengan tebasan pedang, dan sebuah tatapan mata tak sengaja di bawah payung hujan bisa mengubah takdir sebuah hubungan selamanya.</p>
      `,
      callouts: [
        {
          type: "note",
          title: "Tiga Pilar Permainan",
          content: "<strong>1. Eksplorasi Sekolah:</strong> Mengarungi lorong loker, atap gedung berangin sepoi, ruang klub berdebu, dan sudut minimarket kota.<br><strong>2. Interaksi Sosial &amp; Asmara:</strong> Membaca bahasa tubuh, menjalin gosip, menjaga imej (jaim), hingga menyatakan cinta.<br><strong>3. Konfrontasi &amp; Persaingan:</strong> Duel tanding kendo, tawuran antar-geng berandalan, adu debat osis, dan panggung drama festival budaya."
        }
      ]
    },
    {
      id: "ch0-sec2",
      title: "Peran Pemain dan Dungeon Master",
      contentHtml: `
        <p>Setiap orang dalam sesi permainan memiliki peran penting dalam merajut cerita bersama:</p>
        <ul>
          <li><strong>Pemain (Players):</strong> Setiap pemain menciptakan dan memerankan seorang murid SMA unik. Kalian menentukan perkataan, reaksi, tindakan, perasaan, dan ambisi karakter kalian.</li>
          <li><strong>Dungeon Master (DM / Sensei):</strong> Bertindak sebagai narator utama, wasit peraturan, dan penggerak seluruh karakter non-pemain (NPC)—mulai dari guru killer, ketua OSIS arogan, penjaga warung ramen, hingga target asmara karakter kalian. DM menghadirkan rintangan, melukiskan atmosfer adegan, dan menentukan konsekuensi dari setiap lemparan dadu.</li>
        </ul>
      `
    },
    {
      id: "ch0-sec3",
      title: "Aturan Inti: Lemparan Dadu d20",
      contentHtml: `
        <p>Kapan pun karakter kalian mencoba melakukan tindakan yang hasilnya tidak pasti atau memiliki risiko kegagalan menarik, DM akan meminta kalian melempar satu buah dadu bersisi dua puluh (<strong>d20</strong>).</p>
        <div class="phb-formula-box">
          <span class="phb-formula-title">RUMUS LEMPARAN UTAMA (d20 CHECK):</span>
          <code>Hasil Dadu d20 + Modifier Atribut + Bonus Profisiensi (Jika Mahir) &ge; Tingkat Kesulitan (DC)</code>
        </div>
        <p>Jika hasil penjumlahan kalian sama dengan atau melebihi <strong>Tingkat Kesulitan (Difficulty Class / DC)</strong> yang ditentukan DM, tindakan kalian berhasil. Jika kurang, karakter kalian menghadapi kegagalan dramatis atau komplikasi baru.</p>
      `,
      tables: [
        {
          caption: "Tabel Acuan Tingkat Kesulitan (Difficulty Class / DC)",
          headers: ["Tingkat Kesulitan", "Nilai DC", "Contoh Tindakan di Sekolah"],
          rows: [
            ["Sangat Mudah", "DC 5", "Mengingat jadwal pelajaran harian, menyapa teman sekelas."],
            ["Mudah", "DC 10", "Memanjat pagar sekolah 1.5 meter tanpa ketahuan penjaga."],
            ["Sedang", "DC 15", "Menahan salting saat ditatap lekat oleh gebetan, mencontek saat pengawas meleng."],
            ["Sulit", "DC 20", "Mendobrak pintu loker berkarat gedung lama, mencuri kunci ruang arsip guru BP."],
            ["Sangat Sulit", "DC 25", "Mendamaikan tawuran dua geng besar seorang diri, merayu idola sekolah di hari pertama."],
            ["Hampir Mustahil", "DC 30", "Mendapatkan nilai sempurna ujian nasional tanpa pernah menyentuh buku."]
          ]
        }
      ],
      callouts: [
        {
          type: "rule",
          title: "Advantage dan Disadvantage",
          content: "<strong>Advantage:</strong> Jika situasi sangat menguntungkan karakter (misal: memamerkan smartphone flagship kepada murid matre), lempar <strong>dua dadu d20</strong> dan gunakan angka yang <strong>LEBIH TINGGI</strong>.<br><strong>Disadvantage:</strong> Jika situasi sangat menghambat (misal: adu argumen saat sedang kebelet pipis parah), lempar <strong>dua dadu d20</strong> dan gunakan angka yang <strong>LEBIH RENDAH</strong>."
        }
      ]
    }
  ]
};
