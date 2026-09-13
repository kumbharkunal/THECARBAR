"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, DEBUG_MOTION } from "@/lib/gsap";
import { FIND_MY_CAR_HREF, WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * State 10. The lens that searched the network contracts onto the CTA —
 * closing the loop the hero opened.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".cta-lens", { scale: 2.6, opacity: 0 });

        gsap.to(".cta-lens", {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "center center",
            scrub: 0.4,
            markers: DEBUG_MOTION,
          },
        });

        gsap.set(".cta-ring", { rotate: 0 });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(".cta-ring", { rotate: 90, duration: 2.4, ease: "power3.out" }),
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden border-y border-green-line bg-green-soft py-16 md:py-24"
    >
      {/* The lens, resolved onto the one action that matters. */}
      <div
        aria-hidden
        className="cta-lens pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(94vw,780px)] -translate-x-1/2 -translate-y-1/2"
      >
        <svg viewBox="0 0 600 600" className="h-auto w-full">
          <defs>
            <radialGradient id="cta-glow" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="#45a117" stopOpacity="0" />
              <stop offset="82%" stopColor="#45a117" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#45a117" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="290" fill="url(#cta-glow)" />
          <circle
            cx="300"
            cy="300"
            r="240"
            fill="none"
            stroke="#45a117"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <g className="cta-ring" style={{ transformOrigin: "300px 300px" }}>
            <circle
              cx="300"
              cy="300"
              r="240"
              fill="none"
              stroke="#2f7510"
              strokeOpacity="0.65"
              strokeWidth="1.5"
              strokeDasharray="4 26"
            />
          </g>
          <circle
            cx="300"
            cy="300"
            r="176"
            fill="none"
            stroke="#45a117"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="shell text-center">
        <p className="label-mono flex items-center justify-center gap-2.5 text-green-deep">
          <span aria-hidden className="inline-block h-px w-7 bg-green" />
          Ready when you are
        </p>

        <h2 className="display-lg mx-auto mt-6 max-w-[13ch] uppercase text-ink md:mt-7">
          Your dream car is waiting.
        </h2>

        <p className="body-lg mx-auto mt-6 max-w-xl text-ink-soft md:mt-7">
          Tell us what you&apos;re looking for. We&apos;ll check what&apos;s
          possible — and tell you straight either way.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:mt-11 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button
            href={FIND_MY_CAR_HREF}
            external
            magnetic
            className="w-full max-w-xs justify-center sm:w-auto sm:max-w-none"
            onClick={() => track("final_cta_click")}
          >
            Find my car
          </Button>
          <Button
            href={WHATSAPP_HREF}
            variant="ghost-light"
            external
            withArrow={false}
            className="w-full max-w-xs justify-center sm:w-auto sm:max-w-none"
            onClick={() => track("whatsapp_click", { source: "final" })}
          >
            <WhatsAppIcon size={16} />
            WhatsApp us
          </Button>
        </div>

        <p className="mx-auto mt-9 max-w-md font-mono text-[0.66rem] leading-relaxed tracking-[0.06em] text-ink-soft md:mt-10">
          Availability is subject to confirmation. The purchase is completed
          directly with the authorised seller.
        </p>
      </div>
    </section>
  );
}
