import type React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { InsertCard, PictureInPicture, ShotCamera, SplitScreen, Vignette, type Corner, type CamState, type Shot } from "../../assets/camera";
import type { TimeOfDay } from "../../assets/backdrops";
import { Caption, ChapterBadge } from "./cards";
import type { SfxCue } from "./sfxTypes";
import { VueWorld, type Actors, type Line } from "./world";

// Satu sisipan di atas dunia: layar penuh, panel terbelah (dunia di kiri, isi di kanan), atau gelembung di sudut.
export type Insert = {
  readonly from: number;
  readonly dur: number;
  readonly layout: "full" | "split" | "pip";
  // Isi sisipan; `"world"` = bidikan kedua dari dunia (untuk `pip`), memakai `camera`.
  readonly content: React.ReactNode | "world";
  // Kamera panel dunia (kiri pada split, atau isi pip bila content = "world").
  readonly camera?: CamState;
  readonly ratio?: number;
  readonly corner?: Corner;
  readonly pip?: { readonly width: number; readonly height: number };
  readonly inset?: number;
  // Saat isi sisipan benar-benar mengetik (detik, waktu sisipan): dasar efek suara ketikan.
  readonly typing?: readonly { readonly at: number; readonly dur: number }[];
};

export type SceneSpec = {
  readonly id: string;
  readonly title: string;
  readonly seconds: number;
  // Waktu hari dunia: nama, angka 0..1, atau [dari, ke] yang bergeser selama scene.
  readonly time: TimeOfDay | number | readonly [number, number];
  readonly shots: readonly Shot[];
  readonly actors: Actors;
  readonly lines: readonly Line[];
  readonly inserts: readonly Insert[];
  // Efek suara khusus (di luar pop dialog, ketikan, dan whoosh sisipan yang dibuat otomatis).
  readonly cues?: readonly SfxCue[];
};

const W = 1920;
const H = 1080;
const GAP = 8;
const DEFAULT_PANEL_CAM: CamState = { x: 980, y: 625, zoom: 1.3 };

const still = (camera: CamState): readonly Shot[] => [{ from: 0, dur: 999, start: camera }];

export const SceneRenderer: React.FC<{ readonly spec: SceneSpec; readonly index: number }> = ({ spec, index }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const time = Array.isArray(spec.time) ? interpolate(frame, [0, durationInFrames - 1], spec.time as [number, number]) : (spec.time as TimeOfDay | number);
  const line = spec.lines.find((l) => t >= l.from && t < l.from + l.dur) ?? null;
  const world = <VueWorld time={typeof time === "string" ? 0 : time} actors={spec.actors} lines={spec.lines} />;
  // Dunia di dalam sisipan harus memakai waktu adegan, bukan waktu sisipan: geser frame mundur sebesar awal sisipan.
  const worldAt = (ins: Insert, node: React.ReactNode): React.ReactNode => (
    <Sequence from={-Math.round(ins.from * fps)} layout="none">
      {node}
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShotCamera shots={spec.shots}>{world}</ShotCamera>
      {spec.inserts.map((ins) => {
        const camera = ins.camera ?? DEFAULT_PANEL_CAM;
        let node: React.ReactNode;
        if (ins.layout === "full") {
          node = <InsertCard inset={ins.inset}>{ins.content}</InsertCard>;
        } else if (ins.layout === "split") {
          const lw = Math.round((W - GAP) * (ins.ratio ?? 0.5));
          node = (
            <SplitScreen
              width={W}
              height={H}
              ratio={ins.ratio ?? 0.5}
              left={worldAt(ins, <ShotCamera shots={still(camera)} width={lw} height={H}>{world}</ShotCamera>)}
              right={ins.content}
            />
          );
        } else {
          const pw = ins.pip?.width ?? 560;
          const ph = ins.pip?.height ?? 420;
          node = (
            <PictureInPicture
              width={W}
              height={H}
              pipWidth={pw}
              pipHeight={ph}
              corner={ins.corner ?? "topRight"}
              pip={ins.content === "world" ? worldAt(ins, <ShotCamera shots={still(camera)} width={pw} height={ph}>{world}</ShotCamera>) : ins.content}
            >
              {null}
            </PictureInPicture>
          );
        }
        return (
          <Sequence key={`${ins.from}-${ins.layout}`} from={Math.round(ins.from * fps)} durationInFrames={Math.round(ins.dur * fps)} layout="none">
            {node}
          </Sequence>
        );
      })}
      <Vignette strength={0.25} />
      <ChapterBadge index={index + 1} title={spec.title} />
      <Caption line={line} />
    </AbsoluteFill>
  );
};
