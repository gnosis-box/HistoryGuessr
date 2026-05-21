export type GameState = "home" | "playing" | "result";

export type ChallengeType =
  | "place_guess"
  | "date_guess"
  | "timeline_order"
  | "who_is_it"
  | "quote_guess"
  | "map_path"
  | "image_guess"
  | "battle_guess"
  | "city_history"
  | "source_detective"
  | "friend_challenge";

export type ChallengeStatus =
  | "mvp"
  | "playable_soon"
  | "advanced"
  | "circles_ready";

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert";

export type SourceConfidence =
  | "verified"
  | "probable"
  | "attributed"
  | "uncertain";

export interface ChallengeBase {
  id: string;
  title: string;
  clue: string;
  period?: string;
  answerLabel: string;
  explanation: string;
  sourceLabel?: string;
  sourceUrl?: string;
  sourceConfidence?: SourceConfidence;
  difficulty: ChallengeDifficulty;
  tags: string[];
  status?: ChallengeStatus;
}

export interface GuessCoordinates {
  lat: number;
  lng: number;
}

export interface PlaceGuessChallenge extends ChallengeBase {
  type: "place_guess";
  latitude: number;
  longitude: number;
  year?: number;
}

export interface DateGuessChallenge extends ChallengeBase {
  type: "date_guess";
  correctYear: number;
  yearMin: number;
  yearMax: number;
}

export interface TimelineEvent {
  id: string;
  label: string;
  year: number;
}

export interface TimelineOrderChallenge extends ChallengeBase {
  type: "timeline_order";
  events: TimelineEvent[];
}

export interface WhoIsItChallenge extends ChallengeBase {
  type: "who_is_it";
  clues: string[];
  acceptedAnswers: string[];
}

export interface McqOption {
  id: string;
  label: string;
}

export interface QuoteGuessChallenge extends ChallengeBase {
  type: "quote_guess";
  quote: string;
  options: McqOption[];
  correctOptionId: string;
}

export interface MapPathStep {
  lat: number;
  lng: number;
  label: string;
}

export interface MapPathChallenge extends ChallengeBase {
  type: "map_path";
  steps: MapPathStep[];
}

export interface ImageGuessChallenge extends ChallengeBase {
  type: "image_guess";
  imageUrl: string;
  imageAlt: string;
  options: McqOption[];
  correctOptionId: string;
}

export interface BattleGuessChallenge extends ChallengeBase {
  type: "battle_guess";
  options: McqOption[];
  correctOptionId: string;
  latitude?: number;
  longitude?: number;
}

export interface CityHistoryChallenge extends ChallengeBase {
  type: "city_history";
  city: string;
  latitude: number;
  longitude: number;
}

export interface SourceStatement {
  id: string;
  text: string;
  verdict: "correct" | "misleading" | "false" | "legend";
}

export interface SourceDetectiveChallenge extends ChallengeBase {
  type: "source_detective";
  statements: SourceStatement[];
  targetVerdict: SourceStatement["verdict"];
}

export interface FriendChallenge extends ChallengeBase {
  type: "friend_challenge";
  opponentName: string;
  opponentScore: number;
  latitude: number;
  longitude: number;
}

export type GameChallenge =
  | PlaceGuessChallenge
  | DateGuessChallenge
  | TimelineOrderChallenge
  | WhoIsItChallenge
  | QuoteGuessChallenge
  | MapPathChallenge
  | ImageGuessChallenge
  | BattleGuessChallenge
  | CityHistoryChallenge
  | SourceDetectiveChallenge
  | FriendChallenge;

/** @deprecated Use GameChallenge */
export type HistoricalChallenge = GameChallenge;

export interface PlayResult {
  score: number;
  summary: string;
}

export function isPlaceGuessChallenge(
  challenge: GameChallenge,
): challenge is PlaceGuessChallenge {
  return challenge.type === "place_guess";
}
