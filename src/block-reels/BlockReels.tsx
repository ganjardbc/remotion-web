import type React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile } from "remotion";
import { LineCaption } from "../dialog-reels/Caption";
import { OnScreenText } from "../dialog-reels/DraftVideo";
import { ThemeProvider } from "../themes";
import { Stage } from "./Stage";
import type { BlockMeta, BlockScene } from "./types";

// Reels block 9:16: dialog karakter block di dunia diorama, ganti shot kamera per baris, kartu atas (judul, hal penting) dan caption bawah.
// Sengaja tanpa BrandFooter dan tanpa watermark (jenis folder ini dikecualikan dari aturan footer).

export const FPS = 30;
// Jeda setelah baris terakhir sebelum scene berganti.
const TAIL = 0.6;
// Bagian bawah (di atas meja gelap): caption karaoke dengan komponen yang sama dengan Reels dialog (src/dialog-reels/Caption.tsx),
// pusat teks di y ≈ 1640. Bagian atas: kartu judul (OnScreenText, komponen yang sama dengan Reels dialog), hanya selama scene pertama,
// di bawah zona aman atas antarmuka aplikasi (±250 px).
const CAPTION_BOX = { top: 1500, bottom: 1920 - 1780 } as const;
const CARD_TOP = 260;

export const sceneFrames = (scenes: readonly BlockScene[]): number[] =>
  scenes.map((s) => Math.ceil(Math.max(s.seconds, ...s.lines.map((l) => l.from + l.dur + TAIL)) * FPS));
export const totalFrames = (scenes: readonly BlockScene[]): number => sceneFrames(scenes).reduce((a, b) => a + b, 0);

const SFX_VOLUME = 0.5;
const POP_VOLUME = 0.22;
const WHOOSH_VOLUME = 0.3;

// Suara: voiceover per baris, lalu efek suara (public/sfx/synth): whoosh di awal tiap scene (kecuali yang pertama), pop kecil tiap baris (Ganjar dan Claude Code beda nada),
// dan `sfx` per baris. Voiceover (`l.vo`, dari fitBlockScenes) diputar di awal barisnya. Belum ada musik.
const Sound: React.FC<{ readonly scenes: readonly BlockScene[]; readonly starts: readonly number[]; readonly meta: BlockMeta }> = ({ scenes, starts, meta }) => (
  <>
    {scenes.flatMap((s, i) => s.lines.flatMap((l, k) => (l.vo ? [<Audio key={`vo-${i}-${k}`} src={l.vo} from={starts[i] + Math.round(l.from * FPS)} volume={1} />] : [])))}
    {meta.sceneSfx !== false
      ? starts.slice(1).map((start, i) => <Audio key={`whoosh-${i}`} src={staticFile("sfx/synth/whoosh.wav")} from={start} volume={WHOOSH_VOLUME} />)
      : null}
    {meta.speakerPop !== false
      ? scenes.flatMap((s, i) =>
          s.lines.map((l, k) => (
            <Audio key={`pop-${i}-${k}`} src={staticFile(`sfx/synth/${l.who === "ganjar" ? "pop_ganjar" : "pop_claude"}.wav`)} from={Math.max(0, starts[i] + Math.round(l.from * FPS) - 3)} volume={POP_VOLUME} />
          )),
        )
      : null}
    {scenes.flatMap((s, i) =>
      s.lines.flatMap((l, k) =>
        (l.sfx ?? []).map((x, n) => <Audio key={`sfx-${i}-${k}-${n}`} src={staticFile(`sfx/synth/${x.name}.wav`)} from={starts[i] + Math.round((l.from + (x.at ?? 0)) * FPS)} volume={x.volume ?? SFX_VOLUME} />),
      ),
    )}
  </>
);

export const BlockReels: React.FC<{ readonly theme: string; readonly meta: BlockMeta; readonly scenes: readonly BlockScene[] }> = ({ theme, meta, scenes }) => {
  const frames = sceneFrames(scenes);
  const starts = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
  // `highlight` (frasa di dalam judul) menjadi sorotan oranye lewat tanda `*...*`.
  const title = meta.highlight ? meta.title.replace(meta.highlight, `*${meta.highlight}*`) : meta.title;
  return (
    <ThemeProvider name={theme}>
      <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
        <Series>
          {scenes.map((s, i) => (
            <Series.Sequence key={s.id} name={s.id} durationInFrames={frames[i]} premountFor={FPS}>
              <Stage scene={s} />
              {i === 0 ? <OnScreenText scene={{ onScreenText: title, lines: [], tone: "biru" }} top={CARD_TOP} /> : null}
              {/* Gradasi gelap lembut di bawah supaya caption terbaca di atas tuts, meja, dan bahu depan shot overShoulder. */}
              <div style={{ position: "absolute", left: 0, top: 1380, width: 1080, height: 540, background: "linear-gradient(180deg, rgba(3,6,16,0) 0%, rgba(3,6,16,0.55) 45%, rgba(3,6,16,0.7) 100%)" }} />
              <LineCaption lines={s.lines} motion="baris" box={CAPTION_BOX} />
            </Series.Sequence>
          ))}
        </Series>
        <Sound scenes={scenes} starts={starts} meta={meta} />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
