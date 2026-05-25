// src/lib/circles/ledgerExport.ts
import { loadLedger } from "./rewards";

export interface HistLedgerExport {
  v: 1;
  playerAddress: string | null;
  exportedAt: string;
  pending: number;
  claimed: number;
  totalEarned: number;
  entries: ReturnType<typeof loadLedger>["entries"];
}

export function buildHistLedgerExport(
  playerAddress: string | null,
): HistLedgerExport {
  const ledger = loadLedger();
  return {
    v: 1,
    playerAddress,
    exportedAt: new Date().toISOString(),
    pending: ledger.pending,
    claimed: ledger.claimed,
    totalEarned: ledger.totalEarned,
    entries: ledger.entries,
  };
}

export function downloadHistLedgerExport(playerAddress: string | null): void {
  const payload = buildHistLedgerExport(playerAddress);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `hist-ledger-export-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
