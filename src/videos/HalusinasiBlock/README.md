# HalusinasiBlock

"Belajar AI #5: AI Bisa Ngarang dengan Percaya Diri": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Tebak, Rawan, Cara, Kesimpulan, Teaser, Cta), dialog ganjar, robot. Komposisi `HalusinasiBlock-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter. Latar `kelas` di semua scene: Robot (guru) di meja kiri, Ganjar (murid) berdiri kanan, judul dan tulisan kapur per scene di papan. Penutup fase 1 seri Belajar AI, lanjutan Episode 4 (`MejaPenuhBlock`).

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `HalusinasiBlockVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada (eleven_v4, tag emosi per baris di `scenes.ts`). Durasi baris dari perkiraan di `scenes.ts` sampai klip jadi: `node scripts/vo-generate.mjs --video HalusinasiBlock`.

```bash
npx remotion still src/index.ts HalusinasiBlock-Reels out/still/HalusinasiBlock.png --frame=30
npx remotion render src/index.ts HalusinasiBlock-Reels out/HalusinasiBlock-Reels.mp4
```

## Caption

Yakin bukan bukti benar. AI bisa ngarang dengan percaya diri, jadi hal penting wajib dicek. Belajar AI #5 dari 15.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
