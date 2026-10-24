import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { DefinitionScene } from "./DefinitionScene";
import { IntroScene } from "./IntroScene";
import { LoopScene } from "./LoopScene";
import { OutroScene } from "./OutroScene";
import { ToolsScene } from "./ToolsScene";

type Props = {
  readonly theme: string;
  readonly tagline: string;
};

const transition = linearTiming({ durationInFrames: 15 });

// 165 + 195 + 255 + 195 + 150 - 4 * 15 = 900 frames (30s @ 30fps)
export const AIAgentVideo: React.FC<Props> = ({ theme, tagline }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      <TransitionSeries name="AI Agent">
        <TransitionSeries.Sequence
          name="Intro"
          durationInFrames={165}
          premountFor={fps}
        >
          <IntroScene
            theme={theme}
            title="AI Agent"
            subtitle="Bukan sekadar chatbot."
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Definition"
          durationInFrames={195}
          premountFor={fps}
        >
          <DefinitionScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Loop"
          durationInFrames={255}
          premountFor={fps}
        >
          <LoopScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Tools"
          durationInFrames={195}
          premountFor={fps}
        >
          <ToolsScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transition}
        />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={150}
          premountFor={fps}
        >
          <OutroScene theme={theme} tagline={tagline} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
