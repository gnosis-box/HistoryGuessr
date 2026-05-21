import { ChallengeModesSection } from "./ChallengeModesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FutureCirclesPanel } from "./FutureCirclesPanel";
import { BuilderResourcesPanel } from "./BuilderResourcesPanel";
import type { ChallengeType } from "@/types/game";

interface HomeScreenProps {
  onStart: () => void;
  onRandom: () => void;
  onPlayMode: (type: ChallengeType) => void;
}

export function HomeScreen({ onStart, onRandom, onPlayMode }: HomeScreenProps) {
  return (
    <div className="space-y-14">
      <section className="glass-card animate-fade-up rounded-2xl p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          A platform for historical challenges
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl">
          History Guessr
        </h1>
        <p className="mt-2 font-display text-xl italic text-[var(--accent-soft)]">
          Guess where history happened.
        </p>
        <p className="mt-6 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
          Explore the past through places, dates, figures, quotes, images,
          sources and journeys. All eleven challenge types are playable in this
          build — Circles wallet integration comes next.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={onStart}>
            Play Place Guess
          </button>
          <button type="button" className="btn-secondary" onClick={onRandom}>
            Random challenge
          </button>
        </div>
      </section>

      <HowItWorksSection />
      <ChallengeModesSection onPlayMode={onPlayMode} />
      <FutureCirclesPanel variant="full" />
      <BuilderResourcesPanel />
    </div>
  );
}
