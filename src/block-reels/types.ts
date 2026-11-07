import type { CharacterId, ShotKind } from "../dialog-reels/types";

// Bentuk data Reels block 9:16: dialog antar karakter block di dunia diorama (lapisan datar berparalaks, bukan 3D penuh).
// Tanpa BrandFooter dan tanpa watermark; layar sepenuhnya milik dunia, shot kamera, dan caption atas.

export type { CharacterId, ShotKind };

// Latar diorama. `mejaMalam`: kota malam di balik jendela; `kantor`: kantor malam (menara dengan banyak jendela kecil menyala, papan dinding redup);
// `terminal`: dunia kode (panel kode melayang); `kafe`: bokeh lampu hangat.
export type BlockSet = "mejaMalam" | "kantor" | "terminal" | "kafe";

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
  // Teks caption atas.
  readonly text: string;
  readonly expressions?: Readonly<Partial<Record<CharacterId, string>>>;
  readonly motions?: Readonly<Partial<Record<CharacterId, string>>>;
  readonly motionAt?: Readonly<Partial<Record<CharacterId, number>>>;
  // Ekspresi yang berganti di tengah baris (`at` = detik sejak baris mulai).
  readonly reactions?: readonly { readonly who: CharacterId; readonly expression: string; readonly at: number }[];
  // Shot untuk baris ini, atau daftar `{ at, kind }` bila berganti di tengah baris. Tanpa `shot`: `wide`.
  readonly shot?: ShotKind | readonly { readonly at: number; readonly kind: ShotKind }[];
  // Kamera mendorong pelan (zoom in 15%) selama shot ini.
  readonly push?: boolean;
};

export type BlockScene = {
  readonly id: string;
  // Durasi minimal (detik); scene memanjang bila baris terakhir lebih panjang.
  readonly seconds: number;
  readonly set: BlockSet;
  readonly cast: readonly BlockCast[];
  readonly lines: readonly BlockLine[];
  // Arahan visual untuk dipoles tangan; tidak dirender.
  readonly note?: string;
};

export type BlockMeta = {
  readonly title: string;
};
