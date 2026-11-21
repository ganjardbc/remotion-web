# TokenSatuanBlock

"Belajar AI #3: Token, Satuan yang Dipakai AI": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Potong, Hitung, Limit, Kesimpulan, Teaser, Cta), dialog ganjar, robot. Komposisi `TokenSatuanBlock-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter. Latar `kelas` di semua scene: Robot (guru) di meja kiri, Ganjar (murid) berdiri kanan, judul dan tulisan kapur per scene di papan. Lanjutan Episode 2 (`PromptBukanMantraBlock`).

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `TokenSatuanBlockVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada (eleven_v4, tag emosi per baris di `scenes.ts`). Durasi baris dari perkiraan di `scenes.ts` sampai klip jadi: `node scripts/vo-generate.mjs --video TokenSatuanBlock`.

```bash
npx remotion still src/index.ts TokenSatuanBlock-Reels out/still/TokenSatuanBlock.png --frame=30
npx remotion render src/index.ts TokenSatuanBlock-Reels out/TokenSatuanBlock-Reels.mp4
```

## Caption

Kamu menulis dengan kata, AI menghitung dengan token. Itu sebabnya ada limit. Belajar AI #3 dari 15.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
