/**
 * Instagram reels. Placeholder entries until the client supplies real URLs and
 * thumbnails — Instagram is never scraped and no live embed is depended on.
 */

export type Reel = {
  id: string;
  /** Real permalink when supplied; profile URL is the safe fallback. */
  url: string;
  /** null renders the placeholder frame. */
  thumbnail: string | null;
  caption: string;
  isPlaceholder: boolean;
};

export const REELS: Reel[] = [
  {
    id: "reel-1",
    url: "https://www.instagram.com/thecarbar.in/",
    thumbnail: null,
    caption: "Delivery day",
    isPlaceholder: true,
  },
  {
    id: "reel-2",
    url: "https://www.instagram.com/thecarbar.in/",
    thumbnail: null,
    caption: "Walkaround",
    isPlaceholder: true,
  },
  {
    id: "reel-3",
    url: "https://www.instagram.com/thecarbar.in/",
    thumbnail: null,
    caption: "Handover",
    isPlaceholder: true,
  },
  {
    id: "reel-4",
    url: "https://www.instagram.com/thecarbar.in/",
    thumbnail: null,
    caption: "On the road",
    isPlaceholder: true,
  },
  {
    id: "reel-5",
    url: "https://www.instagram.com/thecarbar.in/",
    thumbnail: null,
    caption: "New arrival",
    isPlaceholder: true,
  },
];
