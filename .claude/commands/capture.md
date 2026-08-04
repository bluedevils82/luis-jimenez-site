---
description: Frictionless capture into inbox/. Anything after /capture becomes a dated inbox note.
argument-hint: <free text — first line becomes the title>
---

# /capture $ARGUMENTS

The whole point of `inbox/` is zero friction. This command takes whatever the user typed after `/capture` and writes it to a dated inbox note. No prompts, no confirmation, no routing. That's the point — decisions come later.

## Procedure

1. If `$ARGUMENTS` is empty, ask what to capture and stop. Do not create an empty note.
2. Split `$ARGUMENTS` on the first newline. First line becomes the title; the rest (if any) becomes the body. If there is no newline, the whole text is the title and the body is empty.
3. Target path: `inbox/YYYY-MM-DD-<slug>.md` (today's date, `YYYY-MM-DD`).
   - `<slug>`: lowercase the title, replace runs of non-alphanumerics with a single dash, trim leading/trailing dashes, truncate to ~50 characters at a word boundary.
   - If the target file already exists, append `-2`, `-3`, etc.
4. Write the file:

   ```
   # <title>

   <body>
   ```

5. Report the path.

## Standing-rules pass (surface, do not block)

Scan the captured text. Do not rewrite anything — capture is capture.

- If it references `lape-hq.bluedevils82.workers.dev`, append this line to the file:
  `> flag: mentions retired worker — replace with anthropic-api-proxy.bluedevils82.workers.dev before promoting.`
- If it references "The Agent Factory" (the old name), append:
  `> flag: uses the old name "The Agent Factory" — Agent Factoria is the current name (trademark).`
- If it references "Palmer" or "Everett" outside a clear book-title context, append:
  `> flag: kid name appears in full — replace with initials before promoting to any public-facing output.`

## Refusals

- Never write outside `inbox/`.
- Never modify or delete an existing file. Only create.
