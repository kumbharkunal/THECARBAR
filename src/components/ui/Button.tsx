"use client";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost-dark" | "ghost-light";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  /** Magnetic pull on pointer devices. Disabled for reduced motion. */
  magnetic?: boolean;
};

/**
 * The page is white + green only, so there is no longer a dark ground to sit on.
 * "ghost-dark" is kept as a legacy alias of "ghost-light" so existing callers
 * keep type-checking; both render the same light styling.
 */
const GHOST_LIGHT =
  "border border-line bg-paper text-ink hover:border-green-line hover:bg-green-soft hover:text-green-dark";

const VARIANTS: Record<Variant, string> = {
  // Solid brand green fill, white label. The one place green floods.
  primary: "bg-green text-ink hover:bg-green-deep hover:text-white lift",
  "ghost-dark": GHOST_LIGHT,
  "ghost-light": GHOST_LIGHT,
};

export function Button({
  href,
  children,
  variant = "primary",
  withArrow = true,
  external = false,
  onClick,
  className,
  magnetic = false,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || !magnetic || !contextSafe) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      // quickTo reuses one tween instead of spawning tweens per pointer event.
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const onMove = contextSafe((event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * 0.22);
        yTo((event.clientY - (rect.top + rect.height / 2)) * 0.3);
      });

      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [magnetic] },
  );

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        // min-h 52px keeps the touch target comfortably above the 44px floor.
        "group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full",
        "px-6 py-3.5 sm:gap-3 sm:px-7",
        "font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] whitespace-nowrap",
        "transition-colors duration-300",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
      {withArrow && (
        <ArrowRight
          size={15}
          strokeWidth={2.25}
          aria-hidden
          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        />
      )}
    </a>
  );
}
