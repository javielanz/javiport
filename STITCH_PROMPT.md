# Stitch Prompt — javiport

> Prompts engineered for Google Stitch (stitch.withgoogle.com) to generate javiport's UI/UX.
> Workflow: paste a prompt → review output → iterate → export code → adapt in Astro repo.

---

## How to use this file

1. Open Stitch and start a new project.
2. **Mode**: pick "Experimental" / creative mode if Stitch offers it — we want distinctive output, not template defaults.
3. **Platform**: Web (desktop-first with responsive variants).
4. Paste the **Master Prompt — Home** below.
5. Review. If it nails the feel, run the **Follow-up — Case Study Page** prompt.
6. Use the **Iteration Snippets** to refine specific parts without restarting.
7. Export → see **Adaptation Notes** at the bottom before pasting into the Astro repo.

**Important context for every prompt below**: the particle-field hero is described visually but Stitch will likely render it as a static dot pattern or noise overlay. That's fine — we replace it with our custom canvas implementation post-export. Stitch's job is layout, type hierarchy, color rhythm, and motion patterns.

---

## Master Prompt — Home

> Copy everything between the `---START---` and `---END---` markers and paste into Stitch.

---START---

Design a personal portfolio website for **Javier Lanz Bethencourt** — a 19-year-old Content Strategist and Communication Social student from Caracas, Venezuela. He leads content strategy for the Venezuelan launch of Suzuki at EGCars, directs short films and music videos, shoots documentary street photography, and wrote a senior thesis on Christopher Nolan's narrative architecture. Audience: international clients, recruiters, brand teams, creative agencies. The site should feel majestic and modern, never template-driven — closer to a film opening than a CV.

**Aesthetic direction**: cinematic editorial dark. Two reference sites to internalize the feel of:
- **antigravity.google** — hero treatment, cursor-reactive particle field, restrained motion, calm pacing.
- **anthropic.com** — editorial typography, generous whitespace, type used as art.

Both share: deep dark canvas, ivory display typography, a single warm accent, slow confident motion. No light mode. No bright primaries. The mood is composed and slow, like the opening shot of a film — never busy.

**Color palette** (use these exact hex values):
- Background: #0A0908 (near-black, warm undertone)
- Elevated surfaces: #14110F
- Body text (ivory): #F5F1EA
- Muted text: #8A8074
- Subtle text / captions: #5C544B
- Hairlines: #2A2521
- Single accent (warm amber): #C99A5B
- Soft accent / hover: #6E5234

**Typography**:
- Display headings: **Fraunces** (variable serif, expressive, use larger optical sizes at display weights). Sentence case, never title case. Periods at end of headlines are okay for rhythm.
- Body and UI: **Geist** (variable grotesk, modern, neutral).
- Metadata, year labels, eyebrows: **Geist Mono** in UPPERCASE with +0.1em tracking.
- Type scale: hero clamp(4rem, 10vw, 9rem); section headlines clamp(2.5rem, 6vw, 5rem); body 1rem; captions 0.8125rem.

**Layout**: single-page vertical scroll. Max content width 1440px. Section padding clamp(6rem, 12vw, 12rem) vertical. 12-column grid with 1.25rem gutters.

**Sticky nav** appears after the hero is scrolled past. Minimal: name "Javier Lanz" left, nav links right (About · Work · Capabilities · Experience · Education · Contact), language toggle "ES" on the far right. Active section underlined in amber accent.

**Sections in this order**:

**1. Hero (full viewport)**
- Eyebrow (Geist Mono, uppercase, tracked, muted): `CONTENT STRATEGIST · CARACAS, 2026`
- Massive Fraunces display name: `Javier Lanz Bethencourt` — reveal word-by-word on load.
- Tagline below in Fraunces display-md, muted ivory: `Content Strategist with a director's eye.`
- Behind the type: a soft field of ~140 small ivory dots that drift gently. Particles within ~180px of the cursor part softly and return slowly when the cursor leaves. Particles within ~120px shift toward warm amber on hover. A very slow radial-gradient (~12s loop, low opacity) drifts in the background. The mood is reeds in slow water, not a force field.
- Bottom of viewport: scroll cue "Scroll" in Geist Mono caption size with a thin downward arrow.

**2. About**
- Eyebrow: `ABOUT`
- Headline (display-lg Fraunces): `Strategy at 24 frames per second.`
- Two paragraphs of body text (Geist, 1.125rem, max-width ~680px):
  1. "I'm a Communication Social student at Universidad Monteávila and Content Strategist at EGCars, where I'm helping launch Suzuki in Venezuela. My work sits at the intersection of cinema, brand, and emerging AI tooling — I treat content strategy the way a director treats a film: every frame earns its place."
  2. "When I'm not writing campaigns, I'm directing music videos, shooting street-journalism in Caracas, or analyzing how franchises like Nolan's build loyal audiences."
- Closing line in Geist Mono, muted: `B.A. Communication Social · GPA 17.00 / 20.00 · Cambridge B2`

**3. Selected Work**
- Eyebrow: `SELECTED WORK`
- Headline: `Four pieces, one throughline.`
- Subline (muted body): `Strategy, story, image — sometimes all three at once.`
- 2-column grid on desktop (1-column on mobile) of four work cards. Each card:
  - Full-bleed cover image (16:10 aspect on desktop, 4:5 on mobile)
  - Mono tag overlaid bottom-left or above title: e.g. `2025 · PHOTOGRAPHY`
  - Title in Fraunces display-md
  - One-line summary in body text, muted
  - Hover-only CTA link: `View essay →` in accent amber
  - Hover: image zooms 1.03, accent underline grows under the title, copy tracks +0.5px
- The four cards (in order):
  1. `2025 · PHOTOGRAPHY` — **The Streets of Caracas** — "A documentary series on the city as it is, not as it's reported."
  2. `2024 · ESSAY` — **The Cinematic Universe of Christopher Nolan** — "Senior thesis on how Nolan's narrative architecture builds fan loyalty."
  3. `2026 · STRATEGY` — **Launching Suzuki in Venezuela** — "Content engine for a 3-person team standing up Suzuki's Venezuelan presence from zero."
  4. `2024–25 · DIRECTION & EDIT` — **Short Films & Music Videos** — "Self-taught direction across documentary, music video, and photographic series."

**4. Capabilities**
- Eyebrow: `CAPABILITIES`
- Headline: `Trained in story. Fluent in software.`
- Four clusters laid out as a 2x2 grid on desktop, stacked on mobile. Each cluster is **typographic, not iconographic** — no icons, no chips. Format per cluster:
  - Small mono label (uppercase, tracked, muted): e.g. `CONTENT & CREATIVE`
  - Below it, a single line of body text with skills separated by periods, set at display-md Fraunces, line-height 1.4 — so it reads like a designed paragraph:
    - **Content & Creative**: "Storytelling. Copywriting. Visual concept. Brand positioning. Editorial writing."
    - **AI Tools**: "Claude with MCP. Midjourney. DALL-E. Generative copywriting. Prompt engineering."
    - **Design & Editing**: "Canva (advanced). Capcut. Photo & video editing."
    - **Productivity**: "Microsoft Office. Google Workspace."
- Generous whitespace between clusters. The whole section should breathe.

**5. Experience**
- Eyebrow: `EXPERIENCE`
- Headline: `Where the work happens.`
- Timeline style: vertical hairline on the left in `--color-line`, small amber accent dot at each entry, content to the right.
- One entry currently:
  - Company line (Fraunces, display-md): `EGCars — Suzuki Importer, Venezuela`
  - Role + dates row (Geist body + Geist Mono): `Content Strategist · 2026 — Present`
  - Four bullets in body text (muted), each prefixed by a thin amber dash, not a bullet:
    1. "Co-leading a 3-person digital marketing initiative building a client-acquisition engine for the launch of Suzuki in Venezuela — the founding content function of an emerging agency model."
    2. "Developing content strategy across Instagram and TikTok to position the brand, generate awareness, and attract qualified leads."
    3. "Designing creative concepts and visual assets with Canva, Capcut, and AI-assisted ideation (Midjourney, DALL-E) to produce high-volume, on-brand content."
    4. "Preparing pitches and creative proposals to acquire and represent additional clients beyond the founding account."

**6. Education**
- Eyebrow: `EDUCATION`
- Headline: `What shaped the eye.`
- Two entries side-by-side on desktop (stacked on mobile), each compact:
  - **Universidad Monteávila** — Fraunces display-md
    - `B.A. Communication Social` (body) · `2024–2028` (Geist Mono, muted)
    - Meta line: `Current GPA: 17.00 / 20.00`
  - **Colegio Los Arcos** — Fraunces display-md
    - `High School Diploma, Sciences` · `2013–2024`
    - Highlight: "Senior thesis: *The Cinematic Universe of Christopher Nolan* — analysis of narrative structures and pop-culture impact."
    - Highlight: "Cambridge B2 English Certification."

**7. Contact**
- Eyebrow: `CONTACT`
- Headline: `Let's build something.`
- Body, muted, max-width ~520px: "Open to collaborations, freelance content work, and conversations about cinema, brand, and AI."
- Row of four pill buttons, outlined in `--color-line`, label in ivory, hover fills with amber and label flips to background-dark:
  - Email
  - WhatsApp
  - LinkedIn
  - Instagram
- Below buttons, small Geist Mono caption (muted): `Typically replies within 24h`

**8. Footer**
- Hairline rule above.
- Three-column on desktop, stacked on mobile:
  - Left: `© 2026 Javier Lanz Bethencourt · Caracas, Venezuela` (muted)
  - Center: subtle mono line: `Built with Astro · Hosted on GitHub Pages`
  - Right: language switch link "Español" + small back-to-top arrow

**Motion direction** (where the agent supports motion specs):
- Hero name reveals word-by-word over ~1200ms on load, mask + 12px Y, eased.
- Section content reveals on intersection: headline mask-reveals from below, body fades in with 12px upward translate.
- Card hover: image zoom 1.03, underline grow, copy tracking — all in ~400ms ease-out.
- All motion respects `prefers-reduced-motion: reduce` (fades only, no transforms).

**Voice & tone**: confident, never grandiose. First person, present tense. Cinema metaphors sparingly. No "passionate", no "innovative", no "synergy", no "elevate", no "leverage", no "unlock", no emoji anywhere on the site.

**Responsive**: mobile-first. Layouts must work cleanly at 375px, 768px, 1280px, and 1920px. No horizontal scroll at any width. Nav collapses to a hamburger below 768px.

**Export**: HTML + CSS (Tailwind preferred if offered). English only — Spanish translation handled separately downstream.

---END---

---

## Follow-up Prompt — Case Study Page

> Run after the home page output looks right. Stitch should retain context but if it resets, prefix this with a one-line recap of the aesthetic.

---START---

Now design the case study detail page for one of the home cards: **"The Streets of Caracas"** — a documentary photo essay shot by Javier Lanz Bethencourt in Caracas, 2025. Same aesthetic, color, and typography system as the home page.

**Page structure**:

1. **Persistent top nav** — same as home, with active "Work" underlined.

2. **Hero cover** (60–70vh):
   - Full-bleed cover photograph (use a placeholder of a colorful Caracas street with motorcycles in foreground)
   - Overlay text at bottom-left:
     - Eyebrow (Geist Mono, uppercase, muted-amber): `2025 · PHOTOGRAPHY · CARACAS`
     - Title in massive Fraunces display: `The Streets of Caracas`
     - One-line subtitle in Fraunces display-md, muted ivory: `A documentary series on the city as it is, not as it's reported.`

3. **Project meta strip** (just below hero, hairline above and below):
   - Three or four columns of small mono metadata: ROLE — `Photographer, Editor` · YEAR — `2025` · LOCATION — `Caracas, Venezuela` · FRAMES — `~40 selected`

4. **Intro paragraph** (centered, max-width 680px, Geist body-lg):
   - "Most photography of Caracas is reactive — protests, queues, scarcity. This series isn't. It's the city on a Tuesday morning: motorcycles parked outside half-painted shutters, neighbors crossing intersections that don't need lights, the texture of a place that lives on regardless of what's being reported about it. The subject is a single figure carrying a toolbox through her neighborhood. The frame is wide, the color is candy, the pace is slow."

5. **Image gallery** (varied layout, breaks the grid):
   - One large full-bleed image
   - Then a 2-column row of two images at different heights
   - Then another full-bleed
   - Then a 3-column grid of smaller frames
   - Captions in Geist Mono, muted, sized small
   - Lightbox on click (just indicate visually)

6. **Pull quote** (between gallery and outro, full-width band):
   - Fraunces display-md, italic, accent amber: "The city doesn't pose. You wait."
   - Below in mono caption: `— J.L.`

7. **Outro paragraph** (same width as intro):
   - "Shot over six weekends with a Fujifilm X-T4 and a 23mm lens. Edited in Capcut and Lightroom. Selected frames printed for an open studio in November 2025."

8. **Related work footer**:
   - Hairline above
   - Eyebrow: `MORE WORK`
   - Three small cards in a row showing the other three case studies (titles + tags only), each card linking onward
   - Below, a single "Back to all work →" link in amber

9. **Site footer** — same as home.

**Motion**: cover image parallax (translates 0 → -8% on scroll). Gallery images fade + 12px Y on intersection. View transition expected from home (the home card's cover image transitions into this page's hero cover).

Same color, typography, voice rules as the master prompt.

---END---

---

## Iteration Snippets

Use these as follow-up messages in the same Stitch session to refine specific parts. Don't restart — Stitch handles edits better than re-prompts.

- **"Tighten the spacing in the Capabilities section by 30% and make the cluster labels smaller. The skills line should be the dominant element."**
- **"The hero name feels too small. Push it to fill 85% of viewport width on desktop. The tagline should sit closer underneath, not separated by a blank line."**
- **"Replace the icon-style work cards with a more editorial treatment: image takes the full card top-to-bottom, tag overlaid bottom-left in amber mono, title appears below the image on the page (not over it), summary in muted body, link revealed on hover only."**
- **"The accent amber feels too saturated. Pull it back ~15% toward the neutral, but keep it warm. The goal is a single calm accent, not a brand color."**
- **"Add a particle pattern behind the hero — small ivory dots, ~140 of them, evenly scattered with slight randomness. Don't animate them in Stitch (we'll handle that). Just the static pattern, opacity ~55%."**
- **"The footer is too prominent. Make it half its current height, drop the divider weight, and align everything to a single baseline."**
- **"The Contact buttons feel too generic. Make them text links instead, large, in Fraunces display-md, separated by hairline rules. Each link gets an arrow that animates on hover."**

---

## Adaptation Notes (post-export, before merging into Astro)

When you export from Stitch and bring the code into our Astro repo:

| Stitch output | What to swap |
|---|---|
| Static dot pattern in hero | Replace with our `ParticleField.client.ts` canvas component (PLAN.md §7) |
| Inline Tailwind utility classes | Keep — our stack uses Tailwind 4. Map any custom colors to our `@theme` tokens in `src/styles/global.css`. |
| Hardcoded English copy | Replace every string with a lookup from `COPY_REGISTER.md` (EN + ES) via Astro content collections |
| `<img>` tags | Wrap in our `MediaFrame.astro` for responsive AVIF/WebP/JPG sources |
| Stitch-generated SVG icons | Drop entirely — our spec uses no icons in Capabilities, and Contact uses text/pill buttons not icons |
| Page-level routing | Restructure into Astro's i18n routes: `/[lang]/index.astro` for home, `/[lang]/work/[slug].astro` for case studies |
| Sticky nav scroll behavior | Re-implement with IntersectionObserver to drive active-section underline |
| Hover animations | Re-implement with Motion One (~3.8 KB) instead of any Stitch-provided JS — keeps the bundle budget |
| `prefers-reduced-motion` | Verify Stitch honored it; if not, add the media query block in `src/styles/global.css` |
| Fonts | Replace any Stitch font imports with our `astro-font`-loaded Fraunces + Geist + Geist Mono |

Things Stitch will get wrong that you should expect to fix manually:
- **Particle physics** — Stitch gives you a static dot field at best
- **Bilingual content** — single-language output, requires the i18n wrap-up
- **View transitions between routes** — needs Astro's `<ViewTransitions />` and shared-element wiring
- **Performance budget** — Stitch doesn't optimize for JS bundle size; audit on export
- **Lighthouse a11y** — automated check after merge, not on Stitch's word

---

*End of Stitch prompt doc. Iterate this file as you learn what works.*
