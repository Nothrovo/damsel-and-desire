# Damsel & Desire — Public TRPG Vault & Handbook

> **Damsel & Desire: Japanese High School Romance TRPG (D&D 5e Alternative Chassis)**  
> Platform web *Character Vault, Builder Wizard, & Interactive Player's Handbook* bergaya D&D Beyond. Dibangun menggunakan arsitektur **Vite + Vanilla TypeScript (Modular)**, dengan fokus pada pengalaman lokal/publik tanpa batasan *login* (No Auth), serta ekspor modul luring (*offline*).

---

## 🌟 Fitur Utama (Major Features)

### 1. 📖 Modular Player's Handbook (PHB)
Buku panduan permainan digital interaktif bergaya otentik D&D 5e yang bisa diakses pada rute `/handbook`. 
- **Modular Data System**: Konten dibagi dalam 12 modul bab (Chapters 0 - 11) di `src/data/handbook/` untuk kemudahan ekspansi (Klub, Archetype, Romance, Vitals, dll.).
- **Authentic Styling**: Desain halaman bertekstur perkamen (*parchment*), layout 2-kolom, *drop caps*, kaligrafi, stat blocks, dan *callouts* yang responsif.
- **Table of Contents (TOC) & Search**: Sidebar interaktif untuk navigasi dan pencarian pintar.

### 2. 🖨️ Offline HTML & Ekspor PDF Berkualitas Tinggi
Tidak memiliki koneksi internet saat sesi main?
- **Offline HTML Generator**: Skrip `buildStandaloneHandbook.js` menggunakan Vite SSR akan otomatis menyatukan (*bundle*) seluruh Handbook menjadi satu fail `PLAYERS_HANDBOOK.html` mandiri ketika Anda menjalankan `npm run build`.
- **A4 Print-to-PDF**: Dilengkapi aturan `@media print` CSS khusus yang membuang UI web dan mengubah struktur menjadi ukuran kertas A4 siap cetak dengan margin yang sempurna. 

### 3. 🎒 Interactive Item Compendium & 16 Ekskul Classes
Kompilasi ensiklopedia TRPG interaktif:
- **16 Klub Ekskul (Classes) & 48 Club Moves**: Pilihan lengkap ekstrakurikuler mulai dari OSIS, Kendo, Beladiri, Musik, Painting, hingga Fotografi, Cooking, Okultisme, dan Gaming.
- **Mekanik Unik 100+ Barang**: Lebih dari 100 barang (mulai dari Pocky, Smartphone, hingga Katana Kayu) memiliki deskripsi dan mekanik gameplay khusus.
- **Sistem Interaktif**: Pemain dapat mengetuk (tap) barang di lembar karakter mereka untuk memunculkan penjelasan *tooltips* atau modal yang menjelaskan efek mekaniknya berdasarkan tingkat kelangkaan dan kesulitan.
- **Custom Item Builder**: Fitur tambah barang kustom ke dalam tas karakter (*inventory*).

### 4. 🗺️ Interactive School Map (Peta Denah Sekolah 2D & 3D)
Peta interaktif gedung dan kampus Housen Academy di rute `/map`:
- **5 Tingkat Denah**: Campus, 1F, 2F, 3F, dan Rooftop dengan 67 ruangan lengkap.
- **Navigasi Cepat**: Pan, zoom, Level-of-Detail (LOD), pencarian autocomplete cepat (`/`), dan drawer detail ruangan yang terintegrasi dengan Compendium.

### 5. 🛡️ Public-Facing Character Vault & Builder
Sistem telah beralih dari aplikasi berbayar/restriktif menjadi *Shared Vault* untuk komunitas.
- **Tanpa Login/Register**: Langsung masuk dan buat karakter. Sempurna untuk bermain bersama teman satu meja (*couch co-op/local session*).
- **Builder Wizard (6 Steps)**: Pembuatan karakter terpandu (Standard Array atau Point Buy, Pemilihan 16 Klub Ekskul, 8 Archetype, dll.).
- **VibeCoded D&D Beyond Sheet**: Tampilan lembar karakter otentik dengan manajemen Vitals (HP, Composure), Finansial (Yen/Rupiah), Actions & Moves, serta Manajemen Dadu.

---

## 🏗️ Struktur Proyek (Directory Layout)

```
damsel-and-desire/
├── css/
│   └── styles.css               # D&D 5e Styling (Parchment, PHB Print, UI)
├── scripts/
│   └── buildStandaloneHandbook.js # Node SSR Script untuk generate PLAYERS_HANDBOOK.html
├── src/
│   ├── components/              # Komponen reaktif mandiri (Navbar, Modal, dll)
│   ├── data/
│   │   ├── compendium/          # 90+ Items, Clubs, Moves data
│   │   └── handbook/            # 12 Chapter Modul Panduan (0-11)
│   ├── router/
│   │   └── router.ts            # Client-side router (/, /handbook, /characters/:id)
│   ├── store/
│   │   └── characterStore.ts    # Reaktif state pengelolaan vault & sheet
│   ├── types/
│   │   └── index.ts             # TS Interfaces untuk mekanik & handbook
│   ├── views/
│   │   ├── HandbookView.ts      # Reader & UI Panduan Interaktif
│   │   ├── CharacterSheetView.ts# D&D Beyond style character sheet
│   │   └── ...                  # Builder, Compendium, Landing
│   └── main.ts                  # Entrypoint Vite
├── tests/
│   └── handbook.test.ts         # Unit testing untuk modular TS handbook (Vitest)
└── package.json                 # Build scripts
```

---

## 🚀 Panduan Instalasi & Pengembangan

### Prasyarat
- Node.js v18+

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
Selain melakukan kompilasi Vite (di folder `/dist`), perintah ini secara otomatis akan mengeksekusi `node scripts/buildStandaloneHandbook.js`.
Hasil akhirnya:
1. File PWA/Web App di folder `/dist/`.
2. Berkas **`PLAYERS_HANDBOOK.html`** di dalam folder `/dist/` yang siap digunakan 100% offline tanpa server.

### 3. Menjalankan Unit Tests
```bash
# Jalankan unit tests dengan Vitest
npm test
```
Menguji integritas data mekanik, modul chapter, kompilasi HTML statis, dan interaktivitas item.

---

*Damsel & Desire — Vault & Handbook Release v3.0.*
