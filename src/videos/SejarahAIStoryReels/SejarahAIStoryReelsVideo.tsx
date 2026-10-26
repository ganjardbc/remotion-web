import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Fragment } from "react";
import { useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { BEAT_FRAMES, BEATS, TRANSITION_FRAMES } from "../SejarahAIStory/config";
import { ReelsScene } from "./ReelsScene";

type Props = { readonly theme: string };

// Versi 9:16 dari Sejarah AI Story: panel penjelasan di atas, panel karakter di bawah.
export const SejarahAIStoryReelsVideo: React.FC<Props> = ({ theme }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });
  return (
    <>
      <TransitionSeries name="Sejarah AI Story Reels">
        {BEATS.map((beat, i) => {
          const last = i === BEATS.length - 1;
          return (
            <Fragment key={beat.id}>
              <TransitionSeries.Sequence
                name={beat.id}
                durationInFrames={BEAT_FRAMES[i] + (last ? 0 : TRANSITION_FRAMES)}
                premountFor={fps}
              >
                <ReelsScene index={i} theme={theme} />
              </TransitionSeries.Sequence>
              {last ? null : <TransitionSeries.Transition presentation={fade()} timing={timing} />}
            </Fragment>
          );
        })}
      </TransitionSeries>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
