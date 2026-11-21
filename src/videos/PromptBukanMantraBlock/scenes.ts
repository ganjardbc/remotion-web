import type { BlockScene } from "../../block-reels";

// Data scene PromptBukanMantraBlock (Reels block, seri "Belajar AI" episode 2). Ganjar = murid, Claude Code = guru.
// Waktu `from` dan `dur` adalah perkiraan (±15 huruf per detik) sampai voiceover ada; geser ulang `sfx.at`, `shot`, dan `board.at` setelah klip jadi.
// Latar kelas di semua scene: guru (Claude Code) di atas meja kiri, murid (Ganjar) berdiri di lantai kanan, papan tulis besar di belakang.
// Judul tampil di papan scene pertama (config.ts).
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: caption hambar, Claude Code menyalahkan pertanyaan, bukan AI.
    id: "hook",
    seconds: 8.8,
    set: "kelas",
    board: [
      { text: "buatkan caption jualan", at: 0.8 },
      { text: "Pertanyaan kosong", at: 5.2 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "claudecode", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 4.4, text: "Guru, aku minta AI \"buatkan caption jualan\". Hasilnya hambar banget.", spoken: "Guru, aku minta Ei Ai \"buatkan caption jualan\". Hasilnya hambar banget.", tag: "frustrated", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "claudecode", from: 5, dur: 3.4, text: "Bukan AI-nya yang hambar. Pertanyaanmu yang kosong.", spoken: "Bukan Ei Ai-nya yang hambar. Pertanyaanmu yang kosong.", tag: "firmly", shot: "lowAngle", expressions: { claudecode: "serius", ganjar: "kaget" }, motions: { claudecode: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: AI menebak dari tulisan, tulisan sedikit berarti tebakan umum.
    id: "kosong",
    seconds: 9.8,
    set: "kelas",
    board: [
      { text: "AI menebak dari tulisanmu", at: 3.3 },
      { text: "Tulisan sedikit", at: 5 },
      { text: "tebakan umum", at: 6.2 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "claudecode", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1, text: "Kosong gimana?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "claudecode", from: 1.6, dur: 5.7, text: "Ingat pelajaran kemarin? AI menebak dari tulisanmu. Tulisan sedikit, tebakannya umum.", spoken: "Ingat pelajaran kemarin? Ei Ai menebak dari tulisanmu. Tulisan sedikit, tebakannya umum.", tag: "calmly", shot: [{ at: 0, kind: "medium" }, { at: 2.4, kind: "closeUp" }], push: true, expressions: { claudecode: "senang" }, motions: { claudecode: "tunjuk" } },
      { who: "ganjar", from: 7.7, dur: 1.7, text: "Jadi harus nulis panjang?", tag: "hesitant", shot: "dutch", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
    ],
  },
  {
    // Penjelasan 2: bukan panjang, tapi lengkap. Empat bagian muncul satu per satu di papan.
    id: "empat",
    seconds: 7.2,
    set: "kelas",
    board: [
      { text: "1. Peran", at: 3.4 },
      { text: "2. Tugas", at: 4.1 },
      { text: "3. Konteks", at: 4.9 },
      { text: "4. Format", at: 5.7 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "claudecode", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 5.2, text: "Bukan panjang, tapi lengkap. Ada empat bagian: Peran, Tugas, Konteks, Format.", tag: "calmly", shot: [{ at: 0, kind: "medium" }, { at: 3.1, kind: "wide" }], expressions: { claudecode: "serius" }, motions: { claudecode: "tunjuk" } },
      { who: "ganjar", from: 6, dur: 0.8, text: "Contohnya?", tag: "curious", shot: "closeUp", expressions: { ganjar: "senang" } },
    ],
  },
  {
    // Contoh: satu prompt utuh, tiap bagian ditulis di papan sesuai urutan diucapkan.
    id: "contoh",
    seconds: 12.6,
    set: "kelas",
    board: [
      { text: "Peran: penulis kuliner", at: 1.2 },
      { text: "Tugas: caption kopi susu", at: 3.2 },
      { text: "Konteks: toko di Bandung", at: 5.2 },
      { text: "Format: 3 kalimat, santai", at: 7.8 },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "claudecode", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 9.9, text: "\"Kamu penulis konten kuliner. Buatkan caption jualan kopi susu. Tokonya kecil di Bandung, pembelinya mahasiswa. Maksimal tiga kalimat, gaya santai.\"", tag: "matter-of-fact", shot: [{ at: 0, kind: "overShoulder" }, { at: 4.4, kind: "medium" }, { at: 7.4, kind: "highAngle" }], expressions: { claudecode: "senang", ganjar: "mikir" }, motions: { claudecode: "tunjuk" } },
      { who: "ganjar", from: 10.7, dur: 1.5, text: "Wah, jauh lebih jelas.", tag: "impressed", shot: "closeUp", expressions: { ganjar: "senang" }, motions: { ganjar: "tepuk" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 5.2,
    set: "kelas",
    board: [
      { text: "Prompt bukan mantra", at: 0.4 },
      { text: "Prompt = briefing", at: 2, hot: true },
    ],
    cast: [
      { character: "ganjar", expression: "mikir", position: "kanan" },
      { character: "claudecode", expression: "serius", position: "kiri" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 4.7, text: "Prompt bukan mantra. Prompt itu briefing. Briefing jelas, hasil jelas.", tag: "calm", shot: "closeUp", push: true, expressions: { claudecode: "serius" }, motions: { claudecode: "tunjuk" } },
    ],
  },
  {
    // Teaser: briefing panjang, pelajaran berikutnya.
    id: "teaser",
    seconds: 8.2,
    set: "kelas",
    board: [
      { text: "Briefing panjang?", at: 0.8 },
      { text: "AI sanggup membaca semua?", at: 2.3 },
      { text: "Pelajaran berikutnya", at: 6 },
    ],
    cast: [
      { character: "ganjar", expression: "bingung", position: "kanan" },
      { character: "claudecode", expression: "netral", position: "kiri" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 4.1, text: "Kalau briefing-ku panjang banget, AI sanggup membacanya semua?", spoken: "Kalau briefing-ku panjang banget, Ei Ai sanggup membacanya semua?", tag: "curious", shot: "medium", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
      { who: "claudecode", from: 4.9, dur: 2.9, text: "Pertanyaan bagus. Itu pelajaran berikutnya.", tag: "calmly", shot: "wide", expressions: { claudecode: "senang", ganjar: "mikir" }, motions: { claudecode: "tunjuk" } },
    ],
  },
  {
    // CTA: Claude Code menghadap penonton.
    id: "cta",
    seconds: 4.2,
    set: "kelas",
    board: [{ text: "Belajar AI #2 dari 15", at: 0.5 }],
    cast: [
      { character: "ganjar", expression: "senang", position: "kanan" },
      { character: "claudecode", expression: "senang", position: "kiri" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.3, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly", shot: "pov", expressions: { claudecode: "senang", ganjar: "senang" }, motions: { claudecode: "lambai" } },
    ],
  },
];
