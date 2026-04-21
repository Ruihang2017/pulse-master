import { describe, expect, it } from "vitest";
import { loadEnv } from "../env.js";

describe("loadEnv", () => {
  it("accepts stub values in local strictness", () => {
    const env = loadEnv({
      PULSE_ENV: "local",
      DATABASE_URL: "postgres://stub",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
    expect(env.pulseEnv).toBe("local");
    expect(env.strict).toBe(false);
  });

  it("rejects missing required vars in staging strictness", () => {
    expect(() =>
      loadEnv({
        PULSE_ENV: "staging",
        DATABASE_URL: "",
        NEXT_PUBLIC_APP_URL: "",
      }),
    ).toThrow(/missing|invalid/i);
  });

  it("rejects invalid PULSE_ENV", () => {
    expect(() => loadEnv({ PULSE_ENV: "banana" })).toThrow();
  });
});
