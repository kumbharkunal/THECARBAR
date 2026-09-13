import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null;
  alt: string;
  /** Silhouette reads as a vehicle; scene is an abstract graded field. */
  kind?: "vehicle" | "scene";
  className?: string;
  sizes?: string;
  priority?: boolean;
  seed?: number;
};

/**
 * Renders a real image when one exists, and an art-directed composition when it
 * does not — so the page looks finished rather than broken while the client's
 * photography is outstanding. Swapping in a real path needs no component change.
 */
export function MediaFrame({
  src,
  alt,
  kind = "vehicle",
  className,
  sizes = "(max-width: 1024px) 100vw, 45vw",
  priority = false,
  seed = 0,
}: Props) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-3", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  // Offsets keep repeated placeholders from looking identical in a grid.
  const glowX = 34 + ((seed * 17) % 30);
  const glowY = 28 + ((seed * 11) % 26);

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative overflow-hidden bg-paper-3", className)}
    >
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id={`mf-glow-${seed}`} cx={`${glowX}%`} cy={`${glowY}%`} r="72%">
            <stop offset="0%" stopColor="#45a117" stopOpacity="0.20" />
            <stop offset="55%" stopColor="#45a117" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#45a117" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`mf-field-${seed}`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#f4f8f0" />
            <stop offset="60%" stopColor="#eef3ea" />
            <stop offset="100%" stopColor="#e3ecdb" />
          </linearGradient>
          <linearGradient id={`mf-rim-${seed}`} x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#45a117" stopOpacity="0" />
            <stop offset="48%" stopColor="#45a117" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#45a117" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`mf-shadow-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#334b28" stopOpacity="0.22" />
            <stop offset="62%" stopColor="#334b28" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#334b28" stopOpacity="0" />
          </radialGradient>
          <filter id={`mf-grain-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        <rect width="400" height="240" fill={`url(#mf-field-${seed})`} />
        <rect width="400" height="240" fill={`url(#mf-glow-${seed})`} />

        {kind === "vehicle" && (
          <g>
            {/* Contact shadow grounds the silhouette so it doesn't float. */}
            <ellipse cx="208" cy="206" rx="162" ry="16" fill={`url(#mf-shadow-${seed})`} />
            <circle cx="112" cy="176" r="29" fill="#9aae8d" />
            <circle cx="304" cy="176" r="29" fill="#9aae8d" />
            <path
              d="M 18 176 L 18 148 C 20 134 32 126 50 122 L 104 108 L 140 72
                 C 148 62 160 58 176 58 L 262 58 C 280 58 292 64 300 76
                 L 322 110 L 362 120 C 378 124 384 134 384 148 L 384 176
                 L 338 176 A 34 34 0 0 0 270 176 L 146 176 A 34 34 0 0 0 78 176 Z"
              fill="#bdcdb3"
            />
            {/* Rim light along the roofline — the only bright edge. */}
            <path
              d="M 140 72 C 148 62 160 58 176 58 L 262 58 C 280 58 292 64 300 76"
              fill="none"
              stroke={`url(#mf-rim-${seed})`}
              strokeWidth="1.75"
            />
            <path
              d="M 112 104 L 144 76 C 150 68 160 65 174 65 L 258 65
                 C 272 65 282 70 288 80 L 306 108 Z"
              fill="#cfdcc7"
            />
          </g>
        )}

        {kind === "scene" && (
          <g opacity="0.65">
            <path
              d="M -20 190 L 180 96 L 420 150"
              fill="none"
              stroke="#c3d2ba"
              strokeWidth="1.25"
            />
            <path
              d="M -20 214 L 200 128 L 420 182"
              fill="none"
              stroke="#d2ddca"
              strokeWidth="1.25"
            />
            <path
              d="M 120 -10 L 120 250"
              stroke={`url(#mf-rim-${seed})`}
              strokeWidth="1.25"
            />
          </g>
        )}

        <rect
          width="400"
          height="240"
          filter={`url(#mf-grain-${seed})`}
          opacity="0.022"
        />
      </svg>
    </div>
  );
}
