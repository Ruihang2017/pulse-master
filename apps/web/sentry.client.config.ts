import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN_WEB;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_PULSE_ENV ?? "local",
    tracesSampleRate: (process.env.NEXT_PUBLIC_PULSE_ENV ?? "local") === "prod" ? 0.1 : 1.0,
  });
}
