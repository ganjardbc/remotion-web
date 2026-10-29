import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import type { Theme } from "./types";

const { fontFamily: heading } = loadManrope("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});
const { fontFamily: body } = loadInter("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
});

// Source: design-system/insell-design-system (theme.json, tokens/*.css)
export const insell: Theme = {
  fonts: {
    heading,
    body,
    mono: '"SF Mono", ui-monospace, "Courier New", monospace',
  },
  colors: {
    canvas: "#FDF7F2", // neutral-25
    surface: "#FFFFFF",
    ink: "#293342", // neutral-800
    muted: "oklch(52% 0.018 12)", // neutral-500
    border: "oklch(91.2% 0.01 58)", // neutral-100
    line: "oklch(83.4% 0.011 55)", // neutral-200
    primary: "#EF6E33", // primary-500
    primaryDark: "#D55A1F", // primary-600
    primaryDeep: "#B84510", // primary-700
    primaryTint: "#FFF0E8", // primary-50
    primarySoft: "oklch(85.4% 0.078 44.5)", // primary-200
    onPrimary: "#FFFFFF",
    accent: "#EF6E33", // same as primary
    onAccent: "#FFFFFF",
    ground: "#D55A1F", // .on-ground = primary-600
    groundText: "#FFFFFF",
    groundTextMuted: "rgba(255, 255, 255, 0.78)",
    groundEmphasis: "oklch(36.5% 0.1 36)", // primary-900
    groundChipBg: "#FFFFFF",
    groundChipText: "#B84510",
  },
  code: {
    bg: "oklch(21.5% 0.028 254)", // neutral-900
    raised: "oklch(27% 0.028 254)",
    text: "#FDF7F2", // neutral-25
    muted: "oklch(83.4% 0.011 55)", // neutral-200
    line: "rgba(253, 247, 242, 0.14)",
  },
  shadows: {
    md: "0 4px 10px hsl(222 30% 20% / 0.10), 0 2px 4px hsl(222 30% 20% / 0.06)",
    glow: "0 8px 20px oklch(68.5% 0.1744 42.8 / 0.28)", // shadow-brand
    lift: "0 8px 20px hsl(222 30% 20% / 0.18)",
  },
  radius: { card: 20, large: 28 },
  type: {
    headlineTransform: "none",
    headlineWeight: 700,
    scale: 1,
    tracking: -0.025,
  },
  motion: {
    enter: [0.4, 0, 0.2, 1], // ease-standard
    pop: [0.34, 1.3, 0.64, 1], // ease-spring, confirmatory only
  },
  logo: { src: "insell-logo.png", width: 300, height: 120, round: false },
  // The design system names no Insell account; replace once there is one.
  handle: "@ganjar_hadiatna",
};
