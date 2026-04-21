import pino from "pino";

const PII_KEYS = new Set(["email", "clerk_id", "clerkId", "password", "token", "authorization"]);
const BEARER_RE = /Bearer\s+[A-Za-z0-9._-]+/g;

export function redactPii<T>(input: T): T {
  if (input == null) return input;
  if (typeof input === "string") {
    return input.replace(BEARER_RE, "Bearer [REDACTED]") as T;
  }
  if (Array.isArray(input)) {
    return input.map((v) => redactPii(v)) as unknown as T;
  }
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = PII_KEYS.has(k) ? "[REDACTED]" : redactPii(v);
    }
    return out as T;
  }
  return input;
}

const pretty = (process.env.PULSE_ENV ?? "local") !== "prod";
const axiomToken = process.env.AXIOM_TOKEN;
const axiomDataset = process.env.AXIOM_DATASET ?? "pulse-logs";

const transport = axiomToken
  ? pino.transport({
      targets: [
        {
          target: "@axiomhq/pino",
          level: "info",
          options: { token: axiomToken, dataset: axiomDataset },
        },
        {
          target: "pino-pretty",
          level: "info",
          options: { colorize: pretty, translateTime: "SYS:HH:MM:ss" },
        },
      ],
    })
  : pino.transport({
      target: "pino-pretty",
      options: { colorize: pretty, translateTime: "SYS:HH:MM:ss" },
    });

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
    base: {
      service: process.env.PULSE_SERVICE ?? "unknown",
      env: process.env.PULSE_ENV ?? "local",
      commit: process.env.PULSE_COMMIT ?? "dev",
    },
    formatters: {
      log(obj) {
        return redactPii(obj) as Record<string, unknown>;
      },
    },
  },
  transport,
);

export type Logger = typeof logger;
