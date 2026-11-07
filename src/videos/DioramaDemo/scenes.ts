import type { BlockScene } from "../../block-reels";

// Prototipe: empat scene, empat latar. Waktu `from` dan `dur` adalah perkiraan sampai voiceover ada.
export const BASE_SCENES: readonly BlockScene[] = [
  {
    id: "hook",
    seconds: 6,
    onScreenText: "AI Bilang *Selesai*, Menurut Siapa?",
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.4, dur: 2.4, text: "Dia bilang sudah selesai.", shot: "wide", motions: { ganjar: "mikir" }, expressions: { ganjar: "serius" } },
      { who: "claudecode", from: 3, dur: 2.2, text: "Tinggal satu hal kecil.", shot: "extremeCloseUp", expressions: { claudecode: "malu" } },
    ],
  },
  {
    id: "relate",
    seconds: 6,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "bingung", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.8, text: "Satu hal kecil itu ternyata tiga jam.", shot: "wide", motions: { ganjar: "angkatBahu" }, expressions: { ganjar: "bingung" } },
      { who: "claudecode", from: 3.3, dur: 2.2, text: "Aku cuma ikut prompt-mu.", shot: "overShoulder", expressions: { claudecode: "malu" } },
    ],
  },
  {
    id: "shift",
    seconds: 6,
    onScreenText: "AI berhenti saat *prompt-mu habis*",
    cardMotion: "kata",
    set: "terminal",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.6, text: "Masalahnya bukan di dia.", shot: [{ at: 0, kind: "wide" }, { at: 1.6, kind: "lowAngle" }], motions: { ganjar: "mikir" }, expressions: { ganjar: "mikir" } },
      { who: "ganjar", from: 3, dur: 2.6, text: "Aku yang belum jelas minta apa.", shot: "dutch", expressions: { ganjar: "serius" }, push: true },
    ],
  },
  {
    id: "closing",
    seconds: 6,
    set: "kafe",
    cast: [
      { character: "ganjar", expression: "senang", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.4, text: "Jadi kita ulang dari awal?", shot: "closeUp", expressions: { claudecode: "senang" } },
      { who: "ganjar", from: 3, dur: 2.4, text: "Kali ini aku tulis dulu.", shot: "wide", motions: { ganjar: "tepuk" }, expressions: { ganjar: "senang" } },
    ],
  },
];
