import type { CastCue, DraftScene } from "../../dialog-reels";

// Data scene AiBukanGoogleReels (Reels dialog, seri "Belajar AI" episode 1, gaya block). Ganjar = murid, Claude Code = guru.
// Semua scene latar komputer malam (karakter berdiri di atas keyboard, layar monitor berisi meter dan baris kode samar);
// layar menampilkan karakter yang sedang bicara saja (META.shots = "bicara"), jadi ekspresi dan gerak tiap karakter hanya terlihat di barisnya.
// Gerak block = nama gesture (`motions` per baris). `from` dan `dur` hanya perkiraan; setelah voiceover ada, durasi scene mengikuti audio.
// Satu sorotan oranye (`*frasa*`) per teks layar.

const cast = (ganjar: string, cc: string): readonly CastCue[] => [
  { character: "ganjar", expression: ganjar, motion: null, position: "kiri" },
  { character: "claudecode", expression: cc, motion: null, position: "kanan" },
];

export const BASE_SCENES: readonly DraftScene[] = [
  {
    id: "hook",
    seconds: 7.6,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "brand", level: [0.2, 0.2], label: "Cari", code: "mengalir" },
    tone: "biru",
    cast: cast("bingung", "netral"),
    onScreenText: "AI *Bukan* Google",
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.6, text: "Guru, aku pakai AI persis kayak Google. Ada yang salah?", shot: "medium", tag: "curious", motions: { ganjar: "garukKepala" }, expressions: { ganjar: "bingung", claudecode: "netral" } },
      { who: "claudecode", from: 4.1, dur: 2.9, text: "Salah besar. Keduanya bukan hal yang sama.", shot: "lowAngle", tag: "firmly", motions: { claudecode: "angkatTangan" }, expressions: { claudecode: "serius", ganjar: "kaget" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    id: "beda",
    seconds: 8.3,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "tenang", level: [0.2, 0.9], at: 1.6, sec: 4, label: "Halaman Ditemukan", code: "mengalir" },
    cast: cast("mikir", "netral"),
    onScreenText: "Google *Mencari*",
    lines: [
      { who: "ganjar", from: 0.3, dur: 1, text: "Bedanya apa?", shot: "closeUp", motions: { ganjar: "mikir" }, expressions: { ganjar: "mikir", claudecode: "netral" } },
      { who: "claudecode", from: 1.6, dur: 4.9, text: "Google itu mencari. Kamu mengetik, dia menunjukkan halaman yang sudah ada.", shot: "medium", push: true, motions: { claudecode: "tunjuk" }, expressions: { claudecode: "senang", ganjar: "mikir" } },
      { who: "ganjar", from: 6.9, dur: 0.8, text: "Kalau AI?", shot: "dutch", motions: { ganjar: "angkatBahu" }, expressions: { ganjar: "bingung", claudecode: "senang" } },
    ],
  },
  {
    id: "susun",
    seconds: 9.7,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "gelap", level: [0, 1], at: 0.5, sec: 8, label: "Kata Berikutnya", code: "mengalir" },
    cast: cast("mikir", "serius"),
    onScreenText: "AI *Menyusun*",
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.6, text: "AI menyusun. Dia tidak membuka arsip.", shot: "medium", tag: "calmly", motions: { claudecode: "tunjuk" }, expressions: { claudecode: "serius", ganjar: "mikir" } },
      { who: "claudecode", from: 3, dur: 6.4, text: "Dia menebak kata berikutnya yang paling masuk akal, dari pola jutaan tulisan yang pernah dia pelajari.", shot: "closeUp", motions: { claudecode: "tunjuk" }, expressions: { claudecode: "serius", ganjar: "mikir" }, screenText: "Tebak Kata *Berikutnya*" },
    ],
  },
  {
    id: "yakin",
    seconds: 6.4,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "terang", level: [1, 1], label: "Yakin", code: "mengalir" },
    cast: cast("kaget", "netral"),
    onScreenText: "Terdengar *Yakin*",
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.7, text: "Pantas jawabannya selalu terdengar yakin.", shot: "closeUp", tag: "realizing", motions: { ganjar: "tepuk" }, expressions: { ganjar: "kaget", claudecode: "netral" } },
      { who: "claudecode", from: 3.4, dur: 2.4, text: "Betul. Tapi lancar belum tentu benar.", shot: "highAngle", motions: { claudecode: "angkatTangan" }, expressions: { claudecode: "serius", ganjar: "mikir" }, screenText: "Lancar Belum Tentu *Benar*" },
    ],
  },
  {
    id: "kesimpulan",
    seconds: 3.8,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "gelap", level: [1, 0.5], label: "Menemukan / Membuat", code: "beku", freezeAt: 2 },
    tone: "gelap",
    cast: cast("mikir", "serius"),
    onScreenText: "Google Menemukan, AI *Membuat*",
    lines: [
      { who: "claudecode", from: 0.3, dur: 3, text: "Google menemukan jawaban. AI membuat jawaban.", shot: "closeUp", push: true, tag: "calmly", motions: { claudecode: "tunjuk" }, expressions: { claudecode: "serius", ganjar: "mikir" } },
    ],
  },
  {
    id: "teaser",
    seconds: 9.6,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "tenang", level: [0.3, 0.3], label: "Prompt", code: "mengalir" },
    cast: cast("bingung", "netral"),
    onScreenText: "Terus Harus *Gimana*?",
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.5, text: "Terus aku harus gimana?", shot: "medium", motions: { ganjar: "angkatBahu" }, expressions: { ganjar: "bingung", claudecode: "netral" } },
      { who: "claudecode", from: 2.1, dur: 6.9, text: "Karena AI menebak dari tulisanmu, cara kamu bertanya menentukan hasilnya. Itu pelajaran berikutnya.", shot: "overShoulder", motions: { claudecode: "tunjuk" }, expressions: { claudecode: "senang", ganjar: "mikir" }, screenText: "Cara Bertanya *Menentukan* Hasil" },
    ],
  },
  {
    id: "cta",
    seconds: 4.2,
    backdrop: "komputer",
    time: "malam",
    tokenBack: { mood: "brand", level: [0.5, 0.5], label: "1/15", code: "mengalir" },
    tone: "biru",
    cast: cast("senang", "senang"),
    onScreenText: "Belajar AI Seri *1 Dari 15*",
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.3, text: "Follow supaya kamu tidak ketinggalan urutannya.", shot: "pov", tag: "warmly", motions: { claudecode: "lambai" }, expressions: { claudecode: "senang", ganjar: "senang" }, sfx: [{ name: "ding", at: 2.6, volume: 0.4 }] },
    ],
  },
];
