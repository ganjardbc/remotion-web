# Latar belakang

Latar berjangkar untuk karakter. Impor dari `src/assets/backdrops` (barrel), bukan dari file di dalam subfolder.

| Latar | Isi | Jangkar |
|---|---|---|
| `workspace` | Ruang kerja: dinding, jendela, jam, kursi, meja, laptop, gelas | `deskTop`, `seatX`, `floorY`, ... |
| `plain` | Kosong: dinding gradasi, lantai, kolam cahaya | `floorY`, `spotX` |
| `outdoor` | Luar ruang: langit, dua lapis gedung (jendela menyala di malam), jalan | `width`, `horizonY`, `floorY` |
| `block` (nonaktif) | Gaya balok (3D) untuk karakter block: `PlainBlock` (lantai petak, dinding gradasi), `OutdoorBlock` (gedung kubus dengan jendela, pohon balok, lantai petak), `RoomBackBlock` + `DeskBlock` (ruang kerja: dinding, jendela, jam, lantai petak, kursi, meja, laptop, gelas dari kubus) | sama dengan `plain` / `outdoor` |
| `sketch` | Gaya sketsa (kertas, garis tangan tipis) untuk stickman: `PlainSketch`, `OutdoorSketch` | sama dengan `plain` / `outdoor` |

`block` dinonaktifkan: preview-nya membuat app crash, jadi tidak diekspor dari barrel `backdrops/index.ts` dan tidak ada di `BackdropsMatrix` maupun Studio. Filenya tetap ada; untuk mencobanya lagi, impor langsung dari `backdrops/block` dan cari penyebab crash dulu.

Gaya latar mengikuti tipe karakter: rig 2D memakai `plain`/`outdoor`/`workspace` (bidang warna datar), stickman memakai `sketch` (garis tipis di atas kertas). `sketch` memakai jangkar yang sama dengan `plain`/`outdoor`, jadi mengganti gaya tidak menggeser karakter. Garis sketsa tetap gelap di semua waktu; malam = kertas ungu temaram, bukan hitam, supaya garis dan wajah stickman tetap terbaca. Ruang kerja balok digambar dalam urutan yang sama dengan rig: `RoomBackBlock`, karakter block (dibungkus potongan setinggi `deskTop + 60` supaya kakinya tidak menyembul), lalu `DeskBlock`. Lihat `BackdropScene` dengan `kind="ruangKerja" style="balok"`. `block` memakai kamera 3D CSS dengan titik hilang di tinggi cakrawala: lantai petak mendatar di `floorY`, gedung dan pohon berdiri di atasnya pada kedalaman berbeda, dan karakter block berdiri di z = 0. Jangkar dan palet diambil dari `plain` / `outdoor`.

Semua latar punya `time` (`"siang" | "sore" | "malam"` atau angka 0..1) dan `palette` sendiri. Interpolasi waktu, langit (`Sky`), `characterFilter`, dan `ContactShadow` ada di `shared/` dan dipakai bersama. Karakter berdiri di `floorY` latar yang dipilih; `ContactShadow` di titik yang sama menyatukan keduanya. Demo di Studio (folder Latar): `BackdropsMatrix` (semua latar × gaya × waktu), `BackdropCycle`, `BackdropCycleSketsa`, dan `BackdropCycleBalok`, dan `WorkspaceBlockCycle` (ruang kerja balok) (peralihan di satu latar).

Jangkar selalu dalam piksel kanvas dan tidak diambil dari `useVideoConfig()`, supaya latar tetap benar saat ditanam dan diperkecil di dalam komposisi lain (seperti di `BackdropsMatrix`).

## workspace (ruang kerja)

## workspace (ruang kerja)

Dinding, jendela, jam, lantai, kursi, meja, laptop, dan gelas kopi. Urutan gambar (belakang ke depan): `RoomBack`, `Chair`, karakter duduk, `Desk`, `Laptop`, `Mug`.

```tsx
import { Chair, Desk, Laptop, Mug, PORTRAIT_ANCHORS, RoomBack } from "../../assets/backdrops/workspace";

<RoomBack />
<Chair />
{/* karakter duduk di PORTRAIT_ANCHORS.seatX, dasar badan di PORTRAIT_ANCHORS.deskTop */}
<Desk />
<Laptop />
<Mug />
```

- `anchors` (`WorkspaceAnchors`): `deskTop`, `slab`, `floorY`, `seatX`, `laptopX`, `laptopW`, `laptopLidH`, `mugX`, `window`, `clock`, dalam piksel kanvas. Karakter dan perabot membaca jangkar yang sama. `PORTRAIT_ANCHORS` untuk kanvas 1080x1920; kanvas lain membuat objek jangkar sendiri.
- `palette` (`WorkspacePalette`): semua warna, termasuk perabot. `WORKSPACE_DAY` adalah palet bawaan. Warna yang biasanya mengikuti tema video (`clockInk`, `clockAccent`, `laptopLogo`) ditimpa dari pembungkus video, lihat `src/videos/ProgrammerBodoh/Room.tsx`.
- Semua komponen hanya bergantung pada `useCurrentFrame()`.
- Waktu hari: `time` pada tiap komponen, `"siang" | "sore" | "malam"` atau angka 0..1 (siang 0, sore 0.5, malam 1; angka di antaranya beralih halus). Palet per waktu: `WORKSPACE_DAY`, `WORKSPACE_SORE`, `WORKSPACE_MALAM`; `workspacePalette(time)` mengembalikan palet hasil interpolasi. Palet juga mengatur langit di jendela (matahari terbit ke terbenam, bulan, bintang), awan, dan sorot cahaya.
- Karakter ikut waktu: bungkus karakter dengan `style={{ filter: characterFilter(time) }}` (kecerahan, saturasi, sepia; warna dasar dan ekspresi tetap terbaca). Garis stickman tetap gelap di semua waktu, karena muka putihnya hanya diredupkan.
- Demo di Studio (folder Latar): `WorkspaceTimes` (tiga waktu berdampingan) dan `WorkspaceCycle` (peralihan siang ke malam). `WorkspaceScene` = adegan lengkap dengan Ganjar duduk.
- Mengetik: `gesture="mengetik"` pada `GanjarStickman` dan `RobotStickman` (kedua tangan mengetuk bergantian di depan perut atau tepi layar). Demo: `WorkspaceTyping`. Block belum mendukungnya (jatuh ke pose dasar).
- Lanskap 1920x1080: `WorkspaceLandscape` menggambar ruang yang sama pada kanvas dalam `LANDSCAPE_INNER` (2743x1543) lalu memperkecilnya `LANDSCAPE_SCALE` (0,7) ke 1920x1080, jadi proporsi perabot dan karakter tetap seperti kanvas tegak. Jangkarnya `LANDSCAPE_ANCHORS` (piksel kanvas dalam). Slot `behindDesk` (karakter duduk, dipotong meja) dan `onDesk` (karakter di atas meja) memakai piksel kanvas dalam; `landscapePoint(x, y)` mengubahnya ke titik layar untuk bidikan kamera. Ukuran luarnya selalu 1920x1080, jadi cocok sebagai dunia `ShotCamera`. Demo: `WorkspaceTour` di folder Kamera.
- Perabot meja bersama: `GlowLaptop` (laptop kecil tampak dari belakang dengan logo berdenyut) dan `DeskPlant` (tanaman di pot berwarna), keduanya bertumpu pada `deskTop` dan berwarna dari luar. Dipakai `SejarahAIStory` (warna era) dan `SejarahAIStoryReels` (warna tema), render keduanya identik byte-per-byte dengan sebelum diekstrak. Meja, kursi, dan dinding kedua video itu tetap di file masing-masing karena warnanya mengikuti era atau tema video.
- Belum ada: aktivitas lain (minum).

## workspace/deskback (meja kerja tampak belakang)

Kamera lurus di belakang karakter: dinding dengan jendela, tirai, rak bercahaya, bingkai, tanaman, meja dengan monitor, lampu, dan keyboard, lalu kursi mesh dan karpet berbulu. Gaya bidang datar (sama dengan rig 2D), kanvas tegak 1080x1920. Waktu `siang | sore | malam` atau angka 0..1: siang terang berjendela dan kayu terang, malam hangat dengan lampu rak (LED), lampu meja, dan layar menyala. Rujukan: dua foto meja kerja dari Ganjar (malam hangat dan siang terang).

```tsx
import { DeskBackScene } from "../../assets/backdrops/workspace";

<DeskBackScene time="malam" />        // adegan lengkap dengan Ganjar duduk dari belakang
```

Urutan gambar (belakang ke depan), kalau ingin menyusun sendiri:

1. `DeskBackRoom`: dinding, jendela, tirai, rak, tanaman, meja, karpet.
2. `DeskBackLights`: peredupan waktu, lalu monitor, lampu, dan cahaya (digambar di atas peredupan supaya tetap terang).
3. Karakter duduk (`Ganjar view="belakang" sit={1}`), dipotong di `seatTop + 40` supaya kaki tidak tampak.
4. `DeskBackChair`: sandaran mesh, dudukan, sandaran tangan, dasar kursi. Bungkus 3 dan 4 dengan `style={{ filter: characterFilter(time) }}`.

- `DESKBACK_ANCHORS` (`DeskBackAnchors`): `floorY`, `deskBack`, `deskFront`, `slab`, `seatX`, `seatTop`, `characterHeight`, `characterTop`, `monitor`, `shelf`, `window`. Karakter dan kursi membaca jangkar yang sama; ubah `characterHeight` dan `characterTop` bersama (ujung baju bertumpu di `seatTop`).
- `deskBackPalette(time)` / `DESKBACK_DAY`, `DESKBACK_SORE`, `DESKBACK_MALAM`: semua warna hex 6 digit supaya bisa diinterpolasi. `glow` (kekuatan cahaya hangat) dan `dim` (peredupan ruangan) mengatur suasana malam.
- ID gradien SVG dibuat unik per instance (`useId`), jadi beberapa adegan bisa tampil di satu halaman (`DeskBackTimes`) tanpa saling menimpa.
- Area atas (di atas y = 300) sengaja kosong untuk judul atau teks Reels.
- Demo di Studio (folder Latar): `DeskBackScene`, `DeskBackTimes` (tiga waktu berdampingan), `DeskBackCycle` (peralihan siang ke malam).
- Belum ada: karakter lain (Robot, Claude Code) tampak belakang; gerak kepala menoleh ke monitor; versi lanskap.

## plain dan outdoor

```tsx
import { ContactShadow, OutdoorBack, PORTRAIT_OUTDOOR_ANCHORS, characterFilter } from "../../assets/backdrops";

<OutdoorBack time="sore" />
<ContactShadow x={540} y={PORTRAIT_OUTDOOR_ANCHORS.floorY} width={420} />
{/* karakter berdiri di floorY, dibungkus style={{ filter: characterFilter("sore") }} */}
```

- `PlainBack` / `OutdoorBack` digambar paling belakang. Anchors bawaan untuk kanvas 1080x1920; kanvas lain membuat objek jangkar sendiri.
- Gedung `outdoor` dari daftar angka tetap (bukan acak), jadi render sama di tiap frame; awan bergeser pelan dari frame.
