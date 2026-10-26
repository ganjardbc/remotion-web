import { createContext, useContext } from "react";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";

// Sistem desain khusus video ini: tiap era punya palet dan pola latar sendiri,
// satu keluarga huruf (Bricolage Grotesque + Space Mono), bentuk datar tanpa bayangan lembut.
const heading = loadBricolage("normal", { weights: ["600", "700", "800"], subsets: ["latin"] }).fontFamily;
const mono = loadSpaceMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const FONTS = { heading, mono } as const;

export type Pattern = "dots" | "grid" | "stripes" | "rings" | "none";

export type Era = {
  readonly name: string;
  // Keluarga huruf, supaya satu set ilustrasi bisa dipakai di sistem desain lain.
  readonly fontHeading: string;
  readonly fontMono: string;
  readonly bg: string;
  // Bentuk dekoratif besar di latar.
  readonly shape: string;
  readonly ink: string;
  readonly muted: string;
  readonly accent: string;
  readonly onAccent: string;
  // Kartu dan balon bicara.
  readonly panel: string;
  readonly panelInk: string;
  // Lingkaran terang di belakang karakter agar kaos hitam tetap terbaca.
  readonly spot: string;
  readonly spotOpacity: number;
  readonly ground: string;
  readonly groundLine: string;
  readonly pattern: Pattern;
};

const FONT_TOKENS = { fontHeading: FONTS.heading, fontMono: FONTS.mono } as const;

export const ERAS = {
  paper: {
    name: "paper", ...FONT_TOKENS, bg: "#F4EBDD", shape: "#EBD9BC", ink: "#1E1B18", muted: "#6E655A",
    accent: "#FF5A36", onAccent: "#1E1B18", panel: "#FFFFFF", panelInk: "#1E1B18",
    spot: "#FFD3A1", spotOpacity: 0.7, ground: "#E2CDAA", groundLine: "#1E1B18", pattern: "dots",
  },
  teal: {
    name: "teal", ...FONT_TOKENS, bg: "#1F6F6B", shape: "#195A57", ink: "#F7EFD9", muted: "#BFE0DA",
    accent: "#F2B632", onAccent: "#14302E", panel: "#F7EFD9", panelInk: "#14302E",
    spot: "#F3E6C4", spotOpacity: 0.92, ground: "#15524F", groundLine: "#F7EFD9", pattern: "grid",
  },
  burgundy: {
    name: "burgundy", ...FONT_TOKENS, bg: "#5B1F2E", shape: "#4A1824", ink: "#F6E7C8", muted: "#D8B9A8",
    accent: "#E5B84B", onAccent: "#3B1219", panel: "#F6E7C8", panelInk: "#3B1219",
    spot: "#F1DDB0", spotOpacity: 0.92, ground: "#3F1320", groundLine: "#E5B84B", pattern: "stripes",
  },
  ice: {
    name: "ice", ...FONT_TOKENS, bg: "#DCE8F2", shape: "#C5D8E8", ink: "#12263A", muted: "#4B6A86",
    accent: "#2F6FDB", onAccent: "#FFFFFF", panel: "#FFFFFF", panelInk: "#12263A",
    spot: "#FFFFFF", spotOpacity: 0.85, ground: "#F5FAFF", groundLine: "#12263A", pattern: "dots",
  },
  blue: {
    name: "blue", ...FONT_TOKENS, bg: "#12307A", shape: "#0D2660", ink: "#FFFFFF", muted: "#B7C6EE",
    accent: "#6DF2B1", onAccent: "#0D2660", panel: "#FFFFFF", panelInk: "#0D2660",
    spot: "#E4ECFF", spotOpacity: 0.92, ground: "#0A1E4E", groundLine: "#6DF2B1", pattern: "grid",
  },
  forest: {
    name: "forest", ...FONT_TOKENS, bg: "#123D33", shape: "#0D2F27", ink: "#F4EBD0", muted: "#B6CFC1",
    accent: "#F2C14E", onAccent: "#123D33", panel: "#F4EBD0", panelInk: "#123D33",
    spot: "#F1E6C0", spotOpacity: 0.92, ground: "#0A2620", groundLine: "#F2C14E", pattern: "rings",
  },
  violet: {
    name: "violet", ...FONT_TOKENS, bg: "#2B1B6B", shape: "#22155A", ink: "#F5F0FF", muted: "#C9BDF0",
    accent: "#C6F432", onAccent: "#2B1B6B", panel: "#F5F0FF", panelInk: "#2B1B6B",
    spot: "#E6DDFF", spotOpacity: 0.92, ground: "#1A1050", groundLine: "#C6F432", pattern: "dots",
  },
} as const satisfies Record<string, Era>;

export type EraName = keyof typeof ERAS;

const EraContext = createContext<Era>(ERAS.paper);
export const EraProvider = EraContext.Provider;
export const useEra = (): Era => useContext(EraContext);
