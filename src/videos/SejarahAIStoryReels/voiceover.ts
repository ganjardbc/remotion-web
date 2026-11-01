import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

// Voice over ElevenLabs, pola sama dengan ProgrammerBodoh: dua suara berbeda supaya terdengar seperti ngobrol.
// Dibuat lewat `node scripts/vo-generate.mjs --video SejarahAIStoryReels`, hasilnya di voiceover/<id>.mp3 dan voiceover.json.
// Selama berkas belum ada, video memakai durasi perkiraan di config.ts; setelah ada, durasi mengikuti audio asli.

export const VO_MODEL = "eleven_v4";
export const VO_VOICES = {
  ganjar: { id: "Se50W0zoqlDUbFxvcN9h", name: "Ari Eko" },
  robot: { id: "NPDHDOOQCSyifTJZOe6J", name: "Nilasari" },
} as const;

export type VoEntry = { readonly hash: string; readonly file: string; readonly duration: number };
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;

// Id stabil baris: id scene + nomor urut (mulai 01).
export const lineId = (sceneId: string, index: number): string => `${sceneId}-${String(index + 1).padStart(2, "0")}`;

// Teks yang dikirim ke TTS: tag audio (bila ada) lalu teks yang diucapkan, tanpa tanda sorot *...*.
// `spoken` dipakai bila ucapan beda dari caption: singkatan ditulis fonetis, tahun dan angka ditulis dengan kata.
export const ttsText = (l: { readonly tag?: string; readonly spoken?: string; readonly text: string }): string =>
  `${l.tag ? `[${l.tag}] ` : ""}${(l.spoken ?? l.text).replace(/\*/g, "")}`;

export const voDuration = (id: string): number | undefined => VO_MANIFEST[id]?.duration;
export const voFile = (id: string): string | undefined => VO_FILES[id];
