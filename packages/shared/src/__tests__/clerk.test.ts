import { describe, expect, it } from "vitest";
import { makeClerkAdapter } from "../sdks/clerk.js";

describe("Clerk adapter", () => {
  it("returns a stub user in local mode with no key", () => {
    const a = makeClerkAdapter({ strict: false });
    expect(a.getAuth().userId).toBe("dev-user-001");
    expect(a.verifyWebhook("", new Headers())).toEqual({ ok: true, skipped: true });
  });

  it("throws in strict mode without a key", () => {
    expect(() => makeClerkAdapter({ strict: true })).toThrow(/CLERK_SECRET_KEY/);
  });
});
