/**
 * Customer quotes.
 *
 * `name` and `vehicle` are optional: until the client supplies consented
 * attribution, only the location renders. Fill them in and they appear
 * automatically — no component change.
 */

export type Testimonial = {
  id: string;
  quote: string;
  name?: string;
  vehicle?: string;
  location: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The waiting period I was quoted locally would have run past the date we needed the car. It was worth asking whether anything else was possible.",
    location: "Maharashtra",
  },
  {
    id: "t2",
    quote:
      "What I wanted was a straight answer about what was actually available, and who I would be buying from.",
    location: "Maharashtra",
  },
  {
    id: "t3",
    quote:
      "Knowing the paperwork and the payment sat with the authorised seller made the whole thing easier to trust.",
    location: "Maharashtra",
  },
];
