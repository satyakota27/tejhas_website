"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const slides = [
  {
    problem: "One-size-fits-all design",
    solution: "Tejhas adapts to your organization instead.",
  },
  {
    problem: "User resistance",
    solution: "Tejhas assigns dedicated Customer Success Managers who guide users through adoption and continuous improvement.",
  },
];

export default function FeaturesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Why most ERP software fails in MSMEs
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mb-12">
          We built Tejhas to fix what others get wrong.
        </p>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-1rem)] rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-foreground/60 line-through font-medium mb-2">
                      {slide.problem}
                    </p>
                    <p className="text-foreground font-semibold text-lg">
                      {slide.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
