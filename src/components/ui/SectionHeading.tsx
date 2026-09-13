import { cn } from "@/lib/utils";

/**
 * The page is white + green only. `tone` survives as part of the public type so
 * existing callers keep type-checking, but "dark" is now an alias of "light" —
 * both render the same light styling.
 */
type Tone = "dark" | "light";

/** Green TEXT on a light ground must be green-deep (5.72:1). #45a117 fails AA. */
const EYEBROW_TEXT: Record<Tone, string> = {
  dark: "text-green-deep",
  light: "text-green-deep",
};

/** The rule is a mark, not text — full brand green is correct here. */
const EYEBROW_RULE: Record<Tone, string> = {
  dark: "bg-green",
  light: "bg-green",
};

const TITLE_TEXT: Record<Tone, string> = {
  dark: "text-ink",
  light: "text-ink",
};

const INTRO_TEXT: Record<Tone, string> = {
  dark: "text-ink-soft",
  light: "text-ink-soft",
};

export function Eyebrow({
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
        "label-mono flex items-center gap-2.5",
        EYEBROW_TEXT[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("inline-block h-px w-5 shrink-0 sm:w-7", EYEBROW_RULE[tone])}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={cn("display-lg mt-4 uppercase sm:mt-5", TITLE_TEXT[tone])}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("body-lg mt-5 max-w-2xl sm:mt-6", INTRO_TEXT[tone])}>
          {intro}
        </p>
      )}
    </div>
  );
}
