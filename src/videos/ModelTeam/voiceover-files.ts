// Dibuat otomatis oleh scripts/vo-process.py. Jangan diubah tangan.
import f0 from "./voiceover/closing.mp3";
import f1 from "./voiceover/cta.mp3";
import f2 from "./voiceover/haiku.mp3";
import f3 from "./voiceover/hook.mp3";
import f4 from "./voiceover/key.mp3";
import f5 from "./voiceover/opus.mp3";
import f6 from "./voiceover/relate.mp3";
import f7 from "./voiceover/sonnet.mp3";
import f8 from "./voiceover/team.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "closing": f0,
  "cta": f1,
  "haiku": f2,
  "hook": f3,
  "key": f4,
  "opus": f5,
  "relate": f6,
  "sonnet": f7,
  "team": f8,
};
