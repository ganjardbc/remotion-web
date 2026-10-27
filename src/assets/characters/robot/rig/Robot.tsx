import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evalLook, type LookKey } from "../../shared/look";
import { evalRobot, type PlacedClip } from "./clips";
import { evalFace, type FaceKey, type RobotExpression } from "./face";
import { RIG_VIEWBOX, RobotRig } from "./RobotRig";
import { FLOOR_Y } from "./geometry";

export const ROBOT_EXPRESSIONS: readonly RobotExpression[] = [
  "normal",
  "senang",
  "kaget",
  "malu",
  "sedih",
  "marah",
  "bingung",
  "mikir",
  "kesal",
  "serius",
  "mataTertutup",
];

export type RobotProps = {
  // Tinggi kotak viewBox penuh (560 unit) dalam px.
  readonly height?: number;
  readonly expression?: RobotExpression;
  readonly face?: readonly FaceKey[];
  readonly clips?: readonly PlacedClip[];
  // Arah pandang layar (turn -1..1): mata robot melirik ke lawan bicara.
  readonly look?: readonly LookKey[];
  readonly style?: React.CSSProperties;
};

export const robotSize = (height: number): { width: number; height: number; floorGap: number } => {
  const scale = height / RIG_VIEWBOX.h;
  return {
    width: RIG_VIEWBOX.w * scale,
    height,
    floorGap: (RIG_VIEWBOX.y + RIG_VIEWBOX.h - FLOOR_Y) * scale,
  };
};

export const Robot: React.FC<RobotProps> = ({
  height = 340 * (RIG_VIEWBOX.h / RIG_VIEWBOX.w),
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
      width={(height * RIG_VIEWBOX.w) / RIG_VIEWBOX.h}
      height={height}
      viewBox={`${RIG_VIEWBOX.x} ${RIG_VIEWBOX.y} ${RIG_VIEWBOX.w} ${RIG_VIEWBOX.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <RobotRig pose={evalRobot(frame, clips)} face={{ ...state, lookX: state.lookX + gaze.turn * 16 }} />
    </svg>
  );
};
