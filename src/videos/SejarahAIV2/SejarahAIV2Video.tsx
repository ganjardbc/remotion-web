import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClosingScene } from "./ClosingScene";
import {
  ERAS,
  eraTiming,
  FPS,
  SCENE_SECONDS,
  TRANSITION_FRAMES,
} from "./config";
import { CtaScene } from "./CtaScene";
import { eraScenes } from "./EraScene";
import { HookScene } from "./HookScene";

type Props = {
  readonly theme: string;
};

const scenes = [
  { name: "Hook", seconds: SCENE_SECONDS.hook, Scene: HookScene },
  ...ERAS.map((era, i) => ({
    name: `Era ${era.year}`,
    seconds: eraTiming(era).seconds,
    Scene: eraScenes[i],
  })),
  { name: "Closing", seconds: SCENE_SECONDS.closing, Scene: ClosingScene },
  { name: "CTA", seconds: SCENE_SECONDS.cta, Scene: CtaScene },
];

export const TOTAL_FRAMES = scenes.reduce((n, s) => n + s.seconds * FPS, 0);

export const SejarahAIV2Video: React.FC<Props> = ({ theme }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

  return (
    <>
      <TransitionSeries name="Sejarah AI">
        {scenes.map(({ name, seconds, Scene }, i) => {
          const last = i === scenes.length - 1;
          return (
            <Fragment key={name}>
              <TransitionSeries.Sequence
                name={name}
                durationInFrames={
                  seconds * FPS + (last ? 0 : TRANSITION_FRAMES)
                }
                premountFor={fps}
              >
                <Scene theme={theme} />
              </TransitionSeries.Sequence>
              {last ? null : (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={timing}
                />
              )}
            </Fragment>
          );
        })}
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
