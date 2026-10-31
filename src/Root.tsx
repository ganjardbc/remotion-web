import { Composition, Folder } from "remotion";
import { VUE_TUTORIAL_FRAMES, VueTutorialVideo } from "./videos/VueTutorial/VueTutorialVideo";
import { TOTAL_FRAMES as SEJARAH_AI_STORY_FRAMES } from "./videos/SejarahAIStory/config";
import { SejarahAIStoryReelsVideo } from "./videos/SejarahAIStoryReels/SejarahAIStoryReelsVideo";
import {
  ProgrammerBodohVideo,
  TOTAL_FRAMES as PROGRAMMER_BODOH_FRAMES,
} from "./videos/ProgrammerBodoh/ProgrammerBodohVideo";
import { Haiku55Video, TOTAL_FRAMES as HAIKU55_FRAMES } from "./videos/Haiku55/Haiku55Video";
import { ModelTeamVideo, TOTAL_FRAMES as MODEL_TEAM_FRAMES } from "./videos/ModelTeam/ModelTeamVideo";
import { RigDemoRoot } from "./videos/CharacterRigDemo/Root";
import { CHATBOT_VS_AIAGENT_PAHAMI_BEDANYA_FRAMES, ChatbotVsAIAgentPahamiBedanyaVideo } from "./videos/ChatbotVsAIAgentPahamiBedanya/ChatbotVsAIAgentPahamiBedanyaVideo";
import { KURIKULUM_AIENGINEER_GRATIS542_PELAJARAN_DAR_FRAMES, KurikulumAIEngineerGratis542PelajaranDarVideo } from "./videos/KurikulumAIEngineerGratis542PelajaranDar/KurikulumAIEngineerGratis542PelajaranDarVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="VueTutorial" component={VueTutorialVideo} durationInFrames={VUE_TUTORIAL_FRAMES} fps={30} width={1920} height={1080} />
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
        id="Haiku55-Reels"
        component={Haiku55Video}
        durationInFrames={HAIKU55_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="ModelTeam-Reels"
        component={ModelTeamVideo}
        durationInFrames={MODEL_TEAM_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Folder name="Characters">
        <RigDemoRoot />
      </Folder>
      <Composition id="ChatbotVsAIAgentPahamiBedanya-Reels" component={ChatbotVsAIAgentPahamiBedanyaVideo} durationInFrames={CHATBOT_VS_AIAGENT_PAHAMI_BEDANYA_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ theme: "gh" }} />
      <Composition id="KurikulumAIEngineerGratis542PelajaranDar-Reels" component={KurikulumAIEngineerGratis542PelajaranDarVideo} durationInFrames={KURIKULUM_AIENGINEER_GRATIS542_PELAJARAN_DAR_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ theme: "gh" }} />
    </>
  );
};
