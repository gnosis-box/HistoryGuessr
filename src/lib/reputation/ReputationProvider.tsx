import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GameChallenge } from "@/types/game";
import { getBadgeById } from "./badges";
import {
  loadReputation,
  recordSessionReputation,
  type RoundReputationResult,
} from "./engine";
import type { ChallengeType } from "@/types/game";
import type { HonorificBadge, ReputationState, RoundHonorific } from "./types";

interface ReputationContextValue {
  reputation: ReputationState;
  currentTitle: HonorificBadge;
  lastRound: RoundHonorific | null;
  lastNewBadges: HonorificBadge[];
  recordSession: (params: {
    scores: number[];
    challenges: GameChallenge[];
  }) => RoundReputationResult;
  earnedBadgeList: HonorificBadge[];
}

const ReputationContext = createContext<ReputationContextValue | null>(null);

export function ReputationProvider({ children }: { children: ReactNode }) {
  const [reputation, setReputation] = useState<ReputationState>(() =>
    loadReputation(),
  );
  const [lastRound, setLastRound] = useState<RoundHonorific | null>(null);
  const [lastNewBadges, setLastNewBadges] = useState<HonorificBadge[]>([]);

  const recordSession = useCallback(
    (params: { scores: number[]; challenges: GameChallenge[] }) => {
      const { scores, challenges } = params;
      const modes = [...new Set(challenges.map((c) => c.type))] as ChallengeType[];
      const tags = [...new Set(challenges.flatMap((c) => c.tags))];
      const peakScore = scores.length > 0 ? Math.max(...scores) : 0;
      const averageScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;

      const result = recordSessionReputation({
        averageScore,
        peakScore,
        roundsPlayed: scores.length,
        modes,
        tags,
        sessionChallengeId: challenges[challenges.length - 1]?.id ?? "session",
      });
      setReputation(result.state);
      setLastRound(result.roundHonorific);
      setLastNewBadges(result.newBadges);
      return result;
    },
    [],
  );

  const currentTitle = useMemo(
    () => getBadgeById(reputation.currentTitleId) ?? getBadgeById("title-novice")!,
    [reputation.currentTitleId],
  );

  const earnedBadgeList = useMemo(
    () =>
      reputation.earnedBadges
        .map((e) => getBadgeById(e.id))
        .filter((b): b is HonorificBadge => Boolean(b)),
    [reputation.earnedBadges],
  );

  const value = useMemo(
    () => ({
      reputation,
      currentTitle,
      lastRound,
      lastNewBadges,
      recordSession,
      earnedBadgeList,
    }),
    [
      reputation,
      currentTitle,
      lastRound,
      lastNewBadges,
      recordSession,
      earnedBadgeList,
    ],
  );

  return (
    <ReputationContext.Provider value={value}>
      {children}
    </ReputationContext.Provider>
  );
}

export function useReputation(): ReputationContextValue {
  const ctx = useContext(ReputationContext);
  if (!ctx) {
    throw new Error("useReputation must be used within ReputationProvider");
  }
  return ctx;
}
