import type React from "react";
import { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sky, type TimeOfDay } from "../../shared";
import { DESKBACK_ANCHORS, type DeskBackAnchors } from "./anchors";
import { deskBackPalette, type DeskBackPalette } from "./palette";

// Meja kerja tampak belakang. Urutan gambar (belakang ke depan):
// DeskBackRoom (dinding, jendela, rak, tanaman, meja) -> peredupan waktu -> DeskBackLights (monitor, lampu, cahaya)
// -> karakter duduk -> DeskBackChair (sandaran, dudukan, sandaran tangan, dasar kursi, karpet).
export type DeskBackProps = {
  readonly anchors?: DeskBackAnchors;
  // Waktu hari: nama, atau angka 0..1 (siang 0, sore 0.5, malam 1). Bawaan siang.
  readonly time?: TimeOfDay | number;
  // Palet sendiri; menimpa `time`.
  readonly palette?: DeskBackPalette;
};

const resolve = (palette: DeskBackPalette | undefined, time: TimeOfDay | number | undefined): DeskBackPalette =>
  palette ?? deskBackPalette(time ?? "siang");

const W = 1080;
const H = 1920;

const Leaf: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly l: number; readonly w?: number; readonly fill: string }> = ({ x, y, r, l, w = l * 0.32, fill }) => (
  <path transform={`translate(${x} ${y}) rotate(${r})`} d={`M0 0 C${w} ${-l * 0.25} ${w} ${-l * 0.8} 0 ${-l} C${-w} ${-l * 0.8} ${-w} ${-l * 0.25} 0 0 Z`} fill={fill} />
);

const Pot: React.FC<{ readonly x: number; readonly bottom: number; readonly w: number; readonly h: number; readonly p: DeskBackPalette }> = ({ x, bottom, w, h, p }) => (
  <g>
    <path d={`M${x - w / 2} ${bottom - h} L${x + w / 2} ${bottom - h} L${x + w / 2 - w * 0.12} ${bottom} L${x - w / 2 + w * 0.12} ${bottom} Z`} fill={p.pot} />
    <path d={`M${x + w * 0.1} ${bottom - h} L${x + w / 2} ${bottom - h} L${x + w / 2 - w * 0.12} ${bottom} L${x + w * 0.02} ${bottom} Z`} fill={p.potShade} />
    <rect x={x - w / 2 - 3} y={bottom - h - 6} width={w + 6} height={10} rx={4} fill={p.pot} />
  </g>
);

// Tanaman tinggi di lantai (kiri), batang ramping dengan daun bergantian.
const TallPlant: React.FC<{ readonly x: number; readonly potBottom: number; readonly p: DeskBackPalette; readonly sway: number }> = ({ x, potBottom, p, sway }) => {
  const top = potBottom - 120;
  const leaves = Array.from({ length: 15 }, (_, i) => {
    const y = top - i * 38;
    const side = i % 2 === 0 ? -1 : 1;
    const bend = Math.sin(i * 0.9) * 10 + sway * (i / 15) * 8;
    return { x: x + bend, y, r: side * (52 + (i % 3) * 6), l: 120 - i * 4, fill: i % 3 === 0 ? p.leafDark : p.leaf };
  });
  return (
    <g>
      <path d={`M${x} ${top + 6} C${x - 6} ${top - 200} ${x + 14 + sway * 4} ${top - 380} ${x + 8 + sway * 8} ${top - 560}`} stroke={p.leafDark} strokeWidth={9} fill="none" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <Leaf key={i} {...l} />
      ))}
      <Leaf x={x + 8 + sway * 8} y={top - 560} r={6} l={90} fill={p.leaf} />
      <Pot x={x} bottom={potBottom} w={150} h={120} p={p} />
    </g>
  );
};

const Frame: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly p: DeskBackPalette; readonly art?: boolean }> = ({ x, y, w, h, p, art = true }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={p.frameBorder} />
    <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} fill={p.frameFill} />
    {art ? (
      <>
        <path d={`M${x + 7} ${y + h * 0.62} C${x + w * 0.3} ${y + h * 0.4} ${x + w * 0.6} ${y + h * 0.85} ${x + w - 7} ${y + h * 0.5} L${x + w - 7} ${y + h - 7} L${x + 7} ${y + h - 7} Z`} fill={p.screenPurple} opacity={0.85} />
        <circle cx={x + w * 0.68} cy={y + h * 0.3} r={w * 0.13} fill={p.screenOrange} />
      </>
    ) : null}
  </g>
);

const Window: React.FC<{ readonly a: DeskBackAnchors; readonly p: DeskBackPalette }> = ({ a, p }) => {
  const inner = a.window.w - 28;
  return (
    <div style={{ position: "absolute", left: a.window.x, top: a.window.y, width: a.window.w, height: a.window.h, borderRadius: 14, backgroundColor: p.windowFrame, boxShadow: "0 8px 24px rgba(20,20,31,0.14)", padding: 14, boxSizing: "border-box" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 6, overflow: "hidden" }}>
        <Sky p={p} width={inner} cloudScale={0.9} />
        <div style={{ position: "absolute", inset: 0, opacity: p.blinds * 0.55, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.0) 0px, rgba(255,255,255,0.0) 14px, rgba(255,255,255,0.55) 14px, rgba(255,255,255,0.55) 17px)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 8, marginLeft: -4, backgroundColor: p.windowFrame }} />
      </div>
    </div>
  );
};

// Bagian ruangan yang ikut diredupkan malam hari.
export const DeskBackRoom: React.FC<DeskBackProps> = ({ anchors: a = DESKBACK_ANCHORS, time, palette }) => {
  const u = useId().replace(/:/g, "");
  const p = resolve(palette, time);
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 46);
  const s = a.shelf;
  const cx = a.seatX;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${p.wall}, ${p.wallShade})` }} />
      <Window a={a} p={p} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={`${u}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.floor} />
            <stop offset="1" stopColor={p.floorShade} />
          </linearGradient>
          <linearGradient id={`${u}-under`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity={0.3} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* sorot cahaya jendela di dinding */}
        <polygon points={`${a.window.x + 30},${a.window.y + a.window.h} ${a.window.x + a.window.w + 20},${a.window.y + a.window.h} ${a.window.x + a.window.w + 330},${a.floorY} ${a.window.x + 140},${a.floorY}`} fill={p.beamColor} opacity={p.beam * 0.35} />
        {/* tirai: batang, panel, lipatan */}
        <rect x={0} y={a.window.y - 38} width={350} height={8} rx={4} fill={p.curtainShade} />
        <circle cx={350} cy={a.window.y - 34} r={10} fill={p.curtainShade} />
        <path d={`M232 ${a.window.y - 30} L346 ${a.window.y - 30} L350 1010 Q320 1030 292 1008 Q262 1030 232 1008 Z`} fill={p.curtain} />
        {[262, 292, 322].map((x) => (
          <path key={x} d={`M${x} ${a.window.y - 30} L${x + 2} 1016`} stroke={p.curtainShade} strokeWidth={9} opacity={0.55} />
        ))}
        {/* lantai dan papan dasar */}
        <rect x={0} y={a.floorY - 44} width={W} height={44} fill={p.baseboard} />
        <rect x={0} y={a.floorY} width={W} height={H - a.floorY} fill={`url(#${u}-floor)`} />
        {/* bingkai dinding */}
        <Frame x={372} y={392} w={128} h={176} p={p} />
        {/* rak melayang dan isinya */}
        <rect x={s.x} y={s.y} width={s.w} height={20} rx={3} fill={p.shelf} />
        <g>
          {/* tanaman kecil */}
          <Pot x={s.x + 62} bottom={s.y} w={54} h={46} p={p} />
          {[-34, -12, 8, 28].map((r, i) => (
            <Leaf key={i} x={s.x + 62} y={s.y - 44} r={r * 1.5} l={64 - i * 3} fill={i % 2 ? p.leafDark : p.leaf} />
          ))}
          {/* tumpukan buku */}
          <rect x={s.x + 140} y={s.y - 24} width={96} height={24} rx={2} fill={p.book1} />
          <rect x={s.x + 148} y={s.y - 46} width={88} height={22} rx={2} fill={p.book2} />
          <rect x={s.x + 144} y={s.y - 66} width={92} height={20} rx={2} fill={p.book3} />
          {/* bingkai berdiri */}
          <Frame x={s.x + 262} y={s.y - 140} w={104} h={140} p={p} />
          {/* tanaman rambat menggantung */}
          <Pot x={s.x + s.w - 40} bottom={s.y} w={52} h={46} p={p} />
          {[0, 1, 2].map((v) => {
            const x0 = s.x + s.w - 52 + v * 18;
            const len = 190 + v * 70;
            const sw = sway * (4 + v * 2);
            return (
              <g key={v}>
                <path d={`M${x0} ${s.y + 4} C${x0 + 10 + sw} ${s.y + len * 0.3} ${x0 - 12 + sw} ${s.y + len * 0.65} ${x0 + 4 + sw} ${s.y + len}`} stroke={p.leafDark} strokeWidth={4} fill="none" />
                {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, i) => (
                  <Leaf key={i} x={x0 + (i % 2 ? 8 : -8) + sw * t} y={s.y + len * t} r={i % 2 ? 70 : -70} l={26} w={12} fill={i % 2 ? p.leaf : p.leafDark} />
                ))}
              </g>
            );
          })}
        </g>
        {/* meja: tepi belakang menempel dinding */}
        <rect x={0} y={a.deskFront + a.slab} width={W} height={a.floorY - a.deskFront - a.slab} fill={`url(#${u}-under)`} />
        <rect x={70} y={a.deskFront + a.slab} width={36} height={300} fill={p.deskLeg} />
        <rect x={958} y={a.deskFront + a.slab} width={36} height={300} fill={p.deskLeg} />
        <rect x={40} y={1452} width={100} height={30} rx={14} fill={p.deskLeg} />
        <rect x={900} y={1452} width={150} height={30} rx={14} fill={p.deskLeg} />
        <rect x={570} y={a.deskFront + a.slab} width={250} height={34} rx={5} fill={p.deskSlab} />
        <rect x={586} y={a.deskFront + a.slab + 14} width={80} height={10} rx={3} fill="#2B2B31" opacity={0.85} />
        <polygon points={`0,${a.deskBack} ${W},${a.deskBack} ${W + 24},${a.deskFront} -24,${a.deskFront}`} fill={p.deskTop} />
        <rect x={-24} y={a.deskFront} width={W + 48} height={a.slab} fill={p.deskSlab} />
        <rect x={-24} y={a.deskFront} width={W + 48} height={5} fill={p.deskTopEdge} />
        {/* headphone tergantung di kaki meja */}
        <path d="M1006 1184 L1006 1198" stroke="#9AA0AB" strokeWidth={5} strokeLinecap="round" />
        <path d="M980 1252 C976 1190 1036 1190 1032 1252" stroke="#C9CDD6" strokeWidth={9} fill="none" strokeLinecap="round" />
        <rect x={966} y={1236} width={26} height={44} rx={12} fill="#DADDE4" />
        <rect x={1020} y={1236} width={26} height={44} rx={12} fill="#DADDE4" />
        {/* tanaman kecil dan jam di meja */}
        <rect x={196} y={1050} width={50} height={52} rx={14} fill={p.pot} />
        <rect x={204} y={1058} width={34} height={36} rx={9} fill="#2B2B31" />
        {/* tanaman tinggi di depan meja (kiri), lebih dekat ke kamera daripada meja */}
        <TallPlant x={92} potBottom={1560} p={p} sway={sway} />
        {/* karpet berbulu */}
        <g>
          <ellipse cx={cx - 250} cy={1700} rx={170} ry={104} fill={p.rug} />
          <ellipse cx={cx} cy={1690} rx={300} ry={128} fill={p.rug} />
          <ellipse cx={cx + 260} cy={1712} rx={170} ry={104} fill={p.rug} />
          <ellipse cx={cx - 120} cy={1790} rx={190} ry={104} fill={p.rug} />
          <ellipse cx={cx + 150} cy={1796} rx={200} ry={100} fill={p.rug} />
          <ellipse cx={cx} cy={1744} rx={340} ry={128} fill={p.rug} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Monitor, lampu, dan semua yang memancarkan cahaya: digambar di atas peredupan supaya tetap terang.
export const DeskBackLights: React.FC<DeskBackProps> = ({ anchors: a = DESKBACK_ANCHORS, time, palette }) => {
  const u = useId().replace(/:/g, "");
  const p = resolve(palette, time);
  const frame = useCurrentFrame();
  const m = a.monitor;
  const s = a.shelf;
  const cxm = m.x + m.w / 2;
  const drift = Math.sin(frame / 60) * 6;
  const sx = m.x + 10;
  const sy = m.y + 10;
  const sw = m.w - 20;
  const sh = m.h - 20;
  return (
    <AbsoluteFill>
      {/* peredupan ruangan */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: p.dimColor, opacity: p.dim }} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`${u}-mon-glow`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={p.glowColor} stopOpacity={0.55 * p.glow} />
            <stop offset="1" stopColor={p.glowColor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${u}-lamp-glow`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={p.glowColor} stopOpacity={0.8 * p.glow} />
            <stop offset="1" stopColor={p.glowColor} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${u}-hfade`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.18" stopColor="#fff" stopOpacity={1} />
            <stop offset="0.82" stopColor="#fff" stopOpacity={1} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id={`${u}-shelf-mask`} maskUnits="userSpaceOnUse" x={s.x - 40} y={s.y} width={s.w + 80} height={300}>
            <rect x={s.x - 10} y={s.y} width={s.w + 20} height={300} fill={`url(#${u}-hfade)`} />
          </mask>
          <linearGradient id={`${u}-shelf-glow`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.glowColor} stopOpacity={0.9 * p.glow} />
            <stop offset="1" stopColor={p.glowColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${u}-screen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.screenBase} />
            <stop offset="1" stopColor="#3A1F66" />
          </linearGradient>
          <clipPath id={`${u}-screen-clip`}>
            <rect x={sx} y={sy} width={sw} height={sh} rx={4} />
          </clipPath>
        </defs>
        {/* cahaya rak ke dinding */}
        <rect x={s.x - 10} y={s.y + 20} width={s.w + 20} height={230} fill={`url(#${u}-shelf-glow)`} mask={`url(#${u}-shelf-mask)`} />
        <rect x={s.x} y={s.y + 20} width={s.w} height={5} fill={p.glowColor} opacity={p.glow} />
        {/* cahaya layar ke dinding dan meja */}
        <ellipse cx={cxm} cy={m.y + m.h / 2 + 30} rx={440} ry={330} fill={`url(#${u}-mon-glow)`} />
        <ellipse cx={cxm} cy={a.deskBack + 36} rx={360} ry={46} fill={`url(#${u}-mon-glow)`} />
        {/* monitor */}
        <rect x={cxm - 14} y={m.y + m.h - 2} width={28} height={a.deskBack - (m.y + m.h) + 8} fill={p.monitorStand} />
        <rect x={cxm - 70} y={a.deskBack + 2} width={140} height={12} rx={6} fill={p.monitorStand} />
        <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={12} fill={p.monitorBezel} />
        <g clipPath={`url(#${u}-screen-clip)`}>
          <rect x={sx} y={sy} width={sw} height={sh} fill={`url(#${u}-screen)`} />
          <g transform={`translate(${drift} 0)`}>
            <path d={`M${sx - 30} ${sy + 80} C${sx + 80} ${sy + 20} ${sx + 150} ${sy + 150} ${sx + 240} ${sy + 130} C${sx + 330} ${sy + 110} ${sx + 380} ${sy + 40} ${sx + sw + 40} ${sy + 70} L${sx + sw + 40} ${sy + 150} C${sx + 330} ${sy + 150} ${sx + 290} ${sy + 230} ${sx + 200} ${sy + 232} C${sx + 100} ${sy + 232} ${sx + 40} ${sy + 150} ${sx - 30} ${sy + 170} Z`} fill={p.screenPurple} />
            <path d={`M${sx + 250} ${sy - 10} C${sx + 290} ${sy + 60} ${sx + 340} ${sy + 80} ${sx + sw + 20} ${sy + 40} L${sx + sw + 20} ${sy - 10} Z`} fill={p.screenOrange} />
            <path d={`M${sx + 120} ${sy + sh + 10} C${sx + 160} ${sy + 170} ${sx + 240} ${sy + 190} ${sx + 300} ${sy + 160} C${sx + 330} ${sy + 200} ${sx + 330} ${sy + 220} ${sx + 310} ${sy + sh + 10} Z`} fill={p.screenPink} />
          </g>
          <polygon points={`${sx},${sy + sh} ${sx + 120},${sy} ${sx + 200},${sy} ${sx + 80},${sy + sh}`} fill="#fff" opacity={0.05} />
        </g>
        {/* lampu bar di atas monitor */}
        <rect x={cxm - 70} y={m.y - 20} width={140} height={10} rx={5} fill="#23232A" />
        <rect x={cxm - 60} y={m.y - 11} width={120} height={4} rx={2} fill={p.glowColor} opacity={0.4 + 0.6 * p.glow} />
        {/* keyboard dan mouse */}
        <rect x={cxm - 96} y={a.deskBack + 22} width={192} height={24} rx={5} fill={p.keyboard} />
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={cxm - 88 + i * 20} y={a.deskBack + 26} width={16} height={7} rx={2} fill={p.keyboardKey} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={cxm - 80 + i * 20} y={a.deskBack + 35} width={16} height={7} rx={2} fill={p.keyboardKey} />
        ))}
        <ellipse cx={cxm + 130} cy={a.deskBack + 34} rx={13} ry={9} fill={p.keyboard} />
        {/* lampu meja kecil dan gelas pensil */}
        <circle cx={cxm + 232} cy={a.deskBack - 8} r={120} fill={`url(#${u}-lamp-glow)`} />
        <rect x={cxm + 218} y={a.deskBack - 40} width={30} height={46} rx={14} fill={p.glowColor} opacity={0.55 + 0.45 * p.glow} />
        <rect x={cxm + 214} y={a.deskBack + 2} width={38} height={8} rx={4} fill="#E5DFD3" />
        <rect x={1004} y={a.deskBack - 56} width={44} height={58} rx={6} fill={p.pot} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${1014 + i * 12} ${a.deskBack - 54} L${1008 + i * 14 + (i - 1) * 4} ${a.deskBack - 86}`} stroke="#2B2B31" strokeWidth={4} strokeLinecap="round" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Sandaran mesh, dudukan, sandaran tangan, dan dasar kursi; digambar di depan karakter.
export const DeskBackChair: React.FC<DeskBackProps> = ({ anchors: a = DESKBACK_ANCHORS, time, palette }) => {
  const u = useId().replace(/:/g, "");
  const p = resolve(palette, time);
  const cx = a.seatX;
  const top = a.seatTop;
  const backTop = top - 126;
  const edge = p.chairFrame;
  const spoke = (x: number, y: number) => `M${cx} 1652 L${x} ${y}`;
  const ends: readonly (readonly [number, number])[] = [[cx - 230, 1736], [cx + 230, 1736], [cx - 150, 1640], [cx + 150, 1640], [cx, 1792]];
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`${u}-mesh`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 0 L10 10 M10 0 L0 10" stroke={edge} strokeWidth={1.2} opacity={0.35} />
          </pattern>
        </defs>
        {/* kolom gas dan dasar bintang */}
        <rect x={cx - 15} y={top + 60} width={30} height={196} fill={edge} />
        {ends.slice(2, 4).map(([x, y]) => (
          <g key={x}>
            <path d={spoke(x, y)} stroke={edge} strokeWidth={20} strokeLinecap="round" />
            <circle cx={x} cy={y + 16} r={16} fill="#1E1E24" />
          </g>
        ))}
        {ends.slice(0, 2).map(([x, y]) => (
          <g key={x}>
            <path d={spoke(x, y)} stroke={edge} strokeWidth={24} strokeLinecap="round" />
            <circle cx={x} cy={y + 20} r={19} fill="#1E1E24" />
          </g>
        ))}
        <path d={spoke(ends[4][0], ends[4][1])} stroke={edge} strokeWidth={28} strokeLinecap="round" />
        <circle cx={ends[4][0]} cy={ends[4][1] + 22} r={22} fill="#1E1E24" />
        <ellipse cx={cx} cy={1652} rx={42} ry={18} fill={edge} />
        {/* sandaran tangan */}
        {([-1, 1] as const).map((s) => (
          <g key={s}>
            <rect x={cx + s * 150 - 9} y={top - 100} width={18} height={104} rx={6} fill={edge} />
            <rect x={cx + s * 150 - 38} y={top - 118} width={76} height={26} rx={13} fill={p.chairSeat} />
          </g>
        ))}
        {/* sandaran mesh */}
        <path d={`M${cx - 112} ${backTop + 16} Q${cx - 118} ${backTop} ${cx - 96} ${backTop} L${cx + 96} ${backTop} Q${cx + 118} ${backTop} ${cx + 112} ${backTop + 16} L${cx + 120} ${top - 16} Q${cx + 120} ${top + 4} ${cx + 98} ${top + 4} L${cx - 98} ${top + 4} Q${cx - 120} ${top + 4} ${cx - 120} ${top - 16} Z`} fill={edge} />
        <path d={`M${cx - 96} ${backTop + 16} L${cx + 96} ${backTop + 16} L${cx + 104} ${top - 18} L${cx - 104} ${top - 18} Z`} fill={p.chairMesh} />
        <path d={`M${cx - 96} ${backTop + 16} L${cx + 96} ${backTop + 16} L${cx + 104} ${top - 18} L${cx - 104} ${top - 18} Z`} fill={`url(#${u}-mesh)`} />
        {/* dudukan */}
        <rect x={cx - 156} y={top} width={312} height={66} rx={30} fill={p.chairSeat} />
        <rect x={cx - 148} y={top + 4} width={296} height={8} rx={4} fill="#fff" opacity={0.18} />
        <rect x={cx - 156} y={top + 52} width={312} height={14} rx={7} fill="#000" opacity={0.14} />
      </svg>
    </AbsoluteFill>
  );
};
