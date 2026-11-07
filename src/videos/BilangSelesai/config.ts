import type { BlockMeta } from "../../block-reels";

// Selesai itu Keputusanmu, Bukan AI!. Reels block 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ada di scenes.ts.

// Judul tampil di kartu atas hanya selama scene pertama. highlight = satu frasa di dalam judul yang diwarnai oranye (opsional).
export const META: BlockMeta = {
  title: "Selesai itu Keputusanmu, Bukan AI!",
  highlight: "Keputusanmu",
};

export const CAPTION = "AI berhenti saat promptnya habis, bukan saat masalahmu selesai. Sebelum minta, tulis apa yang harus jalan, cara mengecek, dan apa yang tidak boleh rusak. Follow kalau mau terus melatih cara menilai kerja AI.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;
