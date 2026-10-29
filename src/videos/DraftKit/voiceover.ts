import type { CharacterId, DraftLine, DraftScene } from "./types";
import voices from "./voices.json";

// Voice over ElevenLabs untuk video dari draft. Daftar suara, suara bawaan per karakter, model, dan speed ada di
// voices.json (juga dibaca content_studio); suara bisa diganti per video lewat `from-draft.mjs --voice`.
// scripts/vo-generate.mjs memanggil API-nya, scripts/vo-process.py mengolah hasilnya ke voiceover/<id>.mp3 di folder
// video dan mencatatnya di voiceover.json.

export type Voice = { readonly id: string; readonly name: string };

export const VO_MODEL: string = voices.model;
export const VO_SPEED: number = voices.speed;

const voiceOf = (id: string): Voice => {
  const v = voices.voices.find((x) => x.id === id);
  if (!v) throw new Error(`Suara ${id} tidak ada di DraftKit/voices.json`);
  return v;
};

// Suara bawaan per karakter, ditimpa `overrides` (karakter -> id suara) bila ada.
export const voicesWith = (overrides: Readonly<Partial<Record<CharacterId, string>>>): Readonly<Record<CharacterId, Voice>> =>
  Object.fromEntries(
    Object.entries(voices.defaults).map(([who, id]) => [who, voiceOf(overrides[who as CharacterId] ?? id)]),
  ) as Record<CharacterId, Voice>;

export const VO_VOICES = voicesWith({});

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
