import { calculateScore, haversineDistanceKm } from "@/utils/distance";

export function scoreDateGuess(guessYear: number, correctYear: number): number {
  const diff = Math.abs(guessYear - correctYear);
  if (diff === 0) return 1000;
  if (diff > 500) return 0;
  const base = Math.max(0, Math.round(1000 * Math.exp(-diff / 80)));
  if (diff <= 5) return Math.max(base, 950);
  if (diff <= 25) return Math.max(base, 750);
  if (diff <= 75) return Math.max(base, 500);
  return base;
}

export function scoreTimelineOrder(
  guessOrder: string[],
  correctOrder: string[],
): number {
  if (correctOrder.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < correctOrder.length; i++) {
    if (guessOrder[i] === correctOrder[i]) correct++;
  }
  return Math.round((1000 * correct) / correctOrder.length);
}

export function scoreWhoIsIt(cluesRevealed: number, totalClues: number): number {
  const tiers = [1000, 700, 400, 250];
  const index = Math.min(cluesRevealed, tiers.length - 1);
  const base = tiers[index] ?? 150;
  if (cluesRevealed >= totalClues) return Math.min(base, 200);
  return base;
}

export function scoreMcq(correct: boolean): number {
  return correct ? 1000 : 0;
}

export function scoreMapPath(
  guessPoints: { lat: number; lng: number }[],
  steps: { lat: number; lng: number }[],
): number {
  if (steps.length === 0) return 0;
  const used = Math.min(guessPoints.length, steps.length);
  if (used === 0) return 0;

  let total = 0;
  for (let i = 0; i < used; i++) {
    const dist = haversineDistanceKm(
      guessPoints[i].lat,
      guessPoints[i].lng,
      steps[i].lat,
      steps[i].lng,
    );
    total += calculateScore(dist);
  }
  return Math.round(total / used);
}

export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

export function matchWhoIsIt(guess: string, accepted: string[]): boolean {
  const g = normalizeAnswer(guess);
  return accepted.some(
    (a) => g.includes(normalizeAnswer(a)) || normalizeAnswer(a).includes(g),
  );
}
