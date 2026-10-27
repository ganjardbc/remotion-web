import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Cube, flip, Joint, stroke, type Faces, type Paint } from "../../shared/blockKit";
import type { RobotExpression } from "../rig/face";
import { ROBOT_EXPRESSIONS } from "../rig/Robot";
import { COLORS as C } from "../rig/geometry";

// Robot versi balok, gaya yang sama dengan GanjarBlock: kubus CSS 3D dengan sisi vektor halus.
// Desain mengikuti design-references/characters/robot-approved.png: badan oranye dengan layar hitam,
// mata biru kotak, dua antena krem berujung biru, lengan krem di sisi, kaki oranye bersepatu krem.
// Proporsi (U): badan 14x11x8, antena 1.6x2.2 + ujung 1.9x1.2, lengan 2.4x6.4x3, kaki 3.4x3.9, sepatu 3.9x1.5x4.8.

export const ROBOT_BLOCK_EXPRESSIONS = ROBOT_EXPRESSIONS;

// ---------- Wajah ----------

export const eyeShape = (kind: RobotExpression, side: -1 | 1): React.ReactNode => {
  const fill = C.blueLight;
  switch (kind) {
    case "senang":
      return stroke("M-10 6 Q0 -10 10 6", fill, 5);
    case "kaget":
      return <rect x={-8} y={-17} width={16} height={34} rx={8} fill={fill} />;
    case "malu":
      return stroke(side === -1 ? "M-7 -10 L7 0 L-7 10" : "M7 -10 L-7 0 L7 10", fill, 5);
    case "sedih":
      return <rect x={-9} y={-4} width={18} height={15} rx={3} fill={fill} />;
    case "marah":
      return <path d={side === -1 ? "M-11 -6 L11 3 L11 12 H-11 Z" : "M11 -6 L-11 3 L-11 12 H11 Z"} fill={fill} />;
    case "bingung":
      return side === -1 ? (
        <rect x={-7} y={-7} width={14} height={14} rx={7} fill={fill} />
      ) : (
        <rect x={-11} y={-14} width={22} height={28} rx={4} fill={fill} />
      );
    case "mikir":
      return <rect x={-10} y={-14} width={20} height={11} rx={5.5} fill={fill} />;
    case "kesal":
      return <path d={side === -1 ? "M-11 -2 L11 5 L11 10 Q11 12 9 12 L-9 12 Q-11 12 -11 10 Z" : "M11 -2 L-11 5 L-11 10 Q-11 12 -9 12 L9 12 Q11 12 11 10 Z"} fill={fill} />;
    case "serius":
      return <rect x={-12} y={-3} width={24} height={11} rx={2.5} fill={fill} />;
    case "mataTertutup":
      return stroke("M-10 -3 Q0 9 10 -3", fill, 5);
    default:
      return <rect x={-11} y={-12} width={22} height={24} rx={4} fill={fill} />;
  }
};

const bodyFront =
  (e: RobotExpression): Paint =>
  (w, h) => (
    <>
      <rect width={w} height={h} fill={C.orange} />
      <rect y={h - 22} width={w} height={22} fill={C.orangeDark} opacity={0.25} />
      <rect x={12} y={12} width={w - 24} height={74} rx={8} fill={C.screenEdge} />
      <rect x={15} y={15} width={w - 30} height={68} rx={6} fill={C.screen} />
      {([-1, 1] as const).map((side) => (
        <g key={side} transform={`translate(${w / 2 + side * 24} 50)`}>
          {eyeShape(e, side)}
        </g>
      ))}
      {[50, 60, 70, 80, 90].map((x) => (
        <g key={x}>{stroke(`M${x} 99 L${x} 104`, C.orangeDark, 2.6, 0.7)}</g>
      ))}
    </>
  );

const bodySide: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.orange} />
    <rect x={9} y={16} width={w - 18} height={h - 34} rx={6} fill={C.orangeDark} opacity={0.3} />
    <circle cx={w / 2} cy={h * 0.5} r={4.5} fill={C.cream} />
    <circle cx={w / 2} cy={h * 0.5} r={2} fill={C.creamDark} />
  </>
);

const bodyBack: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.orange} />
    <rect x={w * 0.3} y={h * 0.25} width={w * 0.4} height={h * 0.4} rx={6} fill={C.orangeDark} opacity={0.35} />
    <circle cx={w * 0.34} cy={h * 0.3} r={2.4} fill={C.cream} />
    <circle cx={w * 0.66} cy={h * 0.3} r={2.4} fill={C.cream} />
  </>
);

const orangeFlat: Paint = (w, h) => <rect width={w} height={h} fill={C.orange} />;
const orangeDarkFlat: Paint = (w, h) => <rect width={w} height={h} fill={C.orangeDark} />;
const orangeTop: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.orangeLight} />
    <rect x={8} y={8} width={w - 16} height={h - 16} rx={8} fill={C.orange} opacity={0.35} />
  </>
);

const creamFlat: Paint = (w, h) => <rect width={w} height={h} fill={C.cream} />;
const creamBand: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.cream} />
    <rect y={h - 7} width={w} height={7} fill={C.creamDark} />
  </>
);
const blueFlat: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.blue} />
    <rect y={0} width={w} height={h * 0.35} fill={C.blueLight} opacity={0.5} />
  </>
);

const legSide: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.orange} />
    <rect x={w * 0.18} width={w * 0.16} height={h} fill={C.orangeLight} opacity={0.5} />
  </>
);

// ---------- Bagian ----------

const BODY: Faces = { front: undefined, back: bodyBack, left: bodySide, right: flip(bodySide), top: orangeTop, bottom: orangeDarkFlat };
const STEM: Faces = { front: creamFlat, back: creamFlat, left: creamFlat, right: creamFlat, top: creamFlat };
const TIP: Faces = { front: blueFlat, back: blueFlat, left: blueFlat, right: blueFlat, top: blueFlat, bottom: blueFlat };
const ARM: Faces = { front: creamBand, back: creamBand, left: creamBand, right: creamBand, top: creamFlat, bottom: creamFlat };
const LEG: Faces = { front: legSide, back: legSide, left: legSide, right: legSide, top: orangeFlat, bottom: orangeDarkFlat };
const FOOT: Faces = { front: creamBand, back: creamBand, left: creamBand, right: creamBand, top: creamFlat, bottom: creamBand };

export type RobotBlockProps = {
  // Tinggi seluruh kotak karakter dalam px.
  readonly height?: number;
  readonly expression?: RobotExpression;
  // Sudut putar badan (derajat). 0 = menghadap kamera.
  readonly yaw?: number;
  // Putaran terus-menerus, derajat per detik.
  readonly spin?: number;
  readonly walk?: boolean;
  readonly wave?: boolean;
  readonly style?: React.CSSProperties;
};

export const robotBlockSize = (height: number): { width: number; height: number } => ({
  width: (height / 23) * 26,
  height,
});

export const RobotBlock: React.FC<RobotBlockProps> = ({
  height = 640,
  expression = "normal",
  yaw = 24,
  spin = 0,
  walk = false,
  wave = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const u = height / 23;
  const { width } = robotBlockSize(height);

  const phase = t * Math.PI * 2 * 1.4;
  const swing = walk ? Math.sin(phase) * 30 : 0;
  const idle = walk ? 0 : Math.sin(t * 1.5);
  const bob = walk ? -Math.abs(Math.sin(phase)) * 0.35 * u : idle * 0.12 * u;
  const roll = walk ? Math.sin(phase) * 2.2 : idle * 0.8;
  const flap = Math.sin(t * Math.PI * 2 * 2.2) * 14;
  const wobble = (k: number) => Math.sin(t * 3.1 + k) * (walk ? 9 : 4);

  const armPlus = wave ? `rotateZ(-${150 + flap}deg)` : `rotateX(${-swing}deg) rotateZ(${-(1 + idle)}deg)`;
  const armMinus = `rotateX(${swing}deg) rotateZ(${1 + idle}deg)`;

  return (
    <div style={{ position: "relative", width, height, perspective: u * 70, perspectiveOrigin: "50% 45%", ...style }}>
      {/* bayangan di lantai */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - u * 8,
          top: u * 23 - u * 2.2,
          width: u * 16,
          height: u * 4,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.26), rgba(0,0,0,0))",
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width, height, transformStyle: "preserve-3d", transform: "rotateX(-9deg)" }}>
        <Joint transform={`translate(${width / 2}px, ${u * 16.2 + bob}px) rotateY(${yaw + spin * t}deg) rotateZ(${roll}deg)`}>
          <Cube w={14} h={11} d={8} u={u} faces={{ ...BODY, front: bodyFront(expression) }} transform={`translateY(${-5.5 * u}px)`} />

          {([-1, 1] as const).map((side) => (
            <Joint key={side} transform={`translate(${side * 4.6 * u}px, ${-11 * u}px) rotateZ(${wobble(side)}deg)`}>
              <Cube w={1.6} h={2.2} d={1.6} u={u} faces={STEM} transform={`translateY(${-1 * u}px)`} />
              <Cube w={1.9} h={1.2} d={1.9} u={u} faces={TIP} transform={`translateY(${-2.65 * u}px)`} />
            </Joint>
          ))}

          <Joint transform={`translate(${8.4 * u}px, ${-8.2 * u}px) ${armPlus}`}>
            <Cube w={2.4} h={6.4} d={3} u={u} faces={ARM} transform={`translateY(${3.2 * u}px)`} />
          </Joint>
          <Joint transform={`translate(${-8.4 * u}px, ${-8.2 * u}px) ${armMinus}`}>
            <Cube w={2.4} h={6.4} d={3} u={u} faces={ARM} transform={`translateY(${3.2 * u}px)`} />
          </Joint>

          {([1, -1] as const).map((side) => (
            <Joint key={side} transform={`translate(${side * 3.2 * u}px, ${-0.2 * u}px) rotateX(${-side * swing}deg)`}>
              <Cube w={3.4} h={3.9} d={3.4} u={u} faces={LEG} transform={`translateY(${1.95 * u}px)`} />
              <Cube w={3.9} h={1.5} d={4.8} u={u} faces={FOOT} transform={`translate3d(0, ${4.65 * u}px, ${0.5 * u}px)`} />
            </Joint>
          ))}
        </Joint>
      </div>
    </div>
  );
};
