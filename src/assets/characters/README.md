# Karakter dasar

Karakter project: **Ganjar**, **Robot**, dan **Stickman**, masing-masing dengan beberapa varian (rig 2D SVG berlapis, balok 3D, stickman). Semua digerakkan murni oleh frame Remotion.
Referensi desain: `design-references/characters/` (`ganjar-svg-approved.png`, `ganjar-robot-character-sheet.png`).

```tsx
import { Duo, Ganjar, Robot } from "../assets/characters";

<Ganjar width={480} face={[{ at: 0, expression: "senang" }, { at: 2, expression: "kaget" }]} talking />
<Robot width={480} expression="normal" />
<Duo width={440} ganjar={{ expression: "senyumSantai" }} robot={{ expression: "senang" }} />
```

- `width` = lebar kotak viewBox penuh; karakter terlihat sekitar setengahnya. Pakai `ganjarSize`, `robotSize`, `duoSize` untuk ukuran.
- `face`: kunci ekspresi berwaktu (detik). Tanpa `face`, `expression` dipakai statis.
- `clips`: gerak badan (`headTurn`, `point`, `startle` untuk Ganjar; `armGesture`, `surprise`, `walk` untuk Robot), tiap clip dengan `start` dan `dur` dalam frame.
- `bust` (Ganjar): hanya kepala dan bahu.
- Hanya tampak depan. Animasi hanya boleh bergantung pada `useCurrentFrame()`.

## Struktur

Impor selalu dari `src/assets/characters` (barrel `index.ts`), jangan dari subfolder.

```
src/assets/characters/
  index.ts            barrel semua karakter
  Duo.tsx             Ganjar + Robot berdampingan
  CharacterSheet.tsx  halaman referensi semua ekspresi (komposisi CharacterSheet)
  shared/             kode bersama: look.ts (arah pandang), motion.ts (kf, envelope), blockKit.tsx (kubus 3D dan sendi)
  ganjar/
    Ganjar.tsx        komponen rig 2D
    rig/              GanjarRig.tsx, pose.ts, clips.ts, face.ts, geometry.ts
    block/            GanjarBlock.tsx (kubus 3D)
  robot/
    Robot.tsx         komponen rig 2D
    rig/              RobotRig.tsx, pose.ts, clips.ts, face.ts, geometry.ts
    block/            RobotBlock.tsx (kubus 3D)
    stickman/         RobotStickman.tsx (garis tipis)
  stickman/
    Stickman.tsx      stickman polos; pose dipakai juga oleh RobotStickman
```

Demo dan komposisi Studio: `src/videos/CharacterRigDemo/{ganjar,robot,stickman,duo}/`. Bagian bernama via `data-part`, pivot eksplisit.

## Ganjar Blok (gaya Minecraft)

`GanjarBlock` memakai kubus CSS 3D dengan sisi vektor halus (bukan piksel, bukan rig SVG). Props: `height`, `expression` (`senyum`, `kaget`, `mataTertutup`), `yaw`, `spin`, `walk`, `wave`. Komposisi: `GanjarBlock` dan `GanjarBlockStill`.

## Stickman

`Stickman`: rig SVG gaya gambar tangan tampak depan, berheadphone, hoodie, dan celana pendek abu kotak (kepala oval, badan buah pir, tangan dan kaki berujung loop). Props: `height`, `expression` (`senyum`, `senyumSantai`, `senang`, `tertawa`, `kaget`, `netral`, `serius`, `bingung`, `mikir`, `malu`, `sedih`, `kesal`, `marah`, `mataTertutup`), `talking` (mulut membuka-menutup, menimpa mulut ekspresi), `gesture` (gerak tangan: `netral`, `lambai`, `angkatTangan`, `tunjuk`, `sorak`, `menyerah`, `angkatBahu`, `facepalm`, `mikir`, `garukKepala`, `tepuk`, `pinggang`; definisi di `stickman/gestures.ts`, dipakai juga oleh `RobotStickman`), `walk`, `wave`, `headphones` (default `true`), `outfit` (hoodie dan celana pendek, default `true`; `false` = polos), `hair` (tiga helai rambut hitam, default `false`), `color`, `strokeWidth`. Komposisi: `Stickman`, `StickmanStill`, `StickmanHair`, `StickmanPlain`, `StickmanExpressions` (lembar semua ekspresi), `StickmanTalking`, `StickmanGestures`, dan `RobotStickmanGestures` (lembar semua gerak tangan).

## Robot Blok

`RobotBlock`: robot dari kubus CSS 3D dengan sisi vektor halus, sepasang dengan `GanjarBlock` (kubus dan sendi bersama ada di `blockKit.tsx`). Props: `height`, `expression` (`normal`, `senang`, `kaget`, `malu`, `sedih`, `marah`), `yaw`, `spin`, `walk`, `wave`. Komposisi: `RobotBlock` dan `RobotBlockStill`.

## Robot Stickman

`RobotStickman`: robot gaya stickman (garis tipis, tampak depan). Seperti robot aslinya: tidak ada leher atau badan terpisah, hanya satu kotak oranye berlayar (kepala dan badan sekaligus), dua antena, lengan di sisi, kaki di bawah, tangan dan kaki krem berbentuk kotak membulat. Memakai pose `Stickman`. Props: `height`, `expression` (`normal`, `senang`, `kaget`, `malu`, `sedih`, `marah`), `walk`, `wave`, `color`, `strokeWidth`. Komposisi: `RobotStickman` dan `RobotStickmanStill`.
