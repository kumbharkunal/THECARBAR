/**
 * DEMO CONTENT — layout scaffolding only.
 *
 * These are NOT real customers and must never be presented as such. Every entry
 * carries isDemo, and the section renders a visible DemoNote while any remain.
 * Replace with client-supplied, consented testimonials before launch.
 */

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  vehicle: string;
  location: string;
  isDemo: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The waiting period I was quoted locally would have run past the date we needed the car. It was worth asking whether anything else was possible.",
    name: "Sample customer",
    vehicle: "Sample vehicle",
    location: "Maharashtra",
    isDemo: true,
  },
  {
    id: "t2",
    quote:
      "What I wanted was a straight answer about what was actually available, and who I would be buying from.",
    name: "Sample customer",
    vehicle: "Sample vehicle",
    location: "Maharashtra",
    isDemo: true,
  },
  {
    id: "t3",
    quote:
      "Knowing the paperwork and the payment sat with the authorised seller made the whole thing easier to trust.",
    name: "Sample customer",
    vehicle: "Sample vehicle",
    location: "Maharashtra",
    isDemo: true,
  },
];

export const HAS_REAL_TESTIMONIALS = TESTIMONIALS.some((t) => !t.isDemo);
