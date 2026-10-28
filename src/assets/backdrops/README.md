# Latar belakang

Latar berjangkar untuk karakter. Impor dari `src/assets/backdrops/<latar>`, bukan dari file di dalamnya.

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
- Belum ada: varian gaya block dan stickman, latar lain (luar ruang, kosong), dan `activity` karakter (mengetik, minum).
