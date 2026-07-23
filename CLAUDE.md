# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bilingual (ES default / EN) portfolio for Javier Lanz — Astro 5, fully static, deployed to GitHub Pages at https://javielanz.github.io/javiport/ (base `/javiport`, trailing slash always). Tailwind CSS 4 (CSS-first via `@tailwindcss/vite` — no tailwind.config), dark-only editorial design ported from a Google Stitch export. Node 22 (`.nvmrc`, engines).

## Commands

```bash
npm run dev            # dev server at http://localhost:4321/javiport/es/  (note the base path)
npm run build          # static build to dist/
npm run preview        # preview built site
npm run check          # astro check (TS/Astro diagnostics)
npm run check:parity   # EN/ES parity gate — run before pushing (see i18n below)
npm run media:build    # regenerate public/media/web/ from media/raw/ (sharp + ffmpeg)
                       #   flags need passthrough: npm run media:build -- --force --only <basename> [--av1]
                       #   LOCAL-ONLY: exits immediately when CI=true
npm run media:clean    # deletes public/media/web/ — those are TRACKED files; rebuild + recommit after
npm run format         # prettier --write src
```

**There are no tests.** The verification suite is `npm run lint && npm run check:parity && npm run check && npm run build` — exactly what CI runs (lint was wired up 2026-07-23: typescript-eslint + eslint-plugin-astro).

## Deploy

Push to `main` → `.github/workflows/deploy.yml` (Node 22): `npm ci` → `lint` → `check:parity` → `astro check` → `astro build` → publish `./dist` to GitHub Pages. Any gate failure blocks deploy. **CI never runs media:build** — the committed files under `public/media/web/` are the only media that ships. If deploys 404, check repo Settings → Pages source is "GitHub Actions".

## Architecture

### Routing & i18n
- Both locales are URL-prefixed: `/javiport/es/` and `/javiport/en/` (`prefixDefaultLocale: true`, `redirectToDefaultLocale: false` — Astro does NOT redirect the root).
- The homepage is one dynamic route `src/pages/[lang]/index.astro` (getStaticPaths es/en), composing the section components (Nav, Hero, About, Work, Capabilities, Experience, Education, Contact, Footer) with a `lang` prop.
- Case studies: one dynamic route `src/pages/[lang]/work/[slug].astro`; `getStaticPaths` maps every `work` entry to `{lang: entry.data.lang, slug: entry.data.slug}` — routing uses frontmatter `slug`/`lang`, never entry ids.
- Root redirect: `src/pages/index.astro`'s inline script reads `localStorage.lang`, then `navigator.language`, falling back to `/es/` (meta-refresh backstop). There is no middleware.
- UI strings live in `src/content/ui/strings.{en,es}.json`, loaded via `getStrings(lang)` in `src/lib/strings.ts` (typed off the EN file). Nav and Footer read from it too; only tiny single-use labels (CaseStudyLayout prev/next, skip link) remain inline ternaries.

### Content collections (`src/content/config.ts`)
- Three collections: `work` (the case studies), `experience`, `education`. Every entry is a **pair**: `slug.en.md` + `slug.es.md`, frontmatter carries explicit `lang` and `slug`, ordering via numeric `order` field.
- `check-parity.mjs` hard-fails if a translation twin is missing, a filename deviates from `slug.(en|es).md` (no stray .md files allowed in those dirs), or the two strings.json files diverge structurally (including array lengths). Every content/copy change must land in both languages.
- Case-study galleries and per-card CTA labels are hardcoded lookup tables keyed by slug: galleries in `src/pages/[lang]/work/[slug].astro`, `ctaBySlug` in `src/components/Work.astro`. A new work entry with a gallery/custom CTA requires editing those too.

### Design system & components
- Dark-only (`<html class="dark">` hardcoded). All tokens live in the Tailwind 4 `@theme` block in `src/styles/global.css`: bg `#0A0908`, amber accent `#C99A5B`, ivory text, Literata (display serif) / Geist (body) / Geist Mono (meta), clamp()-based fluid type scale. Display font is **Literata** — docs mentioning "Fraunces" are historical.
- Styling convention: Tailwind utilities for layout/spacing + **inline `style` attributes referencing CSS custom properties** for color/type. Follow this; don't introduce Tailwind color classes.
- All components are `.astro` with vanilla hoisted `<script>` interactivity. **No React or framework islands** — the react/motion/astro-font staging deps were removed 2026-07-23; three.js (hero prism) is the only client framework code.
- `ParticleField.client.ts` is the signature hero canvas (density tiers, perf degradation ladder, static-grid fallback for `prefers-reduced-motion`). Perf budget: <5–8KB, <2ms/frame.
- `PrismScene.client.ts` is the hero 3D prism (three.js, dynamic-imported on idle so it's an async ~188KB gz chunk that never blocks LCP). Keep its materials dark — the ivory headline renders on top of it. It pauses offscreen, degrades DPR→fps under load, renders one static frame under `prefers-reduced-motion`, and disposes/re-inits across view transitions.
- `Layout.astro` = HTML shell (SEO/OG/hreflang, self-hosted fonts via `@font-face` in global.css, ClientRouter view transitions). Client scripts re-init on `astro:page-load` and tear down on `astro:before-swap`; Nav uses per-variant `transition:persist` keys and document-level delegated handlers.
- Base path `/javiport` is hardcoded in Nav, Footer, WorkCard, CaseStudyLayout, Layout hreflang regexes, the root redirect, and the `@font-face` URLs — only MediaFrame and the CV/og links use `import.meta.env.BASE_URL`. Changing the base means touching all of them.

### Media pipeline
- Content references images by **bare basename** (e.g. `caracas-essay-01`). `MediaFrame.astro` resolves them at build time into `<picture>` avif/webp/jpg srcsets from `public/media/web/` and reads `{base}.meta.json` for intrinsic size — the build throws if meta is missing (fix: `npm run media:build`) or alt text is absent on non-decorative images. Widths are a subset of 480/960/1440/2880; MediaFrame filters requested widths to those ≤ the source's intrinsic width (mirroring media-build, which never upscales), so only variants that exist on disk are emitted.
- Flow: `media/raw/` (gitignored originals, local machine only) → `scripts/media-build.mjs` → `public/media/web/` (committed, no LFS). Videos: two-pass H.264 1080p/720p + poster via ffmpeg — missing ffmpeg is only a warning, not an error.
- `documentary-master` is in a `HOLDBACK_VIDEOS` set and never encoded — it goes to Vimeo manually (`media/raw/documentary-master.TODO.md`); long-form video embeds come from the `vimeoUrl` frontmatter field.

## Hard rules (from PLAN.md / COPY_REGISTER.md)

- **Copy**: every visible string comes from `COPY_REGISTER.md` VERBATIM, in both languages — never improvise, paraphrase, or ad-hoc translate. Missing slot → ask, don't invent. (Exception: long-form case-study body prose is deliberately outside the register.) Voice: first person, no emoji, no exclamation marks, ES must read natively Venezuelan (tú), forbidden-words list in §15.
- **Git**: commits as `javielanz` / `javielanz@gmail.com` via LOCAL git config only, format `<type>: <subject>` lowercase imperative ≤72 chars, and **no Co-Authored-By trailers** — this overrides the default Claude Code trailer.
- **STITCH_EXPORT/ is frozen** — never modify it; adaptations live in `src/`. New Stitch iterations go to `STITCH_EXPORT/v2/` etc.
- Budgets: Lighthouse ≥95 all pillars, WCAG 2.1 AA, every animation must degrade under `prefers-reduced-motion`. Escalate before merging anything that breaks these.
- Out of scope for v1 unless asked: light mode, blog, CMS, server runtime, contact form, search. (Analytics shipped 2026-07-23: GoatCounter, cookieless.)
- `reference/` (gitignored) is Javi's drop folder for screenshots of things to fix — check it when he mentions it.
- Served PDFs live in `public/cv/`, og images in `public/og/` (home.png + per-case), fonts in `public/fonts/`. The CV source doc lives gitignored in `docs/`.

## Ruflo — Claude Code Configuration (auto-generated by ruflo init)

### Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation files unless explicitly requested
- NEVER save working files or tests to root — use `/src`, `/tests`, `/docs`, `/config`, `/scripts`
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- Keep files under 500 lines
- Validate input at system boundaries

### Swarm & Routing

- **Topology**: hierarchical-mesh (anti-drift) · **Max Agents**: 15 · **Memory**: hybrid
- When to swarm — **YES**: 3+ files, new features, cross-module refactoring, API changes, security, performance. **NO**: single file edits, 1–2 line fixes, docs updates, config changes, questions.
- Named agents coordinate via `SendMessage`; spawn all agents in ONE message with `run_in_background: true`, include comms instructions (who to message, what to send), then stop and wait — never poll.
- MCP tools via `ToolSearch`: `memory_store`, `memory_search`, `swarm_init`, `agent_spawn`, `hooks_route`, `aidefence_scan`.

### Build & Test

- ALWAYS verify before committing: `npm run check:parity && npm run check && npm run build` (this repo has no test runner)
