# AiNativeSdlc

"AI-Native SDLC Itu Sebenarnya Loop": reels 9:16 (1080x1920, 30 fps), Format A (opini), 7 scene, komposisi `AiNativeSdlc-Reels` (terdaftar otomatis lewat `COMPOSITION`). Alur: Hook, Relate, Shift, Urgency, Cara, Closing, Cta. Karakter narator: Claude Code (rig 2D). Sumber: Anthropic, "The AI-native SDLC playbook" (disebut di hook dan caption). Dibuat dengan `node scripts/new-reels.mjs`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai" dan "Es Di El Si"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`, `WORDS` (waktu kata untuk subtitle; kosong = perkiraan, isi lewat `vo-words.mjs`).
- `scenes.tsx`: 7 scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: komponen dasar dari PromptPanjang (`Frame` dengan `variant`, `Headline`, `Bar`, `useCue`) plus visual video ini: `SourceChip`, `Claim`, `Stage`, `LineToLoop`, `FileCard`, `LoopStep`, `ReturnLink`, `GateLoop`, `FollowPill`, `FileTile`.
- `AiNativeSdlcVideo.tsx`: `Series` scene, karakter (`POSES` per scene, ekspresi per scene), subtitle `Caption`, `BrandFooter` sekali di root, suara.

## Voiceover (belum dibuat)

Selama `voiceover.json` kosong, durasi scene diperkirakan 15,3 huruf/detik dan video tanpa suara narasi. Setelah `SPOKEN` final:

```bash
node scripts/vo-lines.mjs --video AiNativeSdlc      # status tiap scene
node scripts/vo-generate.mjs --video AiNativeSdlc   # generate yang baru/berubah (minta konfirmasi dulu)
```

Suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_v4` (bawaan; mengabaikan `speed`, tag emosi per scene lewat `VO_TEXT`), satu klip per scene dengan id = id scene. Klip mentah di `out/vo-raw/AiNativeSdlc/`, hasil olahan di `voiceover/*.mp3`. Setelah itu durasi scene dan cue ikut audio secara otomatis; cek ulang frasa di `at(...)`. Untuk satu scene saja: `node scripts/vo-process.mjs <id> out/vo-raw/AiNativeSdlc/<id>.mp3 --hash <hash> --video AiNativeSdlc`.

```bash
npx remotion render src/index.ts AiNativeSdlc-Reels out/AiNativeSdlc-Reels.mp4
```

## Caption

Anthropic menjelaskan AI-native SDLC: bukan sekadar agen yang menulis kode. Alurnya jadi loop, tiap tahap meninggalkan satu file di Git, dan manusia tetap memegang keputusan.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
