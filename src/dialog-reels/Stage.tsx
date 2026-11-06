import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Chair,
  characterFilter,
  ContactShadow,
  Desk,
  Laptop,
  Mug,
  OutdoorBack,
  OutdoorSketch,
  outdoorPalette,
  PlainBack,
  PlainSketch,
  plainPalette,
  PORTRAIT_ANCHORS,
  PORTRAIT_OUTDOOR_ANCHORS,
  PORTRAIT_PLAIN_ANCHORS,
  RoomBack,
} from "../assets/backdrops";
import {
  armGesture,
  ClaudeCode,
  ClaudeCodeBlock,
  claudeCodeBlockSize,
  claudeCodeSize,
  ClaudeCodeStickman,
  claudeCodeStickmanSize,
  Ganjar,
  GanjarBlock,
  ganjarBlockSize,
  ganjarSize,
  GanjarStickman,
  ganjarStickmanSize,
  headTurn,
  point,
  Robot,
  RobotBlock,
  robotBlockSize,
  robotSize,
  RobotStickman,
  robotStickmanSize,
  startle,
  surprise,
  walk,
  type Gesture,
  type LookKey,
} from "../assets/characters";
import { Board, BOARD } from "./Board";
import { COMPUTER_FLOOR_Y, ComputerBack } from "./ComputerBack";
import { TokenBack } from "./TokenBack";

// Dasar papan tulis (titik tuju tongkat penunjuk).
const BOARD_BOTTOM = BOARD.top + BOARD.height + 30;
import type { CastCue, CharacterId, DraftLine, DraftScene, ShotKind, VisualStyle } from "./types";

// Latar dan pemeran satu scene. Pemeran berdiri di garis lantai latar; di ruang kerja Ganjar duduk di balik meja
// dan karakter lain berdiri di atas meja (seperti ProgrammerBodoh). Area di atas pemeran untuk teks layar,
// area di bawah lantai untuk subtitle.

type Size = { readonly width: number; readonly top: (floorY: number) => number };

// Tinggi karakter (px) per gaya. Rig: tinggi kotak viewBox; stickman: tinggi gambar.
export const HEIGHT: Readonly<Record<VisualStyle, Readonly<Record<CharacterId, number>>>> = {
  rig: { ganjar: 760, robot: 420, claudecode: 380 },
  stickman: { ganjar: 640, robot: 340, claudecode: 300 },
  block: { ganjar: 640, robot: 380, claudecode: 300 },
};
// Close-up block (`shots: "bicara"`): tinggi karakter yang tampil sendirian di tengah layar.
export const CLOSEUP_BLOCK: Readonly<Record<CharacterId, number>> = { ganjar: 920, robot: 560, claudecode: 520 };
// Sudut menoleh (derajat) ke arah lawan bicara saat close-up; lawan di kanan layar = menghadap kanan.
const CLOSEUP_YAW = 16;
// Ganjar stickman duduk setinggi di WorkspaceScene supaya kepalanya di atas laptop.
const SEATED_STICKMAN = 760;
// Ganjar block tidak punya pose duduk: berdiri di balik meja, kaki dipotong meja (seperti stickman).
const SEATED_BLOCK = 700;
// Di atas meja karakter non-manusia lebih kecil supaya muat di dinding.
const DESK_SCALE = 0.75;

export const size = (who: CharacterId, style: VisualStyle, h: number): Size => {
  if (style === "rig") {
    const s = who === "ganjar" ? ganjarSize(h) : who === "robot" ? robotSize(h) : claudeCodeSize(h);
    return { width: s.width, top: (floor) => floor - h + s.floorGap };
  }
  if (style === "block") {
    // Bayangan lantai kotak block ada di 31/34 (Ganjar), 20,8/23 (Robot), 14,6/17 (Claude Code) dari tinggi kotak.
    if (who === "ganjar") return { width: ganjarBlockSize(h).width, top: (floor) => floor - (31 / 34) * h };
    if (who === "robot") return { width: robotBlockSize(h).width, top: (floor) => floor - (20.8 / 23) * h };
    return { width: claudeCodeBlockSize(h).width, top: (floor) => floor - (14.6 / 17) * h };
  }
  if (who === "ganjar") return { width: ganjarStickmanSize(h).width, top: (floor) => floor - 0.91 * h };
  // Kaki robot stickman sedikit di bawah kotak viewBox (lihat ProgrammerBodoh).
  const w = who === "robot" ? robotStickmanSize(h).width : claudeCodeStickmanSize(h).width;
  return { width: w, top: (floor) => floor + (25 * h) / 400 - h };
};

// Klip rig untuk gerak dari draft; `toward` = arah karakter lain (-1 kiri, 1 kanan, 0 tidak ada).
export const ganjarClip = (motion: string | null | undefined, toward: number) =>
  motion === "headTurn"
    ? { clip: headTurn(60, (toward || 1) * 0.7, 6), dur: 60 }
    : motion === "point"
      ? { clip: point(toward < 0 ? "L" : "R", 60, 95), dur: 60 }
      : motion === "startle"
        ? { clip: startle(24), dur: 24 }
        : null;

// Robot dan Claude Code memakai klip Robot.
export const robotClip = (motion: string | null | undefined) =>
  motion === "armGesture" ? { clip: armGesture("R", 60, 130, 14), dur: 60 } : motion === "tunjuk" ? { clip: armGesture("R", 96, 120, 1.5), dur: 96 } : motion === "surprise" ? { clip: surprise, dur: 24 } : motion === "walk" ? { clip: walk(90), dur: 90 } : null;

const SLOTS: Readonly<Record<number, readonly number[]>> = { 1: [540], 2: [300, 780], 3: [210, 540, 870] };
const ORDER = { kiri: 0, tengah: 1, kanan: 2 } as const;

const speakingAt = (lines: readonly DraftLine[], who: CharacterId, t: number): boolean =>
  lines.some((l) => l.who === who && t >= l.from && t < l.from + l.dur - 0.15);

// Ekspresi pada waktu t: pengaturan terakhir dari baris yang sudah mulai; bila belum ada, ekspresi dasar dari `cast`.
const expressionAt = (lines: readonly DraftLine[], who: CharacterId, t: number, base: string): string => {
  let e = base;
  let at = -1;
  for (const l of lines) {
    const ex = l.expressions?.[who];
    if (ex && l.from <= t && l.from >= at) {
      e = ex;
      at = l.from;
    }
    for (const r of l.reactions ?? []) {
      const when = l.from + r.at;
      if (r.who === who && when <= t && when >= at) {
        e = r.expression;
        at = when;
      }
    }
  }
  return e;
};

// Saat gerak dimainkan: awal baris pertama karakter itu, atau sesaat setelah scene mulai.
const motionStart = (lines: readonly DraftLine[], who: CharacterId): number => lines.find((l) => l.who === who)?.from ?? 0.3;

// Gerak yang dimainkan: dari `motions` per baris (waktu = awal baris + `motionAt`); bila karakter ini tidak punya satupun,
// `motion` di `cast` dimainkan sekali di baris pertamanya.
const motionEvents = (lines: readonly DraftLine[], who: CharacterId, base: string | null | undefined, fps: number): { readonly motion: string; readonly start: number }[] => {
  const perLine = lines.flatMap((l) => {
    const m = l.motions?.[who];
    return m ? [{ motion: m, start: Math.round((l.from + (l.motionAt?.[who] ?? 0.1)) * fps) }] : [];
  });
  if (perLine.length) return perLine;
  return base ? [{ motion: base, start: Math.round(motionStart(lines, who) * fps) }] : [];
};

// Pendengar menoleh ke pembicara; pembicara menghadap penonton.
const lookKeys = (lines: readonly DraftLine[], who: CharacterId, x: number, xOf: (c: CharacterId) => number | undefined): LookKey[] =>
  lines.map((l) => {
    const sx = xOf(l.who);
    return { at: l.from, turn: l.who === who || sx === undefined ? 0 : Math.sign(sx - x) * 0.6 };
  });

// Putar badan block (derajat, + = menghadap kanan layar): pendengar berputar ke pembicara, pembicara sedikit lebih ke kamera.
// Berpindah tiap giliran bicara dalam 0,4 dtk (ease-out); sebelum baris pertama menghadap lawan bicara 24 derajat.
const YAW_BLEND = 0.4;
const blockYaw = (lines: readonly DraftLine[], who: CharacterId, x: number, xOf: (c: CharacterId) => number | undefined, t: number): number => {
  const toward = (c: CharacterId | undefined): number => {
    const cx = c ? xOf(c) : undefined;
    return cx === undefined || cx === x ? 1 : Math.sign(cx - x);
  };
  const other = lines.find((l) => l.who !== who)?.who;
  const dir = toward(other);
  const target = (l: DraftLine): number => (l.who === who ? dir * 10 : toward(l.who) * 34);
  const base = dir * 24;
  let prev = base;
  let cur = base;
  let at = 0;
  for (const l of lines) {
    if (l.from > t) break;
    prev = cur;
    cur = target(l);
    at = l.from;
  }
  const p = Math.min(1, Math.max(0, (t - at) / YAW_BLEND));
  return prev + (cur - prev) * (1 - Math.pow(1 - p, 3));
};

// Gerak putar block (bukan gesture lengan): `putar` = satu putaran penuh 1 dtk, `membelakangi` = berbalik 180 derajat 0,5 dtk dan
// bertahan, `hadap` = kembali menghadap. Tidak mengganti gesture lengan yang sedang berjalan.
export const TURN_MOTIONS: ReadonlySet<string> = new Set(["putar", "membelakangi", "hadap"]);
const SPIN_SEC = 1;
const TURN_SEC = 0.5;
const turnYaw = (events: readonly { readonly motion: string; readonly start: number }[], fps: number, t: number): number => {
  const ease = (p: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
  let hold = 0;
  let extra = 0;
  for (const e of [...events].sort((a, b) => a.start - b.start)) {
    const at = e.start / fps;
    if (at > t) break;
    const p = t - at;
    if (e.motion === "putar") {
      extra = hold + 360 * ease(p / SPIN_SEC);
      if (p >= SPIN_SEC) extra = hold;
    } else {
      const to = e.motion === "membelakangi" ? 180 : 0;
      extra = hold + (to - hold) * ease(p / TURN_SEC);
      if (p >= TURN_SEC) hold = to;
      if (p >= TURN_SEC) extra = to;
    }
  }
  return extra;
};

// Meluncur masuk dari sisi layar (ease-out, 0,7 dtk); selama meluncur badan sedikit naik turun seperti melangkah.
const ENTER_SEC = 0.7;
const slide = (cue: CastCue, t: number): { readonly dx: number; readonly bob: number } => {
  if (!cue.enterFrom) return { dx: 0, bob: 0 };
  const start = cue.enterAt ?? 0;
  const p = Math.min(1, Math.max(0, (t - start) / ENTER_SEC));
  const eased = 1 - Math.pow(1 - p, 3);
  const from = cue.enterFrom === "kiri" ? -700 : 700;
  return { dx: from * (1 - eased), bob: p > 0 && p < 1 ? Math.abs(Math.sin(t * 11)) * 10 : 0 };
};

// `home` = posisi x semula bila actor dipindah ke tengah (close-up), dipakai untuk arah menoleh.
type Actor = { readonly cue: CastCue; readonly x: number; readonly floor: number; readonly h: number; readonly clip?: boolean; readonly home?: number; readonly closeUp?: boolean; readonly pitch?: number; readonly yaw?: number };

const ActorView: React.FC<{ readonly actor: Actor; readonly scene: DraftScene; readonly style: VisualStyle; readonly xOf: (c: CharacterId) => number | undefined; readonly idle?: boolean }> = ({
  actor,
  scene,
  style,
  xOf,
  idle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, floor, h } = actor;
  const x = actor.x;
  const hx = actor.home ?? x;
  const who = cue.character;
  const talking = speakingAt(scene.lines, who, t);
  const s = size(who, style, h);
  const events = motionEvents(scene.lines, who, cue.motion, fps);
  const others = scene.cast.filter((c) => c.character !== who).map((c) => xOf(c.character) ?? x);
  const toward = others.length ? Math.sign(others[0] - hx) : 0;
  const look = lookKeys(scene.lines, who, hx, xOf);
  // Robot dan Claude Code tidak punya mulut: badan memantul saat bicara.
  const bounce = talking && who !== "ganjar" ? Math.abs(Math.sin(t * 12)) * 6 : 0;
  const expression = expressionAt(scene.lines, who, t, cue.expression) as never;

  let body: React.ReactNode;
  if (style === "block") {
    // Putar penuh dan berbalik memakai `turnYaw`; yang `putar` hanya menambah sudut, tidak meniadakan arah menoleh.
    const turns = events.filter((e) => TURN_MOTIONS.has(e.motion));
    const baseYaw = actor.yaw !== undefined ? actor.yaw : actor.closeUp ? (toward || 1) * CLOSEUP_YAW : blockYaw(scene.lines, who, hx, xOf, t);
    const yaw = baseYaw + turnYaw(turns, fps, t);
    const pitch = actor.pitch ?? -9;
    // Gesture berganti per baris (`motions`), dihaluskan 0,3 dtk; tanpa `motions`, `motion` di cast mulai di baris pertama.
    const gestures = [{ at: 0, gesture: "netral" as Gesture }, ...events.filter((e) => !TURN_MOTIONS.has(e.motion)).map((e) => ({ at: e.start / fps, gesture: e.motion as Gesture }))].sort((a, b) => a.at - b.at);
    body =
      who === "ganjar" ? (
        <GanjarBlock height={h} expression={expression} gestures={gestures} talking={talking} yaw={yaw} pitch={pitch} />
      ) : who === "robot" ? (
        <RobotBlock height={h} expression={expression} gestures={gestures} yaw={yaw} pitch={pitch} />
      ) : (
        <ClaudeCodeBlock height={h} expression={expression} gestures={gestures} yaw={yaw} pitch={pitch} />
      );
  } else if (style === "stickman") {
    const gesture = (cue.motion ?? "netral") as Gesture;
    body =
      who === "ganjar" ? (
        <GanjarStickman height={h} expression={expression} gesture={gesture} talking={talking} hair headphones={false} strokeWidth={5} />
      ) : who === "robot" ? (
        <RobotStickman height={h} expression={expression} gesture={gesture} strokeWidth={5} />
      ) : (
        <ClaudeCodeStickman height={h} expression={expression} gesture={gesture} strokeWidth={5} />
      );
  } else if (who === "ganjar") {
    const clips = events.flatMap((e) => {
      const c = ganjarClip(e.motion, toward);
      return c ? [{ clip: c.clip, start: e.start, dur: c.dur }] : [];
    });
    body = <Ganjar height={h} expression={expression} talking={talking} look={look} sit={actor.clip ? 1 : 0} clips={clips} />;
  } else {
    const clips = events.flatMap((e) => {
      const c = robotClip(e.motion);
      return c ? [{ clip: c.clip, start: e.start, dur: c.dur }] : [];
    });
    body =
      who === "robot" ? (
        <Robot height={h} expression={expression} look={look} clips={clips} />
      ) : (
        <ClaudeCode height={h} expression={expression} look={look} clips={clips} />
      );
  }

  const sl = actor.clip ? { dx: 0, bob: 0 } : slide(cue, t);
  // Gerak diam: napas kecil dan miring tipis, fase beda per karakter supaya tidak serempak.
  const phase = who === "ganjar" ? 0 : who === "robot" ? 1.7 : 3.1;
  const idleStyle = idle ? { transformOrigin: "50% 100%", transform: `translateY(${Math.sin(t * 1.7 + phase) * 3}px) rotate(${Math.sin(t * 1.1 + phase) * 0.45}deg)` } : {};
  const placed = (
    <div style={{ position: "absolute", left: x - s.width / 2 + sl.dx, top: s.top(floor) - bounce - sl.bob, filter: characterFilter(scene.time), ...idleStyle }}>{body}</div>
  );
  // Tongkat penunjuk (latar kelas, gerak `tunjuk`): tumbuh dari ujung lengan ke dasar papan, ditahan, lalu ditarik kembali.
  let pointer: React.ReactNode = null;
  if (scene.backdrop === "kelas" && who !== "ganjar" && style === "rig") {
    const ev = events.find((e) => e.motion === "tunjuk" && frame >= e.start && frame < e.start + 96);
    if (ev) {
      const f = frame - ev.start;
      const grow = Math.min(1, Math.max(0, (f - 8) / 14));
      const back = Math.min(1, Math.max(0, (f - 82) / 12));
      const p = (1 - Math.pow(1 - grow, 3)) * (1 - back);
      const tip = { x: x + 0.47 * h, y: floor - 0.44 * h };
      const aim = { x: x + 0.5 * h, y: BOARD_BOTTOM };
      pointer = (
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <line x1={tip.x} y1={tip.y} x2={tip.x + (aim.x - tip.x) * p} y2={tip.y + (aim.y - tip.y) * p} stroke="#B98A52" strokeWidth="10" strokeLinecap="round" />
          <circle cx={tip.x + (aim.x - tip.x) * p} cy={tip.y + (aim.y - tip.y) * p} r={9 * p} fill="#F2F3F7" />
        </svg>
      );
    }
  }
  if (!actor.clip) return <>{placed}{pointer}</>;
  // Duduk di balik meja: badan bawah dipotong sedikit di bawah permukaan meja.
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PORTRAIT_ANCHORS.deskTop + 60, overflow: "hidden" }}>{placed}</div>;
};

const byPosition = (cast: readonly CastCue[]): readonly CastCue[] => [...cast].sort((a, b) => ORDER[a.position] - ORDER[b.position]);

// Titik fokus kamera (px, kanvas 1080x1920) pada seorang karakter di scene ini: dasar bagi kamera "ikuti" dan `zoom`.
export const focusPoint = (scene: DraftScene, who: CharacterId): { readonly x: number; readonly y: number } => {
  const others = scene.cast.filter((c) => c.character !== "ganjar").sort((a, b) => ORDER[a.position] - ORDER[b.position]);
  if (scene.backdrop === "ruangKerja") {
    // y di tengah kanvas: zoom tidak menurunkan garis lantai ke area caption.
    if (who === "ganjar") return { x: PORTRAIT_ANCHORS.seatX, y: 960 };
    const deskXs = others.length === 1 ? [790] : [700, 910];
    return { x: deskXs[Math.max(0, others.findIndex((c) => c.character === who))] ?? 790, y: 960 };
  }
  const cast = byPosition(scene.cast);
  const slots = SLOTS[cast.length] ?? SLOTS[3];
  return { x: slots[Math.max(0, cast.findIndex((c) => c.character === who))] ?? 540, y: floorOf(scene) - 300 };
};

export const floorOf = (scene: DraftScene): number =>
  scene.backdrop === "komputer" ? COMPUTER_FLOOR_Y : scene.backdrop === "ruangKerja" ? PORTRAIT_ANCHORS.floorY : scene.backdrop === "luarRuang" ? PORTRAIT_OUTDOOR_ANCHORS.floorY : PORTRAIT_PLAIN_ANCHORS.floorY;

// ---------- Jenis shot (gaya block) ----------
// Kamera virtual 2D di atas dunia dua karakter (slot SLOTS) ditambah sudut pandang 3D block (`pitch`). Titik subjek (head, upper)
// dipetakan ke SCREEN, di antara kartu teks atas dan caption. Potong langsung antar baris; `reveal` dan `push` bergerak.
const SCREEN = { x: 540, y: 800 };
const SHOT_ZOOM = {
  medium: { ganjar: 1.8, robot: 1.8, claudecode: 1.7 },
  closeUp: { ganjar: 3.4, robot: 2.4, claudecode: 2.4 },
  extremeCloseUp: { ganjar: 6.5, robot: 4.2, claudecode: 4.2 },
} as const;
const DUTCH_DEG = 7;
const PUSH = 0.15;
const REVEAL_SEC = 2.6;
const REVEAL_HOLD = 0.3;
const W = 1080;
const H = 1920;

type Cam = { readonly fx: number; readonly fy: number; readonly z: number; readonly rot: number; readonly shake: number };
const WIDE: Cam = { fx: W / 2, fy: H / 2, z: 1, rot: 0, shake: 0 };

const PITCH: Partial<Record<ShotKind, number>> = { lowAngle: 14, highAngle: -32, birdsEye: -62 };

// Badan sekotak (Robot, Claude Code) lebih cepat terlihat miring dari bawah/atas: sudut pandangnya dikurangi.
const pitchFor = (kind: ShotKind, who: CharacterId): number | undefined => {
  const p = PITCH[kind];
  return p === undefined ? undefined : who === "ganjar" ? p : Math.round(p * 0.6);
};

type ShotPlan = { readonly kind: ShotKind; readonly speaker: CharacterId; readonly start: number; readonly dur: number; readonly push: boolean };

// Shot yang berlaku pada detik t, atau null bila scene ini tidak memakai `shot` di baris aktif.
const shotPlanAt = (scene: DraftScene, t: number): ShotPlan | null => {
  let line: DraftLine | undefined = scene.lines[0];
  for (const l of scene.lines) if (l.from <= t) line = l;
  if (!line?.shot) return null;
  const list = typeof line.shot === "string" ? [{ at: 0, kind: line.shot }] : [...line.shot].sort((a, b) => a.at - b.at);
  const idx = list.reduce((n, e, i) => (line.from + e.at <= t ? i : n), 0);
  const e = list[idx];
  const start = line.from + e.at;
  const end = idx + 1 < list.length ? line.from + list[idx + 1].at : line.from + line.dur;
  return { kind: e.kind, speaker: line.who, start, dur: Math.max(0.1, end - start), push: !!line.push };
};

const camFor = (kind: ShotKind, a: Actor): Cam => {
  const who = a.cue.character;
  const scale = a.h / HEIGHT.block[who];
  const y = (part: "head" | "upper"): number => (who === "ganjar" ? a.floor - (part === "head" ? 0.69 : 0.58) * a.h : a.floor - (who === "robot" ? 0.44 : 0.38) * a.h);
  const zoom = (k: keyof typeof SHOT_ZOOM): number => SHOT_ZOOM[k][who] * scale;
  switch (kind) {
    case "medium":
    case "pov":
      return { fx: a.x, fy: y("upper"), z: zoom("medium"), rot: 0, shake: 0 };
    case "closeUp":
      return { fx: a.x, fy: y("head"), z: zoom("closeUp"), rot: 0, shake: 0 };
    case "extremeCloseUp":
    case "reveal":
      return { fx: a.x, fy: y("head"), z: zoom("extremeCloseUp"), rot: 0, shake: kind === "extremeCloseUp" ? 3 : 0 };
    case "dutch":
      return { fx: a.x, fy: y("head"), z: zoom("closeUp") * 1.2, rot: a.x < W / 2 ? DUTCH_DEG : -DUTCH_DEG, shake: 0 };
    case "lowAngle":
    case "highAngle":
      // Sama dengan medium (bukan lebih besar): kaki Ganjar tidak boleh menimpa caption.
      return { fx: a.x, fy: y("upper"), z: zoom("medium"), rot: 0, shake: 0 };
    case "birdsEye":
      // Dari atas: kedua karakter tetap terlihat (kamera wide), hanya sudut pandang 3D yang berubah.
      return WIDE;
    default:
      return WIDE;
  }
};

const ease = (p: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
const noise = (f: number, seed: number): number => Math.sin(f * 0.37 + seed) * 0.5 + Math.sin(f * 0.91 + seed * 2.1) * 0.3 + Math.sin(f * 1.73 + seed * 3.3) * 0.2;

// Keadaan kamera pada waktu t. Tanpa putaran, geser dijepit supaya tepi kanvas tidak terlihat.
const camAt = (plan: ShotPlan, a: Actor, t: number): Cam => {
  const p = t - plan.start;
  if (plan.kind === "reveal") {
    const k = ease((p - REVEAL_HOLD) / Math.min(REVEAL_SEC, Math.max(0.1, plan.dur - REVEAL_HOLD)));
    const c = camFor("reveal", a);
    return { fx: lerp(c.fx, WIDE.fx, k), fy: lerp(c.fy, WIDE.fy, k), z: Math.exp(lerp(Math.log(c.z), 0, k)), rot: 0, shake: 0 };
  }
  const c = camFor(plan.kind, a);
  return plan.push ? { ...c, z: c.z * (1 + PUSH * ease(p / plan.dur)) } : c;
};

// Kamera terselesaikan: titik tengah layar (ax, ay) untuk titik dunia (fx, fy). Tanpa putaran, geser dijepit supaya tepi kanvas
// tidak terlihat. Karakter block tidak diperbesar lewat CSS scale (kubus 3D menjadi bergerigi): posisi dan tingginya yang dikalikan z
// (`mapActor`); hanya latar datar yang diskala.
type Resolved = Cam & { readonly ax: number; readonly ay: number };
const resolveCam = (c: Cam): Resolved => {
  if (c.rot !== 0) return { ...c, ax: SCREEN.x, ay: SCREEN.y };
  const tx = Math.min(0, Math.max(W - c.z * W, SCREEN.x - c.z * c.fx));
  const ty = Math.min(0, Math.max(H - c.z * H, SCREEN.y - c.z * c.fy));
  return { ...c, ax: tx + c.z * c.fx, ay: ty + c.z * c.fy };
};
const mapActor = (a: Actor, c: Resolved): Actor => ({ ...a, x: c.ax + c.z * (a.x - c.fx), floor: c.ay + c.z * (a.floor - c.fy), h: a.h * c.z });
// Pusat putar dan goyang tangan (shake) ada di pembungkus luar; latar diskala di dalamnya.
const camOuter = (c: Resolved, frame: number): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: W,
  height: H,
  transformOrigin: `${SCREEN.x}px ${SCREEN.y}px`,
  transform: `translate(${c.shake * noise(frame, 1)}px, ${c.shake * noise(frame, 2)}px) rotate(${c.rot + c.shake * 0.02 * noise(frame, 3)}deg)`,
});
const camBack = (c: Resolved): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  top: 0,
  width: W,
  height: H,
  transformOrigin: "0 0",
  transform: `translate(${c.ax - c.z * c.fx}px, ${c.ay - c.z * c.fy}px) scale(${c.z})`,
});

// Over the shoulder: pendengar dari belakang, besar, di tepi layar (di depan); pembicara menghadap kamera agak ke pendengar.
const overShoulder = (actors: readonly Actor[], speaker: CharacterId, floor: number): readonly Actor[] | null => {
  const spk = actors.find((a) => a.cue.character === speaker);
  const lis = actors.find((a) => a.cue.character !== speaker);
  if (!spk || !lis) return null;
  const left = lis.x < spk.x;
  return [
    { ...spk, home: spk.x, x: left ? 660 : 420, floor, h: CLOSEUP_BLOCK[speaker] * 0.8, yaw: left ? -20 : 20 },
    { ...lis, home: lis.x, x: left ? 120 : 960, floor: floor + 70, h: CLOSEUP_BLOCK[lis.cue.character] * 1.15, yaw: left ? 156 : -156 },
  ];
};

export const Stage: React.FC<{ readonly scene: DraftScene; readonly style: VisualStyle; readonly idle?: boolean; readonly shots?: boolean }> = ({ scene, style, idle, shots }) => {
  const { time } = scene;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const xs = new Map<CharacterId, number>();
  let actors: Actor[];

  if (scene.backdrop === "ruangKerja") {
    const a = PORTRAIT_ANCHORS;
    const human = scene.cast.find((c) => c.character === "ganjar");
    const onDesk = byPosition(scene.cast.filter((c) => c.character !== "ganjar"));
    const deskXs = onDesk.length === 1 ? [790] : [700, 910];
    actors = [
      ...(human
        ? [style === "block"
            ? { cue: human, x: a.seatX, floor: a.deskTop + 0.33 * SEATED_BLOCK, h: SEATED_BLOCK, clip: true }
            : style === "stickman"
            ? // Stickman duduk: badan dipotong meja di sekitar perut (seperti WorkspaceScene).
              { cue: human, x: a.seatX, floor: a.deskTop + 0.29 * SEATED_STICKMAN, h: SEATED_STICKMAN, clip: true }
            : { cue: human, x: a.seatX, floor: a.floorY, h: HEIGHT.rig.ganjar, clip: true }]
        : []),
      ...onDesk.map((cue, i) => ({ cue, x: deskXs[i], floor: a.deskTop, h: HEIGHT[style][cue.character] * DESK_SCALE })),
    ];
  } else {
    const floor = floorOf(scene);
    const cast = byPosition(scene.cast);
    const slots = SLOTS[cast.length] ?? SLOTS[3];
    actors = cast.map((cue, i) => ({ cue, x: slots[i], floor, h: HEIGHT[style][cue.character] * (cue.scale ?? 1) }));
  }
  actors.forEach((a) => xs.set(a.cue.character, a.x));
  // Potongan per pembicara: hanya karakter yang sedang bicara (atau yang terakhir bicara) tampil, di tengah dan lebih besar.
  if (shots && style === "block" && scene.backdrop !== "ruangKerja" && !shotPlanAt(scene, frame / fps)) {
    const t = frame / fps;
    let speaker = scene.lines[0]?.who;
    for (const l of scene.lines) if (l.from <= t) speaker = l.who;
    const shown = actors.filter((a) => a.cue.character === speaker);
    if (shown.length) actors = shown.map((a) => ({ ...a, home: a.x, x: 540, h: CLOSEUP_BLOCK[a.cue.character] * (a.cue.scale ?? 1), closeUp: true }));
  }
  // Jenis shot per baris: kamera 2D di atas dunia dua karakter, sudut pandang 3D lewat `pitch`.
  let camera: Resolved | null = null;
  if (style === "block" && scene.backdrop !== "ruangKerja") {
    const t = frame / fps;
    const plan = shotPlanAt(scene, t);
    if (plan) {
      const world = actors;
      const spk = world.find((a) => a.cue.character === plan.speaker);
      if (plan.kind === "overShoulder") {
        actors = [...(overShoulder(world, plan.speaker, floorOf(scene)) ?? world)];
        camera = resolveCam(WIDE);
      } else if (spk) {
        const cam = resolveCam(camAt(plan, spk, t));
        camera = cam;
        const yaw = plan.kind === "pov" ? 0 : undefined;
        actors = world.map((a) => mapActor({ ...a, pitch: pitchFor(plan.kind, a.cue.character), yaw: a.cue.character === plan.speaker ? yaw : a.yaw }, cam));
      }
    }
  }
  const xOf = (c: CharacterId): number | undefined => xs.get(c);
  const seated = actors.filter((a) => a.clip);
  const standing = actors.filter((a) => !a.clip);

  if (scene.backdrop === "ruangKerja") {
    return (
      <AbsoluteFill>
        <RoomBack time={time} />
        <Chair time={time} />
        {seated.map((a) => (
          <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} idle={idle} />
        ))}
        <Desk time={time} />
        <Laptop time={time} />
        <Mug />
        {standing.map((a) => (
          <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} idle={idle} />
        ))}
      </AbsoluteFill>
    );
  }

  const plain = scene.backdrop === "kosong" || scene.backdrop === "kelas" || scene.backdrop === "token" || scene.backdrop === "komputer";
  const floor = floorOf(scene);
  const shadow = plain ? plainPalette(time).shadowOpacity : outdoorPalette(time).shadowOpacity;
  const back =
    style === "stickman" ? (
      plain ? <PlainSketch time={time} /> : <OutdoorSketch time={time} />
    ) : plain ? (
      <PlainBack time={time} anchors={scene.backdrop === "komputer" ? { floorY: COMPUTER_FLOOR_Y, spotX: 540 } : undefined} />
    ) : (
      <OutdoorBack time={time} />
    );
  const board = scene.backdrop === "kelas" ? <Board scene={scene} /> : scene.backdrop === "token" ? <TokenBack scene={scene} /> : scene.backdrop === "komputer" ? <ComputerBack scene={scene} /> : null;
  const front = (
    <>
      {style !== "stickman" && style !== "block" && actors.map((a) => <ContactShadow key={`shadow-${a.cue.character}`} x={a.x + slide(a.cue, frame / fps).dx} y={floor} width={a.cue.character === "ganjar" ? 300 : 240} opacity={shadow} />)}
      {actors.map((a) => (
        <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} idle={idle} />
      ))}
    </>
  );
  if (!camera) {
    return (
      <AbsoluteFill>
        {back}
        {board}
        {front}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={camOuter(camera, frame)}>
        <div style={camBack(camera)}>
          {back}
          {board}
        </div>
        {front}
      </div>
    </AbsoluteFill>
  );
};
