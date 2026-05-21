import type { SourceVouchLevel } from "@/types/game";

const VOUCH_COUNTS_KEY = "history-guessr-challenge-vouches";
const USER_VOUCHES_KEY = "history-guessr-user-vouches";

interface VouchRecord {
  counts: Record<string, number>;
}

export function getChallengeVouchCount(challengeId: string): number {
  try {
    const raw = localStorage.getItem(VOUCH_COUNTS_KEY);
    const data = raw ? (JSON.parse(raw) as VouchRecord) : { counts: {} };
    return data.counts[challengeId] ?? seedVouchCount(challengeId);
  } catch {
    return 3;
  }
}

function seedVouchCount(challengeId: string): number {
  let h = 0;
  for (let i = 0; i < challengeId.length; i++) {
    h = (h * 31 + challengeId.charCodeAt(i)) >>> 0;
  }
  return 2 + (h % 6);
}

export function vouchChallenge(challengeId: string, address: string | null): boolean {
  if (!address) return false;
  try {
    const userKey = `${USER_VOUCHES_KEY}-${address.toLowerCase()}`;
    const done = JSON.parse(localStorage.getItem(userKey) ?? "[]") as string[];
    if (done.includes(challengeId)) return false;

    const raw = localStorage.getItem(VOUCH_COUNTS_KEY);
    const data = raw ? (JSON.parse(raw) as VouchRecord) : { counts: {} };
    data.counts[challengeId] = (data.counts[challengeId] ?? seedVouchCount(challengeId)) + 1;
    localStorage.setItem(VOUCH_COUNTS_KEY, JSON.stringify(data));
    done.push(challengeId);
    localStorage.setItem(userKey, JSON.stringify(done));
    return true;
  } catch {
    return false;
  }
}

export function sourceVouchLevel(
  challengeId: string,
  sourceConfidence?: string,
): SourceVouchLevel {
  const count = getChallengeVouchCount(challengeId);
  if (count >= 5) return "community_vouched";
  if (sourceConfidence === "verified") return "verified";
  if (sourceConfidence === "attributed" || sourceConfidence === "uncertain") {
    return "debated";
  }
  return count >= 2 ? "debated" : "legendary";
}

export function vouchLevelLabel(level: SourceVouchLevel): string {
  switch (level) {
    case "community_vouched":
      return "Community-vouched";
    case "verified":
      return "Source verified";
    case "debated":
      return "Source debated";
    default:
      return "Legendary / disputed";
  }
}
