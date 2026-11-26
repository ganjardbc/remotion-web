# FilmKode

"Film 99 Gaya Tanpa Model Video": reels 9:16 (1080x1920, 30 fps), Format A (opini), 8 scene, komposisi `FilmKode-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Install, Pakai, Closing, Cta. Sudut pandang: mengenalkan plugin Lemo Opuscar dari Lemomo (99 gaya film untuk Claude Code, dibuat dari kode tanpa model video), cara install, dan cara pakai. Karakter narator: Claude Code block (kubus 3D, `ClaudeCodeBlock`) di latar kantor malam, seperti Ponytail; scene tanpa karakter (mode `hidden`) memakai latar datar `Backdrop`, diatur lewat `WORLD` di `config.ts`. Dibuat dengan `node scripts/new-reels.mjs`, root dan `parts.tsx` disalin dari Ponytail.

- `config.ts`: teks ucapan (`SPOKEN`, "Lemo Opuskar" dieja fonetis, subtitle menampilkan "Lemo Opuscar" lewat `DISPLAY_FIXES`), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `WORDS` (waktu kata untuk subtitle; kosong = perkiraan, isi lewat `vo-words.mjs`).
- `scenes.tsx`: 8 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari Ponytail (`Frame` dengan dunia kantor, `Headline`, `Card`, `Terminal`, `BigNumber`, `QuoteCard`, `Stamp`, `FollowPill`, `useCue`) ditambah `Flow` (diagram alur shift) dan `PillRow`.
- `FilmKodeVideo.tsx`: `Series` scene, karakter block (posisi dari `NARRATOR`, ekspresi, arah hadap, gesture per scene), subtitle `SubtitleBand`, `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: 8 klip, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (tanpa `speed`, tag emosi per scene lewat `VO_TEXT`), total sekitar 66 dtk video (di atas 60 dtk, durasi diterima seperti Ponytail). Hook memakai ejaan fonetis "Klod Kod" hanya di teks TTS (`TTS_FIX` di `config.ts`) karena "Claude" terbaca "cloud"; subtitle tetap "Claude Code". Waktu kata (`WORDS`) diukur dengan `vo-words`; di hook, shift, dan pakai angka dan ejaan scribe beda dari naskah, jadi barisnya diselaraskan per kata dari `out/vo-scribe/FilmKode/*.json`. Klip mentah di `out/vo-raw/FilmKode/`, hasil olahan di `voiceover/*.mp3`. Olah ulang satu scene: `node scripts/vo-generate.mjs --video FilmKode --only <id>`, lalu `node scripts/vo-words.mjs --video FilmKode --only <id>` dan cek barisnya.

```bash
npx remotion render src/index.ts FilmKode-Reels out/FilmKode-Reels.mp4
```

## Caption

Lemo Opuscar dari Lemomo: 99 gaya film untuk Claude Code, dibuat murni dari kode tanpa model video. Pasang lewat dua perintah plugin, lalu minta filmnya. Satu film butuh sekitar 30-60 menit dan banyak token. Sumber: github.com/lemomo-ai/lemo-opuscar

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
