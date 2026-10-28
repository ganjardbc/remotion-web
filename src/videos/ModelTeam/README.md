# ModelTeam

"Menyusun Opus, Sonnet, dan Haiku dalam Satu Sistem": reels 9:16 (1080x1920, 30 fps), 9 scene, komposisi `ModelTeam-Reels` di `src/Root.tsx`. Karakter narator: Claude Code (rig 2D). Voiceover ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2.

- `config.ts`: teks ucapan (`SPOKEN`), durasi scene mengikuti audio (`voiceover.json`), musik.
- `scenes.tsx`: sembilan scene; cue dalam detik sejak suara mulai (timestamp kata ElevenLabs).
- `parts.tsx`: sama dengan Haiku55.
- `voiceover/*.mp3`: diproses `scripts/vo-process.py <id> <mentah.mp3> --hash <hash> --video ModelTeam`.

```bash
npx remotion render src/index.ts ModelTeam-Reels out/ModelTeam-Reels.mp4
```
