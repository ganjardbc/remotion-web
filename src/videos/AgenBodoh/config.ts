// All copy and timing for "Agen Bodoh Itu Salah Siapa?". Edit here, not in scenes.
// Times are in seconds, relative to the start of each scene.

export const FPS = 30;
// Cross-fade between scenes; each scene is lengthened by this much so the
// nominal scene boundaries (and the 39s total) stay where the script puts them.
export const TRANSITION_FRAMES = 15;

export const SCENE_SECONDS = {
  hook: 4,
  relate: 7,
  shift: 10,
  urgency: 6,
  closing: 6,
  cta: 6,
} as const;

export const COPY = {
  hook: {
    main: "Agen coding-mu tidak bodoh.",
    followBefore: "Dia hanya diberi ruang kerja ",
    followAccent: "tanpa aturan.",
  },
  relate: {
    title: "Hasilnya tidak konsisten",
    cards: [
      { icon: "circleCheck", label: "Hari ini", text: "Brilian" },
      {
        icon: "triangleAlert",
        label: "Besok",
        text: "Berantakan di proyek yang sama",
      },
    ],
    bubble: "Ganti model saja?",
  },
  shift: {
    title: "Sering kali instruksinya yang kurang",
    main: "Karena file instruksi itu seperti kontrak.",
    fileName: "AGENTS.md / CLAUDE.md",
    rows: [
      { icon: "folder", text: "Struktur proyek" },
      { icon: "code", text: "Gaya kode" },
      { icon: "ban", text: "Hal yang dilarang" },
    ],
    stamp: "KONTRAK",
  },
  urgency: {
    main: "Ini hanya satu dari tiga layer.",
    layers: ["Layer 1", "Layer 2", "Layer 3"],
    sub: "Dua layer sisanya yang membuat hasilnya stabil.",
  },
  closing: {
    line1: "Model pintar tanpa harness",
    line2Before: "sama seperti developer senior yang disuruh bekerja ",
    line2Accent: "tanpa brief.",
  },
  cta: {
    main: "Ikuti supaya tidak ketinggalan dua layer sisanya.",
    secondBefore: "Komentar ",
    badge: "HARNESS",
    secondAfter: " jika ingin panduan lengkapnya.",
  },
} as const;

export const TIMING = {
  hook: { main: 0.2, follow: 1.4 },
  relate: { title: 0, firstCard: 0.8, cardGap: 0.7, bubble: 2.9 },
  shift: {
    title: 0,
    main: 0.8,
    card: 1.8,
    firstRow: 3,
    rowGap: 0.8,
    stamp: 7.4,
  },
  urgency: {
    main: 0.2,
    firstLayer: 0.8,
    layerGap: 0.6,
    sub: 3,
    lockShake: 4.6,
  },
  closing: { line1: 0.4, gap: 0.8, accentAfter: 0.5 },
  cta: { main: 0.2, second: 1, pulse1: 1.8, pulse2: 2.5 },
} as const;
