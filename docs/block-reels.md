# Reels block

Dibaca hanya saat membuat atau mengubah **Reels block**: dialog karakter block (kubus CSS 3D) di dunia diorama, 9:16, fokus pada sudut kamera. Aturan folder umum ada di [struktur-video.md](struktur-video.md); Reels dialog biasa (rig, stickman, block di latar motion graphic) ada di [dialog-reels.md](dialog-reels.md). Rujukan: `src/videos/DioramaDemo` (prototipe).

Reels block adalah jenis folder sendiri, terpisah dari Reels dialog. Mesinnya di `src/block-reels`, scaffold-nya `node scripts/new-block.mjs`. Hanya atas permintaan, untuk konten yang memang berupa percakapan. Narator Reels biasa tetap Claude Code rig 2D.

## Beda dari Reels dialog
- **Tanpa BrandFooter dan tanpa watermark.** Pengecualian eksplisit dari aturan "BrandFooter di setiap video" di CLAUDE.md. `validate:structure` menolak `<BrandFooter` di `<Nama>Video.tsx` jenis ini. Branding lewat akun dan caption posting.
- **Semua pemeran block.** Tidak ada pilihan gaya `rig` atau `stickman`.
- **Dunia diorama**, bukan latar motion graphic: lapisan datar di kedalaman berbeda, kamera menggeser dan memperbesar tiap lapisan dengan faktor paralaks sendiri, latar jauh dan depan di-blur seperti kedalaman bidang. Kesan 3D tanpa render 3D penuh (backdrop kubus 3D pernah membuat Studio crash). Karakter diperbesar lewat tinggi, bukan CSS scale, supaya kubus tetap tajam.
- **Caption di atas** (pil gelap, kata yang sudah diucapkan putih penuh, sisanya redup), bukan di bawah. Tanpa teks layar, cutaway, atau kartu.
- Tanpa suara dulu: voiceover, sfx, dan musik belum terintegrasi (lihat "Belum dikerjakan").

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
- `set`: `mejaMalam` (kota malam di balik jendela, monitor kode), `kantor` (siang, jendela besar, papan putih), `terminal` (panel kode melayang), `kafe` (bokeh lampu hangat, rak cangkir). Ganti latar antar scene; validator memberi peringatan bila dua scene berurutan sama.
- `cast`: `character` (`ganjar`, `robot`, `claudecode`), `expression`, `motion`, `position` (`kiri`, `tengah`, `kanan`), `place` (`belakang` = berdiri di balik meja, bawaan Ganjar; `meja` = berdiri di atas meja, bawaan lainnya), `scale`.
- Baris: `who`, `from` (detik sejak scene mulai), `dur`, `text`, `expressions`, `motions` (13 gesture block), `motionAt`, `reactions`, `shot`, `push`.
- `shot` per baris (potong langsung antar baris; tanpa `shot` = `wide`), atau daftar `[{ at, kind }]` bila berganti di tengah baris: `wide`, `medium`, `closeUp`, `extremeCloseUp` (+ goyang 3 px), `dutch` (miring 7°), `lowAngle`, `highAngle`, `birdsEye`, `overShoulder`, `pov`, `reveal` (mulai extreme close-up lalu mundur ke wide 2,6 dtk). `push: true` = zoom in 15% pelan. Kamera selalu bergeser sangat pelan supaya paralaks terlihat walau shot ditahan.

## Mesin (`src/block-reels`)
- `World.tsx`: lapisan (`Layer`, faktor `p`: 0,28 langit dan kota, 0,6 dinding, 1 bidang fokus, 1,28 depan), `SETS` (warna dan lapisan tiap latar), benda meja (`Monitor`, `DeskTop`, `DeskFront`, `Foreground`), `Lighting` (cahaya hangat dan vinyet). Konstanta posisi meja di bagian atas.
- `Stage.tsx`: karakter, shot, kamera. Urutan gambar: langit, dinding, monitor, karakter di balik meja, permukaan meja dan benda, karakter di atas meja, sisi depan meja, lapisan depan.
- `BlockReels.tsx`: `Series` scene, caption atas (`CAPTION_TOP` 250 px, di bawah zona aman atas), `totalFrames`.
- Warna latar diorama (pencahayaan) ada di `SETS`, bukan dari tema: itu warna dunia, bukan UI. Caption memakai font tema.

## Cara kerja
Arah dulu (judul, struktur, latar per scene, shot kunci), lalu naskah dan storyboard shot (tabel per baris: kalimat, shot, latar, ekspresi), baru `scenes.ts`. Cek visual dengan `remotion still` lewat CLI, bukan Studio (banyak kubus 3D):

```bash
npx remotion still src/index.ts <Nama>-Reels out/still/<Nama>-30.png --frame=30
npx remotion render src/index.ts <Nama>-Reels out/<Nama>-Reels.mp4
```

Pengecekan: `npm run validate:structure` (jenis, berkas, COMPOSITION, 5 hashtag, tanpa BrandFooter, nama latar, TODO, latar kembar berurutan).

## Belum dikerjakan
- Voiceover per baris, `wordTimes` untuk caption, sfx, dan musik. Sementara durasi dari perkiraan `dur`.
- Karakter masih berdiri di balik meja (Ganjar block tidak punya pose duduk).
- Tampilan baru dicek lewat `remotion still` di sandbox; belum ditonton sebagai video penuh.
