# javiport — Execution Plan (v1)

> Source of truth for the build. Any execution agent (e.g. reflow swarm) reads this top to bottom.
> Owner: Javier Lanz Bethencourt (Javi). Planner: Santiago Lanz. Execution: reflow agent swarm.

---

## 0. Mission

Build a polished, cinematic-editorial-dark personal portfolio for **Javier Lanz Bethencourt** — Content Strategist at EGCars (Suzuki Venezuela), Communication Social student at Universidad Monteávila, audiovisual creator. Bilingual (EN + ES) with browser auto-detect on first visit. Designed to feel majestic and current — not template-driven.

**Style anchors**: [antigravity.google](https://antigravity.google) (hero particle field, cinematic motion, restraint), [anthropic.com](https://anthropic.com) (editorial typography, calm pacing).

**Deploy target**: GitHub Pages project page at `https://javielanz.github.io/javiport`.

**Design source**: produced in Google Stitch via the prompt pack in `STITCH_PROMPT.md`. The Stitch MCP is connected — future Claude sessions can call Stitch directly to iterate on components. Final exported HTML + CSS is committed under `STITCH_EXPORT/` and ported into Astro components in **M3**. The Stitch export is the visual source of truth for layout, component structure, spacing, and particle treatment; PLAN.md spec governs where Stitch's output diverges from project requirements (a11y, perf budget, i18n, etc.).

**Companion docs (read before executing)**:
- `COPY_REGISTER.md` — every visible string on the site in EN + ES. Use verbatim. Do not improvise copy.
- `STITCH_PROMPT.md` — prompts driving Stitch design generation. Read to understand the visual brief Stitch was given.
- `STITCH_EXPORT/` — the imported Stitch HTML/CSS that becomes the visual foundation in M3.
- `AUDIT.md` — append-only change log (auto-maintained; do not edit by hand outside the audit-trail skill).

---

## 1. Non-negotiable constraints

| Area | Constraint |
|---|---|
| Performance | Lighthouse ≥ 95 across Perf / A11y / Best Practices / SEO on **mobile and desktop**. LCP < 2s on 4G. Initial JS budget ≤ 50KB on `/es/` and `/en/`. |
| Accessibility | WCAG 2.1 AA. All interactive elements keyboard-reachable. Respect `prefers-reduced-motion`. Alt text on every meaningful image. |
| Responsive | Mobile-first. Layout verified at **375 / 768 / 1280 / 1920 px**. No horizontal scroll at any width. Particle density and motion scale with viewport. |
| i18n | Every page exists in EN and ES. Build fails if a translation is missing. Toggle preserves current path. |
| Hosting | Must work on GH Pages project-page (base path `/javiport/`). No server-side runtime. |
| Git | Commits use local config `javielanz / javielanz@gmail.com`. **Never** `--global`. **Never** add `Co-Authored-By` trailers. |
| Privacy | No third-party trackers in v1. Analytics deferred to v2. |

---

## 2. Source material — what we have

Located in `C:\Users\LANZ\SL\javiport` (will be reorganized in M5):

| File | Type | Use |
|---|---|---|
| `Javier_Lanz_Resume_EN.pdf` | Resume (EN) | Source of all biographical copy. Tracked. |
| `Javier_Lanz_Resume_ES.pdf` | Resume (ES) | Source of all biographical copy. Tracked. |
| `WhatsApp Image 2026-05-16 at 8.29.14 PM.jpeg` | Hero photo 1 — Caracas street | Photo Essay case study |
| `WhatsApp Image 2026-05-16 at 8.29.14 PM (1).jpeg` | Hero photo 2 — green shutter | Photo Essay case study |
| `WhatsApp Image 2026-05-16 at 8.29.14 PM (2).jpeg` | Hero photo 3 — street crossing | Photo Essay case study |
| `WhatsApp Image 2026-05-16 at 8.29.14 PM (3).jpeg` | Contact-sheet mosaic | **Held back** — only use if Photo Essay page feels thin. May be cut into detail tiles if needed. |
| `IMG_1445.MP4` (38 MB) | Video — production confirmed good | Hero loop candidate or Short Films case study. Re-encode required. |
| `IMG_5728.mov` (648 MB) | Video — production confirmed good | Short Films case study (the documentary referenced in the resume). Host on **Vimeo unlisted**, embed with custom styling. Generate ~6 MB web loop for preview. |

**Resume content summary** (full text in PDFs, mirrored in `src/content/`):

- Born/based: Caracas, Venezuela
- Contact: javielanz@gmail.com · +58 424 233 4996 · [linkedin.com/in/javierlanzb](https://www.linkedin.com/in/javierlanzb) · [instagram.com/javilanzb](https://www.instagram.com/javilanzb)
- Studying: B.A. Communication Social, Universidad Monteávila (2024–2028), GPA 17.00/20.00
- Prior: Colegio Los Arcos (Sciences, 2013–2024); senior thesis *"The Cinematic Universe of Christopher Nolan"*; Cambridge B2 English
- Current role: Content Strategist, EGCars (Suzuki importer, Venezuela), 2026–present — co-leading 3-person digital marketing initiative for Suzuki launch
- Skills: Storytelling, copywriting, social strategy, brand positioning · Claude/MCP, Midjourney, DALL-E, prompt engineering · Canva (advanced), Capcut, photo/video editing · MS Office, Google Workspace
- Languages: Spanish (native), English (B2)

---

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5** (`astro@^5`) | Static-first → Lighthouse 95+. Native i18n routing + Content Collections enforce EN/ES parity. View Transitions baked in. One-line GH Pages deploy. |
| Styling | **Tailwind CSS 4** (`tailwindcss@^4` via `@tailwindcss/vite`) | Zero-config, design tokens via `@theme`, smallest CSS bundle. |
| Motion | **Motion One** (`motion@^11`) | ~3.8 KB lib over Web Animations API. Covers everything antigravity.google does without 30 KB Framer Motion overhead. |
| Particles | **Stitch-exported implementation preferred** (if interactive + ≤ 8 KB); custom canvas fallback per §7 | Stitch's V1 particle output was approved. Adopt the exported particle code if it has real cursor reactivity and fits the JS budget; otherwise build from scratch per §7 spec. |
| Interactivity | **React islands** (`@astrojs/react`) used **only** for lang toggle persistence + lightbox/gallery | Keeps hero JS budget tight. |
| Content | **Astro Content Collections** with Zod schemas | Build-time validation catches missing translations and broken metadata. |
| Fonts | **Fraunces** (display) + **Geist** (body) + **Geist Mono** (meta) | All free, all variable, all on Google Fonts. Self-host via `astro-font` for perf. |
| Linting | `eslint` + `@astrojs/eslint-config-recommended` + `prettier` + `prettier-plugin-astro` | Standard. |
| Type-checking | `astro check` in CI | Catches schema and template type errors. |
| Node | **v22 LTS** | Matches Astro 5 baseline; pin via `.nvmrc` and `engines` in `package.json`. |

**Rejected alternatives** (do not revisit without explicit go-ahead):
- Next.js — heavier hydration, fussier base-path on GH Pages, no real win for a static portfolio.
- Vite + React from scratch — more glue code (router, i18n, MDX) vs Astro built-ins.
- Plain HTML/CSS/JS — manual i18n invites EN/ES drift.
- Framer Motion — too large for our JS budget; Motion One covers the needs.
- three.js / Pixi.js / tsParticles — overkill for 2D particle field; custom canvas is ~5 KB vs 20–200 KB.

---

## 4. Site architecture

### Routing

```
/                    → middleware redirect → /es/ or /en/ based on:
                       1. localStorage["lang"] if present
                       2. Accept-Language header
                       3. fallback /es/
/es/                 → home (single-page scroll)
/en/                 → home (single-page scroll)
/es/work/[slug]/     → case study (Spanish)
/en/work/[slug]/     → case study (English)
/404                 → custom themed 404
```

Astro i18n config:
```js
i18n: {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }
}
```

Middleware (`src/middleware.ts`) handles `/` redirect.

### Home sections (single-page scroll, in order)

1. **Hero** — name, role, kinetic type intro, **interactive particle field**, lang toggle in nav
2. **About** — short manifesto + key facts (location, focus, languages)
3. **Selected Work** — 4–5 case study cards with hover motion → click into case study route
4. **Capabilities** — skill clusters as typographic treatment (not icon grid)
5. **Experience** — EGCars + journalism, timeline-style
6. **Education** — Monteávila + Los Arcos + Cambridge, compact
7. **Contact** — email, phone, IG (`@javilanzb`), LinkedIn (`/in/javierlanzb`), footer

### Case study slugs for v1

| Slug | Title (EN) | Title (ES) | Status |
|---|---|---|---|
| `caracas-photo-essay` | The Streets of Caracas | Las Calles de Caracas | M8 (first build, anchor case study) |
| `nolan-cinematic-universe` | The Cinematic Universe of Christopher Nolan | El Universo Cinematográfico de Christopher Nolan | M9 |
| `egcars-suzuki-launch` | Launching Suzuki in Venezuela | Lanzando Suzuki en Venezuela | M9 |
| `short-films` | Short Films & Music Videos | Cortometrajes y Videoclips | M9 (uses `IMG_5728.mov` + `IMG_1445.MP4`) |

---

## 5. Content model (i18n)

### Collections

```
src/content/
├── work/
│   ├── caracas-photo-essay.en.md
│   ├── caracas-photo-essay.es.md
│   ├── nolan-cinematic-universe.en.md
│   ├── nolan-cinematic-universe.es.md
│   ├── egcars-suzuki-launch.en.md
│   ├── egcars-suzuki-launch.es.md
│   ├── short-films.en.md
│   └── short-films.es.md
├── experience/
│   ├── egcars.en.md
│   ├── egcars.es.md
│   ├── monteavila-journalism.en.md
│   └── monteavila-journalism.es.md
├── education/
│   ├── monteavila.en.md
│   ├── monteavila.es.md
│   ├── los-arcos.en.md
│   └── los-arcos.es.md
├── ui/
│   ├── strings.en.json   ← UI copy: nav, button labels, alt text, meta
│   └── strings.es.json
└── config.ts             ← Zod schemas; parity check
```

**Copy source**: `src/content/ui/strings.{en,es}.json` and all section text MUST be populated from `COPY_REGISTER.md` at repo root. The register is the canonical source — do not paraphrase, translate, or invent. If a slot is missing from the register, request it; do not improvise.

### Zod schemas (excerpt — full in `src/content/config.ts`)

```ts
const workSchema = z.object({
  title: z.string(),
  slug: z.string(),
  lang: z.enum(['en', 'es']),
  summary: z.string().max(240),
  cover: z.string(),            // path under media/web/
  coverAlt: z.string(),
  year: z.number().int(),
  role: z.string(),
  tags: z.array(z.string()),
  order: z.number().int(),      // display order on home
  feature: z.boolean().default(false),
});
```

### Parity check

Custom build-time check (`scripts/check-parity.mjs`, run in CI before `astro build`): every slug in `work/`, `experience/`, `education/` must exist in both `.en.md` and `.es.md`. Build fails otherwise.

### Lang toggle behavior

- Toggle component is a React island (small — only place interactivity is critical).
- On click: writes `localStorage["lang"] = "en" | "es"`, navigates to the same path in the other locale (`/es/work/foo` ⇄ `/en/work/foo`).
- On `/` (root), middleware reads localStorage via tiny inline script (avoids redirect flash on return visit) before falling through to Accept-Language.

---

## 6. Design system

### Color tokens (Tailwind 4 `@theme` block in `src/styles/global.css`)

```css
@theme {
  --color-bg:           #0A0908;  /* near-black, warm undertone */
  --color-bg-elev:      #14110F;  /* raised surfaces, cards */
  --color-bg-overlay:   #1F1B18;  /* modal / lightbox */
  --color-text:         #F5F1EA;  /* ivory — high contrast body */
  --color-text-muted:   #8A8074;  /* secondary copy */
  --color-text-subtle:  #5C544B;  /* metadata, captions */
  --color-line:         #2A2521;  /* hairline dividers */
  --color-accent:       #C99A5B;  /* warm amber — single accent */
  --color-accent-soft:  #6E5234;  /* hover / secondary */

  --color-particle:     rgba(245, 241, 234, 0.55);  /* particle field — ivory at 55% */
  --color-particle-hot: rgba(201, 154, 91, 0.85);   /* near-cursor highlight */
}
```

**No light mode in v1.** The cinematic identity depends on the dark canvas. Revisit only if Javi requests.

### Typography

| Role | Face | Loaded as |
|---|---|---|
| Display (hero, section heads) | **Fraunces** variable (`opsz`, `wght`, `SOFT`) | `font-display` |
| Body, UI | **Geist** variable | `font-body` (default) |
| Metadata, year labels, captions | **Geist Mono** variable | `font-mono` |

Self-host via `astro-font` to avoid third-party requests and CLS. Subset to Latin + extended Latin (Spanish accents).

Type scale (clamp-based, fluid):
```css
--text-display-xl:   clamp(4rem,   10vw, 9rem);    /* hero name */
--text-display-lg:   clamp(2.5rem, 6vw,  5rem);    /* section heads */
--text-display-md:   clamp(1.75rem, 3.5vw, 2.75rem);
--text-body-lg:      1.125rem;
--text-body:         1rem;
--text-caption:      0.8125rem;
--text-eyebrow:      0.75rem;     /* mono, uppercase, tracking-wider */
```

### Spacing & grid

- 12-col grid, 1.25rem gutter
- Section padding: `clamp(6rem, 12vw, 12rem)` vertical
- Content max-width: `min(1440px, 92vw)`
- Tight max-width for prose: `min(680px, 92vw)`

### Component primitives (in `src/components/`)

- `Layout.astro` — base shell, font preload, meta, ViewTransitions
- `Nav.astro` — sticky top nav + lang toggle island
- `Footer.astro` — contact info, social, year, lang switch
- `SectionHeader.astro` — eyebrow + display heading + optional description
- `WorkCard.astro` — case study card with hover motion
- `CaseStudyLayout.astro` — long-form case study shell
- `MediaFrame.astro` — `<picture>` + `<video>` with proper responsive sources
- `Reveal.astro` — wraps children with intersection reveal animation
- `ParticleField.client.ts` — canvas particle field (see §7)

---

## 7. Motion language

### Principles

- **Confident, slow, intentional.** No bouncy springs. No parallax on every block.
- **Motion serves the content.** If a motion doesn't earn its bytes or attention, cut it.
- **Reduced motion respected.** `prefers-reduced-motion: reduce` → fades only, no transforms, **particle field renders static dotted grid**.

### Patterns

| Pattern | Where | How |
|---|---|---|
| Hero kinetic type | Hero only | Word-by-word mask reveal, slight Y, 1200ms ease-out, staggered 60ms |
| **Particle field** | Hero background | See spec below |
| Section reveal | All sections | Heading mask-reveal + body fade + 12 px Y on `IntersectionObserver` (threshold 0.15) |
| Scroll-linked parallax | Hero, case study covers | Image translates 0 → -8% on scroll (clamped, ease) |
| View transitions | Home ↔ case study | Astro `<ViewTransitions />`; case study cover image is the shared element |
| Ambient gradient | Hero | Slow radial-gradient drift, 12s loop, CSS `@keyframes` (no JS) |
| Card hover | Selected Work cards | Image zoom 1.03 + copy tracks +0.5px + accent underline grow, 400ms ease |
| Custom cursor | Over media in case studies | "View" / "Play" label, 250ms fade-in, hidden on touch |
| First-paint | Initial load only | Name letters in over 800ms |

### Particle field spec (the signature interaction)

**Mimics antigravity.google's hero**: a soft field of dots that respond to cursor position with subtle gravitational drift, returning to their home position when the cursor leaves.

**Source preference**: If Stitch's exported particle implementation (in `STITCH_EXPORT/`) satisfies ALL of (a) responds to cursor movement, (b) fits within an 8 KB JS budget, (c) honors `prefers-reduced-motion`, then adopt it directly during M3 import. Use the tuning notes below to refine if needed. If any condition fails, build from scratch per the implementation spec below.

**Implementation** (fallback / from-scratch path): `src/components/ParticleField.client.ts` — vanilla TypeScript, no framework, mounted via `client:load` on a `<canvas>` in the hero.

**Physics**:
- Each particle has `home` (xy), `pos` (xy), `vel` (xy)
- Per frame: compute force toward home (`spring`, k=0.02), plus force from cursor (inverse-square, repel within radius 180 px, soft falloff)
- Integrate with damping (0.88)
- `requestAnimationFrame` loop; pauses when tab hidden or canvas off-screen

**Density (responsive)**:
- Viewport width ≥ 1280: ~140 particles
- 768–1279: ~90 particles
- 375–767: ~50 particles, no cursor interaction (touchstart pulse instead — particles expand from touch point briefly)

**Rendering**:
- Each particle = 1.5 px circle, color `--color-particle`
- Particles within 120 px of cursor lerp toward `--color-particle-hot` (warm amber) by distance ratio
- Optional faint connecting lines between particles within 80 px (alpha by distance); turn off below 768 px for perf

**Performance budget**: < 5 KB minified, < 2 ms per frame at 1080p (measured via `performance.now`). Capped at 60 fps; will skip frame if budget exceeded twice in a row.

**Reduced motion**: render the particles as a static dotted grid (home positions, no animation, no cursor reaction). Same visual texture, zero motion.

**Touch behavior**: `pointerdown` creates a brief outward impulse from the touch point (300 ms decay), then particles settle home. No persistent drag.

### Particle field — tuning notes & visual target

The §7 starting values produce a defensible baseline. Reaching the "antigravity feel" requires 1–2 iteration passes. Use this envelope.

**The feel to match** (verbatim reference: antigravity.google hero, 2026): cursor moves slowly across the canvas; particles part *softly* in front of it like reeds in slow water; when the cursor leaves, particles *glide* home over ~1.5 s. The sensation is mass + viscosity, not a force field. If particles snap, oscillate, or feel "elastic," you're too far from this.

**Parameter envelopes** (start at middle, adjust toward symptom):

| Param | Start | Min | Max | Symptom → adjust |
|---|---|---|---|---|
| `spring k` (return-home stiffness) | 0.02 | 0.01 | 0.05 | Slow to return → ↑ k. Oscillating after return → ↑ damping instead. |
| `damping` (per-axis velocity decay per frame) | 0.88 | 0.82 | 0.92 | Bouncy/jittery → ↑ damping. Feels dead/laggy → ↓ damping. |
| `repel radius` (px) | 180 | 100 | 240 | Cursor presence invisible → ↑ radius. Whole field reacts at once → ↓ radius. |
| `repel max force` (px/frame at d→0) | 4.0 | 2.0 | 8.0 | Particles fleeing aggressively → ↓ force. Cursor feels weightless → ↑ force. |
| `repel falloff` | inverse-square, soft floor at d=20 px | — | — | Linear falloff feels mushy; inverse-square is sharper. Don't change without A/B. |
| `ambient noise amplitude` | 0.05 | 0 | 0.15 | Field looks "dead" with no cursor → add noise. Looks anxious → remove. |
| `color lerp distance` (px) | 0 → full, 120 → none | — | — | Particles within this range warm toward `--color-particle-hot`. |
| `connecting lines max distance` (px) | 80 (desktop only) | — | — | Skip below 768 px and skip if frame budget exceeded. |
| `line alpha formula` | `(maxDist - d) / maxDist * 0.4` | — | — | Cap alpha at 0.4 — lines should hint, not draw. |

**Density tiers** (per §7 — repeat here for tuning context):
- ≥ 1280 px: ~140 particles, lines on
- 768–1279 px: ~90 particles, lines on
- 375–767 px: ~50 particles, lines off, cursor disabled (touch-impulse only)

**Performance budget**: < 2 ms per frame at 1080p on a 2020-era laptop. If `performance.now()` measures > 2 ms for two consecutive frames, the loop should:
1. Drop connecting lines first.
2. Reduce density by 25%.
3. Cap to 30 fps if still over budget.
Log the degradation once to console (`info`); don't spam.

**Failure modes & fixes**:

| Symptom | Likely cause | Fix |
|---|---|---|
| Particles oscillate after cursor leaves | Spring too stiff for damping | ↑ damping by 0.02, retry |
| Particles flee aggressively | Repel force too high or radius too small | ↓ force OR ↑ radius |
| Cursor presence invisible | Radius too small or force too low | ↑ radius first |
| Field looks dead / static when idle | Missing ambient noise | Set `noiseAmp` to 0.05 |
| Connecting lines visually noisy | Alpha cap too high or too many lines | ↓ alpha cap to 0.25, ↓ density |
| Cursor "snaps" particles | Falloff too sharp or floor too low | Raise inverse-square floor to 30 px |
| Frame drops on mid-range laptops | Density too high or lines on | Apply degradation ladder above |

**Reduced motion** (per `prefers-reduced-motion: reduce`): render `home` positions as static 1.5 px dots at base color. No `requestAnimationFrame` loop at all. Cursor and touch events ignored. Visually it should still feel like the same texture, just frozen.

**Implementation checkpoints for the agent building this**:
1. Get static field rendering at correct density per breakpoint. Commit.
2. Add spring return-to-home (no cursor yet). Verify particles drift gently in a wave if you perturb one.
3. Add cursor force. Tune to envelope above.
4. Add color lerp.
5. Add connecting lines (desktop only).
6. Add touch-impulse path.
7. Add `prefers-reduced-motion` branch.
8. Add perf-budget degradation ladder.
9. A/B against the feel target on antigravity.google before declaring done.

---

## 8. Asset pipeline

### Layout

```
media/
├── raw/        ← gitignored. Javi's originals live here. Source of truth for re-encodes.
└── web/        ← committed. Web-ready outputs. Referenced from content frontmatter.
```

### `scripts/media-build.mjs`

Local-only script (do **not** run in CI). Uses `ffmpeg` (system) + `sharp` (npm). Idempotent.

**Image pipeline** (per source JPG/PNG/HEIC in `media/raw/`):
- Output **AVIF** + **WebP** at widths `[480, 960, 1440, 2880]`
- Filenames: `media/web/<basename>-<width>w.{avif,webp}`
- Quality: AVIF 60, WebP 80
- Strip EXIF except orientation

**Video pipeline** (per source MP4/MOV in `media/raw/`):
- Output **H.264 MP4** + **AV1 WebM** at `1080p` and `720p`
- Target ≤ 8 MB for any clip ≤ 30 s (hero loops); ≥ 30 s → host on Vimeo unlisted, generate 8-second preview loop locally
- Two-pass encoding; tune for `film`
- Extract first frame as poster: `media/web/<basename>-poster.jpg`
- Filenames: `media/web/<basename>-<height>p.{mp4,webm}`

**`MediaFrame.astro`** consumes outputs:
```astro
<MediaFrame
  src="caracas-essay-01"
  alt="A woman in denim walking past colored facades in Caracas"
  widths={[480, 960, 1440]}
  sizes="(min-width: 1024px) 50vw, 100vw"
/>
```

Renders proper `<picture>` with AVIF/WebP/JPEG fallback and explicit `width`/`height` to prevent CLS.

### Specific decisions for current media

| File | Action |
|---|---|
| `WhatsApp Image ... .jpeg` (×3 hero frames) | Move to `media/raw/caracas-essay-{01,02,03}.jpg`. Process. Use in Photo Essay case study + one as Selected Work card cover. |
| `WhatsApp Image ... (3).jpeg` (mosaic) | Move to `media/raw/caracas-essay-mosaic.jpg`. **Hold from build.** Available if Photo Essay page needs a "more from this series" tile or detail strip. |
| `IMG_1445.MP4` (38 MB) | Move to `media/raw/short-films-clip-01.mp4`. Re-encode to 1080p + 720p web variants. Candidate for hero loop **or** Short Films cover. |
| `IMG_5728.mov` (648 MB) | Move to `media/raw/documentary-master.mov`. **Upload full to Vimeo unlisted** (Javi's account). Generate 8s preview loop (`documentary-preview-1080p.mp4`, target ≤ 6 MB). Embed Vimeo on Short Films case study page. |

---

## 9. Deployment

### GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run check:parity
      - run: npx astro check
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Astro config (`astro.config.mjs`)

```js
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://javielanz.github.io',
  base: '/javiport',
  trailingSlash: 'always',
  output: 'static',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwind()] },
});
```

### Repo settings

- Pages source: **GitHub Actions** (not branch). Reflow agent should leave a note in M2 if Javi/Santiago needs to flip this in the GitHub UI.
- Custom domain hook: leave commented-out `cname:` step in workflow so flipping later is one edit.

---

## 10. Milestones

Each milestone = one self-contained task with explicit deliverables and acceptance criteria. Reflow may parallelize per the suggested DAG at the end.

### M1 — Scaffold
**Deliverables**:
- `package.json` (Astro 5, Tailwind 4, Motion One, React integration, sitemap, prettier, eslint)
- `astro.config.mjs` per §9
- `tsconfig.json` (strict)
- `.nvmrc` (`22`)
- `.gitignore` (already started; ensure `node_modules/`, `dist/`, `.astro/`, `media/raw/`, `.env*`, OS junk)
- `.prettierrc`, `.eslintrc.cjs`
- `src/pages/index.astro` → redirects to `/es/` (placeholder)
- `src/pages/es/index.astro`, `src/pages/en/index.astro` (placeholders showing "scaffold OK")
- `src/middleware.ts` (Accept-Language redirect)
- `src/styles/global.css` (empty, just imports Tailwind)
- `README.md` with run instructions

**Done when**: `npm install && npm run dev` opens to a working `/es/` and `/en/` placeholder; `npm run build && npm run preview` builds clean with no errors.

### M2 — Deploy pipeline
**Deliverables**:
- `.github/workflows/deploy.yml` per §9
- Repo Settings → Pages source = GitHub Actions (document this; may require human in GitHub UI)
- `package.json` script `check:parity` (no-op stub for now)

**Done when**: first push to `main` triggers the workflow, builds clean, deploys to `https://javielanz.github.io/javiport/es/` (with `/javiport/` base path correctly applied).

### M3 — Import Stitch export & extract design tokens
**Deliverables**:
- `STITCH_EXPORT/` populated with the raw Stitch export (HTML, CSS, any JS, assets) committed as-received before adaptation begins — preserves a clean baseline for diffs
- Stitch's HTML structure ported into Astro components under `src/components/` (componentized by section: `Hero.astro`, `About.astro`, `WorkGrid.astro`, etc. — one section per file)
- `src/styles/global.css` with full Tailwind 4 `@theme` block. Extract colors, type scale, and spacing from Stitch's output; adjust §6 spec if Stitch diverged in well-justified ways and document the diff in this section's commit message
- Font self-hosting via `astro-font` (Fraunces, Geist, Geist Mono — variable, Latin + Latin-Ext subsets); swap in if Stitch used different faces
- Particle implementation: if Stitch's export satisfies §7's source-preference checks, port it into `src/components/ParticleField.client.ts`; otherwise scaffold the from-scratch spec for M7 to complete
- `src/components/Layout.astro` (base shell, meta tags, font preload, `<ViewTransitions />`)
- A throwaway `/dev/tokens.astro` page (in `src/pages/` behind `import.meta.env.DEV` guard) showing color swatches + type ramp — useful for visual QA, removed in M11

**Done when**: home page renders at `/es/` and `/en/` matching Stitch's visual output (copy still hardcoded EN, no real data wiring yet); dev tokens page renders all colors and the type scale; fonts load with `font-display: swap`; no FOUT longer than 200 ms.

**Suggested commit boundary**: two commits — first the raw `STITCH_EXPORT/` import, second the Astro componentization + token extraction. Lets reviewers diff the adaptation cleanly.

### M4 — Content model
**Deliverables**:
- `src/content/config.ts` with Zod schemas for `work`, `experience`, `education`, `ui`
- Seed EN+ES stubs for all 4 work case studies + EGCars experience + Monteávila journalism + 3 education entries
- `src/content/ui/strings.{en,es}.json` with full UI string inventory (nav, buttons, alt text patterns, meta titles/descriptions)
- `scripts/check-parity.mjs` — fails if any slug exists in one lang but not the other
- `package.json` script `check:parity` wired up

**Done when**: `npm run check:parity` passes; `astro check` passes; intentionally removing one ES file fails the check.

### M5 — Asset pipeline
**Deliverables**:
- Create `media/raw/` and `media/web/` directories
- Move current files per §8 ("Specific decisions for current media") table — including handling the large `.mov` (Vimeo upload is a manual step Santiago/Javi will need to do; mark the spot in code with `// TODO: Vimeo embed URL`)
- `scripts/media-build.mjs` per §8
- `package.json` scripts: `media:build`, `media:clean`
- `src/components/MediaFrame.astro` per §8
- Process current images and (if Vimeo upload pending) generate web variants for `IMG_1445.MP4` only

**Done when**: `npm run media:build` produces all web variants idempotently from `media/raw/`; `MediaFrame` component renders proper `<picture>` with AVIF + WebP + JPG; raw files are untracked.

### M6 — Hero + About + particle field
**Deliverables**:
- `src/components/ParticleField.client.ts` per §7 (canvas physics, density tiers, reduced-motion fallback, touch impulse)
- Hero section in `src/pages/[lang]/index.astro` (using Astro's i18n route group): name (kinetic type), eyebrow role, scroll cue, lang toggle in nav
- About section: 2–3 paragraphs (EN + ES from `src/content/ui/strings`)
- `src/components/Nav.astro` + lang toggle React island (`src/components/LangToggle.client.tsx`)
- Ambient gradient background (CSS only)

**Done when**:
- Hero renders particle field that visibly reacts to cursor on desktop and pulses on touch on mobile
- Lighthouse Perf ≥ 95 on `/es/` and `/en/` (mobile + desktop)
- Reduced-motion: static dot grid + fades only
- Hero JS bundle (incl. particle field + lang toggle) ≤ 50 KB compressed

### M7 — Remaining home sections
**Deliverables**:
- Selected Work cards (4 cards, hover motion per §7)
- Capabilities section (typographic treatment, no icon grid)
- Experience section (timeline-style)
- Education section (compact)
- Contact section + Footer
- All sections wrapped in `Reveal.astro` for scroll-in animation

**Done when**: home renders end-to-end in EN and ES with all real content from `src/content/`; all sections animate in on scroll; no horizontal scroll at any of 375/768/1280/1920 px.

### M8 — Case study template + Photo Essay
**Deliverables**:
- `src/pages/[lang]/work/[slug].astro` dynamic route
- `src/components/CaseStudyLayout.astro` (long-form shell: hero cover, intro, body, media grid, footer with prev/next)
- Photo Essay case study fully populated: 3 hero JPEGs + body copy (EN + ES) + tags + year
- View transition from home card to case study (shared element on cover image)

**Done when**: clicking the Photo Essay card on home transitions smoothly to `/es/work/caracas-photo-essay/`; case study renders fully in both languages; back navigation is smooth.

### M9 — Populate remaining case studies
**Deliverables**:
- `nolan-cinematic-universe` — text-led, large pull quotes, typographic treatment, no media required
- `egcars-suzuki-launch` — role + initiative description, social-content samples (TBD — request from Santiago/Javi during execution if not in repo)
- `short-films` — Vimeo embed for documentary + autoplay-on-hover web preview of `IMG_1445`, web encodes from M5
- All in EN + ES

**Done when**: every `/work/[slug]/` route renders in both languages with media; `astro check` clean; parity check passes.

### M10 — Motion polish, a11y, Lighthouse, ship
**Deliverables**:
- Reduced-motion paths verified across all components (particle, reveals, transitions)
- Alt text audit (every image meaningful + decorative correctly marked)
- Contrast pass (WCAG AA on every text/background pair — automated via `pa11y-ci`)
- OG / Twitter meta tags per page (using `src/content/ui/strings` for localized titles/descriptions)
- `sitemap.xml` generated correctly (per-locale)
- Remove `/dev/tokens` page
- Lighthouse audit on home + one case study, mobile + desktop
- Iterate until ≥ 95 across all four pillars
- Verify responsive matrix (375/768/1280/1920) — no layout breaks

**Done when**: Lighthouse ≥ 95 four-across on home and one case study, mobile and desktop; `pa11y-ci` clean; deploy is live and shareable.

### Parallelization DAG (for reflow)

```
M1 ─┬─ M2
    ├─ M3
    ├─ M4
    └─ M5
         │
         ▼
        M6 ──┬─ M7
             └─ M8 ── M9 ── M10
```

Peak parallelism: 4 agents (M2/M3/M4/M5 after M1).

---

## 11. Repo conventions

### Commits

- **Identity**: local config only — `javielanz / javielanz@gmail.com`. Verify with `git config --local user.email` before any commit. **Never** `--global`.
- **No `Co-Authored-By` trailers.** Plain commit messages only.
- **Format**: `<type>: <subject>` where type ∈ {`feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`}. Subject in present-tense imperative, lowercase, ≤ 72 chars.
- **Body** optional, wrap at 100. Use bullets for multiple changes.
- One milestone = one commit (preferable) or a small series with the milestone tag in the subject.

### Branching

- `main` is deploy branch — every push triggers a build.
- For multi-step milestones, use feature branches `m6-hero` etc. and squash-merge to `main`.

### File naming

- Astro components: `PascalCase.astro`
- Client islands: `PascalCase.client.{ts,tsx}` (Astro auto-detects)
- Content files: `slug.{lang}.md`
- Images in `media/web/`: `kebab-case-NNNw.{avif,webp,jpg}` where NNN = width

### Code style

- TypeScript strict mode. No `any` without comment.
- No comments explaining what the code does. Only comments for non-obvious WHY.
- No emoji in code or commits.
- Tailwind utility-first. Extract to `@apply` only when a pattern repeats 3+ times.

---

## 12. Resolved decisions

| # | Question | Decision |
|---|---|---|
| A | 648 MB MOV — Vimeo or local? | Vimeo unlisted + 6 MB local preview loop |
| B | Case studies for v1 | All 4 (Photo Essay, Nolan, EGCars, Short Films) — videos confirmed good production |
| C | Hero motion | Kinetic type + particle field + ambient gradient. No hero video (particle field is the signature). |
| D | Sound on case study videos | Muted by default, click-to-unmute |
| E | Analytics | None in v1. Plausible (~1 KB) deferred to v2. |
| F | Light mode | Skip v1 — cinematic identity depends on dark canvas |
| G | First commit | One `chore: scaffold project plan and repo setup` commit (just PLAN.md, .gitignore, resumes). M1 follows in its own commit. |
| H | Default language | Auto-detect Accept-Language; default to `es` if ambiguous |
| I | Domain | `javielanz.github.io/javiport` for v1; custom domain deferred |

---

## 13. Out of scope for v1

Explicit non-goals — do not build these unless escalated:

- Light mode
- Analytics
- Blog / writing index
- CMS (content stays in `src/content/`)
- Server-side anything
- Contact form (links to mailto + WhatsApp instead)
- Newsletter signup
- Search
- Print stylesheet
- AMP / RSS

---

## 14. Open items requiring human input during execution

| Item | Who | When |
|---|---|---|
| Repo Settings → Pages source = "GitHub Actions" | Santiago or Javi in GitHub UI | Before M2 first deploy |
| Stitch export delivered to `STITCH_EXPORT/` | Santiago after MCP iteration converges | Before M3 |
| Vimeo unlisted upload of `IMG_5728.mov` + URL | Javi (his Vimeo account) | Before M9 short-films case study |
| Additional Suzuki / EGCars campaign material if available | Santiago/Javi share into `media/raw/` | Before M9 EGCars case study |
| Final review of EN/ES copy before deploy | Santiago/Javi | Before M10 ship |

---

*End of plan. Reflow: start at M1.*
