// Geometri Ganjar (front view). Koordinat mengikuti tampilan depan di character sheet 2D,
// sumbu x berpusat di tengah badan, y absolut (lantai di FLOOR_Y).
export const COLORS = {
  skin: "#f2b98c",
  skinShade: "#dc9a6c",
  skinOutline: "#2e1c14",
  blush: "#e68a66",
  hair: "#19191d",
  hairLight: "#3a3a44",
  hairOutline: "#08080a",
  shirt: "#1d1d22",
  shirtLight: "#2d2d35",
  pants: "#18181c",
  pantsLight: "#292930",
  white: "#fbfaf6",
  shoeShade: "#d9d4c8",
  mouth: "#c9553f",
  mouthDark: "#6b2a1c",
  tongue: "#ee8a6a",
  eye: "#111114",
  background: "#f8f6f1",
} as const;

export const FLOOR_Y = 1131;

export const PIVOTS = {
  waist: { x: 0, y: 700 },
  neck: { x: 0, y: 420 },
  shoulderY: 470,
  shoulderX: 122,
  upperArmLen: 175,
  forearmLen: 105,
  hipX: 62,
  hipY: 725,
  kneeY: 905,
  ankleY: 1085,
} as const;

export const FACE = {
  cy: 290,
  eyeX: 55,
  eyeY: 288,
  browY: 228,
  mouthY: 352,
} as const;
