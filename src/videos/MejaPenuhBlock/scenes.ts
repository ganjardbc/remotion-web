import type { BlockScene } from "../../block-reels";

// Data scene MejaPenuhBlock (Reels block, seri "Belajar AI" episode 4). Ganjar = murid, Robot = guru.
// Waktu `from` dan `dur` adalah perkiraan (±14 huruf per detik) sampai voiceover ada; geser ulang `board.at`, `sfx.at`, dan `shot` setelah klip jadi.
// Latar kelas di semua scene: guru (Robot) di atas meja kiri, murid (Ganjar) berdiri di lantai kanan, papan tulis besar di belakang.
// Judul tampil di papan scene pertama (config.ts). Shot rapat meredupkan papan, jadi baris yang sedang ditulis dipegang dengan shot `wide`.
// `spoken`: hindari "AI" di awal kalimat setelah titik (pernah terbaca aneh di episode 3); tulis "Ei Ai".
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: AI tadi ingat, sekarang lupa. Mejanya sudah penuh.
    id: "hook",
    seconds: 8.9,
    set: "kelas",
    board: [
      { text: "tadi ingat, kini lupa", at: 1.5 },
      { text: "Mejanya sudah penuh", at: 6.8 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 5.01, text: "Guru, tadi AI-ku ingat semua instruksiku. Sekarang kok dia lupa?", spoken: "Guru, tadi Ei Ai-ku ingat semua instruksiku. Sekarang kok dia lupa?", tag: "confused", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "robot", from: 5.45, dur: 3.05, text: "Dia tidak lupa. Mejanya sudah penuh.", tag: "firmly", shot: [{ at: 0, kind: "lowAngle" }, { at: 1.2, kind: "wide" }], expressions: { robot: "serius", ganjar: "kaget" }, motions: { robot: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: AI punya satu meja kerja, namanya context window.
    id: "meja",
    seconds: 14.3,
    set: "kelas",
    board: [
      { text: "Meja kerja AI", at: 2.4 },
      { text: "pertanyaan + jawaban", at: 7.6 },
      { text: "obrolan sebelumnya", at: 9.6 },
      { text: "= context window", at: 12, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.04, text: "Meja apa?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "robot", from: 1.5, dur: 12.36, text: "Anggap AI punya satu meja kerja. Semua yang dia pegang harus muat di atasnya: pertanyaan, jawaban, dan obrolan sebelumnya. Itu namanya context window.", spoken: "Anggap Ei Ai punya satu meja kerja. Semua yang dia pegang harus muat di atasnya: pertanyaan, jawaban, dan obrolan sebelumnya. Itu namanya context window.", tag: "calmly", shot: "wide", expressions: { robot: "senang" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 2: ukuran dihitung dalam token, selalu ada batas.
    id: "ukuran",
    seconds: 7.8,
    set: "kelas",
    board: [
      { text: "Context window", at: 0.3 },
      { text: "dihitung dalam token", at: 0.9 },
      { text: "beda tiap model", at: 4.3 },
      { text: "selalu ada batas", at: 5.9 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 7.09, text: "Ukurannya dihitung dalam token, seperti pelajaran kemarin. Tiap model beda, tapi selalu ada batasnya.", tag: "matter-of-fact", shot: "wide", expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 3: meja penuh, bagian awal turun, bagi AI sudah tidak ada.
    id: "penuh",
    seconds: 9.5,
    set: "kelas",
    board: [
      { text: "Meja penuh?", at: 0.5 },
      { text: "Bagian awal turun", at: 2.3 },
      { text: "Bagi AI: sudah tidak ada", at: 5.2, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "kaget", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.69, text: "Kalau mejanya penuh?", tag: "curious", shot: "closeUp", expressions: { ganjar: "kaget" }, motions: { ganjar: "angkatBahu" } },
      { who: "robot", from: 2.15, dur: 6.95, text: "Bagian paling awal harus turun dari meja. Dan bagi AI, yang turun itu sudah tidak ada.", spoken: "Bagian paling awal harus turun dari meja. Dan bagi Ei Ai, yang turun itu sudah tidak ada.", tag: "serious", shot: "wide", expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 5.2,
    set: "kelas",
    board: [
      { text: "Bukan ingatan panjang", at: 0.4 },
      { text: "Hanya meja terbatas", at: 2.9, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 4.46, text: "AI tidak punya ingatan panjang, hanya meja yang terbatas.", spoken: "Ei Ai tidak punya ingatan panjang, hanya meja yang terbatas.", tag: "calm", shot: "wide", push: true, expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Teaser: lupa itu wajar, bahayanya kalau tetap yakin (pelajaran berikutnya).
    id: "teaser",
    seconds: 7.5,
    set: "kelas",
    board: [
      { text: "Lupa itu wajar", at: 0.4 },
      { text: "Bahaya: lupa tapi yakin", at: 1.2 },
      { text: "Pelajaran berikutnya", at: 5.2 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 6.76, text: "Wajar. Yang bahaya kalau dia lupa tapi tetap menjawab yakin. Pelajaran berikutnya.", tag: "calmly", shot: "wide", expressions: { robot: "senang", ganjar: "mikir" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // CTA: Robot menghadap penonton.
    id: "cta",
    seconds: 4.2,
    set: "kelas",
    board: [{ text: "Belajar AI #4 dari 15", at: 0.5 }],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 3.49, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly", shot: "pov", expressions: { robot: "senang", ganjar: "senang" }, motions: { robot: "lambai" } },
    ],
  },
];
