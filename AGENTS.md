# AGENTS.md

Konteks project untuk agent AI apa pun (Claude Code, Codex, Cursor, dll.). Baca ini dulu, lalu buka berkas rujukan di bawah sesuai tugas.

## Apa project ini
`remotion-web` adalah generator konten animasi untuk personal branding **@ganjar_hadiatna** (Ganjar Hadiatna, engineer, brand Coderium): Reels/TikTok 9:16 dan carousel Instagram/LinkedIn 1080x1350. Dibangun dengan Remotion 4, React 19, TypeScript strict, font Poppins.

- Hanya untuk akun personal branding. **Jangan dicampur dengan `edumotion-web`** (akun edukasi terpisah).
- Aturan konten berasal dari Claude Project "PERSONAL BRANDING" (ghostwriter). Kalau aturan di sana berubah, perbarui `CLAUDE.md` dan `docs/carousel.md`.

## Berkas rujukan (sumber kebenaran)
| Butuh | Baca |
|---|---|
| Aturan konten Format A/B/C, keputusan project, daftar yang belum dikerjakan | [CLAUDE.md](CLAUDE.md) |
| Membuat atau mengubah folder `src/videos/<Nama>/` (nama dan isi file wajib, voiceover) | [docs/struktur-video.md](docs/struktur-video.md) |
| Membuat atau mengubah carousel (field, ukuran, warna, validator, render) | [docs/carousel.md](docs/carousel.md) |
| Warna, huruf, gerak | `design-system/gh-design-system` (`readme.md`, `SKILL.md`), tema kode `src/themes/gh.ts` |
| Karakter Ganjar, Robot, Claude Code | `src/assets/characters/README.md` |
| Perintah dan struktur folder | [README.md](README.md) |

## Aturan yang paling sering dilanggar
- Bahasa Indonesia natural, **"aku-kamu" konsisten, dilarang "gue/lo"**. Paragraf pendek (1-2 kalimat). Judul 4-8 kata, Title Case.
- Setiap konten membawa caption pendek dan **tepat 5 hashtag**: `#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`.
- Tentukan format dulu. Opini = Format A (Reels: Hook, Relate, Shift + kalimat urgency follow, Closing, CTA) atau B (carousel 5-8 slide, setiap slide berjudul, CTA follow di slide 2-3). Tutorial teknis = Format C (code diverifikasi dari referensi resmi, maks 10-12 baris code per slide). Kalau ambigu, tanya dulu.
- Semua warna dan huruf dari tema, jangan hardcode. Poppins saja. Biru `#3051B8` primary, oranye `#FF914D` hanya untuk satu frasa sorotan (teks, tanpa latar stabilo). Ungu aksen-2 `#AF67DE`.
- Gerak: ease-out `[0.2, 0.8, 0.2, 1]`, tanpa bounce atau spring.
- Setiap video Reels wajib memakai `BrandFooter`, dirender sekali di root.
- Carousel: ukuran dan tata letak dikunci dari sample "Model Murah Bisa Menjebak" (`src/videos/ModelMurah`). Jangan ubah tanpa sample baru. Gambar opsional dan wajib beralt text.
- Tampilan karakter Ganjar sudah final. Narator tetap karakter Claude Code (rig 2D). Jangan diubah tanpa diminta.
- Tidak ada lagi integrasi `content_studio` (CrewAI) atau alur `draft.json`. Data video/carousel ditulis langsung di repo.

## Struktur singkat
- `src/compositions.ts`: mendaftarkan komposisi otomatis dari `export const COMPOSITION` di `<Nama>Video.tsx` atau `<Nama>Carousel.tsx` tiap folder `src/videos`. `src/Root.tsx` tidak perlu diubah.
- `src/videos/<Nama>/`: satu topik per folder. Nama dan isi file baku, lihat [docs/struktur-video.md](docs/struktur-video.md). Reels = `README.md`, `<Nama>Video.tsx`, `config.ts`, `scenes.tsx`, `parts.tsx`, `voiceover.json`, `voiceover-files.ts`, `voiceover/`. Carousel = `carousel.content.ts` + `<Nama>Carousel.tsx`.
- `src/carousel/CarouselDeck.tsx`: renderer carousel. `src/content/`: tipe dan validator konten.
- `src/assets/`: karakter, latar, kamera, layar. `src/themes/`: tema GH.

## Perintah
- `npm i`, `npm run dev` (Remotion Studio).
- `npm run validate`: validator aturan konten carousel, harus bebas ERROR. Butuh Node >= 22.18.
- `npm run validate:structure`: cek nama dan isi folder `src/videos/<Nama>` terhadap [docs/struktur-video.md](docs/struktur-video.md). Pengecualian (`EXEMPT`) ada di skripnya.
- `npm run lint`: eslint + tsc + validate + validate:structure.
- `npm run alt -- <berkas>`: alt text, caption, hashtag carousel.
- Render Reels: `npx remotion render src/index.ts <Id> out/<Nama>.mp4`. Carousel: tambahkan `--sequence --image-format=png`.

## Cara kerja dan batasan
- Arah dulu, eksekusi kemudian: setujui judul, struktur, dan arah sebelum membuat konten penuh. Hasil harus lengkap dan siap pakai.
- Jangan commit: `out/`, `.env`, `.claude/settings.local.json`, `_to_delete/` (berkas menunggu dihapus manual oleh pemilik).
- Tampilan carousel belum diverifikasi lewat render sungguhan. Kalau bisa merender, cek dengan `remotion still` dan bandingkan dengan sample.
- Komentar kode dan teks UI dalam Bahasa Indonesia, mengikuti gaya berkas yang sudah ada.
