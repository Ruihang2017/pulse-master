import { Hono } from "hono";
import { getDb } from "@pulse/db/client";
import { sql } from "@pulse/db";

export const healthRoute = new Hono();

async function pingDb(): Promise<"ok" | "down" | "pending"> {
  if (!process.env.DATABASE_URL) return "pending";
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return "ok";
  } catch {
    return "down";
  }
}

healthRoute.get("/health", async (c) => {
  const db = await pingDb();
  return c.json({
    ok: true,
    db,
    commit: process.env.PULSE_COMMIT ?? "dev",
  });
});
