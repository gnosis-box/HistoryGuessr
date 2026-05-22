import type { GameChallenge } from "@/types/game";

const KEY = "history-guessr-custom-challenges";

export interface StoredCustomChallenge {
  id: string;
  communityId: string;
  createdBy: string;
  createdAt: string;
  challenge: GameChallenge;
}

function loadAll(): StoredCustomChallenge[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredCustomChallenge[];
  } catch {
    return [];
  }
}

function saveAll(list: StoredCustomChallenge[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function createCustomChallengeId(): string {
  return `custom-${crypto.randomUUID().slice(0, 10)}`;
}

export function getCustomChallenge(id: string): GameChallenge | undefined {
  return loadAll().find((r) => r.id === id)?.challenge;
}

export function getCustomChallengesForCommunity(
  communityId: string,
): StoredCustomChallenge[] {
  return loadAll().filter((r) => r.communityId === communityId);
}

export function saveCustomChallenge(
  record: StoredCustomChallenge,
): StoredCustomChallenge {
  const list = loadAll();
  const idx = list.findIndex((r) => r.id === record.id);
  const next =
    idx >= 0 ? list.map((r, i) => (i === idx ? record : r)) : [record, ...list];
  saveAll(next);
  return record;
}
