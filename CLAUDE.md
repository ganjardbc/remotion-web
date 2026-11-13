# remotion-web

Generator konten animasi (Reels/TikTok 9:16 dan carousel 4:5) untuk personal branding **@ganjar_hadiatna**, dibangun dengan Remotion. Hanya untuk akun personal branding. Jangan dicampur dengan `edumotion-web` (akun edukasi terpisah, tanpa handle atau link @ganjar_hadiatna).

Ringkasan untuk agent lain: [AGENTS.md](AGENTS.md). Aturan konten di bawah adalah salinan kerja dari Claude Project "personal branding" (ghostwriter); kalau aturan di sana berubah, perbarui file ini.

## Baca sebelum mengerjakan
Berkas ini tidak dimuat otomatis. Baca sesuai tugas:
- Reels (folder `src/videos/<Nama>/`, nama dan isi file, voiceover, alur kerja, storyboard, daftar periksa): [docs/struktur-video.md](docs/struktur-video.md)
- Reels dialog atau video dialog: [docs/dialog-reels.md](docs/dialog-reels.md)
- Reels block (dialog karakter block di dunia diorama, tanpa footer): [docs/block-reels.md](docs/block-reels.md)
- Carousel (isi, field, ukuran, warna, validator, render): [docs/carousel.md](docs/carousel.md)

## Keputusan yang sudah diambil
- Integrasi content_studio (CrewAI) **dihapus**. Tidak ada alur `draft.json` atau `from-draft.mjs`. Data video/carousel ditulis langsung di repo.
- **Carousel dipegang remotion-web saja** (bukan `gh-content-pipeline` atau Canva).
- Narator Reels tetap karakter Claude Code (rig 2D), jangan diubah tanpa diminta. Reels dialog hanya untuk konten yang memang berupa percakapan, atas permintaan.
- Gambar carousel **opsional**, posisi bebas. Cover tidak wajib memuat gambar.
- Judul **Title Case** (`headlineTransform: "capitalize"` di tema), untuk Reels dan carousel. Bukan huruf kapital semua.
- Acuan carousel: sample "Model Murah Bisa Menjebak" (`src/videos/ModelMurah`).
- Ungu mengikuti design system: `--color-accent-2` = `#AF67DE` (bukan `#BA69E1`).

## Brand dan visual
- Sumber kebenaran: `design-system/gh-design-system` (`readme.md`, `SKILL.md`). Tema kode: `src/themes/gh.ts`. Warna dan huruf dari tema, jangan hardcode.
- Poppins saja. Biru `#3051B8` = primary. Oranye `#FF914D` = highlight, satu frasa atau satu kontrol per layar.
- Carousel: slide hook dan shift berlatar biru primary (teks putih), sisanya putih; bisa diubah per slide lewat `tone`. Ungu aksen-2 tidak dipakai di carousel (kontras 3,6:1 di putih, rendah di biru).
- Gerak: ease-out tajam `[0.2, 0.8, 0.2, 1]`, tanpa bounce atau spring.
- **Wajib di setiap video** (kecuali Reels block, yang sengaja tanpa footer dan tanpa watermark, lihat docs/block-reels.md): `BrandFooter` (logo kiri; TikTok, Instagram, `@ganjar_hadiatna` kanan) dirender sekali di root video, di luar transisi scene, selama durasi penuh. CTA penutup tetap di isi scene terakhir, terpisah dari footer.
- Karakter: Ganjar, Robot, Claude Code (`src/assets/characters`, baca `README.md` di sana). Tampilan Ganjar final, jangan diubah tanpa persetujuan. Impor dari barrel `src/assets/characters`.
- Kontras teks biasa >= 4,5:1, teks besar dan ikon >= 3:1. Pengecualian: sorotan judul oranye (3,1:1 di biru, 2,2:1 di putih); jangan pakai oranye untuk teks isi. Judul tanpa huruf kapital semua, italic, atau garis bawah. Paragraf rata kiri.

## Aturan penulisan (semua format)
- Bahasa Indonesia natural, seperti orang berbagi pemikiran, bukan nada AI. "Aku-kamu" konsisten. Dilarang "gue/lo".
- Naskah Reels dibaca keras sebagai satu aliran. Jangan menumpuk kalimat fragmen yang masing-masing berdiri sendiri; sambung dengan penghubung agar suara terdengar utuh, bukan terpotong-potong. Bacakan keras sebelum disetujui. Konten yang bersumber dari artikel atau dokumen pihak lain menyebut sumbernya di hook dan di caption (contoh: "Anthropic menjelaskan ..."); closing yang mengambil inti kalimat sumber ditulis sebagai parafrasa, bukan kutipan.
- Paragraf pendek, 1-2 kalimat. Insight di atas informasi, cara berpikir di atas tutorial (kecuali Format C).
- Judul 4-8 kata, pendek, memancing penasaran, tidak terdengar seperti tutorial (kecuali Format C, judul boleh menyebut hasil).
- Setiap konten membawa **caption pendek** dan **tepat 5 hashtag**: `#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`.
- Tentukan dulu jenis konten. Opini/perspektif = Format A (Reels) atau B (Carousel). Tutorial teknis = Format C. Kalau ambigu, tanya dulu.

## Format A: Reels (30-60 detik)
Alur wajib: Hook, Relate, Shift, Closing, CTA.
- **Hook**: 1 kalimat, memicu konflik atau penasaran, menahan scroll dalam 1-3 detik. Hook aman atau umum tidak dipakai.
- **Relate**: masalah audiens (developer/pengguna AI), supaya terasa "ini aku banget".
- **Shift**: sudut pandang tidak umum yang membongkar asumsi. Setelah insight tajam pertama, **wajib** 1 kalimat urgency follow. Urgency harus **dibayar di video yang sama** (scene sesudahnya menjawab), jangan menjanjikan konten lanjutan yang belum ada. Tulis sebagai **satu kalimat utuh yang mengalir** (satu pikiran, ada penghubung seperti "tapi", "yang", "dan"), bukan dua fragmen pendek yang terdengar terpotong. Contoh baik: "Tapi loop saja belum cukup. Yang bikin loop ini benar-benar jalan adalah apa yang ditulis di tiap file, dan itu yang paling sering dilewatkan." Hindari: "Ini baru bagian pertama. Bagian kedua soal X."
- **Closing**: kesimpulan tajam, ada kalimat yang layak jadi quote.
- **CTA**: ajakan follow dengan alasan spesifik ke isi konten, bukan "follow untuk tips lainnya".
- **Subtitle wajib terbaca di Instagram dan TikTok** (banyak penonton tanpa suara): jangan di bagian bawah layar atau sisi kanan yang tertutup UI platform. Reels baru memakai tata letak narator aman platform (subtitle dua baris di atas karakter, karakter `normal`/`small`/`hidden` sesuai banyaknya konten): lihat docs/struktur-video.md. Video lama yang sudah diposting tidak diubah.
- Irama, variasi visual antar scene, layout (`src/reelsLayout.ts`, `src/desk-world/`), dan daftar periksa: lihat docs/struktur-video.md. Pedoman, `npm run validate:structure` memberi peringatan.
- Referensi implementasi dan durasi: `src/videos/PromptPanjang` (hook 5 dtk, relate 7, shift 9, urgency 5, cara 9, closing 4, CTA 5). Urgency di PromptPanjang ditulis dua kalimat pendek; untuk konten baru pakai satu kalimat mengalir seperti aturan Urgency di atas.

## Format B: Carousel (Instagram/LinkedIn, 1080x1350)
- 5-8 slide (boleh 9-10 untuk topik kaya). **Setiap slide wajib punya judul**, termasuk hook dan closing.
- Slide hook: 1-2 kalimat. Slide isi: 1-4 kalimat, 1-3 paragraf.
- Struktur: Hook, Relate + **CTA follow di slide 2 atau 3**, Shift (inti), pendalaman opsional, Closing (quotable, boleh CTA ulang).
- Code atau command dalam code block.

## Format C: Tutorial teknis (Reels dan Carousel)
- Sub-varian: **Quick Tips** (carousel 4-6 slide, Reels 20-30 dtk) atau **Full Walkthrough** (carousel 8-12 slide, Reels 45-60 dtk). Tidak disebut → tanya.
- Hook 1 kalimat, boleh berupa hasil/output. Alur: Hook, konteks singkat, langkah teknis, hasil/closing, CTA. Relate/Shift tidak wajib.
- Code/command dalam code block, akurat, **diverifikasi lewat referensi resmi**, bukan ingatan.
- Maks 10-12 baris code per slide (lebih → pecah, 1 langkah = 1 slide). Teks di luar code maks 4 kalimat per slide.
- Boleh bullet/numbered list untuk langkah. CTA soal value teknis ("follow kalau mau lanjutan setup-nya"), di slide 2-3 untuk carousel.

## Cara kerja
- Arah dulu, eksekusi kemudian: setujui judul, struktur, dan arah sebelum membuat konten penuh.
- Reels: setelah naskah, buat **storyboard** (tabel per scene: kalimat kunci, hero visual, latar, pose, ekspresi, sorotan oranye) dan tunggu disetujui sebelum menulis `scenes.tsx`. Voiceover berbayar dibuat sesudah `reels-stills` memastikan urutan dan tata letak. Alur lengkap: "Alur kerja Reels" di docs/struktur-video.md.
- Hasil lengkap dan siap pakai, bukan draft setengah jadi.
- Pengaturan satu kali (struktur referensi, penyesuaian format) hanya berlaku untuk konten itu, tidak mengubah aturan baku.

## Perintah
- `npm run dev` (Studio), `npm run lint` (eslint + tsc + validate + validate:structure), `npm run validate` (carousel), `npm run validate:structure`, `npm run validate:layout`, `npm run alt` (alt text, caption, hashtag carousel).
- Scaffold (jangan buat folder dengan tangan; komposisi terdaftar otomatis): `node scripts/new-reels.mjs <Nama> "<Judul>" [--scenes a,b,c] [--dialog [--cast ganjar,robot] [--style rig|stickman]]`, `node scripts/new-carousel.mjs <Nama> "<Judul>" [--format B|C] [--variant quick-tips|walkthrough]`, `node scripts/new-video.mjs <Nama> "<Judul>"` (video dialog), `node scripts/new-block.mjs <Nama> "<Judul>" [--cast ...] [--sets ...]` (Reels block).
- Voiceover (ElevenLabs, model bawaan `eleven_v4` dengan tag emosi lewat `VO_TEXT`; minta konfirmasi sebelum memakai kredit): `vo-generate.mjs`, `vo-words.mjs`; tanpa API: `vo-check.mjs`, `reels-stills.mjs`. Semua `--video <Nama>`. Rincian di docs/struktur-video.md, bagian Voiceover.
- Render Reels: `npx remotion render src/index.ts <Id> out/<Nama>.mp4`. Carousel: tambah `--sequence --image-format=png`.

## Belum dikerjakan
- Tampilan carousel belum pernah dirender di sandbox Claude (tanpa Chrome); cek dengan `remotion still`.
- Lengan stiker ClaudeCode di sample ±1,5 unit lebih pendek daripada rig (3 unit); rig tidak diubah.
- Isi konten Reels (panjang hook, urgency, dan seterusnya) belum ada validator; struktur folder sudah dicek `validate:structure`.
