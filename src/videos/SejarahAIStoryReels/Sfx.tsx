import type React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { BEATS, BEAT_START, FPS, timeBeat } from "./config";
import { voFile } from "./voiceover";

// Audio video: satu klip voice over per baris, plus whoosh pelan di tiap pergantian scene.
// Semua waktu diturunkan dari config.ts, jadi ikut bergeser kalau naskah diubah.
const VOICES: readonly { readonly id: string; readonly at: number }[] = BEATS.flatMap((beat, i) =>
  timeBeat(beat).lines.map((l) => ({ id: l.id, at: BEAT_START[i] + Math.round(l.at * FPS) })),
);

export const Sfx: React.FC = () => (
  <>
    {VOICES.map((v) => {
      const file = voFile(v.id);
      return file ? <Audio key={v.id} src={file} from={v.at} volume={1} /> : null;
    })}
    {BEAT_START.map((at) => (
      <Audio key={at} src={staticFile("sfx/free/whoosh.wav")} from={at} volume={0.3} />
    ))}
  </>
);
