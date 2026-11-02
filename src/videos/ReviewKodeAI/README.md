# ReviewKodeAI

"Review Kode AI Kamu Bohong": reels 9:16 (1080x1920, 30 fps), Format A (opini), 6 scene, komposisi `ReviewKodeAI-Reels` di `src/Root.tsx`. Satu konten tuntas. Alur: Hook, Relate, Shift, Urgency (kalimat "ini baru bagian pertama"), Closing, CTA. Sudut pandang: tes hijau cuma membuktikan AI paham tesnya, bukan paham masalahmu, karena kode dan tesnya ditulis AI yang sama. Karakter narator: Claude Code (rig 2D). Pola file sama dengan `ClaudeMem`.

- `config.ts`: teks ucapan (`SPOKEN`, singkatan dieja fonetis "Ei Ai"), caption dan 5 hashtag, durasi scene, `at(scene, frasa)`.
- `scenes.tsx`: enam scene. Cue ditulis sebagai frasa dari `SPOKEN`.
- `parts.tsx`: salinan komponen dari `ClaudeMem` (`Frame`, `Headline`, `Card`, `Chip`, `Grow`, `useCue`).
- `ReviewKodeAIVideo.tsx`: `Series` scene, karakter (ekspresi per scene), `BrandFooter` sekali di root, suara.

## Voiceover (belum dibuat)

Selama `voiceover.json` kosong, durasi scene diperkirakan 15,3 huruf/detik (±43 detik) dan video tanpa suara narasi. Generate dengan ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2, satu klip per scene dengan id = id scene, lalu:

```bash
python3 scripts/vo-process.py <id> out/vo-raw/ReviewKodeAI/<id>.mp3 --hash <hash> --video ReviewKodeAI
```

Setelah itu durasi scene dan cue ikut audio secara otomatis. Kalau `SPOKEN` berubah, cek frasa di `at(...)` dan `when(...)`.

```bash
npx remotion render src/index.ts ReviewKodeAI-Reels out/ReviewKodeAI-Reels.mp4
```

## Caption

Tes hijau belum tentu berarti kodenya benar. Kalau AI menulis kode dan tesnya sekaligus, yang diuji cuma dirinya sendiri.

`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`
