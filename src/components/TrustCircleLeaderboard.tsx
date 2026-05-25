import { useMemo } from "react";
import { useCircles } from "@/hooks/use-circles";
import { getTrustCircleRank } from "@/lib/circles/trustLeaderboard";

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
  const { profile, isConnected, address, trustPeers } = useCircles();
  const rank = useMemo(
    () =>
      getTrustCircleRank({
        userScore,
        challengeId,
        playerAddress: address,
        playerName: profile.name ?? (isConnected ? "You" : "Guest"),
        trustPeers,
      }),
    [userScore, challengeId, address, profile.name, isConnected, trustPeers],
  );

  if (!rank) return null;

  if (compact) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        {rank.source === "trust_graph" ? (
          <>
            Among your Circles trust graph:{" "}
            <strong className="text-[var(--gold-soft)]">#{rank.rank}</strong> of{" "}
            {rank.total}
          </>
        ) : (
          <>Connect Circles to rank among people you trust — solo run for now.</>
        )}
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
        Trust graph · this week
      </p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        {rank.source === "trust_graph"
          ? "Scores among avatars linked by Circles trust — not a global leaderboard."
          : "Open in the Circles host to load your trust connections."}
      </p>
      <ul className="mt-3 space-y-2">
        {rank.peers.map((peer, i) => (
          <li
            key={`${peer.address ?? peer.name}-${i}`}
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
