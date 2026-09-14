"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  DEBUG_MOTION,
  PIN,
  PRIORITY,
  MOTION_CONDITIONS,
  type MotionConditions,
} from "@/lib/gsap";
import { REQUIREMENT } from "@/components/narrative/RequirementCard";

const STEPS = [
  {
    n: "01",
    title: "Tell us your car",
    body: "Brand, model, variant, colour, city and when you need it. The more exact you are, the more useful the answer.",
    detail: REQUIREMENT.map((r) => `${r.label}: ${r.value}`),
  },
  {
    n: "02",
    title: "We check our network",
    body: "We take that specification to authorised sellers across the network and find out what is genuinely possible.",
    detail: ["Specification matched", "Seller availability checked", "Details confirmed"],
  },
  {
    n: "03",
    title: "We connect & coordinate",
    body: "When something suitable comes up, we introduce you to the authorised seller and help coordinate the next step.",
    detail: ["Seller identified", "Vehicle verified", "Introduction made"],
  },
  {
    n: "04",
    title: "You buy from the seller",
    body: "Invoice, payment and delivery are handled directly by the authorised seller. We stay available throughout.",
    detail: ["Purchase with the seller", "Paperwork with the seller", "We remain on hand"],
  },
] as const;

/** Same journey as the acts, reframed as process — horizontal on desktop. */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_CONDITIONS, (context) => {
        const { isDesktop, reduceMotion } = context.conditions as MotionConditions;
        if (reduceMotion || !track.current) return;

        if (!isDesktop) {
          /*
           * Below lg there is no pin and the rail is a touch-snap strip, so the
           * horizontal scrub cannot run — and the section had no motion at all,
           * arriving fully formed while every other section animated.
           *
           * The cards are all at the same height, so a per-card trigger would
           * fire them together. One trigger with a stagger reads as a sequence
           * and keeps the numbered order legible.
           */
          const head = root.current?.querySelector(".hiw-head");
          const cards = track.current.querySelectorAll("article");

          if (head) gsap.set(head, { opacity: 0, y: 18 });
          gsap.set(cards, { opacity: 0, y: 26 });

          ScrollTrigger.create({
            trigger: root.current,
            start: "top 72%",
            once: true,
            markers: DEBUG_MOTION,
            onEnter: () => {
              if (head) gsap.to(head, { opacity: 1, y: 0, duration: 0.5 });
              gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.09,
                ease: "power3.out",
                delay: 0.12,
              });
            },
          });
          return;
        }

        const distance = () => track.current!.scrollWidth - window.innerWidth;

        // ease:"none" is required for containerAnimation to track scroll 1:1.
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * PIN.howItWorksTail}`,
            scrub: 0.35,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: PRIORITY.howItWorks,
            markers: DEBUG_MOTION,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="how-it-works"
      aria-labelledby="how-title"
      className="relative overflow-hidden bg-paper-2 py-16 md:py-24 lg:h-screen lg:pb-10 lg:pt-28"
    >
      <div className="flex h-full flex-col justify-center">
        <div className="hiw-head shell shrink-0">
          <p className="label-mono flex items-center gap-2.5 text-green-deep">
            <span aria-hidden className="inline-block h-px w-7 bg-green" />
            How it works
          </p>
          <h2
            id="how-title"
            className="display-lg mt-5 max-w-[14ch] uppercase text-ink"
          >
            Four steps. No guesswork.
          </h2>
        </div>

        {/* Horizontal on desktop; a touch-snap rail below lg. */}
        <div className="mt-10 overflow-hidden sm:mt-12 lg:mt-16">
          <div
            ref={track}
            className="rail-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.15rem,4.5vw,4.5rem)] pb-4 sm:gap-5 lg:w-max lg:snap-none lg:overflow-visible lg:pb-0"
          >
            {STEPS.map((step) => (
              <article
                key={step.n}
                className="lift flex w-[80vw] shrink-0 snap-start flex-col justify-between rounded-2xl border border-line bg-white p-6 sm:w-[58vw] sm:p-8 md:w-[44vw] lg:h-[min(52vh,430px)] lg:w-[clamp(22rem,34vw,32rem)] lg:p-10"
              >
                <div>
                  <p className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-green sm:text-5xl lg:text-6xl">
                    {step.n}
                  </p>
                  <h3 className="display-md mt-5 uppercase text-ink lg:mt-6">
                    {step.title}
                  </h3>
                  <p className="mt-3.5 text-[0.95rem] leading-relaxed text-ink-soft sm:mt-4">
                    {step.body}
                  </p>
                </div>

                <ul className="mt-7 flex flex-col gap-2 sm:mt-8">
                  {step.detail.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2.5 border-t border-line pt-2.5 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-faint"
                    >
                      <span
                        aria-hidden
                        className="inline-block h-1 w-1 shrink-0 rounded-full bg-green"
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
