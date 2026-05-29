import { useMemo } from "react";
import { useReputation } from "@/hooks/use-reputation";
import { useCircles } from "@/hooks/use-circles";
import { historyGuessrGroup } from "@/lib/circles/config";
import { badgeTierStyles } from "@/utils/accentStyles";
import { formatHist } from "@/utils/format";
import { BadgeCollection } from "./BadgeCollection";
import { HistWalletTeaser } from "@/components/hist/HistWalletTeaser";
import { TrustGraphView } from "@/components/circles/TrustGraphView";

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function rankProgress(prestige: number): { pct: number; nextLabel: string | null } {
  if (prestige < 12) {
    return { pct: (prestige / 12) * 100, nextLabel: "Scholar" };
  }
  if (prestige < 30) {
    return { pct: ((prestige - 12) / (30 - 12)) * 100, nextLabel: "Master" };
  }
  if (prestige < 55) {
    return { pct: ((prestige - 30) / (55 - 30)) * 100, nextLabel: "Legend" };
  }
  return { pct: 100, nextLabel: null };
}

export function PlayerProfileScreen() {
  const {
    address,
    isConnected,
    ledger,
    profile,
    trustPeers,
    trustsHistGroup,
    isLoadingProfile,
  } = useCircles();
  const { reputation, currentTitle, earnedBadgeList } = useReputation();
  const earnedIds = useMemo(
    () => new Set(earnedBadgeList.map((b) => b.id)),
    [earnedBadgeList],
  );

  const displayName = isConnected
    ? (profile.name ?? "Player")
    : "Guest";

  const histBalance = formatHist(ledger.pending + ledger.claimed);
  const progress = rankProgress(reputation.prestige);
  const recentRewards = ledger.entries.slice(0, 5);

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-up">
      <section className="glass-card overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent px-5 py-6 sm:px-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-display text-2xl font-bold ${badgeTierStyles[currentTitle.tier]}`}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-2xl font-semibold text-[var(--text-primary)]">
                {displayName}
              </h1>
              <p className="truncate text-sm text-[var(--gold-soft)]">
                {currentTitle.title}
              </p>
              {address && (
                <p className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                  {shortenAddress(address)}
                </p>
              )}
            </div>
          </div>

          {progress.nextLabel && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                <span>Rank progress</span>
                <span>→ {progress.nextLabel}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--bg-card)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)] transition-all"
                  style={{ width: `${Math.min(100, progress.pct)}%` }}
                />
              </div>
            </div>
          )}

          <dl className="mt-5 grid grid-cols-4 gap-2 text-center">
            <Stat label="Best" value={`${reputation.bestScore}`} />
            <Stat label="Plays" value={String(reputation.totalRounds)} />
            <Stat
              label="Badges"
              value={`${earnedBadgeList.length}`}
            />
            <Stat
              label={historyGuessrGroup.symbol}
              value={histBalance}
              highlight
            />
          </dl>
        </div>

        {!isConnected && (
          <p className="border-t border-[var(--border-subtle)] px-5 py-3 text-xs text-[var(--text-muted)]">
            Connect Circles to save {historyGuessrGroup.symbol} on-chain.
          </p>
        )}
      </section>

      <TrustGraphView
        trustPeers={trustPeers}
        selfLabel={displayName}
        trustsHistGroup={trustsHistGroup}
        isLoading={isLoadingProfile}
        isConnected={isConnected}
      />

      <HistWalletTeaser />

      <section className="glass-card rounded-2xl p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Achievements
        </h2>
        <div className="mt-4">
          <BadgeCollection earnedIds={earnedIds} />
        </div>
      </section>

      {recentRewards.length > 0 && (
        <section className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Recent runs
          </h2>
          <ul className="mt-3 space-y-1.5">
            {recentRewards.map((entry) => (
              <li
                key={entry.id}
                className="flex justify-between text-sm tabular-nums"
              >
                <span className="text-[var(--gold-soft)]">
                  +{formatHist(entry.amount)} {historyGuessrGroup.symbol}
                </span>
                <span className="text-[var(--text-muted)]">
                  {entry.score} pts
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </dt>
      <dd
        className={`mt-0.5 font-display text-lg font-semibold ${
          highlight ? "text-[var(--gold-soft)]" : "text-[var(--text-primary)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
