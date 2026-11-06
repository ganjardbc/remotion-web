import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TokenBack, type TokenLayout } from "./TokenBack";
import type { DraftScene } from "./types";

// Latar "komputer" (Reels dialog): karakter berdiri di atas keyboard dan di belakangnya ada layar monitor. Isi layar = latar `token`
// (meter token, baris kode, warna mood) yang dipasang di dalam layar. Datar dan samar (kontras rendah, tanpa oranye, tanpa 3D),
// jadi ikut terskala bersama latar saat kamera zoom. Garis lantai karakter ada di PORTRAIT_PLAIN_ANCHORS.floorY (1400): kaki di tengah keyboard.
// Tuts menyala sebentar bergantian saat ada yang bicara (seperti mengetik).

const W = 1080;
const H = 1920;

// Monitor: bezel luar, layar dalam, leher.
const BEZEL = { x: -20, y: 400, w: 1200, h: 730, r: 36 } as const;
const SCREEN = { x: -22, y: 432, w: 1136, h: 666, r: 18 } as const;
// Meja: permukaan dari DESK_TOP ke bawah kanvas, tempat alas monitor dan keyboard bertumpu (tanpa ini monitor tampak melayang).
const DESK_TOP = 1245;
const NECK = { x: 500, y: 1130, w: 80, h: 160 } as const;
// Alas oval di kaki dudukan (seperti komputer all-in-one).
const BASE = { cx: 540, cy: 1298, rx: 230, ry: 24 } as const;
// Garis lantai karakter di latar ini: kaki berdiri di bagian bawah keyboard (bukan 1400 seperti latar polos).
export const COMPUTER_FLOOR_Y = 1500;

// Keyboard: trapesium (sisi jauh sempit, sisi dekat lebar), lima baris tuts.
// Jauh dari monitor (sisi jauh di y 1370, ada ruang untuk dudukan) dan lebar: sisi dekat melewati tepi kanvas seperti keyboard yang terpotong.
const KB = { topY: 1400, botY: 1600, topL: 20, topR: 1060, botL: -100, botR: 1180 } as const;
const ROWS = [15, 14, 13, 12, 8] as const;
const ROW_Y0 = 1418;
const ROW_PITCH = 36;
const KEY_H = 28;
const GAP = 7;

const layout: TokenLayout = {
  meter: { x: SCREEN.x + 60, y: SCREEN.y + 90, w: SCREEN.w - 120, h: 52 },
  code: { x: SCREEN.x + 60, top: SCREEN.y + 220, w: SCREEN.w - 120, rows: 10 },
  wash: { x: SCREEN.x, y: SCREEN.y, w: SCREEN.w, h: SCREEN.h },
  radius: SCREEN.r,
};

const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
const edgeAt = (y: number): { readonly l: number; readonly r: number } => {
  const p = (y - KB.topY) / (KB.botY - KB.topY);
  return { l: lerp(KB.topL, KB.botL, p), r: lerp(KB.topR, KB.botR, p) };
};
const hash = (n: number): number => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;

type Key = { readonly x: number; readonly y: number; readonly w: number };
// Posisi semua tuts. Baris terakhir: spasi panjang di tengah dengan tuts kecil di kedua sisinya.
const KEYS: readonly Key[] = ROWS.flatMap((n, r) => {
  const y = ROW_Y0 + r * ROW_PITCH;
  const { l, r: rt } = edgeAt(y + KEY_H / 2);
  const span = rt - l - 40;
  const x0 = l + 20;
  if (r === ROWS.length - 1) {
    const small = (n - 1) / 2;
    const space = span * 0.42;
    const sw = (span - space - GAP * (n - 1)) / (n - 1);
    return Array.from({ length: n }, (_, i) => {
      if (i < small) return { x: x0 + i * (sw + GAP), y, w: sw };
      if (i === small) return { x: x0 + small * (sw + GAP), y, w: space };
      return { x: x0 + small * (sw + GAP) + space + GAP + (i - small - 1) * (sw + GAP), y, w: sw };
    });
  }
  const kw = (span - GAP * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (kw + GAP), y, w: kw }));
});

const KEY_RATE = 9;

export const ComputerBack: React.FC<{ readonly scene: DraftScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const speaking = scene.lines.some((l) => now >= l.from && now < l.from + l.dur - 0.1);

  // Tuts yang menyala: tiga ketukan terakhir (indeks semu), makin lama makin redup.
  const tick = Math.floor(now * KEY_RATE);
  const frac = now * KEY_RATE - tick;
  const lit = new Map<number, number>();
  if (speaking) {
    for (let k = 0; k < 3; k += 1) {
      const idx = Math.floor(hash(tick - k) * KEYS.length);
      lit.set(idx, Math.max(lit.get(idx) ?? 0, 1 - (k + frac) / 3));
    }
  }

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={0} y={DESK_TOP} width={W} height={H - DESK_TOP} fill="rgba(16,20,38,0.96)" />
        <rect x={0} y={DESK_TOP} width={W} height={22} fill="rgba(255,255,255,0.05)" />
        <line x1={0} y1={DESK_TOP} x2={W} y2={DESK_TOP} stroke="rgba(255,255,255,0.14)" strokeWidth={4} />
        <ellipse cx={BASE.cx} cy={BASE.cy} rx={BASE.rx} ry={BASE.ry} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" strokeWidth={3} />
        <rect x={NECK.x} y={NECK.y} width={NECK.w} height={NECK.h} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" strokeWidth={3} />
        <rect x={BEZEL.x} y={BEZEL.y} width={BEZEL.w} height={BEZEL.h} rx={BEZEL.r} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth={4} />
        <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={SCREEN.r} fill="rgba(6,9,20,0.62)" />
        <circle cx={W / 2} cy={BEZEL.y + 16} r={5} fill="rgba(255,255,255,0.20)" />
      </svg>

      <TokenBack scene={scene} layout={layout} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon
          points={`${KB.topL},${KB.topY} ${KB.topR},${KB.topY} ${KB.botR},${KB.botY} ${KB.botL},${KB.botY}`}
          fill="rgba(14,18,36,0.92)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {KEYS.map((k, i) => {
          const glow = lit.get(i) ?? 0;
          return (
            <rect
              key={i}
              x={k.x}
              y={k.y + glow * 3}
              width={k.w}
              height={KEY_H}
              rx={8}
              fill={`rgba(255,255,255,${0.07 + 0.22 * glow})`}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth={2}
            />
          );
        })}
      </svg>
    </div>
  );
};
