# remotion-web

Generator konten animasi (Reels/TikTok 9:16 dan carousel 4:5) untuk personal branding **@ganjar_hadiatna**, dibangun dengan Remotion. Hanya untuk akun personal branding. Jangan dicampur dengan `edumotion-web` (akun edukasi terpisah, tanpa handle atau link @ganjar_hadiatna).

Ringkasan konteks untuk agent lain ada di [AGENTS.md](AGENTS.md).

Aturan konten di bawah adalah salinan kerja dari Claude Project "personal branding" (ghostwriter). Kalau aturan di project itu berubah, perbarui file ini.

## Keputusan yang sudah diambil
- Integrasi content_studio (CrewAI) ke repo ini **dihapus**. Tidak ada lagi alur `draft.json` atau `from-draft.mjs`. Data video/carousel ditulis langsung di repo.
- **Carousel dipegang remotion-web saja** (bukan `gh-content-pipeline` atau Canva).
- Narator tetap seperti sekarang: karakter Claude Code (rig 2D) dipakai sebagai narator. Jangan diubah tanpa diminta.
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
- Referensi implementasi, alur, dan durasi: `src/videos/PromptPanjang` (hook 5 dtk, relate 7, shift 9, urgency 5, cara 9, closing 4, CTA 5). Struktur file lihat Struktur file video di bawah.

## Struktur file video
Wajib dibaca sebelum membuat atau mengubah folder `src/videos/<Nama>/`:

@docs/struktur-video.md

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
- `npm run dev`: Remotion Studio. `npm run lint`: eslint + tsc + validate + validate:structure. `npm run validate`: cek aturan konten carousel. `npm run validate:structure`: cek nama dan isi folder video terhadap `docs/struktur-video.md`.
- Render Reels: `npx remotion render src/index.ts <Id> out/<Nama>.mp4`. Carousel: `--sequence --image-format=png`.
- `node scripts/new-reels.mjs <NamaPascalCase> "<Judul>" [--scenes a,b,c]`: scaffold Reels baru (narator Claude Code, default scene Format A) dan daftarkan di `Root.tsx`.
- `node scripts/new-video.mjs <NamaPascalCase> "<Judul>"`: scaffold video dialog berpola VueTutorial.
- Voice over (ElevenLabs): `node scripts/vo-generate.mjs --video <Nama>` (meminta konfirmasi sebelum memanggil API).
- Komposisi harus terdaftar di `src/Root.tsx` agar muncul di Studio.

## Belum dikerjakan
- Tampilan carousel belum pernah dirender di sandbox Claude (tanpa Chrome); ukuran sudah dicocokkan dengan sample dan muat menurut metrik Poppins. Cek dengan `remotion still`.
- Lengan stiker ClaudeCode di sample tampak lebih pendek (±1,5 unit) daripada rig (3 unit); rig tidak diubah.
- Format A (Reels): struktur folder sudah dicek `npm run validate:structure` (termasuk 5 hashtag), tapi isi konten (panjang hook, urgency, dan seterusnya) belum ada validator. Tema Title Case sudah berlaku untuk Reels yang memakai `headlineTransform`; render ulang untuk melihat dampaknya.
