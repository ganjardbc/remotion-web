import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { FileScene } from "./FileScene";
import { HookScene } from "./HookScene";
import { ProblemScene } from "./ProblemScene";
import { ResultScene } from "./ResultScene";
import { TipsScene } from "./TipsScene";

type Props = {
  readonly theme: string;
  readonly subtitle: string;
  readonly cta: string;
};

// 120 + 150 + 270 + 210 + 210 - 4 * 15 = 900 frames (30s @ 30fps)
export const ClaudeMdVideo: React.FC<Props> = ({ theme, subtitle, cta }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      <TransitionSeries name="CLAUDE.md">
        <TransitionSeries.Sequence
          name="Hook"
          durationInFrames={120}
          premountFor={fps}
        >
          <HookScene theme={theme} title="CLAUDE.md" subtitle={subtitle} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Problem"
          durationInFrames={150}
          premountFor={fps}
        >
          <ProblemScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="File"
          durationInFrames={270}
          premountFor={fps}
        >
          <FileScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Result"
          durationInFrames={210}
          premountFor={fps}
        >
          <ResultScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Tips"
          durationInFrames={210}
          premountFor={fps}
        >
          <TipsScene theme={theme} cta={cta} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
