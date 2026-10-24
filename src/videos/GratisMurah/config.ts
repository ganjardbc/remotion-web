// All copy and timing for "Gratis Bukan Berarti Murah". Edit here, not in scenes.
// Times are in seconds, relative to the start of each scene.

export const FPS = 30;
// Cross-fade between scenes; each scene is lengthened by this much so the
// nominal scene boundaries (and the 43s total) stay where the script puts them.
export const TRANSITION_FRAMES = 15;

export const SCENE_SECONDS = {
  hook: 3,
  relate: 7,
  fallback: 9,
  urgency: 5,
  safety: 8,
  closing: 6,
  cta: 5,
} as const;

export const COPY = {
  hook: {
    main: ["Stack AI coding-ku ", "Rp0", " per bulan."],
    follow: "Tetapi bukan gratis.",
  },
  relate: {
    title: "Yang kamu bayar",
    cards: [
      { icon: "batteryLow", text: "Limit habis di tengah pekerjaan" },
      { icon: "triangleAlert", text: "Error muncul tiba-tiba" },
      { icon: "clock", text: "Waktu terbuang untuk debug tool" },
    ],
  },
  fallback: {
    title: "Fallback itu seperti asuransi",
    nodes: ["Request", "Model A", "Model B", "Hasil"],
    limitLabel: "limit",
    footer: "Satu gagal, pekerjaan tetap jalan.",
  },
  urgency: {
    main: "Itu baru bagian pertama.",
    sub: "Penyebab setup gratis gagal diam-diam ada di bagian akhir.",
  },
  safety: {
    title: "Berjalan di sini, belum tentu berjalan di sana",
    sameModel: "Model yang sama",
    toolA: { label: "Tool A", result: "berhasil" },
    toolB: { label: "Tool B", result: "ditolak" },
    footer: "Baru ketahuan setelah kamu terlanjur memakainya.",
  },
  closing: {
    line1: "Token gratis tetap bisa berujung mahal.",
    line2Before: "Biaya aslinya: pekerjaan yang ",
    line2Accent: "berhenti di tengah jalan.",
  },
  cta: {
    main: "Ikuti untuk melihat setup-ku yang asli.",
    secondBefore: "Komentar ",
    badge: "STACK",
    secondAfter: " jika ingin panduan lengkapnya.",
  },
} as const;

export const TIMING = {
  hook: { main: 0.1, rp0: 0.2, follow: 1, star: 2.2 },
  relate: { title: 0, firstCard: 0.8, cardGap: 0.6, iconBounceLag: 0.35 },
  fallback: {
    title: 0,
    nodesIn: 0.3,
    nodeGap: 0.12,
    flowRequestToA: 1.5,
    aFails: 2.4,
    flowAToB: 3.2,
    bPasses: 4.1,
    flowBToResult: 4.9,
    resultLights: 5.6,
    footer: 6.6,
    flowDuration: 0.6,
  },
  urgency: { main: 0.2, steps: 0.9, fill: 1.3, sub: 2.2, lockShake: 3.7 },
  safety: {
    title: 0,
    toolA: 0.9,
    resultA: 2.2,
    toolB: 3.4,
    resultB: 4.7,
    footer: 6.2,
  },
  closing: { line1: 0.4, gap: 0.8, accentAfter: 0.5 },
  cta: { main: 0.2, second: 1, pulse1: 1.8, pulse2: 2.5 },
} as const;
