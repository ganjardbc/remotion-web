import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { CycleScene } from "./CycleScene";
import { HookScene } from "./HookScene";
import { ModesScene } from "./ModesScene";
import { UseScene } from "./UseScene";
import { WhatScene } from "./WhatScene";

type Props = {
  readonly theme: string;
  readonly command: string;
  readonly cta: string;
};

// 120 + 150 + 240 + 210 + 240 - 4 * 15 = 900 frames (30s @ 30fps)
export const ClaudeLoopVideo: React.FC<Props> = ({ theme, command, cta }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: 15 });

  return (
    <>
      <TransitionSeries name="Claude Code LOOP">
        <TransitionSeries.Sequence
          name="Hook"
          durationInFrames={120}
          premountFor={fps}
        >
          <HookScene theme={theme} command={command} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence
          name="What"
          durationInFrames={150}
          premountFor={fps}
        >
          <WhatScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={timing}
        />
        <TransitionSeries.Sequence
          name="Cycle"
          durationInFrames={240}
          premountFor={fps}
        >
          <CycleScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={timing}
        />
        <TransitionSeries.Sequence
          name="Modes"
          durationInFrames={210}
          premountFor={fps}
        >
          <ModesScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence
          name="Use"
          durationInFrames={240}
          premountFor={fps}
        >
          <UseScene theme={theme} cta={cta} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
