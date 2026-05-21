import type { TimelineOrderChallenge } from "@/types/game";

interface TimelineResultReviewProps {
  challenge: TimelineOrderChallenge;
  guessOrder: string[];
}

export function TimelineResultReview({
  challenge,
  guessOrder,
}: TimelineResultReviewProps) {
  const correctOrder = [...challenge.events]
    .sort((a, b) => a.year - b.year)
    .map((e) => e.id);

  return (
    <div className="glass-card space-y-3 rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
        Timeline review
      </p>
      <ul className="space-y-2">
        {guessOrder.map((id, index) => {
          const event = challenge.events.find((e) => e.id === id)!;
          const ok = id === correctOrder[index];
          const prevId = guessOrder[index - 1];
          const prevOk = index === 0 || prevId === correctOrder[index - 1];
          const showArrow = index > 0 && !prevOk;

          return (
            <li key={id}>
              {showArrow && (
                <p className="mb-1 text-center text-xs text-[var(--danger-soft)]">
                  ↕ order inverted here
                </p>
              )}
              <div
                className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
                  ok
                    ? "border-[var(--success-soft)]/40 bg-[var(--success-soft)]/10"
                    : "border-[var(--danger-soft)]/40 bg-[var(--danger-soft)]/10"
                }`}
              >
                <span className="w-6 font-display text-lg text-[var(--gold)]">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-primary)]">
                    {event.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{event.year}</p>
                </div>
                <span
                  className={`text-xs font-semibold uppercase ${
                    ok ? "text-[var(--success-soft)]" : "text-[var(--danger-soft)]"
                  }`}
                >
                  {ok ? "Correct slot" : "Wrong slot"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
