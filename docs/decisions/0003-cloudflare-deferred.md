# ADR-0003 — Cloudflare WAF/CDN: Defer

Status: Accepted (2026-04-21)

## Decision
No Cloudflare in Phase 0. Vercel's edge + Railway's TLS termination is sufficient for MVP.

## Trigger to revisit
First credible scraping/abuse incident, first public viral moment (Phase 7), or 10K MAU.

## Rationale
Adds a DNS hop, an account, a cache invalidation surface, and another secret rotation target. Premature in week 1.
