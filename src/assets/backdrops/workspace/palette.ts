// Warna dan tampilan ruang kerja. Satu palet per waktu hari; perabot (meja, kursi, laptop) ikut karena
// warnanya bagian palet. Semua warna hex 6 digit (#RRGGBB) supaya bisa diinterpolasi antar waktu.
export type WorkspacePalette = {
  readonly wall: string;
  readonly wallShade: string;
  readonly baseboard: string;
  readonly floor: string;
  readonly deskTop: string;
  readonly deskTopEdge: string;
  readonly deskFront: string;
  readonly chair: string;
  readonly chairEdge: string;
  readonly chairAccent: string;
  readonly laptop: string;
  readonly laptopEdge: string;
  // Jendela: langit atas ke bawah, bingkai, awan, benda langit (matahari atau bulan), bintang.
  readonly sky: string;
  readonly skyLow: string;
  readonly frame: string;
  readonly cloud: string;
  readonly cloudOpacity: number;
  readonly celestial: string;
  // Posisi pusat benda langit di dalam jendela, 0..1 dari kiri atas.
  readonly celestialX: number;
  readonly celestialY: number;
  readonly celestialSize: number;
  readonly stars: number;
  // Sorot cahaya jendela ke dalam ruangan.
  readonly beamColor: string;
  readonly beam: number;
  // Warna yang biasanya mengikuti tema video: wajah jam, jarum jam, titik tengah jam, logo laptop.
  readonly clockFace: string;
  readonly clockInk: string;
  readonly clockAccent: string;
  readonly laptopLogo: string;
  // Penyesuaian karakter agar terlihat berada di waktu yang sama (lihat `characterFilter`).
  readonly charBrightness: number;
  readonly charSaturate: number;
  readonly charSepia: number;
};

export const WORKSPACE_DAY: WorkspacePalette = {
  wall: "#F3EADF",
  wallShade: "#EADFCF",
  baseboard: "#DCCBB4",
  floor: "#231E30",
  deskTop: "#E2B27A",
  deskTopEdge: "#C98F55",
  deskFront: "#B9824B",
  chair: "#8A2630",
  chairEdge: "#3D0F14",
  chairAccent: "#E5484D",
  laptop: "#D9DDE8",
  laptopEdge: "#B4BACB",
  sky: "#BFE0F7",
  skyLow: "#E9F5FD",
  frame: "#FFFFFF",
  cloud: "#FFFFFF",
  cloudOpacity: 0.9,
  celestial: "#FFE27A",
  celestialX: 0.78,
  celestialY: -0.3,
  celestialSize: 0.17,
  stars: 0,
  beamColor: "#FFFFFF",
  beam: 0.55,
  clockFace: "#FFFFFF",
  clockInk: "#14141F",
  clockAccent: "#E5484D",
  laptopLogo: "#4F46E5",
  charBrightness: 1,
  charSaturate: 1,
  charSepia: 0,
};

export const WORKSPACE_SORE: WorkspacePalette = {
  wall: "#EFD7C0",
  wallShade: "#E0BB9B",
  baseboard: "#C9A98A",
  floor: "#2A1F2E",
  deskTop: "#D79A62",
  deskTopEdge: "#B97A44",
  deskFront: "#A8703F",
  chair: "#7E2432",
  chairEdge: "#35101A",
  chairAccent: "#D8484E",
  laptop: "#D6D0DB",
  laptopEdge: "#B0A6B8",
  sky: "#7A6BB5",
  skyLow: "#FFB98A",
  frame: "#FFF1E4",
  cloud: "#FFD0B0",
  cloudOpacity: 0.85,
  celestial: "#FF8A3D",
  celestialX: 0.3,
  celestialY: 0.78,
  celestialSize: 0.24,
  stars: 0,
  beamColor: "#FFB36B",
  beam: 0.55,
  clockFace: "#FFF4EA",
  clockInk: "#14141F",
  clockAccent: "#E5484D",
  laptopLogo: "#4F46E5",
  charBrightness: 0.97,
  charSaturate: 1.1,
  charSepia: 0.18,
};

export const WORKSPACE_MALAM: WorkspacePalette = {
  wall: "#2A2D45",
  wallShade: "#1F2238",
  baseboard: "#3A3D5A",
  floor: "#100E1A",
  deskTop: "#8C6A4E",
  deskTopEdge: "#6E5039",
  deskFront: "#6B4B33",
  chair: "#5A1B26",
  chairEdge: "#240A0E",
  chairAccent: "#B03A40",
  laptop: "#8E94AA",
  laptopEdge: "#6D7390",
  sky: "#0E1430",
  skyLow: "#26305A",
  frame: "#A9AEC4",
  cloud: "#5A648F",
  cloudOpacity: 0.35,
  celestial: "#F4F1DE",
  celestialX: 0.72,
  celestialY: 0.22,
  celestialSize: 0.14,
  stars: 1,
  beamColor: "#7F9CFF",
  beam: 0.12,
  clockFace: "#D8DCEB",
  clockInk: "#14141F",
  clockAccent: "#E5484D",
  laptopLogo: "#4F46E5",
  charBrightness: 0.84,
  charSaturate: 0.85,
  charSepia: 0,
};
