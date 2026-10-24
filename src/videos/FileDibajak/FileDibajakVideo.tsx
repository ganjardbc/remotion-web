import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClosingScene } from "./ClosingScene";
import { FPS, SCENE_SECONDS, TRANSITION_FRAMES } from "./config";
import { CtaScene } from "./CtaScene";
import { HookScene } from "./HookScene";
import { RelateScene } from "./RelateScene";
import { ShiftScene } from "./ShiftScene";
import { UrgencyScene } from "./UrgencyScene";

type Props = {
  readonly theme: string;
};

const scenes = [
  { name: "Hook", seconds: SCENE_SECONDS.hook, Scene: HookScene },
  { name: "Relate", seconds: SCENE_SECONDS.relate, Scene: RelateScene },
  { name: "Shift", seconds: SCENE_SECONDS.shift, Scene: ShiftScene },
  { name: "Urgency", seconds: SCENE_SECONDS.urgency, Scene: UrgencyScene },
  { name: "Closing", seconds: SCENE_SECONDS.closing, Scene: ClosingScene },
  { name: "CTA", seconds: SCENE_SECONDS.cta, Scene: CtaScene },
] as const;

export const TOTAL_FRAMES = scenes.reduce((n, s) => n + s.seconds * FPS, 0);

export const FileDibajakVideo: React.FC<Props> = ({ theme }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

  return (
    <>
      <TransitionSeries name="File Ini Bisa Dibajak Agenmu">
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
