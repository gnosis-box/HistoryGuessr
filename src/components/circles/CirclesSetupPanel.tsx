// src/components/circles/CirclesSetupPanel.tsx
import { useCircles } from "@/hooks/use-circles";
import { historyGuessrGroup } from "@/lib/circles/config";
import { downloadHistLedgerExport } from "@/lib/circles/ledgerExport";
import { getCirclesPlaygroundUrl } from "@/utils/appUrl";

/** Operator deploy checklist — shown on HIST → Builder tab only. */
export function CirclesSetupPanel() {
  const { address, isConnected, isMiniappHost, ledger } = useCircles();

  const groupAddr = historyGuessrGroup.groupAddress;
  const envHint =
    import.meta.env.MODE === "development"
      ? ".env.local + restart npm run dev"
      : "Vercel → Environment Variables → Redeploy";

  return (
    <section className="glass-card space-y-4 rounded-2xl border border-dashed border-[var(--gold)]/30 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
          Operator · deploy
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Register the group, set env vars, fund treasury, distribute rewards.
        </p>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
        <li>
          <code className="text-xs">npm run hist:register-group</code>
        </li>
        <li>
          <code className="text-xs">VITE_HIST_GROUP_ADDRESS</code> on Vercel →
          redeploy
        </li>
        <li>
          <code className="text-xs">npm run hist:check</code>
        </li>
        <li>Players trust the HIST group in Circles</li>
        <li>
          <code className="text-xs">npm run hist:distribute</code> after ledger
          export
        </li>
      </ol>

      <dl className="grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">
        <div>
          <dt>HIST group (public)</dt>
          <dd className="break-all font-mono text-[var(--text-secondary)]">
            {groupAddr ?? "not configured"}
          </dd>
          {!groupAddr && (
            <dd className="mt-1 text-[10px] text-amber-400/90">{envHint}</dd>
          )}
        </div>
        <div>
          <dt>Pending ledger</dt>
          <dd className="text-[var(--gold-soft)]">{ledger.pending}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary text-sm"
          disabled={!isConnected}
          onClick={() => downloadHistLedgerExport(address)}
        >
          Export HIST ledger (JSON)
        </button>
        {!isMiniappHost && (
          <a
            href={getCirclesPlaygroundUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Open playground
          </a>
        )}
      </div>
    </section>
  );
}
