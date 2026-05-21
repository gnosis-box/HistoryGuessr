export interface CirclesProfile {
  address: string;
  name?: string;
  avatarUrl?: string;
  crcBalance?: number;
  trustConnections?: number;
  /** Accrued group currency (HIST) — local ledger until on-chain claim */
  groupCurrencyBalance?: number;
  groupCurrencySymbol?: string;
}
