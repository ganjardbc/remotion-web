import type { CharacterId, DraftLine, DraftScene } from "./types";

// Voice over ElevenLabs untuk video dari draft. Suara per karakter sama dengan VueTutorial dan Haiku55; model dan
// speed sama dengan Haiku55 (eleven_v4 mengabaikan speed). scripts/vo-generate.mjs memanggil API-nya,
// scripts/vo-process.py mengolah hasilnya ke voiceover/<id>.mp3 di folder video dan mencatatnya di voiceover.json.

export const VO_MODEL = "eleven_multilingual_v2";
export const VO_SPEED = 1.2;
export const VO_VOICES: Readonly<Record<CharacterId, { readonly id: string; readonly name: string }>> = {
  ganjar: { id: "Se50W0zoqlDUbFxvcN9h", name: "Ari Eko" },
  robot: { id: "NPDHDOOQCSyifTJZOe6J", name: "Nilasari" },
  claudecode: { id: "NPDHDOOQCSyifTJZOe6J", name: "Nilasari" },
};

export type VoEntry = { readonly hash: string; readonly file: string; readonly duration: number };

// Id stabil baris: id scene + nomor urut (mulai 01).
export const lineId = (sceneId: string, index: number): string => `${sceneId}-${String(index + 1).padStart(2, "0")}`;

export const ttsText = (l: Pick<DraftLine, "spoken" | "text">): string => l.spoken ?? l.text;

// Jeda minimal antar baris, ekor setelah baris terakhir sebelum scene berganti.
const GAP = 0.25;
const TAIL = 0.6;

// Durasi baris diganti durasi audio asli; baris tidak mulai sebelum `from`-nya dan digeser maju bila baris
// sebelumnya belum selesai. Bila semua baris scene sudah bersuara, durasi scene mengikuti audio (baris terakhir
// selesai + TAIL); bila belum, `seconds` dari draft jadi batas bawah.
export const fitScenes = (
  scenes: readonly DraftScene[],
  manifest: Readonly<Record<string, VoEntry>>,
  files: Readonly<Record<string, string>>,
): readonly DraftScene[] =>
  scenes.map((s) => {
    let cursor = 0;
    const lines = s.lines.map((l, i) => {
      const id = lineId(s.id, i);
      const e = manifest[id];
      const from = Math.max(l.from, cursor);
      const dur = e ? e.duration : l.dur;
      cursor = from + dur + GAP;
      return e ? { ...l, id, from, dur, vo: files[id] } : { ...l, id, from };
    });
    const end = lines.reduce((m, l) => Math.max(m, l.from + l.dur), 0);
    const voiced = lines.length > 0 && lines.every((l) => l.vo);
    return { ...s, lines, seconds: voiced ? end + TAIL : Math.max(s.seconds, end + TAIL) };
  });

export const sceneFrames = (scenes: readonly DraftScene[], fps: number): readonly number[] => scenes.map((s) => Math.ceil(s.seconds * fps));
