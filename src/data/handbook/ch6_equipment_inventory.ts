import { HandbookChapter } from "./types";

export const CHAPTER_6_EQUIPMENT_INVENTORY: HandbookChapter = {
  id: "chapter-6-equipment-inventory",
  number: 6,
  japaneseTitle: "第六章：所持品とアイテム (Perlengkapan & Inventaris)",
  title: "Perlengkapan & Kompendium Barang",
  subtitle: "90+ Item Sekolah, 5 Tingkatan Kelangkaan (Rarity), Kenang-kenangan & Aturan Barang Kustom",
  summary: "Daftar lengkap perlengkapan, efek mekanik tiap benda, tingkat kelangkaan, barang jimat kenang-kenangan (Keepsakes), serta panduan membuat item kustom.",
  leadParagraph: "Di dunia modern SMA Jepang, 'pedang' seorang murid bisa berupa Shinai latihan kendo, 'tongkat sihir' berupa mikrofon siaran sekolah atau gitar listrik, dan 'ramuan penyembuh' berupa sekotak susu stroberi dingin atau plester luka bergambar kartun. Setiap barang di Damsel & Desire memiliki fungsi mekanik nyata dalam roleplay dan pertempuran sekolah.",
  sections: [
    {
      id: "rarity-system",
      title: "5 Tingkat Kelangkaan Barang (Rarity Tiers)",
      leadParagraph: "Tingkat kelangkaan mencerminkan betapa sulit suatu barang diperoleh dan seberapa dahsyat efeknya.",
      contentHtml: `<p>Semua item di dalam katalog dikelompokkan ke dalam 5 tingkatan kelangkaan warna:</p>
      <ul>
        <li><strong style="color: #64748b;">Common (Abu-abu / Putih):</strong> Barang keperluan sehari-hari yang mudah dibeli di minimarket, koperasi sekolah, atau vending machine (contoh: Buku Catatan, Penghapus, Susu Kotak, Onigiri).</li>
        <li><strong style="color: #16a34a;">Uncommon (Hijau):</strong> Perlengkapan klub khusus atau barang hobi bernilai yang memerlukan usaha tertentu untuk didapat (contoh: Shinai Kendo, Bola Basket Resmi, Bento Buatan Tangan Spesial). Memberikan bonus roll +1 atau pemulihan ekstra.</li>
        <li><strong style="color: #2563eb;">Rare (Biru):</strong> Barang bermerek impor, peralatan laboratorium khusus, instrumen musik panggung, atau barang bernilai emosional tinggi (contoh: Smartphone Flagship, Ampli Marshall Portabel, Surat Cinta Bersegel Wangi). Memberikan efek Advantage atau aksi khusus.</li>
        <li><strong style="color: #9333ea;">Epic (Ungu):</strong> Perlengkapan legendaris tingkat sekolah, piala kejuaraan nasional, kunci master lorong rahasia gedung lama, atau pusaka keluarga berharga tinggi. Memiliki efek yang mampu membalikkan jalannya pertempuran sosial atau fisik.</li>
        <li><strong style="color: #ea580c;">Legendary (Oranye / Emas):</strong> Barang yang hanya ada satu di seluruh prefektur atau memiliki takdir asmara mutlak (contoh: Jimat Kuil Takdir Cinta Berbenang Merah Murni, Kaset Rekaman Skandal Yayasan). Mengubah aturan permainan secara dramatis.</li>
      </ul>`,
      callouts: [
        {
          type: "tip",
          title: "Sistem Tap-to-Inspect di Karakter Sheet",
          content: "Di aplikasi web Damsel & Desire, setiap barang yang ada di lembar inventarismu dapat diklik/ditap untuk membuka modal popup yang menampilkan deskripsi flavor text, efek mekanik lengkap, tipe aksi, dan tombol lempar dadu roll check otomatis!"
        }
      ]
    },
    {
      id: "item-categories",
      title: "Kategori Kompendium Barang",
      leadParagraph: "Lebih dari 90 barang resmi terbagi ke dalam kategori tematik:",
      contentHtml: `
      <h4>1. Perlengkapan Standar Pelajar (Common Student Gear)</h4>
      <p>Setiap murid memulai permainan dengan paket standar ini: Buku Teks & Catatan (+1 check ujian), Kotak Pensil & Penghapus (Advantage interaksi pinjam alat tulis), Smartphone (komunikasi & info), Kartu Pelajar (akses diskon), dan Payung Lipat (bisa dipayungi berdua untuk Advantage asmara).</p>

      <h4>2. Paket Barang Ekstrakurikuler (Club Packs)</h4>
      <p>Masing-masing dari 16 klub memberikan 3–4 perlengkapan unik:</p>
      <ul>
        <li><strong>OSIS:</strong> Kartu ID OSIS Resmi, Walkie-Talkie Koordinasi, Agenda & Stempel Proposal.</li>
        <li><strong>Kendo:</strong> Shinai Bambu Latihan, Seragam Kendogi & Hakama, Minyak Perawatan Bilah.</li>
        <li><strong>Martial Arts:</strong> Pelindung Tangan Karate, Sabuk Beladiri, Perban Elastis.</li>
        <li><strong>Sports:</strong> Sepatu Lari Atletik Khusus, Botol Minum Jumbo, Handuk Microfiber.</li>
        <li><strong>Drama:</strong> Naskah Teater Penuh Coretan, Peralatan Rias Panggung, Jubah Penyamaran.</li>
        <li><strong>KIR / OSN:</strong> Botol Pereaksi Kimia Mini, Laptop Data Analisis, Kabel Jumper & Flashdisk.</li>
        <li><strong>Pramuka / Paskin:</strong> Tali Pramuka 10 Meter, Peluit Metal Komando, Kompas Navigasi.</li>
        <li><strong>Pecinta Alam:</strong> P3K Lapangan Bivak, Senter Kepala Waterproof, Matras Lipat Saku.</li>
        <li><strong>Penyiaran:</strong> Mikrofon Lavalier Wireless, Earphone Monitor, Buku Catatan Gosip Rahasia.</li>
        <li><strong>Literatur:</strong> Kertas Surat Bermotif Bunga Sakura, Pena Tinta Emas, Buku Puisi Klasik.</li>
        <li><strong>Band:</strong> Pick Gitar Keberuntungan, Kabel Audio Jack 6.3mm, Tuner Gitar Digital.</li>
        <li><strong>Painting:</strong> Buku Sketsa Hardcover A4, Set Cat Air Pocket, Kuas Detil Nomor 2.</li>
        <li><strong>Photography:</strong> Kamera Digital Lensa Telefoto, Lampu Kilat Flash Portable, Album Polaroid Mini.</li>
        <li><strong>Cooking:</strong> Kotak Bento Bertingkat Cantik, Set Pisau Dapur & Celemek Khusus, Botol Bumbu Rahasia.</li>
        <li><strong>Occult:</strong> Kartu Tarot Klasik Rider-Waite, Lilin Aromaterapi Hitam, Jimat Kertas Ofuda.</li>
        <li><strong>Gaming:</strong> Handheld Gaming Console, Mechanical Arcade Stick Portabel, Minuman Kaleng Energi Tinggi.</li>
      </ul>

      <h4>3. Makanan & Minuman Pemulih Stamina (Snacks & Refreshment)</h4>
      <p>Dibeli di kantin atau minimarket untuk memulihkan vitalitas:</p>
      <ul>
        <li><strong>Susu Stroberi Kotak (Common):</strong> Memulihkan 1d4 Composure secara instan saat diminum di sela jam istirahat.</li>
        <li><strong>Onigiri Tuna Mayones (Common):</strong> Memulihkan 1d4 Physical HP saat lapar setelah pelajaran olahraga.</li>
        <li><strong>Bento Buatan Rumah Spesial (Uncommon):</strong> Memulihkan 1d8 HP dan 1d6 Composure. Jika dimakan berdua dengan gebetan, keduanya mendapatkan Heart Token!</li>
        <li><strong>Pocky Cokelat Edisi Valentine (Rare):</strong> Dapat digunakan untuk permainan 'Pocky Game' berdua — kedua karakter melempar Mind Saving Throw dengan taruhan ciuman tak sengaja!</li>
      </ul>
      `,
      tables: [
        {
          caption: "Contoh Seleksi Item Populer Housen Academy",
          headers: ["Nama Item", "Kategori", "Rarity", "Efek Mekanik Singkat", "Tipe Aksi"],
          rows: [
            ["Bento Buatan Sendiri", "Romance / Food", "Uncommon", "Pulihkan 1d8 HP + 1d6 Composure berdua", "Istirahat / Aksi"],
            ["Payung Lipat Polos", "Perlengkapan", "Common", "Advantage roll asmara saat hujan (Aiaigasa)", "Utility"],
            ["Smartphone Flagship", "Gadget", "Rare", "Advantage info digital & check kamera", "Utility"],
            ["Surat Cinta Beraroma", "Romance", "Rare", "Target Mind Save atau Heart Meter +1", "Social"],
            ["Pick Gitar Keberuntungan", "Band", "Uncommon", "+1 pada Talent (Performance) check", "Pasif"],
            ["Shinai Bambu Master", "Kendo", "Rare", "1d8+Mod Bludgeoning, +1 to-hit", "Serangan Fisik"]
          ]
        }
      ]
    },
    {
      id: "keepsakes",
      title: "Barang Kenang-kenangan (Keepsakes / Bond Items)",
      leadParagraph: "Benda berkekuatan emosional yang mengikat masa lalu atau orang terkasih.",
      contentHtml: `<p>Setiap karakter dapat memiliki maksimal <strong>1 Barang Kenang-kenangan (Keepsake)</strong> yang dipilih saat pembuatan karakter atau dihadiahkan oleh gebetan seiring berjalannya cerita.</p>
      <ul>
        <li><strong>Sifat Benda:</strong> Keepsake tidak bisa dicuri atau hilang permanen oleh efek biasa karena dilindungi ikatan naratif.</li>
        <li><strong>Kekuatan Ikatan Emosi:</strong> Sekali per hari, saat karakter mengalami kegagalan krusial (Natural 1 pada dadu atau Composure mencapai 0), karakter dapat menyentuh atau memegang Keepsake mereka untuk memicu <strong>Reroll Takdir</strong> atau bertahan di 1 Composure lewat kilasan memori emosional.</li>
        <li><strong>Contoh Keepsakes:</strong> Pita rambut hadiah adik kecil, gantungan kunci boneka berpasangan, jimat keberuntungan kuil dari mantan sahabat, atau jam saku peninggalan kakek.</li>
      </ul>`
    },
    {
      id: "custom-items-rules",
      title: "Aturan Membuat Barang Kustom (Custom Items)",
      leadParagraph: "Kebebasan pemain dan DM menciptakan barang orisinal.",
      contentHtml: `<p>Di menu inventaris aplikasi Damsel & Desire, tersedia fitur <strong>+ Tambah Barang Baru</strong> yang memungkinkan pemain memilih dari kompendium 90+ barang resmi atau merancang barang kustom mereka sendiri.</p>
      <p>Pedoman menyeimbangkan barang kustom bagi DM dan Pemain:</p>
      <ul>
        <li><strong>Tentukan Rarity Sesuai Daya Guna:</strong>
          <ul>
            <li><em>Common:</em> Efek situasional kecil, kosmetik, atau bonus +1 pada 1 sub-skill spesifik.</li>
            <li><em>Uncommon:</em> Bonus +1 roll, pemulihan 1d4 s/d 1d6 HP/Composure, atau aksi pendukung utility.</li>
            <li><em>Rare:</em> Advantage pada check tertentu, pemulihan 1d8+, atau serangan berstatus (Stunned / Distracted).</li>
            <li><em>Epic / Legendary:</em> Mempengaruhi seluruh partai, mengubah alur cerita, atau efek romansa otomatis.</li>
          </ul>
        </li>
        <li><strong>Tentukan Action Type:</strong> Pilih apakah barang digunakan sebagai <code>Action</code>, <code>Bonus Action</code>, <code>Reaction</code>, atau bekerja secara <code>Pasif</code> saat disimpan di tas.</li>
        <li><strong>Tulis Flavor Text yang Menarik:</strong> Deskripsikan bentuk visualnya, aroma, merek, dan kenangan di balik benda tersebut untuk memperkaya nuansa roleplay meja bermain!</li>
      </ul>`,
      callouts: [
        {
          type: "rule",
          title: "Kapasitas Tas Murid (Inventory Capacity)",
          content: "Secara aturan baku, seorang murid dapat membawa hingga <strong>15 item individual</strong> di dalam tas ransel sekolah dan saku seragam mereka tanpa penalti mobilitas. Murid klub Pecinta Alam yang membawa ransel gunung carrier mendapatkan kapasitas ekstra hingga 25 item."
        }
      ]
    }
  ]
};
