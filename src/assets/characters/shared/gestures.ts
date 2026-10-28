// Gerak tangan Stickman dan RobotStickman. Sudut dalam derajat dari arah lurus ke bawah:
// `shoulder` = lengan atas, `elbow` = tambahan untuk lengan bawah (arah lengan bawah = shoulder + elbow).
// Sudut di atas 180 berarti lengan menyilang ke arah badan. `front` = lengan digambar di depan kepala/badan.

export type ArmPose = { readonly shoulder: number; readonly elbow: number; readonly front?: boolean };

export type Gesture =
  | "netral"
  | "lambai"
  | "angkatTangan"
  | "tunjuk"
  | "sorak"
  | "menyerah"
  | "angkatBahu"
  | "facepalm"
  | "mikir"
  | "garukKepala"
  | "tepuk"
  | "pinggang"
  | "mengetik";

export const GESTURES: readonly Gesture[] = [
  "netral",
  "lambai",
  "angkatTangan",
  "tunjuk",
  "sorak",
  "menyerah",
  "angkatBahu",
  "facepalm",
  "mikir",
  "garukKepala",
  "tepuk",
  "pinggang",
  "mengetik",
];

// null = pakai pose dasar (diam atau ayun jalan) untuk lengan itu.
export type GestureArms = readonly [ArmPose | null, ArmPose | null];

const TAU = Math.PI * 2;

// Indeks 0 = lengan kiri layar, 1 = lengan kanan layar. `robot` = lengan pendek dan badan kotak:
// beberapa sudut berbeda supaya tangan tetap jatuh di layar atau di samping kotak.
export const gestureArms = (g: Gesture, t: number, robot: boolean): GestureArms => {
  const both = (a: ArmPose): GestureArms => [a, a];
  const right = (a: ArmPose): GestureArms => [null, a];
  switch (g) {
    case "netral":
      return [null, null];
    case "lambai":
      return right({ shoulder: 92, elbow: 45 + Math.sin(t * TAU * 2.2) * 20 });
    case "angkatTangan":
      return right({ shoulder: robot ? 150 : 125, elbow: robot ? 22 : 5 });
    case "tunjuk":
      return right({ shoulder: 96 + Math.sin(t * TAU * 1.8) * 3, elbow: -6 });
    case "sorak": {
      const w = Math.sin(t * TAU * 2.4) * 8;
      return both({ shoulder: robot ? 140 + w : 140 + w, elbow: robot ? 20 - w : -20 - w });
    }
    case "menyerah":
      return both({ shoulder: 100, elbow: 80, front: true });
    case "angkatBahu": {
      const up = Math.sin(t * TAU * 1.2) * 3;
      return both({ shoulder: 62 + up, elbow: 48 });
    }
    case "facepalm":
      return right(robot ? { shoulder: 40, elbow: 215, front: true } : { shoulder: 100, elbow: 115, front: true });
    case "mikir":
      return right(robot ? { shoulder: 35, elbow: 200, front: true } : { shoulder: 60, elbow: 175, front: true });
    case "garukKepala": {
      const scratch = Math.sin(t * TAU * 3) * 12;
      return right(robot ? { shoulder: 150, elbow: 25 + scratch, front: false } : { shoulder: 135, elbow: 55 + scratch, front: true });
    }
    case "tepuk": {
      const open = 0.5 + 0.5 * Math.sin(t * TAU * 2.5);
      if (robot) {
        const s = -10 - 65 * (1 - open);
        return both({ shoulder: s, elbow: 270 - s, front: true });
      }
      const s = 20 + 50 * open;
      return both({ shoulder: s, elbow: 270 - s, front: true });
    }
    case "pinggang":
      return both({ shoulder: 50, elbow: 279, front: true });
    case "mengetik": {
      // Lengan atas turun, lengan bawah menekuk ke tengah di depan perut; tiap tangan mengetuk bergantian
      // dengan dua gelombang berbeda supaya tidak seperti metronom.
      const tap = (phase: number): number => Math.max(0, Math.sin(t * TAU * 3.1 + phase)) * 9 + Math.sin(t * TAU * 1.7 + phase * 2) * 2;
      const base = robot ? { shoulder: -12, elbow: 282 } : { shoulder: 30, elbow: -118 };
      return [
        { shoulder: base.shoulder, elbow: base.elbow + tap(0), front: true },
        { shoulder: base.shoulder, elbow: base.elbow + tap(2.4), front: true },
      ];
    }
  }
};

// Block tidak punya siku, jadi hanya gerak yang bisa ditiru dengan satu sudut lengan lurus yang didukung.
// Hasil: sudut angkat lengan keluar dari posisi tergantung (derajat); null = pose dasar block.
// Indeks 0 = lengan kiri layar, 1 = kanan layar. Gerak lain (angkatBahu, facepalm, mikir, garukKepala, tepuk, pinggang) = pose dasar.
const BLOCK_GESTURES: ReadonlySet<Gesture> = new Set(["lambai", "angkatTangan", "tunjuk", "sorak", "menyerah"]);

export const blockArms = (g: Gesture | undefined, t: number, robot: boolean): readonly [number | null, number | null] => {
  if (!g || !BLOCK_GESTURES.has(g)) return [null, null];
  const [l, r] = gestureArms(g, t, robot);
  const angle = (a: ArmPose | null): number | null => (a ? Math.max(0, Math.min(175, a.shoulder + a.elbow * 0.5)) : null);
  return [angle(l), angle(r)];
};
