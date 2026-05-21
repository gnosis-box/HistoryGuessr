const steps = [
  {
    title: "Play a challenge",
    description:
      "Daily archive, historical campaign, or any of eleven modes — map, memory, or critical thinking.",
  },
  {
    title: "Learn from the result",
    description:
      "Distance on the map, timeline feedback, sources explained — even misses teach you something.",
  },
  {
    title: "Earn trust & glory",
    description:
      "HIST from your circle, honorific badges you cannot buy, duels with people you actually trust.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          The loop
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Play → understand → earn → unlock → replay — with your trust circle,
          not strangers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/70 p-4"
          >
            <span className="font-display text-2xl text-[var(--gold)]/80">
              {index + 1}
            </span>
            <h3 className="mt-2 font-display text-lg font-semibold text-[var(--gold-soft)]">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
