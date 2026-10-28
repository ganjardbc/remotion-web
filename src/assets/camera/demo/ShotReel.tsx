import type React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { ContactShadow, PlainBack } from "../../backdrops";
import { GanjarStickman, RobotStickman, ganjarStickmanSize, robotStickmanSize, type Gesture } from "../../characters";
import { activeShot, framing, type Shot } from "../camera";
import { InsertCard, PictureInPicture, SplitScreen, Vignette } from "../layouts";
import { ShotCamera } from "../ShotCamera";

// Contoh semua jenis bidikan kamera 2D pada satu dunia berisi Ganjar dan Robot (stickman).
// Bagian A = 12 bidikan di dunia yang berjalan terus; B sampai D = split screen, gambar dalam gambar, dan sisipan layar.

const W = 1920;
const H = 1080;
const FLOOR_Y = 800;
const GANJAR_H = 620;
const ROBOT_H = 330;
const GANJAR_X = 640;
const ROBOT_X = 1300;
const ANCHORS = { floorY: FLOOR_Y, spotX: 960 } as const;

// Titik subjek di dunia (piksel), dipakai sebagai pusat bidikan.
const GANJAR_FACE = { x: GANJAR_X, y: 405 };
const GANJAR_CHEST = { x: GANJAR_X, y: 500 };
const GANJAR_EYES = { x: GANJAR_X, y: 395 };
const ROBOT_FACE = { x: ROBOT_X, y: 610 };

// ---------- dunia ----------

const Characters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g = ganjarStickmanSize(GANJAR_H);
  const r = robotStickmanSize(ROBOT_H);
  const talking = (t >= 4 && t < 10) || (t >= 19 && t < 21);
  const ganjarGesture: Gesture = t < 2 ? "lambai" : t >= 12 && t < 15 ? "tunjuk" : t >= 21.5 && t < 24 ? "facepalm" : "netral";
  const robotGesture: Gesture = t >= 17 && t < 19 ? "lambai" : t >= 23.5 ? "sorak" : "netral";
  return (
    <>
      <ContactShadow x={GANJAR_X} y={FLOOR_Y} width={420} />
      <ContactShadow x={ROBOT_X} y={FLOOR_Y} width={300} />
      <div style={{ position: "absolute", left: GANJAR_X - g.width / 2, top: FLOOR_Y - GANJAR_H * 0.91 }}>
        <GanjarStickman
          height={GANJAR_H}
          face={[
            { at: 0, expression: "senyum" },
            { at: 21, expression: "kaget" },
            { at: 22.3, expression: "marah" },
            { at: 24, expression: "senyum" },
          ]}
          talking={talking}
          gesture={ganjarGesture}
          hair
          headphones={false}
        />
      </div>
      <div style={{ position: "absolute", left: ROBOT_X - r.width / 2, top: FLOOR_Y - ROBOT_H + (25 * ROBOT_H) / 400 }}>
        <RobotStickman
          height={ROBOT_H}
          face={[
            { at: 0, expression: "netral" },
            { at: 17, expression: "kaget" },
            { at: 18.5, expression: "senang" },
          ]}
          gesture={robotGesture}
        />
      </div>
    </>
  );
};

// Latar polos plus bingkai gambar, rak, dan titik-titik di dinding, supaya blur rack focus terlihat.
const Background: React.FC = () => (
  <AbsoluteFill>
    <PlainBack anchors={ANCHORS} time="siang" />
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: FLOOR_Y, backgroundImage: "radial-gradient(rgba(35,37,64,0.10) 3px, transparent 3px)", backgroundSize: "60px 60px" }} />
    {[
      { x: 150, y: 130, w: 230, h: 170, c: "#9fc5ee" },
      { x: 430, y: 170, w: 130, h: 130, c: "#f4b87a" },
      { x: 1400, y: 110, w: 280, h: 190, c: "#a6d9b4" },
      { x: 1740, y: 190, w: 110, h: 110, c: "#e9a0a0" },
    ].map((f) => (
      <div key={f.x} style={{ position: "absolute", left: f.x, top: f.y, width: f.w, height: f.h, background: f.c, border: "10px solid #fff", boxShadow: "0 6px 16px rgba(0,0,0,0.15)", boxSizing: "border-box" }} />
    ))}
    <div style={{ position: "absolute", left: 760, top: 300, width: 420, height: 14, background: "#b9976b" }} />
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{ position: "absolute", left: 790 + i * 76, top: 214, width: 52, height: 86, background: ["#e5484d", "#4f46e5", "#42b883", "#f6b73c", "#2b9bd6"][i] }} />
    ))}
  </AbsoluteFill>
);

// ---------- bagian A: 12 bidikan ----------

const SHOTS: readonly Shot[] = [
  { from: 0, dur: 2, start: framing("wide", { x: W / 2, y: H / 2 }), label: "Wide (establishing)" },
  { from: 2, dur: 2, start: framing("medium", GANJAR_CHEST), label: "Medium" },
  { from: 4, dur: 2, start: framing("closeUp", GANJAR_FACE), label: "Close-up" },
  { from: 6, dur: 1.5, start: framing("extremeCloseUp", GANJAR_EYES), label: "Extreme close-up" },
  { from: 7.5, dur: 2.5, start: framing("medium", GANJAR_CHEST), end: framing("closeUp", GANJAR_FACE), label: "Push-in" },
  { from: 10, dur: 2.5, start: framing("closeUp", GANJAR_FACE), end: framing("wide", { x: W / 2, y: H / 2 }), label: "Pull-out" },
  { from: 12.5, dur: 2.5, start: { x: GANJAR_X, y: 480, zoom: 2 }, end: { x: ROBOT_X, y: 600, zoom: 2 }, label: "Pan" },
  { from: 15, dur: 2, start: { x: GANJAR_X, y: 720, zoom: 2 }, end: { x: GANJAR_X, y: 420, zoom: 2 }, transitionOut: "whip", label: "Tilt" },
  { from: 17, dur: 2, start: { x: ROBOT_X, y: 600, zoom: 2.2 }, transitionIn: "whip", label: "Whip pan" },
  { from: 19, dur: 2, start: framing("medium", GANJAR_CHEST), shake: 6, label: "Handheld" },
  { from: 21, dur: 2.5, start: framing("closeUp", GANJAR_FACE, 7), shake: 9, transitionIn: "punch", label: "Dutch tilt + goyang (momen error)" },
  { from: 23.5, dur: 2.5, start: { x: ROBOT_X, y: 600, zoom: 2.2 }, blurBg: [0, 16], label: "Rack focus (latar blur)" },
];

const A_SECONDS = 26;

const ShotLabel: React.FC<{ readonly text: string; readonly note?: string; readonly bottom?: boolean }> = ({ text, note, bottom }) => (
  <div style={{ position: "absolute", left: 32, ...(bottom ? { bottom: 24 } : { top: 28 }), fontFamily: "monospace", color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
    <div style={{ fontWeight: 700, fontSize: 38, background: "rgba(15,16,32,0.72)", padding: "8px 18px", borderRadius: 10, textShadow: "none" }}>{text}</div>
    {note && <div style={{ marginTop: 8, fontSize: 24 }}>{note}</div>}
  </div>
);

const PartA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = activeShot(SHOTS, frame, fps);
  return (
    <AbsoluteFill>
      <ShotCamera shots={SHOTS} background={<Background />}>
        <Characters />
      </ShotCamera>
      <Vignette />
      <ShotLabel text={`${a.index + 1}/${SHOTS.length}  ${a.shot.label ?? ""}`} />
    </AbsoluteFill>
  );
};

// ---------- bagian B sampai D: tata letak ----------

const still = (state: Shot["start"]): readonly Shot[] => [{ from: 0, dur: 99, start: state }];

const CodeCard: React.FC<{ readonly title: string; readonly lines: readonly string[] }> = ({ title, lines }) => (
  <div style={{ width: "100%", height: "100%", background: "#1b1d2b", color: "#e6e9f5", fontFamily: "monospace", padding: 40, boxSizing: "border-box" }}>
    <div style={{ fontSize: 26, color: "#8a90b4", marginBottom: 24 }}>{title}</div>
    {lines.map((l, i) => (
      <div key={i} style={{ fontSize: 34, lineHeight: 1.6, whiteSpace: "pre", color: l.startsWith("//") ? "#7e86ad" : l.includes("ref") ? "#42b883" : "#e6e9f5" }}>
        {l}
      </div>
    ))}
  </div>
);

const Plain: React.FC<{ readonly state: Shot["start"]; readonly width: number; readonly height: number }> = ({ state, width, height }) => (
  <ShotCamera shots={still(state)} width={width} height={height} background={<Background />}>
    <Characters />
  </ShotCamera>
);

const PartSplit: React.FC = () => (
  <AbsoluteFill>
    <SplitScreen
      width={W}
      height={H}
      ratio={0.5}
      left={<Plain state={framing("medium", GANJAR_CHEST)} width={956} height={H} />}
      right={<CodeCard title="App.vue" lines={["<script setup>", "import { ref } from 'vue'", "const count = ref(0)", "</script>", "", "<template>", "  <button @click=\"count++\">", "    {{ count }}", "  </button>", "</template>"]} />}
    />
    <ShotLabel text="Split screen" note="Karakter di kiri, kode di kanan" />
  </AbsoluteFill>
);

const PartPip: React.FC = () => (
  <AbsoluteFill>
    <PictureInPicture
      width={W}
      height={H}
      pipWidth={520}
      pipHeight={520}
      corner="bottomRight"
      pip={<Plain state={framing("closeUp", ROBOT_FACE)} width={520} height={520} />}
    >
      <Plain state={framing("wide", { x: W / 2, y: H / 2 })} width={W} height={H} />
    </PictureInPicture>
    <ShotLabel text="Picture-in-picture" note="Bidikan reaksi di sudut" />
  </AbsoluteFill>
);

const PartInsert: React.FC = () => (
  <AbsoluteFill>
    <Plain state={framing("medium", GANJAR_CHEST)} width={W} height={H} />
    <Sequence from={30} layout="none">
      <InsertCard inset={70}>
        <CodeCard title="terminal" lines={["$ npm create vue@latest", "", "✔ Project name: my-vue-app", "✔ Add TypeScript? No", "✔ Add Router? Yes", "", "$ cd my-vue-app && npm install"]} />
      </InsertCard>
    </Sequence>
    <ShotLabel text="Insert / cut-in" note="Layar terminal memenuhi frame" bottom />
  </AbsoluteFill>
);

const B = 2.5;
const C = 3;
const D = 3.5;

export const SHOT_REEL_FRAMES = Math.round((A_SECONDS + B + C + D) * 30);

export const ShotReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const a = A_SECONDS * fps;
  const b = B * fps;
  const c = C * fps;
  const d = D * fps;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={a}>
        <PartA />
      </Sequence>
      <Sequence from={a} durationInFrames={b}>
        <PartSplit />
      </Sequence>
      <Sequence from={a + b} durationInFrames={c}>
        <PartPip />
      </Sequence>
      <Sequence from={a + b + c} durationInFrames={d}>
        <PartInsert />
      </Sequence>
    </AbsoluteFill>
  );
};
