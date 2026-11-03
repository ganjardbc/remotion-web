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
  claudeCodeSize,
  ClaudeCodeStickman,
  claudeCodeStickmanSize,
  Ganjar,
  ganjarSize,
  GanjarStickman,
  ganjarStickmanSize,
  headTurn,
  point,
  Robot,
  robotSize,
  RobotStickman,
  robotStickmanSize,
  startle,
  surprise,
  walk,
  type Gesture,
  type LookKey,
} from "../assets/characters";
import { Board } from "./Board";
import type { CastCue, CharacterId, DraftLine, DraftScene, VisualStyle } from "./types";

// Latar dan pemeran satu scene. Pemeran berdiri di garis lantai latar; di ruang kerja Ganjar duduk di balik meja
// dan karakter lain berdiri di atas meja (seperti ProgrammerBodoh). Area di atas pemeran untuk teks layar,
// area di bawah lantai untuk subtitle.

type Size = { readonly width: number; readonly top: (floorY: number) => number };

// Tinggi karakter (px) per gaya. Rig: tinggi kotak viewBox; stickman: tinggi gambar.
export const HEIGHT: Readonly<Record<VisualStyle, Readonly<Record<CharacterId, number>>>> = {
  rig: { ganjar: 760, robot: 420, claudecode: 380 },
  stickman: { ganjar: 640, robot: 340, claudecode: 300 },
};
// Ganjar stickman duduk setinggi di WorkspaceScene supaya kepalanya di atas laptop.
const SEATED_STICKMAN = 760;
// Di atas meja karakter non-manusia lebih kecil supaya muat di dinding.
const DESK_SCALE = 0.75;

export const size = (who: CharacterId, style: VisualStyle, h: number): Size => {
  if (style === "rig") {
    const s = who === "ganjar" ? ganjarSize(h) : who === "robot" ? robotSize(h) : claudeCodeSize(h);
    return { width: s.width, top: (floor) => floor - h + s.floorGap };
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
  motion === "armGesture" ? { clip: armGesture("R", 60, 130, 14), dur: 60 } : motion === "surprise" ? { clip: surprise, dur: 24 } : motion === "walk" ? { clip: walk(90), dur: 90 } : null;

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

type Actor = { readonly cue: CastCue; readonly x: number; readonly floor: number; readonly h: number; readonly clip?: boolean };

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
  const { cue, x, floor, h } = actor;
  const who = cue.character;
  const talking = speakingAt(scene.lines, who, t);
  const s = size(who, style, h);
  const events = motionEvents(scene.lines, who, cue.motion, fps);
  const others = scene.cast.filter((c) => c.character !== who).map((c) => xOf(c.character) ?? x);
  const toward = others.length ? Math.sign(others[0] - x) : 0;
  const look = lookKeys(scene.lines, who, x, xOf);
  // Robot dan Claude Code tidak punya mulut: badan memantul saat bicara.
  const bounce = talking && who !== "ganjar" ? Math.abs(Math.sin(t * 12)) * 6 : 0;
  const expression = expressionAt(scene.lines, who, t, cue.expression) as never;

  let body: React.ReactNode;
  if (style === "stickman") {
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
  if (!actor.clip) return placed;
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
  scene.backdrop === "ruangKerja" ? PORTRAIT_ANCHORS.floorY : scene.backdrop === "luarRuang" ? PORTRAIT_OUTDOOR_ANCHORS.floorY : PORTRAIT_PLAIN_ANCHORS.floorY;

export const Stage: React.FC<{ readonly scene: DraftScene; readonly style: VisualStyle; readonly idle?: boolean }> = ({ scene, style, idle }) => {
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
        ? [style === "stickman"
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

  const plain = scene.backdrop === "kosong" || scene.backdrop === "kelas";
  const floor = floorOf(scene);
  const shadow = plain ? plainPalette(time).shadowOpacity : outdoorPalette(time).shadowOpacity;
  const back =
    style === "stickman" ? (
      plain ? <PlainSketch time={time} /> : <OutdoorSketch time={time} />
    ) : plain ? (
      <PlainBack time={time} />
    ) : (
      <OutdoorBack time={time} />
    );
  return (
    <AbsoluteFill>
      {back}
      {scene.backdrop === "kelas" ? <Board scene={scene} /> : null}
      {style === "rig" && actors.map((a) => <ContactShadow key={`shadow-${a.cue.character}`} x={a.x + slide(a.cue, frame / fps).dx} y={floor} width={a.cue.character === "ganjar" ? 300 : 240} opacity={shadow} />)}
      {actors.map((a) => (
        <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} idle={idle} />
      ))}
    </AbsoluteFill>
  );
};
