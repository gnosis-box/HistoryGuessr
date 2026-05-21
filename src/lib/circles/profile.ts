import type { CirclesProfile } from "./types";
import { formatCrcBalance } from "./format";

export async function fetchCirclesProfile(
  address: string,
): Promise<CirclesProfile> {
  const { Sdk } = await import("@aboutcircles/sdk");
  const sdk = new Sdk();
  const view = await sdk.rpc.sdk.getProfileView(address as `0x${string}`);

  const trustConnections =
    (view.trustStats?.trustsCount ?? 0) +
    (view.trustStats?.trustedByCount ?? 0);

  return {
    address: view.address,
    name: view.profile?.name ?? undefined,
    avatarUrl:
      view.profile?.previewImageUrl ?? view.profile?.imageUrl ?? undefined,
    crcBalance: formatCrcBalance(view.v2Balance ?? view.v1Balance),
    trustConnections,
  };
}
