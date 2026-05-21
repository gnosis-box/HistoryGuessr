import type { ChallengeType } from "@/types/game";

export type ModeCategoryId = "map" | "memory" | "critical";

export interface ModeCategory {
  id: ModeCategoryId;
  name: string;
  tagline: string;
  types: ChallengeType[];
}

export const modeCategories: ModeCategory[] = [
  {
    id: "map",
    name: "Map challenges",
    tagline: "Locate battles, cities, routes and duels on the map.",
    types: ["place_guess", "city_history", "map_path", "friend_challenge"],
  },
  {
    id: "memory",
    name: "Memory challenges",
    tagline: "Dates, timelines, figures and quotations.",
    types: ["date_guess", "timeline_order", "who_is_it", "quote_guess"],
  },
  {
    id: "critical",
    name: "Critical challenges",
    tagline: "Images, battles, and claims worth doubting.",
    types: ["source_detective", "image_guess", "battle_guess"],
  },
];

export function categoryForType(type: ChallengeType): ModeCategoryId {
  for (const cat of modeCategories) {
    if (cat.types.includes(type)) return cat.id;
  }
  return "memory";
}
