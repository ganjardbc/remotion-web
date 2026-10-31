# ChatbotVsAIAgentPahamiBedanya

"Chatbot vs AI Agent: Pahami Bedanya!": reels 9:16 (1080x1920, 30 fps), 5 scene, dialog ganjar, robot, gaya rig. Komposisi `ChatbotVsAIAgentPahamiBedanya-Reels` di `src/Root.tsx`. Dibuat dari draft content_studio (content_studio chatbot-vs-ai-agent-20261029-134735) dengan `scripts/from-draft.mjs`, dirender oleh `src/videos/DraftKit`.

- `scenes.ts`: data scene (latar, waktu, pemeran, teks layar, baris ucapan, `note` = arahan visual dari draft).
- `voiceover.ts`, `voiceover.json`, `voiceover-files.ts`, `voiceover/`: voice over ElevenLabs. Suara dan model di `DraftKit/voiceover.ts`.

## Langkah

1. Periksa `spoken` di `scenes.ts` untuk baris berangka atau berisi singkatan. Cek satu frame: `npx remotion still src/index.ts ChatbotVsAIAgentPahamiBedanya-Reels out/ChatbotVsAIAgentPahamiBedanya.png --frame=60`.
2. Voice over: `node scripts/vo-generate.mjs --video ChatbotVsAIAgentPahamiBedanya` menampilkan baris yang perlu dibuat dan jumlah hurufnya, lalu meminta konfirmasi sebelum memanggil ElevenLabs.
3. Render: `npx remotion render src/index.ts ChatbotVsAIAgentPahamiBedanya-Reels out/ChatbotVsAIAgentPahamiBedanya-Reels.mp4`.
