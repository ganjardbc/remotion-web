import type React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SceneRenderer } from "./SceneRenderer";
import { SCENES, SCENE_FRAMES, TRANSITION_FRAMES, VUE_TUTORIAL_FRAMES } from "./scenes";
import { VueSfx } from "./VueSfx";

export { VUE_TUTORIAL_FRAMES };

// Transisi di batas scene i dan i+1 (11 batas): campuran fade, geser, dan wipe supaya tidak monoton.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: readonly TransitionPresentation<any>[] = [
  slide({ direction: "from-right" }),
  fade(),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
  fade(),
  slide({ direction: "from-left" }),
  fade(),
  wipe({ direction: "from-right" }),
  fade(),
  fade(),
];

// "Cara Install & Menggunakan Framework Vue JS": 12 scene, 1920x1080, ±3 menit. Contoh berbagai bidikan kamera 2D:
// wide, medium, close-up, push-in, pan, whip, dutch, handheld, split screen, picture-in-picture, sisipan layar,
// dan bidikan 30° dari belakang tangan. Transisi antar scene, efek suara, dan musik latar dengan ducking di VueSfx.
export const VueTutorialVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {SCENES.flatMap((spec, i) => [
        <TransitionSeries.Sequence key={spec.id} durationInFrames={SCENE_FRAMES[i]}>
          <SceneRenderer spec={spec} index={i} />
        </TransitionSeries.Sequence>,
        ...(i < SCENES.length - 1
          ? [<TransitionSeries.Transition key={`t${i}`} presentation={TRANSITIONS[i]} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />]
          : []),
      ])}
    </TransitionSeries>
    <VueSfx />
  </AbsoluteFill>
);
