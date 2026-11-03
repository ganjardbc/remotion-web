import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { focusPoint } from "./Stage";
import type { DraftScene } from "./types";

// Kamera panggung Reels dialog: membungkus Stage (teks layar, cutaway, dan caption tidak ikut bergerak).
// `ikuti`: zoom pelan dan geser ke karakter yang sedang bicara, berpindah 0,6 dtk tiap giliran berganti.
// `zoom` di scene (punch-in atau zoom out) menggantikan `ikuti` untuk scene itu. Gerak ease-out [0.2, 0.8, 0.2, 1].

const W = 1080;
const H = 1920;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const FOLLOW_ZOOM = 1.07;
const DRIFT = 0.02;
const DRIFT_SEC = 3;
const SWITCH = 0.6;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;

type Cam = { readonly x: number; readonly y: number; readonly s: number };
const CENTER: Cam = { x: W / 2, y: H / 2, s: 1 };

const follow = (scene: DraftScene, now: number): Cam => {
  const keys = scene.lines.filter((l) => l.from <= now);
  let state = CENTER;
  keys.forEach((k, i) => {
    const f = focusPoint(scene, k.who);
    const next = scene.lines[i + 1];
    const last = i === keys.length - 1;
    const target = { x: f.x, y: f.y, s: FOLLOW_ZOOM };
    if (last) {
      const p = EASE(interpolate(now - k.from, [0, SWITCH], [0, 1], clamp));
      const drift = DRIFT * Math.min(1, (now - k.from) / DRIFT_SEC) * p;
      state = { x: lerp(state.x, target.x, p), y: lerp(state.y, target.y, p), s: lerp(state.s, target.s, p) + drift };
    } else {
      const held = next ? Math.max(0, next.from - k.from) : DRIFT_SEC;
      state = { ...target, s: target.s + DRIFT * Math.min(1, held / DRIFT_SEC) };
    }
  });
  return state;
};

const punch = (scene: DraftScene, frame: number, total: number): Cam => {
  const z = scene.zoom;
  if (!z) return CENTER;
  const f = z.focus ? focusPoint(scene, z.focus) : { x: W / 2, y: H / 2 };
  const p = EASE(interpolate(frame, [0, Math.max(1, total)], [0, 1], clamp));
  return { x: f.x, y: f.y, s: lerp(z.from, z.to, p) };
};

export const Camera: React.FC<{ readonly scene: DraftScene; readonly mode: "ikuti" | "diam"; readonly children: React.ReactNode }> = ({ scene, mode, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cam = scene.zoom ? punch(scene, frame, durationInFrames) : mode === "ikuti" ? follow(scene, frame / fps) : CENTER;
  if (cam.s === 1 && cam.x === W / 2 && cam.y === H / 2) return <>{children}</>;
  // Pusat kamera dijepit supaya tepi kanvas tidak pernah terlihat.
  const cx = Math.min(W - W / 2 / cam.s, Math.max(W / 2 / cam.s, cam.x));
  const cy = Math.min(H - H / 2 / cam.s, Math.max(H / 2 / cam.s, cam.y));
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${W / 2 - cx * cam.s}px, ${H / 2 - cy * cam.s}px) scale(${cam.s})` }}>{children}</div>
  );
};
