import type { DraftMeta, DraftScene } from "../DraftKit";

// Dibuat dari draft content_studio (content_studio chatbot-vs-ai-agent-20261029-134735) oleh scripts/from-draft.mjs. Boleh diubah tangan:
// tambah baris dialog, ubah ekspresi atau gerak, dan isi `spoken` bila teks yang diucapkan beda dari subtitle
// (angka dieja, singkatan dibaca utuh). Mengubah teks atau `spoken` membuat baris itu perlu di-generate ulang.

export const META: DraftMeta = {
  "title": "Chatbot vs AI Agent: Pahami Bedanya!",
  "delivery": "dialog",
  "style": "rig"
};

export const BASE_SCENES: readonly DraftScene[] = [
  {
    "id": "scene-01",
    "seconds": 6,
    "backdrop": "ruangKerja",
    "time": "siang",
    "cast": [
      {
        "character": "ganjar",
        "expression": "bingung",
        "motion": "headTurn",
        "position": "kiri"
      },
      {
        "character": "robot",
        "expression": "netral",
        "motion": null,
        "position": "kanan"
      }
    ],
    "onScreenText": "Chatbot vs AI Agent, Apa Bedanya?",
    "lines": [
      {
        "who": "ganjar",
        "from": 0.3,
        "dur": 5.4,
        "text": "Chatbot dan AI agent sering dianggap sama, padahal cara kerjanya berbeda! Yuk, pahami bedanya."
      }
    ],
    "note": "Ganjar berdiri di sisi kiri sambil menoleh bingung ke arah penonton dan Robot di sisi kanan. Di tengah layar muncul judul pembanding bergaya minimalis."
  },
  {
    "id": "scene-02",
    "seconds": 7,
    "backdrop": "ruangKerja",
    "time": "siang",
    "cast": [
      {
        "character": "ganjar",
        "expression": "mikir",
        "motion": null,
        "position": "kiri"
      },
      {
        "character": "robot",
        "expression": "serius",
        "motion": "armGesture",
        "position": "kanan"
      }
    ],
    "onScreenText": "Chatbot: Menjawab Saat Ditanya",
    "lines": [
      {
        "who": "robot",
        "from": 0.3,
        "dur": 6.4,
        "text": "Chatbot umumnya reaktif. Dia cuma nunggu pertanyaan, ngasih jawaban teks, lalu diam sampai ada pesan baru."
      }
    ],
    "note": "Robot menggerakkan lengan menjelaskan konsep. Di atas kepala Robot muncul ilustrasi gelembung chat tanya-jawab sederhana yang pasif."
  },
  {
    "id": "scene-03",
    "seconds": 7,
    "backdrop": "ruangKerja",
    "time": "siang",
    "cast": [
      {
        "character": "ganjar",
        "expression": "senang",
        "motion": null,
        "position": "kiri"
      },
      {
        "character": "robot",
        "expression": "senang",
        "motion": "armGesture",
        "position": "kanan"
      }
    ],
    "onScreenText": "AI Agent: Bertindak Mandiri",
    "lines": [
      {
        "who": "robot",
        "from": 0.3,
        "dur": 6.4,
        "text": "Kalau AI agent, kamu kasih tujuan. Dia bakal merencanakan, ambil keputusan, dan eksekusi tindakan nyata sampai tuntas."
      }
    ],
    "note": "Robot tersenyum sambil menggerakkan lengan dengan antusias. Di samping Robot muncul grafis diagram alur: Goal -> Perceive -> Decide -> Act."
  },
  {
    "id": "scene-04",
    "seconds": 5,
    "backdrop": "ruangKerja",
    "time": "siang",
    "cast": [
      {
        "character": "ganjar",
        "expression": "senyumSantai",
        "motion": "point",
        "position": "kiri"
      },
      {
        "character": "robot",
        "expression": "senang",
        "motion": null,
        "position": "kanan"
      }
    ],
    "onScreenText": "Chatbot Bicara, AI Agent Bertindak",
    "lines": [
      {
        "who": "ganjar",
        "from": 0.3,
        "dur": 4.4,
        "text": "Jadi, chatbot fokus membalas teks, sedangkan AI agent fokus mengambil tindakan mencapai target!"
      }
    ],
    "note": "Ganjar menunjuk mantap ke arah diagram perbandingan yang merangkum perbedaan respon teks versus aksi otonom."
  },
  {
    "id": "scene-05",
    "seconds": 5,
    "backdrop": "ruangKerja",
    "time": "siang",
    "cast": [
      {
        "character": "ganjar",
        "expression": "senang",
        "motion": null,
        "position": "kiri"
      },
      {
        "character": "robot",
        "expression": "senang",
        "motion": "armGesture",
        "position": "kanan"
      }
    ],
    "onScreenText": "Tulis di Kolom Komentar!",
    "lines": [
      {
        "who": "robot",
        "from": 0.3,
        "dur": 4.4,
        "text": "Mau bikin chatbot pintar atau AI agent otomatis? Tulis di komentar!"
      }
    ],
    "note": "Ganjar dan Robot tersenyum ramah menghadap kamera, Robot melambaikan tangan mengajak penonton meramaikan kolom komentar."
  }
];
