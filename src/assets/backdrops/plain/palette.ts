// Latar kosong: dinding polos berlatar gradasi dan lantai dengan garis tepi, tanpa perabot.
// Palet hanya hex 6 digit dan angka (bisa diinterpolasi antar waktu).
export type PlainPalette = {
  readonly wallTop: string;
  readonly wallBottom: string;
  readonly floor: string;
  readonly floorEdge: string;
  // Kolam cahaya di lantai di bawah karakter.
  readonly spot: string;
  readonly spotOpacity: number;
  readonly shadowOpacity: number;
};

export const PLAIN_DAY: PlainPalette = {
  wallTop: "#F6F1E8",
  wallBottom: "#E9E1D3",
  floor: "#D8CDB9",
  floorEdge: "#C7B99F",
  spot: "#FFFFFF",
  spotOpacity: 0.5,
  shadowOpacity: 0.26,
};

export const PLAIN_SORE: PlainPalette = {
  wallTop: "#F4DEC9",
  wallBottom: "#E8C5A4",
  floor: "#CFAE8E",
  floorEdge: "#BD9A78",
  spot: "#FFD2A0",
  spotOpacity: 0.45,
  shadowOpacity: 0.3,
};

export const PLAIN_MALAM: PlainPalette = {
  wallTop: "#2B2E4A",
  wallBottom: "#1E2038",
  floor: "#14152A",
  floorEdge: "#2A2C4C",
  spot: "#7F9CFF",
  spotOpacity: 0.22,
  shadowOpacity: 0.4,
};
