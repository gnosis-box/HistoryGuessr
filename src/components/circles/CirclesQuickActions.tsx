// src/components/circles/CirclesQuickActions.tsx
import { circlesHubContent } from "@/lib/circles/hubContent";

interface CirclesQuickActionsProps {
  onDuel: () => void;
  onCreateCircle: () => void;
  onCreateQuiz: () => void;
  onHist: () => void;
}

export function CirclesQuickActions({
  onDuel,
  onCreateCircle,
  onCreateQuiz,
  onHist,
}: CirclesQuickActionsProps) {
  const items = [
    { ...circlesHubContent.actions.duel, onClick: onDuel, icon: "⚔" },
    {
      ...circlesHubContent.actions.createCircle,
      onClick: onCreateCircle,
      icon: "◯",
    },
    {
      ...circlesHubContent.actions.createQuiz,
      onClick: onCreateQuiz,
      icon: "✎",
    },
    { ...circlesHubContent.actions.hist, onClick: onHist, icon: "◎" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={item.onClick}
          className="glass-card group rounded-2xl p-5 text-left transition hover:border-[var(--gold)]/30"
        >
          <span className="text-2xl" aria-hidden>
            {item.icon}
          </span>
          <h3 className="mt-2 font-display text-lg font-semibold text-[var(--gold-soft)] group-hover:text-[var(--gold)]">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {item.description}
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-[var(--gold-soft)]">
            {item.cta} →
          </span>
        </button>
      ))}
    </div>
  );
}
