import { WORKSPACE_DAY, WORKSPACE_MALAM, WORKSPACE_SORE, type WorkspacePalette } from "./palette";

export type TimeOfDay = "siang" | "sore" | "malam";

export const WORKSPACE_TIMES: Record<TimeOfDay, WorkspacePalette> = {
  siang: WORKSPACE_DAY,
  sore: WORKSPACE_SORE,
  malam: WORKSPACE_MALAM,
};

// Urutan waktu pada sumbu 0..1: siang 0, sore 0.5, malam 1. Angka di antaranya = peralihan halus.
const ORDER: readonly TimeOfDay[] = ["siang", "sore", "malam"];

const parseHex = (hex: string): readonly [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const mixHex = (a: string, b: string, t: number): string => {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const c = (x: number, y: number): string => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
};

const mixPalette = (a: WorkspacePalette, b: WorkspacePalette, t: number): WorkspacePalette => {
  const out: Record<string, string | number> = {};
  for (const key of Object.keys(a) as (keyof WorkspacePalette)[]) {
    const x = a[key];
    const y = b[key];
    out[key] = typeof x === "number" && typeof y === "number" ? x + (y - x) * t : mixHex(x as string, y as string, t);
  }
  return out as unknown as WorkspacePalette;
};

// Nama waktu atau angka 0..1 (siang 0, sore 0.5, malam 1) menjadi palet. Angka di luar rentang ditahan.
export const workspacePalette = (time: TimeOfDay | number): WorkspacePalette => {
  if (typeof time === "string") return WORKSPACE_TIMES[time];
  const pos = Math.max(0, Math.min(1, time)) * (ORDER.length - 1);
  const i = Math.min(ORDER.length - 2, Math.floor(pos));
  return mixPalette(WORKSPACE_TIMES[ORDER[i]], WORKSPACE_TIMES[ORDER[i + 1]], pos - i);
};

// Nilai `filter` CSS untuk pembungkus karakter, supaya karakter ikut redup di malam dan hangat di sore.
// Hanya kecerahan, saturasi, dan sepia: warna dasar karakter dan ekspresi tetap terbaca.
export const characterFilter = (time: TimeOfDay | number): string => {
  const p = workspacePalette(time);
  return `brightness(${p.charBrightness.toFixed(3)}) saturate(${p.charSaturate.toFixed(3)}) sepia(${p.charSepia.toFixed(3)})`;
};
