import type { BlockMeta } from "../../block-reels";

// Asisten yang Selalu Setuju. Reels block 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ada di scenes.ts.

// Judul tampil di kartu atas hanya selama scene pertama. highlight = satu frasa di dalam judul yang diwarnai oranye (opsional).
export const META: BlockMeta = {
  title: "Asisten yang Selalu Setuju",
  highlight: "Selalu Setuju",
};

export const CAPTION = "AI-mu selalu bilang 'ide bagus'? Itu bukan tanda idemu bagus. Minta dia membantah, baru kamu tahu isinya.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;
