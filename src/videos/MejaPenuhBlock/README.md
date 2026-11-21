# MejaPenuhBlock

"Belajar AI #4: Kenapa AI Tiba-Tiba Lupa": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Meja, Ukuran, Penuh, Kesimpulan, Teaser, Cta), dialog ganjar, robot. Komposisi `MejaPenuhBlock-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter. Latar `kelas` di semua scene: Robot (guru) di meja kiri, Ganjar (murid) berdiri kanan, judul dan tulisan kapur per scene di papan. Lanjutan Episode 3 (`TokenSatuanBlock`).

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `MejaPenuhBlockVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada (eleven_v4, tag emosi per baris di `scenes.ts`). Durasi baris dari perkiraan di `scenes.ts` sampai klip jadi: `node scripts/vo-generate.mjs --video MejaPenuhBlock`.

```bash
npx remotion still src/index.ts MejaPenuhBlock-Reels out/still/MejaPenuhBlock.png --frame=30
npx remotion render src/index.ts MejaPenuhBlock-Reels out/MejaPenuhBlock-Reels.mp4
```

## Caption

AI tidak lupa, mejanya yang penuh. Itulah context window. Belajar AI #4 dari 15.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
