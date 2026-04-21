# ADR-0001 — Monorepo tooling: Turborepo + pnpm workspaces

Status: Accepted (2026-04-21)

## Decision
Use `pnpm` workspaces for dependency hoisting and Turborepo for task orchestration and remote caching.

## Rejected alternatives
- **Nx** — over-tooled for a 5-package repo; opinionated generators add cognitive load.
- **pnpm-only (no Turborepo)** — no task-graph caching; CI gets slow as soon as we add packages.

## Escape hatch
Turborepo is non-invasive: reads `turbo.json` and `package.json` scripts. Removing it is a one-PR change.
