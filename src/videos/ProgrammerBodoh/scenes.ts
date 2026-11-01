import { CTA_LINE, HOOK_LINE, LINES } from "./config";

// Daftar baris voice over untuk scripts/vo-lines.mjs. Naskah dan waktu tetap di config.ts.
export const BASE_SCENES = [
  { id: "hook", lines: [{ ...HOOK_LINE, dur: 2.4 }] },
  { id: "chat", lines: LINES.map((l) => ({ ...l, dur: l.seconds })) },
  { id: "cta", lines: [{ ...CTA_LINE, dur: 3.6 }] },
] as const;
