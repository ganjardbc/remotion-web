import type { BlockScene } from "../../block-reels";

// Data scene PromptBukanMantraBlock (Reels block, seri "Belajar AI" episode 2). Ganjar = murid, Robot = guru.
// Waktu `from` dan `dur` adalah perkiraan (±15 huruf per detik) sampai voiceover ada; geser ulang `sfx.at`, `shot`, dan `board.at` setelah klip jadi.
// Latar kelas di semua scene: guru (Robot) di atas meja kiri, murid (Ganjar) berdiri di lantai kanan, papan tulis besar di belakang.
// Judul tampil di papan scene pertama (config.ts).
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: caption hambar, Robot menyalahkan pertanyaan, bukan AI.
    id: "hook",
    seconds: 9.6,
    set: "kelas",
    board: [
      { text: "buatkan caption jualan", at: 1.6 },
      { text: "Pertanyaan kosong", at: 7.2 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 4.96, text: "Guru, aku minta AI \"buatkan caption jualan\". Hasilnya hambar banget.", spoken: "Guru, aku minta Ei Ai \"buatkan caption jualan\". Hasilnya hambar banget.", tag: "frustrated", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "robot", from: 5.5, dur: 3.67, text: "Bukan AI-nya yang hambar. Pertanyaanmu yang kosong.", spoken: "Bukan Ei Ai-nya yang hambar. Pertanyaanmu yang kosong.", tag: "firmly", shot: [{ at: 0, kind: "lowAngle" }, { at: 1.6, kind: "wide" }], expressions: { robot: "serius", ganjar: "kaget" }, motions: { robot: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: AI menebak dari tulisan, tulisan sedikit berarti tebakan umum.
    id: "kosong",
    seconds: 7.3,
    set: "kelas",
    board: [
      { text: "AI menebak dari tulisanmu", at: 2 },
      { text: "Tulisan sedikit", at: 4 },
      { text: "tebakan umum", at: 5.4 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.18, text: "Kosong gimana?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "robot", from: 1.75, dur: 5.15, text: "AI menebak dari tulisanmu. Tulisan sedikit, tebakannya umum.", spoken: "Ei Ai menebak dari tulisanmu. Tulisan sedikit, tebakannya umum.", tag: "calmly", shot: "wide", expressions: { robot: "senang" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Penjelasan 2: bukan panjang, tapi lengkap. Empat bagian muncul satu per satu di papan.
    id: "empat",
    seconds: 7.4,
    set: "kelas",
    board: [
      { text: "1. Peran", at: 3.1 },
      { text: "2. Tugas", at: 3.8 },
      { text: "3. Konteks", at: 4.5 },
      { text: "4. Format", at: 5.4 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 5.66, text: "Lengkapnya ada empat bagian: Peran, Tugas, Konteks, Format.", tag: "calmly", shot: [{ at: 0, kind: "medium" }, { at: 2.2, kind: "wide" }], expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
      { who: "ganjar", from: 6.1, dur: 0.82, text: "Contohnya?", tag: "curious", shot: "closeUp", expressions: { ganjar: "senang" } },
    ],
  },
  {
    // Contoh: satu prompt utuh, tiap bagian ditulis di papan sesuai urutan diucapkan.
    id: "contoh",
    seconds: 13.5,
    set: "kelas",
    board: [
      { text: "Peran: penulis kuliner", at: 0.9 },
      { text: "Tugas: caption kopi susu", at: 2.3 },
      { text: "Konteks: toko di Bandung", at: 4.6 },
      { text: "Format: 3 kalimat, santai", at: 7.8 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 9.98, text: "\"Kamu penulis konten kuliner. Buatkan caption jualan kopi susu. Tokonya kecil di Bandung, pembelinya mahasiswa. Maksimal tiga kalimat, gaya santai.\"", tag: "matter-of-fact", shot: [{ at: 0, kind: "wide" }, { at: 8.4, kind: "closeUp" }], expressions: { robot: "senang", ganjar: "mikir" }, motions: { robot: "tunjuk" } },
      { who: "ganjar", from: 10.55, dur: 2.53, text: "Wah, jauh lebih jelas.", tag: "impressed", shot: "closeUp", expressions: { ganjar: "senang" }, motions: { ganjar: "tepuk" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 7,
    set: "kelas",
    board: [
      { text: "Prompt bukan mantra", at: 0.4 },
      { text: "Prompt = briefing", at: 2.6, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "robot", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 6.25, text: "Prompt bukan mantra. Prompt itu briefing. Briefing jelas, hasil jelas.", tag: "calm", shot: "wide", push: true, expressions: { robot: "serius" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // Teaser: briefing panjang, pelajaran berikutnya.
    id: "teaser",
    seconds: 8.7,
    set: "kelas",
    board: [
      { text: "Briefing panjang?", at: 0.7 },
      { text: "AI sanggup membaca semua?", at: 2.3 },
      { text: "Pelajaran berikutnya", at: 6.3 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "robot", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.94, text: "Kalau briefing-ku panjang banget, AI sanggup membacanya semua?", spoken: "Kalau briefing-ku panjang banget, Ei Ai sanggup membacanya semua?", tag: "curious", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
      { who: "robot", from: 4.9, dur: 3.43, text: "Pertanyaan bagus. Itu pelajaran berikutnya.", tag: "calmly", shot: "wide", expressions: { robot: "senang", ganjar: "mikir" }, motions: { robot: "tunjuk" } },
    ],
  },
  {
    // CTA: Robot menghadap penonton.
    id: "cta",
    seconds: 4.3,
    set: "kelas",
    board: [{ text: "Belajar AI #2 dari 15", at: 0.5 }],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "robot", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "robot", from: 0.3, dur: 3.61, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly", shot: "pov", expressions: { robot: "senang", ganjar: "senang" }, motions: { robot: "lambai" } },
    ],
  },
];
