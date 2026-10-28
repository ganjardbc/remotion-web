import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";
import type { Line } from "./world";

// Voice over ElevenLabs untuk video Vue. Teks tiap baris dikirim ke TTS lewat Claude (konektor ElevenLabs), hasilnya
// diolah scripts/vo-process.py ke voiceover/<id>.mp3 (di folder video ini) dan dicatat di voiceover.json. Selama berkas belum ada,
// video memakai durasi dialog tulisan tangan dan pop SFX; setelah ada, durasi dan waktu mulai mengikuti audio asli.

export const VO_MODEL = "eleven_v4";
export const VO_VOICES = {
  ganjar: { id: "Se50W0zoqlDUbFxvcN9h", name: "Ari Eko" },
  robot: { id: "NPDHDOOQCSyifTJZOe6J", name: "Nilasari" },
} as const;

export type VoEntry = { readonly hash: string; readonly file: string; readonly duration: number };
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;

// Id stabil baris: id scene + nomor urut (mulai 01).
export const lineId = (sceneId: string, index: number): string => `${sceneId}-${String(index + 1).padStart(2, "0")}`;

// Teks yang dikirim ke TTS: tag audio (bila ada) lalu teks yang diucapkan.
export const ttsText = (l: Pick<Line, "tag" | "spoken" | "text">): string => `${l.tag ? `[${l.tag}] ` : ""}${l.spoken ?? l.text}`;

// Jeda minimal antar baris dalam satu scene, dan ekor kecil agar caption tidak hilang tepat di huruf terakhir.
const GAP = 0.25;
const TAIL = 0.1;

// Muat per scene: durasi baris diganti durasi audio asli; baris tidak boleh mulai sebelum waktu tulisan tangannya
// (jangkar ke sisipan dan gerak) dan digeser maju bila baris sebelumnya belum selesai. Baris tanpa audio memakai
// durasi tulisan tangan tapi ikut digeser bila perlu.
export const fitLines = (sceneId: string, lines: readonly Line[]): readonly Line[] => {
  let cursor = 0;
  return lines.map((l, i) => {
    const id = lineId(sceneId, i);
    const e = VO_MANIFEST[id];
    const from = Math.max(l.from, cursor);
    if (!e) {
      // Belum ada audio: durasi tulisan tangan, tapi tetap tidak boleh menimpa baris sebelumnya yang sudah memanjang.
      cursor = from + l.dur + GAP;
      return { ...l, id, from };
    }
    cursor = from + e.duration + GAP;
    return { ...l, id, from, dur: e.duration + TAIL, vo: VO_FILES[id] };
  });
};
