import type { BlockScene } from "../../block-reels";

// Data scene BilangSelesai. Alur Format A: hook, relate, shift, urgency, cara, closing, cta. Konten tuntas dalam satu video, tanpa lanjutan. Waktu `from` dan `dur` adalah perkiraan
// (±15 huruf per detik) sampai voiceover ada. Semua scene di satu ruangan yang sama (mejaMalam); variasi visual lewat shot kamera, pose, dan ekspresi.
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
    lines: [{ who: "ganjar", from: 1.2, dur: 3.6, text: "Claude bilang tugasnya selesai. Ternyata belum.", tag: "deadpan", sfx: [{ name: "whoosh", volume: 0.25 }, { name: "record_scratch", at: 2.4, volume: 0.3 }], shot: "reveal", motions: { ganjar: "mikir" } }],
  },
  {
    // Relate: laporan "selesai" dari AI, lalu error muncul di production.
    id: "relate",
    seconds: 7.5,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "netral", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.3, text: "Semua tes lulus. Tugas selesai.", tag: "cheerful", sfx: [{ name: "ding", at: 1.9, volume: 0.3 }], shot: "closeUp", expressions: { claudecode: "senang" } },
      {
        who: "ganjar",
        from: 3,
        dur: 4.2,
        text: "Aku percaya, langsung kirim. Besoknya error muncul di production.", tag: "frustrated",
        sfx: [{ name: "sad_trombone", at: 2.8, volume: 0.22 }],
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
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "malu", position: "kanan" },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.3, text: "Tapi aku sudah mengerjakan semua yang kamu minta.", tag: "defensive", shot: "medium", expressions: { claudecode: "malu" } },
      {
        who: "ganjar",
        from: 3.9,
        dur: 4.4,
        text: "AI berhenti saat promptnya habis, bukan saat masalahmu selesai.", tag: "confident",
        sfx: [{ name: "ding", at: 2.15, volume: 0.3 }],
        shot: "lowAngle",
        push: true,
        expressions: { ganjar: "serius" },
        motions: { ganjar: "tunjuk" },
      },
    ],
  },
  {
    // Urgency: jeda sebelum jawaban, Claude Code bertanya balik. Jawabannya langsung di scene berikutnya (video ini tuntas).
    id: "urgency",
    seconds: 7,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "mikir", position: "kiri" },
      { character: "claudecode", expression: "bingung", position: "kanan" },
    ],
    lines: [
      { who: "ganjar", from: 0.3, dur: 4.6, text: "Tahu masalahnya belum cukup. Ada satu kebiasaan yang menyelamatkanku.", tag: "curious", shot: "medium", expressions: { ganjar: "mikir" }, motions: { ganjar: "pinggang" } },
      { who: "claudecode", from: 5.1, dur: 1.5, text: "Kebiasaan apa?", tag: "curious", shot: "closeUp", expressions: { claudecode: "bingung" } },
    ],
  },
  {
    // Cara: kebiasaan konkret, tiga hal yang ditulis sebelum minta. Isi tuntas di video ini.
    id: "cara",
    seconds: 10.6,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "senang", position: "kiri" },
      { character: "claudecode", expression: "mikir", position: "kanan" },
    ],
    lines: [
      {
        who: "ganjar",
        from: 0.3,
        dur: 6.7,
        text: "Sebelum minta, tulis tiga hal: apa yang harus jalan, cara mengeceknya, dan apa yang tidak boleh rusak.", tag: "warm",
        sfx: [{ name: "key1", at: 1.85, volume: 0.6 }, { name: "key2", at: 3.4, volume: 0.6 }, { name: "key3", at: 4.7, volume: 0.6 }],
        shot: [
          { at: 0, kind: "medium" },
          { at: 3.6, kind: "closeUp" },
        ],
        expressions: { ganjar: "senang", claudecode: "mikir" },
        motions: { ganjar: "tunjuk" },
        motionAt: { ganjar: 1.2 },
      },
      { who: "claudecode", from: 7.3, dur: 3.2, text: "Jadi aku baru berhenti kalau ketiganya terpenuhi.", tag: "cheerful", sfx: [{ name: "ding", at: 2.85, volume: 0.35 }], shot: "closeUp", expressions: { claudecode: "senang" } },
    ],
  },
  {
    // Closing: kalimat quote di close-up wajah Ganjar.
    id: "closing",
    seconds: 4.4,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "serius", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      {
        who: "ganjar",
        from: 0.3,
        dur: 3.4,
        text: "AI yang mengerjakan, kamu yang menentukan selesai.", tag: "confident",
        sfx: [{ name: "ding", at: 2.55, volume: 0.35 }],
        shot: [
          { at: 0, kind: "wide" },
          { at: 1.2, kind: "closeUp" },
        ],
        expressions: { ganjar: "serius", claudecode: "senang" },
        reactions: [{ who: "ganjar", expression: "senang", at: 2 }],
        motions: { ganjar: "tepuk" },
        motionAt: { ganjar: 2.4 },
      },
    ],
  },
  {
    // CTA: dua karakter menghadap kamera, Ganjar melambai di akhir.
    id: "cta",
    seconds: 6.3,
    set: "mejaMalam",
    cast: [
      { character: "ganjar", expression: "senang", position: "kiri" },
      { character: "claudecode", expression: "senang", position: "kanan" },
    ],
    lines: [
      {
        who: "ganjar",
        from: 0.3,
        dur: 5.5,
        text: "Follow kalau kamu mau terus melatih cara menilai kerja AI, bukan hanya memakainya.", tag: "friendly",
        shot: "medium",
        push: true,
        expressions: { ganjar: "senang", claudecode: "senang" },
        motions: { ganjar: "lambai" },
        motionAt: { ganjar: 4.2 },
      },
    ],
  },
];
