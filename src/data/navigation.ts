/** Homepage is the only built route; the rest are in-page anchors until those pages exist. */
export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Available cars", href: "#available-cars" },
  { label: "Stories", href: "#stories" },
  { label: "Why us", href: "#why" },
  { label: "Contact", href: "#contact" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
