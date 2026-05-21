import { contentPacks } from "@/data/packs";
import { getChallengesByPack } from "@/data/catalog";
import { criticalCardBorderStatic } from "@/utils/accentStyles";

interface ContentPacksSectionProps {
  onPlayPack: (packId: string) => void;
}

const accentStyles = {
  gold: "border-[var(--gold)]/30",
  map: "border-[var(--map-green)]/30",
  critical: criticalCardBorderStatic,
  empire: "border-[var(--map-blue)]/30",
};

export function ContentPacksSection({ onPlayPack }: ContentPacksSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
          Content packs
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
          Deep dives by place and theme — {contentPacks.reduce((n, p) => n + p.challengeIds.length, 0)}{" "}
          curated challenges across four packs.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {contentPacks.map((pack) => {
          const count = getChallengesByPack(pack.id).length;
          return (
            <article
              key={pack.id}
              className={`glass-card rounded-2xl p-5 ${accentStyles[pack.accent]}`}
            >
              <h3 className="font-display text-2xl font-semibold text-[var(--gold-soft)]">
                {pack.name}
              </h3>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {pack.tagline}
              </p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {pack.description}
              </p>
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                {count} challenges
              </p>
              <button
                type="button"
                className="btn-primary mt-4 w-full"
                onClick={() => onPlayPack(pack.id)}
              >
                Play pack
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
