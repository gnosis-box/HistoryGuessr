// src/lib/communities/shareBundle.ts
import type { Community, CommunityQuiz } from "@/types/community";
import type { StoredCustomChallenge } from "@/lib/challenges/customStorage";
import { getChallengeById } from "@/data/catalog";
import { getCommunity, getQuiz, saveCommunity, saveQuiz } from "./storage";
import { saveCustomChallenge } from "@/lib/challenges/customStorage";

export interface QuizShareBundle {
  v: 1;
  community: Community;
  quiz: CommunityQuiz;
  customChallenges: StoredCustomChallenge[];
}

function toBase64Url(json: string): string {
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return decodeURIComponent(escape(atob(b64)));
}

export function buildQuizShareBundle(
  communityId: string,
  quizId: string,
  customForCommunity: StoredCustomChallenge[],
): QuizShareBundle | null {
  const community = getCommunity(communityId);
  const quiz = getQuiz(quizId);
  if (!community || !quiz || quiz.communityId !== communityId) return null;

  const needed = new Set(quiz.challengeIds);
  const customChallenges = customForCommunity.filter((c) => needed.has(c.id));

  return { v: 1, community, quiz, customChallenges };
}

export function encodeQuizShareBundle(bundle: QuizShareBundle): string {
  return toBase64Url(JSON.stringify(bundle));
}

export function decodeQuizShareBundle(encoded: string): QuizShareBundle | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as QuizShareBundle;
    if (parsed.v !== 1 || !parsed.community?.id || !parsed.quiz?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist a portable bundle so invite links work on any device/browser. */
export function importQuizShareBundle(bundle: QuizShareBundle): {
  communityId: string;
  quizId: string;
} {
  saveCommunity(bundle.community);
  saveQuiz(bundle.quiz);
  for (const custom of bundle.customChallenges) {
    saveCustomChallenge(custom);
  }
  return { communityId: bundle.community.id, quizId: bundle.quiz.id };
}

export function resolveQuizFromShare(
  communityId: string,
  quizId: string,
): { community: Community; quiz: CommunityQuiz; challengeIds: string[] } | null {
  const community = getCommunity(communityId);
  const quiz = getQuiz(quizId);
  if (!community || !quiz || quiz.communityId !== communityId) return null;

  const challengeIds = quiz.challengeIds.filter((id) => getChallengeById(id));
  if (challengeIds.length === 0) return null;

  return { community, quiz, challengeIds };
}
