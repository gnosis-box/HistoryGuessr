/** Bypass trust gate (set VITE_DEV_RELAX_TRUST=true on Vercel for Garage demos). */
export const devRelaxTrust =
  import.meta.env.VITE_DEV_RELAX_TRUST === "true";

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

/** Injected at build time from VITE_HIST_GROUP_ADDRESS (.env.local or Vercel env). */
export function parseHistGroupAddress(
  raw: string | undefined,
): string | undefined {
  if (raw == null || raw === "") return undefined;
  const trimmed = String(raw).trim();
  if (!ADDRESS_RE.test(trimmed)) return undefined;
  return trimmed;
}

const histGroupAddress = parseHistGroupAddress(
  import.meta.env.VITE_HIST_GROUP_ADDRESS,
);

/** History Guessr group currency — mint/redeem via member CRC collateral ([Circles docs](https://docs.aboutcircles.com/overview/how-it-works/group-currencies.md)). */
export const historyGuessrGroup = {
  symbol: "HIST",
  name: "History Guessr",
  description:
    "Group currency for cultural contribution: quests, sources, curation, learning.",
  /** Set via VITE_HIST_GROUP_ADDRESS when your Circles Group is deployed */
  groupAddress: histGroupAddress,
  /** Gnosis Group — recommended trust anchor (Sandipan) */
  gnosisGroupAddress:
    "0xc19bc204eb1c1d5b3fe500e5e5dfabab625f286c" as const,
  trustAnalyticsBase:
    "https://squid-app-3gxnl.ondigitalocean.app/aboutcircles-advanced-analytics2",
} as const;

export const rewardPolicy = {
  minScoreToEarn: 400,
  maxRewardsPerDay: 30,
  minTrustScore: 0.05,
  minPenetrationTargets: 1,
  /** Source detective & high-value modes need stronger trust */
  strictModes: ["source_detective", "map_path"] as const,
  strictMinTrustScore: 0.15,
} as const;
