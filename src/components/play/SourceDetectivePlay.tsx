import { useState } from "react";
import type { SourceDetectiveChallenge } from "@/types/game";
import { steelHintSurface } from "@/utils/accentStyles";
import { claimCategoryLabels, verdictLabels } from "@/utils/sourceLabels";

interface SourceDetectivePlayProps {
  challenge: SourceDetectiveChallenge;
  disabled: boolean;
  onSubmit: (statementId: string) => void;
}

export function SourceDetectivePlay({
  challenge,
  disabled,
  onSubmit,
}: SourceDetectivePlayProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="glass-card space-y-4 rounded-2xl p-5">
      <p className={steelHintSurface}>
        Hunting for:{" "}
        <strong>{claimCategoryLabels[challenge.claimCategory]}</strong>
      </p>
      <p className="text-sm text-[var(--text-secondary)]">{challenge.clue}</p>
      <div className="space-y-2">
        {challenge.statements.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={disabled}
            onClick={() => setSelected(s.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              selected === s.id
                ? "border-[var(--gold)] bg-[var(--gold)]/15"
                : "border-[var(--border-subtle)] bg-[var(--bg-card)]"
            }`}
          >
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              {verdictLabels[s.verdict]}
            </span>
            {s.text}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={disabled || !selected}
        onClick={() => selected && onSubmit(selected)}
      >
        Submit choice
      </button>
    </div>
  );
}
