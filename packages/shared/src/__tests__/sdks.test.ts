import { describe, expect, it, vi } from "vitest";
import { makePostHogAdapter } from "../sdks/posthog.js";
import { makeSentryAdapter } from "../sdks/sentry.js";

describe("Sentry adapter", () => {
  it("noop in local without DSN", () => {
    const a = makeSentryAdapter({ strict: false });
    expect(() => a.captureException(new Error("x"))).not.toThrow();
  });
  it("strict without DSN throws", () => {
    expect(() => makeSentryAdapter({ strict: true })).toThrow(/SENTRY_DSN/);
  });
});

describe("PostHog adapter", () => {
  it("noop in local without key", () => {
    const a = makePostHogAdapter({ strict: false });
    expect(() => a.capture("evt")).not.toThrow();
  });
  it("strict without key throws", () => {
    expect(() => makePostHogAdapter({ strict: true })).toThrow(/POSTHOG/);
  });
  it("calls out to emit when a sink is provided", () => {
    const sink = vi.fn();
    const a = makePostHogAdapter({ strict: false, apiKey: "phc_xyz", sink });
    a.capture("evt", { a: 1 });
    expect(sink).toHaveBeenCalledWith("evt", { a: 1 });
  });
});
