import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evalLook, type LookKey } from "../shared/look";
import {
  EXPRESSIONS,
  FLOOR_Y,
  GANJAR_VIEWBOX,
  GanjarRig,
  evalFace,
  evalGanjar,
  type FaceKey,
  type GanjarExpression,
  type PlacedClip,
} from "./rig";

export const GANJAR_EXPRESSIONS = Object.keys(EXPRESSIONS) as readonly GanjarExpression[];

// Kepala dan bahu saja, untuk thumbnail atau lembar referensi.
const BUST_BOX = { x: -250, y: -30, w: 500, h: 520 } as const;

export type GanjarProps = {
  // Lebar kotak viewBox penuh (840 unit) dalam px. Karakter sendiri sekitar setengahnya.
  readonly width?: number;
  readonly expression?: GanjarExpression;
  // Ganti ekspresi pada waktu tertentu (detik); menimpa `expression` setelah entri pertama.
  readonly face?: readonly FaceKey[];
  readonly clips?: readonly PlacedClip[];
  // Mulut bergerak (bicara), menimpa bukaan mulut ekspresi.
  readonly talking?: boolean;
  // 0 = berdiri, 1 = duduk di kursi (kaki tetap di lantai).
  readonly sit?: number;
  // Arah pandang berwaktu: kepala dan badan menoleh ke lawan bicara atau objek.
  readonly look?: readonly LookKey[];
  readonly bust?: boolean;
  readonly style?: React.CSSProperties;
};

export const ganjarSize = (width: number): { width: number; height: number; floorGap: number } => {
  const scale = width / GANJAR_VIEWBOX.w;
  return {
    width,
    height: GANJAR_VIEWBOX.h * scale,
    floorGap: (GANJAR_VIEWBOX.y + GANJAR_VIEWBOX.h - FLOOR_Y) * scale,
  };
};

export const Ganjar: React.FC<GanjarProps> = ({
  width = 340,
  expression = "netral",
  face,
  clips = [],
  talking = false,
  sit = 0,
  look = [],
  bust = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keys = face ?? [{ at: -1, expression }];
  const state = evalFace(frame, fps, keys);
  const mouth = talking ? { mouthOpen: Math.abs(Math.sin((frame / fps) * 11)) * 0.8 } : null;
  const vb = bust ? BUST_BOX : GANJAR_VIEWBOX;
  const base = evalGanjar(frame, clips);
  const gaze = evalLook(frame, fps, look);
  const pose = {
    ...base,
    sit: base.sit + sit,
    head: { ...base.head, turn: base.head.turn + gaze.turn, rot: base.head.rot + gaze.tilt },
    torso: { ...base.torso, rot: base.torso.rot + gaze.turn * 0.8 },
  };
  return (
    <svg
      width={width}
      height={(width * vb.h) / vb.w}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <GanjarRig pose={pose} face={{ ...state, ...mouth }} />
    </svg>
  );
};
