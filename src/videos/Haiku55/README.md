# Haiku55

"Haiku 5.5 Bukan Model Kelas Dua": reels 9:16 (1080x1920, 30 fps), 9 scene, komposisi `Haiku55-Reels` di `src/Root.tsx`. Karakter narator: Claude Code (rig 2D). Voiceover ElevenLabs, suara Nilasari.

- `config.ts`: teks ucapan (`SPOKEN`, angka dieja), caption dan 5 hashtag, durasi scene mengikuti audio (`voiceover.json`), `at(scene, frasa)`, musik.
- `scenes.tsx`: sembilan scene. Waktu cue dalam detik sejak suara mulai, diambil dari transkrip kata (ElevenLabs scribe).
- `parts.tsx`: `Frame`, `Headline`, `PointTag`, `Card`, `Bar`, `useCue`.
- `Haiku55Video.tsx`: `Series` scene, karakter (ekspresi per scene), footer, suara (voiceover, whoosh, musik `public/music/vue_bed.mp3`).

## Voiceover

Sudah dibuat: ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2 (model `eleven_v4` mengabaikan `speed`, hasilnya ±25% lebih lambat), satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/Haiku55/` (tidak di-commit), hasil olahan di `voiceover/*.mp3`, dicatat di `voiceover.json` dan `voiceover-files.ts`. Durasi scene mengikuti audio.

Cue di `scenes.tsx` berupa detik dari timestamp kata ElevenLabs (scribe), bukan perkiraan huruf. Kalau `SPOKEN` berubah, generate ulang klip scene itu, olah dengan perintah di bawah, lalu ukur ulang cue scene itu.

```bash
node scripts/vo-process.mjs <id> out/vo-raw/Haiku55/<id>.mp3 --hash <hash> --video Haiku55
```

```bash
npx remotion render src/index.ts Haiku55-Reels out/Haiku55-Reels.mp4
```

## Caption

Haiku 5.5 sering dianggap model kelas dua. Padahal dia dibuat untuk volume tinggi, dan di tugas seperti itu kecepatan lebih berarti daripada kepintaran maksimal.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
