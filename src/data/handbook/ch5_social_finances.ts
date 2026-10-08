import { HandbookChapter } from "./types";

export const CHAPTER_5_SOCIAL_FINANCES: HandbookChapter = {
  id: "chapter-5-social-finances",
  number: 5,
  japaneseTitle: "第五章：社会階級と経済 (Status Sosial & Finansial)",
  title: "Status Sosial & Ekonomi Siswa",
  subtitle: "6 Tingkat Kelas Sosial, Uang Saku Harian, Tabungan Celengan & Kerja Paruh Waktu (Baito)",
  summary: "Memahami latar belakang finansial keluarga karaktermu, kemampuan belanja, perlengkapan awal, serta sistem konversi mata uang Yen dan Rupiah.",
  leadParagraph: "Di Housen Academy, status ekonomi keluarga bukan hanya angka di rekening bank, melainkan cerminan gaya hidup dan dinamika sosial harian. Murid konglomerat datang diantar mobil limusin dengan dompet tebal, sementara anak panti asuhan menghitung koin receh untuk membeli onigiri makan siang. Sistem ekonomi di Damsel & Desire dirancang sederhana namun berdampak nyata terhadap roleplay dan daya tahan karakter.",
  sections: [
    {
      id: "currency-exchange",
      title: "Sistem Mata Uang Ganda (Yen & Rupiah)",
      leadParagraph: "Damsel & Desire menggunakan sistem dual currency yang mudah dikonversi.",
      contentHtml: `<p>Mata uang resmi dalam dunia cerita adalah <strong>Japanese Yen (¥)</strong>, namun untuk kenyamanan pemain di Indonesia, lembar karakter dan buku panduan ini menyediakan nilai padanan dalam <strong>Rupiah (Rp)</strong>.</p>
      <p>Kurs patokan standar yang berlaku di seluruh mekanik permainan adalah:</p>
      <p style="font-size: 1.15rem; font-weight: bold; text-align: center; background: rgba(225, 29, 72, 0.08); padding: 8px; border-radius: 6px; border: 1px solid rgba(225, 29, 72, 0.2);">
        ¥ 1 = Rp 100
      </p>
      <p>Contoh konversi praktis:</p>
      <ul>
        <li>¥100 (Satu kaleng teh hijau di vending machine) = <strong>Rp 10.000</strong></li>
        <li>¥500 (Satu mangkuk ramen hangat kantin sekolah) = <strong>Rp 50.000</strong></li>
        <li>¥1.000 (Uang saku harian kelas menengah) = <strong>Rp 100.000</strong></li>
        <li>¥5.000 (Traktir kencan mewah di kafe hits) = <strong>Rp 500.000</strong></li>
      </ul>`,
      callouts: [
        {
          type: "rule",
          title: "Uang Saku vs Tabungan Bank",
          content: "<strong>Uang Saku (Daily Allowance):</strong> Uang tunai cair di dompet yang diisi ulang setiap pagi hari saat memulai hari baru (Long Rest).<br><strong>Tabungan (Savings):</strong> Simpanan di rekening bank atau celengan rumah untuk membeli perlengkapan langka (Rare / Epic) yang memerlukan perencanaan matang."
        }
      ]
    },
    {
      id: "social-tiers",
      title: "6 Tingkatan Kelas Sosial Murid",
      leadParagraph: "Setiap kelas sosial memberikan fasilitas finansial dan paket barang bawaan yang berbeda.",
      contentHtml: `<p>Saat pembuatan karakter, pemain memilih salah satu kelas sosial berikut:</p>`,
      tables: [
        {
          caption: "Perbandingan Finansial 6 Kelas Sosial Housen Academy",
          headers: ["Kelas Sosial", "Uang Saku / Hari", "Tabungan Awal", "Pekerjaan Sampingan (Baito)", "Fasilitas Utama"],
          rows: [
            ["Rich (Konglomerat)", "¥5.000 (Rp 500.000)", "¥200.000 (Rp 20.000.000)", "Dilarang keluarga (¥0)", "Mobil jemputan, kartu kredit, koneksi yayasan"],
            ["Medium Rich (Menengah Atas)", "¥2.000 (Rp 200.000)", "¥50.000 (Rp 5.000.000)", "Baito hobi (¥500/shift)", "Skuter/motor, kafe elit, les privat terbaik"],
            ["Medium (Keluarga Rata-rata)", "¥1.000 (Rp 100.000)", "¥15.000 (Rp 1.500.000)", "Musiman bila perlu (¥0)", "Sepeda jengki, bento buatan ibu, kartu komuter"],
            ["Medium Poor (Hemat Ketat)", "¥500 (Rp 50.000)", "¥5.000 (Rp 500.000)", "Kasir/toko (¥300/shift)", "Pakar toko diskon, masak sendiri, negosiator harga"],
            ["Poor (Pejuang Mandiri)", "¥200 (Rp 20.000)", "¥1.000 (Rp 100.000)", "Loper koran/cuci (¥200/shift)", "Stamina kerja fisik tinggi, mental baja, kawan setia"],
            ["Orphanage (Panti Asuhan)", "¥300 (Rp 30.000)", "¥3.000 (Rp 300.000)", "Bantu kelontong (¥250/shift)", "Kemandirian mutlak, empati tinggi, solidaritas kuat"]
          ]
        }
      ]
    },
    {
      id: "social-details",
      title: "Rincian & Paket Barang Kelas Sosial",
      contentHtml: `
      <h3>1. Rich (Keluarga Konglomerat / Ningrat)</h3>
      <p>Keluarga pemilik korporasi raksasa, politisi papan atas, atau yayasan sekolah. Tidak pernah memikirkan harga makanan di menu resto.</p>
      <p><strong>Paket Barang Bawaan:</strong> Smartphone Flagship Terbaru, Dompet Kulit Merk Terkenal, Voucher Kafe Mewah, Kotak Pensil Impor.</p>

      <h3>2. Medium Rich (Keluarga Menengah Atas)</h3>
      <p>Anak dokter spesialis, manajer senior, atau arsitek. Hidup serba berkecukupan dengan gaya berpakaian rapi dan tren kekinian.</p>
      <p><strong>Paket Barang Bawaan:</strong> Smartphone Bagus, Sepatu Branded, Earphone Wireless Premium, Tumbler Keren.</p>

      <h3>3. Medium (Keluarga Pegawai Biasa)</h3>
      <p>Mayoritas siswa Housen Academy. Hidup hangat dalam rumah keluarga bahagia, membawa bekal bento buatan ibu dengan potongan telur gulung manis.</p>
      <p><strong>Paket Barang Bawaan:</strong> Smartphone Standar, Kotak Bento Susun, Payung Lipat Polos, Kartu Kereta Komuter.</p>

      <h3>4. Medium Poor (Keluarga Berhemat Ketat)</h3>
      <p>Keluarga buruh pabrik atau pedagang kecil yang cermat berhitung. Mereka tahu jam berapa supermarket menggelar diskon stiker kuning 50% untuk bento sore.</p>
      <p><strong>Paket Barang Bawaan:</strong> Smartphone Layar Retak Sedikit, Botol Air Isi Ulang, Roti Diskon Minimarket, Buku Catatan Murah.</p>

      <h3>5. Poor (Keluarga Kurang Mampu)</h3>
      <p>Harus bekerja keras sebelum fajar menyingsing. Keringat dan ketangguhan mental adalah kebanggaan mereka, tidak pernah mengeluh dalam kesulitan.</p>
      <p><strong>Paket Barang Bawaan:</strong> Sepatu Kets Usang, Koran Bekas Pelindung Hujan, Nasi Kepal (Onigiri) Garam, Handuk Kecil Leher.</p>

      <h3>6. Orphanage (Anak Asuh Panti / Hidup Mandiri)</h3>
      <p>Tumbuh di panti asuhan lokal tanpa orang tua biologis. Menemukan kehangatan keluarga sejati di antara sahabat seperjuangan.</p>
      <p><strong>Paket Barang Bawaan:</strong> Foto Polaroid Lama, Gantungan Kunci Rajut Buatan Adik Panti, Tas Selempang Kanvas, Buku Harian Rahasia.</p>
      `,
      callouts: [
        {
          type: "tip",
          title: "Roleplay Traktiran & Menembak Gebetan",
          content: "Mengajak gebetan makan di kafe mahal bagi murid kelas <em>Rich</em> mungkin hal biasa, namun bagi murid <em>Medium Poor</em> atau <em>Poor</em>, membelikan satu porsi es krim parfait dari tabungan baito mereka merupakan pengorbanan romantis yang sangat bernilai emosional di mata DM dan gebetan!"
        }
      ]
    },
    {
      id: "part-time-job",
      title: "Mekanik Kerja Paruh Waktu (Baito)",
      leadParagraph: "Menambah penghasilan di sela jadwal sekolah.",
      contentHtml: `<p>Siswa yang diizinkan mengambil baito (kelas Medium Rich ke bawah) dapat meluangkan waktu sepulang sekolah selama <strong>1 Shift Baito (3–4 Jam)</strong>.</p>
      <ul>
        <li><strong>Upah Baito:</strong> Murid menerima uang tunai langsung sesuai tarif shift kelas sosial mereka (¥200 s/d ¥500 per shift).</li>
        <li><strong>Konsekuensi Fisik:</strong> Melakukan baito menghabiskan waktu luang yang semestinya digunakan untuk belajar atau ekskul. Karakter tidak bisa mengikuti aktivitas klub di hari mereka mengambil shift kerja.</li>
        <li><strong>Kejadian Tak Terduga (Baito Encounter):</strong> DM dapat meminta lemparan dadu <code>d20 Luck (Situation Luck)</code> saat karakter sedang bekerja. Hasil tinggi bisa menghadirkan pelanggan ramah yang memberi tip atau pertemuan tak sengaja dengan gebetan yang mampir belanja!</li>
      </ul>`
    }
  ]
};
