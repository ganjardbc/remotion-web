import type React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { CTA_START, CTA_VO_ID, FPS, HOOK_VO_AT, HOOK_VO_ID, LINES, LINE_START } from "./config";
import { voFile } from "./voiceover";

// Sound effect untuk "Programmer Jadi Bodoh Karena Claude". Semua waktu diturunkan dari config.ts,
// jadi ikut bergeser kalau naskah diubah. File ada di public/sfx/<set>/.
//   synth: dibuat lewat skrip (tanpa lisensi). free: efek CC0 dari Openverse (lihat public/sfx/free/LICENSES.md).
export type SfxSet = "synth" | "free";

type Event = "pop_ganjar" | "pop_claude" | "typing" | "whoosh" | "scratch" | "boing" | "sad" | "rimshot" | "ding";

const FILES: Record<SfxSet, Partial<Record<Event, string>>> = {
  synth: {
    pop_ganjar: "pop_ganjar.wav",
    pop_claude: "pop_claude.wav",
    typing: "typing_bed.wav",
    whoosh: "whoosh.wav",
    scratch: "record_scratch.wav",
    boing: "boing.wav",
    sad: "sad_trombone.wav",
    rimshot: "ba_dum_tss.wav",
    ding: "ding.wav",
  },
  free: {
    pop_ganjar: "pop_ganjar.wav",
    pop_claude: "pop_claude.wav",
    typing: "typing_bed.wav",
    whoosh: "whoosh.wav",
    scratch: "record_scratch.wav",
    boing: "boing.wav",
    rimshot: "ba_dum_tss.wav",
  },
};

type Cue = { readonly event: Event; readonly at: number; readonly volume: number; readonly frames?: number };

const sec = (s: number): number => Math.round(s * FPS);

const buildCues = (): readonly Cue[] => {
  const cues: Cue[] = [{ event: "whoosh", at: 0, volume: 0.5 }];
  LINES.forEach((l, i) => {
    const start = LINE_START[i];
    // Pop dialog hanya bila baris belum punya voice over; ketikan dikecilkan supaya tidak menimpa suara.
    if (!voFile(l.id)) cues.push({ event: l.who === "robot" ? "pop_claude" : "pop_ganjar", at: start, volume: 0.55 });
    cues.push({ event: "typing", at: start + 3, volume: voFile(l.id) ? 0.08 : 0.35, frames: Math.round(l.speech * FPS * 0.85) });
  });
  cues.push({ event: "boing", at: LINE_START[2] + sec(LINES[2].speech), volume: 0.4 });
  cues.push({ event: "scratch", at: LINE_START[7], volume: 0.4 });
  cues.push({ event: "sad", at: LINE_START[9] + sec(LINES[9].speech), volume: 0.4 });
  cues.push({ event: "rimshot", at: LINE_START[10] + sec(LINES[10].speech), volume: 0.6 });
  cues.push({ event: "whoosh", at: CTA_START, volume: 0.5 });
  cues.push({ event: "ding", at: CTA_START + sec(0.6), volume: 0.45 });
  return cues;
};

const CUES = buildCues();

// Voice over: satu klip per baris, dimulai pada frame awal baris.
const VOICES: readonly { readonly id: string; readonly at: number }[] = [
  { id: HOOK_VO_ID, at: sec(HOOK_VO_AT) },
  ...LINES.map((l, i) => ({ id: l.id, at: LINE_START[i] })),
  { id: CTA_VO_ID, at: CTA_START + sec(0.2) },
];

export const Sfx: React.FC<{ readonly set?: SfxSet }> = ({ set = "synth" }) => (
  <>
    {VOICES.map((v) => {
      const file = voFile(v.id);
      return file ? <Audio key={v.id} src={file} from={v.at} volume={1} /> : null;
    })}
    {CUES.map((c, i) => {
      const file = FILES[set][c.event] ?? FILES.synth[c.event];
      if (!file) return null;
      const dir = FILES[set][c.event] ? set : "synth";
      return (
        <Audio
          key={i}
          src={staticFile(`sfx/${dir}/${file}`)}
          from={c.at}
          volume={c.volume}
          {...(c.frames ? { durationInFrames: c.frames } : {})}
        />
      );
    })}
  </>
);
