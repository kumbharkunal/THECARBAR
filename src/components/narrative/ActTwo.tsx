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

        if (reduceMotion) {
          // Everything at its final legible state; no reveals, no sweep.
          gsap.set(beatEls.filter(Boolean), { opacity: 1, position: "relative" });
          gsap.set(scope.querySelectorAll(".net-desktop .net-node-label"), {
            opacity: 1,
          });
          return;
        }

        if (!isDesktop) {
          // No pinning below lg, but the section should still feel alive: the
          // network assembles as it comes into view, then the beats arrive as a
          // sequence. Without this the whole act sat static on a phone.
          gsap.set(scope.querySelectorAll(".net-desktop .net-node-label"), {
            opacity: 1,
          });

          const mSpine = scope.querySelector(".net-mobile .m-spine");
          const mHub = scope.querySelector(".net-mobile .m-hub");
          const mBuyer = scope.querySelector(".net-mobile .m-buyer");
          const mPaths = scope.querySelectorAll(".net-mobile .m-path");
          const mNodes = scope.querySelectorAll(".net-mobile .m-node");
          const graph = scope.querySelector(".net-mobile");

          if (graph) {
            gsap.set([mBuyer, mSpine, mHub], { opacity: 0 });
            gsap.set(mPaths, { opacity: 0 });
            gsap.set(mNodes, { opacity: 0, scale: 0.5, transformOrigin: "center" });

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: graph,
                  start: "top 78%",
                  once: true,
                  markers: DEBUG_MOTION,
                },
              })
              .to(mBuyer, { opacity: 1, duration: 0.4 })
              .to(mSpine, { opacity: 1, duration: 0.4 }, "-=0.2")
              .to(mHub, { opacity: 1, duration: 0.45 }, "-=0.15")
              .to(mPaths, { opacity: 1, duration: 0.4, stagger: 0.06 }, "-=0.1")
              .to(
                mNodes,
                { opacity: 1, scale: 1, duration: 0.45, stagger: 0.07 },
                "-=0.25",
              );
          }

          // Beats, match card and the closing chain each arrive on entry.
          const items = [
            ...beatEls.filter(Boolean),
            scope.querySelector(".a2-match-card"),
            scope.querySelector(".a2-chain"),
          ].filter(Boolean) as Element[];

          items.forEach((el) => {
            gsap.set(el, { opacity: 0, y: 20, position: "relative" });
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              onEnter: () =>
                gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }),
            });
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
        gsap.set(lens, {
          x: SWEEP[0].x,
          y: SWEEP[0].y,
          scale: 0,
          // The magnifier group's bbox includes its handle; without this it
          // would scale about that offset centre and drift off the mask.
          transformOrigin: "0px 0px",
        });
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
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-paper py-16 md:py-20 lg:py-[clamp(4.5rem,8vh,6.5rem)]"
    >
      <div className="flex w-full flex-col shell">
        <h2 id="act-two-title" className="sr-only">
          How THE CAR-BAR checks its authorised seller network
        </h2>

        {/*
          Desktop: the beats crossfade in place above the network, one at a time.
          Mobile: the network comes first to anchor the story, and the beats read
          as a compact numbered sequence — six full-size headings in a column was
          a wall of text.
        */}
        <div className="relative order-2 mx-auto w-full max-w-2xl lg:order-1 lg:h-[8.5rem] lg:text-center">
          {BEATS.map((beat, i) => (
            <div
              key={beat.id}
              data-beat={beat.id}
              className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-line py-5 first:border-t-0 lg:absolute lg:inset-x-0 lg:top-0 lg:block lg:border-0 lg:py-0"
            >
              <span
                aria-hidden
                className="font-mono text-[0.68rem] leading-6 tracking-[0.12em] text-green-deep lg:hidden"
              >
                0{i + 1}
              </span>
              <div className="min-w-0">
                <p className="label-mono flex items-center gap-2.5 text-green-deep lg:justify-center">
                  <span
                    aria-hidden
                    className="hidden h-px w-6 bg-green lg:inline-block"
                  />
                  {beat.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-[1.35rem] uppercase leading-[1.1] tracking-tight text-ink sm:text-[1.5rem] lg:display-md lg:mt-3.5">
                  {beat.title}
                </h3>
                <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft lg:mx-auto lg:mt-3.5">
                  {beat.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative order-1 lg:order-2 lg:mt-4">
          <NetworkGraph className="hidden h-[min(50vh,466px)] lg:block" />
          <NetworkGraphMobile className="mb-10 h-[min(52vh,400px)] lg:mb-0 lg:hidden" />

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

        {/*
          The relationship, stated plainly — state 9.

          Pills and arrows are siblings rather than nested pairs: nested, a
          trailing arrow stayed glued to its pill when the row wrapped on a
          phone, which threw the centring off. Flat children let justify-center
          centre every line.

          On desktop it leaves the flow. It is invisible until the final beat,
          but in flow it still claimed ~68px of the column the section centres —
          so everything the visitor could actually see sat half that below the
          middle of the screen for the whole act.
        */}
        <div className="a2-chain mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2.5 sm:gap-x-4 lg:absolute lg:inset-x-0 lg:bottom-[clamp(1.25rem,3.5vh,2.5rem)] lg:mt-0">
          {["You", "THE CAR-BAR", "Authorised seller"].flatMap((node, i) => {
            const pill = (
              <span
                key={node}
                className={
                  i === 1
                    ? "rounded-full bg-green px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink sm:text-[0.7rem] sm:tracking-[0.14em]"
                    : "rounded-full border border-line bg-paper px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink sm:text-[0.7rem] sm:tracking-[0.14em]"
                }
              >
                {node}
              </span>
            );
            return i < 2
              ? [
                  pill,
                  <span
                    key={`${node}-arrow`}
                    aria-hidden
                    className="text-green-deep"
                  >
                    →
                  </span>,
                ]
              : [pill];
          })}
        </div>
      </div>
    </section>
  );
}
