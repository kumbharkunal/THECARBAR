"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FIND_MY_CAR_HREF, SITE, WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { HeroLens } from "./HeroLens";

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
      className="relative isolate overflow-hidden bg-paper pt-24 pb-12 md:pt-28 md:pb-16"
    >
      {/* A single soft green wash gives the white hero depth without a dark ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(74%_44%_at_50%_74%,var(--color-green-soft)_0%,transparent_72%)] md:bg-[radial-gradient(52%_74%_at_72%_50%,var(--color-green-soft)_0%,transparent_72%)]"
      />

      <div className="shell">
        <p className="hero-eyebrow label-mono flex items-center gap-2.5 text-green-deep">
          <span aria-hidden className="inline-block h-px w-6 shrink-0 bg-green sm:w-7" />
          <span>{SITE.serviceArea}</span>
        </p>

        <h1 className="display-xl mt-5 max-w-[15ch] uppercase text-ink md:mt-6">
          {["No waiting", "on your", "dream car."].map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line block">{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-support body-lg mt-5 max-w-xl text-ink-soft md:mt-6">
          Told there&apos;s a long waiting period on the car you want? Tell us what
          you&apos;re looking for. THE CAR-BAR checks availability across its
          authorised seller network and helps coordinate the next step — subject
          to availability.
        </p>

        <div className="hero-actions mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start md:mt-8">
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

        {/*
          The lens, with the cars we search for passing through the glass.
          In flow on mobile — behind the copy it collided with the eyebrow — and
          absolutely placed in the right half from md.
        */}
        {/*
          The mobile nudge centres the GLASS, not the artwork. LensMark's rim is
          at cx 245 of a 600 viewBox, so the circle sits at 40.8% of the box and
          the handle makes up the rest — centring the box alone left the circle
          about 28px to the left. 9.17% is the difference between the two.
        */}
        <div className="hero-lens pointer-events-none relative mx-auto mt-6 w-[78vw] max-w-[310px] translate-x-[9.17%] md:absolute md:right-[-2%] md:top-1/2 md:mt-0 md:w-[46vw] md:max-w-[760px] md:translate-x-0 md:-translate-y-1/2">
          <HeroLens />
        </div>

        <div className="hero-meta rule-line mt-10 flex flex-wrap gap-x-8 gap-y-2.5 pt-5 md:mt-12 md:gap-x-10">
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
