# DioramaDemo

"Diorama Demo": prototipe Reels block 9:16 (1080x1920, 30 fps), 4 scene (Hook, Relate, Shift, Closing), dialog ganjar dan claudecode. Komposisi `DioramaDemo-Reels` (terdaftar otomatis lewat `COMPOSITION`). Isi naskah placeholder untuk menguji mesin `src/block-reels`: empat latar diorama, paralaks, dan jenis shot. Tanpa BrandFooter.

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar, pemeran, baris dialog, shot per baris.
- `DioramaDemoVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada. Durasi baris dari perkiraan di `scenes.ts`.

```bash
npx remotion still src/index.ts DioramaDemo-Reels out/still/dd.png --frame=30
npx remotion render src/index.ts DioramaDemo-Reels out/DioramaDemo-Reels.mp4
```

## Caption

Prototipe Reels block: dunia diorama, kamera berganti sudut. Isi naskah masih contoh.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
