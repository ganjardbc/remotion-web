import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GanjarStickman, ganjarStickmanSize } from "../characters";
import { OutdoorBack, outdoorPalette, PORTRAIT_OUTDOOR_ANCHORS } from "./outdoor";
import { PlainBack, plainPalette, PORTRAIT_PLAIN_ANCHORS } from "./plain";
import { ContactShadow, characterFilter, type TimeOfDay } from "./shared";
import { WorkspaceScene } from "./workspace";

export type BackdropKind = "kosong" | "luarRuang" | "ruangKerja";

const GANJAR_HEIGHT = 760;

// Ganjar berdiri di atas garis lantai latar `kind` pada waktu `time` (nama atau 0..1).
export const BackdropScene: React.FC<{ readonly kind: BackdropKind; readonly time: TimeOfDay | number }> = ({ kind, time }) => {
  if (kind === "ruangKerja") return <WorkspaceScene time={time} />;
  const floorY = kind === "kosong" ? PORTRAIT_PLAIN_ANCHORS.floorY : PORTRAIT_OUTDOOR_ANCHORS.floorY;
  const shadow = kind === "kosong" ? plainPalette(time).shadowOpacity : outdoorPalette(time).shadowOpacity;
  const s = ganjarStickmanSize(GANJAR_HEIGHT);
  return (
    <AbsoluteFill>
      {kind === "kosong" ? <PlainBack time={time} /> : <OutdoorBack time={time} />}
      <ContactShadow x={540} y={floorY} width={420} opacity={shadow} />
      <div style={{ position: "absolute", left: 540 - s.width / 2, top: floorY - GANJAR_HEIGHT * 0.91, filter: characterFilter(time) }}>
        <GanjarStickman height={GANJAR_HEIGHT} expression="senyum" hair headphones={false} strokeWidth={5} />
      </div>
    </AbsoluteFill>
  );
};

const KINDS: readonly { readonly kind: BackdropKind; readonly label: string }[] = [
  { kind: "ruangKerja", label: "Ruang kerja" },
  { kind: "kosong", label: "Kosong" },
  { kind: "luarRuang", label: "Luar ruang" },
];
const TIMES: readonly TimeOfDay[] = ["siang", "sore", "malam"];
const CELL = { w: 200, h: 356 } as const;

// Matriks semua latar × semua waktu, untuk membandingkan sekaligus.
export const BackdropsMatrix: React.FC = () => (
  <AbsoluteFill style={{ background: "#f8f6f1", padding: 24, flexDirection: "column", gap: 20, justifyContent: "center" }}>
    <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
      {KINDS.map(({ kind, label }) => (
        <div key={kind}>
          <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 24, textTransform: "uppercase", color: "#17171b", marginBottom: 10 }}>{label}</div>
          <div style={{ display: "flex", gap: 10 }}>
            {TIMES.map((t) => (
              <div key={t} style={{ position: "relative", width: CELL.w, height: CELL.h, overflow: "hidden", borderRadius: 10 }}>
                <div style={{ width: 1080, height: 1920, transform: `scale(${CELL.w / 1080})`, transformOrigin: "0 0", position: "relative" }}>
                  <BackdropScene kind={kind} time={t} />
                </div>
                <div style={{ position: "absolute", left: 8, top: 6, fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

// Peralihan siang ke sore ke malam di satu latar.
export const BackdropCycle: React.FC<{ readonly kind?: BackdropKind }> = ({ kind = "luarRuang" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <BackdropScene kind={kind} time={interpolate(frame, [0, durationInFrames - 1], [0, 1])} />;
};
