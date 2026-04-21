import * as Sentry from "@sentry/node";

let initialised = false;

export function initSentry() {
  if (initialised) return;
  initialised = true;
  const dsn = process.env.SENTRY_DSN_API;
  if (!dsn) return;
  Sentry.init({
    dsn,
    release: process.env.PULSE_COMMIT ?? "dev",
    environment: process.env.PULSE_ENV ?? "local",
    tracesSampleRate: process.env.PULSE_ENV === "prod" ? 0.1 : 1.0,
    beforeBreadcrumb: (crumb) => {
      if (crumb.data && typeof crumb.data === "object") {
        for (const key of ["email", "clerk_id", "clerkId"]) {
          if (key in crumb.data) (crumb.data as Record<string, unknown>)[key] = "[REDACTED]";
        }
      }
      return crumb;
    },
  });
}

export { Sentry };
