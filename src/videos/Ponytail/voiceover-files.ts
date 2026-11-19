// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.
import f0 from "./voiceover/cara.mp3";
import f1 from "./voiceover/case.mp3";
import f2 from "./voiceover/closing.mp3";
import f3 from "./voiceover/cta.mp3";
import f4 from "./voiceover/hook.mp3";
import f5 from "./voiceover/manfaat.mp3";
import f6 from "./voiceover/relate.mp3";
import f7 from "./voiceover/shift.mp3";
import f8 from "./voiceover/urgency.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "cara": f0,
  "case": f1,
  "closing": f2,
  "cta": f3,
  "hook": f4,
  "manfaat": f5,
  "relate": f6,
  "shift": f7,
  "urgency": f8,
};
