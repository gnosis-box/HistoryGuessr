import { historyGuessrGroup } from "./config";

export type VouchStatus = "guest" | "pending" | "member";

export interface VouchContext {
  isConnected: boolean;
  isHistMember: boolean;
  trustsHistGroup: boolean;
  trustGatePasses: boolean;
}

/** Resolve membership from Circles Groups + trust graph (replaces localStorage demo). */
export function resolveVouchStatus(ctx: VouchContext): VouchStatus {
  if (!ctx.isConnected) return "guest";
  if (ctx.isHistMember || ctx.trustsHistGroup) return "member";
  return "pending";
}

/** @deprecated Prefer buildHistRewardUiState in RewardPanel */
export function vouchCopy(status: VouchStatus): string {
  switch (status) {
    case "member":
      return `Connected to ${historyGuessrGroup.name} — full ${historyGuessrGroup.symbol} rewards.`;
    case "pending":
      return `Unlock on-chain ${historyGuessrGroup.symbol} by trusting Gnosis Group or the HIST group avatar.`;
    default:
      return "Connect Circles to link rewards to your wallet and trust graph.";
  }
}
