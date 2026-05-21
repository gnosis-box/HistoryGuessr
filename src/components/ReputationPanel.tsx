import type { HonorificBadge, RoundHonorific } from "@/lib/reputation/types";
import { useReputation } from "@/hooks/use-reputation";
import {
  badgeTierStyles,
  honorLabelClass,
  honorPanelClass,
} from "@/utils/accentStyles";

function BadgeChip({ badge, isNew }: { badge: HonorificBadge; isNew?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${badgeTierStyles[badge.tier]}`}
    >
      <div className="flex items-center gap-2">
        <span className="font-display text-sm font-semibold">{badge.title}</span>
        {isNew && (
          <span className="rounded-full bg-[var(--success)]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[var(--success)]">
            New
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs italic opacity-90">{badge.epithet}</p>
    </div>
  );
}

interface ReputationPanelProps {
  roundHonorific: RoundHonorific;
  newBadges: HonorificBadge[];
}

export function ReputationPanel({
  roundHonorific,
  newBadges,
}: ReputationPanelProps) {
  const { currentTitle, reputation, earnedBadgeList } = useReputation();

  return (
    <div className={`mt-4 p-4 ${honorPanelClass}`}>
      <p className={honorLabelClass}>
        Reputation · not for sale
      </p>

      <p className="mt-2 font-display text-2xl text-[var(--text-primary)]">
        {roundHonorific.headline}
      </p>
      <p className="text-sm text-[var(--accent-soft)]">{roundHonorific.subtitle}</p>
      <p className="mt-1 text-xs italic text-[var(--text-secondary)]">
        {roundHonorific.flair}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${badgeTierStyles[roundHonorific.tier]}`}
        >
          {roundHonorific.tier} round
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          Current title:{" "}
          <strong className="text-[var(--text-primary)]">{currentTitle.title}</strong>
        </span>
      </div>
      <p className="mt-1 text-xs italic text-[var(--text-secondary)]">
        {currentTitle.epithet}
      </p>

      {newBadges.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className={`${honorLabelClass} tracking-wide`}>
            Badge{newBadges.length > 1 ? "s" : ""} unlocked
          </p>
          {newBadges.map((b) => (
            <BadgeChip key={b.id} badge={b} isNew />
          ))}
        </div>
      )}

      {earnedBadgeList.length > 0 && (
        <p className="mt-3 text-xs text-[var(--text-secondary)]">
          Collection : {earnedBadgeList.length} badge
          {earnedBadgeList.length > 1 ? "s" : ""} · {reputation.totalRounds} rounds ·
          best {reputation.bestScore}/1000
        </p>
      )}

      <p className="mt-3 border-t border-white/5 pt-3 text-[10px] text-[var(--text-secondary)]">
        HIST = group currency (Circles). Reputation = merit, sources, and peer
        validation — vouching soon.
      </p>
    </div>
  );
}
