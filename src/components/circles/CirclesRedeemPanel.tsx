// src/components/circles/CirclesRedeemPanel.tsx
import { circlesHubContent } from "@/lib/circles/hubContent";
import { historyGuessrGroup } from "@/lib/circles/config";
import { useCircles } from "@/hooks/use-circles";
import { HistCurrencyCard } from "./HistCurrencyCard";

interface CirclesRedeemPanelProps {
  onOpenHist: () => void;
}

export function CirclesRedeemPanel({ onOpenHist }: CirclesRedeemPanelProps) {
  const { trustsHistGroup, isConnected } = useCircles();
  const { redeem } = circlesHubContent;

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
          {redeem.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {redeem.intro}
        </p>

        <ol className="mt-6 space-y-4">
          {redeem.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--map-green)]/15 text-sm font-bold text-[var(--map-green)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={redeem.circlesAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {redeem.circlesAppLabel}
          </a>
          <button type="button" className="btn-secondary" onClick={onOpenHist}>
            Détails {historyGuessrGroup.symbol} dans l’app
          </button>
          <a
            href={redeem.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            {redeem.docsLabel}
          </a>
        </div>

        {isConnected && (
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Groupe HIST :{" "}
            {trustsHistGroup
              ? "vous approuvez le groupe — échanges on-chain possibles."
              : "approuvez le groupe History Guessr dans Circles pour recevoir du HIST."}
          </p>
        )}
      </div>

      <HistCurrencyCard variant="compact" />
    </div>
  );
}
