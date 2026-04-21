# Pulse

Personalised AI tech feed for engineers. Monorepo: Next.js (`apps/web`), Hono (`apps/api`), shared packages (`packages/*`).

## One-shot local setup

**Prerequisites**
- Node 22 LTS (see `.nvmrc`)
- pnpm 9 (via Corepack: `corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- Docker Desktop with WSL integration enabled (for local Postgres + pgvector)

```bash
git clone <repo> && cd pulse
cp .env.example .env.local
docker compose up -d postgres
pnpm install
pnpm db:migrate
pnpm dev
```

`apps/web` runs on `:3000`, `apps/api` on `:3001`. Run `pnpm dev:inngest` in a second terminal to spin up the local Inngest dev server on `:8288`.

## Scripts

- `pnpm dev` — start all apps in parallel (Turborepo)
- `pnpm build` — build every workspace
- `pnpm test` — Vitest across all workspaces (pgvector test skips without Docker)
- `pnpm lint` / `pnpm typecheck` — linting and typechecking
- `pnpm db:generate` — regenerate Drizzle migrations from schema changes
- `pnpm db:migrate` — apply pending migrations under an advisory lock
- `pnpm format` — Prettier

## Env var tiers

Env loading is tiered by `PULSE_ENV`:
- `local` (default) — stubs accepted; SDKs degrade to no-op.
- `staging` / `prod` — all required vars enforced; missing → startup error.

See `packages/shared/src/env.ts` for the schema and ADR-0006 for rationale.

## Docs

- Runbooks: [deploy](docs/runbooks/deploy.md) · [rollback](docs/runbooks/rollback.md) · [oncall](docs/runbooks/oncall.md)
- ADRs: [docs/decisions/](docs/decisions/)
- Product PRDs: [master](docs/prd/Pulse-Master-PRD.md) · [phase 0](docs/prd/Pulse-Phase-0-PRD.md)
- Execution spec: [docs/superpowers/specs/2026-04-21-phase-0-execution-design.md](docs/superpowers/specs/2026-04-21-phase-0-execution-design.md)

## Phase 0 signoff

See [`docs/phase-0-signoff.md`](docs/phase-0-signoff.md) — split between a Session checklist (ticked locally) and a Cloud bring-up checklist (tick as each provider is provisioned).
