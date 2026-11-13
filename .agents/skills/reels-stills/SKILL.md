---
name: reels-stills
description: Render beberapa still per scene sebuah Reels lalu gabungkan jadi satu contact sheet untuk memeriksa tata letak, caption, dan cue secara visual. Pakai setelah mengubah visual, voiceover, atau WORDS, dan sebelum render penuh.
---

Argumen: nama video (PascalCase), mis. `ClaudeSetup`. Komposisinya `<Nama>-Reels`.

1. Jalankan `node scripts/reels-stills.mjs --video <Nama> [--per 2] [--only id,id] [--width 360] [--plain]`.
   - `--per 1` = tengah scene; `2` = 30% dan 80% (bawaan); `3` = 15%, 50%, 90% (cek awal dan akhir ketikan atau gerak).
   - Satu kolom per scene (urutan scene), satu baris per posisi. Hasil: `out/still/<Nama>-sheet.png`; still per frame di `out/still/<Nama>/`.
2. Baca contact sheet dengan Read. Periksa terhadap daftar periksa di `docs/struktur-video.md` ("Daftar periksa Reels sebelum render"):
   - judul dan konten tidak menempel header, tidak menimpa pita caption;
   - tubuh dan lengan karakter di dalam layar dan di luar braket;
   - satu sorotan oranye per layar;
   - subtitle dua baris dan konten penting berada di luar tint merah (bawah y >= 1570 dan kolom tombol kanan; `--plain` mematikan tint);
   - konten banyak memakai mode karakter `small` atau `hidden` (lihat "Tata letak narator aman platform");
   - hero visual, latar, dan pose berbeda dari scene tetangga.
3. Untuk satu frame lebih besar: `npx remotion still src/index.ts <Nama>-Reels out/still/x.png --frame=<n>` lalu Read.
4. Laporkan temuan per scene (nomor dan masalah). Jangan memperbaiki tanpa diminta kalau Ganjar hanya minta pemeriksaan.

Still hanya menangkap frame diam: gerak injakan, transisi pose, dan suara tetap perlu render penuh dan ditonton sekali.
