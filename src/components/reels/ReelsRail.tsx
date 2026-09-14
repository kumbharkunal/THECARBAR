"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { reelPermalink, reelVideoSrc, type RailReel } from "@/data/reels";
import { SITE } from "@/data/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { InstagramIcon } from "@/components/ui/icons";

/**
 * The rail. One reel plays at a time — whichever card sits nearest the middle
 * of the rail — muted and looping, with the cover image showing underneath
 * until the first frame is ready.
 *
 * Playing all twelve at once would be four simultaneous 9 MB downloads on a
 * desktop and a chaotic thing to look at on a page this restrained.
 *
 * Each card is ours rather than Instagram's `/embed` iframe. Five cross-origin
 * iframes cost a few hundred KB each, could not be styled, forced a magic
 * `h-[640px]`, and were the only focus-ring failures in the a11y audit.
 */
export function ReelsRail({ reels }: { reels: RailReel[] }) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  /** Which videos have painted a frame, so the cover can step aside. */
  const [ready, setReady] = useState<Record<string, boolean>>({});

  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const playing = !paused && !reduced && inView;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  // Nothing plays while the section is off-screen — no point streaming video
  // nobody is looking at, and it keeps a parked tab quiet.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Nearest card to the rail's centre. Intersection ratios cannot decide this:
  // on a wide screen four cards are fully visible and all score 1.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      // Only cards that can actually play are candidates. Reels too large to
      // cache carry no video, and letting one win the centre would leave the
      // whole rail silent while nine playable reels sat either side of it.
      let best = -1;
      let bestDistance = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el || !reels[i]?.hasVideo) return;
        const distance = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActive(best);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    // Deferred, not called straight away: a synchronous setState in an effect
    // cascades a second render before paint (react-hooks/set-state-in-effect).
    schedule();
    rail.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      rail.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reels]);

  // One plays, the rest rewind. `play()` rejects when the browser declines
  // autoplay; that is a normal outcome, not an error worth surfacing.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (playing && i === active) {
        void video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== active) video.currentTime = 0;
      }
    });
  }, [active, playing]);

  // React drops `muted` from the markup often enough that the property has to
  // be written directly, or the first autoplay is blocked as unmuted.
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) video.muted = muted;
    });
  }, [muted]);

  const markReady = useCallback((shortcode: string) => {
    setReady((prev) => (prev[shortcode] ? prev : { ...prev, [shortcode]: true }));
  }, []);

  const hasVideo = reels.some((r) => r.hasVideo);

  return (
    <section
      ref={sectionRef}
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

          <div className="flex items-center gap-2.5">
            {/*
              WCAG 2.2.2: moving content needs a way to stop it. Hidden when
              reduced motion already holds everything still, and when no reel
              actually carries a video, where the controls would do nothing.
            */}
            {hasVideo && !reduced && (
              <>
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-green-line hover:bg-green-soft hover:text-green-deep"
                >
                  <span className="sr-only">
                    {paused ? "Play reels" : "Pause reels"}
                  </span>
                  {paused ? (
                    <Play size={15} fill="currentColor" strokeWidth={0} aria-hidden />
                  ) : (
                    <Pause size={15} fill="currentColor" strokeWidth={0} aria-hidden />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-pressed={!muted}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-green-line hover:bg-green-soft hover:text-green-deep"
                >
                  <span className="sr-only">
                    {muted ? "Unmute reels" : "Mute reels"}
                  </span>
                  {muted ? (
                    <VolumeX size={16} aria-hidden />
                  ) : (
                    <Volume2 size={16} aria-hidden />
                  )}
                </button>
              </>
            )}

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
      </div>

      <div className="shell mt-10 md:mt-12">
        <div
          ref={railRef}
          className="rail-scroll rail-inset flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 sm:gap-5"
        >
          {reels.map((reel, i) => {
            const isActive = i === active;
            const isPlaying = isActive && playing && reel.hasVideo;
            const showVideo = reel.hasVideo && ready[reel.shortcode] && isPlaying;

            return (
              <article
                key={reel.shortcode}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  "lift group flex w-[17.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white transition-[box-shadow,border-color] duration-500 sm:w-[20.625rem]",
                  isActive ? "border-green-line" : "border-line",
                )}
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-paper-3">
                  {/*
                    The cover sits underneath rather than in the `poster`
                    attribute: poster takes a raw URL, and Instagram's expires
                    in about 34 hours. Through MediaFrame it is a next/image
                    copy that keeps working for a month.

                    `scene` and not the default `vehicle`: that silhouette is
                    drawn on a 400x240 artboard, so in a 9:16 frame it becomes a
                    magnified sliver of a car door.
                  */}
                  <div className="absolute inset-0">
                    <MediaFrame
                      src={reel.thumbnail ?? null}
                      alt=""
                      kind="scene"
                      seed={i}
                      sizes="(max-width: 640px) 280px, 330px"
                      className="h-full w-full"
                    />
                  </div>

                  {reel.hasVideo && (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={reelVideoSrc(reel.shortcode)}
                      muted
                      loop
                      playsInline
                      preload={isActive ? "auto" : "none"}
                      onLoadedData={() => markReady(reel.shortcode)}
                      tabIndex={-1}
                      aria-hidden
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                        showVideo ? "opacity-100" : "opacity-0",
                      )}
                    />
                  )}

                  {/*
                    The whole frame toggles playback — a far better target than
                    a glyph, and it is a real button so it is keyboard reachable
                    and carries a focus ring.
                  */}
                  {reel.hasVideo && !reduced && (
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      className="absolute inset-0 z-10 flex items-center justify-center"
                    >
                      <span className="sr-only">
                        {isPlaying ? "Pause this reel" : "Play this reel"}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-full bg-green text-ink shadow-[0_2px_18px_rgba(14,27,9,0.22)] transition-all duration-500",
                          isPlaying
                            ? "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                            : "scale-100 opacity-100",
                        )}
                      >
                        {isPlaying ? (
                          <Pause size={19} fill="currentColor" strokeWidth={0} />
                        ) : (
                          <Play size={20} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                        )}
                      </span>
                    </button>
                  )}

                  {/* Sound belongs on the card that is actually making it. */}
                  {isPlaying && (
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      aria-pressed={!muted}
                      className="absolute bottom-3 right-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur-md transition-colors hover:bg-white"
                    >
                      <span className="sr-only">
                        {muted ? "Unmute" : "Mute"}
                      </span>
                      {muted ? (
                        <VolumeX size={15} aria-hidden />
                      ) : (
                        <Volume2 size={15} aria-hidden />
                      )}
                    </button>
                  )}
                </div>

                <a
                  href={reelPermalink(reel)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("reel_click", { reel: reel.shortcode })}
                  className={cn(
                    "flex min-h-[3rem] items-center gap-3 border-t border-line px-4 py-3 transition-colors hover:bg-green-soft",
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
                  <span className="sr-only">
                    {reel.caption
                      ? `Open “${reel.caption}” on Instagram`
                      : "Open this reel on Instagram"}
                  </span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
