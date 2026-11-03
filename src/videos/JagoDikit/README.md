# JagoDikit

"Jago Dikit, Buka Kelas": reels 9:16 (1080x1920, 30 fps), Format A (opini), 7 scene, dialog ganjar, claudecode, gaya rig. Komposisi `JagoDikit-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Closing, Jawab, Cta. Dibuat dengan `node scripts/new-reels.mjs --dialog`.

- `config.ts`: `META` (judul, gaya), caption dan 5 hashtag, `VO_MANIFEST` dari `voiceover.json`.
- `scenes.ts`: data scene (`BASE_SCENES`): latar, waktu, pemeran (karakter, ekspresi, gerak, posisi), teks layar, dan baris ucapan (`who`, `from`, `dur`, `text`, `spoken`). Isi `spoken` bila yang diucapkan beda dari subtitle (angka dieja, singkatan dibaca utuh, mis. "Ei Ai").
- `JagoDikitVideo.tsx`: memanggil mesin `src/dialog-reels` (`DraftVideo`): panggung, teks layar, subtitle, `BrandFooter`, suara, dan musik.
- Ekspresi: netral, senang, sedih, kaget, bingung, mikir, kesal, marah, serius, malu, mataTertutup. Gerak: Ganjar `headTurn`, `point`, `startle`; Robot dan Claude Code `armGesture`, `surprise`, `walk`. Latar: `ruangKerja`, `kosong`, `luarRuang`; waktu: `siang`, `sore`, `malam`.

## Voiceover (sudah dibuat, 17 klip)

Satu klip per baris ucapan, id baris = id scene + nomor urut (`hook-01`). Suara per karakter: Ari Eko untuk Ganjar, Nilasari untuk Robot dan Claude Code (`src/dialog-reels/voices.json`), model `eleven_multilingual_v2`, `speed` 1.2. Klip sudah ada. Kalau teks berubah, jalankan lagi:

```bash
node scripts/vo-lines.mjs --video JagoDikit      # status tiap baris
node scripts/vo-generate.mjs --video JagoDikit   # generate yang baru/berubah (minta konfirmasi dulu)
```

Klip mentah di `out/vo-raw/JagoDikit/`, hasil olahan di `voiceover/*.mp3`. Durasi scene dan waktu baris ikut audio secara otomatis.

```bash
npx remotion render src/index.ts JagoDikit-Reels out/JagoDikit-Reels.mp4
```

## Caption

Bisa bikin pakai AI itu satu hal. Bisa ngajarin orang itu hal lain. Kamu di posisi yang mana?

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
