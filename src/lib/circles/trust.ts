import { devRelaxTrust, historyGuessrGroup } from "./config";

export interface TrustGateResult {
  relativeScore: number;
  targetsReached: number;
  totalTargets: number;
  penetrationRate: number;
  passesGate: boolean;
  source: "analytics" | "fallback";
}

export async function fetchTrustGate(
  avatarAddress: string,
): Promise<TrustGateResult> {
  if (devRelaxTrust) {
    return {
      relativeScore: 1,
      targetsReached: 1,
      totalTargets: 1,
      penetrationRate: 1,
      passesGate: true,
      source: "fallback",
    };
  }

  const targets = [
    historyGuessrGroup.gnosisGroupAddress,
    ...(historyGuessrGroup.groupAddress
      ? [historyGuessrGroup.groupAddress]
      : []),
  ];

  const url = `${historyGuessrGroup.trustAnalyticsBase}/scoring/relative_trustscore/generic`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatars: [avatarAddress],
        target_set: targets,
        include_details: false,
      }),
    });

    if (!res.ok) throw new Error(`Trust API ${res.status}`);

    const data = (await res.json()) as {
      results?: Array<{
        address: string;
        relative_score: number;
        targets_reached: number;
        total_targets: number;
        penetration_rate: number;
      }>;
    };

    const row = data.results?.[0];
    if (!row) throw new Error("No trust result");

    return {
      relativeScore: row.relative_score,
      targetsReached: row.targets_reached,
      totalTargets: row.total_targets,
      penetrationRate: row.penetration_rate,
      passesGate:
        row.relative_score >= 0.05 ||
        row.targets_reached >= 1 ||
        row.penetration_rate > 0,
      source: "analytics",
    };
  } catch {
    return {
      relativeScore: 0,
      targetsReached: 0,
      totalTargets: targets.length,
      penetrationRate: 0,
      passesGate: false,
      source: "fallback",
    };
  }
}
