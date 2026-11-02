import { Composition, Folder } from "remotion";
import { VUE_TUTORIAL_FRAMES, VueTutorialVideo } from "./videos/VueTutorial/VueTutorialVideo";
import { TOTAL_FRAMES as SEJARAH_AI_STORY_FRAMES } from "./videos/SejarahAIStoryReels/config";
import { SejarahAIStoryReelsVideo } from "./videos/SejarahAIStoryReels/SejarahAIStoryReelsVideo";
import {
  ProgrammerBodohVideo,
  TOTAL_FRAMES as PROGRAMMER_BODOH_FRAMES,
} from "./videos/ProgrammerBodoh/ProgrammerBodohVideo";
import { Haiku55Video, TOTAL_FRAMES as HAIKU55_FRAMES } from "./videos/Haiku55/Haiku55Video";
import { ModelTeamVideo, TOTAL_FRAMES as MODEL_TEAM_FRAMES } from "./videos/ModelTeam/ModelTeamVideo";
import { ClaudeMemVideo, TOTAL_FRAMES as CLAUDE_MEM_FRAMES } from "./videos/ClaudeMem/ClaudeMemVideo";
import { ReviewKodeAIVideo, TOTAL_FRAMES as REVIEW_KODE_AI_FRAMES } from "./videos/ReviewKodeAI/ReviewKodeAIVideo";
import { PromptPanjangVideo, TOTAL_FRAMES as PROMPT_PANJANG_FRAMES } from "./videos/PromptPanjang/PromptPanjangVideo";
import { RigDemoRoot } from "./videos/CharacterRigDemo/Root";
import { CHATBOT_VS_AIAGENT_PAHAMI_BEDANYA_FRAMES, ChatbotVsAIAgentPahamiBedanyaVideo } from "./videos/ChatbotVsAIAgentPahamiBedanya/ChatbotVsAIAgentPahamiBedanyaVideo";
import { KURIKULUM_AIENGINEER_GRATIS542_PELAJARAN_DAR_FRAMES, KurikulumAIEngineerGratis542PelajaranDarVideo } from "./videos/KurikulumAIEngineerGratis542PelajaranDar/KurikulumAIEngineerGratis542PelajaranDarVideo";
import { AGEN_BODOH_CAROUSEL_SLIDES, AgenBodohCarousel } from "./videos/AgenBodoh/AgenBodohCarousel";
import { MODEL_MURAH_CAROUSEL_SLIDES, ModelMurahCarousel } from "./videos/ModelMurah/ModelMurahCarousel";
import { JUNIOR_HILANG_CAROUSEL_SLIDES, JuniorHilangCarousel } from "./videos/JuniorHilang/JuniorHilangCarousel";

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
      <Composition
        id="ClaudeMem-Reels"
        component={ClaudeMemVideo}
        durationInFrames={CLAUDE_MEM_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="ReviewKodeAI-Reels"
        component={ReviewKodeAIVideo}
        durationInFrames={REVIEW_KODE_AI_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
      />
      <Composition
        id="PromptPanjang-Reels"
        component={PromptPanjangVideo}
        durationInFrames={PROMPT_PANJANG_FRAMES}
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
      <Composition id="AgenBodoh-Carousel" component={AgenBodohCarousel} durationInFrames={AGEN_BODOH_CAROUSEL_SLIDES} fps={1} width={1080} height={1350} defaultProps={{ theme: "gh" }} />
      <Composition id="ModelMurah-Carousel" component={ModelMurahCarousel} durationInFrames={MODEL_MURAH_CAROUSEL_SLIDES} fps={1} width={1080} height={1350} defaultProps={{ theme: "gh" }} />
      <Composition id="JuniorHilang-Carousel" component={JuniorHilangCarousel} durationInFrames={JUNIOR_HILANG_CAROUSEL_SLIDES} fps={1} width={1080} height={1350} defaultProps={{ theme: "gh" }} />
    </>
  );
};
