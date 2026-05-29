import { useMemo } from "react";
import { useCircles } from "@/hooks/use-circles";
import { usePlayNavigation } from "@/context/PlayNavigation";
import { devRelaxTrust, historyGuessrGroup } from "@/lib/circles/config";
import { buildHistRewardUiState } from "@/lib/circles/histRewardStatus";
import type { RewardEligibility } from "@/lib/circles/rewards";
import { formatHist } from "@/utils/format";

interface RewardPanelProps {
  eligibility: RewardEligibility;
}

export function RewardPanel({ eligibility }: RewardPanelProps) {
  const { openHist } = usePlayNavigation();
  const {
    ledger,
    vouchStatus,
    trustGate,
    isConnected,
    isMiniappHost,
    trustsHistGroup,
  } = useCircles();

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

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/5 px-4 py-3">
        {eligibility.amount > 0 ? (
          <p className="font-display text-2xl text-[var(--gold-soft)]">
            +{eligibility.amount} {historyGuessrGroup.symbol}
          </p>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">
            {eligibility.reason}
          </p>
        )}

        {eligibility.amount > 0 && eligibility.reason && (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {eligibility.reason}
          </p>
        )}

        {!devRelaxTrust && ui.statusLine && (
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {ui.statusLine}
          </p>
        )}

        {devRelaxTrust && (
          <p className="mt-2 text-[10px] text-[var(--success)]">
            Demo mode · trust checks relaxed
          </p>
        )}

        <p className="mt-2 text-xs tabular-nums text-[var(--text-muted)]">
          Balance · {formatHist(ledger.pending + ledger.claimed)}{" "}
          {historyGuessrGroup.symbol}
        </p>

        <button
          type="button"
          className="mt-3 text-xs font-medium text-[var(--gold-soft)] underline underline-offset-2"
          onClick={openHist}
        >
          HIST tab — play more, earn more, HIST → CRC explained
        </button>
      </div>
    </div>
  );
}
