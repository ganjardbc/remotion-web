import type { CarouselSpec } from "../../content/types";

// Carousel Format B (opini): "Junior Hilang, Senior Bingung". Judul slide ditulis kalimat biasa; Title Case diterapkan tema.
// Cek aturan: `npm run validate`.
export const CAROUSEL: CarouselSpec = {
  format: "B",
  title: "Junior Hilang, Senior Bingung",
  style: "rig",
  slides: [
    {
      role: "hook",
      title: "AI ambil tugas junior, siapa jadi senior?",
      accent: "siapa jadi senior",
      cast: [{ character: "claudecode", expression: "malu", motion: null, position: "kiri" }],
      paragraphs: [
        "Banyak tim mulai menyerahkan pekerjaan pemula ke AI karena lebih cepat dan murah. Aku justru mulai khawatir soal akibatnya beberapa tahun lagi.",
      ],
    },
    {
      role: "relate",
      title: "Kamu belajar dari bug yang kamu tulis sendiri",
      accent: "bug yang kamu tulis sendiri",
      paragraphs: [
        "Hampir semua senior yang kukenal jadi paham karena pernah salah, lalu begadang mencari sebabnya. Pekerjaan kecil itulah ruang latihannya.",
      ],
      cta: "Kalau kamu ingin tetap berkembang di tengah AI, follow akun ini. Aku akan membahasnya dari sisi karier, bukan sisi alat.",
    },
    {
      role: "detail",
      title: "Pekerjaan pemula adalah anak tangga pertama",
      accent: "anak tangga pertama",
      paragraphs: [
        "Memperbaiki bug kecil, menulis test, dan merapikan kode terasa sepele. Dari situ orang belajar membaca kode orang lain dan merasakan akibat keputusannya.",
        "Kalau anak tangga paling bawah dicabut, jalan naiknya ikut hilang.",
      ],
    },
    {
      role: "detail",
      title: "AI yang selalu benar menghapus jalur belajar",
      accent: "menghapus jalur belajar",
      paragraphs: [
        "Jawaban cepat membuat kita melewati fase bingung, padahal di situlah pemahaman terbentuk. Hasilnya jalan, tetapi kita tidak tahu kenapa.",
        "Saat ada yang rusak, orang yang tidak pernah salah tidak tahu harus mulai dari mana.",
      ],
    },
    {
      role: "shift",
      title: "Senior lahir dari kesalahan yang mahal",
      accent: "kesalahan yang mahal",
      paragraphs: [
        "Skill senior bukan hafalan, melainkan intuisi dari pernah salah lalu memperbaikinya. Kalau AI selalu membereskan di depan, intuisi itu tidak sempat tumbuh.",
        "Ini baru bagian pertama. Intinya begini:",
      ],
      quote: "kecepatan bisa dibeli,\npemahaman harus dijalani",
    },
    {
      role: "detail",
      title: "Pakai AI, tetapi tetap ikut memahami",
      accent: "tetap ikut memahami",
      paragraphs: [
        "Minta AI menjelaskan alasannya, lalu tulis ulang bagian pentingnya dengan tanganmu sendiri. Anggap AI sebagai mentor, bukan pengganti latihan.",
        "Tim yang sehat juga menyisakan tugas kecil agar junior tetap punya tempat belajar.",
      ],
    },
    {
      role: "closing",
      title: "Cepat itu bukan sama dengan paham",
      accent: "bukan sama dengan paham",
      paragraphs: [
        "AI bisa mempercepat hasil, tetapi pemahaman tetap harus dibangun lewat proses. Siapa yang melewatkan prosesnya hari ini akan kesulitan memimpin besok.",
      ],
      cta: "Follow untuk bahasan karier developer",
    },
  ],
  caption: "Kalau AI mengambil pekerjaan junior, jalur menjadi senior ikut menyempit. Pakai AI boleh, asal kamu tetap ikut memahami prosesnya.",
  hashtags: ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"],
};
