# Reels dialog dan video dialog

Dibaca hanya saat membuat atau mengubah **Reels dialog** (9:16, dua karakter atau lebih bergantian bicara) atau **video dialog** (16:9, Ganjar dan Claude). Aturan umum folder, nama, dan komposisi ada di [struktur-video.md](struktur-video.md). Rujukan Reels dialog: `src/videos/JagoDikit`. Rujukan video dialog: `src/videos/VueTutorial`.

Reels dialog hanya untuk konten yang memang berupa percakapan, atas permintaan. Narator Reels biasa tetap Claude Code. Tampilan Ganjar final.

## Reels dialog: isi folder

Dibuat dengan `node scripts/new-reels.mjs <Nama> "<Judul>" --dialog [--cast ganjar,robot] [--style rig|stickman|block] [--scenes ...]`. Pemeran 1-3 dari `ganjar`, `robot`, `claudecode` (bawaan `ganjar,robot`). Pembicara tiap scene bergantian, isinya `TODO`. Template di `scripts/templates/dialog-reels`.

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

### Gaya visual (`--style`)
- `rig` (bawaan): rig 2D. `stickman`: gambar garis, latar sketsa. `block`: kubus CSS 3D (`GanjarBlock`, `RobotBlock`, `ClaudeCodeBlock`) di atas latar motion graphic yang sama dengan rig; tanpa backdrop 3D, karena backdrop block pernah membuat Studio crash.
- **Bawaan scaffold block** (`--style block`): latar `komputer` malam dengan `tokenBack` placeholder di tiap scene, `subtitle: "caption"`, dan `shots: "bicara"` di `config.ts`. Jenis shot per baris, gesture, dan isi layar tinggal diisi atau diubah per scene. Karakter block sudah berkepala 0,8 dan berdepth 7 (`HEAD_SCALE`, `HEAD_DEPTH`), lengan ramping (`ARM_W`, `ARM_LEN`), zoom medium Ganjar 1,8 dan Claude 1,7 (`SHOT_ZOOM`), `pitch` low/high angle badan sekotak dikali 0,6 (`pitchFor`). Rujukan: `src/videos/TokenHabis`.
- Block: `motion` dan `motions` per baris memakai ke-13 nama gesture stickman (`lambai`, `angkatTangan`, `tunjuk`, `sorak`, `menyerah`, `angkatBahu`, `facepalm`, `mikir`, `garukKepala`, `tepuk`, `pinggang`, `mengetik`, `netral`). Tanpa siku, jadi ditiru dengan lengan lurus (ke samping atau ke depan), badan atas condong, kepala miring/menoleh/mengangguk, dan badan terangkat (`blockPoseAt` di `shared/gestures.ts`). Gerak putar (bukan gesture lengan, tidak mengganti gesture yang berjalan): `putar` = satu putaran penuh 1 dtk, `membelakangi` = berbalik 180° dalam 0,5 dtk dan bertahan, `hadap` = kembali menghadap (`turnYaw` di `Stage.tsx`). Pindah gesture dihaluskan 0,3 dtk; gesture bertahan sampai baris berikutnya mengganti. Badan block berputar (`yaw`): pendengar menoleh ke pembicara (34°), pembicara sedikit lebih ke kamera (10°), berpindah 0,4 dtk tiap giliran (`blockYaw` di `Stage.tsx`). Ekspresi berpindah langsung. Ganjar block berkedip tiap 3,4 dtk dan mulutnya bergerak saat bicara; Kaki ikut bergerak: berat badan berpindah pelan saat diam, dan tiap gesture punya sikap kaki (sorak melompat dan membuka kaki, tepuk melangkah bergantian, mikir menyilang, pinggang membuka kaki). Robot dan Claude Code, yang lengan dan kakinya pendek, juga menggerakkan badan (condong, miring, melompat kecil; `compactPose`) dan kakinya dibesarkan 1,6x. Mereka memantul saat bicara; lengan Claude Code pendek (proporsi asli, tidak dipanjangkan karena terlihat aneh), jadi gerak lengannya halus. Ganjar berdiri di balik meja (kaki terpotong meja), bukan duduk. Tanpa `clips` rig dan tongkat penunjuk kelas.
- Cek dengan `npx remotion still` lewat CLI dulu; Studio memuat banyak kubus 3D sekaligus.

### Latar `token` (`TokenBack.tsx`)
Latar polos dengan tiga lapis datar samar, untuk konten soal limit atau token AI: warna mood (`alarm`, `gelap`, `tenang`, `terang`, `brand`), meter token (bar `TOKEN n%` terkuras atau terisi, label kecil di bawahnya), dan baris kode semu yang mengalir pelan lalu membeku dengan pesan `rate limit exceeded`. Data di `tokenBack` per scene: `mood`, `level: [dari, ke]` (0-1, berubah mulai `at` selama `sec`), `label`, `code` (`mengalir` atau `beku`), `freezeAt` (detik), `blink`. Tanpa oranye dan tanpa 3D; ikut terskala bersama latar saat kamera zoom, jadi di close-up hanya sebagian terlihat (meter jelas di wide dan medium). Referensi: `src/videos/TokenHabis`.

### Latar `komputer` (`ComputerBack.tsx`)
Karakter berdiri di atas keyboard lebar (trapesium lima baris tuts, sisi dekat melewati tepi kanvas; kaki di `COMPUTER_FLOOR_Y` 1500, bukan 1400 seperti latar polos) dan di belakangnya ada monitor besar bergaya all-in-one (bezel, layar, leher, alas oval) yang bertumpu di meja (`DESK_TOP`). Semua angka posisi di bagian atas `ComputerBack.tsx`. Isi layar = latar `token`: pakai `tokenBack` yang sama (meter, baris kode, mood), dipasang di dalam layar lewat `TokenLayout`. Datar, samar, tanpa oranye dan tanpa 3D. Tuts menyala bergantian (3 ketukan terakhir, 9 ketuk/dtk, makin redup) selama ada baris bicara. Zoom kamera ikut memperbesar monitor dan keyboard, jadi di close-up hanya sebagian terlihat; komposisi penuh terbaca di `wide`, `reveal`, dan `medium` yang lebar. Referensi: `src/videos/TokenHabis`.

### Data scene
- Scene = `id` (satu kata; Format A: hook, relate, shift, urgency, closing, cta), `seconds` (batas bawah), `backdrop` (`ruangKerja`, `kosong`, `luarRuang`, `kelas`, `token`, `komputer`), `time` (`siang`, `sore`, `malam`), `cast` (karakter, ekspresi, gerak, posisi), `onScreenText`, `lines`.
- Baris = `who`, `from` (detik sejak scene mulai), `dur` (perkiraan), `text` (subtitle), `spoken` (bila ucapan beda dari subtitle).
- Tambahan scene: `tone` (`terang` bawaan, `biru`, `gelap`; latar gelap lewat `time: "malam"`), `inserts` (cutaway fullscreen: `promptKode`, `terminalError`, `muridBertanya`, `alarmProduction`, `kartuFollow`, `gitBlame`, `landingKelas`, `silabusBaru`; `from` dan `dur` detik sejak scene mulai; mesin `Inserts.tsx`), `screenExtra` (`"profilFollow"`, `"infoKelas"`: isi tambahan di kartu atas, pengganti `kartuFollow` dan `landingKelas`), `zoom: { from, to, focus? }`, `spotlight: true` (tepi digelapkan, kerucut cahaya; cocok malam), `decor: [{ kind, at }]` (`laptopApp`, `chipMengambang`; `Decor.tsx`), `music` (pengali volume musik per scene).
- Tambahan baris: `expressions` (mis. `{ ganjar: "malu" }`), `screenText` (`*frasa*` = sorotan oranye, satu per layar; `onScreenText: ""` = tanpa teks awal), `reactions: [{ who, expression, at }]`, `motions` dan `motionAt`, `sfx: [{ name, at?, volume? }]` (`name` = berkas di `public/sfx/synth` tanpa `.wav`), `wordTimes` (detik awal tiap kata dari scribe).
- `@logError` dan `@kodePrompt` sebagai baris `screenText` = log terminal merah atau prompt yang diketik, di kartu atas; pengganti cutaway `terminalError` dan `promptKode`.
- Ekspresi: netral, senang, sedih, kaget, bingung, mikir, kesal, marah, serius, malu, mataTertutup. Gerak: Ganjar `headTurn`, `point`, `startle`; Robot dan Claude Code `armGesture`, `surprise`, `walk`, `tunjuk` (lengan terangkat dan ditahan; di latar `kelas` tumbuh tongkat penunjuk, karena lengan rig pendek). Tanpa `motions`, `motion` di `cast` dimainkan sekali di baris pertama karakter itu.

### Subtitle dan opsi `META`
- `META.subtitle`: `"caption"` (bawaan video baru: satu baris rata tengah di area bawah lantai) atau `"chat"` (bubble dengan avatar, Ganjar kiri biru, lainnya kanan putih; riwayat tetap tampil, meredup, yang paling atas memudar bila ruang habis). Pilih per video; `"chat"` untuk konten yang memang berupa percakapan.
- `META.captionMotion`: `"karaoke"` (bawaan; kata diucapkan disorot, penanda pembicara berupa titik berwarna dan nama kecil) atau `"none"`. Waktu kata diperkirakan dari panjang huruf sampai `wordTimes` diisi.
- `META.camera`: `"diam"` (bawaan) atau `"ikuti"` (zoom pelan ke pembicara, pindah 0,6 dtk). Kamera hanya menggerakkan panggung, bukan teks layar, cutaway, atau caption (`Camera.tsx`).
- `META.shots`: `"bicara"` = potongan gambar per pembicara (bukan zoom kamera): layar hanya menampilkan karakter yang sedang bicara, di tengah dan lebih besar (`CLOSEUP_BLOCK` di `Stage.tsx`), menoleh 16° ke arah lawan bicara, potong langsung saat giliran ganti dan bertahan di pembicara terakhir saat jeda. Hanya gaya `block`, latar selain `ruangKerja`. Ekspresi dan gerak pendengar tidak terlihat; `reactions` ke pendengar tidak tampil. Bawaan mati.
- Jenis shot per baris (`shot` di `DraftLine`, gaya `block`, latar selain `ruangKerja`; `push: true` = zoom in 15% pelan selama baris): potong langsung antar baris, tanpa `shot` jatuh ke `META.shots`. Dunia = dua karakter di slot biasa, kamera 2D menata titik subjek ke SCREEN (di antara kartu atas dan caption). Zoom dilakukan lewat ukuran karakter (`mapActor`), bukan CSS scale, supaya kubus 3D tetap tajam. Jenis: `wide` (dua karakter), `medium`, `closeUp`, `extremeCloseUp` (+ goyang 3 px), `dutch` (close-up miring 7°), `lowAngle` (pandangan dari bawah, `pitch` 14), `highAngle` (dari atas, `pitch` -32), `birdsEye` (dua karakter dari atas, `pitch` -62), `overShoulder` (pendengar dari belakang di tepi depan, pembicara menghadap kamera), `pov` (medium, menghadap kamera, tanpa goyang), `reveal` (mulai extreme close-up, mundur ke wide 2,6 dtk). Bisa berganti di tengah baris: `shot: [{ at: 0, kind: "wide" }, { at: 3, kind: "birdsEye" }]`. Zoom per karakter di `SHOT_ZOOM`, `pitch` ada di `GanjarBlock`, `RobotBlock`, `ClaudeCodeBlock` (prop `pitch`). Tracking tidak ada (latar polos).
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
