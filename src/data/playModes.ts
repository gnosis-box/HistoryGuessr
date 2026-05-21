import type { ChallengeType } from "@/types/game";

export interface PlayModeNavItem {
  type: ChallengeType;
  label: string;
  hint: string;
  description: string;
  needsCityPick?: boolean;
}

export interface PlayModeGroup {
  id: string;
  label: string;
  tagline: string;
  modes: PlayModeNavItem[];
}

export const playModeGroups: PlayModeGroup[] = [
  {
    id: "map",
    label: "Map",
    tagline: "Place history on the world map — cities, routes and duels.",
    modes: [
      {
        type: "place_guess",
        label: "Place",
        hint: "Place an event on the map",
        description:
          "Read a clue and click where it happened. Your score depends on distance to the real location.",
      },
      {
        type: "city_history",
        label: "Cities",
        hint: "Local quest in a city",
        description:
          "Pick a city, then locate a landmark or episode in its streets on the map.",
        needsCityPick: true,
      },
      {
        type: "map_path",
        label: "Route",
        hint: "Trace a journey on the map",
        description:
          "Drop points in order to reconstruct a march, migration or campaign route.",
      },
      {
        type: "friend_challenge",
        label: "Duel",
        hint: "Beat a friend's score on the map",
        description:
          "Same map challenge as a friend — beat their score in your trust circle.",
      },
    ],
  },
  {
    id: "time",
    label: "Time",
    tagline: "Dates and chronology — when did the past unfold?",
    modes: [
      {
        type: "date_guess",
        label: "Year",
        hint: "Guess the year on a timeline",
        description:
          "Slide along a timeline to pin the year of an event. The closer you are, the higher you score.",
      },
      {
        type: "timeline_order",
        label: "Timeline",
        hint: "Order events on a chronology",
        description:
          "Several events appear out of order — arrange them from earliest to latest.",
      },
    ],
  },
  {
    id: "people",
    label: "People",
    tagline: "Figures and voices — who shaped history?",
    modes: [
      {
        type: "who_is_it",
        label: "Figure",
        hint: "Guess the historical figure",
        description:
          "Clues reveal themselves one by one. Name the person early to keep a high score.",
      },
      {
        type: "quote_guess",
        label: "Quote",
        hint: "Match a quote to its author",
        description:
          "A famous line — choose who said it and see how certain the source is.",
      },
    ],
  },
  {
    id: "verify",
    label: "Verify",
    tagline: "Images, battles and sources — what can you trust?",
    modes: [
      {
        type: "source_detective",
        label: "Sources",
        hint: "Spot myths and weak claims",
        description:
          "Three statements — pick the myth, propaganda, or oversimplification hiding among the facts.",
      },
      {
        type: "image_guess",
        label: "Image",
        hint: "Read a historical image",
        description:
          "A painting or photograph — identify the event, place or period it captures.",
      },
      {
        type: "battle_guess",
        label: "Battle",
        hint: "Name the battle",
        description:
          "Military clues point to a decisive clash — choose the battle that matches.",
      },
    ],
  },
];

export const allPlayModes: PlayModeNavItem[] = playModeGroups.flatMap(
  (g) => g.modes,
);

export function getPlayModeGroup(id: string): PlayModeGroup | undefined {
  return playModeGroups.find((g) => g.id === id);
}

export function getPlayModeLabel(type: ChallengeType): string {
  return allPlayModes.find((m) => m.type === type)?.label ?? type;
}

export function getPlayModeHint(type: ChallengeType): string {
  return allPlayModes.find((m) => m.type === type)?.hint ?? "";
}

export function groupForMode(type: ChallengeType): string | undefined {
  return playModeGroups.find((g) => g.modes.some((m) => m.type === type))?.id;
}
