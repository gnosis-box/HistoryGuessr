// src/components/hist/HistFlywheel.tsx
import { histCurrencyContent } from "@/lib/circles/histCurrencyContent";

export function HistFlywheel() {
  const { flywheel } = histCurrencyContent;

  return (
    <section className="glass-card overflow-hidden rounded-2xl p-5 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        The loop
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text-primary)]">
        {flywheel.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
        {flywheel.subtitle}
      </p>

      <ol className="mt-8 grid gap-3 sm:grid-cols-5">
        {flywheel.steps.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 p-4"
          >
            {i < flywheel.steps.length - 1 && (
              <span
                className="absolute -right-2 top-1/2 z-10 hidden h-0.5 w-4 -translate-y-1/2 bg-[var(--gold)]/40 sm:block"
                aria-hidden
              />
            )}
            <span className="font-display text-lg font-bold text-[var(--gold-soft)]">
              {i + 1}
            </span>
            <p className="mt-2 font-medium text-[var(--text-primary)]">
              {step.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-6 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        {flywheel.winWin}
      </p>
    </section>
  );
}
