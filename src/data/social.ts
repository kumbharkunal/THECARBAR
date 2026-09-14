import { CALL_HREF, SITE, WHATSAPP_HREF } from "./site";

/**
 * Social destinations for the footer.
 *
 * `href: null` marks a channel the client has not given us yet — those render as
 * a muted, non-clickable mark rather than a dead link. Fill the URL in and the
 * icon becomes live with no component change.
 */
export type Social = {
  label: string;
  href: string | null;
  icon: string;
};

export const SOCIALS: Social[] = [
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: "/brand/social/whatsapp.svg" },
  { label: "Instagram", href: SITE.instagram, icon: "/brand/social/instagram.svg" },
  { label: "Facebook", href: null, icon: "/brand/social/facebook.svg" },
  { label: "LinkedIn", href: null, icon: "/brand/social/linkedin.svg" },
  { label: "X", href: null, icon: "/brand/social/x.svg" },
];

export const HAS_ALL_SOCIALS = SOCIALS.every((s) => s.href);

export { CALL_HREF };
