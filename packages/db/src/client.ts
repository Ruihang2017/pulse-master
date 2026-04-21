import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let _client: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set; cannot create Drizzle client");
  }
  const sql = postgres(url, { max: 10 });
  _client = drizzle(sql);
  return _client;
}
