# Assets & content still needed from the client

The homepage is complete and ships with honest, clearly-labelled placeholders for
everything below. Nothing here blocks a demo — each item is a straight swap in the
data layer, with no component changes.

**Rule that governs this file:** placeholder imagery and wording must never be
presented as a real customer, delivery, or seller relationship. Replace before launch.

---

## 1. Brand — highest priority

| Item | Path | Why it matters |
|---|---|---|
| `logo.svg` | `public/brand/logo.svg` | The supplied PNG is 521 KB at 2084×754. Vector would be sharper and far lighter. |
| White / mono logo | `public/brand/logo-mono-light.svg` | Optional now. The page is white and green throughout, so the supplied near-black logo sits correctly everywhere. A light variant would only be needed if a dark surface is ever introduced. |

Confirm the brand green. Sampled from the supplied logo as **`#45A117`**, set in
`src/app/globals.css` as `--color-green`.

> Contrast note — both directions fail, so if the green ever changes, re-check both:
> `#45A117` as **text on white** is 3.30:1, so green text uses `--color-green-deep`
> (`#2F7510`, 5.72:1). And **white on `#45A117`** is also 3.30:1, so a brand-green
> fill takes `--color-ink` (5.40:1), deepening to `green-deep` + white on hover.

## 2. Contact details

`src/data/site.ts` → `CONTACT`

```ts
phoneE164: "918087310369",    // supplied by the client
phoneDisplay: "+91 80873 10369",
isPlaceholder: false,
```

**Done** — this drives the WhatsApp deep link, the Call button, the mobile menu and
every FIND MY CAR button.

This single number drives the WhatsApp deep link, the Call button, the mobile menu,
and every **FIND MY CAR** button on the page.

Also confirm the production domain — `SITE.url` currently assumes `https://thecarbar.in`
and feeds the canonical URL, Open Graph tags, sitemap, and JSON-LD.

## 3. Photography

No photography exists yet. `MediaFrame` renders an art-directed composition (soft
green-tinted field, sage vehicle silhouette, brand-green rim light, fine grain)
wherever an image is missing, so the page looks finished rather than broken.

To swap one in: drop the file in `public/media/` and set its path in the data file.
`null` keeps the placeholder.

| # | Filename | Size | Used by | Data file |
|---|---|---|---|---|
| 01 | `carbar-hero-vehicle.webp` | 2400×1600 | Hero (optional — the hero is currently type + the lens motif, which is deliberate) | — |
| 02 | `carbar-problem-showroom.webp` | 2000×1400 | Act I, waiting-period scene | — |
| 03 | `carbar-authorised-seller.webp` | 2000×1400 | Authorised seller / network | — |
| 04 | `carbar-customer-delivery-01.webp` | 1600×1600 | Customer stories (lead) | `src/data/stories.ts` |
| 05 | `carbar-customer-story-02.webp` | 1600×1600 | Customer stories | `src/data/stories.ts` |
| 06 | `carbar-customer-story-03.webp` | 1600×1600 | Customer stories | `src/data/stories.ts` |
| — | Vehicle photography | 1600×1200 (4:3) | Available cars | `src/data/cars.ts` |

Art direction for all of them: premium automotive campaign, realistic, India-compatible,
restrained lighting, clean composition, generous negative space, **no embedded text,
no watermarks, no third-party brand logos, no invented dealership signage.**

**Copy-paste generation prompts live in `IMAGE-PROMPTS.md`** — one block per image,
each stating its filename, exact pixel dimensions and `.webp`. Note that the brief's
original prompts specified a dark charcoal environment; those are superseded, since
the page is now white and green and dark images would read as holes in it.

If generated images are used they are illustrative only and must never be captioned
as real customers or deliveries.

## 4. Instagram reels — scraped every three days

The section now follows [@thecarbar.in](https://www.instagram.com/thecarbar.in/)
on its own. **This reverses the brief's "never scraped" rule**, at the client's
instruction, because the client holds the Instagram login and the official Meta
API needs an account-holder to authorise an app. Scraping is contrary to
Instagram's Terms of Use — see "If you want to stop scraping" below.

**How it works**

| | |
|---|---|
| Source | Apify Actor `apify/instagram-reel-scraper` (`xMc5Ga1oCONPmWJIa`) |
| Cadence | at most once every 3 days — `REELS_REVALIDATE` in `src/lib/instagram.ts` |
| Cache | Next's `unstable_cache`, which survives redeploys, so deploying often costs nothing extra |
| Page | `src/app/page.tsx` re-renders every 6 h and reads the cached scrape; it does not start a run |
| Cost | ~$0.03 a run, so ~$0.31/month against Apify's free $5 credit |

**Required environment variable**

`APIFY_TOKEN` — Apify Console → Settings → API & Integrations. Needed in
`.env.local` for local runs **and in Vercel** (Settings → Environment Variables),
because the scrape happens server-side at render.

It is read only in a Server Component, so it never reaches the browser. Without
it the section renders `FALLBACK_REELS` and logs one line — no crash, no blank.

**What is hand-maintained** — `src/data/reels.ts`

- `CAPTION_OVERRIDES` — wording that beats the real Instagram caption, per
  shortcode. Otherwise the caption's first line is used with hashtags, mentions
  and links stripped, capped at 60 characters; if nothing usable survives, the
  card shows no caption rather than an invented one.
- `FALLBACK_REELS` — the five client-supplied reels. These are what render with
  no token, on a failed scrape, and in any preview without the env var.
- `REEL_LIMIT` — how many reels to request.

**Covers.** Reel cover images are hotlinked from Instagram's CDN through
`next/image` (`next.config.ts` → `images.remotePatterns`). Those URLs are signed
and expire, so `minimumCacheTTL` is set to 31 days: once Next has optimised a
cover it serves its own copy long after the original link dies. A cover that
cannot be resolved falls through to `MediaFrame`'s composition.

**Checking a run.** `node qa/reels-probe.mjs` prints one raw item's fields and
says which key the cover-image resolver picked — run it if covers stop appearing,
since the Actor renames fields between builds.
`BASE=… node qa/reel-check.mjs` verifies every reel the page is showing still
resolves on Instagram.

**If you want to stop scraping.** Switch to the official *Instagram API with
Instagram Login*: free, no credit cap, Meta-sanctioned. It needs `@thecarbar.in`
converted to a Business/Creator account and a one-time Meta app authorisation by
whoever holds the login. Only `scrapeReels()` in `src/lib/instagram.ts` changes;
the cache, the fallback and the card stay as they are.

## 5. Testimonials — consent required

`src/data/testimonials.ts` — three entries. `name` and `vehicle` are omitted, so
each quote currently renders with its location only.

**The quote wording itself is still written copy, not a real customer statement.**
Replace it before launch.

Each real one needs: quote, customer name (as they agree to be credited), vehicle,
city, and their consent to publish. Add `name` and `vehicle` and they appear in the
attribution automatically.

## 6. Customer stories — consent required

`src/data/stories.ts` — three entries with `image: null`, so each renders the
art-directed frame. Same consent requirement: delivery photographs identify real
people.

## 7. Available cars

`src/data/cars.ts` — the seven models named in the brief, presented as a showcase
with a visible "not live inventory" caveat and a `CHECK AVAILABILITY` CTA.

If real availability data is ever connected, replace the array. Keep
`AVAILABILITY_LABEL` wording non-committal — the page must never imply guaranteed stock.

## 8. Analytics

`src/lib/analytics.ts` pushes to `window.dataLayer` when a provider is present and
no-ops otherwise. No provider is wired and no values are invented.

Events ready to receive: `hero_cta_click`, `nav_cta_click`, `whatsapp_click`,
`call_click`, `car_enquiry_click` (carries model), `reel_click`,
`testimonial_interaction`, `final_cta_click`.

Add the GTM/GA snippet to `src/app/layout.tsx` when the account exists.

## 9. Open question I could not resolve

The Instagram profile could not be reviewed during this build. `WebFetch` and
`WebSearch` fail on this machine because of stale **machine-level** environment
variables left over from a Vertex AI setup:

```
ANTHROPIC_DEFAULT_HAIKU_MODEL = claude-haiku-4-5@20251001
ANTHROPIC_VERTEX_PROJECT_ID   = gen-lang-client-0972341247
ANTHROPIC_MODEL               = claude-sonnet-4-6
```

Both tools summarise through the "fast" model, which is pinned to a Vertex model id
while the session authenticates against an Anthropic account — so they fail regardless
of login or credits. To clear, in an **Administrator** PowerShell, then restart:

```powershell
[Environment]::SetEnvironmentVariable('ANTHROPIC_DEFAULT_HAIKU_MODEL', $null, 'Machine')
[Environment]::SetEnvironmentVariable('ANTHROPIC_MODEL',                $null, 'Machine')
[Environment]::SetEnvironmentVariable('ANTHROPIC_VERTEX_PROJECT_ID',    $null, 'Machine')
```

If `@thecarbar.in` carries brand cues worth matching — a typeface, a secondary
colour, a photographic treatment — either fix the above and ask for a re-check, or
drop screenshots into `public/brand/reference/`.

## 10. Before launch — checklist

- [x] Real phone number in `site.ts` — `+91 80873 10369`
- [ ] Production domain in `SITE.url`
- [ ] `logo.svg` (vector replacement for the 521 KB PNG)
- [ ] Real photography replacing every `null` image
- [x] Real reels — scraped from @thecarbar.in (needs `APIFY_TOKEN` set in Vercel)
- [ ] Real consented testimonial wording (current copy is written, not quoted)
- [ ] Consented customer story photography
- [ ] Analytics provider connected
- [ ] Privacy policy and terms pages (footer links are placeholders)
- [ ] Point `FIND_MY_CAR_HREF` at `/find-my-car` once that page exists
