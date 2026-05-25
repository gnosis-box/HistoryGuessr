import { historyGuessrGroup } from "./config";

/** User trusts the group avatar — required to hold group tokens ([docs](https://docs.aboutcircles.com/overview/how-it-works/group-currencies.md)). */
export async function userTrustsGroup(
  userAddress: string,
  groupAddress: string,
): Promise<boolean> {
  try {
    const { Sdk } = await import("@aboutcircles/sdk");
    const sdk = new Sdk();
    const rels = await sdk.data.getTrustRelations(userAddress as `0x${string}`);
    const target = groupAddress.toLowerCase();
    return rels.some(
      (row) =>
        row.relation === "trusts" &&
        row.objectAvatar.toLowerCase() === target,
    );
  } catch {
    return false;
  }
}

export async function isHistGroupMember(
  userAddress: string,
): Promise<boolean> {
  const group = historyGuessrGroup.groupAddress;
  if (!group) return false;

  try {
    const { Sdk } = await import("@aboutcircles/sdk");
    const sdk = new Sdk();
    const page = await sdk.groups.getMembers(group as `0x${string}`, 200);
    const normalized = userAddress.toLowerCase();
    return page.results.some(
      (row) => row.member?.toLowerCase() === normalized,
    );
  } catch {
    return false;
  }
}

export async function fetchGroupTreasuryBalances(): Promise<
  { symbol?: string; balance: string }[]
> {
  const group = historyGuessrGroup.groupAddress;
  if (!group) return [];

  try {
    const { Sdk } = await import("@aboutcircles/sdk");
    const sdk = new Sdk();
    const tokens = await sdk.groups.getCollateral(group as `0x${string}`);
    return tokens.map((t) => ({
      symbol: t.isGroup ? "GROUP" : "CRC",
      balance: String(t.crc ?? t.circles),
    }));
  } catch {
    return [];
  }
}

export interface GroupTreasurySummary {
  groupSymbol: string;
  collateralCrc: number;
  hasTreasury: boolean;
}

export async function fetchHistGroupTreasury(): Promise<GroupTreasurySummary> {
  const group = historyGuessrGroup.groupAddress;
  if (!group) {
    return { groupSymbol: historyGuessrGroup.symbol, collateralCrc: 0, hasTreasury: false };
  }

  try {
    const balances = await fetchGroupTreasuryBalances();
    const collateralCrc = balances.reduce((sum, row) => {
      const n = Number(row.balance);
      return sum + (Number.isFinite(n) ? n : 0);
    }, 0);
    return {
      groupSymbol: historyGuessrGroup.symbol,
      collateralCrc: Math.round(collateralCrc * 100) / 100,
      hasTreasury: true,
    };
  } catch {
    return { groupSymbol: historyGuessrGroup.symbol, collateralCrc: 0, hasTreasury: true };
  }
}
