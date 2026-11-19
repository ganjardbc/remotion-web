import type { BlockScene } from "../../block-reels";

// Data scene AiBukanGoogleBlock (Reels block, seri "Belajar AI" episode 1). Ganjar = murid, Claude Code = guru.
// Waktu `from` dan `dur` adalah perkiraan (±15 huruf per detik) sampai voiceover ada; geser ulang `sfx.at` dan `shot` setelah klip jadi.
// Latar bergantian, tidak ada dua scene berurutan yang sama. Judul tampil di kartu atas hanya di scene pertama (config.ts).
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: Ganjar menyamakan AI dengan Google, Claude Code langsung membantah.
    id: "hook",
    seconds: 7.6,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "bingung", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.6, text: "Guru, aku pakai AI persis kayak Google. Ada yang salah?", spoken: "Guru, aku pakai Ei Ai persis kayak Google. Ada yang salah?", tag: "curious", shot: "wide", expressions: { ganjar: "bingung" }, motions: { ganjar: "garukKepala" } },
      { who: "claudecode", from: 4.1, dur: 2.9, text: "Salah besar. Keduanya bukan hal yang sama.", tag: "firmly", shot: "lowAngle", expressions: { claudecode: "serius", ganjar: "kaget" }, motions: { claudecode: "angkatTangan" }, sfx: [{ name: "ding", at: 0.1, volume: 0.3 }] },
    ],
  },
  {
    // Penjelasan 1: Google mencari.
    id: "beda",
    seconds: 8.3,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1, text: "Bedanya apa?", tag: "curious", shot: "closeUp", expressions: { ganjar: "mikir" }, motions: { ganjar: "mikir" } },
      { who: "claudecode", from: 1.6, dur: 4.9, text: "Google itu mencari. Kamu mengetik, dia menunjukkan halaman yang sudah ada.", tag: "calmly", shot: "medium", push: true, expressions: { claudecode: "senang" }, motions: { claudecode: "tunjuk" } },
      { who: "ganjar", from: 6.9, dur: 0.8, text: "Kalau AI?", spoken: "Kalau Ei Ai?", tag: "curious", shot: "dutch", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
    ],
  },
  {
    // Penjelasan 2: AI menyusun, menebak kata berikutnya.
    id: "susun",
    seconds: 9.7,
    set: "terminal",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "serius", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.6, text: "AI menyusun. Dia tidak membuka arsip.", spoken: "Ei Ai menyusun. Dia tidak membuka arsip.", tag: "calmly", shot: "medium", expressions: { claudecode: "serius" }, motions: { claudecode: "tunjuk" } },
      { who: "claudecode", from: 3, dur: 6.4, text: "Dia menebak kata berikutnya yang paling masuk akal, dari pola jutaan tulisan yang pernah dia pelajari.", tag: "calmly", shot: [{ at: 0, kind: "closeUp" }, { at: 3.4, kind: "highAngle" }], expressions: { claudecode: "serius" } },
    ],
  },
  {
    // Penjelasan 3: terdengar yakin, belum tentu benar.
    id: "yakin",
    seconds: 6.4,
    set: "kafe",
    cast: [
      { character: "ganjar", expression: "kaget", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.7, text: "Pantas jawabannya selalu terdengar yakin.", tag: "realizing", shot: "closeUp", expressions: { ganjar: "kaget" }, motions: { ganjar: "tepuk" } },
      { who: "claudecode", from: 3.4, dur: 2.4, text: "Betul. Tapi lancar belum tentu benar.", tag: "serious", shot: "overShoulder", expressions: { claudecode: "serius", ganjar: "mikir" }, motions: { claudecode: "angkatTangan" } },
    ],
  },
  {
    // Kesimpulan: kalimat quote.
    id: "kesimpulan",
    seconds: 3.8,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "serius", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 3, text: "Google menemukan jawaban. AI membuat jawaban.", spoken: "Google menemukan jawaban. Ei Ai membuat jawaban.", tag: "calm", shot: "closeUp", push: true, expressions: { claudecode: "serius" }, motions: { claudecode: "tunjuk" } },
    ],
  },
  {
    // Teaser: pelajaran berikutnya soal cara bertanya.
    id: "teaser",
    seconds: 9.6,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "bingung", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 1.5, text: "Terus aku harus gimana?", tag: "confused", shot: "medium", expressions: { ganjar: "bingung" }, motions: { ganjar: "angkatBahu" } },
      { who: "claudecode", from: 2.1, dur: 6.9, text: "Karena AI menebak dari tulisanmu, cara kamu bertanya menentukan hasilnya. Itu pelajaran berikutnya.", spoken: "Karena Ei Ai menebak dari tulisanmu, cara kamu bertanya menentukan hasilnya. Itu pelajaran berikutnya.", tag: "calmly", shot: "wide", expressions: { claudecode: "senang", ganjar: "mikir" }, motions: { claudecode: "tunjuk" } },
    ],
  },
  {
    // CTA: Claude Code menghadap penonton.
    id: "cta",
    seconds: 4.2,
    set: "terminal",
    cast: [
      { character: "ganjar", expression: "senang", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.3, text: "Follow supaya kamu tidak ketinggalan urutannya.", tag: "warmly", shot: "pov", expressions: { claudecode: "senang", ganjar: "senang" }, motions: { claudecode: "lambai" } },
    ],
  },
];
