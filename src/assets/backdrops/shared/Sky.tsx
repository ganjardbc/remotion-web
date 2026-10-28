import type React from "react";
import { useCurrentFrame } from "remotion";

// Langit: benda langit (matahari atau bulan), bintang, dan awan. Dipakai jendela ruang kerja dan latar luar ruang.
export type SkyPalette = {
  readonly sky: string;
  readonly skyLow: string;
  readonly cloud: string;
  readonly cloudOpacity: number;
  readonly celestial: string;
  // Posisi pusat benda langit, 0..1 dari kiri atas kotak langit.
  readonly celestialX: number;
  readonly celestialY: number;
  // Diameter benda langit sebagai pecahan lebar kotak.
  readonly celestialSize: number;
  // Kecerahan bintang 0..1.
  readonly stars: number;
};

// Posisi bintang (0..1), kelap-kelip pelan; terlihat hanya bila `stars` > 0.
const STARS: readonly (readonly [number, number, number])[] = [
  [0.14, 0.12, 0],
  [0.34, 0.3, 1.3],
  [0.52, 0.1, 2.1],
  [0.2, 0.5, 0.7],
  [0.62, 0.42, 1.8],
  [0.86, 0.5, 2.9],
  [0.42, 0.62, 0.4],
  [0.74, 0.08, 1.1],
  [0.06, 0.34, 2.4],
  [0.92, 0.26, 0.2],
];

// Awan dirancang pada kotak selebar 242; ukurannya mengikuti lebar kotak sebenarnya.
const CLOUD_REF_W = 242;
const CLOUDS: readonly { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly o: number }[] = [
  { x: 28, y: 40, w: 90, h: 30, o: 1 },
  { x: 120, y: 80, w: 70, h: 24, o: 0.9 },
];

// Mengisi kotak induk (position relative atau absolute) selebar `width` px. `drift` = geser awan dalam satuan rancangan
// (dari frame); `cloudScale` memperkecil awan tanpa menggeser posisinya.
export const Sky: React.FC<{ readonly p: SkyPalette; readonly width: number; readonly drift?: number; readonly cloudScale?: number }> = ({ p, width, drift = 0, cloudScale = 1 }) => {
  const frame = useCurrentFrame();
  const size = width * p.celestialSize;
  const k = width / CLOUD_REF_W;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${p.sky}, ${p.skyLow})` }} />
      {p.stars > 0.01 &&
        STARS.map(([x, y, phase]) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: 5 * Math.max(1, k * 0.5), height: 5 * Math.max(1, k * 0.5), borderRadius: "50%", backgroundColor: "#FFFFFF", opacity: p.stars * (0.55 + 0.45 * Math.sin(frame / 20 + phase)) }} />
        ))}
      <div style={{ position: "absolute", left: `${p.celestialX * 100}%`, top: `${p.celestialY * 100}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, borderRadius: "50%", backgroundColor: p.celestial, boxShadow: `0 0 ${size * 0.6}px ${p.celestial}` }} />
      {CLOUDS.map((c) => (
        <div key={c.x} style={{ position: "absolute", left: (c.x + drift) * k, top: c.y * k, width: c.w * k * cloudScale, height: c.h * k * cloudScale, borderRadius: 20 * k * cloudScale, backgroundColor: p.cloud, opacity: p.cloudOpacity * c.o }} />
      ))}
    </>
  );
};
