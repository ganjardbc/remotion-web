import type React from "react";
import { DraftVideo, fitScenes, totalFrames } from "../DraftKit";
import { BASE_SCENES, META } from "./scenes";
import { VO_MANIFEST } from "./voiceover";
import { VO_FILES } from "./voiceover-files";

// Chatbot vs AI Agent: Pahami Bedanya! (reels 9:16, dialog). Durasi scene mengikuti voice over bila sudah ada.
const SCENES = fitScenes(BASE_SCENES, VO_MANIFEST, VO_FILES);
export const CHATBOT_VS_AIAGENT_PAHAMI_BEDANYA_FRAMES = totalFrames(SCENES);

export const ChatbotVsAIAgentPahamiBedanyaVideo: React.FC<{ readonly theme: string }> = ({ theme }) => <DraftVideo theme={theme} meta={META} scenes={SCENES} />;
