import { useCircles } from "@/hooks/use-circles";
import { getMockCircleRank } from "@/lib/circles/trustLeaderboard";

interface TrustCircleLeaderboardProps {
  userScore: number;
  challengeId: string;
  compact?: boolean;
}

export function TrustCircleLeaderboard({
  userScore,
  challengeId,
  compact,
}: TrustCircleLeaderboardProps) {
  const { profile, isConnected } = useCircles();
  const rank = getMockCircleRank({
    userScore,
    challengeId,
    playerName: profile.name ?? (isConnected ? "You" : "Guest"),
  });

  if (compact) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Among people you trust:{" "}
        <strong className="text-[var(--gold-soft)]">#{rank.rank}</strong> of{" "}
        {rank.total}
        {rank.beatCount > 0 && (
          <span className="text-[var(--success-soft)]">
            {" "}
            · beat {rank.beatCount}
          </span>
        )}
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-panel)]/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-sky-300/90">
        Trust circle · this week
      </p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Not a global leaderboard — scores among peers you would actually trust.
      </p>
      <ul className="mt-3 space-y-2">
        {rank.peers.map((peer, i) => (
          <li
            key={`${peer.name}-${i}`}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
              peer.isYou
                ? "border border-[var(--gold)]/30 bg-[var(--gold)]/10"
                : "bg-[var(--bg-card)]/60"
            }`}
          >
            <span className="text-[var(--text-secondary)]">
              #{i + 1}{" "}
              <span
                className={
                  peer.isYou
                    ? "font-semibold text-[var(--text-primary)]"
                    : "text-[var(--text-primary)]"
                }
              >
                {peer.name}
              </span>
            </span>
            <span className="font-medium tabular-nums text-[var(--gold-soft)]">
              {peer.score}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
