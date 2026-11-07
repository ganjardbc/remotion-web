# AsistenSetuju

"Asisten yang Selalu Setuju": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Relate, Shift, Urgency, Cara, Closing, Cta), dialog ganjar, claudecode. Komposisi `AsistenSetuju-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter.

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `AsistenSetujuVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada. Durasi baris dari perkiraan di `scenes.ts`.

```bash
npx remotion still src/index.ts AsistenSetuju-Reels out/still/AsistenSetuju.png --frame=30
npx remotion render src/index.ts AsistenSetuju-Reels out/AsistenSetuju-Reels.mp4
```

## Caption

TODO: caption pendek.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
