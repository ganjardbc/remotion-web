# remotion-web

Generator konten animasi untuk personal branding **@ganjar_hadiatna**: Reels/TikTok 9:16 dan carousel 4:5 untuk Instagram dan LinkedIn, dibangun dengan [Remotion](https://www.remotion.dev).

Repo ini hanya untuk akun personal branding. Konten edukasi ada di `edumotion-web`, terpisah.

## Dokumentasi

- [Panduan carousel](docs/carousel.md): aturan isi, tampilan, keterbacaan, validator, dan cara render.
- [AGENTS.md](AGENTS.md): konteks ringkas untuk agent AI apa pun.
- [CLAUDE.md](CLAUDE.md): aturan konten lengkap (Format A/B/C) dan keputusan project.
- [Karakter](src/assets/characters/README.md): Ganjar, Robot, Claude Code.
- Design system: `design-system/gh-design-system` (tema kode di `src/themes/gh.ts`).

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm i` | Pasang dependensi |
| `npm run dev` | Buka Remotion Studio |
| `npm run validate` | Cek aturan konten carousel |
| `npm run alt -- <berkas>` | Buat alt text, caption, dan hashtag carousel |
| `npm run validate:structure` | Cek struktur folder `src/videos/<Nama>` terhadap docs/struktur-video.md |
| `npm run lint` | eslint + tsc + validate + validate:structure |
| `npx remotion render src/index.ts <Id> out/<Nama>.mp4` | Render Reels |
| `npx remotion render src/index.ts <Id> out/<Nama> --sequence --image-format=png` | Render carousel |
| `node scripts/new-reels.mjs <Nama> "<Judul>" [--dialog]` | Scaffold Reels baru (narator Claude Code, atau dialog dengan `--dialog`) |
| `node scripts/new-carousel.mjs <Nama> "<Judul>"` | Scaffold carousel baru (Format B atau C) |
| `node scripts/new-video.mjs <Nama> "<Judul>"` | Scaffold video dialog baru |
| `node scripts/vo-generate.mjs --video <Nama>` | Voice over ElevenLabs |

Validator dan skrip alt text butuh Node 22.18 atau lebih baru.

## Struktur

```
src/
  carousel/      renderer carousel (CarouselDeck)
  content/       tipe dan validator konten carousel
  videos/<Nama>/ satu video atau carousel per folder
  assets/        karakter, latar, kamera, layar
  themes/        tema GH
design-system/   GH design system
docs/            panduan
```

## Lisensi Remotion

Untuk entitas tertentu dibutuhkan lisensi perusahaan. Baca [ketentuannya](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
