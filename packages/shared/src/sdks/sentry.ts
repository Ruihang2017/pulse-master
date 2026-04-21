export interface SentryAdapter {
  captureException: (err: unknown, context?: Record<string, unknown>) => void;
}

export interface SentryAdapterOpts {
  dsn?: string;
  strict: boolean;
  release?: string;
  env?: string;
  tracesSampleRate?: number;
}

export function makeSentryAdapter(opts: SentryAdapterOpts): SentryAdapter {
  if (!opts.dsn) {
    if (opts.strict) throw new Error("SENTRY_DSN is required in staging/prod");
    return { captureException: (err) => console.error("[sentry:noop]", err) };
  }
  return {
    captureException: (err, context) => {
      console.error("[sentry:todo-real-init]", { err, context, release: opts.release });
    },
  };
}
