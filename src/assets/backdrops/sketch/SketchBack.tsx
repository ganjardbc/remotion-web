import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { OUTDOOR_BUILDINGS, PORTRAIT_OUTDOOR_ANCHORS, type OutdoorAnchors } from "../outdoor";
import { PORTRAIT_PLAIN_ANCHORS, type PlainAnchors } from "../plain";
import { blendTimes, type TimeOfDay } from "../shared";
import { wobblyLine, wobblyRect } from "./lines";
import { SKETCH_DAY, SKETCH_MALAM, SKETCH_SORE, type SketchPalette } from "./palette";

export const SKETCH_TIMES: Record<TimeOfDay, SketchPalette> = { siang: SKETCH_DAY, sore: SKETCH_SORE, malam: SKETCH_MALAM };
export const sketchPalette = (time: TimeOfDay | number): SketchPalette => blendTimes(SKETCH_TIMES, time);

// Tebal garis latar; sedikit di bawah garis stickman di kanvas 1080 lebar, supaya karakter tetap yang paling tegas.
const LINE = 7;

export type SketchProps<A> = {
  // Jangkar sama dengan latar rig, jadi mengganti gaya tidak menggeser karakter.
  readonly anchors?: A;
  // Waktu hari: nama, atau angka 0..1 (siang 0, sore 0.5, malam 1). Bawaan siang.
  readonly time?: TimeOfDay | number;
  readonly palette?: SketchPalette;
};

const stroke = (p: SketchPalette, width = LINE) => ({ fill: "none", stroke: p.ink, strokeWidth: width, strokeLinecap: "round", strokeLinejoin: "round" }) as const;

// Kertas polos dengan garis lantai tangan dan arsiran pendek di bawah karakter.
export const PlainSketch: React.FC<SketchProps<PlainAnchors>> = ({ anchors: a = PORTRAIT_PLAIN_ANCHORS, time = "siang", palette }) => {
  const p = palette ?? sketchPalette(time);
  const hatch = Array.from({ length: 9 }, (_, i) => {
    const x = a.spotX - 200 + i * 50;
    return wobblyLine(x, a.floorY + 22, x - 26, a.floorY + 56, i, 1.2, 40);
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, backgroundColor: p.paper }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: a.floorY, bottom: 0, backgroundColor: p.paperShade }} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMin slice">
        <path d={wobblyLine(0, a.floorY, 1080, a.floorY, 3)} {...stroke(p)} />
        <path d={hatch.join(" ")} {...stroke(p, 4)} stroke={p.inkSoft} />
      </svg>
    </AbsoluteFill>
  );
};

const cloudPath = (x: number, y: number, s: number): string =>
  `M${x} ${y + 34 * s} Q${x - 8 * s} ${y + 12 * s} ${x + 20 * s} ${y + 14 * s} Q${x + 26 * s} ${y - 10 * s} ${x + 54 * s} ${y + 4 * s} Q${x + 76 * s} ${y - 8 * s} ${x + 88 * s} ${y + 16 * s} Q${x + 112 * s} ${y + 14 * s} ${x + 108 * s} ${y + 34 * s} Z`;

// Matahari: lingkaran dengan sinar pendek. Bulan: sabit. Memilih bentuk dari waktu: malam = bulan.
const Celestial: React.FC<{ readonly cx: number; readonly cy: number; readonly r: number; readonly moon: boolean; readonly p: SketchPalette }> = ({ cx, cy, r, moon, p }) => {
  if (moon) {
    return <path d={`M${cx} ${cy - r} A${r} ${r} 0 1 0 ${cx} ${cy + r} A${r * 0.72} ${r * 0.72} 0 1 1 ${cx} ${cy - r} Z`} {...stroke(p)} fill={p.accent} />;
  }
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return `M${cx + Math.cos(a) * r * 1.35} ${cy + Math.sin(a) * r * 1.35} L${cx + Math.cos(a) * r * 1.75} ${cy + Math.sin(a) * r * 1.75}`;
  });
  return (
    <>
      <circle cx={cx} cy={cy} r={r} {...stroke(p)} fill={p.accent} />
      <path d={rays.join(" ")} {...stroke(p, 5)} />
    </>
  );
};

const STAR_POS: readonly (readonly [number, number])[] = [
  [0.14, 0.1],
  [0.36, 0.28],
  [0.52, 0.08],
  [0.2, 0.46],
  [0.62, 0.4],
  [0.88, 0.5],
  [0.44, 0.6],
  [0.78, 0.06],
  [0.06, 0.32],
];

// Kertas dengan siluet kota bergaris, matahari atau bulan, awan, dan jalan. Gambar paling belakang.
export const OutdoorSketch: React.FC<SketchProps<OutdoorAnchors>> = ({ anchors: a = PORTRAIT_OUTDOOR_ANCHORS, time = "siang", palette }) => {
  const p = palette ?? sketchPalette(time);
  const frame = useCurrentFrame();
  const { width, horizonY } = a;
  const moon = typeof time === "string" ? time === "malam" : time > 0.75;
  const drift = (frame * 0.4) % (width + 260);
  let x = 0;
  const buildings = OUTDOOR_BUILDINGS.map(([w, h], i) => {
    const left = x;
    x += w;
    const cols = Math.max(1, Math.floor((w - 24 + 12) / 26));
    const rows = Math.max(1, Math.floor((h - 24 + 14) / 34));
    const wins = Array.from({ length: rows }).flatMap((_, r) =>
      Array.from({ length: cols }).map((__, c) => ({ r, c, on: (i * 7 + r * 5 + c * 3) % 4 !== 0 })),
    );
    return (
      <g key={i}>
        <path d={wobblyRect(left, horizonY - h, w, h, i)} {...stroke(p)} fill={p.paper} />
        {wins.map(({ r, c, on }) => (
          <rect key={`${r}-${c}`} x={left + 12 + c * 26} y={horizonY - h + 14 + r * 34} width={14} height={18} rx={2} fill={on ? p.accent : "none"} fillOpacity={on ? p.windowOpacity : 0} stroke={p.inkSoft} strokeWidth={2.5} />
        ))}
      </g>
    );
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, backgroundColor: p.paper }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: horizonY, bottom: 0, backgroundColor: p.paperShade }} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={width} height="100%" viewBox={`0 0 ${width} 1920`} preserveAspectRatio="xMidYMin slice">
        {p.stars > 0.01 &&
          STAR_POS.map(([sx, sy], i) => (
            <path key={i} d={`M${sx * width - 9} ${sy * horizonY} h18 M${sx * width} ${sy * horizonY - 9} v18`} {...stroke(p, 3)} opacity={p.stars} />
          ))}
        <Celestial cx={p.celestialX * width} cy={p.celestialY * horizonY} r={p.celestialSize * width * 0.5} moon={moon} p={p} />
        <path d={cloudPath(((140 + drift) % (width + 260)) - 130, 190, 2.4)} {...stroke(p, 5)} stroke={p.inkSoft} fill={p.paper} />
        <path d={cloudPath(((560 + drift) % (width + 260)) - 130, 380, 1.7)} {...stroke(p, 5)} stroke={p.inkSoft} fill={p.paper} />
        {buildings}
        <path d={wobblyLine(0, horizonY, width, horizonY, 9)} {...stroke(p)} />
        <path d={`M0 ${a.floorY + 150} H${width}`} {...stroke(p, 6)} stroke={p.inkSoft} strokeDasharray="70 60" />
      </svg>
    </AbsoluteFill>
  );
};
