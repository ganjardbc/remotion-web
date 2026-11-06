import type { CastCue, DraftScene } from "../../dialog-reels";

// Data scene TokenHabis (Reels dialog, Format A, gaya block). Semua scene latar komputer malam (ComputerBack: karakter berdiri di atas keyboard, layar monitor di belakang berisi meter token, baris kode, dan warna mood); layar menampilkan karakter yang sedang
// bicara saja (META.shots = "bicara"), jadi ekspresi dan gerak tiap karakter hanya terlihat di barisnya sendiri.
// Gerak block = nama gesture statis per scene (`motion` di cast): lambai, angkatTangan, tunjuk, sorak, menyerah.
// `from` dan `dur` hanya perkiraan; setelah voiceover ada, durasi scene mengikuti audio.
// `*frasa*` di teks layar = sorotan oranye (satu per layar).

const cast = (ganjar: string, cc: string, gMotion: string | null = null, cMotion: string | null = null): readonly CastCue[] => [
  { character: "ganjar", expression: ganjar, motion: gMotion, position: "kiri" },
  { character: "claudecode", expression: cc, motion: cMotion, position: "kanan" },
];

export const BASE_SCENES: readonly DraftScene[] = [
  {
    id: "hook",
    seconds: 5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "alarm", level: [1, 0], at: 0.4, sec: 1.8, label: "Reset 17.00", code: "mengalir", freezeAt: 2.2 },
    tone: "biru",
    cast: cast("netral", "serius"),
    onScreenText: "Token Habis, Skill Developer Ikut *Habis*",
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.6, text: "Limit tercapai. Reset jam lima sore.", shot: "lowAngle", motions: { claudecode: "netral" }, tag: "deadpan", expressions: { claudecode: "serius", ganjar: "kaget" } },
      { who: "ganjar", from: 3.2, dur: 1.5, text: "Hah? Sekarang?", shot: "extremeCloseUp", motions: { ganjar: "menyerah", claudecode: "netral" }, tag: "panicked", expressions: { ganjar: "kaget", claudecode: "serius" } },
    ],
  },
  {
    id: "relate",
    seconds: 3.5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "tenang", level: [0, 0], label: "Reset 17.00", code: "beku" },
    cast: cast("senang", "mikir"),
    onScreenText: "Tadi Pagi Aku *10x* Lebih Cepat",
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.9, text: "Tadi pagi aku sepuluh kali lebih cepat.", shot: "medium", motions: { ganjar: "sorak" }, spoken: "Tadi pagi aku sepuluh kali lebih cepat.", tag: "proud", expressions: { ganjar: "senang" } },
    ],
  },
  {
    id: "tanya",
    seconds: 2,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "tenang", level: [0, 0], label: "Reset 17.00", code: "beku" },
    // Claude sendirian di frame (Ganjar tidak ada di cast).
    cast: [{ character: "claudecode", expression: "mikir", motion: null, position: "tengah" }],
    onScreenText: "Pagi *10x*, Sekarang?",
    lines: [
      { who: "claudecode", from: 0.3, dur: 1.2, text: "Sekarang?", shot: "closeUp", motions: { claudecode: "mikir" }, tag: "deadpan", expressions: { claudecode: "mikir" } },
    ],
  },
  {
    id: "lupa",
    seconds: 3,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "gelap", level: [0, 0], label: "Reset 17.00", code: "beku" },
    cast: [{ character: "ganjar", expression: "malu", motion: null, position: "tengah" }],
    onScreenText: "Lupa Cara Nulis *For Loop*",
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.8, text: "Aku lupa cara nulis for loop.", shot: "highAngle", motions: { ganjar: "garukKepala" }, tag: "sheepish", expressions: { ganjar: "malu" } },
    ],
  },
  {
    id: "shift",
    seconds: 5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "gelap", level: [0, 0], label: "Reset 17.00", code: "beku" },
    // Claude sendirian di frame (Ganjar tidak ada di cast), kamera diam.
    cast: [{ character: "claudecode", expression: "serius", motion: null, position: "tengah" }],
    onScreenText: "Kamu Tidak Lambat",
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.9, text: "Kamu tidak lambat. Kamu belum pernah latihan tanpa aku.", shot: "medium", push: true, motions: { claudecode: "tunjuk" }, tag: "calm", expressions: { claudecode: "serius" } },
    ],
  },
  {
    id: "bantah",
    seconds: 5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "gelap", level: [0, 0], label: "Reset 17.00", code: "beku" },
    cast: cast("kesal", "serius"),
    onScreenText: "Itu Tidak Adil",
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.5, text: "Itu tidak adil.", shot: "dutch", motions: { ganjar: "membelakangi", claudecode: "netral" }, tag: "defensive", expressions: { ganjar: "kesal", claudecode: "serius" } },
      { who: "claudecode", from: 2.1, dur: 2.5, text: "Alat yang bikin kamu berhenti bisa, bukan alat. Itu penopang.", shot: "lowAngle", push: true, motions: { claudecode: "angkatTangan", ganjar: "hadap" }, tag: "calm", screenText: "Bukan Alat, Tapi *Penopang*", expressions: { claudecode: "serius", ganjar: "serius" } },
    ],
  },
  {
    id: "urgency",
    seconds: 5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "alarm", level: [0, 0], label: "Reset 17.00", code: "beku", blink: true },
    cast: cast("kaget", "serius"),
    onScreenText: "Ini Baru Bagian Pertama",
    lines: [
      { who: "claudecode", from: 0.3, dur: 4.4, text: "Ini baru bagian pertama. Yang lebih serem: kamu sudah tidak sadar.", shot: "reveal", motions: { claudecode: "angkatBahu", ganjar: "facepalm" }, tag: "ominous", screenText: "Yang Lebih Serem: *Tidak Sadar*", expressions: { claudecode: "serius", ganjar: "kaget" } },
    ],
  },
  {
    id: "closing",
    seconds: 5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "terang", level: [0, 0.35], at: 0.5, sec: 4, label: "Mulai latihan", code: "mengalir" },
    tone: "gelap",
    cast: cast("serius", "senang"),
    onScreenText: "Satu Jam Tanpa AI",
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.3, text: "Besok aku coba satu jam tanpa kamu.", shot: "medium", motions: { ganjar: "pinggang", claudecode: "netral" }, tag: "determined", expressions: { ganjar: "serius", claudecode: "serius" } },
      { who: "claudecode", from: 2.9, dur: 2.0, text: "Bagus. Aku tunggu kamu tidak butuh aku.", shot: "wide", motions: { claudecode: "lambai", ganjar: "tepuk" }, tag: "warm", screenText: "Kamu *Tidak Butuh Aku*", expressions: { claudecode: "senang", ganjar: "senang" } },
    ],
  },
  {
    id: "cta",
    seconds: 5,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "brand", level: [0.35, 1], at: 0.3, sec: 3, label: "Terisi lagi", code: "mengalir" },
    tone: "biru",
    cast: cast("senang", "senang"),
    onScreenText: "Follow Biar Tetap *Jago*",
    screenExtra: "profilFollow",
    lines: [{ who: "ganjar", from: 0.3, dur: 4.4, text: "Follow kalau mau tahu cara tetap jago saat limit habis.", shot: [{ at: 0, kind: "wide" }, { at: 2.6, kind: "medium" }], motions: { ganjar: "tunjuk", claudecode: "putar" }, tag: "friendly" }],
  },
];
