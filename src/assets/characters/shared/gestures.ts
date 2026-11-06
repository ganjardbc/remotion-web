// Gerak tangan Stickman dan RobotStickman. Sudut dalam derajat dari arah lurus ke bawah:
// `shoulder` = lengan atas, `elbow` = tambahan untuk lengan bawah (arah lengan bawah = shoulder + elbow).
// Sudut di atas 180 berarti lengan menyilang ke arah badan. `front` = lengan digambar di depan kepala/badan.

export type ArmPose = { readonly shoulder: number; readonly elbow: number; readonly front?: boolean };

export type Gesture =
  | "netral"
  | "lambai"
  | "angkatTangan"
  | "tunjuk"
  | "sorak"
  | "menyerah"
  | "angkatBahu"
  | "facepalm"
  | "mikir"
  | "garukKepala"
  | "tepuk"
  | "pinggang"
  | "mengetik";

export const GESTURES: readonly Gesture[] = [
  "netral",
  "lambai",
  "angkatTangan",
  "tunjuk",
  "sorak",
  "menyerah",
  "angkatBahu",
  "facepalm",
  "mikir",
  "garukKepala",
  "tepuk",
  "pinggang",
  "mengetik",
];

// null = pakai pose dasar (diam atau ayun jalan) untuk lengan itu.
export type GestureArms = readonly [ArmPose | null, ArmPose | null];

const TAU = Math.PI * 2;

// Indeks 0 = lengan kiri layar, 1 = lengan kanan layar. `robot` = lengan pendek dan badan kotak:
// beberapa sudut berbeda supaya tangan tetap jatuh di layar atau di samping kotak.
export const gestureArms = (g: Gesture, t: number, robot: boolean): GestureArms => {
  const both = (a: ArmPose): GestureArms => [a, a];
  const right = (a: ArmPose): GestureArms => [null, a];
  switch (g) {
    case "netral":
      return [null, null];
    case "lambai":
      return right({ shoulder: 92, elbow: 45 + Math.sin(t * TAU * 2.2) * 20 });
    case "angkatTangan":
      return right({ shoulder: robot ? 150 : 125, elbow: robot ? 22 : 5 });
    case "tunjuk":
      return right({ shoulder: 96 + Math.sin(t * TAU * 1.8) * 3, elbow: -6 });
    case "sorak": {
      const w = Math.sin(t * TAU * 2.4) * 8;
      return both({ shoulder: robot ? 140 + w : 140 + w, elbow: robot ? 20 - w : -20 - w });
    }
    case "menyerah":
      return both({ shoulder: 100, elbow: 80, front: true });
    case "angkatBahu": {
      const up = Math.sin(t * TAU * 1.2) * 3;
      return both({ shoulder: 62 + up, elbow: 48 });
    }
    case "facepalm":
      return right(robot ? { shoulder: 40, elbow: 215, front: true } : { shoulder: 100, elbow: 115, front: true });
    case "mikir":
      return right(robot ? { shoulder: 35, elbow: 200, front: true } : { shoulder: 60, elbow: 175, front: true });
    case "garukKepala": {
      const scratch = Math.sin(t * TAU * 3) * 12;
      return right(robot ? { shoulder: 150, elbow: 25 + scratch, front: false } : { shoulder: 135, elbow: 55 + scratch, front: true });
    }
    case "tepuk": {
      const open = 0.5 + 0.5 * Math.sin(t * TAU * 2.5);
      if (robot) {
        const s = -10 - 65 * (1 - open);
        return both({ shoulder: s, elbow: 270 - s, front: true });
      }
      const s = 20 + 50 * open;
      return both({ shoulder: s, elbow: 270 - s, front: true });
    }
    case "pinggang":
      return both({ shoulder: 50, elbow: 279, front: true });
    case "mengetik": {
      // Lengan atas turun, lengan bawah menekuk ke tengah di depan perut; tiap tangan mengetuk bergantian
      // dengan dua gelombang berbeda supaya tidak seperti metronom.
      const tap = (phase: number): number => Math.max(0, Math.sin(t * TAU * 3.1 + phase)) * 9 + Math.sin(t * TAU * 1.7 + phase * 2) * 2;
      const base = robot ? { shoulder: -12, elbow: 282 } : { shoulder: 30, elbow: -118 };
      return [
        { shoulder: base.shoulder, elbow: base.elbow + tap(0), front: true },
        { shoulder: base.shoulder, elbow: base.elbow + tap(2.4), front: true },
      ];
    }
  }
};

// ---------- Pose block ----------
// Block tidak punya siku: lengan lurus, tapi bisa diangkat ke samping (`out`) atau ke depan (`fwd`), derajat dari posisi
// tergantung. Badan atas bisa condong (`lean` maju, `tilt` ke samping), kepala miring/menoleh/mengangguk, dan seluruh
// tubuh terangkat (`lift`, satuan U). Semua gerak di atas dipakai 13 gesture yang sama dengan stickman.
// Indeks `l` = lengan kiri layar, `r` = kanan layar. `out` negatif = merapat ke badan.

export type BlockArm = { readonly out: number; readonly fwd: number };
export type BlockPose = {
  readonly l: BlockArm;
  readonly r: BlockArm;
  readonly lean: number;
  readonly tilt: number;
  readonly headTilt: number;
  readonly headYaw: number;
  readonly nod: number;
  readonly lift: number;
  // Kaki: `legL`/`legR` = ayun maju (derajat, + = ke arah penonton), `spread` = kaki membuka ke samping tiap sisi.
  readonly legL: number;
  readonly legR: number;
  readonly spread: number;
};

// Gesture berwaktu: `at` dalam detik, urut naik. Antar gesture pose dihaluskan (BLEND_SEC, ease-out).
export type GestureKey = { readonly at: number; readonly gesture: Gesture };
const BLEND_SEC = 0.3;

// `rest` = sudut `out` lengan saat diam (beda per karakter, sudah termasuk napas).
const rawBlockPose = (g: Gesture, t: number, rest: number): BlockPose => {
  const arm = (out = rest, fwd = 0): BlockArm => ({ out, fwd });
  // Berat badan berpindah pelan antar kaki saat diam (napas), ditimpa gesture yang punya sikap kaki sendiri.
  const sway = Math.sin(t * TAU * 0.5) * 3;
  const pose = (p: Partial<BlockPose>): BlockPose => ({ l: arm(), r: arm(), lean: 0, tilt: 0, headTilt: 0, headYaw: 0, nod: 0, lift: 0, legL: sway, legR: -sway, spread: 0, ...p });
  switch (g) {
    case "netral":
      return pose({});
    case "lambai":
      return pose({ r: arm(128 + Math.sin(t * TAU * 2.2) * 18), headTilt: 4, legL: Math.sin(t * TAU * 1.1) * 5, legR: -Math.sin(t * TAU * 1.1) * 5 });
    case "angkatTangan":
      return pose({ r: arm(165), headTilt: -3, spread: 8 });
    case "tunjuk":
      return pose({ r: arm(92 + Math.sin(t * TAU * 1.8) * 3), headYaw: 10, lean: 2, legL: -8, legR: 10 });
    case "sorak": {
      const w = Math.sin(t * TAU * 2.4) * 8;
      return pose({ l: arm(155 + w), r: arm(155 + w), lift: Math.abs(Math.sin(t * TAU * 1.2)) * 0.6, nod: -6, spread: 12, legL: 6, legR: -6 });
    }
    case "menyerah":
      return pose({ l: arm(100), r: arm(100), headTilt: 8, lean: -3, lift: 0.3, spread: 6 });
    case "angkatBahu":
      return pose({ l: arm(26), r: arm(26), headTilt: 6, lift: 0.35 + Math.sin(t * TAU * 1.2) * 0.08 });
    case "facepalm":
      return pose({ r: arm(rest, 142), lean: 10, nod: 18, spread: 5 });
    case "mikir":
      return pose({ r: arm(rest, 116), headTilt: 8, headYaw: -8, nod: 4, legR: 16, legL: -4 });
    case "garukKepala":
      return pose({ r: arm(rest, 158 + Math.sin(t * TAU * 3) * 8), headTilt: 6, legL: sway * 2, legR: -sway * 2 });
    case "tepuk": {
      const open = 0.5 + 0.5 * Math.sin(t * TAU * 2.5);
      const out = 6 - 18 * (1 - open);
      const step = Math.sin(t * TAU * 1.25) * 10;
      return pose({ l: arm(out, 80), r: arm(out, 80), nod: 3, legL: step, legR: -step });
    }
    case "pinggang":
      return pose({ l: arm(38), r: arm(38), lean: -2, spread: 10 });
    case "mengetik": {
      const tap = (phase: number): number => Math.max(0, Math.sin(t * TAU * 3.1 + phase)) * 9;
      return pose({ l: arm(rest, 58 + tap(0)), r: arm(rest, 58 + tap(2.4)), lean: 7, nod: 10 });
    }
  }
};

const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
const blendPose = (a: BlockPose, b: BlockPose, p: number): BlockPose => ({
  l: { out: lerp(a.l.out, b.l.out, p), fwd: lerp(a.l.fwd, b.l.fwd, p) },
  r: { out: lerp(a.r.out, b.r.out, p), fwd: lerp(a.r.fwd, b.r.fwd, p) },
  lean: lerp(a.lean, b.lean, p),
  tilt: lerp(a.tilt, b.tilt, p),
  headTilt: lerp(a.headTilt, b.headTilt, p),
  headYaw: lerp(a.headYaw, b.headYaw, p),
  nod: lerp(a.nod, b.nod, p),
  lift: lerp(a.lift, b.lift, p),
  legL: lerp(a.legL, b.legL, p),
  legR: lerp(a.legR, b.legR, p),
  spread: lerp(a.spread, b.spread, p),
});

// Karakter kecil (Robot, Claude Code) berlengan dan berkaki pendek: gerak lengan dan kaki sendiri sulit terbaca, jadi badannya
// ikut bergerak (condong, miring, melompat kecil) dan sudut kaki dibesarkan.
const compactPose = (g: Gesture, t: number, p: BlockPose): BlockPose => {
  const hop = (f: number, a: number): number => Math.abs(Math.sin(t * TAU * f)) * a;
  let lean = 0;
  let tilt = 0;
  let lift = 0;
  switch (g) {
    case "lambai":
      tilt = Math.sin(t * TAU * 1.1) * 4;
      break;
    case "angkatTangan":
      lift = hop(1.5, 0.5);
      tilt = -3;
      break;
    case "tunjuk":
      tilt = -5;
      lean = 4;
      break;
    case "sorak":
      lift = hop(1.8, 1.2);
      break;
    case "menyerah":
      lean = -4;
      tilt = 4;
      lift = 0.2;
      break;
    case "angkatBahu":
      lift = 0.5 + Math.sin(t * TAU * 1.2) * 0.1;
      break;
    case "facepalm":
      lean = 14;
      break;
    case "mikir":
      tilt = 8;
      break;
    case "garukKepala":
      tilt = Math.sin(t * TAU * 3) * 5;
      break;
    case "tepuk":
      lift = hop(2.5, 0.3);
      break;
    case "pinggang":
      lean = -3;
      break;
    case "mengetik":
      lean = 6;
      tilt = Math.sin(t * TAU * 1.7) * 2;
      break;
    case "netral":
      break;
  }
  return { ...p, lean: p.lean + lean, tilt: p.tilt + tilt, lift: p.lift + lift, legL: p.legL * 1.6, legR: p.legR * 1.6, spread: p.spread * 1.6 };
};

// Pose block pada detik `t`: gesture terakhir yang sudah mulai, dihaluskan dari gesture sebelumnya.
export const blockPoseAt = (keys: readonly GestureKey[], t: number, rest: number, compact = false): BlockPose => {
  const raw = (g: Gesture): BlockPose => (compact ? compactPose(g, t, rawBlockPose(g, t, rest)) : rawBlockPose(g, t, rest));
  let i = -1;
  keys.forEach((k, n) => {
    if (k.at <= t) i = n;
  });
  if (i < 0) return raw("netral");
  const cur = raw(keys[i].gesture);
  if (i === 0) return cur;
  const p = Math.min(1, Math.max(0, (t - keys[i].at) / BLEND_SEC));
  return p >= 1 ? cur : blendPose(raw(keys[i - 1].gesture), cur, 1 - Math.pow(1 - p, 3));
};
