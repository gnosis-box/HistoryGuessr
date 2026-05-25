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
  if (ctx.trustGatePasses) return "pending";
  return "pending";
}

export function vouchCopy(status: VouchStatus): string {
  switch (status) {
    case "member":
      return `Connected to ${historyGuessrGroup.name} — full ${historyGuessrGroup.symbol} rewards. Trust the HIST group in Circles to hold group currency.`;
    case "pending":
      return `Earn ${historyGuessrGroup.symbol} after trust from ${historyGuessrGroup.name} or the Gnosis Group anchor. Trust the HIST group avatar in Circles when it is deployed.`;
    default:
      return "Connect Circles to link rewards to your wallet and trust graph.";
  }
}
