// src/components/circles/TrustFriendsPanel.tsx
import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { useCommunities } from "@/hooks/use-communities";
import { appendCommunityInvite } from "@/lib/communities/invites";
import { circlesHubContent } from "@/lib/circles/hubContent";
import { peerDisplayName } from "@/lib/circles/trustGraph";
import { TrustGraphView } from "./TrustGraphView";

interface TrustFriendsPanelProps {
  onChallengePeer: () => void;
}

export function TrustFriendsPanel({ onChallengePeer }: TrustFriendsPanelProps) {
  const { isConnected, isLoadingProfile, trustPeers, profile, trustsHistGroup } =
    useCircles();
  const { communities, refresh } = useCommunities();
  const [status, setStatus] = useState<string | null>(null);
  const [inviteFor, setInviteFor] = useState<Record<string, string>>({});

  const { friends } = circlesHubContent;

  async function copyAddress(addr: string) {
    try {
      await navigator.clipboard.writeText(addr);
      setStatus(`${addr.slice(0, 6)}…${friends.copied}`);
      window.setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus("error");
    }
  }

  function handleInvite(peerAddress: string) {
    const communityId = inviteFor[peerAddress];
    if (!communityId) return;
    const updated = appendCommunityInvite(communityId, peerAddress);
    if (updated) {
      refresh();
      setStatus(friends.invited);
      window.setTimeout(() => setStatus(null), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          {friends.title}
        </h2>
        {status && (
          <p className="mt-2 text-sm text-[var(--map-green)]">{status}</p>
        )}

        {!isConnected && (
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Connectez Circles pour voir votre graphe de confiance.
          </p>
        )}

        {isConnected && !isLoadingProfile && trustPeers.length === 0 && (
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            {friends.empty}
          </p>
        )}

        {trustPeers.length > 0 && (
          <ul className="mt-4 space-y-3">
            {trustPeers.map((peer) => (
              <li
                key={peer.address}
                className="flex flex-col gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {peerDisplayName(peer)}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-muted)]">
                    {peer.address}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="btn-primary text-sm"
                    onClick={onChallengePeer}
                  >
                    {friends.duel}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-sm"
                    onClick={() => void copyAddress(peer.address)}
                  >
                    {friends.copyWallet}
                  </button>
                  {communities.length > 0 && (
                    <>
                      <select
                        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-1.5 text-xs text-[var(--text-primary)]"
                        value={inviteFor[peer.address] ?? ""}
                        onChange={(e) =>
                          setInviteFor((prev) => ({
                            ...prev,
                            [peer.address]: e.target.value,
                          }))
                        }
                        aria-label={friends.pickCircle}
                      >
                        <option value="">{friends.pickCircle}</option>
                        {communities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn-secondary text-sm"
                        disabled={!inviteFor[peer.address]}
                        onClick={() => handleInvite(peer.address)}
                      >
                        {friends.inviteToCircle}
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <TrustGraphView
        trustPeers={trustPeers}
        selfLabel={profile.name || "You"}
        trustsHistGroup={trustsHistGroup}
        isLoading={isLoadingProfile}
        isConnected={isConnected}
        compact
      />
    </div>
  );
}
