# Pulse — Phase 0 PRD: Foundation & Infrastructure

> Implementation-ready PRD derived from Pulse Master PRD v2.0.

| Field | Value |
|---|---|
| **Phase** | P0 — Foundation & Infrastructure |
| **Document Version** | 1.0 |
| **Status** | Ready for execution |
| **Last Updated** | April 21, 2026 |
| **Timeline** | 5 working days (1 week) |
| **Owner** | Full-stack engineer (lead) + DevOps-capable engineer (can be the same person) |
| **Predecessors** | None |
| **Successors** | P1 (Onboarding), P2 (Ingestion Pipeline) — both unblocked on completion |

---

## 1. Phase Objective & Definition of Done

### 1.1 Objective
Stand up the complete development, deployment, and observability environment for Pulse so that **every subsequent phase can begin work on day one with zero infrastructure friction**. Phase 0 ships **no user-facing product features**. Its single deliverable is a working "hello world" walking-skeleton through every layer of the production stack.

### 1.2 Definition of Done (single sentence)
> A new engineer can clone the repo, run `pnpm install && pnpm dev` and have the full stack running locally in under 5 minutes; merging to `main` deploys to staging within 10 minutes; merging a tagged release to `prod` deploys with one-click rollback; a 500 error in production pages the on-call within 5 minutes; and all of this is verifiable via a documented checklist in the README.

### 1.3 Phase exit checklist
The phase is complete when **all** of the following are demonstrably true and recorded in `docs/phase-0-signoff.md`:

- [ ] `pnpm install && pnpm db:migrate && pnpm dev` brings up `apps/web` (Next.js) on `:3000` and `apps/api` (Hono) on `:3001` from a clean clone in < 5 minutes
- [ ] `pnpm test`, `pnpm lint`, `pnpm typecheck` all pass on a clean clone
- [ ] PR opened against `main` runs CI (lint + typecheck + test + build) in < 5 minutes and posts a Vercel preview URL
- [ ] Merge to `main` auto-deploys `apps/web` to Vercel staging and `apps/api` to Railway staging within 10 minutes
- [ ] Tagging `v*.*.*` deploys to prod via GitHub Actions with manual approval gate
- [ ] Clerk sign-up + sign-in works end-to-end on staging URL
- [ ] `GET /health` on the API returns `{ ok: true, db: "ok", commit: "<sha>" }` from staging
- [ ] `pgvector` extension is enabled; a test embedding insert + cosine query returns expected results
- [ ] Manually thrown error in `apps/web` and `apps/api` appears in Sentry with correct release tag and source maps
- [ ] PostHog receives a `page_view` event from the staging landing page
- [ ] Axiom receives structured JSON logs from `apps/api` with `trace_id` correlation
- [ ] A synthetic uptime check on `/health` is configured and pages on 3 consecutive failures
- [ ] Doppler is the source of truth for all secrets in dev / staging / prod
- [ ] `README.md` documents one-shot local setup and links to runbooks for deploy / rollback / on-call
- [ ] All five P0 open questions resolved in `docs/decisions/` ADRs

---

## 2. Resolved Architecture Decisions (ADRs)

The master PRD left five open questions for P0. Decisions below; each becomes an ADR file (`docs/decisions/000X-*.md`) committed in the first PR of the phase.

### ADR-0001 — Monorepo tooling: **Turborepo + pnpm workspaces**
- **Decision:** Use `pnpm` workspaces for dependency hoisting and `Turborepo` for task orchestration & remote caching.
- **Rejected:** Nx (over-tooled for a 5-package repo, opinionated generators add cognitive load); pnpm-only (no task graph caching → CI gets slow as soon as we add packages).
- **Escape hatch:** Turborepo is non-invasive — it only reads `turbo.json` and `package.json` scripts. Removing it is a one-PR change.

### ADR-0002 — ORM: **Drizzle**
- **Decision:** Drizzle ORM with `drizzle-kit` for migrations.
- **Rationale:** SQL-first DSL matches engineer audience and the kind of queries we'll write for the pipeline (window functions, vector ops, recursive CTEs). Native `pgvector` support via `drizzle-orm/pg-core` custom types. No code-gen step → faster cold builds. Smaller runtime (no Prisma engine binary, which is awkward on Vercel edge).
- **Rejected:** Prisma (heavier, edge story still rough, vector support requires unsafe escape hatches).
- **Escape hatch:** Drizzle schema is plain TS — migrating to Kysely or raw SQL is mechanical.

### ADR-0003 — Cloudflare WAF/CDN in front: **Defer**
- **Decision:** No Cloudflare in P0. Vercel's edge network + Railway's TLS termination is sufficient for MVP.
- **Trigger to revisit:** First credible scraping/abuse incident, or first public viral moment (Phase 7), or 10K MAU.
- **Rationale:** Adds a DNS hop, an account, a cache invalidation surface, and another secret rotation target. Premature in week 1.

### ADR-0004 — Test coverage policy for P0: **No threshold; required smoke tests only**
- **Decision:** No coverage % gate in P0 or P1. CI requires `lint`, `typecheck`, `test` to pass — but the test suite is small and intentional.
- **Required smoke tests in P0:**
  - `apps/api`: `/health` returns 200 and reports DB connectivity
  - `packages/db`: a Drizzle query against an in-memory or test Postgres returns expected shape
  - `apps/web`: landing page renders without errors (Playwright smoke)
- **Trigger to revisit:** End of P3 (when AI pipeline lands and untested code becomes expensive).

### ADR-0005 — Branching & feature flags: **Trunk-based with PostHog flags**
- **Decision:** Single long-lived branch (`main`). Short-lived feature branches (≤ 3 days). All in-progress, user-visible work guarded by PostHog feature flags.
- **Phase-tagged releases:** Use git tags `phase-0`, `phase-1`, … as milestones, plus semver tags `v0.1.0` for prod deploys.
- **Rationale:** Trunk-based avoids long-lived merge hell across 9 phases. PostHog flags are already in the stack; no extra tooling.

---

## 3. Repository & Package Layout

### 3.1 Final monorepo structure
```
pulse/
├── apps/
│   ├── web/                      # Next.js 15 (App Router) — Vercel
│   │   ├── app/
│   │   │   ├── (marketing)/      # Public landing, /about, /privacy
│   │   │   ├── (app)/            # Authed routes (placeholder for P1+)
│   │   │   ├── api/health/       # Edge health probe
│   │   │   └── layout.tsx
│   │   ├── components/ui/        # shadcn/ui generated components
│   │   ├── lib/
│   │   ├── instrumentation.ts    # Sentry init
│   │   └── next.config.mjs
│   └── api/                      # Hono on Node — Railway
│       ├── src/
│       │   ├── index.ts          # Server bootstrap
│       │   ├── routes/health.ts
│       │   ├── middleware/       # auth, logging, error
│       │   └── inngest/          # Inngest function registry (empty in P0)
│       └── tsconfig.json
├── packages/
│   ├── db/                       # Drizzle schema + migrations + client
│   │   ├── schema/
│   │   │   ├── users.ts          # Stub User table only in P0
│   │   │   └── index.ts
│   │   ├── migrations/
│   │   ├── drizzle.config.ts
│   │   └── client.ts
│   ├── shared/                   # Cross-cutting types, zod schemas, env validation
│   │   ├── env.ts                # Zod-validated env loader (per-app)
│   │   └── types.ts
│   └── ai/                       # Anthropic / Voyage / Replicate clients (stubs in P0)
│       └── index.ts
├── docs/
│   ├── decisions/                # ADRs
│   ├── runbooks/                 # deploy.md, rollback.md, oncall.md
│   └── phase-0-signoff.md
├── .github/workflows/
│   ├── ci.yml
│   └── release.yml
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .env.example
└── README.md
```

### 3.2 Package responsibilities and dependency rules
| Package | Depends on | Consumed by | Notes |
|---|---|---|---|
| `apps/web` | `packages/db`, `packages/shared`, `packages/ai` | — | UI + RSC + edge handlers |
| `apps/api` | `packages/db`, `packages/shared`, `packages/ai` | — | Long-running Node server |
| `packages/db` | `packages/shared` | apps | No Next/Hono imports |
| `packages/shared` | — | all | Pure TS, zero deps beyond zod |
| `packages/ai` | `packages/shared` | apps | SDK wrappers only; no business logic |

**Rule:** Apps never import from each other. Packages never import from apps. Enforced by a `dependency-cruiser` config in CI (added in P1; manual review in P0).

### 3.3 `package.json` scripts (root)
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "db:generate": "pnpm --filter @pulse/db drizzle-kit generate",
    "db:migrate": "pnpm --filter @pulse/db tsx src/migrate.ts",
    "db:studio": "pnpm --filter @pulse/db drizzle-kit studio",
    "format": "prettier --write .",
    "prepare": "husky"
  }
}
```

---

## 4. Tech Stack & Versions (Pinned)

| Layer | Choice | Version (pinned) |
|---|---|---|
| Runtime | Node.js | 22.x LTS |
| Package manager | pnpm | 9.x |
| Monorepo | Turborepo | latest 2.x |
| Language | TypeScript | 5.6.x |
| Frontend | Next.js (App Router) | 15.x |
| UI kit | shadcn/ui + Tailwind CSS | Tailwind 4.x |
| Backend | Hono | 4.x |
| ORM | Drizzle + drizzle-kit | latest |
| Database | Postgres | 16 |
| Vector | pgvector | 0.7+ |
| Auth | Clerk | latest |
| Jobs | Inngest | latest |
| Errors | Sentry | latest (`@sentry/nextjs`, `@sentry/node`) |
| Product analytics | PostHog | latest (`posthog-js`, `posthog-node`) |
| Logs | Axiom | latest (`@axiomhq/js`, `pino` transport) |
| Secrets | Doppler | CLI latest |
| Testing | Vitest + Playwright | latest |
| FE hosting | Vercel | — |
| BE/DB hosting | Railway | — |

**Lockfile policy:** Commit `pnpm-lock.yaml`. Renovate bot opens grouped weekly PRs starting in P1.

---

## 5. Environments

| Env | URL pattern | Database | Branch / trigger | Auto-deploy |
|---|---|---|---|---|
| `local` | `localhost:3000` / `:3001` | Local Postgres (Docker) | — | — |
| `preview` | `pr-<n>-pulse.vercel.app` + ephemeral API | Shared `staging` Postgres (read-only friendly) | Per-PR | Yes |
| `staging` | `staging.pulse.app` / `api.staging.pulse.app` | Railway `pulse-db-staging` | `main` | Yes |
| `prod` | `pulse.app` / `api.pulse.app` | Railway `pulse-db-prod` | git tag `v*.*.*` | Yes (manual approval) |

**DB isolation:** Preview deploys reuse the staging DB but write to a per-PR schema (`pr_<num>`) created and dropped by CI. No preview ever touches prod.

---

## 6. Database — Schema, Migrations, pgvector

### 6.1 Initial migration (P0)
Only what's needed to prove the stack works end-to-end. The full schema (Article, Card, etc.) lands in P1/P2.

```sql
-- 0001_init.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "user" (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    text UNIQUE NOT NULL,
  email       text NOT NULL,
  timezone    text NOT NULL DEFAULT 'UTC',
  created_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

CREATE INDEX idx_user_clerk_id ON "user"(clerk_id);

-- pgvector smoke-test table (dropped in P2 once Article table exists)
CREATE TABLE _pgvector_smoke (
  id        serial PRIMARY KEY,
  embedding vector(1024)
);
CREATE INDEX ON _pgvector_smoke USING hnsw (embedding vector_cosine_ops);
```

### 6.2 Drizzle schema (`packages/db/schema/users.ts`)
```ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull(),
  timezone: text("timezone").notNull().default("UTC"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
```

### 6.3 Migration policy
- Migrations are forward-only. Rollbacks happen via a new migration, never by reverting.
- `pnpm db:generate` produces a SQL file from schema diff; engineer reviews & commits.
- Deploy step runs `pnpm db:migrate` **inside an advisory lock** (`SELECT pg_advisory_lock(4242)`) to prevent two deployers racing.
- On migration failure, the deploy job fails and the previous Railway service revision continues serving.

### 6.4 pgvector smoke test (acceptance)
```ts
// packages/db/src/__tests__/pgvector.test.ts
it("inserts and queries a vector", async () => {
  await db.execute(sql`INSERT INTO _pgvector_smoke (embedding) VALUES (${vec(1024, 0.1)})`);
  const rows = await db.execute(sql`
    SELECT id FROM _pgvector_smoke
    ORDER BY embedding <=> ${vec(1024, 0.1)} LIMIT 1
  `);
  expect(rows.length).toBe(1);
});
```

---

## 7. Authentication (Clerk) — P0 Setup

### 7.1 Scope in P0
- Clerk application provisioned with two instances: `staging` and `prod`.
- Sign-in / sign-up pages mounted at `/sign-in` and `/sign-up` (default Clerk components, no theming yet).
- Middleware in `apps/web/middleware.ts` protecting `/(app)/*` routes.
- Webhook receiver at `apps/api/src/routes/webhooks/clerk.ts` that:
  - Verifies signature via Clerk's `svix` header.
  - On `user.created`: inserts a row into `user` table (`clerk_id`, `email`, `timezone='UTC'`).
  - On `user.deleted`: soft-deletes by setting `deleted_at = now()`.

### 7.2 Out of scope in P0
- Onboarding flow (P1).
- OAuth providers beyond Clerk defaults (Google, GitHub enabled — no others).
- Custom Clerk theming (P4).
- Org / team support (P8+).

### 7.3 Webhook contract
```http
POST /webhooks/clerk
Headers: svix-id, svix-timestamp, svix-signature
Body: ClerkWebhookEvent
```
Returns `200 { received: true }` on success, `400` on signature failure (must not 500 — Clerk retries forever on 5xx).

---

## 8. Background Jobs (Inngest) — P0 Setup

### 8.1 Scope in P0
- Inngest account + signing key wired to `apps/api`.
- Single registered function as a smoke test: `pulse/healthcheck.scheduled` runs every 15 minutes, logs `"inngest alive"` to Axiom, and writes a row to a `pipeline_run` table (defined in P2 — until then, it just logs).
- Inngest dev server runs locally via `pnpm dlx inngest-cli dev` (added to `pnpm dev` orchestration).

### 8.2 Out of scope in P0
- Source crawlers, scoring, summarisation (P2/P3).

---

## 9. Observability

### 9.1 Sentry
| Project | Platform | Source maps | DSN env |
|---|---|---|---|
| `pulse-web` | `@sentry/nextjs` | Uploaded via `withSentryConfig` on Vercel build | `NEXT_PUBLIC_SENTRY_DSN_WEB` |
| `pulse-api` | `@sentry/node` | Uploaded via `sentry-cli` in CI | `SENTRY_DSN_API` |

- Releases tagged with git SHA. PR previews tagged `pr-<n>`.
- `tracesSampleRate: 0.1` in prod, `1.0` in staging.
- PII scrubbing: default Sentry rules + custom rule to drop `email` and `clerk_id` from breadcrumbs.

### 9.2 Axiom (logs)
- Single dataset `pulse-logs` with sub-datasets via `service` field (`web`, `api`, `inngest`).
- Pino logger configured in `packages/shared/src/logger.ts`; both apps import it.
- Required structured fields on every log: `service`, `env`, `commit`, `trace_id`, `user_id?`.
- PII redaction: `email`, `password`, `token`, `clerk_id`, anything matching `Bearer .*` — middleware before transport.

### 9.3 PostHog
- One project per env (`Pulse Staging`, `Pulse Prod`).
- `posthog-js` initialised in root layout with `autocapture: false`. Manual events only, defined in `packages/shared/src/analytics.ts`.
- P0 events: `page_view`, `landing_cta_click` (for the marketing shell).
- Feature flags: one demo flag `phase_0_smoke_test` to verify the SDK works end-to-end.

### 9.4 Uptime / Synthetic monitoring
- Use Better Stack (or PostHog's uptime monitor — checked at P0 kickoff for parity).
- Two checks: `GET https://pulse.app/` and `GET https://api.pulse.app/health`, every 5 min, page after 3 consecutive failures via PagerDuty (or Slack `@channel` if PD not yet provisioned).

---

## 10. CI/CD

### 10.1 `ci.yml` — runs on every PR and push to `main`
```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 8
    steps:
      - checkout
      - setup-pnpm (version 9)
      - setup-node (version 22)
      - cache turbo
      - pnpm install --frozen-lockfile
      - pnpm lint
      - pnpm typecheck
      - pnpm test -- --run
      - pnpm build
```
**Hard requirement:** wall-clock < 5 min on a clean cache; < 2 min on warm cache.

### 10.2 `release.yml` — runs on tag push `v*.*.*`
```yaml
jobs:
  approve:
    environment: production   # GitHub environment with required reviewer
    steps: [ noop ]
  deploy-api:
    needs: approve
    steps:
      - railway up --service pulse-api --environment production
  deploy-web:
    needs: approve
    steps:
      - vercel deploy --prod --token=$VERCEL_TOKEN
  smoke:
    needs: [deploy-api, deploy-web]
    steps:
      - curl -fsS https://api.pulse.app/health | jq -e '.ok == true'
      - curl -fsS https://pulse.app/ -o /dev/null
```

### 10.3 Rollback procedure (documented in `docs/runbooks/rollback.md`)
- **Web:** `vercel rollback <deployment-url>` — instant.
- **API:** Railway dashboard → service → "Redeploy previous" — ~60s.
- **DB migration regret:** forward-fix via new migration. Never `DROP COLUMN` in the same release as the code that stops using it (two-phase deploy).

### 10.4 Branch protection on `main`
- Require: passing CI, 1 approving review (waived for solo work via `CODEOWNERS` self-approve exception), linear history, signed commits.
- Block force-push.

---

## 11. Secrets & Environment Variables

### 11.1 Doppler structure
```
pulse/
├── dev          (developer-shared, low sensitivity)
├── staging      (synced to Vercel staging + Railway staging)
└── prod         (synced to Vercel prod + Railway prod, restricted access)
```

### 11.2 Required variables (validated by `packages/shared/src/env.ts` with zod)

| Var | Scope | Required at | Notes |
|---|---|---|---|
| `DATABASE_URL` | api, db | runtime | Railway-issued `postgres://` |
| `NEXT_PUBLIC_APP_URL` | web | build | e.g. `https://staging.pulse.app` |
| `CLERK_PUBLISHABLE_KEY` | web | build | `pk_test_*` / `pk_live_*` |
| `CLERK_SECRET_KEY` | web, api | runtime | `sk_*` |
| `CLERK_WEBHOOK_SECRET` | api | runtime | For svix verification |
| `INNGEST_EVENT_KEY` | api | runtime | |
| `INNGEST_SIGNING_KEY` | api | runtime | |
| `SENTRY_DSN_API` | api | runtime | |
| `NEXT_PUBLIC_SENTRY_DSN_WEB` | web | build | |
| `SENTRY_AUTH_TOKEN` | CI | build | Source-map upload |
| `AXIOM_TOKEN` | api, web | runtime | |
| `AXIOM_DATASET` | api, web | runtime | `pulse-logs` |
| `NEXT_PUBLIC_POSTHOG_KEY` | web | build | |
| `NEXT_PUBLIC_POSTHOG_HOST` | web | build | `https://app.posthog.com` |
| `POSTHOG_API_KEY` | api | runtime | Server-side events |

`.env.example` lists every variable with a placeholder. App startup throws with a readable error if any required var is missing or fails its zod schema.

---

## 12. Local Developer Experience

### 12.1 One-shot setup (target: < 5 min on a fresh machine with Node + pnpm + Docker)
```bash
git clone git@github.com:pulse/pulse.git && cd pulse
cp .env.example .env.local
doppler login && doppler setup --project pulse --config dev
docker compose up -d postgres        # local Postgres + pgvector
pnpm install
pnpm db:migrate
pnpm dev                              # web :3000, api :3001, inngest :8288
```

### 12.2 `docker-compose.yml`
```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: pulse
      POSTGRES_PASSWORD: pulse
      POSTGRES_DB: pulse
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes: { pgdata: {} }
```

### 12.3 Tooling
- **Husky** pre-commit hook: `lint-staged` runs Prettier + ESLint on staged files only.
- **commitlint** with conventional commits enforced on commit-msg hook.
- **VSCode workspace settings** committed: format-on-save, ESLint as default formatter for TS, Tailwind IntelliSense.

---

## 13. Marketing Landing Shell (Phase 0 only deliverable that's user-visible)

Single static page at `pulse.app` to (a) prove the deploy pipeline ships visible artifacts and (b) start collecting waitlist signups.

**Sections:**
1. Hero: tagline ("Your personal research analyst that never sleeps") + email capture
2. Three-card "what is Pulse" explainer (placeholder copy)
3. Footer: privacy, terms, GitHub link

**Implementation:**
- App Router route `app/(marketing)/page.tsx`, fully RSC, no client JS beyond the email form.
- Email submissions POST to `apps/api/src/routes/waitlist.ts` → inserts into `waitlist` table (single migration adds it: `id, email, source, created_at`).
- PostHog event `landing_cta_click` fired on submit.

This is intentionally crude. Visual design lands in P4. **No copy claims about features that don't exist yet** — it's a "coming soon" page with an email field.

---

## 14. Test Plan (P0)

### 14.1 Unit (Vitest)
| Package | Coverage target | Mandatory tests |
|---|---|---|
| `packages/shared/env` | — | Zod schema rejects missing/malformed vars |
| `packages/db` | — | pgvector smoke insert + query (uses Testcontainers) |
| `apps/api` | — | `/health` happy path; clerk webhook signature rejection |

### 14.2 Integration / E2E (Playwright)
- Single test: open landing page on local dev server, assert headline visible, submit email, assert success state.

### 14.3 Manual acceptance checklist (run before signoff)
Documented in `docs/phase-0-signoff.md`; mirrors §1.3 above. Every box is ticked by the lead engineer with a screenshot or curl output.

---

## 15. Day-by-Day Execution Plan

| Day | Focus | Deliverable |
|---|---|---|
| **Mon** | Repo + tooling | Turborepo + pnpm workspaces, TS configs, ESLint/Prettier, Husky, ADRs 0001–0005 committed, `.env.example` |
| **Tue** | DB + apps scaffold | Postgres provisioned (Railway dev/staging/prod), pgvector enabled, Drizzle schema + first migration, Hono `apps/api` with `/health`, Next.js `apps/web` with shadcn baseline |
| **Wed** | Auth + jobs | Clerk integrated, sign-in/sign-up working locally and on a first Vercel preview, Clerk webhook → user insert, Inngest registered with smoke function |
| **Thu** | Observability + secrets | Sentry on FE+BE with releases, Axiom logger, PostHog FE+BE, Doppler synced to Vercel + Railway, uptime monitor configured |
| **Fri** | CI/CD + landing + signoff | GitHub Actions CI < 5min, release workflow with manual approval, rollback runbook, marketing landing shell deployed to staging then prod, full acceptance checklist green, signoff doc filed |

Buffer: any slippage is absorbed by deferring the marketing landing shell to early P1 (it is not on the critical path for P1 work).

---

## 16. Risks & Mitigations (Phase-Specific)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| P0-1 | Railway Postgres provisioning hits a quota or region issue | Low | High (blocks everything) | Have Neon as named fallback; provision both on Day 1, pick one |
| P0-2 | Clerk webhook signature verification flaky in local dev | Medium | Low | Use `svix-cli` to replay events locally; document in runbook |
| P0-3 | Source map upload fails silently → unreadable Sentry errors | Medium | Medium | CI step asserts `sentry-cli releases files <release> list` returns > 0 maps |
| P0-4 | Doppler outage blocks deploys | Low | Medium | Mirror prod secrets to GitHub Actions env as cold backup, manually rotated quarterly |
| P0-5 | Turborepo cache poisoning across PRs | Low | Medium | Scope remote cache to branch; no remote cache writes from forks |
| P0-6 | Tech-choice regret (e.g. Drizzle limitation) discovered in P3 | Medium | Medium | Each ADR explicitly lists escape hatch and trigger-to-revisit conditions |

---

## 17. Out of Scope (Explicit)

These items are **not** built in P0, even if tempting:
- Any product UI beyond the marketing landing shell.
- Email sending infrastructure (Resend / Postmark) — P6.
- Stripe / billing — P8.
- AI clients beyond an empty `packages/ai` shell with placeholder exports.
- i18n / localisation.
- Mobile / PWA configuration beyond Next.js defaults.
- A/B testing framework (the PostHog flag in §9.3 is a smoke test, not a framework).
- Custom design tokens / theming (P4).
- Cloudflare or any third CDN (per ADR-0003).
- `dependency-cruiser` enforcement (added in P1).

---

## 18. Phase Exit & Handoff

On completion, the lead engineer:
1. Tags `phase-0` on the merge commit that lands the final acceptance item.
2. Files `docs/phase-0-signoff.md` with the §1.3 checklist fully ticked, plus links to the staging URL, the first prod deploy, and a Sentry test-event link.
3. Opens P1 kickoff doc with the inherited stack diagram and any caveats discovered during P0 (e.g. "Inngest local UI runs on :8288, document this for P2").
4. Schedules a 30-min walk-through of the repo, runbooks, and on-call rotation for any incoming engineers.

P1 (Onboarding) can begin the next morning with **no infrastructure work on its critical path**.

---

*End of Phase 0 PRD v1.0.*
