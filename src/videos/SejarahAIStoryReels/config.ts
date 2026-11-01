// Naskah dan waktu "Sejarah AI" versi Reels (9:16). Ubah di sini, bukan di komponen.
// Semua waktu dalam detik.
import type { Line as StoryLine } from "../SejarahAIStory/config";
import { lineId, voDuration } from "./voiceover";

export const FPS = 30;
export const TRANSITION_FRAMES = 15;

export type VisualKind = "title" | "turing" | "dartmouth" | "winter" | "chess" | "go" | "transformer" | "timeline";

// `tag` = tag audio ElevenLabs (nada bicara); `spoken` = teks TTS bila beda dari caption.
export type Line = StoryLine & {
  readonly tag?: string;
  readonly spoken?: string;
};

export type Beat = {
  readonly id: string;
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
    year: "1950 - 2022",
    title: "Sejarah AI",
    visual: "title",
    lines: [
      r("Ganjar, sebenarnya aku ini *lahir kapan*, sih?", { tag: "curious", robot: "normal", ganjar: "bingung" }),
      g("Pertanyaan bagus! Ceritanya panjang, dan dimulai jauh sebelum kamu ada.", { tag: "warmly", ganjar: "senang", act: "point" }),
      r("Sebelum aku ada?!", { tag: "surprised", robot: "kaget", act: "surprise" }),
      g("Yuk, kita mundur ke tahun *1950*.", { tag: "excited", spoken: "Yuk, kita mundur ke tahun seribu sembilan ratus lima puluh.", ganjar: "senyumSantai", robot: "senang" }),
    ],
  },
  {
    id: "turing",
    year: "1950",
    title: "Bisakah mesin berpikir?",
    visual: "turing",
    lines: [
      g("Tahun 1950, *Alan Turing* menulis satu pertanyaan: bisakah mesin berpikir?", { tag: "calmly", spoken: "Tahun seribu sembilan ratus lima puluh, Alan Turing menulis satu pertanyaan: bisakah mesin berpikir?", ganjar: "serius", act: "point" }),
      r("Terus, jawabannya apa?", { tag: "curious", robot: "normal", ganjar: "netral" }),
      g("Dia mengusulkan tes: kalau lewat chat kamu *tidak bisa membedakan* mesin dari manusia, anggap mesinnya cerdas.", { tag: "calmly", ganjar: "mikir", act: "point" }),
      r("Itu yang disebut *Turing Test*, ya!", { tag: "excited", robot: "senang", ganjar: "senang", act: "wave" }),
    ],
  },
  {
    id: "dartmouth",
    year: "1956",
    title: "Lahirnya sebuah nama",
    visual: "dartmouth",
    lines: [
      g("Tahun 1956, para peneliti berkumpul di *Dartmouth College* untuk satu proyek musim panas.", { tag: "warmly", spoken: "Tahun seribu sembilan ratus lima puluh enam, para peneliti berkumpul di Dartmouth College untuk satu proyek musim panas.", ganjar: "senang", act: "point" }),
      g("Di sana *John McCarthy* memakai istilah \"Artificial Intelligence\" untuk pertama kalinya.", { tag: "calmly", ganjar: "senyumSantai", act: "point" }),
      r("Jadi di sinilah *namaku* lahir!", { tag: "excited", robot: "senang", ganjar: "senang", act: "wave" }),
    ],
  },
  {
    id: "winter",
    year: "1970-an",
    title: "AI Winter",
    visual: "winter",
    lines: [
      g("Sayangnya janji besar itu belum bisa ditepati. Komputer masih lemah dan dana mulai ditarik.", { tag: "sighs", ganjar: "serius", robot: "sedih" }),
      r("Lalu apa yang terjadi?", { tag: "nervous", robot: "sedih", ganjar: "netral" }),
      g("Terjadilah *AI Winter*: minat dan dana menyusut selama bertahun-tahun.", { tag: "calmly", spoken: "Terjadilah Ei Ai Winter: minat dan dana menyusut selama bertahun-tahun.", ganjar: "kesal", act: "point" }),
      r("Dingin sekali...", { tag: "sadly", robot: "sedih" }),
    ],
  },
  {
    id: "deepblue",
    year: "1997",
    title: "Mesin vs juara dunia",
    visual: "chess",
    lines: [
      g("Musim dingin akhirnya reda. Tahun 1997, *Deep Blue* milik IBM mengalahkan juara catur *Garry Kasparov*.", { tag: "excited", spoken: "Musim dingin akhirnya reda. Tahun seribu sembilan ratus sembilan puluh tujuh, Deep Blue milik Ai Bi Em mengalahkan juara catur Garry Kasparov.", ganjar: "senang", robot: "senang", act: "point" }),
      r("Mesin menang lawan juara dunia?!", { tag: "surprised", robot: "kaget", ganjar: "senang", act: "surprise" }),
      g("Skor akhirnya *3,5 lawan 2,5*. Dunia pun terkejut.", { tag: "excited", spoken: "Skor akhirnya tiga setengah lawan dua setengah. Dunia pun terkejut.", ganjar: "kaget", act: "startle" }),
    ],
  },
  {
    id: "deeplearning",
    year: "2012 - 2016",
    title: "Era deep learning",
    visual: "go",
    lines: [
      g("Tahun 2012, jaringan saraf dalam *memenangkan lomba ImageNet* dengan selisih besar.", { tag: "excited", spoken: "Tahun dua ribu dua belas, jaringan saraf dalam memenangkan lomba ImageNet dengan selisih besar.", ganjar: "senang", act: "point" }),
      g("Lalu 2016, *AlphaGo* mengalahkan Lee Sedol di permainan Go, empat banding satu.", { tag: "excited", spoken: "Lalu dua ribu enam belas, AlphaGo mengalahkan Lee Sedol di permainan Go, empat banding satu.", ganjar: "senang", act: "point" }),
      r("Go itu jauh lebih rumit dari catur!", { tag: "surprised", robot: "kaget", act: "surprise" }),
      g("Betul. Itulah kekuatan *deep learning*.", { tag: "warmly", ganjar: "senyumSantai", robot: "senang" }),
    ],
  },
  {
    id: "transformer",
    year: "2017 - 2022",
    title: "Transformer dan ChatGPT",
    visual: "transformer",
    lines: [
      g("Tahun 2017, Google merilis makalah *\"Attention Is All You Need\"* yang memperkenalkan Transformer.", { tag: "calmly", spoken: "Tahun dua ribu tujuh belas, Google merilis makalah Attention Is All You Need yang memperkenalkan Transformer.", ganjar: "mikir", act: "point" }),
      r("Itu *fondasiku*!", { tag: "excited", robot: "senang", ganjar: "senang", act: "wave" }),
      g("Lalu November 2022, *ChatGPT* dirilis dan AI masuk ke obrolan sehari-hari.", { tag: "warmly", spoken: "Lalu November dua ribu dua puluh dua, Chat Ji Pi Ti dirilis dan Ei Ai masuk ke obrolan sehari-hari.", ganjar: "senang", act: "point" }),
    ],
  },
  {
    id: "outro",
    year: "1950 - sekarang",
    title: "Jadi, kamu lahir kapan?",
    visual: "timeline",
    lines: [
      r("Jadi, aku sebenarnya *lahir tahun berapa*?", { tag: "curious", robot: "normal", ganjar: "senyumSantai" }),
      g("Sulit dijawab. AI tumbuh bertahap selama *lebih dari 70 tahun*.", { tag: "warmly", spoken: "Sulit dijawab. Ei Ai tumbuh bertahap selama lebih dari tujuh puluh tahun.", ganjar: "senang", act: "point" }),
      r("Dan ceritanya *belum selesai*!", { tag: "excited", robot: "senang", ganjar: "senang", act: "wave" }),
      g("Follow untuk cerita teknologi lainnya.", { tag: "warmly", ganjar: "senyumSantai", robot: "senang" }),
    ],
  },
];

const LEAD_IN = 0.5;
const TAIL = 0.9;
// Jeda antar kalimat: pendek supaya terdengar saling sahut.
const GAP = 0.25;

// Durasi perkiraan selama audio belum ada (sekitar 18 huruf per detik).
const lineSeconds = (text: string): number => Math.max(2, text.replace(/\*/g, "").length / 18 + 0.7);

export type TimedLine = Line & { readonly id: string; readonly at: number; readonly dur: number };

export const timeBeat = (beat: Beat): { lines: readonly TimedLine[]; seconds: number } => {
  let t = LEAD_IN;
  const lines = beat.lines.map((line, i) => {
    const id = lineId(beat.id, i);
    const dur = voDuration(id) ?? lineSeconds(line.text);
    const timed = { ...line, id, at: t, dur };
    t += dur + GAP;
    return timed;
  });
  return { lines, seconds: t - GAP + TAIL };
};

export const BEAT_FRAMES = BEATS.map((b) => Math.round(timeBeat(b).seconds * FPS));
// Frame awal tiap beat; transisi memakai ekor beat sebelumnya, jadi awal beat = jumlah durasi sebelumnya.
export const BEAT_START: readonly number[] = BEAT_FRAMES.reduce<number[]>(
  (acc, f, i) => [...acc, i === 0 ? 0 : acc[i - 1] + BEAT_FRAMES[i - 1]],
  [],
);
export const TOTAL_FRAMES = BEAT_FRAMES.reduce((n, f) => n + f, 0);
