// Waktu hari dan peralihannya, dipakai semua latar. Sumbu 0..1: siang 0, sore 0.5, malam 1.
export type TimeOfDay = "siang" | "sore" | "malam";

const ORDER: readonly TimeOfDay[] = ["siang", "sore", "malam"];

// Palet hanya berisi hex 6 digit (#RRGGBB) dan angka, supaya bisa diinterpolasi.
type Mixable = { readonly [key: string]: string | number };

const parseHex = (hex: string): readonly [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export const mixHex = (a: string, b: string, t: number): string => {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const c = (x: number, y: number): string => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
};

const mixRecord = <T extends Mixable>(a: T, b: T, t: number): T => {
  const out: Record<string, string | number> = {};
  for (const key of Object.keys(a)) {
    const x = a[key];
    const y = b[key];
    out[key] = typeof x === "number" && typeof y === "number" ? x + (y - x) * t : mixHex(x as string, y as string, t);
  }
  return out as T;
};

// Nama waktu atau angka 0..1 menjadi palet. Angka di luar rentang ditahan; angka di antara dua waktu diinterpolasi.
export const blendTimes = <T extends Mixable>(palettes: Readonly<Record<TimeOfDay, T>>, time: TimeOfDay | number): T => {
  if (typeof time === "string") return palettes[time];
  const pos = Math.max(0, Math.min(1, time)) * (ORDER.length - 1);
  const i = Math.min(ORDER.length - 2, Math.floor(pos));
  return mixRecord(palettes[ORDER[i]], palettes[ORDER[i + 1]], pos - i);
};

// Penyesuaian karakter agar terlihat berada di waktu yang sama: redup di malam, hangat di sore.
// Hanya kecerahan, saturasi, dan sepia, jadi warna dasar dan ekspresi tetap terbaca.
export type CharacterTone = { readonly brightness: number; readonly saturate: number; readonly sepia: number };

const TONES: Readonly<Record<TimeOfDay, CharacterTone>> = {
  siang: { brightness: 1, saturate: 1, sepia: 0 },
  sore: { brightness: 0.97, saturate: 1.1, sepia: 0.18 },
  malam: { brightness: 0.84, saturate: 0.85, sepia: 0 },
};

// Nilai `filter` CSS untuk pembungkus karakter.
export const characterFilter = (time: TimeOfDay | number): string => {
  const t = blendTimes(TONES, time);
  return `brightness(${t.brightness.toFixed(3)}) saturate(${t.saturate.toFixed(3)}) sepia(${t.sepia.toFixed(3)})`;
};
