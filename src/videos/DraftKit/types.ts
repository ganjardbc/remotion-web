import type { TimeOfDay } from "../../assets/backdrops";

// Bentuk data video dari draft content_studio (Reels 9:16). Satu scene = latar, pemeran, teks layar, dan
// baris ucapan. `narator`: semua baris diucapkan satu karakter; `dialog`: dua karakter atau lebih bergantian.

export type CharacterId = "ganjar" | "robot" | "claudecode";
export type VisualStyle = "rig" | "stickman";
export type Delivery = "narator" | "dialog";
export type DraftBackdrop = "ruangKerja" | "kosong" | "luarRuang";
export type Position = "kiri" | "tengah" | "kanan";

export type CastCue = {
  readonly character: CharacterId;
  // Ekspresi dari kosakata karakter dan varian itu (dicek content_studio sebelum diekspor).
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
  readonly id?: string;
  readonly vo?: string;
};

export type DraftScene = {
  readonly id: string;
  // Durasi minimal (detik). Scene memanjang bila voice over lebih panjang.
  readonly seconds: number;
  readonly backdrop: DraftBackdrop;
  readonly time: TimeOfDay;
  readonly cast: readonly CastCue[];
  readonly onScreenText: string;
  readonly lines: readonly DraftLine[];
  // Arahan visual dari draft, untuk dipoles tangan; tidak dirender.
  readonly note?: string;
};

// Carousel 4:5 (1080x1350): satu slide = satu gambar. Cover membuka, detail berisi satu poin, closing menutup.
export type SlideRole = "cover" | "detail" | "closing";

export type CarouselSlide = {
  readonly id: string;
  readonly role: SlideRole;
  readonly headline: string;
  readonly body: string;
  // Pemeran digambar diam di panel bawah; latar dan waktu dari draft dicatat untuk dipoles tangan.
  readonly cast: readonly CastCue[];
  readonly backdrop: DraftBackdrop;
  readonly time: TimeOfDay;
  readonly note?: string;
};

export type CarouselMeta = {
  readonly title: string;
  readonly style: VisualStyle;
};

export type DraftMeta = {
  readonly title: string;
  readonly delivery: Delivery;
  readonly style: VisualStyle;
};
