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
      { kind: "promptKode", from: 3.10, dur: 2.8 },
      { kind: "terminalError", from: 9.90, dur: 2.7 },
    ],
    lines: [
      { who: "claudecode", from: 0.3, dur: 2.5, text: "Oh. Aplikasinya sudah jalan?", tag: "deadpan", expressions: { claudecode: "mikir", ganjar: "senang" } },
      { who: "ganjar", from: 3.1, dur: 3.15, text: "Jalan dong. Tinggal prompt, jadi.", tag: "proud", expressions: { ganjar: "senang", claudecode: "mikir" } },
      { who: "claudecode", from: 6.55, dur: 1.83, text: "Yang nulis kodenya siapa?", tag: "deadpan", expressions: { claudecode: "serius", ganjar: "bingung" }, screenText: "Siapa Yang Nulis?" },
      { who: "ganjar", from: 8.68, dur: 0.92, text: "Kamu.", tag: "hesitant", expressions: { ganjar: "malu", claudecode: "serius" } },
      { who: "claudecode", from: 9.9, dur: 2.19, text: "Yang debug waktu error siapa?", tag: "deadpan", expressions: { claudecode: "serius", ganjar: "malu" }, screenText: "Siapa Yang Debug?" },
      { who: "ganjar", from: 12.39, dur: 1.88, text: "Kamu juga.", tag: "sheepish", expressions: { ganjar: "sedih", claudecode: "serius" } },
    ],
  },
  {
    id: "shift",
    seconds: 12,
    backdrop: "ruangKerja",
    time: "siang",
    tone: "biru",
    cast: cast("kesal", "serius"),
    onScreenText: "Dua Skill Yang Beda",
    note: "Papan tulis 'Kelas Prompt' di belakang Ganjar. Startle Ganjar di 'Coba tanya Claude' belum dipasang.",
    inserts: [{ kind: "muridBertanya", from: 7.17, dur: 4.6 }],
    lines: [
      { who: "claudecode", from: 0.3, dur: 4.09, text: "Jadi kamu mau ngajarin orang cara minta tolong ke aku?", tag: "sarcastic", expressions: { claudecode: "serius", ganjar: "kesal" } },
      { who: "ganjar", from: 4.69, dur: 1.88, text: "Ya kan hasilnya kelihatan.", tag: "defensive", expressions: { ganjar: "kesal", claudecode: "serius" } },
      { who: "claudecode", from: 6.87, dur: 5.61, text: "Sampai muridmu nanya, kenapa ini error? Kamu jawab apa? Coba tanya Claude?", tag: "sarcastic", expressions: { claudecode: "serius", ganjar: "kaget" } },
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
    backdrop: "ruangKerja",
    time: "malam",
    tone: "gelap",
    cast: cast("serius", "serius"),
    onScreenText: "",
    note: "Latar perlahan biru primary di kalimat terakhir belum dipasang. Satu kalimat per layar; 'Jatuh Di Production' satu-satunya sorotan oranye.",
    inserts: [{ kind: "alarmProduction", from: 8.36, dur: 3.4 }],
    lines: [
      { who: "claudecode", from: 0.3, dur: 3.06, text: "Bisa bikin aplikasi itu satu skill.", tag: "calm", expressions: { claudecode: "serius", ganjar: "serius" }, screenText: "Bisa Bikin: Satu Skill" },
      { who: "claudecode", from: 3.66, dur: 4.4, text: "Bisa menjelaskan kenapa aplikasinya jalan itu skill yang lain.", tag: "calm", screenText: "Bisa Menjelaskan: Skill Lain" },
      {
        who: "claudecode",
        from: 8.36,
        dur: 4.58,
        text: "Kelas yang bagus lahir dari orang yang pernah jatuh di production.", tag: "calm",
        expressions: { claudecode: "netral", ganjar: "serius" },
        screenText: "Kelas Bagus Lahir Dari *Jatuh Di Production*",
      },
    ],
  },
  {
    id: "jawab",
    seconds: 7,
    backdrop: "ruangKerja",
    time: "siang",
    cast: cast("mikir", "netral"),
    onScreenText: "",
    note: "Kedua karakter berdampingan, kamera zoom out pelan belum dipasang.",
    lines: [
      { who: "ganjar", from: 0.3, dur: 2.6, text: "Jadi aku belum boleh buka kelas?", tag: "curious", expressions: { ganjar: "mikir", claudecode: "netral" } },
      {
        who: "claudecode",
        from: 3.2,
        dur: 4.77,
        text: "Boleh. Ajarin yang kamu paham, bukan yang aku kerjain.", tag: "warm",
        expressions: { claudecode: "senang", ganjar: "senang" },
        screenText: "Ajarin Yang *Kamu Paham*, Bukan Yang Aku Kerjain",
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
    inserts: [{ kind: "kartuFollow", from: 0.60, dur: 3.2 }],
    lines: [{ who: "ganjar", from: 0.3, dur: 5.58, text: "Follow kalau kamu lagi mikir jualan ilmu, biar nggak jadi korban jago dikit kayak aku barusan.", tag: "friendly" }],
  },
];
