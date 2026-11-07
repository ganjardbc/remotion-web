import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BlockLightContext, ClaudeCodeBlock, claudeCodeBlockSize, GanjarBlock, ganjarBlockSize, RobotBlock, robotBlockSize, type BlockLight, type Gesture } from "../assets/characters";
import type { BlockCast, BlockLine, BlockScene, CharacterId, Place, ShotKind } from "./types";
import { DESK_TOP, DeskFront, DeskTop, Foreground, H, Layer, Lighting, Monitor, SETS, W, type LayerCam, type Layout } from "./World";

// Panggung Reels block: karakter block di dunia diorama dan kamera virtual. Kamera 2D memilih titik fokus dan zoom; tiap lapisan
// dunia bergerak dengan faktor paralaks sendiri (lihat World.tsx), dan karakter diperbesar lewat tinggi (bukan CSS scale) supaya
// kubus 3D tetap tajam. Sudut pandang 3D karakter datang dari `pitch` dan `yaw`.

// Tinggi karakter (px) pada zoom 1; di atas meja dikali PLACE_DESK.
const HEIGHT: Readonly<Record<CharacterId, number>> = { ganjar: 700, robot: 400, claudecode: 330 };
const PLACE_DESK = 0.8;
const ORDER = { kiri: 0, tengah: 1, kanan: 2 } as const;
// Titik layar tempat fokus kamera diletakkan: di bawah caption atas, di atas zona bawah antarmuka.
const SCREEN = { x: 540, y: 880 };
const ZOOM = {
  medium: { ganjar: 2.1, robot: 1.8, claudecode: 1.7 },
  closeUp: { ganjar: 3.4, robot: 2.4, claudecode: 2.4 },
  extremeCloseUp: { ganjar: 6.2, robot: 4.2, claudecode: 4.2 },
} as const;
const DUTCH_DEG = 7;
const PUSH = 0.15;
const REVEAL_SEC = 2.6;
const REVEAL_HOLD = 0.3;
const PITCH: Partial<Record<ShotKind, number>> = { lowAngle: 14, highAngle: -32, birdsEye: -62 };
const YAW_BLEND = 0.4;

const size = (who: CharacterId, h: number): { readonly width: number; readonly top: (floor: number) => number } => {
  if (who === "ganjar") return { width: ganjarBlockSize(h).width, top: (floor) => floor - (31 / 34) * h };
  if (who === "robot") return { width: robotBlockSize(h).width, top: (floor) => floor - (20.8 / 23) * h };
  return { width: claudeCodeBlockSize(h).width, top: (floor) => floor - (14.6 / 17) * h };
};

type Actor = { readonly cue: BlockCast; readonly x: number; readonly floor: number; readonly h: number; readonly place: Place; readonly yaw?: number; readonly pitch?: number };

const placeOf = (cue: BlockCast): Place => cue.place ?? (cue.character === "ganjar" ? "belakang" : "meja");

// Posisi dari tata letak latar: tiap kelompok `place` diisi berurutan menurut `position`.
const buildActors = (scene: BlockScene, lay: Layout): Actor[] => {
  const cast = [...scene.cast].sort((a, b) => ORDER[a.position] - ORDER[b.position]);
  const used = { belakang: 0, meja: 0 };
  return cast.map((cue) => {
    const place = placeOf(cue);
    const i = used[place]++;
    const xs = place === "belakang" ? lay.behindX : lay.deskX;
    const base = HEIGHT[cue.character] * (place === "meja" ? PLACE_DESK * lay.deskScale : lay.behindScale);
    return { cue, x: xs[Math.min(i, xs.length - 1)], floor: place === "belakang" ? lay.behindFloor : lay.deskFloor, h: base * (cue.scale ?? 1), place };
  });
};

// ---------- Ekspresi, gerak, arah badan ----------

const speakingAt = (lines: readonly BlockLine[], who: CharacterId, t: number): boolean => lines.some((l) => l.who === who && t >= l.from && t < l.from + l.dur - 0.15);

const expressionAt = (lines: readonly BlockLine[], who: CharacterId, t: number, base: string): string => {
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

const gestureKeys = (lines: readonly BlockLine[], who: CharacterId, base: string | null | undefined): { readonly at: number; readonly gesture: Gesture }[] => {
  const perLine = lines.flatMap((l) => {
    const m = l.motions?.[who];
    return m ? [{ at: l.from + (l.motionAt?.[who] ?? 0.1), gesture: m as Gesture }] : [];
  });
  const first = lines.find((l) => l.who === who)?.from ?? 0.3;
  const events = perLine.length ? perLine : base ? [{ at: first, gesture: base as Gesture }] : [];
  return [{ at: 0, gesture: "netral" as Gesture }, ...events].sort((a, b) => a.at - b.at);
};

// Pendengar berputar ke pembicara (34 derajat), pembicara sedikit lebih ke kamera (10); berpindah 0,4 dtk tiap giliran.
const blockYaw = (lines: readonly BlockLine[], who: CharacterId, x: number, xOf: (c: CharacterId) => number | undefined, t: number): number => {
  const toward = (c: CharacterId | undefined): number => {
    const cx = c ? xOf(c) : undefined;
    return cx === undefined || cx === x ? 1 : Math.sign(cx - x);
  };
  const other = lines.find((l) => l.who !== who)?.who;
  const dir = toward(other);
  const target = (l: BlockLine): number => (l.who === who ? dir * 10 : toward(l.who) * 34);
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

const ActorView: React.FC<{ readonly actor: Actor; readonly scene: BlockScene; readonly xOf: (c: CharacterId) => number | undefined; readonly filter: string; readonly light: BlockLight }> = ({ actor, scene, xOf, filter, light }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const who = actor.cue.character;
  const talking = speakingAt(scene.lines, who, t);
  const expression = expressionAt(scene.lines, who, t, actor.cue.expression) as never;
  const gestures = gestureKeys(scene.lines, who, actor.cue.motion);
  const yaw = actor.yaw ?? blockYaw(scene.lines, who, actor.x, xOf, t);
  const pitch = actor.pitch ?? -9;
  const s = size(who, actor.h);
  // Robot dan Claude Code tidak punya mulut: badan memantul saat bicara.
  const bounce = talking && who !== "ganjar" ? Math.abs(Math.sin(t * 12)) * 6 * (actor.h / 330) : 0;
  const body =
    who === "ganjar" ? (
      <GanjarBlock height={actor.h} expression={expression} gestures={gestures} talking={talking} yaw={yaw} pitch={pitch} />
    ) : who === "robot" ? (
      <RobotBlock height={actor.h} expression={expression} gestures={gestures} yaw={yaw} pitch={pitch} />
    ) : (
      <ClaudeCodeBlock height={actor.h} expression={expression} gestures={gestures} yaw={yaw} pitch={pitch} />
    );
  return (
    <div style={{ position: "absolute", left: actor.x - s.width / 2, top: s.top(actor.floor) - bounce, filter }}>
      <BlockLightContext.Provider value={light}>{body}</BlockLightContext.Provider>
    </div>
  );
};

// Bayangan lembut berbentuk elips (koordinat layar, sesudah kamera).
const ContactShadow: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly opacity: number }> = ({ x, y, w, h, opacity }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)` }} />
);

// ---------- Shot dan kamera ----------

type Cam = { readonly fx: number; readonly fy: number; readonly z: number; readonly rot: number; readonly shake: number };
type Resolved = Cam & { readonly ax: number; readonly ay: number };
type ShotPlan = { readonly kind: ShotKind; readonly speaker: CharacterId; readonly start: number; readonly dur: number; readonly push: boolean };


const shotPlanAt = (scene: BlockScene, t: number): ShotPlan => {
  let line: BlockLine = scene.lines[0];
  for (const l of scene.lines) if (l.from <= t) line = l;
  if (!line?.shot) return { kind: "wide", speaker: line?.who ?? scene.cast[0].character, start: 0, dur: 1, push: false };
  const list = typeof line.shot === "string" ? [{ at: 0, kind: line.shot }] : [...line.shot].sort((a, b) => a.at - b.at);
  const idx = list.reduce((n, e, i) => (line.from + e.at <= t ? i : n), 0);
  const e = list[idx];
  const start = line.from + e.at;
  const end = idx + 1 < list.length ? line.from + list[idx + 1].at : line.from + line.dur;
  return { kind: e.kind, speaker: line.who, start, dur: Math.max(0.1, end - start), push: !!line.push };
};

// Badan sekotak (Robot, Claude Code) cepat terlihat miring: sudut pandangnya dikurangi.
const pitchFor = (kind: ShotKind, who: CharacterId): number | undefined => {
  const p = PITCH[kind];
  return p === undefined ? undefined : who === "ganjar" ? p : Math.round(p * 0.6);
};

// Zoom ZOOM dikalibrasi untuk tinggi acuan (HEIGHT, di meja x PLACE_DESK); karakter yang diperkecil tata letak latar mendapat zoom
// lebih besar supaya bingkai shot tetap sama rapatnya.
const camFor = (kind: ShotKind, a: Actor, wide: Cam): Cam => {
  const who = a.cue.character;
  const scale = (HEIGHT[who] * (a.place === "meja" ? PLACE_DESK : 1)) / a.h;
  const y = (part: "head" | "upper"): number => (who === "ganjar" ? a.floor - (part === "head" ? 0.69 : 0.58) * a.h : a.floor - (who === "robot" ? 0.44 : 0.38) * a.h);
  const zoom = (k: keyof typeof ZOOM): number => ZOOM[k][who] * scale;
  switch (kind) {
    case "medium":
    case "pov":
    case "lowAngle":
    case "highAngle":
      return { fx: a.x, fy: y("upper"), z: zoom("medium"), rot: 0, shake: 0 };
    case "closeUp":
      return { fx: a.x, fy: y("head"), z: zoom("closeUp"), rot: 0, shake: 0 };
    case "extremeCloseUp":
    case "reveal":
      return { fx: a.x, fy: y("head"), z: zoom("extremeCloseUp"), rot: 0, shake: kind === "extremeCloseUp" ? 3 : 0 };
    case "dutch":
      return { fx: a.x, fy: y("head"), z: zoom("closeUp") * 1.2, rot: a.x < W / 2 ? DUTCH_DEG : -DUTCH_DEG, shake: 0 };
    default:
      return wide;
  }
};

const ease = (p: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);
const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
const noise = (f: number, seed: number): number => Math.sin(f * 0.37 + seed) * 0.5 + Math.sin(f * 0.91 + seed * 2.1) * 0.3 + Math.sin(f * 1.73 + seed * 3.3) * 0.2;

// Kamera hidup: geser sangat pelan supaya lapisan berparalaks terlihat bergerak walau shot ditahan.
const camAt = (plan: ShotPlan, a: Actor, t: number, wide: Cam): Cam => {
  const p = t - plan.start;
  if (plan.kind === "reveal") {
    const k = ease((p - REVEAL_HOLD) / Math.min(REVEAL_SEC, Math.max(0.1, plan.dur - REVEAL_HOLD)));
    const c = camFor("reveal", a, wide);
    return { fx: lerp(c.fx, wide.fx, k), fy: lerp(c.fy, wide.fy, k), z: Math.exp(lerp(Math.log(c.z), Math.log(wide.z), k)), rot: 0, shake: 0 };
  }
  const c = camFor(plan.kind, a, wide);
  const z = plan.push ? c.z * (1 + PUSH * ease(p / plan.dur)) : c.z;
  return { ...c, z, fx: c.fx + 9 * Math.sin(t * 0.35), fy: c.fy + 5 * Math.sin(t * 0.27 + 1) };
};

// Tanpa putaran, geser dijepit supaya tepi kanvas tidak terlihat.
const resolveCam = (c: Cam): Resolved => {
  if (c.rot !== 0) return { ...c, ax: SCREEN.x, ay: SCREEN.y };
  const tx = Math.min(0, Math.max(W - c.z * W, SCREEN.x - c.z * c.fx));
  const ty = Math.min(0, Math.max(H - c.z * H, SCREEN.y - c.z * c.fy));
  return { ...c, ax: tx + c.z * c.fx, ay: ty + c.z * c.fy };
};
const layerCam = (c: Resolved): LayerCam => ({ tx: c.ax - c.z * c.fx, ty: c.ay - c.z * c.fy, z: c.z });
const mapActor = (a: Actor, c: Resolved): Actor => ({ ...a, x: c.ax + c.z * (a.x - c.fx), floor: c.ay + c.z * (a.floor - c.fy), h: a.h * c.z });

// Over the shoulder: kamera medium ke pembicara; pendengar tampil dari belakang, besar, di pojok bawah paling depan (di atas semua
// lapisan dunia, sedikit buram). Tinggi dan titik kepala dalam koordinat layar.
const SHOULDER = { ganjar: { h: 1400, head: 1460 }, robot: { h: 900, head: 1560 }, claudecode: { h: 790, head: 1580 } } as const;
const shoulderActor = (lis: Actor, speakerX: number): Actor => {
  const who = lis.cue.character;
  const left = speakerX > W / 2;
  const { h, head } = SHOULDER[who];
  const floor = head + (who === "ganjar" ? 0.69 : who === "robot" ? 0.44 : 0.38) * h;
  return { ...lis, x: left ? 150 : W - 150, floor, h, yaw: left ? 156 : -156, pitch: undefined };
};

export const Stage: React.FC<{ readonly scene: BlockScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const spec = SETS[scene.set];
  const lay = spec.layout;
  const wide: Cam = { ...lay.wide, rot: 0, shake: 0 };
  const world = buildActors(scene, lay);
  const xs = new Map<CharacterId, number>(world.map((a) => [a.cue.character, a.x]));
  const xOf = (c: CharacterId): number | undefined => xs.get(c);

  const plan = shotPlanAt(scene, t);
  const spk = world.find((a) => a.cue.character === plan.speaker) ?? world[0];
  let actors: readonly Actor[] = world;
  let cam: Resolved = resolveCam(wide);
  let shoulder: Actor | null = null;
  const listener = world.find((a) => a.cue.character !== plan.speaker);
  if (plan.kind === "overShoulder" && spk && listener) {
    cam = resolveCam(camAt({ ...plan, kind: "medium" }, spk, t, wide));
    const mapped = mapActor(spk, cam);
    const toward = mapped.x > W / 2 ? -20 : 20;
    actors = world.filter((a) => a !== listener).map((a) => mapActor({ ...a, yaw: a === spk ? toward : undefined }, cam));
    shoulder = shoulderActor(listener, mapped.x);
  } else if (spk) {
    cam = resolveCam(camAt(plan, spk, t, wide));
    actors = world.map((a) => mapActor({ ...a, pitch: pitchFor(plan.kind, a.cue.character), yaw: a.cue.character === plan.speaker && plan.kind === "pov" ? 0 : undefined }, cam));
  }
  const lc = layerCam(cam);
  const behind = actors.filter((a) => a.place === "belakang");
  const onDesk = actors.filter((a) => a.place === "meja");
  const view = (a: Actor): React.ReactNode => <ActorView key={a.cue.character} actor={a} scene={scene} xOf={xOf} filter={spec.filter} light={spec.light} />;

  return (
    <AbsoluteFill style={{ backgroundColor: spec.bg }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: `${SCREEN.x}px ${SCREEN.y}px`,
          transform: `translate(${cam.shake * noise(frame, 1)}px, ${cam.shake * noise(frame, 2)}px) rotate(${cam.rot + cam.shake * 0.02 * noise(frame, 3)}deg)`,
        }}
      >
        <Layer cam={lc} p={0.28}>
          <spec.Far />
        </Layer>
        <Layer cam={lc} p={0.6}>
          <spec.Mid />
        </Layer>
        {behind.map(view)}
        <Layer cam={lc} p={1}>
          <DeskTop set={scene.set} />
        </Layer>
        {/* Monitor berdiri di atas meja, di depan karakter yang berdiri di balik meja. */}
        <Layer cam={lc} p={1}>
          <Monitor screen={spec.screen} spec={spec.monitor} />
        </Layer>
        {/* Bayangan kontak: badan di tepi jauh meja dan kaki karakter di atas meja. */}
        {behind.map((a) => (
          <ContactShadow key={`sb-${a.cue.character}`} x={a.x} y={lc.ty + lc.z * DESK_TOP + 6 * lc.z} w={size(a.cue.character, a.h).width * 0.75} h={30 * lc.z} opacity={0.55} />
        ))}
        {onDesk.map((a) => (
          <ContactShadow key={`sd-${a.cue.character}`} x={a.x} y={a.floor + a.h * 0.2} w={a.h * 1.35} h={a.h * 0.16} opacity={0.6} />
        ))}
        {onDesk.map(view)}
        <Layer cam={lc} p={1}>
          <DeskFront set={scene.set} />
        </Layer>
        <Layer cam={lc} p={1.28}>
          <Foreground set={scene.set} />
        </Layer>
        {shoulder ? <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, filter: "blur(4px) brightness(0.8)" }}>{view(shoulder)}</div> : null}
      </div>
      <Lighting set={scene.set} />
    </AbsoluteFill>
  );
};
