---
description: Harvest reusable knowledge from a shipped project into wiki/, then move the project to output/.
argument-hint: <project-name>
---

# /harvest $ARGUMENTS

Extract reusable, generalizable knowledge from a shipped project into `wiki/`, then archive the project to `output/`. This is the ONLY sanctioned way to create wiki notes.

## Execute this exact procedure

### 1. Validate the target

- If `$ARGUMENTS` is empty, ask which project to harvest and stop.
- Locate `projects/$ARGUMENTS.md`. If it does not exist, refuse and list the projects that do exist.
- If the target path resolves under `career/`, **refuse.** Career files are exempt from the pipeline — they update in place and never harvest.

### 2. Confirm the project has shipped

Read `projects/$ARGUMENTS.md` and check the `status:` line and body. The project must have shipped — indicators include phrases like "shipped v1", "shipped", "published", "released", "in production", "deployed", or a completion date.

**If the project has not shipped, refuse.** Say clearly why (paraphrase the current `status:` line) and stop. Do not create any wiki notes. Do not move anything.

### 3. Read the project and its linked output

Read the project file in full. Follow any URLs, repo paths, or file paths it references that you can access, so the harvest reflects real shipped work — not just the project's own summary of itself.

### 4. Extract ONLY reusable knowledge

Wiki notes capture patterns, checklists, and gotchas that apply beyond this one project. **They are not project narrative.**

For each piece of the project, ask: "Would this be useful to someone starting a *different* project?"

- **Include:** architectural patterns, integration checklists, config templates, gotchas / failure modes with root causes, decision heuristics, review criteria, reusable prompt fragments.
- **Exclude:** what happened on this project, who did what, dated status updates, this-project-only credentials or IDs, one-off business context.

Group related knowledge into one wiki note where it stays cohesive; split when topics diverge. Prefer fewer, better notes over many thin ones.

### 5. Write the wiki notes

For each note:

- Path: `wiki/<kebab-case-topic>.md`
- H1 = topic title
- **Second line must be:** `source: projects/$ARGUMENTS.md` (this survives the move to `output/` — the reference stays literal so future readers can grep it).
- Body: the reusable knowledge, in plain markdown.
- Follow all conventions in `CLAUDE.md` (kebab-case, YYYY-MM-DD dates, no YAML frontmatter, tone matches domain).
- Enforce all standing rules from `CLAUDE.md` (children's initials, no SMS 2FA, retired-worker suppression, default stack, tone).

If a candidate wiki note has no reusable content — only project narrative — do not write it. It is fine to harvest zero notes if the project genuinely produced no generalizable knowledge; say so.

### 6. Update `wiki/_index.md`

Add the new note(s) under a "Contents" section (create the section if empty). One line per note, linking to the file.

### 7. Move the project to `output/`

- Move `projects/$ARGUMENTS.md` → `output/$ARGUMENTS.md`.
- At the top of the moved file, immediately under the H1, add: `completed: YYYY-MM-DD` (today's date).
- Update the `status:` line to `status: shipped — harvested YYYY-MM-DD`.
- Remove the file's link from `projects/_index.md`.
- Add the file to `output/_index.md` under a "Contents" section.

### 8. Report

Summarize:
- Which wiki notes were created (paths).
- Which project moved to `output/`.
- Anything intentionally NOT harvested and why.

## Refusal templates

- **No shipped source:** "Refusing to harvest `$ARGUMENTS` — its status is `<paraphrased status>`. Wiki notes are harvested only from shipped work. Ship it first, then re-run `/harvest $ARGUMENTS`."
- **Career file:** "Refusing to harvest `$ARGUMENTS` — `career/` files are living documents exempt from the pipeline. They update in place and never graduate to `wiki/`."
- **Direct wiki write attempted elsewhere:** "Refusing to create a wiki note directly. Wiki is harvested only. Point me at the shipped project it comes from and I'll run `/harvest`."
