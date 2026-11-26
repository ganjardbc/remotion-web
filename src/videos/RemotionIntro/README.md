# RemotionIntro

"Bikin Video Pakai React, Bukan Editor": reels 9:16 (1080x1920, 30 fps), Format C (tutorial, Full Walkthrough), 8 scene, komposisi `RemotionIntro-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Konteks, Install, Kode, Render, Agen, Closing, Cta. Gaya mengikuti Ponytail: narator Claude Code block (kubus 3D, `ClaudeCodeBlock`) di kantor malam dari Reels block, berselang-seling dengan panel datar `Backdrop` tanpa karakter (mode `hidden`), diatur lewat `WORLD` di `config.ts`; arah hadap (`LOOKS`), gestur (`MOVES`), dan SFX per frasa di `RemotionIntroVideo.tsx`. Sumber fakta: README, dokumen Agent Skills, dan LICENSE.md di github.com/remotion-dev/remotion. Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, perintah dieja fonetis "en pe eks", "em pe empat"; subtitle memakai ejaan asli lewat `DISPLAY_FIXES`), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `WORDS` (waktu kata untuk subtitle; kosong = perkiraan, isi lewat `vo-words.mjs`).
- `scenes.tsx`: 8 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: komponen dasar dari template plus visual video ini: `Window`, `Typed`, `Line`, `StrikeChip`, `RepoCard`, `FilmStrip`, `ComponentNode`, `Tag`, `CodeLine`, `FrameCounter`, `PreviewBox`, `StudioShot` (screenshot Studio asli di `public/reels/RemotionIntro/studio.jpg`), `RenderRow`, `CheckRow`, `FollowPill`.
- `RemotionIntroVideo.tsx`: `Series` scene, karakter (`POSES` per scene, ekspresi per scene), subtitle `Caption`, `BrandFooter` sekali di root, suara.

## Voiceover (belum dibuat)

Selama `voiceover.json` kosong, durasi scene diperkirakan 13,2 huruf/detik dan video tanpa suara narasi. Setelah `SPOKEN` final:

```bash
node scripts/vo-lines.mjs --video RemotionIntro      # status tiap scene
node scripts/vo-generate.mjs --video RemotionIntro   # generate yang baru/berubah (minta konfirmasi dulu)
```

Suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (bawaan; mengabaikan `speed`, tag emosi per scene lewat `VO_TEXT`), satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/RemotionIntro/`, hasil olahan di `voiceover/*.mp3`. Setelah itu durasi scene dan cue ikut audio secara otomatis; cek ulang frasa di `at(...)`. Untuk satu scene saja: `node scripts/vo-process.mjs <id> out/vo-raw/RemotionIntro/<id>.mp3 --hash <hash> --video RemotionIntro`.

```bash
npx remotion render src/index.ts RemotionIntro-Reels out/RemotionIntro-Reels.mp4
```

## Caption

Remotion bikin video bisa ditulis sebagai kode React: install dengan npx create-video@latest, preview di Studio, lalu render jadi MP4. Gratis untuk individu dan perusahaan sampai 3 karyawan; di atas itu perlu company license.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
