import { describe, expect, it } from "vitest";
import { user } from "../schema/users.js";
import { waitlist } from "../schema/waitlist.js";

describe("user schema", () => {
  it("has the PRD §6.2 columns", () => {
    const cols = Object.keys(user);
    expect(cols).toEqual(
      expect.arrayContaining(["id", "clerkId", "email", "timezone", "createdAt", "deletedAt"]),
    );
  });
});

describe("waitlist schema", () => {
  it("has the PRD §13 columns", () => {
    const cols = Object.keys(waitlist);
    expect(cols).toEqual(expect.arrayContaining(["id", "email", "source", "createdAt"]));
  });
});
