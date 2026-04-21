# ADR-0005 — Branching and feature flags: Trunk-based with PostHog flags

Status: Accepted (2026-04-21)

## Decision
- Single long-lived branch (`main`).
- Short-lived feature branches (≤ 3 days).
- User-visible work in progress guarded by PostHog feature flags.
- Phase-tagged releases via git tags (`phase-0`, `phase-1`, …) plus semver tags (`v0.1.0`) for prod deploys.

## Rationale
Trunk-based avoids long-lived merge hell across 9 phases. PostHog is already in the stack; no extra tooling.
