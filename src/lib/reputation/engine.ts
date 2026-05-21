import type { ChallengeType } from "@/types/game";
import { badgeTierRank, honorificBadges, prestigeTitles } from "./badges";
import type {
  EarnedBadgeRecord,
  HonorificBadge,
  ReputationState,
  RoundHonorific,
} from "./types";

const STORAGE_KEY = "history-guessr-reputation";

export function emptyReputation(): ReputationState {
  return {
    earnedBadges: [],
    totalRounds: 0,
    bestScore: 0,
    currentTitleId: "title-novice",
    prestige: 0,
  };
}

export function loadReputation(): ReputationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyReputation();
    return { ...emptyReputation(), ...JSON.parse(raw) };
  } catch {
    return emptyReputation();
  }
}

export function saveReputation(state: ReputationState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getRoundHonorific(score: number): RoundHonorific {
  if (score >= 950) {
    return {
      headline: "Imperial Memory",
      subtitle: "The gods of History are taking notes.",
      flair: "They would build you a bust — with a sourced plaque.",
      tier: "legendary",
    };
  }
  if (score >= 900) {
    return {
      headline: "Legendary Precision",
      subtitle: "The archives applaud in silence.",
      flair: "Cartographers and archivists envy this round.",
      tier: "legendary",
    };
  }
  if (score >= 800) {
    return {
      headline: "Radiant Scholar",
      subtitle: "You place the past where it belongs.",
      flair: "A little more and they name a wing after you.",
      tier: "gold",
    };
  }
  if (score >= 700) {
    return {
      headline: "Elite Recall",
      subtitle: "The past recognizes you on sight.",
      flair: "HIST is only currency — you are the legend.",
      tier: "gold",
    };
  }
  if (score >= 500) {
    return {
      headline: "Sharp Historical Instinct",
      subtitle: "You brush glory — and the map.",
      flair: "The centuries still flirt with you.",
      tier: "silver",
    };
  }
  if (score >= 400) {
    return {
      headline: "Almost on the Map",
      subtitle: "A geographic detour, not a defeat.",
      flair: "Yesterday's apprentice is tomorrow's scholar.",
      tier: "silver",
    };
  }
  if (score >= 200) {
    return {
      headline: "Flâneur of the Past",
      subtitle: "You missed with panache.",
      flair: "Even great historians misplace a capital once.",
      tier: "bronze",
    };
  }
  return {
    headline: "Lost in Time",
    subtitle: "Still a splendid cultural detour.",
    flair: "Reputation cannot be bought — only earned back.",
    tier: "bronze",
  };
}

function badgeMatchesRound(
  badge: HonorificBadge,
  score: number,
  modes: ChallengeType[],
  tags: string[],
  totalRounds: number,
): boolean {
  if (badge.minScore !== undefined && score < badge.minScore) return false;
  if (badge.minRounds !== undefined && totalRounds < badge.minRounds) return false;
  if (
    badge.modes &&
    !modes.some((m) => badge.modes!.includes(m))
  )
    return false;
  if (badge.tag && !tags.some((t) => t.toLowerCase().includes(badge.tag!.toLowerCase())))
    return false;
  return true;
}

/** At most one new honorific badge — highest tier / threshold wins */
export function badgesUnlockedThisRound(
  score: number,
  modes: ChallengeType[],
  tags: string[],
  alreadyEarned: Set<string>,
  totalRounds: number,
): HonorificBadge[] {
  const eligible = honorificBadges.filter(
    (b) =>
      !alreadyEarned.has(b.id) &&
      badgeMatchesRound(b, score, modes, tags, totalRounds),
  );

  if (eligible.length === 0) return [];

  eligible.sort((a, b) => {
    const tierDiff = badgeTierRank(b.tier) - badgeTierRank(a.tier);
    if (tierDiff !== 0) return tierDiff;
    return (b.minScore ?? 0) - (a.minScore ?? 0);
  });

  return [eligible[0]];
}

function computePrestige(state: ReputationState): number {
  const tierPoints = { bronze: 1, silver: 2, gold: 5, legendary: 12 };
  let p = Math.floor(state.bestScore / 200);
  p += Math.floor(state.totalRounds / 5);
  for (const e of state.earnedBadges) {
    const b = honorificBadges.find((x) => x.id === e.id);
    if (b) p += tierPoints[b.tier];
  }
  return p;
}

function pickTitleId(prestige: number): string {
  if (prestige >= 55) return "title-legend";
  if (prestige >= 30) return "title-master";
  if (prestige >= 12) return "title-scholar";
  return "title-novice";
}

export interface RoundReputationResult {
  state: ReputationState;
  roundHonorific: RoundHonorific;
  newBadges: HonorificBadge[];
  currentTitle: HonorificBadge;
}

export function recordSessionReputation(params: {
  averageScore: number;
  peakScore: number;
  roundsPlayed: number;
  modes: ChallengeType[];
  tags: string[];
  sessionChallengeId: string;
}): RoundReputationResult {
  const state = loadReputation();
  const earnedIds = new Set(state.earnedBadges.map((b) => b.id));
  const nextTotalRounds = state.totalRounds + params.roundsPlayed;
  const newBadgeDefs = badgesUnlockedThisRound(
    params.averageScore,
    params.modes,
    params.tags,
    earnedIds,
    nextTotalRounds,
  );

  const newRecords: EarnedBadgeRecord[] = newBadgeDefs.map((b) => ({
    id: b.id,
    earnedAt: new Date().toISOString(),
    challengeId: params.sessionChallengeId,
    score: params.averageScore,
  }));

  const next: ReputationState = {
    ...state,
    earnedBadges: [...newRecords, ...state.earnedBadges],
    totalRounds: nextTotalRounds,
    bestScore: Math.max(state.bestScore, params.peakScore),
    prestige: 0,
    currentTitleId: state.currentTitleId,
  };
  next.prestige = computePrestige(next);
  next.currentTitleId = pickTitleId(next.prestige);

  saveReputation(next);

  const currentTitle =
    prestigeTitles.find((t) => t.id === next.currentTitleId) ?? prestigeTitles[0];

  return {
    state: next,
    roundHonorific: getRoundHonorific(params.averageScore),
    newBadges: newBadgeDefs,
    currentTitle,
  };
}
