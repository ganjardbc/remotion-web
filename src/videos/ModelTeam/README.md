# ModelTeam

"Menyusun Opus, Sonnet, dan Haiku dalam Satu Sistem": reels 9:16 (1080x1920, 30 fps), 9 scene, komposisi `ModelTeam-Reels` (terdaftar otomatis lewat `COMPOSITION`). Karakter narator: Claude Code (rig 2D). Voiceover ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2.

- `config.ts`: teks ucapan (`SPOKEN`), caption dan 5 hashtag, durasi scene mengikuti audio (`voiceover.json`), `at(scene, frasa)`, musik.
- `scenes.tsx`: sembilan scene; cue dalam detik sejak suara mulai (timestamp kata ElevenLabs).
- `ModelTeamVideo.tsx`: `Series` scene, karakter (ekspresi per scene), footer, suara.
- `parts.tsx`: `Frame`, `Headline`, `PointTag`, `Card`, `Bar`, `useCue` (sama dengan Haiku55).

## Voiceover

Sudah dibuat: ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2 (model `eleven_v4` mengabaikan `speed`, hasilnya ±25% lebih lambat), satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/ModelTeam/` (tidak di-commit), hasil olahan di `voiceover/*.mp3`, dicatat di `voiceover.json` dan `voiceover-files.ts`. Durasi scene mengikuti audio.

Cue di `scenes.tsx` berupa detik dari timestamp kata ElevenLabs (scribe), bukan perkiraan huruf. Kalau `SPOKEN` berubah, generate ulang klip scene itu, olah dengan perintah di bawah, lalu ukur ulang cue scene itu.

```bash
node scripts/vo-process.mjs <id> out/vo-raw/ModelTeam/<id>.mp3 --hash <hash> --video ModelTeam
```

```bash
npx remotion render src/index.ts ModelTeam-Reels out/ModelTeam-Reels.mp4
```

## Caption

Satu model untuk semua pekerjaan itu boros. Opus merancang, Sonnet mengerjakan, Haiku menjalankan tugas rutin. Kuncinya ada di pembagiannya.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
