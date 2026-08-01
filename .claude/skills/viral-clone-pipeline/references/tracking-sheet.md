# Tracking sheet

The run log. Replaces the four Google Sheets nodes in the original diagram. Google Sheets is already
connected through Zapier (two accounts — confirm which one before the first write of a run).

## Why it exists

Each stage appends before the next begins, so a run that dies at Stage 3 can be resumed from the
sheet rather than restarted from the source video. It is also the only durable record of what was
published where.

## Schema

One tab, `runs`. One row per stage, plus one row per platform at Stage 4.

| Column | Example | Notes |
|---|---|---|
| `run_id` | `20260801-1432-k7d2` | `YYYYMMDD-HHMM-<4 chars>`. Constant for the whole run. |
| `stage` | `3` | 1–4. |
| `timestamp` | `2026-08-01T14:32:11Z` | UTC, ISO 8601. |
| `status` | `ok` | `ok`, `failed`, `skipped`, `awaiting_approval`. |
| `source_url` | `https://youtube.com/...` | Stage 1 only. |
| `concept` | `"3 tax mistakes..."` | Stage 2 — the chosen concept, one line. |
| `script` | full text | Stage 2. |
| `character_id` | uuid | Stage 3 — keeps the presenter consistent across runs. |
| `voice_id` | uuid | Stage 3 — same reason. |
| `video_url` | `https://...` | Stage 3. |
| `drive_url` | `https://drive.google.com/...` | Stage 3 archive copy. |
| `credits` | `240` | Stage 3. |
| `platform` | `instagram` | Stage 4 only, one row each. |
| `post_url` | `https://...` | Stage 4. Buffer queue ID is acceptable if not yet live. |
| `hook_score` | `0.81` | Virality Predictor, source at Stage 1 and final at Stage 3. |
| `error` | text | Populated whenever `status=failed`. |

## Writing to it

```
inspect_zapier_actions({ selected_api: "GoogleSheetsV2CLIAPI" })
```

Resolve the exact action key and the spreadsheet/worksheet dynamic enums before the first write —
do not hardcode IDs from a previous run. Then `execute_zapier_write_action` with the row.

Two accounts are connected. If the target sheet does not obviously belong to the account that
`connections.default` names, confirm with the user before writing rather than guessing.

## Setup for a new sheet

If no sheet exists yet, create one with a header row matching the columns above, in the order above.
Ask where it should live before creating it — a stray spreadsheet in the wrong Drive is annoying to
find later.

## Failure logging

A failed stage still writes its row. `status=failed`, `error` populated with the actual message, and
every column that was resolved before the failure filled in. A run with no row is a run nobody can
debug.
