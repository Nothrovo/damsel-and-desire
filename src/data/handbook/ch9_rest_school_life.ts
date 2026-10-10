import { HandbookChapter } from "./types";

export const CHAPTER_9_REST_SCHOOL_LIFE: HandbookChapter = {
  id: "chapter-9-rest-school-life",
  number: 9,
  japaneseTitle: "第九章：休息と学園生活 (Istirahat & Kehidupan Sekolah)",
  title: "Istirahat & Ritme Kehidupan Sekolah",
  subtitle: "Short Rest Jam Istirahat, Long Rest Tidur Malam, Deposit Bank Otomatis & Kalender Akademik 12 Bulan",
  summary: "Menjaga stamina di antara jam pelajaran, memulihkan Composure dengan makan siang di atap, mengelola tabungan otomatis, serta timeline 12 bulan penuh event ikonik SMA Jepang (April–Maret).",
  leadParagraph: "Kehidupan di SMA bukan sekadar tentang konflik tanpa henti; ritme keseharian yang santai di sela-sela jam pelajaran adalah tempat di mana persahabatan mekar dan karakter memulihkan energi fisik serta mental. Mengetahui kapan harus mengambil napas dan bagaimana mengelola waktu istirahat di tengah siklus 12 bulan kalender sekolah adalah kunci bertahan hidup di Housen Academy.",
  sections: [
    {
      id: "rest-mechanics",
      title: "Mekanik Istirahat (Rests)",
      leadParagraph: "Dua tingkatan istirahat untuk memulihkan vitalitas:",
      contentHtml: `
      <h4>1. Short Rest (Jam Istirahat Siang / 15–30 Menit)</h4>
      <p>Makan bekal di atap sekolah, mengobrol di kantin, meminum susu dingin di depan vending machine, atau bersantai di ruang klub.</p>
      <ul>
        <li><strong>Pemulihan HP Fisik:</strong> Karakter dapat membelanjakan sejumlah <strong>Dadu Istirahat (Rest Dice)</strong> sesuai jenjang kelas (Kelas 10: 1 dadu, Kelas 11: 2 dadu, Kelas 12: 3 dadu). Lempar dadu Hit Die klub dan tambahkan Modifier Physique untuk memulihkan Physical HP.</li>
        <li><strong>Pemulihan Composure:</strong> Mengobrol santai dengan teman atau mendengarkan musik memulihkan <strong>1d6 + Modifier Mind Composure</strong>.</li>
        <li><strong>Reset Kemampuan:</strong> Seluruh jurus dan keistimewaan yang berlabel <em>1x per Short Rest</em> terisi ulang penuh.</li>
      </ul>

      <h4>2. Long Rest (Tidur Malam Nyenyak / 8 Jam)</h4>
      <p>Pulang ke rumah, mandi air hangat, menyelesaikan PR, dan tidur nyenyak di kamar hingga alarm pagi berbunyi.</p>
      <ul>
        <li><strong>Pemulihan Penuh:</strong> Physical HP dan Composure kembali ke nilai maksimal 100%.</li>
        <li><strong>Regenerasi Hit Dice:</strong> Karakter memulihkan kembali seluruh Rest Dice maksimal mereka.</li>
        <li><strong>Uang Saku Pagi:</strong> Karakter menerima jatah uang saku harian baru (Daily Allowance) sesuai kelas sosial mereka di dompet.</li>
      </ul>`,
      callouts: [
        {
          type: "rule",
          title: "Sisa Uang Saku & Deposit Bank Otomatis",
          content: "Saat seorang karakter mengambil <strong>Long Rest</strong> untuk menyambut hari baru, sisa uang saku di dompet yang tidak terpakai kemarin tidak akan hilang sia-sia! Secara otomatis, sistem perbankan Housen Academy mentransfer sisa uang saku tersebut ke <strong>Tabungan Bank (Savings)</strong> karakter, lalu dompet diisi kembali dengan uang saku harian baru."
        }
      ]
    },
    {
      id: "semester-calendar",
      title: "Kalender Semester & Siklus 12 Bulan SMA Housen",
      leadParagraph: "Tahun ajaran di SMA Jepang dimulai pada bulan April dan berakhir pada bulan Maret tahun berikutnya, terbagi dalam tiga caturwulan (term) penuh dinamika emosional dan tradisi sekolah:",
      contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 14px; margin: 16px 0;">
        <div style="background: rgba(244, 63, 94, 0.05); border-left: 4px solid #f43f5e; padding: 14px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #e11d48; font-family: 'Cinzel', serif;">SEMESTER 1: MUSIM SEMI & PANAS (APRIL – JULI)</h4>
          <ul style="margin: 6px 0 0 16px; font-size: 0.92rem; line-height: 1.5;">
            <li><strong>April — Awal Tahun Ajaran Baru (Nyūgakushiki &amp; Shigyōshiki):</strong> Bunga sakura bermekaran di gerbang sekolah. Upacara penerimaan murid baru kelas 10, pembagian kelas, pengenalan wali kelas, tes diagnostik kemampuan awal, dan <em>Bukatsu Fair</em> (pekan demo ekskul memperebutkan anggota baru). Momen pertemuan pertama dan rivalitas awal.</li>
            <li><strong>Mei — Mulai Akrab &amp; Golden Week:</strong> Libur panjang Golden Week nasional, pemilihan perangkat kelas dan pengurus OSIS, latihan klub semakin intensif, kuis berkala pertama, dan ajakan belajar bersama pertama sepulang sekolah.</li>
            <li><strong>Juni — Musim Hujan Tsuyu &amp; Hari Olahraga (Taiikusai):</strong> Langit mendung syahdu musim hujan, momen berbagi payung bersama (<em>Aiaigasa</em>), persiapan kompetisi olahraga antarkelas, dan ujian tengah semester pertama (Chūkan Kousa).</li>
            <li><strong>Juli — Ujian Akhir Semester 1 &amp; Rapor (Shūgyōshiki):</strong> Pekan Ujian Akhir Semester 1 (Kimatsu Kousa), pembagian nilai rapor, babak penyisihan turnamen musim panas antarsekolah, dan upacara penutupan semester sebelum libur panjang.</li>
          </ul>
        </div>

        <div style="background: rgba(234, 88, 12, 0.05); border-left: 4px solid #ea580c; padding: 14px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #ea580c; font-family: 'Cinzel', serif;">LIBURAN MUSIM PANAS (AGUSTUS — NATSUYASUMI)</h4>
          <ul style="margin: 6px 0 0 16px; font-size: 0.92rem; line-height: 1.5;">
            <li><strong>Agustus — Kamp Pelatihan &amp; Festival Kembang Api:</strong> Sekolah libur selama 4–5 minggu. Kegiatan beralih ke <em>Gasshuku</em> (kamp pelatihan intensif ekskul menginap di tepi pantai atau wisma gunung), <em>Natsu Matsuri</em> (festival kembang api musim panas dengan baju Yukata dan stan makanan), tantangan uji nyali malam hari (<em>Kimodameshi</em>), dan kelas remedial bagi murid bernilai rendah.</li>
          </ul>
        </div>

        <div style="background: rgba(168, 85, 247, 0.05); border-left: 4px solid #a855f7; padding: 14px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #9333ea; font-family: 'Cinzel', serif;">SEMESTER 2: MUSIM GUGUR &amp; DINGIN (SEPTEMBER – DESEMBER)</h4>
          <ul style="margin: 6px 0 0 16px; font-size: 0.92rem; line-height: 1.5;">
            <li><strong>September — Kembali ke Sekolah &amp; Persiapan Bunkasai:</strong> Pembukaan semester 2, pembentukan panitia Festival Budaya, perdebatan konsep stan kelas (Maid Cafe, Rumah Hantu, atau Kafe Cosplay), dan latihan pentas teater/band hingga larut sore.</li>
            <li><strong>Oktober — Puncak Festival Budaya (Bunkasai):</strong> Acara sekolah paling spektakuler sepanjang tahun! Sekolah dibuka untuk umum, stan makanan kelas memperebutkan omzet tertinggi, pertunjukan musik auditorium, dan afterparty api unggun (<em>Kouyasai</em>).</li>
            <li><strong>November — Karyawisata Sekolah (Shūgaku Ryokō):</strong> Perjalanan wisata sekolah menginap beberapa malam (tujuan Kyoto, Nara, Hokkaido, atau Okinawa). Momen jalan-jalan bebas berkelompok, obrolan rahasia tengah malam di kamar ryokan, dan Ujian Tengah Semester 2.</li>
            <li><strong>Desember — Ujian Akhir Semester &amp; Malam Natal (Christmas Date):</strong> Ujian Akhir Semester 2, salju pertama turun di Housen Academy, tradisi kencan malam Natal (24–25 Desember) untuk saling bertukar hadiah syal rajut, dan libur musim dingin singkat (Fuyuyasumi).</li>
          </ul>
        </div>

        <div style="background: rgba(59, 130, 246, 0.05); border-left: 4px solid #3b82f6; padding: 14px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #2563eb; font-family: 'Cinzel', serif;">SEMESTER 3: MUSIM SALJU &amp; KELULUSAN (JANUARI – MARET)</h4>
          <ul style="margin: 6px 0 0 16px; font-size: 0.92rem; line-height: 1.5;">
            <li><strong>Januari — Kunjungan Kuil Tahun Baru (Hatsumōde):</strong> Memakai kimono ke kuil shinto bersama kawan untuk berdoa memohon keselamatan dan menarik ramalan keberuntungan (<em>Omikuji</em>). Semester terpendek dimulai, diwarnai tekanan ujian masuk universitas bagi murid kelas 12.</li>
            <li><strong>Februari — Ujian Masuk Housen &amp; Hari Valentine:</strong> Gedung sekolah disterilkan untuk ujian saringan masuk siswa baru angkatan berikutnya. Tanggal 14 Februari: pembagian cokelat pertemanan (<em>Giri-choco</em>) vs cokelat perasaan cinta sejati (<em>Honmei-choco</em>) di loker sepatu.</li>
            <li><strong>Maret — White Day, Ujian Akhir Tahun &amp; Kelulusan (Sotsugyōshiki):</strong> 14 Maret adalah White Day (pembalasan hadiah cokelat putih). Ujian Akhir Tahun penentu kenaikan kelas, hari pembersihan massal (Ōsōji), dan Upacara Kelulusan murid kelas 12 yang diwarnai penyerahan kancing kedua seragam (<em>Daini Botan</em>) kepada orang terkasih.</li>
          </ul>
        </div>
      </div>`
    },
    {
      id: "school-events-mechanics",
      title: "Mekanik Event Spesial Sekolah",
      leadParagraph: "Aktivitas musiman dengan aturan mekanik baku yang memengaruhi reputasi, akademis, dan asmara karakter:",
      contentHtml: `
      <h4>1. Pekan Ujian Sekolah (Exam Week Mechanics)</h4>
      <p>Setiap murid melempar 3 seri check <strong>Intelligent (Academic)</strong> mewakili bidang Sains, Bahasa, dan Ilmu Sosial:</p>
      <ul>
        <li><strong>Rata-rata 18+ (Top 10 Paralel):</strong> Meraih peringkat kehormatan di papan pengumuman lobi sekolah, mendapatkan bonus <strong>+2 Looks (Influence)</strong> permanen untuk semester itu, dan dihadiahi <strong>1 Heart Token</strong> oleh dewan sekolah atau keluarga!</li>
        <li><strong>Rata-rata 12–17 (Lulus Memuaskan):</strong> Status akademik aman, waktu sepulang sekolah bebas untuk beraktivitas klub atau kerja paruh waktu.</li>
        <li><strong>Rata-rata &lt; 10 (Remedial Koshu):</strong> Dinyatakan tidak tuntas. Karakter wajib mengikuti kelas tambahan sepulang sekolah dan <em>dilarang mengikuti aktivitas ekskul atau shift baito</em> selama 1 pekan penuh dalam game!</li>
      </ul>

      <h4>2. Festival Budaya (Bunkasai Booth Management)</h4>
      <p>Kelas atau klub bekerja sama menyukseskan stan festival sekolah melalui 3 tahap manajemen:</p>
      <ul>
        <li><strong>Tahap Konsep &amp; Desain:</strong> Check <strong>Talent (Creative)</strong> DC 13 untuk menentukan daya tarik dekorasi dan menu.</li>
        <li><strong>Tahap Pelayanan &amp; Promosi:</strong> Check <strong>Looks (Charm / Influence)</strong> bergiliran untuk menarik antrean pengunjung dari sekolah lain.</li>
        <li><strong>Omzet Stan:</strong> Setiap kesuksesan menghasilkan 5.000–20.000 Yen kas kelas dan memberikan reputasi positif di hadapan panitia OSIS.</li>
      </ul>

      <h4>3. Hari Olahraga (Taiikusai Relay &amp; Games)</h4>
      <p>Lomba lari estafet antarkelas, tarik tambang raksasa, dan perburuan barang tersembunyi (Kari-bito Kyousou):</p>
      <ul>
        <li>Setiap atlet melempar check <strong>Physique (Athletics / Stamina)</strong> yang diadu secara beruntun (Opposed Check).</li>
        <li>Dalam lomba mencari kawan sesuai kertas petunjuk (Kari-bito), peserta harus melempar <strong>Mind (Awareness)</strong> untuk menemukan gebetan atau murid yang cocok dalam kerumunan, memicu momen romantis di lintasan lari!</li>
      </ul>

      <h4>4. Karyawisata Sekolah (Shūgaku Ryokō Night Intrigue)</h4>
      <p>Selama menginap di hotel/ryokan, murid memiliki jam malam resmi pukul 22.00:</p>
      <ul>
        <li><strong>Menyelinap Antarkamar:</strong> Check <strong>Physique (Agility / Stealth)</strong> DC 14 untuk menghindari patroli guru piket.</li>
        <li><strong>Momen Curhat Malam:</strong> Check <strong>Mind (Interpersonal)</strong> saat mengobrol di bawah selimut futon memberikan Advantage pada pembentukan ikatan (Bonds) dan memulihkan 2d6 Composure.</li>
      </ul>`
    }
  ]
};
