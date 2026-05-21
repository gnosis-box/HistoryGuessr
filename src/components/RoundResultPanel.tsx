import { useState } from "react";
import type { GameChallenge } from "@/types/game";
import { shareResult } from "@/utils/share";
import { getRoundHonorific } from "@/lib/reputation/engine";

interface RoundResultPanelProps {
  challenge: GameChallenge;
  score: number;
  summary: string;
  modeName?: string;
  playerName?: string;
  opponentScore?: number;
  questionIndex: number;
  totalQuestions: number;
  onContinue: () => void;
}

export function RoundResultPanel({
  challenge,
  score,
  summary,
  modeName,
  playerName,
  opponentScore,
  questionIndex,
  totalQuestions,
  onContinue,
}: RoundResultPanelProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const roundHonorific = getRoundHonorific(score);
  const isLast = questionIndex >= totalQuestions;
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
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        Question {questionIndex} / {totalQuestions}
      </p>

      <div className="mt-3 border-b border-[var(--border-subtle)] pb-5">
        <p className="font-display text-2xl font-semibold text-[var(--text-primary)]">
          {roundHonorific.headline}
        </p>
        <p className="mt-2 text-xl font-semibold tabular-nums text-[var(--gold-soft)]">
          {score}{" "}
          <span className="text-base font-normal text-[var(--text-muted)]">
            / 1000
          </span>
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{summary}</p>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Rewards and reputation are awarded after the full session, from your
          average score.
        </p>
      </div>

      {opponentScore !== undefined && (
        <p
          className={`mt-4 text-sm font-medium ${beatFriend ? "text-[var(--success-soft)]" : "text-[var(--text-secondary)]"}`}
        >
          {beatFriend
            ? "Duel won — Best in circle for this clue!"
            : `Friend scored ${opponentScore}/1000 — Revenge available.`}
        </p>
      )}

      <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 p-4">
        <p className="text-xs uppercase tracking-wider text-[var(--gold)]">
          Correct answer
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-[var(--text-primary)]">
          {challenge.answerLabel}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {challenge.explanation}
        </p>
        {challenge.sourceLabel && (
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Source: {challenge.sourceLabel}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={onContinue}>
          {isLast ? "See final results" : "Next question"}
        </button>
        <button type="button" className="btn-secondary" onClick={handleShare}>
          {shareStatus === "copied"
            ? "Copied!"
            : shareStatus === "error"
              ? "Copy failed"
              : "Share this round"}
        </button>
      </div>
    </section>
  );
}
