// src/components/play/TrustDuelScreen.tsx
import { useMemo } from "react";
import { getChallengesByType } from "@/data/catalog";
import { useCircles } from "@/hooks/use-circles";
import { peerDisplayName } from "@/lib/circles/trustGraph";
import { getPeerBenchmarkScore } from "@/lib/circles/trustLeaderboard";
import { createFriendChallengeFrom } from "@/utils/friendChallenge";
import type { GameChallenge } from "@/types/game";
import { getCirclesPlaygroundUrl } from "@/utils/appUrl";

interface TrustDuelScreenProps {
  onStartDuel: (challenge: GameChallenge) => void;
  onBack: () => void;
}

export function TrustDuelScreen({ onStartDuel, onBack }: TrustDuelScreenProps) {
  const { isConnected, isLoadingProfile, trustPeers, profile } = useCircles();

  const mapPool = useMemo(() => getChallengesByType("place_guess"), []);

  function pickChallengeForPeer(peerAddress: string) {
    if (mapPool.length === 0) return null;
    let h = 0;
    for (let i = 0; i < peerAddress.length; i++) {
      h = (h * 31 + peerAddress.charCodeAt(i)) >>> 0;
    }
    return mapPool[h % mapPool.length];
  }

  function startWithPeer(peer: (typeof trustPeers)[number]) {
    const source = pickChallengeForPeer(peer.address);
    if (!source) return;
    const opponentScore = getPeerBenchmarkScore(source.id, peer.address);
    const duel = createFriendChallengeFrom(
      source,
      opponentScore,
      peerDisplayName(peer),
    );
    if (duel) onStartDuel(duel);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <button
        type="button"
        className="text-sm text-[var(--text-muted)] hover:text-[var(--gold-soft)]"
        onClick={onBack}
      >
        ← Back to Map
      </button>

      <header>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
          Trust duel
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Challenge someone from your{" "}
          <a
            href="https://docs.aboutcircles.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold-soft)] underline"
          >
            Circles trust graph
          </a>
          . Duels use real profile names — scores compare on the same map clue.
        </p>
      </header>

      {!isConnected && (
        <p className="glass-card rounded-xl p-4 text-sm text-sky-200">
          Connect in the{" "}
          <a
            href={getCirclesPlaygroundUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Circles playground
          </a>{" "}
          to load people you trust.
        </p>
      )}

      {isConnected && isLoadingProfile && (
        <p className="text-sm text-[var(--text-muted)]">Loading trust graph…</p>
      )}

      {isConnected && !isLoadingProfile && trustPeers.length === 0 && (
        <p className="glass-card rounded-xl p-4 text-sm text-[var(--text-secondary)]">
          {profile.name ?? "Your avatar"} has no human trust links loaded yet.
          Trust historians in Circles, then return here to duel them on the map.
        </p>
      )}

      {trustPeers.length > 0 && (
        <ul className="space-y-3">
          {trustPeers.map((peer) => (
            <li
              key={peer.address}
              className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
            >
              <div>
                <p className="font-display font-semibold text-[var(--text-primary)]">
                  {peerDisplayName(peer)}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {peer.relation === "mutual"
                    ? "Mutual trust"
                    : peer.relation === "trusts"
                      ? "You trust them"
                      : "They trust you"}
                </p>
              </div>
              <button
                type="button"
                className="btn-primary text-sm"
                disabled={mapPool.length === 0}
                onClick={() => startWithPeer(peer)}
              >
                Duel on map
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
