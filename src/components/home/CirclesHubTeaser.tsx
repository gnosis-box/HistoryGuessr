// src/components/home/CirclesHubTeaser.tsx
import { circlesHubContent } from "@/lib/circles/hubContent";
import { usePlayNavigation } from "@/context/PlayNavigation";

export function CirclesHubTeaser() {
  const { openCommunities, openTrustDuel, openHist } = usePlayNavigation();
  const { actions } = circlesHubContent;

  const cards = [
    { ...actions.duel, onClick: openTrustDuel },
    { ...actions.createCircle, onClick: openCommunities },
    { ...actions.hist, onClick: openHist },
  ];

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--map-green)]">
          Circles
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text-primary)]">
          Play, invite, redeem
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
          All Circles social features in one place: trust-graph duels, circles
          with shared quizzes, and HIST → CRC redemption.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className="glass-card rounded-2xl p-5 text-left transition hover:border-[var(--map-green)]/30"
          >
            <h3 className="font-display text-lg font-semibold text-[var(--gold-soft)]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {card.description}
            </p>
            <span className="mt-3 inline-block text-sm text-[var(--map-green)]">
              {card.cta} →
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="text-sm font-medium text-[var(--gold-soft)] hover:underline"
        onClick={openCommunities}
      >
        Open full Circles hub →
      </button>
    </section>
  );
}
