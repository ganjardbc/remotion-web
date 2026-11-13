// Peta zona layout Reels 9:16 (1080x1920). Semua posisi piksel di scene Reels diturunkan dari sini, jangan menulis angka y
// sendiri. Ubah satu angka di sini dan zona lain ikut; `npm run validate:layout` memeriksa bahwa zonanya masuk akal dan
// memberi peringatan kalau berkas video menulis posisi di luar peta.
//
//   0 ─ top: zona atas antarmuka aplikasi (perkiraan, ±250 px) ── penanda scene dan braket sudut ada di y 130-190
//   contentTop ─ judul dan konten scene mulai di bawah garis ini
//   contentBottom ─ konten berakhir; karakter dan meja mulai
//   deskTop ─ permukaan meja (karakter dan benda berdiri di sini)
//   captionTop ─ pita caption (satu baris) di tepi depan meja
//   deskBottom ─ dasar meja
//   footerTop ─ BrandFooter (logo dan handle)
//   safeBottom ─ perkiraan batas zona bawah yang bisa tertutup nama akun dan caption postingan

export const REELS_W = 1080;
export const REELS_H = 1920;

export const ZONES = {
  headerBottom: 190,
  contentTop: 250,
  contentBottom: 1130,
  deskTop: 1540,
  deskHeight: 260,
  captionTop: 1655,
  captionHeight: 70,
  footerTop: 1825,
  safeBottom: 1570,
} as const;

export const DESK_BOTTOM = ZONES.deskTop + ZONES.deskHeight;
// Tinggi wadah konten bawaan (Frame): contentTop sampai contentBottom, isi dipusatkan.
export const CONTENT_HEIGHT = ZONES.contentBottom - ZONES.contentTop;
// Kaki karakter yang berdiri langsung di meja (di tengah kedalaman meja).
export const FEET_ON_DESK = ZONES.deskTop + 100;
// Keyboard (miring) berdiri di meja; kaki karakter menapak di tengah keyboard.
export const KEYBOARD_TOP = ZONES.deskTop - 205;
export const FEET_ON_KEYBOARD = KEYBOARD_TOP + 150;

// ---------- Tata letak narator aman platform (tanpa meja) ----------
// Bagian bawah layar Instagram dan TikTok tertutup nama akun, caption postingan, dan info audio; sisi kanan tertutup kolom tombol.
// Karena itu subtitle dan karakter dipindah ke atas `safeBottom`, dan subtitle dibatasi dari sisi kanan. Angka perkiraan, uji di aplikasi.
// Tiga mode per scene: karakter `normal`, `small` (konten banyak), atau `hidden` (konten sangat banyak). Konten selalu mulai di
// contentTop; makin kecil karakter, makin tinggi area konten. Subtitle (dua baris) tepat di bawah konten, di atas karakter.
export const SAFE_RIGHT = 150; // kolom tombol platform
export const SAFE_SIDE = 60;
export const NARRATOR_FEET_Y = 1555; // kaki karakter, di atas safeBottom
export const SUBTITLE_HEIGHT = 160;
export const NARRATOR_MODES = {
  normal: { h: 340, contentBottom: 1010, subtitleTop: 1040 },
  small: { h: 220, contentBottom: 1140, subtitleTop: 1170 },
  hidden: { h: 0, contentBottom: 1330, subtitleTop: 1370 },
} as const;
export type NarratorMode = keyof typeof NARRATOR_MODES;

// Pemeriksaan kewajaran peta zona; kosong berarti beres. Dipakai scripts/validate-layout.mjs.
export const layoutProblems = (): readonly string[] => {
  const z = ZONES;
  const p: string[] = [];
  if (!(z.headerBottom < z.contentTop)) p.push("contentTop harus di bawah headerBottom (judul tidak boleh menempel header).");
  if (!(z.contentTop < z.contentBottom)) p.push("contentBottom harus di bawah contentTop.");
  if (!(z.contentBottom < z.deskTop)) p.push("contentBottom harus di atas deskTop (konten tidak boleh menimpa meja).");
  if (!(z.deskTop < z.captionTop && z.captionTop + z.captionHeight <= DESK_BOTTOM)) p.push("pita caption harus berada di dalam meja (deskTop sampai dasar meja).");
  if (!(DESK_BOTTOM <= z.footerTop)) p.push("dasar meja harus di atas footerTop.");
  if (z.captionTop + z.captionHeight > z.footerTop) p.push("caption tidak boleh menimpa footer.");
  for (const [name, m] of Object.entries(NARRATOR_MODES)) {
    if (m.subtitleTop + SUBTITLE_HEIGHT > z.safeBottom) p.push(`mode narator ${name}: subtitle (sampai ${m.subtitleTop + SUBTITLE_HEIGHT}) melewati safeBottom ${z.safeBottom}.`);
    if (!(m.contentBottom < m.subtitleTop)) p.push(`mode narator ${name}: konten harus berakhir di atas subtitle.`);
    if (m.h > 0 && !(m.subtitleTop + SUBTITLE_HEIGHT <= NARRATOR_FEET_Y - m.h + 60)) p.push(`mode narator ${name}: subtitle menimpa karakter (kepala di sekitar y ${NARRATOR_FEET_Y - m.h}).`);
  }
  if (NARRATOR_FEET_Y > z.safeBottom) p.push(`NARRATOR_FEET_Y ${NARRATOR_FEET_Y} melewati safeBottom ${z.safeBottom}.`);
  return p;
};
