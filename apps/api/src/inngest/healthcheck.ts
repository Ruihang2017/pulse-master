import { logger } from "@pulse/shared";
import { inngest } from "./client.js";

export const healthcheckScheduled = inngest.createFunction(
  {
    id: "pulse/healthcheck.scheduled",
    triggers: [{ cron: "*/15 * * * *" }],
  },
  async () => {
    logger.info({ kind: "inngest-healthcheck" }, "inngest alive");
    return { ok: true, at: new Date().toISOString() };
  },
);
