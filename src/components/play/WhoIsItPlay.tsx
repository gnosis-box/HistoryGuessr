import { useState } from "react";
import type { WhoIsItChallenge } from "@/types/game";
import {
  projectedWhoIsItScore,
  WHO_IS_IT_CLUE_PENALTY,
} from "@/utils/scoring";

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
  const cluesUsed = revealed - 1;
  const projected = projectedWhoIsItScore(cluesUsed);

  return (
    <div className="glass-card space-y-4 rounded-2xl p-5">
      <p className="text-sm text-[var(--text-secondary)]">
        Max score if correct now:{" "}
        <strong className="text-[var(--gold-soft)]">{projected} / 1000</strong>
      </p>
      <ul className="space-y-3">
        {challenge.clues.slice(0, revealed).map((clue, i) => (
          <li
            key={i}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-sm italic text-[var(--text-primary)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]/80">
              Clue {i + 1}
            </span>
            <p className="mt-1">{clue}</p>
          </li>
        ))}
      </ul>
      {revealed < challenge.clues.length && !disabled && (
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={() => setRevealed((r) => r + 1)}
        >
          Reveal another clue (−{WHO_IS_IT_CLUE_PENALTY} pts)
        </button>
      )}
      <input
        type="text"
        value={guess}
        disabled={disabled}
        placeholder="Your answer…"
        onChange={(e) => setGuess(e.target.value)}
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)]"
      />
      <button
        type="button"
        className="btn-primary"
        disabled={disabled || !guess.trim()}
        onClick={() => onSubmit(guess.trim(), cluesUsed)}
      >
        Submit answer
      </button>
    </div>
  );
}
