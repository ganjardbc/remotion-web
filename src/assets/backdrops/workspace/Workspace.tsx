import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PORTRAIT_ANCHORS, type WorkspaceAnchors } from "./anchors";
import { WORKSPACE_DAY, type WorkspacePalette } from "./palette";

// Ruang kerja berjangkar. Urutan gambar (belakang ke depan): RoomBack, Chair, karakter duduk, Desk, Laptop, Mug.
export type WorkspaceProps = {
  readonly anchors?: WorkspaceAnchors;
  readonly palette?: WorkspacePalette;
};

const Clock: React.FC<{ readonly x: number; readonly y: number; readonly p: WorkspacePalette }> = ({ x, y, p }) => {
  const r = 46;
  // 02:47 dini hari. Jarum menit bergeser pelan supaya hidup.
  const frame = useCurrentFrame();
  const minute = 47 + frame / 1800;
  const hand = (deg: number, len: number, w: number) => (
    <line x1={r} y1={r} x2={r + Math.sin((deg * Math.PI) / 180) * len} y2={r - Math.cos((deg * Math.PI) / 180) * len} stroke={p.clockInk} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <svg style={{ position: "absolute", left: x - r, top: y - r }} width={r * 2} height={r * 2}>
      <circle cx={r} cy={r} r={r - 3} fill="#FFFFFF" stroke={p.clockInk} strokeWidth={5} />
      {hand((2 + minute / 60) * 30, 22, 5)}
      {hand(minute * 6, 32, 3.5)}
      <circle cx={r} cy={r} r={4} fill={p.clockAccent} />
    </svg>
  );
};

const Window: React.FC<{ readonly a: WorkspaceAnchors; readonly p: WorkspacePalette }> = ({ a, p }) => (
  <div style={{ position: "absolute", left: a.window.x, top: a.window.y, width: a.window.w, height: a.window.h, borderRadius: 18, backgroundColor: p.frame, boxShadow: "0 8px 24px rgba(20,20,31,0.12)", padding: 14 }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 8, background: `linear-gradient(${p.sky}, ${p.skyLow})`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 28, top: 40, width: 90, height: 30, borderRadius: 20, backgroundColor: "#FFFFFF", opacity: 0.9 }} />
      <div style={{ position: "absolute", left: 120, top: 80, width: 70, height: 24, borderRadius: 20, backgroundColor: "#FFFFFF", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 10, marginLeft: -5, backgroundColor: p.frame }} />
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 10, marginTop: -5, backgroundColor: p.frame }} />
    </div>
  </div>
);

// Dinding, jendela, jam, lantai, dan bayangan di bawah meja.
export const RoomBack: React.FC<WorkspaceProps> = ({ anchors: a = PORTRAIT_ANCHORS, palette: p = WORKSPACE_DAY }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${p.wall}, ${p.wallShade})` }} />
    {/* sorot cahaya jendela */}
    <div style={{ position: "absolute", left: a.window.x - 90, top: a.window.y - 20, width: 440, height: 800, background: "linear-gradient(160deg, rgba(255,255,255,0.55), transparent 70%)", transform: "skewX(-14deg)" }} />
    <Window a={a} p={p} />
    <Clock x={a.clock.x} y={a.clock.y} p={p} />
    <div style={{ position: "absolute", left: 0, right: 0, top: a.floorY - 36, height: 36, backgroundColor: p.baseboard }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: a.floorY, bottom: 0, backgroundColor: p.floor }} />
  </AbsoluteFill>
);

// Kursi gaming di belakang karakter: sandaran sempit dan tinggi, sayap di bahu, bantal kepala.
// Yang tampak hanya sayap di kiri-kanan bahu dan bantal kepala di atas kepala.
const CHAIR_W = 340;

export const Chair: React.FC<WorkspaceProps> = ({ anchors: a = PORTRAIT_ANCHORS, palette: p = WORKSPACE_DAY }) => {
  const chairTop = a.deskTop - 480;
  const h = a.floorY - 20 - chairTop;
  const edge = { stroke: p.chairEdge, strokeWidth: 5, strokeLinejoin: "round" } as const;
  return (
    <svg style={{ position: "absolute", left: a.seatX - CHAIR_W / 2, top: chairTop }} width={CHAIR_W} height={h} viewBox={`0 0 ${CHAIR_W} ${h}`}>
      {/* bantal kepala */}
      <rect x={95} y={2} width={150} height={96} rx={34} fill={p.chairAccent} {...edge} />
      <rect x={160} y={86} width={20} height={30} fill={p.chairEdge} />
      {/* sandaran dengan sayap bahu */}
      <path d={`M62 108 Q170 84 278 108 L298 232 Q336 262 328 340 L322 ${h} L18 ${h} L12 340 Q4 262 42 232 Z`} fill={p.chair} {...edge} />
      {/* bolster di sayap */}
      <path d={`M42 232 Q4 262 12 340 L26 ${h} L58 ${h} L48 340 Q44 280 70 244 Z`} fill={p.chairAccent} {...edge} />
      <path d={`M298 232 Q336 262 328 340 L314 ${h} L282 ${h} L292 340 Q296 280 270 244 Z`} fill={p.chairAccent} {...edge} />
      {/* strip balap di tengah */}
      <path d={`M140 112 L140 ${h} M200 112 L200 ${h}`} stroke={p.chairAccent} strokeWidth={10} strokeLinecap="round" />
    </svg>
  );
};

// Tabletop dan panel depan dengan laci; menutup badan bawah karakter yang duduk.
export const Desk: React.FC<WorkspaceProps> = ({ anchors: a = PORTRAIT_ANCHORS, palette: p = WORKSPACE_DAY }) => (
  <>
    <div style={{ position: "absolute", left: 10, right: 10, top: a.deskTop, height: a.slab, borderRadius: 8, backgroundColor: p.deskTop, borderBottom: `5px solid ${p.deskTopEdge}` }} />
    <div style={{ position: "absolute", left: 30, right: 30, top: a.deskTop + a.slab, height: a.floorY - a.deskTop - a.slab, backgroundColor: p.deskFront, borderRadius: "0 0 10px 10px", boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }} />
  </>
);

// Laptop menghadap karakter: yang terlihat punggung layar, dengan logo kecil di tengah.
export const Laptop: React.FC<WorkspaceProps> = ({ anchors: a = PORTRAIT_ANCHORS, palette: p = WORKSPACE_DAY }) => (
  <>
    <div style={{ position: "absolute", left: a.laptopX - a.laptopW / 2, top: a.deskTop - a.laptopLidH, width: a.laptopW, height: a.laptopLidH, borderRadius: "16px 16px 4px 4px", backgroundColor: p.laptop, border: `5px solid ${p.laptopEdge}`, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 36, height: 36, margin: "-18px 0 0 -18px", borderRadius: "50%", backgroundColor: p.laptopLogo }} />
    </div>
    <div style={{ position: "absolute", left: a.laptopX - a.laptopW / 2 - 22, top: a.deskTop - 10, width: a.laptopW + 44, height: 12, borderRadius: "4px 4px 8px 8px", backgroundColor: p.laptopEdge }} />
  </>
);

// Gelas kopi bekas begadang, uap bergerak pelan.
export const Mug: React.FC<WorkspaceProps> = ({ anchors: a = PORTRAIT_ANCHORS }) => {
  const frame = useCurrentFrame();
  const steam = (i: number) => ({ opacity: 0.35 + 0.25 * Math.sin(frame / 14 + i), transform: `translateY(${-((frame + i * 12) % 36) * 0.6}px)` });
  return (
    <div style={{ position: "absolute", left: a.mugX, top: a.deskTop - 62, width: 60, height: 62 }}>
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", left: 14 + i * 22, top: -26, width: 6, height: 24, borderRadius: 3, backgroundColor: "#FFFFFF", ...steam(i) }} />
      ))}
      <div style={{ position: "absolute", left: 0, top: 0, width: 52, height: 62, borderRadius: "6px 6px 14px 14px", backgroundColor: "#FFFFFF", border: "4px solid #C9CFDD", boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 44, top: 14, width: 22, height: 30, borderRadius: "0 14px 14px 0", border: "5px solid #C9CFDD", borderLeft: "none", boxSizing: "border-box" }} />
    </div>
  );
};
