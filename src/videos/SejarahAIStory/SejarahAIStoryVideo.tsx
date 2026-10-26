import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { useVideoConfig } from "remotion";
import { BeatScene } from "./BeatScene";
import { BEAT_FRAMES, BEATS, TRANSITION_FRAMES } from "./config";

export const SejarahAIStoryVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });
  return (
    <TransitionSeries name="Sejarah AI Story">
        {BEATS.map((beat, i) => {
          const last = i === BEATS.length - 1;
          return (
            <Fragment key={beat.id}>
              <TransitionSeries.Sequence
                name={beat.id}
                durationInFrames={BEAT_FRAMES[i] + (last ? 0 : TRANSITION_FRAMES)}
                premountFor={fps}
              >
                <BeatScene index={i} />
              </TransitionSeries.Sequence>
              {last ? null : <TransitionSeries.Transition presentation={fade()} timing={timing} />}
            </Fragment>
          );
        })}
    </TransitionSeries>
  );
};
