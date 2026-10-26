import { Easing, interpolate } from "remotion";

// Helper animasi murni yang dipakai robot dan Ganjar.
export const TAU = Math.PI * 2;
export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const ease = Easing.inOut(Easing.cubic);

// Keyframe antar titik [frame, nilai], di luar rentang ditahan.
export const kf = (f: number, keys: readonly (readonly [number, number])[]): number =>
  interpolate(
    f,
    keys.map((k) => k[0]),
    keys.map((k) => k[1]),
    { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

// 0 -> 1 -> 0, naik dan turun sepanjang `ramp` frame.
export const envelope = (f: number, dur: number, ramp: number): number =>
  Math.min(clamp01(f / ramp), clamp01((dur - f) / ramp));
