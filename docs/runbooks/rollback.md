# Rollback Runbook

## Web
```bash
vercel rollback <previous-deployment-url>
```
Instant. No data considerations.

## API
Railway dashboard → service → "Redeploy previous". Around 60 s.

## Database migration regret
Forward-fix via a new migration. **Never** `DROP COLUMN` in the same release that stops using it — stage the removal across two releases.

## Runtime incident
1. Announce in #incidents (Slack).
2. Roll back the most recent deploy first (web or api, whichever changed).
3. Open a post-mortem doc under `docs/postmortems/YYYY-MM-DD-<slug>.md` within 24 hours.
