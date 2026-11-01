import { Easing } from "remotion";
import {
  armGesture,
  point,
  startle,
  surprise,
  type GanjarClip,
  type GanjarFaceKey,
  type Gesture,
  type LookKey,
  type RobotClip,
  type RobotFaceKey,
} from "../../assets/characters";
import { CTA_START, FPS, LINES, LINE_START, TOTAL_FRAMES } from "./config";

// Naskah di config.ts diterjemahkan jadi kunci wajah, arah pandang, dan clip rig Ganjar dan Claude Code.
// Nama gerak tetap `Gesture`; yang tidak tercantum di sini = lengan diam.

type GanjarMove = GanjarClip["clip"];
type RobotMove = RobotClip["clip"];

const RAMP = 10;
const ease = Easing.inOut(Easing.cubic);

// 0 -> 1 -> 0 sepanjang gerak.
const hold = (f: number, dur: number): number => ease(Math.max(0, Math.min(1, f / RAMP, (dur - f) / RAMP)));

const bothArms = (shoulder: number, elbow: number, dur: number, beat = 0): GanjarMove => (f) => {
  const e = hold(f, dur);
  const arm = { shoulder: shoulder * e, elbow: (elbow + Math.sin(f / 2.4) * beat) * e };
  return { armL: arm, armR: arm };
};

// Tangan kanan ke sisi kepala (kepala rig digambar di atas lengan, jadi tangan harus di luar siluetnya).
// `rock` = goyang lengan bawah (garuk kepala).
const handToHead = (shoulder: number, elbow: number, rock: number, dur: number): GanjarMove => (f) => {
  const e = hold(f, dur);
  return { armR: { shoulder: shoulder * e, elbow: (elbow + Math.sin(f / 1.6) * rock) * e }, head: { rot: -3 * e } };
};

// Dua tangan memegang kepala: pengganti facepalm, karena lengan rig tidak bisa melintas di depan wajah.
const handsOnHead = (dur: number): GanjarMove => (f) => {
  const e = hold(f, dur);
  const arm = { shoulder: 110 * e, elbow: 67 * e };
  return { armL: arm, armR: arm, head: { y: 10 * e } };
};

const shrug = (dur: number): GanjarMove => (f) => {
  const e = hold(f, dur);
  const arm = { shoulder: 30 * e, elbow: 65 * e };
  return { armL: arm, armR: arm, head: { y: 8 * e, rot: 4 * e } };
};

const wave = (dur: number): GanjarMove => (f) => {
  const e = hold(f, dur);
  return { armR: { shoulder: 118 * e, elbow: (32 + Math.sin(f / 3) * 16) * e } };
};

const ganjarMoves = (gesture: Gesture, dur: number): readonly GanjarMove[] => {
  switch (gesture) {
    case "tunjuk":
      return [point("R", dur, 78)];
    case "tepuk":
      return [bothArms(40, 62, dur, 9)];
    case "angkatBahu":
      return [shrug(dur)];
    case "menyerah":
      return [bothArms(64, 98, dur), startle(Math.min(dur, 27))];
    case "garukKepala":
      return [handToHead(110, 67, 7, dur)];
    case "mikir":
      return [handToHead(72, 100, 0, dur)];
    case "facepalm":
      return [handsOnHead(dur)];
    case "lambai":
      return [wave(dur)];
    default:
      return [];
  }
};

const robotShrug = (dur: number): RobotMove => (f) => {
  const e = hold(f, dur);
  return { armL: 46 * e, armR: 46 * e, body: { y: -5 * e } };
};

const robotProud = (dur: number): RobotMove => (f) => {
  const e = hold(f, dur);
  return { armL: 18 * e, armR: 18 * e, body: { rot: 2 * e } };
};

// Lengan rig Claude mendatar saat diam; di atas sekitar 90 derajat lengan masuk ke balik kotak.
const robotMoves = (gesture: Gesture, dur: number): readonly RobotMove[] => {
  switch (gesture) {
    case "angkatTangan":
      return [armGesture("L", dur, 60, 6)];
    case "angkatBahu":
      return [robotShrug(dur)];
    case "pinggang":
      return [robotProud(dur)];
    case "lambai":
      return [armGesture("L", dur, 62, 14)];
    default:
      return [];
  }
};

const place = <C>(moves: readonly C[], start: number, dur: number): readonly { clip: C; start: number; dur: number }[] =>
  moves.map((clip) => ({ clip, start, dur }));

const lineAt = (i: number): number => LINE_START[i] / FPS;
const lineFrames = (i: number): number => (i + 1 < LINES.length ? LINE_START[i + 1] : CTA_START) - LINE_START[i];
const CTA_AT = CTA_START / FPS;
const CTA_FRAMES = TOTAL_FRAMES - CTA_START;

// Lompat kaget Claude di "Hah?!"; panjangnya mengikuti kunci lengan di clip `surprise`.
const SURPRISE_LINE = 7;
const SURPRISE_FRAMES = 60;

export const GANJAR_FACE: readonly GanjarFaceKey[] = [
  { at: -1, expression: "netral" },
  ...LINES.map((l, i) => ({ at: lineAt(i), expression: l.ganjar })),
  { at: CTA_AT, expression: "senang" },
];

export const CLAUDE_FACE: readonly RobotFaceKey[] = [
  { at: -1, expression: "normal" },
  ...LINES.map((l, i) => ({ at: lineAt(i), expression: l.robot })),
  { at: CTA_AT, expression: "senang" },
];

// Saling tatap selama dialog (Claude di kanan layar), menghadap penonton saat CTA.
export const GANJAR_LOOK: readonly LookKey[] = [
  ...LINES.map((l, i) => ({ at: lineAt(i), turn: l.who === "ganjar" ? 0.3 : 0.6, tilt: l.who === "ganjar" ? 1.5 : -2 })),
  { at: CTA_AT, turn: 0 },
];

export const CLAUDE_LOOK: readonly LookKey[] = [
  ...LINES.map((l, i) => ({ at: lineAt(i), turn: l.who === "robot" ? -0.5 : -0.95 })),
  { at: CTA_AT, turn: 0 },
];

export const GANJAR_CLIPS: readonly GanjarClip[] = [
  ...LINES.flatMap((l, i) => place(ganjarMoves(l.handGanjar, lineFrames(i)), LINE_START[i], lineFrames(i))),
  ...place(ganjarMoves("lambai", CTA_FRAMES), CTA_START, CTA_FRAMES),
];

export const CLAUDE_CLIPS: readonly RobotClip[] = [
  ...LINES.flatMap((l, i) => place(robotMoves(l.handRobot, lineFrames(i)), LINE_START[i], lineFrames(i))),
  { clip: surprise, start: LINE_START[SURPRISE_LINE], dur: SURPRISE_FRAMES },
  ...place(robotMoves("lambai", CTA_FRAMES), CTA_START, CTA_FRAMES),
];
