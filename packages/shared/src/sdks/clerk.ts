import { createHmac, timingSafeEqual } from "node:crypto";

export interface ClerkAuth {
  userId: string | null;
}

export interface ClerkWebhookVerification {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export interface ClerkAdapter {
  getAuth: () => ClerkAuth;
  verifyWebhook: (body: string, headers: Headers) => ClerkWebhookVerification;
}

export interface ClerkAdapterOpts {
  secretKey?: string;
  webhookSecret?: string;
  strict: boolean;
}

export function makeClerkAdapter(opts: ClerkAdapterOpts): ClerkAdapter {
  const hasSecret = opts.secretKey && opts.secretKey !== "sk_test_stub";
  if (!hasSecret && opts.strict) {
    throw new Error("CLERK_SECRET_KEY is required in staging/prod");
  }

  if (!hasSecret) {
    return {
      getAuth: () => ({ userId: "dev-user-001" }),
      verifyWebhook: () => ({ ok: true, skipped: true }),
    };
  }

  return {
    getAuth: () => ({ userId: "real-clerk-auth-integration-in-web-middleware" }),
    verifyWebhook: (body, headers) => verifySvix(body, headers, opts.webhookSecret),
  };
}

function verifySvix(
  body: string,
  headers: Headers,
  webhookSecret?: string,
): ClerkWebhookVerification {
  if (!webhookSecret) return { ok: false, error: "missing webhook secret" };
  const id = headers.get("svix-id");
  const ts = headers.get("svix-timestamp");
  const sig = headers.get("svix-signature");
  if (!id || !ts || !sig) return { ok: false, error: "missing svix headers" };
  const secret = webhookSecret.replace(/^whsec_/, "");
  const key = Buffer.from(secret, "base64");
  const signed = `${id}.${ts}.${body}`;
  const expected = createHmac("sha256", key).update(signed).digest("base64");
  const parts = sig.split(" ");
  for (const part of parts) {
    const [, sv] = part.split(",");
    if (!sv) continue;
    const provided = Buffer.from(sv, "base64");
    const want = Buffer.from(expected, "base64");
    if (provided.length === want.length && timingSafeEqual(provided, want)) return { ok: true };
  }
  return { ok: false, error: "signature mismatch" };
}
