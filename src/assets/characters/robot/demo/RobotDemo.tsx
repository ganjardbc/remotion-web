import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  armGesture,
  evalFace,
  evalRobot,
  RIG_VIEWBOX,
  RobotRig,
  surprise,
  walk,
  type FaceKey,
} from "../rig";
import type { PlacedClip } from "../rig/clips";
import { COLORS } from "../rig/geometry";

// Satu timeline, detik -> frame di dalam komponen. Total 8 detik @30fps.
const FPS = 30;
const at = (s: number): number => Math.round(s * FPS);

export const ROBOT_DEMO_FRAMES = 8 * FPS;

const CLIPS: readonly PlacedClip[] = [
  { clip: armGesture("R", at(1.0), 130, 14), start: at(3.0), dur: at(1.0) },
  { clip: armGesture("L", at(1.0), 95, 0), start: at(3.7), dur: at(1.0) },
  { clip: surprise, start: at(4.9), dur: at(1.0) },
  { clip: walk(at(1.5)), start: at(6.0), dur: at(1.5) },
];

const FACE: readonly FaceKey[] = [
  { at: 1.0, expression: "senang" },
  { at: 1.5, expression: "malu" },
  { at: 2.0, expression: "sedih" },
  { at: 2.5, expression: "marah" },
  { at: 3.0, expression: "normal" },
  { at: 4.9, expression: "kaget" },
  { at: 6.0, expression: "senang" },
  { at: 7.5, expression: "normal" },
];

const LABELS: readonly (readonly [number, string])[] = [
  [0, "idle"],
  [1, "screen expressions"],
  [3, "independent arms"],
  [4.9, "surprised reaction"],
  [6, "walk test (front, sidestep)"],
  [7.5, "back to idle"],
];

export const RobotDemo: React.FC<{ readonly debug?: boolean }> = ({ debug = true }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const seconds = frame / fps;
  const pose = evalRobot(frame, CLIPS);
  const face = evalFace(frame, fps, FACE);
  const svgW = width * 0.8;
  const svgH = (svgW * RIG_VIEWBOX.h) / RIG_VIEWBOX.w;
  let label = LABELS[0][1];
  for (const l of LABELS) {
    if (l[0] <= seconds) {
      label = l[1];
    }
  }
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`${RIG_VIEWBOX.x} ${RIG_VIEWBOX.y} ${RIG_VIEWBOX.w} ${RIG_VIEWBOX.h}`}
        style={{ position: "absolute", left: (width - svgW) / 2, top: 640, overflow: "visible" }}
      >
        <RobotRig pose={pose} face={face} />
      </svg>
      {debug ? (
        <div
          style={{
            position: "absolute",
            bottom: 140,
            width: "100%",
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: 34,
            color: "#6b6b70",
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
