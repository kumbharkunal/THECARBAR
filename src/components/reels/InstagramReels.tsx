"use client";

import { Play } from "lucide-react";
import { REELS } from "@/data/reels";
import { SITE } from "@/data/site";
import { track } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoNote } from "@/components/ui/DemoNote";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { InstagramIcon } from "@/components/ui/icons";

const HAS_REAL_REELS = REELS.some((r) => !r.isPlaceholder);

export function InstagramReels() {
  return (
    <section id="stories" className="scroll-mt-24 overflow-hidden bg-paper py-16 md:py-24">
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

      <div className="rail-scroll mt-12 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-[clamp(1.15rem,4.5vw,4.5rem)] pb-5 sm:gap-4 md:mt-14">
        {REELS.map((reel, i) => (
          <a
            key={reel.id}
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("reel_click", { reel: reel.id })}
            className="group lift relative w-[62vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-white transition-[box-shadow,border-color] duration-500 hover:border-green-line hover:lift-lg sm:w-[34vw] lg:w-[17rem]"
          >
            <MediaFrame
              src={reel.thumbnail}
              alt={`Instagram reel — ${reel.caption}`}
              kind="scene"
              seed={i + 3}
              sizes="(max-width: 640px) 62vw, (max-width: 1024px) 34vw, 17rem"
              className="aspect-[9/16] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />

            {/* Light scrim: the frame beneath is light, so the wash is white. */}
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />

            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="lift flex h-12 w-12 items-center justify-center rounded-full border border-green-line bg-white/95 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                <Play
                  size={15}
                  fill="currentColor"
                  aria-hidden
                  className="translate-x-px text-green"
                />
              </span>
            </span>

            <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
              <span className="flex items-center justify-between gap-2.5 rounded-full border border-green-line bg-white/90 px-3.5 py-2 backdrop-blur-md">
                <span className="min-w-0 truncate font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink sm:text-[0.66rem]">
                  {reel.caption}
                </span>
                <InstagramIcon size={15} className="shrink-0" />
              </span>
            </span>
          </a>
        ))}
      </div>

      {!HAS_REAL_REELS && (
        <div className="shell mt-8">
          <DemoNote className="max-w-xl">
            Placeholder reel frames. Real reels and thumbnails from{" "}
            {SITE.instagramHandle} replace these — the links currently open the
            profile.
          </DemoNote>
        </div>
      )}
    </section>
  );
}
