import { customType, index, pgTable, serial } from "drizzle-orm/pg-core";

const vector1024 = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1024)";
  },
  toDriver(value: number[]) {
    return `[${value.join(",")}]`;
  },
});

export const pgvectorSmoke = pgTable(
  "_pgvector_smoke",
  {
    id: serial("id").primaryKey(),
    embedding: vector1024("embedding"),
  },
  (t) => ({
    hnsw: index("idx_pgvector_smoke_hnsw")
      .using("hnsw", t.embedding)
      .with({ opclass: "vector_cosine_ops" }),
  }),
);

export { vector1024 };
