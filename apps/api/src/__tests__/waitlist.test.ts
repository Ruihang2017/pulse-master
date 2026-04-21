import { describe, expect, it } from "vitest";
import { waitlistRoute } from "../routes/waitlist.js";

describe("POST /waitlist", () => {
  it("rejects invalid emails with 400", async () => {
    const res = await waitlistRoute.request("/waitlist", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
      headers: { "content-type": "application/json" },
    });
    expect(res.status).toBe(400);
  });
});
