import type { BlockScene } from "../../block-reels";

// Data scene AiBukanGoogleBlock (Reels block, seri "Belajar AI" episode 1). Ganjar = murid, Robot = guru.
// Waktu `from` dan `dur` adalah perkiraan (±15 huruf per detik) sampai voiceover ada; geser ulang `sfx.at` dan `shot` setelah klip jadi.
// Latar kelas di semua scene: guru (Robot) di atas meja kiri, murid (Ganjar) berdiri di lantai kanan, papan tulis besar di belakang. Judul tampil di kartu atas hanya di scene pertama (config.ts).
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: Ganjar menyamakan AI dengan Google, Robot langsung membantah.
    id: "hook",
    seconds: 7.6,
    set: "kelas",
    board: [
      { text: "AI = Google?", at: 0.6 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.6, text: "Guru, aku pakai AI persis kayak Google. Ada yang salah?", spoken: "Guru, aku pakai Ei Ai persis kayak Google. Ada yang salah?", tag: "curious", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "robot", from: 4.1, dur: 2.9, text: "Salah besar. Keduanya bukan hal yang sama.", tag: "firmly", shot: "lowAngle", expressions: { robot: "serius", ganjar: "kaget" }, motions: { robot: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: Google mencari.
    id: "beda",
    seconds: 8.3,
    set: "kelas",
    board: [
      { text: "Google = mencari", at: 1.8 },
      { text: "tunjuk halaman yang ada", at: 4.2 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1, text: "Bedanya apa?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "robot", from: 1.6, dur: 4.9, text: "Google itu mencari. Kamu mengetik, dia menunjukkan halaman yang sudah ada.", tag: "calmly", shot: "medium", push: true, expressions: { robot: "senang" }, motions: { robot: "tunjuk" } },
      { who: "ganjar", from: 6.9, dur: 0.8, text: "Kalau AI?", spoken: "Kalau Ei Ai?", tag: "curious", shot: "dutch", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
    ],
  },
  {
    // Penjelasan 2: AI menyusun, menebak kata berikutnya.
    id: "susun",
    seconds: 9.7,
    set: "kelas",
    board: [
      { text: "AI = menyusun", at: 0.4 },
      { text: "tebak kata berikutnya", at: 3.2 },
      { text: "dari pola jutaan tulisan", at: 5.6 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 2.6, text: "AI menyusun. Dia tidak membuka arsip.", spoken: "Ei Ai menyusun. Dia tidak membuka arsip.", tag: "calmly", shot: "medium", expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
      { who: "robot", from: 3, dur: 6.4, text: "Dia menebak kata berikutnya yang paling masuk akal, dari pola jutaan tulisan yang pernah dia pelajari.", tag: "calmly", shot: [{ at: 0, kind: "closeUp" }, { at: 3.4, kind: "highAngle" }], expressions: { robot: "serius" } },
    ],
  },
  {
    // Penjelasan 3: terdengar yakin, belum tentu benar.
    id: "yakin",
    seconds: 6.4,
    set: "kelas",
    board: [
      { text: "Terdengar yakin", at: 0.6 },
      { text: "belum tentu benar", at: 3.6, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "kaget", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.7, text: "Pantas jawabannya selalu terdengar yakin.", tag: "realizing", shot: "closeUp", expressions: { ganjar: "kaget" }, motions: { ganjar: "tepuk" } },
      { who: "robot", from: 3.4, dur: 2.4, text: "Betul. Tapi lancar belum tentu benar.", tag: "serious", shot: "overShoulder", expressions: { robot: "serius", ganjar: "mikir" }, motions: { robot: "angkatTangan" } },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 3.8,
    set: "kelas",
    board: [
      { text: "Google menemukan", at: 0.4 },
      { text: "AI membuat", at: 1.8, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 3, text: "Google menemukan jawaban. AI membuat jawaban.", spoken: "Google menemukan jawaban. Ei Ai membuat jawaban.", tag: "calm", shot: "closeUp", push: true, expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Teaser: pelajaran berikutnya soal cara bertanya.
    id: "teaser",
    seconds: 9.6,
    set: "kelas",
    board: [
      { text: "Cara bertanya", at: 2.3 },
      { text: "menentukan hasil", at: 4.1 },
      { text: "Pelajaran berikutnya", at: 7.2 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.5, text: "Terus aku harus gimana?", tag: "confused", shot: "medium", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
      { who: "robot", from: 2.1, dur: 6.9, text: "Karena AI menebak dari tulisanmu, cara kamu bertanya menentukan hasilnya. Itu pelajaran berikutnya.", spoken: "Karena Ei Ai menebak dari tulisanmu, cara kamu bertanya menentukan hasilnya. Itu pelajaran berikutnya.", tag: "calmly", shot: "wide", expressions: { robot: "senang", ganjar: "mikir" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // CTA: Robot menghadap penonton.
    id: "cta",
    seconds: 4.2,
    set: "kelas",
    board: [
      { text: "Belajar AI #1 dari 15", at: 0.5 },
    ],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 3.3, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly", shot: "pov", expressions: { robot: "senang", ganjar: "senang" }, motions: { robot: "lambai" } },
    ],
  },
];
