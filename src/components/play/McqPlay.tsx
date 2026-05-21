import type { ReactNode } from "react";

interface McqPlayProps {
  prompt: string;
  options: { id: string; label: string }[];
  selectedId: string | null;
  disabled: boolean;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  extra?: ReactNode;
}

export function McqPlay({
  prompt,
  options,
  selectedId,
  disabled,
  onSelect,
  onSubmit,
  extra,
}: McqPlayProps) {
  return (
    <div className="glass-card space-y-4 rounded-2xl p-5">
      {extra}
      <p className="text-sm font-medium text-[var(--text-primary)]">{prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.id)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              selectedId === opt.id
                ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent-soft)]"
                : "border-white/10 bg-[var(--surface-soft)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={disabled || !selectedId}
        onClick={onSubmit}
      >
        Submit answer
      </button>
    </div>
  );
}
