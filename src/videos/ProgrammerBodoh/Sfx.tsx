import type React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { CTA_START, FPS, LINES, LINE_START } from "./config";

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
    cues.push({ event: l.who === "robot" ? "pop_claude" : "pop_ganjar", at: start, volume: 0.55 });
    // Ketikan selama teks muncul (60% durasi kalimat, sama dengan efek ketik di chat).
    cues.push({ event: "typing", at: start + 3, volume: 0.35, frames: Math.round(l.seconds * FPS * 0.6) });
  });
  cues.push({ event: "boing", at: LINE_START[2] + sec(1.6), volume: 0.5 });
  cues.push({ event: "scratch", at: LINE_START[7], volume: 0.6 });
  cues.push({ event: "sad", at: LINE_START[9] + sec(1.6), volume: 0.5 });
  cues.push({ event: "rimshot", at: LINE_START[10] + sec(1.1), volume: 0.65 });
  cues.push({ event: "whoosh", at: CTA_START, volume: 0.5 });
  cues.push({ event: "ding", at: CTA_START + sec(0.6), volume: 0.45 });
  return cues;
};

const CUES = buildCues();

export const Sfx: React.FC<{ readonly set?: SfxSet }> = ({ set = "synth" }) => (
  <>
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
