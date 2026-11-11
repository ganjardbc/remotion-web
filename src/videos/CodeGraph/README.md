# CodeGraph

"CodeGraph Hemat Token? Aku Tes Sendiri": reels 9:16 (1080x1920, 30 fps), Format A (opini), 7 scene, komposisi `CodeGraph-Reels` (terdaftar otomatis lewat `COMPOSITION`). Karakter narator: Claude Code (rig 2D). Alur Hook, Relate, Hasil, Shift, Urgency (kalimat baru "Tapi ini baru separuh ceritanya"), Closing, Cta. Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: 7 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari PromptPanjang (`Frame`, `Headline`, `Chip`, `Card`, `PointTag`, `Bar`, `Grow`, `GithubMark`, `useCue`).
- `CodeGraphVideo.tsx`: `Series` scene, karakter (ekspresi per scene), `BrandFooter` sekali di root, suara.

## Voiceover (belum dibuat)

Selama `voiceover.json` kosong, durasi scene diperkirakan 15,3 huruf/detik dan video tanpa suara narasi. Setelah `SPOKEN` final:

```bash
node scripts/vo-lines.mjs --video CodeGraph      # status tiap scene
node scripts/vo-generate.mjs --video CodeGraph   # generate yang baru/berubah (minta konfirmasi dulu)
```

Suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model bawaan `eleven_multilingual_v2`, `speed` 1.2, satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/CodeGraph/`, hasil olahan di `voiceover/*.mp3`. Setelah itu durasi scene dan cue ikut audio secara otomatis; cek ulang frasa di `at(...)`. Untuk satu scene saja: `node scripts/vo-process.mjs <id> out/vo-raw/CodeGraph/<id>.mp3 --hash <hash> --video CodeGraph`.

```bash
npx remotion render src/index.ts CodeGraph-Reels out/CodeGraph-Reels.mp4
```

## Caption

Katanya CodeGraph hemat 62% token. Di proyekku justru lebih mahal: 0,29 dolar lawan 0,19 dolar. Bukan vonis, cuma satu proyek dan satu pertanyaan. Tes sendiri dulu, lalu ceritakan hasilmu.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
