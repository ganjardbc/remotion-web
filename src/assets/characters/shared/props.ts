import type React from "react";
import type { Gesture } from "./gestures";

// Ekspresi berwaktu: `at` dalam detik, urut naik. Bentuknya sama dengan `face` di rig 2D.
export type FaceKey<E extends string> = { readonly at: number; readonly expression: E };

// Props yang diterima SEMUA varian (rig, block, stickman) semua karakter.
export type CharacterProps<E extends string> = {
  // Tinggi karakter dalam px.
  readonly height?: number;
  readonly expression?: E;
  // Ganti ekspresi pada waktu tertentu (detik); menimpa `expression` setelah entri pertama.
  readonly face?: readonly FaceKey<E>[];
  readonly style?: React.CSSProperties;
};

// Tambahan untuk varian yang digerakkan lewat props (block dan stickman). Rig 2D digerakkan lewat `clips`.
export type PropDrivenProps<E extends string> = CharacterProps<E> & {
  readonly walk?: boolean;
  readonly wave?: boolean;
  // Gerak tangan; menimpa `wave`. Block hanya mendukung gerak lengan lurus (lihat blockArms).
  readonly gesture?: Gesture;
};

// Ekspresi aktif pada frame ini: entri `face` terakhir yang sudah lewat, atau `fallback` sebelum entri pertama.
export const expressionAt = <E extends string>(
  keys: readonly FaceKey<E>[] | undefined,
  fallback: E,
  frame: number,
  fps: number,
): E => {
  let current = fallback;
  if (!keys) return current;
  for (const k of keys) {
    if (Math.round(k.at * fps) <= frame) current = k.expression;
  }
  return current;
};
