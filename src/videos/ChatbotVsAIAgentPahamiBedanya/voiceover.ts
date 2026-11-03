import manifest from "./voiceover.json";
import type { VoEntry } from "../../draft-kit";

// Dipakai scripts/vo-lines.mjs dan vo-generate.mjs. Suara, model, dan id baris ada di src/draft-kit/voiceover.ts.
export { lineId, ttsText, VO_MODEL, VO_SPEED, VO_VOICES } from "../../draft-kit/voiceover";
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
