"use client";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function ImageSlider({ images = [] as string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] bg-bx-input border border-bx-border rounded" />
    );
  }

  return (
    <div className="relative max-h-max overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={src}
              alt={`Slide ${idx + 1}`}
              className="block min-w-0 min-h-0 flex-[0_0_100%] w-full aspect-[4/3] object-cover rounded"
            />
          ))}
        </div>
      </div>

      {/* Controls: always vertically centered over the image */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-between px-2">
        <button
          onClick={scrollPrev}
          className="pointer-events-auto px-3 h-9 rounded bg-bx-input/80 border border-bx-border"
        >
          ‹
        </button>
        <button
          onClick={scrollNext}
          className="pointer-events-auto px-3 h-9 rounded bg-bx-input/80 border border-bx-border"
        >
          ›
        </button>
      </div>
    </div>
  );
}
