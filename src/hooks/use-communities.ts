import { useCallback, useState } from "react";
import type { Community, CommunityQuiz } from "@/types/community";
import {
  createCommunityId,
  createQuizId,
  getCommunity,
  getQuiz,
  getQuizzesForCommunity,
  loadCommunities,
  loadQuizzes,
  normalizeAddress,
  saveCommunity,
  saveQuiz,
} from "@/lib/communities/storage";

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>(() =>
    loadCommunities(),
  );
  const [quizzes, setQuizzes] = useState<CommunityQuiz[]>(() => loadQuizzes());

  const refresh = useCallback(() => {
    setCommunities(loadCommunities());
    setQuizzes(loadQuizzes());
  }, []);

  const addCommunity = useCallback(
    (input: Omit<Community, "id" | "createdAt">) => {
      const community: Community = {
        ...input,
        id: createCommunityId(),
        createdAt: new Date().toISOString(),
        founderAddress: normalizeAddress(input.founderAddress),
        inviteAddresses: input.inviteAddresses.map(normalizeAddress),
      };
      setCommunities(saveCommunity(community));
      return community;
    },
    [],
  );

  const addQuiz = useCallback(
    (input: Omit<CommunityQuiz, "id" | "createdAt">) => {
      const quiz: CommunityQuiz = {
        ...input,
        id: createQuizId(),
        createdAt: new Date().toISOString(),
        createdBy: normalizeAddress(input.createdBy),
      };
      setQuizzes(saveQuiz(quiz));
      return quiz;
    },
    [],
  );

  return {
    communities,
    quizzes,
    refresh,
    addCommunity,
    addQuiz,
    getCommunity,
    getQuiz,
    getQuizzesForCommunity,
  };
}
