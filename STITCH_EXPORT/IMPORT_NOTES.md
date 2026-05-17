# Import Notes — Stitch Export, 2026-05-17

Two HTML files exported from Stitch project "Cinematic Strategy Portfolio" (ID `6667347686495190881`):

- `home.html` — desktop home page
- `work-streets-of-caracas.html` — case study detail page for "The Streets of Caracas"

Reflow M3 reads these as the visual baseline. Below: what's good, what's broken, what to fix during adaptation.

---

## What's solid — adopt as-is

### Design system
The Tailwind config in both files uses our **exact** PLAN.md tokens — `#0A0908` background, `#c99a5b` primary accent, `#14110F` elevated surface, `#2A2521` hairlines, ivory `#e6e1df` body, plus the full type ramp (`display-xl` 80px Literata 300, `body-lg` 20px Geist, `metadata` 12px Geist Mono with +0.1em tracking). Extract these tokens directly into `src/styles/global.css` `@theme` block for Astro/Tailwind 4.

### Particle field (in `home.html`)
The vanilla canvas implementation at the bottom of `home.html` is **excellent** and matches PLAN.md §7 almost exactly:
- 140 particles, size 0.5–2.0 px, color `rgba(245, 241, 234, 0.4)`
- Cursor repel at radius 180 px, color shift to `#C99A5B` within 120 px
- Brownian drift via per-particle `vx`/`vy` at amplitude 0.2
- Boundary bounce on `baseX`/`baseY`
- Return-to-home spring at `dx/20` per frame
- Respects `prefers-reduced-motion: reduce` (skips entire init)
- `requestAnimationFrame` loop, `pointer-events: none` on canvas, `mouseout` clears cursor

Port verbatim to `src/components/ParticleField.client.ts` (TypeScript types, no logic changes). PLAN.md §7 tuning notes still apply if it needs refinement. **Add what Stitch left out**: touch-impulse path for mobile, density tiers per breakpoint (140 desktop / 90 tablet / 50 mobile), and the perf-budget degradation ladder.

### Motion patterns
- Hero word-by-word mask reveal (`hero-word.reveal` with 100/300/500 ms stagger) — keep
- Hero fade-in for tagline + scroll cue with `transition-delay` 800/1200 ms — keep
- IntersectionObserver scroll-reveal for `.scroll-reveal-mask` and `.scroll-reveal-fade` (threshold 0.15) — keep, but port to Motion One for tree-shaking and bundle savings
- Sticky nav scroll trigger (adds `.scrolled` after hero height) — keep
- Card hover patterns (`work-card-image` zoom, `work-card-title::after` accent underline grow, `work-card-summary` letter-spacing) — keep

### Layout structure
- Home: nav + hero + about + selected work + footer
- Case study: nav + hero cover + project meta strip + intro + gallery + pull quote + outro + more work + footer

Section composition and spacing rhythm match PLAN.md §4. Adopt as Astro component structure.

---

## What's broken — fix during M3 port

### 1. Wrong branding throughout `work-streets-of-caracas.html`
The case study file is branded **"ELARA STRATEGY"** instead of Javi's name. Stitch slipped in a generic template brand. Replace every instance:

- `<title>The Streets of Caracas - ELARA STRATEGY</title>` → `The Streets of Caracas — Javier Lanz`
- Nav left brand `ELARA STRATEGY` → "Javier Lanz" (same as home)
- Footer left brand `ELARA STRATEGY` → "Javier Lanz"
- Footer credit `© 2024 ELARA STRATEGY. ALL RIGHTS RESERVED.` → `© 2026 Javier Lanz Bethencourt · Caracas, Venezuela`
- Footer links `INSTITUTIONAL` / `HOSTED BY VERCEL` / `ENGLISH (US)` → drop entirely; use home's footer pattern instead (Astro / GitHub / ES per COPY_REGISTER.md §10)

### 2. Wrong nav structure on case study
The case study has a different nav (`Work / Ethos / Contact`) than the home (`About / Work / Capabilities / Experience / Education / Contact`). Unify on the home pattern. Use the same `<Nav.astro>` component across all routes.

### 3. Placeholder "MORE WORK" cards
The bottom of the case study shows `Neon Nights / Concrete Jungle / Silent Echoes` with placeholder images. Replace with the real three siblings per COPY_REGISTER.md §5:
- Nolan Cinematic Universe (2024 · ESSAY)
- Launching Suzuki in Venezuela (2026 · STRATEGY)
- Short Films & Music Videos (2024–25 · DIRECTION & EDIT)

### 4. Home is missing 4 sections
Only About + Selected Work present in `home.html`. PLAN.md §4 requires **Capabilities · Experience · Education · Contact** after Work. Build these as Astro components in M7 (Remaining home sections), using COPY_REGISTER.md §6–§9 verbatim. Match the existing visual rhythm (eyebrow → headline → body), and use the same `scroll-reveal-mask` / `scroll-reveal-fade` motion classes that Stitch defined.

### 5. Selected Work only has 2 cards
Home shows just Caracas Photo Essay + Nolan. Add the other two (EGCars Suzuki Launch, Short Films) using the same card markup. COPY_REGISTER.md §5 has the title + tag + summary for all four.

### 6. Wrong about-section copy
Stitch wrote generic AI copy ("I believe that every piece of content should be treated as a scene in a larger narrative...") that doesn't match COPY_REGISTER.md §4. Replace with the two real paragraphs from the register.

### 7. About headline placement quirk
Stitch put `text-center md:text-left` on the About container. PLAN.md doesn't specify either way — use `md:text-left` only (drop `text-center` mobile alignment unless you confirm it reads better).

### 8. Footer copyright year
`© 2024 Javier Lanz Bethencourt` in home footer. Should be `© 2026 Javier Lanz Bethencourt · Caracas, Venezuela` per COPY_REGISTER.md §10.

### 9. Footer links on home
Home footer has placeholder `Astro / GitHub / ES` links. The first two have `href="#"` (broken). Per COPY_REGISTER.md §10:
- "Astro" link → drop OR point to https://astro.build (only if keeping tech credit, otherwise drop)
- "GitHub" link → point to https://github.com/javielanz
- "ES" → make functional language toggle (writes `localStorage.lang`, navigates to `/es/...`)

### 10. Placeholder `srcdoc` in case study hero
The case study hero contains:
```html
<iframe ... srcdoc="{{DATA:SCREEN:SCREEN_10}}"></iframe>
```
This is Stitch's intended overlay of the particle field on top of the cover image. Two options:
- **Recommended**: drop the iframe entirely. The particle field already lives on the home hero. Putting it over a case study cover image dilutes both. Use just the cover image + gradient.
- **Alternative**: replace with a direct `<ParticleField />` component instance at lower density (~40 particles, more diffuse) and use CSS `mix-blend-mode: screen` to layer it on the image.

### 11. Missing sections in case study
PLAN.md case study spec is satisfied by Stitch's output (hero cover + meta strip + intro + gallery + pull quote + outro + more work + footer). Good as-is. Optional addition: tags row above the intro (e.g., `#photography #documentary #caracas`) — defer to post-M9 polish if even.

### 12. Image sources
All `<img src="">` point to `lh3.googleusercontent.com/aida-public/...` URLs — these are Stitch's AI-generated placeholder images. **Do not ship these to production.** Replace with Javi's actual photographs (the 4 JPEGs in `media/raw/`, processed through M5 asset pipeline into `media/web/`). The `data-alt` attributes on home cards contain Stitch's image prompts — useful as reference, drop in production.

### 13. Tailwind CDN vs Vite plugin
Both files load Tailwind via `<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>` — that's the CDN/JIT version, fine for prototyping, **wrong for production**. Astro uses `@tailwindcss/vite` (Tailwind 4). Migrate the inline `tailwind.config` extends into `src/styles/global.css` `@theme` block. Drop the CDN script entirely.

### 14. Google Fonts CDN vs self-host
Both files load fonts via `<link href="https://fonts.googleapis.com/css2?...">`. Per PLAN.md §6, self-host via `astro-font` to avoid third-party requests, CLS, and a Google domain in the privacy posture. Migrate during M3.

### 15. Material Symbols
Case study uses `<span class="material-symbols-outlined">menu</span>` for the mobile menu trigger. Material Symbols is a 200+ KB font load — overkill for one icon. Replace with an inline SVG or Lucide icon (~1 KB).

### 16. Container queries / forms plugins
The Tailwind CDN script loads `?plugins=forms,container-queries`. Neither is used in either export. Don't install these as Astro/Tailwind plugins — drop.

---

## Mobile coverage gap

No mobile variant of the case study was delivered in this export (Stitch's `generate_variants` call timed out earlier — see AUDIT.md #15). The case study has SOME responsive logic via `md:` Tailwind prefixes, so reflow can make it work mobile-first during M8. If after M8 the mobile case study feels weak, we can re-run the Stitch variant generation from a future session.

---

## Suggested M3 commit boundary

Per PLAN.md §10 M3:

1. **Commit A** — `chore: import stitch export 2026-05-17` (already done — this commit). Raw STITCH_EXPORT/ files untouched.
2. **Commit B** — `feat(m3): scaffold Astro components from stitch export` — porting home.html into `src/components/Hero.astro`, `About.astro`, `Nav.astro`, `WorkCard.astro`, `Footer.astro`, etc. Hardcoded EN copy, no i18n wiring yet.
3. **Commit C** — `feat(m3): extract design tokens from stitch into @theme` — `src/styles/global.css` with full @theme block. Drop CDN scripts. Wire `astro-font` for self-host.
4. **Commit D** — `feat(m3): port particle field to ParticleField.client.ts` — TypeScript port of home.html's particle JS into an Astro client component.

Stops here. M4 (Content model) and M5 (Asset pipeline) follow.
