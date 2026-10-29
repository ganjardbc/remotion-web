export type ThemeName = "insell" | "gh";

type Bezier = readonly [number, number, number, number];

// Role-based tokens: every design system maps its own palette onto these.
export type Theme = {
  readonly fonts: {
    readonly heading: string;
    readonly body: string;
    readonly mono: string;
  };
  readonly colors: {
    readonly canvas: string;
    readonly surface: string;
    readonly ink: string;
    readonly muted: string;
    readonly border: string;
    readonly line: string;
    readonly primary: string;
    readonly primaryDark: string;
    readonly primaryDeep: string;
    readonly primaryTint: string;
    readonly primarySoft: string;
    readonly onPrimary: string;
    // Highlight colour: one phrase or control at a time.
    readonly accent: string;
    readonly onAccent: string;
    // Status colours (validation). Optional: not every design system defines them.
    readonly danger?: string;
    readonly success?: string;
    readonly ground: string;
    readonly groundText: string;
    readonly groundTextMuted: string;
    readonly groundEmphasis: string;
    readonly groundChipBg: string;
    readonly groundChipText: string;
  };
  // Dark surface used for code blocks (the design system's dark context).
  readonly code: {
    readonly bg: string;
    // Lifted variant for code chips sitting on a dark ground.
    readonly raised: string;
    readonly text: string;
    readonly muted: string;
    readonly line: string;
  };
  readonly shadows: {
    readonly md: string;
    readonly glow: string;
    readonly lift: string;
  };
  readonly radius: { readonly card: number; readonly large: number };
  readonly type: {
    readonly headlineTransform: "none" | "uppercase";
    readonly headlineWeight: number;
    // Scales large headlines so wide/uppercase faces still fit the frame.
    readonly scale: number;
    // letter-spacing for large headlines, in em.
    readonly tracking: number;
  };
  readonly motion: { readonly enter: Bezier; readonly pop: Bezier };
  readonly logo: {
    readonly src: string;
    readonly width: number;
    readonly height: number;
    readonly round: boolean;
  };
  // Social handle shown in the brand footer.
  readonly handle: string;
};
