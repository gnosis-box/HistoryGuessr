import { useState } from "react";
import type { DateGuessChallenge } from "@/types/game";

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

  return (
    <div className="glass-card space-y-5 rounded-2xl p-5">
      <p className="text-sm text-[var(--text-secondary)]">
        Drag the slider or type the year you think is correct.
      </p>
      <input
        type="range"
        min={challenge.yearMin}
        max={challenge.yearMax}
        value={year}
        disabled={disabled}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={challenge.yearMin}
          max={challenge.yearMax}
          value={year}
          disabled={disabled}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-28 rounded-lg border border-white/10 bg-[var(--surface-soft)] px-3 py-2 text-lg font-semibold text-[var(--text-primary)]"
        />
        <span className="text-sm text-[var(--text-secondary)]">
          Range {challenge.yearMin}–{challenge.yearMax}
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
