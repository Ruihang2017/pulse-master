# ADR-0004 — Test coverage policy for Phase 0: No threshold; required smoke tests only

Status: Accepted (2026-04-21)

## Decision
No coverage % gate in P0 or P1. CI requires `lint`, `typecheck`, `test` to pass — but the test suite is small and intentional.

## Required smoke tests
- `apps/api`: `/health` returns 200 and reports DB connectivity.
- `packages/db`: Drizzle query returns expected shape against a real Postgres (Testcontainers).
- `apps/web`: landing page renders without errors (Playwright smoke).

## Trigger to revisit
End of P3 — AI pipeline lands and untested code gets expensive.
