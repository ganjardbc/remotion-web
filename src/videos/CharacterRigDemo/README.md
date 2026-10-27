# CharacterRigDemo (prototipe, terisolasi)

Menu Studio untuk karakter di `src/assets/characters/` (ganjar, robot). Komposisi demo ada di `<karakter>/demo/` bersama asetnya; folder ini hanya berisi `Root.tsx` (daftar komposisi) dan entry sendiri `index.ts`.

```
npx remotion studio src/videos/CharacterRigDemo/index.ts
npx remotion render src/videos/CharacterRigDemo/index.ts RobotRig  out/CharacterRigDemo/robotrig.mp4
npx remotion render src/videos/CharacterRigDemo/index.ts GanjarRig out/CharacterRigDemo/ganjarrig.mp4
```

## Menu di Studio
Sidebar: folder `Characters`, lalu per karakter dan varian. ID `Stickman*` berganti jadi `GanjarStickman*`.
```
Characters
  CharacterSheet
  Ganjar   > Rig-2D (GanjarStill, GanjarRig) | Block (GanjarBlockStill, GanjarBlock) | Stickman (GanjarStickmanStill, GanjarStickmanHair, GanjarStickmanPlain, GanjarStickman)
  Robot    > Rig-2D (RobotRig) | Block (RobotBlockStill, RobotBlock) | Stickman (RobotStickmanStill, RobotStickman)
```

## Arsitektur
- Kode rig ada di `src/assets/characters/{ganjar,robot}/rig/`.
- `pose.ts`: pose = data murni; `applyDelta` menjumlahkan delta (skala dikalikan).
- `clips.ts`: clip = `(frameLokal) => PoseDelta`. `evalRobot/evalGanjar(frame, clips)` = idle + clip aktif.
- `face.ts`: ekspresi dipisah dari badan. Ganjar: ekspresi berupa angka, diinterpolasi 6 frame. Robot: mata menutup sekejap lalu ganti bentuk.
- `*Rig.tsx`: renderer; bagian bernama (`data-part`), pivot eksplisit, hierarki induk-anak lewat `<g transform>` bersarang.
- `motion.ts`: `kf`, `envelope` bersama.
- Tanpa `Math.random`, `Date`, atau state mutable.

## Hierarki
Robot: root > legs (hip pivot; foot pivot di pergelangan) | body-group (pivot dasar badan) > antennas (pivot pangkal), arms (pivot bahu), body, screen > face.
Ganjar: root > lower-body > legs (hip > knee > shoe), pelvis, upper-body (pivot pinggang) > torso, neck, arms (bahu > siku > tangan), head-group (pivot leher) > rear hair, ears, face, front hair.

## Batasan
Hanya tampak depan. Ganjar belum punya jalan, tangan ke dagu, atau view samping/3/4.
Robot: tes jalan = langkah menyamping menghadap depan, bukan siklus jalan sungguhan.
