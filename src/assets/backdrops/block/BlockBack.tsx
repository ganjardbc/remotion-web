import type React from "react";
import { AbsoluteFill } from "remotion";
import { Cube, Joint, type Paint } from "../../characters/shared/blockKit";
import { OUTDOOR_BUILDINGS, outdoorPalette, PORTRAIT_OUTDOOR_ANCHORS, type OutdoorAnchors, type OutdoorPalette } from "../outdoor";
import { plainPalette, PORTRAIT_PLAIN_ANCHORS, type PlainAnchors, type PlainPalette } from "../plain";
import { blendTimes, mixHex, Sky, type TimeOfDay } from "../shared";

// Latar gaya balok untuk karakter block: lantai petak dan kubus 3D (CSS) dengan kamera sejajar tanah.
// Jangkar dan palet sama dengan `plain` / `outdoor`, jadi mengganti gaya tidak menggeser karakter.
// Kamera: titik hilang di tinggi cakrawala; lantai di y = floorY, karakter berdiri di z = 0.

export const PERSPECTIVE = 1400;
export const FLOOR_NEAR = 900;
const FLOOR_FAR = 9000;
const TILE = 220;
// Latar kosong tidak punya cakrawala sendiri: dinding dianggap setinggi ini di atas lantai.
const PLAIN_HORIZON_GAP = 520;

// Panggung 3D: setiap anak ditempatkan dengan translate3d (x, y, z) dalam piksel kanvas.
export const Stage: React.FC<{ readonly originY: number; readonly children: React.ReactNode }> = ({ originY, children }) => (
  <div style={{ position: "absolute", inset: 0, perspective: PERSPECTIVE, perspectiveOrigin: `50% ${originY}px` }}>
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>{children}</div>
  </div>
);

// Lantai petak dua warna, mendatar di y = floorY, membentang dari dekat kamera (z = +FLOOR_NEAR) sampai jauh.
export const Floor: React.FC<{ readonly floorY: number; readonly width: number; readonly a: string; readonly b: string; readonly depth?: number }> = ({
  floorY,
  width,
  a,
  b,
  depth = FLOOR_FAR,
}) => (
  <div
    style={{
      position: "absolute",
      left: width / 2 - 4500,
      top: floorY - depth,
      width: 9000,
      height: depth,
      transformOrigin: "50% 100%",
      transform: `translateZ(${FLOOR_NEAR}px) rotateX(90deg)`,
      background: `repeating-conic-gradient(${a} 0 25%, ${b} 0 50%) 0 0 / ${TILE}px ${TILE}px`,
    }}
  />
);

// Kabut tipis di cakrawala supaya petak yang menjauh menyatu dengan latar (hanya latar kosong; di luar ruang gedung menutupnya).
const Fog: React.FC<{ readonly y: number; readonly color: string; readonly height?: number }> = ({ y, color, height = 320 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y - 40, height, background: `linear-gradient(${color}, transparent)` }} />
);

export type BlockBackProps<A, P> = {
  readonly anchors?: A;
  // Waktu hari: nama, atau angka 0..1 (siang 0, sore 0.5, malam 1). Bawaan siang.
  readonly time?: TimeOfDay | number;
  readonly palette?: P;
};

// Latar kosong: dinding gradasi dan lantai petak (warna lantai dan tepi dari palet `plain`).
export const PlainBlock: React.FC<BlockBackProps<PlainAnchors, PlainPalette>> = ({ anchors: a = PORTRAIT_PLAIN_ANCHORS, time = "siang", palette }) => {
  const p = palette ?? plainPalette(time);
  const horizonY = a.floorY - PLAIN_HORIZON_GAP;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: horizonY + 40, background: `linear-gradient(${p.wallTop}, ${p.wallBottom})` }} />
      <Stage originY={horizonY}>
        <Floor floorY={a.floorY} width={1080} a={p.floor} b={p.floorEdge} />
      </Stage>
      <Fog y={horizonY} color={p.wallBottom} />
    </AbsoluteFill>
  );
};

// Warna pohon per waktu: daun berubah, batang tetap.
type TreePalette = { readonly leaf: string; readonly leafDark: string };
const TREE_TIMES: Record<TimeOfDay, TreePalette> = {
  siang: { leaf: "#4FAE63", leafDark: "#3A8A4C" },
  sore: { leaf: "#5E8A5E", leafDark: "#486E4C" },
  malam: { leaf: "#27573F", leafDark: "#1B3F2E" },
};
const TRUNK = "#8A5A33";

export const solid = (color: string): Paint => (w, h) => <rect width={w} height={h} fill={color} />;

// Muka depan gedung: warna dasar dan kisi jendela (gambar dalam piksel, dikali 10 oleh kubus).
const buildingFront =
  (index: number, color: string, lit: string, litOpacity: number): Paint =>
  (vbW, vbH) => {
    const w = vbW / 10;
    const h = vbH / 10;
    const cols = Math.max(1, Math.floor((w - 28 + 14) / 44));
    const rows = Math.max(1, Math.floor((h - 28 + 18) / 60));
    return (
      <g transform="scale(10)">
        <rect width={w} height={h} fill={color} />
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((__, c) =>
            (index * 7 + r * 5 + c * 3) % 4 !== 0 ? <rect key={`${r}-${c}`} x={14 + c * 44} y={14 + r * 60} width={28} height={42} fill={lit} opacity={litOpacity} /> : null,
          ),
        )}
      </g>
    );
  };

const Tree: React.FC<{ readonly x: number; readonly floorY: number; readonly z: number; readonly t: TreePalette }> = ({ x, floorY, z, t }) => (
  <>
    <Joint transform={`translate3d(${x}px, ${floorY - 90}px, ${z}px)`}>
      <Cube w={60} h={180} d={60} u={1} faces={{ front: solid(TRUNK), back: solid(TRUNK), left: solid(TRUNK), right: solid(TRUNK) }} />
    </Joint>
    <Joint transform={`translate3d(${x}px, ${floorY - 250}px, ${z}px)`}>
      <Cube w={210} h={180} d={210} u={1} faces={{ front: solid(t.leaf), back: solid(t.leaf), left: solid(t.leaf), right: solid(t.leaf), top: solid(t.leafDark) }} />
    </Joint>
  </>
);

// Langit, deretan gedung kubus dengan jendela, pohon balok, dan lantai petak. Karakter berdiri di `floorY`.
export const OutdoorBlock: React.FC<BlockBackProps<OutdoorAnchors, OutdoorPalette>> = ({ anchors: a = PORTRAIT_OUTDOOR_ANCHORS, time = "siang", palette }) => {
  const p = palette ?? outdoorPalette(time);
  const tree = blendTimes(TREE_TIMES, time);
  const tileB = mixHex(p.ground, p.curb, 0.35);
  // Gedung di z = -1200 (skala layar ~0,54): kubus dua kali lebih besar agar terbaca setinggi latar rig.
  const Z = -1200;
  let x = a.width / 2 - 1000;
  const buildings = OUTDOOR_BUILDINGS.map(([w, h], i) => {
    const bw = w * 2;
    const bh = h * 2.1;
    const cx = x + bw / 2;
    x += bw;
    return (
      <Joint key={i} transform={`translate3d(${cx}px, ${a.floorY - bh / 2}px, ${Z}px)`}>
        <Cube
          w={bw}
          h={bh}
          d={bw * 0.8}
          u={1}
          faces={{ front: buildingFront(i, p.building, p.windowLit, p.windowOpacity), left: solid(p.building), right: solid(p.building), top: solid(p.building) }}
        />
      </Joint>
    );
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: a.width, height: a.horizonY, overflow: "hidden" }}>
        <Sky p={p} width={a.width} cloudScale={0.6} />
      </div>
      <Stage originY={a.horizonY}>
        <Floor floorY={a.floorY} width={a.width} a={p.ground} b={tileB} />
        {buildings}
        <Tree x={a.width / 2 - 560} floorY={a.floorY} z={-260} t={tree} />
        <Tree x={a.width / 2 + 520} floorY={a.floorY} z={-420} t={tree} />
      </Stage>
    </AbsoluteFill>
  );
};
