# Image prompts — copy one block, paste into ChatGPT

Every prompt below is self-contained: it states the **filename**, the **exact pixel
dimensions**, and **.webp**, so you can copy a single block and paste it straight in.

### Two honest notes before you start

**1. ChatGPT cannot set your download filename.** The prompt tells it the name and
asks it to repeat the name back, but your browser will still save it as something
generic. Rename it on save to the filename shown in the block — the code looks for
that exact name.

**2. The art direction changed.** The original brief asked for a *deep charcoal /
near-black* environment. The site is now white and green, so dark images would sit
on the page like holes. Every prompt below has been rewritten for a **bright,
airy, light-ground** treatment that matches the live design.

### Where the files go

```
public/media/cars/      car photography
public/media/stories/   customer stories
public/media/reels/     reel thumbnails
```

Then set the path in the matching data file. `null` keeps the placeholder.

---

# 1 · Available cars (7 images)

**Used by** `src/components/cars/AvailableCars.tsx` · **data** `src/data/cars.ts`
**Dimensions** 1600 × 1200 (4:3) · **Format** `.webp`

After generating, set each car's `image` field:

```ts
{ slug: "toyota-fortuner", ..., image: "/media/cars/carbar-fortuner.webp" }
```

These are fine to generate — the section is explicitly labelled *"Showcase
selection, not live inventory"* and carries a visible caveat.

### 1.1 Toyota Fortuner

```
Create a premium automotive product photograph of a black Toyota Fortuner-style full-size SUV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market SUV proportions. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-fortuner.webp — please state this filename in your reply.
```

### 1.2 Toyota Innova Hycross

```
Create a premium automotive product photograph of a platinum-white Toyota Innova Hycross-style premium MPV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market MPV proportions. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-innova-hycross.webp — please state this filename in your reply.
```

### 1.3 Toyota Innova Crysta

```
Create a premium automotive product photograph of a silver-metallic Toyota Innova Crysta-style MPV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market MPV proportions. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-innova-crysta.webp — please state this filename in your reply.
```

### 1.4 Mahindra Thar Roxx

```
Create a premium automotive product photograph of a deep-red five-door Mahindra Thar Roxx-style rugged SUV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market SUV proportions, boxy off-road stance. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-thar-roxx.webp — please state this filename in your reply.
```

### 1.5 Mahindra Scorpio N

```
Create a premium automotive product photograph of a black Mahindra Scorpio N-style large SUV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market SUV proportions, commanding upright stance. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-scorpio-n.webp — please state this filename in your reply.
```

### 1.6 Mahindra XUV 7XO

```
Create a premium automotive product photograph of an everest-white Mahindra XUV 7XO-style seven-seat SUV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market SUV proportions. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-xuv-7xo.webp — please state this filename in your reply.
```

### 1.7 Mahindra XUV 3XO

```
Create a premium automotive product photograph of a citrine-yellow Mahindra XUV 3XO-style compact SUV, three-quarter front angle, in a bright modern showroom with white walls, pale polished concrete floor and abundant soft daylight. Clean high-key lighting, crisp reflections on the paintwork, gentle contact shadow beneath the vehicle, airy and premium. Light neutral background with a subtle fresh-green environmental accent. Realistic Indian-market compact SUV proportions. No text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no people. Photorealistic commercial automotive photography, generous clean negative space around the vehicle. Landscape 4:3 composition. Output exactly 1600 x 1200 pixels, WebP format. Filename: carbar-xuv-3xo.webp — please state this filename in your reply.
```

---

# 2 · Customer stories (3 images)

**Used by** `src/components/social/CustomerStories.tsx` · **data** `src/data/stories.ts`

> **Read this before generating.** These sit under the heading *"Requirements that
> found an answer"* — they read as real customers. A generated person presented as
> a real customer is a fabricated claim, which `CLAUDE.md` §2 forbids.
>
> So the prompts below deliberately produce **vehicle-and-place** shots with **no
> identifiable faces**. Keep `isDemo: true` in the data file while these are in use —
> the visible "placeholder imagery" note stays until you swap in real, consented
> delivery photographs.

### 2.1 Lead story — 1600 × 1000 (16:10)

Centre the vehicle: this crops to 4:3 on mobile.

```
Create a bright premium automotive lifestyle photograph in an Indian city: a newly delivered modern SUV parked on a clean contemporary residential driveway, three-quarter rear angle, soft morning daylight, pale architecture with white and light stone surfaces, fresh greenery in the background. Airy high-key treatment, realistic reflections, gentle natural shadows, calm and premium. No people visible, no identifiable faces, no text, no watermarks, no visible manufacturer badges or logos, no dealership signage, no number plate text. Photorealistic editorial automotive photography with the vehicle centred and generous clean space around it. Landscape 16:10 composition. Output exactly 1600 x 1000 pixels, WebP format. Filename: carbar-story-01.webp — please state this filename in your reply.
```

### 2.2 Second story — 1200 × 1200 (square)

```
Create a bright premium automotive detail photograph: a close three-quarter view of a newly delivered modern SUV's front corner, clean paintwork and headlamp, set against a pale contemporary wall in soft natural daylight with a hint of fresh green foliage. Airy high-key treatment, crisp realistic reflections, shallow depth of field, calm and premium. No people, no identifiable faces, no text, no watermarks, no visible manufacturer badges or logos, no number plate text. Photorealistic editorial automotive photography. Square 1:1 composition. Output exactly 1200 x 1200 pixels, WebP format. Filename: carbar-story-02.webp — please state this filename in your reply.
```

### 2.3 Third story — 1200 × 1200 (square)

```
Create a bright premium automotive photograph: a set of car keys and a closed document folder resting on a pale clean surface beside a softly blurred modern SUV in the background, warm natural daylight, light neutral palette with a subtle fresh-green accent. Airy high-key treatment, shallow depth of field, calm and premium, suggesting a completed handover. No people, no identifiable faces, no text, no readable documents, no watermarks, no visible manufacturer badges or logos. Photorealistic editorial photography. Square 1:1 composition. Output exactly 1200 x 1200 pixels, WebP format. Filename: carbar-story-03.webp — please state this filename in your reply.
```

---

# 3 · Instagram reels (5 thumbnails) — do NOT generate these

**Used by** `src/components/reels/InstagramReels.tsx` · **data** `src/data/reels.ts`
**Dimensions** 1080 × 1920 (9:16) · **Format** `.webp`

The section heading is *"See THE CAR-BAR in action"* and each card links to Instagram.
A generated thumbnail there would misrepresent a real post, so these must be **actual
frames from your own reels** at [@thecarbar.in](https://www.instagram.com/thecarbar.in/).

For each of the five: take a clean frame, export at 1080 × 1920 `.webp`, then fill in:

```ts
{
  id: "reel-1",
  url: "https://www.instagram.com/reel/YOUR_REEL_ID/",
  thumbnail: "/media/reels/carbar-reel-01.webp",
  caption: "Delivery day",
  isPlaceholder: false,   // <- the placeholder notice disappears on its own
}
```

Filenames the code expects: `carbar-reel-01.webp` … `carbar-reel-05.webp`

---

# 4 · Summary table

| # | Filename | Dimensions | Ratio | Data file | Generate? |
|---|---|---|---|---|---|
| 1 | `carbar-fortuner.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 2 | `carbar-innova-hycross.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 3 | `carbar-innova-crysta.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 4 | `carbar-thar-roxx.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 5 | `carbar-scorpio-n.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 6 | `carbar-xuv-7xo.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 7 | `carbar-xuv-3xo.webp` | 1600 × 1200 | 4:3 | `cars.ts` | Yes |
| 8 | `carbar-story-01.webp` | 1600 × 1000 | 16:10 | `stories.ts` | Yes — no faces |
| 9 | `carbar-story-02.webp` | 1200 × 1200 | 1:1 | `stories.ts` | Yes — no faces |
| 10 | `carbar-story-03.webp` | 1200 × 1200 | 1:1 | `stories.ts` | Yes — no faces |
| 11–15 | `carbar-reel-01…05.webp` | 1080 × 1920 | 9:16 | `reels.ts` | **No — use real reels** |

If ChatGPT returns a PNG rather than WebP, convert it — [squoosh.app](https://squoosh.app)
does it in the browser. Keep each car image under ~250 KB; `next/image` resizes and
re-encodes from there.
