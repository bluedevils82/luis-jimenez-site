# CLAUDE.md — Second Brain Operating Rules

This vault is a knowledge pipeline, not a topic tree. Notes flow through **stages**, not subjects. Read and enforce these rules on every session.

## The pipeline

```
inbox/      zero-friction capture, no organizing
projects/   active WIP, one file per project, status: line at top
career/     living documents (exempt from pipeline — see below)
output/     shipped artifacts, completion-dated
wiki/       distilled reusable knowledge, harvested ONLY from shipped work
```

### The pipeline rule
Wiki articles are **harvested from finished projects, never written directly.**

If the user asks to create a wiki note and there is no shipped source in `output/`, refuse and point them at the project it should come from. Suggest `/harvest <project>` if the source project exists but hasn't been harvested yet.

### The career exception
Files in `career/` are **living documents outside the ship-to-harvest flow.** They update in place and never graduate to `wiki/`. `/harvest` must refuse to operate on `career/` files.

## Standing rules (enforce every session)

1. **Children's names.** Children's names never appear in anything destined for public output — initials only for minors. **Exception:** "Palmer" and "Everett" in the published book title *Palmer, Everett, & Yaya: The Backyard Teachers*. That exception is the title itself only — posts, marketing, screenshots, and everything else still use initials.
2. **Never SMS 2FA.** Do not recommend or configure SMS-based 2FA in any security-related note or setup. Prefer TOTP or hardware keys.
3. **Retired worker.** Never reference `lape-hq.bluedevils82.workers.dev` — it is retired. Current proxy: `anthropic-api-proxy.bluedevils82.workers.dev`.
4. **Default stack.** Assume Claude / Claude Code, Node.js, Python, React, Cloudflare Workers, Railway, Stripe, GitHub, Zapier, Canva, Midjourney / Nano Banana. Do not propose alternatives unless asked.
5. **Tone.** Professional / technical for ADP and LAPE work; creative register allowed for family / personal files (book, home addition, kids).

## File conventions

- **Filenames:** kebab-case, `.md` extension. No spaces, no capitals.
- **H1 = title.** One H1 per file, at the top.
- **`status:` line at top of every project file.** Free-form short phrase (e.g. `status: shipped v1 — harvest candidate`).
- **Dates:** `YYYY-MM-DD` everywhere.
- **No YAML frontmatter.** The `status:` line and any `source:` line are the only structured metadata. Everything else lives in the body as prose or lists.
- **`source:` line on every wiki note.** Points back to the shipped project it was harvested from.
- **Plain markdown only.** No plugins, no Dataview, no templater. `cat` must render the note usefully.

## Folder maps

Every folder has an `_index.md`. Update the relevant `_index.md` when you add or move a file into or out of that folder.

## Naming continuity

- **Agent Factoria** was renamed from "The Agent Factory" due to trademark conflict. Never use the old name in any artifact.
- **LAPE Ventures** is the umbrella; its workstreams (Family Venture Finder, LAPE Signal, LAPE Distributor) live inside `projects/lape-ventures.md` until one grows large enough to warrant its own file.

## When in doubt

- Ambiguous new capture → `inbox/`. Never guess it straight into `wiki/`.
- Ambiguous positioning claim → **do not add it to `career/positioning.md`.** That file only accepts measurable results with clear ownership.
- Ambiguous stack choice → assume the default stack (rule 4). Ask before deviating.
