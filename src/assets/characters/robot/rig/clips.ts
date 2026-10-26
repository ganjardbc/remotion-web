import { clamp01, envelope, kf, TAU } from "../../shared/motion";
import { applyDelta, NEUTRAL_POSE, type PoseDelta, type RobotPose } from "./pose";

// Setiap clip: (frame lokal) -> PoseDelta. Fungsi murni, aman dirender ulang di frame mana pun.
export type Clip = (f: number) => PoseDelta;

export const idle: Clip = (f) => {
  const breathe = Math.sin((f / 90) * TAU);
  return {
    body: {
      y: breathe * 3,
      rot: Math.sin((f / 150) * TAU) * 1,
      sy: 1 + breathe * 0.008,
      sx: 1 - breathe * 0.004,
    },
    armL: 3 + Math.sin((f / 90) * TAU + 0.6) * 1.5,
    armR: 3 + Math.sin((f / 90) * TAU + 0.9) * 1.5,
    antL: Math.sin((f / 70) * TAU) * 3,
    antR: Math.sin((f / 70) * TAU + 1.2) * 3,
  };
};

// Gerakan lengan: naik ke `peak` derajat, tahan sambil melambai `wave` derajat, turun.
export const armGesture =
  (side: "L" | "R", dur: number, peak: number, wave: number): Clip =>
  (f) => {
    const raise = kf(f, [
      [0, 0],
      [10, peak],
      [dur - 10, peak],
      [dur, 0],
    ]);
    const hold = clamp01((f - 10) / 6) * clamp01((dur - 10 - f) / 6);
    const w = Math.sin(((f - 10) / 12) * TAU) * wave * hold;
    const lean = envelope(f, dur, 10) * (side === "R" ? -2.5 : 2.5);
    return side === "R"
      ? { armR: raise + w, body: { rot: lean } }
      : { armL: raise + w, body: { rot: lean } };
  };

// Reaksi kaget: antisipasi, lompat, mendarat, lengan terbuka, antena memantul.
export const surprise: Clip = (f) => {
  let y = 0;
  let sy: number;
  let sx: number;
  if (f < 5) {
    sy = kf(f, [[0, 1], [5, 0.88]]);
    sx = kf(f, [[0, 1], [5, 1.06]]);
  } else if (f < 17) {
    const u = (f - 5) / 12;
    y = -46 * 4 * u * (1 - u);
    sy = kf(f, [[5, 0.88], [11, 1.1], [17, 1]]);
    sx = kf(f, [[5, 1.06], [11, 0.95], [17, 1]]);
  } else {
    const k = f - 17;
    y = -5 * Math.exp(-k / 4) * Math.abs(Math.sin(k * 0.9));
    sy = 1 - 0.1 * Math.exp(-k / 5) * Math.cos(k * 0.7);
    sx = 1 + 0.05 * Math.exp(-k / 5) * Math.cos(k * 0.7);
  }
  const k = Math.max(0, f - 8);
  const boing = Math.exp(-k / 9) * Math.sin(k * 0.85);
  const arms =
    kf(f, [[0, 0], [6, 0], [13, 48], [44, 40], [58, 0]]) +
    Math.sin(f * 1.3) * 2.5 * clamp01((f - 14) / 4) * clamp01((50 - f) / 12);
  return {
    body: {
      y,
      sx,
      sy,
      rot: -4 * Math.exp(-Math.max(0, f - 12) / 14) * clamp01((f - 6) / 6) * Math.cos(Math.max(0, f - 12) * 0.35),
    },
    legL: { lift: -y * 0.65 },
    legR: { lift: -y * 0.65 },
    armL: arms,
    armR: arms,
    antL: 26 * boing,
    antR: -26 * boing,
  };
};

// Tes langkah, menghadap depan: menyamping bolak-balik sambil mengangkat kaki bergantian.
export const walk =
  (dur: number): Clip =>
  (f) => {
    const amp = envelope(f, dur, 12);
    const phase = (f / 24) * TAU;
    const s = Math.sin(phase);
    const half = dur / 2;
    const x = kf(f, [[0, 0], [half, 70], [dur, 0]]);
    const dir = f < half ? 1 : -1;
    const liftL = Math.max(0, s) * 20 * amp;
    const liftR = Math.max(0, -s) * 20 * amp;
    return {
      root: { x, rot: dir * 2 * amp },
      body: { y: -Math.abs(s) * 6 * amp, rot: s * 3.5 * amp },
      legL: { lift: liftL, swing: -s * 6 * amp, foot: liftL * 0.5 + s * 5 * amp },
      legR: { lift: liftR, swing: -s * 6 * amp, foot: liftR * 0.5 + s * 5 * amp },
      armL: s * 14 * amp,
      armR: -s * 14 * amp,
    };
  };

export type PlacedClip = { readonly clip: Clip; readonly start: number; readonly dur: number };

const composeBody = (frame: number, clips: readonly PlacedClip[]): RobotPose => {
  let pose = applyDelta(NEUTRAL_POSE, idle(frame));
  for (const c of clips) {
    if (frame >= c.start && frame < c.start + c.dur) {
      pose = applyDelta(pose, c.clip(frame - c.start));
    }
  }
  return pose;
};

// Antena ikut terseret gerak badan: ayunan sekunder dari selisih pose beberapa frame lalu.
export const evalRobot = (frame: number, clips: readonly PlacedClip[]): RobotPose => {
  const now = composeBody(frame, clips);
  const prev = composeBody(frame - 3, clips);
  const drag = (now.body.rot - prev.body.rot) * -1.2 + (now.body.y - prev.body.y) * 0.5 + (now.root.x - prev.root.x) * -0.25;
  return applyDelta(now, { antL: drag, antR: drag });
};
