import { serve } from "@hono/node-server";
import { logger } from "@pulse/shared";
import { Hono } from "hono";
import { errorMiddleware } from "./middleware/error.js";
import { initSentry } from "./middleware/sentry.js";
import { healthRoute } from "./routes/health.js";
import { waitlistRoute } from "./routes/waitlist.js";
import { clerkWebhookRoute } from "./routes/webhooks/clerk.js";

initSentry();

const app = new Hono();
app.use("*", errorMiddleware);
app.route("/", healthRoute);
app.route("/", clerkWebhookRoute);
app.route("/", waitlistRoute);

const port = Number(process.env.API_PORT ?? 3001);
serve({ fetch: app.fetch, port }, (info) => {
  logger.info({ port: info.port, env: process.env.PULSE_ENV ?? "local" }, "pulse-api listening");
});
