import { HandbookChapter } from "./types";

export const CHAPTER_10_ROMANCE_SECRETS: HandbookChapter = {
  id: "chapter-10-romance-secrets",
  number: 10,
  japaneseTitle: "第十章：恋愛システムと秘密 (Asmara & Rahasia Hati)",
  title: "Sistem Asmara, Heart Meter & Rahasia Hati",
  subtitle: "Heart Token, Skala Heart Meter 1–10 ♥, Siklus 6 Fase Romansa, Progressive Reveal & Event Deklarasi Cinta",
  summary: "Sistem mekanik romansa otentik SMA Jepang: dari 6 tahapan siklus cinta, rahasia kepribadian bertingkat, kencan sepulang sekolah, inspirasi asmara, hingga aturan nembak di bawah pohon sakura legendaris.",
  leadParagraph: "Romansa adalah inti jiwa dari Damsel & Desire. Di sini, cinta bukan sekadar pemanis naratif tanpa aturan, melainkan sistem mekanik yang terintegrasi penuh ke dalam statistik lembar karaktermu. Setiap debar jantung, tatapan curi-curi di sela jam pelajaran, dan payung yang dibagi berdua di kala hujan lebat dicatat dalam Heart Meter dan diabadikan sebagai Heart Token.",
  sections: [
    {
      id: "heart-tokens",
      title: "Heart Token (Desire Inspiration)",
      leadParagraph: "Mata uang emosional yang melipatgandakan keajaiban dadu dan melindungi ketenangan jiwa:",
      contentHtml: `<p>Sebagai padanan tematik dari sistem <em>Inspiration</em> dalam D&D 5e, Damsel & Desire menghadirkan <strong>Heart Token (Desire Token)</strong>.</p>
      <p><strong>Bagaimana Cara Mendapatkan Heart Token?</strong></p>
      <ul>
        <li>Melakukan aksi roleplay romantis atau pengorbanan emosional yang menyentuh hati DM dan seluruh pemain di meja main.</li>
        <li>Melindungi pujaan hati (Love Interest) atau sahabat terdekat dari serangan fisik maupun penghinaan sosial di depan umum.</li>
        <li>Memberikan hadiah buatan tangan spesial (Bento cinta, syal rajut, surat pribadi) pada momen naratif yang tepat.</li>
        <li>Memperoleh hasil Natural 20 pada lemparan dadu <em>Luck (Relationship Luck)</em>.</li>
        <li>Meraih peringkat Top 10 paralel sekolah pada Pekan Ujian Semester.</li>
      </ul>
      <p><strong>Bagaimana Cara Menggunakan Heart Token?</strong></p>
      <ul>
        <li><strong>Keajaiban Asmara (Romantic Advantage):</strong> Belanjakan 1 Heart Token untuk mendapatkan <strong>Advantage</strong> pada lemparan dadu d20 apa pun yang melibatkan gebetan atau perlindungan kawan terdekat.</li>
        <li><strong>Pertahanan Hati (Composure Shield):</strong> Belanjakan 1 Heart Token sebagai reaksi untuk membatalkan sepenuhnya kerusakan Composure yang baru saja diterima dari ejekan, fitnah, atau momen memalukan.</li>
        <li><strong>Bunga Keberuntungan (Fate Reroll):</strong> Memaksa reroll satu lemparan dadu yang gagal saat sedang membela harga diri orang terkasih di hadapan publik.</li>
      </ul>`,
      callouts: [
        {
          type: "rule",
          title: "Batas Maksimal Heart Token",
          content: "Seorang karakter dapat menyimpan hingga maksimal <strong>3 Heart Token</strong> sekaligus. Pemain didorong untuk membelanjakannya demi momen-momen dramatis pemicu baper dan tidak menimbunnya terlalu lama!"
        }
      ]
    },
    {
      id: "heart-meter-levels",
      title: "Meteran Hati (Heart Meter 1–10 ♥)",
      leadParagraph: "Tingkat kedekatan emosional dan intensitas romansa karakter dengan pujaan hati:",
      contentHtml: `<p>Setiap relasi romantis atau ketertarikan hati diukur menggunakan skala 1 hingga 10 Hati (♥) yang tercatat di lembar karakter:</p>`,
      tables: [
        {
          caption: "Tahapan Hubungan Asmara (Heart Meter Progression)",
          headers: ["Level Hati", "Status Hubungan", "Tanda & Perilaku Karakter", "Manfaat Mekanik"],
          rows: [
            ["1–2 ♥", "Orang Asing / Teman Sekelas", "Hanya menyapa canggung jika berpapasan di koridor sekolah", "Interaksi standar tanpa bonus khusus"],
            ["3–4 ♥", "Teman Akrab (Friendly)", "Mulai sering makan siang bareng di atap dan bertukar kontak LIME", "+1 pada seluruh check Mind (Interpersonal)"],
            ["5–6 ♥", "Sadar Perasaan (Mutual Tension)", "Sering salah tingkah, deg-degan saat tangan bersentuhan tanpa sengaja", "Advantage saat menggunakan Help action satu sama lain"],
            ["7–8 ♥", "Kasmaran Dalam (Deep Infatuation)", "Saling memikirkan sebelum tidur, cemburu jika lawan bicara didekati orang lain", "Mendapatkan 1 Heart Token gratis di awal setiap sesi permainan"],
            ["9 ♥", "Di Ambang Pengakuan (On the Verge)", "Tahu sama tahu bahwa keduanya saling menyukai, menanti momen pengakuan", "Membuka hak melancarkan Event Deklarasi Cinta (The Confession Event)"],
            ["10 ♥", "Kekasih Sejati (Canon Lovers)", "Resmi berpacaran, ikatan batin tak terpisahkan di hadapan seisi sekolah", "Kebal terhadap status Social Meltdown saat berada dalam radius 30 ft dari pasangan!"]
          ]
        }
      ]
    },
    {
      id: "romance-arc-phases",
      title: "Siklus 6 Tahap Romansa (The Six Romance Arcs)",
      leadParagraph: "Perjalanan cinta SMA berjalan mengikuti ritme 12 bulan kalender akademik, terbagi ke dalam 6 fase alami perkembangan hubungan:",
      contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 12px; margin: 16px 0;">
        <div class="phb-stat-card">
          <div class="phb-stat-header">
            <strong>Fase 1: Curiosity (Rasa Penasaran)</strong>
            <span class="phb-stat-badge">April – Mei • 1–2 ♥</span>
          </div>
          <p>Pertemuan pertama di masa orientasi sekolah, kesan awal yang sedikit salah paham, obrolan canggung di loker sepatu atau halte bus saat hujan sore. Karakter mulai memperhatikan kebiasaan kecil satu sama lain.</p>
        </div>

        <div class="phb-stat-card">
          <div class="phb-stat-header">
            <strong>Fase 2: Trust (Kepercayaan)</strong>
            <span class="phb-stat-badge">Juni – Juli • 3–4 ♥</span>
          </div>
          <p>Kompetisi olahraga (Taiikusai) dan tekanan ujian akhir semester pertama memperlihatkan sisi rapuh serta ketakutan di balik topeng murid teladan atau berandalan. Momen berbagi payung saat musim hujan (Aiaigasa) membuka pintu rahasia pribadi.</p>
        </div>

        <div class="phb-stat-card">
          <div class="phb-stat-header">
            <strong>Fase 3: Attraction (Ketertarikan)</strong>
            <span class="phb-stat-badge">Agustus – September • 5–6 ♥</span>
          </div>
          <p>Liburan musim panas di luar kelas, kamp pelatihan ekskul (Gasshuku), festival kembang api dengan yukata, serta latihan peran di panggung Festival Budaya (Bunkasai) membuat getaran cinta makin sulit ditepis.</p>
        </div>

        <div class="phb-stat-card">
          <div class="phb-stat-header">
            <strong>Fase 4: Jealousy &amp; Honesty (Cemburu &amp; Kejujuran)</strong>
            <span class="phb-stat-badge">Oktober – November • 7–8 ♥</span>
          </div>
          <p>Momen karyawisata (Shūgaku Ryokō) dan pergaulan sekolah memicu kemunculan rumor atau orang ketiga. Rasa cemburu menguji ketahanan Composure dan menuntut keberanian untuk jujur pada perasaan sendiri.</p>
        </div>

        <div class="phb-stat-card">
          <div class="phb-stat-header">
            <strong>Fase 5: Commitment (Komitmen &amp; Keseriusan)</strong>
            <span class="phb-stat-badge">Desember – Januari • 9 ♥</span>
          </div>
          <p>Kencan malam Natal di bawah hujan salju pertama, bertukar syal rajut atau cinderamata bermakna, dan doa bersama saat tahun baru (Hatsumōde). Hubungan telah matang dan siap menuju pengakuan cinta resmi.</p>
        </div>

        <div class="phb-stat-card">
          <div class="phb-stat-header">
            <strong>Fase 6: Resolution &amp; Confession (Puncak Cinta)</strong>
            <span class="phb-stat-badge">Februari – Maret • 10 ♥</span>
          </div>
          <p>Pemberian cokelat perasaan (Honmei-choco) di Hari Valentine, balasan White Day, atau pengakuan di bawah pohon sakura mekar saat upacara kelulusan menandai tercapainya cinta sejati.</p>
        </div>
      </div>`
    },
    {
      id: "progressive-reveal-mechanics",
      title: "Mekanisme Interaksi & Pembongkaran Rahasia Hati (Progressive Reveal)",
      leadParagraph: "Bagaimana pemain mempelajari sifat asli pujaan hati secara bertahap tanpa spoiler:",
      contentHtml: `
      <p>Setiap calon pasangan memiliki lapisan informasi kepribadian yang tertutup rapat oleh Game Master (DM). Pemain tidak langsung mengetahui segalanya di awal perkenalan; rahasia terkuak berlapis-lapis seiring meningkatnya Heart Meter:</p>
      
      <h4>Empat Lapisan Informasi Pujaan Hati (The 4 Reveal Layers)</h4>
      <ol>
        <li><strong>Lapisan 1: Persona Publik (Terbuka Sejak Awal):</strong> Nama, penampilan fisik, seragam/aksesori khas, reputasi di mata sekolah, dan klub ekskul yang diikuti.</li>
        <li><strong>Lapisan 2: Kebiasaan &amp; Preferensi (Terbuka di 3–4 ♥):</strong> Makanan kesukaan, menu bento idaman, tempat favorit sepulang sekolah, dan topik obrolan yang memicu senyum tulusnya. Memberikan hadiah yang cocok di fase ini memberikan pemulihan Composure instan.</li>
        <li><strong>Lapisan 3: Sisi Rapuh &amp; Tekanan Hidup (Terbuka di 6–7 ♥):</strong> Ketakutan terdalam, ekspektasi keluarga yang membebani, trauma masa lalu, atau rivalitas rahasia. Membantu menyelesaikan beban ini adalah syarat mutlak menaikkan Heart Meter ke level 8+.</li>
        <li><strong>Lapisan 4: Kunci Hati &amp; Janji Sejati (Terbuka di 9–10 ♥):</strong> Alasan sesungguhnya mengapa ia jatuh hati kepadamu, rahasia terbesar yang tak diketahui siapa pun di sekolah, dan janji masa depan yang diikat berdua.</li>
      </ol>

      <h4>Mekanik Kencan Sepulang Sekolah (After-School Outings)</h4>
      <p>Karakter dapat mengajak pujaan hati pergi berdua (jalan santai ke minimarket, belajar di perpustakaan, makan es krim di taman tepi sungai):</p>
      <ul>
        <li>Check <strong>Looks (Charm)</strong> atau <strong>Mind (Interpersonal)</strong> berbobot DC santai (DC 10–12).</li>
        <li><strong>Sukses:</strong> Menambah +1 progres pada Heart Meter dan mengembalikan 1d6 Composure untuk kedua karakter.</li>
        <li><strong>Gagal / Canggung:</strong> Karakter menderita status <em>Salting (Flustered)</em> karena salah bicara, namun kebersamaan tetap dihitung manis (tidak mengurangi Heart Meter).</li>
      </ul>`
    },
    {
      id: "confession-event",
      title: "Event Deklarasi Cinta (The Confession Event)",
      leadParagraph: "Momen puncak paling mendebarkan dalam game: menyatakan perasaan!",
      contentHtml: `<p>Ketika Heart Meter mencapai <strong>minimal level 8 ♥</strong> (ideal di level 9 ♥), karakter berhak memicu <strong>The Confession Event (Nembak)</strong>.</p>
      <p>Pengakuan cinta dapat dilakukan di lokasi-lokasi legendaris sekolah:</p>
      <ul>
        <li><strong>Di Bawah Pohon Sakura Legendaris Gedung Lama:</strong> Konon siapa pun yang jadian di sana cintanya akan abadi selamanya.</li>
        <li><strong>Atap Sekolah Saat Matahari Terbenam (Sunset Rooftop):</strong> Angin senja menerbangkan helai rambut di kala langit jingga keemasan.</li>
        <li><strong>Loker Sepatu Sepulang Sekolah:</strong> Menyelipkan surat wangi ajakan bertemu di gerbang belakang seusai jam belajar.</li>
      </ul>
      <h4>Mekanik Lemparan Dadu Nembak:</h4>
      <ol>
        <li>Pemain menyatakan monolog pengakuan cintanya secara roleplay langsung di meja main.</li>
        <li>Pemain melempar dadu pengakuan: <code>d20 + Modifier Looks (Charm) ATAU Mind (Interpersonal) + Modifier Luck (Relationship Luck)</code>.</li>
        <li><strong>Target DC Pengakuan:</strong> Ditentukan oleh DM berdasarkan level Heart Meter saat ini (<code>DC = 18 - Level Heart Meter</code>). Di level 9 ♥, DC-nya hanya <strong>9</strong>!</li>
        <li><strong>Hasil Sukses:</strong> Target menerima pengakuan cinta! Heart Meter melonjak ke level 10 ♥, kedua karakter memperoleh 3 Heart Token penuh, dan status mereka resmi menjadi <em>Canon Lovers (Kekasih Resmi)</em>.</li>
        <li><strong>Hasil Gagal / Tertunda:</strong> Terjadi insiden dramatis ('A-aku belum siap...', bel sekolah berbunyi kencang, atau ada orang ketiga yang tiba-tiba melintas). Karakter menderita 2d6 Composure damage, namun hubungan tidak putus — Heart Meter hanya turun 1 level dan dapat dicoba kembali pada momen musiman berikutnya.</li>
      </ol>`
    },
    {
      id: "dm-privacy-system",
      title: "Sistem Privasi & Panel Rahasia Game Master (DM)",
      leadParagraph: "Menjaga misteri plot rahasia, status Heart Meter sejati, dan perasaan cinta terpendam tetap aman.",
      contentHtml: `<p>Dalam kampanye TRPG sekolah, intrik rahasia adalah kunci keseruan: siapa yang diam-diam menyukai siapa, siapa yang menyebarkan surat kaleng, atau apa masa lalu kelam dari guru BP baru.</p>
      <p>Agar pemain tidak saling mengintip rahasia NPC atau catatan gebetan orang lain:</p>
      <ul>
        <li><strong>Panel Catatan Rahasia:</strong> Di lembar karakter dan manajemen campaign, tersedia tab <em>Catatan Rahasia &amp; Plot DM</em> yang terlindungi otentikasi server.</li>
        <li><strong>Otoritas Game Master (DM Mode):</strong> Hanya Dungeon Master yang memiliki akses terverifikasi untuk membuka catatan rahasia dan status Love Interest di balik layar selama sesi berjalan.</li>
        <li><strong>Kerahasiaan Pemain:</strong> Pemain lain tidak dapat melihat target pujaan hatimu atau catatan cinta rahasiamu kecuali karaktermu sendiri yang mengungkapkannya secara sukarela dalam gameplay naratif!</li>
      </ul>`
    }
  ]
};
