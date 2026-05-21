import { getChallengeById } from "./catalog";
import type { GameChallenge } from "@/types/game";

export interface HistoricalCampaign {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  era: string;
  steps: { label: string; challengeId: string }[];
  accent: "gold" | "map" | "critical";
}

export const historicalCampaigns: HistoricalCampaign[] = [
  {
    id: "avignon-popes",
    title: "Avignon — Century of the Popes",
    subtitle: "From papal seat to palace and sources",
    description:
      "Trace the Avignon papacy: place the city, explore landmarks, date Clement V, order the schism, vouch sources.",
    era: "14th century · France",
    accent: "gold",
    steps: [
      { label: "Place the papal city", challengeId: "avignon-papacy" },
      { label: "Palais des Papes", challengeId: "city-avignon-palais" },
      { label: "Pont Saint-Bénézet", challengeId: "place-avignon-bridge" },
      { label: "Date the move (1309)", challengeId: "date-avignon-papacy" },
      { label: "Who wrote from Babylon?", challengeId: "who-petrarch-avignon" },
      { label: "Order the schism", challengeId: "timeline-schism" },
      { label: "Source check", challengeId: "source-avignon-walls" },
      { label: "Beat your circle", challengeId: "friend-avignon" },
    ],
  },
  {
    id: "napoleon-arc",
    title: "Napoleon — Corsica to Waterloo",
    subtitle: "Figure, coronation, march, battle, myth",
    description:
      "Follow Napoleon from mystery clues to Notre-Dame, the Hundred Days route, Austerlitz, Waterloo, and propaganda myths.",
    era: "18th–19th century · Europe",
    accent: "map",
    steps: [
      { label: "Who am I?", challengeId: "who-napoleon" },
      { label: "Coronation", challengeId: "napoleon-coronation" },
      { label: "Hundred Days path", challengeId: "path-napoleon-hundred-days" },
      { label: "Austerlitz", challengeId: "battle-austerlitz" },
      { label: "Waterloo", challengeId: "battle-waterloo" },
      { label: "Myth or fact?", challengeId: "source-napoleon-height" },
    ],
  },
  {
    id: "myths-lies",
    title: "Myths & Lies",
    subtitle: "What can you trust?",
    description:
      "Signature critical path: myths, propaganda, misattributions, and simplifications across history.",
    era: "Critical thinking",
    accent: "critical",
    steps: [
      { label: "Napoleon's height (propaganda)", challengeId: "source-napoleon-height" },
      { label: "Viking helmets", challengeId: "source-vikings" },
      { label: "Newton's apple", challengeId: "source-newton-apple" },
      { label: "Galileo's last words", challengeId: "source-galileo-towers" },
      { label: "Let them eat cake", challengeId: "source-marie-brioche" },
      { label: "Dark Ages myth", challengeId: "source-dark-ages" },
    ],
  },
];

export function getCampaign(id: string): HistoricalCampaign | undefined {
  return historicalCampaigns.find((c) => c.id === id);
}

export function getCampaignChallenges(id: string): GameChallenge[] {
  const campaign = getCampaign(id);
  if (!campaign) return [];
  return campaign.steps
    .map((s) => getChallengeById(s.challengeId))
    .filter((c): c is GameChallenge => Boolean(c));
}
