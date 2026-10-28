import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GanjarStickman, ganjarStickmanSize, type Gesture } from "../../characters";
import { Chair, Desk, Laptop, Mug, RoomBack } from "./Workspace";
import { PORTRAIT_ANCHORS } from "./anchors";
import { characterFilter, type TimeOfDay } from "./time";

const GANJAR_HEIGHT = 760;
// Meja memotong badan stickman di sekitar perut, sama seperti di video ProgrammerBodoh.
const GANJAR_TOP = PORTRAIT_ANCHORS.deskTop - 0.62 * GANJAR_HEIGHT;

// Satu adegan ruang kerja penuh dengan Ganjar duduk, pada waktu hari tertentu (nama atau 0..1).
export const WorkspaceScene: React.FC<{ readonly time: TimeOfDay | number; readonly gesture?: Gesture }> = ({ time, gesture = "netral" }) => {
  const a = PORTRAIT_ANCHORS;
  const s = ganjarStickmanSize(GANJAR_HEIGHT);
  return (
    <AbsoluteFill>
      <RoomBack time={time} />
      <Chair time={time} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: a.deskTop + 60, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: a.seatX - s.width / 2, top: GANJAR_TOP, filter: characterFilter(time) }}>
          <GanjarStickman height={GANJAR_HEIGHT} expression="senyum" gesture={gesture} hair headphones={false} strokeWidth={5} />
        </div>
      </div>
      <Desk time={time} />
      <Laptop time={time} />
      <Mug />
    </AbsoluteFill>
  );
};

const TIMES: readonly TimeOfDay[] = ["siang", "sore", "malam"];

// Tiga waktu berdampingan, untuk membandingkan latar dan karakter sekaligus.
export const WorkspaceTimes: React.FC = () => (
  <AbsoluteFill style={{ background: "#f8f6f1", flexDirection: "row", gap: 24, padding: 24 }}>
    {TIMES.map((t) => (
      <div key={t} style={{ position: "relative", width: 540, height: 960, overflow: "hidden", borderRadius: 16 }}>
        <div style={{ width: 1080, height: 1920, transform: "scale(0.5)", transformOrigin: "0 0", position: "relative" }}>
          <WorkspaceScene time={t} />
        </div>
        <div style={{ position: "absolute", left: 16, top: 12, fontFamily: "monospace", fontWeight: 700, fontSize: 28, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.6)", textTransform: "uppercase" }}>{t}</div>
      </div>
    ))}
  </AbsoluteFill>
);

// Peralihan halus siang ke sore ke malam dalam satu adegan.
export const WorkspaceCycle: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const time = interpolate(frame, [0, durationInFrames - 1], [0, 1]);
  return <WorkspaceScene time={time} />;
};

// Ganjar mengetik di depan laptop; waktu tetap.
export const WorkspaceTyping: React.FC<{ readonly time?: TimeOfDay }> = ({ time = "malam" }) => <WorkspaceScene time={time} gesture="mengetik" />;
