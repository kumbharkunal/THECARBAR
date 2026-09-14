"use client";

import { useRef } from "react";
import { gsap, useGSAP, DEBUG_MOTION } from "@/lib/gsap";
import { FIND_MY_CAR_HREF, WHATSAPP_HREF } from "@/data/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Lens geometry, in artboard units. Shared with the resting transform below, so
 * the glass — not the bounding box — is what lands on the button.
 *
 * The view box is cropped tight to the instrument rather than left at the hero's
 * square 600. On the old crop the glass was only half the element's width, so on
 * a phone it could never be drawn larger than the full-width buttons it was
 * meant to frame — it ended up buried behind them, reading as two stray arcs.
 * Cropped, the glass is 84% of the element and the CTA sits inside it.
 */
const GLASS_CX = 300;
const GLASS_CY = 268;
const GLASS_R = 150;
const HANDLE_END = 470;
const VIEW = { x: 137, y: 105, size: 359 } as const;

/** Where the glass centre sits inside the element, as a fraction of its box. */
const GLASS_OFFSET = (GLASS_CX - VIEW.x) / VIEW.size;

/**
 * The close: the magnifier that swept the network comes to rest on FIND MY CAR.
 *
 * Two movements, deliberately different in kind:
 *  - The words arrive on their own clock. Scrubbing a headline means it retreats
 *    into the floor when the visitor nudges upward, which reads as a glitch.
 *  - The lens is scrubbed, because it is the thing the visitor is steering. It
 *    swings in from the left, still oversized from the network sweep, and lands
 *    framing the one action on the page — the whole narrative resolving onto a
 *    button.
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
          isNarrow: "(max-width: 639px)",
        },
        (context) => {
          const { reduce, isNarrow } = context.conditions as {
            reduce: boolean;
            isNarrow: boolean;
          };

          // GSAP writes its own transform matrix, which overwrites Tailwind's
          // -translate-x-1/2 / -translate-y-1/2. So the centring lives HERE, in
          // the rest values; drop it and the lens settles a half-width
          // down-right of the button instead of framing it.
          //
          // It is not -50: the glass sits up and left of the element's centre to
          // leave room for the handle. Centring the box instead of the glass
          // parks the button low and left inside the circle — a near miss.
          const REST = {
            xPercent: -100 * GLASS_OFFSET,
            yPercent: -100 * GLASS_OFFSET,
          };

          // Reduced motion: everything is already at its finished position.
          if (reduce) {
            gsap.set(".cta-lens", { opacity: 1, scale: 1, rotation: 0, ...REST });
            gsap.set([".cta-word__inner", ".cta-rise"], { yPercent: 0, opacity: 1 });
            gsap.set(".cta-rule", { scaleX: 1 });
            gsap.set(".cta-lock", { scale: 1, opacity: 1 });
            return;
          }

          /* ---------- the words ---------- */

          const entry = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 78%",
              once: true,
              markers: DEBUG_MOTION,
            },
          });

          entry
            .fromTo(
              ".cta-rule",
              { scaleX: 0 },
              { scaleX: 1, duration: 0.5, ease: "power2.out" },
            )
            .fromTo(
              ".cta-eyebrow",
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.45 },
              "<0.05",
            )
            // Each word climbs out of its own clipping box, so the headline
            // assembles left to right instead of simply fading in.
            .fromTo(
              ".cta-word__inner",
              { yPercent: 118 },
              { yPercent: 0, duration: 0.8, stagger: 0.055, ease: "power3.out" },
              "<0.1",
            )
            .fromTo(
              ".cta-rise",
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
              "-=0.45",
            );

          /* ---------- the lens ---------- */

          // Still wide from sweeping the network, but not so wide that the
          // section's own overflow crops the rim into an anonymous green arc —
          // which is exactly what a 2.9x entry did here before. On a phone the
          // resting lens already spans most of the screen, so there is almost no
          // headroom to grow into; the swing and the rotation carry it instead.
          const ENTRY_SCALE = isNarrow ? 1.1 : 1.7;
          const TRAVEL_X = isNarrow ? 30 : 58;
          const TRAVEL_Y = isNarrow ? 18 : 36;

          gsap.set(".cta-lens", {
            opacity: 0,
            scale: ENTRY_SCALE,
            rotation: isNarrow ? -12 : -15,
            transformOrigin: "50% 50%",
            xPercent: REST.xPercent - TRAVEL_X,
            yPercent: REST.yPercent - TRAVEL_Y,
          });

          const travel = gsap.timeline({
            defaults: { duration: 1 },
            scrollTrigger: {
              trigger: root.current,
              start: "top 88%",
              end: "center 58%",
              scrub: 0.35,
              markers: DEBUG_MOTION,
            },
          });

          travel
            .to(".cta-lens", { opacity: 1, duration: 0.28, ease: "none" }, 0)
            // Splitting x and y across two eases bends the path: it crosses
            // first and drops onto the button late, like an instrument being
            // brought into place rather than a graphic zooming out.
            .to(".cta-lens", { xPercent: REST.xPercent, ease: "power1.inOut" }, 0)
            .to(".cta-lens", { yPercent: REST.yPercent, ease: "power2.in" }, 0)
            .to(".cta-lens", { scale: 1, rotation: 0, ease: "power2.out" }, 0);

          // One confirming pulse once it has landed — the search closing.
          gsap.fromTo(
            ".cta-lock",
            { scale: 0.84, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: root.current,
                start: "center 64%",
                once: true,
              },
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
          <span
            aria-hidden
            className="cta-rule inline-block h-px w-7 origin-left bg-green"
          />
          <span className="cta-eyebrow inline-block">Ready when you are</span>
        </p>

        <h2 className="display-lg mx-auto mt-6 max-w-[13ch] uppercase text-ink md:mt-7">
          <RisingWords text="Your dream car is waiting." />
        </h2>

        <p className="cta-rise body-lg mx-auto mt-6 max-w-xl text-ink-soft md:mt-7">
          Tell us what you&apos;re looking for. We&apos;ll check what&apos;s
          possible — and tell you straight either way.
        </p>

        {/* The CTA row is the lens's destination, so it owns the stacking context. */}
        <div className="cta-rise relative mt-24 flex flex-col items-center gap-3 sm:mt-20 sm:flex-row sm:flex-wrap sm:justify-center">
          {/*
            Every breakpoint below is `sm`, because they all have to agree with
            the `isNarrow` media query the motion above is keyed to. Below it the
            lens is centred on the whole stacked column; above it, on FIND MY CAR
            alone — 97px left of the row's centre, which is where that button's
            own centre falls once the pair is laid out side by side.
          */}
          <div
            aria-hidden
            className="cta-lens pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(90vw,22rem)] will-change-transform sm:left-[calc(50%-97px)] sm:w-[16rem]"
          >
            <LensConverging />
          </div>

          <Button
            href={FIND_MY_CAR_HREF}
            external
            magnetic
            className="w-full max-w-[15rem] justify-center sm:w-auto sm:max-w-none"
            onClick={() => track("final_cta_click")}
          >
            Find my car
          </Button>
          <Button
            href={WHATSAPP_HREF}
            variant="ghost-light"
            external
            withArrow={false}
            className="w-full max-w-[15rem] justify-center sm:w-auto sm:max-w-none"
            onClick={() => track("whatsapp_click", { source: "final" })}
          >
            <WhatsAppIcon size={16} />
            WhatsApp us
          </Button>
        </div>

        {/* The gap is the handle's: it reaches down through this space. */}
        <p className="cta-rise mx-auto mt-36 max-w-md font-mono text-[0.68rem] leading-relaxed tracking-[0.06em] text-ink-soft sm:mt-32">
          Availability is subject to confirmation. The purchase is completed
          directly with the authorised seller.
        </p>
      </div>
    </section>
  );
}

/**
 * Words in per-word clipping boxes, so each can rise from below its own line.
 *
 * The padding / negative-margin pair matters: without it `overflow: hidden`
 * shears the descender off the "g" in "waiting".
 */
function RisingWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 && " "}
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <span className="cta-word__inner inline-block">{word}</span>
          </span>
        </span>
      ))}
    </>
  );
}

/** Same instrument as the hero, sized to frame the CTA when it lands. */
function LensConverging() {
  const CX = GLASS_CX;
  const CY = GLASS_CY;
  const R = GLASS_R;
  const JOIN = R * Math.SQRT1_2;

  return (
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.size} ${VIEW.size}`}
      className="h-auto w-full"
      aria-hidden
    >
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

      {/*
        The glass itself. It paints behind the section's copy (negative z-index),
        so this pale disc lifts the line the rim crosses instead of fighting it —
        and the instrument reads as glass rather than an empty green ring.
      */}
      <circle cx={CX} cy={CY} r={R - 6} fill="#ffffff" fillOpacity="0.55" />

      <path
        d={`M ${CX + JOIN} ${CY + JOIN} L ${HANDLE_END} ${HANDLE_END - 32}`}
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
