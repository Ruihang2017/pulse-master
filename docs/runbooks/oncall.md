# On-call Runbook (Phase 0 baseline)

## Alerting sources
- **PagerDuty / Slack** — fired by synthetic uptime (Better Stack or PostHog uptime) after 3 consecutive failures of:
  - `GET https://pulse.app/`
  - `GET https://api.pulse.app/health`
- **Sentry** — `pulse-web` and `pulse-api` projects; severity → page rules tuned in Phase 1.

## First 5 minutes
1. Acknowledge the page.
2. Check `https://status.vercel.com` and `https://railway.app/status`.
3. Check `GET /health` yourself — is it down for everyone or just the monitor?
4. Check Sentry for a release-tagged spike matching the incident window.

## Escalation
- If unclear within 15 min, follow `docs/runbooks/rollback.md` and roll back the most recent deploy.
- Always roll back before debugging. Forward-fixes happen after the page clears.

## Contacts (Phase 0 placeholder)
- Primary on-call: you.
- Secondary on-call: TBA when the team grows.
