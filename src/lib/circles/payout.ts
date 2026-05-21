import { historyGuessrGroup } from "./config";
import { markPendingAsClaimed } from "./rewards";

/**
 * Claim pending HIST via host Safe (group treasury must fund transfers).
 * Production: encode ERC-20 transfer from group token contract.
 */
export async function claimPendingHist(
  amount: number,
): Promise<{ ok: boolean; message: string }> {
  if (!historyGuessrGroup.groupAddress) {
    return {
      ok: false,
      message: `${historyGuessrGroup.symbol} group not deployed yet — rewards stay in your local ledger until VITE_HIST_GROUP_ADDRESS is set.`,
    };
  }

  try {
    const { isMiniappMode } = await import("@aboutcircles/miniapp-sdk");
    if (!isMiniappMode()) {
      return {
        ok: false,
        message: "Open History Guessr in the Circles host to claim on-chain.",
      };
    }

    // User Safe cannot pull from group treasury directly.
    // Operator batch script: scripts/distribute-hist-rewards.mjs + setup-hist-group.md
    markPendingAsClaimed(amount);
    return {
      ok: true,
      message: `${amount} ${historyGuessrGroup.symbol} marked claimed in your ledger. On-chain transfer is batched by the HIST group operator.`,
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? err.message : "Claim failed — try again later.",
    };
  }
}
