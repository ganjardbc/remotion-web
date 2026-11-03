import type React from "react";

// Daftar komposisi otomatis: setiap folder src/videos/<Nama> yang punya berkas <Nama>Video.tsx atau
// <Nama>Carousel.tsx dan mengekspor `COMPOSITION` terdaftar di Studio tanpa mengubah src/Root.tsx.
// Folder baru cukup dibuat dengan scripts/new-reels.mjs, new-carousel.mjs, atau new-video.mjs.

export type VideoComposition = {
  readonly id: string;
  readonly component: React.FC<{ readonly theme: string }>;
  readonly durationInFrames: number;
  readonly fps: number;
  readonly width: number;
  readonly height: number;
  readonly defaultProps: { readonly theme: string };
};

// require.context disediakan bundler (Rspack/webpack) saat build; TypeScript belum mengenalnya.
type RequireContext = { keys(): string[]; (key: string): unknown };
type BundlerRequire = { context(directory: string, recursive: boolean, filter: RegExp): RequireContext };

// Nama berkas harus sama dengan nama folder (\1), jadi berkas lain di folder video tidak ikut terbaca.
const context = (require as unknown as BundlerRequire).context("./videos", true, /^\.\/([^/]+)\/\1(Video|Carousel)\.tsx$/);

const found = context.keys().flatMap((key) => {
  const mod = context(key) as { readonly COMPOSITION?: VideoComposition };
  return mod.COMPOSITION ? [mod.COMPOSITION] : [];
});

const ids = found.map((c) => c.id);
const duplicate = ids.find((id, i) => ids.indexOf(id) !== i);
if (duplicate) throw new Error(`Id komposisi kembar: ${duplicate}`);

export const COMPOSITIONS: readonly VideoComposition[] = [...found].sort((a, b) => a.id.localeCompare(b.id));
