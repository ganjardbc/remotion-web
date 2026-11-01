import { BEATS, timeBeat } from "./config";

// Daftar baris voice over untuk scripts/vo-lines.mjs. Naskah dan waktu tetap di config.ts.
export const BASE_SCENES = BEATS.map((b) => ({ id: b.id, lines: timeBeat(b).lines }));
