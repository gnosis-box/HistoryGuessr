// src/components/circles/CirclesHubSteps.tsx
import { circlesHubContent } from "@/lib/circles/hubContent";

export function CirclesHubSteps() {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {circlesHubContent.steps.map((s) => (
        <li
          key={s.step}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 p-4"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/15 font-display text-sm font-bold text-[var(--gold-soft)]">
            {s.step}
          </span>
          <h3 className="mt-3 font-display text-lg font-semibold text-[var(--text-primary)]">
            {s.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
