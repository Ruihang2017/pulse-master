import { describe, expect, it } from "vitest";
import { makeClerkAdapter } from "@pulse/shared";
import { makeClerkWebhookRoute } from "../routes/webhooks/clerk.js";

describe("POST /webhooks/clerk (strict mode)", () => {
  it("rejects requests without svix headers with 400 (never 500)", async () => {
    const clerk = makeClerkAdapter({
      secretKey: "sk_live_test",
      webhookSecret: "whsec_" + Buffer.from("x".repeat(32)).toString("base64"),
      strict: true,
    });
    const route = makeClerkWebhookRoute(clerk);
    const res = await route.request("/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({ type: "user.created" }),
      headers: { "content-type": "application/json" },
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /webhooks/clerk (dev-stub mode)", () => {
  it("accepts without signature in dev-stub", async () => {
    const clerk = makeClerkAdapter({ strict: false });
    const route = makeClerkWebhookRoute(clerk);
    const res = await route.request("/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({ type: "user.created" }),
      headers: { "content-type": "application/json" },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { mode?: string };
    expect(body.mode).toBe("dev-stub");
  });
});
