/**
 * Geometry for the network stage.
 *
 * Node positions form a loosely abstracted map of India — north cities high,
 * south cities low, west coast left — so "pan-India network" reads without
 * drawing a literal map. The SVG is aria-hidden; meaning is carried by the
 * real DOM headings beside it.
 */

export type SellerNode = {
  id: string;
  city: string;
  x: number;
  y: number;
  /** Sweep order — the lens ignites nodes in this sequence. */
  order: number;
};

/**
 * Wide stage (2.5:1) so the composition fills a desktop frame instead of
 * floating in the middle of it with dead space either side.
 */
export const STAGE = { width: 1200, height: 480 } as const;

/** Where the buyer's requirement enters, and where THE CAR-BAR sits. */
export const BUYER = { x: 55, y: 240 } as const;
export const HUB = { x: 290, y: 240 } as const;

/** The node that resolves to a potential match. Buyer is in Pune; the match is elsewhere. */
export const MATCH_ID = "mumbai";

export const SELLERS: SellerNode[] = [
  { id: "delhi", city: "Delhi", x: 660, y: 58, order: 3 },
  { id: "jaipur", city: "Jaipur", x: 562, y: 118, order: 2 },
  { id: "lucknow", city: "Lucknow", x: 812, y: 98, order: 4 },
  { id: "kolkata", city: "Kolkata", x: 1035, y: 190, order: 6 },
  { id: "ahmedabad", city: "Ahmedabad", x: 522, y: 232, order: 1 },
  { id: "indore", city: "Indore", x: 700, y: 232, order: 5 },
  { id: "nagpur", city: "Nagpur", x: 835, y: 292, order: 7 },
  { id: "mumbai", city: "Mumbai", x: 548, y: 350, order: 11 },
  { id: "hyderabad", city: "Hyderabad", x: 762, y: 372, order: 8 },
  { id: "pune", city: "Pune", x: 608, y: 410, order: 10 },
  { id: "bengaluru", city: "Bengaluru", x: 712, y: 432, order: 9 },
  { id: "chennai", city: "Chennai", x: 890, y: 418, order: 12 },
];

export const MATCH_NODE = SELLERS.find((s) => s.id === MATCH_ID)!;

/**
 * Lens waypoints across the field, ending on the match.
 * Radius widens mid-sweep (searching) then tightens on the lock (found).
 */
export const SWEEP = [
  { x: 700, y: 130, r: 130 },
  { x: 920, y: 240, r: 145 },
  { x: 680, y: 260, r: 150 },
  { x: 780, y: 400, r: 135 },
  { x: MATCH_NODE.x, y: MATCH_NODE.y, r: 92 },
] as const;

/** Straight hub→seller connectors; curvature is added in the path builder. */
export function hubPath(node: SellerNode) {
  const mx = (HUB.x + node.x) / 2;
  const my = (HUB.y + node.y) / 2;
  // Bow each line away from the hub axis so overlapping runs stay legible.
  const bow = (node.y - HUB.y) * 0.12;
  return `M ${HUB.x} ${HUB.y} Q ${mx - bow} ${my + bow} ${node.x} ${node.y}`;
}

/** Mobile runs a simplified vertical diagram rather than the full constellation. */
export const MOBILE_STAGE = { width: 360, height: 470 } as const;

export const MOBILE_SELLERS = [
  { id: "delhi", city: "Delhi", x: 60, y: 330 },
  { id: "ahmedabad", city: "Ahmedabad", x: 160, y: 392 },
  { id: "mumbai", city: "Mumbai", x: 262, y: 330 },
  { id: "pune", city: "Pune", x: 118, y: 250 },
  { id: "nagpur", city: "Nagpur", x: 232, y: 250 },
] as const;

export const MOBILE_BUYER = { x: 180, y: 58 } as const;
export const MOBILE_HUB = { x: 180, y: 160 } as const;
