import { HandbookChapter } from "./types";

export const CHAPTER_9_REST_SCHOOL_LIFE: HandbookChapter = {
  id: "chapter-9-rest-school-life",
  number: 9,
  japaneseTitle: "第九章：休息と学園生活 (Istirahat & Kehidupan Sekolah)",
  title: "Istirahat & Ritme Kehidupan Sekolah",
  subtitle: "Short Rest Jam Istirahat, Long Rest Tidur Malam, Deposit Bank Otomatis & Kalender Semester",
  summary: "Menjaga stamina di antara jam pelajaran, memulihkan Composure dengan makan siang di atap, serta membagi waktu antara ujian dan festival sekolah.",
  leadParagraph: "Kehidupan di SMA bukan sekadar tentang konflik tanpa henti; ritme keseharian yang santai di sela-sela jam pelajaran adalah tempat di mana persahabatan mekar dan karakter memulihkan energi fisik serta mental. Mengetahui kapan harus mengambil napas dan bagaimana mengelola waktu istirahat adalah kunci bertahan hidup di Housen Academy.",
  sections: [
    {
      id: "rest-mechanics",
      title: "Mekanik Istirahat (Rests)",
      leadParagraph: "Dua tingkatan istirahat untuk memulihkan vitalitas:",
      contentHtml: `
      <h4>1. Short Rest (Jam Istirahat Siang / 15–30 Menit)</h4>
      <p>Makan bekal di atap sekolah, mengobrol di kantin, meminum susu dingin di depan vending machine, atau bersantai di ruang klub.</p>
      <ul>
        <li><strong>Pemulihan HP Fisik:</strong> Karakter dapat membelanjakan satu atau lebih <strong>Hit Dice Klub</strong> mereka (contoh: 1d10 untuk klub Kendo/Sports, 1d8 untuk OSIS/Band). Lempar dadu dan tambahkan Modifier Physique untuk memulihkan sejumlah Physical HP.</li>
        <li><strong>Pemulihan Composure:</strong> Mengobrol santai dengan teman atau mendengarkan musik memulihkan <strong>1d6 + Modifier Mind Composure</strong>.</li>
        <li><strong>Reset Kemampuan:</strong> Seluruh jurus dan keistimewaan yang berlabel <em>1x per Short Rest</em> terisi ulang penuh.</li>
      </ul>

      <h4>2. Long Rest (Tidur Malam Nyenyak / 8 Jam)</h4>
      <p>Pulang ke rumah, mandi air hangat, menyelesaikan PR, dan tidur nyenyak di kamar hingga alarm pagi berbunyi.</p>
      <ul>
        <li><strong>Pemulihan Penuh:</strong> Physical HP dan Composure kembali ke nilai maksimal 100%.</li>
        <li><strong>Regenerasi Hit Dice:</strong> Karakter memulihkan kembali separuh dari total Hit Dice maksimal mereka.</li>
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
      title: "Kalender Semester & Siklus Kehidupan Sekolah",
      leadParagraph: "Tahun ajaran di SMA Jepang terbagi dalam tiga caturwulan (term) penuh dinamika:",
      contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 12px; margin: 16px 0;">
        <div style="background: rgba(244, 63, 94, 0.05); border-left: 4px solid #f43f5e; padding: 12px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #e11d48;">Semester 1: Musim Semi (April – Juli)</h4>
          <p style="margin: 0; font-size: 0.95rem;">Upacara Penerimaan Murid Baru di bawah guguran bunga sakura, perebutan anggota baru klub ekskul (Bukatsu Fair), kuis diagnostik, dan Ujian Tengah Semester pertama.</p>
        </div>
        <div style="background: rgba(234, 88, 12, 0.05); border-left: 4px solid #ea580c; padding: 12px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #ea580c;">Liburan Musim Panas (Agustus)</h4>
          <p style="margin: 0; font-size: 0.95rem;">Kamp pelatihan klub (Gasshuku) di tepi pantai atau penginapan gunung tradisional, festival kembang api musim panas (Yukata date), dan tantangan uji nyali sekolah malam hari (Kimodameshi).</p>
        </div>
        <div style="background: rgba(168, 85, 247, 0.05); border-left: 4px solid #a855f7; padding: 12px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #9333ea;">Semester 2: Musim Gugur & Dingin (September – Desember)</h4>
          <p style="margin: 0; font-size: 0.95rem;">Pekan Olahraga Sekolah (Undoukai), Festival Budaya Sekolah (Bunkasai) dengan stan maid cafe dan panggung drama, malam Natal salju pertama, dan Ujian Akhir Semester.</p>
        </div>
        <div style="background: rgba(59, 130, 246, 0.05); border-left: 4px solid #3b82f6; padding: 12px; border-radius: 0 8px 8px 0;">
          <h4 style="margin: 0 0 6px 0; color: #2563eb;">Semester 3: Musim Salju & Kelulusan (Januari – Maret)</h4>
          <p style="margin: 0; font-size: 0.95rem;">Kunjungan kuil tahun baru (Hatsumoude), Hari Valentine (pemberian cokelat Giri vs Honmei), hari White Day, dan upacara kelulusan kakak kelas yang mengharukan.</p>
        </div>
      </div>`
    },
    {
      id: "school-events-mechanics",
      title: "Mekanik Event Spesial Sekolah",
      leadParagraph: "Aktivitas musiman dengan dampak gameplay masif:",
      contentHtml: `
      <h4>1. Pekan Ujian Sekolah (Exam Week)</h4>
      <p>Setiap murid harus melempar 3 seri check <strong>Intelligent (Academic)</strong>. Nilai rata-rata menentukan peringkat paralel:</p>
      <ul>
        <li><strong>Peringkat 1–10:</strong> Mendapatkan +2 Looks (Influence) di mata seluruh sekolah dan Heart Token bonus!</li>
        <li><strong>Nilai Di Bawah Standar (Remedial):</strong> Terkena kelas tambahan sepulang sekolah; karakter dilarang mengikuti kegiatan klub atau baito selama 1 minggu dalam game.</li>
      </ul>

      <h4>2. Festival Budaya (Bunkasai)</h4>
      <p>Klub dan kelas bekerja sama merancang stan (Kafe Maid/Butler, Rumah Hantu, Stan Takoyaki, atau Pementasan Teater). Kesuksesan stan ditentukan lewat check gabungan <strong>Talent (Creative)</strong> dan <strong>Looks (Charm)</strong> yang mengumpulkan dana kas dan popularitas.</p>`
    }
  ]
};
