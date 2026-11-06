# SeleraDesain

"AI Kamu Tidak Punya Selera Desain": reels 9:16 (1080x1920, 30 fps), Format A (opini), 7 scene, komposisi `SeleraDesain-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Cara, Closing, Cta. Karakter narator: Claude Code (rig 2D). Dibuat dengan `node scripts/new-reels.mjs`. Subtitle karaoke satu baris (`Caption` dari `src/desk-world`) di root video pada `CAPTION_Y` 1660, di bawah karakter dan di atas footer.

- `config.ts`: teks tampilan (`SPOKEN`), teks TTS fonetis dengan tag emosi (`VO_TEXT`, mis. "Ei Ai"), `WORDS` hasil scribe, `REPO_URL`, caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: 7 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari PromptPanjang (`Frame`, `Headline`, `Chip`, `Card`, `PointTag`, `Bar`, `Grow`, `GithubMark`, `useCue`).
- `SeleraDesainVideo.tsx`: `Series` scene, karakter (ekspresi per scene), `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: 7 klip (satu per scene) di `voiceover/*.mp3`, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (tanpa `speed`, intonasi dari tag emosi di `VO_TEXT`). Klip mentah di `out/vo-raw/SeleraDesain/`. `WORDS` diukur dari audio dengan scribe.

```bash
node scripts/vo-lines.mjs --video SeleraDesain      # status tiap scene (ok, baru, berubah)
node scripts/vo-generate.mjs --video SeleraDesain   # generate yang baru atau berubah (minta konfirmasi, memakai kredit)
node scripts/vo-check.mjs --video SeleraDesain      # tempo, kenyaringan, variasi nada
node scripts/vo-words.mjs --video SeleraDesain      # ukur ulang WORDS setelah klip berubah
```

Mengubah `SPOKEN`, `VO_TEXT`, atau model mengubah hash, jadi klip terkait harus di-generate ulang lalu `vo-words` dijalankan lagi.

```bash
npx remotion render src/index.ts SeleraDesain-Reels out/SeleraDesain-Reels.mp4
```

## Caption

Bukan modelnya yang kurang pintar. AI-mu tidak pernah tahu seperti apa "bagus" menurutmu. Satu file Markdown bisa mengubah itu, dan repo awesome-design-md mengumpulkan puluhan contohnya: github.com/VoltAgent/awesome-design-md

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
