import type { CastCue, VisualStyle } from "../dialog-reels/types";

// Skema konten carousel (Format B opini, Format C tutorial). Satu carousel = satu berkas `carousel.content.ts`
// di folder videonya yang mengekspor `CAROUSEL: CarouselSpec`. Aturannya dicek oleh ./validate.ts
// (`npm run validate`) dan dirangkum di CLAUDE.md.

export type CarouselFormat = "B" | "C";
// Wajib untuk Format C.
export type CarouselVariant = "quick-tips" | "walkthrough";
// Format B: hook, relate, shift, detail (opsional), closing. Format C: hook, detail (konteks), step, closing.
export type SlideRole = "hook" | "relate" | "shift" | "detail" | "step" | "closing";

export type CodeBlock = {
  readonly lang: string;
  // Maksimal 12 baris; lebih panjang dari itu pecah jadi beberapa slide (1 langkah = 1 slide).
  readonly code: string;
};

// Warna latar slide. Bawaan per peran: hook dan shift biru, sisanya putih (closing juga putih).
export type SlideTone = "biru" | "putih";
// "atas": di atas judul. "samping": di sebelah blok `stat`. "bawah": di bawah isi.
// Bawaan: "samping" bila slide punya `stat`, selain itu "bawah". Gambar opsional di slide mana pun.
export type ImagePosition = "atas" | "samping" | "bawah";

export type SlideImage = {
  // Path di bawah public/, mis. "carousel/model-murah/haiku.png".
  readonly src: string;
  // Wajib. Jelaskan isi gambar, termasuk angka atau teks penting di dalamnya (dipakai sebagai alt text).
  readonly alt: string;
  readonly position?: ImagePosition;
};

// Blok angka besar: label kecil, nilai, keterangan. Angka dari gambar sebaiknya diulang di sini agar terbaca di HP.
export type Stat = {
  readonly label: string;
  readonly value: string;
  readonly note?: string;
};

export type CarouselSlide = {
  readonly role: SlideRole;
  readonly tone?: SlideTone;
  // Wajib di setiap slide, termasuk hook dan closing.
  readonly title: string;
  // Satu frasa di dalam `title` yang disorot oranye (opsional, harus bagian dari title).
  readonly accent?: string;
  // Aku-kamu, paragraf pendek (1-2 kalimat per paragraf). Tanpa bullet di Format B.
  readonly paragraphs: readonly string[];
  readonly code?: CodeBlock;
  readonly image?: SlideImage;
  readonly stat?: Stat;
  // Kalimat kunci dalam kartu berbingkai (mis. pertanyaan penutup di slide shift).
  readonly quote?: string;
  // Ajakan follow dengan alasan spesifik ke isi konten. Wajib ada di slide 2 atau 3.
  readonly cta?: string;
  // Pemeran digambar diam di panel bawah (maksimal 3). Opsional; tidak dipakai bersama image, code, atau cta.
  readonly cast?: readonly CastCue[];
};

export type CarouselSpec = {
  readonly format: CarouselFormat;
  readonly variant?: CarouselVariant;
  // Format B: 4-8 kata.
  readonly title: string;
  readonly style: VisualStyle;
  readonly slides: readonly CarouselSlide[];
  // Caption pendek.
  readonly caption: string;
  // Tepat 5.
  readonly hashtags: readonly string[];
};
