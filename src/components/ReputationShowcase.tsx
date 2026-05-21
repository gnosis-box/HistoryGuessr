import { useReputation } from "@/hooks/use-reputation";
import { usePlayNavigation } from "@/context/PlayNavigation";
import { BadgeCollection } from "./profile/BadgeCollection";

export function ReputationShowcase() {
  const { earnedBadgeList } = useReputation();
  const { openProfile } = usePlayNavigation();
  const earnedIds = new Set(earnedBadgeList.map((b) => b.id));

  return (
    <section className="glass-card space-y-4 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
          Achievements
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-[var(--gold)] hover:underline"
          onClick={openProfile}
        >
          Profile
        </button>
      </div>
      <BadgeCollection earnedIds={earnedIds} compact />
    </section>
  );
}
