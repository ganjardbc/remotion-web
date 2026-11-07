# BilangSelesai

"Selesai itu Keputusanmu, Bukan AI!": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Relate, Shift, Urgency, Cara, Closing, Cta), tuntas dalam satu video, dialog ganjar, claudecode. Komposisi `BilangSelesai-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter.

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `BilangSelesaiVideo.tsx`: memanggil mesin `src/block-reels`.

## Efek suara

Whoosh antar scene, pop tiap baris, dan `sfx` per baris di `scenes.ts`: record scratch di "Ternyata belum", ding di "Tugas selesai", "bukan saat masalahmu selesai", "terpenuhi", dan penutup, sad trombone di "error muncul", tiga ketukan key di tiga hal. Belum ada musik.

## Voiceover

ElevenLabs `eleven_v4` (tanpa speed), tag emosi per baris di `scenes.ts`. Ganjar = Ari Eko, Claude Code = Nilasari (`src/dialog-reels/voices.json`). 11 klip (`hook-01` ... `cta-01`), id = id scene + nomor urut. Durasi baris dan scene mengikuti audio (`fitBlockScenes`). Cek dan olah ulang: `node scripts/vo-lines.mjs --video BilangSelesai`, `node scripts/vo-generate.mjs --video BilangSelesai [--only id]`.

```bash
npx remotion still src/index.ts BilangSelesai-Reels out/still/BilangSelesai.png --frame=30
npx remotion render src/index.ts BilangSelesai-Reels out/BilangSelesai-Reels.mp4
```

## Caption

AI berhenti saat promptnya habis, bukan saat masalahmu selesai. Sebelum minta, tulis apa yang harus jalan, cara mengecek, dan apa yang tidak boleh rusak. Follow kalau mau terus melatih cara menilai kerja AI.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
