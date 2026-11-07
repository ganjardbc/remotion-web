import type React from "react";
import type { BlockSet } from "./types";

// Dunia diorama: lapisan datar di kedalaman berbeda. Kamera menggeser dan memperbesar tiap lapisan dengan faktor `p`
// (0 = jauh, 1 = bidang fokus tempat karakter berdiri, > 1 = di depan fokus), jadi geser kamera memberi paralaks dan
// zoom memberi kesan 3D tanpa render 3D. Lapisan jauh dan depan di-blur seperti kedalaman bidang (depth of field).

export const W = 1080;
export const H = 1920;
// Tepi jauh permukaan meja, tepi depannya, dan garis lantai karakter.
export const DESK_TOP = 1190;
export const DESK_FRONT = 1450;
export const FLOOR_BEHIND = 1365;
export const FLOOR_ON_DESK = 1330;

export type LayerCam = { readonly tx: number; readonly ty: number; readonly z: number };

const rnd = (i: number): number => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

// ---------- Lapisan ----------

export const Layer: React.FC<{ readonly cam: LayerCam; readonly p: number; readonly children: React.ReactNode }> = ({ cam, p, children }) => {
  const zl = 1 + (cam.z - 1) * p;
  const dof = Math.abs(1 - p) * (2 + (cam.z - 1) * 2.2) * (p > 1 ? 1.8 : 1);
  const blur = Math.min(18, dof);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: H,
        transformOrigin: "0 0",
        transform: `translate(${cam.tx * p}px, ${cam.ty * p}px) scale(${zl})`,
        filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// ---------- Spesifikasi set ----------

type SetSpec = {
  readonly bg: string;
  readonly deskTop: string;
  readonly deskFront: string;
  readonly deskEdge: string;
  // Filter untuk karakter (menyatukan pencahayaan dengan dunia).
  readonly filter: string;
  // Cahaya hangat dari depan-kiri dan vinyet.
  readonly key: string;
  readonly vignette: number;
  readonly screen: string;
  readonly Far: React.FC;
  readonly Mid: React.FC;
};

const abs: React.CSSProperties = { position: "absolute" };

const Glow: React.FC<{ readonly items: readonly { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly c: string; readonly o: number }[]; readonly radius?: number; readonly spread?: number }> = ({ items, radius = 12, spread = 18 }) => (
  <>
    {items.map((r, i) => (
      <div key={i} style={{ ...abs, left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: radius, backgroundColor: r.c, opacity: r.o, boxShadow: `0 0 ${spread}px ${spread / 3}px ${r.c}` }} />
    ))}
  </>
);

// Gedung dengan jendela menyala. `lit` = peluang jendela menyala; warna dari `colors`.
const City: React.FC<{ readonly base: string; readonly shade: string; readonly colors: readonly string[]; readonly lit: number; readonly seed: number }> = ({ base, shade, colors, lit, seed }) => {
  const items: { x: number; y: number; w: number; h: number; c: string; o: number }[] = [];
  const blocks: React.ReactNode[] = [];
  const cols = 8;
  const bw = W / cols + 6;
  for (let b = 0; b < cols; b++) {
    const h = 520 + rnd(seed + b) * 420;
    const x = b * (W / cols) - 3;
    blocks.push(<div key={`b${b}`} style={{ ...abs, left: x, top: DESK_TOP - h, width: bw, height: h + 20, backgroundColor: b % 2 ? base : shade }} />);
    const rows = Math.floor(h / 78);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 3; c++) {
        const k = seed * 7 + b * 100 + r * 5 + c;
        if (rnd(k) < lit) items.push({ x: x + 22 + c * 42, y: DESK_TOP - h + 24 + r * 78, w: 24, h: 34, c: colors[Math.floor(rnd(k + 9) * colors.length)], o: 0.55 + rnd(k + 3) * 0.45 });
      }
    }
  }
  return (
    <>
      {blocks}
      <Glow items={items} radius={8} spread={22} />
    </>
  );
};

// Panel kode melayang: baris warna di dalam bingkai tipis.
const CodePanels: React.FC<{ readonly seed: number; readonly colors: readonly string[]; readonly panels: readonly { readonly x: number; readonly y: number; readonly w: number; readonly h: number }[]; readonly opacity: number }> = ({ seed, colors, panels, opacity }) => (
  <>
    {panels.map((pn, i) => {
      const rows = Math.floor((pn.h - 40) / 30);
      return (
        <div key={i} style={{ ...abs, left: pn.x, top: pn.y, width: pn.w, height: pn.h, borderRadius: 18, border: "2px solid rgba(160,190,255,0.28)", backgroundColor: "rgba(18,26,60,0.55)", opacity, overflow: "hidden" }}>
          {Array.from({ length: rows }, (_, r) => {
            const indent = Math.floor(rnd(seed + i * 31 + r) * 3) * 34;
            const len = 60 + rnd(seed + i * 17 + r * 3) * (pn.w - 160 - indent);
            return <div key={r} style={{ ...abs, left: 24 + indent, top: 24 + r * 30, width: len, height: 14, borderRadius: 7, backgroundColor: colors[Math.floor(rnd(seed + i + r * 11) * colors.length)], opacity: 0.85 }} />;
          })}
        </div>
      );
    })}
  </>
);

const NightFar: React.FC = () => (
  <>
    <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg,#070b1d 0%,#0e1a3d 55%,#15264f 100%)" }} />
    <City base="#0c1432" shade="#101c42" colors={["#ffd98a", "#ffe9b0", "#bfe4ff", "#ffb36b"]} lit={0.5} seed={3} />
  </>
);
const NightMid: React.FC = () => (
  <>
    {/* Rangka jendela besar: tiang gelap yang menangkap paralaks. */}
    <div style={{ ...abs, left: -20, top: -600, width: 70, height: DESK_TOP + 600, backgroundColor: "#070a16" }} />
    <div style={{ ...abs, left: 505, top: -600, width: 46, height: DESK_TOP + 600, backgroundColor: "#070a16" }} />
    <div style={{ ...abs, left: 1050, top: -600, width: 70, height: DESK_TOP + 600, backgroundColor: "#070a16" }} />
    <div style={{ ...abs, left: -200, top: -600, width: W + 400, height: 670, backgroundColor: "#070a16" }} />
  </>
);

const DayFar: React.FC = () => (
  <>
    <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg,#9fc6ee 0%,#cfe4f7 60%,#e8f1fa 100%)" }} />
    <City base="#7f9cc2" shade="#92abcd" colors={["#ffffff", "#e6f1ff"]} lit={0.35} seed={11} />
  </>
);
const DayMid: React.FC = () => (
  <>
    <div style={{ ...abs, left: -20, top: -600, width: 90, height: DESK_TOP + 600, backgroundColor: "#d9dee6" }} />
    <div style={{ ...abs, left: 495, top: -600, width: 56, height: DESK_TOP + 600, backgroundColor: "#d9dee6" }} />
    <div style={{ ...abs, left: 1010, top: -600, width: 110, height: DESK_TOP + 600, backgroundColor: "#d9dee6" }} />
    <div style={{ ...abs, left: -200, top: -600, width: W + 400, height: 720, backgroundColor: "#d9dee6" }} />
    {/* Papan putih di dinding kiri bawah jendela. */}
    <div style={{ ...abs, left: 70, top: 760, width: 380, height: 260, borderRadius: 10, backgroundColor: "#f6f8fb", border: "8px solid #b9c2cf" }} />
  </>
);

const CODE_COLORS = ["#8ee3ef", "#5b7cf0", "#ffffff", "#b7c7ff"];
const CodeFar: React.FC = () => (
  <>
    <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "radial-gradient(ellipse at 50% 35%,#16275e 0%,#0a1230 55%,#050816 100%)" }} />
    <CodePanels seed={5} colors={CODE_COLORS} opacity={0.45} panels={[{ x: -60, y: 180, w: 520, h: 420 }, { x: 600, y: 120, w: 520, h: 380 }, { x: 140, y: 700, w: 460, h: 360 }, { x: 640, y: 640, w: 480, h: 420 }]} />
  </>
);
const CodeMid: React.FC = () => <CodePanels seed={9} colors={CODE_COLORS} opacity={0.8} panels={[{ x: 20, y: 440, w: 360, h: 300 }, { x: 700, y: 360, w: 400, h: 330 }]} />;

const CafeFar: React.FC = () => {
  const items = Array.from({ length: 26 }, (_, i) => ({ x: rnd(i + 40) * W, y: 120 + rnd(i + 70) * 900, r: 26 + rnd(i + 90) * 62, o: 0.28 + rnd(i + 5) * 0.5 }));
  return (
    <>
      <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg,#2a1710 0%,#3d2216 60%,#4d2b1b 100%)" }} />
      {items.map((b, i) => (
        <div key={i} style={{ ...abs, left: b.x - b.r, top: b.y - b.r, width: b.r * 2, height: b.r * 2, borderRadius: "50%", backgroundColor: i % 3 ? "#ffb25c" : "#ffd89a", opacity: b.o }} />
      ))}
    </>
  );
};
const CafeMid: React.FC = () => (
  <>
    {/* Rak kayu dengan cangkir blok. */}
    <div style={{ ...abs, left: 560, top: 640, width: 540, height: 16, backgroundColor: "#6b4026" }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ ...abs, left: 600 + i * 120, top: 574, width: 62, height: 66, borderRadius: 10, backgroundColor: i % 2 ? "#e9dcc6" : "#c9894f" }} />
    ))}
    <div style={{ ...abs, left: -10, top: 880, width: 380, height: 16, backgroundColor: "#6b4026" }} />
    <div style={{ ...abs, left: 30, top: 800, width: 74, height: 80, borderRadius: 14, backgroundColor: "#7aa268" }} />
  </>
);

export const SETS: Readonly<Record<BlockSet, SetSpec>> = {
  mejaMalam: { bg: "#0b1330", deskTop: "#3a2b24", deskFront: "#241a16", deskEdge: "#5b4538", filter: "brightness(0.97) saturate(1.08)", key: "rgba(255,170,90,0.20)", vignette: 0.6, screen: "#1d2c66", Far: NightFar, Mid: NightMid },
  kantor: { bg: "#cfd9e6", deskTop: "#c9a47a", deskFront: "#a98458", deskEdge: "#e0c29b", filter: "brightness(1.02) saturate(1.02)", key: "rgba(255,244,214,0.18)", vignette: 0.28, screen: "#2c3f6f", Far: DayFar, Mid: DayMid },
  terminal: { bg: "#070b1d", deskTop: "#1a2246", deskFront: "#0e1330", deskEdge: "#3f56a3", filter: "brightness(0.95) saturate(1.1) hue-rotate(-4deg)", key: "rgba(120,160,255,0.22)", vignette: 0.55, screen: "#12204f", Far: CodeFar, Mid: CodeMid },
  kafe: { bg: "#2a1710", deskTop: "#7b4d2f", deskFront: "#4f2f1c", deskEdge: "#a56d45", filter: "brightness(1) saturate(1.1) sepia(0.08)", key: "rgba(255,160,70,0.24)", vignette: 0.5, screen: "#2a3550", Far: CafeFar, Mid: CafeMid },
};

// ---------- Benda di meja ----------

export const Monitor: React.FC<{ readonly screen: string }> = ({ screen }) => {
  const bars = Array.from({ length: 13 }, (_, r) => ({ r, indent: Math.floor(rnd(r + 61) * 3) * 22, len: 70 + rnd(r + 23) * 150, c: ["#8ee3ef", "#5b7cf0", "#ffffff", "#b7c7ff"][Math.floor(rnd(r + 7) * 4)] }));
  return (
    <div style={{ ...abs, left: 640, top: 740, width: 400, height: 330 }}>
      <div style={{ ...abs, left: 0, top: 0, width: 400, height: 270, borderRadius: 14, backgroundColor: "#10131d", boxShadow: "0 0 60px 10px rgba(80,120,255,0.25)" }}>
        <div style={{ ...abs, left: 14, top: 14, right: 14, bottom: 14, borderRadius: 6, backgroundColor: screen, overflow: "hidden" }}>
          {bars.map((b) => (
            <div key={b.r} style={{ ...abs, left: 18 + b.indent, top: 16 + b.r * 18, width: b.len, height: 9, borderRadius: 4, backgroundColor: b.c, opacity: 0.9 }} />
          ))}
        </div>
      </div>
      <div style={{ ...abs, left: 170, top: 270, width: 60, height: 36, backgroundColor: "#0b0d15" }} />
      <div style={{ ...abs, left: 120, top: 302, width: 160, height: 18, borderRadius: 8, backgroundColor: "#0b0d15" }} />
    </div>
  );
};

export const DeskTop: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const s = SETS[set];
  return (
    <>
      <div style={{ ...abs, left: -40, top: DESK_TOP, width: W + 80, height: DESK_FRONT - DESK_TOP, background: `linear-gradient(180deg, ${s.deskEdge} 0%, ${s.deskTop} 14%, ${s.deskTop} 100%)` }} />
      {/* Keyboard trapesium. */}
      <div style={{ ...abs, left: 250, top: 1292, width: 560, height: 96, clipPath: "polygon(7% 0, 93% 0, 100% 100%, 0 100%)", background: "repeating-linear-gradient(90deg,#222a44 0 26px,#151b30 26px 30px)", filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.5))" }} />
      {/* Mug. */}
      <div style={{ ...abs, left: 118, top: 1262, width: 118, height: 128, borderRadius: "14px 14px 22px 22px", backgroundColor: "#f1ece2", boxShadow: "inset -14px 0 0 rgba(0,0,0,0.12), 0 10px 18px rgba(0,0,0,0.4)" }} />
      <div style={{ ...abs, left: 224, top: 1290, width: 44, height: 62, borderRadius: 22, border: "14px solid #f1ece2", borderLeftColor: "transparent" }} />
      {/* Buku catatan dan sticky note. */}
      <div style={{ ...abs, left: 700, top: 1352, width: 250, height: 70, transform: "skewX(-24deg)", backgroundColor: "#e9e6dd", boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }} />
      <div style={{ ...abs, left: 930, top: 1372, width: 60, height: 40, transform: "skewX(-24deg)", backgroundColor: "#f3c84a" }} />
    </>
  );
};

export const DeskFront: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const s = SETS[set];
  return <div style={{ ...abs, left: -40, top: DESK_FRONT, width: W + 80, height: H - DESK_FRONT + 200, background: `linear-gradient(180deg, ${s.deskEdge} 0, ${s.deskFront} 10px, ${s.deskFront} 100%)` }} />;
};

// Blob buram di depan fokus (pot, ujung kabel) supaya ada lapisan paling dekat.
export const Foreground: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const c = set === "kantor" ? "#8aa07c" : set === "kafe" ? "#c9894f" : "#2b3a7a";
  return (
    <>
      <div style={{ ...abs, left: -90, top: 1500, width: 260, height: 300, borderRadius: "46% 54% 40% 60%", backgroundColor: c, opacity: 0.9 }} />
      <div style={{ ...abs, left: 930, top: 1560, width: 220, height: 220, borderRadius: "50%", backgroundColor: c, opacity: 0.55 }} />
    </>
  );
};

// ---------- Cahaya ----------

export const Lighting: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const s = SETS[set];
  return (
    <>
      <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse 70% 45% at 30% 48%, ${s.key} 0%, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />
      <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${s.vignette}) 100%)` }} />
    </>
  );
};
