// Gaya sketsa untuk karakter stickman: kertas, garis tipis, tanpa gradasi. Palet hanya hex 6 digit dan angka.
// Garis tetap gelap di semua waktu (seperti stickman); malam = kertas ungu temaram, bukan hitam,
// supaya garis dan wajah karakter tetap terbaca.
export type SketchPalette = {
  readonly paper: string;
  // Bidang bawah horizon / lantai, sedikit lebih gelap dari kertas.
  readonly paperShade: string;
  readonly ink: string;
  // Garis sekunder: jendela gedung, marka jalan, awan.
  readonly inkSoft: string;
  // Warna isi jendela menyala dan matahari/bulan.
  readonly accent: string;
  // Posisi pusat benda langit 0..1 dari kiri atas langit, ukurannya sebagai pecahan lebar, dan kecerahan bintang.
  readonly celestialX: number;
  readonly celestialY: number;
  readonly celestialSize: number;
  readonly stars: number;
  // Jendela gedung menyala 0..1.
  readonly windowOpacity: number;
};

export const SKETCH_DAY: SketchPalette = {
  paper: "#FBFAF6",
  paperShade: "#EFECE3",
  ink: "#232540",
  inkSoft: "#8A8CA6",
  accent: "#FFC94D",
  celestialX: 0.76,
  celestialY: 0.16,
  celestialSize: 0.13,
  stars: 0,
  windowOpacity: 0,
};

export const SKETCH_SORE: SketchPalette = {
  paper: "#F8E6D6",
  paperShade: "#EBCDB4",
  ink: "#2A2038",
  inkSoft: "#9A8494",
  accent: "#FF9A4D",
  celestialX: 0.3,
  celestialY: 0.88,
  celestialSize: 0.2,
  stars: 0,
  windowOpacity: 0.4,
};

export const SKETCH_MALAM: SketchPalette = {
  paper: "#BFC4E2",
  paperShade: "#A5ABD0",
  ink: "#232540",
  inkSoft: "#6D7399",
  accent: "#FFE08A",
  celestialX: 0.72,
  celestialY: 0.16,
  celestialSize: 0.1,
  stars: 1,
  windowOpacity: 1,
};
