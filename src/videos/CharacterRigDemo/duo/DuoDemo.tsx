import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  evalGanjar,
  headTurn,
  point,
  startle,
  type PlacedClip as GanjarClip,
} from "../../../assets/characters/ganjar/rig/clips";
import { evalFace as evalGanjarFace, type FaceKey as GanjarFaceKey } from "../../../assets/characters/ganjar/rig/face";
import { GANJAR_VIEWBOX, GanjarRig } from "../../../assets/characters/ganjar/rig/GanjarRig";
import { COLORS, FLOOR_Y as GANJAR_FLOOR } from "../../../assets/characters/ganjar/rig/geometry";
import { RIG_VIEWBOX, RobotRig, surprise, evalFace as evalRobotFace, evalRobot } from "../../../assets/characters/robot/rig";
import type { FaceKey as RobotFaceKey } from "../../../assets/characters/robot/rig";
import type { PlacedClip as RobotClip } from "../../../assets/characters/robot/rig/clips";
import { FLOOR_Y as ROBOT_FLOOR } from "../../../assets/characters/robot/rig/geometry";

const FPS = 30;
const at = (s: number): number => Math.round(s * FPS);

// Skenario interaksi, 7 detik:
// 0-1.2 idle | 1.2 Ganjar menoleh ke kiri layar | 2.0 menunjuk | 3.4 robot kaget
// 4.2 Ganjar menoleh ke robot | 5.4 kembali idle.
export const DUO_DEMO_FRAMES = 7 * FPS;

const G_CLIPS: readonly GanjarClip[] = [
  { clip: headTurn(at(2.6), -1, -4), start: at(1.2), dur: at(2.6) },
  { clip: point("L", at(1.8), 84), start: at(2.0), dur: at(1.8) },
  { clip: startle(at(0.9)), start: at(3.4), dur: at(0.9) },
  { clip: headTurn(at(1.4), 0.9, 3), start: at(4.2), dur: at(1.4) },
];
const G_FACE: readonly GanjarFaceKey[] = [
  { at: 1.2, expression: "bingung" },
  { at: 2.0, expression: "senang" },
  { at: 3.4, expression: "kaget" },
  { at: 4.2, expression: "bingung" },
  { at: 5.2, expression: "senyumSantai" },
  { at: 5.9, expression: "netral" },
];

const R_CLIPS: readonly RobotClip[] = [{ clip: surprise, start: at(3.4), dur: at(1.0) }];
const R_FACE: readonly RobotFaceKey[] = [
  { at: 3.4, expression: "kaget" },
  { at: 5.0, expression: "senang" },
  { at: 5.9, expression: "normal" },
];

const FLOOR_PX = 1560;

export const DuoDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gW = 640;
  const gH = (gW * GANJAR_VIEWBOX.h) / GANJAR_VIEWBOX.w;
  const gScale = gW / GANJAR_VIEWBOX.w;
  const gTop = FLOOR_PX - (GANJAR_FLOOR - GANJAR_VIEWBOX.y) * gScale;
  const rW = 440;
  const rH = (rW * RIG_VIEWBOX.h) / RIG_VIEWBOX.w;
  const rScale = rW / RIG_VIEWBOX.w;
  const rTop = FLOOR_PX - (ROBOT_FLOOR - RIG_VIEWBOX.y) * rScale;
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <svg
        width={gW}
        height={gH}
        viewBox={`${GANJAR_VIEWBOX.x} ${GANJAR_VIEWBOX.y} ${GANJAR_VIEWBOX.w} ${GANJAR_VIEWBOX.h}`}
        style={{ position: "absolute", left: 130, top: gTop, overflow: "visible" }}
      >
        <GanjarRig pose={evalGanjar(frame, G_CLIPS)} face={evalGanjarFace(frame, fps, G_FACE)} />
      </svg>
      <svg
        width={rW}
        height={rH}
        viewBox={`${RIG_VIEWBOX.x} ${RIG_VIEWBOX.y} ${RIG_VIEWBOX.w} ${RIG_VIEWBOX.h}`}
        style={{ position: "absolute", left: 600, top: rTop, overflow: "visible" }}
      >
        <RobotRig pose={evalRobot(frame, R_CLIPS)} face={evalRobotFace(frame, fps, R_FACE)} />
      </svg>
    </AbsoluteFill>
  );
};
