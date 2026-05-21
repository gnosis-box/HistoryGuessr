import { getRoundHonorific } from "@/lib/reputation/engine";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const honorific = getRoundHonorific(score);

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
      <span className="max-w-[140px] text-center font-display text-sm font-semibold leading-tight text-[var(--accent-soft)]">
        {honorific.headline}
      </span>
      <span className="max-w-[160px] text-center text-[10px] italic text-[var(--text-secondary)]">
        {honorific.subtitle}
      </span>
      <span className="text-xs text-[var(--text-secondary)]">/ 1000</span>
    </div>
  );
}
