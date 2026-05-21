import { challengeModes } from "@/data/challengeModes";
import { getChallengesByType } from "@/data/catalog";
import { modeCategories } from "@/data/modeCategories";
import { calculateHistReward } from "@/lib/circles/rewards";
import { criticalCardBorderStatic, signatureModeText } from "@/utils/accentStyles";
import { difficultyStyles, statusLabels, statusStyles } from "@/utils/labels";
import type { ChallengeType } from "@/types/game";

interface ChallengeModesSectionProps {
  onPlayMode: (type: ChallengeType) => void;
}

export function ChallengeModesSection({ onPlayMode }: ChallengeModesSectionProps) {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          Game modes
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-[var(--text-secondary)]">
          Eleven ways to play — grouped by how you engage with the past.
        </p>
      </div>

      {modeCategories.map((category) => {
        const modes = challengeModes.filter((m) =>
          category.types.includes(m.type),
        );
        return (
          <div key={category.id} className="space-y-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-[var(--gold-soft)]">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {category.tagline}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {modes.map((mode) => {
                const count = getChallengesByType(mode.type).length;
                const maxHist = calculateHistReward(1000, mode.difficulty);
                const isCritical = category.id === "critical";
                return (
                  <article
                    key={mode.type}
                    className={`group glass-card flex flex-col rounded-2xl p-5 transition hover:shadow-[0_8px_32px_rgba(201,164,92,0.06)] ${
                      mode.type === "source_detective"
                        ? `${criticalCardBorderStatic} hover:border-[color-mix(in_srgb,var(--steel)_50%,transparent)]`
                        : "hover:border-[var(--gold)]/35"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                        {mode.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[mode.status]}`}
                        >
                          {statusLabels[mode.status]}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${difficultyStyles[mode.difficulty]}`}
                        >
                          {mode.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 flex-1 text-sm font-medium text-[var(--gold-soft)]/90">
                      {mode.tagline}
                    </p>

                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      {count} challenge{count === 1 ? "" : "s"} · up to{" "}
                      <span className="text-[var(--gold)]">{maxHist} HIST</span>
                      {isCritical && mode.type === "source_detective" && (
                        <span className={signatureModeText}> · signature mode</span>
                      )}
                    </p>

                    <button
                      type="button"
                      className="btn-primary mt-4 w-full"
                      onClick={() => onPlayMode(mode.type)}
                    >
                      Play {mode.name}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
