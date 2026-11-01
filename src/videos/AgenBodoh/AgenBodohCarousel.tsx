import type React from "react";
import { CarouselDeck } from "../../carousel/CarouselDeck";
import { CAROUSEL } from "./carousel.content";

// Carousel 4:5 "Agen Bodoh Itu Salah Siapa?". Satu frame = satu slide.
export const AGEN_BODOH_CAROUSEL_SLIDES = CAROUSEL.slides.length;

export const AgenBodohCarousel: React.FC<{ readonly theme: string }> = ({ theme }) => <CarouselDeck theme={theme} spec={CAROUSEL} />;
