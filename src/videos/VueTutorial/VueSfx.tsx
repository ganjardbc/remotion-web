import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { SCENES, SCENE_STARTS, VUE_TUTORIAL_FRAMES } from "./scenes";
import type { SfxEvent } from "./sfxTypes";

// Efek suara dan musik latar video Vue. Semua waktu diturunkan dari data scene (dialog, gerak, sisipan, `cues`),
// jadi ikut bergeser kalau naskah diubah. Efek dari public/sfx (set `free`, dengan `synth` untuk yang tidak ada);
// musik dibuat scripts/make-vue-bed.py.

const FPS = 30;

const FILES: Record<SfxEvent, string> = {
  pop_ganjar: "free/pop_ganjar.wav",
  pop_claude: "free/pop_claude.wav",
  typing: "free/typing_bed.wav",
  whoosh: "free/whoosh.wav",
  scratch: "free/record_scratch.wav",
  boing: "free/boing.wav",
  sad: "synth/sad_trombone.wav",
  rimshot: "free/ba_dum_tss.wav",
  ding: "synth/ding.wav",
};

type Cue = { readonly event: SfxEvent; readonly at: number; readonly volume: number; readonly frames?: number };

const buildCues = (): readonly Cue[] => {
  const cues: Cue[] = [];
  SCENES.forEach((s, i) => {
    const base = SCENE_STARTS[i];
    const f = (sec: number): number => base + Math.round(sec * FPS);
    // Whoosh di awal tiap transisi antar scene.
    if (i > 0) cues.push({ event: "whoosh", at: base, volume: 0.35 });
    // Pop dialog hanya bila baris belum punya voice over (suara asli menggantikannya).
    for (const l of s.lines) if (!l.vo) cues.push({ event: l.who === "robot" ? "pop_claude" : "pop_ganjar", at: f(l.from), volume: 0.5 });
    for (const ins of s.inserts) {
      cues.push({ event: "whoosh", at: f(ins.from), volume: 0.22 });
      // Ketikan hanya selama isi sisipan benar-benar mengetik (perintah terminal, kode di editor), bukan sepanjang sisipan.
      for (const w of ins.typing ?? []) cues.push({ event: "typing", at: f(ins.from + w.at), volume: 0.32, frames: Math.max(6, Math.round(w.dur * FPS)) });
    }
    for (const c of s.cues ?? []) cues.push({ event: c.event, at: f(c.at), volume: c.volume ?? 0.4 });
  });
  return cues;
};

export const CUES = buildCues();

// Jendela dialog dalam frame global, untuk menurunkan volume musik saat ada yang bicara.
const SPEECH: readonly (readonly [number, number])[] = SCENES.flatMap((s, i) =>
  s.lines.map((l) => [SCENE_STARTS[i] + Math.round(l.from * FPS), SCENE_STARTS[i] + Math.round((l.from + l.dur) * FPS)] as const),
);

const MUSIC_HIGH = 0.2;
const MUSIC_LOW = 0.085;

// Volume musik pada frame global f: turun halus di sekitar dialog, naik di sela-selanya, fade in dan fade out di ujung.
export const musicVolume = (f: number): number => {
  let d = Infinity;
  for (const [a, b] of SPEECH) d = Math.min(d, f < a ? a - f : f > b ? f - b : 0);
  const duck = interpolate(d, [0, 14], [MUSIC_LOW, MUSIC_HIGH], { extrapolateRight: "clamp" });
  const fade = interpolate(f, [0, 45, VUE_TUTORIAL_FRAMES - 75, VUE_TUTORIAL_FRAMES], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return duck * fade;
};

// Voice over: satu klip per baris, dimulai pada frame awal baris (waktu sudah dimuat ke durasi audio asli).
const VOICES = SCENES.flatMap((s, i) => s.lines.filter((l) => l.vo).map((l) => ({ id: l.id ?? "", file: l.vo ?? "", at: SCENE_STARTS[i] + Math.round(l.from * FPS) })));

export const VueSfx: React.FC = () => (
  <>
    {VOICES.map((v) => (
      <Audio key={v.id} src={staticFile(v.file)} from={v.at} volume={1} />
    ))}
    <Audio
      src={staticFile("music/vue_bed.mp3")}
      loop
      loopVolumeCurveBehavior="extend"
      volume={musicVolume}
    />
    {CUES.map((c, i) => (
      <Audio key={i} src={staticFile(`sfx/${FILES[c.event]}`)} from={c.at} volume={c.volume} {...(c.frames ? { durationInFrames: c.frames, loop: true } : {})} />
    ))}
  </>
);
