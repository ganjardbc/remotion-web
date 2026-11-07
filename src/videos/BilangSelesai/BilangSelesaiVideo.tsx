import type React from "react";
import type { VideoComposition } from "../../compositions";
import { BlockReels, totalFrames } from "../../block-reels";
import { META } from "./config";
import { BASE_SCENES } from "./scenes";

// AI Bilang Selesai, Menurut Siapa? (Reels block 9:16). Tanpa BrandFooter: jenis folder ini memang tanpa footer (docs/block-reels.md).
export const TOTAL_FRAMES = totalFrames(BASE_SCENES);

export const BilangSelesaiVideo: React.FC<{ readonly theme: string }> = ({ theme }) => <BlockReels theme={theme} meta={META} scenes={BASE_SCENES} />;

export const COMPOSITION: VideoComposition = {
  id: "BilangSelesai-Reels",
  component: BilangSelesaiVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: { theme: "gh" },
};
