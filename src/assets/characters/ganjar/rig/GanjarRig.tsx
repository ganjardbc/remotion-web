import type React from "react";
import { COLORS as C, FACE, FLOOR_Y, PIVOTS as P } from "./geometry";
import type { FaceState } from "./face";
import type { ArmPose, GanjarPose, LegPose } from "./pose";

export const GANJAR_VIEWBOX = { x: -420, y: -20, w: 840, h: 1250 } as const;

// Tiap kelompok bagian (kaki, lengan, baju, kepala) digambar dua kali: pass "line" menggambar semua bentuk
// dengan goresan tebal warna garis, lalu pass "fill" menimpanya dengan isi saja. Bentuk yang bertumpuk
// jadi satu siluet bersih: garis hanya ada di tepi luar, tanpa sambungan di bahu, siku, lutut, atau dahi.
type Pass = "line" | "fill";

const LINE_W = 7;

const Shape: React.FC<{
  readonly d: string;
  readonly fill: string;
  readonly pass: Pass;
}> = ({ d, fill, pass }) =>
  pass === "line" ? (
    <path
      d={d}
      fill={C.outline}
      stroke={C.outline}
      strokeWidth={LINE_W}
      strokeLinejoin="round"
    />
  ) : (
    <path d={d} fill={fill} />
  );

const ellipse = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;

// Garis detail di dalam siluet (kelim, jahitan), digambar setelah pass fill.
const Seam: React.FC<{
  readonly d: string;
  readonly color?: string;
  readonly width?: number;
}> = ({ d, color = C.outline, width = 3.5 }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

// ---------- Kepala ----------

const FACE_CLIP_ID = "ganjar-face-clip";

// Bentuk wajah (koordinat kepala). Semua nilai default menghasilkan wajah yang sama seperti sebelumnya.
// Setengah lebar wajah di bagian terlebar: makin besar wajah makin lebar. Telinga dan pipi ikut bergeser.
const HEAD_HALF_WIDTH = 122;
// Batas atas (dahi) dan bawah (dagu) wajah: makin kecil atas atau makin besar bawah, wajah makin tinggi.
const HEAD_TOP = 122;
const HEAD_BOTTOM = 408;
// Kebulatan rahang 0.2 sampai 1: kecil = dagu meruncing (oval), besar = rahang penuh (bulat atau kotak).
const HEAD_JAW = 0.86;
// Kebulatan dahi 0.2 sampai 1: kecil = dahi menyempit, besar = dahi penuh dan membulat.
const HEAD_CROWN = 0.61;

const HEAD_WIDEST_Y = HEAD_TOP + (HEAD_BOTTOM - HEAD_TOP) * 0.458;

const faceD = (): string => {
  const w = HEAD_HALF_WIDTH;
  const t = HEAD_TOP;
  const b = HEAD_BOTTOM;
  const m = HEAD_WIDEST_Y;
  const crownY = t + (m - t) * 0.382;
  const jawY = m + (b - m) * 0.569;
  const f = (n: number): string => n.toFixed(1);
  return [
    `M0 ${f(t)}`,
    `C${f(w * HEAD_CROWN)} ${f(t)} ${f(w)} ${f(crownY)} ${f(w)} ${f(m)}`,
    `C${f(w)} ${f(jawY)} ${f(w * HEAD_JAW)} ${f(b)} 0 ${f(b)}`,
    `C${f(-w * HEAD_JAW)} ${f(b)} ${f(-w)} ${f(jawY)} ${f(-w)} ${f(m)}`,
    `C${f(-w)} ${f(crownY)} ${f(-w * HEAD_CROWN)} ${f(t)} 0 ${f(t)} Z`,
  ].join(" ");
};

const FACE_D = faceD();

// Rambut pendek dari design-references/characters/male-short-hair-shape.svg (viewBox 153.5): satu bentuk
// utuh di atas wajah. Tepi dalamnya jadi garis rambut di dahi, cambang turun di sisi wajah.
const HAIR_SVG_D =
  "M21.222,141.939c0,0-18.773-57.17,14.126-70.046c0,0,31.396,23.878,66.391,4.85c0,0,34.927-22.709,36.474,58.061c0,0,13.956-21.068,11.204-49.177c0,0,3.185,6.979,4.08,11.089c0,0,1.205-66.588-54.048-74.705c0,0,14.809-5.8,22.786,0.024c0,0-31.834-18.222-57.257-3.961c0,0-2.569-4.545,4.439-6.515c0,0-36.882-0.213-38.49,24.15c0,0-36.797,3.915-30.117,50.156l4.056-4.671C4.866,81.194,5.359,121.59,21.222,141.939z";

// Titik x di SVG yang jadi tengah kepala.
const HAIR_SVG_CENTER_X = 78;
// Lebar dan tinggi rambut (pengali ukuran SVG).
const HAIR_SCALE_X = 2;
const HAIR_SCALE_Y = 1.9;
// Geser rambut: x positif = ke kanan, y = posisi puncak viewBox SVG di kepala (makin besar makin turun).
const HAIR_X = 0;
const HAIR_Y = 56;
// Putar rambut (derajat): positif = searah jarum jam, negatif = berlawanan. Titik putarnya di tengah wajah.
const HAIR_ROTATE = 3.2;
const HAIR_PIVOT = { x: 0, y: 282 } as const;
// Kebulatan ujung runcing dan sudut rambut (0 = persis bentuk SVG). Rambut membesar sekitar setengah
// nilai ini ke segala arah, jadi nilai besar menurunkan garis rambut di dahi.
const HAIR_ROUNDNESS = 1;

// Ukuran seluruh kepala (wajah, telinga, rambut, ekspresi): 1 = normal. Skala dari pangkal leher, jadi
// kepala membesar ke atas dan ke samping tanpa menimpa badan.
const HEAD_SCALE = 1.1;

// Path SVG (M/L/C, absolut atau relatif) dipetakan ke koordinat kepala titik demi titik, bukan lewat
// transform scale, supaya tebal garis tepi rambut tetap rata.
const mapSvgPath = (
  d: string,
  map: (x: number, y: number) => readonly [number, number],
): string => {
  const tokens = d.match(/[MLCZmlcz]|-?\d*\.?\d+/g) ?? [];
  const arity: Record<string, number> = { M: 2, L: 2, C: 6 };
  const out: string[] = [];
  let cmd = "";
  let x = 0;
  let y = 0;
  for (let i = 0; i < tokens.length; ) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    const upper = cmd.toUpperCase();
    if (upper === "Z") {
      out.push("Z");
      continue;
    }
    const nums = tokens.slice(i, i + arity[upper]).map(Number);
    i += arity[upper];
    const pts: string[] = [];
    const relX = cmd === upper ? 0 : x;
    const relY = cmd === upper ? 0 : y;
    for (let k = 0; k < nums.length; k += 2) {
      const [mx, my] = map(nums[k] + relX, nums[k + 1] + relY);
      pts.push(`${mx.toFixed(1)} ${my.toFixed(1)}`);
    }
    x = nums[nums.length - 2] + relX;
    y = nums[nums.length - 1] + relY;
    out.push(upper + pts.join(" "));
  }
  return out.join(" ");
};

const HAIR_D = mapSvgPath(HAIR_SVG_D, (x, y) => [
  HAIR_X + (x - HAIR_SVG_CENTER_X) * HAIR_SCALE_X,
  HAIR_Y + y * HAIR_SCALE_Y,
]);

const Ears: React.FC<{ readonly turn: number; readonly pass: Pass }> = ({
  turn,
  pass,
}) => (
  <g data-part="ears">
    {([-1, 1] as const).map((s) => {
      // Telinga di sisi yang menjauh dari arah toleh menyempit.
      const away = Math.max(0, -s * turn);
      return (
        <g
          key={s}
          transform={`translate(${s * (HEAD_HALF_WIDTH - 4) - turn * 6} 300) scale(${1 - away * 0.4} 1)`}
        >
          <Shape d={ellipse(s * 10, 0, 24, 31)} fill={C.skin} pass={pass} />
          {pass === "fill" ? (
            <Seam
              d={`M${s * 6} -12 Q${s * 18} 0 ${s * 6} 14`}
              color={C.skinShade}
              width={6}
            />
          ) : null}
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
      <Seam
        d={`M${-w} ${corner} Q0 ${y + face.smile * 16} ${w} ${corner}`}
        color={C.mouthDark}
        width={4.5}
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
        <ellipse
          cx={0}
          cy={y + depth * 0.5}
          rx={w * 0.42}
          ry={Math.min(9, depth * 0.17)}
          fill={C.tongue}
        />
      ) : null}
    </g>
  );
};

const Eye: React.FC<{ readonly side: -1 | 1; readonly face: FaceState }> = ({
  side,
  face,
}) => {
  const x = side * FACE.eyeX + face.lookX;
  const y = FACE.eyeY + face.lookY;
  const closed = Math.max(0, Math.min(1, 1 - face.eyeOpen * 4));
  const arcY = 3 - face.eyeArc * 20;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g opacity={1 - closed}>
        <ellipse
          cx={0}
          cy={0}
          rx={18}
          ry={Math.max(2, 24 * face.eyeOpen)}
          fill={C.eye}
        />
        <circle
          cx={6}
          cy={-9 * face.eyeOpen}
          r={5 * Math.min(1, face.eyeOpen * 2)}
          fill="#fff"
          opacity={0.95}
        />
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

const Brow: React.FC<{
  readonly side: -1 | 1;
  readonly y: number;
  readonly rot: number;
  readonly lookX: number;
}> = ({ side, y, rot, lookX }) => (
  <g
    transform={`translate(${side * 56 + lookX * 0.4} ${FACE.browY + y}) rotate(${side === -1 ? rot : -rot})`}
  >
    <path
      d="M-24 4 Q0 -7 24 2"
      fill="none"
      stroke={C.eye}
      strokeWidth={9}
      strokeLinecap="round"
    />
  </g>
);

const Head: React.FC<{ readonly face: FaceState; readonly turn: number }> = ({
  face,
  turn,
}) => {
  const feat = turn * 34;
  return (
    <g data-part="head">
      {(["line", "fill"] as const).map((pass) => (
        <g key={pass}>
          <Ears turn={turn} pass={pass} />
          <Shape d={FACE_D} fill={C.skin} pass={pass} />
        </g>
      ))}
      <clipPath id={FACE_CLIP_ID}>
        <path d={FACE_D} />
      </clipPath>
      {/* Fitur wajah bergeser saat menoleh; clip menjaga pipi dan mata tetap di dalam wajah. */}
      <g data-part="face" clipPath={`url(#${FACE_CLIP_ID})`}>
        <g transform={`translate(${feat} 0)`}>
          {([-1, 1] as const).map((s) => (
            <ellipse
              key={s}
              cx={s * HEAD_HALF_WIDTH * 0.64}
              cy={338}
              rx={26}
              ry={15}
              fill={C.blush}
              opacity={0.35 * face.blush}
            />
          ))}
          <Eye side={-1} face={face} />
          <Eye side={1} face={face} />
          <Brow
            side={-1}
            y={face.browL.y}
            rot={face.browL.rot}
            lookX={face.lookX}
          />
          <Brow
            side={1}
            y={face.browR.y}
            rot={face.browR.rot}
            lookX={face.lookX}
          />
          <Seam
            d={`M4 ${FACE.mouthY - 26} Q14 ${FACE.mouthY - 16} 4 ${FACE.mouthY - 12}`}
            color={C.skinShade}
            width={4}
          />
          <Mouth face={face} />
        </g>
      </g>
      <g
        data-part="hair"
        transform={`rotate(${HAIR_ROTATE} ${HAIR_PIVOT.x} ${HAIR_PIVOT.y})`}
      >
        <path
          d={HAIR_D}
          fill={C.outline}
          stroke={C.outline}
          strokeWidth={LINE_W + HAIR_ROUNDNESS}
          strokeLinejoin="round"
        />
        <path
          d={HAIR_D}
          fill={C.hair}
          stroke={C.hair}
          strokeWidth={HAIR_ROUNDNESS}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
};

// ---------- Lengan ----------

// Lengan diam sedikit terbuka supaya tidak tertutup badan.
const ARM_REST = 13;

const armTransform = (side: -1 | 1, arm: ArmPose): string =>
  `translate(${side * P.shoulderX} ${P.shoulderY}) rotate(${-side * (arm.shoulder + ARM_REST)})`;

// Lengan kulit: lengan atas, siku bulat, lengan bawah, dan tangan jadi satu siluet. Bagian atasnya
// tertutup lengan kaos.
const Arm: React.FC<{
  readonly side: -1 | 1;
  readonly arm: ArmPose;
  readonly pass: Pass;
}> = ({ side, arm, pass }) => (
  <g
    data-part={side === -1 ? "arm-left" : "arm-right"}
    transform={armTransform(side, arm)}
  >
    <Shape
      d={`M-19 0 L19 0 L18 ${P.upperArmLen} L-18 ${P.upperArmLen} Z`}
      fill={C.skin}
      pass={pass}
    />
    <g transform={`translate(0 ${P.upperArmLen}) rotate(${-side * arm.elbow})`}>
      <Shape d={ellipse(0, 0, 18, 18)} fill={C.skin} pass={pass} />
      <Shape
        d={`M-18 0 L18 0 L16 ${P.forearmLen} L-16 ${P.forearmLen} Z`}
        fill={C.skin}
        pass={pass}
      />
      <g data-part="hand" transform={`translate(0 ${P.forearmLen + 10})`}>
        {arm.point > 0.02 ? (
          <Shape
            d={`M-7 10 L7 10 L7 ${18 + 50 * arm.point} Q0 ${26 + 50 * arm.point} -7 ${18 + 50 * arm.point} Z`}
            fill={C.skin}
            pass={pass}
          />
        ) : null}
        <Shape d={ellipse(0, 0, 25, 27)} fill={C.skin} pass={pass} />
        {pass === "fill" ? (
          <Seam d="M-11 12 Q0 19 11 12" color={C.skinShade} width={4} />
        ) : null}
      </g>
    </g>
  </g>
);

const SLEEVE_LEN = 100;

// Lengan kaos oversized: lebar, bahu landai menyatu dengan badan.
const Sleeve: React.FC<{
  readonly side: -1 | 1;
  readonly arm: ArmPose;
  readonly pass: Pass;
}> = ({ side, arm, pass }) => (
  <g data-part="sleeve" transform={armTransform(side, arm)}>
    <Shape
      d={`M-40 ${SLEEVE_LEN} L-36 0 C-36 -30 36 -30 36 0 L40 ${SLEEVE_LEN} Q0 ${SLEEVE_LEN + 8} -40 ${SLEEVE_LEN} Z`}
      fill={C.shirt}
      pass={pass}
    />
  </g>
);

// ---------- Badan ----------

// Kaos oversized: garis bahu dari kerah menyambung ke puncak kubah lengan baju (kubah itulah
// bahunya), badan menyempit di ketiak lalu melebar ke ujung bawah yang menutup pinggang celana.
const TORSO_D =
  "M-48 446 Q0 484 48 446 C72 446 90 449 100 453 L104 480 C102 510 98 528 96 548 C96 620 102 700 110 762 Q0 776 -110 762 C-102 700 -96 620 -96 548 C-98 528 -102 510 -104 480 L-100 453 C-90 449 -72 446 -48 446 Z";

const Shirt: React.FC<{ readonly pose: GanjarPose }> = ({ pose }) => {
  const breathe = `translate(0 ${P.waist.y}) scale(${1 + pose.torso.breathe * 0.5} ${1 + pose.torso.breathe}) translate(0 ${-P.waist.y})`;
  const sleeves = (pass: Pass) => (
    <>
      <Sleeve side={-1} arm={pose.armL} pass={pass} />
      <Sleeve side={1} arm={pose.armR} pass={pass} />
    </>
  );
  return (
    <g data-part="shirt">
      <g transform={breathe}>
        <Shape d={TORSO_D} fill={C.shirt} pass="line" />
      </g>
      {sleeves("line")}
      <g transform={breathe}>
        <Shape d={TORSO_D} fill={C.shirt} pass="fill" />
      </g>
      {sleeves("fill")}
    </g>
  );
};

const Neck: React.FC = () => {
  const d = "M-26 380 L26 380 L28 470 L-28 470 Z";
  return (
    <g data-part="neck">
      <Shape d={d} fill={C.skin} pass="line" />
      <Shape d={d} fill={C.skin} pass="fill" />
      <Seam d="M-26 404 Q0 420 26 404" color={C.skinShade} width={8} />
    </g>
  );
};

// ---------- Kaki ----------

// Saat duduk paha tampak memendek (foreshortening) sebesar SIT_SHRINK.
const SIT_SHRINK = 0.78;

const THIGH = P.kneeY - P.hipY;
const SHIN = P.ankleY - P.kneeY;
// Sol sepatu menyentuh lantai.
const SOLE = FLOOR_Y - P.ankleY;

const PANTS_WAIST_D = "M-92 718 L92 718 L100 790 L0 806 L-100 790 Z";

// Sneaker low-top tampak depan: ujung bulat dan sol tebal, bagian atasnya tertutup ujung celana.
const Shoe: React.FC<{ readonly pass: Pass }> = ({ pass }) => (
  <g data-part="shoe">
    <Shape
      d={`M-50 ${SOLE - 10} C-60 18 -40 -8 0 -10 C40 -8 60 18 50 ${SOLE - 10} Z`}
      fill={C.shoe}
      pass={pass}
    />
    <Shape
      d={`M-52 ${SOLE - 18} H52 Q58 ${SOLE - 18} 58 ${SOLE - 9} Q58 ${SOLE} 50 ${SOLE} H-50 Q-58 ${SOLE} -58 ${SOLE - 9} Q-58 ${SOLE - 18} -52 ${SOLE - 18} Z`}
      fill={C.white}
      pass={pass}
    />
    {pass === "fill" ? (
      <>
        <path d={ellipse(0, SOLE - 23, 34, 10)} fill={C.white} />
        <Seam d={`M-52 ${SOLE - 18} H52`} />
      </>
    ) : null}
  </g>
);

const HEM = SHIN - 6;

// Saku kargo berpenutup di sisi luar paha, sedikit menonjol dari siluet kaki (koordinat sisi kanan).
const CargoPocket: React.FC<{ readonly side: -1 | 1 }> = ({ side }) => (
  <g data-part="cargo-pocket" transform={`translate(0 118) scale(${side} 1)`}>
    <path
      d="M22 4 H56 Q60 4 60 8 V88 Q60 94 54 94 H28 Q22 94 22 88 Z"
      fill={C.pants}
      stroke={C.outline}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
    <path
      d="M19 -2 H61 V22 Q40 28 19 22 Z"
      fill={C.pants}
      stroke={C.outline}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
  </g>
);

// Celana kargo longgar: kaki lurus melebar ke bawah, ujungnya menumpuk di atas sepatu.
const Leg: React.FC<{
  readonly side: -1 | 1;
  readonly leg: LegPose;
  readonly sit: number;
  readonly pass: Pass;
}> = ({ side, leg, sit, pass }) => {
  const k = 1 - SIT_SHRINK * sit;
  return (
    <g
      data-part={side === -1 ? "leg-left" : "leg-right"}
      transform={`translate(${side * P.hipX} ${P.hipY - leg.lift}) rotate(${-side * leg.hip})`}
    >
      <g transform={`translate(0 ${THIGH * k}) rotate(${side * leg.knee})`}>
        <g data-part="shin">
          <g transform={`translate(${side * 8} ${SHIN})`}>
            <Shoe pass={pass} />
          </g>
          <Shape d={ellipse(0, 0, 50, 30)} fill={C.pants} pass={pass} />
          <Shape
            d={`M-50 0 L50 0 C52 60 52 ${HEM - 50} 52 ${HEM} Q0 ${HEM + 8} -52 ${HEM} C-52 ${HEM - 50} -52 60 -50 0 Z`}
            fill={C.pants}
            pass={pass}
          />
        </g>
      </g>
      <g data-part="thigh" transform={`scale(1 ${k})`}>
        <Shape
          d={`M-38 -30 L38 -30 L50 ${THIGH} L-50 ${THIGH} Z`}
          fill={C.pants}
          pass={pass}
        />
        {pass === "fill" ? <CargoPocket side={side} /> : null}
      </g>
    </g>
  );
};

const LowerBody: React.FC<{ readonly pose: GanjarPose }> = ({ pose }) => (
  <g data-part="legs">
    {(["line", "fill"] as const).map((pass) => (
      <g key={pass}>
        <Leg side={-1} leg={pose.legL} sit={pose.sit} pass={pass} />
        <Leg side={1} leg={pose.legR} sit={pose.sit} pass={pass} />
        <Shape d={PANTS_WAIST_D} fill={C.pants} pass={pass} />
      </g>
    ))}
  </g>
);

export type GanjarRigProps = {
  readonly pose: GanjarPose;
  readonly face: FaceState;
};

export const GanjarRig: React.FC<GanjarRigProps> = ({ pose, face }) => {
  const { root, torso, head } = pose;
  const lifted = Math.max(0, -(root.y + pose.hipY));
  const shadow = 1 - Math.min(0.3, lifted / 200);
  return (
    <g data-part="ganjar" transform={`translate(${root.x} ${root.y})`}>
      <ellipse
        cx={0}
        cy={FLOOR_Y + 4}
        rx={170 * shadow}
        ry={14 * shadow}
        fill="#000"
        opacity={0.1}
      />
      <g
        data-part="lower-body"
        transform={`translate(0 ${pose.hipY + pose.sit * SIT_SHRINK * THIGH})`}
      >
        <LowerBody pose={pose} />
        <g
          data-part="upper-body"
          transform={`rotate(${torso.rot} ${P.waist.x} ${P.waist.y})`}
        >
          {(["line", "fill"] as const).map((pass) => (
            <g key={pass}>
              <Arm side={-1} arm={pose.armL} pass={pass} />
              <Arm side={1} arm={pose.armR} pass={pass} />
            </g>
          ))}
          <Neck />
          <Shirt pose={pose} />
          <g
            data-part="head-group"
            transform={`translate(0 ${head.y}) rotate(${head.rot} ${P.neck.x} ${P.neck.y}) translate(${P.neck.x} ${P.neck.y}) scale(${HEAD_SCALE}) translate(${-P.neck.x} ${-P.neck.y})`}
          >
            <Head face={face} turn={head.turn} />
          </g>
        </g>
      </g>
    </g>
  );
};
