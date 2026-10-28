import { Composition, Folder } from "remotion";
import {
  SejarahAIVideo,
  TOTAL_FRAMES as SEJARAH_AI_FRAMES,
} from "./videos/SejarahAI/SejarahAIVideo";
import {
  AgenBodohVideo,
  TOTAL_FRAMES as AGEN_BODOH_FRAMES,
} from "./videos/AgenBodoh/AgenBodohVideo";
import {
  FileDibajakVideo,
  TOTAL_FRAMES as FILE_DIBAJAK_FRAMES,
} from "./videos/FileDibajak/FileDibajakVideo";
import { ClaudeLoopVideo } from "./videos/ClaudeLoop/ClaudeLoopVideo";
import {
  GratisMurahVideo,
  TOTAL_FRAMES as GRATIS_MURAH_FRAMES,
} from "./videos/GratisMurah/GratisMurahVideo";
import { OpenCode9RouterVideo } from "./videos/OpenCode9Router/OpenCode9RouterVideo";
import {
  PenulisUIVideo,
  TOTAL_FRAMES as PENULIS_UI_FRAMES,
} from "./videos/PenulisUI/PenulisUIVideo";
import {
  IzinPagarVideo,
  TOTAL_FRAMES as IZIN_PAGAR_FRAMES,
} from "./videos/IzinPagar/IzinPagarVideo";
import {
  SejarahAIV2Video,
  TOTAL_FRAMES as SEJARAH_AI_V2_FRAMES,
} from "./videos/SejarahAIV2/SejarahAIV2Video";
import { TokenTipsVideo } from "./videos/TokenTips/TokenTipsVideo";
import { ClaudeMdVideo } from "./videos/ClaudeMd/ClaudeMdVideo";
import { VUE_TUTORIAL_FRAMES, VueTutorialVideo } from "./videos/VueTutorial/VueTutorialVideo";
import { SejarahAIStoryVideo } from "./videos/SejarahAIStory/SejarahAIStoryVideo";
import { TOTAL_FRAMES as SEJARAH_AI_STORY_FRAMES } from "./videos/SejarahAIStory/config";
import { SejarahAIStoryReelsVideo } from "./videos/SejarahAIStoryReels/SejarahAIStoryReelsVideo";
import {
  ProgrammerBodohVideo,
  TOTAL_FRAMES as PROGRAMMER_BODOH_FRAMES,
} from "./videos/ProgrammerBodoh/ProgrammerBodohVideo";
import { RigDemoRoot } from "./videos/CharacterRigDemo/Root";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SejarahAI-Reels"
        component={SejarahAIVideo}
        durationInFrames={SEJARAH_AI_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: "gh",
          cta: "Mau tau lebih dalam? Follow dulu.",
        }}
      />
      <Composition
        id="SejarahAIV2-Reels"
        component={SejarahAIV2Video}
        durationInFrames={SEJARAH_AI_V2_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition id="VueTutorial" component={VueTutorialVideo} durationInFrames={VUE_TUTORIAL_FRAMES} fps={30} width={1920} height={1080} />
      <Composition
        id="SejarahAIStory"
        component={SejarahAIStoryVideo}
        durationInFrames={SEJARAH_AI_STORY_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SejarahAIStory-Reels"
        component={SejarahAIStoryReelsVideo}
        durationInFrames={SEJARAH_AI_STORY_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="ProgrammerBodoh-Reels"
        component={ProgrammerBodohVideo}
        durationInFrames={PROGRAMMER_BODOH_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh", sfx: "free" }}
      />
      <Composition
        id="AgenBodoh-Reels"
        component={AgenBodohVideo}
        durationInFrames={AGEN_BODOH_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="GratisMurah-Reels"
        component={GratisMurahVideo}
        durationInFrames={GRATIS_MURAH_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="FileDibajak-Reels"
        component={FileDibajakVideo}
        durationInFrames={FILE_DIBAJAK_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="PenulisUI-Reels"
        component={PenulisUIVideo}
        durationInFrames={PENULIS_UI_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="OpenCode9Router-Reels"
        component={OpenCode9RouterVideo}
        durationInFrames={1425}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="IzinPagar-Reels"
        component={IzinPagarVideo}
        durationInFrames={IZIN_PAGAR_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="TokenTips-Reels"
        component={TokenTipsVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: "gh",
          subtitle: "3 kebiasaan kecil yang bikin hemat.",
          cta: "Simpan buat nanti.",
        }}
      />
      <Composition
        id="ClaudeLoop-Reels"
        component={ClaudeLoopVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: "gh",
          command: "5m cek status deploy",
          cta: "Simpan buat nanti.",
        }}
      />
      <Composition
        id="ClaudeMd-Reels"
        component={ClaudeMdVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          theme: "gh",
          subtitle: "Ingatan permanen untuk project kamu.",
          cta: "Simpan buat nanti.",
        }}
      />
      <Folder name="Characters">
        <RigDemoRoot />
      </Folder>
    </>
  );
};
