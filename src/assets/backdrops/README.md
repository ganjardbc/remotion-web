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
- Belum ada: waktu hari (siang, sore, malam), varian gaya block dan stickman, dan `activity` karakter (mengetik, minum). Palet dan jangkar disiapkan untuk itu.
