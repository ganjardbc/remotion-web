# ClaudeSetup

"Setup Claude Code Tanpa Menebak": reels 9:16 (1080x1920, 30 fps), Format C (Quick Tips), 6 scene, komposisi `ClaudeSetup-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Konteks, Install, Pakai, Hasil, Cta. Karakter narator: Claude Code (rig 2D). Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: 6 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari PromptPanjang (`Frame`, `Headline`, `Chip`, `Card`, `PointTag`, `Bar`, `Grow`, `GithubMark`, `useCue`) plus dunia meja (`Desk`, `Mug`, `Lamp`, `Plant`, `Monitor`, `Keyboard`, `Cabinet`) dan `Caption`.
- `ClaudeSetupVideo.tsx`: `Series` scene, karakter (ekspresi per scene), `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat: ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` dengan tag emosi per kalimat (`VO_SETTINGS` dan `VO_TEXT` di `config.ts`; versi pertama `eleven_multilingual_v2` speed 1.2 terdengar datar), satu klip per scene dengan id = id scene (6 klip, 524 huruf, total sekitar 32 detik). Klip mentah di `out/vo-raw/ClaudeSetup/` (tidak di-commit), hasil olahan di `voiceover/*.mp3`, dicatat di `voiceover.json`. Durasi scene mengikuti audio.

Waktu tiap kata ada di `WORDS` (`config.ts`), dari timestamp kata ElevenLabs scribe (`scribe_v1`, bahasa `ind`) pada klip olahan. `WORDS` dipakai caption karaoke (`Caption` di `parts.tsx`, satu baris di root video, posisi per scene di `CAPTION_Y`) dan `at(scene, frasa)`. Kalau `SPOKEN` atau klip berubah: generate ulang klip scene itu, olah, lalu ukur ulang `WORDS` scene itu.

```bash
node scripts/vo-lines.mjs --video ClaudeSetup      # status tiap scene
node scripts/vo-generate.mjs --video ClaudeSetup   # generate yang baru/berubah (minta konfirmasi dulu)
```

```bash
npx remotion render src/index.ts ClaudeSetup-Reels out/ClaudeSetup-Reels.mp4
```

## Caption

Jangan setup Claude Code sambil menebak. Plugin resmi claude-code-setup membaca proyekmu dulu, lalu merekomendasikan MCP, skill, hook, subagent, dan slash command yang cocok. Sumber: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
