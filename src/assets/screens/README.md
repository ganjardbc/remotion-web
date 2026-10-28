# Layar buatan dan laptop dari belakang

Isi layar untuk video tutorial: terminal, editor kode, browser, pohon berkas. Semuanya teks HTML dan CSS (bukan gambar), jadi tetap tajam saat kamera di-zoom. Impor dari `src/assets/screens`.

```tsx
import { Terminal, CodeEditor, BrowserMock, CounterApp, FileTree, LaptopFromBehind } from "../../assets/screens";

<Terminal lines={[{ at: 0.3, kind: "cmd", text: "npm create vue@latest", speed: 16 }, { at: 2, kind: "ok", text: "✔ Project name: my-vue-app" }]} />
<CodeEditor code={code} typeCps={26} highlights={[{ from: 4, to: 4, at: 5, until: 7 }]} />
<BrowserMock><CounterApp clicks={[2, 3.2, 4.1]} /></BrowserMock>
<FileTree nodes={[{ name: "src", depth: 0, kind: "dir", at: 0.3, highlightAt: 4 }]} />
```

- Semua memenuhi induknya (`width` dan `height` 100%); `fontSize` mengatur keterbacaan. Semua waktu (`at`, `highlightAt`, `clicks`, `typeStart`) dalam detik, waktu lokal komponen, jadi bungkus dengan `Sequence` agar mulai dari nol.
- `Terminal`: baris `cmd` diketik huruf demi huruf (`speed` huruf per detik) dengan kursor berkedip; `out`, `ok`, `dim`, `error` muncul sekaligus.
- `CodeEditor`: pewarna sintaks ringan untuk Vue (bukan parser sungguhan), tab file, nomor baris, ketikan (`typeCps`), dan sorotan baris berwaktu.
- `BrowserMock` + `CounterApp`: bilah alamat dan halaman "Hello Vue" yang tombolnya menekan dan hitungannya naik pada waktu `clicks`.
- `FileTree`: baris muncul bergantian; baris tertentu bisa disorot.
- `LaptopFromBehind`: laptop dilihat dari belakang tangan pengetik. Alas keyboard, tombol, tangan (tampak atas), meja, dan layar diletakkan pada bidang CSS 3D, jadi `yaw` (bawaan -30°) dan `pitch` menghasilkan sudut yang nyata untuk benda-benda datar itu. `screen` bisa diisi `Terminal`, `CodeEditor`, atau `BrowserMock`. `typing` menggerakkan jari dan menekan tombol bergantian. `yaw` bisa dianimasikan (kamera mengitari laptop).

Demo di Studio (folder Layar): `ScreensDemo` (empat aset sekaligus) dan `LaptopBehindDemo` (kamera mengitari laptop dari 30° ke 18° sambil mengetik).

Batasan: tangan di `LaptopFromBehind` adalah gambar datar bergaya stickman, bukan karakter; dia menggantikan karakter hanya pada bidikan dari belakang tangan.
