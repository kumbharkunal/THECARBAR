import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Instagram reel covers, scraped every three days (src/lib/instagram.ts).
     *
     * No `search` key on purpose: these URLs are signed, so they always carry a
     * query string, and `search: ""` would reject every one of them.
     *
     * Those signatures also expire, which is the whole risk of showing our own
     * thumbnails. `minimumCacheTTL` is the answer: once Next has optimised a
     * cover it serves its own copy for a month, so the card keeps working long
     * after Instagram stops honouring the original link.
     */
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
