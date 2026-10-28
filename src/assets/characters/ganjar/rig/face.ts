import { Easing, interpolate } from "remotion";

// Ekspresi = kumpulan angka, jadi pergantian ekspresi bisa diinterpolasi halus.
export type GanjarExpression =
  | "senang"
  | "bingung"
  | "kaget"
  | "senyumSantai"
  | "serius"
  | "kesal"
  | "mikir"
  | "mataTertutup"
  | "netral"
  | "sedih"
  | "marah"
  | "malu";

export type BrowState = {
  // px, negatif = naik
  readonly y: number;
  // derajat, positif = ujung dalam turun (marah)
  readonly rot: number;
};

export type FaceState = {
  readonly browL: BrowState;
  readonly browR: BrowState;
  // skala tinggi mata, 0 = tertutup
  readonly eyeOpen: number;
  // 1 = ^ (tertawa), -1 = ‿ (rileks), dipakai saat mata tertutup
  readonly eyeArc: number;
  // -1 cemberut .. 1 senyum
  readonly smile: number;
  // 0 tertutup .. 1 terbuka lebar
  readonly mouthOpen: number;
  readonly mouthWidth: number;
  readonly lookX: number;
  readonly lookY: number;
  readonly blush: number;
};

export const EXPRESSIONS: Record<GanjarExpression, FaceState> = {
  netral: {
    browL: { y: 0, rot: 0 }, browR: { y: 0, rot: 0 }, eyeOpen: 1, eyeArc: -1,
    smile: 0.5, mouthOpen: 0, mouthWidth: 44, lookX: 0, lookY: 0, blush: 0.5,
  },
  senang: {
    browL: { y: -7, rot: -4 }, browR: { y: -7, rot: -4 }, eyeOpen: 1, eyeArc: -1,
    smile: 1, mouthOpen: 0.75, mouthWidth: 78, lookX: 0, lookY: 0, blush: 0.8,
  },
  bingung: {
    browL: { y: -12, rot: -10 }, browR: { y: 4, rot: 8 }, eyeOpen: 1, eyeArc: -1,
    smile: -0.25, mouthOpen: 0, mouthWidth: 34, lookX: 6, lookY: -4, blush: 0.3,
  },
  kaget: {
    browL: { y: -18, rot: -8 }, browR: { y: -18, rot: -8 }, eyeOpen: 1.15, eyeArc: -1,
    smile: 0, mouthOpen: 0.7, mouthWidth: 44, lookX: 0, lookY: 0, blush: 0.3,
  },
  senyumSantai: {
    browL: { y: -2, rot: -2 }, browR: { y: -2, rot: -2 }, eyeOpen: 0, eyeArc: -1,
    smile: 0.9, mouthOpen: 0, mouthWidth: 52, lookX: 0, lookY: 0, blush: 0.7,
  },
  serius: {
    browL: { y: 4, rot: 7 }, browR: { y: 4, rot: 7 }, eyeOpen: 0.9, eyeArc: -1,
    smile: 0, mouthOpen: 0, mouthWidth: 36, lookX: 0, lookY: 0, blush: 0.1,
  },
  kesal: {
    browL: { y: 8, rot: 17 }, browR: { y: 8, rot: 17 }, eyeOpen: 0.82, eyeArc: -1,
    smile: -0.9, mouthOpen: 0, mouthWidth: 46, lookX: 0, lookY: 0, blush: 0.2,
  },
  mikir: {
    browL: { y: -8, rot: -6 }, browR: { y: 3, rot: 6 }, eyeOpen: 0.95, eyeArc: -1,
    smile: -0.1, mouthOpen: 0, mouthWidth: 26, lookX: -12, lookY: -9, blush: 0.3,
  },
  mataTertutup: {
    browL: { y: -6, rot: -3 }, browR: { y: -6, rot: -3 }, eyeOpen: 0, eyeArc: 1,
    smile: 1, mouthOpen: 0.85, mouthWidth: 74, lookX: 0, lookY: 0, blush: 0.9,
  },
  sedih: {
    browL: { y: -3, rot: -13 }, browR: { y: -3, rot: -13 }, eyeOpen: 0.85, eyeArc: -1,
    smile: -0.7, mouthOpen: 0, mouthWidth: 34, lookX: 0, lookY: 5, blush: 0.1,
  },
  marah: {
    browL: { y: 9, rot: 22 }, browR: { y: 9, rot: 22 }, eyeOpen: 0.75, eyeArc: -1,
    smile: -1, mouthOpen: 0.3, mouthWidth: 52, lookX: 0, lookY: 0, blush: 0.35,
  },
  malu: {
    browL: { y: -4, rot: -5 }, browR: { y: -4, rot: -5 }, eyeOpen: 0.7, eyeArc: -1,
    smile: 0.4, mouthOpen: 0, mouthWidth: 30, lookX: -8, lookY: 6, blush: 1,
  },
};

export type FaceKey = { readonly at: number; readonly expression: GanjarExpression };

const BLEND_FRAMES = 6;
const BLINK_PERIOD = 110;
const BLINK_LEN = 6;
const ease = Easing.inOut(Easing.cubic);

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
const mixBrow = (a: BrowState, b: BrowState, t: number): BrowState => ({
  y: mix(a.y, b.y, t),
  rot: mix(a.rot, b.rot, t),
});
const blend = (a: FaceState, b: FaceState, t: number): FaceState => ({
  browL: mixBrow(a.browL, b.browL, t),
  browR: mixBrow(a.browR, b.browR, t),
  eyeOpen: mix(a.eyeOpen, b.eyeOpen, t),
  eyeArc: mix(a.eyeArc, b.eyeArc, t),
  smile: mix(a.smile, b.smile, t),
  mouthOpen: mix(a.mouthOpen, b.mouthOpen, t),
  mouthWidth: mix(a.mouthWidth, b.mouthWidth, t),
  lookX: mix(a.lookX, b.lookX, t),
  lookY: mix(a.lookY, b.lookY, t),
  blush: mix(a.blush, b.blush, t),
});

// keys diurutkan menurut `at` (detik). Fungsi murni dari frame.
export const evalFace = (frame: number, fps: number, keys: readonly FaceKey[]): FaceState => {
  let prev = EXPRESSIONS.netral;
  let cur = EXPRESSIONS.netral;
  let curFrame = -1000;
  for (const k of keys) {
    const f = Math.round(k.at * fps);
    if (f <= frame) {
      prev = cur;
      cur = EXPRESSIONS[k.expression];
      curFrame = f;
    }
  }
  const t = interpolate(frame - curFrame, [0, BLEND_FRAMES], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = blend(prev, cur, t);
  // Kedip berkala, deterministik. Mata sudah tertutup = tidak perlu.
  const b = frame % BLINK_PERIOD;
  let eyeOpen = s.eyeOpen;
  if (b >= BLINK_PERIOD - BLINK_LEN) {
    const m = (b - (BLINK_PERIOD - BLINK_LEN)) / (BLINK_LEN - 1);
    eyeOpen = s.eyeOpen * Math.min(1, Math.abs(m - 0.5) * 2 * 0.9 + 0.1);
  }
  return { ...s, eyeOpen, lookX: s.lookX + Math.sin(frame / 53) * 2.5, lookY: s.lookY + Math.sin(frame / 71) * 1.5 };
};
