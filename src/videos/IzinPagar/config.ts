// All copy, code-card text and timing for "Izin Itu Baru Satu Pagar". Edit here, not in scenes.
// Times are in seconds, relative to the start of each scene.

export const FPS = 30;
// Cross-fade between scenes; each scene is lengthened by this much so the
// nominal scene boundaries (and the 45s total) stay where the script puts them.
export const TRANSITION_FRAMES = 15;

export const SCENE_SECONDS = {
  hook: 4,
  relate: 7,
  shift1: 10,
  urgency: 5,
  shift2: 10,
  closing: 5,
  cta: 4,
} as const;

export const HANDLE = "@ganjar_hadiatna";

export const COPY = {
  hook: {
    main: "Kamu sudah mengatur izin agen coding-mu.",
    followBefore: "Tetapi itu baru ",
    followAccent: "satu layer.",
  },
  relate: {
    title: "Terasa aman",
    approve: "Allow",
    deny: "Deny",
    sub: "Izin hanya menjaga apa yang agen coba lakukan.",
  },
  shift1: {
    title: "Layer 1: repo asing",
    main: "Baca dulu trust dialog-nya.",
    rows: ["permission rules", "additional directories"],
    // Shown verbatim in the code card.
    code: 'claude --bare -p "ringkas struktur repo ini"',
    note: "Mode -p tidak menampilkan dialog itu.",
    noteDim: "Belum sepenuhnya aman.",
  },
  urgency: {
    main: "Jika berhenti di sini, kamu baru separuh aman.",
    sub: "Layer kedua tetap bekerja meski izinnya lolos.",
  },
  shift2: {
    title: "Layer 2: sandbox",
    // Shown verbatim in the code card.
    code: "/sandbox",
    outer: "Sistem operasi",
    inner: "Perintah shell agen",
    chips: [
      { icon: "keyRound", text: "~/.ssh — deny" },
      { icon: "fileLock", text: "~/.aws/credentials — deny" },
    ],
    note: "Default-nya mati. Untuk macOS, Linux, WSL2.",
    noteDim: "Tool file dan MCP tetap di luar sandbox.",
  },
  closing: {
    line1: "Izin menentukan apa yang boleh dicoba agen.",
    line2Before: "Sandbox membatasi dampak yang bisa terjadi ",
    line2Accent: "jika izin itu lolos.",
  },
  cta: {
    main: "Ikuti terus seri keamanan agen coding.",
    secondBefore: "Komentar ",
    badge: "AMAN",
    secondAfter: " jika ingin panduan lengkapnya.",
  },
} as const;

export const TIMING = {
  hook: { main: 0.2, follow: 1.4 },
  // Clicks accelerate: gaps shrink from 1.0s to 0.5s to 0.3s.
  relate: { title: 0, dialog: 0.5, clicks: [1.8, 2.9, 3.4], sub: 4.6 },
  shift1: {
    title: 0,
    main: 0.6,
    dialog: 1.4,
    rows: 2.4,
    rowGap: 0.6,
    shrink: 4.4,
    code: 4.6,
    type: 5.4,
    note: 7.4,
    noteDim: 8.8,
  },
  urgency: { main: 0.2, ring: 1, sub: 2.8, lockShake: 3.4 },
  shift2: {
    title: 0,
    code: 0.6,
    type: 1.2,
    layers: 0.6,
    glow: 1.6,
    glowDur: 1.2,
    chip1: 3.4,
    chipGap: 0.6,
    note: 5.6,
    noteDim: 7,
  },
  closing: { line1: 0.4, gap: 0.8, accentAfter: 0.5 },
  cta: { main: 0.2, second: 1, pulse1: 1.8, pulse2: 2.5 },
} as const;
