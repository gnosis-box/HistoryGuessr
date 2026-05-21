import {
  challengeCatalog,
  getChallengeById,
  getChallengesByPack,
  getChallengesByType,
} from "@/data/catalog";
import { getCampaign } from "@/data/campaigns";
import { getDailyChallenge } from "@/data/dailyChallenge";
import type { ChallengeType, GameChallenge } from "@/types/game";

export type SessionKind = "mode" | "campaign" | "daily" | "pack";

const MAX_MODE_QUESTIONS = 10;
const MAX_RANDOM_QUESTIONS = 8;

function shuffleIds(ids: string[]): string[] {
  const list = [...ids];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function buildSessionQueue(params: {
  kind: SessionKind;
  challengeType?: ChallengeType;
  packId?: string;
  campaignId?: string;
  cityChallengeId?: string;
}): string[] {
  if (params.kind === "daily") {
    return [getDailyChallenge().id];
  }

  if (params.kind === "campaign" && params.campaignId) {
    const campaign = getCampaign(params.campaignId);
    if (!campaign) return [];
    return campaign.steps.map((s) => s.challengeId);
  }

  if (params.kind === "pack" && params.packId) {
    const ids = getChallengesByPack(params.packId).map((c) => c.id);
    return shuffleIds(ids);
  }

  if (params.cityChallengeId) {
    return [params.cityChallengeId];
  }

  if (params.challengeType) {
    const ids = getChallengesByType(params.challengeType).map((c) => c.id);
    return shuffleIds(ids).slice(0, Math.min(ids.length, MAX_MODE_QUESTIONS));
  }

  const ids = challengeCatalog.map((c) => c.id);
  return shuffleIds(ids).slice(0, MAX_RANDOM_QUESTIONS);
}

export function resolveSessionChallenges(queue: string[]): GameChallenge[] {
  return queue
    .map((id) => getChallengeById(id))
    .filter((c): c is GameChallenge => Boolean(c));
}

export type SessionOutcome = "victory" | "defeat" | "complete";

export const SESSION_VICTORY_AVG = 550;
export const SESSION_DEFEAT_AVG = 400;

export function getSessionOutcome(averageScore: number): SessionOutcome {
  if (averageScore >= SESSION_VICTORY_AVG) return "victory";
  if (averageScore < SESSION_DEFEAT_AVG) return "defeat";
  return "complete";
}

export function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
