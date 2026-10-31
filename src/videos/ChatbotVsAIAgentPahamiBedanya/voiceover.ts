import manifest from "./voiceover.json";
import type { VoEntry } from "../DraftKit";

// Dipakai scripts/vo-lines.mjs dan vo-generate.mjs. Suara, model, dan id baris ada di DraftKit/voiceover.ts.
export { lineId, ttsText, VO_MODEL, VO_SPEED, VO_VOICES } from "../DraftKit/voiceover";
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
