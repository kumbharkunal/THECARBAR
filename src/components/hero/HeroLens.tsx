"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_CARS } from "@/data/heroCars";
import { LensMark } from "@/components/narrative/LensMark";
import { cn } from "@/lib/utils";

/**
 * The hero magnifier, with cars passing through the glass.
 *
 * The glass is a real viewport: a circular window positioned to match the rim in
 * LensMark, with the car images stacked inside it and the frame drawn on top. So
 * the visitor is literally looking through the lens at the cars we search for —
 * which is the whole proposition, not decoration.
 *
 * GLASS_* below must track the rim geometry in LensMark (cx/cy 245, r 172 of a
 * 600 viewBox). If that changes, these change with it.
 */
const GLASS_CENTRE = (245 / 600) * 100;
const GLASS_RADIUS = (172 / 600) * 100;
const GLASS_INSET = GLASS_CENTRE - GLASS_RADIUS;
const GLASS_SIZE = GLASS_RADIUS * 2;

/** Seconds each car holds before the next takes its place. */
const HOLD = 2.2;

export function HeroLens({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cars = gsap.utils.toArray<HTMLElement>(".hero-car");
      const labels = gsap.utils.toArray<HTMLElement>(".hero-car-label");
      if (!cars.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          // Reduced motion keeps the first car in the glass, no cycling.
          if (reduce) {
            gsap.set(cars, { autoAlpha: 0 });
            gsap.set(cars[0], { autoAlpha: 1 });
            gsap.set(labels, { autoAlpha: 0 });
            gsap.set(labels[0], { autoAlpha: 1 });
            return;
          }

          gsap.set(cars, { autoAlpha: 0, scale: 1.06, xPercent: 4 });
          gsap.set(labels, { autoAlpha: 0, y: 8 });

          const tl = gsap.timeline({ repeat: -1 });

          cars.forEach((car, i) => {
            const label = labels[i];
            const at = i * HOLD;

            // Each car drifts in from the right as the previous one leaves —
            // the sense of a lens panning across a line-up.
            tl.to(car, { autoAlpha: 1, scale: 1, xPercent: 0, duration: 0.7 }, at)
              .to(label, { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.1)
              .to(
                car,
                { autoAlpha: 0, scale: 0.97, xPercent: -4, duration: 0.7 },
                at + HOLD - 0.25,
              )
              .to(label, { autoAlpha: 0, y: -8, duration: 0.4 }, at + HOLD - 0.3);
          });
        },
        root,
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("relative", className)}>
      {/* The glass viewport, sized and positioned to sit inside the rim. */}
      <div
        className="absolute overflow-hidden rounded-full"
        style={{
          left: `${GLASS_INSET}%`,
          top: `${GLASS_INSET}%`,
          width: `${GLASS_SIZE}%`,
          height: `${GLASS_SIZE}%`,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_120%_at_32%_24%,#ffffff_0%,var(--color-green-soft)_58%,#dcebd2_100%)]"
        />

        {HERO_CARS.map((car, i) => (
          <div key={car.image} className="hero-car absolute inset-0">
            <Image
              src={car.image}
              alt={`${car.name} — an example of the cars customers ask us to find`}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 60vw, 34vw"
              className="scale-[0.78] object-contain sm:scale-[0.84]"
            />
          </div>
        ))}

        {/* Model name, so the sequence reads as a search rather than a slideshow. */}
        <div className="pointer-events-none absolute inset-x-[6%] bottom-[11%] flex justify-center">
          <div className="relative h-6 w-full">
            {HERO_CARS.map((car) => (
              <span
                key={car.image}
                className="hero-car-label absolute left-1/2 top-0 max-w-full -translate-x-1/2 truncate rounded-full border border-green-line bg-white/90 px-2.5 py-1 font-mono text-[0.58rem] uppercase leading-4 tracking-[0.06em] text-ink-soft backdrop-blur-sm sm:px-3 sm:text-[0.66rem] sm:tracking-[0.1em]"
              >
                {car.name}
              </span>
            ))}
          </div>
        </div>

        {/* Curved glass: a soft inner shadow so the images sit behind, not on top. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full shadow-[inset_0_0_38px_rgba(14,27,9,0.09)]"
        />
      </div>

      {/* Rim, handle and highlight, drawn over the viewport. */}
      <LensMark />
    </div>
  );
}
