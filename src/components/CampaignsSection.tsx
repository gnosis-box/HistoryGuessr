import { historicalCampaigns } from "@/data/campaigns";
import { criticalCardBorder } from "@/utils/accentStyles";

interface CampaignsSectionProps {
  onStartCampaign: (campaignId: string) => void;
}

const accentBorder = {
  gold: "border-[var(--gold)]/35 hover:border-[var(--gold)]/60",
  map: "border-[var(--map-green)]/35 hover:border-[var(--map-green)]/60",
  critical: criticalCardBorder,
};

export function CampaignsSection({ onStartCampaign }: CampaignsSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">
          Historical campaigns
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Play a chapter — not a random mode. Each campaign chains clues into a
          period you actually traverse.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {historicalCampaigns.map((campaign) => (
          <article
            key={campaign.id}
            className={`glass-card flex flex-col rounded-2xl p-5 transition ${accentBorder[campaign.accent]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {campaign.era}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--gold-soft)]">
              {campaign.title}
            </h3>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {campaign.subtitle}
            </p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
              {campaign.description}
            </p>
            <p className="mt-4 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
              {campaign.steps.length} steps · spoilers hidden until you play
            </p>
            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={() => onStartCampaign(campaign.id)}
            >
              Start campaign · {campaign.steps.length} steps
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
