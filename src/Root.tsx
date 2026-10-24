import { Composition, Folder } from "remotion";
import {
  SejarahAIVideo,
  TOTAL_FRAMES as SEJARAH_AI_FRAMES,
} from "./videos/SejarahAI/SejarahAIVideo";
import { Scene01_Hook } from "./videos/SejarahAI/Scene01_Hook";
import { Scene02_SebelumAI } from "./videos/SejarahAI/Scene02_SebelumAI";
import { Scene03_AlanTuring } from "./videos/SejarahAI/Scene03_AlanTuring";
import { Scene04_AIWinter } from "./videos/SejarahAI/Scene04_AIWinter";
import { Scene05_Kebangkitan } from "./videos/SejarahAI/Scene05_Kebangkitan";
import { Scene06_DeepLearning } from "./videos/SejarahAI/Scene06_DeepLearning";
import { Scene07_EraKita } from "./videos/SejarahAI/Scene07_EraKita";
import { Scene08_Outro } from "./videos/SejarahAI/Scene08_Outro";
import { DefinitionScene } from "./videos/AIAgent/DefinitionScene";
import { IntroScene } from "./videos/AIAgent/IntroScene";
import { LoopScene } from "./videos/AIAgent/LoopScene";
import { OutroScene } from "./videos/AIAgent/OutroScene";
import { ToolsScene } from "./videos/AIAgent/ToolsScene";
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
import { FileScene } from "./videos/ClaudeMd/FileScene";
import { HookScene } from "./videos/ClaudeMd/HookScene";
import { ProblemScene } from "./videos/ClaudeMd/ProblemScene";
import { ResultScene } from "./videos/ClaudeMd/ResultScene";
import { TipsScene } from "./videos/ClaudeMd/TipsScene";
import { CharacterSheet } from "./characters";

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
      <Folder name="SejarahAI-Scenes">
        <Composition
          id="SejarahAI-Hook"
          component={Scene01_Hook}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-SebelumAI"
          component={Scene02_SebelumAI}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-AlanTuring"
          component={Scene03_AlanTuring}
          durationInFrames={210}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-AIWinter"
          component={Scene04_AIWinter}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-Kebangkitan"
          component={Scene05_Kebangkitan}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-DeepLearning"
          component={Scene06_DeepLearning}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-EraKita"
          component={Scene07_EraKita}
          durationInFrames={210}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="SejarahAI-Outro"
          component={Scene08_Outro}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            theme: "gh",
            cta: "Mau tau lebih dalam? Follow dulu.",
          }}
        />
      </Folder>
      <Composition
        id="SejarahAIV2-Reels"
        component={SejarahAIV2Video}
        durationInFrames={SEJARAH_AI_V2_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ theme: "gh" }}
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
      <Folder name="ClaudeMd-Scenes">
        <Composition
          id="ClaudeMd-Hook"
          component={HookScene}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            theme: "gh",
            title: "CLAUDE.md",
            subtitle: "Ingatan permanen untuk project kamu.",
          }}
        />
        <Composition
          id="ClaudeMd-Problem"
          component={ProblemScene}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="ClaudeMd-File"
          component={FileScene}
          durationInFrames={270}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="ClaudeMd-Result"
          component={ResultScene}
          durationInFrames={210}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh" }}
        />
        <Composition
          id="ClaudeMd-Tips"
          component={TipsScene}
          durationInFrames={210}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ theme: "gh", cta: "Simpan buat nanti." }}
        />
      </Folder>
      <Folder name="AIAgent-Scenes">
        <Composition
          id="Intro"
          component={IntroScene}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "AI Agent",
            subtitle: "Bukan sekadar chatbot.",
          }}
        />
        <Composition
          id="Definition"
          component={DefinitionScene}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Loop"
          component={LoopScene}
          durationInFrames={255}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Tools"
          component={ToolsScene}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Outro"
          component={OutroScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ tagline: "AI Agent, rekan kerja digital Anda." }}
        />
      </Folder>
      <Composition
        id="CharacterSheet"
        component={CharacterSheet}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
