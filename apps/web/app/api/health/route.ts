export const runtime = "edge";

export async function GET() {
  return Response.json({
    ok: true,
    commit: process.env.NEXT_PUBLIC_PULSE_COMMIT ?? "dev",
  });
}
