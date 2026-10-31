# KurikulumAIEngineerGratis542PelajaranDar

"Kurikulum AI Engineer Gratis: 542 Pelajaran dari Nol": reels 9:16 (1080x1920, 30 fps), 7 scene, narator Claude Code (rig 2D), tema gh, tata letak seperti Haiku55 (panel visual di atas, karakter di bawah). Komposisi `KurikulumAIEngineerGratis542PelajaranDar-Reels` di `src/Root.tsx`. Dibuat dari draft content_studio (content_studio belajar-jadi-ai-engineer-20261029-191216) dengan `scripts/from-draft.mjs`, dirender oleh `src/videos/DraftKit`.

- `config.ts`: id scene, durasi scene dari audio, `when(scene, frasa)` = perkiraan waktu cue visual dari posisi frasa di teks ucapan.
- `visuals.tsx`, `parts.tsx`: visual tiap scene dan komponen bersama. `KurikulumAIEngineerGratis542PelajaranDarVideo.tsx`: Series scene, karakter, footer, suara.
- `scenes.ts`: data scene (latar, waktu, pemeran, teks layar, baris ucapan, `note` = arahan visual dari draft).
- `voiceover.ts`, `voiceover.json`, `voiceover-files.ts`, `voiceover/`: voice over ElevenLabs. Suara per karakter untuk video ini di `voiceover.ts`; daftar suara dan model di `DraftKit/voices.json`.

## Langkah

1. Periksa `spoken` di `scenes.ts` untuk baris berangka atau berisi singkatan. Cek satu frame: `npx remotion still src/index.ts KurikulumAIEngineerGratis542PelajaranDar-Reels out/KurikulumAIEngineerGratis542PelajaranDar.png --frame=60`.
2. Voice over: `node scripts/vo-generate.mjs --video KurikulumAIEngineerGratis542PelajaranDar` menampilkan baris yang perlu dibuat dan jumlah hurufnya, lalu meminta konfirmasi sebelum memanggil ElevenLabs.
3. Render: `npx remotion render src/index.ts KurikulumAIEngineerGratis542PelajaranDar-Reels out/KurikulumAIEngineerGratis542PelajaranDar-Reels.mp4`.
