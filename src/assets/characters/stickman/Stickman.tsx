import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GESTURES, gestureArms, type ArmPose, type Gesture } from "./gestures";

export { GESTURES, type ArmPose, type Gesture };

// Stickman gaya gambar tangan (lihat design-references/stickman/hand-drawn-stick-man.jpg):
// tampak depan, kepala oval besar, badan seperti buah pir, garis tipis,
// tangan berujung loop dan kaki berujung oval. Headphone, hoodie, dan celana pendek abu jadi ciri khas supaya tidak
// sekadar meniru referensi. Semua gerak dari frame.

export type StickmanExpression =
  | "senyum"
  | "senyumSantai"
  | "senang"
  | "tertawa"
  | "kaget"
  | "netral"
  | "serius"
  | "bingung"
  | "mikir"
  | "malu"
  | "sedih"
  | "kesal"
  | "marah"
  | "mataTertutup";

export const STICKMAN_EXPRESSIONS: readonly StickmanExpression[] = [
  "senyum",
  "senyumSantai",
  "senang",
  "tertawa",
  "kaget",
  "netral",
  "serius",
  "bingung",
  "mikir",
  "malu",
  "sedih",
  "kesal",
  "marah",
  "mataTertutup",
];

export const VIEWBOX = { w: 400, h: 410 } as const;

const HEAD = { x: 200, y: 112, rx: 74, ry: 62 } as const;
export const NECK = { x: 200, y: 168 } as const;
export const HIP_Y = 284;
export const SHOULDER = { dx: 24, y: 182 } as const;
export const BONE = { upperArm: 46, foreArm: 44, leg: 80 } as const;
export const HAND = { rx: 7, ry: 12 } as const;

const DARK = "#19191d";

// Headphone: pita melengkung di atas kepala dan dua cup di sisi telinga.
// Rambut sederhana: tiga helai garis hitam melengkung di atas kepala.
const HAIR = "M176 53 Q172 38 180 26 M190 50 Q188 34 202 24 M204 49 Q206 36 222 30";
const BAND = "M127 108 C120 10 280 10 273 108";
const CUP = { dx: 77, y: 116, rx: 14, ry: 25 } as const;
const ACCENT = "#1d78f0";

export type Pt = { readonly x: number; readonly y: number };

// Sudut dari arah lurus ke bawah; positif = menjauh dari badan. `side` -1 kiri layar, 1 kanan layar.
export const reach = (from: Pt, len: number, deg: number, side: 1 | -1): Pt => {
  const a = (deg * Math.PI) / 180;
  return { x: from.x + side * len * Math.sin(a), y: from.y + len * Math.cos(a) };
};

export type LegPose = { readonly out: number; readonly lift: number };

type Pose = {
  readonly bobY: number;
  readonly sway: number;
  readonly headTilt: number;
  // indeks 0 = kiri layar, 1 = kanan layar
  readonly arms: readonly [ArmPose, ArmPose];
  readonly legs: readonly [LegPose, LegPose];
};

export const poseAt = (t: number, walk: boolean, wave: boolean, gesture?: Gesture, robot = false): Pose => {
  const idle = Math.sin(t * 1.6);
  const p = t * Math.PI * 2 * 1.2;
  const step = (phase: number): LegPose => {
    const up = Math.max(0, Math.sin(phase));
    return { out: 3 + 20 * up, lift: 11 * up };
  };
  const rest = (): ArmPose => ({ shoulder: 24 + idle * 2, elbow: -8 });
  const swing = (phase: number): ArmPose => ({ shoulder: 26 + 14 * Math.sin(phase), elbow: -8 });
  // `wave` = singkatan gesture "lambai"; `gesture` menang kalau keduanya diisi.
  const g = gesture ?? (wave ? "lambai" : "netral");
  const base: readonly [ArmPose, ArmPose] = walk ? [swing(p + Math.PI), swing(p)] : [rest(), rest()];
  const over = gestureArms(g, t, robot);
  return {
    bobY: walk ? -Math.abs(Math.sin(p)) * 5 : idle * 1.5,
    sway: walk ? Math.sin(p) * 2.5 : idle * 0.6,
    headTilt: Math.sin(t * 0.9) * (walk ? 2 : 3.5),
    arms: [over[0] ?? base[0], over[1] ?? base[1]],
    legs: walk ? [step(p), step(p + Math.PI)] : [{ out: 3, lift: 0 }, { out: 3, lift: 0 }],
  };
};

// Lebar mulut saat bicara per ekspresi (unit viewBox).
const TALK_WIDTH: Partial<Record<StickmanExpression, number>> = { kaget: 6, marah: 9, kesal: 9, serius: 9, senang: 14, tertawa: 15, malu: 7 };

// Bukaan mulut bicara 0..1 dari frame: dua gelombang supaya tidak terasa seperti metronom.
export const talkAmount = (t: number): number => Math.min(1, 0.12 + Math.abs(Math.sin(t * 11) * 0.7 + Math.sin(t * 7.3) * 0.3));

const Face: React.FC<{ readonly e: StickmanExpression; readonly ink: string; readonly w: number; readonly talk?: number }> = ({ e, ink, w, talk }) => {
  const { x, y } = HEAD;
  const mouthY = y + 30;
  const line = (d: string) => <path d={d} fill="none" stroke={ink} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
  const eye = (dx: number, rx = 4, ry = 6.5, ox = 0, oy = 0) => <ellipse key={dx} cx={x + dx + ox} cy={y + 6 + oy} rx={rx} ry={ry} fill={ink} />;
  const eyes = (rx = 4, ry = 6.5, ox = 0, oy = 0) => (
    <>
      {eye(-27, rx, ry, ox, oy)}
      {eye(27, rx, ry, ox, oy)}
    </>
  );
  // Mata melengkung ke atas (senang) atau ke bawah (tertutup).
  const arcEyes = (up: boolean) => (
    <>
      {line(`M${x - 35} ${y + 10} Q${x - 27} ${y + (up ? -2 : 18)} ${x - 19} ${y + 10}`)}
      {line(`M${x + 19} ${y + 10} Q${x + 27} ${y + (up ? -2 : 18)} ${x + 35} ${y + 10}`)}
    </>
  );
  const blush = (
    <>
      <ellipse cx={x - 46} cy={y + 24} rx={11} ry={6} fill="#f4a3a3" opacity={0.75} />
      <ellipse cx={x + 46} cy={y + 24} rx={11} ry={6} fill="#f4a3a3" opacity={0.75} />
    </>
  );
  // Mulut terbuka lebar (senang, tertawa): setengah lingkaran isi dengan lidah.
  const openMouth = (wide: number, deep: number) => (
    <>
      <path d={`M${x - wide} ${mouthY - 5} L${x + wide} ${mouthY - 5} Q${x + wide - 2} ${mouthY + deep} ${x} ${mouthY + deep} Q${x - wide + 2} ${mouthY + deep} ${x - wide} ${mouthY - 5} Z`} fill={ink} stroke={ink} strokeWidth={w * 0.5} strokeLinejoin="round" />
      <ellipse cx={x} cy={mouthY + deep - 4} rx={wide * 0.45} ry={4} fill="#e8707a" />
    </>
  );
  // Saat bicara, mulut apa pun diganti elips yang membuka dan menutup.
  const talking = (): React.ReactNode => {
    const o = talk ?? 0;
    const rx = TALK_WIDTH[e] ?? 11;
    const ry = 2.5 + 9 * o;
    return <ellipse cx={x} cy={mouthY + ry * 0.3} rx={rx} ry={ry} fill={ink} />;
  };
  const mouth = (shape: React.ReactNode): React.ReactNode => (talk === undefined ? shape : talking());
  const smile = line(`M${x - 13} ${mouthY - 3} Q${x} ${mouthY + 9} ${x + 13} ${mouthY - 3}`);
  const flat = line(`M${x - 11} ${mouthY} L${x + 11} ${mouthY}`);

  switch (e) {
    case "senyumSantai":
      return (
        <>
          {eyes(4, 3.5, 0, 2)}
          {line(`M${x - 35} ${y + 1} L${x - 19} ${y + 1}`)}
          {line(`M${x + 19} ${y + 1} L${x + 35} ${y + 1}`)}
          {mouth(line(`M${x - 15} ${mouthY - 2} Q${x} ${mouthY + 7} ${x + 15} ${mouthY - 2}`))}
        </>
      );
    case "senang":
      return (
        <>
          {arcEyes(true)}
          {mouth(openMouth(17, 16))}
        </>
      );
    case "tertawa":
      return (
        <>
          {line(`M${x - 37} ${y - 1} L${x - 20} ${y + 7} L${x - 37} ${y + 15}`)}
          {line(`M${x + 37} ${y - 1} L${x + 20} ${y + 7} L${x + 37} ${y + 15}`)}
          {mouth(openMouth(22, 24))}
        </>
      );
    case "kaget":
      return (
        <>
          {eyes()}
          {mouth(<ellipse cx={x} cy={mouthY + 2} rx={4.5} ry={7} fill={ink} />)}
        </>
      );
    case "netral":
      return (
        <>
          {eyes()}
          {mouth(flat)}
        </>
      );
    case "serius":
      return (
        <>
          {eyes(4, 5.5)}
          {line(`M${x - 38} ${y - 12} L${x - 16} ${y - 12}`)}
          {line(`M${x + 16} ${y - 12} L${x + 38} ${y - 12}`)}
          {mouth(flat)}
        </>
      );
    case "bingung":
      return (
        <>
          {eye(-27, 4, 6.5)}
          {eye(27, 3.2, 4.5, 0, 1)}
          {line(`M${x - 38} ${y - 17} L${x - 18} ${y - 25}`)}
          {line(`M${x + 18} ${y - 12} L${x + 38} ${y - 15}`)}
          {mouth(line(`M${x - 14} ${mouthY + 2} Q${x - 7} ${mouthY - 5} ${x} ${mouthY + 2} T${x + 14} ${mouthY + 2}`))}
        </>
      );
    case "mikir":
      return (
        <>
          {eyes(4, 6.5, 7, -5)}
          {line(`M${x + 16} ${y - 17} L${x + 38} ${y - 25}`)}
          {mouth(line(`M${x - 4} ${mouthY + 3} L${x + 14} ${mouthY - 2}`))}
        </>
      );
    case "malu":
      return (
        <>
          {eyes(3.5, 5, 0, 5)}
          {blush}
          {mouth(line(`M${x - 8} ${mouthY + 2} Q${x - 3} ${mouthY - 3} ${x} ${mouthY + 2} T${x + 8} ${mouthY + 2}`))}
        </>
      );
    case "sedih":
      return (
        <>
          {eyes()}
          {mouth(line(`M${x - 13} ${mouthY + 5} Q${x} ${mouthY - 7} ${x + 13} ${mouthY + 5}`))}
          {line(`M${x - 36} ${y - 14} L${x - 20} ${y - 20}`)}
          {line(`M${x + 20} ${y - 20} L${x + 36} ${y - 14}`)}
        </>
      );
    case "kesal":
      return (
        <>
          {eyes(4, 4.5, 0, 2)}
          {line(`M${x - 36} ${y - 16} L${x - 18} ${y - 8}`)}
          {line(`M${x + 18} ${y - 8} L${x + 36} ${y - 16}`)}
          {mouth(line(`M${x - 12} ${mouthY + 5} Q${x} ${mouthY - 5} ${x + 12} ${mouthY + 5}`))}
        </>
      );
    case "marah":
      return (
        <>
          {eyes()}
          {line(`M${x - 38} ${y - 22} L${x - 18} ${y - 12}`)}
          {line(`M${x + 18} ${y - 12} L${x + 38} ${y - 22}`)}
          {mouth(line(`M${x - 11} ${mouthY + 2} L${x + 11} ${mouthY + 2}`))}
        </>
      );
    case "mataTertutup":
      return (
        <>
          {arcEyes(false)}
          {mouth(smile)}
        </>
      );
    default:
      return (
        <>
          {eyes()}
          {mouth(smile)}
        </>
      );
  }
};

export type StickmanProps = {
  // Tinggi kotak karakter dalam px.
  readonly height?: number;
  readonly expression?: StickmanExpression;
  readonly walk?: boolean;
  readonly wave?: boolean;
  // Gerak tangan; menimpa `wave`. Lihat gestures.ts.
  readonly gesture?: Gesture;
  // Mulut membuka dan menutup (bicara), menimpa bentuk mulut ekspresi.
  readonly talking?: boolean;
  // Pakai headphone atau tidak.
  readonly headphones?: boolean;
  // Hoodie dan celana pendek. `false` = stickman polos, hanya garis.
  readonly outfit?: boolean;
  // Rambut: tiga helai garis hitam di atas kepala.
  readonly hair?: boolean;
  readonly color?: string;
  // Tebal garis dalam unit viewBox (400 lebar).
  readonly strokeWidth?: number;
  readonly style?: React.CSSProperties;
};

export const stickmanSize = (height: number): { width: number; height: number } => ({
  width: (height * VIEWBOX.w) / VIEWBOX.h,
  height,
});

// Badan buah pir: sempit di bahu, melebar ke pinggul, dasar membulat.
const HOODIE = "#2a2c3f";
const SHORTS = { fill: "#a9adb9", top: 34, bottom: 37, len: 0.42 } as const;
const TRIM = "#8f94b3";
const SLEEVE_W = 13;
const POCKET = "M171 232 L229 232 L238 266 Q200 276 162 266 Z";
export const TORSO =
  "M174 158 C169 195 153 235 159 262 C163 280 180 284 200 284 C220 284 237 280 241 262 C247 235 231 195 226 158";

export const Stickman: React.FC<StickmanProps> = ({
  height = 640,
  expression = "senyum",
  walk = false,
  wave = false,
  gesture,
  talking = false,
  headphones = true,
  outfit = true,
  hair = false,
  color = "#232540",
  strokeWidth = 5,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = poseAt(frame / fps, walk, wave, gesture);
  const stroke = { fill: "#fff", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const open = { ...stroke, fill: "none" } as const;

  const arm = (side: 1 | -1, a: ArmPose, front: boolean): React.ReactNode => {
    if (Boolean(a.front) !== front) return null;
    const from = { x: 200 + side * SHOULDER.dx, y: SHOULDER.y };
    const elbow = reach(from, BONE.upperArm, a.shoulder, side);
    const dir = a.shoulder + a.elbow;
    const hand = reach(elbow, BONE.foreArm, dir, side);
    const rad = (dir * Math.PI) / 180;
    const c = { x: hand.x + side * Math.sin(rad) * HAND.ry, y: hand.y + Math.cos(rad) * HAND.ry };
    return (
      <g key={side}>
        {/* tangan digambar lebih dulu: masuk ke lengan hoodie, hanya separuh bawah telapak yang tampak */}
        {outfit && <ellipse cx={c.x} cy={c.y} rx={HAND.rx} ry={HAND.ry} transform={`rotate(${-side * dir} ${c.x} ${c.y})`} {...stroke} />}
        <path d={`M${from.x} ${from.y} Q${elbow.x} ${elbow.y} ${hand.x} ${hand.y}`} {...open} strokeWidth={outfit ? SLEEVE_W + strokeWidth * 2 : strokeWidth} />
        {outfit && <path d={`M${from.x} ${from.y} Q${elbow.x} ${elbow.y} ${hand.x} ${hand.y}`} fill="none" stroke={HOODIE} strokeWidth={SLEEVE_W} strokeLinecap="round" />}
        {/* polos: loop tangan utuh di ujung garis lengan */}
        {!outfit && <ellipse cx={c.x} cy={c.y} rx={HAND.rx} ry={HAND.ry} transform={`rotate(${-side * dir} ${c.x} ${c.y})`} {...stroke} />}
      </g>
    );
  };

  const shorts = (hip: Pt, foot: Pt): string => {
    const dx = foot.x - hip.x;
    const dy = foot.y - hip.y;
    const n = Math.hypot(dx, dy);
    const d = { x: dx / n, y: dy / n };
    const p = { x: -d.y, y: d.x };
    // mulai sedikit di atas pinggul supaya tidak ada celah di bawah badan
    const a = { x: hip.x - d.x * 5, y: hip.y - d.y * 5 };
    const b = { x: hip.x + d.x * n * SHORTS.len, y: hip.y + d.y * n * SHORTS.len };
    const c = (o: Pt, w: number, k: 1 | -1): string => `${(o.x + p.x * (w / 2) * k).toFixed(1)} ${(o.y + p.y * (w / 2) * k).toFixed(1)}`;
    return `M${c(a, SHORTS.top, -1)} L${c(a, SHORTS.top, 1)} L${c(b, SHORTS.bottom, 1)} L${c(b, SHORTS.bottom, -1)} Z`;
  };

  const leg = (side: 1 | -1, l: LegPose): React.ReactNode => {
    const hip = { x: 200 + side * 19, y: HIP_Y + 1 };
    const len = BONE.leg - l.lift;
    const knee = reach(hip, len * 0.5, l.out * 0.4, side);
    const foot = reach(hip, len, l.out, side);
    return (
      <g key={side}>
        <path d={`M${hip.x} ${hip.y} Q${knee.x} ${knee.y} ${foot.x} ${foot.y}`} {...open} />
        {/* celana pendek kotak: trapesium dengan ujung rata tegak lurus kaki */}
        {outfit && <path d={shorts(hip, foot)} {...stroke} fill={SHORTS.fill} strokeLinejoin="miter" />}
        <ellipse cx={foot.x + side * 11} cy={foot.y + 1} rx={17} ry={6.5} transform={`rotate(${side * -6} ${foot.x} ${foot.y})`} {...stroke} />
      </g>
    );
  };

  return (
    <svg
      width={stickmanSize(height).width}
      height={height}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <g transform={`translate(0 ${pose.bobY})`}>
        {leg(-1, pose.legs[0])}
        {leg(1, pose.legs[1])}
        <g transform={`rotate(${pose.sway} 200 ${HIP_Y})`}>
          {/* lengan di belakang badan: pangkalnya tertutup isi putih badan */}
          {arm(-1, pose.arms[0], false)}
          {arm(1, pose.arms[1], false)}
          <path d={TORSO} {...stroke} fill={outfit ? HOODIE : "#fff"} />
          {outfit && (
            <>
              {/* kantong kanguru dan tali hoodie */}
              <path d={POCKET} fill="none" stroke={TRIM} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M189 180 L187 208 M211 180 L213 208" fill="none" stroke={TRIM} strokeWidth={3.5} strokeLinecap="round" />
              {/* tudung menumpuk di leher, sebagian tertutup kepala */}
              <ellipse cx={NECK.x} cy={NECK.y + 4} rx={52} ry={17} {...stroke} fill={HOODIE} />
            </>
          )}
          <g transform={`rotate(${pose.headTilt} ${NECK.x} ${NECK.y})`}>
            <ellipse cx={HEAD.x} cy={HEAD.y} rx={HEAD.rx} ry={HEAD.ry} {...stroke} />
            <Face e={expression} ink={color} w={strokeWidth * 0.8} talk={talking ? talkAmount(frame / fps) : undefined} />
            {headphones && (
              <>
                <path d={BAND} fill="none" stroke={DARK} strokeWidth={9} strokeLinecap="round" />
                {([-1, 1] as const).map((side) => (
                  <g key={side}>
                    <ellipse cx={HEAD.x + side * CUP.dx} cy={CUP.y} rx={CUP.rx} ry={CUP.ry} fill={DARK} stroke={color} strokeWidth={strokeWidth * 0.6} />
                    <ellipse cx={HEAD.x + side * (CUP.dx + side * 3)} cy={CUP.y} rx={6} ry={14} fill={ACCENT} />
                  </g>
                ))}
              </>
            )}
            {/* rambut di atas pita headphone supaya helainya tidak terpotong */}
            {hair && <path d={HAIR} fill="none" stroke={DARK} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />}
          </g>
          {/* lengan yang melintas di depan kepala atau badan (facepalm, mikir, tepuk, ...) */}
          {arm(-1, pose.arms[0], true)}
          {arm(1, pose.arms[1], true)}
        </g>
      </g>
    </svg>
  );
};
