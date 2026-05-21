import { historyGuessrGroup } from "./config";

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
