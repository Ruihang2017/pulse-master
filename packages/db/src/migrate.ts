import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");
const ADVISORY_LOCK_KEY = 4242;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[migrate] DATABASE_URL not set; nothing to migrate.");
    return;
  }

  const sql = postgres(url, { max: 1 });
  try {
    await sql`SELECT pg_advisory_lock(${ADVISORY_LOCK_KEY})`;
    await sql`CREATE TABLE IF NOT EXISTS _pulse_migrations (
      id serial PRIMARY KEY,
      name text UNIQUE NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;

    const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();

    const applied = new Set(
      (await sql<{ name: string }[]>`SELECT name FROM _pulse_migrations`).map((r) => r.name),
    );

    for (const file of files) {
      if (applied.has(file)) continue;
      const body = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`[migrate] applying ${file}`);
      await sql.unsafe(body);
      await sql`INSERT INTO _pulse_migrations (name) VALUES (${file})`;
    }
    console.log("[migrate] done.");
  } finally {
    try {
      await sql`SELECT pg_advisory_unlock(${ADVISORY_LOCK_KEY})`;
    } catch {
      /* ignore */
    }
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
