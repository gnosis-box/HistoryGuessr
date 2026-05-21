export type CommunityVisibility = "private" | "discoverable";

export interface Community {
  id: string;
  name: string;
  description: string;
  visibility: CommunityVisibility;
  founderAddress: string;
  inviteAddresses: string[];
  createdAt: string;
}

export interface CommunityQuiz {
  id: string;
  communityId: string;
  title: string;
  description: string;
  challengeIds: string[];
  createdAt: string;
  createdBy: string;
}

export const MAX_QUIZ_QUESTIONS = 5;
export const MIN_QUIZ_QUESTIONS = 1;
