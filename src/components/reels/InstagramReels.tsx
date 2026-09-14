"use client";

import { REELS, reelEmbedSrc, reelPermalink } from "@/data/reels";
import { SITE } from "@/data/site";
import { track } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon } from "@/components/ui/icons";

/**
 * Real reels, through Instagram's official /embed endpoint.
 *
 * Every frame is lazy — this section sits far down the page and each embed pulls
 * a few hundred KB from Instagram, so nothing loads until the visitor is near it.
 * The permalink sits beside each frame because an iframe is opaque to the page:
 * we cannot style inside it, and should not try to.
 */
export function InstagramReels() {
  return (
    <section
      id="stories"
      className="scroll-mt-24 overflow-hidden bg-paper py-16 md:py-24"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-7">
          <SectionHeading
            eyebrow="Instagram"
            title="See THE CAR-BAR in action."
            intro="Deliveries, handovers and the cars we're asked about most."
          />
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("reel_click", { source: "header" })}
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-green-line bg-white px-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-green-deep transition-colors duration-300 hover:border-green hover:bg-green-soft"
          >
            <InstagramIcon size={16} />
            {SITE.instagramHandle}
          </a>
        </div>
      </div>

      {/*
        The rail runs full-bleed so cards can bleed off the edge, but its own
        padding matches the shell gutter so the first card lines up under the
        heading instead of hugging the viewport edge.
      */}
      <div className="shell mt-10 md:mt-12">
        <div className="rail-scroll rail-inset flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 sm:gap-5">
          {REELS.map((reel) => (
            <figure
            key={reel.shortcode}
            className="lift flex w-[min(82vw,330px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[box-shadow,border-color] duration-500 hover:border-green-line hover:lift-lg"
          >
            <iframe
              src={reelEmbedSrc(reel)}
              title={`Instagram reel — ${reel.caption}`}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
              className="h-[640px] w-full border-0 bg-white"
            />
            <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
              <span className="min-w-0 truncate font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-soft">
                {reel.caption}
              </span>
              <a
                href={reelPermalink(reel)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("reel_click", { reel: reel.shortcode })}
                className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-full px-2.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-green-deep transition-colors hover:bg-green-soft"
              >
                <InstagramIcon size={14} className="shrink-0" />
                <span className="sr-only">Open {reel.caption} on Instagram</span>
                <span aria-hidden>Open</span>
              </a>
            </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
