import type { BlockScene } from "../../block-reels";

// Data scene TokenSatuanBlock (Reels block, seri "Belajar AI" episode 3). Ganjar = murid, Robot = guru.
// Waktu `from` dan `dur` adalah perkiraan (±14 huruf per detik) sampai voiceover ada; geser ulang `board.at`, `sfx.at`, dan `shot` setelah klip jadi.
// Latar kelas di semua scene: guru (Robot) di atas meja kiri, murid (Ganjar) berdiri di lantai kanan, papan tulis besar di belakang.
// Judul tampil di papan scene pertama (config.ts). Shot rapat meredupkan papan, jadi baris yang sedang ditulis dipegang dengan shot `wide`.
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: chat kena limit padahal tulisan sedikit, AI menghitung dalam potongan.
    id: "hook",
    seconds: 10.8,
    set: "kelas",
    board: [
      { text: "chat kena limit", at: 2.6 },
      { text: "AI hitung: potongan", at: 8.2 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 4.93, text: "Guru, kenapa chat AI-ku tiba-tiba kena limit? Padahal aku nggak nulis banyak.", spoken: "Guru, kenapa chat Ei Ai-ku tiba-tiba kena limit? Padahal aku nggak nulis banyak.", tag: "frustrated", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "robot", from: 5.4, dur: 4.95, text: "Karena AI tidak menghitung dalam kata. Dia menghitung dalam potongan.", spoken: "Karena Ei Ai tidak menghitung dalam kata. Dia menghitung dalam potongan.", tag: "firmly", shot: [{ at: 0, kind: "lowAngle" }, { at: 2.2, kind: "wide" }], expressions: { robot: "serius", ganjar: "kaget" }, motions: { robot: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: namanya token, contoh "berjualan" terpotong tiga.
    id: "potong",
    seconds: 13.1,
    set: "kelas",
    board: [
      { text: "Token = potongan teks", at: 1.9, hot: true },
      { text: "berjualan", at: 7.2 },
      { text: "ber | jual | an", at: 9.2 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.19, text: "Potongan apa?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "robot", from: 1.65, dur: 10.24, text: "Namanya token. Tulisanmu dipotong oleh AI jadi bagian kecil. Misalnya \"berjualan\" jadi \"ber\", \"jual\", \"an\".", spoken: "Namanya token. Tulisanmu dipotong oleh Ei Ai jadi bagian kecil. Misalnya \"berjualan\" jadi \"ber\", \"jual\", \"an\".", tag: "calmly", shot: "wide", expressions: { robot: "senang" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 2: satu kata bisa lebih dari satu token, bahasa Indonesia lebih banyak.
    id: "hitung",
    seconds: 8.5,
    set: "kelas",
    board: [
      { text: "1 kata bisa > 1 token", at: 0.8 },
      { text: "Indonesia lebih banyak", at: 3 },
      { text: "dibanding Inggris", at: 6 },
    ],
    cast: [
      { character: "ganjar", expression: "kaget", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 7.78, text: "Satu kata bisa dihitung lebih dari satu. Kata bahasa Indonesia malah sering terpotong lebih banyak daripada bahasa Inggris.", tag: "matter-of-fact", shot: "wide", expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 3: semua dihitung dari token.
    id: "limit",
    seconds: 8.2,
    set: "kelas",
    board: [
      { text: "Semua dihitung token", at: 0.5 },
      { text: "Batas percakapan", at: 3.3 },
      { text: "Kecepatan", at: 4.9 },
      { text: "Biaya (API)", at: 6.5 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 7.52, text: "Semua dihitung dari potongan itu: batas percakapan, kecepatan, bahkan biaya lewat API.", spoken: "Semua dihitung dari potongan itu: batas percakapan, kecepatan, bahkan biaya lewat Ei Pi Ai.", tag: "calmly", shot: "wide", expressions: { robot: "senang" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 5.4,
    set: "kelas",
    board: [
      { text: "Kamu menulis dengan kata", at: 0.4 },
      { text: "AI membayar dengan token", at: 2.5, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 4.73, text: "Kamu menulis dengan kata. AI membayarnya dengan token.", spoken: "Kamu menulis dengan kata. Ei Ai membayarnya dengan token.", tag: "calm", shot: "wide", push: true, expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Teaser: potongan penuh, AI bisa lupa (pelajaran berikutnya).
    id: "teaser",
    seconds: 8.1,
    set: "kelas",
    board: [
      { text: "Potongan penuh?", at: 0.6 },
      { text: "AI bisa lupa", at: 4.2 },
      { text: "Pelajaran berikutnya", at: 6.1 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.86, text: "Kalau potongannya sudah penuh, apa yang terjadi?", tag: "curious", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
      { who: "robot", from: 3.35, dur: 4.38, text: "Itulah kenapa AI bisa lupa. Pelajaran berikutnya.", spoken: "Itulah kenapa Ei Ai bisa lupa. Pelajaran berikutnya.", tag: "calmly", shot: "wide", expressions: { robot: "senang", ganjar: "mikir" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // CTA: Robot menghadap penonton.
    id: "cta",
    seconds: 4.3,
    set: "kelas",
    board: [{ text: "Belajar AI #3 dari 15", at: 0.5 }],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 3.59, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly", shot: "pov", expressions: { robot: "senang", ganjar: "senang" }, motions: { robot: "lambai" } },
    ],
  },
];
