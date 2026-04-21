import type { MiddlewareHandler } from "hono";
import { logger } from "@pulse/shared";
import { Sentry } from "./sentry.js";

export const errorMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    logger.error({ err, path: c.req.path }, "unhandled error");
    Sentry.captureException(err);
    return c.json({ ok: false, error: "internal_error" }, 500);
  }
};
