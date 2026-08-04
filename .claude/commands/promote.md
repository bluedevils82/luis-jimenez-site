---
description: Move an inbox note into projects/, career/, or output/. Never wiki/.
argument-hint: <inbox-file> <target-path>
---

# /promote $ARGUMENTS

Move a note from `inbox/` into its rightful stage. `wiki/` is never a valid target — the only path to `wiki/` is `/harvest`.

## Procedure

1. Parse `$ARGUMENTS`. Expect two tokens: `<inbox-file>` and `<target-path>`.
   - `<inbox-file>` may be given with or without the `inbox/` prefix.
   - `<target-path>` must live under `projects/`, `career/`, or `output/`.
   - If arguments are missing or ambiguous, ask before doing anything.
2. Structural validation (hard refusals — see below):
   - Source must be under `inbox/`.
   - Target must NOT be under `wiki/`.
   - Target must NOT be an `_index.md` file.
3. Determine mode:
   - **New-file mode** — target file does not exist.
   - **Append mode** — target file exists.
4. **New-file mode:**
   - Read the source. Copy its content into the target.
   - For `projects/`: ensure a `status:` line exists directly under the H1. If the source did not have one, insert `status: TBD — set on promote` and mention in the report that the user needs to fix it.
   - For `output/`: insert `completed: YYYY-MM-DD` (today) directly under the H1, and set `status:` to `status: shipped — promoted YYYY-MM-DD`.
   - For `career/`: no additional metadata required.
5. **Append mode:**
   - Do NOT overwrite the target's H1 or `status:` line.
   - Append a horizontal rule `---`, then a section header `## YYYY-MM-DD — <source-h1>`, then the source body.
6. Delete the source file from `inbox/`.
7. Update the destination folder's `_index.md` to include the file (skip if already listed, or if append-mode didn't create a new file).
8. If the source filename matches `merge-candidate--<expected>--*.md`, warn if `<expected>` doesn't match the target basename.
9. Report: source, destination, mode, and any flags surfaced in the standing-rules pass.

## Standing-rules pass (surface, do not block)

Scan the source content before promoting. Flag but do not auto-rewrite:

- References to `lape-hq.bluedevils82.workers.dev` → flag `retired-worker`.
- "The Agent Factory" (old name) → flag `old-name`.
- "Palmer" or "Everett" outside a book-title context → flag `kid-name-full`.

If any flag fires, still perform the promote, but include the flags prominently in the report so the user can edit the promoted file immediately.

## Refusals (structural — cannot be overridden by flags)

- Target under `wiki/`: "Wiki is harvest-only. Run `/harvest <project>` after the project ships."
- Source outside `inbox/`: "Only `inbox/` files can be promoted. Move it to `inbox/` first if you really mean to reroute it."
- Target is an `_index.md`: "Never overwrite an index. Add the file separately and update the index."
