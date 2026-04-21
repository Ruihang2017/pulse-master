export interface ClerkAdapter {
  getAuth: () => { userId: string | null };
}

export function makeClerkAdapter(opts: { secretKey?: string; strict: boolean }): ClerkAdapter {
  if (opts.secretKey && opts.secretKey !== "sk_test_stub") {
    return { getAuth: () => ({ userId: "real-clerk-integration-in-pass-2" }) };
  }
  if (opts.strict) {
    throw new Error("CLERK_SECRET_KEY is required in staging/prod");
  }
  return { getAuth: () => ({ userId: "dev-user-001" }) };
}
