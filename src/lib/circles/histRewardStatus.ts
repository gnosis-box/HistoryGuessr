// src/lib/circles/histRewardStatus.ts
import { historyGuessrGroup } from "./config";
import type { RewardEligibility } from "./rewards";
import type { TrustGateResult } from "./trust";
import type { VouchStatus } from "./vouching";

export interface HistRewardUiState {
  /** Short status under the amount */
  statusLine: string;
  /** One primary action for the player */
  actionLine: string | null;
  /** Operator-only deploy hint */
  deployNote: string | null;
  trustLine: string | null;
  showClaim: boolean;
  claimDisabledReason: string | null;
}

function shortenAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function buildHistRewardUiState(params: {
  vouchStatus: VouchStatus;
  trustGate: TrustGateResult | null;
  isConnected: boolean;
  isMiniappHost: boolean;
  ledgerPending: number;
  trustsHistGroup: boolean;
  eligibility: RewardEligibility;
}): HistRewardUiState {
  const sym = historyGuessrGroup.symbol;
  const groupDeployed = Boolean(historyGuessrGroup.groupAddress);
  const gnosis = historyGuessrGroup.gnosisGroupAddress;
  const gnosisShort = shortenAddr(gnosis);

  const trustPct = params.trustGate
    ? (params.trustGate.relativeScore * 100).toFixed(1)
    : null;
  const targets = params.trustGate
    ? `${params.trustGate.targetsReached}/${params.trustGate.totalTargets}`
    : null;

  const trustLine =
    params.isConnected && params.trustGate && !params.trustsHistGroup
      ? `Trust path · Gnosis Group ${gnosisShort}: ${trustPct}% · ${targets} targets${params.trustsHistGroup ? " · HIST group trusted" : ""}`
      : params.isConnected && params.trustGate && params.trustsHistGroup
        ? `Trust path · Gnosis Group ${gnosisShort}: ${trustPct}% · you trust HIST group`
        : null;

  const deployNote = groupDeployed
    ? null
    : `Operator: deploy HIST with npm run hist:register-group-safe, set VITE_HIST_GROUP_ADDRESS, redeploy.`;

  if (!params.isConnected) {
    return {
      statusLine: params.eligibility.reason ?? `Connect Circles to track ${sym}.`,
      actionLine: "Open History Guessr from the Circles playground with your wallet.",
      deployNote,
      trustLine: null,
      showClaim: false,
      claimDisabledReason: null,
    };
  }

  if (params.vouchStatus === "member" || params.trustsHistGroup) {
    return {
      statusLine: `Linked to ${historyGuessrGroup.name} — ${sym} rewards active.`,
      actionLine: groupDeployed
        ? null
        : `HIST group address not on this build yet — operator deploy still required for on-chain ${sym}.`,
      deployNote,
      trustLine,
      showClaim: params.ledgerPending > 0 && params.isMiniappHost && groupDeployed,
      claimDisabledReason: !groupDeployed
        ? `${sym} group not deployed on this deployment.`
        : !params.isMiniappHost
          ? "Open in Circles host to claim."
          : null,
    };
  }

  const hasPending = params.ledgerPending > 0;
  const trustOk = params.trustGate?.passesGate ?? false;

  if (hasPending && !trustOk) {
    return {
      statusLine: `${params.ledgerPending} ${sym} saved in this browser — not on-chain until trust unlocks.`,
      actionLine: `In the Circles app, trust Gnosis Group (${gnosisShort}) or the ${historyGuessrGroup.name} group avatar once deployed.`,
      deployNote,
      trustLine,
      showClaim: false,
      claimDisabledReason: `Trust Gnosis Group or ${sym} group first.`,
    };
  }

  if (!trustOk) {
    return {
      statusLine:
        params.eligibility.reason ??
        `Earn ${sym} after trust from ${historyGuessrGroup.name} or Gnosis Group.`,
      actionLine: `Trust Gnosis Group (${gnosisShort}) in Circles — search the avatar or paste the address in trust.`,
      deployNote,
      trustLine,
      showClaim: false,
      claimDisabledReason: null,
    };
  }

  return {
    statusLine: `Trust path open — ${sym} from this session counts toward your balance.`,
    actionLine: groupDeployed
      ? `Trust the ${historyGuessrGroup.name} group avatar in Circles for full group membership.`
      : null,
    deployNote,
    trustLine,
    showClaim:
      params.ledgerPending > 0 && params.isMiniappHost && groupDeployed,
    claimDisabledReason: null,
  };
}
