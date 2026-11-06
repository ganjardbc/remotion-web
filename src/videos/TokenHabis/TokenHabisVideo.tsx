import type React from "react";
import type { VideoComposition } from "../../compositions";
import { DraftVideo, fitScenes, totalFrames } from "../../dialog-reels";
import { META, VO_MANIFEST } from "./config";
import { BASE_SCENES } from "./scenes";
import { VO_FILES } from "./voiceover-files";

// Token Habis, Skill Developer Ikut Habis (Reels dialog 9:16). Durasi scene mengikuti voiceover bila sudah ada; DraftVideo merender panggung,
// teks layar, subtitle, BrandFooter sekali di root, suara, dan musik.
const SCENES = fitScenes(BASE_SCENES, VO_MANIFEST, VO_FILES);
export const TOTAL_FRAMES = totalFrames(SCENES);

export const TokenHabisVideo: React.FC<{ readonly theme: string }> = ({ theme }) => <DraftVideo theme={theme} meta={META} scenes={SCENES} />;

export const COMPOSITION: VideoComposition = {
  id: "TokenHabis-Reels",
  component: TokenHabisVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: { theme: "gh" },
};
