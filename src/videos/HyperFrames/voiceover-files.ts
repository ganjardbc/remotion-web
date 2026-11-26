// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.
import f0 from "./voiceover/agen.mp3";
import f1 from "./voiceover/cta.mp3";
import f2 from "./voiceover/hook.mp3";
import f3 from "./voiceover/init.mp3";
import f4 from "./voiceover/install.mp3";
import f5 from "./voiceover/konteks.mp3";
import f6 from "./voiceover/pakai.mp3";
import f7 from "./voiceover/syarat.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "agen": f0,
  "cta": f1,
  "hook": f2,
  "init": f3,
  "install": f4,
  "konteks": f5,
  "pakai": f6,
  "syarat": f7,
};
