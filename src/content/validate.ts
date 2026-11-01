import type { CarouselSlide, CarouselSpec } from "./types";

// Pemeriksa aturan konten carousel (Format B dan C). Tanpa impor runtime supaya bisa dijalankan langsung oleh
// scripts/validate-content.mjs (Node >= 22.18 membuang tipe TypeScript sendiri) maupun dipakai di komponen.

export type Issue = { readonly level: "error" | "warn"; readonly where: string; readonly message: string };

export const RULES = {
  titleWordsB: [4, 8],
  slideCount: { B: [5, 10], "quick-tips": [4, 6], walkthrough: [8, 12] },
  hashtags: 5,
  // Slide ke-2 atau ke-3 (1-based) wajib memuat CTA follow.
  ctaSlides: [2, 3],
  codeMaxLines: 12,
  captionWarnChars: 220,
  hookSentencesB: [1, 2],
  slideSentencesB: [1, 4],
  paragraphsB: [1, 3],
  paragraphSentences: 2,
  textSentencesC: 4,
  // Keterbacaan: isi per slide dan judul. Isi >~320 karakter terlalu padat dibaca sambil menggeser.
  slideCharsWarn: 320,
  titleCharsWarn: 70,
  quoteCharsWarn: 120,
  altMinChars: 15,
  // Code panjang bersama teks panjang tidak muat dengan ukuran huruf yang nyaman.
  codeLinesWithTextWarn: 10,
  codeTextSentencesWarn: 2,
} as const;

const INFORMAL = /\b(gue|gua|gw|lo|loe|lu|elo|elu)\b/i;
const FORMAL = /\banda\b/i;
const BULLET = /^\s*([-*•]|\d+[.)])\s/;
const GENERIC_CTA = /(tips|konten) lainnya|follow untuk tips|ikuti untuk tips/i;

const words = (s: string): number => s.trim().split(/\s+/).filter(Boolean).length;
// Kalimat berakhir pada . ! ? diikuti spasi atau akhir teks, jadi "AGENTS.md" tidak terpecah.
const sentences = (s: string): number => s.split(/[.!?…]+(?:\s+|$)/).filter((x) => x.trim().length > 0).length;
const lines = (s: string): number => s.replace(/\s+$/, "").split("\n").length;

const slideText = (s: CarouselSlide): string[] => [
  s.title,
  ...s.paragraphs,
  ...(s.cta ? [s.cta] : []),
  ...(s.quote ? [s.quote] : []),
  ...(s.stat ? [s.stat.label, s.stat.value, ...(s.stat.note ? [s.stat.note] : [])] : []),
];

export const validateCarousel = (spec: CarouselSpec): Issue[] => {
  const out: Issue[] = [];
  const err = (where: string, message: string) => out.push({ level: "error", where, message });
  const warn = (where: string, message: string) => out.push({ level: "warn", where, message });
  const { slides } = spec;
  const isB = spec.format === "B";

  // Judul dan variasi
  if (!spec.title.trim()) err("title", "judul kosong.");
  if (isB) {
    const n = words(spec.title);
    const [lo, hi] = RULES.titleWordsB;
    if (n < lo || n > hi) err("title", `judul Format B harus ${lo}-${hi} kata, sekarang ${n}.`);
  }
  if (!isB && !spec.variant) err("variant", "Format C wajib menyebut variant: quick-tips atau walkthrough.");
  if (isB && spec.variant) warn("variant", "variant hanya dipakai Format C.");

  // Jumlah slide
  const key = isB ? "B" : spec.variant ?? "walkthrough";
  const [minN, maxN] = RULES.slideCount[key];
  if (slides.length < minN || slides.length > maxN) err("slides", `${key} butuh ${minN}-${maxN} slide, sekarang ${slides.length}.`);

  // Urutan peran
  if (slides[0]?.role !== "hook") err("slide 1", "slide pertama harus berperan hook.");
  if (slides[slides.length - 1]?.role !== "closing") err(`slide ${slides.length}`, "slide terakhir harus berperan closing.");
  if (isB) {
    const relate = slides.findIndex((s) => s.role === "relate");
    const shift = slides.findIndex((s) => s.role === "shift");
    if (relate < 0) err("slides", "Format B wajib punya slide relate.");
    if (shift < 0) err("slides", "Format B wajib punya slide shift (inti).");
    if (relate >= 0 && shift >= 0 && relate > shift) err("slides", "relate harus muncul sebelum shift.");
    if (slides.some((s) => s.role === "step")) err("slides", "peran step hanya untuk Format C.");
  }

  // CTA di slide 2 atau 3
  const ctaPositions = RULES.ctaSlides;
  const hasEarlyCta = ctaPositions.some((p) => Boolean(slides[p - 1]?.cta?.trim()));
  if (!hasEarlyCta) err("cta", `CTA follow harus ada di slide ${ctaPositions.join(" atau ")}, bukan hanya di penutup.`);
  slides.forEach((s, i) => {
    if (s.cta && GENERIC_CTA.test(s.cta)) err(`slide ${i + 1}`, "CTA terlalu generik; sebut alasan spesifik ke isi konten.");
  });

  // Per slide
  slides.forEach((s, i) => {
    const at = `slide ${i + 1} (${s.role})`;
    if (!s.title.trim()) err(at, "setiap slide wajib punya judul.");
    if (s.accent && !s.title.includes(s.accent)) err(at, `accent "${s.accent}" bukan bagian dari judul.`);
    if (s.cast && s.cast.length > 3) warn(at, "pemeran lebih dari 3 tidak digambar.");
    if (s.title.length > RULES.titleCharsWarn) warn(at, `judul ${s.title.length} karakter; usahakan <= ${RULES.titleCharsWarn} (maks. 3 baris).`);

    if (s.image) {
      if (!s.image.src.trim()) err(at, "image.src kosong.");
      if (!s.image.alt.trim()) err(at, "gambar wajib punya alt (jelaskan isi dan angka penting di dalamnya).");
      else if (s.image.alt.trim().length < RULES.altMinChars) warn(at, "alt gambar terlalu singkat; jelaskan isi gambar.");
      if (s.cast && s.cast.length > 0) warn(at, "cast dan image tidak dirender bersamaan; cast diabaikan.");
    }
    if (s.stat) {
      if (!s.stat.label.trim() || !s.stat.value.trim()) err(at, "stat butuh label dan value.");
    }
    if (s.quote !== undefined) {
      if (!s.quote.trim()) err(at, "quote kosong.");
      else if (s.quote.length > RULES.quoteCharsWarn) warn(at, `quote ${s.quote.length} karakter; usahakan <= ${RULES.quoteCharsWarn}.`);
    }

    const total = s.paragraphs.reduce((n, p) => n + sentences(p), 0);
    const chars = s.paragraphs.reduce((n, p) => n + p.length, 0);
    if (chars > RULES.slideCharsWarn) warn(at, `isi ${chars} karakter; usahakan <= ${RULES.slideCharsWarn} supaya nyaman dibaca.`);
    if (isB) {
      if (s.role === "hook") {
        const [lo, hi] = RULES.hookSentencesB;
        if (s.paragraphs.length !== 1 || total < lo || total > hi) err(at, `slide hook: 1 paragraf, ${lo}-${hi} kalimat (sekarang ${s.paragraphs.length} paragraf, ${total} kalimat).`);
      } else {
        const [pLo, pHi] = RULES.paragraphsB;
        const [sLo, sHi] = RULES.slideSentencesB;
        if (s.paragraphs.length < pLo || s.paragraphs.length > pHi) err(at, `${pLo}-${pHi} paragraf per slide, sekarang ${s.paragraphs.length}.`);
        if (total < sLo || total > sHi) err(at, `${sLo}-${sHi} kalimat per slide, sekarang ${total}.`);
      }
      if (s.paragraphs.some((p) => BULLET.test(p))) err(at, "hindari bullet/numbered list di Format B; tulis sebagai prosa.");
    } else {
      if (s.role === "hook" && total !== 1) err(at, `hook Format C 1 kalimat, sekarang ${total}.`);
      if (total > RULES.textSentencesC) err(at, `teks di luar code maksimal ${RULES.textSentencesC} kalimat, sekarang ${total}.`);
    }
    s.paragraphs.forEach((p) => {
      if (!p.trim()) err(at, "ada paragraf kosong.");
      if (sentences(p) > RULES.paragraphSentences) warn(at, `paragraf lebih dari ${RULES.paragraphSentences} kalimat: "${p.slice(0, 40)}…"`);
    });

    if (s.code) {
      if (!s.code.lang.trim()) err(at, "code block butuh lang.");
      const n = lines(s.code.code);
      if (n > RULES.codeMaxLines) err(at, `code ${n} baris; maksimal ${RULES.codeMaxLines}. Pecah jadi beberapa slide.`);
      else if (n > RULES.codeLinesWithTextWarn && total > RULES.codeTextSentencesWarn) warn(at, `code ${n} baris bersama ${total} kalimat tidak muat nyaman; kurangi teks atau pecah slide.`);
    }

    slideText(s).forEach((t) => {
      if (INFORMAL.test(t)) err(at, `pakai "aku-kamu", bukan gue/lo: "${t.slice(0, 40)}…"`);
      if (FORMAL.test(t)) warn(at, `"Anda" tidak konsisten dengan aku-kamu: "${t.slice(0, 40)}…"`);
    });
  });

  // Caption dan hashtag
  if (!spec.caption.trim()) err("caption", "caption kosong.");
  if (spec.caption.length > RULES.captionWarnChars) warn("caption", `caption ${spec.caption.length} karakter; usahakan pendek (<= ${RULES.captionWarnChars}).`);
  if (INFORMAL.test(spec.caption)) err("caption", "pakai aku-kamu, bukan gue/lo.");
  if (spec.hashtags.length !== RULES.hashtags) err("hashtags", `tepat ${RULES.hashtags} hashtag, sekarang ${spec.hashtags.length}.`);
  spec.hashtags.forEach((h) => {
    if (!/^#[\p{L}\p{N}_]+$/u.test(h)) err("hashtags", `format hashtag salah: "${h}".`);
  });
  const lower = spec.hashtags.map((h) => h.toLowerCase());
  if (lower.some((h, i) => lower.indexOf(h) !== i)) err("hashtags", "ada hashtag ganda.");

  return out;
};

export const formatIssues = (issues: readonly Issue[]): string =>
  issues.map((i) => `${i.level === "error" ? "ERROR" : "warn "} [${i.where}] ${i.message}`).join("\n");
