import manifest from "./voiceover.json";
import type { VoEntry } from "../../draft-kit";
import { voicesWith } from "../../draft-kit/voiceover";

// Dipakai scripts/vo-lines.mjs dan vo-generate.mjs. Model dan id baris ada di src/draft-kit/voiceover.ts, daftar suara di
// src/draft-kit/voices.json. VO_VOICES = suara bawaan, ditimpa pilihan untuk video ini.
export { lineId, ttsText, VO_MODEL, VO_SPEED } from "../../draft-kit/voiceover";
export const VO_VOICES = voicesWith({});
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
