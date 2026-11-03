import type React from "react";
import { CarouselDeck } from "../../carousel/CarouselDeck";
import { CAROUSEL } from "./carousel.content";
import type { VideoComposition } from "../../compositions";

// Carousel 4:5 "Model Murah Bisa Menjebak". Satu frame = satu slide.
export const MODEL_MURAH_CAROUSEL_SLIDES = CAROUSEL.slides.length;

export const ModelMurahCarousel: React.FC<{ readonly theme: string }> = ({ theme }) => <CarouselDeck theme={theme} spec={CAROUSEL} />;

export const COMPOSITION: VideoComposition = {
  id: "ModelMurah-Carousel",
  component: ModelMurahCarousel,
  durationInFrames: MODEL_MURAH_CAROUSEL_SLIDES,
  fps: 1,
  width: 1080,
  height: 1350,
  defaultProps: { theme: "gh" },
};
