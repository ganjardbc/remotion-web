import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { framing, type CamState } from "../../assets/camera";
import { characterFilter, LANDSCAPE_ANCHORS, landscapePoint, WorkspaceLandscape } from "../../assets/backdrops";
import { GanjarStickman, RobotStickman, ganjarStickmanSize, robotStickmanSize, type Gesture, type GanjarStickmanExpression, type RobotExpression } from "../../assets/characters";
import type { FaceKey } from "../../assets/characters/shared/props";

// Dunia tetap video Vue: ruang kerja lanskap, Ganjar duduk di depan laptop, Claude (robot) berdiri di atas meja.

const A = LANDSCAPE_ANCHORS;
const GANJAR_H = 760;
const ROBOT_H = 300;
const ROBOT_X = 1700;
const GANJAR_TOP = A.deskTop - 0.62 * GANJAR_H;
const ROBOT_TOP = A.deskTop + (25 * ROBOT_H) / 400 - ROBOT_H;

const GANJAR_HEAD = landscapePoint(A.seatX, GANJAR_TOP + 0.27 * GANJAR_H);
const GANJAR_CHEST = landscapePoint(A.seatX, GANJAR_TOP + 0.42 * GANJAR_H);
const ROBOT_FACE = landscapePoint(ROBOT_X, ROBOT_TOP + 0.42 * ROBOT_H);
const LAPTOP = landscapePoint(A.laptopX, A.deskTop - 60);

// Keadaan kamera baku di dunia ini (titik dunia 1920x1080).
export const CAM = {
  wide: framing("wide", { x: 960, y: 540 }),
  twoShot: { x: 980, y: 625, zoom: 1.3 } as CamState,
  ganjarMedium: framing("medium", GANJAR_CHEST),
  ganjarClose: framing("closeUp", GANJAR_HEAD),
  ganjarEyes: framing("extremeCloseUp", { x: GANJAR_HEAD.x, y: GANJAR_HEAD.y - 10 }),
  robotMedium: { ...ROBOT_FACE, zoom: 2.2 } as CamState,
  robotClose: framing("closeUp", ROBOT_FACE),
  laptop: { ...LAPTOP, zoom: 2.4 } as CamState,
} as const;

// Nilai berwaktu: nilai terakhir yang `from`-nya sudah lewat (detik, waktu adegan).
export type Keyed<T> = readonly { readonly from: number; readonly value: T }[];
export const pick = <T,>(keys: Keyed<T> | undefined, t: number, fallback: T): T => {
  let v = fallback;
  for (const k of keys ?? []) if (t >= k.from) v = k.value;
  return v;
};

export type Actors = {
  readonly ganjarFace: readonly FaceKey<GanjarStickmanExpression>[];
  readonly ganjarGesture?: Keyed<Gesture>;
  readonly robotFace: readonly FaceKey<RobotExpression>[];
  readonly robotGesture?: Keyed<Gesture>;
};

export type Line = {
  readonly who: "ganjar" | "robot";
  readonly from: number;
  readonly dur: number;
  // Teks yang tampil di caption.
  readonly text: string;
  // Tag audio ElevenLabs (tanpa kurung siku), mis. "sighs", "excited": hanya dikirim ke TTS, tidak tampil di caption.
  readonly tag?: string;
  // Teks yang diucapkan bila berbeda dari caption (mis. ejaan lafal).
  readonly spoken?: string;
  // Diisi voiceover.ts bila voice over untuk baris ini sudah ada: id baris dan berkas (relatif ke public/).
  readonly id?: string;
  readonly vo?: string;
};

export const speaking = (lines: readonly Line[], who: Line["who"], t: number): boolean => lines.some((l) => l.who === who && t >= l.from && t < l.from + l.dur - 0.25);

export const VueWorld: React.FC<{ readonly time: number; readonly actors: Actors; readonly lines: readonly Line[] }> = ({ time, actors, lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = ganjarStickmanSize(GANJAR_H);
  const r = robotStickmanSize(ROBOT_H);
  return (
    <WorkspaceLandscape
      time={time}
      behindDesk={
        <div style={{ position: "absolute", left: 0, top: 0, width: 2743, height: A.deskTop + 60, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: A.seatX - g.width / 2, top: GANJAR_TOP, filter: characterFilter(time) }}>
            <GanjarStickman height={GANJAR_H} face={actors.ganjarFace} gesture={pick(actors.ganjarGesture, t, "netral")} talking={speaking(lines, "ganjar", t)} hair headphones={false} />
          </div>
        </div>
      }
      onDesk={
        <div style={{ position: "absolute", left: ROBOT_X - r.width / 2, top: ROBOT_TOP - (speaking(lines, "robot", t) ? Math.abs(Math.sin(t * 12)) * 7 : 0), filter: characterFilter(time) }}>
          <RobotStickman height={ROBOT_H} face={actors.robotFace} gesture={pick(actors.robotGesture, t, "netral")} />
        </div>
      }
    />
  );
};
