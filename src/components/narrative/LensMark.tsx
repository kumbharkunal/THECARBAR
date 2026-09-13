/**
 * Decorative lens motif for the hero.
 *
 * Deliberately NOT the logo: thin technical strokes, crosshairs, no car glyph,
 * no filled ring. It establishes the "searching" idea that the narrative acts
 * then animate, while leaving the actual logo untouched (CLAUDE.md §3).
 *
 * Tuned for a WHITE ground: every stroke is brand green at low alpha and the
 * wash is a soft green radial — no dark fills anywhere.
 */
export function LensMark() {
  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="lens-fill" cx="42%" cy="36%" r="66%">
          <stop offset="0%" stopColor="#45a117" stopOpacity="0.14" />
          <stop offset="70%" stopColor="#45a117" stopOpacity="0.045" />
          <stop offset="100%" stopColor="#45a117" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lens-ring" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#45a117" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#45a117" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#45a117" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <circle cx="250" cy="250" r="196" fill="url(#lens-fill)" />
      <circle
        cx="250"
        cy="250"
        r="196"
        fill="none"
        stroke="url(#lens-ring)"
        strokeWidth="1.5"
      />
      <circle
        cx="250"
        cy="250"
        r="168"
        fill="none"
        stroke="#45a117"
        strokeOpacity="0.2"
        strokeWidth="1"
      />

      {/* Crosshairs — instrument, not ornament. */}
      <g stroke="#45a117" strokeOpacity="0.28" strokeWidth="1">
        <path d="M250 42 V 150 M250 350 V 458" />
        <path d="M42 250 H 150 M350 250 H 458" />
      </g>
      <circle cx="250" cy="250" r="5" fill="#2f7510" fillOpacity="0.7" />

      {/* Measurement ticks around the rim. */}
      <g stroke="#45a117" strokeOpacity="0.38" strokeWidth="1.25">
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const inner = i % 3 === 0 ? 178 : 188;
          return (
            <path
              key={i}
              d={`M ${250 + Math.cos(angle) * inner} ${250 + Math.sin(angle) * inner}
                  L ${250 + Math.cos(angle) * 196} ${250 + Math.sin(angle) * 196}`}
            />
          );
        })}
      </g>

      <path
        d="M 389 389 L 545 545"
        stroke="url(#lens-ring)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
