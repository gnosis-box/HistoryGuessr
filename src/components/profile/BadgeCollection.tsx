import { honorificBadges } from "@/lib/reputation/badges";
import type { HonorificBadge } from "@/lib/reputation/types";

const tierRing: Record<HonorificBadge["tier"], string> = {
  bronze: "border-amber-600/50",
  silver: "border-slate-400/50",
  gold: "border-[var(--gold)]/50",
  legendary: "border-[var(--honor-ring)]",
};

interface BadgeCollectionProps {
  earnedIds: Set<string>;
  compact?: boolean;
}

export function BadgeCollection({
  earnedIds,
  compact = false,
}: BadgeCollectionProps) {
  const earnedCount = honorificBadges.filter((b) => earnedIds.has(b.id)).length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--text-muted)]">
        {earnedCount} / {honorificBadges.length} unlocked
      </p>
      <div
        className={
          compact
            ? "grid grid-cols-4 gap-2 sm:grid-cols-6"
            : "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
        }
      >
        {honorificBadges.map((b) => {
          const earned = earnedIds.has(b.id);
          return (
            <div
              key={b.id}
              title={b.title}
              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition ${
                earned
                  ? `${tierRing[b.tier]} bg-[var(--bg-card)]`
                  : "border-[var(--border-subtle)] opacity-35"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-display font-bold ${
                  earned
                    ? "bg-[var(--gold)]/20 text-[var(--gold-soft)]"
                    : "bg-[var(--bg-panel)] text-[var(--text-muted)]"
                }`}
                aria-hidden
              >
                {earned ? "★" : "·"}
              </span>
              <span className="mt-1.5 line-clamp-2 text-[10px] font-medium leading-tight text-[var(--text-secondary)]">
                {b.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
