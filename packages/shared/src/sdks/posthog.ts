export interface PostHogAdapter {
  capture: (event: string, props?: Record<string, unknown>) => void;
}

export function makePostHogAdapter(opts: { apiKey?: string; strict: boolean }): PostHogAdapter {
  if (opts.apiKey) {
    return { capture: (e, p) => console.log("[posthog:real-in-pass-2]", e, p) };
  }
  if (opts.strict) {
    throw new Error("POSTHOG_API_KEY is required in staging/prod");
  }
  return { capture: () => undefined };
}
