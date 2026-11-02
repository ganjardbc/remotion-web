import { blendTimes, type SkyPalette, type TimeOfDay } from "../../shared";

// Warna meja kerja tampak belakang. Satu palet per waktu hari; semua warna hex 6 digit (#RRGGBB) dan angka,
// supaya bisa diinterpolasi antar waktu. Siang mengikuti ruang terang berjendela, malam mengikuti ruang hangat
// dengan lampu rak dan layar menyala.
export type DeskBackPalette = SkyPalette & {
  readonly wall: string;
  readonly wallShade: string;
  readonly baseboard: string;
  readonly floor: string;
  readonly floorShade: string;
  readonly rug: string;
  readonly rugShade: string;
  readonly deskTop: string;
  readonly deskTopEdge: string;
  readonly deskSlab: string;
  readonly deskLeg: string;
  readonly shelf: string;
  readonly curtain: string;
  readonly curtainShade: string;
  readonly windowFrame: string;
  // Kerai jendela 0..1 (malam).
  readonly blinds: number;
  readonly monitorBezel: string;
  readonly monitorStand: string;
  // Wallpaper layar: dasar gelap, dua pita (ungu, oranye), dan semburat merah muda.
  readonly screenBase: string;
  readonly screenPurple: string;
  readonly screenOrange: string;
  readonly screenPink: string;
  readonly keyboard: string;
  readonly keyboardKey: string;
  readonly chairFrame: string;
  readonly chairMesh: string;
  readonly chairSeat: string;
  readonly leaf: string;
  readonly leafDark: string;
  readonly pot: string;
  readonly potShade: string;
  readonly frameBorder: string;
  readonly frameFill: string;
  readonly book1: string;
  readonly book2: string;
  readonly book3: string;
  // Cahaya hangat lampu rak, lampu meja, dan layar: warna dan kekuatan 0..1.
  readonly glowColor: string;
  readonly glow: number;
  // Peredupan seluruh ruang (di bawah cahaya): warna dan kekuatan 0..1.
  readonly dimColor: string;
  readonly dim: number;
  readonly beamColor: string;
  readonly beam: number;
};

export const DESKBACK_DAY: DeskBackPalette = {
  wall: "#EFECE6",
  wallShade: "#DFDAD0",
  baseboard: "#F8F6F2",
  floor: "#C9A77C",
  floorShade: "#B58F63",
  rug: "#F2EFE9",
  rugShade: "#DDD7CB",
  deskTop: "#E7C99D",
  deskTopEdge: "#D3AB75",
  deskSlab: "#D9B481",
  deskLeg: "#EDE9E1",
  shelf: "#E7C99D",
  curtain: "#CDBDA8",
  curtainShade: "#B6A58E",
  windowFrame: "#FFFFFF",
  blinds: 0,
  monitorBezel: "#2A2A30",
  monitorStand: "#CDD0D7",
  screenBase: "#241B4A",
  screenPurple: "#7A4FD6",
  screenOrange: "#FF914D",
  screenPink: "#E0508A",
  keyboard: "#EDEFF2",
  keyboardKey: "#CDD1D8",
  chairFrame: "#2B2B31",
  chairMesh: "#3C3C45",
  chairSeat: "#2B2B31",
  leaf: "#58A55E",
  leafDark: "#2F7A3D",
  pot: "#F6F3EC",
  potShade: "#E2DDD1",
  frameBorder: "#2B2B31",
  frameFill: "#F4F1EA",
  book1: "#7C8FB8",
  book2: "#E9D8B8",
  book3: "#B77A5A",
  glowColor: "#FFD7A0",
  glow: 0,
  dimColor: "#1A1020",
  dim: 0,
  sky: "#BFE0F7",
  skyLow: "#EAF6FD",
  cloud: "#FFFFFF",
  cloudOpacity: 0.9,
  celestial: "#FFE27A",
  celestialX: 0.74,
  celestialY: -0.2,
  celestialSize: 0.2,
  stars: 0,
  beamColor: "#FFFFFF",
  beam: 0.5,
};

export const DESKBACK_SORE: DeskBackPalette = {
  ...DESKBACK_DAY,
  wall: "#F1DCC6",
  wallShade: "#E0BE9F",
  baseboard: "#F3E4D2",
  floor: "#B98A5C",
  floorShade: "#A27547",
  rug: "#F5E9DA",
  rugShade: "#E0CDB5",
  deskTop: "#E4BC8A",
  deskTopEdge: "#CC9C63",
  deskSlab: "#D2A26B",
  curtain: "#C7A98B",
  curtainShade: "#AC8D70",
  screenBase: "#2A1B45",
  glow: 0.45,
  dimColor: "#5A2418",
  dim: 0.1,
  sky: "#F6A66E",
  skyLow: "#FFD9A8",
  cloud: "#FFE6CC",
  cloudOpacity: 0.85,
  celestial: "#FFB45A",
  celestialX: 0.7,
  celestialY: 0.72,
  celestialSize: 0.22,
  stars: 0,
  beamColor: "#FFC48A",
  beam: 0.5,
};

export const DESKBACK_MALAM: DeskBackPalette = {
  ...DESKBACK_DAY,
  wall: "#C9AE96",
  wallShade: "#A98B74",
  baseboard: "#D8C3AD",
  floor: "#B79B79",
  floorShade: "#9A7F5F",
  rug: "#FFF8EE",
  rugShade: "#EBDDC9",
  deskTop: "#F6F1E9",
  deskTopEdge: "#DCD3C6",
  deskSlab: "#E6DED2",
  deskLeg: "#F3EEE5",
  shelf: "#F6F1E9",
  curtain: "#46404B",
  curtainShade: "#322D38",
  windowFrame: "#E4DDD2",
  blinds: 1,
  chairFrame: "#C9CDD6",
  chairMesh: "#AEB3BF",
  chairSeat: "#D4D7DE",
  leaf: "#4E9A58",
  leafDark: "#2C6E3A",
  glowColor: "#FFB86B",
  glow: 1,
  dimColor: "#1C1024",
  dim: 0.42,
  sky: "#161A3A",
  skyLow: "#2C2F5E",
  cloud: "#4A4F86",
  cloudOpacity: 0.5,
  celestial: "#F3F0D8",
  celestialX: 0.7,
  celestialY: 0.22,
  celestialSize: 0.16,
  stars: 1,
  beamColor: "#A9B4FF",
  beam: 0.12,
};

export const DESKBACK_TIMES: Record<TimeOfDay, DeskBackPalette> = {
  siang: DESKBACK_DAY,
  sore: DESKBACK_SORE,
  malam: DESKBACK_MALAM,
};

// Nama waktu atau angka 0..1 (siang 0, sore 0.5, malam 1) menjadi palet.
export const deskBackPalette = (time: TimeOfDay | number): DeskBackPalette => blendTimes(DESKBACK_TIMES, time);
