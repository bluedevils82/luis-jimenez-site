# luis-jimenez-site

## Viral Clone Pipeline

A Claude Code skill that runs the four-stage viral-video pipeline — ingest a viral short, derive an
original idea, produce an avatar-led version, publish across platforms — using connected MCP tools
instead of an n8n graph. There's no server, no webhook loop, and nothing to host: Claude orchestrates,
and the connectors are the nodes.

Run it by asking, e.g. *"clone this video: <url>"*, or invoke `viral-clone-pipeline` directly.

| Stage | Does | Runs on |
|---|---|---|
| 1 | Ingest + analyze the source | Higgsfield video analysis, Virality Predictor |
| 2 | Derive an original concept + script | WebSearch, Claude |
| 3 | Produce the new video | Higgsfield UGC / faceless / Shorts Studio workflows, Google Drive |
| 4 | Publish + log | Buffer and Google Sheets via Zapier, native TikTok, IFTTT for X |

Stages 3 and 4 stop at approval gates — they spend credits and publish publicly.

### Files

```
.claude/skills/viral-clone-pipeline/
├── SKILL.md                        # the orchestrator
└── references/
    ├── connector-map.md            # every n8n node → its replacement, and the 4 gaps
    ├── tracking-sheet.md           # Google Sheets run-log schema
    └── publishing.md               # per-platform caption rules, failure handling
```

### Known gaps vs. the original n8n workflow

No TikTok downloader (upload the file or supply a direct mp4 URL), no Telegram trigger, no
JSON2Video caption burn-in, and Buffer fans out per-channel rather than in one Blotato call.
Details in `references/connector-map.md`.
