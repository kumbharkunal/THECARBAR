/**
 * Customer stories.
 *
 * `vehicle` is optional and `image: null` renders the art-directed frame, so the
 * section reads as finished before the client's delivery photography arrives.
 * Real photographs should only be published with the customer's consent.
 */

export type Story = {
  id: string;
  headline: string;
  vehicle?: string;
  city: string;
  image: string | null;
};

export const STORIES: Story[] = [
  {
    id: "s1",
    headline: "A requirement that started with a long local wait",
    city: "Pune",
    image: null,
  },
  {
    id: "s2",
    headline: "Coordinated with an authorised seller in another city",
    city: "Mumbai",
    image: null,
  },
  {
    id: "s3",
    headline: "Specification confirmed before anything moved forward",
    city: "Nashik",
    image: null,
  },
];
