# Karakter dasar

Karakter project: **Ganjar** dan **Robot**, masing-masing dengan tiga varian (rig 2D SVG berlapis, balok 3D, stickman). Semua digerakkan murni oleh frame Remotion.
Referensi desain: `design-references/characters/` (`ganjar-svg-approved.png`, `ganjar-robot-character-sheet.png`).

```tsx
import { Ganjar, GanjarStickman, Robot } from "../assets/characters";

<Ganjar height={700} face={[{ at: 0, expression: "senang" }, { at: 2, expression: "kaget" }]} talking />
<Robot height={400} expression="normal" />
<GanjarStickman height={900} expression="senyum" gesture="lambai" />
```

- `height` = tinggi karakter dalam px, sama untuk semua varian. Untuk rig 2D itu tinggi kotak viewBox penuh. Pakai `ganjarSize`, `robotSize`, `ganjarStickmanSize`, `robotStickmanSize`, dan seterusnya untuk ukuran.
- `face`: kunci ekspresi berwaktu (detik). Tanpa `face`, `expression` dipakai statis.
- `clips`: gerak badan (`headTurn`, `point`, `startle` untuk Ganjar; `armGesture`, `surprise`, `walk` untuk Robot), tiap clip dengan `start` dan `dur` dalam frame.
- `bust` (Ganjar rig): hanya kepala dan bahu.
- Hanya tampak depan. Animasi hanya boleh bergantung pada `useCurrentFrame()`.

## Struktur

Impor selalu dari `src/assets/characters` (barrel `index.ts`), jangan dari subfolder. Semua karakter berstruktur sama:

```
src/assets/characters/
  index.ts            barrel semua karakter
  CharacterSheet.tsx  halaman referensi semua ekspresi (komposisi CharacterSheet)
  shared/             look.ts (arah pandang), motion.ts (kf, envelope), blockKit.tsx (kubus 3D), gestures.ts (gerak tangan stickman)
  <karakter>/         ganjar, robot
    index.ts          ekspor publik karakter
    expressions.ts    daftar dan tipe ekspresi semua varian
    palette.ts        warna karakter
    rig/              <Karakter>.tsx (komponen rig 2D), <Karakter>Rig.tsx, pose.ts, clips.ts, face.ts, geometry.ts, index.ts
    block/            <Karakter>Block.tsx (kubus 3D), index.ts
    stickman/         <Karakter>Stickman.tsx (garis tipis), index.ts
    demo/             komposisi Studio untuk karakter ini
```

`GanjarStickman` menyediakan pose (`poseAt`, `HAND`, `reach`) yang dipakai juga oleh `RobotStickman`. Komposisi Studio didaftarkan di `src/videos/CharacterRigDemo/Root.tsx`. Bagian bernama via `data-part`, pivot eksplisit.

## Ganjar (rig 2D)

Tampilan Ganjar sudah final (jangan diubah tanpa persetujuan): rambut pendek cokelat gelap dari `design-references/characters/male-short-hair-shape.svg`, kaos hitam lembut oversized, celana kargo hitam lembut longgar dengan saku berpenutup, sneaker hitam-putih. Warna di `ganjar/rig/geometry.ts` (`COLORS`), tidak ada hitam pekat.

Ukuran dan bentuk diatur lewat konstanta di `ganjar/rig/GanjarRig.tsx`, semuanya bernilai default yang sudah disetujui:

- Rambut: `HAIR_SCALE_X/Y` (lebar, tinggi), `HAIR_X/Y` (posisi), `HAIR_ROTATE` dan `HAIR_PIVOT` (rotasi), `HAIR_ROUNDNESS` (kebulatan ujung).
- Wajah: `HEAD_HALF_WIDTH`, `HEAD_TOP`, `HEAD_BOTTOM`, `HEAD_JAW`, `HEAD_CROWN`. Posisi mata, alis, dan mulut ada di `FACE` (`geometry.ts`).
- Kepala utuh: `HEAD_SCALE`, skala dari pangkal leher.

Bentuk digambar dua lapis (garis lalu isi) supaya tepi luarnya satu siluet bersih tanpa garis sambungan di bahu, siku, lutut, dan dahi.

## Ganjar Blok (gaya Minecraft)

`GanjarBlock` memakai kubus CSS 3D dengan sisi vektor halus (bukan piksel, bukan rig SVG). Props: `height`, `expression` (sama dengan rig 2D: `netral`, `senang`, `bingung`, `kaget`, `senyumSantai`, `serius`, `kesal`, `mikir`, `mataTertutup`; wajah digambar dari data `FaceState` yang sama), `yaw`, `spin`, `walk`, `wave`. Komposisi: `GanjarBlock` dan `GanjarBlockStill`.

## Ganjar Stickman

`GanjarStickman`: rig SVG gaya gambar tangan tampak depan, berheadphone, hoodie, dan celana pendek abu kotak (kepala oval, badan buah pir, tangan dan kaki berujung loop). Props: `height`, `expression` (`senyum`, `senyumSantai`, `senang`, `tertawa`, `kaget`, `netral`, `serius`, `bingung`, `mikir`, `malu`, `sedih`, `kesal`, `marah`, `mataTertutup`), `talking` (mulut membuka-menutup, menimpa mulut ekspresi), `gesture` (gerak tangan: `netral`, `lambai`, `angkatTangan`, `tunjuk`, `sorak`, `menyerah`, `angkatBahu`, `facepalm`, `mikir`, `garukKepala`, `tepuk`, `pinggang`; definisi di `shared/gestures.ts`, dipakai juga oleh `RobotStickman`), `walk`, `wave`, `headphones` (default `true`), `outfit` (hoodie dan celana pendek, default `true`; `false` = polos), `hair` (tiga helai rambut hitam, default `false`), `color`, `strokeWidth`. Komposisi: `GanjarStickman`, `GanjarStickmanStill`, `GanjarStickmanHair`, `GanjarStickmanPlain`, `GanjarStickmanExpressions` (lembar semua ekspresi), `GanjarStickmanTalking`, `GanjarStickmanGestures`, dan `RobotStickmanGestures` (lembar semua gerak tangan).

## Robot Blok

`RobotBlock`: robot dari kubus CSS 3D dengan sisi vektor halus, sepasang dengan `GanjarBlock` (kubus dan sendi bersama ada di `blockKit.tsx`). Props: `height`, `expression` (`normal`, `senang`, `kaget`, `malu`, `sedih`, `marah`, `bingung`, `mikir`, `kesal`, `serius`, `mataTertutup`), `yaw`, `spin`, `walk`, `wave`. Komposisi: `RobotBlock` dan `RobotBlockStill`.

## Robot Stickman

`RobotStickman`: robot gaya stickman (garis tipis, tampak depan). Seperti robot aslinya: tidak ada leher atau badan terpisah, hanya satu kotak oranye berlayar (kepala dan badan sekaligus), dua antena, lengan di sisi, kaki di bawah, tangan dan kaki krem berbentuk kotak membulat. Memakai pose `GanjarStickman`. Props: `height`, `expression` (`normal`, `senang`, `kaget`, `malu`, `sedih`, `marah`, `bingung`, `mikir`, `kesal`, `serius`, `mataTertutup`), `walk`, `wave`, `color`, `strokeWidth`. Komposisi: `RobotStickman` dan `RobotStickmanStill`.
