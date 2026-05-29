import { CampaignsSection } from "./CampaignsSection";
import { ContentPacksSection } from "./ContentPacksSection";
import { DailyChallengeCard } from "./DailyChallengeCard";
import { CirclesHubTeaser } from "./home/CirclesHubTeaser";
import { HomePillars } from "./HomePillars";
import { ReputationShowcase } from "./ReputationShowcase";
import { usePlayNavigation } from "@/context/PlayNavigation";
import { playModeGroups } from "@/data/playModes";
import { getCirclesPlaygroundUrl } from "@/utils/appUrl";

interface HomeScreenProps {
  onStartCampaign: (campaignId: string) => void;
  onPlayPack: (packId: string) => void;
}

export function HomeScreen({ onStartCampaign, onPlayPack }: HomeScreenProps) {
  const { startDaily, startRandom, openCategory, openCommunities, openHist } =
    usePlayNavigation();

  return (
    <div className="space-y-12">
      <section className="glass-card animate-fade-up relative overflow-hidden rounded-2xl p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--gold)]/5 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--map-green)]/10 blur-3xl"
          aria-hidden
        />
        <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          GeoGuessr for history · powered by social trust
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl">
          History Guessr
        </h1>
        <p className="mt-2 font-display text-xl italic text-[var(--gold-soft)]">
          Guess where history happened.
        </p>
        <p className="mt-6 max-w-2xl leading-relaxed text-[var(--text-secondary)]">
          Read the clue. Place the event. Challenge your circle. History Guessr
          turns historical memory into a social game — locate on the map, order
          a timeline, name a figure, or spot what can be trusted. Built for{" "}
          <a
            href="https://aboutcircles.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold-soft)] underline decoration-[var(--gold)]/30 hover:decoration-[var(--gold)]"
          >
            Circles
          </a>
          .
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={startRandom}>
            Play random challenge
          </button>
          <button type="button" className="btn-secondary" onClick={startDaily}>
            Today&apos;s daily
          </button>
          <button type="button" className="btn-secondary" onClick={openHist}>
            HIST economy
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={openCommunities}
          >
            Espace Circles
          </button>
          <a
            href={getCirclesPlaygroundUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Circles Playground
          </a>
        </div>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Start by category
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {playModeGroups.map((g) => (
              <button
                key={g.id}
                type="button"
                className="rounded-full border border-[var(--gold)]/25 bg-[var(--bg-card)]/80 px-4 py-2 text-sm font-medium text-[var(--gold-soft)] transition hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10"
                onClick={() => openCategory(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
        </div>
      </section>

      <CirclesHubTeaser />

      <HomePillars />

      <ReputationShowcase />

      <DailyChallengeCard onPlayDaily={startDaily} />

      <details className="glass-card group rounded-2xl p-5 sm:p-6">
        <summary className="cursor-pointer list-none font-display text-lg font-semibold text-[var(--gold-soft)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Campaigns & content packs
            <span className="text-sm font-normal text-[var(--text-muted)] group-open:rotate-180 transition">
              ▾
            </span>
          </span>
        </summary>
        <div className="mt-6 space-y-10 border-t border-[var(--border-subtle)] pt-6">
          <CampaignsSection onStartCampaign={onStartCampaign} />
          <ContentPacksSection onPlayPack={onPlayPack} />
        </div>
      </details>

    </div>
  );
}
