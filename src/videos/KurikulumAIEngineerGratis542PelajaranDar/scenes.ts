import type { DraftMeta, DraftScene } from "../DraftKit";

// Dibuat dari draft content_studio (content_studio belajar-jadi-ai-engineer-20261029-191216) oleh scripts/from-draft.mjs. Boleh diubah tangan:
// tambah baris dialog, ubah ekspresi atau gerak, dan isi `spoken` bila teks yang diucapkan beda dari subtitle
// (angka dieja, singkatan dibaca utuh). Mengubah teks atau `spoken` membuat baris itu perlu di-generate ulang.

export const META: DraftMeta = {
  "title": "Kurikulum AI Engineer Gratis: 542 Pelajaran dari Nol",
  "delivery": "narator",
  "style": "rig"
};

export const BASE_SCENES: readonly DraftScene[] = [
  {
    "id": "scene-01",
    "seconds": 9,
    "backdrop": "ruangKerja",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "serius",
        "motion": "armGesture",
        "position": "tengah"
      }
    ],
    "onScreenText": "Mau jadi AI Engineer tapi bingung?",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 8.4,
        "text": "Mau jadi AI Engineer tapi bingung mulai dari mana — dan takut keluar biaya besar? Coba cek repositori GitHub ini dulu.",
        "spoken": "Mau jadi AI Engineer tapi bingung mulai dari mana — dan takut keluar biaya besar? Coba cek repositori GitHub ini dulu."
      }
    ],
    "note": "Claude Code berdiri di tengah layar. Di latar belakang tampak layar monitor dengan banyak tab browser terbuka dan tanda tanya besar melayang di sudut kanan atas sebagai ilustrasi kebingungan. Teks hook muncul di bagian bawah layar."
  },
  {
    "id": "scene-02",
    "seconds": 9,
    "backdrop": "ruangKerja",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "senang",
        "motion": "armGesture",
        "position": "tengah"
      }
    ],
    "onScreenText": "Gratis & Open Source — Lisensi MIT",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 8.4,
        "text": "Ada repositori GitHub bernama 'ai-engineering-from-scratch' — open source, berlisensi MIT, alias gratis sepenuhnya untuk siapa saja.",
        "spoken": "Ada repositori GitHub bernama 'ai-engineering-from-scratch' — open source, berlisensi M-I-T, alias gratis sepenuhnya untuk siapa saja."
      }
    ],
    "note": "Claude Code melakukan armGesture ke arah layar di sisinya. Di layar tampil tampilan halaman GitHub dengan nama repositori 'ai-engineering-from-scratch' dan label 'MIT License' yang disorot. Ikon gembok terbuka dan bintang GitHub muncul sebagai elemen dekoratif."
  },
  {
    "id": "scene-03",
    "seconds": 10,
    "backdrop": "ruangKerja",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "serius",
        "motion": "armGesture",
        "position": "kiri"
      }
    ],
    "onScreenText": "542 Pelajaran · 20 Fase · Multi-bahasa",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 9.4,
        "text": "Kurikulumnya terstruktur banget — ada 542 pelajaran yang dibagi dalam 20 fase, dari konsep dasar hingga implementasi nyata, pakai Python, TypeScript, dan bahasa lainnya.",
        "spoken": "Kurikulumnya terstruktur banget — ada lima ratus empat puluh dua pelajaran yang dibagi dalam dua puluh fase, dari konsep dasar hingga implementasi nyata, pakai Python, TypeScript, dan bahasa lainnya."
      }
    ],
    "note": "Di sisi kanan layar tampil diagram tangga atau progress bar vertikal berlabel 'Fase 1' hingga 'Fase 20' dengan angka 542 di bagian atas. Di bawahnya ada ikon logo Python dan TypeScript berjejer. Claude Code berdiri di kiri melakukan armGesture ke arah diagram tersebut."
  },
  {
    "id": "scene-04",
    "seconds": 10,
    "backdrop": "ruangKerja",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "senang",
        "motion": "armGesture",
        "position": "tengah"
      }
    ],
    "onScreenText": "Kuis 10 Pertanyaan → Mulai dari Fase Mana",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 9.4,
        "text": "Yang paling keren, ada kuis penempatan sepuluh pertanyaan. Isi kuisnya, dan kamu langsung tahu harus mulai belajar dari fase mana sesuai kondisi kamu sekarang.",
        "spoken": "Yang paling keren, ada kuis penempatan sepuluh pertanyaan. Isi kuisnya, dan kamu langsung tahu harus mulai belajar dari fase mana sesuai kondisi kamu sekarang."
      }
    ],
    "note": "Di layar muncul ilustrasi formulir kuis dengan sepuluh kotak pertanyaan, lalu panah menuju kartu bertulis 'Mulai dari Fase Ini'. Efek sorot atau highlight pada kartu untuk menekankan fitur penempatan ini."
  },
  {
    "id": "scene-05",
    "seconds": 8,
    "backdrop": "ruangKerja",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "netral",
        "motion": "armGesture",
        "position": "kiri"
      }
    ],
    "onScreenText": "3 Cara Belajar: Website · AI Tutor · Lokal",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 7.4,
        "text": "Cara belajarnya fleksibel — lewat website tanpa setup apapun, pakai AI tutor interaktif, atau unduh repositorinya ke komputer kamu. Pilih yang paling nyaman.",
        "spoken": "Cara belajarnya fleksibel — lewat website tanpa setup apapun, pakai A-I tutor interaktif, atau unduh repositorinya ke komputer kamu. Pilih yang paling nyaman."
      }
    ],
    "note": "Di sisi kanan tampil tiga ikon berjejer vertikal: ikon globe untuk website, ikon robot kecil untuk AI tutor, dan ikon terminal/komputer untuk lokal. Masing-masing ikon diberi label singkat. Claude Code melakukan armGesture ke arah daftar tersebut."
  },
  {
    "id": "scene-06",
    "seconds": 8,
    "backdrop": "ruangKerja",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "senang",
        "motion": "armGesture",
        "position": "tengah"
      }
    ],
    "onScreenText": "3 Proyek Nyata — Bukan Sekadar Teori",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 7.4,
        "text": "Ada tiga proyek praktik nyata yang bisa langsung dicoba — Retrieval Evaluation Lab, Agent Trace Debugger, dan Tool Call Firewall. Belajar tidak cuma teori.",
        "spoken": "Ada tiga proyek praktik nyata yang bisa langsung dicoba — Retrieval Evaluation Lab, Agent Trace Debugger, dan Tool Call Firewall. Belajar tidak cuma teori."
      }
    ],
    "note": "Di layar tampil tiga kartu proyek berjejer: 'Retrieval Evaluation Lab', 'Agent Trace Debugger', dan 'Tool Call Firewall'. Setiap kartu punya ikon kecil yang relevan. Kartu muncul satu per satu dengan animasi slide-in."
  },
  {
    "id": "scene-07",
    "seconds": 6,
    "backdrop": "kosong",
    "time": "malam",
    "cast": [
      {
        "character": "claudecode",
        "expression": "senang",
        "motion": "armGesture",
        "position": "tengah"
      }
    ],
    "onScreenText": "Cari di GitHub → Mulai Kuis Sekarang!",
    "lines": [
      {
        "who": "claudecode",
        "from": 0.3,
        "dur": 5.4,
        "text": "Cari 'ai-engineering-from-scratch' di GitHub sekarang, dan mulai dari kuis penempatan sepuluh pertanyaan!",
        "spoken": "Cari 'ai-engineering-from-scratch' di GitHub sekarang, dan mulai dari kuis penempatan sepuluh pertanyaan!"
      }
    ],
    "note": "Latar bersih untuk segmen CTA agar terasa segar dan berbeda dari scene sebelumnya. Teks besar di tengah atas: 'ai-engineering-from-scratch'. Di bawahnya ikon GitHub dan panah menuju teks 'Mulai Kuis Sekarang'. Claude Code melakukan armGesture mengajak penonton bertindak."
  }
];
