# LAPE Ventures

status: multi-workstream — active

Umbrella for three related workstreams under the LAPE brand. Each workstream tracked inline here until one grows large enough to split into its own file.

---

## Workstream 1: Family Venture Finder (FVF) landing page

status: iterating on landing copy + fixing worker bugs

- Cloudflare Worker fronting the funnel
- **Positioning:** "decision-support tool" — this framing won prior A/B positioning simulations over "novelty report". Keep this frame in all copy.
- **Bug history:** `renderPaywall()` has been a recurring source of bugs. Any change touching it needs regression-check of the paywall render flow (missing states, unauth users, subscribed users).

### Next 3 actions
1. Audit `renderPaywall()` for the previously-fixed edge cases before shipping any copy change
2. Ship the decision-support headline variant to production
3. Instrument funnel to compare against the last simulation baseline

### Blockers
- None active

---

## Workstream 2: LAPE Signal dashboard

status: build phase

- React + Recharts
- Internal-facing analytics dashboard

### Next 3 actions
1. Define the metric set that Signal actually needs to report (avoid vanity charts)
2. Wire data source(s)
3. First usable render with 2–3 real metrics

### Blockers
- Metric scope not yet locked

---

## Workstream 3: LAPE Distributor content pipeline

status: pipeline live, tuning voice contracts

- Per-platform **voice contracts** (each platform has its own tone/format constraints)
- **Publish caps** per platform to prevent flooding
- Driven by a Claude Code subagent

### Next 3 actions
1. Codify voice contracts as reusable prompt fragments (harvest candidate for wiki once stable)
2. Confirm publish caps are enforced end-to-end, not just documented
3. Add per-platform failure telemetry

### Blockers
- None active

## Relevant URLs / paths
- Proxy: `anthropic-api-proxy.bluedevils82.workers.dev`
- Stack: Cloudflare Workers, React, Recharts, Claude Code subagent
