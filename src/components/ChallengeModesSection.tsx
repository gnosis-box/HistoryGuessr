import { challengeModes } from "@/data/challengeModes";
import { getChallengesByType } from "@/data/catalog";
import { difficultyStyles, statusLabels, statusStyles } from "@/utils/labels";
import type { ChallengeType } from "@/types/game";

interface ChallengeModesSectionProps {
  onPlayMode: (type: ChallengeType) => void;
}

export function ChallengeModesSection({ onPlayMode }: ChallengeModesSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          Many ways to play with the past
        </h2>
        <p className="mt-3 max-w-3xl text-[var(--text-secondary)] leading-relaxed">
          History Guessr is a modular playground for historical memory: maps,
          dates, people, sources, journeys and social challenges. Pick a mode
          below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {challengeModes.map((mode) => {
          const count = getChallengesByType(mode.type).length;
          return (
            <article
              key={mode.type}
              className="group glass-card flex flex-col rounded-2xl p-5 transition hover:border-[var(--accent)]/40 hover:shadow-[0_8px_32px_rgba(214,169,79,0.08)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-xl font-semibold text-[var(--accent-soft)]">
                  {mode.name}
                </h3>
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

              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                {mode.tagline}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {mode.description}
              </p>

              <blockquote className="mt-4 rounded-lg border border-white/5 bg-[var(--surface-soft)]/60 px-3 py-2.5 font-display text-sm italic leading-relaxed text-[var(--text-primary)]/90">
                {mode.example}
              </blockquote>

              {mode.circlesUseCase && (
                <p className="mt-3 text-xs text-sky-300/90">
                  <span className="font-semibold text-sky-300">Circles · </span>
                  {mode.circlesUseCase}
                </p>
              )}

              <button
                type="button"
                className="btn-primary mt-4 w-full"
                onClick={() => onPlayMode(mode.type)}
              >
                Play {mode.name}
                {count > 0 ? ` (${count})` : ""}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
