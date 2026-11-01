import type { CarouselSpec } from "../../content/types";

// Contoh carousel Format B, disusun dari naskah Reels "Agen Bodoh Itu Salah Siapa?" (config.ts). Cek: `npm run validate`.
export const CAROUSEL: CarouselSpec = {
  format: "B",
  title: "Agen Bodoh Itu Salah Siapa?",
  style: "rig",
  slides: [
    {
      role: "hook",
      title: "Agen coding-mu tidak bodoh.",
      accent: "tidak bodoh.",
      paragraphs: ["Dia hanya diberi ruang kerja tanpa aturan."],
      cast: [{ character: "ganjar", expression: "serius", motion: null, position: "tengah" }],
    },
    {
      role: "relate",
      title: "Hasilnya tidak konsisten",
      paragraphs: ["Hari ini brilian. Besok berantakan di proyek yang sama.", "Lalu kamu bertanya: ganti model saja?"],
      cta: "Ikuti kalau kamu mau tahu dua layer sisanya, karena itu yang membuat hasilnya stabil.",
    },
    {
      role: "shift",
      title: "Sering kali instruksinya yang kurang",
      accent: "instruksinya",
      paragraphs: ["File instruksi seperti AGENTS.md atau CLAUDE.md itu seperti kontrak.", "Isinya struktur proyek, gaya kode, dan hal yang dilarang."],
    },
    {
      role: "detail",
      title: "Ini hanya satu dari tiga layer",
      accent: "satu",
      paragraphs: ["Dua layer sisanya yang membuat hasilnya stabil."],
    },
    {
      role: "closing",
      title: "Model pintar tanpa harness sama seperti developer senior tanpa brief.",
      accent: "tanpa brief.",
      paragraphs: ["Komentar HARNESS kalau kamu mau panduan lengkapnya."],
      cta: "Ikuti supaya tidak ketinggalan dua layer sisanya.",
    },
  ],
  caption: "Agen coding-mu tidak bodoh. Dia hanya belum punya kontrak kerja yang jelas. Komentar HARNESS kalau kamu mau panduan lengkapnya.",
  hashtags: ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"],
};
