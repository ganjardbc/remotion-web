import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evalLook, type LookKey } from "../../shared/look";
import { evalRobot, type PlacedClip } from "../../robot/rig/clips";
import { evalFace, type FaceKey, type RobotExpression } from "../../robot/rig/face";
import { ROBOT_EXPRESSIONS } from "../../robot/rig/Robot";
import { ClaudeCodeRig, RIG_VIEWBOX } from "./ClaudeCodeRig";

// Claude Code memakai pose, clip, dan ekspresi yang sama dengan Robot (antena diabaikan).
export const CLAUDE_CODE_EXPRESSIONS: readonly RobotExpression[] = ROBOT_EXPRESSIONS;

export type ClaudeCodeProps = {
  // Tinggi kotak viewBox penuh (420 unit) dalam px.
  readonly height?: number;
  readonly expression?: RobotExpression;
  readonly face?: readonly FaceKey[];
  readonly clips?: readonly PlacedClip[];
  // Arah pandang: mata melirik ke lawan bicara.
  readonly look?: readonly LookKey[];
  readonly style?: React.CSSProperties;
};

export const claudeCodeSize = (height: number): { width: number; height: number; floorGap: number } => {
  const scale = height / RIG_VIEWBOX.h;
  return { width: RIG_VIEWBOX.w * scale, height, floorGap: (RIG_VIEWBOX.y + RIG_VIEWBOX.h) * scale };
};

export const ClaudeCode: React.FC<ClaudeCodeProps> = ({
  height = 340 * (RIG_VIEWBOX.h / RIG_VIEWBOX.w),
  expression = "normal",
  face,
  clips = [],
  look = [],
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = evalFace(frame, fps, face ?? [{ at: -1, expression }]);
  const gaze = evalLook(frame, fps, look);
  return (
    <svg
      width={(height * RIG_VIEWBOX.w) / RIG_VIEWBOX.h}
      height={height}
      viewBox={`${RIG_VIEWBOX.x} ${RIG_VIEWBOX.y} ${RIG_VIEWBOX.w} ${RIG_VIEWBOX.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <ClaudeCodeRig pose={evalRobot(frame, clips)} face={{ ...state, lookX: state.lookX + gaze.turn * 16 }} />
    </svg>
  );
};
