import { WaitlistForm } from "./waitlist-form";

export function Hero() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Pulse</h1>
      <p className="mt-4 text-xl text-gray-600">
        Your personal research analyst that never sleeps, tuned to your career.
      </p>
      <div className="mt-8 flex justify-center">
        <WaitlistForm />
      </div>
    </section>
  );
}
