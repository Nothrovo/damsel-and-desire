import { HandbookChapter } from "./types";

export const CHAPTER_10_ROMANCE_SECRETS: HandbookChapter = {
  id: "chapter-10-romance-secrets",
  number: 10,
  japaneseTitle: "第十章：恋愛システムと秘密 (Asmara & Rahasia Hati)",
  title: "Sistem Asmara, Heart Meter & Rahasia Hati",
  subtitle: "Heart Token (Desire Inspiration), Meteran Hati (1–10 ♥), Event Nembak (Confession) & Panel Rahasia Game Master (DM)",
  summary: "Sistem mekanik romansa otentik: bagaimana cinta bersemi, token inspirasi asmara, langkah menyatakan cinta di bawah pohon sakura, serta perlindungan privasi DM.",
  leadParagraph: "Romansa adalah inti jiwa dari Damsel & Desire. Di sini, cinta bukan sekadar pemanis cerita naratif tanpa aturan, melainkan sistem mekanik yang terintegrasi penuh ke dalam statistik lembar karaktermu. Setiap debar jantung, tatapan curi-curi di sela jam pelajaran, dan payung yang dibagi berdua di kala hujan lebat dicatat dalam Heart Meter dan diabadikan sebagai Heart Token.",
  sections: [
    {
      id: "heart-tokens",
      title: "Heart Token (Desire Inspiration)",
      leadParagraph: "Mata uang emosional yang melipatgandakan keajaiban dadu.",
      contentHtml: `<p>Sebagai padanan dari sistem <em>Inspiration</em> dalam D&D 5e, Damsel & Desire menghadirkan <strong>Heart Token (Desire Token)</strong>.</p>
      <p><strong>Bagaimana Cara Mendapatkan Heart Token?</strong></p>
      <ul>
        <li>Melakukan aksi roleplay romantis atau pengorbanan emosional yang menyentuh hati DM dan sesama pemain.</li>
        <li>Melindungi gebetan dari serangan fisik atau penghinaan sosial di depan umum.</li>
        <li>Memberikan hadiah buatan tangan spesial (Bento, syal rajut, surat cinta) di momen yang tepat.</li>
        <li>Memperoleh hasil Natural 20 pada check <em>Luck (Relationship Luck)</em>.</li>
      </ul>
      <p><strong>Bagaimana Cara Menggunakan Heart Token?</strong></p>
      <ul>
        <li><strong>Keajaiban Asmara (Romantic Advantage):</strong> Belanjakan 1 Heart Token untuk mendapatkan <strong>Advantage</strong> pada lemparan dadu d20 apapun yang melibatkan gebetan atau perlindungan kawan terdekat.</li>
        <li><strong>Pertahanan Hati (Composure Shield):</strong> Belanjakan 1 Heart Token sebagai reaksi untuk membatalkan sepenuhnya kerusakan Composure yang baru saja diterima dari ejekan musuh.</li>
        <li><strong>Bunga Keberuntungan (Fate Reroll):</strong> Memaksa reroll satu lemparan dadu yang gagal saat sedang membela harga diri orang terkasih.</li>
      </ul>`,
      callouts: [
        {
          type: "rule",
          title: "Batas Maksimal Heart Token",
          content: "Seorang karakter dapat menyimpan hingga maksimal <strong>3 Heart Token</strong> sekaligus. Pemain didorong untuk membelanjakannya demi momen-momen dramatis dan tidak menimbunnya terlalu lama!"
        }
      ]
    },
    {
      id: "heart-meter-levels",
      title: "Meteran Hati (Heart Meter 1–10 ♥)",
      leadParagraph: "Tingkat kedekatan hubungan asmara karakter dengan gebetan atau target cinta:",
      contentHtml: `<p>Setiap target asmara memiliki skala hubungan dari 1 hingga 10 Hati (♥) yang dicatat di lembar karakter:</p>`,
      tables: [
        {
          caption: "Tahapan Hubungan Asmara (Heart Meter Progression)",
          headers: ["Level Hati", "Status Hubungan", "Tanda & Perilaku Karakter", "Manfaat Mekanik"],
          rows: [
            ["1–2 ♥", "Orang Asing / Teman Sekelas", "Hanya menyapa jika berpapasan di lorong", "Interaksi standar tanpa bonus khusus"],
            ["3–4 ♥", "Teman Akrab (Friendly)", "Mulai sering makan siang bareng dan tukar kontak LIME", "+1 pada check Mind (Interpersonal)"],
            ["5–6 ♥", "Sadar Perasaan (Mutual Awareness)", "Sering salah tingkah, deg-degan saat tangan bersentuhan", "Advantage saat menggunakan Help action satu sama lain"],
            ["7–8 ♥", "Kasmaran Dalam (Deep Infatuation)", "Saling memikirkan sebelum tidur, cemburu jika lawan bicara didekati orang lain", "Mendapatkan 1 Heart Token gratis di awal setiap sesi"],
            ["9 ♥", "Di Ambang Pengakuan (On the Verge)", "Tahu sama tahu bahwa keduanya saling menyukai, menanti momen pengakuan", "Membuka hak melancarkan Event Deklarasi Cinta (Confession)"],
            ["10 ♥", "Kekasih Sejati (Canon Lovers)", "Resmi berpacaran, ikatan batin tak terpisahkan di hadapan seisi sekolah", "Kebal terhadap status Social Meltdown saat berada di dekat pasangan!"]
          ]
        }
      ]
    },
    {
      id: "confession-event",
      title: "Event Deklarasi Cinta (The Confession Event)",
      leadParagraph: "Momen puncak paling mendebarkan dalam game: menyatakan perasaan!",
      contentHtml: `<p>Ketika Heart Meter mencapai <strong>minimal level 7 ♥</strong> (ideal di level 9 ♥), karakter dapat memicu <strong>The Confession Event (Nembak)</strong>.</p>
      <p>Pengakuan cinta dapat dilakukan di lokasi-lokasi legendaris sekolah:</p>
      <ul>
        <li><strong>Di Bawah Pohon Sakura Legendaris Gedung Lama:</strong> Konon siapa pun yang jadian di sana akan abadi selamanya.</li>
        <li><strong>Atap Sekolah Saat Matahari Terbenam (Sunset Rooftop):</strong> Angin sepoi-sepoi menerbangkan helai rambut di kala langit jingga.</li>
        <li><strong>Loker Sepatu Sepulang Sekolah:</strong> Menyelipkan surat ajakan bertemu di gerbang belakang.</li>
      </ul>
      <h4>Mekanik Lemparan Dadu Nembak:</h4>
      <ol>
        <li>Pemain menyatakan monolog pengakuan cintanya secara roleplay langsung di meja main.</li>
        <li>Pemain melempar: <code>d20 + Modifier Looks (Charm) ATAU Mind (Interpersonal) + Modifier Luck (Relationship Luck)</code>.</li>
        <li><strong>Target DC Pengakuan:</strong> Ditentukan oleh DM berdasarkan level Heart Meter saat ini (DC = 18 - Level Heart Meter). Di level 9 ♥, DC-nya hanya <strong>9</strong>!</li>
        <li><strong>Hasil Sukses:</strong> Target menerima pengakuan! Heart Meter melonjak ke level 10 ♥, kedua karakter memperoleh 3 Heart Token penuh, dan status mereka resmi berpacaran.</li>
        <li><strong>Hasil Gagal:</strong> Terjadi kesalahpahaman dramatis ('A-aku belum siap...', bel sekolah tiba-tiba berbunyi kencang, atau ada orang ketiga memotong). Karakter menderita 2d6 Composure damage, namun hubungan tidak putus — Heart Meter hanya turun 1 level dan bisa dicoba kembali nanti.</li>
      </ol>`
    },
    {
      id: "dm-privacy-system",
      title: "Sistem Privasi & Panel Rahasia Game Master (DM)",
      leadParagraph: "Menjaga misteri plot rahasia dan perasaan cinta terpendam tetap aman.",
      contentHtml: `<p>Dalam kampanye TRPG sekolah, intrik rahasia adalah kunci keseruan: siapa yang diam-diam menyukai siapa, siapa yang menyebarkan surat kaleng, atau apa masa lalu kelam dari guru BP baru.</p>
      <p>Agar pemain tidak saling mengintip rahasia NPC atau catatan gebetan orang lain:</p>
      <ul>
        <li><strong>Panel Catatan Rahasia:</strong> Di lembar karakter dan manajemen campaign, tersedia tab <em>Catatan Rahasia & Plot DM</em> yang terlindungi otentikasi server.</li>
        <li><strong>Otoritas Game Master (DM Mode):</strong> Hanya Dungeon Master yang memiliki akses terverifikasi untuk membuka catatan rahasia di lembar karakter mana pun secara aman selama sesi berjalan.</li>
        <li><strong>Kerahasiaan Pemain:</strong> Pemain lain tidak dapat melihat target gebetan rahasiamu kecuali karaktermu sendiri yang mengungkapkannya secara sukarela dalam gameplay naratif!</li>
      </ul>`
    }
  ]
};
