"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  DEBUG_MOTION,
  PIN,
  PRIORITY,
  MOTION_CONDITIONS,
  type MotionConditions,
} from "@/lib/gsap";
import { RequirementCard } from "./RequirementCard";

/**
 * ACT I — THE WAIT (narrative states 1–3).
 *
 * The requirement reaches one local seller and stops. The lens finds a waiting
 * period, then pulls back to ask the question that opens Act II.
 *
 * Desktop pins and scrubs. Below 1024px pinning is disabled entirely — the same
 * beats play as stacked reveals (CLAUDE.md §5).
 */
export function ActOne() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_CONDITIONS, (context) => {
        const { isDesktop, reduceMotion } = context.conditions as MotionConditions;

        const months = { value: 0 };
        const monthsEl = root.current?.querySelector<HTMLElement>(".a1-months");

        if (reduceMotion) {
          // Everything at its final legible state; no scrub, no counter.
          if (monthsEl) monthsEl.textContent = "4";
          gsap.set(".a1-stage, .a1-question, .a1-lens, .a1-readout", { opacity: 1 });
          gsap.set(".a1-link", { scaleY: 1 });
          return;
        }

        gsap.set(".a1-link", { scaleY: 0, transformOrigin: "top center" });
        gsap.set(".a1-lens", { opacity: 0, scale: 1.5 });
        gsap.set(".a1-readout", { opacity: 0, y: 12 });
        gsap.set(".a1-question", { opacity: 0, y: 28 });
        gsap.set(".a1-seller", { opacity: 0, y: 18 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: isDesktop ? `+=${PIN.actOne}` : "bottom bottom",
            scrub: 0.3,
            pin: isDesktop,
            pinSpacing: isDesktop,
            anticipatePin: isDesktop ? 1 : 0,
            refreshPriority: PRIORITY.actOne,
            markers: DEBUG_MOTION,
          },
        });

        // State 1 → 2: the requirement travels to a single local seller.
        tl.to(".a1-link", { scaleY: 1, duration: 0.7, ease: "power2.inOut" })
          .to(".a1-seller", { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")
          // The lens closes in and reads the answer.
          .to(".a1-lens", { opacity: 1, scale: 1, duration: 0.7 }, "-=0.1")
          .to(".a1-readout", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
          .to(
            months,
            {
              value: 4,
              duration: 0.9,
              ease: "power1.inOut",
              onUpdate: () => {
                if (monthsEl) monthsEl.textContent = String(Math.round(months.value));
              },
            },
            "-=0.35",
          )
          .to({}, { duration: 0.5 })
          // State 3: the frame pulls back and the question lands.
          // Desktop only: the stage recedes so the question takes the frame.
          // Stacked on mobile there is nothing to hand focus to, and fading it
          // would leave the 4-MONTHS readout unreadable.
          .to(
            ".a1-stage",
            {
              opacity: isDesktop ? 0.32 : 1,
              scale: isDesktop ? 0.94 : 1,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "wide",
          )
          .to(".a1-question", { opacity: 1, y: 0, duration: 0.8 }, "wide+=0.15")
          .to({}, { duration: 0.6 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="act-one-title"
      className="relative flex min-h-screen items-center overflow-hidden bg-paper-2 py-20 md:py-24 lg:pb-10 lg:pt-28"
    >
      <div className="shell grid w-full items-center gap-12 md:gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="label-mono flex items-center gap-2.5 text-green-deep">
            <span aria-hidden className="inline-block h-px w-7 bg-green" />
            The problem
          </p>

          <h2
            id="act-one-title"
            className="display-lg mt-5 max-w-[13ch] uppercase text-ink md:mt-6"
          >
            Tired of hearing &ldquo;waiting period&rdquo;?
          </h2>

          <p className="body-lg mt-6 max-w-lg text-ink-soft md:mt-7">
            You know the car you want. But a single showroom can only tell you
            about its own allocation — and the answer is often a wait measured in
            months.
          </p>

          {/* State 3 — the hinge into Act II. */}
          <p className="a1-question display-md mt-10 max-w-[16ch] uppercase text-green-deep md:mt-12">
            What if we look beyond one showroom?
          </p>
        </div>

        <div className="a1-stage relative mx-auto flex w-full max-w-lg flex-col items-center">
          <RequirementCard />

          {/* Single connector — one requirement, one seller, one answer. */}
          <span
            aria-hidden
            className="a1-link my-5 block h-16 w-px bg-gradient-to-b from-green to-line sm:my-6 sm:h-20 md:my-8 md:h-24"
          />

          <div className="a1-seller relative w-full max-w-sm">
            <div className="lift relative z-10 rounded-xl border border-line bg-white p-5 sm:p-6">
              <p className="label-mono text-ink-soft">Local seller</p>
              <p className="mt-1.5 font-display text-xl uppercase tracking-tight text-ink">
                Pune
              </p>

              <div className="a1-readout rule-line mt-6 pt-5">
                <p className="label-mono text-ink-soft">Waiting period</p>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="a1-months font-display text-6xl leading-none text-ink md:text-7xl">
                    0
                  </span>
                  <span className="font-display text-2xl uppercase text-ink-faint">
                    months
                  </span>
                </p>
              </div>
            </div>

            {/* The lens, closing in on one showroom. */}
            <span
              aria-hidden
              className="a1-lens pointer-events-none absolute -inset-4 rounded-[50%] border border-green-line bg-green-soft sm:-inset-6 md:-inset-8"
            />
          </div>

          <p className="mt-6 max-w-sm text-center font-mono text-[0.62rem] leading-relaxed tracking-[0.06em] text-ink-soft">
            Illustrative example — not a current quoted waiting period.
          </p>
        </div>
      </div>
    </section>
  );
}
