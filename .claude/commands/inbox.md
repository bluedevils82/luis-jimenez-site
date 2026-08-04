---
description: Triage view of inbox — grouped, aged, with suggested promotes.
---

# /inbox

Triage-oriented view of `inbox/`. Read-only. Use before a work session to decide what earns a home in `projects/`, `career/`, or `output/`.

## Procedure

1. List everything in `inbox/`, excluding `_index.md` and `_migration-log.md`.
2. Group:
   - **Merge candidates** — top-level files whose name matches `merge-candidate--<target>--*.md`. Parse `<target>` from the filename.
   - **Attachments** — anything under `inbox/attachments/`.
   - **Plain notes** — top-level `.md` files that are neither of the above.
3. For each file, extract:
   - filename
   - H1 (title) from the first line if present
   - filesystem modification date (age in days if easy; otherwise print date)
4. Sort each group **oldest first** so stale items surface at the top.
5. Print:

   ```
   MERGE CANDIDATES (N)
     inbox/merge-candidate--<target>--<slug>.md — "<h1>" — <age>
       suggested: /promote merge-candidate--<target>--<slug>.md projects/<target>.md
     ...

   PLAIN NOTES (N)
     inbox/<slug>.md — "<h1>" — <age>
     ...

   ATTACHMENTS
     <count> file(s) in inbox/attachments/
     (list individually only if count < 10)
   ```

6. If there are zero files in every group, print `Inbox empty.` and stop.

## Refusals

- Read-only. Never move, edit, or delete anything from this command. That's what `/promote` and manual edits are for.
