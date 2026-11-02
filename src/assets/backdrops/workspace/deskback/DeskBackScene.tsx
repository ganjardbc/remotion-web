import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Ganjar, ganjarSize } from "../../../characters";
import { characterFilter, type TimeOfDay } from "../../shared";
import { DESKBACK_ANCHORS } from "./anchors";
import { DeskBackChair, DeskBackLights, DeskBackRoom } from "./DeskBack";

// Adegan penuh: Ganjar duduk menghadap monitor, tampak dari belakang, pada waktu hari tertentu (nama atau 0..1).
// Lengan menekuk ke dalam (tertutup badan, hanya siku yang tampak) dan bergerak pelan saat mengetik.
export const DeskBackScene: React.FC<{ readonly time?: TimeOfDay | number; readonly typing?: boolean }> = ({ time = "malam", typing = true }) => {
  const a = DESKBACK_ANCHORS;
  const frame = useCurrentFrame();
  const s = ganjarSize(a.characterHeight);
  const bob = typing ? Math.sin(frame / 4.2) * 2.5 : 0;
  const bobR = typing ? Math.sin(frame / 4.2 + 2.1) * 2.5 : 0;
  const breathe = Math.sin(frame / 38) * 0.006;
  const filter = characterFilter(time);
  return (
    <AbsoluteFill>
      <DeskBackRoom time={time} />
      <DeskBackLights time={time} />
      {/* Kaki dipotong di bawah dudukan: dari belakang tidak tampak, dasar kursi menggantikannya. */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: a.seatTop + 40, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: a.seatX - s.width / 2, top: a.characterTop, filter }}>
          <Ganjar
            height={a.characterHeight}
            view="belakang"
            sit={1}
            pose={{
              torso: { breathe },
              armL: { shoulder: 4, elbow: -80 + bob },
              armR: { shoulder: 4, elbow: -80 + bobR },
            }}
          />
        </div>
      </div>
      <div style={{ filter }}>
        <DeskBackChair time={time} />
      </div>
    </AbsoluteFill>
  );
};

const TIMES: readonly TimeOfDay[] = ["siang", "sore", "malam"];

// Tiga waktu berdampingan, untuk membandingkan latar dan karakter sekaligus.
export const DeskBackTimes: React.FC = () => (
  <AbsoluteFill style={{ background: "#f8f6f1", flexDirection: "row", gap: 24, padding: 24 }}>
    {TIMES.map((t) => (
      <div key={t} style={{ position: "relative", width: 540, height: 960, overflow: "hidden", borderRadius: 16 }}>
        <div style={{ width: 1080, height: 1920, transform: "scale(0.5)", transformOrigin: "0 0", position: "relative" }}>
          <DeskBackScene time={t} />
        </div>
        <div style={{ position: "absolute", left: 16, top: 12, fontFamily: "monospace", fontWeight: 700, fontSize: 28, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.6)", textTransform: "uppercase" }}>{t}</div>
      </div>
    ))}
  </AbsoluteFill>
);

// Peralihan halus siang ke sore ke malam dalam satu adegan.
export const DeskBackCycle: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const time = interpolate(frame, [0, durationInFrames - 1], [0, 1]);
  return <DeskBackScene time={time} />;
};
