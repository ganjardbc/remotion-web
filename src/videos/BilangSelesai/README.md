# BilangSelesai

"Selesai itu Keputusanmu, Bukan AI!": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Relate, Shift, Urgency, Cara, Closing, Cta), tuntas dalam satu video, dialog ganjar, claudecode. Komposisi `BilangSelesai-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter.

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `BilangSelesaiVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada. Durasi baris dari perkiraan di `scenes.ts`.

```bash
npx remotion still src/index.ts BilangSelesai-Reels out/still/BilangSelesai.png --frame=30
npx remotion render src/index.ts BilangSelesai-Reels out/BilangSelesai-Reels.mp4
```

## Caption

AI berhenti saat promptnya habis, bukan saat masalahmu selesai. Sebelum minta, tulis apa yang harus jalan, cara mengecek, dan apa yang tidak boleh rusak. Follow kalau mau terus melatih cara menilai kerja AI.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
