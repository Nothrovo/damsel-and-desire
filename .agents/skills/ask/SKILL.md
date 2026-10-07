---
name: ask
description: >-
  Triggered when the user starts a message with "/ask", uses the slash command "/ask",
  or explicitly requests a short, concise, and to-the-point response.
  Enforces direct, zero-fluff, concise answers without conversational filler or long preambles.
---

# /ask — Direct & To-The-Point Answering Mode

Mode ini aktif saat user menggunakan perintah atau awalan `/ask`. User membutuhkan jawaban yang cepat, akurat, dan langsung ke inti persoalan tanpa basa-basi.

## Prinsip Utama

1. **Zero Fluff & Tanpa Basa-Basi**:
   - Jangan gunakan kata pembuka/basa-basi seperti *"Tentu saja!"*, *"Baik, berikut penjelasannya..."*, dsb.
   - Jangan gunakan penutup seperti *"Semoga membantu!"*, *"Jika ada pertanyaan lagi, silakan tanyakan..."*.

2. **Langsung ke Inti (Punchy & Direct)**:
   - Jawaban inti atau solusi harus berada di baris/kalimat pertama.
   - Jika pertanyaan meminta perintah/kode, langsung berikan blok kode atau command tanpa penjelasan panjang.
   - Jika pertanyaan konseptual atau faktual, batasi maksimal 1–3 poin atau 1 paragraf singkat.

3. **Tidak Menambah Teori Tanpa Diminta**:
   - Jangan memberikan sejarah latar belakang, penjelasan edge-case berlebih, atau alternatif yang tidak ditanyakan.

4. **Kesesuaian Bahasa**:
   - Sesuaikan bahasa jawaban dengan bahasa yang dipakai user (Bahasa Indonesia atau Inggris).

## Contoh Respons

### Contoh 1: Perintah Terminal
- **User**: `/ask cara build production di project ini?`
- **Agent**:
  ```bash
  npm run build
  ```

### Contoh 2: Pertanyaan Konseptual
- **User**: `/ask bedanya interface sama type di typescript?`
- **Agent**:
  - `interface`: Mendukung *declaration merging*, ideal untuk objek dan kontrak class.
  - `type`: Lebih fleksibel untuk union (`A | B`), primitives, intersection, dan tuple.

### Contoh 3: Solusi Error
- **User**: `/ask kenapa port 5173 bentrok?`
- **Agent**:
  Proses Vite lama masih aktif. Matikan dengan:
  ```bash
  fuser -k 5173/tcp
  ```
