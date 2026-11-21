import type { BlockMeta, VoEntry, VoSettings } from "../../block-reels";
import manifest from "./voiceover.json";

// Belajar AI #5: AI Bisa Ngarang dengan Percaya Diri. Reels block 9:16, 30 fps, pemeran: ganjar, robot. Data scene dan baris ada di scenes.ts.

// Judul tampil di kartu atas hanya selama scene pertama. highlight = satu frasa di dalam judul yang diwarnai oranye (opsional).
export const META: BlockMeta = {
  title: "Belajar AI #5: AI Bisa Ngarang dengan Percaya Diri",
  highlight: "Ngarang",
  // Jeda lebih rapat dari bawaan supaya durasi total tidak melewati batas Reels.
  voGap: 0.15,
  voTail: 0.4,
};

// Voiceover per baris ucapan (id klip = id scene + nomor urut, mis. hook-01), suara per karakter dari src/dialog-reels/voices.json.
// eleven_v4 membaca tag emosi `[tag]` per baris (lihat scenes.ts). Selama voiceover.json kosong, durasi scene mengikuti perkiraan di scenes.ts.
export const VO_SETTINGS: VoSettings = { model: "eleven_v4", speed: null };
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;

export const CAPTION = "Yakin bukan bukti benar. AI bisa ngarang dengan percaya diri, jadi hal penting wajib dicek. Belajar AI #5 dari 15.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;
