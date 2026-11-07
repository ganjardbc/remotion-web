import type React from "react";
import type { BlockLight } from "../assets/characters";
import type { BlockSet } from "./types";

// Dunia diorama: lapisan datar di kedalaman berbeda. Kamera menggeser dan memperbesar tiap lapisan dengan faktor `p`
// (0 = jauh, 1 = bidang fokus tempat karakter berdiri, > 1 = di depan fokus), jadi geser kamera memberi paralaks dan
// zoom memberi kesan 3D tanpa render 3D. Lapisan jauh dan depan di-blur seperti kedalaman bidang (depth of field).

export const W = 1080;
export const H = 1920;
// Tepi jauh permukaan meja, tepi depannya, dan garis lantai karakter.
export const DESK_TOP = 1190;
export const DESK_FRONT = 1560;

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

// Tata letak default shot `wide` per latar: kamera (fx, fy, z) dan posisi karakter. `behindX` dan `deskX` diisi berurutan
// menurut `position` di tiap kelompok `place`; `*Scale` = pengali tinggi karakter, `*Floor` = garis lantai.
export type Layout = {
  readonly wide: { readonly fx: number; readonly fy: number; readonly z: number };
  readonly behindX: readonly number[];
  readonly deskX: readonly number[];
  readonly behindFloor: number;
  readonly deskFloor: number;
  readonly behindScale: number;
  readonly deskScale: number;
};
// Komposisi baku semua latar (dari referensi meja malam): Ganjar di kiri, kepala besar; maskot kecil di meja depan kiri; monitor besar di kanan.
const DESK_LAYOUT: Layout = { wide: { fx: 500, fy: 923, z: 1.5 }, behindX: [400, 760, 540], deskX: [262, 600, 420], behindFloor: 1442, deskFloor: 1293, behindScale: 1.143, deskScale: 0.62 };

// `stand` false = layar laptop (tanpa leher dan alas, hanya engsel).
type MonitorSpec = { readonly x: number; readonly y: number; readonly w: number; readonly tilt: number; readonly bold: boolean; readonly stand: boolean };

type SetSpec = {
  readonly bg: string;
  readonly layout: Layout;
  readonly monitor: MonitorSpec;
  // Titik cahaya hangat (persen layar) dan warna dasar permukaan meja yang memudar ke arah penonton.
  readonly keyAt: readonly [number, number];
  readonly deskBottom: string;
  // Dua warna tuts keyboard.
  readonly keys: readonly [string, string];
  readonly deskTop: string;
  readonly deskFront: string;
  readonly deskEdge: string;
  // Filter untuk karakter (menyatukan pencahayaan dengan dunia).
  readonly filter: string;
  // Cahaya hangat dari depan-kiri dan vinyet.
  readonly key: string;
  readonly vignette: number;
  readonly screen: string;
  // Cahaya di karakter block (lihat BlockLightContext): per sisi kubus dan gradasi.
  readonly light: BlockLight;
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
const City: React.FC<{ readonly base: string; readonly shade: string; readonly colors: readonly string[]; readonly lit: number; readonly seed: number; readonly big?: boolean }> = ({ base, shade, colors, lit, seed, big }) => {
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
        if (rnd(k) < lit) items.push({ x: x + 22 + c * 42, y: DESK_TOP - h + 24 + r * 78, w: big ? 34 : 24, h: big ? 44 : 34, c: colors[Math.floor(rnd(k + 9) * colors.length)], o: 0.55 + rnd(k + 3) * 0.45 });
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
    <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg,#050816 0%,#0a1330 55%,#0f1d44 100%)" }} />
    <City base="#0a1230" shade="#0d1838" colors={["#ffd98a", "#ffe9b0", "#bfe4ff", "#ffb36b"]} lit={0.2} seed={3} big />
  </>
);
const NightMid: React.FC = () => (
  <>
    {/* Bingkai jendela: dua tiang dan satu palang yang menangkap paralaks. */}
    <div style={{ ...abs, left: 170, top: -600, width: 62, height: DESK_TOP + 600, backgroundColor: "#04060f" }} />
    <div style={{ ...abs, left: 548, top: -600, width: 46, height: DESK_TOP + 600, backgroundColor: "#04060f" }} />
    <div style={{ ...abs, left: -200, top: 500, width: W + 400, height: 30, backgroundColor: "#04060f" }} />
  </>
);

// Kantor malam: menara kantor dengan banyak jendela kecil menyala (putih dingin), bingkai jendela gelap, papan dinding redup.
const OfficeFar: React.FC = () => (
  <>
    <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg,#050c18 0%,#0a1a2e 55%,#10263f 100%)" }} />
    <City base="#0b1730" shade="#10203c" colors={["#e3edff", "#c4d6ff", "#ffe9bf"]} lit={0.5} seed={11} />
  </>
);
const OfficeMid: React.FC = () => (
  <>
    <div style={{ ...abs, left: 170, top: -600, width: 62, height: DESK_TOP + 600, backgroundColor: "#070d1a" }} />
    <div style={{ ...abs, left: 548, top: -600, width: 46, height: DESK_TOP + 600, backgroundColor: "#070d1a" }} />
    <div style={{ ...abs, left: -200, top: 500, width: W + 400, height: 30, backgroundColor: "#070d1a" }} />
    {/* Papan dinding redup dengan catatan tempel di atas kiri. */}
    <div style={{ ...abs, left: 250, top: 250, width: 260, height: 170, borderRadius: 10, backgroundColor: "#1c2740", border: "8px solid #2c3956" }} />
    <div style={{ ...abs, left: 282, top: 290, width: 54, height: 46, backgroundColor: "#a8913a", opacity: 0.7 }} />
    <div style={{ ...abs, left: 360, top: 310, width: 54, height: 46, backgroundColor: "#b06a3e", opacity: 0.7 }} />
    <div style={{ ...abs, left: 430, top: 280, width: 54, height: 46, backgroundColor: "#4d6aa8", opacity: 0.7 }} />
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
      <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: "linear-gradient(180deg,#160a06 0%,#26140c 60%,#34190e 100%)" }} />
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
  mejaMalam: { bg: "#060a1c", layout: DESK_LAYOUT, monitor: { x: 693, y: 884, w: 380, tilt: -42, bold: true, stand: true }, keyAt: [36, 34], deskBottom: "#16141c", keys: ["#26304f", "#141a2e"], deskTop: "#4d3c35", deskFront: "#0b0c13", deskEdge: "#6a5246", filter: "brightness(0.97) saturate(1.08)", key: "rgba(255,170,90,0.30)", vignette: 0.62, screen: "#2a3f8f", light: { faces: { front: { color: "#ffaf6e", opacity: 0.1 }, top: { color: "#ffc88c", opacity: 0.2 }, left: { color: "#ffa05a", opacity: 0.06 }, right: { color: "#78a0ff", opacity: 0.24 } }, gradient: 0.18 }, Far: NightFar, Mid: NightMid },
  kantor: { bg: "#070d1a", layout: DESK_LAYOUT, monitor: { x: 693, y: 884, w: 380, tilt: -42, bold: true, stand: true }, keyAt: [36, 34], deskBottom: "#17110d", keys: ["#303a58", "#1c2338"], deskTop: "#5e4631", deskFront: "#0d0a08", deskEdge: "#80634a", filter: "brightness(0.97) saturate(1.05)", key: "rgba(255,200,140,0.26)", vignette: 0.55, screen: "#24407f", light: { faces: { front: { color: "#ffc890", opacity: 0.08 }, top: { color: "#ffdcb0", opacity: 0.16 }, left: { color: "#ffb478", opacity: 0.05 }, right: { color: "#8cb0ff", opacity: 0.2 } }, gradient: 0.16 }, Far: OfficeFar, Mid: OfficeMid },
  terminal: { bg: "#070b1d", layout: DESK_LAYOUT, monitor: { x: 693, y: 884, w: 380, tilt: -42, bold: true, stand: true }, keyAt: [36, 34], deskBottom: "#0a0e24", keys: ["#2a3a7a", "#141c40"], deskTop: "#1a2246", deskFront: "#0e1330", deskEdge: "#3f56a3", filter: "brightness(0.95) saturate(1.1) hue-rotate(-4deg)", key: "rgba(120,160,255,0.22)", vignette: 0.55, screen: "#12204f", light: { faces: { front: { color: "#82aaff", opacity: 0.1 }, top: { color: "#aac8ff", opacity: 0.16 }, left: { color: "#6e96ff", opacity: 0.12 }, right: { color: "#6e96ff", opacity: 0.22 } }, gradient: 0.2 }, Far: CodeFar, Mid: CodeMid },
  kafe: { bg: "#160a06", layout: DESK_LAYOUT, monitor: { x: 693, y: 884, w: 380, tilt: -42, bold: true, stand: false }, keyAt: [36, 34], deskBottom: "#22130d", keys: ["#4a3326", "#2a1a12"], deskTop: "#7b4d2f", deskFront: "#4f2f1c", deskEdge: "#a56d45", filter: "brightness(0.95) saturate(1.1) sepia(0.08)", key: "rgba(255,160,70,0.26)", vignette: 0.62, screen: "#2a3550", light: { faces: { front: { color: "#ffaa5a", opacity: 0.12 }, top: { color: "#ffc882", opacity: 0.2 }, left: { color: "#ff9650", opacity: 0.1 }, right: { color: "#c87846", opacity: 0.16 } }, gradient: 0.16 }, Far: CafeFar, Mid: CafeMid },
};

// ---------- Benda di meja ----------

export const Monitor: React.FC<{ readonly screen: string; readonly spec: MonitorSpec }> = ({ screen, spec }) => {
  const rows = spec.bold ? 8 : 13;
  const step = spec.bold ? 30 : 18;
  const thick = spec.bold ? 18 : 9;
  const bars = Array.from({ length: rows }, (_, r) => ({ r, indent: Math.floor(rnd(r + 61) * 3) * (spec.bold ? 34 : 22), len: (spec.bold ? 110 : 70) + rnd(r + 23) * (spec.bold ? 190 : 150), c: ["#8ee3ef", "#5b7cf0", "#ffffff", "#b7c7ff"][Math.floor(rnd(r + 7) * 4)] }));
  return (
    <div style={{ ...abs, left: spec.x, top: spec.y, width: 400, height: 330, transformOrigin: "0 50%", transform: `perspective(2200px) rotateY(${spec.tilt}deg) scale(${spec.w / 400})` }}>
      <div style={{ ...abs, left: 0, top: 0, width: 400, height: 270, borderRadius: 14, backgroundColor: "#10131d", boxShadow: "0 0 70px 14px rgba(80,120,255,0.28)" }}>
        <div style={{ ...abs, left: 14, top: 14, right: 14, bottom: 14, borderRadius: 6, backgroundColor: screen, overflow: "hidden" }}>
          {bars.map((b) => (
            <div key={b.r} style={{ ...abs, left: 18 + b.indent, top: 18 + b.r * step, width: b.len, height: thick, borderRadius: thick / 2, backgroundColor: b.c, opacity: 0.92 }} />
          ))}
        </div>
      </div>
      {spec.stand ? (
        <>
          <div style={{ ...abs, left: 175, top: 270, width: 50, height: 36, backgroundColor: "#0b0d15" }} />
          <div style={{ ...abs, left: 135, top: 302, width: 130, height: 18, borderRadius: 8, backgroundColor: "#0b0d15" }} />
        </>
      ) : (
        <div style={{ ...abs, left: -24, top: 268, width: 448, height: 16, borderRadius: 8, backgroundColor: "#0b0d15" }} />
      )}
    </div>
  );
};

// Keyboard dengan baris tuts: satuan lebar tombol per baris (jumlah 15), baris jauh lebih sempit dan lebih rendah daripada yang dekat
// sehingga terlihat berperspektif. Tombol pengubah (pertama dan terakhir tiap baris, spasi) lebih gelap.
// Keyboard menghadap Ganjar (di seberang meja): baris spasi di sisi jauh (atas layar) dan baris angka di sisi dekat kamera,
// urutan tombol tiap baris terbalik dibanding tampak dari depan keyboard.
const KEY_ROWS: readonly (readonly number[])[] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
];
const ROW_SCALE = [0.9, 0.93, 0.96, 0.98, 1] as const;
const ROW_H = [11, 12, 13, 14, 15] as const;
const KB_W = 410;
const KB_GAP = 3;

const Keyboard: React.FC<{ readonly x: number; readonly y: number; readonly keys: readonly [string, string] }> = ({ x, y, keys }) => {
  let top = 6;
  const rows = [...KEY_ROWS].reverse().map((r) => [...r].reverse());
  return (
    <div style={{ ...abs, left: x, top: y, width: KB_W, height: 96, filter: "drop-shadow(0 9px 10px rgba(0,0,0,0.55))" }}>
      {/* Badan keyboard: trapesium dengan bibir depan lebih terang. */}
      <div style={{ ...abs, left: -6, top: 0, width: KB_W + 12, height: 88, clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)", background: `linear-gradient(180deg, ${keys[1]} 0%, #0d111f 100%)` }} />
      <div style={{ ...abs, left: -6, top: 85, width: KB_W + 12, height: 3, backgroundColor: "rgba(255,255,255,0.1)" }} />
      {rows.map((row, r) => {
        const rowW = (KB_W - 14) * ROW_SCALE[r];
        const unit = rowW / 15;
        const h = ROW_H[r];
        const y0 = top;
        top += h + KB_GAP;
        let cx = (KB_W - rowW) / 2;
        return row.map((u, i) => {
          const kw = u * unit - KB_GAP;
          const left = cx;
          cx += u * unit;
          const mod = i === 0 || i === row.length - 1 || u > 2;
          return <div key={`${r}-${i}`} style={{ ...abs, left, top: y0, width: kw, height: h, borderRadius: 3, backgroundColor: mod ? "#1a2038" : keys[0], boxShadow: "inset 0 2px 0 rgba(255,255,255,0.16), inset 0 -3px 0 rgba(0,0,0,0.38)" }} />;
        });
      })}
    </div>
  );
};

export const DeskTop: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const s = SETS[set];
  return (
    <>
      <div style={{ ...abs, left: -40, top: DESK_TOP, width: W + 80, height: DESK_FRONT - DESK_TOP, background: `linear-gradient(180deg, ${s.deskEdge} 0%, ${s.deskTop} 10%, ${s.deskBottom} 100%)` }} />
      {/* Pantulan cahaya layar monitor di permukaan meja. */}
      <div style={{ ...abs, left: s.monitor.x - 120, top: DESK_TOP - 60, width: s.monitor.w + 360, height: 300, background: "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(110,150,255,0.16) 0%, rgba(110,150,255,0) 100%)" }} />
      {/* Keyboard di tengah, catatan tempel, dan pena (seperti referensi). */}
      <Keyboard x={313} y={1204} keys={s.keys} />
      <div style={{ ...abs, left: 437, top: 1306, width: 92, height: 22, transform: "skewX(-30deg)", backgroundColor: "#f0d24a", opacity: 0.95, boxShadow: "0 0 18px rgba(240,210,74,0.35)" }} />
      <div style={{ ...abs, left: 573, top: 1300, width: 64, height: 18, transform: "skewX(-30deg)", backgroundColor: "#ee8a4e", opacity: 0.9 }} />
      <div style={{ ...abs, left: 240, top: 1318, width: 118, height: 8, borderRadius: 4, transform: "rotate(-4deg)", backgroundColor: "#6e7a99" }} />
    </>
  );
};

export const DeskFront: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const s = SETS[set];
  return <div style={{ ...abs, left: -40, top: DESK_FRONT - 2, width: W + 80, height: H - DESK_FRONT + 202, background: `linear-gradient(180deg, ${s.deskBottom} 0, ${s.deskFront} 100%)` }} />;
};

// Blob buram di depan fokus (pot, ujung kabel) supaya ada lapisan paling dekat.
export const Foreground: React.FC<{ readonly set: BlockSet }> = ({ set }) => {
  const c = set === "kantor" ? "#2f4a3a" : set === "kafe" ? "#c9894f" : "#2b3a7a";
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
      <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse 60% 34% at ${s.keyAt[0]}% ${s.keyAt[1]}%, ${s.key} 0%, rgba(0,0,0,0) 72%)`, mixBlendMode: "screen" }} />
      <div style={{ ...abs, left: 0, top: 0, width: W, height: H, background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${s.vignette}) 100%)` }} />
    </>
  );
};
