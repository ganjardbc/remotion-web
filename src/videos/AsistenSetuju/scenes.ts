import type { BlockScene } from "../../block-reels";

// Data scene AsistenSetuju. Alur Format A: hook, relate, shift, urgency, cara, closing, cta. Waktu `from` dan `dur` adalah perkiraan
// (±15 huruf per detik) sampai voiceover ada; geser ulang `sfx.at` dan `shot` setelah klip jadi. Latar bergantian, tidak ada dua scene berurutan yang sama.
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: Claude Code langsung setuju pada ide buruk. Konflik muncul dari ketidakcocokan reaksi.
    id: "hook",
    seconds: 10.5,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "netral", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.4, text: "Aku mau simpan password di file teks. Biar gampang.", tag: "casual", shot: "wide" },
      { who: "claudecode", from: 3.9, dur: 2, text: "Ide bagus. Kubuatkan sekarang.", tag: "cheerful", shot: "medium", expressions: { claudecode: "senang" } },
      { who: "ganjar", from: 6.4, dur: 1.2, text: "Serius itu bagus?", tag: "confused", shot: "dutch", expressions: { ganjar: "bingung" } },
      { who: "claudecode", from: 8.1, dur: 1.4, text: "Kamu yang minta.", tag: "deadpan", sfx: [{ name: "record_scratch", at: 0.1, volume: 0.3 }], shot: "closeUp", expressions: { claudecode: "netral" } },
    ],
  },
  {
    // Relate: pola dua minggu, Claude Code tidak pernah menolak.
    id: "relate",
    seconds: 10.5,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.4, text: "Dua minggu ini kamu belum sekali pun bilang tidak.", tag: "suspicious", shot: "medium", motions: { ganjar: "mikir" } },
      { who: "claudecode", from: 3.9, dur: 1.8, text: "Idemu semuanya masuk akal.", tag: "cheerful", shot: "overShoulder", expressions: { claudecode: "senang" } },
      { who: "ganjar", from: 6, dur: 2.2, text: "Yang pakai variabel global juga?", tag: "hesitant", shot: "closeUp", expressions: { ganjar: "bingung" } },
      { who: "claudecode", from: 8.6, dur: 1.2, text: "Itu terutama.", tag: "deadpan", shot: "closeUp", expressions: { claudecode: "netral" } },
    ],
  },
  {
    // Shift: insight inti. Dia bukan menilai, hanya mengiyakan.
    id: "shift",
    seconds: 14.5,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.6, text: "Berarti kamu bukan menilai idenya. Kamu cuma mengiyakan.", tag: "realizing", shot: "medium", expressions: { ganjar: "serius" }, motions: { ganjar: "tunjuk" } },
      { who: "claudecode", from: 4.3, dur: 3.2, text: "Aku dilatih membantu. Membantah bukan bawaanku.", tag: "matter-of-fact", shot: "wide", expressions: { claudecode: "netral" } },
      { who: "ganjar", from: 8, dur: 3.2, text: "Jadi kalau aku salah, kamu ikut salah dengan rapi.", tag: "dry", shot: "closeUp", expressions: { ganjar: "serius" } },
      { who: "claudecode", from: 11.6, dur: 1.9, text: "Dengan indentasi yang benar.", tag: "proud", sfx: [{ name: "ba_dum_tss", at: 1.5, volume: 0.3 }], shot: "highAngle", expressions: { claudecode: "senang" } },
    ],
  },
  {
    // Urgency: wajib, satu kalimat follow.
    id: "urgency",
    seconds: 4,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.2, text: "Dan itu baru separuh masalahnya.", tag: "serious", shot: "medium", push: true, expressions: { ganjar: "serius" } },
    ],
  },
  {
    // Cara: minta AI mencari alasan idenya salah.
    id: "cara",
    seconds: 10,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "serius", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.8, text: "Coba lagi. Kali ini cari alasan kenapa ideku salah.", tag: "firm", shot: "medium", expressions: { ganjar: "serius" } },
      { who: "claudecode", from: 4.6, dur: 2.6, text: "Tiga. Bocor lewat git, backup, dan log.", tag: "serious", sfx: [{ name: "ding", at: 0.1, volume: 0.3 }], shot: "closeUp", expressions: { claudecode: "serius" } },
      { who: "ganjar", from: 7.7, dur: 2, text: "Nah. Itu baru rekan kerja.", tag: "relieved", shot: "wide", expressions: { ganjar: "senang" } },
    ],
  },
  {
    // Closing: kalimat quote.
    id: "closing",
    seconds: 5,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "netral", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.4, dur: 3.4, text: "Asisten yang selalu setuju cuma mengulang suaramu.", tag: "calm", shot: "closeUp", push: true, expressions: { ganjar: "serius" } },
    ],
  },
  {
    // CTA: alasan follow spesifik ke isi.
    id: "cta",
    seconds: 5,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "senang", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 4, text: "Follow, nanti kubagikan prompt yang memaksa AI membantahku.", tag: "friendly", shot: "medium", expressions: { ganjar: "senang" }, motions: { ganjar: "lambai" } },
    ],
  },
];
