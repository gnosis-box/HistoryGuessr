import type { ChallengeDifficulty, ChallengeType } from "@/types/game";
import { devRelaxTrust, historyGuessrGroup, rewardPolicy } from "./config";

const LEDGER_KEY = "history-guessr-hist-ledger";
const DAILY_KEY = "history-guessr-hist-daily";

export interface RewardLedger {
  totalEarned: number;
  pending: number;
  claimed: number;
  entries: RewardEntry[];
}

export interface RewardEntry {
  id: string;
  amount: number;
  score: number;
  challengeId: string;
  challengeType: ChallengeType;
  status: "pending" | "claimed" | "blocked";
  reason?: string;
  at: string;
}

export interface RewardEligibility {
  canEarn: boolean;
  amount: number;
  status: "earn" | "pending_trust" | "blocked";
  reason?: string;
}

const difficultyMultiplier: Record<ChallengeDifficulty, number> = {
  easy: 1,
  medium: 1.15,
  hard: 1.35,
  expert: 1.6,
};

function roundHist(n: number): number {
  return Math.round(n * 10) / 10;
}

export function calculateHistReward(
  score: number,
  difficulty: ChallengeDifficulty,
): number {
  if (score < rewardPolicy.minScoreToEarn) return 0;
  const base = score / 100;
  const amount = base * difficultyMultiplier[difficulty];
  return Math.round(amount * 10) / 10;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readDailyTotal(): number {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date: string; total: number };
    return parsed.date === todayKey() ? parsed.total : 0;
  } catch {
    return 0;
  }
}

function addDailyTotal(amount: number): void {
  const total = readDailyTotal() + amount;
  localStorage.setItem(
    DAILY_KEY,
    JSON.stringify({ date: todayKey(), total }),
  );
}

export function loadLedger(): RewardLedger {
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (!raw) return emptyLedger();
    return JSON.parse(raw) as RewardLedger;
  } catch {
    return emptyLedger();
  }
}

function emptyLedger(): RewardLedger {
  return { totalEarned: 0, pending: 0, claimed: 0, entries: [] };
}

export function saveLedger(ledger: RewardLedger): void {
  localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
}

export function evaluateReward(params: {
  score: number;
  difficulty: ChallengeDifficulty;
  challengeType: ChallengeType;
  isConnected: boolean;
  trustScore?: number;
  targetsReached?: number;
  isGroupMember?: boolean;
}): RewardEligibility {
  const amount = calculateHistReward(params.score, params.difficulty);
  if (amount <= 0) {
    return {
      canEarn: false,
      amount: 0,
      status: "blocked",
      reason: `Score below ${rewardPolicy.minScoreToEarn} — no ${historyGuessrGroup.symbol} this round.`,
    };
  }

  if (readDailyTotal() + amount > rewardPolicy.maxRewardsPerDay) {
    return {
      canEarn: false,
      amount: 0,
      status: "blocked",
      reason: `Daily ${historyGuessrGroup.symbol} cap reached. Try again tomorrow.`,
    };
  }

  if (!params.isConnected) {
    return {
      canEarn: true,
      amount,
      status: "pending_trust",
      reason: "Open in Circles host to link rewards to your wallet.",
    };
  }

  if (devRelaxTrust) {
    return {
      canEarn: true,
      amount,
      status: "earn",
      reason: historyGuessrGroup.groupAddress
        ? `${historyGuessrGroup.symbol} credited (demo trust mode).`
        : `Set VITE_HIST_GROUP_ADDRESS after running npm run hist:register-group.`,
    };
  }

  const strict = (rewardPolicy.strictModes as readonly string[]).includes(
    params.challengeType,
  );
  const minTrust = strict
    ? rewardPolicy.strictMinTrustScore
    : rewardPolicy.minTrustScore;

  const trustOk =
    (params.trustScore ?? 0) >= minTrust ||
    (params.targetsReached ?? 0) >= rewardPolicy.minPenetrationTargets ||
    params.isGroupMember;

  if (!trustOk) {
    return {
      canEarn: true,
      amount,
      status: "pending_trust",
      reason: `Earn ${historyGuessrGroup.symbol} after trust from ${historyGuessrGroup.name} or Gnosis Group.`,
    };
  }

  return { canEarn: true, amount, status: "earn" };
}

export function recordReward(entry: Omit<RewardEntry, "id" | "at">): RewardLedger {
  const ledger = loadLedger();
  const full: RewardEntry = {
    ...entry,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };
  ledger.entries.unshift(full);
  ledger.totalEarned = roundHist(ledger.totalEarned + full.amount);
  if (full.status === "pending") ledger.pending = roundHist(ledger.pending + full.amount);
  if (full.status === "claimed") ledger.claimed = roundHist(ledger.claimed + full.amount);
  addDailyTotal(full.amount);
  saveLedger(ledger);
  return ledger;
}

export function markPendingAsClaimed(amount: number): RewardLedger {
  const ledger = loadLedger();
  ledger.pending = Math.max(0, ledger.pending - amount);
  ledger.claimed += amount;
  ledger.entries = ledger.entries.map((e) =>
    e.status === "pending" ? { ...e, status: "claimed" as const } : e,
  );
  saveLedger(ledger);
  return ledger;
}
