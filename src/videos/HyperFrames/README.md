# HyperFrames

"Bikin Video MP4 Cukup Pakai HTML": reels 9:16 (1080x1920, 30 fps), Format C (tutorial, Full Walkthrough), 8 scene, komposisi `HyperFrames-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Konteks, Syarat, Install, Init, Pakai, Agen, Cta. Karakter narator: Claude Code block (kubus 3D, `ClaudeCodeBlock`) seperti Ponytail; hook dan CTA di kantor malam, scene lain di latar datar `Backdrop` berselang-seling (`WORLD` di `config.ts`). Sumber fakta: README github.com/heygen-com/hyperframes. Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `WORDS` (waktu kata untuk subtitle; kosong = perkiraan, isi lewat `vo-words.mjs`).
- `scenes.tsx`: 8 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: dasar dari RemotionIntro (`Frame` dengan dunia kantor, `Headline`, `Accent`, `Chip`, `useCue`) plus visual video ini: `Typed`, `Window`, `Line`, `RepoCard`, `HtmlToFilm`, `Flow`, `CheckRow`, `Stamp`, `Terminal`, `PreviewWindow`, `RenderRow`, `FollowPill`.
- `HyperFramesVideo.tsx`: `Series` scene, karakter (`POSES` per scene, ekspresi per scene), subtitle `SubtitleBand`, `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: 8 klip, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (tanpa `speed`, tag emosi per kalimat lewat `VO_TEXT`), total sekitar 51 dtk. Waktu kata (`WORDS`) diukur dengan `vo-words`; di scene yang scribe menulis angka atau singkatan (syarat, agen), pemetaan kata memakai jangkar kata yang sama persis (`mapWords` di `scripts/vo-words.mjs`). Ejaan fonetis di `SPOKEN`: "Hei Jen" (HeyGen), "en pe eks", "Ef Ef Em Peg", "em pe empat"; tanda hubung dihindari karena suara Indonesia membacanya "strip" (`my video`, `Hei Jen com`), subtitle menampilkan ejaan asli lewat `DISPLAY_FIXES`. Klip mentah di `out/vo-raw/HyperFrames/`, hasil olahan di `voiceover/*.mp3`. Olah ulang satu scene: `node scripts/vo-generate.mjs --video HyperFrames --only <id>`, lalu `node scripts/vo-words.mjs --video HyperFrames --only <id>`.

```bash
npx remotion render src/index.ts HyperFrames-Reels out/HyperFrames-Reels.mp4
```

## Caption

HyperFrames dari HeyGen mengubah HTML jadi video MP4. Untuk agen: npx skills add heygen-com/hyperframes. Mau tanpa agen: npx hyperframes init my-video. Perlu Node 22+ dan FFmpeg. Sumber: github.com/heygen-com/hyperframes

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
