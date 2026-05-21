const MOCK_PEERS = [
  "Elena",
  "Marco",
  "Sofia",
  "Jonas",
  "Amira",
] as const;

export interface CirclePeerScore {
  name: string;
  score: number;
  isYou?: boolean;
}

export interface CircleRankResult {
  rank: number;
  total: number;
  beatCount: number;
  peers: CirclePeerScore[];
}

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

const WEEKLY_KEY = "history-guessr-weekly-scores";

function weekId(): number {
  return Math.floor(Date.now() / 604_800_000);
}

export function recordWeeklyScore(challengeId: string, score: number): void {
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    const data = raw
      ? (JSON.parse(raw) as Record<string, { week: number; scores: Record<string, number> }>)
      : {};
    const w = weekId();
    const entry = data[challengeId] ?? { week: w, scores: {} };
    if (entry.week !== w) entry.scores = {};
    entry.week = w;
    entry.scores.you = Math.max(entry.scores.you ?? 0, score);
    data[challengeId] = entry;
    localStorage.setItem(WEEKLY_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/** Mock trust-circle leaderboard — replace with Circles trust graph API */
export function getMockCircleRank(params: {
  userScore: number;
  challengeId: string;
  playerName?: string;
}): CircleRankResult {
  recordWeeklyScore(params.challengeId, params.userScore);
  const seed = hashSeed(`${params.challengeId}-${weekId()}`);
  const peers: CirclePeerScore[] = MOCK_PEERS.map((name, i) => ({
    name,
    score: 520 + ((seed + i * 97) % 480),
  }));

  peers.push({
    name: params.playerName ?? "You",
    score: params.userScore,
    isYou: true,
  });

  peers.sort((a, b) => b.score - a.score);
  const rank = peers.findIndex((p) => p.isYou) + 1;
  const beatCount = peers.filter((p) => !p.isYou && params.userScore > p.score).length;

  return {
    rank,
    total: peers.length,
    beatCount,
    peers: peers.slice(0, 5),
  };
}
