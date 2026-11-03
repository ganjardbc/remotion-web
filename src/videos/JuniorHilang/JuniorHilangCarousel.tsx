import type React from "react";
import { CarouselDeck } from "../../carousel/CarouselDeck";
import { CAROUSEL } from "./carousel.content";
import type { VideoComposition } from "../../compositions";

// Carousel 4:5 "Junior Hilang, Senior Bingung". Satu frame = satu slide.
export const JUNIOR_HILANG_CAROUSEL_SLIDES = CAROUSEL.slides.length;

export const JuniorHilangCarousel: React.FC<{ readonly theme: string }> = ({ theme }) => <CarouselDeck theme={theme} spec={CAROUSEL} />;

export const COMPOSITION: VideoComposition = {
  id: "JuniorHilang-Carousel",
  component: JuniorHilangCarousel,
  durationInFrames: JUNIOR_HILANG_CAROUSEL_SLIDES,
  fps: 1,
  width: 1080,
  height: 1350,
  defaultProps: { theme: "gh" },
};
