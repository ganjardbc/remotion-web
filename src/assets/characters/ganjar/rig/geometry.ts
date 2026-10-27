// Geometri Ganjar (front view). Koordinat mengikuti tampilan depan di character sheet 2D,
// sumbu x berpusat di tengah badan, y absolut (lantai di FLOOR_Y).
export const COLORS = {
  outline: "#221a17",
  skin: "#f2b98c",
  skinShade: "#dc9a6c",
  blush: "#e68a66",
  hair: "#3b2418",
  shirt: "#2c2c32",
  pants: "#36363d",
  shoe: "#1f1f24",
  white: "#fbfaf6",
  mouth: "#c9553f",
  mouthDark: "#6b2a1c",
  tongue: "#ee8a6a",
  eye: "#111114",
  background: "#f8f6f1",
} as const;

export const FLOOR_Y = 1131;

export const PIVOTS = {
  waist: { x: 0, y: 720 },
  neck: { x: 0, y: 420 },
  shoulderY: 474,
  shoulderX: 100,
  upperArmLen: 140,
  forearmLen: 116,
  hipX: 58,
  hipY: 740,
  kneeY: 915,
  ankleY: 1085,
} as const;

export const FACE = {
  eyeX: 55,
  eyeY: 290,
  browY: 240,
  mouthY: 354,
} as const;
