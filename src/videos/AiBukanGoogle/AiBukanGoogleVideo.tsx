import type React from "react";
import { AbsoluteFill } from "remotion";
import {
  linearTiming,
  TransitionSeries,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type { VideoComposition } from "../../compositions";
import { SceneRenderer } from "./SceneRenderer";
import {
  SCENES,
  SCENE_FRAMES,
  TRANSITION_FRAMES,
  AI_BUKAN_GOOGLE_FRAMES,
} from "./scenes";
import { AiBukanGoogleSfx } from "./AiBukanGoogleSfx";
import { BrandFooter } from "../../BrandFooter";
import { ThemeProvider } from "../../themes";

export { AI_BUKAN_GOOGLE_FRAMES };

// Transisi di batas scene i dan i+1; daftar ini diulang bila scene lebih banyak.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: readonly TransitionPresentation<any>[] = [
  slide({ direction: "from-right" }),
  fade(),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-left" }),
  fade(),
];

// "Belajar AI #1: AI Bukan Google": 1920x1080, 30 fps. Scene di scenes.tsx, efek suara dan musik di AiBukanGoogleSfx.tsx.
export const AiBukanGoogleVideo: React.FC<{ readonly theme: string }> = ({
  theme,
}) => (
  <ThemeProvider name={theme}>
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {SCENES.flatMap((spec, i) => [
          <TransitionSeries.Sequence
            key={spec.id}
            durationInFrames={SCENE_FRAMES[i]}
          >
            <SceneRenderer spec={spec} index={i} />
          </TransitionSeries.Sequence>,
          ...(i < SCENES.length - 1
            ? [
                <TransitionSeries.Transition
                  key={`t${i}`}
                  presentation={TRANSITIONS[i % TRANSITIONS.length]}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />,
              ]
            : []),
        ])}
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
      <AiBukanGoogleSfx />
    </AbsoluteFill>
  </ThemeProvider>
);

export const COMPOSITION: VideoComposition = {
  id: "AiBukanGoogle",
  component: AiBukanGoogleVideo,
  durationInFrames: AI_BUKAN_GOOGLE_FRAMES,
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: { theme: "gh" },
};
