import { HandbookChapter } from "./types";

export const CHAPTER_3_ARCHETYPES: HandbookChapter = {
  id: "chapter-3-archetypes",
  number: 3,
  japaneseTitle: "第三章：学生のアーキタイプ (Archetypes Murid)",
  title: "Arketipe Murid (Archetypes)",
  subtitle: "Kepribadian Sekolah, Bonus Atribut, Keistimewaan & Jurus Personal",
  summary: "Memilih identitas sosial dan persona karaktermu di sekolah: dari Berandalan dengan tatapan maut hingga Idola Sekolah yang membius kalbu.",
  leadParagraph: "Di lorong SMA Housen Academy, setiap murid membawa cap sosial dan stereotip unik yang mendefinisifikasikan cara mereka berinteraksi dengan lingkungan. Arketipe bukan sekadar label, melainkan cetak biru psikologis yang menentukan bonus atribut, keistimewaan pasif (perks), dan tiga jurus khas (archetype moves) yang dapat digunakan dalam konflik fisik maupun drama percintaan.",
  sections: [
    {
      id: "archetype-overview",
      title: "Memilih Arketipe",
      leadParagraph: "Saat pembuatan karakter pada Langkah 3, pilihlah satu dari delapan Arketipe Murid.",
      contentHtml: `<p>Arketipe memberikan manfaat berikut secara permanen:</p>
      <ul>
        <li><strong>Bonus Kemampuan (Stat Bonus):</strong> Tambahan +2 pada atribut primer dan +1 pada atribut sekunder (atau +1 merata pada enam atribut bagi murid biasa).</li>
        <li><strong>Dua Keistimewaan (Perks):</strong> Kemampuan pasif yang memperkuat kepribadian dalam gameplay harian maupun situasi genting.</li>
        <li><strong>Tiga Jurus Arketipe (Archetype Moves):</strong> Tindakan aktif, reaksi, atau pemulihan emosional yang siap dipicu di lembar karakter (Sheet Actions).</li>
      </ul>`,
      callouts: [
        {
          type: "tip",
          title: "Sinergi Arketipe dan Klub",
          content: "Gabungan Arketipe dan Klub Ekstrakurikuler menciptakan kombinasi karakter yang tak terbatas. Seorang <em>Delinquent</em> yang masuk <em>Klub Sastra</em> akan menghadirkan dinamika 'berandalan berhati lembut pecinta puisi' yang sangat berdaya pikat!"
        }
      ]
    },
    {
      id: "delinquent",
      title: "1. Delinquent (Berandalan / Yanki)",
      subtitle: "Seragam Dasi Longgar, Tatapan Tajam & Hati Emas Tersembunyi",
      leadParagraph: "Sering bolos di atap sekolah, merokok di balik tembok gedung olahraga, dan disegani preman jalanan.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Physique, +1 Looks.<br>
      Delinquent terbiasa dengan adu fisik jalanan dan memiliki wibawa liar yang justru membuat banyak orang terpikat diam-diam.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Aura Mengancam:</strong> Advantage pada check Intelligent (Street) saat berhadapan dengan geng lain, preman, atau konflik lorong.</li>
        <li><strong>Kulit Tebal Berantem:</strong> Tambahan +2 Physical HP maksimal di setiap kenaikan level.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Tatapan Intimidasi (Killer Glare)",
          subtitle: "Social Attack Move",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Memandang tajam dengan tatapan dingin tanpa kedip yang membuat nyali lawan ciut seketika.",
          details: {
            "Check": "Looks / Aura vs Target Mind Save",
            "Efek": "Target kehilangan 1d6 Composure dan menderita Disadvantage pada serangan pertama mereka di ronde ini."
          }
        },
        {
          title: "Gertakan Berandalan (Street Threat)",
          subtitle: "Social Control Move",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Mengepalkan tangan dan berdiri tegak dengan ekspresi sangar yang tak terbantahkan.",
          details: {
            "Check": "Physique / Power vs Target Mind Save",
            "Efek": "Target harus Mind Save atau tidak berani mendekat dalam jarak 10 ft selama 1 giliran."
          }
        },
        {
          title: "Backing Geng (Street Crew)",
          subtitle: "Utility Move",
          metaBadge: "1x per Long Rest • Jarak Self",
          description: "Menghubungi kenalan geng lama via SMS untuk meminta pertolongan darurat atau intel jalanan.",
          details: {
            "Check": "Intelligent / Street",
            "Efek": "Memanggil bantuan 1–2 NPC pendukung netral untuk mengamankan lokasi atau mengorek informasi rahasia kota."
          }
        }
      ]
    },
    {
      id: "jock",
      title: "2. Jock / Sporty (Atlet Sekolah)",
      subtitle: "Bugar, Berenergi Tinggi, Semangat Pantang Menyerah",
      leadParagraph: "Bintang lapangan yang selalu membawa handuk leher, lari pagi mengitari kompleks, dan bertekad membawa tim ke kejuaraan nasional.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Physique, +1 Talent.<br>
      Kecepatan refleks dan kebugaran tubuh adalah modal utama mereka menghadapi maraton kompetisi sekolah.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Semangat Juang:</strong> Saat Physical HP berada di bawah setengah dari nilai maksimal, dapatkan bonus +1 pada seluruh Attack roll.</li>
        <li><strong>Kaki Kijang:</strong> Kecepatan mobilitas dasar bertambah +5 ft (menjadi 35 ft per giliran).</li>
      </ul>`,
      statBlocks: [
        {
          title: "Lompatan Adrenalin (Adrenaline Rush)",
          subtitle: "Self Recovery Move",
          metaBadge: "Bonus Action • 1x per Short Rest",
          description: "Memompa semangat juang dari dalam dada saat melihat teman terdesak atau situasi genting.",
          details: {
            "Syarat": "Physical HP di bawah 50%",
            "Efek": "Memulihkan 1d8 Physical HP secara instan tanpa membuang aksi utama."
          }
        },
        {
          title: "Gaya Olahraga Memikat (Sporty Charisma)",
          subtitle: "Passive Aura / Social Buff",
          metaBadge: "Pasif • Jarak 30 ft",
          description: "Keringat bercucuran, napas terengah, dan tatapan bersinar — kombinasi pesona atletik yang membius penonton.",
          details: {
            "Pemicu": "Setelah melakukan aksi fisik di depan kerumunan",
            "Efek": "Advantage pada seluruh Looks check selama 10 menit berikutnya."
          }
        },
        {
          title: "Teriakan Bakar Semangat (Hype Shout)",
          subtitle: "Team Buff Move",
          metaBadge: "1 Action • 1x per Long Rest • 30 ft",
          description: "Berteriak lantang menyemangati seluruh regu layaknya kapten memimpin babak final.",
          details: {
            "Check": "Physique / Stamina",
            "Efek": "Seluruh sekutu dalam radius 30 ft mendapat Advantage pada Physical Saving Throw dan Attack roll selama 2 giliran."
          }
        }
      ]
    },
    {
      id: "nerd",
      title: "3. Nerd (Kutu Buku / Ambisius)",
      subtitle: "Kacamata Frame Tebal, Catatan Rapi & Tahu Segalanya",
      leadParagraph: "Juara bertahan ranking paralel sekolah yang selalu duduk di baris terdepan dan membawa kamus saku tebal.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Intelligent, +1 Mind.<br>
      Kekuatan penalaran logika tajam dan ketahanan mental menghadapi ribuan lembar soal olimpiade.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Pustaka Berjalan:</strong> Advantage pada semua check Intelligent (Academic) terkait materi pelajaran dan aturan sekolah.</li>
        <li><strong>Persiapan Matang:</strong> Tambahkan Modifier Intelligent ke dalam perhitungan Inisiatif di awal pertempuran/pertemuan.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Analisis Cepat (Quick Analysis)",
          subtitle: "Tactical Combat Move",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Mengamati situasi dalam hitungan detik dan langsung memetakan celah pertahanan lawan.",
          details: {
            "Check": "Intelligent / Academic",
            "Efek": "Mengidentifikasi pola perilaku lawan; serangan berikutmu atau kawan ke target mendapat Advantage."
          }
        },
        {
          title: "Presentasi Fakta (Fact Check)",
          subtitle: "Social Attack Move",
          metaBadge: "1 Action • Jarak 20 ft",
          description: "Membantah klaim bohong lawan secara sistematis dengan data, fakta hukum sekolah, dan angka presisi.",
          details: {
            "Check": "Intelligent / People vs Target Intelligent Save",
            "Efek": "Target kehilangan 1d6 Composure karena argumennya runtuh tak terbantahkan di depan umum."
          }
        },
        {
          title: "Memori Fotografis (Eidetic Memory)",
          subtitle: "Passive Utility Move",
          metaBadge: "Pasif • Jarak Self",
          description: "Daya ingat luar biasa yang mampu mengingat lembaran kertas, wajah orang, atau nomor rahasia secara presisi.",
          details: {
            "Efek": "Dapat mengingat dan mengulang secara akurat segala hal yang pernah dibaca/dilihat dalam 24 jam terakhir tanpa perlu melempar dadu."
          }
        }
      ]
    },
    {
      id: "class_clown",
      title: "4. Class Clown (Pelawak Kelas)",
      subtitle: "Tukang Rusuh Positif, Pemecah Kecanggungan & Bikin Ngakak",
      leadParagraph: "Tidak ada hari yang sepi jika ia ada. Selalu siap dengan celetukan spontan, lelucon receh, dan aksi konyol yang mencairkan suasana.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Talent, +1 Looks.<br>
      Kreativitas panggung tanpa tanding dan kepribadian ceria yang dicintai seisi kelas.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Peredam Ketegangan:</strong> Sebagai reaksi, dapat memulihkan 1d4 Composure kawan yang sedang mengalami Salting.</li>
        <li><strong>Lolos Karena Lucu:</strong> Sekali per hari, jika tertangkap melanggar tata tertib ringan, bisa melempar lelucon untuk dimaafkan guru tanpa hukuman.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Lelucon Pengalih Perhatian (Distraction Prank)",
          subtitle: "Social Crowd Control",
          metaBadge: "Bonus Action • Jarak 30 ft",
          description: "Melakukan aksi konyol atau melempar lelucon absurd yang memaksa seluruh perhatian tertuju kepadanya.",
          details: {
            "Check": "Talent / Performance vs Target Mind Save",
            "Efek": "Target mengalami status Distracted (Disadvantage pada check Perception) selama 1 giliran."
          }
        },
        {
          title: "Humor Penstabil (Tension Breaker)",
          subtitle: "Team Composure Heal",
          metaBadge: "1 Action • 1x per Short Rest • 30 ft",
          description: "Menyelipkan lelucon hangat di saat atmosfer sedang membeku karena kecanggungan sosial.",
          details: {
            "Check": "Talent / Adaptability",
            "Efek": "Memulihkan 1d6 Composure ke seluruh sekutu dalam radius 30 ft yang sedang tertekan."
          }
        },
        {
          title: "Peniruan Sempurna (Perfect Impression)",
          subtitle: "Impersonation Move",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Menirukan gestur, nada bicara, dan gaya khas guru atau lawan dengan tingkat kemiripan komikal 100%.",
          details: {
            "Check": "Talent / Performance vs Target Mind Save",
            "Efek": "Target kehilangan 1d4 Composure karena malu atau kesal menjadi bahan tertawaan."
          }
        }
      ]
    },
    {
      id: "emo",
      title: "5. Emo / Serius (Penyendiri Misterius)",
      subtitle: "Duduk di Sudut Jendela, Headphone Terpasang & Tatapan Dingin",
      leadParagraph: "Menatap rintik hujan dari bangku paling belakang, tenggelam dalam dunia musik sendiri, dan sulit ditebak perasaannya.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Mind, +1 Intelligent.<br>
      Baja pertahanan batin dan kepekaan intuisi yang mampu mengendus kepalsuan di balik senyuman orang lain.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Dinding Emosi Baja:</strong> Advantage pada Mind Saving Throw saat menghadapi serangan verbal, gosip, atau godaan asmara murahan.</li>
        <li><strong>Peka Sandiwara:</strong> Bonus +2 pada Passive Insight / People untuk mendeteksi senyuman palsu atau niat manipulatif.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Keheningan Menghantui (Eerie Silence)",
          subtitle: "Psychological Pressure",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Berdiam diri tanpa sepatah kata pun sambil menatap lurus. Keheningan yang lebih menusuk daripada makian.",
          details: {
            "Check": "Mind / Emotional vs Target Mind Save",
            "Efek": "Target kehilangan 1d6 Composure karena merasa dihakimi dan gelisah oleh ketenanganmu."
          }
        },
        {
          title: "Introspeksi Diam (Silent Contemplation)",
          subtitle: "Restoration Move",
          metaBadge: "10 Menit Istirahat • Jarak Self",
          description: "Menyendiri dengan headphone di pojok atap atau bawah tangga sekolah, meregenerasi energi batin.",
          details: {
            "Efek": "Memulihkan 1d8 Composure dan mendapatkan Advantage pada seluruh Mind Saving Throw selama 1 jam ke depan."
          }
        },
        {
          title: "Kata Tajam Terakhir (Cutting Remark)",
          subtitle: "Counter Reaction",
          metaBadge: "Reaction • Jarak 15 ft",
          description: "Satu kalimat dingin, singkat, dan tepat sasaran yang meruntuhkan keangkuhan penyerang.",
          details: {
            "Pemicu": "Menerima serangan sosial dari lawan",
            "Efek": "Balikkan 1d4 Composure damage secara langsung kepada penyerang."
          }
        }
      ]
    },
    {
      id: "weeb",
      title: "6. Weeb / Chuunibyou (Pencinta Pop Culture)",
      subtitle: "Imajinasi Liar, Gantungan Tas Penuh Pin & Sindrom Pahlawan",
      leadParagraph: "Membawa novel ringan di saku blazer, percaya pada takdir pertemuan anime, dan siap melindungi teman dengan jurus rahasia.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Luck, +1 Talent.<br>
      Keberuntungan takdir khas protagonis fiksi dan imajinasi kreatif yang seringkali mendatangkan keajaiban.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Daya Khayal Tanpa Batas:</strong> Dapat menggunakan stat Talent untuk check kemampuan fisik saat mengeksekusi pose teatrikal dramatis.</li>
        <li><strong>Plot Armor Asmara:</strong> Sekali per sesi, jika Composure karakter jatuh ke angka 0, karakter tetap bertahan di 1 Composure lewat monolog batin heroik!</li>
      </ul>`,
      statBlocks: [
        {
          title: "Teknik Rahasia Chuunibyou (Secret Technique)",
          subtitle: "Dramatic Attack",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Mengambil kuda-kuda dramatis dan meneriakkan nama teknik rahasia anime yang memukau sekaligus mengagetkan lawan.",
          details: {
            "Check": "Talent / Performance vs Target Mind Save",
            "Efek": "1d8 Composure damage (meningkat menjadi 1d10 jika pemain memperagakan pose dramatis di meja main!)."
          }
        },
        {
          title: "Referensi Tersembunyi (Hidden Reference)",
          subtitle: "Analytical Inspiration",
          metaBadge: "Bonus Action • Jarak Self",
          description: "Mengingat strategi atau dialog dari anime favorit yang secara ajaib sangat relevan dengan situasi saat ini.",
          details: {
            "Check": "Talent / Creative",
            "Efek": "Advantage pada satu check sosial atau intelektual berikutnya."
          }
        },
        {
          title: "Keberuntungan Flag Asmara (Lucky Romance Flag)",
          subtitle: "Fate Manipulation",
          metaBadge: "1x per Long Rest • Jarak Self",
          description: "Yakin bahwa 'kejadian ini pasti flag asmara!', takdir anime berpihak untuk membalikkan keberuntungan.",
          details: {
            "Check": "Luck / Relationship Luck",
            "Efek": "Reroll satu lemparan dadu d20 apapun dan ambil hasil yang lebih tinggi untuk aksi sosial/asmara."
          }
        }
      ]
    },
    {
      id: "popular_kids",
      title: "7. Popular Kids (Idola Sekolah / Trendsetter)",
      subtitle: "Senyum Menawan, Pakaian Modis & Selalu Jadi Pusat Perhatian",
      leadParagraph: "Berjalan di lorong dengan tatapan kagum mengiringi setiap langkah. Trendsetter sekolah yang disegani kawan maupun guru.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +2 Looks, +1 Mind.<br>
      Pesona visual membius, karisma kepemimpinan sosial, dan jaringan koneksi pergaulan yang luas.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Efek Halo Karismatik:</strong> Orang baru atau NPC netral selalu memiliki prasangka baik kepadamu saat pertama kali berjumpa.</li>
        <li><strong>Jaringan Koneksi:</strong> Dapat meminta bantuan kecil kepada hampir semua murid di sekolah tanpa perlu melempar dadu.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Senyum Menawan (Charming Smile)",
          subtitle: "Social Stun Move",
          metaBadge: "1 Action • Jarak 10 ft",
          description: "Senyuman manis berdaya pikat tinggi yang melumpuhkan konsentrasi siapa saja yang memandangnya.",
          details: {
            "Check": "Looks / Charm vs Target Mind Save",
            "Efek": "1d6 Composure damage. Target mengalami status Distracted (Disadvantage pada aksi berikutnya)."
          }
        },
        {
          title: "Pengaruh Media Sosial (Trendsetter Post)",
          subtitle: "Schoolwide Influence",
          metaBadge: "1x per Long Rest • Seluruh Sekolah",
          description: "Mengunggah postingan atau cerita strategis di media sosial sekolah yang langsung membentuk opini publik.",
          details: {
            "Check": "Looks / Influence",
            "Efek": "Mempengaruhi reputasi atau opini publik sekolah terhadap target/isu tertentu selama 1 hari penuh."
          }
        },
        {
          title: "Koneksi VIP (Name-Drop)",
          subtitle: "Social Protection",
          metaBadge: "Reaction • Jarak 30 ft",
          description: "Menyebut nama guru favorit, ketua dewan sekolah, atau alumni terpandang untuk membatalkan konfrontasi.",
          details: {
            "Check": "Looks / Influence",
            "Efek": "Membatalkan satu tindakan negatif atau hukuman disiplin yang diarahkan kepadamu atau kawanmu."
          }
        }
      ]
    },
    {
      id: "normies",
      title: "8. Normies (Murid Biasa / Serba Seimbang)",
      subtitle: "Tidak Banyak Tingkah, Pengamat Damai & Menghargai Hal Simpel",
      leadParagraph: "Tidak mencolok, tidak suka mencari masalah, dan menikmati hangatnya pertemanan sehari-hari dengan tulus.",
      contentHtml: `<p><strong>Bonus Atribut:</strong> +1 ke SEMUA Atribut (+1 PHY, +1 INT, +1 LOK, +1 MND, +1 TLN, +1 LCK).<br>
      Keseimbangan sempurna yang membuat mereka mampu beradaptasi dalam segala situasi tanpa kelemahan fatal.</p>
      <p><strong>Keistimewaan (Perks):</strong></p>
      <ul>
        <li><strong>Kamuflase Kerumunan:</strong> Sangat mudah membaur di keramaian koridor sekolah tanpa disadari oleh pengawas atau rival.</li>
        <li><strong>Keseimbangan Hidup:</strong> Sekali per hari, dapat melakukan reroll pada hasil dadu bernilai '1' pada Saving Throw apapun.</li>
      </ul>`,
      statBlocks: [
        {
          title: "Membaur Sempurna (Blend In)",
          subtitle: "Stealth / Concealment",
          metaBadge: "Bonus Action • Jarak Self",
          description: "Menyesuaikan gestur dan pakaian agar tampak seperti murid biasa yang lewat tanpa menarik rasa curiga.",
          details: {
            "Check": "Mind / Awareness",
            "Efek": "Tidak menjadi sasaran target; musuh yang mencarimu harus melampaui Passive Perception DC 15."
          }
        },
        {
          title: "Simpati Universal (Everybody's Friend)",
          subtitle: "Peace Mediation",
          metaBadge: "1 Action • Jarak 15 ft",
          description: "Dengan ketulusan alami, meredakan perselisihan panas di antara dua pihak yang berseteru.",
          details: {
            "Check": "Mind / Interpersonal",
            "Efek": "Meredakan amarah; kedua pihak yang bertikai harus berunding secara damai minimal selama 1 giliran."
          }
        },
        {
          title: "Hoki Murni (Pure Luck)",
          subtitle: "Fate Reversion",
          metaBadge: "1x per Long Rest • Jarak Self",
          description: "Kadang keselamatan datang bukan karena rencana rumit, melainkan kebetulan ajaib yang menyelamatkan segalanya.",
          details: {
            "Check": "Luck / Situation Luck",
            "Efek": "Pilih 1 kejadian buruk yang baru saja terjadi dan batalkan (revert) hasilnya — situasi kembali normal."
          }
        }
      ]
    }
  ]
};
