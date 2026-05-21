const steps = [
  {
    title: "Pick a challenge type",
    description:
      "Eleven modes are playable: map, dates, timelines, figures, quotes, paths, images, battles, cities, sources, friends.",
  },
  {
    title: "Read & respond",
    description:
      "Clues, images, quotes or claims — each mode asks a different kind of historical memory.",
  },
  {
    title: "Score & share",
    description:
      "See how close you were, learn the story, copy your result — soon, challenge friends on Circles.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          A modular platform — one grammar of historical challenges, many UIs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-xl border border-white/5 bg-[var(--surface-soft)]/70 p-4"
          >
            <span className="font-display text-2xl text-[var(--accent)]/80">
              {index + 1}
            </span>
            <h3 className="mt-2 font-display text-lg font-semibold text-[var(--accent-soft)]">
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
