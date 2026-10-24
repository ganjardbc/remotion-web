// All copy and timing for "Sejarah AI". Edit here, not in scenes.
// Times are in seconds, relative to the start of each scene.
import type { Icon } from "../../icons";
import type { ArtName } from "./Art";
import type { Mood } from "./Mascot";

export const FPS = 30;
// Cross-fade between scenes; each scene is lengthened by this much so the
// nominal scene boundaries stay where the script puts them.
export const TRANSITION_FRAMES = 15;

type IconName = React.ComponentProps<typeof Icon>["name"];

export type Era = {
  readonly year: string;
  readonly short: string;
  readonly title: string;
  readonly fact: string;
  readonly icon: IconName;
  readonly art: ArtName;
  readonly mood: Mood;
  readonly lines: readonly string[];
};

export const ERAS: readonly Era[] = [
  {
    year: "1950",
    short: "1950",
    title: "Sebuah pertanyaan sederhana",
    fact: "Turing Test",
    icon: "messageCircle",
    art: "turing",
    mood: "curious",
    lines: [
      "Seorang ilmuwan Inggris, Alan Turing, bertanya: bisakah mesin berpikir?",
      "Ia mengusulkan uji obrolan. Kalau kamu tak bisa membedakan lawan bicaramu manusia atau mesin, mungkin mesinnya memang cerdas.",
    ],
  },
  {
    year: "1956",
    short: "1956",
    title: "Sebuah nama lahir",
    fact: "Lokakarya Dartmouth",
    icon: "bookOpenCheck",
    art: "dartmouth",
    mood: "happy",
    lines: [
      "Musim panas itu, sekelompok peneliti berkumpul di Dartmouth, Amerika Serikat.",
      "John McCarthy memperkenalkan istilah “Artificial Intelligence”. Sejak itu, AI punya nama.",
    ],
  },
  {
    year: "1966",
    short: "1966",
    title: "Teman bicara pertama",
    fact: "ELIZA",
    icon: "bot",
    art: "eliza",
    mood: "happy",
    lines: [
      "Joseph Weizenbaum membuat ELIZA, program yang mengobrol seperti seorang terapis.",
      "Cara kerjanya sederhana. Tapi banyak orang merasa benar-benar didengarkan.",
    ],
  },
  {
    year: "1970–90an",
    short: "70an",
    title: "Musim dingin AI",
    fact: "AI Winter",
    icon: "batteryLow",
    art: "winter",
    mood: "cold",
    lines: [
      "Harapan terlalu tinggi, sementara kemampuan mesin belum mengejar.",
      "Dana riset dipangkas dan banyak proyek berhenti.",
      "Tapi sebagian peneliti tetap bertahan dan terus bereksperimen.",
    ],
  },
  {
    year: "1997",
    short: "1997",
    title: "Mesin menantang juara dunia",
    fact: "Deep Blue",
    icon: "layoutTemplate",
    art: "chess",
    mood: "wow",
    lines: [
      "Komputer Deep Blue milik IBM mengalahkan juara catur dunia, Garry Kasparov.",
      "Dunia terkejut. Mesin ternyata bisa unggul di permainan yang dianggap butuh kecerdasan.",
    ],
  },
  {
    year: "2012",
    short: "2012",
    title: "Belajar dari contoh",
    fact: "Deep Learning",
    icon: "layers",
    art: "network",
    mood: "curious",
    lines: [
      "Jaringan saraf tiruan bernama AlexNet menang telak di lomba mengenali gambar.",
      "Sejak itu mesin lebih banyak belajar dari data, bukan hanya mengikuti aturan yang ditulis manusia.",
    ],
  },
  {
    year: "2017",
    short: "2017",
    title: "Cara baru memahami bahasa",
    fact: "Transformer",
    icon: "route",
    art: "attention",
    mood: "curious",
    lines: [
      "Peneliti Google menerbitkan makalah berjudul “Attention Is All You Need”.",
      "Arsitektur Transformer di dalamnya menjadi fondasi hampir semua AI bahasa yang kita kenal sekarang.",
    ],
  },
  {
    year: "2022",
    short: "2022",
    title: "AI sampai ke tangan kita",
    fact: "ChatGPT",
    icon: "sparkles",
    art: "chatgpt",
    mood: "happy",
    lines: [
      "November 2022, ChatGPT dirilis dan dipakai jutaan orang dalam hitungan hari.",
      "Tidak perlu belajar pemrograman. Cukup mengetik, seperti ngobrol dengan teman.",
    ],
  },
];

const readSeconds = (text: string): number => Math.max(2.4, text.length / 17);

// Line reveal times (seconds) and the scene length, derived from the copy so
// longer stories get more reading time.
export const eraTiming = (
  era: Era,
): { lineStarts: number[]; seconds: number } => {
  const lineStarts: number[] = [];
  let at = 1.8;
  era.lines.forEach((line) => {
    lineStarts.push(at);
    at += readSeconds(line) + 0.4;
  });
  return { lineStarts, seconds: Math.ceil(at + 1.6) };
};

export const COPY = {
  hook: {
    main: "Kamu pakai AI hampir setiap hari.",
    followBefore: "Tapi tahukah kamu, ceritanya dimulai ",
    followAccent: "puluhan tahun lalu?",
  },
  closing: {
    line1:
      "Dari satu pertanyaan di tahun 1950, sampai asisten di genggamanmu hari ini.",
    line2Before: "Ceritanya belum selesai, dan kamu sedang hidup di ",
    line2Accent: "salah satu babnya.",
  },
  cta: {
    main: "Suka cerita seperti ini?",
    secondBefore: "Ikuti dan simpan, supaya tidak ketinggalan ",
    badge: "KONTEN BERIKUTNYA",
  },
} as const;

export const TIMING = {
  hook: { main: 0.3, follow: 2 },
  closing: { line1: 0.4, gap: 3.6, accentAfter: 0.5 },
  cta: { main: 0.2, second: 1.2 },
} as const;

export const SCENE_SECONDS = {
  hook: 6,
  closing: 12,
  cta: 6,
} as const;
