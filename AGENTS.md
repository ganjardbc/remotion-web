# AGENTS.md

Konteks project untuk agent AI apa pun (Claude Code, Codex, Cursor, dll.). Baca ini dulu, lalu buka berkas rujukan sesuai tugas.

## Apa project ini
`remotion-web` adalah generator konten animasi untuk personal branding **@ganjar_hadiatna** (Ganjar Hadiatna, engineer, brand Coderium): Reels/TikTok 9:16 dan carousel Instagram/LinkedIn 1080x1350. Remotion 4, React 19, TypeScript strict, font Poppins.

- Hanya untuk akun personal branding. **Jangan dicampur dengan `edumotion-web`** (akun edukasi terpisah).
- Aturan konten berasal dari Claude Project "PERSONAL BRANDING" (ghostwriter). Kalau berubah, perbarui `CLAUDE.md` dan `docs/carousel.md`.

## Berkas rujukan (sumber kebenaran)
| Butuh | Baca |
|---|---|
| Aturan konten Format A/B/C, brand, keputusan project, cara kerja, perintah | [CLAUDE.md](CLAUDE.md) |
| Folder `src/videos/<Nama>/` Reels (nama, isi file, voiceover, alur kerja, daftar periksa) | [docs/struktur-video.md](docs/struktur-video.md) |
| Reels dialog dan video dialog | [docs/dialog-reels.md](docs/dialog-reels.md) |
| Reels block (diorama, shot kamera, tanpa footer) | [docs/block-reels.md](docs/block-reels.md) |
| Carousel (field, ukuran, warna, validator, render) | [docs/carousel.md](docs/carousel.md) |
| Warna, huruf, gerak | `design-system/gh-design-system` (`readme.md`, `SKILL.md`), tema `src/themes/gh.ts` |
| Karakter Ganjar, Robot, Claude Code | `src/assets/characters/README.md` |
| Perintah dan struktur folder | [README.md](README.md) |

Aturan yang paling sering dilanggar (bahasa "aku-kamu", 5 hashtag, satu sorotan oranye, `BrandFooter` sekali, warna dari tema, Ganjar final) ada di CLAUDE.md. Baca sebelum membuat konten.

## Struktur singkat
- `src/compositions.ts`: mendaftarkan komposisi otomatis dari `export const COMPOSITION` di `<Nama>Video.tsx` atau `<Nama>Carousel.tsx`. `src/Root.tsx` tidak perlu diubah.
- `src/videos/<Nama>/`: satu topik per folder, nama dan isi file baku (docs/struktur-video.md). Reels = `README.md`, `<Nama>Video.tsx`, `config.ts`, `scenes.tsx`, `parts.tsx`, `voiceover.json`, `voiceover-files.ts`, `voiceover/`. Carousel = `carousel.content.ts` + `<Nama>Carousel.tsx`.
- `src/carousel/CarouselDeck.tsx`: renderer carousel. `src/content/`: tipe dan validator konten.
- `src/block-reels/`: mesin Reels block (dunia diorama berparalaks, shot kamera, caption atas). `src/dialog-reels/`: mesin Reels dialog dan stiker karakter carousel. `src/assets/`: karakter, latar, kamera, layar. `src/themes/`: tema GH.

## Perintah dan batasan
- `npm i`, `npm run dev`, `npm run lint` (eslint + tsc + validate + validate:structure; `validate` butuh Node >= 22.18). Rincian perintah: CLAUDE.md.
- Jangan commit: `out/`, `.env`, `.claude/settings.local.json`, `_to_delete/` (menunggu dihapus manual oleh pemilik).
- Tampilan carousel belum diverifikasi lewat render sungguhan. Kalau bisa merender, cek dengan `remotion still` dan bandingkan dengan sample.
- Komentar kode dan teks UI dalam Bahasa Indonesia, mengikuti gaya berkas yang ada.
