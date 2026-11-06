# ClaudeSetup

"Setup Claude Code Tanpa Menebak": reels 9:16 (1080x1920, 30 fps), Format C (Quick Tips), 6 scene, komposisi `ClaudeSetup-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Konteks, Install, Pakai, Hasil, Cta. Karakter narator: Claude Code (rig 2D). Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: 6 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari PromptPanjang (`Frame`, `Headline`, `Chip`, `Card`, `PointTag`, `Bar`, `Grow`, `GithubMark`, `useCue`).
- `ClaudeSetupVideo.tsx`: `Series` scene, karakter (ekspresi per scene), `BrandFooter` sekali di root, suara.

## Voiceover (belum dibuat)

Selama `voiceover.json` kosong, durasi scene diperkirakan 15,3 huruf/detik dan video tanpa suara narasi. Setelah `SPOKEN` final:

```bash
node scripts/vo-lines.mjs --video ClaudeSetup      # status tiap scene
node scripts/vo-generate.mjs --video ClaudeSetup   # generate yang baru/berubah (minta konfirmasi dulu)
```

Suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2, satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/ClaudeSetup/`, hasil olahan di `voiceover/*.mp3`. Setelah itu durasi scene dan cue ikut audio secara otomatis; cek ulang frasa di `at(...)`. Untuk satu scene saja: `node scripts/vo-process.mjs <id> out/vo-raw/ClaudeSetup/<id>.mp3 --hash <hash> --video ClaudeSetup`.

```bash
npx remotion render src/index.ts ClaudeSetup-Reels out/ClaudeSetup-Reels.mp4
```

## Caption

Jangan setup Claude Code sambil menebak. Plugin resmi claude-code-setup membaca proyekmu dulu, lalu merekomendasikan MCP, skill, hook, subagent, dan slash command yang cocok. Sumber: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
