import type { DateGuessChallenge } from "@/types/game";
import { scoreDateGuess } from "@/utils/scoring";
import { getRoundHonorific } from "@/lib/reputation/engine";

interface DateResultReviewProps {
  challenge: DateGuessChallenge;
  guessYear: number;
}

export function DateResultReview({ challenge, guessYear }: DateResultReviewProps) {
  const diff = Math.abs(guessYear - challenge.correctYear);
  const score = scoreDateGuess(guessYear, challenge.correctYear);
  const honorific = getRoundHonorific(score);
  const span = challenge.yearMax - challenge.yearMin;
  const guessPct = ((guessYear - challenge.yearMin) / span) * 100;
  const correctPct =
    ((challenge.correctYear - challenge.yearMin) / span) * 100;

  return (
    <div className="glass-card space-y-3 rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
        Timeline precision
      </p>
      <div className="relative h-12 rounded-xl bg-[var(--bg-card)]">
        <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--border-subtle)]" />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--success-soft)]"
          style={{ left: `calc(${correctPct}% + 12px)` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gold)]"
          style={{ left: `calc(${guessPct}% + 12px)` }}
        />
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <p>
          Your guess:{" "}
          <strong className="text-[var(--text-primary)]">{guessYear}</strong>
        </p>
        <p>
          Correct:{" "}
          <strong className="text-[var(--success-soft)]">
            {challenge.correctYear}
          </strong>
        </p>
        <p>
          Difference:{" "}
          <strong>
            {diff} year{diff === 1 ? "" : "s"}
          </strong>
        </p>
        <p>
          Precision:{" "}
          <strong className="text-[var(--gold-soft)]">{honorific.headline}</strong>
        </p>
      </div>
    </div>
  );
}
