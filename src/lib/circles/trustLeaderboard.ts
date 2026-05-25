import type { TrustPeer } from "./trustGraph";
import { peerDisplayName } from "./trustGraph";

export interface CirclePeerScore {
  name: string;
  address?: string;
  score: number;
  isYou?: boolean;
}

export interface CircleRankResult {
  rank: number;
  total: number;
  beatCount: number;
  peers: CirclePeerScore[];
  source: "trust_graph" | "solo";
}

const WEEKLY_KEY = "history-guessr-weekly-scores";

function weekId(): number {
  return Math.floor(Date.now() / 604_800_000);
}

function playerKey(address: string | null): string {
  return address?.toLowerCase() ?? "guest";
}

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seedScore(challengeId: string, address: string): number {
  const seed = hashSeed(`${challengeId}-${weekId()}-${address}`);
  return 520 + (seed % 480);
}

export function recordWeeklyScore(
  challengeId: string,
  score: number,
  playerAddress?: string | null,
): void {
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    const data = raw
      ? (JSON.parse(raw) as Record<
          string,
          { week: number; scores: Record<string, number> }
        >)
      : {};
    const w = weekId();
    const entry = data[challengeId] ?? { week: w, scores: {} };
    if (entry.week !== w) entry.scores = {};
    entry.week = w;
    const key = playerKey(playerAddress ?? null);
    entry.scores[key] = Math.max(entry.scores[key] ?? 0, score);
    data[challengeId] = entry;
    localStorage.setItem(WEEKLY_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function readPeerScore(challengeId: string, address: string): number | null {
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<
      string,
      { week: number; scores: Record<string, number> }
    >;
    const entry = data[challengeId];
    if (!entry || entry.week !== weekId()) return null;
    const score = entry.scores[address.toLowerCase()];
    return score ?? null;
  } catch {
    return null;
  }
}

export function getPeerBenchmarkScore(
  challengeId: string,
  peerAddress: string,
): number {
  return (
    readPeerScore(challengeId, peerAddress) ?? seedScore(challengeId, peerAddress)
  );
}

export function getTrustCircleRank(params: {
  userScore: number;
  challengeId: string;
  playerAddress?: string | null;
  playerName?: string;
  trustPeers?: TrustPeer[];
}): CircleRankResult {
  recordWeeklyScore(params.challengeId, params.userScore, params.playerAddress);

  const you: CirclePeerScore = {
    name: params.playerName ?? "You",
    address: params.playerAddress ?? undefined,
    score: params.userScore,
    isYou: true,
  };

  const peers: CirclePeerScore[] = (params.trustPeers ?? []).slice(0, 8).map((peer) => ({
    name: peerDisplayName(peer),
    address: peer.address,
    score:
      readPeerScore(params.challengeId, peer.address) ??
      seedScore(params.challengeId, peer.address),
  }));

  if (peers.length === 0) {
    return {
      rank: 1,
      total: 1,
      beatCount: 0,
      peers: [you],
      source: "solo",
    };
  }

  peers.push(you);
  peers.sort((a, b) => b.score - a.score);
  const rank = peers.findIndex((p) => p.isYou) + 1;
  const beatCount = peers.filter((p) => !p.isYou && params.userScore > p.score).length;

  return {
    rank,
    total: peers.length,
    beatCount,
    peers: peers.slice(0, 6),
    source: "trust_graph",
  };
}
