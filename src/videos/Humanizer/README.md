# Humanizer

"Tulisan AI Yang Terdengar Manusia": reels 9:16 (1080x1920, 30 fps), Format A (opini), 9 scene, komposisi `Humanizer-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Install, Pakai, Hasil, Closing, Cta. Karakter narator: Claude Code block (kubus 3D, `ClaudeCodeBlock`) di latar kantor malam; scene mode `hidden` memakai latar datar `Backdrop`, diatur lewat `WORLD`. Percobaan; narator baku tetap rig 2D. Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `NARRATOR` dan `WORLD` per scene, `WORDS` (waktu kata dari audio asli, hasil `vo-words.mjs`).
- `scenes.tsx`: 9 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari Ponytail, disesuaikan (`Frame`, `Headline`, `Chip`, `Card`, `Terminal`, `PatternList`, `AiTextCard`, `BeforeAfter`, `Locks`, `QuoteCard`, `useCue`).
- `HumanizerVideo.tsx`: `Series` scene, karakter (pose dari `NARRATOR`, ekspresi, arah hadap, gesture), subtitle `SubtitleBand`, `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: 9 klip, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (tanpa `speed`, tag emosi per scene lewat `VO_TEXT`), sekitar 71 dtk audio (di atas 60 dtk, diterima seperti Ponytail). `WORDS` diukur dengan `vo-words`; transkrip scribe cocok dengan naskah. Klip mentah di `out/vo-raw/Humanizer/`, hasil olahan di `voiceover/*.mp3`. Olah ulang satu scene: `node scripts/vo-generate.mjs --video Humanizer --only <id>`, lalu `node scripts/vo-words.mjs --video Humanizer --only <id>`.

```bash
npx remotion render src/index.ts Humanizer-Reels out/Humanizer-Reels.mp4
```

## Caption

Tulisan AI punya tanda yang gampang dikenali. Humanizer mengecek 26 pola dari panduan Wikipedia lalu menulis ulang tanpa mengubah isi. Pasang dengan dua perintah di Claude Code. Sumber: github.com/blader/humanizer

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
