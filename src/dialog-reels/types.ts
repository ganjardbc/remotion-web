import type { TimeOfDay } from "../assets/backdrops";

// Bentuk data Reels dialog 9:16. Satu scene = latar, pemeran, teks layar, dan
// baris ucapan. `narator`: semua baris diucapkan satu karakter; `dialog`: dua karakter atau lebih bergantian.

export type CharacterId = "ganjar" | "robot" | "claudecode";
export type VisualStyle = "rig" | "stickman";
export type Delivery = "narator" | "dialog";
// `kelas` = latar polos dengan papan tulis di belakang karakter; teks layar scene tampil di papan.
export type DraftBackdrop = "ruangKerja" | "kosong" | "luarRuang" | "kelas";
export type Position = "kiri" | "tengah" | "kanan";

export type CastCue = {
  readonly character: CharacterId;
  // Ekspresi dari kosakata karakter dan varian itu.
  readonly expression: string;
  // Rig: nama clip (headTurn, point, startle, armGesture, surprise, walk). Stickman: nama gesture.
  readonly motion?: string | null;
  readonly position: Position;
  // Pengali tinggi karakter (bawaan 1), mis. 1.4 untuk Claude Code yang tampil sendirian sebagai pengajar.
  readonly scale?: number;
  // Karakter berdiri meluncur masuk dari sisi layar sejak `enterAt` (detik sejak scene mulai, bawaan 0) selama 0,7 dtk.
  // Tidak berlaku untuk karakter yang duduk di ruang kerja.
  readonly enterFrom?: "kiri" | "kanan";
  readonly enterAt?: number;
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
  // Gerak karakter yang dimainkan sejak baris ini mulai (rig: headTurn, point, startle untuk Ganjar; armGesture, surprise, walk
  // untuk Robot dan Claude Code). `motionAt` = tunda (detik sejak baris mulai) per karakter, mis. untuk frasa di tengah baris.
  // Bila satu karakter tidak punya `motions` di baris mana pun, `motion` di `cast` dipakai (sekali, di baris pertamanya).
  readonly motions?: Readonly<Partial<Record<CharacterId, string>>>;
  readonly motionAt?: Readonly<Partial<Record<CharacterId, number>>>;
  // Ekspresi karakter yang berganti di tengah baris (`at` = detik sejak baris mulai), mis. pendengar kaget sebelum kalimat selesai.
  readonly reactions?: readonly { readonly who: CharacterId; readonly expression: string; readonly at: number }[];
  // Efek suara di baris ini: `name` = nama berkas di public/sfx/synth (tanpa .wav), `at` = detik sejak baris mulai (bawaan 0).
  readonly sfx?: readonly { readonly name: string; readonly at?: number; readonly volume?: number }[];
  readonly id?: string;
  readonly vo?: string;
};

// Selipan (cutaway) di atas panggung: kartu layar penuh selama `dur` detik, voiceover dan chat tetap jalan.
// promptKode: prompt diketik lalu kode muncul. terminalError: terminal dengan error. muridBertanya: chat murid dan Ganjar.
// alarmProduction: dashboard production berubah merah. kartuFollow: kartu profil dengan tombol Follow.
// gitBlame: riwayat commit, semua baris ditulis satu penulis. landingKelas: halaman jualan kelas. silabusBaru: daftar materi kelas.
export type InsertKind = "promptKode" | "terminalError" | "muridBertanya" | "alarmProduction" | "kartuFollow" | "gitBlame" | "landingKelas" | "silabusBaru";

export type DraftInsert = {
  readonly kind: InsertKind;
  // Detik sejak awal scene.
  readonly from: number;
  readonly dur: number;
};

// Nada scene: terang (putih, bawaan), biru (wash biru primary, kartu teks biru), gelap (kartu teks gelap; latar gelap diatur lewat `time: "malam"`).
export type SceneTone = "terang" | "biru" | "gelap";

// Transisi masuk scene: `potong` (bawaan), `geser` (isi meluncur dari kanan), `wipe` (panel biru menyapu ke kanan), `flash` (kilat putih).
export type SceneTransition = "potong" | "geser" | "wipe" | "flash";

// Dekorasi di dinding antara kartu atas dan karakter (di bawah kartu, di atas panggung): `laptopApp` = jendela aplikasi
// dengan UI yang menyala; `chipMengambang` = tiga chip kecil (kode, kelas, app) melayang pelan. `at` = detik sejak scene mulai.
export type DraftDecor = { readonly kind: "laptopApp" | "chipMengambang"; readonly at: number };

export type DraftScene = {
  readonly id: string;
  // Durasi minimal (detik). Scene memanjang bila voice over lebih panjang.
  readonly seconds: number;
  readonly backdrop: DraftBackdrop;
  readonly time: TimeOfDay;
  readonly cast: readonly CastCue[];
  readonly onScreenText: string;
  readonly tone?: SceneTone;
  // Lampu sorot: tepi layar digelapkan dan kerucut cahaya hangat jatuh dari atas ke papan dan karakter (cocok untuk latar malam).
  readonly spotlight?: boolean;
  // Transisi saat scene ini mulai (bawaan `potong`).
  readonly transisi?: SceneTransition;
  // Kartu teks layar atas: perataan (bawaan tengah), kemiringan dalam derajat (tampilan stiker), dan gerak teks (`kata` = muncul kata demi kata).
  readonly cardAlign?: "tengah" | "kiri" | "kanan";
  readonly cardTilt?: number;
  readonly cardMotion?: "blok" | "kata";
  // Pengali volume musik latar selama scene ini (bawaan 1), mis. 0.3 untuk meredam di urgency.
  readonly music?: number;
  // Isi tambahan di kartu teks layar atas: `profilFollow` = logo, handle, dan tombol Follow yang berubah jadi "Following".
  // `infoKelas` = nama kelas, harga, dan tombol Daftar (ringkasan landing page kelas).
  readonly screenExtra?: "profilFollow" | "infoKelas";
  // Punch-in/zoom out: skala kamera dari `from` ke `to` (ease-out) sepanjang scene, berpusat di `focus` (bila kosong, tengah layar).
  // Menggantikan kamera "ikuti" untuk scene ini.
  readonly zoom?: { readonly from: number; readonly to: number; readonly focus?: CharacterId };
  readonly lines: readonly DraftLine[];
  readonly inserts?: readonly DraftInsert[];
  readonly decor?: readonly DraftDecor[];
  // Arahan visual dari draft, untuk dipoles tangan; tidak dirender.
  readonly note?: string;
};

// Gaya subtitle: `chat` (bubble dengan avatar dan riwayat) atau `caption` (satu baris teks di tengah).
export type SubtitleStyle = "chat" | "caption";

export type DraftMeta = {
  // Pop pendek tiap giliran bicara ganti (pop_ganjar untuk Ganjar, pop_claude untuk lainnya); bawaan mati.
  readonly speakerPop?: boolean;
  // Whoosh antar scene lebih rendah (laju 0,75) bila latar berganti; bawaan semua whoosh sama.
  readonly whooshVariants?: boolean;
  // Gerak diam halus (napas dan miring tipis) pada karakter; bawaan mati.
  readonly idleMotion?: boolean;
  readonly title: string;
  readonly delivery: Delivery;
  readonly style: VisualStyle;
  readonly subtitle?: SubtitleStyle;
  // Gerak caption: `karaoke` (bawaan; kata yang diucapkan disorot, ada penanda pembicara) atau `none` (teks diam).
  // Whoosh di awal tiap scene; bawaan menyala, isi false untuk mematikan.
  readonly sceneSfx?: boolean;
  // Kamera panggung: `ikuti` = zoom pelan dan geser ke karakter yang bicara; `diam` (bawaan) = tetap.
  readonly camera?: "ikuti" | "diam";
  readonly captionMotion?: "karaoke" | "none";
};
