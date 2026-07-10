# Agent Factoria

status: manual deployment stage — pre-launch

Freemium AI agent builder SaaS. Renamed from "The Agent Factory" (trademark conflict). **Never use the old name in any artifact.**

## Current state
- React/Vite frontend + Express backend
- Stripe integration wired for freemium tiering
- Deploying on Railway
- Manual deployment step is the current gate — no CI/CD yet

## Next 3 actions
1. Register production domain
2. Swap Stripe test keys for live keys and verify webhook signatures against live secret
3. Cut over Railway production service and smoke-test signup → paid tier → agent create flow

## Blockers
- Domain registration decision (name locked, registrar TBD)
- Stripe live-mode approval status on the account

## Relevant URLs / paths
- Proxy: `anthropic-api-proxy.bluedevils82.workers.dev`
- Stack: React/Vite, Express, Stripe, Railway, GitHub
