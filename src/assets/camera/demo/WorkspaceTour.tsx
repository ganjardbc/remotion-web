import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { characterFilter, LANDSCAPE_ANCHORS, landscapePoint, WorkspaceLandscape } from "../../backdrops";
import { GanjarStickman, RobotStickman, ganjarStickmanSize, robotStickmanSize, type Gesture } from "../../characters";
import { framing, type Shot } from "../camera";
import { Vignette } from "../layouts";
import { ShotCamera } from "../ShotCamera";

// Tur kamera di ruang kerja lanskap: Ganjar duduk di depan laptop, Robot berdiri di atas meja, waktu bergeser siang ke malam.

const A = LANDSCAPE_ANCHORS;
const GANJAR_H = 760;
const ROBOT_H = 300;
const ROBOT_X = 1700;
// Meja memotong badan stickman di sekitar perut (seperti di ProgrammerBodoh).
const GANJAR_TOP = A.deskTop - 0.62 * GANJAR_H;

const GANJAR_HEAD = landscapePoint(A.seatX, GANJAR_TOP + 0.27 * GANJAR_H);
const GANJAR_CHEST = landscapePoint(A.seatX, GANJAR_TOP + 0.42 * GANJAR_H);
const ROBOT_FACE = landscapePoint(ROBOT_X, A.deskTop + (25 * ROBOT_H) / 400 - ROBOT_H * 0.6);
const LAPTOP = landscapePoint(A.laptopX, A.deskTop - 60);

const SHOTS: readonly Shot[] = [
  { from: 0, dur: 3, start: framing("wide", { x: 960, y: 540 }), label: "Wide: seluruh ruangan" },
  { from: 3, dur: 3, start: framing("wide", { x: 960, y: 540 }), end: framing("medium", GANJAR_CHEST), label: "Push-in ke Ganjar" },
  { from: 6, dur: 2.5, start: framing("closeUp", GANJAR_HEAD), label: "Close-up" },
  { from: 8.5, dur: 3, start: { ...GANJAR_CHEST, zoom: 1.8 }, end: { ...ROBOT_FACE, zoom: 1.8 }, label: "Pan ke Robot di meja" },
  { from: 11.5, dur: 2.5, start: { ...LAPTOP, zoom: 2.4 }, shake: 3, label: "Insert: laptop (handheld pelan)" },
  { from: 14, dur: 3, start: framing("medium", GANJAR_CHEST), end: framing("wide", { x: 960, y: 540 }), label: "Pull-out" },
];

export const WORKSPACE_TOUR_FRAMES = 17 * 30;

const Characters: React.FC<{ readonly time: number }> = ({ time }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = ganjarStickmanSize(GANJAR_H);
  const r = robotStickmanSize(ROBOT_H);
  const gesture: Gesture = t >= 11.5 && t < 14 ? "mengetik" : t >= 8.5 && t < 11.5 ? "tunjuk" : "netral";
  return (
    <WorkspaceLandscape
      time={time}
      behindDesk={
        <div style={{ position: "absolute", left: 0, top: 0, width: 2743, height: A.deskTop + 60, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: A.seatX - g.width / 2, top: GANJAR_TOP, filter: characterFilter(time) }}>
            <GanjarStickman height={GANJAR_H} gesture={gesture} talking={t < 8.5} hair headphones={false} />
          </div>
        </div>
      }
      onDesk={
        <div style={{ position: "absolute", left: ROBOT_X - r.width / 2, top: A.deskTop + (25 * ROBOT_H) / 400 - ROBOT_H, filter: characterFilter(time) }}>
          <RobotStickman height={ROBOT_H} gesture={t >= 8.5 && t < 11.5 ? "lambai" : "netral"} />
        </div>
      }
    />
  );
};

export const WorkspaceTour: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const time = interpolate(frame, [0, durationInFrames - 1], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShotCamera shots={SHOTS}>
        <Characters time={time} />
      </ShotCamera>
      <Vignette />
    </AbsoluteFill>
  );
};
