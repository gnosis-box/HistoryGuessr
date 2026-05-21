const pillars = [
  {
    title: "Guess places",
    description:
      "Locate battles, revolutions, coronations and forgotten episodes on the map.",
    icon: "🗺",
  },
  {
    title: "Detect myths",
    description:
      "Separate historical facts from legends, propaganda and misattributed quotes.",
    icon: "🔍",
  },
  {
    title: "Challenge your circle",
    description:
      "Compare scores with people you trust — not anonymous strangers.",
    icon: "⚔",
  },
];

export function HomePillars() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {pillars.map((p) => (
        <article
          key={p.title}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 p-5 transition hover:border-[var(--gold)]/20"
        >
          <span className="text-2xl" aria-hidden>
            {p.icon}
          </span>
          <h3 className="mt-3 font-display text-xl font-semibold text-[var(--gold-soft)]">
            {p.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {p.description}
          </p>
        </article>
      ))}
    </div>
  );
}
