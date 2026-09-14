"use client";

import { useRef } from "react";
import { gsap, useGSAP, DEBUG_MOTION } from "@/lib/gsap";
import { FIND_MY_CAR_HREF, WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * The close: the magnifier that swept the network converges on FIND MY CAR.
 *
 * The hero establishes the lens, Act II sweeps it across the seller network, and
 * here it comes to rest framing the one action on the page. That is the whole
 * narrative resolving onto a button — which is why this is a travelling magnifier
 * and not the abstract rings it replaced.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          // GSAP writes its own transform matrix, which overwrites Tailwind's
          // -translate-x-1/2/-translate-y-1/2. So the centring lives HERE, in the
          // rest values; drop it and the lens settles a half-width down-right of
          // the button instead of framing it.
          const REST = { xPercent: -50, yPercent: -50 };

          // Reduced motion: the lens is simply already at rest on the CTA.
          if (reduce) {
            gsap.set(".cta-lens", { opacity: 1, scale: 1, ...REST });
            return;
          }

          // It arrives from up-left, oversized, still "searching", and settles.
          gsap.set(".cta-lens", {
            opacity: 0,
            scale: 2.9,
            xPercent: REST.xPercent - 26,
            yPercent: REST.yPercent - 34,
          });

          gsap.to(".cta-lens", {
            opacity: 1,
            scale: 1,
            ...REST,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root.current,
              start: "top 82%",
              end: "center 62%",
              scrub: 0.4,
              markers: DEBUG_MOTION,
            },
          });

          // A single confirming pulse once it has landed — the search closing.
          gsap.fromTo(
            ".cta-lock",
            { scale: 0.82, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: root.current, start: "center 66%", once: true },
            },
          );
        },
        root,
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden border-y border-green-line bg-green-soft py-16 md:py-24"
    >
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

        {/* The CTA row is the lens's destination, so it owns the stacking context. */}
        <div className="relative mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center">
          <div
            aria-hidden
            className="cta-lens pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(84vw,420px)] sm:left-[calc(50%-5.5rem)]"
          >
            <LensConverging />
          </div>

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

        <p className="mx-auto mt-20 max-w-md font-mono text-[0.68rem] leading-relaxed tracking-[0.06em] text-ink-soft sm:mt-24">
          Availability is subject to confirmation. The purchase is completed
          directly with the authorised seller.
        </p>
      </div>
    </section>
  );
}

/** Same instrument as the hero, sized to frame the CTA when it lands. */
function LensConverging() {
  const CX = 300;
  const CY = 268;
  const R = 150;
  const JOIN = R * Math.SQRT1_2;

  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="cta-rim" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#45a117" />
          <stop offset="55%" stopColor="#45a117" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2f7510" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="cta-handle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f7510" />
          <stop offset="100%" stopColor="#45a117" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <path
        d={`M ${CX + JOIN} ${CY + JOIN} L 505 473`}
        stroke="url(#cta-handle)"
        strokeWidth="26"
        strokeLinecap="round"
        fill="none"
      />

      {/* The lock-on ring: appears once the lens has settled. */}
      <circle
        className="cta-lock"
        cx={CX}
        cy={CY}
        r={R - 26}
        fill="none"
        stroke="#45a117"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        strokeDasharray="3 12"
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="url(#cta-rim)"
        strokeWidth="12"
      />
      <circle
        cx={CX}
        cy={CY}
        r={R - 12}
        fill="none"
        stroke="#45a117"
        strokeOpacity="0.18"
        strokeWidth="1.25"
      />
      <path
        d={`M ${CX - 104} ${CY - 56} A ${R - 24} ${R - 24} 0 0 1 ${CX - 44} ${CY - 114}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
