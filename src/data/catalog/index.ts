import type { CityHistoryChallenge, GameChallenge } from "@/types/game";
import { getCustomChallenge } from "@/lib/challenges/customStorage";
import { baseChallenges } from "./base";
import { avignonPack } from "./avignonPack";
import { parisPack } from "./parisPack";
import { mythsPack } from "./mythsPack";
import { empiresPack } from "./empiresPack";
import { getPack } from "../packs";

export const challengeCatalog: GameChallenge[] = [
  ...baseChallenges,
  ...avignonPack,
  ...parisPack,
  ...mythsPack,
  ...empiresPack,
];

export function getChallengesByType(type: GameChallenge["type"]): GameChallenge[] {
  return challengeCatalog.filter((c) => c.type === type);
}

export function getChallengeById(id: string): GameChallenge | undefined {
  return getCustomChallenge(id) ?? challengeCatalog.find((c) => c.id === id);
}

export function getChallengesByPack(packId: string): GameChallenge[] {
  const pack = getPack(packId);
  if (!pack) return [];
  return pack.challengeIds
    .map((id) => getChallengeById(id))
    .filter((c): c is GameChallenge => Boolean(c));
}

export function pickRandomChallenge(
  type?: GameChallenge["type"],
  excludeId?: string,
): GameChallenge {
  const pool = type ? getChallengesByType(type) : challengeCatalog;
  const filtered = excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
  const list = filtered.length > 0 ? filtered : pool;
  return list[Math.floor(Math.random() * list.length)];
}

export function pickRandomFromPack(packId: string, excludeId?: string): GameChallenge {
  const pool = getChallengesByPack(packId);
  const filtered = excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
  const list = filtered.length > 0 ? filtered : pool;
  if (list.length === 0) return pickRandomChallenge();
  return list[Math.floor(Math.random() * list.length)];
}

export const cityList = [
  "Avignon",
  "Paris",
  "Istanbul",
  "Philadelphia",
  "Rome",
  "London",
] as const;

export function pickCityChallenge(city: string): CityHistoryChallenge | undefined {
  const pool = getChallengesByType("city_history").filter(
    (c): c is CityHistoryChallenge =>
      c.type === "city_history" && c.city === city,
  );
  if (pool.length === 0) {
    const fallback = challengeCatalog.filter(
      (c) =>
        (c.type === "place_guess" || c.type === "city_history") &&
        c.tags.some((t) => t.toLowerCase() === city.toLowerCase()),
    );
    const first = fallback[0];
    if (first && "latitude" in first) {
      return {
        ...first,
        type: "city_history",
        city,
      } as CityHistoryChallenge;
    }
    return undefined;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
