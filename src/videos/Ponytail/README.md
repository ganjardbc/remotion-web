# Ponytail

"Agen AI Yang Malas Justru Lebih Jago": reels 9:16 (1080x1920, 30 fps), Format A (opini), 9 scene, komposisi `Ponytail-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Cara, Case, Manfaat, Closing, Cta. Karakter narator: Claude Code block (kubus 3D, `ClaudeCodeBlock`) di latar kantor malam dari Reels block; scene tanpa karakter (mode `hidden`) memakai latar datar `Backdrop` (primary, dark, ground), diatur lewat `WORLD` di `config.ts`. Percobaan; narator baku tetap rig 2D. Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `WORDS` (waktu kata untuk subtitle; kosong = perkiraan, isi lewat `vo-words.mjs`).
- `scenes.tsx`: 9 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari PromptPanjang (`Frame`, `Headline`, `Chip`, `Card`, `PointTag`, `Bar`, `Grow`, `GithubMark`, `useCue`).
- `PonytailVideo.tsx`: `Series` scene, karakter (`POSES` per scene, ekspresi per scene), subtitle `Caption`, `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: 9 klip, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (tanpa `speed`, tag emosi per scene lewat `VO_TEXT`), total sekitar 62 dtk audio dan 67,8 dtk video (di atas 60 dtk, durasi diterima). Waktu kata (`WORDS`) diukur dengan `vo-words`; transkrip scribe cocok dengan naskah. Klip mentah di `out/vo-raw/Ponytail/`, hasil olahan di `voiceover/*.mp3`. Olah ulang satu scene: `node scripts/vo-generate.mjs --video Ponytail --only <id>`, lalu `node scripts/vo-words.mjs --video Ponytail --only <id>`.

```bash
npx remotion render src/index.ts Ponytail-Reels out/Ponytail-Reels.mp4
```

## Caption

Agen AI biasanya rajin menulis kode. Ponytail bikin dia malas dulu: cek yang sudah ada, baru tulis. Menurut benchmark repo-nya, kode turun 53% dan tes untuk logika berisiko naik. Sumber: github.com/DietrichGebert/ponytail

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
