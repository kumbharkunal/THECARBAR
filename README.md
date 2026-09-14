# THE CAR-BAR — Homepage

Premium homepage for THE CAR-BAR, a car-arrangement service that connects a buyer's
requirement with authorised sellers across its network.

```
BUYER  →  THE CAR-BAR  →  AUTHORISED SELLER
```

THE CAR-BAR is **not** the seller. The purchase completes directly with the
authorised seller, and availability is always subject to confirmation. Every design
and copy decision on the page serves that distinction.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
npx eslint src   # lint
npx tsc --noEmit # typecheck
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP 3.15 + ScrollTrigger · lucide-react.

No Three.js: the narrative is a node graph — lines, nodes and labels — which SVG
renders more crisply, more accessibly and at a fraction of the weight.

## The idea

The client's logo is a **magnifying glass with a car inside it**. The brand already
says "we search for your car", so the lens became the page's single signature device:

| Section | What the lens does |
|---|---|
| Hero | Cars pass through the glass — you look *through* the lens at what we search for |
| Act I | Closes in on one local showroom, finds a 4-month wait, pulls back |
| Act II | Sweeps the authorised-seller network, igniting nodes as it passes, then locks onto a match |
| Final CTA | Contracts onto **FIND MY CAR**, closing the loop the hero opened |

It is implemented as one SVG `<mask>` circle over two layers of the same geometry —
a dormant grey layer and a green lit layer. Moving a single circle is what makes the
search read as a search, and it costs one animated transform.

## Structure

```
src/
├─ app/            layout (fonts, metadata, JSON-LD) · page · globals.css
│                  opengraph-image · icon · robots · sitemap
├─ components/
│  ├─ layout/      Header · Footer · StickyActions
│  ├─ hero/        Hero
│  ├─ narrative/   ActOne · ActTwo · NetworkGraph · LensMark · RequirementCard
│  ├─ process/     HowItWorks
│  ├─ why · cars · reels · social · trust · cta
│  └─ ui/          Button · SectionHeading · Reveal · MediaFrame · SocialIcon · icons
├─ lib/            gsap.ts (single registerPlugin site) · network.ts · analytics.ts
└─ data/           site · navigation · cars · reels · testimonials · stories
```

Content lives in `src/data/*.ts`, never in components, so a CMS or live inventory
later swaps the data layer alone.

## Design system

**White and green only — there is no dark theme.** Alternating white and
green-tinted bands give the page rhythm; hairlines, washes and solid green marks
carry the brand. Even the deepest tone (`--color-ink` `#0E1B09`) carries a green
bias, so the "black" belongs to the brand rather than fighting it.

Tokens live in `src/app/globals.css`. Brand green `#45A117` was sampled from the
supplied logo. Two contrast facts drive the whole palette:

- `#45A117` as **text on white is 3.30:1 and fails AA** → green text uses
  `--color-green-deep` (`#2F7510`, 5.72:1). Brand green is a fill/mark colour.
- **White on `#45A117` is also 3.30:1 and fails.** A brand-green fill therefore
  takes `--color-ink` (5.40:1), deepening to `green-deep` + white on hover (5.72:1).

Type: **Bricolage Grotesque** (display) · **Instrument Sans** (body) ·
**Geist Mono** (technical labels). The scrollbar is themed green over a tinted track.

Display leading opens up below `md`: tight `0.96` flatters a one-line desktop
headline, but the same heading wraps to three or four lines on a phone where the
lines then nearly collide. Mono labels have a 12px floor on mobile for the same reason.

### Navigation

A **floating glass pill**, centred, modelled on the reference the client supplied.
It never hides on scroll direction — direction-flip navs flicker and there is
nothing to gain. Only its ground changes: clear at the top of the page, frosted past
it, with two thresholds (`GROUND_ON` / `GROUND_OFF`) giving hysteresis so it cannot
oscillate at the boundary. On mobile it opens a full-screen panel that sweeps down
by clip-path with the links wiping up under it in sequence.

## Motion

Three pinned, scrubbed sections on desktop. Rules enforced throughout:

- `useGSAP()` with `scope` everywhere — tweens and ScrollTriggers revert on unmount
- Plugins registered exactly once, in `src/lib/gsap.ts`
- ScrollTrigger on timelines only, never on a child tween
- **`refreshPriority` descending down the page** (Act I `3`, Act II `2`, How It Works `1`). GSAP sorts by `refreshPriority * -1e6`, so a *higher* number refreshes *first*. Get this backwards and every later pin measures without the earlier spacers and starts thousands of pixels early — it silently breaks all three sections.
- `containerAnimation` tween uses `ease: "none"`
- Transform and opacity only

**Pace.** Pin lengths live in `PIN` in `src/lib/gsap.ts` — never hard-coded in
components. Scrubbed pins cost the visitor real scrolling, so the page's tempo is
tuned in one place. Just as important is `scrub`, which is a **lag in seconds**: at
`0.7` the animation is still catching up long after you stop scrolling, which is most
of what reads as "slow". The acts run at `0.3`.

**Below 1024px, pinning is disabled entirely.** Mobile pinning fights the resizing
address bar; the acts become stacked scroll-reveals instead. The story survives, the
jank does not. There is no sticky bottom bar — the hero CTA and the nav pill carry
conversion on mobile.

**Reduced motion** renders every state at its final legible position — no scrub, no
sweep, no counters — and still looks finished. The page collapses from 12,690px to
10,222px of scroll.

**No-JS safety:** all narrative copy is server-rendered text, and hidden states are
applied with `gsap.set()` inside `useGSAP` — never CSS `opacity: 0`. With JavaScript
off the page still delivers its full argument (42 headings, ~7,700 characters).

## Content integrity

Nothing is invented — no customer counts, dealer counts, inventory counts, years,
awards, ratings, or "live" availability.

Content that is not yet supplied is simply absent rather than stood in for:
attribution fields are optional, so a quote renders its location until a real,
consented name exists. Available cars are introduced as *"not listings"*, and
every CTA says *check availability*, never *buy now*.

See **ASSETS.md** for everything the client still needs to supply.

## QA

Scripts in `qa/` run against a production build (`npm run start -- -p 3111`):

```bash
node qa/shoot.mjs     # 7 viewports × 12 scroll depths; console errors + h-overflow
node qa/a11y.mjs      # reduced-motion and JS-disabled passes
node qa/audit.mjs     # heading order, target size, names, real Tab traversal
node qa/contrast.mjs  # WCAG AA from sampled rendered pixels
node qa/weight.mjs    # page weight and paint timing
node qa/measure.mjs   # element geometry through the pinned sections
node qa/probe.mjs     # document layout and pin-spacer map
```

Contrast is measured from the actual framebuffer rather than from CSS — Tailwind v4
emits `oklab()`, backgrounds are translucent over other layers, and captions sit on
gradients over images, so a CSS-derived figure is not trustworthy here.

Current state: no console or page errors; no horizontal overflow at 1440 / 1280 /
1024 / 768 / 430 / 390 / 360; one `h1` and no heading-order skips; 84/84 sampled text
runs pass WCAG AA; all 24 keyboard-reachable controls have a brand-green focus ring;
all targets ≥ 32px; zero images without alt.
