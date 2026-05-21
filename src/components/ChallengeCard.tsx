import type { GameChallenge } from "@/types/game";
import { challengeModes } from "@/data/challengeModes";

type HistoricalChallenge = GameChallenge;
import { difficultyStyles } from "@/utils/labels";

interface ChallengeCardProps {
  challenge: HistoricalChallenge;
  challengeNumber: number;
  totalChallenges: number;
  modeName?: string;
}

export function ChallengeCard({
  challenge,
  challengeNumber,
  totalChallenges,
  modeName: modeNameProp,
}: ChallengeCardProps) {
  const modeMeta = challengeModes.find((m) => m.type === challenge.type);
  const modeName = modeNameProp ?? modeMeta?.name ?? challenge.type;

  return (
    <article className="glass-card animate-fade-up rounded-2xl p-5 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {modeName}
          </p>
          <span className="rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--success)]">
            Playable
          </span>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          Challenge {challengeNumber} / {totalChallenges}
        </span>
      </div>

      <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
        {challenge.title}
      </h2>

      <blockquote className="mt-4 border-l-2 border-[var(--accent)]/50 pl-4 font-display text-lg italic leading-relaxed text-[var(--text-primary)] sm:text-xl">
        &ldquo;{challenge.clue}&rdquo;
      </blockquote>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
        {challenge.period && (
          <span>
            <span className="text-[var(--text-primary)]/70">Period:</span>{" "}
            {challenge.period}
          </span>
        )}
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${difficultyStyles[challenge.difficulty]}`}
        >
          {challenge.difficulty}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {challenge.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--surface-soft)] px-2.5 py-0.5 text-xs text-[var(--text-secondary)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
