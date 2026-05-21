import type { Community, CommunityQuiz } from "@/types/community";

const COMMUNITIES_KEY = "history-guessr-communities";
const QUIZZES_KEY = "history-guessr-community-quizzes";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function normalizeAddress(addr: string): string {
  return addr.trim().toLowerCase();
}

export function loadCommunities(): Community[] {
  return loadJson<Community[]>(COMMUNITIES_KEY, []);
}

export function saveCommunity(community: Community): Community[] {
  const list = loadCommunities();
  const idx = list.findIndex((c) => c.id === community.id);
  const next =
    idx >= 0
      ? list.map((c, i) => (i === idx ? community : c))
      : [community, ...list];
  saveJson(COMMUNITIES_KEY, next);
  return next;
}

export function getCommunity(id: string): Community | undefined {
  return loadCommunities().find((c) => c.id === id);
}

export function loadQuizzes(): CommunityQuiz[] {
  return loadJson<CommunityQuiz[]>(QUIZZES_KEY, []);
}

export function getQuizzesForCommunity(communityId: string): CommunityQuiz[] {
  return loadQuizzes().filter((q) => q.communityId === communityId);
}

export function getQuiz(quizId: string): CommunityQuiz | undefined {
  return loadQuizzes().find((q) => q.id === quizId);
}

export function saveQuiz(quiz: CommunityQuiz): CommunityQuiz[] {
  const list = loadQuizzes();
  const idx = list.findIndex((q) => q.id === quiz.id);
  const next =
    idx >= 0 ? list.map((q, i) => (i === idx ? quiz : q)) : [quiz, ...list];
  saveJson(QUIZZES_KEY, next);
  return next;
}

export function createCommunityId(): string {
  return `comm-${crypto.randomUUID().slice(0, 8)}`;
}

export function createQuizId(): string {
  return `quiz-${crypto.randomUUID().slice(0, 8)}`;
}
