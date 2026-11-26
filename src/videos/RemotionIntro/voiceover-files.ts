// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.
import f0 from "./voiceover/agen.mp3";
import f1 from "./voiceover/closing.mp3";
import f2 from "./voiceover/cta.mp3";
import f3 from "./voiceover/hook.mp3";
import f4 from "./voiceover/install.mp3";
import f5 from "./voiceover/kode.mp3";
import f6 from "./voiceover/konteks.mp3";
import f7 from "./voiceover/render.mp3";

export const VO_FILES: Readonly<Record<string, string>> = {
  "agen": f0,
  "closing": f1,
  "cta": f2,
  "hook": f3,
  "install": f4,
  "kode": f5,
  "konteks": f6,
  "render": f7,
};
