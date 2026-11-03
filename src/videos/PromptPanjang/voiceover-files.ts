// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.
import f0 from "./voiceover/cara.mp3";
import f1 from "./voiceover/closing.mp3";
import f2 from "./voiceover/cta.mp3";
import f3 from "./voiceover/hook.mp3";
import f4 from "./voiceover/relate.mp3";
import f5 from "./voiceover/shift.mp3";
import f6 from "./voiceover/urgency.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "cara": f0,
  "closing": f1,
  "cta": f2,
  "hook": f3,
  "relate": f4,
  "shift": f5,
  "urgency": f6,
};
