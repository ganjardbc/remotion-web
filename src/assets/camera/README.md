# Kamera virtual 2D

Kamera untuk karakter 2D (rig dan stickman). Dunia digambar sekali dan terus berjalan; kamera hanya memilih bagian yang tampak (geser, zoom, putar), jadi pindah bidikan tidak memutus animasi karakter. Impor dari `src/assets/camera`.

```tsx
import { ShotCamera, framing, type Shot } from "../../assets/camera";

const shots: readonly Shot[] = [
  { from: 0, dur: 2, start: framing("wide", { x: 960, y: 540 }) },
  { from: 2, dur: 2, start: framing("medium", { x: 640, y: 500 }) },
  { from: 4, dur: 2.5, start: framing("medium", ganjarChest), end: framing("closeUp", ganjarFace), label: "Push-in" },
  { from: 6.5, dur: 2, start: framing("closeUp", ganjarFace, 7), shake: 9, transitionIn: "punch" },
];

<ShotCamera shots={shots} background={<Latar />}>
  <Karakter />
</ShotCamera>
```

- `Shot`: `from` dan `dur` (detik, waktu adegan), `start` (dan `end` untuk gerak kamera), `ease`, `shake` (px), `blurBg` (px atau `[dari, ke]`, hanya lapisan `background`), `transitionIn` (`cut`, `whip`, `punch`), `transitionOut` (`cut`, `whip`), `label`.
- `CamState`: `{ x, y, zoom, rotate? }`, titik dunia di tengah layar. `framing(kind, subject, rotate?)` memberi nilai baku: `wide` 1×, `medium` 1,7×, `closeUp` 2,9×, `extremeCloseUp` 5×.
- Contoh gerak: push-in/pull-out (`start` ke `end` dengan zoom berbeda), pan (x berbeda), tilt (y berbeda), dutch (`rotate` 5-8°), handheld (`shake`), rack focus (`blurBg`), whip pan (`transitionOut: "whip"` di bidikan sebelumnya dan `transitionIn: "whip"` di berikutnya).
- `ShotCamera` memakai ukuran video; beri `width` dan `height` untuk menanamnya di panel (split screen, PiP). `world` = ukuran dunia bila berbeda dari video.
- Tata letak: `SplitScreen`, `PictureInPicture`, `InsertCard` (sisipan layar penuh, pasang di dalam `Sequence`), `Vignette`, `Letterbox`.
- Semua animasi hanya bergantung pada `useCurrentFrame()`.

Demo di Studio (folder Kamera): `WorkspaceTour` (tur kamera di ruang kerja lanskap: wide, push-in, close-up, pan ke Robot, insert laptop, pull-out, sambil waktu bergeser siang ke malam) dan `ShotReel` memperagakan 12 bidikan kamera, split screen, picture-in-picture, dan sisipan terminal pada dunia Ganjar dan Robot (stickman). Kode di `demo/ShotReel.tsx`.

Batasan: kamera hanya mengubah pandangan 2D. Karakter rig dan stickman tampak depan, jadi sudut dari belakang atau samping perlu digambar sebagai bidikan tersendiri (benda datar seperti layar bisa diberi `perspective` dan `rotateY` lewat CSS 3D).
