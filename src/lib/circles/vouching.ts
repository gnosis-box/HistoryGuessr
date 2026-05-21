import { historyGuessrGroup } from "./config";

export type VouchStatus = "guest" | "pending" | "member";

const VOUCH_KEY = "history-guessr-vouch";

export function getVouchStatus(address: string | null): VouchStatus {
  if (!address) return "guest";
  try {
    const raw = localStorage.getItem(VOUCH_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, VouchStatus>) : {};
    return map[address.toLowerCase()] ?? "pending";
  } catch {
    return "pending";
  }
}

export function requestVouch(address: string): void {
  const raw = localStorage.getItem(VOUCH_KEY);
  const map = raw ? (JSON.parse(raw) as Record<string, VouchStatus>) : {};
  map[address.toLowerCase()] = "pending";
  localStorage.setItem(VOUCH_KEY, JSON.stringify(map));
}

/** Demo: simulate approval after 2+ local "vouches" — replace with on-chain group membership */
export function simulateMemberApproval(address: string): void {
  const raw = localStorage.getItem(VOUCH_KEY);
  const map = raw ? (JSON.parse(raw) as Record<string, VouchStatus>) : {};
  map[address.toLowerCase()] = "member";
  localStorage.setItem(VOUCH_KEY, JSON.stringify(map));
}

export function vouchCopy(status: VouchStatus): string {
  switch (status) {
    case "member":
      return `Member of ${historyGuessrGroup.name} — full ${historyGuessrGroup.symbol} rewards.`;
    case "pending":
      return "Awaiting vouch from trusted historians (no KYC — social verification).";
    default:
      return "Connect Circles to request access to the history group.";
  }
}
