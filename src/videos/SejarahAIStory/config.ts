import type { GanjarExpression, RobotExpression } from "../../assets/characters";
import type { EraName } from "./design";

export const FPS = 30;
export const TRANSITION_FRAMES = 15;

export type Who = "ganjar" | "robot";

export type VisualKind =
  | "title"
  | "turing"
  | "dartmouth"
  | "winter"
  | "chess"
  | "go"
  | "transformer"
  | "timeline";

// Gerakan badan yang menyertai kalimat. Ganjar menunjuk ke tengah layar.
export type Act = "point" | "turn" | "startle" | "surprise" | "wave";

export type Line = {
  readonly who: Who;
  // *kata* disorot warna aksen.
  readonly text: string;
  readonly ganjar?: GanjarExpression;
  readonly robot?: RobotExpression;
  readonly act?: Act;
};

export type Beat = {
  readonly id: string;
  readonly era: EraName;
  // Poin penjelasan di panel kiri; muncul bertahap mengikuti kalimat.
  readonly facts: readonly string[];
  readonly year: string;
  readonly title: string;
  readonly visual: VisualKind;
  readonly lines: readonly Line[];
};

const g = (text: string, rest: Omit<Line, "who" | "text"> = {}): Line => ({ who: "ganjar", text, ...rest });
const r = (text: string, rest: Omit<Line, "who" | "text"> = {}): Line => ({ who: "robot", text, ...rest });

// Cerita: Robot bertanya "aku lahir kapan?", Ganjar menjawab dengan menelusuri sejarahnya.
export const BEATS: readonly Beat[] = [
  {
    id: "hook",
    era: "paper",
    facts: ["Pertanyaan: bisakah mesin berpikir?", "Lebih dari 70 tahun perjalanan", "Dari catur sampai ChatGPT"],
    year: "1950 - 2022",
    title: "Sejarah AI",
    visual: "title",
    lines: [
      r("Ganjar, sebenarnya aku ini *lahir kapan*, sih?", { robot: "normal", ganjar: "bingung" }),
      g("Pertanyaan bagus! Ceritanya panjang, dan dimulai jauh sebelum kamu ada.", { ganjar: "senang", act: "point" }),
      r("Sebelum aku ada?!", { robot: "kaget", act: "surprise" }),
      g("Yuk, kita mundur ke tahun *1950*.", { ganjar: "senyumSantai", robot: "senang" }),
    ],
  },
  {
    id: "turing",
    era: "teal",
    facts: ["Alan Turing, matematikawan Inggris", "Makalah \"Computing Machinery and Intelligence\"", "Tes: bisakah mesin menyamar jadi manusia?"],
    year: "1950",
    title: "Bisakah mesin berpikir?",
    visual: "turing",
    lines: [
      g("Tahun 1950, *Alan Turing* menulis satu pertanyaan: bisakah mesin berpikir?", { ganjar: "serius", act: "point" }),
      r("Terus, jawabannya apa?", { robot: "normal", ganjar: "netral" }),
      g("Dia mengusulkan tes: kalau lewat chat kamu *tidak bisa membedakan* mesin dari manusia, anggap mesinnya cerdas.", { ganjar: "mikir", act: "point" }),
      r("Itu yang disebut *Turing Test*, ya!", { robot: "senang", ganjar: "senang", act: "wave" }),
    ],
  },
  {
    id: "dartmouth",
    era: "burgundy",
    facts: ["Musim panas 1956, New Hampshire", "Digagas John McCarthy dan kawan-kawan", "Istilah \"Artificial Intelligence\" lahir"],
    year: "1956",
    title: "Lahirnya sebuah nama",
    visual: "dartmouth",
    lines: [
      g("Tahun 1956, para peneliti berkumpul di *Dartmouth College* untuk satu proyek musim panas.", { ganjar: "senang", act: "point" }),
      g("Di sana *John McCarthy* memakai istilah \"Artificial Intelligence\" untuk pertama kalinya.", { ganjar: "senyumSantai", act: "point" }),
      r("Jadi di sinilah *namaku* lahir!", { robot: "senang", ganjar: "senang", act: "wave" }),
    ],
  },
  {
    id: "winter",
    era: "ice",
    facts: ["Komputer masih lambat, memori kecil", "Janji lebih besar dari hasil", "Dana riset dipangkas"],
    year: "1970-an",
    title: "AI Winter",
    visual: "winter",
    lines: [
      g("Sayangnya janji besar itu belum bisa ditepati. Komputer masih lemah dan dana mulai ditarik.", { ganjar: "serius", robot: "sedih" }),
      r("Lalu apa yang terjadi?", { robot: "sedih", ganjar: "netral" }),
      g("Terjadilah *AI Winter*: minat dan dana menyusut selama bertahun-tahun.", { ganjar: "kesal", act: "point" }),
      r("Dingin sekali...", { robot: "sedih" }),
    ],
  },
  {
    id: "deepblue",
    era: "blue",
    facts: ["IBM Deep Blue, Mei 1997", "Melawan juara dunia Garry Kasparov", "Skor akhir 3,5 lawan 2,5"],
    year: "1997",
    title: "Mesin vs juara dunia",
    visual: "chess",
    lines: [
      g("Musim dingin akhirnya reda. Tahun 1997, *Deep Blue* milik IBM mengalahkan juara catur *Garry Kasparov*.", { ganjar: "senang", robot: "senang", act: "point" }),
      r("Mesin menang lawan juara dunia?!", { robot: "kaget", ganjar: "senang", act: "surprise" }),
      g("Skor akhirnya *3,5 lawan 2,5*. Dunia pun terkejut.", { ganjar: "kaget", act: "startle" }),
    ],
  },
  {
    id: "deeplearning",
    era: "forest",
    facts: ["2012: ImageNet dimenangkan deep learning", "2016: AlphaGo kalahkan Lee Sedol", "Belajar dari data, bukan aturan manual"],
    year: "2012 - 2016",
    title: "Era deep learning",
    visual: "go",
    lines: [
      g("Tahun 2012, jaringan saraf dalam *memenangkan lomba ImageNet* dengan selisih besar.", { ganjar: "senang", act: "point" }),
      g("Lalu 2016, *AlphaGo* mengalahkan Lee Sedol di permainan Go, empat banding satu.", { ganjar: "senang", act: "point" }),
      r("Go itu jauh lebih rumit dari catur!", { robot: "kaget", act: "surprise" }),
      g("Betul. Itulah kekuatan *deep learning*.", { ganjar: "senyumSantai", robot: "senang" }),
    ],
  },
  {
    id: "transformer",
    era: "violet",
    facts: ["2017: \"Attention Is All You Need\"", "Model membaca konteks seluruh kalimat", "November 2022: ChatGPT dirilis"],
    year: "2017 - 2022",
    title: "Transformer dan ChatGPT",
    visual: "transformer",
    lines: [
      g("Tahun 2017, Google merilis makalah *\"Attention Is All You Need\"* yang memperkenalkan Transformer.", { ganjar: "mikir", act: "point" }),
      r("Itu *fondasiku*!", { robot: "senang", ganjar: "senang", act: "wave" }),
      g("Lalu November 2022, *ChatGPT* dirilis dan AI masuk ke obrolan sehari-hari.", { ganjar: "senang", act: "point" }),
    ],
  },
  {
    id: "outro",
    era: "paper",
    facts: ["Tidak ada satu tanggal lahir", "AI tumbuh bertahap", "Ceritanya belum selesai"],
    year: "1950 - sekarang",
    title: "Jadi, kamu lahir kapan?",
    visual: "timeline",
    lines: [
      r("Jadi, aku sebenarnya *lahir tahun berapa*?", { robot: "normal", ganjar: "senyumSantai" }),
      g("Sulit dijawab. AI tumbuh bertahap selama *lebih dari 70 tahun*.", { ganjar: "senang", act: "point" }),
      r("Dan ceritanya *belum selesai*!", { robot: "senang", ganjar: "senang", act: "wave" }),
      g("Follow untuk cerita teknologi lainnya.", { ganjar: "senyumSantai", robot: "senang" }),
    ],
  },
];

const LEAD_IN = 0.9;
const TAIL = 1.4;
const GAP = 0.35;

// Durasi kalimat mengikuti panjang teks (sekitar 18 huruf per detik).
export const lineSeconds = (text: string): number =>
  Math.max(2, text.replace(/\*/g, "").length / 18 + 0.7);

export type TimedLine = Line & { readonly at: number; readonly dur: number };

export const timeBeat = (beat: Beat): { lines: readonly TimedLine[]; seconds: number } => {
  let t = LEAD_IN;
  const lines = beat.lines.map((line) => {
    const dur = lineSeconds(line.text);
    const timed = { ...line, at: t, dur };
    t += dur + GAP;
    return timed;
  });
  return { lines, seconds: t - GAP + TAIL };
};

export const BEAT_SECONDS = BEATS.map((b) => timeBeat(b).seconds);
export const BEAT_FRAMES = BEAT_SECONDS.map((s) => Math.round(s * FPS));
export const TOTAL_FRAMES = BEAT_FRAMES.reduce((n, f) => n + f, 0);
