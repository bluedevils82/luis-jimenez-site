# luis-jimenez-site — Second Brain

A knowledge pipeline vault, not a topic tree. Notes flow through stages, not subjects.

## The pipeline

```
inbox/    ── zero-friction capture, no organizing
   ↓
projects/ ── active work in progress, one file per project
   ↓ (ship)
output/   ── shipped artifacts, completion-dated
   ↓ (/harvest)
wiki/     ── distilled reusable knowledge (harvest-only)

career/   ── living documents outside the pipeline (interview prep,
             resume state, positioning proof points)
```

**Rules that matter enough to enforce:**

1. Wiki articles are harvested from finished projects, never written directly.
2. `career/` files never graduate to `wiki/`.
3. Children's names appear only as initials in anything destined for public output. The one exception is the published book title *Palmer, Everett, & Yaya: The Backyard Teachers*.
4. Never SMS-based 2FA in any security note.
5. Never reference the retired worker `lape-hq.bluedevils82.workers.dev`. Current proxy is `anthropic-api-proxy.bluedevils82.workers.dev`.
6. Default stack: Claude / Claude Code, Node.js, Python, React, Cloudflare Workers, Railway, Stripe, GitHub, Zapier, Canva, Midjourney / Nano Banana.

Full rules and file conventions live in [`CLAUDE.md`](CLAUDE.md). Read that before making changes.

## Commands

All commands are Claude Code slash commands defined in [`.claude/commands/`](.claude/commands/).

| Command | What it does |
| --- | --- |
| `/capture <text>` | Dump anything into `inbox/YYYY-MM-DD-<slug>.md`. Zero friction. |
| `/status` | One-screen view of every project + career `status:` line, plus stage counts. |
| `/inbox` | Triage-oriented listing of `inbox/`, oldest first, with suggested promotes. |
| `/promote <inbox-file> <target>` | Move an inbox note into `projects/`, `career/`, or `output/`. Never `wiki/`. |
| `/harvest <project>` | Extract reusable knowledge from a shipped project into `wiki/`, then archive to `output/`. Refuses if the project hasn't shipped or if the target is a `career/` file. |

## Tools

Plain scripts in [`tools/`](tools/), runnable from the vault root, no third-party dependencies.

- `python tools/migrate-notes.py <source-dir> [--apply] [--move] [--kids "Name1,Name2"]`
  Sort a notes dump into the vault. Dry-run by default; `--apply` copies and writes `inbox/_migration-log.md`.
- `python tools/check-invariants.py [--brief]`
  Verify pipeline rules across the vault (wiki `source:` lines, retired-worker references, old-name occurrences, `status:` lines on project files, YAML frontmatter, kebab-case filenames). Exits non-zero on violations. Useful as a pre-commit gate.

## Layout

```
CLAUDE.md              operating rules (read first)
README.md              this file
_index.md              inside every stage folder — the folder map

inbox/
  _index.md
  _migration-log.md    written by tools/migrate-notes.py --apply
  <YYYY-MM-DD>-*.md    captured notes
  merge-candidate--*   candidates from migration awaiting /promote
  attachments/         non-text files from migration

projects/
  _index.md
  agent-factoria.md
  lape-ventures.md
  wfn-content-studio.md
  backyard-teachers-book.md
  home-addition.md

career/
  _index.md
  adp-director-search.md
  positioning.md

output/    (empty until /harvest runs)
wiki/      (empty until /harvest runs)

.claude/commands/      slash commands
tools/                 migration + invariant scripts
```

## Onboarding a new session

1. `git pull`
2. `/status` — see where things stand.
3. `/inbox` — triage what's captured.
4. Work.
5. Before committing anything meaningful, `python tools/check-invariants.py`.
