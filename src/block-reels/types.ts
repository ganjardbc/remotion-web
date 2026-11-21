import type { CharacterId, ShotKind } from "../dialog-reels/types";

// Bentuk data Reels block 9:16: dialog antar karakter block di dunia diorama (lapisan datar berparalaks, bukan 3D penuh).
// Tanpa BrandFooter dan tanpa watermark; layar sepenuhnya milik dunia, shot kamera, dan caption atas.

export type { CharacterId, ShotKind };

// Latar diorama. `mejaMalam`: kota malam di balik jendela; `kantor`: kantor malam (menara dengan banyak jendela kecil menyala, papan dinding redup);
// `terminal`: dunia kode (panel kode melayang); `kafe`: bokeh lampu hangat; `kelas`: ruang kelas (papan tulis besar, meja guru di kiri,
// murid berdiri di lantai kanan).
export type BlockSet = "mejaMalam" | "kantor" | "terminal" | "kafe" | "kelas";

// `belakang`: berdiri di balik meja (tubuh bawah tertutup meja); `meja`: berdiri di atas meja (karakter kecil seperti Claude Code).
export type Place = "belakang" | "meja";

export type BlockCast = {
  readonly character: CharacterId;
  readonly expression: string;
  // Nama gesture block (lambai, angkatTangan, tunjuk, sorak, menyerah, angkatBahu, facepalm, mikir, garukKepala, tepuk, pinggang, mengetik, netral).
  readonly motion?: string | null;
  readonly position: "kiri" | "tengah" | "kanan";
  // Bawaan: Ganjar `belakang`, lainnya `meja`.
  readonly place?: Place;
  readonly scale?: number;
};

export type BlockLine = {
  readonly who: CharacterId;
  // Detik sejak scene mulai.
  readonly from: number;
  // Perkiraan durasi ucapan (detik); setelah voiceover ada diganti durasi audio.
  readonly dur: number;
  // Teks caption bawah.
  readonly text: string;
  // Teks yang dikirim ke TTS bila beda dari `text` (angka dieja, singkatan dibaca utuh).
  readonly spoken?: string;
  // Tag emosi audio untuk TTS (mis. "deadpan", "frustrated"); dikirim sebagai `[tag] teks`. Butuh model eleven_v4.
  readonly tag?: string;
  // Waktu mulai tiap kata (detik sejak baris mulai) dari scribe setelah voiceover ada; jumlahnya harus sama dengan jumlah kata `text`.
  // Bila kosong, waktu kata diperkirakan dari panjang huruf.
  readonly wordTimes?: readonly number[];
  readonly expressions?: Readonly<Partial<Record<CharacterId, string>>>;
  readonly motions?: Readonly<Partial<Record<CharacterId, string>>>;
  readonly motionAt?: Readonly<Partial<Record<CharacterId, number>>>;
  // Ekspresi yang berganti di tengah baris (`at` = detik sejak baris mulai).
  readonly reactions?: readonly { readonly who: CharacterId; readonly expression: string; readonly at: number }[];
  // Shot untuk baris ini, atau daftar `{ at, kind }` bila berganti di tengah baris. Tanpa `shot`: `wide`.
  readonly shot?: ShotKind | readonly { readonly at: number; readonly kind: ShotKind }[];
  // Kamera mendorong pelan (zoom in 15%) selama shot ini.
  readonly push?: boolean;
  // Diisi `fitBlockScenes` dari voiceover.json: id klip (id scene + nomor urut) dan berkas audionya.
  readonly id?: string;
  readonly vo?: string;
  // Efek suara di baris ini: `name` = nama berkas di public/sfx/synth (tanpa .wav), `at` = detik sejak baris mulai (bawaan 0),
  // `volume` 0-1 (bawaan 0,5).
  readonly sfx?: readonly { readonly name: string; readonly at?: number; readonly volume?: number }[];
};

// Tulisan kapur di papan tulis latar `kelas`: tiap baris muncul (tersapu dari kiri) `at` detik sejak scene mulai. `hot` = kapur oranye muda,
// pakai hemat (satu sorotan per layar). Maks 4 baris per scene; area papan di bawah kartu judul.
export type BoardLine = { readonly text: string; readonly at: number; readonly hot?: boolean };

export type BlockScene = {
  readonly id: string;
  // Durasi minimal (detik); scene memanjang bila baris terakhir lebih panjang.
  readonly seconds: number;
  readonly set: BlockSet;
  readonly cast: readonly BlockCast[];
  readonly lines: readonly BlockLine[];
  // Tulisan di papan tulis (hanya latar `kelas`).
  readonly board?: readonly BoardLine[];
  // Arahan visual untuk dipoles tangan; tidak dirender.
  readonly note?: string;
};

export type BlockMeta = {
  // Judul video. Tampil di kartu atas hanya selama scene pertama (Title Case dari tema; hindari tanda hubung di tengah kata).
  readonly title: string;
  // Satu frasa di dalam `title` yang diwarnai oranye (opsional).
  readonly highlight?: string;
  // `false` mematikan whoosh antar scene (bawaan menyala).
  readonly sceneSfx?: boolean;
  // `false` mematikan pop kecil tiap ganti pembicara (bawaan menyala).
  readonly speakerPop?: boolean;
  // Jeda antar baris dan ekor scene saat voiceover (detik); bawaan 0,25 dan 0,6. Lebih kecil = video lebih rapat.
  readonly voGap?: number;
  readonly voTail?: number;
};
