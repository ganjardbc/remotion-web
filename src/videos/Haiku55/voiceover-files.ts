// Dibuat otomatis oleh scripts/vo-process.py. Jangan diubah tangan.
import f0 from "./voiceover/closing.mp3";
import f1 from "./voiceover/context.mp3";
import f2 from "./voiceover/cta.mp3";
import f3 from "./voiceover/fast.mp3";
import f4 from "./voiceover/hook.mp3";
import f5 from "./voiceover/intro.mp3";
import f6 from "./voiceover/relate.mp3";
import f7 from "./voiceover/teaser.mp3";
import f8 from "./voiceover/volume.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "closing": f0,
  "context": f1,
  "cta": f2,
  "fast": f3,
  "hook": f4,
  "intro": f5,
  "relate": f6,
  "teaser": f7,
  "volume": f8,
};
