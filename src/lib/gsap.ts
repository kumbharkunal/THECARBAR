"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// The only registerPlugin call in the project (CLAUDE.md §5).
gsap.registerPlugin(useGSAP, ScrollTrigger);

gsap.defaults({ duration: 0.8, ease: "power3.out" });

/** Flip to true locally to show ScrollTrigger markers. Never commit as true. */
export const DEBUG_MOTION = false;

/**
 * Pin lengths, in pixels of scroll.
 *
 * These are deliberately short. A scrubbed pin costs the visitor real scrolling,
 * and the first version of this page spent ~5,700px on three pins — the story
 * read as slow because reaching the next beat took several flicks. Each act now
 * resolves in roughly one screen of travel. Tune the page's pace here, not in
 * the components.
 */
export const PIN = {
  actOne: 620,
  actTwo: 1050,
  /** Extra travel past the horizontal rail's own width. */
  howItWorksTail: 0.1,
} as const;

/** Pinning is disabled below this width — see CLAUDE.md §5. */
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const MOBILE_QUERY = "(max-width: 1023px)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/** Named conditions shared by every scroll-driven component. */
export const MOTION_CONDITIONS = {
  isDesktop: DESKTOP_QUERY,
  isMobile: MOBILE_QUERY,
  reduceMotion: REDUCED_QUERY,
} as const;

export type MotionConditions = {
  isDesktop: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
};

/**
 * Pin refresh order. Three pinned sections share this page, and each one's start
 * must be measured with the earlier sections' pin spacing already applied —
 * otherwise every later pin starts thousands of pixels too early.
 *
 * ScrollTrigger sorts by `refreshPriority * -1e6` (ScrollTrigger.js), so a
 * HIGHER number refreshes FIRST. First section on the page therefore gets the
 * highest value, descending down the page.
 */
export const PRIORITY = {
  actOne: 3,
  actTwo: 2,
  howItWorks: 1,
} as const;

/**
 * Recalculate trigger positions once the page has actually settled.
 * Fonts and images change layout after hydration, which invalidates pin maths.
 */
export function refreshWhenSettled() {
  if (typeof document === "undefined") return;

  const refresh = () => ScrollTrigger.refresh();

  if (document.fonts?.status === "loaded") {
    refresh();
  } else {
    document.fonts?.ready.then(refresh);
  }

  if (document.readyState !== "complete") {
    window.addEventListener("load", refresh, { once: true });
  }
}

export { gsap, ScrollTrigger, useGSAP };
