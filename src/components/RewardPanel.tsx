import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { devRelaxTrust, historyGuessrGroup } from "@/lib/circles/config";
import { vouchCopy } from "@/lib/circles/vouching";
import type { RewardEligibility } from "@/lib/circles/rewards";
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
    address,
    trustsHistGroup,
    histTreasury,
  } = useCircles();
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  async function handleClaim() {
    const msg = await claimRewards();
    setClaimMsg(msg);
    window.setTimeout(() => setClaimMsg(null), 4000);
  }

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

      {eligibility.reason && eligibility.amount > 0 && (
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {eligibility.reason}
        </p>
      )}

      {devRelaxTrust && (
        <p className="mt-2 text-[10px] text-[var(--success)]">
          Demo mode · trust checks relaxed
        </p>
      )}

      {!devRelaxTrust && (
        <>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {vouchCopy(vouchStatus)}
          </p>
          {trustGate && isConnected && (
            <p className="mt-1 text-xs text-[var(--text-secondary)]/80">
              Trust vs Gnosis Group:{" "}
              {(trustGate.relativeScore * 100).toFixed(1)}% ·{" "}
              {trustGate.targetsReached}/{trustGate.totalTargets} targets
              {trustsHistGroup && " · you trust HIST group"}
            </p>
          )}
          {histTreasury?.hasTreasury && (
            <p className="mt-1 text-xs text-[var(--text-secondary)]/80">
              HIST treasury collateral: ~{histTreasury.collateralCrc} CRC locked
              for group rewards.
            </p>
          )}
        </>
      )}

      <p className="mt-2 text-xs text-[var(--text-secondary)]">
        Balance: {formatHist(ledger.pending + ledger.claimed)}{" "}
        {historyGuessrGroup.symbol} ({formatHist(ledger.pending)} pending)
      </p>

      {ledger.pending > 0 && isConnected && isMiniappHost && (
        <button
          type="button"
          className="btn-secondary mt-3 text-sm"
          onClick={() => void handleClaim()}
        >
          Claim pending {historyGuessrGroup.symbol}
        </button>
      )}

      {!devRelaxTrust && vouchStatus === "pending" && address && (
        <p className="mt-2 text-xs text-sky-300/90">
          Trust the {historyGuessrGroup.name} group avatar in Circles, or reach
          the Gnosis Group trust anchor to unlock full {historyGuessrGroup.symbol}.
        </p>
      )}

      {!historyGuessrGroup.groupAddress && (
        <p className="mt-2 text-xs text-amber-400/90">
          Run <code className="text-[var(--gold-soft)]">npm run hist:register-group</code>{" "}
          and set <code className="text-[var(--gold-soft)]">VITE_HIST_GROUP_ADDRESS</code> on
          Vercel.
        </p>
      )}

      {claimMsg && (
        <p className="mt-2 text-xs text-[var(--success)]">{claimMsg}</p>
      )}
    </div>
  );
}
