// Naskah dan waktu "Programmer Jadi Bodoh Karena Claude" (satir, 9:16). Ubah di sini, bukan di komponen.
// Semua waktu dalam detik.
import type { Gesture, RobotExpression, GanjarStickmanExpression } from "../../assets/characters";

export const FPS = 30;

export type Speaker = "ganjar" | "robot";

export type Line = {
  readonly who: Speaker;
  // Tanda *...* menyorot kata.
  readonly text: string;
  readonly seconds: number;
  readonly ganjar: GanjarStickmanExpression;
  readonly robot: RobotExpression;
  // Gerak tangan tiap karakter selama kalimat ini.
  readonly handGanjar: Gesture;
  readonly handRobot: Gesture;
  // Persentase meter setelah kalimat ini selesai.
  readonly skill: number;
  readonly reliance: number;
};

export const HOOK_SECONDS = 3;
export const CTA_SECONDS = 4.5;

export const LINES: readonly Line[] = [
  { who: "robot", text: "Bang, kodenya udah aku bikinin. Tinggal *copy-paste*.", seconds: 3.4, ganjar: "senang", robot: "senang", handGanjar: "tepuk", handRobot: "pinggang", skill: 90, reliance: 25 },
  { who: "ganjar", text: "Mantap! Ini jalannya gimana, Claude?", seconds: 2.8, ganjar: "senyumSantai", robot: "normal", handGanjar: "tunjuk", handRobot: "netral", skill: 80, reliance: 40 },
  { who: "robot", text: "Nggak tau. Aku cuma *nulis*, bukan mikir.", seconds: 3.2, ganjar: "bingung", robot: "malu", handGanjar: "garukKepala", handRobot: "angkatBahu", skill: 70, reliance: 50 },
  { who: "ganjar", text: "Terus kalau error?", seconds: 2.2, ganjar: "bingung", robot: "normal", handGanjar: "angkatBahu", handRobot: "netral", skill: 62, reliance: 58 },
  { who: "robot", text: "Tanya aku lagi. Aku yang bikin, aku juga yang *benerin*.", seconds: 3.6, ganjar: "mikir", robot: "senang", handGanjar: "mikir", handRobot: "angkatTangan", skill: 52, reliance: 70 },
  { who: "ganjar", text: "Dulu aku hafal sintaks. Sekarang bikin *for loop* aja nanya kamu.", seconds: 4.2, ganjar: "serius", robot: "normal", handGanjar: "garukKepala", handRobot: "netral", skill: 38, reliance: 80 },
  { who: "robot", text: "Wajar. Otak kamu udah aku *pensiunin*.", seconds: 3, ganjar: "kesal", robot: "senang", handGanjar: "netral", handRobot: "pinggang", skill: 26, reliance: 88 },
  { who: "ganjar", text: "Hah?! Jadi yang *bodoh* itu aku?!", seconds: 3, ganjar: "kaget", robot: "kaget", handGanjar: "menyerah", handRobot: "angkatBahu", skill: 14, reliance: 92 },
  { who: "robot", text: "Tenang. Kamu tetap berguna: *bayar langganan* aku.", seconds: 3.6, ganjar: "kesal", robot: "senang", handGanjar: "facepalm", handRobot: "angkatTangan", skill: 8, reliance: 97 },
  { who: "ganjar", text: "Kalau internet mati, aku ngoding pakai apa?", seconds: 3.4, ganjar: "mikir", robot: "normal", handGanjar: "mikir", handRobot: "netral", skill: 5, reliance: 100 },
  { who: "robot", text: "Pakai *doa*.", seconds: 2.4, ganjar: "tertawa", robot: "senang", handGanjar: "tepuk", handRobot: "angkatBahu", skill: 2, reliance: 100 },
];

export const CTA = {
  main: "Kamu juga udah mulai lupa sintaks?",
  accent: "Komen \"AKU\" kalau iya.",
  sub: "Follow buat satir programmer lainnya",
} as const;

export const HOOK = {
  title: "Programmer Jadi",
  accent: "Bodoh",
  tail: "Karena Claude",
  sub: "(katanya. ini satir.)",
} as const;

// Frame awal tiap kalimat dan total.
export const LINE_START: readonly number[] = LINES.reduce<number[]>(
  (acc, l, i) => [...acc, i === 0 ? Math.round(HOOK_SECONDS * FPS) : acc[i - 1] + Math.round(LINES[i - 1].seconds * FPS)],
  [],
);
export const LINES_END = LINE_START[LINES.length - 1] + Math.round(LINES[LINES.length - 1].seconds * FPS);
export const CTA_START = LINES_END;
export const TOTAL_FRAMES = CTA_START + Math.round(CTA_SECONDS * FPS);
