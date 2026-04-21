import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@pulse/db/client";
import { user } from "@pulse/db/schema";
import { logger, makeClerkAdapter, type ClerkAdapter } from "@pulse/shared";

export function makeClerkWebhookRoute(clerk: ClerkAdapter) {
  const route = new Hono();

  route.post("/webhooks/clerk", async (c) => {
    const body = await c.req.text();
    const verification = clerk.verifyWebhook(body, c.req.raw.headers);
    if (!verification.ok) {
      logger.warn({ reason: verification.error }, "clerk webhook rejected");
      return c.json({ ok: false, error: verification.error ?? "invalid_signature" }, 400);
    }

    if (verification.skipped) {
      return c.json({ received: true, mode: "dev-stub" });
    }

    let event: {
      type?: string;
      data?: { id?: string; email_addresses?: { email_address: string }[] };
    };
    try {
      event = JSON.parse(body);
    } catch {
      return c.json({ ok: false, error: "invalid_json" }, 400);
    }

    if (!process.env.DATABASE_URL) {
      logger.info({ type: event.type }, "clerk webhook received (no DB configured)");
      return c.json({ received: true, mode: "no-db" });
    }

    const db = getDb();
    try {
      if (event.type === "user.created" && event.data?.id) {
        const email = event.data.email_addresses?.[0]?.email_address ?? "";
        await db
          .insert(user)
          .values({ clerkId: event.data.id, email, timezone: "UTC" })
          .onConflictDoNothing({ target: user.clerkId });
      } else if (event.type === "user.deleted" && event.data?.id) {
        await db
          .update(user)
          .set({ deletedAt: sql`now()` })
          .where(eq(user.clerkId, event.data.id));
      }
      return c.json({ received: true });
    } catch (err) {
      logger.error({ err }, "clerk webhook DB error");
      return c.json({ ok: false, error: "db_error" }, 400);
    }
  });

  return route;
}

export const clerkWebhookRoute = makeClerkWebhookRoute(
  makeClerkAdapter({
    secretKey: process.env.CLERK_SECRET_KEY,
    webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
    strict: (process.env.PULSE_ENV ?? "local") !== "local",
  }),
);
