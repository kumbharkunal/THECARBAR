"use client";

import { useState } from "react";
import { HAS_REAL_TESTIMONIALS, TESTIMONIALS } from "@/data/testimonials";
import { track } from "@/lib/analytics";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { DemoNote } from "@/components/ui/DemoNote";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = TESTIMONIALS[index];

  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-paper-2 py-16 md:py-24"
    >
      <div className="shell">
        <Eyebrow tone="light">In their words</Eyebrow>
        <h2 id="testimonials-title" className="sr-only">
          What customers say
        </h2>

        {/* The quote sits on white so the band reads as the frame around it. */}
        <div className="lift mt-8 max-w-4xl rounded-2xl border border-line bg-white p-6 sm:p-10 md:mt-10 md:p-14">
          <blockquote>
            <p
              key={active.id}
              className="display-md text-balance text-ink"
              style={{ textWrap: "balance" }}
            >
              &ldquo;{active.quote}&rdquo;
            </p>
            <footer className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-faint sm:mt-9 sm:text-[0.68rem]">
              <span className="text-ink">{active.name}</span>
              <span aria-hidden className="text-green-deep">
                ·
              </span>
              <span>{active.vehicle}</span>
              <span aria-hidden className="text-green-deep">
                ·
              </span>
              <span>{active.location}</span>
            </footer>
          </blockquote>

          {/* Hit areas stay 44px; the visible mark is a thin rule. */}
          <div
            className="-ml-2 mt-9 flex flex-wrap items-center"
            role="tablist"
            aria-label="Testimonials"
          >
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => {
                  setIndex(i);
                  track("testimonial_interaction", { index: i });
                }}
                className="group flex h-11 items-center px-2"
              >
                <span className="sr-only">
                  Show testimonial {i + 1} of {TESTIMONIALS.length}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "block h-[2px] rounded-full transition-all duration-500",
                    i === index
                      ? "w-12 bg-green"
                      : "w-7 bg-line group-hover:bg-green-line",
                  )}
                />
              </button>
            ))}
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
