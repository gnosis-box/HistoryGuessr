import { getChallengesByType } from "@/data/catalog";
import { calculateHistReward } from "@/lib/circles/rewards";
import { getPlayModeGroup, type PlayModeNavItem } from "@/data/playModes";
import { difficultyStyles } from "@/utils/labels";
import { challengeModes } from "@/data/challengeModes";

interface ModeCategoryScreenProps {
  groupId: string;
  onPlayMode: (type: PlayModeNavItem["type"]) => void;
}

export function ModeCategoryScreen({
  groupId,
  onPlayMode,
}: ModeCategoryScreenProps) {
  const group = getPlayModeGroup(groupId);
  if (!group) return null;

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          {group.label}
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
          {group.tagline}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {group.modes.map((mode) => {
          const count = getChallengesByType(mode.type).length;
          const meta = challengeModes.find((m) => m.type === mode.type);
          const maxHist = meta
            ? calculateHistReward(1000, meta.difficulty)
            : 0;

          return (
            <button
              key={mode.type}
              type="button"
              onClick={() => onPlayMode(mode.type)}
              className="glass-card group flex flex-col rounded-2xl p-5 text-left transition hover:border-[var(--gold)]/40 hover:shadow-[0_8px_28px_rgba(201,164,92,0.08)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-2xl font-semibold text-[var(--gold-soft)] group-hover:text-[var(--gold)]">
                  {mode.label}
                </h2>
                {meta && (
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${difficultyStyles[meta.difficulty]}`}
                  >
                    {meta.difficulty}
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {mode.description}
              </p>
              <p className="mt-4 text-xs text-[var(--text-muted)]">
                {count} challenge{count === 1 ? "" : "s"}
                {maxHist > 0 && (
                  <>
                    {" "}
                    · up to <span className="text-[var(--gold)]">{maxHist} HIST</span>
                  </>
                )}
              </p>
              <span className="mt-4 text-sm font-medium text-[var(--gold)]">
                Play →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
