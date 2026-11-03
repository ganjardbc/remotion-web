# ClaudeMem

"Claude Code-mu Pelupa Akut": reels 9:16 (1080x1920, 30 fps), 8 scene, komposisi `ClaudeMem-Reels` di `src/Root.tsx`. Satu konten tuntas, tanpa lanjutan. Topik: [claude-mem](https://github.com/thedotmack/claude-mem) v15.8.3 (README per 2 November 2026: ±110k bintang, 6 momen pencatatan, SQLite + Chroma, alur `search` → `timeline` → `get_observations`, ±10x hemat token, pasang lewat `/plugin marketplace add thedotmack/claude-mem` dan `/plugin install claude-mem`). Tata letak mengikuti KurikulumAIEngineerGratis (kartu repo GitHub di scene 2, tautan repo di scene CTA). Karakter narator: Claude Code (rig 2D).

- `config.ts`: teks ucapan (`SPOKEN`), `REPO_URL`, caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: delapan scene. Cue ditulis sebagai frasa dari `SPOKEN`, diubah ke detik menurut posisi huruf frasa itu dalam kalimat.
- `parts.tsx`: `Frame`, `Headline`, `Chip`, `PointTag`, `Card`, `Bar`, `Grow`, `GithubMark`, `useCue`.
- `ClaudeMemVideo.tsx`: `Series` scene, karakter (ekspresi per scene), footer, suara.

## Voiceover (belum dibuat)

Selama `voiceover.json` kosong, durasi scene diperkirakan 15,3 huruf/detik (±58 detik) dan video tanpa suara narasi. Generate dengan ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2, satu klip per scene dengan id = id scene, lalu:

```bash
node scripts/vo-process.mjs <id> out/vo-raw/ClaudeMem/<id>.mp3 --hash <hash> --video ClaudeMem
```

Setelah itu durasi scene dan cue ikut audio secara otomatis.

```bash
npx remotion render src/index.ts ClaudeMem-Reels out/ClaudeMem-Reels.mp4
```
