/** History Guessr group currency — configure when the on-chain group exists. */
export const historyGuessrGroup = {
  symbol: "HIST",
  name: "History Guessr",
  description:
    "Group currency for cultural contribution: quests, sources, curation, learning.",
  /** Set via VITE_HIST_GROUP_ADDRESS when your Circles Group is deployed */
  groupAddress: import.meta.env.VITE_HIST_GROUP_ADDRESS as string | undefined,
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
