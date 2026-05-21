import { useState } from "react";
import type { GameChallenge } from "@/types/game";
import { shareResult } from "@/utils/share";
import { ScoreBadge } from "./ScoreBadge";

interface ResultPanelProps {
  challenge: GameChallenge;
  score: number;
  summary: string;
  modeName?: string;
  playerName?: string;
  opponentScore?: number;
  onNext: () => void;
}

export function ResultPanel({
  challenge,
  score,
  summary,
  modeName,
  playerName,
  opponentScore,
  onNext,
}: ResultPanelProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const beatFriend =
    opponentScore !== undefined && score > opponentScore;

  async function handleShare() {
    try {
      await shareResult({
        score,
        summary,
        answerLabel: challenge.answerLabel,
        title: challenge.title,
        modeName,
        playerName,
      });
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2500);
    } catch {
      setShareStatus("error");
    }
  }

  return (
    <section className="glass-card animate-fade-up rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <ScoreBadge score={score} />
        <div className="flex-1">
          <p className="text-lg text-[var(--text-primary)]">
            You scored{" "}
            <span className="font-semibold text-[var(--accent-soft)]">
              {score} / 1000
            </span>
          </p>
          <p className="mt-1 text-[var(--text-secondary)]">{summary}</p>
          {opponentScore !== undefined && (
            <p
              className={`mt-2 text-sm font-medium ${beatFriend ? "text-[var(--success)]" : "text-[var(--text-secondary)]"}`}
            >
              {beatFriend
                ? "You beat your friend's score!"
                : `Friend scored ${opponentScore}/1000 — try again.`}
            </p>
          )}

          <div className="mt-5 rounded-xl bg-[var(--surface-soft)]/90 p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
              Correct answer
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)]">
              {challenge.answerLabel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {challenge.explanation}
            </p>
            {challenge.sourceLabel && (
              <p className="mt-2 text-xs text-[var(--text-secondary)]/80">
                Source: {challenge.sourceLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={onNext}>
          Next challenge
        </button>
        <button type="button" className="btn-secondary" onClick={handleShare}>
          {shareStatus === "copied"
            ? "Copied!"
            : shareStatus === "error"
              ? "Copy failed"
              : "Share result"}
        </button>
      </div>
    </section>
  );
}
