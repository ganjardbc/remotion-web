import type { BlockMeta, VoEntry, VoSettings } from "../../block-reels";
import manifest from "./voiceover.json";

// Selesai itu Keputusanmu, Bukan AI!. Reels block 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ada di scenes.ts.

// Judul tampil di kartu atas hanya selama scene pertama. highlight = satu frasa di dalam judul yang diwarnai oranye (opsional).
export const META: BlockMeta = {
  title: "Selesai itu Keputusanmu, Bukan AI!",
  highlight: "Keputusanmu",
};

// Voiceover per baris ucapan (id klip = id scene + nomor urut, mis. hook-01), suara per karakter dari src/dialog-reels/voices.json.
// eleven_v4 membaca tag emosi `[tag]` per baris (lihat scenes.ts); speed bawaan model, tidak dipercepat. Selama voiceover.json kosong,
// durasi scene mengikuti perkiraan di scenes.ts.
export const VO_SETTINGS: VoSettings = { model: "eleven_v4", speed: null };
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;

export const CAPTION = "AI berhenti saat promptnya habis, bukan saat masalahmu selesai. Sebelum minta, tulis apa yang harus jalan, cara mengecek, dan apa yang tidak boleh rusak. Follow kalau mau terus melatih cara menilai kerja AI.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;
