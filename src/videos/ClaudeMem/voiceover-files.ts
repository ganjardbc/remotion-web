// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.
import f0 from "./voiceover/catat.mp3";
import f1 from "./voiceover/closing.mp3";
import f2 from "./voiceover/cta.mp3";
import f3 from "./voiceover/hook.mp3";
import f4 from "./voiceover/ingat.mp3";
import f5 from "./voiceover/pasang.mp3";
import f6 from "./voiceover/repo.mp3";
import f7 from "./voiceover/simpan.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "catat": f0,
  "closing": f1,
  "cta": f2,
  "hook": f3,
  "ingat": f4,
  "pasang": f5,
  "repo": f6,
  "simpan": f7,
};
