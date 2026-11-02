# PromptPanjang

"Prompt Panjang Itu Tanda Malas": reels 9:16 (1080x1920, 30 fps), Format A (opini), 7 scene, komposisi `PromptPanjang-Reels` di `src/Root.tsx`. **Satu konten tuntas, tanpa lanjutan:** kalimat urgency "ini baru bagian pertama" langsung dibayar di scene `cara` (tulis masalah dalam 2 kalimat), jadi tidak ada janji yang menggantung. Alur: Hook, Relate, Shift, Urgency, Cara, Closing, CTA. Sudut pandang: prompt panjang sering menyembunyikan pikiran yang belum jernih. Karakter narator: Claude Code (rig 2D). Pola file sama dengan `ClaudeMem` dan `ReviewKodeAI`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: tujuh scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari `ClaudeMem`.
- `PromptPanjangVideo.tsx`: `Series` scene, karakter (ekspresi per scene), `BrandFooter` sekali di root, suara.

## Voiceover

Sudah dibuat (2 November 2026): ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2, satu klip per scene dengan id = id scene, 711 huruf (klip `shift` dibuat ulang sekali). Klip mentah di `out/vo-raw/PromptPanjang/` (tidak di-commit), hasil olahan di `voiceover/*.mp3`, dicatat di `voiceover.json` (hash = sha1 `voiceId|model|teks`, 12 huruf pertama) dan `voiceover-files.ts`. Durasi scene dan cue kini mengikuti audio (±50 detik).

Kalau `SPOKEN` berubah, generate ulang klip scene itu saja dan olah dengan:

```bash
python3 scripts/vo-process.py <id> out/vo-raw/PromptPanjang/<id>.mp3 --hash <hash> --video PromptPanjang
```

Lalu cek frasa di `at(...)` dan `when(...)`.

```bash
npx remotion render src/index.ts PromptPanjang-Reels out/PromptPanjang-Reels.mp4
```

## Caption

Prompt lima ratus kata bukan tanda jago. Sering itu tanda pikirannya belum jernih. Tulis masalahnya dalam dua kalimat dulu.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
