---
name: remotion-web-video
description: Wajib dipakai untuk membuat atau mengubah konten personal branding @ganjar_hadiatna di proyek remotion-web (Reels 9:16, carousel 4:5, tutorial teknis), termasuk saat diminta "buat video baru", "buat carousel", atau lewat /remotion-create. Menjamin aturan konten, brand, dan struktur src/videos/<Nama> konsisten.
version: 1.0.0
---

Proyek ini sudah ada, jadi jangan menjalankan langkah scaffold proyek dari `remotion-create`.
Hanya untuk akun personal branding; jangan dicampur dengan `edumotion-web`.
Baca `CLAUDE.md` di root (aturan Format A/B/C, brand, keputusan proyek) dan `AGENTS.md`, lalu:

1. Tentukan format: Reels (A), Carousel (B), atau Tutorial teknis (C, tanya sub-varian Quick Tips/Full Walkthrough kalau tidak disebut). Kalau ambigu, tanya dulu.
2. Arah dulu: setujui judul (4-8 kata, Title Case), struktur, dan arah dengan Ganjar sebelum membuat konten penuh. Sertakan caption pendek dan tepat 5 hashtag.
3. Reels: struktur dan nama file wajib mengikuti `docs/struktur-video.md` (rujukan `src/videos/PromptPanjang`); alur Hook, Relate, Shift + urgency, Closing, CTA ikut PromptPanjang. Folder Reels dibuat dengan `node scripts/new-reels.mjs <NamaPascalCase> "<Judul>"`, jangan buat dengan tangan. Video dialog: `node scripts/new-video.mjs <NamaPascalCase> "<Judul>"`, jangan buat folder dengan tangan. Daftarkan komposisi di `src/Root.tsx`. Wajib `BrandFooter` sekali di root, di luar transisi scene.
4. Carousel: baca `docs/carousel.md`, rujuk `src/videos/ModelMurah`. Buat folder dengan `node scripts/new-carousel.mjs <NamaPascalCase> "<Judul>" --format B|C`, lalu isi `src/videos/<Nama>/carousel.content.ts` (`CAROUSEL: CarouselSpec`) sampai tidak ada `TODO`. Jangan ubah ukuran/tata letak tanpa sample baru.
5. Visual: warna dan huruf dari `src/themes/gh.ts` dan `design-system/gh-design-system`, jangan hardcode. Poppins saja, gerak ease-out `[0.2, 0.8, 0.2, 1]` tanpa bounce/spring. Karakter diimpor dari barrel `src/assets/characters`; tampilan Ganjar final.
6. Teknik Remotion (animasi, urutan, audio) ikuti `remotion-best-practices`.
7. Tulisan: ikuti skill `bahasa-indonesia` untuk ejaan; "aku-kamu", dilarang "gue/lo".
8. Selesai: `npm run lint` (eslint + tsc + validate + validate:structure) harus bersih untuk berkas yang diubah, `npm run alt` untuk carousel. Jangan menjalankan `vo-generate` tanpa persetujuan Ganjar.
