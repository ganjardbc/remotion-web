// Warna ruang kerja. Satu palet per waktu hari; perabot (meja, kursi, laptop) ikut karena warnanya bagian palet.
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
  readonly sky: string;
  readonly skyLow: string;
  readonly frame: string;
  // Warna yang biasanya mengikuti tema video: jarum jam, titik tengah jam, logo laptop.
  readonly clockInk: string;
  readonly clockAccent: string;
  readonly laptopLogo: string;
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
  clockInk: "#14141F",
  clockAccent: "#E5484D",
  laptopLogo: "#4F46E5",
};
