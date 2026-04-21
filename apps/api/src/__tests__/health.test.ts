import { describe, expect, it } from "vitest";
import { healthRoute } from "../routes/health.js";

describe("GET /health", () => {
  it("returns ok with commit and db status", async () => {
    const res = await healthRoute.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.ok).toBe(true);
    expect(typeof body.commit).toBe("string");
    expect(body.db).toMatch(/^(ok|down|pending)$/);
  });
});
