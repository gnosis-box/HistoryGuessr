import { useState } from "react";
import type { SourceDetectiveChallenge } from "@/types/game";

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
      <p className="text-sm text-[var(--text-secondary)]">
        Tap the statement that best matches the clue (misleading, false, or
        legend).
      </p>
      <div className="space-y-2">
        {challenge.statements.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={disabled}
            onClick={() => setSelected(s.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              selected === s.id
                ? "border-[var(--accent)] bg-[var(--accent)]/15"
                : "border-white/10 bg-[var(--surface-soft)]"
            }`}
          >
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
