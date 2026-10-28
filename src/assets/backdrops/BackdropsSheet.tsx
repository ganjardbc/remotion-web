import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Ganjar, GanjarBlock, GanjarStickman, ganjarBlockSize, ganjarSize, ganjarStickmanSize } from "../characters";
import { OutdoorBack, outdoorPalette, PORTRAIT_OUTDOOR_ANCHORS } from "./outdoor";
import { PlainBack, plainPalette, PORTRAIT_PLAIN_ANCHORS } from "./plain";
import { DeskBlock, OutdoorBlock, PlainBlock, RoomBackBlock } from "./block";
import { OutdoorSketch, PlainSketch } from "./sketch";
import { ContactShadow, characterFilter, type TimeOfDay } from "./shared";
import { PORTRAIT_ANCHORS, WorkspaceScene } from "./workspace";

export type BackdropKind = "kosong" | "luarRuang" | "ruangKerja";
// rig = bidang warna datar untuk karakter rig 2D; sketsa = kertas dan garis tipis untuk stickman;
// balok = lantai petak dan kubus 3D untuk karakter block.
export type BackdropStyle = "rig" | "sketsa" | "balok";

const STICKMAN_HEIGHT = 760;
const RIG_HEIGHT = 1000;
const BLOCK_HEIGHT = 760;

// Karakter yang serasi dengan gaya latar berdiri di atas garis lantai latar `kind` pada waktu `time` (nama atau 0..1).
export const BackdropScene: React.FC<{ readonly kind: BackdropKind; readonly time: TimeOfDay | number; readonly style?: BackdropStyle }> = ({
  kind,
  time,
  style = "rig",
}) => {
  if (kind === "ruangKerja") {
    if (style !== "balok") return <WorkspaceScene time={time} />;
    // Ganjar block berdiri di belakang meja; pinggulnya sejajar permukaan meja, jadi meja menutup kakinya.
    const h = 700;
    const w = ganjarBlockSize(h).width;
    return (
      <AbsoluteFill>
        <RoomBackBlock time={time} />
        {/* potong di balik meja: kaki tidak boleh muncul di bawah panel depan */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PORTRAIT_ANCHORS.deskTop + 60, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: PORTRAIT_ANCHORS.seatX - w / 2, top: PORTRAIT_ANCHORS.deskTop + 20 - (22 / 34) * h, filter: characterFilter(time) }}>
            <GanjarBlock height={h} expression="senang" />
          </div>
        </div>
        <DeskBlock time={time} />
      </AbsoluteFill>
    );
  }
  const floorY = kind === "kosong" ? PORTRAIT_PLAIN_ANCHORS.floorY : PORTRAIT_OUTDOOR_ANCHORS.floorY;
  const shadow = kind === "kosong" ? plainPalette(time).shadowOpacity : outdoorPalette(time).shadowOpacity;
  const sketch = style === "sketsa";
  const block = style === "balok";
  const plain = kind === "kosong";
  const back = block ? (
    plain ? <PlainBlock time={time} /> : <OutdoorBlock time={time} />
  ) : sketch ? (
    plain ? <PlainSketch time={time} /> : <OutdoorSketch time={time} />
  ) : plain ? (
    <PlainBack time={time} />
  ) : (
    <OutdoorBack time={time} />
  );
  const rig = ganjarSize(RIG_HEIGHT);
  const stick = ganjarStickmanSize(STICKMAN_HEIGHT);
  const blk = ganjarBlockSize(BLOCK_HEIGHT);
  // Blok membawa bayangannya sendiri; gaya lain memakai ContactShadow di kaki.
  const width = block ? blk.width : sketch ? stick.width : rig.width;
  const top = block ? floorY - BLOCK_HEIGHT : sketch ? floorY - STICKMAN_HEIGHT * 0.91 : floorY - RIG_HEIGHT + rig.floorGap;
  return (
    <AbsoluteFill>
      {back}
      {style === "rig" && <ContactShadow x={540} y={floorY} width={420} opacity={shadow} />}
      <div style={{ position: "absolute", left: 540 - width / 2, top, filter: characterFilter(time) }}>
        {block ? (
          <GanjarBlock height={BLOCK_HEIGHT} expression="senang" />
        ) : sketch ? (
          <GanjarStickman height={STICKMAN_HEIGHT} expression="senyum" hair headphones={false} strokeWidth={5} />
        ) : (
          <Ganjar height={RIG_HEIGHT} expression="senyumSantai" />
        )}
      </div>
    </AbsoluteFill>
  );
};

const GROUPS: readonly { readonly kind: BackdropKind; readonly style: BackdropStyle; readonly label: string }[] = [
  { kind: "ruangKerja", style: "rig", label: "Ruang kerja" },
  { kind: "kosong", style: "rig", label: "Kosong (rig)" },
  { kind: "luarRuang", style: "rig", label: "Luar ruang (rig)" },
  { kind: "kosong", style: "sketsa", label: "Kosong (sketsa)" },
  { kind: "luarRuang", style: "sketsa", label: "Luar ruang (sketsa)" },
  { kind: "ruangKerja", style: "balok", label: "Ruang kerja (balok)" },
  { kind: "kosong", style: "balok", label: "Kosong (balok)" },
  { kind: "luarRuang", style: "balok", label: "Luar ruang (balok)" },
];
const TIMES: readonly TimeOfDay[] = ["siang", "sore", "malam"];
const CELL = { w: 150, h: 267 } as const;

// Matriks semua latar × gaya × waktu, untuk membandingkan sekaligus.
export const BackdropsMatrix: React.FC = () => (
  <AbsoluteFill style={{ background: "#f8f6f1", padding: 20, flexDirection: "row", flexWrap: "wrap", gap: 28, alignContent: "center", justifyContent: "center" }}>
    {GROUPS.map(({ kind, style, label }) => (
      <div key={label}>
        <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 20, textTransform: "uppercase", color: "#17171b", marginBottom: 8 }}>{label}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {TIMES.map((t) => (
            <div key={t} style={{ position: "relative", width: CELL.w, height: CELL.h, overflow: "hidden", borderRadius: 10 }}>
              <div style={{ width: 1080, height: 1920, transform: `scale(${CELL.w / 1080})`, transformOrigin: "0 0", position: "relative" }}>
                <BackdropScene kind={kind} time={t} style={style} />
              </div>
              <div style={{ position: "absolute", left: 6, top: 4, fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);

// Peralihan siang ke sore ke malam di satu latar.
export const BackdropCycle: React.FC<{ readonly kind?: BackdropKind; readonly style?: BackdropStyle }> = ({ kind = "luarRuang", style = "rig" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <BackdropScene kind={kind} time={interpolate(frame, [0, durationInFrames - 1], [0, 1])} style={style} />;
};
