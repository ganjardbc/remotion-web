import type { BlockScene } from "../../block-reels";

// Data scene HalusinasiBlock (Reels block, seri "Belajar AI" episode 5, penutup fase 1). Ganjar = murid, Robot = guru.
// Waktu `from` dan `dur` adalah perkiraan (±15 huruf per detik) sampai voiceover ada; geser ulang `board.at`, `sfx.at`, dan `shot` setelah klip jadi.
// Latar kelas di semua scene: guru (Robot) di atas meja kiri, murid (Ganjar) berdiri di lantai kanan, papan tulis besar di belakang.
// Judul tampil di papan scene pertama (config.ts). Shot rapat meredupkan papan, jadi baris yang sedang ditulis dipegang dengan shot `wide`.
// `spoken`: hindari "AI" di awal kalimat setelah titik (pernah terbaca aneh di episode 3); tulis "Ei Ai".
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: AI mengarang nomor peraturan, Robot menyebutnya halusinasi.
    id: "hook",
    seconds: 10,
    set: "kelas",
    board: [
      { text: "AI kasih nomor pasal", at: 1.6 },
      { text: "peraturannya nggak ada", at: 4.3 },
      { text: "Kena halusinasi", at: 8.2 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 5.92, text: "Guru, AI-ku kasih nomor peraturan lengkap sama pasalnya. Ternyata peraturannya nggak ada.", spoken: "Guru, Ei Ai-ku kasih nomor peraturan lengkap sama pasalnya. Ternyata peraturannya nggak ada.", tag: "frustrated", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "robot", from: 6.4, dur: 3.2, text: "Selamat. Kamu baru bertemu halusinasi.", tag: "deadpan", shot: [{ at: 0, kind: "lowAngle" }, { at: 1, kind: "wide" }], expressions: { robot: "senang", ganjar: "kaget" }, motions: { robot: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: bukan bohong, dia menebak.
    id: "tebak",
    seconds: 9.5,
    set: "kelas",
    board: [
      { text: "Bukan bohong", at: 1.6 },
      { text: "tapi menebak", at: 2.6 },
      { text: "kata paling masuk akal", at: 4.6 },
      { text: "bukan cek kebenaran", at: 6.6 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.02, text: "Dia bohong?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "robot", from: 1.5, dur: 7.61, text: "Bukan bohong, dia menebak. Dia menyusun kata yang paling masuk akal, bukan memeriksa mana yang benar.", tag: "calmly", shot: "wide", expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 2: nada yakin, bagian paling rawan.
    id: "rawan",
    seconds: 9.5,
    set: "kelas",
    board: [
      { text: "Selalu terdengar yakin", at: 1 },
      { text: "nomor, nama, tanggal", at: 3.9 },
      { text: "kutipan, sumber", at: 5.9 },
      { text: "= paling rawan", at: 7.4, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "kaget", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 8.81, text: "Dan dia sering menjawab dengan nada yakin. Nomor, nama, tanggal, kutipan, sumber: itu yang paling rawan.", tag: "matter-of-fact", shot: "wide", expressions: { robot: "serius", ganjar: "kaget" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 3: tiga cara menjaga diri.
    id: "cara",
    seconds: 11.1,
    set: "kelas",
    board: [
      { text: "1. Minta sumbernya", at: 3.1 },
      { text: "2. Cek sumber resmi", at: 4.4 },
      { text: "3. Beri dia bahan", at: 6.9 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.78, text: "Terus aku harus gimana?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "angkatBahu" } },
      { who: "robot", from: 2.25, dur: 8.42, text: "Tiga hal. Minta sumbernya. Cek hal penting di sumber resmi. Dan beri dia bahan, jangan hanya pertanyaan.", tag: "calmly", shot: "wide", expressions: { robot: "senang" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 6,
    set: "kelas",
    board: [
      { text: "Yakin bukan bukti benar", at: 0.4 },
      { text: "Percaya boleh", at: 2.6 },
      { text: "Verifikasi wajib", at: 4, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 5.34, text: "Yakin bukan bukti benar. Percaya boleh, verifikasi wajib.", tag: "calm", shot: "wide", push: true, expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Teaser: penutup fase 1, fase berikutnya (jangan terima jawaban pertama).
    id: "teaser",
    seconds: 13,
    set: "kelas",
    board: [
      { text: "Fase 1 selesai", at: 3 },
      { text: "Fase 2: AI kerja untukmu", at: 4.5 },
      { text: "Jangan terima jawaban pertama", at: 9.9, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.37, text: "Aku sudah paham cara kerjanya.", tag: "relieved", shot: "wide", expressions: { ganjar: "senang" }, motions: { ganjar: "tepuk" } },
      { who: "robot", from: 2.85, dur: 9.78, text: "Fase satu selesai. Berikutnya, membuat AI bekerja untukmu, dimulai dari satu kebiasaan: jangan terima jawaban pertama.", spoken: "Fase satu selesai. Berikutnya, membuat Ei Ai bekerja untukmu, dimulai dari satu kebiasaan: jangan terima jawaban pertama.", tag: "warmly", shot: "wide", expressions: { robot: "senang", ganjar: "senang" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // CTA: Robot menghadap penonton.
    id: "cta",
    seconds: 4.5,
    set: "kelas",
    board: [{ text: "Belajar AI #5 dari 15", at: 0.5 }],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 3.77, text: "Follow supaya kamu tidak ketinggalan fase berikutnya.", tag: "warmly", shot: "pov", expressions: { robot: "senang", ganjar: "senang" }, motions: { robot: "lambai" } },
    ],
  },
];
