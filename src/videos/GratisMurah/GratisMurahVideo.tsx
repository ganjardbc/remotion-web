import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClosingScene } from "./ClosingScene";
import { FPS, SCENE_SECONDS, TRANSITION_FRAMES } from "./config";
import { CtaScene } from "./CtaScene";
import { FallbackScene } from "./FallbackScene";
import { HookScene } from "./HookScene";
import { RelateScene } from "./RelateScene";
import { SafetyScene } from "./SafetyScene";
import { UrgencyScene } from "./UrgencyScene";

type Props = {
  readonly theme: string;
};

const scenes = [
  { name: "Hook", seconds: SCENE_SECONDS.hook, Scene: HookScene },
  { name: "Relate", seconds: SCENE_SECONDS.relate, Scene: RelateScene },
  { name: "Fallback", seconds: SCENE_SECONDS.fallback, Scene: FallbackScene },
  { name: "Urgency", seconds: SCENE_SECONDS.urgency, Scene: UrgencyScene },
  { name: "Safety", seconds: SCENE_SECONDS.safety, Scene: SafetyScene },
  { name: "Closing", seconds: SCENE_SECONDS.closing, Scene: ClosingScene },
  { name: "CTA", seconds: SCENE_SECONDS.cta, Scene: CtaScene },
] as const;

export const TOTAL_FRAMES = scenes.reduce((n, s) => n + s.seconds * FPS, 0);

export const GratisMurahVideo: React.FC<Props> = ({ theme }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

  return (
    <>
      <TransitionSeries name="Gratis Bukan Berarti Murah">
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
