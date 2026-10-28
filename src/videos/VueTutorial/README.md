# VueTutorial

"Cara Install & Menggunakan Framework Vue JS": 12 scene, 1920x1080, 30 fps, ±3 menit (5400 frame). Contoh video panjang dengan banyak bidikan kamera 2D. Komposisi `VueTutorial` di `src/Root.tsx`.

## Struktur

- `scenes.tsx`: data 12 scene (`SCENES`). Tiap scene = `SceneSpec`: `seconds`, `time` (waktu hari dunia), `shots` (bidikan kamera), `actors` (ekspresi dan gerak Ganjar dan Claude berwaktu), `lines` (dialog), `inserts` (sisipan layar).
- `SceneRenderer.tsx`: menyajikan satu scene: dunia di bawah `ShotCamera`, sisipan di atasnya, lalu vignette, penanda bab, dan keterangan dialog.
- `world.tsx`: dunia tetap (ruang kerja lanskap, Ganjar duduk, Claude di atas meja), `CAM` (keadaan kamera baku), dan `Keyed` untuk nilai berwaktu.
- `cards.tsx`: `InfoCard`, `TitleCard`, `ErrorPage`, `Caption`, `ChapterBadge`.
- `VueTutorialVideo.tsx`: `Series` dari 12 scene.

## Sisipan

`layout: "full"` (layar penuh), `"split"` (dunia di kiri dengan kamera `camera`, isi di kanan), `"pip"` (gelembung di sudut). Isi: `Terminal`, `CodeEditor`, `BrowserMock` + `CounterApp`, `FileTree`, `LaptopFromBehind` (bidikan 30° dari belakang tangan), `InfoCard`, `TitleCard`, `ErrorPage`. Waktu di dalam sisipan dihitung dari awal sisipan; dunia di dalam sisipan tetap memakai waktu scene.

## Menambah atau mengubah scene

Edit `SCENES` di `scenes.tsx`; durasi total mengikuti jumlah `seconds`. Render satu frame untuk memeriksa:

```bash
npx remotion still src/index.ts VueTutorial out.png --frame=945
```

## Transisi, efek suara, dan musik

- Transisi antar scene (`VueTutorialVideo.tsx`): `TransitionSeries` dengan campuran fade, slide, dan wipe, masing-masing `TRANSITION_FRAMES` (12) frame. Transisi saling menimpa scene, jadi total video = jumlah durasi scene - 11 x 12 frame (5268 frame) dan scene mulai di `SCENE_STARTS`.
- Efek suara (`VueSfx.tsx`): dibuat otomatis dari data scene: pop untuk tiap dialog, ketikan hanya selama isi sisipan benar-benar mengetik (jendela `typing` pada tiap sisipan, dihitung dari baris `cmd` terminal dan panjang kode di editor), whoosh di tiap sisipan dan transisi, ditambah `cues` per scene (ding, klik, scratch saat error, dan sebagainya). Berkas dari `public/sfx/free` dan `public/sfx/synth`.
- Musik latar: `public/music/vue_bed.mp3`, loop lo-fi 16 birama (±44 dtk) yang dibuat murni dari sintesis lewat `scripts/make-vue-bed.py` (numpy + ffmpeg), jadi bebas lisensi. Volumenya turun halus di sekitar dialog (ducking), dengan fade in dan fade out di ujung video. Ubah `MUSIC_HIGH` dan `MUSIC_LOW` di `VueSfx.tsx` untuk mengatur kerasnya.

Untuk mengganti musik: timpa `vue_bed.mp3`, atau ubah dan jalankan ulang skrip.
