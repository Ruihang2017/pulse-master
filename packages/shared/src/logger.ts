import pino from "pino";

const pretty = process.env.PULSE_ENV !== "prod";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: {
    service: process.env.PULSE_SERVICE ?? "unknown",
    env: process.env.PULSE_ENV ?? "local",
    commit: process.env.PULSE_COMMIT ?? "dev",
  },
  ...(pretty
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss" },
        },
      }
    : {}),
});

export type Logger = typeof logger;
