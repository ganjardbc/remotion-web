# Anatomy

"Jelaskan Ide Jadi Mesin Yang Bisa Dimainkan": reels 9:16 (1080x1920, 30 fps), Format A dengan bagian tutorial (perkenalan, cara install, cara pakai; acuan Ponytail), 9 scene, komposisi `Anatomy-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Install, Pakai, Hasil, Closing, Cta. Topik: skill Anatomy (github.com/wheresryan22/anatomy) yang mengubah ide jadi figur isometrik yang bisa dimainkan. Karakter narator: Claude Code block (kubus 3D, seperti Ponytail), latar kantor malam berselang-seling dengan panel datar (`WORLD`). Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `WORDS` (waktu kata untuk subtitle; kosong = perkiraan, isi lewat `vo-words.mjs`).
- `scenes.tsx`: 9 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: komponen dasar disalin dari Ponytail (`Frame` dengan dunia kantor, `Headline`, `Chip`, `Terminal`, `QuoteCard`, `Stamp`, `FollowPill`, `FileTile`) dan komponen khusus: `Padlock` (gembok pin-tumbler 2D), `TangledBoxes`, `OneTile`, `PromptBox`, `Clock`, `Cycle`.
- `AnatomyVideo.tsx`: `Series` scene, karakter (posisi dari `NARRATOR`, ekspresi `FACES`, arah hadap `LOOKS`, gesture `MOVES`), subtitle `SubtitleBand` (ejaan lewat `DISPLAY_FIXES`), `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: 9 klip eleven_v4 (±57 dtk suara), `WORDS` dari scribe. "cache" ditulis fonetis "kesh" di `SPOKEN` (ditampilkan "cache" lewat `DISPLAY_FIXES`) karena "cache" dibaca "catch"; "wheresryan22" ditulis "wers raian dua dua" dan scribe masih mendengarnya "worst Ryan 22", jadi dengarkan klip install. Olah ulang:

```bash
node scripts/vo-lines.mjs --video Anatomy      # status tiap scene
node scripts/vo-generate.mjs --video Anatomy   # generate yang baru/berubah (minta konfirmasi dulu)
```

Suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (bawaan; mengabaikan `speed`, tag emosi per scene lewat `VO_TEXT`), satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/Anatomy/`, hasil olahan di `voiceover/*.mp3`. Setelah itu durasi scene dan cue ikut audio secara otomatis; cek ulang frasa di `at(...)`. Untuk satu scene saja: `node scripts/vo-process.mjs <id> out/vo-raw/Anatomy/<id>.mp3 --hash <hash> --video Anatomy`.

```bash
npx remotion render src/index.ts Anatomy-Reels out/Anatomy-Reels.mp4
```

## Caption

Menjelaskan ide teknis dengan kotak dan panah sering tidak cukup. Anatomy, skill dari Ryan (wheresryan22), membangun idenya jadi objek isometrik yang bisa dimainkan. Pasang: npx skills add wheresryan22/anatomy -g -a claude-code, lalu pakai /anatomy. Satu figur sekitar 30-90 menit. Sumber: github.com/wheresryan22/anatomy

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
