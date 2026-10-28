import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Laptop dilihat dari belakang tangan pengetik, dengan kamera berputar `yaw` derajat (bawaan -30). Bukan model 3D karakter:
// hanya benda datar (alas keyboard, tangan tampak atas, layar) yang diletakkan pada bidang CSS 3D, jadi sudutnya nyata
// untuk benda-benda itu. Layar menampilkan `screen` (Terminal, CodeEditor, BrowserMock). Hanya bergantung pada `useCurrentFrame()`.

const DECK = { w: 1100, d: 640 } as const;
const SCREEN_H = 700;
const HOODIE = "#2a2c3e";
const INK = "#232540";
const KEY_ROWS = 5;
const KEY_COLS = 14;

// Indeks tombol yang sedang ditekan pada waktu t: tiga jari bergantian, pola tetap (bukan acak) tetapi tak berulang kasat mata.
const pressedKeys = (t: number): ReadonlySet<number> => {
  const out = new Set<number>();
  for (let k = 0; k < 3; k++) {
    const slot = Math.floor(t * 9 + k * 7);
    out.add((slot * 37 + k * 23) % (KEY_ROWS * KEY_COLS));
  }
  return out;
};

const Hand: React.FC<{ readonly cx: number; readonly cy: number; readonly side: 1 | -1; readonly t: number; readonly typing: boolean; readonly phase: number }> = ({ cx, cy, side, t, typing, phase }) => {
  const stroke = { stroke: INK, strokeWidth: 7, strokeLinejoin: "round", strokeLinecap: "round" } as const;
  const fingers = [-46, -16, 14, 44].map((x, i) => {
    const press = typing ? Math.max(0, Math.sin(t * Math.PI * 2 * 3.1 + phase + i * 1.7)) : 0;
    return { x, len: 76 - press * 16 };
  });
  return (
    <g transform={`translate(${cx} ${cy + (typing ? Math.sin(t * 9 + phase) * 3 : 0)})`}>
      <rect x={-66} y={96} width={132} height={560} rx={34} fill={HOODIE} {...stroke} />
      {fingers.map((f) => (
        <rect key={f.x} x={f.x - 13} y={-10 - f.len} width={26} height={f.len + 20} rx={13} fill="#fff" {...stroke} />
      ))}
      <rect x={-58} y={-10} width={116} height={124} rx={44} fill="#fff" {...stroke} />
      {/* jempol di sisi dalam (menghadap tangan satunya), bukan di sisi luar */}
      <ellipse cx={-side * 72} cy={44} rx={17} ry={32} transform={`rotate(${-side * 28} ${-side * 72} 44)`} fill="#fff" {...stroke} />
    </g>
  );
};

const Keyboard: React.FC<{ readonly t: number; readonly typing: boolean }> = ({ t, typing }) => {
  const down = typing ? pressedKeys(t) : new Set<number>();
  return (
    <>
      {Array.from({ length: KEY_ROWS * KEY_COLS }).map((_, i) => {
        const r = Math.floor(i / KEY_COLS);
        const c = i % KEY_COLS;
        return <rect key={i} x={70 + c * 68.5} y={190 + r * 66} width={60} height={56} rx={9} fill={down.has(i) ? "#42b883" : "#eef0f6"} stroke="#9aa1b8" strokeWidth={3} />;
      })}
      <rect x={430} y={540} width={240} height={80} rx={14} fill="#bfc5d6" stroke="#9aa1b8" strokeWidth={3} />
    </>
  );
};

export const LaptopFromBehind: React.FC<{
  readonly screen: React.ReactNode;
  // Putar kamera mengelilingi laptop (derajat); 0 = tepat dari belakang, negatif = dari kiri-belakang.
  readonly yaw?: number;
  // Kemiringan kamera dari atas (derajat).
  readonly pitch?: number;
  readonly zoom?: number;
  readonly typing?: boolean;
  // Bayangan bahu dan kepala yang kabur di tepi kiri bawah, penanda "dari balik bahu".
  readonly shoulder?: boolean;
  readonly width?: number;
  readonly height?: number;
}> = ({ screen, yaw = -30, pitch = 20, zoom = 0.82, typing = true, shoulder = true, width, height }) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const W = width ?? cfg.width;
  const H = height ?? cfg.height;
  const t = frame / cfg.fps;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: "linear-gradient(#2b2f45, #151726)", perspective: 1700, perspectiveOrigin: "50% 35%" }}>
      <div style={{ position: "absolute", left: W / 2, top: H * 0.74, width: 0, height: 0, transformStyle: "preserve-3d", transform: `scale(${zoom}) rotateX(${-pitch}deg) rotateY(${yaw}deg)` }}>
        {/* meja kayu */}
        <div style={{ position: "absolute", left: -2400, top: -2400, width: 4800, height: 4800, transform: "translateY(14px) rotateX(90deg)", background: "linear-gradient(90deg, #cf9a62, #dba972 40%, #cf9a62)" }} />
        {/* alas keyboard dengan tombol dan tangan (tampak atas, pada bidang mendatar) */}
        <div style={{ position: "absolute", left: -DECK.w / 2, top: -DECK.d / 2, width: DECK.w, height: DECK.d, transform: "rotateX(90deg)", background: "#c9ceda", borderRadius: 34, boxShadow: "0 0 0 8px #aab0c4" }}>
          <svg width={DECK.w} height={DECK.d} viewBox={`0 0 ${DECK.w} ${DECK.d}`} style={{ overflow: "visible", display: "block" }}>
            <Keyboard t={t} typing={typing} />
            <Hand cx={420} cy={300} side={-1} t={t} typing={typing} phase={0} />
            <Hand cx={690} cy={300} side={1} t={t} typing={typing} phase={2.2} />
          </svg>
        </div>
        {/* layar berdiri di tepi belakang alas, sedikit condong ke belakang */}
        <div style={{ position: "absolute", left: -DECK.w / 2, top: -SCREEN_H, width: DECK.w, height: SCREEN_H, transformOrigin: "50% 100%", transform: `translateZ(${-DECK.d / 2}px) rotateX(10deg)` }}>
          <div style={{ width: "100%", height: "100%", background: "#0b0c10", borderRadius: 26, padding: 20, boxSizing: "border-box", boxShadow: "0 0 0 6px #aab0c4" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 10, overflow: "hidden", position: "relative" }}>{screen}</div>
          </div>
        </div>
      </div>
      {shoulder && <div style={{ position: "absolute", left: -300, bottom: -330, width: 640, height: 560, borderRadius: "46% 54% 40% 40%", background: "#1c1e2c", filter: "blur(14px)", opacity: 0.7 }} />}
    </div>
  );
};
