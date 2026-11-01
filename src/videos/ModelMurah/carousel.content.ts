import type { CarouselSpec } from "../../content/types";

// Contoh carousel Format B yang memakai semua elemen baru (stat, quote, cta di slide 2, closing dengan logo), disusun
// dari sample "Model Murah Bisa Menjebak". Screenshot terminal di slide 3-5 belum dipasang; bila ada, tambahkan
// `image: { src: "carousel/model-murah/haiku.png", alt: "...", position: "samping" }` (berkas di public/, alt wajib).
// Cek aturan: `npm run validate`. Judul ditulis kalimat biasa; Title Case diterapkan tema.
export const CAROUSEL: CarouselSpec = {
  format: "B",
  title: "Model Murah Bisa Menjebak",
  style: "rig",
  slides: [
    {
      role: "hook",
      title: "Satu prompt, tiga model, hasil berbeda",
      accent: "hasil berbeda",
      cast: [{ character: "claudecode", expression: "malu", motion: null, position: "kiri" }],
      paragraphs: [
        "Aku menjalankan prompt analisis yang sama pada Haiku 5.5, Sonnet 5.5, dan Opus 5.5 untuk satu fitur di proyek POS yang sedang kukerjakan. Hasilnya membuatku berpikir ulang soal cara memilih model.",
      ],
    },
    {
      role: "relate",
      title: "Kita sering menilai model dari harganya",
      accent: "harganya",
      paragraphs: ["Harga per token mudah dibandingkan, jadi kita sering berhenti di situ. Padahal yang sebenarnya kita butuhkan adalah temuan yang bisa dipercaya."],
      cta: "Kalau kamu ingin melihat perbedaan ketiga model ini dalam pekerjaan nyata, follow akun ini. Aku akan membagikan datanya apa adanya.",
    },
    {
      role: "detail",
      title: "Haiku cepat, tetapi cakupannya sempit",
      accent: "cakupannya sempit",
      stat: { label: "Temuan 1 · Haiku 5.5", value: "$0,03", note: "per turn · ±1 menit 19 detik" },
      paragraphs: [
        "Haiku selesai dalam sekitar 1 menit 19 detik dengan biaya sekitar $0,03 per turn. Laporannya berfokus pada celah test, tetapi Haiku tidak menjalankan test maupun memeriksa spec.",
        "Untuk tugas ringan, hasil ini sudah cukup. Masalahnya, laporan yang tampak lengkap bisa membuat kita berhenti mencari.",
      ],
    },
    {
      role: "detail",
      title: "Sonnet menyebutkan asal setiap temuan",
      accent: "asal setiap temuan",
      stat: { label: "Temuan 2 · Sonnet 5.5", value: "$0,39", note: "per turn" },
      paragraphs: [
        "Sonnet menandai temuan mana yang dibaca langsung dari kode dan mana yang disimpulkan dari DTO atau service. Ia juga menyebutkan bagian yang belum ditelusuri.",
        "Dengan biaya sekitar $0,39 per turn, Sonnet memberi sesuatu yang sering hilang dari laporan AI, yaitu gambaran seberapa jauh laporan itu bisa dipercaya.",
      ],
    },
    {
      role: "detail",
      title: "Opus menemukan bug nyata, dengan biaya tinggi",
      accent: "bug nyata",
      stat: { label: "Temuan 3 · Opus 5.5", value: "$0,92", note: "per turn · ±30× Haiku" },
      paragraphs: [
        "Opus menemukan dua masalah yang berpotensi berdampak ke produksi, lalu menawarkan perbaikan dan menunggu persetujuanku. Biayanya sekitar $0,92 per turn, kira-kira 30 kali lipat Haiku.",
        "Dari sini aku sadar bahwa selisih harga hanya layak jika temuan yang lebih dalam benar-benar terbukti.",
      ],
    },
    {
      role: "shift",
      title: "Risiko kesalahan lebih mahal daripada token",
      accent: "lebih mahal",
      paragraphs: [
        "Satu temuan keliru yang lolos ke produksi bisa jauh lebih mahal daripada selisih $0,89 per turn. Karena itu, pilih model berdasarkan seberapa besar risiko kesalahannya, bukan seberapa canggih namanya.",
        "Pertanyaan yang lebih berguna adalah:",
      ],
      quote: "jika model ini keliru,\nseberapa parah akibatnya?",
    },
    {
      role: "closing",
      title: "Model terbaik adalah yang bisa kamu periksa",
      accent: "bisa kamu periksa",
      paragraphs: ["Model yang hebat tetap membutuhkan orang yang memeriksa hasilnya. Mahal atau murah, tanggung jawab akhir tetap ada di tangan kita."],
      cta: "Follow untuk data uji berikutnya",
    },
  ],
  caption: "Murah belum tentu hemat. Aku menguji Haiku, Sonnet, dan Opus dengan prompt yang sama, dan selisihnya ada di seberapa jauh temuannya bisa dipercaya.",
  hashtags: ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"],
};
