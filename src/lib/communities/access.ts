import { devRelaxTrust } from "@/lib/circles/config";
import type { Community } from "@/types/community";
import { normalizeAddress } from "./storage";

/** Who may play quizzes in this community (phase 1: link + invites + founder). */
export function canAccessCommunity(
  community: Community,
  playerAddress: string | null,
  options?: { viaShareLink?: boolean },
): { allowed: boolean; reason: string } {
  if (options?.viaShareLink) {
    return {
      allowed: true,
      reason: "Invite link — trusted circle quiz session.",
    };
  }
  if (devRelaxTrust) {
    return { allowed: true, reason: "Demo mode — access open for testing." };
  }

  if (community.visibility === "discoverable") {
    return {
      allowed: true,
      reason: "Public circle — anyone with the link can play.",
    };
  }

  const player = playerAddress ? normalizeAddress(playerAddress) : "";
  const founder = normalizeAddress(community.founderAddress);

  if (player && founder && player === founder) {
    return { allowed: true, reason: "You founded this circle." };
  }

  if (
    player &&
    community.inviteAddresses.some((a) => normalizeAddress(a) === player)
  ) {
    return { allowed: true, reason: "You were invited to this trusted circle." };
  }

  if (!player) {
    return {
      allowed: true,
      reason:
        "Guest play via invite link — connect Circles to record trust on your wallet.",
    };
  }

  return {
    allowed: false,
    reason:
      "Private circle — ask the founder to add your wallet to invites, or use the shared link as guest.",
  };
}
