// Jangkar meja kerja tampak belakang, kanvas tegak 1080x1920 (Reels). Kamera lurus di belakang karakter:
// dinding dan meja menghadap kamera, karakter duduk di kursi di depan meja. Semua dalam piksel kanvas.
export type DeskBackAnchors = {
  // Garis dinding bertemu lantai (batas bawah papan lantai dinding).
  readonly floorY: number;
  // Permukaan meja: tepi belakang (menempel dinding) dan tepi depan (dekat kamera), serta tebal papan.
  readonly deskBack: number;
  readonly deskFront: number;
  readonly slab: number;
  // Sumbu tengah kursi dan karakter.
  readonly seatX: number;
  // Atas dudukan kursi: tempat ujung bawah baju karakter bertumpu.
  readonly seatTop: number;
  // Tinggi karakter (px) dan titik teratas kotak karakter.
  readonly characterHeight: number;
  readonly characterTop: number;
  readonly monitor: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  readonly shelf: { readonly x: number; readonly y: number; readonly w: number };
  readonly window: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
};

export const DESKBACK_ANCHORS: DeskBackAnchors = {
  floorY: 1340,
  deskBack: 1090,
  deskFront: 1150,
  slab: 30,
  seatX: 400,
  seatTop: 1424,
  characterHeight: 1000,
  characterTop: 684,
  monitor: { x: 540, y: 740, w: 400, h: 250 },
  shelf: { x: 560, y: 440, w: 480 },
  window: { x: 36, y: 300, w: 230, h: 520 },
};
