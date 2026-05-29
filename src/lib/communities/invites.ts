// src/lib/communities/invites.ts
import type { Community } from "@/types/community";
import { getCommunity, normalizeAddress, saveCommunity } from "./storage";

export function appendCommunityInvite(
  communityId: string,
  address: string,
): Community | undefined {
  const community = getCommunity(communityId);
  if (!community) return undefined;

  const normalized = normalizeAddress(address);
  if (!normalized.startsWith("0x")) return undefined;
  if (community.inviteAddresses.some((a) => a === normalized)) {
    return community;
  }

  const updated: Community = {
    ...community,
    inviteAddresses: [...community.inviteAddresses, normalized],
  };
  saveCommunity(updated);
  return updated;
}
