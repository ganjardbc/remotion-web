# Haiku55

"Haiku 5.5 Bukan Model Kelas Dua": reels 9:16 (1080x1920, 30 fps), 9 scene, komposisi `Haiku55-Reels` di `src/Root.tsx`. Karakter narator: Claude Code (rig 2D). Voiceover ElevenLabs, suara Nilasari.

- `config.ts`: teks ucapan (`SPOKEN`, angka dieja), durasi scene mengikuti audio (`voiceover.json`), musik.
- `scenes.tsx`: sembilan scene. Waktu cue dalam detik sejak suara mulai, diambil dari transkrip kata (ElevenLabs scribe).
- `parts.tsx`: `Frame`, `Headline`, `PointTag`, `Card`, `Bar`, `useCue`.
- `Haiku55Video.tsx`: `Series` scene, karakter (ekspresi per scene), footer, suara (voiceover, whoosh, musik `public/music/vue_bed.mp3`).
- `voiceover/*.mp3`: dibuat dengan `scripts/vo-process.py <id> <mentah.mp3> --hash <hash> --video Haiku55`.

Model TTS `eleven_multilingual_v2`, `speed` 1.2 (model `eleven_v4` mengabaikan `speed` dan hasilnya sekitar 25% lebih lambat). Mengubah teks satu scene: generate ulang klip itu, lalu perbarui cue waktunya di `scenes.tsx`.

```bash
npx remotion render src/index.ts Haiku55-Reels out/Haiku55-Reels.mp4
```
