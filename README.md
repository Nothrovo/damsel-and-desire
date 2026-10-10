# Damsel & Desire — Public TRPG Vault, Codex & Handbook

> **Damsel & Desire: Japanese High School Romance TRPG (D&D 5e Alternative Chassis)**  
> Platform web *Character Vault, Builder Wizard, Character Codex, 12-Month School Calendar & Interactive Player's Handbook* bergaya D&D Beyond. Dibangun menggunakan arsitektur **Vite + Vanilla TypeScript (Modular)**, terintegrasi secara dinamis dengan **Supabase Cloud Database & Realtime**, dengan fokus pada pengalaman lokal/publik tanpa batasan *login* (No Auth), serta ekspor modul luring (*offline*).

---

## 🌟 Fitur Utama (Major Features)

### 1. 💖 Affection Tracker & Dynamic Love Interest System (DM Only)
Fitur pelacak romansa dan gebetan di dalam Character Sheet pada tab **🔒 AFFECTION (DM ONLY)**:
- **Terintegrasi Dinamis ke Supabase DB**: Seluruh data heroine dan target romansa dimuat secara dinamis dari database Supabase (`codex_characters`, `codex_character_sections`), sehingga ketika Game Master menambahkan heroine baru di database/Codex, karakter tersebut langsung muncul di lembar karakter secara otomatis tanpa perlu koding ulang.
- **21+ Canon Heroines & Love Interests**: Katalog lengkap tokoh SMA Housen Academy (mulai dari Miruam Solari, Asahina Tenka, Tachibana Rin, Kisaragi Setsuna, Shinohara Kotone, hingga para guru dan staf sekolah).
- **Interactive Tap-to-Inspect**: Kotak target di lembar karakter dapat di-tap/klik untuk memunculkan modal detail komprehensif:
  - **Profil Lengkap**: Foto/avatar resolusi tinggi, julukan, kelas, ekskul, arketipe dere, MBTI, zodiak, dan status sosial.
  - **Meteran Hati Interaktif (1–10 ♥)**: Klik dot hati langsung di modal atau di kartu untuk mengubah nilai afeksi.
  - **Active Milestone Highlight**: Sorotan otomatis tahap hubungan aktif (misal: *1–2 ♥ Angkuh Berjarak / Ujian Tatapan*, *3–4 ♥ Respek Intelektual*, *5–6 ♥ Tsundere Elegan*, dst.) beserta daftar lengkap seluruh milestone untuk memandu roleplay DM.
  - **Panduan Hadiah (Gift System)**: Hadiah favorit (+afeksi besar), hadiah biasa (+afeksi standar), dan hadiah terlarang (-afeksi / *composure damage*).
  - **Rekomendasi Lokasi Kencan (Date Spots)**: Lokasi kencan favorit dengan suasana romantis khas Housen Academy.
  - **Kepribadian & Kelemahan Batin**: Sifat dominan, luka emosional (*flaws/trauma*), dan bahasa cinta (*dere pattern*).
  - **Editor Catatan Rahasia DM & Event Flag**: Form untuk mencatat momen berkesan, event flag, serta mengubah status hubungan secara *real-time*.
  - **Pintasan Codex**: Tombol cepat untuk membuka profil karakter lengkap di Kamus Karakter (`/codex/c/:slug`).
- **Modal Tambah Target**: Antarmuka visual dengan pencarian instan dan filter per angkatan (Kelas 10, 11, 12, Guru/Staf), serta tab pembuatan NPC custom non-katalog.

### 2. 🌸 Kamus Karakter & Direktori Sekolah (`/codex`)
Arsip ensiklopedia karakter sekolah Housen Academy:
- **Progressive Reveal System**: Informasi karakter terkunci secara default dan disingkapkan secara bertahap (*Tier 1: Identitas & Foto*, *Tier 2: Kepribadian & Latar*, *Tier 3: Pikiran & Rahasia*) oleh Game Master untuk mencegah *metagaming* pemain.
- **DM Codex Control Bar**: Toolbar khusus Game Master untuk membuka rahasia karakter per section atau per tier secara instan, serta batch introduce.
- **Supabase Realtime Sync**: Pemain dapat melihat penyingkapan rahasia karakter secara langsung (*zero-refresh*) dengan animasi bunga sakura mekar.
- **Editor Karakter Codex**: Formulir lengkap bagi DM untuk mendaftarkan atau mengedit karakter baru beserta foto dan statistik D&D 5e langsung ke Supabase.

### 3. 📅 Kalender Sekolah Interaktif 12 Bulan (`/calendar`)
Pelacak kronologi tahun ajaran sekolah Jepang dari April hingga Maret:
- **Kalender Musiman**: Terbagi dalam Musim Semi, Musim Panas, Musim Gugur, dan Musim Dingin, mencakup semester 1, liburan musim panas, festival budaya (*Bunkasai*), ujian semester, hingga upacara kelulusan (*Sotsugyōshiki*).
- **Event & Encounter Log**: Integrasi peristiwa sekolah dengan penampakan karakter canon dan pemicu percabangan romansa (*Curiosity, Vulnerability, Devotion*).
- **Progresi Sesi DM**: DM dapat menandai event yang sudah terlaksana dan tersinkronisasi ke database.

### 4. 📖 Modular Player's Handbook (PHB)
Buku panduan permainan digital interaktif bergaya otentik D&D 5e di rute `/handbook`:
- **12 Bab Modul Lengkap (Chapters 0 - 11)**: Mulai dari pembuatan karakter, atribut, 8 arketipe, 16 klub ekskul, sistem finansial/uang saku, inventaris, dual vitals (HP Fisik & Composure), sistem encounter, ritme kehidupan sekolah, mekanik rahasia romansa, hingga lampiran DM.
- **Desain Otentik**: Tekstur perkamen (*parchment*), layout 2-kolom, kaligrafi, stat blocks, dan navigasi daftar isi cerdas.

### 5. 🖨️ Offline HTML & Ekspor PDF Berkualitas Tinggi
- **Offline HTML Generator**: Skrip SSR otomatis membundel seluruh Handbook menjadi satu fail mandiri `PLAYERS_HANDBOOK.html` saat `npm run build` dijalankan.
- **A4 Print-to-PDF**: CSS `@media print` khusus yang mengubah lembar karakter dan handbook menjadi ukuran A4 siap cetak dengan margin sempurna.

### 6. 🎒 Interactive Item Compendium, Moves & Feats
- **16 Klub Ekskul & Subclass Moves**: 48+ jurus ekskul unik mulai dari Kendo, Bela Diri, OSIS, Seni Rupa, Musik, hingga Kuliner dan Gaming.
- **Katalog 100+ Barang**: Deskripsi mendalam dan mekanik TRPG interaktif untuk setiap item di inventaris.
- **Sistem Feat & Achievement**: Feat Asal-Usul (*Origin Feats*), Feat Tingkat Kelas (*Grade Feats*), serta pencapaian naratif (*Achievements*) dengan pelacak penggunaan.

### 7. 🗺️ Interactive School Map (Peta Denah Sekolah 2D & 3D)
Peta interaktif kampus Housen Academy di rute `/map`:
- **5 Tingkat Denah**: Campus, 1F, 2F, 3F, dan Rooftop dengan 67 ruangan terdaftar.
- **Navigasi Cepat**: Pan, zoom, Level-of-Detail (LOD), pencarian autocomplete cepat (`/`), serta mode visual 3D bertenaga Three.js.

### 8. 🛡️ Public-Facing Character Vault & Builder
- **Tanpa Login/Register**: Langsung masuk dan buat karakter. Sempurna untuk bermain bersama teman satu meja (*couch co-op/local session*).
- **Builder Wizard (6 Steps)**: Pembuatan karakter terpandu (Standard Array atau Point Buy, Pemilihan Klub, Arketipe, Feat Awal, dll.).
- **Lembar Karakter Digital**: Tampilan lembar karakter otentik dengan manajemen Vitals (HP, Composure), Finansial (Yen/Rupiah), Actions & Moves, serta Roller Dadu terintegrasi.

---

## 🏗️ Struktur Proyek (Directory Layout)

```
damsel-and-desire/
├── Characters/                  # Berkas Markdown profil Canon Love Interests & NPCs
├── css/
│   └── styles.css               # Styling tema Housen Academy (Anime Dark Romance + Parchment)
├── public/
│   └── portraits/               # Foto potret ID resolusi tinggi untuk Love Interests
├── scripts/
│   ├── buildLoveInterests.js    # Ekstraktor markdown love interest ke compendium
│   ├── buildStandaloneHandbook.js # Node SSR Script untuk generate PLAYERS_HANDBOOK.html
│   ├── importCodex.js           # Pengunggah arsip markdown karakter ke Supabase
│   └── validateCodex.js         # Validator format markdown karakter
├── src/
│   ├── api/                     # Modul integrasi Supabase (characters, codex, loveInterests, compendium)
│   ├── components/              # Komponen UI (AddLoveInterestModal, LoveInterestDetailModal, dll)
│   ├── data/                    # Data compendium (items, feats, achievements, loveInterests, calendar)
│   ├── router/                  # Client-side router (/, /handbook, /codex, /calendar, /map, /characters/:id)
│   ├── rules/                   # Rule engine & progresi D&D 5e
│   ├── store/                   # State management (characterStore, dmAuthStore, authStore)
│   ├── types/                   # TypeScript interfaces & types
│   ├── views/                   # View utama halaman (CharacterSheetView, CodexCatalogView, CalendarView, dll)
│   └── main.ts                  # Entrypoint Vite
├── supabase/
│   ├── migrations/              # Berkas migrasi database Supabase PostgreSQL
│   └── all_migrations_combined.sql # Gabungan seluruh skrip DDL & RPC
├── tests/                       # Unit testing Vitest (15 test suites, 160+ tests)
└── package.json                 # Konfigurasi dependensi & npm scripts
```

---

## 🚀 Panduan Instalasi & Pengembangan

### Prasyarat
- Node.js v18+
- npm v9+

### 1. Menjalankan Server Pengembangan Lokal
```bash
# Instalasi dependensi
npm install

# Jalankan dev server (Vite) dengan HMR
npm run dev
```
Aplikasi bisa diakses di `http://localhost:5173`.

### 2. Membangun Aplikasi Produksi & Offline Handbook
```bash
# Lakukan type-checking dan build aplikasi
npm run build
```
Hasil akhirnya:
1. File Web App di folder `/dist/`.
2. Berkas **`PLAYERS_HANDBOOK.html`** di dalam folder `/dist/` yang siap digunakan 100% offline tanpa server.

### 3. Menjalankan Unit Tests
```bash
# Jalankan seluruh unit tests dengan Vitest
npm test
```

### 4. Sinkronisasi Data Love Interest & Codex
```bash
# Validasi format markdown karakter
npm run codex:validate

# Membangun compendium love interests dari markdown
node scripts/buildLoveInterests.js
```

---

## 📄 Lisensi
Hak Cipta © 2026 Damsel & Desire Team. Dilisensikan untuk penggunaan komunitas TRPG.
