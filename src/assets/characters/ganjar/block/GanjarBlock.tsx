import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Cube, flip, Joint, stroke, type Faces, type Paint } from "../../shared/blockKit";

// Ganjar versi balok: kubus CSS 3D asli, tiap sisi digambar vektor halus (bukan piksel)
// dengan warna dan wajah yang sama seperti rig SVG Ganjar. Satuan model: U; 1 U = 10 unit viewBox sisi.
// Proporsi: kepala 10x9x9, badan 9x10x5, lengan 3.6x10x3.6, kaki 4.6x11x4.6, rambut berupa kubus tersendiri.

export type GanjarBlockExpression = "senyum" | "kaget" | "mataTertutup";

export const GANJAR_BLOCK_EXPRESSIONS: readonly GanjarBlockExpression[] = ["senyum", "kaget", "mataTertutup"];

const C = {
  skin: "#f2b98c",
  skinShade: "#dc9a6c",
  blush: "#ee8a78",
  hair: "#19191d",
  hairLight: "#34343e",
  eye: "#0b0b0e",
  mouth: "#7a3b2a",
  shirt: "#1d1d22",
  shirtLight: "#2d2d35",
  pants: "#2f5aa6",
  pantsLight: "#4a78c9",
  shoe: "#111115",
  sole: "#f1ece2",
} as const;

// ---------- Sisi vektor ----------

// Kepala: wajah di depan; rambut ada di kubus tersendiri.
const eyes = (e: GanjarBlockExpression): React.ReactNode => {
  const xs = [30, 70];
  if (e === "mataTertutup") return xs.map((x) => <g key={x}>{stroke(`M${x - 8} 52 Q${x} 61 ${x + 8} 52`, C.eye, 3.4)}</g>);
  const [rx, ry] = e === "kaget" ? [8.5, 12] : [6.8, 9.5];
  return xs.map((x) => (
    <g key={x}>
      <ellipse cx={x} cy={52} rx={rx} ry={ry} fill={C.eye} />
      <circle cx={x + 2.2} cy={52 - ry * 0.42} r={2.3} fill="#fff" opacity={0.9} />
    </g>
  ));
};

const mouth = (e: GanjarBlockExpression): React.ReactNode => {
  if (e === "kaget") return <ellipse cx={50} cy={73} rx={5.5} ry={7} fill={C.mouth} />;
  return stroke("M41 69 Q50 77 59 69", C.mouth, 3);
};

const headFront =
  (e: GanjarBlockExpression): Paint =>
  (w, h) => (
    <>
      <rect width={w} height={h} fill={C.skin} />
      <rect y={h - 18} width={w} height={18} fill={C.skinShade} opacity={0.22} />
      <ellipse cx={19} cy={66} rx={7} ry={4} fill={C.blush} opacity={0.38} />
      <ellipse cx={81} cy={66} rx={7} ry={4} fill={C.blush} opacity={0.38} />
      {eyes(e)}
      {mouth(e)}
    </>
  );

const headSide: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.skin} />
    <ellipse cx={w * 0.5} cy={56} rx={7} ry={10} fill={C.skinShade} />
    <ellipse cx={w * 0.5} cy={56} rx={3.6} ry={6.4} fill={C.skin} opacity={0.55} />
  </>
);

const skinFlat: Paint = (w, h) => <rect width={w} height={h} fill={C.skin} />;

// Kubus rambut (10.6 x 5 x 9.6): poni di depan, sisi belakang turun lebih panjang, bawahnya transparan.
const hairFront: Paint = (w) => (
  <path
    d={`M0 0 H${w} V26 Q${w - 6} 38 ${w - 14} 30 Q${w - 20} 24 ${w - 28} 34 Q${w - 36} 42 ${w - 44} 30 Q${w - 52} 22 ${w - 62} 34 Q${w - 72} 42 ${w - 82} 30 Q${w - 92} 24 ${w - 100} 34 Q${w - 104} 36 0 26 Z`}
    fill={C.hair}
  />
);

const hairSide: Paint = (w, h) => (
  <>
    <path d={`M0 0 H${w} V28 Q${w - 10} 36 ${w - 20} 30 L${w - 28} 40 L${w - 40} ${h} H0 Z`} fill={C.hair} />
    {stroke(`M${w * 0.18} 8 Q${w * 0.3} 26 ${w * 0.22} 44`, C.hairLight, 3, 0.6)}
  </>
);

const hairBack: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.hair} />
    {stroke(`M${w * 0.25} 6 Q${w * 0.3} 26 ${w * 0.22} 42`, C.hairLight, 3, 0.55)}
    {stroke(`M${w * 0.6} 6 Q${w * 0.66} 24 ${w * 0.58} 40`, C.hairLight, 3, 0.55)}
  </>
);

const hairTop: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.hair} />
    {stroke(`M${w * 0.2} ${h * 0.2} Q${w * 0.5} ${h * 0.05} ${w * 0.8} ${h * 0.25}`, C.hairLight, 3, 0.6)}
    {stroke(`M${w * 0.25} ${h * 0.6} Q${w * 0.5} ${h * 0.45} ${w * 0.75} ${h * 0.65}`, C.hairLight, 3, 0.5)}
  </>
);

const tuftFlat: Paint = (w, h) => <rect width={w} height={h} fill={C.hair} />;

// Badan: kaos hitam, kerah bulat dan lipatan halus.
const shirtBase: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.shirt} />
    <rect y={h - 8} width={w} height={8} fill={C.shirtLight} opacity={0.7} />
  </>
);

const torsoFront: Paint = (w, h) => (
  <>
    {shirtBase(w, h)}
    <path d={`M${w * 0.34} 0 Q${w * 0.5} 20 ${w * 0.66} 0 Z`} fill={C.skin} />
    {stroke(`M${w * 0.34} 0 Q${w * 0.5} 20 ${w * 0.66} 0`, C.shirtLight, 4)}
    {stroke(`M${w * 0.22} ${h * 0.45} Q${w * 0.3} ${h * 0.58} ${w * 0.24} ${h * 0.72}`, C.shirtLight, 3, 0.6)}
    {stroke(`M${w * 0.76} ${h * 0.4} Q${w * 0.68} ${h * 0.55} ${w * 0.74} ${h * 0.7}`, C.shirtLight, 3, 0.6)}
  </>
);

const torsoBack: Paint = (w, h) => (
  <>
    {shirtBase(w, h)}
    {stroke(`M${w * 0.3} 0 Q${w * 0.5} 10 ${w * 0.7} 0`, C.shirtLight, 4)}
    {stroke(`M${w * 0.4} ${h * 0.4} Q${w * 0.5} ${h * 0.55} ${w * 0.6} ${h * 0.4}`, C.shirtLight, 3, 0.5)}
  </>
);

const pantsTop: Paint = (w, h) => <rect width={w} height={h} fill={C.pants} />;

// Lengan: lengan kaos pendek (40%) lalu kulit.
const armSide: Paint = (w, h) => (
  <>
    <rect width={w} height={h} fill={C.skin} />
    <rect x={w * 0.62} width={w * 0.38} height={h} fill={C.skinShade} opacity={0.22} />
    <rect width={w} height={h * 0.4} fill={C.shirt} />
    <rect y={h * 0.4 - 6} width={w} height={6} fill={C.shirtLight} />
  </>
);

const shirtTopFlat: Paint = (w, h) => <rect width={w} height={h} fill={C.shirt} />;
const skinBottom: Paint = skinFlat;

// Kaki: celana cargo lalu sneaker hitam-putih.
const legBase = (w: number, h: number): React.ReactNode => (
  <>
    <rect width={w} height={h} fill={C.pants} />
    <rect y={h * 0.73} width={w} height={h * 0.2} fill={C.shoe} />
    <rect y={h * 0.93} width={w} height={h * 0.07} fill={C.sole} />
    <rect y={h * 0.7} width={w} height={4} fill={C.pantsLight} />
  </>
);

const legFront: Paint = (w, h) => (
  <>
    {legBase(w, h)}
    {stroke(`M${w * 0.5} 4 L${w * 0.5} ${h * 0.55}`, C.pantsLight, 3, 0.8)}
    {[0.78, 0.84].map((k) => (
      <g key={k}>{stroke(`M${w * 0.34} ${h * k} L${w * 0.66} ${h * k}`, C.sole, 2.6, 0.85)}</g>
    ))}
  </>
);

const legSide: Paint = (w, h) => (
  <>
    {legBase(w, h)}
    <rect x={w * 0.16} y={h * 0.25} width={w * 0.68} height={h * 0.3} rx={3} fill={C.pantsLight} />
    {stroke(`M${w * 0.16} ${h * 0.34} L${w * 0.84} ${h * 0.34}`, C.pants, 2.6)}
    <circle cx={w * 0.5} cy={h * 0.4} r={2.2} fill={C.sole} opacity={0.8} />
  </>
);

const soleBottom: Paint = (w, h) => <rect width={w} height={h} fill={C.sole} />;

// ---------- Karakter ----------

const headFaces = (e: GanjarBlockExpression): Faces => ({
  front: headFront(e),
  back: skinFlat,
  left: headSide,
  right: flip(headSide),
  bottom: skinBottom,
});

const HAIR_FACES: Faces = {
  front: hairFront,
  back: hairBack,
  left: hairSide,
  right: flip(hairSide),
  top: hairTop,
};

const TORSO: Faces = { front: torsoFront, back: torsoBack, left: shirtBase, right: shirtBase, top: shirtTopFlat, bottom: pantsTop };
const ARM: Faces = { front: armSide, back: armSide, left: armSide, right: armSide, top: shirtTopFlat, bottom: skinBottom };
const LEG: Faces = { front: legFront, back: legBase, left: legSide, right: flip(legSide), top: pantsTop, bottom: soleBottom };
const TUFT: Faces = { front: tuftFlat, back: tuftFlat, left: tuftFlat, right: tuftFlat, top: hairTop };

const TUFTS = [
  { x: -2.2, z: 0.4, w: 3, h: 1.8, d: 3, rz: -14 },
  { x: 1.6, z: -0.8, w: 2.6, h: 2.2, d: 2.6, rz: 12 },
] as const;

export type GanjarBlockProps = {
  // Tinggi seluruh kotak karakter dalam px.
  readonly height?: number;
  readonly expression?: GanjarBlockExpression;
  // Sudut putar badan (derajat). 0 = menghadap kamera.
  readonly yaw?: number;
  // Putaran terus-menerus, derajat per detik.
  readonly spin?: number;
  readonly walk?: boolean;
  readonly wave?: boolean;
  readonly style?: React.CSSProperties;
};

export const ganjarBlockSize = (height: number): { width: number; height: number } => ({
  width: (height / 34) * 30,
  height,
});

export const GanjarBlock: React.FC<GanjarBlockProps> = ({
  height = 640,
  expression = "senyum",
  yaw = 24,
  spin = 0,
  walk = false,
  wave = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const u = height / 34;
  const { width } = ganjarBlockSize(height);

  const phase = t * Math.PI * 2 * 1.3;
  const stride = walk ? Math.sin(phase) : 0;
  const swing = stride * 34;
  const idle = walk ? 0 : Math.sin(t * 1.6);
  const bob = walk ? -Math.abs(Math.sin(phase)) * 0.3 * u : idle * 0.1 * u;
  const headTurn = Math.sin(t * 0.9) * (walk ? 6 : 12);
  const nod = Math.sin(t * 1.3 + 1) * 3;
  const flap = Math.sin(t * Math.PI * 2 * 2.2) * 14;

  const armPlus = wave ? `rotateX(0deg) rotateZ(-${150 + flap}deg)` : `rotateX(${-swing}deg) rotateZ(${4 + idle * 1.5}deg)`;
  const armMinus = `rotateX(${swing}deg) rotateZ(${-4 - idle * 1.5}deg)`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        perspective: u * 95,
        perspectiveOrigin: "50% 45%",
        ...style,
      }}
    >
      {/* bayangan di lantai */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - u * 8,
          top: u * 34 - u * 3,
          width: u * 16,
          height: u * 6,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.28), rgba(0,0,0,0))",
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width, height, transformStyle: "preserve-3d", transform: "rotateX(-9deg)" }}>
        <Joint transform={`translate(${width / 2}px, ${u * 22 + bob}px) rotateY(${yaw + spin * t}deg)`}>
          <Cube w={9} h={10} d={5} u={u} faces={TORSO} transform={`translateY(${-5 * u}px)`} />

          <Joint transform={`translateY(${-10 * u}px) rotateY(${headTurn}deg) rotateX(${nod}deg)`}>
            <Cube w={10} h={9} d={9} u={u} faces={headFaces(expression)} transform={`translateY(${-4.5 * u}px)`} />
            <Cube w={10.6} h={5} d={9.6} u={u} faces={HAIR_FACES} transform={`translateY(${-6.9 * u}px)`} />
            {TUFTS.map((p, i) => (
              <Cube
                key={i}
                w={p.w}
                h={p.h}
                d={p.d}
                u={u}
                faces={TUFT}
                transform={`translate3d(${p.x * u}px, ${-10 * u}px, ${p.z * u}px) rotateZ(${p.rz}deg)`}
              />
            ))}
          </Joint>

          <Joint transform={`translate(${6.4 * u}px, ${-9.4 * u}px) ${armPlus}`}>
            <Cube w={3.6} h={10} d={3.6} u={u} faces={ARM} transform={`translateY(${5 * u}px)`} />
          </Joint>
          <Joint transform={`translate(${-6.4 * u}px, ${-9.4 * u}px) ${armMinus}`}>
            <Cube w={3.6} h={10} d={3.6} u={u} faces={ARM} transform={`translateY(${5 * u}px)`} />
          </Joint>

          <Joint transform={`translate(${2.4 * u}px, 0) rotateX(${-swing}deg)`}>
            <Cube w={4.6} h={11} d={4.6} u={u} faces={LEG} transform={`translateY(${5.5 * u}px)`} />
          </Joint>
          <Joint transform={`translate(${-2.4 * u}px, 0) rotateX(${swing}deg)`}>
            <Cube w={4.6} h={11} d={4.6} u={u} faces={LEG} transform={`translateY(${5.5 * u}px)`} />
          </Joint>
        </Joint>
      </div>
    </div>
  );
};
