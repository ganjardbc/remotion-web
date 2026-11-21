import { lineId, type VoEntry } from "../dialog-reels/voiceover";
import type { BlockMeta, BlockScene } from "./types";

// Voiceover Reels block: durasi baris diganti durasi audio asli (voiceover.json), baris tidak mulai sebelum `from` dan digeser maju
// bila baris sebelumnya belum selesai. Bila semua baris scene sudah bersuara, durasi scene mengikuti audio (baris terakhir selesai + ekor);
// bila belum, `seconds` jadi batas bawah. Id klip = id scene + nomor urut (hook-01), sama dengan Reels dialog; suara per karakter dari
// src/dialog-reels/voices.json, dibuat lewat scripts/vo-generate.mjs.
// Bawaan; `BlockMeta.voGap` dan `voTail` menggantinya per video (jeda antar baris dan ekor scene, detik).
const GAP = 0.25;
const TAIL = 0.6;

export const fitBlockScenes = (scenes: readonly BlockScene[], manifest: Readonly<Record<string, VoEntry>>, files: Readonly<Record<string, string>>, meta?: Pick<BlockMeta, "voGap" | "voTail">): readonly BlockScene[] =>
  scenes.map((s) => {
    const gap = meta?.voGap ?? GAP;
    const tail = meta?.voTail ?? TAIL;
    let cursor = 0;
    const lines = s.lines.map((l, i) => {
      const id = lineId(s.id, i);
      const e = manifest[id];
      const from = Math.max(l.from, cursor);
      const dur = e ? e.duration : l.dur;
      cursor = from + dur + gap;
      return e ? { ...l, id, from, dur, vo: files[id] } : { ...l, id, from };
    });
    const end = lines.reduce((m, l) => Math.max(m, l.from + l.dur), 0);
    const voiced = lines.length > 0 && lines.every((l) => l.vo);
    return { ...s, lines, seconds: voiced ? end + tail : Math.max(s.seconds, end + tail) };
  });
