# Latar belakang

Latar berjangkar untuk karakter. Impor dari `src/assets/backdrops` (barrel), bukan dari file di dalam subfolder.

| Latar | Isi | Jangkar |
|---|---|---|
| `workspace` | Ruang kerja: dinding, jendela, jam, kursi, meja, laptop, gelas | `deskTop`, `seatX`, `floorY`, ... |
| `plain` | Kosong: dinding gradasi, lantai, kolam cahaya | `floorY`, `spotX` |
| `outdoor` | Luar ruang: langit, dua lapis gedung (jendela menyala di malam), jalan | `width`, `horizonY`, `floorY` |
| `block` | Gaya balok (3D) untuk karakter block: `PlainBlock` (lantai petak, dinding gradasi), `OutdoorBlock` (gedung kubus dengan jendela, pohon balok, lantai petak), `RoomBackBlock` + `DeskBlock` (ruang kerja: dinding, jendela, jam, lantai petak, kursi, meja, laptop, gelas dari kubus) | sama dengan `plain` / `outdoor` |
| `sketch` | Gaya sketsa (kertas, garis tangan tipis) untuk stickman: `PlainSketch`, `OutdoorSketch` | sama dengan `plain` / `outdoor` |

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
- Belum ada: aktivitas lain (minum).

## plain dan outdoor

```tsx
import { ContactShadow, OutdoorBack, PORTRAIT_OUTDOOR_ANCHORS, characterFilter } from "../../assets/backdrops";

<OutdoorBack time="sore" />
<ContactShadow x={540} y={PORTRAIT_OUTDOOR_ANCHORS.floorY} width={420} />
{/* karakter berdiri di floorY, dibungkus style={{ filter: characterFilter("sore") }} */}
```

- `PlainBack` / `OutdoorBack` digambar paling belakang. Anchors bawaan untuk kanvas 1080x1920; kanvas lain membuat objek jangkar sendiri.
- Gedung `outdoor` dari daftar angka tetap (bukan acak), jadi render sama di tiap frame; awan bergeser pelan dari frame.
