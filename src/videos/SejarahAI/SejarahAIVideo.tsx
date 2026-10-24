import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { Scene01_Hook } from "./Scene01_Hook";
import { Scene02_SebelumAI } from "./Scene02_SebelumAI";
import { Scene03_AlanTuring } from "./Scene03_AlanTuring";
import { Scene04_AIWinter } from "./Scene04_AIWinter";
import { Scene05_Kebangkitan } from "./Scene05_Kebangkitan";
import { Scene06_DeepLearning } from "./Scene06_DeepLearning";
import { Scene07_EraKita } from "./Scene07_EraKita";
import { Scene08_Outro } from "./Scene08_Outro";

type Props = {
  readonly theme: string;
  readonly cta: string;
};

// Scene durations: 150+180+210+180+180+240+210+180 = 1530
// Transitions: 7 × 15 = 105
// Total: 1530 - 105 = 1425 frames (47.5s @ 30fps)
export const TOTAL_FRAMES = 1425;

export const SejarahAIVideo: React.FC<Props> = ({ theme, cta }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      <TransitionSeries name="Sejarah AI">
        <TransitionSeries.Sequence
          name="Hook"
          durationInFrames={150}
          premountFor={fps}
        >
          <Scene01_Hook theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Sebelum AI"
          durationInFrames={180}
          premountFor={fps}
        >
          <Scene02_SebelumAI theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Alan Turing"
          durationInFrames={210}
          premountFor={fps}
        >
          <Scene03_AlanTuring theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="AI Winter"
          durationInFrames={180}
          premountFor={fps}
        >
          <Scene04_AIWinter theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Kebangkitan"
          durationInFrames={180}
          premountFor={fps}
        >
          <Scene05_Kebangkitan theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Deep Learning"
          durationInFrames={240}
          premountFor={fps}
        >
          <Scene06_DeepLearning theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Era Kita"
          durationInFrames={210}
          premountFor={fps}
        >
          <Scene07_EraKita theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={180}
          premountFor={fps}
        >
          <Scene08_Outro theme={theme} cta={cta} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
