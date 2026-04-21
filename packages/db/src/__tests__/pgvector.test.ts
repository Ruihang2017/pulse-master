import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

function dockerAvailable(): boolean {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const maybe = dockerAvailable() ? describe : describe.skip;

maybe("pgvector smoke", () => {
  let container: Awaited<ReturnType<PostgreSqlContainer["start"]>>;
  let db: ReturnType<typeof drizzle>;
  let rawSql: ReturnType<typeof postgres>;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("pgvector/pgvector:pg16")
      .withUsername("pulse")
      .withPassword("pulse")
      .withDatabase("pulse")
      .start();

    rawSql = postgres(container.getConnectionUri(), { max: 2 });
    db = drizzle(rawSql);

    const initPath = path.resolve(__dirname, "../../migrations/0001_init.sql");
    const body = await readFile(initPath, "utf8");
    await rawSql.unsafe(body);
  }, 120_000);

  afterAll(async () => {
    await rawSql?.end({ timeout: 5 });
    await container?.stop();
  });

  it("inserts and queries a vector", async () => {
    const v = `[${Array.from({ length: 1024 }, () => 0.1).join(",")}]`;
    await db.execute(sql.raw(`INSERT INTO _pgvector_smoke (embedding) VALUES ('${v}')`));
    const rows = (await db.execute(
      sql.raw(`SELECT id FROM _pgvector_smoke ORDER BY embedding <=> '${v}' LIMIT 1`),
    )) as unknown as { id: number }[];
    expect(rows.length).toBe(1);
  });
});

if (!dockerAvailable()) {
  console.warn("[pgvector.test] Docker unavailable — test suite skipped.");
}
