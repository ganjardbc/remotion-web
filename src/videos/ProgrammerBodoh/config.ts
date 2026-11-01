// Naskah dan waktu "Programmer Jadi Bodoh Karena Claude" (satir, 9:16). Ubah di sini, bukan di komponen.
// Semua waktu dalam detik.
import type { Gesture, RobotExpression, GanjarStickmanExpression } from "../../assets/characters";
import { lineId, voDuration } from "./voiceover";

export const FPS = 30;

export type Speaker = "ganjar" | "robot";

// Baris yang diucapkan. `tag` = tag audio ElevenLabs (nada bicara); `spoken` = teks TTS bila beda dari caption.
export type VoLine = {
  readonly who: Speaker;
  readonly text: string;
  readonly spoken?: string;
  readonly tag?: string;
};

type BaseLine = VoLine & {
  // Durasi tulisan tangan, dipakai selama audio belum ada.
  readonly seconds: number;
  // Jeda ekstra setelah kalimat, untuk efek suara atau punchline.
  readonly hold?: number;
  readonly ganjar: GanjarStickmanExpression;
  readonly robot: RobotExpression;
  // Gerak tangan tiap karakter selama kalimat ini.
  readonly handGanjar: Gesture;
  readonly handRobot: Gesture;
  // Persentase meter setelah kalimat ini selesai.
  readonly skill: number;
  readonly reliance: number;
};

export type Line = BaseLine & {
  readonly id: string;
  // Lama suara berbunyi; `seconds` = suara + jeda antar kalimat + hold.
  readonly speech: number;
};

// Jeda antar kalimat: pendek supaya terdengar saling sahut.
const PAUSE = 0.22;
const SPEECH_RATIO = 0.8;

export const HOOK_LINE: VoLine = { who: "ganjar", text: "Programmer jadi bodoh karena Claude?", tag: "curious" };
export const CTA_LINE: VoLine = { who: "ganjar", text: "Kamu juga udah mulai lupa syntax? Komen AKU kalau iya.", spoken: "Kamu juga udah mulai lupa syntax? Komen aku kalau iya.", tag: "warmly" };
export const HOOK_VO_ID = lineId("hook", 0);
export const CTA_VO_ID = lineId("cta", 0);
// Suara hook mulai setelah judul sempat muncul.
export const HOOK_VO_AT = 0.3;

export const HOOK_SECONDS = Math.max(3, HOOK_VO_AT + (voDuration(HOOK_VO_ID) ?? 0) + 0.3);
export const CTA_SECONDS = Math.max(4.5, (voDuration(CTA_VO_ID) ?? 0) + 1.2);

const BASE_LINES: readonly BaseLine[] = [
  { who: "robot", tag: "calmly", text: "Bang, kodenya udah aku bikinin. Tinggal *copy-paste*.", seconds: 3.4, ganjar: "senang", robot: "senang", handGanjar: "tepuk", handRobot: "pinggang", skill: 90, reliance: 25 },
  { who: "ganjar", tag: "excited", text: "Mantap! Ini jalannya gimana, Claude?", seconds: 2.8, ganjar: "senyumSantai", robot: "normal", handGanjar: "tunjuk", handRobot: "netral", skill: 80, reliance: 40 },
  { who: "robot", tag: "deadpan", text: "Nggak tau. Aku cuma *nulis*, bukan mikir.", seconds: 3.2, ganjar: "bingung", robot: "malu", handGanjar: "garukKepala", handRobot: "angkatBahu", skill: 70, reliance: 50 },
  { who: "ganjar", tag: "confused", text: "Terus kalau error?", seconds: 2.2, ganjar: "bingung", robot: "normal", handGanjar: "angkatBahu", handRobot: "netral", skill: 62, reliance: 58 },
  { who: "robot", tag: "calmly", text: "Tanya aku lagi. Aku yang bikin, aku juga yang *fix*.", seconds: 3.6, ganjar: "mikir", robot: "senang", handGanjar: "mikir", handRobot: "angkatTangan", skill: 52, reliance: 70 },
  { who: "ganjar", tag: "sighs", text: "Dulu aku hafal syntax. Sekarang bikin *for loop* aja nanya kamu.", seconds: 4.2, ganjar: "serius", robot: "normal", handGanjar: "garukKepala", handRobot: "netral", skill: 38, reliance: 80 },
  { who: "robot", tag: "sarcastic", text: "Wajar. Otak kamu udah aku *pensiunin*.", seconds: 3, ganjar: "kesal", robot: "senang", handGanjar: "netral", handRobot: "pinggang", skill: 26, reliance: 88 },
  { who: "ganjar", tag: "surprised", text: "Hah?! Jadi yang *bodoh* itu aku?!", seconds: 3, ganjar: "kaget", robot: "kaget", handGanjar: "menyerah", handRobot: "angkatBahu", skill: 14, reliance: 92 },
  { who: "robot", tag: "sarcastic", text: "Tenang. Kamu tetap berguna: *bayar subscription* aku.", seconds: 3.6, ganjar: "kesal", robot: "senang", handGanjar: "facepalm", handRobot: "angkatTangan", skill: 8, reliance: 97 },
  { who: "ganjar", tag: "nervous", text: "Kalau internet mati, aku ngoding pakai apa?", seconds: 3.4, hold: 0.8, ganjar: "mikir", robot: "normal", handGanjar: "mikir", handRobot: "netral", skill: 5, reliance: 100 },
  { who: "robot", tag: "deadpan", text: "Pakai *doa*.", seconds: 2.4, hold: 1.1, ganjar: "tertawa", robot: "senang", handGanjar: "tepuk", handRobot: "angkatBahu", skill: 2, reliance: 100 },
];

export const CTA = {
  main: "Kamu juga udah mulai lupa syntax?",
  accent: "Komen \"AKU\" kalau iya.",
  sub: "Follow buat satir programmer lainnya",
} as const;

export const HOOK = {
  title: "Programmer Jadi",
  accent: "Bodoh",
  tail: "Karena Claude",
  sub: "(katanya. ini satir.)",
} as const;

export const LINES: readonly Line[] = BASE_LINES.map((l, i) => {
  const id = lineId("chat", i);
  const audio = voDuration(id);
  return audio === undefined
    ? { ...l, id, speech: l.seconds * SPEECH_RATIO }
    : { ...l, id, speech: audio, seconds: audio + PAUSE + (l.hold ?? 0) };
});

// Frame awal tiap kalimat dan total.
export const LINE_START: readonly number[] = LINES.reduce<number[]>(
  (acc, l, i) => [...acc, i === 0 ? Math.round(HOOK_SECONDS * FPS) : acc[i - 1] + Math.round(LINES[i - 1].seconds * FPS)],
  [],
);
export const LINES_END = LINE_START[LINES.length - 1] + Math.round(LINES[LINES.length - 1].seconds * FPS);
export const CTA_START = LINES_END;
export const TOTAL_FRAMES = CTA_START + Math.round(CTA_SECONDS * FPS);
