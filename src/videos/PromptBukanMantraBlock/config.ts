import type { BlockMeta, VoEntry, VoSettings } from "../../block-reels";
import manifest from "./voiceover.json";

// Belajar AI #2: Prompt Itu Bukan Mantra. Reels block 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ada di scenes.ts.

// Judul tampil di kartu atas hanya selama scene pertama. highlight = satu frasa di dalam judul yang diwarnai oranye (opsional).
export const META: BlockMeta = {
  title: "Belajar AI #2: Prompt Itu Bukan Mantra",
  highlight: "Bukan Mantra",
};

// Voiceover per baris ucapan (id klip = id scene + nomor urut, mis. hook-01), suara per karakter dari src/dialog-reels/voices.json.
// eleven_v4 membaca tag emosi `[tag]` per baris (lihat scenes.ts). Selama voiceover.json kosong, durasi scene mengikuti perkiraan di scenes.ts.
export const VO_SETTINGS: VoSettings = { model: "eleven_v4", speed: null };
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;

export const CAPTION = "Prompt bukan mantra, prompt itu briefing. Empat bagian: Peran, Tugas, Konteks, Format. Belajar AI #2 dari 15.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;
