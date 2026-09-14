/**
 * Single source of truth for business constants.
 * Values marked PLACEHOLDER must be replaced with client-supplied data before launch.
 */

export const SITE = {
  name: "THE CAR-BAR",
  tagline: "Fast deals. Fresh wheels.",
  proposition: "No waiting on your dream car.",
  serviceArea: "Pan-India Car Arrangement Service",
  url: "https://thecarbar.in", // PLACEHOLDER — confirm production domain
  instagram: "https://www.instagram.com/thecarbar.in/",
  instagramHandle: "@thecarbar.in",
} as const;

/** Client-supplied. E.164 (no spaces, no +) drives the WhatsApp and tel: links. */
export const CONTACT = {
  phoneE164: "918087310369",
  phoneDisplay: "+91 80873 10369",
  isPlaceholder: false,
} as const;

const WHATSAPP_INTRO =
  "Hi THE CAR-BAR, I'm looking for a car and would like to check what's possible.";

export const WHATSAPP_HREF = `https://wa.me/${CONTACT.phoneE164}?text=${encodeURIComponent(
  WHATSAPP_INTRO,
)}`;

export const CALL_HREF = `tel:+${CONTACT.phoneE164}`;

/**
 * Primary conversion target. Points at WhatsApp until the Find My Car page ships —
 * swap this one constant to "/find-my-car" at that point and every CTA follows.
 */
export const FIND_MY_CAR_HREF = WHATSAPP_HREF;

/** Claims here must stay verifiable — see CLAUDE.md §2. */
export const TRUST_POINTS = [
  {
    title: "Seller identity",
    body: "You know which authorised seller you are being connected with before anything moves forward.",
  },
  {
    title: "Vehicle details",
    body: "Variant, colour, transmission and specification are confirmed with the seller — not assumed.",
  },
  {
    title: "Deal information",
    body: "Pricing and terms come from the authorised seller, so you can verify them directly.",
  },
  {
    title: "The purchase itself",
    body: "Your invoice, payment and delivery are handled by the authorised seller. THE CAR-BAR coordinates the connection.",
  },
] as const;
