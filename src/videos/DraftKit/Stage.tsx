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
} from "../../assets/backdrops";
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
} from "../../assets/characters";
import type { CastCue, CharacterId, DraftLine, DraftScene, VisualStyle } from "./types";

// Latar dan pemeran satu scene. Pemeran berdiri di garis lantai latar; di ruang kerja Ganjar duduk di balik meja
// dan karakter lain berdiri di atas meja (seperti ProgrammerBodoh). Area di atas pemeran untuk teks layar,
// area di bawah lantai untuk subtitle.

type Size = { readonly width: number; readonly top: (floorY: number) => number };

// Tinggi karakter (px) per gaya. Rig: tinggi kotak viewBox; stickman: tinggi gambar.
const HEIGHT: Readonly<Record<VisualStyle, Readonly<Record<CharacterId, number>>>> = {
  rig: { ganjar: 760, robot: 420, claudecode: 380 },
  stickman: { ganjar: 640, robot: 340, claudecode: 300 },
};
// Ganjar stickman duduk setinggi di WorkspaceScene supaya kepalanya di atas laptop.
const SEATED_STICKMAN = 760;
// Di atas meja karakter non-manusia lebih kecil supaya muat di dinding.
const DESK_SCALE = 0.75;

const size = (who: CharacterId, style: VisualStyle, h: number): Size => {
  if (style === "rig") {
    const s = who === "ganjar" ? ganjarSize(h) : who === "robot" ? robotSize(h) : claudeCodeSize(h);
    return { width: s.width, top: (floor) => floor - h + s.floorGap };
  }
  if (who === "ganjar") return { width: ganjarStickmanSize(h).width, top: (floor) => floor - 0.91 * h };
  // Kaki robot stickman sedikit di bawah kotak viewBox (lihat ProgrammerBodoh).
  const w = who === "robot" ? robotStickmanSize(h).width : claudeCodeStickmanSize(h).width;
  return { width: w, top: (floor) => floor + (25 * h) / 400 - h };
};

const SLOTS: Readonly<Record<number, readonly number[]>> = { 1: [540], 2: [300, 780], 3: [210, 540, 870] };
const ORDER = { kiri: 0, tengah: 1, kanan: 2 } as const;

const speakingAt = (lines: readonly DraftLine[], who: CharacterId, t: number): boolean =>
  lines.some((l) => l.who === who && t >= l.from && t < l.from + l.dur - 0.15);

// Saat gerak dimainkan: awal baris pertama karakter itu, atau sesaat setelah scene mulai.
const motionStart = (lines: readonly DraftLine[], who: CharacterId): number => lines.find((l) => l.who === who)?.from ?? 0.3;

// Pendengar menoleh ke pembicara; pembicara menghadap penonton.
const lookKeys = (lines: readonly DraftLine[], who: CharacterId, x: number, xOf: (c: CharacterId) => number | undefined): LookKey[] =>
  lines.map((l) => {
    const sx = xOf(l.who);
    return { at: l.from, turn: l.who === who || sx === undefined ? 0 : Math.sign(sx - x) * 0.6 };
  });

type Actor = { readonly cue: CastCue; readonly x: number; readonly floor: number; readonly h: number; readonly clip?: boolean };

const ActorView: React.FC<{ readonly actor: Actor; readonly scene: DraftScene; readonly style: VisualStyle; readonly xOf: (c: CharacterId) => number | undefined }> = ({
  actor,
  scene,
  style,
  xOf,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { cue, x, floor, h } = actor;
  const who = cue.character;
  const talking = speakingAt(scene.lines, who, t);
  const s = size(who, style, h);
  const start = Math.round(motionStart(scene.lines, who) * fps);
  const others = scene.cast.filter((c) => c.character !== who).map((c) => xOf(c.character) ?? x);
  const toward = others.length ? Math.sign(others[0] - x) : 0;
  const look = lookKeys(scene.lines, who, x, xOf);
  // Robot dan Claude Code tidak punya mulut: badan memantul saat bicara.
  const bounce = talking && who !== "ganjar" ? Math.abs(Math.sin(t * 12)) * 6 : 0;
  const expression = cue.expression as never;

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
    const clip =
      cue.motion === "headTurn"
        ? { clip: headTurn(60, (toward || 1) * 0.7, 6), dur: 60 }
        : cue.motion === "point"
          ? { clip: point(toward < 0 ? "L" : "R", 60, 95), dur: 60 }
          : cue.motion === "startle"
            ? { clip: startle(24), dur: 24 }
            : null;
    const clips = clip ? [{ clip: clip.clip, start, dur: clip.dur }] : [];
    body = <Ganjar height={h} expression={expression} talking={talking} look={look} sit={actor.clip ? 1 : 0} clips={clips} />;
  } else {
    const clip =
      cue.motion === "armGesture" ? { clip: armGesture("R", 60, 130, 14), dur: 60 } : cue.motion === "surprise" ? { clip: surprise, dur: 24 } : cue.motion === "walk" ? { clip: walk(90), dur: 90 } : null;
    const clips = clip ? [{ clip: clip.clip, start, dur: clip.dur }] : [];
    body =
      who === "robot" ? (
        <Robot height={h} expression={expression} look={look} clips={clips} />
      ) : (
        <ClaudeCode height={h} expression={expression} look={look} clips={clips} />
      );
  }

  const placed = (
    <div style={{ position: "absolute", left: x - s.width / 2, top: s.top(floor) - bounce, filter: characterFilter(scene.time) }}>{body}</div>
  );
  if (!actor.clip) return placed;
  // Duduk di balik meja: badan bawah dipotong sedikit di bawah permukaan meja.
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PORTRAIT_ANCHORS.deskTop + 60, overflow: "hidden" }}>{placed}</div>;
};

const byPosition = (cast: readonly CastCue[]): readonly CastCue[] => [...cast].sort((a, b) => ORDER[a.position] - ORDER[b.position]);

export const floorOf = (scene: DraftScene): number =>
  scene.backdrop === "ruangKerja" ? PORTRAIT_ANCHORS.floorY : scene.backdrop === "luarRuang" ? PORTRAIT_OUTDOOR_ANCHORS.floorY : PORTRAIT_PLAIN_ANCHORS.floorY;

export const Stage: React.FC<{ readonly scene: DraftScene; readonly style: VisualStyle }> = ({ scene, style }) => {
  const { time } = scene;
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
    actors = cast.map((cue, i) => ({ cue, x: slots[i], floor, h: HEIGHT[style][cue.character] }));
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
          <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} />
        ))}
        <Desk time={time} />
        <Laptop time={time} />
        <Mug />
        {standing.map((a) => (
          <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} />
        ))}
      </AbsoluteFill>
    );
  }

  const plain = scene.backdrop === "kosong";
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
      {style === "rig" && actors.map((a) => <ContactShadow key={`shadow-${a.cue.character}`} x={a.x} y={floor} width={a.cue.character === "ganjar" ? 300 : 240} opacity={shadow} />)}
      {actors.map((a) => (
        <ActorView key={a.cue.character} actor={a} scene={scene} style={style} xOf={xOf} />
      ))}
    </AbsoluteFill>
  );
};
