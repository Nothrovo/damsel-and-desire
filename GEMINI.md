# ATURAN PEMBUATAN KARAKTER, KONSISTENSI DATABASE & DEMOGRAFI KELAS

## 1. PANTANGAN KARAKTER FIKTIF SEKALI PAKAI (ANTI-DISPOSABLE CHARACTERS)
- DILARANG mengarang karakter fiktif/placeholder sementara di dalam event/campaign lalu melupakannya.
- Hanya gunakan karakter yang terdaftar secara resmi di direktori `Characters/Love Interests/` dan Kamus Karakter (`src/data/loveInterestCompendium.ts`).

## 2. PROTOKOL PENAMBAHAN KARAKTER BARU (MANDATORY REGISTRATION)
Diperbolehkan membuat karakter baru jika dibutuhkan oleh narasi, DENGAN SYARAT karakter tersebut WAJIB langsung didaftarkan ke 3 tempat:
1. **File Profil Markdown**: Dibuatkan file markdown profil lengkap di `Characters/Love Interests/<Kategori Kelas>/<Nama>/`.
2. **Kamus Karakter (Compendium)**: Didaftarkan ke `src/data/loveInterestCompendium.ts`.
3. **Database / Codex**: Disinkronkan ke `src/data/canonSession1Npcs.ts` dan seed database jika relevan.
Karakter yang telah didaftarkan ini menjadi CANON PERMANEN yang dapat digunakan kembali di sesi mendatang.

## 3. STRUKTUR & DEMOGRAFI KELAS
- **Kapasitas Kelas:** Setiap ruang kelas di Housen Academy memiliki kuota tepat **15 murid**.
- **Asal Kelas Eksplisit:** Setiap murid baru WAJIB ditentukan asal ruang kelasnya secara spesifik (misal: Kelas 10-1, Kelas 10-2, Kelas 11-1, dst).
- **Rasio Gender:** Rasio murid perempuan terhadap laki-laki adalah **3 : 1** (sekitar ~11-12 siswi perempuan : ~3-4 siswa laki-laki per kelas).
