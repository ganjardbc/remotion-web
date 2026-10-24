// All copy and timing for "File Ini Bisa Dibajak Agenmu". Edit here, not in scenes.
// Times are in seconds, relative to the start of each scene.

export const FPS = 30;
// Cross-fade between scenes; each scene is lengthened by this much so the
// nominal scene boundaries (and the 40s total) stay where the script puts them.
export const TRANSITION_FRAMES = 15;

export const SCENE_SECONDS = {
  hook: 4,
  relate: 8,
  shift: 11,
  urgency: 6,
  closing: 6,
  cta: 5,
} as const;

export const COPY = {
  hook: {
    main: "Agen coding-mu membaca file instruksi di repo.",
    followBefore: "Termasuk di repo yang ",
    followAccent: "bukan punyamu",
    followAfter: ".",
  },
  relate: {
    title: "Mengapa kita melonggarkan izin",
    cards: [
      { icon: "bellRing", text: "Popup izin membuat kerja terputus" },
      { icon: "mousePointerClick", text: "Lama-lama klik Allow tanpa membaca" },
    ],
    stamp: { icon: "userCheck", text: "Tanggung jawab tetap di kamu" },
  },
  shift: {
    title: "Instruksi bisa disusupi",
    files: [
      { icon: "fileText", name: "CLAUDE.md" },
      { icon: "fileText", name: "SKILL.md" },
      { icon: "plug", name: "konfigurasi MCP" },
    ],
    source: "dari pihak ketiga",
    // Index into `files` of the card that carries the highlighted line.
    flaggedFile: 1,
    flaggedLabel: "instruksi yang tidak kamu inginkan",
    line1: "Percobaan seperti ini sudah muncul di repo publik.",
    line2: "Pengaman ada, tetapi tidak ada yang kebal.",
  },
  urgency: {
    main: "Ada tiga kebiasaan sederhana yang menutup sebagian besar celahnya.",
    step: { icon: "bookOpenCheck", text: "Baca dulu sebelum dipasang" },
    // Steps 2 and 3: blurred, locked, no copy.
    lockedSteps: 2,
    sub: "Dua lainnya di konten berikutnya.",
  },
  closing: {
    line1: "Agen yang kamu beri izin tanpa baca",
    line2Before: "sama saja dengan ",
    line2Accent: "pintu yang kamu biarkan terbuka",
    line2After: ".",
  },
  cta: {
    main: "Ikuti untuk dua kebiasaan sisanya.",
    secondBefore: "Komentar ",
    badge: "AMAN",
    secondAfter: " jika ingin panduan keamanan praktisnya.",
  },
} as const;

export const TIMING = {
  // follow = main + 1.2s
  hook: { main: 0.2, follow: 1.4 },
  // card 2 lands 0.7s after card 1; stamp after both are in.
  relate: { title: 0, firstCard: 0.8, cardGap: 0.7, stamp: 3.2 },
  shift: {
    title: 0,
    firstCard: 0.8,
    cardGap: 0.8,
    highlight: 4,
    flaggedLabel: 4.5,
    firstArrow: 5.4,
    arrowGap: 0.3,
    arrowDuration: 0.8,
    agent: 5.2,
    line1: 7.2,
    line2: 9,
  },
  urgency: {
    main: 0.2,
    firstStep: 1,
    stepGap: 0.5,
    open: 2.4,
    check: 2.9,
    sub: 3.8,
    lockShake: 4.8,
  },
  closing: { line1: 0.4, gap: 0.8, accentAfter: 0.5 },
  cta: { main: 0.2, second: 1, pulse1: 1.8, pulse2: 2.5 },
} as const;
