# Phase 0 — Execution Design

> Execution-scoped addendum to `docs/prd/Pulse-Phase-0-PRD.md`. Captures decisions, deviations, and the two-pass implementation plan for executing Phase 0 in a single solo session against an empty repository, without cloud accounts provisioned.

| Field | Value |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Ready for implementation plan |
| **Date** | 2026-04-21 |
| **Scope** | Single-session solo execution of Pulse Phase 0 |
| **Supersedes** | Nothing. Extends `docs/prd/Pulse-Phase-0-PRD.md`. Where they conflict, this document wins for this session only. |

---

## 1. Why this document exists

The Phase 0 PRD is implementation-ready but assumes a full working week with cloud accounts (Vercel, Railway, Clerk, Sentry, PostHog, Axiom, Doppler, a registered domain, a GitHub organisation) already available. This session is:

- **Solo**, in a single sitting.
- **Local-only.** No cloud provider accounts exist yet.
- **Empty repository.** Nothing to integrate with; everything is scaffolded from zero.
- **Node 24 / pnpm 10** on the developer box; PRD pins Node 22 / pnpm 9.
- **Docker Desktop WSL integration currently off** on the developer box.

A faithful literal execution of the PRD is therefore not possible. This document records the deviations, scopes the session's definition of done, and hands a clear implementation order to the plan that follows.

## 2. Execution mode

**Mode A — Local-only walking skeleton.** The monorepo, all application code, Docker-backed Postgres+pgvector, Drizzle schema + migration, Hono `/health`, Next.js landing shell, observability SDKs, Clerk/Inngest integrations, CI/release YAML, ADRs, runbooks, and signoff doc are all produced. Everything runs locally end-to-end via `pnpm dev`. Cloud provisioning (Vercel, Railway, Clerk, Sentry, PostHog, Axiom, Doppler, uptime monitor, domain) is deferred to a documented cloud-bringup checklist.

## 3. Deviations from the Phase 0 PRD

Four deltas. Everything else is built as specified in the PRD.

### 3.1 Tiered env validation (delta to PRD §11)

The PRD says *"App startup throws with a readable error if any required var is missing."* Applied uniformly, this prevents `pnpm dev` from working until you hold real Clerk/Sentry/PostHog/Axiom keys — which contradicts the §1.3 DoD of "clone → running in 5 min".

Resolution: `packages/shared/src/env.ts` exports three zod schemas — `sharedEnv`, `webEnv`, `apiEnv`. Each is evaluated against a `STRICTNESS` derived from `NODE_ENV` + `PULSE_ENV`:

- `local` → placeholder values accepted; SDK-specific keys optional.
- `staging` and `prod` → all PRD §11.2 required vars enforced; startup throws on any miss.

### 3.2 Graceful SDK degradation in local dev (delta to PRD §7, §8, §9)

External SDKs are wrapped in thin adapters in `packages/shared/src/sdks/`. Each adapter's behaviour is keyed to presence of its credential and the current strictness:

| SDK | Key present | Key absent, `local` | Key absent, `staging`/`prod` |
|---|---|---|---|
| Clerk | Real SDK | Dev-stub user `dev-user-001` | Throw at startup |
| Sentry | Real SDK | `console.error` | Throw at startup |
| PostHog | Real SDK | Drop events, log at debug | Throw at startup |
| Axiom (logs) | Pino → Axiom | Pino → stdout (pretty) | Throw at startup |

Adapter boundary is explicit so the swap between stub and real SDK is a single module substitution.

Inngest is not keyed the same way. The `inngest-cli dev` server runs locally regardless — it needs no signing key. In staging and prod, `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` are required at runtime; missing either throws at startup per the general env-validation rule in §3.1.

### 3.3 Docker prerequisite, not auto-start (delta to PRD §12.1)

The PRD's one-shot setup assumes Docker is available. The README's prerequisites preamble makes this explicit. If `docker compose` is not reachable, `pnpm db:migrate` and the pgvector smoke test fail with a readable error pointing to Docker Desktop's WSL integration setting.

### 3.4 Session-scoped signoff (delta to PRD §1.3)

Of the 15 PRD acceptance items, 5 can be ticked truthfully in a local session:

- **1** — `pnpm install && pnpm db:migrate && pnpm dev` boots stack in < 5 min.
- **2** — `pnpm test`, `pnpm lint`, `pnpm typecheck` all pass.
- **8** — pgvector extension enabled; insert + cosine query succeeds.
- **14** — README documents one-shot setup + runbook links.
- **15** — Five ADRs resolving the PRD's open questions, plus ADR-0006 from §3.5 (six total).

The remaining 10 items (CI preview deploy, staging auto-deploy, prod tag deploy, Clerk end-to-end on staging, `/health` on staging, Sentry/PostHog/Axiom ingestion, synthetic uptime check, Doppler) require cloud accounts. `docs/phase-0-signoff.md` lands as a split document: **Session checklist** (ticked) + **Cloud bring-up checklist** (unticked, each item annotated with exact provisioning steps).

### 3.5 New ADR

ADR-0006 — *Env validation & SDK graceful degradation* — codifies §3.1 and §3.2. This is in addition to the five ADRs listed in PRD §2.

## 4. Version pins

- CI YAML and release YAML target **Node 22 / pnpm 9** per the PRD.
- `package.json` `engines` declares `"node": ">=22"`, `"pnpm": ">=9"`.
- Local dev today runs on **Node 24 / pnpm 10**. Behaviour-compatible with the pinned versions for everything used in Phase 0 (Turborepo, Next 15, Hono 4, Drizzle, Vitest). ADR-0006 notes the drift and the trigger to align (any observable incompatibility, or routine maintenance).

## 5. Implementation order — two-pass

### 5.1 Pass 1 — Thin-and-real skeleton

Every file the PRD references exists at the minimum needed to boot. Every build command passes. Every dev process starts.

**Tooling layer**
- `pnpm-workspace.yaml`, `turbo.json`, root `package.json` with the scripts from PRD §3.3.
- `.gitignore`, `.nvmrc` (22), `.prettierrc`, `.eslintrc.cjs`, `tsconfig.base.json`.
- Husky pre-commit + commit-msg hooks wired to `lint-staged` + `commitlint`.
- `.env.example`, `.env.local` (with stub values matching §3.1).
- `docker-compose.yml` (pgvector:pg16 image as PRD §12.2).

**Package scaffolds**
- `packages/shared` — `env.ts` (tiered zod), `logger.ts` (pino with stdout fallback), `sdks/` folder with all five stub adapters, `analytics.ts` skeleton.
- `packages/db` — Drizzle config, empty `schema/index.ts`, `client.ts` with lazy init, `migrate.ts` that no-ops cleanly if `DATABASE_URL` missing.
- `packages/ai` — placeholder exports; Anthropic/Voyage/Replicate clients unimplemented.

**Apps**
- `apps/web` — Next.js 15 App Router, `app/layout.tsx`, `app/(marketing)/page.tsx` with placeholder text, `app/api/health/route.ts`, `middleware.ts` scaffold, `instrumentation.ts` scaffold.
- `apps/api` — Hono `src/index.ts`, `routes/health.ts` returning `{ok: true, db: "pending", commit: "<sha>"}`, `middleware/` folder with error + logging stubs, empty `inngest/` registry.

**CI**
- `.github/workflows/ci.yml` — install + lint + typecheck + test + build.
- `.github/workflows/release.yml` — tag-triggered, manual-approval gate, placeholder secret refs.

**Pass 1 exit gate**
- `pnpm install` clean.
- `pnpm typecheck` green.
- `pnpm lint` green.
- `pnpm build` green (Next + Hono both build).
- `pnpm dev` starts web, api, and inngest dev server; no crashes in the first 60 s.

### 5.2 Pass 2 — Thicken to PRD spec

Each scaffolded piece receives its real content.

**Database**
- `packages/db/schema/users.ts` per PRD §6.2.
- `packages/db/schema/waitlist.ts` — `id, email, source, created_at` per PRD §13.
- Two migrations:
  - `0001_init.sql` per PRD §6.1 — `pgcrypto` + `vector` extensions, `user` table, `_pgvector_smoke` table with hnsw index.
  - `0002_waitlist.sql` — `waitlist` table. Kept separate so the marketing landing shell is a distinct migration step and can be deferred per PRD §15's buffer note.
- Migration runner acquires advisory lock `pg_advisory_lock(4242)` per PRD §6.3.
- pgvector smoke test per PRD §6.4, using Testcontainers. Skipped with printed reason if Docker absent.

**API routes**
- `/health` wired to real DB ping; reports `db: "ok"` on success, `"down"` on failure, plus git SHA from `VERCEL_GIT_COMMIT_SHA` or `git rev-parse HEAD`.
- `routes/webhooks/clerk.ts` — svix signature verification, `user.created` → insert, `user.deleted` → soft delete (`deleted_at = now()`). Returns 200 on success, 400 on signature failure, never 500.
- `routes/waitlist.ts` — POST with email, inserts into `waitlist`, fires server-side PostHog `landing_cta_click` event.

**Auth (Clerk)**
- Middleware protecting `/(app)/*`.
- Sign-in at `/sign-in`, sign-up at `/sign-up` (default Clerk components).
- Clerk webhook receiver mounted on the api.

**Jobs (Inngest)**
- `pulse/healthcheck.scheduled` cron (every 15 min) — logs `"inngest alive"` through the Axiom adapter.
- Inngest dev server added to `pnpm dev` via `inngest-cli dev`.

**Landing shell** (PRD §13)
- Hero (tagline + email capture), three-card explainer, footer.
- Server-component-only except the email form, which is a minimal client island.
- PostHog `page_view` on mount; `landing_cta_click` on submit.

**Observability**
- Sentry init in `apps/web/instrumentation.ts` and `apps/api/src/index.ts`; release = git SHA; `tracesSampleRate` 1.0 in staging / 0.1 in prod; PII scrub rules for `email`, `clerk_id`.
- Axiom pino transport in `packages/shared/src/logger.ts`; required fields `service`, `env`, `commit`, `trace_id`, `user_id?`; PII redaction before transport.
- PostHog — `posthog-js` initialised in root layout with `autocapture: false`. Events `page_view`, `landing_cta_click`. Feature flag `phase_0_smoke_test` referenced (no-op locally).

**Documentation**
- `docs/decisions/0001-monorepo.md` through `0006-env-validation.md`.
- `docs/runbooks/deploy.md`, `rollback.md`, `oncall.md`.
- `README.md` — one-shot setup, prerequisites, links to runbooks.
- `docs/phase-0-signoff.md` — split Session + Cloud bring-up checklists.

**Pass 2 exit gate**
- `pnpm test` green (with documented skips).
- Signoff doc filed.
- Clean `git log` — logical commits per layer.

## 6. Session acceptance

Done when all of the following hold:

1. `pnpm install` clean on the developer machine.
2. `pnpm typecheck`, `pnpm lint`, `pnpm build` green.
3. `pnpm test` green (Docker-dependent and Playwright-dependent tests skip with printed reason if tooling absent).
4. `pnpm dev` boots `apps/web` on :3000, `apps/api` on :3001, Inngest dev server on :8288 with no credentials.
5. `docs/phase-0-signoff.md` exists with Session checklist (items 1, 2, 8, 14, 15 from PRD §1.3) ticked, and Cloud bring-up checklist annotated.
6. `docs/decisions/000{1..6}-*.md` all committed.
7. `docs/runbooks/{deploy,rollback,oncall}.md` all committed.
8. Git history on `main` is a sequence of logical commits, not one mega-commit.

## 7. Items explicitly deferred to cloud bring-up

Each becomes a ticked box in the Cloud bring-up checklist when provisioned:

| PRD §1.3 item | Blocker |
|---|---|
| 3 — PR CI < 5 min + Vercel preview | GitHub remote + Vercel project |
| 4 — Merge to `main` auto-deploys staging | Vercel + Railway staging |
| 5 — Tag `v*` deploys prod with approval | Vercel + Railway prod + GitHub environment |
| 6 — Clerk sign-up end-to-end on staging | Clerk staging instance |
| 7 — `/health` on staging reports ok | Railway staging API |
| 9 — Sentry receives test error on staging | Sentry project |
| 10 — PostHog `page_view` from staging | PostHog project |
| 11 — Axiom structured logs with `trace_id` | Axiom dataset |
| 12 — Synthetic uptime check + page on 3 fails | Better Stack or equivalent |
| 13 — Doppler is source of truth | Doppler project + sync to Vercel/Railway |

## 8. Risks specific to this execution

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| S-1 | `pnpm install` times out on slow network | Med | High | One retry, then surface; no workaround inside session |
| S-2 | Next 15 + Tailwind 4 + shadcn version churn | Med | Med | Pin exact known-good versions; shadcn baseline only — no custom tokens |
| S-3 | Docker integration never enabled → pgvector test skipped | Med | Low | Skip-gate, not fail. Recorded in signoff. Boot gate does not depend on DB. |
| S-4 | Clerk dev-stub leaks behaviour differences into P1 work | Low | Med | Stub returns fixed fake user; boundary documented in ADR-0006 |
| S-5 | `pnpm dev` three-process output is noisy | Low | Low | Labelled Turborepo output; fall back to `dev:web` / `dev:api` scripts |
| S-6 | Node 24 locally vs. Node 22 in CI YAML diverges silently | Low | Med | ADR-0006 notes drift; CI remains authoritative |

## 9. Out of scope for this session

- Any cloud provisioning. Not Vercel, Railway, Clerk, Sentry, PostHog, Axiom, Doppler, domain, uptime monitor.
- Any P1+ product surface (onboarding, feed, cards).
- Renovate / dependabot (PRD §4 says P1).
- Dependency-cruiser enforcement (PRD §17).
- CI performance tuning past the PRD's < 5 min budget (YAML will be correct; wall-clock is measurable only once the remote exists).

## 10. Next step

Hand this document to `superpowers:writing-plans` to produce a step-by-step implementation plan keyed to the two-pass structure above.
