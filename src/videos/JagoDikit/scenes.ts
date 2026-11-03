import type { CastCue, DraftScene } from "../../dialog-reels";

// Data scene JagoDikit (Reels dialog, Format A). Ganjar duduk di balik meja, Claude Code di atas meja, latar ruang kerja.
// `from` dan `dur` hanya perkiraan; setelah voiceover ada, durasi scene mengikuti audio.
// Ekspresi dasar ada di `cast`; `expressions` di baris mengganti ekspresi sejak baris itu mulai.
// `screenText` di baris mengganti teks layar sejak baris itu mulai (`*frasa*` = sorotan oranye).
// `inserts` = cutaway fullscreen; `from` dan `dur` cutaway masih perkiraan sampai voiceover jadi.

const cast = (ganjar: string, cc: string): readonly CastCue[] => [
  { character: "ganjar", expression: ganjar, motion: null, position: "kiri" },
  { character: "claudecode", expression: cc, motion: null, position: "kanan" },
];

export const BASE_SCENES: readonly DraftScene[] = [
  {
    id: "hook",
    seconds: 5,
    backdrop: "ruangKerja",
    time: "siang",
    tone: "biru",
    cast: cast("senang", "netral"),
    onScreenText: "Jago Dikit, Buka Kelas",
    note: "Ganjar slide masuk dari kiri. Judul fade-in lalu naik mengecil. Ikon laptop dengan UI aplikasi muncul di 'bikin aplikasi'.",
    lines: [
      {
        who: "ganjar",
        from: 0.3,
        dur: 4.9,
        text: "Claude, aku udah bisa bikin aplikasi sendiri. Aku mau buka kelas.",
        tag: "excited",
        // Klip hook-01 diperlambat 0,85x (ffmpeg atempo) setelah generate karena [excited] terlalu cepat; generate ulang menghapusnya.
        // Waktu kata dari frasa di audio (ffmpeg silencedetect): "Claude," 0-0,49; "aku ... sendiri." 0,85-3,14; "Aku mau buka kelas." 3,50-4,79.
        wordTimes: [0, 0.85, 1.09, 1.39, 1.69, 2.06, 2.6, 3.5, 3.76, 4.02, 4.34],
      },
    ],
  },
  {
    id: "relate",
    seconds: 12,
    backdrop: "ruangKerja",
    time: "siang",
    cast: cast("senang", "mikir"),
    onScreenText: "",
    inserts: [
      { kind: "promptKode", from: 3.10, dur: 3.5 },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.5, text: "Oh. Aplikasinya sudah jalan?", tag: "deadpan", expressions: { claudecode: "mikir", ganjar: "senang" } },
      { who: "ganjar", from: 3.1, dur: 3.15, text: "Jalan dong. Tinggal prompt, jadi.", tag: "proud", expressions: { ganjar: "senang", claudecode: "mikir" } },
      { who: "claudecode", from: 6.55, dur: 1.83, text: "Yang nulis kodenya siapa?", motions: { claudecode: "armGesture", ganjar: "headTurn" }, tag: "deadpan", expressions: { claudecode: "serius", ganjar: "bingung" }, screenText: "Siapa Yang Nulis?" },
      { who: "ganjar", from: 8.68, dur: 0.92, text: "Kamu.", motions: { ganjar: "point" }, tag: "hesitant", expressions: { ganjar: "malu", claudecode: "serius" } },
      { who: "claudecode", from: 9.9, dur: 2.19, text: "Yang debug waktu error siapa?", motions: { claudecode: "armGesture" }, tag: "deadpan", expressions: { claudecode: "serius", ganjar: "malu" }, screenText: "Siapa Yang Debug?\n@logError" },
      { who: "ganjar", from: 12.39, dur: 1.88, text: "Kamu juga.", motions: { ganjar: "headTurn" }, tag: "sheepish", expressions: { ganjar: "sedih", claudecode: "serius" } },
    ],
  },
  {
    id: "shift",
    seconds: 12,
    // Kelas sore: Ganjar dan Claude Code berdiri di depan papan dua kolom (Bisa Bikin / Bisa Menjelaskan) berisi info kelas.
    backdrop: "kelas",
    time: "sore",
    cast: [
      { character: "ganjar", expression: "kesal", motion: null, position: "kiri" },
      { character: "claudecode", expression: "serius", motion: null, position: "kanan", scale: 1.2 },
    ],
    onScreenText: "Dua Skill Yang Beda\n||Bisa Bikin|ok|Prompt, aplikasi jadi\n||Bisa Menjelaskan|...|Tahu kenapa ia jalan\n#Kelas Bikin Aplikasi Dengan AI · Rp 499.000",
    note: "Tanda tanya di kolom kedua muncul di baris Ganjar 'Ya kan hasilnya kelihatan.' (papan lalu berganti ke percakapan murid).",
    lines: [
      { who: "claudecode", from: 0.3, dur: 4.09, text: "Jadi kamu mau ngajarin orang cara minta tolong ke aku?", motions: { claudecode: "armGesture" }, tag: "sarcastic", expressions: { claudecode: "serius", ganjar: "kesal" } },
      { who: "ganjar", from: 4.69, dur: 1.88, text: "Ya kan hasilnya kelihatan.", motions: { ganjar: "headTurn" }, tag: "defensive", expressions: { ganjar: "kesal", claudecode: "serius" }, screenText: "Dua Skill Yang Beda\n||Bisa Bikin|ok|Prompt, aplikasi jadi\n||Bisa Menjelaskan|?|Tahu kenapa ia jalan\n#Kelas Bikin Aplikasi Dengan AI · Rp 499.000" },
      { who: "claudecode", from: 6.87, dur: 5.61, text: "Sampai muridmu nanya, kenapa ini error? Kamu jawab apa? Coba tanya Claude?", motions: { claudecode: "armGesture", ganjar: "startle" }, motionAt: { claudecode: 0.3, ganjar: 5.0 }, tag: "sarcastic", expressions: { claudecode: "serius", ganjar: "kaget" }, screenText: "Kelas Prompt\n$murid|Kenapa Ini Error?@1.0\n$ganjar|Coba Tanya Claude@4.2" },
    ],
  },
  {
    id: "urgency",
    seconds: 5,
    backdrop: "ruangKerja",
    time: "malam",
    tone: "gelap",
    cast: cast("mikir", "serius"),
    onScreenText: "Dengarkan Ini",
    note: "Claude Code menghadap kamera, scale 1.0 ke 1.12 ease-out; Ganjar blur di belakang. Musik turun volume.",
    lines: [{ who: "claudecode", from: 0.3, dur: 4.26, text: "Dan kalimat berikutnya bikin banyak orang batal jualan kelas.", tag: "lowered voice" }],
  },
  {
    id: "closing",
    seconds: 12,
    backdrop: "kelas",
    time: "malam",
    tone: "gelap",
    // Claude Code mengajar sendirian di depan papan tulis; teks layar tampil di papan.
    cast: [{ character: "claudecode", expression: "serius", motion: null, position: "tengah", scale: 1.4 }],
    onScreenText: "",
    note: "Segmen mengajar: Claude Code sendirian di latar kelas. Latar perlahan biru primary di kalimat terakhir belum dipasang. Satu kalimat per layar di papan; 'Jatuh Di Production' satu-satunya sorotan oranye.",
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.06, text: "Bisa bikin aplikasi itu satu skill.", tag: "calm", expressions: { claudecode: "serius" }, motions: { claudecode: "armGesture" }, screenText: "Bisa Bikin: Satu Skill" },
      { who: "claudecode", from: 3.66, dur: 4.4, text: "Bisa menjelaskan kenapa aplikasinya jalan itu skill yang lain.", tag: "calm", motions: { claudecode: "armGesture" }, screenText: "Bisa Menjelaskan: Skill Lain" },
      {
        who: "claudecode",
        from: 8.36,
        dur: 4.58,
        text: "Kelas yang bagus lahir dari orang yang pernah jatuh di production.", motions: { claudecode: "armGesture" }, tag: "calm",
        expressions: { claudecode: "netral" },
        screenText: "Kelas Bagus Lahir Dari *Jatuh Di Production*",
      },
    ],
  },
  {
    id: "jawab",
    seconds: 7,
    backdrop: "kelas",
    time: "siang",
    // Ganjar masuk frame dari kiri (berdiri) lalu bertanya; dialog berlanjut di ruang kelas yang sama.
    cast: [
      { character: "ganjar", expression: "mikir", motion: null, position: "kiri", enterFrom: "kiri", enterAt: 0 },
      { character: "claudecode", expression: "netral", motion: null, position: "kanan", scale: 1.2 },
    ],
    onScreenText: "Belum Boleh Buka Kelas?",
    note: "Ganjar masuk frame dari kiri, lalu kedua karakter berdampingan. Kamera zoom sengaja tidak dipakai.",
    lines: [
      { who: "ganjar", from: 0.9, dur: 2.6, text: "Jadi aku belum boleh buka kelas?", motions: { ganjar: "headTurn" }, tag: "curious", expressions: { ganjar: "mikir", claudecode: "netral" } },
      {
        who: "claudecode",
        from: 3.8,
        dur: 4.77,
        text: "Boleh. Ajarin yang kamu paham, bukan yang aku kerjain.", motions: { claudecode: "armGesture" }, tag: "warm",
        expressions: { claudecode: "senang", ganjar: "senang" },
        screenText: "Silabus Kelas Baru\nKenapa aplikasinya jalan\nKenapa bisa error\nCara debug sendiri",
      },
    ],
  },
  {
    id: "cta",
    seconds: 6,
    backdrop: "ruangKerja",
    time: "siang",
    tone: "biru",
    cast: cast("senang", "senang"),
    onScreenText: "Follow Kalau Mau *Jualan Ilmu*",
    note: "Ganjar maju ke tengah (scale 1.0 ke 1.08, ease-out) belum dipasang.",
    screenExtra: "profilFollow",
    lines: [{ who: "ganjar", from: 0.3, dur: 5.58, text: "Follow kalau kamu lagi mikir jualan ilmu, biar nggak jadi korban jago dikit kayak aku barusan.", tag: "friendly" }],
  },
];
