# remotion-web

Generator konten animasi (Reels/TikTok 9:16 dan carousel 4:5) untuk personal branding **@ganjar_hadiatna**, dibangun dengan Remotion. Hanya untuk akun personal branding. Jangan dicampur dengan `edumotion-web` (akun edukasi terpisah, tanpa handle atau link @ganjar_hadiatna).

Ringkasan konteks untuk agent lain ada di [AGENTS.md](AGENTS.md).

Aturan konten di bawah adalah salinan kerja dari Claude Project "personal branding" (ghostwriter). Kalau aturan di project itu berubah, perbarui file ini.

## Keputusan yang sudah diambil
- Integrasi content_studio (CrewAI) ke repo ini **dihapus**. Tidak ada lagi alur `draft.json` atau `from-draft.mjs`. Data video/carousel ditulis langsung di repo.
- **Carousel dipegang remotion-web saja** (bukan `gh-content-pipeline` atau Canva).
- Narator Reels tetap karakter Claude Code (rig 2D). Jangan diubah tanpa diminta. Reels dialog (dua karakter atau lebih bergantian bicara, `new-reels.mjs --dialog`) hanya untuk konten yang memang berupa percakapan, atas permintaan.
- Gambar di carousel **opsional** dan posisinya bebas (atas, samping blok stat, bawah). Cover tidak lagi wajib memuat gambar.
- Judul **Title Case** (`headlineTransform: "capitalize"` di tema), berlaku untuk Reels dan carousel agar gayanya sama. Bukan huruf kapital semua.
- Acuan tampilan carousel: sample "Model Murah Bisa Menjebak" (`src/videos/ModelMurah`).
- Warna ungu mengikuti design system: `--color-accent-2` = `#AF67DE` (bukan `#BA69E1`).

## Brand dan visual
- Sumber kebenaran: `design-system/gh-design-system` (baca `readme.md` dan `SKILL.md` di sana). Tema kode: `src/themes/gh.ts`. Semua warna dan huruf diambil dari tema, jangan hardcode.
- Font Poppins saja. Biru `#3051B8` = primary. Oranye `#FF914D` = highlight, satu frasa atau satu kontrol per layar.
- Carousel: slide hook dan shift berlatar biru primary `#3051B8` (teks putih), sisanya putih; bisa diubah per slide lewat `tone`. Ungu aksen-2 (`#AF67DE`) tidak dipakai di carousel (kontras rendah di atas biru, 3,6:1 di atas putih).
- Gerak: ease-out tajam `[0.2, 0.8, 0.2, 1]`. Tanpa bounce atau spring.
- **Wajib di setiap video:** `BrandFooter` (logo kiri; TikTok, Instagram, `@ganjar_hadiatna` kanan) dirender sekali di root video, di luar transisi scene, selama durasi penuh. CTA penutup tetap berada di isi scene terakhir, terpisah dari footer.
- Karakter: Ganjar, Robot, Claude Code (`src/assets/characters`, baca `README.md` di sana). Tampilan Ganjar sudah final, jangan diubah tanpa persetujuan. Impor selalu dari barrel `src/assets/characters`.

## Aturan penulisan (semua format)
- Bahasa Indonesia natural, seperti orang berbagi pemikiran, bukan nada AI. "Aku-kamu" konsisten. Dilarang "gue/lo".
- Paragraf pendek, 1-2 kalimat. Insight di atas informasi, cara berpikir di atas tutorial (kecuali Format C).
- Judul 4-8 kata, pendek, memancing penasaran, tidak terdengar seperti tutorial (kecuali Format C, judul boleh menyebut hasil).
- Setiap konten membawa **caption pendek** dan **tepat 5 hashtag**. Set yang konsisten: `#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`.
- Tentukan dulu jenis konten. Opini/perspektif = Format A (Reels) atau B (Carousel). Tutorial teknis = Format C. Kalau ambigu, tanya dulu.

## Format A: Reels (30-60 detik)
Alur wajib: Hook, Relate, Shift, Closing, CTA.
- **Hook**: 1 kalimat, memicu konflik atau penasaran, harus menahan scroll dalam 1-3 detik. Hook yang aman atau umum tidak dipakai.
- **Relate**: masalah yang dialami audiens (developer/pengguna AI), supaya terasa "ini aku banget".
- **Shift**: sudut pandang tidak umum yang membongkar asumsi. Setelah insight tajam pertama, **wajib** ada 1 kalimat urgency follow ("ini baru bagian pertama...").
- **Closing**: kesimpulan tajam, ada kalimat yang layak jadi quote.
- **CTA**: ajakan follow dengan alasan spesifik ke isi konten, bukan "follow untuk tips lainnya".
- **Irama**: tidak ada dead time, hal baru di layar tiap ~4 dtk; scene bersuara lebih dari 8 dtk dipecah jadi beat. Pedoman (bukan aturan keras), rincian di bagian "Irama scene" di [docs/struktur-video.md](docs/struktur-video.md); `npm run validate:structure` memberi peringatan.
- **Variasi visual**: tiap scene punya hero visual dan tata letak berbeda dari scene di sebelahnya (angka, bar, terminal, diagram, stempel, dua kolom, dan seterusnya), bukan templat kartu yang sama berulang. Latar (`ground`, `dark`, `primary`) dan posisi karakter juga berganti antar scene. Rincian di bagian "Variasi visual antar scene" di [docs/struktur-video.md](docs/struktur-video.md); berlaku untuk Format A dan C.
- **Layout dan komponen**: posisi vertikal Reels dari `src/reelsLayout.ts` (jangan menulis angka y sendiri); dunia meja (meja, monitor, keyboard, rak, caption karaoke) ada di `src/desk-world/`. Daftar periksa sebelum render di [docs/struktur-video.md](docs/struktur-video.md), bagian "Daftar periksa Reels sebelum render".
- Referensi implementasi, alur, dan durasi: `src/videos/PromptPanjang` (hook 5 dtk, relate 7, shift 9, urgency 5, cara 9, closing 4, CTA 5). Struktur file lihat Struktur file video di bawah.

## Struktur file video
Wajib dibaca sebelum membuat atau mengubah folder `src/videos/<Nama>/`:

@docs/struktur-video.md

## Reels dialog (aturan dari JagoDikit)
Mekanisme (field, nama opsi, format papan) ada di [docs/struktur-video.md](docs/struktur-video.md). Di bawah ini keputusan tampilan dan cara kerja yang berlaku untuk video dialog baru. Rujukan: `src/videos/JagoDikit`.
- **Subtitle**: bawaan `META.subtitle: "caption"` (satu baris rata tengah, sorotan kata, penanda pembicara). Gaya `"chat"` (bubble dengan avatar dan riwayat) tetap dipertahankan untuk konten yang memang berupa percakapan; pilih per video.
- **Cutaway fullscreen** tetap tersedia di mesin, tapi pakai seperlunya: layar penuh yang menutup karakter dihindari. Info singkat dipindah ke kartu teks atas (`screenExtra`, `@logError`, `@kodePrompt`) atau ke papan tulis (latar `kelas`).
- **Kartu teks atas** rata tengah dan tegak, lebar mengikuti isi. Tanpa miring, tanpa rata kiri atau kanan, kecuali diminta.
- **Satu sorotan oranye per layar.** Titik jatuh pakai merah, centang hijau, tanda tanya oranye gelap. Tidak menampilkan teks yang sama dua kali di dua tempat tanpa alasan.
- **Latar bervariasi antar scene** (siang, sore, malam, ruang kerja, kelas), jangan satu latar sepanjang video.
- **Gerak**: tanpa zoom kamera dan tanpa transisi antar scene (potong langsung), kecuali diminta. Ease-out `[0.2, 0.8, 0.2, 1]`, tanpa bounce, spring, atau shake. Whoosh antar scene menyala. Lengan rig pendek, jadi menunjuk memakai tongkat penunjuk (`tunjuk`).
- **Durasi tidak dibatasi 60 detik.** Batas 30-60 detik hanya untuk Reels Format A narator. Video dialog boleh jauh lebih panjang (menit); validator tidak memberi peringatan durasi untuk Reels dialog.
- **Voiceover dialog**: `eleven_v4` dengan tag emosi per baris dan tanpa `speed` (`eleven_v4` mengabaikannya). Klip yang terlalu cepat diperlambat dengan ffmpeg `atempo`, bukan generate ulang. Setelah voiceover jadi, ukur ulang waktu baris, kata (`wordTimes`), cutaway, dan sfx dari audio asli (`silencedetect`). Generate selalu minta konfirmasi jumlah huruf dan kredit.
- **Cara kerja**: usulkan daftar ide dulu dan tunggu dipilih sebelum mengubah visual yang berdampak luas. Fitur mesin baru dibuat sebagai opsi per video (bawaan mati) dan wajib didokumentasikan di `docs/struktur-video.md`. Commit dipecah per scope: mesin (`src/dialog-reels`, validator, docs) dulu, lalu isi video.

## Format B: Carousel (Instagram/LinkedIn, 1080x1350)
- 5-8 slide (boleh 9-10 untuk topik kaya). **Setiap slide wajib punya judul**, termasuk hook dan closing.
- Slide hook: 1-2 kalimat. Slide isi: 1-4 kalimat, 1-3 paragraf.
- Struktur: Hook, Relate + **CTA follow di slide 2 atau 3**, Shift (inti), pendalaman opsional, Closing (quotable, boleh CTA ulang).
- Code atau command ditulis dalam code block.

## Format C: Tutorial teknis (Reels dan Carousel)
- Tentukan sub-varian: **Quick Tips** (carousel 4-6 slide, Reels 20-30 dtk) atau **Full Walkthrough** (carousel 8-12 slide, Reels 45-60 dtk). Kalau tidak disebut, tanya.
- Hook 1 kalimat, boleh berupa hasil/output. Alur: Hook, konteks singkat, langkah teknis, hasil/closing, CTA. Tidak wajib Relate/Shift.
- Code/command wajib dalam code block, akurat, dan **diverifikasi lewat referensi resmi**, bukan dari ingatan.
- Maksimal 10-12 baris code per slide (lebih dari itu pecah, 1 langkah = 1 slide). Teks di luar code maksimal 4 kalimat per slide.
- Boleh bullet/numbered list untuk langkah. CTA soal value teknis ("follow kalau mau lanjutan setup-nya"), di slide 2-3 untuk carousel.

## Carousel
Aturan lengkap carousel (isi, field berkas konten, ukuran huruf, warna, komponen, keterbacaan, validator, render) ada di **[docs/carousel.md](docs/carousel.md)**. Baca itu sebelum membuat atau mengubah carousel. Ringkasnya:
- Satu carousel = `src/videos/<Nama>/carousel.content.ts` yang mengekspor `CAROUSEL: CarouselSpec`, dirender `src/carousel/CarouselDeck.tsx`. Rujukan: `src/videos/ModelMurah`.
- Ukuran dan tata letak dikunci dari sample "Model Murah Bisa Menjebak"; jangan diubah tanpa sample baru.
- Judul Title Case, sorotan teks oranye satu frasa, isi rata kiri, gambar opsional dengan alt wajib, karakter sebagai stiker.
- `npm run validate` harus bebas ERROR. `npm run alt` untuk alt text, caption, dan hashtag.

## Aturan visual umum (Reels dan carousel)
- Kontras teks biasa >= 4,5:1, teks besar dan ikon >= 3:1. Pengecualian yang disengaja: sorotan judul teks oranye `#FF914D` (3,1:1 di biru, 2,2:1 di putih); jangan pakai oranye untuk teks isi.
- Judul Title Case, tanpa huruf kapital semua, italic, atau garis bawah. Paragraf rata kiri.

## Cara kerja
- Arah dulu, eksekusi kemudian: setujui judul, struktur, dan arah sebelum membuat konten penuh.
- Hasil harus lengkap dan siap pakai, bukan draft setengah jadi.
- Pengaturan satu kali (struktur referensi, penyesuaian format) hanya berlaku untuk konten itu, tidak mengubah aturan baku.

## Perintah
- `npm run dev`: Remotion Studio. `npm run lint`: eslint + tsc + validate + validate:structure. `npm run validate`: cek aturan konten carousel. `npm run validate:structure`: cek nama dan isi folder video terhadap `docs/struktur-video.md`. `npm run validate:layout`: cek peta zona layout Reels (`src/reelsLayout.ts`). `node scripts/vo-check.mjs --video <Nama>`: cek tempo, kenyaringan, nada voiceover tanpa API.
- Render Reels: `npx remotion render src/index.ts <Id> out/<Nama>.mp4`. Carousel: `--sequence --image-format=png`.
- `node scripts/new-reels.mjs <NamaPascalCase> "<Judul>" [--scenes a,b,c]`: scaffold Reels baru (narator Claude Code, default scene Format A; komposisi terdaftar otomatis). Tambah `--dialog [--cast ganjar,robot] [--style rig|stickman]` untuk Reels dialog.
- `node scripts/new-carousel.mjs <NamaPascalCase> "<Judul>" [--format B|C] [--variant quick-tips|walkthrough]`: scaffold carousel baru (kerangka slide berisi TODO) (komposisi terdaftar otomatis).
- `node scripts/new-video.mjs <NamaPascalCase> "<Judul>"`: scaffold video dialog berpola VueTutorial.
- Voice over (ElevenLabs): `node scripts/vo-generate.mjs --video <Nama>` (meminta konfirmasi sebelum memanggil API).
- Komposisi terdaftar otomatis dari `export const COMPOSITION` di `<Nama>Video.tsx` atau `<Nama>Carousel.tsx` (`src/compositions.ts`); `src/Root.tsx` tidak perlu diubah.

## Belum dikerjakan
- Tampilan carousel belum pernah dirender di sandbox Claude (tanpa Chrome); ukuran sudah dicocokkan dengan sample dan muat menurut metrik Poppins. Cek dengan `remotion still`.
- Lengan stiker ClaudeCode di sample tampak lebih pendek (±1,5 unit) daripada rig (3 unit); rig tidak diubah.
- Format A (Reels): struktur folder sudah dicek `npm run validate:structure` (termasuk 5 hashtag), tapi isi konten (panjang hook, urgency, dan seterusnya) belum ada validator. Tema Title Case sudah berlaku untuk Reels yang memakai `headlineTransform`; render ulang untuk melihat dampaknya.
