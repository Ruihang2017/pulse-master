import { z } from "zod";

const pulseEnvSchema = z.enum(["local", "staging", "prod"]);

const baseSchema = z.object({
  PULSE_ENV: pulseEnvSchema.default("local"),
  DATABASE_URL: z.string().default(""),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

const strictRequirements = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export interface LoadedEnv {
  pulseEnv: "local" | "staging" | "prod";
  strict: boolean;
  databaseUrl: string;
  appUrl: string;
}

export function loadEnv(source: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env): LoadedEnv {
  const parsed = baseSchema.parse(source);
  const strict = parsed.PULSE_ENV !== "local";
  if (strict) {
    strictRequirements.parse(parsed);
  }
  return {
    pulseEnv: parsed.PULSE_ENV,
    strict,
    databaseUrl: parsed.DATABASE_URL,
    appUrl: parsed.NEXT_PUBLIC_APP_URL,
  };
}
