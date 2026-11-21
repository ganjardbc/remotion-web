# AiBukanGoogleBlock

"Belajar AI #1: AI Bukan Google": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Beda, Susun, Yakin, Kesimpulan, Teaser, Cta), dialog ganjar, robot. Komposisi `AiBukanGoogleBlock-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter.

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `AiBukanGoogleBlockVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada. Durasi baris dari perkiraan di `scenes.ts`.

```bash
npx remotion still src/index.ts AiBukanGoogleBlock-Reels out/still/AiBukanGoogleBlock.png --frame=30
npx remotion render src/index.ts AiBukanGoogleBlock-Reels out/AiBukanGoogleBlock-Reels.mp4
```

## Caption

TODO: caption pendek.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
