import {
  BUYER,
  HUB,
  MATCH_ID,
  MOBILE_BUYER,
  MOBILE_HUB,
  MOBILE_SELLERS,
  MOBILE_STAGE,
  SELLERS,
  STAGE,
  hubPath,
} from "@/lib/network";
import { cn } from "@/lib/utils";

/**
 * The network stage.
 *
 * Two layers share one geometry: a dormant pale layer, and a green "lit" layer
 * revealed through a circular mask that the lens drags across the field. Moving
 * one mask circle is what makes the search read as a search — and it costs a
 * single animated transform.
 *
 * aria-hidden: this is illustration. The meaning is carried by the DOM headings
 * in ActTwo, so screen readers get the narrative without the coordinate soup.
 */

export function NetworkGraph({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      style={{ overflow: "visible" }}
      className={cn("net-desktop w-full", className)}
    >
      <defs>
        <mask id="net-lens-mask">
          <rect width={STAGE.width} height={STAGE.height} fill="black" />
          {/* r=1 so GSAP can drive position and radius with one transform. */}
          <circle className="lens-follow" cx="0" cy="0" r="1" fill="white" />
        </mask>

        {/* Tuned for a white ground: the wash has to read on paper, not glow on black. */}
        <radialGradient id="net-lens-glow" r="50%">
          <stop offset="60%" stopColor="#45a117" stopOpacity="0" />
          <stop offset="100%" stopColor="#45a117" stopOpacity="0.18" />
        </radialGradient>
      </defs>

      {/* ---- dormant layer ---- */}
      <g className="net-dormant">
        <path
          className="net-spine"
          d={`M ${BUYER.x} ${BUYER.y} L ${HUB.x} ${HUB.y}`}
          stroke="#c5d2bb"
          strokeWidth="1.25"
          fill="none"
        />
        {SELLERS.map((s) => (
          <path
            key={s.id}
            className="net-path"
            data-node={s.id}
            d={hubPath(s)}
            stroke="#c5d2bb"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </g>

      {/* ---- lit layer, revealed only where the lens is ---- */}
      <g mask="url(#net-lens-mask)">
        <path
          d={`M ${BUYER.x} ${BUYER.y} L ${HUB.x} ${HUB.y}`}
          stroke="#45a117"
          strokeWidth="1.5"
          fill="none"
        />
        {SELLERS.map((s) => (
          <path
            key={s.id}
            d={hubPath(s)}
            stroke="#45a117"
            strokeWidth="1.4"
            fill="none"
            opacity="0.85"
          />
        ))}
        {SELLERS.map((s) => (
          <circle key={s.id} cx={s.x} cy={s.y} r="7" fill="#45a117" />
        ))}
      </g>

      {/* ---- seller nodes ---- */}
      {SELLERS.map((s) => (
        <g key={s.id} className="net-node" data-node={s.id}>
          {/* Label carries a white knockout stroke so connector lines stay clear of it. */}
          <circle
            className="net-node-halo"
            cx={s.x}
            cy={s.y}
            r="20"
            fill="#45a117"
            opacity="0"
          />
          <circle
            cx={s.x}
            cy={s.y}
            r="7.5"
            fill="#ffffff"
            stroke="#b4c2a9"
            strokeWidth="1.25"
          />
          <circle className="net-node-core" cx={s.x} cy={s.y} r="3" fill="#6c7a64" />
          <text
            className="net-node-label"
            x={s.x}
            y={s.y + 27}
            textAnchor="middle"
            fill="#47563f"
            fontSize="11"
            fontFamily="var(--font-mono)"
            letterSpacing="1.4"
            stroke="#ffffff"
            strokeWidth="3.5"
            paintOrder="stroke"
          >
            {s.city.toUpperCase()}
          </text>
        </g>
      ))}

      {/* ---- match callout ---- */}
      <g className="net-match" data-node={MATCH_ID} opacity="0">
        {(() => {
          const m = SELLERS.find((s) => s.id === MATCH_ID)!;
          return (
            <>
              <circle
                cx={m.x}
                cy={m.y}
                r="30"
                fill="none"
                stroke="#45a117"
                strokeWidth="1.25"
              />
              <circle
                cx={m.x}
                cy={m.y}
                r="44"
                fill="none"
                stroke="#45a117"
                strokeWidth="1"
                opacity="0.35"
              />
            </>
          );
        })()}
      </g>

      {/* ---- buyer + hub ---- */}
      <g className="net-buyer">
        <circle cx={BUYER.x} cy={BUYER.y} r="7" fill="#47563f" />
        <text
          x={BUYER.x}
          y={BUYER.y + 28}
          textAnchor="middle"
          fill="#47563f"
          fontSize="11"
          fontFamily="var(--font-mono)"
          letterSpacing="1.4"
        >
          YOU
        </text>
      </g>

      <g className="net-hub">
        <circle
          className="net-hub-pulse"
          cx={HUB.x}
          cy={HUB.y}
          r="34"
          fill="url(#net-lens-glow)"
        />
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r="15"
          fill="#ffffff"
          stroke="#45a117"
          strokeWidth="1.75"
        />
        <circle cx={HUB.x} cy={HUB.y} r="5" fill="#45a117" />
        <text
          x={HUB.x}
          y={HUB.y + 40}
          textAnchor="middle"
          fill="#0e1b09"
          fontSize="12"
          fontFamily="var(--font-mono)"
          letterSpacing="1.8"
        >
          THE CAR-BAR
        </text>
      </g>

      {/*
        The travelling magnifier. Built at unit scale (glass r=1 centred on the
        origin) so the same x/y/scale tween drives both this and the mask circle
        above — the glass and the revealed area stay exactly aligned. Strokes are
        non-scaling so the instrument stays crisp at any sweep radius.
      */}
      <g className="net-lens" opacity="0">
        <g className="lens-follow">
          <path
            d="M 0.7071 0.7071 L 1.5 1.5"
            stroke="#2f7510"
            strokeOpacity="0.65"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="0" cy="0" r="1" fill="#45a117" fillOpacity="0.045" />
          <circle
            cx="0"
            cy="0"
            r="1"
            fill="none"
            stroke="#45a117"
            strokeOpacity="0.7"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="0"
            cy="0"
            r="0.9"
            fill="none"
            stroke="#45a117"
            strokeOpacity="0.22"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
      </svg>
  );
}

/** Simplified vertical diagram for narrow screens — same story, fewer nodes. */
export function NetworkGraphMobile({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MOBILE_STAGE.width} ${MOBILE_STAGE.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={cn("net-mobile w-full", className)}
    >
      <path
        className="m-spine"
        d={`M ${MOBILE_BUYER.x} ${MOBILE_BUYER.y} L ${MOBILE_HUB.x} ${MOBILE_HUB.y}`}
        stroke="#45a117"
        strokeWidth="1.25"
        fill="none"
      />

      {MOBILE_SELLERS.map((s) => (
        <path
          key={s.id}
          className="m-path"
          data-node={s.id}
          d={`M ${MOBILE_HUB.x} ${MOBILE_HUB.y} L ${s.x} ${s.y}`}
          stroke="#c5d2bb"
          strokeWidth="1"
          fill="none"
        />
      ))}

      <g className="m-buyer">
        <circle cx={MOBILE_BUYER.x} cy={MOBILE_BUYER.y} r="6" fill="#47563f" />
        <text
          x={MOBILE_BUYER.x}
          y={MOBILE_BUYER.y - 16}
          textAnchor="middle"
          fill="#47563f"
          fontSize="12"
          fontFamily="var(--font-mono)"
          letterSpacing="1.4"
        >
          YOU
        </text>
      </g>

      <g className="m-hub">
        <circle
          cx={MOBILE_HUB.x}
          cy={MOBILE_HUB.y}
          r="14"
          fill="#ffffff"
          stroke="#45a117"
          strokeWidth="1.75"
        />
        <circle cx={MOBILE_HUB.x} cy={MOBILE_HUB.y} r="4.5" fill="#45a117" />
        <text
          x={MOBILE_HUB.x}
          y={MOBILE_HUB.y - 26}
          textAnchor="middle"
          fill="#0e1b09"
          fontSize="13"
          fontFamily="var(--font-mono)"
          letterSpacing="1.6"
        >
          THE CAR-BAR
        </text>
      </g>

      {MOBILE_SELLERS.map((s) => (
        <g key={s.id} className="m-node" data-node={s.id}>
          <circle
            cx={s.x}
            cy={s.y}
            r={s.id === MATCH_ID ? 8 : 6}
            fill="#ffffff"
            stroke={s.id === MATCH_ID ? "#45a117" : "#c3cdbc"}
            strokeWidth="1.25"
          />
          <circle
            cx={s.x}
            cy={s.y}
            r="2.5"
            fill={s.id === MATCH_ID ? "#45a117" : "#7d8a76"}
          />
          <text
            x={s.x}
            y={s.y + 22}
            textAnchor="middle"
            fill={s.id === MATCH_ID ? "#2f7510" : "#47563f"}
            fontSize="12"
            fontFamily="var(--font-mono)"
            letterSpacing="1.2"
          >
            {s.city.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
