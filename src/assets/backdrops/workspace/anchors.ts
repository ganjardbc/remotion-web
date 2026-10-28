// Titik jangkar ruang kerja, dalam piksel kanvas. Karakter dan perabot membaca jangkar yang sama,
// jadi kursi, meja, dan laptop selalu sejajar dengan karakter yang duduk di sana.
export type WorkspaceAnchors = {
  // Permukaan atas meja: garis tempat laptop dan gelas bertumpu, dan batas bawah badan karakter duduk.
  readonly deskTop: number;
  // Tebal papan atas meja.
  readonly slab: number;
  // Tepi bawah panel depan meja = garis lantai.
  readonly floorY: number;
  // Sumbu tengah kursi dan karakter yang duduk.
  readonly seatX: number;
  readonly laptopX: number;
  readonly laptopW: number;
  readonly laptopLidH: number;
  readonly mugX: number;
  readonly window: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  readonly clock: { readonly x: number; readonly y: number };
};

// Kanvas tegak 1080x1920 (Reels).
export const PORTRAIT_ANCHORS: WorkspaceAnchors = {
  deskTop: 1130,
  slab: 26,
  floorY: 1290,
  seatX: 290,
  // Laptop digeser ke kanan dari kursi, jadi badan karakter terlihat di sisi kirinya.
  laptopX: 410,
  laptopW: 240,
  laptopLidH: 150,
  mugX: 80,
  window: { x: 730, y: 500, w: 270, h: 290 },
  clock: { x: 120, y: 535 },
};
