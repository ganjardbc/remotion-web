import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { blockArms } from "../../shared/gestures";
import { expressionAt, type PropDrivenProps } from "../../shared/props";
import { Cube, Joint, type Faces, type Paint } from "../../shared/blockKit";
import type { RobotExpression } from "../../robot/rig/face";
import { CLAUDE_CODE_EXPRESSIONS } from "../rig/ClaudeCode";
import { eyeShape } from "../rig/eyes";
import { ARM, BODY, CENTER_X, COLORS as C, EYE, LEG, LEG_X } from "../rig/geometry";

// Claude Code versi balok, sepasang dengan RobotBlock: kubus CSS 3D dengan sisi vektor halus.
// Proporsi (U) = unit grid logo: badan 18x12,08x8, lengan 3x3,1x3, kaki 1,51x2,92x2.

export const CLAUDE_CODE_BLOCK_EXPRESSIONS = CLAUDE_CODE_EXPRESSIONS;

const BODY_DEPTH = 8;
const ARM_DEPTH = 3;
const LEG_DEPTH = 2;
const LEG_H = LEG.bottom - LEG.top;

const flat: Paint = (w, h) => <rect width={w} height={h} fill={C.orange} />;
const top: Paint = (w, h) => <rect width={w} height={h} fill={C.orangeLight} />;
const dark: Paint = (w, h) => <rect width={w} height={h} fill={C.orangeDark} />;

// Koordinat sisi: 10 unit per U. Mata dipusatkan relatif ke kiri badan.
const bodyFront =
  (e: RobotExpression): Paint =>
  (w, h) => (
    <>
      <rect width={w} height={h} fill={C.orange} />
      {([-1, 1] as const).map((side) => (
        <g key={side} transform={`translate(${(CENTER_X + side * EYE.dx - BODY.x) * 10} ${(EYE.y - BODY.y) * 10}) scale(10)`}>
          {eyeShape(e, side)}
        </g>
      ))}
    </>
  );

const SOLID: Faces = { front: flat, back: flat, left: flat, right: flat, top, bottom: dark };

export type ClaudeCodeBlockProps = PropDrivenProps<RobotExpression> & {
  // Sudut putar badan (derajat). 0 = menghadap kamera.
  readonly yaw?: number;
  // Putaran terus-menerus, derajat per detik.
  readonly spin?: number;
};

export const claudeCodeBlockSize = (height: number): { width: number; height: number } => ({
  width: (height / 17) * 26,
  height,
});

export const ClaudeCodeBlock: React.FC<ClaudeCodeBlockProps> = ({
  height = 640,
  expression: expressionProp = "netral",
  face,
  gesture,
  yaw = 24,
  spin = 0,
  walk = false,
  wave = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const expression = expressionAt(face, expressionProp, frame, fps);
  const arms = blockArms(gesture, t, true);
  const u = height / 17;
  const { width } = claudeCodeBlockSize(height);

  const phase = t * Math.PI * 2 * 1.4;
  const swing = walk ? Math.sin(phase) * 30 : 0;
  const idle = walk ? 0 : Math.sin(t * 1.5);
  const bob = walk ? -Math.abs(Math.sin(phase)) * 0.35 * u : idle * 0.12 * u;
  const roll = walk ? Math.sin(phase) * 2.2 : idle * 0.8;
  const flap = Math.sin(t * Math.PI * 2 * 2.2) * 14;

  // Lengan: kiri keluar = rotateZ positif, kanan keluar = negatif. Ayun jalan lewat rotateY (maju mundur).
  const armPlus = arms[1] !== null ? `rotateZ(-${arms[1] - 90}deg)` : wave ? `rotateZ(-${150 + flap}deg)` : `rotateY(${swing}deg) rotateZ(${-(1 + idle)}deg)`;
  const armMinus = arms[0] !== null ? `rotateZ(${arms[0] - 90}deg)` : `rotateY(${-swing}deg) rotateZ(${1 + idle}deg)`;
  const shoulderY = (ARM.y + ARM.h / 2 - (BODY.y + BODY.h)) * u;

  return (
    <div style={{ position: "relative", width, height, perspective: u * 60, perspectiveOrigin: "50% 45%", ...style }}>
      {/* bayangan di lantai */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - u * 10,
          top: u * 14.6,
          width: u * 20,
          height: u * 4,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.26), rgba(0,0,0,0))",
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width, height, transformStyle: "preserve-3d", transform: "rotateX(-9deg)" }}>
        <Joint transform={`translate(${width / 2}px, ${u * 14.1 + bob}px) rotateY(${yaw + spin * t}deg) rotateZ(${roll}deg)`}>
          <Cube w={BODY.w} h={BODY.h} d={BODY_DEPTH} u={u} faces={{ ...SOLID, front: bodyFront(expression) }} transform={`translateY(${(-BODY.h / 2) * u}px)`} />

          <Joint transform={`translate(${(BODY.w / 2) * u}px, ${shoulderY}px) ${armPlus}`}>
            <Cube w={ARM.w} h={ARM.h} d={ARM_DEPTH} u={u} faces={SOLID} transform={`translateX(${(ARM.w / 2) * u}px)`} />
          </Joint>
          <Joint transform={`translate(${(-BODY.w / 2) * u}px, ${shoulderY}px) ${armMinus}`}>
            <Cube w={ARM.w} h={ARM.h} d={ARM_DEPTH} u={u} faces={SOLID} transform={`translateX(${(-ARM.w / 2) * u}px)`} />
          </Joint>

          {LEG_X.map((x, i) => {
            const side = i < 2 ? -1 : 1;
            return (
              <Joint
                key={x}
                transform={`translate(${(x + LEG.w / 2 - CENTER_X) * u}px, ${-0.3 * u}px) rotateX(${-side * swing}deg)`}
              >
                <Cube w={LEG.w} h={LEG_H + 0.3} d={LEG_DEPTH} u={u} faces={SOLID} transform={`translateY(${((LEG_H + 0.3) / 2) * u}px)`} />
              </Joint>
            );
          })}
        </Joint>
      </div>
    </div>
  );
};
