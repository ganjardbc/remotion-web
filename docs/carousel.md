# Panduan Carousel

Carousel 4:5 (1080x1350) untuk Instagram dan LinkedIn akun **@ganjar_hadiatna**, dirender oleh Remotion di repo ini. Panduan ini adalah sumber aturan carousel: isi, tampilan, keterbacaan, dan cara membuatnya. Aturan menulis di sini mengikuti Claude Project "PERSONAL BRANDING" (ghostwriter). Kalau aturan di sana berubah, perbarui juga di sini.

Acuan tampilan: sample **"Model Murah Bisa Menjebak"** (`src/videos/ModelMurah`). Semua ukuran di bawah diukur per piksel dari sample itu.

## Daftar isi

1. [Alur kerja](#alur-kerja)
2. [Aturan isi](#aturan-isi)
3. [Menulis berkas konten](#menulis-berkas-konten)
4. [Aturan tampilan](#aturan-tampilan)
5. [Keterbacaan](#keterbacaan)
6. [Validator](#validator)
7. [Render dan alt text](#render-dan-alt-text)
8. [Keputusan yang sudah diambil](#keputusan-yang-sudah-diambil)

## Alur kerja

1. Tentukan jenis konten. Opini atau perspektif memakai **Format B**. Tutorial teknis memakai **Format C**, lalu tentukan sub-variannya (Quick Tips atau Full Walkthrough). Kalau ragu, tanyakan dulu.
2. Setujui arah dulu: judul, struktur slide, dan sudut pandang. Baru setelah itu tulis isi lengkapnya.
3. Buat foldernya dengan `node scripts/new-carousel.mjs <Nama> "<Judul>" [--format B|C] [--variant quick-tips|walkthrough]`. Skrip menulis `carousel.content.ts` (kerangka slide berisi `TODO`) dan `<Nama>Carousel.tsx`, serta mendaftarkan komposisinya di `src/Root.tsx`. Jangan buat dengan tangan.
4. Jalankan `npm run validate` sampai tidak ada ERROR dan tidak ada peringatan `TODO`.
5. Render satu slide untuk dicek, lalu render semuanya.
6. Buat alt text dengan `npm run alt`, lalu tempel bersama caption dan hashtag saat posting.

## Aturan isi

### Semua format

- Bahasa Indonesia natural, seperti orang berbagi pemikiran, bukan nada AI.
- Pakai "aku-kamu" secara konsisten. Jangan "gue/lo".
- Paragraf pendek, 1-2 kalimat.
- Insight lebih penting daripada informasi, dan cara berpikir lebih penting daripada tutorial (kecuali Format C).
- Setiap slide **wajib punya judul**, termasuk hook dan closing.
- CTA follow **wajib di slide 2 atau 3**, dengan alasan spesifik ke isi konten. Kalimat seperti "follow untuk tips lainnya" tidak dipakai.
- Setiap carousel membawa **caption pendek** dan **tepat 5 hashtag**. Set bawaan: `#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset`.

### Format B: opini atau perspektif

| Aturan | Nilai |
|---|---|
| Jumlah slide | 5-8 (boleh 9-10 untuk topik kaya) |
| Judul carousel | 4-8 kata, memancing penasaran, tidak terdengar seperti tutorial |
| Slide hook | 1 paragraf, 1-2 kalimat |
| Slide isi | 1-4 kalimat, 1-3 paragraf |
| Bullet atau daftar bernomor | Tidak dipakai, tulis sebagai prosa |

Urutan slide: **Hook** → **Relate** (+ CTA follow di slide 2-3) → **Shift** (insight inti yang membongkar asumsi) → **Detail** (pendalaman, opsional) → **Closing** (kesimpulan tajam yang layak dikutip, boleh CTA ulang).

### Format C: tutorial teknis

| Aturan | Quick Tips | Full Walkthrough |
|---|---|---|
| Jumlah slide | 4-6 | 8-12 |

- Hook 1 kalimat, boleh berupa hasil atau output.
- Alur: Hook → konteks singkat → langkah → hasil/closing → CTA. Relate dan Shift tidak wajib.
- Code atau command wajib di code block, akurat, dan **diverifikasi lewat referensi resmi**, bukan dari ingatan.
- Maksimal 12 baris code per slide. Kalau lebih, pecah jadi beberapa slide (1 langkah = 1 slide).
- Teks di luar code maksimal 4 kalimat per slide.
- Bullet atau daftar bernomor boleh untuk langkah.
- CTA berisi value teknis, misalnya "follow kalau mau lanjutan setup-nya".

## Menulis berkas konten

Satu carousel = satu berkas `carousel.content.ts` yang mengekspor `CAROUSEL: CarouselSpec`. Tipenya ada di `src/content/types.ts`.

### Field carousel

| Field | Wajib | Isi |
|---|---|---|
| `format` | ya | `"B"` atau `"C"` |
| `variant` | Format C | `"quick-tips"` atau `"walkthrough"` |
| `title` | ya | Judul carousel, juga tampil sebagai judul seri di header |
| `style` | ya | Gaya karakter: `"rig"` atau `"stickman"` |
| `slides` | ya | Daftar slide |
| `caption` | ya | Caption pendek |
| `hashtags` | ya | Tepat 5 |

### Field slide

| Field | Wajib | Isi |
|---|---|---|
| `role` | ya | Format B: `hook`, `relate`, `shift`, `detail`, `closing`. Format C: `hook`, `detail`, `step`, `closing` |
| `title` | ya | Ditulis kalimat biasa; Title Case diterapkan tema |
| `accent` | tidak | Satu frasa di dalam `title` yang diwarnai oranye |
| `paragraphs` | ya | Daftar paragraf isi |
| `tone` | tidak | `"biru"` atau `"putih"`. Bawaan: hook dan shift biru, sisanya putih |
| `cta` | slide 2/3 | Ajakan follow. Di closing, tampil di samping logo besar |
| `stat` | tidak | `{ label, value, note? }`: label kecil, angka besar, keterangan |
| `image` | tidak | `{ src, alt, position? }`. `src` di bawah `public/`, **`alt` wajib**, `position`: `atas`, `samping` (di sebelah stat), `bawah` |
| `quote` | tidak | Kalimat kunci dalam kartu berbingkai. `\n` untuk pindah baris |
| `code` | tidak | `{ lang, code }`, maksimal 12 baris |
| `cast` | tidak | Karakter sebagai stiker: `{ character, expression, motion, position }` |

### Contoh

```ts
import type { CarouselSpec } from "../../content/types";

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
      paragraphs: ["Aku menjalankan prompt analisis yang sama pada Haiku 5.5, Sonnet 5.5, dan Opus 5.5. Hasilnya membuatku berpikir ulang soal cara memilih model."],
    },
    {
      role: "relate",
      title: "Kita sering menilai model dari harganya",
      accent: "harganya",
      paragraphs: ["Harga per token mudah dibandingkan, jadi kita sering berhenti di situ."],
      cta: "Kalau kamu ingin melihat perbedaan ketiga model ini dalam pekerjaan nyata, follow akun ini.",
    },
    // ...
  ],
  caption: "Murah belum tentu hemat.",
  hashtags: ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"],
};
```

Komponen dan pendaftarannya:

```tsx
// src/videos/<Nama>/<Nama>Carousel.tsx
import { CarouselDeck } from "../../carousel/CarouselDeck";
import { CAROUSEL } from "./carousel.content";

export const NAMA_CAROUSEL_SLIDES = CAROUSEL.slides.length;
export const NamaCarousel: React.FC<{ readonly theme: string }> = ({ theme }) => <CarouselDeck theme={theme} spec={CAROUSEL} />;

// src/Root.tsx
<Composition id="Nama-Carousel" component={NamaCarousel} durationInFrames={NAMA_CAROUSEL_SLIDES} fps={1} width={1080} height={1350} defaultProps={{ theme: "gh" }} />
```

Contoh lengkap: `src/videos/ModelMurah/`.

## Aturan tampilan

Semua angka sudah dikunci di `src/carousel/CarouselDeck.tsx`. Jangan diubah tanpa sample baru. Semua warna dan huruf diambil dari tema (`src/themes/gh.ts`), jangan hardcode.

### Tata letak

- Kanvas 1080x1350, margin 88 di semua sisi.
- Header di atas, isi di tengah vertikal, footer di bawah.
- Jarak antarblok isi 32. Kartu CTA dan kutipan mendapat tambahan 8.
- Paragraf dalam satu slide berjarak 16.

### Warna

| Elemen | Latar biru (hook, shift) | Latar putih |
|---|---|---|
| Latar | Primary `#3051B8` | Putih |
| Judul dan isi | Putih penuh | Ink `#14141F` |
| Sorotan judul | Teks oranye `#FF914D` | Teks oranye `#FF914D` |
| Nomor slide, keterangan | Putih 78% | Ink 64% |
| Garis dan bingkai | Putih 22% | Border ink 14% |

Ungu aksen-2 (`#AF67DE`) tidak dipakai di carousel.

### Huruf

| Elemen | Ukuran (px) | Gaya |
|---|---|---|
| Judul hook | 106 | ExtraBold, line-height 1, tracking -0,04em |
| Judul relate | 96 | sama |
| Judul shift | 100 | sama |
| Judul closing | 104 | sama |
| Judul detail | 88 | sama |
| Judul slide stat dan step | 76 | sama |
| Isi hook dan closing | 38 | Regular, line-height 1,45 (closing 1,5) |
| Isi relate, shift, detail | 34 | Regular, line-height 1,45 |
| Isi slide stat, code, step | 31 | Regular, line-height 1,45 |
| Judul seri di header | 27 | Bold |
| Nomor slide (`01 / 07`) | 26 | SemiBold |
| Label stat | 28 | Bold, huruf kapital, tracking 0,02em, biru `#25429D` |
| Angka stat | 116 | ExtraBold, tracking -0,03em |
| Keterangan stat | 26 | Regular |
| Teks kartu CTA | 34 | Medium, line-height 1,5, `#121F4A` |
| Kutipan | 44 | Bold, line-height 1,3 |
| Code | 28 | Monospace, line-height 1,5 |
| "Geser" (slide 1) | 27 | Bold |
| Ajakan di closing | 28 | Bold |

### Komponen

- **Header:** logo GH 56, judul seri, nomor slide di kanan.
- **Footer:** panah 42 di kanan, ditambah "Geser" di slide 1. Slide terakhir tanpa panah: logo 84 dan ajakan follow.
- **Kartu CTA:** radius 20, latar `primaryTint`, ikon user 40, padding 38/44/42.
- **Kartu kutipan:** bingkai 1 px, radius 20, padding 36/43/42.
- **Blok stat:** kolom 343 px. Gambar di sampingnya mulai x 471 dan mengisi sisa lebar (520 px), di tengah vertikal. Di bawahnya garis pemisah 1 px.
- **Hiasan hook:** dua lingkaran garis 2 px putih 22% (pusat 980,100 jari-jari 278; pusat 59,1290 jari-jari 178) dan tanda plus oranye 24 px.
- **Stiker karakter (`cast`):** digambar di bawah slide, di luar alur isi. Outline putih 7 px, bayangan lembut, miring 6 derajat (kiri -6, kanan +6). ClaudeCode rig setinggi 279 px; karakter lain diskalakan sama. Contoh: ClaudeCode `malu` di kiri pada hook Model Murah.

### Gambar

- Opsional di slide mana pun, posisinya bebas. Cover tidak wajib bergambar.
- Berkas disimpan di `public/`, misalnya `public/carousel/<nama>/gambar.png`.
- `alt` wajib dan harus menjelaskan isi gambar, termasuk angka atau teks penting di dalamnya.
- Angka penting di dalam gambar (misalnya screenshot terminal) diulang sebagai teks di `stat`, karena gambar kecil sulit dibaca di HP.

## Keterbacaan

- Judul memakai **Title Case**, bukan huruf kapital semua. Tanpa italic atau garis bawah.
- Semua paragraf rata kiri.
- Sorotan hanya satu frasa per judul, berupa teks oranye tanpa latar.
- Kontras minimal 4,5:1 untuk teks biasa dan 3:1 untuk teks besar dan ikon.
- **Pengecualian yang disengaja:** sorotan oranye di judul hanya 3,1:1 di latar biru dan 2,2:1 di latar putih. Ini keputusan desain mengikuti sample. Karena itu oranye hanya boleh untuk judul berukuran besar, **jangan untuk teks isi**.
- Batas panjang supaya nyaman dibaca sambil menggeser:

| Elemen | Batas |
|---|---|
| Isi per slide | 320 karakter |
| Judul slide | 70 karakter (maksimal 3 baris) |
| Kutipan | 120 karakter |
| Code | 12 baris (10 bila teks di slide itu lebih dari 2 kalimat) |

- Setiap carousel diposting dengan alt text per slide, supaya bisa dibaca pembaca layar.

## Validator

`npm run validate` memeriksa semua `src/**/carousel.content.ts`. Butuh Node 22.18 atau lebih baru. ERROR menggagalkan perintah; `warn` hanya peringatan.

| Pemeriksaan | Tingkat |
|---|---|
| Judul Format B 4-8 kata | ERROR |
| Jumlah slide sesuai format atau varian | ERROR |
| Slide pertama `hook`, terakhir `closing` | ERROR |
| Format B punya `relate` sebelum `shift`, tanpa `step` | ERROR |
| CTA di slide 2 atau 3, tidak generik | ERROR |
| Setiap slide punya judul, `accent` ada di judul | ERROR |
| Jumlah kalimat dan paragraf per slide | ERROR |
| Tanpa bullet di Format B | ERROR |
| Code maksimal 12 baris, punya `lang` | ERROR |
| "gue/lo" di mana pun | ERROR |
| Gambar tanpa `alt`, stat tanpa label atau nilai | ERROR |
| Caption terisi, tepat 5 hashtag yang valid dan tidak ganda | ERROR |
| "Anda", paragraf lebih dari 2 kalimat | warn |
| Isi lebih dari 320 karakter, judul lebih dari 70, kutipan lebih dari 120 | warn |
| Caption lebih dari 220 karakter, alt terlalu singkat | warn |

## Render dan alt text

```bash
# Cek satu slide (frame 0 = slide 1)
npx remotion still src/index.ts ModelMurah-Carousel out/mm-01.png --frame=0

# Render semua slide jadi PNG
npx remotion render src/index.ts ModelMurah-Carousel out/ModelMurah --sequence --image-format=png

# Alt text per slide + caption + hashtag -> out/ModelMurah-alt.md
npm run alt -- src/videos/ModelMurah/carousel.content.ts
```

`npm run alt` gagal kalau berkas gambar yang dirujuk tidak ada di `public/`.

## Keputusan yang sudah diambil

- Carousel hanya dibuat di remotion-web, bukan `gh-content-pipeline` atau Canva.
- Integrasi content_studio dihapus; isi carousel ditulis langsung di `carousel.content.ts`.
- Gambar opsional dan posisinya bebas.
- Judul Title Case, berlaku juga untuk Reels supaya gayanya sama.
- Sorotan judul berupa teks oranye, bukan stabilo.
- Karakter ClaudeCode dipakai apa adanya; rig tidak diubah.
