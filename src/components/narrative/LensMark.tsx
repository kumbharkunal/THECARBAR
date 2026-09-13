/**
 * The hero's magnifying glass.
 *
 * Drawn as an actual magnifier — rim, glass, handle — rather than the abstract
 * ringed circle it replaced, which read as a radar dial. Orientation matches the
 * logo (glass upper-left, handle lower-right) so it echoes the brand without
 * reproducing the mark itself: no car glyph, thinner rim, open glass.
 */
export function LensMark() {
  const CX = 245;
  const CY = 245;
  const R = 172;
  // Where the rim meets the handle, at 45°.
  const JOIN = R * Math.SQRT1_2;

  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="lens-glass" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#45a117" stopOpacity="0.11" />
          <stop offset="62%" stopColor="#45a117" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#45a117" stopOpacity="0.02" />
        </radialGradient>
        <linearGradient id="lens-rim" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#45a117" />
          <stop offset="55%" stopColor="#45a117" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#2f7510" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="lens-handle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f7510" />
          <stop offset="100%" stopColor="#45a117" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Handle first, so the rim caps it cleanly. */}
      <path
        d={`M ${CX + JOIN} ${CY + JOIN} L 522 522`}
        stroke="url(#lens-handle)"
        strokeWidth="30"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${CX + JOIN + 14} ${CY + JOIN + 14} L 508 508`}
        stroke="#ffffff"
        strokeOpacity="0.25"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx={CX} cy={CY} r={R} fill="url(#lens-glass)" />

      {/* Reticle — an instrument reading the glass, not a radar sweep. */}
      <g stroke="#45a117" strokeOpacity="0.22" strokeWidth="1.25">
        <path d={`M ${CX} ${CY - 96} V ${CY - 34} M ${CX} ${CY + 34} V ${CY + 96}`} />
        <path d={`M ${CX - 96} ${CY} H ${CX - 34} M ${CX + 34} ${CY} H ${CX + 96}`} />
      </g>
      <circle cx={CX} cy={CY} r="4.5" fill="#2f7510" fillOpacity="0.5" />

      {/* Rim: a weighted ring, plus a hairline inside it for depth. */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="url(#lens-rim)"
        strokeWidth="13"
      />
      <circle
        cx={CX}
        cy={CY}
        r={R - 13}
        fill="none"
        stroke="#45a117"
        strokeOpacity="0.2"
        strokeWidth="1.25"
      />

      {/* Single specular arc — the only thing that says "glass". */}
      <path
        d={`M ${CX - 118} ${CY - 66} A ${R - 26} ${R - 26} 0 0 1 ${CX - 52} ${CY - 130}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.75"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
