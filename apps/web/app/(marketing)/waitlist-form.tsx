"use client";
import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/waitlist`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, source: "landing" }),
        },
      );
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return <p className="mt-6 text-green-600">Thanks — you're on the list.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex w-full max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        className="flex-1 rounded border border-gray-300 px-3 py-2"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {state === "loading" ? "…" : "Join"}
      </button>
      {state === "error" && <span className="text-red-600">Try again</span>}
    </form>
  );
}
