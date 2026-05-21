import { useState } from "react";
import type { DateGuessChallenge } from "@/types/game";
import { getRoundHonorific } from "@/lib/reputation/engine";

interface DateGuessPlayProps {
  challenge: DateGuessChallenge;
  disabled: boolean;
  onSubmit: (year: number) => void;
}

export function DateGuessPlay({
  challenge,
  disabled,
  onSubmit,
}: DateGuessPlayProps) {
  const [year, setYear] = useState(
    Math.round((challenge.yearMin + challenge.yearMax) / 2),
  );
  const span = challenge.yearMax - challenge.yearMin;
  const guessPct = ((year - challenge.yearMin) / span) * 100;
  const correctPct =
    ((challenge.correctYear - challenge.yearMin) / span) * 100;
  const diff = Math.abs(year - challenge.correctYear);
  const previewHonorific = getRoundHonorific(
    diff === 0 ? 1000 : diff <= 5 ? 900 : diff <= 25 ? 700 : 400,
  );

  return (
    <div className="glass-card space-y-5 rounded-2xl p-5">
      <p className="text-sm text-[var(--text-secondary)]">
        Drag the slider — watch your guess move along the timeline.
      </p>

      <div className="relative h-14 rounded-xl bg-[var(--bg-card)] px-2">
        <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--border-subtle)]" />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--success-soft)]"
          style={{ left: `calc(${correctPct}% + 8px)` }}
          title={`Correct: ${challenge.correctYear}`}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--gold)] bg-[var(--gold-soft)]"
          style={{ left: `calc(${guessPct}% + 8px)` }}
          title={`Your guess: ${year}`}
        />
        <span
          className="absolute bottom-1 left-3 text-[10px] text-[var(--text-muted)]"
        >
          {challenge.yearMin}
        </span>
        <span
          className="absolute bottom-1 right-3 text-[10px] text-[var(--text-muted)]"
        >
          {challenge.yearMax}
        </span>
      </div>

      <input
        type="range"
        min={challenge.yearMin}
        max={challenge.yearMax}
        value={year}
        disabled={disabled}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full accent-[var(--gold)]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={challenge.yearMin}
          max={challenge.yearMax}
          value={year}
          disabled={disabled}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-28 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-lg font-semibold text-[var(--text-primary)]"
        />
        <span className="text-sm text-[var(--text-secondary)]">
          Off by {diff} year{diff === 1 ? "" : "s"} · preview:{" "}
          <span className="text-[var(--gold-soft)]">
            {previewHonorific.headline}
          </span>
        </span>
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={disabled}
        onClick={() => onSubmit(year)}
      >
        Submit year
      </button>
    </div>
  );
}
