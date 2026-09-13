@AGENTS.md

# THE CAR-BAR — Project Rules

Premium homepage for THE CAR-BAR, a car-arrangement service. One page only.

## 1. The business model — the rule that outranks all others

```
BUYER  →  THE CAR-BAR  →  AUTHORISED SELLER
```

THE CAR-BAR **receives a requirement, checks its authorised-seller network, and coordinates the connection.** It is **not** the seller. The purchase happens directly with the authorised seller. Availability is always subject to confirmation.

Never make the site look like a dealership, a marketplace, an e-commerce store, or a checkout platform. No cart, no prices-as-offers, no "Buy now".

**Required language:** subject to availability · potential match · available option · authorised seller · check availability · coordinate · explore possibilities

**Banned language:** guaranteed delivery · guaranteed stock · always available · instant availability · guaranteed savings · lowest price

## 2. No invented facts

Never fabricate customer counts, dealer counts, inventory counts, years in business, awards, review scores, testimonials, delivery statistics, partnerships, or "live" availability numbers.

When real content is unavailable, add a clearly-marked placeholder to the **data layer** (`src/data/*.ts`) with `isDemo: true`, and surface it in the UI via `<DemoNote>`. Never present generated content as genuine.

## 3. Brand

- **The logo is never altered** — not its colours, proportions, type, or spacing. It is dark artwork (`#060809`) on transparency, which the all-light page suits perfectly.
- **The page is white and green. There is no dark theme.** No dark section backgrounds, anywhere. Deep tones carry a green bias (`--color-ink` `#0E1B09`) so even the "black" belongs to the brand.
- Green is used **boldly** — CTAs, marks, washes, numerals, network paths, active states. The client's direction is "focus more on green".
- Green text on light must be `--color-green-deep` (`#2F7510`, 5.72:1). Brand `--color-green` (`#45A117`) on white is 3.30:1 and **fails AA for text** — it is a fill/mark colour only, or large display type.
- **On a brand-green fill, text is `--color-ink`** (5.40:1). White on `#45A117` is only **3.30:1 and fails AA** — white is correct only on the deeper `--color-green-deep` (5.72:1).

## 4. Design

Premium, editorial, restrained, automotive, original. The page should feel expensive because of composition, typography, spacing, hierarchy, and restraint.

**Banned:** generic SaaS layouts, dealership red/yellow, glassmorphism, gradient blobs, floating-card soup, meaningless counters, fake trust badges, excessive rounded corners, decorative 3D.

Structure: **an all-light page with green as the protagonist.** Alternating white and green-tinted bands give rhythm; hairlines, washes and solid green marks carry the brand.

The navigation is a **floating glass pill**, centred, that never hides on scroll direction — only its ground changes (clear at the top, frosted past it), with hysteresis so it cannot flicker at the boundary. On mobile it opens a full-screen panel that sweeps down with staggered links.

## 5. Motion

**Motion must explain the business.** Before adding any animation, ask: *what does this movement tell the visitor about THE CAR-BAR?* If nothing — delete it.

The signature device is **the lens**, taken from the logo's magnifying glass: it searches one showroom, finds a wait, pulls back, sweeps the network, locks onto a match, and contracts into FIND MY CAR.

Motion hierarchy — do not animate everything:
1. Hero + the two narrative acts
2. How It Works
3. Vehicle gallery
4. Reels / testimonials
5. Micro-interactions

**Banned:** bounce/elastic, random fades, perpetual particles, spinning objects, scroll hijacking, parallax for its own sake, huge moving type with no purpose.

### GSAP rules (from the official GSAP skills)

- `useGSAP()` from `@gsap/react`, always with `scope`. Never create animations during render.
- Register plugins **once**, in `src/lib/gsap.ts`. Nowhere else.
- ScrollTrigger goes on **timelines or top-level tweens only** — never on a child tween of a timeline.
- Three pins share this page. `refreshPriority` must **descend** down the page (Act I `3`, Act II `2`, How It Works `1`): ScrollTrigger sorts by `refreshPriority * -1e6`, so a **higher** number refreshes **first**. Inverted, every later pin measures without the earlier spacers and starts thousands of pixels early — it silently breaks all three sections.
- `gsap.matchMedia()` for breakpoints and reduced motion. Never nest `gsap.context()` inside it.
- `containerAnimation` tweens must use `ease: "none"`.
- Animate **transform and opacity** only. `will-change` only on elements that actually animate.
- `ScrollTrigger.refresh()` after fonts/images settle — not on every resize.
- **Pin lengths live in `PIN` in `src/lib/gsap.ts`, never hard-coded in components.** A scrubbed pin costs the visitor real scrolling; the page's pace is tuned there.
- No `markers: true` in committed code; use the `DEBUG_MOTION` flag in `src/lib/gsap.ts`.

### Responsive & reduced motion

- **Below 1024px, pinning is disabled entirely** — mobile pinning fights the resizing address bar. The acts become stacked scroll-reveals. The story survives; the jank does not.
- `prefers-reduced-motion`: every state renders at its final legible position. No scrub, no lens sweep, no counters. It must still look **finished**, not stripped.
- Never scale the desktop layout down — mobile gets its own intent.

### No-JS safety

All narrative copy is real DOM text rendered on the server. Apply initial hidden states with `gsap.set()` inside `useGSAP` — **never** with CSS `opacity: 0` defaults. If JS fails, the page must still read as a complete document.

## 6. Technical

- TypeScript throughout. No `any`.
- Server Components by default; `"use client"` only where interaction or animation genuinely requires it.
- Content lives in `src/data/*.ts`, never hardcoded in components.
- `next/image` for all raster images, with explicit dimensions and correct `sizes`.
- Semantic HTML, one `<h1>`, correct heading order, real landmarks, visible focus, 44px touch targets.
- Every interactive element is keyboard reachable and labelled.
- Analytics goes through `track()` in `src/lib/analytics.ts`. Never fabricate analytics values.

## 7. Code style

- Short, meaningful comments only — explain **why**, never restate the code.
- No comment spam, no TODO litter, no decorative banners.
- No monolithic files; no speculative abstractions either.
- Prefer clarity over cleverness.
