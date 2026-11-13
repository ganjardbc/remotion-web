# Struktur file video

Aturan baku isi folder `src/videos/<Nama>/`. Nama file harus persis seperti di bawah, tanpa variasi. Rujukan Reels: `src/videos/PromptPanjang`. Rujukan carousel: `src/videos/ModelMurah`.

Lima jenis folder: **Reels** (narator Claude Code, 9:16), **Reels dialog** (9:16, `new-reels.mjs --dialog`), **Reels block** (9:16, diorama tanpa footer, `new-block.mjs`, aturan di [block-reels.md](block-reels.md)), **video dialog** (16:9, `new-video.mjs`), dan **carousel**. Aturan Reels dialog dan video dialog ada di [dialog-reels.md](dialog-reels.md); aturan carousel di [carousel.md](carousel.md). Satu folder boleh memuat Reels dan carousel untuk topik yang sama, tapi tidak boleh mencampur Reels dengan Reels dialog atau video dialog. Jenis folder dikenali dari isinya: `carousel.content.ts` = carousel, `SceneRenderer.tsx` = video dialog, `config.ts` + `scenes.tsx` = Reels, `config.ts` + `scenes.ts` = Reels dialog.

## Nama

| Hal | Aturan | Contoh |
|---|---|---|
| Folder | PascalCase, 1-3 kata dari judul, tanpa angka urut atau kata sambung | `PromptPanjang`, bukan `PromptPanjangItuTandaMalas` |
| Id komposisi Reels | `<Nama>-Reels` | `PromptPanjang-Reels` |
| Id komposisi video dialog | `<Nama>` | `VueTutorial` |
| Id komposisi carousel | `<Nama>-Carousel` | `ModelMurah-Carousel` |
| Hasil render | `out/<Nama>-Reels.mp4`, `out/<Nama>-Carousel/` | |
| Id scene | huruf kecil, satu kata, Bahasa Indonesia atau istilah format | `hook`, `relate`, `shift`, `urgency`, `cara`, `closing`, `cta` |
| Komponen scene | `<Id>Scene` | `HookScene`, `CaraScene` |

Format A: id scene wajib memuat `hook`, `relate`, `shift`, `urgency`, `closing`, `cta` (urutan itu). Scene tambahan disisipkan di antaranya (contoh `cara` di PromptPanjang). Isi `urgency`: satu kalimat utuh yang mengalir dan mengantar ke scene sesudahnya, yang langsung membayarnya di video yang sama; bukan dua fragmen pendek dan bukan janji konten lanjutan.

## Reels: isi folder

Dibuat dengan `node scripts/new-reels.mjs <Nama> "<Judul>" [--scenes hook,relate,shift,urgency,closing,cta]`. Jangan buat folder dengan tangan: skrip menulis semua berkas dengan nama benar, menyalin `parts.tsx` dari PromptPanjang (video lama tidak ikut berubah bila PromptPanjang diperbarui), dan menulis `COMPOSITION` supaya terdaftar otomatis. Template di `scripts/templates/reels`. Isi `SPOKEN`, `CAPTION`, dan scene sesudahnya.

```
src/videos/<Nama>/
  README.md
  <Nama>Video.tsx
  config.ts
  scenes.tsx
  parts.tsx
  voiceover.json
  voiceover-files.ts
  voiceover/<id-scene>.mp3
```

Hanya berkas itu. Tidak boleh ada satu berkas per scene (`HookScene.tsx`), `scenes.ts`, `scene.tsx`, `shared.tsx`, `visuals.tsx`, `voiceover.ts`, `Sfx.tsx`, atau sejenisnya. Komponen tambahan masuk `parts.tsx`.

**Tidak boleh mengimpor dari folder video lain** (`../<NamaLain>/...`). Yang dipakai lebih dari satu video dipindah ke `src/`: gerak (`Enter`, `Pop`, `useSpringIn`, `shakeX`) di `src/motion.tsx`, footer di `src/BrandFooter.tsx`, latar di `src/Backdrop.tsx`. Impor dari `../../motion`.

### `config.ts`

Satu-satunya sumber teks dan waktu. Ekspor dengan nama persis ini:
- `FPS` (30), `LEAD` (jeda frame sebelum suara mulai); `TAIL` dan `CHARS_PER_SEC` lokal, tidak diekspor.
- `SCENE_IDS` (`as const`) dan `type SceneId`.
- `SPOKEN: Record<SceneId, string>`: teks yang diucapkan. Singkatan Inggris ditulis fonetis ("Ei Ai").
- `CAPTION` dan `HASHTAGS` (tepat 5, set baku).
- `VO`: dari `voiceover.json` + `VO_FILES`; klip belum ada → `file: null`, durasi diperkirakan dari `CHARS_PER_SEC`.
- `at(id, frasa)`: detik sejak suara mulai saat frasa diucapkan.
- `SCENE_FRAMES`, `SCENE_START`, `TOTAL_FRAMES`, `MUSIC_FILE`. Data khusus video (contoh `REPO_URL`) juga di sini.

### `scenes.tsx`

Satu `export const <Id>Scene: React.FC` per id, urut sesuai `SCENE_IDS`, tiap scene diawali komentar `// ---------- <n>. <Nama> ----------`. Cue ditulis sebagai frasa dari `SPOKEN` lewat `useCue(id).when(frasa)` (perkiraan dari posisi huruf), atau detik dari timestamp scribe yang sudah diukur (lebih akurat; Haiku55 dan ModelTeam). Kalau `SPOKEN` berubah, ukur ulang cue scene itu.

### `parts.tsx`

Komponen dan helper bersama scene video ini (`cue`, `useCue`, `Frame`, `Headline`, `Accent`, `Chip`, `Card`, dan lain-lain). Disalin dari video rujukan, lalu disesuaikan.

### `<Nama>Video.tsx`

Mengekspor `<Nama>Video: React.FC<{ theme: string }>` dan meneruskan `TOTAL_FRAMES`. Isi berurutan: `Series` scene (peta `SCENES`), `Character` (Claude Code, ekspresi per scene di `FACES`), `BrandFooter` sekali di root, `Sound` (VO per scene di `SCENE_START + LEAD`, whoosh di awal scene, musik latar).

### `README.md`

Bagian wajib, urut: judul `# <Nama>` dan satu paragraf (judul konten, format, jumlah scene, id komposisi, sudut pandang, narator), daftar berkas, `## Voiceover` (status, suara, model, speed, perintah olah ulang), perintah render, `## Caption` (caption dan 5 hashtag).

### Voiceover

- ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model bawaan **`eleven_v4`** (mengabaikan `speed`, jadi tidak dikirim). Satu klip per scene, id klip = id scene. Video lama yang memakai `eleven_multilingual_v2` speed 1.2 (PromptPanjang, ClaudeMem, Haiku55, ModelTeam, ReviewKodeAI) menguncinya lewat `VO_SETTINGS` di `config.ts` supaya hash klip tidak berubah.
- `config.ts` hasil scaffold sudah memuat `VO_SETTINGS = { model: "eleven_v4", speed: null }` dan `VO_TEXT` (teks TTS per scene, satu tag emosi per scene dari `VO_TAGS`; `SPOKEN` tetap teks subtitle dan cue). Untuk scene penting, tulis `VO_TEXT` tangan dengan tag per kalimat ("[curious] Kalimat satu. [serious] Kalimat dua."): tag Inggris di depan kalimat (`[curious]`, `[serious]`, `[thoughtful]`, `[confident]`, `[intrigued]`, `[calm]`, `[warm]`, `[friendly]`, `[excited]`), singkatan Inggris ditulis fonetis di teks TTS. Referensi: AiNativeSdlc dan CodeGraph. `CHARS_PER_SEC` template 13,2 (rata-rata video v4: 11-15 huruf/detik); `vo-check` memakai tempo 13-18,5 huruf/detik yang dikalibrasi untuk model lama, jadi tempo v4 yang agak lebih lambat bukan otomatis masalah. Di ClaudeSetup rentang nada per klip naik dari ±6-9 ke 11-15 semitone dibanding `eleven_multilingual_v2` speed 1.2 yang datar. Mengubah model atau teks TTS mengubah hash, jadi semua klip di-generate ulang; putuskan modelnya sebelum generate semua.
- Intonasi tanya: kalimat tanya ya/tidak yang ditutup kata kerja atau kata ulang ("...masih nebak-nebak?") dibaca turun di semua model, juga dengan `[questioning]`. Susun agar ditutup kata benda atau nama ("Masih nebak-nebak waktu setup Claude Code?"): naik ±9 semitone (diukur di ClaudeSetup). Untuk kalimat penting buat 2-3 take dan pilih yang terbaik.
- Klip mentah di `out/vo-raw/<Nama>/<id>.mp3` (tidak di-commit). Olah dengan `node scripts/vo-process.mjs <id> out/vo-raw/<Nama>/<id>.mp3 --hash <hash> --video <Nama>`.
- `voiceover.json` dimulai `{ "lines": {} }`. `voiceover-files.ts` dan `voiceover/` ditulis oleh `vo-process.mjs` saat klip pertama diolah (video belum bersuara belum punya `voiceover/`, itu sah). Jangan diubah tangan.
- Alur: `node scripts/vo-lines.mjs --video <Nama>` (status `baru`, `berubah`, `ok`) → `node scripts/vo-generate.mjs --video <Nama> [--only id]` men-generate yang belum ada atau berubah, memotong senyap, menormalkan, mencatat. Jumlah huruf (≈ kredit) ditampilkan dan konfirmasi diminta. Butuh `ELEVENLABS_API_KEY` di environment atau `.env.local`. Hash = sha1 `voiceId|model|SPOKEN[id]`.
- Hemat kredit: generate satu scene dulu (`--only hook`), `vo-check`, dengarkan, baru sisanya.
- `node scripts/vo-check.mjs --video <Nama> [--only id,id]` (tanpa API): tempo (huruf/detik, ideal 13-18,5), kenyaringan (-18 sampai -14 LUFS), variasi nada (rentang < 9 semitone = datar), nada akhir kalimat tanya (turun = peringatan). Pengukur kasar untuk membandingkan take; telinga tetap hakim.
- `node scripts/vo-words.mjs --video <Nama> [--only id,id]` (scribe, kredit kecil, minta konfirmasi) menulis `WORDS` di `config.ts`; respons disimpan per hash klip di `out/vo-scribe/`. `at()`, cue, dan caption membaca `WORDS`.
- `node scripts/reels-stills.mjs --video <Nama> [--per 1|2|3]` merender still per scene jadi `out/still/<Nama>-sheet.png`.

## Alur kerja Reels (narator)

Urutan pengerjaan, disusun dari pola produksi animasi umum (naskah, storyboard, animatic, animasi, finishing; sumber blog studio, bukan standar baku). Tujuannya menangkap kesalahan di tahap murah (naskah, storyboard) sebelum tahap mahal (visual, voiceover berbayar).

1. **Arah**: jenis konten, judul, struktur, sudut pandang disetujui dulu.
2. **Scaffold**: `new-reels.mjs`.
3. **Naskah**: `SPOKEN`, `CAPTION`, `HASHTAGS` di `config.ts`.
4. **Storyboard**: tabel per scene (di bawah), disetujui sebelum `scenes.tsx` ditulis.
5. **Scene dan animatic kasar**: tulis `scenes.tsx` dengan durasi perkiraan dari `CHARS_PER_SEC`, lalu `reels-stills`. Itu pengganti animatic: cek urutan, tempo, tata letak tanpa kredit.
6. **Voiceover**: satu scene dulu, `vo-check`, dengarkan, sisanya; lalu `vo-words`, cue dan caption disesuaikan.
7. **Cek**: daftar periksa di bawah, `npm run lint`, subagent `reels-reviewer`.
8. **Render** dan tonton sekali sebelum upload.

### Storyboard

Tabel di chat, satu baris per scene (atau per beat bila scene bersuara > 8 dtk). Bukan berkas: folder video tidak boleh memuat berkas di luar daftar baku. Kolom: scene, kalimat kunci, hero visual, latar, pose karakter, ekspresi, sorotan oranye. Dicek sebelum visual dibuat:
- Hero visual dan latar tidak sama dengan scene tetangga.
- Pose berpindah dan masuk akal (tengah untuk hook dan CTA, kiri atau kanan untuk scene padat).
- Tepat satu sorotan oranye per layar.
- Hal baru di layar tiap ~4 dtk; kalimat kunci tiap beat jadi dasar cue `useCue`.
- Hook membuka dengan visual atau teks kuat di frame pertama, bukan logo. CTA di isi scene terakhir, terpisah dari footer.
- Rancang 9:16 sejak awal: pita caption dan zona aman (lihat "Peta zona layout").

## Irama scene (Reels narator)

Pedoman dari riset blog vendor (ClipFlip, Splice, Shortzly, Opus Pro; bukan dokumentasi resmi Instagram atau TikTok, angkanya saling berbeda), jadi **peringatan**, bukan error. Uji dengan Insights akun sendiri.

- Tidak ada dead time: tiap ~4 detik ada hal baru di layar (objek masuk, sorotan pindah, ganti ekspresi, kartu baru). Kisaran sumber: cut 1-3 dtk, beat visual 5-8 dtk untuk narasi.
- Scene bersuara > 8 detik (`BEAT_MAX_SCENE` di `scripts/validate-structure.mjs`) diberi peringatan. Pecah jadi beat di dalam scene lewat `useCue`, bukan scene baru.
- Hook menahan scroll dalam 1-3 detik; objek kunci ditahan minimal 24 frame (0,8 dtk).
- Completion rate lebih penting dari durasi. Reels 7-15 dtk untuk jangkauan, 30-60 dtk untuk simpan dan bagikan.
- Subtitle wajib (banyak penonton tanpa suara). Zona aman atas ±250 px, bawah ±350 px (perkiraan; antarmuka aplikasi berubah).
- Subtitle Reels narator: komponen `Caption` di `parts.tsx` (contoh ClaudeSetup). Satu baris rata tengah, potongan maks 28 huruf, kata yang diucapkan putih penuh dan sisanya redup (tanpa oranye). Waktu kata dari `WORDS`, jadi dikerjakan setelah voiceover jadi. Posisi per scene (`CAPTION_Y`), dua pilihan: di atas karakter (±y 1235, berebut ruang dengan konten) atau di bawah karakter di tepi depan meja (±y 1655; seluruh dunia meja dinaikkan agar ada jarak ke footer; zona ini mungkin tertutup nama akun dan caption Instagram). Benda di meja tidak boleh turun melewati pita caption. Uji di tampilan aplikasi sebelum upload.
- Pengecekan otomatis hanya durasi scene dari `voiceover.json`; jumlah beat visual dicek manual.

## Variasi visual antar scene (Reels narator)

Tiap scene harus terlihat beda dari tetangganya. Pedoman, dicek manual.

- **Satu hero visual per scene**, jenisnya beda dari scene sebelum dan sesudahnya: angka besar atau counter, bar progres, kartu bertumpuk, grid atau daftar bercentang, blok terminal atau code, diagram alur berpanah, stempel atau badge, perbandingan dua kolom, kartu repo atau profil. Kartu bertumpuk bukan bawaan semua scene.
- **Tidak ada dua scene berurutan dengan susunan sama.** Ganti tata letak: hero di atas atau tengah, judul kecil (`muted`) atau besar, satu elemen penuh lebar atau dua kolom.
- **Gerak masuk dibedakan**: arah (`x`, `y` di `Enter`), urutan (serentak, bergantian, digambar), ukuran judul (`size`) tidak diulang di scene berurutan. Easing `[0.2, 0.8, 0.2, 1]`, tanpa bounce.
- **Latar berganti**: `Frame` menerima `variant` (`ground` near-black, `dark` konteks terminal atau kode, `primary` biru primer gelap dari `Backdrop`). Selang-seling, tidak dua scene berurutan sama. `sweep` hanya di hook dan scene kunci.
- **Posisi karakter berpindah**: `POSES` di `<Nama>Video.tsx` (`x` tengah 0-1, `h` tinggi), pindah 0,5 dtk ease-out di awal scene. Tengah (besar) untuk hook dan CTA, kiri atau kanan (kecil) untuk scene padat. Tubuh dan lengan di dalam layar dan di luar braket sudut: `x` ±0,32 dan 0,68 untuk `h` 440; kaki di atas footer.
- **Satu dunia, bukan hanya panel**: boleh satu dunia konsisten (meja kerja ClaudeSetup: `Desk` di `Frame`, benda di `extras`) tempat karakter berinteraksi dengan benda. Scene perintah: monitor dan keyboard (tuts menyala per huruf, kaki menginjak bergantian lewat clip `stomp`, suara `typing_bed`); scene daftar: rak laci (laci ditarik tepat saat frasanya diucapkan). Injakan ease-out tajam, tanpa pantulan. Gaya kartun hanya untuk scene beraksi fisik. Ekspresi mengikuti kalimat (`FACES` dengan `at(...)`).
- **Tetap berlaku**: satu sorotan oranye per layar, Poppins, kontras teks, zona aman, ikon dari `src/icons.tsx`.
- **Tata letak tanpa meja lama (acuan SeleraDesain, dipakai CodeGraph, sudah diposting)**: subtitle di bawah karakter ternyata tertutup UI platform, jadi untuk Reels baru pakai "Tata letak narator aman platform" di atas. Bagian ini hanya untuk membaca video lama. Konten di `Frame` (top 170, tinggi 1040), karakter Claude Code di bawahnya, subtitle di paling bawah.
  - Karakter: `CHAR_FEET_Y = 1610`, `POSES` per scene (`x`, `h`). Tengah dan besar (`h` 500, urgency 480) untuk hook, urgency, CTA; kiri `x` 0,32 atau kanan `x` 0,68 dan kecil (`h` 440) untuk scene padat, selang-seling. Pindah 15 frame ease-out di awal scene lewat interpolasi dari pose scene sebelumnya.
  - Subtitle: `Caption` dari `../../desk-world`, dirender sekali di root `<Nama>Video.tsx` (di luar `Series`, setelah `Character`): `<Caption sceneStarts={SCENE_START} words={SCENE_IDS.map((id) => WORDS[id])} lead={LEAD} y={CAPTION_Y} />` dengan `CAPTION_Y = 1660` (di bawah karakter, di atas footer yang mulai y 1825).
  - `WORDS` di `config.ts` wajib ada (tipe `Record<SceneId, readonly (readonly [string, number])[]>`), ditulis sebagai literal supaya `vo-words.mjs` bisa menulis ulang barisnya. Sebelum voiceover jadi, baris kosong (`hook: [],`) dan subtitle memakai `estimateWords(id)` dari posisi huruf `SPOKEN`; `vo-words.mjs` mengisinya dari audio asli.
  - Template `new-reels.mjs` sudah memuat semuanya: `POSES` (hook, urgency, dan scene terakhir di tengah, sisanya selang-seling kiri dan kanan; sesuaikan per storyboard), `Caption` di root, `WORDS` kosong, dan `estimateWords`. Video lama (CodeGraph punya `WORDS` literal perkiraan) tidak ikut berubah.
- **Cek cepat**: tulis jenis hero tiap scene (`hook: counter, relate: terminal, shift: diagram`); ubah bila ada dua sama berdampingan. Render beberapa `remotion still` per scene.

## Tata letak narator aman platform (bawaan Reels baru)

Antarmuka Instagram dan TikTok menutup bagian bawah layar (nama akun, caption postingan, info audio) dan sisi kanan (kolom tombol). Subtitle di bawah karakter (y ±1660, tata letak lama) ternyata tertutup di postingan nyata, padahal sering dibaca tanpa suara. Reels baru memakai tata letak ini; video yang sudah diposting tidak diubah. Semua angka di `src/reelsLayout.ts` (`NARRATOR_MODES`, `NARRATOR_FEET_Y`, `SUBTITLE_HEIGHT`, `SAFE_RIGHT`, `ZONES.safeBottom` 1570). Angka perkiraan; uji di aplikasi dan sesuaikan di satu tempat.

- **Tiga mode karakter per scene**, ditulis di `NARRATOR` (`config.ts`, `{ x, mode }`): `normal` (karakter 340 px, konten sampai y 1010), `small` (220 px, konten sampai 1140), `hidden` (tanpa karakter, konten sampai 1330). Konten banyak → `small`, sangat banyak → `hidden`. Hook dan CTA biasanya `normal`.
- **Subtitle** = `SubtitleBand` dari `../../desk-world`, dirender sekali di root `<Nama>Video.tsx` dengan `y={SUBTITLE_Y}` (dari mode tiap scene). Dua baris di pil gelap, huruf 46 px, maksimal ±46 huruf per potongan, kata yang diucapkan putih penuh dan sisanya redup (tanpa oranye). Margin kiri dan kanan sama (`SAFE_RIGHT`), jadi tepat di tengah layar dan kolom tombol tidak menutupinya. Ejaan tampil lewat `DISPLAY_FIXES` di `config.ts` (`displayWords`): `SPOKEN` fonetis untuk suara ("Ei Ai", "Es Di El Si"), subtitle menampilkan "AI", "SDLC". Posisinya di bawah konten dan di atas karakter, selalu di atas `safeBottom`.
- **Konten** (`Frame` di `parts.tsx`) mulai di `ZONES.contentTop` dan berakhir di `contentBottom` mode scene itu. Lebar konten **sama di semua scene dan mode** (margin `SAFE_RIGHT` di kiri dan kanan, 780 px, sama dengan subtitle), jadi kartu tidak berubah lebar antar frame, tetap simetris di tengah, dan tidak tertutup kolom tombol kanan (mulai y ±1100). Rancang komponen untuk 780 px; visual SVG memakai `width="100%"` dengan `viewBox`.
- **Karakter** kakinya di `NARRATOR_FEET_Y` (1555), pindah 15 frame ease-out di awal scene; tinggi 0 = tidak dirender.
- **Footer** (logo dan handle, y 1825) tetap wajib tapi dianggap dekorasi karena bisa tertutup; jangan menaruh informasi penting atau CTA di sana.
- **Cek**: `reels-stills` memberi tint merah di zona tidak aman (bawah dan kolom kanan; `--plain` mematikannya). Subtitle, konten penting, dan karakter tidak boleh berada di area merah. `npm run validate:layout` memeriksa konsistensi mode (subtitle di atas `safeBottom`, konten di atas subtitle, subtitle tidak menimpa karakter).
- Scaffold `new-reels.mjs` sudah memuat semuanya (`NARRATOR` di config, `SubtitleBand` di root, `Frame` dari `scripts/templates/reels/frame.tsx.tmpl`). Rujukan: `src/videos/AiNativeSdlc`.

## Peta zona layout dan dunia meja (Reels narator)

Semua posisi vertikal Reels diturunkan dari `src/reelsLayout.ts` (`ZONES`: `headerBottom`, `contentTop`, `contentBottom`, `deskTop`, `captionTop`, `footerTop`, `safeBottom`; turunan `FEET_ON_DESK`, `KEYBOARD_TOP`, `FEET_ON_KEYBOARD`). Jangan menulis angka y sendiri di `scenes.tsx` atau `<Nama>Video.tsx`. `npm run validate:layout` (bagian `npm run lint`) memeriksa peta dan memberi peringatan untuk posisi tulis-tangan di zona atas atau caption di luar meja pada video yang mengimpor `reelsLayout`; video lama dilewati.

Komponen dunia meja di `src/desk-world/` (impor dari `../../desk-world`): `Desk`, `Mug`, `Lamp`, `Plant`, `Monitor`, `Keyboard` (tuts menyala per huruf), `Cabinet` (laci dengan `openFrame` dan `closeFrame` frame lokal), `Caption` (karaoke satu baris: `sceneStarts`, `words`, `lead`). Memakai frame lokal dan props, tanpa impor dari folder video. Contoh: ClaudeSetup.

## Daftar periksa Reels sebelum render

1. **Zona**: judul dan konten di bawah `contentTop`; tidak menimpa pita caption; karakter dan benda menapak di meja; tubuh dan lengan di dalam layar dan di luar braket sudut. `npm run validate:layout` bersih.
2. **Sorotan oranye**: tepat satu frasa atau kontrol per layar (tombol dan avatar biru primary).
3. **Variasi**: hero visual, latar, pose berbeda dari tetangga; cocok dengan storyboard yang disetujui.
4. **Naskah**: dibacakan keras dan terdengar mengalir, tidak terpotong-potong; urgency satu kalimat utuh yang dibayar scene sesudahnya di video yang sama (tanpa janji "bagian kedua" ke konten lain); sumber artikel disebut di hook dan caption; tanya ya/tidak ditutup kata benda; singkatan Inggris fonetis di `VO_TEXT`; istilah sering salah baca dicek lewat transkrip scribe.
5. **Voiceover**: satu scene dulu, `vo-check` tanpa catatan berat, baru sisanya; `vo-words` mengukur ulang `WORDS` sebelum cue dan caption dianggap benar (skill `reels-voiceover`).
6. **Subtitle**: dua baris di `SubtitleBand`, di luar tint merah `reels-stills` (bawah dan kolom kanan); konten banyak memakai mode `small` atau `hidden`; uji di aplikasi.
7. **Terakhir**: `npm run lint` bersih; `reels-stills`; subagent `reels-reviewer`; render penuh dan tonton sekali.

## Carousel: isi folder

Dibuat dengan `node scripts/new-carousel.mjs <Nama> "<Judul>" [--format B|C] [--variant quick-tips|walkthrough]` (kerangka slide `TODO` yang lolos validator; menolak judul Format B di luar 4-8 kata). Template di `scripts/templates/carousel`. `npm run validate` memberi peringatan selama masih ada `TODO`.

```
src/videos/<Nama>/
  carousel.content.ts     ekspor CAROUSEL: CarouselSpec
  <Nama>Carousel.tsx      ekspor <Nama>Carousel dan <NAMA>_CAROUSEL_SLIDES
```

Aturan isi dan tampilan di [carousel.md](carousel.md).

## Komposisi terdaftar otomatis

`src/Root.tsx` tidak perlu diubah. `src/compositions.ts` memindai `src/videos` dan mendaftarkan folder yang punya `<Nama>Video.tsx` atau `<Nama>Carousel.tsx` (nama berkas = nama folder) dan mengekspor `COMPOSITION` (skrip scaffold menulisnya):

```ts
import type { VideoComposition } from "../../compositions";

export const COMPOSITION: VideoComposition = {
  id: "<Nama>-Reels",          // carousel: "<Nama>-Carousel", video dialog: "<Nama>"
  component: <Nama>Video,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,                     // carousel: 1
  width: 1080,                 // video dialog: 1920
  height: 1920,                // carousel: 1350, video dialog: 1080
  defaultProps: { theme: "gh" },
};
```

Id kembar membuat Studio gagal ("Id komposisi kembar"). Satu-satunya pengecualian eksplisit di `Root.tsx`: folder `Characters` (CharacterRigDemo).

## Validator dan otomasi

- `npm run validate:structure` memeriksa semua folder di atas (jenis, berkas wajib dan terlarang, impor lintas folder, ekspor `config.ts`, 5 hashtag, `BrandFooter` sekali, `COMPOSITION`, bagian README). Pengecualian di `EXEMPT` di `scripts/validate-structure.mjs`; CharacterRigDemo dikecualikan (prototipe, bukan konten).
- `vo-lines.mjs` dan `vo-generate.mjs` mengenali jenis folder dari isinya (Reels = `config.ts` + `scenes.tsx`, Reels dialog = `config.ts` + `scenes.ts`, video dialog = `voiceover.ts`).
- **Hook** (`.claude/settings.json`, skrip di `.claude/hooks/`): `guard-files.py` menolak edit `.env.local` dan meminta konfirmasi untuk `voiceover.json`, `voiceover-files.ts`, `voiceover/*.mp3`, `src/assets/characters/ganjar/`; `lint-after-edit.py` menjalankan eslint pada `src/*.ts(x)` yang baru diubah. Permission `ask` untuk `vo-generate` dan `vo-words` (memakai kredit).
- **Skill** `reels-voiceover` (hanya dipanggil pengguna) dan `reels-stills`, selain `remotion-web-video`. **Subagent** `reels-reviewer` (read-only). **CI**: `.github/workflows/lint.yml` menjalankan `npm run lint` pada push ke `main` dan pull request.
