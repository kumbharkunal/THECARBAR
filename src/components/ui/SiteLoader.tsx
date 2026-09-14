"use client";

import { useEffect, useRef, useState } from "react";

/**
 * First-visit loader: the lens sweeps across a car, then the wordmark resolves.
 *
 * It is the page's own idea in miniature — we search, then we find — so it
 * introduces the brand rather than merely occupying the wait.
 *
 * Three rules keep a loader from becoming an obstacle:
 *  - It never gates content. The page renders underneath from the first frame;
 *    this only covers it, and it leaves on `load` or after MAX_MS, whichever
 *    comes first. A slow third-party embed can never strand a visitor here.
 *  - It shows once per session, so navigating back is not punished.
 *  - Reduced motion and a repeat visit dismiss it before the first paint.
 *
 * It renders by default rather than being switched on in an effect: that keeps
 * the server and client markup identical (no hydration mismatch) and means
 * there is never a flash of unstyled page before it appears.
 */
const MIN_MS = 900;
const MAX_MS = 2600;
const EXIT_MS = 520;
const SESSION_KEY = "carbar:seen-loader";

type Phase = "showing" | "leaving" | "done";

export function SiteLoader() {
  const [phase, setPhase] = useState<Phase>("showing");
  const startedAt = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    let reduced = false;
    let seen = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Private mode can throw on storage access; treat it as a first visit.
    }

    // Deferred out of the effect body so this never cascades a render.
    if (reduced || seen) {
      queueMicrotask(() => setPhase("done"));
      return;
    }

    startedAt.current = performance.now();
    root.style.overflow = "clip";

    const timers: number[] = [];
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      const elapsed = performance.now() - startedAt.current;

      timers.push(
        window.setTimeout(() => {
          setPhase("leaving");
          timers.push(
            window.setTimeout(() => {
              setPhase("done");
              root.style.removeProperty("overflow");
              try {
                sessionStorage.setItem(SESSION_KEY, "1");
              } catch {
                /* nothing to recover */
              }
            }, EXIT_MS),
          );
        }, Math.max(0, MIN_MS - elapsed)),
      );
    };

    if (document.readyState === "complete") dismiss();
    else window.addEventListener("load", dismiss, { once: true });

    // Backstop: never let a stalled resource hold the page hostage.
    timers.push(window.setTimeout(dismiss, MAX_MS));

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", dismiss);
      root.style.removeProperty("overflow");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      role="presentation"
      className={`site-loader${phase === "leaving" ? " is-leaving" : ""}`}
    >
      <div className="site-loader__stage">
        <svg viewBox="0 0 220 132" className="site-loader__art">
          <defs>
            <clipPath id="loader-reveal">
              <circle className="site-loader__mask" cx="0" cy="66" r="27" />
            </clipPath>
          </defs>

          {/* Dormant car, waiting to be found. */}
          <g fill="none" stroke="#c9d6bf" strokeWidth="2.4">
            <CarPath />
          </g>

          {/* The same car, lit — revealed only where the lens passes. */}
          <g clipPath="url(#loader-reveal)" fill="none" stroke="#45a117" strokeWidth="2.6">
            <CarPath />
          </g>

          {/* The instrument itself, travelling with the reveal. */}
          <g className="site-loader__lens">
            <circle cx="0" cy="66" r="27" fill="#45a117" fillOpacity="0.06" />
            <circle cx="0" cy="66" r="27" fill="none" stroke="#45a117" strokeWidth="2.6" />
            <path
              d="M 19.1 85.1 L 31 97"
              stroke="#2f7510"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        <p className="site-loader__word">
          {"THE CAR-BAR".split("").map((c, i) => (
            <span key={`${c}-${i}`} style={{ animationDelay: `${0.32 + i * 0.035}s` }}>
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/** Side profile, drawn once and reused by both the dormant and lit layers. */
function CarPath() {
  return (
    <>
      <path
        d="M14 84 L14 70 C15 63 21 59 30 57 L58 51 L77 33
           C82 28 88 26 96 26 L139 26 C148 26 154 29 158 35
           L170 52 L190 57 C198 59 202 64 202 71 L202 84"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 84 L52 84 M78 84 L146 84 M172 84 L202 84" strokeLinecap="round" />
      <circle cx="65" cy="84" r="13" />
      <circle cx="159" cy="84" r="13" />
      <path d="M60 55 L82 37 C85 33 90 31 97 31 L136 31 C143 31 148 34 151 39 L160 53 Z" />
    </>
  );
}
