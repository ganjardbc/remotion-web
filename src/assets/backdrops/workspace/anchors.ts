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

// Kanvas lanskap 1920x1080. Perabot dan karakter ruang kerja dirancang untuk kanvas tegak, jadi ruang lanskap
// digambar pada kanvas "dalam" yang lebih besar (LANDSCAPE_INNER) lalu diperkecil LANDSCAPE_SCALE kali ke 1920x1080.
// Jangkar di bawah dalam piksel kanvas dalam itu; proporsi perabot dan karakter sama seperti kanvas tegak.
export const LANDSCAPE_SCALE = 0.7;
export const LANDSCAPE_INNER = { width: Math.round(1920 / LANDSCAPE_SCALE), height: Math.round(1080 / LANDSCAPE_SCALE) } as const;

export const LANDSCAPE_ANCHORS: WorkspaceAnchors = {
  deskTop: 1130,
  slab: 26,
  floorY: 1290,
  // Karakter duduk di kiri tengah; laptop di sisi kanannya, jendela di dinding kanan.
  seatX: 1100,
  laptopX: 1220,
  laptopW: 240,
  laptopLidH: 150,
  mugX: 880,
  window: { x: 1850, y: 380, w: 420, h: 440 },
  clock: { x: 640, y: 470 },
};

// Titik di kanvas dalam (piksel) menjadi titik di layar lanskap 1920x1080 (pusat bidikan kamera).
export const landscapePoint = (x: number, y: number): { readonly x: number; readonly y: number } => ({ x: x * LANDSCAPE_SCALE, y: y * LANDSCAPE_SCALE });
