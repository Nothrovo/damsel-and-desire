import { HandbookChapter } from "./types";

export const CHAPTER_7_DUAL_VITALS: HandbookChapter = {
  id: "chapter-7-dual-vitals",
  number: 7,
  japaneseTitle: "第七章：生命力と社会的防衛 (Dual Vitals & Pertahanan)",
  title: "Sistem Dual Vitals & Pertahanan",
  subtitle: "Physical AC & HP, Social AC & Composure, Fenomena Salting & Aturan Meltdown Save",
  summary: "Memahami sistem pertahanan ganda: tubuh fisik vs ketahanan mental sosial, dampak ketika Composure habis, serta cara bertahan dari rasa malu mutlak.",
  leadParagraph: "Di dunia anime sekolah menengah, luka fisik bukanlah satu-satunya hal yang bisa menjatuhkan seorang remaja. Dikritik habis-habisan di hadapan seisi kelas, tertangkap basah sedang memandangi gebetan, atau dipermalukan saat presentasi dapat melumpuhkan mental sama dahsyatnya dengan pukulan kendo. Karena itulah, Damsel & Desire mengusung sistem revolusioner: **Dual Vitals System** yang memisahkan pertahanan jasmani dan pertahanan rohani.",
  sections: [
    {
      id: "dual-vitals-concept",
      title: "Konsep Dual Vitals (Dua Lapisan Ketahanan)",
      leadParagraph: "Setiap karakter memiliki dua jenis Armor Class dan dua jenis Poin Nyawa:",
      contentHtml: `<p>Dua pilar ketahanan karakter beroperasi secara berdampingan namun independen:</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
        <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 16px;">
          <h4 style="color: #b91c1c; margin-top: 0;">1. Jalur Fisik (Physical Track)</h4>
          <p><strong>Physical Armor Class (PAC):</strong> Ketahanan tubuh menepis pukulan, tendangan, atau lemparan benda.</p>
          <p><strong>Physical Hit Points (PHP):</strong> Batas luka jasmani sebelum karakter pingsan atau babak belur.</p>
        </div>
        <div style="background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 8px; padding: 16px;">
          <h4 style="color: #1d4ed8; margin-top: 0;">2. Jalur Sosial (Social Track)</h4>
          <p><strong>Social Armor Class (SAC):</strong> Ketenangan wajah dan reputasi menangkal sindiran, gosip, atau godaan asmara.</p>
          <p><strong>Composure Points (CMP):</strong> Batas ketenangan batin sebelum karakter hilang kendali emosi, panik, atau 'Salting'.</p>
        </div>
      </div>`,
      tables: [
        {
          caption: "Formula Perhitungan Dasar Dual Vitals",
          headers: ["Metrik", "Formula Perhitungan Baku", "Fungsi Utama"],
          rows: [
            ["Physical AC (PAC)", "10 + Modifier Physique + Bonus Item / Perisai", "Target angka yang harus dilampaui serangan fisik lawan"],
            ["Physical HP Max", "Nilai Maks Hit Die Klub + Mod Physique (Level 1)", "Darah tubuh; jika mencapai 0, karakter pingsan"],
            ["Social AC (SAC)", "10 + Modifier Mind + Modifier Looks", "Target angka yang harus dilampaui serangan sosial lawan"],
            ["Composure Max", "10 + Nilai Stat Mind + Bonus Arketipe", "Ketenangan mental; jika mencapai 0, memicu Social Meltdown"]
          ]
        }
      ]
    },
    {
      id: "damage-types",
      title: "Tipe Serangan & Kerusakan (Damage Types)",
      leadParagraph: "Membedakan luka pada tubuh dan luka pada harga diri.",
      contentHtml: `
      <h4>1. Physical Damage (Luka Jasmani)</h4>
      <ul>
        <li><strong>Bludgeoning / Benturan:</strong> Pukulan tinju, bantingan judo, hantaman shinai kendo, lemparan bola basket. Mengurangi Physical HP.</li>
        <li><strong>Slashing / Goresan:</strong> Gunting seni, kawat pagar saat manjat, serpihan kaca lab. Mengurangi Physical HP.</li>
        <li><strong>Exhaustion / Kelelahan:</strong> Lari maraton, begadang tanpa tidur, cuaca ekstrem lapangan. Mengurangi Physical HP dan mobilitas.</li>
      </ul>

      <h4>2. Social & Emotional Damage (Luka Batin & Gengsi)</h4>
      <ul>
        <li><strong>Shame / Rasa Malu:</strong> Tertawaan seisi kelas, salah kostum, rahasia memalukan terbongkar. Mengurangi Composure.</li>
        <li><strong>Romance / Serangan Kasmaran:</strong> Kedipan mata, bisikan manis di telinga, tatapan intens dari jarak dekat, surat cinta. Mengurangi Composure dan memicu status Salting!</li>
        <li><strong>Gossip / Tekanan Reputasi:</strong> Desas-desus jahat yang menyebar di koridor sekolah. Mengurangi Composure secara bertahap.</li>
      </ul>`,
      callouts: [
        {
          type: "rule",
          title: "Serangan Kombinasi (Dual Threat)",
          content: "Beberapa aksi dapat memberikan kerusakan pada kedua jalur sekaligus! Misalnya jurus <em>Distorsi Pemecah Telinga</em> milik Klub Band yang merusak pendengaran fisik sekaligus meruntuhkan fokus Composure mental lawan."
        }
      ]
    },
    {
      id: "salting-and-meltdown",
      title: "Kondisi Salting & Social Meltdown",
      leadParagraph: "Ketika seorang remaja tak sanggup lagi menahan gejolak rasa malu.",
      contentHtml: `
      <h3>Status: Salting (Flustered / Blushing)</h3>
      <p>Karakter memasuki status <strong>Salting</strong> apabila Composure mereka turun hingga berada di bawah <strong>setengah dari nilai maksimalnya (&le; 50% Composure)</strong>.</p>
      <ul>
        <li><strong>Tanda Naratif:</strong> Pipi merona merah padam, gagap berbicara, membuang muka saat ditatap gebetan, menjatuhkan alat tulis secara ceroboh.</li>
        <li><strong>Penalti Mekanik:</strong> Karakter menderita <strong>Disadvantage</strong> pada semua check komunikasi verbal (Looks / Charm, Talent / Performance) dan -2 pada Social AC.</li>
      </ul>

      <h3>Kondisi: Social Meltdown (Composure = 0)</h3>
      <p>Ketika Composure seorang karakter menyentuh angka <strong>0</strong>, pertahanan ego mereka runtuh sepenuhnya. Karakter mengalami <strong>Social Meltdown</strong>.</p>
      <p>Pemain harus memilih (atau DM menentukan sesuai konteks) salah satu dari tiga manifestasi Meltdown berikut:</p>
      <ol>
        <li><strong>Kabur Sambil Menangis (Fleeing in Tears):</strong> Karakter menutup wajah dan berlari sekuat tenaga keluar ruangan menuju atap gedung atau toilet sekolah. Karakter tidak bisa beraksi hingga berhasil ditenangkan oleh kawan.</li>
        <li><strong>Membeku Total (Brain Freeze / Blank):</strong> Otak karakter mengalami korsleting sosial; pandangan mata kosong, tidak sanggup merangkai satu kalimat pun, dan otomatis mengiyakan apa pun yang diminta lawan bicara.</li>
        <li><strong>Amukan Emosional (Tantrum / Tsundere Outburst):</strong> Karakter meledak marah, membanting meja, meneriakkan 'B-Baka! Dasar bodoh!', dan melancarkan serangan membabi buta tanpa perhitungan.</li>
      </ol>`
    },
    {
      id: "saves-comparison",
      title: "Death Saves vs Meltdown Saves",
      leadParagraph: "Menentukan nasib saat berada di ambang batas krisis.",
      contentHtml: `<p>Dua jenis dadu penyelamatan darurat di saat kondisi kritis 0 poin:</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
        <div style="background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 8px; padding: 14px;">
          <h4 style="color: #b91c1c; margin-top: 0;">Physical Death Saves (HP = 0)</h4>
          <p>Dipicu saat tubuh pingsan tak sadarkan diri akibat pukulan fisik:</p>
          <ul>
            <li>Setiap giliran, lempar <strong>d20 murni tanpa modifier</strong>.</li>
            <li>Hasil <strong>10–20:</strong> Sukses (butuh 3 sukses untuk stabil).</li>
            <li>Hasil <strong>1–9:</strong> Gagal (3 gagal = koma kritis / dilarikan ke rumah sakit).</li>
            <li>Natural 20: Bangkit kembali dengan 1 HP!</li>
          </ul>
        </div>
        <div style="background: rgba(147, 51, 234, 0.06); border: 1px solid rgba(147, 51, 234, 0.25); border-radius: 8px; padding: 14px;">
          <h4 style="color: #7e22ce; margin-top: 0;">Social Meltdown Saves (Composure = 0)</h4>
          <p>Dipicu saat reputasi sosial hancur di depan umum:</p>
          <ul>
            <li>Setiap giliran, lempar <strong>d20 + Modifier Mind</strong>.</li>
            <li>Hasil <strong>&ge; 10:</strong> Sukses memulihkan kendali diri (butuh 3 sukses untuk pulih dengan 1 Composure).</li>
            <li>Hasil <strong>&lt; 10:</strong> Gagal (3 gagal = reputasi hancur total, menjadi bahan tertawaan sekolah selama 1 minggu).</li>
            <li>Kawan bisa membantu dengan aksi <em>Comfort / Pelukan Menenangkan</em> untuk memberikan Advantage pada lemparan ini!</li>
          </ul>
        </div>
      </div>`,
      callouts: [
        {
          type: "tip",
          title: "Bantuan Teman (Social CPR)",
          content: "Seorang kawan dapat menggunakan aksinya untuk mendekati karakter yang sedang mengalami Meltdown, menggenggam tangannya atau memberikan kata-kata penghiburan yang tulus. Jika kawan berhasil melewati check <em>Mind (Interpersonal) DC 12</em>, karakter yang Meltdown langsung pulih dengan 1d4 Composure tanpa perlu menyelesaikan 3 Meltdown Saves!"
        }
      ]
    }
  ]
};
