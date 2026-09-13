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
import { MATCH_NODE, SELLERS, SWEEP } from "@/lib/network";
import { NetworkGraph, NetworkGraphMobile } from "./NetworkGraph";

/** States 4–9. Each caption is a real heading in the DOM, not SVG text. */
const BEATS = [
  {
    id: "hub",
    eyebrow: "The solution",
    title: "We check the network.",
    body: "Your requirement doesn't stop at one showroom. It comes to THE CAR-BAR, and we look wider.",
  },
  {
    id: "expand",
    eyebrow: "Authorised sellers",
    title: "Beyond one showroom.",
    body: "THE CAR-BAR works with authorised sellers across India — so a wait in one city isn't the whole picture.",
  },
  {
    id: "search",
    eyebrow: "Searching",
    title: "We check what's possible.",
    body: "We take your exact specification — model, variant, transmission, colour — and check it against the network.",
  },
  {
    id: "match",
    eyebrow: "Potential match",
    title: "A possibility, found.",
    body: "When something suitable turns up, we confirm the details with the seller before bringing it to you.",
  },
  {
    id: "connect",
    eyebrow: "Coordination",
    title: "THE CAR-BAR connects you.",
    body: "We introduce you to the authorised seller and help coordinate the next step.",
  },
  {
    id: "purchase",
    eyebrow: "The purchase",
    title: "You buy from the authorised seller.",
    body: "Invoice, payment and delivery sit with them. THE CAR-BAR is not the seller — we make the connection.",
  },
] as const;

export function ActTwo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_CONDITIONS, (context) => {
        const { isDesktop, reduceMotion } = context.conditions as MotionConditions;
        const scope = root.current;
        if (!scope) return;

        const beatEls = BEATS.map((b) =>
          scope.querySelector<HTMLElement>(`[data-beat="${b.id}"]`),
        );

        if (reduceMotion || !isDesktop) {
          // Captions stack and read as a list; the diagram is shown complete.
          gsap.set(beatEls.filter(Boolean), { opacity: 1, position: "relative" });
          gsap.set(scope.querySelectorAll(".net-desktop .net-node-label"), {
            opacity: 1,
          });
          return;
        }

        const lens = scope.querySelectorAll(".net-desktop .lens-follow");
        const lensRing = scope.querySelector(".net-desktop .net-lens");
        const labels = scope.querySelectorAll<SVGTextElement>(
          ".net-desktop .net-node-label",
        );
        const halos = scope.querySelectorAll<SVGCircleElement>(
          ".net-desktop .net-node-halo",
        );
        const nodes = scope.querySelectorAll<SVGGElement>(".net-desktop .net-node");
        const paths = scope.querySelectorAll<SVGPathElement>(".net-desktop .net-path");
        const match = scope.querySelector(".net-desktop .net-match");

        // Nothing is revealed until the lens gets there.
        gsap.set(lens, { x: SWEEP[0].x, y: SWEEP[0].y, scale: 0 });
        gsap.set(labels, { opacity: 0 });
        gsap.set(nodes, { opacity: 0, scale: 0.4, transformOrigin: "center" });
        gsap.set(paths, { opacity: 0 });
        gsap.set(scope.querySelector(".net-desktop .net-hub"), {
          opacity: 0,
          scale: 0.7,
          transformOrigin: "center",
        });
        gsap.set(scope.querySelector(".net-desktop .net-spine"), { opacity: 0 });
        gsap.set([".a2-match-card", ".a2-chain"], { opacity: 0, y: 12 });
        beatEls.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: `+=${PIN.actTwo}`,
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
            refreshPriority: PRIORITY.actTwo,
            markers: DEBUG_MOTION,
          },
        });

        const showBeat = (index: number, at: string | number) => {
          if (index > 0) {
            tl.to(beatEls[index - 1], { opacity: 0, duration: 0.25 }, at);
          }
          tl.to(beatEls[index], { opacity: 1, duration: 0.35 }, at);
        };

        // State 4 — THE CAR-BAR appears and the requirement reaches it.
        tl.to(scope.querySelector(".net-desktop .net-spine"), {
          opacity: 1,
          duration: 0.5,
        })
          .to(
            scope.querySelector(".net-desktop .net-hub"),
            { opacity: 1, scale: 1, duration: 0.6 },
            "-=0.25",
          )
          .to({}, { duration: 0.4 });

        // State 5 — the network expands.
        tl.addLabel("expand")
          .to(paths, { opacity: 1, duration: 0.5, stagger: 0.03 }, "expand")
          .to(
            nodes,
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.035 },
            "expand+=0.1",
          )
          .to(labels, { opacity: 0.7, duration: 0.5, stagger: 0.03 }, "expand+=0.25");
        showBeat(1, "expand");
        tl.to({}, { duration: 0.4 });

        // State 6 — the lens sweeps; nodes light as it passes, then fade back.
        tl.addLabel("sweep")
          .to(lensRing, { opacity: 1, duration: 0.3 }, "sweep")
          .to(lens, { scale: SWEEP[0].r, duration: 0.4 }, "sweep");
        showBeat(2, "sweep");

        const ordered = [...SELLERS].sort((a, b) => a.order - b.order);

        SWEEP.slice(1).forEach((point, i) => {
          const legStart = 0.5 + i * 0.75;
          tl.to(
            lens,
            {
              x: point.x,
              y: point.y,
              scale: point.r,
              duration: 0.75,
              ease: "power1.inOut",
            },
            `sweep+=${legStart}`,
          );

          // Nodes on this leg get a brief halo — "checked", then released.
          ordered.slice(i * 3, i * 3 + 3).forEach((s) => {
            const idx = SELLERS.findIndex((n) => n.id === s.id);
            tl.to(
              halos[idx],
              { opacity: 0.16, duration: 0.2 },
              `sweep+=${legStart + 0.1}`,
            )
              .to(
                labels[idx],
                { opacity: 1, duration: 0.2 },
                `sweep+=${legStart + 0.1}`,
              )
              .to(
                labels[idx],
                { opacity: 0.7, duration: 0.3 },
                `sweep+=${legStart + 0.5}`,
              )
              .to(
                halos[idx],
                { opacity: 0, duration: 0.3 },
                `sweep+=${legStart + 0.5}`,
              );
          });
        });

        // State 7 — the lens locks on. Everything else recedes.
        tl.addLabel("match");
        showBeat(3, "match");
        const matchIdx = SELLERS.findIndex((s) => s.id === MATCH_NODE.id);
        tl.to(match, { opacity: 1, duration: 0.4 }, "match")
          // Drop the label clear of the callout rings it would otherwise sit inside.
          .to(
            labels[matchIdx],
            { opacity: 1, attr: { y: MATCH_NODE.y + 62 }, duration: 0.3 },
            "match",
          )
          .to(
            [...nodes].filter((_, i) => i !== matchIdx),
            { opacity: 0.25, duration: 0.5 },
            "match",
          )
          .to(
            [...labels].filter((_, i) => i !== matchIdx),
            { opacity: 0.25, duration: 0.4 },
            "match",
          )
          .to(".a2-match-card", { opacity: 1, y: 0, duration: 0.5 }, "match+=0.2")
          .to({}, { duration: 0.5 });

        // State 8 — the network simplifies to the three parties that matter.
        tl.addLabel("connect");
        showBeat(4, "connect");
        tl.to(
          [...paths].filter((_, i) => i !== matchIdx),
          { opacity: 0.08, duration: 0.6 },
          "connect",
        )
          .to(lens, { scale: 0, duration: 0.5 }, "connect")
          .to(lensRing, { opacity: 0, duration: 0.3 }, "connect")
          .to({}, { duration: 0.5 });

        // State 9 — the purchase sits with the seller.
        tl.addLabel("purchase");
        showBeat(5, "purchase");
        tl.to(".a2-chain", { opacity: 1, y: 0, duration: 0.5 }, "purchase")
          .to({}, { duration: 0.7 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="network"
      aria-labelledby="act-two-title"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-paper py-20 md:py-24 lg:pb-10 lg:pt-28"
    >
      <div className="shell w-full">
        <h2 id="act-two-title" className="sr-only">
          How THE CAR-BAR checks its authorised seller network
        </h2>

        {/* Captions. On desktop they crossfade in place; below lg they stack. */}
        <div className="relative mx-auto max-w-2xl text-center lg:h-[8.5rem]">
          {BEATS.map((beat) => (
            <div
              key={beat.id}
              data-beat={beat.id}
              className="mb-9 last:mb-0 lg:absolute lg:inset-x-0 lg:top-0 lg:mb-0"
            >
              <p className="label-mono flex items-center justify-center gap-2.5 text-green-deep">
                <span aria-hidden className="inline-block h-px w-6 bg-green" />
                {beat.eyebrow}
              </p>
              <h3 className="display-md mt-3.5 uppercase text-ink">{beat.title}</h3>
              <p className="mx-auto mt-3.5 max-w-xl text-[1rem] leading-relaxed text-ink-soft sm:text-[0.95rem]">
                {beat.body}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-8 lg:mt-4">
          <NetworkGraph className="hidden h-[min(50vh,466px)] lg:block" />
          <NetworkGraphMobile className="h-[min(60vh,440px)] lg:hidden" />

          {/* Match detail — mirrors the requirement, confirmed against a seller. */}
          <div className="a2-match-card lift mx-auto mt-6 w-full max-w-sm rounded-2xl border border-green-line bg-paper p-5 lg:absolute lg:bottom-2 lg:right-0 lg:mt-0">
            <p className="label-mono flex items-center gap-2 text-green-deep">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
              Potential match
            </p>
            <p className="mt-3 font-display text-lg uppercase tracking-tight text-ink">
              Toyota Fortuner
            </p>
            <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-soft">
              Automatic · Black · Authorised seller, {MATCH_NODE.city}
            </p>
            <p className="mt-4 border-t border-line pt-3 font-mono text-[0.62rem] leading-relaxed tracking-[0.05em] text-ink-faint">
              Subject to availability and confirmation with the seller.
            </p>
          </div>
        </div>

        {/* The relationship, stated plainly — state 9. */}
        <div className="a2-chain mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-4 lg:mt-7">
          {["You", "THE CAR-BAR", "Authorised seller"].map((node, i) => (
            <span key={node} className="flex items-center gap-3 sm:gap-4">
              <span
                className={
                  i === 1
                    ? "rounded-full bg-green px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink sm:tracking-[0.14em]"
                    : "rounded-full border border-line bg-paper px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink sm:tracking-[0.14em]"
                }
              >
                {node}
              </span>
              {i < 2 && (
                <span aria-hidden className="text-green-deep">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
