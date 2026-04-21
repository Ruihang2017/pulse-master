# Deploy Runbook

## Staging (automatic)
A merge to `main` triggers `.github/workflows/ci.yml`. When cloud is provisioned, this also triggers deploys:
- Vercel staging deploy for `apps/web` via the Vercel GitHub integration.
- Railway staging deploy for `apps/api` via the Railway GitHub integration.

Each deploy runs `pnpm db:migrate` against its target DB inside an advisory lock (see `packages/db/src/migrate.ts`).

## Production (tag-triggered, manual approval)
1. Merge changes to `main` and wait for CI green.
2. `git tag v0.x.y && git push --tags`.
3. `.github/workflows/release.yml` runs. The `approve` job blocks on the GitHub `production` environment reviewer.
4. On approval, `deploy-api` and `deploy-web` run in parallel, followed by the `smoke` job that curls `/health` and `/`.

## Known gotchas
- Never `DROP COLUMN` in the same release as the code that stops using it. Use a two-phase deploy.
- Railway advisory lock is `pg_advisory_lock(4242)`; if a deploy hangs, check for stuck locks before retrying.
