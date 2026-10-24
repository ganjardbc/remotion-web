// All copy and timing for "Kamu Bukan Lagi Penulis UI". Edit here, not in scenes.
// Times are in seconds, relative to the start of each scene.

export const FPS = 30;
// Cross-fade between scenes; each scene is lengthened by this much so the
// nominal scene boundaries (and the 38s total) stay where the script puts them.
export const TRANSITION_FRAMES = 15;

export const SCENE_SECONDS = {
  hook: 4,
  relate: 8,
  shift: 10,
  urgency: 6,
  closing: 5,
  cta: 5,
} as const;

export const COPY = {
  hook: {
    main: "Sekarang frontend developer lebih sering",
    followBefore: "",
    followAccent: "me-review",
    followAfter: " UI daripada menulisnya.",
  },
  relate: {
    title: "Pernah melihat UI buatan AI seperti ini?",
    markers: [
      { icon: "layoutTemplate", text: "Rapi tetapi hambar" },
      { icon: "ruler", text: "Spacing meleset sedikit" },
      { icon: "palette", text: "Warna tidak cocok dengan brand" },
    ],
  },
  shift: {
    title: "Ajari dulu, baru suruh",
    left: { icon: "sparkles", label: "Buat yang bagus" },
    right: { icon: "swatchBook", label: "Token + komponen acuan" },
    bottom: "AI belum tahu aturan visualmu, jadi hasilnya meleset.",
  },
  urgency: {
    main: "Itu baru setengah ceritanya.",
    sub: "Setengahnya lagi: skill frontend yang justru makin mahal.",
  },
  closing: {
    line1: "Developer yang bertahan",
    line2Before: "adalah yang paling jeli ",
    line2Accent: "menilai",
    line2After: " UI.",
  },
  cta: {
    main: "Ikuti jika kamu frontend dan penasaran skill apa itu.",
    secondBefore: "Komentar ",
    badge: "FRONTEND",
    secondAfter: " jika ingin panduan lengkapnya.",
  },
} as const;

export const TIMING = {
  // follow = main + 1.2s
  hook: { main: 0.2, follow: 1.4 },
  // wireframe first, then markers land 0.8s apart; the measure line and the
  // off-brand button colour show up with their own marker.
  relate: {
    title: 0,
    wireframe: 0.6,
    firstMarker: 2.4,
    markerGap: 0.8,
    measureDuration: 0.6,
  },
  shift: {
    title: 0,
    left: 0.8,
    right: 3.4,
    // right wireframe tidies up (spacing + palette) after it lands.
    tidy: 4.4,
    tidyDuration: 1.4,
    bottom: 7,
  },
  urgency: {
    main: 0.2,
    ring: 1,
    ringDuration: 1.6,
    sub: 3.2,
    lockShake: 4.6,
  },
  closing: { line1: 0.4, gap: 0.8, accentAfter: 0.5 },
  cta: { main: 0.2, second: 1, pulse1: 1.8, pulse2: 2.5 },
} as const;
