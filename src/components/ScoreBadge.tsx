interface ScoreBadgeProps {
  score: number;
}

function getLabel(score: number): string {
  if (score >= 900) return "Excellent";
  if (score >= 700) return "Strong memory";
  if (score >= 400) return "Close enough";
  return "Lost in time";
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const label = getLabel(score);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/25 to-transparent font-display text-3xl font-bold text-[var(--accent-soft)] shadow-[0_0_40px_rgba(214,169,79,0.2)]"
          aria-label={`Score ${score} out of 1000`}
        >
          {score}
        </div>
      </div>
      <span className="text-sm font-medium text-[var(--accent)]">{label}</span>
      <span className="text-xs text-[var(--text-secondary)]">/ 1000</span>
    </div>
  );
}
