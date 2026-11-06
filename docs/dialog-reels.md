# Reels dialog dan video dialog

Dibaca hanya saat membuat atau mengubah **Reels dialog** (9:16, dua karakter atau lebih bergantian bicara) atau **video dialog** (16:9, Ganjar dan Claude). Aturan umum folder, nama, dan komposisi ada di [struktur-video.md](struktur-video.md). Rujukan Reels dialog: `src/videos/JagoDikit`. Rujukan video dialog: `src/videos/VueTutorial`.

Reels dialog hanya untuk konten yang memang berupa percakapan, atas permintaan. Narator Reels biasa tetap Claude Code. Tampilan Ganjar final.

## Reels dialog: isi folder

Dibuat dengan `node scripts/new-reels.mjs <Nama> "<Judul>" --dialog [--cast ganjar,robot] [--style rig|stickman] [--scenes ...]`. Pemeran 1-3 dari `ganjar`, `robot`, `claudecode` (bawaan `ganjar,robot`). Pembicara tiap scene bergantian, isinya `TODO`. Template di `scripts/templates/dialog-reels`.

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

Mesin di `src/dialog-reels` (`DraftVideo`, `Stage`, `fitScenes`, `voiceover.ts`, `voices.json`). `DraftVideo` merender panggung, teks layar, subtitle, `BrandFooter` sekali di root, suara, whoosh, dan musik, jadi `<Nama>Video.tsx` tidak merender footer sendiri.

### Data scene
- Scene = `id` (satu kata; Format A: hook, relate, shift, urgency, closing, cta), `seconds` (batas bawah), `backdrop` (`ruangKerja`, `kosong`, `luarRuang`, `kelas`), `time` (`siang`, `sore`, `malam`), `cast` (karakter, ekspresi, gerak, posisi), `onScreenText`, `lines`.
- Baris = `who`, `from` (detik sejak scene mulai), `dur` (perkiraan), `text` (subtitle), `spoken` (bila ucapan beda dari subtitle).
- Tambahan scene: `tone` (`terang` bawaan, `biru`, `gelap`; latar gelap lewat `time: "malam"`), `inserts` (cutaway fullscreen: `promptKode`, `terminalError`, `muridBertanya`, `alarmProduction`, `kartuFollow`, `gitBlame`, `landingKelas`, `silabusBaru`; `from` dan `dur` detik sejak scene mulai; mesin `Inserts.tsx`), `screenExtra` (`"profilFollow"`, `"infoKelas"`: isi tambahan di kartu atas, pengganti `kartuFollow` dan `landingKelas`), `zoom: { from, to, focus? }`, `spotlight: true` (tepi digelapkan, kerucut cahaya; cocok malam), `decor: [{ kind, at }]` (`laptopApp`, `chipMengambang`; `Decor.tsx`), `music` (pengali volume musik per scene).
- Tambahan baris: `expressions` (mis. `{ ganjar: "malu" }`), `screenText` (`*frasa*` = sorotan oranye, satu per layar; `onScreenText: ""` = tanpa teks awal), `reactions: [{ who, expression, at }]`, `motions` dan `motionAt`, `sfx: [{ name, at?, volume? }]` (`name` = berkas di `public/sfx/synth` tanpa `.wav`), `wordTimes` (detik awal tiap kata dari scribe).
- `@logError` dan `@kodePrompt` sebagai baris `screenText` = log terminal merah atau prompt yang diketik, di kartu atas; pengganti cutaway `terminalError` dan `promptKode`.
- Ekspresi: netral, senang, sedih, kaget, bingung, mikir, kesal, marah, serius, malu, mataTertutup. Gerak: Ganjar `headTurn`, `point`, `startle`; Robot dan Claude Code `armGesture`, `surprise`, `walk`, `tunjuk` (lengan terangkat dan ditahan; di latar `kelas` tumbuh tongkat penunjuk, karena lengan rig pendek). Tanpa `motions`, `motion` di `cast` dimainkan sekali di baris pertama karakter itu.

### Subtitle dan opsi `META`
- `META.subtitle`: `"caption"` (bawaan video baru: satu baris rata tengah di area bawah lantai) atau `"chat"` (bubble dengan avatar, Ganjar kiri biru, lainnya kanan putih; riwayat tetap tampil, meredup, yang paling atas memudar bila ruang habis). Pilih per video; `"chat"` untuk konten yang memang berupa percakapan.
- `META.captionMotion`: `"karaoke"` (bawaan; kata diucapkan disorot, penanda pembicara berupa titik berwarna dan nama kecil) atau `"none"`. Waktu kata diperkirakan dari panjang huruf sampai `wordTimes` diisi.
- `META.camera`: `"diam"` (bawaan) atau `"ikuti"` (zoom pelan ke pembicara, pindah 0,6 dtk). Kamera hanya menggerakkan panggung, bukan teks layar, cutaway, atau caption (`Camera.tsx`).
- `META.sceneSfx: false` mematikan whoosh antar scene (bawaan menyala). `speakerPop` (pop tiap giliran ganti), `whooshVariants` (whoosh lebih rendah saat latar berganti), `idleMotion` (napas dan miring tipis).
- Tata letak per scene: `transisi` (`potong` bawaan, `geser`, `wipe`, `flash`), `cardAlign` (`kiri`, `tengah`, `kanan`), `cardTilt` (derajat), `cardMotion: "kata"` (judul muncul kata demi kata). Mesin: `SceneTransitionIn` dan `KineticText` di `DraftVideo.tsx`.

### Latar `kelas` (papan tulis, `Board.tsx`)
Teks layar scene tampil di papan, bukan di kartu atas. Karakter berdiri; `cast` boleh memuat `scale` (mis. 1.4 untuk pengajar sendirian) dan `enterFrom: "kiri" | "kanan"` dengan `enterAt` (meluncur masuk 0,7 dtk; tidak berlaku untuk yang duduk di ruang kerja). Caption otomatis gelap di kelas siang. Format baris papan:
- `&alur|A|B|C`: kotak berurutan dengan panah digambar satu per satu, kotak terakhir hijau; `#teks` = bilah info.
- `&garis|Awal|Titik jatuh|Akhir`: garis naik, jatuh ke titik merah, naik lagi.
- `$murid|teks` (kanan) dan `$ganjar|teks` (kiri, biru), opsional `@detik` di akhir = detik muncul sejak segmen mulai; pengganti `muridBertanya`.
- `||Judul|tanda|keterangan`: kartu berdampingan, tanda `ok` = centang hijau, `...` = menunggu abu-abu, `?` = tanda tanya oranye. `#teks` = bilah info di dasar (angka `Rp ...` ditebalkan). Segmen lanjutan langsung tampil tanpa animasi masuk ulang.
- Teks beberapa baris (`\n`) = daftar: baris pertama judul, baris diawali `>` kutipan, sisanya butir bercentang bergantian.

### Keputusan tampilan (dari JagoDikit)
- Cutaway fullscreen tersedia tapi pakai seperlunya; layar penuh yang menutup karakter dihindari. Info singkat ke kartu atas (`screenExtra`, `@logError`, `@kodePrompt`) atau papan tulis.
- Kartu teks atas rata tengah dan tegak, lebar mengikuti isi. Tanpa miring dan rata kiri atau kanan, kecuali diminta.
- Satu sorotan oranye per layar. Titik jatuh merah, centang hijau, tanda tanya oranye gelap. Teks yang sama tidak tampil dua kali tanpa alasan.
- Latar bervariasi antar scene (siang, sore, malam, ruang kerja, kelas).
- Tanpa zoom kamera dan tanpa transisi (potong langsung), kecuali diminta. Ease-out `[0.2, 0.8, 0.2, 1]`, tanpa bounce, spring, atau shake. Whoosh antar scene menyala.
- Durasi tidak dibatasi 60 detik (batas itu hanya untuk Reels Format A narator). Validator tidak memberi peringatan durasi untuk Reels dialog.
- `npm run validate:structure` memeriksa `scenes.ts`: urutan baris, cutaway (jenis, tidak tumpang tindih, tidak melewati akhir scene), ekspresi, tanda sorotan, nada, teks TODO.

### Voiceover Reels dialog
- Satu klip per baris ucapan, id = id scene + nomor urut (`hook-01`). Suara dari `voices.json`: Ari Eko untuk Ganjar, Nilasari untuk Robot dan Claude Code. Bawaan mesin `eleven_multilingual_v2`, `speed` 1.2.
- Video baru memakai `VO_SETTINGS = { model: "eleven_v4", speed: null }` dengan tag emosi per baris (`eleven_v4` mengabaikan `speed`). Klip terlalu cepat diperlambat dengan ffmpeg `atempo`, bukan generate ulang.
- Setelah voiceover jadi, ukur ulang waktu baris, kata (`wordTimes`), cutaway, dan sfx dari audio asli (`silencedetect`).
- Alur: `node scripts/vo-lines.mjs --video <Nama>` lalu `node scripts/vo-generate.mjs --video <Nama>` (minta konfirmasi jumlah huruf dan kredit). Durasi scene mengikuti audio. Hash = sha1 `voiceId|model|teks`.

### Cara kerja
Usulkan daftar ide dulu dan tunggu dipilih sebelum mengubah visual yang berdampak luas. Fitur mesin baru dibuat sebagai opsi per video (bawaan mati) dan didokumentasikan di berkas ini. Commit dipecah per scope: mesin (`src/dialog-reels`, validator, docs) dulu, lalu isi video.

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
  voiceover.ts          disalin dari VueTutorial (Ari Eko untuk Ganjar, Nilasari untuk Claude, eleven_v4)
  voiceover.json
  voiceover-files.ts
  voiceover/<id-baris>.mp3
```

- Id baris voiceover = id scene + nomor urut dua angka (`hook-01`). Klip mentah di `out/vo-raw/<id>.mp3`, olah dengan `vo-process.mjs ... --video <Nama>`. Status baris: `vo-lines.mjs --video <Nama>` (`--pending` = yang perlu di-generate).
- README memuat struktur, cara mengubah scene, dan alur voiceover (lihat `src/videos/VueTutorial/README.md`).
- Komposisi: `fps={30} width={1920} height={1080}`, id `<Nama>`.
- Berkas umum disalin dari VueTutorial tiap video baru. Ubah di VueTutorial, lalu salin ulang ke video lama bila perlu.
- Pengecualian: VueTutorial memakai `VueSfx.tsx` dan `VUE_TUTORIAL_FRAMES`. Itu sumber salinan, jangan diganti nama.
