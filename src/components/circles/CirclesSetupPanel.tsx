// src/components/circles/CirclesSetupPanel.tsx
import { useCircles } from "@/hooks/use-circles";
import { historyGuessrGroup } from "@/lib/circles/config";
import { downloadHistLedgerExport } from "@/lib/circles/ledgerExport";
import { getCirclesPlaygroundUrl } from "@/utils/appUrl";

export function CirclesSetupPanel() {
  const {
    address,
    isConnected,
    isMiniappHost,
    vouchStatus,
    trustsHistGroup,
    histTreasury,
    ledger,
  } = useCircles();

  const groupAddr = historyGuessrGroup.groupAddress;

  return (
    <section className="glass-card space-y-4 rounded-2xl border border-[var(--gold)]/20 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
          Circles · test & operator
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Align with{" "}
          <a
            href="https://docs.aboutcircles.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold-soft)] underline"
          >
            Circles docs
          </a>
          : trust graph, HIST group currency, treasury collateral.
        </p>
      </div>

      <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
        <li>
          Gnosis Safe:{" "}
          <code className="text-xs text-[var(--gold-soft)]">
            npm run hist:register-group-safe
          </code>{" "}
          (voir scripts/WALLET-GNOSIS-HIST.md)
        </li>
        <li>
          Set <code className="text-xs">VITE_HIST_GROUP_ADDRESS</code> → redeploy
        </li>
        <li>
          Check: <code className="text-xs">npm run hist:check</code>
        </li>
        <li>Trust the HIST group avatar in the Circles app (required for group tokens)</li>
        <li>
          Play in{" "}
          <a
            href={getCirclesPlaygroundUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold-soft)] underline"
          >
            Circles playground
          </a>
        </li>
        <li>
          Export ledger below →{" "}
          <code className="text-xs">npm run hist:distribute</code>
        </li>
      </ol>

      <dl className="grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-2">
        <div>
          <dt>HIST group</dt>
          <dd className="font-mono text-[var(--text-secondary)]">
            {groupAddr ?? "not configured"}
          </dd>
        </div>
        <div>
          <dt>Your status</dt>
          <dd className="text-[var(--text-secondary)]">
            {vouchStatus}
            {trustsHistGroup ? " · trusts HIST" : ""}
          </dd>
        </div>
        <div>
          <dt>Pending HIST</dt>
          <dd className="text-[var(--gold-soft)]">{ledger.pending}</dd>
        </div>
        <div>
          <dt>Treasury CRC</dt>
          <dd className="text-[var(--text-secondary)]">
            {histTreasury?.hasTreasury
              ? `~${histTreasury.collateralCrc}`
              : "—"}
          </dd>
        </div>
      </dl>

      {groupAddr && isConnected && !trustsHistGroup && (
        <p className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs text-sky-200">
          In the Circles app, trust group{" "}
          <span className="font-mono">{groupAddr}</span> to hold and receive HIST.
        </p>
      )}

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

      <p className="text-[10px] text-[var(--text-muted)]">
        CLI: <code>npm run test:circles</code> (SDK smoke) ·{" "}
        <code>npm run hist:check</code> · <code>npm run hist:distribute</code>
      </p>
    </section>
  );
}
