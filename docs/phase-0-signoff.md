# Phase 0 Signoff

> Split into **Session checklist** (ticked locally) and **Cloud bring-up checklist** (tick as each provider is provisioned). Reference: `docs/prd/Pulse-Phase-0-PRD.md` §1.3.

## Session checklist (local walking skeleton)

- [x] 1. `pnpm install && pnpm db:migrate && pnpm dev` brings up `apps/web` on `:3000` and `apps/api` on `:3001` from a clean clone in < 5 minutes.
- [x] 2. `pnpm test`, `pnpm lint`, `pnpm typecheck` all pass on a clean clone.
- [x] 8. `pgvector` extension is enabled; the insert + cosine-query Testcontainers test passes when Docker is available.
- [x] 14. `README.md` documents one-shot setup and links to runbooks for deploy / rollback / on-call.
- [x] 15. Five P0 open questions resolved in `docs/decisions/000{1..5}-*.md`; ADR-0006 added per execution spec §3.5.

## Cloud bring-up checklist

Each item below unlocks when its external service is provisioned. Annotation shows what to do.

- [ ] 3. **PR CI < 5 min posts Vercel preview URL.**
  1. Create GitHub repo; push `main`.
  2. Install the Vercel GitHub app, link the repo to a new Vercel project targeting `apps/web`.
  3. Open a PR — Vercel posts a preview comment automatically.

- [ ] 4. **Merge to `main` auto-deploys to Vercel staging + Railway staging.**
  1. Create Railway project "pulse"; add a Postgres service and an `apps/api` service.
  2. Connect Railway service to the GitHub repo, branch = `main`.
  3. In Vercel, set the default production branch = `main` + env alias `staging.pulse.app`.
  4. Push a commit; observe both deploys.

- [ ] 5. **Tag `v*.*.*` deploys to prod with manual approval.**
  1. In GitHub → Settings → Environments → create `production` with a required reviewer.
  2. Add secrets: `VERCEL_TOKEN`, `RAILWAY_TOKEN`.
  3. Replace the placeholder `run:` lines in `.github/workflows/release.yml` with real Vercel/Railway CLI commands.
  4. `git tag v0.1.0 && git push --tags`; approve the release.

- [ ] 6. **Clerk sign-up + sign-in works end-to-end on staging.**
  1. Create Clerk project; add two instances (`staging`, `prod`).
  2. Copy staging `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` into Doppler → staging config (or Vercel env).
  3. In Clerk dashboard, point webhook to `https://api.staging.pulse.app/webhooks/clerk`.
  4. Sign up with a test email on `https://staging.pulse.app/sign-up`; confirm a row appears in `user` table.

- [ ] 7. **`GET /health` on the API returns `{ ok: true, db: "ok", commit: "<sha>" }` from staging.**
  - Automatic once Task 4 and Clerk provisioning are done.

- [ ] 9. **Manually-thrown error on staging lands in Sentry with source maps.**
  1. Create Sentry projects `pulse-web` and `pulse-api`.
  2. Copy DSNs to Doppler → staging + prod.
  3. Add `SENTRY_AUTH_TOKEN` as a GitHub Actions secret for source-map upload.
  4. Throw a test error via a temporary `/debug/error` route; confirm it appears in Sentry with the release SHA.

- [ ] 10. **PostHog receives a `page_view` event from staging landing.**
  1. Create PostHog projects `Pulse Staging`, `Pulse Prod`.
  2. Copy `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to env.
  3. Load the staging landing page; confirm event appears in PostHog.

- [ ] 11. **Axiom receives structured JSON logs from `apps/api` with `trace_id`.**
  1. Create Axiom dataset `pulse-logs`.
  2. Set `AXIOM_TOKEN`, `AXIOM_DATASET` in Doppler → staging + prod.
  3. Hit `/health` on staging; confirm log appears in Axiom with `service=api`, `env=staging`, `commit=<sha>`.

- [ ] 12. **Synthetic uptime check configured, pages on 3 consecutive failures.**
  1. Create Better Stack (or PostHog uptime) account.
  2. Add monitors for `https://pulse.app/` and `https://api.pulse.app/health`, 5-minute interval.
  3. Wire PagerDuty or Slack `@channel` escalation at 3 failures.

- [ ] 13. **Doppler is source of truth for all secrets.**
  1. Create Doppler project `pulse` with configs `dev`, `staging`, `prod`.
  2. Use Doppler ↔ Vercel integration to sync `staging` and `prod` web envs.
  3. Use Doppler ↔ Railway integration to sync `staging` and `prod` api envs.
  4. Rotate any temporary secrets (from items 6, 9, 10, 11) through Doppler.

## Sign-off

- Session checklist completed by: _______________________  on _______________________.
- Cloud bring-up completed by: _______________________  on _______________________.
