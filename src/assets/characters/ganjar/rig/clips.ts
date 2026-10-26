import { clamp01, envelope, kf, TAU } from "../../shared/motion";
import { applyDelta, NEUTRAL_POSE, type GanjarPose, type PoseDelta } from "./pose";

export type Clip = (f: number) => PoseDelta;

export const idle: Clip = (f) => {
  const breathe = Math.sin((f / 100) * TAU);
  const sway = Math.sin((f / 170) * TAU);
  return {
    hipY: breathe * 1.5,
    torso: { rot: sway * 0.6, breathe: breathe * 0.008 },
    head: { y: breathe * -1.5, rot: Math.sin((f / 130) * TAU) * 0.8 },
    armL: { shoulder: 3 + Math.sin((f / 100) * TAU + 0.5) * 1.2, elbow: 5 },
    armR: { shoulder: 3 + Math.sin((f / 100) * TAU + 0.8) * 1.2, elbow: 5 },
    legL: { knee: breathe * -0.8 },
    legR: { knee: breathe * -0.8 },
  };
};

// Toleh dan miring kepala. turn -1..1 (kiri..kanan layar), tilt derajat.
export const headTurn =
  (dur: number, turn: number, tilt: number): Clip =>
  (f) => {
    const e = kf(f, [[0, 0], [10, 1], [dur - 10, 1], [dur, 0]]);
    return {
      head: { turn: turn * e, rot: tilt * e },
      torso: { rot: turn * e * 0.8 },
    };
  };

// Menunjuk: lengan terangkat ke samping, telunjuk keluar, badan sedikit condong.
export const point =
  (side: "L" | "R", dur: number, peak: number): Clip =>
  (f) => {
    const raise = kf(f, [[0, 0], [14, peak], [dur - 12, peak], [dur, 0]]);
    const elbow = kf(f, [[0, 0], [14, 6], [dur - 12, 6], [dur, 0]]);
    const finger = kf(f, [[0, 0], [10, 0], [18, 1], [dur - 14, 1], [dur - 6, 0]]);
    const settle = clamp01((f - 14) / 8) * clamp01((dur - 12 - f) / 8);
    const jab = Math.sin(((f - 18) / 16) * TAU) * 2 * settle;
    const lean = envelope(f, dur, 12) * (side === "L" ? -2.5 : 2.5);
    const arm = { shoulder: raise + jab, elbow, point: finger };
    return side === "L"
      ? { armL: arm, torso: { rot: lean } }
      : { armR: arm, torso: { rot: lean } };
  };

// Kaget kecil: tersentak ke belakang sedikit, lengan terbuka.
export const startle =
  (dur: number): Clip =>
  (f) => {
    const k = Math.max(0, f - 4);
    const recoil = kf(f, [[0, 0], [4, 0], [9, 1], [dur, 0]]);
    return {
      hipY: -6 * recoil,
      torso: { rot: -3 * recoil * Math.exp(-k / 20) },
      head: { y: -4 * recoil },
      armL: { shoulder: 16 * recoil, elbow: 8 * recoil },
      armR: { shoulder: 16 * recoil, elbow: 8 * recoil },
      legL: { knee: 4 * recoil },
      legR: { knee: 4 * recoil },
    };
  };

export type PlacedClip = { readonly clip: Clip; readonly start: number; readonly dur: number };

export const evalGanjar = (frame: number, clips: readonly PlacedClip[]): GanjarPose => {
  let pose = applyDelta(NEUTRAL_POSE, idle(frame));
  for (const c of clips) {
    if (frame >= c.start && frame < c.start + c.dur) {
      pose = applyDelta(pose, c.clip(frame - c.start));
    }
  }
  return pose;
};
