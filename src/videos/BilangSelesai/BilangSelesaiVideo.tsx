import type React from "react";
import type { VideoComposition } from "../../compositions";
import { BlockReels, fitBlockScenes, totalFrames } from "../../block-reels";
import { META, VO_MANIFEST } from "./config";
import { BASE_SCENES } from "./scenes";
import { VO_FILES } from "./voiceover-files";

// Selesai itu Keputusanmu, Bukan AI! (Reels block 9:16). Tanpa BrandFooter: jenis folder ini memang tanpa footer (docs/block-reels.md).
// Durasi scene mengikuti voiceover bila sudah ada.
const SCENES = fitBlockScenes(BASE_SCENES, VO_MANIFEST, VO_FILES);
export const TOTAL_FRAMES = totalFrames(SCENES);

export const BilangSelesaiVideo: React.FC<{ readonly theme: string }> = ({ theme }) => <BlockReels theme={theme} meta={META} scenes={SCENES} />;

export const COMPOSITION: VideoComposition = {
  id: "BilangSelesai-Reels",
  component: BilangSelesaiVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: { theme: "gh" },
};
