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
  return p;
};
