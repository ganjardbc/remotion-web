// Kosakata ekspresi bersama. Setiap varian (rig, block, stickman) semua karakter wajib bisa menampilkan
// ke-11 ekspresi ini. Ekspresi di luar daftar ini (mis. `senyum`, `tertawa`) adalah tambahan khusus varian.
export const EXPRESSIONS = [
  "netral",
  "senang",
  "sedih",
  "kaget",
  "bingung",
  "mikir",
  "kesal",
  "marah",
  "serius",
  "malu",
  "mataTertutup",
] as const;

export type Expression = (typeof EXPRESSIONS)[number];
