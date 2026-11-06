# Struktur file video

Aturan baku isi folder `src/videos/<Nama>/`. Berlaku untuk semua Reels baru (Format A dan C, narator Claude Code atau dialog), video dialog 16:9, dan carousel baru (Format B dan C). Nama file harus persis seperti di bawah, tanpa variasi. Rujukan Reels: `src/videos/PromptPanjang`. Rujukan carousel: `src/videos/ModelMurah`.

Ada empat jenis folder: **Reels** (narator Claude Code, 9:16), **Reels dialog** (dua karakter atau lebih bergantian bicara, 9:16, `new-reels.mjs --dialog`), **video dialog** (Ganjar dan Claude, kamera 2D, 16:9, `scripts/new-video.mjs`), dan **carousel**. Satu folder boleh memuat Reels dan carousel untuk topik yang sama, tapi tidak boleh mencampur Reels dengan Reels dialog atau video dialog. Jenis folder dikenali dari isinya: `carousel.content.ts` = carousel, `SceneRenderer.tsx` = video dialog, `config.ts` + `scenes.tsx` = Reels, `config.ts` + `scenes.ts` = Reels dialog.

## Nama

| Hal | Aturan | Contoh |
|---|---|---|
| Folder | PascalCase, 1-3 kata dari judul, tanpa angka urut atau kata sambung | `PromptPanjang`, bukan `PromptPanjangItuTandaMalas` |
| Id komposisi Reels | `<Nama>-Reels` | `PromptPanjang-Reels` |
| Id komposisi video dialog | `<Nama>` (tanpa akhiran) | `VueTutorial` |
| Id komposisi carousel | `<Nama>-Carousel` | `ModelMurah-Carousel` |
| Hasil render | `out/<Nama>-Reels.mp4`, `out/<Nama>-Carousel/` | |
| Id scene | huruf kecil, satu kata, Bahasa Indonesia atau istilah format | `hook`, `relate`, `shift`, `urgency`, `cara`, `closing`, `cta` |
| Komponen scene | `<Id>Scene`, huruf pertama id dikapitalkan | `HookScene`, `CaraScene` |

Untuk Format A, id scene wajib memuat `hook`, `relate`, `shift`, `urgency`, `closing`, `cta` (urutan itu). Scene tambahan disisipkan di antaranya dengan id satu kata (contoh `cara` di PromptPanjang).

## Reels: isi folder

Dibuat dengan `node scripts/new-reels.mjs <Nama> "<Judul>" [--scenes hook,relate,shift,urgency,closing,cta]`. Jangan buat folder dengan tangan: skrip menulis semua berkas di bawah dengan nama yang benar, menyalin `parts.tsx` dari PromptPanjang, dan menulis `COMPOSITION` di `<Nama>Video.tsx` supaya terdaftar otomatis. Template di `scripts/templates/reels`. Isi `SPOKEN` dan `CAPTION` di `config.ts` dan scene di `scenes.tsx` sesudahnya. Kalau `parts.tsx` PromptPanjang diperbarui, video baru otomatis memakai versi terbaru; video lama tidak ikut berubah.

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

Hanya berkas itu. Tidak boleh ada berkas lain: tidak ada satu berkas per scene (`HookScene.tsx`), `scenes.ts`, `scene.tsx`, `shared.tsx`, `visuals.tsx`, `voiceover.ts`, `Sfx.tsx`, atau sejenisnya. Komponen tambahan masuk `parts.tsx`.

**Tidak boleh mengimpor dari folder video lain** (`../<NamaLain>/...`). Yang dipakai lebih dari satu video dipindah ke `src/`: gerak bersama (`Enter`, `Pop`, `useSpringIn`, `shakeX`) ada di `src/motion.tsx`, footer di `src/BrandFooter.tsx`, latar di `src/Backdrop.tsx`. Impor dari `../../motion`.

### `config.ts`

Satu-satunya sumber teks dan waktu. Ekspor dengan nama persis ini:

- `FPS` (30), `LEAD` (jeda frame sebelum suara mulai), `TAIL` dan `CHARS_PER_SEC` (lokal, tidak diekspor).
- `SCENE_IDS` (`as const`) dan `type SceneId`.
- `SPOKEN: Record<SceneId, string>`: teks yang diucapkan. Singkatan Inggris ditulis fonetis ("Ei Ai").
- `CAPTION` dan `HASHTAGS` (tepat 5, set baku).
- `VO`: dari `voiceover.json` + `VO_FILES`; kalau klip belum ada, `file: null` dan durasi diperkirakan dari `CHARS_PER_SEC`.
- `at(id, frasa)`: detik sejak suara mulai saat frasa diucapkan.
- `SCENE_FRAMES`, `SCENE_START`, `TOTAL_FRAMES`, `MUSIC_FILE`.

Data khusus video (contoh `REPO_URL`) juga di sini.

### `scenes.tsx`

Satu `export const <Id>Scene: React.FC` per id, urut sesuai `SCENE_IDS`, tiap scene diawali komentar `// ---------- <n>. <Nama> ----------`. Cue ditulis sebagai frasa dari `SPOKEN` lewat `useCue(id).when(frasa)` (perkiraan dari posisi huruf). Boleh juga berupa detik dari timestamp kata ElevenLabs (scribe) kalau sudah diukur dari audio asli, karena lebih akurat; Haiku55 dan ModelTeam memakai cara ini. Kalau `SPOKEN` berubah, ukur ulang cue scene itu.

### `parts.tsx`

Komponen dan helper bersama untuk scene video ini: `cue`, `useCue`, `Frame`, `Headline`, `Accent`, `Chip`, `Card`, dan lain-lain. Disalin dari video rujukan, lalu disesuaikan.

### `<Nama>Video.tsx`

Mengekspor `<Nama>Video: React.FC<{ theme: string }>` dan meneruskan `TOTAL_FRAMES`. Isinya, berurutan: `Series` scene (peta `SCENES` dari id ke komponen), `Character` (Claude Code, ekspresi per scene di `FACES`), `BrandFooter` sekali di root, `Sound` (VO per scene di `SCENE_START + LEAD`, whoosh di awal scene, musik latar).

### `README.md`

Bagian wajib, urut: judul `# <Nama>` dan satu paragraf (judul konten, format, jumlah scene, id komposisi, sudut pandang, narator), daftar berkas, `## Voiceover` (status, suara, model, speed, perintah olah ulang), perintah render, `## Caption` (caption dan 5 hashtag).

### Voiceover

- ElevenLabs, suara Nilasari (`NPDHDOOQCSyifTJZOe6J`), model `eleven_multilingual_v2`, `speed` 1.2. Satu klip per scene, id klip = id scene.
- Klip mentah di `out/vo-raw/<Nama>/<id>.mp3` (tidak di-commit). Olah dengan `node scripts/vo-process.mjs <id> out/vo-raw/<Nama>/<id>.mp3 --hash <hash> --video <Nama>`.
- `voiceover.json` dimulai `{ "lines": {} }`. `voiceover-files.ts` dan folder `voiceover/` ditulis oleh `vo-process.mjs` saat klip pertama diolah, jadi untuk video yang belum bersuara folder `voiceover/` belum ada dan itu sah. Jangan diubah tangan.
- Alur otomatis: `node scripts/vo-lines.mjs --video <Nama>` menampilkan status tiap scene (`baru`, `berubah`, `ok`), lalu `node scripts/vo-generate.mjs --video <Nama>` men-generate hanya yang belum ada atau berubah, memotong senyap, menormalkan, dan mencatatnya. Sebelum memanggil API, jumlah huruf (≈ kredit) ditampilkan dan konfirmasi diminta. Butuh `ELEVENLABS_API_KEY` di environment atau `.env.local`. Hash = sha1 `voiceId|model|SPOKEN[id]`; mengganti suara, model, atau speed di `vo-lines.mjs` mengubah hash semua scene.

## Irama scene (Reels narator)

Pedoman dari riset blog vendor (ClipFlip, Splice, Shortzly, Opus Pro; bukan dokumentasi resmi Instagram atau TikTok, angkanya saling berbeda), jadi berlaku sebagai **peringatan**, bukan error. Uji dengan data Insights akun sendiri lalu sesuaikan.

- Tidak ada dead time: tiap ~4 detik harus ada hal baru di layar (objek masuk, sorotan pindah, ganti ekspresi, kartu baru). Kisaran sumber: cut 1-3 dtk, beat visual 5-8 dtk untuk narasi.
- Scene dengan suara lebih dari 8 detik (`BEAT_MAX_SCENE` di `scripts/validate-structure.mjs`) diberi peringatan. Pecah jadi beat di dalam scene lewat `useCue`, jangan dipotong jadi scene baru.
- Hook harus menahan scroll dalam 1-3 detik pertama; objek kunci tetap ditahan minimal 24 frame (0,8 dtk) agar terbaca.
- Completion rate lebih penting dari durasi. Reels 7-15 dtk untuk jangkauan, 30-60 dtk untuk simpan dan bagikan.
- Subtitle wajib (banyak penonton tanpa suara). Zona aman atas sekitar 250 px dan bawah sekitar 350 px (perkiraan; antarmuka aplikasi berubah).
- Implementasi subtitle Reels narator: komponen `Caption` di `parts.tsx` (contoh ClaudeSetup). Satu baris rata tengah, potongan maksimal 28 huruf, kata yang diucapkan putih penuh dan sisanya redup (tanpa oranye). Waktu kata dari `WORDS` di `config.ts`, diambil dari ElevenLabs scribe pada klip olahan, jadi dikerjakan setelah voiceover jadi. Posisi per scene (`CAPTION_Y`). Dua pilihan: di atas karakter (sekitar y 1235, di luar zona aman bawah, tapi berebut ruang dengan konten) atau di bawah karakter di tepi depan meja (sekitar y 1752, ClaudeSetup, rapi tapi berada di zona bawah yang kemungkinan tertutup nama akun dan caption postingan Instagram). Pilih per video dan uji di tampilan aplikasi sebelum upload.
- Pengecekan otomatis hanya durasi scene dari `voiceover.json`; jumlah beat visual dicek manual.

## Variasi visual antar scene (Reels narator)

Tiap scene harus terlihat beda dari scene di sebelahnya, supaya penonton merasa ada hal baru dan tidak sekadar mengganti teks di templat yang sama. Pedoman, dicek manual (belum ada validator).

- **Satu hero visual per scene**, jenisnya berbeda dari scene sebelum dan sesudahnya. Pilihan: angka besar atau counter, bar progres, kartu bertumpuk, grid atau daftar bercentang, blok terminal atau code, diagram alur berpanah, stempel atau badge, perbandingan dua kolom, kartu repo atau profil. Kartu bertumpuk bukan bawaan untuk semua scene.
- **Tidak ada dua scene berurutan dengan susunan sama** (tag, judul, lalu kartu bertumpuk). Ganti tata letak: hero di atas atau di tengah, judul kecil (`muted`) atau besar, satu elemen penuh lebar atau dua kolom.
- **Gerak masuk dibedakan**: arah (`x` dan `y` di `Enter`), urutan (serentak, bergantian, atau digambar), dan ukuran judul (`size`) tidak diulang di scene berurutan. Easing tetap `[0.2, 0.8, 0.2, 1]`, tanpa bounce.
- **Latar berganti antar scene**: `Frame` menerima `variant` (`ground` near-black, `dark` konteks terminal atau kode, `primary` biru primer gelap dari `Backdrop`). Jangan satu latar sepanjang video; selang-seling, dan jangan dua scene berurutan memakai latar sama. `sweep` hanya di hook dan scene kunci. Warna dan huruf tetap dari tema.
- **Posisi karakter berpindah**: tiap scene punya pose karakter (`POSES` di `<Nama>Video.tsx`: `x` tengah 0-1 dari lebar, `h` tinggi). Pose berpindah 0,5 dtk ease-out di awal scene. Pose tengah (besar) untuk hook dan CTA, kiri atau kanan (kecil) untuk scene padat. Jaga tubuh dan lengan di dalam layar dan di luar braket sudut: `x` sekitar 0,32 dan 0,68 untuk `h` 440; kaki tetap di atas footer.
- **Satu dunia, bukan hanya panel**: boleh membuat satu dunia konsisten (contoh meja kerja di ClaudeSetup: `Desk` di `Frame`, benda di `extras`) tempat karakter berinteraksi dengan benda sesuai isi scene. Scene perintah memakai monitor dan keyboard (tuts menyala per huruf, kaki karakter menginjak bergantian lewat clip `stomp`, suara `typing_bed`), scene daftar memakai rak laci (laci ditarik tepat saat frasanya diucapkan). Injakan memakai ease-out tajam, tanpa pantulan. Gaya kartun hanya dipakai pada scene yang punya aksi fisik, bukan di semua scene. Ekspresi karakter berganti mengikuti isi kalimat (`FACES` dengan `at(...)`).
- **Tetap berlaku**: satu sorotan oranye per layar, Poppins, kontras teks, zona aman atas dan bawah, ikon dari `src/icons.tsx`.
- **Cek cepat sebelum selesai**: tulis jenis hero tiap scene berurutan (contoh `hook: counter, relate: terminal, shift: diagram`). Kalau ada dua yang sama berdampingan, ubah salah satunya. Render beberapa `remotion still` per scene untuk memastikan.

## Reels dialog: isi folder

Dibuat dengan `node scripts/new-reels.mjs <Nama> "<Judul>" --dialog [--cast ganjar,robot] [--style rig|stickman] [--scenes hook,relate,shift,urgency,closing,cta]`. Pemeran 1-3 dari `ganjar`, `robot`, `claudecode` (bawaan `ganjar,robot`), gaya `rig` atau `stickman`. Pembicara tiap scene dibuat bergantian, isinya `TODO`. Template di `scripts/templates/dialog-reels`.

```
src/videos/<Nama>/
  README.md
  <Nama>Video.tsx       fitScenes + <DraftVideo>, ekspor <Nama>Video, TOTAL_FRAMES, COMPOSITION
  config.ts             META (judul, delivery "dialog", style), CAPTION, HASHTAGS, VO_MANIFEST
  scenes.ts             BASE_SCENES: data scene (latar, waktu, pemeran, teks layar, baris ucapan)
  voiceover.json
  voiceover-files.ts
  voiceover/<id-scene>-NN.mp3
```

- Mesin ada di `src/dialog-reels` (`DraftVideo`, `Stage`, `fitScenes`, `voiceover.ts`, `voices.json`). `DraftVideo` merender panggung, teks layar, subtitle baris yang sedang bicara, `BrandFooter` sekali di root, suara, whoosh, dan musik, jadi `<Nama>Video.tsx` tidak merender footer sendiri.
- Satu scene = `id` (huruf kecil, satu kata; Format A: hook, relate, shift, urgency, closing, cta), `seconds` (batas bawah), `backdrop` (`ruangKerja`, `kosong`, `luarRuang`), `time` (`siang`, `sore`, `malam`), `cast` (karakter, ekspresi, gerak, posisi), `onScreenText`, dan `lines` (`who`, `from` detik sejak scene mulai, `dur` perkiraan, `text` subtitle, `spoken` bila ucapan beda dari subtitle).
- Tampilan subtitle dipilih lewat `META.subtitle` di `config.ts`: `"chat"` (bawaan) atau `"caption"` (satu baris teks putih rata tengah, horizontal dan vertikal, di area bawah lantai). Whoosh antar scene bisa dimatikan lewat `META.sceneSfx: false` (bawaan menyala). Gerak caption lewat `META.captionMotion`: `"karaoke"` (bawaan; kata yang diucapkan disorot, yang sudah lewat agak redup, yang belum redup, dan ada penanda pembicara: titik berwarna per karakter dan nama kecil di atas teks) atau `"none"`. Waktu kata diperkirakan dari panjang huruf; isi `wordTimes` di baris (detik awal tiap kata sejak baris mulai, dari timestamp kata ElevenLabs) setelah voiceover jadi. Mode chat: Tiap baris ucapan jadi bubble dengan avatar (Ganjar kiri, biru primary; karakter lain kanan, putih). Riwayat tetap tampil sepanjang video, juga saat scene berganti; bubble aktif paling jelas, riwayat meredup dan memburam, dan bila ruang habis bubble paling atas memudar. Ekspresi avatar mengikuti ekspresi karakter saat baris itu diucapkan.
- Field tambahan scene: `tone` (`terang` bawaan, `biru` = wash biru primary dan kartu teks biru, `gelap` = kartu teks gelap; latar gelap tetap lewat `time: "malam"`), dan `inserts` (cutaway fullscreen: `promptKode`, `terminalError`, `muridBertanya`, `alarmProduction`, `kartuFollow`, `gitBlame`, `landingKelas`, `silabusBaru`; `from` dan `dur` detik sejak scene mulai, voiceover dan chat tetap jalan). Mesin ada di `src/dialog-reels/Inserts.tsx`.
- Field tambahan baris: `expressions` (ekspresi karakter sejak baris itu mulai, mis. `{ ganjar: "malu", claudecode: "serius" }`) dan `screenText` (teks layar sejak baris itu mulai; `*frasa*` = sorotan oranye, satu per layar). `onScreenText: ""` = tanpa teks layar di awal scene.
- `@logError` dan `@kodePrompt` sebagai baris di `screenText` = potongan log terminal (TypeError merah) atau prompt yang diketik dengan kodenya, di dalam kartu teks atas di bawah judul pada segmen itu; pengganti cutaway `terminalError` dan `promptKode`.
- `screenExtra` di scene = isi tambahan di dalam kartu teks layar atas, alternatif ringkas dari cutaway: `"profilFollow"` (logo, handle, tombol Follow yang berubah jadi "Following"; pengganti `kartuFollow`) dan `"infoKelas"` (nama kelas, harga, tombol Daftar; pengganti `landingKelas`).
- Latar `kelas`: latar polos dengan papan tulis di belakang karakter (`src/dialog-reels/Board.tsx`). Teks layar scene (`onScreenText` dan `screenText` per baris) tampil di papan, bukan di kartu atas. Papan diagram alur: baris `&alur|A|B|C` (kotak berurutan dengan panah yang digambar satu per satu, kotak terakhir hijau, `#teks` bilah info) dan papan garis waktu: baris `&garis|Awal|Titik jatuh|Akhir` (garis naik, jatuh ke titik merah, naik lagi). Papan percakapan: baris `$murid|teks` (kanan) dan `$ganjar|teks` (kiri, biru), opsional `@detik` di akhir = detik muncul sejak segmen mulai; pengganti cutaway `muridBertanya`. Papan dua kolom: baris `||Judul|tanda|keterangan` (tanda `ok` = centang hijau, `...` = menunggu abu-abu, `?` = tanda tanya oranye; keterangan opsional) tampil sebagai kartu berdampingan dengan lencana tanda di atas, dan baris `#teks` sebagai bilah info di dasar (angka `Rp ...` ditebalkan); segmen lanjutan (`screenText` per baris) langsung tampil tanpa mengulang animasi masuk. Teks dengan beberapa baris (`\n`) tampil sebagai daftar di papan: baris pertama judul, baris diawali `>` kutipan, sisanya butir bercentang yang muncul bergantian. Karakter berdiri; `cast` boleh memuat `scale` (pengali tinggi, mis. 1.4 untuk pengajar yang tampil sendirian) dan `enterFrom: "kiri" | "kanan"` dengan `enterAt` (karakter berdiri meluncur masuk 0,7 dtk, tidak berlaku untuk yang duduk di ruang kerja). Caption otomatis gelap di kelas siang karena lantainya terang.
- Gerak karakter per baris: `motions` (`{ ganjar: "point" }`; Ganjar `headTurn`, `point`, `startle`; Robot dan Claude Code `armGesture`, `surprise`, `walk`) dan `motionAt` (tunda dalam detik sejak baris mulai, untuk frasa di tengah baris). Tanpa `motions`, `motion` di `cast` dimainkan sekali di baris pertama karakter itu.
- Kamera panggung: `META.camera` = `"ikuti"` (zoom pelan dan geser ke karakter yang bicara, pindah 0,6 dtk tiap giliran) atau `"diam"` (bawaan). `zoom: { from, to, focus? }` di scene = punch-in atau zoom out ease-out sepanjang scene, menggantikan kamera ikuti. Kamera hanya menggerakkan panggung; teks layar, cutaway, dan caption tidak ikut. Mesin: `src/dialog-reels/Camera.tsx`.
- Variasi audio di `META`: `speakerPop` (pop pendek tiap giliran bicara ganti), `whooshVariants` (whoosh lebih rendah, laju 0,75, saat latar berganti), `sceneSfx: false` (matikan whoosh). Per baris: `sfx: [{ name, at?, volume? }]` (`name` = berkas di `public/sfx/synth` tanpa `.wav`, `at` detik sejak baris mulai). Per scene: `music` (pengali volume musik latar selama scene, berpindah halus).
- Variasi panggung: `META.idleMotion` (napas dan miring tipis pada karakter), per baris `reactions: [{ who, expression, at }]` (ekspresi berganti di tengah baris, `at` detik sejak baris mulai), dan gerak `walk` lewat `motions`.
- Lampu sorot per scene: `spotlight: true` (tepi layar digelapkan dan kerucut cahaya hangat dari atas ke papan dan karakter; paling cocok di latar malam). Gerak `tunjuk` untuk Robot dan Claude Code = lengan terangkat dan ditahan, tanpa melambai; di latar `kelas` sebuah tongkat penunjuk tumbuh dari ujung lengan ke dasar papan selama gerak itu (lengan rig pendek, jadi tongkat yang membuat gerak terbaca).
- Dekorasi dinding per scene: `decor: [{ kind, at }]` (`laptopApp` = jendela aplikasi dengan UI yang menyala, `chipMengambang` = tiga chip kecil melayang; `at` detik sejak scene mulai), untuk mengisi ruang kosong antara kartu atas dan karakter. Mesin: `src/dialog-reels/Decor.tsx`.
- Variasi tata letak per scene: `transisi` (`potong` bawaan, `geser`, `wipe`, `flash`), `cardAlign` (`kiri`, `tengah`, `kanan`), `cardTilt` (derajat, tampilan stiker), dan `cardMotion: "kata"` (judul muncul kata demi kata). Mesin: `SceneTransitionIn` dan `KineticText` di `DraftVideo.tsx`.
- `npm run validate:structure` memeriksa isi `scenes.ts`: urutan baris, cutaway (jenis, tidak tumpang tindih, tidak melewati akhir scene), ekspresi, tanda sorotan, nada, dan teks TODO. Durasi Reels dialog tidak dibatasi.
- Ekspresi: netral, senang, sedih, kaget, bingung, mikir, kesal, marah, serius, malu, mataTertutup. Gerak: Ganjar `headTurn`, `point`, `startle`; Robot dan Claude Code `armGesture`, `surprise`, `walk`.
- Voiceover per baris ucapan, id baris = id scene + nomor urut (`hook-01`). Suara per karakter dari `src/dialog-reels/voices.json`: Ari Eko untuk Ganjar, Nilasari untuk Robot dan Claude Code; model `eleven_multilingual_v2`, `speed` 1.2. Alur: `node scripts/vo-lines.mjs --video <Nama>` lalu `node scripts/vo-generate.mjs --video <Nama>` (minta konfirmasi sebelum memanggil API). Durasi scene mengikuti audio. Hash = sha1 `voiceId|model|teks`.
- Karakter Ganjar sudah final (jangan ubah tampilannya); Reels narator tetap memakai Claude Code. Reels dialog hanya untuk konten yang memang berupa percakapan.

## Video dialog: isi folder

Dibuat dengan `node scripts/new-video.mjs <Nama> "<Judul>"`. Jangan buat folder dengan tangan.

```
src/videos/<Nama>/
  README.md
  <Nama>Video.tsx       TransitionSeries scene, ekspor <NAMA>_FRAMES
  scenes.tsx            data scene (SCENES): seconds, time, shots, actors, lines, inserts
  SceneRenderer.tsx     disalin dari VueTutorial
  world.tsx             disalin dari VueTutorial (ruang kerja, CAM, Keyed)
  cards.tsx             disalin dari VueTutorial
  sfxTypes.ts           disalin dari VueTutorial
  <Nama>Sfx.tsx         efek suara dan musik, dibuat otomatis dari data scene
  voiceover.ts          disalin dari VueTutorial (suara Ari Eko untuk Ganjar, Nilasari untuk Claude, eleven_v4)
  voiceover.json
  voiceover-files.ts
  voiceover/<id-baris>.mp3
```

- Id baris voiceover = id scene + nomor urut dua angka (`hook-01`). Klip mentah di `out/vo-raw/<id>.mp3`, olah dengan `vo-process.mjs ... --video <Nama>`.
- Daftar dan status baris: `node scripts/vo-lines.mjs --video <Nama>`; yang perlu di-generate: tambahkan `--pending`.
- README memuat struktur, cara mengubah scene, dan alur voiceover (lihat `src/videos/VueTutorial/README.md`).
- Komposisi: `fps={30} width={1920} height={1080}`, id `<Nama>`.
- Berkas umum disalin dari VueTutorial setiap kali video baru dibuat, jadi perubahan pada berkas itu cukup dilakukan di VueTutorial, lalu video dialog lama disalin ulang bila perlu.
- Pengecualian: VueTutorial sendiri memakai nama `VueSfx.tsx` (bukan `VueTutorialSfx.tsx`) dan `VUE_TUTORIAL_FRAMES`. Itu sumber salinan, jangan diganti nama.

## Carousel: isi folder

Dibuat dengan `node scripts/new-carousel.mjs <Nama> "<Judul>" [--format B|C] [--variant quick-tips|walkthrough]`. Skrip menulis kedua berkas di bawah (kerangka slide dengan teks `TODO` yang lolos validator), dan menolak judul Format B di luar 4-8 kata. Template di `scripts/templates/carousel`. `npm run validate` memberi peringatan selama masih ada teks `TODO`.

```
src/videos/<Nama>/
  carousel.content.ts     ekspor CAROUSEL: CarouselSpec
  <Nama>Carousel.tsx      ekspor <Nama>Carousel dan <NAMA>_CAROUSEL_SLIDES
```

Aturan isi dan tampilan ada di [carousel.md](carousel.md). Kalau satu topik punya Reels dan carousel, keduanya berbagi folder yang sama.

## Mendaftarkan komposisi (otomatis)

`src/Root.tsx` tidak perlu diubah. `src/compositions.ts` memindai `src/videos` dan mendaftarkan setiap folder yang punya `<Nama>Video.tsx` atau `<Nama>Carousel.tsx` (nama berkas harus sama dengan nama folder) dan mengekspor `COMPOSITION`:

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

Id kembar membuat Studio gagal dengan pesan "Id komposisi kembar". Skrip scaffold menulis blok ini otomatis. Satu-satunya pengecualian yang masih eksplisit di `Root.tsx` adalah folder `Characters` (CharacterRigDemo).

## Status kepatuhan (3 November 2026)

`npm run validate:structure` memeriksa semua folder di atas (jenis folder, berkas wajib dan terlarang, impor lintas folder, ekspor `config.ts`, 5 hashtag, `BrandFooter` sekali, `COMPOSITION` dengan id yang benar, bagian README). Pengecualian ada di daftar `EXEMPT` di `scripts/validate-structure.mjs`.

Sesuai aturan: PromptPanjang, ClaudeMem, ReviewKodeAI, Haiku55, ModelTeam (Reels); ModelMurah, JuniorHilang (carousel); VueTutorial (dialog, kecuali nama Sfx di atas).

Dihapus 3 November 2026 karena tidak dipakai: ChatbotVsAIAgentPahamiBedanya, KurikulumAIEngineerGratis542PelajaranDar, ProgrammerBodoh, SejarahAIStory, SejarahAIStoryReels, AgenBodoh (Reels dan carousel), ClaudeMd, GratisMurah, OpenCode9Router, AIAgent, ClaudeLoop, FileDibajak, IzinPagar, PenulisUI, SejarahAI, SejarahAIV2, TigaFrameworkFrontend, TokenTips.

Mesin Reels dialog ada di `src/dialog-reels/` (dulu DraftKit). `Stage` dan `types` juga dipakai stiker karakter carousel.

Dikecualikan dari validator: CharacterRigDemo (prototipe karakter untuk Studio, bukan konten video).

`vo-lines.mjs` dan `vo-generate.mjs` mendukung Reels, Reels dialog, dan video dialog; polanya dikenali dari isi folder (Reels = `config.ts` + `scenes.tsx`, Reels dialog = `config.ts` + `scenes.ts`, tanpa `voiceover.ts`).
