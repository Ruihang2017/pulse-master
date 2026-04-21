export type PostHogEvent = string;
export type PostHogProps = Record<string, unknown>;

export interface PostHogAdapter {
  capture: (event: PostHogEvent, props?: PostHogProps) => void;
  isFeatureEnabled: (flag: string) => boolean;
}

export interface PostHogAdapterOpts {
  apiKey?: string;
  strict: boolean;
  sink?: (event: PostHogEvent, props?: PostHogProps) => void;
}

export function makePostHogAdapter(opts: PostHogAdapterOpts): PostHogAdapter {
  if (!opts.apiKey) {
    if (opts.strict) throw new Error("POSTHOG_API_KEY is required in staging/prod");
    return {
      capture: () => undefined,
      isFeatureEnabled: () => false,
    };
  }
  const emit = opts.sink ?? ((event, props) => console.log("[posthog]", event, props));
  return {
    capture: (event, props) => emit(event, props),
    isFeatureEnabled: () => false,
  };
}
