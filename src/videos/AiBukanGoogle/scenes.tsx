import type { Shot } from "../../assets/camera";
import type { SceneSpec } from "./SceneRenderer";
import { fitLines } from "./voiceover";
import { CAM } from "./world";

// Video dialog "Belajar AI #1: AI Bukan Google". Murid = Ganjar (who: "ganjar"), Guru = Claude (who: "robot").
// Waktu di dalam scene dalam detik. Durasi baris di sini perkiraan; setelah voiceover jadi, durasi mengikuti audio asli.

const shot = (from: number, dur: number, start: Shot["start"], extra: Partial<Shot> = {}): Shot => ({ from, dur, start, ...extra });

export const BASE_SCENES: readonly SceneSpec[] = [
  // 1. Hook
  {
    id: "hook",
    title: "Murid Bertanya",
    seconds: 7.6,
    time: 0,
    shots: [shot(0, 2, CAM.wide), shot(2, 2.2, CAM.ganjarMedium), shot(4.2, 3.4, CAM.robotMedium)],
    actors: {
      ganjarFace: [{ at: 0, expression: "senyum" }, { at: 2.4, expression: "bingung" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 4.1, expression: "serius" }],
      robotGesture: [{ from: 4.6, value: "tunjuk" }, { from: 6.6, value: "netral" }],
    },
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.6, text: "Guru, aku pakai AI persis kayak Google. Ada yang salah?", tag: "curious" },
      { who: "robot", from: 4.1, dur: 2.9, text: "Salah besar. Keduanya bukan hal yang sama.", tag: "firmly" },
    ],
    cues: [{ at: 4.1, event: "ding", volume: 0.3 }],
    inserts: [],
  },
  // 2. Google itu mencari
  {
    id: "beda",
    title: "Google Mencari",
    seconds: 8.3,
    time: 0.1,
    shots: [shot(0, 8.3, CAM.twoShot, { end: { ...CAM.twoShot, zoom: 1.45 } })],
    actors: {
      ganjarFace: [{ at: 0, expression: "mikir" }, { at: 6.9, expression: "bingung" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 1.6, expression: "senang" }],
      robotGesture: [{ from: 1.8, value: "tunjuk" }, { from: 6.5, value: "netral" }],
    },
    lines: [
      { who: "ganjar", from: 0.3, dur: 1, text: "Bedanya apa?" },
      { who: "robot", from: 1.6, dur: 4.9, text: "Google itu mencari. Kamu mengetik, dia menunjukkan halaman yang sudah ada." },
      { who: "ganjar", from: 6.9, dur: 0.8, text: "Kalau AI?" },
    ],
    cues: [],
    inserts: [],
  },
  // 3. AI menyusun
  {
    id: "susun",
    title: "AI Menyusun",
    seconds: 9.7,
    time: 0.3,
    shots: [shot(0, 4.5, CAM.robotMedium), shot(4.5, 5.2, CAM.robotClose)],
    actors: {
      ganjarFace: [{ at: 0, expression: "mikir" }],
      robotFace: [{ at: 0, expression: "serius" }, { at: 5, expression: "mikir" }],
      robotGesture: [{ from: 0.4, value: "tunjuk" }, { from: 4.5, value: "netral" }, { from: 6, value: "angkatTangan" }, { from: 8.6, value: "netral" }],
    },
    lines: [
      { who: "robot", from: 0.3, dur: 9.1, text: "AI menyusun. Dia tidak membuka arsip. Dia menebak kata berikutnya yang paling masuk akal, dari pola jutaan tulisan yang pernah dia pelajari." },
    ],
    cues: [],
    inserts: [],
  },
  // 4. Yakin belum tentu benar
  {
    id: "yakin",
    title: "Yakin Belum Tentu Benar",
    seconds: 6.4,
    time: 0.5,
    shots: [shot(0, 3.2, CAM.ganjarMedium), shot(3.2, 3.2, CAM.twoShot)],
    actors: {
      ganjarFace: [{ at: 0, expression: "kaget" }, { at: 3, expression: "mikir" }],
      ganjarGesture: [{ from: 0.4, value: "garukKepala" }, { from: 2.8, value: "netral" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 3.4, expression: "serius" }],
      robotGesture: [{ from: 3.6, value: "angkatTangan" }, { from: 5.6, value: "netral" }],
    },
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.7, text: "Pantas jawabannya selalu terdengar yakin.", tag: "realizing" },
      { who: "robot", from: 3.4, dur: 2.4, text: "Betul. Tapi lancar belum tentu benar." },
    ],
    cues: [],
    inserts: [],
  },
  // 5. Kesimpulan
  {
    id: "kesimpulan",
    title: "Kesimpulan",
    seconds: 3.8,
    time: 0.7,
    shots: [shot(0, 3.8, CAM.robotMedium, { end: CAM.robotClose })],
    actors: {
      ganjarFace: [{ at: 0, expression: "mikir" }],
      robotFace: [{ at: 0, expression: "serius" }],
      robotGesture: [{ from: 0.5, value: "tunjuk" }, { from: 3.2, value: "netral" }],
    },
    lines: [{ who: "robot", from: 0.3, dur: 3, text: "Google menemukan jawaban. AI membuat jawaban.", tag: "calmly" }],
    cues: [{ at: 3.2, event: "ding", volume: 0.3 }],
    inserts: [],
  },
  // 6. Teaser
  {
    id: "teaser",
    title: "Pelajaran Berikutnya",
    seconds: 9.6,
    time: 0.8,
    shots: [shot(0, 2, CAM.ganjarMedium), shot(2, 7.6, CAM.twoShot, { end: { ...CAM.twoShot, zoom: 1.5 } })],
    actors: {
      ganjarFace: [{ at: 0, expression: "bingung" }, { at: 2.4, expression: "mikir" }, { at: 8.6, expression: "senang" }],
      robotFace: [{ at: 0, expression: "netral" }, { at: 2.1, expression: "senang" }],
      robotGesture: [{ from: 2.4, value: "tunjuk" }, { from: 8.4, value: "netral" }],
    },
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.5, text: "Terus aku harus gimana?" },
      { who: "robot", from: 2.1, dur: 6.9, text: "Karena AI menebak dari tulisanmu, cara kamu bertanya menentukan hasilnya. Itu pelajaran berikutnya." },
    ],
    cues: [],
    inserts: [],
  },
  // 7. CTA (Claude menghadap penonton)
  {
    id: "cta",
    title: "Follow",
    seconds: 4.2,
    time: [0.9, 1],
    shots: [shot(0, 4.2, CAM.robotMedium)],
    actors: {
      ganjarFace: [{ at: 0, expression: "senang" }],
      ganjarGesture: [{ from: 0.4, value: "lambai" }, { from: 3.4, value: "netral" }],
      robotFace: [{ at: 0, expression: "senang" }],
      robotGesture: [{ from: 0.5, value: "lambai" }, { from: 3.6, value: "netral" }],
    },
    lines: [{ who: "robot", from: 0.3, dur: 3.3, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly" }],
    cues: [{ at: 3.6, event: "ding", volume: 0.4 }],
    inserts: [],
  },
];

// Scene dengan baris dialog yang sudah dimuat ke audio asli (bila ada); dipakai seluruh video.
export const SCENES: readonly SceneSpec[] = BASE_SCENES.map((s) => ({ ...s, lines: fitLines(s.id, s.lines) }));

export const SCENE_FRAMES = SCENES.map((s) => Math.round(s.seconds * 30));

// Antar scene ada transisi yang saling menimpa selama TRANSITION_FRAMES, jadi total video lebih pendek sebesar
// (jumlah scene - 1) x TRANSITION_FRAMES, dan scene mulai lebih awal.
export const TRANSITION_FRAMES = 12;
export const SCENE_STARTS: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0) - i * TRANSITION_FRAMES);
export const AI_BUKAN_GOOGLE_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0) - (SCENES.length - 1) * TRANSITION_FRAMES;
