import type React from "react";
import { CarouselDeck } from "../../carousel/CarouselDeck";
import { CAROUSEL } from "./carousel.content";

// Carousel 4:5 "Junior Hilang, Senior Bingung". Satu frame = satu slide.
export const JUNIOR_HILANG_CAROUSEL_SLIDES = CAROUSEL.slides.length;

export const JuniorHilangCarousel: React.FC<{ readonly theme: string }> = ({ theme }) => <CarouselDeck theme={theme} spec={CAROUSEL} />;
