---
description: One-screen view of every project + career status: line, plus stage counts.
---

# /status

Print an at-a-glance dashboard of pipeline state. Read-only. This is the first thing to run at the start of a work session.

## Procedure

1. For each `.md` file in `projects/` (excluding `_index.md`):
   - Read the H1 title and the first `status:` line.
   - If no `status:` line, mark the project as `MISSING status:`.
2. Do the same for `career/`.
3. Count files in `inbox/`:
   - notes (top-level `.md` except `_index.md` and `_migration-log.md`)
   - attachments (any file under `inbox/attachments/`)
   - merge-candidates (top-level `.md` starting with `merge-candidate--`) reported inside the notes count and separately
4. Count `.md` files in `output/` (excluding `_index.md`).
5. Count `.md` files in `wiki/` (excluding `_index.md`).

## Output format

```
PROJECTS
  <project-title> — <status>
  ...

CAREER
  <career-title> — <status>
  ...

INBOX
  <N> note(s), <M> merge-candidate(s), <K> attachment(s)

OUTPUT
  <N> shipped

WIKI
  <N> distilled
```

If any project or career file is missing a `status:` line, print a `WARNINGS` block above `PROJECTS` listing them.

## Refusals

- Never modify any file. Never re-order or edit `_index.md`. Read-only.
