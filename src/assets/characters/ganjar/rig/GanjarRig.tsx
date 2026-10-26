import type React from "react";
import { COLORS as C, FACE, FLOOR_Y, PIVOTS as P } from "./geometry";
import type { FaceState } from "./face";
import type { ArmPose, GanjarPose, LegPose } from "./pose";

export const GANJAR_VIEWBOX = { x: -420, y: -20, w: 840, h: 1250 } as const;

const skinStroke = { stroke: C.skinOutline, strokeWidth: 3, strokeLinejoin: "round" as const };
const hairStroke = { stroke: C.hairOutline, strokeWidth: 3, strokeLinejoin: "round" as const };

// ---------- Kepala ----------

const RearHair: React.FC = () => (
  <g data-part="hair-rear">
    <path
      d="M-134 282 C-170 232 -176 150 -130 100 C-80 40 20 20 90 44 C160 70 190 150 150 232 C146 252 142 268 140 282 Z"
      fill={C.hair}
      {...hairStroke}
    />
  </g>
);

const Ears: React.FC<{ readonly turn: number }> = ({ turn }) => (
  <g data-part="ears">
    {([-1, 1] as const).map((s) => {
      // Telinga di sisi yang menjauh dari arah toleh menyempit.
      const away = Math.max(0, -s * turn);
      return (
        <g key={s} transform={`translate(${s * 118 - turn * 6} 318) scale(${1 - away * 0.4} 1)`}>
          <ellipse cx={s * 10} cy={0} rx={30} ry={36} fill={C.skin} {...skinStroke} />
          <path d={`M${s * 8} -12 Q${s * 22} 2 ${s * 8} 16`} fill="none" stroke={C.skinShade} strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

const Mouth: React.FC<{ readonly face: FaceState }> = ({ face }) => {
  const y = FACE.mouthY;
  const w = face.mouthWidth / 2;
  const corner = y - face.smile * 5;
  if (face.mouthOpen < 0.06) {
    return (
      <path
        d={`M${-w} ${corner} Q0 ${y + face.smile * 16} ${w} ${corner}`}
        fill="none"
        stroke={C.mouthDark}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    );
  }
  const depth = face.mouthOpen * 62;
  const top = y + face.smile * 6;
  return (
    <g>
      <path
        d={`M${-w} ${corner} C${-w * 0.7} ${top} ${w * 0.7} ${top} ${w} ${corner} C${w * 0.95} ${y + depth * 1.3} ${-w * 0.95} ${y + depth * 1.3} ${-w} ${corner} Z`}
        fill={C.mouth}
        stroke={C.mouthDark}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {face.mouthOpen > 0.35 ? (
        <ellipse cx={0} cy={y + depth * 0.5} rx={w * 0.42} ry={Math.min(9, depth * 0.17)} fill={C.tongue} />
      ) : null}
    </g>
  );
};

const Eye: React.FC<{ readonly side: -1 | 1; readonly face: FaceState }> = ({ side, face }) => {
  const x = side * FACE.eyeX + face.lookX;
  const y = FACE.eyeY + face.lookY;
  const closed = Math.max(0, Math.min(1, 1 - face.eyeOpen * 4));
  const arcY = 3 - face.eyeArc * 20;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g opacity={1 - closed}>
        <ellipse cx={0} cy={0} rx={19} ry={Math.max(2, 24 * face.eyeOpen)} fill={C.eye} />
        <circle cx={6} cy={-9 * face.eyeOpen} r={5 * Math.min(1, face.eyeOpen * 2)} fill="#fff" opacity={0.95} />
      </g>
      <path
        d={`M-19 3 Q0 ${arcY} 19 3`}
        fill="none"
        stroke={C.eye}
        strokeWidth={6.5}
        strokeLinecap="round"
        opacity={closed}
      />
    </g>
  );
};

const Brow: React.FC<{ readonly side: -1 | 1; readonly y: number; readonly rot: number; readonly lookX: number }> = ({
  side,
  y,
  rot,
  lookX,
}) => (
  <g transform={`translate(${side * 58 + lookX * 0.4} ${FACE.browY + y}) rotate(${side === -1 ? rot : -rot})`}>
    <path d="M-26 4 Q0 -8 26 2" fill="none" stroke={C.eye} strokeWidth={9} strokeLinecap="round" />
  </g>
);

// Rambut hitam pendek berantakan: helai poni panjang menyapu dari kanan atas ke kiri, jambul dan helai mencuat.
const FrontHair: React.FC = () => (
  <g data-part="hair-front">
    <path
      d="M-124 262 C-140 190 -118 110 -50 76 C-10 56 40 54 80 70 C140 90 164 160 150 262 C146 236 138 214 128 196 C122 214 110 226 98 230 C94 210 80 196 62 188 C40 204 12 214 -18 214 C-44 212 -70 214 -90 226 C-98 208 -110 196 -124 190 C-128 214 -128 240 -124 262 Z"
      fill={C.hair}
      {...hairStroke}
    />
    {/* helai poni panjang */}
    <path d="M74 66 C34 116 -20 164 -72 216 C-60 176 -14 128 -6 64 Z" fill={C.hair} {...hairStroke} />
    {/* jambul */}
    <path d="M-40 78 C-62 36 -30 10 2 20 C-10 36 -6 56 6 74 Z" fill={C.hair} {...hairStroke} />
    <path d="M20 64 C30 18 72 6 104 24 C82 30 72 48 74 68 Z" fill={C.hair} {...hairStroke} />
    <path d="M104 78 C132 54 164 68 168 96 C148 90 130 94 118 108 Z" fill={C.hair} {...hairStroke} />
    {/* helai mencuat di samping */}
    <path d="M-124 170 C-170 158 -190 186 -188 210 C-168 200 -146 204 -122 224 Z" fill={C.hair} {...hairStroke} />
    <path d="M146 160 C186 150 208 176 206 200 C186 190 166 194 146 214 Z" fill={C.hair} {...hairStroke} />
    <path d="M-120 250 C-138 262 -140 282 -134 300 C-124 290 -116 290 -108 290 Z" fill={C.hair} {...hairStroke} />
  </g>
);

const Head: React.FC<{ readonly face: FaceState; readonly turn: number }> = ({ face, turn }) => {
  const feat = turn * 34;
  return (
    <g data-part="head">
      <g transform={`translate(${-turn * 9} 0)`}>
        <RearHair />
      </g>
      <Ears turn={turn} />
      <g data-part="face">
        <path
          d="M-116 250 C-116 196 -80 176 0 176 C80 176 116 196 116 250 L116 318 C116 372 70 402 0 402 C-70 402 -116 372 -116 318 Z"
          fill={C.skin}
          {...skinStroke}
        />
        <g transform={`translate(${feat} 0)`}>
          {([-1, 1] as const).map((s) => (
            <ellipse key={s} cx={s * 80} cy={338} rx={28} ry={16} fill={C.blush} opacity={0.35 * face.blush} />
          ))}
          <Eye side={-1} face={face} />
          <Eye side={1} face={face} />
          <Brow side={-1} y={face.browL.y} rot={face.browL.rot} lookX={face.lookX} />
          <Brow side={1} y={face.browR.y} rot={face.browR.rot} lookX={face.lookX} />
          <path d={`M4 ${FACE.mouthY - 26} Q14 ${FACE.mouthY - 16} 4 ${FACE.mouthY - 12}`} fill="none" stroke={C.skinShade} strokeWidth={4} strokeLinecap="round" />
          <Mouth face={face} />
        </g>
      </g>
      <g transform={`translate(${turn * 12} 0)`}>
        <FrontHair />
      </g>
    </g>
  );
};

// ---------- Lengan ----------

// ---------- Lengan ----------

const Hand: React.FC<{ readonly point: number }> = ({ point }) => (
  <g data-part="hand">
    {point > 0.02 ? (
      <rect x={-7} y={20} width={15} height={20 + 52 * point} rx={7.5} fill={C.skin} {...skinStroke} />
    ) : null}
    <ellipse cx={0} cy={18} rx={27} ry={30} fill={C.skin} {...skinStroke} />
    <path d="M-12 30 Q0 38 12 30" fill="none" stroke={C.skinShade} strokeWidth={4} strokeLinecap="round" />
  </g>
);

const Arm: React.FC<{ readonly side: -1 | 1; readonly arm: ArmPose }> = ({ side, arm }) => (
  <g
    data-part={side === -1 ? "arm-left" : "arm-right"}
    transform={`translate(${side * P.shoulderX} ${P.shoulderY}) rotate(${-side * arm.shoulder})`}
  >
    {/* lengan bawah dulu, supaya lengan baju menutup siku */}
    <g transform={`translate(0 ${P.upperArmLen}) rotate(${-side * arm.elbow})`}>
      <path d={`M-25 -6 L25 -6 L20 ${P.forearmLen} L-20 ${P.forearmLen} Z`} fill={C.skin} {...skinStroke} />
      <g transform={`translate(0 ${P.forearmLen - 6})`}>
        <Hand point={arm.point} />
      </g>
      <circle cx={0} cy={0} r={25} fill={C.skin} />
    </g>
    <rect x={-23} y={100} width={46} height={P.upperArmLen - 90} fill={C.skin} />
    <path
      data-part="sleeve"
      d="M-44 8 C-44 -14 44 -14 44 8 L46 128 Q0 142 -46 128 Z"
      fill={C.shirt}
      stroke={C.hairOutline}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M-30 20 C-28 56 -28 90 -30 112" fill="none" stroke={C.shirtLight} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
  </g>
);

// ---------- Badan ----------

const Torso: React.FC<{ readonly breathe: number }> = ({ breathe }) => (
  <g data-part="torso" transform={`translate(0 ${P.waist.y}) scale(${1 + breathe * 0.5} ${1 + breathe}) translate(0 ${-P.waist.y})`}>
    <path
      d="M-118 446 C-60 428 60 428 118 446 C140 470 146 560 140 650 C138 676 140 696 138 716 C60 730 -60 730 -138 716 C-140 696 -138 676 -140 650 C-146 560 -140 470 -118 446 Z"
      fill={C.shirt}
      stroke={C.hairOutline}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M-100 640 C-40 660 40 660 100 640" fill="none" stroke={C.shirtLight} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    <path d="M-80 520 C-70 560 -74 600 -88 626" fill="none" stroke={C.shirtLight} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
  </g>
);

const NeckAndCollar: React.FC = () => (
  <g data-part="neck">
    <path d="M-28 396 L28 396 L32 452 Q0 478 -32 452 Z" fill={C.skin} {...skinStroke} />
    <path d="M-30 428 Q0 452 30 428" fill="none" stroke={C.skinShade} strokeWidth={8} opacity={0.6} />
    <path
      d="M-62 440 Q0 504 62 440 L58 428 Q0 486 -58 428 Z"
      fill={C.shirt}
      stroke={C.hairOutline}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </g>
);

// ---------- Kaki ----------

// Sneaker low-top hitam-putih dengan swoosh putih dan sol putih.
const Shoe: React.FC<{ readonly side: -1 | 1 }> = ({ side }) => (
  <g data-part="shoe" transform={`scale(${side} 1)`}>
    {/* menghadap keluar: scale(-1) membalik untuk kaki kiri */}
    <path
      d="M-58 -46 L20 -46 C30 -26 62 -22 86 -10 L88 10 L-58 10 Z"
      fill={C.hair}
      stroke={C.hairOutline}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M-8 -4 C22 8 52 -2 80 -14 C62 6 30 12 -4 8 Z" fill={C.white} />
    {[-38, -28, -18].map((y) => (
      <path key={y} d={`M-22 ${y} L12 ${y + 6}`} stroke={C.white} strokeWidth={4.5} strokeLinecap="round" />
    ))}
    <rect x={-64} y={4} width={156} height={22} rx={10} fill={C.white} stroke={C.hairOutline} strokeWidth={3} />
    <path d="M-56 18 L84 18" stroke={C.shoeShade} strokeWidth={3} />
  </g>
);

// Saat duduk paha tampak memendek (foreshortening) sebesar SIT_SHRINK.
const SIT_SHRINK = 0.78;

const Leg: React.FC<{ readonly side: -1 | 1; readonly leg: LegPose; readonly sit: number }> = ({ side, leg, sit }) => {
  const cx = side * P.hipX;
  const thighFull = P.kneeY - P.hipY;
  const k = 1 - SIT_SHRINK * sit;
  const thigh = thighFull;
  const shin = P.ankleY - P.kneeY;
  return (
    <g
      data-part={side === -1 ? "leg-left" : "leg-right"}
      transform={`translate(${cx} ${P.hipY - leg.lift}) rotate(${-side * leg.hip})`}
    >
      <g transform={`translate(0 ${thighFull * k}) rotate(${side * leg.knee})`}>
        <g data-part="shin">
          <path
            d={`M-58 -8 L58 -8 L72 ${shin - 22} C78 ${shin - 8} 76 ${shin + 2} 70 ${shin + 6} L-70 ${shin + 6} C-76 ${shin + 2} -78 ${shin - 8} -72 ${shin - 22} Z`}
            fill={C.pants}
            stroke={C.hairOutline}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d={`M-34 20 C-32 60 -34 ${shin - 40} -36 ${shin - 28}`} fill="none" stroke={C.pantsLight} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
          {/* manset celana menggumpal di atas sepatu */}
          <path d={`M-70 ${shin - 24} Q0 ${shin - 12} 70 ${shin - 24}`} fill="none" stroke={C.pantsLight} strokeWidth={5} strokeLinecap="round" />
          <g transform={`translate(${side * 24} ${shin + 14}) scale(1.12)`}>
            <Shoe side={side} />
          </g>
        </g>
        <circle cx={0} cy={0} r={48} fill={C.pants} />
      </g>
      <g data-part="thigh" transform={`scale(1 ${k})`}>
        <path
          d={`M${-56} -22 L56 -22 L60 ${thigh} L-60 ${thigh} Z`}
          fill={C.pants}
          stroke={C.hairOutline}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* kantong cargo di sisi luar */}
        <g transform={`translate(${side * 56} 62)`}>
          <rect x={side === -1 ? -22 : -14} y={0} width={36} height={78} rx={7} fill={C.pants} stroke={C.hairOutline} strokeWidth={3} />
          <path d={`M${side === -1 ? -22 : -14} 22 L${side === -1 ? 14 : 22} 22`} stroke={C.pantsLight} strokeWidth={4} />
        </g>
        <path d={`M${-side * 30} 10 C${-side * 26} 60 ${-side * 28} 120 ${-side * 32} ${thigh - 14}`} fill="none" stroke={C.pantsLight} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      </g>
    </g>
  );
};

const Pelvis: React.FC = () => (
  <g data-part="pelvis">
    <path
      d="M-130 690 L130 690 L134 760 L0 790 L-134 760 Z"
      fill={C.pants}
      stroke={C.hairOutline}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M0 700 L0 770" stroke={C.pantsLight} strokeWidth={5} />
    <path d="M-130 704 L130 704" stroke={C.pantsLight} strokeWidth={4} opacity={0.8} />
  </g>
);

export type GanjarRigProps = { readonly pose: GanjarPose; readonly face: FaceState };

export const GanjarRig: React.FC<GanjarRigProps> = ({ pose, face }) => {
  const { root, torso, head } = pose;
  const lifted = Math.max(0, -(root.y + pose.hipY));
  const shadow = 1 - Math.min(0.3, lifted / 200);
  return (
    <g data-part="ganjar" transform={`translate(${root.x} ${root.y})`}>
      <ellipse cx={0} cy={FLOOR_Y + 6} rx={200 * shadow} ry={16 * shadow} fill="#000" opacity={0.1} />
      <g data-part="lower-body" transform={`translate(0 ${pose.hipY + pose.sit * SIT_SHRINK * (P.kneeY - P.hipY)})`}>
        <Leg side={-1} leg={pose.legL} sit={pose.sit} />
        <Leg side={1} leg={pose.legR} sit={pose.sit} />
        <Pelvis />
        <g
          data-part="upper-body"
          transform={`rotate(${torso.rot} ${P.waist.x} ${P.waist.y})`}
        >
          <Torso breathe={torso.breathe} />
          <NeckAndCollar />
          <Arm side={-1} arm={pose.armL} />
          <Arm side={1} arm={pose.armR} />
          <g
            data-part="head-group"
            transform={`translate(0 ${head.y}) rotate(${head.rot} ${P.neck.x} ${P.neck.y})`}
          >
            <Head face={face} turn={head.turn} />
          </g>
        </g>
      </g>
    </g>
  );
};
