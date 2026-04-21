import { describe, expect, it } from "vitest";
import { redactPii } from "../logger.js";

describe("redactPii", () => {
  it("masks email, clerk_id, password, token, and Bearer tokens", () => {
    const redacted = redactPii({
      email: "u@example.com",
      clerk_id: "user_abc",
      password: "hunter2",
      token: "t-123",
      msg: "header: Bearer xyz",
      nested: { email: "nested@example.com" },
    });
    expect(redacted.email).toBe("[REDACTED]");
    expect(redacted.clerk_id).toBe("[REDACTED]");
    expect(redacted.password).toBe("[REDACTED]");
    expect(redacted.token).toBe("[REDACTED]");
    expect(redacted.msg).toMatch(/Bearer \[REDACTED\]/);
    expect((redacted.nested as { email: string }).email).toBe("[REDACTED]");
  });
});
