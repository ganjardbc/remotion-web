---
name: reels-voiceover
description: Alur voiceover Reels narator di remotion-web: periksa naskah, uji satu scene, vo-check, generate sisanya, ukur ulang WORDS dari scribe. Pakai saat membuat atau mengganti voiceover sebuah Reels. Memakai kredit ElevenLabs, jadi selalu minta konfirmasi.
disable-model-invocation: true
---

Voiceover Reels narator (`src/videos/<Nama>`, `config.ts` + `scenes.tsx`). Argumen: nama video (PascalCase). Aturan lengkap: `docs/struktur-video.md`, bagian Voiceover.
Semua langkah yang memanggil API **meminta konfirmasi jumlah huruf dan kredit dulu**; jangan pakai `--yes` kecuali Ganjar sudah menyetujui angkanya.

1. **Periksa naskah** (`SPOKEN`, dan `VO_TEXT` kalau ada):
   - Singkatan Inggris dieja fonetis ("Ei Ai"); kalimat tanya ya/tidak ditutup kata benda atau nama, bukan kata kerja atau kata ulang (nada akan turun).
   - Bawaan Reels baru sudah `eleven_v4` (`VO_SETTINGS` dan `VO_TEXT` ada di `config.ts` hasil scaffold). Untuk scene penting, tulis `VO_TEXT` dengan tag emosi per kalimat (`[curious]`, `[serious]`, `[confident]`, `[warm]`, `[friendly]`); video lama berbasis `eleven_multilingual_v2` menguncinya lewat `VO_SETTINGS`. Putuskan model sebelum generate semua: mengubahnya mengubah hash semua klip.
2. **Status**: `node scripts/vo-lines.mjs --video <Nama>` (baru, berubah, ok; jumlah huruf = kredit).
3. **Uji satu scene dulu**: `node scripts/vo-generate.mjs --video <Nama> --only <scene-pertama>`, lalu `node scripts/vo-check.mjs --video <Nama> --only <scene-pertama>`. Dengarkan atau minta Ganjar mendengarkan. Kalau tempo, kenyaringan, nada datar, atau nada tanya turun, perbaiki naskah dan ulangi (2-3 take untuk kalimat penting). Jangan generate sisanya sebelum scene uji layak.
4. **Generate sisanya**: `node scripts/vo-generate.mjs --video <Nama>`, lalu `node scripts/vo-check.mjs --video <Nama>` untuk semua scene.
5. **Ukur ulang waktu kata**: `node scripts/vo-words.mjs --video <Nama>` (scribe, kredit kecil, minta konfirmasi) menulis `WORDS` di `config.ts`. `at()`, cue, dan caption mengikuti `WORDS`. Ulangi setiap kali klip berubah (hasil disimpan per hash klip, jadi tanpa perubahan tidak memanggil API lagi).
6. **Cek**: `npm run lint`, lalu skill `reels-stills` untuk melihat caption dan cue di frame nyata.
7. **Komit per scope**: skrip atau dokumen dulu, isi video belakangan.

Laporkan ke Ganjar: jumlah huruf dan kredit yang terpakai (termasuk take percobaan), hasil `vo-check`, dan catatan yang perlu didengarkan.
