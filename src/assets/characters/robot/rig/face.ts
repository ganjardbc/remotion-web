// Ekspresi layar dipisah dari gerak badan: bisa bicara/kaget sambil jalan.
export type RobotExpression =
  // `normal` = alias lama dari `netral`.
  | "normal"
  | "netral"
  | "senang"
  | "kaget"
  | "malu"
  | "sedih"
  | "marah"
  | "bingung"
  | "mikir"
  | "kesal"
  | "serius"
  | "mataTertutup";

export type FaceKey = { readonly at: number; readonly expression: RobotExpression };

export type FaceState = {
  readonly expression: RobotExpression;
  // 0 = mata tertutup (kedip digital), 1 = terbuka
  readonly open: number;
  readonly lookX: number;
  readonly lookY: number;
};

const SWITCH_FRAMES = 3;
const BLINK_PERIOD = 96;
const BLINK_LEN = 5;

// keys diurutkan menurut `at` (detik). Ganti ekspresi = mata menutup sekejap lalu membuka.
export const evalFace = (frame: number, fps: number, keys: readonly FaceKey[]): FaceState => {
  let expression: RobotExpression = "normal";
  let changeFrame = -1000;
  for (const k of keys) {
    const f = Math.round(k.at * fps);
    if (f <= frame) {
      expression = k.expression;
      changeFrame = f;
    }
  }
  // Menutup sebelum pergantian: lihat kunci berikutnya.
  let open = 1;
  for (const k of keys) {
    const f = Math.round(k.at * fps);
    const d = Math.abs(frame - f);
    if (d < SWITCH_FRAMES) {
      open = Math.min(open, d / SWITCH_FRAMES);
    }
  }
  if (frame - changeFrame < SWITCH_FRAMES) {
    open = Math.min(open, (frame - changeFrame) / SWITCH_FRAMES);
  }
  // Kedip berkala, deterministik.
  const b = frame % BLINK_PERIOD;
  if ((expression === "normal" || expression === "netral") && b >= BLINK_PERIOD - BLINK_LEN) {
    const m = b - (BLINK_PERIOD - BLINK_LEN);
    open = Math.min(open, Math.abs(m - (BLINK_LEN - 1) / 2) / ((BLINK_LEN - 1) / 2) * 0.9 + 0.1);
  }
  // Mata melirik pelan.
  const lookX = Math.sin(frame / 47) * 5;
  const lookY = Math.sin(frame / 61 + 1) * 2.5;
  return { expression, open: Math.max(0, Math.min(1, open)), lookX, lookY };
};
