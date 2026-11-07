# Reels block

Dibaca hanya saat membuat atau mengubah **Reels block**: dialog karakter block (kubus CSS 3D) di dunia diorama, 9:16, fokus pada sudut kamera. Aturan folder umum ada di [struktur-video.md](struktur-video.md); Reels dialog biasa (rig, stickman, block di latar motion graphic) ada di [dialog-reels.md](dialog-reels.md). Rujukan: `src/videos/DioramaDemo` (prototipe).

Reels block adalah jenis folder sendiri, terpisah dari Reels dialog. Mesinnya di `src/block-reels`, scaffold-nya `node scripts/new-block.mjs`. Hanya atas permintaan, untuk konten yang memang berupa percakapan. Narator Reels biasa tetap Claude Code rig 2D.

Semua latar Reels block bersuasana **malam** (keputusan: tampilan seragam jam malam).

## Beda dari Reels dialog
- **Tanpa BrandFooter dan tanpa watermark.** Pengecualian eksplisit dari aturan "BrandFooter di setiap video" di CLAUDE.md. `validate:structure` menolak `<BrandFooter` di `<Nama>Video.tsx` jenis ini. Branding lewat akun dan caption posting.
- **Semua pemeran block.** Tidak ada pilihan gaya `rig` atau `stickman`.
- **Dunia diorama**, bukan latar motion graphic: lapisan datar di kedalaman berbeda, kamera menggeser dan memperbesar tiap lapisan dengan faktor paralaks sendiri, latar jauh dan depan di-blur seperti kedalaman bidang. Kesan 3D tanpa render 3D penuh (backdrop kubus 3D pernah membuat Studio crash). Karakter diperbesar lewat tinggi, bukan CSS scale, supaya kubus tetap tajam.
- **Caption di bawah** memakai komponen Reels dialog (`LineCaption` di `src/dialog-reels/Caption.tsx`, diekstrak dari `DraftVideo`): mode `baris`: ucapan dipecah jadi baris pendek (maks 31 huruf, dipecah di tanda baca dan dibagi rata bila terlalu panjang) yang tampil satu per satu mengikuti kata pertamanya diucapkan, tanpa redup per kata; penanda pembicara (titik dan nama), tanpa pil. Mode `karaoke` (sorot per kata, seluruh kalimat tampil) tetap ada di Reels dialog. Kotak `CAPTION_BOX` (pusat teks y ≈ 1640) ada di atas meja gelap, sebagian di zona bawah antarmuka aplikasi (±350 px; mengikuti praktik Reels dialog, uji di aplikasi sebelum upload).
- **Atas hanya untuk judul, hanya di scene pertama.** Kartu teks layar Reels dialog (`OnScreenText`, diekspor dari `DraftVideo`, `top` = 260, di bawah zona aman atas ±250 px), kartu biru primary, teks dari `META.title` (Title Case dari tema; hindari tanda hubung di tengah kata, "prompt-mu" menjadi "Prompt-Mu"). `META.highlight` = satu frasa di dalam judul yang diwarnai oranye. Scene lain tanpa kartu.
- Suara: voiceover (lihat "Voiceover") dan efek suara (lihat "Efek suara"). Musik belum terintegrasi (lihat "Belum dikerjakan").

## Isi folder

```
src/videos/<Nama>/
  README.md
  <Nama>Video.tsx   BlockReels + COMPOSITION (id <Nama>-Reels), ekspor TOTAL_FRAMES
  config.ts         META, CAPTION, HASHTAGS (5, set baku)
  scenes.ts         BASE_SCENES
```

`node scripts/new-block.mjs <Nama> "<Judul>" [--cast ganjar,claudecode] [--scenes hook,relate,...] [--sets mejaMalam,kantor,terminal,kafe]`. Latar dipakai bergantian per scene; pembicara bergantian; semua teks `TODO`.

## Data scene (`scenes.ts`)
- Scene: `id` (satu kata), `seconds` (batas bawah; memanjang bila baris terakhir lebih panjang), `set`, `cast`, `lines`, `note` (tidak dirender).
- `set`: semua latar memakai komposisi baku yang sama (dari referensi meja malam): Ganjar besar di kiri, maskot kecil di meja depan kiri, monitor besar miring terpotong di kanan (di `kafe` berupa layar laptop), keyboard, catatan tempel, pena, meja memudar gelap ke bawah. Yang berbeda dunia di belakangnya: `mejaMalam` (kota malam, lampu besar buram), `kantor` (kantor malam: menara dengan banyak jendela kecil menyala, papan dinding redup), `terminal` (panel kode melayang), `kafe` (bokeh lampu hangat, rak cangkir). Ganti latar antar scene; validator memberi peringatan bila dua scene berurutan sama.
- `cast`: `character` (`ganjar`, `robot`, `claudecode`), `expression`, `motion`, `position` (`kiri`, `tengah`, `kanan`), `place` (`belakang` = berdiri di balik meja, bawaan Ganjar; `meja` = berdiri di atas meja, bawaan lainnya), `scale`.
- Baris: `who`, `from` (detik sejak scene mulai), `dur`, `text` (caption bawah), `wordTimes`, `expressions`, `motions` (13 gesture block), `motionAt`, `reactions`, `shot`, `push`.
- `shot` per baris (potong langsung antar baris; tanpa `shot` = `wide`), atau daftar `[{ at, kind }]` bila berganti di tengah baris: `wide`, `medium`, `closeUp`, `extremeCloseUp` (+ goyang 3 px), `dutch` (miring 7°), `lowAngle`, `highAngle`, `birdsEye`, `overShoulder` (kamera medium ke pembicara, pendengar dari belakang besar dan buram di pojok bawah paling depan), `pov`, `reveal` (mulai extreme close-up lalu mundur ke wide 2,6 dtk). `push: true` = zoom in 15% pelan. Kamera selalu bergeser sangat pelan supaya paralaks terlihat walau shot ditahan. Zoom shot dikalibrasi terhadap tinggi acuan karakter, jadi karakter yang diperkecil tata letak (maskot di meja) tetap mendapat close-up yang rapat.

## Voiceover
Opsional per video, pola sama dengan Reels dialog: id klip = id scene + nomor urut (`hook-01`), suara per karakter dari `src/dialog-reels/voices.json`, `VO_SETTINGS` dan `VO_MANIFEST` di `config.ts`, `voiceover.json`, `voiceover-files.ts`, dan `voiceover/` di folder video. `fitBlockScenes` (`src/block-reels/voiceover.ts`) mengganti durasi baris dengan durasi audio, menggeser baris yang tumpang tindih, dan membuat durasi scene mengikuti audio; `BlockReels` memutar klipnya. Baris tanpa klip memakai perkiraan `dur`.
- `eleven_v4` membaca tag emosi Inggris per baris (`tag: "deadpan"`, dikirim `[tag] teks`); `speed` tidak dikirim. `spoken` = teks TTS bila beda dari `text`.
- `node scripts/vo-lines.mjs --video <Nama>` (status dan kredit), `node scripts/vo-generate.mjs --video <Nama> [--only id]` (minta konfirmasi jumlah huruf; uji satu baris dulu). `vo-check.mjs` dan `vo-words.mjs` belum mendukung Reels block: periksa tempo dan LUFS manual dengan `ffmpeg`, dan `wordTimes` diisi tangan.
- Setelah klip jadi, geser ulang `at` sfx dan `shot` mengikuti audio asli.

## Efek suara
Mesin memutar efek dari `public/sfx/synth` (set yang sama dengan Reels dialog), lewat `Sound` di `BlockReels.tsx`:
- **Whoosh** di awal tiap scene kecuali yang pertama (volume 0,3). `META.sceneSfx: false` mematikannya.
- **Pop kecil** tiap baris, nada beda untuk Ganjar dan Claude Code (volume 0,22, 3 frame sebelum baris). `META.speakerPop: false` mematikannya.
- **`sfx` per baris**: `[{ name, at, volume }]`, `name` = nama berkas tanpa `.wav` (`ding`, `whoosh`, `record_scratch`, `sad_trombone`, `boing`, `ba_dum_tss`, `key1`-`key3`, ...), `at` = detik sejak baris mulai, `volume` bawaan 0,5. Letakkan di kata yang dimaksud; hemat, satu atau dua per scene.
- Waktu `at` ikut perkiraan `from`, jadi setelah voiceover ada, ukur ulang dari audio asli.

## Mesin (`src/block-reels`)
- `World.tsx`: tata letak default `wide` per latar (`Layout`: kamera, posisi karakter di balik meja dan di atas meja, skala), lapisan (`Layer`, faktor `p`: 0,28 langit dan kota, 0,6 dinding, 1 bidang fokus, 1,28 depan), `SETS` (warna dan lapisan tiap latar), benda meja (`Monitor`, `DeskTop`, `DeskFront`, `Foreground`), `Lighting` (cahaya hangat dan vinyet). Konstanta posisi meja di bagian atas.
- `Stage.tsx`: karakter, shot, kamera. Urutan gambar: langit, dinding, karakter di balik meja, permukaan meja dan benda, monitor (berdiri di meja, di depan karakter), bayangan kontak, karakter di atas meja, sisi depan meja, lapisan depan, bahu `overShoulder`.
- `BlockReels.tsx`: `Series` scene, caption bawah lewat `LineCaption` (`CAPTION_BOX`) dan kartu judul scene pertama lewat `OnScreenText` (`CARD_TOP`), `totalFrames`.
- Cahaya karakter: tiap latar punya `light` (`BlockLight`) di `SETS`: tint per sisi kubus (hangat dari depan dan atas, rim dari monitor di sisi kanan) dan gradasi halus. Disalurkan lewat `BlockLightContext` di `src/assets/characters/shared/blockKit.tsx`; tanpa Provider tampilan karakter di video lain tidak berubah. Tampilan karakter (warna, bentuk) tidak diubah, hanya cahayanya.
- Warna latar diorama (pencahayaan) ada di `SETS`, bukan dari tema: itu warna dunia, bukan UI. Caption memakai font tema.

## Cara kerja
Arah dulu (judul, struktur, latar per scene, shot kunci), lalu naskah dan storyboard shot (tabel per baris: kalimat, shot, latar, ekspresi), baru `scenes.ts`. Cek visual dengan `remotion still` lewat CLI, bukan Studio (banyak kubus 3D):

```bash
npx remotion still src/index.ts <Nama>-Reels out/still/<Nama>-30.png --frame=30
npx remotion render src/index.ts <Nama>-Reels out/<Nama>-Reels.mp4
```

Pengecekan: `npm run validate:structure` (jenis, berkas, COMPOSITION, 5 hashtag, tanpa BrandFooter, nama latar, TODO, latar kembar berurutan).

## Belum dikerjakan
- `wordTimes` otomatis untuk caption (belum ada alatnya untuk Reels block; sementara waktu kata diperkirakan dari panjang huruf) dan musik.
- Karakter masih berdiri di balik meja (Ganjar block tidak punya pose duduk).
- Tampilan baru dicek lewat `remotion still` di sandbox; belum ditonton sebagai video penuh.
