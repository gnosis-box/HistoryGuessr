import { getDailyArchiveNumber, loadDailyStreak } from "@/data/dailyChallenge";

interface DailyChallengeCardProps {
  onPlayDaily: () => void;
}

export function DailyChallengeCard({ onPlayDaily }: DailyChallengeCardProps) {
  const archive = getDailyArchiveNumber();
  const { streak } = loadDailyStreak();

  return (
    <section className="glass-card rounded-2xl border-[var(--gold)]/25 p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Daily archive
          </p>
          <h2
            className="mt-2 flex items-end gap-1.5 text-[var(--text-primary)]"
            aria-label={`#${archive}`}
          >
            <span
              className="font-display pb-0.5 text-2xl font-semibold leading-none text-[var(--gold-soft)]"
              aria-hidden
            >
              #
            </span>
            <span className="flex items-end gap-px font-sans text-3xl font-semibold leading-none tabular-nums lining-nums">
              {String(archive).split("").map((digit, index) => (
                <span
                  key={`${index}-${digit}`}
                  className="inline-block min-w-[0.58em] text-center leading-none"
                  aria-hidden
                >
                  {digit}
                </span>
              ))}
            </span>
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            One challenge for everyone today · HIST capped · compare with your
            trust circle after you play.
          </p>
          {streak > 0 && (
            <p className="mt-2 text-sm font-medium text-[var(--success-soft)]">
              Streak: {streak} day{streak === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <button type="button" className="btn-primary shrink-0" onClick={onPlayDaily}>
          Play today&apos;s challenge
        </button>
      </div>
    </section>
  );
}
