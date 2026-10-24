// Palet warna dari character sheet. Dipakai bersama oleh Character dan Robot.
export const PALETTE = {
  ink: "#17171b",
  gray: "#6b6b70",
  cream: "#f5e9d8",
  yellow: "#fbd34d",
  orange: "#f6932a",
  orangeDark: "#d97a14",
  blue: "#1d78f0",
  skin: "#f7d9b8",
  skinShade: "#eabf96",
  white: "#ffffff",
  mouth: "#c4453d",
} as const;

export type CharacterView = "front" | "side" | "back" | "threeQuarter";

export type HairStyle = "acak" | "klasik" | "poni" | "mohawk" | "cepol";

export const HAIR_STYLES: readonly HairStyle[] = [
  "acak",
  "klasik",
  "poni",
  "mohawk",
  "cepol",
];

export type CharacterExpression =
  | "senang"
  | "bingung"
  | "kaget"
  | "senyumSantai"
  | "serius"
  | "kesal"
  | "mikir"
  | "mataTertutup";

export type RobotExpression =
  | "normal"
  | "senang"
  | "kaget"
  | "malu"
  | "sedih"
  | "marah";

export const CHARACTER_EXPRESSIONS: readonly CharacterExpression[] = [
  "senang",
  "bingung",
  "kaget",
  "senyumSantai",
  "serius",
  "kesal",
  "mikir",
  "mataTertutup",
];

export const ROBOT_EXPRESSIONS: readonly RobotExpression[] = [
  "normal",
  "senang",
  "kaget",
  "malu",
  "sedih",
  "marah",
];

export const VIEWS: readonly CharacterView[] = [
  "front",
  "side",
  "back",
  "threeQuarter",
];

// Kedip: 5 frame tiap ~3.4 detik. Deterministik, aman untuk render paralel.
export const isBlinking = (frame: number, fps: number): boolean => {
  const period = Math.round(fps * 3.4);
  return frame % period >= period - 5;
};
