import type { BlockMeta } from "../../block-reels";

// AI Bilang Selesai, Menurut Siapa?. Reels block 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ada di scenes.ts.

// Judul tampil di kartu atas hanya selama scene pertama. highlight = satu frasa di dalam judul yang diwarnai oranye (opsional).
export const META: BlockMeta = {
  title: "AI Bilang Selesai, Menurut Siapa?",
  highlight: "Selesai",
};

export const CAPTION = "AI berhenti saat promptnya habis, bukan saat masalahmu selesai. Tulis dulu seperti apa selesai itu sebelum minta. Follow kalau mau contoh brief-nya.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;
