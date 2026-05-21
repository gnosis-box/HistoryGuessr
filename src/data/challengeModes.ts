import type { ChallengeDifficulty, ChallengeStatus, ChallengeType } from "@/types/game";

export interface ChallengeMode {
  type: ChallengeType;
  name: string;
  tagline: string;
  description: string;
  example: string;
  status: ChallengeStatus;
  difficulty: ChallengeDifficulty;
  circlesUseCase?: string;
}

export const challengeModes: ChallengeMode[] = [
  {
    type: "place_guess",
    name: "Place Guess",
    tagline: "Locate where history happened",
    description:
      "Read a historical clue and click the map to guess the location. Distance drives your score.",
    example:
      "“In 1309, the seat of Western Christianity moved here, reshaping medieval Europe.” → Avignon",
    status: "mvp",
    difficulty: "easy",
    circlesUseCase: "Share scores with friends; local city quest packs",
  },
  {
    type: "date_guess",
    name: "Date Guess",
    tagline: "Pin the year on the timeline",
    description:
      "Given an event, guess the year or pick a date on a timeline. Closer dates earn more points.",
    example:
      "“The city of Constantinople fell to the Ottoman Empire.” → 1453",
    status: "mvp",
    difficulty: "medium",
  },
  {
    type: "timeline_order",
    name: "Timeline Order",
    tagline: "Put events in sequence",
    description:
      "Receive several events and arrange them in the correct chronological order.",
    example:
      "Order: Fall of Constantinople (1453), Columbus (1492), Luther’s Theses (1517), French Revolution (1789)",
    status: "mvp",
    difficulty: "medium",
  },
  {
    type: "who_is_it",
    name: "Who Is It?",
    tagline: "Identify the historical figure",
    description:
      "Progressive clues reveal a person from history. Answer earlier for a higher score.",
    example:
      "Born on a Mediterranean island → became emperor → defeated in 1815 → Napoleon Bonaparte",
    status: "mvp",
    difficulty: "medium",
  },
  {
    type: "quote_guess",
    name: "Quote Guess",
    tagline: "Match quotations to their authors",
    description:
      "Match a quotation to its author, context, or era. Sources and certainty levels are shown.",
    example:
      "“I am not afraid… I was born to do this.” → attributed to Joan of Arc",
    status: "mvp",
    difficulty: "hard",
    circlesUseCase: "Reward curators who verify attributed vs verified quotes",
  },
  {
    type: "map_path",
    name: "Map Path",
    tagline: "Reconstruct a journey",
    description:
      "Place points on a map to trace an expedition, migration, or military campaign in order.",
    example:
      "Reconstruct Napoleon’s route from Elba to Paris during the Hundred Days",
    status: "mvp",
    difficulty: "expert",
  },
  {
    type: "image_guess",
    name: "Image Guess",
    tagline: "Read the visual archive",
    description:
      "Study a painting, photograph, map, or monument — guess place, date, event, or subject.",
    example:
      "The Tennis Court Oath painting → French Revolution, 1789, Versailles area",
    status: "mvp",
    difficulty: "hard",
  },
  {
    type: "battle_guess",
    name: "Battle Guess",
    tagline: "Name the decisive moment",
    description:
      "Military and geopolitical clues point to a battle — name it, place it, or date it.",
    example:
      "“A decisive battle in 1815 ended a French emperor’s ambitions.” → Waterloo",
    status: "mvp",
    difficulty: "medium",
  },
  {
    type: "city_history",
    name: "City History",
    tagline: "Play a place’s memory",
    description:
      "Choose a city and explore themed local quests — ideal for communities and Groups.",
    example:
      "Avignon: papacy, Palais des Papes, Pont Saint-Bénézet, Grand Schisme",
    status: "mvp",
    difficulty: "medium",
    circlesUseCase: "Local Groups mint shared currency; city packs as community content",
  },
  {
    type: "source_detective",
    name: "Source Detective",
    tagline: "Spot the weak claim",
    description:
      "Compare statements and flag what is sourced, doubtful, anachronistic, or legendary.",
    example:
      "Which claim is misleading? “Napoleon was unusually short” vs crowned at Notre-Dame vs born in Corsica",
    status: "mvp",
    difficulty: "expert",
    circlesUseCase: "Trust graph validates sources; Talaria-style data layer",
  },
  {
    type: "friend_challenge",
    name: "Friend Challenge",
    tagline: "Beat someone you trust",
    description:
      "Send the same challenge to a peer from your Circles trust graph and compare scores.",
    example:
      "“I scored 842/1000 on Avignon. Can you beat me?”",
    status: "mvp",
    difficulty: "easy",
    circlesUseCase: "Trust graph challenges, leaderboards, symbolic CRC rewards",
  },
];
