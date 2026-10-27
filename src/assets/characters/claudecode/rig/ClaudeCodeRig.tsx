import type React from "react";
import type { FaceState } from "../../robot/rig/face";
import type { RobotPose } from "../../robot/rig/pose";
import { eyeShape } from "./eyes";
import { ARM, BODY, CENTER_X, COLORS as C, EYE, FLOOR, LEG, LEG_X, S } from "./geometry";

// Origin = tengah bawah kaki (lantai di y = 0), satuan px. Isi digambar di unit grid lewat skala S.
export const RIG_VIEWBOX = { x: -300, y: -350, w: 600, h: 420 } as const;

const px = (gx: number): number => (gx - CENTER_X) * S;
const py = (gy: number): number => (gy - FLOOR) * S;
const BODY_BOTTOM = py(BODY.y + BODY.h);

const grid = `scale(${S}) translate(${-CENTER_X} ${-FLOOR})`;

const Arm: React.FC<{ readonly side: -1 | 1; readonly raise: number }> = ({ side, raise }) => {
  const x = side === -1 ? 0 : 21;
  const pivot = { x: px(side === -1 ? BODY.x : BODY.x + BODY.w), y: py(ARM.y + ARM.h / 2) };
  // Kiri: rotasi positif = keluar. Kanan: negatif.
  return (
    <g transform={`rotate(${-side * raise} ${pivot.x} ${pivot.y})`}>
      <g transform={grid}>
        <rect x={x} y={ARM.y} width={ARM.w} height={ARM.h} fill={C.orange} />
      </g>
    </g>
  );
};

const Leg: React.FC<{ readonly x: number; readonly lift: number; readonly swing: number }> = ({ x, lift, swing }) => (
  <g transform={`translate(0 ${-lift}) rotate(${swing} ${px(x + LEG.w / 2)} ${py(LEG.top)})`}>
    <g transform={grid}>
      <rect x={x} y={LEG.top - 0.3} width={LEG.w} height={LEG.bottom - LEG.top + 0.3} fill={C.orange} />
    </g>
  </g>
);

export type ClaudeCodeRigProps = {
  readonly pose: RobotPose;
  readonly face: FaceState;
};

export const ClaudeCodeRig: React.FC<ClaudeCodeRigProps> = ({ pose, face }) => {
  const { root, body } = pose;
  const bodyTransform = [
    `translate(0 ${body.y})`,
    `rotate(${body.rot} 0 ${BODY_BOTTOM})`,
    `translate(0 ${BODY_BOTTOM}) scale(${body.sx} ${body.sy}) translate(0 ${-BODY_BOTTOM})`,
  ].join(" ");
  const lifted = Math.max(0, -(root.y + body.y));
  const shadowScale = 1 - Math.min(0.35, lifted / 200);
  const eyeOpen = Math.max(0.06, face.open);

  return (
    <g data-part="claude-code" transform={`translate(${root.x} ${root.y}) rotate(${root.rot} 0 0)`}>
      <ellipse data-part="shadow" cx={0} cy={5} rx={190 * shadowScale} ry={12 * shadowScale} fill="#000" opacity={0.1 * shadowScale} />

      <g data-part="legs">
        <Leg x={LEG_X[0]} lift={pose.legL.lift} swing={pose.legL.swing} />
        <Leg x={LEG_X[1]} lift={pose.legL.lift} swing={pose.legL.swing} />
        <Leg x={LEG_X[2]} lift={pose.legR.lift} swing={pose.legR.swing} />
        <Leg x={LEG_X[3]} lift={pose.legR.lift} swing={pose.legR.swing} />
      </g>

      <g data-part="body-group" transform={bodyTransform}>
        <g data-part="arms">
          <Arm side={-1} raise={pose.armL} />
          <Arm side={1} raise={pose.armR} />
        </g>
        <g data-part="body" transform={grid}>
          <rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} fill={C.orange} />
          <g data-part="eyes" transform={`translate(${face.lookX / S} ${face.lookY / S})`}>
            {([-1, 1] as const).map((side) => (
              <g key={side} transform={`translate(${CENTER_X + side * EYE.dx} ${EYE.y}) scale(1 ${eyeOpen})`}>
                {eyeShape(face.expression, side)}
              </g>
            ))}
          </g>
        </g>
      </g>
    </g>
  );
};
