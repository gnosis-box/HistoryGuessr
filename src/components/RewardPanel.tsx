import { useMemo, useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { devRelaxTrust, historyGuessrGroup } from "@/lib/circles/config";
import { buildHistRewardUiState } from "@/lib/circles/histRewardStatus";
import type { RewardEligibility } from "@/lib/circles/rewards";
import { getCirclesPlaygroundUrl } from "@/utils/appUrl";
import { formatHist } from "@/utils/format";

interface RewardPanelProps {
  eligibility: RewardEligibility;
}

export function RewardPanel({ eligibility }: RewardPanelProps) {
  const {
    ledger,
    vouchStatus,
    trustGate,
    isConnected,
    isMiniappHost,
    claimRewards,
    trustsHistGroup,
    histTreasury,
  } = useCircles();
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  const ui = useMemo(
    () =>
      buildHistRewardUiState({
        vouchStatus,
        trustGate,
        isConnected,
        isMiniappHost,
        ledgerPending: ledger.pending,
        trustsHistGroup,
        eligibility,
      }),
    [
      vouchStatus,
      trustGate,
      isConnected,
      isMiniappHost,
      ledger.pending,
      trustsHistGroup,
      eligibility,
    ],
  );

  async function handleClaim() {
    const msg = await claimRewards();
    setClaimMsg(msg);
    window.setTimeout(() => setClaimMsg(null), 4000);
  }

  const canClickClaim = ui.showClaim && !ui.claimDisabledReason;

  return (
    <div className="mt-4 rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
        {historyGuessrGroup.symbol} · group currency
      </p>

      {eligibility.amount > 0 ? (
        <p className="mt-2 font-display text-2xl text-[var(--accent-soft)]">
          +{eligibility.amount} {historyGuessrGroup.symbol}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {eligibility.reason}
        </p>
      )}

      {devRelaxTrust && (
        <p className="mt-2 text-[10px] text-[var(--success)]">
          Demo mode · trust checks relaxed
        </p>
      )}

      {!devRelaxTrust && (
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{ui.statusLine}</p>
      )}

      {!devRelaxTrust && ui.actionLine && (
        <p className="mt-2 text-xs text-sky-300/90">{ui.actionLine}</p>
      )}

      {!devRelaxTrust && ui.trustLine && (
        <p className="mt-2 text-xs text-[var(--text-muted)]">{ui.trustLine}</p>
      )}

      {histTreasury?.hasTreasury && (
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          HIST treasury · ~{histTreasury.collateralCrc} CRC collateral
        </p>
      )}

      <p className="mt-3 text-xs text-[var(--text-secondary)]">
        Balance: {formatHist(ledger.pending + ledger.claimed)}{" "}
        {historyGuessrGroup.symbol}
        {ledger.pending > 0 && (
          <span className="text-[var(--text-muted)]">
            {" "}
            ({formatHist(ledger.pending)} pending)
          </span>
        )}
      </p>

      {ledger.pending > 0 && isConnected && (
        <>
          {canClickClaim ? (
            <button
              type="button"
              className="btn-secondary mt-3 text-sm"
              onClick={() => void handleClaim()}
            >
              Claim pending {historyGuessrGroup.symbol}
            </button>
          ) : (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {ui.claimDisabledReason ??
                "Claim unavailable on this session."}
              {!isMiniappHost && (
                <>
                  {" "}
                  <a
                    href={getCirclesPlaygroundUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--gold-soft)] underline"
                  >
                    Open in Circles
                  </a>
                </>
              )}
            </p>
          )}
        </>
      )}

      {!devRelaxTrust && ui.deployNote && (
        <p className="mt-3 text-[10px] text-amber-400/80">{ui.deployNote}</p>
      )}

      {claimMsg && (
        <p className="mt-2 text-xs text-[var(--success)]">{claimMsg}</p>
      )}
    </div>
  );
}
