import { HandbookChapter } from "./types";

export const CHAPTER_4_EKSKUL: HandbookChapter = {
  "id": "chapter-4-ekskul",
  "number": 4,
  "japaneseTitle": "第四章：部活動 (Klub Ekstrakurikuler)",
  "title": "Klub Ekstrakurikuler (Ekskul)",
  "subtitle": "Hit Dice, Saving Throw, 32 Subclass Spesialisasi & 48 Jurus Klub",
  "summary": "Memilih klub sekolah tempat karaktermu mengasah keterampilan: dari Dewan OSIS yang berwibawa, Kendo pedang bambu, hingga Band beraliran rock.",
  "leadParagraph": "Kehidupan SMA di Jepang berputar di sekitar gedung klub (Bukatsu). Klub bukan sekadar pengisi waktu sepulang sekolah, melainkan wadah di mana ikatan persahabatan diuji dan kemampuan fisik serta sosial ditempa. Di Damsel & Desire, Klub Ekstrakurikuler berfungsi layaknya 'Class' dalam D&D 5e — menentukan jenis Hit Dice untuk HP, kemampuan pertahanan Saving Throw, dua jalur Subclass, serta tiga Jurus Klub (Club Moves) spesifik.",
  "sections": [
    {
      "id": "club-basics",
      "title": "Anatomi Klub Ekstrakurikuler",
      "leadParagraph": "Setiap klub memiliki profil mekanik standar yang membentuk gaya bermain karakter.",
      "contentHtml": "<p>Saat memilih klub pada Langkah 4 pembuatan karakter, kamu mendapatkan komponen berikut:</p>\n      <ul>\n        <li><strong>Hit Die:</strong> Dadu penentu poin ketahanan fisik (d6 untuk klub riset/seni, d8 untuk kepemimpinan/ekspresi, d10 untuk beladiri/olahraga/lapangan).</li>\n        <li><strong>Atribut Primer:</strong> Dua atribut utama yang menjadi tumpuan aksi klub.</li>\n        <li><strong>Saving Throw Proficiencies:</strong> Dua atribut di mana karaktermu menambahkan Proficiency Bonus saat melempar dadu penyelamatan.</li>\n        <li><strong>Subclass (Peminatan):</strong> Jalur spesialisasi yang dipilih di dalam klub untuk memperdalam peran tertentu.</li>\n        <li><strong>Jurus Klub (Club Moves):</strong> Tiga jurus unik yang dapat dilancarkan dalam pertempuran, investigasi, maupun interaksi sosial.</li>\n      </ul>",
      "tables": [
        {
          "caption": "Ringkasan 16 Klub Ekstrakurikuler Housen Academy",
          "headers": [
            "Klub (Club)",
            "Hit Die",
            "Atribut Primer",
            "Saving Throws",
            "Fokus Utama"
          ],
          "rows": [
            [
              "OSIS (Student Council)",
              "d8",
              "Looks / Intelligent",
              "INT, LOK",
              "Otoritas, kepemimpinan & izin sekolah"
            ],
            [
              "Kendo (Pedang Bambu)",
              "d10",
              "Physique / Mind",
              "PHY, MND",
              "Serangan Shinai, pertahanan & kiai"
            ],
            [
              "Martial Arts (Karate/Judo)",
              "d10",
              "Physique",
              "PHY, TLN",
              "Bantingan matras, kuncian & pukulan kombo"
            ],
            [
              "Sports (Basket/Sepak Bola)",
              "d10",
              "Physique / Looks",
              "PHY, PHY",
              "Sprint kilat, lemparan akurat & sorak tim"
            ],
            [
              "Drama (Teater & Seni Peran)",
              "d8",
              "Looks / Talent",
              "LOK, TLN",
              "Manipulasi air mata, penyamaran & monolog"
            ],
            [
              "KIR / OSN (Sains & Riset)",
              "d6",
              "Intelligent",
              "INT, MND",
              "Analisis kelemahan, bom asap & hacking"
            ],
            [
              "Pramuka / Paskin",
              "d10",
              "Physique / Mind",
              "PHY, MND",
              "Tali temali, aba-aba komando & navigasi"
            ],
            [
              "Pecinta Alam (Mapala)",
              "d10",
              "Physique / Mind",
              "PHY, MND",
              "Survival luar ruangan, P3K & panjat dinding"
            ],
            [
              "Penyiaran (Radio Sekolah)",
              "d6",
              "Looks / Intelligent",
              "INT, LOK",
              "Pengumuman speaker, suara ASMR & scoop gosip"
            ],
            [
              "Literatur (Klub Sastra)",
              "d6",
              "Intelligent / Mind",
              "INT, MND",
              "Surat cinta mematikan, empati & kutipan tajam"
            ],
            [
              "Band Musik (Rock / Pop)",
              "d8",
              "Looks / Talent",
              "LOK, TLN",
              "Bardic riff, teriakan sonik & konser panggung"
            ],
            [
              "Painting (Seni Rupa)",
              "d6",
              "Talent / Intelligent",
              "INT, TLN",
              "Sketsa kilat, cipratan cat & karya sindiran"
            ],
            [
              "Photography (Klub Fotografi)",
              "d6",
              "Intelligent / Talent",
              "INT, TLN",
              "Lensa telefoto, flash stun & momen candid"
            ],
            [
              "Cooking (Klub Memasak)",
              "d8",
              "Intelligent / Looks",
              "INT, LOK",
              "Bento cinta, aroma penenang & camilan energi"
            ],
            [
              "Occult (Klub Okultisme)",
              "d6",
              "Mind / Luck",
              "MND, LCK",
              "Ramalan tarot, kutukan dingin & jimat ofuda"
            ],
            [
              "Gaming (Klub Video Game)",
              "d8",
              "Intelligent / Talent",
              "INT, TLN",
              "Frame parry, taunt provoke & speedrun rute"
            ]
          ]
        }
      ]
    },
    {
      "id": "club-student-council",
      "title": "1. Student Council (OSIS)",
      "subtitle": "Elit Organisasi & Penegak Ketertiban Sekolah",
      "leadParagraph": "Ruang OSIS ber-AC dingin, berkas proposal berserakan rapi di meja jati, dan tatapan tajam yang membuat murid nakal merapikan dasi.",
      "contentHtml": "<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Looks / Intelligent • <strong>Saving Throws:</strong> Intelligent, Looks.<br>\n      <strong>Hak Istimewa:</strong> Akses penuh ke ruang OSIS, wewenang menegur pelanggaran murid lain, anggaran proposal kegiatan sekolah, dan disegani dewan guru.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Ketua / Presidium</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pemimpin mutlak organisasi & perisai reputasi sekolah.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Support kepemimpinan karismatik; mengorkestrasi moral kawan dan berani menanggung beban mental demi menyelamatkan kegagalan tim.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Rapat Darurat</strong> \n                  <span style=\"color: #4b5563;\">(Support Move • 1 Action (1x per Short Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Looks / Influence — <strong>Efek:</strong> Sekutu dalam 30 ft pulihkan 1d6 + Mod Looks Composure dan mendapat Advantage pada Initiative selama 1 jam.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Mandat Ketua</strong> \n                  <span style=\"color: #4b5563;\">(Reaction / Leadership • 1 Reaction (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Ubah satu kegagalan check atau saving throw sekutu dalam 30 ft menjadi sukses mutlak. Pengguna menerima 1d4 Composure damage (Salting/Fluster).</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Divisi Kedisiplinan</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penegak tata tertib sekolah berwajah dingin tanpa kompromi.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Crowd control sosial & pengintimidasi; memanfaatkan wibawa aturan dan buku catatan pelanggaran untuk melemahkan musuh.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Peluit Disiplin</strong> \n                  <span style=\"color: #4b5563;\">(Social Debuff • 1 Bonus Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind Save (DC 8+PB+Looks) — <strong>Efek:</strong> Target gagal menderita status Shaken (Disadvantage pada serangan & check sosial) sampai akhir giliran berikutnya.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Catatan Pelanggaran</strong> \n                  <span style=\"color: #4b5563;\">(Social Leverage • 1 Action (1x per Long Rest) • Pandangan)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Pilih 1 murid yang melanggar aturan: target Disadvantage check sosial ke guru/staf selama 1 hari, dan kamu Advantage Influence ke guru/staf terkait dirinya.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Perintah Kedisiplinan (Disciplinary Order)",
          "subtitle": "Social Move",
          "metaBadge": "1 Action • Jarak 30 ft",
          "description": "Menegur target dengan suara tegas berwibawa khas pengurus OSIS.",
          "details": {
            "Check": "Looks / Influence",
            "Efek": "Target harus Mind Save (DC 8 + Prof + Mod Looks). Jika gagal: Stunned 1 giliran dan kehilangan 1d6 Composure."
          }
        },
        {
          "title": "Koneksi Pihak Sekolah (Faculty Pass)",
          "subtitle": "Reaction / Utility",
          "metaBadge": "1x per Short Rest • Jarak Self / Touch",
          "description": "Menunjukkan kartu identitas OSIS resmi atau surat mandat bertanda tangan kepala sekolah.",
          "details": {
            "Check": "Otomatis",
            "Efek": "Membatalkan konsekuensi teguran guru, razia loker, atau hukuman piket untuk dirimu dan 1 teman."
          }
        },
        {
          "title": "Proposal Darurat (Emergency Budget)",
          "subtitle": "Utility Move",
          "metaBadge": "10 Menit Persiapan • Jarak Self",
          "description": "Menyusun lembar disposisi anggaran kilat dengan cap stempel resmi OSIS.",
          "details": {
            "Check": "Intelligent / Academic",
            "Efek": "Mendapatkan 1 item kebutuhan mendesak (tiket, pass ruangan, alat sekolah) tanpa biaya selama sesi berlangsung."
          }
        }
      ]
    },
    {
      "id": "club-kendo",
      "title": "2. Kendo (Pedang Bambu)",
      "subtitle": "Disiplin Pedang Samurai & Konsentrasi Batin",
      "leadParagraph": "Hentakan kaki di lantai kayu dojo, kilatan bilah bambu Shinai di udara, dan suara teriakan Kiai yang memecah keheningan sore.",
      "contentHtml": "<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Mind • <strong>Saving Throws:</strong> Physique, Mind.<br>\n      <strong>Hak Istimewa:</strong> Penguasaan senjata latihan Shinai dan Bokken, postur kuda-kuda kokoh, dan fokus mata yang tak goyah oleh gertakan.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Gaya Serangan Kilat (Men-Striker)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Tebasan bilah pertama yang menembus pertahanan lawan seketika.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Striker ofensif agresif; unggul pada inisiatif serangan pembuka duel dan meluncurkan rentetan tebasan kombo bertubi-tubi.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Ayunan Pertama</strong> \n                  <span style=\"color: #4b5563;\">(Passive Attack • Pasif (1x per Combat) • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique Attack — <strong>Efek:</strong> Serangan shinai pertamamu dalam combat mendapat +2 to hit dan +1d6 Physical Damage tambahan.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Men-Kote-Do</strong> \n                  <span style=\"color: #4b5563;\">(Attack Combo • 1 Action (1x per Short Rest) • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique Attack — <strong>Efek:</strong> 3 serangan shinai beruntun ke 1 target. Serangan ke-2 dan ke-3 mendapat penalti -2 to hit tetapi +1d4 damage tambahan.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Gaya Pertahanan Keras (Iron Wall)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Tembok pertahanan baja pelindung kawan dari hantaman fisik.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Tank defensif garis depan; menepis serangan lawan dengan kuda-kuda kokoh dan melindungi sekutu di belakangnya.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Kuda-kuda Teguh</strong> \n                  <span style=\"color: #4b5563;\">(Reaction Defense • 1 Reaction (PBx per Long Rest) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> +3 Physical AC terhadap 1 serangan fisik. Jika serangan meleset, serangan balasan ke penyerang mendapat Advantage.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Tembok Besi</strong> \n                  <span style=\"color: #4b5563;\">(Defensive Stance • 1 Bonus Action (1x per Short Rest) • Self / 5 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Diri sendiri mendapat Resistance terhadap Physical Damage hingga awal giliran berikutnya; sekutu dalam 5 ft di belakangmu +2 Physical AC.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Tebasan Shinai: Men! (Head Slash)",
          "subtitle": "Attack Move",
          "metaBadge": "1 Action • Melee (5 ft)",
          "description": "Pukulan vertikal terarah ke arah kepala lawan dengan hentakan langkah kaki dan kiai menggelegar.",
          "details": {
            "Check": "Physique / Power",
            "Efek": "1d8 + Mod Physique Bludgeoning Damage. Jika mengenai kepala: target Physique Save atau Disadvantage pada serangan berikutnya."
          }
        },
        {
          "title": "Tangkisan Sempurna (Kendo Parry)",
          "subtitle": "Reaction Defense",
          "metaBadge": "Reaction • Jarak Self",
          "description": "Mengayunkan pedang bambu membentuk sudut miring presisi untuk membelokkan serangan lawan.",
          "details": {
            "Check": "Otomatis",
            "Efek": "Menambah +2 Physical AC secara instan terhadap 1 serangan fisik jarak dekat yang terlihat."
          }
        },
        {
          "title": "Kiai: Teriakan Semangat (Kiai Shout)",
          "subtitle": "Bonus Action Buff",
          "metaBadge": "Bonus Action • Jarak 30 ft",
          "description": "Melepas teriakan kiai penuh konsentrasi batin yang membakar semangat tempur.",
          "details": {
            "Check": "Mind / Emotional",
            "Efek": "Dirimu dan 1 sekutu mendapat Advantage pada serangan fisik berikutnya di ronde ini."
          }
        }
      ]
    },
    {
      "id": "club-martial-arts",
      "title": "3. Martial Arts (Beladiri / Karate / Judo)",
      "subtitle": "Pertarungan Jarak Dekat & Refleks Bantingan",
      "leadParagraph": "Telapak tangan berkapalan, seragam gi putih bersih, dan insting menepis pukulan sebelum mendarat di wajah.",
      "contentHtml": "<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique • <strong>Saving Throws:</strong> Physique, Talent.<br>\n      <strong>Hak Istimewa:</strong> Pukulan dan tendangan tanpa senjata berdaya rusak tinggi (1d6), kelenturan tubuh untuk meloloskan diri, dan daya tahan benturan.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Spesialis Bantingan (Judo / Grappler)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Ahli kuncian sendi matras dan bantingan peredam daya juang.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Melee brawler & controller; merebut kerah musuh, membanting keras ke tanah, dan mengunci gerak total tanpa ampun.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Uchi-mata</strong> \n                  <span style=\"color: #4b5563;\">(Takedown Move • 1 Bonus Action setelah Grapple (PBx per Long Rest) • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique / Power — <strong>Efek:</strong> Banting target: 1d8 + Mod Physique damage, dan target terkena status Dazed sampai akhir giliran berikutnya.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Ippon</strong> \n                  <span style=\"color: #4b5563;\">(Finishing Slam • 1 Action (1x per Short Rest) • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Target Physique Save (DC 8+PB+Physique) — <strong>Efek:</strong> Target Grappled/Pinned gagal save: 2d10 + Mod Physique damage dan Pinned 1 ronde penuh. Sukses: setengah damage.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Spesialis Serangan Beruntun (Striker)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Badai pukulan tangan kosong berkecepatan tinggi tanpa jeda.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">DPS kombo cepat; memaksimalkan serangan unarmed beruntun untuk memusingkan lawan lewat akumulasi pukulan telak.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Kombo Dasar</strong> \n                  <span style=\"color: #4b5563;\">(Passive Combo • Pasif • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique Attack — <strong>Efek:</strong> Serangan unarmed kedua dalam giliran yang sama mendapat bonus +2 to hit dan +1d4 damage.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Hujan Pukulan</strong> \n                  <span style=\"color: #4b5563;\">(Flurry Attack • 1 Action (1x per Short Rest) • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique Attack — <strong>Efek:</strong> 4 serangan unarmed beruntun (tiap hit +Mod Physique). Jika minimal 3 hit berhasil mengenai target, target terkena status Dazed.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Bantingan Matras (Seoi-Nage Takedown)",
          "subtitle": "Attack Move",
          "metaBadge": "1 Action • Melee (5 ft)",
          "description": "Menarik kerah atau lengan lawan, memutar pinggul, dan membantingnya keras ke lantai.",
          "details": {
            "Check": "Physique / Power vs Target Physique Save",
            "Efek": "1d6 + Mod Physique Bludgeoning Damage. Target terjatuh dalam kondisi Prone (terkapar di lantai)."
          }
        },
        {
          "title": "Pukulan Cepat Kombo (Rapid Flurry)",
          "subtitle": "Bonus Action Attack",
          "metaBadge": "Bonus Action • Melee (5 ft)",
          "description": "Kombinasi pukulan cepat tanpa jeda yang menyasar ulu hati lawan.",
          "details": {
            "Check": "Physique / Agility",
            "Efek": "Memberikan 1d4 + Mod Physique Physical Damage tambahan segera setelah serangan utama mendarat."
          }
        },
        {
          "title": "Kunci Sendi (Joint Lock)",
          "subtitle": "Control Move",
          "metaBadge": "1 Action • Melee (5 ft)",
          "description": "Memutar pergelangan atau siku lawan ke sudut anatomis yang menyakitkan.",
          "details": {
            "Check": "Physique / Agility vs Target Physique Save",
            "Efek": "Target menderita kondisi Restrained selama 1 giliran (tidak bisa bergerak atau menyerang kecuali lolos DC 12)."
          }
        }
      ]
    },
    {
      "id": "club-sports",
      "title": "4. Sports (Sepak Bola / Basket / Atletik)",
      "subtitle": "Stamina Baja & Kecepatan Lapangan Terbuka",
      "leadParagraph": "Derit sol sepatu di lapangan parket, operan bola presisi, dan fisik bugar yang selalu siap mengejar kereta terakhir.",
      "contentHtml": "<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Looks • <strong>Saving Throws:</strong> Physique (Ganda).<br>\n      <strong>Hak Istimewa:</strong> Kecepatan mobilitas ekstra (+10 ft per giliran), stamina tahan lelah, dan karisma sportif yang memikat supporter.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Striker / Ace Lapangan</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Bintang penyerang penentu kemenangan di menit-menit krusial.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Mobile skirmisher; bergerak lincah menembus barisan tanpa terkena serangan kesempatan dan unggul dalam momen genting.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Sprint Final</strong> \n                  <span style=\"color: #4b5563;\">(Mobility Burst • 1 Bonus Action (PBx per Long Rest) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Speed +15 ft sampai akhir giliran, kebal Opportunity Attack, dan Advantage pada check Agility.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Clutch Moment</strong> \n                  <span style=\"color: #4b5563;\">(Clutch Buff • 1x per Short Rest (DM) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Tambahkan dadu 1d10 ke satu roll Physique, Agility, atau Talent. Boleh digunakan setelah melihat hasil dadu.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Kapten Regu (Team Captain)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Komandan lapangan pengatur formasi dan pembakar semangat regu.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Leader & buffer taktis; memberikan koordinasi pertahanan AC tim serta pidato pemulihan moral yang memulihkan HP dan batin.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Formasi Tim</strong> \n                  <span style=\"color: #4b5563;\">(Tactical Defense • 1 Bonus Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Looks / Influence — <strong>Efek:</strong> Semua sekutu dalam 30 ft mendapat bonus +1 to hit dan +1 Physical AC hingga awal giliranmu berikutnya.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Pidato Kapten</strong> \n                  <span style=\"color: #4b5563;\">(Inspirational Rally • 1 Action (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Looks / Influence — <strong>Efek:</strong> Semua sekutu dalam 30 ft memulihkan 1d8 + Mod Looks Physical HP dan Composure, serta Advantage pada Saving Throw berikutnya.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Terobosan Kilat (Fast Break Sprint)",
          "subtitle": "Bonus Action Movement",
          "metaBadge": "Bonus Action • Jarak Self",
          "description": "Manuver lari cepat zig-zag menembus kerumunan seperti melakukan terobosan bebas ke ring lawan.",
          "details": {
            "Check": "Otomatis",
            "Efek": "Menggandakan jarak gerak (Dash) dan kebal terhadap Opportunity Attack saat melintasi lawan di ronde ini."
          }
        },
        {
          "title": "Lemparan Bola Akurat (Precision Throw)",
          "subtitle": "Ranged Attack Move",
          "metaBadge": "1 Action • Ranged (40 ft)",
          "description": "Melempar bola basket, bola voli, atau benda bulat lainnya dengan parabola presisi tinggi.",
          "details": {
            "Check": "Physique / Agility",
            "Efek": "1d6 + Mod Physique Bludgeoning Damage. Target terhuyung atau terkejut jika lemparan mendarat telak di kepala."
          }
        },
        {
          "title": "Sorak Penyemangat (Rally Cheer)",
          "subtitle": "Buff Move",
          "metaBadge": "Bonus Action • Jarak 30 ft",
          "description": "Meneriakkan yel-yel penuh kobaran api semangat ke arah kawan yang sedang tertekan.",
          "details": {
            "Check": "Looks / Influence",
            "Efek": "Satu kawan memulihkan 1d4 Physical HP dan mendapat Advantage pada satu lemparan dadu fisik berikutnya."
          }
        }
      ]
    },
    {
      "id": "club-drama",
      "title": "5. Drama Club (Teater & Seni Peran)",
      "subtitle": "Manipulasi Emosi, Akting Panggung & Dusta Sempurna",
      "leadParagraph": "Lampu sorot panggung, naskah drama penuh intrik, dan kemampuan mengubah ekspresi wajah dalam sepersekian detik.",
      "contentHtml": "<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Looks / Talent • <strong>Saving Throws:</strong> Looks, Talent.<br>\n      <strong>Hak Istimewa:</strong> Lemari kostum beragam, tetesan air mata buatan instan, peniruan intonasi suara, dan keahlian menyamar.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Aktor Protagonis / Bintang Panggung</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pusat perhatian lampu sorot penakluk simpati khalayak ramai.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Provoker sosial & clutch survivor; memaksa musuh terpaku memandangnya dan bangkit berkarisma luar biasa saat terdesak.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Pusat Perhatian</strong> \n                  <span style=\"color: #4b5563;\">(Spotlight Taunt • 1 Action (1x per Short Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Performance vs Mind Save (DC 8+PB+Looks) — <strong>Efek:</strong> Musuh yang gagal Mind Save menderita Disadvantage saat menyerang atau bertindak terhadap sekutumu (mereka terpaku padamu selama 1 menit).</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Adegan Klimaks</strong> \n                  <span style=\"color: #4b5563;\">(Climax Buff • 1 Bonus Action (1x per Long Rest) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Saat HP atau Composure <= 50%: selama 1 menit Advantage check Talent & Looks, +2 kedua AC, dan memulihkan Composure sebesar setengah maksimal.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Master Tipu Daya (Antagonist)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Dalang intrik sandiwara berwajah ganda pembalik skenario.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Deceiver & manipulator; menutupi kebohongan dengan sempurna dan membelokkan serangan musuh menjadi plot twist tak terduga.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Topeng Ganda</strong> \n                  <span style=\"color: #4b5563;\">(Passive Deception • Pasif • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Performance / Influence — <strong>Efek:</strong> Advantage pada check Performance atau Influence saat berbohong/menyamar. Siapa pun yang mencoba membongkarmu menderita Disadvantage.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Plot Twist</strong> \n                  <span style=\"color: #4b5563;\">(Reaction Counter • 1 Reaction (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Target Mind Save (DC 8+PB+Looks) — <strong>Efek:</strong> Saat musuh menyerang/menggagalkan rencanamu: musuh gagal save serangannya dialihkan ke target lain atau batal, dan kamu Advantage aksi berikutnya.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Air Mata Buatan (Fake Tears / Manipulation)",
          "subtitle": "Social Move",
          "metaBadge": "1 Action • Jarak 15 ft",
          "description": "Meneteskan air mata pura-pura sambil menggigit bibir, membalikkan simpati seluruh kerumunan kepada dirimu.",
          "details": {
            "Check": "Talent / Performance vs Target Mind Save",
            "Efek": "Target Disadvantage seluruh serangan terhadapmu dan menderita 1d6 Composure damage karena rasa bersalah."
          }
        },
        {
          "title": "Persona Penyamaran (Method Acting)",
          "subtitle": "Utility Move",
          "metaBadge": "10 Menit Persiapan • Jarak Self",
          "description": "Merombak gestur tubuh, cara berjalan, dandanan, dan aksen bicara untuk menyamar sebagai sosok lain.",
          "details": {
            "Check": "Talent / Adaptability",
            "Efek": "Advantage pada seluruh check People & Street saat menyamar selama durasi adegan."
          }
        },
        {
          "title": "Monolog Dramatis (Grand Speech)",
          "subtitle": "Area Social Attack",
          "metaBadge": "1 Action • Area 30 ft",
          "description": "Berpidato teatrikal penuh penghayatan puitis yang menusuk perasaan siapa saja yang mendengar.",
          "details": {
            "Check": "Talent / Performance vs Mind Save",
            "Efek": "Seluruh musuh dalam radius 30 ft kehilangan 1d4 Composure; kawan mendapat Advantage pada Social Saves selama 1 ronde."
          }
        }
      ]
    },
    {
      "id": "club-kir-osn",
      "title": "6. KIR / OSN (Sains & Riset Ilmiah)",
      "subtitle": "Analisis Tajam, Riset Ilmiah & Reaksi Kimia",
      "leadParagraph": "Aroma larutan kimia di ruang lab, kilatan layar monitor dengan kode baris pemrogram, dan rumus fisika yang memecahkan teka-teki.",
      "contentHtml": "<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Intelligent • <strong>Saving Throws:</strong> Intelligent, Mind.<br>\n      <strong>Hak Istimewa:</strong> Akses lemari bahan kimia lab, bank soal olimpiade, mikroskop presisi, dan keahlian bypass keamanan digital.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Peneliti Kimia & Biologi</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Peracik senyawa laboratorium penawar kondisi dan penguat raga.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Alchemist healer & buffer; meracik obat lapangan untuk memulihkan luka fisik serta formula imunitas jangka panjang.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Racikan Lab</strong> \n                  <span style=\"color: #4b5563;\">(Healing Concoction • 1 Action (PBx per Long Rest) • 5 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Satu target dalam 5 ft memulihkan 1d6 + Mod Intelligent Physical HP, atau mengakhiri 1 kondisi fisik (Dazed/sakit).</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Formula Rahasia</strong> \n                  <span style=\"color: #4b5563;\">(Group Serum • 10 Menit (1x per Long Rest) • Touch (s.d. 4 target))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Intelligent / Academic — <strong>Efek:</strong> Pilih: +2 Stamina Save selama 1 jam, atau netralkan semua kondisi fisik negatif dan pulihkan 2d6 Physical HP untuk 4 kawan.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Hacker Komputer & Robotika</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pengendali perangkat siber dan pengintai udara digital sekolah.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Utility controller & scout; memanfaatkan drone intai untuk memperluas pandangan radar tim dan menepis serangan mendadak.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Drone Rakitan</strong> \n                  <span style=\"color: #4b5563;\">(Aerial Drone Scout • 1 Bonus Action (PBx per Long Rest) • 60 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Kendalikan drone mikro selama 10 menit. Melihat sudut pandang kamera dan Advantage pada check Awareness jarak jauh.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Unit Pendukung</strong> \n                  <span style=\"color: #4b5563;\">(Robotic Defense • 1x per Long Rest (Aktif 1 Jam) • 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Reaction — <strong>Efek:</strong> Reaction: satu serangan fisik terhadap kawan dalam 15 ft otomatis ditangkis oleh drone pendamping. Sekutu yang dibantu +1d6 check Academic/Street.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Analisis Titik Lemah (Analytical Deduction)",
          "subtitle": "Tactical Combat Move",
          "metaBadge": "Bonus Action • Jarak 30 ft",
          "description": "Menganalisis keseimbangan biomekanik dan pola tingkah laku lawan lewat perhitungan matematis instan.",
          "details": {
            "Check": "Intelligent / Academic",
            "Efek": "Mengetahui 1 stat tertinggi dan 1 kelemahan target; serangan kawan berikutnya ke target mendapat Advantage."
          }
        },
        {
          "title": "Asap Reaksi Kimia (Lab Smoke Screen)",
          "subtitle": "Crowd Control Move",
          "metaBadge": "1 Action • Area 15 ft",
          "description": "Mencampurkan larutan kimia saku darurat yang memicu kabut asap tebal menyengat.",
          "details": {
            "Check": "Otomatis",
            "Efek": "Menciptakan area asap pekat radius 10 ft selama 2 giliran; seluruh penglihatan di dalamnya terhalang total."
          }
        },
        {
          "title": "Formula Konsentrasi (Study Buff)",
          "subtitle": "Buff Utility",
          "metaBadge": "10 Menit • Jarak Touch",
          "description": "Menyusun peta konsep atau rangkuman kilat ilmiah agar daya nalar otak melonjak tajam.",
          "details": {
            "Check": "Intelligent / Academic",
            "Efek": "Target mendapat Advantage pada 1 check Intelligent atau Talent berikutnya dalam rentang waktu 1 jam."
          }
        }
      ]
    },
    {
      "id": "club-pramuka",
      "title": "7. Pramuka / Paskin (Paskibra & Baris Berbaris)",
      "subtitle": "Tali Temali, Disiplin Militer & Postur Tegak",
      "leadParagraph": "Derit sepatu pantofel di lapangan upacara, simpul jangkar yang tak bisa lepas, dan wibawa komando yang membuat barisan hening seketika.",
      "contentHtml": "<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Mind • <strong>Saving Throws:</strong> Physique, Mind.<br>\n      <strong>Hak Istimewa:</strong> Tali temali simpul mati, tongkat regu serbaguna, peluit komando, dan daya tahan fisik menghadapi terik lapangan upacara.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Komandan Peleton (Danton)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pengendali irama barisan berwibawa disiplin militer yang kokoh.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Tactical commander; memimpin inisiatif kelompok lewat aba-aba tegas dan menyatukan fokus mental regu.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Aba-aba</strong> \n                  <span style=\"color: #4b5563;\">(Tactical Lead • 1 Bonus Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind / Emotional — <strong>Efek:</strong> Sekutu dalam 30 ft yang mendengar komando mendapat +1d4 pada inisiatif dan check pertama mereka.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Barisan Rapat</strong> \n                  <span style=\"color: #4b5563;\">(Morale Formation • 1 Action (1x per Short Rest) • 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Selama 1 menit, sekutu dalam 15 ft darimu mendapat +2 Mental AC dan kebal status Salting/Fluster akibat tekanan kelompok.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Pionir Tali Temali & Tenda</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Ahli ikatan simpul taktis dan pembangun pos perlindungan alam.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Field trapper & survivalist; mengikat musuh dengan simpul jerat serta mendirikan pos istirahat yang meregenerasi stamina.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Simpul Jerat</strong> \n                  <span style=\"color: #4b5563;\">(Rope Snare Trap • 1 Action (PBx per Long Rest) • 15 ft (Butuh Tali))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Target Agility Save (DC 8+PB+Physique) — <strong>Efek:</strong> Target gagal menderita status Pinned/Restrained sampai berhasil lepas lewat check Physique/Agility melawan DC-mu.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Pos Darurat</strong> \n                  <span style=\"color: #4b5563;\">(Camp Haven • 10 Menit (1x per Long Rest) • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Dirikan pos/tenda. Sekutu yang Short Rest di dalamnya mendapat 1 Rest Dice ekstra dan kebal kelelahan cuaca.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Kuncian Tali Pramuka (Rope Restrain)",
          "subtitle": "Combat Control Move",
          "metaBadge": "1 Action • Melee (5 ft)",
          "description": "Menggunakan seutas tali pramuka tebal untuk membelenggu pergelangan tangan atau kaki lawan dalam sekejap.",
          "details": {
            "Check": "Physique / Agility vs Target Agility",
            "Efek": "Target mengalami kondisi Restrained hingga berhasil meloloskan diri dengan Physique check DC 13."
          }
        },
        {
          "title": "Aba-aba Menggelegar (Commanding Drill)",
          "subtitle": "Team Buff Move",
          "metaBadge": "Bonus Action • Jarak 30 ft",
          "description": "Meneriakkan aba-aba militer tegas yang memompa kesiapsiagaan seluruh rekan regu.",
          "details": {
            "Check": "Mind / Emotional",
            "Efek": "Seluruh sekutu dalam radius 30 ft mendapat bonus +2 pada lemparan Saving Throw berikutnya."
          }
        },
        {
          "title": "Teknik Pengintaian (Scout Surveillance)",
          "subtitle": "Tactical Utility",
          "metaBadge": "1 Menit • Jarak 60 ft",
          "description": "Mengamati pergerakan lingkungan secara senyap layaknya regu pengintai patroli.",
          "details": {
            "Check": "Mind / Awareness",
            "Efek": "Mendeteksi secara tepat jumlah personel, rute patroli, dan posisi musuh di area sekitar selama 1 menit."
          }
        }
      ]
    },
    {
      "id": "club-pecinta-alam",
      "title": "8. Pecinta Alam (Sispala)",
      "subtitle": "Insting Bertahan Hidup, Peta Liar & Fisik Tangguh",
      "leadParagraph": "Ransel carrier penuh tali karmantel, kompor lapangan gas mini, dan insting tajam yang membaca arah hembusan angin perbukitan.",
      "contentHtml": "<p><strong>Hit Die:</strong> d10 • <strong>Atribut Primer:</strong> Physique / Mind • <strong>Saving Throws:</strong> Physique, Mind.<br>\n      <strong>Hak Istimewa:</strong> Kapasitas tas ransel ekstra, perlengkapan bivak darurat, kemampuan membaca cuaca, dan daya tahan tubuh di alam liar.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Penjelajah Rimba & Pendaki</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penakluk tebing curam dan penjelajah medan terjal tak kenal lelah.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Explorer scout; memiliki mobilitas panjat setara kecepatan jalan, kebal bahaya gravitasi, dan sigap menarik kawan yang tergelincir.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Naluri Rimba</strong> \n                  <span style=\"color: #4b5563;\">(Passive Navigation • Pasif • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind / Awareness — <strong>Efek:</strong> Advantage pada check Awareness & Stamina di alam terbuka, tidak bisa tersesat, dan kecepatan memanjat sama dengan kecepatan jalan.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Pendaki Sejati</strong> \n                  <span style=\"color: #4b5563;\">(Reaction Rescue • 1 Reaction (PBx per Long Rest) • 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique / Agility — <strong>Efek:</strong> Saat kamu/sekutu dalam 15 ft jatuh, ia kebal damage jatuh. Kamu boleh menarik sekutu itu sejauh 15 ft ke tempat aman.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Ahli Pertolongan Pertama (Medic)</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Paramedis garis depan penyelamat nyawa di saat genting.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Dedicated combat healer; membalut cedera fisik kawan seketika dan membangkitkan rekan yang tumbang dengan perlindungan ekstra.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] P3K Darurat</strong> \n                  <span style=\"color: #4b5563;\">(Field First Aid • 1 Action (PBx per Long Rest) • 5 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Satu sekutu dalam 5 ft memulihkan 1d8 + Mod Mind Physical HP dan mengakhiri 1 kondisi buruk (misal Dazed).</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Triage</strong> \n                  <span style=\"color: #4b5563;\">(Revive Action • 1 Bonus Action (1x per Short Rest) • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Sekutu yang tumbang (HP 0) langsung sadar bangun dengan 2d8 + Mod Mind Physical HP dan menerima Temp HP sebesar PB.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Insting Survival (Wilderness Awareness)",
          "subtitle": "Passive Defense",
          "metaBadge": "Pasif / Reaksi • Jarak Self",
          "description": "Membaca arah angin, lumut pepohonan, dan jejak tanah di sekitar lokasi.",
          "details": {
            "Check": "Mind / Awareness",
            "Efek": "Tidak pernah tersesat di luar ruangan dan kebal terhadap kondisi Surprised (serangan kejutan musuh)."
          }
        },
        {
          "title": "P3K Darurat Lapangan (First Aid Field Patch)",
          "subtitle": "Healing Move",
          "metaBadge": "1 Action • 1x per Rest • Jarak Touch",
          "description": "Membalut luka dengan perban elastis dan memberikan minuman hangat penghilang syok.",
          "details": {
            "Check": "Otomatis",
            "Efek": "Memulihkan 1d8 + Mod Mind Physical HP atau Composure kepada teman yang terluka parah."
          }
        },
        {
          "title": "Panjat Penghalang (Obstacle Climb)",
          "subtitle": "Mobility Utility",
          "metaBadge": "Bonus Action • Jarak Self",
          "description": "Menggunakan teknik panjat tebing lincah untuk melompati tembok atau pagar pembatas.",
          "details": {
            "Check": "Physique / Agility",
            "Efek": "Berhasil melewati pagar atau dinding tinggi tanpa perlu melempar dadu (1x per Short Rest)."
          }
        }
      ]
    },
    {
      "id": "club-penyiaran",
      "title": "9. Penyiaran (Broadcasting / Radio Sekolah)",
      "subtitle": "Suara Emas Penguasa Speaker Sekolah & Intel Gosip",
      "leadParagraph": "Mixer audio berkedip merah, mikrofon kondenser dengan filter busa, dan desas-desus sekolah yang selalu terdengar pertama kali di telinga mereka.",
      "contentHtml": "<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Looks / Intelligent • <strong>Saving Throws:</strong> Intelligent, Looks.<br>\n      <strong>Hak Istimewa:</strong> Akses ruang siaran sekolah, sound system speaker terpusat, koleksi piringan hitam/lagu, dan jejaring informan gosip terluas.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Penyiar Radio Sekolah</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Suara emas penenang jiwa dan pengendali gelombang suasana sekolah.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Social bard & crowd buffer; menghibur batin kawan lewat siaran ASMR dan menyiarkan perintah evakuasi darurat ke seluruh area.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Suara Siaran</strong> \n                  <span style=\"color: #4b5563;\">(Passive Broadcast Buff • Pasif + 1x per Short Rest • Self / Area)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Looks / Charm — <strong>Efek:</strong> Advantage pada Charm & Performance saat memakai mic. Siaran 10 menit memberi sekutu yang mendengar Temp Composure 1d6 + Mod Looks.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Pengumuman Darurat</strong> \n                  <span style=\"color: #4b5563;\">(Mass Command • 1 Action (1x per Long Rest, DM) • Seluruh Sekolah)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Target Mind Save — <strong>Efek:</strong> Umumkan lewat speaker. Seluruh NPC di sekolah mengikuti instruksi sederhana (evakuasi/kumpul/berhenti berkelahi) kecuali yang lolos Mind Save.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Reporter Investigasi</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pemburu skandal rahasia dan pengungkap fakta di balik layar.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Detective debuffer; menggali rahasia terpendam narasumber lewat wawancara taktis lalu membongkarnya di depan umum.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Wawancara Tajam</strong> \n                  <span style=\"color: #4b5563;\">(Investigative Probe • Pasif • 5 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Interpersonal / Influence — <strong>Efek:</strong> Advantage pada check Interpersonal dan Influence saat mewawancarai; wawancara sukses memberi 1 fakta akurat dari DM.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Ekspos</strong> \n                  <span style=\"color: #4b5563;\">(Scandal Exposure • 1 Action (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Bongkar rahasia/bukti target: target menderita 3d4 Composure damage (Salting/Fluster) dan Disadvantage check sosial 1 hari; kamu +2 Influence.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Pengumuman Speaker Sekolah (Public Broadcast)",
          "subtitle": "Schoolwide Social Attack",
          "metaBadge": "1 Aksi Khusus • Seluruh Sekolah",
          "description": "Menyalakan mixer sentral dan mengumumkan rahasia atau gosip menggemparkan ke seluruh pengeras suara sekolah.",
          "details": {
            "Check": "Looks / Influence",
            "Efek": "Target gosip menderita 1d8 Composure damage secara instan jika namanya disebutkan di hadapan khalayak ramai."
          }
        },
        {
          "title": "Modulasi Suara Menghanyutkan (Soothing Voice)",
          "subtitle": "Charm Social Move",
          "metaBadge": "1 Action • Jarak 30 ft",
          "description": "Berbicara dengan artikulasi merdu dan frekuensi hangat yang meredakan emosi agresif pendengar.",
          "details": {
            "Check": "Looks / Charm vs Target Mind Save",
            "Efek": "Target terpesona dan tidak dapat melancarkan tindakan agresif selama 1 giliran."
          }
        },
        {
          "title": "Bocoran Intel Eksklusif (Exclusive Scoop)",
          "subtitle": "Information Gathering",
          "metaBadge": "10 Menit • Jarak Self",
          "description": "Mengontak informan bayangan di berbagai kelas untuk mengumpulkan rumor terpanas.",
          "details": {
            "Check": "Intelligent / Street",
            "Efek": "Mendapatkan 1 informasi rahasia atau kebenaran rumor tentang karakter/kejadian tertentu sebelum aksi dimulai."
          }
        }
      ]
    },
    {
      "id": "club-literatur",
      "title": "10. Literatur (Klub Sastra & Membaca)",
      "subtitle": "Kekuatan Kata Romantis, Sajak & Misteri Buku Lama",
      "leadParagraph": "Aroma kertas lapuk di pojok perpustakaan sunyi, secangkir teh seduh, dan goresan tinta pena yang mampu meluluhkan hati paling beku.",
      "contentHtml": "<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Intelligent / Mind • <strong>Saving Throws:</strong> Intelligent, Mind.<br>\n      <strong>Hak Istimewa:</strong> Akses ruang arsip perpustakaan lama, koleksi novel sastra romansa klasik, dan kepiawaian merangkai surat cinta berdaya pikat mematikan.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Penulis Puisi & Novel Romansa</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penenun sajak kasmaran peluluh ketegaran batin sang pujaan hati.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Romance specialist; merangkai kata puitis yang membuat target salah tingkah (Salting) serta menciptakan mahakarya bernilai Heart Inspiration.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Kata Pemikat</strong> \n                  <span style=\"color: #4b5563;\">(Romantic Lyric • 1 Action (PBx per Long Rest) • 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Creative vs Mind Save (DC 8+PB+Looks) — <strong>Efek:</strong> Advantage check Charm; target gagal Mind Save menerima 1d4 Composure damage (tersipu / Salting).</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Magnum Opus</strong> \n                  <span style=\"color: #4b5563;\">(Literary Masterpiece • 1x per Long Rest • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Creative — <strong>Efek:</strong> Tulis karya sastra romansa. Pemegangnya +3 pada 1 check sosial/romance, dan kamu atau penerimanya mendapat 1 Heart Inspiration.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Penjaga Arsip Sejarah Sekolah</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penjaga dokumen terlarang dan rahasia kuno di balik dinding sekolah.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Lore master & researcher; mengingat sejarah sekolah tanpa cela dan membuka arsip lama yang menyingkap misteri besar Housen Academy.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Arsip Hidup</strong> \n                  <span style=\"color: #4b5563;\">(Historical Recall • Pasif + 1x per Short Rest • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Intelligent / Academic — <strong>Efek:</strong> Advantage check Academic untuk sejarah sekolah dan bangunan; tanya DM 1 fakta sejarah sekolah dan jawabannya pasti benar.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Catatan Terlarang</strong> \n                  <span style=\"color: #4b5563;\">(Secret Archives • 10 Menit (1x per Long Rest) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Intelligent / Academic — <strong>Efek:</strong> Akses arsip tersembunyi. DM memberi petunjuk penting misteri sekolah; kamu dan 1 sekutu Advantage pada check investigasi terkait selama 1 hari.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Surat Cinta Puitis (Lethal Love Letter)",
          "subtitle": "Romance Move",
          "metaBadge": "Dibuat Saat Rest • Loker Sepatu",
          "description": "Menyelipkan sepucuk surat wangi berhias kata-kata puitis mendalam di loker sepatu gebetan.",
          "details": {
            "Check": "Talent / Creative vs Target Mind Save",
            "Efek": "Target menderita 2d6 Composure damage (syok kasmaran) dan Heart Meter gebetan naik +1 ♥."
          }
        },
        {
          "title": "Membaca Pola Pikiran (Literary Empathy)",
          "subtitle": "Psychological Insight",
          "metaBadge": "1 Action • Jarak 15 ft",
          "description": "Menganalisis diksi kata dan intonasi lawan bicara layaknya membaca sudut pandang tokoh novel.",
          "details": {
            "Check": "Mind / Interpersonal",
            "Efek": "Mengetahui satu keinginan terbesar atau penyesalan terdalam dari target yang sedang diajak bicara."
          }
        },
        {
          "title": "Kutipan Menghancurkan (Devastating Quote)",
          "subtitle": "Social Attack Move",
          "metaBadge": "1 Action • Jarak 20 ft",
          "description": "Mengutip bait sastra atau filsafat yang secara telak membantah argumen congkak lawan.",
          "details": {
            "Check": "Intelligent / Academic vs Mind Save",
            "Efek": "Target kehilangan 1d8 Composure karena kehilangan kata-kata menghadapi kebenaran mutlak."
          }
        }
      ]
    },
    {
      "id": "club-band",
      "title": "11. Band Musik (Gitar / Drum / Vokal / Keyboard)",
      "subtitle": "Dentuman Distorsi, Semangat Jiwa Muda & Fans Fanatik",
      "leadParagraph": "Kabel ampli berseliweran di studio kedap suara, raungan gitar listrik bernada tinggi, dan panggung festival sekolah yang mengguncang jiwa.",
      "contentHtml": "<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Looks / Talent • <strong>Saving Throws:</strong> Looks, Talent.<br>\n      <strong>Hak Istimewa:</strong> Kunci studio musik berperedam, amplifier portabel, instrumen andalan pribadi, dan lingkar penggemar setia di sekolah.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Lead Guitarist / Soloist</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Petikan solo distorsi bertenaga yang mengguncang panggung festival.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Sonic attacker & inspire; membakar semangat awal lewat riff pembuka dan membawakan solo gitar epik yang melumpuhkan pendengaran musuh.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Riff Pembuka</strong> \n                  <span style=\"color: #4b5563;\">(Solo Lead Buff • 1 Bonus Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Performance — <strong>Efek:</strong> Solo gitar singkat: dirimu +1d6 pada check Performance, dan sekutu yang mendengar +1 pada lemparan dadu pertama mereka.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Solo Legendaris</strong> \n                  <span style=\"color: #4b5563;\">(Sonic Climax • 1 Action (1x per Long Rest) • Area 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique Save (DC 8+PB+Talent) — <strong>Efek:</strong> Sekutu dalam 30 ft pulihkan 1d10 + Mod Talent Composure; musuh gagal save terkena status Dazed selama 1 ronde.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Vokalis Utama Karismatik</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Magnet panggung pemikat hati yang menghipnotis seisi auditorium.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Charismatic crowd charmer; memikat perhatian lawan lewat suara emas dan memicu encore yang menghapus beban emosional kawan.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Suara Memikat</strong> \n                  <span style=\"color: #4b5563;\">(Alluring Vocals • 1 Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Target Mind Save (DC 8+PB+Looks) — <strong>Efek:</strong> Target gagal: 1d4 Composure damage (Salting/Fluster) & Disadvantage terhadapmu 1 ronde; kamu Advantage Charm saat bernyanyi.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Encore</strong> \n                  <span style=\"color: #4b5563;\">(Encore Revival • 1 Reaction (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Sehabis adegan panggung sukses: kamu dapat 1 Heart Inspiration; sekutu memulihkan 1d6 Composure & menghapus 1 status negatif emosional.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Petikan Melodi Penyelamat (Bardic Rock Riff)",
          "subtitle": "Bardic Inspiration Buff",
          "metaBadge": "Bonus Action • Jarak 30 ft",
          "description": "Memetik riff gitar akustik atau bersenandung melodi penyemangat yang membangkitkan kembali nyali rekan.",
          "details": {
            "Check": "Talent / Performance",
            "Efek": "Memberikan satu dadu 1d6 Inspiration Die kepada kawan; dapat ditambahkan ke d20 roll apapun dalam 10 menit."
          }
        },
        {
          "title": "Distorsi Pemecah Telinga (Sonic Screech)",
          "subtitle": "AoE Sound Attack",
          "metaBadge": "1 Action • Kerucut 15 ft",
          "description": "Mengarahkan mikrofon mendekat ke speaker monitor memicu lengkingan feedback frekuensi tinggi.",
          "details": {
            "Check": "Physique Save DC 8 + Prof + Mod Talent",
            "Efek": "1d8 Suara/Mental Damage ke Composure dan HP fisik; target gagal menderita status Deafened selama 1 ronde."
          }
        },
        {
          "title": "Penampilan Epik (Crowd Performance)",
          "subtitle": "Mass Emotional Move",
          "metaBadge": "1 Menit • Area Suara",
          "description": "Membawakan petikan lagu spektakuler yang menggetarkan emosi seisi ruangan.",
          "details": {
            "Check": "Talent / Performance vs Mind Save",
            "Efek": "Musuh kehilangan 1d4 Composure (terpana) atau kawan memulihkan 1d4 Composure (terinspirasi) sesuai keputusan DM."
          }
        }
      ]
    },
    {
      "id": "club-painting",
      "title": "12. Painting (Klub Seni Rupa & Desain)",
      "subtitle": "Goresan Kuas, Memori Visual Tajam & Estetika Warna",
      "leadParagraph": "Aroma khas cat minyak dan tiner di ruang atelier, kanvas putih yang menanti sentuhan magis, dan mata jeli yang mampu menangkap spektrum emosi manusia.",
      "contentHtml": "<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Talent / Intelligent • <strong>Saving Throws:</strong> Intelligent, Talent.<br>\n      <strong>Hak Istimewa:</strong> Ruang atelier seni luas, palet warna lengkap, buku sketsa tebal, dan kepekaan tinggi terhadap proporsi visual serta bahasa tubuh.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Pelukis Potret Realis</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Perekam memori visual tajam yang melukiskan rahasia ke dasar jiwa.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Visual investigator; merekonstruksi wajah tersangka dari ingatan serta menghasilkan potret mendalam yang menyentuh emosi terdalam subjek.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Mata Pelukis</strong> \n                  <span style=\"color: #4b5563;\">(Passive Visual Scout • Pasif (PBx per Long Rest) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind / Awareness — <strong>Efek:</strong> Advantage pada check Awareness mengenali wajah & detail; sketsa wajah dari ingatan memberi Advantage saat mencari target tersebut.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Potret Jiwa</strong> \n                  <span style=\"color: #4b5563;\">(Deep Portrait • 10 Menit (1x per Long Rest) • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Creative — <strong>Efek:</strong> Lukis seseorang: DM mengungkap emosi dominan dan keinginan terpendamnya; subjek yang melihatnya memulihkan 1d8 + Mod Talent Composure.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Ilustrator Manga & Desain</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Kreator visual populer pengubah jalan cerita layaknya panel manga.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Visual support & destiny manipulator; membuat ilustrasi pendorong moral dan memanipulasi hasil lemparan dadu seperti membalik adegan komik.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Sketsa Cepat</strong> \n                  <span style=\"color: #4b5563;\">(Manga Sticker Buff • 1 Bonus Action (PBx per Long Rest) • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Creative — <strong>Efek:</strong> Buat poster/stiker chibi dalam 1 menit. Sekutu yang membawanya mendapat bonus +1d4 pada satu lemparan sosial hari itu.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Panel Aksi</strong> \n                  <span style=\"color: #4b5563;\">(Destiny Manipulation • 1 Reaction (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Ubah satu lemparan dadu (milikmu atau kawan yang terlihat) dengan bonus +1d8 atau penalti -1d8 sebagai efek dramatis panel manga.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Sketsa Wajah Kilat (Photographic Sketch)",
          "subtitle": "Visual Investigation",
          "metaBadge": "1 Menit • Jarak Touch",
          "description": "Menggoreskan pensil 2B di buku sketsa dengan kecepatan tangan tinggi untuk merekonstruksi rupa seseorang.",
          "details": {
            "Check": "Talent / Creative",
            "Efek": "Menghasilkan potret visual akurat dari wajah tersangka atau bukti penting yang hanya sempat terlihat sekilas."
          }
        },
        {
          "title": "Cipratan Cat Distraksi (Paint Splatter Blind)",
          "subtitle": "Combat Control Move",
          "metaBadge": "1 Action • Jarak 10 ft",
          "description": "Menyiramkan palet cat minyak basah pekat tepat ke arah kedua mata penyerang.",
          "details": {
            "Check": "Physique / Agility",
            "Efek": "Target mengalami kondisi Blinded selama 1 giliran hingga mereka meluangkan aksi untuk menyeka cat."
          }
        },
        {
          "title": "Karya Provokasi (Satirical Artwork)",
          "subtitle": "Social Propaganda",
          "metaBadge": "1 Jam Persiapan • Seluruh Sekolah",
          "description": "Membuat poster karikatur satire yang dipasang diam-diam di majalah dinding sekolah.",
          "details": {
            "Check": "Talent / Creative vs Looks Save",
            "Efek": "Karya menjadi buah bibir; target kehilangan 1d4 Composure setiap kali murid lain menertawakan gambar tersebut selama 1 hari."
          }
        }
      ]
    },
    {
      "id": "club-photography",
      "title": "13. Photography (Klub Fotografi)",
      "subtitle": "Lensa Telefoto, Sudut Pandang Rahasia & Momen Emas Tak Terlupakan",
      "leadParagraph": "Aroma kimia ruang gelap, bunyi klik shutter mekanik di balik pepohonan taman, dan lensa telefoto yang mampu membekukan emosi murni remaja.",
      "contentHtml": "<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Intelligent / Talent • <strong>Saving Throws:</strong> Intelligent, Talent.<br>\n      <strong>Hak Istimewa:</strong> Kunci akses ruang gelap cuci foto, kamera DSLR/mirrorless pinjaman sekolah, kartu pers fotografer sekolah, dan sudut pandang tajam menangkap momen rahasia murid lain.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Fotografer Investigasi / Paparazzi</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pengintai lensa telefoto senyap pengumpul bukti tak terbantahkan.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Stealth scout & tracker; memotret target tanpa terdeteksi untuk mendapatkan kebenaran dan melacak jejak orang di lingkungan sekolah.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Bukti Foto</strong> \n                  <span style=\"color: #4b5563;\">(Photo Evidence • 1 Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Intelligent / Street — <strong>Efek:</strong> Ambil foto adegan/orang. Saat ditinjau, DM memberikan 1 petunjuk akurat; menunjukkan foto memberi Advantage pada check Influence terkait.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Mata Elang</strong> \n                  <span style=\"color: #4b5563;\">(Telephoto Vision • 1 Bonus Action (1x per Long Rest) • 60 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind / Awareness — <strong>Efek:</strong> Selama 10 menit, lensa telefoto mendeteksi semua yang bersembunyi (Hidden) dalam 60 ft, dan mengetahui posisi target yang pernah difoto di sekolah.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Fotografer Artistik / Potret</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pengabadikan estetika masa muda penenun kenangan abadi romansa.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Aesthetic enhancer & keepsake maker; mengatur pencahayaan terbaik untuk mendongkrak pesona kawan serta mencetak foto keepsake pembangkit inspirasi.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Pencahayaan Sempurna</strong> \n                  <span style=\"color: #4b5563;\">(Aesthetic Focus • 1 Bonus Action (PBx per Long Rest) • 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Looks / Charm — <strong>Efek:</strong> Subjek yang difoto menerima bonus +2 pada seluruh check Looks hingga akhir adegan.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Momen Abadi</strong> \n                  <span style=\"color: #4b5563;\">(Keepsake Creation • 1x per Long Rest • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Talent / Creative — <strong>Efek:</strong> Cetak foto momen penting menjadi keepsake. Pemegangnya mendapat 1 Heart Inspiration dan Advantage melawan efek Salting/Fluster momen itu.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Jepretan Kilat Flash (Flash Stun)",
          "subtitle": "Combat Control Move",
          "metaBadge": "1 Action • Jarak 15 ft",
          "description": "Menodongkan lampu kilat kamera tepat ke wajah lawan lalu menekan tombol shutter seketika.",
          "details": {
            "Check": "Intelligent / Academic vs Target Mind Save",
            "Efek": "Target mengalami 1d4 Composure damage dan terkena status Disadvantage pada aksi berikutnya karena silau."
          }
        },
        {
          "title": "Bukti Foto Kompromatis (Compromising Photo)",
          "subtitle": "Social Leverage",
          "metaBadge": "1 Action • Jarak 30 ft",
          "description": "Memamerkan hasil jepretan candid di layar kamera yang membuat lawan gelagapan dan salah tingkah.",
          "details": {
            "Check": "Intelligent / Street vs Target Mind Save",
            "Efek": "Target kehilangan 1d8 Composure dan ragu melanjutkan perdebatan karena rahasianya terancam terekspos."
          }
        },
        {
          "title": "Membekukan Momen (Candid Shutter)",
          "subtitle": "Romance & Tactical Shutter",
          "metaBadge": "1 Bonus Action • Jarak 30 ft",
          "description": "Membidik lensa telefoto secara tenang di waktu yang tepat saat target sedang melamun atau tidak waspada.",
          "details": {
            "Check": "Talent / Creative",
            "Efek": "Menangkap ekspresi jujur atau kelemahan target dari jauh; sekutu mendapat Advantage pada check sosial atau romansa berikutnya."
          }
        }
      ]
    },
    {
      "id": "club-cooking",
      "title": "14. Cooking (Klub Memasak & Kuliner)",
      "subtitle": "Aroma Bento Hangat, Manisnya Cokelat Cinta & Rasa yang Memikat Hati",
      "leadParagraph": "Uap wangi mengepul dari panci saus, denting spatula beradu wajan teflon, dan aroma kue cokelat baru matang yang membuat seisi lorong menelan ludah.",
      "contentHtml": "<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Intelligent / Looks • <strong>Saving Throws:</strong> Intelligent, Looks.<br>\n      <strong>Hak Istimewa:</strong> Kunci akses ruang dapur sekolah (Home Ec) berfasilitas lengkap, celemek khusus, pisau dapur tajam, bumbu rempah rahasia, serta kemampuan membuat hidangan penakluk hati.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Pâtissier / Pembuat Manisan & Cokelat</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pencipta manisan manis pelipur lara dan pelunak sikap keras hati.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Social confectioner; menyajikan pastry yang memberi Temporary Composure dan cokelat cinta yang meningkatkan relasi NPC secara instan.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Manisan Penyemangat</strong> \n                  <span style=\"color: #4b5563;\">(Confectionery Morale • 10 Menit (PBx per Long Rest) • Touch (s.d. 4 orang))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Hidangkan kue manisan untuk s.d. 4 orang. Mereka menerima Temp Composure sebesar 1d6 + Mod Talent.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Cokelat Pembuka Hati</strong> \n                  <span style=\"color: #4b5563;\">(Heart Chocolate • 1x per Long Rest • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Looks / Charm — <strong>Efek:</strong> Penerima manisan memulihkan 1d10 + Mod Talent Composure. Jika diberikan ke NPC, sikap keramahannya naik satu tingkat lebih bersahabat (DM).</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Koki Masakan Hangat / Bento Master</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penyaji bekal bento penuh energi dan santapan keluarga pemulih raga.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Nutrition buffer & sustenance master; menyiapkan bekal bergizi penambah keberuntungan dan jamuan makan bersama penangkal lelah.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Bento Bekal</strong> \n                  <span style=\"color: #4b5563;\">(Nutritious Lunchbox • Saat Short Rest (PBx per Long Rest) • Touch)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Siapkan bento: penerima mendapat +1d4 pada 1 check hari itu dan memulihkan 1d6 Physical HP.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Masakan Rumah</strong> \n                  <span style=\"color: #4b5563;\">(Family Feast • 1x per Long Rest (Sebelum Istirahat) • Touch (Kelompok))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Semua yang makan bersama mendapat Temp HP & Temp Composure sebesar PB, Advantage melawan Fatigue, dan 1 Rest Dice ekstra.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Bento Kasih Sayang (Handmade Bento)",
          "subtitle": "Heartwarming Culinary",
          "metaBadge": "Dibuat saat Istirahat • Jarak Touch",
          "description": "Menyusun nasi kepal, tamagoyaki manis, dan sosis gurita lucu dengan sepenuh perasaan hati.",
          "details": {
            "Check": "Intelligent / Academic atau Looks / Charm",
            "Efek": "Target yang memakan bento memulihkan 1d8 HP fisik / Composure dan Heart Meter bertambah +1 ♥ jika diberikan kepada target gebetan."
          }
        },
        {
          "title": "Aroma Penggugah Selera (Irresistible Aroma)",
          "subtitle": "Social Distraction",
          "metaBadge": "1 Action • Jarak 30 ft",
          "description": "Membuka tutup wadah makanan hangat yang aromanya langsung menguasai seluruh lorong kelas.",
          "details": {
            "Check": "Looks / Charm vs Target Mind Save",
            "Efek": "Mengalihkan perhatian semua target lapar di sekitar; target terdistraksi dan tidak bisa mengambil aksi agresif selama 1 giliran."
          }
        },
        {
          "title": "Camilan Penambah Tenaga (Snack Energy Boost)",
          "subtitle": "Field Morale Boost",
          "metaBadge": "1 Bonus Action • Jarak Touch",
          "description": "Menyelipkan sepotong kue kering manis buatan sendiri saat teman sedang kehabisan energi atau putus asa.",
          "details": {
            "Check": "Otomatis",
            "Efek": "Menyuapkan kue kering darurat ke sekutu; sekutu memulihkan 1d4 Composure dan mendapat Advantage pada Saving Throw berikutnya."
          }
        }
      ]
    },
    {
      "id": "club-occult",
      "title": "15. Occult (Klub Okultisme & Misteri Gaib)",
      "subtitle": "Kartu Tarot Takdir, Lilin Hitam Aromaterapi & Misteri Tujuh Keajaiban Sekolah",
      "leadParagraph": "Tirai beludru ungu tertutup rapat menghalangi sinar matahari, aroma dupa cendana membubung pelan, dan bisikan mantra kuno berbaur dengan kartu takdir yang terbuka.",
      "contentHtml": "<p><strong>Hit Die:</strong> d6 • <strong>Atribut Primer:</strong> Mind / Luck • <strong>Saving Throws:</strong> Mind, Luck.<br>\n      <strong>Hak Istimewa:</strong> Ruang klub temaram di lantai 1 dengan aroma dupa mistis, set kartu tarot kuno, bola kristal, papan ouija, dan kepekaan luar biasa membaca firasat takdir serta legenda urban sekolah.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Peramal Nasib / Tarot Diviner</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pembaca kartu takdir roda nasib pengutak-atik garis probabilitas semesta.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Fate manipulator; membuka kartu tarot untuk mengintervensi hasil d20 dan memprediksi marabahaya masa depan.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Takdir Terbuka</strong> \n                  <span style=\"color: #4b5563;\">(Fate Intervention • 1 Reaction (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Otomatis — <strong>Efek:</strong> Ubah 1 lemparan dadu d20 yang terlihat (milikmu, sekutu, atau musuh) dengan bonus +1d4 atau penalti -1d4.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Ramalan Besar</strong> \n                  <span style=\"color: #4b5563;\">(Grand Divination • 10 Menit (1x per Long Rest, DM) • 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind / Awareness (DC 12) — <strong>Efek:</strong> DM mengungkap 1 ancaman atau kejadian penting yang akan terjadi hari itu; sekutu dalam 15 ft mendapat Advantage pada roll terkait.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Peneliti Tujuh Misteri Sekolah</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penyelidik legenda urban sekolah dan pelindung dari teror tak kasat mata.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Mystery detective & warder; mendeteksi jejak anomali supernatural serta memasang segel spiritual yang membentengi kawan dari rasa takut.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Catatan Misteri</strong> \n                  <span style=\"color: #4b5563;\">(Supernatural Sense • Pasif + PBx per Long Rest • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Mind / Awareness — <strong>Efek:</strong> Advantage pada check Awareness & Academic untuk anomali supernatural; bertanya ke DM apakah ada entitas/tanda gaib di ruangan itu.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Segel Pelindung</strong> \n                  <span style=\"color: #4b5563;\">(Purifying Ward • 1 Action (1x per Long Rest) • Area 15 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Luck / Situation Luck — <strong>Efek:</strong> Taburkan garis garam/jimat: sekutu dalam 15 ft Advantage pada save mental supernatural dan kebal rasa takut gaib selama 1 jam.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Ramalan Kartu Tarot (Tarot Reading)",
          "subtitle": "Fate Divination",
          "metaBadge": "1 Action • Jarak 15 ft",
          "description": "Membuka kartu tarot bergambar Wheel of Fortune atau Lovers dengan tatapan mata misterius.",
          "details": {
            "Check": "Mind / Awareness vs DC 12",
            "Efek": "Hasil sukses memberikan 1d6 Fated Die yang dapat ditambahkan ke d20 roll apapun milik sekutu dalam sesi ini."
          }
        },
        {
          "title": "Aura Kutukan Menyeramkan (Eerie Curse)",
          "subtitle": "Psychological Terror",
          "metaBadge": "1 Action • Jarak 30 ft",
          "description": "Mengarahkan jimat atau lilin menyala ke arah target sambil melafalkan bisikan misterius yang membuat bulu kuduk merinding.",
          "details": {
            "Check": "Mind / Emotional vs Target Mind Save",
            "Efek": "Target kehilangan 1d8 Composure dan merasa dihantui nasib buruk (Disadvantage pada 1 roll berikutnya)."
          }
        },
        {
          "title": "Kertas Jimat Pengusir Kesialan (Purifying Ward)",
          "subtitle": "Warding Talisman",
          "metaBadge": "1 Reaction • Self / 15 ft",
          "description": "Mengibaskan kertas ofuda bertuliskan aksara kanji kuno tepat saat malapetaka hendak terjadi.",
          "details": {
            "Check": "Luck / Situation Luck",
            "Efek": "Membatalkan kegagalan kritis atau menyerap 1d6 damage mental/sosial yang menyerang kawan."
          }
        }
      ]
    },
    {
      "id": "club-gaming",
      "title": "16. Gaming (Klub Video Game & Esports)",
      "subtitle": "Refleks Tombol Kilat, Analisis Frame Data & Strategi Kemenangan Tanpa Cela",
      "leadParagraph": "Kilauan monitor gaming 240Hz di ruang klub, bunyi klik switch mekanik mikro berirama cepat, dan aroma minuman kaleng dingin peneman begadang adu taktik.",
      "contentHtml": "<p><strong>Hit Die:</strong> d8 • <strong>Atribut Primer:</strong> Intelligent / Talent • <strong>Saving Throws:</strong> Intelligent, Talent.<br>\n      <strong>Hak Istimewa:</strong> Ruang klub penuh konsol retro dan monitor gaming refresh-rate tinggi, game portabel di saku, kelenturan refleks jari, dan ketajaman menganalisis pola perilaku lawan.</p>\n      <div class=\"phb-subclass-section\" style=\"margin-top: 14px; border-top: 1px dashed #d7c9b1; padding-top: 10px;\">\n        <h4 style=\"color: #c53135; font-family: 'Cinzel', serif; margin-bottom: 8px;\">Dua Cabang Subclass Spesialisasi (Peminatan Kelas 11)</h4>\n        <p style=\"font-size: 0.9rem; margin-bottom: 12px;\">Saat naik ke Kelas 11 (Level 3), karakter memilih 1 dari 2 peminatan ekskul berikut untuk membuka jurus Tier 1 (G11) dan kelak Tier 2 (G12 di Level 5):</p>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 14px;\">\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Master Game Pertarungan / FGC Pro</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Penguasa kecepatan frame-data dan serangan pembalik keadaan turnamen.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Counter-attacker & burst finisher; menepis serangan dengan timing presisi lalu membalas seketika, serta melepaskan jurus pamungkas saat bar meter penuh.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Frame-Perfect</strong> \n                  <span style=\"color: #4b5563;\">(Parry Counter • 1 Reaction (PBx per Long Rest) • Self)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique / Agility — <strong>Efek:</strong> +3 Physical AC terhadap 1 serangan. Jika meleset, serang balik dengan serangan tangan kosong/senjata (1d6 + Mod Physique).</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Super Meter</strong> \n                  <span style=\"color: #4b5563;\">(Super Combo Finisher • 1 Bonus Action (1x per Long Rest) • Melee (5 ft))</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Physique / Agility Attack — <strong>Efek:</strong> Setelah memberi/menerima total 3 hit dalam satu combat, lepaskan jurus super: 4d6 + Mod Talent damage dan target Dazed.</div>\n                </div>\n            </div>\n          </div>\n          <div class=\"phb-stat-card\" style=\"background: #fdfaf3; border-left: 4px solid #c53135;\">\n            <div class=\"phb-stat-header\">\n              <strong style=\"color: #782213; font-size: 1.05rem;\">Ahli Strategi & RPG / Theorycrafter</strong>\n              <span class=\"phb-stat-badge\">Subclass G11–G12</span>\n            </div>\n            <div style=\"font-style: italic; font-size: 0.85rem; color: #713f12; margin-bottom: 6px;\">\"Pembedah kelemahan statistik dan perusak meta pertahanan lawan.\"</div>\n            <p style=\"font-size: 0.9rem; margin-bottom: 8px;\">Tactical debuffer & tactician; membongkar data armor dan kelemahan musuh agar rekan tim dapat melancarkan serangan berdaya rusak maksimal.</p>\n            <div style=\"border-top: 1px dotted #e2d9c8; padding-top: 8px;\">\n              \n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G11 - Kelas 11] Analisis Min-Max</strong> \n                  <span style=\"color: #4b5563;\">(Tactical Assessment • 1 Bonus Action (PBx per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Intelligent / Academic — <strong>Efek:</strong> Analisis 1 lawan: DM menyebutkan AC, kelemahan, dan resistensinya; kawan mendapat +1d4 damage ke target tersebut hingga akhir adegan.</div>\n                </div>\n                <div style=\"margin-bottom: 6px; font-size: 0.85rem;\">\n                  <strong style=\"color: #991b1b;\">[G12 - Kelas 12] Meta Breaker</strong> \n                  <span style=\"color: #4b5563;\">(Meta Disruption • 1 Action (1x per Long Rest) • 30 ft)</span>\n                  <div style=\"margin-left: 8px; color: #1f2937;\"><em>Check:</em> Intelligent / Academic — <strong>Efek:</strong> Terhadap target yang telah dianalisis: semua serangan kawan mendapat +2 to hit dan target Disadvantage pada saving throw pertamanya selama 1 menit.</div>\n                </div>\n            </div>\n          </div>\n        </div>\n      </div>",
      "statBlocks": [
        {
          "title": "Tangkisan Frame Sempurna (Frame Perfect Parry)",
          "subtitle": "Just-Frame Reaction",
          "metaBadge": "1 Reaction • Diri Sendiri",
          "description": "Mengelak atau menepis serangan pada sepersekian detik terakhir layaknya mengeksekusi just-frame parry di turnamen.",
          "details": {
            "Check": "Physique / Agility vs Attack",
            "Efek": "Menghitung timing serangan lawan dengan presisi; mengurangi damage serangan fisik/sosial sebesar 1d8 + Mod Agility."
          }
        },
        {
          "title": "Provokasi Tombol Taunt (Taunt to Tilt)",
          "subtitle": "Psychological Provocation",
          "metaBadge": "1 Bonus Action • Jarak 30 ft",
          "description": "Melakukan gerakan jempol ke bawah atau t-bag virtual yang langsung memancing emosi ('tilt') lawan.",
          "details": {
            "Check": "Talent / Performance vs Target Mind Save",
            "Efek": "Target mengalami 1d6 Composure damage dan terprovokasi (harus mengarahkan serangan ke dirimu di giliran berikutnya)."
          }
        },
        {
          "title": "Rute Cepat Speedrun (Speedrun Routing)",
          "subtitle": "Optimization Routing",
          "metaBadge": "1 Action • Diri / Sekutu",
          "description": "Membedah denah dan aturan sekolah seperti mencari sequence break dan glitch jalur tercepat.",
          "details": {
            "Check": "Intelligent / Academic",
            "Efek": "Menemukan celah tercepat melewati rintangan / teka-teki sekolah dalam separuh waktu normal tanpa memicu jebakan."
          }
        }
      ]
    }
  ]
};
