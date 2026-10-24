import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import type { Theme } from "./types";

const { fontFamily } = loadPoppins("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// Source: design-system/gh-design-system (tokens/*.css). Poppins only.
export const gh: Theme = {
  fonts: {
    heading: fontFamily,
    body: fontFamily,
    mono: 'ui-monospace, "SF Mono", "Courier New", monospace', // --font-mono
  },
  colors: {
    canvas: "#FFFFFF", // --color-surface
    surface: "#FFFFFF",
    ink: "#14141F", // --color-surface-text
    muted: "rgba(20, 20, 31, 0.64)",
    border: "rgba(20, 20, 31, 0.14)",
    line: "rgba(20, 20, 31, 0.24)",
    // Primary is the brand blue; orange is the highlight (accent).
    primary: "#3051B8", // --color-primary
    primaryDark: "#25429D", // brand-700
    primaryDeep: "#1B3173", // brand-800
    primaryTint: "#EAEEFA", // brand-100
    primarySoft: "#CED7F3", // brand-200
    onPrimary: "#FFFFFF",
    accent: "#FF914D", // --color-accent
    onAccent: "#201812", // --color-on-accent
    danger: "#E5484D", // --color-danger
    success: "#1A9C6B", // --color-success
    ground: "#0B0F1A", // --color-ground (near-black)
    groundText: "#FFFFFF",
    groundTextMuted: "rgba(255, 255, 255, 0.78)",
    groundEmphasis: "#FF914D", // orange calls out the one phrase
    groundChipBg: "#FFFFFF",
    groundChipText: "#25429D", // brand-700
  },
  code: {
    bg: "#0B0F1A", // .dark --color-surface
    raised: "#151C2C", // between surface-alt and surface-raised
    text: "#F2F3F7",
    muted: "rgba(242, 243, 247, 0.64)",
    line: "rgba(242, 243, 247, 0.12)",
  },
  shadows: {
    md: "0 4px 12px rgba(18, 31, 74, 0.12)", // shadow-md
    glow: "0 0 0 1px rgba(82, 114, 214, 0.45), 0 6px 20px rgba(48, 81, 184, 0.32)", // glow-primary
    lift: "0 12px 32px rgba(18, 31, 74, 0.18)", // shadow-lg
  },
  radius: { card: 12, large: 20 },
  type: {
    // Display text is mixed-case by default; set "uppercase" for glance-read canvases.
    headlineTransform: "none",
    headlineWeight: 800,
    scale: 0.95,
    tracking: -0.025,
  },
  motion: {
    // No bounce or spring in GH: sharp ease-out for everything that enters.
    enter: [0.2, 0.8, 0.2, 1],
    pop: [0.2, 0.8, 0.2, 1],
  },
  logo: { src: "gh-logo.png", width: 160, height: 160, round: true },
};
