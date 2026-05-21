import type { CirclesProfile } from "./types";

export interface ProfileSearchHit {
  address: string;
  name?: string;
  description?: string;
  previewImageUrl?: string;
}

/** Search Circles profiles — [RPC Query Builder](https://aboutcircles.github.io/CirclesTools/rpcQueryView.html?method=circles_searchProfiles) */
export async function searchCirclesProfiles(
  query: string,
  limit = 8,
): Promise<ProfileSearchHit[]> {
  if (!query.trim()) return [];

  try {
    const { Sdk } = await import("@aboutcircles/sdk");
    const sdk = new Sdk();
    const res = await sdk.rpc.profile.searchProfiles(query.trim(), limit, 0);
    return res.map((row) => ({
      address: row.address,
      name: row.name,
      description: row.description,
      previewImageUrl: row.previewImageUrl,
    }));
  } catch {
    try {
      const { Sdk } = await import("@aboutcircles/sdk");
      const sdk = new Sdk();
      const res = await sdk.rpc.sdk.searchProfileByAddressOrName(
        query.trim(),
        limit,
      );
      return (res.results ?? []).map((p) => ({
        address: (p as { address?: string }).address ?? "",
        name: p.name,
        description: p.description,
        previewImageUrl: p.previewImageUrl,
      }));
    } catch {
      return [];
    }
  }
}

export function hitToCirclesProfile(hit: ProfileSearchHit): CirclesProfile {
  return {
    address: hit.address,
    name: hit.name,
    avatarUrl: hit.previewImageUrl,
  };
}
