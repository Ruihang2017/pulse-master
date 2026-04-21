const cards = [
  {
    title: "Built for your stack",
    body: "Describe your role and goals once — Pulse tailors every card to what matters to you.",
  },
  {
    title: "10 cards, not 200",
    body: "One quiet, intentional feed a day. Skim it in 30 seconds, or dig into any card.",
  },
  {
    title: "Visually scannable",
    body: "Each card has a distinct image. The feed is designed for a morning coffee, not a guilty skim.",
  },
];

export function Explainer() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 grid gap-8 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="mt-2 text-gray-600">{card.body}</p>
        </div>
      ))}
    </section>
  );
}
