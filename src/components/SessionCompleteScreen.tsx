import { useEffect, useMemo, useRef, useState } from "react";
import type { GameChallenge } from "@/types/game";
import { useCircles } from "@/hooks/use-circles";
import { useReputation } from "@/hooks/use-reputation";
import {
  averageScore,
  getSessionOutcome,
  type SessionOutcome,
} from "@/lib/session/sessionQueue";
import type { RewardEligibility } from "@/lib/circles/rewards";
import type { HonorificBadge, RoundHonorific } from "@/lib/reputation/types";
import { usePlayNavigation } from "@/context/PlayNavigation";
import { ReputationPanel } from "./ReputationPanel";
import { RewardPanel } from "./RewardPanel";

export interface SessionRoundSummary {
  challenge: GameChallenge;
  score: number;
  summary: string;
}

interface SessionCompleteScreenProps {
  sessionLabel?: string;
  rounds: SessionRoundSummary[];
  onHome: () => void;
}

const outcomeHeadlines: Record<SessionOutcome, { title: string; subtitle: string }> =
  {
    victory: {
      title: "Congratulations!",
      subtitle: "Your historical instinct held across the full run.",
    },
    defeat: {
      title: "Defeat",
      subtitle: "The past outmaneuvered you — study the sources and return.",
    },
    complete: {
      title: "Session complete",
      subtitle: "A solid effort. Push for sharper averages next time.",
    },
  };

export function SessionCompleteScreen({
  sessionLabel,
  rounds,
  onHome,
}: SessionCompleteScreenProps) {
  const { openProfile, openCommunities } = usePlayNavigation();
  const { processChallengeReward } = useCircles();
  const { recordSession } = useReputation();
  const [reward, setReward] = useState<RewardEligibility | null>(null);
  const [roundHonorific, setRoundHonorific] = useState<RoundHonorific | null>(
    null,
  );
  const [newBadges, setNewBadges] = useState<HonorificBadge[]>([]);

  const scores = useMemo(() => rounds.map((r) => r.score), [rounds]);
  const avg = useMemo(() => averageScore(scores), [scores]);
  const outcome = useMemo(() => getSessionOutcome(avg), [avg]);
  const headline = outcomeHeadlines[outcome];

  const representativeChallenge = rounds[rounds.length - 1]?.challenge;
  const settledRef = useRef(false);

  useEffect(() => {
    if (rounds.length === 0 || settledRef.current) return;
    settledRef.current = true;
    const rep = recordSession({
      scores,
      challenges: rounds.map((r) => r.challenge),
    });
    setRoundHonorific(rep.roundHonorific);
    setNewBadges(rep.newBadges);
    if (representativeChallenge) {
      setReward(processChallengeReward(avg, representativeChallenge));
    }
  }, [
    avg,
    rounds.length,
    scores,
    recordSession,
    processChallengeReward,
    representativeChallenge,
  ]);

  return (
    <section className="glass-card animate-fade-up space-y-6 rounded-2xl p-6 sm:p-8">
      {sessionLabel && (
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
          {sessionLabel}
        </p>
      )}

      <header
        className={
          outcome === "victory"
            ? "border-b border-[var(--success)]/30 pb-6"
            : outcome === "defeat"
              ? "border-b border-[var(--danger)]/30 pb-6"
              : "border-b border-[var(--border-subtle)] pb-6"
        }
      >
        <h1
          className={`font-display text-4xl font-bold sm:text-5xl ${
            outcome === "victory"
              ? "text-[var(--success)]"
              : outcome === "defeat"
                ? "text-[var(--danger)]"
                : "text-[var(--text-primary)]"
          }`}
        >
          {headline.title}
        </h1>
        <p className="mt-2 text-lg text-[var(--text-secondary)]">
          {headline.subtitle}
        </p>
        <p className="mt-4 text-3xl font-semibold tabular-nums text-[var(--gold-soft)]">
          {avg}{" "}
          <span className="text-lg font-normal text-[var(--text-muted)]">
            / 1000 average
          </span>
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {rounds.length} question{rounds.length === 1 ? "" : "s"} · best single{" "}
          {scores.length > 0 ? Math.max(...scores) : 0}/1000
        </p>
      </header>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Round breakdown
        </p>
        <ul className="space-y-2">
          {rounds.map((r, i) => (
            <li
              key={`${r.challenge.id}-${i}`}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-3 py-2 text-sm"
            >
              <span className="text-[var(--text-secondary)]">
                {i + 1}. {r.challenge.title}
              </span>
              <span className="font-medium tabular-nums text-[var(--gold-soft)]">
                {r.score}/1000
              </span>
            </li>
          ))}
        </ul>
      </div>

      {roundHonorific && (
        <ReputationPanel roundHonorific={roundHonorific} newBadges={newBadges} />
      )}
      {reward && <RewardPanel eligibility={reward} />}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={onHome}>
          Back to home
        </button>
        <button type="button" className="btn-secondary" onClick={openProfile}>
          Profile
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={openCommunities}
        >
          Circles
        </button>
      </div>
    </section>
  );
}
