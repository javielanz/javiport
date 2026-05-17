# STITCH_EXPORT/

Landing zone for Google Stitch's exported HTML / CSS / JS / assets.

## Workflow

1. Santiago iterates on the design in Stitch (driven by `../STITCH_PROMPT.md`, refined via the Stitch MCP).
2. When a Stitch design is approved, export it from Stitch (Code → HTML+CSS, Tailwind if offered).
3. Drop the entire export into this folder **verbatim**, including any `index.html`, stylesheets, scripts, and image assets.
4. Commit the raw import as a single commit (`chore: import stitch export <date>`) before any adaptation work — keeps the baseline clean for diffs.
5. Reflow's M3 then ports this into Astro components under `src/components/`, extracts tokens into `src/styles/global.css`, and stages the particle implementation per `../PLAN.md` §7.

## Conventions

- One export = one subfolder if iterating (`v1/`, `v2/`, etc.). Latest goes in root for M3 to pick up.
- Keep raw export untouched after commit — adaptations live in `src/`, not here.
- If Stitch's export is large or contains binary assets, verify `.gitignore` patterns don't accidentally exclude them.
