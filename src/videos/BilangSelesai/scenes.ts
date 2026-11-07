import type { BlockScene } from "../../block-reels";

// Data scene BilangSelesai. Alur Format A: hook, relate, shift, urgency, closing, cta. Waktu `from` dan `dur` adalah perkiraan
// (±15 huruf per detik) sampai voiceover ada. Latar berganti tiap scene; semua latar bersuasana malam.
export const BASE_SCENES: readonly BlockScene[] = [
  {
    // Hook: Ganjar datar, Claude Code ceria. Kamera mulai extreme close-up wajah Ganjar lalu mundur memperlihatkan maskot.
    id: "hook",
    seconds: 5.4,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [{ who: "ganjar", from: 1.2, dur: 3.6, text: "Claude bilang sudah selesai, tapi aku tahu itu belum.", shot: "reveal", motions: { ganjar: "mikir" } }],
  },
  {
    // Relate: laporan "selesai" dari AI, lalu error muncul di production.
    id: "relate",
    seconds: 7.5,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "netral", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.3, text: "Semua tes lulus. Tugas selesai.", shot: "closeUp", expressions: { claudecode: "senang" } },
      {
        who: "ganjar",
        from: 3,
        dur: 4.2,
        text: "Aku percaya, langsung kirim. Besoknya error muncul di production.",
        shot: "overShoulder",
        expressions: { ganjar: "kesal", claudecode: "malu" },
        motions: { ganjar: "facepalm" },
        motionAt: { ganjar: 2.8 },
      },
    ],
  },
  {
    // Shift: insight inti. Kamera naik pelan dari bawah saat kalimat inti diucapkan.
    id: "shift",
    seconds: 8.5,
    set: "terminal",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "malu", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.9, text: "Aku sudah mengerjakan semua yang kamu minta.", shot: "medium", expressions: { claudecode: "malu" } },
      {
        who: "ganjar",
        from: 3.5,
        dur: 4.4,
        text: "AI berhenti saat promptnya habis, bukan saat masalahmu selesai.",
        shot: "lowAngle",
        push: true,
        expressions: { ganjar: "serius" },
        motions: { ganjar: "tunjuk" },
      },
    ],
  },
  {
    // Urgency: jeda sebelum jawaban, Claude Code bertanya balik.
    id: "urgency",
    seconds: 6.4,
    set: "kafe",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "bingung", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 3.7, text: "Ini baru bagian pertama. Ada satu kebiasaan yang menyelamatkanku.", shot: "medium", expressions: { ganjar: "mikir" }, motions: { ganjar: "pinggang" } },
      { who: "claudecode", from: 4.2, dur: 1.4, text: "Kebiasaan apa?", shot: "closeUp", expressions: { claudecode: "bingung" } },
    ],
  },
  {
    // Closing: kebiasaannya, lalu kalimat quote di close-up wajah Ganjar.
    id: "closing",
    seconds: 6.4,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      {
        who: "ganjar",
        from: 0.3,
        dur: 5.6,
        text: "Tulis dulu seperti apa selesai itu. Karena selesai itu keputusanmu, bukan laporan AI.",
        shot: [
          { at: 0, kind: "wide" },
          { at: 2.6, kind: "closeUp" },
        ],
        expressions: { ganjar: "serius", claudecode: "senang" },
        reactions: [{ who: "ganjar", expression: "senang", at: 3.2 }],
        motions: { ganjar: "tepuk" },
        motionAt: { ganjar: 3.8 },
      },
    ],
  },
  {
    // CTA: dua karakter menghadap kamera, Ganjar melambai di akhir.
    id: "cta",
    seconds: 6.2,
    set: "kantor",
    cast: [
      { character: "ganjar", expression: "senang", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      {
        who: "ganjar",
        from: 0.3,
        dur: 5.3,
        text: "Follow kalau kamu mau contoh brief yang membuat AI berhenti di titik yang benar.",
        shot: "medium",
        push: true,
        expressions: { ganjar: "senang", claudecode: "senang" },
        motions: { ganjar: "lambai" },
        motionAt: { ganjar: 4.2 },
      },
    ],
  },
];
