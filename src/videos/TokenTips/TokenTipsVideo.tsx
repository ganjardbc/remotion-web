import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { HookScene } from "./HookScene";
import { OutroScene } from "./OutroScene";
import { TipScene } from "./TipScene";

type Props = {
  readonly theme: string;
  readonly subtitle: string;
  readonly cta: string;
};

// 120 + 3 * 210 + 210 - 4 * 15 = 900 frames (30s @ 30fps)
export const TokenTipsVideo: React.FC<Props> = ({ theme, subtitle, cta }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: 15 });
  const up = slide({ direction: "from-bottom" });

  return (
    <>
      <TransitionSeries name="3 Tips Hemat Token">
        <TransitionSeries.Sequence
          name="Hook"
          durationInFrames={120}
          premountFor={fps}
        >
          <HookScene theme={theme} subtitle={subtitle} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence
          name="Tip 1"
          durationInFrames={210}
          premountFor={fps}
        >
          <TipScene theme={theme} kind="clear" index={1} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={up} timing={timing} />
        <TransitionSeries.Sequence
          name="Tip 2"
          durationInFrames={210}
          premountFor={fps}
        >
          <TipScene theme={theme} kind="compact" index={2} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={up} timing={timing} />
        <TransitionSeries.Sequence
          name="Tip 3"
          durationInFrames={210}
          premountFor={fps}
        >
          <TipScene theme={theme} kind="file" index={3} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence
          name="Outro"
          durationInFrames={210}
          premountFor={fps}
        >
          <OutroScene theme={theme} cta={cta} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
