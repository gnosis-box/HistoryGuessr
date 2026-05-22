import type {
  ChallengeDifficulty,
  ChallengeType,
  SourceClaimCategory,
  SourceStatementVerdict,
} from "@/types/game";

export type BuilderChallengeType = Exclude<ChallengeType, "friend_challenge">;

export interface DraftMcqOption {
  id: string;
  label: string;
}

export interface DraftTimelineEvent {
  id: string;
  label: string;
  year: number;
}

export interface DraftMapStep {
  lat: number;
  lng: number;
  label: string;
}

export interface DraftSourceStatement {
  id: string;
  text: string;
  verdict: SourceStatementVerdict;
}

export interface ChallengeDraft {
  type: BuilderChallengeType;
  title: string;
  clue: string;
  period: string;
  answerLabel: string;
  explanation: string;
  difficulty: ChallengeDifficulty;
  tags: string;
  latitude: number;
  longitude: number;
  city: string;
  correctYear: number;
  yearMin: number;
  yearMax: number;
  clues: string;
  acceptedAnswers: string;
  quote: string;
  options: DraftMcqOption[];
  correctOptionId: string;
  imageUrl: string;
  imageAlt: string;
  events: DraftTimelineEvent[];
  steps: DraftMapStep[];
  statements: DraftSourceStatement[];
  targetVerdict: SourceStatementVerdict;
  claimCategory: SourceClaimCategory;
}

export function emptyDraft(type: BuilderChallengeType): ChallengeDraft {
  return {
    type,
    title: "",
    clue: "",
    period: "",
    answerLabel: "",
    explanation: "",
    difficulty: "medium",
    tags: "",
    latitude: 48.8566,
    longitude: 2.3522,
    city: "Paris",
    correctYear: 1789,
    yearMin: 1000,
    yearMax: 2025,
    clues: "",
    acceptedAnswers: "",
    quote: "",
    options: [
      { id: "opt-1", label: "" },
      { id: "opt-2", label: "" },
      { id: "opt-3", label: "" },
    ],
    correctOptionId: "opt-1",
    imageUrl: "https://placekitten.com/800/500",
    imageAlt: "Historical image",
    events: [
      { id: "ev-1", label: "", year: 1000 },
      { id: "ev-2", label: "", year: 1500 },
      { id: "ev-3", label: "", year: 1900 },
    ],
    steps: [
      { lat: 48.85, lng: 2.35, label: "Step 1" },
      { lat: 45.75, lng: 4.85, label: "Step 2" },
    ],
    statements: [
      { id: "st-1", text: "", verdict: "correct" },
      { id: "st-2", text: "", verdict: "myth" },
      { id: "st-3", text: "", verdict: "misleading" },
    ],
    targetVerdict: "myth",
    claimCategory: "myth",
  };
}
