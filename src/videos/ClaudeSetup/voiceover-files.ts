// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.
import f0 from "./voiceover/cta.mp3";
import f1 from "./voiceover/hasil.mp3";
import f2 from "./voiceover/hook.mp3";
import f3 from "./voiceover/install.mp3";
import f4 from "./voiceover/konteks.mp3";
import f5 from "./voiceover/pakai.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "cta": f0,
  "hasil": f1,
  "hook": f2,
  "install": f3,
  "konteks": f4,
  "pakai": f5,
};
