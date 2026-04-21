import type { Config } from "drizzle-kit";

export default {
  schema: ["./src/schema/users.ts", "./src/schema/waitlist.ts", "./src/schema/pgvector-smoke.ts"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://pulse:pulse@localhost:5432/pulse",
  },
  verbose: true,
  strict: true,
} satisfies Config;
