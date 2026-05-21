import { useState } from "react";
import type { WhoIsItChallenge } from "@/types/game";

interface WhoIsItPlayProps {
  challenge: WhoIsItChallenge;
  disabled: boolean;
  onSubmit: (guess: string, cluesUsed: number) => void;
}

export function WhoIsItPlay({
  challenge,
  disabled,
  onSubmit,
}: WhoIsItPlayProps) {
  const [revealed, setRevealed] = useState(1);
  const [guess, setGuess] = useState("");

  return (
    <div className="glass-card space-y-4 rounded-2xl p-5">
      <ul className="space-y-3">
        {challenge.clues.slice(0, revealed).map((clue, i) => (
          <li
            key={i}
            className="rounded-lg border border-[var(--accent)]/20 bg-[var(--surface-soft)] px-4 py-3 text-sm italic text-[var(--text-primary)]"
          >
            Clue {i + 1}: {clue}
          </li>
        ))}
      </ul>
      {revealed < challenge.clues.length && !disabled && (
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => setRevealed((r) => r + 1)}
        >
          Reveal next clue (−points)
        </button>
      )}
      <input
        type="text"
        value={guess}
        disabled={disabled}
        placeholder="Your answer…"
        onChange={(e) => setGuess(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-[var(--surface-soft)] px-4 py-3 text-[var(--text-primary)]"
      />
      <button
        type="button"
        className="btn-primary"
        disabled={disabled || !guess.trim()}
        onClick={() => onSubmit(guess.trim(), revealed - 1)}
      >
        Submit answer
      </button>
    </div>
  );
}
