import { challengeCatalog } from "./catalog";
import type { GameChallenge } from "@/types/game";

const STREAK_KEY = "history-guessr-daily-streak";
const LAST_PLAY_KEY = "history-guessr-daily-last";

function dayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export function getDailyChallenge(): GameChallenge {
  const pool = challengeCatalog.filter((c) => c.type !== "friend_challenge");
  return pool[dayIndex() % pool.length];
}

export function getDailyArchiveNumber(): number {
  return (dayIndex() % 900) + 100;
}

export interface DailyStreakState {
  streak: number;
  lastPlayedDay: number | null;
}

export function loadDailyStreak(): DailyStreakState {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const last = localStorage.getItem(LAST_PLAY_KEY);
    return {
      streak: raw ? Number.parseInt(raw, 10) : 0,
      lastPlayedDay: last ? Number.parseInt(last, 10) : null,
    };
  } catch {
    return { streak: 0, lastPlayedDay: null };
  }
}

export function recordDailyPlay(): DailyStreakState {
  const today = dayIndex();
  const prev = loadDailyStreak();
  let streak = 1;
  if (prev.lastPlayedDay === today) {
    streak = prev.streak;
  } else if (prev.lastPlayedDay === today - 1) {
    streak = prev.streak + 1;
  }
  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_PLAY_KEY, String(today));
  return { streak, lastPlayedDay: today };
}
