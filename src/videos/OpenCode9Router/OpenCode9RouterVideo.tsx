import { Series, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClosingScene } from "./ClosingScene";
import { ContextScene } from "./ContextScene";
import { ForbiddenScene } from "./ForbiddenScene";
import { HookScene } from "./HookScene";
import { ModelScene } from "./ModelScene";
import { ParamScene } from "./ParamScene";

type Props = {
  readonly theme: string;
};

// 105 + 150 + 330 + 330 + 330 + 180 = 1425 frames (47.5s @ 30fps)
export const OpenCode9RouterVideo: React.FC<Props> = ({ theme }) => {
  const { fps } = useVideoConfig();

  return (
    <>
      <Series>
        <Series.Sequence name="Hook" durationInFrames={105} premountFor={fps}>
          <HookScene theme={theme} />
        </Series.Sequence>
        <Series.Sequence
          name="Context"
          durationInFrames={150}
          premountFor={fps}
        >
          <ContextScene theme={theme} />
        </Series.Sequence>
        <Series.Sequence name="Model" durationInFrames={330} premountFor={fps}>
          <ModelScene theme={theme} />
        </Series.Sequence>
        <Series.Sequence name="403" durationInFrames={330} premountFor={fps}>
          <ForbiddenScene theme={theme} />
        </Series.Sequence>
        <Series.Sequence name="400" durationInFrames={330} premountFor={fps}>
          <ParamScene theme={theme} />
        </Series.Sequence>
        <Series.Sequence
          name="Closing"
          durationInFrames={180}
          premountFor={fps}
        >
          <ClosingScene theme={theme} />
        </Series.Sequence>
      </Series>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
    </>
  );
};
