"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger child elements matching this selector instead of the wrapper itself. */
  stagger?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "figure";
};

/**
 * Scroll reveal. Hidden state is applied via gsap.set() at runtime — never a CSS
 * default — so content stays visible if JS fails (CLAUDE.md §5).
 */
export function Reveal({
  children,
  className,
  stagger,
  delay = 0,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const targets = stagger
        ? Array.from(root.querySelectorAll<HTMLElement>(stagger))
        : [root];
      if (!targets.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };

          if (reduce) {
            // Still reveal, but with opacity only — no travel.
            gsap.set(targets, { opacity: 0 });
            ScrollTrigger.create({
              trigger: root,
              start: "top 92%",
              once: true,
              onEnter: () => gsap.to(targets, { opacity: 1, duration: 0.4 }),
            });
            return;
          }

          gsap.set(targets, { opacity: 0, y: 26 });
          ScrollTrigger.create({
            trigger: root,
            start: "top 92%",
            once: true,
            onEnter: () =>
              gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration: 0.55,
                delay,
                ease: "power3.out",
                stagger: stagger ? 0.05 : 0,
              }),
          });
        },
      );
    },
    { scope: ref, dependencies: [stagger, delay] },
  );

  return (
    <Tag ref={ref as React.Ref<never>} className={cn(className)}>
      {children}
    </Tag>
  );
}
