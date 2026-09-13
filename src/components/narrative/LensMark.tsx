/**
 * The magnifier FRAME — rim, handle and one specular arc.
 *
 * Deliberately hollow: HeroLens positions a circular viewport behind it and
 * cycles car images through the glass, so anything painted inside the rim here
 * would sit on top of them. Orientation matches the logo (glass upper-left,
 * handle lower-right) so it echoes the brand without reproducing the mark.
 *
 * The rim geometry below (CX/CY 245, R 172 in a 600 viewBox) is the contract
 * HeroLens measures its viewport against — change one, change both.
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
