import type { HonorificBadge } from "./types";

const tierRank = { bronze: 0, silver: 1, gold: 2, legendary: 3 };

/** Not purchasable — earned through strong play only */
export const honorificBadges: HonorificBadge[] = [
  {
    id: "archivist",
    title: "Archivist",
    epithet: "The manuscripts already lean toward you.",
    tier: "gold",
    minScore: 940,
    minRounds: 8,
  },
  {
    id: "cartographer",
    title: "Cartographer",
    epithet: "Your fingers know the shape of the world.",
    tier: "gold",
    modes: ["place_guess", "map_path", "city_history"],
    minScore: 900,
    minRounds: 5,
  },
  {
    id: "source-hunter",
    title: "Source Hunter",
    epithet: "You smell a weak claim three centuries away.",
    tier: "legendary",
    modes: ["source_detective", "quote_guess"],
    minScore: 970,
    minRounds: 6,
  },
  {
    id: "debater",
    title: "Debater",
    epithet: "Socrates would ask for your sources — respectfully.",
    tier: "silver",
    modes: ["source_detective", "quote_guess", "who_is_it"],
    minScore: 880,
    minRounds: 4,
  },
  {
    id: "curator",
    title: "Curator",
    epithet: "The pantheon leaves you a key on Thursdays.",
    tier: "gold",
    minScore: 920,
    minRounds: 12,
  },
  {
    id: "confirmed-historian",
    title: "Confirmed Historian",
    epithet: "Dates obey you. Legends change the subject.",
    tier: "legendary",
    minScore: 990,
    minRounds: 10,
  },
  {
    id: "human-chronometer",
    title: "Human Chronometer",
    epithet: "1453? You lived it before the rest of the world.",
    tier: "gold",
    modes: ["date_guess", "timeline_order"],
    minScore: 900,
    minRounds: 5,
  },
  {
    id: "shadow-seer",
    title: "Shadow Seer",
    epithet: "One clue is enough. Two is generosity.",
    tier: "legendary",
    modes: ["who_is_it"],
    minScore: 950,
    minRounds: 4,
  },
  {
    id: "courteous-duelist",
    title: "Courteous Duelist",
    epithet: "You beat your friends with elegance and maps.",
    tier: "gold",
    modes: ["friend_challenge"],
    minScore: 920,
    minRounds: 3,
  },
  {
    id: "curators-eye",
    title: "Curator's Eye",
    epithet: "One engraving, one canvas — you see the event.",
    tier: "gold",
    modes: ["image_guess"],
    minScore: 900,
    minRounds: 4,
  },
  {
    id: "field-strategist",
    title: "Field Strategist",
    epithet: "Waterloo sends you invitations.",
    tier: "silver",
    modes: ["battle_guess"],
    minScore: 900,
    minRounds: 4,
  },
  {
    id: "path-conqueror",
    title: "Path Conqueror",
    epithet: "Napoleon asks you for directions.",
    tier: "legendary",
    modes: ["map_path"],
    minScore: 920,
    minRounds: 5,
  },
];

export const prestigeTitles: HonorificBadge[] = [
  {
    id: "title-novice",
    title: "Curious of the Past",
    epithet: "The journey begins.",
    tier: "bronze",
  },
  {
    id: "title-scholar",
    title: "Scholar in the Making",
    epithet: "The archives watch you with hope.",
    tier: "silver",
  },
  {
    id: "title-master",
    title: "Master of Memory",
    epithet: "The centuries hold the door for you.",
    tier: "gold",
  },
  {
    id: "title-legend",
    title: "Keeper of Centuries",
    epithet: "They will cite you. With sources.",
    tier: "legendary",
  },
];

export function getBadgeById(id: string): HonorificBadge | undefined {
  return (
    honorificBadges.find((b) => b.id === id) ??
    prestigeTitles.find((b) => b.id === id)
  );
}

export function badgeTierRank(tier: HonorificBadge["tier"]): number {
  return tierRank[tier];
}
