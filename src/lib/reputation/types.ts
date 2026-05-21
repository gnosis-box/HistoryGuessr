import type { ChallengeType } from "@/types/game";

export type ReputationTier = "bronze" | "silver" | "gold" | "legendary";

export interface HonorificBadge {
  id: string;
  title: string;
  epithet: string;
  tier: ReputationTier;
  /** Challenge types that can unlock this badge */
  modes?: ChallengeType[];
  minScore?: number;
  /** Minimum completed rounds before this badge can drop */
  minRounds?: number;
  tag?: string;
}

export interface RoundHonorific {
  headline: string;
  subtitle: string;
  flair: string;
  tier: ReputationTier;
}

export interface EarnedBadgeRecord {
  id: string;
  earnedAt: string;
  challengeId: string;
  score: number;
}

export interface ReputationState {
  earnedBadges: EarnedBadgeRecord[];
  totalRounds: number;
  bestScore: number;
  currentTitleId: string;
  prestige: number;
}
