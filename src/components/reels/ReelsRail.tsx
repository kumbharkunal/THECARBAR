"use client";

import { Play } from "lucide-react";
import { reelPermalink, type Reel } from "@/data/reels";
import { SITE } from "@/data/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { InstagramIcon } from "@/components/ui/icons";

/**
 * The rail. Client-side only because of the `track()` handlers — the reels
 * themselves are fetched on the server and handed down.
 *
 * Each card is a real poster rather than Instagram's `/embed` iframe. Five
 * cross-origin iframes cost a few hundred KB each, could not be styled, forced a
 * magic `h-[640px]`, and were the only focus-ring failures in the a11y audit.
 * The card is ours; the reel still plays on Instagram.
 */
export function ReelsRail({ reels }: { reels: Reel[] }) {
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
          {reels.map((reel, i) => (
            <a
              key={reel.shortcode}
              href={reelPermalink(reel)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("reel_click", { reel: reel.shortcode })}
              className="lift group flex w-[17.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[box-shadow,border-color] duration-500 hover:border-green-line hover:lift-lg sm:w-[20.625rem]"
            >
              <span className="relative block">
                {/*
                  MediaFrame falls back to its art-directed composition when the
                  cover is missing. `scene` and not the default `vehicle`: that
                  silhouette is drawn on a 400x240 artboard and sliced, so in a
                  9:16 frame you see a vastly magnified sliver of a car door.
                  The abstract field crops cleanly at any ratio.
                */}
                <MediaFrame
                  src={reel.thumbnail ?? null}
                  alt=""
                  kind="scene"
                  seed={i}
                  sizes="(max-width: 640px) 280px, 330px"
                  className="aspect-[9/16] w-full"
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green text-ink transition-transform duration-500 group-hover:scale-110"
                >
                  <Play size={20} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                </span>
              </span>

              <span
                className={cn(
                  "flex items-center gap-3 border-t border-line px-4 py-3",
                  reel.caption ? "justify-between" : "justify-end",
                )}
              >
                {reel.caption && (
                  <span className="min-w-0 truncate font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-soft">
                    {reel.caption}
                  </span>
                )}
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-green-deep">
                  <InstagramIcon size={14} className="shrink-0" />
                  <span aria-hidden>Open</span>
                </span>
              </span>

              <span className="sr-only">
                {reel.caption
                  ? `Open “${reel.caption}” on Instagram`
                  : "Open this reel on Instagram"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
