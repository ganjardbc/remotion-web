import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cube, Joint, type Paint } from "../../characters/shared/blockKit";
import { PORTRAIT_ANCHORS, type WorkspaceAnchors } from "../workspace/anchors";
import { Clock, Window } from "../workspace/Workspace";
import type { WorkspacePalette } from "../workspace/palette";
import { workspacePalette } from "../workspace/time";
import { mixHex, type TimeOfDay } from "../shared";
import { FLOOR_NEAR, Floor, PERSPECTIVE, solid, Stage } from "./BlockBack";

// Ruang kerja gaya balok: dinding datar dengan jendela dan jam, lantai petak 3D, kursi, meja, laptop, dan gelas dari kubus.
// Urutan gambar (belakang ke depan): RoomBackBlock, karakter block duduk, DeskBlock. Jangkar dan palet sama dengan
// `workspace` (rig), jadi mengganti gaya tidak menggeser karakter. Meja memotong badan bawah karakter, seperti di rig.

// Dinding dianggap berdiri di z = -WALL_Z; garis dasarnya jatuh di tinggi layar yang dihitung dari kamera.
const WALL_Z = 800;
// Tinggi mata kamera di atas permukaan meja; titik hilang lantai ada di tinggi ini.
const EYE_ABOVE_DESK = 250;

export type WorkspaceBlockProps = {
  readonly anchors?: WorkspaceAnchors;
  // Waktu hari: nama, atau angka 0..1 (siang 0, sore 0.5, malam 1). Bawaan siang.
  readonly time?: TimeOfDay | number;
  readonly palette?: WorkspacePalette;
};

const resolve = (palette: WorkspacePalette | undefined, time: TimeOfDay | number | undefined): WorkspacePalette => palette ?? workspacePalette(time ?? "siang");

// Tinggi layar garis dasar dinding: titik di lantai pada kedalaman dinding.
const wallBaseY = (a: WorkspaceAnchors): number => {
  const eye = a.deskTop - EYE_ABOVE_DESK;
  return eye + (a.floorY - eye) * (PERSPECTIVE / (PERSPECTIVE + WALL_Z));
};

// Sisi kubus dengan warna datar; sisi yang tidak diberikan tidak digambar.
const all = (color: string) => ({ front: solid(color), back: solid(color), left: solid(color), right: solid(color), top: solid(color) });

// Dinding, jendela, jam, lantai, dan kursi gaming.
export const RoomBackBlock: React.FC<WorkspaceBlockProps> = ({ anchors: a = PORTRAIT_ANCHORS, time, palette }) => {
  const p = resolve(palette, time);
  const baseY = wallBaseY(a);
  const eye = a.deskTop - EYE_ABOVE_DESK;
  const chairColor = all(p.chair);
  const accent = all(p.chairAccent);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: baseY, background: `linear-gradient(${p.wall}, ${p.wallShade})` }} />
      <div style={{ position: "absolute", left: a.window.x - 90, top: a.window.y - 20, width: 440, height: 800, background: `linear-gradient(160deg, ${p.beamColor}, transparent 70%)`, opacity: p.beam, transform: "skewX(-14deg)" }} />
      <Window a={a} p={p} />
      <Clock x={a.clock.x} y={a.clock.y} p={p} />
      <div style={{ position: "absolute", left: 0, right: 0, top: baseY - 30, height: 30, backgroundColor: p.baseboard }} />
      <Stage originY={eye}>
        <Floor floorY={a.floorY} width={1080} a={p.floor} b={mixHex(p.floor, "#FFFFFF", 0.1)} depth={FLOOR_NEAR + WALL_Z} />
        {/* kursi: sandaran, bantal kepala, dan dua sayap bahu */}
        <Joint transform={`translate3d(${a.seatX}px, ${a.deskTop - 215}px, -220px)`}>
          <Cube w={300} h={520} d={80} u={1} faces={chairColor} />
        </Joint>
        <Joint transform={`translate3d(${a.seatX}px, ${a.deskTop - 520}px, -200px)`}>
          <Cube w={150} h={96} d={60} u={1} faces={accent} />
        </Joint>
        {[-1, 1].map((side) => (
          <Joint key={side} transform={`translate3d(${a.seatX + side * 160}px, ${a.deskTop - 150}px, -150px)`}>
            <Cube w={56} h={300} d={150} u={1} faces={accent} />
          </Joint>
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// Muka punggung layar laptop: warna dasar dengan logo bulat di tengah (digambar dalam piksel, dikali 10 oleh kubus).
const lidBack =
  (color: string, logo: string): Paint =>
  (vbW, vbH) => (
    <g transform="scale(10)">
      <rect width={vbW / 10} height={vbH / 10} fill={color} />
      <circle cx={vbW / 20} cy={vbH / 20} r={18} fill={logo} />
    </g>
  );

// Meja, laptop, dan gelas kopi; digambar di depan karakter agar meja menutup badan bawahnya.
export const DeskBlock: React.FC<WorkspaceBlockProps> = ({ anchors: a = PORTRAIT_ANCHORS, time, palette }) => {
  const p = resolve(palette, time);
  const frame = useCurrentFrame();
  const eye = a.deskTop - EYE_ABOVE_DESK;
  const deskH = a.floorY - a.deskTop;
  // Uap naik pelan lalu mengulang; kubus tidak punya opasitas per sisi, jadi hanya bergerak.
  const steamY = (i: number): number => -((frame + i * 12) % 36) * 0.6;
  return (
    <Stage originY={eye}>
      {/* meja: tubuh dan papan atas */}
      <Joint transform={`translate3d(540px, ${a.deskTop + deskH / 2}px, -10px)`}>
        <Cube w={1040} h={deskH} d={300} u={1} faces={{ front: solid(p.deskFront), left: solid(p.deskFront), right: solid(p.deskFront), top: solid(p.deskTop) }} />
      </Joint>
      <Joint transform={`translate3d(540px, ${a.deskTop + a.slab / 2}px, -10px)`}>
        <Cube w={1060} h={a.slab} d={320} u={1} faces={{ front: solid(p.deskTopEdge), left: solid(p.deskTopEdge), right: solid(p.deskTopEdge), top: solid(p.deskTop) }} />
      </Joint>
      {/* laptop: alas dan punggung layar yang sedikit miring ke belakang */}
      <Joint transform={`translate3d(${a.laptopX}px, ${a.deskTop - 8}px, -40px)`}>
        <Cube w={a.laptopW + 44} h={16} d={170} u={1} faces={{ front: solid(p.laptopEdge), left: solid(p.laptopEdge), right: solid(p.laptopEdge), top: solid(p.laptop) }} />
      </Joint>
      <Joint transform={`translate3d(${a.laptopX}px, ${a.deskTop - 14}px, -125px) rotateX(-9deg)`}>
        <Cube w={a.laptopW} h={a.laptopLidH} d={12} u={1} faces={{ front: lidBack(p.laptop, p.laptopLogo), left: solid(p.laptopEdge), right: solid(p.laptopEdge), top: solid(p.laptopEdge) }} transform={`translateY(${-a.laptopLidH / 2}px)`} />
      </Joint>
      {/* gelas kopi dengan dua kepul uap */}
      <Joint transform={`translate3d(${a.mugX + 26}px, ${a.deskTop - 31}px, 10px)`}>
        <Cube w={52} h={62} d={52} u={1} faces={{ front: solid("#FFFFFF"), left: solid("#E4E8F2"), right: solid("#E4E8F2"), top: solid("#C9CFDD") }} />
      </Joint>
      <Joint transform={`translate3d(${a.mugX + 62}px, ${a.deskTop - 28}px, 10px)`}>
        <Cube w={18} h={30} d={12} u={1} faces={{ front: solid("#C9CFDD"), left: solid("#C9CFDD"), right: solid("#C9CFDD"), top: solid("#C9CFDD") }} />
      </Joint>
      {[0, 1].map((i) => {
        return (
          <Joint key={i} transform={`translate3d(${a.mugX + 14 + i * 22}px, ${a.deskTop - 78 + steamY(i)}px, 10px)`}>
            <Cube w={6} h={24} d={6} u={1} faces={{ front: solid("#FFFFFF"), left: solid("#FFFFFF"), right: solid("#FFFFFF") }} />
          </Joint>
        );
      })}
    </Stage>
  );
};
