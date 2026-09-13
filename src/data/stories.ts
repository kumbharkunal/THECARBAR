/**
 * DEMO CONTENT — see testimonials.ts. Delivery photography requires the
 * customer's consent before it can appear here.
 */

export type Story = {
  id: string;
  headline: string;
  vehicle: string;
  city: string;
  /** null renders the placeholder frame. */
  image: string | null;
  isDemo: boolean;
};

export const STORIES: Story[] = [
  {
    id: "s1",
    headline: "A requirement that started with a long local wait",
    vehicle: "Sample vehicle",
    city: "Pune",
    image: null,
    isDemo: true,
  },
  {
    id: "s2",
    headline: "Coordinated with an authorised seller in another city",
    vehicle: "Sample vehicle",
    city: "Mumbai",
    image: null,
    isDemo: true,
  },
  {
    id: "s3",
    headline: "Specification confirmed before anything moved forward",
    vehicle: "Sample vehicle",
    city: "Nashik",
    image: null,
    isDemo: true,
  },
];

export const HAS_REAL_STORIES = STORIES.some((s) => !s.isDemo);
