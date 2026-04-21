# ADR-0006 — Env validation and SDK graceful degradation

Status: Accepted (2026-04-21)

## Context
The Phase 0 PRD §11 requires all listed env vars to cause startup errors if missing or malformed. Applied uniformly, this prevents `pnpm dev` from working locally until developers hold real Clerk, Sentry, PostHog, and Axiom keys — contradicting the §1.3 DoD of "clone → running in 5 min."

## Decision
- `packages/shared/src/env.ts` exports tiered zod schemas gated by `PULSE_ENV`:
  - `local` → placeholders accepted; SDK-specific keys optional.
  - `staging` / `prod` → all PRD §11.2 required vars enforced; startup throws on miss.
- SDK adapters in `packages/shared/src/sdks/` (Clerk, Sentry, PostHog) degrade to no-op behaviour when keys are absent *and* `PULSE_ENV=local`; they throw otherwise.
- Node/pnpm version drift: dev box runs Node 24 / pnpm 10 while CI pins Node 22 / pnpm 9. Behaviour-compatible today. Trigger to align: first observed incompatibility, or routine maintenance.

## Escape hatch
Adapters are single modules — swapping stub for real SDK is a module substitution, not a rewrite.
