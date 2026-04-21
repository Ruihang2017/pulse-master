import { Hono } from "hono";
import { z } from "zod";
import { getDb } from "@pulse/db/client";
import { waitlist } from "@pulse/db/schema";
import { logger, makePostHogAdapter } from "@pulse/shared";

export const waitlistRoute = new Hono();

const posthog = makePostHogAdapter({
  apiKey: process.env.POSTHOG_API_KEY,
  strict: (process.env.PULSE_ENV ?? "local") !== "local",
});

const bodySchema = z.object({
  email: z.string().email(),
  source: z.string().max(64).optional(),
});

waitlistRoute.post("/waitlist", async (c) => {
  let parsed;
  try {
    parsed = bodySchema.parse(await c.req.json());
  } catch (err) {
    return c.json({ ok: false, error: "invalid_body" }, 400);
  }

  if (process.env.DATABASE_URL) {
    try {
      const db = getDb();
      await db.insert(waitlist).values({ email: parsed.email, source: parsed.source }).execute();
    } catch (err) {
      logger.error({ err }, "waitlist insert failed");
    }
  } else {
    logger.info({ email: "[REDACTED]" }, "waitlist: DATABASE_URL absent, skipping insert");
  }

  posthog.capture("landing_cta_click", { source: parsed.source ?? "unknown" });
  return c.json({ ok: true });
});
