export interface SentryAdapter {
  captureException: (err: unknown) => void;
}

export function makeSentryAdapter(opts: { dsn?: string; strict: boolean }): SentryAdapter {
  if (opts.dsn) {
    return { captureException: (err) => console.error("[sentry:real-in-pass-2]", err) };
  }
  if (opts.strict) {
    throw new Error("SENTRY DSN is required in staging/prod");
  }
  return { captureException: (err) => console.error("[sentry:noop]", err) };
}
