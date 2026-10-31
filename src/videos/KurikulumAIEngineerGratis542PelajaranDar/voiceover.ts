import manifest from "./voiceover.json";
import type { VoEntry } from "../DraftKit";
import { voicesWith } from "../DraftKit/voiceover";

// Dipakai scripts/vo-lines.mjs dan vo-generate.mjs. Model dan id baris ada di DraftKit/voiceover.ts, daftar suara di
// DraftKit/voices.json. VO_VOICES = suara bawaan, ditimpa pilihan untuk video ini.
export { lineId, ttsText, VO_MODEL, VO_SPEED } from "../DraftKit/voiceover";
export const VO_VOICES = voicesWith({});
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
