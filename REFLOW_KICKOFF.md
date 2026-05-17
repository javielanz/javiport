# Reflow Kickoff — javiport

> Paste the prompt between `---START---` and `---END---` into reflow as the initial brief.

---START---

You are reflow, a swarm executing the **javiport** project — a polished, cinematic-editorial-dark personal portfolio for Javier Lanz Bethencourt (Content Strategist at EGCars / Suzuki Venezuela, Communication Social student at Universidad Monteávila, audiovisual creator).

## Repo

- **URL**: `https://github.com/javielanz/javiport.git`
- **Branch**: `main`
- **Local working directory**: `C:\Users\LANZ\SL\javiport` (if local) — clone fresh otherwise.

## Required reading (in this order)

1. `PLAN.md` — execution contract: stack, architecture, content model, design system, motion language, asset pipeline, deployment, milestones M1–M11.
2. `COPY_REGISTER.md` — every visible string on the site in EN + ES. Use verbatim. Do not improvise copy.
3. `STITCH_EXPORT/IMPORT_NOTES.md` — what to adopt and what to fix from the Stitch design baseline.
4. `STITCH_EXPORT/home.html` + `STITCH_EXPORT/work-streets-of-caracas.html` — visual source of truth for M3.
5. `STITCH_PROMPT.md` — context on how the Stitch design was generated (useful if regenerating components later via Stitch MCP).
6. `AUDIT.md` — change log to date. Append new entries as work lands.

## Where to start

Execute **M1** (Scaffold) first. Then **M2** (Deploy pipeline). **Stop after M2 and confirm the first deploy at `https://javielanz.github.io/javiport/es/` returns a placeholder page** (will be near-blank, that's expected). Do not proceed to M3 until M2 deploy is verified live.

After M2 confirmed: **M3** (Import Stitch export + extract tokens). This is where IMPORT_NOTES.md's "fix in M3" list applies. Suggested commit boundary in M3:

- A: raw Stitch import (already landed)
- B: Astro component scaffolding from Stitch HTML
- C: `@theme` token extraction into `src/styles/global.css`, drop Tailwind CDN, wire `astro-font` for self-host
- D: port particle JS to `src/components/ParticleField.client.ts` (TypeScript, no logic changes; respect PLAN.md §7 source-preference)

After M3: M4 (Content model) → M5 (Asset pipeline) → M6 (Hero+About+Particles) → M7 (remaining home sections) → M8 (Case study template + Photo Essay) → M9 (remaining case studies) → M10 (already in plan as M11 — motion polish, a11y, Lighthouse, ship). Follow the DAG in PLAN.md §10.

## Hard rules (no exceptions)

1. **Commit identity**: every commit must be `javielanz / javielanz@gmail.com`. Local config is already set in the cloned repo. Verify with `git config --local user.email` before each commit. **Never** use `--global`. If working in a fresh clone, set local config before the first commit.
2. **No `Co-Authored-By` trailers** in any commit message. Plain messages only.
3. **All copy** must come from `COPY_REGISTER.md` verbatim. If a slot is missing, request it — do not invent.
4. **Performance budget**: Lighthouse ≥ 95 on Perf / A11y / Best Practices / SEO, mobile + desktop. LCP < 2 s on 4G. Hero JS ≤ 50 KB compressed (incl. particle field + lang toggle).
5. **Responsive matrix**: layouts must work at 375 / 768 / 1280 / 1920 px. No horizontal scroll at any width. Test before declaring any milestone done.
6. **Accessibility**: WCAG 2.1 AA. Respect `prefers-reduced-motion`. Alt text on every meaningful image. Keyboard-reachable for every interactive element.
7. **i18n**: every page exists in EN and ES. Build fails if a translation is missing. Toggle preserves current path.
8. **No third-party trackers** in v1. Analytics deferred to v2.
9. **Raw media** (`media/raw/`) stays gitignored. Only web-optimized outputs in `media/web/` get committed.
10. **One milestone = one commit** (preferable) or a small series with the milestone tag in the subject line. Push after each milestone for visibility.

## Coordination & human-in-the-loop

These items require Santiago or Javi — do not block on them, but flag clearly when reached:

- **Repo Settings → Pages → Source = "GitHub Actions"** — already done.
- **Vimeo unlisted upload** of the documentary master file — needed before M9 short-films case study renders.
- **Additional EGCars / Suzuki campaign material** — request from Santiago/Javi if M9 EGCars case study feels thin.
- **Final EN/ES copy review** — before M10 deploy.

If reflow gets stuck or hits an ambiguity not resolved by PLAN.md / COPY_REGISTER.md / IMPORT_NOTES.md, request clarification rather than guessing. Santiago is the product owner.

## Style and quality bar

Match `antigravity.google` and `anthropic.com` in restraint and pacing. Confident, slow, intentional. No bouncy springs. No parallax-everywhere. No emoji on the site. No template-y patterns. Voice for any unavoidable improvisation: per COPY_REGISTER.md §15 (no "passionate", no "innovative", no "synergy", no "elevate", no "leverage", no "unlock").

Begin with M1.

---END---

---

## After reflow runs M1+M2

Report back to Santiago with:
- Commit hashes for M1 and M2
- Live URL confirmation (`https://javielanz.github.io/javiport/es/`)
- Any deviations from the plan + rationale
- Then await go-ahead for M3.

## When iteration is needed

If reflow needs Stitch design changes (variants of a component, regenerate a section, new screen) during execution, Santiago can call Stitch MCP from a Claude Code session — Stitch MCP is configured at user scope and gives access to `mcp__stitch__generate_screen_from_text`, `edit_screens`, `generate_variants`, and the design system tools. Updated screens get exported into `STITCH_EXPORT/v2/` (or `v3/`, etc.) and the corresponding Astro components get patched.

## When stuck

Ping Santiago in the conversation thread. Don't ship guesses on:
- Voice / tone judgment calls on improvised copy (request register update instead)
- Stitch placeholder content where the real content isn't in the repo
- Performance regressions that drop Lighthouse below 95 (escalate before merging)
- Any change to `commit identity` or `Co-Authored-By` rules
