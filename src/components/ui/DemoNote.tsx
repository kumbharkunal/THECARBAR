import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The page is white + green only. `tone` survives as part of the public type so
 * existing callers keep type-checking, but "dark" is now an alias of "light" —
 * both render the same light styling.
 */
type Tone = "dark" | "light";

const TONE_TEXT: Record<Tone, string> = {
  dark: "text-ink-faint",
  light: "text-ink-faint",
};

/**
 * Marks placeholder content as placeholder. Required wherever demo data renders
 * so nothing generated can be mistaken for a real customer claim (CLAUDE.md §2).
 */
export function DemoNote({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 font-mono text-[0.7rem] leading-relaxed tracking-[0.04em]",
        TONE_TEXT[tone],
        className,
      )}
    >
      <Info
        size={13}
        strokeWidth={2}
        aria-hidden
        className="mt-0.5 shrink-0 text-green"
      />
      <span>{children}</span>
    </p>
  );
}
