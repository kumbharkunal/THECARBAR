"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FIND_MY_CAR_HREF, SITE, WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LensMark } from "@/components/narrative/LensMark";

/**
 * First frame. The headline and primary CTA are readable and clickable
 * immediately — the intro timeline is a short entrance, never a gate.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-line", {
          yPercent: 108,
          duration: 0.75,
          stagger: 0.06,
        })
          .from(".hero-eyebrow", { opacity: 0, duration: 0.45 }, 0.1)
          .from(".hero-support", { opacity: 0, y: 16, duration: 0.55 }, 0.34)
          .from(".hero-actions > *", { opacity: 0, y: 14, stagger: 0.06 }, 0.44)
          .from(".hero-meta", { opacity: 0, duration: 0.5 }, 0.58)
          .from(".hero-lens", { opacity: 0, scale: 0.92, duration: 0.9 }, 0.05);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate overflow-hidden bg-paper pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* A single soft green wash gives the white hero depth without a dark ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(78%_62%_at_82%_30%,var(--color-green-soft)_0%,transparent_70%)] md:bg-[radial-gradient(52%_74%_at_72%_50%,var(--color-green-soft)_0%,transparent_72%)]"
      />

      {/* The lens: the logo's magnifying glass, established here before it searches. */}
      <div
        aria-hidden
        className="hero-lens pointer-events-none absolute right-[-24%] top-[26%] -z-10 w-[80vw] max-w-[900px] -translate-y-1/2 md:right-[-6%] md:top-1/2 md:w-[52vw]"
      >
        {/* Opacity lives on the inner node so the .hero-lens tween never pins it. */}
        <div className="opacity-40 md:opacity-90">
          <LensMark />
        </div>
      </div>

      <div className="shell">
        <p className="hero-eyebrow label-mono flex items-center gap-2.5 text-green-deep">
          <span aria-hidden className="inline-block h-px w-6 shrink-0 bg-green sm:w-7" />
          <span>{SITE.serviceArea}</span>
        </p>

        <h1 className="display-xl mt-7 max-w-[15ch] uppercase text-ink md:mt-8">
          {["No waiting", "on your", "dream car."].map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line block">{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-support body-lg mt-7 max-w-xl text-ink-soft md:mt-9">
          Told there&apos;s a long waiting period on the car you want? Tell us what
          you&apos;re looking for. THE CAR-BAR checks availability across its
          authorised seller network and helps coordinate the next step — subject
          to availability.
        </p>

        <div className="hero-actions mt-9 flex flex-wrap items-center gap-3 md:mt-11">
          <Button
            href={FIND_MY_CAR_HREF}
            external
            magnetic
            onClick={() => track("hero_cta_click")}
          >
            Find my car
          </Button>
          <Button
            href={WHATSAPP_HREF}
            variant="ghost-light"
            external
            withArrow={false}
            onClick={() => track("whatsapp_click", { source: "hero" })}
          >
            <WhatsAppIcon size={16} />
            WhatsApp us
          </Button>
        </div>

        <div className="hero-meta rule-line mt-14 flex flex-wrap gap-x-8 gap-y-3 pt-6 md:mt-20 md:gap-x-10">
          {[
            "You tell us the car",
            "We check the network",
            "You buy from the authorised seller",
          ].map((step, i) => (
            <p
              key={step}
              className="flex items-baseline gap-2.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-soft"
            >
              <span className="text-green-deep">0{i + 1}</span>
              {step}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
