import { Hono } from "hono";

export const healthRoute = new Hono();

healthRoute.get("/health", (c) =>
  c.json({
    ok: true,
    db: "pending",
    commit: process.env.PULSE_COMMIT ?? "dev",
  }),
);
