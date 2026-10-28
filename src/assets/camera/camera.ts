import { Easing, interpolate } from "remotion";

// Kamera virtual 2D: dunia digambar sekali, kamera hanya memilih bagian yang tampak (geser, zoom, putar).
// Semua fungsi murni dari frame. Satuan: piksel dunia, derajat, detik.

// Titik dunia (x, y) yang berada di tengah layar, pembesaran, dan putaran (derajat, bawaan 0).
export type CamState = { readonly x: number; readonly y: number; readonly zoom: number; readonly rotate?: number };

export type EaseName = "linear" | "inOut" | "out" | "in";

const EASES: Record<EaseName, (t: number) => number> = {
  linear: Easing.linear,
  inOut: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
};

// Transisi masuk atau keluar sebuah bidikan. `cut` = langsung potong; `whip` = geser cepat dengan blur;
// `punch` (hanya masuk) = zoom kecil yang mengendap.
export type TransitionIn = "cut" | "whip" | "punch";
export type TransitionOut = "cut" | "whip";

export type Shot = {
  // Awal dan lama bidikan dalam detik (waktu adegan).
  readonly from: number;
  readonly dur: number;
  readonly start: CamState;
  // Bila ada, kamera bergerak dari `start` ke `end` selama bidikan (push-in, pan, tilt). Tanpa `end` = kamera diam.
  readonly end?: CamState;
  readonly ease?: EaseName;
  // Goyang tangan: amplitudo dalam piksel layar (0 = mantap, 4 = pelan, 10 = kuat).
  readonly shake?: number;
  // Blur latar (px): angka tetap, atau [dari, ke] untuk rack focus. Hanya lapisan `background` yang diblur.
  readonly blurBg?: number | readonly [number, number];
  readonly transitionIn?: TransitionIn;
  readonly transitionOut?: TransitionOut;
  readonly label?: string;
};

export const WHIP_FRAMES = 8;
const WHIP_BLUR = 18;
const PUNCH_ZOOM = 0.25;

export type Active = { readonly shot: Shot; readonly index: number; readonly local: number; readonly total: number };

// Bidikan yang aktif pada frame ini. Di antara dua bidikan atau setelah yang terakhir, bidikan terakhir yang sudah mulai ditahan.
export const activeShot = (shots: readonly Shot[], frame: number, fps: number): Active => {
  let index = 0;
  shots.forEach((s, i) => {
    if (Math.round(s.from * fps) <= frame) index = i;
  });
  const shot = shots[index];
  const total = Math.max(1, Math.round(shot.dur * fps));
  const local = Math.min(total, Math.max(0, frame - Math.round(shot.from * fps)));
  return { shot, index, local, total };
};

const noise = (f: number, seed: number): number =>
  Math.sin(f * 0.37 + seed) * 0.5 + Math.sin(f * 0.91 + seed * 2.1) * 0.3 + Math.sin(f * 1.73 + seed * 3.3) * 0.2;

export type CamFrame = {
  // Dunia di tengah layar, pembesaran, putaran total (termasuk goyang).
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
  readonly rotate: number;
  // Geser layar (px) akibat goyang dan whip, blur layar (px) akibat whip dan punch, blur latar (px).
  readonly dx: number;
  readonly dy: number;
  readonly blur: number;
  readonly blurBg: number;
  readonly active: Active;
};

export const evalCamera = (shots: readonly Shot[], frame: number, fps: number, width: number): CamFrame => {
  const active = activeShot(shots, frame, fps);
  const { shot, local, total } = active;
  const p = EASES[shot.ease ?? "inOut"](Math.min(1, local / total));
  const a = shot.start;
  const b = shot.end ?? shot.start;
  let zoom = interpolate(p, [0, 1], [a.zoom, b.zoom]);
  const x = interpolate(p, [0, 1], [a.x, b.x]);
  const y = interpolate(p, [0, 1], [a.y, b.y]);
  const rotate = interpolate(p, [0, 1], [a.rotate ?? 0, b.rotate ?? 0]);

  const amp = shot.shake ?? 0;
  let dx = amp * noise(frame, 1);
  const dy = amp * noise(frame, 2);
  const shakeRot = amp * 0.02 * noise(frame, 3);

  let blur = 0;
  const tin = shot.transitionIn ?? "cut";
  if (local < WHIP_FRAMES && tin !== "cut") {
    const k = 1 - EASES.out(local / WHIP_FRAMES);
    if (tin === "whip") {
      dx += width * 0.5 * k;
      blur = Math.max(blur, WHIP_BLUR * k);
    } else {
      zoom *= 1 + PUNCH_ZOOM * k;
      blur = Math.max(blur, 6 * k);
    }
  }
  if (shot.transitionOut === "whip" && local > total - WHIP_FRAMES) {
    const k = EASES.in((local - (total - WHIP_FRAMES)) / WHIP_FRAMES);
    dx -= width * 0.5 * k;
    blur = Math.max(blur, WHIP_BLUR * k);
  }

  const bb = shot.blurBg ?? 0;
  const blurBg = typeof bb === "number" ? bb : interpolate(p, [0, 1], [bb[0], bb[1]]);
  return { x, y, zoom, rotate: rotate + shakeRot, dx, dy, blur, blurBg, active };
};

// Pembesaran bidikan baku. `wide` = seluruh dunia; sisanya memusatkan titik subjek.
export type Framing = "wide" | "medium" | "closeUp" | "extremeCloseUp";
export const FRAMING_ZOOM: Record<Framing, number> = { wide: 1, medium: 1.7, closeUp: 2.9, extremeCloseUp: 5 };

// Keadaan kamera untuk bidikan `kind` pada titik subjek (x, y) di dunia.
export const framing = (kind: Framing, subject: { readonly x: number; readonly y: number }, rotate = 0): CamState => ({
  x: subject.x,
  y: subject.y,
  zoom: FRAMING_ZOOM[kind],
  rotate,
});
