import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserMock, CounterApp } from "../BrowserMock";
import { CodeEditor } from "../CodeEditor";
import { FileTree, type TreeNode } from "../FileTree";
import { LaptopFromBehind } from "../LaptopFromBehind";
import { Terminal, type TermLine } from "../Terminal";

const TERM: readonly TermLine[] = [
  { at: 0.3, kind: "cmd", text: "npm create vue@latest", speed: 16 },
  { at: 2.0, kind: "dim", text: "Need to install create-vue@3.10.0. Ok to proceed? (y)" },
  { at: 2.6, kind: "ok", text: "✔ Project name: my-vue-app" },
  { at: 3.1, kind: "ok", text: "✔ Add TypeScript? No" },
  { at: 3.6, kind: "ok", text: "✔ Add Vue Router? Yes" },
  { at: 4.4, kind: "cmd", text: "cd my-vue-app && npm install", speed: 18 },
  { at: 6.2, kind: "out", text: "added 38 packages in 4s" },
];

const CODE = `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">
    count is {{ count }}
  </button>
</template>`;

const TREE: readonly TreeNode[] = [
  { name: "node_modules", depth: 0, kind: "dir", at: 0.3 },
  { name: "public", depth: 0, kind: "dir", at: 0.6 },
  { name: "src", depth: 0, kind: "dir", at: 0.9, highlightAt: 4, highlightUntil: 7 },
  { name: "assets", depth: 1, kind: "dir", at: 1.2 },
  { name: "components", depth: 1, kind: "dir", at: 1.5 },
  { name: "App.vue", depth: 1, kind: "file", at: 1.8, highlightAt: 5.5, highlightUntil: 8 },
  { name: "main.js", depth: 1, kind: "file", at: 2.1 },
  { name: "index.html", depth: 0, kind: "file", at: 2.4 },
  { name: "package.json", depth: 0, kind: "file", at: 2.7 },
  { name: "vite.config.js", depth: 0, kind: "file", at: 3.0 },
];

const Panel: React.FC<{ readonly label: string; readonly children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
    {children}
    <div style={{ position: "absolute", right: 14, bottom: 10, fontFamily: "monospace", fontWeight: 700, fontSize: 22, color: "#fff", background: "rgba(15,16,32,0.7)", padding: "4px 12px", borderRadius: 8 }}>{label}</div>
  </div>
);

export const SCREENS_DEMO_FRAMES = 9 * 30;

// Empat aset layar sekaligus: Terminal (ketikan), CodeEditor (ketikan dan sorotan baris), BrowserMock (counter hidup), FileTree.
export const ScreensDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "#0f1020", padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 24 }}>
    <Panel label="Terminal">
      <Terminal lines={TERM} fontSize={28} />
    </Panel>
    <Panel label="CodeEditor">
      <CodeEditor code={CODE} fontSize={26} typeCps={26} highlights={[{ from: 4, to: 4, at: 5.2, until: 7 }, { from: 8, to: 10, at: 7, until: 9 }]} />
    </Panel>
    <Panel label="BrowserMock + counter">
      <BrowserMock fontSize={26}>
        <CounterApp clicks={[2, 3.2, 4.1, 5.5, 6.2]} scale={0.8} />
      </BrowserMock>
    </Panel>
    <Panel label="FileTree">
      <FileTree nodes={TREE} fontSize={25} />
    </Panel>
  </AbsoluteFill>
);

export const LAPTOP_BEHIND_FRAMES = 5 * 30;

// Bidikan dari belakang tangan: kamera mengitari laptop dari 30° ke 18°, terminal mengetik di layar.
export const LaptopBehindDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const yaw = interpolate(frame, [0, durationInFrames - 1], [-30, -18]);
  return (
    <AbsoluteFill>
      <LaptopFromBehind yaw={yaw} screen={<Terminal lines={TERM} fontSize={30} />} />
    </AbsoluteFill>
  );
};
