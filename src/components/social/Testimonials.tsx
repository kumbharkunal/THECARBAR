"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { HAS_REAL_TESTIMONIALS, TESTIMONIALS } from "@/data/testimonials";
import { track } from "@/lib/analytics";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { DemoNote } from "@/components/ui/DemoNote";
import { cn } from "@/lib/utils";

/** How long each quote holds before the next one takes over. */
const HOLD_MS = 7000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  // Two separate reasons to stop. Collapsing them into one flag meant leaving the
  // card with the mouse cleared a deliberate press of the pause button.
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const rotating = !userPaused && !hovering && inView && !reduced;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  // Nothing rotates while the section is off-screen — no point cycling quotes
  // nobody is looking at, and it keeps the tab quiet when parked.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      HOLD_MS,
    );
    return () => window.clearTimeout(id);
    // `index` restarts the timer on every change, manual or automatic.
  }, [rotating, index]);

  const select = useCallback((i: number) => {
    setIndex(i);
    track("testimonial_interaction", { index: i });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-title"
      className="bg-paper-2 py-16 md:py-24"
    >
      <div className="shell">
        <Eyebrow tone="light">In their words</Eyebrow>
        <h2 id="testimonials-title" className="sr-only">
          What customers say
        </h2>

        {/* The quote sits on white so the band reads as the frame around it. */}
        <div
          className="lift mt-8 max-w-4xl rounded-2xl border border-line bg-white p-6 sm:p-10 md:mt-10 md:p-14"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)}
          onBlurCapture={() => setHovering(false)}
        >
          {/*
            All three quotes share one grid cell, so the card is always as tall
            as the longest and never resizes mid-rotation. A min-height would
            have needed a different magic number at every viewport; `invisible`
            keeps the inactive ones occupying space while hiding them from both
            the eye and assistive tech.
          */}
          <blockquote
            className="grid"
            // While it rotates on its own, announcing every change would be noise.
            // Once the visitor takes control, changes are theirs to hear.
            aria-live={rotating ? "off" : "polite"}
          >
            {TESTIMONIALS.map((t, i) => {
              const current = i === index;
              return (
                <div
                  key={t.id}
                  aria-hidden={!current}
                  className={cn(
                    "col-start-1 row-start-1 transition-opacity duration-500",
                    current ? "opacity-100" : "invisible opacity-0",
                  )}
                >
                  <p
                    key={`${t.id}-${current}`}
                    className={cn(
                      "display-md text-balance text-ink",
                      current && "quote-enter",
                    )}
                    style={{ textWrap: "balance" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer
                    className={cn(
                      "mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-faint sm:mt-9 sm:text-[0.68rem]",
                      current && "quote-enter",
                    )}
                  >
                    <span className="text-ink">{t.name}</span>
                    <span aria-hidden className="text-green-deep">
                      ·
                    </span>
                    <span>{t.vehicle}</span>
                    <span aria-hidden className="text-green-deep">
                      ·
                    </span>
                    <span>{t.location}</span>
                  </footer>
                </div>
              );
            })}
          </blockquote>

          <div className="mt-9 flex items-center justify-between gap-4">
            {/* Hit areas stay 44px; the visible mark is a thin rule. */}
            <div
              className="-ml-2 flex flex-wrap items-center"
              role="tablist"
              aria-label="Testimonials"
            >
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => select(i)}
                  className="group flex h-11 items-center px-2"
                >
                  <span className="sr-only">
                    Show testimonial {i + 1} of {TESTIMONIALS.length}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "relative block h-[2px] overflow-hidden rounded-full transition-all duration-500",
                      i === index
                        ? "w-12 bg-green-line"
                        : "w-7 bg-line group-hover:bg-green-line",
                    )}
                  >
                    {/* The fill runs in step with the hold, so the wait is visible. */}
                    {i === index && (
                      <span
                        key={`${index}-${rotating}`}
                        className={cn(
                          "absolute inset-0 block rounded-full bg-green",
                          rotating ? "indicator-fill" : "",
                        )}
                        style={
                          rotating
                            ? { animationDuration: `${HOLD_MS}ms` }
                            : undefined
                        }
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/*
              WCAG 2.2.2: content that auto-updates for more than five seconds
              needs a way to stop it. Hover and focus pause it too, but neither
              is reachable for every visitor, so this is the explicit control.
            */}
            {!reduced && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-green-line hover:bg-green-soft hover:text-green-deep"
              >
                <span className="sr-only">
                  {userPaused
                    ? "Resume rotating testimonials"
                    : "Pause rotating testimonials"}
                </span>
                {userPaused ? (
                  <Play size={14} fill="currentColor" aria-hidden />
                ) : (
                  <Pause size={14} fill="currentColor" aria-hidden />
                )}
              </button>
            )}
          </div>
        </div>

        {!HAS_REAL_TESTIMONIALS && (
          <DemoNote tone="light" className="mt-8 max-w-xl">
            Sample layout using placeholder wording — not real customer quotes.
            Replace with consented testimonials before launch.
          </DemoNote>
        )}
      </div>
    </section>
  );
}
