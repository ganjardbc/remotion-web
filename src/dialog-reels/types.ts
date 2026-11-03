import type { TimeOfDay } from "../assets/backdrops";

// Bentuk data Reels dialog 9:16. Satu scene = latar, pemeran, teks layar, dan
// baris ucapan. `narator`: semua baris diucapkan satu karakter; `dialog`: dua karakter atau lebih bergantian.

export type CharacterId = "ganjar" | "robot" | "claudecode";
export type VisualStyle = "rig" | "stickman";
export type Delivery = "narator" | "dialog";
export type DraftBackdrop = "ruangKerja" | "kosong" | "luarRuang";
export type Position = "kiri" | "tengah" | "kanan";

export type CastCue = {
  readonly character: CharacterId;
  // Ekspresi dari kosakata karakter dan varian itu.
  readonly expression: string;
  // Rig: nama clip (headTurn, point, startle, armGesture, surprise, walk). Stickman: nama gesture.
  readonly motion?: string | null;
  readonly position: Position;
};

export type DraftLine = {
  readonly who: CharacterId;
  // Detik sejak awal scene. Setelah voice over ada, baris digeser maju bila baris sebelumnya belum selesai.
  readonly from: number;
  // Perkiraan durasi sebelum voice over ada; setelah ada, diganti durasi audio asli.
  readonly dur: number;
  // Teks subtitle.
  readonly text: string;
  // Teks yang dikirim ke TTS bila beda dari `text` (angka dieja, singkatan dibaca utuh).
  readonly spoken?: string;
  // Tag emosi audio untuk TTS (mis. "excited", "deadpan"); dikirim sebagai `[tag] teks`. Butuh model yang mendukung tag (eleven_v4).
  readonly tag?: string;
  // Ekspresi karakter selama baris ini (berlaku sampai baris berikutnya yang mengaturnya); bila kosong, memakai ekspresi di `cast`.
  readonly expressions?: Readonly<Partial<Record<CharacterId, string>>>;
  // Teks layar yang tampil mulai baris ini (menggantikan `onScreenText` scene sampai baris berikutnya yang mengaturnya).
  // Tanda `*frasa*` = sorotan oranye (satu per layar).
  readonly screenText?: string;
  // Waktu mulai tiap kata (detik sejak baris mulai) untuk sorotan kata di caption; jumlahnya harus sama dengan jumlah kata `text`.
  // Bila kosong, waktu kata diperkirakan dari panjang huruf. Isi dari timestamp kata ElevenLabs setelah voiceover jadi.
  readonly wordTimes?: readonly number[];
  readonly id?: string;
  readonly vo?: string;
};

// Selipan (cutaway) di atas panggung: kartu layar penuh selama `dur` detik, voiceover dan chat tetap jalan.
// promptKode: prompt diketik lalu kode muncul. terminalError: terminal dengan error. muridBertanya: chat murid dan Ganjar.
// alarmProduction: dashboard production berubah merah. kartuFollow: kartu profil dengan tombol Follow.
export type InsertKind = "promptKode" | "terminalError" | "muridBertanya" | "alarmProduction" | "kartuFollow";

export type DraftInsert = {
  readonly kind: InsertKind;
  // Detik sejak awal scene.
  readonly from: number;
  readonly dur: number;
};

// Nada scene: terang (putih, bawaan), biru (wash biru primary, kartu teks biru), gelap (kartu teks gelap; latar gelap diatur lewat `time: "malam"`).
export type SceneTone = "terang" | "biru" | "gelap";

export type DraftScene = {
  readonly id: string;
  // Durasi minimal (detik). Scene memanjang bila voice over lebih panjang.
  readonly seconds: number;
  readonly backdrop: DraftBackdrop;
  readonly time: TimeOfDay;
  readonly cast: readonly CastCue[];
  readonly onScreenText: string;
  readonly tone?: SceneTone;
  readonly lines: readonly DraftLine[];
  readonly inserts?: readonly DraftInsert[];
  // Arahan visual dari draft, untuk dipoles tangan; tidak dirender.
  readonly note?: string;
};

// Gaya subtitle: `chat` (bubble dengan avatar dan riwayat) atau `caption` (satu baris teks di tengah).
export type SubtitleStyle = "chat" | "caption";

export type DraftMeta = {
  readonly title: string;
  readonly delivery: Delivery;
  readonly style: VisualStyle;
  readonly subtitle?: SubtitleStyle;
  // Gerak caption: `karaoke` (bawaan; kata yang diucapkan disorot, ada penanda pembicara) atau `none` (teks diam).
  // Whoosh di awal tiap scene; bawaan menyala, isi false untuk mematikan.
  readonly sceneSfx?: boolean;
  readonly captionMotion?: "karaoke" | "none";
};
