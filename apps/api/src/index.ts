import { serve } from "@hono/node-server";
import { logger } from "@pulse/shared";
import { Hono } from "hono";
import { healthRoute } from "./routes/health.js";

const app = new Hono();
app.route("/", healthRoute);

const port = Number(process.env.API_PORT ?? 3001);
serve({ fetch: app.fetch, port }, (info) => {
  logger.info({ port: info.port }, "pulse-api listening");
});
