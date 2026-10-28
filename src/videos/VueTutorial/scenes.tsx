import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Shot } from "../../assets/camera";
import { BrowserMock, CodeEditor, CounterApp, FileTree, LaptopFromBehind, Terminal, type TermLine, type TreeNode } from "../../assets/screens";
import { ButtonsApp, ErrorPage, InfoCard, TitleCard } from "./cards";
import type { SceneSpec } from "./SceneRenderer";
import { CAM } from "./world";

// 12 scene video "Cara Install & Menggunakan Vue JS" (±3 menit). Setiap scene = data: dialog, ekspresi, bidikan kamera,
// dan sisipan layar. Waktu di dalam scene dalam detik; waktu di dalam sisipan dihitung dari awal sisipan itu.

// Laptop dari belakang tangan; kamera mengitari dari `from` ke `to` derajat selama sisipan.
const Behind: React.FC<{ readonly lines: readonly TermLine[]; readonly from?: number; readonly to?: number }> = ({ lines, from = -30, to = -18 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <LaptopFromBehind yaw={interpolate(frame, [0, durationInFrames - 1], [from, to])} screen={<Terminal lines={lines} fontSize={32} />} />;
};

// Jendela ketikan (detik, waktu sisipan) dari isi sisipan: baris `cmd` terminal, atau kode yang diketik editor.
const termTyping = (lines: readonly TermLine[]): { at: number; dur: number }[] => lines.filter((l) => l.kind === "cmd").map((l) => ({ at: l.at, dur: l.text.length / (l.speed ?? 22) }));
const codeTyping = (code: string, cps: number, start: number): { at: number; dur: number }[] => [{ at: start, dur: code.length / cps }];

const shot = (from: number, dur: number, start: Shot["start"], extra: Partial<Shot> = {}): Shot => ({ from, dur, start, ...extra });

const NODE_CHECK: readonly TermLine[] = [
  { at: 0.6, kind: "cmd", text: "node -v", speed: 8 },
  { at: 1.9, kind: "out", text: "v20.11.0" },
  { at: 3.0, kind: "cmd", text: "npm -v", speed: 8 },
  { at: 4.2, kind: "out", text: "10.2.4" },
  { at: 5.4, kind: "ok", text: "✔ Siap lanjut!" },
];

const CREATE_CMD: readonly TermLine[] = [
  { at: 0.5, kind: "cmd", text: "npm create vue@latest", speed: 9 },
  { at: 3.0, kind: "dim", text: "Need to install create-vue@latest" },
  { at: 3.3, kind: "out", text: "Ok to proceed? (y) y" },
];

const CREATE_PROMPTS: readonly TermLine[] = [
  { at: 0.3, kind: "dim", text: "Vue.js - The Progressive JavaScript Framework" },
  { at: 2.6, kind: "ok", text: "✔ Project name: my-vue-app" },
  { at: 3.6, kind: "ok", text: "✔ Add TypeScript? No" },
  { at: 4.6, kind: "ok", text: "✔ Add Vue Router? Yes" },
  { at: 5.6, kind: "ok", text: "✔ Add Pinia? No" },
  { at: 6.4, kind: "dim", text: "Scaffolding project in ./my-vue-app..." },
  { at: 7.2, kind: "out", text: "Done. Now run:" },
  { at: 7.8, kind: "cmd", text: "cd my-vue-app", speed: 20 },
  { at: 8.5, kind: "cmd", text: "npm install", speed: 20 },
];

const DEV_SERVER: readonly TermLine[] = [
  { at: 0.3, kind: "cmd", text: "npm run dev", speed: 12 },
  { at: 1.5, kind: "out", text: "  VITE v5.0.0  ready in 312 ms" },
  { at: 2.0, kind: "ok", text: "  ➜  Local:   http://localhost:5173/" },
];

const CODE_SFC = `<script setup>
import { ref } from 'vue'

const pesan = ref('Halo Vue!')
</script>

<template>
  <h1>{{ pesan }}</h1>
</template>

<style scoped>
h1 { color: #42b883; }
</style>`;

const CODE_COUNTER = `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">
    count is {{ count }}
  </button>
</template>`;

const CODE_PROPS = `<script setup>
defineProps({
  label: String,
  start: Number
})
</script>

<template>
  <button>{{ label }}</button>
</template>`;

const TREE: readonly TreeNode[] = [
  { name: "node_modules", depth: 0, kind: "dir", at: 0.3 },
  { name: "public", depth: 0, kind: "dir", at: 0.6 },
  { name: "src", depth: 0, kind: "dir", at: 0.9, highlightAt: 3, highlightUntil: 6.4 },
  { name: "assets", depth: 1, kind: "dir", at: 1.2 },
  { name: "components", depth: 1, kind: "dir", at: 1.5 },
  { name: "App.vue", depth: 1, kind: "file", at: 1.8, highlightAt: 6.6, highlightUntil: 10 },
  { name: "main.js", depth: 1, kind: "file", at: 2.1 },
  { name: "index.html", depth: 0, kind: "file", at: 2.4 },
  { name: "package.json", depth: 0, kind: "file", at: 2.7 },
  { name: "vite.config.js", depth: 0, kind: "file", at: 3.0 },
];

export const SCENES: readonly SceneSpec[] = [
  // 1. Hook
  {
    id: "hook",
    title: "Masalahnya",
    seconds: 12,
    time: 0,
    shots: [
      shot(0, 3, CAM.wide),
      shot(3, 3, CAM.wide, { end: CAM.ganjarMedium }),
      shot(6, 2, CAM.ganjarClose),
      shot(8, 2.5, CAM.ganjarMedium, { end: CAM.robotMedium }),
      shot(10.5, 1.5, CAM.robotMedium),
    ],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 1, expression: "bingung" }, { at: 4.8, expression: "mikir" }, { at: 8, expression: "senang" }],
      ganjarGesture: [{ from: 4.8, value: "garukKepala" }, { from: 7.6, value: "netral" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 7.6, expression: "senang" }],
      robotGesture: [{ from: 7.6, value: "lambai" }, { from: 9.8, value: "netral" }],
    },
    lines: [
      { who: "ganjar", from: 0.4, dur: 4.2, text: "Aduh... React, Angular, Svelte. Framework JavaScript banyak banget!" },
      { who: "ganjar", from: 4.8, dur: 2.6, text: "Aku harus mulai dari mana, ya?" },
      { who: "robot", from: 7.6, dur: 4.2, text: "Tenang, Ganjar. Mulai aja dari Vue." },
    ],
    cues: [{ at: 4.8, event: "boing", volume: 0.4 }],
    inserts: [],
  },
  // 2. Apa itu Vue
  {
    id: "apa-itu-vue",
    title: "Apa itu Vue?",
    seconds: 15,
    time: 0,
    shots: [shot(0, 15, CAM.twoShot, { end: { ...CAM.twoShot, zoom: 1.5 } })],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 10.6, expression: "mikir" }, { at: 13.6, expression: "senang" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 13.6, expression: "senang" }],
      robotGesture: [{ from: 0.4, value: "tunjuk" }, { from: 6, value: "netral" }, { from: 13.6, value: "sorak" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 5.5, text: "Vue itu framework JavaScript progresif untuk membangun antarmuka web." },
      { who: "robot", from: 6.2, dur: 4, text: "Gampang dipelajari dan bisa dipakai bertahap." },
      { who: "ganjar", from: 10.6, dur: 3, text: "Jadi nggak perlu belajar semuanya sekaligus?" },
      { who: "robot", from: 13.6, dur: 1.3, text: "Betul!" },
    ],
    cues: [{ at: 1.8, event: "ding", volume: 0.3 }, { at: 6.6, event: "ding", volume: 0.3 }, { at: 8.2, event: "ding", volume: 0.3 }],
    inserts: [
      {
        from: 1,
        dur: 13,
        layout: "split",
        camera: CAM.twoShot,
        content: <InfoCard title="Vue JS" items={[{ text: "Framework progresif", at: 0.8 }, { text: "Mudah dipelajari", at: 5.6 }, { text: "Bisa dipakai bertahap", at: 7.2 }]} fontSize={40} />,
      },
    ],
  },
  // 3. Prasyarat
  {
    id: "prasyarat",
    title: "Prasyarat",
    seconds: 15,
    time: 0,
    shots: [shot(0, 3, CAM.twoShot), shot(3, 4, CAM.ganjarMedium), shot(7, 4, CAM.robotMedium), shot(11, 4, CAM.ganjarMedium, { end: CAM.laptop })],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 4, expression: "mikir" }, { at: 7.2, expression: "senang" }],
      ganjarGesture: [{ from: 7.8, value: "mengetik" }, { from: 11.4, value: "netral" }],
      robotFace: [{ at: 0, expression: "netral" }],
      robotGesture: [{ from: 0.4, value: "tunjuk" }, { from: 3.8, value: "netral" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 3.4, text: "Sebelum mulai, pastikan Node.js sudah terpasang." },
      { who: "ganjar", from: 4, dur: 3, text: "Cek lewat terminal, kan?" },
      { who: "robot", from: 7.2, dur: 2.6, text: "Betul. Ketik node -v." },
      { who: "robot", from: 11.2, dur: 3.6, text: "Kalau muncul nomor versi, kita siap lanjut." },
    ],
    cues: [{ at: 12.8, event: "ding", volume: 0.35 }],
    inserts: [{ from: 7.4, dur: 7.4, layout: "full", typing: termTyping(NODE_CHECK), content: <Behind lines={NODE_CHECK} /> }],
  },
  // 4. Install
  {
    id: "install",
    title: "Install Vue",
    seconds: 25,
    time: 0,
    shots: [
      shot(0, 3.6, CAM.twoShot),
      shot(3.6, 2.8, CAM.ganjarMedium),
      shot(6.4, 3, CAM.robotMedium),
      shot(19.5, 5.5, CAM.ganjarMedium, { end: CAM.ganjarClose }),
    ],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 3.6, expression: "mikir" }, { at: 19.5, expression: "senang" }, { at: 22.4, expression: "senyumSantai" }],
      ganjarGesture: [{ from: 6.8, value: "mengetik" }, { from: 9.6, value: "netral" }, { from: 17.6, value: "mengetik" }, { from: 19.5, value: "netral" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 22.4, expression: "senang" }],
      robotGesture: [{ from: 6.4, value: "tunjuk" }, { from: 13, value: "netral" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 3, text: "Sekarang kita buat proyek barunya." },
      { who: "ganjar", from: 3.6, dur: 2.6, text: "Pakai perintah apa?" },
      { who: "robot", from: 6.4, dur: 4.2, text: "npm create vue@latest, lalu jawab beberapa pertanyaan." },
      { who: "robot", from: 13, dur: 5, text: "Nama proyek, TypeScript, Router... jawab sesuai kebutuhan." },
      { who: "ganjar", from: 19.5, dur: 2.6, text: "Gampang juga!" },
      { who: "robot", from: 22.4, dur: 2.4, text: "Lanjut install dependensinya." },
    ],
    cues: [{ at: 12.5, event: "pop_claude", volume: 0.3 }, { at: 13.5, event: "pop_claude", volume: 0.3 }, { at: 14.5, event: "pop_claude", volume: 0.3 }, { at: 15.5, event: "pop_claude", volume: 0.3 }],
    inserts: [
      { from: 6.4, dur: 3.5, layout: "full", typing: termTyping(CREATE_CMD), content: <Behind lines={CREATE_CMD} /> },
      { from: 9.9, dur: 9.6, layout: "full", typing: termTyping(CREATE_PROMPTS), content: <Terminal fontSize={42} lines={CREATE_PROMPTS} /> },
    ],
  },
  // 5. Struktur proyek
  {
    id: "struktur",
    title: "Struktur Proyek",
    seconds: 12,
    time: 0,
    shots: [shot(0, 12, CAM.twoShot)],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }],
      robotFace: [{ at: 0, expression: "netral" }],
      robotGesture: [{ from: 3.8, value: "tunjuk" }, { from: 7.4, value: "angkatTangan" }, { from: 10.4, value: "netral" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 3.2, text: "Ini struktur proyeknya." },
      { who: "robot", from: 3.8, dur: 3.4, text: "Folder src adalah tempat kodemu." },
      { who: "robot", from: 7.4, dur: 3, text: "App.vue adalah komponen utama." },
    ],
    cues: [{ at: 3.8, event: "pop_claude", volume: 0.35 }, { at: 7.4, event: "pop_claude", volume: 0.35 }],
    inserts: [{ from: 0.8, dur: 10.7, layout: "split", camera: { x: 1000, y: 640, zoom: 1.4 }, content: <FileTree nodes={TREE} fontSize={34} /> }],
  },
  // 6. Dev server
  {
    id: "dev-server",
    title: "Jalankan Dev Server",
    seconds: 10,
    time: 0,
    shots: [shot(0, 4, CAM.ganjarMedium), shot(4, 6, CAM.laptop, { end: CAM.ganjarMedium, transitionIn: "whip" })],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 3.6, expression: "mikir" }, { at: 7, expression: "tertawa" }],
      ganjarGesture: [{ from: 0.4, value: "mengetik" }, { from: 3.6, value: "netral" }, { from: 7, value: "sorak" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 7, expression: "senang" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 3, text: "Jalankan dengan npm run dev." },
      { who: "ganjar", from: 3.6, dur: 2.4, text: "Buka localhost:5173!" },
      { who: "ganjar", from: 7, dur: 2.6, text: "Muncul! Hello Vue!" },
    ],
    cues: [{ at: 2.8, event: "ding", volume: 0.4 }],
    inserts: [
      { from: 0.8, dur: 3.4, layout: "full", typing: termTyping(DEV_SERVER), content: <Terminal fontSize={44} lines={DEV_SERVER} /> },
      { from: 4.6, dur: 5.4, layout: "full", content: <BrowserMock fontSize={34}><CounterApp scale={1.3} /></BrowserMock> },
    ],
  },
  // 7. Komponen SFC
  {
    id: "sfc",
    title: "Komponen SFC",
    seconds: 20,
    time: [0, 0.15],
    shots: [shot(0, 20, CAM.twoShot)],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 17, expression: "senang" }],
      robotFace: [{ at: 0, expression: "netral" }],
      robotGesture: [{ from: 0.4, value: "tunjuk" }, { from: 5, value: "angkatTangan" }, { from: 9, value: "tunjuk" }, { from: 13, value: "angkatTangan" }, { from: 16.6, value: "netral" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 4.4, text: "Satu file .vue berisi tiga bagian: script, template, dan style." },
      { who: "robot", from: 5, dur: 3.8, text: "Script untuk logika." },
      { who: "robot", from: 9, dur: 3.6, text: "Template untuk tampilan." },
      { who: "robot", from: 13, dur: 3.4, text: "Style untuk gaya, bisa di-scoped." },
      { who: "ganjar", from: 17, dur: 2.6, text: "Rapi, ya!" },
    ],
    cues: [{ at: 5, event: "pop_claude", volume: 0.3 }, { at: 9, event: "pop_claude", volume: 0.3 }, { at: 13, event: "pop_claude", volume: 0.3 }],
    inserts: [
      {
        from: 0.5,
        dur: 18.5,
        layout: "split",
        camera: CAM.twoShot,
        typing: codeTyping(CODE_SFC, 34, 0.3),
        content: <CodeEditor code={CODE_SFC} fontSize={30} typeCps={34} typeStart={0.3} highlights={[{ from: 1, to: 5, at: 4.5, until: 8.5 }, { from: 7, to: 9, at: 8.5, until: 12.5 }, { from: 11, to: 13, at: 12.5, until: 16.5 }]} />,
      },
    ],
  },
  // 8. Reaktivitas
  {
    id: "reaktivitas",
    title: "Reaktivitas",
    seconds: 25,
    time: [0.15, 0.3],
    shots: [shot(0, 13.5, CAM.twoShot), shot(13.5, 3, CAM.ganjarMedium), shot(21.5, 3.5, CAM.ganjarClose)],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 13.6, expression: "senang" }, { at: 19, expression: "tertawa" }],
      ganjarGesture: [{ from: 13.6, value: "tunjuk" }, { from: 16.4, value: "netral" }, { from: 19, value: "sorak" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 21.8, expression: "senang" }],
      robotGesture: [{ from: 4.4, value: "tunjuk" }, { from: 9.2, value: "netral" }, { from: 21.8, value: "lambai" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 3.6, text: "Sekarang bikin tombol penghitung." },
      { who: "robot", from: 4.4, dur: 4.4, text: "ref membuat data jadi reaktif." },
      { who: "robot", from: 9.2, dur: 4, text: "Setiap diklik, tampilannya ikut berubah." },
      { who: "ganjar", from: 13.6, dur: 2.6, text: "Coba aku klik!" },
      { who: "ganjar", from: 19, dur: 2.4, text: "Wah, bertambah terus!" },
      { who: "robot", from: 21.8, dur: 3, text: "Itulah reaktivitas." },
    ],
    cues: [{ at: 5.7, event: "pop_claude", volume: 0.3 }, { at: 9.3, event: "pop_claude", volume: 0.3 }, { at: 15.2, event: "pop_ganjar", volume: 0.4 }, { at: 16.4, event: "pop_ganjar", volume: 0.4 }, { at: 17.4, event: "pop_ganjar", volume: 0.4 }, { at: 18.8, event: "pop_ganjar", volume: 0.4 }, { at: 19.8, event: "pop_ganjar", volume: 0.4 }, { at: 21.2, event: "ding", volume: 0.4 }],
    inserts: [
      {
        from: 0.5,
        dur: 12,
        layout: "split",
        camera: CAM.twoShot,
        typing: codeTyping(CODE_COUNTER, 22, 0.3),
        content: <CodeEditor code={CODE_COUNTER} fontSize={30} typeCps={22} typeStart={0.3} highlights={[{ from: 4, to: 4, at: 5.2, until: 8.8 }, { from: 8, to: 8, at: 8.8, until: 12 }]} />,
      },
      { from: 14, dur: 9, layout: "full", content: <BrowserMock fontSize={34}><CounterApp clicks={[1.2, 2.4, 3.4, 4.8, 5.8, 7.2]} scale={1.4} /></BrowserMock> },
    ],
  },
  // 9. Komponen dan props
  {
    id: "props",
    title: "Komponen & Props",
    seconds: 18,
    time: [0.3, 0.4],
    shots: [shot(0, 11.5, CAM.twoShot), shot(11.5, 6.5, CAM.ganjarMedium, { end: CAM.twoShot })],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 9.4, expression: "mikir" }, { at: 12.6, expression: "senang" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 12.6, expression: "senang" }],
      robotGesture: [{ from: 0.4, value: "tunjuk" }, { from: 4.8, value: "angkatTangan" }, { from: 8.9, value: "netral" }, { from: 12.6, value: "sorak" }],
    },
    lines: [
      { who: "robot", from: 0.4, dur: 4, text: "Biar rapi, pecah jadi komponen terpisah." },
      { who: "robot", from: 4.8, dur: 4.2, text: "Komponen menerima data lewat props." },
      { who: "ganjar", from: 9.4, dur: 3, text: "Jadi bisa dipakai berulang?" },
      { who: "robot", from: 12.6, dur: 3.4, text: "Betul. Satu komponen, banyak tombol." },
    ],
    cues: [{ at: 5.5, event: "pop_claude", volume: 0.3 }, { at: 9, event: "pop_claude", volume: 0.3 }, { at: 12.6, event: "pop_ganjar", volume: 0.35 }, { at: 13.6, event: "pop_ganjar", volume: 0.35 }, { at: 14.6, event: "pop_ganjar", volume: 0.35 }],
    inserts: [
      {
        from: 0.5,
        dur: 10.5,
        layout: "split",
        camera: CAM.twoShot,
        typing: codeTyping(CODE_PROPS, 26, 0.3),
        content: <CodeEditor file="CounterButton.vue" code={CODE_PROPS} fontSize={30} typeCps={26} typeStart={0.3} highlights={[{ from: 2, to: 5, at: 5, until: 8.5 }, { from: 9, to: 9, at: 8.5, until: 10.5 }]} />,
      },
      {
        from: 12,
        dur: 5.5,
        layout: "pip",
        corner: "topRight",
        pip: { width: 560, height: 380 },
        content: (
          <BrowserMock fontSize={20}>
            <ButtonsApp labels={[{ text: "Simpan", at: 0.6 }, { text: "Batal", at: 1.6 }, { text: "Hapus", at: 2.6 }]} scale={0.6} />
          </BrowserMock>
        ),
      },
    ],
  },
  // 10. Error dan perbaikan
  {
    id: "error",
    title: "Error & Perbaikan",
    seconds: 10,
    time: 0.5,
    shots: [shot(0, 6, CAM.ganjarClose, { start: { ...CAM.ganjarClose, rotate: 7 }, shake: 9, transitionIn: "punch" }), shot(6, 4, CAM.twoShot)],
    actors: {
      ganjarFace: [{ at: 0, expression: "kaget" }, { at: 2.2, expression: "marah" }, { at: 6.8, expression: "malu" }, { at: 8.6, expression: "senyum" }],
      ganjarGesture: [{ from: 2.2, value: "facepalm" }, { from: 6.4, value: "netral" }],
      robotFace: [{ at: 0, expression: "kaget" }, { at: 3, expression: "netral" }, { at: 7, expression: "senang" }],
      robotGesture: [{ from: 3, value: "tunjuk" }, { from: 6.4, value: "angkatTangan" }, { from: 9, value: "netral" }],
    },
    lines: [
      { who: "ganjar", from: 0.5, dur: 2.4, text: "Lho, kok layarnya merah?!" },
      { who: "robot", from: 3, dur: 3.4, text: "Tenang. Cuma typo: cout, bukan count." },
      { who: "ganjar", from: 6.8, dur: 2.6, text: "Duh, salah ketik!" },
    ],
    cues: [{ at: 0.5, event: "scratch", volume: 0.55 }, { at: 6.4, event: "ding", volume: 0.45 }, { at: 7.1, event: "pop_ganjar", volume: 0.4 }, { at: 7.9, event: "pop_ganjar", volume: 0.4 }],
    inserts: [
      {
        from: 0.2,
        dur: 5.6,
        layout: "split",
        camera: { ...CAM.ganjarClose, rotate: 7 },
        content: <ErrorPage message={'Property "cout" was accessed during render but is not defined on instance.'} detail={"  at <App>\n  at <Root>"} />,
      },
      { from: 6.3, dur: 3.7, layout: "full", content: <BrowserMock fontSize={34}><CounterApp clicks={[0.8, 1.6]} scale={1.3} /></BrowserMock> },
    ],
  },
  // 11. Rangkuman
  {
    id: "rangkuman",
    title: "Rangkuman",
    seconds: 10,
    time: 0.6,
    shots: [shot(0, 10, CAM.twoShot, { end: { ...CAM.twoShot, zoom: 1.45 } })],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 8, expression: "senang" }],
      robotFace: [{ at: 0, expression: "senang" }],
      robotGesture: [{ from: 0.4, value: "tunjuk" }, { from: 9, value: "netral" }],
    },
    lines: [{ who: "robot", from: 0.4, dur: 9, text: "Pasang Node.js, buat proyek, jalankan dev server, tulis komponen, dan pakai ref." }],
    cues: [{ at: 1.3, event: "ding", volume: 0.35 }, { at: 2.5, event: "ding", volume: 0.35 }, { at: 3.7, event: "ding", volume: 0.35 }, { at: 4.9, event: "ding", volume: 0.35 }, { at: 6.1, event: "ding", volume: 0.35 }],
    inserts: [
      {
        from: 0.5,
        dur: 9,
        layout: "split",
        camera: CAM.twoShot,
        content: (
          <InfoCard
            title="Rangkuman"
            check
            fontSize={34}
            items={[
              { text: "Pasang Node.js", at: 0.8 },
              { text: "npm create vue@latest", at: 2 },
              { text: "npm run dev", at: 3.2 },
              { text: "Komponen .vue", at: 4.4 },
              { text: "Reaktif dengan ref", at: 5.6 },
            ]}
          />
        ),
      },
    ],
  },
  // 12. Penutup
  {
    id: "outro",
    title: "Sampai Jumpa",
    seconds: 8,
    time: [0.8, 1],
    shots: [shot(0, 4, CAM.twoShot, { end: CAM.wide }), shot(4, 4, CAM.wide)],
    actors: {
      ganjarFace: [{ at: 0, expression: "senang" }, { at: 3, expression: "tertawa" }],
      ganjarGesture: [{ from: 0.4, value: "lambai" }],
      robotFace: [{ at: 0, expression: "senang" }],
      robotGesture: [{ from: 3.6, value: "lambai" }],
    },
    lines: [
      { who: "ganjar", from: 0.4, dur: 3, text: "Terima kasih sudah menonton!" },
      { who: "robot", from: 3.6, dur: 3.8, text: "Sampai jumpa di tutorial berikutnya." },
    ],
    cues: [{ at: 5.2, event: "ding", volume: 0.4 }],
    inserts: [{ from: 5, dur: 3, layout: "full", content: <TitleCard title="Sampai jumpa!" subtitle="Tutorial Vue JS berikutnya segera hadir" /> }],
  },
];

export const SCENE_FRAMES = SCENES.map((s) => Math.round(s.seconds * 30));

// Antar scene ada transisi yang saling menimpa selama TRANSITION_FRAMES (akhir scene lama dan awal scene baru),
// jadi total video lebih pendek sebesar (jumlah scene - 1) x TRANSITION_FRAMES, dan scene mulai lebih awal.
export const TRANSITION_FRAMES = 12;
export const SCENE_STARTS: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0) - i * TRANSITION_FRAMES);
export const VUE_TUTORIAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0) - (SCENES.length - 1) * TRANSITION_FRAMES;
