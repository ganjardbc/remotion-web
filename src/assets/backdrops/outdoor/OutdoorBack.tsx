import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { blendTimes, Sky, type TimeOfDay } from "../shared";
import { OUTDOOR_DAY, OUTDOOR_MALAM, OUTDOOR_SORE, type OutdoorPalette } from "./palette";

// Jangkar latar luar ruang, dalam piksel kanvas: lebar kanvas, garis cakrawala (dasar gedung) dan garis jalan
// (kaki karakter). `floorY` harus di bawah `horizonY`. Lebar dari jangkar, bukan dari komposisi, supaya latar
// tetap benar saat ditanam (dan diperkecil) di dalam komposisi lain.
export type OutdoorAnchors = { readonly width: number; readonly horizonY: number; readonly floorY: number };

// Kanvas tegak 1080x1920.
export const PORTRAIT_OUTDOOR_ANCHORS: OutdoorAnchors = { width: 1080, horizonY: 1180, floorY: 1500 };

export const OUTDOOR_TIMES: Record<TimeOfDay, OutdoorPalette> = { siang: OUTDOOR_DAY, sore: OUTDOOR_SORE, malam: OUTDOOR_MALAM };
export const outdoorPalette = (time: TimeOfDay | number): OutdoorPalette => blendTimes(OUTDOOR_TIMES, time);

export type OutdoorProps = {
  readonly anchors?: OutdoorAnchors;
  // Waktu hari: nama, atau angka 0..1 (siang 0, sore 0.5, malam 1). Bawaan siang.
  readonly time?: TimeOfDay | number;
  readonly palette?: OutdoorPalette;
};

// Deretan gedung dari angka tetap (tanpa Math.random), supaya render sama di setiap frame.
// [lebar, tinggi] dalam piksel; digambar dari kiri ke kanan tanpa celah, dipotong di tepi kanvas.
export const OUTDOOR_BUILDINGS: readonly (readonly [number, number])[] = [
  [96, 250],
  [74, 360],
  [118, 210],
  [88, 410],
  [104, 300],
  [82, 190],
  [126, 340],
  [90, 270],
  [110, 380],
  [86, 230],
  [100, 320],
  [92, 200],
  [114, 290],
];

const WIN = { w: 12, h: 16, gapX: 10, gapY: 14, pad: 12 } as const;

// Jendela menyala: pola tetap dari indeks (bukan acak), sebagian gelap.
const lit = (bi: number, r: number, c: number): boolean => (bi * 7 + r * 5 + c * 3) % 4 !== 0;

const Building: React.FC<{ readonly index: number; readonly x: number; readonly w: number; readonly h: number; readonly base: number; readonly color: string; readonly p: OutdoorPalette; readonly windows: boolean }> = ({
  index,
  x,
  w,
  h,
  base,
  color,
  p,
  windows,
}) => {
  const cols = Math.max(1, Math.floor((w - WIN.pad * 2 + WIN.gapX) / (WIN.w + WIN.gapX)));
  const rows = Math.max(1, Math.floor((h - WIN.pad * 2 + WIN.gapY) / (WIN.h + WIN.gapY)));
  return (
    <div style={{ position: "absolute", left: x, top: base - h, width: w, height: h, backgroundColor: color }}>
      {windows && p.windowOpacity > 0.01 &&
        Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((__, c) =>
            lit(index, r, c) ? (
              <div
                key={`${r}-${c}`}
                style={{ position: "absolute", left: WIN.pad + c * (WIN.w + WIN.gapX), top: WIN.pad + r * (WIN.h + WIN.gapY), width: WIN.w, height: WIN.h, backgroundColor: p.windowLit, opacity: p.windowOpacity }}
              />
            ) : null,
          ),
        )}
    </div>
  );
};

// Langit, gedung (dua lapis), dan jalan. Gambar paling belakang; karakter berdiri di `floorY`.
export const OutdoorBack: React.FC<OutdoorProps> = ({ anchors: a = PORTRAIT_OUTDOOR_ANCHORS, time = "siang", palette }) => {
  const p = palette ?? outdoorPalette(time);
  const frame = useCurrentFrame();
  const { width } = a;
  // Lapisan jauh: gedung yang sama, digeser dan lebih tinggi; hanya siluet. Lapisan utama: jendela menyala di malam.
  const layout = (offset: number, scale: number, color: string, windows: boolean): readonly React.ReactNode[] =>
    OUTDOOR_BUILDINGS.reduce<{ readonly x: number; readonly items: readonly React.ReactNode[] }>(
      (acc, [w, h], i) => ({
        x: acc.x + w,
        items: [...acc.items, <Building key={i} index={i} x={acc.x + offset} w={w} h={h * scale} base={a.horizonY} color={color} p={p} windows={windows} />],
      }),
      { x: 0, items: [] },
    ).items;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: a.horizonY, overflow: "hidden" }}>
        <Sky p={p} width={width} drift={frame * 0.12} cloudScale={0.6} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: a.horizonY, overflow: "hidden" }}>{layout(-60, 1.25, p.buildingFar, false)}</div>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: a.horizonY, overflow: "hidden" }}>{layout(0, 1, p.building, true)}</div>
      {/* jalan dengan tepi trotoar dan marka putus-putus di garis kaki */}
      <div style={{ position: "absolute", left: 0, right: 0, top: a.horizonY, height: 22, backgroundColor: p.curb }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: a.horizonY + 22, bottom: 0, backgroundColor: p.ground }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: a.floorY + 150,
          height: 10,
          backgroundImage: `repeating-linear-gradient(90deg, ${p.groundLine} 0 90px, transparent 90px 170px)`,
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};
