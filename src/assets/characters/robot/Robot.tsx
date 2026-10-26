import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evalLook, type LookKey } from "../shared/look";
import { RIG_VIEWBOX, RobotRig, evalFace, evalRobot, type FaceKey, type RobotExpression } from "./rig";
import type { PlacedClip } from "./rig/clips";
import { FLOOR_Y } from "./rig/geometry";

export const ROBOT_EXPRESSIONS: readonly RobotExpression[] = [
  "normal",
  "senang",
  "kaget",
  "malu",
  "sedih",
  "marah",
];

export type RobotProps = {
  // Lebar kotak viewBox penuh (660 unit) dalam px.
  readonly width?: number;
  readonly expression?: RobotExpression;
  readonly face?: readonly FaceKey[];
  readonly clips?: readonly PlacedClip[];
  // Arah pandang layar (turn -1..1): mata robot melirik ke lawan bicara.
  readonly look?: readonly LookKey[];
  readonly style?: React.CSSProperties;
};

export const robotSize = (width: number): { width: number; height: number; floorGap: number } => {
  const scale = width / RIG_VIEWBOX.w;
  return {
    width,
    height: RIG_VIEWBOX.h * scale,
    floorGap: (RIG_VIEWBOX.y + RIG_VIEWBOX.h - FLOOR_Y) * scale,
  };
};

export const Robot: React.FC<RobotProps> = ({
  width = 340,
  expression = "normal",
  face,
  clips = [],
  look = [],
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keys = face ?? [{ at: -1, expression }];
  const gaze = evalLook(frame, fps, look);
  const state = evalFace(frame, fps, keys);
  return (
    <svg
      width={width}
      height={(width * RIG_VIEWBOX.h) / RIG_VIEWBOX.w}
      viewBox={`${RIG_VIEWBOX.x} ${RIG_VIEWBOX.y} ${RIG_VIEWBOX.w} ${RIG_VIEWBOX.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <RobotRig pose={evalRobot(frame, clips)} face={{ ...state, lookX: state.lookX + gaze.turn * 16 }} />
    </svg>
  );
};
