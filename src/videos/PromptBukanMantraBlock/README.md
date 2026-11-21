# PromptBukanMantraBlock

"Belajar AI #2: Prompt Itu Bukan Mantra": Reels block 9:16 (1080x1920, 30 fps), 7 scene (Hook, Kosong, Empat, Contoh, Kesimpulan, Teaser, Cta), dialog ganjar, claudecode. Komposisi `PromptBukanMantraBlock-Reels` (terdaftar otomatis lewat `COMPOSITION`). Dibuat dengan `node scripts/new-block.mjs`. Tanpa BrandFooter. Latar `kelas` di semua scene: Claude Code (guru) di meja kiri, Ganjar (murid) berdiri kanan, judul dan tulisan kapur per scene di papan (`board` di `scenes.ts`). Lanjutan Episode 1 (`AiBukanGoogleBlock`).

- `config.ts`: `META`, caption, dan 5 hashtag.
- `scenes.ts`: data scene (`BASE_SCENES`): latar diorama, pemeran, baris dialog, jenis shot per baris.
- `PromptBukanMantraBlockVideo.tsx`: memanggil mesin `src/block-reels`.

## Voiceover

Belum ada (eleven_v4, tag emosi per baris di `scenes.ts`). Durasi baris dari perkiraan di `scenes.ts` sampai klip jadi: `node scripts/vo-generate.mjs --video PromptBukanMantraBlock`.

```bash
npx remotion still src/index.ts PromptBukanMantraBlock-Reels out/still/PromptBukanMantraBlock.png --frame=30
npx remotion render src/index.ts PromptBukanMantraBlock-Reels out/PromptBukanMantraBlock-Reels.mp4
```

## Caption

Prompt bukan mantra, prompt itu briefing. Empat bagian: Peran, Tugas, Konteks, Format. Belajar AI #2 dari 15.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
