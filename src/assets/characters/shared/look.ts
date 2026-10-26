import { Easing, interpolate } from "remotion";

// Arah pandang berwaktu. turn -1..1 (kiri..kanan layar), tilt dalam derajat.
export type LookKey = { readonly at: number; readonly turn: number; readonly tilt?: number };

const BLEND_FRAMES = 12;
const ease = Easing.inOut(Easing.cubic);

// Pindah antar kunci dihaluskan; sebelum kunci pertama = lurus ke depan.
export const evalLook = (
  frame: number,
  fps: number,
  keys: readonly LookKey[],
): { readonly turn: number; readonly tilt: number } => {
  let prev = { turn: 0, tilt: 0 };
  let cur = { turn: 0, tilt: 0 };
  let curFrame = -1000;
  for (const k of keys) {
    const f = Math.round(k.at * fps);
    if (f <= frame) {
      prev = cur;
      cur = { turn: k.turn, tilt: k.tilt ?? 0 };
      curFrame = f;
    }
  }
  const t = interpolate(frame - curFrame, [0, BLEND_FRAMES], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    turn: prev.turn + (cur.turn - prev.turn) * t,
    tilt: prev.tilt + (cur.tilt - prev.tilt) * t,
  };
};
